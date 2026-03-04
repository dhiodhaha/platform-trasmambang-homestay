# Trasmambang Homestay — Implementation Plan

## Tech Stack (Final Decision)

- **Framework:** Next.js 15 (upgrade from 14)
- **CMS + Backend:** Payload CMS 3.0 (embedded in Next.js — handles API, auth, admin, hooks)
- **Database:** PostgreSQL 16
- **Validation:** Zod (shared client + server schemas)
- **Hosting:** VPS + Nginx + PM2
- **CDN:** Cloudflare free tier
- **Language:** TypeScript

> **Architecture principle:** Payload is the sole backend. No separate API framework. All business logic lives in Payload collection hooks. Only 2 custom Next.js route handlers for aggregation endpoints.

---

## Phase 0 — VPS & Infrastructure Setup

### Goals
Get the server ready before touching any application code.

### Tasks

**0.1 VPS Preparation**
- [ ] Update system packages (`apt update && apt upgrade`)
- [ ] Install Node.js 20 LTS (via nvm)
- [ ] Install pnpm
- [ ] Install PostgreSQL 16
- [ ] Install Nginx
- [ ] Install PM2 globally
- [ ] Configure UFW firewall (allow 22, 80, 443 only)

**0.2 PostgreSQL Setup**
- [ ] Create database: `trasmambang`
- [ ] Create dedicated DB user with limited permissions
- [ ] Test local connection

**0.3 Nginx + Cloudflare Setup**
- [ ] Point domain DNS to VPS IP via Cloudflare (orange cloud = proxied)
- [ ] Configure Nginx reverse proxy (port 80 → 3000)
- [ ] Enable Cloudflare SSL (Full mode — Cloudflare handles SSL)
- [ ] Test domain resolves correctly

**0.4 Deployment Pipeline**
- [ ] Set up SSH key for server access
- [ ] Create simple deploy script (`git pull → pnpm install → pnpm build → pm2 restart`)
- [ ] Or set up GitHub Actions for auto-deploy on push to `main`

---

## Phase 1 — Migration & Payload CMS Setup

### Goals
Migrate from Cloudflare Pages to VPS. Add Payload CMS. Remove Cloudflare-specific packages.

### Tasks

**1.1 Remove Cloudflare Pages Dependencies**
- [ ] Remove `@cloudflare/next-on-pages`
- [ ] Remove `wrangler` (or keep for R2 later)
- [ ] Remove `env.d.ts` Cloudflare worker types
- [ ] Clean up `next.config.mjs` (remove Cloudflare-specific config)
- [ ] Update `package.json` scripts

**1.2 Upgrade Next.js**
- [ ] Upgrade from Next.js 14 → 15
- [ ] Fix any breaking changes (mostly server component patterns)
- [ ] Test all existing pages still work

**1.3 Install & Configure Payload CMS**
- [ ] Install Payload CMS 3.0 and `@payloadcms/db-postgres` adapter
- [ ] Create `payload.config.ts` with PostgreSQL connection
- [ ] Define content collections: Links, Gallery, FAQs
- [ ] Define `SiteSettings` global (whatsappNumber, pricePerNight, social URLs, capacity settings, bank details, announcement)
- [ ] Define booking collections (empty hooks for now): Bookings, Coupons, BlockedDates
- [ ] Set up Payload access control (admin-only for content collections, public create for bookings)
- [ ] Run initial migration to create DB tables
- [ ] Create first admin user
- [ ] Test `/admin` route works

**1.4 Connect Existing Content to Payload**
- [ ] Migrate `facilities-data.ts` content → Payload collection (or keep as static, decide)
- [ ] Migrate FAQ hardcoded data → Payload `faqs` collection
- [ ] Add gallery images → Payload `gallery` collection
- [ ] Add social links → Payload `links` collection

**1.5 First Deploy to VPS**
- [ ] Push code, run build on server
- [ ] Start with PM2
- [ ] Verify site is live at domain
- [ ] Verify `/admin` is accessible

