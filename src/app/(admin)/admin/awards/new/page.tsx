import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AwardCeremonyForm } from '@/components/admin/award-ceremony-form'

export default function NewAwardCeremonyPage() {
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
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">새 어워드 작성</h1>
      </div>
      <AwardCeremonyForm />
    </div>
  )
}
