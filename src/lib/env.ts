import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  ADMIN_EMAILS: z
    .string()
    .min(1, 'ADMIN_EMAILS must contain at least one email')
    .transform(v =>
      v
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)
    ),
})

// Supabase가 최근 키 명칭을 anon → publishable 로 변경했습니다.
// 두 이름 모두 허용합니다.
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublicKey,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
})

if (!parsed.success) {
  const issues = parsed.error.issues
    .map(i => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n')
  throw new Error(
    [
      '환경변수 설정이 올바르지 않습니다. .env.local 파일을 확인하세요.',
      issues,
      '',
      '필수 환경변수:',
      '  - NEXT_PUBLIC_SUPABASE_URL',
      '  - NEXT_PUBLIC_SUPABASE_ANON_KEY (또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
      '  - ADMIN_EMAILS (콤마 구분)',
      '자세한 안내는 docs/literary-news-setup.md 를 참고하세요.',
    ].join('\n')
  )
}

export const env = parsed.data

export type Env = z.infer<typeof envSchema>

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return env.ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
