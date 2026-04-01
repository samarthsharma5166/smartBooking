# smart-Booking — Complete System Documentation

## Overview

**smart-Booking** is a full-stack appointment booking system designed for a single doctor (or practitioner). It allows patients to browse available time slots, choose a session type, pay online via PayU, and receive a Google Meet link for their consultation. The doctor gets an admin dashboard to manage availability, view appointments, configure session types, and track stats.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React (TypeScript), Vite, React Router, shadcn/ui |
| Backend | Node.js, Express.js (ESM) |
| Database | MySQL via **Prisma ORM** |
| Auth | JWT stored in HttpOnly cookie |
| Payments | **PayU** payment gateway |
| Calendar | **Google Calendar API** (OAuth 2.0) |
| Email | Nodemailer (SMTP) |
| Jobs | `node-cron` (scheduled tasks) |
| Containerisation | Docker + Docker Compose |

---

## Project Structure

```
smart-Booking/
├── backend/
│   ├── app.js                    # Express app setup, middleware, route mounting
│   ├── index.js                  # Entry point — starts HTTP server
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── controllers/              # Business logic
│   │   ├── doctor.controllers.js
│   │   ├── slot.controller.js
│   │   ├── appointment.controller.js
│   │   ├── payments.controllers.js
│   │   ├── sessionType.controller.js
│   │   ├── stats.controller.js
│   │   └── google.controller.js
│   ├── routes/                   # Route definitions
│   ├── middlewares/              # Auth & error middleware
│   ├── jobs/jobs.js              # Cron jobs for reminders & cleanup
│   ├── utils/                    # Helpers (email, calendar, time, etc.)
│   └── config/                   # PayU and other config
└── frontend/
    └── src/
        ├── App.tsx               # Route definitions
        └── components/
            └── Pages/
                ├── Booking.tsx         # Public booking page
                ├── BookingSuccess.tsx  # Post-payment success page
                ├── Login.tsx           # Admin login (hidden route)
                ├── Appointments.tsx    # Admin: view all appointments
                ├── DoctorAvaliability.tsx # Admin: manage blocks/schedule
                ├── SessionTypes.tsx    # Admin: manage session types
                └── Settings.tsx        # Admin: profile & settings
```

---

## Database Schema (Prisma)

### Models

#### `User`
Represents a patient who books an appointment. Created automatically on first booking — no explicit patient registration required.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Patient's name |
| `email` | String (unique) | Patient's email |
| `phone` | String? | Optional phone |

#### `Doctor`
Represents the practitioner (single-doctor system — `DOCTOR_ID` is set in `.env`).

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Doctor's name |
| `fee` | Int | General consultation fee |
| `email` | String | Doctor's email |
| `minAdvanceMinutes` | Int | Minimum minutes before appointment that a slot can be booked |
| `maxAdvanceDays` | Int | Maximum days ahead a patient can book |
| `password` | String | Bcrypt-hashed password for admin login |
| `accessToken` | String? | Google OAuth access token |
| `refreshToken` | String? | Google OAuth refresh token |

#### `SessionType`
Different consultation types offered by the doctor (e.g., "Initial Consultation", "Follow-up").

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Internal name |
| `title` | String | Display title shown to patients |
| `sub` | String | Subtitle |
| `note` | String | Description note |
| `duration` | Int | Duration in minutes (determines slot size) |
| `fee` | Int | Fee charged for this session type |

#### `Appointment`
The core booking record.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | FK | Reference to `User` |
| `doctorId` | FK | Reference to `Doctor` |
| `sessionTypeId` | FK? | Reference to `SessionType` |
| `date` | DateTime | Date of appointment (midnight UTC) |
| `startTime` | Int | Minutes from midnight (e.g., 570 = 9:30 AM) |
| `endTime` | Int | Minutes from midnight |
| `googleCalendarEventId` | String? | ID of the Google Calendar event created |
| `meetLink` | String? | Google Meet URL for the consultation |
| `status` | Enum | `PENDING`, `CONFIRMED`, `CANCELLED` |

#### `DoctorBlock`
Time ranges the doctor has blocked (unavailable). Created by the doctor via admin dashboard.

| Field | Type | Description |
|---|---|---|
| `date` | DateTime | Date of block |
| `startTime` | Int | Minutes from midnight |
| `endTime` | Int | Minutes from midnight |
| `reason` | String? | Reason (defaults to "BLOCK") |

