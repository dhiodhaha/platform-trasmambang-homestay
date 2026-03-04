'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { bookingFormSchema, type BookingFormData } from '@/lib/validations'
import { AvailabilityCalendar } from './availability-calendar'
import { CouponInput } from './coupon-input'
import { OrderSummary } from './order-summary'

type Props = {
  pricePerNight: number
  standardCapacity: number
  maxCapacity: number
  minAdvanceDays: number
  unavailableDates: Array<{ start: string; end: string }>
  initialCheckIn?: string
  initialCheckOut?: string
}

type CouponDiscount = {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscountAmount: number | null
}

export function BookingForm({
  pricePerNight,
  standardCapacity,
  maxCapacity,
  initialCheckIn,
  initialCheckOut,
  minAdvanceDays,
  unavailableDates,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState<CouponDiscount | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: initialCheckIn || '',
      checkOut: initialCheckOut || '',
      numGuests: 1,
      couponCode: '',
      notes: '',
    },
  })

  const checkIn = watch('checkIn')
  const checkOut = watch('checkOut')
  const numGuests = watch('numGuests')

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0

  const totalPrice = nights * pricePerNight

  let discountAmount = 0
  if (couponDiscount && totalPrice > 0) {
    if (couponDiscount.discountType === 'percentage') {
      discountAmount = totalPrice * (couponDiscount.discountValue / 100)
      if (couponDiscount.maxDiscountAmount && discountAmount > couponDiscount.maxDiscountAmount) {
        discountAmount = couponDiscount.maxDiscountAmount
      }
    } else {
      discountAmount = couponDiscount.discountValue
    }
    discountAmount = Math.min(discountAmount, totalPrice)
  }

  const finalPrice = totalPrice - discountAmount

  const onSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          couponCode: couponDiscount?.code || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        const message =
          err?.errors?.[0]?.message || err?.message || 'Terjadi kesalahan, silakan coba lagi'
        setSubmitError(message)
        return
      }

      const booking = await res.json()
      router.push(`/booking/${booking.doc.bookingCode}`)
    } catch {
      setSubmitError('Gagal mengirim booking. Periksa koneksi internet Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Date Selection */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">1. Pilih Tanggal</h2>
        <AvailabilityCalendar
          unavailableDates={unavailableDates}
          minAdvanceDays={minAdvanceDays}
          initialRange={
            initialCheckIn && initialCheckOut
              ? { from: new Date(initialCheckIn), to: new Date(initialCheckOut) }
              : undefined
          }
          onSelect={(range) => {
            if (range?.from) setValue('checkIn', range.from.toISOString().split('T')[0])
            if (range?.to) setValue('checkOut', range.to.toISOString().split('T')[0])
          }}
        />
        {errors.checkIn && <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>}
        {errors.checkOut && <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>}
        {checkIn && checkOut && nights > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {nights} malam: {new Date(checkIn).toLocaleDateString('id-ID')} -{' '}
            {new Date(checkOut).toLocaleDateString('id-ID')}
          </p>
        )}
      </section>

      {/* Guest Details */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">2. Data Tamu</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              {...register('guestName')}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Nama lengkap"
            />
            {errors.guestName && (
              <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              className="w-full rounded-md border px-3 py-2"
              placeholder="08xxxxxxxxxx"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email (opsional)</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-md border px-3 py-2"
              placeholder="email@contoh.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Jumlah Tamu <span className="text-red-500">*</span>
            </label>
            <input
              {...register('numGuests', { valueAsNumber: true })}
              type="number"
              min={1}
              max={maxCapacity}
              className="w-full rounded-md border px-3 py-2"
            />
            {errors.numGuests && (
              <p className="mt-1 text-sm text-red-600">{errors.numGuests.message}</p>
            )}
            {numGuests > standardCapacity && numGuests <= maxCapacity && (
              <p className="mt-1 text-sm text-amber-600">
                Melebihi {standardCapacity} tamu, lebih dari {standardCapacity} tamu tidak mendapat
                fasilitas handuk
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Permintaan Khusus (opsional)</label>
            <textarea
              {...register('notes')}
              className="w-full rounded-md border px-3 py-2"
              rows={3}
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">3. Ringkasan Pesanan</h2>

        {nights > 0 && (
          <>
            <CouponInput
              nights={nights}
              onApply={(discount) => {
                setCouponDiscount(discount)
                setValue('couponCode', discount.code)
              }}
              onRemove={() => {
                setCouponDiscount(null)
                setValue('couponCode', '')
              }}
            />

            <OrderSummary
              pricePerNight={pricePerNight}
              nights={nights}
              totalPrice={totalPrice}
              discountAmount={discountAmount}
              couponCode={couponDiscount?.code}
              finalPrice={finalPrice}
            />
          </>
        )}

        {nights <= 0 && (
          <p className="text-sm text-gray-500">Pilih tanggal terlebih dahulu untuk melihat harga.</p>
        )}
      </section>

      {/* Honeypot */}
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || nights <= 0}
        className="w-full rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Booking'}
      </button>
    </form>
  )
}
