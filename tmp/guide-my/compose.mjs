// 잘라 찍은 그림 + 기능 이름·설명 → 사용법 장면 한 장씩(tmp/guide-my/composed/*.png) + 미리보기 페이지.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/node_modules/")("playwright");
const RAW = path.resolve("tmp/guide-my/raw"), OUT = path.resolve("tmp/guide-my/composed");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const img = (n) => `data:image/png;base64,${fs.readFileSync(path.join(RAW, `${n}.png`)).toString("base64")}`;

const BANKS = [
  ["keep", "Quizbank", [
    { title: "Quizbank", desc: "퀴즈를 한 흐름으로 풀어요 — − · + 로 쉽게·어렵게", shots: ["keep-core"] },
    { title: "맞힐수록 다음 단계로", desc: "같은 문법·표현을 맞히면 한 단계씩 어려워지고, 틀리면 그 단계에서 다른 문장으로 다시", flow: [["keep-core", "고르기", 44, 170], ["type-spot", "틀린 곳 찾기", 0, 113], ["type-type", "문장 쓰기", 0, 120]] },
    { title: "부족한 곳을 계속 채워요", desc: "틀린 것, [다시]를 누른 것, 대화에서 막힌 것을 다시 내고, 자주 틀리는 종류를 더 많이 내요", shots: ["keep-after"] },
  ]],
  ["lang", "Languagebank", [
    { title: "Languagebank", desc: "배울 단어·표현·문법이 단계별로 — 찾기도 여기서", shots: ["lang-core"] },
    { title: "묶음 ▶ 넘겨 보기", desc: "주제·단계 묶음을 카드로 넘기며 뜻·단어·예문을 떠올려요", shots: ["lang-bundle", "lang-flip"] },
    { title: "단어 화면", desc: "한 단어의 뜻 여러 개와 예문을 한눈에", shots: ["lang-word"] },
  ]],
  ["log", "Logbank", [
    { title: "Logbank", desc: "주·월마다 배운 것 — 퀴즈로 배운 수(학습), 대화에서 쓴 수(활용)", shots: ["log-core"] },
    { title: "그날 학습", desc: "날을 누르면 언제 무엇을 했는지 시간 순서로", shots: ["log-timeline"] },
    { title: "맞음 ✓ · 틀림 ✗", desc: "한 번 한 공부의 단어·문법·표현마다 결과가 남아요", shots: ["log-session"] },
  ]],
];

