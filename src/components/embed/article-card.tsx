import type { Article } from '@/types/article'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.article_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
    >
      <div className="relative w-full overflow-hidden bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.thumbnail_url}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 sm:text-lg">
          {article.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm text-zinc-600">
          {article.lead}
        </p>
        <time dateTime={article.published_at} className="text-xs text-zinc-500">
          {formatDate(article.published_at)}
        </time>
      </div>
    </a>
  )
}
