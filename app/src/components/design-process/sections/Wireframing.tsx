import { useState } from "react";
import { Section, PhaseHeading, Mono } from "../primitives";
import { cn } from "@/lib/utils";

type StepKey = "01" | "02" | "03" | "04";

const STEPS: {
  k: StepKey;
  t: string;
  d: string;
  highlights: number[];
  showAnnotation?: boolean;
  showArrow?: boolean;
}[] = [
  {
    k: "01",
    t: "Start with questions",
    d: "Before any box gets drawn, I run AI Q&A loops on the brief — probing the goal, the user, the constraints — until the problem is clear.",
    highlights: [2],
    showAnnotation: true,
  },
  {
    k: "02",
    t: "Test against references",
    d: "I pull the brief up against real visual references and ask: does this layout solve the same problem? What does it get right that I haven't thought of yet?",
    highlights: [0, 1],
  },
  {
    k: "03",
    t: "Drill until it's concrete",
    d: "I keep going until the architecture has no loose ends. Every section has a reason. Every decision can be explained.",
    highlights: [0, 1, 2, 3, 4, 5],
  },
  {
    k: "04",
    t: "Then draw the boxes",
    d: "Only now does the wireframe appear — annotated blocks that carry the decisions made in research, not placeholders waiting to be filled.",
    highlights: [3, 4, 5],
    showArrow: true,
  },
];

const BLOCKS = [
  { x: 6, y: 8, w: 60, h: 14, label: "header / nav" },
  { x: 70, y: 8, w: 24, h: 14, label: "cta" },
  { x: 6, y: 26, w: 88, h: 36, label: "hero — typographic" },
  { x: 6, y: 66, w: 28, h: 26, label: "support" },
  { x: 36, y: 66, w: 28, h: 26, label: "support" },
  { x: 66, y: 66, w: 28, h: 26, label: "proof" },
];

export function Wireframing() {
  const [active, setActive] = useState<StepKey>("01");
  const current = STEPS.find((s) => s.k === active)!;
  const highlights = new Set(current.highlights);

  return (
    <Section id="wireframing" className="min-h-screen" tint="red">
      <PhaseHeading
        index="05"
        kicker="Research-led wireframing"
        title="Collage becomes blueprint."
        intro="My wireframing starts with research, not box-drawing. I run deep AI Q&A loops, test the brief against visual references, and drill until the architecture is concrete."
      />

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        Now showing: {current.t}. {current.d}
      </div>

      {/* Side-by-side: canvas left, 2×2 grid right */}
      <div className="mt-14 grid lg:grid-cols-2 gap-10 items-start">
        {/* Blueprint canvas — smaller, soft-lifted */}
        <div
          className="relative aspect-[4/3] border dp-rule overflow-hidden rounded-md transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{
            background: "linear-gradient(180deg, var(--dp-paper) 0%, var(--dp-paper-2) 100%)",
            boxShadow: "0 24px 60px -48px oklch(0.18 0.015 60 / 0.45)",
          }}
        >
          <div className="dp-grid-bg absolute inset-0 opacity-100" aria-hidden />
          {BLOCKS.map((b, i) => {
            const isHot = highlights.has(i);
            return (
              <div
                key={i}
                aria-hidden
                className="absolute border rounded-[3px] transition-all duration-300 ease-out motion-reduce:transition-none"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.w}%`,
                  height: `${b.h}%`,
                  background: "var(--dp-paper)",
                  opacity: isHot ? 1 : 0.45,
                  borderColor: isHot ? "var(--dp-clay)" : "var(--dp-rule)",
                  boxShadow: isHot ? "0 18px 40px -32px oklch(0.18 0.015 60 / 0.5)" : "none",
                  transform: isHot ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                <span
                  className="absolute top-1 left-1.5 dp-mono text-[0.55rem]"
                  style={{
                    color: isHot ? "var(--dp-clay)" : "var(--dp-ink-soft)",
                  }}
                >
                  {b.label}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-3 border"
                  style={{ borderColor: "var(--dp-rule-soft)", opacity: 0.7 }}
                />
              </div>
            );
          })}

          {/* annotation arrow — step 04 */}
          <svg
            aria-hidden
            className="absolute transition-opacity duration-300 ease-out motion-reduce:transition-none"
            style={{
              left: "55%",
              top: "32%",
              width: 120,
              height: 70,
              opacity: current.showArrow ? 1 : 0,
            }}
            viewBox="0 0 140 80"
          >
            <path
              d="M10 70 Q 60 10, 130 20"
              fill="none"
              stroke="var(--dp-clay)"
              strokeWidth="1.2"
            />
            <path
              d="M125 14 L132 22 L122 24"
              fill="none"
              stroke="var(--dp-clay)"
              strokeWidth="1.2"
            />
          </svg>

          {/* handwritten note — step 01 */}
          <span
            className="dp-handwritten absolute text-sm transition-opacity duration-300 ease-out motion-reduce:transition-none"
            style={{
              left: "5%",
              top: "62%",
              color: "var(--dp-clay)",
              opacity: current.showAnnotation ? 1 : 0,
            }}
          >
            real questions first
          </span>

          {/* canvas state caption */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2" aria-hidden>
            <span className="dp-tick" />
            <Mono>
              {current.k} · {current.t.toLowerCase()}
            </Mono>
          </div>
        </div>

        {/* 2×2 step grid */}
        <div className="w-full sm:aspect-[4/3]">
          <h3 id="wireframing-steps-heading" className="sr-only">
            Wireframing decision steps
          </h3>
          <div
            role="radiogroup"
            aria-labelledby="wireframing-steps-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:h-full"
          >
            {STEPS.map((s) => {
              const isActive = active === s.k;
              return (
                <button
                  key={s.k}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Step ${s.k}: ${s.t}. ${s.d} ${
                    isActive ? "Selected" : "Select to highlight on the canvas"
                  }`}
                  onClick={() => setActive(s.k)}
                  onFocus={() => setActive(s.k)}
                  onMouseEnter={() => setActive(s.k)}
                  className={cn(
                    "group min-h-[11rem] sm:min-h-0 text-left border dp-rule p-5 rounded-[10px] grid grid-cols-[auto_1fr] gap-4 items-start transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dp-clay)]",
                    isActive
                      ? "shadow-[0_14px_28px_-10px_color-mix(in_oklab,var(--dp-clay)_45%,transparent)] -translate-y-[1px]"
                      : "hover:shadow-[var(--dp-shadow-card)] hover:-translate-y-[1px]",
                  )}
                  style={{
                    background: isActive ? "var(--dp-paper)" : "var(--dp-paper-2)",
                    borderColor: isActive ? "var(--dp-clay)" : "var(--dp-rule)",
                  }}
                >
                  <div
                    className="dp-display text-3xl leading-none transition-colors duration-200 ease-out motion-reduce:transition-none"
                    style={{ color: isActive ? "var(--dp-clay)" : "var(--dp-ink-soft)" }}
                  >
                    {s.k}
                  </div>
                  <div>
                    <div className="dp-display text-lg" style={{ color: "var(--dp-ink)" }}>
                      {s.t}
                    </div>
                    <p
                      className="text-xs mt-1.5 leading-relaxed"
                      style={{ color: "var(--dp-ink-soft)" }}
                    >
                      {s.d}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center mt-3">
          <div className="flex items-center gap-2">
            <span className="dp-tick" />
            <Mono>research -&gt; architecture -&gt; wireframe</Mono>
          </div>
        </div>
      </div>
    </Section>
  );
}
