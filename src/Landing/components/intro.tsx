'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Car, MapPin, ShieldCheck, Users, Waves } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const benefits = [
  {
    icon: <Users className="w-4 h-4" />,
    text: 'Cocok untuk keluarga besar hingga 12 orang',
  },
  {
    icon: <Waves className="w-4 h-4" />,
    text: 'Private indoor pool, aman untuk anak',
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    text: 'Dekat destinasi wisata populer Yogyakarta',
  },
  {
    icon: <Car className="w-4 h-4" />,
    text: 'Parkir luas di dalam garasi',
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    text: 'Lingkungan aman dan tenang untuk anak-anak',
  },
]

const segments = [
  {
    label: 'Keluarga',
    description: 'Fasilitas lengkap untuk liburan bersama keluarga besar.',
  },
  {
    label: 'Rombongan Kantor',
    description: 'Ruang luas dan Wi-Fi cepat untuk gathering atau retreat.',
  },
  {
    label: 'Komunitas',
    description: 'Tempat nyaman untuk kumpul bareng teman-teman.',
  },
]

export default function Intro() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('.animate-up')
        gsap.from(elements, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
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
    <section ref={containerRef} className="py-[120px] px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-up">
          <div className="space-y-4">
            <span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20">
              Tentang Kami
            </span>
            <h2
              className="text-4xl md:text-5xl font-normal tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Homestay yang dirancang untuk kenyamanan keluarga
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed">
              Dilengkapi 4 kamar sejuk, kolam renang indoor, gym corner, dan dapur yang lengkap.
              Sewa 1 unit penuh untuk keluarga atau rombongan Anda.
            </p>
          </div>

          {/* Benefits list */}
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit.text} className="flex items-center gap-3 text-sm text-[#1E1E1F]">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0]/15 text-[#1E1E1F]">
                  {benefit.icon}
                </span>
                {benefit.text}
              </li>
            ))}
          </ul>

          <Link
            href="#kamar"
            className="inline-flex items-center gap-2 text-sm text-[#1E1E1F] underline"
          >
            Lihat Kamar & Harga →
          </Link>
        </div>

        <div className="space-y-6 animate-up">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/media/depan-homestay.webp"
              alt="Trasmambang Homestay"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Segment badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {segments.map((segment) => (
              <div key={segment.label} className="border border-[#DADADA] rounded-lg p-4 space-y-1">
                <p className="text-sm font-medium text-[#1E1E1F]">{segment.label}</p>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
