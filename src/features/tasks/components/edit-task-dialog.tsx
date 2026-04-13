"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTask } from "@/features/tasks/actions";
import { getMessages } from "@/lib/i18n";

type EditTaskDialogProps = {
  id: string;
  title: string;
  description: string | null;
};

export function EditTaskDialog({
  id,
  title,
  description,
}: EditTaskDialogProps) {
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;
  const [open, setOpen] = useState(false);
  const [nextTitle, setNextTitle] = useState(title);
  const [nextDescription, setNextDescription] = useState(description ?? "");
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setNextTitle(title);
      setNextDescription(description ?? "");
    }

    setOpen(nextOpen);
  }

  function handleSubmit() {
    if (!nextTitle.trim()) {
      toast.error(t.taskTitleMissing);
      return;
    }

    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", nextTitle);
    formData.set("description", nextDescription);

    startTransition(async () => {
      const result = await updateTask(formData);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          {t.edit}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border/70 bg-popover/95">
        <DialogHeader>
          <DialogTitle>{t.editTitle}</DialogTitle>
          <DialogDescription>{t.editDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-title-${id}`}>{t.createTitleLabel}</Label>
            <Input
              id={`edit-title-${id}`}
              value={nextTitle}
              onChange={(event) => setNextTitle(event.target.value)}
              placeholder={t.createTitlePlaceholder}
              className="border-border/70 bg-background/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-description-${id}`}>{t.createDescriptionLabel}</Label>
            <Textarea
              id={`edit-description-${id}`}
              value={nextDescription}
              onChange={(event) => setNextDescription(event.target.value)}
              placeholder={t.createDescriptionPlaceholder}
              rows={4}
              className="border-border/70 bg-background/80"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t.cancel}
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? t.editSaving : t.editSave}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
