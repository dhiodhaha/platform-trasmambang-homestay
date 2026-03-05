import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { BookingConfirmation } from './BookingConfirmation'

type Args = { params: Promise<{ id: string }> }

async function findBookingBySlug(slugId: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'bookings',
    where: { slugId: { equals: slugId } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { id } = await paramsPromise
  const booking = await findBookingBySlug(id)

  return {
    title: booking
      ? `Booking ${booking.bookingCode} - Trasmambang Homestay`
      : 'Booking - Trasmambang Homestay',
  }
}

export default async function BookingConfirmationPage({ params: paramsPromise }: Args) {
  const { id: slugId } = await paramsPromise
  const booking = await findBookingBySlug(slugId)

  if (!booking) return notFound()

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <BookingConfirmation
          booking={{
            slugId: booking.slugId!,
            bookingCode: booking.bookingCode!,
            guestName: booking.guestName,
            phone: booking.phone,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            numGuests: booking.numGuests,
            bookingStatus: booking.bookingStatus!,
            paymentStatus: booking.paymentStatus!,
            totalPrice: booking.totalPrice ?? 0,
            discountAmount: booking.discountAmount ?? 0,
            couponCode: booking.couponCode ?? undefined,
            finalPrice: booking.finalPrice ?? 0,
            transferCode: booking.transferCode ?? undefined,
            transferAmount: booking.transferAmount ?? undefined,
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
    </div>
  )
}
