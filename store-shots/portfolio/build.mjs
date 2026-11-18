// 포트폴리오 표지·기능 장(2026-11-18). 저장소 밖 빈 폴더에서 playwright 설치 뒤 shoot.mjs → call.mjs → build.mjs 순서(경로 raw/·out/은 그 폴더 기준, shoot.mjs의 OUT도 맞춰 고칠 것). 운영 웹을 찍고 시험 사용자 simcheck-portfolio-…는 끝에 지움. Logbank 숫자·곡선은 이 폰 장부에 넣은 보여 주기용 기록.
// 포트폴리오 표지 + 기능 장 6장 (1920×1080 PNG) → out/
import { chromium } from "playwright";
import fs from "node:fs";
fs.mkdirSync("out", { recursive: true });
const img = (n) => `data:image/png;base64,${fs.readFileSync(`raw/${n}.png`).toString("base64")}`;

const C = { sky: "#7CC4FF", green: "#5BE3A0", yellow: "#FFD15C", coral: "#FF8A6B", violet: "#B49CFF" };

const phone = (n, { w = 330, x = 0, y = 0, rot = 0, z = 1, glow = "", dim = false, pos = "top" } = {}) =>
  `<div class="phone" style="width:${w}px;height:${Math.round(w * 844 / 390)}px;left:${x}px;top:${y}px;transform:rotate(${rot}deg);z-index:${z};${glow ? `box-shadow:0 0 0 1px #ffffff14,0 40px 90px -20px #000,0 0 120px -30px ${glow};` : ""}${dim ? "filter:brightness(.82);" : ""}">
     <img src="${img(n)}" style="object-position:${pos}">
   </div>`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:1920px;height:1080px;overflow:hidden;font-family:"Noto Sans CJK KR","Noto Sans KR",sans-serif;color:#F2F2F0;background:#0B0C0E;position:relative;letter-spacing:-0.02em;word-break:keep-all}
.bg{position:absolute;inset:0;background:
  radial-gradient(900px 600px at 78% 40%, var(--a,#7CC4FF)22, transparent 70%),
  radial-gradient(700px 500px at 10% 100%, #ffffff08, transparent 70%);}
.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(90deg,transparent,#000 40%,#000 80%,transparent)}
.phone{position:absolute;border-radius:44px;overflow:hidden;background:#000;border:8px solid #1b1c20;box-shadow:0 0 0 1px #ffffff14,0 40px 90px -20px #000}
.phone img{width:100%;height:100%;object-fit:cover;display:block}
.text{position:absolute;left:120px;top:0;bottom:0;width:720px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font-size:22px;font-weight:700;letter-spacing:.08em;color:var(--a);text-transform:uppercase;margin-bottom:26px;display:flex;align-items:center;gap:14px}
.eyebrow i{display:inline-block;width:36px;height:3px;background:var(--a);border-radius:2px}
h1{font-size:68px;line-height:1.18;font-weight:800;letter-spacing:-0.035em}
h1 em{font-style:normal;color:var(--a)}
.lead{font-size:26px;line-height:1.6;color:#B9BBC2;margin-top:28px;font-weight:400}
ul.pts{list-style:none;margin-top:44px;display:flex;flex-direction:column;gap:22px}
ul.pts li{display:flex;gap:18px;align-items:flex-start;font-size:24px;line-height:1.5;color:#D9DAE0}
ul.pts li b{color:#fff;font-weight:700}
ul.pts .ic{flex:none;width:44px;height:44px;border-radius:12px;background:#ffffff0d;border:1px solid #ffffff14;display:grid;place-items:center;font-size:22px}
.foot{position:absolute;left:120px;bottom:56px;font-size:18px;color:#6E717B;display:flex;gap:18px;align-items:center}
.foot b{color:#C9CBD2;font-weight:700;letter-spacing:-0.01em}
.num{position:absolute;right:80px;bottom:52px;font-size:18px;color:#6E717B;font-weight:700;letter-spacing:.1em}
.chip{display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;background:#ffffff0b;border:1px solid #ffffff17;font-size:21px;color:#E6E7EB;font-weight:500}
.cover .loop .chip{font-size:18px;padding:10px 16px;gap:8px}
.dot{width:10px;height:10px;border-radius:50%}
`;

const page = (accent, body, n) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body class="${n ? "" : "cover"}" style="--a:${accent}"><div class="bg"></div><div class="grid"></div>${body}
<div class="foot"><b>languagebank</b><span>AI 어학 앱 · Android · Web</span></div>${n ? `<div class="num">${n} / 06</div>` : ""}</body></html>`;

const loop = `
<div class="loop" style="display:flex;align-items:center;gap:12px;margin-top:46px;white-space:nowrap">
  <span class="chip"><span class="dot" style="background:${C.green}"></span>배우기 <span style="color:#8a8d96">Quizbank · Languagebank</span></span>
  <span style="color:#6E717B;font-size:24px">→</span>
  <span class="chip"><span class="dot" style="background:${C.coral}"></span>써 보기 <span style="color:#8a8d96">AI 통화 · 채팅</span></span>
  <span style="color:#6E717B;font-size:24px">→</span>
  <span class="chip"><span class="dot" style="background:${C.sky}"></span>기록 <span style="color:#8a8d96">Logbank</span></span>
