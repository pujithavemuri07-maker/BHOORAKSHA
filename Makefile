.PHONY: help up down restart logs ps clean test build migrate seed

help:
	@echo "Bhooraksha (भूरक्षा) - Enterprise Land Protection Platform"
	@echo "--------------------------------------------------------"
	@echo "make up         - Start all services with Docker Compose"
	@echo "make down       - Stop all services"
	@echo "make restart    - Restart all services"
	@echo "make logs       - View streaming logs"
	@echo "make ps         - Show container status"
	@echo "make build      - Build all docker images"
	@echo "make test       - Run backend tests"
	@echo "make migrate    - Run database migrations"
	@echo "make seed       - Seed initial roles and test data"
	@echo "make clean      - Clean cache and temp files"

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

ps:
	docker-compose ps

build:
	docker-compose build

test:
	pytest auth-service/tests
	pytest ai-agent-orchestrator/tests

migrate:
	docker-compose exec auth-service alembic upgrade head

seed:
	python infrastructure/scripts/seed_data.py

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
