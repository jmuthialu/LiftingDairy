---
name: workout-frequency-chart
description: Generate a bar chart of monthly workout counts for the past year from LiftingDairy's Neon Postgres database, exported as a PNG image. Use this whenever the user asks to visualize, chart, plot, or graph workout frequency/counts/history over time, wants a "workouts per month" breakdown, or asks how consistent their training has been over the past year — even if they don't mention "chart" explicitly (e.g. "how many times did I work out each month this year?", "show my training consistency").
---

# Workout Frequency Chart

Queries the `workouts` table directly (via `DATABASE_URL` in the project's
`.env`) for the trailing 12 months and renders a bar chart — month on the
x-axis, workout count on the y-axis — saved as a PNG.

This is a standalone offline tool, not app code: it connects to Postgres
with `psycopg2` rather than going through the app's Drizzle layer in
`src/data/`, so [docs/data-fetching.md](../../../docs/data-fetching.md)'s
server-component rules don't apply here.

## Running it

The script needs its own virtualenv (the system Python is externally
managed and refuses top-level `pip install`). Always invoke it through
`run.sh`, which builds the venv on first use and then runs the script
through it:

```bash
.claude/skills/workout-frequency-chart/scripts/run.sh [options]
```

Options (all optional):

- `--user-id <clerk_user_id>` — scope to one user's workouts. Omit to
  aggregate across all users (the workouts table has a `user_id` column
  because the app is Clerk-multi-tenant, but a personal deployment may only
  ever have one user).
- `--months <n>` — trailing window size in months, default `12`.
- `--output <path>` — where to write the PNG, default
  `exports/workout_frequency.png` (relative to the current working
  directory; the directory is created if it doesn't exist).
- `--env-file <path>` — explicit `.env` path. By default the script
  searches upward from the current working directory for one, so running
  it from the project root (or anywhere inside the repo) picks up the
  existing `.env` automatically.

The script prints the saved PNG path and a per-month count breakdown to
stdout when it finishes — relay both to the user, and mention the output
path so they can open the image.

## Notes on the query

- Counts one row per `workouts.started_at` bucketed into its calendar
  month (`date_trunc('month', started_at)`), covering the trailing N
  months (default 12) ending with the current month.
- Months with zero workouts are still plotted at height 0 — the trailing
  window is generated in Python first, then counts are filled in, so gaps
  in training show up as visible dips rather than disappearing from the
  x-axis.
- If asked for a different date range, a different table/column, or a
  breakdown by exercise instead of by month, edit
  `scripts/generate_chart.py` directly rather than trying to force it
  through CLI flags that don't exist yet — it's a short, single-purpose
  script.
