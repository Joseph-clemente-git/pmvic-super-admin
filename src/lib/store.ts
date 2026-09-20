"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppNotification,
  AppUser,
  Branch,
  DailyReport,
  NotificationKind,
  Organization,
  ReportRecipients,
  Role,
  Session,
  Transaction,
} from "@/types";
import {
  DEMO_CREDENTIALS,
  seedBranches,
  seedNotifications,
  seedOrganizations,
  seedReportRecipients,
  seedReports,
  seedTransactions,
  seedUsers,
} from "@/lib/seed-data";

const SESSION_COOKIE = "pmvic_session";

function setSessionCookie(session: Session | null) {
  if (typeof document === "undefined") return;
  if (!session) {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    return;
  }
  const value = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeNotification(kind: NotificationKind, title: string, description: string): AppNotification {
  return {
    id: genId("notif"),
    kind,
    title,
    description,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

interface AppState {
  hasHydrated: boolean;
  session: Session | null;
  organizations: Organization[];
  branches: Branch[];
  users: AppUser[];
  transactions: Transaction[];
  reports: DailyReport[];
  reportRecipients: ReportRecipients;
  notifications: AppNotification[];

  setHasHydrated: (v: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  login: (email: string, password: string) => { ok: true; session: Session } | { ok: false; error: string };
  logout: () => void;

  addOrganization: (input: {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  }) => Organization;
  updateOrganization: (id: string, patch: Partial<Organization>) => void;
  setOrganizationStatus: (id: string, status: "active" | "inactive") => void;

  addBranch: (orgId: string, input: { name: string; address: string }) => Branch;
  updateBranch: (id: string, patch: Partial<Branch>) => void;
  setBranchStatus: (id: string, status: "active" | "inactive") => void;

  inviteUser: (input: { name: string; email: string; role: Role; orgId: string | null; branchId: string | null }) => AppUser;
  updateUserRole: (id: string, role: Role) => void;
  setUserStatus: (id: string, status: "active" | "inactive") => void;
  resendInvite: (id: string) => void;

  remitPayment: (input: {
    branchId: string;
    amount: number;
    description: string;
    createdBy: string;
  }) => { ok: true } | { ok: false; error: string };

  removeRemittanceTag: (branchId: string) => void;

  updateReportRecipients: (patch: Partial<ReportRecipients>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      session: null,
      organizations: seedOrganizations(),
      branches: seedBranches(),
      users: seedUsers(),
      transactions: seedTransactions(),
      reports: seedReports(),
      reportRecipients: seedReportRecipients(),
      notifications: seedNotifications(),

      setHasHydrated: (v) => set({ hasHydrated: v }),

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) }));
      },

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();

        if (
          normalized !== DEMO_CREDENTIALS.superadmin.email ||
          password !== DEMO_CREDENTIALS.superadmin.password
        ) {
          return { ok: false, error: "Invalid email or password. Please use the demo SuperAdmin account." };
        }

        const user = get().users.find((u) => u.email.toLowerCase() === normalized);
        const session: Session = {
          userId: user?.id ?? genId("user"),
          role: "superadmin",
          orgId: null,
          name: "Super Admin",
          email: normalized,
        };

        set((state) => ({
          session,
          users: state.users.map((u) =>
            u.email.toLowerCase() === normalized ? { ...u, lastLoginAt: new Date().toISOString() } : u,
          ),
        }));
        setSessionCookie(session);
        return { ok: true, session };
      },

      logout: () => {
        set({ session: null });
        setSessionCookie(null);
      },

      addOrganization: (input) => {
        const org: Organization = {
          id: genId("org"),
          code: `PMVIC-${String(get().organizations.length + 1).padStart(4, "0")}`,
          name: input.name,
          address: input.address,
          contactPerson: input.contactPerson,
          email: input.email,
          phone: input.phone,
          status: "active",
          linkedAccountRef: `GL-ACC-${Math.floor(100000 + Math.random() * 899999)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ organizations: [org, ...state.organizations] }));
        return org;
      },

      updateOrganization: (id, patch) => {
        set((state) => ({
          organizations: state.organizations.map((o) => (o.id === id ? { ...o, ...patch } : o)),
        }));
      },

      setOrganizationStatus: (id, status) => {
        set((state) => ({
          organizations: state.organizations.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },

      addBranch: (orgId, input) => {
        const branch: Branch = {
          id: genId("br"),
          orgId,
          name: input.name,
          address: input.address,
          status: "active",
          createdAt: new Date().toISOString(),
          balance: 0,
          remittance: { status: "pending", remittedAt: null, remittedBy: null },
        };
        set((state) => ({ branches: [branch, ...state.branches] }));
        return branch;
      },

      updateBranch: (id, patch) => {
        set((state) => ({
          branches: state.branches.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        }));
      },

      setBranchStatus: (id, status) => {
        set((state) => ({
          branches: state.branches.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
      },

      inviteUser: (input) => {
        const user: AppUser = {
          id: genId("user"),
          name: input.name,
          email: input.email,
          role: input.role,
          orgId: input.orgId,
          branchId: input.branchId,
          status: "invited",
          avatarColor: ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"][
            Math.floor(Math.random() * 5)
          ],
          invitedAt: new Date().toISOString(),
          lastLoginAt: null,
        };
        const roleLabel = input.role.replace("_", " ");
        set((state) => ({
          users: [user, ...state.users],
          notifications: [
            makeNotification(
              "user",
              "New invitation sent",
              `${input.name} (${input.email}) was invited as ${roleLabel}.`,
            ),
            ...state.notifications,
          ],
        }));
        return user;
      },

      updateUserRole: (id, role) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
        }));
      },

      setUserStatus: (id, status) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
        }));
      },

      resendInvite: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, invitedAt: new Date().toISOString() } : u)),
        }));
      },

      remitPayment: (input) => {
        if (input.amount <= 0) {
          return { ok: false, error: "Amount must be greater than zero." };
        }
        const branch = get().branches.find((b) => b.id === input.branchId);
        if (!branch) return { ok: false, error: "Branch not found." };
        const org = get().organizations.find((o) => o.id === branch.orgId);
        const outstanding = Math.abs(Math.min(branch.balance, 0));
        if (outstanding <= 0) {
          return { ok: false, error: "This branch has no outstanding balance to remit." };
        }
        if (input.amount > outstanding) {
          return { ok: false, error: `Amount exceeds the outstanding balance of ₱${outstanding.toLocaleString()}.` };
        }

        const balanceAfter = branch.balance + input.amount;
        const isFullySettled = balanceAfter >= 0;

        const txn: Transaction = {
          id: genId("txn"),
          branchId: input.branchId,
          category: isFullySettled ? "Remittance Payment" : "Partial Remittance Payment",
          amount: input.amount,
          description: input.description,
          balanceAfter,
          createdAt: new Date().toISOString(),
          createdBy: input.createdBy,
        };

        set((state) => ({
          transactions: [txn, ...state.transactions],
          branches: state.branches.map((b) =>
            b.id === input.branchId
              ? {
                  ...b,
                  balance: balanceAfter,
                  remittance: isFullySettled
                    ? { status: "remitted", remittedAt: new Date().toISOString(), remittedBy: input.createdBy }
                    : b.remittance,
                }
              : b,
          ),
          notifications: [
            makeNotification(
              "remittance",
              isFullySettled ? "Branch fully remitted" : "Partial remittance received",
              `₱${input.amount.toLocaleString()} remitted by ${branch.name} (${org?.name ?? "Unknown org"})${isFullySettled ? " — outstanding balance settled." : `, ₱${(outstanding - input.amount).toLocaleString()} still outstanding.`}`,
            ),
            ...state.notifications,
          ],
        }));
        return { ok: true };
      },

      removeRemittanceTag: (branchId) => {
        set((state) => ({
          branches: state.branches.map((b) =>
            b.id === branchId ? { ...b, remittance: { status: "pending", remittedAt: null, remittedBy: null } } : b,
          ),
        }));
      },

      updateReportRecipients: (patch) => {
        set((state) => ({ reportRecipients: { ...state.reportRecipients, ...patch } }));
      },
    }),
    {
      name: "pmvic-demo-store-v2",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        session: state.session,
        organizations: state.organizations,
        branches: state.branches,
        users: state.users,
        transactions: state.transactions,
        reports: state.reports,
        reportRecipients: state.reportRecipients,
        notifications: state.notifications,
      }),
    },
  ),
);
