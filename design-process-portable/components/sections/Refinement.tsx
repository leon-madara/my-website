import { Section, PhaseHeading, Mono } from "../primitives";
import { CONTACT } from "../../config/contact";

const REFINEMENTS = [
  "spacing tightened by 2px where the eye paused",
  "headline rewritten until it reads in one breath",
  "motion slowed — meaning over speed",
  "color narrowed — restraint over reach",
  "alt text written like the image is missing",
];

export function Refinement() {
  return (
    <Section id="refinement" className="pb-40" tint="charcoal">
      <PhaseHeading
        index="10"
        kicker="Integration & finish"
        title={
          <>
            Small details,
            <br />
            <span className="dp-handwritten" style={{ color: "var(--dp-clay)" }}>
              quietly
            </span>{" "}
            decided.
          </>
        }
        intro="The loop ends after distance and fresh eyes. The system is stable; the work is ready to leave the studio."
      />

      <div className="mt-14 grid lg:grid-cols-[1fr_1fr] gap-10">
        <ul className="grid gap-3">
          {REFINEMENTS.map((r, i) => (
            <li key={i} className="flex items-baseline gap-4 pb-3 border-b dp-rule">
              <span className="dp-mono text-[0.65rem]">{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "var(--dp-ink)" }}>{r}</span>
            </li>
          ))}
        </ul>

        <div
          className="relative p-8 md:p-10 border dp-rule rounded-[10px]"
          style={{
            background: "var(--dp-paper)",
            boxShadow: "var(--dp-shadow-card)",
          }}
        >
          <Mono>finish criteria</Mono>
          <p className="dp-display text-2xl md:text-3xl mt-3" style={{ color: "var(--dp-ink)" }}>
            Strategic, creative, measurable — and ready to defend against the brief.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 px-5 py-3 border dp-rule rounded-full transition-all hover:translate-y-[-1px]"
              style={{
                background: "var(--dp-ink)",
                color: "var(--dp-paper)",
                boxShadow:
                  "0 12px 24px -10px color-mix(in oklab, var(--dp-clay) 55%, transparent)",
              }}
            >
              <span className="dp-display text-base">Start a project</span>
              <span aria-hidden>→</span>
            </a>
            <span className="dp-handwritten text-base" style={{ color: "var(--dp-clay)" }}>
              direction, not decoration
            </span>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-10 border-t dp-rule flex items-center justify-between">
        <Mono>end of process · v.04</Mono>
        <Mono>fragments aligned</Mono>
      </div>
    </Section>
  );
}
