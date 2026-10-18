#!/usr/bin/env node
// 화면 규칙 검사 (hub/DESIGN.md). 토큰 대신 직접 쓴 값이 기준선보다 늘면 실패한다.
// 이미 있는 것은 그대로 두고(래칫), 줄어들면 기준선을 낮춘다.
//
//   npm run check:design            검사
//   npm run check:design -- --files 항목별로 어느 파일에 몰려 있는지
//   npm run check:design -- --update 줄어든 만큼 기준선을 낮춤(늘어난 건 못 올림)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const BASELINE = join(ROOT, "scripts/design-baseline.json");
const DIRS = ["src/components", "src/app"];

const PREFIX = "(?:bg|text|border|ring|outline|divide|fill|stroke|from|via|to|shadow|accent|caret|decoration)";
const RULES = [
  {
    key: "arbitraryFontSize",
    label: "글자 크기를 직접 씀 (text-[12px] 등) → text-meta/caption/note/body/chat/title/heading",
    re: /\btext-\[[0-9.]+(?:px|rem|em)\]/g,
  },
  {
    key: "rawHex",
    label: "색을 hex로 직접 씀 (#121212 등) → bg-surface, text-platinum 등 토큰",
    re: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b/g,
  },
  {
    key: "neutralGray",
    label: "회색은 slate 하나로 — neutral/gray/zinc/stone 새로 쓰지 않음",
    re: new RegExp(`\\b${PREFIX}-(?:neutral|gray|zinc|stone)-\\d+`, "g"),
  },
  {
    key: "offPaletteAccent",
    label: "의미색 밖의 색 (blue·orange·lime·fuchsia·cyan·pink·purple·indigo·teal·green·red·yellow) → good/warn/bad/info",
    re: new RegExp(`\\b${PREFIX}-(?:blue|orange|lime|fuchsia|cyan|pink|purple|indigo|teal|green|red|yellow)-\\d+`, "g"),
  },
  {
    key: "offScaleRadius",
    label: "둥글기는 lg/xl/2xl/full — rounded-md, rounded-sm, rounded, rounded-[..] 새로 쓰지 않음",
    re: /\brounded(?:-(?:md|sm|none)|-\[[^\]]+\])?(?=["'`\s}])/g,
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const files = DIRS.flatMap((d) => walk(join(ROOT, d)));
const totals = Object.fromEntries(RULES.map((r) => [r.key, 0]));
const byFile = Object.fromEntries(RULES.map((r) => [r.key, {}]));
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const r of RULES) {
    const n = (src.match(r.re) || []).length;
    if (!n) continue;
    totals[r.key] += n;
    byFile[r.key][relative(ROOT, file)] = n;
  }
}

const args = process.argv.slice(2);
let baseline = {};
try {
  baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  baseline = {};
}

if (args.includes("--files")) {
  for (const r of RULES) {
    console.log(`\n${r.key} (${totals[r.key]}) — ${r.label}`);
    for (const [f, n] of Object.entries(byFile[r.key]).sort((a, b) => b[1] - a[1]).slice(0, 10)) console.log(`  ${String(n).padStart(4)}  ${f}`);
  }
  process.exit(0);
}

const first = Object.keys(baseline).length === 0;
let failed = false;
let lowered = false;
const next = { ...baseline };
for (const r of RULES) {
  const now = totals[r.key];
  const was = baseline[r.key];
  if (was === undefined) {
    next[r.key] = now;
    console.log(`  기준선 새로: ${r.key} = ${now}`);
  } else if (now > was) {
    failed = true;
    console.log(`✗ ${r.key}: ${was} → ${now} (+${now - was})  ${r.label}`);
  } else if (now < was) {
    lowered = true;
    next[r.key] = now;
    console.log(`↓ ${r.key}: ${was} → ${now}  줄었음`);
  } else {
    console.log(`✓ ${r.key}: ${now}`);
  }
}

if (failed) {
  console.log("\n화면 규칙: 직접 쓴 값이 늘었습니다. hub/DESIGN.md의 토큰을 쓰세요.");
  console.log("어느 파일인지: npm run check:design -- --files");
  console.log("새 값이 정말 필요하면 src/app/globals.css @theme에 토큰을 더하고 hub/DESIGN.md 표에 적으세요.");
  process.exit(1);
}
if (first || args.includes("--update")) {
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  console.log(`\n기준선 저장: ${relative(ROOT, BASELINE)}`);
} else if (lowered) {
  console.log("\n줄었습니다. `npm run check:design -- --update`로 기준선을 낮춰 같은 커밋에 넣으세요.");
}