const css = `*{box-sizing:border-box;margin:0}body{background:#000;font-family:'Noto Sans CJK KR','Noto Sans KR',sans-serif}
.s{width:390px;height:700px;background:#0d0d0d;border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.cap{background:#FFD60A;color:#111;border-radius:16px;padding:12px 16px}.cap b{display:block;font-size:20px;font-weight:800;margin-bottom:4px}.cap span{font-size:15px;line-height:1.45;font-weight:500}
.shots{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;justify-content:center;align-items:center}
.shots img{max-width:100%;min-height:0;object-fit:contain;border-radius:14px;border:1px solid #2c2c2c}
.grid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px}
.cell{min-height:0;display:flex;flex-direction:column;gap:4px;background:#161616;border:1px solid #2c2c2c;border-radius:12px;padding:6px;overflow:hidden}
.ar{text-align:center;color:#FFD60A;font-weight:800;font-size:14px;margin:-2px 0}.st{flex:1;justify-content:center;min-height:0;display:flex;flex-direction:column;gap:8px}.sc{position:relative;overflow:hidden;border-radius:12px;border:1px solid #2c2c2c;flex:none}.sc img{width:100%;display:block}.sc em{position:absolute;right:6px;top:6px;font-style:normal;font-size:12px;font-weight:800;background:#FFD60A;color:#111;border-radius:999px;padding:2px 8px}
.cell em{font-style:normal;font-size:12px;font-weight:700;color:#FFD60A}.cell img{width:100%;min-height:0;flex:1;object-fit:contain;object-position:top}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 740 }, deviceScaleFactor: 2 });
const data = {};
for (const [id, , slides] of BANKS) {
  data[id] = [];
  for (const [i, s] of slides.entries()) {
    const body = s.flow
      ? `<div class="st">${s.flow.map(([n, l, off, h], i) => `${i ? '<div class="ar">↓ 맞히면</div>' : ""}<div class="sc" style="height:${Math.round(h * 358 / 386)}px"><img src="${img(n)}" style="margin-top:-${Math.round(off * 358 / 386)}px"><em>${l}</em></div>`).join("")}</div>`
      : s.stack
      ? `<div class="st">${s.stack.map(([n, l, h]) => `<div class="sc" style="height:${Math.round(h * 358 / 386)}px"><img src="${img(n)}"><em>${l}</em></div>`).join("")}</div>`
      : s.grid
      ? `<div class="grid">${s.grid.map(([n, l]) => `<div class="cell"><em>${l}</em><img src="${img(n)}"></div>`).join("")}</div>`
      : `<div class="shots">${s.shots.map((n) => `<img src="${img(n)}" style="max-height:${Math.floor(520 / s.shots.length)}px">`).join("")}</div>`;
    await page.setContent(`<style>${css}</style><div class="s"><div class="cap"><b></b><span></span></div>${body}</div>`);
    await page.evaluate(([t, d]) => { document.querySelector(".cap b").textContent = t; document.querySelector(".cap span").textContent = d; }, [s.title, s.desc]);
    await page.waitForTimeout(200);
    const file = path.join(OUT, `${id}-${i + 1}.png`);
    await page.locator(".s").screenshot({ path: file });
    data[id].push({ src: `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`, title: s.title });
  }
}
await browser.close();

const banks = BANKS.map(([id, name]) => [id, name]);
const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My 탭 사용법 미리보기</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0b0b0b;color:#eee;font-family:-apple-system,'Noto Sans KR',sans-serif;display:flex;justify-content:center}
.sheet{width:100%;max-width:420px;padding:16px 14px 28px}h1{font-size:17px;margin:4px 2px 12px}
.row{display:flex;gap:6px;overflow-x:auto;margin-bottom:8px;scrollbar-width:none}
.chip{flex:none;border:1px solid #333;background:none;color:#aaa;border-radius:999px;padding:6px 12px;font-size:13px}
.chip.on{background:#2a2a2a;color:#fff;border-color:#666;font-weight:700}.chip:disabled{opacity:.35}
.bank .chip.on{background:#FFD60A;color:#111;border-color:#FFD60A}
.track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin-top:6px;scrollbar-width:none}.track::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:center}.slide img{width:100%;display:block;border-radius:22px}
.nav{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.nav button{background:#1c1c1c;border:1px solid #333;color:#ddd;border-radius:999px;width:36px;height:36px;font-size:16px}
.dots{display:flex;gap:6px}.dot{width:7px;height:7px;border-radius:50%;background:#444}.dot.on{background:#FFD60A;width:18px;border-radius:4px}</style></head>
<body><div class="sheet"><h1>사용법</h1>
<div class="row"><button class="chip on">My</button><button class="chip" disabled>대화</button><button class="chip" disabled>통화</button><button class="chip" disabled>영상 학습</button><button class="chip" disabled>사람</button><button class="chip" disabled>Room</button></div>
<div class="row bank" id="banks"></div><div class="track" id="track"></div>
<div class="nav"><button id="prev" aria-label="이전">‹</button><div class="dots" id="dots"></div><button id="next" aria-label="다음">›</button></div></div>
<script>const BANKS=${JSON.stringify(banks)},DATA=${JSON.stringify(data)};let bank=BANKS[0][0];
const track=document.getElementById('track'),dots=document.getElementById('dots');
function draw(){document.getElementById('banks').innerHTML=BANKS.map(([id,n])=>'<button class="chip '+(id===bank?'on':'')+'" data-b="'+id+'">'+n+'</button>').join('');
document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bank=b.dataset.b;draw();});
track.innerHTML=DATA[bank].map(s=>'<div class="slide"><img src="'+s.src+'" alt="'+s.title+'"></div>').join('');track.scrollLeft=0;mark();}
const at=()=>Math.round(track.scrollLeft/track.clientWidth);
function mark(){const n=DATA[bank].length,i=Math.min(n-1,at());dots.innerHTML=Array.from({length:n},(_,k)=>'<span class="dot '+(k===i?'on':'')+'"></span>').join('');}
function go(i){const n=DATA[bank].length;track.scrollTo({left:Math.max(0,Math.min(n-1,i))*track.clientWidth,behavior:'smooth'});}
track.addEventListener('scroll',()=>requestAnimationFrame(mark));
document.getElementById('prev').onclick=()=>go(at()-1);document.getElementById('next').onclick=()=>go(at()+1);draw();</script></body></html>`;
fs.writeFileSync("tmp/guide-my/my-guide-preview.html", html);
console.log(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])), Math.round(html.length / 1024), "KB");
