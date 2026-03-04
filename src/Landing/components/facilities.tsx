"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import {
	Bath,
	Bed,
	Building2,
	Car,
	Cigarette,
	Dumbbell,
	MapPin,
	PlayCircle,
	Shield,
	Tv,
	UtensilsCrossed,
	UtensilsIcon,
	WavesLadder,
	Wifi,
	Wind,
} from "lucide-react";
import { FacilitiesModal } from "./facilities-modal";

const facilities = [
	{
		id: "1",
		icon: <WavesLadder className="w-5 h-5" />,
		text: "Kolam Renang Indoor",
	},
	{ id: "2", icon: <Dumbbell className="w-5 h-5" />, text: "Gym Corner" },
	{
		id: "3",
		icon: <PlayCircle className="w-5 h-5" />,
		text: "Mini Indoor Playground",
	},
	{
		id: "4",
		icon: <Wind className="w-5 h-5" />,
		text: "AC dengan purifier berkualitas",
	},
	{
		id: "5",
		icon: <Bed className="w-5 h-5" />,
		text: "4 Kamar sejuk dengan twin bed/king size",
	},
	{ id: "6", icon: <Bath className="w-5 h-5" />, text: "Handuk" },
	{
		id: "7",
		icon: <UtensilsCrossed className="w-5 h-5" />,
		text: "Dapur di lantai 1 dan 2",
	},
	{
		id: "8",
		icon: <UtensilsIcon className="w-5 h-5" />,
		text: "Ruang Makan Luas",
	},
	{ id: "9", icon: <Car className="w-5 h-5" />, text: "Garasi Mobil" },
	{
		id: "10",
		icon: <Tv className="w-5 h-5" />,
		text: "Televisi di setiap lantai",
	},
	{
		id: "11",
		icon: <Cigarette className="w-5 h-5" />,
		text: "Area Merokok Outdoor",
	},
	{
		id: "12",
		icon: <Wifi className="w-5 h-5" />,
		text: "Wifi Cepat dan Stabil",
	},
	{
		id: "13",
		icon: <Building2 className="w-5 h-5" />,
		text: "Dekat dengan Fasilitas Umum",
	},
	{
		id: "14",
		icon: <MapPin className="w-5 h-5" />,
		text: "Dekat dengan berbagai tempat wisata",
	},
	{ id: "15", icon: <Shield className="w-5 h-5" />, text: "Akses Aman" },
];

export default function Facilities() {
	const containerRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

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
				const items = gridRef.current.querySelectorAll(".facility-item");
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
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			className="py-[120px] px-4 bg-[#F5F5F5] scroll-mt-16"
			id="fasilitas"
		>
			<div className="max-w-[1200px] mx-auto">
				<div ref={headerRef}>
					<span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20 mb-4">
						Fasilitas
					</span>
					<h2
						className="text-4xl md:text-5xl tracking-[-0.03em] font-normal mb-16"
						style={{ fontFamily: "var(--font-geist-sans)" }}
					>
						Semua yang Anda butuhkan
					</h2>
				</div>
				<div
					ref={gridRef}
					className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
				>
					{facilities.map((facility, index) => (
						<div
							key={facility.id}
							className="facility-item flex items-center gap-3 py-4 border-b border-[#DADADA]"
						>
							<div className="text-[#1E1E1F]">{facility.icon}</div>
							<span className="text-sm text-[#6B6B6B]">{facility.text}</span>
						</div>
					))}
				</div>
				<p className="text-sm text-[#6B6B6B] text-center mt-8">
					<FacilitiesModal />
				</p>
			</div>
		</section>
	);
}
