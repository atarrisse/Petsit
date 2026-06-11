# ADR-01: Backend stack

|              |                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Status**   | Accepted                                                                                                                      |
| **Date**     | 2026-06-11                                                                                                                    |
| **Deciders** | Ana Tarrisse                                                                                                                  |
| **Related**  | [System design §4.3](../01-SYSTEM-DESIGN.md#43-architecture) · [ADR-02](02-frontend-stack.md) · [ADR-03](03-auth-provider.md) |

## Context and problem statement

The platform needs a backend to own business logic, data persistence, authentication, and background jobs. The backend must expose a REST API consumed by a separate Next.js frontend ([ADR-02](02-frontend-stack.md)) — it is not part of a full-stack framework.

## Decision drivers

- **Team uses Python + PostgreSQL** — no second language or database engine introduced on the backend
- **Domain logic requires a persistent process** — multi-table transactions (invoicing), token lifecycle management, and scheduled background jobs are incompatible with stateless, short-lived function runtimes
- **Relational data model** — families own dogs (one-to-many), bookings have a many-to-many relationship with dogs, invoices reference bookings; referential integrity and joins are first-class requirements (see [OOUX entity map](../../product/04-OOUX-OBJECT-MAP.md#entity-relationships))
- **Time-triggered jobs with database access** — day-before reminders and end-of-month invoice drafts must run on a schedule with access to the production database
- **Expected load fits a single-region monolith** — projected usage fits a single-region FastAPI + PostgreSQL monolith; if traffic materially exceeds current projections, this will be revisited in a new ADR

## Decision outcome

**FastAPI + PostgreSQL + SQLAlchemy + Alembic**

### Stack

| Layer      | Choice                 | Rationale                                                                                                |
| ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Framework  | FastAPI (Python 3.11+) | Leading async Python framework; Pydantic models serve as both validation layer and OpenAPI schema source |
| Database   | PostgreSQL             | Team-standard database; ACID transactions; referential integrity across a relational domain model        |
| ORM        | SQLAlchemy 2.x         | Async-compatible; declarative models for domain objects; Core available for complex queries              |
| Migrations | Alembic                | Autogenerates from SQLAlchemy models; versioned, reversible schema history                               |

### Rules

- No Next.js API routes — FastAPI is the sole API surface ([ADR-02](02-frontend-stack.md))
- Auth managed in FastAPI — not delegated to a frontend framework; FastAPI integrates with the chosen auth provider as defined in [ADR-03](03-auth-provider.md)

### Operational/runtime assumptions

- One FastAPI app per environment (dev, staging, production)
- One PostgreSQL database per environment, managed by the infrastructure layer

### Background jobs

Background jobs (reminders, invoice drafts, etc.) run in a dedicated worker process that shares the FastAPI codebase and connects to the same PostgreSQL database as the API. Job scheduling is owned by the infrastructure layer (for example, cron or a cloud scheduler); the application does not rely on in-process timers or long-running loops for production workloads.

### Consequences

- The backend is a single-region FastAPI + PostgreSQL monolith; moving to multiple regions, databases, or services requires a new ADR.
- SQLAlchemy models and Alembic migrations are the source of truth for the relational schema.
- Background workloads should run via the shared worker process and scheduler described above, so business logic, validation, and observability stay in the backend codebase rather than in one-off scripts or direct database access.
- Authentication and authorization are enforced in FastAPI and the chosen auth provider (see ADR-03); frontend checks are for UX only and do not replace backend enforcement.

---

## Other options considered

### Django + Django REST Framework

Full-stack Python framework with ORM, admin, auth, and batteries included.

Ruled out — designed for full-stack server-rendered apps; the built-in admin and auth are irrelevant when the frontend is a separate SPA; heavier than needed; FastAPI's explicit request/response model maps directly to a REST API contract.

### Flask

Minimal Python framework.

Ruled out — too minimal for this domain; no async support; would require assembling more third-party pieces than FastAPI.

### Node.js (Express / Hono / Fastify)

JavaScript backend.

Ruled out — Python is the team language for the backend; introducing a second runtime on the server side serves no architectural purpose.

## Links

- [System design §4.3](../01-SYSTEM-DESIGN.md#43-architecture)
- [Backend README](../../backend/README.md)
