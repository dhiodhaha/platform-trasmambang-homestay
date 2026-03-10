1. The "Two-Click" Selection Rule
The calendar operates on a binary selection state:

State 0 (Idle/Cleared): No dates are selected.

State 1 (Start-Date Set): The user clicks a date. That date is highlighted with a solid black circle. The system awaits a second input.

State 2 (Range Set): The user clicks a second date (later than the first). A light-grey background connects the two dates. A "Checkout day" tooltip appears on hover/click of the second date.

2. The "Auto-Reset" (The Third-Click) Behavior
The system avoids forcing the user to manually click "Clear dates" to change their mind.

Logic: If the system is in State 2 (Range Set), any subsequent click on any date acts as a Hard Reset.

Action: The previous range is instantly deleted, and the clicked date becomes the new "Check-in" (returning the system to State 1).

User Value: This allows for rapid trial-and-error without needing to find and click a "Clear" button between every selection.

3. Chronological "Reverse Logic" (Backward Selection)
The calendar prevents "impossible" ranges (where Check-out is before Check-in):

Scenario: User selects May 15th as the start date.

Action: If the user then clicks May 10th (a date before the start date), the system does not create a range.

Result: It performs an Auto-Reset, making May 10th the new start date.

4. Manual vs. Automatic Reset
Manual Reset ("Clear dates"): A text link that wipes all selections and returns the calendar to State 0. Use this if you want to see the calendar without any highlights.

Automatic Reset (Clicking a new date): Wipes the previous range but immediately starts a new selection. It is a "Replacement" action rather than a "Deletion" action.

5. UI Synchronization & Post-Selection Behavior
Save Button: The "Save" button remains active as long as a valid range (State 2) is present.

Dynamic Data Binding: Upon clicking "Save", the modal closes, and the parent "Confirm and pay" page must update the following in real-time without a page refresh:

Date Range Text: (e.g., "May 3 – 9" changes to "May 30 – Jun 3").

Night Count: (e.g., "6 nights" changes to "4 nights").

Line-Item Pricing: The "Price per night x nights" calculation updates.

Total Price: The final "Total IDR" value updates based on the new night count.

6. Visual Indicators (UX Cues)
Check-out Tooltip: A small floating label appears above the second date to confirm the user is selecting a departure day.

Hover Range: When a Start Date is selected, hovering over a future date dynamically highlights the potential range in a very light grey to "preview" the selection.