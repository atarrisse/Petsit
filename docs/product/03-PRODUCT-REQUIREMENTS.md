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

**Emergency contact shortcut:** Emergency contact is stored on each dog (§1.1). The family profile also offers a shortcut: when the petsitter sets emergency contact there, it **pre-fills** new dogs and **bulk-updates** all existing dogs in the family.

| Field   | Definition                                                      |
| ------- | --------------------------------------------------------------- |
| Name    | The household or client name                                    |
| Email   | Primary contact; used for portal invites and statement delivery |
| Phone   | Contact number                                                  |
| Address | Home address                                                    |

**Acceptance criteria**

**AC-1.2.1 — Emergency contact bulk-update**

- **Given** A family has one or more existing dogs
- **When** Petsitter sets emergency contact on the family profile
- **Then** Emergency contact on every dog in that family is updated to match

**AC-1.2.2 — Emergency contact pre-fill**

- **Given** Emergency contact is set on the family profile
- **When** Petsitter creates a new dog in that family (direct creation or after intake)
- **Then** The new dog's emergency contact is pre-filled from the family shortcut

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

- Generated by petsitter from the family profile — pre-associated with that family, no extra fields needed
- Can be sent automatically via email or copied and shared manually
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
- **Then** Owner receives an invitation email containing a valid intake link (see §2.3)

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
  - The petsitter receives a dog-created confirmation email (see §2.3)

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

