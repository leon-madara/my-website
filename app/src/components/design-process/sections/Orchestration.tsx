import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Section, PhaseHeading, Mono } from "../primitives";

const NODES = [
  { id: "brief",  label: "brief",     x: 6,  y: 50 },
  { id: "split",  label: "scope",     x: 26, y: 50 },
  { id: "type",   label: "type spec", x: 50, y: 18 },
  { id: "ui",     label: "ui system", x: 50, y: 50 },
  { id: "motion", label: "motion",    x: 50, y: 82 },
  { id: "verify", label: "verifier",  x: 76, y: 50 },
  { id: "ship",   label: "ship",      x: 94, y: 50 },
];

const EDGES: [string, string][] = [
  ["brief", "split"],
  ["split", "type"],
  ["split", "ui"],
  ["split", "motion"],
  ["type", "verify"],
  ["ui", "verify"],
  ["motion", "verify"],
  ["verify", "ship"],
];

// Three packet lanes — one per specialist. Each carries a Kenyan-flag coloured
// packet through brief → scope → specialist → verify → ship in a continuous loop.
const LANES = [
  { id: "type",   color: "#006400", path: ["brief", "split", "type",   "verify", "ship"] }, // green
  { id: "ui",     color: "#A80000", path: ["brief", "split", "ui",     "verify", "ship"] }, // red
  { id: "motion", color: "#1C1917", path: ["brief", "split", "motion", "verify", "ship"] }, // black
];

const SEGMENT_S = 0.95;

export function Orchestration() {
  const get = (id: string) => NODES.find((n) => n.id === id)!;
  const rootRef = useRef<HTMLDivElement>(null);
  const packetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRefs = useRef<(HTMLDivElement | null)[]>([]);
  const verifyRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      LANES.forEach((lane, i) => {
        const packet = packetRefs.current[i];
        const halo = haloRefs.current[i];
        if (!packet || !halo) return;

        const positions = lane.path.map((id) => get(id));
        const cycleS = (positions.length - 1) * SEGMENT_S; // 4 × 0.95 = 3.8s
        const stagger = cycleS / LANES.length;             // ≈ 1.27s

        const tl = gsap.timeline({ repeat: -1, delay: i * stagger });

        // Start invisible at brief
        tl.set([packet, halo], {
          left: `${positions[0].x}%`,
          top: `${positions[0].y}%`,
          opacity: 0,
        });

        // Fade in
        tl.to(packet, { opacity: 1, duration: 0.28, ease: "power2.out" });
        tl.to(halo,   { opacity: 0.55, duration: 0.28, ease: "power2.out" }, "<");

        // Traverse each edge
        for (let k = 1; k < positions.length; k++) {
          tl.to([packet, halo], {
            left: `${positions[k].x}%`,
            top: `${positions[k].y}%`,
            duration: SEGMENT_S,
            ease: "power1.inOut",
          });
        }

        // Fade out at ship + breather before the next cycle
        tl.to([packet, halo], { opacity: 0, duration: 0.32 });
        tl.to({}, { duration: 0.45 });
      });

      // Verifier pulse — continuous green ring expanding & fading
      if (verifyRingRef.current) {
        gsap.set(verifyRingRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0.85 });
        gsap.to(verifyRingRef.current, {
          scale: 3.6,
          opacity: 0,
          duration: 1.9,
          ease: "power2.out",
          repeat: -1,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="orchestration" tint="charcoal">
      <PhaseHeading
        index="07"
        kicker="Agent orchestration"
        title="Brief → scoped packets → verified output."
        intro="Complex briefs are split, scoped with contracts, routed to specialists, and verified against the original intent before they merge."
      />

      <div
        ref={rootRef}
        className="relative mt-14 border dp-rule rounded-[10px] overflow-hidden"
        style={{
          background: "var(--dp-paper)",
          boxShadow: "var(--dp-shadow-outer)",
        }}
      >
        <div className="dp-grid-bg absolute inset-0 opacity-50" aria-hidden />

        <div className="relative aspect-[16/8]">
          {/* Edges — SVG handles diagonal lines correctly even under non-uniform scaling */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
          >
            {EDGES.map(([a, b], i) => {
              const A = get(a);
              const B = get(b);
              return (
                <line
                  key={i}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke="var(--dp-rule)" strokeWidth="0.2"
                />
              );
            })}
          </svg>

          {/* Verifier pulse ring */}
          <div
            ref={verifyRingRef}
            className="absolute pointer-events-none"
            style={{
              left: `${get("verify").x}%`,
              top: `${get("verify").y}%`,
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              border: "1.5px solid #006400",
              opacity: 0.85,
            }}
            aria-hidden
          />

          {/* Packet halos — soft glow underneath each dot */}
          {LANES.map((lane, i) => (
            <div
              key={`${lane.id}-halo`}
              ref={(el) => { haloRefs.current[i] = el; }}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${get(lane.path[0]).x}%`,
                top: `${get(lane.path[0]).y}%`,
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: lane.color,
                filter: "blur(8px)",
                opacity: 0,
              }}
              aria-hidden
            />
          ))}

          {/* Packet dots — sharp on top */}
          {LANES.map((lane, i) => (
            <div
              key={`${lane.id}-packet`}
              ref={(el) => { packetRefs.current[i] = el; }}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${get(lane.path[0]).x}%`,
                top: `${get(lane.path[0]).y}%`,
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: lane.color,
                boxShadow: `0 0 10px ${lane.color}, 0 0 4px ${lane.color}`,
                opacity: 0,
                zIndex: 5,
              }}
              aria-hidden
            />
          ))}

          {/* Nodes */}
          {NODES.map((n) => (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%`, zIndex: 10 }}
            >
              <div
                className="px-3 py-2 border dp-rule rounded-md"
                style={{
                  background: "var(--dp-paper)",
                  boxShadow:
                    n.id === "verify"
                      ? "0 10px 22px -10px color-mix(in oklab, var(--dp-green) 60%, transparent)"
                      : "var(--dp-shadow-card)",
                }}
              >
                <Mono>{n.label}</Mono>
              </div>
            </div>
          ))}

          <div
            className="absolute right-3 bottom-3 dp-mono text-[0.6rem] px-2 py-1 border dp-rule rounded-full"
            style={{ background: "var(--dp-paper)", zIndex: 10 }}
          >
            contract: input → output → check
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {[
          "split: chunks with clear contracts",
          "route: specialist per chunk",
          "verify: against the original brief",
        ].map((t) => (
          <div
            key={t}
            className="p-4 border dp-rule rounded-[10px]"
            style={{
              background: "var(--dp-paper)",
              boxShadow: "var(--dp-shadow-card)",
            }}
          >
            <Mono>{t}</Mono>
          </div>
        ))}
      </div>
    </Section>
  );
}
