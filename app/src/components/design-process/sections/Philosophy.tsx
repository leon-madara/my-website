import { Section, PhaseHeading, Mono } from "../primitives";

const ANCHORS = [
  {
    label: "Clarity",
    body: "Decisions before pixels. Understand the brief, the brand, the reader.",
    color: "var(--dp-green)",
  },
  {
    label: "Emotion",
    body: "Tone first. Type, color, and rhythm carry the feeling before any feature.",
    color: "var(--dp-clay)",
  },
  {
    label: "Function",
    body: "Architecture verifiable against the brief. Motion that explains, not decorates.",
    color: "var(--dp-slate)",
  },
];

export function Philosophy() {
  return (
    <Section id="philosophy" tint="green">
      <PhaseHeading
        index="02"
        kicker="The process lens"
        title={
          <>
            Visual instinct,
            <br />
            <span className="dp-handwritten" style={{ color: "var(--dp-clay)" }}>
              measurable
            </span>{" "}
            craft.
          </>
        }
        intro={
          <>
            I start with clarity, build a visual direction, research until the architecture is
            concrete, then iterate fast with AI — without giving up human judgment.
            <br />
            <br />I don't follow a rigid, generic pipeline. My process moves between research,
            visuals, layout, and code depending on what the project needs. The sequence changes, but
            the standards don't.
          </>
        }
      />

      <div className="mt-16 flex flex-col items-center md:flex-row md:justify-center">
        {ANCHORS.map((a, index) => (
          <div
            key={a.label}
            className={`relative flex aspect-square w-full max-w-[21rem] flex-col items-center justify-center rounded-full border dp-rule p-8 text-center md:w-[35%] md:max-w-none md:p-9 lg:p-10 ${
              index > 0 ? "-mt-10 md:-ml-12 md:mt-0 lg:-ml-16" : ""
            }`}
          >
            <span aria-hidden className="mb-6 block h-1 w-10" style={{ background: a.color }} />
            <Mono>0{index + 1}</Mono>
            <h3 className="dp-display text-3xl md:text-4xl mt-3" style={{ color: "var(--dp-ink)" }}>
              {a.label}
            </h3>
            <p
              className="mt-4 text-sm md:text-base leading-relaxed"
              style={{ color: "var(--dp-ink-soft)" }}
            >
              {a.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
