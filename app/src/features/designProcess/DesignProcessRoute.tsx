import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import "./designProcess.css";

type AiTool = {
  key: string;
  label: string;
  logoSrc?: string;
};

function useIsMobile(query = "(max-width: 768px)") {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function AiLogoTile({ tool }: { tool: AiTool }) {
  const [missing, setMissing] = useState(false);

  return (
    <span className="dp-logo-tile" data-ai={tool.key}>
      <span className="sr-only">{tool.label}</span>
      {!missing && tool.logoSrc ? (
        <img
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          onError={() => setMissing(true)}
          src={tool.logoSrc}
        />
      ) : (
        <span aria-hidden="true" className="dp-logo-fallback">
          {tool.label}
        </span>
      )}
    </span>
  );
}

export function DesignProcessRoute() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const aiTools: AiTool[] = useMemo(
    () => [
      { key: "chatgpt", label: "ChatGPT" },
      { key: "claude", label: "Claude" },
      { key: "kimi", label: "Kimi" },
      { key: "zai", label: "Z AI" }
    ],
    []
  );

  const chatgpt = aiTools[0];
  const claude = aiTools[1];
  const kimi = aiTools[2];
  const zai = aiTools[3];

  const heroSrc = useMemo(() => {
    if (isMobile) {
      return theme === "dark"
        ? "/designProcess/DesignProcessMobileDark.svg"
        : "/designProcess/DesignProcessMobile.svg";
    }

    return theme === "dark"
      ? "/designProcess/DesignProcessDarkMode.svg"
      : "/designProcess/DesignProcess.svg";
  }, [isMobile, theme]);

  return (
    <div className="page-content page-content--design-process">
      <header className="dp-hero" aria-label="My Design Process hero">
        <h1 className="sr-only">My Design Process</h1>
        <img
          alt=""
          className="dp-hero-image"
          decoding="async"
          src={heroSrc}
        />
        <div aria-hidden="true" className="dp-hero-note">
          <span>MY</span>
          <span>DESIGN</span>
        </div>
      </header>

      <section className="dp-section dp-section--intro" aria-label="Intro">
        <div className="dp-container">
          <h2 className="dp-h2">My Design Process</h2>
          <p className="dp-lead">
            I start with clarity, build a visual direction, research until the
            architecture is concrete, then iterate fast with AI without giving
            up human judgment.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="dp-ai-title"
        className="dp-section dp-section--ai"
        id="ai-exploration"
      >
        <div className="dp-container dp-ai-grid">
          <div className="dp-ai-left">
            <h2 className="dp-ai-kicker" id="dp-ai-title">
              AI Exploration
            </h2>
            <p className="dp-ai-headline">
              <span className="dp-ai-line">
                I brainstorm with <AiLogoTile tool={chatgpt} />
              </span>
              <span className="dp-ai-line">
                then I let <AiLogoTile tool={claude} /> <AiLogoTile tool={kimi} />{" "}
                <AiLogoTile tool={zai} /> pressure-test the draft.
              </span>
              <span className="dp-ai-line">
                For complex builds, I merge the best critiques and loop until it’s clean.
              </span>
            </p>
          </div>

          <div className="dp-ai-right">
            <p className="dp-ai-body">
              Draft, critique, merge, repeat. A multi-model loop helps surface edge cases, contradictions, and weak
              assumptions early, before I commit to architecture or UI.
            </p>
            <p className="dp-ai-body">
              For simple tasks, I keep it tight: usually 2–3 tools max. AI accelerates exploration, but judgment stays
              human.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
