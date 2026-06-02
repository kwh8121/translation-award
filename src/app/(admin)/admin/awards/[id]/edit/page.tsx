import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { AwardCeremonyForm } from '@/components/admin/award-ceremony-form'
import { createClient } from '@/lib/supabase/server'
import type { AwardCeremony } from '@/types/award-ceremony'

export default async function EditAwardCeremonyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('award_ceremonies')
    .select('*')
    .eq('id', id)
    .single<AwardCeremony>()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/awards"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          목록으로
        </Link>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">어워드 수정</h1>
      </div>
      <AwardCeremonyForm item={data} />
    </div>
  )
}
