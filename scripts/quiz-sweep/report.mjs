// 퀴즈 전수 점검 보고서 — sweep.ts가 남긴 tmp/quiz-sweep/<날>/marks.jsonl · stats.json(· judge/*.verdicts.json)으로 hub/drafts/quiz-sweep-<날>.md를 만든다.
//   node scripts/quiz-sweep/report.mjs [YYYY-MM-DD]
// 판정(JUDGE.md)을 돌렸으면 그 결과도 표시로 바꿔 marks에 더하고(judge-*.jsonl은 한 번만) 판정 절을 붙인다.
import fs from "node:fs";
import path from "node:path";
import { NAMES, pieceOf, target } from "../ux-check/marks.mjs";
import { CAUSES, distinctMarks } from "./causes.mjs";

const ROOT = process.cwd();
const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const DIR = path.join(ROOT, "tmp/quiz-sweep", date);
const readLines = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
const marks = readLines(path.join(DIR, "marks.jsonl"));
const stats = JSON.parse(fs.readFileSync(path.join(DIR, "stats.json"), "utf8"));

// ---------- 판정 결과 → 표시 ----------
const verdictFiles = fs.existsSync(path.join(DIR, "judge")) ? fs.readdirSync(path.join(DIR, "judge")).filter((f) => f.endsWith(".verdicts.json")) : [];
const judged = { total: 0, byLang: {}, problems: [] };
for (const file of verdictFiles) {
  const language = file.split(".")[0];
  const rows = new Map(readLines(path.join(DIR, "judge", `${language}.jsonl`)).map((row) => [row.id, row]));
  const verdicts = JSON.parse(fs.readFileSync(path.join(DIR, "judge", file), "utf8"));
  const tally = { n: 0, ok: 0, decoy: 0, ambiguous: 0, unnatural: 0, level: 0 };
  for (const v of verdicts) {
    const row = rows.get(v.id);
    if (!row) continue;
    tally.n += 1;
    judged.total += 1;
    const issues = [];
    if (v.obviousDecoys?.length) issues.push(["easy-decoy", `한눈에 지워지는 오답: ${v.obviousDecoys.join(", ")}${v.note ? ` — ${v.note}` : ""}`]);
    if (v.alsoCorrect?.length) issues.push(["hard-ambiguous", `이것도 맞음: ${v.alsoCorrect.join(", ")}${v.note ? ` — ${v.note}` : ""}`]);
    if (v.natural === false) issues.push(["unnatural", `어색한 문장${v.fix ? ` → ${v.fix}` : ""}${v.note ? ` — ${v.note}` : ""}`]);
    if (v.level === "too-hard") issues.push(["hard-level", `${row.stage}단계에 어려움${v.note ? ` — ${v.note}` : ""}`]);
    if (v.level === "too-easy") issues.push(["easy-level", `${row.stage}단계에 너무 쉬움${v.note ? ` — ${v.note}` : ""}`]);
    if (!issues.length) tally.ok += 1;
    for (const [reason, note] of issues) {
      tally[{ "easy-decoy": "decoy", "hard-ambiguous": "ambiguous", unnatural: "unnatural", "hard-level": "level", "easy-level": "level" }[reason]] += 1;
      const before = row.sentence.split("___")[0] ?? "";
      const after = row.sentence.split("___")[1] ?? "";
      const options = row.options ?? [row.answer];
      const mark = { persona: "judge", learn: language, ui: "*", day: 0, reason, note, shot: "", stage: row.stage, questions: [{ key: row.key, kind: row.kind, text: `${before}${row.answer}${after}`, from: row.from, options, answer: Math.max(0, options.indexOf(row.answer)), before, after }] };
      judged.problems.push(mark);
    }
  }
  judged.byLang[language] = tally;
}
const all = [...marks, ...judged.problems];

// ---------- 묶기 ----------
const langs = Object.keys(stats.languages);
const reasons = [...new Set(all.map((row) => row.reason))].sort((a, b) => all.filter((r) => r.reason === b).length - all.filter((r) => r.reason === a).length);
// 앱 언어마다 다른 표시(뜻 줄)는 문제 하나로 센다.
const distinct = distinctMarks(all);
const rowsOf = (reason, learn) => [...distinct.values()].filter((row) => row.reason === reason && (!learn || row.learn === learn));

