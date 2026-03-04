import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

interface ColumnsFooterProps {
  data: Footer
}

export function ColumnsFooter({ data }: ColumnsFooterProps) {
  const navItems = data?.navItems || []
  const tagline = (data as any)?.tagline || 'Comfy Homestay'
  const contactPhone = (data as any)?.contactPhone || '+62851 1708 2122'
  const socialLinks = (data as any)?.socialLinks || []

  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-white text-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2
              className="text-2xl tracking-tight font-normal mb-1"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              TRASMAMBANG
            </h2>
            <p className="text-sm text-gray-500">{tagline}</p>
          </div>

          {/* Halaman */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Halaman
            </h3>
            <nav className="flex flex-col gap-2.5">
              {navItems.map(({ link }, i) => {
                const href =
                  link?.type === 'reference' &&
                  typeof link?.reference?.value === 'object' &&
                  link?.reference?.value?.slug
                    ? `${link?.reference?.relationTo !== 'pages' ? `/${link?.reference?.relationTo}` : ''}/${link.reference.value.slug}`
                    : link?.url || '#'

                return (
                  <Link
                    key={i}
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link?.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Kontak
            </h3>
            <p className="text-sm text-gray-600">{contactPhone}</p>
          </div>

          {/* Sosial */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Sosial
            </h3>
            <nav className="flex flex-col gap-2.5">
              {socialLinks.map(
                (social: { platform: string; url: string; id?: string }, i: number) => (
                  <Link
                    key={social.id || i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors capitalize"
                  >
                    {social.platform}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <p className="text-xs text-gray-400">
            &copy;{currentYear} Trasmambang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
