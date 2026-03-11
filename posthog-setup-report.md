# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Trasmambang Homestay booking platform. The following changes were made:

- **`instrumentation-client.ts`** (created) — Client-side PostHog initialization using Next.js 15.3+ instrumentation pattern with `/ingest` reverse proxy and automatic exception capture.
- **`src/lib/posthog-server.ts`** (created) — Server-side PostHog client factory (`getPostHogClient`) used by API routes for server-to-PostHog event delivery.
- **`next.config.js`** (modified) — Added PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true`.
- **`.env.local`** (modified) — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`src/components/BookingForm/coupon-input.tsx`** (modified) — Tracks coupon application success and failure.
- **`src/components/BookingForm/index.tsx`** (modified) — Tracks booking form review step, submission success, and submission failure.
- **`src/app/(booking)/b/[id]/BookingConfirmation.tsx`** (modified) — Tracks transfer confirmation and booking cancellation.
- **`src/app/(frontend)/cek-pesanan/CekPesananForm.tsx`** (modified) — Tracks booking lookup attempts and failures.
- **`src/Landing/components/cta.tsx`** (modified) — Tracks WhatsApp CTA button clicks.
- **`src/Landing/components/availability-widget.tsx`** (modified) — Tracks date selection and booking CTA clicks.
- **`src/app/(booking)/api/bookings/cancel/route.ts`** (modified) — Server-side tracking of booking cancellations.
- **`src/app/(booking)/api/bookings/transfer-sent/route.ts`** (modified) — Server-side tracking of transfer sent status updates.

## Events

| Event Name | Description | File |
|---|---|---|
| `booking_dates_selected` | User selects check-in and check-out dates on the availability widget | `src/Landing/components/availability-widget.tsx` |
| `booking_cta_clicked` | User clicks the 'Pesan' (Book Now) button on the availability widget | `src/Landing/components/availability-widget.tsx` |
| `booking_form_reviewed` | User advances from the booking form to the review/confirmation step | `src/components/BookingForm/index.tsx` |
| `booking_submitted` | User confirms and submits the booking form, creating a new booking | `src/components/BookingForm/index.tsx` |
| `booking_submit_failed` | Booking form submission fails with a server or validation error | `src/components/BookingForm/index.tsx` |
| `coupon_applied` | User successfully applies a coupon code during booking | `src/components/BookingForm/coupon-input.tsx` |
| `coupon_apply_failed` | User attempts to apply a coupon but it is invalid or not applicable | `src/components/BookingForm/coupon-input.tsx` |
| `transfer_sent_confirmed` | Guest clicks 'Saya Sudah Transfer' to mark payment as sent | `src/app/(booking)/b/[id]/BookingConfirmation.tsx` |
| `booking_cancelled` | Guest cancels their pending booking from the confirmation page | `src/app/(booking)/b/[id]/BookingConfirmation.tsx` |
| `whatsapp_cta_clicked` | User clicks a WhatsApp contact button on the landing page CTA section | `src/Landing/components/cta.tsx` |
| `booking_lookup_searched` | User submits the 'Cek Pesanan' form to look up an existing booking | `src/app/(frontend)/cek-pesanan/CekPesananForm.tsx` |
| `booking_lookup_failed` | User's booking lookup fails (not found or server error) | `src/app/(frontend)/cek-pesanan/CekPesananForm.tsx` |
| `booking_cancelled_server` | Server-side: a booking is successfully cancelled via the cancel API route | `src/app/(booking)/api/bookings/cancel/route.ts` |
| `transfer_sent_updated_server` | Server-side: payment status updated to transfer_sent via the transfer-sent API route | `src/app/(booking)/api/bookings/transfer-sent/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/337557/dashboard/1347087
- **Booking Conversion Funnel**: https://us.posthog.com/project/337557/insights/GPpmgIQR
- **Booking Activity (30d)**: https://us.posthog.com/project/337557/insights/awDrJCwb
- **Coupon Usage vs Failure**: https://us.posthog.com/project/337557/insights/RRGFIEhb
- **Booking Submit Errors**: https://us.posthog.com/project/337557/insights/IeMq5K6f
- **WhatsApp CTA vs Booking CTA Clicks**: https://us.posthog.com/project/337557/insights/5Q3wVjLJ

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
