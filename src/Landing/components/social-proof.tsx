"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import { Quote, Star } from "lucide-react";

const testimonials = [
	{
		name: "Nasrull Larada",
		origin: "Jakarta",
		rating: 5,
		review:
			"Sudah nenerapa kali menginap di Transmambang Comfy Homestay, serasa dirumah sendiri. Fasilitas serba ada dg kualitas no 1, dan lingkungan yg auper asri, terlebih buat jogging pagi.",
		date: "Juli 2025",
	},
	{
		name: "Oktha Pramudyo",
		origin: "Tangerang",
		rating: 5,
		review:
			"Keren sih. Bersih. Recomended lah. Dapet diskon di bulan rajab. Sebagian keuntungan di sumbangkan ke anak yatim piatu. Dapet berkahnya jg yg nyewa homestay.",
		date: "2025",
	},
	{
		name: "rivaldo",
		origin: "Jakarta",
		rating: 5,
		review:
			"homestay aesthetic, Instagramable, vibes homey, wifi ngebut, kamar cozy. Ada library nya juga, gym dan pool. Lokasi strategis, deket pusat wisata Jogja. rekomen banget",
		date: "2025",
	},
];

export default function SocialProof() {
	const containerRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLParagraphElement>(null);

	useGSAP(
		() => {
			if (headerRef.current) {
				gsap.from(headerRef.current, {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: headerRef.current,
						start: "top 80%",
						once: true,
					},
				});
			}

			if (gridRef.current) {
				const items = gridRef.current.querySelectorAll(".testimonial-item");
				gsap.from(items, {
					y: 30,
					opacity: 0,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out",
					scrollTrigger: {
						trigger: gridRef.current,
						start: "top 80%",
						once: true,
					},
				});
			}

			if (footerRef.current) {
				gsap.from(footerRef.current, {
					opacity: 0,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: footerRef.current,
						start: "top 90%",
						once: true,
					},
				});
			}
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			className="py-[120px] px-4 bg-[#F5F5F5] scroll-mt-16"
			id="testimoni"
		>
			<div className="max-w-[1200px] mx-auto">
				<div ref={headerRef} className="text-center mb-16">
					<span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20 mb-4">
						Testimoni
					</span>
					<h2
						className="text-4xl md:text-5xl tracking-[-0.03em] font-normal mb-8"
						style={{ fontFamily: "var(--font-geist-sans)" }}
					>
						Tamu Kami Puas Menginap
					</h2>

					{/* Google Maps rating badge */}
					<div className="inline-flex flex-col items-center gap-2 bg-white rounded-2xl px-8 py-6 border border-[#DADADA]">
						<div className="flex items-center gap-2">
							<span
								className="text-5xl font-normal tracking-[-0.04em] text-[#1E1E1F]"
								style={{ fontFamily: "var(--font-geist-sans)" }}
							>
								5.0
							</span>
							<div className="flex gap-0.5">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className="w-5 h-5 fill-[#FBBC04] text-[#FBBC04]"
									/>
								))}
							</div>
						</div>
						<p className="text-sm text-[#6B6B6B]">di Google Maps</p>
					</div>
				</div>

				{/* Testimonial cards */}
				<div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name}
							className="testimonial-item bg-white rounded-2xl p-8 space-y-4 border border-[#DADADA]"
						>
							<Quote className="w-6 h-6 text-[#E8C4A0]" />
							<p className="text-[#1E1E1F] leading-relaxed">
								&ldquo;{testimonial.review}&rdquo;
							</p>
							<div className="flex items-center gap-1">
								{Array.from({ length: testimonial.rating }).map((_, i) => (
									<Star
										key={`star-${testimonial.name}-${i}`}
										className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]"
									/>
								))}
							</div>
							<div className="pt-4 border-t border-[#DADADA]">
								<p className="text-sm font-medium text-[#1E1E1F]">
									{testimonial.name}
								</p>
								<p className="text-xs text-[#6B6B6B]">
									{testimonial.origin} · {testimonial.date}
								</p>
							</div>
						</div>
					))}
				</div>

				<p ref={footerRef} className="text-center text-xs text-[#6B6B6B] mt-8">
					* Ulasan asli dari tamu kami di Google Maps
				</p>
			</div>
		</section>
	);
}
