import { NavLink, useLocation } from "react-router-dom";
import { siteRoutes } from "./siteData";
import { useEffect, useRef } from "react";

export function MobileBottomNav() {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Position the Limelight indicator
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    const moveLimelight = (animate = true) => {
      const activeLink = navRef.current?.querySelector(".mobile-nav-item.active") as HTMLElement;
      if (!activeLink || !indicatorRef.current) return;

      const left = activeLink.offsetLeft + activeLink.offsetWidth / 2 - indicatorRef.current.offsetWidth / 2;
      
      if (!animate) {
        indicatorRef.current.style.transition = "none";
      } else {
        indicatorRef.current.style.transition = "left 400ms ease-in-out";
      }
      
      indicatorRef.current.style.left = `${left}px`;
    };

    // Give the DOM a tiny bit of time to settle measurements
    const timer = setTimeout(() => moveLimelight(true), 10);

    const handleResize = () => {
      requestAnimationFrame(() => moveLimelight(false));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [location.pathname]);

  if (location.pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <nav ref={navRef} aria-label="Mobile navigation" className="mobile-bottom-nav">
      {siteRoutes.map((route) => {
        const Icon = route.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
            end={route.path === "/"}
            key={route.path}
            to={route.path}
          >
            <Icon aria-hidden="true" strokeWidth="2" />
            <span className="sr-only">{route.title}</span>
          </NavLink>
        );
      })}
      {/* Limelight indicator structure */}
      <div ref={indicatorRef} className="limelight-indicator">
        <div className="limelight-gradient"></div>
      </div>
    </nav>
  );
}
