import { useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isHome = location.pathname === "/";
  const isDesignProcess = location.pathname === "/design-process";

  if (isHome) {
    return (
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
    );
  }

  if (isDesignProcess) {
    return (
      <div
        aria-label="Theme"
        className={
          theme === "dark"
            ? "theme-toggle-sunmoon theme-toggle-sunmoon--dark"
            : "theme-toggle-sunmoon"
        }
        role="group"
      >
        <button
          aria-label="Switch to light mode"
          className={
            theme === "dark"
              ? "theme-toggle-sunmoon__option"
              : "theme-toggle-sunmoon__option is-active"
          }
          onClick={() => {
            if (theme === "dark") toggleTheme();
          }}
          type="button"
        >
          <SunIcon />
        </button>
        <button
          aria-label="Switch to dark mode"
          className={
            theme === "dark"
              ? "theme-toggle-sunmoon__option is-active"
              : "theme-toggle-sunmoon__option"
          }
          onClick={() => {
            if (theme === "light") toggleTheme();
          }}
          type="button"
        >
          <MoonIcon />
        </button>
      </div>
    );
  }

  return (
    <button
      aria-label="Toggle dark mode"
      className="theme-toggle-simple"
      onClick={toggleTheme}
      type="button"
    >
      <span className="theme-toggle-simple__sun" aria-hidden="true">
        {"\u2600"}
      </span>
      <span className="theme-toggle-simple__moon" aria-hidden="true">
        {"\u263E"}
      </span>
      <span className="sr-only">
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}

