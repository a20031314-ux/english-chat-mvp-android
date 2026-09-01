export function PointsIcon({ className = "h-3.5 w-3.5 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.35" fill="#e8e8e4" />
      <circle cx="8" cy="8" r="4.2" stroke="#121212" strokeWidth="1.15" />
      <circle cx="8" cy="8" r="1.35" fill="#121212" />
    </svg>
  );
}
