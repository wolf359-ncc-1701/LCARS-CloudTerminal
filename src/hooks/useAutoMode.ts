import { useEffect, useRef, useState } from "react";
import type { Mode } from "../types";

const autoModes: Mode[] = ["bridge", "home", "energy", "memory"];

export function useAutoMode(enabled: boolean, onModeChange: (mode: Mode) => void) {
  const [isAutoActive, setIsAutoActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const cycleRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (cycleRef.current) window.clearInterval(cycleRef.current);
      timerRef.current = null;
      cycleRef.current = null;
    };

    const arm = () => {
      clearTimers();
      setIsAutoActive(false);

      if (!enabled) return;

      timerRef.current = window.setTimeout(() => {
        setIsAutoActive(true);
        cycleRef.current = window.setInterval(() => {
          onModeChange(autoModes[Math.floor(Math.random() * autoModes.length)]);
        }, 9000);
      }, 60000);
    };

    const activityEvents = ["pointerdown", "keydown", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, arm, { passive: true }));
    arm();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, arm));
      clearTimers();
    };
  }, [enabled, onModeChange]);

  return isAutoActive;
}

