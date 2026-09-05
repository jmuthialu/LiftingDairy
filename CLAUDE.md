# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Next.js, Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config via `eslint.config.mjs`)

There is no test runner configured yet.

## Architecture

This is a Next.js 16 App Router project (React 19, TypeScript, Tailwind CSS v4), currently at the unmodified `create-next-app` scaffold state:

- `src/app/layout.tsx` — root layout; loads Geist Sans/Mono fonts via `next/font/google` and sets base HTML/body structure.
- `src/app/page.tsx` — the home page (`/`).
- `src/app/globals.css` — global styles / Tailwind entry point.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- TypeScript `strict` mode is enabled in `tsconfig.json` — write strictly-typed code (no implicit `any`, null checks enforced, etc.) to stay compliant.
- Compile target is `ES2017`, with `lib` set to `dom`, `dom.iterable`, and `esnext` — modern JS syntax is fine to use, but avoid relying on runtime features newer than ES2017 without checking they're supported.
- `noEmit` is set (Next.js handles the actual build/transpile, `tsc` is only used for type-checking).
- Tailwind is configured through the PostCSS plugin (`@tailwindcss/postcss` in `postcss.config.mjs`), not a `tailwind.config.js` file — Tailwind v4's CSS-first config lives in `globals.css`.

There is no other application code yet — routes, components, and data logic will live under `src/app/` following Next.js App Router conventions as they're added.

## Coding standards

The `docs/` folder contains this repo's mandatory coding standards. **Always read and follow every document in `docs/` before writing or modifying code** — they are not optional guidelines, and take precedence over general conventions or training-data defaults. Currently:

- [docs/ui.md](docs/ui.md) — UI standards: shadcn/ui only (no hand-rolled components), date formatting via `date-fns` only.
- [docs/data-fetching.md](docs/data-fetching.md) — Data fetching standards.

When new files are added to `docs/`, treat them as equally mandatory even if this list hasn't been updated yet — check the folder directly.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
