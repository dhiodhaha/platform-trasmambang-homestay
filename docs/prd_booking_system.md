# PRD — Booking System
## Trasmambang Homestay

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-03-03

---

## 1. Background

Trasmambang is a family homestay in Kasihan, Bantul, Yogyakarta. Currently all bookings are handled manually via WhatsApp — guests message the owner, negotiate dates, and confirm via manual bank transfer. There is no system to track booking history, check availability, or prevent double bookings.

As the homestay grows, this process becomes harder to manage. The owner needs a reliable system to receive, track, and confirm bookings without losing information in WhatsApp threads.

---

## 2. Goals

- Allow guests to submit a booking request directly from the website
- Give the owner a single place to view and manage all bookings
- Prevent double bookings through an availability calendar
- Support manual bank transfer as the payment method (Phase 1)
- Lay the groundwork for online payment integration in the future

---

## 3. Non-Goals (Phase 1)

- Online payment gateway (Midtrans / Xendit) — Phase 2
- Automated WhatsApp replies to guests — Phase 2
- Email confirmation to guests — Phase 2
- Multi-room or multi-unit booking — not applicable (single homestay unit)
- Cancellation by guest via website — owner handles manually
- Guest account / login system — not needed

---

## 4. Users

| User | Description | Main Need |
|------|-------------|-----------|
| **Guest** | Potential homestay customer visiting the website | Check availability, submit booking request, know where to transfer |
| **Owner (Brother)** | Manages the homestay day-to-day | See incoming bookings, confirm payments, manage calendar, manage content |
| **Developer (You)** | Builds and maintains the system | Deploy, debug, add features |

---

## 5. User Stories

### Guest

- As a guest, I want to see which dates are available so I know when I can book.
- As a guest, I want to fill a simple form with my details and preferred dates so I can submit a booking request.
- As a guest, I want to see the total price before I submit so I know how much to prepare.
- As a guest, I want clear bank transfer instructions after submitting so I know how to pay.
- As a guest, I want to be able to check my booking status so I know if my booking is confirmed.
- As a guest, I want to be redirected to WhatsApp easily if I have questions.

### Owner

- As an owner, I want to be notified immediately when a new booking comes in so I can respond quickly.
- As an owner, I want to see all bookings in one place with their status so nothing gets lost.
- As an owner, I want to confirm or cancel a booking so the calendar stays accurate.
- As an owner, I want to mark a payment as received so I know who has paid.
- As an owner, I want to see upcoming check-ins so I can prepare the homestay.
- As an owner, I want to block certain dates manually (for personal use or maintenance).

---

## 6. Booking Flow

### Guest Flow

```
1. Guest visits landing page
        ↓
2. Clicks "Pesan Sekarang" / views availability calendar
        ↓
3. Selects check-in and check-out dates
   (booked/blocked dates are greyed out)
        ↓
4. Fills booking form:
   - Full name
   - WhatsApp number
   - Email (optional)
   - Number of guests
   - Special requests (optional)
        ↓
5. (Optional) Enters coupon code → sees discount applied
        ↓
6. Sees order summary:
   - Dates selected
   - Duration (X nights)
   - Price per night
   - Discount (if coupon applied)
   - Total price
        ↓
7. Submits form → booking created (status: PENDING)
        ↓
8. Redirected to /booking/[bookingCode] (confirmation page)
   - Booking code shown (e.g. TM-2603-001)
   - Bank transfer details (account number, bank name, amount)
   - Payment deadline shown (e.g. "Bayar sebelum [date]")
   - Instruction to send proof via WhatsApp
   - WhatsApp link pre-filled with booking code
        ↓
9. Guest transfers and sends proof via WhatsApp
        ↓
10. Guest can revisit /booking/[bookingCode] to check status
```

### Owner Flow

```
1. New booking submitted
        ↓
2. Owner receives WhatsApp notification
   "Booking baru masuk! Nama: [name], Check-in: [date],
    Check-out: [date], Tamu: [n] orang. Cek admin: /admin"
        ↓
3. Owner opens /admin → Bookings
        ↓
4. Reviews booking details
        ↓
5. Guest sends transfer proof via WhatsApp (manual)
        ↓
6. Owner updates payment status → TRANSFER_CONFIRMED
        ↓
7. Owner updates booking status → CONFIRMED
        ↓
8. Owner (optionally) sends confirmation to guest via WhatsApp manually
```

---

## 7. Booking Statuses

### Booking Status

