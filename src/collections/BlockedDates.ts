import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const BlockedDates: CollectionConfig = {
  slug: 'blocked-dates',
  admin: {
    useAsTitle: 'reason',
    defaultColumns: ['startDate', 'endDate', 'reason'],
    group: 'Booking System',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'reason',
      type: 'text',
      admin: { description: 'e.g. "Pemakaian pribadi", "Maintenance"' },
    },
  ],
}
