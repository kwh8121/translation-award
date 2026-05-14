import { Metadata } from 'next'
import { Suspense } from 'react'

import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: '관리자 계정으로 로그인하세요',
}

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
