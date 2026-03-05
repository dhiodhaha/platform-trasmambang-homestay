'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
        })
      }
    },
    { scope: containerRef },
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/media/depan-homestay.webp"
        alt="Trasmambang Homestay"
        fill
        className="object-cover brightness-[0.45]"
        priority
      />
      <div
        ref={containerRef}
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 space-y-6"
      >
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.05em] px-3 py-1.5 rounded-full border border-[#E8C4A0] text-white bg-[#E8C4A0]/20">
            <Star className="w-3.5 h-3.5 fill-[#E8C4A0] text-[#E8C4A0]" />
            5.0 di Google Maps
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.05em] px-3 py-1.5 rounded-full border border-white/30 text-white/80">
            <MapPin className="w-3.5 h-3.5" />
            Kasihan, Bantul, Yogyakarta
          </span>
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] font-normal leading-[1.1]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Homestay Nyaman untuk
          <br />
          Keluarga & Rombongan
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          4 kamar tidur sejuk · kolam renang indoor · gym corner · dapur lengkap · kapasitas hingga
          12 orang. Sewa 1 unit penuh, rasakan liburan seperti di rumah sendiri.
        </p>

        {/* Dual CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-[#ddb78f] transition-colors shadow-lg shadow-[#E8C4A0]/20"
          >
            Pesan Sekarang
          </Link>
          <Link
            href="#kamar"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-white/10 transition-colors"
          >
            Lihat Harga & Kamar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
            >
              <title>Arrow Right</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
