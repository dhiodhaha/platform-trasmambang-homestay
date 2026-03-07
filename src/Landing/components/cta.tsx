'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import { MessageCircle } from 'lucide-react'
import AvailabilityWidget from './availability-widget'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type CTAProps = {
  isAutomatedBookingEnabled?: boolean
  whatsappNumber: string
}

export default function CTA({ isAutomatedBookingEnabled = true, whatsappNumber }: CTAProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }
    },
    { scope: containerRef },
  )

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden py-24 px-4 bg-[#122023]">
      <Image
        src="/media/ruang-tamu-atas.webp"
        alt="Trasmambang Homestay Interior"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#122023]/80 to-transparent" />

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center text-center space-y-12"
      >
        <div className="space-y-6">
          <h2
            className="text-4xl md:text-5xl lg:text-7xl tracking-[-0.03em] font-normal text-white drop-shadow-lg"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Rasakan Pengalaman
            <br />
            Menginap Seperti
            <br />
            di Rumah Sendiri
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-light drop-shadow">
            Mulai dari Rp 1.699.000/malam · 1 unit penuh
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-6">
          <AvailabilityWidget
            isAutomatedBookingEnabled={isAutomatedBookingEnabled}
            whatsappNumber={whatsappNumber}
          />

          <div className="flex justify-center pt-4">
            <Link
              href={`https://wa.me/${whatsappNumber}?text=Halo%2C%20saya%20dari%20website%20trasmambang.com%0A%0ASaya%20mau%20tanya%20detail%20lainnya`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest px-6 py-3 hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya via WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
