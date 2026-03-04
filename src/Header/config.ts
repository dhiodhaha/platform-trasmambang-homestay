import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a custom logo for the header (optional)',
      },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Floating Pill', value: 'floating' },
      ],
      admin: {
        description: 'Choose the header design variant',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Cek Ketersediaan',
      admin: {
        description: 'CTA Button Label (for Floating Pill)',
        condition: (data) => data?.variant === 'floating',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue:
        'https://wa.me/6285117082122?text=Halo%2C%20saya%20tertarik%20dengan%20promo%20trasmambang',
      admin: {
        description: 'CTA Button URL (for Floating Pill)',
        condition: (data) => data?.variant === 'floating',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
