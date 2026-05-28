import { cn } from "../lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

export function Mono({ children, className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("dp-mono", className)} {...rest}>
      {children}
    </span>
  );
}

export function Chip({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <span className="dp-chip">
      {accent && (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
        />
      )}
      {children}
    </span>
  );
}

export function PhaseHeading({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className="relative grid gap-6 md:grid-cols-[auto_1fr] md:gap-12 items-start">
      <div className="flex md:flex-col items-baseline md:items-start gap-3">
        <div
          className="dp-display text-[5.5rem] md:text-[7rem] leading-none"
          style={{ color: "var(--dp-ink)" }}
        >
          {index}
        </div>
        <Mono>{kicker}</Mono>
      </div>
      <div className="max-w-2xl pt-2">
        <h2 className="dp-display text-3xl md:text-5xl" style={{ color: "var(--dp-ink)" }}>
          {title}
        </h2>
        {intro && (
          <p
            className="mt-5 text-base md:text-lg leading-relaxed"
            style={{ color: "var(--dp-ink-soft)" }}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

// Design-process sections use Section to align to the page column (max-w-6xl).
// Exceptions: Manifesto (hero with SVG) and CollageAssembly (full-viewport animation)
// use raw <section> by design.
export type SectionTint = "green" | "red" | "charcoal";

const TINT_BG: Record<SectionTint, string> = {
  green:    "var(--dp-paper-tint-green)",
  red:      "var(--dp-paper-tint-red)",
  charcoal: "var(--dp-paper-tint-charcoal)",
};

export function Section({
  id,
  children,
  className,
  tint,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  tint?: SectionTint;
}) {
  return (
    <section
      id={id}
      className={cn("relative px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t dp-rule", className)}
      style={tint ? { background: TINT_BG[tint] } : undefined}
    >
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-10 w-10 border dp-rule" style={{ background: color }} aria-hidden />
      <span className="dp-mono text-[0.6rem]">{label}</span>
    </div>
  );
}

export function CornerTicks() {
  return (
    <>
      {(
        [
          ["top-3 left-3", "border-t border-l"],
          ["top-3 right-3", "border-t border-r"],
          ["bottom-3 left-3", "border-b border-l"],
          ["bottom-3 right-3", "border-b border-r"],
        ] as const
      ).map(([pos, brd]) => (
        <span
          key={pos}
          aria-hidden
          className={cn("absolute h-3 w-3 dp-rule pointer-events-none", pos, brd)}
        />
      ))}
    </>
  );
}
