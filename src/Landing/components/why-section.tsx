import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Container } from './container'
// Asumsikan Anda sudah membuat Container

// Definisikan tipe untuk data card
interface WhyCardProps {
  id: string
  imageSrc: string
  alt: string
  title: string
  description: string
}

// Komponen reusable untuk card
const WhyCard: React.FC<WhyCardProps> = ({ id, imageSrc, alt, title, description }) => (
  <Card className="border-none shadow-none bg-transparent">
    <CardContent className="p-0">
      <div className="aspect-video relative mb-4">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
)

// Data kartu yang dapat dengan mudah ditambah/dikurangi
const whyCards: WhyCardProps[] = [
  {
    id: '1',
    imageSrc: '/media/view-kolam-renang-2.webp',
    alt: 'Interior dengan kolam renang',
    title: 'Didesain khusus untuk keluarga',
    description: 'Suasana yang hangat dan fasilitas lengkap.',
  },
  {
    id: '2',
    imageSrc: '/media/ruang-tamu.webp',
    alt: 'Ruang tamu dengan sofa',
    title: 'Fasilitas lengkap',
    description: 'Baik untuk bersantai maupun menjaga rutinitas harian.',
  },
  {
    id: '3',
    imageSrc: '/media/ruang-makan.webp',
    alt: 'Ruang makan',
    title: 'Lingkungan yang aman dan tenang',
    description: 'Untuk keluarga yang menginginkan privasi.',
  },
]

export default function WhySection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <Container>
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-medium text-center mb-8 md:mb-12">
          Mengapa menginap di Trasmambang
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {whyCards.map((card) => (
            <WhyCard key={card.id} {...card} />
          ))}
        </div>
      </Container>
    </section>
  )
}
