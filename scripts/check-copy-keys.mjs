#!/usr/bin/env node
/**
 * 문구 장부 검사(사용자 2026-11-09 "기능겹침, 같은기능 여러 단어, 옛 기능이 잔재함" → 규칙·장부·검사):
 *
 *  1. 안 쓰는 문구 키 — copy.ts의 ko 키 중 앱·서버·스크립트 어디에도 이름이 안 나오는 것(옛 화면을 지우고 남은 문구).
 *  2. 같은 말 다른 키 — ko 문구가 글자까지 같은데 키가 다른 것(같은 기능을 두 이름으로 부르거나, 다른 기능에 같은 이름).
 *     일부러 같은 말이면(같은 버튼이 두 화면에 — "닫기") scripts/copy-keys.json "same"에 그 묶음을 적는다.
 *
 * 쓰는 법: node scripts/check-copy-keys.mjs          → 둘 다 검사, 새로 생긴 것이 있으면 실패(exit 1)
 *          node scripts/check-copy-keys.mjs --list   → 지금 걸리는 것 전부
 *          node scripts/check-copy-keys.mjs --write  → 지금 걸리는 것을 기준(scripts/copy-keys.json "known")으로 적음
 * 기준에 이미 적힌 것은 실패로 안 치고 숫자만 보인다 — 기준은 줄어들기만 해야 한다(지우거나 합치면 --write로 줄임).
 * 동적으로 만드는 키(`ui[\`plan${x}\`]`)는 이름 앞부분을 scripts/copy-keys.json "dynamic"에 적는다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const copyFile = path.join(root, "src/lib/copy.ts");
const ledgerFile = path.join(root, "scripts/copy-keys.json");
const args = new Set(process.argv.slice(2));

const text = fs.readFileSync(copyFile, "utf8");

/** copy = { ko: { … }, en: …} 에서 ko 블록의 키와 글(한 줄짜리 문자열만 — 여러 줄·함수는 키만). */
function koEntries() {
  const start = text.indexOf("export const copy = {");
  const koAt = text.indexOf("\n  ko: {", start);
  if (start < 0 || koAt < 0) throw new Error("copy.ts에서 ko 블록을 못 찾음");
  const out = new Map();
  let depth = 0;
  let i = text.indexOf("{", koAt);
  const end = (() => {
    for (let j = i; j < text.length; j++) {
      const c = text[j];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return j;
      }
    }
    return text.length;
  })();
  const body = text.slice(i + 1, end);
  // 키는 들여쓰기 네 칸 줄의 머리(중첩 객체 안은 더 깊음).
  const lines = body.split("\n");
  for (let n = 0; n < lines.length; n++) {
    const m = /^ {4}([A-Za-z_$][\w$]*)\s*:\s*(.*)$/.exec(lines[n]);
    if (!m) continue;
    const [, key, rest] = m;
    let value = null;
    const str = /^(["'`])((?:\\.|(?!\1).)*)\1,?\s*$/.exec(rest.trim());
    if (str) value = str[2];
    else if (rest.trim() === "" && lines[n + 1]) {
      const next = /^\s*(["'`])((?:\\.|(?!\1).)*)\1,?\s*$/.exec(lines[n + 1]);
      if (next) value = next[2];
    }
    out.set(key, value);
  }
  // ...generatedXOverlay 펼침으로 들어간 키도 ko에 있음 — 그 객체들의 키를 더한다(글은 영어라 같은 말 검사에서 뺌).
  for (const m of body.matchAll(/\.\.\.(generated\w+Overlay)/g)) {
    const at = text.indexOf(`const ${m[1]} = {`);
    if (at < 0) continue;
    const close = text.indexOf("\n} as const;", at);
    for (const k of text.slice(at, close).matchAll(/^ {2}([A-Za-z_$][\w$]*)\s*:/gm)) if (!out.has(k[1])) out.set(k[1], null);
  }
  return out;
}

function readLedger() {
  try {
    return JSON.parse(fs.readFileSync(ledgerFile, "utf8"));
  } catch {
    return { dynamic: [], same: [], known: { unused: [], duplicate: [] } };
  }
}

/** 앱·서버·스크립트 글 전체(copy.ts·로캘 json 빼고) — 키 이름이 낱말로 나오면 쓰는 것. */
function corpus() {
  const parts = [];
  const skip = new Set([copyFile, path.join(root, "src/lib/locales/overlays.json"), path.join(root, "src/lib/locales/generated.json")]);
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|mjs|js|cjs|json)$/.test(e.name) && !skip.has(p) && fs.statSync(p).size < 4_000_000) parts.push(fs.readFileSync(p, "utf8"));
    }
  };
  walk(path.join(root, "src"));
  walk(path.join(root, "scripts"));
  return parts.join("\n");
}

