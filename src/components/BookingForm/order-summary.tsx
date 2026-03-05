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
    <div className="rounded-2xl border border-black/5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="space-y-4 text-[15px] text-[#122023]">
        <div className="flex justify-between items-center group">
          <span className="text-[#6B6B6B] transition-colors group-hover:text-[#122023]">
            {formatRupiah(pricePerNight)} <span className="text-xs mx-1 opacity-50">x</span>{' '}
            {nights} malam
          </span>
          <span className="font-medium text-[#122023]">{formatRupiah(totalPrice)}</span>
        </div>

        {discountAmount > 0 && couponCode && (
          <div className="flex justify-between items-center text-[#d97706] bg-[#fffbeb] border border-[#fef3c7] -mx-3 px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
              Diskon ({couponCode})
            </span>
            <span className="font-bold tracking-tight">-{formatRupiah(discountAmount)}</span>
          </div>
        )}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-black/15"></div>
          </div>
        </div>

        <div className="flex justify-between items-end pt-1">
          <span
            className="text-lg font-medium text-[#122023]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Total Pembayaran
          </span>
          <span className="text-[26px] leading-none font-semibold tracking-tight text-[#122023]">
            {formatRupiah(finalPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}
