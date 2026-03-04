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

export default function FacilitiesSection() {
	const facilities = [
		{
			id: "1",
			icon: <WavesLadder className="w-6 h-6" />,
			text: "Kolam Renang Indoor",
		},
		{
			id: "2",
			icon: <Dumbbell className="w-6 h-6" />,
			text: "Gym Corner",
		},
		{
			id: "3",
			icon: <PlayCircle className="w-6 h-6" />,
			text: "Mini Indoor Playground",
		},
		{
			id: "4",
			icon: <Wind className="w-6 h-6" />,
			text: "AC dengan purifier berkualitas",
		},
		{
			id: "5",
			icon: <Bed className="w-6 h-6" />,
			text: "4 Kamar sejuk dengan twin bed/king size",
		},
		{
			id: "6",
			icon: <Bath className="w-6 h-6" />,
			text: "Handuk",
		},
		{
			id: "7",
			icon: <UtensilsCrossed className="w-6 h-6" />,
			text: "Dapur di lantai 1 dan 2",
		},
		{
			id: "8",
			icon: <UtensilsIcon className="w-6 h-6" />,
			text: "Ruang Makan Luas",
		},
		{
			id: "9",
			icon: <Car className="w-6 h-6" />,
			text: "Garasi Mobil",
		},
		{
			id: "10",
			icon: <Tv className="w-6 h-6" />,
			text: "Televisi di setiap lantai",
		},
		{
			id: "11",
			icon: <Cigarette className="w-6 h-6" />,
			text: "Area Merokok Outdoor",
		},
		{
			id: "12",
			icon: <Wifi className="w-6 h-6" />,
			text: "Wifi Cepat dan Stabil",
		},
		{
			id: "13",
			icon: <Building2 className="w-6 h-6" />,
			text: "Dekat dengan Fasilitas Umum",
		},
		{
			id: "14",
			icon: <MapPin className="w-6 h-6" />,
			text: "Dekat dengan berbagai tempat wisata",
		},
		{
			id: "15",
			icon: <Shield className="w-6 h-6" />,
			text: "Akses Aman",
		},
	];

	return (
		<section
			className="w-full py-12 md:py-16 lg:py-20 scroll-mt-16"
			id="fasilitas"
		>
			<div className="container px-4 md:px-6 m-auto">
				<h2 className="text-3xl font-medium text-center mb-12">Fasilitas</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-auto ">
					{facilities.map((facility, index) => (
						<div
							key={facility.id}
							className={`
                ${index < 5 ? "flex" : "hidden sm:flex"} 
                items-center gap-3 p-4
              `}
						>
							<div className="text-primary">{facility.icon}</div>
							<span className="text-sm text-muted-foreground">
								{facility.text}
							</span>
						</div>
					))}
				</div>
				<p className="text-sm text-muted-foreground text-center mt-8">
					{/* <span className="sm:hidden">
						Lihat 10 fasilitas lainnya di Trasmambang
					</span> */}
					<FacilitiesModal />
					{/* <span className="">Lihat 60 fasilitas lainnya di Trasmambang</span> */}
				</p>
			</div>
		</section>
	);
}