| Status | Meaning |
|--------|---------|
| `PENDING` | Guest submitted form, waiting for payment |
| `CONFIRMED` | Payment received and verified, booking locked |
| `CANCELLED` | Cancelled by owner (no-show, invalid booking, etc.) |
| `EXPIRED` | Auto-cancelled after payment deadline passed (24h default) |
| `COMPLETED` | Guest has checked out |

### Payment Status

| Status | Meaning |
|--------|---------|
| `UNPAID` | No payment received yet |
| `TRANSFER_SENT` | Guest claims to have transferred (not verified) |
| `CONFIRMED` | Owner has confirmed payment received |

---

## 8. Data Model

### Booking

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | auto | Internal ID (database primary key) |
| `bookingCode` | string | auto | Human-readable code, format: `TM-YYMM-NNN` (e.g. TM-2603-001). Used in URLs, WhatsApp messages, and shown to guest. |
| `guestName` | string | yes | Full name |
| `phone` | string | yes | WhatsApp number, with country code |
| `email` | string | no | Optional |
| `checkIn` | date | yes | Must be today or future |
| `checkOut` | date | yes | Must be after checkIn |
| `numGuests` | number | yes | Min 1, max based on capacity |
| `totalPrice` | number | auto | Calculated from nights × price/night |
| `bookingStatus` | enum | auto | Default: PENDING |
| `paymentStatus` | enum | auto | Default: UNPAID |
| `couponCode` | string | no | Coupon code used (if any) |
| `discountAmount` | number | no | Discount value in Rupiah (0 if no coupon) |
| `finalPrice` | number | auto | totalPrice - discountAmount |
| `notes` | text | no | Guest special requests |
| `internalNotes` | text | no | Owner notes, not visible to guest |
| `createdAt` | timestamp | auto | |
| `updatedAt` | timestamp | auto | |

### Blocked Dates (owner-managed)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `startDate` | date | |
| `endDate` | date | |
| `reason` | string | e.g. "Personal use", "Maintenance" |

---

## 9. Availability Logic

- A date range is **unavailable** if any existing booking with status `PENDING` or `CONFIRMED` overlaps with it
- Blocked dates set by the owner are always unavailable
- `CANCELLED` and `COMPLETED` bookings free up their dates
- Minimum booking: 1 night
- Maximum booking: 30 nights (configurable in site settings)
- Minimum advance booking: same-day allowed (configurable)

### Overlap Check Rule

A new booking `[A, B]` conflicts with existing booking `[C, D]` if:
```
A < D AND B > C
```

### Race Condition Prevention

To prevent double bookings when two guests submit overlapping dates simultaneously:
- Implemented in the Bookings collection `beforeChange` hook
- Uses a **database transaction** with a SELECT ... FOR UPDATE lock on overlapping date ranges
- Check for conflicts inside the transaction before inserting
- If conflict found, throw a Payload `ValidationError` → returns 400 to the second guest
- This is enforced at the Payload hook level, meaning it applies regardless of how the booking is created (REST API, admin panel, or Local API)

### Auto-Expiry of Unpaid Bookings

- PENDING bookings that remain UNPAID auto-expire after **24 hours** (configurable in site settings)
- Implementation: a **scheduled task** (node-cron) runs every hour:
  1. Uses Payload's **Local API** (`payload.find()` + `payload.update()`) to query and update bookings
  2. Find all bookings where `bookingStatus == PENDING` AND `paymentStatus == UNPAID` AND `createdAt < now - expiryHours`
  3. Set `bookingStatus = EXPIRED` via Payload Local API (this triggers `afterChange` hooks, which handle coupon usedCount decrement)
  4. Dates become available again
- Using Payload Local API ensures hooks run consistently — same logic whether expired by cron or cancelled by owner
- Owner can still manually confirm a booking before expiry if payment is received through other channels

---

## 10. Pricing

- Base rate per night (configured in Payload site settings)
- **Weekend/Peak Pricing (Proposed)**: Automatic surcharge for Friday-Sunday stays or specific peak dates.
- **Extra Services (Proposed)**: Add-on costs for services like airport transfer or breakfast packages.
- Total = (nights × daily rate) + extra services - discounts
- No taxes, no service fees in Phase 1

---

## 10b. Coupon & Discount

### Overview
Owner can create coupon codes that guests enter during booking to receive a discount on the total price.

