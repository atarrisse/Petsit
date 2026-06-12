# Roadmap

|                  |              |
| ---------------- | ------------ |
| **Owner**        | Ana Tarrisse |
| **Status**       | Approved     |
| **Last updated** | 2026-06-12   |

## Milestones

### M1 — Dogs and families

**Goal:** Centralize care data and client households.

**Includes:**

- Authentication (petsitter and owner roles)
- Owner invites — email invite primary, shareable family-scoped link secondary
- Dog CRUD — petsitter creates directly, or via owner intake form link
- Family CRUD
- Link dogs to families
- Full dog profile (Identity, Routine, Behaviour, Health, Security)
- List / search dogs
- Owner portal — dog list and full profile (read-only)

**Done when:**

- Your active dogs and families are in the app
- Dog profiles are used as reference during real stays
- Owners can log in and see their dog profiles in the portal

---

### M2 — Bookings

**Goal:** Schedule stays in the app.

**Includes:**

- Booking CRUD (dog, date range, service type, status)
- Conflict detection
- Bookings view on dog profile
- Owner portal — full bookings history

**Done when:**

- You create and manage real bookings in the app
- Overlapping dates for the same dog trigger a warning
- Owners can see their full bookings history in the portal

---

### M3 — Statements

**Goal:** Monthly statements in the app.

**Includes:**

- Rate model — day care and boarding global defaults with per-dog overrides and booking-level discounts
- Send statements manually — email listing bookings and total due
- Payment tracking per booking (mark paid individually or all on a statement)
- Owner portal — outstanding balance, payment status on bookings, statement history

**Done when:**

- You send a real month's statement using the app
- Per-dog rates and overrides are applied correctly
- Payment status is tracked per booking in the app
- Owners can see outstanding balance and payment status in the portal

---

### M4 — Workflow automation

**Goal:** Automate booking confirmations, reminders, calendar updates, and statement drafting.

**Includes:**

- Confirmation email to owners on booking create and changes
- Day-before reminder email
- Scheduled end-of-month statement draft
- Integration with petsitter's Google Calendar

**Done when:**

- A new booking creates a Google Calendar event and sends a confirmation email automatically
- Booking changes and cancellations update the Google Calendar event and trigger an update email
- A day-before reminder fires without manual steps
- Statements are drafted automatically at month end and sent after your review

---

## Dependency chain

```text
M1 Dogs & families  →  M2 Bookings  →  M3 Statements  →  M4 Workflow automation
```

Each milestone should be usable on its own before starting the next.

---

## Mapping to Overview

| Overview capability   | Milestone                   |
| --------------------- | --------------------------- |
| Dogs and care records | M1                          |
| Families              | M1                          |
| Owner invites         | M1                          |
| Owner portal          | M1 (dog list and profile)   |
|                       | M2 (bookings history)       |
|                       | M3 (balance and statements) |
| Bookings              | M2                          |
| Statements            | M3                          |
| Calendar and email    | M4                          |

---

## Changelog

### 2026-06-12

- **M3 renamed Statements** — statements replace invoices; payment per booking (see PRD §6)
- **Unified terminology** — "Statement" everywhere (no separate "billing" label)

### 2026-06-11

- **Group flat price removed** — multi-dog and special-rate adjustments use booking-level discount only
- **Billing period rules** — invoice month determined by scheduled pick-up for completed stays; cross-month stays split by calendar month; in-progress stays included at month end for their portion
- **Half-day day care deprecated** — M2 bookings and M3 rates use full-day day care only

### 2026-06-10

- Moved invite emails from M4 workflow automation to M1 owner access; M1 now includes email invites as the primary invite method and shareable family-scoped links as the secondary method.

### 2026-06-08

- Clarified that day-before reminder emails are sent the morning of the day before drop-off, not exactly 24 hours before.
