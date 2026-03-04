'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

interface PromoPopupData {
  enabled: boolean
  title: string
  description?: string
  image?: {
    url?: string
    alt?: string
  }
  ctaLabel?: string
  ctaUrl?: string
  displayFrequency?: 'every_visit' | 'once_per_session' | 'once_per_day' | 'once_ever'
  maxDisplayCount?: number
  delaySeconds?: number
  startDate?: string
  endDate?: string
}

const STORAGE_KEY = 'trasmambang_promo_popup'

function getStorageData(): { count: number; lastShown: number } {
  if (typeof window === 'undefined') return { count: 0, lastShown: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { count: 0, lastShown: 0 }
}

function setStorageData(data: { count: number; lastShown: number }) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

function shouldShow(data: PromoPopupData): boolean {
  if (!data.enabled) return false

  // Date range checks
  const now = Date.now()
  if (data.startDate && new Date(data.startDate).getTime() > now) return false
  if (data.endDate && new Date(data.endDate).getTime() < now) return false

  const stored = getStorageData()

  // Max display count check
  if (data.maxDisplayCount && data.maxDisplayCount > 0 && stored.count >= data.maxDisplayCount) {
    return false
  }

  const frequency = data.displayFrequency || 'once_per_session'

  switch (frequency) {
    case 'every_visit':
      return true
    case 'once_per_session': {
      // Session = until tab is closed. Use sessionStorage
      if (typeof window === 'undefined') return true
      try {
        const sessionKey = 'trasmambang_promo_session'
        if (sessionStorage.getItem(sessionKey)) return false
        return true
      } catch {
        return true
      }
    }
    case 'once_per_day': {
      const oneDayMs = 24 * 60 * 60 * 1000
      return now - stored.lastShown > oneDayMs
    }
    case 'once_ever':
      return stored.count === 0
    default:
      return true
  }
}

export const PromoPopupClient: React.FC<{ data: PromoPopupData }> = ({ data }) => {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
    }, 200)
  }, [])

  useEffect(() => {
    if (!shouldShow(data)) return

    const delay = (data.delaySeconds ?? 3) * 1000
    const timer = setTimeout(() => {
      setVisible(true)

      // Record display
      const stored = getStorageData()
      setStorageData({
        count: stored.count + 1,
        lastShown: Date.now(),
      })

      // Mark session
      if (data.displayFrequency === 'once_per_session') {
        try {
          sessionStorage.setItem('trasmambang_promo_session', '1')
        } catch {
          // ignore
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [data])

  if (!visible) return null

  const imageUrl = data.image?.url

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-gray-800 hover:bg-white transition-colors shadow-sm"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        {imageUrl && (
          <div className="relative aspect-[16/9] bg-gray-100">
            <Image
              src={imageUrl}
              alt={data.image?.alt || data.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3
            className="text-xl font-semibold tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            {data.title}
          </h3>

          {data.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
          )}

          {data.ctaLabel && data.ctaUrl && (
            <Link
              href={data.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center justify-center w-full gap-2 bg-gray-900 text-white text-sm font-medium rounded-full px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              {data.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
