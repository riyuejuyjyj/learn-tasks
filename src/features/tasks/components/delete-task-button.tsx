"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { useAppLocale } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTask } from "@/features/tasks/actions";
import { getMessages } from "@/lib/i18n";

type DeleteTaskButtonProps = {
  id: string;
};

export function DeleteTaskButton({ id }: DeleteTaskButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {t.delete}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-border/70 bg-popover/95">
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();

              const formData = new FormData();
              formData.set("id", id);

              startTransition(async () => {
                const result = await deleteTask(formData);

                if (result.success) {
                  toast.success(result.message);
                  return;
                }

                toast.error(result.message);
              });
            }}
          >
            {isPending ? t.deleting : t.deleteConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
