import type { AwardCeremony } from '@/types/award-ceremony'

export function AwardCeremonyRow({ item }: { item: AwardCeremony }) {
  return (
    <a
      href={item.article_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border-b border-zinc-800 py-4 transition hover:bg-zinc-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 sm:gap-6 sm:py-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumbnail_url}
        alt=""
        loading="lazy"
        className="h-20 w-32 flex-shrink-0 rounded object-cover sm:h-24 sm:w-40"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-zinc-50 sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.lead}</p>
      </div>
      <span className="hidden flex-shrink-0 rounded border border-zinc-600 px-3 py-1 text-xs tracking-wide text-zinc-300 uppercase transition group-hover:border-zinc-300 group-hover:text-zinc-100 sm:inline-block">
        View More
      </span>
    </a>
  )
}
