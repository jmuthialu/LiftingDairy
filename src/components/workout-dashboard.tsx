"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate, toDateKey } from "@/lib/date";
import type { WorkoutForDate } from "@/data/workouts";

type WorkoutDashboardProps = {
  selectedDate: Date;
  workouts: WorkoutForDate[];
};

export function WorkoutDashboard({
  selectedDate,
  workouts,
}: WorkoutDashboardProps) {
  const router = useRouter();

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    router.push(`/dashboard?date=${toDateKey(date)}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
      <Card className="w-fit">
        <CardContent className="px-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            required
          />
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Workouts</CardTitle>
          <CardDescription>{formatDisplayDate(selectedDate)}</CardDescription>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workouts logged for this date.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-3"
                >
                  <span className="text-sm font-medium">
                    {workout.name ?? "Workout"}
                  </span>
                  <ul className="flex flex-col gap-2">
                    {workout.workoutExercises.map((workoutExercise) => (
                      <li
                        key={workoutExercise.id}
                        className="flex items-center justify-between rounded-md bg-muted/50 p-2"
                      >
                        <span className="text-sm">
                          {workoutExercise.exercise?.name}
                        </span>
                        <Badge variant="secondary">
                          {workoutExercise.sets.length} sets
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
