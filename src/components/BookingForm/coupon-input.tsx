'use client'

import React, { useState } from 'react'

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
        return
      }

      setApplied(code.trim().toUpperCase())
      onApply({
        code: code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscountAmount: data.maxDiscountAmount,
      })
    } catch {
      setError('Gagal memvalidasi kupon')
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
      <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3">
        <span className="text-sm font-medium text-green-700">Kupon {applied} diterapkan</span>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-auto text-sm text-red-500 hover:underline"
        >
          Hapus
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium">Punya kode kupon?</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Masukkan kode kupon"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? '...' : 'Pakai'}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
