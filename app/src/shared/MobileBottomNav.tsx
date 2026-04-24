import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { siteRoutes } from "./siteData";
import "./MobileDock.css";

type BallColor = "black" | "red" | "green";

const DEFAULT_DOCK_WIDTH = 360;
const DOCK_HEIGHT = 88;
const BALL_SIZE = 60;
const EDGE_PADDING = 16;

const CONTAINER_HEIGHT = DOCK_HEIGHT + BALL_SIZE / 2 + 8;
const DOCK_TOP_Y = CONTAINER_HEIGHT - DOCK_HEIGHT;
const BALL_Y = DOCK_TOP_Y + (DOCK_HEIGHT - BALL_SIZE) / 2;

const ICON_EXIT_MS = 200;
const SLIDE_MS = 420;
const ICON_REVEAL_MS = 200;
const NAVIGATION_DELAY_MS = ICON_EXIT_MS + SLIDE_MS + ICON_REVEAL_MS;

const ROUTE_COLORS: Record<string, BallColor> = {
  "/": "black",
  "/about": "red",
  "/portfolio": "green",
  "/design-process": "black",
  "/contact": "red"
};

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const phaseTimersRef = useRef<number[]>([]);
  const [activePath, setActivePath] = useState(location.pathname);
  const [ballPosPath, setBallPosPath] = useState(location.pathname);
  const [ballIconPath, setBallIconPath] = useState<string | null>(location.pathname);
  const [dockWidth, setDockWidth] = useState(DEFAULT_DOCK_WIDTH);
  const itemWidth = Math.max((dockWidth - 2 * EDGE_PADDING) / siteRoutes.length, 0);

  const routeForPath = (path: string | null) =>
    siteRoutes.find((route) =>
      route.path === "/" ? path === "/" : Boolean(path?.startsWith(route.path))
    ) ?? siteRoutes[0];

  const ballRoute = useMemo(() => routeForPath(ballIconPath), [ballIconPath]);
  const BallIcon = ballRoute.icon;
  const positionIndex = siteRoutes.findIndex(
    (route) => route.path === routeForPath(ballPosPath).path
  );
  const ballX =
    EDGE_PADDING + (Math.max(positionIndex, 0) + 0.5) * itemWidth - BALL_SIZE / 2;
  const ballColor = ROUTE_COLORS[routeForPath(ballPosPath).path] ?? "green";

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return undefined;

    const updateDockWidth = () => {
      setDockWidth(navElement.getBoundingClientRect().width || DEFAULT_DOCK_WIDTH);
    };

    updateDockWidth();

    const observer = new ResizeObserver(updateDockWidth);
    observer.observe(navElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
    setBallPosPath(location.pathname);
    setBallIconPath(location.pathname);
  }, [location.pathname]);

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
      setBallPosPath(path);
      setBallIconPath(path);
      navigate(path);
      return;
    }

    setActivePath(path);
    setBallIconPath(null);

    phaseTimersRef.current.push(
      window.setTimeout(() => setBallPosPath(path), ICON_EXIT_MS)
    );

    phaseTimersRef.current.push(
      window.setTimeout(
        () => setBallIconPath(path),
        ICON_EXIT_MS + SLIDE_MS
      )
    );

    navigationTimerRef.current = window.setTimeout(() => {
      navigate(path);
    }, NAVIGATION_DELAY_MS);
  };

  return (
    <nav ref={navRef} aria-label="Mobile navigation" className="mobile-bottom-nav">
      <div
        className="mdock-root"
        style={{ width: "100%", height: CONTAINER_HEIGHT }}
      >
        <div
          className="mdock-card"
          style={{
            height: DOCK_HEIGHT,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
          }}
        >
          <ul
            className="mdock-list"
            style={{
              paddingLeft: EDGE_PADDING,
              paddingRight: EDGE_PADDING
            }}
          >
            {siteRoutes.map((route) => {
              const isUnderBall = isRouteActive(route.path, ballPosPath);
              const Icon = route.icon;

              return (
                <li
                  key={route.path}
                  className="mdock-item"
                  style={{ width: itemWidth }}
                >
                  <NavLink
                    aria-label={route.title}
                    aria-current={isRouteActive(route.path) ? "page" : undefined}
                    aria-pressed={isRouteActive(route.path)}
                    className="mdock-button"
                    end={route.path === "/"}
                    onClick={(event) => handleNavClick(event, route.path)}
                    to={route.path}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        opacity: isUnderBall ? 0 : 1,
                        scale: isUnderBall ? 0.6 : 1
                      }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="mdock-icon-wrap"
                    >
                      <Icon aria-hidden="true" height={24} strokeWidth={1.8} width={24} />
                    </motion.span>
                    <span className="sr-only">{route.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <motion.div
          aria-hidden="true"
          data-ball-color={ballColor}
          className="mdock-ball"
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            top: 0,
            left: 0
          }}
          initial={false}
          animate={{ x: ballX, y: BALL_Y }}
          transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {ballIconPath ? (
              <motion.span
                key={ballIconPath}
                initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.4, rotate: 25 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="mdock-ball-icon-wrap"
              >
                <BallIcon aria-hidden="true" height={26} strokeWidth={2} width={26} />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </nav>
  );
}
