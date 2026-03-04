'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Bath, Bed, Users, Wind } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const rooms = [
  {
    name: 'Kamar Atas Timur',
    image: '/media/view-kamar-atas-timur.webp',
    bed: 'Twin Bed',
  },
  {
    name: 'Kamar Atas Barat',
    image: '/media/view-kamar-atas-barat.webp',
    bed: 'King Size',
  },
  {
    name: 'Kamar Bawah Barat',
    image: '/media/view-kamar-bawah-barat.webp',
    bed: 'Twin Bed',
  },
  {
    name: 'Kamar Bawah Timur',
    image: '/media/view-kamar-atas-barat-2.webp',
    bed: 'Twin Bed',
  },
]

const houseFeatures = [
  { icon: <Bed className="w-4 h-4" />, text: '4 Kamar Tidur' },
  { icon: <Users className="w-4 h-4" />, text: 'Hingga 12 Orang' },
  { icon: <Wind className="w-4 h-4" />, text: 'AC + Purifier' },
  { icon: <Bath className="w-4 h-4" />, text: '4 Kamar Mandi' },
]

export default function Rooms() {
  const containerRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const roomsHeaderRef = useRef<HTMLParagraphElement>(null)
  const roomsGridRef = useRef<HTMLDivElement>(null)
  const policyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const commonProps = {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }

      if (headerRef.current) {
        gsap.from(headerRef.current, {
          ...commonProps,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }

      if (showcaseRef.current) {
        gsap.from(showcaseRef.current, {
          ...commonProps,
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }

      if (roomsHeaderRef.current) {
        gsap.from(roomsHeaderRef.current, {
          ...commonProps,
          scrollTrigger: {
            trigger: roomsHeaderRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      if (roomsGridRef.current) {
        const items = roomsGridRef.current.querySelectorAll('.room-item')
        gsap.from(items, {
          ...commonProps,
          stagger: 0.1,
          scrollTrigger: {
            trigger: roomsGridRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      if (policyRef.current) {
        gsap.from(policyRef.current, {
          ...commonProps,
          scrollTrigger: {
            trigger: policyRef.current,
            start: 'top 90%',
            once: true,
          },
        })
      }
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="py-[120px] px-4 scroll-mt-16" id="kamar">
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20 mb-4">
            Kamar & Harga
          </span>
          <h2
            className="text-4xl md:text-5xl tracking-[-0.03em] font-normal mb-4"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Sewa 1 Unit Penuh
          </h2>
          <p className="text-[#6B6B6B] text-lg leading-relaxed max-w-2xl">
            Nikmati seluruh rumah secara eksklusif untuk keluarga atau rombongan Anda. Tidak berbagi
            dengan tamu lain.
          </p>
        </div>

        {/* House showcase card */}
        <div ref={showcaseRef} className="bg-[#F5F5F5] rounded-2xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image
                src="/media/view-kolam-renang.webp"
                alt="Trasmambang Homestay - Full House"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.05em] text-[#6B6B6B] mb-2">
                  Sewa Rumah Penuh
                </p>
                <h3
                  className="text-3xl md:text-4xl font-normal tracking-[-0.03em] text-[#1E1E1F]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  Trasmambang Homestay
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {houseFeatures.map((feature) => (
                  <span
                    key={feature.text}
                    className="inline-flex items-center gap-2 text-sm text-[#1E1E1F] bg-white rounded-full px-4 py-2"
                  >
                    {feature.icon}
                    {feature.text}
                  </span>
                ))}
              </div>

              <div className="border-t border-[#DADADA] pt-6">
                <p className="text-sm text-[#6B6B6B] mb-1">Mulai dari</p>
                <p
                  className="text-3xl md:text-4xl font-normal tracking-[-0.03em] text-[#1E1E1F]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  Rp 1.699.000
                  <span className="text-base text-[#6B6B6B] font-normal">/malam</span>
                </p>
              </div>

              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E8C4A0] text-[#1E1E1F] text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-[#ddb78f] transition-colors w-full sm:w-auto"
              >
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Room previews */}
        <div className="space-y-6">
          <p ref={roomsHeaderRef} className="text-sm uppercase tracking-[0.05em] text-[#6B6B6B]">
            Yang Anda Dapatkan — 4 Kamar Tidur
          </p>
          <div ref={roomsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div key={room.name} className="room-item group space-y-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#1E1E1F]">{room.name}</h4>
                  <p className="text-xs text-[#6B6B6B]">{room.bed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy notes */}
        <div ref={policyRef} className="mt-12 pt-8 border-t border-[#DADADA]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-[#6B6B6B]">
            <div>
              <p className="font-medium text-[#1E1E1F] mb-1">Kapasitas Maksimal</p>
              <p>Hingga 12 orang (termasuk anak-anak)</p>
            </div>
            <div>
              <p className="font-medium text-[#1E1E1F] mb-1">Extra Bed / Kasur</p>
              <p>Tidak tersedia, hanya mendapat extra handuk atas permintaan</p>
            </div>
            <div>
              <p className="font-medium text-[#1E1E1F] mb-1">Kebijakan Anak</p>
              <p>Anak-anak dipersilakan, playground tersedia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