#### `Payment`
One-to-one with an `Appointment`. Tracks PayU payment transaction.

| Field | Type | Description |
|---|---|---|
| `txnId` | String (unique) | PayU transaction ID |
| `amount` | Int | Amount paid |
| `status` | Enum | `PENDING`, `SUCCESS`, `FAILED` |
| `method` | String? | Payment method (UPI, card, etc.) |

#### `NotificationLog`
Deduplication log to ensure reminder emails are sent only once per appointment per type.

| Field | Type | Description |
|---|---|---|
| `appointmentId` | String | Reference to appointment |
| `type` | Enum | `INSTANT`, `ONE_DAY_BEFORE`, `TWO_HOURS_BEFORE` |

---

## Backend — How It Works

### Entry Point

`index.js` loads `.env` and starts the Express server on `process.env.PORT`.

`app.js` sets up:
- `express.json()` and `express.urlencoded()` for request body parsing
- `cookie-parser` for reading JWT from cookies
- **CORS** — allows requests from `http://localhost:5173`, `http://localhost:4173`, and `https://booking.inspiredliving.in`
- Route mounting under `/api/v1/`
- A global 404 handler and an error middleware

---

### API Routes

| Prefix | Router File | Description |
|---|---|---|
| `/api/v1/doctor` | `doctor.routes.js` | Auth, profile, blocks, Google disconnect |
| `/api/v1/bookings` | `booking.routes.js` | Slot availability, appointment CRUD |
| `/api/v1/session-types` | `sessionType.routes.js` | Session type CRUD |
| `/api/v1/payment` | `payment.routes.js` | PayU initiation & webhook verification |
| `/api/v1/stats` | `stats.routes.js` | Dashboard statistics |
| `/api/v1/google` | `google.routes.js` | Google OAuth connect |

---

### Authentication (`doctor.controllers.js`)

The system only has one type of authenticated user: the **Doctor** (admin).

#### Registration — `POST /api/v1/doctor/register`
1. Validates that `fullName`, `email`, and `password` are provided.
2. Validates the email format using `email-validator`.
3. Checks for duplicate email in the `Doctor` table.
4. Hashes the password with `bcrypt` (salt rounds = 10).
5. Creates the doctor record with default `fee: 100`, `minAdvanceMinutes: 60`, `maxAdvanceDays: 30`.

#### Login — `POST /api/v1/doctor/login`
1. Finds the doctor by email.
2. Compares provided password with the stored bcrypt hash.
3. Signs a **JWT** with `{ id, email, name }` using `JWT_SECRET`.
4. Sets the JWT as an **HttpOnly, Secure cookie** with a 7-day expiry.
5. Returns doctor profile data (password is stripped from response).

#### Protected Routes
The `isLoggedIn` middleware reads the JWT from the cookie, verifies it, and attaches `req.user` before passing to the controller.

#### Other Doctor Endpoints
- `GET /me` — Returns the authenticated doctor's profile.
- `GET /logout` — Clears the token cookie.
- `POST /markBlock` — Creates a `DoctorBlock` record and adds a "BLOCK" event to Google Calendar.
- `PATCH /update` — Updates name, email, fee.
- `PATCH /updatePassword` — Validates current password, hashes and saves new one.
- `PATCH /updateAdvanceSettings` — Updates `minAdvanceMinutes` and `maxAdvanceDays`.
- `PATCH /google/disconnect` — Clears stored Google OAuth tokens for the doctor.

---

### Slot Availability (`slot.controller.js`)

#### `GET /api/v1/bookings/slots?date=YYYY-MM-DD&sessionTypeId=...`

This is the core scheduling logic that powers the public-facing booking page.

**Step-by-step flow:**

1. **Input validation** — Requires `date` and `sessionTypeId`. Rejects past dates.
2. **Fetch session type** — Retrieves the session type to get its `duration` (slot size in minutes).
3. **Generate all possible slots** — `generateSlots(duration)` creates a list of time slots across the full day in increments of `duration` minutes (e.g., for 30 min: 00:00–00:30, 00:30–01:00, …, 23:30–00:00).
4. **Gather all unavailable time ranges from 3 sources:**
   - **Doctor Blocks** — `DoctorBlock` records for that date.
   - **Confirmed Appointments** — Existing `CONFIRMED` appointments for that date.
   - **Google Calendar busy times** — Fetched via Google's freebusy API. Times are converted from UTC to **IST (UTC+5:30)** manually to avoid timezone shift bugs.
