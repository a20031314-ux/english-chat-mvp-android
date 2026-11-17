// 위시켓 포트폴리오 표지 — 자르기 창 7:5(1680×1200)와 규격 문구 정사각(960×960) 두 장
import { chromium } from "playwright";
import fs from "node:fs";
const img = (n) => `data:image/png;base64,${fs.readFileSync(`raw/${n}.png`).toString("base64")}`;
const C = { sky: "#7CC4FF", green: "#5BE3A0", yellow: "#FFD15C", coral: "#FF8A6B" };
const phone = (n, { w, x, y, rot = 0, z = 1, glow = "", dim = false, h, pos = "top" }) =>
  `<div class="phone" style="width:${w}px;height:${h ?? Math.round(w * 844 / 390)}px;left:${x}px;top:${y}px;transform:rotate(${rot}deg);z-index:${z};${glow ? `box-shadow:0 0 0 1px #ffffff18,0 30px 60px -10px #000,0 0 90px -10px ${glow}88;` : ""}${dim ? "filter:brightness(.7);" : ""}"><img src="${img(n)}" style="object-position:${pos}"></div>`;
const CSS = (W, H) => `*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:"Noto Sans CJK KR",sans-serif;color:#F2F2F0;background:#0B0C0E;position:relative;letter-spacing:-0.03em;word-break:keep-all}
.glow{position:absolute;inset:0;background:radial-gradient(60% 70% at 78% 55%, ${C.coral}33, transparent 70%),radial-gradient(40% 40% at 95% 5%, ${C.green}22, transparent 70%),radial-gradient(40% 40% at 55% 100%, ${C.yellow}1a, transparent 70%)}
.phone{position:absolute;border-radius:26px;overflow:hidden;background:#000;border:5px solid #1c1d21;box-shadow:0 0 0 1px #ffffff14,0 30px 60px -10px #000}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.brand{font-weight:800;color:#fff}.brand b{color:${C.sky}}
h1{font-weight:900;line-height:1.16;letter-spacing:-0.045em}
h1 em{font-style:normal;color:${C.coral}}
.sub{color:#B9BBC2;line-height:1.5}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#ffffff10;border:1px solid #ffffff1c;font-weight:700;color:#EDEEF1;white-space:nowrap}
.dot{width:8px;height:8px;border-radius:50%}`;
const chips = (fs, pad) => `<div class="chips">${[["배우기", C.green], ["써 보기", C.coral], ["기록", C.sky]].map(([t, c], i) => `${i ? `<span style="color:#7a7d86;font-size:${fs}px;align-self:center">→</span>` : ""}<span class="chip" style="font-size:${fs}px;padding:${pad}"><span class="dot" style="background:${c}"></span>${t}</span>`).join("")}</div>`;

const wide = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(840, 600)}</style></head><body><div class="glow"></div>
<div style="position:absolute;left:52px;top:0;bottom:0;width:430px;display:flex;flex-direction:column;justify-content:center;z-index:5">
  <div class="brand" style="font-size:24px;margin-bottom:18px">language<b>bank</b></div>
  <h1 style="font-size:52px">말해 보고,<br>고치고,<br><em>쌓이는</em> 언어 학습</h1>
  <p class="sub" style="font-size:17px;margin-top:18px">AI 튜터와 통화·채팅으로 써 본 말에서<br>모르는 것을 찾아 다시 퀴즈로</p>
  <div style="margin-top:24px">${chips(15, "7px 13px")}</div>
</div>
${phone("my-home", { w: 200, x: 500, y: 130, rot: -8, z: 1, dim: true })}
${phone("call-fix", { w: 230, x: 590, y: 70, z: 3, glow: C.coral })}
</body></html>`;

const square = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(480, 480)}</style></head><body><div class="glow" style="background:radial-gradient(55% 70% at 78% 50%, ${C.coral}38, transparent 70%),radial-gradient(40% 40% at 0% 100%, ${C.green}1c, transparent 70%)"></div>
<div style="position:absolute;left:30px;top:0;bottom:0;width:240px;display:flex;flex-direction:column;justify-content:center;z-index:5">
  <div class="brand" style="font-size:17px;margin-bottom:12px">language<b>bank</b></div>
  <h1 style="font-size:36px">말해 보고,<br>고치고,<br><em>쌓이는</em><br>언어 학습</h1>
  <p class="sub" style="font-size:13px;margin-top:12px">AI 튜터와 말해 본 것에서<br>모르는 것을 다시 퀴즈로</p>
  <div style="margin-top:16px;display:flex;flex-direction:column;gap:7px;align-items:flex-start">
    ${[["배우기", C.green], ["써 보기", C.coral], ["기록", C.sky]].map(([t, c]) => `<span class="chip" style="font-size:13px;padding:5px 11px"><span class="dot" style="background:${c}"></span>${t}</span>`).join("")}
  </div>
</div>
${phone("call-fix", { w: 192, x: 262, y: 26, z: 3, glow: C.coral })}
</body></html>`;

const b = await chromium.launch();
for (const [name, html, w, h] of [["wishket-cover-7x5", wide, 840, 600], ["wishket-cover-square", square, 480, 480]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })).newPage();
  await p.setContent(html, { waitUntil: "load" }); await p.waitForTimeout(300);
  await p.screenshot({ path: `out/${name}.png` }); console.log(name);
}
await b.close();
