import Link from 'next/link'
import { Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DeleteArticleButton } from './delete-article-button'
import type { Article } from '@/types/article'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function ArticleTable({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="bg-background rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          아직 등록된 기사가 없습니다.
        </p>
        <Link
          href="/admin/articles/new"
          className="text-primary mt-3 inline-block text-sm font-medium hover:underline"
        >
          첫 기사 작성하기 →
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* 데스크탑: 테이블 */}
      <div className="hidden md:block">
        <div className="bg-background overflow-hidden rounded-lg border">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">썸네일</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-36">발행일</TableHead>
                <TableHead className="w-36 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map(article => (
                <TableRow key={article.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.thumbnail_url}
                      alt=""
                      className="h-12 w-20 rounded object-cover"
                      loading="lazy"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={article.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate hover:underline"
                    >
                      {article.title}
                    </a>
                    <p className="text-muted-foreground mt-1 truncate text-xs">
                      {article.lead}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(article.published_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Pencil className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">수정</span>
                      </Link>
                    </Button>
                    <DeleteArticleButton
                      id={article.id}
                      title={article.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="space-y-3 md:hidden">
        {articles.map(article => (
          <div key={article.id} className="bg-background rounded-lg border p-3">
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail_url}
                alt=""
                className="h-16 w-24 flex-shrink-0 rounded object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatDate(article.published_at)}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
              {article.lead}
            </p>
            <div className="mt-3 flex justify-end gap-1 border-t pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/articles/${article.id}/edit`}>
                  <Pencil className="mr-1 h-4 w-4" />
                  수정
                </Link>
              </Button>
              <DeleteArticleButton id={article.id} title={article.title} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