5. **Overlap check** — For each generated slot, checks if it overlaps with any unavailable range using the `overlaps()` utility. Marks slots as `isAvailable: true/false`.
6. **Advance booking rules filter:**
   - If the slot is less than `minAdvanceMinutes` away from now → mark unavailable.
   - If the slot is more than `maxAdvanceDays` ahead → mark unavailable.
7. **Returns** the full array of slots with their availability status to the frontend.

#### `GET /api/v1/doctor/blocks?start=...&end=...`
Returns all Google Calendar events (as busy blocks) within a date range. Used by the admin's availability calendar view. Times are converted to IST.

---

### Appointment Booking (`appointment.controller.js`)

#### `POST /api/v1/bookings/appointments`
This is the **free booking flow** (no payment). Used when a doctor wants to book directly without PayU.

1. Accepts `{ date, startTime, endTime, email, name, sessionTypeId }`.
2. **Upserts the User** — Creates a `User` record if one with that email doesn't exist yet.
3. **Database transaction** — Runs inside `prisma.$transaction`:
   - Re-checks for **block conflicts** (double-booking prevention even between the slot selection and confirmation).
   - Re-checks for **appointment conflicts**.
   - Creates the `Appointment` with status `CONFIRMED`.
4. **Google Calendar event** — Creates a Google Calendar event for the appointment with an auto-generated Google Meet link. Times are formatted as IST ISO strings (`2024-01-15T11:10:00+05:30`) to prevent Google from applying an erroneous timezone offset.
5. **Updates appointment** in the database with the `googleCalendarEventId` and `meetLink`.
6. **Sends a confirmation email** to the patient with their Meet link.

#### `GET /api/v1/bookings/appointments`
Returns all `CONFIRMED` appointments including related `sessionType`, `user`, and `payment` data. Used by the admin dashboard.

#### `DELETE /api/v1/bookings/appointments/:id`
Deletes an appointment. If a Google Calendar event was created, it is deleted first. Then the appointment record is removed.

---

### Payment Flow (`payments.controllers.js`)

This is the **paid booking flow** for patients booking via the public page.

#### Step 1 — Initiate Payment: `POST /api/v1/payment`
1. Validates the booking date is not in the past and within `advanceBookingDays`.
2. Upserts the `User` record.
3. Runs a **database transaction** to check for block/booking conflicts and creates the `Appointment` with status `PENDING` (not yet confirmed).
4. Generates a unique `txn_id` (`PAYU_MONEY_` + random number).
5. Builds the **PayU hash** — a SHA-512 HMAC of a pipe-delimited string (`key|txnid|amount|productinfo|firstname|email|udf1-5||salt`).
6. Creates a `Payment` record in the DB with status `PENDING`.
7. Calls the **PayU SDK** (`paymentInitiate`) with success URL (`surl`) pointing back to `/api/v1/payment/verify-payment/:txnid/:appointmentId` and failure URL (`furl`) pointing to the frontend's `/booking-success` page.
8. Returns the PayU payment page HTML/redirect data to the frontend.

#### Step 2 — Verify Payment: `GET /api/v1/payment/verify-payment/:txnid/:appointmentId`
This is PayU's **server-to-server callback** called after the patient completes payment.

1. Calls `PayData.payuClient.verifyPayment(txnid)` to verify from PayU's side.
2. Updates the `Payment` record: status → `SUCCESS` or `FAILED`, method, and error message.
3. Calls `bookAppointment()` utility — creates the Google Calendar event and sends the confirmation email (same as the free booking flow).
4. Redirects the patient's browser to `FRONTEND_URL/booking-success`.

---

### Session Types (`sessionType.controller.js`)

CRUD operations for session types, all scoped to `DOCTOR_ID` from `.env`.

| Method | Endpoint | Action |
|---|---|---|
| POST | `/api/v1/session-types` | Create a new session type |
| GET | `/api/v1/session-types` | List all session types |
| GET | `/api/v1/session-types/:id` | Get one session type |
| PUT | `/api/v1/session-types/:id` | Update a session type |
| DELETE | `/api/v1/session-types/:id` | Delete a session type |

