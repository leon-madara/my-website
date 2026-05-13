import {
  Globe, Type, Maximize,
  Layers, Sliders, Eye,
  Download, Layout, Columns,
  Clock, RefreshCw, CheckCircle,
} from "lucide-react";
import { Section, PhaseHeading, Mono } from "../primitives";
import { FilterGrid, type FilterStep } from "../FilterGrid";

const SPECIMENS = [
  { font: "Fraunces, serif", weight: 600, italic: false, note: "editorial — chosen" },
  { font: "Georgia, serif", weight: 700, italic: true, note: "too literary" },
  { font: "Inter, sans-serif", weight: 700, italic: false, note: "too neutral" },
  { font: "JetBrains Mono, monospace", weight: 500, italic: false, note: "too technical" },
];

const TYPOGRAPHY_STEPS: FilterStep[] = [
  {
    label: "Start With Real Words",
    accent: "var(--dp-green)",
    titleColor: "#006400",
    description: "Use the real headline or tagline so you can judge rhythm, spacing, and personality in context — not lorem ipsum.",
    checks: [
      { label: "Open 1001 Fonts",    Icon: Globe,    iconColor: "#006400" },
      { label: "Type the real copy", Icon: Type,     iconColor: "#A80000" },
      { label: "Test at real size",  Icon: Maximize, iconColor: "#1C1917" },
    ],
  },
  {
    label: "Explore Broadly",
    accent: "var(--dp-clay)",
    titleColor: "#A80000",
    description: "Adjust size, weight, and style. You're looking for tension between clarity and expression — not just a font that looks nice.",
    checks: [
      { label: "Compare 8–10 options",    Icon: Layers,  iconColor: "#A80000" },
      { label: "Adjust weight & style",   Icon: Sliders, iconColor: "#1C1917" },
      { label: "Note what stops you",     Icon: Eye,     iconColor: "#006400" },
    ],
  },
  {
    label: "Shortlist + Implement",
    accent: "var(--dp-amber)",
    titleColor: "#1C1917",
    description: "Implement each option inside the actual design. Side-by-side comparison in context beats any mood board.",
    checks: [
      { label: "Download top 3–5",      Icon: Download, iconColor: "#1C1917" },
      { label: "Implement in design",   Icon: Layout,   iconColor: "#006400" },
      { label: "Compare in context",    Icon: Columns,  iconColor: "#A80000" },
    ],
  },
  {
    label: "Step Back + Decide",
    accent: "var(--dp-green)",
    titleColor: "#006400",
    description: "A short break resets your eye. Come back and ask: does this font support the design's voice, or just feel new?",
    selected: true,
    checks: [
      { label: "Step away briefly",     Icon: Clock,       iconColor: "#006400" },
      { label: "Return with fresh eye", Icon: RefreshCw,   iconColor: "#1C1917" },
      { label: "Commit the winner",     Icon: CheckCircle, iconColor: "#A80000" },
    ],
  },
];

export function Typography() {
  return (
    <Section id="typography" tint="red">
      <PhaseHeading
        index="09"
        kicker="Hero-first build"
        title="Typography is the first decision."
        intro="Real words, tested in real layouts. Not lorem. The font that makes the headline sound like the brand wins."
      />

      {/* Align with the title column of PhaseHeading — same grid, spacer matches the number column */}
      <div className="mt-10 md:grid md:grid-cols-[auto_1fr] md:gap-12">
        {/* Invisible spacer — same width as the "09" + kicker column */}
        <div className="hidden md:block" aria-hidden>
          <div className="dp-display text-[7rem] leading-none invisible select-none">09</div>
        </div>

        {/* Content column */}
        <div className="min-w-0">
          <h3 className="dp-5173-headline dp-5173-typo-comic-title">
            HERO-FIRST BUILD &amp; TYPOGRAPHY
          </h3>
          <p className="dp-5173-body">
            Once the hero direction is clear, typography becomes a serious{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-underline">
              <span className="dp-5173-highlighter-text">creative process</span>
            </span>
            , not a quick font pick. If I already have the final{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-wash dp-5173-highlighter-red">
              <span className="dp-5173-highlighter-text">copy</span>
            </span>
            , or even if the words are still evolving, I take the actual text into{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-wash dp-5173-highlighter-taupe">
              <span className="dp-5173-highlighter-text">1001 Fonts</span>
            </span>
            , type it out, test different sizes, and evaluate how each option feels with the design.
          </p>
          <p className="dp-5173-body dp-5173-typo-intro">
            Sometimes the first one lands immediately. Other times I shortlist{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-wash dp-5173-highlighter-green">
              <span className="dp-5173-highlighter-text">8 to 10 fonts</span>
            </span>
            , download them, implement them one by one, compare them, step away, and come back with a{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-underline">
              <span className="dp-5173-highlighter-text">fresh eye</span>
            </span>
            . That back and forth matters because typography shapes the{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-wash dp-5173-highlighter-red">
              <span className="dp-5173-highlighter-text">emotion</span>
            </span>
            ,{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-underline">
              <span className="dp-5173-highlighter-text">theme</span>
            </span>
            , and{" "}
            <span className="dp-5173-highlighter dp-5173-highlighter-wash dp-5173-highlighter-taupe">
              <span className="dp-5173-highlighter-text">uniqueness</span>
            </span>{" "}
            of the whole design.
          </p>

          <FilterGrid
            steps={TYPOGRAPHY_STEPS}
            ariaLabel="Typography decision steps"
            height="30rem"
          />

          <p className="dp-5173-typo-note mt-10">
            <span className="dp-5173-highlighter dp-5173-highlighter-underline">
              <span className="dp-5173-highlighter-text">Typography matters</span>
            </span>{" "}
            because it communicates tone before a user reads the message. It is one of the fastest ways
            to create a design that feels emotionally precise and not like everyone else's.
          </p>
        </div>
      </div>

      <div
        className="mt-14 grid gap-6"
        role="radiogroup"
        aria-labelledby="typography-heading"
        style={{ gridTemplateColumns: "3rem 1fr 10rem" }}
      >
        <h3 id="typography-heading" className="sr-only">
          Typography specimens - Fraunces selected
        </h3>
        {SPECIMENS.map((s, i) => {
          const chosen = i === 0;
          return (
            <div
              key={i}
              role="radio"
              aria-checked={chosen}
              aria-label={`${s.font.split(",")[0]} font: ${s.note}. ${chosen ? "Selected for this project" : "Not selected"}`}
              tabIndex={0}
              className="col-span-3 grid items-center gap-6 px-6 py-6 border dp-rule"
              style={{
                gridTemplateColumns: "subgrid",
                background: chosen ? "var(--dp-paper)" : "var(--dp-paper-2)",
                boxShadow: chosen ? "8px 8px 0 0 var(--dp-clay)" : undefined,
              }}
            >
              <Mono>0{i + 1}</Mono>
              <div
                className="truncate"
                style={{
                  fontFamily: s.font,
                  fontWeight: s.weight,
                  fontStyle: s.italic ? "italic" : "normal",
                  fontSize: "clamp(1.6rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--dp-ink)",
                  opacity: chosen ? 1 : 0.5,
                }}
              >
                {chosen ? (
                  <>Mess into <span style={{ color: "var(--dp-clay)" }}>direction</span>.</>
                ) : (
                  <>Mess into direction.</>
                )}
              </div>
              <Mono style={{ color: chosen ? "var(--dp-clay)" : undefined, textAlign: "right" }}>
                {s.note}
              </Mono>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
