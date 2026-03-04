# Trasmambang Homestay — Architecture

## Overview

A full-stack Next.js application with embedded Payload CMS, deployed on a VPS behind Cloudflare's free CDN proxy. Everything lives in one repository, one server, one database.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Visitors / Admin                  │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Cloudflare    │  Free tier
              │   CDN + Proxy   │  - Global CDN
              │                 │  - DDoS protection
              │                 │  - SSL termination
              │                 │  - Static asset cache
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │      Nginx      │  Reverse proxy
              │   (on VPS)      │  - Port 80/443 → 3000
              │                 │  - Gzip compression
              └────────┬────────┘
                       │
              ┌────────▼────────────────────────────┐
              │         Next.js Application         │
              │         (Payload CMS 3.0)           │
              │                                     │
              │  /              → Landing page      │
              │  /links         → Linktree page     │
              │  /booking       → Booking form      │
              │  /admin         → Payload admin UI  │
              │  /api/*         → API routes        │
              └────────┬────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │  Local on VPS
              │                 │  - Bookings
              │                 │  - CMS content
              │                 │  - Media metadata
              └─────────────────┘
```

---

## Infrastructure

### VPS
- **OS:** Ubuntu 22.04 LTS
- **Process manager:** PM2 (keeps Next.js alive, auto-restart on crash)
- **Reverse proxy:** Nginx
- **Database:** PostgreSQL 16 (local, same server)
- **Media storage:** Local filesystem or Cloudflare R2 (future)

### Cloudflare (Free Tier)
- DNS management
- CDN for static assets and images
- SSL certificate (no need for Let's Encrypt manually)
- Basic DDoS protection
- Page Rules for cache control

---

## Application Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 | Full-stack React framework |
| CMS + Backend | Payload CMS 3.0 | Embedded CMS, admin UI, REST API, auth, hooks |
| Database | PostgreSQL 16 | All data storage |
| ORM | Drizzle (via Payload) | DB schema, queries, migrations |
| Validation | Zod | Form + API input validation |
| Styling | Tailwind CSS | UI styling |
| Animation | Framer Motion | Page animations |
| UI Components | Radix UI + shadcn/ui | Accessible components |
| Language | TypeScript | Type safety across the stack |

### API Strategy — Payload-Native

Payload CMS is the **sole backend**. There is no separate API framework (no Hono, no Express).

- **Payload REST API** (`/api/[collection]`) handles all CRUD operations for every collection (bookings, coupons, links, gallery, faqs, blocked dates)
- **Payload hooks** (`beforeChange`, `afterChange`) handle all business logic: validation, overlap detection, coupon lifecycle, WhatsApp notifications
- **Payload access control** handles auth and permissions per collection
- **Custom Next.js route handlers** are used ONLY for public endpoints that don't map to a single collection:
  - `GET /api/availability` — aggregates bookings + blocked dates into a single unavailable dates response
  - `POST /api/coupons/validate` — validates a coupon code without creating anything

Everything else (creating bookings, updating status, managing content) goes through Payload's built-in REST API.

---

## Data Model

### Collections (Payload CMS)

```
bookings
├── id                UUID (internal)
├── bookingCode       string, auto (TM-YYMM-NNN, e.g. TM-2603-001)
├── guestName         string, required
├── phone             string, required
├── email             string, optional
├── checkIn           date, required
├── checkOut          date, required
├── numGuests         number, required
├── bookingStatus     enum: pending | confirmed | cancelled | expired | completed
├── paymentStatus     enum: unpaid | transfer_sent | confirmed
├── totalPrice        number
├── couponCode        string, optional
├── discountAmount    number (0 if no coupon)
├── finalPrice        number (totalPrice - discountAmount)
├── notes             textarea, optional
├── internalNotes     textarea, optional (admin only)
├── createdAt         timestamp
└── updatedAt         timestamp

coupons
├── id
├── code              string, unique, case-insensitive
├── discountType      enum: percentage | fixed
├── discountValue     number
├── maxDiscountAmount number, optional (cap for percentage)
├── minNights         number, optional
├── maxUses           number, optional
├── usedCount         number, auto
├── validFrom         date, optional
├── validUntil        date, optional
└── isActive          boolean

blockedDates
├── id
├── startDate         date
├── endDate           date
└── reason            string

links (linktree)
├── id
├── label             string (e.g. "WhatsApp", "Instagram")
├── url               string
├── icon              string (lucide icon name)
├── isActive          boolean
└── order             number

gallery
├── id
├── image             upload
├── alt               string
├── order             number
└── isActive          boolean

faqs
├── id
├── question          string
├── answer            richtext
├── order             number
└── isActive          boolean

siteSettings (global)
├── whatsappNumber    string
├── instagramUrl      string
├── tiktokUrl         string
├── twitterUrl        string
├── pricePerNight     number
├── standardCapacity  number (default: 8, towel threshold)
├── maxCapacity       number (hard limit for booking form)
├── maxBookingNights  number (default: 30)
├── bookingExpiryHours number (default: 24)
├── bankName          string (for transfer instructions)
├── bankAccountNumber string
├── bankAccountName   string
├── announcementText  string (shown on /links page and optionally landing page)
├── announcementActive boolean
└── announcementExpiry date, optional
```

---

## Key Pages & Routes

### Frontend Pages

| Route | Who sees it | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/links` | Public | Linktree-style page |
| `/booking` | Public | Booking form with availability calendar |
| `/booking/[bookingCode]` | Public (with link) | Booking status + transfer instructions |
| `/admin` | Owner (Brother) | Payload CMS admin panel |

### Payload REST API (auto-generated, no custom code)

| Endpoint | Purpose |
|---|---|
| `POST /api/bookings` | Create new booking (triggers hooks: validate, check overlap, generate bookingCode, notify owner) |
| `GET /api/bookings?where[bookingCode][equals]=TM-2603-001` | Query booking by code (for status page) |
| `PATCH /api/bookings/:id` | Update booking status/payment (triggers hooks: coupon lifecycle) |
| `GET /api/coupons?where[code][equals]=LEBARAN10` | Query coupon for validation |
| `POST/GET/PATCH /api/links` | CRUD for linktree links |
| `POST/GET/PATCH /api/gallery` | CRUD for gallery images |
| `POST/GET/PATCH /api/faqs` | CRUD for FAQ items |
| `GET /api/globals/site-settings` | Read site settings (price, WhatsApp, etc.) |

### Custom Next.js Route Handlers (only 2)

| Endpoint | Purpose | Why custom? |
|---|---|---|
| `GET /api/availability` | Returns all unavailable date ranges | Aggregates data from bookings + blockedDates collections |
| `POST /api/coupons/validate` | Validates coupon code, returns discount preview | Read-only validation logic that doesn't map to Payload CRUD |

---

## Payload Hooks (Business Logic)

All booking logic lives in Payload collection hooks — no separate controllers or services.

### Bookings Collection Hooks

| Hook | Trigger | Logic |
|------|---------|-------|
| `beforeValidate` | Before creating a booking | Auto-generate `bookingCode` (TM-YYMM-NNN), calculate `totalPrice`, `discountAmount`, `finalPrice` |
| `beforeChange` (create) | Before inserting to DB | DB transaction: check date overlap with existing PENDING/CONFIRMED bookings + blockedDates. Reject if conflict. Increment coupon `usedCount` if coupon used. |
| `afterChange` (create) | After booking saved | Send WhatsApp notification to owner via Fonnte API or wa.me link |
| `afterChange` (update) | After status change | If status → CANCELLED or EXPIRED: decrement coupon `usedCount` if coupon was used |

### Notification Flow

```
Guest submits booking form
      ↓
Frontend POST → Payload REST API /api/bookings
      ↓
beforeValidate hook: generate bookingCode, calculate prices
      ↓
beforeChange hook: DB transaction → check overlap → reject or proceed
      ↓
Saved to PostgreSQL (status: PENDING)
      ↓
afterChange hook: WhatsApp notification → Owner's phone
      ↓
Guest redirected to /booking/[bookingCode]
      ↓
Owner reviews in /admin → confirms payment → updates status
```

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              ← Public pages (grouped route)
│   │   ├── page.tsx                 Landing page
│   │   ├── links/page.tsx           Linktree page
│   │   ├── booking/
│   │   │   ├── page.tsx             Booking form
│   │   │   └── [bookingCode]/
│   │   │       └── page.tsx         Booking status
│   │   └── not-found.tsx
│   ├── (payload)/               ← Payload admin (auto-generated)
│   │   └── admin/[[...segments]]/page.tsx
│   ├── api/
│   │   ├── [...payload]/route.ts    Payload REST API (auto)
│   │   ├── availability/route.ts    Custom: unavailable dates
│   │   └── coupons/
│   │       └── validate/route.ts    Custom: coupon validation
│   └── layout.tsx
├── collections/                 ← Payload collection definitions + hooks
│   ├── Bookings.ts
│   ├── Coupons.ts
│   ├── BlockedDates.ts
│   ├── Links.ts
│   ├── Gallery.ts
│   └── FAQs.ts
├── globals/                     ← Payload globals
│   └── SiteSettings.ts
├── hooks/                       ← Shared Payload hook logic
│   ├── generateBookingCode.ts
│   ├── checkDateOverlap.ts
│   ├── calculatePricing.ts
│   ├── manageCouponUsage.ts
│   └── notifyOwner.ts
├── components/                  ← React UI components
│   ├── ui/                          shadcn/ui components
│   ├── booking-form.tsx
│   ├── availability-calendar.tsx
│   ├── coupon-input.tsx
│   └── ...existing components
├── lib/
│   ├── utils.ts
│   └── validations.ts              Zod schemas (shared client + server)
└── payload.config.ts            ← Payload configuration
```

---

## Media Storage

- **Phase 1:** Local filesystem on VPS (`/var/www/trasmambang/media/`)
- Payload handles uploads natively via its Upload collection
- Max file size: 5MB (configurable in Payload config)
- Accepted types: JPEG, PNG, WebP (for gallery images)
- Next.js Image component serves optimized versions
- **Phase 2+:** Migrate to Cloudflare R2 for better reliability and CDN delivery

---

## Database Backup

- **Automated daily backup** via cron job:
  - `pg_dump trasmambang > /backups/trasmambang_$(date +%Y%m%d).sql.gz`
  - Retain last 14 days, auto-delete older backups
- **Before deployments:** manual backup via deploy script
- **Optional:** sync backups to Cloudflare R2 or external storage for offsite backup

---

## Scheduled Tasks (Cron / node-cron)

| Task | Schedule | Description |
|------|----------|-------------|
| Expire unpaid bookings | Every hour | Set PENDING + UNPAID bookings older than 24h to EXPIRED |
| Database backup | Daily at 3:00 AM | pg_dump to /backups/ |
| Cleanup old backups | Daily at 4:00 AM | Delete backups older than 14 days |

---

## Security

- **Auth:** Payload built-in authentication (username + password). No separate auth library needed.
- **Validation:** Zod schemas shared between client form and Payload hooks (single source of truth)
- **Rate limiting:** Nginx `limit_req_zone` on `/api/bookings` (max 5 submissions per IP per hour). No app-level rate limiting needed.
- **Database:** PostgreSQL bound to localhost only, not exposed publicly
- **Network:** Cloudflare proxy hides VPS real IP address
- **Secrets:** All credentials in environment variables (`.env`, never committed)
- **Admin:** `/admin` blocked from search engine indexing (robots.txt + `X-Robots-Tag: noindex` header via Nginx)
- **Booking access:** `/booking/[bookingCode]` uses non-guessable codes but contains no sensitive PII beyond guest name

---

## Future Additions (Phase 3+)

- **Cloudflare R2** — object storage for guest uploaded transfer proofs
- **Midtrans / Xendit** — online payment gateway
- **Email notifications** — via Resend or Nodemailer
- **Automated WhatsApp** — via WhatsApp Business API or Fonnte
- **Booking widget** — embeddable calendar for other pages
