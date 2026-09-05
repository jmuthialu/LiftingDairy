import { parse } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { WorkoutDashboard } from "@/components/workout-dashboard";
import { getWorkoutsForUserByDate } from "@/data/workouts";
import { DATE_KEY_FORMAT } from "@/lib/date";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date } = await searchParams;

  const selectedDate = date
    ? parse(date, DATE_KEY_FORMAT, new Date())
    : new Date();

  const workouts = userId
    ? await getWorkoutsForUserByDate(userId, selectedDate)
    : [];

  return <WorkoutDashboard selectedDate={selectedDate} workouts={workouts} />;
}
