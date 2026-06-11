# Product Discovery

**Purpose:** Capture confirmed answers before writing the Product Overview.  
**Status:** Complete — Product Overview drafted  
**Owner:** Ana Tarrisse  
**Last updated:** 2026-06-05

---

## How to use this document

| Symbol | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| ⬜     | Not yet confirmed — draft answer may exist from codebase/discussions |
| ✅     | Confirmed by Ana                                                     |
| ❌     | Rejected — see notes                                                 |
| ⏸️     | Deferred — decide later                                              |

**Rules**

- Draft answers marked `[DRAFT]` come from the old repo or prior conversations. **They are not final.**
- The Product Overview will be written **only** from ✅ answers.
- Answer in chat, or edit **Your answer** fields directly.

---

## A. Business context

### A1 — Business model

|                 |                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Question**    | How do you run your petsitting business today? (solo operator, side business, full-time?) |
| **Status**      | ✅                                                                                        |
| **Draft**       | `[DRAFT]` Solo petsitter (Ana), small scale (~10 families, ~10 dogs).                     |
| **Your answer** | Solo — side business alongside other work.                                                |

### A2 — Geography & language

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| **Question**    | Where do you operate, and what language(s) should the product support? |
| **Status**      | ✅                                                                     |
| **Draft**       | `[DRAFT]` Not documented in codebase.                                  |
| **Your answer** | Multilingual platform — launch in English first; more languages later. |

### A3 — Services offered

|                 |                                                                               |
| --------------- | ----------------------------------------------------------------------------- |
| **Question**    | What services do you offer? (day care, boarding, walks, house visits, other?) |
| **Status**      | ✅                                                                            |
| **Draft**       | `[DRAFT]` Day care and boarding only (auto-detected from booking dates).      |
| **Your answer** | Day care and boarding only.                                                   |

### A4 — Scale today & in 2 years

|                 |                                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| **Question**    | How many active families and dogs do you have now? What growth do you expect?     |
| **Status**      | ✅                                                                                |
| **Draft**       | `[DRAFT]` ~10 families, ~10 dogs (3 dog JSON files in repo; ~9 mentioned total).  |
| **Your answer** | ~20 dogs active over time (dogs come and go). No intention to scale aggressively. |

---

## B. Problem & motivation

### B1 — Core problem

|                 |                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Question**    | What is the single biggest operational pain you want this platform to solve?                     |
| **Status**      | ✅                                                                                               |
| **Draft**       | `[DRAFT]` Manual glue between calendar, confirmations, invoicing, and scattered client/dog info. |
| **Your answer** | Scattered dog/client information — no single place for care data and client records.             |

### B2 — Pain points (rank or select all that apply)

|                   |                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Question**      | Which tasks cost you the most time or cause the most errors today?                                                                                                                            |
| **Status**        | ✅                                                                                                                                                                                            |
| **Draft options** | `[DRAFT]` (a) Creating bookings + calendar entries (b) Sending confirmations (c) Monthly invoicing/spreadsheets (d) Finding dog care info (e) Owners asking "when is my next stay?" (f) Other |
| **Your answer**   | Finding/updating scattered dog & client info (primary).                                                                                                                                       |

### B3 — Current tools

|                 |                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Question**    | What tools do you use today for each task?                                                                                 |
| **Status**      | ✅                                                                                                                         |
| **Draft**       | `[DRAFT]` Google Calendar, WhatsApp/email, spreadsheets, scattered notes. Old repo had JSON files + printable care sheets. |
| **Your answer** | Google Calendar + WhatsApp/email + spreadsheets + scattered notes.                                                         |

### B4 — Why build vs. buy

|                 |                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Question**    | Why build custom software instead of using existing pet-care or booking apps?                     |
| **Status**      | ✅                                                                                                |
| **Draft**       | `[DRAFT]` Not documented.                                                                         |
| **Your answer** | Tailored to my workflow; learning goals: product thinking, building with AI, backend development. |

---

## C. Users & roles

### C1 — Primary user

|                 |                                                           |
| --------------- | --------------------------------------------------------- |
| **Question**    | Who is the primary user the product is designed for?      |
| **Status**      | ✅                                                        |
| **Draft**       | `[DRAFT]` The petsitter (Ana) — full operational control. |
| **Your answer** | Ana — the petsitter, full operational control.            |

