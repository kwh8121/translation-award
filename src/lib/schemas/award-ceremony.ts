import { z } from 'zod'

export const awardCeremonySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  thumbnail_url: z.string().trim().url('썸네일 URL이 올바르지 않습니다'),
  lead: z
    .string()
    .trim()
    .min(1, '리드를 입력해주세요')
    .max(300, '리드는 300자 이내로 입력해주세요'),
  article_url: z.string().trim().url('기사 URL이 올바르지 않습니다'),
  published_at: z
    .string()
    .min(1, '발행일을 선택해주세요')
    .refine(v => !Number.isNaN(Date.parse(v)), {
      message: '발행일 형식이 올바르지 않습니다',
    }),
})

export type AwardCeremonyFormValues = z.infer<typeof awardCeremonySchema>
