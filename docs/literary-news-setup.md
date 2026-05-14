# Literary News CMS + Iframe 임베드 설정 가이드

`thekoreatimes.imweb.me/LiteraryNews` 페이지에 임베드할 뉴스 카드 iframe과
관리자 CMS를 위한 설정 가이드입니다.

## 1. Supabase 프로젝트 준비

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트를 생성합니다 (무료 플랜 OK).
2. 프로젝트 → **SQL Editor** 에서 [`supabase/schema.sql`](../supabase/schema.sql)
   파일의 내용을 붙여넣고 실행합니다. `articles` 테이블, RLS, 인덱스, 트리거가 생성됩니다.
3. **Settings → API** 메뉴에서 다음 값을 복사합니다.
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Authentication → URL Configuration** 에서 다음을 추가합니다.
   - **Site URL**: 운영 도메인 (예: `https://your-app.vercel.app`)
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`,
     로컬 테스트용으로 `http://localhost:3000/auth/callback` 도 함께 추가.
5. **Authentication → Email Templates → Magic Link** 의 redirect URL이
   `{{ .SiteURL }}/auth/callback` 형식인지 확인합니다 (Supabase 기본값).

## 2. 환경변수 설정

`.env.example` 을 복사해 `.env.local` 을 만듭니다.

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
ADMIN_EMAILS=admin@example.com,editor@example.com
```

`ADMIN_EMAILS` 에 등록되지 않은 이메일은 매직 링크가 와도 `/admin` 진입이 차단됩니다.
Vercel 배포 시 동일한 환경변수를 **Project → Settings → Environment Variables** 에 등록하세요.

## 3. 로컬 실행

```bash
npm install
npm run dev
```

- `http://localhost:3000/login` → 등록된 관리자 이메일 입력 → 메일 매직 링크 클릭
- `/admin` 에서 기사 등록/수정/삭제
- `/embed` 에서 iframe용 뉴스 카드 그리드 확인

## 4. 라우트 구조

| 경로                        | 용도                                         |
| --------------------------- | -------------------------------------------- |
| `/login`                    | 관리자 매직 링크 로그인                      |
| `/admin`                    | 기사 목록 (인증 필요)                        |
| `/admin/articles/new`       | 기사 작성                                    |
| `/admin/articles/[id]/edit` | 기사 수정                                    |
| `/embed`                    | imweb 페이지에 임베드되는 카드 그리드 (공개) |
| `/embed?page=N`             | 페이지네이션                                 |
| `/auth/callback`            | Supabase OAuth/Magic Link 콜백               |

## 5. iframe 임베드

배포 도메인이 정해지면 [`docs/embed-snippet.html`](./embed-snippet.html) 의
코드를 imweb 페이지의 HTML 위젯에 붙여넣으세요. `YOUR-VERCEL-DOMAIN.vercel.app` 만
실제 도메인으로 교체하면 됩니다.

iframe은 콘텐츠 높이에 맞춰 자동 리사이즈됩니다 (`postMessage` 기반).

## 6. 보안 헤더

`next.config.ts` 의 `headers()` 가 라우트별로 다음과 같이 분기됩니다.

- `/embed/*` → `Content-Security-Policy: frame-ancestors 'self' https://thekoreatimes.imweb.me https://*.imweb.me`
- 그 외 → `X-Frame-Options: DENY` (iframe 임베드 차단)

다른 도메인에서 임베드를 허용하려면 `next.config.ts` 의 `frame-ancestors` 값에
도메인을 추가하세요.

## 7. 반응형 동작

- `/embed`: 모바일 1열 → 태블릿(`sm`) 2열 → 데스크탑(`lg`) 3열 (3x3 그리드)
- 페이지네이션: 모바일은 prev/next + `1/N`, 데스크탑은 페이지 번호 노출
- `/admin`: 데스크탑은 테이블, 모바일은 카드 리스트로 자동 전환

## 8. 검증 명령

```bash
npm run check-all   # typecheck + lint + format:check
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드 (env.local 필수)
```

## 9. 알려진 제한 (이번 버전 외)

- 기사 본문 페이지 미제공 (외부 URL로만 이동)
- 카테고리/태그/검색 미지원
- 이미지 업로드 미지원 (외부 URL만 입력)
- 편집자 추가/삭제 UI 미지원 (`ADMIN_EMAILS` 환경변수로 1회성 관리)
