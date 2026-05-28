/**
 * Design Process Page — portable React component.
 *
 * Usage:
 *   import { DesignProcessPage } from "./design-process-portable/DesignProcessPage";
 *   // Render <DesignProcessPage /> in your router/layout.
 *
 * Requirements:
 *   - Import the stylesheet: import "./design-process-portable/styles.css";
 *   - Peer deps: react, gsap, gsap/ScrollTrigger, lucide-react, clsx, tailwind-merge
 */
import { Manifesto } from "./components/sections/Manifesto";
import { Philosophy } from "./components/sections/Philosophy";
import { ClientClarity } from "./components/sections/ClientClarity";
import { CollageAssembly } from "./components/collage/CollageAssembly";
import { Wireframing } from "./components/sections/Wireframing";
import { AICritique } from "./components/sections/AICritique";
import { Orchestration } from "./components/sections/Orchestration";
import { BranchGates } from "./components/sections/BranchGates";
import { Typography } from "./components/sections/Typography";
import { Refinement } from "./components/sections/Refinement";
import { ScrollProgress } from "./components/ScrollProgress";
import { ErrorBoundary } from "./components/ErrorBoundary";

export function DesignProcessPage() {
  return (
    <main className="dp-root">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--dp-ink)] focus:text-[var(--dp-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--dp-clay)]"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <div id="main-content">
        <Manifesto />
        <Philosophy />
        <ClientClarity />
        <ErrorBoundary>
          <CollageAssembly />
        </ErrorBoundary>
        <Wireframing />
        <AICritique />
        <Orchestration />
        <BranchGates />
        <Typography />
        <Refinement />
      </div>
    </main>
  );
}

export default DesignProcessPage;