</div>`;

const pages = {};

// 표지
pages.cover = page(C.sky, `
<div style="position:absolute;inset:0;background:radial-gradient(800px 700px at 76% 52%, ${C.coral}26, transparent 65%),radial-gradient(600px 500px at 92% 10%, ${C.green}1c, transparent 70%),radial-gradient(500px 500px at 58% 95%, ${C.yellow}14, transparent 70%)"></div>
<div class="text" style="width:820px">
  <div class="eyebrow"><i></i>Language learning app</div>
  <div style="font-size:30px;font-weight:800;letter-spacing:-0.01em;margin-bottom:22px;color:#fff">language<span style="color:${C.sky}">bank</span></div>
  <h1 style="font-size:76px">말해 보고, 고치고,<br><em style="color:${C.coral}">쌓이는</em> 언어 학습</h1>
  <p class="lead">AI 튜터와 직접 통화하고 채팅하며 써 본 말에서<br>모르는 것을 찾아, 다시 퀴즈로 돌려주는 어학 앱</p>
  ${loop}
  <div style="margin-top:34px;font-size:20px;color:#8a8d96">14개 학습 언어 × 14개 앱 언어 · 일본어·중국어·태국어·아랍어(RTL)까지</div>
</div>
${phone("my-home", { w: 320, x: 1110, y: 200, rot: -7, z: 1, dim: true })}
${phone("quiz-after-choose", { w: 320, x: 1500, y: 230, rot: 7, z: 1, dim: true })}
${phone("call-fix", { w: 360, x: 1290, y: 120, z: 3, glow: C.coral })}
`, "");

// 01 핵심 가치
const val = (ic, color, t, d) => `<div style="background:#ffffff08;border:1px solid #ffffff12;border-radius:24px;padding:30px 30px 32px;display:flex;flex-direction:column;gap:14px">
  <div style="width:52px;height:52px;border-radius:14px;background:${color}22;color:${color};display:grid;place-items:center;font-size:26px">${ic}</div>
  <div style="font-size:27px;font-weight:800;line-height:1.3">${t}</div>
  <div style="font-size:20px;line-height:1.6;color:#AEB0B8">${d}</div></div>`;
pages["01-values"] = page(C.green, `
<div style="position:absolute;left:120px;top:190px;right:120px">
  <div class="eyebrow"><i></i>Core values</div>
  <h1 style="font-size:60px">정답을 외우는 앱이 아니라,<br><em>직접 해 본 것</em>에서 배우는 앱</h1>
  ${loop}
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:56px">
    ${val("✍", C.coral, "먼저 해 보고,<br>그다음 고친다", "정답을 먼저 보여 주지 않습니다. 말하거나 써 본 뒤에 고친 문장을 보여 줍니다.")}
    ${val("✎", C.yellow, "고침은 내 문장<br>바로 아래", "교정은 길게 설명하지 않고, 그 문장 밑 카드 한 장으로 보여 줍니다.")}
    ${val("💬", C.violet, "막혀도 대화는<br>끊기지 않는다", "편한 말로 써도 튜터가 학습 언어로 이어 가고, 필요할 때만 표현을 엽니다.")}
    ${val("◷", C.sky, "레벨이 아니라<br>있었던 일", "A1·초급 같은 등급 대신, 실제로 답하고 써 본 기록을 보여 줍니다.")}
  </div>
</div>`, "01");

const feature = (accent, eyebrow, title, lead, pts, phones, n) => page(accent, `
<div class="text">
  <div class="eyebrow"><i></i>${eyebrow}</div>
  <h1>${title}</h1>
  <p class="lead">${lead}</p>
  <ul class="pts">${pts.map(([ic, t]) => `<li><span class="ic">${ic}</span><span>${t}</span></li>`).join("")}</ul>
