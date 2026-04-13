import { TaskItem } from "@/features/tasks/components/task-item";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
};

type TaskListProps = {
  tasks: Task[];
  query?: string;
};

export async function TaskList({ tasks, query }: TaskListProps) {
  const locale = await getLocale();
  const t = getMessages(locale).tasks;

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-6 text-sm text-muted-foreground">
        {query ? t.emptyFiltered : t.empty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
