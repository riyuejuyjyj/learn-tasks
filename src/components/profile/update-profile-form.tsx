"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type UpdateProfileFormProps = {
  defaultName: string;
  email: string;
};

export function UpdateProfileForm({
  defaultName,
  email,
}: UpdateProfileFormProps) {
  const router = useRouter();

  // 用本地状态管理表单输入
  const [name, setName] = useState(defaultName);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = name.trim();

    if (!nextName) {
      toast.error("用户名不能为空");
      return;
    }

    setIsPending(true);

    try {
      // Better Auth 客户端更新用户资料
      const { error } = await authClient.updateUser({
        name: nextName,
      });

      if (error) {
        toast.error(error.message || "更新失败");
        return;
      }

      toast.success("个人资料已更新");

      // 刷新当前页面，让服务端资料页和导航栏都拿到最新数据
      router.refresh();
    } catch {
      toast.error("更新失败，请稍后重试");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="profile-name" className="text-slate-700">
          用户名
        </Label>
        <Input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="请输入你的用户名"
          className="h-11 rounded-2xl border-slate-200 bg-white/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="profile-email" className="text-slate-700">
          邮箱
        </Label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          disabled
          className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-500 shadow-sm"
        />
        <p className="text-xs text-slate-400">
          当前这一步先只支持修改用户名，邮箱暂时只读。
        </p>
      </div>

      <Button
        type="submit"
        className="h-11 rounded-full px-6 shadow-sm"
        disabled={isPending}
      >
        {isPending ? "保存中..." : "保存修改"}
      </Button>
    </form>
  );
}
