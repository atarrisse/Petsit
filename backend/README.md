# Petsit backend

FastAPI + PostgreSQL backend for Petsit.

**Specification:** [`docs/product/03-PRODUCT-REQUIREMENTS.md`](../docs/product/03-PRODUCT-REQUIREMENTS.md)  
**Build order:** [`docs/product/02-ROADMAP.md`](../docs/product/02-ROADMAP.md) (M1 → M4)  
**Concept model:** [`docs/product/04-OOUX-OBJECT-MAP.md`](../docs/product/04-OOUX-OBJECT-MAP.md)

Legacy backend planning docs: [`docs/archive/`](../docs/archive/README.md)

## Quick start (daily dev)

From the **repo root** or **`backend/`** (Docker Desktop running, after one-time setup below):

```bash
make db-up    # Postgres
make dev      # API → http://localhost:8000/health
```

Stop Postgres: `make db-down`. List commands: `make help`.

## One-time setup

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
```

Default `DATABASE_URL` (matches Docker Compose):

```
postgresql+psycopg2://postgres:postgres@localhost:5432/petsit
```

## URLs

- Health: http://localhost:8000/health
- Docs: http://localhost:8000/docs

(`http://localhost:8000/` returns 404 until more routes exist. Postgres on port 5432 is not a web page.)

## Manual commands (without Make)

Postgres (repo root):

```bash
docker compose up -d
docker compose down
```

API (`backend/`):

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Or: `.venv/bin/uvicorn app.main:app --reload --port 8000`
