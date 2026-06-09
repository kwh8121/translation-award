# Additional Task — imweb 호스트 페이지 매칭 작업

> 작업 기간: 2026-06-09
> 배경: Award Ceremony iframe 이 `thekoreatimes.imweb.me/LiteraryNews` 의 기존 Award Ceremony 블록 바로 아래에 노출되는데, 두 블록의 **사이즈와 폰트가 달라 시각적 불일치** 발생. 같은 페이지에 나란히 보이는 만큼 톤을 맞추는 작업.
> 결과: 사이즈 매칭 + Inter 폰트 적용 완료, 운영 배포 완료.

---

## 1. 이번에 처리한 작업

### 1.1 Award Ceremony 행 사이즈 매칭

**문제**: iframe 의 썸네일/폰트/패딩이 imweb 기존 블록 대비 약 60~70% 정도 작아서, 같은 섹션에 노출됐을 때 두 블록의 무게감이 명백히 다름.

**해결**: `src/components/embed/award-ceremony-row.tsx` 의 Tailwind 클래스만 조정. 레이아웃 구조(수평 리스트, 다크 배경, border-b 구분선)는 그대로.

| 요소              | Before                     | After                                        |
| ----------------- | -------------------------- | -------------------------------------------- |
| 썸네일 (모바일)   | `h-20 w-32` (80×128)       | `h-28 w-44` (112×176)                        |
| 썸네일 (데스크탑) | `sm:h-24 sm:w-40` (96×160) | `sm:h-36 sm:w-56` (144×224)                  |
| 제목              | `text-base / sm:text-lg`   | `text-lg / sm:text-xl` + `leading-snug`      |
| 리드              | `text-sm`                  | `text-sm / sm:text-base` + `leading-relaxed` |
| 리드 상단 여백    | `mt-1`                     | `mt-2`                                       |
| VIEW MORE 폰트    | `text-xs`                  | `text-sm`                                    |
| VIEW MORE 패딩    | `px-3 py-1`                | `px-5 py-2.5`                                |
| VIEW MORE 보더    | `border-zinc-600`          | `border-zinc-500`                            |
| 행 패딩           | `py-4 / sm:py-5`           | `py-6 / sm:py-7`                             |
| 행 gap            | `gap-4 / sm:gap-6`         | `gap-5 / sm:gap-8`                           |

**커밋**: `662cbac` 🎨 style: Award Ceremony 행 크기를 imweb 기존 블록과 매칭

### 1.2 imweb 호스트 페이지 폰트(Inter) 적용

**문제**: 사이즈 매칭 후에도 글자 모양 자체가 달라 보임. 원인은 폰트 패밀리 차이.

**조사 결과** (curl + HTML 분석):

- imweb 페이지 body: `font-family: Inter, KoPubBatang, sans-serif` (HTML 인라인 스타일)
- 우리 iframe: `Geist Sans` (next/font/google → `--font-sans` 변수)
- KoPubBatang 은 한글 본문 fallback 용 — 우리 콘텐츠가 영문 위주라 미로드해도 시스템 한글 폰트로 자동 fallback

**해결 전략**:

- `next/font/google` 의 Inter 추가 로드 (`--font-inter` CSS 변수)
- `/embed/*` 라우트에만 적용 (관리자 페이지는 Geist 그대로 — imweb 컨텍스트와 무관)

**구현 (2개 파일)**:

`src/app/layout.tsx`:

```tsx
import { Geist, Geist_Mono, Inter } from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

<body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
```

`src/app/embed/layout.tsx`:

```tsx
const EMBED_FONT_FAMILY =
  'var(--font-inter), KoPubBatang, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

<div
  className="min-h-screen bg-black text-zinc-100"
  style={{ fontFamily: EMBED_FONT_FAMILY }}
>
```

자식 컴포넌트 (`article-card.tsx`, `award-ceremony-row.tsx`, `embed-pagination.tsx`) 는 wrapper 의 font-family 를 자연 상속하므로 수정 불필요.

**대안 검토 결과 (B 채택)**:

| 옵션                                                      | 채택 여부                                    |
| --------------------------------------------------------- | -------------------------------------------- |
| A: `globals.css` 의 `--font-sans` 를 Inter 로 변경 (전역) | ❌ /admin 의 shadcn UI 까지 변경 → 회귀 위험 |
| B: iframe layout 에 inline style 로 Inter 적용            | ✅ 영향 범위 최소                            |
| C: 새 Tailwind 변수 + `font-embed` 클래스 추가            | ❌ 한 군데 사용에 비해 과한 추상화           |

