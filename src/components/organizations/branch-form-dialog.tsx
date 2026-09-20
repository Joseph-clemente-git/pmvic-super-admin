"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { useStore } from "@/lib/store";
import type { Branch } from "@/types";

interface BranchFormDialogProps {
  orgId: string;
  mode: "create" | "edit";
  branch?: Branch;
  trigger?: React.ReactNode;
}

export function BranchFormDialog({ orgId, mode, branch, trigger }: BranchFormDialogProps) {
  const addBranch = useStore((s) => s.addBranch);
  const updateBranch = useStore((s) => s.updateBranch);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", address: "" });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(branch ? { name: branch.name, address: branch.address } : { name: "", address: "" });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === "create") {
        addBranch(orgId, form);
        toast.success(`Branch "${form.name}" added.`);
      } else if (branch) {
        updateBranch(branch.id, form);
        toast.success("Branch details updated.");
      }
      setOpen(false);
    }, 400);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            <Plus /> Add Branch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Add Branch" : "Update Branch"}</DialogTitle>
            <DialogDescription>Branch information for this organization.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch name</Label>
              <Input
                id="branch-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-address">Address</Label>
              <Input
                id="branch-address"
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "create" ? "Add branch" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
