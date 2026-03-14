# DeepWiki Bug Investigation Report

**Source:** [DeepWiki Conversation](https://deepwiki.com/search/gem-help-me-gw-kan-bikin-homes_8174c551-9077-45e6-93cd-4c784c7636ce)

## Overview

The conversation details an investigation into a calendar date selection bug for the `dhiodhaha/platform-trasmambang-homestay` platform. The homestay enforces strict check-in (14:00) and check-out (12:00) times. Because of this, it is perfectly valid for a new guest to check in on the exact same day that a previous guest checks out.

**The Bug:** The frontend Calendar component incorrectly prevents users from selecting a previous booking's check-out date as their new check-in date (or vice versa), even though the backend permits it.

---

## Root Cause Analysis

The investigation identified this as a **"2-Layer Bug"** isolated entirely within the frontend code.

### 1. Overly Aggressive Global Disabling (Bug 1)

In `src/components/Calendar/index.tsx`, the `disabledDays` logic calculates unavailable dates as follows:

```typescript
{
  from: new Date(d.start),
  to: new Date(new Date(d.end).getTime() - 24 * 60 * 60 * 1000)
}
```

**The Issue:** If a booking exists from Jan 27 to Jan 28, this logic marks Jan 27 as a globally disabled day. Consequently, the calendar prevents any user from clicking Jan 27 entirely, making it impossible to select it as a check-out date for a preceding booking (e.g., trying to book Jan 26 - Jan 27).

### 2. Conflict with "Airbnb-style" Logic (Bug 2)

The Calendar component includes specific logic intended to block out dates before check-in or after the first blocked date (to enforce continuous night selection). Because Jan 27 is already aggressively blacklisted by the global `disabledDays` array (from Bug 1), the intended check-in/check-out UI behavior never gets the chance to override and "allow" that specific date contextually.

### What is Working Correctly

- **Backend Collision Logic:** The logic in `src/hooks/booking/checkDateOverlap.ts` operates correctly. It uses strict inequalities to evaluate overlaps, correctly accommodating the 12:00/14:00 time handoff without throwing overlap errors.
- **Availability API:** `src/app/(frontend)/api/availability/route.ts` successfully returns the raw unavailable segments. The flaw occurs downstream when the frontend interprets this data into a flat array of disabled calendar days.

---

## Proposed Solution Strategy

The report indicates the necessity of shifting from a "day-based" mental model to a "night-based" mental model, aligning with platforms like Airbnb:

1. **Context-Aware Disabling:**
   - **When selecting Check-in:** The calendar should disable any dates that are currently occupied for the night.
   - **When selecting Check-out:** The calendar should **allow** the user to select a date that acts as someone else's check-in date, since the guests do not physically overlap in the room at night.
2. **UI Implementation Iterations:**
   - Disentangle the static `disabledDays` logic from the interactive date picking state (`activePopover`). If the user is currently picking a `to` (check-out) date, the calendar should explicitly strip the start dates of future bookings from its disabling rules.
   - Consider rendering visually "split" days on the calendar to represent half-booked/half-free dates.

## Verdict

The fix does not require backend changes. It requires refactoring the `disabledDays` property calculation inside `src/components/Calendar/index.tsx` so that date availability is evaluated dynamically based on whether the user is selecting a check-in or a check-out date.
