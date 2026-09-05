# Data Fetching Coding Standards

These standards govern how data is fetched from Neon (via Drizzle ORM) in this app. They are mandatory, not guidelines.

## Server components only

- **All data fetching must happen in React Server Components or No client-side routing** Fetch data by `await`-ing a helper directly inside a Server Component (or a Server Action invoked from one) — never in a Client Component.
- **No client-side fetching of any kind.** This means no `"use client"` component may call a data helper, and no `useEffect`, `useState`+fetch, SWR, React Query, or similar client-side data-fetching pattern is allowed anywhere in the app.
- If a page needs interactivity on top of server-fetched data, fetch the data in the Server Component and pass it down as props to a Client Component for presentation/interaction only. The Client Component must not perform its own fetching.

## Data access lives in `src/data/`

- All Drizzle queries against Neon **must** be written as helper functions under [src/data/](../src/data/) — never inline a `db.query...` / `db.select()...` call directly inside a page, layout, or component file.
- One file per domain/entity (e.g. `src/data/workouts.ts`, `src/data/exercises.ts`), exporting `async` functions that encapsulate a single query or a small set of related queries.
- Helpers import the shared `db` client from [src/db/index.ts](../src/db/index.ts) and the schema/relations from [src/db/schema.ts](../src/db/schema.ts). Do not construct a separate Drizzle/Neon client elsewhere.
- Server Components call these helpers directly (`const workouts = await getWorkoutsForUser(userId);`) — they do not call `fetch()` against an internal API route to get the same data.
- Keep helpers focused and typed: accept plain parameters (ids, filters), return plain data (rely on Drizzle's inferred types), and let TypeScript `strict` mode catch mistakes — no `any`.

### Example

```ts
// src/data/workouts.ts
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// src/app/dashboard/page.tsx (Server Component, no "use client")
import { getWorkoutsForUser } from '@/data/workouts';

export default async function DashboardPage() {
  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

`WorkoutList` may be a Client Component for interactivity, but it receives `workouts` as a prop — it never fetches data itself.
