import { useEffect, useMemo, useState } from "react";

export function useMockTelemetry(count = 28) {
  const seed = useMemo(
    () => Array.from({ length: count }, () => Math.round(Math.random() * 84 + 8)),
    [count],
  );
  const [values, setValues] = useState(seed);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValues((current) =>
        current.map((value, index) => {
          const wave = Math.sin(Date.now() / 700 + index) * 10;
          const jitter = Math.random() * 16 - 8;
          return Math.max(4, Math.min(100, Math.round(value * 0.72 + wave + jitter + 20)));
        }),
      );
    }, 1600);

    return () => window.clearInterval(id);
  }, []);

  return values;
}

