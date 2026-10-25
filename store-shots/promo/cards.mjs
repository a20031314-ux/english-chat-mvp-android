// 스토어 카드(1080×1920, store-shots/combo 결과)로 앱 소개 쇼츠: 카드마다 헤드라인을 먼저 보여 주고 휴대폰 쪽으로 천천히 확대,
// 카드끼리는 겹쳐 넘기고, 끝 화면(로고 · 한 줄 · Google Play) + 배경음(music.mjs). 목소리 없음(사용자 2026-10-26).
//
// Run: node store-shots/promo/cards.mjs <카드 폴더 또는 png들…> [--lang en] [--out tmp/promo/cards/promo-cards-en.mp4]
//   폴더면 그 안의 png를 이름 순서로.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { FONT, RTL, STORE_LINE } from "./combos.mjs";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const lang = opt("lang", "en");
const endKey = opt("end", lang);
const ROOT = process.cwd();
const OUTFILE = path.resolve(opt("out", path.join(ROOT, "tmp", "promo", "cards", `promo-cards-${lang}.mp4`)));
const cards = args.flatMap((a) =>
  fs.statSync(a).isDirectory()
    ? fs.readdirSync(a).filter((f) => f.endsWith(".png") || f.endsWith(".mp4")).sort().map((f) => path.join(a, f))
    : [a],
);
if (!cards.length) throw new Error("카드 png가 없어요");
const WORK = path.join(path.dirname(OUTFILE), `work-${lang}`);
fs.mkdirSync(WORK, { recursive: true });

const END = {
  en: { title: "Write. Speak.\nGet fixed right below.", sub: "With an AI tutor and real learners" },
  "en-call": { title: "Speak out loud,\nin any language", sub: "An AI friend that waits, listens and helps" },
  ko: { title: "쓰고, 말하고,\n바로 아래서 고쳐요", sub: "AI 튜터와 진짜 학습자들과 함께" },
  es: { title: "Escribe. Habla.\nCorrige justo debajo.", sub: "Con un tutor de IA y estudiantes reales" },
  ja: { title: "書いて、話して、\nすぐ下で直す", sub: "AIチューターと、本物の学習者と" },
};
const C = END[endKey] ?? END[lang] ?? END.en;

const CARD = 3.6; // 카드 하나(초)
const FADE = 0.45;
const ENDLEN = 2.8;
const FPS = 30;

// 끝 화면.
const icon = fs.readFileSync(path.join(ROOT, "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")).toString("base64");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.setContent(`<!doctype html><html${RTL.has(lang) ? ' dir="rtl"' : ""}><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1080px;height:1920px;background:#15161A;color:#fff;font-family:${FONT[lang] ?? "'Noto Sans', sans-serif"}}
</style></head><body>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <img src="data:image/png;base64,${icon}" style="width:240px;height:240px;border-radius:50%">
    <div style="margin-top:40px;font-size:66px;font-weight:800">languagebank</div>
    <h1 style="margin:56px 0 0;font-size:92px;line-height:1.15;font-weight:900;white-space:pre-line">${esc(C.title)}</h1>
    <p style="margin:34px 0 0;font-size:40px;color:#B7B8BF">${esc(C.sub)}</p>
    <div style="margin-top:90px;padding:28px 60px;border-radius:999px;background:#fff;color:#111;font-size:44px;font-weight:800">${esc(STORE_LINE[lang] ?? STORE_LINE.en)}</div>
  </div></body></html>`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const endPng = path.join(WORK, "end.png");
await page.screenshot({ path: endPng });
await browser.close();

// 카드마다 클립: 0~25% 그대로(헤드라인 읽기), 그다음 부드럽게 휴대폰 쪽으로 확대. 홀수 장은 왼쪽 큰 화면, 짝수 장은 오른쪽 위 카드.
const N = Math.round(CARD * FPS);
// mp4는 이미 만든 장면(예: 통화 편 언어별)이라 그대로 쓴다 — 길이는 그 파일 길이.
const lenOf = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const clips = cards.map((card, i) => {
  if (card.endsWith(".mp4")) return card;
  const [fx, fy] = i % 2 === 0 ? [0.29, 0.6] : [0.76, 0.43];
  const p = `(min(1,max(0,(on/${N}-0.25)/0.75)))`;
  const s = `(${p}*${p}*(3-2*${p}))`;
  const z = `(1+0.32*${s})`;
  const cx = `(0.5+(${fx}-0.5)*${s})`;
  const cy = `(0.5+(${fy}-0.5)*${s})`;
  const file = path.join(WORK, `clip-${String(i).padStart(2, "0")}.mp4`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", card, "-vf",
    `scale=2160:3840:flags=lanczos,zoompan=z='${z}':x='max(0,min(iw-iw/zoom,${cx}*iw-iw/zoom/2))':y='max(0,min(ih-ih/zoom,${cy}*ih-ih/zoom/2))':d=${N}:s=1080x1920:fps=${FPS},format=yuv420p`,
    "-frames:v", String(N), "-c:v", "libx264", "-crf", "16", "-preset", "medium", file]);
  return file;
});
const endClip = path.join(WORK, "clip-end.mp4");
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-loop", "1", "-t", String(ENDLEN), "-i", endPng, "-vf", `fps=${FPS},format=yuv420p`, "-c:v", "libx264", "-crf", "16", endClip]);

// 이어 붙이기(겹쳐 넘김) + 배경음.
const all = [...clips, endClip];
const lens = [...clips.map((c) => (c.endsWith(".mp4") && cards.includes(c) ? lenOf(c) : CARD)), ENDLEN];
let chain = "";
let last = "[0:v]";
let offset = 0;
for (let k = 1; k < all.length; k++) {
  offset += lens[k - 1] - FADE;
  const outLabel = k === all.length - 1 ? "[v]" : `[x${k}]`;
  chain += `${last}[${k}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}${outLabel};`;
  last = `[x${k}]`;
}
const total = offset + ENDLEN;
const MUSIC = path.join(ROOT, "tmp", "promo", "music.wav");
if (!fs.existsSync(MUSIC)) execFileSync("node", [path.join(ROOT, "store-shots", "promo", "music.mjs"), MUSIC]);
const mi = all.length;
chain += `[${mi}:a]volume=0.6,atrim=0:${total.toFixed(3)},afade=t=in:d=0.6,afade=t=out:st=${(total - 1.8).toFixed(3)}:d=1.8[a]`;
fs.mkdirSync(path.dirname(OUTFILE), { recursive: true });
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...all.flatMap((f) => ["-i", f]), "-stream_loop", "-1", "-i", MUSIC,
  "-filter_complex", chain, "-map", "[v]", "-map", "[a]", "-t", total.toFixed(3), "-r", String(FPS),
  "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", OUTFILE]);
console.log(`${OUTFILE}  ${total.toFixed(1)}초 · 카드 ${cards.length}장`);
