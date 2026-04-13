"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getMessages } from "@/lib/i18n";

export function LoginForm() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const t = getMessages(locale).login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error(t.emptyError);
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || t.failed);
        return;
      }

      toast.success(t.success);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error(t.unexpected);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="login-email">{t.emailLabel}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="login-password">{t.passwordLabel}</Label>
        <Input
          id="login-password"
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
        />
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-full shadow-sm"
        disabled={isPending}
      >
        {isPending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
