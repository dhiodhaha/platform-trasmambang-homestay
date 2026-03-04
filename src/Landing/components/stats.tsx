"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
	{ value: "4", label: "Kamar Tidur" },
	{ value: "60+", label: "Fasilitas" },
	{ value: "1", label: "Kolam Renang" },
	{ value: "24jam", label: "Akses Aman" },
];

export default function Stats() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (containerRef.current) {
				gsap.from(containerRef.current, {
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top 80%",
						once: true,
					},
				});
			}
		},
		{ scope: containerRef },
	);

	return (
		<section className="bg-[#F5F5F5] py-[80px] px-4">
			<div ref={containerRef} className="max-w-[1200px] mx-auto space-y-12">
				<div className="text-center">
					<span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20">
						Angka Kami
					</span>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4">
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className={`text-center py-6 ${index < stats.length - 1 ? "md:border-r md:border-[#DADADA]" : ""}`}
						>
							<p
								className="text-5xl md:text-6xl font-normal tracking-[-0.04em] text-[#1E1E1F]"
								style={{ fontFamily: "var(--font-geist-sans)" }}
							>
								{stat.value}
							</p>
							<p className="text-sm uppercase tracking-wide text-[#6B6B6B] mt-2">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
