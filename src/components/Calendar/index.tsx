'use client'

import React, { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
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
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const isPickingCheckout = activePopover === 'checkOut' && range?.from && !range?.to
  const hoverPreviewEnd =
    isPickingCheckout && hoveredDate && range?.from && hoveredDate > range.from ? hoveredDate : null

  const disabledDays: Array<{ from: Date; to: Date } | { before: Date } | { after: Date } | Date> =
    [
      // Past dates + minimum advance days
      {
        before: new Date(Date.now() + minAdvanceDays * 24 * 60 * 60 * 1000),
      },
      // Unavailable date ranges
      ...(unavailableDates
        .map((d) => {
          const start = new Date(d.start)
          const end = new Date(new Date(d.end).getTime() - 86400000) // checkout day excluded

          // When picking checkout: allow the start date of future bookings as valid checkout
          // (guest checks out at 12:00, next guest checks in at 14:00 — no overlap)
          if (isPickingCheckout && range?.from && start > range.from) {
            const dayAfter = new Date(start.getTime() + 86400000)
            if (dayAfter > end) return null // single-night booking: no interior to disable
            return { from: dayAfter, to: end }
          }

          return { from: start, to: end }
        })
        .filter(Boolean) as Array<{ from: Date; to: Date }>),
    ]

  // Airbnb behavior: When picking checkout, disable dates before check-in and dates after the first unavailable date
  // Only apply when checkout is not yet selected (still picking), not when range is complete (re-selection mode)
  if (isPickingCheckout && range?.from) {
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

  // Build hover preview modifiers
  const hoverModifiers: Record<string, (date: Date) => boolean> = {}
  if (hoverPreviewEnd && range?.from) {
    const fromTime = range.from.getTime()
    const hoverTime = hoverPreviewEnd.getTime()
    hoverModifiers.hover_preview = (date: Date) => {
      const t = date.getTime()
      return t > fromTime && t < hoverTime
    }
    hoverModifiers.hover_end = (date: Date) => {
      return date.getTime() === hoverTime
    }
  }

  return (
    <div className="flex justify-center w-full overflow-x-auto pb-4">
      <DayPicker
        mode="range"
        selected={range}
        onDayClick={handleDayClick}
        onDayMouseEnter={(date) => setHoveredDate(date)}
        onDayMouseLeave={() => setHoveredDate(null)}
        disabled={disabledDays}
        numberOfMonths={numberOfMonths}
        modifiers={hoverModifiers}
        modifiersClassNames={{
          hover_preview: 'rdp-hover-preview',
          hover_end: 'rdp-hover-end',
        }}
      />
    </div>
  )
}
