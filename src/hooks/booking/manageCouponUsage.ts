import type { CollectionAfterChangeHook } from 'payload'

export const manageCouponUsage: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !previousDoc) return doc

  const statusChanged = doc.bookingStatus !== previousDoc.bookingStatus
  const isCancelled = ['cancelled', 'expired'].includes(doc.bookingStatus)

  if (statusChanged && isCancelled && doc.couponCode) {
    const { docs: coupons } = await req.payload.find({
      collection: 'coupons',
      where: { code: { equals: doc.couponCode } },
      limit: 1,
      req,
    })
    const coupon = coupons[0]
    if (coupon && (coupon.usedCount ?? 0) > 0) {
      await req.payload.update({
        collection: 'coupons',
        id: coupon.id,
        data: { usedCount: (coupon.usedCount ?? 0) - 1 },
        req,
      })
    }
  }

  return doc
}
