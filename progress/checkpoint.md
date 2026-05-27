# Literary News CMS — 코드 수정 가이드 (Checkpoint)

> 목적: 새 세션 / 다른 개발자가 이 코드를 안전하게 수정하기 위한 핸드오프 문서
> 진행 상태가 아니라 **"어떻게 동작하는지 + 무엇을 건드릴지"** 중심
> 진행 상황과 완료 리스트는 `./job-progress.md` 참고

---

## 1. 시스템 멘탈 모델

### 1.1 큰 그림

```
[imweb LiteraryNews 페이지]                          (외부 도메인)
        │ <iframe src="...vercel.app/embed">
        ▼
[Vercel: translation-award.vercel.app]               (이 코드)
   ├── /embed              ← 공개 iframe 그리드
   ├── /login              ← 매직링크 입력
   ├── /auth/callback      ← Supabase OAuth 콜백
   └── /admin/*            ← 인증된 관리자만 (CMS)
        │ supabase-js
        ▼
[Supabase Project: koreatimes / nextjs-supabase-app]
   ├── articles 테이블 (RLS: public read / authed write)
   └── auth.users (magic link OTP)
```

### 1.2 요청 흐름별 핵심 파일

| 시나리오               | 진입점 → 처리 → 출력                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **iframe 페이지 로드** | `app/embed/page.tsx` → Supabase select → `ArticleGrid` → `ArticleCard` × N + `EmbedPagination`                                                                  |
| **자동 높이 조정**     | `embed/layout.tsx` 가 `HeightReporter` 마운트 → ResizeObserver → `postMessage` → imweb의 `<script>` 가 수신해서 `iframe.style.height` 설정                      |
| **로그인 요청**        | `/login` 폼 → `signInWithMagicLink` (Server Action) → `isAdminEmail` 화이트리스트 체크 → `supabase.auth.signInWithOtp` 호출 → 이메일 발송                       |
| **매직링크 클릭**      | `/auth/callback?code=...` → `supabase.auth.exchangeCodeForSession` → 비관리자면 `signOut` + redirect /login → 관리자면 `/admin`                                 |
| **모든 요청**          | `src/proxy.ts` → `updateSession` → 쿠키 갱신 + `/admin/*` 가드                                                                                                  |
| **기사 CRUD**          | `/admin/articles/...` 폼 → `createArticle/updateArticle/deleteArticle` Server Action → Supabase write → `revalidatePath('/admin')` + `revalidatePath('/embed')` |

### 1.3 보안 모델

- **공개 read**: Supabase RLS 의 `articles_public_read` 정책으로 `/embed` 가 anon key로 접근
- **쓰기 차단**: 관리자만 가능 — 3중 가드
  1. `proxy.ts` 가 `/admin/*` 미인증 시 `/login` 으로 리다이렉트
  2. `(admin)/layout.tsx` 가 서버사이드에서 세션 + 이메일 화이트리스트 재검증
  3. Supabase RLS 가 인증된 사용자만 INSERT/UPDATE/DELETE 허용
- **iframe 임베드**: `/embed` 만 CSP `frame-ancestors` 로 imweb.me 허용. 다른 경로는 `X-Frame-Options: DENY` 차단
- **에러 메시지**: 클라이언트에는 일반 메시지만 노출, 상세는 `console.error` 로 Vercel Logs 에만 기록

---

## 2. 흔히 발생하는 변경 시나리오 — 레시피

### 2.1 기사에 새 필드 추가 (예: `category`)

수정 파일 (순서대로):

1. `supabase/schema.sql` + Supabase SQL Editor 에서 `ALTER TABLE articles ADD COLUMN category text;`
2. `src/types/article.ts` — `Article` 타입에 `category` 추가
3. `src/lib/schemas/article.ts` — Zod 스키마에 `category: z.string()...` 추가
4. `src/components/admin/article-form.tsx` — 입력 필드 추가
5. `src/components/admin/article-table.tsx` — 목록 컬럼 추가 (선택)
6. `src/components/embed/article-card.tsx` — 카드 표시 (선택)
7. `src/lib/actions/articles.ts` — `createArticle/updateArticle` 의 insert 객체에 추가

