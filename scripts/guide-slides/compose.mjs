// 사용법 넘겨 보기 장면 한 장씩 만들기: 잘라 찍은 그림(shoot*.mjs·crop-tabs.mjs → tmp/guide-slides/raw) + 문구 한 줄(src/lib/guide/slides.ts title)
// → public/guide/<앱 언어>/<shot>.webp. 저장소 맨 위에서 node --experimental-strip-types scripts/guide-slides/compose.mjs [ko]
// 장면마다 어느 그림을 어떻게 놓을지는 아래 LAYOUT(shot 이름 → 그림). 글은 slides.ts 하나에서만 고친다.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/node_modules/")("playwright");
const { slidesFor } = await import(path.resolve("src/lib/guide/slides.ts"));
const { loadCopy } = await import(path.resolve("scripts/ux-check/lib.mjs"));

const locale = process.argv[2] || "ko";
const RAW = path.resolve(`tmp/guide-slides/raw/${locale}`), WORK = path.resolve(`tmp/guide-slides/composed/${locale}`), OUT = path.resolve(`public/guide/${locale}`);
fs.mkdirSync(WORK, { recursive: true });
const img = (n) => `data:image/png;base64,${fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64")}`;

/** 흐름 그림 이름표(앱 언어) — 사다리 단계와 화살표. {ui:키}는 화면 문구 그대로. */
const LABELS = {
  ko: { choose: "고르기", spot: "틀린 곳 찾기", write: "문장 쓰기", right: "맞히면" },
  en: { choose: "Choose", spot: "Find the mistake", write: "Write a sentence", right: "If correct" },
  es: { choose: "Elegir", spot: "Encontrar el error", write: "Escribir una frase", right: "Si aciertas" },
  ja: { choose: "選ぶ", spot: "間違い探し", write: "文を書く", right: "正解したら" },
  zh: { choose: "选择", spot: "找错", write: "写句子", right: "答对后" },
  vi: { choose: "Chọn", spot: "Tìm lỗi sai", write: "Viết câu", right: "Nếu đúng" },
  fr: { choose: "Choisir", spot: "Trouver l'erreur", write: "Écrire une phrase", right: "Si c'est juste" },
  it: { choose: "Scegli", spot: "Trova l'errore", write: "Scrivi una frase", right: "Se è giusto" },
  pt: { choose: "Escolher", spot: "Achar o erro", write: "Escrever uma frase", right: "Se acertar" },
  ru: { choose: "Выбор", spot: "Найти ошибку", write: "Написать фразу", right: "Если верно" },
  id: { choose: "Pilih", spot: "Cari kesalahan", write: "Tulis kalimat", right: "Jika benar" },
  ar: { choose: "اختيار", spot: "اكتشاف الخطأ", write: "كتابة جملة", right: "إذا أصبت" },
  th: { choose: "เลือก", spot: "หาจุดผิด", write: "เขียนประโยค", right: "ถ้าตอบถูก" },
  hi: { choose: "चुनें", spot: "गलती ढूँढें", write: "वाक्य लिखें", right: "सही होने पर" },
};
const label = (key) => (key.startsWith("{ui:") ? ui[key.slice(4, -1)] : (LABELS[locale] ?? LABELS.en)[key] ?? key);
/** shots: 위아래로 그대로 · flow: [그림, 이름표, 위에서 자를 px, 높이 px] 사이에 "↓ 맞히면". */
const LAYOUT = {
  "my-keep-1": { shots: ["keep-core"] },
  "my-keep-2": { flow: [["keep-core", "choose", 36, 220], ["type-spot", "spot", 0, 113], ["type-type", "write", 0, 120]], arrow: "right" },
  "my-keep-3": { shots: ["keep-after"] },
  "my-lang-1": { shots: ["lang-core"] },
  "my-lang-2": { shots: ["lang-bundle", "lang-flip"] },
  "my-lang-3": { shots: ["lang-word"] },
  "my-log-1": { shots: ["log-core"] },
  "my-log-2": { shots: ["log-timeline"] },
  "my-log-3": { shots: ["log-session"] },
  "tab-chat-1": { shots: ["tab-chat-1"] },
  "tab-chat-2": { shots: ["tab-chat-2"] },
  "tab-chat-3": { shots: ["tab-chat-3"] },
  "tab-talk-1": { shots: ["tab-talk-1"] },
  "tab-talk-2": { shots: ["tab-talk-2"] },
  "tab-talk-3": { shots: ["tab-talk-3"] },
  "tab-video-1": { shots: ["tab-video-1"] },
  "tab-video-2": { shots: ["tab-video-2"] },
  "tab-video-3": { shots: ["tab-video-3"] },
  "tab-people-1": { shots: ["tab-people-1"] },
  "tab-people-2": { shots: ["tab-people-2"] },
  "tab-rooms-1": { shots: ["tab-rooms-1"] },
  "tab-rooms-2": { shots: ["tab-rooms-2"] },
  "call-talk-1": { shots: ["call-talk"] },
  "call-talk-2": { shots: ["call-quiet"] },
  "call-past-1": { flow: [["call-records", "{ui:callRecordsTitle}", 0, 81], ["call-review", "{ui:packSeeRetro}", 0, 380]], arrow: "", base: 390 },
  "call-past-2": { shots: ["call-recap"] },
};

