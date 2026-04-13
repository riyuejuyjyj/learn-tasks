import "server-only";

import { desc, ilike, or, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";

type GetTasksOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

// 把“搜索条件”单独提出来，避免在多个查询里重复写一遍
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
  const query = options?.query?.trim();
  const page = options?.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options?.pageSize && options.pageSize > 0 ? options.pageSize : 5;

  // 计算从第几条开始取数据
  const offset = (page - 1) * pageSize;

  const searchFilter = getSearchFilter(query);

  const baseQuery = db.select().from(tasks);

  if (searchFilter) {
    return baseQuery
      .where(searchFilter)
      .orderBy(desc(tasks.createdAt))
      .limit(pageSize)
      .offset(offset);
  }

  return baseQuery
    .orderBy(desc(tasks.createdAt))
    .limit(pageSize)
    .offset(offset);
}

export async function getTasksCount(options?: { query?: string }) {
  const query = options?.query?.trim();
  const searchFilter = getSearchFilter(query);

  const baseQuery = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(tasks);

  const result = searchFilter
    ? await baseQuery.where(searchFilter)
    : await baseQuery;

  return Number(result[0]?.count ?? 0);
}
