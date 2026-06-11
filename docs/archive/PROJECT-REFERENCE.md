# Petsit — complete project reference

**Purpose of this document:** Single source of context for humans and AI assistants working on this repository. Read this first before making changes.

**Last updated:** 2026-06-05  
**Repository:** [github.com/atarrisse/Petsit](https://github.com/atarrisse/Petsit)  
**Live site:** https://atarrisse.github.io/Petsit/

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Architecture: today vs target](#2-architecture-today-vs-target)
3. [Repository layout](#3-repository-layout)
4. [Static site (Eleventy)](#4-static-site-eleventy)
5. [Legacy dog data (`data/*.json`)](#5-legacy-dog-data-datajson)
6. [Templates & rendering](#6-templates--rendering)
7. [Styles (CSS)](#7-styles-css)
8. [Backend (FastAPI) — current state](#8-backend-fastapi--current-state)
9. [Backend — planned design](#9-backend--planned-design)
10. [Local development](#10-local-development)
11. [Tooling: Node, Prettier, Husky](#11-tooling-node-prettier-husky)
12. [CI/CD (GitHub Actions)](#12-cicd-github-actions)
13. [Environment variables](#13-environment-variables)
14. [Git & secrets](#14-git--secrets)
15. [Implementation status & roadmap](#15-implementation-status--roadmap)
16. [Key decisions (do not re-litigate without discussion)](#16-key-decisions-do-not-re-litigate-without-discussion)
17. [Known quirks & technical debt](#17-known-quirks--technical-debt)
18. [Related documentation index](#18-related-documentation-index)
19. [Instructions for AI assistants](#19-instructions-for-ai-assistants)
20. [External services](#20-external-services)

---

## 1. What this project is

**Petsit** is a **petsitting business management platform** built by **Ana Tarrisse**. It started as a personal tool for printable dog care sheets and has expanded into a system that will automate the operational overhead of running a petsitting business: bookings, calendar integration, client communication, and invoicing.

The care sheets remain the foundation and are shipped first. Everything else is built on top.

| Aspect              | Detail                                                                |
| ------------------- | --------------------------------------------------------------------- |
| **Foundation**      | A4-friendly printable dog care sheets (live today)                    |
| **Public site**     | Static site on **GitHub Pages**                                       |
| **Platform target** | Multi-user: petsitter + families; bookings; Google Calendar; invoices |
| **Data today**      | One JSON file per dog in `data/`                                      |
| **Data target**     | **PostgreSQL** via **FastAPI**, Eleventy fetches at **build time**    |
| **License**         | UNLICENSED (private)                                                  |
| **Author**          | Ana Tarrisse                                                          |

**User profile:** Frontend engineer learning backend. Prefer clear explanations, metaphors, and incremental steps.

**Dogs in repo (2026-06-02):** 3 JSON files — `bessi`, `cheeno`, `odi`. Owner has mentioned ~9 dogs total; remaining profiles may exist offline or are not yet committed.

**Platform roadmap detail:** see [`docs/petsit-planning.md`](petsit-planning.md).

---

## 2. Architecture: today vs target

### Today (production)

```text
data/*.json  →  Eleventy build  →  _site/  →  GitHub Pages
```

- No backend in production.
- No database.
- CI only builds and deploys the static site.

### Target (in progress — Phase 1+)

```text
PostgreSQL  ←  FastAPI REST  (GraphQL Phase 5+)
                    ↑
      ┌─────────────┴──────────────┐
      │                            │
Eleventy (build-time)     Admin UI + Client UI (Phase 5)
GET /api/legacy/dogs      CRUD + bookings + invoicing
      │
      ↓
  _site/ → GitHub Pages
```

| Layer       | Technology                              | Hosting (target)  |
| ----------- | --------------------------------------- | ----------------- |
| Static site | Eleventy 3, Nunjucks                    | GitHub Pages      |
| API         | FastAPI, SQLAlchemy, Alembic (REST now) | Railway or Render |
| Database    | PostgreSQL 16                           | Neon or Supabase  |
| Auth        | Auth0 (Phase 2)                         | Auth0 cloud       |
| Email       | Resend or SendGrid (Phase 2)            | Managed service   |
| Calendar    | Google Calendar API (Phase 3)           | Google Cloud      |
| Monorepo    | Single git repo                         | —                 |

**Important:** The public site stays **static**. Browsers do not call the API at runtime. Eleventy will call the API when **building** (Phase 2).

### Stack verdict summary

| Area                    | Status    | Notes                                         |
| ----------------------- | --------- | --------------------------------------------- |
| Eleventy + GitHub Pages | Keep      | Care sheets stay static                       |
| Plain CSS + print focus | Keep      | A4 print layout works well                    |
| Prettier + Husky + CI   | Keep      | Good habits, keep as-is                       |
| FastAPI + PostgreSQL    | Correct   | Platform scope justifies it                   |
| Unpinned Python deps    | Fix early | Will cause breakage                           |
| No backend tests        | Fix early | Add one integration test before hosting       |
| GraphQL                 | Phase 5+  | After data model is stable and REST is proven |

---

## 3. Repository layout

```text
Repo/
├── .eleventy.js              # Eleventy config, dogs collection, slugify
├── .github/workflows/
│   └── pages.yml             # CI: Prettier + Eleventy build + GitHub Pages deploy
├── .husky/
│   └── pre-commit            # Runs lint-staged (Prettier on staged files)
├── .prettierrc               # Prettier config (printWidth 100, singleQuote, etc.)
├── .prettierignore           # Ignores _site/, node_modules/, package-lock.json
├── .gitignore
├── docker-compose.yml        # Local Postgres only (not used in CI)
├── Makefile                  # make db-up, make dev, etc. (repo root)
├── package.json              # Node scripts, Husky, lint-staged
├── package-lock.json         # Committed; required for npm ci in CI
├── README.md                 # Short Eleventy quick start
│
├── data/                     # Legacy dog JSON (current source of truth for site)
│   ├── template              # Blank schema template (not valid JSON — trailing content)
│   ├── bessi.json
│   ├── cheeno.json
│   └── odi.json
│
├── templates/                # Eleventy input (Nunjucks)
│   ├── index.njk             # Home: list of dogs
│   ├── dog.njk               # Paginated: one care sheet per dog
│   └── partials/
│       └── section.njk       # Macro: render string or array section
│
├── styles/                   # CSS (passthrough-copied to _site/styles/)
│   ├── main.css              # Design tokens, base, typography
│   ├── layout.css            # Page/sheet layout
│   ├── components.css        # Cards, sections, banners, pills
│   └── print.css             # A4 @page, print media queries
│
├── backend/                  # FastAPI app (scaffold only so far)
│   ├── Makefile              # Delegates to repo-root Makefile
│   ├── README.md
│   ├── requirements.txt
│   ├── .env.example          # DATABASE_URL template (committed)
│   ├── .env                  # Local secrets (gitignored)
│   ├── .venv/                # Python venv (gitignored)
│   └── app/
│       ├── __init__.py
│       └── main.py           # GET /health only
│
└── docs/
    ├── PROJECT-REFERENCE.md        # This file — master context for AIs
    ├── petsit-planning.md          # Platform roadmap (auth, booking, invoicing)
    ├── backend-planning.md         # Phase 1 canonical spec (dog schema, API)
    ├── backend-concepts.md         # ORM/SQLAlchemy/Alembic metaphors
    └── backend-implementation-log.md  # Checklist, changelog, session notes
```

**Not in repo yet (planned):** `backend/scripts/import_json.py`, Alembic migrations, SQLAlchemy models, `admin/` UI.

---

## 4. Static site (Eleventy)

### Configuration (`.eleventy.js`)

| Setting     | Value                                                                     |
| ----------- | ------------------------------------------------------------------------- |
| Input dir   | `templates/`                                                              |
| Includes    | `templates/partials/`                                                     |
| Data dir    | `data/` (configured as `../data` relative to templates)                   |
| Output      | `_site/`                                                                  |
| Path prefix | From `ELEVENTY_PATH_PREFIX` env var (CI sets `/Petsit/` for GitHub Pages) |

### `dogs` collection

Built at compile time by reading every `data/*.json` file:

1. Parse JSON (throws on invalid JSON).
2. Derive `name` from JSON `name` or filename.
3. Derive `slug` via `slugify()` (NFKD normalize, lowercase, non-alphanum → `-`).
4. Add `url`: `/dogs/{slug}/`.
5. Add `_sourceFile`: original filename.
6. Sort alphabetically by `name`.

**Slugify rules:** Unicode normalized, accents stripped, lowercase, non `[a-z0-9]` → `-`, collapse dashes, default `dog` if empty.

### Custom filter

- `isArray` — used in `section.njk` to branch list vs paragraph rendering.

### Passthrough copy

- Entire `styles/` → `_site/styles/`

### npm scripts

| Script          | Command                               | Purpose                            |
| --------------- | ------------------------------------- | ---------------------------------- |
| `dev` / `start` | `eleventy --serve`                    | Local dev server with live reload  |
| `build`         | `eleventy`                            | Production build → `_site/`        |
| `format`        | `prettier . --write --ignore-unknown` | Format repo                        |
| `format:check`  | `prettier . --check --ignore-unknown` | CI formatting gate                 |
| `prepare`       | `husky`                               | Install git hooks on `npm install` |

### Generated URLs (local, no path prefix)

| Page      | Permalink                           |
| --------- | ----------------------------------- |
| Index     | `/`                                 |
| Dog sheet | `/dogs/{slug}/` (e.g. `/dogs/odi/`) |

With GitHub Pages path prefix `/Petsit/`, URLs become `/Petsit/`, `/Petsit/dogs/odi/`, etc.

---

## 5. Legacy dog data (`data/*.json`)

### Current role

**Source of truth for the live static site.** Eleventy reads these files directly. Eventually deprecated in favor of Postgres + API.

### Schema (informal — not enforced by JSON Schema)

Fields observed across files and `data/template`:

#### Identity & metadata

| Field    | Type   | Required | Notes                                                                                  |
| -------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| `name`   | string | yes      | Display name                                                                           |
| `slug`   | string | no       | Optional; derived from name if omitted                                                 |
| `age`    | string | no       | Free text, e.g. `"10 years, born 2016"`, `"16"`, `"4,5"`                               |
| `size`   | string | no       | Free text, e.g. `"Medium, 12kg"`, `"Small (up to 8kg)"`                                |
| `breed`  | string | no       |                                                                                        |
| `gender` | string | no       | `"Male"` / `"Female"`                                                                  |
| `energy` | string | no       | Free text in legacy data: `"Low"`, `"medium"`, `"High"` — **backend will use 0–5 int** |

#### Booleans (care facts)

| Field          | Type    | Default in template |
| -------------- | ------- | ------------------- |
| `vaccinated`   | boolean | `true`              |
| `neutered`     | boolean | `true`              |
| `chipped`      | boolean | `true`              |
| `houseTrained` | boolean | `true`              |
| `insurance`    | boolean | `false`             |

#### Alerts & alone time

| Field     | Type     | Notes                                                              |
| --------- | -------- | ------------------------------------------------------------------ |
| `alerts`  | string[] | Shown in red alert banner on care sheet                            |
| `alone`   | string   | Shown in yellow warning banner                                     |
| `warning` | string[] | **Only in cheeno.json** — not rendered by template (inconsistency) |

#### Routine (mostly string arrays in legacy)

| Field      | Type     | Rendered as        |
| ---------- | -------- | ------------------ |
| `feeding`  | string[] | Section "Feeding"  |
| `treats`   | string[] | Section "Treats"   |
| `bathroom` | string[] | Section "Bathroom" |
| `exercise` | string   | Section "Exercise" |

#### Behaviour

| Field       | Type     | Template section title                             |
| ----------- | -------- | -------------------------------------------------- |
| `enjoys`    | string[] | "Enjoys"                                           |
| `struggles` | string[] | "Struggles"                                        |
| `behavior`  | string[] | "Behaviour" (UK spelling in UI, US key in JSON)    |
| `barking`   | string[] | "Barking"                                          |
| `training`  | string[] | "Training"                                         |
| `commands`  | string[] | **In cheeno.json only — not rendered by template** |

#### Health

| Field          | Type         | Notes                                                  |
| -------------- | ------------ | ------------------------------------------------------ |
| `health`       | string[]     | Section "Health"                                       |
| `trauma`       | string[]     | Section "Trauma"                                       |
| `medication`   | string[]     | In bessi/cheeno/template — **not rendered in dog.njk** |
| `veterinarian` | string (URL) | Rendered as link in header/footer area                 |

### Per-dog summary

| Slug     | File          | Notable fields                                                            |
| -------- | ------------- | ------------------------------------------------------------------------- |
| `odi`    | `odi.json`    | Allergies, fear of dogs, Polish commands in training, energy `"medium"`   |
| `bessi`  | `bessi.json`  | Epilepsy, medications (Levetiracetam, Luminaletten), low energy           |
| `cheeno` | `cheeno.json` | High energy, `commands` array, `warning` (not `alerts`), crate alone time |

### Backend migration notes

- **`alerts` / `warning`:** Will **not** be stored in DB; derived in admin UI from conditions/struggles/etc.
- **Free-text arrays** → join to `TEXT` or map to `TEXT[]` per field (see `backend-planning.md`).
- **Feeding/bathroom strings** → parsed heuristically into structured `feeding_entries` / `bathroom_entries`.
- **`medication`** → structured `medications` child table in backend; template should be updated when data comes from API.

---

## 6. Templates & rendering

### `templates/index.njk`

- Permalink: `/`
- Lists all dogs from `collections.dogs` with link, breed, size.

### `templates/dog.njk`

- **Pagination:** one page per dog (`collections.dogs`, size 1, alias `dog`).
- Permalink: `dogs/{{ dog.slug }}/index.html`
- **Header:** name, energy pill, age/breed/size meta, boolean facts, vet link.
- **Banners:** `alone` (warning), `alerts` (alert list).
- **Two columns** of sections via `section` macro.

### `templates/partials/section.njk`

```nunjucks
{% macro section(title, content) %}
```

- If `content` is falsy → render nothing.
- If array → `<ul>` list.
- Else → single `<p>` paragraph.

**Design choice:** Templates accept **string or array** for flexibility with legacy JSON and future API serializer.

### Fields present in JSON but NOT shown on care sheet

- `medication`
- `commands`
- `warning` (cheeno)
- `gender` (in JSON, not in template)

---

## 7. Styles (CSS)

No CSS framework. Plain CSS with design tokens in `main.css`.

### File responsibilities

| File             | Role                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `main.css`       | CSS variables (`--bg`, `--fg`, `--danger-*`, spacing), reset, base typography   |
| `layout.css`     | `.page`, `.sheet`, `.columns` grid                                              |
| `components.css` | `.card`, `.section`, `.banner`, `.pill`, `.dogList`, `.facts`                   |
| `print.css`      | `@page { size: A4 }`, print-specific margins, `break-inside: avoid` on sections |

### Print behavior

- A4 page size, ~14mm/12mm margins.
- Shadows removed in print.
- `print-color-adjust: exact` on colored banners/headers.
- Sections avoid page breaks inside.

---

## 8. Backend (FastAPI) — current state

### What exists

| File                  | Status                            |
| --------------------- | --------------------------------- |
| `backend/app/main.py` | FastAPI app, title `"Petsit API"` |
| `GET /health`         | Returns `{"ok": true}`            |
| `GET /docs`           | Swagger UI (auto-generated)       |
| `GET /`               | **404** — no root route           |

### Dependencies (`requirements.txt`)

```
fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg2-binary
pydantic-settings
python-dotenv
```

Versions are **not pinned** yet (open question in implementation log).

### What does NOT exist yet

- Database connection / `DATABASE_URL` wiring in app
- Alembic
- SQLAlchemy models
- Any `/api/dogs` routes
- Import script
- Tests

---

## 9. Backend — planned design

**Canonical Phase 1 spec:** [`docs/backend-planning.md`](backend-planning.md)

**Platform tables** (`families`, `users`, `invites`, `bookings`, `invoices`) are introduced in Phases 2–4. Full specification is in [`docs/petsit-planning.md`](petsit-planning.md) — these are **not** part of the Phase 1 dog schema.

### Domain model (DDD summary)

**Aggregate root:** `Dog`

| Subdomain | Tables                                            | Notes                                                                                       |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Identity  | `dogs`                                            | name, slug, breed, gender, size, energy (0–5), age_value, age_unit, date_of_birth, booleans |
| Routine   | `routines`, `feeding_entries`, `bathroom_entries` | treats, exercise as TEXT; structured schedules as child rows                                |
| Security  | `security`                                        | chipped, microchip, has_tracker, tracker_id (chipped moved off dogs)                        |
| Behaviour | `behaviour`                                       | alone TEXT; enjoys/struggles/commands TEXT[]; notes fields TEXT                             |
| Health    | `health`, `medications`                           | conditions, trauma TEXT; veterinarian_url; medications as child rows                        |

### Storage rules

- **No JSONB** for simple fields.
- **TEXT[]** for string lists.
- **TEXT** for paragraphs.
- **Child tables** for repeated structured objects.
- **No stored alerts/warnings** — computed on frontend.

### API (planned)

**Domain API (admin / correctness):**

- `GET /api/dogs`
- `GET /api/dogs/{slug}`
- Later: `PATCH` write endpoints

**Legacy API (Eleventy build):**

- `GET /api/legacy/dogs`
- `GET /api/legacy/dogs/{slug}`

Legacy serializer flattens domain → flat JSON shape matching current templates.

### ScheduleTime model (feeding & bathroom)

- `time_kind`: `at` | `between` | `period`
- Clock times for `at` / `between`; named periods for `period` (bathroom adds `before_bed`)

### Constraints (planned)

- Energy: 0–5
- Age: `age_value` + `age_unit` both set or both null
- If `chipped` → `microchip` required
- If `has_tracker` → `tracker_id` required
- Bathroom entry: at least one of `pee` / `poo` true

---

## 10. Local development

### Prerequisites

| Tool           | Used for                              |
| -------------- | ------------------------------------- |
| Node.js 18+    | Eleventy                              |
| Python 3.9+    | FastAPI (venv in `backend/.venv`)     |
| Docker Desktop | Local Postgres (`docker-compose.yml`) |

### Static site

```bash
npm install          # also installs Husky pre-commit hook
npm run dev          # http://localhost:8080 (Eleventy default port)
npm run build        # → _site/
```

### Backend + database

```bash
# Repo root (Docker Desktop must be running)
make db-up           # Postgres on localhost:5432
make db-ps           # Check petsit-db healthy
make dev             # API on http://localhost:8000/health

make db-down         # Stop Postgres
make help            # List commands
```

`make dev` works from **`backend/`** too (delegates via `backend/Makefile`).

**One-time Python setup:**

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
```

### Three processes (full stack, when backend is complete)

1. Postgres — `make db-up`
2. FastAPI — `make dev`
3. Eleventy — `npm run dev` (will need `API_URL` when Phase 2 lands)

### Common pitfalls (documented from sessions)

| Symptom                               | Cause                        | Fix                                                 |
| ------------------------------------- | ---------------------------- | --------------------------------------------------- |
| `Cannot connect to the Docker daemon` | Docker Desktop not running   | Start Docker Desktop                                |
| `make: No rule to make target`        | Wrong directory, no Makefile | Use repo root or `backend/` (has delegate Makefile) |
| Browser `:5432` doesn't work          | Postgres is not HTTP         | Use `:8000/health` for API                          |
| `GET /` → 404                         | No root route on API         | Use `/health` or `/docs`                            |
| `make dev` fails                      | No venv                      | Run one-time Python setup above                     |

### Docker Compose (`docker-compose.yml`)

| Setting              | Value                              | Rationale                               |
| -------------------- | ---------------------------------- | --------------------------------------- |
| Image                | `postgres:16-alpine`               | Pinned major version, small image       |
| Container            | `petsit-db`                        | Easy to identify                        |
| `restart`            | `no`                               | Does not auto-start after Mac reboot    |
| User / password / DB | `postgres` / `postgres` / `petsit` | Local dev only; matches `DATABASE_URL`  |
| Port                 | `5432:5432`                        | Host access for app                     |
| Volume               | `petsit_pg_data`                   | Data persists across container restarts |
| Healthcheck          | `pg_isready`                       | Shows healthy in `docker compose ps`    |

---

## 11. Tooling: Node, Prettier, Husky

### Prettier (`.prettierrc`)

- `printWidth`: 100
- `singleQuote`: true
- `semi`: true
- `trailingComma`: all
- Override: `data/**/*.json` uses `printWidth` 40

### Ignored by Prettier (`.prettierignore`)

- `_site/`, `node_modules/`, `package-lock.json`

### Husky + lint-staged

- **Hook:** `.husky/pre-commit` → `npx lint-staged`
- **Config:** `"*": "prettier --write --ignore-unknown"` on staged files
- **Install:** `npm install` runs `prepare` → `husky`
- **Skip:** `git commit --no-verify` (CI still enforces format on push)

### Makefile targets

| Target    | Action                                                        |
| --------- | ------------------------------------------------------------- |
| `help`    | Print available commands                                      |
| `db-up`   | `docker compose up -d`                                        |
| `db-down` | `docker compose down`                                         |
| `db-ps`   | `docker compose ps`                                           |
| `dev`     | `backend/.venv/bin/uvicorn app.main:app --reload --port 8000` |

---

## 12. CI/CD (GitHub Actions)

**Workflow:** `.github/workflows/pages.yml`  
**Name:** Deploy to GitHub Pages

### Triggers

- Push to `main`
- Manual `workflow_dispatch`

### Jobs

**1. `build`**

1. Checkout
2. Node 20 + npm cache
3. `npm ci` (requires committed `package-lock.json`)
4. `npm run format:check` — **fails if Prettier issues**
5. `npm run build` with `ELEVENTY_PATH_PREFIX: '/${{ github.event.repository.name }}/'`
6. Upload `_site` as Pages artifact

**2. `deploy`**

- Deploy artifact to GitHub Pages environment

### What CI does NOT do

- Does not run Python / FastAPI / pytest
- Does not run Docker / Postgres
- Does not deploy backend
- Does not call any API (Eleventy still reads `data/*.json`)

### Pushing backend changes

Safe: backend files are ignored by the Eleventy build. CI only cares that **Prettier** passes on formatted file types.

---

## 13. Environment variables

| Variable               | Where                  | Purpose                          | Example                                                         |
| ---------------------- | ---------------------- | -------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`         | `backend/.env`         | SQLAlchemy Postgres connection   | `postgresql+psycopg2://postgres:postgres@localhost:5432/petsit` |
| `ELEVENTY_PATH_PREFIX` | CI / local optional    | GitHub Pages subpath             | `/Petsit/`                                                      |
| `API_URL`              | Future: Eleventy build | Backend for legacy dogs endpoint | `http://localhost:8000`                                         |

**Committed templates:** `backend/.env.example`  
**Not committed:** `backend/.env`, root `.env`

---

## 14. Git & secrets

### Ignored (`.gitignore` highlights)

- `node_modules/`, `_site/`
- `backend/.env`, `backend/.venv/`, Python caches
- Root `.env`, `.env.*` (except `.env.example` pattern)
- Editor folders, OS files

### Never commit

- `backend/.env` (database password)
- `backend/.venv/` (large, machine-specific)
- Production secrets

### Commit policy (from user rules)

- User commits manually unless they explicitly ask the agent to commit.
- Small vertical-slice commit messages.
- Do not commit `.venv` even if untracked.

---

## 15. Implementation status & roadmap

**Living checklist:** [`docs/backend-implementation-log.md`](backend-implementation-log.md)

### Done ✅

| Item                                                         | Date       |
| ------------------------------------------------------------ | ---------- |
| Planning docs (`backend-planning.md`, `backend-concepts.md`) | 2026-06-02 |
| Implementation log                                           | 2026-06-02 |
| FastAPI scaffold + `/health`                                 | 2026-06-02 |
| `docker-compose.yml` (Postgres 16)                           | 2026-06-02 |
| Makefile + `backend/Makefile` delegate                       | 2026-06-02 |
| Husky + lint-staged                                          | 2026-06-02 |
| Docs synced with expanded platform vision                    | 2026-06-05 |

### Next ⏭️ (Phase 1)

1. Alembic init + `DATABASE_URL` wiring in app
2. SQLAlchemy models (Dog DDD tables only)
3. Initial migration
4. Read-only domain + legacy API
5. `import_json.py`
6. Eleventy → `API_URL` at build time
7. Pin Python dependency versions

### Platform phases (5-phase roadmap)

Full detail for each phase in [`docs/petsit-planning.md`](petsit-planning.md).

| Phase | Scope              | Key deliverables                                  |
| ----- | ------------------ | ------------------------------------------------- |
| **1** | Backend foundation | Dog schema, importer, read API, legacy serializer |
| **2** | Auth + roles       | Auth0, families/users/invites, email invites      |
| **3** | Booking flow       | Bookings, Google Calendar, confirmation email     |
| **4** | Invoicing          | APScheduler, invoice calculation + email          |
| **5** | GraphQL + Admin UI | Strawberry GraphQL, admin CRUD, owner read views  |

### Suggested commit slices

1. ~~docs: planning and concepts~~
2. ~~backend: scaffold~~
3. ~~infra: docker-compose, Makefile, Husky~~
4. `db: Alembic, models, initial migration`
5. `api: read-only endpoints + legacy serializer`
6. `data: JSON import script`
7. `build: Eleventy → legacy API`
8. `auth: Auth0 integration + user model`
9. `auth: invite system + family model`
10. `booking: data model + creation endpoint`
11. `booking: day care vs boarding auto-detection`
12. `booking: Google Calendar integration`
13. `booking: confirmation email`
14. `owner: read-only booking view`
15. `invoicing: calculation logic + APScheduler`
16. `invoicing: invoice email + DB record`

---

## 16. Key decisions (do not re-litigate without discussion)

### Phase 1 — Foundation

| Topic                    | Decision                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| Repo structure           | **Monorepo** — backend + static site together                         |
| Public site              | **Static** Eleventy on GitHub Pages                                   |
| Source of truth (target) | **PostgreSQL** via FastAPI                                            |
| Data model               | **DDD** aggregate `Dog` with subdomains — not generic key-value table |
| JSONB                    | **Rejected** — use TEXT, TEXT[], child tables                         |
| Alerts/warnings          | **Not stored** — derived in UI                                        |
| Legacy API               | **Separate paths** `/api/legacy/dogs` (Option A)                      |
| Local Postgres           | **Docker Compose**, not Homebrew                                      |
| Container restart        | **`restart: no`** — manual `make db-up` after reboot                  |
| Env files                | `backend/.env` (secret) vs `backend/.env.example` (committed)         |
| Eleventy data fetch      | **Build-time only**, not browser runtime                              |
| Formatting               | Prettier on repo + Husky pre-commit + CI `format:check`               |
| `package-lock.json`      | **Committed** — required for `npm ci`                                 |

### Platform — Phases 2–5 (from `petsit-planning.md`)

| Topic                   | Decision                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| Platform scope          | Expanded from personal tool to small SaaS business platform       |
| User registration       | **Invite-only** — petsitter invites families, no open sign-up     |
| Invite methods          | Email invite (primary) + scoped shareable link (secondary)        |
| Authentication          | **Auth0** — transfers to day-job stack, avoids rolling custom JWT |
| Email service           | **Resend or SendGrid** — not raw SMTP                             |
| Calendar integration    | **Google Calendar API** — Ana uses Google Calendar                |
| Booking type detection  | Same-day = day care, overnight = boarding (auto-detected)         |
| Scheduling              | **APScheduler** inside FastAPI — Celery is overkill at this scale |
| GraphQL timing          | **Phase 5+ only** — after data model is stable and REST is proven |
| Finance hub (other app) | REST only — solo user, no multi-client data needs                 |

---

## 17. Known quirks & technical debt

### Data / templates

- `dog.njk` nests `.sheetFooter` inside `.sheetHeader` (valid but odd HTML structure).
- `medication`, `commands`, `warning`, `gender` in JSON but not displayed on sheet.
- `cheeno.json` uses `warning` not `warnings`; not rendered.
- Legacy `energy` is free text; backend spec uses integer 0–5.
- `data/template` is not valid JSON (trailing whitespace/content).
- American spelling `behavior` in JSON, British "Behaviour" in UI.

### Backend

- No pinned Python dependency versions.
- No tests.
- No root route on API (`/` 404).
- App does not connect to Postgres yet despite Docker being ready.

### CI

- No Python/backend CI job.
- Prettier failure blocked deploy until docs were formatted.

### Ops

- Docker Desktop required on Mac for local DB.
- Repo path contains a space (`Petsit website`) — Makefile uses quoted paths.

---

## 18. Related documentation index

| Document                                                         | When to read                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **This file** (`PROJECT-REFERENCE.md`)                           | Full project context for any task                            |
| [`petsit-planning.md`](petsit-planning.md)                       | Platform roadmap: auth, booking, invoicing, GraphQL strategy |
| [`backend-planning.md`](backend-planning.md)                     | Phase 1 canonical spec: dog schema, API contracts, migration |
| [`backend-concepts.md`](backend-concepts.md)                     | Explain SQLAlchemy, Alembic, Pydantic to a frontend dev      |
| [`backend-implementation-log.md`](backend-implementation-log.md) | What's done, what's next, changelog, troubleshooting         |
| [`README.md`](../README.md)                                      | Short Eleventy quick start                                   |
| [`backend/README.md`](../backend/README.md)                      | Backend local setup                                          |

**Superseded / deleted:** `docs/backend-handoff.md` — do not use.

---

## 19. Instructions for AI assistants

### Before editing

1. Read this file first for full context.
2. For platform scope and Phases 2–5, read [`petsit-planning.md`](petsit-planning.md).
3. For backend work, read [`backend-planning.md`](backend-planning.md) (Phase 1 dog schema).
4. Check [`backend-implementation-log.md`](backend-implementation-log.md) for the current checklist item.
5. The immediate next task is **Phase 1a**: Alembic init + `DATABASE_URL` wiring.
6. Prefer **minimal diffs** — match existing style and conventions.
7. Do **not** commit unless the user explicitly asks.
8. Do **not** commit secrets (`.env`, `.venv`).

### Scope boundaries

| Area                    | Safe to change                | Ask first                                        |
| ----------------------- | ----------------------------- | ------------------------------------------------ |
| `templates/`, `styles/` | Care sheet layout/styling     | Major UX redesign                                |
| `data/*.json`           | Dog content                   | Schema changes affecting migration               |
| `backend/`              | Per implementation log phase  | Architectural changes contradicting planning doc |
| `.eleventy.js`          | Build logic                   | Switching away from static site model            |
| CI workflow             | Only if user wants CI changes | Adding backend deploy without discussion         |

### When implementing backend

- Follow DDD table layout in `backend-planning.md`.
- Provide **both** domain API and legacy serializer for Eleventy.
- Import from `data/*.json` is **best-effort** — document parsing limits.
- Use `pydantic-settings` for `DATABASE_URL`.
- Sync progress into `backend-implementation-log.md`.

### When touching frontend build

- Run `npm run format:check` and `npm run build` before suggesting push.
- Remember GitHub Pages uses `ELEVENTY_PATH_PREFIX=/Petsit/`.
- `section.njk` must keep supporting **string | array** for legacy shape.

### Local verification commands

```bash
# Static site
npm run format:check && npm run build

# Backend (current)
make db-up && make db-ps
make dev
curl http://localhost:8000/health

# Future
curl http://localhost:8000/api/legacy/dogs
```

### User preferences

- Frontend engineer learning backend — use analogies when explaining new concepts.
- Overwhelmed by too much technical detail at once — prefer step-by-step for new topics.
- Item-by-item explanations for infrastructure (Docker, etc.) upon request.

---

---

## 20. External services

These services are required for later platform phases. Nothing below is needed for Phase 1.

| Service                  | Purpose                                                | Phase needed   |
| ------------------------ | ------------------------------------------------------ | -------------- |
| **Auth0**                | Authentication + session management                    | Phase 2        |
| **Resend** (or SendGrid) | Transactional email — invites, confirmations, invoices | Phase 2        |
| **Google Calendar API**  | Create booking events + add family as attendee         | Phase 3        |
| **APScheduler**          | Monthly invoice trigger inside FastAPI process         | Phase 4        |
| **Neon or Supabase**     | Hosted PostgreSQL (replaces local Docker)              | Before hosting |
| **Railway or Render**    | FastAPI hosting                                        | Phase 4+       |

**Email note:** Never use raw SMTP. Both Resend and SendGrid handle SPF/DKIM automatically on their free tiers — critical for deliverability.

**Google Calendar note:** Requires a one-time OAuth2 setup in Google Cloud Console. Authenticate once as Ana, store refresh token. No per-user OAuth needed (always Ana's calendar). Document the setup carefully when done.

---

_End of project reference. Update this file when architecture, tooling, or implementation status changes materially._
