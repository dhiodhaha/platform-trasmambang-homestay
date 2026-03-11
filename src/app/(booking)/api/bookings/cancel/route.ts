import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(req: NextRequest) {
  try {
    const { slugId } = await req.json()

    if (!slugId) {
      return NextResponse.json({ message: 'ID booking diperlukan' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'bookings',
      where: { slugId: { equals: slugId } },
      limit: 1,
    })

    const booking = docs[0]
    if (!booking) {
      return NextResponse.json({ message: 'Booking tidak ditemukan' }, { status: 404 })
    }

    if (booking.bookingStatus !== 'pending') {
      return NextResponse.json(
        { message: 'Hanya booking dengan status pending yang bisa dibatalkan' },
        { status: 400 },
      )
    }

    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { bookingStatus: 'cancelled' },
    })

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: booking.phone || slugId,
      event: 'booking_cancelled_server',
      properties: {
        booking_code: booking.bookingCode,
        slug_id: slugId,
        guest_name: booking.guestName,
        final_price: booking.finalPrice,
      },
    })
    await posthog.shutdown()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
