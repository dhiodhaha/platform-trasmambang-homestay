import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'

const BLOCKING_STATUSES = ['pending', 'confirmed']

export const checkDateOverlap: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data
  if (!data?.checkIn || !data?.checkOut) return data

  // Check against existing bookings
  const { docs: conflicting } = await req.payload.find({
    collection: 'bookings',
    where: {
      and: [
        { bookingStatus: { in: BLOCKING_STATUSES } },
        { checkIn: { less_than: data.checkOut } },
        { checkOut: { greater_than: data.checkIn } },
      ],
    },
    limit: 1,
    req,
  })

  if (conflicting.length > 0) {
    throw new ValidationError({
      errors: [
        {
          message: 'Tanggal sudah dipesan, silakan pilih tanggal lain',
          path: 'checkIn',
        },
      ],
    })
  }

  // Check against blocked dates
  const { docs: blocked } = await req.payload.find({
    collection: 'blocked-dates',
    where: {
      and: [
        { startDate: { less_than: data.checkOut } },
        { endDate: { greater_than: data.checkIn } },
      ],
    },
    limit: 1,
    req,
  })

  if (blocked.length > 0) {
    throw new ValidationError({
      errors: [
        {
          message: 'Tanggal tidak tersedia, silakan pilih tanggal lain',
          path: 'checkIn',
        },
      ],
    })
  }

  // Increment coupon usedCount within the same transaction
  if (data.couponCode) {
    const { docs: coupons } = await req.payload.find({
      collection: 'coupons',
      where: { code: { equals: data.couponCode.toUpperCase().trim() } },
      limit: 1,
      req,
    })
    if (coupons[0]) {
      await req.payload.update({
        collection: 'coupons',
        id: coupons[0].id,
        data: { usedCount: (coupons[0].usedCount || 0) + 1 },
        req,
      })
    }
  }

  return data
}
