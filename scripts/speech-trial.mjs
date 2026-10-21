/**
 * 음성 모델 바꾸기 전 운영 비교 (2026-10-21, OpenAI 음성 모델 종료 대비 — `src/lib/server/speechModels.ts`).
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/speech-trial.mjs [--api https://www.languagebank.net] [--out tmp/speech-trial]
 *
 * 점검 사용자(simcheck-speech-<시각>)로 운영 API를 부른다 — 이 사용자만 머리글로 모델을 고를 수 있다.
 * 1) 읽어 주기: 같은 문장을 지금(gpt-4o-mini-tts)·Realtime(gpt-realtime-2.1-mini)으로 만들어 시간·길이·읽은 말을 잰다.
 * 2) 받아쓰기: 1)의 소리를 gpt-4o-mini-transcribe·gpt-transcribe로 받아써 원문과 얼마나 다른지(글자 오류율) 잰다.
 *    Realtime 소리를 따로 받아쓴 결과로 "원문 그대로 읽었나"도 같이 본다(모델이 스스로 말한 전사만 믿지 않음).
 * 끝나면 이 사용자의 데이터를 지운다(sim-users/forget.mjs).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { forgetRun } from "./sim-users/forget.mjs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const API = arg("--api", "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const OUT = arg("--out", "tmp/speech-trial");
const RUN = `speech${Date.now().toString(36)}`;
const USER = `simcheck-${RUN}-a`;

// 학습자 실수를 일부러 넣은 문장(받아쓰기가 고쳐 쓰면 안 됨) + 보통 문장. 띄어쓰기 없는 언어·RTL·라틴 비영어 포함.
const SAMPLES = [
  { lang: "en-US", text: "Yesterday I go to the market and buy three apple." },
  { lang: "en-US", text: "Could you tell me how long it takes to get to the station?" },
  { lang: "ko-KR", text: "어제 친구가 저한테 선물을 줬어요. 근데 저는 음식이 좋아해요." },
  { lang: "ja-JP", text: "昨日は友達と駅の近くでラーメンを食べました。" },
  { lang: "zh-CN", text: "我昨天去了图书馆，但是我忘记带我的卡。" },
  { lang: "th-TH", text: "เมื่อวานฉันไปตลาดกับแม่และซื้อผลไม้" },
  { lang: "es-ES", text: "Ayer yo voy a la playa con mis amigos y comemos mucho." },
  { lang: "ar-SA", text: "ذهبت أمس إلى السوق واشتريت بعض الفواكه." },
  // 대화 모델이 "대답"하고 싶어지는 글: 질문·지시. 읽어 주기만 해야 한다.
  { lang: "en-US", text: "What is your name? Please tell me about yourself." },
  { lang: "ko-KR", text: "이 문장을 영어로 번역해 주세요." },
];
const STT_MODELS = ["gpt-4o-mini-transcribe", "gpt-transcribe"];

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  "x-rc-user": USER,
  "x-speech-trial-report": "1",
  ...extra,
});

function wav(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(48000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** 문장부호·띄어쓰기·대소문자를 빼고 글자 단위 편집 거리 / 원문 길이. */
function cer(expected, got) {
  const norm = (s) => [...String(s ?? "").toLowerCase().normalize("NFC").replace(/[\p{P}\p{S}\s]/gu, "")];
  const a = norm(expected);
  const b = norm(got);
  if (!a.length) return b.length ? 1 : 0;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[b.length] / a.length;
}

async function post(path, body, extra) {
  const started = Date.now();
  const response = await fetch(`${API}${path}`, { method: "POST", headers: headers(extra), body: JSON.stringify(body) });
  const ms = Date.now() - started;
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { error: `NOT_JSON ${response.status} ${text.slice(0, 120)}` };
  }
  return { status: response.status, ms, ...json };
}

async function listen(pcm, lang, model) {
  const language = lang.split("-")[0];
  const result = await post(
    "/api/roleplay/listen",
    { audioBase64: wav(pcm).toString("base64"), filename: "turn.wav", mimeType: "audio/wav", language },
    { "x-stt-model": model },
  );
  return { model, status: result.status, ms: result.ms, text: result.text ?? "", confidence: result.confidence ?? null, detected: result.detected ?? null, error: result.error };
}

mkdirSync(OUT, { recursive: true });
const rows = [];
for (const sample of SAMPLES) {
  const row = { ...sample, tts: {} };
  for (const engine of ["speech", "realtime"]) {
    const made = await post("/api/tts", { text: sample.text, lang: sample.lang }, { "x-tts-engine": engine });
    const pcm = made.pcmBase64 ? Buffer.from(made.pcmBase64, "base64") : Buffer.alloc(0);
    if (pcm.length) writeFileSync(`${OUT}/${rows.length}-${engine}.wav`, wav(pcm));
    const heard = [];
    if (pcm.length) for (const model of STT_MODELS) heard.push(await listen(pcm, sample.lang, model));
    row.tts[engine] = {
      status: made.status,
      engineUsed: made.engine,
      ms: made.ms,
      firstAudioMs: made.firstAudioMs ?? null,
      audioSeconds: made.audioSeconds ?? 0,
      selfTranscript: made.transcript ?? null,
      usage: made.usage ?? null,
      error: made.error ?? null,
      heard: heard.map((h) => ({ ...h, cer: Number(cer(sample.text, h.text).toFixed(3)) })),
    };
  }
  rows.push(row);
  const s = row.tts.speech;
  const r = row.tts.realtime;
  console.log(
    `${sample.lang} | speech ${s.ms}ms ${s.audioSeconds?.toFixed?.(1)}s | realtime ${r.ms}ms first ${r.firstAudioMs}ms ${r.audioSeconds?.toFixed?.(1)}s ${r.error ?? ""}`,
  );
  for (const engine of ["speech", "realtime"])
    for (const h of row.tts[engine].heard) console.log(`   ${engine} → ${h.model}: cer ${h.cer} ${h.ms}ms conf ${h.confidence} ${h.error ?? ""} «${h.text}»`);
  if (r.selfTranscript) console.log(`   realtime 스스로 읽은 말: «${r.selfTranscript}»`);
}
writeFileSync(`${OUT}/results.json`, JSON.stringify({ api: API, user: USER, at: new Date().toISOString(), rows }, null, 2));
console.log(`\n저장: ${OUT}/results.json`);
await forgetRun(API, `${RUN}-`).catch((error) => console.warn("지우기 실패:", error?.message ?? error));
