"use client";

import { useState, type FormEvent } from "react";
import { Loader2, UserPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { Role } from "@/types";

export function InviteUserDialog() {
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const inviteUser = useStore((s) => s.inviteUser);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("org_admin");
  const [orgId, setOrgId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");

  const orgBranches = branches.filter((b) => b.orgId === orgId);

  function reset() {
    setName("");
    setEmail("");
    setRole("org_admin");
    setOrgId("");
    setBranchId("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (role !== "superadmin" && !orgId) {
      toast.error("Please select an organization for this role.");
      return;
    }
    if (role === "branch_admin" && !branchId) {
      toast.error("Please select a branch for this role.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      inviteUser({
        name,
        email,
        role,
        orgId: role === "superadmin" ? null : orgId,
        branchId: role === "branch_admin" ? branchId : null,
      });
      toast.success(`Invitation sent to ${email}.`);
      setOpen(false);
      reset();
    }, 500);
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
        <Button>
          <UserPlus /> Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite a new user</DialogTitle>
            <DialogDescription>Send an invitation and assign an appropriate role and organization.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full name</Label>
              <Input id="invite-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">SuperAdmin</SelectItem>
                  <SelectItem value="org_admin">Organization Admin</SelectItem>
                  <SelectItem value="branch_admin">Branch Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role !== "superadmin" ? (
              <div className="space-y-2">
                <Label>Organization</Label>
                <Select
                  value={orgId}
                  onValueChange={(v) => {
                    setOrgId(v);
                    setBranchId("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {role === "branch_admin" ? (
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={branchId} onValueChange={setBranchId} disabled={!orgId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={orgId ? "Select branch" : "Select organization first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {orgBranches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
