"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import {
	CalendarCheck,
	CheckCircle2,
	Cigarette,
	Clock,
	Landmark,
	MessageCircle,
	PartyPopper,
	PawPrint,
	Volume2,
	Wallet,
} from "lucide-react";

const bookingSteps = [
	{
		step: 1,
		icon: <MessageCircle className="w-6 h-6" />,
		title: "Chat WhatsApp",
		description: "Hubungi kami untuk tanya ketersediaan",
	},
	{
		step: 2,
		icon: <CalendarCheck className="w-6 h-6" />,
		title: "Cek Ketersediaan",
		description: "Kami konfirmasi tanggal yang Anda inginkan",
	},
	{
		step: 3,
		icon: <Wallet className="w-6 h-6" />,
		title: "Bayar DP",
		description: "Transfer DP untuk mengamankan tanggal",
	},
	{
		step: 4,
		icon: <CheckCircle2 className="w-6 h-6" />,
		title: "Konfirmasi",
		description: "Booking Anda dikonfirmasi, siap menginap!",
	},
];

const houseRules = [
	{
		icon: <Clock className="w-4 h-4" />,
		rule: "Check-in 14:00, Check-out 12:00",
	},
	{
		icon: <PartyPopper className="w-4 h-4" />,
		rule: "Dilarang mengadakan pesta",
	},
	{
		icon: <Cigarette className="w-4 h-4" />,
		rule: "Merokok hanya di area outdoor",
	},
	{
		icon: <PawPrint className="w-4 h-4" />,
		rule: "Tidak diperbolehkan hewan peliharaan",
	},
	{
		icon: <Volume2 className="w-4 h-4" />,
		rule: "Harap tenang setelah pukul 22:00",
	},
];

export default function BookingProcess() {
	const containerRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const rulesRef = useRef<HTMLDivElement>(null);
	const paymentRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const commonProps = {
				y: 30,
				opacity: 0,
				duration: 0.6,
				ease: "power2.out",
			};

			if (headerRef.current) {
				gsap.from(headerRef.current, {
					...commonProps,
					scrollTrigger: {
						trigger: headerRef.current,
						start: "top 80%",
						once: true,
					},
				});
			}

			if (gridRef.current) {
				const items = gridRef.current.querySelectorAll(".step-item");
				gsap.from(items, {
					...commonProps,
					stagger: 0.1,
					scrollTrigger: {
						trigger: gridRef.current,
						start: "top 80%",
						once: true,
					},
				});
			}

			if (rulesRef.current) {
				gsap.from(rulesRef.current, {
					...commonProps,
					scrollTrigger: {
						trigger: rulesRef.current,
						start: "top 85%",
						once: true,
					},
				});
			}

			if (paymentRef.current) {
				gsap.from(paymentRef.current, {
					...commonProps,
					delay: 0.1,
					scrollTrigger: {
						trigger: paymentRef.current,
						start: "top 85%",
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
			className="py-[120px] px-4 scroll-mt-16"
			id="booking"
		>
			<div className="max-w-[1200px] mx-auto">
				<div ref={headerRef} className="mb-16">
					<span className="inline-block text-xs uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[#E8C4A0] text-[#1E1E1F] bg-[#E8C4A0]/20 mb-4">
						Cara Booking
					</span>
					<h2
						className="text-4xl md:text-5xl tracking-[-0.03em] font-normal"
						style={{ fontFamily: "var(--font-geist-sans)" }}
					>
						Proses Pemesanan Mudah
					</h2>
				</div>

				{/* Booking steps */}
				<div
					ref={gridRef}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
				>
					{bookingSteps.map((step, index) => (
						<div
							key={step.step}
							className="step-item relative text-center space-y-4"
						>
							<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#122023] text-white">
								{step.icon}
							</div>
							<div>
								<p className="text-xs text-[#6B6B6B] mb-1">
									Langkah {step.step}
								</p>
								<h3 className="text-sm font-medium text-[#1E1E1F]">
									{step.title}
								</h3>
								<p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
									{step.description}
								</p>
							</div>
							{/* Connector line */}
							{index < bookingSteps.length - 1 && (
								<div className="hidden md:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-[#DADADA]" />
							)}
						</div>
					))}
				</div>

				<div className="border-t border-[#DADADA] pt-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						{/* House Rules */}
						<div ref={rulesRef} className="space-y-6">
							<h3
								className="text-2xl font-normal tracking-[-0.02em] text-[#1E1E1F]"
								style={{ fontFamily: "var(--font-geist-sans)" }}
							>
								Peraturan Rumah
							</h3>
							<div className="space-y-3">
								{houseRules.map((rule) => (
									<div
										key={rule.rule}
										className="flex items-center gap-3 py-3 border-b border-[#DADADA] last:border-b-0"
									>
										<span className="text-[#1E1E1F]">{rule.icon}</span>
										<span className="text-sm text-[#6B6B6B]">{rule.rule}</span>
									</div>
								))}
							</div>
						</div>

						{/* Payment Method */}
						<div ref={paymentRef} className="space-y-6">
							<h3
								className="text-2xl font-normal tracking-[-0.02em] text-[#1E1E1F]"
								style={{ fontFamily: "var(--font-geist-sans)" }}
							>
								Metode Pembayaran
							</h3>
							<div className="bg-[#F5F5F5] rounded-2xl p-8 space-y-4">
								<div className="flex items-center gap-4">
									<Landmark className="w-8 h-8 text-[#1E1E1F]" />
									<div>
										<p className="text-sm font-medium text-[#1E1E1F]">
											Transfer Bank
										</p>
										<p className="text-xs text-[#6B6B6B]">BCA / Mandiri</p>
									</div>
								</div>
								<p className="text-sm text-[#6B6B6B] leading-relaxed">
									Detail rekening akan diberikan setelah konfirmasi ketersediaan
									melalui WhatsApp. Pembayaran DP diperlukan untuk mengamankan
									tanggal booking.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