/** 앱 언어마다 글꼴(CJK는 그 나라 판, 타이·아랍·힌디는 Noto). */
const FONT = { ko: "'Noto Sans CJK KR'", ja: "'Noto Sans CJK JP'", zh: "'Noto Sans CJK SC'", th: "'Noto Sans Thai','Noto Sans'", ar: "'Noto Sans Arabic','Noto Sans'", hi: "'Noto Sans Devanagari','Noto Sans'" };
// 문구 한 줄이 스크린샷 안에(사용자 2026-11-16 "설명 아래 스크린샷이 아니라 스크린샷 안에 문구 — 상세 설명은 빼고"):
// 그림은 아래에 붙고, 위쪽은 어둡게 이어지며 그 위에 큰 흰 글씨 한 줄.
const css = `*{box-sizing:border-box;margin:0}body{background:#000;font-family:${FONT[locale] ?? "'Noto Sans','Noto Sans CJK KR'"},sans-serif}
.s{position:relative;width:390px;height:700px;background:#0b0b0b;border-radius:22px;overflow:hidden}
.body{position:absolute;left:0;right:0;bottom:0;max-height:560px;display:flex;flex-direction:column;justify-content:flex-end}
.one{width:100%;display:block}
.many{padding:0 14px 16px;display:flex;flex-direction:column;gap:8px;align-items:center}
.many img{max-width:100%;min-height:0;object-fit:contain;border-radius:14px;border:1px solid #2c2c2c}
.ar{text-align:center;color:#FFD60A;font-weight:800;font-size:14px;margin:-2px 0}
.sc{position:relative;overflow:hidden;border-radius:12px;border:1px solid #2c2c2c;flex:none;width:100%}.sc img{width:100%;display:block}
.sc em{position:absolute;right:6px;top:6px;font-style:normal;font-size:12px;font-weight:800;background:#FFD60A;color:#111;border-radius:999px;padding:2px 8px}
.fade{position:absolute;left:0;right:0;top:0;height:280px;background:linear-gradient(#0b0b0b 0%,#0b0b0b 50%,rgba(11,11,11,0) 100%)}
.t{position:absolute;left:26px;right:26px;top:48px;color:#fff;font-size:30px;line-height:1.28;font-weight:800;letter-spacing:-.5px}`;

const ui = (await loadCopy())[locale];
const chapters = slidesFor(locale);
if (!chapters) throw new Error(`slides.ts에 ${locale} 장면이 없음`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 740 }, deviceScaleFactor: 2 });
for (const groups of Object.values(chapters)) {
  for (const group of groups) {
    for (const slide of group.slides) {
      // ONLY=call-talk-2,call-past-2: 그 장면만 다시 만든다(다른 장면의 raw 그림이 없어도).
      if (process.env.ONLY && !process.env.ONLY.split(",").includes(slide.shot)) continue;
      let lay = LAYOUT[slide.shot];
      if (!lay) throw new Error(`LAYOUT에 ${slide.shot} 없음`);
      // 흐름 그림 중 이 언어에서 못 찍은 단계(예: 문장 쓰기 문제가 안 나옴)는 빼고 이어 붙인다 — 둘은 남아야 흐름.
      if (lay.flow) {
        const have = lay.flow.filter(([n]) => fs.existsSync(path.join(RAW, `${n}.png`)));
        if (have.length < 2) throw new Error(`${locale} ${slide.shot}: 흐름 그림이 모자람`);
        lay = { ...lay, flow: have };
      }
      const k = (px) => Math.round((px * 362) / (lay.base ?? 386));
      const body = lay.flow
        ? `<div class="many">${lay.flow.map(([n, name, off, h], i) => `${i ? `<div class="ar">↓ ${lay.arrow ? label(lay.arrow) : ""}</div>` : ""}<div class="sc" style="height:${k(h)}px"><img src="${img(n)}" style="margin-top:-${k(off)}px"><em>${label(name)}</em></div>`).join("")}</div>`
        : lay.shots.length > 1
          ? `<div class="many">${lay.shots.map((n) => `<img src="${img(n)}" style="max-height:${Math.floor(500 / lay.shots.length)}px">`).join("")}</div>`
          : `<img class="one" src="${img(lay.shots[0])}">`;
      await page.setContent(`<style>${css}</style><div class="s"><div class="body">${body}</div><div class="fade"></div><div class="t" dir="auto"></div></div>`);
      await page.evaluate((t) => { document.querySelector(".t").textContent = t; }, slide.title);
      await page.waitForTimeout(150);
      const png = path.join(WORK, `${slide.shot}.png`);
      await page.locator(".s").screenshot({ path: png });
      execFileSync("python3", ["-c", `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert("RGB")
im=im.resize((720,round(im.height*720/im.width)),Image.LANCZOS)
im.save(sys.argv[2],"WEBP",quality=84)
`, png, path.join(OUT, `${slide.shot}.webp`)]);
      console.log(`${locale}/${slide.shot}.webp`);
    }
  }
}
await browser.close();
