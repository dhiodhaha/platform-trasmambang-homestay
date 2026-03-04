'use client'

import React from 'react'

type Props = {
  pricePerNight: number
  nights: number
  totalPrice: number
  discountAmount: number
  couponCode?: string
  finalPrice: number
}

function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`
}

export function OrderSummary({
  pricePerNight,
  nights,
  totalPrice,
  discountAmount,
  couponCode,
  finalPrice,
}: Props) {
  return (
    <div className="rounded-md border bg-gray-50 p-4">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>
            {formatRupiah(pricePerNight)} x {nights} malam
          </span>
          <span>{formatRupiah(totalPrice)}</span>
        </div>

        {discountAmount > 0 && couponCode && (
          <div className="flex justify-between text-green-600">
            <span>Diskon ({couponCode})</span>
            <span>-{formatRupiah(discountAmount)}</span>
          </div>
        )}

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatRupiah(finalPrice)}</span>
        </div>
      </div>
    </div>
  )
}
