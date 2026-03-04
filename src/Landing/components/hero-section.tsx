import Image from 'next/image'

export default function HeroSection() {
  return (
    <article className="max-w-7xl mx-auto px-4 py-12 ">
      <div className="space-y-8  text-center p-0 md:p-32">
        <h1 className="text-5xl lg:text-6xl tracking-tight ">
          Liburan seperti menginap di rumah sendiri
        </h1>

        <p className="text-xl text-muted-foreground ">
          Homestay kami dirancang khusus untuk memberikan pengalaman menginap yang nyaman, lengkap
          dengan fasilitas modern dan suasana yang hangat. Dilengkapi 4 kamar sejuk, kolam renang,
          gym corner, dan dapur yang lengkap, rasakan seperti di rumah sendiri.
        </p>

        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
          <Image
            src="/media/depan-homestay.webp?height=900&width=1600"
            alt="Abstract green background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </article>
  )
}
