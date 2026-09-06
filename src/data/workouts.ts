import { addDays, startOfDay } from 'date-fns';
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function createWorkout(input: {
  userId: string;
  name: string | null;
  startedAt: Date;
}) {
  const [workout] = await db.insert(workouts).values(input).returning();
  return workout;
}

export async function getWorkoutsForUserByDate(userId: string, date: Date) {
  const start = startOfDay(date);
  const end = addDays(start, 1);

  return db.query.workouts.findMany({
    where: {
      userId,
      startedAt: { gte: start, lt: end },
    },
    with: {
      workoutExercises: {
        orderBy: { order: 'asc' },
        with: {
          exercise: true,
          sets: {
            orderBy: { setNumber: 'asc' },
          },
        },
      },
    },
    orderBy: { startedAt: 'asc' },
  });
}

export type WorkoutForDate = Awaited<
  ReturnType<typeof getWorkoutsForUserByDate>
>[number];
