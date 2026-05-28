import { useEffect, useState, type CSSProperties } from "react";
import { Section, PhaseHeading, Mono } from "../primitives";

type CommandItem = {
  id: string;
  label: string;
  command: string;
  accent: string;
};

const GATES = [
  {
    label: "Gate 01",
    status: "Pre-build",
    name: "Entry Gate",
    accent: "var(--dp-amber)",
    body: "Resolve the correct working branch before implementation starts and block unsafe switching conditions.",
    checks: ["Scope matched", "Worktree checked", "Target confirmed"],
  },
  {
    label: "Gate 02",
    status: "Pre-release",
    name: "Exit Gate",
    accent: "var(--dp-green)",
    body: "Re-check lineage, recommend the safest promotion path, and require explicit approval before push or merge.",
    checks: ["Lineage reviewed", "Target scored", "Approval required"],
  },
] as const;

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "cmd-entry",
    label: "Windows Entry",
    command: "branch-orchestrator.cmd --mode entry --json",
    accent: "var(--dp-ink)",
  },
  {
    id: "cmd-exit",
    label: "Windows Exit",
    command: "branch-orchestrator.cmd --mode exit --json",
    accent: "var(--dp-red)",
  },
  {
    id: "sh-entry",
    label: "Shell Entry",
    command: "branch-orchestrator.sh --mode entry --json",
    accent: "var(--dp-green)",
  },
  {
    id: "sh-exit",
    label: "Shell Exit",
    command: "branch-orchestrator.sh --mode exit --json",
    accent: "var(--dp-muted)",
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  return prefersReducedMotion;
}

function CommandConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPreviousIndex(null);
      setActiveIndex(0);
      return;
    }

    let rotateTimer: number | undefined;
    let cleanupTimer: number | undefined;

    rotateTimer = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % COMMAND_ITEMS.length;
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);
      cleanupTimer = window.setTimeout(() => setPreviousIndex(null), 540);
    }, 2600);

    return () => {
      window.clearTimeout(rotateTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [activeIndex, prefersReducedMotion]);

  const activeItem = COMMAND_ITEMS[activeIndex];
  const previousItem = previousIndex === null ? null : COMMAND_ITEMS[previousIndex];

  return (
    <div className="dp-command-stage" aria-atomic="true" aria-live="polite" role="status">
      {previousItem ? (
        <CommandCard item={previousItem} state="is-exit" key={`${previousItem.id}-exit`} />
      ) : null}
      <CommandCard
        item={activeItem}
        state={previousItem ? "is-enter" : "is-current"}
        key={activeItem.id}
      />
    </div>
  );
}

function CommandCard({ item, state }: { item: CommandItem; state: string }) {
  return (
    <article
      className={`dp-command-item dp-command-stage-item ${state}`}
      style={{ "--dp-command-accent": item.accent } as CSSProperties}
    >
      <div className="dp-command-item-topline">
        <span className="dp-command-badge">{item.label}</span>
      </div>
      <code className="dp-command-item-code">{item.command}</code>
    </article>
  );
}

function GateCard({ gate }: { gate: (typeof GATES)[number] }) {
  return (
    <article
      className="dp-gate-card"
      role="listitem"
      style={{ "--dp-gate-accent": gate.accent } as CSSProperties}
    >
      <div className="dp-gate-card-topline">
        <Mono>{gate.label}</Mono>
        <span className="dp-gate-status">{gate.status}</span>
      </div>
      <h3 className="dp-display">{gate.name}</h3>
      <p>{gate.body}</p>
      <div className="dp-gate-checks" role="list" aria-label={`${gate.name} checks`}>
        {gate.checks.map((check) => (
          <span className="dp-gate-check" key={check} role="listitem">
            {check}
          </span>
        ))}
      </div>
    </article>
  );
}

export function BranchGates() {
  return (
    <Section id="branch-gates" className="dp-branch-gates-section" tint="charcoal">
      <PhaseHeading
        index="08"
        kicker="Release Safety Layer"
        title="Two branch gates keep execution clean: one before code, one before promotion."
      />

      <div className="dp-gates-copy">
        <p>
          Entry gate resolves the correct working branch before any change. Exit gate validates
          promotion targets after integration, then requests explicit approval before push or merge.
        </p>
        <p>
          This keeps feature boundaries clean, blocks accidental sibling merges, and preserves
          reviewable history across complex multi-agent sessions.
        </p>
      </div>

      <div className="dp-gates-showcase">
        <article className="dp-gates-header-panel">
          <Mono>Branch Safety System</Mono>
          <h3 className="dp-display">Controlled branch flow for execution, validation, and release.</h3>
          <p>
            One panel defines the control model, two gates enforce it at the decision points, and
            one operations block exposes the command surface.
          </p>
        </article>

        <div className="dp-gates-grid" role="list" aria-label="Branch orchestration gate flow">
          <GateCard gate={GATES[0]} />
          <div className="dp-gates-connector" aria-hidden="true">
            <span className="dp-gates-connector-arrow">&harr;</span>
          </div>
          <GateCard gate={GATES[1]} />
        </div>

        <div className="dp-command-console" aria-label="Cross-platform branch gate commands">
          <div className="dp-command-console-bar">
            <Mono>Operational Commands</Mono>
          </div>
          <CommandConsole />
        </div>
      </div>
    </Section>
  );
}
