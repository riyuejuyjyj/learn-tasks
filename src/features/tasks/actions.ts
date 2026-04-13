"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";

// 统一定义 action 返回结构
export type ActionResult = {
  success: boolean;
  message: string;
};

export async function createTask(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // 从表单中取出 title / description
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  // 服务端兜底校验
  if (!title) {
    return {
      success: false,
      message: "任务标题不能为空",
    };
  }

  // 插入数据库
  await db.insert(tasks).values({
    title,
    description: description || null,
  });

  // 首页数据变了，通知 Next.js 重新获取
  revalidatePath("/");

  return {
    success: true,
    message: "任务创建成功",
  };
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  // 编辑时需要知道“改哪一条任务”
  const id = formData.get("id")?.toString();

  // 取出编辑后的标题和描述
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!id) {
    return {
      success: false,
      message: "任务 id 不存在",
    };
  }

  // 编辑时标题同样不能为空
  if (!title) {
    return {
      success: false,
      message: "任务标题不能为空",
    };
  }

  // 更新数据库中的任务内容
  await db
    .update(tasks)
    .set({
      title,
      description: description || null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));

  revalidatePath("/");

  return {
    success: true,
    message: "任务更新成功",
  };
}

export async function toggleTaskCompleted(
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id")?.toString();
  const completedValue = formData.get("completed")?.toString();

  if (!id) {
    return {
      success: false,
      message: "任务 id 不存在",
    };
  }

  // 当前值如果是 true，下一次就设为 false；反之设为 true
  const nextCompleted = completedValue !== "true";

  await db
    .update(tasks)
    .set({
      completed: nextCompleted,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));

  revalidatePath("/");

  return {
    success: true,
    message: nextCompleted ? "任务已标记为完成" : "任务已恢复为未完成",
  };
}

export async function deleteTask(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")?.toString();

  if (!id) {
    return {
      success: false,
      message: "任务 id 不存在",
    };
  }

  await db.delete(tasks).where(eq(tasks.id, id));

  revalidatePath("/");

  return {
    success: true,
    message: "任务已删除",
  };
}
