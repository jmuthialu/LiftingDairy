# Data Mutation Coding Standards

These standards govern how data is mutated (created, updated, deleted) in this app. They are mandatory, not guidelines.

## Mutation logic lives in `src/data/`

- All Drizzle mutations against Neon (`insert`, `update`, `delete`) **must** be written as helper functions under [src/data/](../src/data/) — never inline a `db.insert()...` / `db.update()...` / `db.delete()...` call directly inside a Server Action, page, layout, or component file.
- Colocate mutation helpers with query helpers for the same domain/entity (e.g. `src/data/workouts.ts` holds both `getWorkoutsForUser` and `createWorkout`).
- Helpers import the shared `db` client from [src/db/index.ts](../src/db/index.ts) and the schema/relations from [src/db/schema.ts](../src/db/schema.ts). Do not construct a separate Drizzle/Neon client elsewhere.
- Keep helpers focused and typed: accept plain parameters, return plain data (rely on Drizzle's inferred types), and let TypeScript `strict` mode catch mistakes — no `any`.

## All mutations happen via Server Actions in colocated `actions.ts` files

- Every data mutation **must** be triggered through a Server Action — never call a `src/data/` mutation helper directly from a Client Component, a route handler, or inline in a Server Component.
- Server Actions live in a file named `actions.ts`, colocated with the route/feature that uses them (e.g. `src/app/workouts/actions.ts`). Do not scatter Server Actions across arbitrary files or put them inside component files.
- Each `actions.ts` file starts with `"use server"` at the top.
- A Server Action's job is to: validate input (see below), call the appropriate helper(s) in `src/data/`, and trigger any necessary revalidation (`revalidatePath` / `revalidateTag`). It must not contain raw Drizzle query-building itself.

## Server Action parameters must be typed — never `FormData`

- Server Actions **must** accept explicitly typed parameters (primitives, plain objects, arrays with concrete types) — never accept a `FormData` argument.
- This means forms must be wired up client-side to call the action with a typed object (e.g. via `react-hook-form` + calling the action in `onSubmit`, or constructing a typed object from form state) rather than relying on the `<form action={...}>` + `FormData` pattern.

## All Server Action arguments must be validated with Zod

- Every Server Action **must** validate its incoming arguments with a [Zod](https://zod.dev/) schema before doing anything else — no exceptions, even for simple-looking inputs (ids, enums, etc.).
- Define the Zod schema next to the action (in the same `actions.ts` file, or imported from a colocated `schema.ts`) and parse/validate at the top of the action body using `schema.parse(...)` or `schema.safeParse(...)`. Prefer `safeParse` and return a typed error result rather than throwing, so the caller can handle validation failures gracefully.
- Derive the action's parameter type from the Zod schema with `z.infer<typeof schema>` rather than hand-writing a duplicate TypeScript type.

### Example

```ts
// src/data/workouts.ts
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function createWorkout(input: { userId: string; name: string; date: Date }) {
  const [workout] = await db.insert(workouts).values(input).returning();
  return workout;
}
```

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  date: z.coerce.date(),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }

  const workout = await createWorkout(parsed.data);
  revalidatePath("/workouts");
  return { success: true as const, workout };
}
```

```tsx
// src/app/workouts/new-workout-form.tsx (Client Component)
"use client";

import { createWorkoutAction } from "./actions";

export function NewWorkoutForm({ userId }: { userId: string }) {
  async function handleSubmit(name: string, date: Date) {
    const result = await createWorkoutAction({ userId, name, date });
    // handle result.success / result.error
  }

  // ...form markup calling handleSubmit with typed values, not FormData
}
```
