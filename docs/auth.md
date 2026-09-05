# Auth Coding Standards

These standards govern how authentication is implemented in this app. They are mandatory, not guidelines.

## Provider: Clerk only

- All authentication and session management **must** use [Clerk](https://clerk.com) via `@clerk/nextjs`. Do not hand-roll auth (custom JWT/session/cookie handling), and do not introduce another auth library (NextAuth/Auth.js, Lucia, Supabase Auth, etc.).
- Wrap the app in `<ClerkProvider>` once, in the root layout ([src/app/layout.tsx](../src/app/layout.tsx)). Do not add a second `ClerkProvider` further down the tree.

## Route protection: `proxy.ts`, not `middleware.ts`

- This app is on Next.js 16, which renamed the middleware file convention to `proxy.ts` at the project root ([src/proxy.ts](../src/proxy.ts)). Route protection is configured there via `clerkMiddleware()` from `@clerk/nextjs/server` — do not create a `middleware.ts` file; Next 16 will not pick it up.
- Keep the `matcher` config on `proxy.ts` covering app routes plus `/(api|trpc)(.*)` and `/__clerk/:path*`, as already set up. If a route needs to be excluded from Clerk (e.g. a new static asset type), extend the existing matcher regex rather than adding a second matcher block.
- To require auth on specific routes, use `clerkMiddleware`'s `createRouteMatcher` + `auth.protect()` pattern inside the `proxy.ts` handler — don't do redirect-based gating inside individual pages/layouts.

## Reading auth state on the server

- In Server Components, Server Actions, and Route Handlers, get the current user via `auth()` from `@clerk/nextjs/server` (see [src/app/dashboard/page.tsx](../src/app/dashboard/page.tsx)):

  ```ts
  import { auth } from "@clerk/nextjs/server";

  const { userId } = await auth();
  ```

- Never call client-side Clerk hooks (`useAuth`, `useUser`, etc.) to gate data fetching — this app fetches data only in Server Components per [docs/data-fetching.md](data-fetching.md). Client Components may use Clerk's client hooks for presentation only (e.g. showing the signed-in user's name), never to decide what data to fetch.
- Pass `userId` into `src/data/` helpers as a plain parameter (e.g. `getWorkoutsForUserByDate(userId, date)`) — data helpers must not call `auth()` themselves; keep the Clerk dependency at the page/Server Component boundary.

## UI: Clerk + shadcn components only

- Sign-in and sign-up pages use Clerk's prebuilt `<SignIn />` / `<SignUp />` components on their own catch-all routes ([src/app/sign-in/[[...sign-in]]/page.tsx](../src/app/sign-in/[[...sign-in]]/page.tsx), [src/app/sign-up/[[...sign-up]]/page.tsx](../src/app/sign-up/[[...sign-up]]/page.tsx)). Do not build custom sign-in/sign-up forms.
- For conditional signed-in/signed-out UI, use Clerk's `<Show when="signed-in">` / `<Show when="signed-out">` (see root layout) rather than checking user state manually and branching with `if`.
- Use Clerk's `<UserButton />`, `<SignInButton />`, `<SignUpButton />` for account UI in the header. Any surrounding layout (containers, spacing) should still follow [docs/ui.md](ui.md) — shadcn primitives only, no hand-rolled components.

## Secrets and environment

- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) live in environment variables only — never hardcode keys or commit them. Do not log secret keys; the existing `console.log` debug lines in pages should only ever log non-secret identifiers like `userId`.