---

### Stats (`stats.controller.js`)

`GET /api/v1/stats` — Returns dashboard stats for the authenticated doctor:
- **Today's appointments** — Count of `CONFIRMED` appointments for today.
- **Blocked today** — Count of `DoctorBlock` records for today.
- **Next appointment** — The next upcoming `CONFIRMED` appointment today (ordered by `startTime`).
- **This week's bookings** — Total `Appointment` count for the current calendar week.

---

### Google Calendar Integration (`utils/googleCalendar.js`)

The doctor connects their Google account via OAuth 2.0 (handled by `google.routes.js`). The `accessToken` and `refreshToken` are stored in the `Doctor` table.

Key functions used throughout the system:
- **`createEvent(title, startISO, endISO)`** — Creates a Google Calendar event. Automatically generates a Google Meet conference link via `conferenceData`.
- **`getBusyTimes(req, res, next)`** — Fetches the freebusy intervals from Google Calendar for the next `maxAdvanceDays` window. Used in slot generation.
- **`eventList(start, end)`** — Returns full event objects (with titles and timestamps) for a date range. Used in the admin availability view.
- **`deleteEvent(eventId)`** — Deletes a Google Calendar event when an appointment is cancelled.

---

### Background Jobs (`jobs/jobs.js`)

Two `node-cron` jobs run automatically when the server starts:

#### 1. Email Reminder Job — runs every 5 minutes
- Fetches all `CONFIRMED` appointments.
- For each, calculates the time difference from now to the appointment start.
- **2-hour reminder**: If the appointment is within 2 hours and no `TWO_HOURS_BEFORE` log exists → send email + log it.
- **1-day reminder**: If the appointment is between 23–24 hours away and no `ONE_DAY_BEFORE` log exists → send email + log it.
- Uses `NotificationLog` to ensure each reminder is only sent once per appointment.

#### 2. Expired Appointment Cleanup — runs every hour
- Finds all appointments with a `date` on or before today.
- For each, checks if `endTime` has already passed.
- Deletes related `Payment` and `NotificationLog` records first (to avoid FK constraint errors), then deletes the appointment.

---

### Utilities

| File | Purpose |
|---|---|
| `time.utils.js` | `generateSlots(size)` — generates all daily slots; `combine(date, minutesFromMidnight)` — creates a `Date` object; `overlaps(a, b)` — checks if two time ranges overlap; `startOfToday()` |
| `sendMail.js` | Sends HTML emails via Nodemailer SMTP |
| `bookAppointment.js` | Shared utility that creates the Google Calendar event and sends the confirmation email — called from both the free-booking flow and the payment verification callback |
| `error.utils.js` | `AppError` class extends `Error` with an HTTP status code |
| `catchAsync.js` | Wraps async controller functions to forward errors to `next()` automatically |

---

## Frontend — How It Works

### Routing (`App.tsx`)

| Path | Component | Visibility |
|---|---|---|
| `/` | `Booking` | **Public** — Patient booking page |
| `/booking-success` | `BookingSuccess` | **Public** — Payment result page |
| `/11/22/33/44` | `Login` | **Hidden** — Admin login (obscured path) |
| `/admin/dashboard` | `Dashboard` | **Private** — Admin home |
| `/admin/avaliability` | `DoctorAvaliability` | **Private** — Manage schedule |
| `/admin/settings` | `Settings` | **Private** — Profile & settings |
| `/admin/session-types` | `SessionTypes` | **Private** — Manage session types |
| `/admin/appointments` | `Appointments` | **Private** — View all bookings |

All admin routes are nested under `AdminDashboardLayout`, which renders the shared sidebar navigation and outlet for child pages.

---

### Patient Booking Flow (`Booking.tsx`)

1. Patient visits `/`.
2. **Selects a session type** from the list fetched from `/api/v1/session-types`.
3. **Selects a date** from a calendar component.
4. The frontend **fetches available slots** from `GET /api/v1/bookings/slots?date=...&sessionTypeId=...`.
5. Available time slots are displayed; unavailable slots are greyed out.
6. Patient enters their **name, email, and WhatsApp number**.
7. On submit, the frontend calls `POST /api/v1/payment` with all booking details.
8. The backend returns a **PayU payment page**, which the frontend renders or redirects to.
9. Patient completes payment on PayU's page.
10. PayU calls the backend's `verify-payment` callback → appointment is confirmed in DB, Google Calendar event is created, Meet link email is sent.
11. Patient is redirected to `/booking-success`.

