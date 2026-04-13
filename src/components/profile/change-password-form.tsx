"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ChangePasswordForm() {
  // 三个输入框分别管理：
  // 当前密码 / 新密码 / 确认新密码
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !next || !confirm) {
      toast.error("请完整填写所有密码字段");
      return;
    }

    if (next.length < 8) {
      toast.error("新密码至少需要 8 位");
      return;
    }

    if (next !== confirm) {
      toast.error("两次输入的新密码不一致");
      return;
    }

    if (current === next) {
      toast.error("新密码不能与当前密码相同");
      return;
    }

    setIsPending(true);

    try {
      // Better Auth 官方客户端改密码方法：
      // 需要 currentPassword 和 newPassword。
      // revokeOtherSessions 为 true 时，其他活跃会话会被失效。
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "修改密码失败");
        return;
      }

      toast.success("密码修改成功");

      // 修改成功后清空表单，避免敏感信息留在输入框里
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("修改密码失败，请稍后重试");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="current-password" className="text-slate-700">
          当前密码
        </Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="请输入当前密码"
          autoComplete="current-password"
          className="h-11 rounded-2xl border-slate-200 bg-white/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="new-password" className="text-slate-700">
          新密码
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="请输入新密码"
          autoComplete="new-password"
          className="h-11 rounded-2xl border-slate-200 bg-white/80 shadow-sm"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="confirm-password" className="text-slate-700">
          确认新密码
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="请再次输入新密码"
          autoComplete="new-password"
          className="h-11 rounded-2xl border-slate-200 bg-white/80 shadow-sm"
        />
      </div>

      <p className="text-xs leading-6 text-slate-400">
        修改成功后，其他登录会话将被自动退出，以提高账号安全性。
      </p>

      <Button
        type="submit"
        className="h-11 rounded-full px-6 shadow-sm"
        disabled={isPending}
      >
        {isPending ? "修改中..." : "修改密码"}
      </Button>
    </form>
  );
}
