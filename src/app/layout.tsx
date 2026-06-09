import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// imweb 호스트 페이지가 Inter 를 사용하므로 iframe 도 같은 폰트로 매칭.
// 실제 적용은 src/app/embed/layout.tsx 에서 inline style 로 수행.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NextJS Starter - 모던 웹 스타터킷',
  description:
    'Next.js 15, TypeScript, TailwindCSS, ShadcnUI로 구축된 프로덕션 준비가 완료된 웹 애플리케이션 스타터킷',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
