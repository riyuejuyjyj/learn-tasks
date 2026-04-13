"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";

type ResendVerificationButtonProps = {
  email?: string;
};

export function ResendVerificationButton({}: ResendVerificationButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { locale } = useAppLocale();
  const t = getMessages(locale).profile;

  async function handleClick() {
    setIsPending(true);

    try {
      const response = await fetch("/api/email/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callbackURL: "/profile?verified=1",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || t.resendFailed);
      }

      toast.success(t.resendSuccess);
    } catch (error) {
      const message = error instanceof Error ? error.message : t.resendFailed;
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? t.resendSending : t.resendVerification}
    </Button>
  );
}
