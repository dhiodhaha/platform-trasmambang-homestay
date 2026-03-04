import { HeaderClient } from './Component.client'
import { FloatingHeader } from './Component.floating'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as any

  const variant = headerData?.variant || 'default'

  if (variant === 'floating') {
    return <FloatingHeader data={headerData} />
  }

  return <HeaderClient data={headerData} />
}
