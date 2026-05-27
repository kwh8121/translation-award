import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageHref(page: number) {
  return page === 1 ? '/embed' : `/embed?page=${page}`
}

function buildPageList(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export function EmbedPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages
  const pages = buildPageList(currentPage, totalPages)

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-6 flex items-center justify-center gap-1 sm:gap-2"
    >
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-label="이전"
        aria-disabled={prevDisabled}
        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-2 text-sm text-zinc-300 transition hover:bg-zinc-800 ${
          prevDisabled ? 'pointer-events-none opacity-40' : ''
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* 데스크탑: 페이지 번호 */}
      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`e${i}`}
              className="px-2 text-sm text-zinc-500"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition ${
                p === currentPage
                  ? 'border-zinc-50 bg-zinc-50 text-zinc-950'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {/* 모바일: 현재/총 페이지만 */}
      <span className="px-2 text-sm text-zinc-400 sm:hidden">
        {currentPage} / {totalPages}
      </span>

      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-label="다음"
        aria-disabled={nextDisabled}
        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-2 text-sm text-zinc-300 transition hover:bg-zinc-800 ${
          nextDisabled ? 'pointer-events-none opacity-40' : ''
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
