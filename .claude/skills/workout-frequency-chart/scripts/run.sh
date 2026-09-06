#!/usr/bin/env bash
# Bootstraps an isolated virtualenv for this skill (the system Python here is
# "externally managed" and refuses top-level `pip install`) and runs the
# chart generator through it. Safe to re-run: the venv is only built once.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="$DIR/.venv"

if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet --upgrade pip
  "$VENV/bin/pip" install --quiet -r "$DIR/requirements.txt"
fi

exec "$VENV/bin/python" "$DIR/generate_chart.py" "$@"
