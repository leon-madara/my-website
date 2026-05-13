import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { type LucideIcon } from "lucide-react";
import { Mono } from "./primitives";

export type FilterStep = {
  label: string;
  accent: string;
  titleColor: string;
  description: string;
  checks: { label: string; Icon: LucideIcon; iconColor: string }[];
  /** Fills the dot in the top-right corner to signal "selected/chosen" */
  selected?: boolean;
};

export function FilterGrid({
  steps,
  ariaLabel = "Filter steps",
  height = "30rem",
}: {
  steps: FilterStep[];
  ariaLabel?: string;
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const checkItemRefs = useRef<(HTMLDivElement | null)[][]>([[], [], [], []]);
  const activeRef    = useRef<number | null>(null);
  const collapseAnim = useRef<gsap.core.Timeline | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function getRestPos(i: number) {
    const el = containerRef.current;
    if (!el) return null;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    const gap = 12;
    const halfW = (W - gap) / 2;
    const halfH = (H - gap) / 2;
    return {
      x: (i % 2) * (halfW + gap),
      y: Math.floor(i / 2) * (halfH + gap),
      width: halfW,
      height: halfH,
    };
  }

  // Position cards on mount and on resize
  useEffect(() => {
    function setPositions() {
      if (activeRef.current !== null) return;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const pos = getRestPos(i);
        if (pos) gsap.set(card, pos);
      });
    }
    setPositions();
    const ro = new ResizeObserver(setPositions);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Re-animate checklist line + items whenever a card becomes active
  useEffect(() => {
    if (activeIndex === null) return;
    const checks = checkItemRefs.current[activeIndex].filter(Boolean) as HTMLDivElement[];
    const line   = lineRefs.current[activeIndex];
    if (line) {
      gsap.set(line, { scaleY: 0 });
      gsap.to(line, { scaleY: 1, duration: 0.9, delay: 0.35, ease: "none", transformOrigin: "top" });
    }
    if (checks.length) {
      gsap.set(checks, { opacity: 0, x: -8 });
      gsap.to(checks, { opacity: 1, x: 0, stagger: 0.12, duration: 0.28, delay: 0.3, ease: "power2.out" });
    }
  }, [activeIndex]);

  function handleEnter(i: number) {
    if (!containerRef.current) return;
    collapseAnim.current?.kill();
    const W = containerRef.current.offsetWidth;
    const H = containerRef.current.offsetHeight;
    activeRef.current = i;
    setActiveIndex(i);

    cardRefs.current.forEach((card, j) => {
      if (!card) return;
      if (j === i) {
        gsap.set(card, { scale: 1, opacity: 1 });
        gsap.to(card, { x: 0, y: 0, width: W, height: H, duration: 0.38, ease: "power3.out", zIndex: 10 });
      } else {
        gsap.to(card, { opacity: 0, duration: 0.18, ease: "power2.in" });
      }
    });
  }

  function handleLeave() {
    const i = activeRef.current;
    if (i === null || !containerRef.current) return;
    const pos = getRestPos(i);
    if (!pos) return;

    activeRef.current = null;
    setActiveIndex(null);

    // Snap other cards back cleanly (they're opacity:0, snap is invisible)
    cardRefs.current.forEach((card, j) => {
      if (!card || j === i) return;
      const otherPos = getRestPos(j);
      if (otherPos) gsap.set(card, { ...otherPos, scale: 1, zIndex: 5 });
    });

    const card = cardRefs.current[i]!;
    collapseAnim.current = gsap.timeline();

    // Shape snaps back — no elastic overshoot on dimensions
    collapseAnim.current.to(card, {
      width: pos.width, height: pos.height,
      duration: 0.32, ease: "power3.out", zIndex: 5,
    }, 0);

    // Position gets the elastic bounce
    collapseAnim.current.to(card, {
      x: pos.x, y: pos.y,
      duration: 1.05, ease: "elastic.out(1, 0.4)",
    }, 0);

    // Scale ripple after settling
    collapseAnim.current.fromTo(card,
      { scale: 1.018 },
      { scale: 1, duration: 0.55, ease: "elastic.out(2.5, 0.35)" },
      0.26,
    );

    // Other cards fade back in
    collapseAnim.current.to(
      cardRefs.current.filter((_, j) => j !== i),
      { opacity: 1, duration: 0.35, ease: "power2.out" },
      0.08,
    );
  }

  const activeStep = activeIndex !== null ? steps[activeIndex] : null;

  return (
    <>
      {/* Screen-reader live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {activeStep ? `${activeStep.label}: ${activeStep.description}` : ""}
      </div>

      <div
        ref={containerRef}
        className="mt-12 relative overflow-hidden"
        style={{ height }}
        aria-label={ariaLabel}
      >
        {steps.map((step, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={step.label}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="dp-filter-card absolute border dp-rule rounded-[10px] overflow-hidden flex"
              tabIndex={0}
              role="button"
              aria-label={`${step.label}. ${step.description}`}
              aria-expanded={isActive}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onFocus={() => handleEnter(i)}
              onBlur={handleLeave}
            >
              {/* Accent radial wash */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(ellipse at 10% 110%, color-mix(in oklab, ${step.accent} 18%, transparent) 0%, transparent 60%)`,
                  opacity: isActive ? 1 : 0.7,
                }}
              />

              {/* Ghost number — scales up when active */}
              <div
                className="absolute bottom-0 left-4 dp-display leading-none pointer-events-none select-none transition-all duration-300"
                style={{
                  fontSize: isActive ? "14rem" : "7rem",
                  color: step.accent,
                  opacity: isActive ? 0.07 : 0.05,
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* ── Left column ── */}
              <div className="relative z-10 flex-[1.1] flex flex-col min-w-0 transition-all duration-300"
                style={{ padding: isActive ? "2rem 1.5rem 2rem 2rem" : "1.25rem 0.75rem 1.25rem 1.25rem" }}
              >
                {/* Top row: number + dot */}
                <div className="flex items-center justify-between flex-shrink-0">
                  <span
                    className="dp-mono transition-all duration-300"
                    style={{
                      fontSize: isActive ? "2.2rem" : "0.72rem",
                      letterSpacing: isActive ? "-0.02em" : "0.04em",
                      textTransform: "uppercase",
                      color: "var(--dp-muted)",
                      fontFamily: isActive ? "var(--dp-display)" : undefined,
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="block rounded-full flex-shrink-0 transition-all duration-300"
                    aria-hidden
                    style={{
                      width: isActive ? "9px" : "7px",
                      height: isActive ? "9px" : "7px",
                      background: step.selected ? step.accent : "transparent",
                      border: `1.5px solid ${step.accent}`,
                    }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="dp-display leading-[0.88] transition-all duration-300"
                  style={{
                    marginTop: isActive ? "1.5rem" : "0.75rem",
                    fontSize: isActive ? "clamp(2.4rem, 4vw, 3.8rem)" : "clamp(1.3rem, 2.2vw, 2rem)",
                    color: step.titleColor,
                  }}
                >
                  {step.label}
                </h3>

                {/* Description */}
                <p
                  className="leading-relaxed transition-all duration-300"
                  style={{
                    marginTop: isActive ? "1.25rem" : "0.6rem",
                    fontSize: isActive ? "0.95rem" : "0.72rem",
                    color: "var(--dp-ink-soft)",
                    // Remove line-clamp when active so full text shows
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: isActive ? "unset" : 3,
                    overflow: "hidden",
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Vertical divider */}
              <div
                className="relative z-10 w-px self-stretch flex-shrink-0 transition-all duration-300"
                style={{
                  background: "var(--dp-rule)",
                  marginTop: isActive ? "2rem" : "1.25rem",
                  marginBottom: isActive ? "2rem" : "1.25rem",
                }}
              />

              {/* ── Right column: checklist ── */}
              <div
                className="relative z-10 flex-1 flex flex-col justify-center min-w-0 transition-all duration-300"
                style={{ padding: isActive ? "2rem 2rem 2rem 2rem" : "1.25rem 1.25rem 1.25rem 1.5rem" }}
              >
                <div className="relative">
                  {/* Vertical line — animates in on hover */}
                  <div
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className="absolute left-[3px] w-px"
                    style={{
                      top: "10px",
                      bottom: "10px",
                      background: `linear-gradient(to bottom, ${step.accent}, transparent)`,
                      transformOrigin: "top",
                    }}
                  />
                  {step.checks.map((check, ci) => (
                    <div key={check.label}>
                      <div
                        ref={(el) => { checkItemRefs.current[i][ci] = el; }}
                        className="relative flex items-center pl-5"
                        style={{ gap: isActive ? "0.85rem" : "0.6rem" }}
                      >
                        <span
                          className="absolute left-0 block rounded-full z-10 flex-shrink-0 transition-all duration-300"
                          style={{
                            width: isActive ? "8px" : "7px",
                            height: isActive ? "8px" : "7px",
                            background: step.accent,
                          }}
                        />
                        <check.Icon
                          strokeWidth={1.5}
                          style={{
                            color: check.iconColor,
                            flexShrink: 0,
                            width: isActive ? "18px" : "14px",
                            height: isActive ? "18px" : "14px",
                            transition: "width 0.3s, height 0.3s",
                          }}
                        />
                        <span
                          className="dp-mono truncate transition-all duration-300"
                          style={{ fontSize: isActive ? "0.72rem" : "0.62rem" }}
                        >
                          {check.label}
                        </span>
                      </div>
                      {ci < step.checks.length - 1 && (
                        <div
                          className="h-px ml-5 transition-all duration-300"
                          style={{
                            background: "var(--dp-rule)",
                            marginTop: isActive ? "1.1rem" : "0.65rem",
                            marginBottom: isActive ? "1.1rem" : "0.65rem",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
