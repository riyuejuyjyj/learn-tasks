"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { toggleTaskCompleted } from "@/features/tasks/actions";

type ToggleTaskButtonProps = {
  id: string;
  completed: boolean;
};

export function ToggleTaskButton({ id, completed }: ToggleTaskButtonProps) {
  // useTransition 适合处理这类“点击按钮 -> 调 action -> 给反馈”的场景
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await toggleTaskCompleted(formData);

          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        });
      }}
    >
      {/* 用 hidden input 把当前任务信息带给服务端 */}
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="completed" value={String(completed)} />

      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? "处理中..." : completed ? "设为未完成" : "标记完成"}
      </Button>
    </form>
  );
}
