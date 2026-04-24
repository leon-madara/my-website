import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { siteRoutes } from "./siteData";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

const DOCK_EDGE_PADDING = 16;
const BALL_SIZE = 60;
const SADDLE_SIZE = 84;
const ICON_EXIT_MS = 200;
const SLIDE_MS = 420;
const ICON_REVEAL_MS = 200;
const NAVIGATION_DELAY_MS = ICON_EXIT_MS + SLIDE_MS + ICON_REVEAL_MS;

const springTransition = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.9
};

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const phaseTimersRef = useRef<number[]>([]);
  const [navWidth, setNavWidth] = useState(360);
  const [activePath, setActivePath] = useState(location.pathname);
  const [ballPath, setBallPath] = useState(location.pathname);
  const [ballIconPath, setBallIconPath] = useState<string | null>(location.pathname);
  const [isTraveling, setIsTraveling] = useState(false);

  const routeForPath = (path: string | null) =>
    siteRoutes.find((route) =>
      route.path === "/" ? path === "/" : Boolean(path?.startsWith(route.path))
    ) ?? siteRoutes[0];

  const ballRoute = useMemo(() => routeForPath(ballIconPath), [ballIconPath]);
  const BallIcon = ballRoute.icon;
  const ballIndex = siteRoutes.findIndex((route) => route.path === routeForPath(ballPath).path);
  const itemWidth = Math.max((navWidth - DOCK_EDGE_PADDING * 2) / siteRoutes.length, 0);
  const slotCenterX = DOCK_EDGE_PADDING + (Math.max(ballIndex, 0) + 0.5) * itemWidth;
  const ballX = slotCenterX - BALL_SIZE / 2;
  const saddleX = slotCenterX - SADDLE_SIZE / 2;

  useEffect(() => {
    setActivePath(location.pathname);
    setBallPath(location.pathname);
    setBallIconPath(location.pathname);
    setIsTraveling(false);
  }, [location.pathname]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const syncWidth = () => {
      setNavWidth(nav.offsetWidth);
    };

    syncWidth();

    const observer = new ResizeObserver(syncWidth);
    observer.observe(nav);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      setBallPath(path);
      setBallIconPath(path);
      navigate(path);
      return;
    }

    setActivePath(path);
    setBallIconPath(null);
    setIsTraveling(false);

    phaseTimersRef.current.push(
      window.setTimeout(() => {
        setBallPath(path);
        setIsTraveling(true);
      }, ICON_EXIT_MS)
    );

    phaseTimersRef.current.push(
      window.setTimeout(() => {
        setBallIconPath(path);
        setIsTraveling(false);
      }, ICON_EXIT_MS + SLIDE_MS)
    );

    navigationTimerRef.current = window.setTimeout(() => {
      navigate(path);
    }, NAVIGATION_DELAY_MS);
  };

  return (
    <nav ref={navRef} aria-label="Mobile navigation" className="mobile-bottom-nav">
      {siteRoutes.map((route) => {
        const Icon = route.icon;
        const isUnderBall = isRouteActive(route.path, ballPath);

        return (
          <NavLink
            aria-label={route.title}
            aria-current={isRouteActive(route.path) ? "page" : undefined}
            className={
              isUnderBall ? "mobile-nav-item active" : "mobile-nav-item"
            }
            end={route.path === "/"}
            key={route.path}
            onClick={(event) => handleNavClick(event, route.path)}
            to={route.path}
          >
            <motion.span
              aria-hidden="true"
              className="mobile-nav-item__icon"
              initial={false}
              animate={{
                opacity: isUnderBall ? 0 : 1,
                scale: isUnderBall ? 0.6 : 1,
                y: isUnderBall ? 5 : 0
              }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            >
              <Icon aria-hidden="true" strokeWidth="2" />
            </motion.span>
            <span className="sr-only">{route.title}</span>
          </NavLink>
        );
      })}
      <motion.div
        className="mobile-nav-saddle"
        aria-hidden="true"
        initial={false}
        animate={{ x: saddleX }}
        transition={springTransition}
      />
      <motion.div
        className={["mobile-active-ball", isTraveling ? "is-traveling" : ""].join(" ")}
        aria-hidden="true"
        initial={false}
        animate={{ x: ballX }}
        transition={springTransition}
      >
        <AnimatePresence mode="wait" initial={false}>
          {ballIconPath ? (
            <motion.span
              key={ballRoute.path}
              className="mobile-active-ball__icon"
              initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 25 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <BallIcon aria-hidden="true" strokeWidth="2" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
