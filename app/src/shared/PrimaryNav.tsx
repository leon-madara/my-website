import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { siteRoutes } from "./siteData";

interface IndicatorState {
  left: number;
  width: number;
  ready: boolean;
}

export function PrimaryNav() {
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false
  });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    const activePath = location.pathname.startsWith("/portfolio")
      ? "/portfolio"
      : location.pathname || "/";
    const activeLink = linkRefs.current.get(activePath);
    if (!activeLink) {
      return;
    }

    let rafId: number;

    const updateIndicator = () => {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      // If the nav hasn't painted yet (zero dimensions), retry next frame
      if (navRect.width === 0) {
        rafId = requestAnimationFrame(updateIndicator);
        return;
      }

      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        ready: true
      });
    };

    rafId = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [location.pathname]);

  return (
    <nav aria-label="Primary" className="nav-pills" ref={navRef}>
      <div
        className="indicator"
        style={{
          opacity: indicator.ready ? 1 : 0,
          left: indicator.left,
          width: indicator.width
        }}
      />
      {siteRoutes.map((route) => {
        const Icon = route.icon;

        return (
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            end={route.path === "/"}
            key={route.path}
            ref={(element) => {
              if (element) {
                linkRefs.current.set(route.path, element);
              } else {
                linkRefs.current.delete(route.path);
              }
            }}
            to={route.path}
          >
            <Icon aria-hidden="true" strokeWidth="2" />
            <span className="label">{route.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
