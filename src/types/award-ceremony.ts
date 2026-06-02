export interface AwardCeremony {
  id: string
  title: string
  thumbnail_url: string
  lead: string
  article_url: string
  published_at: string
  created_at: string
  updated_at: string
}

export type AwardCeremonyInput = Pick<
  AwardCeremony,
  'title' | 'thumbnail_url' | 'lead' | 'article_url' | 'published_at'
>
