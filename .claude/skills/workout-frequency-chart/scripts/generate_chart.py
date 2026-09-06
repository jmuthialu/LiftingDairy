"""Query Neon/Postgres for workouts in the past year and chart monthly counts.

Reads DATABASE_URL from the project's .env (searched upward from the current
working directory), counts workouts.started_at per calendar month for the
trailing 12-month window, and renders a bar chart as a PNG.

This talks to Postgres directly with psycopg2 rather than going through the
app's Drizzle layer (docs/data-fetching.md governs the Next.js app's server
components, not standalone offline tooling like this script).
"""

from __future__ import annotations

import argparse
import os
import sys
from collections import OrderedDict
from datetime import date

import psycopg2
from dateutil.relativedelta import relativedelta
from dotenv import find_dotenv, load_dotenv

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def month_key(d: date) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def month_label(d: date) -> str:
    return d.strftime("%b %Y")


def trailing_months(months: int, today: date) -> list[date]:
    start_of_this_month = today.replace(day=1)
    return [start_of_this_month - relativedelta(months=offset) for offset in range(months - 1, -1, -1)]


def fetch_monthly_counts(database_url: str, user_id: str | None, months: int) -> "OrderedDict[str, int]":
    today = date.today()
    window_start = trailing_months(months, today)[0]

    query = """
        select date_trunc('month', started_at)::date as month, count(*) as workout_count
        from workouts
        where started_at >= %s
    """
    params: list[object] = [window_start]
    if user_id:
        query += " and user_id = %s"
        params.append(user_id)
    query += " group by 1 order by 1"

    with psycopg2.connect(database_url) as conn, conn.cursor() as cur:
        cur.execute(query, params)
        rows = cur.fetchall()

    counts: "OrderedDict[str, int]" = OrderedDict((month_key(d), 0) for d in trailing_months(months, today))
    for month_start, workout_count in rows:
        key = month_key(month_start)
        if key in counts:
            counts[key] = workout_count
    return counts


def render_chart(counts: "OrderedDict[str, int]", output_path: str, user_id: str | None) -> None:
    labels = [month_label(date(*map(int, key.split("-")), 1)) for key in counts]
    values = list(counts.values())

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(labels, values, color="#4C72B0")
    ax.set_xlabel("Month")
    ax.set_ylabel("Number of Workouts")
    title = "Workout Frequency — Past Year"
    if user_id:
        title += f" ({user_id})"
    ax.set_title(title)
    ax.set_ylim(bottom=0)
    for i, v in enumerate(values):
        ax.text(i, v, str(v), ha="center", va="bottom")
    plt.xticks(rotation=45, ha="right")
    fig.tight_layout()

    os.makedirs(os.path.dirname(os.path.abspath(output_path)) or ".", exist_ok=True)
    fig.savefig(output_path, dpi=150)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user-id", default=None, help="Clerk user id to filter workouts by (default: all users)")
    parser.add_argument("--months", type=int, default=12, help="Trailing month window (default: 12)")
    parser.add_argument(
        "--output",
        default="exports/workout_frequency.png",
        help="Path to write the PNG chart to (default: exports/workout_frequency.png)",
    )
    parser.add_argument("--env-file", default=None, help="Explicit path to a .env file (default: auto-discovered)")
    args = parser.parse_args()

    env_path = args.env_file or find_dotenv(usecwd=True)
    if env_path:
        load_dotenv(env_path)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL is not set (checked environment and .env). Aborting.", file=sys.stderr)
        sys.exit(1)

    counts = fetch_monthly_counts(database_url, args.user_id, args.months)
    render_chart(counts, args.output, args.user_id)

    print(f"Wrote chart to {os.path.abspath(args.output)}")
    for key, count in counts.items():
        print(f"  {month_label(date(*map(int, key.split('-')), 1))}: {count}")


if __name__ == "__main__":
    main()
