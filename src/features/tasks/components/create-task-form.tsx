"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask, type ActionResult } from "@/features/tasks/actions";

const initialState: ActionResult | null = null;

function SubmitButton() {
  // useFormStatus 只能在 form 内部子组件里使用，
  // 用来读取当前表单是否处于提交中。
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {/* 提交中给用户更明确的反馈 */}
      {pending ? "创建中..." : "创建任务"}
    </Button>
  );
}

export function CreateTaskForm() {
  // useActionState 会调用 server action，
  // 并拿到 action 返回的结果 state。
  const [state, formAction] = useActionState(createTask, initialState);

  useEffect(() => {
    if (!state) return;

    // 根据 action 返回结果弹出不同 toast
    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">任务标题</Label>
        <Input
          id="title"
          name="title"
          placeholder="例如：完成 Next.js 任务页"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">任务描述</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="可以简单写一下这条任务要做什么"
          rows={4}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
