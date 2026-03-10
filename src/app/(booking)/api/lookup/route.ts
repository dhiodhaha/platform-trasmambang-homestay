import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { bookingCode, phone } = await req.json()

    if (!bookingCode || !phone) {
      return NextResponse.json(
        { message: 'Kode booking dan nomor WhatsApp diperlukan' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'bookings',
      where: { bookingCode: { equals: bookingCode.trim().toUpperCase() } },
      limit: 1,
    })

    const booking = docs[0]

    // Normalize phone numbers for comparison (strip non-digit chars)
    const normalize = (p: string) => p.replace(/\D/g, '')
    const phoneMatches = booking && normalize(booking.phone) === normalize(phone)

    if (!booking || !phoneMatches) {
      // Return a generic error to prevent enumeration
      return NextResponse.json(
        { message: 'Kode booking atau nomor WhatsApp tidak cocok. Silakan periksa kembali.' },
        { status: 404 },
      )
    }

    // Only return the unguessable slugId — no sensitive booking details
    return NextResponse.json({ slugId: booking.slugId })
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
