"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, HandCoins } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";

export function ProcessRemittanceDialog({
  defaultBranchId,
  trigger,
}: {
  defaultBranchId?: string;
  trigger?: ReactNode;
}) {
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const remitPayment = useStore((s) => s.remitPayment);
  const session = useStore((s) => s.session);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branchId, setBranchId] = useState(defaultBranchId ?? "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? "Unknown organization";
  const selectedBranch = branches.find((b) => b.id === branchId);
  const outstanding = selectedBranch ? Math.abs(Math.min(selectedBranch.balance, 0)) : 0;

  function reset() {
    setBranchId(defaultBranchId ?? "");
    setAmount("");
    setDescription("");
    setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const numericAmount = Number(amount);

    if (!branchId) {
      setError("Please select a branch.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    if (numericAmount > outstanding) {
      setError(`Amount cannot exceed the outstanding balance of ${formatCurrency(outstanding)}.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = remitPayment({
        branchId,
        amount: numericAmount,
        description: description || "Remittance payment",
        createdBy: session?.name ?? "Super Admin",
      });
      setIsSubmitting(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const remaining = outstanding - numericAmount;
      toast.success(
        remaining <= 0
          ? `${formatCurrency(numericAmount)} remitted to ${selectedBranch?.name}. Their balance is now settled.`
          : `${formatCurrency(numericAmount)} remitted to ${selectedBranch?.name}. ${formatCurrency(remaining)} still pending remittance.`,
      );
      setOpen(false);
      reset();
    }, 400);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {/* {trigger ?? (
          <Button>
            <HandCoins /> Process Remittance
          </Button>
        )} */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Process Remittance</DialogTitle>
            <DialogDescription>
              Record a remittance paid out to a branch for the transactions they earned. You may pay the full
              outstanding amount or a partial payment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId} onValueChange={setBranchId} disabled={!!defaultBranchId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {orgName(b.orgId)} — {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBranch ? (
                <p className="text-xs text-muted-foreground">
                  Outstanding balance:{" "}
                  <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(outstanding)}</span>
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remit-amount">Amount to remit (PHP)</Label>
              <Input
                id="remit-amount"
                type="number"
                min="0"
                max={outstanding || undefined}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Partial amounts are accepted.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remit-desc">Description (optional)</Label>
              <Textarea
                id="remit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note about this remittance"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Process remittance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
