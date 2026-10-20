#!/usr/bin/env node
/**
 * 앱 전체구조(hub/STRUCTURE.md)의 자동 부분을 코드에서 만든다.
 *
 *   node scripts/structure.mjs                 자동 부분을 다시 써 넣는다
 *   node scripts/structure.mjs --check         자리표가 맞고 자동 부분이 최신인지 (어긋나면 exit 1)
 *   node scripts/structure.mjs --check --assign-only
 *                                              자리표만 본다 (CI가 모든 push에서, 끝내기 훅이)
 *
 * 손으로 쓰는 부분(화면 흐름·규칙)은 STRUCTURE.md의 표시 줄 위에 있고 이 스크립트는 건드리지 않는다.
 * 자리표는 scripts/structure.json: 화면 코드·API·웹 페이지가 어느 영역에 속하는지.
 * 새 파일이 영역에 안 들어가 있거나, 아무것도 가리키지 않는 키가 남으면 실패한다 — 그래서 구조가
 * 코드보다 뒤처질 수 없다. 키·네트워크가 필요 없고, 날짜·커밋 같은 바뀌는 값은 쓰지 않는다(쓸데없는 커밋 방지).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const DOC = path.join(ROOT, "hub", "STRUCTURE.md");
const MAP = path.join(ROOT, "scripts", "structure.json");
const BEGIN = "<!-- 자동: scripts/structure.mjs가 아래를 다시 쓴다. 손으로 고치지 않는다. -->";
const END = "<!-- 자동 끝 -->";

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const ASSIGN_ONLY = args.has("--assign-only");

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const config = JSON.parse(fs.readFileSync(MAP, "utf8"));
const AREAS = config.areas;
const ASSIGN = config.assign;
const EXTERNAL = config.external || {};

// ---- 항목: 화면 코드 · API · 웹 페이지 ----

const allSrc = walk(SRC).filter((f) => /\.(tsx?|mjs)$/.test(f) && !/\.test\.tsx?$/.test(f));

const components = allSrc
  .filter((f) => f.startsWith(path.join(SRC, "components") + path.sep))
  .map((f) => ({ id: "components/" + rel(f).replace(/^src\/components\//, "").replace(/\.tsx?$/, ""), file: f }));

const apiRoutes = allSrc
  .filter((f) => /[\\/]route\.ts$/.test(f) && f.startsWith(path.join(SRC, "app", "api") + path.sep))
  .map((f) => ({ id: "api/" + rel(path.dirname(f)).replace(/^src\/app\/api\/?/, ""), file: f }));

const pages = allSrc
  .filter((f) => /[\\/]page\.tsx$/.test(f) && !f.startsWith(path.join(SRC, "app", "api") + path.sep))
  .map((f) => {
    const dir = rel(path.dirname(f)).replace(/^src\/app\/?/, "");
    return { id: "page:/" + dir, file: f };
  });

const items = [...components, ...apiRoutes, ...pages];

/** 가장 긴 키가 이긴다. '/'로 끝나는 키는 그 아래 전부, 아니면 그 항목 하나. */
function areaOf(id) {
  let best = null;
  for (const key of Object.keys(ASSIGN)) {
    const hit = key.endsWith("/") ? id.startsWith(key) : id === key;
    if (hit && (!best || key.length > best.length)) best = key;
  }
  return best ? { key: best, area: ASSIGN[best] } : null;
}

const problems = [];
const usedKeys = new Set();
for (const item of items) {
  const hit = areaOf(item.id);
  if (!hit) {
    problems.push(`영역 없음: ${item.id} (${rel(item.file)}) → scripts/structure.json "assign"에 넣는다`);
    continue;
  }
  if (!AREAS[hit.area]) problems.push(`없는 영역 "${hit.area}": ${hit.key} → "areas"에 더하거나 고친다`);
  item.area = hit.area;
  usedKeys.add(hit.key);
}
for (const key of Object.keys(ASSIGN)) {
  if (!usedKeys.has(key)) problems.push(`아무것도 안 가리키는 키: "${key}" → 지우거나 고친다 (파일이 옮겨졌나?)`);
}
for (const key of Object.keys(EXTERNAL)) {
  if (!apiRoutes.some((r) => r.id === key)) problems.push(`없는 API의 설명: external "${key}" → 지운다`);
}

