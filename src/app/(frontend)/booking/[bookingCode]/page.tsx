import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { BookingConfirmation } from './BookingConfirmation'

type Args = { params: Promise<{ bookingCode: string }> }

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { bookingCode } = await paramsPromise
  return {
    title: `Booking ${bookingCode} - Trasmambang Homestay`,
  }
}

export default async function BookingConfirmationPage({ params: paramsPromise }: Args) {
  const { bookingCode } = await paramsPromise
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'bookings',
    where: { bookingCode: { equals: bookingCode } },
    limit: 1,
  })

  const booking = docs[0]
  if (!booking) return notFound()

  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <BookingConfirmation
        booking={{
          bookingCode: booking.bookingCode!,
          guestName: booking.guestName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          numGuests: booking.numGuests,
          bookingStatus: booking.bookingStatus!,
          paymentStatus: booking.paymentStatus!,
          totalPrice: booking.totalPrice ?? 0,
          discountAmount: booking.discountAmount ?? 0,
          couponCode: booking.couponCode ?? undefined,
          finalPrice: booking.finalPrice ?? 0,
          createdAt: booking.createdAt,
        }}
        bank={{
          name: settings.bankName || '-',
          accountNumber: settings.bankAccountNumber || '-',
          accountName: settings.bankAccountName || '-',
        }}
        whatsappNumber={settings.whatsappNumber || ''}
        expiryHours={settings.bookingExpiryHours || 24}
      />
    </div>
  )
}
