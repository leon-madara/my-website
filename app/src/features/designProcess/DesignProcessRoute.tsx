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

function AiLogoTile({ tool, compact = false }: { tool: AiTool; compact?: boolean }) {
  const [missing, setMissing] = useState(false);

  return (
    <span
      className={compact ? "dp-logo-tile dp-logo-tile--compact" : "dp-logo-tile"}
      data-ai={tool.key}
    >
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
      { key: "chatgpt", label: "ChatGPT", logoSrc: "/ai/chatgpt-logo.png" },
      { key: "claude", label: "Claude", logoSrc: "/ai/claude-logo.png" },
      { key: "kimi", label: "Kimi", logoSrc: "/ai/kimi-logo.svg" },
      { key: "zai", label: "Z AI", logoSrc: "/ai/zai-logo.svg" },
      { key: "google", label: "Google", logoSrc: "/ai/google-logo.svg" }
    ],
    []
  );

  const chatgpt = aiTools[0];
  const claude = aiTools[1];
  const kimi = aiTools[2];
  const zai = aiTools[3];
  const google = aiTools[4];

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
        aria-labelledby="dp-clarity-title"
        className="dp-section dp-section--clarity"
        id="client-clarity"
      >
        <div className="dp-container dp-ai-flow dp-flow-block">
          <p className="dp-ai-kicker">Client Clarity Layer</p>
          <h2 className="dp-ai-headline" id="dp-clarity-title">
            Before I design the interface, I decode how the client makes
            decisions.
          </h2>
          <div className="dp-ai-copy">
            <p className="dp-ai-body">
              Most projects feel complex only until this part is clear. Once I
              understand who is making the decision and how they react, the next
              design moves stop being guesswork and become a guided system.
            </p>
            <p className="dp-ai-body">
              <strong>Clear-direction clients:</strong> they arrive with examples
              and firm preferences. I protect what matters to them, then test
              strategic variants so the final route still performs.
            </p>
            <p className="dp-ai-body">
              <strong>Unclear-direction clients:</strong> they struggle with abstract
              questions but respond instantly to visuals. I show contrasting routes
              and use emotional reaction as the fastest alignment signal.
            </p>
            <p className="dp-ai-body">
              <strong>In-between clients:</strong> they know parts of what they want
              and clearly know what they do not want. I map the hard no's, narrow
              options quickly, and keep momentum without killing discovery.
            </p>
            <p className="dp-ai-body">
              My rule is simple: "no" is data. Rejection is not friction, it is
              direction.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="dp-sf-title"
        className="dp-section dp-section--sf"
        id="screenshot-frenzy"
      >
        <div className="dp-sf-stage">
          <div className="dp-sf-header dp-flow-block">
            <p className="dp-ai-kicker">Visual Direction Layer</p>
            <h2 className="dp-ai-headline" id="dp-sf-title">
              Screenshot Frenzy
            </h2>
            <p className="dp-ai-body">
              I collect references at speed, then sort them by emotion,
              implementation reality, and pattern fit. Only directions that pass
              all three filters move into wireframes.
            </p>
          </div>
          <div className="dp-sf-inner-container">
            <div className="dp-sf-bento" role="list" aria-label="Screenshot direction cards">
              <article className="dp-sf-card dp-sf-card--left-top" role="listitem">
                <div className="dp-sf-card-media">
                  <img
                    alt="Screenshot board showing mixed AI exploration references"
                    decoding="async"
                    loading="lazy"
                    src="/Screenshots/1.png"
                  />
                </div>
                <div className="dp-sf-card-copy">
                  <span className="dp-sf-chip">Emotion Bucket</span>
                  <h3 className="dp-sf-card-title">Find the tone before committing to layout.</h3>
                  <p className="dp-sf-card-text">
                    I track mood, texture, and energy first so the section feels right
                    before structure starts to lock in.
                  </p>
                </div>
              </article>

              <article className="dp-sf-card dp-sf-card--right-top" role="listitem">
                <div className="dp-sf-card-media">
                  <img
                    alt="Design process mural visual with typography-led framing"
                    decoding="async"
                    loading="lazy"
                    src="/Screenshots/2.png"
                  />
                </div>
                <div className="dp-sf-card-copy">
                  <span className="dp-sf-chip">Direction Signal</span>
                  <h3 className="dp-sf-card-title">Stress-test what should lead the story.</h3>
                  <p className="dp-sf-card-text">
                    This card checks if headline weight, flow, and hierarchy feel
                    inevitable on first glance.
                  </p>
                </div>
              </article>

              <article className="dp-sf-card dp-sf-card--left-bottom" role="listitem">
                <div className="dp-sf-card-header">
                  <img 
                    alt="Creative tools icon"
                    decoding="async" 
                    loading="lazy" 
                    className="dp-sf-icon"
                    src="/Screenshots/3.png" 
                  />
                  <span className="dp-sf-chip">Pattern Fit</span>
                </div>
                <div className="dp-sf-card-copy">
                  <h3 className="dp-sf-card-title">Borrow proven conversion rhythm, not just style.</h3>
                  <p className="dp-sf-card-text">
                    I keep references that teach pacing, offer clarity, and guide
                    attention where action should happen.
                  </p>
                </div>
              </article>

              <article className="dp-sf-card dp-sf-card--mid-bottom" role="listitem">
                <div className="dp-sf-card-header">
                  <span className="dp-sf-icon-placeholder">♫</span>
                </div>
                <div className="dp-sf-card-copy">
                  <span className="dp-sf-chip">Copy Pulse</span>
                  <h3 className="dp-sf-card-title">Does the message land in under five seconds?</h3>
                </div>
              </article>

              <article className="dp-sf-card dp-sf-card--right-bottom" role="listitem">
                <div className="dp-sf-card-header">
                  <span className="dp-sf-icon-placeholder">⚒</span>
                </div>
                <div className="dp-sf-card-copy">
                  <span className="dp-sf-chip">Merge Rule</span>
                  <h3 className="dp-sf-card-title">Only the strongest fragments graduate to wireframe.</h3>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="dp-ai-title"
        className="dp-section dp-section--ai"
        id="ai-exploration"
      >
        <div className="dp-container dp-ai-flow">
          <h2 className="dp-ai-kicker" id="dp-ai-title">
            AI Exploration
          </h2>
          <p className="dp-ai-headline">
            <span className="dp-ai-line">
              I start the first pass with <AiLogoTile tool={chatgpt} />
            </span>
            <span className="dp-ai-line">
              Then <AiLogoTile tool={claude} /> <AiLogoTile tool={kimi} />{" "}
              <AiLogoTile tool={zai} /> challenge the draft, expose weak logic, and
              sharpen the direction.
            </span>
            <span className="dp-ai-line">
              For complex builds, I iterate until every serious issue is resolved and
              the idea feels inevitable.
            </span>
          </p>
          <div className="dp-ai-copy">
            <p className="dp-ai-body">
              This loop is deliberate: draft, critique, merge, re-check. When different
              models flag the same risk, it stops being opinion and becomes a real
              requirement before I commit to architecture or UI.
            </p>
            <p className="dp-ai-body">
              I use that pressure to catch contradictions early, test edge cases, and
              strengthen both structure and story. In parallel, I explore visual
              pathways through screenshots, Pinterest, Dribbble, Magic UI, and{" "}
              <AiLogoTile compact tool={google} /> Labs, then reimagine the strongest
              directions into focused mockups.
            </p>
            <p className="dp-ai-body">
              For simple tasks, I keep it lean with 2-3 tools. AI expands the
              exploration surface, but final decisions still pass through human
              judgment, context, and taste. Speed matters, but trust and clarity come
              first.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


