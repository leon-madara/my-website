import { createElement, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

type ScenicTheme = "day" | "night";

type ThemeToggleLandscapeElement = HTMLElement & {
  applyThemeState?: (
    theme: ScenicTheme,
    options?: {
      persist?: boolean;
      emitEvent?: boolean;
    }
  ) => void;
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const toggleRef = useRef<ThemeToggleLandscapeElement | null>(null);
  const scenicRoutes = location.pathname === "/" || location.pathname.startsWith("/portfolio");
  const buttonLabel =
    theme === "dark" ? "Activate light theme" : "Activate dark theme";

  useEffect(() => {
    if (!scenicRoutes) {
      return;
    }

    const toggleElement = toggleRef.current;

    if (!toggleElement) {
      return;
    }

    const handleThemeChanged = (event: Event) => {
      const nextTheme =
        (event as CustomEvent<{ theme?: ScenicTheme }>).detail?.theme === "night"
          ? "dark"
          : "light";

      setTheme(nextTheme);
    };

    toggleElement.addEventListener("theme-changed", handleThemeChanged as EventListener);

    return () => {
      toggleElement.removeEventListener(
        "theme-changed",
        handleThemeChanged as EventListener
      );
    };
  }, [scenicRoutes, setTheme]);

  useEffect(() => {
    if (!scenicRoutes) {
      return;
    }

    const toggleElement = toggleRef.current;
    const scenicTheme = theme === "dark" ? "night" : "day";

    if (!toggleElement) {
      return;
    }

    if (typeof toggleElement.applyThemeState === "function") {
      toggleElement.applyThemeState(scenicTheme, {
        persist: false,
        emitEvent: false
      });
      return;
    }

    toggleElement.setAttribute("data-theme", scenicTheme);
  }, [scenicRoutes, theme]);

  if (!scenicRoutes) {
    return (
      <button
        aria-label={buttonLabel}
        className="theme-toggle-simple theme-toggle-simple--page"
        data-testid="react-theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        type="button"
      >
        <span aria-hidden="true" className="theme-toggle-simple__sun">
          ☀
        </span>
        <span aria-hidden="true" className="theme-toggle-simple__moon">
          ☾
        </span>
      </button>
    );
  }

  return createElement("theme-toggle-landscape", {
    ref: toggleRef,
    className: "react-theme-toggle",
    "data-testid": "react-theme-toggle"
  });
}
