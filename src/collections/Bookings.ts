import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { generateBookingCode } from '../hooks/booking/generateBookingCode'
import { calculatePricing } from '../hooks/booking/calculatePricing'
import { preventSpam } from '../hooks/booking/preventSpam'
import { checkDateOverlap } from '../hooks/booking/checkDateOverlap'
import { validateStatusTransition } from '../hooks/booking/validateStatusTransition'
import { manageCouponUsage } from '../hooks/booking/manageCouponUsage'
import { notifyOwner } from '../hooks/booking/notifyOwner'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'bookingCode',
    defaultColumns: [
      'bookingCode',
      'guestName',
      'checkIn',
      'checkOut',
      'bookingStatus',
      'paymentStatus',
    ],
    listSearchableFields: ['bookingCode', 'guestName', 'phone'],
    group: 'Booking System',
  },
  access: {
    create: anyone,
    read: ({ req }) => {
      if (req.user) return true
      return { bookingCode: { exists: true } }
    },
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [generateBookingCode, calculatePricing],
    beforeChange: [preventSpam, checkDateOverlap, validateStatusTransition],
    afterChange: [manageCouponUsage, notifyOwner],
  },
  fields: [
    // Booking Identification
    {
      name: 'slugId',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: 'URL-safe unique ID (unguessable)' },
    },
    {
      name: 'bookingCode',
      type: 'text',
      unique: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    // Guest Info
    { name: 'guestName', type: 'text', required: true, maxLength: 100 },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    // Dates
    {
      name: 'checkIn',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'checkOut',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    // Guests
    { name: 'numGuests', type: 'number', required: true, min: 1, max: 12 },
    // Status
    {
      name: 'bookingStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Transfer Sent', value: 'transfer_sent' },
        { label: 'Confirmed', value: 'confirmed' },
      ],
      admin: { position: 'sidebar' },
    },
    // Pricing
    { name: 'totalPrice', type: 'number', admin: { readOnly: true } },
    { name: 'couponCode', type: 'text' },
    {
      name: 'discountAmount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    { name: 'finalPrice', type: 'number', admin: { readOnly: true } },
    { name: 'transferCode', type: 'number', admin: { readOnly: true, description: 'Kode unik 3 digit untuk verifikasi transfer' } },
    { name: 'transferAmount', type: 'number', admin: { readOnly: true, description: 'Jumlah transfer = finalPrice + transferCode' } },
    // Notes
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Permintaan khusus dari tamu' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: {
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      admin: { description: 'Catatan internal (tidak terlihat oleh tamu)' },
    },
    // Honeypot
    {
      name: 'website',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value) {
              throw new Error('Invalid submission')
            }
            return value
          },
        ],
      },
    },
  ],
}
