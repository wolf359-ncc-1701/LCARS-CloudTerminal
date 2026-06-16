import React, { createContext, useContext } from "react";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useSynthAudio } from "../../hooks/useSynthAudio";
import type { VisualMode } from "../../types";

interface LcarsContextProps {
  audioEnabled: boolean;
  setAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  visual: VisualMode;
  setVisual: React.Dispatch<React.SetStateAction<VisualMode>>;
  beep: (variant?: "soft" | "confirm" | "alert") => void;
}

const LcarsContext = createContext<LcarsContextProps | undefined>(undefined);

export const LcarsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { audioEnabled, setAudioEnabled, visual, setVisual } = usePersistentSettings();
  const { beep } = useSynthAudio(audioEnabled);

  return (
    <LcarsContext.Provider
      value={{
        audioEnabled,
        setAudioEnabled,
        visual,
        setVisual,
        beep,
      }}
    >
      {children}
    </LcarsContext.Provider>
  );
};

export const useLcars = () => {
  const context = useContext(LcarsContext);
  if (!context) {
    throw new Error("useLcars must be used within LcarsProvider");
  }
  return context;
};
