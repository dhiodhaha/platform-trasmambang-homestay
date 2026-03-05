'use client'

import React, { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import Link from 'next/link'
import { AvailabilityCalendar } from '@/components/Calendar'

type UnavailableRange = { start: string; end: string }

function getPendingBookingId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pending_booking=([^;]+)/)
  return match ? match[1] : null
}

export default function AvailabilityWidget() {
  const [unavailableDates, setUnavailableDates] = useState<UnavailableRange[]>([])
  const [range, setRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null)

  useEffect(() => {
    setPendingBookingId(getPendingBookingId())
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => setUnavailableDates(data.unavailableDates || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const bookingUrl =
    range?.from && range?.to
      ? `/booking?checkIn=${formatLocalDate(range.from)}&checkOut=${formatLocalDate(range.to)}`
      : '/booking'

  if (pendingBookingId) {
    return (
      <div className="space-y-6">
        <div>
          <h3
            className="mb-2 text-2xl font-normal tracking-[-0.02em] text-white"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Booking Menunggu Pembayaran
          </h3>
          <p className="text-sm text-white/50">
            Anda memiliki booking yang belum dibayar. Selesaikan pembayaran sebelum batas waktu.
          </p>
        </div>
        <Link
          href={`/b/${pendingBookingId}`}
          className="block w-full rounded-full bg-[#E8C4A0] px-8 py-4 text-center text-sm font-medium uppercase tracking-wide text-[#122023] transition-colors hover:bg-[#ddb78f]"
        >
          Selesaikan Pembayaran
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="mb-2 text-2xl font-normal tracking-[-0.02em] text-white"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Cek Ketersediaan
        </h3>
        <p className="text-sm text-white/50">
          Pilih tanggal untuk melihat ketersediaan, lalu lanjut ke halaman booking
        </p>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-white/40">Memuat kalender...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-4 sm:p-5 flex justify-center w-full max-w-[350px] sm:max-w-none mx-auto shadow-sm">
          <AvailabilityCalendar
            unavailableDates={unavailableDates}
            minAdvanceDays={1} // Assuming 1 is default for widget
            initialRange={range}
            onSelect={setRange}
          />
        </div>
      )}

      {range?.from && range?.to && (
        <div className="text-sm text-white/70 space-y-1">
          <p>
            Check-in: <span className="font-medium text-white">{range.from.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
          <p>
            Check-out: <span className="font-medium text-white">{range.to.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
          <p className="text-white/50">
            untuk {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))} malam
          </p>
        </div>
      )}

      <Link
        href={bookingUrl}
        className="block w-full rounded-full bg-[#E8C4A0] px-8 py-4 text-center text-sm font-medium uppercase tracking-wide text-[#122023] transition-colors hover:bg-[#ddb78f]"
      >
        {range?.from && range?.to ? 'Lanjut ke Booking' : 'Pesan Sekarang'}
      </Link>
    </div>
  )
}
