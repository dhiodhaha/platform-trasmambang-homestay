"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import * as React from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CTA() {
	const containerRef = React.useRef<HTMLDivElement>(null);

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

	const [formData, setFormData] = React.useState({
		nama: "",
		whatsapp: "",
		tanggal: "",
		malam: "",
		tamu: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const message = `Halo, saya dari website trasmambang.com%0A%0ASaya mau cek ketersediaan:%0ANama: ${formData.nama}%0AWhatsApp: ${formData.whatsapp}%0ATanggal Check-in: ${formData.tanggal}%0AJumlah Malam: ${formData.malam}%0AJumlah Tamu: ${formData.tamu}`;
		window.open(`https://wa.me/6285117082122?text=${message}`, "_blank");
	};

	return (
		<section className="w-full bg-[#122023] py-[120px] md:py-[160px] px-4">
			<div ref={containerRef} className="max-w-[1200px] mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
					{/* Form side */}
					<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
						<div>
							<h3
								className="text-2xl text-white font-normal tracking-[-0.02em] mb-2"
								style={{ fontFamily: "var(--font-geist-sans)" }}
							>
								Cek Ketersediaan
							</h3>
							<p className="text-sm text-white/50">
								Isi form singkat ini, kami akan membalas via WhatsApp
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="nama"
										className="block text-xs uppercase tracking-wide text-white/50 mb-2"
									>
										Nama
									</label>
									<input
										id="nama"
										type="text"
										required
										value={formData.nama}
										onChange={(e) =>
											setFormData({ ...formData, nama: e.target.value })
										}
										className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8C4A0]/50 transition-colors"
										placeholder="Nama lengkap"
									/>
								</div>
								<div>
									<label
										htmlFor="whatsapp"
										className="block text-xs uppercase tracking-wide text-white/50 mb-2"
									>
										WhatsApp
									</label>
									<input
										id="whatsapp"
										type="tel"
										required
										value={formData.whatsapp}
										onChange={(e) =>
											setFormData({ ...formData, whatsapp: e.target.value })
										}
										className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8C4A0]/50 transition-colors"
										placeholder="08xxxxxxxxxx"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="tanggal"
									className="block text-xs uppercase tracking-wide text-white/50 mb-2"
								>
									Tanggal Check-in
								</label>
								<input
									id="tanggal"
									type="date"
									required
									value={formData.tanggal}
									onChange={(e) =>
										setFormData({ ...formData, tanggal: e.target.value })
									}
									className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8C4A0]/50 transition-colors [color-scheme:dark]"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="malam"
										className="block text-xs uppercase tracking-wide text-white/50 mb-2"
									>
										Jumlah Malam
									</label>
									<input
										id="malam"
										type="number"
										required
										min="1"
										value={formData.malam}
										onChange={(e) =>
											setFormData({ ...formData, malam: e.target.value })
										}
										className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8C4A0]/50 transition-colors"
										placeholder="1"
									/>
								</div>
								<div>
									<label
										htmlFor="tamu"
										className="block text-xs uppercase tracking-wide text-white/50 mb-2"
									>
										Jumlah Tamu
									</label>
									<input
										id="tamu"
										type="number"
										required
										min="1"
										max="12"
										value={formData.tamu}
										onChange={(e) =>
											setFormData({ ...formData, tamu: e.target.value })
										}
										className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8C4A0]/50 transition-colors"
										placeholder="1-12"
									/>
								</div>
							</div>
							<button
								type="submit"
								className="w-full rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-[#ddb78f] transition-colors"
							>
								Cek Ketersediaan & Booking via WA
							</button>
						</form>
					</div>

					{/* Text side */}
					<div className="text-center md:text-left space-y-8">
						<h2
							className="text-4xl md:text-5xl tracking-[-0.03em] font-normal text-white"
							style={{ fontFamily: "var(--font-geist-sans)" }}
						>
							Rasakan Pengalaman
							<br />
							Menginap Seperti
							<br />
							di Rumah Sendiri
						</h2>
						<p className="text-lg md:text-xl text-white/60">
							Mulai dari Rp 1.699.000/malam · 1 unit penuh
						</p>
						<div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
							<Link
								href="https://wa.me/6285117082122?text=Halo%2C%20saya%20dari%20website%20trasmambang.com%0A%0ASaya%20mau%20tanya%20detail%20lainnya"
								target="_blank"
								className="inline-block rounded-full border border-white text-white text-sm font-medium uppercase tracking-wide px-8 py-4 hover:bg-white/10 transition-colors"
							>
								Tanya Detail Lainnya via WA
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
