# Routing Coding Standards

These standards govern how routes are structured in this app. They are mandatory, not guidelines.

## All app routes live under `/dashboard`

- Every route in the application **must** be accessed under the `/dashboard` path — the `/dashboard` page and all of its sub-routes ([src/app/dashboard/](../src/app/dashboard/)). Do not add top-level feature routes outside of `/dashboard` (e.g. no `/workouts`, no `/settings` at the root).
- New pages are added as nested routes/segments under `src/app/dashboard/` (e.g. [src/app/dashboard/workout/new/page.tsx](../src/app/dashboard/workout/new/page.tsx)), following normal Next.js App Router file conventions.
- The only routes allowed outside `/dashboard` are the ones Clerk requires for unauthenticated users to sign in: `/sign-in` and `/sign-up` ([src/app/sign-in/[[...sign-in]]/page.tsx](../src/app/sign-in/[[...sign-in]]/page.tsx), [src/app/sign-up/[[...sign-up]]/page.tsx](../src/app/sign-up/[[...sign-up]]/page.tsx)), and the root `/` page ([src/app/page.tsx](../src/app/page.tsx)), which should only redirect/link into `/dashboard` or `/sign-in` rather than hosting real app functionality.

## `/dashboard` and all sub-routes are protected

- Every route under `/dashboard` **must** be inaccessible to signed-out users. Protection is enforced centrally in `proxy.ts` ([src/proxy.ts](../src/proxy.ts)) per [docs/auth.md](auth.md) — do not implement per-page redirect checks as the primary gate.
- When adding a new route under `/dashboard`, do not assume it is automatically protected — verify it is covered by the `clerkMiddleware()`/`auth.protect()` matcher in `proxy.ts`, and extend the matcher if the new route falls outside what it currently covers.
- Server Components/pages under `/dashboard` may still call `auth()` from `@clerk/nextjs/server` to read `userId` for data fetching (see [docs/auth.md](auth.md)), but this is for obtaining the current user, not for re-implementing route protection.
- Never gate a `/dashboard` route's access using client-side Clerk hooks (`useAuth`, `useUser`) or client-side redirects — protection must happen before the page renders, at the `proxy.ts` layer.
