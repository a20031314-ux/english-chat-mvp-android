/**
 * 데이터 지도 — 서버가 저장소(Upstash KV)에 무엇을 얼마나 오래 두는지를 코드에서 다시 뽑아 hub/data-map.md로 쓴다.
 *
 * 손으로 쓰는 구조 문서는 며칠 안에 코드와 어긋나고, 어긋난 지도를 믿고 지우면 실제 데이터가 사라진다.
 * 그래서 키 이름은 코드(src/lib/server, src/app/api)의 문자열에서, 보관 기간은 저장 호출의 마지막 인자에서 뽑고,
 * 사람이 쓰는 것은 키 묶음마다의 설명(scripts/data-map.json: 기능·누구 것·계정 지울 때)뿐이다.
 *
 *   node scripts/data-map.mjs          (hub/data-map.md 쓰기)
 *   node scripts/data-map.mjs --check  (설명 없는 새 키·코드에서 사라진 키가 있거나 파일이 최신이 아니면 실패)
 *   node scripts/data-map.mjs --check --notes-only  (CI: 설명만 — 표는 main push 때 .github/workflows/data-map.yml이 다시 씀)
 *
 * 정리(scripts/data-sweep.mjs, KV 키 필요)는 이 지도로 운영 키를 나눈다: 지도에 있음 / 점검 데이터 / 코드에 없음.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTES_FILE = path.join(ROOT, "scripts/data-map.json");
const OUT = path.join(ROOT, "hub/data-map.md");
const WRITES = ["kvSetJson", "kvSetJsonIfAbsent", "kvIncrBy", "kvListPush", "kvZAdd"];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.ts$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
  });
}

export function sourceFiles() {
  return [...walk(path.join(ROOT, "src/lib/server")), ...walk(path.join(ROOT, "src/app/api"))].sort();
}

/** 키 문자열 → 묶음 이름: 앞 두 칸(`ledger:v1`), 두 번째 칸이 바로 ${…}면 첫 칸(`curriculum:`). */
export function groupOf(literal) {
  const head = literal.split("${")[0];
  const segs = head.split(":");
  if (segs.length >= 3 || (segs.length === 2 && segs[1] !== "")) return `${segs[0]}:${segs[1]}`;
  return `${segs[0]}:`;
}

const KEYLIKE = /^[a-z][a-zA-Z0-9_.-]*:/;

