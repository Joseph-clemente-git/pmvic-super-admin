import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "negative" | "warning";
  hint?: string;
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  negative: "bg-red-500/10 text-red-600 dark:text-red-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function StatCard({ label, value, icon: Icon, tone = "default", hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
