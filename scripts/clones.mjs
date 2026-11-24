#!/usr/bin/env node
/**
 * 같은 일을 따로 하는 코드 찾기(사용자 2026-11-24 "연결된 기능 중 고도화되거나 변경된 기능이 있다면 맞출 수 있게").
 * scripts/scope.mjs는 이름이 같은 함수만 본다 — 이름을 바꿔 베낀 로직은 거기서 안 보인다. 여기서는 코드 조각을 비교한다.
 *
 * 방법(모델 없음): src의 .ts/.tsx(테스트·낱말 데이터·로캘 빼고)를 낱말 단위로 자르고, 글자·숫자 값은 한 표시로 바꾼 뒤
 * 연속 WINDOW 낱말 조각의 지문을 모아, 서로 다른 두 파일이 MIN 낱말 넘게 같은 조각을 이어서 가지면 "복제"로 본다.
 * 서로 다른 두 파일이면 모두 낸다(같은 영역의 1:1·단체방처럼 한 영역 안에서도 한쪽만 고치면 어긋난다). 영역은 scripts/structure.json assign, 없으면 src 아래 두 폴더.
 *
 *   node scripts/clones.mjs           → 복제 목록(큰 것부터) — hub/app/clones.md 다시 씀
 *   node scripts/clones.mjs --new     → 기준(scripts/clones.json)에 없던 것만, 있으면 exit 1(예약 작업 "연결 맞춤 점검"이 읽음 — CI는 안 막음)
 *   node scripts/clones.mjs --write   → 지금 것을 기준으로(보고 정리한 뒤)
 *   --json
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WINDOW = 40;
const MIN = 120;
const args = process.argv.slice(2);
const baselineFile = path.join(root, "scripts/clones.json");
const outFile = path.join(root, "hub/app/clones.md");

const skipDir = /src\/lib\/curriculum\/(vocab|word-sentences|word-traits|pairs|frames|fixedLessons|stages|letters)|src\/lib\/locales|node_modules/;
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (!skipDir.test(rel)) walk(rel);
    } else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$|\.d\.ts$/.test(e.name) && !/copy\.ts$/.test(e.name)) files.push(rel);
  }
};
walk("src");

const structure = JSON.parse(fs.readFileSync(path.join(root, "scripts/structure.json"), "utf8"));
const placeOf = structure.assign ?? {};
const placeKeys = Object.keys(placeOf).sort((a, b) => b.length - a.length);
/** 화면은 structure.json 영역, 그 밖은 src 아래 첫 두 폴더. */
function areaOf(file) {
  const rel = file.replace(/^src\//, "").replace(/\.tsx?$/, "");
  for (const key of placeKeys) if (rel === key || rel.startsWith(key.endsWith("/") ? key : `${key}/`)) return placeOf[key];
  const api = rel.match(/^app\/api\/(.*)\/route$/);
  if (api) for (const key of placeKeys) if (key === `api/${api[1]}` || `api/${api[1]}`.startsWith(key)) return placeOf[key];
  return rel.split("/").slice(0, 2).join("/");
}

function tokens(text) {
  const out = [];
  const lines = [];
  const re = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|\d[\d_.]*|[A-Za-z_$][\w$]*|\n|[^\s\w]/g;
  let line = 1;
  for (const m of text.matchAll(re)) {
    const t = m[0];
    if (t === "\n") {
      line += 1;
      continue;
    }
    if (t.startsWith("//") || t.startsWith("/*")) {
      line += (t.match(/\n/g) ?? []).length;
      continue;
    }
    const norm = /^["'`]/.test(t) ? "S" : /^\d/.test(t) ? "N" : t;
    out.push(norm);
    lines.push(line);
    line += (t.match(/\n/g) ?? []).length;
  }
  return { out, lines };
}

const index = new Map();
const parsed = new Map();
for (const file of files) {
  const { out, lines } = tokens(fs.readFileSync(path.join(root, file), "utf8"));
  parsed.set(file, { out, lines });
  for (let i = 0; i + WINDOW <= out.length; i += 1) {
    const h = crypto.createHash("sha1").update(out.slice(i, i + WINDOW).join(" ")).digest("base64").slice(0, 12);
    const list = index.get(h);
    if (list) {
      if (list.length < 6) list.push([file, i]);
    } else index.set(h, [[file, i]]);
  }
}

// 두 파일 사이 같은 조각들을 이어 붙여 구간으로.
const pairs = new Map();
for (const list of index.values()) {
  if (list.length < 2 || list.length > 5) continue; // 흔한 틀(import 묶음 등)은 뺀다
  for (let a = 0; a < list.length; a += 1)
    for (let b = a + 1; b < list.length; b += 1) {
      const [fa, ia] = list[a];
      const [fb, ib] = list[b];
      if (fa === fb) continue;
      const [x, y] = fa < fb ? [[fa, ia], [fb, ib]] : [[fb, ib], [fa, ia]];
      const key = `${x[0]}|${y[0]}`;
      const hits = pairs.get(key) ?? [];
      hits.push([x[1], y[1]]);
      pairs.set(key, hits);
    }
}

const found = [];
for (const [key, hits] of pairs) {
  const [fa, fb] = key.split("|");
  hits.sort((p, q) => p[0] - q[0]);
  let run = null;
  const runs = [];
  for (const [ia, ib] of hits) {
    if (run && ia <= run.ea + 1 && ib - ia === run.d) run.ea = ia;
    else {
      if (run) runs.push(run);
      run = { sa: ia, ea: ia, d: ib - ia };
    }
  }
  if (run) runs.push(run);
  for (const r of runs) {
    const size = r.ea - r.sa + WINDOW;
    if (size < MIN) continue;
    const A = parsed.get(fa);
    const B = parsed.get(fb);
    found.push({
      a: `${fa}:${A.lines[r.sa]}-${A.lines[Math.min(r.ea + WINDOW - 1, A.lines.length - 1)]}`,
      b: `${fb}:${B.lines[r.sa + r.d]}-${B.lines[Math.min(r.ea + r.d + WINDOW - 1, B.lines.length - 1)]}`,
      size,
      areas: [areaOf(fa), areaOf(fb)],
      id: `${fa}|${fb}|${A.out.slice(r.sa, r.sa + 12).join(" ")}`,
    });
  }
}
found.sort((p, q) => q.size - p.size);

const baseline = fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, "utf8")) : { known: [] };
const known = new Set(baseline.known ?? []);
const fresh = found.filter((f) => !known.has(f.id));

