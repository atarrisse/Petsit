# Product Overview

|                  |              |
| ---------------- | ------------ |
| **Owner**        | Ana Tarrisse |
| **Status**       | Approved     |
| **Last updated** | 2026-06-11   |

## Summary

A custom tool to manage my petsitting activities and centralize information.

One platform for dog care profiles, bookings, and invoicing — replacing Google Calendar, WhatsApp, spreadsheets, and scattered notes. Dog owners receive an invitation from me — no open sign-up — and get read-only access to their information.

Not a marketplace. Not built to scale. This is a single-operator tool for my specific workflow, not a SaaS product for others.

## Problem

Dog and client information is scattered across Google Calendar, WhatsApp, spreadsheets, and ad-hoc notes. There is no single place for care data and client records. In practice this means: wrong care instructions during a stay, invoices built manually from memory, and owners messaging me for information I've already recorded somewhere else.

## Vision

**For me:** One source of truth for dogs, clients, bookings, and invoices. Repetitive tasks — billing, confirmations, reports — run automatically. I focus on the dogs.

**For dog owners:** A clear window into their dog's care — profile, stays, and invoices available whenever they need them, without having to ask.

## Users

| User          | Role                               |
| ------------- | ---------------------------------- |
| **Petsitter** | Primary. Full control.             |
| **Dog owner** | Secondary. Invite-only. Read-only. |

One account per family (all their dogs visible). No open sign-up. Solo operator only.

_Detailed access and permission rules: [03-PRODUCT-REQUIREMENTS.md §2](03-PRODUCT-REQUIREMENTS.md)_

## Core capabilities

What the platform does — at a high level:

1. **Dogs and their families** — Centralized client and care records
2. **Owner invites** — Controlled access for dog owners
3. **Bookings** — Full-day day care and boarding stays I create and manage
4. **Calendar and email** — Automatic events and confirmations on booking
5. **Owner portal** — Read-only; starts as a dog list with full profile, then bookings and invoices
6. **Invoicing** — Scheduled monthly invoices with payment tracking

_Behavioral detail for each area: [03-PRODUCT-REQUIREMENTS.md](03-PRODUCT-REQUIREMENTS.md) — Build order and availability per milestone: [02-ROADMAP.md](02-ROADMAP.md)_

## Success criteria

1. All information in one place — dogs, families, care data, bookings, invoices — accessible to me and visible to owners without going through WhatsApp
2. Booking and invoicing processes are automated

**First useful release (M1):** Dogs, families, and owner access (dog list) centralized — addresses primary pain. [Build order →](02-ROADMAP.md)

## Out of scope

- In-app payments
- Multi-petsitter marketplace
- Open self-registration

## Future considerations

- **Activity logs** — record walks, feeding, bathroom breaks, and notes per stay
- **Native mobile app and widgets** — quick-glance widgets for active stays; faster access on the go
- **Care reports** — auto-generated end-of-stay or end-of-day summary sent to the owner
- **Multi-language support** — launch is English-only, others to follow
- **Third-party integrations** — e.g., Tractive GPS tracker data linked to a dog's profile

---

## Changelog

### 2026-06-11

- **Half-day day care deprecated** — day care is full-day only; no half-day duration option on bookings or in the rate model
- **Group flat price removed** — multi-dog and special-rate adjustments use booking-level discount only (see PRD §6.2)
- **Invoicing rules clarified** — cross-month stays split by calendar month; in-progress stays billable through invoice date; invoiced bookings cannot be cancelled (void and reissue instead)

### 2026-06-07

- **Rate model scope moved to v1** — per-dog pricing, discounts, and client tenure pricing removed from Future Considerations; confirmed as M3 requirements after discovering global-only rates would require rework
- **Owner portal M1 scope expanded** — full dog profile access moved from future expansion to M1; profile is built in M1 so no reason to defer owner visibility
