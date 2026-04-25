# Contact Form — Backend Integration

## Problem

`ContactRoute.tsx → handleSubmit` (line 174) currently fakes a submission:

```ts
await new Promise((resolve) => window.setTimeout(resolve, 1600));
```

The form validates correctly and the UI shows a success state, but no data is ever sent anywhere. Messages are silently discarded.

## What needs to be wired up

Replace the fake delay with a real HTTP POST. The handler already has the validated `values` object:

```ts
{
  name: string;
  email: string;
  projectType: string;
  message: string;
}
```

## Recommended options (pick one)

### Option A — Resend (recommended)
- Sends email directly from a serverless function
- First-class support for Cloudflare Workers (where this site is deployed)
- Free tier: 100 emails/day, 3,000/month
- Docs: https://resend.com/docs/send-with-cloudflare-workers

Steps:
1. Create account at resend.com and verify your domain
2. Create a Cloudflare Worker (or Pages Function) at `functions/api/contact.ts`
3. Store `RESEND_API_KEY` as a Cloudflare secret
4. Replace the fake `setTimeout` with a `fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })`

### Option B — Formspree
- No backend needed — POST directly from the browser to Formspree's endpoint
- Free tier: 50 submissions/month
- Docs: https://formspree.io/

Steps:
1. Create a form at formspree.io and copy the form endpoint
2. Replace the fake delay with `fetch('https://formspree.io/f/<YOUR_ID>', { method: 'POST', ... })`

### Option C — EmailJS
- Client-side only, no server needed
- Free tier: 200 emails/month
- Works well if you want to avoid any backend setup

## Implementation location

```
app/src/features/contact/ContactRoute.tsx
  → handleSubmit (line 159)
  → replace lines 174–175 with real fetch call
```

If adding a Cloudflare Pages Function:
```
functions/
  api/
    contact.ts   ← new file
```

## Error handling

The existing `try/catch` block already handles failure correctly — it shows an error toast and does not mark the form as succeeded. No changes needed to the UI layer.
