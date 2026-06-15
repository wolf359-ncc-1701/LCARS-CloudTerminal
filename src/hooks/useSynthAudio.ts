export function useSynthAudio(enabled: boolean) {
  const beep = (variant: "soft" | "confirm" | "alert" = "soft") => {
    if (!enabled) return;

    const AudioContextClass =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const frequency = variant === "alert" ? 220 : variant === "confirm" ? 740 : 520;
    const duration = variant === "alert" ? 0.36 : 0.12;

    osc.type = "square";
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.32, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
    window.setTimeout(() => void ctx.close(), (duration + 0.1) * 1000);
  };

  return { beep };
}
