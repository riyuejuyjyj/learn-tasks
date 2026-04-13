"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { toggleTaskCompleted } from "@/features/tasks/actions";
import { getMessages } from "@/lib/i18n";

type ToggleTaskButtonProps = {
  id: string;
  completed: boolean;
};

export function ToggleTaskButton({ id, completed }: ToggleTaskButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await toggleTaskCompleted(formData);

          if (result.success) {
            toast.success(result.message);
            return;
          }

          toast.error(result.message);
        });
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="completed" value={String(completed)} />

      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? t.togglePending : completed ? t.markPending : t.markComplete}
      </Button>
    </form>
  );
}
