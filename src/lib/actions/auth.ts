'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/env'

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('올바른 이메일을 입력해주세요'),
  redirect: z.string().optional(),
})

export type SignInState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function signInWithMagicLink(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    redirect: formData.get('redirect'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다',
    }
  }

  if (!isAdminEmail(parsed.data.email)) {
    return {
      status: 'error',
      message: '관리자로 등록된 이메일이 아닙니다',
    }
  }

  const supabase = await createClient()
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'https'
  const origin = `${protocol}://${host}`

  const callbackUrl = new URL('/auth/callback', origin)
  if (parsed.data.redirect) {
    callbackUrl.searchParams.set('redirect', parsed.data.redirect)
  }

  console.log('[signInWithMagicLink] attempt', {
    email: parsed.data.email,
    callbackUrl: callbackUrl.toString(),
    host,
  })

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('[signInWithMagicLink] supabase error', {
      name: error.name,
      message: error.message,
      status: error.status,
      code: error.code,
    })
    return {
      status: 'error',
      message: `로그인 메일 전송 실패: ${error.message}`,
    }
  }

  console.log('[signInWithMagicLink] success', { email: parsed.data.email })

  return {
    status: 'success',
    message: '로그인 링크를 메일로 보냈습니다. 메일함을 확인해주세요',
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
