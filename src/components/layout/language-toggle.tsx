"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getMessages, type Locale } from "@/lib/i18n";
import { useAppLocale } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const router = useRouter();
  const { locale, setLocale } = useAppLocale();
  const t = getMessages(locale).language;

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    setLocale(nextLocale);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur">
      <span className="sr-only">{t.label}</span>
      <div className="flex items-center gap-1 px-2 text-muted-foreground">
        <Languages className="size-4" />
      </div>

      {(["en", "zh"] as const).map((option) => (
        <Button
          key={option}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full px-3 text-xs font-medium",
            locale === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => handleChange(option)}
        >
          {getMessages(option).language[option]}
        </Button>
      ))}
    </div>
  );
}
