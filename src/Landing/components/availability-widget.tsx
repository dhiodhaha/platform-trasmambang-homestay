'use client'

import React, { useEffect, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import Link from 'next/link'

type UnavailableRange = { start: string; end: string }

export default function AvailabilityWidget() {
  const [unavailableDates, setUnavailableDates] = useState<UnavailableRange[]>([])
  const [range, setRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => setUnavailableDates(data.unavailableDates || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const disabledDays = [
    { before: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    ...unavailableDates.map((d) => ({
      from: new Date(d.start),
      to: new Date(new Date(d.end).getTime() - 24 * 60 * 60 * 1000),
    })),
  ]

  const bookingUrl =
    range?.from && range?.to
      ? `/booking?checkIn=${range.from.toISOString().split('T')[0]}&checkOut=${range.to.toISOString().split('T')[0]}`
      : '/booking'

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
        <div className="overflow-x-auto rounded-xl bg-white p-4">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={disabledDays}
            numberOfMonths={1}
            showOutsideDays
          />
        </div>
      )}

      {range?.from && range?.to && (
        <p className="text-sm text-white/70">
          {range.from.toLocaleDateString('id-ID')} — {range.to.toLocaleDateString('id-ID')} (
          {Math.ceil(
            (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
          )}{' '}
          malam)
        </p>
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
