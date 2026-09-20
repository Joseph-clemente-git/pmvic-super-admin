"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ReceiptText,
  FileClock,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";
import { toast } from "sonner";

const superadminNav = [
  { href: "/superadmin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/superadmin/organizations", label: "Organizations", icon: Building2 },
  { href: "/superadmin/users", label: "Users & Access", icon: Users },
  { href: "/superadmin/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/superadmin/reports", label: "Daily Reports", icon: FileClock },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useStore((s) => s.session);
  const logout = useStore((s) => s.logout);

  function handleLogout() {
    logout();
    toast.success("Signed out successfully.");
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <Image src="/logo.png" alt="Sta. Clara PMVIC" width={26} height={26} className="object-contain" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Sta. Clara PMVIC</p>
            <p className="truncate text-xs text-sidebar-foreground/60">SuperAdmin Console</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superadminNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/superadmin/settings">
                <Settings />
                <span>Account Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign out">
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {initials(session?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{session?.name}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">{session?.email}</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
