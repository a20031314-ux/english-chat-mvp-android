#!/usr/bin/env node
/**
 * 연결 묶음 — 같은 일을 여러 기능이 하는 곳을 맞춰 두기(사용자 2026-11-24 "연결된 기능 중 고도화되거나 변경된 기능이 있다면 맞출 수 있게").
 *
 * 원본은 scripts/features.json "links": 묶음마다
 *   { id, name, what, core: [모두가 같이 쓰는 파일], members: { 기능 id: { files: [그 기능에서 이 일을 하는 파일], symbols?: [이 낱말이 든 줄이 바뀔 때만] } },
 *     differs: { 기능 id: "일부러 다름 — 이유 (사용자 날짜)" } }
 *
 *   node scripts/links.mjs --check          → 묶음이 맞는지(없는 기능 id·파일, differs가 묶음 밖)
 *   node scripts/links.mjs --diff <base>    → base..HEAD에서 한 기능 쪽만 바뀐 묶음 — 나머지 기능마다 hub/chat/log에
 *                                             `- 연결 <묶음 id>: <기능 id> 맞춤|일부러 다름 …|해당 없음 …` 줄이 있어야 통과(exit 1)
 *   node scripts/links.mjs --list           → 묶음·기능·파일 한눈에(예약 작업 "연결 맞춤 점검"이 읽음)
 *   --json                                  → 기계용
 *
 * core만 바뀌면 모두 같이 바뀐 것이라 묻지 않는다. 일부러 다른 기능(differs)은 묻지 않는다.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ledger = JSON.parse(fs.readFileSync(path.join(root, "scripts/features.json"), "utf8"));
const groups = ledger.links ?? [];
const args = process.argv.slice(2);
const json = args.includes("--json");
const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

export function linkProblems() {
  const ids = new Set(ledger.features.map((one) => one.id));
  const problems = [];
  const seen = new Set();
  for (const group of groups) {
    if (!group.id || seen.has(group.id)) problems.push(`연결 묶음 id가 없거나 겹침: ${group.id}`);
    seen.add(group.id);
    const members = Object.keys(group.members ?? {});
    if (members.length < 2) problems.push(`연결 ${group.id}: 기능이 둘 이상이어야`);
    for (const file of group.core ?? []) if (!fs.existsSync(path.join(root, file))) problems.push(`연결 ${group.id}: core ${file}이 없음`);
    for (const [id, member] of Object.entries(group.members ?? {})) {
      if (!ids.has(id)) problems.push(`연결 ${group.id}: 기능 id ${id}가 장부에 없음`);
      if (!member.files?.length) problems.push(`연결 ${group.id}: ${id}의 files가 비었음`);
      for (const file of member.files ?? []) if (!fs.existsSync(path.join(root, file))) problems.push(`연결 ${group.id}: ${id}의 ${file}이 없음`);
    }
    for (const id of Object.keys(group.differs ?? {})) if (!members.includes(id)) problems.push(`연결 ${group.id}: differs ${id}가 묶음 기능이 아님`);
  }
  return problems;
}

/** base..HEAD에서 바뀐 줄(파일별, + 와 - 줄). */
function changedLines(base) {
  const out = new Map();
  let diff = "";
  try {
    diff = git("diff", "-U0", "--no-color", `${base}..HEAD`, "--", "src");
  } catch {
    return out;
  }
  let file = null;
  for (const line of diff.split("\n")) {
    const header = line.match(/^\+\+\+ b\/(.*)$/) ?? line.match(/^--- a\/(.*)$/);
    if (header) {
      if (header[1] !== "/dev/null") file = header[1];
      continue;
    }
    if (file && /^[+-](?![+-])/.test(line)) out.set(file, `${out.get(file) ?? ""}${line}\n`);
  }
  return out;
}

