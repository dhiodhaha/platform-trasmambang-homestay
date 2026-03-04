import type { TaskConfig } from 'payload'

export const expireBookingsTask: TaskConfig<'expireBookings'> = {
  slug: 'expireBookings',
  handler: async ({ req }) => {
    const settings = await req.payload.findGlobal({ slug: 'site-settings' })
    const expiryHours = settings.bookingExpiryHours || 24
    const cutoff = new Date(Date.now() - expiryHours * 60 * 60 * 1000).toISOString()

    const { docs: expired } = await req.payload.find({
      collection: 'bookings',
      where: {
        and: [
          { bookingStatus: { equals: 'pending' } },
          { paymentStatus: { equals: 'unpaid' } },
          { createdAt: { less_than: cutoff } },
        ],
      },
      limit: 100,
    })

    for (const booking of expired) {
      await req.payload.update({
        collection: 'bookings',
        id: booking.id,
        data: { bookingStatus: 'expired' },
      })
    }

    return { output: { expired: expired.length } }
  },
}
