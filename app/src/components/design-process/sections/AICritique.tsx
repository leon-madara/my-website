import { Section, PhaseHeading, Mono } from "../primitives";

type Row = {
  model: string;
  voice: string;
  state: "merged" | "sharpened" | "discarded" | "risk";
  note: string;
  accent: string;
};

const ROWS: Row[] = [
  {
    model: "Model A — first pass",
    voice: "drafts the direction",
    state: "sharpened",
    note: "Strong tone, weak hierarchy on mobile.",
    accent: "var(--dp-slate)",
  },
  {
    model: "Model B — challenger",
    voice: "exposes weak logic",
    state: "risk",
    note: "Flags: CTA stack hides on small screens.",
    accent: "var(--dp-red)",
  },
  {
    model: "Model C — synthesizer",
    voice: "merges critique",
    state: "merged",
    note: "Restructures hero, keeps original tone.",
    accent: "var(--dp-green)",
  },
  {
    model: "Model D — alt direction",
    voice: "proposes a swap",
    state: "discarded",
    note: "Off-brief. Saved for the next project.",
    accent: "var(--dp-muted)",
  },
];

const STATE_LABEL: Record<Row["state"], string> = {
  merged: "merged",
  sharpened: "sharpened",
  discarded: "discarded",
  risk: "risk found",
};

export function AICritique() {
  return (
    <Section id="ai-critique" tint="charcoal">
      <PhaseHeading
        index="06"
        kicker="Model critique loop"
        title="AI as a critique system, not a stylist."
        intro="One model drafts. Others challenge — exposing weak logic, missing edges, lazy patterns. Human judgment decides what survives the table."
      />

      <div
        className="mt-14 border dp-rule overflow-hidden rounded-[10px]"
        style={{
          background: "var(--dp-paper)",
          boxShadow: "var(--dp-shadow-outer)",
        }}
      >
        <div
          className="grid grid-cols-[1.4fr_1fr_auto_2fr] gap-4 px-5 py-3 border-b dp-rule"
          style={{ background: "var(--dp-paper-2)" }}
        >
          <Mono>voice</Mono>
          <Mono>role</Mono>
          <Mono>state</Mono>
          <Mono>signal</Mono>
        </div>
        {ROWS.map((r) => (
          <div
            key={r.model}
            className="grid grid-cols-[1.4fr_1fr_auto_2fr] gap-4 px-5 py-5 items-center border-b dp-rule last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ background: r.accent }}
              />
              <span className="dp-display text-lg" style={{ color: "var(--dp-ink)" }}>
                {r.model}
              </span>
            </div>
            <Mono>{r.voice}</Mono>
            <span
              className="dp-mono text-[0.65rem] px-2.5 py-0.5 border dp-rule rounded-full whitespace-nowrap"
              style={{ color: r.accent, borderColor: r.accent }}
            >
              {STATE_LABEL[r.state]}
            </span>
            <span style={{ color: "var(--dp-ink-soft)" }}>{r.note}</span>
          </div>
        ))}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "var(--dp-paper-2)" }}
        >
          <Mono>human decision · approved with edits</Mono>
          <span className="dp-handwritten text-base" style={{ color: "var(--dp-clay)" }}>
            judgment, not consensus
          </span>
        </div>
      </div>
    </Section>
  );
}
