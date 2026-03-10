'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function getPendingBookingId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pending_booking=([^;]+)/)
  return match ? match[1] : null
}

function useCountdown(deadline: Date | null) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!deadline) return

    function update() {
      if (!deadline) return
      const diff = deadline.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('00:00:00')
        setIsExpired(true)
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return { timeLeft, isExpired }
}

export function PendingBookingBanner() {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null)
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [shouldHide, setShouldHide] = useState(true)
  const pathname = usePathname()

  // Find cookie on mount and pathname change
  useEffect(() => {
    const slug = getPendingBookingId()
    setPendingSlug(slug)

    // Hide automatically on the actual receipt page itself so it doesn't double up
    if (slug && pathname?.includes(`/b/${slug}`)) {
      setShouldHide(true)
      return
    }

    if (!slug) {
      setShouldHide(true)
      return
    }

    // Fetch the booking details
    fetch('/api/bookings/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugId: slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        // If it's already paid, completed, cancelled, or expired, we hide the banner and clear cookie.
        if (data.paymentStatus !== 'unpaid' || data.bookingStatus !== 'pending') {
          document.cookie = 'pending_booking=; path=/; max-age=0'
          setShouldHide(true)
          return
        }

        const expiryLimit = new Date(
          new Date(data.createdAt).getTime() + data.expiryHours * 60 * 60 * 1000,
        )
        setDeadline(expiryLimit)
        setShouldHide(false)
      })
      .catch((err) => {
        console.error('Failed to fetch pending booking status for banner:', err)
      })
  }, [pathname])

  const { timeLeft, isExpired } = useCountdown(deadline)

  if (shouldHide || !pendingSlug || !deadline || isExpired) return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 pointer-events-none fade-in">
      <div className="pointer-events-auto max-w-[420px] mx-auto bg-[#122023] text-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/10 overflow-hidden flex items-center justify-between pl-5 pr-2 py-2 sm:py-2.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold tracking-[0.1em] text-white/50 uppercase">
            Selesaikan Pembayaran
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C4A0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D8A77B]"></span>
            </span>
            <span
              className="text-[15px] sm:text-base tabular-nums font-medium text-white"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        <Link
          href={`/b/${pendingSlug}`}
          className="bg-white text-[#122023] hover:bg-[#EBE5D9] transition-colors py-2.5 px-5 rounded-lg text-[11px] sm:text-xs font-bold tracking-[0.05em] uppercase active:scale-[0.98]"
        >
          Bayar
        </Link>
      </div>
    </div>
  )
}