### 2.2 페이지당 기사 수 변경 (현재 9개 → 12개)

- `src/app/embed/page.tsx` 상단의 `const PAGE_SIZE = 9` 같은 상수 변경 한 줄
- 그리드 컬럼 수도 영향 받을 수 있으므로 `article-grid.tsx` 의 `sm:grid-cols-2 lg:grid-cols-3` 확인

### 2.3 iframe 임베드 도메인 추가/변경 (다른 사이트에도 임베드)

`next.config.ts` 의 `frame-ancestors` 값 수정:

```ts
"frame-ancestors 'self' https://thekoreatimes.imweb.me https://*.imweb.me https://new-domain.com"
```

푸시 → Vercel 자동 재배포 후 즉시 반영.

### 2.4 관리자 추가/제거

- **추가**: Vercel → Settings → Environment Variables → `ADMIN_EMAILS` 편집 → 콤마로 이메일 추가 → **Redeploy 필수**
- **로컬도 동기화**: `.env.local` 의 `ADMIN_EMAILS` 같이 업데이트
- **주의**: env 변경 후 Redeploy 안 하면 빌드된 코드가 옛 화이트리스트를 사용

### 2.5 색상 / 테마 변경

- iframe 페이지: `src/app/embed/layout.tsx` (배경) + `src/components/embed/article-card.tsx` (카드) + `src/components/embed/embed-pagination.tsx` (페이지네이션)
- 관리자 페이지: 루트 `app/layout.tsx` 의 ThemeProvider + 일반 shadcn 변수
- **iframe 페이지는 ThemeProvider 미사용** — 부모 사이트와 톤 충돌 방지 목적

### 2.6 매직링크 이메일 본문 / 발신자 변경

코드가 아닌 **Supabase Dashboard** 에서:

- Authentication → Email Templates → Magic Link 편집
- 기본 발신자 변경하려면 Project Settings → Auth → SMTP Settings 에서 커스텀 SMTP 등록

---

## 3. 함정 (Pitfalls) — 이미 한 번 부딪힌 것들

### 3.1 Next.js 16 Server Component 에서 이벤트 핸들러 금지

- `<img onError={...}>` 같은 핸들러가 Server Component 에 있으면 **500 에러** 발생
- 클라이언트 동작 필요하면 `'use client'` 컴포넌트로 분리하거나 핸들러 제거
- 관련 커밋: `6419fc3`

### 3.2 Next.js 16 `middleware.ts` → `proxy.ts`

- `middleware.ts` 는 deprecated. `src/proxy.ts` + `export async function proxy(...)` 사용
- export 이름도 `middleware` 가 아닌 `proxy`

### 3.3 Supabase 키 명칭 변경 (anon → publishable)

- 최신 대시보드는 `Publishable key`, 옛날 코드는 `anon`
- `src/lib/env.ts` 에서 두 환경변수명 모두 받도록 fallback 처리
  ```ts
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ```

### 3.4 Vercel 환경변수는 환경(Production/Preview/Development)별 분리

- 단순히 등록만 하면 안 됨 — 빌드는 Production 환경에서 돌기 때문에 **Production 체크 필수**
- 등록 후 자동 재배포 안 됨 → **수동 Redeploy 필요**

### 3.5 Supabase Site URL 변경 후 옛 매직링크는 무효

- Site URL 바꾸기 전에 발송된 매직링크는 옛 도메인(`localhost`)을 가리켜 동작 안 함
- 변경 후에는 **반드시 새 매직링크 요청**해서 테스트

### 3.6 매직링크 24시간 만료 + Supabase 이메일 발송 Rate Limit

- 무료 플랜은 시간당 ~3-4건
- 디버깅 중 반복 발송하면 한도 초과 가능 — `Email rate limit exceeded` 에러
- 해결: 한 시간 기다리거나 Supabase Pro 플랜 / 커스텀 SMTP 설정

### 3.7 NEXT*PUBLIC*\* 변수는 빌드 시점에 인라인됨

