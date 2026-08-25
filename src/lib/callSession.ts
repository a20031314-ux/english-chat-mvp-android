export type CallPhase = "idle" | "calling" | "connected";

export type ChatCallEvent = {
  kind: "ended";
  durationSeconds: number;
};

export function formatCallDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
