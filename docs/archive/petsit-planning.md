# Petsit — Extended Planning Document

**Created:** 2026-06-05  
**Purpose:** Platform roadmap and product decisions. Read alongside `docs/PROJECT-REFERENCE.md`.  
**Author:** Ana Tarrisse

---

## 0. Documentation map

| Document                                                         | Role                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [`PROJECT-REFERENCE.md`](PROJECT-REFERENCE.md)                   | **Master context** — full repo, tooling, Phase 1 status    |
| **This file** (`petsit-planning.md`)                             | **Platform roadmap** — vision, auth, booking, invoicing    |
| [`backend-planning.md`](backend-planning.md)                     | **Phase 1 canonical spec** — dog DDD schema, API contracts |
| [`backend-implementation-log.md`](backend-implementation-log.md) | **Checklist + changelog** — what is done and what is next  |
| [`backend-concepts.md`](backend-concepts.md)                     | Metaphors for ORM, Alembic, Pydantic (frontend dev brain)  |

---

## 1. Project vision (updated)

Petsit started as a personal tool for printable dog care sheets. The vision has expanded significantly. It is now being built as a **small petsitting business management platform** with multiple users, roles, booking management, automated calendar integration, and invoicing.

The care sheets remain the foundation, but the end goal is a system that automates the operational overhead of running a petsitting business.

---

## 2. Tech stack analysis

### Current stack (in production)

```
data/*.json → Eleventy build → _site/ → GitHub Pages
```

### Target stack

```
PostgreSQL ← FastAPI (REST, then GraphQL later)
                  ↑
      ┌───────────┴───────────┐
      │                       │
Eleventy (build-time)    Admin UI / Client UI
GET /api/legacy/dogs     CRUD + booking + invoicing
      │
      ↓
   _site/ → GitHub Pages
```

### Stack verdict (from tech analysis session)

| Area                    | Verdict                                    | Notes                            |
| ----------------------- | ------------------------------------------ | -------------------------------- |
| Eleventy + GitHub Pages | ✅ Right tool                              | Care sheets stay static          |
| Plain CSS + print focus | ✅ Good call                               | A4 print layout works well       |
| Prettier + Husky + CI   | ✅ Good habits                             | Keep as-is                       |
| FastAPI + PostgreSQL    | ✅ Correct for scope                       | Platform has grown to justify it |
| Unpinned Python deps    | ⚠️ Fix early                               | Will cause breakage eventually   |
| No backend tests        | ⚠️ Add one integration test before hosting |                                  |
| DDD schema depth        | ⚠️ Watch over-engineering risk             | Ship phases, normalize later     |

### GraphQL strategy (decided)

**Do NOT introduce GraphQL into Petsit yet.** The agreed middle path:

1. **Phase 1–2:** Build FastAPI REST foundation. Get the data model stable.
2. **Phase 3 (Admin UI):** Introduce GraphQL at that point — by then the data model is known, REST pain points are real, and day-job GraphQL experience (pincamp.de uses Apollo GraphQL + Hygraph) will make adoption natural.

**Rationale:** GraphQL's strengths (multiple clients needing different data shapes) apply to Petsit once there are owner views, petsitter views, booking calendars, and invoice summaries all pulling from the same data. That's Phase 3+, not now.

**Finance hub** (separate project, solo user): Use FastAPI REST. No need for GraphQL when you are the only consumer.

---

## 3. New scope: platform features

This section documents all features discussed beyond the original care sheets.

### 3.1 User roles

| Role                      | Permissions                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **Petsitter** (Ana)       | Full access. Creates families, dogs, bookings, sends invoices. |
| **Owner / Family member** | Read-only access to their own bookings and invoices.           |

**Key decision:** The petsitter invites family members — there is no self-registration. This keeps the user base controlled, which matters for a business handling real client data and payments.

### 3.2 Invite system

Family members are invited by the petsitter. Two invite methods:

**Option A — Email invite (primary)**

- Petsitter creates a family record
- Enters family email address
- System sends invite email with a unique token link
- Token is scoped to that specific family record
- Token expires in 7 days
- Family member clicks link, sets password, lands in their view

**Option B — Shareable link (secondary)**

- Petsitter generates a unique link for a specific family (not a global open-registration link)
- Link can be sent via WhatsApp, copy-paste, etc.
- Token still scoped to that family record and expires

