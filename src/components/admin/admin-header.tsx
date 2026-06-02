'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

type Tab = {
  href: string
  label: string
  isActive: (pathname: string) => boolean
}

const tabs: Tab[] = [
  {
    href: '/admin',
    label: 'Literary News',
    isActive: p => p === '/admin' || p.startsWith('/admin/articles'),
  },
  {
    href: '/admin/awards',
    label: 'Award Ceremony',
    isActive: p => p.startsWith('/admin/awards'),
  },
]

export function AdminHeader({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/admin" className="text-base font-semibold sm:text-lg">
          The Korea Times CMS
        </Link>

        <nav className="order-3 -mx-2 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:mx-0 sm:w-auto">
          {tabs.map(tab => {
            const active = tab.isActive(pathname)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-muted-foreground hidden text-sm sm:inline">
            {email}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
