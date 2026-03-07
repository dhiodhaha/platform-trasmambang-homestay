'use client'

import React from 'react'
import { DayPicker, getDefaultClassNames, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'

type Props = {
  unavailableDates: Array<{ start: string; end: string }>
  minAdvanceDays: number
  onSelect: (range: DateRange | undefined) => void
  selected?: DateRange
  onDisabledClick?: (date: Date) => void
  activePopover?: 'checkIn' | 'checkOut' | null
}

export function AvailabilityCalendar({
  unavailableDates,
  minAdvanceDays,
  onSelect,
  selected: range,
  onDisabledClick,
  activePopover,
}: Props) {
  const defaultClassNames = getDefaultClassNames()

  const disabledDays: Array<{ from: Date; to: Date } | { before: Date }> = [
    // Past dates + minimum advance days
    {
      before: new Date(Date.now() + minAdvanceDays * 24 * 60 * 60 * 1000),
    },
    // Unavailable date ranges
    ...unavailableDates.map((d) => ({
      from: new Date(d.start),
      to: new Date(new Date(d.end).getTime() - 24 * 60 * 60 * 1000), // end is exclusive (checkout day)
    })),
  ]

  const rangeContainsDisabledDate = (from: Date, to: Date): boolean => {
    for (const d of unavailableDates) {
      const blockedStart = new Date(`${d.start}T00:00:00`)
      const blockedEnd = new Date(`${d.end}T00:00:00`)
      // Overlap check: blocked range [blockedStart, blockedEnd) overlaps [from, to]
      if (blockedStart < to && blockedEnd > from) return true
    }
    return false
  }

  const handleDayClick = (day: Date, modifiers: any) => {
    if (modifiers.disabled) {
      if (onDisabledClick) onDisabledClick(day)
      return
    }

    if (activePopover === 'checkIn') {
      // User is picking Check-in
      // Always reset check-out when picking a new check-in date
      onSelect({ from: day, to: undefined })
    } else if (activePopover === 'checkOut') {
      // User is picking Check-out
      if (!range?.from) {
        onSelect({ from: day, to: undefined })
      } else if (day <= range.from) {
        // Picked a date before from -> reset check-in
        onSelect({ from: day, to: undefined })
      } else {
        // Valid checkout
        if (rangeContainsDisabledDate(range.from, day)) {
          if (onDisabledClick) onDisabledClick(day)
        } else {
          onSelect({ from: range.from, to: day })
        }
      }
    } else {
      // Fallback
      onSelect({ from: day, to: undefined })
    }
  }

  return (
    <div className="flex justify-center w-full overflow-x-auto pb-4">
      <DayPicker
        mode="range"
        selected={range}
        onDayClick={handleDayClick}
        disabled={disabledDays}
        numberOfMonths={2}
        // className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-4 sm:p-6 sm:px-8 w-fit mx-auto"
        classNames={{
          today: `font-bold text-[#D8A77B] bg-black`, // Slightly darker brand color for today
          selected: `bg-[#E8C4A0] text-[#122023] font-semibold `, // Highlight the selected day
          chevron: `${defaultClassNames.chevron} fill-black`, // Change the color of the chevron
          range_start: `bg-[#E8C4A0] text-[#122023] rounded-l-full`,
          range_end: `bg-[#E8C4A0] text-[#122023] rounded-r-full`,
          range_middle: `bg-[#E8C4A0]/50 text-[#122023] rounded-none`,
          day_button: `${defaultClassNames.day_button} transition-colors hover:bg-black/5 disabled:opacity-10 disabled:line-through disabled:hover:bg-transparent disabled:cursor-not-allowed`,
        }}
      />
    </div>
  )
}