const entries = koEntries();
const ledger = readLedger();
const all = corpus();
const words = new Set(all.match(/[A-Za-z_$][\w$]*/g));
const dynamic = ledger.dynamic ?? [];
const unused = [...entries.keys()].filter((key) => !words.has(key) && !dynamic.some((prefix) => key.startsWith(prefix))).sort();

const byText = new Map();
for (const [key, value] of entries) {
  if (!value || value.length < 2) continue;
  const list = byText.get(value) ?? [];
  list.push(key);
  byText.set(value, list);
}
const allowed = (ledger.same ?? []).map((group) => new Set(group));
const duplicate = [...byText.entries()]
  .filter(([, keys]) => keys.length > 1)
  .map(([value, keys]) => ({ text: value, keys: keys.sort() }))
  .filter((one) => !allowed.some((group) => one.keys.every((key) => group.has(key))))
  .sort((a, b) => a.text.localeCompare(b.text));
const dupId = (one) => one.keys.join("+");

if (args.has("--write")) {
  ledger.known = { unused, duplicate: duplicate.map(dupId) };
  fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`기준 적음: 안 쓰는 키 ${unused.length} · 같은 말 다른 키 ${duplicate.length}`);
  process.exit(0);
}
if (args.has("--list")) {
  console.log(`안 쓰는 키 ${unused.length}:\n  ${unused.join("\n  ")}`);
  console.log(`\n같은 말 다른 키 ${duplicate.length}:`);
  for (const one of duplicate) console.log(`  "${one.text}" — ${one.keys.join(", ")}`);
  process.exit(0);
}
const knownUnused = new Set(ledger.known?.unused ?? []);
const knownDup = new Set(ledger.known?.duplicate ?? []);
const newUnused = unused.filter((key) => !knownUnused.has(key));
const newDup = duplicate.filter((one) => !knownDup.has(dupId(one)));
const gone = [...knownUnused].filter((key) => !unused.includes(key)).length + [...knownDup].filter((id) => !duplicate.some((one) => dupId(one) === id)).length;
console.log(`문구 장부: 안 쓰는 키 ${unused.length}(기준 ${knownUnused.size}) · 같은 말 다른 키 ${duplicate.length}(기준 ${knownDup.size})`);
if (gone) console.log(`  기준에서 정리된 것 ${gone} — node scripts/check-copy-keys.mjs --write 로 기준을 줄이세요.`);
if (newUnused.length || newDup.length) {
  if (newUnused.length) console.error(`\n새로 안 쓰게 된 문구 키 ${newUnused.length} — 화면을 지웠으면 문구도 지운다(copy.ts ko·en·es + overlays.json):\n  ${newUnused.join("\n  ")}`);
  if (newDup.length) {
    console.error(`\n새 같은 말 다른 키 ${newDup.length} — 같은 기능이면 한 키로 합치고, 다른 기능이면 이름을 바꾼다. 일부러 같으면 scripts/copy-keys.json "same"에:`);
    for (const one of newDup) console.error(`  "${one.text}" — ${one.keys.join(", ")}`);
  }
  process.exit(1);
}
