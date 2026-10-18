/**
 * 가상 사용자 실행 결과 → 한 장짜리 HTML.
 *   1) 요약 숫자  2) 14×14 히트맵(학습 언어 × 앱 언어, 칸을 누르면 그 조합만)
 *   3) 문제 종류별  4) 페르소나 속성별 문제율  5) 문제가 난 대화 전체(재현 명령 포함)
 */
import { LABELS, LANGUAGES } from "./personas.mjs";
import { SEVERITY_WEIGHT } from "./detect.mjs";

const KIND_LABEL = {
  network: "요청 실패", http: "HTTP 오류", slow: "느림", empty_reply: "빈 답", reply_wrong_language: "답 언어 틀림",
  leak: "내부 글자 노출", level_shown: "수준 표시", prompt_leak: "지시문 노출 의심", repeated_reply: "같은 답 반복",
  no_correction: "고침 정보 없음", correction_wrong_language: "고친 문장 언어 틀림", explanation_language: "설명 언어 틀림",
  explanation_mixed_script: "설명 문자 섞임", false_correction: "잘못 고침", missed_correction: "안 고침",
  offtopic_complied: "숙제 대행", own_question_translated: "질문을 번역해 버림", rude_reply: "거친 말", daily_limit: "하루 한도", card_network: "표현 카드 실패", card_http: "표현 카드 오류",
  card_slow: "표현 카드 느림", card_empty: "빈 표현 카드", card_wrong_language: "표현 카드 언어 틀림",
  start_network: "첫 인사 실패", start_http: "첫 인사 오류", start_empty: "빈 첫 인사", start_wrong_language: "첫 인사 언어 틀림",
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const PREFIX_LABEL = { map: "지도", next: "오늘 해볼 것", ask: "직접 묻기", sheet: "분석·번역", call: "통화", rooms: "방", pack: "팩" };
const SUFFIX_LABEL = {
  network: "요청 실패", http: "HTTP 오류", slow: "느림", empty: "빈 값", leak: "내부 글자 노출", level_shown: "수준 표시",
  wrong_language: "언어 틀림", mixed_script: "문자 섞임", shape: "응답 형태", limit: "한도", crash: "점검 코드 오류",
  logic: "동작 이상", repeat: "같은 말 반복", english_name: "영어 이름 섞임",
};
const label = (kind) => {
  if (KIND_LABEL[kind]) return KIND_LABEL[kind];
  if (kind.startsWith("judge_")) return `평가: ${kind.slice(6)}`;
  const m = kind.match(/^([a-z]+)_(.+)$/);
  if (m && SUFFIX_LABEL[m[2]]) return `${PREFIX_LABEL[m[1]] ?? m[1]}: ${SUFFIX_LABEL[m[2]]}`;
  return kind;
};

export function renderReport({ meta, records }) {
  const issues = records.flatMap((r) => r.issues.map((i) => ({ ...i, pid: r.persona.id, target: r.persona.target, ui: r.persona.ui })));
  const errors = issues.filter((i) => i.severity === "error").length;
  const warns = issues.filter((i) => i.severity === "warn").length;
  const turns = records.reduce((s, r) => s + r.transcript.filter((t) => (t.suite ?? "chat") === "chat" && t.turn > 0).length, 0);
  const steps2 = records.reduce((s, r) => s + r.transcript.filter((t) => t.suite && t.suite !== "chat").length, 0);
  const latencies = records.flatMap((r) => r.transcript.map((t) => t.ms).filter((ms) => ms > 0)).sort((a, b) => a - b);
  const p = (q) => (latencies.length ? (latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * q))] / 1000).toFixed(1) : "-");
  const clean = records.filter((r) => !r.issues.some((i) => i.severity !== "info")).length;

  // 히트맵 칸: 점수(오류 3 + 경고 1)
  const cell = new Map();
  for (const r of records) {
    const key = `${r.persona.target}:${r.persona.ui}`;
    const c = cell.get(key) ?? { score: 0, errors: 0, warns: 0, people: 0 };
    c.people += 1;
    c.score += r.score ?? 0;
    c.errors += r.issues.filter((i) => i.severity === "error").length;
    c.warns += r.issues.filter((i) => i.severity === "warn").length;
    cell.set(key, c);
  }
  const maxScore = Math.max(1, ...[...cell.values()].map((c) => c.score));
  const steps = ["--seq-0", "--seq-1", "--seq-2", "--seq-3", "--seq-4"];
  const stepFor = (score) => (score === 0 ? steps[0] : steps[Math.min(4, 1 + Math.floor((score / maxScore) * 3.999))]);

  const heat = `<table class="heat" aria-label="학습 언어 × 앱 언어 문제 점수">
<thead><tr><th class="corner">학습↓<br>앱→</th>${LANGUAGES.map((l) => `<th scope="col">${l}</th>`).join("")}<th scope="col">합</th></tr></thead>
<tbody>${LANGUAGES.map((t) => {
    let rowScore = 0;
    const tds = LANGUAGES.map((u) => {
      const c = cell.get(`${t}:${u}`);
      if (!c) return `<td class="none" title="${t} 학습 · ${u} 앱: 이번 실행에 없음">·</td>`;
      rowScore += c.score;
      const dark = steps.indexOf(stepFor(c.score)) >= 3;
      return `<td class="hit${dark ? " dark" : ""}" style="background:var(${stepFor(c.score)})" data-combo="${t}:${u}" tabindex="0" title="${t} 학습 · ${u} 앱 — ${c.people}명, 오류 ${c.errors}, 경고 ${c.warns}">${c.errors ? `${c.errors}${c.warns ? `<small>/${c.warns}</small>` : ""}` : c.warns ? `<small>${c.warns}</small>` : "✓"}</td>`;
    }).join("");
    return `<tr><th scope="row">${t}</th>${tds}<td class="sum">${rowScore || ""}</td></tr>`;
  }).join("\n")}</tbody></table>`;

  // 종류별
  const kinds = new Map();
  for (const i of issues) {
    if (i.severity === "info") continue;
    const k = kinds.get(i.kind) ?? { kind: i.kind, severity: i.severity, n: 0, combos: new Set(), sample: i.sample ?? i.note };
    k.n += 1;
    k.combos.add(`${i.target}:${i.ui}`);
    if (i.severity === "error") k.severity = "error";
    kinds.set(i.kind, k);
  }
  const kindRows = [...kinds.values()].sort((a, b) => (SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]) || b.n - a.n)
    .map((k) => `<tr data-kind="${esc(k.kind)}"><td>${badge(k.severity)}</td><td>${esc(label(k.kind))}</td><td class="num">${k.n}</td><td class="num">${k.combos.size}</td><td class="sample">${esc(k.sample ?? "")}</td></tr>`).join("");

  // 속성별 문제율 (경고 이상이 하나라도 있는 사람 비율)
  const attrTables = ["level", "temperament", "weakness", "background", "inputStyle", "misbehavior"].map((attr) => {
    const groups = new Map();
    for (const r of records) {
      const v = r.persona[attr];
      const g = groups.get(v) ?? { n: 0, bad: 0, errors: 0 };
      g.n += 1;
      if (r.issues.some((i) => i.severity !== "info")) g.bad += 1;
      g.errors += r.issues.filter((i) => i.severity === "error").length;
      groups.set(v, g);
    }
    const title = { level: "수준", temperament: "태도", weakness: "약점", background: "언어 배경", inputStyle: "입력", misbehavior: "이상 행동" }[attr];
    const rows = [...groups.entries()].map(([v, g]) => {
      const rate = Math.round((g.bad / g.n) * 100);
      return `<tr><td>${esc(LABELS[attr]?.[v] ?? v)}</td><td class="num">${g.n}</td><td class="bar"><span style="width:${rate}%"></span><em>${rate}%</em></td><td class="num">${g.errors}</td></tr>`;
    }).join("");
    return `<div class="attr"><h3>${title}</h3><table><thead><tr><th>값</th><th>사람</th><th>문제 있는 비율</th><th>오류</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join("");

  // 대화
  const flagged = records.filter((r) => r.issues.some((i) => i.severity !== "info")).sort((a, b) => b.score - a.score);
  const replay = (r) => `npm run sim:users -- --seed ${meta.seed} --users ${meta.users} --turns ${meta.turns}${meta.suites ? ` --suite ${meta.suites.join(",")}` : ""}${meta.only?.length ? ` --only ${meta.only.map((o) => `${o.target}:${o.ui}`).join(",")}` : ""} --persona ${r.persona.id}`;
  const convo = flagged.map((r) => `<details class="convo" data-combo="${r.persona.target}:${r.persona.ui}" data-kinds="${esc([...new Set(r.issues.map((i) => i.kind))].join(" "))}">
<summary><b>${r.persona.id}</b> ${esc(r.description)} <span class="counts">${badge("error")} ${r.issues.filter((i) => i.severity === "error").length} ${badge("warn")} ${r.issues.filter((i) => i.severity === "warn").length}</span></summary>
<p class="replay"><code>${esc(replay(r))}</code> · 사용자 <code>${esc(r.userId)}</code></p>
${r.transcript.map((t) => (t.suite && t.suite !== "chat") ? renderStep(t) : `<div class="turn">
<div class="me"><span class="who">${t.turn === 0 ? "시작" : `#${t.turn} ${t.kind === "own" ? "앱 언어로" : t.kind === "misbehavior" ? "이상 행동" : "학습자"}`}</span> <span dir="auto">${esc(t.text)}</span></div>
${t.reply ? `<div class="bot"><span class="who">튜터 · ${(t.ms / 1000).toFixed(1)}초 · ${t.status}</span> <span dir="auto">${esc(t.reply)}</span></div>` : `<div class="bot"><span class="who">응답 없음 · ${t.status}</span></div>`}
${t.corrected ? `<div class="fix"><span class="who">고친 문장</span> <span dir="auto">${esc(t.corrected)}</span>${t.explanation ? `<br><span class="who">설명</span> <span dir="auto">${esc(t.explanation)}</span>` : ""}</div>` : ""}
${t.card ? `<div class="fix"><span class="who">표현 카드 · ${t.card.status}</span> <span dir="auto">${esc(t.card.expression)}</span></div>` : ""}
${(t.issues ?? []).filter((i) => i.severity !== "info").map((i) => `<div class="iss">${badge(i.severity)} ${esc(label(i.kind))} — ${esc(i.note)}</div>`).join("")}
</div>`).join("")}
${r.issues.filter((i) => i.judge).map((i) => `<div class="iss">${badge(i.severity)} ${esc(label(i.kind))} (#${i.turn ?? "?"}) — ${esc(i.note)}</div>`).join("")}
</details>`).join("\n");

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>가상 사용자 점검</title>
<style>
:root{--bg:#fcfcfb;--panel:#ffffff;--line:#e4e3df;--ink:#0b0b0b;--ink2:#52514e;--ink3:#7a7974;
--seq-0:#f0efec;--seq-1:#cde2fb;--seq-2:#86b6ef;--seq-3:#2a78d6;--seq-4:#184f95;--crit:#d03b3b;--warn:#b77a00;--none:#f6f5f2;}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1a1a19;--panel:#22221f;--line:#383835;--ink:#f0efec;--ink2:#c3c2b7;--ink3:#8f8e86;
--seq-0:#2a2a27;--seq-1:#184f95;--seq-2:#256abf;--seq-3:#5598e7;--seq-4:#9ec5f4;--crit:#e66767;--warn:#fab219;--none:#202020;}}
:root[data-theme="dark"]{--bg:#1a1a19;--panel:#22221f;--line:#383835;--ink:#f0efec;--ink2:#c3c2b7;--ink3:#8f8e86;--seq-0:#2a2a27;--seq-1:#184f95;--seq-2:#256abf;--seq-3:#5598e7;--seq-4:#9ec5f4;--crit:#e66767;--warn:#fab219;--none:#202020;}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 64px}h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:32px 0 10px}h3{font-size:13px;margin:0 0 6px;color:var(--ink2)}
.meta{color:var(--ink2);font-size:12px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:16px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}.tile b{display:block;font-size:22px;font-variant-numeric:tabular-nums}.tile span{color:var(--ink2);font-size:12px}
.scroll{overflow-x:auto}.heat{border-collapse:separate;border-spacing:2px;font-variant-numeric:tabular-nums}.heat th.corner{white-space:nowrap;font-size:10px;line-height:1.2}.heat th{font-size:11px;color:var(--ink2);font-weight:600;padding:2px 4px}
.heat td{width:44px;height:34px;text-align:center;border-radius:4px;font-size:12px;color:var(--ink)}.heat td.dark{color:#fff}.heat td small{opacity:.75;font-size:10px}
.heat td.none{background:var(--none);color:var(--ink3)}.heat td.hit{cursor:pointer}.heat td.hit:focus,.heat td.sel{outline:2px solid var(--ink);outline-offset:1px}.heat td.sum{color:var(--ink2);font-size:11px}
.legend{display:flex;gap:6px;align-items:center;font-size:11px;color:var(--ink2);margin-top:6px;flex-wrap:wrap}.legend i{display:inline-block;width:18px;height:12px;border-radius:3px}
table.list{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden}table.list td,table.list th{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;font-size:13px;vertical-align:top}
table.list tr[data-kind]{cursor:pointer}table.list tr.sel{background:var(--seq-0)}.num{text-align:right;font-variant-numeric:tabular-nums}.sample{color:var(--ink2);max-width:420px;word-break:break-word}
.badge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;padding:1px 6px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}.badge.error{color:var(--crit)}.badge.warn{color:var(--warn)}
.attrs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.attr table{width:100%;border-collapse:collapse;font-size:12px}.attr td,.attr th{padding:3px 4px;border-bottom:1px solid var(--line);text-align:left}
.bar{position:relative;width:45%}.bar span{display:block;height:10px;border-radius:0 4px 4px 0;background:var(--seq-3)}.bar em{position:absolute;right:0;top:0;font-style:normal;font-size:11px;color:var(--ink2)}
.filters{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0;font-size:12px;color:var(--ink2)}.filters button{font:inherit;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:3px 10px;cursor:pointer}
.convo{background:var(--panel);border:1px solid var(--line);border-radius:10px;margin:8px 0;padding:8px 12px}.convo summary{cursor:pointer;font-size:13px}.counts{float:right}
.replay{font-size:11px;color:var(--ink2);word-break:break-all}.turn{border-top:1px dashed var(--line);padding:6px 0}.who{font-size:11px;color:var(--ink3);margin-right:4px}
.me,.bot,.fix{margin:2px 0}.fix{color:var(--ink2);font-size:13px}.iss{font-size:12px;margin:3px 0}code{font-size:11px}
@media (max-width:600px){.counts{float:none;display:block}}
</style></head><body><main>
<h1>가상 사용자 점검</h1>
<div class="meta">${esc(meta.runId)} · ${esc(meta.api)} · seed ${meta.seed} · ${meta.users}명 × ${meta.turns}턴 · 요청 ${meta.requests}건 · ${meta.seconds}초${meta.judge ? " · LLM 평가 포함" : " · 규칙 검출만"}${meta.llmPersona ? " · LLM 페르소나" : ""}</div>
<div class="tiles">
<div class="tile"><b>${records.length}</b><span>가상 사용자</span></div>
<div class="tile"><b>${new Set(records.map((r) => `${r.persona.target}:${r.persona.ui}`)).size}<small>/196</small></b><span>학습 조합</span></div>
<div class="tile"><b>${turns}</b><span>채팅 턴</span></div>
${steps2 ? `<div class="tile"><b>${steps2}</b><span>기능 점검 단계</span></div>` : ""}
<div class="tile"><b style="color:var(--crit)">${errors}</b><span>오류</span></div>
<div class="tile"><b style="color:var(--warn)">${warns}</b><span>경고</span></div>
<div class="tile"><b>${clean}</b><span>문제없이 끝난 사람</span></div>
<div class="tile"><b>${p(0.5)}s / ${p(0.95)}s</b><span>응답 중간값 / 95%</span></div>
</div>
<h2>학습 언어 × 앱 언어</h2>
<div class="scroll">${heat}</div>
<div class="legend">칸 숫자 = 오류<small>/경고</small>, ✓ = 문제 없음, · = 이번에 안 돌림. 색 = 점수(오류 3 + 경고 1)
<i style="background:var(--seq-0)"></i>0 <i style="background:var(--seq-1)"></i><i style="background:var(--seq-2)"></i><i style="background:var(--seq-3)"></i><i style="background:var(--seq-4)"></i>${maxScore}</div>
${suiteTable(records)}
<h2>문제 종류</h2>
${kindRows ? `<table class="list"><thead><tr><th>등급</th><th>종류</th><th class="num">건수</th><th class="num">조합 수</th><th>예</th></tr></thead><tbody>${kindRows}</tbody></table>` : "<p>문제 없음</p>"}
<h2>페르소나 속성별</h2>
<div class="attrs">${attrTables}</div>
<h2>문제가 난 대화 (${flagged.length})</h2>
<div class="filters"><span id="filterNote">전체</span><button type="button" id="clear">필터 지우기</button></div>
<div id="convos">${convo || "<p>없음</p>"}</div>
</main>
<script>
(function(){
  var combo=null, kind=null;
  function apply(){
    document.querySelectorAll('.convo').forEach(function(d){
      var ok=(!combo||d.dataset.combo===combo)&&(!kind||(' '+d.dataset.kinds+' ').indexOf(' '+kind+' ')>=0);
      d.style.display=ok?'':'none';
    });
    document.querySelectorAll('.heat td.hit').forEach(function(td){td.classList.toggle('sel',td.dataset.combo===combo)});
    document.querySelectorAll('tr[data-kind]').forEach(function(tr){tr.classList.toggle('sel',tr.dataset.kind===kind)});
    document.getElementById('filterNote').textContent=(combo?combo.replace(':',' 학습 · ')+' 앱 ':'')+(kind?'· '+kind:'')||'전체';
  }
  document.querySelectorAll('.heat td.hit').forEach(function(td){
    function pick(){combo=combo===td.dataset.combo?null:td.dataset.combo;apply();document.getElementById('convos').scrollIntoView({behavior:'smooth'})}
    td.addEventListener('click',pick);td.addEventListener('keydown',function(e){if(e.key==='Enter')pick()});
  });
  document.querySelectorAll('tr[data-kind]').forEach(function(tr){tr.addEventListener('click',function(){kind=kind===tr.dataset.kind?null:tr.dataset.kind;apply()})});
  document.getElementById('clear').addEventListener('click',function(){combo=null;kind=null;apply()});
})();
</script></body></html>
`;
}

function badge(severity) {
  return severity === "error" ? `<span class="badge error">▲ 오류</span>` : severity === "warn" ? `<span class="badge warn">● 경고</span>` : `<span class="badge">참고</span>`;
}

const SUITE_LABEL = {
  chat: "채팅·표현 카드", map: "지도·미션", next: "오늘 해볼 것·요약·자라는 중", ask: "직접 묻기", sheet: "번역·문장분석·단어장",
  pack: "통화 턴·오늘의 팩", rooms: "말하는 방·프로필",
};

function suiteTable(records) {
  const rows = new Map();
  for (const r of records) {
    for (const id of r.suites ?? ["chat"]) {
      const row = rows.get(id) ?? { id, people: 0, steps: 0, errors: 0, warns: 0, ms: [] };
      row.people += 1;
      const mine = r.transcript.filter((t) => (t.suite ?? "chat") === id);
      row.steps += mine.length;
      for (const t of mine) if (t.ms > 0) row.ms.push(t.ms);
      row.errors += r.issues.filter((i) => (i.suite ?? "chat") === id && i.severity === "error").length;
      row.warns += r.issues.filter((i) => (i.suite ?? "chat") === id && i.severity === "warn").length;
      rows.set(id, row);
    }
  }
  if (rows.size <= 1 && rows.has("chat")) return "";
  const body = [...rows.values()].map((row) => {
    const sorted = row.ms.sort((a, b) => a - b);
    const mid = sorted.length ? (sorted[sorted.length >> 1] / 1000).toFixed(1) : "-";
    return `<tr><td>${esc(SUITE_LABEL[row.id] ?? row.id)}</td><td class="num">${row.people}</td><td class="num">${row.steps}</td><td class="num">${mid}s</td><td class="num">${row.errors ? `<b style="color:var(--crit)">${row.errors}</b>` : 0}</td><td class="num">${row.warns}</td></tr>`;
  }).join("");
  return `<h2>기능 묶음별</h2><table class="list"><thead><tr><th>묶음</th><th class="num">사람</th><th class="num">단계</th><th class="num">응답 중간값</th><th class="num">오류</th><th class="num">경고</th></tr></thead><tbody>${body}</tbody></table>`;
}

/** 채팅 밖 묶음의 한 단계: 무엇을 했고(제목·입력), 무엇이 돌아왔나(보이는 글들). */
function renderStep(t) {
  const outs = (t.outputs ?? []).filter((o) => o && o.text);
  return `<div class="turn">
<div class="me"><span class="who">${esc(SUITE_LABEL[t.suite] ?? t.suite)} · ${esc(t.title ?? "")}</span>${t.input ? ` <span dir="auto">${esc(t.input)}</span>` : ""}</div>
<div class="bot"><span class="who">${t.status !== undefined ? `${t.status} · ${((t.ms ?? 0) / 1000).toFixed(1)}초` : ""}</span></div>
${outs.map((o) => `<div class="fix"><span class="who">${esc(o.label)}</span> <span dir="auto">${esc(String(o.text).slice(0, 400))}</span></div>`).join("")}
${(t.issues ?? []).filter((i) => i.severity !== "info").map((i) => `<div class="iss">${badge(i.severity)} ${esc(label(i.kind))} — ${esc(i.note)}${i.sample ? ` <span class="who">${esc(i.sample)}</span>` : ""}</div>`).join("")}
</div>`;
}