---

## Phase 2 — Landing Page Refresh

### Goals
Visual redesign of the landing page. No content changes — only design polish.

### Tasks

**2.1 Design Audit**
- [ ] Review current sections on mobile and desktop
- [ ] Identify inconsistent spacing, colors, font sizes
- [ ] List sections that need most attention (Hero, Why, CTA)

**2.2 Typography & Color System**
- [ ] Define a proper color palette in `tailwind.config.ts`
  - Primary (brand color)
  - Accent
  - Neutral shades
- [ ] Standardize heading sizes across all sections
- [ ] Ensure consistent font weights (currently mixed)

**2.3 Hero Section**
- [ ] Improve visual impact (stronger overlay, better image treatment)
- [ ] Add subtle scroll-triggered entrance animation
- [ ] Refine CTA button styling

**2.4 Section Animations**
- [ ] Add scroll-triggered fade-in for Why, Facilities, FAQ sections
- [ ] Smooth stagger animations for card grids
- [ ] Keep gallery infinite carousel as-is (already good)

**2.5 Mobile Polish**
- [ ] Review all sections at 375px (iPhone SE)
- [ ] Fix any overflow or padding issues
- [ ] Ensure touch targets are minimum 44px

**2.6 CTA & Buttons**
- [ ] Consistent button component across all sections
- [ ] Proper hover and active states
- [ ] Loading state for future form submissions

**2.7 Connect Dynamic Content**
- [ ] FAQ section reads from Payload `faqs` collection
- [ ] Gallery reads from Payload `gallery` collection
- [ ] Site settings (price, WhatsApp number) reads from Payload globals

---

## Phase 3 — /links Page (Linktree)

### Goals
A standalone branded page your brother manages entirely from Payload admin.

### Tasks

**3.1 Build `/links` Page**
- [ ] Fetch links from Payload `links` collection (ordered, active only)
- [ ] Branded header (logo + homestay name)
- [ ] Link cards with icon, label, URL
- [ ] Fetch and display active announcement from SiteSettings global (if active + not expired)
- [ ] Mobile-first design (most visitors come from Instagram bio)

**3.2 Content Setup**
- [ ] Add initial links in Payload admin:
  - WhatsApp booking
  - Instagram
  - TikTok
  - Google Maps location
  - Main website

**3.3 Brother Onboarding**
- [ ] Create Payload admin account for brother (editor role, limited access)
- [ ] Brief walkthrough: how to add/edit/reorder links
- [ ] How to toggle links active/inactive

---

## Phase 4 — Booking System

### Goals
Full booking flow: guest submits form → owner notified → owner confirms → tracked in admin.

### Tasks

**4.1 Payload Booking Hooks (Core Logic)**
- [ ] `beforeValidate` hook: auto-generate `bookingCode` (TM-YYMM-NNN format)
- [ ] `beforeValidate` hook: calculate `totalPrice`, `discountAmount`, `finalPrice`
- [ ] `beforeChange` hook (create): DB transaction with SELECT...FOR UPDATE lock → check date overlap with PENDING/CONFIRMED bookings + blockedDates → reject if conflict
- [ ] `beforeChange` hook (create): validate and increment coupon `usedCount`
- [ ] `afterChange` hook (create): send WhatsApp notification to owner (Fonnte API or wa.me link)
- [ ] `afterChange` hook (update): if status → CANCELLED/EXPIRED → decrement coupon `usedCount`
- [ ] Zod validation schemas shared between client form and hooks

**4.2 Custom Route Handlers (only 2)**
- [ ] `GET /api/availability` — aggregates booked dates from Bookings (PENDING + CONFIRMED) + BlockedDates, returns unavailable date ranges
- [ ] `POST /api/coupons/validate` — receives code + number of nights, validates against Coupons collection rules, returns discount preview or error

**4.3 Availability Calendar Component**
- [ ] Build date range picker component
- [ ] Fetch unavailable dates from `GET /api/availability`
- [ ] Block unavailable dates from selection
- [ ] Show price per night from site settings, calculate total on date selection

