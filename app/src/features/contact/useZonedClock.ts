import { useEffect, useMemo, useState } from "react";

interface ZonedClockOptions {
  timeZone: string;
  intervalMs?: number;
}

function formatTime(timeZone: string, date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone
  }).format(date);
}

export function useZonedClock({ timeZone, intervalMs = 60_000 }: ZonedClockOptions) {
  const [now, setNow] = useState(() => new Date());
  const formatted = useMemo(() => formatTime(timeZone, now), [now, timeZone]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [intervalMs]);

  return formatted;
}

