import Link from "next/link";

import { AuthCard } from "@/features/tasks/components/auth/auth-card";
import { AuthShell } from "@/features/tasks/components/auth/auth-shell";
import { LoginForm } from "@/features/tasks/components/auth/login-form";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    verification?: string;
    verified?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const locale = await getLocale();
  const t = getMessages(locale).login;
  const params = await searchParams;
  const verificationSent = params?.verification === "sent";
  const verified = params?.verified === "1";
  const verificationError = params?.error;

  return (
    <AuthShell title={t.pageTitle} description={t.pageDescription}>
      <AuthCard title={t.cardTitle} subtitle={t.cardSubtitle}>
        {verificationSent ? (
          <div className="mb-4 rounded-2xl border border-sky-300/60 bg-sky-500/10 px-4 py-3 text-sm text-sky-900 dark:text-sky-100">
            {t.verificationSent}
          </div>
        ) : null}

        {verified ? (
          <div className="mb-4 rounded-2xl border border-emerald-300/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
            {t.verified}
          </div>
        ) : null}

        {verificationError ? (
          <div className="mb-4 rounded-2xl border border-red-300/60 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
            {t.verificationFailed}: {verificationError}
          </div>
        ) : null}

        <LoginForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t.footerText}{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t.footerAction}
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
