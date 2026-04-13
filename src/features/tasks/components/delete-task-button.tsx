"use client";

import { useTransition } from "react";
import { toast } from "sonner";

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

type DeleteTaskButtonProps = {
  id: string;
};

export function DeleteTaskButton({ id }: DeleteTaskButtonProps) {
  // 用来处理异步删除中的按钮状态
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      {/* 这个按钮只是“打开确认弹窗”，并不会立刻删除 */}
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          删除
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除这条任务吗？</AlertDialogTitle>
          <AlertDialogDescription>
            删除后将无法恢复。请确认你真的要删除这条任务。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* 取消按钮：关闭弹窗，不执行删除 */}
          <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>

          {/* 这里不用 form 了，直接在确认按钮点击时调用删除 action */}
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              // 阻止 AlertDialogAction 默认立即关闭后不受控提交的行为，
              // 我们自己在这里处理异步删除逻辑。
              event.preventDefault();

              const formData = new FormData();
              formData.set("id", id);

              startTransition(async () => {
                const result = await deleteTask(formData);

                if (result.success) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              });
            }}
          >
            {isPending ? "删除中..." : "确认删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
