/**
 * 스크린샷 모음 할 일 계산(hub/SHOTS.md "정리·고르기"). 규칙은 scripts/shots-rules.mjs.
 *
 * 입력: ArtifactData `list`의 out_dir로 내려받은 tmp/shots/db/shots/*.json, tmp/shots/db/picks/*.json
 * 출력: tmp/shots/plan.json — 칸별 그림(nodes·sections), 정리 예정 표시·풀기·지우기, 꼬리표 없는 것, 내려받을 그림.
 * 영역이 언제 바뀌었는지는 hub/STRUCTURE.md의 그 영역 화면·API 파일을 git log로 본다.
 *
 * 실행: node scripts/shots-plan.mjs [--today YYYY-MM-DD]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { planShots } from "./shots-rules.mjs";

const ROOT = process.cwd();
const DB = path.join(ROOT, "tmp/shots/db");
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : null;
};
const today = arg("today") ?? new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

const readDir = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => ({ id: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) }))
    : [];
const shots = readDir(path.join(DB, "shots"));
const picks = Object.fromEntries(readDir(path.join(DB, "picks")).map(({ id, ...rest }) => [id, rest]));

// 영역 → 화면·API 파일 → 마지막으로 바뀐 날.
const structure = fs.readFileSync(path.join(ROOT, "hub/STRUCTURE.md"), "utf8");
const changed = {};
for (const block of structure.split(/\n(?=### )/)) {
  const head = block.match(/^### .+? `(\w+)`/);
  if (!head) continue;
  const names = (label) => [...((block.match(new RegExp(`^- ${label}: (.+)$`, "m")) || [, ""])[1]).matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  const files = [
    ...names("화면").flatMap((n) => [`src/components/${n}.tsx`, `src/components/${n}.ts`]),
    ...names("API").map((n) => `src/app/api/${n}`),
    ...names("웹 페이지").map((n) => `src/app${n === "/" ? "/page.tsx" : n}`),
  ].filter((f) => fs.existsSync(path.join(ROOT, f)));
  if (!files.length) continue;
  try {
    const at = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], { cwd: ROOT, encoding: "utf8" }).trim();
    if (at) changed[head[1]] = at;
  } catch {}
}

const plan = planShots({ shots, picks, changed, today });
fs.mkdirSync(path.join(ROOT, "tmp/shots"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "tmp/shots/plan.json"), JSON.stringify({ today, changed, ...plan }, null, 1));
const nodeCount = Object.keys(plan.nodes).length;
console.log(`스크린샷 ${shots.length}장 · 고른 칸 ${Object.keys(plan.sections).length} · 자동으로 그림 붙는 칸 ${nodeCount}`);
console.log(`정리 예정 새로 ${plan.marks.length} · 풀기 ${plan.unmarks.length} · 지우기 ${plan.deletes.length} · 꼬리표 없음 ${plan.untagged.length}`);
for (const m of plan.marks) console.log(`  표시 ${m.id} — ${m.reason}`);
for (const d of plan.deletes) console.log(`  지움 ${d.id}`);
console.log("→ tmp/shots/plan.json");
