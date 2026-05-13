import { Helmet } from "react-helmet-async";
import { siteConfig } from "../../siteConfig";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollProgress } from "@/components/design-process/ScrollProgress";
import { CollageAssembly } from "@/components/design-process/collage/CollageAssembly";
import { AICritique } from "@/components/design-process/sections/AICritique";
import { BranchGates } from "@/components/design-process/sections/BranchGates";
import { ClientClarity } from "@/components/design-process/sections/ClientClarity";
import { Manifesto } from "@/components/design-process/sections/Manifesto";
import { Orchestration } from "@/components/design-process/sections/Orchestration";
import { Philosophy } from "@/components/design-process/sections/Philosophy";
import { Refinement } from "@/components/design-process/sections/Refinement";
import { Typography } from "@/components/design-process/sections/Typography";
import { Wireframing } from "@/components/design-process/sections/Wireframing";
import "./designProcess.css";

const pageTitle = "Design Process - How I Turn Mess Into Direction";
const pageDescription =
  "A scroll-led narrative on turning ambiguity into a resolved product direction: research, critique, orchestration, and refinement.";
const pageUrl = `${siteConfig.baseUrl}/design-process`;

export function DesignProcessRoute() {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={siteConfig.defaultImage} />
        <meta property="og:image:alt" content={siteConfig.defaultImageAlt} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={siteConfig.defaultImage} />
        <meta name="twitter:image:alt" content={siteConfig.defaultImageAlt} />
      </Helmet>

      <main className="dp-root">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--dp-ink)] focus:px-4 focus:py-2 focus:text-[var(--dp-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--dp-clay)]"
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
    </>
  );
}
