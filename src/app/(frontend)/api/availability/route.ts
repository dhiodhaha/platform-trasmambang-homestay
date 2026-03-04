import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config })

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
    ...bookings.map((b) => ({
      start: b.checkIn,
      end: b.checkOut,
      type: 'booked' as const,
    })),
    ...blocked.map((b) => ({
      start: b.startDate,
      end: b.endDate,
      type: 'blocked' as const,
    })),
  ]

  return NextResponse.json({ unavailableDates })
}
