"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/lib/store";
import { DEMO_CREDENTIALS } from "@/lib/seed-data";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.superadmin.email);
    setPassword(DEMO_CREDENTIALS.superadmin.password);
    setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsSubmitting(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(`Welcome back, ${result.session.name}!`);
      router.push("/superadmin/dashboard");
    }, 500);
  }

  return (
    <AuthLayout title="Sign in to your account" description="Enter your credentials to access the SuperAdmin console.">
      <button
        type="button"
        onClick={fillDemo}
        className="flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-colors hover:bg-accent"
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
        <span>
          <span className="block font-medium">SuperAdmin demo account</span>
          <span className="text-muted-foreground">Click to autofill credentials</span>
        </span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
