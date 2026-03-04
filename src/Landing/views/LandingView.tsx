import React from 'react'
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

export function LandingView() {
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
      <FAQ />
      <CTA />
    </main>
  )
}
