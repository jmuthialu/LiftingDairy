"use client";

import { useMemo, useState } from "react";
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
import type { Workout } from "@/lib/types";

// Placeholder data keyed by yyyy-MM-dd. Replace with real data fetching.
const WORKOUTS_BY_DATE: Record<string, Workout[]> = {
  [toDateKey(new Date())]: [
    { id: "1", name: "Bench Press", category: "Push", sets: 4, reps: 8 },
    { id: "2", name: "Overhead Press", category: "Push", sets: 3, reps: 10 },
    { id: "3", name: "Tricep Pushdown", category: "Push", sets: 3, reps: 12 },
  ],
};

export function WorkoutDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const workouts = useMemo(
    () => WORKOUTS_BY_DATE[toDateKey(selectedDate)] ?? [],
    [selectedDate]
  );

  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
      <Card className="w-fit">
        <CardContent className="px-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
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
            <ul className="flex flex-col gap-3">
              {workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {workout.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {workout.sets} sets &times; {workout.reps} reps
                    </span>
                  </div>
                  <Badge variant="secondary">{workout.category}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
