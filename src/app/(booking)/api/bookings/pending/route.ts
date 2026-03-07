import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

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

    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const expiryHours = settings.bookingExpiryHours || 24

    return NextResponse.json({
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      expiryHours,
    })
  } catch (error) {
    console.error('Error fetching pending booking:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
