import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";
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
