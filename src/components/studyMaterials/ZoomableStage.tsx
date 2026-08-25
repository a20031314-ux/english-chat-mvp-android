"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.2;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function touchDistance(a: Touch, b: Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export function ZoomableStage({
  children,
  zoomInLabel,
  zoomOutLabel,
}: {
  children: ReactNode;
  zoomInLabel: string;
  zoomOutLabel: string;
}) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  zoomRef.current = zoom;

  const applyZoom = useCallback((next: number) => {
    setZoom(clampZoom(next));
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.12 : 0.12;
      setZoom((prev) => clampZoom(prev + delta));
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) {
        pinchRef.current = null;
        return;
      }
      pinchRef.current = {
        distance: touchDistance(event.touches[0], event.touches[1]),
        zoom: zoomRef.current,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const pinch = pinchRef.current;
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const distance = touchDistance(event.touches[0], event.touches[1]);
      if (pinch.distance < 8) return;
      setZoom(clampZoom(pinch.zoom * (distance / pinch.distance)));
    };

    const onTouchEnd = () => {
      if (!pinchRef.current) return;
      pinchRef.current = null;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);
    root.addEventListener("touchcancel", onTouchEnd);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[#080808]"
      >
        <div
          className="relative origin-top-left"
          style={{ width: `${zoom * 100}%` }}
        >
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute right-3 bottom-16 z-10 flex flex-col gap-1">
        <button
          type="button"
          aria-label={zoomInLabel}
          onClick={() => applyZoom(zoom + 0.25)}
          disabled={zoom >= MAX_ZOOM}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#121212]/90 text-lg font-medium text-slate-100 shadow disabled:text-slate-500"
        >
          +
        </button>
        <button
          type="button"
          aria-label={zoomOutLabel}
          onClick={() => applyZoom(zoom - 0.25)}
          disabled={zoom <= MIN_ZOOM}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#121212]/90 text-lg font-medium text-slate-100 shadow disabled:text-slate-500"
        >
          −
        </button>
      </div>
    </div>
  );
}
