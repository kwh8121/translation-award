import { ArticleCard } from '@/components/embed/article-card'
import { EmbedPagination } from '@/components/embed/embed-pagination'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/types/article'

const PAGE_SIZE = 9

export const dynamic = 'force-dynamic'

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  const articles = (data ?? []) as Article[]
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="mx-auto max-w-screen-xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          기사를 불러오지 못했습니다.
        </div>
      )}

      {!error && articles.length === 0 && (
        <div className="rounded-md border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">
          아직 등록된 기사가 없습니다.
        </div>
      )}

      {articles.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <EmbedPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
