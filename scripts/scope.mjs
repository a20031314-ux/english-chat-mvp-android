#!/usr/bin/env node
/**
 * 적용 범위 찾기 — 바꾼 코드가 어느 영역·탭 화면에 닿는지(사용자 2026-11-09 "기능이 다수의 탭에 들어가 있는데 적용되지 않는 탭이 있어").
 *
 *   node scripts/scope.mjs src/lib/curriculum/quiz.ts          파일 하나(여러 개도)
 *   node scripts/scope.mjs quizbank                           기능 장부 id(scripts/features.json)
 *   node scripts/scope.mjs lbToday                            문구 키(copy.ts)
 *   node scripts/scope.mjs --diff origin/main                 그 커밋 뒤 바뀐 것 전부(커밋 안 한 것 포함)
 *   --json                                                    기계용 · --quick  같은 이름 찾기 빼고(끝내기 훅)
 *
 * 찾는 것
 *   1. 가져다 쓰는 곳: 바꾼 파일을 import하는 쪽을 따라 올라가 처음 만나는 화면 코드의 영역. 같은 영역 안에서는 더 올라가고,
 *      다른 영역 화면을 만나면 그 영역을 적고 멈춘다(AppHome처럼 탭을 얹기만 하는 곳은 hub/chat/tabs.json "hosts"로 건너뜀).
 *      API 라우트에 닿으면 그 API를 부르는 화면도 센다.
 *      타입만 가져오는 import(import type)는 동작이 안 퍼지므로 따라가지 않는다.
 *   2. 같은 문구 키: copy.ts에서 바뀐 키(또는 물은 키)를 쓰는 화면 — 같은 기능이 다른 탭에도 보이는 곳.
 *   3. 같은 이름: 바꾼 파일이 export하는 함수 이름을 다른 파일이 따로 정의 — 같은 일을 따로 하고 있어 고친 게 안 퍼질 수 있는 곳.
 *   4. 닿는 기능: 위 파일 중 기능 장부(scripts/features.json) code에 있는 것.
 *   영역 → 탭은 hub/chat/tabs.json.
 *
 * 다른 스크립트가 쓰는 것: loadGraph() · scopeOf() · tabOfArea() (scripts/asks.mjs · features.mjs · leftovers.mjs · .claude/hooks/hub.mjs)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
export const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const abs = (p) => path.resolve(ROOT, p);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));

let cached = null;
/** src 전체 import 그래프 + 영역 자리표. 한 번만 만든다. */
export function loadGraph() {
  if (cached) return cached;
  const structure = readJson("scripts/structure.json");
  const tabsConfig = readJson("hub/chat/tabs.json");
  const files = walk(SRC).filter((f) => /\.(tsx?|mjs)$/.test(f));
  const source = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));
  const isTest = (f) => /\.test\.tsx?$/.test(f) || /[\\/]__tests__[\\/]/.test(f);

  function resolveImport(from, spec) {
    let base;
    if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
    else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
    else return null;
    for (const cand of [base, base + ".ts", base + ".tsx", base + ".mjs", path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
      if (source.has(cand)) return cand;
    }
    return null;
  }

  /** file → { target → Set(이름) | "*" } */
  const imports = new Map();
  /** 실행되는 import만(타입만 가져오는 것은 동작이 안 퍼지므로 범위에서 뺌) */
  const importers = new Map();
  /** 타입 포함 전부 — 안 쓰는 코드 찾기용 */
  const importersAll = new Map();
  for (const [file, text] of source) {
    const mine = new Map();
    const add = (spec, names, typeOnly = false) => {
      const target = resolveImport(file, spec);
      if (!target || target === file) return;
      const prev = mine.get(target);
      if (prev === "*" || names === "*") mine.set(target, "*");
      else mine.set(target, new Set([...(prev ?? []), ...names]));
      if (!importersAll.has(target)) importersAll.set(target, new Set());
      importersAll.get(target).add(file);
      if (typeOnly) return;
      if (!importers.has(target)) importers.set(target, new Set());
      importers.get(target).add(file);
    };
    for (const m of text.matchAll(/(?:import|export)\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']/g)) {
      const clause = m[2];
      const spec = m[3];
      if (/\*/.test(clause)) {
        add(spec, "*");
        continue;
      }
      const names = [];
      let runtime = 0;
      const braces = clause.match(/\{([\s\S]*)\}/);
      if (braces) for (const part of braces[1].split(",")) {
        const raw = part.trim();
        const name = raw.replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
        if (!name) continue;
        names.push(name);
        if (!/^type\s/.test(raw)) runtime += 1;
      }
      const head = clause.replace(/\{[\s\S]*\}/, "").replace(/,/g, " ").trim();
      if (head && /^[A-Za-z_$][\w$]*$/.test(head)) {
        names.push("default");
        runtime += 1;
      }
      add(spec, names, Boolean(m[1]) || (names.length > 0 && runtime === 0));
    }
    for (const m of text.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)) add(m[1], "*");
    for (const m of text.matchAll(/^import\s+["']([^"']+)["']/gm)) add(m[1], []);
    imports.set(file, mine);
  }

  // 화면 코드·API·페이지 → 영역(structure.mjs와 같은 규칙: 가장 긴 키가 이김)
  const idOf = (file) => {
    const r = rel(file);
    if (r.startsWith("src/components/")) return "components/" + r.slice("src/components/".length).replace(/\.tsx?$/, "");
    if (/^src\/app\/api\/.*\/route\.ts$/.test(r) || r === "src/app/api/route.ts") return "api/" + path.posix.dirname(r).replace(/^src\/app\/api\/?/, "");
    if (/^src\/app\/.*page\.tsx$/.test(r)) return "page:/" + path.posix.dirname(r).replace(/^src\/app\/?/, "");
    return null;
  };
  const areaOfId = (id) => {
    let best = null;
    for (const key of Object.keys(structure.assign)) {
      const hit = key.endsWith("/") ? id.startsWith(key) : id === key;
      if (hit && (!best || key.length > best.length)) best = key;
    }
    return best ? structure.assign[best] : null;
  };
  const areaOf = new Map();
  for (const file of source.keys()) {
    if (isTest(file)) continue;
    const id = idOf(file);
    if (id) areaOf.set(file, areaOfId(id));
    else {
      // app 아래 페이지 보조 파일은 같은 폴더 page.tsx 영역
      const page = path.join(path.dirname(file), "page.tsx");
      if (file.startsWith(path.join(SRC, "app")) && source.has(page) && !file.includes(`${path.sep}api${path.sep}`)) {
        const pid = idOf(page);
        if (pid) areaOf.set(file, areaOfId(pid));
      }
    }
  }
  const hosts = new Set((tabsConfig.hosts ?? []).map(abs));
  const apiId = (file) => {
    const id = idOf(file);
    return id && id.startsWith("api/") ? id.slice(4) : null;
  };

  cached = { structure, tabsConfig, source, imports, importers, importersAll, areaOf, hosts, isTest, apiId, idOf };
  return cached;
}

