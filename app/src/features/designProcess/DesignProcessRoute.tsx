import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import "./designProcess.css";
import { PixelImage } from "./PixelImage";

/* ── Shared types ────────────────────────────── */

type AiTool = {
  key: string;
  label: string;
  logoSrc?: string;
};

/* ── Hooks ───────────────────────────────────── */

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

/* ── Sub-components ──────────────────────────── */

function AiLogoTile({
  tool,
  compact = false,
}: {
  tool: AiTool;
  compact?: boolean;
}) {
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

/* ── Main route component ────────────────────── */

export function DesignProcessRoute() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const heroBgSrc = useMemo(() => {
    if (isMobile) {
      return theme === "dark"
        ? "/designProcess/DesignProcessMobileDark.svg"
        : "/designProcess/DesignProcessMobile.svg";
    }
    return theme === "dark"
      ? "/designProcess/DesignProcessDarkMode.svg"
      : "/designProcess/DesignProcess.svg";
  }, [isMobile, theme]);

  const aiTools: AiTool[] = useMemo(
    () => [
      { key: "chatgpt", label: "ChatGPT", logoSrc: "/ai/chatgpt-logo.png" },
      { key: "claude", label: "Claude", logoSrc: "/ai/claude-logo.png" },
      { key: "kimi", label: "Kimi", logoSrc: "/ai/kimi-logo.svg" },
      { key: "zai", label: "Z AI", logoSrc: "/ai/zai-logo.svg" },
      { key: "google", label: "Google", logoSrc: "/ai/google-logo.svg" },
    ],
    []
  );

  const chatgpt = aiTools[0];
  const claude = aiTools[1];
  const kimi = aiTools[2];
  const zai = aiTools[3];
  const google = aiTools[4];

  return (
    <div className="page-content page-content--design-process">
      {/* ─── 1. HERO ─── */}
      <header className="dp-hero" aria-label="My Design Process hero">
        <PixelImage src={heroBgSrc} grid="8x8" />
        <div className="dp-hero-content">
          <div className="dp-hero-text">
            <h1 className="dp-hero-title">
              <span>My Design</span>
              <span>Process</span>
            </h1>
            <p className="dp-hero-subtitle">
              Adaptive. Emotional. Research-driven. Never&nbsp;rigid.
            </p>
          </div>
        </div>
      </header>

      {/* ─── 2. INTRO / PHILOSOPHY ─── */}
      <section className="dp-section dp-section--intro" aria-label="Intro">
        <div className="dp-container">
          <p className="dp-kicker">Philosophy</p>
          <h2 className="dp-headline">
            I start with clarity, build a visual direction, research until the
            architecture is concrete, then iterate fast with AI — without giving
            up human judgment.
          </h2>
          <p className="dp-body">
            I don't follow a rigid, generic pipeline. My process moves between
            research, visuals, layout, and code depending on what the project
            needs. The sequence changes, but the standards don't.
          </p>
          <div className="dp-pillars">
            <span className="dp-pillar">
              <span className="dp-pillar-dot dp-pillar-dot--clarity" />
              Clarity
            </span>
            <span className="dp-pillar">
              <span className="dp-pillar-dot dp-pillar-dot--emotion" />
              Emotion
            </span>
            <span className="dp-pillar">
              <span className="dp-pillar-dot dp-pillar-dot--function" />
              Function
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3. CLIENT CLARITY ─── */}
      <section
        className="dp-section dp-section--clarity"
        id="client-clarity"
        aria-labelledby="dp-clarity-heading"
      >
        <div className="dp-container dp-container--wide">
          <p className="dp-kicker">Client Clarity Layer</p>
          <h2 className="dp-headline" id="dp-clarity-heading">
            Before I design the interface, I decode how the client makes
            decisions.
          </h2>

          <div className="dp-clients">
            <article className="dp-client-card">
              <h4>Clear-Direction Clients</h4>
              <p>
                They arrive with examples and firm preferences. I protect what
                matters to them, then test strategic variants so the final route
                still performs.
              </p>
            </article>
            <article className="dp-client-card">
              <h4>Unclear-Direction Clients</h4>
              <p>
                They struggle with abstract questions but respond instantly to
                visuals. I show contrasting routes and use emotional reaction as
                the fastest alignment signal.
              </p>
            </article>
            <article className="dp-client-card">
              <h4>In-Between Clients</h4>
              <p>
                They know parts of what they want and clearly know what they do
                not want. I map the hard no's, narrow options quickly, and keep
                momentum without killing discovery.
              </p>
            </article>
          </div>

          <blockquote className="dp-client-rule">
            My rule is simple: "no" is data. Rejection is not friction — it is
            direction.
          </blockquote>
        </div>
      </section>

      {/* ─── 4. SCREENSHOT FRENZY ─── */}
      <section
        className="dp-section dp-section--frenzy"
        id="screenshot-frenzy"
        aria-labelledby="dp-frenzy-heading"
      >
        <div className="dp-container dp-container--wide">
          <p className="dp-kicker">Visual Direction Layer</p>
          <h2 className="dp-headline" id="dp-frenzy-heading">
            Screenshot Frenzy
          </h2>
          <p className="dp-body" style={{ maxWidth: "64ch" }}>
            I collect references at speed, then sort them by emotion,
            implementation reality, and pattern fit. Only directions that pass
            all three filters move into wireframes.
          </p>

          <div className="dp-bento" role="list" aria-label="Screenshot direction cards">
            <article className="dp-bento-card dp-bento-card--a" role="listitem">
              <img
                className="dp-bento-img"
                src="/designProcess/bento/mood-board.png"
                alt="Design mood board with color swatches and references"
                loading="lazy"
                decoding="async"
              />
              <div className="dp-bento-body">
                <span className="dp-bento-chip">Emotion Bucket</span>
                <h3>Find the tone before committing to layout.</h3>
                <p>
                  Mood, texture, and energy come first so the section feels
                  right before structure starts to lock in.
                </p>
              </div>
            </article>

            <article className="dp-bento-card dp-bento-card--b" role="listitem">
              <img
                className="dp-bento-img"
                src="/designProcess/bento/wireframe.png"
                alt="Clean wireframe sketch showing website layout"
                loading="lazy"
                decoding="async"
              />
              <div className="dp-bento-body">
                <span className="dp-bento-chip">Direction Signal</span>
                <h3>Stress-test what should lead the story.</h3>
                <p>
                  Headline weight, flow, and hierarchy must feel inevitable at
                  first glance.
                </p>
              </div>
            </article>

            <article className="dp-bento-card dp-bento-card--c" role="listitem">
              <img
                className="dp-bento-img"
                src="/designProcess/bento/screenshots.png"
                alt="Multiple reference designs and browser tabs"
                loading="lazy"
                decoding="async"
              />
              <div className="dp-bento-body">
                <span className="dp-bento-chip">Pattern Fit</span>
                <h3>Borrow proven conversion rhythm, not just style.</h3>
              </div>
            </article>

            <article className="dp-bento-card dp-bento-card--d" role="listitem">
              <img
                className="dp-bento-img"
                src="/designProcess/bento/typography.png"
                alt="Typography exploration on screen"
                loading="lazy"
                decoding="async"
              />
              <div className="dp-bento-body">
                <span className="dp-bento-chip">Copy Pulse</span>
                <h3>Does the message land in under five seconds?</h3>
              </div>
            </article>

            <article className="dp-bento-card dp-bento-card--e" role="listitem">
              <img
                className="dp-bento-img"
                src="/designProcess/bento/mood-board.png"
                alt="Curated mood references"
                loading="lazy"
                decoding="async"
              />
              <div className="dp-bento-body">
                <span className="dp-bento-chip">Merge Rule</span>
                <h3>Only the strongest fragments graduate to wireframe.</h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 5. RESEARCH-LED WIREFRAMING ─── */}
      <section
        className="dp-section dp-section--research"
        id="research-wireframing"
        aria-labelledby="dp-research-heading"
      >
        <div className="dp-container">
          <p className="dp-kicker">Foundation Layer</p>
          <h2 className="dp-headline" id="dp-research-heading">
            Research-Led Wireframing
          </h2>
          <p className="dp-body" style={{ color: "#a1a1aa" }}>
            My wireframing starts with research, not box-drawing. I run deep AI
            Q&A loops, drill until I get a robust research base, then convert
            findings into structured architecture.
          </p>

          <div className="dp-timeline">
            <div className="dp-tl-node">
              <div className="dp-tl-icon" aria-hidden="true">🔍</div>
              <div>
                <h4>Deep AI Q&A</h4>
                <p>
                  Probing for features, security challenges, and industry
                  standards I may have missed.
                </p>
              </div>
            </div>
            <div className="dp-tl-connector" aria-hidden="true" />
            <div className="dp-tl-node">
              <div className="dp-tl-icon" aria-hidden="true">📋</div>
              <div>
                <h4>Structured Extraction</h4>
                <p>
                  Converting abstract answers into concrete feature sets,
                  page breakdowns, and security requirements.
                </p>
              </div>
            </div>
            <div className="dp-tl-connector" aria-hidden="true" />
            <div className="dp-tl-node">
              <div className="dp-tl-icon" aria-hidden="true">🏗️</div>
              <div>
                <h4>Defensible Architecture</h4>
                <p>
                  A solid, research-backed foundation before drawing a single
                  wireframe box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. AI EXPLORATION LOOP ─── */}
      <section
        className="dp-section dp-section--ai"
        id="ai-exploration"
        aria-labelledby="dp-ai-heading"
      >
        <div className="dp-container dp-ai-flow">
          <p className="dp-kicker" id="dp-ai-heading">
            AI Exploration
          </p>
          <h2 className="dp-headline">
            <span className="dp-ai-line">
              I start the first pass with <AiLogoTile tool={chatgpt} />
            </span>
            <span className="dp-ai-line">
              Then <AiLogoTile tool={claude} /> <AiLogoTile tool={kimi} />{" "}
              <AiLogoTile tool={zai} /> challenge the draft, expose weak logic,
              and sharpen the direction.
            </span>
            <span className="dp-ai-line">
              For complex builds, I iterate until every serious issue is
              resolved and the idea feels inevitable.
            </span>
          </h2>
          <div className="dp-ai-copy">
            <p className="dp-body">
              This loop is deliberate: draft, critique, merge, re-check. When
              different models flag the same risk, it stops being opinion and
              becomes a real requirement.
            </p>
            <p className="dp-body">
              I explore visual pathways through screenshots, Pinterest,
              Dribbble, Magic UI, and{" "}
              <AiLogoTile compact tool={google} /> Labs, then
              reimagine the strongest directions into focused mockups.
            </p>
            <p className="dp-body">
              For simple tasks, I keep it lean with 2–3 tools. AI expands the
              exploration surface, but final decisions still pass through human
              judgment, context, and taste.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 7. HERO-FIRST BUILD + TYPOGRAPHY ─── */}
      <section
        className="dp-section dp-section--typography"
        id="typography"
        aria-labelledby="dp-typo-heading"
      >
        <div className="dp-container dp-container--wide">
          <p className="dp-kicker">Core Anchor</p>
          <h2 className="dp-headline" id="dp-typo-heading">
            Hero-First Build &amp; Typography
          </h2>
          <p className="dp-body" style={{ maxWidth: "64ch" }}>
            The hero section creates the strongest impression. Once that visual
            anchor is set, typography exploration becomes the next major
            creative pass — balancing distinct style with usability.
          </p>

          <div className="dp-typo-grid">
            <div className="dp-typo-card" style={{ fontFamily: "Georgia, serif" }}>
              <span className="dp-typo-label">Serif Elegance</span>
              <span className="dp-typo-specimen">Aa</span>
              <p>Classic, trustworthy execution.</p>
            </div>
            <div className="dp-typo-card" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="dp-typo-label">Clean Minimal</span>
              <span className="dp-typo-specimen">Aa</span>
              <p>Focused on function and clarity.</p>
            </div>
            <div
              className="dp-typo-card dp-typo-card--selected"
              style={{ fontFamily: "'Organical', Georgia, serif" }}
            >
              <span className="dp-typo-label">Expressive Display ✓</span>
              <span className="dp-typo-specimen">Aa</span>
              <p>Distinct, memorable, and alive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. INTEGRATION & REFINEMENT ─── */}
      <section
        className="dp-section dp-section--refinement"
        id="integration"
        aria-labelledby="dp-refine-heading"
      >
        <div className="dp-container dp-container--wide">
          <p className="dp-kicker">Detail Layer</p>
          <h2 className="dp-headline" id="dp-refine-heading">
            Integration &amp; Refinement
          </h2>
          <p className="dp-body" style={{ maxWidth: "64ch" }}>
            AI accelerates the experiments, but judgment stays purely human.
            Small details — micro-interactions, subtle hover reveals,
            keyword-triggered artifacts — compound into a cohesive outcome.
          </p>

          <div className="dp-refine-grid">
            <article className="dp-refine-card">
              <h4>Cohesion</h4>
              <p>
                Every section connects back to the hero tone and the extracted
                research. Typography, color, and spacing are tuned together.
              </p>
            </article>
            <article className="dp-refine-card">
              <h4>Motion Mentality</h4>
              <p>
                Interactions must support meaning, never distract. Motion
                reinforces communication, not decoration.
              </p>
            </article>
            <article className="dp-refine-card">
              <h4>Copy Quality</h4>
              <p>
                Copy quality matters as much as visuals. Design choices reinforce
                the message, not compete with it.
              </p>
            </article>
            <article className="dp-refine-card">
              <h4>Detail Compound</h4>
              <p>
                Small decisions accumulate. A good experience is the sum of many
                micro-refinements working in harmony.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 9. FINISH CRITERIA ─── */}
      <section
        className="dp-section dp-section--criteria"
        id="finish-criteria"
      >
        <div className="dp-container">
          <div className="dp-criteria-inner">
            <h2>Exit the Infinite Loop</h2>
            <p>
              To avoid endless polishing, I step away for 3–4 days. If the
              layout, the copy, and the emotion still feel right when I return
              with fresh eyes — it is finished. If something feels off, I know
              exactly where to refine.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10. CLOSING / CTA ─── */}
      <section className="dp-section dp-section--cta" id="closing">
        <div className="dp-container">
          <h2 className="dp-cta-headline">
            Strategic. Creative. Measurable.
          </h2>
          <p className="dp-cta-sub">Let's build something that works.</p>
          <Link className="dp-cta-btn" to="/contact">
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
