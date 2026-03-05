'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type BookingData = {
  slugId: string
  bookingCode: string
  guestName: string
  phone: string
  checkIn: string
  checkOut: string
  numGuests: number
  bookingStatus: string
  paymentStatus: string
  totalPrice: number
  discountAmount: number
  couponCode?: string
  finalPrice: number
  transferCode?: number
  transferAmount?: number
  createdAt: string
}

type Props = {
  booking: BookingData
  bank: { name: string; accountNumber: string; accountName: string }
  whatsappNumber: string
  expiryHours: number
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const STATUS_CONFIG: Record<string, { label: string; text: string; dot: string; bg: string }> = {
  pending: { label: 'Menunggu', text: 'text-[#8C6D4A]', dot: 'bg-[#D8A77B]', bg: 'bg-[#FFF9F0]' },
  confirmed: {
    label: 'Dikonfirmasi',
    text: 'text-[#276749]',
    dot: 'bg-[#48BB78]',
    bg: 'bg-[#F0FFF4]',
  },
  cancelled: {
    label: 'Dibatalkan',
    text: 'text-[#C53030]',
    dot: 'bg-[#FC8181]',
    bg: 'bg-[#FFF5F5]',
  },
  expired: {
    label: 'Kedaluwarsa',
    text: 'text-[#C53030]',
    dot: 'bg-[#FC8181]',
    bg: 'bg-[#FFF5F5]',
  },
  completed: { label: 'Selesai', text: 'text-[#2B6CB0]', dot: 'bg-[#63B3ED]', bg: 'bg-[#EBF8FF]' },
}

function clearPendingBookingCookie() {
  document.cookie = 'pending_booking=; path=/; max-age=0'
}

function CopyButton({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex items-center gap-1.5 rounded bg-[#F7F6F2] hover:bg-[#EBE5D9] px-2 py-1 transition-colors active:scale-95"
      title="Salin ke clipboard"
    >
      {copied ? (
        <svg
          className="w-3.5 h-3.5 text-[#276749]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#122023] transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
      <span
        className={`text-[10px] font-bold tracking-[0.1em] uppercase ${copied ? 'text-[#276749]' : 'text-[#6B6B6B] group-hover:text-[#122023]'} transition-colors`}
      >
        {copied ? 'Tersalin' : label}
      </span>
    </button>
  )
}

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function update() {
      const diff = deadline.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('HABIS')
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return timeLeft
}

export function BookingConfirmation({ booking, bank, whatsappNumber, expiryHours }: Props) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)

  const deadline = new Date(new Date(booking.createdAt).getTime() + expiryHours * 60 * 60 * 1000)
  const countdown = useCountdown(deadline)
  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
      (1000 * 60 * 60 * 24),
  )

  const displayAmount = booking.transferAmount ?? booking.finalPrice

  const domain = typeof window !== 'undefined' ? window.location.origin : ''
  const paymentUrl = `${domain}/b/${booking.slugId}`

  const waMessage = encodeURIComponent(
    [
      `Halo, saya sudah transfer untuk pemesanan Trasmambang.`,
      `Booking ID: *${booking.bookingCode}*`,
      `Nama: ${booking.guestName}`,
      `Jumlah bayar: ${formatRupiah(displayAmount)}`,
      `Link pesanan: ${paymentUrl}`,
    ].join('\n'),
  )
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${waMessage}` : ''

  const isPending = booking.bookingStatus === 'pending'
  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.pending

  const handleCancel = async () => {
    if (!confirm('Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat diubah.')) return
    setIsCancelling(true)
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugId: booking.slugId }),
      })
      if (res.ok) {
        clearPendingBookingCookie()
        router.push('/booking')
      } else {
        const err = await res.json()
        alert(err.message || 'Gagal membatalkan booking')
      }
    } catch {
      alert('Koneksi bermasalah. Silakan coba lagi nanti.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
      {/* =========================================
          LEFT: ACTION AREA (Pending Only)
      ========================================= */}
      {isPending && (
        <div className="w-full lg:flex-1 order-1 flex flex-col gap-8 sm:gap-10 mt-2 lg:mt-6">
          {/* Hero Header */}
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C4A0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D8A77B]"></span>
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C6D4A]">
                Menunggu Pembayaran
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-medium tracking-tight text-[#122023] leading-[1.1]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Selesaikan
              <br />
              Pembayaran
            </h1>
            <p className="mt-5 text-[#6B6B6B] text-[15px] leading-relaxed max-w-[360px]">
              Pesanan Anda telah kami simpan. Harap selesaikan pembayaran sebelum waktu habis.
            </p>
          </div>

          {/* Countdown & Deadline Grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-[#122023]/10 py-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B6B6B] mb-1.5">
                Sisa Waktu
              </p>
              <p
                className="text-3xl sm:text-4xl tabular-nums font-medium text-[#122023]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {countdown}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B6B6B] mb-1.5">
                Batas Akhir
              </p>
              <p className="text-[15px] sm:text-base font-medium text-[#122023]">
                {deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </p>
              <p className="text-sm text-[#9B9B9B] mt-0.5">
                {deadline.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Transfer Info */}
          <div className="relative bg-white border border-[#EBE5D9] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#122023]"></div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B6B6B] mb-1.5">
                  Jumlah Transfer
                </p>
                <p
                  className="text-3xl sm:text-[2.5rem] leading-none font-medium text-[#122023] tracking-tight"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {formatRupiah(displayAmount)}
                </p>
              </div>
              <div className="shrink-0 mt-1 sm:mt-0">
                <CopyButton text={String(displayAmount)} />
              </div>
            </div>

            {booking.transferCode && (
              <div className="mb-8 p-4 bg-[#FFF9F0] border border-[#E8C4A0]/30 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8C4A0] mt-1.5 shrink-0" />
                <p className="text-[13px] text-[#8C6D4A] leading-relaxed">
                  Harap transfer <strong>tepat</strong> hingga 3 digit terakhir (
                  <strong className="font-mono bg-white/50 px-1 py-0.5 rounded text-[#122023]">
                    {booking.transferCode}
                  </strong>
                  ) untuk mempercepat verifikasi.
                </p>
              </div>
            )}

            {/* Bank Details */}
            <div className="space-y-6 pt-1">
              <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-dashed border-[#EBE5D9] pb-6">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B6B6B] mb-2">
                    {' '}
                    Rekening {bank.name}
                  </p>
                  <p
                    className="text-[20px] sm:text-xl font-medium tracking-widest text-[#122023]"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {bank.accountNumber}
                  </p>
                </div>
                <div className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <CopyButton text={bank.accountNumber} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B6B6B] mb-1.5">
                  Atas Nama
                </p>
                <p className="text-[15px] font-medium text-[#122023]">{bank.accountName}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-5 mt-2">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={clearPendingBookingCookie}
                className="w-full group relative overflow-hidden bg-[#122023] text-white flex items-center justify-center gap-3 py-5 px-6 transition-all duration-300 hover:bg-black active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <svg className="w-[18px] h-[18px] z-10 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.15em] uppercase z-10 pt-px">
                  Saya Sudah Transfer
                </span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#9B9B9B] hover:text-[#C53030] transition-colors py-2 px-4 disabled:opacity-50 inline-block"
            >
              {isCancelling ? 'Membatalkan...' : 'Batalkan Pesanan Ini'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          RIGHT: RECEIPT AREA 
          (If not pending, this takes center stage)
      ========================================= */}
      <div
        className={`w-full ${isPending ? 'lg:w-[420px] shrink-0 order-2' : 'max-w-2xl mx-auto mt-6 sm:mt-12 group'}`}
      >
        {/* Status Header for Non-Pending states */}
        {!isPending && (
          <div className="text-center mb-10">
            <div
              className={`inline-flex px-4 py-1.5 rounded-full items-center gap-2 mb-4 ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              <span className={`text-[11px] font-bold tracking-[0.15em] uppercase ${status.text}`}>
                {status.label}
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-medium tracking-tight text-[#122023]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Trasmambang
              <br />
              <span className="italic font-serif font-normal text-[#8C6D4A]">Homestay</span>
            </h1>
          </div>
        )}

        <div className="relative bg-[#FFFCF8] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-[#122023]/5">
          {/* Top Zig-Zag Edge */}
          <div
            className="absolute -top-1.5 left-0 w-full h-3 bg-[#F7F6F2] z-10"
            style={{
              maskImage: 'radial-gradient(circle at 5px 0, transparent 5px, black 6px)',
              maskPosition: 'top -5px',
              maskSize: '10px 10px',
              maskRepeat: 'repeat-x',
            }}
          />

          <div className="px-6 py-10 sm:px-10 lg:py-12 text-[#122023]">
            {/* Receipt Title */}
            <div className="text-center mb-10 pb-8 border-b border-dashed border-[#D4CFC4]">
              <h2 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B6B6B] mb-2 leading-none">
                Guest Receipt
              </h2>
              <div className="flex items-center justify-center gap-3">
                <p className="text-2xl font-medium tracking-tight">{booking.bookingCode}</p>
                <CopyButton text={booking.bookingCode} label="" />
              </div>
              <p className="text-xs text-[#9B9B9B] mt-2 font-mono">
                {new Date(booking.createdAt).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Guest Info Grid */}
            <div className="grid grid-cols-2 gap-y-7 gap-x-4 mb-10">
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9B9B9B] mb-1">
                  Tamu
                </p>
                <p className="text-[14px] font-medium leading-tight">{booking.guestName}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9B9B9B] mb-1">
                  Jumlah
                </p>
                <p className="text-[14px] font-medium leading-tight">{booking.numGuests} Orang</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9B9B9B] mb-1">
                  Check-in
                </p>
                <p className="text-[14px] font-medium leading-snug">
                  {formatDate(booking.checkIn)}
                </p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">Mulai 14:00</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9B9B9B] mb-1">
                  Check-out
                </p>
                <p className="text-[14px] font-medium leading-snug">
                  {formatDate(booking.checkOut)}
                </p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">Sblm 12:00</p>
              </div>
            </div>

            {/* Ledger Itemization */}
            <div className="space-y-4 text-[13px] border-t border-[#122023] pt-6 pb-6">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-medium">Sewa Homestay</span>
                  <span className="text-[#6B6B6B] text-xs mt-0.5">
                    {nights} Malam &times; {booking.numGuests} Tamu
                  </span>
                </div>
                <span className="font-medium" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {formatRupiah(booking.totalPrice)}
                </span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-[#8C6D4A]">
                  <span>Diskon {booking.couponCode ? `(${booking.couponCode})` : ''}</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    -{formatRupiah(booking.discountAmount)}
                  </span>
                </div>
              )}

              {booking.transferCode && isPending && (
                <div className="flex justify-between text-[#6B6B6B]">
                  <span className="text-xs">Kode Unik Transfer</span>
                  <span className="text-xs" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    +{formatRupiah(booking.transferCode)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-dashed border-[#D4CFC4] pt-5 mt-2">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#122023]">
                Total {isPending ? 'Tagihan' : 'Dibayar'}
              </span>
              <span
                className="text-2xl font-medium tracking-tight text-[#122023]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {formatRupiah(isPending ? displayAmount : booking.finalPrice)}
              </span>
            </div>
          </div>

          {/* Bottom Zig-Zag Edge */}
          <div
            className="absolute -bottom-1.5 left-0 w-full h-3 bg-[#F7F6F2] z-10 rotate-180"
            style={{
              maskImage: 'radial-gradient(circle at 5px 0, transparent 5px, black 6px)',
              maskPosition: 'top -5px',
              maskSize: '10px 10px',
              maskRepeat: 'repeat-x',
            }}
          />
        </div>

        {/* Action beneath receipt if NOT pending (like back to home) */}
        {!isPending && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/')}
              className="text-[11px] font-bold tracking-widest uppercase text-[#122023] border border-[#122023] px-6 py-3 hover:bg-[#122023] hover:text-white transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
