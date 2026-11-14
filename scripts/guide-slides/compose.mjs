// 사용법 넘겨 보기 장면 한 장씩 만들기: 잘라 찍은 그림(shoot.mjs → tmp/guide-slides/raw) + 기능 이름·설명(src/lib/guide/slides.ts)
// → public/guide/<앱 언어>/<shot>.webp. 저장소 맨 위에서 node --experimental-strip-types scripts/guide-slides/compose.mjs [ko]
// 장면마다 어느 그림을 어떻게 놓을지는 아래 LAYOUT(shot 이름 → 그림). 글은 slides.ts 하나에서만 고친다.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/node_modules/")("playwright");
const { guideSlides } = await import(path.resolve("src/lib/guide/slides.ts"));

const locale = process.argv[2] || "ko";
const RAW = path.resolve("tmp/guide-slides/raw"), WORK = path.resolve("tmp/guide-slides/composed"), OUT = path.resolve(`public/guide/${locale}`);
fs.mkdirSync(WORK, { recursive: true });
const img = (n) => `data:image/png;base64,${fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64")}`;

/** shots: 위아래로 그대로 · flow: [그림, 이름표, 위에서 자를 px, 높이 px] 사이에 "↓ 맞히면". */
const LAYOUT = {
  "my-keep-1": { shots: ["keep-core"] },
  "my-keep-2": { flow: [["keep-core", "고르기", 36, 220], ["type-spot", "틀린 곳 찾기", 0, 113], ["type-type", "문장 쓰기", 0, 120]], arrow: "↓ 맞히면" },
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
  "call-lesson-1": { shots: ["call-lesson"] },
  "call-lesson-2": { shots: ["call-fix-card"] },
  "call-game-1": { shots: ["call-twenty"] },
  "call-teach-1": { shots: ["call-teach"] },
  "call-past-1": { flow: [["call-records", "통화 기록", 0, 81], ["call-review", "돌아보기", 0, 380]], arrow: "↓", base: 390 },
  "call-past-2": { shots: ["call-recap"] },
};

const css = `*{box-sizing:border-box;margin:0}body{background:#000;font-family:'Noto Sans CJK KR','Noto Sans KR',sans-serif}
.s{width:390px;height:700px;background:#0d0d0d;border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.cap{background:#FFD60A;color:#111;border-radius:16px;padding:12px 16px}.cap b{display:block;font-size:20px;font-weight:800;margin-bottom:4px}.cap span{font-size:15px;line-height:1.45;font-weight:500}
.shots{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;justify-content:center;align-items:center}
.shots img{max-width:100%;min-height:0;object-fit:contain;border-radius:14px;border:1px solid #2c2c2c}
.st{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;justify-content:center}.ar{text-align:center;color:#FFD60A;font-weight:800;font-size:14px;margin:-2px 0}
.sc{position:relative;overflow:hidden;border-radius:12px;border:1px solid #2c2c2c;flex:none}.sc img{width:100%;display:block}
.sc em{position:absolute;right:6px;top:6px;font-style:normal;font-size:12px;font-weight:800;background:#FFD60A;color:#111;border-radius:999px;padding:2px 8px}`;

const chapters = guideSlides(locale);
if (!chapters) throw new Error(`slides.ts에 ${locale} 장면이 없음`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 740 }, deviceScaleFactor: 2 });
for (const groups of Object.values(chapters)) {
  for (const group of groups) {
    for (const slide of group.slides) {
      const lay = LAYOUT[slide.shot];
      if (!lay) throw new Error(`LAYOUT에 ${slide.shot} 없음`);
      const body = lay.flow
        ? `<div class="st">${lay.flow.map(([n, label, off, h], i) => `${i ? `<div class="ar">${lay.arrow}</div>` : ""}<div class="sc" style="height:${Math.round((h * 358) / (lay.base ?? 386))}px"><img src="${img(n)}" style="margin-top:-${Math.round((off * 358) / (lay.base ?? 386))}px"><em>${label}</em></div>`).join("")}</div>`
        : `<div class="shots">${lay.shots.map((n) => `<img src="${img(n)}" style="max-height:${Math.floor(520 / lay.shots.length)}px">`).join("")}</div>`;
      await page.setContent(`<style>${css}</style><div class="s"><div class="cap"><b></b><span></span></div>${body}</div>`);
      await page.evaluate(([t, d]) => { document.querySelector(".cap b").textContent = t; document.querySelector(".cap span").textContent = d; }, [slide.title, slide.desc]);
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
