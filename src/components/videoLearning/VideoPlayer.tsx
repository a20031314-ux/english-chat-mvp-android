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
  play: () => void;
  pause: () => void;
  /** Seek to start, play until end, then pause. */
  playSegment: (start: number, end: number) => void;
};

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  unMute?: () => void;
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
            onStateChange?: (event: { data: number }) => void;
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
    autoPlay?: boolean;
    onTimeUpdate: (seconds: number) => void;
    onEnded?: () => void;
    onSegmentEnd?: () => void;
  }
>(function VideoPlayer(
  {
    videoId,
    active,
    durationHint,
    autoPlay = false,
    onTimeUpdate,
    onEnded,
    onSegmentEnd,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const clockRef = useRef(0);
  const playingRef = useRef(false);
  const endedFiredRef = useRef(false);
  /** Exclusive end time for clip playback; null = normal play. */
  const segmentEndRef = useRef<number | null>(null);
  const segmentTokenRef = useRef(0);
  const segmentTimerRef = useRef<number | null>(null);
  /** After a clip stop, ignore YT "still playing" sync briefly. */
  const suppressYtPlaySyncUntilRef = useRef(0);
  const onTimeRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  const onSegmentEndRef = useRef(onSegmentEnd);
  onTimeRef.current = onTimeUpdate;
  onEndedRef.current = onEnded;
  onSegmentEndRef.current = onSegmentEnd;

  const [playing, setPlaying] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const duration = Math.max(durationHint, 70);

  const clearSegmentTimer = useCallback(() => {
    if (segmentTimerRef.current != null) {
      window.clearTimeout(segmentTimerRef.current);
      segmentTimerRef.current = null;
    }
  }, []);

  const emitTime = useCallback(
    (seconds: number) => {
      const next = Math.max(0, Math.min(seconds, duration));
      clockRef.current = next;
      setDisplayTime(next);
      onTimeRef.current(next);
    },
    [duration],
  );

  const finishSegment = useCallback(
    (endAt: number | null) => {
      clearSegmentTimer();
      const hadSegment = segmentEndRef.current != null;
      segmentEndRef.current = null;
      playingRef.current = false;
      setPlaying(false);
      suppressYtPlaySyncUntilRef.current = Date.now() + 800;
      try {
        playerRef.current?.pauseVideo();
        if (endAt != null) {
          playerRef.current?.seekTo(endAt, true);
          emitTime(endAt);
        }
      } catch {
        // ignore
      }
      if (hadSegment) onSegmentEndRef.current?.();
    },
    [clearSegmentTimer, emitTime],
  );

  const pause = useCallback(() => {
    clearSegmentTimer();
    segmentTokenRef.current += 1;
    const hadSegment = segmentEndRef.current != null;
    const endAt = segmentEndRef.current;
    segmentEndRef.current = null;
    playingRef.current = false;
    setPlaying(false);
    suppressYtPlaySyncUntilRef.current = Date.now() + 400;
    try {
      playerRef.current?.pauseVideo();
      if (hadSegment && endAt != null) {
        playerRef.current?.seekTo(endAt, true);
        emitTime(endAt);
      }
    } catch {
      // ignore
    }
    if (hadSegment) onSegmentEndRef.current?.();
  }, [clearSegmentTimer, emitTime]);

  const play = useCallback(() => {
    clearSegmentTimer();
    segmentTokenRef.current += 1;
    segmentEndRef.current = null;
    endedFiredRef.current = false;
    suppressYtPlaySyncUntilRef.current = 0;
    playingRef.current = true;
    setPlaying(true);
    try {
      playerRef.current?.unMute?.();
      playerRef.current?.playVideo();
    } catch {
      // ignore
    }
  }, [clearSegmentTimer]);

  const seekTo = useCallback(
    (seconds: number) => {
      endedFiredRef.current = false;
      emitTime(seconds);
      try {
        playerRef.current?.seekTo(seconds, true);
      } catch {
        // ignore
      }
    },
    [emitTime],
  );

  const playSegment = useCallback(
    (start: number, end: number) => {
      clearSegmentTimer();
      const safeStart = Math.max(0, start);
      const rawEnd = Number.isFinite(end) ? end : safeStart + 3;
      // Allow multi-cue ranges; still hard-cap runaway endTimes.
      const safeEnd = Math.min(
        Math.max(safeStart + 0.45, rawEnd),
        safeStart + 180,
      );

      const token = segmentTokenRef.current + 1;
      segmentTokenRef.current = token;
      segmentEndRef.current = safeEnd;
      endedFiredRef.current = false;
      suppressYtPlaySyncUntilRef.current = 0;
      emitTime(safeStart);
      playingRef.current = true;
      setPlaying(true);

      try {
        const player = playerRef.current;
        player?.unMute?.();
        player?.seekTo(safeStart, true);
        window.setTimeout(() => {
          if (segmentTokenRef.current !== token) return;
          try {
            player?.playVideo();
          } catch {
            // ignore
          }
        }, 100);
      } catch {
        // ignore
      }

      // Backup stop — don't rely only on time polling (YT can lag).
      const budgetMs = Math.ceil((safeEnd - safeStart) * 1000) + 250;
      segmentTimerRef.current = window.setTimeout(() => {
        if (segmentTokenRef.current !== token) return;
        if (segmentEndRef.current == null) return;
        finishSegment(safeEnd);
      }, budgetMs);
    },
    [clearSegmentTimer, emitTime, finishSegment],
  );

  useImperativeHandle(
    ref,
    () => ({ seekTo, play, pause, playSegment }),
    [seekTo, play, pause, playSegment],
  );

  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;
    endedFiredRef.current = false;

    void (async () => {
      try {
        await loadYouTubeApi();
        if (cancelled || !hostRef.current || !window.YT?.Player) return;
        let player!: YtPlayer;
        player = new window.YT.Player(hostRef.current, {
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
            autoplay: autoPlayRef.current ? 1 : 0,
          },
          events: {
            onReady: () => {
              if (!autoPlayRef.current) return;
              try {
                player.playVideo();
                playingRef.current = true;
                setPlaying(true);
              } catch {
                // user gesture may still be required
              }
            },
            onStateChange: (event) => {
              if (event.data === 0 && !endedFiredRef.current) {
                endedFiredRef.current = true;
                playingRef.current = false;
                setPlaying(false);
                segmentEndRef.current = null;
                clearSegmentTimer();
                onEndedRef.current?.();
              }
            },
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
      clearSegmentTimer();
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [videoId, clearSegmentTimer]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      try {
        const t = playerRef.current?.getCurrentTime();
        const state = playerRef.current?.getPlayerState();
        if (typeof t === "number" && Number.isFinite(t)) {
          clockRef.current = t;
          setDisplayTime(t);
          onTimeRef.current(t);

          const segmentEnd = segmentEndRef.current;
          if (segmentEnd != null && t >= segmentEnd - 0.08) {
            finishSegment(segmentEnd);
            return;
          }
        }

        const suppressPlaySync = Date.now() < suppressYtPlaySyncUntilRef.current;
        if (state === 1 && !playingRef.current && !suppressPlaySync) {
          // User pressed YT native play — leave segment mode.
          if (segmentEndRef.current == null) {
            playingRef.current = true;
            setPlaying(true);
          }
        } else if (
          (state === 2 || state === 0) &&
          playingRef.current &&
          segmentEndRef.current == null
        ) {
          playingRef.current = false;
          setPlaying(false);
        }

        if (state === 0 && !endedFiredRef.current) {
          endedFiredRef.current = true;
          segmentEndRef.current = null;
          clearSegmentTimer();
          onEndedRef.current?.();
        }
      } catch {
        // ignore
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [videoId, finishSegment, clearSegmentTimer]);

  useEffect(() => {
    if (active) return;
    pause();
  }, [active, pause]);

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

      const segmentEnd = segmentEndRef.current;
      if (segmentEnd != null && next >= segmentEnd - 0.08) {
        finishSegment(segmentEnd);
        return;
      }

      if (segmentEndRef.current == null && next >= duration - 0.15) {
        if (!endedFiredRef.current) {
          endedFiredRef.current = true;
          playingRef.current = false;
          setPlaying(false);
          try {
            playerRef.current?.pauseVideo();
          } catch {
            // ignore
          }
          onEndedRef.current?.();
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration, emitTime, finishSegment]);

  const togglePlay = () => {
    if (playingRef.current) pause();
    else play();
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
