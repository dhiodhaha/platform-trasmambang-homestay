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
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Pesan Kamar</h1>
      <p className="mb-8 text-gray-600">
        Pilih tanggal dan isi data diri untuk memesan Trasmambang Homestay.
      </p>
      <BookingForm
        pricePerNight={settings.pricePerNight || 0}
        standardCapacity={settings.standardCapacity || 8}
        maxCapacity={settings.maxCapacity || 12}
        minAdvanceDays={settings.minAdvanceDays || 1}
        unavailableDates={unavailableDates}
        initialCheckIn={searchParams.checkIn}
        initialCheckOut={searchParams.checkOut}
      />
    </div>
  )
}
