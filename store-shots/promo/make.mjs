// 실사용 녹화(record.mjs) → 세로 쇼츠(1080×1920, 약 15초).
// 장면을 events.json 시각으로 자르고, 기다리는 구간은 빠르게, 카드는 확대, 자막·튜터 목소리·끝 화면을 입힌다.
// 결과: tmp/promo/<locale>/promo-<locale>.mp4
//
// Run: node store-shots/promo/make.mjs ko
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const locale = process.argv[2] || "ko";
const ROOT = process.cwd();
const DIR = path.join(ROOT, "tmp", "promo", locale);
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const ev = JSON.parse(fs.readFileSync(path.join(DIR, "events.json"), "utf8"));
const target = locale === "en" ? "es" : "en";

/** 자막(장면마다), 끝 화면 문구. 학습 언어 이름은 그 앱 언어로. */
const COPY = {
  ko: {
    font: "'Noto Sans CJK KR', sans-serif",
    hook: "영어로 말하다\n막혔다면?",
    type: "그냥 한국어로\n쓰세요",
    reply: "튜터는 영어로\n대화를 이어가요",
    card: "하고 싶던 말은\n영어로 바로 아래",
    use: "그 표현으로\n바로 말해보기",
    endTitle: "막히면 편한 말로,\n표현은 바로 영어로",
    endSub: "AI 친구와 대화하며 배우는 언어 앱",
    store: "Google Play에서 만나요",
  },
};
const C = COPY[locale];
if (!C) throw new Error(`no promo copy for ${locale}`);

// ── 1. 장면 자르기(원본 시각) ──
// [시작, 끝, 속도, 자막 키, 확대]
const segs = [
  [Math.max(0, ev.typeStart - 1.8), ev.typeStart + 0.1, 1, "hook"],
  [ev.typeStart + 0.1, ev.sent + 0.3, 1, "type"],
  [ev.sent + 0.3, ev.reply - 0.2, 3, "type"],
  [ev.reply - 0.2, ev.cardTap + 0.1, 1, "reply"],
  [ev.cardTap + 0.1, ev.card, 2.5, "reply"],
  [ev.card, ev.use - 0.1, 1, "card", true],
  [ev.use - 0.1, ev.end - 0.4, 1, "use"],
];
const END_CARD = 2.6;
let out = 0;
const timeline = segs.map(([a, b, speed, cap, zoom]) => {
  const dur = (b - a) / speed;
  const row = { a, b, speed, cap, zoom, at: out, dur };
  out += dur;
  return row;
});
const phoneDur = out;
const total = phoneDur + END_CARD;

// ── 2. 그림(자막·프레임·끝 화면)은 HTML로 그려 PNG ──
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function png(file, body, { transparent = true } = {}) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:${transparent ? "transparent" : "#15161A"};font-family:${C.font};color:#fff}
  </style></head><body>${body}</body></html>`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: transparent });
}
const PHONE = { x: 210, y: 400, w: 660 }; // 824×1830 → 660×1466
PHONE.h = Math.round((PHONE.w * 1830) / 824);
const R = 64;
// 배경 + 휴대폰 테두리(가운데는 투명하게 뚫어 영상이 보이게: 영상 위에 덮는다).
await png(path.join(DIR, "bg.png"), "", { transparent: false });
await png(path.join(DIR, "frame.png"), `
  <div style="position:absolute;left:${PHONE.x - 14}px;top:${PHONE.y - 14}px;width:${PHONE.w}px;height:${PHONE.h}px;
    border:14px solid #000;border-radius:${R}px;box-shadow:0 0 0 2px #34353C, 0 40px 120px rgba(0,0,0,.6), 0 0 0 9999px #15161A"></div>`);
const accent = { hook: "#FF8A6B", type: "#7CC4FF", reply: "#7CC4FF", card: "#C6F25A", use: "#FFD15C" };
for (const key of ["hook", "type", "reply", "card", "use"]) {
  await png(path.join(DIR, `cap-${key}.png`), `
    <div style="position:absolute;top:96px;left:0;right:0;text-align:center">
      <div style="display:inline-block;width:56px;height:8px;border-radius:4px;background:${accent[key]};margin-bottom:26px"></div>
      <h1 style="margin:0;font-size:88px;line-height:1.14;font-weight:900;letter-spacing:-.02em;white-space:pre-line">${esc(C[key])}</h1>
    </div>`);
}
const icon = fs.readFileSync(path.join(ROOT, "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")).toString("base64");
await png(path.join(DIR, "end.png"), `
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0">
    <img src="data:image/png;base64,${icon}" style="width:220px;height:220px;border-radius:50%">
    <div style="margin-top:40px;font-size:64px;font-weight:800;letter-spacing:-.01em">languagebank</div>
    <h1 style="margin:46px 0 0;font-size:84px;line-height:1.16;font-weight:900;white-space:pre-line">${esc(C.endTitle)}</h1>
    <p style="margin:30px 0 0;font-size:38px;color:#B7B8BF">${esc(C.endSub)}</p>
    <div style="margin-top:80px;padding:26px 54px;border-radius:999px;background:#fff;color:#111;font-size:40px;font-weight:800">${esc(C.store)}</div>
  </div>`, { transparent: false });
