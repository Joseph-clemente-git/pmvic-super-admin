"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { NotificationBell } from "@/components/layout/notification-bell";

const TITLES: Record<string, string> = {
  "/superadmin/dashboard": "Balance Monitoring Dashboard",
  "/superadmin/organizations": "Organization Management",
  "/superadmin/users": "Users & Access Management",
  "/superadmin/transactions": "Transaction History",
  "/superadmin/reports": "Daily Reports & Notifications",
  "/superadmin/settings": "Account Settings",
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  const match = Object.keys(TITLES).find((key) => pathname.startsWith(key));
  return match ? TITLES[match] : "Sta. Clara PMVIC";
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const title = resolveTitle(pathname);
  const session = useStore((s) => s.session);
  const logout = useStore((s) => s.logout);

  function handleLogout() {
    logout();
    toast.success("Signed out successfully.");
    router.push("/login");
  }

  const settingsHref = "/superadmin/settings";

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title}</h2>

      {session ? <StatusBadge status={session.role} className="hidden sm:inline-flex" /> : null}

      <NotificationBell />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {initials(session?.name ?? "U")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">{session?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium">{session?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(settingsHref)}>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(settingsHref)}>
            <Settings />
            Account settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
