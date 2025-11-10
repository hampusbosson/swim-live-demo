/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

export const useStopwatch = (isActive: boolean | undefined, startTimestamp?: number | null) => {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !startTimestamp) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setElapsed(0);
      return;
    }

    const tick = () => {
      setElapsed((Date.now() - startTimestamp) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, startTimestamp]);

  return { elapsed, setElapsed, rafRef };
};