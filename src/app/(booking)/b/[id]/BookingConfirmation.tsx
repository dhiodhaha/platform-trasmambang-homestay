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
  return `Rp${amount.toLocaleString('id-ID')}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'Menunggu Pembayaran', bg: 'bg-[#FFF9F0]', text: 'text-[#8C6D4A]', dot: 'bg-[#E8C4A0]' },
  confirmed: { label: 'Dikonfirmasi', bg: 'bg-[#F0FFF4]', text: 'text-[#276749]', dot: 'bg-[#48BB78]' },
  cancelled: { label: 'Dibatalkan', bg: 'bg-[#FFF5F5]', text: 'text-[#C53030]', dot: 'bg-[#FC8181]' },
  expired: { label: 'Kedaluwarsa', bg: 'bg-[#FFF5F5]', text: 'text-[#C53030]', dot: 'bg-[#FC8181]' },
  completed: { label: 'Selesai', bg: 'bg-[#EBF8FF]', text: 'text-[#2B6CB0]', dot: 'bg-[#63B3ED]' },
}

function clearPendingBookingCookie() {
  document.cookie = 'pending_booking=; path=/; max-age=0'
}

function CopyButton({ text }: { text: string }) {
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
      className="inline-flex items-center gap-1 rounded-lg border border-black/5 bg-[#F9F9F9] px-2.5 py-1 text-xs font-medium text-[#6B6B6B] transition-all hover:bg-white hover:border-[#E8C4A0]/30 active:scale-95"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Tersalin</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Salin
        </>
      )}
    </button>
  )
}

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function update() {
      const diff = deadline.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('Waktu habis')
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
      `Halo, saya sudah transfer untuk booking *${booking.bookingCode}*`,
      `Nama: ${booking.guestName}`,
      `Jumlah transfer: ${formatRupiah(displayAmount)}`,
      `Link: ${paymentUrl}`,
    ].join('\n'),
  )
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${waMessage}` : ''

  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.pending

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return
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
      alert('Gagal membatalkan booking. Periksa koneksi internet Anda.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 ${status.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className={`text-[13px] font-semibold tracking-wide uppercase ${status.text}`}>
            {status.label}
          </span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#122023]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          {booking.bookingStatus === 'pending' ? 'Selesaikan Pembayaran' : `Booking ${booking.bookingCode}`}
        </h1>
        {booking.bookingStatus === 'pending' && (
          <p className="mt-3 text-lg text-[#6B6B6B]">
            Transfer sebelum batas waktu untuk mengonfirmasi pemesanan Anda.
          </p>
        )}
      </div>

      {/* Countdown Timer — pending only */}
      {booking.bookingStatus === 'pending' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">Batas Waktu Pembayaran</p>
              <p className="mt-1 text-sm text-[#9B9B9B]">
                {deadline.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-3xl sm:text-4xl font-medium tracking-tight text-[#122023] tabular-nums"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {countdown}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Transfer Card — pending only */}
      {booking.bookingStatus === 'pending' && (
        <section className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2
              className="text-xl font-medium tracking-tight text-[#122023] mb-6 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
                1
              </span>
              Transfer Pembayaran
            </h2>

            <div className="space-y-5">
              {/* Transfer Amount — hero element */}
              <div className="bg-[#F9F9F9] rounded-2xl p-5 sm:p-6 border border-black/5">
                <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-2">Jumlah Transfer</p>
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-3xl sm:text-4xl font-medium tracking-tight text-[#122023]"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    {formatRupiah(displayAmount)}
                  </p>
                  <CopyButton text={String(displayAmount)} />
                </div>
                {booking.transferCode && (
                  <div className="mt-3 flex items-start gap-2.5 bg-[#FFF9F0] border border-[#E8C4A0]/30 px-4 py-3 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8C4A0] mt-1.5 shrink-0" />
                    <p className="text-[13px] text-[#8C6D4A] leading-relaxed">
                      Pastikan transfer <strong>tepat</strong> sesuai nominal di atas (termasuk 3 digit terakhir) agar pembayaran dapat diverifikasi.
                    </p>
                  </div>
                )}
              </div>

              {/* Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1.5">Bank</p>
                  <p className="text-[15px] font-medium text-[#122023]">{bank.name}</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1.5">Nomor Rekening</p>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-[15px] font-medium text-[#122023] tracking-wide"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {bank.accountNumber}
                    </p>
                    <CopyButton text={bank.accountNumber} />
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1.5">Atas Nama</p>
                  <p className="text-[15px] font-medium text-[#122023]">{bank.accountName}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA — pending only */}
      {waLink && booking.bookingStatus === 'pending' && (
        <section className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2
              className="text-xl font-medium tracking-tight text-[#122023] mb-4 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
                2
              </span>
              Konfirmasi via WhatsApp
            </h2>
            <p className="text-sm text-[#6B6B6B] mb-5">
              Setelah transfer, klik tombol di bawah untuk mengirim konfirmasi pembayaran via WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={clearPendingBookingCookie}
              className="flex items-center justify-center gap-2.5 w-full rounded-full bg-[#25D366] px-8 py-5 text-center text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#20bd5a] shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Sudah Transfer &amp; Konfirmasi via WA
            </a>
          </div>
        </section>
      )}

      {/* Booking Detail */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
        <h2
          className="text-xl font-medium tracking-tight text-[#122023] mb-6 flex items-center gap-3"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          {booking.bookingStatus === 'pending' && (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
              3
            </span>
          )}
          Detail Booking
        </h2>

        <div className="space-y-5">
          {/* Booking Code */}
          <div className="bg-[#F9F9F9] rounded-2xl px-5 py-4 border border-black/5 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">Kode Booking</p>
              <p
                className="mt-0.5 text-lg font-medium text-[#122023] tracking-wide"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {booking.bookingCode}
              </p>
            </div>
            <CopyButton text={booking.bookingCode} />
          </div>

          {/* Guest & Stay Info */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1">Nama Tamu</p>
              <p className="font-medium text-[#122023]">{booking.guestName}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1">Jumlah Tamu</p>
              <p className="font-medium text-[#122023]">{booking.numGuests} orang</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1">Check-in</p>
              <p className="font-medium text-[#122023]">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1">Check-out</p>
              <p className="font-medium text-[#122023]">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase mb-1">Durasi</p>
              <p className="font-medium text-[#122023]">{nights} malam</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-black/5 pt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span className="font-medium text-[#122023]">{formatRupiah(booking.totalPrice)}</span>
            </div>
            {booking.discountAmount > 0 && booking.couponCode && (
              <div className="flex justify-between">
                <span className="text-green-600">Diskon ({booking.couponCode})</span>
                <span className="font-medium text-green-600">-{formatRupiah(booking.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-black/5 pt-2.5">
              <span className="text-[15px] font-medium text-[#122023]">Total</span>
              <span className="text-[15px] font-medium text-[#122023]">{formatRupiah(booking.finalPrice)}</span>
            </div>
            {booking.transferCode && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#9B9B9B]">Kode unik transfer</span>
                  <span className="text-[#9B9B9B]">+{formatRupiah(booking.transferCode)}</span>
                </div>
                <div className="flex justify-between bg-[#F9F9F9] rounded-xl px-4 py-3 -mx-1">
                  <span className="text-[15px] font-semibold text-[#122023]">Jumlah Transfer</span>
                  <span className="text-[15px] font-semibold text-[#122023]">{formatRupiah(displayAmount)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cancel — pending only */}
      {booking.bookingStatus === 'pending' && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-sm text-[#9B9B9B] underline underline-offset-4 decoration-black/10 hover:text-red-500 hover:decoration-red-500/30 transition-colors disabled:opacity-50"
          >
            {isCancelling ? 'Membatalkan...' : 'Batalkan Booking'}
          </button>
        </div>
      )}
    </div>
  )
}
