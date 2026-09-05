# Data Fetching Coding Standards

These standards govern how data is fetched from Neon (via Drizzle ORM) in this app. They are mandatory, not guidelines.

## Server components only

- **All data fetching must happen in React Server Components.** Fetch data by `await`-ing a helper directly inside a Server Component (or a Server Action invoked from one) — never in a Client Component.
- **No client-side fetching of any kind.** This means no `"use client"` component may call a data helper, and no `useEffect`, `useState`+fetch, SWR, React Query, or similar client-side data-fetching pattern is allowed anywhere in the app.
- **No client-side routing.** Do not use `next/navigation`'s client hooks (`useRouter`, `useSearchParams`, `usePathname`) or `<Link>`-driven client transitions to trigger or gate data loads. Pages and layouts get their data from the server render (route params/searchParams passed into the Server Component), not from client navigation state.
- If a page needs interactivity on top of server-fetched data, fetch the data in the Server Component and pass it down as props to a Client Component for presentation/interaction only. The Client Component must not perform its own fetching.

## Data access lives in `src/data/`

- All Drizzle queries against Neon **must** be written as helper functions under [src/data/](../src/data/) — never inline a `db.query...` / `db.select()...` call directly inside a page, layout, or component file.
- One file per domain/entity (e.g. `src/data/workouts.ts`, `src/data/exercises.ts`), exporting `async` functions that encapsulate a single query or a small set of related queries.
- Helpers import the shared `db` client from [src/db/index.ts](../src/db/index.ts) and the schema/relations from [src/db/schema.ts](../src/db/schema.ts). Do not construct a separate Drizzle/Neon client elsewhere.
- Server Components call these helpers directly (`const workouts = await getWorkoutsForUser(userId);`) — they do not call `fetch()` against an internal API route to get the same data.
- Keep helpers focused and typed: accept plain parameters (ids, filters), return plain data (rely on Drizzle's inferred types), and let TypeScript `strict` mode catch mistakes — no `any`.

## No raw SQL

- **Never write raw SQL anywhere** — no `db.execute(sql\`...\`)`, no template-literal queries, no string-built statements, in helpers, migrations config, or scripts. Express every query through Drizzle's query builder (`db.select()`, `db.query.*`, `db.insert()`, `db.update()`, `db.delete()`) and its operators (`eq`, `and`, `or`, `inArray`, etc.).
- If a query seems to require raw SQL, that's a signal to model it properly with Drizzle's builder/relations API instead — raise it for discussion rather than dropping to raw SQL.

## Every query must be scoped to the logged-in user

- **A user must only ever be able to read or write their own data — never another user's.** This is a security requirement, not a nice-to-have.
- Get the current user's id from the server-side auth session inside the Server Component (e.g. `const { userId } = await auth();` from `@clerk/nextjs/server`) and pass it into the data helper as an explicit parameter. Never trust a user id that comes from a route param, query string, form field, or client input for scoping a query.
- Every helper in `src/data/` that reads or writes user-owned data (workouts, workout exercises, sets, etc.) **must** take the authenticated `userId` as a parameter and include it in the `where` clause (directly on tables with a `userId` column, or via a join/`exists` check for child tables like `workoutExercises`/`sets` that only have it through their parent `workout`). A helper must never fetch or mutate user-owned rows by id alone (e.g. `eq(workouts.id, workoutId)`) without also filtering by `userId`.
- Shared/global, non-user-owned data (e.g. `exercises`) is exempt from user scoping, but double-check for each table whether it's actually shared or per-user before treating it as global.
- When updating or deleting, scope the `where` clause by `userId` as well as by id, so a request for someone else's row simply matches nothing rather than silently succeeding.

### Example

```ts
// src/data/workouts.ts
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function getWorkoutForUser(userId: string, workoutId: number) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return workout;
}
```

```tsx
// src/app/dashboard/page.tsx (Server Component, no "use client")
import { auth } from '@clerk/nextjs/server';
import { getWorkoutsForUser } from '@/data/workouts';

export default async function DashboardPage() {
  const { userId } = await auth();
  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

`WorkoutList` may be a Client Component for interactivity, but it receives `workouts` as a prop — it never fetches data itself.