const out = [];
const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
const totalKeys = langs.reduce((n, l) => n + sum(stats.languages[l].keys), 0);
const totalQs = langs.reduce((n, l) => n + sum(stats.languages[l].questions), 0);
const totalNo = langs.reduce((n, l) => n + sum(stats.languages[l].noQuiz), 0);
out.push(`# 퀴즈 전수 점검 — ${date}`, "");
out.push(
  `> \`scripts/quiz-sweep/sweep.ts\`(규칙 검사, 모델 없음)${judged.total ? " + 판정 표본(`JUDGE.md`)" : ""} → \`report.mjs\`. 앱이 쓰는 코드(buildQuiz·bundleQuiz·nextStudy)로 문제를 만들어 검사 — 화면은 거치지 않음.`,
  `> 학습 언어 ${langs.length} × 앱 언어 ${stats.uis} = ${langs.length * stats.uis} 조합 · 단계 1~5 · 열쇠 ${totalKeys}개 · 문제 ${totalQs}개(열쇠마다 씨앗 둘 × 모양 셋) · 문제를 못 만드는 열쇠 ${totalNo}개 · 하루 흐름 ${stats.days}일 × 하루 6묶음.`,
  `> ${stats.net ? "운영 데이터 포함(--net): 앱 언어별 뜻풀이 옮김·낱말 카드(앞 100개)·문제은행 묶음." : "**앱 안 데이터만**(--net 없이): 낱말(w|)·문제은행 예문 없음, 영어·한국어 밖 앱 언어의 뜻 줄은 영어로 계산 — 뜻 줄 검사는 en·ko 앱만 정확."}`,
  `> 고치는 법: 이유마다 "고칠 자리" → \`scripts/ux-check/FIX.md\`와 같은 순서. 표시 전체: \`tmp/quiz-sweep/${date}/marks.jsonl\`(채팅이 끝나면 사라짐).`,
  "",
);

// ---------- 원인별 요약(같은 원인 수천 건이 다른 문제를 덮지 않게) ----------
out.push("## 원인별 요약", "");
out.push("| 원인 | 문제 수 | 학습 언어 | 무엇을 고치면 되나 |", "|---|---|---|---|");
const grouped = new Set();
for (const [name, test, fix] of CAUSES) {
  const list = [...distinct.values()].filter(test);
  list.forEach((row) => grouped.add(row));
  if (list.length) out.push(`| ${name} | ${list.length} | ${[...new Set(list.map((r) => r.learn))].join(" ")} | ${fix} |`);
}
for (const reason of reasons) {
  const list = [...distinct.values()].filter((row) => row.reason === reason && !grouped.has(row));
  if (list.length) out.push(`| ${NAMES[reason] ?? reason} | ${list.length} | ${[...new Set(list.map((r) => r.learn))].join(" ")} | ${target(reason, list[0].questions[0] ?? {}, list[0].learn)} |`);
}
out.push("");

out.push("## 이유 × 학습 언어 (문제 수, 앱 언어만 다른 같은 표시는 하나로)", "");
out.push(`| 이유 | ${langs.join(" | ")} | 합 |`, `|---|${langs.map(() => "---").join("|")}|---|`);
for (const reason of reasons) {
  const counts = langs.map((l) => rowsOf(reason, l).length);
  out.push(`| ${NAMES[reason] ?? reason} \`${reason}\` | ${counts.map((n) => (n ? String(n) : "·")).join(" | ")} | ${counts.reduce((a, b) => a + b, 0)} |`);
}

const leakUi = [...distinct.values()].filter((row) => row.reason === "easy-leak" && !row.uis.has("*"));
if (leakUi.length) {
  out.push("", "## 뜻 줄로 답이 새는 조합 (학습 언어 / 앱 언어 → 문제 수)", "");
  const pairs = new Map();
  for (const row of leakUi) for (const ui of row.uis) pairs.set(`${row.learn} / ${ui}`, (pairs.get(`${row.learn} / ${ui}`) ?? 0) + 1);
  out.push([...pairs.entries()].sort((a, b) => b[1] - a[1]).map(([pair, n]) => `\`${pair}\` ${n}`).join(" · "));
  out.push("", "앱 언어가 학습 언어와 같으면 답하기 전에 보이는 뜻 줄(순서 맞추기·말하기·틀린 곳 고치기)이 문장 그 자체가 된다.");
}

