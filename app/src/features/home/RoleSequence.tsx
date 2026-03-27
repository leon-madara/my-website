import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const roles = [
  "Full Stack AI Developer",
  "AI Engineer",
  "Web Developer & Designer",
  "Graphic Designer"
];

const morphTime = 1.5;
const cooldownTime = 0.5;

export function RoleSequence() {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const screenReaderTextRef = useRef<HTMLSpanElement | null>(null);
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
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

    const updateAccessibleText = () => {
      const roleText = roles[textIndexRef.current % roles.length];
      screenReaderText.textContent = roleText;
      container.setAttribute("aria-label", roleText);
    };

    const resetVisualState = () => {
      textIndexRef.current = 0;
      morphRef.current = 0;
      cooldownRef.current = 0;
      timeRef.current = new Date();
      text1.textContent = roles[0];
      text2.textContent = roles[1];
      text1.style.filter = "none";
      text1.style.opacity = "100%";
      text2.style.filter = "none";
      text2.style.opacity = "0%";
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

    const cancelFrame = () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const setStyles = (fraction: number) => {
      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      text1.textContent = roles[textIndexRef.current % roles.length];
      text2.textContent = roles[(textIndexRef.current + 1) % roles.length];
    };

    const doMorph = () => {
      morphRef.current -= cooldownRef.current;
      cooldownRef.current = 0;

      let fraction = morphRef.current / morphTime;

      if (fraction > 1) {
        cooldownRef.current = cooldownTime;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current += 1;
        updateAccessibleText();
      }
    };

    const doCooldown = () => {
      morphRef.current = 0;

      text2.style.filter = "none";
      text2.style.opacity = "100%";
      text1.style.filter = "none";
      text1.style.opacity = "0%";

      updateAccessibleText();
    };

    const animate = () => {
      if (pausedRef.current || prefersReducedMotion) {
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) {
        doMorph();
      } else {
        doCooldown();
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
      timeRef.current = new Date();
      animate();
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
      pausedRef.current = false;
      cancelFrame();
      resetVisualState();
      container.classList.add("no-animation", "role-sequence--reduced-motion");
      container.classList.remove("role-sequence--ready");
    } else {
      pausedRef.current = false;
      container.classList.remove("no-animation", "role-sequence--reduced-motion");
      container.classList.add("role-sequence--ready");
      timeRef.current = new Date();
      animate();
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
        ref={text1Ref}
      >
        {roles[0]}
      </span>
      <span
        aria-hidden="true"
        className="role-sequence__text role-sequence__text--next"
        ref={text2Ref}
      />
      <span className="role-sequence__sr-text sr-only" ref={screenReaderTextRef}>
        {roles[0]}
      </span>
    </h2>
  );
}
