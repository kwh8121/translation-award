# Literary News CMS + iframe 임베드 진행 상황

> 작성일: 2026-05-14
> 프로젝트: `thekoreatimes.imweb.me/LiteraryNews` 뉴스 영역을 iframe으로 대체
> 스택: Next.js 16.2.6 + React 19 + Supabase + Tailwind 4 + shadcn/ui

---

## 1. 완료된 작업 (Done)

### 1.1 기획 / 설계

- [x] 요구사항 정리 (간단 CMS / iframe 임베드 / 페이지네이션 / 반응형)
- [x] 스택 결정: Next.js + Supabase + Vercel
- [x] 데이터 모델 정의: `articles` (제목, 썸네일 URL, 리드, 기사 URL, 발행일)
- [x] 인증 정책 결정: Supabase Magic Link + `ADMIN_EMAILS` 화이트리스트
- [x] 라우트 설계 (`/login`, `/admin/*`, `/embed`, `/auth/callback`)
- [x] 반응형 그리드 정책 확정 (모바일 1열 → 태블릿 2열 → 데스크탑 3열)
- [x] 플랜 파일 확정: `/home/kwh8121/.claude/plans/next-js-supabase-peppy-porcupine.md`

### 1.2 환경 / 설정

- [x] `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치
- [x] shadcn 컴포넌트 추가: `table`, `pagination`, `textarea`, `popover`, `alert-dialog`
- [x] `src/lib/env.ts` 확장: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(또는 `PUBLISHABLE_KEY`), `ADMIN_EMAILS` Zod 검증
- [x] `.env.example` 작성 (publishable key 별칭 안내 포함)
- [x] `next.config.ts` 보안 헤더 라우트별 분기
  - `/embed/*` → `Content-Security-Policy: frame-ancestors 'self' https://thekoreatimes.imweb.me https://*.imweb.me`
  - 그 외 → `X-Frame-Options: DENY`

### 1.3 Supabase

- [x] `supabase/schema.sql` 작성 (테이블 / 인덱스 / RLS / updated_at 트리거)
- [x] Supabase 프로젝트 생성 + SQL Editor에서 스키마 실행 (사용자가 직접 수행)
- [x] RLS 정책: 공개 읽기 / 인증 사용자만 쓰기

### 1.4 인증 / 미들웨어

- [x] `src/lib/supabase/{client,server,middleware}.ts` 3종 클라이언트
- [x] Next.js 16 `proxy.ts` 컨벤션 적용 (`middleware.ts` 디프리케이션 대응)
- [x] `/admin/*` 미인증 접근 시 `/login?redirect=...` 리다이렉트
- [x] `src/app/auth/callback/route.ts` 매직링크 콜백 + 비관리자 자동 로그아웃
- [x] `src/lib/actions/auth.ts` `signInWithMagicLink` / `signOut` 서버 액션
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

- [x] `embed/layout.tsx` ThemeProvider 미사용 / `bg-white text-zinc-900` 고정
- [x] `embed/page.tsx` Server Component + `range()` 페이지네이션 (9개/페이지)
- [x] `article-card.tsx` `aspect-video` 썸네일 + 외부 URL 새 탭 이동
- [x] `article-grid.tsx` 반응형 그리드 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- [x] `embed-pagination.tsx` 모바일 prev/next + `N/M`, 데스크탑 페이지 번호
- [x] `height-reporter.tsx` ResizeObserver + postMessage 자동 높이 송신
- [x] `docs/embed-snippet.html` imweb HTML 위젯용 스니펫 (Origin 검증 포함)

### 1.7 검증 / 문서 / 배포 준비

- [x] `npm run check-all` (typecheck + lint + format) 통과
- [x] 로컬 dev 서버 동작 확인 (사용자: "잘 됩니다")
- [x] 사용자 시연 중 발생한 이슈 해결
  - ZodError: `PUBLISHABLE_KEY` 별칭 처리
  - `articles` 테이블 누락 → 사용자가 SQL Editor에서 실행
- [x] `docs/literary-news-setup.md` 한국어 설정 가이드
- [x] git commit (`7c20e79`) + push to `https://github.com/kwh8121/translation-award.git`

---

## 2. 남은 작업 (To-Do)

### 2.1 [최우선] Vercel 배포

- [ ] Vercel CLI 설치 (`npm i -g vercel`) — 선택 사항
- [ ] Vercel 대시보드에서 `translation-award` 레포 Import
- [ ] 환경변수 등록 (Production / Preview / Development 3개 환경 모두)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - `ADMIN_EMAILS` (콤마 구분)
  - `NEXT_PUBLIC_APP_URL` (배포 도메인 — 매직링크 redirect용)
- [ ] 첫 배포 실행 및 빌드 로그 확인
- [ ] 배포 도메인 확인 (예: `translation-award.vercel.app`)

### 2.2 Supabase Auth 도메인 설정 (배포 후)

- [ ] Supabase Dashboard → Authentication → URL Configuration
  - **Site URL**: `https://<vercel-domain>` 로 변경
  - **Redirect URLs** 에 다음 모두 추가
    - `https://<vercel-domain>/auth/callback`
    - `http://localhost:3000/auth/callback` (로컬 개발용 유지)
- [ ] Email Templates → Magic Link 의 redirect가 `{{ .SiteURL }}/auth/callback` 인지 확인

### 2.3 운영 검증

- [ ] 배포 도메인에서 `/login` → 매직링크 메일 수신 → `/admin` 진입 확인
- [ ] 화이트리스트 외 이메일 차단 확인
- [ ] 기사 3~10개 등록 후 `/embed` 페이지네이션 동작 확인
- [ ] `curl -I https://<vercel-domain>/embed` 로 CSP `frame-ancestors` 응답 확인
- [ ] `curl -I https://<vercel-domain>/admin` 로 `X-Frame-Options: DENY` 확인
- [ ] 반응형 검증 (375px / 768px / 1280px 3개 폭)

### 2.4 imweb 임베드 적용

- [ ] `docs/embed-snippet.html` 의 `YOUR-VERCEL-DOMAIN.vercel.app` 을 실제 도메인으로 교체
- [ ] `thekoreatimes.imweb.me/LiteraryNews` 페이지의 HTML 위젯에 스니펫 붙여넣기
- [ ] imweb 페이지에서 iframe 로드 확인 (모바일/PC)
- [ ] postMessage 자동 높이 조정 동작 확인
- [ ] 카드 클릭 시 새 탭으로 외부 기사 URL 이동 확인

### 2.5 (선택) 후속 개선

- [ ] 기사 본문 페이지 (`/embed/article/[id]`) 추가
- [ ] 카테고리 / 태그 / 검색 기능
- [ ] Supabase Storage 연동 (이미지 업로드)
- [ ] 자동 OG 이미지 추출
- [ ] 편집자 추가/삭제 UI (현재는 `ADMIN_EMAILS` 환경변수로만 관리)
- [ ] 다크모드 토글 (관리자 한정)
- [ ] 기사 발행 예약 / 임시저장
- [ ] Vercel Analytics 또는 PostHog 연동

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
| `src/app/embed/**`                               | iframe 페이지                                     |
| `src/app/auth/callback/route.ts`                 | 매직링크 콜백                                     |
| `next.config.ts`                                 | 보안 헤더 (CSP frame-ancestors / X-Frame-Options) |
| `supabase/schema.sql`                            | DB 스키마 + RLS                                   |
| `docs/embed-snippet.html`                        | imweb 임베드 코드                                 |
| `docs/literary-news-setup.md`                    | 설정 가이드                                       |

---

## 4. 검증 명령

```bash
npm run check-all   # typecheck + lint + format:check
npm run dev         # 로컬 개발 서버
npm run build       # 프로덕션 빌드 검증 (.env.local 필수)
```

---

## 5. 외부 자원

- GitHub: `https://github.com/kwh8121/translation-award`
- 최신 커밋: `7c20e79` — ✨ feat: Literary News CMS + iframe 임베드 시스템 구축
- 배포 대상: Vercel (미배포)
- 임베드 타깃: `https://thekoreatimes.imweb.me/LiteraryNews`

---

## 6. 다음 액션 (즉시 진행 가능)

1. **Vercel 대시보드** ([vercel.com/new](https://vercel.com/new)) 에서 `translation-award` 레포를 Import
2. Framework 자동 감지(Next.js) 확인 후 **환경변수 3개** 입력
3. Deploy 클릭 → 빌드 성공 시 도메인 확인
4. Supabase Dashboard에서 **Site URL / Redirect URL** 을 새 Vercel 도메인으로 갱신
5. `/login` 매직링크 플로우 운영 환경에서 1회 검증
6. `docs/embed-snippet.html` 도메인 치환 → imweb 위젯 적용