out.push("", "## 하루 흐름 (Quizbank 문법·표현 탭, 정답률 80% 학습자, 문제 100개당)", "");
out.push("| 학습 언어 | 탭 | 문제 | 같은 날 같은 문장 | 3일 안 다른 열쇠로 같은 문장 | 맞혀서 쉬는 열쇠가 다시 | 같은 열쇠 연달아 | 같은 열쇠 떨어져서(설계) | 빈 묶음 |", "|---|---|---|---|---|---|---|---|---|");
const per = (n, d) => (d ? (Math.round((n / d) * 1000) / 10).toString() : "·");
for (const l of langs) {
  for (const tab of ["grammar", "expression"]) {
    const flows = stats.flows.filter((f) => f.learn === l && f.tab === tab);
    const t = flows.reduce((acc, f) => ({ q: acc.q + f.questions, s: acc.s + f.sameDay, o: acc.o + f.otherKey, r: acc.r + f.resting, w: acc.w + f.twice, a: acc.a + (f.apart ?? 0), e: acc.e + f.empty, b: acc.b + f.bundles }), { q: 0, s: 0, o: 0, r: 0, w: 0, a: 0, e: 0, b: 0 });
    out.push(`| ${l} | ${tab === "grammar" ? "문법" : "표현"} | ${t.q} | ${per(t.s, t.q)} | ${per(t.o, t.q)} | ${per(t.r, t.q)} | ${per(t.w, t.q)} | ${per(t.a, t.q)} | ${t.e}/${t.b} |`);
  }
}

if (judged.total) {
  out.push("", `## 판정 표본 (판정 에이전트, ${judged.total}문제)`, "");
  out.push("| 학습 언어 | 본 문제 | 문제 없음 | 오답이 한눈에 | 답이 여럿 | 어색함 | 단계에 안 맞음 |", "|---|---|---|---|---|---|---|");
  for (const [l, t] of Object.entries(judged.byLang)) out.push(`| ${l} | ${t.n} | ${t.ok} | ${t.decoy} | ${t.ambiguous} | ${t.unnatural} | ${t.level} |`);
}

out.push("", "## 이유마다 예와 고칠 자리", "");
for (const reason of reasons) {
  // 드문 원인을 앞으로(앱 언어 = 학습 언어 뜻 줄처럼 한 원인이 수천 건인 것은 뒤로).
  const common = (row) => row.reason === "easy-leak" && !row.uis.has("*") && [...row.uis].every((ui) => ui === row.learn);
  const list = [...rowsOf(reason).filter((row) => !common(row)), ...rowsOf(reason).filter(common)];
  if (!list.length) continue;
  out.push(`### ${NAMES[reason] ?? reason} (\`${reason}\`) — ${list.length}`, "");
  // 언어가 겹치지 않게 다섯까지.
  const picked = [];
  const used = new Set();
  for (const row of list) {
    if (picked.length >= 5 || used.has(row.learn)) continue;
    picked.push(row);
    used.add(row.learn);
  }
  for (const row of list) if (picked.length < 5 && !picked.includes(row)) picked.push(row);
  for (const row of picked) {
    const q = row.questions[0] ?? {};
    const opts = Array.isArray(q.options) ? q.options.map((o, i) => (i === q.answer ? `**${o}**` : o)).join(" / ") : "";
    const uis = row.uis.has("*") ? "" : ` · 앱 ${[...row.uis].join(",")}`;
    out.push(`- ${row.learn} ${row.stage ?? "?"}단계${uis} · \`${q.key ?? "?"}\` ${q.kind ?? ""} — ${String(q.text ?? "").slice(0, 90)}${opts ? ` · 보기 ${opts}` : !opts && pieceOf(q) ? ` · 답 ${pieceOf(q)}` : ""}`);
    out.push(`  - 왜: ${row.note}`);
    const where = target(reason, q, row.learn);
    if (where) out.push(`  - 고칠 자리: ${where}`);
  }
  out.push("");
}

out.push("## 이 점검이 못 보는 것", "");
out.push(
  "- 화면: 버튼 이름·제목·카드에 답이 보이는지, 눌렀는데 안 뜨는지 — 화면 점검(`scripts/ux-check/`) 몫.",
  "- 체감: 할 일이 명확한지·계속할 이유 — 화면 점검의 인물 몫.",
  "- 오답이 그럴듯한지·문장이 자연스러운지는 코드로 못 가려서 판정 표본(학습 언어마다 일부)만 본다(`JUDGE.md`).",
  "- 어휘 탭의 넓어지는 원(circle.ts)은 `scripts/quiz-circle-sim.ts`가 따로 본다. 중국어 낱말 조각 잘림은 이 규칙으로 못 가린다(한 글자 낱말이 흔해서).",
  "",
);
const file = path.join(ROOT, "hub/drafts", `quiz-sweep-${date}.md`);
fs.writeFileSync(file, out.join("\n"));
console.log(`→ ${path.relative(ROOT, file)} (표시 ${distinct.size}개 묶음, 판정 ${judged.total})`);