Same auth system for petsitter and owners; **role** determines access. User context: [01-PRODUCT-OVERVIEW.md § Users](01-PRODUCT-OVERVIEW.md#users).

|            | Petsitter    | Owner     |
| ---------- | ------------ | --------- |
| **Access** | Full control | Read-only |

Feature-specific behavior (e.g. dog list scope in §1.3) applies these roles per screen.

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
- Petsitter can **re-invite** at any time (same flow as above); re-invited owner sees all household dogs, including intake-created dogs (§1.4)

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

| Field           | Definition                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dog(s)          | One or more dogs from the **same family**                                                                                                          |
| Drop-off        | Date and time owner **leaves** the dog — **start of stay**                                                                                         |
| Pick-up         | Date and time owner **collects** the dog — **end of stay**                                                                                         |
| Discount        | Optional. Percentage or fixed amount applied to the **whole booking total** after line items (§6.2); use for multi-dog or special-rate adjustments |
| Actual drop-off | Timestamp when petsitter marks the stay as started — recorded via "Start booking" button                                                           |
| Actual pick-up  | Timestamp when petsitter marks the stay as completed — recorded via "End booking" button                                                           |

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

- Petsitter can cancel a booking while it is **`Upcoming` or `In progress`**
- Calendar event is removed _(M4)_
- Petsitter chooses whether to charge the cancelled booking; that choice is stored on the booking and used automatically on statements _(M3)_

**`Completed` bookings cannot be cancelled**

- Once a booking is **`Completed`**, cancellation is blocked — correct errors by editing the booking and resending the statement (§6.6)

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

- **Given** A booking is `Upcoming` or `In progress`
- **When** Petsitter cancels the booking
- **Then** Status becomes `Cancelled`

**AC-3.5.4 — Cannot cancel completed booking**

- **Given** A booking is `Completed`
- **When** Petsitter attempts to cancel the booking
- **Then** Cancellation is blocked

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

Automates **petsitter calendar sync** and **owner emails** in response to booking events. Access and intake emails are defined in §2.3.

### 4.1 Automation overview

| Trigger             | Petsitter calendar | Owner email                  | Timing                               |
| ------------------- | ------------------ | ---------------------------- | ------------------------------------ |
| Booking created     | Create event       | Confirmation (§4.3.1)        | Immediately on save                  |
| Booking updated     | Update event       | Update notification (§4.3.2) | On change to dates, times, or status |
| Booking cancelled   | Remove event       | Cancellation (§4.3.3)        | On cancel                            |
| Day before drop-off | —                  | Reminder (§4.3.4)            | Morning of the day before drop-off   |
| End of month        | —                  | Statement (§6.1)             | After petsitter review and approval  |

### 4.2 Petsitter calendar sync

Syncs booking events to the petsitter's Google Calendar. Actions follow §4.1 (create, update, remove).

- Event spans drop-off to pick-up
- Event title: `🐶 {dog name}: {service type}`

### 4.3 Owner emails

All owner emails go to the family email on file. Content specs below.

#### 4.3.1 Booking confirmation

_Sent on booking creation (see §4.1)._

- Booking details
- Add-to-calendar link — title: `🐶 {dog name}: {service type} with {petsitter}`; independent of the petsitter's calendar
- `.ics` attachment for owners not using Google Calendar

#### 4.3.2 Booking update

_Sent when dates, times, or status change (see §4.1)._

- Updated booking details

#### 4.3.3 Booking cancellation

_Sent on cancel (see §4.1)._

- Cancellation notice with booking details

#### 4.3.4 Day-before reminder

_Sent the morning of the day before drop-off (see §4.1)._

- Agreed drop-off and pick-up times
- Items to bring — determined by a two-level model:

| Level                    | Description                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Baseline per service** | Default items list for day care or boarding; petsitter configures once in app settings                                  |
| **Per-dog override**     | Additional or replacement items for a specific dog (e.g. crate, specific food brand); petsitter sets on the dog profile |

The reminder uses the per-dog override if one exists; otherwise falls back to the baseline for that service type.

- Per-dog overrides are **petsitter-only** — not collected on the owner intake form (§1.4)

#### 4.3.5 Statement

_Sent when the petsitter sends a statement (§6.4) or approves an M4 draft (§6.1)._

- Dog name
- Statement month
- Itemised list of included bookings — separate line per dog per booking,
- Discount if set (§6.4)
- **Total due** for all bookings on the statement

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
- **Then** The booking remains fully editable, cancellable (while `Upcoming` or `In progress`), and eligible for statements by the petsitter

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

Read-only access for dog owners to their family's data. Rolled out incrementally across [M1](02-ROADMAP.md#m1--dogs-and-families), [M2](02-ROADMAP.md#m2--bookings), and [M3](02-ROADMAP.md#m3--statements). Access model: §2.2. Invites: §2.3.

### 5.1 Portal overview

| Milestone | Available in portal | Detail |
| --------- | ------------------- | ------ |
| **M1**    | Dogs                | §5.3   |
| **M2**    | Bookings            | §5.4   |
| **M3**    | Statements          | §5.5   |

### 5.2 Access and constraints

Owners have **read-only** access — they can view data but cannot take any action in the app.

| Constraint      | Rule                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| **Scope**       | One account per family; sees all dogs in that household (§2.1)             |
| **Permissions** | Read-only — no create, edit, or request actions (§2.2)                     |
| **Bookings**    | Cannot create or request bookings (§3.1)                                   |
| **Profiles**    | Cannot edit dog profiles — including dogs submitted via intake form (§1.4) |

### 5.3 Dogs _(M1)_

_Available from [M1](02-ROADMAP.md#m1--dogs-and-families)._

**Dashboard**

- Dog list for the household (scope, search, and sort per §1.3)

**Dog profile**

- Full care profile — read-only (sections per §1.1)

### 5.4 Bookings _(M2)_

_Available from [M2](02-ROADMAP.md#m2--bookings)._

**Dashboard**

- Bookings for the household — all bookings (upcoming and past)
- Sorted by scheduled drop-off date, soonest first
- Upcoming bookings expanded by default; past bookings collapsed by default (same rules as §3.6)

**Dog profile**

- Bookings section — same fields and display rules as petsitter view (§3.6)

### 5.5 Statements _(M3)_

_Available from [M3](02-ROADMAP.md#m3--statements)._

**Dashboard**

- **Outstanding balance** — total of all unpaid bookings for the household
- **Current month** _(optional breakdown)_ — three figures:
  - **Running total** — unpaid eligible bookings (§6.3) whose scheduled drop-off falls in the current calendar month
  - **Forecast total** — upcoming bookings whose scheduled drop-off falls in the current calendar month (full stay amount)
  - **Estimated total** — running + forecast
- **Statement history** — sent statements (statement month, date sent, total due)
- Bookings show **payment status** (unpaid / paid)

Statements may also arrive by email _(M4 automated send, or M3 manual send)_ — see §4.3.5 and §6.1.

## 6. Statements

_Milestones: [M3 — Statements](02-ROADMAP.md#m3--statements), [M4 — Workflow automation](02-ROADMAP.md#m4--workflow-automation)_

Monthly **statements** — an email listing what a family owes for a statement month. Payment is tracked **per booking**, not on a formal invoice document. Owner visibility: §5.5. Cancellation chargeability: §3.5.

### 6.1 Schedule

**M3 — manual statements**

- Petsitter sends statements manually (§6.4)
- Owners view payment status and statement history in the portal (§5.5)

**M4 — automated statements** _(builds on M3)_

- System drafts a statement automatically at end of each month (one per family with eligible bookings)
- Petsitter reviews and approves before the statement email is sent
- Approved statement is emailed to the owner (§4.3.5), in addition to portal visibility

### 6.2 Rates

Each booking is priced per dog and service type. Petsitter sets a **global default** for each service; **per-dog overrides** on the dog profile replace the global rate for specific dogs (including legacy or special rates — no separate tenure feature).

**Rate precedence (per dog):** per-dog override → global default

**Booking-level adjustments** (set at booking create/edit, §3.2):

- **Discount** — optional; percentage or fixed amount; applied to the **whole booking total** after line items are summed (including multi-dog bookings). Use a fixed discount to reach an agreed total for multiple dogs or special rates.

**Service types**

| Service  | Unit                                                                              |
| -------- | --------------------------------------------------------------------------------- |
| Day care | Per dog (full-day only)                                                           |
| Boarding | Per night, per dog — one overnight between drop-off and pick-up dates = one night |

Pricing uses **dates only** — times are not used for price calculation. Actual drop-off/pick-up timestamps (§3.2) are operational records only. Which statement a booking appears on: §6.3.1.

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

Which bookings are eligible when sending a statement (rules: §6.3.1):

| Booking status              | Included? |
| --------------------------- | --------- |
| `Completed`                 | Yes       |
| `In progress`               | Yes       |
| `Cancelled`, chargeable     | Yes       |
| `Cancelled`, not chargeable | No        |
| `Upcoming`                  | No        |

Only **unpaid** bookings are included. Paid bookings are never on a new statement.

#### 6.3.1 Statement month rules

- **Statement month** — the calendar month of **scheduled drop-off** (when the stay starts)
- **One statement per family per statement month** — at most one statement per family for a given statement month; sending again **resends** the same statement (updated totals if bookings changed)
- **One statement per booking** — each booking appears on at most one statement: the drop-off month's statement, for the **full stay** (all days/nights per §6.2). Bookings are not split across calendar months — cross-month stays are billed in full on drop-off month (e.g. drop-off 28 Jan, pick-up 2 Feb → all 5 boarding nights on January's statement)
- **`Completed` and `In progress` bookings** — included when the petsitter sends the drop-off month's statement
- **`Upcoming`** — never on a statement
- **Chargeable cancellations** — included for the month of their scheduled drop-off date, at the full booking amount

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

| Field           | Definition                                         |
| --------------- | -------------------------------------------------- |
| Family          | Client household                                   |
| Statement month | Calendar month of scheduled drop-off (§6.3.1)      |
| Bookings        | Unpaid eligible bookings included when sent (§6.3) |
| Total due       | Sum of included booking totals at send time        |
| Sent at         | When the statement email was sent                  |

**Send statement** (manual — M3, or approve draft — M4):

1. Petsitter selects a family and statement month (defaults to current month)
2. App lists eligible unpaid bookings (§6.3)
3. Petsitter clicks **Send statement** → email sent (§4.3.5) → statement created or updated (resend)
4. Included bookings are linked to the statement

**Statement email content** (§4.3.5):

- Itemised per booking
- **Separate line per dog** — each line shows the dog's rate for the full stay (§6.2)
- **Discount** — if the booking has a discount (§6.2), one discount line per booking after dog line items
- **Total due** for all bookings on the statement

**Acceptance criteria**

**AC-6.4.1 — Separate line per dog**

- **Given** A statement includes a booking with multiple dogs
- **When** The statement email is sent
- **Then** Each dog has its own line item for that booking

**AC-6.4.2 — Booking discount on statement**

- **Given** A booking has a discount applied after line items
- **When** The statement email is sent
- **Then** The email shows one discount line for that booking reflecting the agreed reduction

**AC-6.4.3 — One statement per family per month**

- **Given** A statement was already sent for Smith family for January 2026
- **When** Petsitter sends the January statement again
- **Then** The same statement is updated and the email is resent (bookings and total reflect current data)

### 6.5 Payment

- Families pay **outside the app** (e.g. bank transfer)
- Each booking has **payment status**: `unpaid` or `paid`
- Petsitter marks bookings **paid** individually, or **marks all bookings on a statement paid** in one action
- In-app payment processing: out of scope

**Acceptance criteria**

**AC-6.5.1 — Mark booking paid**

- **Given** An unpaid booking exists
- **When** Petsitter marks it as paid
- **Then** The booking shows as paid in the app and in the owner portal (§5.5)

**AC-6.5.2 — Mark all on statement paid**

- **Given** A statement has multiple unpaid bookings
- **When** Petsitter marks all bookings on that statement as paid
- **Then** Every included booking shows as paid in the app and in the owner portal

### 6.6 Corrections

- Fix incorrect amounts by **editing the booking** (allowed until the booking is paid)
- **Resend the statement** for that statement month to email the owner updated totals (§6.4)
- No void/reissue workflow — statements are send records, not editable documents

## 7. Out of scope (v1)

See [01-PRODUCT-OVERVIEW.md § Out of scope](01-PRODUCT-OVERVIEW.md).

---

## Changelog

### 2026-06-12

- **Statement model** — no invoice entity; statements group bookings and trigger statement emails; payment tracked per booking
- **Statement month = drop-off month** — whole booking on drop-off month's statement; no cross-month split; `In progress` and `Completed` both eligible
- **Unified terminology** — "Statement" everywhere (no separate "billing" label)
- **Cancel by status** — bookings cancellable while `Upcoming` or `In progress` only; `Completed` bookings cannot be cancelled
- **Care profiles in-app only** — printable care sheets and PDF export confirmed out of scope
