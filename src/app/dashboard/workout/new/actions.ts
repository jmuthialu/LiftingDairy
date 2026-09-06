"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";
import { toDateKey } from "@/lib/date";

const createWorkoutSchema = z.object({
  name: z.string().trim().min(1).nullable(),
  startedAt: z.coerce.date(),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      success: false as const,
      error: { formErrors: ["You must be signed in."], fieldErrors: {} },
    };
  }

  await createWorkout({ userId, ...parsed.data });
  revalidatePath("/dashboard");
  return { success: true as const, dateKey: toDateKey(parsed.data.startedAt) };
}
