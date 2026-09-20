"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { OrgFormDialog } from "@/components/organizations/org-form-dialog";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Organization } from "@/types";

export default function OrganizationsPage() {
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const hasHydrated = useStore((s) => s.hasHydrated);

  const orgBalances = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of branches) map.set(b.orgId, (map.get(b.orgId) ?? 0) + b.balance);
    return map;
  }, [branches]);

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
      key: "address",
      header: "Address",
      cell: (o) => (
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="max-w-64">{o.address}</span>
        </div>
      ),
    },
    {
      key: "branches",
      header: "Branches",
      cell: (o) => branches.filter((b) => b.orgId === o.id).length,
    },
    {
      key: "balance",
      header: "Balance",
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
      key: "status",
      header: "Status",
      cell: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: "createdAt",
      header: "Registered",
      cell: (o) => <span className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (o) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/superadmin/organizations/${o.id}`}>
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Management"
        description="Add, update, and manage PMVIC organizations and their branches."
        actions={<OrgFormDialog mode="create" />}
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <DataTable
          data={organizations}
          getRowId={(o) => o.id}
          isLoading={!hasHydrated}
          searchPlaceholder="Search organizations..."
          onSearch={(o, q) =>
            o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.address.toLowerCase().includes(q)
          }
          columns={columns}
          emptyTitle="No organizations yet"
          emptyDescription="Add your first PMVIC organization to get started."
        />
      </div>
    </div>
  );
}
