"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { facilities } from "@/lib/facilities-data";

interface FacilityItemProps {
	id: string;
	icon: React.ElementType;
	label: string;
	description?: string;
}

interface FacilitySectionProps {
	id: string;
	category: string;
	items: FacilityItemProps[];
}

// Komponen untuk item fasilitas
function FacilityItem({ icon: Icon, label, description }: FacilityItemProps) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="h-5 w-5 text-muted-foreground" />
			<div>
				<div>{label}</div>
				{description && (
					<div className="text-sm text-muted-foreground">{description}</div>
				)}
			</div>
		</div>
	);
}

// Komponen untuk section fasilitas
function FacilitySection({ category, items, id }: FacilitySectionProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">{category}</h3>
			<div className="space-y-3">
				{items.map((item) => (
					<FacilityItem key={item.id} {...item} />
				))}
			</div>
		</div>
	);
}

// Komponen utama untuk modal fasilitas
export function FacilitiesModal() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="lg">
					Tampilkan 60 fasilitas lainnya di Trasmambang
				</Button>
			</SheetTrigger>
			<SheetContent
				side="top"
				className="lg:w-1/3 flex flex-col items-center m-auto"
			>
				<SheetHeader>
					<SheetTitle>Fasilitas yang ditawarkan</SheetTitle>
				</SheetHeader>
				<ScrollArea className="h-[calc(100vh-4vh)] flex items-center pb-12">
					<div className="space-y-6 py-6">
						{facilities.map((section) => (
							<FacilitySection key={section.id} {...section} />
						))}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
