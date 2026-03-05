import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { code, nights } = await request.json()

  if (!code) return NextResponse.json({ error: 'Kode kupon diperlukan' }, { status: 400 })

  const { docs } = await payload.find({
    collection: 'coupons',
    where: { code: { equals: code.toUpperCase().trim() } },
    limit: 1,
  })

  const coupon = docs[0]
  const genericError = 'Kode kupon tidak valid atau sudah tidak berlaku'

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: genericError }, { status: 400 })
  }

  const now = new Date()
  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return NextResponse.json({ error: genericError }, { status: 400 })
  }
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return NextResponse.json({ error: genericError }, { status: 400 })
  }
  if (coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses) {
    return NextResponse.json({ error: genericError }, { status: 400 })
  }
  if (coupon.minNights && nights < coupon.minNights) {
    return NextResponse.json(
      { error: `Kode kupon hanya berlaku untuk minimal ${coupon.minNights} malam` },
      { status: 400 },
    )
  }

  return NextResponse.json({
    valid: true,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscountAmount: coupon.maxDiscountAmount || null,
  })
}
