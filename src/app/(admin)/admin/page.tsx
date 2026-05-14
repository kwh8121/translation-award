import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleTable } from '@/components/admin/article-table'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/types/article'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  const articles = (data ?? []) as Article[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">기사 관리</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            전체 {articles.length}개
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">새 기사</span>
          </Link>
        </Button>
      </div>

      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
          기사를 불러오지 못했습니다: {error.message}
        </div>
      )}

      <ArticleTable articles={articles} />
    </div>
  )
}