**커밋**: `e870c45` 🎨 style: iframe 임베드 페이지에 imweb 호스트 폰트(Inter) 적용

### 1.3 (인프라) gh CLI 설치 — 인증 정상화

push 시 `/usr/bin/gh: not found` 에러 발생 → 사용자가 `sudo apt install gh` 로 설치 완료. 버전 `2.45.0`, 계정 `kwh8121` 인증 정상. 단 git 의 credential helper 와 gh 의 연동에 quirk 가 남아 있어 일반 `git push` 가 간헐적으로 실패함 → 토큰 직접 추출 방식 (`https://kwh8121:${TOKEN}@github.com/...`) 으로 우회.

---

## 2. 영향 받은 파일

| 파일                                          | 변경                                  |
| --------------------------------------------- | ------------------------------------- |
| `src/components/embed/award-ceremony-row.tsx` | 썸네일/폰트/패딩 사이즈 확대          |
| `src/app/layout.tsx`                          | Inter 폰트 import + body 에 변수 추가 |
| `src/app/embed/layout.tsx`                    | wrapper 에 inline `fontFamily` 적용   |

다른 파일 변경 없음. 데이터베이스 / 환경변수 / 라우팅 / 컴포넌트 추상화 모두 그대로.

---

## 3. 운영 환경 검증 결과

```
HTTP 상태:
  /embed              → 200
  /embed/awards       → 200

폰트 변수 노출:
  --font-inter        → HTML 에서 확인됨

inline font-family:
  var(--font-inter), KoPubBatang, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, sans-serif
```

배포 도메인: `https://translation-award.vercel.app`
배포 트리거: GitHub push → Vercel 자동 빌드 (각 커밋당 1~3분)

---

## 4. 회귀 체크

| 영역                                                    | 변동 여부                                |
| ------------------------------------------------------- | ---------------------------------------- |
| `/admin/*` 페이지 폰트                                  | Geist 유지 ✅                            |
| shadcn UI 컴포넌트 (Button, Input, Dialog 등)           | 변동 없음 ✅                             |
| Literary News iframe (`/embed`) 레이아웃                | 변동 없음 ✅ (폰트만 Inter 로 변경)      |
| Award Ceremony iframe (`/embed/awards`) 데이터 / 라우팅 | 변동 없음 ✅                             |
| iframe 자동 높이 (HeightReporter)                       | 정상 (ResizeObserver 가 새 높이 송신) ✅ |
| 보안 헤더 (CSP frame-ancestors / X-Frame-Options)       | 변동 없음 ✅                             |

---

## 5. 커밋 흐름 (이번 세션)

```
e870c45 🎨 style: iframe 임베드 페이지에 imweb 호스트 폰트(Inter) 적용     ← 마지막
662cbac 🎨 style: Award Ceremony 행 크기를 imweb 기존 블록과 매칭
```

이전 세션 종료 시점 (`c73ad06`) 부터 2개 커밋 추가.

---

## 6. 사용자 확인 사항

1. **imweb 페이지 새로고침** (`Ctrl+Shift+R` 로 브라우저 캐시 무시)
2. Award Ceremony 섹션의 **위 블록(imweb 기존)** 과 **아래 블록(우리 iframe)** 비교:
   - 썸네일 크기가 비슷한가?
   - 제목/리드 폰트 크기가 비슷한가?
   - 글자 모양(너비, x-height, 자간)이 일치하는가?
3. 미세하게 안 맞는 부분 있으면 추가 조정 가능

---

## 7. 후속 작업 (필요 시)

- 한글 본문이 추가될 경우 — KoPubBatang Web 또는 Pretendard 같은 한글 폰트도 `next/font` 로 추가 로드 고려
- 폰트 로드 성능 — 현재 Inter `subsets: ['latin']` 만 로드 (Korean / Cyrillic 미포함). 한글 본문 등장 시 옵션 확장 필요
- 토큰/credential 안정화 — gh CLI 와 git credential helper 간 quirk 근본 해결 (SSH key 전환 또는 PAT 재발급 + `gh auth login` 재실행)
