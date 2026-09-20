"use client";

import { Bell, CheckCheck, FileBarChart, Inbox, UserPlus, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";
import { useStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/types";

const KIND_ICON: Record<NotificationKind, typeof Wallet> = {
  remittance: Wallet,
  user: UserPlus,
  report: FileBarChart,
};

export function NotificationBell() {
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 ? (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <p className="text-sm font-medium">Notifications</p>
          {unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                markAllNotificationsRead();
              }}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : null}
        </div>

        {notifications.length === 0 ? (
          <div className="p-2">
            <EmptyState icon={Inbox} title="No notifications" description="You're all caught up." />
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="flex flex-col">
              {notifications.map((n) => {
                const Icon = KIND_ICON[n.kind];
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      "flex items-start gap-3 border-b px-3 py-3 text-left last:border-b-0 hover:bg-accent",
                      !n.read && "bg-accent/40",
                    )}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-foreground">{n.title}</span>
                        {!n.read ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{n.description}</span>
                      <span className="mt-1 block text-[11px] text-muted-foreground/70">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
