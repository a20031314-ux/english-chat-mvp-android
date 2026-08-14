"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { formatSubtitleTime } from "@/lib/videoLearning";

export type VideoPlayerHandle = {
  seekTo: (seconds: number) => void;
};

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          width: string;
          height: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady?: () => void;
            onError?: () => void;
          };
        },
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    let settled = false;
    const succeed = () => {
      if (settled || !window.YT?.Player) return;
      settled = true;
      resolve();
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      youtubeApiPromise = null;
      reject(new Error("YT"));
    };
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      succeed();
    };
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = fail;
      document.head.appendChild(script);
    }
    window.setTimeout(() => {
      if (window.YT?.Player) succeed();
      else fail();
    }, 4000);
  });
  return youtubeApiPromise;
}

export const VideoPlayer = forwardRef<
  VideoPlayerHandle,
  {
    videoId: string;
    active: boolean;
    durationHint: number;
    onTimeUpdate: (seconds: number) => void;
  }
>(function VideoPlayer(
  { videoId, active, durationHint, onTimeUpdate },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const clockRef = useRef(0);
  const playingRef = useRef(false);
  const onTimeRef = useRef(onTimeUpdate);
  onTimeRef.current = onTimeUpdate;

  const [playing, setPlaying] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const duration = Math.max(durationHint, 70);

  const emitTime = useCallback(
    (seconds: number) => {
      const next = Math.max(0, Math.min(seconds, duration));
      clockRef.current = next;
      setDisplayTime(next);
      onTimeRef.current(next);
    },
    [duration],
  );

  const seekTo = useCallback(
    (seconds: number) => {
      emitTime(seconds);
      try {
        playerRef.current?.seekTo(seconds, true);
      } catch {
        // ignore
      }
    },
    [emitTime],
  );

  useImperativeHandle(ref, () => ({ seekTo }), [seekTo]);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    void (async () => {
      try {
        await loadYouTubeApi();
        if (cancelled || !hostRef.current || !window.YT?.Player) return;
        const player = new window.YT.Player(hostRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
            enablejsapi: 1,
            controls: 1,
          },
          events: {
            onError: () => {
              // keep mock transport
            },
          },
        });
        playerRef.current = player;
      } catch {
        // mock transport still works
      }
    })();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      try {
        const t = playerRef.current?.getCurrentTime();
        const state = playerRef.current?.getPlayerState();
        if (typeof t === "number" && Number.isFinite(t)) {
          clockRef.current = t;
          setDisplayTime(t);
          onTimeRef.current(t);
        }
        if (state === 1 && !playingRef.current) {
          playingRef.current = true;
          setPlaying(true);
        } else if ((state === 2 || state === 0) && playingRef.current) {
          playingRef.current = false;
          setPlaying(false);
        }
      } catch {
        // ignore
      }
    }, 400);
    return () => window.clearInterval(timer);
  }, [videoId]);

  useEffect(() => {
    if (active) return;
    playingRef.current = false;
    setPlaying(false);
    try {
      playerRef.current?.pauseVideo();
    } catch {
      // ignore
    }
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let next = clockRef.current + dt;
      try {
        const ytTime = playerRef.current?.getCurrentTime();
        if (typeof ytTime === "number" && Number.isFinite(ytTime)) {
          next = ytTime;
        }
      } catch {
        // keep local clock
      }
      emitTime(next);
      if (next >= duration) {
        playingRef.current = false;
        setPlaying(false);
        try {
          playerRef.current?.pauseVideo();
        } catch {
          // ignore
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration, emitTime]);

  const togglePlay = () => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    try {
      if (next) playerRef.current?.playVideo();
      else playerRef.current?.pauseVideo();
    } catch {
      // ignore
    }
  };

  return (
    <div className="shrink-0 bg-slate-950">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full">
          <div ref={hostRef} className="h-full w-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-white/90 hover:bg-white/10"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={Math.min(displayTime, duration)}
          onChange={(event) => seekTo(Number(event.target.value))}
          className="min-w-0 flex-1 accent-white"
          aria-label="Seek"
        />
        <span className="shrink-0 text-[11px] tabular-nums text-white/70">
          {formatSubtitleTime(displayTime)}
        </span>
      </div>
    </div>
  );
});