/** base..HEAD에 더해진 hub/chat/log 줄 중 "- 연결" 줄. */
function ackLines(base) {
  try {
    return git("diff", "-U0", "--no-color", `${base}..HEAD`, "--", "hub/chat/log")
      .split("\n")
      .filter((line) => /^\+\s*- 연결[\s:]/.test(line))
      .map((line) => line.slice(1));
  } catch {
    return [];
  }
}

const touches = (member, changed) =>
  (member.files ?? []).some((file) => {
    const lines = changed.get(file);
    if (!lines) return false;
    if (!member.symbols?.length) return true;
    return member.symbols.some((word) => lines.includes(word));
  });

/** 한쪽만 바뀐 묶음과 아직 답하지 않은 기능. */
export function pendingLinks(base) {
  const changed = changedLines(base);
  const acks = ackLines(base);
  const names = new Map(ledger.features.map((one) => [one.id, one.name]));
  const pending = [];
  for (const group of groups) {
    if ((group.core ?? []).some((file) => changed.has(file))) continue;
    const members = Object.entries(group.members ?? {});
    const moved = members.filter(([, member]) => touches(member, changed)).map(([id]) => id);
    if (!moved.length) continue;
    const left = members
      .map(([id]) => id)
      .filter((id) => !moved.includes(id) && !group.differs?.[id])
      .filter((id) => !acks.some((line) => line.includes(group.id) && (line.includes(id) || line.includes(names.get(id) ?? "\u0000"))));
    if (left.length) pending.push({ group: group.id, name: group.name, what: group.what, moved, left, files: Object.fromEntries(left.map((id) => [id, group.members[id].files])) });
  }
  return pending;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (args.includes("--check")) {
    const problems = linkProblems();
    if (problems.length) {
      console.error(`연결 묶음 문제 ${problems.length}:\n  ${problems.join("\n  ")}`);
      process.exit(1);
    }
    console.log(`연결 묶음 ${groups.length}개 — 문제 없음`);
  } else if (args.includes("--diff")) {
    const base = args[args.indexOf("--diff") + 1];
    if (!base || /^0+$/.test(base)) process.exit(0);
    try {
      git("cat-file", "-e", `${base}^{commit}`);
    } catch {
      console.log(`연결 확인: ${base}를 찾을 수 없어 건너뜀`);
      process.exit(0);
    }
    const pending = pendingLinks(base);
    if (json) console.log(JSON.stringify({ pending }));
    else if (pending.length) {
      console.error(
        `연결된 기능 중 한쪽만 바뀜 ${pending.length}묶음 — 나머지 기능을 같이 맞추거나, hub/chat/log 항목에 한 줄씩 남긴다:\n` +
          pending
            .map(
              (p) =>
                `  [${p.group}] ${p.name} — ${p.what}\n    바뀐 쪽: ${p.moved.join(", ")}\n    볼 쪽: ${p.left.map((id) => `${id}(${p.files[id].join(", ")})`).join(" · ")}\n` +
                p.left.map((id) => `    → - 연결 ${p.group}: ${id} 맞춤 | 일부러 다름 — 이유 | 해당 없음 — 이유`).join("\n"),
            )
            .join("\n") +
          "\n  계속 다르게 둘 것(사용자가 정함)은 scripts/features.json links의 differs에 적는다.",
      );
    } else console.log("연결 확인: 한쪽만 바뀐 묶음 없음");
    process.exit(pending.length ? 1 : 0);
  } else if (args.includes("--list")) {
    if (json) console.log(JSON.stringify(groups, null, 2));
    else
      for (const group of groups) {
        console.log(`[${group.id}] ${group.name} — ${group.what}`);
        if (group.core?.length) console.log(`  공용: ${group.core.join(", ")}`);
        for (const [id, member] of Object.entries(group.members)) console.log(`  ${id}: ${member.files.join(", ")}${group.differs?.[id] ? `  (일부러 다름: ${group.differs[id]})` : ""}`);
      }
  } else {
    console.log("node scripts/links.mjs --check | --diff <base> | --list [--json]");
  }
}
