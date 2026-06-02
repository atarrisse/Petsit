# Backend implementation log (Petsit)

Living record of **what we planned**, **what we decided**, and **what we shipped** for the Python + PostgreSQL backend.

| Document | Role |
|----------|------|
| [`backend-planning.md`](backend-planning.md) | **Canonical spec** — architecture, schema, API contracts |
| [`backend-concepts.md`](backend-concepts.md) | Metaphors for FastAPI, SQLAlchemy, Alembic, etc. |
| **This file** | **Progress tracker + changelog** — update as we go |

---

## Implementation checklist

Status key: `done` | `in_progress` | `pending` | `skipped`

| # | Phase | Task | Status | Notes |
|---|-------|------|--------|-------|
| 0 | Docs | Official spec [`backend-planning.md`](backend-planning.md) | done | User committed |
| 0 | Docs | Remove outdated `backend-handoff.md`; planning is single source of truth | done | |
| 0 | Docs | Concepts / metaphors [`backend-concepts.md`](backend-concepts.md) | done | |
| 0 | Docs | This implementation log | done | You are here |
| 1 | Scaffold | `backend/` project (`requirements.txt`, `.env.example`, FastAPI app) | done | Verified 2026-06-02 |
| 1 | Scaffold | `.gitignore` for `backend/.env`, `.venv`, Python caches | done | |
| 2 | Local DB | `docker-compose.yml` for Postgres | pending | |
| 3 | DB | Alembic init + `DATABASE_URL` wiring | pending | |
| 4 | DB | SQLAlchemy models (DDD tables) | pending | See planning doc |
| 5 | DB | Initial Alembic migration | pending | |
| 6 | API | `GET /api/dogs`, `GET /api/dogs/{slug}` (domain shape) | pending | |
| 7 | API | `GET /api/legacy/dogs`, `GET /api/legacy/dogs/{slug}` | pending | Option A: separate paths |
| 8 | Data | `backend/scripts/import_json.py` | pending | Best-effort from `data/*.json` |
| 9 | Build | Eleventy fetches legacy API at build time | pending | `API_URL` env |
| 10 | Admin | Write endpoints + auth | pending | Phase 3 |
| 11 | Deploy | Neon/Supabase + Railway/Render + CI `API_URL` | pending | Phase 4 |

---

## Key decisions (frozen unless we revisit)

Recorded here so we do not re-litigate during implementation.

### Architecture

- **Monorepo**: one git repo; `backend/`, `templates/`, `data/`, `docs/` together.
- **Static public site**: Eleventy + GitHub Pages unchanged.
- **Backend**: FastAPI + PostgreSQL as source of truth.
- **Build-time fetch**: Eleventy calls API when building (not runtime in browser).

### Data model (DDD)

- Aggregate root: **Dog** with subdomains **Routine**, **Security**, **Behaviour**, **Health**.
- **Routine** owns `feeding_entries` and `bathroom_entries` (`routine_id` FK).
- **No** stored `alerts` / `warnings` — computed on FE.
- **No JSONB** for simple fields: use `TEXT` and `TEXT[]` (see planning doc).
- **Legacy JSON import**: arrays like `health` / `treats` joined to `TEXT`; feeding/bathroom parsed heuristically.

### API

- **Domain API** for admin / correctness: nested `identity`, `routine`, `security`, `behaviour`, `health`.
- **Legacy API** for Eleventy: **`GET /api/legacy/dogs`** and **`GET /api/legacy/dogs/{slug}`** (not query param).

### Environment files

- **`backend/.env`** — secrets / `DATABASE_URL` (not committed).
- **`backend/.env.example`** — template (committed).
- Root `.env` optional later for Eleventy `API_URL` (not set up yet).

### Commits (suggested slices)

We commit in small vertical slices; user commits unless they ask the agent to.

1. `docs: add backend planning and concepts`
2. `backend: scaffold FastAPI app and dependencies`
3. `infra: add docker-compose for local Postgres`
4. `db: add models and initial migration`
5. `api: add read-only dog endpoints and legacy serializer`
6. `data: add JSON import script`
7. `build: wire Eleventy to legacy API`

---

## Changelog (what we did, in order)

### 2026-06-02 — Planning and documentation

- Agreed on **FastAPI + Postgres**, keep **Eleventy static**, **monorepo**.
- Chose **DDD** over generic `dog_list_items` table.
- Defined subdomains: Routine (structured feeding/bathroom), Security (`chipped`, `microchip`, tracker), Behaviour, Health (medications).
- Typed fields on Dog: gender enum, size enum, energy 0–5, age as value+unit, optional DOB.
- Storage: `TEXT[]` for enjoys/struggles/commands; `TEXT` for conditions, trauma, treats, behaviour notes, etc.
- Legacy endpoints: **Option A** — `/api/legacy/...`.
- Created [`backend-planning.md`](backend-planning.md) as official spec.
- Deleted `docs/backend-handoff.md` (superseded).
- Created [`backend-concepts.md`](backend-concepts.md) (ORM/SQLAlchemy/Alembic metaphors).

### 2026-06-02 — Backend scaffold (item 1)

**Added:**

| Path | Purpose |
|------|---------|
| `backend/README.md` | Setup and run instructions |
| `backend/requirements.txt` | fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary, pydantic-settings, python-dotenv |
| `backend/.env.example` | `DATABASE_URL` placeholder |
| `backend/app/__init__.py` | Package marker |
| `backend/app/main.py` | FastAPI app + `GET /health` |

**Updated:**

| Path | Change |
|------|--------|
| `.gitignore` | Ignore `backend/.env`, `backend/.venv`, Python caches, root `.venv` |

**Verified (local):**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- `GET http://localhost:8000/health` → `{"ok":true}` (200)
- `GET http://localhost:8000/docs` → Swagger UI (200)
- pip upgrade warning (old pip in venv) is harmless; optional: `python3 -m pip install --upgrade pip`

**Not in git (local only):**

- `backend/.venv/` — virtual environment
- `backend/.env` — copy from `.env.example` when Postgres is added

---

## How to verify each future step

### After docker-compose (item 2)

```bash
docker compose up -d
docker compose ps
# optional: psql or GUI connect to localhost:5432
```

### After Alembic + migration (items 3–5)

```bash
cd backend && source .venv/bin/activate
alembic upgrade head
# confirm tables exist in DB
```

### After read API (items 6–7)

```bash
curl http://localhost:8000/api/dogs
curl http://localhost:8000/api/legacy/dogs
```

### After import script (item 8)

```bash
python -m scripts.import_json   # exact command TBD when script exists
curl http://localhost:8000/api/dogs/odi
```

---

## Open questions / later

- [ ] Auth for write endpoints (API key vs basic auth) — Phase 3
- [ ] Pin dependency versions in `requirements.txt` for reproducible builds
- [ ] `pip-audit` or Dependabot in CI
- [ ] Root `.env.example` for Eleventy `API_URL`

---

## Session notes

_Use this section for quick notes during a work session (commands run, blockers, PR links)._

| Date | Note |
|------|------|
| 2026-06-02 | Scaffold verified; uvicorn running on :8000 |
| | Next up: `docker-compose.yml` + Postgres |
