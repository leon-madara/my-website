import { createElement, useEffect, useRef } from "react";
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
  const toggleRef = useRef<ThemeToggleLandscapeElement | null>(null);

  useEffect(() => {
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
  }, [setTheme]);

  useEffect(() => {
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
  }, [theme]);

  return createElement("theme-toggle-landscape", {
    ref: toggleRef,
    className: "react-theme-toggle",
    "data-testid": "react-theme-toggle"
  });
}
