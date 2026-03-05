'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import * as React from 'react'
import AvailabilityWidget from './availability-widget'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function CTA() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
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
    <section className="w-full bg-[#122023] py-[120px] lg:py-[160px] px-4">
      <div ref={containerRef} className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side (First on mobile, second on desktop) */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-8">
            <h2
              className="text-4xl md:text-5xl tracking-[-0.03em] font-normal text-white"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Rasakan Pengalaman
              <br className="hidden lg:block" />
              Menginap Seperti
              <br className="hidden lg:block" />
              di Rumah Sendiri
            </h2>
            <p className="text-lg md:text-xl text-white/60">
              Mulai dari Rp 1.699.000/malam · 1 unit penuh
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/booking"
                className="inline-block rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-[#ddb78f] transition-colors"
              >
                Pesan Sekarang
              </Link>
              <Link
                href="https://wa.me/6285117082122?text=Halo%2C%20saya%20dari%20website%20trasmambang.com%0A%0ASaya%20mau%20tanya%20detail%20lainnya"
                target="_blank"
                className="inline-block rounded-full border border-white text-white text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-white/10 transition-colors"
              >
                Tanya via WhatsApp
              </Link>
            </div>
          </div>

          {/* Availability widget side (Second on mobile, first on desktop) */}
          <div className="order-2 lg:order-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
            <AvailabilityWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
