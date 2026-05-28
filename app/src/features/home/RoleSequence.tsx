import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const roles = [
  {
    label: "Full Stack AI Developer & Designer",
    color: {
      light: "#ce1126",
      dark: "#ce1126"
    }
  },
  {
    label: "AI Integration Engineer",
    color: {
      light: "#006b3f",
      dark: "#10cf74"
    }
  },
  {
    label: "Web Developer & Designer",
    color: {
      light: "#111111",
      dark: "#e8edf3"
    }
  },
  {
    label: "Visual Designer",
    color: {
      light: "#c8860a",
      dark: "#f0b84a"
    }
  }
];

const fadeTime = 1.45;
const holdTime = 3;
const maxMorphBlur = 5;
const morphOpacityCurve = 0.55;

type Role = (typeof roles)[number];
type Phase = "hold" | "fade";

export function RoleSequence() {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const screenReaderTextRef = useRef<HTMLSpanElement | null>(null);
  const textIndexRef = useRef(0);
  const phaseRef = useRef<Phase>("hold");
  const phaseElapsedRef = useRef(0);
  const timeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const screenReaderText = screenReaderTextRef.current;

    if (!container || !text1 || !text2 || !screenReaderText) {
      return;
    }

    const isDarkTheme = () =>
      document.documentElement.getAttribute("data-theme") === "dark" ||
      document.body.classList.contains("dark-theme");

    const getRole = (index: number) => roles[index % roles.length];

    const getRoleColor = (role: Role) =>
      isDarkTheme() ? role.color.dark : role.color.light;

    const setLayer = (
      element: HTMLSpanElement,
      role: Role,
      opacity: number,
      blur = 0
    ) => {
      element.textContent = role.label;
      element.style.filter = blur > 0 ? `blur(${blur.toFixed(3)}px)` : "none";
      element.style.opacity = `${opacity}`;
      element.style.setProperty("--role-layer-color", getRoleColor(role));
    };

    const getMorphBlur = (visibilityFraction: number) => {
      const safeFraction = Math.min(Math.max(visibilityFraction, 0.001), 1);
      return Math.min(8 / safeFraction - 8, maxMorphBlur);
    };

    const getMorphOpacity = (visibilityFraction: number) =>
      Math.pow(Math.min(Math.max(visibilityFraction, 0), 1), morphOpacityCurve);

    const updateAccessibleText = () => {
      const roleText = getRole(textIndexRef.current).label;
      screenReaderText.textContent = roleText;
      container.setAttribute("aria-label", roleText);
    };

    const applyHoldState = () => {
      const currentRole = getRole(textIndexRef.current);
      const nextRole = getRole(textIndexRef.current + 1);

      setLayer(text1, currentRole, 1);
      setLayer(text2, nextRole, 0);
    };

    const applyFadeState = (fraction: number) => {
      const clampedFraction = Math.min(Math.max(fraction, 0), 1);
      const easedFraction =
        clampedFraction * clampedFraction * (3 - 2 * clampedFraction);
      const currentRole = getRole(textIndexRef.current);
      const nextRole = getRole(textIndexRef.current + 1);

      setLayer(
        text1,
        currentRole,
        getMorphOpacity(1 - easedFraction),
        getMorphBlur(1 - clampedFraction)
      );
      setLayer(
        text2,
        nextRole,
        getMorphOpacity(easedFraction),
        getMorphBlur(clampedFraction)
      );
    };

    const applyCurrentVisualState = () => {
      if (phaseRef.current === "fade") {
        applyFadeState(phaseElapsedRef.current / fadeTime);
        return;
      }

      applyHoldState();
    };

    const resetVisualState = () => {
      textIndexRef.current = 0;
      phaseRef.current = "hold";
      phaseElapsedRef.current = 0;
      timeRef.current = null;
      applyHoldState();
      updateAccessibleText();
    };

    const measureMaxRoleHeight = () => {
      const measurement = document.createElement("span");
      measurement.className = "role-sequence__text role-sequence__measure";
      measurement.setAttribute("aria-hidden", "true");
      measurement.style.position = "static";
      measurement.style.display = "inline-block";
      measurement.style.opacity = "1";
      measurement.style.filter = "none";
      measurement.style.visibility = "hidden";

      let maxHeight = 0;

      container.appendChild(measurement);

      roles.forEach((role) => {
        measurement.textContent = role.label;
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

    const cancelFrame = () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const completeTransition = () => {
      textIndexRef.current = (textIndexRef.current + 1) % roles.length;
      phaseRef.current = "hold";
      phaseElapsedRef.current = 0;
      applyHoldState();
      updateAccessibleText();
    };

    const animate = (timestamp: number) => {
      if (pausedRef.current || prefersReducedMotion) {
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(animate);

      if (timeRef.current === null) {
        timeRef.current = timestamp;
        return;
      }

      const dt = (timestamp - timeRef.current) / 1000;
      timeRef.current = timestamp;
      phaseElapsedRef.current += dt;

      if (phaseRef.current === "hold") {
        applyHoldState();

        if (phaseElapsedRef.current >= holdTime) {
          phaseRef.current = "fade";
          phaseElapsedRef.current = 0;
          applyFadeState(0);
        }

        return;
      }

      const fraction = phaseElapsedRef.current / fadeTime;
      applyFadeState(fraction);

      if (fraction >= 1) {
        completeTransition();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pausedRef.current = true;
        cancelFrame();
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      pausedRef.current = false;
      timeRef.current = null;
      rafIdRef.current = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      window.requestAnimationFrame(measureMaxRoleHeight);
    };

    const themeObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(applyCurrentVisualState)
        : null;

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
    themeObserver?.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true
    });
    themeObserver?.observe(document.body, {
      attributeFilter: ["class"],
      attributes: true
    });

    if (prefersReducedMotion) {
      pausedRef.current = false;
      cancelFrame();
      resetVisualState();
      container.classList.add("no-animation", "role-sequence--reduced-motion");
      container.classList.remove("role-sequence--ready");
    } else {
      pausedRef.current = false;
      container.classList.remove("no-animation", "role-sequence--reduced-motion");
      container.classList.add("role-sequence--ready");
      timeRef.current = null;
      rafIdRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      cancelFrame();
      themeObserver?.disconnect();
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
      aria-label={roles[0].label}
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
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 -3"
            />
          </filter>
        </defs>
      </svg>
      <span
        aria-hidden="true"
        className="role-sequence__text role-sequence__text--current"
        ref={text1Ref}
      >
        {roles[0].label}
      </span>
      <span
        aria-hidden="true"
        className="role-sequence__text role-sequence__text--next"
        ref={text2Ref}
      />
      <span className="role-sequence__sr-text sr-only" ref={screenReaderTextRef}>
        {roles[0].label}
      </span>
    </h2>
  );
}
