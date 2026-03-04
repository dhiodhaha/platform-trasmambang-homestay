'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const whyCards = [
  {
    id: '1',
    imageSrc: '/media/view-kolam-renang-2.webp',
    alt: 'Interior dengan kolam renang',
    title: 'Didesain khusus untuk keluarga',
    description: 'Suasana yang hangat dan fasilitas lengkap.',
  },
  {
    id: '2',
    imageSrc: '/media/ruang-tamu.webp',
    alt: 'Ruang tamu dengan sofa',
    title: 'Fasilitas lengkap',
    description: 'Baik untuk bersantai maupun menjaga rutinitas harian.',
  },
  {
    id: '3',
    imageSrc: '/media/ruang-makan.webp',
    alt: 'Ruang makan',
    title: 'Lingkungan yang aman dan tenang',
    description: 'Untuk keluarga yang menginginkan privasi.',
  },
]

export default function Why() {
  const containerRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.card-item')
        gsap.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
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
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="mb-16 space-y-4">
          <span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20">
            Keunggulan
          </span>
          <h2
            className="text-4xl md:text-5xl tracking-[-0.03em] font-normal"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Mengapa menginap di Trasmambang
          </h2>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyCards.map((card, index) => (
            <div
              key={card.id}
              className={`card-item space-y-4 ${index < 2 ? 'md:border-r md:border-[#DADADA] md:pr-8' : ''}`}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={card.imageSrc}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3
                className="text-2xl tracking-[-0.02em] font-medium"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {card.title}
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
