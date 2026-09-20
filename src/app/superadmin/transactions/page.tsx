"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, HandCoins, Undo2, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ProcessRemittanceDialog } from "@/components/transactions/process-remittance-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Branch, Transaction } from "@/types";

type BranchTabValue = "all" | "pending" | "remitted";

function TransactionsContent() {
  const searchParams = useSearchParams();
  const presetOrgId = searchParams.get("orgId") ?? "all";

  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const transactions = useStore((s) => s.transactions);
  const removeRemittanceTag = useStore((s) => s.removeRemittanceTag);
  const hasHydrated = useStore((s) => s.hasHydrated);

  const [branchTab, setBranchTab] = useState<BranchTabValue>("pending");
  const [orgFilter, setOrgFilter] = useState(presetOrgId);
  const [untagTarget, setUntagTarget] = useState<Branch | null>(null);

  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? "Unknown";
  const orgCode = (id: string) => organizations.find((o) => o.id === id)?.code ?? "";
  const branchOrgMap = useMemo(() => new Map(branches.map((b) => [b.id, b.orgId])), [branches]);
  const branchOrgId = (branchId: string) => branchOrgMap.get(branchId) ?? "";

  const scopedBranches = useMemo(
    () => branches.filter((b) => orgFilter === "all" || b.orgId === orgFilter),
    [branches, orgFilter],
  );

  const pendingBranches = useMemo(() => scopedBranches.filter((b) => b.balance < 0), [scopedBranches]);
  const remittedBranches = useMemo(
    () => scopedBranches.filter((b) => b.remittance.status === "remitted"),
    [scopedBranches],
  );
  const relevantBranches = useMemo(
    () => scopedBranches.filter((b) => b.balance < 0 || b.remittance.status === "remitted"),
    [scopedBranches],
  );

  const stats = useMemo(() => {
    const totalOutstanding = pendingBranches.reduce((sum, b) => sum + Math.abs(b.balance), 0);
    return {
      totalOutstanding,
      pendingCount: pendingBranches.length,
      remittedCount: remittedBranches.length,
    };
  }, [pendingBranches, remittedBranches]);

  const branchRows = useMemo(() => {
    if (branchTab === "pending") return pendingBranches;
    if (branchTab === "remitted") return remittedBranches;
    return relevantBranches;
  }, [branchTab, pendingBranches, remittedBranches, relevantBranches]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => orgFilter === "all" || branchOrgMap.get(t.branchId) === orgFilter);
  }, [transactions, orgFilter, branchOrgMap]);

  function confirmUntag() {
    if (!untagTarget) return;
    removeRemittanceTag(untagTarget.id);
    toast.success(`Remittance tag removed for ${untagTarget.name}.`);
    setUntagTarget(null);
  }

  const branchColumns: DataTableColumn<Branch>[] = [
    {
      key: "org",
      header: "Organization",
      cell: (b) => (
        <div>
          <p className="font-medium text-foreground">{orgName(b.orgId)}</p>
          <p className="text-xs text-muted-foreground">{orgCode(b.orgId)}</p>
        </div>
      ),
    },
    {
      key: "branch",
      header: "Branch",
      cell: (b) => <span className="text-sm">{b.name}</span>,
    },
    {
      key: "outstanding",
      header: "Outstanding Amount",
      cell: (b) => (
        <span className={b.balance < 0 ? "font-medium text-red-600 dark:text-red-400" : "font-medium"}>
          {formatCurrency(Math.abs(b.balance))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Remittance Status",
      cell: (b) => <StatusBadge status={b.remittance.status} />,
    },
    {
      key: "remittedAt",
      header: "Remittance Date",
      cell: (b) => (
        <span className="text-sm text-muted-foreground">
          {b.remittance.remittedAt ? formatDateTime(b.remittance.remittedAt) : "—"}
        </span>
      ),
    },
    {
      key: "taggedBy",
      header: "Tagged By",
      cell: (b) => <span className="text-sm text-muted-foreground">{b.remittance.remittedBy ?? "—"}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (b) =>
        b.remittance.status === "pending" ? (
          <ProcessRemittanceDialog
            defaultBranchId={b.id}
            trigger={
              <Button size="sm">
                <HandCoins /> Remit Payment
              </Button>
            }
          />
        ) : (
          <Button size="sm" variant="outline" onClick={() => setUntagTarget(b)}>
            <Undo2 /> Remove Tag
          </Button>
        ),
    },
  ];

  const transactionColumns: DataTableColumn<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      cell: (t) => <span className="text-sm text-muted-foreground">{formatDateTime(t.createdAt)}</span>,
    },
    {
      key: "org",
      header: "Organization",
      cell: (t) => {
        const orgId = branchOrgId(t.branchId);
        return (
          <div>
            <p className="font-medium text-foreground">{orgName(orgId)}</p>
            <p className="text-xs text-muted-foreground">{orgCode(orgId)}</p>
          </div>
        );
      },
    },
    {
      key: "branch",
      header: "Branch",
      cell: (t) => <span className="text-sm">{branches.find((b) => b.id === t.branchId)?.name ?? "Unknown"}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (t) => <span className="text-sm">{t.category}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (t) => <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(t.amount)}</span>,
    },
    {
      key: "balanceAfter",
      header: "Balance After",
      cell: (t) => <span className="font-medium">{formatCurrency(t.balanceAfter)}</span>,
    },
    {
      key: "createdBy",
      header: "Processed By",
      cell: (t) => <span className="text-sm text-muted-foreground">{t.createdBy}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction History"
        description="Track branch outstanding balances and record remittance payments."
        actions={<ProcessRemittanceDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Outstanding" value={formatCurrency(stats.totalOutstanding)} icon={Wallet} tone="negative" />
        <StatCard
          label="Pending Remittance"
          value={`${stats.pendingCount} branches`}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard label="Remitted" value={String(stats.remittedCount)} icon={CheckCircle2} tone="positive" />
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs value={branchTab} onValueChange={(v) => setBranchTab(v as BranchTabValue)}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="remitted">Remitted</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All organizations</SelectItem>
              {organizations.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DataTable
          data={branchRows}
          getRowId={(b) => b.id}
          isLoading={!hasHydrated}
          searchPlaceholder="Search branches..."
          onSearch={(b, q) => b.name.toLowerCase().includes(q) || orgName(b.orgId).toLowerCase().includes(q)}
          columns={branchColumns}
          emptyTitle="No branches to show"
          emptyDescription="No branches match this filter."
        />
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Remittance Log</h3>
        <DataTable
          data={filteredTransactions}
          getRowId={(t) => t.id}
          isLoading={!hasHydrated}
          searchPlaceholder="Search by description or category..."
          onSearch={(t, q) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)}
          columns={transactionColumns}
          pageSize={10}
          emptyTitle="No remittances recorded yet"
        />
      </div>

      <ConfirmDialog
        open={!!untagTarget}
        onOpenChange={(v) => !v && setUntagTarget(null)}
        title="Remove remittance tag?"
        description={`This will revert ${untagTarget?.name}'s remittance status back to Pending. It does not change the branch's balance.`}
        confirmLabel="Remove tag"
        onConfirm={confirmUntag}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionsContent />
    </Suspense>
  );
}