### Coupon Fields (Payload Collection)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `code` | string | yes | Unique, case-insensitive (e.g. "LEBARAN10") |
| `discountType` | enum | yes | `percentage` or `fixed` |
| `discountValue` | number | yes | e.g. 10 for 10% off, or 100000 for Rp100.000 off |
| `maxDiscountAmount` | number | no | Cap for percentage discounts in Rupiah (e.g. 500000). Only applies when `discountType` is `percentage`. |
| `minNights` | number | no | Minimum nights required to use coupon |
| `maxUses` | number | no | Total usage limit (null = unlimited) |
| `usedCount` | number | auto | How many times coupon has been used |
| `validFrom` | date | no | Coupon start date (null = immediately active) |
| `validUntil` | date | no | Coupon expiry date (null = no expiry) |
| `isActive` | boolean | yes | Owner can toggle on/off instantly |

### Guest Experience

```
Booking form → Order Summary section
  → "Punya kode kupon?" input field + "Pakai" button
        ↓
  Valid code → shows discount line in summary
    Before: Rp1.699.000 × 2 malam = Rp3.398.000
    Diskon (LEBARAN10): - Rp339.800
    Total: Rp3.058.200
        ↓
  Invalid / expired code → inline error:
    "Kode kupon tidak valid atau sudah tidak berlaku"
        ↓
  Guest submits → coupon code saved to booking record
  usedCount incremented on submission
```

### Discount Calculation

- `percentage`: `total = totalPrice × (1 - discountValue / 100)`
- `fixed`: `total = totalPrice - discountValue` (minimum Rp0, cannot go negative)
- Discount applied to the **total price** (after nights × price/night)
- Only 1 coupon per booking
- **Max discount cap**: percentage coupons capped at `maxDiscountAmount` (optional field). E.g. "10% off, max Rp500.000". Prevents accidental massive discounts.
- Percentage `discountValue` must be 1–100 (validated on creation)

### Coupon & Booking Lifecycle

| Event | Effect on Coupon |
|-------|-----------------|
| Booking submitted with coupon | `usedCount` incremented |
| Booking status → CANCELLED | `usedCount` decremented (coupon is "returned") |
| Booking status → EXPIRED | `usedCount` decremented |
| Booking status → CONFIRMED | No change |
| Booking status → COMPLETED | No change |

### Coupon Validation Rules

