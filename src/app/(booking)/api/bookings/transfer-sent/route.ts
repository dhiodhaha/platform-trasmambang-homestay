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

    // Only allow updating if it is unpaid
    if (booking.paymentStatus !== 'unpaid') {
      return NextResponse.json(
        { message: 'Status pembayaran tidak valid untuk aksi ini' },
        { status: 400 },
      )
    }

    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { paymentStatus: 'transfer_sent' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