### C2 — Secondary users

|                 |                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Question**    | Who else uses the product, and what do they need?                                                     |
| **Status**      | ✅                                                                                                    |
| **Draft**       | `[DRAFT]` Dog owners / family members — invite-only, read-only access to their bookings and invoices. |
| **Your answer** | Dog owners — read-only access to bookings, invoices, and care profiles.                               |

### C3 — Multiple people per family

|                 |                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Question**    | Can multiple people from one family have accounts (e.g. both partners)?                                    |
| **Status**      | ✅                                                                                                         |
| **Draft**       | `[DRAFT]` Not explicitly decided. Invite is per-family; multiple users per family possible but undefined.  |
| **Your answer** | One account per family — portal lists all dogs from that family. (Clarified after initial per-dog answer.) |

### C4 — Marketplace / multi-petsitter

|                 |                                                                   |
| --------------- | ----------------------------------------------------------------- |
| **Question**    | Will this ever support multiple petsitters or is it only for you? |
| **Status**      | ✅                                                                |
| **Draft**       | `[DRAFT]` Single petsitter only — not a marketplace.              |
| **Your answer** | Solo only — just my business, not a marketplace.                  |

---

## D. Product vision

### D1 — One-sentence description

|                 |                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Question**    | Describe the product in one sentence.                                                                                                      |
| **Status**      | ✅                                                                                                                                         |
| **Draft**       | `[DRAFT]` A petsitting business management platform for a solo petsitter to manage families, dogs, bookings, calendar sync, and invoicing. |
| **Your answer** | My custom tool to manage my petsitting activities and centralize information.                                                              |

### D2 — What changes for you when this exists

|                 |                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Question**    | What is different about your day-to-day when the platform is working?                                               |
| **Status**      | ✅                                                                                                                  |
| **Draft**       | `[DRAFT]` Not documented in your words.                                                                             |
| **Your answer** | Everything in one place AND less admin — no hunting through messages/files; bookings and invoices mostly automatic. |

### D3 — What changes for dog owners

|                 |                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Question**    | What is different for dog owners when the platform is working?                            |
| **Status**      | ✅                                                                                        |
| **Draft**       | `[DRAFT]` They can self-serve: see bookings and invoices without messaging you.           |
| **Your answer** | Access to their information in the portal, plus calendar invites and confirmation emails. |

---

## E. Families (clients)

### E1 — What is a "family"

|                 |                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Question**    | How do you define a client household? One billing unit? One invite unit?                       |
| **Status**      | ✅                                                                                             |
| **Draft**       | `[DRAFT]` One family = one client household; dogs belong to a family.                          |
| **Your answer** | Household groups dogs (one bill, one account) — but each dog can have its own contact details. |

### E2 — Family data fields

|                 |                                                   |
| --------------- | ------------------------------------------------- |
| **Question**    | What information do you need to store per family? |
| **Status**      | ✅                                                |
| **Draft**       | `[DRAFT]` Name, contact email.                    |
| **Your answer** | Name, email, phone, address.                      |

### E3 — Emergency contact

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Question**    | Do you need emergency contact details (phone, alternate contact) per family or per dog? |
| **Status**      | ✅                                                                                      |
| **Draft**       | `[DRAFT]` Not in codebase.                                                              |
| **Your answer** | Both — family default + per-dog override.                                               |

### E4 — Inactive families

|                 |                                                                       |
| --------------- | --------------------------------------------------------------------- |
| **Question**    | What happens when a client stops using your service? Archive? Delete? |
| **Status**      | ✅                                                                    |
| **Draft**       | `[DRAFT]` Not documented.                                             |
| **Your answer** | Case-by-case — no strict rule for v1.                                 |

---

## F. Dogs & care information

### F1 — Why store dog profiles in the platform

|                 |                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Question**    | What do you use dog care information for in this platform? (booking only? care during stay? sharing with owners?) |
| **Status**      | ✅                                                                                                                |
| **Draft**       | `[DRAFT]` Structured profiles for care during stays; old repo had rich care data (feeding, health, behaviour).    |
| **Your answer** | My reference during stays AND owner visibility (read-only care profiles).                                         |

### F2 — Care sheet / printable output

