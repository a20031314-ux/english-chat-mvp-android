// 틱톡 사진 게시물(영어 계정 @languagebank_en): 표지 + 스토어 8장(장마다 배우는 언어를 바꿈) + 끝 장.
// 2026-10-26 사용자: "틱톡에 올릴 스크린샷, 영어 사용자 대상, 배우는 언어는 다양하게".
// 먼저 store-shots/combo/compose.mjs로 out/combo/를 만든다. 결과는 store-shots/out/tiktok/en/.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const COMBO = path.join(HERE, "../out/combo");
const OUT = path.join(HERE, "../out/tiktok/en");

// [장, 등록정보 폴더(배우는 언어)]
const SLIDES = [
  ["2-chat", "k4_en-learn-ko"],
  ["5-call", "t1_en-learn-ja"],
  ["3-ask", "0_default-english"],
  ["6-video", "t2_en-learn-zh"],
  ["1-map", "t1_en-learn-ja"],
  ["4-my", "k4_en-learn-ko"],
  ["7-room", "t2_en-learn-zh"],
  ["8-people", "0_default-english"],
];

const LANGS = [
  ["🇰🇷", "한국어"], ["🇯🇵", "日本語"], ["🇨🇳", "中文"], ["🇪🇸", "Español"], ["🇫🇷", "Français"], ["🇮🇹", "Italiano"], ["🇧🇷", "Português"],
  ["🇷🇺", "Русский"], ["🇸🇦", "العربية"], ["🇮🇩", "Indonesia"], ["🇻🇳", "Tiếng Việt"], ["🇹🇭", "ไทย"], ["🇮🇳", "हिन्दी"],
];
const FONT = "'Noto Sans','Noto Sans CJK JP','Noto Sans CJK SC','Noto Sans CJK KR','Noto Naskh Arabic','Noto Sans Thai','Noto Sans Devanagari','Noto Color Emoji',sans-serif";

const page = (body) => `<!doctype html><meta charset=utf-8><style>
body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#15161A;color:#fff;font-family:${FONT};display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;padding:0 64px;text-align:center}
.kicker{font-size:34px;font-weight:700;letter-spacing:.12em;color:#FF8A6B}
h1{font-size:118px;line-height:1.08;margin:36px 0 28px;font-weight:800}
h1 em{font-style:normal;color:#FFD15C}
.sub{font-size:40px;line-height:1.4;color:#B9BAC3;max-width:900px}
.langs{display:flex;flex-wrap:wrap;justify-content:center;gap:18px 18px;margin-top:72px;max-width:960px}
.lang{font-size:38px;padding:16px 28px;border-radius:999px;background:#22232A;outline:2px solid #34353C}
.lang b{margin-right:12px;font-weight:400}
.feat{display:flex;flex-direction:column;gap:26px;margin-top:64px;font-size:44px;text-align:left}
.feat div::before{content:"✓  ";color:#C6F25A;font-weight:800}
.cta{margin-top:90px;font-size:44px;font-weight:700;padding:30px 56px;border-radius:999px;background:#FFD15C;color:#15161A}
</style><body>${body}</body>`;

const COVER = page(`<div class="kicker">LANGUAGEBANK</div>
<h1>Learn <em>13 languages</em><br>in English</h1>
<div class="sub">Chat and call an AI tutor, study real videos, talk with other learners</div>
<div class="langs">${LANGS.map(([f, n]) => `<div class="lang"><b>${f}</b>${n}</div>`).join("")}</div>`);

const END = page(`<div class="kicker">LANGUAGEBANK</div>
<h1>Stop studying.<br><em>Start talking.</em></h1>
<div class="feat"><div>Write in English when you're stuck</div><div>Only your mistakes get fixed</div><div>No levels, no scores</div><div>Free to start</div></div>
<div class="cta">Free on Google Play</div>`);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const shot = async (html, name) => { await tab.setContent(html, { waitUntil: "load" }); await tab.waitForTimeout(400); await tab.screenshot({ path: path.join(OUT, name) }); };
await shot(COVER, "00-cover.png");
SLIDES.forEach(([s, folder], i) => fs.copyFileSync(path.join(COMBO, folder, `${s}.png`), path.join(OUT, `${String(i + 1).padStart(2, "0")}-${s.slice(2)}-${folder.split("learn-")[1] ?? "es"}.png`)));
await shot(END, "09-end.png");
await browser.close();
console.log(fs.readdirSync(OUT).join("\n"));
