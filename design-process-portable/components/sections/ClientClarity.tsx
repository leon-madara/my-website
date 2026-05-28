import { useState } from "react";
import { Section, PhaseHeading, Mono } from "../primitives";
import { cn } from "../../lib/utils";

const ARCHETYPES = [
  {
    id: "firm",
    title: "Clear-direction client",
    axis: 12,
    response:
      "They arrive with examples and firm preferences. I protect what matters to them, then test strategic variants so the final route still performs.",
    signals: ["strong references", "named tone", "decided audience"],
  },
  {
    id: "visual",
    title: "Visual-reaction client",
    axis: 50,
    response:
      "They struggle with abstract questions but respond instantly to visuals. I show contrasting routes and use emotional reaction as the fastest alignment signal.",
    signals: ["loose words", "many references", "decides on sight"],
  },
  {
    id: "open",
    title: "Open-discovery client",
    axis: 86,
    response:
      "They know parts of what they want and clearly know what they do not want. I map the hard no's, narrow options quickly, and keep momentum without killing discovery.",
    signals: ["new category", "no precedent", "emotion-led"],
  },
] as const;

export function ClientClarity() {
  const [active, setActive] = useState<(typeof ARCHETYPES)[number]["id"]>("firm");
  const current = ARCHETYPES.find((a) => a.id === active)!;

  return (
    <Section id="client-clarity" tint="green">
      <PhaseHeading
        index="03"
        kicker="Decision archetypes"
        title="How the client decides shapes how I work."
        intro="Three working modes. Each one earns a different rhythm — and each one treats &lsquo;no&rsquo; as evidence."
      />

      <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div role="radiogroup" aria-labelledby="client-clarity-heading">
          <h3 id="client-clarity-heading" className="sr-only">
            Client decision archetypes
          </h3>
          {ARCHETYPES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={active === a.id}
              aria-label={`${a.title}: ${a.signals.join(", ")}. ${active === a.id ? "Selected" : "Select to view response"}`}
              onClick={() => setActive(a.id)}
              onFocus={() => setActive(a.id)}
              onMouseEnter={() => setActive(a.id)}
              className={cn(
                "group text-left border dp-rule p-5 rounded-[10px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dp-clay)] mb-3 last:mb-0 block w-full",
                active === a.id
                  ? "shadow-[0_16px_32px_-12px_color-mix(in_oklab,var(--dp-ink)_35%,transparent),inset_0_1px_0_oklch(1_0_0/0.55)] -translate-y-[1px]"
                  : "hover:shadow-[var(--dp-shadow-card)] hover:-translate-y-[1px]",
              )}
              style={{
                background: active === a.id ? "var(--dp-paper)" : "var(--dp-paper-2)",
              }}
            >
              <div className="flex items-baseline justify-between">
                <Mono>0{i + 1}</Mono>
                <Mono>{a.axis < 33 ? "firm" : a.axis < 66 ? "mixed" : "open"}</Mono>
              </div>
              <div
                className="dp-display text-xl md:text-2xl mt-2"
                style={{ color: "var(--dp-ink)" }}
              >
                {a.title}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.signals.map((s) => (
                  <span
                    key={s}
                    className="dp-mono text-[0.6rem] px-2 py-0.5 border dp-rule rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Selected archetype response"
          className="relative border dp-rule p-8 md:p-10 h-[25rem] flex flex-col justify-between overflow-hidden rounded-[10px]"
          style={{
            background: "var(--dp-paper)",
            boxShadow: "var(--dp-shadow-outer)",
          }}
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
              <Mono>How I respond</Mono>
              <Mono>{current.title}</Mono>
            </div>
            <p
              className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed"
              style={{ color: "var(--dp-ink)" }}
            >
              {current.response}
            </p>
          </div>

          <div className="mt-12">
            <div className="relative" style={{ height: "3.25rem" }}>
              <div
                className="absolute dp-mono text-[0.6rem] -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${current.axis}%`, top: 0, color: "var(--dp-clay)" }}
              >
                you are here
              </div>
              <div
                className="absolute left-0 right-0 h-px"
                style={{ top: "1.375rem", background: "var(--dp-rule)" }}
              >
                <div
                  className="absolute w-px"
                  style={{
                    left: `${current.axis}%`,
                    top: "-0.4rem",
                    height: "0.875rem",
                    background: "var(--dp-ink)",
                  }}
                />
              </div>
              <div
                className="absolute left-0 right-0 flex justify-between dp-mono text-[0.65rem]"
                style={{ bottom: 0 }}
              >
                <span>firm direction</span>
                <span>open discovery</span>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t dp-rule dp-handwritten text-lg"
            style={{ color: "var(--dp-clay)" }}
          >
            &ldquo;No&rdquo; is data.
          </div>
        </div>
      </div>
    </Section>
  );
}
