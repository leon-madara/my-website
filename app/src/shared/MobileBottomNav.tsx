import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { siteRoutes } from "./siteData";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const saddleRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const phaseTimersRef = useRef<number[]>([]);
  const [activePath, setActivePath] = useState(location.pathname);
  const [ballIconPath, setBallIconPath] = useState(location.pathname);
  const [isIconHidden, setIsIconHidden] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);

  const activeRoute = useMemo(
    () =>
      siteRoutes.find((route) =>
        route.path === "/"
          ? ballIconPath === "/"
          : ballIconPath.startsWith(route.path)
      ) ?? siteRoutes[0],
    [ballIconPath]
  );

  const ActiveIcon = activeRoute.icon;

  useEffect(() => {
    setActivePath(location.pathname);
    setBallIconPath(location.pathname);
    setIsIconHidden(false);
    setIsTraveling(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navRef.current || !ballRef.current || !saddleRef.current) return;

    const moveChrome = (animate = true) => {
      const activeLink = navRef.current?.querySelector(".mobile-nav-item.active") as HTMLElement;
      if (!activeLink || !ballRef.current || !saddleRef.current) return;

      const ballLeft = activeLink.offsetLeft + activeLink.offsetWidth / 2 - ballRef.current.offsetWidth / 2;
      const saddleLeft = activeLink.offsetLeft + activeLink.offsetWidth / 2 - saddleRef.current.offsetWidth / 2;
      
      if (!animate) {
        ballRef.current.style.transition = "none";
        saddleRef.current.style.transition = "none";
      }
      
      ballRef.current.style.transform = `translateX(${ballLeft}px)`;
      saddleRef.current.style.transform = `translateX(${saddleLeft}px)`;

      if (!animate) {
        ballRef.current.offsetHeight;
        saddleRef.current.offsetHeight;
        ballRef.current.style.transition = "";
        saddleRef.current.style.transition = "";
      }
    };

    const frame = requestAnimationFrame(() => moveChrome(false));

    const handleResize = () => {
      requestAnimationFrame(() => moveChrome(false));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [activePath]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
      }
      phaseTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (location.pathname.startsWith("/portfolio")) {
    return null;
  }

  const clearTimers = () => {
    if (navigationTimerRef.current) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }

    phaseTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    phaseTimersRef.current = [];
  };

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isRouteActive = (path: string, currentPath = activePath) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (isRouteActive(path, location.pathname)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    clearTimers();

    if (prefersReducedMotion()) {
      setActivePath(path);
      setBallIconPath(path);
      navigate(path);
      return;
    }

    setIsIconHidden(true);

    phaseTimersRef.current.push(
      window.setTimeout(() => {
        setIsTraveling(true);
        setActivePath(path);
      }, 120)
    );

    phaseTimersRef.current.push(
      window.setTimeout(() => {
        setBallIconPath(path);
        setIsTraveling(false);
        setIsIconHidden(false);
      }, 500)
    );

    navigationTimerRef.current = window.setTimeout(() => {
      navigate(path);
    }, 650);
  };

  return (
    <nav ref={navRef} aria-label="Mobile navigation" className="mobile-bottom-nav">
      {siteRoutes.map((route) => {
        const Icon = route.icon;

        return (
          <NavLink
            aria-label={route.title}
            aria-current={isRouteActive(route.path) ? "page" : undefined}
            className={
              isRouteActive(route.path) ? "mobile-nav-item active" : "mobile-nav-item"
            }
            end={route.path === "/"}
            key={route.path}
            onClick={(event) => handleNavClick(event, route.path)}
            to={route.path}
          >
            <Icon aria-hidden="true" strokeWidth="2" />
            <span className="sr-only">{route.title}</span>
          </NavLink>
        );
      })}
      <div ref={saddleRef} className="mobile-nav-saddle" aria-hidden="true" />
      <div
        ref={ballRef}
        className={[
          "mobile-active-ball",
          isIconHidden ? "is-icon-hidden" : "",
          isTraveling ? "is-traveling" : ""
        ].join(" ")}
        aria-hidden="true"
      >
        <ActiveIcon aria-hidden="true" strokeWidth="2" />
      </div>
    </nav>
  );
}
