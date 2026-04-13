import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type TaskSearchFormProps = {
  defaultValue?: string;
};

export function TaskSearchForm({ defaultValue }: TaskSearchFormProps) {
  return (
    // 这里用普通 GET 表单：
    // 提交后会把 name="q" 的值拼到 URL 上，例如 /?q=next
    <form className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        {/* 搜索图标放在输入框左边，提升可读性 */}
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder="搜索任务标题或描述"
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">搜索</Button>

        {/* 清空搜索最简单的方式：
           直接跳回首页，不带 q 参数 */}
        <Button type="button" variant="outline" asChild>
          <Link href="/">清空</Link>
        </Button>
      </div>
    </form>
  );
}
