'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const faqItems = [
  {
    id: 'q1',
    question: 'Berapa kapasitas maksimal tamu?',
    answer:
      'Kapasitas maksimal adalah 12 orang termasuk anak-anak. Tersedia 4 kamar tidur dengan masing-masing kamar mandi.',
  },
  {
    id: 'q2',
    question: 'Apakah saya bisa masak di homestay?',
    answer:
      'Tentu! Kami menyediakan 2 dapur lengkap di lantai 1 dan lantai 2 dengan peralatan memasak, kompor, kulkas, dan peralatan makan.',
  },
  {
    id: 'q3',
    question: 'Apakah ada biaya tambahan selain harga sewa?',
    answer:
      'Harga sewa sudah termasuk seluruh fasilitas (kolam renang, gym, Wi-Fi, AC, dll). Biaya tambahan hanya berlaku untuk handuk atas permintaan.',
  },
  {
    id: 'q4',
    question: 'Apakah boleh membawa hewan peliharaan?',
    answer:
      'Maaf, untuk menjaga kenyamanan semua tamu, homestay kami tidak memperbolehkan hewan peliharaan.',
  },
  {
    id: 'q5',
    question: 'Bisa early check-in atau late check-out?',
    answer:
      'Early check-in dan late check-out bisa diatur tergantung ketersediaan. Silakan tanyakan saat booking via WhatsApp.',
  },
  {
    id: 'q6',
    question: 'Berapa jarak ke bandara dan stasiun kereta?',
    answer:
      'Bandara Adisucipto berjarak sekitar 25 menit berkendara, dan Stasiun Tugu sekitar 20 menit berkendara.',
  },
  {
    id: 'q7',
    question: 'Apakah bisa menyewa per kamar saja?',
    answer:
      'Tidak, homestay kami disewakan 1 unit penuh (seluruh rumah). Ini menjamin privasi dan kenyamanan penuh untuk keluarga atau rombongan Anda.',
  },
  {
    id: 'q8',
    question: 'Apakah ada batasan jumlah kendaraan?',
    answer:
      'Tersedia garasi yang cukup untuk 1-2 mobil. Jika membawa lebih, silakan koordinasi terlebih dahulu.',
  },
  {
    id: 'q9',
    question: 'Bagaimana kebijakan pembatalan pemesanan?',
    answer:
      'Mohon maaf, untuk saat ini kami tidak melakukan kebijakan pengembalian dana jika membatalkan pemesanan.',
  },
  {
    id: 'q10',
    question: 'Apakah homestay ramah anak?',
    answer:
      'Ya! Kami memiliki mini indoor playground, kolam renang yang aman, dan lingkungan yang tenang serta aman untuk anak-anak.',
  },
]

export default function FAQ({ whatsappNumber }: { whatsappNumber: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

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
    <section className="py-[120px] px-4 scroll-mt-16" id="faq">
      <div ref={containerRef} className="max-w-[800px] mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20">
            FAQ
          </span>
          <h2
            className="text-4xl md:text-5xl tracking-[-0.03em] font-normal"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Pertanyaan yang Sering Ditanyakan
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map(({ id, question, answer }) => (
            <AccordionItem key={id} value={id} className="border-b border-[#DADADA] px-0">
              <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 text-[#1E1E1F]">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pb-6 space-y-3">
                <p>{answer}</p>
                <Link
                  href={`https://wa.me/${whatsappNumber}?text=Halo%2C%20saya%20dari%20website%20trasmambang.com%0A%0ASaya%20mau%20tanya%20lebih%20lanjut`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1E1E1F] underline hover:text-[#122023]"
                >
                  Masih ada pertanyaan? Chat kami →
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
