import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ArticleForm } from '@/components/admin/article-form'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/types/article'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single<Article>()

  if (error || !data) {
    notFound()
  }

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
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">기사 수정</h1>
      </div>
      <ArticleForm article={data} />
    </div>
  )
}
