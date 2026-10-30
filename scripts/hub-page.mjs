/**
 * The hub as one web page: versions, the three roles with what each has open
 * and what was handed to it, the latest handoffs, and the standing decisions.
 *
 * The page is a snapshot of hub/ at the time it is built — it does not read
 * the repository live — so a chat that changes the hub rebuilds it and
 * republishes it to the same address (hub/README.md says where).
 *
 * Run: node scripts/hub-page.mjs [out.html]   (default tmp/hub/index.html)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const HUB = path.join(ROOT, "hub");
const OUT = path.resolve(process.argv[2] || "tmp/hub/index.html");
const read = (p) => fs.readFileSync(path.join(HUB, p), "utf8");

/** "## Heading" → body, for one markdown file. */
function sections(text) {
  const out = {};
  let current = "_";
  for (const line of text.split("\n")) {
    const h = line.match(/^## (.+)$/);
    if (h) {
      current = h[1].trim();
      out[current] = "";
    } else {
      out[current] = (out[current] ?? "") + line + "\n";
    }
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

const state = sections(read("STATE.md"));
const roleIds = [
  { id: "dev", file: "roles/dev.md", command: "/hub-dev" },
  { id: "qa", file: "roles/qa.md", command: "/hub-qa" },
  { id: "store", file: "roles/store.md", command: "/hub-store" },
];
const roles = roleIds.map((role) => {
  const text = read(role.file);
  const title = (text.match(/^# (.+)$/m) || [, role.id])[1];
  return { ...role, title, sections: sections(text) };
});

const inbox = read("inbox.md")
  .split("\n")
  .map((line) => line.match(/^- (\d{4}-\d{2}-\d{2}) (\w+) → (\w+): (.+)$/))
  .filter(Boolean)
  .map(([, date, from, to, text]) => ({ date, from, to, text }));

const logs = fs
  .readdirSync(path.join(HUB, "log"))
  .filter((f) => /^\d{4}-\d{2}\.md$/.test(f))
  .sort()
  .flatMap((file) =>
    read(`log/${file}`)
      .split(/\n(?=## \d{4}-\d{2}-\d{2} )/)
      .slice(1)
      .map((entry) => {
        const [head, ...body] = entry.trim().split("\n");
        const m = head.match(/^## (\d{4}-\d{2}-\d{2}) · (\w+) · (.+)$/);
        return m ? { date: m[1], role: m[2], title: m[3], body: body.join("\n").trim() } : null;
      })
      .filter(Boolean),
  )
  .reverse();

let commit = "";
try {
  commit = execFileSync("git", ["log", "-1", "--format=%h %cd", "--date=format:%Y-%m-%d %H:%M"], { cwd: ROOT, encoding: "utf8" }).trim();
} catch {
  // A snapshot without a commit stamp is still a snapshot.
}

const rules = sections(read("RULES.md"));
// 앱 구조 탭: 자동 생성된 데이터 지도(scripts/data-map.mjs)의 표.
let dataMap = "";
try {
  dataMap = sections(read("data-map.md"))["저장하는 것"] ?? "";
} catch {
  // 지도가 아직 없으면 탭을 비워 둔다.
}
// 앱 전체구조(hub/STRUCTURE.md): 화면 흐름(손으로) + 영역별 코드(scripts/structure.mjs가 자동).
let structure = "";
try {
  structure = read("STRUCTURE.md");
} catch {
  // 아직 없으면 칸을 숨긴다.
}
// 광고 구조(hub/ADS.md): 원칙(손으로) + 자리·설정·손익(scripts/ads-map.mjs가 자동). 영역 이름으로 전체구조와 이어진다.
let ads = "";
try {
  ads = read("ADS.md");
} catch {
  // 아직 없으면 칸을 숨긴다.
}
// 퀴즈 알고리즘(hub/QUIZ.md, 손으로): 무엇을·어떤 모양으로·어떤 오답과 내고 결과를 어디에 남기는지.
let quiz = "";
try {
  quiz = read("QUIZ.md");
} catch {
  // 아직 없으면 칸을 숨긴다.
}
// 잊힌 일(hub/forgotten.md, scripts/hub-forgotten.mjs가 만듦 — 예약 작업 "잊힌 일 알림"이 매일).
let forgotten = "";
try {
  forgotten = read("forgotten.md");
} catch {
  // 아직 없으면 칸을 숨긴다.
}
const data = { state, rules, roles, inbox, logs, dataMap, structure, ads, quiz, forgotten, commit, builtAt: new Date().toISOString() };
const template = fs.readFileSync(path.join(ROOT, "scripts", "hub-page.template.html"), "utf8");
const html = template.replace("/*HUB_DATA*/null", JSON.stringify(data).replace(/</g, "\\u003c"));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`hub page → ${path.relative(ROOT, OUT)} (${logs.length} handoffs, ${inbox.length} inbox)`);
