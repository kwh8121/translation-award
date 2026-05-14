import type { Metadata } from 'next'
import { HeightReporter } from '@/components/embed/height-reporter'

export const metadata: Metadata = {
  title: 'Literary News',
  robots: { index: false, follow: false },
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {children}
      <HeightReporter />
    </div>
  )
}
