import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'usedCount', 'isActive'],
    group: 'Booking System',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ value }) => value?.toUpperCase().trim()],
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed (Rp)', value: 'fixed' },
      ],
    },
    { name: 'discountValue', type: 'number', required: true, min: 1 },
    {
      name: 'maxDiscountAmount',
      type: 'number',
      admin: {
        description: 'Cap diskon untuk tipe percentage (Rp)',
        condition: (data) => data?.discountType === 'percentage',
      },
    },
    {
      name: 'minNights',
      type: 'number',
      admin: { description: 'Min malam untuk pakai kupon' },
    },
    {
      name: 'maxUses',
      type: 'number',
      admin: { description: 'Batas pemakaian (kosong = unlimited)' },
    },
    {
      name: 'usedCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
