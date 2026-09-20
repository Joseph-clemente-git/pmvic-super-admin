"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Power, Send, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteUserDialog } from "@/components/users/invite-user-dialog";
import { useStore } from "@/lib/store";
import { formatDateTime, initials } from "@/lib/format";
import type { AppUser, Role } from "@/types";

type RoleFilter = "all" | Role;
type StatusFilter = "all" | "active" | "invited" | "inactive";

export default function UsersPage() {
  const users = useStore((s) => s.users);
  const organizations = useStore((s) => s.organizations);
  const branches = useStore((s) => s.branches);
  const updateUserRole = useStore((s) => s.updateUserRole);
  const setUserStatus = useStore((s) => s.setUserStatus);
  const resendInvite = useStore((s) => s.resendInvite);
  const hasHydrated = useStore((s) => s.hasHydrated);

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const orgName = (id: string | null) => organizations.find((o) => o.id === id)?.name ?? "—";
  const branchName = (id: string | null) => branches.find((b) => b.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter]);

  function handleRoleChange(user: AppUser, role: Role) {
    updateUserRole(user.id, role);
    toast.success(`${user.name}'s role updated to ${role.replace("_", " ")}.`);
  }

  function handleStatusToggle(user: AppUser) {
    const next = user.status === "active" ? "inactive" : "active";
    setUserStatus(user.id, next);
    toast.success(`${user.name} is now ${next}.`);
  }

  const columns: DataTableColumn<AppUser>[] = [
    {
      key: "name",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`${u.avatarColor} text-xs text-white`}>{initials(u.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => <StatusBadge status={u.role} />,
    },
    {
      key: "org",
      header: "Organization / Branch",
      cell: (u) => (
        <div className="text-sm">
          <p className="text-foreground">{orgName(u.orgId)}</p>
          {u.branchId ? <p className="text-xs text-muted-foreground">{branchName(u.branchId)}</p> : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      cell: (u) => (
        <span className="text-sm text-muted-foreground">
          {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Assign role</DropdownMenuLabel>
            {(["superadmin", "org_admin", "branch_admin"] as Role[]).map((r) => (
              <DropdownMenuItem key={r} disabled={u.role === r} onClick={() => handleRoleChange(u, r)}>
                <ShieldCheck /> {r.replace("_", " ")}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {u.status === "invited" ? (
              <DropdownMenuItem onClick={() => { resendInvite(u.id); toast.success(`Invitation resent to ${u.email}.`); }}>
                <Send /> Resend invitation
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleStatusToggle(u)}>
                <Power /> {u.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Access Management"
        description="Manage organization users, admins, and pending invitations."
        actions={<InviteUserDialog />}
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <DataTable
          data={filtered}
          getRowId={(u) => u.id}
          isLoading={!hasHydrated}
          searchPlaceholder="Search by name or email..."
          onSearch={(u, q) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)}
          columns={columns}
          emptyTitle="No users match these filters"
          toolbar={
            <>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="superadmin">SuperAdmin</SelectItem>
                  <SelectItem value="org_admin">Organization Admin</SelectItem>
                  <SelectItem value="branch_admin">Branch Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      </div>
    </div>
  );
}
