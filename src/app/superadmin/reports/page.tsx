"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, FileBarChart, ListTree, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { DailyReport } from "@/types";

export default function ReportsPage() {
  const reports = useStore((s) => s.reports);
  const recipientsConfig = useStore((s) => s.reportRecipients);
  const updateReportRecipients = useStore((s) => s.updateReportRecipients);
  const hasHydrated = useStore((s) => s.hasHydrated);

  const [recipientsInput, setRecipientsInput] = useState(recipientsConfig.recipients.join(", "));
  const [breakdownReport, setBreakdownReport] = useState<DailyReport | null>(null);

  const latestByType = useMemo(() => {
    const latest: Record<DailyReport["type"], DailyReport | undefined> = {
      "daily-balance": undefined,
      "daily-earned": undefined,
    };
    for (const r of reports) {
      if (!latest[r.type] || new Date(r.date) > new Date(latest[r.type]!.date)) {
        latest[r.type] = r;
      }
    }
    return latest;
  }, [reports]);

  function commitRecipients() {
    const list = recipientsInput
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    updateReportRecipients({ recipients: list });
    toast.success("Internal forwarding list updated.");
  }

  const columns: DataTableColumn<DailyReport>[] = [
    {
      key: "type",
      header: "Report Type",
      cell: (r) => (
        <span className="font-medium text-foreground">
          {r.type === "daily-balance" ? "Daily Balance Report" : "Daily Earned Report"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Report Date",
      cell: (r) => <span className="text-sm text-muted-foreground">{formatDateTime(r.date)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={r.status} />
          {r.status === "failed" && r.note ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64">{r.note}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      key: "orgs",
      header: "Organizations",
      cell: (r) => r.totalOrganizations,
    },
    {
      key: "amount",
      header: "Total Amount",
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          <span>{formatCurrency(r.totalAmount)}</span>
          {r.type === "daily-earned" && r.earningsByOrg && r.earningsByOrg.length > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setBreakdownReport(r)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ListTree className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>View per-organization breakdown</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      key: "recipients",
      header: "Forwarded To",
      cell: (r) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" /> {r.recipients.length} recipient{r.recipients.length !== 1 ? "s" : ""}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Reports & Notifications"
        description="Daily balance and earned reports are pushed here from the organization webapp and logged for review."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileBarChart className="h-4 w-4 text-primary" /> Daily Balance Report
            </CardTitle>
            <CardDescription>Snapshot of every organization&apos;s current balance.</CardDescription>
          </CardHeader>
          <CardContent>
            {latestByType["daily-balance"] ? (
              <div className="space-y-1">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(latestByType["daily-balance"]!.totalAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last received {formatDateTime(latestByType["daily-balance"]!.date)} ·{" "}
                  {latestByType["daily-balance"]!.totalOrganizations} organizations
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No report received yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileBarChart className="h-4 w-4 text-primary" /> Daily Earned Report
            </CardTitle>
            <CardDescription>How much each organization earned from processed transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {latestByType["daily-earned"] ? (
              <div className="space-y-1">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(latestByType["daily-earned"]!.totalAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last received {formatDateTime(latestByType["daily-earned"]!.date)} ·{" "}
                  {latestByType["daily-earned"]!.totalOrganizations} organizations earned
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No report received yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Internal Forwarding</CardTitle>
            <CardDescription>Who on our end gets emailed a copy when a report is received.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="report-recipients" className="text-xs text-muted-foreground">
              Email recipients
            </Label>
            <Input
              id="report-recipients"
              value={recipientsInput}
              onChange={(e) => setRecipientsInput(e.target.value)}
              onBlur={commitRecipients}
              placeholder="comma-separated emails"
            />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Received Reports</h3>
        <DataTable
          data={reports}
          getRowId={(r) => r.id}
          isLoading={!hasHydrated}
          columns={columns}
          pageSize={8}
          emptyTitle="No reports received yet"
        />
      </div>

      <Dialog open={breakdownReport !== null} onOpenChange={(open) => !open && setBreakdownReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Earnings by Organization</DialogTitle>
            <DialogDescription>
              {breakdownReport ? `Daily Earned Report · ${formatDateTime(breakdownReport.date)}` : null}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {breakdownReport?.earningsByOrg?.length ? (
              breakdownReport.earningsByOrg.map((e) => (
                <div key={e.orgId} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{e.orgName}</span>
                  <span className="tabular-nums text-muted-foreground">{formatCurrency(e.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No organizations earned transactions in this report.</p>
            )}
            {breakdownReport?.earningsByOrg?.length ? (
              <div className="flex items-center justify-between rounded-lg border-t px-3 pt-3 text-sm font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(breakdownReport.totalAmount)}</span>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
