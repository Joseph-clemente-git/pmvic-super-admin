import type {
  AppNotification,
  AppUser,
  Branch,
  DailyReport,
  Organization,
  ReportRecipients,
  Transaction,
} from "@/types";

const ANCHOR = new Date("2026-09-21T08:00:00+08:00");

function daysAgo(n: number, hour = 9, minute = 0): string {
  const d = new Date(ANCHOR);
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const DEMO_CREDENTIALS = {
  superadmin: { email: "superadmin@staclara-pmvic.ph", password: "SuperAdmin123!" },
};

export const ORG_IDS = {
  norte: "org-1",
  bulacan: "org-2",
  southgate: "org-3",
  cavite: "org-4",
  laguna: "org-5",
  pampanga: "org-6",
};

export function seedOrganizations(): Organization[] {
  return [
    {
      id: ORG_IDS.norte,
      code: "PMVIC-0001",
      name: "Sta. Clara Norte PMVIC",
      address: "Km 18 MacArthur Highway, Valenzuela City, Metro Manila",
      contactPerson: "Ramon Dela Cruz",
      email: "norte.ops@staclara-pmvic.ph",
      phone: "+63 917 200 1001",
      status: "active",
      linkedAccountRef: "GL-ACC-100231",
      createdAt: daysAgo(420),
    },
    {
      id: ORG_IDS.bulacan,
      code: "PMVIC-0002",
      name: "Bulacan Testing Center Inc.",
      address: "MacArthur Hwy, Marilao, Bulacan",
      contactPerson: "Erika Santos",
      email: "admin@bulacantesting.ph",
      phone: "+63 917 200 1002",
      status: "active",
      linkedAccountRef: "GL-ACC-100232",
      createdAt: daysAgo(390),
    },
    {
      id: ORG_IDS.southgate,
      code: "PMVIC-0003",
      name: "Southgate Vehicle Inspection Corp.",
      address: "Governor's Drive, Dasmarinas, Cavite",
      contactPerson: "Manuel Reyes",
      email: "ops@southgatevic.ph",
      phone: "+63 917 200 1003",
      status: "active",
      linkedAccountRef: "GL-ACC-100233",
      createdAt: daysAgo(360),
    },
    {
      id: ORG_IDS.cavite,
      code: "PMVIC-0004",
      name: "Metro Cavite PMVIC",
      address: "Aguinaldo Highway, Imus, Cavite",
      contactPerson: "Liza Fernandez",
      email: "finance@metrocavitepmvic.ph",
      phone: "+63 917 200 1004",
      status: "active",
      linkedAccountRef: "GL-ACC-100234",
      createdAt: daysAgo(300),
    },
    {
      id: ORG_IDS.laguna,
      code: "PMVIC-0005",
      name: "Laguna Motorworks Inspection",
      address: "National Hwy, Calamba, Laguna",
      contactPerson: "Patricia Villanueva",
      email: "info@lagunamotorworks.ph",
      phone: "+63 917 200 1005",
      status: "active",
      linkedAccountRef: "GL-ACC-100235",
      createdAt: daysAgo(200),
    },
    {
      id: ORG_IDS.pampanga,
      code: "PMVIC-0006",
      name: "Pampanga Auto Check Center",
      address: "Jose Abad Santos Ave, San Fernando, Pampanga",
      contactPerson: "Noel Gutierrez",
      email: "contact@pampangaautocheck.ph",
      phone: "+63 917 200 1006",
      status: "inactive",
      linkedAccountRef: "GL-ACC-100236",
      createdAt: daysAgo(150),
    },
  ];
}

const PENDING_REMITTANCE = { status: "pending" as const, remittedAt: null, remittedBy: null };

export function seedBranches(): Branch[] {
  return [
    { id: "br-1", orgId: ORG_IDS.norte, name: "Norte Main Branch", address: "Valenzuela City", status: "active", createdAt: daysAgo(420), balance: 0, remittance: PENDING_REMITTANCE },
    { id: "br-2", orgId: ORG_IDS.norte, name: "Norte - Meycauayan Annex", address: "Meycauayan, Bulacan", status: "active", createdAt: daysAgo(300), balance: -500, remittance: PENDING_REMITTANCE },
    { id: "br-3", orgId: ORG_IDS.bulacan, name: "Bulacan Main", address: "Marilao, Bulacan", status: "active", createdAt: daysAgo(390), balance: -8200, remittance: PENDING_REMITTANCE },
    { id: "br-4", orgId: ORG_IDS.southgate, name: "Southgate Dasmarinas", address: "Dasmarinas, Cavite", status: "active", createdAt: daysAgo(360), balance: 0, remittance: PENDING_REMITTANCE },
    { id: "br-5", orgId: ORG_IDS.southgate, name: "Southgate Tagaytay", address: "Tagaytay City", status: "active", createdAt: daysAgo(180), balance: -1800, remittance: PENDING_REMITTANCE },
    { id: "br-6", orgId: ORG_IDS.cavite, name: "Cavite Imus Branch", address: "Imus, Cavite", status: "active", createdAt: daysAgo(300), balance: -3150, remittance: PENDING_REMITTANCE },
    { id: "br-7", orgId: ORG_IDS.laguna, name: "Laguna Calamba Branch", address: "Calamba, Laguna", status: "active", createdAt: daysAgo(200), balance: 0, remittance: PENDING_REMITTANCE },
    {
      id: "br-8",
      orgId: ORG_IDS.pampanga,
      name: "Pampanga San Fernando",
      address: "San Fernando, Pampanga",
      status: "inactive",
      createdAt: daysAgo(150),
      balance: 0,
      remittance: { status: "remitted", remittedAt: daysAgo(2, 14, 30), remittedBy: "Super Admin" },
    },
  ];
}

export function seedUsers(): AppUser[] {
  return [
    {
      id: "user-super-1",
      name: "Super Admin",
      email: DEMO_CREDENTIALS.superadmin.email,
      role: "superadmin",
      orgId: null,
      branchId: null,
      status: "active",
      avatarColor: "bg-primary",
      invitedAt: daysAgo(420),
      lastLoginAt: daysAgo(0, 7, 45),
    },
    {
      id: "user-org-1",
      name: "Ramon Dela Cruz",
      email: "orgadmin@staclara-pmvic.ph",
      role: "org_admin",
      orgId: ORG_IDS.norte,
      branchId: null,
      status: "active",
      avatarColor: "bg-chart-1",
      invitedAt: daysAgo(415),
      lastLoginAt: daysAgo(0, 8, 10),
    },
    {
      id: "user-org-2",
      name: "Erika Santos",
      email: "erika.santos@bulacantesting.ph",
      role: "org_admin",
      orgId: ORG_IDS.bulacan,
      branchId: null,
      status: "active",
      avatarColor: "bg-chart-2",
      invitedAt: daysAgo(385),
      lastLoginAt: daysAgo(1, 16, 0),
    },
    {
      id: "user-org-3",
      name: "Manuel Reyes",
      email: "manuel.reyes@southgatevic.ph",
      role: "org_admin",
      orgId: ORG_IDS.southgate,
      branchId: null,
      status: "active",
      avatarColor: "bg-chart-3",
      invitedAt: daysAgo(355),
      lastLoginAt: daysAgo(3, 9, 30),
    },
    {
      id: "user-org-4",
      name: "Liza Fernandez",
      email: "liza.fernandez@metrocavitepmvic.ph",
      role: "org_admin",
      orgId: ORG_IDS.cavite,
      branchId: null,
      status: "active",
      avatarColor: "bg-chart-5",
      invitedAt: daysAgo(295),
      lastLoginAt: daysAgo(2, 13, 20),
    },
    {
      id: "user-org-5",
      name: "Patricia Villanueva",
      email: "patricia.v@lagunamotorworks.ph",
      role: "org_admin",
      orgId: ORG_IDS.laguna,
      branchId: null,
      status: "invited",
      avatarColor: "bg-chart-1",
      invitedAt: daysAgo(2, 10, 0),
      lastLoginAt: null,
    },
    {
      id: "user-org-6",
      name: "Noel Gutierrez",
      email: "noel.gutierrez@pampangaautocheck.ph",
      role: "org_admin",
      orgId: ORG_IDS.pampanga,
      branchId: null,
      status: "inactive",
      avatarColor: "bg-chart-2",
      invitedAt: daysAgo(150),
      lastLoginAt: daysAgo(45, 8, 0),
    },
  ];
}

export function seedTransactions(): Transaction[] {
  const list: Transaction[] = [];

  function push(
    id: string,
    branchId: string,
    category: string,
    amount: number,
    description: string,
    balanceAfter: number,
    daysBack: number,
    createdBy: string,
  ) {
    list.push({
      id,
      branchId,
      category,
      amount,
      description,
      balanceAfter,
      createdAt: daysAgo(daysBack, 10, 15),
      createdBy,
    });
  }

  // Bulacan Main (br-3) -> partial remittance, still -8200 outstanding
  push("txn-1001", "br-3", "Partial Remittance Payment", 6800, "Partial remittance against outstanding balance", -8200, 8, "Super Admin");

  // Southgate Tagaytay (br-5) -> partial remittance, still -1800 outstanding
  push("txn-1002", "br-5", "Partial Remittance Payment", 1200, "Partial remittance against outstanding balance", -1800, 5, "Super Admin");

  // Pampanga San Fernando (br-8) -> fully remitted, balance settled to 0
  push("txn-1003", "br-8", "Remittance Payment", 1200, "Full remittance of outstanding balance", 0, 2, "Super Admin");

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function seedReports(): DailyReport[] {
  return [
    {
      id: "rpt-1",
      type: "daily-balance",
      date: daysAgo(1),
      receivedAt: daysAgo(1, 6, 0),
      status: "success",
      recipients: ["finance@staclara-pmvic.ph", "ops@staclara-pmvic.ph"],
      totalOrganizations: 6,
      totalAmount: 45570,
    },
    {
      id: "rpt-2",
      type: "daily-earned",
      date: daysAgo(1),
      receivedAt: daysAgo(1, 6, 5),
      status: "success",
      recipients: ["finance@staclara-pmvic.ph"],
      totalOrganizations: 4,
      totalAmount: 6500,
      earningsByOrg: [
        { orgId: ORG_IDS.southgate, orgName: "Southgate Vehicle Inspection Corp.", amount: 2600 },
        { orgId: ORG_IDS.norte, orgName: "Sta. Clara Norte PMVIC", amount: 1900 },
        { orgId: ORG_IDS.bulacan, orgName: "Bulacan Testing Center Inc.", amount: 1200 },
        { orgId: ORG_IDS.pampanga, orgName: "Pampanga Auto Check Center", amount: 800 },
      ],
    },
    {
      id: "rpt-3",
      type: "daily-balance",
      date: daysAgo(2),
      receivedAt: daysAgo(2, 6, 0),
      status: "success",
      recipients: ["finance@staclara-pmvic.ph", "ops@staclara-pmvic.ph"],
      totalOrganizations: 6,
      totalAmount: 49570,
    },
    {
      id: "rpt-4",
      type: "daily-earned",
      date: daysAgo(2),
      receivedAt: daysAgo(2, 6, 5),
      status: "failed",
      recipients: ["finance@staclara-pmvic.ph"],
      totalOrganizations: 6,
      totalAmount: 0,
      note: "Report was not received from the organization webapp by the expected time. Re-fetched and resolved manually.",
    },
    {
      id: "rpt-5",
      type: "daily-balance",
      date: daysAgo(3),
      receivedAt: daysAgo(3, 6, 0),
      status: "success",
      recipients: ["finance@staclara-pmvic.ph", "ops@staclara-pmvic.ph"],
      totalOrganizations: 6,
      totalAmount: 47270,
    },
  ];
}

export function seedReportRecipients(): ReportRecipients {
  return {
    recipients: ["finance@staclara-pmvic.ph", "ops@staclara-pmvic.ph"],
  };
}

export function seedNotifications(): AppNotification[] {
  return [
    {
      id: "notif-1",
      kind: "remittance",
      title: "Outstanding balance flagged",
      description: "Bulacan Main (Bulacan Testing Center Inc.) has ₱8,200.00 in earnings pending remittance.",
      createdAt: daysAgo(0, 8, 0),
      read: false,
    },
    {
      id: "notif-2",
      kind: "report",
      title: "Daily balance report generated",
      description: "The daily balance report for Sep 20, 2026 was generated and emailed to 2 recipients.",
      createdAt: daysAgo(1, 6, 0),
      read: false,
    },
    {
      id: "notif-3",
      kind: "remittance",
      title: "Branch fully remitted",
      description: "Pampanga San Fernando (Pampanga Auto Check Center) was marked as Remitted by Super Admin.",
      createdAt: daysAgo(2, 14, 30),
      read: true,
    },
    {
      id: "notif-4",
      kind: "user",
      title: "New invitation sent",
      description: "Patricia Villanueva was invited as Organization Admin for Laguna Motorworks Inspection.",
      createdAt: daysAgo(2, 10, 0),
      read: true,
    },
    {
      id: "notif-5",
      kind: "report",
      title: "Daily earned report failed",
      description: "SMTP timeout while sending to the distribution list. Retried and resolved manually.",
      createdAt: daysAgo(2, 6, 5),
      read: true,
    },
  ];
}