|                 |                                                                                    |
| --------------- | ---------------------------------------------------------------------------------- |
| **Question**    | Do you still need printable care sheets, or is in-app viewing enough?              |
| **Status**      | ✅                                                                                 |
| **Draft**       | `[DRAFT]` You said care sheets are past — deprecate. Confirm for Product Overview. |
| **Your answer** | Not part of this product — deprecate the old care sheet / static site.             |

### F3 — Dog profile depth

|                 |                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| **Question**    | How detailed must dog profiles be at launch? Full care data or minimal (name, breed, family)?                 |
| **Status**      | ✅                                                                                                            |
| **Draft**       | `[DRAFT]` Full structured profile: identity, routine, behaviour, health, security (from backend-planning.md). |
| **Your answer** | Full care data at launch (feeding, health, behaviour, medications, etc.).                                     |

### F4 — Who can see dog care details

|                 |                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Question**    | Can dog owners see full care profiles, or only bookings/invoices?                            |
| **Status**      | ✅                                                                                           |
| **Draft**       | `[DRAFT]` Owners read-only on bookings and invoices — care profile visibility not specified. |
| **Your answer** | Yes — owners can see read-only care profiles for their dogs.                                 |

### F5 — Multiple dogs per booking

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Question**    | Can one booking include multiple dogs from the same family? Different families?         |
| **Status**      | ✅                                                                                      |
| **Draft**       | `[DRAFT]` Multiple dogs mentioned in booking input; same family implied, not confirmed. |
| **Your answer** | Yes — one booking can include multiple dogs from the same family.                       |

### F6 — Petsitter tracker consent

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Question**    | Do you need to record owner consent before attaching your own GPS tracker to a dog during stays?             |
| **Status**      | ✅                                                                                                           |
| **Draft**       | `[DRAFT]` Security section covers microchip and GPS tracker — petsitter-owned tracker not specified.         |
| **Your answer** | Yes — store `tracker_consent` on the dog profile. Separate from whether the dog already has its own tracker. |

---

## G. Access & authentication

### G1 — Who can sign up

|                 |                                                                     |
| --------------- | ------------------------------------------------------------------- |
| **Question**    | Open registration, invite-only, or petsitter-created accounts only? |
| **Status**      | ✅                                                                  |
| **Draft**       | `[DRAFT]` Invite-only — no open self-registration.                  |
| **Your answer** | Invite-only — I invite owners; no open self-registration.           |

### G2 — Petsitter login

|                 |                                                                                  |
| --------------- | -------------------------------------------------------------------------------- |
| **Question**    | How do you log in? Same auth system as owners or separate?                       |
| **Status**      | ✅                                                                               |
| **Draft**       | `[DRAFT]` Same system; role distinguishes petsitter (full) vs owner (read-only). |
| **Your answer** | Same auth system — role determines access level.                                 |

### G3 — Auth provider preference

|                 |                                                                                  |
| --------------- | -------------------------------------------------------------------------------- |
| **Question**    | Build custom auth or use a provider (Auth0, Clerk, etc.)?                        |
| **Status**      | ✅                                                                               |
| **Draft**       | `[DRAFT]` Auth0 recommended — password reset, sessions, transferable to day job. |
| **Your answer** | Auth0.                                                                           |

---

## H. Invites

### H1 — Invite methods

|                 |                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Question**    | How do owners get access? Email only, link only, or both?                                       |
| **Status**      | ✅                                                                                              |
| **Draft**       | `[DRAFT]` Email invite (primary) + scoped shareable link per family (secondary, e.g. WhatsApp). |
| **Your answer** | Email invite (primary) + scoped shareable link per family (secondary).                          |

### H2 — Invite expiry

|                 |                                             |
| --------------- | ------------------------------------------- |
| **Question**    | Should invite links expire? After how long? |
| **Status**      | ✅                                          |
| **Draft**       | `[DRAFT]` 7 days.                           |
| **Your answer** | 7 days.                                     |

### H3 — Re-invite / expired invite

|                 |                                                                     |
| --------------- | ------------------------------------------------------------------- |
| **Question**    | What happens when an invite expires unused? Can you resend?         |
| **Status**      | ✅                                                                  |
| **Draft**       | `[DRAFT]` Not documented.                                           |
| **Your answer** | Notify me the invite expired; I manually trigger sending a new one. |

