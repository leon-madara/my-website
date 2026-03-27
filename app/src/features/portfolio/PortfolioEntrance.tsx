import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SESSION_KEY = "portfolio_entrance_seen";

interface PortfolioEntranceProps {
  isActive: boolean;
  onReadyChange: (ready: boolean) => void;
}

function supports3DTransforms() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const probe = document.createElement("div");
  return (
    "transform" in probe.style &&
    typeof window.CSS !== "undefined" &&
    typeof window.CSS.supports === "function" &&
    window.CSS.supports("transform-style", "preserve-3d")
  );
}

export function PortfolioEntrance({
  isActive,
  onReadyChange
}: PortfolioEntranceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "visible" | "flipping" | "done">(
    "idle"
  );
  const [shouldRender, setShouldRender] = useState(false);

  const shouldPlay = useMemo(() => {
    if (!isActive || prefersReducedMotion || !supports3DTransforms()) {
      return false;
    }

    try {
      return sessionStorage.getItem(SESSION_KEY) !== "true";
    } catch {
      return false;
    }
  }, [isActive, prefersReducedMotion]);

  useEffect(() => {
    if (!isActive) {
      onReadyChange(true);
      setPhase("idle");
      setShouldRender(false);
      return;
    }

    if (!shouldPlay) {
      onReadyChange(true);
      setPhase("done");
      setShouldRender(false);
      return;
    }

    onReadyChange(false);
    setShouldRender(true);
    setPhase("visible");

    const preload = new Image();
    preload.src = "/images/PortFolioImageDesign.svg";

    const flipTimer = window.setTimeout(() => {
      setPhase("flipping");
    }, 2500);

    const completeTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Ignore storage failures and continue to reveal the content.
      }

      setPhase("done");
      onReadyChange(true);
    }, 3400);

    const cleanupTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, 3900);

    return () => {
      window.clearTimeout(flipTimer);
      window.clearTimeout(completeTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [isActive, onReadyChange, shouldPlay]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const handleSkip = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Ignore storage failures during skip.
      }

      setPhase("done");
      onReadyChange(true);
      window.setTimeout(() => {
        setShouldRender(false);
      }, 250);
    };

    document.addEventListener("keydown", handleSkip);
    return () => {
      document.removeEventListener("keydown", handleSkip);
    };
  }, [onReadyChange, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`portfolio-entrance ${phase === "flipping" ? "is-flipping" : ""} ${phase === "done" ? "is-complete" : ""}`}
    >
      <div className="portfolio-entrance__scene">
        <div className="portfolio-entrance__face portfolio-entrance__face--front">
          <div className="portfolio-entrance__splash">
            <img
              alt=""
              className={`portfolio-entrance__logo ${phase === "visible" || phase === "flipping" ? "is-visible" : ""}`}
              src="/images/PortFolioImageDesign.svg"
            />
          </div>
        </div>
        <div className="portfolio-entrance__face portfolio-entrance__face--back" />
      </div>
    </div>
  );
}
