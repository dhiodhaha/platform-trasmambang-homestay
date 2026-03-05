'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { bookingFormSchema, type BookingFormData } from '@/lib/validations'
import { AvailabilityCalendar } from '@/components/Calendar'
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
  bookingExpiryHours?: number
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
  bookingExpiryHours = 24,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState<CouponDiscount | null>(null)
  const [showReview, setShowReview] = useState(false)

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

  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const finalPrice = totalPrice - discountAmount

  const onSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Ensure Payload CMS receives properly formatted ISO 8601 strings with a time component for date fields
      const checkInISO = new Date(`${formData.checkIn}T12:00:00`).toISOString()
      const checkOutISO = new Date(`${formData.checkOut}T12:00:00`).toISOString()

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn: checkInISO,
          checkOut: checkOutISO,
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
      // Set pending booking cookie
      const maxAge = bookingExpiryHours * 3600
      document.cookie = `pending_booking=${booking.doc.slugId}; path=/; max-age=${maxAge}`
      router.push(`/b/${booking.doc.slugId}`)
    } catch {
      setSubmitError('Gagal mengirim booking. Periksa koneksi internet Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedData = watch()

  const handleReviewSubmit = (formData: BookingFormData) => {
    if (!showReview) {
      setShowReview(true)
      return
    }
    onSubmit(formData)
  }

  if (showReview) {
    return (
      <div className="space-y-8">
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
          <h2
            className="text-xl font-medium tracking-tight text-[#122023] mb-6"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Konfirmasi Pemesanan
          </h2>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-y-3">
              <span className="text-[#6B6B6B]">Nama</span>
              <span className="font-medium text-[#122023]">{watchedData.guestName}</span>
              <span className="text-[#6B6B6B]">WhatsApp</span>
              <span className="font-medium text-[#122023]">{watchedData.phone}</span>
              {watchedData.email && (
                <>
                  <span className="text-[#6B6B6B]">Email</span>
                  <span className="font-medium text-[#122023]">{watchedData.email}</span>
                </>
              )}
              <span className="text-[#6B6B6B]">Check-in</span>
              <span className="font-medium text-[#122023]">
                {new Date(watchedData.checkIn).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[#6B6B6B]">Check-out</span>
              <span className="font-medium text-[#122023]">
                {new Date(watchedData.checkOut).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[#6B6B6B]">Durasi</span>
              <span className="font-medium text-[#122023]">{nights} malam</span>
              <span className="text-[#6B6B6B]">Jumlah Tamu</span>
              <span className="font-medium text-[#122023]">{watchedData.numGuests} orang</span>
            </div>
            {watchedData.notes && (
              <div className="pt-2 border-t border-black/5">
                <p className="text-[#6B6B6B] mb-1">Permintaan Khusus</p>
                <p className="text-[#122023]">{watchedData.notes}</p>
              </div>
            )}
            <div className="pt-2 border-t border-black/5 space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Subtotal</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && couponDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon ({couponDiscount.code})</span>
                  <span>-Rp{discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#122023]">
                <span>Total</span>
                <span>Rp{finalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </section>

        {submitError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium text-center">
            {submitError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="flex-1 rounded-full border border-black/10 px-8 py-5 text-center text-sm font-semibold uppercase tracking-widest text-[#122023] transition-colors hover:bg-black/5"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-[#E8C4A0] px-8 py-5 text-center text-sm font-semibold uppercase tracking-widest text-[#122023] transition-colors hover:bg-[#ddb78f] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? 'Memproses...' : 'Konfirmasi & Booking'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-8">
      {/* Date Selection */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
        <h2
          className="text-xl font-medium tracking-tight text-[#122023] mb-6 flex items-center gap-3"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
            1
          </span>
          Pilih Tanggal
        </h2>
        <AvailabilityCalendar
          unavailableDates={unavailableDates}
          minAdvanceDays={minAdvanceDays}
          initialRange={
            initialCheckIn && initialCheckOut
              ? { from: new Date(`${initialCheckIn}T00:00:00`), to: new Date(`${initialCheckOut}T00:00:00`) }
              : undefined
          }
          onSelect={(range) => {
            if (range?.from) {
              setValue('checkIn', formatLocalDate(range.from), {
                shouldValidate: true,
                shouldDirty: true,
              })
            } else {
              setValue('checkIn', '', { shouldValidate: true })
            }

            if (range?.to) {
              setValue('checkOut', formatLocalDate(range.to), {
                shouldValidate: true,
                shouldDirty: true,
              })
            } else {
              setValue('checkOut', '', { shouldValidate: true })
            }
          }}
        />
        {errors.checkIn && (
          <p className="mt-2 text-sm text-red-500 font-medium">{errors.checkIn.message}</p>
        )}
        {errors.checkOut && (
          <p className="mt-2 text-sm text-red-500 font-medium">{errors.checkOut.message}</p>
        )}
        {checkIn && checkOut && nights > 0 && (
          <div className="mt-4 text-sm text-[#6B6B6B] bg-[#F5F5F5] py-3 px-4 rounded-xl space-y-1">
            <p>
              Check-in: <span className="font-medium text-[#122023]">{new Date(checkIn).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
            <p>
              Check-out: <span className="font-medium text-[#122023]">{new Date(checkOut).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
            <p className="text-[#9B9B9B]">untuk {nights} malam</p>
          </div>
        )}
      </section>

      {/* Guest Details */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
        <h2
          className="text-xl font-medium tracking-tight text-[#122023] mb-6 flex items-center gap-3"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
            2
          </span>
          Data Tamu
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              {...register('guestName')}
              className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300"
              placeholder="Sesuai KTP"
            />
            {errors.guestName && (
              <p className="mt-2 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.guestName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300"
                placeholder="08xxxxxxxxxx"
              />
              {errors.phone && (
                <p className="mt-2 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
                Email (opsional)
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300"
                placeholder="email@contoh.com"
              />
              {errors.email && (
                <p className="mt-2 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
              Jumlah Tamu <span className="text-red-500">*</span>
            </label>
            <input
              {...register('numGuests', { valueAsNumber: true })}
              type="number"
              min={1}
              max={maxCapacity}
              className="w-full sm:w-1/2 rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300"
            />
            {errors.numGuests && (
              <p className="mt-2 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.numGuests.message}
              </p>
            )}
            {numGuests > standardCapacity && numGuests <= maxCapacity && (
              <div className="mt-3 flex items-start gap-2.5 bg-[#FFF9F0] border border-[#E8C4A0]/30 px-4 py-3 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8C4A0] mt-1.5 shrink-0"></div>
                <p className="text-[13px] text-[#8C6D4A] leading-relaxed">
                  Melebihi kapasitas ideal ({standardCapacity} tamu). Lebih dari batas ini tidak
                  mendapat fasilitas ekstra.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#6B6B6B] uppercase">
              Permintaan Khusus (opsional)
            </label>
            <textarea
              {...register('notes')}
              className="w-full rounded-2xl border border-black/5 bg-[#F9F9F9] px-5 py-4 text-[15px] font-medium text-[#122023] placeholder:text-black/30 placeholder:font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-white focus:bg-white focus:border-[#E8C4A0] focus:ring-2 focus:ring-[#E8C4A0]/20 focus:outline-none transition-all duration-300 resize-none"
              rows={3}
              placeholder="Catatan tambahan seperti detail check-in..."
            />
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
        <h2
          className="text-xl font-medium tracking-tight text-[#122023] mb-6 flex items-center gap-3"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium">
            3
          </span>
          Ringkasan Pesanan
        </h2>

        {nights > 0 ? (
          <div className="space-y-6">
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

            <div className="pt-2">
              <OrderSummary
                pricePerNight={pricePerNight}
                nights={nights}
                totalPrice={totalPrice}
                discountAmount={discountAmount}
                couponCode={couponDiscount?.code}
                finalPrice={finalPrice}
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAFA] border border-black/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-[#6B6B6B]">
              Pilih tanggal di atas terlebih dahulu untuk melihat ringkasan harga.
            </p>
          </div>
        )}
      </section>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {submitError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium text-center">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || nights <= 0}
        className="w-full rounded-full bg-[#E8C4A0] px-8 py-5 text-center text-sm font-semibold uppercase tracking-widest text-[#122023] transition-colors hover:bg-[#ddb78f] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
      >
        {isSubmitting ? 'Memproses...' : 'Review Pemesanan'}
      </button>
    </form>
  )
}