</div>${phones}`, n);

pages["02-call"] = feature(C.coral, "AI 통화", "튜터와 말해 보고,<br><em>고친 말은 카드로</em>",
  "말하는 흐름을 끊지 않도록, 교정은 화면 카드로만 보여 줍니다.",
  [["📞", "<b>통화 문 넷</b> — 자유대화 · 수업 · 게임(스무고개) · 가르치기"],
   ["✎", "<b>자유대화</b>는 말로 짚지 않고 내 얼굴 아래 카드로"],
   ["🎓", "<b>수업</b>은 튜터가 짚고 다시 말해 보기, 끝나면 숙제"],
   ["🧾", "<b>통화 정리</b> — 이렇게 말할 수 있었어요 · 같이 배우기"]],
  phone("g-call-recap", { w: 330, x: 1450, y: 150, rot: 5, z: 1, dim: true }) + phone("call-fix", { w: 360, x: 1060, y: 120, z: 2, glow: C.coral }), "02");

pages["03-chat"] = feature(C.violet, "AI 채팅", "막히면 편한 말로,<br><em>대화는 그대로</em>",
  "입력창은 하나. 학습 언어로 쓰면 대화, 편한 말로 쓰면 튜터가 학습 언어로 이어 갑니다.",
  [["✎", "<b>고칠 곳</b> 표시 — 누르면 고친 문장이 내 말 바로 아래에"],
   ["💡", "<b>이렇게 말해요</b> — 편한 말로 쓴 문장을 학습 언어 표현으로"],
   ["🧩", "<b>같이 배우기</b> — 그 표현의 문장구조·문법 수업으로 바로"],
   ["🔁", "막힌 표현은 <b>Quizbank</b>로 다시 돌아옴"]],
  phone("g-chat-expression", { w: 330, x: 1450, y: 150, rot: 5, z: 1, dim: true }) + phone("g-chat-correct", { w: 360, x: 1060, y: 120, z: 2, glow: C.violet }), "03");

pages["04-quiz"] = feature(C.green, "Quizbank", "틀린 것만 다시,<br><em>그럴듯한 오답</em>으로",
  "새 묶음과 다시 볼 것을 한 흐름으로. 대화에서 막힌 것이 먼저 나옵니다.",
  [["🪜", "<b>사다리</b> — 고르기 → 빈칸 쓰기 → 틀린 곳 → 뜻 보고 문장 쓰기"],
   ["🎯", "오답은 정답의 <b>흔한 실수 꼴</b>(활용·관사·어순)"],
   ["↺", "맞힌 것은 저절로 다시 내지 않고, <b>틀린 것·막힌 것만</b>"],
   ["±", "<b>난이도 게이지</b>로 쉽게·어렵게 직접 조절"]],
  phone("quiz-1", { w: 300, x: 1000, y: 210, rot: -6, z: 1, dim: true }) + phone("quiz-spot", { w: 300, x: 1530, y: 210, rot: 6, z: 1, dim: true }) + phone("quiz-after-choose", { w: 340, x: 1250, y: 130, z: 2, glow: C.green }), "04");

pages["05-lang"] = feature(C.yellow, "Languagebank", "배울 말이 모두<br><em>사전 한 곳</em>에",
  "품사·주제 × 단계로 나눈 사전. 대화에서 자주 쓴 말이 맨 위에 모입니다.",
  [["🔎", "<b>찾기 + 자주 쓴 말</b> — 옆 숫자는 대화에서 쓴 횟수"],
   ["▦", "<b>종류 × 단계</b> 묶음 — 퀴즈로 풀거나 대화로 써 보기"],
   ["🃏", "<b>넘겨 보기</b> — 뜻·단어·예문 중 하나를 가리고 떠올리기"],
   ["🧩", "단어 화면의 <b>같이 배우기</b> — 덜 다진 문법·표현부터"]],
  phone("lang-bundle", { w: 300, x: 1000, y: 210, rot: -6, z: 1, dim: true }) + phone("lang-flip", { w: 300, x: 1530, y: 210, rot: 6, z: 1, dim: true }) + phone("lang-1", { w: 340, x: 1250, y: 130, z: 2, glow: C.yellow }), "05");

pages["06-log"] = feature(C.sky, "Logbank", "레벨 대신,<br><em>실제로 한 것</em>이 쌓입니다",
  "퍼센트·등급 없이, 그날 무엇을 배우고 어디서 써 봤는지만 기록합니다.",
  [["◷", "<b>오늘의 학습</b> — 오늘 한 학습 시간 줄과 할 것 칸"],
   ["▤", "<b>배운 것 표</b> — 단어·문법·표현·문장구조 × 학습 · 활용"],
   ["📈", "<b>학습 곡선</b> — 날마다 학습 수와 지금까지 활용 누적"],
   ["🗓", "<b>학습 타임라인</b> — 그날 세부에서 카드별 지난 기록까지"]],
  phone("my-home", { w: 300, x: 1000, y: 210, rot: -6, z: 1, dim: true }) + phone("log-day", { w: 300, x: 1530, y: 210, rot: 6, z: 1, dim: true }) + phone("log-curve", { w: 340, x: 1250, y: 130, z: 2, glow: C.sky }), "06");

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: Number(process.env.DSF || 1) });
const p = await ctx.newPage();
for (const [name, html] of Object.entries(pages)) {
  await p.setContent(html, { waitUntil: "load" }); await p.waitForTimeout(300);
  await p.screenshot({ path: `out/${name}.png` }); console.log(name);
}
await b.close();
