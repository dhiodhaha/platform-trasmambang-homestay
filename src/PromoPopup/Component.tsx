import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { PromoPopupClient } from './Component.client'

export async function PromoPopup() {
  const promoData = await getCachedGlobal('promo-popup', 1)()

  if (!(promoData as any)?.enabled) {
    return null
  }

  return <PromoPopupClient data={promoData as any} />
}
