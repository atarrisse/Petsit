# Petsit local dev shortcuts (run from repo root).
# Requires: Docker Desktop (for db-up), Python venv in backend/ (for dev).

.PHONY: help db-up db-down db-ps dev

help:
	@echo "Petsit dev commands (from repo root):"
	@echo "  make db-up   Start Postgres (Docker)"
	@echo "  make db-down Stop Postgres"
	@echo "  make db-ps   Show Postgres container status"
	@echo "  make dev     Run FastAPI with reload on :8000"

db-up:
	docker compose up -d

db-down:
	docker compose down

db-ps:
	docker compose ps

dev:
	@test -x backend/.venv/bin/uvicorn || ( \
		echo "Missing backend/.venv — run once:"; \
		echo "  cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"; \
		exit 1)
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000
