
Your calendar feels "off" because it is currently behaving more like a multi-select tool (where you pick several individual dates) rather than a range-selection tool.

Based on the video of your UI, here are the 5 specific things missing or incorrect compared to Airbnb’s behavior:

1. The "Third-Click" Reset (State Management)
The Problem: In your video, when you already have a range selected (e.g., April 5–11) and you click a new date, the previous dates sometimes stay highlighted or the logic gets "stuck."

Airbnb’s Way: As soon as a range is complete (Start + End), the very next click must act as a "Hard Reset." It should instantly wipe the old range and make the new click the only active Start Date.


1. Lack of "Bridge" Styling (Visual Connection)
The Problem: Your calendar uses the same orange circle for every clicked date. This makes it look like you are just picking a list of dates.

Airbnb’s Way: They use "End-caps" and a "Bridge."

Start/End Dates: Solid black circles.

Middle Dates: A very light grey/tan rectangular background that connects the two circles.

Fix: Use CSS to create a background "bar" that spans the dates between the Start and End. This visually communicates "this is one continuous stay."

3. Missing "Hover Preview" (The Ghost Range)
The Problem: Your calendar only updates when a user actually clicks. It feels "static."

Airbnb’s Way: Once a user clicks a Start Date, the calendar becomes reactive to the mouse move. As the user hovers over other dates, the calendar draws a "ghost" range (usually a very light highlight) from the Start Date to the hovered date.

Fix: Add an onMouseEnter listener to your date cells. If a startDate exists but an endDate does not, highlight the range between startDate and the hoveredDate.

4. Handling "Backward" Selections
The Problem: In your video, if you click a date and then click a date earlier than it, the logic seems confused.

Airbnb’s Way: If a user clicks a date that is before the currently selected Start Date, Airbnb automatically makes that new (earlier) date the new Start Date. It never allows the "Check-out" to be before the "Check-in."


1. Dynamic Tooltips
The Problem: The user doesn't have clear feedback on what their next click will do.

Airbnb’s Way: When the user is about to click the second date, a small tooltip appears saying "Checkout day." This confirms the system understands the user's intent.

Fix: Add a floating label or a fixed text instruction that changes from "Select check-in" to "Select check-out" based on whether the first date has been picked.

Summary of the "Airbnb Feel"
To make it feel professional, you need to move away from "clicking buttons" and move toward "defining a space."

The logic flow should be:

Click 1: Set Start Point.

Mouse Move: Preview the range (Light highlight).

Click 2: Lock the Range (Solid End-caps + Light Bridge).

Click 3: Delete everything and start a new Click 1.