'use client'

import React, { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import Link from 'next/link'
import { AvailabilityCalendar } from '@/components/Calendar'
import { MessageCircle, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type UnavailableRange = { start: string; end: string }

function getPendingBookingId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pending_booking=([^;]+)/)
  return match ? match[1] : null
}

type AvailabilityWidgetProps = {
  isAutomatedBookingEnabled?: boolean
  whatsappNumber: string
}

export default function AvailabilityWidget({
  isAutomatedBookingEnabled = true,
  whatsappNumber,
}: AvailabilityWidgetProps) {
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

  const formatLocalDateForUrl = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const bookingUrl =
    range?.from && range?.to
      ? `/booking?checkIn=${formatLocalDateForUrl(range.from)}&checkOut=${formatLocalDateForUrl(range.to)}`
      : '/booking'

  if (pendingBookingId) {
    return (
      <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 w-full max-w-2xl mx-auto shadow-2xl border border-white/20">
        <div className="text-center">
          <h3
            className="mb-2 text-2xl font-normal tracking-[-0.02em] text-white"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Booking Menunggu Pembayaran
          </h3>
          <p className="text-sm text-white/80">
            Anda memiliki booking yang belum dibayar. Selesaikan pembayaran sebelum batas waktu.
          </p>
        </div>
        <Link
          href={`/b/${pendingBookingId}`}
          className="block w-full sm:w-auto rounded-full bg-[#E8C4A0] px-8 py-4 text-center text-sm font-medium uppercase tracking-wide text-[#122023] transition-colors hover:bg-[#ddb78f]"
        >
          Selesaikan Pembayaran
        </Link>
      </div>
    )
  }

  if (!isAutomatedBookingEnabled) {
    return (
      <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 w-full max-w-2xl mx-auto shadow-2xl border border-white/20 text-center">
        <div>
          <h3
            className="mb-3 text-2xl font-normal tracking-[-0.02em] text-white"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Pemesanan Otomatis Ditutup
          </h3>
          <p className="text-sm text-white/80">
            Mohon maaf, sistem pemesanan via website sedang kami tutup sementara.
          </p>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}?text=Halo%2C%20saya%20ingin%20cek%20ketersediaan%20kamar%20di%20Trasmambang%20Homestay.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-[#128C7E] px-8 py-4 text-center text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#075E54]"
        >
          <MessageCircle className="w-5 h-5" />
          Hubungi via WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full p-2 w-full max-w-3xl mx-auto shadow-2xl border border-gray-100 relative z-20">
      <div className="flex w-full md:w-auto flex-1 flex-col md:flex-row relative">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex-1 flex flex-col items-start px-6 py-3 hover:bg-gray-100 rounded-full transition-colors w-full text-left">
              <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                Check-in
              </span>
              <span className="text-sm text-gray-500 truncate mt-0.5">
                {range?.from
                  ? range.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : 'Tanggal'}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 rounded-2xl border-none shadow-2xl"
            align="start"
            sideOffset={16}
          >
            <div className="bg-[#FAFAFA] rounded-xl border border-black/5 p-2 shadow-sm">
              <AvailabilityCalendar
                unavailableDates={unavailableDates}
                minAdvanceDays={1}
                initialRange={range}
                onSelect={setRange}
              />
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-[1px] h-10 bg-gray-200 self-center absolute left-1/2 -translate-x-1/2" />
        <div className="block md:hidden h-[1px] w-[calc(100%-32px)] bg-gray-200 self-center my-1" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex-1 flex flex-col items-start px-6 py-3 hover:bg-gray-100 rounded-full transition-colors w-full text-left">
              <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                Check-out
              </span>
              <span className="text-sm text-gray-500 truncate mt-0.5">
                {range?.to
                  ? range.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : 'Tanggal'}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 rounded-2xl border-none shadow-2xl"
            align="end"
            sideOffset={16}
          >
            <div className="bg-[#FAFAFA] rounded-xl border border-black/5 p-2 shadow-sm">
              <AvailabilityCalendar
                unavailableDates={unavailableDates}
                minAdvanceDays={1}
                initialRange={range}
                onSelect={setRange}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Link
        href={bookingUrl}
        className="w-full md:w-auto mt-2 md:mt-0 flex items-center justify-center bg-[#E8C4A0] hover:bg-[#ddb78f] text-[#122023] rounded-full px-6 py-4 transition-all duration-300 md:min-w-[140px]"
      >
        <span className="text-sm font-bold tracking-wide flex items-center gap-2">
          <Search className="w-4 h-4" />
          {range?.from && range?.to ? 'Cari' : 'Cari'}
        </span>
      </Link>
    </div>
  )
}
