import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

type TaskPaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

function buildPageHref(page: number, query?: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `/dashboard?${search}` : "/dashboard";
}

export async function TaskPagination({
  currentPage,
  totalPages,
  query,
}: TaskPaginationProps) {
  const locale = await getLocale();
  const t = getMessages(locale).tasks;

  if (totalPages <= 1) {
    return null;
  }

  const previousHref = buildPageHref(currentPage - 1, query);
  const nextHref = buildPageHref(currentPage + 1, query);

  return (
    <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {t.pageLabel({ currentPage, totalPages })}
      </p>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious href={previousHref} text={t.previousPage} />
            ) : (
              <PaginationLink
                href="#"
                size="default"
                className="pointer-events-none opacity-50"
              >
                {t.previousPage}
              </PaginationLink>
            )}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href={buildPageHref(currentPage, query)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext href={nextHref} text={t.nextPage} />
            ) : (
              <PaginationLink
                href="#"
                size="default"
                className="pointer-events-none opacity-50"
              >
                {t.nextPage}
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