| Rule | Behavior |
|------|---------|
| Code not found | Error: "Kode kupon tidak valid atau sudah tidak berlaku" |
| `isActive` is false | Same error as above (don't reveal it exists) |
| Past `validUntil` | Same error |
| Before `validFrom` | Same error |
| `usedCount` >= `maxUses` | Same error |
| Booking nights < `minNights` | Error: "Kode kupon hanya berlaku untuk minimal [n] malam" |

### Admin Capabilities (Coupon Management)

| Feature | Description |
|---------|-------------|
| Create coupon | Code, type (%), value, validity dates, usage limit |
| Toggle active/inactive | Instantly disable without deleting |
| View usage count | How many times a coupon has been used |
| View bookings using coupon | Filter bookings by coupon code |
| Delete coupon | Hard delete, only if usedCount is 0 |

---

## 11. Capacity

- 1 unit (the entire homestay)
- **Standard capacity: 8 guests** — towel facilities provided for up to 8 guests
- Guests above 8 are allowed but the booking form shows an inline warning:
  > "Melebihi 8 tamu, lebih dari 8 tamu tidak mendapat fasilitas handuk"
- Warning is non-blocking — guest can still proceed and submit
- Hard maximum: configurable in site settings (e.g. 20, based on physical capacity)
- System only allows 1 active booking per date range (no overlap)

---

## 12. Notifications

### Phase 1 (Manual)

**To owner — on new booking:**
- WhatsApp message via Fonnte API or simple `wa.me` link trigger
- Message content:
  ```
  🏠 Booking Baru - Trasmambang

  Kode: [bookingCode]
  Nama: [guestName]
  Check-in: [checkIn]
  Check-out: [checkOut]
  Tamu: [numGuests] orang
  Subtotal: Rp[totalPrice]
  Diskon: Rp[discountAmount] ([couponCode])   ← only if coupon used
  Total: Rp[finalPrice]

  Cek detail: trasmambang.com/admin
  ```

**To guest — after booking:**
- Confirmation page at `/booking/[bookingCode]` with bank transfer details and payment deadline
- **Receipt Upload (Proposed)**: Direct upload of transfer proof image on the confirmation page.
- WhatsApp link to contact owner with booking code pre-filled
- Show booking status (PENDING → CONFIRMED → EXPIRED, auto-refreshes)

### Phase 2 (Future)
- Automated WhatsApp to guest on confirmation
- Email receipt to guest
- Reminder 1 day before check-in

---

## 13. Admin Capabilities

The owner (brother) accesses `/admin` (Payload CMS):

| Feature | Description |
|---------|-------------|
| View all bookings | Sortable list with filters (status, date range) |
| View booking detail | All guest info, dates, payment status |
| Change booking status | PENDING → CONFIRMED / CANCELLED / COMPLETED |
| Change payment status | UNPAID → TRANSFER_SENT → CONFIRMED |
| Add internal notes | Notes only visible to admin |
| Block dates | Mark dates unavailable (personal use, maintenance) |
| View upcoming check-ins | Quick view of next 7 days |
| Edit price per night | Via site settings global |

---

## 14. PTO (Payment Transfer Order) Verification Flows

To ensure reliability and prevent abuse, we propose three "Proof of Transfer" (PTO) flows:

### Option A: The "Direct Upload" Flow (Balanced)
*   **Flow**: User submits booking -> Dates are blocked (`PENDING`) -> User uploads receipt immediately on the confirmation page -> Owner verifies -> Status becomes `CONFIRMED`.
*   **Pros**: Automated date blocking, clear next steps for the guest.
*   **Abuse Prevention**: 4-hour auto-expiry if no receipt is uploaded.

### Option B: The "Strict Hold" Flow (Highest Security)
*   **Flow**: User submits booking -> User sees a 30-minute timer -> User **MUST** upload a receipt to "Keep the Lock" -> If no receipt within 30 mins, dates are released immediately. Once uploaded, the owner has 4 hours to verify.
*   **Pros**: Protects the calendar from "evil minds" who just want to block dates without paying.
*   **Abuse Prevention**: Extremely short block duration for un-vetted requests.

### Option C: The "Pre-Vetting" Flow (Manual High-Touch)
*   **Flow**: User submits a "Booking Request" -> Dates are **NOT** blocked yet -> Owner receives a WhatsApp "Approve this request?" -> Owner clicks approve -> Client is notified to pay -> Dates only block **AFTER** receipt is uploaded.
*   **Pros**: Total control for the owner. No one can block the calendar without the owner's permission.
*   **Cons**: Higher workload for the owner; slower for the guest.

---

## 15. Terms and Conditions (T&C) Placement

We recommend these 3 locations for "Syarat & Ketentuan":

1.  **Placement 1: The Review Screen (Recommended)**
    *   Add a required checkbox `[ ] Saya setuju dengan Syarat & Ketentuan` right above the "Konfirmasi & Booking" button. This ensures a legal contract is formed at the moment of commitment.
2.  **Placement 2: Multi-Step Dialog**
    *   Before entering "Data Tamu" (Step 2), a small modal or drawer appears with the key rules (Check-in time, No smoking, Refund policy) that the user must click "I Understand" to dismiss.
## 15. PTO (Phone-To-Owner) Verification Flows

To prevent bot abuse and "fake bookings" that block the calendar, we propose 3 "PTO" (Reverse Verification) options:

### Option A: The "Proof of Action" (Recommended)
- **Flow**: User submits booking -> Confirmation page shows a deep link: "Kirim Kode Verifikasi ke WhatsApp Owner" -> User **MUST** click and send a unique code (e.g. `PTO-X792`) via WhatsApp -> Owner verifies and manually confirms the booking.
- **Why it works**: Only real humans with WhatsApp can complete this. Bots/fake minds won't bother sending the message.
- **Auto-Release**: If no message is received within **30 minutes**, the date is released.

### Option B: The "Owner Unlock" (Maximum Safety)
- **Flow**: User fills form -> Button says "Request Booking" -> Dates are **NOT** blocked yet -> User is redirected to WhatsApp to chat with the owner -> Owner approves in Admin -> Only then the dates are blocked for the guest to pay.
- **Why it works**: You have 100% control over who blocks your calendar.

### Option C: The "Auto-Vetter" (Semi-Automated)
- **Flow**: User books -> System sends them an automated WhatsApp (via API) asking for a keyword reply or a "Yes" button click -> If they don't reply in 15 mins, the booking is automatically cancelled.

---

## 16. Terms and Conditions (T&C) Placement

To ensure guests read and agree to your rules, here are 3 placement options:

### Placement 1: The "Legal Lock" (Best for Safety)
- **Where**: A required checkbox `[ ] Saya setuju dengan Syarat & Ketentuan` right before the "Konfirmasi & Booking" button on the **Review Step**.
- **UX**: User cannot finish the booking without checking it.

### Placement 2: The "Summary Toast/Strip"
- **Where**: A small fixed bar at the bottom of the review page saying "Dengan menekan tombol di bawah, Anda menyetujui Aturan Homestay kami (Buka S&K)".
- **UX**: Less intrusive, but legally binding.

### Placement 3: The "Pre-Entry Modal"
- **Where**: A popup triggered as soon as they click a date. It shows the "Dos & Don'ts" (e.g. Max guests, No party) that they must close to continue.

---

## 17. Pages & Routes

### Frontend Pages

| Route | Visible To | Purpose |
|-------|------------|---------|
| `/` | Public | Landing page with availability widget + booking CTA |
| `/booking` | Public | Full booking form page |
| `/booking/[bookingCode]` | Public (with link) | Booking confirmation + transfer instructions |
| `/admin` | Owner (Brother) | Payload CMS admin dashboard |

### API Endpoints

| Endpoint | Type | Purpose |
|----------|------|---------|
| `POST /api/bookings` | Payload REST API | Creates new booking (hooks handle: code generation, overlap check, pricing, notification) |
| `GET /api/bookings?where[bookingCode][equals]=...` | Payload REST API | Query booking by code (for status page) |
| `PATCH /api/bookings/:id` | Payload REST API | Update status/payment (hooks handle: coupon lifecycle) |
| `GET /api/availability` | Custom route handler | Aggregates bookings + blockedDates into unavailable date ranges |
| `POST /api/coupons/validate` | Custom route handler | Validates coupon code, returns discount preview or error |

> Note: Payload auto-generates REST endpoints for all collections. Only `/api/availability` and `/api/coupons/validate` are custom Next.js route handlers.

---

## 15. Validation Rules

### Booking Form

| Field | Rule |
|-------|------|
| Guest name | Required, min 2 chars, max 100 chars |
| Phone | Required, valid Indonesian phone format (+62 / 08xx) |
| Email | Optional, valid email format if provided |
| Check-in | Required, must be today or future |
| Check-out | Required, must be at least 1 day after check-in |
| Dates | Must not overlap with existing PENDING or CONFIRMED booking |
| Num guests | Required, min 1, max capacity (hard limit from settings) |
| Num guests > 8 | Allowed but shows inline warning: "Melebihi 8 tamu, lebih dari 8 tamu tidak mendapat fasilitas handuk" |

---

## 16. Edge Cases

| Scenario | Handling |
|----------|---------|
| Guest selects already-booked dates | Calendar blocks selection, shows "Tanggal tidak tersedia" |
| Two guests submit same dates simultaneously | Second submission returns error "Tanggal sudah dipesan, silakan pilih tanggal lain" |
| Guest submits but never pays | Auto-expires after 24h (via scheduled task), dates freed up. Owner can also cancel manually before expiry. |
| Owner needs to cancel a confirmed booking | Manual status change in admin, owner contacts guest via WhatsApp |
| Guest submits wrong phone number | Owner contacts via email (if provided) or booking is flagged |
| Guest uses coupon, booking expires | `usedCount` decremented, coupon can be reused |
| Owner creates 100% discount coupon | Allowed (legit use case: free stay for family/friends). `maxDiscountAmount` cap can limit this if set |
| Guest tries to access `/booking/[bookingCode]` with random code | 404 page, no data leaked |
| PENDING booking expires while guest is transferring | Guest sees "Booking kedaluwarsa" on status page, must rebook |

---

## 17. Success Metrics

| Metric | Target |
|--------|--------|
| Booking form completion rate | > 60% of users who open the form |
| Double booking incidents | 0 |
| Owner notification delivery | 100% on new booking |
| Time for owner to see new booking | < 5 minutes |
| Admin usability | Owner (brother) can manage bookings without help after 1 walkthrough |

---

## 18. Out of Scope (Phase 1)

- Guest login / account
- Automated payment verification
- Refund processing
- Multi-language (English) — Indonesian only for now
- Mobile app
- Booking modification by guest (change dates)
- Reviews / ratings

---

## 19. Open Questions

| # | Question | Decision Needed By |
|---|----------|--------------------|
| 1 | What is the hard maximum guest capacity beyond the 8 standard? (e.g. 15? 20?) | Before Phase 4 build |
| 2 | Allow same-day booking or minimum 1 day advance? | Before Phase 4 build |
| 3 | ~~How many days before owner cancels unpaid bookings?~~ **Resolved: 24h auto-expiry (configurable)** | ~~Before Phase 4 build~~ |
| 4 | Which bank account for transfer (bank name, account number, account name)? | Before Phase 4 build |
| 5 | Use Fonnte API for WhatsApp notification or manual check only? | Before Phase 4 build |
| 6 | Weekend/holiday pricing in Phase 2 or keep flat rate longer? | Phase 2 planning |