/** 파일 안 키처럼 보이는 문자열들(따옴표·백틱). */
function literals(text) {
  const out = [];
  for (const m of text.matchAll(/`([^`\n]*)`|"([^"\n]*)"/g)) {
    const lit = m[1] ?? m[2];
    if (!KEYLIKE.test(lit) || /\s/.test(lit.split("${")[0])) continue;
    out.push({ lit, index: m.index });
  }
  return out;
}

/** `(` 다음부터 짝 맞는 `)`까지를 맨 위 쉼표로 나눈 인자들. */
function args(text, open) {
  let depth = 0;
  let start = open + 1;
  const out = [];
  let quote = null;
  for (let i = open; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === quote && text[i - 1] !== "\\") quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if ("([{".includes(c)) depth += 1;
    else if (")]}".includes(c)) {
      depth -= 1;
      if (depth === 0) { out.push(text.slice(start, i).trim()); return out; }
    } else if (c === "," && depth === 1) { out.push(text.slice(start, i).trim()); start = i + 1; }
  }
  return out;
}

/** 모든 파일의 `const NAME = 숫자식` — 보관 기간 상수를 읽으려고. */
function constants(files) {
  const table = {};
  for (const f of files) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*(?::\s*number\s*)?=\s*([0-9_*\s+()]+);/g)) {
      try {
        table[m[1]] = Function(`return (${m[2].replace(/_/g, "")})`)();
      } catch {
        // 숫자식이 아니면 건너뜀.
      }
    }
  }
  return table;
}

function ttlLabel(seconds) {
  if (seconds === null) return "영구";
  if (seconds === undefined) return "?";
  if (seconds % 86400 === 0) return `${seconds / 86400}일`;
  if (seconds % 3600 === 0) return `${seconds / 3600}시간`;
  if (seconds % 60 === 0) return `${seconds / 60}분`;
  return `${seconds}초`;
}

/** 코드에서 뽑은 키 묶음: { group: { files:Set, examples:Set, ttls:Set } } */
export function scan() {
  const files = sourceFiles();
  const globalConsts = constants(walk(path.join(ROOT, "src/lib")));
  const groups = {};
  const touch = (g) => (groups[g] ??= { files: new Set(), examples: new Set(), ttls: new Set(), written: false });
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    const consts = { ...globalConsts, ...constants([f]) }; // 같은 이름(TTL_SECONDS 등)은 그 파일 것이 먼저
    const rel = path.relative(ROOT, f).replace(/^src\/lib\/server\//, "").replace(/^src\/app\/api\//, "api/");
    // 키 만드는 함수·상수: function fooKey(…) { return `…` } / const FOO = (…) => `…` / const FOO = "…"
    const builders = {};
    for (const m of text.matchAll(/function\s+(\w+)\s*\([^)]*\)[^{]*\{\s*return\s+(`[^`]*`|"[^"]*")/g)) builders[m[1]] = m[2].slice(1, -1);
    for (const m of text.matchAll(/const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*(?::\s*\w+\s*)?=>\s*)?(`[^`]*`|"[^"]*")/g)) builders[m[1]] = m[2].slice(1, -1);
    for (const { lit } of literals(text)) {
      const g = touch(groupOf(lit));
      g.files.add(rel);
      g.examples.add(lit.replace(/\$\{[^}]*\}/g, "…"));
    }
    for (const name of WRITES) {
      for (const m of text.matchAll(new RegExp(`\\b${name}\\s*\\(`, "g"))) {
        const a = args(text, m.index + m[0].length - 1);
        if (!a.length) continue;
        let keyText = a[0];
        const call = keyText.match(/^(\w+)\s*\(/);
        const ident = keyText.match(/^(\w+)$/);
        if (call && builders[call[1]] !== undefined) keyText = builders[call[1]];
        else if (ident && builders[ident[1]] !== undefined) keyText = builders[ident[1]];
        else if (/^[`"]/.test(keyText)) keyText = keyText.slice(1, -1);
        else continue;
        if (!KEYLIKE.test(keyText)) continue;
        const g = touch(groupOf(keyText));
        g.written = true;
        g.files.add(rel);
        const ttlArg = name === "kvSetJson" || name === "kvSetJsonIfAbsent" || name === "kvIncrBy" ? a[2] : name === "kvListPush" ? a[2] : undefined;
        if (name === "kvZAdd") g.ttls.add("영구");
        else if (ttlArg === undefined || ttlArg === "") g.ttls.add("영구");
        else {
          let seconds;
          try {
            seconds = Function(...Object.keys(consts), `return (${ttlArg.replace(/_(?=\d)/g, "")})`)(...Object.values(consts));
          } catch {
            seconds = undefined;
          }
          g.ttls.add(typeof seconds === "number" && Number.isFinite(seconds) ? ttlLabel(seconds) : `계산(${ttlArg.slice(0, 30)})`);
        }
      }
    }
  }
  return groups;
}

export function loadNotes() {
  return JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
}

/** 지도와 설명이 맞는지: 설명 없는 키(missing), 코드에서 사라진 설명(stale). 키가 아닌 문자열은 notes.ignore. */
export function compare(groups = scan(), notes = loadNotes()) {
  const ignore = new Set(notes.ignore ?? []);
  const keys = Object.keys(groups).filter((g) => !ignore.has(g));
  const missing = keys.filter((g) => !notes.groups[g]);
  const stale = Object.keys(notes.groups).filter((g) => !groups[g]);
  return { keys, missing, stale };
}

const SCOPE = { user: "학습자 한 명", account: "계정", shared: "모두 함께", room: "방·대화", system: "운영", test: "점검" };

