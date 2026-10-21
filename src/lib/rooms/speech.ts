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
 *
 * 2026-10-22: 소리는 MediaRecorder 대신 표본을 직접 모아(pcm.ts) 늘 최근 0.4초를 쥐고 있다가, 말이 시작되면 그 앞부터 붙여 WAV로 보낸다.
 * 예전에는 소리가 기준을 넘은 뒤에야 녹음기를 켜서 첫 음절이 잘렸고(작게 시작한 말일수록 더), 받아쓰기는 잘린 앞을 엉뚱한 말로 메웠다.
 * 표본을 받을 수 없는 브라우저는 예전 방식(MediaRecorder) 그대로.
 */
import { IDLE, stepParts, type PartState } from "./speechParts";
import { PREROLL_MS, PcmRing, concatPcm, downsample, encodeWav } from "./pcm";

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

  // 표본 직접 모으기(앞부분 미리 담기). createScriptProcessor는 낡았지만 웹뷰·사파리 모두에 있고 따로 파일이 필요 없다.
  // 소리는 0 크기로 내보내 스피커로는 아무것도 나가지 않는다(연결해야 돌아가는 브라우저가 있음).
  const pcm = typeof ctx.createScriptProcessor === "function";
  const ring = new PcmRing((ctx.sampleRate * PREROLL_MS) / 1000);
  let pcmParts: Float32Array[] | null = null;
  let processor: ScriptProcessorNode | null = null;
  let mute: GainNode | null = null;
  if (pcm) {
    processor = ctx.createScriptProcessor(2048, 1, 1);
    mute = ctx.createGain();
    mute.gain.value = 0;
    processor.onaudioprocess = (event) => {
      const frame = new Float32Array(event.inputBuffer.getChannelData(0));
      if (pcmParts) pcmParts.push(frame);
      else ring.push(frame);
    };
    source.connect(processor);
    processor.connect(mute);
    mute.connect(ctx.destination);
  }

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
    if (pcm) {
      const parts = pcmParts;
      pcmParts = null;
      if (!parts) return;
      const samples = concatPcm(parts);
      // 끝자락은 고리에 다시 담지 않는다: 8초에서 말 중간에 끊긴 조각이면 다음 조각 앞에 같은 낱말이 두 번 들어간다.
      // 고리에는 녹음하지 않는 사이(쉼)의 소리만 — 쉼에서 끊긴 뒤 다시 말하면 그 쉼이 앞부분이 된다.
      if (keep && meta) {
        const wav = encodeWav(downsample(samples, ctx.sampleRate));
        if (wav.byteLength > 1200) handlers.onUtterance({ blob: new Blob([wav as BlobPart], { type: "audio/wav" }), mimeType: "audio/wav", ...meta });
      }
      return;
    }
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
    if (pcm) {
      // 미리 담아 둔 앞부분부터.
      pcmParts = [ring.snapshot()];
      return;
    }
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
      if (processor) {
        processor.onaudioprocess = null;
        processor.disconnect();
      }
      mute?.disconnect();
      source.disconnect();
      void ctx.close().catch(() => {});
    },
  };
}
