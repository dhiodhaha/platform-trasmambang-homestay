import { getCachedGlobal } from '@/utilities/getGlobals'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Globe, Instagram, Youtube, Twitter, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

// Icon mapping
const CustomIcons = {
  tiktok: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <title>TikTok</title>
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  ),
  whatsapp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
}

const ICONS = {
  globe: Globe,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  ...CustomIcons,
} as const

type IconType = keyof typeof ICONS

function LinkIcon({ icon, className = 'w-5 h-5' }: { icon?: string; className?: string }) {
  const IconComponent = ICONS[icon as IconType] || ExternalLink

  return <IconComponent className={className} />
}

function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  return <LinkIcon icon={platform} className={className || 'w-5 h-5'} />
}

const themeStyles = {
  light: {
    bg: 'bg-gray-50',
    card: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:shadow-md',
    cardFeatured: 'bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 hover:shadow-md',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    socialBtn: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
  },
  dark: {
    bg: 'bg-gray-950',
    card: 'bg-gray-900 border border-gray-800 text-white hover:bg-gray-800 hover:shadow-md',
    cardFeatured: 'bg-white text-gray-900 border border-white hover:bg-gray-100 hover:shadow-md',
    text: 'text-white',
    textMuted: 'text-gray-400',
    socialBtn: 'text-gray-400 hover:text-white hover:bg-gray-800',
  },
  gradient: {
    bg: 'bg-gradient-to-br from-violet-100 via-pink-50 to-amber-100',
    card: 'bg-white/80 backdrop-blur-sm border border-white/60 text-gray-900 hover:bg-white hover:shadow-md',
    cardFeatured: 'bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 hover:shadow-md',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    socialBtn: 'text-gray-600 hover:text-gray-900 hover:bg-white/60',
  },
}

export const metadata: Metadata = {
  title: 'Trasmambang | Links',
  description: 'Semua link Trasmambang Homestay di satu tempat.',
}

export default async function LinkTreePage() {
  const linkTreeData = await getCachedGlobal('link-tree', 1)()
  const data = linkTreeData as any

  const displayName = data?.displayName || 'Trasmambang'
  const bio = data?.bio || ''
  const theme = (data?.theme as keyof typeof themeStyles) || 'light'
  const links = data?.links || []
  const socialLinks = data?.socialLinks || []
  const profileImage = data?.profileImage

  const styles = themeStyles[theme] || themeStyles.light

  return (
    <div className={`min-h-screen ${styles.bg} flex items-start justify-center py-12 px-4`}>
      <div className="w-full max-w-md space-y-8">
        {/* Profile Section */}
        <div className="text-center space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            {profileImage?.url ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image
                  src={profileImage.url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className={`w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center ring-4 ring-white shadow-lg`}
              >
                <span className={`text-3xl font-semibold ${styles.text}`}>
                  {displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Name & Bio */}
          <div className="space-y-1">
            <h1
              className={`text-xl font-semibold tracking-tight ${styles.text}`}
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {displayName}
            </h1>
            {bio && <p className={`text-sm ${styles.textMuted}`}>{bio}</p>}
          </div>

          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map(
                (social: { platform: string; url: string; id?: string }, i: number) => (
                  <Link
                    key={social.id || i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all duration-200 ${styles.socialBtn}`}
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} className="w-5 h-5" />
                  </Link>
                ),
              )}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map(
            (
              link: { label: string; url: string; icon?: string; featured?: boolean; id?: string },
              i: number,
            ) => (
              <Link
                key={link.id || i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 w-full px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  link.featured ? styles.cardFeatured : styles.card
                }`}
              >
                {link.icon && link.icon !== 'none' && (
                  <LinkIcon icon={link.icon} className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="flex-1 text-center">{link.label}</span>
              </Link>
            ),
          )}
        </div>

        {/* Footer branding */}
        <div className="text-center pt-8">
          <p className={`text-xs ${styles.textMuted}`}>
            &copy; {new Date().getFullYear()} {displayName}
          </p>
        </div>
      </div>
    </div>
  )
}
