import { useState, useEffect } from "react";
import type { VisualMode } from "../types";

export function usePersistentSettings() {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem("lcars_audio_enabled");
    return stored === null ? true : stored === "true";
  });

  const [visual, setVisual] = useState<VisualMode>(() => {
    const stored = localStorage.getItem("lcars_visual_mode");
    return (stored as VisualMode) || "default";
  });

  useEffect(() => {
    localStorage.setItem("lcars_audio_enabled", String(audioEnabled));
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem("lcars_visual_mode", visual);
  }, [visual]);

  return {
    audioEnabled,
    setAudioEnabled,
    visual,
    setVisual,
  };
}
