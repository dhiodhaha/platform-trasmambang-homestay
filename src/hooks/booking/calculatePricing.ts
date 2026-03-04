import type { CollectionBeforeValidateHook } from 'payload'

export const calculatePricing: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.checkIn || !data?.checkOut) return data

  const settings = await req.payload.findGlobal({ slug: 'site-settings' })
  const pricePerNight = settings.pricePerNight || 0

  const checkIn = new Date(data.checkIn)
  const checkOut = new Date(data.checkOut)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  if (nights < 1) throw new Error('Check-out harus setelah check-in')

  data.totalPrice = nights * pricePerNight

  if (data.couponCode) {
    const { docs: coupons } = await req.payload.find({
      collection: 'coupons',
      where: { code: { equals: data.couponCode.toUpperCase().trim() } },
      limit: 1,
    })

    const coupon = coupons[0]
    if (coupon) {
      let discount = 0
      if (coupon.discountType === 'percentage') {
        discount = data.totalPrice * (coupon.discountValue / 100)
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount
        }
      } else {
        discount = coupon.discountValue
      }
      data.discountAmount = Math.min(discount, data.totalPrice)
    }
  } else {
    data.discountAmount = 0
  }

  data.finalPrice = data.totalPrice - (data.discountAmount || 0)
  return data
}
