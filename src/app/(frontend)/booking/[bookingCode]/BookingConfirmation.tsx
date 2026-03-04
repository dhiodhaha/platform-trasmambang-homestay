'use client'

import React from 'react'

type BookingData = {
  bookingCode: string
  guestName: string
  checkIn: string
  checkOut: string
  numGuests: number
  bookingStatus: string
  paymentStatus: string
  totalPrice: number
  discountAmount: number
  couponCode?: string
  finalPrice: number
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

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  expired: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Pembayaran',
  confirmed: 'Dikonfirmasi',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
  completed: 'Selesai',
}

export function BookingConfirmation({ booking, bank, whatsappNumber, expiryHours }: Props) {
  const deadline = new Date(new Date(booking.createdAt).getTime() + expiryHours * 60 * 60 * 1000)
  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
      (1000 * 60 * 60 * 24),
  )

  const waMessage = encodeURIComponent(
    `Halo, saya sudah transfer untuk booking ${booking.bookingCode}`,
  )
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${waMessage}` : ''

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Booking {booking.bookingCode}</h1>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[booking.bookingStatus] || 'bg-gray-100'}`}
        >
          {STATUS_LABELS[booking.bookingStatus] || booking.bookingStatus}
        </span>
      </div>

      {/* Bank Transfer Card */}
      {booking.bookingStatus === 'pending' && (
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Transfer Pembayaran</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Bank</p>
              <p className="font-medium">{bank.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nomor Rekening</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg font-bold">{bank.accountNumber}</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bank.accountNumber)}
                  className="rounded bg-white px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
                >
                  Salin
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Atas Nama</p>
              <p className="font-medium">{bank.accountName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jumlah Transfer</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-green-700">
                  {formatRupiah(booking.finalPrice)}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(booking.finalPrice))}
                  className="rounded bg-white px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-amber-700">
                Bayar sebelum:{' '}
                <strong>
                  {deadline.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Detail Booking</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nama</span>
            <span className="font-medium">{booking.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in</span>
            <span>{new Date(booking.checkIn).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out</span>
            <span>{new Date(booking.checkOut).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durasi</span>
            <span>{nights} malam</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jumlah Tamu</span>
            <span>{booking.numGuests} orang</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatRupiah(booking.totalPrice)}</span>
          </div>
          {booking.discountAmount > 0 && booking.couponCode && (
            <div className="flex justify-between text-green-600">
              <span>Diskon ({booking.couponCode})</span>
              <span>-{formatRupiah(booking.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatRupiah(booking.finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      {waLink && booking.bookingStatus === 'pending' && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-md bg-green-600 px-6 py-3 text-center text-lg font-semibold text-white transition hover:bg-green-700"
        >
          Konfirmasi via WhatsApp
        </a>
      )}
    </div>
  )
}
