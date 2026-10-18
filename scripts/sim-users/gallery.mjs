/**
 * 기능 화면 갤러리 — screens.mjs가 찍은 화면을 한 장짜리 페이지(그림을 안에 담음)로.
 * 장면 × 언어 조합 표, 앱 영역별로 묶고, 누르면 크게. 아티팩트로 올리거나 파일로 보낸다.
 *
 *   node scripts/sim-users/gallery.mjs tmp/sim-users/<실행> [--suites tmp/sim-users/<점검 실행>]
 *   → tmp/sim-users/<실행>/gallery.html
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const dir = args[0];
if (!dir) {
  console.error("Usage: gallery.mjs tmp/sim-users/<screens 실행> [--suites tmp/sim-users/<점검 실행>]");
  process.exit(2);
}
const suitesDir = args.includes("--suites") ? args[args.indexOf("--suites") + 1] : null;
const results = JSON.parse(fs.readFileSync(path.join(dir, "screens.json"), "utf8"));

const GROUPS = [
  { name: "채팅", ids: ["chat-correct", "chat-expression", "chat-reading", "sentence-ask", "word-card"] },
  { name: "단어장", ids: ["vocab-search"] },
  { name: "My · 지도", ids: ["selfcheck", "map", "mission", "today", "growth", "element", "myask", "ledger"] },
  { name: "통화 · 영상", ids: ["call-home", "video-library"] },
  { name: "프로필", ids: ["account", "account-edit"] },
  { name: "노트", ids: ["notes", "notes-words"] },
  { name: "말하는 방", ids: ["rooms-list", "room-inside", "room-comment", "room-profile"] },
  { name: "사람 · 메시지", ids: ["people", "people-profile", "invite-welcome", "messages", "dm-thread", "group-thread"] },
  { name: "도움말 · 의견", ids: ["guide", "feedback"] },
];
const LANG = { en: "영어", ko: "한국어", ja: "일본어", zh: "중국어", es: "스페인어", fr: "프랑스어", it: "이탈리아어", pt: "포르투갈어", ru: "러시아어", ar: "아랍어", id: "인도네시아어", vi: "베트남어", th: "태국어", hi: "힌디어" };

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function thumb(file) {
  if (!file || !fs.existsSync(file)) return null;
  const buf = await sharp(file).resize({ width: 390 }).webp({ quality: 66 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

const combos = results.map((r) => r.combo);
const labels = new Map(results.flatMap((r) => r.shots.map((s) => [s.id, s.label])));
const cells = new Map();
for (const r of results) {
  for (const s of r.shots) cells.set(`${s.id}|${r.combo.target}:${r.combo.ui}`, { ...s, src: await thumb(s.file) });
}
const total = [...cells.values()].length;
const failed = [...cells.values()].filter((c) => !c.ok);

let suites = null;
if (suitesDir && fs.existsSync(path.join(suitesDir, "results.json"))) {
  const data = JSON.parse(fs.readFileSync(path.join(suitesDir, "results.json"), "utf8"));
  const issues = data.records.flatMap((r) => r.issues);
  suites = {
    people: data.records.length,
    requests: data.meta.requests,
    errors: issues.filter((i) => i.severity === "error").length,
    warns: issues.filter((i) => i.severity === "warn").length,
    run: data.meta.runId,
  };
}

const groupsHtml = GROUPS.map((g) => {
  const ids = g.ids.filter((id) => labels.has(id));
  if (!ids.length) return "";
  const rows = ids.map((id) => {
    const figs = combos.map((c) => {
      const cell = cells.get(`${id}|${c.target}:${c.ui}`);
      const name = `${LANG[c.target] ?? c.target} 학습 · ${LANG[c.ui] ?? c.ui} 앱`;
      if (!cell) return `<figure class="shot missing"><div class="ph">찍지 못함</div><figcaption>${esc(name)}</figcaption></figure>`;
      return `<figure class="shot${cell.ok ? "" : " bad"}">
  <button type="button" class="zoom" data-full="${cell.src ?? ""}" data-cap="${esc(`${labels.get(id)} — ${name}`)}" aria-label="${esc(`${labels.get(id)}, ${name} 크게 보기`)}">${cell.src ? `<img src="${cell.src}" alt="" loading="lazy" width="390" height="866">` : `<div class="ph">없음</div>`}</button>
  <figcaption><span class="pair">${esc(name)}</span>${cell.ok ? "" : `<span class="flag">막힘 — ${esc(cell.error)}</span>`}</figcaption>
</figure>`;
    }).join("");
    return `<section class="scene" id="${esc(id)}"><h3>${esc(labels.get(id))}</h3><div class="strip">${figs}</div></section>`;
  }).join("");
  return `<section class="group" data-group="${esc(g.name)}"><h2>${esc(g.name)}</h2>${rows}</section>`;
}).join("");

const navHtml = GROUPS.filter((g) => g.ids.some((id) => labels.has(id))).map((g) => `<button type="button" class="chip" data-g="${esc(g.name)}">${esc(g.name)}</button>`).join("");

const html = `<title>languagebank 기능 화면</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* 리뷰 보드: 위에 요약 한 줄과 영역 칩, 아래는 장면마다 언어 조합 네 칸이 나란한 띠. 폰 화면 비율 그대로. */
:root {
  --bg: #f3f4f7;
  --panel: #ffffff;
  --ink: #15171c;
  --ink-2: #565b66;
  --line: #dfe2e8;
  --accent: #3355d1;
  --crit: #c2362f;
  --phone: #0f1115;
  --font-body: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #111318; --panel: #191c22; --ink: #e8eaf0; --ink-2: #9aa1ae; --line: #2b3039; --accent: #8ea6f5; --crit: #ef7d75; --phone: #000000; color-scheme: dark;
} }
:root[data-theme="dark"] {
  --bg: #111318; --panel: #191c22; --ink: #e8eaf0; --ink-2: #9aa1ae; --line: #2b3039; --accent: #8ea6f5; --crit: #ef7d75; --phone: #000000; color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font-family: var(--font-body); line-height: 1.55; }
.wrap { max-width: 1320px; margin: 0 auto; padding-block: 24px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 28px; }
h1 { font-size: 22px; margin: 0; text-wrap: balance; letter-spacing: -0.01em; }
h2 { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; color: var(--ink-2); margin: 0 0 12px; text-transform: none; }
h3 { font-size: 15px; font-weight: 600; margin: 0 0 10px; text-wrap: balance; }
.lede { color: var(--ink-2); margin: 6px 0 0; max-width: 70ch; }
.facts { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 12px; font-size: 13px; color: var(--ink-2); }
.facts b { color: var(--ink); font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-weight: 500; }
.facts .bad b { color: var(--crit); }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; border-bottom: 1px solid var(--line); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }
.chip { font: inherit; font-size: 13px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 999px; padding: 4px 12px; cursor: pointer; }
.chip[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); }
.chip:focus-visible, .zoom:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.legend { margin-left: auto; font-size: 12px; color: var(--ink-2); }
.group { display: grid; gap: 22px; }
.scene { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px; min-width: 0; }
.strip { display: grid; grid-template-columns: repeat(${combos.length}, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 760px) { .strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.shot { margin: 0; display: grid; gap: 6px; min-width: 0; }
.zoom { display: block; width: 100%; padding: 0; border: 0; background: var(--phone); border-radius: 10px; overflow: hidden; cursor: zoom-in; aspect-ratio: 412 / 915; }
.zoom img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.ph { display: grid; place-items: center; height: 100%; color: var(--ink-2); font-size: 12px; aspect-ratio: 412 / 915; border: 1px dashed var(--line); border-radius: 10px; }
.shot.bad .zoom { outline: 2px solid var(--crit); outline-offset: -2px; }
figcaption { font-size: 12px; color: var(--ink-2); display: grid; gap: 2px; }
.flag { color: var(--crit); overflow-wrap: anywhere; }
dialog { border: 0; padding: 0; background: transparent; max-width: min(460px, 94vw); }
dialog::backdrop { background: rgb(0 0 0 / 0.72); }
dialog img { width: 100%; height: auto; border-radius: 12px; display: block; }
dialog p { color: #f2f3f7; font-size: 13px; margin: 8px 2px 0; }
dialog .close { position: absolute; top: 8px; right: 8px; font: inherit; font-size: 13px; background: rgb(0 0 0 / 0.6); color: #fff; border: 0; border-radius: 999px; padding: 4px 10px; cursor: pointer; }
@media (prefers-reduced-motion: no-preference) { .zoom img { transition: transform 0.2s ease; } .zoom:hover img { transform: scale(1.01); } }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
<div class="wrap">
  <header>
    <h1>기능을 쓰면 이렇게 나와요</h1>
    <p class="lede">가상 사용자가 앱 웹 화면에서 기능마다 실제로 입력해 본 결과입니다. 운영 서버에 보냈고, 학습 언어 문장은 가상 사용자 점검과 같은 시드입니다. 그림을 누르면 크게 보여요.</p>
    <div class="facts">
      <span>장면 <b>${labels.size}</b></span>
      <span>언어 조합 <b>${combos.length}</b></span>
      <span>찍은 화면 <b>${total}</b></span>
      <span class="${failed.length ? "bad" : ""}">막힌 화면 <b>${failed.length}</b></span>
      ${suites ? `<span>같은 날 API 점검 ${suites.people}명 · 요청 <b>${suites.requests}</b> · 오류 <b>${suites.errors}</b> · 경고 <b>${suites.warns}</b></span>` : ""}
    </div>
  </header>
  <nav class="bar" aria-label="영역">
    <button type="button" class="chip" data-g="" aria-pressed="true">전체</button>${navHtml}
    <span class="legend">빨간 테두리 = 그 장면에서 막힌 화면</span>
  </nav>
  ${groupsHtml}
</div>
<dialog id="viewer"><button type="button" class="close" id="viewer-close">닫기</button><img id="viewer-img" alt=""><p id="viewer-cap"></p></dialog>
<script>
(function () {
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var g = chip.getAttribute("data-g");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      document.querySelectorAll(".group").forEach(function (sec) { sec.hidden = Boolean(g) && sec.getAttribute("data-group") !== g; });
    });
  });
  var dlg = document.getElementById("viewer");
  var img = document.getElementById("viewer-img");
  var cap = document.getElementById("viewer-cap");
  document.querySelectorAll(".zoom").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-full");
      if (!src) return;
      img.src = src;
      cap.textContent = btn.getAttribute("data-cap");
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  document.getElementById("viewer-close").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
</script>
`;
const out = path.join(dir, "gallery.html");
fs.writeFileSync(out, html);
console.log(`${out} · ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)}MB · 화면 ${total} · 막힘 ${failed.length}`);
