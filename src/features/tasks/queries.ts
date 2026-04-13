import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getServerSession } from "@/lib/auth-server";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";

type GetTasksOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

// 把搜索条件提取成函数，避免重复写
function getSearchFilter(query?: string) {
  const value = query?.trim();

  if (!value) {
    return undefined;
  }

  return or(
    ilike(tasks.title, `%${value}%`),
    ilike(tasks.description, `%${value}%`),
  );
}

export async function getTasks(options?: GetTasksOptions) {
  const session = await getServerSession();

  // 没登录时，直接返回空数组
  if (!session?.user) {
    return [];
  }

  const query = options?.query?.trim();
  const page = options?.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options?.pageSize && options.pageSize > 0 ? options.pageSize : 5;

  const offset = (page - 1) * pageSize;
  const searchFilter = getSearchFilter(query);

  // 至少要按 userId 过滤，保证只能看到自己的任务
  const ownerFilter = eq(tasks.userId, session.user.id);

  if (searchFilter) {
    return db
      .select()
      .from(tasks)
      .where(and(ownerFilter, searchFilter))
      .orderBy(desc(tasks.createdAt))
      .limit(pageSize)
      .offset(offset);
  }

  return db
    .select()
    .from(tasks)
    .where(ownerFilter)
    .orderBy(desc(tasks.createdAt))
    .limit(pageSize)
    .offset(offset);
}

export async function getTasksCount(options?: { query?: string }) {
  const session = await getServerSession();

  if (!session?.user) {
    return 0;
  }

  const query = options?.query?.trim();
  const searchFilter = getSearchFilter(query);
  const ownerFilter = eq(tasks.userId, session.user.id);

  const baseQuery = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(tasks);

  const result = searchFilter
    ? await baseQuery.where(and(ownerFilter, searchFilter))
    : await baseQuery.where(ownerFilter);

  return Number(result[0]?.count ?? 0);
}
