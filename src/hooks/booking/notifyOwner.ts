import type { CollectionAfterChangeHook } from 'payload'

export const notifyOwner: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const settings = await req.payload.findGlobal({ slug: 'site-settings' })
  const ownerPhone = settings.whatsappNumber || ''

  if (!ownerPhone) {
    console.warn('[Booking] No WhatsApp number configured in SiteSettings')
    return doc
  }

  const message = encodeURIComponent(
    `🏠 Booking Baru - Trasmambang\n\n` +
      `Kode: ${doc.bookingCode}\n` +
      `Nama: ${doc.guestName}\n` +
      `Check-in: ${doc.checkIn}\n` +
      `Check-out: ${doc.checkOut}\n` +
      `Tamu: ${doc.numGuests} orang\n` +
      `Total: Rp${doc.finalPrice?.toLocaleString('id-ID')}\n` +
      (doc.couponCode
        ? `Kupon: ${doc.couponCode} (-Rp${doc.discountAmount?.toLocaleString('id-ID')})\n`
        : '') +
      `\nCek detail: /admin/collections/bookings/${doc.id}`,
  )

  const waLink = `https://wa.me/${ownerPhone}?text=${message}`
  console.log(`[Booking] New booking ${doc.bookingCode} — notify owner: ${waLink}`)

  return doc
}
