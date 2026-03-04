'use client'

import React, { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'

type Props = {
  unavailableDates: Array<{ start: string; end: string }>
  minAdvanceDays: number
  onSelect: (range: DateRange | undefined) => void
  initialRange?: DateRange
}

export function AvailabilityCalendar({ unavailableDates, minAdvanceDays, onSelect, initialRange }: Props) {
  const [range, setRange] = useState<DateRange | undefined>(initialRange)

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

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onSelect(newRange)
  }

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={handleSelect}
      disabled={disabledDays}
      numberOfMonths={2}
      showOutsideDays
      className="rounded-md border p-4"
    />
  )
}
