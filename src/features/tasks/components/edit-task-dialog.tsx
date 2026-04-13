"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  // 手动控制弹窗开关
  const [open, setOpen] = useState(false);

  // 本地表单状态：
  // 初始值先来自当前这条任务的 title / description
  const [nextTitle, setNextTitle] = useState(title);
  const [nextDescription, setNextDescription] = useState(description ?? "");

  // 控制“保存中...”状态
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    // 当弹窗被打开时，重新把“当前任务的最新值”灌进表单。
    // 这样可以避免用 useEffect 同步 props -> state，
    // 也能保证你每次打开弹窗时看到的是最新数据。
    if (nextOpen) {
      setNextTitle(title);
      setNextDescription(description ?? "");
    }

    setOpen(nextOpen);
  }

  function handleSubmit() {
    // 这里做一个很轻的前端校验，避免空标题直接提交
    if (!nextTitle.trim()) {
      toast.error("任务标题不能为空");
      return;
    }

    const formData = new FormData();

    // 把当前编辑后的值传给服务端 action
    formData.set("id", id);
    formData.set("title", nextTitle);
    formData.set("description", nextDescription);

    startTransition(async () => {
      const result = await updateTask(formData);

      if (result.success) {
        toast.success(result.message);

        // 保存成功后关闭弹窗
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* 用 shadcn/ui 的按钮作为弹窗触发器 */}
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          编辑
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑任务</DialogTitle>
          <DialogDescription>
            你可以修改任务标题和描述，保存后会同步更新到数据库。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-title-${id}`}>任务标题</Label>
            <Input
              id={`edit-title-${id}`}
              value={nextTitle}
              onChange={(event) => setNextTitle(event.target.value)}
              placeholder="请输入任务标题"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-description-${id}`}>任务描述</Label>
            <Textarea
              id={`edit-description-${id}`}
              value={nextDescription}
              onChange={(event) => setNextDescription(event.target.value)}
              placeholder="请输入任务描述"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            取消
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "保存中..." : "保存修改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
