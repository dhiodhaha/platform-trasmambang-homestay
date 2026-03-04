import type { GlobalConfig } from 'payload'

import { revalidateLinkTree } from './hooks/revalidateLinkTree'

export const LinkTree: GlobalConfig = {
  slug: 'link-tree',
  label: 'Link Tree',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo / avatar for the link page',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      defaultValue: 'Trasmambang',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      defaultValue: 'Comfy Homestay · Kasihan, Bantul, Yogyakarta',
      admin: {
        description: 'Short bio / description text',
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Globe (Website)', value: 'globe' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Map Pin', value: 'map-pin' },
            { label: 'Phone', value: 'phone' },
            { label: 'Mail', value: 'mail' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this link with a filled/accent style',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Icons',
      admin: {
        description: 'Social media icons shown below bio',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Facebook', value: 'facebook' },
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
    afterChange: [revalidateLinkTree],
  },
}