export function tabOfArea(area) {
  const { tabsConfig } = loadGraph();
  for (const [tab, one] of Object.entries(tabsConfig.tabs)) if (one.areas.includes(area)) return tab;
  return "1";
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** ko 문구 키가 어디서 읽히나 — ui.key · copy.key · t("key") 꼴. */
function keyUsers(key) {
  const { source } = loadGraph();
  const re = new RegExp(`(?:\\.\\s*${escapeRe(key)}\\b|["'\`]${escapeRe(key)}["'\`])`);
  const out = [];
  for (const [file, text] of source) {
    const r = rel(file);
    if (r === "src/lib/copy.ts" || r.startsWith("src/lib/locales/")) continue;
    if (re.test(text)) out.push(file);
  }
  return out;
}

const GENERIC = new Set(["default", "load", "save", "clear", "render", "format", "parse", "normalize", "build", "make", "get", "set", "reset"]);

/**
 * files(저장소 기준 경로 또는 절대 경로) + keys(바뀐 문구 키) → 적용 범위.
 * 돌려주는 것: { tabs: { "2": { name, areas:[...], files:[...] } }, features:[{id,name,tabs}], sameNames:[{name, at, also:[...]}], keys:[...] }
 */
export function scopeOf(files, keys = [], { names = true } = {}) {
  const g = loadGraph();
  // 문구 묶음(copy.ts·locales)은 모든 화면이 가져다 써서 import로 따라가면 전부 걸린다 — 바뀐 키로만 범위를 본다(아래 2)
  const isCopyFile = (f) => /^src\/lib\/(copy\.ts|locales\/)/.test(rel(f)) || /[\\/]copy(\.locales)?\.ts$/.test(f);
  const start = files.map(abs).filter((f) => g.source.has(f) && !isCopyFile(f));
  const reached = new Map(); // file → { area, via }
  const note = (file, area, via) => {
    if (!area) return;
    if (!reached.has(file)) reached.set(file, { area, via });
  };

  // 1. 가져다 쓰는 곳
  const seen = new Set();
  const apiSeen = new Set();
  // 화면이 아닌 파일(lib·server)끼리는 LIB_HOPS번까지만 올라간다 — 공용 lib를 끝까지 따라가면 모든 화면이 걸려 쓸모가 없다
  // (structure.mjs "다른 영역이 씀"과 같은 생각). 화면 코드를 만나면 다시 0부터.
  const LIB_HOPS = 2;
  const queue = start.map((f) => ({ file: f, area: g.areaOf.get(f) ?? null, via: rel(f), hops: 0 }));
  while (queue.length) {
    const { file, area, via, hops } = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    if (g.isTest(file)) continue;
    const myArea = g.areaOf.get(file) ?? null;
    if (myArea) note(file, myArea, via);
    // 다른 영역 화면을 만났으면 거기서 멈춘다(그 영역은 적었음)
    if (myArea && area && myArea !== area) continue;
    const api = g.apiId(file);
    if (api && !apiSeen.has(api)) {
      apiSeen.add(api);
      const re = new RegExp(`["'\`]/api/${escapeRe(api)}(?=["'\`?/]|\\$\\{)`);
      for (const [other, text] of g.source) {
        if (other.includes(`${path.sep}app${path.sep}api${path.sep}`) || g.isTest(other)) continue;
        if (re.test(text)) queue.push({ file: other, area: null, via: `/api/${api}`, hops: 0 });
      }
      continue;
    }
    const nextHops = myArea ? 0 : hops + 1;
    if (nextHops > LIB_HOPS) continue;
    for (const user of g.importers.get(file) ?? []) {
      if (g.hosts.has(user)) continue;
      queue.push({ file: user, area: myArea ?? area, via: rel(file), hops: nextHops });
    }
  }

  // 2. 같은 문구 키
  // 시작 파일 안의 키까지 다 넣으면 흔한 문구가 엉뚱한 화면을 끌어온다 — 바뀐(또는 물은) 키만.
  const allKeys = new Set(keys);
  const keyHits = [];
  for (const key of allKeys) {
    const users = keyUsers(key).filter((u) => !start.includes(u));
    // 흔한 버튼 키(닫기·저장 등)는 어디에나 있어 범위가 아니다
    if (users.length > 6) continue;
    for (const u of users) {
      const area = g.areaOf.get(u) ?? [...(g.importers.get(u) ?? [])].map((x) => g.areaOf.get(x)).find(Boolean);
      if (area) {
        note(u, area, `문구 ${key}`);
        keyHits.push({ key, file: rel(u) });
      }
    }
  }

  // 3. 같은 이름 따로 정의
  const sameNames = [];
  for (const f of names ? start : []) {
    const text = g.source.get(f);
    const names = [...text.matchAll(/^export\s+(?:async\s+)?(?:function\s*\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
    for (const name of names) {
      if (name.length < 6 || GENERIC.has(name)) continue;
      const re = new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?(?:async\\s+)?(?:function\\s*\\*?\\s*${escapeRe(name)}\\b|(?:const|let)\\s+${escapeRe(name)}\\s*[=:])`);
      const also = [];
      for (const [other, otherText] of g.source) {
        if (other === f || g.isTest(other)) continue;
        if (re.test(otherText)) also.push(rel(other));
      }
      if (also.length) sameNames.push({ name, at: rel(f), also });
    }
  }

  // 탭별로 모으기
  const tabs = {};
  for (const [file, { area, via }] of reached) {
    const tab = tabOfArea(area);
    tabs[tab] ??= { name: g.tabsConfig.tabs[tab]?.name ?? tab, areas: [], files: [] };
    if (!tabs[tab].areas.includes(area)) tabs[tab].areas.push(area);
    tabs[tab].files.push({ file: rel(file), area, via });
  }
  // 가져다 쓰는 곳·문구로 닿은 탭(같은 이름은 뺌) — 기능 장부 "쓰는 곳" 칸
  const usedBy = Object.keys(tabs).sort();
  for (const s of sameNames) for (const other of s.also) {
    const area = g.areaOf.get(abs(other)) ?? [...(g.importers.get(abs(other)) ?? [])].map((x) => g.areaOf.get(x)).find(Boolean);
    if (!area) continue;
    const tab = tabOfArea(area);
    tabs[tab] ??= { name: g.tabsConfig.tabs[tab]?.name ?? tab, areas: [], files: [] };
    if (!tabs[tab].areas.includes(area)) tabs[tab].areas.push(area);
    if (!tabs[tab].files.some((x) => x.file === other)) tabs[tab].files.push({ file: other, area, via: `같은 이름 ${s.name}` });
  }

  // 4. 닿는 기능
  const ledger = readJson("scripts/features.json");
  const touched = new Set([...start.map(rel), ...[...reached.keys()].map(rel)]);
  const features = ledger.features
    .filter((one) => one.status === "live" && (one.code ?? []).some((c) => touched.has(c)))
    .map((one) => ({ id: one.id, name: one.name }));

  return { start: start.map(rel), tabs, usedBy, features, sameNames, keys: [...allKeys], keyHits };
}

/** base 뒤 바뀐 파일(커밋 안 한 것 포함)과 copy.ts에서 바뀐 키. */
export function changedSince(base) {
  const out = execFileSync("git", ["diff", "--name-only", base], { cwd: ROOT, encoding: "utf8" });
  const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "src"], { cwd: ROOT, encoding: "utf8" });
  const all = [...new Set([...out.split("\n"), ...untracked.split("\n")].filter(Boolean))];
  // 주석만 바뀐 파일은 동작이 안 바뀌므로 범위에서 뺀다(경로 이름 바꾸기 같은 것)
  const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1").replace(/\s+/g, "");
  const commentOnly = (file) => {
    if (!/\.(tsx?|mjs)$/.test(file) || !fs.existsSync(path.join(ROOT, file))) return false;
    try {
      const before = execFileSync("git", ["show", `${base}:${file}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 });
      return strip(before) === strip(fs.readFileSync(path.join(ROOT, file), "utf8"));
    } catch {
      return false;
    }
  };
  const files = all.filter((f) => !f.startsWith("src/") || !commentOnly(f));
  const keys = new Set();
  if (files.includes("src/lib/copy.ts")) {
    const diff = execFileSync("git", ["diff", "-U0", base, "--", "src/lib/copy.ts"], { cwd: ROOT, encoding: "utf8" });
    for (const m of diff.matchAll(/^[+-]\s{4}([A-Za-z_]\w*)\s*:/gm)) keys.add(m[1]);
  }
  return { files, keys: [...keys] };
}

/** 인자 하나 → 파일 목록 + 키(파일 경로 · 기능 id · 문구 키). */
function resolveArg(arg) {
  if (fs.existsSync(abs(arg))) return { files: [arg], keys: [] };
  const ledger = readJson("scripts/features.json");
  const one = ledger.features.find((x) => x.id === arg || x.copy === arg);
  if (one) return { files: one.code ?? [], keys: one.copy ? [one.copy] : [] };
  const copy = fs.readFileSync(path.join(SRC, "lib", "copy.ts"), "utf8");
  if (new RegExp(`\\n {4}${escapeRe(arg)}\\s*:`).test(copy)) return { files: [], keys: [arg] };
  throw new Error(`모름: ${arg} — 파일 경로·기능 id(scripts/features.json)·문구 키(copy.ts) 중 하나`);
}

export function formatScope(result, { mine } = {}) {
  const lines = [];
  const tabIds = Object.keys(result.tabs).sort();
  lines.push(`적용 범위 — 시작 ${result.start.length}개 파일${result.keys.length ? ` · 문구 키 ${result.keys.length}` : ""}`);
  if (!tabIds.length) lines.push("  닿는 화면 없음(스크립트·문서만이거나 화면이 안 씀)");
  for (const tab of tabIds) {
    const one = result.tabs[tab];
    lines.push(`- 탭 ${tab} ${one.name}${mine && tab === String(mine) ? " (이 채팅)" : ""} — 영역 ${one.areas.join(" · ")}`);
    for (const f of one.files.slice(0, 12)) lines.push(`    ${f.file}  ← ${f.via}`);
    if (one.files.length > 12) lines.push(`    … ${one.files.length - 12}개 더`);
  }
  if (result.features.length) lines.push(`닿는 기능(장부): ${result.features.map((f) => `${f.name}(${f.id})`).join(" · ")}`);
  if (result.sameNames.length) {
    lines.push("같은 이름을 따로 정의한 곳 — 같은 일을 두 번 하고 있으면 한쪽만 고쳐진다:");
    for (const s of result.sameNames) lines.push(`    ${s.name}: ${s.at} ↔ ${s.also.join(", ")}`);
  }
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const diffAt = args.indexOf("--diff");
  let files = [];
  let keys = [];
  if (diffAt >= 0) {
    const changed = changedSince(args[diffAt + 1] ?? "HEAD");
    files = changed.files.filter((f) => f.startsWith("src/"));
    keys = changed.keys;
  }
  for (const arg of args.filter((a, i) => !a.startsWith("--") && !(diffAt >= 0 && i === diffAt + 1))) {
    const r = resolveArg(arg);
    files.push(...r.files);
    keys.push(...r.keys);
  }
  if (!files.length && !keys.length) {
    console.error("쓰는 법: node scripts/scope.mjs <파일|기능 id|문구 키> … | --diff <커밋>");
    process.exit(2);
  }
  const result = scopeOf(files, keys, { names: !args.includes("--quick") });
  console.log(json ? JSON.stringify(result, null, 2) : formatScope(result));
}
