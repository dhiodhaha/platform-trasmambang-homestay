# Trasmambang Homestay — Project Timeline

## Assumptions

- Developer: 1 person (you), part-time (~2–3 hours/day)
- No design handoff needed (you design as you build)
- VPS already available
- Domain already pointing (trasmambang.com)

---

## Overview

```md
Month 1        Month 2              Month 3
├─ Phase 0 ───┤
├──── Phase 1 ──────┤
               ├─ Phase 2 ──┤
               ├──── Phase 3 ─┤
                        ├──────────── Phase 4 ──────────────┤
                                                      ├─ Phase 5 ─┤
```

---

## Phase 0 — VPS & Infrastructure Setup

**Duration: 3–5 days**
**Start: Day 1**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 1 | VPS preparation (Node, pnpm, PostgreSQL, Nginx, PM2, firewall) | NOT YET |
| 2 | PostgreSQL database + user setup | NOT YET |
| 3 | Cloudflare DNS + Nginx reverse proxy + SSL | NOT YET |
| 4 | Deploy pipeline (deploy script or GitHub Actions) | NOT YET |
| 5 | Buffer / troubleshooting | NOT YET |

**Milestone:** Server is live, domain resolves, deploy pipeline works.

---

## Phase 1 — Migration & Payload CMS Setup

**Duration: 1–1.5 weeks**
**Start: Day 4 (overlaps with Phase 0 end)**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 4–5 | Remove Cloudflare Pages packages, clean up config | [✅DONE] |
| 6 | Upgrade Next.js 14 → 15, fix breaking changes | [✅DONE] |
| 7–8 | Install Payload CMS, configure `payload.config.ts`, define collections | [✅DONE] |
| 9 | Run DB migrations, create admin user, test `/admin` | [✅DONE] |
| 10 | Migrate existing hardcoded data (FAQ, gallery, links) to Payload | [✅DONE] |
| 11 | First production deploy to VPS, smoke test everything | NOT YET |

**Milestone:** Site is live on VPS. `/admin` works. Brother can log in and see content.

---

## Phase 2 — Landing Page Refresh

**Duration: 1–1.5 weeks**
**Start: Week 2**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 12 | Design audit — list all visual issues per section | [✅DONE] |
| 13 | Color system + typography standardization in Tailwind config | [✅DONE] |
| 14–15 | Hero section redesign + entrance animation | [✅DONE] |
| 16 | Scroll-triggered animations for Why, Facilities, FAQ sections | [✅DONE] |
| 17 | Mobile polish pass (375px review) | [✅DONE] |
| 18 | CTA + button consistency pass | [✅DONE] |
| 19 | Connect FAQ, gallery, site settings to Payload (dynamic) | IN PROGRESS |
| 20 | Review, QA, deploy | IN PROGRESS |

**Milestone:** Landing page looks polished, feels premium. Content editable by brother in Payload.

---

## Phase 3 — /links Page

**Duration: 3–4 days**
**Start: Week 3 (can overlap with Phase 2 end)**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 21 | Build `/links` page layout (mobile-first) | [✅DONE] |
| 22 | Connect to Payload `links` collection (dynamic, ordered) | [✅DONE] |
| 23 | Add announcement banner support | NOT YET |
| 24 | Populate initial links in Payload, onboard brother | [✅DONE] |

**Milestone:** `/links` page is live. Brother manages it independently with zero code.

---

## Phase 4 — Booking System

**Duration: 3–3.5 weeks**
**Start: Week 4**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 25–26 | Payload hooks: `beforeValidate` (bookingCode, pricing), `beforeChange` (DB transaction overlap check) | [✅DONE] |
| 27 | Payload hooks: `afterChange` (WhatsApp notification, coupon lifecycle on cancel/expire) | [✅DONE] |
| 28 | Custom routes: `GET /api/availability` + `POST /api/coupons/validate` | [✅DONE] |
| 29–30 | Date picker / availability calendar component (frontend) | [✅DONE] |
| 31–32 | Booking form (all fields, Zod validation, > 8 guest warning, coupon input) | [✅DONE] |
| 33–34 | Booking confirmation page (`/booking/[bookingCode]`) + bank transfer details + payment deadline | [✅DONE] |
| 35–36 | Payload admin config: booking list filters, status/payment controls, blockedDates, coupons | [✅DONE] |
| 37 | Auto-expiry scheduled task (node-cron via Payload Local API) | [✅DONE] |
| 38–39 | End-to-end test: full booking flow including coupon + expiry | [✅DONE] |
| 40–41 | Bug fixes, edge cases (double booking race condition, coupon lifecycle) | [✅DONE] |

**Milestone:** Guest can book online with optional coupon. Owner gets notified. Unpaid bookings auto-expire. Owner manages everything in `/admin`.

---

## Phase 5 — Polish & Hardening

**Duration: 1 week**
**Start: Week 8**

| Day | Task | Checklist |
| ----- | ------ | ----------- |
| 44 | Cloudflare cache rules for static assets | NOT YET |
| 45 | SEO: metadata, Open Graph, sitemap, robots.txt | NOT YET |
| 46 | Nginx rate limiting on booking endpoint + security headers | NOT YET |
| 47 | Database backup setup (daily cron, 14-day retention) | NOT YET |
| 48 | Error handling + user-facing error messages | NOT YET |
| 49 | Uptime monitoring (UptimeRobot) | NOT YET |
| 50–51 | Final QA pass on all devices, deploy | NOT YET |

**Milestone:** Production-ready. Stable. Monitored.

---

## Summary

| Phase | What | Duration | End of Week | Checklist |
| ------- | ------ | ---------- | ------------- | ----------- |
| 0 | VPS Setup | 3–5 days | Week 1 | NOT YET |
| 1 | Migration + Payload CMS | 1–1.5 weeks | Week 2 | [✅DONE] |
| 2 | Landing Page Refresh | 1–1.5 weeks | Week 3 | [✅DONE] |
| 3 | /links Page | 3–4 days | Week 3–4 | [✅DONE] |
| 4 | Booking System + Coupons | 3–3.5 weeks | Week 7 | [✅DONE] |
| 5 | Polish & Hardening | 1 week | Week 8–9 | NOT YET |

**Total: ~8–9 weeks** (part-time, ~2–3 hours/day)
**If full-time: ~4–5 weeks**

---

## Future Phases (No Timeline)

| Phase | Feature | Checklist |
| ------- | --------- | ----------- |
| 11 | Weekend/Peak pricing support | NOT YET |
| 12 | Extra services (Airport transfer, breakfast) | NOT YET |
| 13 | Payment receipt upload for guests | NOT YET |
| 14 | Multi-language support (ID/EN) | NOT YET |
| 15 | Nearby attractions landing section | NOT YET |

---

## Key Decision Points

**Before Phase 1:**

- Confirm VPS specs (RAM, CPU) — minimum 2GB RAM recommended
- Confirm domain DNS access in Cloudflare

**Before Phase 4:**

- Finalize bank account details for transfer info page
- Decide: manual WhatsApp notification or Fonnte API integration
- Confirm pricing logic (flat rate, weekend premium, etc.)

**Before Phase 6 (future):**

- Register Midtrans/Xendit merchant account (requires business documents)
