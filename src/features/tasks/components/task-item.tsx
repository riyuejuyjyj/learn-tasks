"use client";

import { DeleteTaskButton } from "@/features/tasks/components/delete-task-button";
import { EditTaskDialog } from "@/features/tasks/components/edit-task-dialog";
import { ToggleTaskButton } from "@/features/tasks/components/toggle-task-button";
import { useAppLocale } from "@/components/providers/app-providers";
import { formatLocaleDate, getMessages } from "@/lib/i18n";

type TaskItemProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
  };
};

export function TaskItem({ task }: TaskItemProps) {
  const { locale } = useAppLocale();
  const t = getMessages(locale).tasks;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-base font-medium text-card-foreground">{task.title}</p>
          <p className="text-sm text-muted-foreground">
            {task.description || t.noDescription}
          </p>
          <p className="text-xs text-muted-foreground/80">
            {t.createdAt}: {formatLocaleDate(locale, task.createdAt)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              task.completed
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {task.completed ? t.completed : t.pending}
          </span>

          <div className="flex flex-wrap justify-end gap-2">
            <EditTaskDialog
              id={task.id}
              title={task.title}
              description={task.description}
            />
            <ToggleTaskButton id={task.id} completed={task.completed} />
            <DeleteTaskButton id={task.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
