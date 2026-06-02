# Petsit backend

FastAPI + PostgreSQL backend for Petsit.

Canonical specification: `docs/backend-planning.md`.

## Setup (local)

Create a virtualenv and install dependencies:

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

Open:

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

# Petsit backend

FastAPI + PostgreSQL backend for Petsit.

See the canonical spec: `docs/backend-planning.md`.

