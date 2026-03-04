import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'

const MAX_PENDING_PER_PHONE = 3

export const preventSpam: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.phone) return data

  const { totalDocs } = await req.payload.find({
    collection: 'bookings',
    where: {
      and: [
        { phone: { equals: data.phone } },
        { bookingStatus: { equals: 'pending' } },
      ],
    },
    limit: 0,
    req,
  })

  if (totalDocs >= MAX_PENDING_PER_PHONE) {
    throw new ValidationError({
      errors: [
        {
          message:
            'Anda sudah memiliki booking yang belum dibayar. Silakan selesaikan pembayaran atau tunggu hingga kedaluwarsa.',
          path: 'phone',
        },
      ],
    })
  }

  return data
}
