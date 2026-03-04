import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Multi-Column', value: 'columns' },
      ],
      admin: {
        description: 'Choose the footer design variant',
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Comfy Homestay',
      admin: {
        description: 'Brand tagline (used in Multi-Column variant)',
        condition: (data) => data?.variant === 'columns',
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      defaultValue: '+62851 1708 2122',
      admin: {
        description: 'Contact phone number',
        condition: (data) => data?.variant === 'columns',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        condition: (data) => data?.variant === 'columns',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
