"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Wallet, AlertTriangle, Landmark, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Organization } from "@/types";

type FilterValue = "all" | "active" | "inactive" | "outstanding";

export default function SuperAdminDashboardPage() {
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const transactions = useStore((s) => s.transactions);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const [filter, setFilter] = useState<FilterValue>("all");

  const orgBalances = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of branches) map.set(b.orgId, (map.get(b.orgId) ?? 0) + b.balance);
    return map;
  }, [branches]);

  const stats = useMemo(() => {
    const totalBalance = branches.reduce((sum, b) => sum + b.balance, 0);
    const totalOutstanding = branches.reduce((sum, b) => sum + Math.min(b.balance, 0), 0);
    const pendingRemit = branches.filter((b) => b.balance < 0 && b.remittance.status === "pending").length;
    return {
      count: organizations.length,
      totalBalance,
      totalOutstanding: Math.abs(totalOutstanding),
      pendingRemit,
    };
  }, [organizations, branches]);

  const lastTxnByOrg = useMemo(() => {
    const map = new Map<string, (typeof transactions)[number]>();
    for (const t of transactions) {
      const orgId = branches.find((b) => b.id === t.branchId)?.orgId;
      if (!orgId) continue;
      const existing = map.get(orgId);
      if (!existing || new Date(t.createdAt) > new Date(existing.createdAt)) {
        map.set(orgId, t);
      }
    }
    return map;
  }, [transactions, branches]);

  const filtered = useMemo(() => {
    return organizations.filter((o) => {
      if (filter === "active") return o.status === "active";
      if (filter === "inactive") return o.status === "inactive";
      if (filter === "outstanding") return (orgBalances.get(o.id) ?? 0) < 0;
      return true;
    });
  }, [organizations, filter, orgBalances]);

  const columns: DataTableColumn<Organization>[] = [
    {
      key: "name",
      header: "Organization",
      cell: (o) => (
        <div>
          <p className="font-medium text-foreground">{o.name}</p>
          <p className="text-xs text-muted-foreground">{o.code}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: "balance",
      header: "Current Balance",
      cell: (o) => {
        const balance = orgBalances.get(o.id) ?? 0;
        return (
          <span className={balance < 0 ? "font-medium text-red-600 dark:text-red-400" : "font-medium"}>
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      key: "lastTxn",
      header: "Last Remittance",
      cell: (o) => {
        const txn = lastTxnByOrg.get(o.id);
        if (!txn) return <span className="text-xs text-muted-foreground">No remittance yet</span>;
        return (
          <div>
            <p className="text-sm">{formatCurrency(txn.amount)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(txn.createdAt)}</p>
          </div>
        );
      },
    },
    {
      key: "outstanding",
      header: "Outstanding",
      cell: (o) => {
        const balance = orgBalances.get(o.id) ?? 0;
        return balance < 0 ? (
          <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(Math.abs(balance))}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      key: "remittance",
      header: "Remittance",
      cell: (o) => {
        const balance = orgBalances.get(o.id) ?? 0;
        if (balance < 0) return <StatusBadge status="pending" />;
        const anyRemitted = branches.some((b) => b.orgId === o.id && b.remittance.status === "remitted");
        return anyRemitted ? <StatusBadge status="remitted" /> : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (o) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/superadmin/organizations/${o.id}`}>
            View <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      ),
    },
  ];

  const chartData = useMemo(
    () => organizations.map((o) => ({ name: o.name, balance: orgBalances.get(o.id) ?? 0 })),
    [organizations, orgBalances],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balance Monitoring Dashboard"
        description="Monitor every organization's financial position and outstanding balances in real time."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered Organizations" value={String(stats.count)} icon={Building2} />
        <StatCard
          label="Total Net Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={Landmark}
          tone={stats.totalBalance >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Total Outstanding"
          value={formatCurrency(stats.totalOutstanding)}
          icon={Wallet}
          tone={stats.totalOutstanding > 0 ? "negative" : "default"}
        />
        <StatCard
          label="Pending Remittance"
          value={String(stats.pendingRemit)}
          icon={AlertTriangle}
          tone={stats.pendingRemit > 0 ? "warning" : "default"}
          hint="Branches with unpaid outstanding balance"
        />
      </div>

      <BalanceChart data={chartData} />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <DataTable
          data={filtered}
          getRowId={(o) => o.id}
          isLoading={!hasHydrated}
          searchPlaceholder="Search organizations by name or code..."
          onSearch={(o, q) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)}
          columns={columns}
          emptyTitle="No organizations match this filter"
          toolbar={
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All organizations</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
                <SelectItem value="outstanding">With outstanding balance</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </div>
  );
}
