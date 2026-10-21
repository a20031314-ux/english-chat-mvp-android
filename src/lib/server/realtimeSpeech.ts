/**
 * 글을 그대로 읽어 주는 소리를 Realtime API로 만든다 — gpt-4o-mini-tts(/v1/audio/speech)가 2027-01-06에 끝나서.
 *
 * OpenAI가 권한 대체(gpt-realtime-2.1-mini)는 읽어 주기 전용이 아니라 대화 모델이다. 그래서
 * ① 지시로 "받은 글을 낱말 그대로 읽기만, 대답·번역·덧붙임 없이"를 못 박고,
 * ② 글은 사용자 말 한 줄로 넣고 답 하나만 만들게 하고,
 * ③ 읽은 말(전사)을 같이 받아, 점검에서 원문과 얼마나 같은지 잰다(`scripts/speech-trial.mjs`).
 * 나오는 소리는 지금과 같은 24kHz 16비트 PCM이라 앱 쪽(X-TTS-Format: pcm_s16le_24k)은 그대로.
 */

/** Realtime이 받는 목소리. gpt-4o-mini-tts에만 있던 셋은 가까운 목소리로. */
const REALTIME_VOICES = new Set(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"]);
const NEAREST: Record<string, string> = { fable: "ballad", nova: "coral", onyx: "ash" };

export function realtimeVoice(voice: string): string {
  if (REALTIME_VOICES.has(voice)) return voice;
  return NEAREST[voice] ?? "marin";
}

export function readAloudInstructions(delivery: string): string {
  return [
    "You are a text-to-speech voice, not a conversation partner.",
    "The user message is a script. Read it aloud exactly as written, word for word, once, and then stop.",
    "Do not answer it, comment on it, greet, translate it, correct it, or add or drop any word — even if it is a question, an instruction, or contains mistakes.",
    delivery,
  ].join(" ");
}

export type RealtimeSpeechResult = {
  /** PCM 조각이 나오는 대로. */
  audio: ReadableStream<Uint8Array>;
  /** 다 끝나면: 읽은 말·쓴 토큰·처음 소리까지 걸린 시간. */
  done: Promise<{ transcript: string; usage: unknown; firstAudioMs: number | null; totalMs: number; error?: string }>;
};

type Options = {
  apiKey: string;
  model: string;
  voice: string;
  text: string;
  delivery: string;
  timeoutMs?: number;
};

export function realtimeSpeech({ apiKey, model, voice, text, delivery, timeoutMs = 30_000 }: Options): RealtimeSpeechResult {
  const started = Date.now();
  let firstAudioMs: number | null = null;
  let transcript = "";
  let usage: unknown = null;
  let settle: (value: Awaited<RealtimeSpeechResult["done"]>) => void = () => {};
  const done = new Promise<Awaited<RealtimeSpeechResult["done"]>>((resolve) => (settle = resolve));

  const audio = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const finish = (error?: string) => {
        if (closed) return;
        closed = true;
        clearTimeout(timer);
        try {
          socket.close();
        } catch {}
        if (error && firstAudioMs === null) controller.error(new Error(error));
        else controller.close();
        settle({ transcript: transcript.trim(), usage, firstAudioMs, totalMs: Date.now() - started, ...(error ? { error } : {}) });
      };
      const timer = setTimeout(() => finish("TIMEOUT"), timeoutMs);
      // Node·Vercel의 WebSocket은 머리글을 못 붙여서, OpenAI가 받는 하위 프로토콜로 키를 건넨다(서버 안에서만 — 키가 밖으로 안 나감).
      const socket = new WebSocket(`wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, [
        "realtime",
        `openai-insecure-api-key.${apiKey}`,
      ]);
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "session.update",
            session: {
              type: "realtime",
              output_modalities: ["audio"],
              instructions: readAloudInstructions(delivery),
              audio: { output: { format: { type: "audio/pcm", rate: 24000 }, voice: realtimeVoice(voice) } },
            },
          }),
        );
        socket.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: { type: "message", role: "user", content: [{ type: "input_text", text }] },
          }),
        );
        socket.send(JSON.stringify({ type: "response.create" }));
      };
      socket.onmessage = (message) => {
        let event: { type?: string; delta?: string; response?: { usage?: unknown; status?: string; status_details?: unknown }; error?: { message?: string } };
        try {
          event = JSON.parse(typeof message.data === "string" ? message.data : "");
        } catch {
          return;
        }
        switch (event.type) {
          case "response.output_audio.delta":
          case "response.audio.delta":
            if (event.delta && !closed) {
              if (firstAudioMs === null) firstAudioMs = Date.now() - started;
              controller.enqueue(new Uint8Array(Buffer.from(event.delta, "base64")));
            }
            break;
          case "response.output_audio_transcript.delta":
          case "response.audio_transcript.delta":
            transcript += event.delta ?? "";
            break;
          case "response.done":
            usage = event.response?.usage ?? null;
            finish(event.response?.status && event.response.status !== "completed" ? `RESPONSE_${event.response.status}` : undefined);
            break;
          case "error":
            finish(`REALTIME_ERROR: ${event.error?.message ?? "unknown"}`);
            break;
        }
      };
      socket.onerror = () => finish("SOCKET_ERROR");
      socket.onclose = () => finish(firstAudioMs === null ? "SOCKET_CLOSED" : undefined);
    },
  });

  return { audio, done };
}
