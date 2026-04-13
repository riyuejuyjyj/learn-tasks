import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { TaskPagination } from "@/features/tasks/components/task-pagination";
import { TaskSearchForm } from "@/features/tasks/components/task-search-form";
import { getTasks, getTasksCount } from "@/features/tasks/queries";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 5;

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params?.q ?? "";

  // 从 URL 中取出 page，并做一次基础保护
  const rawPage = Number(params?.page ?? "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  // 同时查询：
  // 1. 当前页的数据
  // 2. 当前搜索条件下的总条数
  const [allTasks, totalCount] = await Promise.all([
    getTasks({
      query,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    getTasksCount({ query }),
  ]);

  // 至少保证 totalPages 为 1，避免出现“共 0 页”的奇怪显示
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="space-y-6">
          <section>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>搜索任务</CardTitle>
                <CardDescription>
                  你可以按任务标题或描述进行搜索。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskSearchForm defaultValue={query} />
              </CardContent>
            </Card>
          </section>

          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
            <section>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>创建任务</CardTitle>
                  <CardDescription>
                    填写下面的表单，把新任务保存到数据库。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateTaskForm />
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>任务列表</CardTitle>
                  <CardDescription>
                    {query
                      ? `当前显示与“${query}”相关的任务结果，共 ${totalCount} 条。`
                      : `这里展示数据库里已经保存的任务，共 ${totalCount} 条。`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <TaskList tasks={allTasks} />

                  <TaskPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    query={query}
                  />
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
