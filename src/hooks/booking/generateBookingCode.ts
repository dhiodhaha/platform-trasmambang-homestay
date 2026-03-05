import type { CollectionBeforeValidateHook } from 'payload'

export const generateBookingCode: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data

  // Generate unguessable slug ID for URL usage
  data.slugId = crypto.randomUUID()

  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `TM-${yy}${mm}`

  const { totalDocs } = await req.payload.find({
    collection: 'bookings',
    where: { bookingCode: { like: `${prefix}%` } },
    limit: 0,
  })

  const seq = String(totalDocs + 1).padStart(3, '0')
  data.bookingCode = `${prefix}-${seq}`

  return data
}