if (problems.length) {
  console.error("전체구조 자리표가 코드와 어긋남 (scripts/structure.json):\n" + problems.map((p) => "- " + p).join("\n"));
  process.exit(1);
}
if (CHECK && ASSIGN_ONLY) {
  console.log(`전체구조 자리표 맞음: 화면 코드 ${components.length} · API ${apiRoutes.length} · 웹 페이지 ${pages.length}`);
  process.exit(0);
}

// ---- 가져오기 그래프: 누가 누구를 쓰나 ----

const source = new Map(allSrc.map((f) => [f, fs.readFileSync(f, "utf8")]));

function resolveImport(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const cand of [base, base + ".ts", base + ".tsx", path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (source.has(cand)) return cand;
  }
  return null;
}

/** file → 이 파일을 가져다 쓰는 파일들 */
const importers = new Map();
for (const [file, text] of source) {
  const specs = [...text.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g)].map((m) => m[1]);
  for (const spec of specs) {
    const target = resolveImport(file, spec);
    if (!target || target === file) continue;
    if (!importers.has(target)) importers.set(target, new Set());
    importers.get(target).add(file);
  }
}

const itemByFile = new Map(items.map((i) => [i.file, i]));

/**
 * 파일을 쓰는 영역들: 화면 코드·페이지면 그 영역, lib 등이면 그것을 쓰는 쪽을 따라 올라간다.
 * 공용 lib(결제·계정 등)를 끝까지 따라가면 모든 영역이 걸려 쓸모가 없어서 lib는 두 단계까지만 올라간다.
 */
function areasUsing(file, seen = new Set(), depth = 0) {
  const out = new Set();
  if (seen.has(file) || depth > 2) return out;
  seen.add(file);
  const item = itemByFile.get(file);
  if (item && !item.id.startsWith("api/")) {
    out.add(item.area);
    return out;
  }
  // app 아래의 페이지 보조 파일(LearningClient.tsx 등)은 같은 폴더의 page.tsx 영역으로.
  const pageHere = path.join(path.dirname(file), "page.tsx");
  if (file.startsWith(path.join(SRC, "app")) && itemByFile.has(pageHere)) {
    out.add(itemByFile.get(pageHere).area);
    return out;
  }
  for (const user of importers.get(file) || []) for (const a of areasUsing(user, seen, depth + 1)) out.add(a);
  return out;
}

// ---- API를 부르는 곳 ----

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const scriptFiles = walk(path.join(ROOT, "scripts")).filter((f) => /\.m?js$/.test(f));
const scriptText = new Map(scriptFiles.map((f) => [f, fs.readFileSync(f, "utf8")]));

for (const route of apiRoutes) {
  const re = new RegExp(`["'\`]/${escapeRe(route.id)}(?=["'\`?/]|\\$\\{)`);
  const callers = new Set();
  for (const [file, text] of source) {
    if (file.startsWith(path.join(SRC, "app", "api") + path.sep)) continue;
    if (re.test(text)) for (const a of areasUsing(file)) callers.add(a);
  }
  route.callers = callers;
  route.scripts = [...scriptText].filter(([, t]) => re.test(t)).map(([f]) => rel(f));
}

// ---- 화면끼리 부르는 신호 (lib/appIntents.ts) ----

const intentsFile = path.join(SRC, "lib", "appIntents.ts");
const intentNames = [];
{
  const text = source.get(intentsFile) || "";
  const block = text.match(/export type AppIntents = \{([\s\S]*?)\n\};/);
  if (block) for (const m of block[1].matchAll(/^\s{2}(\w+):/gm)) intentNames.push(m[1]);
}
const intents = intentNames.map((name) => {
  const send = new Set();
  const listen = new Set();
  for (const [file, text] of source) {
    if (file === intentsFile) continue;
    if (new RegExp(`sendAppIntent\\(\\s*["']${name}["']`).test(text)) for (const a of areasUsing(file)) send.add(a);
    if (new RegExp(`onAppIntent\\(\\s*["']${name}["']`).test(text)) for (const a of areasUsing(file)) listen.add(a);
  }
  return { name, send, listen };
});

