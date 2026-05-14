import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/admin" className="text-base font-semibold sm:text-lg">
          Literary News CMS
        </Link>
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
