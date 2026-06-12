# ADR-02: Frontend / web UI stack

|              |                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Status**   | Accepted                                                                                                                                                                                                                                   |
| **Date**     | 2026-06-11                                                                                                                                                                                                                                 |
| **Deciders** | Ana Tarrisse                                                                                                                                                                                                                               |
| **Related**  | [ADR-01](01-backend-stack.md) · [System design §4.3](../01-SYSTEM-DESIGN.md#43-architecture) · [PRD §1.4](../../product/03-PRODUCT-REQUIREMENTS.md#14-dog-intake-form) · [PRD §5](../../product/03-PRODUCT-REQUIREMENTS.md#5-owner-portal) |

## Problem statement

The platform needs a web UI for three surfaces, all delivered from **one codebase**:

- **Petsitter app** — families, dogs, invites, bookings, statements; delivered across milestones (see [Roadmap](../../product/02-ROADMAP.md))
- **Owner portal** — read-only views; same app as petsitter, separated by role-based routing (scope per [PRD §5](../../product/03-PRODUCT-REQUIREMENTS.md#5-owner-portal))
- **Public pages** — token-gated forms (no login); URL tokens validated server-side

## Context

The backend is **FastAPI + PostgreSQL + SQLAlchemy + Alembic** ([ADR-01](01-backend-stack.md)) — a separate REST JSON API that owns business logic, persistence, auth, and background jobs. Pydantic models on the backend serve as both the validation layer and the **OpenAPI schema source**; the frontend consumes that contract, not a parallel type definition.

**Constraints**

- **Solo operator** — one person owns product, design, and engineering
- **Contained backend scope** — FastAPI owns API complexity; frontend stays thin
- **No scale requirements** — projected traffic fits Vercel free tier and a single-region API
- **Invite-only** — no public sign-up

## Requirements (from ADR-01)

- keep FastAPI as the sole API and auth authority — no Next.js API routes or server-side session handling
- call a REST JSON API grouped by domain modules (`families`, `dogs`, `auth`, `invites`, …); exact routes live in milestone design docs
- work across **separate origins** in local dev (Next.js + FastAPI) and production (Vercel frontend + hosted API)

## Decision drivers

- **API is a separate origin** ([ADR-01](01-backend-stack.md)) — frontend is UI + client-side fetch only; Vercel hosts Next.js, FastAPI hosts elsewhere
- **Team already ships Next.js + Emotion** — no migration cost; Radix Themes avoids building a component library from scratch for M1
- **Three route groups, one deploy** — petsitter app, owner portal, and public token pages need separate layout and auth boundaries; App Router route groups handle this without a second router
- **M1 is form- and CRUD-heavy** — multi-section dog profiles with add/remove list rows (feeding, medication, bathroom), family/dog CRUD, per-section profile saves, invite send/revoke, and the token intake form

## Decision outcome

**Next.js (App Router) + TypeScript + Radix Themes + Emotion + Vercel**

Next.js-specific guardrails ([ADR-01](01-backend-stack.md)): no `app/api/` routes, no NextAuth.

### Full stack

| Layer             | Choice                     | Rationale                                                                      |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------ |
| Framework         | Next.js (App Router)       | Route groups for petsitter, owner, and public surfaces; team-standard patterns |
| Language          | TypeScript                 | Static typing; generated API types — see consequences                          |
| Components        | Radix Themes               | Pre-styled, accessible; no design system from scratch                          |
| Styling           | Emotion                    | CSS-in-JS consistent with team patterns; co-located styles                     |
| Custom components | Radix Primitives + Emotion | Incremental migration path as design system grows                              |
| Forms             | React Hook Form + Zod      | Add/remove list rows in dog profiles (feeding, medication, bathroom)           |
| Data fetching     | TanStack Query             | `useMutation` + `invalidateQueries` for M1 CRUD                                |
| Deployment        | Vercel                     | Hosts Next.js; API deploys separately ([ADR-01](01-backend-stack.md))          |

**Radix Themes**, **React Hook Form**, and **Zod** were not compared to alternatives in this ADR — team already uses this stack and it fits M1 (see decision drivers). Framework and data-fetching alternatives are ruled out below.

### Styling approach

Start with **Radix Themes** for pre-built components. Use **Emotion** (`styled`, `css`) for custom styles and overrides from day one. Migrate individual components from Radix Themes → Radix Primitives + Emotion as design needs grow — no big-bang rewrite required.

**Emotion and RSC:** Emotion requires a JS runtime and cannot run in React Server Components. This is not a constraint in practice — the auth-gated, interactive surfaces in this product are inherently client components (`"use client"`). If future requirements introduce RSC-rendered output that needs styling (e.g. SEO pages), CSS Modules or Tailwind would be the replacement path for those specific components; Emotion would remain for the interactive shell.

### Consequences

**Positive**

- File-based route groups cleanly separate petsitter, owner portal, and public surfaces
- Emotion coexists with Radix Themes from day one; migration to custom primitives is incremental
- Vercel removes frontend hosting and deployment complexity

**Neutral**

- `frontend/` directory in repo; existing Prettier config extends to TS/JSX
- API types generated from FastAPI's `/openapi.json` via `openapi-typescript` + `openapi-fetch`; regenerated on backend contract changes; Pydantic models remain authoritative
- One FastAPI app and one PostgreSQL database per environment ([ADR-01](01-backend-stack.md)); frontend env config points at the matching API base URL
- Domain routes and field-level API contract defined in milestone design docs (e.g. `02-m1-design.md`)
- Zod validates forms client-side for immediate feedback; Pydantic on the backend is authoritative — client schemas are for UX, not security
- Session transport (cookie vs JWT) depends on [ADR-03](03-auth-provider.md); frontend must work with whichever pattern ADR-03 chooses
- Revisit this ADR if requirements change materially — e.g. native mobile client, SEO-critical public pages, auth needing edge middleware, or Vercel cost no longer acceptable

**Negative**

- `"use client"` required for most interactive components — auth-gated CRUD app is predominantly client-side
- Two processes in local dev (Next.js + FastAPI) and separate origins in production — CORS and cookie/token handling must be configured explicitly
- More initial scaffolding than a Vite SPA

## Other options considered

### React + Vite (+ TanStack Router or React Router)

Pure SPA; Vite dev server; static output. Genuinely simpler mental model — no Server Components, no RSC payload, faster cold-start dev. Vite + TanStack Router is a credible modern alternative with typed, file-based routing.

Ruled out for two architectural reasons:

1. **Route groups don't exist in Vite routers.** Petsitter app, owner portal, and public token pages need separate root layouts and auth boundaries. Next.js App Router expresses this natively (`(petsitter)/`, `(owner)/`, `(public)/`); replicating it in TanStack Router or React Router requires manual layout composition and nested outlet plumbing — more boilerplate for no gain.
2. **Deployment fragmentation.** A static SPA on Vercel is fine today, but any future edge-middleware need (e.g. token validation before serving a public form) would require a migration. Next.js keeps that option open without a rebuild.

### Remix

The closest architectural competitor to Next.js App Router for this product: file-based routing, nested layouts with separate auth boundaries, form-focused with built-in action/loader primitives, and strong TypeScript support.

Ruled out because:

- The backend is a separate FastAPI REST API ([ADR-01](01-backend-stack.md)). Remix's loader/action model is optimised for server-side data fetching co-located with the route — that advantage disappears entirely when every data call is a cross-origin fetch to an external API. The primary benefit of Remix over Next.js App Router collapses in this architecture.
- No team exposure; zero migration benefit from existing patterns.

If the backend were ever collapsed into a single Node.js monolith, Remix would be worth re-evaluating.

### Server-rendered FastAPI (Jinja2 + HTMX)

Ruled out — component-based SPA is a better fit for complex form UX; REST API would need to be added anyway for a future native client.

### SWR for data fetching

Ruled out — no built-in `useMutation`; each write needs a manual `mutate()` call per endpoint. M1 alone has ~12 distinct mutations (family/dog CRUD, profile section edits, invite send/revoke); SWR's smaller bundle and Vercel affiliation are not enough to offset that on a CRUD-heavy app.

## Links

- [ADR-03 — auth provider](03-auth-provider.md)
- [System design §4.3 — architecture](../01-SYSTEM-DESIGN.md#43-architecture)
- [System design §4.6 — API and interfaces](../01-SYSTEM-DESIGN.md#46-api-and-interfaces)
- [System design §10 — open questions](../01-SYSTEM-DESIGN.md#10-open-questions)
