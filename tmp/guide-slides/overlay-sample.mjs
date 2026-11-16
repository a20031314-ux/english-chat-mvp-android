import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/node_modules/")("playwright");
const RAW = "tmp/guide-slides/raw", OUT = "tmp/guide-slides/overlay"; fs.mkdirSync(OUT, { recursive: true });
const img = (n) => `data:image/png;base64,${fs.readFileSync(`${RAW}/${n}.png`).toString("base64")}`;
const S = [
  ["tab-people-2", "다른 사람과 교류하세요", "같은 언어를 배우는 사람에게 묻고, 메이트를 구해요"],
  ["call-lesson", "튜터와 수업 통화", "칠판의 문장구조로 내 이야기를 말해 봐요"],
  ["tab-video-2", "좋아하는 영상으로 배우세요", "자막 한 줄씩 듣고, 모르는 말은 바로"],
  ["log-core", "배운 것이 쌓여요", "주·월마다 퀴즈로 배운 것, 대화에서 쓴 것"],
];
const css = `*{margin:0;box-sizing:border-box}body{background:#000;font-family:'Noto Sans CJK KR',sans-serif}
.s{position:relative;width:390px;height:700px;border-radius:22px;overflow:hidden;background:#0b0b0b}
.s img{position:absolute;left:0;bottom:0;width:100%}
.fade{position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(#0b0b0b 0%,#0b0b0b 45%,rgba(11,11,11,0) 100%)}
.t{position:absolute;left:24px;right:24px;top:44px;color:#fff}.t b{display:block;font-size:30px;line-height:1.25;font-weight:800;letter-spacing:-.5px}.t span{display:block;margin-top:10px;font-size:16px;line-height:1.45;color:#FFD60A;font-weight:600}`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 740 }, deviceScaleFactor: 2 });
for (const [n, t, d] of S) {
  await p.setContent(`<style>${css}</style><div class="s"><img src="${img(n)}"><div class="fade"></div><div class="t"><b></b><span></span></div></div>`);
  await p.evaluate(([t, d]) => { document.querySelector(".t b").textContent = t; document.querySelector(".t span").textContent = d; }, [t, d]);
  await p.waitForTimeout(150); await p.locator(".s").screenshot({ path: `${OUT}/${n}.png` });
}
await b.close();