await browser.close();

// ── 3. 튜터 목소리: 카드의 표현을 앱 TTS로(운영 /api/tts, 24kHz 원시 PCM) ──
let voice = null;
if (ev.expression) {
  // curl: 작업 공간 프록시에서 Node fetch가 끊길 때가 있다.
  const url = `${API}/api/tts?text=${encodeURIComponent(ev.expression)}&lang=${target === "en" ? "en-US" : "es-ES"}`;
  try {
    execFileSync("curl", ["-sSf", "-o", path.join(DIR, "voice.pcm"), "-H", `x-rc-user: promo-voice-${locale}`, url]);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", path.join(DIR, "voice.pcm"), path.join(DIR, "voice.wav")]);
    voice = path.join(DIR, "voice.wav");
  } catch {
    console.log("목소리 없이 만든다(TTS 실패).");
  }
}

// ── 4. ffmpeg: 장면 → 이어 붙이기 → 확대 → 프레임·자막·끝 화면·목소리 ──
const parts = timeline.map((s, i) => {
  let f = `[0:v]trim=start=${s.a.toFixed(3)}:end=${s.b.toFixed(3)},setpts=(PTS-STARTPTS)/${s.speed}`;
  if (s.zoom) {
    // 카드(화면 위쪽 1/3, 오른쪽 정렬 말풍선) 쪽으로 0.5초 동안 1.25배 확대 — 카드 오른쪽 끝이 잘리지 않게 창을 오른쪽으로.
    f += `,scale=w='824*(1+0.25*min(1,t/0.5))':h=-2:eval=frame,crop=824:1830:x='(in_w-824)*0.9':y='(in_h-1830)*0.2'`;
  }
  return `${f},fps=25,setsar=1[p${i}]`;
});
const concat = `${timeline.map((_, i) => `[p${i}]`).join("")}concat=n=${timeline.length}:v=1:a=0[phone]`;
const capInputs = ["hook", "type", "reply", "card", "use"];
const inputs = ["-i", path.join(DIR, "raw.mp4"), "-loop", "1", "-t", String(total), "-i", path.join(DIR, "bg.png"),
  "-loop", "1", "-t", String(total), "-i", path.join(DIR, "frame.png"),
  ...capInputs.flatMap((k) => ["-loop", "1", "-t", String(total), "-i", path.join(DIR, `cap-${k}.png`)]),
  "-loop", "1", "-t", String(END_CARD), "-i", path.join(DIR, "end.png")];
if (voice) inputs.push("-i", voice);
const endIdx = 3 + capInputs.length;
const between = (a, b) => `between(t,${a.toFixed(3)},${b.toFixed(3)})`;
const capWindows = Object.fromEntries(capInputs.map((k) => {
  const rows = timeline.filter((s) => s.cap === k);
  return [k, rows.length ? [rows[0].at, rows.at(-1).at + rows.at(-1).dur] : null];
}));
let chain = `[1:v][phonev]overlay=x=${PHONE.x}:y=${PHONE.y}:shortest=0[s0];[s0][2:v]overlay=0:0[s1]`;
let last = "s1";
capInputs.forEach((k, i) => {
  const w = capWindows[k];
  if (!w) return;
  chain += `;[${last}][${3 + i}:v]overlay=0:0:enable='${between(w[0], w[1])}'[c${i}]`;
  last = `c${i}`;
});
chain += `;[${endIdx}:v]setpts=PTS-STARTPTS+${phoneDur.toFixed(3)}/TB[endv];[${last}][endv]overlay=0:0:enable='gte(t,${phoneDur.toFixed(3)})'[v]`;
const phoneScale = `[phone]scale=${PHONE.w}:${PHONE.h},tpad=stop_mode=clone:stop_duration=${END_CARD}[phonev]`;
const cardAt = timeline.find((s) => s.zoom).at + 0.5;
const audio = voice
  ? `;[${endIdx + 1}:a]adelay=${Math.round(cardAt * 1000)}|${Math.round(cardAt * 1000)},apad,atrim=0:${total.toFixed(3)}[a]`
  : "";
const filter = [...parts, concat, phoneScale, chain].join(";") + audio;
const file = path.join(DIR, `promo-${locale}.mp4`);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[v]",
  ...(voice ? ["-map", "[a]", "-c:a", "aac", "-b:a", "160k"] : []),
  "-t", total.toFixed(3), "-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file]);
console.log(`${file}  ${total.toFixed(1)}초`);
console.log(timeline.map((s) => `${s.cap.padEnd(6)} ${s.at.toFixed(1)}–${(s.at + s.dur).toFixed(1)}s x${s.speed}${s.zoom ? " 확대" : ""}`).join("\n"));
