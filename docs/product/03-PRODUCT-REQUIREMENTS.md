# Product Requirements

|                  |              |
| ---------------- | ------------ |
| **Owner**        | Ana Tarrisse |
| **Status**       | Approved     |
| **Last updated** | 2026-06-12   |

## 0. About this document

**Purpose.** Specifies **what the product must do** — behavior, rules, and scope per milestone. Does not cover technical implementation (stack, APIs, schema).

**Audience.** You (building and validating the product), and anyone implementing or testing a feature against agreed behavior.

**Related docs.**

| Doc                                              | Use when                                               |
| ------------------------------------------------ | ------------------------------------------------------ |
| [01-PRODUCT-OVERVIEW.md](01-PRODUCT-OVERVIEW.md) | Problem, vision, users, success criteria, out of scope |
| [02-ROADMAP.md](02-ROADMAP.md)                   | Build order and milestone "done when"                  |
| [04-OOUX-OBJECT-MAP.md](04-OOUX-OBJECT-MAP.md)   | Dog profile field-level structure                      |
| [Z-DISCOVERY.md](Z-DISCOVERY.md)                 | Tracing where a requirement came from                  |

**Success.** A feature is complete when it satisfies the requirements in this doc for its milestone and meets the [success criteria in the Product Overview](01-PRODUCT-OVERVIEW.md#success-criteria).

---

## 1. Dogs and families

_Milestone: [M1 — Dogs and families](02-ROADMAP.md#m1--dogs-and-families)_

Dogs are the central care entity — each dog has a full care profile. Dogs are grouped into **families** (client households), one family per household.

**Concept model:** [04-OOUX-OBJECT-MAP.md](04-OOUX-OBJECT-MAP.md) — includes diagram (see overview below)

![Dog profile concept model](dog-profile-overview.svg)

### 1.1 Dog profiles

Each dog has a full care profile at launch. **Identity, Routine, Behaviour, Health, and Security are section groupings** — they organize information on the profile; they are not separate objects the dog owns.

| Area          | Requirement                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**  | Captures enough basic information for the petsitter to understand who the dog is and what general care expectations apply, including name, breed, gender, size, age/DOB, energy level, vaccination status, neutered status, house-training, and insurance. |
| **Routine**   | Documents the dog's daily care routine so feeding, bathroom breaks, treats, and exercise can stay consistent during stays.                                                                                                                                 |
| **Behaviour** | Describes the dog's temperament, likes, struggles, known commands, and care notes that help the petsitter avoid stress or unsafe situations.                                                                                                               |
| **Health**    | Records health information needed for safe care and emergency readiness, including conditions, trauma history, veterinarian details, medication instructions, and **emergency contact** (name and phone) stored on each dog.                               |
| **Security**  | Documents microchip and tracker information, including any owner GPS tracker and consent for the petsitter to attach her own tracker during stays.                                                                                                         |

### 1.2 Families

A **family** groups the dogs under one household — one bill, one owner account.

A family has one or more dogs. Each dog may have its own contact details, which override the family-level contact for that dog.

**Emergency contact shortcut:** Emergency contact is stored on each dog. The family profile also offers a shortcut: when the petsitter sets emergency contact there, it **pre-fills** new dogs and **bulk-updates** all existing dogs in the family.

| Field        | Definition                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| Name         | The household or client name                                                      |
| Email        | Primary contact; used for portal invites and statement delivery                   |
| Phone        | Contact number                                                                    |
| Address      | Home address                                                                      |
| Billing mode | `Monthly` or `Per booking`. Default: `Per booking`. See [§6.1](#61-billing-mode). |

**Acceptance criteria**

**AC-1.2.1 — Emergency contact bulk-update**

- **Given** A family has one or more existing dogs
- **When** Petsitter sets emergency contact on the family profile
- **Then** Emergency contact on every dog in that family is updated to match

**AC-1.2.2 — Emergency contact pre-fill**

- **Given** Emergency contact is set on the family profile
- **When** Petsitter creates a new dog in that family (direct creation or after intake)
- **Then** The new dog's emergency contact is pre-filled from the family shortcut

**AC-1.2.3 — Billing mode default**

- **Given** Petsitter creates a new family
- **When** The family is saved
- **Then** `Billing mode` is `Per booking`

### 1.3 Dog list and search

Both the petsitter and owners access dogs from a dashboard entry point. The dog list is available there.

|            | Petsitter                    | Owner                    |
| ---------- | ---------------------------- | ------------------------ |
| **Scope**  | All dogs across all families | Household dogs only      |
| **Search** | By dog name or family name   | None                     |
| **Sort**   | Alphabetical by dog name     | Alphabetical by dog name |

### 1.4 Dog intake form

Dogs can be created in two ways:

| Method                | Who fills in the profile                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Direct creation**   | Petsitter fills in the full profile via the app                                                                 |
| **Owner intake form** | Petsitter generates a unique link; owner fills in the full profile via a standalone form (outside the platform) |

**Intake form link behaviour:**

- Generated by petsitter from the family profile pre-associated with that family
- "Send invite" emails the intake form link to the family email
- "Copy link" copies the link to clipboard for manual sharing
- Owner fills in the full profile (Identity, Routine, Behaviour, Health, Security)
- On submission: dog goes live immediately; link is invalidated (one-time use)
- Link expires after **30 days** if unused
- Dog profile is **read-only** for owners after submission; only petsitter can edit

**Acceptance criteria**

**AC-1.4.1 — Link generation**

- **Given** Petsitter is on a family profile
- **When** Petsitter generates an intake link
- **Then**
  - A unique link is created, pre-associated with that family
  - The intake form does not ask the owner to select a family

**AC-1.4.2 — Deliver link to owner**

_Via email_

- **Given** An intake link has been generated
- **When** Petsitter sends it via email
- **Then** Owner receives an invitation email containing a valid intake link (see [§2.3](#23-invite-flow))

_Manual copy_

- **Given** An intake link has been generated
- **When** Petsitter copies the link manually
- **Then** The copied link opens the intake form

**AC-1.4.3 — Successful submission**

- **Given** Owner opens a valid, unused intake link
- **When** Owner submits the completed intake form
- **Then**
  - A new dog is created under the linked family
  - Dog appears on the petsitter's dog list and the owner's portal immediately
  - The link is invalidated
  - The petsitter receives a dog-created confirmation email (see [§2.3](#23-invite-flow))

**AC-1.4.4 — Link expiry**

- **Given** An intake link was generated more than 30 days ago and never used
- **When** Owner opens the link
- **Then** The link is rejected as expired; no dog is created

**AC-1.4.5 — Owner read-only**

- **Given** A dog was created via intake form
- **When** Owner views that dog in the portal
- **Then** Owner can see the full profile but cannot edit any field

**AC-1.4.6 — Petsitter can edit**

- **Given** A dog was created via intake form
- **When** Petsitter opens that dog's profile
- **Then** Petsitter can view and edit the full profile

## 2. Access and invites

_Milestone: [M1 — Dogs and families](02-ROADMAP.md#m1--dogs-and-families)_

### 2.1 Registration

- **Invite-only** — no open self-registration
- One account per family; portal lists all dogs in that household

### 2.2 Authentication

Same auth system for petsitter and owners; **role** determines access. User context: [Product Overview — Users](01-PRODUCT-OVERVIEW.md#users).

|            | Petsitter    | Owner     |
| ---------- | ------------ | --------- |
| **Access** | Full control | Read-only |

Feature-specific behavior (e.g. dog list scope in [§1.3](#13-dog-list-and-search)) applies these roles per screen.

### 2.3 Invite flow

| Method         | Behavior                                         |
| -------------- | ------------------------------------------------ |
| Email invite   | Primary. Sent to family email.                   |
| Shareable link | Secondary. Scoped to one family (e.g. WhatsApp). |

**M1 access emails:**

| Trigger                   | Email                           | Recipient |
| ------------------------- | ------------------------------- | --------- |
| Owner account invite sent | Invitation to create an account | Owner     |
| Dog intake form link sent | Invitation to submit a dog      | Owner     |
| Dog intake form submitted | Dog created confirmation        | Petsitter |

- Booking confirmations, booking update/cancellation emails, reminders, and statement delivery are part of **M4 workflow automation**
- Invites expire after **30 days**
- If invite expires unused: **notify petsitter**; petsitter manually triggers a new invite
- Petsitter can **revoke** owner access after they have accepted
- Revoke **unlinks** the owner from the family — portal access removed; family data (dogs, bookings, statements) unchanged
- Petsitter can **re-invite** at any time; re-invited owner sees all household dogs, including intake-created dogs ([§1.4](#14-dog-intake-form))

**Acceptance criteria**

**AC-2.3.1 — Deliver owner account invite**

_Via email_

- **Given** Petsitter invites a family to the portal
- **When** Petsitter sends the invite via email
- **Then** Owner receives an invitation to create an account (see M1 access emails)

_Shareable link_

- **Given** Petsitter invites a family to the portal
- **When** Petsitter copies and shares the family-scoped invite link
- **Then** The link opens the account registration flow for that family

**AC-2.3.2 — Accept invite**

- **Given** Owner has a valid, unused invite
- **When** Owner completes registration
- **Then**
  - An account is created for that family
  - Owner can access the portal with read-only access to that family's dogs

**AC-2.3.3 — Invite expiry**

- **Given** An invite was sent more than 30 days ago and never used
- **When** Owner opens the invite link
- **Then**
  - The invite is rejected as expired
  - The petsitter is notified

**AC-2.3.4 — Re-invite after expiry**

- **Given** An owner account invite expired unused
- **When** Petsitter triggers a new invite
- **Then** A new valid invite is created for that family

**AC-2.3.5 — Revoke access**

- **Given** Owner has accepted an invite and has portal access
- **When** Petsitter revokes their access
- **Then** Owner can no longer access that family's data in the portal

## 3. Bookings

_Milestone: [M2 — Bookings](02-ROADMAP.md#m2--bookings)_

### 3.1 Who creates bookings

- **Petsitter only.** Owners cannot create or request bookings.

### 3.2 Booking inputs

| Field                    | Definition                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Dog(s)                   | One or more dogs from the **same family**                                                                                            |
| Drop-off                 | Start of booking: Agreed date and time owner **leaves** the dog                                                                      |
| Pick-up                  | End of booking: Agreed date and time owner **collects** the dog                                                                      |
| Actual drop-off          | Timestamp when stay is marked as started — recorded via "Start booking" button                                                       |
| Actual pick-up           | Timestamp when stay is marked as completed — recorded via "End booking" button                                                       |
| Discount                 | (Optional) Percentage or fixed amount, applied per booking; use for multi-dog or special-rate adjustments                            |
| Send day-before reminder | (Optional) Petsitter chooses per booking whether to send a [day-before reminder](#434-day-before-reminder) email; default off _(M4)_ |

### 3.3 Service type

Auto-detected from dates:

| Condition                              | Type     |
| -------------------------------------- | -------- |
| Same calendar day                      | Day care |
| Overnight (pick-up after drop-off day) | Boarding |

Detection uses **calendar dates only** — times are ignored.

**Acceptance criteria**

**AC-3.3.1 — Service type from dates**

_Same day_

- **Given** Drop-off and pick-up fall on the same calendar day
- **When** The booking is saved
- **Then** Service type is `Day care`

_Overnight_

- **Given** Pick-up is on a calendar day after drop-off
- **When** The booking is saved
- **Then** Service type is `Boarding`

### 3.4 Booking lifecycle

`Upcoming` → `In progress` → `Completed`

Also: `Cancelled`

Transitions are **manual**, triggered by the petsitter:

| Transition              | Trigger                | Records                   |
| ----------------------- | ---------------------- | ------------------------- |
| Upcoming → In progress  | "Start booking" button | Actual drop-off timestamp |
| In progress → Completed | "End booking" button   | Actual pick-up timestamp  |

**Acceptance criteria**

**AC-3.4.1 — Start booking**

- **Given** A booking is `Upcoming`
- **When** Petsitter taps "Start booking"
- **Then**
  - Status becomes `In progress`
  - Actual drop-off timestamp is recorded

**AC-3.4.2 — Complete booking**

- **Given** A booking is `In progress`
- **When** Petsitter taps "End booking"
- **Then**
  - Status becomes `Completed`
  - Actual pick-up timestamp is recorded

### 3.5 Edit and cancel

**Editing**

- Petsitter can change dates and times after creation
- Calendar event updates automatically _(M4)_

**Cancelling**

- Petsitter can cancel any booking at any point.
- Calendar event is removed _(M4)_
- Petsitter chooses whether to charge the cancelled booking; that choice is stored on the booking and used automatically on statements _(M3)_
- If the booking was already on a sent statement, flag it to petsitter ([§6.6](#66-corrections))
- Prepaid bookings cancelled as not chargeable keep their `paid` status; any refund is handled outside the app ([§6.5](#65-payment))

**Overlapping bookings**

- Overlap is based on **calendar dates only** (drop-off through pick-up dates, inclusive) — times are ignored
- If the same dog already has a booking whose date range shares any calendar day with the new or edited booking, petsitter sees a warning
- The booking can still be saved

**Acceptance criteria**

**AC-3.5.1 — Overlap warning**

- **Given** A dog already has a booking whose calendar date range (drop-off through pick-up, inclusive) shares at least one day with another booking
- **When** Petsitter creates or edits a booking with an overlapping date range
- **Then**
  - Petsitter sees a warning
  - The booking can still be saved

**AC-3.5.2 — Cancel booking**

- **Given** A booking is `Upcoming`, `In Progress` or `Completed`
- **When** Petsitter cancels the booking
- **Then** Status becomes `Cancelled`

**AC-3.5.4 — Cancel prepaid booking**

- **Given** A `paid` booking (e.g. paid ahead for an `Upcoming` stay)
- **When** Petsitter cancels the booking as not chargeable
- **Then**
  - Status becomes `Cancelled`
  - Payment status remains `paid`

**AC-3.5.5 — Resend statement after cancel**

- **Given** A booking was included on a sent statement
- **When** Petsitter cancels the booking as not chargeable and resends that statement month
- **Then** The cancelled booking is excluded and the statement total reflects the change

**AC-3.5.3 — Cancellation charge decision**

_Chargeable_

- **Given** Petsitter is cancelling a booking
- **When** Petsitter marks the booking as chargeable
- **Then** The chargeable flag is stored as true on the booking

_Not chargeable_

- **Given** Petsitter is cancelling a booking
- **When** Petsitter marks the booking as not chargeable
- **Then** The chargeable flag is stored as false on the booking

### 3.6 Bookings on dog profile

A dog's profile includes a bookings section visible to both petsitter and owner.

| Field          | Shown | Milestone |
| -------------- | ----- | --------- |
| Status         | Yes   | M2        |
| Drop-off       | Yes   | M2        |
| Pick-up        | Yes   | M2        |
| Service type   | Yes   | M2        |
| Price          | Yes   | M3        |
| Payment status | Yes   | M3        |

- Price is shown from **M3** onward (once the rate model exists); not shown in M2

- All bookings are shown (upcoming and past)
- Upcoming bookings are shown expanded; past bookings are collapsed by default
- Owners see the same section on the dog's profile in their portal, and bookings are also visible on their dashboard

## 4. Calendar and email

_Milestone: [M4 — Workflow automation](02-ROADMAP.md#m4--workflow-automation)_

Automates **petsitter calendar sync** and **owner emails** in response to booking events. Access and intake emails are defined in [§2.3](#23-invite-flow).

### 4.1 Automation overview

| Trigger             | Petsitter calendar | Owner email                                             | Timing                                                            |
| ------------------- | ------------------ | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Booking created     | Create event       | [Confirmation](#431-booking-confirmation)               | On save                                                           |
| Booking updated     | Update event       | [Update notification](#432-booking-update)              | On change of date or time                                         |
| Booking cancelled   | Remove event       | [Cancellation](#433-booking-cancellation)               | On cancel                                                         |
| Day before drop-off | —                  | [Reminder](#434-day-before-reminder)                    | Morning of the day before drop-off, **if enabled on the booking** |
| End of month        | —                  | [Statement](#61-billing-mode) (`Monthly` families only) | After petsitter review and approval                               |

### 4.2 Petsitter calendar sync

Syncs booking events to the petsitter's Google Calendar — create, update, and remove per the automation overview above.

- Event spans drop-off to pick-up
- Event title: `🐶 {dog name}: {service type}`

### 4.3 Owner emails

All owner emails go to the family email on file. Content specs below.

#### 4.3.1 Booking confirmation

_Sent on booking creation._

- Booking details
- Add-to-calendar link — title: `🐶 {dog name}: {service type} with {petsitter}`; independent of the petsitter's calendar
- `.ics` attachment for owners not using Google Calendar

#### 4.3.2 Booking update

_Sent when dates or times change._

- Changed fields only, shown as **before → after**
- Unchanged fields shown once with current values
- If the date change affects service type (day care ↔ boarding), show service type as **before → after**
- If the recalculated booking total changes, show total as **before → after** _(M3+ — rates exist)_

#### 4.3.3 Booking cancellation

_Sent on cancel._

- Cancellation notice with booking details

#### 4.3.4 Day-before reminder

_Sent the morning of the day before drop-off, only when the petsitter has enabled **Send day-before reminder** on that booking ([§3.2](#32-booking-inputs))._

- Agreed drop-off and pick-up times
- Items to bring — determined by a two-level model:

| Level                    | Description                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Baseline per service** | Default items list for day care or boarding; petsitter configures once in app settings                                  |
| **Per-dog override**     | Additional or replacement items for a specific dog (e.g. crate, specific food brand); petsitter sets on the dog profile |

The reminder uses the per-dog override if one exists; otherwise falls back to the baseline for that service type.

- Per-dog overrides are **petsitter-only** — not collected on the [owner intake form](#14-dog-intake-form)

#### 4.3.5 Statement

_Sent when the petsitter sends or approves a statement ([§6.4](#64-statements))._

- Family name
- Statement month
- Itemised list of included bookings — separate line per dog per booking
- Discount line per booking when set
- **Total due** for all bookings on the statement

**Acceptance criteria**

**AC-4.3.1 — Day-before reminder sent when enabled**

- **Given** A booking has **Send day-before reminder** enabled and is `Upcoming`
- **When** The morning of the day before scheduled drop-off arrives
- **Then** Owner receives the day-before reminder email

**AC-4.3.2 — Day-before reminder skipped when disabled**

- **Given** A booking has **Send day-before reminder** disabled (default)
- **When** The morning of the day before scheduled drop-off arrives
- **Then** No reminder email is sent

### 4.4 Failure handling

The booking is always valid and fully usable regardless of automation outcome. Automation failure never blocks the petsitter from editing, cancelling, or sending a statement for a booking.

| Failure            | Behavior                                                  |
| ------------------ | --------------------------------------------------------- |
| Calendar API fails | Auto-retry in background; notify petsitter if still fails |
| Email fails        | Auto-retry in background; notify petsitter if still fails |

When retries are exhausted: petsitter is notified and handles the communication manually (e.g. via WhatsApp or phone call). No in-app retry UI required.

**Acceptance criteria**

**AC-4.4.1 — Booking remains usable**

- **Given** A booking exists
- **When** Calendar or email automation fails
- **Then** The booking remains fully editable, cancellable, and eligible for statements by the petsitter

**AC-4.4.2 — Automation retry and notification**

_Calendar API fails_

- **Given** A booking triggers calendar sync
- **When** The Calendar API fails
- **Then**
  - The system retries in the background
  - The petsitter is notified if retries are exhausted

_Email fails_

- **Given** A booking triggers an email
- **When** Email delivery fails
- **Then**
  - The system retries in the background
  - The petsitter is notified if retries are exhausted

## 5. Owner portal

Read-only access for dog owners to their family's data. Rolled out incrementally across [M1](02-ROADMAP.md#m1--dogs-and-families), [M2](02-ROADMAP.md#m2--bookings), and [M3](02-ROADMAP.md#m3--statements). Access model: [§2.2](#22-authentication). Invites: [§2.3](#23-invite-flow).

### 5.1 Portal overview

| Milestone | Available in portal | Detail                    |
| --------- | ------------------- | ------------------------- |
| **M1**    | Dogs                | [§5.3](#53-dogs-m1)       |
| **M2**    | Bookings            | [§5.4](#54-bookings-m2)   |
| **M3**    | Statements          | [§5.5](#55-statements-m3) |

### 5.2 Access and constraints

Owners have **read-only** access — they can view data but cannot take any action in the app.

| Constraint      | Rule                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Scope**       | One account per family; sees all dogs in that household ([§2.1](#21-registration))         |
| **Permissions** | Read-only — no create, edit, or request actions ([§2.2](#22-authentication))               |
| **Bookings**    | Cannot create or request bookings ([§3.1](#31-who-creates-bookings))                       |
| **Profiles**    | Cannot edit dog profiles — including dogs submitted via [intake form](#14-dog-intake-form) |

### 5.3 Dogs _(M1)_

_Available from [M1](02-ROADMAP.md#m1--dogs-and-families)._

**Dashboard**

- Dog list for the household (scope, search, and sort per [§1.3](#13-dog-list-and-search))

**Dog profile**

- Full care profile — read-only (sections per [§1.1](#11-dog-profiles))

### 5.4 Bookings _(M2)_

_Available from [M2](02-ROADMAP.md#m2--bookings)._

**Dashboard**

- Bookings for the household — all bookings (upcoming and past)
- Sorted by scheduled drop-off date, soonest first
- Upcoming bookings expanded by default; past bookings collapsed by default (same rules as [§3.6](#36-bookings-on-dog-profile))

**Dog profile**

- Bookings section — same fields and display rules as petsitter view ([§3.6](#36-bookings-on-dog-profile))

### 5.5 Statements _(M3)_

_Available from [M3](02-ROADMAP.md#m3--statements)._

**Dashboard**

- **Outstanding balance** — total of all unpaid bookings for the household
- **Current month** _(optional breakdown)_ — three figures:
  - **Running total** — unpaid eligible bookings ([§6.3](#63-which-bookings-go-on-a-statement)) whose scheduled drop-off falls in the current calendar month
  - **Forecast total** — upcoming bookings whose scheduled drop-off falls in the current calendar month (full stay amount)
  - **Estimated total** — running + forecast
- **Statement history** — sent statements (statement month, date sent, total due)
- Bookings show **payment status** (unpaid / paid)

Statements may also arrive by email — see [statement email](#435-statement).

## 6. Statements

_Milestones: [M3 — Statements](02-ROADMAP.md#m3--statements), [M4 — Workflow automation](02-ROADMAP.md#m4--workflow-automation)_

**Statements** — an email listing what a family owes for one or more bookings. Payment is tracked **per booking**, not on a formal invoice document. Owner visibility: [§5.5](#55-statements-m3). Chargeable cancellations: [§3.5](#35-edit-and-cancel).

How and when statements are sent depends on the family's **billing mode**.

### 6.1 Billing mode

Each family has a **`Billing mode`** (default `Per booking`).

| Billing mode    | How statements are sent                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Monthly**     | Calendar-month statements — one per family per statement month. M4 end-of-month draft applies. |
| **Per booking** | Petsitter is prompted after each statement-eligible booking. No M4 month-end draft.            |

**M3 — manual statements** _(both modes)_

- Petsitter can send statements manually
- Owners view payment status and statement history in the portal

**M4 — automated statements** _(`Monthly` families only — builds on M3)_

- System drafts a statement automatically at end of each month (one per **`Monthly`** family with eligible bookings)
- Petsitter reviews and approves before the statement email is sent
- Approved statement is emailed to the owner ([§4.3.5](#435-statement)), in addition to portal visibility

#### 6.1.2 Per booking prompt

For families with `Billing mode = Per booking`, the app prompts the petsitter when a booking becomes chargeable:

- **Complete booking** — petsitter taps "End booking" ([§3.4](#34-booking-lifecycle))
- **Chargeable cancellation** — petsitter cancels and marks the booking chargeable ([§3.5](#35-edit-and-cancel))

**Prompt options:**

| Option                   | Effect                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Do nothing**           | Booking stays unpaid and unstated. Petsitter can send a statement later from the family or booking view. |
| **Charge this booking**  | Statement email covers **only** the triggering booking.                                                  |
| **Charge running total** | Statement covers all "open tab" - unpaid bookings, completed or ongoing - for this family.               |

**Acceptance criteria**

**AC-6.1.1 — Per booking prompt on complete**

- **Given** A family's `Billing mode` is `Per booking` and a booking becomes `Completed`
- **When** Petsitter taps "End booking"
- **Then** The per-booking prompt is shown with all three options

**AC-6.1.2 — No prompt for Monthly**

- **Given** A family's `Billing mode` is `Monthly` and a booking becomes `Completed`
- **When** Petsitter taps "End booking"
- **Then** The per-booking prompt is not shown

**AC-6.1.3 — Statement for this booking**

- **Given** Petsitter chooses "Send statement for this booking" on the per-booking prompt
- **When** The statement is sent
- **Then** The statement includes only the triggering booking and the email is sent

**AC-6.1.4 — Statement for running total**

- **Given** A family has three unpaid eligible bookings (drop-off 1 Jan, 8 Jan, 15 Jan) and the 15 Jan booking just became statement-eligible
- **When** Petsitter chooses "Charge running total"
- **Then** All three bookings are included on one statement, ordered by drop-off date

**AC-6.1.5 — Running total includes all unpaid bookings**

- **Given** The 1 Jan booking is on a sent statement but still unpaid, and the 8 Jan and 15 Jan bookings are also unpaid
- **When** Petsitter completes the 15 Jan booking and chooses "Charge running total"
- **Then** The statement includes all three bookings (1 Jan, 8 Jan, and 15 Jan), ordered by drop-off date

**AC-6.1.6 — M4 draft skips Per booking families**

- **Given** A family has `Billing mode = Per booking` and unpaid eligible bookings at month end
- **When** M4 end-of-month automation runs
- **Then** No statement draft is created for that family

### 6.2 Rates

Each booking is priced per dog and service type. Petsitter sets a **global default** for each service; **per-dog overrides** on the dog profile replace the global rate for specific dogs (including legacy or special rates — no separate tenure feature).

**Rate precedence (per dog):** per-dog override → global default

**Booking-level adjustments** (set at booking create/edit):

- **Discount** — optional; percentage or fixed amount; applied to the **whole booking total** after line items are summed (including multi-dog bookings). Use a fixed discount to reach an agreed total for multiple dogs or special rates.

**Service types**

| Service  | Unit                                                                              |
| -------- | --------------------------------------------------------------------------------- |
| Day care | Per dog (full-day only)                                                           |
| Boarding | Per night, per dog — one overnight between drop-off and pick-up dates = one night |

Pricing uses **dates only** — times are not used for price calculation. Actual drop-off/pick-up timestamps are operational records only.

**Boarding night count** — calendar dates only: nights = number of calendar days from drop-off date to pick-up date (when pick-up is after drop-off day).

| Drop-off  | Pick-up   | Nights |
| --------- | --------- | ------ |
| Mon 08:00 | Tue 08:00 | 1      |
| Mon 23:00 | Tue 07:00 | 1      |
| Mon       | Wed       | 2      |

**Acceptance criteria**

**AC-6.2.1 — Rate precedence**

- **Given** A dog has a per-dog rate override and a global default exists for that service
- **When** A booking line is priced for that dog
- **Then** The per-dog override is used

**AC-6.2.2 — Boarding night count**

- **Given** A boarding booking with drop-off Mon and pick-up Tue (any times)
- **When** The booking is priced
- **Then** Each dog is charged for 1 night at their boarding rate

**AC-6.2.3 — Booking discount**

_Fixed_

- **Given** A booking has line items totalling €100 and a fixed discount of €15
- **When** The booking is priced
- **Then** The booking total is €85

_Percentage_

- **Given** A booking has line items totalling €100 and a discount of 10%
- **When** The booking is priced
- **Then** The booking total is €90

### 6.3 Which bookings go on a statement

Which bookings are eligible when sending a statement:

| Booking status              | Included? |
| --------------------------- | --------- |
| `Completed`                 | Yes       |
| `In progress`               | Yes       |
| `Cancelled`, chargeable     | Yes       |
| `Cancelled`, not chargeable | No        |
| `Upcoming`                  | No        |

Only **unpaid** bookings are included. Paid bookings are never on a new statement.

#### 6.3.1 Statement month rules

Shared rules (both billing modes):

- **Statement month** — the calendar month of **scheduled drop-off** for a single-booking statement; for statements covering multiple bookings, the calendar month of the **latest included booking's** scheduled drop-off
- **Full stay per inclusion** — each time a booking appears on a statement, it is included for the **full stay** (all days/nights per rate rules above). Bookings are not split across calendar months — cross-month stays are billed in full (e.g. drop-off 28 Jan, pick-up 2 Feb → all 5 boarding nights)
- **Open tab** — while **unpaid**, a booking may appear on multiple statements; running total always lists all unpaid eligible bookings for the family, regardless of prior statements sent
- **`Completed` and `In progress` bookings** — eligible when included on a statement
- **`Upcoming`** — never on a statement
- **Chargeable cancellations** — eligible at the full booking amount

**`Monthly` families:**

- **One statement per family per statement month** — at most one statement per family for a given statement month; sending again **resends** the same statement (updated totals if bookings changed)
- Eligible bookings are included when the petsitter sends that **drop-off month's** statement

**`Per booking` families:**

- **No one-statement-per-month constraint** — multiple statements per family per calendar month are allowed
- Bookings are included when the petsitter sends via the per-booking prompt or manual send

**Acceptance criteria**

**AC-6.3.1 — Bill completed stays**

- **Given** A booking is `Completed`, scheduled drop-off falls in the statement month, and the booking is unpaid
- **When** Petsitter sends that month's statement for the family
- **Then** The booking is included for the full stay

**AC-6.3.2 — Bill chargeable cancellations**

_Chargeable_

- **Given** A cancelled booking marked chargeable whose scheduled drop-off falls in the statement month and is unpaid
- **When** Petsitter sends that month's statement for the family
- **Then** The booking is included for the full booking amount

_Not chargeable_

- **Given** A cancelled booking marked not chargeable
- **When** Petsitter sends a statement for that statement month
- **Then** The booking is excluded

**AC-6.3.3 — In progress at month end**

- **Given** A boarding booking with drop-off 28 Jan and pick-up 2 Feb is `In progress` on 31 Jan and is unpaid
- **When** Petsitter sends the January statement on 31 Jan
- **Then** The booking is included for all 5 nights on the January statement (not split to February)

**AC-6.3.4 — Cross-month stay when completed**

- **Given** A boarding booking with drop-off 28 Jan and pick-up 2 Feb is `Completed` and unpaid
- **When** Petsitter sends the January statement
- **Then** The booking is included for all 5 nights on the January statement (not split to February)

### 6.4 Statements

A **statement** records that the petsitter emailed a family about a set of bookings for a statement month. It is not a formal invoice document — it groups bookings and snapshots the total sent.

| Field     | Definition                                  |
| --------- | ------------------------------------------- |
| Family    | Client household                            |
| Month     | Calendar month of scheduled drop-off        |
| Bookings  | Unpaid eligible bookings included when sent |
| Total due | Sum of included booking totals at send time |
| Sent at   | When the statement email was sent           |

**Send statement** (manual — M3, approve draft — M4, or per-booking prompt):

_`Monthly` family_

1. Petsitter selects a family and statement month (defaults to current month)
2. App lists eligible unpaid bookings for that month
3. Petsitter clicks **Send statement** → email sent → statement created or updated (resend)
4. Included bookings are linked to the statement

_`Per booking` family_

1. Petsitter selects a family (or starts from a booking)
2. App lists all unpaid eligible bookings for the family
3. Petsitter selects which bookings to include (or uses the per-booking prompt options — **Charge running total** selects all)
4. Petsitter clicks **Send statement** → email sent → statement created
5. Included bookings are linked to the statement

**Statement email content** — same as [§4.3.5](#435-statement).

**Acceptance criteria**

**AC-6.4.1 — Separate line per dog**

- **Given** A statement includes a booking with multiple dogs
- **When** The statement email is sent
- **Then** Each dog has its own line item for that booking

**AC-6.4.2 — Booking discount on statement**

- **Given** A booking has a discount applied after line items
- **When** The statement email is sent
- **Then** The email shows one discount line for that booking reflecting the agreed reduction

**AC-6.4.3 — One statement per family per month (`Monthly`)**

- **Given** A **`Monthly`** family's statement was already sent for January 2026
- **When** Petsitter sends the January statement again
- **Then** The same statement is updated and the email is resent (bookings and total reflect current data)

**AC-6.4.4 — Multiple statements per month (`Per booking`)**

- **Given** A **`Per booking`** family already has a statement sent in January 2026
- **When** Petsitter sends another statement for a different unpaid booking in January
- **Then** A new statement is created (not a resend of the previous one)

### 6.5 Payment

- Families pay **outside the app** (e.g. bank transfer)
- Each booking has **payment status**: `unpaid` or `paid`
- Petsitter marks bookings **paid** individually, or **marks all bookings on a statement paid** in one action
- In-app payment processing: out of scope

**Acceptance criteria**

**AC-6.5.1 — Mark booking paid**

- **Given** An unpaid booking exists
- **When** Petsitter marks it as paid
- **Then** The booking shows as paid in the app and in the owner portal

**AC-6.5.2 — Mark all on statement paid**

- **Given** A statement has multiple unpaid bookings
- **When** Petsitter marks all bookings on that statement as paid
- **Then** Every included booking shows as paid in the app and in the owner portal

### 6.6 Corrections

- Fix incorrect amounts by **editing the booking** (allowed until the booking is paid)
- Remove a booking that should not count by **cancelling** it ([§3.5](#35-edit-and-cancel)) — same chargeable / not chargeable choice
- **Resend the statement** for that statement month to email the owner updated totals
- No void/reissue workflow — statements are send records, not editable documents

## 7. Out of scope (v1)

See [01-PRODUCT-OVERVIEW.md — Out of scope](01-PRODUCT-OVERVIEW.md#out-of-scope).

---

## Changelog

### 2026-06-12

**Statements and billing**

- **Billing mode** — `Monthly` or `Per booking` per family (default `Per booking`). `Monthly` families use calendar-month statements and M4 end-of-month drafts; `Per booking` families get a post-stay prompt (do nothing / charge this booking / charge running total)
- **Statement model** — no invoice entity; statements group bookings and trigger statement emails; payment tracked per booking
- **Statement month = drop-off month** — whole booking on one statement; no cross-month split; `In progress` and `Completed` both eligible
- **Running total = open tab** — includes all unpaid eligible bookings for the family, even if already on a prior sent statement; bookings may appear on multiple statements while unpaid
- **Unified terminology** — "Statement" everywhere (no separate "billing" label)

**Bookings**

- **Cancel** — petsitter can cancel any booking at any point (`Upcoming`, `In progress`, or `Completed`, paid or unpaid); chargeable / not chargeable choice; prepaid cancelled as not chargeable keeps `paid` status — refunds outside the app (no `refunded` status in v1)
- **Day-before reminder opt-in** — petsitter enables per booking (default off); sent morning of day before drop-off when enabled

**Access and email**

- **Intake and portal invites** — **Send invite** (email) and **Copy link** actions for intake form and owner account invites ([§1.4](#14-dog-intake-form), [§2.3](#23-invite-flow))
- **Booking update email** — changed fields shown as before → after; service type and booking total included when affected ([§4.3.2](#432-booking-update))

**Out of scope**

- **Care profiles in-app only** — printable care sheets and PDF export confirmed out of scope
