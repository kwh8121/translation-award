'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signInWithMagicLink, type SignInState } from '@/lib/actions/auth'

const initialState: SignInState = { status: 'idle' }

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: '인증 코드가 누락되었습니다. 다시 시도해주세요.',
  invalid_code: '유효하지 않거나 만료된 링크입니다. 다시 로그인해주세요.',
  not_admin: '관리자로 등록된 이메일이 아닙니다.',
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error')
  const redirect = searchParams.get('redirect') ?? '/admin'
  const [state, formAction, isPending] = useActionState(
    signInWithMagicLink,
    initialState
  )

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          관리자 로그인
        </CardTitle>
        <CardDescription className="text-center">
          등록된 이메일로 매직 링크를 보내드립니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorCode && ERROR_MESSAGES[errorCode] && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{ERROR_MESSAGES[errorCode]}</AlertDescription>
          </Alert>
        )}
        {state.status === 'success' && state.message && (
          <Alert className="mb-4">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.status === 'error' && state.message && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '전송 중...' : '로그인 링크 받기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
