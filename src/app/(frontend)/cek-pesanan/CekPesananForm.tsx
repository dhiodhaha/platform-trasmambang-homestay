'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CekPesananForm() {
  const router = useRouter()
  const [bookingCode, setBookingCode] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingCode: bookingCode.trim(), phone: phone.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Terjadi kesalahan, silakan coba lagi.')
        return
      }

      router.push(`/b/${data.slugId}`)
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi internet Anda.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="bookingCode"
          className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase"
        >
          Kode Booking <span className="text-red-500">*</span>
        </label>
        <input
          id="bookingCode"
          type="text"
          value={bookingCode}
          onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
          required
          autoComplete="off"
          placeholder="TRB-XXXXXXXX"
          className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium font-mono text-[#122023] placeholder:text-black/25 placeholder:font-sans placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300 tracking-widest"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase"
        >
          Nomor WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="08xxxxxxxxxx"
          className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/25 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300"
        />
        <p className="mt-2 text-xs text-[#9B9B9B]">
          Gunakan nomor yang sama dengan yang Anda daftarkan saat memesan.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !bookingCode.trim() || !phone.trim()}
        className="w-full rounded-full bg-[#122023] px-8 py-5 text-center text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
      >
        {isLoading ? 'Mencari Pesanan...' : 'Cek Pesanan'}
      </button>
    </form>
  )
}
