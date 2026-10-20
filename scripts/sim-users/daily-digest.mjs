/**
 * 가상 사용자 점검 일일 보고 — 지난 24시간 점검이 남긴 것(hub/reports.md·hub/inbox.md의 git 기록)과
 * 지금 열린 qa → dev 일, 재현 캡처를 한 장의 페이지로 묶는다. 예약 작업 "가상 사용자 일일 보고"가 쓴다.
 *
 *   node scripts/sim-users/daily-digest.mjs [--hours 24] [--runs runs.json] [--shots shots.json] [--out tmp/digest/index.html]
 *
 * runs.json  [{ "name": "가상 사용자 채팅 점검", "when": "10-20 14:48", "status": "성공|실패|안 돎", "note": "한 줄" }]
 * shots.json [{ "file": "tmp/…/chat-correct.png", "combo": "ar:vi", "caption": "무엇을 보낸 화면인지 한 줄" }]
 * 둘 다 없어도 된다. 페이지는 https://claude.ai/artifact/… 한 곳에 매일 다시 올린다(새로 만들지 않음).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 || at + 1 >= args.length ? fallback : args[at + 1];
};
const HOURS = Number(value("hours", 24));
const OUT = value("out", "tmp/digest/index.html");
const readJson = (file) => (file && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : []);
const runs = readJson(value("runs", null));
const shots = readJson(value("shots", null));

const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
/** `코드`만 살린다. */
const inline = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");

function addedLines(file) {
  const out = execFileSync("git", ["log", `--since=${HOURS} hours ago`, "-p", "--format=", "--", file], { encoding: "utf8", maxBuffer: 64 << 20 });
  return out.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).map((l) => l.slice(1));
}

// 새 보고: 덧붙은 "### " 항목과 바로 아래 "- " 줄들
const newReports = [];
for (const line of addedLines("hub/reports.md")) {
  if (line.startsWith("### ")) newReports.push({ title: line.slice(4).trim(), body: [] });
  else if (newReports.length && /^\s*- /.test(line)) newReports.at(-1).body.push(line.trim().slice(2));
  else if (newReports.length && /^\s{2,}\S/.test(line)) newReports.at(-1).body.push(line.trim());
}

