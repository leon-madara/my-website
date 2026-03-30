import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

export function HeaderLogo() {
  const location = useLocation();
  const { theme } = useTheme();

  const isDesignProcess = location.pathname === "/design-process";
  const logoSrc = isDesignProcess
    ? theme === "dark"
      ? "/images/logoIconDark.svg"
      : "/images/logoICON.svg"
    : theme === "dark"
      ? "/images/darkModeLogo.svg"
      : "/images/logoDarkMode.svg";

  return (
    <Link aria-label="Home" className="header-logo" to="/">
      <img alt="Leon Madara" src={logoSrc} />
    </Link>
  );
}
