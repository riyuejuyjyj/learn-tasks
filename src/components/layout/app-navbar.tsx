"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { useAppLocale } from "@/components/providers/app-providers";
import { authClient } from "@/lib/auth-client";
import { getMessages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { locale } = useAppLocale();
  const t = getMessages(locale);
  const isLoggedIn = Boolean(session?.user);

  const navItems = [
    { href: "/", label: t.nav.home },
    ...(isLoggedIn
      ? [{ href: "/dashboard", label: t.nav.dashboard }]
      : [
          { href: "/login", label: t.nav.login },
          { href: "/register", label: t.nav.register },
        ]),
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="glass-panel soft-glow mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-[28px] px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(51,65,85,0.9),rgba(14,116,144,0.85))] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(2,6,23,0.22)]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_58%)]" />
            <span className="relative">T</span>
          </div>

          <div className="hidden min-w-0 flex-col sm:flex">
            <span className="truncate text-sm font-semibold tracking-[0.16em] text-foreground/90 uppercase">
              {t.common.appName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {t.common.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-foreground text-background shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
