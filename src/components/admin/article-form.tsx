'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createArticle,
  updateArticle,
  type ArticleActionState,
} from '@/lib/actions/articles'
import type { Article } from '@/types/article'

const initialState: ArticleActionState = { status: 'idle' }

function toDateInputValue(iso: string) {
  // datetime-local input expects "YYYY-MM-DDTHH:mm"
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function ArticleForm({ article }: { article?: Article }) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle
  const [state, formAction, isPending] = useActionState(action, initialState)

  const [title, setTitle] = useState(article?.title ?? '')
  const [thumbnailUrl, setThumbnailUrl] = useState(article?.thumbnail_url ?? '')
  const [lead, setLead] = useState(article?.lead ?? '')
  const [articleUrl, setArticleUrl] = useState(article?.article_url ?? '')
  const [publishedAt, setPublishedAt] = useState(
    article
      ? toDateInputValue(article.published_at)
      : toDateInputValue(new Date().toISOString())
  )

  const fieldError = (
    key: keyof NonNullable<ArticleActionState['fieldErrors']>
  ) => state.fieldErrors?.[key]

  return (
    <form action={formAction} className="grid gap-6 md:grid-cols-[2fr_1fr]">
      {/* 메인: 입력 필드 */}
      <div className="space-y-4">
        {state.status === 'error' && state.message && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">
            제목 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            required
            disabled={isPending}
            aria-invalid={!!fieldError('title')}
          />
          <div className="flex justify-between text-xs">
            {fieldError('title') ? (
              <span className="text-destructive">{fieldError('title')}</span>
            ) : (
              <span className="text-muted-foreground">최대 100자</span>
            )}
            <span className="text-muted-foreground">{title.length}/100</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">
            썸네일 URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="thumbnail_url"
            name="thumbnail_url"
            type="url"
            placeholder="https://..."
            value={thumbnailUrl}
            onChange={e => setThumbnailUrl(e.target.value)}
            required
            disabled={isPending}
            aria-invalid={!!fieldError('thumbnail_url')}
          />
          {fieldError('thumbnail_url') && (
            <p className="text-destructive text-xs">
              {fieldError('thumbnail_url')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead">
            리드 <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="lead"
            name="lead"
            rows={4}
            value={lead}
            onChange={e => setLead(e.target.value)}
            maxLength={300}
            required
            disabled={isPending}
            aria-invalid={!!fieldError('lead')}
          />
          <div className="flex justify-between text-xs">
            {fieldError('lead') ? (
              <span className="text-destructive">{fieldError('lead')}</span>
            ) : (
              <span className="text-muted-foreground">최대 300자</span>
            )}
            <span className="text-muted-foreground">{lead.length}/300</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article_url">
            기사 URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="article_url"
            name="article_url"
            type="url"
            placeholder="https://thekoreatimes.imweb.me/..."
            value={articleUrl}
            onChange={e => setArticleUrl(e.target.value)}
            required
            disabled={isPending}
            aria-invalid={!!fieldError('article_url')}
          />
          {fieldError('article_url') && (
            <p className="text-destructive text-xs">
              {fieldError('article_url')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="published_at">
            발행일 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="published_at"
            name="published_at"
            type="datetime-local"
            value={publishedAt}
            onChange={e => setPublishedAt(e.target.value)}
            required
            disabled={isPending}
            aria-invalid={!!fieldError('published_at')}
          />
          {fieldError('published_at') && (
            <p className="text-destructive text-xs">
              {fieldError('published_at')}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? '저장 중...' : article ? '수정 저장' : '기사 등록'}
          </Button>
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/admin">취소</Link>
          </Button>
        </div>
      </div>

      {/* 사이드: 미리보기 */}
      <div className="md:sticky md:top-6 md:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border bg-white">
              {thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailUrl}
                  alt=""
                  className="aspect-video w-full object-cover"
                  onError={e => {
                    e.currentTarget.style.opacity = '0.3'
                  }}
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center text-xs">
                  썸네일 없음
                </div>
              )}
              <div className="space-y-2 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900">
                  {title || '제목'}
                </h3>
                <p className="line-clamp-3 text-xs text-zinc-600">
                  {lead || '리드 미리보기...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
