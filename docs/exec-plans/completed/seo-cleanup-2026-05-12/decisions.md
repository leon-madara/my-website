# Decisions

- Use `https://my-website-9fg.pages.dev` as the canonical base because the live Pages site resolves and `leonmadara.dev` did not resolve during this pass.
- Keep the React fallback metadata in `app/index.html` for crawlers that do not run JavaScript, but mark it as removable with `data-fallback-seo` so hydrated route pages have one clean canonical and one clean description.
- Keep generated/public build folders out of hand-edited SEO work. Use robots and headers to keep generated prototypes and test pages out of indexing.
- Canonicalize the EduManage standalone case study at `/edumanage`.
