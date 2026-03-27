import { useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

export function ThemeToggle() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isHome = location.pathname === "/";

  return isHome ? (
    <button
      aria-label="Toggle dark and light mode"
      className="theme-toggle-landscape"
      onClick={toggleTheme}
      type="button"
    >
      <span className="theme-toggle-landscape__sky" />
      <span className="theme-toggle-landscape__stars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="theme-toggle-landscape__sun-moon">
        <span className="theme-toggle-landscape__crater" />
        <span className="theme-toggle-landscape__crater theme-toggle-landscape__crater--small" />
      </span>
      <span className="theme-toggle-landscape__hills" />
      <span className="theme-toggle-landscape__sr">
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  ) : (
    <button
      aria-label="Toggle dark mode"
      className="theme-toggle-simple"
      onClick={toggleTheme}
      type="button"
    >
      <span className="theme-toggle-simple__sun" aria-hidden="true">
        ☼
      </span>
      <span className="theme-toggle-simple__moon" aria-hidden="true">
        ☾
      </span>
      <span className="sr-only">
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}
