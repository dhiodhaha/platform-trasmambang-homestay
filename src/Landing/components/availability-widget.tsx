'use client'

import React, { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import Link from 'next/link'
import { AvailabilityCalendar } from '@/components/Calendar'
import { MessageCircle, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'

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
  const [activePopover, setActivePopover] = useState<'checkIn' | 'checkOut' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  const handleCalendarSelect = (newRange: DateRange | undefined) => {
    setErrorMessage(null)
    setRange(newRange)

    if (!newRange) {
      // Selection cleared — reset to checkIn
      setActivePopover('checkIn')
    } else if (activePopover === 'checkIn') {
      setActivePopover('checkOut')
    } else if (activePopover === 'checkOut') {
      if (newRange?.from && newRange?.to) {
        setActivePopover(null) // closed when checkOut holds both
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full p-2 w-full max-w-3xl mx-auto shadow-xl border border-gray-200 relative z-20">
      <Popover
        open={activePopover !== null}
        onOpenChange={(open) => {
          if (!open) setActivePopover(null)
        }}
      >
        <PopoverAnchor asChild>
          <div className="flex w-full md:w-auto flex-1 flex-col md:flex-row relative bg-white md:bg-transparent rounded-2xl md:rounded-none">
            <button
              onClick={() => setActivePopover('checkIn')}
              className={`flex-1 flex flex-col items-start px-6 py-3.5 rounded-full transition-all w-full text-left outline-none relative ${
                activePopover === 'checkIn'
                  ? 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-2 ring-[#222] z-10'
                  : 'hover:bg-gray-100 bg-transparent'
              }`}
            >
              <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                Check-in
              </span>
              <span
                className={`text-sm truncate mt-0.5 ${range?.from ? 'text-gray-900 font-medium' : 'text-gray-400 font-light'}`}
              >
                {range?.from
                  ? range.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : 'Tambah Tanggal'}
              </span>
            </button>

            {/* Separator - only show if neither is strictly active in a way that overlaps it */}
            <div className="hidden md:block w-[1px] h-10 bg-gray-200 self-center absolute left-1/2 -translate-x-1/2 z-0" />
            <div className="block md:hidden h-[1px] w-[calc(100%-32px)] bg-gray-200 self-center my-1" />

            <button
              onClick={() => {
                if (!range?.from) {
                  setActivePopover('checkIn')
                } else {
                  setActivePopover('checkOut')
                }
              }}
              className={`flex-1 flex flex-col items-start px-6 py-3.5 rounded-full transition-all w-full text-left outline-none relative ${
                activePopover === 'checkOut'
                  ? 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-2 ring-[#222] z-10'
                  : 'hover:bg-gray-100 bg-transparent'
              }`}
            >
              <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                Check-out
              </span>
              <span
                className={`text-sm truncate mt-0.5 ${range?.to ? 'text-gray-900 font-medium' : 'text-gray-400 font-light'}`}
              >
                {range?.to
                  ? range.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : 'Tambah Tanggal'}
              </span>
            </button>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[calc(100vw-32px)] md:w-auto p-2 rounded-3xl border-none shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden"
          align="center"
          sideOffset={16}
        >
          <div className="bg-[#FAFAFA] rounded-2xl border border-black/5 p-2 font-sans relative">
            <AvailabilityCalendar
              unavailableDates={unavailableDates}
              minAdvanceDays={1}
              selected={range}
              activePopover={activePopover}
              onSelect={handleCalendarSelect}
              onDisabledClick={() => setErrorMessage('Tanggal sudah ada yang booking')}
            />
            {errorMessage && (
              <div className="absolute bottom-16 left-0 right-0 text-center text-sm font-medium text-red-500 max-w-[300px] mx-auto bg-red-50/90 py-1.5 px-3 rounded-full backdrop-blur-sm border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                {errorMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 px-4 pt-2 pb-2">
              <button
                type="button"
                onClick={() => {
                  setRange(undefined)
                  setErrorMessage(null)
                  setActivePopover('checkIn')
                }}
                className="text-sm font-medium underline text-gray-800 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                Bersihkan tanggal
              </button>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-sm font-bold bg-[#122023] text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Link
        href={bookingUrl}
        className="w-full md:w-auto mt-2 md:mt-0 flex items-center justify-center bg-[#E8C4A0] hover:bg-[#ddb78f] text-[#122023] rounded-full px-8 py-4 transition-all duration-300 md:min-w-[140px] z-10 shadow-sm"
      >
        <span className="text-sm font-bold tracking-wide flex items-center gap-2">
          <Search className="w-4 h-4" />
          {range?.from && range?.to ? 'Pesan' : 'Pesan'}
        </span>
      </Link>
    </div>
  )
}
