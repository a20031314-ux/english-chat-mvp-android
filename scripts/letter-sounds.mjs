/**
 * 글자·소리(ScriptPractice) 소리 파일을 미리 만들어 둔다(사용자 2026-11-22 "일본어 0단계에서 글자 소리 몇 개가 안 나와").
 * 한 박자 글자(ン·ほ·ア)를 그때그때 TTS로 부르면 소리가 비거나(0.05초), 아주 작거나, 3초짜리 엉뚱한 소리가 왔다 — 모델이 짧은 말에 약하다.
 * 그래서 운영 /api/tts로 글자마다 여러 번 받아 보고, 들리는 길이·크기가 맞는 것을 골라 public/letter-sounds/<언어>/<코드>.mp3로 둔다.
 * 앱은 이 파일을 먼저 틀고(lib/curriculum/letterSounds.ts), 없으면 예전처럼 TTS.
 * 실행: node --experimental-strip-types scripts/letter-sounds.mjs ja [ko zh …]   (ffmpeg 필요, 운영 TTS를 부름)
 *   FORCE=1 이면 있는 파일도 다시.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const API = process.env.API_BASE || "https://www.languagebank.net";
const RATE = 24000;
const TRIES = Number(process.env.TRIES) || 6;
const langs = process.argv.slice(2);
if (!langs.length) {
  console.error("Usage: letter-sounds.mjs <lang> [lang…]");
  process.exit(2);
}
const { scriptFor } = await import(path.resolve("src/lib/curriculum/scripts/index.ts"));
const { learningLanguageSpeechTag } = await import(path.resolve("src/lib/learningLanguages.ts"));
const { letterSoundPath } = await import(path.resolve("src/lib/curriculum/letterSoundFile.ts"));

/** 소리 있는 구간(앞뒤 조용한 곳을 뺀) 길이·크기. */
function measure(pcm) {
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 2));
  const loud = 1200;
  let first = -1;
  let last = -1;
  let peak = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const value = Math.abs(samples[i]);
    if (value > peak) peak = value;
    if (value > loud) {
      if (first < 0) first = i;
      last = i;
    }
  }
  return { voiced: first < 0 ? 0 : (last - first) / RATE, peak, first, last };
}

function good(text, m) {
  const beats = [...text].length;
  const longest = 0.6 + 0.45 * beats;
  return m.peak >= 5000 && m.voiced >= 0.12 && m.voiced <= longest;
}

async function fetchPcm(text, speech, tutor) {
  const params = new URLSearchParams({ text, lang: speech, tutor });
  const response = await fetch(`${API}/api/tts?${params}`, { headers: { "x-rc-user": "simcheck-letter-sounds" } });
  if (!response.ok) throw new Error(`tts ${response.status}`);
  if (response.headers.get("x-tts-format") !== "pcm_s16le_24k") throw new Error(`format ${response.headers.get("x-tts-format")}`);
  return Buffer.from(await response.arrayBuffer());
}

function writeMp3(pcm, m, out) {
  // 앞뒤 조용한 곳을 조금만 남기고 자른다(0.08초).
  const pad = Math.round(0.08 * RATE);
  const from = Math.max(0, m.first - pad) * 2;
  const to = Math.min(pcm.byteLength / 2, m.last + pad) * 2;
  execFileSync("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", "pipe:0", "-b:a", "48k", out], {
    input: pcm.subarray(from, to),
  });
}

for (const lang of langs) {
  const course = scriptFor(lang);
  if (!course) {
    console.warn(`글자 과정 없음: ${lang}`);
    continue;
  }
  const speech = learningLanguageSpeechTag(lang);
  const dir = path.join("public", "letter-sounds", lang);
  fs.mkdirSync(dir, { recursive: true });
  const says = [...new Set(course.groups.flatMap((group) => group.items.map((item) => item.say)).filter(Boolean))];
  let made = 0;
  const weak = [];
  for (const text of says) {
    const out = path.join("public", letterSoundPath(lang, text));
    if (!process.env.FORCE && fs.existsSync(out)) continue;
    let best = null;
    for (let i = 0; i < TRIES; i += 1) {
      let pcm;
      try {
        pcm = await fetchPcm(text, speech, i % 2 ? "m" : "f");
      } catch (error) {
        console.warn(text, String(error));
        continue;
      }
      const m = measure(pcm);
      const ok = good(text, m);
      if (!best || (ok && !best.ok) || (ok === best.ok && m.peak > best.m.peak)) best = { pcm, m, ok };
      if (ok) break;
    }
    if (!best || best.m.voiced === 0) {
      weak.push(`${text}(없음)`);
      continue;
    }
    if (!best.ok) weak.push(`${text}(${best.m.voiced.toFixed(2)}초·${best.m.peak})`);
    // 너무 긴 것(엉뚱한 말)은 두지 않는다 — 앱이 그때 TTS로 부른다.
    if (best.m.voiced > 0.6 + 0.45 * [...text].length + 1) continue;
    writeMp3(best.pcm, best.m, out);
    made += 1;
  }
  console.log(`${lang}: ${says.length}개 중 새로 ${made}개${weak.length ? ` · 기준 못 맞춘 것 ${weak.join(" ")}` : ""}`);
}
