import Image from "next/image";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-sidebar">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.6 0.19 252 / 0.5), transparent 45%), radial-gradient(circle at 80% 80%, oklch(0.5 0.15 252 / 0.4), transparent 50%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <div className="splash-anim-logo flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_0_40px_-8px_oklch(0.6_0.19_252_/_0.6)]">
          <Image
            src="/logo.png"
            alt="Sta. Clara PMVIC"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>

        <div className="splash-anim-title space-y-1">
          <p className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Sta. Clara PMVIC
          </p>
          <p className="text-xs text-sidebar-foreground/55">SuperAdmin Console</p>
        </div>

        <div className="splash-anim-track relative h-px w-40 overflow-hidden rounded-full bg-sidebar-foreground/10">
          <span className="splash-anim-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sidebar-primary to-transparent" />
        </div>

        <p className="splash-anim-status text-xs text-sidebar-foreground/45">
          Verifying your session…
        </p>
      </div>
    </div>
  );
}
