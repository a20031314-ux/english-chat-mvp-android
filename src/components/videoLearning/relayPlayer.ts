"use client";

import { getApiBase } from "@/lib/apiBase";
import { turnDiagnosticsEnabled } from "@/lib/platform";

/**
 * A YouTube player that lives one frame further away, for the iOS app.
 *
 * YouTube's embedded player refuses to play (error 153) unless the page that
 * embeds it sends a Referer. The iOS app's pages are served from
 * capacitor://localhost, and WebKit sends no Referer from that scheme to https,
 * so every video failed there while the same code played on Android
 * (https://localhost). This puts the player on our own https page
 * (public/yt-embed.html), which YouTube sees as the embedding site, and talks to
 * it over postMessage.
 *
 * Shaped like the slice of YT.Player that VideoPlayer.tsx uses, so the player
 * logic above it does not care which one it holds. The getters are answered from
 * the page's last report (every 250 ms), with the clock carried forward while
 * playing so segment ends still land on time.
 */
export type RelayOptions = {
  videoId: string;
  autoplay: boolean;
  events: {
    onReady?: () => void;
    onError?: () => void;
    onStateChange?: (event: { data: number }) => void;
  };
};

const PLAYING = 1;

export class RelayPlayer {
  private readonly frame: HTMLIFrameElement;
  private readonly origin: string;
  private readonly events: RelayOptions["events"];
  private ready = false;
  private queue: { fn: string; args: unknown[] }[] = [];
  private time = 0;
  private timeAt = 0;
  private state = -1;
  private duration = 0;
  private readonly onMessage: (event: MessageEvent) => void;

  constructor(host: HTMLElement, options: RelayOptions) {
    const base = getApiBase().replace(/\/+$/, "") || window.location.origin;
    this.origin = new URL(base).origin;
    this.events = options.events;

    const url = new URL("/yt-embed.html", base);
    url.searchParams.set("v", options.videoId);
    url.searchParams.set("autoplay", options.autoplay ? "1" : "0");
    url.searchParams.set("parent", window.location.origin);
    // 진단 빌드(TestFlight diag)에서는 중계 페이지가 재생 시간·음소거·음량을 화면 아래에 보여 준다.
    if (turnDiagnosticsEnabled()) url.searchParams.set("diag", "1");

    const frame = document.createElement("iframe");
    frame.src = url.toString();
    frame.title = "YouTube";
    frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#000";
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(frame);
    this.frame = frame;

    this.onMessage = (event: MessageEvent) => {
      // 보낸 창으로만 확인한다. iOS 웹뷰가 origin 문자열을 어떻게 적든 우리 iframe에서 온 것만 받는다.
      if (event.source !== frame.contentWindow) return;
      const data = event.data as { lbYt?: string; time?: number; state?: number; duration?: number } | null;
      if (!data || typeof data.lbYt !== "string") return;
      if (typeof data.duration === "number" && data.duration > 0) this.duration = data.duration;
      switch (data.lbYt) {
        case "ready":
          this.ready = true;
          for (const command of this.queue) this.post(command.fn, command.args);
          this.queue = [];
          this.events.onReady?.();
          break;
        case "tick":
          if (typeof data.time === "number") {
            this.time = data.time;
            this.timeAt = Date.now();
          }
          if (typeof data.state === "number") this.state = data.state;
          break;
        case "state":
          if (typeof data.state === "number") {
            this.state = data.state;
            this.events.onStateChange?.({ data: data.state });
          }
          break;
        case "error":
          this.events.onError?.();
          break;
      }
    };
    window.addEventListener("message", this.onMessage);
  }

  private post(fn: string, args: unknown[]) {
    try {
      this.frame.contentWindow?.postMessage({ lbYt: "cmd", fn, args }, this.origin);
    } catch {
      // The frame is gone; nothing to tell.
    }
  }

  private command(fn: string, args: unknown[] = []) {
    if (this.ready) this.post(fn, args);
    else this.queue.push({ fn, args });
  }

  playVideo() {
    this.command("playVideo");
  }

  pauseVideo() {
    this.command("pauseVideo");
  }

  seekTo(seconds: number, allowSeekAhead: boolean) {
    this.time = seconds;
    this.timeAt = Date.now();
    this.command("seekTo", [seconds, allowSeekAhead]);
  }

  mute() {
    this.command("mute");
  }

  unMute() {
    this.command("unMute");
  }

  getCurrentTime(): number {
    if (this.state === PLAYING && this.timeAt > 0) {
      // Carried forward between reports, capped so a stalled frame cannot run away.
      return this.time + Math.min(1, (Date.now() - this.timeAt) / 1000);
    }
    return this.time;
  }

  getDuration(): number {
    return this.duration;
  }

  getPlayerState(): number {
    return this.state;
  }

  destroy() {
    window.removeEventListener("message", this.onMessage);
    this.queue = [];
    this.frame.remove();
  }
}
