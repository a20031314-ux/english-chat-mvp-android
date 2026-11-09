#!/usr/bin/env node
/**
 * 남은 옛 코드 찾기 — 기능을 바꿨는데 옛 코드가 저절로 안 지워지는 것(사용자 2026-11-09 "개편 알고리즘과 이전 알고리즘이 둘 다 있는 채로 반영").
 *
 *   node scripts/leftovers.mjs            지금 남은 것 전부(기준에 있는 것은 "전부터"로 따로)
 *   node scripts/leftovers.mjs --check    기준(scripts/leftovers.json)에 없는 새 것이 있으면 실패(CI·끝내기 훅)
 *   node scripts/leftovers.mjs --write    기준을 지금으로 줄인다(지운 것만 빠짐 — 새 것을 기준에 넣지 않는다)
 *   --json
 *
 * 찾는 것
 *   - 아무도 안 쓰는 파일: 앱(src/app 페이지·라우트·layout, middleware)·스크립트(scripts/)에서 import를 따라가도 안 닿는 src 파일
 *   - 테스트만 쓰는 파일: 테스트에서만 닿음 — 화면이 없어진 계산이 테스트 때문에 남은 것(예: 정기 시험 exam.ts)
 *   - 죽은 export: export한 함수·값을 다른 파일도, 자기 파일도 안 씀(이름만 남은 옛 방식)
 *   - 테스트만 쓰는 export
 *   - 장부 "지울 것"(scripts/features.json status remove)의 남은 코드
 *
 * 새로 생긴 것은 둘 중 하나로 끝낸다: 같은 커밋에서 지우거나, 지울지 사용자에게 묻는다
 *   node scripts/asks.mjs delete --from <탭> --what "…" --files <파일 또는 파일#이름>
 * 사용자 질문(열림·남김)에 걸린 것은 새 것으로 세지 않는다. 사용자가 "지움"이라 답하면 다음 채팅이 지운다.
 * 바꾼 옛 방식이 아직 불리고 있으면(둘 다 살아 있음) 이 검사로는 안 잡힌다 — 끝내기 훅이 로그 "- 옛 것:" 줄로 묻는다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadGraph, rel, ROOT } from "./scope.mjs";
import { readAsks } from "./asks.mjs";

const BASE = path.join(ROOT, "scripts/leftovers.json");
const args = new Set(process.argv.slice(2));

const NEXT_EXPORTS = new Set(["default", "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "metadata", "viewport", "dynamic", "revalidate", "runtime", "maxDuration", "generateStaticParams", "generateMetadata", "config", "preferredRegion", "fetchCache", "dynamicParams"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

export function findLeftovers() {
  const g = loadGraph();
  const SRC = path.join(ROOT, "src");
  const files = [...g.source.keys()];
  const appDir = path.join(SRC, "app") + path.sep;
  const isEntry = (f) =>
    (f.startsWith(appDir) && /[\\/](page|layout|route|manifest|not-found|error|loading|robots|sitemap)\.tsx?$/.test(f)) ||
    f === path.join(SRC, "middleware.ts");

  // 스크립트가 직접 가져다 쓰는 src 파일도 입구(데이터 만들기·점검이 씀)
  const scriptFiles = walk(path.join(ROOT, "scripts")).filter((f) => /\.(m?js|ts|cjs)$/.test(f));
  const scriptText = scriptFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const scriptEntries = new Set();
  for (const sf of scriptFiles) {
    const text = fs.readFileSync(sf, "utf8");
    for (const m of text.matchAll(/["']((?:\.\.?\/)+src\/[^"']+)["']/g)) {
      const base = path.resolve(path.dirname(sf), m[1]);
      for (const cand of [base, base + ".ts", base + ".tsx", path.join(base, "index.ts")]) if (g.source.has(cand)) scriptEntries.add(cand);
    }
  }
  // 같은 이름 .web.ts 짝(Capacitor 플러그인)은 registerPlugin이 문자열로 부름
  const pluginWeb = (f) => /\.web\.ts$/.test(f) && g.source.has(f.replace(/\.web\.ts$/, ".ts"));

  const reach = (starts) => {
    const seen = new Set();
    const queue = [...starts];
    while (queue.length) {
      const f = queue.pop();
      if (seen.has(f)) continue;
      seen.add(f);
      for (const t of g.imports.get(f)?.keys() ?? []) queue.push(t);
    }
    return seen;
  };
  const fromApp = reach([...files.filter(isEntry), ...scriptEntries]);
  const fromTests = reach(files.filter((f) => g.isTest(f)));

  const items = [];
  for (const f of files) {
    if (g.isTest(f) || fromApp.has(f) || pluginWeb(f) || f.endsWith(".d.ts")) continue;
    items.push(fromTests.has(f) ? { id: `test:${rel(f)}`, kind: "테스트만 쓰는 파일", file: rel(f) } : { id: `file:${rel(f)}`, kind: "아무도 안 쓰는 파일", file: rel(f) });
  }

  // export 이름별로 누가 쓰나
  const usedNames = new Map(); // target → { app:Set, test:Set, star:bool }
  for (const [from, map] of g.imports) {
    for (const [target, names] of map) {
      const u = usedNames.get(target) ?? { app: new Set(), test: new Set(), star: { app: false, test: false } };
      const side = g.isTest(from) ? "test" : "app";
      if (names === "*") u.star[side] = true;
      else for (const n of names) u[side].add(n);
      usedNames.set(target, u);
    }
  }
  for (const f of files) {
    if (g.isTest(f) || !fromApp.has(f)) continue; // 파일째 안 쓰면 위에서 셈
    const text = g.source.get(f);
    const u = usedNames.get(f) ?? { app: new Set(), test: new Set(), star: { app: false, test: false } };
    if (u.star.app) continue;
    const isAppFile = f.startsWith(appDir);
    for (const m of text.matchAll(/^export\s+(?:async\s+)?(?:function\s*\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
      const name = m[1];
      if (isAppFile && NEXT_EXPORTS.has(name)) continue;
      if (u.app.has(name)) continue;
      // 자기 파일 안에서 또 쓰면 export만 필요 없는 것 — 죽은 코드는 아님
      const own = text.match(new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`, "g"))?.length ?? 0;
      if (own > 1) continue;
      // 스크립트가 이름으로 부르면(동적 import 등) 산 것
      if (new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`).test(scriptText)) continue;
      const tested = u.test.has(name) || u.star.test;
      items.push({ id: `${tested ? "testexport" : "export"}:${rel(f)}#${name}`, kind: tested ? "테스트만 쓰는 export" : "죽은 export", file: rel(f), name });
    }
  }

  // 장부 "지울 것"
  const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/features.json"), "utf8"));
  for (const one of ledger.features.filter((x) => x.status === "remove")) {
    for (const c of one.code ?? []) if (fs.existsSync(path.join(ROOT, c))) items.push({ id: `ledger:${one.id}:${c}`, kind: `장부 지울 것 — ${one.name}`, file: c });
  }
  return items;
}

/** 사용자 질문(열림 또는 남김)에 걸린 것 */
function askedOf(item, asks) {
  return asks.find((a) => a.kind === "delete" && (a.status === "open" || a.status === "남김") && (a.files ?? []).some((f) => f === item.file || f === `${item.file}#${item.name}`));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const items = findLeftovers();
  const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, "utf8")) : { known: [] };
  const known = new Set(base.known);
  const asks = readAsks().asks;
  const fresh = items.filter((i) => !known.has(i.id) && !askedOf(i, asks));
  const asked = items.filter((i) => !known.has(i.id) && askedOf(i, asks));
  const old = items.filter((i) => known.has(i.id));
  if (args.has("--write")) {
    const now = new Set(items.map((i) => i.id));
    const init = !fs.existsSync(BASE);
    const next = init ? [...now].sort() : base.known.filter((id) => now.has(id));
    fs.writeFileSync(
      BASE,
      JSON.stringify({ _: "scripts/leftovers.mjs 기준 — 2026-11-09에 이미 있던 남은 코드. 줄어들기만 한다(--write는 지운 것만 뺌). 새로 생긴 것은 지우거나 사용자에게 묻는다(asks.mjs delete).", known: next }, null, 2) + "\n",
    );
    console.log(`기준 ${init ? "처음 씀" : "줄임"}: ${base.known.length} → ${next.length}`);
    process.exit(0);
  }
  if (args.has("--json")) {
    console.log(JSON.stringify({ fresh, asked, old }, null, 2));
    process.exit(0);
  }
  const show = (list) => list.map((i) => `  - ${i.kind}: ${i.file}${i.name ? ` · ${i.name}` : ""}`).join("\n");
  if (fresh.length) {
    console.error(
      `새로 남은 옛 코드 ${fresh.length} — 지우거나, 지울지 사용자에게 묻는다(node scripts/asks.mjs delete --from <탭> --what "…" --files <파일 또는 파일#이름>):\n${show(fresh)}`,
    );
  }
  if (!args.has("--check")) {
    if (asked.length) console.log(`사용자에게 물은 것 ${asked.length}:\n${show(asked)}`);
    console.log(`전부터 남은 것 ${old.length}(기준 scripts/leftovers.json — 지우면 --write로 줄인다)${old.length ? ":\n" + show(old) : ""}`);
  } else if (!fresh.length) console.log(`남은 옛 코드: 새로 생긴 것 0 · 물은 것 ${asked.length} · 전부터 ${old.length}`);
  process.exit(fresh.length && args.has("--check") ? 1 : 0);
}
