import { useEffect, useRef, useState } from "react";

const PHASES = [
  "Manifesto",
  "Philosophy",
  "Clarity",
  "Frenzy",
  "Wireframe",
  "Critique",
  "Orchestrate",
  "Gates",
  "Type",
  "Refine",
];

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [prevActive, setPrevActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const newProgress = max > 0 ? h.scrollTop / max : 0;
      setProgress(newProgress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show aside exactly when Philosophy's top hits the top of the viewport
  useEffect(() => {
    const target = document.getElementById("philosophy");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -100% 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const active = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));

  // Announce phase changes
  useEffect(() => {
    if (active !== prevActive) {
      setAnnouncement(`Entering phase ${active + 1}: ${PHASES[active]}`);
      setPrevActive(active);
    }
  }, [active, prevActive]);

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      <aside
        role="navigation"
        aria-label="Page progress indicator"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        {PHASES.map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <span
              role="progressbar"
              aria-valuenow={i <= active ? 100 : 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Phase ${i + 1}: ${p}`}
              className="block h-px transition-all duration-300"
              style={{
                width: i === active ? 28 : 14,
                background: i <= active ? "var(--dp-ink)" : "var(--dp-rule)",
              }}
            />
            <span
              className="dp-mono text-[0.6rem] transition-opacity"
              style={{
                opacity: i === active ? 1 : 0.4,
                color: "var(--dp-ink-soft)",
              }}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")} {p}
            </span>
          </div>
        ))}
      </aside>
    </>
  );
}
