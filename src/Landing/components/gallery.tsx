'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import * as React from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const galleryGroups = [
  {
    label: 'Kolam Renang',
    photos: [
      {
        src: '/media/view-kolam-renang.webp',
        caption: 'Indoor pool – aman untuk anak',
      },
      {
        src: '/media/view-kolam-renang-2.webp',
        caption: 'Area kolam renang yang luas',
      },
    ],
  },
  {
    label: 'Kamar Tidur',
    photos: [
      {
        src: '/media/view-kamar-atas-timur.webp',
        caption: 'Kamar Atas Timur – twin bed',
      },
      {
        src: '/media/view-kamar-atas-barat.webp',
        caption: 'Kamar Atas Barat – king size',
      },
      {
        src: '/media/view-kamar-bawah-barat.webp',
        caption: 'Kamar Bawah Barat',
      },
      {
        src: '/media/view-kamar-atas-barat-2.webp',
        caption: 'Kamar Bawah Timur',
      },
    ],
  },
  {
    label: 'Ruang Keluarga',
    photos: [
      {
        src: '/media/ruang-tamu.webp',
        caption: 'Ruang Keluarga bersama nyaman',
      },
      {
        src: '/media/ruang-tamu-atas.webp',
        caption: 'Area santai lantai atas',
      },
    ],
  },
  {
    label: 'Dapur & Ruang Makan',
    photos: [
      {
        src: '/media/ruang-makan.webp',
        caption: 'Ruang makan luas untuk bersantap',
      },
    ],
  },
  {
    label: 'Area Lainnya',
    photos: [
      { src: '/media/view-tangga.webp', caption: 'Area tangga yang terang' },
      { src: '/media/view-gym.webp', caption: 'Gym corner – jaga rutinitas' },
      { src: '/media/depan-homestay.webp', caption: 'Tampak depan homestay' },
    ],
  },
]

export default function Gallery() {
  const containerRef = React.useRef<HTMLElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const groupsRef = React.useRef<HTMLDivElement>(null)

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

      if (groupsRef.current) {
        const groups = groupsRef.current.querySelectorAll('.gallery-group')
        for (const group of Array.from(groups)) {
          gsap.from(group, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 80%',
              once: true,
            },
          })

          const items = group.querySelectorAll('.gallery-item')
          gsap.from(items, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 80%',
              once: true,
            },
          })
        }
      }
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="py-[120px] px-4" id="galeri">
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20 mb-4">
            Galeri
          </span>
          <h2
            className="text-4xl md:text-5xl tracking-[-0.03em] font-normal"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Jelajahi Setiap Sudut
          </h2>
        </div>

        <div ref={groupsRef} className="space-y-16">
          {galleryGroups.map((group) => (
            <div key={group.label} className="gallery-group">
              <p className="text-sm uppercase tracking-[0.05em] text-[#6B6B6B] mb-6">
                {group.label}
              </p>
              <div
                className={`grid gap-4 ${
                  group.photos.length === 1
                    ? 'grid-cols-1'
                    : group.photos.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : group.photos.length === 3
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                        : 'grid-cols-2 md:grid-cols-4'
                }`}
              >
                {group.photos.map((photo) => (
                  <div key={photo.src} className="gallery-item group relative">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                      {/* Caption overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white text-sm p-4">{photo.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
