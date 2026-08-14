"use client";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.02-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 5h3.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm6.5 0H17a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function SegmentPlayButton({
  ariaLabel,
  playing,
  onPlay,
  tone = "light",
}: {
  ariaLabel: string;
  playing: boolean;
  onPlay: () => void;
  tone?: "light" | "onDark";
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onPlay();
      }}
      aria-label={ariaLabel}
      aria-busy={playing}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition ${
        tone === "onDark"
          ? "border-white/30 bg-white/10 text-white hover:bg-white/15"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      }`}
    >
      {playing ? (
        <PauseIcon className="h-4 w-4" />
      ) : (
        <PlayIcon className="h-4 w-4" />
      )}
    </button>
  );
}
