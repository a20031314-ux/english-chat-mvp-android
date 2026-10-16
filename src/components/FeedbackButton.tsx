"use client";

import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { apiUrl } from "@/lib/apiBase";
import { appVersion } from "@/lib/appVersion";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  dataUrlBytes,
  FEEDBACK_IMAGE_MAX_BYTES,
  FEEDBACK_IMAGE_MAX_WIDTH,
  FEEDBACK_NOTE_MAX,
  isFeedbackTab,
} from "@/lib/feedback";
import { useLearningLanguage } from "@/contexts/LearningLanguageContext";
import { BodyLayer } from "@/components/FullScreenLayer";

/**
 * 의견 보내기: from any screen, a note and a picture of the screen they were
 * looking at, in two taps. The picture is taken before the sheet opens, so it
 * shows what bothered them rather than the sheet; they can leave it out, or
 * pick another one from their photos.
 *
 * Read and sorted later (common, one-off, urgent) by the person who runs the
 * app — see scripts/feedback-pull.mjs.
 */

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** Re-encode as a JPEG no wider than the limit and no larger than the byte budget. */
async function shrink(source: string): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = source;
  });
  const scale = Math.min(1, FEEDBACK_IMAGE_MAX_WIDTH / Math.max(1, image.naturalWidth));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) return "";
  context.fillStyle = "#050505";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.72, 0.6, 0.48, 0.36]) {
    const out = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(out) <= FEEDBACK_IMAGE_MAX_BYTES) return out;
  }
  return "";
}

async function captureScreen(): Promise<string> {
  try {
    const { toJpeg } = await import("html-to-image");
    const raw = await toJpeg(document.body, {
      quality: 0.8,
      pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      backgroundColor: "#050505",
      skipFonts: true,
      imagePlaceholder: TRANSPARENT_PIXEL,
      // Players and frames from other sites cannot be drawn, and the button
      // itself says nothing about the screen.
      filter: (node) =>
        !(node instanceof HTMLIFrameElement) &&
        !(node instanceof HTMLVideoElement) &&
        !(node instanceof HTMLElement && node.dataset.feedbackSkip === "1"),
    });
    return await shrink(raw);
  } catch {
    return "";
  }
}

async function readPhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    return await shrink(url);
  } catch {
    return "";
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Status = "idle" | "sending" | "sent" | "failed" | "limit";

export function FeedbackButton({ ui, locale, tab }: { ui: UICopy; locale: string; tab: string }) {
  const { targetLanguage } = useLearningLanguage();
  const [open, setOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [screen, setScreen] = useState("");
  const [photo, setPhoto] = useState("");
  const [attachScreen, setAttachScreen] = useState(true);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "sent") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);

  const start = async () => {
    setCapturing(true);
    const shot = await captureScreen();
    setScreen(shot);
    setAttachScreen(Boolean(shot));
    setPhoto("");
    setNote("");
    setStatus("idle");
    setCapturing(false);
    setOpen(true);
  };

  const image = photo || (attachScreen ? screen : "");
  const canSend = (note.trim().length > 0 || Boolean(image)) && status !== "sending";

  const send = async () => {
    setStatus("sending");
    try {
      const response = await fetch(apiUrl("/api/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders() },
        body: JSON.stringify({
          note: note.trim(),
          image,
          tab: isFeedbackTab(tab) ? tab : "other",
          uiLocale: locale,
          learningLanguage: targetLanguage,
          appVersion: appVersion(),
          platform: Capacitor.isNativePlatform() ? "android" : "web",
        }),
      });
      if (response.status === 429) return setStatus("limit");
      if (!response.ok) return setStatus("failed");
      setStatus("sent");
      setOpen(false);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <>
      <button
        type="button"
        data-feedback-skip="1"
        onClick={() => void start()}
        disabled={capturing}
        aria-label={ui.feedbackOpen}
        title={ui.feedbackOpen}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 disabled:opacity-60"
      >
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M4 4.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3.5 3v-3H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
          <path d="M7 8.5h6M7 11h4" strokeLinecap="round" />
        </svg>
      </button>
      {/* On the body: the top bar blurs what is behind it, which makes it the
          frame for anything fixed inside it, and the sheet was cut to its height. */}
      <BodyLayer>
      {status === "sent" ? (
        <div
          role="status"
          className="fixed inset-x-0 top-[calc(3.25rem+env(safe-area-inset-top,0px))] z-[90] mx-auto w-fit max-w-[90%] rounded-full border border-white/15 bg-[#1a1a1a] px-4 py-2 text-[12px] text-slate-100 shadow-lg"
        >
          {ui.feedbackThanks}
        </div>
      ) : null}
      {open ? (
        <div
          data-feedback-skip="1"
          className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 p-3 sm:items-center"
          onClick={() => status !== "sending" && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={ui.feedbackTitle}
            className="flex max-h-[88%] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Actions in the header: the keyboard cannot push them off. */}
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={status === "sending"}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-60"
              >
                {ui.feedbackCancel}
              </button>
              <h2 className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-white">{ui.feedbackTitle}</h2>
              <button
                type="button"
                onClick={() => void send()}
                disabled={!canSend}
                className="rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white disabled:opacity-50"
              >
                {status === "sending" ? ui.feedbackSending : ui.feedbackSend}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <p className="text-xs leading-relaxed text-slate-400">{ui.feedbackHint}</p>
              <textarea
                value={note}
                maxLength={FEEDBACK_NOTE_MAX}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                dir="auto"
                placeholder={ui.feedbackPlaceholder}
                className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-[#0a0a0a] px-3 py-2 text-[13px] text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/30"
              />
              <div className="mt-3 flex items-start gap-3">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-36 w-auto max-w-[45%] rounded-lg border border-white/10 object-contain" />
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  {screen && !photo ? (
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={attachScreen}
                        onChange={(event) => setAttachScreen(event.target.checked)}
                        className="accent-white"
                      />
                      {ui.feedbackAttachScreen}
                    </label>
                  ) : null}
                  {photo ? (
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="w-fit rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
                    >
                      {ui.feedbackRemovePhoto}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-fit rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
                    >
                      {ui.feedbackAddPhoto}
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) setPhoto(await readPhoto(file));
                    }}
                  />
                </div>
              </div>
              {status === "failed" ? <p className="mt-3 text-[12px] text-rose-300">{ui.feedbackFailed}</p> : null}
              {status === "limit" ? <p className="mt-3 text-[12px] text-amber-200">{ui.feedbackLimit}</p> : null}
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{ui.feedbackPrivacy}</p>
            </div>
          </div>
        </div>
      ) : null}
      </BodyLayer>
    </>
  );
}
