/**
 * MobileDock — drop-in component.
 *
 * Dependencies (install in your project):
 *   npm i framer-motion lucide-react
 *
 * Usage:
 *   import { MobileDock } from "./MobileDock";
 *   <MobileDock />
 *
 * Dark mode:
 *   Add a `dark` class to any ancestor element to switch the dock to its
 *   dark theme. e.g. <div className="dark"><MobileDock /></div>
 */

import type { FC, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Mail } from "lucide-react";
import "./MobileDock.css";

type BallColor = "black" | "red" | "green";

type IconComponent = FC<{
  size?: number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}>;

type NavItem = {
  id: string;
  label: string;
  Icon: IconComponent;
  color: BallColor;
};

const DiagonalDots: IconComponent = ({ size = 24, strokeWidth = 1.8 }) => {
  const svgProps: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  return (
    <svg {...svgProps}>
      <circle cx="6" cy="18" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="18" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", Icon: Home, color: "black" },
  { id: "about", label: "About", Icon: User, color: "red" },
  { id: "portfolio", label: "Portfolio", Icon: Briefcase, color: "green" },
  { id: "process", label: "Design Process", Icon: DiagonalDots, color: "black" },
  { id: "contact", label: "Contact", Icon: Mail, color: "red" },
];

const DOCK_WIDTH = 360;
const DOCK_HEIGHT = 88;
const BALL_SIZE = 60;
const EDGE_PADDING = 16;
const ITEM_WIDTH = (DOCK_WIDTH - 2 * EDGE_PADDING) / NAV_ITEMS.length;

const CONTAINER_HEIGHT = DOCK_HEIGHT + BALL_SIZE / 2 + 8;
const DOCK_TOP_Y = CONTAINER_HEIGHT - DOCK_HEIGHT;
const BALL_Y = DOCK_TOP_Y - BALL_SIZE / 2;

const slotCenterX = (i: number) => EDGE_PADDING + (i + 0.5) * ITEM_WIDTH;

const ICON_EXIT_MS = 200;
const SLIDE_MS = 560;
const SLIDE_DURATION_S = SLIDE_MS / 1000;
// easeOutQuint — fast at the start, glides smoothly into rest. Reads as a
// physical, fluid slide instead of a stiff spring snap.
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type MobileDockProps = {
  /** Initial active item id. Defaults to the first item. */
  defaultActiveId?: string;
  /** Called whenever the user selects a different item. */
  onChange?: (id: string) => void;
};

export function MobileDock({
  defaultActiveId = NAV_ITEMS[0].id,
  onChange,
}: MobileDockProps = {}) {
  const [activeId, setActiveId] = useState(defaultActiveId);
  const [ballPosId, setBallPosId] = useState(defaultActiveId);
  const [ballIconId, setBallIconId] = useState<string | null>(defaultActiveId);

  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  function clearAllTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function handleSelect(id: string) {
    if (id === activeId) return;

    clearAllTimeouts();
    setActiveId(id);
    setBallIconId(null);
    onChange?.(id);

    timeoutsRef.current.push(
      window.setTimeout(() => setBallPosId(id), ICON_EXIT_MS),
    );
    timeoutsRef.current.push(
      window.setTimeout(
        () => setBallIconId(id),
        ICON_EXIT_MS + SLIDE_MS,
      ),
    );
  }

  const positionIndex = NAV_ITEMS.findIndex((it) => it.id === ballPosId);
  const ballX = slotCenterX(positionIndex) - BALL_SIZE / 2;
  const ballColor = NAV_ITEMS[positionIndex].color;

  const ballIconItem = ballIconId
    ? NAV_ITEMS.find((it) => it.id === ballIconId)
    : undefined;
  const BallIcon = ballIconItem?.Icon;

  return (
    <div
      className="mdock-root"
      style={{ width: DOCK_WIDTH, height: CONTAINER_HEIGHT }}
    >
      <div
        className="mdock-card"
        style={{
          height: DOCK_HEIGHT,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <ul
          className="mdock-list"
          style={{
            paddingLeft: EDGE_PADDING,
            paddingRight: EDGE_PADDING,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isUnderBall = item.id === ballPosId;
            const Icon = item.Icon;
            return (
              <li
                key={item.id}
                className="mdock-item"
                style={{ width: ITEM_WIDTH }}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-label={item.label}
                  aria-pressed={item.id === activeId}
                  className="mdock-button"
                >
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isUnderBall ? 0 : 1,
                      scale: isUnderBall ? 0.6 : 1,
                    }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="mdock-icon-wrap"
                  >
                    <Icon size={24} strokeWidth={1.8} absoluteStrokeWidth />
                  </motion.span>
                </button>
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
          left: 0,
        }}
        initial={false}
        animate={{ x: ballX, y: BALL_Y }}
        transition={{ duration: SLIDE_DURATION_S, ease: SLIDE_EASE }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {BallIcon ? (
            <motion.span
              key={ballIconId}
              initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 25 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mdock-ball-icon-wrap"
            >
              <BallIcon size={26} strokeWidth={2} absoluteStrokeWidth />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
