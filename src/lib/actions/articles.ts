'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/env'
import { articleSchema, type ArticleFormValues } from '@/lib/schemas/article'

export type ArticleActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<keyof ArticleFormValues, string>>
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    throw new Error('UNAUTHORIZED')
  }
  return supabase
}

function parseFormData(formData: FormData) {
  const raw = {
    title: formData.get('title')?.toString() ?? '',
    thumbnail_url: formData.get('thumbnail_url')?.toString() ?? '',
    lead: formData.get('lead')?.toString() ?? '',
    article_url: formData.get('article_url')?.toString() ?? '',
    published_at: formData.get('published_at')?.toString() ?? '',
  }
  return articleSchema.safeParse(raw)
}

function toFieldErrors(
  issues: import('zod').ZodIssue[]
): ArticleActionState['fieldErrors'] {
  const fieldErrors: ArticleActionState['fieldErrors'] = {}
  for (const issue of issues) {
    const key = issue.path[0] as keyof ArticleFormValues | undefined
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

export async function createArticle(
  _prev: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { status: 'error', message: '권한이 없습니다' }
  }

  const parsed = parseFormData(formData)
  if (!parsed.success) {
    return {
      status: 'error',
      message: '입력값을 확인해주세요',
      fieldErrors: toFieldErrors(parsed.error.issues),
    }
  }

  const { error } = await supabase.from('articles').insert({
    ...parsed.data,
    published_at: new Date(parsed.data.published_at).toISOString(),
  })

  if (error) {
    return { status: 'error', message: `저장 실패: ${error.message}` }
  }

  revalidatePath('/admin')
  revalidatePath('/embed')
  redirect('/admin')
}

export async function updateArticle(
  id: string,
  _prev: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { status: 'error', message: '권한이 없습니다' }
  }

  const parsed = parseFormData(formData)
  if (!parsed.success) {
    return {
      status: 'error',
      message: '입력값을 확인해주세요',
      fieldErrors: toFieldErrors(parsed.error.issues),
    }
  }

  const { error } = await supabase
    .from('articles')
    .update({
      ...parsed.data,
      published_at: new Date(parsed.data.published_at).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { status: 'error', message: `수정 실패: ${error.message}` }
  }

  revalidatePath('/admin')
  revalidatePath('/embed')
  redirect('/admin')
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) {
    throw new Error(`삭제 실패: ${error.message}`)
  }
  revalidatePath('/admin')
  revalidatePath('/embed')
}
