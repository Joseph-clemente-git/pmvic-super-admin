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
import type { Organization } from "@/types";

interface OrgFormDialogProps {
  mode: "create" | "edit";
  organization?: Organization;
  trigger?: React.ReactNode;
}

const emptyForm = { name: "", address: "", contactPerson: "", email: "", phone: "" };

export function OrgFormDialog({ mode, organization, trigger }: OrgFormDialogProps) {
  const addOrganization = useStore((s) => s.addOrganization);
  const updateOrganization = useStore((s) => s.updateOrganization);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(
        organization
          ? {
              name: organization.name,
              address: organization.address,
              contactPerson: organization.contactPerson,
              email: organization.email,
              phone: organization.phone,
            }
          : emptyForm,
      );
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === "create") {
        addOrganization(form);
        toast.success(`${form.name} has been added.`);
      } else if (organization) {
        updateOrganization(organization.id, form);
        toast.success("Organization details updated.");
      }
      setOpen(false);
    }, 500);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus /> Add Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Add Organization" : "Update Organization"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Register a new PMVIC organization to the platform."
                : "Update this organization's information."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Quirino Highway PMVIC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-address">Address</Label>
              <Input
                id="org-address"
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Street, City, Province"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-contact">Contact person</Label>
                <Input
                  id="org-contact"
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-phone">Phone</Label>
                <Input
                  id="org-phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-email">Email</Label>
              <Input
                id="org-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "create" ? "Add organization" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
