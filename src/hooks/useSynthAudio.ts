const mp3s = {
  soft: new URL("../assets/audio/computerbeep_54.mp3", import.meta.url).href,
  confirm: new URL("../assets/audio/computerbeep_29.mp3", import.meta.url).href,
  alert: new URL("../assets/audio/computerbeep_73.mp3", import.meta.url).href,
  action: new URL("../assets/audio/processing3.mp3", import.meta.url).href,
  transition: new URL("../assets/audio/scrscroll3.mp3", import.meta.url).href,
  archive: new URL("../assets/audio/accessinglibrarycomputerdata_clean.mp3", import.meta.url).href,
};

type AudioVariant = "soft" | "confirm" | "alert" | "action" | "transition" | "archive";

export function useSynthAudio(enabled: boolean) {
  const playSynthFallback = (variant: AudioVariant) => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      // Map frequencies and durations based on variant
      let frequency = 520;
      let duration = 0.12;
      let oscType: OscillatorType = "square";

      if (variant === "alert") {
        frequency = 220;
        duration = 0.36;
      } else if (variant === "confirm") {
        frequency = 740;
        duration = 0.12;
      } else if (variant === "action") {
        frequency = 880;
        duration = 0.22;
        oscType = "sawtooth";
      } else if (variant === "transition") {
        frequency = 440;
        duration = 0.18;
        oscType = "sine";
      } else if (variant === "archive") {
        frequency = 330;
        duration = 0.45;
        oscType = "triangle";
      }

      osc.type = oscType;
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.32, now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
      window.setTimeout(() => void ctx.close().catch(() => {}), (duration + 0.1) * 1000);
    } catch (e) {
      console.error("Synth audio fallback failed:", e);
    }
  };

  const beep = (variant: AudioVariant = "soft") => {
    if (!enabled) return;

    try {
      const url = mp3s[variant];
      if (!url) {
        playSynthFallback(variant);
        return;
      }

      const audio = new Audio(url);
      
      // Control volume conservatively
      if (variant === "alert") {
        audio.volume = 0.22;
      } else if (variant === "archive" || variant === "action") {
        audio.volume = 0.18;
      } else {
        audio.volume = 0.14;
      }

      audio.play().catch((err) => {
        console.warn(`Local MP3 playback blocked or failed for [${variant}], falling back to oscillator:`, err);
        playSynthFallback(variant);
      });
    } catch (err) {
      console.warn(`Failed to initialize HTMLAudioElement for [${variant}], falling back:`, err);
      playSynthFallback(variant);
    }
  };

  return { beep };
}
