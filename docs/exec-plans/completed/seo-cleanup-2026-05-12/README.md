# SEO Cleanup 2026-05-12

## Status

- State: Completed
- Owner: Codex
- Date: 2026-05-12

## Goal

Fix launch-blocking SEO issues across the currently live React build surface and the legacy/static `public/` surface.

## Scope

- React app shell and route metadata
- React public assets copied into `output/react-overhaul`
- Static `public/` HTML metadata, crawl controls, sitemap, and share image

## Notes

Live checks showed `https://my-website-9fg.pages.dev` served the React shell, while `https://leonmadara.dev` did not resolve. The current canonical base remains `https://my-website-9fg.pages.dev` until a custom domain is confirmed.
