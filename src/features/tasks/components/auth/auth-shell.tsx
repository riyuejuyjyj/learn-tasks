import { ReactNode } from "react";

import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export async function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  const locale = await getLocale();
  const t = getMessages(locale).authShell;

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-40px] top-[-80px] h-[240px] w-[240px] rounded-full bg-sky-200/55 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute right-[-60px] top-[120px] h-[220px] w-[220px] rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/12" />
        <div className="absolute bottom-[-100px] left-1/3 h-[240px] w-[240px] rounded-full bg-slate-300/35 blur-3xl dark:bg-slate-500/10" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <section className="hidden lg:block">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-border/70 bg-background/75 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
                {t.badge}
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                {t.title}
                <span className="mt-3 block text-muted-foreground">{t.accent}</span>
              </h1>

              <p className="max-w-xl text-base leading-8 text-muted-foreground">
                {t.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-medium text-card-foreground">{t.cardOneTitle}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t.cardOneDescription}
                </p>
              </div>

              <div className="rounded-[28px] border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-medium text-card-foreground">{t.cardTwoTitle}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t.cardTwoDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-6 space-y-3 text-center lg:hidden">
            <div className="inline-flex rounded-full border border-border/70 bg-background/75 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
              {t.badge}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>

            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>

          <div className="mb-6 hidden space-y-3 lg:block">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
