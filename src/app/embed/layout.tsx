import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Literary News',
  robots: { index: false, follow: false },
}

// imweb 호스트 페이지(thekoreatimes.imweb.me) 가 Inter, KoPubBatang, sans-serif
// 를 사용하므로 iframe 본문도 동일한 폰트 스택으로 매칭. /admin 등 다른 라우트는
// Geist 그대로 유지.
const EMBED_FONT_FAMILY =
  'var(--font-inter), KoPubBatang, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen bg-black text-zinc-100"
      style={{ fontFamily: EMBED_FONT_FAMILY }}
    >
      {children}
    </div>
  )
}
