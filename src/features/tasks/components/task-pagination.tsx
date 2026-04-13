import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TaskPaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

function buildPageHref(page: number, query?: string) {
  const params = new URLSearchParams();

  // 保留搜索词，避免翻页后搜索条件丢失
  if (query) {
    params.set("q", query);
  }

  // 只有页码大于 1 时才写进 URL，
  // 这样第一页保持更干净的 URL
  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `/?${search}` : "/";
}

export function TaskPagination({
  currentPage,
  totalPages,
  query,
}: TaskPaginationProps) {
  // 只有 1 页时，不显示分页
  if (totalPages <= 1) {
    return null;
  }

  const previousHref = buildPageHref(currentPage - 1, query);
  const nextHref = buildPageHref(currentPage + 1, query);

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 左边显示当前页信息 */}
      <p className="text-sm text-slate-500">
        第 {currentPage} 页，共 {totalPages} 页
      </p>

      {/* 右边用 shadcn/ui 的 Pagination 组件来渲染 UI */}
      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious href={previousHref} text="上一页" />
            ) : (
              // 当前已经是第一页时，用“不可点击”的样式占位，
              // 避免布局跳动。
              <PaginationLink
                href="#"
                size="default"
                className="pointer-events-none opacity-50"
              >
                上一页
              </PaginationLink>
            )}
          </PaginationItem>

          <PaginationItem>
            {/* 当前页码高亮显示 */}
            <PaginationLink href={buildPageHref(currentPage, query)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext href={nextHref} text="下一页" />
            ) : (
              // 当前已经是最后一页时，同样显示禁用态占位
              <PaginationLink
                href="#"
                size="default"
                className="pointer-events-none opacity-50"
              >
                下一页
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
