# Done

- Branch created: `codex/react-contact-rebuild`.
- Added staging route `/contact-rebuild` (later retired).
- Added layout tokens + container contract in React global styles.
- Implemented the rebuilt Contact route (sections + form validation + clipboard copy + toast + Nairobi clock).
- Added `validation/contact-screenshots.mjs`.
- Added RTL coverage for validation + success flow.
- Promoted the rebuild to `/contact` across all React branches.
- Deleted the legacy React contact implementation and renamed `contactRebuild` to `contact`.
- Added a contact-only shell override so the hero can render full-bleed behind the fixed header/footer chrome.
- Updated the contact hero viewport sizing and removed the mobile `88vh` cap so the first section stays full-screen across breakpoints.
