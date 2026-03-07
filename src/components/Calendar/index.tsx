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
  numberOfMonths?: number
}

export function AvailabilityCalendar({
  unavailableDates,
  minAdvanceDays,
  onSelect,
  selected: range,
  onDisabledClick,
  activePopover,
  numberOfMonths = 2,
}: Props) {
  const defaultClassNames = getDefaultClassNames()

  const disabledDays: Array<{ from: Date; to: Date } | { before: Date } | { after: Date } | Date> =
    [
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

  // Airbnb behavior: When picking checkout, disable dates before check-in and dates after the first unavailable date
  // Only apply when checkout is not yet selected (still picking), not when range is complete (re-selection mode)
  if (activePopover === 'checkOut' && range?.from && !range?.to) {
    // Disable dates before check-in
    disabledDays.push({ before: range.from })

    // Find the first blocked date AFTER the check-in date
    let firstBlockedAfterCheckIn: Date | null = null
    const checkInTime = range.from.getTime()

    for (const d of unavailableDates) {
      const blockedStart = new Date(d.start)
      if (blockedStart.getTime() > checkInTime) {
        if (!firstBlockedAfterCheckIn || blockedStart < firstBlockedAfterCheckIn) {
          firstBlockedAfterCheckIn = blockedStart
        }
      }
    }

    // Disable dates after the first blocked date
    if (firstBlockedAfterCheckIn) {
      disabledDays.push({ after: firstBlockedAfterCheckIn })
    }
  }

  const rangeContainsDisabledDate = (from: Date, to: Date): boolean => {
    for (const d of unavailableDates) {
      const blockedStart = new Date(d.start)
      const blockedEnd = new Date(d.end)
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
      if (range?.from && day.getTime() === range.from.getTime() && !range?.to) {
        // Clicked the same check-in date again — clear selection
        onSelect(undefined)
      } else {
        // Always reset check-out when picking a new check-in date
        onSelect({ from: day, to: undefined })
      }
    } else if (activePopover === 'checkOut') {
      // User is picking Check-out
      if (!range?.from) {
        onSelect({ from: day, to: undefined })
      } else if (range?.to) {
        // Complete range exists — reset (Airbnb behavior)
        onSelect({ from: day, to: undefined })
      } else if (day.getTime() === range.from.getTime()) {
        // Clicked the same check-in date again — clear selection
        onSelect(undefined)
      } else if (day < range.from) {
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
        numberOfMonths={numberOfMonths}
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
