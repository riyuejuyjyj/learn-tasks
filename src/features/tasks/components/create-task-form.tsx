"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask, type ActionResult } from "@/features/tasks/actions";
import { getMessages } from "@/lib/i18n";

const initialState: ActionResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? t.createSubmitting : t.createSubmit}
    </Button>
  );
}

export function CreateTaskForm() {
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;
  const [state, formAction] = useActionState(createTask, initialState);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">{t.createTitleLabel}</Label>
        <Input
          id="title"
          name="title"
          placeholder={t.createTitlePlaceholder}
          required
          className="border-border/70 bg-background/80"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t.createDescriptionLabel}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t.createDescriptionPlaceholder}
          rows={4}
          className="border-border/70 bg-background/80"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
