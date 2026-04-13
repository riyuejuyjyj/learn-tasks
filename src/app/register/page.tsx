import Link from "next/link";

import { AuthCard } from "@/features/tasks/components/auth/auth-card";
import { AuthShell } from "@/features/tasks/components/auth/auth-shell";
import { RegisterForm } from "@/features/tasks/components/auth/register-form";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = getMessages(locale).register;

  return (
    <AuthShell title={t.pageTitle} description={t.pageDescription}>
      <AuthCard title={t.cardTitle} subtitle={t.cardSubtitle}>
        <RegisterForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t.footerText}{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t.footerAction}
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
