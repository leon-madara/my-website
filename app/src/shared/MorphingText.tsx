import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType
} from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.5;

interface MorphingTextProps {
  texts: string[];
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  ariaLabel?: string;
  tabIndex?: number;
}

export function MorphingText({
  texts,
  className,
  style,
  as = "div",
  ariaLabel,
  tabIndex,
  ...rest
}: MorphingTextProps & Record<string, unknown>) {
  const Tag = as as ElementType;

  const containerRef = useRef<HTMLElement | null>(null);
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const srRef = useRef<HTMLSpanElement | null>(null);

  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const rafIdRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const prefersReducedMotion = useReducedMotion();

  const setStyles = useCallback(
    (fraction: number) => {
      const text1 = text1Ref.current;
      const text2 = text2Ref.current;
      if (!text1 || !text2) return;

      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inverted = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / inverted - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(inverted, 0.4) * 100}%`;

      text1.textContent = texts[textIndexRef.current % texts.length];
      text2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  useEffect(() => {
    const container = containerRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const sr = srRef.current;

    if (!container || !text1 || !text2 || !sr || texts.length === 0) {
      return;
    }

    const announce = () => {
      const current = texts[textIndexRef.current % texts.length];
      sr.textContent = current;
      if (!ariaLabel) {
        container.setAttribute("aria-label", current);
      }
    };

    const reset = () => {
      textIndexRef.current = 0;
      morphRef.current = 0;
      cooldownRef.current = 0;
      timeRef.current = new Date();
      text1.textContent = texts[0];
      text2.textContent = texts[1 % texts.length];
      text1.style.filter = "none";
      text1.style.opacity = "100%";
      text2.style.filter = "none";
      text2.style.opacity = "0%";
      announce();
    };

    const measureHeight = () => {
      const probe = document.createElement("span");
      probe.className = "morphing-text__probe";
      probe.setAttribute("aria-hidden", "true");
      probe.style.position = "static";
      probe.style.display = "inline-block";
      probe.style.visibility = "hidden";
      probe.style.opacity = "1";
      probe.style.filter = "none";

      let maxHeight = 0;
      container.appendChild(probe);
      for (const text of texts) {
        probe.textContent = text;
        const rect = probe.getBoundingClientRect();
        maxHeight = Math.max(maxHeight, rect.height || probe.offsetHeight);
      }
      container.removeChild(probe);

      if (maxHeight > 0) {
        container.style.setProperty(
          "--morphing-text-height",
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

    const doMorph = () => {
      morphRef.current -= cooldownRef.current;
      cooldownRef.current = 0;

      let fraction = morphRef.current / MORPH_TIME;

      if (fraction > 1) {
        cooldownRef.current = COOLDOWN_TIME;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current += 1;
        announce();
      }
    };

    const doCooldown = () => {
      morphRef.current = 0;
      text2.style.filter = "none";
      text2.style.opacity = "100%";
      text1.style.filter = "none";
      text1.style.opacity = "0%";
      announce();
    };

    const animate = () => {
      if (pausedRef.current || prefersReducedMotion) return;

      rafIdRef.current = window.requestAnimationFrame(animate);

      const now = new Date();
      const dt = (now.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        pausedRef.current = true;
        cancelFrame();
        return;
      }
      if (prefersReducedMotion) return;
      pausedRef.current = false;
      timeRef.current = new Date();
      animate();
    };

    const handleResize = () => {
      window.requestAnimationFrame(measureHeight);
    };

    reset();
    measureHeight();

    document.fonts?.ready?.then(measureHeight).catch(() => undefined);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    if (prefersReducedMotion) {
      pausedRef.current = false;
      cancelFrame();
      reset();
      container.classList.add("morphing-text--reduced-motion");
      container.classList.remove("morphing-text--ready");
    } else {
      pausedRef.current = false;
      container.classList.remove("morphing-text--reduced-motion");
      container.classList.add("morphing-text--ready");
      timeRef.current = new Date();
      animate();
    }

    return () => {
      cancelFrame();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      container.classList.remove(
        "morphing-text--ready",
        "morphing-text--reduced-motion"
      );
    };
  }, [texts, ariaLabel, prefersReducedMotion, setStyles]);

  const composedClassName = ["morphing-text", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      {...rest}
      ref={containerRef as any}
      aria-atomic="true"
      aria-live="polite"
      aria-label={ariaLabel ?? texts[0]}
      className={composedClassName}
      style={style}
      tabIndex={tabIndex}
    >
      <svg
        aria-hidden="true"
        className="morphing-text__filter"
        focusable="false"
        height="0"
        width="0"
      >
        <defs>
          <filter id="morphing-text-threshold">
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
        className="morphing-text__text morphing-text__text--current"
        ref={text1Ref}
      >
        {texts[0]}
      </span>
      <span
        aria-hidden="true"
        className="morphing-text__text morphing-text__text--next"
        ref={text2Ref}
      />
      <span className="morphing-text__sr sr-only" ref={srRef}>
        {texts[0]}
      </span>
    </Tag>
  );
}