- 변경 시 반드시 재빌드 (Vercel 자동 / 로컬 `npm run build` 재실행)
- 런타임 변경 불가능

### 3.8 Server Action 의 에러 객체는 클라이언트로 전달 불가

- `error.message` 만 직렬화 가능한 값으로 추출해서 반환
- 상세는 `console.error` 로 로깅 (Vercel Logs 에 기록됨)

---

## 4. 로컬 개발 환경 셋업

```bash
# 1. 클론 + 의존성
git clone https://github.com/kwh8121/translation-award.git
cd translation-award
npm install

# 2. 환경변수 (Vercel 의 값 그대로 복사 권장)
cp .env.example .env.local
# .env.local 편집:
#   NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
#   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=ey...
#   ADMIN_EMAILS=your@email.com

# 3. 개발 서버
npm run dev   # http://localhost:3000

# 4. 검증
npm run check-all   # typecheck + lint + format:check
npm run build       # 프로덕션 빌드 검증
```

**Supabase 로컬 매직링크 테스트**:

- `.env.local` 에서 `NEXT_PUBLIC_APP_URL=http://localhost:3000` 설정
- Supabase Dashboard → URL Configuration 의 Redirect URLs 에 `http://localhost:3000/auth/callback` 가 포함되어 있어야 함

---

## 5. 로그 / 디버깅 위치

| 무엇                               | 어디서 봄                                                           |
| ---------------------------------- | ------------------------------------------------------------------- |
| 서버 액션 console.log/error (운영) | Vercel → 프로젝트 → **Logs** 탭                                     |
| 빌드 에러 (운영)                   | Vercel → Deployments → 해당 배포 → Build Logs                       |
| Supabase 인증 이벤트               | Supabase Dashboard → Authentication → **Audit Logs**                |
| Supabase 쿼리 에러 / 정책 위반     | Supabase Dashboard → Logs & Analytics → Postgres Logs               |
| 클라이언트 에러                    | 브라우저 DevTools Console                                           |
| iframe postMessage 동작            | 부모 페이지(imweb) DevTools Console + iframe 안의 `/embed` DevTools |

---

## 6. 배포 / 릴리즈 흐름

```
[local] git commit + git push origin main
   │
   ▼
[GitHub] main 브랜치 푸시 감지
   │
   ▼
[Vercel] 자동 빌드 시작 (1~3분)
   │  ├── npm install
   │  ├── npm run build (Turbopack)
   │  └── 정적 자산 + 서버 함수 배포
   ▼
[Production] https://translation-award.vercel.app 갱신
   │
   ▼
[imweb iframe] 다음 로드 시 자동 반영
```

**롤백**: Vercel → Deployments → 이전 성공 배포 → ⋯ → **Promote to Production**

**환경변수만 변경한 경우**: 푸시 없이도 `Deployments → Redeploy` 로 변수 반영된 새 빌드 생성 필요

---

## 7. 자주 쓰는 검증 명령

```bash
# 코드 품질 (커밋 전 필수)
npm run check-all

# 운영 환경 헬스체크
curl -s -o /dev/null -w "%{http_code}\n" https://translation-award.vercel.app/embed
curl -s -o /dev/null -w "%{http_code}\n" https://translation-award.vercel.app/login
curl -I https://translation-award.vercel.app/embed | grep -i content-security
curl -I https://translation-award.vercel.app/admin | grep -i x-frame
```

---

## 8. 다음 개발자에게 — 권장 읽기 순서

1. **`CLAUDE.md`** — 프로젝트 전반 컨벤션
2. **`docs/literary-news-setup.md`** — 초기 설정 가이드 (Supabase 세팅 등)
3. **이 문서 §1 (시스템 멘탈 모델)** — 큰 그림
4. **`src/app/embed/page.tsx`** — 가장 자주 수정될 가능성이 높은 파일 (한 번 읽으면 90% 이해됨)
5. **`src/lib/actions/articles.ts`** — CRUD 패턴 이해
6. **`next.config.ts`** — 보안 헤더 분기 (수정 빈도 낮지만 중요)

이 순서면 30분 이내에 코드 구조가 파악되고 작은 수정은 바로 가능합니다.
