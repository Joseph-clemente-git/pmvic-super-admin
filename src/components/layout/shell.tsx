"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useStore } from "@/lib/store";
import { SplashScreen } from "@/components/layout/splash-screen";

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
    return <SplashScreen />;
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