**Why not global open registration:** Accidental link forwarding could create unknown accounts in a system that handles billing and sensitive pet health data.

**Data model implications:**

- `families` table
- `invites` table: `token`, `family_id`, `email` (optional), `expires_at`, `used_at`
- `users` table with `role` and `family_id` foreign key for owners

### 3.3 Authentication

**Recommended approach: Auth0**

Reasons:

- Handles password resets, secure token storage, and session management out of the box
- Ana will use Auth0 at her new job (pincamp.de stack) — learning it on Petsit is directly transferable
- Avoids the risk of rolling insecure custom JWT auth on an app that handles real billing data

Alternative (more educational, more risk): FastAPI + python-jose + passlib for custom JWT. Valid for learning but not recommended for production with real client data.

### 3.4 Booking flow

**Input (petsitter only):**

- Dog(s)
- Pick-up date and time
- Drop-off date and time

**Auto-detection:**

- Same calendar day → **Day care**
- Overnight (drop-off date > pick-up date) → **Boarding**

**Automated actions on booking creation:**

1. **Google Calendar event** created on petsitter's calendar
   - Title: e.g. "Odi @ Ana (Boarding)"
   - Start/end from pick-up and drop-off datetimes
   - Family member added as attendee → they receive a Google Calendar invite automatically
   - No separate calendar API call needed for the family invite (Google handles attendee notifications)

2. **Confirmation email** sent to family
   - Booking summary (dog, type, dates/times)
   - Sent via **Resend** or **SendGrid** (not raw SMTP — deliverability reasons)

**Google Calendar API setup notes:**

