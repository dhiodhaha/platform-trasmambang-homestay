# Booking System — Implementation Report

**Date:** 2026-03-04
**Branch:** `feat/booking-system-dashboard`
**Status:** Backend + Frontend implemented, ready for testing

---

## What Was Built

### Backend (Payload CMS)

| # | Type | File | Status |
|---|------|------|--------|
| 1 | Global | `src/globals/SiteSettings.ts` | Done |
| 2 | Collection | `src/collections/Bookings.ts` | Done |
| 3 | Collection | `src/collections/Coupons.ts` | Done |
| 4 | Collection | `src/collections/BlockedDates.ts` | Done |
| 5 | Hook | `src/hooks/booking/generateBookingCode.ts` | Done |
| 6 | Hook | `src/hooks/booking/calculatePricing.ts` | Done |
| 7 | Hook | `src/hooks/booking/preventSpam.ts` | Done |
| 8 | Hook | `src/hooks/booking/checkDateOverlap.ts` | Done |
| 9 | Hook | `src/hooks/booking/validateStatusTransition.ts` | Done |
| 10 | Hook | `src/hooks/booking/manageCouponUsage.ts` | Done |
| 11 | Hook | `src/hooks/booking/notifyOwner.ts` | Done |
| 12 | Task | `src/tasks/expireBookings.ts` | Done |
| 13 | Validation | `src/lib/validations.ts` | Done |
| 14 | API Route | `src/app/(frontend)/api/availability/route.ts` | Done |
| 15 | API Route | `src/app/(frontend)/api/coupons/validate/route.ts` | Done |

### Frontend

| # | Type | File | Status |
|---|------|------|--------|
| 16 | Page | `src/app/(frontend)/booking/page.tsx` | Done |
| 17 | Page | `src/app/(frontend)/booking/[bookingCode]/page.tsx` | Done |
| 18 | Component | `src/components/BookingForm/index.tsx` | Done |
| 19 | Component | `src/components/BookingForm/availability-calendar.tsx` | Done |
| 20 | Component | `src/components/BookingForm/coupon-input.tsx` | Done |
| 21 | Component | `src/components/BookingForm/order-summary.tsx` | Done |
| 22 | Component | `src/app/(frontend)/booking/[bookingCode]/BookingConfirmation.tsx` | Done |

### Landing Page Integration

| # | Type | File | Change |
|---|------|------|--------|
| 23 | Component | `src/Landing/components/availability-widget.tsx` | New — availability calendar widget fetching from `/api/availability` |
| 24 | Modified | `src/Landing/components/cta.tsx` | Replaced WhatsApp form with availability calendar widget + "Pesan Sekarang" CTA |
| 25 | Modified | `src/Landing/components/hero.tsx` | Changed primary CTA from WhatsApp to `/booking` page |
| 26 | Modified | `src/Landing/components/rooms.tsx` | Changed booking CTA from WhatsApp to `/booking` page |
| 27 | Modified | `src/app/(frontend)/booking/page.tsx` | Accepts `?checkIn=&checkOut=` query params from widget |
| 28 | Modified | `src/components/BookingForm/index.tsx` | Accepts `initialCheckIn`/`initialCheckOut` props |
| 29 | Modified | `src/components/BookingForm/availability-calendar.tsx` | Accepts `initialRange` prop for pre-selection |

### Config Changes

| File | Change |
|------|--------|
| `src/payload.config.ts` | Added Bookings, Coupons, BlockedDates collections + SiteSettings global + expireBookingsTask |
| `package.json` | Added `zod`, `react-day-picker`, `@hookform/resolvers` |

---

## Architecture Summary

### Hook Execution Order (Bookings)

```
beforeValidate: generateBookingCode → calculatePricing
beforeChange:   preventSpam → checkDateOverlap → validateStatusTransition
afterChange:    manageCouponUsage → notifyOwner
```

### Status Machine

```
pending → confirmed | cancelled | expired
confirmed → completed | cancelled
cancelled → (terminal)
expired → (terminal)
completed → (terminal)
```

### Anti-Spam Layers

1. **Rate limit**: Max 3 PENDING bookings per phone number (`preventSpam` hook)
2. **Honeypot field**: Hidden `website` field rejects bots
3. **Short expiry**: PENDING bookings auto-expire (default 24h)
4. **Manual cancel**: Owner can cancel suspicious bookings via admin

### Transaction Safety

All `beforeChange` hooks pass `req` to nested Payload operations, keeping everything within the same PostgreSQL transaction. If the date overlap check passes but the insert fails, everything rolls back.

---

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | 4.3.6 | Shared validation schemas (frontend + backend) |
| `react-day-picker` | 9.14.0 | Availability calendar date range picker |
| `@hookform/resolvers` | 5.2.2 | Zod resolver for react-hook-form |

---

## What To Test

### 1. Start dev server
```bash
pnpm dev
```
Payload will auto-run migrations to create the new tables.

### 2. Configure SiteSettings
Go to `/admin` → Site Settings → fill in:
- Price per night (e.g. 500000)
- Bank details (name, account number, account name)
- WhatsApp number (e.g. 6285xxxxxxxxx)

### 3. Test via Admin Panel
- Create a booking → verify `bookingCode` auto-generated (TM-2603-001)
- Verify `totalPrice`/`finalPrice` calculated from SiteSettings price
- Create overlapping booking → should get validation error
- Change booking status: pending → confirmed (allowed), confirmed → pending (blocked)

### 4. Test API Routes
```bash
curl http://localhost:3000/api/availability
curl -X POST http://localhost:3000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST10","nights":2}'
```

### 5. Test Frontend
- Visit `/booking` → calendar loads, select dates, fill form, submit
- Redirects to `/booking/TM-XXXX-XXX` → shows bank details + WhatsApp link
- Try invalid booking code → 404

---

## Not Yet Implemented (Phase 2)

- [ ] Cron trigger for `expireBookings` task (need external cron or Vercel Cron)
- [ ] Automated WhatsApp notification (currently logs wa.me link to console)
- [ ] Email confirmation to guest
- [ ] CAPTCHA (Cloudflare Turnstile)
- [ ] Nginx rate limiting config
- [x] Landing page availability widget integration