### H4 — Revoke access

|                 |                                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| **Question**    | Can you revoke an owner's access after they accepted?                        |
| **Status**      | ✅                                                                           |
| **Draft**       | `[DRAFT]` Not documented.                                                    |
| **Your answer** | Yes — I should be able to revoke an owner's access after they have accepted. |

---

## I. Bookings

### I1 — Who creates bookings

|                 |                                                                     |
| --------------- | ------------------------------------------------------------------- |
| **Question**    | Who can create a booking? You only, or can owners request bookings? |
| **Status**      | ✅                                                                  |
| **Draft**       | `[DRAFT]` Petsitter only.                                           |
| **Your answer** | Petsitter only — I create all bookings.                             |

### I2 — Booking inputs

|                 |                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Question**    | What do you enter when creating a booking?                                                                                 |
| **Status**      | ✅                                                                                                                         |
| **Draft**       | `[DRAFT]` Dog(s), pick-up date/time, drop-off date/time.                                                                   |
| **Your answer** | Dog(s), drop-off time (stay starts), pick-up time (stay ends). Day care is full-day only — half-day deprecated 2026-06-11. |

### I3 — Day care vs boarding

|                 |                                                                                      |
| --------------- | ------------------------------------------------------------------------------------ |
| **Question**    | How is day care vs boarding determined?                                              |
| **Status**      | ✅                                                                                   |
| **Draft**       | `[DRAFT]` Auto: same calendar day = day care; drop-off after pick-up day = boarding. |
| **Your answer** | Auto from dates: same day = day care, overnight = boarding.                          |

### I4 — Pick-up vs drop-off semantics

|                 |                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Question**    | For boarding, does pick-up = owner brings dog to you, drop-off = owner collects dog? Confirm terminology matches how you work. |
| **Status**      | ✅                                                                                                                             |
| **Draft**       | `[DRAFT]` Not explicitly validated — **loophole: terminology may be inverted vs industry norms**.                              |
| **Your answer** | **Drop-off** = owner leaves the dog with me (start of stay). **Pick-up** = owner collects the dog (end of stay).               |

### I5 — Booking status lifecycle

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Question**    | What statuses does a booking go through? (upcoming, in progress, completed, cancelled?) |
| **Status**      | ✅                                                                                      |
| **Draft**       | `[DRAFT]` Completed bookings used for invoicing; full lifecycle not defined.            |
| **Your answer** | Upcoming → In progress → Completed (+ Cancelled).                                       |

### I6 — Cancel or modify booking

|                 |                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Question**    | Can you cancel or edit a booking after creation? What happens to calendar event and invoice? |
| **Status**      | ✅                                                                                           |
| **Draft**       | `[DRAFT]` Not documented — **loophole**.                                                     |
| **Your answer** | Yes — can cancel; calendar event should be removed/updated automatically.                    |

### I7 — Overlapping bookings

|                 |                                                                                       |
| --------------- | ------------------------------------------------------------------------------------- |
| **Question**    | Can the same dog have overlapping bookings? Should the system prevent double-booking? |
| **Status**      | ✅                                                                                    |
| **Draft**       | `[DRAFT]` Not documented — **loophole**.                                              |
| **Your answer** | Warn me but allow proceeding — don't hard-block.                                      |

### I8 — Partial days / hourly care

|                 |                                                                     |
| --------------- | ------------------------------------------------------------------- |
| **Question**    | Is day care always a full day, or do you charge by hours/half-days? |
| **Status**      | ✅                                                                  |
| **Draft**       | `[DRAFT]` Not documented — **loophole** for invoicing accuracy.     |
| **Your answer** | Full-day only — half-day deprecated 2026-06-11.                     |

---

## J. Calendar integration

### J1 — Which calendar

|                 |                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **Question**    | Which calendar system do you use and want integrated?                                               |
| **Status**      | ✅                                                                                                  |
| **Draft**       | `[DRAFT]` Google Calendar — your calendar only; OAuth once, store refresh token.                    |
| **Your answer** | Google Calendar for me (with family as attendee) **and** .ics calendar file via confirmation email. |

### J2 — What gets created on booking

