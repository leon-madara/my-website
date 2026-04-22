import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const roles = [
  "Full Stack AI Developer & Designer",
  "AI Integration Engineer",
  "Web Developer & Designer",
  "Visual Designer",
];

const morphTime = 1.5;
const cooldownTime = 0.5;

function useMorphingText(
  texts: string[],
  {
    paused = false,
    onAdvance,
  }: { paused?: boolean; onAdvance?: (index: number) => void } = {}
) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [t1, t2] = [text1Ref.current, text2Ref.current];
      if (!t1 || !t2) return;

      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      t1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      t1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

      t1.textContent = texts[textIndexRef.current % texts.length];
      t2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
      onAdvance?.(textIndexRef.current);
    }
  }, [setStyles, onAdvance]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [t1, t2] = [text1Ref.current, text2Ref.current];
    if (!t1 || !t2) return;
    t2.style.filter = "none";
    t2.style.opacity = "100%";
    t1.style.filter = "none";
    t1.style.opacity = "0%";
  }, []);

  useEffect(() => {
    if (paused) return;

    timeRef.current = new Date();
    let rafId: number;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);

      const now = new Date();
      const dt = (now.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();

    return () => window.cancelAnimationFrame(rafId);
  }, [doMorph, doCooldown, paused]);

  return { text1Ref, text2Ref };
}

export function RoleSequence() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const screenReaderTextRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [tabHidden, setTabHidden] = useState(false);

  const paused = prefersReducedMotion || tabHidden;

  const handleAdvance = useCallback((index: number) => {
    const text = roles[index % roles.length];
    if (screenReaderTextRef.current) {
      screenReaderTextRef.current.textContent = text;
    }
    containerRef.current?.setAttribute("aria-label", text);
  }, []);

  const { text1Ref, text2Ref } = useMorphingText(roles, {
    paused,
    onAdvance: handleAdvance,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (prefersReducedMotion) {
      container.classList.add("role-sequence--reduced-motion");
      container.classList.remove("role-sequence--ready");
      const t1 = text1Ref.current;
      const t2 = text2Ref.current;
      if (t1 && t2) {
        t1.style.filter = "none";
        t1.style.opacity = "100%";
        t1.textContent = roles[0];
        t2.style.filter = "none";
        t2.style.opacity = "0%";
      }
    } else {
      container.classList.remove("role-sequence--reduced-motion");
      container.classList.add("role-sequence--ready");
    }
  }, [prefersReducedMotion, text1Ref, text2Ref]);

  useEffect(() => {
    const handleVisibilityChange = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const measure = () => {
      const span = document.createElement("span");
      span.className = "role-sequence__text role-sequence__measure";
      span.setAttribute("aria-hidden", "true");
      container.appendChild(span);

      let maxHeight = 0;
      roles.forEach((role) => {
        span.textContent = role;
        const h = span.getBoundingClientRect().height || span.offsetHeight;
        maxHeight = Math.max(maxHeight, h);
      });

      container.removeChild(span);
      if (maxHeight > 0) {
        container.style.setProperty(
          "--role-sequence-height",
          `${Math.ceil(maxHeight)}px`
        );
      }
    };

    const onResize = () => window.requestAnimationFrame(measure);

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
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
