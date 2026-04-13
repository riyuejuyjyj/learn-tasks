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

export function RegisterForm() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const t = getMessages(locale).register;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error(t.emptyError);
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/profile?verified=1",
      });

      if (error) {
        toast.error(error.message || t.failed);
        return;
      }

      toast.success(t.success);
      router.push("/login?verification=sent");
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
        <Label htmlFor="register-name">{t.nameLabel}</Label>
        <Input
          id="register-name"
          type="text"
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="register-email">{t.emailLabel}</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11 rounded-2xl border-border/70 bg-background/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="register-password">{t.passwordLabel}</Label>
        <Input
          id="register-password"
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
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