|                 |                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Question**    | What should appear on the calendar when a booking is created?                                                                                                  |
| **Status**      | ✅                                                                                                                                                             |
| **Draft**       | `[DRAFT]` Event on your calendar (e.g. "Odi @ Ana (Boarding)"); family email added as attendee.                                                                |
| **Your answer** | My calendar title: `🐶 DOG_NAME: SERVICE`. Owner's title: `🐶 DOG_NAME: SERVICE with Ana`. Event spans drop-off → pick-up datetimes; family added as attendee. |

### J3 — Calendar failure

|                 |                                                                 |
| --------------- | --------------------------------------------------------------- |
| **Question**    | If calendar API fails but booking is saved, what should happen? |
| **Status**      | ✅                                                              |
| **Draft**       | `[DRAFT]` Not documented — **loophole**.                        |
| **Your answer** | Auto-retry in background; notify me if it still fails.          |

### J4 — Owner without Google Calendar

|                 |                                                                                        |
| --------------- | -------------------------------------------------------------------------------------- |
| **Question**    | What if the owner does not use Google Calendar? Is confirmation email enough?          |
| **Status**      | ✅                                                                                     |
| **Draft**       | `[DRAFT]` Email confirmation sent; .ics attachment mentioned as fallback in old notes. |
| **Your answer** | Confirmation email + .ics attachment is enough.                                        |

---

## K. Email & notifications

### K1 — What triggers an email

|                 |                                                          |
| --------------- | -------------------------------------------------------- |
| **Question**    | Which events should send email automatically?            |
| **Status**      | ✅                                                       |
| **Draft**       | `[DRAFT]` Invite, booking confirmation, monthly invoice. |
| **Your answer** | Invite, booking confirmation, monthly invoice.           |

### K2 — Email provider

|                 |                                                                   |
| --------------- | ----------------------------------------------------------------- |
| **Question**    | Any preference for transactional email service?                   |
| **Status**      | ⏸️                                                                |
| **Draft**       | `[DRAFT]` Resend or SendGrid — not raw SMTP.                      |
| **Your answer** | Undecided — not blocking Product Overview. Must not use raw SMTP. |

### K3 — Reminder emails

|                 |                                                              |
| --------------- | ------------------------------------------------------------ |
| **Question**    | Do you want reminder emails before a stay (e.g. 24h before)? |
| **Status**      | ✅                                                           |
| **Draft**       | `[DRAFT]` Not documented.                                    |
| **Your answer** | Nice to have later — not v1.                                 |

---

## L. Owner portal

### L1 — What owners can see

|                 |                                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| **Question**    | What can owners view in their portal?                                        |
| **Status**      | ✅                                                                           |
| **Draft**       | `[DRAFT]` Read-only: their family's bookings (past + upcoming) and invoices. |
| **Your answer** | Bookings + invoices + care profiles — all read-only.                         |

### L2 — What owners can do

|                 |                                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| **Question**    | Can owners take any actions (request booking, message you, update dog info)? |
| **Status**      | ✅                                                                           |
| **Draft**       | `[DRAFT]` Read-only only — no actions documented.                            |
| **Your answer** | View only — bookings and invoices; no actions.                               |

### L3 — Invoice visibility

|                 |                                                                             |
| --------------- | --------------------------------------------------------------------------- |
| **Question**    | Can owners see invoice history and PDFs in the portal, or email only?       |
| **Status**      | ✅                                                                          |
| **Draft**       | `[DRAFT]` Invoices mentioned for owner view; delivery format not specified. |
| **Your answer** | In portal AND emailed.                                                      |

---

## M. Invoicing & payments

### M1 — When invoices are sent

|                 |                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Question**    | When do families receive invoices?                                                              |
| **Status**      | ✅                                                                                              |
| **Draft**       | `[DRAFT]` End of each month, automated job.                                                     |
| **Your answer** | End of each month, automatically (scheduled). Updated 2026-06-05 — changed from manual trigger. |

### M2 — What goes on an invoice

|                 |                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Question**    | How are charges calculated?                                                                      |
| **Status**      | ✅                                                                                               |
| **Draft**       | `[DRAFT]` Day care rate × day care days + boarding rate × boarding nights; itemised per booking. |
| **Your answer** | Day care × rate + boarding nights × rate — itemised per booking.                                 |

### M3 — Rates

