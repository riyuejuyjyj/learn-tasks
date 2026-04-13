"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type Locale, LOCALE_COOKIE_NAME } from "@/lib/i18n";

export const THEME_STORAGE_KEY = "task-flow-theme";

export type AppTheme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

type ThemeContextValue = {
  theme: AppTheme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: AppTheme) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);

type AppProvidersProps = {
  children: ReactNode;
  locale: Locale;
};

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function normalizeTheme(value?: string | null): AppTheme {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

function applyTheme(theme: AppTheme, systemTheme: ResolvedTheme) {
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const root = document.documentElement;

  root.dataset.themeMode = theme;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

function getInitialTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "system";
  }

  return normalizeTheme(document.documentElement.dataset.themeMode);
}

function getInitialResolvedTheme(theme: AppTheme): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return theme === "system" ? getSystemTheme() : theme;
}

export function AppProviders({ children, locale }: AppProvidersProps) {
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [theme, setThemeState] = useState<AppTheme>(() => getInitialTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    getInitialResolvedTheme(getInitialTheme()),
  );

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = normalizeTheme(
      window.localStorage.getItem(THEME_STORAGE_KEY),
    );
    const systemTheme = getSystemTheme();

    setThemeState(storedTheme);
    setResolvedTheme(applyTheme(storedTheme, systemTheme));

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const activeTheme = normalizeTheme(
        document.documentElement.dataset.themeMode ??
          window.localStorage.getItem(THEME_STORAGE_KEY),
      );
      const nextSystemTheme = getSystemTheme();
      if (activeTheme === "system") {
        setThemeState("system");
        setResolvedTheme(applyTheme("system", nextSystemTheme));
      } else {
        setThemeState(activeTheme);
        setResolvedTheme(activeTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const localeValue = useMemo(
    () => ({
      locale: currentLocale,
      setLocale: (nextLocale: Locale) => {
        document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        setCurrentLocale(nextLocale);
      },
    }),
    [currentLocale],
  );

  const themeValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme: AppTheme) => {
        const systemTheme = getSystemTheme();
        const nextResolvedTheme = applyTheme(nextTheme, systemTheme);

        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        setThemeState(nextTheme);
        setResolvedTheme(nextResolvedTheme);
      },
    }),
    [resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <LocaleContext.Provider value={localeValue}>{children}</LocaleContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useAppLocale must be used within AppProviders.");
  }

  return context;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppProviders.");
  }

  return context;
}
