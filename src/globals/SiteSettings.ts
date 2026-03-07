import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: 'System Toggles',
      fields: [
        {
          name: 'isAutomatedBookingEnabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Matikan untuk menggunakan WhatsApp manual (saat maintenance/full)',
          },
        },
        {
          name: 'isWhatsAppFloatingButtonEnabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Tampilkan tombol WhatsApp melayang di sudut kanan bawah setiap halaman',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pricing',
      fields: [
        {
          name: 'pricePerNight',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: { description: 'Harga per malam (Rupiah)' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Capacity',
      fields: [
        {
          name: 'standardCapacity',
          type: 'number',
          defaultValue: 8,
          admin: { description: 'Batas tamu standar (fasilitas handuk)' },
        },
        {
          name: 'maxCapacity',
          type: 'number',
          defaultValue: 12,
          admin: { description: 'Batas tamu maksimal (hard limit)' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Booking Rules',
      fields: [
        { name: 'maxBookingNights', type: 'number', defaultValue: 30 },
        {
          name: 'bookingExpiryHours',
          type: 'number',
          defaultValue: 24,
          admin: { description: 'Booking pending auto-expire setelah X jam' },
        },
        {
          name: 'minAdvanceDays',
          type: 'number',
          defaultValue: 1,
          admin: { description: 'Minimum hari advance booking (0 = sama hari)' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bank Transfer Details',
      fields: [
        {
          name: 'bankName',
          type: 'text',
          admin: { description: 'e.g. BCA, BRI, Mandiri' },
        },
        { name: 'bankAccountNumber', type: 'text' },
        { name: 'bankAccountName', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'WhatsApp',
      fields: [
        {
          name: 'whatsappNumber',
          type: 'text',
          required: true,
          defaultValue: '6285117082122',
          admin: {
            description:
              'Nomor WA owner (format: 6285xxx). Digunakan untuk fallback booking dan tombol melayang.',
          },
        },
      ],
    },
  ],
}
