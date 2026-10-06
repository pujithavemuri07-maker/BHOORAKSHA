#!/usr/bin/env bash
set -e

echo "============================================================"
echo "🏛️ Bhooraksha Platform Setup & Initialization"
echo "============================================================"

# Ensure .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Create required directories
mkdir -p storage/documents/pending storage/documents/processed storage/documents/verified storage/temp
mkdir -p logs/auth-service logs/citizen-service logs/ai-orchestrator logs/nginx logs/celery
mkdir -p models/ocr/chitrapathak-1 models/ner/muril-address-ner models/llm/llama-3.2-3b

touch storage/documents/.gitkeep storage/temp/.gitkeep models/.gitkeep

echo "Directory structure initialized successfully."
echo "Starting containers..."
docker-compose up -d postgres redis rabbitmq minio

echo "Waiting for services to become healthy..."
sleep 5

echo "Setup completed successfully. Ready for service launch!"