|                 |                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **Question**    | Are rates global, per family, or per dog? Any holiday/surcharge rates?                                    |
| **Status**      | ✅                                                                                                        |
| **Draft**       | `[DRAFT]` Single day care + boarding rate in settings — **loophole: per-dog/family/holiday not defined**. |
| **Your answer** | One global day care rate + one global boarding rate for everyone.                                         |

### M4 — Which bookings are billable

|                 |                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Question**    | Which bookings count toward an invoice? (completed only? cancelled with fee?)            |
| **Status**      | ✅                                                                                       |
| **Draft**       | `[DRAFT]` Completed bookings in the month — **loophole: cancellation policy undefined**. |
| **Your answer** | Completed stays in the month + cancelled only if I marked them as chargeable.            |

### M5 — Payment collection

|                 |                                                               |
| --------------- | ------------------------------------------------------------- |
| **Question**    | How do families pay? In-app payments or outside the platform? |
| **Status**      | ✅                                                            |
| **Draft**       | `[DRAFT]` Outside the app (bank transfer, etc.) — no Stripe.  |
| **Your answer** | Outside the app (bank transfer, etc.) — no in-app payments.   |

### M6 — Payment tracking

|                 |                                                                               |
| --------------- | ----------------------------------------------------------------------------- |
| **Question**    | Do you need to mark invoices as paid / track outstanding balances in the app? |
| **Status**      | ✅                                                                            |
| **Draft**       | `[DRAFT]` Not documented — **loophole**.                                      |
| **Your answer** | Yes — mark invoices as paid in the app.                                       |

### M7 — Invoice corrections

|                 |                                                          |
| --------------- | -------------------------------------------------------- |
| **Question**    | What if an invoice is wrong? Reissue? Manual adjustment? |
| **Status**      | ✅                                                       |
| **Draft**       | `[DRAFT]` Not documented — **loophole**.                 |
| **Your answer** | Void and reissue a corrected invoice.                    |

---

## N. Success metrics

### N1 — How you know it works

|                 |                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Question**    | How will you personally judge that the platform is successful?                                                                       |
| **Status**      | ✅                                                                                                                                   |
| **Draft**       | `[DRAFT]` Booking under 2 min; zero manual monthly invoices; owners self-serve booking visibility; one source of truth for dog data. |
| **Your answer** | All info in one place AND automated processes for booking and invoicing.                                                             |

### N2 — Minimum viable first release

|                 |                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **Question**    | What is the smallest version that would already help you in real work?                                    |
| **Status**      | ✅                                                                                                        |
| **Draft**       | `[DRAFT]` Not confirmed — old plan said data/API first; you may value bookings earlier.                   |
| **Your answer** | Dog + family data in one place — aligns with B1 (scattered data pain). Bookings/invoicing can come after. |

---

## O. Scope & non-goals

### O1 — Explicitly not building

|                 |                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Question**    | What should the Product Overview list as out of scope?                                                                    |
| **Status**      | ✅                                                                                                                        |
| **Draft**       | `[DRAFT]` Payment processing, multi-petsitter marketplace, native mobile app, open registration, care sheets/static site. |
| **Your answer** | In-app payments, multi-petsitter marketplace, native mobile app, open sign-up, care sheets/static site.                   |

### O2 — Future possibilities (mention but defer)

|                 |                                                                            |
| --------------- | -------------------------------------------------------------------------- |
| **Question**    | Anything you might want later but not now?                                 |
| **Status**      | ✅                                                                         |
| **Draft**       | `[DRAFT]` Admin UI, GraphQL, owner booking requests, walks/other services. |
| **Your answer** | More languages beyond English (multilingual platform long-term).           |

---

## P. Constraints

### P1 — Technical constraints

|                 |                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Question**    | Any technical preferences or constraints? (language, hosting budget, must work on phone browser?)                          |
| **Status**      | ✅                                                                                                                         |
| **Draft**       | `[DRAFT]` Old repo: FastAPI, PostgreSQL, Auth0 — **confirm if these belong in Product Overview or only engineering docs**. |
| **Your answer** | Keep tech stack out of Product Overview — belongs in engineering docs.                                                     |

