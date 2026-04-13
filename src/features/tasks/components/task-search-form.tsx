import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type TaskSearchFormProps = {
  defaultValue?: string;
};

export async function TaskSearchForm({ defaultValue }: TaskSearchFormProps) {
  const locale = await getLocale();
  const t = getMessages(locale).tasks;

  return (
    <form className="flex flex-col gap-3 sm:flex-row" action="/dashboard">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder={t.searchPlaceholder}
          className="border-border/70 bg-background/80 pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">{t.searchSubmit}</Button>

        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard">{t.searchClear}</Link>
        </Button>
      </div>
    </form>
  );
}
