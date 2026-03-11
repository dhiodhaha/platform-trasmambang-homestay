'use client'

import React, { useState } from 'react'
import posthog from 'posthog-js'

type CouponDiscount = {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscountAmount: number | null
}

type Props = {
  nights: number
  onApply: (discount: CouponDiscount) => void
  onRemove: () => void
}

export function CouponInput({ nights, onApply, onRemove }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), nights }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        posthog.capture('coupon_apply_failed', {
          coupon_code: code.trim().toUpperCase(),
          error: data.error,
          nights,
        })
        return
      }

      const appliedCode = code.trim().toUpperCase()
      setApplied(appliedCode)
      onApply({
        code: appliedCode,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscountAmount: data.maxDiscountAmount,
      })
      posthog.capture('coupon_applied', {
        coupon_code: appliedCode,
        discount_type: data.discountType,
        discount_value: data.discountValue,
        nights,
      })
    } catch {
      setError('Gagal memvalidasi kupon')
      posthog.captureException(new Error('Coupon validation request failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    setError(null)
    onRemove()
  }

  if (applied) {
    return (
      <div className="mb-6 flex items-center justify-between rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E8C4A0]/30 p-4 sm:p-5 transition-all animate-in fade-in zoom-in-95 duration-300">
        <span className="text-[15px] font-medium text-[#122023] flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E8C4A0]/20 text-[#8C6D4A]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          Promo{' '}
          <span className="font-bold tracking-tight bg-[#F5F5F5] px-2 py-0.5 rounded-md uppercase">
            {applied}
          </span>{' '}
          berhasil dipakai
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
        >
          Batalkan
        </button>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
        Punya kode promo?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CONTOH: MANTAP10"
          className="flex-1 rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300 uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-2xl bg-[#122023] px-8 py-4 text-[15px] font-semibold tracking-wide text-white hover:bg-black focus:ring-4 focus:ring-black/10 disabled:opacity-40 disabled:hover:bg-[#122023] transition-all duration-300 w-full sm:w-auto text-center shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
        >
          {loading ? 'Memvalidasi...' : 'Gunakan'}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-[13px] text-red-500 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {error}
        </p>
      )}
    </div>
  )
}
