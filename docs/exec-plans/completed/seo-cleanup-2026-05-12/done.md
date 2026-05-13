# Done

- Added `app/public/robots.txt`, `app/public/sitemap.xml`, and `app/public/_headers`.
- Generated `og-default.png` in both `app/public/images/` and `public/images/`.
- Updated React site config and route Helmet tags for canonical URLs, social images, Twitter card data, and image alt text.
- Added fallback source metadata to `app/index.html` for non-JS/social crawlers, then removed those fallback tags on hydration to prevent duplicate canonicals/descriptions.
- Updated `public/index.html`, `about.html`, `contact.html`, `portfolio.html`, and `edumanage.html` with canonical and social metadata.
- Converted the About hero text containers into real H1s in React and static HTML.
- Added `public/_headers`, refreshed `public/sitemap.xml`, and tightened `public/robots.txt`.