### P2 — Time & learning goals

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Question**    | Is learning backend/auth part of the goal, or only shipping the business tool?          |
| **Status**      | ✅                                                                                      |
| **Draft**       | `[DRAFT]` Frontend engineer learning backend — prefer incremental steps.                |
| **Your answer** | Both — real business tool AND learning product thinking, backend, and building with AI. |

---

## Q. Flow loopholes (must resolve before PRD)

These are gaps in the documented flow — not assumptions. Please answer each.

| ID  | Loophole                   | Question for you                                                                        | Status | Your answer                                                                                 |
| --- | -------------------------- | --------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Q1  | Pick-up / drop-off meaning | Does "pick-up" mean owner brings dog to you, or you collect the dog? Same for drop-off. | ✅     | Drop-off = owner leaves dog (start). Pick-up = owner collects dog (end).                    |
| Q2  | Booking cancellation       | Cancel flow, calendar update, invoice impact?                                           | ✅     | Cancel updates calendar (I6). On invoice: ask me each time if cancelled booking is charged. |
| Q3  | Booking edits              | Can dates/times change after creation?                                                  | ✅     | Yes — dates/times editable; calendar updates automatically.                                 |
| Q4  | Double-booking             | Prevent overlapping stays for same dog?                                                 | ✅     | Warn but allow — don't hard-block.                                                          |
| Q5  | Partial-day pricing        | Full-day only or hourly/half-day rates?                                                 | ✅     | Full-day only — half-day deprecated 2026-06-11.                                             |
| Q6  | Rate variations            | Per dog, per family, holidays, multiple dogs discount?                                  | ✅     | Global rates only for v1 — variations out of scope.                                         |
| Q7  | Cancelled booking billing  | Charge for late cancellation?                                                           | ✅     | Ask me each time whether a cancelled booking is charged.                                    |
| Q8  | Calendar sync failure      | Booking saved but calendar fails — retry? notify you?                                   | ✅     | Auto-retry; notify if still fails.                                                          |
| Q9  | Email failure              | Same as Q8 for confirmation email?                                                      | ✅     | Auto-retry; notify if still fails (same as calendar).                                       |
| Q10 | Payment tracking           | Mark paid / chase overdue in app?                                                       | ✅     | Yes — mark invoices paid (M6).                                                              |
| Q11 | Wrong invoice              | Correction workflow?                                                                    | ✅     | Void and reissue corrected invoice (M7).                                                    |
| Q12 | Multiple owners per family | Both partners need login?                                                               | ✅     | One account per family; all dogs visible. Multiple logins per family not required for v1.   |
| Q13 | Owner sees dog care data   | Full profile or bookings/invoices only?                                                 | ✅     | Read-only full care profiles (confirmed F4).                                                |
| Q14 | Inactive client            | Archive vs delete data?                                                                 | ✅     | Case-by-case for v1 — no strict rule.                                                       |
| Q15 | Multi-dog booking billing  | One line or one line per dog on invoice?                                                | ✅     | Separate line per dog.                                                                      |

---

## R. Discovery progress

| Section             | Questions | Confirmed |
| ------------------- | --------- | --------- |
| A. Business context | 4         | 0         |
| B. Problem          | 4         | 0         |
| C. Users            | 4         | 0         |
| D. Vision           | 3         | 0         |
| E. Families         | 4         | 0         |
| F. Dogs             | 6         | 0         |
| G. Auth             | 3         | 0         |
| H. Invites          | 4         | 0         |
| I. Bookings         | 8         | 0         |
| J. Calendar         | 4         | 0         |
| K. Email            | 3         | 0         |
| L. Owner portal     | 3         | 0         |
| M. Invoicing        | 7         | 0         |
| N. Success          | 2         | 0         |
| O. Scope            | 2         | 0         |
| P. Constraints      | 2         | 0         |
| Q. Loopholes        | 15        | 0         |
| **Total**           | **73**    | **71**    |

**Next step:** 70/72 confirmed, 1 deferred (K2). Ready to draft Product Overview from ✅ answers.

---

## Changelog

| Date       | Change                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| 2026-06-05 | Initial discovery worksheet created                                                                    |
| 2026-06-05 | F6 — petsitter tracker consent (`tracker_consent`)                                                     |
| 2026-06-05 | Roadmap: families + auth/invites + owner dog list → M1; invoice schedule → M4 (supersedes N2 ordering) |
