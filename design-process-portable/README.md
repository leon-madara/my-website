# Design Process Page — Portable React Components

Self-contained React component package for the "Design Process" page.
Copy this entire folder into your project and import.

## Quick Start

```tsx
// 1. Import the CSS in your app entry (e.g. main.tsx or layout)
import "./design-process-portable/styles.css";

// 2. Use the component
import { DesignProcessPage } from "./design-process-portable/DesignProcessPage";

function App() {
  return <DesignProcessPage />;
}
```

## Peer Dependencies

Your project needs these packages installed:

```bash
npm install react react-dom gsap @gsap/react lucide-react clsx tailwind-merge
```

## Folder Structure

```
design-process-portable/
├── DesignProcessPage.tsx    ← main entry component
├── styles.css               ← all CSS (import once)
├── README.md
├── config/
│   └── contact.ts           ← edit with your info
├── lib/
│   └── utils.ts             ← cn() helper
├── components/
│   ├── primitives.tsx        ← shared UI primitives
│   ├── ScrollProgress.tsx
│   ├── FilterGrid.tsx
│   ├── PixelImage.tsx
│   ├── ErrorBoundary.tsx
│   ├── sections/
│   │   ├── Manifesto.tsx
│   │   ├── Philosophy.tsx
│   │   ├── ClientClarity.tsx
│   │   ├── Wireframing.tsx
│   │   ├── AICritique.tsx
│   │   ├── Orchestration.tsx
│   │   ├── BranchGates.tsx
│   │   ├── Typography.tsx
│   │   └── Refinement.tsx
│   └── collage/
│       └── CollageAssembly.tsx
└── assets/
    ├── fonts/                ← custom typefaces
    ├── svg/                  ← hero background SVGs
    └── screenshot-references/ ← collage reference images
```

## Notes

- **Tailwind**: Components use Tailwind utility classes. Your host project needs Tailwind configured.
- **GSAP**: ScrollTrigger plugin is used for scroll animations. Make sure `gsap` is importable.
- **Contact info**: Edit `config/contact.ts` with your details.
- **No router dependency**: The page component is plain React — wire it into any router.
