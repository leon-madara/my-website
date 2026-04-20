import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { siteConfig } from "../../siteConfig";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import "./designProcess.css";
import { PixelImage } from "./PixelImage";
import { Highlighter } from "./Highlighter";

/* ── Shared types ────────────────────────────── */

type AiTool = {
  key: string;
  label: string;
  logoSrc?: string;
};

type CommandItem = {
  id: string;
  label: string;
  command: string;
  accent: "black" | "red" | "green" | "white";
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

function useRevealOnView(selector: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (nodes.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.classList.add("is-revealed");
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [selector]);
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

function AnimatedCommandList({ items }: { items: CommandItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion || items.length <= 1) {
      setPreviousIndex(null);
      return;
    }

    let rotateTimer: number | undefined;
    let cleanupTimer: number | undefined;

    rotateTimer = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);
      cleanupTimer = window.setTimeout(() => {
        setPreviousIndex(null);
      }, 540);
    }, 2600);

    return () => {
      if (rotateTimer !== undefined) {
        window.clearTimeout(rotateTimer);
      }
      if (cleanupTimer !== undefined) {
        window.clearTimeout(cleanupTimer);
      }
    };
  }, [activeIndex, items.length, prefersReducedMotion]);

  const activeItem = items[activeIndex];
  const previousItem = previousIndex === null ? null : items[previousIndex];

  return (
    <div
      className="dp-command-stage"
      aria-atomic="true"
      aria-live="polite"
      role="status"
    >
      {previousItem ? (
        <article
          key={`${previousItem.id}-exit-${activeItem.id}`}
          className={`dp-command-item dp-command-stage-item dp-command-item--${previousItem.accent} is-exit`}
        >
          <div className="dp-command-item-topline">
            <span className="dp-command-badge">{previousItem.label}</span>
          </div>
          <code className="dp-command-item-code">{previousItem.command}</code>
        </article>
      ) : null}

      <article
        key={activeItem.id}
        className={`dp-command-item dp-command-stage-item dp-command-item--${activeItem.accent} ${
          previousItem ? "is-enter" : "is-current"
        }`}
      >
        <div className="dp-command-item-topline">
          <span className="dp-command-badge">{activeItem.label}</span>
        </div>
        <code className="dp-command-item-code">{activeItem.command}</code>
      </article>
    </div>
  );
}

/* ── Main route component ────────────────────── */

