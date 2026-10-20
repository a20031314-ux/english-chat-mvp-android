"use client";

/**
 * 내 마이크에서 말을 잘라 낸다.
 *
 * 자기 마이크만 듣기 때문에 누가 말했는지는 이미 정해져 있다. 소리가 일정 크기를
 * 넘으면 녹음을 시작하고, 짧게 쉴 때마다 그때까지를 한 조각으로 넘긴다(speechParts.ts).
 * 같은 말의 조각은 같은 말 번호(utterance)를 달고 가서 한 말풍선으로 이어진다.
 * 실시간 스트리밍 받아쓰기보다 5배쯤 싸고(소리를 한 번씩만 보냄), 긴 말도 쉬는 단위로 먼저 뜬다.
 *
 * 숫자들은 시험하면서 맞출 값이다.
 */
import { IDLE, stepParts, type PartState } from "./speechParts";

const TICK_MS = 50;
const MIN_THRESHOLD = 0.018;

export type Utterance = {
  blob: Blob;
  mimeType: string;
  /** 같은 말(말풍선)의 조각끼리 같은 번호. */
  utterance: string;
  /** 그 말 안의 순번(0부터). */
  part: number;
  /** 기기 시계(ms). 서버 시계로 맞추는 건 부르는 쪽. */
  startedAt: number;
  endedAt: number;
};

function preferredMimeType(): string {
  for (const type of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export type SpeechCapture = { stop: () => void };

function newUtteranceId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function startSpeechCapture(
  stream: MediaStream,
  handlers: {
    onUtterance: (utterance: Utterance) => void;
    onSpeaking: (speaking: boolean) => void;
    /** 새 말이 시작됐다(말풍선을 바로 띄우는 데 씀). */
    onUtteranceStart?: (utterance: string, startedAt: number) => void;
    /** 말 하나가 끝났다(그 뒤 조각은 없다). */
    onUtteranceEnd?: (utterance: string) => void;
    /** 음소거 중이면 듣지 않는다. */
    isMuted: () => boolean;
  },
): SpeechCapture {
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);
  const mimeType = preferredMimeType();

  let noiseFloor = 0.01;
  let recorder: MediaRecorder | null = null;
  let chunks: Blob[] = [];
  let parts: PartState = IDLE;
  let speaking = false;
  let lastVoiced = 0;

  const setSpeaking = (next: boolean) => {
    if (next === speaking) return;
    speaking = next;
    handlers.onSpeaking(next);
  };

  /** 녹음 중인 조각을 닫는다. keep이면 다 모인 뒤 넘긴다. */
  const closeRecorder = (keep: boolean, meta: { utterance: string; part: number; startedAt: number; endedAt: number } | null) => {
    const current = recorder;
    if (!current) return;
    recorder = null;
    const mine = chunks;
    chunks = [];
    current.onstop = () => {
      const blob = new Blob(mine, { type: mimeType || "audio/webm" });
      if (keep && meta && blob.size > 1200) {
        handlers.onUtterance({ blob, mimeType, ...meta });
      }
    };
    if (current.state !== "inactive") current.stop();
  };

  const openRecorder = () => {
    chunks = [];
    const next = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const target = chunks;
    next.ondataavailable = (event) => {
      if (event.data.size > 0) target.push(event.data);
    };
    next.start(250);
    recorder = next;
  };

  const apply = (now: number, voiced: boolean, muted: boolean) => {
    const step = stepParts(parts, { now, voiced, tickMs: TICK_MS, muted }, newUtteranceId);
    parts = step.state;
    for (const action of step.actions) {
      if (action.kind === "begin") {
        openRecorder();
        if (action.newUtterance) handlers.onUtteranceStart?.(action.utterance, now);
      } else if (action.kind === "finish") {
        closeRecorder(action.keep, action);
      } else {
        handlers.onUtteranceEnd?.(action.utterance);
      }
    }
  };

  const timer = window.setInterval(() => {
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const now = Date.now();
    if (handlers.isMuted()) {
      apply(now, false, true);
      setSpeaking(false);
      return;
    }
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const value of samples) sum += value * value;
    const rms = Math.sqrt(sum / samples.length);
    const threshold = Math.max(MIN_THRESHOLD, noiseFloor * 3);
    const voiced = rms > threshold;
    // 조용할 때만 바닥 소음을 천천히 따라간다.
    if (!voiced) noiseFloor = noiseFloor * 0.98 + rms * 0.02;
    if (voiced) lastVoiced = now;
    apply(now, voiced, false);
    setSpeaking(voiced || now - lastVoiced < 300);
  }, TICK_MS);

  return {
    stop: () => {
      window.clearInterval(timer);
      apply(Date.now(), false, true);
      source.disconnect();
      void ctx.close().catch(() => {});
    },
  };
}
