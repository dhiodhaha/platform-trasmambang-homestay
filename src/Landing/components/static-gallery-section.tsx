"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
	id: string;
	src: string;
	alt: string;
}

export default function GallerySection() {
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	const images: GalleryImage[] = [
		{
			id: "1",
			src: "/placeholder.svg?height=800&width=1200",
			alt: "Modern house exterior view at dusk",
		},
		{
			id: "2",
			src: "/placeholder.svg?height=400&width=600",
			alt: "Indoor pool area",
		},
		{
			id: "3",
			src: "/placeholder.svg?height=400&width=600",
			alt: "Living room interior",
		},
		{
			id: "4",
			src: "/placeholder.svg?height=400&width=600",
			alt: "Dining area",
		},
	];

	return (
		<section className="w-full">
			<div className="container px-4 mx-auto">
				<div className="space-y-4">
					{/* Main Image - Full Width */}
					<div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
						<Image
							src={images[0].src}
							alt={images[0].alt}
							fill
							className="object-cover hover:scale-105 transition-transform duration-300"
							sizes="(min-width: 1280px) 1200px, 100vw"
							priority
							onClick={() => setSelectedImage(images[0])}
						/>
					</div>

					{/* Thumbnail Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{images.slice(1).map((image) => (
							<div
								key={image.id}
								className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md"
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
									sizes="(min-width: 768px) 33vw, 100vw"
									onClick={() => setSelectedImage(image)}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Lightbox Dialog */}
			<Dialog
				open={!!selectedImage}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
					<DialogTitle asChild>
						<VisuallyHidden>
							{selectedImage ? selectedImage.alt : "Image Preview"}
						</VisuallyHidden>
					</DialogTitle>
					{selectedImage && (
						<div className="relative w-full aspect-[16/9]">
							<Image
								src={selectedImage.src}
								alt={selectedImage.alt}
								fill
								className="object-contain"
								sizes="90vw"
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</section>
	);
}
