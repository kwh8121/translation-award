# Literary News CMS + iframe 임베드 진행 상황

> 최종 갱신: 2026-05-27
> 프로젝트: `thekoreatimes.imweb.me/LiteraryNews` 뉴스 영역을 iframe으로 대체
> 스택: Next.js 16.2.6 + React 19 + Supabase + Tailwind 4 + shadcn/ui
> 상태: **운영 배포 완료, imweb 임베드 적용 완료**

---

## 1. 완료된 작업 (Done)

### 1.1 기획 / 설계

- [x] 요구사항 정리 (간단 CMS / iframe 임베드 / 페이지네이션 / 반응형)
- [x] 스택 결정: Next.js + Supabase + Vercel
- [x] 데이터 모델 정의: `articles` (제목, 썸네일 URL, 리드, 기사 URL, 발행일)
- [x] 인증 정책 결정: Supabase Magic Link + `ADMIN_EMAILS` 화이트리스트
- [x] 라우트 설계 (`/login`, `/admin/*`, `/embed`, `/auth/callback`)
- [x] 반응형 그리드 정책 확정 (모바일 1열 → 태블릿 2열 → 데스크탑 3열)

### 1.2 환경 / 설정

- [x] `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치
- [x] shadcn 컴포넌트 추가: `table`, `pagination`, `textarea`, `popover`, `alert-dialog`
- [x] `src/lib/env.ts` Zod 검증 (`NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` 또는 `_PUBLISHABLE_KEY` / `ADMIN_EMAILS`)
- [x] `.env.example` 작성 (publishable key 별칭 안내 포함)
- [x] `next.config.ts` 보안 헤더 라우트별 분기
  - `/embed/*` → `Content-Security-Policy: frame-ancestors 'self' https://thekoreatimes.imweb.me https://*.imweb.me`
  - 그 외 → `X-Frame-Options: DENY`
- [x] `.gitignore` 에 `.omc/`, `.serena/` (로컬 도구 상태) 추가

### 1.3 Supabase

- [x] `supabase/schema.sql` 작성 (테이블 / 인덱스 / RLS / updated_at 트리거)
- [x] Supabase 프로젝트 생성 + SQL Editor에서 스키마 실행
- [x] RLS 정책: 공개 읽기 / 인증 사용자만 쓰기
- [x] Authentication → URL Configuration 설정 (Site URL + Redirect URLs Vercel 도메인)

### 1.4 인증 / 미들웨어

- [x] `src/lib/supabase/{client,server,middleware}.ts` 3종 클라이언트
- [x] Next.js 16 `proxy.ts` 컨벤션 적용
- [x] `/admin/*` 미인증 접근 시 `/login?redirect=...` 리다이렉트
- [x] `src/app/auth/callback/route.ts` 매직링크 콜백 + 비관리자 자동 로그아웃
- [x] `src/lib/actions/auth.ts` `signInWithMagicLink` / `signOut` (서버 측 에러 로깅 포함)
- [x] `src/lib/env.ts` `isAdminEmail()` 헬퍼

### 1.5 관리자 CMS (`/admin/*`)

- [x] `(admin)/layout.tsx` 서버사이드 세션/화이트리스트 가드
- [x] `/admin` 기사 목록 (데스크탑 테이블 / 모바일 카드 리스트 자동 전환)
- [x] `/admin/articles/new` 기사 작성
- [x] `/admin/articles/[id]/edit` 기사 수정
- [x] `article-form.tsx` RHF + Zod + `useActionState` + 실시간 미리보기
- [x] `delete-article-button.tsx` AlertDialog 확인 후 삭제 + 토스트
- [x] `src/lib/actions/articles.ts` CRUD + `revalidatePath('/admin' | '/embed')`
- [x] `src/lib/schemas/article.ts` Zod 스키마 (title 1-100, lead 1-300, URL 검증)

### 1.6 iframe 임베드 (`/embed`)

- [x] `embed/layout.tsx` 다크 테마 (`bg-black`) — imweb 외부 배경과 매칭
- [x] `embed/page.tsx` Server Component + `range()` 페이지네이션 (9개/페이지)
- [x] `article-card.tsx` `aspect-video` 썸네일 + 외부 URL 새 탭 이동 (`bg-zinc-900` 카드)
- [x] `article-grid.tsx` 반응형 그리드 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- [x] `embed-pagination.tsx` 모바일 prev/next + `N/M`, 데스크탑 페이지 번호 (다크 테마)
- [x] `height-reporter.tsx` ResizeObserver + postMessage 자동 높이 송신
- [x] Server Component `onError` 제거 (500 에러 수정)

### 1.7 운영 배포 / 검증

- [x] GitHub 푸시 (`https://github.com/kwh8121/translation-award`)
- [x] Vercel 배포 (`https://translation-award.vercel.app`)
- [x] 환경변수 4종 등록 (Production / Preview / Development 모두)
- [x] 매직링크 로그인 운영 환경에서 정상 동작 확인
- [x] 기사 10개 등록 및 `/embed` 페이지네이션 확인
- [x] CSP `frame-ancestors` / `X-Frame-Options: DENY` 응답 확인 (`curl -I`)
- [x] `/embed` 다크 테마 적용 (`bg-black` + `bg-zinc-900` 카드)

### 1.8 imweb 적용

- [x] `docs/embed-snippet.html` 실제 도메인 (`translation-award.vercel.app`) 적용
- [x] imweb HTML 위젯에 코드 삽입 완료
- [x] iframe 정상 표시 + postMessage 자동 높이 조정 동작 확인

---

## 2. 남은 / 권장 작업

### 2.1 실기기 모바일 검증 (권장)

- [ ] 실제 스마트폰에서 `thekoreatimes.imweb.me/LiteraryNews` 열어서:
  - 그리드 1열 정상 표시
  - iframe 자동 높이 조정
  - 카드 터치 시 새 탭으로 외부 기사 이동
  - 페이지네이션 prev/next + `N/M` 축약 표시

### 2.2 (선택) 후속 개선 — 원래 Out of Scope

| 기능                                          | 예상 작업량 | 우선순위 |
| --------------------------------------------- | ----------- | -------- |
| imweb 노란색 액센트 적용 (제목/active 페이지) | 30분        | 낮음     |
| 카테고리 / 태그 / 검색                        | 1~2일       | 중간     |
| 이미지 업로드 (Supabase Storage)              | 0.5일       | 중간     |
| 자동 OG 이미지 추출                           | 0.5일       | 낮음     |
| 편집자 추가/삭제 UI                           | 1일         | 낮음     |
| 발행 예약 / 임시저장                          | 1일         | 낮음     |
| Vercel Analytics 연동                         | 10분        | 낮음     |

---

## 3. 주요 파일 인덱스

| 경로                                             | 역할                                              |
| ------------------------------------------------ | ------------------------------------------------- |
| `src/lib/env.ts`                                 | 환경변수 Zod 검증 + `isAdminEmail()`              |
| `src/proxy.ts`                                   | Next.js 16 미들웨어 (세션 갱신 + admin 가드)      |
| `src/lib/supabase/{client,server,middleware}.ts` | Supabase 클라이언트 3종                           |
| `src/lib/schemas/article.ts`                     | 기사 Zod 스키마                                   |
| `src/lib/actions/{auth,articles}.ts`             | Server Actions                                    |
| `src/app/(admin)/layout.tsx`                     | 관리자 인증 가드                                  |
| `src/app/(admin)/admin/**`                       | CMS 페이지                                        |
| `src/app/embed/**`                               | iframe 페이지 (다크 테마)                         |
| `src/app/auth/callback/route.ts`                 | 매직링크 콜백                                     |
| `next.config.ts`                                 | 보안 헤더 (CSP frame-ancestors / X-Frame-Options) |
| `supabase/schema.sql`                            | DB 스키마 + RLS                                   |
| `docs/embed-snippet.html`                        | imweb 임베드 코드 (실제 도메인 적용 완료)         |
| `docs/literary-news-setup.md`                    | 설정 가이드                                       |

---

## 4. 외부 자원

| 항목              | URL                                                                         |
| ----------------- | --------------------------------------------------------------------------- |
| GitHub            | https://github.com/kwh8121/translation-award                                |
| Vercel 배포       | https://translation-award.vercel.app                                        |
| Supabase 대시보드 | https://supabase.com/dashboard (프로젝트: koreatimes / nextjs-supabase-app) |
| imweb 타깃 페이지 | https://thekoreatimes.imweb.me/LiteraryNews                                 |

---

## 5. 운영 절차 메모

### 기사 추가/수정

1. https://translation-award.vercel.app/login → 관리자 이메일 입력
2. 메일에서 매직링크 클릭 → `/admin` 진입
3. "새 기사" 또는 기존 기사 편집/삭제

### 새 관리자 추가

- Vercel → Settings → Environment Variables → `ADMIN_EMAILS` 편집
- 콤마 구분으로 이메일 추가
- **Redeploy 필수** (env 변경 반영)

### iframe 임베드 도메인 추가

- `next.config.ts` 의 `frame-ancestors` 값에 도메인 추가
- 푸시 → Vercel 자동 재배포

### 매직링크 만료 / 재시도 한도

- 매직링크는 24시간 유효
- Supabase 무료 플랜: 시간당 ~3-4건 이메일 발송 제한
