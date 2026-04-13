import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { AppNavbar } from "@/components/layout/app-navbar";
import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import { getLocale } from "@/lib/i18n/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Flow",
  description: "A polished task manager built with Next.js and shadcn/ui.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            const storageKey = "task-flow-theme";
            const root = document.documentElement;
            const stored = localStorage.getItem(storageKey);
            const theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
            const resolved = theme === "system"
              ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
              : theme;

            root.dataset.themeMode = theme;
            root.classList.toggle("dark", resolved === "dark");
            root.style.colorScheme = resolved;
          })();`}
        </Script>
        <AppProviders locale={locale}>
          <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(241,245,249,0.9)_42%,rgba(248,250,252,1)_100%)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.96),rgba(2,6,23,0.98)_48%,rgba(2,6,23,1)_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.08))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.03))]" />
            <AppNavbar />
            {children}
            <Toaster position="top-right" />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
