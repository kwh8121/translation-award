-- Literary News CMS schema
-- Supabase 프로젝트의 SQL Editor에서 한 번 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 100),
  thumbnail_url text not null,
  lead text not null check (char_length(lead) <= 300),
  article_url text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

-- RLS
alter table public.articles enable row level security;

-- 공개 읽기 (iframe에서 anon key로 접근)
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select
  using (true);

-- 인증된 사용자만 생성/수정/삭제 (관리자 이메일 필터링은 앱 레벨에서 수행)
drop policy if exists "articles_authenticated_insert" on public.articles;
create policy "articles_authenticated_insert" on public.articles
  for insert
  to authenticated
  with check (true);

drop policy if exists "articles_authenticated_update" on public.articles;
create policy "articles_authenticated_update" on public.articles
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "articles_authenticated_delete" on public.articles;
create policy "articles_authenticated_delete" on public.articles
  for delete
  to authenticated
  using (true);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
  before update on public.articles
  for each row
  execute function public.set_updated_at();

-- =========================================================================
-- Award Ceremony 콘텐츠 타입 (articles 와 동일 구조, 별도 테이블)
-- =========================================================================

create table if not exists public.award_ceremonies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 100),
  thumbnail_url text not null,
  lead text not null check (char_length(lead) <= 300),
  article_url text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists award_ceremonies_published_at_idx
  on public.award_ceremonies (published_at desc);

alter table public.award_ceremonies enable row level security;

drop policy if exists "award_ceremonies_public_read" on public.award_ceremonies;
create policy "award_ceremonies_public_read" on public.award_ceremonies
  for select
  using (true);

drop policy if exists "award_ceremonies_authenticated_insert" on public.award_ceremonies;
create policy "award_ceremonies_authenticated_insert" on public.award_ceremonies
  for insert
  to authenticated
  with check (true);

drop policy if exists "award_ceremonies_authenticated_update" on public.award_ceremonies;
create policy "award_ceremonies_authenticated_update" on public.award_ceremonies
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "award_ceremonies_authenticated_delete" on public.award_ceremonies;
create policy "award_ceremonies_authenticated_delete" on public.award_ceremonies
  for delete
  to authenticated
  using (true);

drop trigger if exists set_award_ceremonies_updated_at on public.award_ceremonies;
create trigger set_award_ceremonies_updated_at
  before update on public.award_ceremonies
  for each row
  execute function public.set_updated_at();
