# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build with Turbopack
npm run check-all    # typecheck + lint + format:check (run before committing)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check

npx shadcn@latest add <component>  # Add shadcn/ui component
```

There are no tests in this project yet. `npm run check-all` is the full verification step.

## Architecture

```
src/
├── app/               # Next.js App Router pages & layouts
│   ├── layout.tsx     # Root layout: ThemeProvider + Toaster, Geist fonts, lang="ko"
│   ├── page.tsx       # Home page (hero/features/cta sections)
│   ├── login/         # /login route
│   └── signup/        # /signup route
├── components/
│   ├── ui/            # shadcn/ui primitives (do not edit manually — use npx shadcn)
│   ├── layout/        # header, footer, container wrappers
│   ├── navigation/    # main-nav, mobile-nav
│   ├── sections/      # hero, features, cta (page-level blocks)
│   ├── providers/     # theme-provider
│   └── *.tsx          # Feature components (login-form, signup-form, theme-toggle)
└── lib/
    ├── utils.ts       # cn() helper (clsx + tailwind-merge)
    └── env.ts         # Environment variable validation
```

## Key Conventions

**Server Components first.** Default to Server Components; add `'use client'` only when the component needs state, effects, or event handlers. Pass server-fetched data down as props.

**Next.js 15 async APIs.** `params` and `searchParams` are now `Promise`s — always `await` them:
```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

**Path aliases.** Always use `@/` (maps to `src/`). Never use relative `../` imports across directories.

**Naming.** Files: `kebab-case.tsx`. Components: `PascalCase`. Folders: `kebab-case`.

**Styling.** Use `cn()` from `@/lib/utils` to merge classes. Use semantic CSS variables (`bg-background`, `text-foreground`, `text-muted-foreground`) — never hardcode colors like `bg-white` or `text-gray-900`. No inline styles.

**Forms.** Use React Hook Form + Zod + Server Actions. Zod schemas live in `src/lib/schemas/`. Server Actions use `'use server'` directive and `useActionState` (React 19) on the client side.

**CVA for variants.** Use `class-variance-authority` when a component needs multiple visual variants.

**Component size.** Keep files under ~300 lines; split if larger.

**Exports.** Named exports for components (`export function Foo`), default exports only for Next.js page files.

## Detailed Guides

- Architecture & file naming: `docs/guides/project-structure.md`
- Styling rules: `docs/guides/styling-guide.md`
- Component patterns (composition, CVA, Server/Client boundary): `docs/guides/component-patterns.md`
- Next.js 15 specifics (caching, Parallel Routes, Intercepting Routes): `docs/guides/nextjs-15.md`
- Forms (React Hook Form + Zod + Server Actions): `docs/guides/forms-react-hook-form.md`
