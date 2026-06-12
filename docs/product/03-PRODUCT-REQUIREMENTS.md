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

| Doc                                              | Use when                                                 |
| ------------------------------------------------ | -------------------------------------------------------- |
| [01-PRODUCT-OVERVIEW.md](01-PRODUCT-OVERVIEW.md) | Problem, vision, users, success criteria, out of scope   |
| [02-ROADMAP.md](02-ROADMAP.md)                   | Build order and milestone "done when"                    |
| [04-OOUX-OBJECT-MAP.md](04-OOUX-OBJECT-MAP.md)   | Full product concept model — field-level source of truth |
| [Z-DISCOVERY.md](Z-DISCOVERY.md)                 | Tracing where a requirement came from                    |

**Success.** A feature is complete when it satisfies the requirements in this doc for its milestone and meets the [success criteria in the Product Overview](01-PRODUCT-OVERVIEW.md#success-criteria).

---

## 1. Dogs and families

_Milestone: [M1 — Dogs and families](02-ROADMAP.md#m1--dogs-and-families)_

Dogs are the central care entity — each dog has a full care profile. Dogs are grouped into **families** (client households), one family per household.

**Concept model:** [04-OOUX-OBJECT-MAP.md](04-OOUX-OBJECT-MAP.md) — dogs, families, bookings, statements, access, and M4 workflow objects (see overview below)

![Dog profile concept model](dog-profile-overview.svg)

### 1.1 Dog profiles

Each dog has a full care profile at launch. **Identity, Routine, Behaviour, Health, and Security are section groupings** — they organize information on the profile; they are not separate objects the dog owns.

| Area          | Requirement                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**  | Captures enough basic information for the petsitter to understand who the dog is and what general care expectations apply, including name, breed, gender, size, age/DOB, energy level, vaccination status, neutered status, house-training, and insurance. Fixed scales for gender, size, and energy — see [OOUX — Identity](04-OOUX-OBJECT-MAP.md#identity). |
| **Routine**   | Documents the dog's daily care routine so feeding, bathroom breaks, treats, and exercise can stay consistent during stays.                                                                                                                                                                                                                                    |
| **Behaviour** | Describes the dog's temperament, likes, struggles, known commands, and care notes that help the petsitter avoid stress or unsafe situations.                                                                                                                                                                                                                  |
| **Health**    | Records health information needed for safe care and emergency readiness, including conditions, trauma history, veterinarian details, medication instructions, and **emergency contact** (name and phone) stored on each dog.                                                                                                                                  |
| **Security**  | Documents microchip and tracker information, including any owner GPS tracker and consent for the petsitter to attach her own tracker during stays.                                                                                                                                                                                                            |

### 1.2 Families

A **family** groups the dogs under one household — one bill, one owner account.

A family has one or more dogs. Each dog has its own **emergency contact**; the family profile shortcut pre-fills or bulk-updates it — see [Emergency contact](#emergency-contact-related-object) in the [concept model](04-OOUX-OBJECT-MAP.md#emergency-contact-related-object).

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

**Concept model:** [Owner account](04-OOUX-OBJECT-MAP.md#owner-account-related-object), [Portal invite](04-OOUX-OBJECT-MAP.md#portal-invite-related-object), [Intake link](04-OOUX-OBJECT-MAP.md#intake-link-related-object)

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

| Trigger                   | Email                           | Recipient           |
| ------------------------- | ------------------------------- | ------------------- |
| Owner account invite sent | Invitation to create an account | Owner               |
| Dog intake form link sent | Invitation to submit a dog      | Owner               |
| Dog intake form submitted | Dog created confirmation        | Owner and Petsitter |

**Other owner emails (by milestone):**

| Milestone | Emails                                                                                                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M3**    | Manually triggered [statement emails](#435-statement) ([§6.4](#64-statements))                                                                                                                                 |
| **M4**    | Booking [confirmation](#431-booking-confirmation), [update](#432-booking-update), [cancellation](#433-booking-cancellation), and [day-before reminder](#434-day-before-reminder) ([§4](#4-calendar-and-email)) |
| **M4**    | Automated end-of-month statement drafts for **`Monthly`** families only — petsitter approves before send ([§6.1](#61-billing-mode))                                                                            |

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

`Upcoming` → `Ongoing` → `Completed`

Also: `Cancelled`

Transitions are **manual**, triggered by the petsitter:

| Transition          | Trigger                | Records                   |
| ------------------- | ---------------------- | ------------------------- |
| Upcoming → Ongoing  | "Start booking" button | Actual drop-off timestamp |
| Ongoing → Completed | "End booking" button   | Actual pick-up timestamp  |

**Acceptance criteria**

**AC-3.4.1 — Start booking**

- **Given** A booking is `Upcoming`
- **When** Petsitter taps "Start booking"
- **Then**
  - Status becomes `Ongoing`
  - Actual drop-off timestamp is recorded

**AC-3.4.2 — Complete booking**

- **Given** A booking is `Ongoing`
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
- **Chargeable defaults to true** when cancelling; petsitter may mark the booking **not chargeable** to exclude it from statements _(M3)_ — see [OOUX — Booking](04-OOUX-OBJECT-MAP.md#booking-related-object)
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

- **Given** A booking is `Upcoming`, `Ongoing` or `Completed`
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
- **When** Petsitter cancels the booking as not chargeable and resends the statement it was on
- **Then** The cancelled booking is excluded and the statement total reflects the change

**AC-3.5.3 — Cancellation charge decision**

_Default chargeable_

- **Given** Petsitter is cancelling a booking
- **When** Petsitter confirms cancel without marking not chargeable
- **Then** The chargeable flag is stored as true on the booking

_Not chargeable_

- **Given** Petsitter is cancelling a booking
- **When** Petsitter marks the booking as not chargeable and confirms cancel
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
- Price is calculated from rates and discount ([§6.2](#62-rates)) — not entered directly; see [OOUX — Price](04-OOUX-OBJECT-MAP.md#booking-related-object)

- All bookings are shown (upcoming and past)
- Upcoming bookings are shown expanded; past bookings are collapsed by default
- Owners see the same section on the dog's profile in their portal, and bookings are also visible on their dashboard

## 4. Calendar and email

_Milestone: [M4 — Workflow automation](02-ROADMAP.md#m4--workflow-automation)_

Automates **petsitter calendar sync** and **owner emails** in response to booking events. Access and intake emails are defined in [§2.3](#23-invite-flow).

### 4.1 Automation overview

| Trigger             | Petsitter calendar | Owner email                                                 | Timing                                                            |
| ------------------- | ------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| Booking created     | Create event       | [Confirmation](#431-booking-confirmation)                   | On save                                                           |
| Booking updated     | Update event       | [Update notification](#432-booking-update)                  | On change of date or time                                         |
| Booking cancelled   | Remove event       | [Cancellation](#433-booking-cancellation)                   | On cancel                                                         |
| Day before drop-off | —                  | [Reminder](#434-day-before-reminder)                        | Morning of the day before drop-off, **if enabled on the booking** |
| End of month        | —                  | [Statement](#435-statement) draft (`Monthly` families only) | Month end — email sent only after petsitter **Approve**           |

### 4.2 Petsitter calendar sync

Syncs booking events to the petsitter's Google Calendar — create, update, and remove per the automation overview above. See [OOUX — Calendar event](04-OOUX-OBJECT-MAP.md#calendar-event-related-object).

- Event spans drop-off to pick-up
- Event title: `🐶 {dog name}: {service type}`

### 4.3 Owner emails

All owner emails go to the family email on file. Content specs below. Send records: [OOUX — Email](04-OOUX-OBJECT-MAP.md#email-related-object).

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
- **Statement period** — **Start date** through **End date** on the statement ([§6.3.1](#631-statement-form--two-input-modes))
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
- **Statement history** — statement period (Start → End), date sent, total due
- Bookings show **payment status** (unpaid / paid)

Statements may also arrive by email — see [statement email](#435-statement).

## 6. Statements

_Milestones: [M3 — Statements](02-ROADMAP.md#m3--statements), [M4 — Workflow automation](02-ROADMAP.md#m4--workflow-automation)_

**Statements** — an email listing what a family owes for one or more bookings. Payment is tracked **per booking**, not on a formal invoice document. Owner visibility: [§5.5](#55-statements-m3). Chargeable cancellations: [§3.5](#35-edit-and-cancel).

How and when statements are sent depends on the family's **billing mode**.

### 6.1 Billing mode

Each family has a **`Billing mode`** (default `Per booking`).

| Billing mode    | How statements are sent                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monthly**     | **One-off statements** anytime via the statement form ([§6.4](#64-statements)). **M4:** automated month-end **draft** — petsitter approves to send ([§6.1](#61-billing-mode)). |
| **Per booking** | **One-off statements** anytime via the statement form. Post-stay prompt opens the form ([§6.1.2](#612-per-booking-prompt)).                                                    |

**M3 — one-off statements** _(both billing modes)_

- At any point, petsitter can create and send a statement manually ([§6.4](#64-statements))
- Owners view payment status and statement history in the portal

**M4 — automated drafts** _(`Monthly` families only — builds on M3)_

- At end of each month, the system generates a **draft statement** per **`Monthly`** family with eligible unpaid bookings ( **Start** = 1st of that month, **End** = last day of that month)
- Petsitter reviews the draft, may adjust it using either input mode on the statement form ([§6.3.1](#631-statement-form--two-input-modes)), and clicks **Approve** to send the statement email ([§4.3.5](#435-statement))
- Nothing is emailed until the petsitter approves

#### 6.1.2 Per booking prompt

For families with `Billing mode = Per booking`, the app prompts the petsitter when a booking becomes chargeable:

- **Complete booking** — petsitter taps "End booking" ([§3.4](#34-booking-lifecycle))
- **Chargeable cancellation** — petsitter cancels a booking (chargeable by default; not chargeable only if petsitter opts out — [§3.5](#35-edit-and-cancel))

**Prompt options:**

| Option                   | Effect                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Do nothing**           | Booking stays unpaid and unstated. Petsitter can send a statement later from the family or booking view.                                   |
| **Charge this booking**  | Opens the [statement form](#64-statements) with the triggering booking **bulk-selected**; **Start**/**End** calculated from that selection |
| **Charge running total** | Opens the statement form with **all** unpaid eligible bookings **bulk-selected**; **Start**/**End** calculated from that selection         |

**Acceptance criteria**

**AC-6.1.1 — Per booking prompt on complete**

- **Given** A family's `Billing mode` is `Per booking` and a booking becomes `Completed`
- **When** Petsitter taps "End booking"
- **Then** The per-booking prompt is shown with all three options

**AC-6.1.2 — No prompt for Monthly**

- **Given** A family's `Billing mode` is `Monthly` and a booking becomes `Completed`
- **When** Petsitter taps "End booking"
- **Then** The per-booking prompt is not shown

**AC-6.1.3 — Charge this booking**

- **Given** Petsitter chooses "Charge this booking" after a booking with scheduled drop-off 15 Jan and pick-up 16 Jan becomes eligible
- **When** The statement form opens
- **Then** Only that booking is selected, **Start** is 15 Jan, and **End** is 16 Jan

**AC-6.1.4 — Charge running total**

- **Given** A family has three unpaid eligible bookings (drop-off 1 Jan / pick-up 1 Jan, 8 Jan / 9 Jan, 15 Jan / 16 Jan)
- **When** Petsitter chooses "Charge running total"
- **Then** All three are bulk-selected, **Start** is 1 Jan, and **End** is 16 Jan

**AC-6.1.5 — Running total includes prior unpaid bookings**

- **Given** The 1 Jan booking is on a sent statement but still unpaid, and the 8 Jan and 15 Jan bookings are also unpaid and eligible
- **When** Petsitter completes the 15 Jan booking and chooses "Charge running total"
- **Then** All three bookings are bulk-selected on the statement form

**AC-6.1.6 — M4 draft skips Per booking families**

- **Given** A family has `Billing mode = Per booking` and unpaid eligible bookings at month end
- **When** M4 end-of-month automation runs
- **Then** No statement draft is created for that family

**AC-6.1.7 — M4 draft requires approval**

- **Given** A **`Monthly`** family has a draft statement at month end
- **When** The petsitter has not clicked **Approve**
- **Then** No statement email is sent to the owner

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
| `Ongoing`                   | Yes       |
| `Cancelled`, chargeable     | Yes       |
| `Cancelled`, not chargeable | No        |
| `Upcoming`                  | No        |

Only **unpaid** bookings are included. Paid bookings are never on a new statement.

#### 6.3.1 Statement form — two input modes

The statement form is the same for **all families** (both billing modes). Petsitter composes a one-off statement using **either** input mode (or both — they stay in sync):

| Mode            | Petsitter action                                                            | Result                                                                                                                                |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Date range**  | Set **Start date** and **End date**                                         | All unpaid eligible bookings whose scheduled drop-off falls within Start–End (inclusive) are **included**                             |
| **Bulk select** | Check bookings from the list of all unpaid eligible bookings for the family | **Start** and **End** are **calculated from the selection**: earliest selected scheduled drop-off → latest selected scheduled pick-up |

**Defaults** when the form opens (no prior selection):

| Field          | Default                                                                            |
| -------------- | ---------------------------------------------------------------------------------- |
| **Start date** | Earliest scheduled **drop-off date** among unpaid eligible bookings for the family |
| **End date**   | Today (current calendar day)                                                       |

All bookings matching the current Start–End are selected. Petsitter may switch modes at any time — changing dates updates the selection; changing the selection updates the dates.

**Eligible booking** — per [§6.3](#63-which-bookings-go-on-a-statement): unpaid; `Completed`, `Ongoing`, or chargeable `Cancelled`; not `Upcoming`.

**On send** — when petsitter clicks **Send statement** or **Approve**, **Start** and **End** update to match the included bookings: earliest scheduled drop-off → latest scheduled pick-up. The sent statement period (portal and email) uses these dates.

**Send** requires at least one included booking. See [§6.4](#64-statements).

Shared rules:

- **Full stay per inclusion** — each included booking is billed for the **full stay** (all days/nights per rate rules). Bookings are not split across calendar months (e.g. drop-off 28 Jan, pick-up 2 Feb → all 5 boarding nights)
- **Open tab** — while **unpaid**, a booking may appear on multiple statements

**Acceptance criteria**

**AC-6.3.1 — Form defaults (date range)**

- **Given** A family has unpaid eligible bookings with earliest scheduled drop-off 8 Jan and today is 20 Jan
- **When** Petsitter opens the statement form
- **Then** **Start** is 8 Jan, **End** is 20 Jan, and all matching bookings are selected

**AC-6.3.2 — Date range selects bookings**

- **Given** Unpaid eligible bookings with drop-off 5 Jan and 15 Jan, and today is 31 Jan
- **When** Petsitter sets **Start** 1 Jan and **End** 10 Jan
- **Then** Only the 5 Jan booking is selected

**AC-6.3.3 — Bulk select calculates dates**

- **Given** Unpaid eligible bookings with drop-off 1 Jan / pick-up 1 Jan, 8 Jan / 9 Jan, and 15 Jan / 16 Jan
- **When** Petsitter bulk-selects all three
- **Then** **Start** is 1 Jan and **End** is 16 Jan

**AC-6.3.4 — Bulk select one booking**

- **Given** An unpaid eligible booking with drop-off 15 Jan and pick-up 16 Jan
- **When** Petsitter bulk-selects only that booking
- **Then** **Start** is 15 Jan and **End** is 16 Jan

**AC-6.3.5 — Ongoing cross-month stay**

- **Given** An unpaid `Ongoing` boarding booking with drop-off 28 Jan and pick-up 2 Feb, selected via **Start** 1 Jan and **End** 31 Jan
- **When** Petsitter sends the statement
- **Then** The booking is included for all 5 nights (not split to February)

**AC-6.3.6 — Not chargeable cancellation excluded**

- **Given** A not-chargeable `Cancelled` booking with scheduled drop-off 10 Jan
- **When** Petsitter sets **Start** 1 Jan and **End** 31 Jan
- **Then** The booking is not in the list and cannot be selected

**AC-6.3.7 — Send updates Start and End to booking span**

- **Given** Petsitter composes a statement with **Start** 1 Jan and **End** 20 Jan (today) and one included booking with scheduled drop-off 15 Jan and pick-up 18 Jan
- **When** Petsitter clicks **Send statement**
- **Then** The sent statement has **Start** 15 Jan and **End** 18 Jan

**AC-6.3.8 — Send updates span for multiple bookings**

- **Given** Petsitter bulk-selects two included bookings: drop-off 5 Jan / pick-up 6 Jan, and drop-off 15 Jan / pick-up 18 Jan
- **When** Petsitter clicks **Send statement**
- **Then** The sent statement has **Start** 5 Jan and **End** 18 Jan

### 6.4 Statements

A **statement** records that the petsitter emailed a family about a set of bookings. It is not a formal invoice document — it groups bookings and snapshots the total sent.

| Field            | Definition                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Family           | Client household                                                                                      |
| Status           | `draft` or `sent`                                                                                     |
| Start date       | While composing: from date range or bulk selection. **On send:** earliest included scheduled drop-off |
| End date         | While composing: from date range or bulk selection. **On send:** latest included scheduled pick-up    |
| Statement period | Start → End on the sent statement (shown in portal and email)                                         |
| Bookings         | Unpaid eligible bookings included when sent                                                           |
| Total due        | Sum of included booking totals at send time                                                           |
| Sent at          | When the statement email was sent                                                                     |

**Send statement** — one-off (M3, or M4 after approval):

1. Petsitter opens the statement form for a family (or from a per-booking prompt — [§6.1.2](#612-per-booking-prompt))
2. Petsitter composes the statement using **date range** and/or **bulk select** ([§6.3.1](#631-statement-form--two-input-modes))
3. Petsitter clicks **Send statement** → **Start** and **End** update to the included bookings' date span → email sent → statement created
4. Included bookings are linked to the statement

**M4 month-end draft (`Monthly` families only):**

1. System creates a **draft** per **`Monthly`** family: **Start** = 1st of the month, **End** = last day of the month; all matching unpaid eligible bookings selected
2. Petsitter reviews the draft, may adjust via either input mode
3. Petsitter clicks **Approve** → statement email sent (same as step 3 above)

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

**AC-6.4.3 — Approve M4 draft sends email**

- **Given** A **`Monthly`** family has a month-end draft statement
- **When** Petsitter clicks **Approve**
- **Then** The statement email is sent and the statement appears in history

**AC-6.4.4 — Resend creates new statement**

- **Given** A statement was already sent for a family
- **When** Petsitter composes and sends again with adjusted bookings or dates
- **Then** A new statement email is sent with updated totals and period

**AC-6.4.5 — Statement period matches Start and End**

- **Given** A statement is sent with **Start** 1 Jan and **End** 16 Jan
- **When** The owner views the statement email or history
- **Then** The statement period shown is 1 Jan through 16 Jan

### 6.5 Payment

- Families pay **outside the app**
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
- Remove a booking that should not count by **cancelling** it ([§3.5](#35-edit-and-cancel)) — chargeable by default; mark not chargeable to exclude
- **Resend the statement** to email the owner updated totals — reopen the form (same or adjusted **Start**/**End**) or resend from statement history
- No void/reissue workflow — statements are send records, not editable documents

## 7. Out of scope (v1)

See [01-PRODUCT-OVERVIEW.md — Out of scope](01-PRODUCT-OVERVIEW.md#out-of-scope).

---

## Changelog

### 2026-06-12

**Statements and billing**

- **Billing mode** — `Monthly` or `Per booking` per family (default `Per booking`). `Monthly` families use calendar-month statements and M4 end-of-month drafts; `Per booking` families get a post-stay prompt (do nothing / charge this booking / charge running total)
- **Statement model** — no invoice entity; statements group bookings and trigger statement emails; payment tracked per booking
- **Statement month = drop-off month** — **`Monthly` families only**; whole booking on one statement; no cross-month split; `Ongoing` and `Completed` both eligible. Not stored or shown for **`Per booking`** families. _Superseded — see Statement period._
- **Statement period** — earliest included scheduled drop-off date through latest included scheduled pick-up date; shown on every statement (both billing modes)
- **Send updates statement period** — on send, **Start** and **End** snap to earliest included drop-off and latest included pick-up across included bookings (AC-6.3.7, AC-6.3.8)
- **Running total = open tab** — includes all unpaid eligible bookings for the family, even if already on a prior sent statement; bookings may appear on multiple statements while unpaid
- **Unified terminology** — "Statement" everywhere (no separate "billing" label)

**Bookings**

- **Cancel** — petsitter can cancel any booking at any point (`Upcoming`, `Ongoing`, or `Completed`, paid or unpaid); chargeable by default, opt out on cancel; prepaid cancelled as not chargeable keeps `paid` status — refunds outside the app (no `refunded` status in v1)
- **Status renamed** — `In progress` → `Ongoing` (single-word booking status)
- **Day-before reminder opt-in** — petsitter enables per booking (default off); sent morning of day before drop-off when enabled

**Access and email**

- **Intake and portal invites** — **Send invite** (email) and **Copy link** actions for intake form and owner account invites ([§1.4](#14-dog-intake-form), [§2.3](#23-invite-flow))
- **Booking update email** — changed fields shown as before → after; service type and booking total included when affected ([§4.3.2](#432-booking-update))

**Out of scope**

- **Care profiles in-app only** — printable care sheets and PDF export confirmed out of scope
