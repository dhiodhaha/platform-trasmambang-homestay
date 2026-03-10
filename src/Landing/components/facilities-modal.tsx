'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { facilities } from '@/lib/facilities-data'
import { cn } from '@/utilities/ui'

interface FacilityItemProps {
  id: string
  icon: React.ElementType
  label: string
  description?: string
}

interface FacilitySectionProps {
  id: string
  category: string
  items: FacilityItemProps[]
}

// Komponen untuk item fasilitas
function FacilityItem({ icon: Icon, label, description }: FacilityItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-black/5 last:border-0">
      <Icon className="h-6 w-6 mt-0.5 text-[#122023]" strokeWidth={1.5} />
      <div className="flex-1">
        <div className="text-base text-[#122023]">{label}</div>
        {description && <div className="text-sm text-[#6B6B6B] mt-1">{description}</div>}
      </div>
    </div>
  )
}

// Komponen untuk section fasilitas
function FacilitySection({ category, items, id }: FacilitySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#122023] mb-4">{category}</h3>
      <div className="flex flex-col">
        {items.map((item) => (
          <FacilityItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

// Komponen utama untuk modal fasilitas
export function FacilitiesModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full sm:w-auto px-6 h-14 text-base font-semibold border-black/80 rounded-xl',
            // Touch first, hover enhanced
            'active:scale-[0.98] transition-all duration-200',
            '@media(hover:hover):hover:bg-black/5',
          )}
        >
          Tampilkan 60+ fasilitas Trasmambang
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-black/5 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-semibold text-[#122023]">
            Fasilitas yang ditawarkan
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-6 py-2 bg-white min-h-[50vh]">
          <div className="space-y-10 py-6">
            {facilities.map((section) => (
              <FacilitySection key={section.id} {...section} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
