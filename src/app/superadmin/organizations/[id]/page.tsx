"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  Landmark,
  Pencil,
  Power,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { InfoRow } from "@/components/shared/info-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { OrgFormDialog } from "@/components/organizations/org-form-dialog";
import { BranchFormDialog } from "@/components/organizations/branch-form-dialog";
import { ProcessRemittanceDialog } from "@/components/transactions/process-remittance-dialog";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { Branch } from "@/types";

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const transactions = useStore((s) => s.transactions);
  const setOrganizationStatus = useStore((s) => s.setOrganizationStatus);
  const setBranchStatus = useStore((s) => s.setBranchStatus);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const org = organizations.find((o) => o.id === id);
  const orgBranches = branches.filter((b) => b.orgId === id);
  const orgBranchIds = new Set(orgBranches.map((b) => b.id));
  const orgTxns = transactions.filter((t) => orgBranchIds.has(t.branchId)).slice(0, 6);
  const orgBalance = orgBranches.reduce((sum, b) => sum + b.balance, 0);
  const outstandingBranches = orgBranches.filter((b) => b.balance < 0);

  if (!org) {
    return (
      <EmptyState
        icon={Building2}
        title="Organization not found"
        description="This organization may have been removed."
        action={
          <Button variant="outline" onClick={() => router.push("/superadmin/organizations")}>
            Back to organizations
          </Button>
        }
      />
    );
  }

  function toggleBranchStatus(branch: Branch) {
    setBranchStatus(branch.id, branch.status === "active" ? "inactive" : "active");
    toast.success(`${branch.name} marked as ${branch.status === "active" ? "inactive" : "active"}.`);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/superadmin/organizations"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to organizations
      </Link>

      <PageHeader
        title={org.name}
        description={`${org.code} · Registered ${formatDate(org.createdAt)}`}
        actions={
          <>
            <StatusBadge status={org.status} />
            <OrgFormDialog
              mode="edit"
              organization={org}
              trigger={
                <Button variant="outline">
                  <Pencil /> Edit details
                </Button>
              }
            />
            <Button variant={org.status === "active" ? "destructive" : "default"} onClick={() => setStatusDialogOpen(true)}>
              <Power /> {org.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Address" value={org.address} />
            <InfoRow icon={UserIcon} label="Contact person" value={org.contactPerson} />
            <InfoRow icon={Mail} label="Email" value={org.email} />
            <InfoRow icon={Phone} label="Phone" value={org.phone} />
            <InfoRow icon={Landmark} label="Linked account" value={org.linkedAccountRef} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Balance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Current balance (all branches)</p>
              <p className={`text-2xl font-semibold ${orgBalance < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                {formatCurrency(orgBalance)}
              </p>
            </div>
            {outstandingBranches.length > 0 ? (
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    {outstandingBranches.length} branch{outstandingBranches.length === 1 ? "" : "es"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/superadmin/transactions?orgId=${org.id}`}>View</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Branches ({orgBranches.length})</CardTitle>
          <BranchFormDialog orgId={org.id} mode="create" />
        </CardHeader>
        <CardContent>
          {orgBranches.length === 0 ? (
            <EmptyState icon={Building2} title="No branches yet" description="Add a branch for this organization." />
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Remittance</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgBranches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">
                        {b.name}
                        <p className="text-xs font-normal text-muted-foreground">{b.address}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell className={b.balance < 0 ? "font-medium text-red-600 dark:text-red-400" : "font-medium"}>
                        {formatCurrency(b.balance)}
                      </TableCell>
                      <TableCell>
                        {b.balance < 0 ? (
                          <StatusBadge status={b.remittance.status} />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(b.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.balance < 0 ? (
                            <ProcessRemittanceDialog
                              defaultBranchId={b.id}
                              trigger={
                                <Button size="sm" variant="outline">
                                  <Wallet /> Remit
                                </Button>
                              }
                            />
                          ) : null}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <BranchFormDialog
                                orgId={org.id}
                                mode="edit"
                                branch={b}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Pencil /> Edit branch
                                  </DropdownMenuItem>
                                }
                              />
                              <DropdownMenuItem onClick={() => toggleBranchStatus(b)}>
                                <Power /> {b.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Remittance History</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/superadmin/transactions?orgId=${org.id}`}>View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orgTxns.length === 0 ? (
            <EmptyState icon={Wallet} title="No remittances yet" />
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgTxns.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                      <TableCell>{branches.find((b) => b.id === t.branchId)?.name ?? "Unknown"}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(t.balanceAfter)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={`${org.status === "active" ? "Deactivate" : "Activate"} ${org.name}?`}
        description={
          org.status === "active"
            ? "This organization will no longer be able to process new transactions until reactivated."
            : "This organization will regain access to the platform."
        }
        destructive={org.status === "active"}
        confirmLabel={org.status === "active" ? "Deactivate" : "Activate"}
        onConfirm={() => {
          setOrganizationStatus(org.id, org.status === "active" ? "inactive" : "active");
          toast.success(`${org.name} is now ${org.status === "active" ? "inactive" : "active"}.`);
        }}
      />
    </div>
  );
}
