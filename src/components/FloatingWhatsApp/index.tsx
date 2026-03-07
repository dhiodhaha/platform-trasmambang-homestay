'use client'

import React, { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

type FloatingWhatsAppProps = {
  whatsappNumber: string
}

function getPendingBookingId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)pending_booking=([^;]+)/)
  return match ? match[1] : null
}

export function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const [hasPendingBooking, setHasPendingBooking] = useState(false)

  // Check for the pending booking cookie so we can move the button up to avoid overlapping the banner
  useEffect(() => {
    // Initial check
    setHasPendingBooking(!!getPendingBookingId())

    // Also poll every second just in case the cookie changes without a reload
    const interval = setInterval(() => {
      setHasPendingBooking(!!getPendingBookingId())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Halo%2C%20saya%20dari%20website%20trasmambang.com%0A%0ASaya%20ingin%20tanya-tanya%20lebih%20lanjut.`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 sm:right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 hover:shadow-xl ${
        hasPendingBooking ? 'bottom-[80px] sm:bottom-[90px]' : 'bottom-6 sm:bottom-8'
      }`}
      aria-label="Chat with us on WhatsApp"
    >
      {/* Subtle pulse effect ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30"></span>
      <MessageCircle size={28} className="relative z-10" strokeWidth={2.5} />
    </a>
  )
}
