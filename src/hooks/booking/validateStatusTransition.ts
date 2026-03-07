import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'

const TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled', 'expired'],
  confirmed: ['completed', 'cancelled'],
  cancelled: [],
  expired: [],
  completed: [],
}

export const validateStatusTransition: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
  originalDoc,
  context,
}) => {
  if (operation !== 'update' || !data?.bookingStatus || !originalDoc) return data

  // Allow admins to bypass strict status transition rules
  if (context?.skipBookingHooks || req.user) return data

  if (context?.skipBookingHooks) return data

  const from = originalDoc.bookingStatus
  const to = data.bookingStatus

  if (from === to) return data

  const allowed = TRANSITIONS[from] || []
  if (!allowed.includes(to)) {
    throw new ValidationError({
      errors: [
        {
          message: `Tidak bisa mengubah status dari "${from}" ke "${to}"`,
          path: 'bookingStatus',
        },
      ],
    })
  }

  return data
}