- Requires a Google Cloud project with Calendar API enabled
- OAuth2 credentials — authenticate once as Ana, store refresh token, never repeat
- No per-user OAuth flow needed (always Ana's calendar)
- Library: `google-api-python-client` + `google-auth`
- The initial Google Cloud Console setup is fiddly but one-time — document it carefully when done

**iCalendar (.ics) alternative:** If Google Calendar API proves too complex initially, .ics files can be attached to confirmation emails and work with any calendar app. This is the fallback, not the target.

### 3.5 Family booking view

- Read-only
- Shows all bookings for that family's dogs
- Past and upcoming
- Simplest feature on the roadmap — good breather after booking flow complexity

### 3.6 Invoicing flow

**Trigger:** End of month (automated, scheduled job)

**Logic:**

1. System queries all completed bookings for each family in the month
2. Calculates total owed (day care rate × day care days + boarding rate × boarding nights)
3. Sends invoice email to family with itemised breakdown and total due

**Scheduling:** FastAPI does not do scheduling natively. Options:

- **APScheduler** — lightweight, runs inside FastAPI process. Sufficient for this scale.
- **Celery** — heavier, more production-grade. Overkill for now.

**Recommendation:** Start with APScheduler. Migrate to Celery if the job complexity grows.

**Email:** Same service as booking confirmations (Resend or SendGrid).

**Rates storage:** Day care rate and boarding rate need to be stored somewhere — either in a `settings` table or as environment variables initially.

---

## 4. Revised implementation roadmap

### Phase 1 — Backend foundation (current)

Move off JSON files. Get the API working.

| Step | Task                                                                | Status  |
| ---- | ------------------------------------------------------------------- | ------- |
| 1a   | Alembic init + DATABASE_URL wiring                                  | ⏭️ Next |
| 1b   | SQLAlchemy models (Dog DDD tables only — see `backend-planning.md`) | ⏭️      |
| 1c   | Initial migration                                                   | ⏭️      |
| 1d   | Read-only domain API (`GET /api/dogs`)                              | ⏭️      |
| 1e   | Legacy serializer (`GET /api/legacy/dogs`)                          | ⏭️      |
| 1f   | `import_json.py` — migrate 3 existing dog JSON files                | ⏭️      |
| 1g   | Eleventy reads from API at build time                               | ⏭️      |
| 1h   | Pin Python dependency versions in requirements.txt                  | ⏭️      |

### Phase 2 — Auth + roles

Protect the system and introduce multi-user support. **Phase 2 is where `families`, `users`, and `invites` tables are introduced** — these are not part of the Phase 1 dog schema.

| Step | Task                                                           |
| ---- | -------------------------------------------------------------- |
| 2a   | Auth0 setup (or custom JWT — decide before starting)           |
| 2b   | User model: role field, family_id for owners                   |
| 2c   | Invite system: families table, invites table, token generation |
| 2d   | Email invite flow (Resend/SendGrid integration)                |
| 2e   | Shareable link invite (scoped to family)                       |
| 2f   | Route protection: petsitter vs owner permissions               |

### Phase 3 — Booking flow

Core business logic.

| Step | Task                                                       |
| ---- | ---------------------------------------------------------- |
| 3a   | Booking data model (booking, booking_type enum, status)    |
| 3b   | Booking creation endpoint (petsitter only)                 |
| 3c   | Auto-detection: day care vs boarding                       |
| 3d   | Google Calendar API setup (one-time OAuth, document steps) |
| 3e   | Create calendar event + add family as attendee on booking  |
| 3f   | Confirmation email on booking creation                     |
| 3g   | Family read-only booking view                              |

### Phase 4 — Invoicing

End-of-month automation.

| Step | Task                                       |
| ---- | ------------------------------------------ |
| 4a   | Rates storage (settings table or env vars) |
| 4b   | Invoice calculation logic                  |
| 4c   | APScheduler setup — monthly trigger        |
| 4d   | Invoice email (itemised breakdown)         |
| 4e   | Invoice record stored in DB (for history)  |

### Phase 5 — GraphQL + Admin UI (future)

Introduce GraphQL once the data model is stable and REST pain points are real.

| Step | Task                                                             |
| ---- | ---------------------------------------------------------------- |
| 5a   | Evaluate Strawberry (Python GraphQL) vs switching to Node/Apollo |
| 5b   | GraphQL schema mirroring existing REST endpoints                 |
| 5c   | Admin UI for editing dog profiles, managing families             |
| 5d   | Replace legacy REST endpoints with GraphQL                       |

---

## 5. Suggested commit slices (updated)

Continuing from existing log:

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

## 6. External services summary

| Service                  | Purpose                                                | When needed        |
| ------------------------ | ------------------------------------------------------ | ------------------ |
| **Auth0**                | Authentication + session management                    | Phase 2            |
| **Resend** (or SendGrid) | Transactional email (invites, confirmations, invoices) | Phase 2            |
| **Google Calendar API**  | Create booking events + family invites                 | Phase 3            |
| **APScheduler**          | Monthly invoice trigger                                | Phase 4            |
| **Neon or Supabase**     | Hosted PostgreSQL                                      | Before any hosting |
| **Railway or Render**    | FastAPI hosting                                        | Phase 4+           |

**Email deliverability note:** Never use raw SMTP for transactional email. Use Resend or SendGrid from the start — emails sent from hobby backends land in spam without proper domain authentication (SPF, DKIM). Both services handle this automatically on their free tiers.

---

## 7. Key decisions (do not re-litigate without discussion)

Extends the decision log in `PROJECT-REFERENCE.md` section 16.

| Topic                  | Decision                                                                         |
| ---------------------- | -------------------------------------------------------------------------------- |
| Platform scope         | Expanded from personal tool to small SaaS with multi-user support                |
| GraphQL timing         | Phase 3+ only, after data model is stable and REST pain points are real          |
| Finance hub API        | REST only (solo user, no multi-client data needs)                                |
| User registration      | Invite-only — petsitter invites families, no open self-registration              |
| Invite methods         | Email invite (primary) + scoped shareable link (secondary)                       |
| Authentication         | Auth0 recommended (transfers to day-job stack at pincamp.de)                     |
| Calendar integration   | Google Calendar API (not .ics files) — Ana uses Google Calendar                  |
| Email service          | Resend or SendGrid — not raw SMTP                                                |
| Scheduling             | APScheduler inside FastAPI — not Celery (overkill for current scale)             |
| Booking type detection | Same-day = day care, overnight = boarding — auto-detected, not manually selected |

---

## 8. Context for AI assistants in Cursor

- Ana is a frontend engineer learning backend. Prefer clear explanations with analogies.
- Do not overwhelm with too much technical detail at once — prefer step-by-step for new topics.
- The immediate next task is **Phase 1a**: Alembic init + DATABASE_URL wiring in `backend/app/main.py`.
- Always check `docs/backend-implementation-log.md` for the current checklist item before suggesting changes.
- Do not commit unless Ana explicitly asks.
- Follow the DDD table layout in `docs/backend-planning.md` for all model decisions.
- Match existing code style — minimal diffs.
- The project reference file is at `docs/PROJECT-REFERENCE.md` — read it before any backend work.
