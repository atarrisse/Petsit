# Backend implementation log (Petsit)

Living record of **what we planned**, **what we decided**, and **what we shipped** for the Python + PostgreSQL backend.

| Document                                     | Role                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| [`backend-planning.md`](backend-planning.md) | **Canonical spec** — architecture, schema, API contracts |
| [`backend-concepts.md`](backend-concepts.md) | Metaphors for FastAPI, SQLAlchemy, Alembic, etc.         |
| **This file**                                | **Progress tracker + changelog** — update as we go       |

---

## Implementation checklist

Status key: `done` | `in_progress` | `pending` | `skipped`

| #   | Phase    | Task                                                                     | Status  | Notes                                   |
| --- | -------- | ------------------------------------------------------------------------ | ------- | --------------------------------------- |
| 0   | Docs     | Official spec [`backend-planning.md`](backend-planning.md)               | done    | User committed                          |
| 0   | Docs     | Remove outdated `backend-handoff.md`; planning is single source of truth | done    |                                         |
| 0   | Docs     | Concepts / metaphors [`backend-concepts.md`](backend-concepts.md)        | done    |                                         |
| 0   | Docs     | This implementation log                                                  | done    | Updated each milestone                  |
| 1   | Scaffold | `backend/` project (`requirements.txt`, `.env.example`, FastAPI app)     | done    | Verified 2026-06-02                     |
| 1   | Scaffold | `.gitignore` for `backend/.env`, `.venv`, Python caches                  | done    |                                         |
| 2   | Local DB | `docker-compose.yml` for Postgres                                        | done    | Postgres 16, db `petsit`, `restart: no` |
| 2   | DX       | Repo root `Makefile` (`db-up`, `dev`, …)                                 | done    | No manual `source` for API              |
| 3   | DB       | Alembic init + `DATABASE_URL` wiring                                     | pending | **Next**                                |
| 4   | DB       | SQLAlchemy models (DDD tables)                                           | pending | See planning doc                        |
| 5   | DB       | Initial Alembic migration                                                | pending |                                         |
| 6   | API      | `GET /api/dogs`, `GET /api/dogs/{slug}` (domain shape)                   | pending |                                         |
| 7   | API      | `GET /api/legacy/dogs`, `GET /api/legacy/dogs/{slug}`                    | pending | Option A: separate paths                |
| 8   | Data     | `backend/scripts/import_json.py`                                         | pending | Best-effort from `data/*.json`          |
| 9   | Build    | Eleventy fetches legacy API at build time                                | pending | `API_URL` env                           |
| 10  | Admin    | Write endpoints + auth                                                   | pending | Phase 3                                 |
| 11  | Deploy   | Neon/Supabase + Railway/Render + CI `API_URL`                            | pending | Phase 4                                 |

---

## Key decisions (frozen unless we revisit)

Recorded here so we do not re-litigate during implementation.

### Architecture

- **Monorepo**: one git repo; `backend/`, `templates/`, `data/`, `docs/` together.
- **Static public site**: Eleventy + GitHub Pages unchanged.
- **Backend**: FastAPI + PostgreSQL as source of truth.
- **Build-time fetch**: Eleventy calls API when building (not runtime in browser).

### Local infrastructure

- **Postgres in Docker** via repo-root `docker-compose.yml` (not Homebrew Postgres).
- **`restart: no`** on `db` — containers do **not** auto-start after Mac/Docker reboot; run `make db-up` when coding.
- **Docker Desktop** (or compatible engine) required on Mac for `make db-up`.
- **Dev shortcuts** from repo root: `make db-up`, `make dev` (see `Makefile`); API uses `backend/.venv/bin/uvicorn` without `source`.

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
- **`backend/.env.example`** — template with default local Docker URL (committed).
- Root `.env` optional later for Eleventy `API_URL` (not set up yet).

### Commits (suggested slices)

We commit in small vertical slices; user commits unless they ask the agent to.

1. ~~`docs: add backend planning and concepts`~~ — done (user)
2. ~~`backend: scaffold FastAPI app and dependencies`~~ — done (user)
3. **`infra: add docker-compose and Makefile for local dev`** — current slice
4. `db: add Alembic, models, and initial migration`
5. `api: add read-only dog endpoints and legacy serializer`
6. `data: add JSON import script`
7. `build: wire Eleventy to legacy API`

---

## Daily dev cheat sheet

From **repo root** (Docker Desktop running):

```bash
make db-up    # Postgres → localhost:5432
make dev      # API → http://localhost:8000/health
```

Stop DB: `make db-down`. List commands: `make help`.

| URL                          | Works?                           |
| ---------------------------- | -------------------------------- |
| http://localhost:8000/health | Yes (when `make dev` is running) |
| http://localhost:8000/docs   | Yes (Swagger)                    |
| http://localhost:8000/       | 404 (no route yet — expected)    |
| http://localhost:5432        | No — Postgres is not a web page  |

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
- Created this implementation log.

### 2026-06-02 — Backend scaffold (checklist #1)

**Added:**

| Path                       | Purpose                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `backend/README.md`        | Setup and run instructions                                                               |
| `backend/requirements.txt` | fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary, pydantic-settings, python-dotenv |
| `backend/.env.example`     | `DATABASE_URL` for local Docker                                                          |
| `backend/app/__init__.py`  | Package marker                                                                           |
| `backend/app/main.py`      | FastAPI app + `GET /health`                                                              |

