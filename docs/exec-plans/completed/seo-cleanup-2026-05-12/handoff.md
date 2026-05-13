# Handoff

The current SEO source split is:

- React live build source: `app/index.html`, `app/src/siteConfig.ts`, route components under `app/src/features/`, and static files under `app/public/`.
- Legacy/static public source: `public/*.html`, `public/robots.txt`, `public/sitemap.xml`, `public/_headers`, `public/_redirects`.

Post-deploy live checks should confirm:

- `/robots.txt` returns text, not app HTML.
- `/sitemap.xml` returns XML, not app HTML.
- `/images/og-default.png` returns image/png.
- Social preview debuggers pick up the new image.
- Google Search Console has the current canonical property and submitted sitemap.
