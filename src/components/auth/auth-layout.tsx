import Image from "next/image";
import type { ReactNode } from "react";
import { ShieldCheck, Building2, Wallet } from "lucide-react";

const features = [
  { icon: Building2, text: "Manage every PMVIC organization and branch from one console." },
  { icon: Wallet, text: "Track balances, credits, debits, and outstanding remittances in real time." },
  { icon: ShieldCheck, text: "Role-based access keeps SuperAdmin and organization data secure." },
];

export function AuthLayout({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.6 0.19 252 / 0.5), transparent 45%), radial-gradient(circle at 80% 80%, oklch(0.5 0.15 252 / 0.4), transparent 50%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
            <Image src="/logo.png" alt="Sta. Clara PMVIC" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold">Sta. Clara Realty Mgt. Dev&apos;t Corp.</p>
            <p className="text-xs text-sidebar-foreground/70">Private Motor Vehicle Inspection Center</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-semibold leading-tight text-balance">
            One console for every PMVIC organization&apos;s balance and compliance.
          </h1>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-sm text-sidebar-foreground/85">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-sidebar-foreground/50">
          &copy; {new Date().getFullYear()} Sta. Clara Realty Mgt. Dev&apos;t Corp. Demo environment for evaluation purposes only.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white">
              <Image src="/logo.png" alt="Sta. Clara PMVIC" width={30} height={30} className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold">Sta. Clara PMVIC</p>
              <p className="text-xs text-muted-foreground">SuperAdmin Console</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
