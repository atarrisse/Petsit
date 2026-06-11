# Backend concepts (Petsit) — metaphors & plain-English

This is a lightweight companion doc to [`docs/backend-planning.md`](backend-planning.md).
It explains the main backend libraries we use with **metaphors** (for a frontend dev brain).

## The cast of characters

### ORM (Object-Relational Mapper) — “DB as objects, not spreadsheets”

Imagine the database as a bunch of spreadsheets:

- `dogs` sheet
- `security` sheet
- `feeding_entries` sheet

An **ORM** is a layer that lets you work with those sheets as **Python classes**:

- `Dog`, `Security`, `FeedingEntry`

So you can say “load this dog and its routine” using objects, instead of writing SQL strings and hand-gluing rows together.

---

### SQLAlchemy — “the translator + assistant”

You speak **Python objects**. The database speaks **SQL**.

**SQLAlchemy** is like a bilingual assistant who:

- takes your intent (“get dog `odi` and their routine”)
- writes the right SQL
- runs it
- gives you back Python objects

If you don’t use it, you’d write SQL everywhere and manually map database rows → dicts → objects.

---

### psycopg2 — “the cable to Postgres”

Even if SQLAlchemy generates SQL, you still need a way to **send bytes** to Postgres and receive results.

**psycopg2** is the “physical cable + protocol implementation” that speaks the Postgres wire protocol.

You rarely interact with it directly; SQLAlchemy uses it under the hood.

---

### Alembic — “Git for your database schema”

Your database schema changes over time:

- add a table
- add a column
- rename a field

**Alembic** stores a versioned history of those schema changes as migration files.

- A migration is like a git commit: “add `security` table”
- Applying migrations is like pulling the latest changes: your local DB and production DB end up with the same structure

Without Alembic, you’d be manually editing the DB and hoping every environment stays in sync.

---

### Pydantic — “TypeScript types + Zod, but on the server”

Type hints alone don’t validate real-world input. If someone sends malformed JSON to your API, Python won’t magically reject it.

**Pydantic** is the runtime validator that:

- checks incoming JSON matches the shape you expect
- converts types when possible (e.g. `"08:00"` → a `time` object)
- rejects invalid data with clear errors (FastAPI returns a 422 with details)

This is how we enforce rules like:

- `energy` must be 0–5
- bathroom entry must have `pee` or `poo`
- `security.microchip` required when `security.chipped = true`

---

### pydantic-settings — “typed config loader”

Your app needs configuration from environment variables (examples):

- `DATABASE_URL`
- later: `ADMIN_API_KEY`

**pydantic-settings** is like a “typed settings form”:

- read env vars
- validate them early (fail fast if missing/invalid)
- give you a `Settings` object that you can pass around

This avoids scattering `os.environ["DATABASE_URL"]` throughout your code.

---

### python-dotenv — “local dev convenience”

In local dev, it’s convenient to keep env vars in a file (`backend/.env`) instead of typing them into your shell every time.

**python-dotenv** loads that file into your process environment.

Important: `.env` files usually contain secrets and should not be committed. We commit `.env.example` instead.
