import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>New workout</CardTitle>
        </CardHeader>
        <CardContent>
          {userId ? (
            <NewWorkoutForm />
          ) : (
            <p className="text-sm text-muted-foreground">
              You must be signed in to create a workout.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