export function render(groups = scan(), notes = loadNotes()) {
  const { keys, missing } = compare(groups, notes);
  const lines = [
    "# 데이터 지도 (자동 생성)",
    "",
    "> **손으로 고치지 마세요.** `node scripts/data-map.mjs`가 서버 코드(`src/lib/server`·`src/app/api`)의 키 문자열과 저장 호출에서 만들고,",
    "> 키 묶음마다의 설명만 `scripts/data-map.json`에서 가져옵니다. 설명 없는 새 키가 생기거나 코드에서 키가 사라지면 CI(`data-map`)가 실패합니다.",
    "> 운영 저장소를 이 지도와 맞춰 보고 정리하는 것은 `scripts/data-sweep.mjs`(KV 키 필요, PC). 점검 데이터는 점검이 끝날 때 저절로 지워집니다(`/api/simcheck/forget`).",
    "",
  ];
  if (missing.length) lines.push("## 설명 없음", "", ...missing.map((g) => `- \`${g}\``), "");
  const byFeature = {};
  for (const g of keys) {
    const n = notes.groups[g] ?? { feature: "(설명 없음)" };
    (byFeature[n.feature] ??= []).push(g);
  }
  lines.push("## 저장하는 것", "", "| 기능 | 키 | 누구 것 | 보관 | 계정 지울 때 | 무엇 | 코드 |", "|---|---|---|---|---|---|---|");
  for (const feature of Object.keys(byFeature).sort((a, b) => a.localeCompare(b, "ko"))) {
    for (const g of byFeature[feature].sort()) {
      const n = notes.groups[g] ?? {};
      const info = groups[g];
      const ttl = info.ttls.size ? [...info.ttls].sort().join(" · ") : info.written ? "?" : "?(코드에서 못 읽음)";
      const files = [...info.files].sort();
      lines.push(`| ${feature} | \`${g}\` | ${SCOPE[n.scope] ?? n.scope ?? "?"} | ${ttl} | ${n.onAccountDelete ?? "—"} | ${n.what ?? ""} | ${files.slice(0, 3).map((f) => `\`${f}\``).join(" ")}${files.length > 3 ? ` 외 ${files.length - 3}` : ""} |`);
    }
  }
  lines.push(
    "",
    "## 읽는 법",
    "",
    "- **누구 것**: 학습자 한 명(익명 id `rc:…` 또는 계정의 학습 id) · 계정 · 모두 함께(언어별 공유 통계) · 방·대화 · 운영 · 점검.",
    "- **보관**: 저장 호출에 적힌 만료. `영구`는 만료 없이 남는다는 뜻 — 지울 길(계정 삭제·정리)이 있는지 확인할 곳.",
    "- **계정 지울 때**: 지움(바로) / 지움(주 1회 정리 — `/api/account/purge` 예약 실행이 학습 id의 키를 훑어 지움) / 남음(기한 뒤 만료) / 해당 없음.",
    "- 점검 데이터는 키 이름에 `simcheck-`가 든 것(가상 사용자). 실제 사용자 id에는 이 글자가 없다.",
    "",
  );
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const groups = scan();
  const notes = loadNotes();
  const text = render(groups, notes);
  if (process.argv.includes("--list")) {
    for (const [g, v] of Object.entries(groups).sort()) console.log(g, [...v.ttls].join(","), [...v.files].slice(0, 2).join(" "));
  } else if (process.argv.includes("--check")) {
    const { missing, stale } = compare(groups, notes);
    let current = "";
    try { current = fs.readFileSync(OUT, "utf8"); } catch { /* 없으면 최신 아님 */ }
    if (missing.length) console.error(`설명 없는 키 묶음 ${missing.length}개 — scripts/data-map.json에 더하세요: ${missing.join(", ")}`);
    if (stale.length) console.error(`코드에서 사라진 키 묶음 ${stale.length}개 — scripts/data-map.json에서 빼고, 운영 저장소에 남은 것은 data-sweep.mjs로: ${stale.join(", ")}`);
    const notesOnly = process.argv.includes("--notes-only"); // CI: 설명만 검사, 표는 main에서 저절로 다시 씀
    const outdated = !notesOnly && current !== text;
    if (outdated) console.error("hub/data-map.md가 최신이 아니에요. node scripts/data-map.mjs 로 다시 만드세요.");
    if (missing.length || stale.length || outdated) process.exitCode = 1;
    else console.log(`데이터 지도 최신 (키 묶음 ${compare(groups, notes).keys.length}개)`);
  } else {
    fs.writeFileSync(OUT, text);
    console.log(`hub/data-map.md 갱신 (키 묶음 ${compare(groups, notes).keys.length}개)`);
  }
}
