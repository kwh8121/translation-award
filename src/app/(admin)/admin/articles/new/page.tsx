import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ArticleForm } from '@/components/admin/article-form'

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          목록으로
        </Link>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">새 기사 작성</h1>
      </div>
      <ArticleForm />
    </div>
  )
}
