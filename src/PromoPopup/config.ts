import type { GlobalConfig } from 'payload'

import { revalidatePromoPopup } from './hooks/revalidatePromoPopup'

export const PromoPopup: GlobalConfig = {
  slug: 'promo-popup',
  label: 'Promo Popup',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable or disable the promo popup',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Pesan Sekarang',
      admin: {
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue:
        'https://wa.me/6285117082122?text=Halo%2C%20saya%20tertarik%20dengan%20promo%20trasmambang',
      admin: {
        condition: (data) => data?.enabled,
      },
    },
    {
      type: 'collapsible',
      label: 'Display Settings',
      admin: {
        condition: (data) => data?.enabled,
      },
      fields: [
        {
          name: 'displayFrequency',
          type: 'select',
          defaultValue: 'once_per_session',
          options: [
            { label: 'Every Visit', value: 'every_visit' },
            { label: 'Once Per Session', value: 'once_per_session' },
            { label: 'Once Per Day', value: 'once_per_day' },
            { label: 'Once Ever', value: 'once_ever' },
          ],
          admin: {
            description: 'How often the popup appears to the same visitor',
          },
        },
        {
          name: 'maxDisplayCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Max times to show popup (0 = unlimited)',
          },
        },
        {
          name: 'delaySeconds',
          type: 'number',
          defaultValue: 3,
          admin: {
            description: 'Seconds before popup appears after page load',
          },
        },
        {
          name: 'startDate',
          type: 'date',
          admin: {
            description: 'Optional: popup only shows after this date',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'Optional: popup stops showing after this date',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePromoPopup],
  },
}
