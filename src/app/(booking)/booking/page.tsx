import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BookingForm } from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Booking - Trasmambang Homestay',
  description: 'Pesan kamar di Trasmambang Homestay',
}

type Props = {
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>
}

export default async function BookingPage({ searchParams: searchParamsPromise }: Props) {
  const searchParams = await searchParamsPromise
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const { docs: bookings } = await payload.find({
    collection: 'bookings',
    where: { bookingStatus: { in: ['pending', 'confirmed'] } },
    limit: 100,
    select: { checkIn: true, checkOut: true },
  })

  const { docs: blocked } = await payload.find({
    collection: 'blocked-dates',
    limit: 100,
    select: { startDate: true, endDate: true },
  })

  const unavailableDates = [
    ...bookings.map((b) => ({ start: b.checkIn!, end: b.checkOut! })),
    ...blocked.map((b) => ({ start: b.startDate!, end: b.endDate! })),
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-10 text-center">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#122023]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Selesaikan Pemesanan
          </h1>
          <p className="mt-3 text-lg text-[#6B6B6B]">
            Hanya beberapa langkah lagi untuk menginap di Trasmambang.
          </p>
        </div>

        <BookingForm
          pricePerNight={settings.pricePerNight || 0}
          standardCapacity={settings.standardCapacity || 8}
          maxCapacity={settings.maxCapacity || 12}
          minAdvanceDays={settings.minAdvanceDays || 1}
          unavailableDates={unavailableDates}
          initialCheckIn={searchParams.checkIn}
          initialCheckOut={searchParams.checkOut}
          bookingExpiryHours={settings.bookingExpiryHours || 24}
        />
      </div>
    </div>
  )
}
