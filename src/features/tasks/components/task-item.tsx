//它只负责：

// “渲染一条任务卡片”

// 也就是说，以后你看到一条任务的标题、描述、时间、状态、按钮，全都在这里维护。

// 这样有两个好处：

// 以后想改任务卡片样式，不用去翻很长的 page.tsx
// 后面如果要加“优先级”“标签”“负责人”，改这里就行

import { DeleteTaskButton } from "@/features/tasks/components/delete-task-button";
import { EditTaskDialog } from "@/features/tasks/components/edit-task-dialog";
import { ToggleTaskButton } from "@/features/tasks/components/toggle-task-button";
import { formatDate } from "@/lib/utils";

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
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {/* 任务标题：最重要的信息，所以字号和颜色都更突出 */}
          <p className="text-base font-medium text-slate-900">{task.title}</p>

          {/* 描述是辅助信息，颜色比标题更淡 */}
          <p className="text-sm text-slate-500">
            {task.description || "暂无描述"}
          </p>

          {/* 时间信息层级最低，所以用更小的字号和更浅的颜色 */}
          <p className="text-xs text-slate-400">
            创建于 {formatDate(task.createdAt)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              task.completed
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {task.completed ? "已完成" : "未完成"}
          </span>

          {/* 操作按钮组：
             编辑 / 切换状态 / 删除 都放在这里，方便后面继续扩展 */}
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
