import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const roles = [
  "Full Stack AI Developer",
  "AI Engineer",
  "Web Developer & Designer",
  "Graphic Designer"
];

const morphDuration = 1450;
const firstHoldDuration = 5000;
const otherHoldDuration = 3000;

export function RoleSequence() {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const currentTextRef = useRef<HTMLSpanElement | null>(null);
  const nextTextRef = useRef<HTMLSpanElement | null>(null);
  const screenReaderTextRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const currentText = currentTextRef.current;
    const nextText = nextTextRef.current;
    const screenReaderText = screenReaderTextRef.current;

    if (!container || !currentText || !nextText || !screenReaderText) {
      return;
    }

    let rafId: number | null = null;
    let lastTimestamp: number | null = null;
    let phaseElapsed = 0;
    let currentIndex = 0;
    let nextIndex = 1;
    let phase: "hold" | "morph" = "hold";
    let paused = false;

    const updateAccessibleText = (roleText: string) => {
      screenReaderText.textContent = roleText;
      container.setAttribute("aria-label", roleText);
    };

    const resetVisualState = () => {
      currentText.textContent = roles[currentIndex];
      nextText.textContent = roles[nextIndex];
      currentText.style.filter = "none";
      currentText.style.opacity = "1";
      nextText.style.filter = "none";
      nextText.style.opacity = "0";
      updateAccessibleText(roles[currentIndex]);
    };

    const measureMaxRoleHeight = () => {
      const measurement = document.createElement("span");
      measurement.className = "role-sequence__text role-sequence__measure";
      measurement.setAttribute("aria-hidden", "true");
      measurement.style.position = "static";
      measurement.style.display = "block";
      measurement.style.opacity = "1";
      measurement.style.filter = "none";
      measurement.style.visibility = "hidden";

      let maxHeight = 0;

      container.appendChild(measurement);

      roles.forEach((role) => {
        measurement.textContent = role;
        const rect = measurement.getBoundingClientRect();
        maxHeight = Math.max(maxHeight, rect.height || measurement.offsetHeight);
      });

      container.removeChild(measurement);

      if (maxHeight > 0) {
        container.style.setProperty(
          "--role-sequence-height",
          `${Math.ceil(maxHeight)}px`
        );
      }
    };

    const applyCooldownState = () => {
      currentText.textContent = roles[currentIndex];
      nextText.textContent = roles[nextIndex];
      currentText.style.filter = "none";
      currentText.style.opacity = "1";
      nextText.style.filter = "none";
      nextText.style.opacity = "0";
    };

    const applyMorphState = (fraction: number) => {
      const safeFraction = Math.max(fraction, 0.0001);
      const inverseFraction = Math.max(1 - fraction, 0.0001);

      container.classList.add("role-sequence--ready");
      nextText.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
      nextText.style.opacity = `${Math.pow(safeFraction, 0.4)}`;
      currentText.style.filter = `blur(${Math.min(8 / inverseFraction - 8, 100)}px)`;
      currentText.style.opacity = `${Math.pow(inverseFraction, 0.4)}`;
    };

    const completeTransition = () => {
      currentIndex = nextIndex;
      nextIndex = (currentIndex + 1) % roles.length;
      phase = "hold";
      phaseElapsed = 0;
      resetVisualState();
    };

    const getHoldDuration = (index: number) =>
      index === 0 ? firstHoldDuration : otherHoldDuration;

    const cancelFrame = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const animate = (timestamp: number) => {
      if (paused || prefersReducedMotion) {
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      phaseElapsed += delta;

      if (phase === "hold") {
        applyCooldownState();

        if (phaseElapsed >= getHoldDuration(currentIndex)) {
          phase = "morph";
          phaseElapsed = 0;
          nextIndex = (currentIndex + 1) % roles.length;
          currentText.textContent = roles[currentIndex];
          nextText.textContent = roles[nextIndex];
        }
      } else {
        const fraction = Math.min(phaseElapsed / morphDuration, 1);
        applyMorphState(fraction);

        if (fraction >= 1) {
          completeTransition();
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        cancelFrame();
        lastTimestamp = null;
        return;
      }

      paused = false;
      lastTimestamp = null;
      rafId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      window.requestAnimationFrame(measureMaxRoleHeight);
    };

    resetVisualState();
    measureMaxRoleHeight();

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady
        .then(() => {
          measureMaxRoleHeight();
        })
        .catch(() => {
          // Keep the initial measurement when font loading is unavailable.
        });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    if (prefersReducedMotion) {
      container.classList.add("no-animation", "role-sequence--reduced-motion");
      container.classList.remove("role-sequence--ready");
    } else {
      container.classList.remove("no-animation", "role-sequence--reduced-motion");
      container.classList.add("role-sequence--ready");
      rafId = window.requestAnimationFrame(animate);
    }

    return () => {
      cancelFrame();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      container.classList.remove(
        "no-animation",
        "role-sequence--ready",
        "role-sequence--reduced-motion"
      );
    };
  }, [prefersReducedMotion]);

  return (
    <h2
      aria-atomic="true"
      aria-label={roles[0]}
      aria-live="polite"
      className="role kenyan-gradient role-sequence"
      ref={containerRef}
      tabIndex={0}
    >
      <svg
        aria-hidden="true"
        className="role-sequence__filter"
        focusable="false"
        height="0"
        width="0"
      >
        <defs>
          <filter id="role-sequence-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <span
        aria-hidden="true"
        className="role-sequence__text role-sequence__text--current"
        ref={currentTextRef}
      >
        {roles[0]}
      </span>
      <span
        aria-hidden="true"
        className="role-sequence__text role-sequence__text--next"
        ref={nextTextRef}
      />
      <span className="role-sequence__sr-text sr-only" ref={screenReaderTextRef}>
        {roles[0]}
      </span>
    </h2>
  );
}
