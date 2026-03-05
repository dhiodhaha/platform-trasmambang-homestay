import { z } from 'zod'

const phoneRegex = /^(\+62|62|08)\d{8,13}$/

export const bookingFormSchema = z.object({
  guestName: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  phone: z.string().regex(phoneRegex, 'Format nomor HP tidak valid (contoh: 08xx atau +62xx)'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  checkIn: z.string().min(1, 'Pilih tanggal check-in'),
  checkOut: z.string().min(1, 'Pilih tanggal check-out'),
  numGuests: z.number().min(1, 'Minimal 1 tamu').max(12, 'Maksimal 12 tamu'),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

export const couponValidateSchema = z.object({
  code: z.string().min(1, 'Masukkan kode kupon'),
  nights: z.number().min(1),
})
