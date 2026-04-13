// 它只负责：

// “渲染任务列表”

// 逻辑很简单：

// 没有任务 → 显示空状态
// 有任务 → 循环渲染 TaskItem

// 这就是很经典的“列表组件 + 列表项组件”拆法。

import { TaskItem } from "@/features/tasks/components/task-item";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
};

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  // 空状态单独放在列表组件里，
  // 这样 page.tsx 不需要关心“有数据还是没数据”的展示细节。
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-6 text-sm text-slate-500">
        暂无任务。现在你可以在左侧表单中创建第一条任务。
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
