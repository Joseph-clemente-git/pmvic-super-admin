"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, Loader2, UserPlus } from "lucide-react";
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

const TENANT_PORTAL_URL = "https://portal.staclara-pmvic.ph";

function genToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export function InviteUserDialog() {
  const organizations = useStore((s) => s.organizations);
  const inviteUser = useStore((s) => s.inviteUser);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgId, setOrgId] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedOrg = organizations.find((o) => o.id === orgId) ?? null;

  function reset() {
    setName("");
    setEmail("");
    setOrgId("");
    setInviteLink(null);
    setCopied(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!orgId) {
      toast.error("Please select an organization for this account.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      inviteUser({
        name,
        email,
        role: "org_admin",
        orgId,
        branchId: null,
      });
      setInviteLink(`${TENANT_PORTAL_URL}/accept-invite/${genToken()}?org=${selectedOrg?.code ?? orgId}`);
    }, 500);
  }

  async function handleCopy() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invitation link copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link. Copy it manually instead.");
    }
  }

  function handleClose() {
    setOpen(false);
    reset();
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
          <UserPlus /> Invite Tenant Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {inviteLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Invitation link ready</DialogTitle>
              <DialogDescription>
                Share this link with {name || "the new tenant owner"} to set up their organization admin account on
                the organization portal. They&apos;ll create their own branch admins from there — that&apos;s outside
                of this app.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-4">
              <Label htmlFor="invite-link">Invitation link</Label>
              <div className="flex items-center gap-2">
                <Input id="invite-link" readOnly value={inviteLink} className="font-mono text-xs" />
                <Button type="button" variant="outline" size="icon" onClick={handleCopy} aria-label="Copy invitation link">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a demo link and isn&apos;t emailed automatically — copy it and send it yourself.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invite a tenant owner</DialogTitle>
              <DialogDescription>
                Creates the Organization Admin account for a tenant&apos;s own portal. Branch admins are managed by
                that organization inside their portal, not here.
              </DialogDescription>
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
                <Label>Organization</Label>
                <Select value={orgId} onValueChange={setOrgId}>
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Generate invitation link
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
