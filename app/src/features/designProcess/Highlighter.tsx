import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  className?: string;
}

function useHighlighterInView(enabled: boolean) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisible(true);
          observer.disconnect();
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, visible };
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  className,
}: HighlighterProps) {
  const { ref, visible } = useHighlighterInView(isView);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pathLength, setPathLength] = useState(180);
  const underlinePathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const path = underlinePathRef.current;
    if (!path) return;
    setPathLength(path.getTotalLength());
  }, [action, children]);

  const style = {
    "--dp-highlighter-color": color,
    "--dp-highlighter-duration": `${animationDuration}ms`,
    "--dp-highlighter-padding": `${padding}px`,
    "--dp-highlighter-stroke": `${strokeWidth}px`,
    "--dp-highlighter-iterations": String(iterations),
    "--dp-highlighter-path": `${pathLength}`,
  } as CSSProperties;

  const rootClassName = [
    "dp-highlighter",
    `dp-highlighter--${action}`,
    multiline ? "is-multiline" : "is-singleline",
    visible || prefersReducedMotion ? "is-visible" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderAnnotation = () => {
    if (action === "highlight") {
      return <span aria-hidden="true" className="dp-highlighter__wash" />;
    }

    const pathMap: Record<Exclude<AnnotationAction, "highlight">, string> = {
      underline: "M4 11.5C21 15.5 35 7.8 53 10.9C70 13.9 86 15.9 116 11.2",
      box: "M7 4.5C39 2.6 80 3 113 5.2M114 5.2C116.4 10.5 116 14.1 112 15.8M112 15.8C74 16.8 35 16.9 8.3 14.8M8.3 14.8C4.6 11.2 4.8 8.2 7 4.5",
      circle:
        "M26 4.8C42 0.6 81 0.7 99 6.1M99 6.1C111.2 10.2 112.8 19.8 96.1 16.3M96.1 16.3C70.8 19.4 32.9 19.4 19 15.1M19 15.1C4.7 11.5 7.9 6.7 26 4.8",
      "strike-through": "M6 9.4C31 8.1 72 8.3 114 9.1",
      "crossed-off":
        "M6 9.4C31 8.1 72 8.3 114 9.1M18 15.4C43 7.8 73 4.8 102 2.8",
      bracket:
        "M18 2.8C11 3.1 9 4.9 9 8.8M9 8.8C8.8 11.7 10 13.8 18 15.3M102 2.9C110 3.1 112 4.9 112 8.8M112 8.8C112 11.7 110.5 13.8 102 15.2",
    };

    return (
      <svg
        aria-hidden="true"
        className="dp-highlighter__svg"
        viewBox="0 0 120 18"
        preserveAspectRatio="none"
      >
        <path ref={underlinePathRef} d={pathMap[action]} />
      </svg>
    );
  };

  return (
    <span ref={ref} className={rootClassName} style={style}>
      <span className="dp-highlighter__text">{children}</span>
      {renderAnnotation()}
    </span>
  );
}
