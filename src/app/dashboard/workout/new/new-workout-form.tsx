"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkoutAction } from "./actions";

function currentDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentTimeKey(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function NewWorkoutForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [date, setDate] = useState(currentDateKey());
  const [time, setTime] = useState(currentTimeKey());
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const startedAt = new Date(`${date}T${time}`);

    startTransition(async () => {
      const result = await createWorkoutAction({
        name: name.trim() === "" ? null : name.trim(),
        startedAt,
      });

      if (!result.success) {
        setError(
          result.error.formErrors[0] ?? "Could not create workout. Check your input.",
        );
        return;
      }

      router.push(`/dashboard?date=${result.dateKey}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Push day"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
          />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create workout"}
      </Button>
    </form>
  );
}
