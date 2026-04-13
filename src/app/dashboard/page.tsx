import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Interactive3DCard } from "@/components/ui/interactive-3d-card";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { TaskPagination } from "@/features/tasks/components/task-pagination";
import { TaskSearchForm } from "@/features/tasks/components/task-search-form";
import { getTasks, getTasksCount } from "@/features/tasks/queries";
import { getServerSession } from "@/lib/auth-server";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type DashboardPageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 5;

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const [session, locale] = await Promise.all([getServerSession(), getLocale()]);

  if (!session?.user) {
    redirect("/login");
  }

  const t = getMessages(locale).dashboard;
  const params = await searchParams;
  const query = params?.q ?? "";
  const rawPage = Number(params?.page ?? "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [allTasks, totalCount] = await Promise.all([
    getTasks({
      query,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    getTasksCount({ query }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{t.eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.title}, {session.user.name}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">{t.description}</p>
        </section>

        <section className="mb-6">
          <Interactive3DCard depth="subtle">
            <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
              <CardHeader className="card-3d-layer-2">
                <CardTitle>{t.searchTitle}</CardTitle>
                <CardDescription>{t.searchDescription}</CardDescription>
              </CardHeader>
              <CardContent className="card-3d-layer-1">
                <TaskSearchForm defaultValue={query} />
              </CardContent>
            </Card>
          </Interactive3DCard>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section>
            <Interactive3DCard depth="subtle">
              <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
                <CardHeader className="card-3d-layer-2">
                  <CardTitle>{t.createTitle}</CardTitle>
                  <CardDescription>{t.createDescription}</CardDescription>
                </CardHeader>
                <CardContent className="card-3d-layer-1">
                  <CreateTaskForm />
                </CardContent>
              </Card>
            </Interactive3DCard>
          </section>

          <section>
            <Interactive3DCard depth="subtle">
              <Card className="rounded-[28px] border-border/70 bg-card/70 shadow-sm backdrop-blur">
                <CardHeader className="card-3d-layer-2">
                  <CardTitle>{t.listTitle}</CardTitle>
                  <CardDescription>
                    {t.listDescription({ totalCount, query })}
                  </CardDescription>
                </CardHeader>

                <CardContent className="card-3d-layer-1 space-y-4">
                  <TaskList tasks={allTasks} query={query} />

                  <TaskPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    query={query}
                  />
                </CardContent>
              </Card>
            </Interactive3DCard>
          </section>
        </div>
      </div>
    </main>
  );
}
