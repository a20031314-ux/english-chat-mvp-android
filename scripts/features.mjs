#!/usr/bin/env node
/**
 * 기능 장부 hub/app/FEATURES.md 만들기·검사(사용자 2026-11-09 "기능겹침, 같은기능 여러 단어, 옛 기능이 잔재함").
 * 원본은 scripts/features.json(기능 하나 = 이름 하나 = 줄 하나), 문구 겹침 기준은 scripts/copy-keys.json.
 *
 *   node scripts/features.mjs          → hub/app/FEATURES.md를 다시 씀
 *   node scripts/features.mjs --check  → 장부가 맞는지만(CI): 아래 중 하나라도 걸리면 실패
 *     - live·old-app 줄의 code 파일이 없음(지웠는데 줄이 남음 — 줄도 지운다)
 *     - copy 키가 copy.ts에 없음, 두 줄이 같은 copy 키·같은 이름
 *     - hub/app/FEATURES.md가 원본과 다름(node scripts/features.mjs로 다시 씀)
 *     - 화면 코드(src/components 아래 .tsx)가 기능 줄 code에도 parts에도 없음(2026-11-24 사용자 "장부 자체를 점검" —
 *       장부 밖 화면 조각은 겹침·옛 것 검사에 안 걸려 옛 카드가 한 달 남았다), parts가 없는 파일·없는 기능 id를 가리킴
 *     - 화면끼리 신호(appIntents.ts) 중 보내는 곳이나 받는 곳이 없는 것
 *     - 연결 묶음(links — scripts/links.mjs)이 없는 기능·파일을 가리킴
 *   remove 줄의 코드가 남아 있는 것은 실패가 아니라 "지울 것" 표로 — 줄어드는 게 목표.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scopeOf } from "./scope.mjs";
import { linkProblems } from "./links.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ledger = JSON.parse(fs.readFileSync(path.join(root, "scripts/features.json"), "utf8"));
const copyKeys = JSON.parse(fs.readFileSync(path.join(root, "scripts/copy-keys.json"), "utf8"));
const structure = JSON.parse(fs.readFileSync(path.join(root, "scripts/structure.json"), "utf8"));
const copyText = fs.readFileSync(path.join(root, "src/lib/copy.ts"), "utf8");
const outFile = path.join(root, "hub/app/FEATURES.md");
const check = process.argv.includes("--check");

const problems = [];
const exists = (file) => fs.existsSync(path.join(root, file));
const koValue = (key) => {
  const koAt = copyText.indexOf("\n  ko: {");
  const enAt = copyText.indexOf("\n  en: {");
  const m = new RegExp(`\\n {4}${key}:\\s*\\n?\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`).exec(copyText.slice(koAt, enAt));
  return m ? m[2] : null;
};
const hasKey = (key) => new RegExp(`\\n {4}${key}\\s*:|\\n {2}${key}\\s*:`).test(copyText);

const seenCopy = new Map();
const seenName = new Map();
const seenId = new Set();
for (const one of ledger.features) {
  if (seenId.has(one.id)) problems.push(`같은 id 두 줄: ${one.id}`);
  seenId.add(one.id);
  if (!structure.areas[one.area]) problems.push(`${one.id}: 영역 ${one.area}이 scripts/structure.json에 없음`);
  if (seenName.has(one.name)) problems.push(`같은 이름 두 줄: "${one.name}" — ${seenName.get(one.name)}, ${one.id}`);
  seenName.set(one.name, one.id);
  if (one.copy) {
    if (!hasKey(one.copy)) problems.push(`${one.id}: 문구 키 ${one.copy}가 copy.ts에 없음`);
    if (seenCopy.has(one.copy)) problems.push(`같은 문구 키를 두 기능이: ${one.copy} — ${seenCopy.get(one.copy)}, ${one.id}`);
    seenCopy.set(one.copy, one.id);
  }
  if (one.status !== "remove") for (const file of one.code ?? []) if (!exists(file)) problems.push(`${one.id}: ${file}이 없음 — 기능을 뺐으면 장부 줄도 지운다`);
  if (!["live", "old-app", "remove"].includes(one.status)) problems.push(`${one.id}: status ${one.status}`);
}

// 화면 코드는 모두 장부에: 기능 줄 code 또는 parts(부품 → 기능 id · "공용: …").
const parts = Object.fromEntries(Object.entries(ledger.parts ?? {}).filter(([file]) => file !== "_"));
const inLines = new Set(ledger.features.flatMap((one) => one.code ?? []));
const screenFiles = [];
const walkScreens = (dir) => {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walkScreens(rel);
    else if (e.name.endsWith(".tsx") && !e.name.includes(".test.")) screenFiles.push(rel);
  }
};
walkScreens("src/components");
for (const file of screenFiles) {
  if (!inLines.has(file) && !parts[file]) problems.push(`${file}: 장부 밖 화면 코드 — 기능 줄 code나 parts(부품: 기능 id 또는 "공용: …")에 넣고, 같은 일을 하는 기능이 이미 있으면 지운다`);
}
for (const [file, owner] of Object.entries(parts)) {
  if (!exists(file)) problems.push(`parts ${file}이 없음 — 지웠으면 parts 줄도 지운다`);
  if (inLines.has(file)) problems.push(`parts ${file}: 기능 줄 code에도 있음 — 한 곳에만`);
  if (!owner.startsWith("공용:") && !seenId.has(owner)) problems.push(`parts ${file}: 기능 id ${owner}가 장부에 없음`);
}

// 화면끼리 신호(src/lib/appIntents.ts)는 보내는 곳과 받는 곳이 둘 다 있어야 — 한쪽만 남으면 옛 화면이 받는 쪽에 그대로 산다
// (2026-11-24: chatDraft·openVideo·sayOwnLine을 받기만 하고 아무도 안 보내 "내 문장 말해보기" 화면이 열 길 없이 남음).
{
  const intents = fs.readFileSync(path.join(root, "src/lib/appIntents.ts"), "utf8");
  const typeBlock = intents.slice(intents.indexOf("export type AppIntents = {"), intents.indexOf("\n};", intents.indexOf("export type AppIntents = {")));
  const names = [...typeBlock.matchAll(/^ {2}([A-Za-z]+):/gm)].map((m) => m[1]);
  const wrappers = new Map([...intents.matchAll(/export function (\w+)\([^)]*\)[^{]*\{\s*sendAppIntent\("(\w+)"/g)].map((m) => [m[2], m[1]]));
  const code = [];
  const walkCode = (dir) => {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walkCode(rel);
      else if (/\.tsx?$/.test(e.name) && !e.name.includes(".test.") && rel !== "src/lib/appIntents.ts") code.push(fs.readFileSync(path.join(root, rel), "utf8"));
    }
  };
  walkCode("src");
  const all = code.join("\n");
  for (const name of names) {
    const sent = all.includes(`sendAppIntent("${name}"`) || (wrappers.has(name) && new RegExp(`\\b${wrappers.get(name)}\\(`).test(all));
    const heard = all.includes(`onAppIntent("${name}"`) || all.includes(`takeAppIntent("${name}"`);
    if (!sent) problems.push(`신호 ${name}: 보내는 곳이 없음 — 받는 쪽 코드와 신호를 지운다(appIntents.ts)`);
    if (!heard) problems.push(`신호 ${name}: 받는 곳이 없음 — 보내는 쪽 코드와 신호를 지운다(appIntents.ts)`);
  }
}

problems.push(...linkProblems());

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const name = (one) => (one.copy ? `${one.name} \`${one.copy}\`${koValue(one.copy) && koValue(one.copy) !== one.name ? ` (화면: ${koValue(one.copy)})` : ""}` : one.name);
const tabNames = JSON.parse(fs.readFileSync(path.join(root, "hub/chat/tabs.json"), "utf8")).tabs;
/** 이 기능 코드가 닿는 탭(scripts/scope.mjs) — 둘 이상이면 고칠 때 그 탭들에 확인 요청(scripts/asks.mjs). */
const usedTabs = (one) => {
  const codeFiles = (one.code ?? []).filter(exists);
  if (!codeFiles.length) return "";
  return scopeOf(codeFiles, one.copy ? [one.copy] : [], { names: false }).usedBy.map((t) => `${t} ${tabNames[t]?.name ?? ""}`.trim()).join(" · ");
};
const files = (one) => (one.code ?? []).map((f) => `\`${f.replace(/^src\//, "")}\``).join(" · ");
const lines = [];
lines.push("# 기능 장부");
lines.push("");
lines.push("> **자동 생성 — 손으로 고치지 않는다.** 원본 `scripts/features.json` → `node scripts/features.mjs`. CI `languages`가 `--check`로 맞는지 본다.");
lines.push("> 기능 하나 = 이름 하나 = 줄 하나. **새 버튼·방식·탭을 만들기 전에 여기서 같은 일을 하는 줄을 찾는다** — 있으면 그 이름·문구 키를 그대로 쓰고, 없을 때만 줄을 더한다(RULES \"하나의 이름·지금만 적기\").");
lines.push("> **쓰는 탭**은 코드에서 자동(`node scripts/scope.mjs <기능 id>`로 파일까지) — 둘 이상인 기능을 고치면 끝내기 훅이 그 탭들에 확인 요청을 만들게 한다(`hub/chat/ASKS.md`).");
lines.push("> 기능을 빼면 줄을 지우고 코드·문구 14개 언어·사용법·문서를 같은 커밋에서 지운다. 옛 앱이 쓰는 서버만 \"옛 앱 전용\"으로 남기고 지울 조건을 적는다.");
lines.push("");
const live = ledger.features.filter((one) => one.status === "live");
const byArea = new Map();
for (const one of live) byArea.set(one.area, [...(byArea.get(one.area) ?? []), one]);
lines.push(`## 지금 앱 (${live.length})`);
lines.push("");
for (const [area, list] of byArea) {
  lines.push(`### ${structure.areas[area]}`);
  lines.push("");
  lines.push("| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |");
  lines.push("|---|---|---|---|---|");
  for (const one of list) lines.push(`| ${cell(name(one))} | ${cell(one.does)}${one.note ? ` — ${cell(one.note)}` : ""} | ${usedTabs(one)} | ${files(one)} | ${cell((one.replaces ?? []).join(" · "))} |`);
  lines.push("");
}
const old = ledger.features.filter((one) => one.status === "old-app");
lines.push(`## 옛 앱 전용 서버 (${old.length}) — 새 앱 화면엔 없음`);
lines.push("");
lines.push("| 무엇 | 쓰는 앱 | 코드 | 지울 때 |");
lines.push("|---|---|---|---|");
for (const one of old) lines.push(`| ${cell(one.name)} | ${cell(one.does)} | ${files(one)} | ${cell(one.until)} |`);
lines.push("");
const remove = ledger.features.filter((one) => one.status === "remove");
lines.push(`## 지울 것 (${remove.length}) — 화면은 없어졌는데 코드가 남음`);
lines.push("");
lines.push("| 무엇 | 왜 남았나 | 남은 코드 |");
lines.push("|---|---|---|");
for (const one of remove) {
  const left = (one.code ?? []).filter(exists);
  lines.push(`| ${cell(one.name)} | ${cell(one.does)}${one.note ? ` — ${cell(one.note)}` : ""} | ${left.length ? left.map((f) => `\`${f.replace(/^src\//, "")}\``).join(" · ") : "없음 — 줄을 지운다"} |`);
}
lines.push("");
const linkGroups = ledger.links ?? [];
lines.push(`## 연결 묶음 (${linkGroups.length}) — 같은 일을 여러 기능이 함`);
lines.push("");
lines.push("> 한 기능 쪽만 바뀌면(고도화·변경) 나머지 기능을 같이 맞추거나 hub/chat/log에 `- 연결 <묶음>: <기능 id> 맞춤|일부러 다름 — 이유|해당 없음 — 이유`(`node scripts/links.mjs --diff <시작 커밋>` — 끝내기 훅·CI). 계속 다르게 둘 것은 differs에. 주 1회 예약 작업 \"연결 맞춤 점검\"이 묶음마다 두 코드를 비교해 한쪽에만 있는 개선을 `hub/work/reports.md`에.");
lines.push("");
lines.push("| 묶음 | 맞출 것 | 기능 · 그 기능의 파일 | 일부러 다름 |");
lines.push("|---|---|---|---|");
const featureName = (id) => ledger.features.find((one) => one.id === id)?.name ?? id;
for (const group of linkGroups) {
  const members = Object.entries(group.members).map(([id, m]) => `${featureName(id)} ${m.files.map((f) => `\`${f.replace(/^src\//, "")}\``).join("·")}`).join(" / ");
  const core = (group.core ?? []).length ? ` / 공용 ${group.core.map((f) => `\`${f.replace(/^src\//, "")}\``).join("·")}` : "";
  const differs = Object.entries(group.differs ?? {}).map(([id, why]) => `${featureName(id)}: ${why}`).join(" · ");
  lines.push(`| ${cell(group.name)} \`${group.id}\` | ${cell(group.what)} | ${cell(members + core)} | ${cell(differs)} |`);
}
lines.push("");
const partList = Object.entries(parts);
lines.push(`## 부품 (${partList.length}) — 기능 줄에 딸린 화면 코드`);
lines.push("");
lines.push("> 화면 코드는 모두 기능 줄 code나 여기에 있다(\`--check\`). 기능을 지우면 그 부품도 같이 지운다.");
lines.push("");
const byOwner = new Map();
for (const [file, owner] of partList) byOwner.set(owner, [...(byOwner.get(owner) ?? []), file]);
const ownerName = (owner) => (owner.startsWith("공용:") ? owner : `${ledger.features.find((one) => one.id === owner)?.name ?? owner}`);
for (const [owner, list] of [...byOwner].sort(([a], [b]) => Number(a.startsWith("공용:")) - Number(b.startsWith("공용:")) || a.localeCompare(b))) {
  lines.push(`- ${cell(ownerName(owner))} — ${list.map((f) => `\`${f.replace(/^src\/components\//, "")}\``).join(" · ")}`);
}
lines.push("");
const dups = copyKeys.known?.duplicate ?? [];
lines.push(`## 이름 정리할 것 — 같은 말을 쓰는 다른 문구 키 (${dups.length})`);
lines.push("");
lines.push("> `node scripts/check-copy-keys.mjs`가 찾는다. 같은 기능이면 한 키로 합치고, 다른 기능이면 이름을 바꾼다. 고치면 `--write`로 기준을 줄인다. 새로 생기면 CI가 실패한다.");
lines.push("");
for (const id of dups) {
  const keys = id.split("+");
  lines.push(`- "${cell(koValue(keys[0]) ?? "")}" — ${keys.map((k) => `\`${k}\``).join(", ")}`);
}
lines.push("");
const text = lines.join("\n");

if (check) {
  const current = exists("hub/app/FEATURES.md") ? fs.readFileSync(outFile, "utf8") : "";
  if (current !== text) problems.push("hub/app/FEATURES.md가 원본과 다름 — node scripts/features.mjs");
  if (problems.length) {
    console.error(`기능 장부 문제 ${problems.length}:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`기능 장부: 지금 앱 ${live.length} · 옛 앱 전용 ${old.length} · 지울 것 ${remove.length} · 이름 정리 ${dups.length}`);
} else {
  fs.writeFileSync(outFile, text);
  if (problems.length) console.error(`기능 장부 문제 ${problems.length}:\n  ${problems.join("\n  ")}`);
  console.log(`hub/app/FEATURES.md 다시 씀 — 지금 앱 ${live.length} · 옛 앱 전용 ${old.length} · 지울 것 ${remove.length}`);
}
