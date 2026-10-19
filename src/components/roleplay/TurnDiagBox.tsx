"use client";

import { useEffect, useRef, useState } from "react";
import { onTurnDiag, type TurnDiag } from "@/lib/roleplay/listen";

/**
 * 통화 화면 구석의 진단 상자(TestFlight 전용, platform.ts `turnDiagnosticsEnabled`).
 * 마지막 턴의 녹음 형식·크기·소리 크기·서버 응답과, 이 기기 안에서 그 녹음을 다시 들어 보는 ▶.
 * 사용자에게 보이는 문구가 아니라 기술 값만 쓴다(번역 대상 아님). 심사 빌드에서는 꺼진다.
 */
export function TurnDiagBox() {
  const [diag, setDiag] = useState<TurnDiag | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => onTurnDiag(setDiag), []);
  if (!diag) return null;
  const play = () => {
    if (!diag.audioUrl) return;
    audioRef.current?.pause();
    const audio = new Audio(diag.audioUrl);
    audioRef.current = audio;
    void audio.play().catch(() => undefined);
  };
  return (
    <div
      dir="ltr"
      className="pointer-events-auto fixed bottom-24 start-2 z-50 flex items-center gap-2 rounded-lg bg-black/80 px-2 py-1 font-mono text-meta leading-tight text-slate-300"
    >
      <span>
        {diag.mime.replace("audio/", "")} · {diag.chunks}ch · {Math.round(diag.bytes / 1024)}KB
        <br />
        peak {diag.peak.toFixed(3)} · {diag.spoke ? "spoke" : "no-speech"}
        {diag.heardNothing ? " · silent" : ""} · trk {diag.track}
        <br />
        http {diag.status} · text {diag.textLength}
      </span>
      {diag.audioUrl ? (
        <button type="button" onClick={play} className="rounded-lg bg-white/15 px-2 py-1 text-xs text-white">
          ▶
        </button>
      ) : null}
    </div>
  );
}
