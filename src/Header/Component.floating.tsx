'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

import type { Header } from '@/payload-types'

interface FloatingHeaderProps {
  data: Header
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const navItems = data?.navItems || []
  const ctaLabel = (data as any)?.ctaLabel || 'Cek Ketersediaan'
  const ctaUrl =
    (data as any)?.ctaUrl ||
    'https://wa.me/6285117082122?text=Halo%2C%20saya%20dari%20website%20trasmambang.com'

  useEffect(() => {
    setHeaderTheme(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div
          className={`flex items-center justify-between gap-6 px-6 py-3 rounded-full bg-white shadow-lg transition-all duration-300 w-full max-w-3xl ${
            scrolled ? 'shadow-xl bg-white/95 backdrop-blur-md' : ''
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={
                typeof (data as any)?.logo === 'object' && (data as any)?.logo?.url
                  ? (data as any).logo.url
                  : '/media/depan-homestay-300x169.webp'
              }
              alt={
                typeof (data as any)?.logo === 'object' && (data as any)?.logo?.alt
                  ? (data as any).logo.alt
                  : 'Trasmambang'
              }
              className="h-10 w-auto rounded-lg object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ link }, i) => {
              const slug =
                typeof link?.reference?.value === 'object' ? link?.reference?.value?.slug : null
              const href =
                link?.type === 'reference' && slug
                  ? `${link?.reference?.relationTo !== 'pages' ? `/${link?.reference?.relationTo}` : ''}/${slug === 'home' ? '' : slug}${link?.sectionId ? `#${link.sectionId}` : ''}`
                  : link?.url || '#'

              return (
                <Link
                  key={i}
                  href={href}
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link?.label}
                </Link>
              )
            })}
          </nav>

          {/* Cek Pesanan */}
          <Link
            href="/cek-pesanan"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cek Pesanan
          </Link>

          {/* CTA Button */}
          <Link
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full px-5 py-2.5 hover:bg-gray-900 transition-colors"
          >
            {ctaLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6">
            {navItems.map(({ link }, i) => {
              const slug =
                typeof link?.reference?.value === 'object' ? link?.reference?.value?.slug : null
              const href =
                link?.type === 'reference' && slug
                  ? `${link?.reference?.relationTo !== 'pages' ? `/${link?.reference?.relationTo}` : ''}/${slug === 'home' ? '' : slug}${link?.sectionId ? `#${link.sectionId}` : ''}`
                  : link?.url || '#'

              return (
                <Link
                  key={i}
                  href={href}
                  className="text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors border-b border-gray-100 pb-4"
                  onClick={() => setMobileOpen(false)}
                >
                  {link?.label}
                </Link>
              )
            })}
            <Link
              href="/cek-pesanan"
              className="text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors border-b border-gray-100 pb-4"
              onClick={() => setMobileOpen(false)}
            >
              Cek Pesanan
            </Link>
            <Link
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white text-sm font-semibold uppercase tracking-wider rounded-full px-6 py-3 hover:bg-gray-900 transition-colors mt-4"
              onClick={() => setMobileOpen(false)}
            >
              {ctaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
