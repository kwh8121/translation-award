import { AwardCeremonyRow } from '@/components/embed/award-ceremony-row'
import { EmbedPagination } from '@/components/embed/embed-pagination'
import { HeightReporter } from '@/components/embed/height-reporter'
import { createClient } from '@/lib/supabase/server'
import type { AwardCeremony } from '@/types/award-ceremony'

const PAGE_SIZE = 9

export const dynamic = 'force-dynamic'

export default async function EmbedAwardsPage({
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
    .from('award_ceremonies')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  const items = (data ?? []) as AwardCeremony[]
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="mx-auto max-w-screen-xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      {error && (
        <div className="rounded-md border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-200">
          어워드를 불러오지 못했습니다.
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-12 text-center text-sm text-zinc-500">
          아직 등록된 어워드가 없습니다.
        </div>
      )}

      {items.length > 0 && (
        <div className="flex flex-col">
          {items.map(item => (
            <AwardCeremonyRow key={item.id} item={item} />
          ))}
        </div>
      )}

      <EmbedPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/embed/awards"
      />
      <HeightReporter messageType="award-ceremony:height" />
    </div>
  )
}
