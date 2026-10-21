/**
 * 받아쓰기 모델 운영 비교 (2026-10-21): gpt-4o-mini-transcribe(지금) · gpt-transcribe · Scribe v2 · AssemblyAI Sync.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/stt-trial.mjs [--api …] [--out tmp/stt-trial] [--models a,b,c]
 *
 * 14개 언어 × 3문장(학습자 실수 든 문장·질문·숫자/이름) + 두 언어를 섞은 Room 문장을 지금 목소리(/api/tts)로 만들어,
 * 같은 소리를 모델마다 `/api/roleplay/listen`에 보내(점검 사용자만 `x-stt-model`이 먹음) 원문과 글자 오류율·시간을 잰다.
 * 학습자 실수를 고쳐 쓰면 원문과 달라지므로 오류율에 그대로 잡힌다. 숫자는 말로 적어도 틀린 게 아니라 따로 센다.
 * 끝나면 점검 데이터를 지운다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { forgetRun } from "./sim-users/forget.mjs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const API = arg("--api", "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const OUT = arg("--out", "tmp/stt-trial");
const MODELS = arg("--models", "gpt-4o-mini-transcribe,gpt-transcribe,scribe_v2,assemblyai-sync").split(",");
const RUN = `stt${Date.now().toString(36)}`;
const USER = `simcheck-${RUN}-a`;

// [언어, 문장, 실수 있음?, 숫자 있음?]
const SAMPLES = [
  ["en-US", "She don't like coffee, so she drink tea every morning.", 1],
  ["en-US", "Can you explain this word to me?"],
  ["en-US", "My flight leaves at 7:45 from gate 12.", 0, 1],
  ["ko-KR", "저는 내일 학교에 갔어요.", 1],
  ["ko-KR", "근데 저는 음식이 좋아해요.", 1],
  ["ko-KR", "오늘 날씨 어때요? 대답해 주세요."],
  ["ja-JP", "私は昨日、学校に行くでした。", 1],
  ["ja-JP", "あなたの名前は何ですか？教えてください。"],
  ["zh-CN", "我明天去了北京。", 1],
  ["zh-CN", "你能帮我翻译这句话吗？"],
  ["es-ES", "Ella tiene veinte años y es muy alto.", 1],
  ["es-ES", "Ayer yo voy a la playa con mis amigos.", 1],
  ["fr-FR", "Je suis allé au magasin et j'ai acheté des pomme.", 1],
  ["it-IT", "Io ho andato al mare con la mia famiglia.", 1],
  ["pt-BR", "Eu vai na praia amanhã com meus amigo.", 1],
  ["ru-RU", "Я вчера иду в магазин и купил хлеб.", 1],
  ["ar-SA", "أنا يذهب إلى المدرسة كل يوم.", 1],
  ["id-ID", "Saya sudah makan besok pagi.", 1],
  ["vi-VN", "Hôm qua tôi sẽ đi chợ với mẹ.", 1],
  ["th-TH", "พรุ่งนี้ฉันไปโรงเรียนแล้ว", 1],
  ["th-TH", "คุณช่วยแปลประโยคนี้ให้หน่อยได้ไหม"],
  ["hi-IN", "मैं कल बाज़ार जाऊँगा था।", 1],
  ["hi-IN", "क्या आप मेरे सवाल का जवाब दे सकते हैं?"],
];
// Room: 두 언어를 섞어 말함 — 방 언어 두 개를 넘긴다.
const MIXED = [
  { lang: "ko-KR", languages: ["ko", "en"], text: "어제 meeting이 너무 길어서 피곤했어요." },
  { lang: "en-US", languages: ["en", "ko"], text: "I went to the 편의점 yesterday and bought 김밥." },
  { lang: "ja-JP", languages: ["ja", "ko"], text: "今日は本当に 피곤해요、でも楽しかった。" },
];

const headers = (extra = {}) => ({ "Content-Type": "application/json", "x-rc-user": USER, "x-speech-trial-report": "1", ...extra });

function wav(pcm) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(24000, 24);
  h.writeUInt32LE(48000, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

const norm = (s) => [...String(s ?? "").toLowerCase().normalize("NFC").replace(/[\p{P}\p{S}\s]/gu, "")];
function cer(expected, got) {
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
  try {
    return { status: response.status, ms, ...JSON.parse(text) };
  } catch {
    return { status: response.status, ms, error: `NOT_JSON ${text.slice(0, 120)}` };
  }
}

mkdirSync(OUT, { recursive: true });
const jobs = [
  ...SAMPLES.map(([lang, text, mistake, numbers]) => ({ lang, text, mistake: Boolean(mistake), numbers: Boolean(numbers) })),
  ...MIXED.map((m) => ({ ...m, mixed: true })),
];
const rows = [];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (jobs.length) {
      const job = jobs.shift();
      const made = await post("/api/tts", { text: job.text, lang: job.lang }, { "x-tts-engine": "speech" });
      const pcm = made.pcmBase64 ? Buffer.from(made.pcmBase64, "base64") : Buffer.alloc(0);
      const row = { ...job, heard: {} };
      if (!pcm.length) {
        row.error = made.error ?? `TTS ${made.status}`;
        rows.push(row);
        continue;
      }
      const body = {
        audioBase64: wav(pcm).toString("base64"),
        filename: "turn.wav",
        mimeType: "audio/wav",
        ...(job.mixed ? { room: true, languages: job.languages } : { language: job.lang.split("-")[0] }),
      };
      for (const model of MODELS) {
        const r = await post("/api/roleplay/listen", body, { "x-stt-model": model });
        row.heard[model] = { text: r.text ?? "", raw: r.raw, cer: Number(cer(job.text, r.text ?? "").toFixed(3)), ms: r.ms, server: r.ms, confidence: r.confidence ?? null, detected: r.detected ?? null, error: r.error ?? (r.status >= 400 ? `HTTP ${r.status}` : undefined) };
      }
      rows.push(row);
    }
  }),
);

const order = (a, b) => a.lang.localeCompare(b.lang) || a.text.localeCompare(b.text);
rows.sort(order);
for (const row of rows) {
  console.log(`\n${row.lang}${row.mixed ? " (섞음)" : ""}${row.mistake ? " (실수)" : ""} «${row.text}»`);
  for (const model of MODELS) {
    const h = row.heard[model];
    if (h) console.log(`   ${model.padEnd(24)} cer ${String(h.cer).padEnd(5)} ${String(h.ms).padStart(5)}ms ${h.error ?? ""} «${h.text}»`);
  }
}
console.log("\n요약 (줄 수, 완전 일치, 평균 오류율, 평균 시간, 실수 문장 중 고쳐 쓴 것 = 오류율 > 0)");
for (const model of MODELS) {
  const hs = rows.map((r) => ({ r, h: r.heard[model] })).filter((x) => x.h && !x.h.error);
  const avg = (f) => (hs.length ? hs.reduce((s, x) => s + f(x), 0) / hs.length : 0);
  const exact = hs.filter((x) => x.h.cer === 0).length;
  const fixed = hs.filter((x) => x.r.mistake && x.h.cer > 0).length;
  const mistakes = hs.filter((x) => x.r.mistake).length;
  const errors = rows.filter((r) => r.heard[model]?.error).length;
  console.log(`${model.padEnd(24)} ${hs.length}줄 일치 ${exact} 평균 ${avg((x) => x.h.cer).toFixed(3)} ${Math.round(avg((x) => x.h.ms))}ms 실수 문장 어긋남 ${fixed}/${mistakes} 실패 ${errors}`);
}
writeFileSync(`${OUT}/results.json`, JSON.stringify({ api: API, at: new Date().toISOString(), models: MODELS, rows }, null, 2));
console.log(`\n저장: ${OUT}/results.json`);
await forgetRun(API, `${RUN}-`).catch((error) => console.warn("지우기 실패:", error?.message ?? error));
