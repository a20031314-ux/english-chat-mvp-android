/**
 * 방 내 줄 교정 운영 점검 (2026-10-22, `hub/drafts/room-fix-2026-10-22.md`).
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/room-fix-trial.mjs --samples <폴더>/samples.json [--api …] [--out tmp/room-fix-trial] [--phase listen|fix] [--model gpt-4o-mini-transcribe] [--second always|borderline]
 *
 * samples.json = [{ id, text(실제로 읽은 문장), accuracy(사람이 매긴 발음 점수 0~10), file(같은 폴더 기준 wav) }].
 * 데이터는 저장소에 넣지 않는다(예: speechocean762 — 중국어권 성인 학습자의 영어 읽기, Apache-2.0).
 *
 * listen: 운영 `/api/roleplay/listen`(방, en·ko)에 점검 사용자로 보내 받아쓰기·확신도(sure.mean)를 모으고 원문과 낱말 오류율을 잰다
 *         → 확신도 기준(speechConfidence.ts SURE_RULES)을 고르는 표.
 * fix:    같은 소리를 fix:true로 받아쓴 뒤 `/api/rooms/fix`까지 — 읽은 문장은 문법이 맞으니, 교정이 나오면 그건
 *         잘못 들은 말을 고쳤거나(받아쓰기 ≠ 원문) 맞는 말을 고친 것(받아쓰기 = 원문)이다. 둘 다 0에 가까워야 한다.
 * 방 자막 한도(무료 100줄)에 안 걸리게 80줄마다 점검 사용자를 바꾼다. 끝나면 점검 데이터를 지운다.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { forgetRun } from "./sim-users/forget.mjs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const API = arg("--api", "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const SAMPLES = arg("--samples", "");
const OUT = arg("--out", "tmp/room-fix-trial");
const PHASE = arg("--phase", "listen");
const MODEL = arg("--model", "");
const LIMIT = Number(arg("--limit", "0")) || 0;
// fix 단계: borderline(기본, 확신 어중간한 조각만 두 번째 받아쓰기) | always(늘) — 점검 사용자에게만 먹는 머리글.
const SECOND = arg("--second", "");
if (!SAMPLES) {
  console.error("--samples <samples.json> 필요");
  process.exit(1);
}
const RUN = `rfx${Date.now().toString(36)}`;
const userFor = (index) => `simcheck-${RUN}-u${Math.floor(index / 80)}`;

const words = (text) =>
  text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .split(/[^\p{L}\p{M}\p{N}']+/u)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);

/** 낱말 오류율(편집 거리 / 원문 낱말 수). */
function wer(ref, hyp) {
  const a = words(ref);
  const b = words(hyp);
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return a.length ? d[a.length][b.length] / a.length : 0;
}

async function post(path, user, body) {
  const headers = { "Content-Type": "application/json", "x-rc-user": user, "x-speech-trial-report": "1" };
  if (MODEL) headers["x-stt-model"] = MODEL;
  if (SECOND) headers["x-room-fix-second"] = SECOND;
  const started = Date.now();
  const response = await fetch(`${API}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: response.status, json, ms: Date.now() - started };
}

const samples = JSON.parse(readFileSync(SAMPLES, "utf8")).slice(0, LIMIT || undefined);
const base = dirname(SAMPLES);
mkdirSync(OUT, { recursive: true });
const rows = [];
const users = new Set();

async function one(sample, index) {
  const user = userFor(index);
  users.add(user);
  const audioBase64 = readFileSync(join(base, sample.file)).toString("base64");
  const utterance = `${RUN}${sample.id}`.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
  const heard = await post("/api/roleplay/listen", user, {
    audioBase64,
    mimeType: "audio/wav",
    filename: "line.wav",
    room: true,
    languages: ["en", "ko"],
    utterance,
    part: 0,
    ...(PHASE === "fix" ? { fix: true } : {}),
  });
  const text = heard.json?.text ?? "";
  const row = {
    id: sample.id,
    accuracy: sample.accuracy,
    ref: sample.text,
    text,
    mean: heard.json?.sure?.mean ?? null,
    unsure: Boolean(heard.json?.unsure),
    wer: Math.round(wer(sample.text, text) * 1000) / 1000,
    status: heard.status,
  };
  if (PHASE === "fix") {
    row.trust = heard.json?.fix ?? null;
    if (row.trust && text) {
      const fixed = await post("/api/rooms/fix", user, {
        utterance,
        parts: [{ part: 0, text, ...(row.trust === "check" ? { audioBase64, mimeType: "audio/wav" } : {}) }],
        targetLanguage: "en",
        interfaceLanguage: "ko",
        recent: [],
      });
      row.fix = {
        status: fixed.status,
        skip: fixed.json?.skip ?? null,
        hasError: fixed.json?.hasError ?? null,
        corrected: fixed.json?.corrected ?? null,
        explanation: fixed.json?.explanation ?? null,
        dropped: fixed.json?.dropped ?? null,
        disputed: fixed.json?.disputed ?? [],
        heard: fixed.json?.heard ?? null,
        ms: fixed.ms,
      };
    }
  }
  rows.push(row);
}

// 동시에 4개씩.
for (let i = 0; i < samples.length; i += 4) {
  await Promise.all(samples.slice(i, i + 4).map((sample, k) => one(sample, i + k).catch((error) => rows.push({ id: sample.id, error: String(error) }))));
  process.stdout.write(`\r${Math.min(i + 4, samples.length)}/${samples.length}`);
}
process.stdout.write("\n");
rows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
writeFileSync(join(OUT, `${PHASE}-${RUN}.json`), JSON.stringify(rows, null, 1));

// 요약
const ok = rows.filter((row) => row.status === 200);
if (PHASE === "listen") {
  console.log(`받아쓴 줄 ${ok.length}/${rows.length}`);
  for (const t of [0.86, 0.9, 0.92, 0.94, 0.95, 0.96, 0.97, 0.98]) {
    const above = ok.filter((row) => row.mean !== null && row.mean >= t);
    const wrong = above.filter((row) => row.wer > 0);
    console.log(
      `mean ≥ ${t}: ${above.length}줄(${Math.round((above.length / ok.length) * 100)}%) · 낱말 틀린 줄 ${wrong.length}(${above.length ? Math.round((wrong.length / above.length) * 100) : 0}%) · 평균 오류율 ${
        above.length ? (above.reduce((s, r) => s + r.wer, 0) / above.length).toFixed(3) : "-"
      }`,
    );
  }
} else {
  const tally = {};
  for (const row of ok) {
    const key = !row.trust ? (row.unsure ? "unsure(표 없음)" : "표 없음") : row.fix?.skip ? `${row.trust}·skip:${row.fix.skip}` : row.fix?.hasError ? `${row.trust}·교정` : row.fix?.dropped ? `${row.trust}·버림:${row.fix.dropped}` : `${row.trust}·고칠 것 없음`;
    tally[key] = (tally[key] ?? 0) + 1;
  }
  console.log(tally);
  const corrected = ok.filter((row) => row.fix?.hasError);
  console.log(`교정 나온 줄 ${corrected.length}: 받아쓰기=원문(맞는 말을 고침) ${corrected.filter((r) => r.wer === 0).length}, 받아쓰기≠원문 ${corrected.filter((r) => r.wer > 0).length}`);
}
console.log(`결과: ${join(OUT, `${PHASE}-${RUN}.json`)}`);
await forgetRun(API, `${RUN}-`).catch((error) => console.warn("점검 데이터 지우기 실패:", error?.message ?? error));
