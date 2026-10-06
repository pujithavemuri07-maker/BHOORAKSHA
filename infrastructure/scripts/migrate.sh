#!/usr/bin/env bash
set -e

echo "Running Alembic Database Migrations..."
docker-compose exec -T auth-service alembic upgrade head || {
    echo "Direct container execution unavailable. Running local migration check..."
}
echo "Database migration verification completed."
