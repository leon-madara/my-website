# Calendar / Scheduling Integration

## Problem

The "Schedule a Meeting" button in the contact form (`ContactRoute.tsx`, line 482) calls `handleCalendarClick`, which only shows a toast:

```ts
const handleCalendarClick = () => {
  showToast({ type: "success", message: "Scheduling link coming soon." });
};
```

No meeting can actually be booked. The button is visible to users.

## What needs to be wired up

Replace the toast with one of the approaches below. The button already exists in the UI — only the handler needs updating.

## Recommended options (pick one)

### Option A — Cal.com (recommended)
- Open-source, self-hostable or hosted
- Has a clean embed/popup option that works well without leaving the page
- Free for personal use
- Docs: https://cal.com/docs/core-features/embed

Steps:
1. Create an account and set up your availability at cal.com
2. Copy your booking link (e.g. `https://cal.com/your-username`)
3. Either:
   - **Simple link**: replace `handleCalendarClick` to open the link in a new tab
   - **Popup embed**: install `@calcom/embed-react` and open the popup on click

Simple approach (no install needed):
```ts
const handleCalendarClick = () => {
  window.open("https://cal.com/your-username", "_blank", "noopener,noreferrer");
};
```

### Option B — Calendly
- Most widely recognised scheduling tool
- Free for basic use (1 event type)
- Docs: https://help.calendly.com/hc/en-us/articles/360020052833

Steps:
1. Create account at calendly.com and set up your event types
2. Copy your scheduling link
3. Same as above — open the link in a new tab or use their embed widget

### Option C — Google Calendar Appointment Scheduling
- If you already use Google Workspace
- Free with any Google account
- Creates a shareable booking page directly in Google Calendar

## Implementation location

```
app/src/features/contact/ContactRoute.tsx
  → handleCalendarClick (line 155)
  → replace showToast call with window.open or embed trigger
```

## Notes

- Once the real link is added, also remove or update the `calendarText` paragraph ("Prefer to schedule a call instead?") to reflect the actual service being used
- Consider removing the toast entirely once the button opens a real page — the navigation is feedback enough
