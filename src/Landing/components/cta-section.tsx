'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-16 md:py-24">
      <section className="relative w-screen h-[600px] overflow-hidden">
        <Image
          src="/media/ruang-tamu-atas.webp"
          alt="Luxury resort view with infinity pool at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-3xl mx-auto space-y-4 absolute inset-0 flex flex-col items-center justify-center text-center text-primary-foreground ">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-4 ">
            Rasakan Pengalaman Menginap
          </h1>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium ">
            Seperti di Rumah Sendiri
          </h1>
          <p className="text-lg md:text-xl mt-2">Mulai dari Rp1.699.000,00/malam</p>
          <Button asChild size="lg">
            <Link
              href="https://wa.me/6285117082122?text=Halo%2C%20saya%20dapat%20kontak%20dari%20website%20trasmambang.com%0A%0ASaya%20mau%20reservasi%20dong!"
              target="_blank"
            >
              Pesan Sekarang
            </Link>
          </Button>
        </div>
      </section>
    </section>
  )
}
