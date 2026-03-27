import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

export function HeaderLogo() {
  const { theme } = useTheme();
  const logoSrc =
    theme === "dark" ? "/images/darkModeLogo.svg" : "/images/logoDarkMode.svg";

  return (
    <Link aria-label="Home" className="header-logo" to="/">
      <img alt="Leon Madara" src={logoSrc} />
    </Link>
  );
}
