import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "green" | "red" | "amber" | "slate" | "blue";

const toneClasses: Record<Tone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
  amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
  slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400",
};

const presets = {
  active: { label: "Active", tone: "green" as Tone },
  inactive: { label: "Inactive", tone: "slate" as Tone },
  invited: { label: "Invited", tone: "amber" as Tone },
  pending: { label: "Pending", tone: "amber" as Tone },
  remitted: { label: "Remitted", tone: "green" as Tone },
  success: { label: "Success", tone: "green" as Tone },
  failed: { label: "Failed", tone: "red" as Tone },
  superadmin: { label: "Super Admin", tone: "blue" as Tone },
  org_admin: { label: "Organization Admin", tone: "blue" as Tone },
  branch_admin: { label: "Branch Admin", tone: "slate" as Tone },
};

interface StatusBadgeProps {
  status: keyof typeof presets;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const preset = presets[status];
  return (
    <Badge variant="outline" className={cn("font-medium", toneClasses[preset.tone], className)}>
      {preset.label}
    </Badge>
  );
}
