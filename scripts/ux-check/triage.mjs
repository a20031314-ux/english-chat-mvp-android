// 가상 사용자가 문제 화면에서 남긴 표시(/mark, tmp/ux/marks/<이름>.jsonl)를 이유·열쇠별로 묶고, 고칠 자리를 붙인다
// (2026-11-01 사용자 "가상 사용자 피드백을 구체화 — 난이도가 너무 쉽다면 어떤 부분이 그렇게 느껴졌는지 파악해서 바로 반영").
//   node scripts/ux-check/triage.mjs [YYYY-MM-DD]  → 표준 출력 + hub/drafts/ux-marks-<날>.md
// 고치는 쪽은 scripts/ux-check/FIX.md를 따른다.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const dir = path.join(ROOT, "tmp/ux/marks");
const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const rows = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl")).flatMap((f) => fs.readFileSync(path.join(dir, f), "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)))
  : [];

const NAMES = {
  "easy-decoy": "오답이 한눈에 지워짐",
  "easy-leak": "답이 화면에 보임",
  "easy-copy": "베끼면 됨",
  "easy-repeat": "같은 문제 또",
  "easy-level": "수준보다 쉬움",
  "hard-level": "배운 적 없음",
  "hard-ambiguous": "답이 여럿",
  "wrong-judge": "채점이 이상함",
  other: "그 밖에",
};

/** 정답 조각(고르기 = 보기[정답 자리], 쓰기 = answer 글자). */
const pieceOf = (q) => (Array.isArray(q.options) && typeof q.answer === "number" ? q.options[q.answer] : typeof q.answer === "string" ? q.answer : q.right ?? "");

/** 고칠 자리 — 데이터로 고칠 수 있으면 그 파일·키, 아니면 코드 자리. */
function target(reason, q, learn) {
  const key = q.key ?? "";
  const piece = pieceOf(q);
  if (reason === "easy-decoy" || reason === "hard-ambiguous") {
    if (key.startsWith("f|")) return `src/lib/curriculum/frames/decoys/${learn}.ts "${key.slice(2)}|${piece}"${reason === "hard-ambiguous" ? " (맞는 대안이면 빼고 plain/에서도)" : ""}`;
    if (key.startsWith("e|")) return `src/lib/curriculum/expressions/decoys/${learn}.ts "${key.slice(2)}"`;
    if (key.startsWith("w|")) return `src/lib/curriculum/wordDecoys.ts WORD_DECOYS.${learn}["${String(piece).toLocaleLowerCase()}"]`;
    return "src/lib/curriculum/quiz.ts decoys()";
  }
  if (reason === "easy-leak") return "src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · FrameLesson 제목 · quiz.ts 재료";
  if (reason === "easy-copy") return "src/lib/curriculum/quiz.ts shownLast·buildQuiz 재료(바로 본 예문 빼기) · FrameLesson 퀴즈 재료";
  if (reason === "easy-repeat") return "src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제";
  if (reason === "easy-level" || reason === "hard-level") return key.startsWith("w|") ? "src/lib/curriculum/vocabBank.ts STAGE_CUTS·낱말 단계" : "그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()";
  if (reason === "wrong-judge") return "src/app/api/curriculum/typed-check(open) · server scriptJudge";
  return "";
}

const byReason = new Map();
for (const row of rows) {
  const list = byReason.get(row.reason) ?? [];
  list.push(row);
  byReason.set(row.reason, list);
}
const out = [];
out.push(`# 가상 사용자 문제 표시 — ${date}`, "");
out.push(`> scripts/ux-check/triage.mjs가 tmp/ux/marks에서 만듦. 고치는 법: scripts/ux-check/FIX.md. 표시 ${rows.length}개, 인물 ${new Set(rows.map((r) => r.persona)).size}명.`, "");
out.push("| 이유 | 수 | 인물 |", "|---|---|---|");
for (const [reason, list] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
  out.push(`| ${NAMES[reason] ?? reason} \`${reason}\` | ${list.length} | ${[...new Set(list.map((r) => r.persona))].join(", ")} |`);
}
for (const [reason, list] of byReason) {
  out.push("", `## ${NAMES[reason] ?? reason} (\`${reason}\`)`, "");
  for (const row of list) {
    const qs = row.questions?.length ? row.questions : [{}];
    for (const q of qs) {
      const opts = Array.isArray(q.options) ? q.options.map((o, i) => (i === q.answer ? `**${o}**` : o)).join(" / ") : "";
      out.push(`- ${row.persona} ${row.learn}/${row.ui} ${row.day}일째 ${row.shot} · \`${q.key ?? "?"}\` ${q.kind ?? ""} — ${q.text ?? "(문제 없음)"}${opts ? ` · 보기 ${opts}` : ""}${!opts && pieceOf(q) ? ` · 답 ${pieceOf(q)}` : ""}`);
      out.push(`  - 왜: ${row.note || "(적지 않음)"}`);
      const where = target(reason, q, row.learn);
      if (where) out.push(`  - 고칠 자리: ${where}`);
    }
  }
}
const text = out.join("\n") + "\n";
process.stdout.write(text);
if (rows.length) {
  const file = path.join(ROOT, "hub/drafts", `ux-marks-${date}.md`);
  fs.writeFileSync(file, text);
  console.error(`→ ${path.relative(ROOT, file)}`);
}
