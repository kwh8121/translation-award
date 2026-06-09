import type { AwardCeremony } from '@/types/award-ceremony'

export function AwardCeremonyRow({ item }: { item: AwardCeremony }) {
  return (
    <a
      href={item.article_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-5 border-b border-zinc-800 py-6 transition hover:bg-zinc-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 sm:gap-8 sm:py-7"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumbnail_url}
        alt=""
        loading="lazy"
        className="h-28 w-44 flex-shrink-0 rounded object-cover sm:h-36 sm:w-56"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-lg leading-snug font-semibold text-zinc-50 sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {item.lead}
        </p>
      </div>
      <span className="hidden flex-shrink-0 rounded border border-zinc-500 px-5 py-2.5 text-sm tracking-wide text-zinc-300 uppercase transition group-hover:border-zinc-200 group-hover:text-zinc-100 sm:inline-block">
        View More
      </span>
    </a>
  )
}
