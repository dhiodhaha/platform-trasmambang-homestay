'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Image from 'next/image'
import * as React from 'react'

gsap.registerPlugin(useGSAP)

type ImageCardProps = {
  src: string // URL of the image
  alt: string // Alt text for the image
  priority?: boolean // Optional boolean for priority
}

const images = [
  {
    src: '/media/view-tangga.webp', // Placeholder for unique image paths
    alt: 'Portfolio showcase with Apex Films branding',
  },
  {
    src: '/media/view-kolam-renang-2.webp', // Placeholder for unique image paths
    alt: 'Close-up of modern vehicle design',
  },
  {
    src: '/media/view-gym.webp', // Placeholder for unique image paths
    alt: 'Team collaboration at workspace',
  },
  {
    src: '/media/view-kolam-renang.webp', // Placeholder for unique image paths
    alt: 'Nike swoosh logo on dark background',
  },
  {
    src: '/media/view-kamar-atas-timur.webp', // Placeholder for unique image paths
    alt: 'Action sports photography',
  },
]

export default function AnimatedGallerySection() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const shuffledImages = React.useMemo(() => {
    const shuffled = [...images].sort(() => Math.random() - 0.5)
    return [...shuffled, ...shuffled]
  }, [])

  useGSAP(
    () => {
      if (scrollRef.current) {
        gsap.to(scrollRef.current, {
          xPercent: -50,
          ease: 'none',
          duration: 90,
          repeat: -1,
        })
      }
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="w-full overflow-hidden  py-12 md:py-16 lg:py-20">
      <div className="container">
        <div ref={scrollRef} className="flex w-max">
          {shuffledImages.map(({ src, alt }, index) => (
            <ImageCard
              key={`${index}-${alt}`}
              src={src || '/placeholder.svg'}
              alt={alt}
              priority={index < 5}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ImageCard({ src, alt, priority }: ImageCardProps) {
  return (
    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />
      </div>
    </div>
  )
}

// export default function ImageCarousel() {
// 	const shuffledImages = useMemo(() => {
// 		const shuffled = [...images].sort(() => Math.random() - 0.5);
// 		return [...shuffled, ...shuffled]; // Duplicate the shuffled array for seamless looping
// 	}, []);

// 	return (
// 		<section className="w-full overflow-hidden bg-background py-12">
// 			<div className="container">
// 				<motion.div
// 					className="flex"
// 					animate={{
// 						x: ["0%", "-50%"], // Changed to -50% as we're using the full set of images once
// 					}}
// 					transition={{
// 						x: {
// 							repeat: Number.POSITIVE_INFINITY,
// 							repeatType: "loop",
// 							duration: 90,
// 							ease: "linear",
// 						},
// 					}}
// 				>
// 					{shuffledImages.map((image, index) => (
// 						<div
// 							key={index}
// 							className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
// 						>
// 							<div className="relative aspect-[16/9] overflow-hidden rounded-lg">
// 								<Image
// 									src={image.src}
// 									alt={image.alt}
// 									fill
// 									className="object-cover transition-transform duration-300 hover:scale-105"
// 									sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
// 									priority={index < 4}
// 								/>
// 							</div>
// 						</div>
// 					))}
// 				</motion.div>
// 			</div>
// 		</section>
// 	);
// }
