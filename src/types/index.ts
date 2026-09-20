export type Role = "superadmin" | "org_admin" | "branch_admin";

export type UserStatus = "active" | "invited" | "inactive";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string | null;
  branchId: string | null;
  status: UserStatus;
  avatarColor: string;
  invitedAt: string;
  lastLoginAt: string | null;
}

export type OrgStatus = "active" | "inactive";

export interface Branch {
  id: string;
  orgId: string;
  name: string;
  address: string;
  status: OrgStatus;
  createdAt: string;
  balance: number;
  remittance: {
    status: "pending" | "remitted";
    remittedAt: string | null;
    remittedBy: string | null;
  };
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: OrgStatus;
  linkedAccountRef: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  branchId: string;
  category: string;
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
  createdBy: string;
}

export type ReportType = "daily-balance" | "daily-earned";
export type ReportStatus = "success" | "failed";

export interface OrgEarning {
  orgId: string;
  orgName: string;
  amount: number;
}

export interface DailyReport {
  id: string;
  type: ReportType;
  date: string;
  receivedAt: string;
  status: ReportStatus;
  recipients: string[];
  totalOrganizations: number;
  totalAmount: number;
  earningsByOrg?: OrgEarning[];
  note?: string;
}

export interface ReportRecipients {
  recipients: string[];
}

export interface Session {
  userId: string;
  role: Role;
  orgId: string | null;
  name: string;
  email: string;
}

export type NotificationKind = "remittance" | "user" | "report";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}