const qaLine = /^- (\d{4}-\d{2}-\d{2}) qa → ([^:]+):\s*(.*)$/;
// "새로": 지난 시간 안의 날짜(한국 시간)로 적힌 줄. git 기록은 파일을 다시 쓰면 옛 줄도 새로 보여 날짜로 가린다.
const since = new Date(Date.now() + 9 * 3600_000 - HOURS * 3600_000).toISOString().slice(0, 10);
const newInbox = new Set(addedLines("hub/inbox.md").filter((l) => qaLine.test(l) && l.match(qaLine)[1] >= since));
const open = fs
  .readFileSync("hub/inbox.md", "utf8")
  .split("\n")
  .map((l) => ({ line: l, m: l.match(qaLine) }))
  .filter((x) => x.m)
  .map(({ line, m }) => ({ date: m[1], to: m[2].trim(), text: m[3], fresh: newInbox.has(line) }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

// 결정 대기: 새 보고 칸에서 "결정:"이 비어 있는 항목
const reportsText = fs.readFileSync("hub/reports.md", "utf8");
const newSection = reportsText.split("## 새 보고")[1]?.split("\n## ")[0] ?? "";
const waiting = newSection
  .split("\n### ")
  .slice(1)
  .filter((block) => /- 결정:\s*$/m.test(block))
  .map((block) => block.split("\n")[0].trim());
// 지난 시간에 덧붙은 항목 중 지금도 "새 보고"에 있는 것만(형식 예시·정리된 항목 빼고, 같은 제목은 한 번)
const reportTitles = new Set();
const blocks = new Map(newSection.split("\n### ").slice(1).map((b) => [b.split("\n")[0].trim(), b]));
const reports = newReports
  .filter((r) => blocks.has(r.title) && !reportTitles.has(r.title) && reportTitles.add(r.title))
  .map((r) => ({ title: r.title, body: blocks.get(r.title).split("\n").slice(1).filter((l) => l.trim()).map((l) => l.trim().replace(/^- /, "")) }));

const shotHtml = shots
  .filter((s) => fs.existsSync(s.file))
  .map((s) => {
    const data = fs.readFileSync(s.file).toString("base64");
    return `<figure class="shot"><img src="data:image/png;base64,${data}" alt="${esc(s.caption)}" loading="lazy"><figcaption><span class="chip">${esc(s.combo)}</span>${inline(s.caption)}</figcaption></figure>`;
  })
  .join("\n");

const now = new Date(Date.now() + 9 * 3600_000);
const stamp = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 16)} (한국 시간)`;
const toLabel = (to) => (to === "dev" ? "개발" : to === "사용자" ? "사용자" : to === "qa(실기기)" ? "기기 확인" : to);
const statusClass = (s) => (/실패|안 돎/.test(s) ? "bad" : /성공/.test(s) ? "good" : "");

const html = `<title>점검 일일 보고</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
<style>
/* 위에서 아래로 한 줄: 요약 → 오늘 새로 나온 것 → 캡처 → 열린 일 표 */
:root {
  --bg: #f6f7f9; --surface: #ffffff; --fg: #1b2230; --muted: #5d6779; --line: #dde2ea;
  --accent: #2f5bd3; --good: #1f7a4d; --bad: #b4372f; --chip: #e8edf8;
  --font: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #11151c; --surface: #191f29; --fg: #e6e9ef; --muted: #9aa4b5; --line: #2b3340;
  --accent: #7d9df0; --good: #5cc28f; --bad: #ef7d73; --chip: #24304a; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #11151c; --surface: #191f29; --fg: #e6e9ef; --muted: #9aa4b5; --line: #2b3340;
  --accent: #7d9df0; --good: #5cc28f; --bad: #ef7d73; --chip: #24304a; color-scheme: dark }
body { background: var(--bg); color: var(--fg); font-family: var(--font); font-size: 15px; line-height: 1.6;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
main { max-width: 880px; margin: 0 auto; padding-block: 28px 56px; display: grid; gap: 32px; }
h1 { font-size: 1.6rem; margin: 0; text-wrap: balance; }
h2 { font-size: 1.05rem; margin: 0 0 12px; letter-spacing: .02em; }
.meta { color: var(--muted); font-size: .9rem; margin-top: 4px; }
.runs { display: flex; flex-wrap: wrap; gap: 8px; }
.run { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; min-width: 0; flex: 1 1 240px; }
.run b { display: block; font-size: .92rem; }
.run .s { font-size: .85rem; color: var(--muted); }
.run .s.good { color: var(--good); } .run .s.bad { color: var(--bad); }
.report { background: var(--surface); border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 6px; padding: 12px 16px; }
.report h3 { font-size: .98rem; margin: 0 0 6px; }
.report ul { margin: 0; padding-left: 1.1em; display: grid; gap: 4px; }
.empty { color: var(--muted); }
.shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.shot { margin: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.shot img { display: block; width: 100%; height: auto; }
.shot figcaption { padding: 8px 10px; font-size: .85rem; display: flex; gap: 6px; flex-wrap: wrap; align-items: baseline; }
.chip { background: var(--chip); color: var(--fg); border-radius: 999px; padding: 0 8px; font-family: var(--mono); font-size: .78rem; white-space: nowrap; }
.chip.new { background: var(--accent); color: var(--surface); font-family: var(--font); }
.tablewrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: .88rem; }
th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { color: var(--muted); font-weight: 600; font-size: .8rem; letter-spacing: .04em; }
td.d { font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--muted); }
tr:last-child td { border-bottom: 0; }
code { font-family: var(--mono); font-size: .85em; background: var(--chip); border-radius: 4px; padding: 0 4px; overflow-wrap: anywhere; }
</style>
<main>
  <header>
    <h1>가상 사용자 점검 일일 보고</h1>
    <div class="meta">${esc(stamp)} · 지난 ${HOURS}시간 · 새 보고 ${reports.length}건 · 열린 일 ${open.length}건${waiting.length ? ` · 결정 기다림 ${waiting.length}건` : ""}</div>
  </header>
  ${runs.length ? `<section><h2>돌린 점검</h2><div class="runs">${runs.map((r) => `<div class="run"><b>${esc(r.name)}</b><span class="s ${statusClass(r.status)}">${esc(r.when)} · ${esc(r.status)}</span>${r.note ? `<div class="s">${inline(r.note)}</div>` : ""}</div>`).join("")}</div></section>` : ""}
  <section>
    <h2>오늘 새로 나온 것</h2>
    ${reports.length ? `<div style="display:grid;gap:12px">${reports.map((r) => `<article class="report"><h3>${inline(r.title)}</h3><ul>${r.body.filter((b) => !/^결정:\s*$/.test(b)).map((b) => `<li>${inline(b)}</li>`).join("")}</ul></article>`).join("")}</div>` : `<p class="empty">새 문제 없음. 점검은 돌았고 알려진 것만 다시 나왔어요.</p>`}
  </section>
  ${shotHtml ? `<section><h2>화면 캡처</h2><p class="meta" style="margin:-6px 0 12px">문제가 난 문장을 앱 채팅에 다시 보내 찍은 것. 모델 답이라 점검 때와 다르게 나올 수 있어요.</p><div class="shots">${shotHtml}</div></section>` : ""}
  ${waiting.length ? `<section><h2>결정 기다림</h2><ul>${waiting.map((w) => `<li>${inline(w)}</li>`).join("")}</ul><p class="meta">hub/reports.md의 "결정:" 줄에 반영 / 보류 / 안 함을 적으면 다음 실행이 처리해요.</p></section>` : ""}
  <section>
    <h2>열린 일 (inbox의 qa → 줄)</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>날짜</th><th>누가</th><th>무엇</th></tr></thead>
      <tbody>${open.map((o) => `<tr><td class="d">${esc(o.date.slice(5))}</td><td><span class="chip">${esc(toLabel(o.to))}</span>${o.fresh ? ` <span class="chip new">새로</span>` : ""}</td><td>${inline(o.text)}</td></tr>`).join("")}</tbody>
    </table></div>
  </section>
</main>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`일일 보고 → ${OUT} (새 보고 ${reports.length}, 열린 일 ${open.length}, 캡처 ${shots.length}, 결정 대기 ${waiting.length})`);