if (args.includes("--write")) {
  fs.writeFileSync(baselineFile, `${JSON.stringify({ _: "scripts/clones.mjs 기준 — 보고 정리한(또는 일부러 둔) 복제. 새로 생긴 것만 예약 작업이 보고한다.", known: found.map((f) => f.id) }, null, 2)}\n`);
  console.log(`기준 적음: 복제 ${found.length}`);
}

const md = [
  "# 같은 일을 따로 하는 코드(복제)",
  "",
  "> **자동 생성** — `node scripts/clones.mjs`(모델 없음). 영역이 다른 두 파일이 낱말 " + MIN + "개 넘게 같은 코드를 가진 곳. 한쪽만 고치면 다른 쪽이 옛 동작으로 남는다 — 공용 함수로 합치거나, 기능이 연결된 것이면 `scripts/features.json` links 묶음에 넣는다.",
  "> 예약 작업 \"연결 맞춤 점검\"이 주 1회 돌려 새로 생긴 것(기준 `scripts/clones.json`에 없는 것)을 `hub/work/reports.md`에 올린다.",
  "",
  `복제 ${found.length}곳 · 기준에 없던 것 ${fresh.length}`,
  "",
  "| 크기(낱말) | 한쪽 | 다른 쪽 | 영역 |",
  "|---|---|---|---|",
  ...found.slice(0, 80).map((f) => `| ${f.size}${known.has(f.id) ? "" : " 🆕"} | \`${f.a}\` | \`${f.b}\` | ${f.areas.join(" ↔ ")} |`),
  "",
].join("\n");
if (!args.includes("--new")) fs.writeFileSync(outFile, md);

if (args.includes("--json")) console.log(JSON.stringify({ total: found.length, fresh }, null, 2));
else if (args.includes("--new")) {
  if (fresh.length) {
    console.error(`새 복제 ${fresh.length}곳:\n${fresh.map((f) => `  ${f.size} ${f.a} ↔ ${f.b}`).join("\n")}`);
    process.exit(1);
  }
  console.log("새 복제 없음");
} else console.log(`복제 ${found.length}곳(새 ${fresh.length}) — hub/app/clones.md`);