### Admin Login (`Login.tsx`)
- The admin navigates to the hidden route `/11/22/33/44`.
- Submits email and password to `POST /api/v1/doctor/login`.
- JWT is set as an HttpOnly cookie; the frontend stores user data in state/context.
- Admin is redirected to the dashboard.

### Admin Dashboard Pages

| Page | Key Features |
|---|---|
| **DoctorAvaliability** | Calendar showing the doctor's schedule. Admin can mark time ranges as "blocked" via `POST /api/v1/doctor/markBlock`. Fetches Google Calendar event overlays for visual display. |
| **Appointments** | Table of all confirmed appointments with patient name, email, session type, date/time, payment status, and Meet link. Allows deletion. |
| **SessionTypes** | CRUD UI for managing session types — add/edit/delete consultation packages with name, duration, fee, and description. |
| **Settings** | Tabbed settings page for: updating profile (name, email, fee), changing password, updating advance booking settings (min advance minutes, max advance days), and managing Google Calendar connection. |

---

## Full Booking Lifecycle

```
Patient visits /
       │
       ▼
Picks Session Type → Picks Date → Fetches Available Slots
       │
       ▼
Slot Availability Algorithm:
  [All Day Slots] - [Doctor Blocks] - [Confirmed Appointments] - [Google Calendar Busy Times]
  → Filter by minAdvanceMinutes & maxAdvanceDays
       │
       ▼
Patient fills details → Submits
       │
       ▼
POST /api/v1/payment
  → Conflict check (DB transaction)
  → Appointment created (PENDING)
  → Payment record created (PENDING)
  → PayU payment page returned
       │
       ▼
Patient completes payment on PayU
       │
       ▼
PayU → GET /api/v1/payment/verify-payment/:txnid/:appointmentId
  → Payment status updated (SUCCESS/FAILED)
  → Google Calendar Event created + Meet link generated
  → Appointment updated with meetLink & googleCalendarEventId
  → Appointment status → CONFIRMED
  → Confirmation email sent to patient
       │
       ▼
Patient redirected to /booking-success
       │
       ▼
CRON JOBS (background):
  Every 5 min: Send email reminders (2-hour & 1-day before)
  Every hour:  Clean up past/expired appointments
```

---

## Environment Variables

The backend relies on the following `.env` variables:

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port |
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `DOCTOR_ID` | Fixed UUID of the single doctor in the system |
| `FRONTEND_URL` | Frontend base URL (for CORS and redirects) |
| `BACKEND_URL` | Backend base URL (for PayU callback URL) |
| `PAYU_KEY` | PayU merchant key |
| `PAYU_SALT` | PayU merchant salt |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SMTP_*` | SMTP credentials for Nodemailer |

---

## Docker Setup

Both frontend and backend have their own `dockerfile` and `docker-compose.yml`. The system can be run with `docker compose up` in each directory when deploying to production.

---

## Key Design Decisions

- **Single-doctor architecture** — `DOCTOR_ID` is hardcoded in `.env`. All slot logic, blocking, and statistics are scoped to this one doctor. This simplifies the system drastically.
- **Time stored as minutes from midnight** — `startTime` and `endTime` in `Appointment` and `DoctorBlock` are integers (e.g., 570 = 9:30 AM). This avoids timezone issues when comparing availability.
- **IST timezone handling** — Google Calendar returns UTC times. The backend manually applies `+5:30 * 60 * 60 * 1000` offset to convert to IST before comparing with local slot times, avoiding JS `Date` timezone pitfalls.
- **Payment-first, then calendar** — The Google Calendar event is only created after payment is verified (not at time of slot selection), preventing phantom calendar entries for failed payments.
- **Conflict re-check in transaction** — Both the free and paid booking flows re-validate for block/booking conflicts inside a database transaction right before writing the appointment, preventing race conditions.
- **Hidden admin route** — The admin login page is at `/11/22/33/44` to reduce exposure to bots and casual discovery.