export function DesignProcessRoute() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  useRevealOnView(".dp-reveal");

  const heroBgSrc = useMemo(() => {
    if (isMobile) {
      return theme === "dark"
        ? "/designProcess/DesignProcessMobileDark.svg"
        : "/designProcess/DesignProcessMobile.svg";
    }
    return theme === "dark"
      ? "/designProcess/DesignProcessDarkMode.svg"
      : "/designProcess/DesignProcess2.svg";
  }, [isMobile, theme]);

  const commandItems = useMemo<CommandItem[]>(
    () => [
      {
        id: "cmd-entry",
        label: "Windows Entry",
        command: "branch-orchestrator.cmd --mode entry --json",
        accent: "black",
      },
      {
        id: "cmd-exit",
        label: "Windows Exit",
        command: "branch-orchestrator.cmd --mode exit --json",
        accent: "red",
      },
      {
        id: "sh-entry",
        label: "Shell Entry",
        command: "branch-orchestrator.sh --mode entry --json",
        accent: "green",
      },
      {
        id: "sh-exit",
        label: "Shell Exit",
        command: "branch-orchestrator.sh --mode exit --json",
        accent: "white",
      },
    ],
    []
  );

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
    <>
    <Helmet>
      <title>Design Process — Leon Madara</title>
      <meta name="description" content="How Leon Madara approaches product design: client clarity, visual direction, research-led wireframing, and AI-assisted execution." />
      <link rel="canonical" href={`${siteConfig.baseUrl}/design-process`} />
      <meta property="og:title" content="Design Process — Leon Madara" />
      <meta property="og:description" content="How Leon Madara approaches product design: client clarity, visual direction, research-led wireframing, and AI-assisted execution." />
      <meta property="og:url" content={`${siteConfig.baseUrl}/design-process`} />
    </Helmet>
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

          <div className="dp-gallery-container" role="list" aria-label="Screenshot direction cards">
              <article className="dp-gallery-card" role="listitem">
                <img src="/designProcess/bento/mood-board.png" alt="Mood board" loading="lazy" />
                <div className="dp-gallery-hover">
                  <span className="dp-gallery-chip">Emotion Bucket</span>
                  <h3>Find the tone.</h3>
                  <p>Mood, texture, and energy come first.</p>
                </div>
              </article>
              <article className="dp-gallery-card" role="listitem">
                <img src="/designProcess/bento/wireframe.png" alt="Wireframe" loading="lazy" />
                <div className="dp-gallery-hover">
                  <span className="dp-gallery-chip">Direction Signal</span>
                  <h3>Stress-test hierarchy.</h3>
                  <p>Headline weight must feel inevitable.</p>
                </div>
              </article>
              <article className="dp-gallery-card" role="listitem">
                <img src="/designProcess/bento/screenshots.png" alt="Screenshots" loading="lazy" />
                <div className="dp-gallery-hover">
                  <span className="dp-gallery-chip">Pattern Fit</span>
                  <h3>Borrow conversion rhythm.</h3>
                  <p>Don't reinvent structural conventions.</p>
                </div>
              </article>
              <article className="dp-gallery-card" role="listitem">
                <img src="/designProcess/bento/typography.png" alt="Typography" loading="lazy" />
                <div className="dp-gallery-hover">
                  <span className="dp-gallery-chip">Copy Pulse</span>
                  <h3>Readability is king.</h3>
                  <p>Land the message in under 5 seconds.</p>
                </div>
              </article>
              <article className="dp-gallery-card" role="listitem">
                <img src="/designProcess/bento/mood-board.png" alt="Mood board" loading="lazy" />
                <div className="dp-gallery-hover">
                  <span className="dp-gallery-chip">Merge Rule</span>
                  <h3>Graduate to wireframe.</h3>
                  <p>Only the strongest fragments survive.</p>
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

      {/* ─── 7. EXECUTION ARCHITECTURE LAYER ─── */}
      <section
        className="dp-section dp-section--orchestration"
        id="agent-orchestration"
        aria-labelledby="dp-orchestration-heading"
      >
        <div className="dp-container dp-orchestration-shell">
          <p className="dp-kicker">Execution Architecture Layer</p>
          <h2 className="dp-headline" id="dp-orchestration-heading">
            Once strategy is clear, I convert one complex brief into a
            dependency-driven agent pipeline.
          </h2>
          <div className="dp-ai-copy">
            <p className="dp-body">
              I do not run one giant prompt and hope it lands. I split the
              work into explicit chunks with input and output contracts, then
              route each chunk to the right specialist.
            </p>
            <p className="dp-body">
              Independent tracks run in parallel for speed. Dependent tracks
              wait for upstream outputs. Before promotion, a verifier agent
              audits the result against the original brief so quality is
              proven, not assumed.
            </p>
          </div>

          <div
            className="dp-orchestration-grid"
            role="list"
            aria-label="Agent orchestration roles"
          >
            <article className="dp-orch-card dp-reveal" role="listitem">
              <p className="dp-orch-chip">Main Agent</p>
              <h3 className="dp-orch-title">Orchestrator</h3>
              <p className="dp-orch-copy">
                Owns scope, defines contracts, tracks dependencies, and closes
                the integration loop.
              </p>
            </article>

            <article className="dp-orch-card dp-reveal" role="listitem">
              <p className="dp-orch-chip">Worker Agents</p>
              <h3 className="dp-orch-title">Specialized Execution</h3>
              <p className="dp-orch-copy">
                Execute bounded chunks only, with zero scope drift and no
                silent branch decisions.
              </p>
            </article>

            <article className="dp-orch-card dp-reveal" role="listitem">
              <p className="dp-orch-chip">Dependency Graph</p>
              <h3 className="dp-orch-title">Parallel + Sequential Control</h3>
              <p className="dp-orch-copy">
                Starts independent work together and blocks dependent nodes
                until required outputs are ready.
              </p>
            </article>

            <article className="dp-orch-card dp-reveal" role="listitem">
              <p className="dp-orch-chip">Verifier Agent</p>
              <h3 className="dp-orch-title">Final Quality Gate</h3>
              <p className="dp-orch-copy">
                Re-checks delivery against the original instructions to prevent
                rework cycles and reduce token waste.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 8. RELEASE SAFETY LAYER ─── */}
      <section
        className="dp-section dp-section--gates"
        id="branch-gates"
        aria-labelledby="dp-gates-heading"
      >
        <div className="dp-container dp-gates-shell">
          <p className="dp-kicker">Release Safety Layer</p>
          <h2 className="dp-headline" id="dp-gates-heading">
            Two branch gates keep execution clean: one before code, one before
            promotion.
          </h2>
          <div className="dp-ai-copy">
            <p className="dp-body">
              Entry gate resolves the correct working branch before any change.
              Exit gate validates promotion targets after integration, then
              requests explicit approval before push or merge.
            </p>
            <p className="dp-body">
              This keeps feature boundaries clean, blocks accidental sibling
              merges, and preserves reviewable history across complex
              multi-agent sessions.
            </p>
          </div>

          <div className="dp-gates-showcase">
            <div className="dp-gates-header-panel dp-reveal">
              <p className="dp-gates-header-label">Branch Safety System</p>
              <h3 className="dp-gates-header-title">
                Controlled branch flow for execution, validation, and release.
              </h3>
              <p className="dp-gates-header-copy">
                One panel defines the control model, two gates enforce it at the
                decision points, and one operations block exposes the command
                surface.
              </p>
            </div>

            <div
              className="dp-gates-grid"
              role="list"
              aria-label="Branch orchestration gate flow"
            >
              <article className="dp-gate-card dp-gate-card--entry dp-reveal" role="listitem">
                <div className="dp-gate-card-topline">
                  <p className="dp-orch-chip">Gate 01</p>
                  <span className="dp-gate-status">Pre-build</span>
                </div>
                <h3 className="dp-orch-title">Entry Gate</h3>
                <p className="dp-orch-copy">
                  Resolve the correct working branch before implementation
                  starts and block unsafe switching conditions.
                </p>
                <div className="dp-gate-checks" role="list" aria-label="Entry gate checks">
                  <span className="dp-gate-check" role="listitem">Scope matched</span>
                  <span className="dp-gate-check" role="listitem">Worktree checked</span>
                  <span className="dp-gate-check" role="listitem">Target confirmed</span>
                </div>
              </article>

              <div className="dp-gates-connector dp-reveal" aria-hidden="true">
                <span className="dp-gates-connector-arrow">↔</span>
              </div>

              <article className="dp-gate-card dp-gate-card--exit dp-reveal" role="listitem">
                <div className="dp-gate-card-topline">
                  <p className="dp-orch-chip">Gate 02</p>
                  <span className="dp-gate-status">Pre-release</span>
                </div>
                <h3 className="dp-orch-title">Exit Gate</h3>
                <p className="dp-orch-copy">
                  Re-check lineage, recommend the safest promotion path, and
                  require explicit approval before push or merge.
                </p>
                <div className="dp-gate-checks" role="list" aria-label="Exit gate checks">
                  <span className="dp-gate-check" role="listitem">Lineage reviewed</span>
                  <span className="dp-gate-check" role="listitem">Target scored</span>
                  <span className="dp-gate-check" role="listitem">Approval required</span>
                </div>
              </article>
            </div>

            <div
              className="dp-command-console dp-reveal"
              aria-label="Cross-platform branch gate commands"
            >
              <div className="dp-command-console-bar">
                <p className="dp-command-console-title">Operational Commands</p>
              </div>
              <AnimatedCommandList items={commandItems} />
            </div>
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
          <h2 className="dp-headline dp-typo-comic-title" id="dp-typo-heading">
            HERO-FIRST BUILD &amp; TYPOGRAPHY
          </h2>
          <p className="dp-body" style={{ maxWidth: "64ch" }}>
            Once the hero direction is clear, typography becomes a serious{" "}
            <Highlighter
              action="underline"
              color={theme === "dark" ? "#48cc86" : "#ff9800"}
              animationDuration={700}
              strokeWidth={2.2}
              padding={3}
              isView
            >
              creative process
            </Highlighter>
            , not a quick font pick. If I already have the final{" "}
            <Highlighter
              action="highlight"
              color={theme === "dark" ? "#d84f63" : "#c93a52"}
              animationDuration={620}
              padding={2}
              isView
            >
              copy
            </Highlighter>
            , or even if the words are
            still evolving, I take the actual text into{" "}
            <Highlighter
              action="highlight"
              color={theme === "dark" ? "#d9d3c8" : "#6a6258"}
              animationDuration={680}
              padding={2}
              isView
            >
              1001 Fonts
            </Highlighter>
            , type it out, test
            different sizes, and evaluate how each option feels with the design.
          </p>
          <p className="dp-body dp-typo-intro" style={{ maxWidth: "64ch" }}>
            Sometimes the first one lands immediately. Other times I shortlist{" "}
            <Highlighter
              action="highlight"
              color={theme === "dark" ? "#24b36e" : "#1f8e58"}
              animationDuration={650}
              padding={2}
              isView
            >
              8 to 10 fonts
            </Highlighter>
            , download them,
            implement them one by one, compare them, step away, and come back
            with a{" "}
            <Highlighter
              action="underline"
              color={theme === "dark" ? "#48cc86" : "#ff9800"}
              animationDuration={700}
              strokeWidth={2.1}
              padding={3}
              isView
            >
              fresh eye
            </Highlighter>
            . That back
            and forth matters because typography shapes the{" "}
            <Highlighter
              action="highlight"
              color={theme === "dark" ? "#dd576a" : "#cf4158"}
              animationDuration={620}
              padding={2}
              isView
            >
              emotion
            </Highlighter>
            ,{" "}
            <Highlighter
              action="underline"
              color={theme === "dark" ? "#48cc86" : "#ff9800"}
              animationDuration={700}
              strokeWidth={2.1}
              padding={3}
              isView
            >
              theme
            </Highlighter>
            , and{" "}
            <Highlighter
              action="highlight"
              color={theme === "dark" ? "#e2dbcf" : "#746b5f"}
              animationDuration={660}
              padding={2}
              isView
            >
              uniqueness
            </Highlighter>{" "}
            of the whole design.
          </p>

          <div className="dp-typo-grid">
            <div className="dp-typo-card">
              <span className="dp-typo-label">01. Start With Real Words</span>
              <h3 className="dp-typo-card-title">Test the actual phrase, not placeholder text.</h3>
              <p>
                I use the real headline, tagline, or copyright text so I can
                judge rhythm, spacing, and personality in a realistic context.
              </p>
            </div>
            <div className="dp-typo-card">
              <span className="dp-typo-label">02. Explore Broadly</span>
              <h3 className="dp-typo-card-title">Use 1001 Fonts to compare mood, scale, and fit.</h3>
              <p>
                I type the words I want, adjust the size, and compare options
                until I feel the right tension between clarity and expression.
              </p>
            </div>
            <div className="dp-typo-card">
              <span className="dp-typo-label">03. Shortlist + Implement</span>
              <h3 className="dp-typo-card-title">Download the strongest candidates and try them for real.</h3>
              <p>
                I usually keep several strong options ready, then implement and
                compare them inside the design until one clearly earns its place.
              </p>
            </div>
            <div className="dp-typo-card dp-typo-card--selected">
              <span className="dp-typo-label">04. Step Back + Decide</span>
              <h3 className="dp-typo-card-title">Typography has to feel right, not just look interesting.</h3>
              <p>
                A short break helps me come back fresh and judge whether the
                font really supports the design&apos;s voice or just feels new.
              </p>
            </div>
          </div>

          <p className="dp-typo-note">
            <Highlighter
              action="underline"
              color={theme === "dark" ? "#48cc86" : "#ff9800"}
              animationDuration={760}
              strokeWidth={2.2}
              padding={3}
              isView
            >
              Typography matters
            </Highlighter>{" "}
            because it
            communicates tone before a user reads the message. It is one of the
            fastest ways to create a design that feels emotionally precise and
            not like everyone else&apos;s.
          </p>
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
            <article className="dp-refine-card dp-refine-card--cohesion">
              <div className="dp-refine-visual dp-refine-visual--cohesion" aria-hidden="true">
                <div className="dp-refine-mini-card">
                  <span>Hero Tone</span>
                  <strong>Aligned</strong>
                </div>
                <div className="dp-refine-mini-card">
                  <span>Type Rhythm</span>
                  <strong>Balanced</strong>
                </div>
                <div className="dp-refine-mini-card">
                  <span>Spacing System</span>
                  <strong>Consistent</strong>
                </div>
              </div>
              <div className="dp-refine-content">
                <p className="dp-refine-label">System Alignment</p>
                <h4>Cohesion</h4>
                <p>
                  Every section connects back to the hero tone and the extracted
                  research. Typography, color, spacing, and motion are tuned
                  together until the experience reads like one system.
                </p>
              </div>
            </article>
            <article className="dp-refine-card dp-refine-card--motion">
              <div className="dp-refine-visual dp-refine-visual--motion" aria-hidden="true">
                <div className="dp-refine-notice is-active">
                  <span className="dp-refine-dot" />
                  <div>
                    <strong>Hover reveal</strong>
                    <span>Supports the message</span>
                  </div>
                </div>
                <div className="dp-refine-notice">
                  <span className="dp-refine-dot" />
                  <div>
                    <strong>Transition speed</strong>
                    <span>Calm, readable pacing</span>
                  </div>
                </div>
              </div>
              <div className="dp-refine-content">
                <p className="dp-refine-label">Interaction Logic</p>
                <h4>Motion Mentality</h4>
                <p>
                  Interactions must support meaning, never distract. Motion
                  reinforces communication, creates rhythm, and guides attention
                  without becoming visual noise.
                </p>
              </div>
            </article>
            <article className="dp-refine-card dp-refine-card--copy">
              <div className="dp-refine-visual dp-refine-visual--copy" aria-hidden="true">
                <div className="dp-refine-copy-sheet">
                  <span className="dp-refine-copy-kicker">Headline Pass</span>
                  <strong>Sharper words. Cleaner emphasis.</strong>
                </div>
                <div className="dp-refine-copy-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="dp-refine-content">
                <p className="dp-refine-label">Message Precision</p>
                <h4>Copy Quality</h4>
                <p>
                  Copy quality matters as much as visuals. I keep refining words
                  until the design and the message amplify each other instead of
                  competing for attention.
                </p>
              </div>
            </article>
            <article className="dp-refine-card dp-refine-card--compound">
              <div className="dp-refine-visual dp-refine-visual--compound" aria-hidden="true">
                <div className="dp-refine-pill-row">
                  <span>Hover</span>
                  <span>Spacing</span>
                  <span>Timing</span>
                </div>
                <div className="dp-refine-pill-row">
                  <span>Hierarchy</span>
                  <span>Contrast</span>
                  <span>States</span>
                </div>
              </div>
              <div className="dp-refine-content">
                <p className="dp-refine-label">Compound Effect</p>
                <h4>Detail Compound</h4>
                <p>
                  Small decisions accumulate. A good experience is rarely one big
                  trick. It is usually the result of many micro-refinements
                  working together until everything feels inevitable.
                </p>
              </div>
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
    </>
  );
}
