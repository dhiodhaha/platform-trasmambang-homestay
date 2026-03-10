
Airbnb’s date picker is world-class because it uses visual continuity. It doesn’t treat dates as separate buttons; it treats a booking as a single "object" or "path."

Here is a breakdown of the specific frontend and UI behaviors that give Airbnb that "premium" feel:

1. The "Capsule" Geometry (The Selection Bridge)
This is the biggest thing missing from your current version. Airbnb does not just highlight individual squares.

The End-Caps: The Check-in and Check-out dates are perfect circles with a high-contrast background (usually solid black) and white text.

The "Bridge": The dates between the start and end have a light grey or beige background.

Connectivity: The "bridge" is a flush rectangle that connects the circles. It looks like a "pill" or "capsule."

Technical Detail: The left side of the start-date background is rounded, and the right side of the end-date background is rounded. The middle dates have 0px border-radius on the sides that touch other selected dates.

2. The "Ghost" Hover State
Airbnb’s calendar feels "alive" because it reacts before you even click.

The Preview Bridge: Once you have clicked the Start Date, moving your mouse over other dates creates a "Ghost Bridge." This is an even lighter grey highlight that shows you exactly what the range will look like if you click right now.

The Hover Circle: The specific date your mouse is currently over gets a light grey circle outline, signaling it is the "potential" end-cap.

3. Non-Selected Hover Behavior
When no dates are selected, hovering over a single date shows a subtle grey circle behind the number.

The transition is usually an instantaneous or very fast (0.1s) fade. It provides immediate feedback that the element is interactive.

4. Semantic Typography & Color
Today’s Date: Usually marked with a bold font or a small underline, but it stays low-contrast so it doesn't compete with the user's selection.

Unavailable Dates: These are not just greyed out; they often have a strikethrough or a very faint color (#B0B0B0) and the cursor changes to "not-allowed." This prevents user frustration before they even try to click.

Selected Text: When a date is selected (black circle), the font usually becomes Bold.

5. Layout & Spacing
The Grid: Airbnb uses a very specific "Square" grid where the width of the cell equals the height. This ensures the selection circles are never "ovals."

Padding: There is zero "gap" between the background colors of the selected range. If there is a gap between the grey boxes in your calendar, it breaks the "bridge" illusion.

6. The "Check-out" Tooltip logic
As mentioned before, when hovering over the second date, a small tooltip follows the mouse or appears above the date saying "Checkout day."

Smart Pricing: Often, as you hover over the second date, the "Total Price" in the bottom bar updates live before you even click. This creates a highly "informed" user experience.