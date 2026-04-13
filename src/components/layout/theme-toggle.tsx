"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";

import { useAppLocale, useAppTheme } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMessages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function ThemeToggle() {
  const { locale } = useAppLocale();
  const { setTheme, theme } = useAppTheme();
  const t = getMessages(locale).theme;
  const ActiveIcon = themeIcons[theme];

  const options = [
    { value: "light", label: t.light, icon: Sun },
    { value: "dark", label: t.dark, icon: Moon },
    { value: "system", label: t.system, icon: Monitor },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full border-border/70 bg-background/80 backdrop-blur"
          aria-label={t.label}
        >
          <ActiveIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-2xl border-border/70 bg-popover/95 p-2 backdrop-blur"
      >
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <DropdownMenuItem
              key={option.value}
              className="rounded-xl px-3 py-2.5"
              onSelect={() => setTheme(option.value)}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{option.label}</span>
                </span>
                <Check
                  className={cn("size-4", theme === option.value ? "opacity-100" : "opacity-0")}
                />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
