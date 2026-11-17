// 주요 기능 한 장 + 핵심 기능 사용샷 다섯 장(1920×1080) — 화면은 자르지 않고 통째로, 단계 번호·한 줄 설명
import { chromium } from "playwright";
import fs from "node:fs";
const size = (n) => { const h = fs.readFileSync(`raw/${n}.png`).subarray(16, 24); return { w: h.readUInt32BE(0), h: h.readUInt32BE(4) }; };
const img = (n) => `data:image/png;base64,${fs.readFileSync(`raw/${n}.png`).toString("base64")}`;
const C = { sky: "#7CC4FF", green: "#5BE3A0", yellow: "#FFD15C", coral: "#FF8A6B", violet: "#B49CFF" };
const screen = (n, w) => { const h = Math.round(w * 844 / 390);
  return `<div class="phone" style="width:${w + 12}px;height:${h + 12}px"><img src="${img(n)}" style="width:${w}px"></div>`; };
const CSS = `*{box-sizing:border-box;margin:0;padding:0}
body{width:1920px;height:1080px;overflow:hidden;font-family:"Noto Sans CJK KR",sans-serif;color:#F2F2F0;background:#0B0C0E;letter-spacing:-0.02em;word-break:keep-all;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(1100px 600px at 50% 110%, var(--a)1f, transparent 70%)}
.phone{border-radius:30px;overflow:hidden;background:#000;border:6px solid #1c1d21;box-shadow:0 0 0 1px #ffffff14,0 30px 70px -20px #000}
.phone img{display:block}
.head{position:absolute;left:110px;top:64px;right:110px;display:flex;align-items:flex-end;justify-content:space-between}
.eyebrow{font-size:20px;font-weight:700;letter-spacing:.08em;color:var(--a);text-transform:uppercase;margin-bottom:12px;display:flex;gap:12px;align-items:center}
.eyebrow i{width:30px;height:3px;background:var(--a);border-radius:2px;display:inline-block}
h1{font-size:50px;font-weight:800;letter-spacing:-0.035em;line-height:1.2}
h1 em{font-style:normal;color:var(--a)}
.lead{font-size:21px;color:#9fa2aa;max-width:620px;text-align:right;line-height:1.55}
.row{position:absolute;left:0;right:0;top:240px;display:flex;justify-content:center;align-items:flex-start;gap:0}
.step{display:flex;flex-direction:column;align-items:center;width:470px}
.cap{margin-top:22px;display:flex;gap:12px;align-items:flex-start;width:400px}
.n{flex:none;width:34px;height:34px;border-radius:50%;background:var(--a);color:#0B0C0E;font-weight:900;font-size:18px;display:grid;place-items:center}
.cap b{display:block;font-size:22px;font-weight:800;color:#fff;margin-bottom:4px}
.cap span{font-size:17px;color:#A9ABB3;line-height:1.5}
.arrow{width:60px;align-self:center;margin-top:-120px;text-align:center;font-size:34px;color:var(--a);opacity:.8}
.foot{position:absolute;left:110px;bottom:34px;font-size:16px;color:#6E717B}.foot b{color:#C9CBD2}
.num{position:absolute;right:110px;bottom:34px;font-size:16px;color:#6E717B;font-weight:700;letter-spacing:.1em}`;
const wrap = (a, body, n) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body style="--a:${a}"><div class="bg"></div>${body}<div class="foot"><b>languagebank</b> · 기능 사용</div>${n ? `<div class="num">${n}</div>` : ""}</body></html>`;

const W = 300, MAXH = 620; // 화면 높이를 맞춤(가로 비율이 다른 그림은 폭을 줄임)
const fit = () => 280;
const flow = (a, eyebrow, title, lead, steps, n) => wrap(a, `
<div class="head"><div><div class="eyebrow"><i></i>${eyebrow}</div><h1>${title}</h1></div><p class="lead">${lead}</p></div>
<div class="row">${steps.map(([img, t, d], i) => `${i ? '<div class="arrow">→</div>' : ""}<div class="step">${screen(img, fit(img))}<div class="cap"><div class="n">${i + 1}</div><div><b>${t}</b><span>${d}</span></div></div></div>`).join("")}</div>`, n);

const pages = {
  "usage-1-call": flow(C.coral, "핵심 기능 · AI 통화", "튜터와 <em>통화하며</em> 말해 보기", "말하는 흐름을 끊지 않고, 고친 말은 화면 카드로 보여 줍니다.", [
    ["talk", "통화 문 고르기", "튜터 줄에서 자유대화 · 수업 · 게임 · 가르치기 중 하나"],
    ["call-fix", "말하면 고친 말은 카드로", "튜터는 대화를 이어 가고, 틀린 곳은 내 얼굴 아래 카드에"],
    ["g-call-recap", "끝나면 통화 정리", "이렇게 말할 수 있었어요 · My에서 찾기 · 같이 배우기"]], "1 / 5"),
  "usage-2-chat": flow(C.violet, "핵심 기능 · AI 채팅", "막혀도 <em>대화는 그대로</em>", "입력창은 하나. 학습 언어로 쓰면 대화, 편한 말로 쓰면 튜터가 학습 언어로 이어 갑니다.", [
    ["g-chat-fix", "학습 언어로 써 보기", "보낸 문장에 고칠 곳이 있으면 표시가 붙음"],
    ["g-chat-correct", "누르면 고친 문장", "틀린 곳과 고친 꼴이 내 문장 바로 아래에"],
    ["g-chat-expression", "편한 말로 써도 OK", "튜터가 학습 언어로 잇고, 이렇게 말해요 카드로 표현 연습"]], "2 / 5"),
  "usage-3-quiz": flow(C.green, "핵심 기능 · Quizbank", "틀린 것만 다시, <em>한 흐름 퀴즈</em>", "대화에서 막힌 것이 먼저 나오고, 오답은 정답의 흔한 실수 꼴로 만듭니다.", [
    ["quiz-1", "예문 속 빈칸 고르기", "위 게이지(− ● +)로 난이도를 직접 조절"],
    ["quiz-after-choose", "답하면 바로 채점", "다시 볼 것 표시 · Languagebank 사전으로 바로"],
    ["quiz-meaning", "예문 속 뜻 고르기", "낱말은 그 예문에서의 뜻으로 — 보기는 그럴듯한 뜻 넷"]], "3 / 5"),
  "usage-4-lang": flow(C.yellow, "핵심 기능 · Languagebank", "배울 말이 모두 <em>사전 한 곳</em>에", "대화에서 자주 쓴 말이 맨 위에, 나머지는 품사·주제 × 단계로 나뉩니다.", [
    ["lang-1", "찾기 · 자주 쓴 말", "옆 숫자는 대화에서 쓴 횟수, 아래는 종류별 개수"],
    ["lang-bundle", "종류 × 단계 묶음", "주제·품사와 단계로 나눈 표에서 묶음 고르기"],
    ["lang-flip", "넘겨 보기", "뜻 · 단어 · 예문 중 하나를 가리고 떠올리기"]], "4 / 5"),
  "usage-5-log": flow(C.sky, "핵심 기능 · Logbank", "레벨 대신 <em>실제로 한 것</em>", "퍼센트나 등급 없이, 무엇을 배우고 어디서 써 봤는지만 기록합니다.", [
    ["my-home", "오늘의 학습", "오늘 한 학습 시간 줄과 남은 할 것(Quizbank · 튜터 통화)"],
    ["log-curve", "배운 것 · 학습 곡선", "단어 · 문법 · 표현 × 학습 · 활용, 날마다 학습 수"],
    ["log-day", "그날 세부", "학습 타임라인 — 시간 덩어리별로 무엇을 맞히고 틀렸는지"]], "5 / 5"),
};

// 주요 기능 한 장: 여섯 칸
const tile = (a, img, t, d) => `<div style="display:flex;flex-direction:column;align-items:center;width:270px">
  ${screen(img, 220)}
  <div style="margin-top:20px;text-align:center"><div style="font-size:22px;font-weight:800;color:${a}">${t}</div><div style="font-size:16px;color:#A9ABB3;margin-top:6px;line-height:1.45">${d}</div></div></div>`;
pages["features-overview"] = wrap(C.sky, `
<div class="head"><div><div class="eyebrow"><i></i>주요 기능</div><h1>배우기 → <em style="color:${C.coral}">써 보기</em> → 기록</h1></div>
<p class="lead">Quizbank · Languagebank에서 배우고,<br>AI 튜터와 통화 · 채팅으로 써 보고,<br>Logbank가 한 장부로 기록합니다.</p></div>
<div class="row" style="top:290px;gap:20px">
${tile(C.coral, "talk", "AI 튜터", "통화 문 넷 — 자유대화 · 수업 · 게임 · 가르치기")}
${tile(C.coral, "call-fix", "AI 통화", "말하면 고친 말은 카드로")}
${tile(C.violet, "g-chat-correct", "AI 채팅", "고칠 곳 · 편한 말로 써도 이어지는 대화")}
${tile(C.green, "quiz-after-choose", "Quizbank", "틀린 것만 다시, 그럴듯한 오답")}
${tile(C.yellow, "lang-1", "Languagebank", "사전 · 자주 쓴 말 · 넘겨 보기")}
${tile(C.sky, "my-home", "Logbank", "오늘의 학습 · 배운 것 · 타임라인")}
</div>`, "");

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
for (const [name, html] of Object.entries(pages)) { await p.setContent(html, { waitUntil: "load" }); await p.waitForTimeout(300); await p.screenshot({ path: `out/${name}.png` }); console.log(name); }
await b.close();
