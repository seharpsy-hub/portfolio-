#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Running database migrations..."
alembic upgrade head
echo "Seeding demo data (safe if already seeded)..."
python seed.py || echo "Seed skipped or already applied"
echo "Starting API on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