// ---- 하단 탭 (AppHome.tsx) ----

function koLabel(key) {
  const text = source.get(path.join(SRC, "lib", "copy.ts")) || "";
  const start = text.indexOf("\n  ko: {");
  const end = text.indexOf("\n  en: {", start);
  const ko = text.slice(start, end > start ? end : undefined);
  const m = ko.match(new RegExp(`\\n\\s+${key}:\\s*"([^"]*)"`));
  return m ? m[1] : key;
}

function tabList(varName) {
  const text = source.get(path.join(SRC, "components", "AppHome.tsx")) || "";
  const block = text.match(new RegExp(`const ${varName}[^=]*=\\s*\\[([\\s\\S]*?)\\n  \\];`));
  if (!block) return null;
  const myLabel = (text.match(/const myItem = \{ id: "(\w+)" as const, label: ui\.(\w+)/) || []).slice(1);
  const tabs = [];
  for (const m of block[1].matchAll(/\{ id: "(\w+)"(?: as const)?, label: ui\.(\w+) \}|\bmyItem\b/g)) {
    if (m[0] === "myItem") tabs.push({ id: myLabel[0], label: koLabel(myLabel[1]) });
    else tabs.push({ id: m[1], label: koLabel(m[2]), optional: /roleplayAvailable/.test(block[1].slice(0, m.index).split("\n").slice(-2).join("")) });
  }
  return tabs;
}

// ---- 글로 ----

const areaTitle = (a) => AREAS[a].split(" — ")[0].split(" (")[0];
/** 영역 순서대로. 개발용(ops)은 영향 범위로 세지 않는다. */
const names = (set) =>
  [...set].filter((a) => a !== "ops").sort((a, b) => Object.keys(AREAS).indexOf(a) - Object.keys(AREAS).indexOf(b));
/** 영역 이름 목록. 너무 많으면 "여러 곳"으로 줄인다(공용인 것은 어차피 다 본다). */
const areaList = (list) => (list.length >= 6 ? `여러 영역 ${list.length}곳` : list.map(areaTitle).join(", "));
const short = (id) => id.replace(/^components\//, "").replace(/^api\//, "");

const lines = [];
lines.push("## 자동: 하단 탭 (`src/components/AppHome.tsx`)", "");
const social = tabList("socialTabItems");
const ai = tabList("aiTabItems");
const fmtTabs = (tabs) => tabs.map((t) => `${t.label}\`${t.id}\`${t.optional ? "*" : ""}`).join(" · ");
if (social) lines.push(`- 사람 기능 켜짐: ${fmtTabs(social)}`);
if (ai) lines.push(`- 사람 기능 꺼짐(iOS 1차, \`socialFeaturesEnabled()\`): ${fmtTabs(ai)}`);
if (ai?.some((t) => t.optional)) lines.push("- \\* 그 학습 언어에 통화 대본이 있을 때만(`hasRoleplay`)");
lines.push("");

lines.push("## 자동: 영역별 코드", "");
lines.push("> 화면 = `src/components/`, API = `src/app/api/`. API 뒤 괄호는 이 영역 밖에서 그 API를 부르는 영역,");
lines.push("> \"다른 영역이 씀\"은 이 영역 화면 코드를 가져다 쓰는 다른 영역. 고치기 전에 여기서 영향 범위를 본다.", "");

for (const area of Object.keys(AREAS)) {
  const mine = items.filter((i) => i.area === area);
  if (!mine.length) continue;
  lines.push(`### ${AREAS[area]} \`${area}\``);
  const comps = mine.filter((i) => i.id.startsWith("components/"));
  const apis = mine.filter((i) => i.id.startsWith("api/"));
  const pgs = mine.filter((i) => i.id.startsWith("page:"));
  if (comps.length) lines.push(`- 화면: ${comps.map((c) => "`" + short(c.id) + "`").join(" · ")}`);
  if (apis.length) {
    const parts = apis.map((r) => {
      const others = names(r.callers).filter((a) => a !== area);
      return "`" + short(r.id) + "`" + (others.length ? `(${areaList(others)})` : "");
    });
    lines.push(`- API: ${parts.join(" · ")}`);
  }
  if (pgs.length) lines.push(`- 웹 페이지: ${pgs.map((p) => "`" + p.id.replace(/^page:/, "") + "`").join(" · ")}`);
  // 가져다 쓰는 파일마다 그 영역을 본다(자기 영역은 뺀다).
  const sharedList = comps
    .map((c) => {
      const users = new Set();
      for (const f of importers.get(c.file) || []) for (const a of areasUsing(f)) if (a !== area) users.add(a);
      return { c, users: names(users) };
    })
    .filter((x) => x.users.length);
  if (sharedList.length) {
    lines.push(`- 다른 영역이 씀: ${sharedList.map((x) => "`" + short(x.c.id) + "` ← " + areaList(x.users)).join(" · ")}`);
  }
  lines.push("");
}

lines.push("## 자동: 화면끼리 부르는 신호 (`src/lib/appIntents.ts`)", "");
lines.push("| 신호 | 보내는 영역 | 받는 영역 |", "|---|---|---|");
for (const it of intents) {
  lines.push(`| \`${it.name}\` | ${areaList(names(it.send)) || "—"} | ${areaList(names(it.listen)) || "—"} |`);
}
lines.push("");

const unusedComps = components.filter((c) => !(importers.get(c.file)?.size));
const unusedApis = apiRoutes.filter((r) => !r.callers.size && !r.scripts.length && !EXTERNAL[r.id]);
const scriptOnly = apiRoutes.filter((r) => !r.callers.size && r.scripts.length && !EXTERNAL[r.id]);
lines.push("## 자동: 쓰지 않는 것 (지울지 확인)", "");
lines.push(`- 아무도 안 가져다 쓰는 화면 코드: ${unusedComps.length ? unusedComps.map((c) => "`" + short(c.id) + "`").join(" · ") : "없음"}`);
lines.push(`- 앱·스크립트 어디서도 안 부르는 API: ${unusedApis.length ? unusedApis.map((r) => "`" + short(r.id) + "`").join(" · ") : "없음"}`);
if (scriptOnly.length) lines.push(`- 스크립트만 부르는 API: ${scriptOnly.map((r) => "`" + short(r.id) + "`").join(" · ")}`);
const ext = Object.entries(EXTERNAL);
if (ext.length) lines.push(`- 밖에서 부르는 API: ${ext.map(([k, v]) => "`" + short(k) + "` " + v).join(" · ")}`);

const generated = `${BEGIN}\n\n${lines.join("\n").trimEnd()}\n\n${END}`;

// ---- 써 넣기 ----

const doc = fs.existsSync(DOC) ? fs.readFileSync(DOC, "utf8") : "";
const b = doc.indexOf(BEGIN);
const e = doc.indexOf(END);
if (b < 0 || e < b) {
  console.error(`hub/STRUCTURE.md에 자동 부분 표시 줄이 없다. 맨 끝에 다음 두 줄을 넣는다:\n${BEGIN}\n${END}`);
  process.exit(1);
}
const next = doc.slice(0, b) + generated + doc.slice(e + END.length);

if (CHECK) {
  if (next !== doc) {
    console.error("hub/STRUCTURE.md 자동 부분이 코드와 다르다 → node scripts/structure.mjs");
    process.exit(1);
  }
  console.log("전체구조 최신");
  process.exit(0);
}
if (next !== doc) {
  fs.writeFileSync(DOC, next);
  console.log("hub/STRUCTURE.md 자동 부분을 다시 씀");
} else {
  console.log("hub/STRUCTURE.md 그대로");
}
