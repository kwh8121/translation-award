import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AwardCeremonyTable } from '@/components/admin/award-ceremony-table'
import { createClient } from '@/lib/supabase/server'
import type { AwardCeremony } from '@/types/award-ceremony'

export const dynamic = 'force-dynamic'

export default async function AdminAwardCeremoniesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('award_ceremonies')
    .select('*')
    .order('published_at', { ascending: false })

  const items = (data ?? []) as AwardCeremony[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">어워드 관리</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            전체 {items.length}개
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/awards/new">
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">새 어워드</span>
          </Link>
        </Button>
      </div>

      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
          어워드를 불러오지 못했습니다: {error.message}
        </div>
      )}

      <AwardCeremonyTable items={items} />
    </div>
  )
}
