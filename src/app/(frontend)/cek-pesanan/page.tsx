import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { CekPesananForm } from './CekPesananForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cek Pesanan | Trasmambang Homestay',
  description: 'Lihat status pesanan Anda di Trasmambang Homestay.',
}

export default async function CekPesananPage() {
  const cookieStore = await cookies()
  const pendingBooking = cookieStore.get('pending_booking')

  // Auto-redirect if the cookie from booking on this device exists
  if (pendingBooking?.value) {
    redirect(`/b/${pendingBooking.value}`)
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#8C6D4A] mb-4">
            Trasmambang Homestay
          </p>
          <h1
            className="text-4xl font-medium tracking-tight text-[#122023]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Cek Pesanan
          </h1>
          <p className="mt-3 text-sm text-[#6B6B6B] leading-relaxed max-w-sm mx-auto">
            Masukkan kode booking dan nomor WhatsApp Anda untuk melihat status pesanan.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/5">
          <CekPesananForm />
        </div>

        {/* Hint */}
        <p className="mt-6 text-center text-xs text-[#9B9B9B]">
          Kode booking dikirim ke WhatsApp Anda saat melakukan pemesanan.
        </p>
      </div>
    </main>
  )
}
