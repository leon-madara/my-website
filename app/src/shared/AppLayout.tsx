import { useLayoutEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { siteConfig } from "../siteConfig";
import { DecorativeBackground } from "./DecorativeBackground";
import { HeaderLogo } from "./HeaderLogo";
import { MobileBottomNav } from "./MobileBottomNav";
import { PrimaryNav } from "./PrimaryNav";
import { ProfileSidebar } from "./ProfileSidebar";
import { SiteFooter } from "./SiteFooter";
import { ThemeToggle } from "./ThemeToggle";

export function AppLayout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const showSidebar = location.pathname === "/";

  useLayoutEffect(() => {
    const routeClass =
      location.pathname === "/"
        ? "home-page"
          : location.pathname.startsWith("/portfolio")
            ? "portfolio-page"
            : location.pathname === "/design-process"
              ? "design-process-page"
              : location.pathname === "/contact"
                ? "contact-page"
                : "about-page";

    document.body.classList.remove(
      "home-page",
      "about-page",
      "contact-page",
      "portfolio-page",
      "design-process-page"
    );
    document.body.classList.add(routeClass);

    // Always restore nav visibility when navigating away from portfolio
    if (!location.pathname.startsWith("/portfolio")) {
      document.body.classList.remove("nav-is-collapsed", "nav-is-hovered");
    }

    return () => {
      document.body.classList.remove(routeClass);
    };
  }, [location.pathname]);

  return (
    <div
      className={
        showSidebar
          ? "app-shell app-shell--with-sidebar"
          : "app-shell"
      }
    >
      <Helmet>
        <meta name="author" content={siteConfig.name} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#006b3f" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:image:secure_url" content={siteConfig.defaultImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteConfig.twitterHandle} />
      </Helmet>
      <HeaderLogo />
      <PrimaryNav />
      <ThemeToggle />
      <ProfileSidebar />
      <main className="site-main">
        <div className="sr-only" aria-atomic="true" aria-live="polite">
          Motion: {prefersReducedMotion ? "Reduced" : "Full"}
        </div>
        <Outlet />
      </main>
      <SiteFooter />
      <MobileBottomNav />
      <DecorativeBackground />
    </div>
  );
}