**Updated:** `.gitignore` — `backend/.env`, `.venv`, Python caches.

**Verified:** `GET /health` and `/docs` on port 8000.

### 2026-06-02 — Local Postgres (checklist #2)

**Added:**

| Path                 | Purpose                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `docker-compose.yml` | Postgres 16 Alpine; user/db `postgres`/`petsit`; port 5432; volume `petsit_pg_data`; healthcheck |
| `Makefile`           | `db-up`, `db-down`, `db-ps`, `dev`, `help`                                                       |

**Updated:**

| Path                       | Change                                                  |
| -------------------------- | ------------------------------------------------------- |
| `backend/README.md`        | Quick start via `make`; manual compose/uvicorn fallback |
| `backend/.env.example`     | Filled default `DATABASE_URL` matching compose          |
| `docs/backend-planning.md` | Link to this log                                        |

**Compose choices recorded:**

| Setting          | Value                              | Why                                                          |
| ---------------- | ---------------------------------- | ------------------------------------------------------------ |
| `image`          | `postgres:16-alpine`               | Pinned major version; small local image                      |
| `container_name` | `petsit-db`                        | Easy to spot in `docker ps`                                  |
| `restart`        | `no`                               | No auto-start after reboot — explicit `docker compose up -d` |
| `environment`    | `postgres` / `postgres` / `petsit` | Local-only; matches `DATABASE_URL`                           |
| `ports`          | `5432:5432`                        | Host `localhost:5432` for app tools                          |
| `volumes`        | `petsit_pg_data`                   | Data survives container recreate                             |
| `healthcheck`    | `pg_isready`                       | `docker compose ps` shows healthy                            |

**Verified (local):**

```bash
# repo root — requires Docker Desktop running
docker compose up -d
docker compose ps              # petsit-db Up (healthy)
docker compose exec db psql -U postgres -d petsit -c 'SELECT 1'

# backend/ — separate terminal
uvicorn app.main:app --reload --port 8000
# browser: http://localhost:8000/health → {"ok":true}
```

**Troubleshooting notes (session):**

- `Cannot connect to the Docker daemon` → start **Docker Desktop** first.
- Run `docker compose` from **repo root** (where `docker-compose.yml` lives).
- Browser on `:5432` will not show a site — use `:8000/health` for the API only.
- `GET /` → 404 is expected until we add a root route.

**Not in git (local only):** `backend/.venv/`, `backend/.env`

### 2026-06-02 — Dev Makefile (checklist #2)

**Added:** repo root `Makefile` — `help`, `db-up`, `db-down`, `db-ps`, `dev`.  
`backend/Makefile` delegates to repo root (so `make dev` works from `backend/` too).

**Updated:** `backend/README.md` — quick start via `make`.

### 2026-06-02 — Git hooks (Husky + lint-staged)

**Added:** `.husky/pre-commit` runs `lint-staged`; `package.json` `prepare` script + `lint-staged` config (`prettier --write --ignore-unknown` on staged files).

**Updated:** root `README.md` — note that `npm install` enables hooks. CI `format:check` unchanged.

**Targets:**

| Target         | Action                                           |
| -------------- | ------------------------------------------------ |
| `make db-up`   | `docker compose up -d`                           |
| `make db-down` | `docker compose down`                            |
| `make db-ps`   | `docker compose ps`                              |
| `make dev`     | `backend/.venv/bin/uvicorn` with reload on :8000 |

---

## How to verify each future step

### Local DB + API (current stack)

```bash
make db-up && make db-ps
make dev
# http://localhost:8000/health
```

### After Alembic + migration (items 3–5)

```bash
cd backend && source .venv/bin/activate && alembic upgrade head
# confirm tables exist in DB
```

### After read API (items 6–7)

```bash
curl http://localhost:8000/api/dogs
curl http://localhost:8000/api/legacy/dogs
```

### After import script (item 8)

```bash
cd backend && source .venv/bin/activate && python -m scripts.import_json   # exact module TBD
curl http://localhost:8000/api/dogs/odi
```

---

## Open questions / later

- [ ] Auth for write endpoints (API key vs basic auth) — Phase 3
- [ ] Pin dependency versions in `requirements.txt` for reproducible builds
- [ ] `pip-audit` or Dependabot in CI
- [ ] Root `.env.example` for Eleventy `API_URL`
- [x] Husky + lint-staged — Prettier on staged files at pre-commit (`npm install` enables hook)

---

## Session notes

| Date       | Note                                                                  |
| ---------- | --------------------------------------------------------------------- |
| 2026-06-02 | Scaffold verified; `/health` + `/docs` on :8000                       |
| 2026-06-02 | `docker compose up` — image pulled, `petsit-db` healthy on :5432      |
| 2026-06-02 | Chose `restart: no` (no DB after reboot until `docker compose up -d`) |
| 2026-06-02 | Added `Makefile` — `make db-up` + `make dev`                          |
| 2026-06-02 | Husky + lint-staged — Prettier on staged files at pre-commit          |
| 2026-06-02 | **Next:** Alembic init + `DATABASE_URL` wiring in app                 |
