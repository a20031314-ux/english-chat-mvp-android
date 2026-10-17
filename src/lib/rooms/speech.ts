"use client";

/**
 * 내 마이크에서 말 덩어리를 잘라 낸다.
 *
 * 자기 마이크만 듣기 때문에 누가 말했는지는 이미 정해져 있다. 소리가 일정 크기를
 * 넘으면 녹음을 시작하고, 조용함이 이어지면 그 덩어리를 넘긴다. 실시간
 * 스트리밍 받아쓰기보다 5배쯤 싸고, 자막은 말이 끝난 뒤 1~2초 늦게 뜬다.
 *
 * 숫자들은 시험하면서 맞출 값이다.
 */
const TICK_MS = 50;
/** 이만큼 조용하면 한 덩어리가 끝난 것. 통화의 "이어 말하기 대기"보다 짧게. */
const END_SILENCE_MS = 1_200;
/** 이보다 짧은 소리는 기침·숨소리로 보고 버린다. */
const MIN_SPEECH_MS = 400;
/** 한 덩어리가 이보다 길면 끊어서 보낸다(자막이 너무 늦지 않게). */
const MAX_UTTERANCE_MS = 15_000;
const MIN_THRESHOLD = 0.018;

export type Utterance = {
  blob: Blob;
  mimeType: string;
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

export function startSpeechCapture(
  stream: MediaStream,
  handlers: {
    onUtterance: (utterance: Utterance) => void;
    onSpeaking: (speaking: boolean) => void;
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
  let startedAt = 0;
  let lastVoiceAt = 0;
  let voicedMs = 0;
  let speaking = false;

  const setSpeaking = (next: boolean) => {
    if (next === speaking) return;
    speaking = next;
    handlers.onSpeaking(next);
  };

  const finish = (keep: boolean) => {
    const current = recorder;
    if (!current) return;
    recorder = null;
    const began = startedAt;
    const ended = lastVoiceAt || Date.now();
    const voiced = voicedMs;
    setSpeaking(false);
    current.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
      chunks = [];
      if (keep && voiced >= MIN_SPEECH_MS && blob.size > 1200) {
        handlers.onUtterance({ blob, mimeType, startedAt: began, endedAt: ended });
      }
    };
    if (current.state !== "inactive") current.stop();
  };

  const begin = (now: number) => {
    chunks = [];
    const next = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    next.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    next.start(250);
    recorder = next;
    startedAt = now;
    lastVoiceAt = now;
    voicedMs = 0;
  };

  const timer = window.setInterval(() => {
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const now = Date.now();
    if (handlers.isMuted()) {
      finish(true);
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

    if (!recorder) {
      if (voiced) {
        begin(now);
        setSpeaking(true);
      }
      return;
    }
    if (voiced) {
      lastVoiceAt = now;
      voicedMs += TICK_MS;
      setSpeaking(true);
    } else if (now - lastVoiceAt > 300) {
      setSpeaking(false);
    }
    if (now - lastVoiceAt >= END_SILENCE_MS || now - startedAt >= MAX_UTTERANCE_MS) finish(true);
  }, TICK_MS);

  return {
    stop: () => {
      window.clearInterval(timer);
      finish(true);
      source.disconnect();
      void ctx.close().catch(() => {});
    },
  };
}