**4.4 Booking Form**
- [ ] Guest name (required)
- [ ] Phone number / WhatsApp (required)
- [ ] Email (optional)
- [ ] Check-in / check-out dates (from calendar)
- [ ] Number of guests (show warning when > 8: "Melebihi 8 tamu, lebih dari 8 tamu tidak mendapat fasilitas handuk")
- [ ] Special requests / notes
- [ ] Coupon code input ("Punya kode kupon?") — calls `POST /api/coupons/validate` on blur
- [ ] Order summary with subtotal, discount line, and final total
- [ ] Form validation with Zod (shared schema from `lib/validations.ts`)
- [ ] Submit → POST to Payload REST API `/api/bookings`

**4.5 Booking Confirmation Page**
- [ ] After form submit → redirect to `/booking/[bookingCode]`
- [ ] Fetch booking via Payload REST API: `GET /api/bookings?where[bookingCode][equals]=...`
- [ ] Show booking summary (dates, guests, discount, final price)
- [ ] Show bank transfer details (account number, amount)
- [ ] Show payment deadline ("Bayar sebelum [date]")
- [ ] Instructions to send proof via WhatsApp
- [ ] WhatsApp link pre-filled with booking code
- [ ] Show booking status (PENDING → CONFIRMED → EXPIRED, auto-refreshes)

**4.6 Admin Configuration (Payload-native, no custom UI)**
- [ ] Bookings collection: list view with filters (status, date range), sortable columns
- [ ] Bookings: owner can change status (PENDING → CONFIRMED / CANCELLED / COMPLETED)
- [ ] Bookings: owner can change payment status (UNPAID → TRANSFER_SENT → CONFIRMED)
- [ ] Bookings: `internalNotes` field visible only in admin
- [ ] BlockedDates collection: owner can block/unblock date ranges with reason
- [ ] Coupons collection: owner can create/toggle/view usage
- [ ] Access control: booking creation is public, all other operations require admin auth

**4.7 Auto-Expiry**
- [ ] Scheduled task (node-cron or Payload jobs): run every hour
- [ ] Find PENDING + UNPAID bookings older than 24h → set status to EXPIRED
- [ ] Triggers `afterChange` hook → decrements coupon `usedCount` if applicable
- [ ] Register cron in server startup (Next.js instrumentation file or PM2 ecosystem)

---

## Phase 5 — Polish & Hardening

### Goals
Production-ready reliability, performance, and maintainability.

### Tasks

**5.1 Performance**
- [ ] Enable Cloudflare caching for static assets
- [ ] Optimize all images (Next.js Image component throughout)
- [ ] Lazy load below-fold sections

**5.2 SEO**
- [ ] Proper metadata for all pages
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] robots.txt

**5.3 Error Handling**
- [ ] Custom 404 page (already exists, review)
- [ ] Error boundary for booking form
- [ ] API error responses with proper status codes

**5.4 Security**
- [ ] Nginx rate limiting on `/api/bookings` (max 5 POST per IP per hour)
- [ ] Nginx `X-Robots-Tag: noindex` header for `/admin`
- [ ] Verify Payload access control: public can only POST bookings, everything else requires auth
- [ ] Verify Zod schemas validate all inputs (no raw user data reaches DB)

**5.5 Database Backup**
- [ ] Daily pg_dump cron job (retain 14 days)
- [ ] Pre-deploy backup in deploy script
- [ ] Test backup restore procedure at least once

**5.6 Monitoring**
- [ ] PM2 logging setup
- [ ] Seline analytics already in place (keep it)
- [ ] Uptime monitoring (UptimeRobot free tier)

---

## Phase 6 — Future (No Timeline Yet)

- Online payment via Midtrans or Xendit
- Automated WhatsApp replies (WhatsApp Business API)
- Email confirmations via Resend
- Guest review/testimonial system
- Booking widget embeddable in other pages
- Cloudflare R2 for media storage (replace local filesystem)
