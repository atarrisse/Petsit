# Concept model — Dog profile

|                  |              |
| ---------------- | ------------ |
| **Owner**        | Ana Tarrisse |
| **Status**       | Needs review |
| **Last updated** | 2026-06-12   |

_Owner has not yet validated this model against the PRD._

**Parent docs:** [§1 — Dogs and families](03-PRODUCT-REQUIREMENTS.md#1-dogs-and-families) · [01-PRODUCT-OVERVIEW.md](01-PRODUCT-OVERVIEW.md)

A **concept model** shows the objects in the product and how they relate. It is not a database schema — it describes what information exists before implementation decisions.

---

## Overview

![Dog profile concept model — overview](dog-profile-overview.svg)

_Source: [`dog-profile-overview.mmd`](dog-profile-overview.mmd) — re-export with `npx @mermaid-js/mermaid-cli -i dog-profile-overview.mmd -o dog-profile-overview.svg`_

---

## Entity relationships

Only **true objects** and **repeatable records** appear here. Profile sections are groupings (see overview), not entities in their own right.

![Entity relationship diagram](ooux-diagram.svg)

_Source: [`ooux-diagram.mmd`](ooux-diagram.mmd)_

| Symbol      | Meaning                                                             |
| ----------- | ------------------------------------------------------------------- |
| `}o--\|\|`  | Many-to-one (each dog has one family; many dogs can share a family) |
| `\|\|--o{`  | One-to-many (dog has many feeding / bathroom / medication entries)  |
| `}o--o{`    | Many-to-many (booking can include multiple dogs)                    |
| `\|\|--o\|` | Zero or one (optional emergency contact per dog)                    |

---

## Profile section groupings

These are **not separate objects**. They are how care information is organized on a dog's profile (matches [§1.1](03-PRODUCT-REQUIREMENTS.md#11-dog-profiles)).

### Identity

| Field           | Type    |
| --------------- | ------- |
| name            | string  |
| breed           | string  |
| gender          | string  |
| size            | string  |
| date_of_birth   | date    |
| energy          | int     |
| vaccinated      | boolean |
| neutered        | boolean |
| house_trained   | boolean |
| insurance       | boolean |
| contact_details | string  |

### Routine

| Field    | Type       |
| -------- | ---------- |
| treats   | text       |
| exercise | text       |
| feeding  | Feeding[]  |
| bathroom | Bathroom[] |

**Feeding entry** (repeatable record)

| Field         | Type   |
| ------------- | ------ |
| time_kind     | string |
| at_time       | time   |
| between_start | time   |
| between_end   | time   |
| period        | string |

**Bathroom entry** (repeatable record)

| Field     | Type    |
| --------- | ------- |
| time_kind | string  |
| pee       | boolean |
| poo       | boolean |

### Behaviour

| Field     | Type |
| --------- | ---- |
| enjoys    | text |
| struggles | text |
| commands  | text |
| notes     | text |

### Health

| Field        | Type         |
| ------------ | ------------ |
| conditions   | text         |
| trauma       | text         |
| veterinarian | text         |
| medication   | Medication[] |

**Medication** (repeatable record)

| Field    | Type   |
| -------- | ------ |
| name     | string |
| dosage   | string |
| schedule | string |

### Security

| Field           | Type    | Notes                                                                   |
| --------------- | ------- | ----------------------------------------------------------------------- |
| microchipped    | boolean |                                                                         |
| microchip       | string  |                                                                         |
| has_tracker     | boolean | Dog's own GPS tracker                                                   |
| tracker_id      | string  | Dog's own tracker ID                                                    |
| tracker_consent | boolean | Owner agrees petsitter may use **her** tracker on this dog during stays |

### Items to bring (per-dog override)

Optional per service type. Used in [day-before reminder](03-PRODUCT-REQUIREMENTS.md#434-day-before-reminder) emails when set; otherwise falls back to petsitter baseline. **Petsitter-only** — not on owner intake form.

| Field                   | Type | Notes                                        |
| ----------------------- | ---- | -------------------------------------------- |
| items_to_bring_day_care | text | Replaces baseline day care list for this dog |
| items_to_bring_boarding | text | Replaces baseline boarding list for this dog |

### Emergency contact (related object)

Stored on each dog. The [family profile](03-PRODUCT-REQUIREMENTS.md#12-families) offers a **shortcut** to pre-fill new dogs and bulk-update existing dogs.

| Field | Type   |
| ----- | ------ |
| name  | string |
| phone | string |

### Family (related object)

| Field        | Type   | Notes                                                                                                      |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------- |
| name         | string |                                                                                                            |
| email        | string |                                                                                                            |
| phone        | string |                                                                                                            |
| address      | string |                                                                                                            |
| billing_mode | string | `monthly` or `per_booking`; default `per_booking`. See [§6.1](03-PRODUCT-REQUIREMENTS.md#61-billing-mode). |

### Booking (related object)

| Field                    | Type        | Notes                                                                                                                             |
| ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| drop_off                 | datetime    |                                                                                                                                   |
| pick_up                  | datetime    |                                                                                                                                   |
| service_type             | string      |                                                                                                                                   |
| status                   | string      |                                                                                                                                   |
| discount_type            | string      | `percentage` or `fixed` — optional                                                                                                |
| discount_value           | decimal     | Optional                                                                                                                          |
| send_day_before_reminder | boolean     | Default `false`; petsitter opts in per booking — see [§3.2](03-PRODUCT-REQUIREMENTS.md#32-booking-inputs)                         |
| payment_status           | string      | `unpaid` or `paid` — see [§6.5](03-PRODUCT-REQUIREMENTS.md#65-payment)                                                            |
| statements               | Statement[] | Bookings may appear on multiple sent statements while unpaid — see [§6.3.1](03-PRODUCT-REQUIREMENTS.md#631-statement-month-rules) |

### Statement (related object)

Groups bookings included in one statement email to a family for a statement month. Not a formal invoice — a send record with a total snapshot.

| Field           | Type      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| family          | Family    |                                      |
| statement_month | date      | Calendar month of scheduled drop-off |
| total_due       | decimal   | Snapshot at send time                |
| sent_at         | datetime  | When the statement email was sent    |
| bookings        | Booking[] | Unpaid eligible bookings included    |

---

## Petsitter settings

Configured once in app settings. Not part of the dog profile.

| Field                   | Type | Notes                               |
| ----------------------- | ---- | ----------------------------------- |
| items_to_bring_day_care | text | Default list for day care reminders |
| items_to_bring_boarding | text | Default list for boarding reminders |

---

## [§1.1](03-PRODUCT-REQUIREMENTS.md#11-dog-profiles) → structure

| §1.1 section      | In this model                                                              |
| ----------------- | -------------------------------------------------------------------------- |
| Identity          | Fields on `Dog`                                                            |
| Routine           | Section grouping — fields + feeding/bathroom entries                       |
| Behaviour         | Section grouping — fields on profile                                       |
| Health            | Section grouping — fields + medication entries + emergency contact         |
| Security          | Section grouping — fields on profile                                       |
| Emergency contact | Related object on dog; family shortcut on [Family](#family-related-object) |
| Items to bring    | Per-dog override fields; baseline in petsitter settings                    |
