import { defineRelations } from 'drizzle-orm';
import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const workouts = pgTable(
  'workouts',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name'),
    startedAt: timestamp('started_at').notNull(),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('workouts_user_id_idx').on(table.userId)],
);

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  weight: numeric('weight').notNull(),
  reps: integer('reps').notNull(),
  rpe: numeric('rpe'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const schema = { exercises, workouts, workoutExercises, sets };

export const relations = defineRelations(schema, (r) => ({
  workouts: {
    workoutExercises: r.many.workoutExercises({
      from: r.workouts.id,
      to: r.workoutExercises.workoutId,
    }),
  },
  exercises: {
    workoutExercises: r.many.workoutExercises({
      from: r.exercises.id,
      to: r.workoutExercises.exerciseId,
    }),
  },
  workoutExercises: {
    workout: r.one.workouts({
      from: r.workoutExercises.workoutId,
      to: r.workouts.id,
    }),
    exercise: r.one.exercises({
      from: r.workoutExercises.exerciseId,
      to: r.exercises.id,
    }),
    sets: r.many.sets({
      from: r.workoutExercises.id,
      to: r.sets.workoutExerciseId,
    }),
  },
  sets: {
    workoutExercise: r.one.workoutExercises({
      from: r.sets.workoutExerciseId,
      to: r.workoutExercises.id,
    }),
  },
}));
