# Petsit backend

FastAPI + PostgreSQL backend for Petsit.

Canonical specification: [`docs/backend-planning.md`](../docs/backend-planning.md).  
Progress log: [`docs/backend-implementation-log.md`](../docs/backend-implementation-log.md).

## Setup (local)

### 1. Postgres (Docker)

From the **repo root** (Docker Desktop running):

```bash
docker compose up -d
docker compose ps
```

Default connection (matches `backend/.env.example`):

```
postgresql+psycopg2://postgres:postgres@localhost:5432/petsit
```

Copy env:

```bash
cp backend/.env.example backend/.env
```

Stop the database when done:

```bash
docker compose down
```

Data persists in the `petsit_pg_data` volume until you run `docker compose down -v`.

### 2. Python app

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the API (dev):

```bash
uvicorn app.main:app --reload --port 8000
```

Or without activating the venv:

```bash
.venv/bin/uvicorn app.main:app --reload --port 8000
```

## URLs

- Health: http://localhost:8000/health
- Docs: http://localhost:8000/docs

(`http://localhost:8000/` returns 404 until more routes exist. Postgres on port 5432 is not a web page.)
