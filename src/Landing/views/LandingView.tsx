import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Hero from '@/Landing/components/hero'
import Intro from '@/Landing/components/intro'
import Rooms from '@/Landing/components/rooms'
import Why from '@/Landing/components/why'
import Gallery from '@/Landing/components/gallery'
import Stats from '@/Landing/components/stats'
import Facilities from '@/Landing/components/facilities'
import SocialProof from '@/Landing/components/social-proof'
import Location from '@/Landing/components/location'
import BookingProcess from '@/Landing/components/booking-process'
import FAQ from '@/Landing/components/faq'
import CTA from '@/Landing/components/cta'

export async function LandingView() {
  const settings = await getCachedGlobal('site-settings', 1)()

  const isAutomatedBookingEnabled = settings.isAutomatedBookingEnabled !== false
  const whatsappNumber = settings.whatsappNumber as string

  return (
    <main>
      <Hero />
      <Intro />
      <Rooms />
      <Why />
      <Gallery />
      <Stats />
      <Facilities />
      <SocialProof />
      <Location />
      <BookingProcess />
      <FAQ whatsappNumber={whatsappNumber} />
      <CTA isAutomatedBookingEnabled={isAutomatedBookingEnabled} whatsappNumber={whatsappNumber} />
    </main>
  )
}
