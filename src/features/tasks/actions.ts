"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth-server";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function createTask(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);
  const t = getMessages(locale).tasks;

  if (!session?.user) {
    return {
      success: false,
      message: t.authRequiredCreate,
    };
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title) {
    return {
      success: false,
      message: t.taskTitleMissing,
    };
  }

  await db.insert(tasks).values({
    userId: session.user.id,
    title,
    description: description || null,
  });

  revalidatePath("/dashboard");

  return {
    success: true,
    message: t.taskCreated,
  };
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);
  const t = getMessages(locale).tasks;

  if (!session?.user) {
    return {
      success: false,
      message: t.authRequiredUpdate,
    };
  }

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!id) {
    return {
      success: false,
      message: t.taskIdMissing,
    };
  }

  if (!title) {
    return {
      success: false,
      message: t.taskTitleMissing,
    };
  }

  const result = await db
    .update(tasks)
    .set({
      title,
      description: description || null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning({ id: tasks.id });

  if (result.length === 0) {
    return {
      success: false,
      message: t.taskNotFound,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: t.taskUpdated,
  };
}

export async function toggleTaskCompleted(
  formData: FormData,
): Promise<ActionResult> {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);
  const t = getMessages(locale).tasks;

  if (!session?.user) {
    return {
      success: false,
      message: t.authRequiredToggle,
    };
  }

  const id = formData.get("id")?.toString();
  const completedValue = formData.get("completed")?.toString();

  if (!id) {
    return {
      success: false,
      message: t.taskIdMissing,
    };
  }

  const nextCompleted = completedValue !== "true";

  const result = await db
    .update(tasks)
    .set({
      completed: nextCompleted,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning({ id: tasks.id });

  if (result.length === 0) {
    return {
      success: false,
      message: t.taskNotFound,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: nextCompleted ? t.taskCompleted : t.taskReopened,
  };
}

export async function deleteTask(formData: FormData): Promise<ActionResult> {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);
  const t = getMessages(locale).tasks;

  if (!session?.user) {
    return {
      success: false,
      message: t.authRequiredDelete,
    };
  }

  const id = formData.get("id")?.toString();

  if (!id) {
    return {
      success: false,
      message: t.taskIdMissing,
    };
  }

  const result = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning({ id: tasks.id });

  if (result.length === 0) {
    return {
      success: false,
      message: t.taskNotFound,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: t.taskDeleted,
  };
}
