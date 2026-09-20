"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

export function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasHydrated = useStore((s) => s.hasHydrated);
  const session = useStore((s) => s.session);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session) {
      router.replace("/login");
    }
  }, [hasHydrated, session, router]);

  if (!hasHydrated || !session) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-muted/30">
        <div className="w-full max-w-sm space-y-3 px-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex-1 space-y-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
