"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" description="We sent a password reset link to your inbox.">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Reset link sent to {email}</p>
              <p className="mt-1 text-muted-foreground">
                This is a demo environment, so no real email was sent. Continue to the reset screen to
                simulate setting a new password.
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push("/reset-password?token=demo-token")}>
            Continue to reset password
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter the email associated with your account and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send reset link
        </Button>
      </form>
      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
