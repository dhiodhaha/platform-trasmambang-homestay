"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, Maximize2, X } from "lucide-react";
import { useState } from "react";

export default function LocationSection() {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<section
			className="w-full  m-auto text-center scroll-mt-16"
			aria-labelledby="location-title"
			id="lokasi"
		>
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="px-0">
					<CardTitle
						id="location-title"
						className="text-3xl font-medium text-foreground flex justify-center"
					>
						Di mana Anda akan menginap?
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Map Container */}
					<div className="flex items-center flex-col">
						<h3 className="font-medium text-foreground text-lg">
							Kecamatan Kasihan, Bantul, Yogyakarta
						</h3>
						<p className="text-muted-foreground text-lg leading-relaxed md:max-w-prose">
							Di daerah area pemukiman modern serta jauh dari keramaian yang
							memungkinkan Anda dapat menikmati masa inap Anda dengan aman dan
							nyaman.
						</p>
					</div>

					<div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
						<iframe
							title="Lokasi Trasmambang Homestay"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.531557121534!2d110.3078411250056!3d-7.839298792182006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af9003ebe2a13%3A0x26f56ec0de77f7d0!2sTrasmambang%20Comfy%20Homestay!5e0!3m2!1sen!2sid!4v1733897125659!5m2!1sen!2sid"
							className="absolute inset-0 w-full h-full border-0"
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</div>

					{/* Location Details */}
					<div>
						{/* Map Dialog */}
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost">
									Perbesar Peta
									<Maximize2 className="h-4 w-4" />
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] p-0">
								<DialogHeader className="absolute top-2 right-2 z-10">
									<DialogClose asChild>
										<Button
											type="button"
											variant="secondary"
											className="bg-background/80 backdrop-blur-sm hover:bg-background/90 size-12 px-12"
										>
											Tutup
										</Button>
									</DialogClose>
								</DialogHeader>
								<iframe
									title="Lokasi Trasmambang Homestay di Kasihan, Bantul, D.I. Yogyakarta"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.531557121534!2d110.3078411250056!3d-7.839298792182006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af9003ebe2a13%3A0x26f56ec0de77f7d0!2sTrasmambang%20Comfy%20Homestay!5e0!3m2!1sen!2sid!4v1733897125659!5m2!1sen!2sid"
									className="w-full h-full border-0"
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
