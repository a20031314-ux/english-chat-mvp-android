#!/usr/bin/env node
/**
 * 잊힌 일 찾기: 허브와 저장소에서 오래 손대지 않은 것을 모아 hub/forgotten.md에 쓴다.
 *
 *   node scripts/hub-forgotten.mjs              hub/forgotten.md를 다시 쓴다
 *   node scripts/hub-forgotten.mjs --stdout     파일 대신 화면에
 *   node scripts/hub-forgotten.mjs --date 2026-10-20   기준일을 정해서(테스트용)
 *
 * 찾는 것 (나이는 글에 적힌 날짜 기준 — 얕은 clone에서도 같은 결과):
 *   1. 사용자 결정 대기: hub/reports.md "새 보고" 중 `결정:`이 빈 것, hub/STATE.md "사용자에게 물어볼 것"
 *   2. 안 가져간 넘긴 일: hub/inbox.md에서 3일 넘은 줄 (받는 역할별)
 *   3. 오래 열린 일: hub/roles/*.md "열린 일"에서 7일 넘게 날짜가 그대로인 항목
 *   4. 멈춘 초안: hub/drafts/*.md 중 상태가 설계안·초안·결정 대기이고 7일 넘게 날짜가 그대로인 것
 *   5. 안 나간 앱 빌드: STATE "다음 앱 버전"이 대기 중인 날수
 *   6. 안 합친 브랜치·PR: GitHub REST(gh api)로, main에 없는 커밋이 있고 2일 넘게 멈춘 브랜치와 열린 PR (gh가 없으면 건너뜀)
 *
 * 판단은 하지 않는다 — 진짜 잊힌 것인지, 이미 끝났는데 허브만 안 고친 것인지는 이 목록을 읽는 채팅(예약 작업 "잊힌 일 알림")이 가린다.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HUB = path.join(ROOT, "hub");
const OUT = path.join(HUB, "forgotten.md");
const REPO = "a20031314-ux/english-chat-mvp-android";

const args = process.argv.slice(2);
const dateArg = args.includes("--date") ? args[args.indexOf("--date") + 1] : null;
const today = dateArg ? new Date(dateArg + "T00:00:00+09:00") : new Date();
const todayKst = new Date(today.getTime() + 9 * 3600_000).toISOString().slice(0, 10);

const LIMITS = { inbox: 3, open: 7, draft: 7, branch: 2 };

const read = (rel) => {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
};

/** 글 속 날짜 중 가장 늦은 것(없으면 null). */
function latestDate(text) {
  const dates = [...String(text).matchAll(/20\d\d-[01]\d-[0-3]\d/g)].map((m) => m[0]).sort();
  return dates.at(-1) ?? null;
}
function firstDate(text) {
  return String(text).match(/20\d\d-[01]\d-[0-3]\d/)?.[0] ?? null;
}
function ageDays(date) {
  if (!date) return null;
  return Math.floor((Date.parse(todayKst) - Date.parse(date)) / 86_400_000);
}
/** "## 제목" 아래 내용. */
function section(text, title) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.replace(/^#+\s*/, "").startsWith(title) && /^#{2,3} /.test(l));
  if (start < 0) return "";
  const level = lines[start].match(/^#+/)[0].length;
  const out = [];
  for (const line of lines.slice(start + 1)) {
    const m = line.match(/^(#+) /);
    if (m && m[1].length <= level) break;
    out.push(line);
  }
  return out.join("\n");
}
/** 맨 윗단 "- " 항목(이어지는 들여쓴 줄 포함). */
function bullets(text) {
  const items = [];
  for (const line of text.split("\n")) {
    if (/^- /.test(line)) items.push(line.slice(2));
    else if (items.length && /^\s{2,}\S/.test(line)) items[items.length - 1] += " " + line.trim();
  }
  return items;
}
/** 항목의 이름: 굵은 글씨가 있으면 그것, 아니면 앞부분. */
function titleOf(item, max = 70) {
  const bold = item.match(/\*\*(.+?)\*\*/)?.[1];
  const t = (bold ?? item).replace(/`/g, "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}
const clip = (s, max = 90) => {
  const t = String(s).replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
};

const found = {};

// 1. 사용자 결정 대기
{
  const reports = section(read("hub/reports.md"), "새 보고");
  const waiting = [];
  for (const block of reports.split(/\n(?=### )/)) {
    const head = block.match(/^### (.+)$/m)?.[1];
    if (!head) continue;
    const decision = block.match(/^- 결정:(.*)$/m)?.[1]?.trim() ?? "";
    if (decision && !/^\(?사용자가 적음/.test(decision)) continue;
    waiting.push({ date: firstDate(head), text: head });
  }
  const asks = bullets(section(read("hub/STATE.md"), "사용자에게 물어볼 것")).map((b) => ({
    date: latestDate(b),
    text: titleOf(b.replace(/\*\*/g, ""), 80),
  }));
  found.decisions = { waiting, asks };
}

// 2. 안 가져간 넘긴 일
{
  const lines = read("hub/inbox.md")
    .split("\n")
    .map((l) => l.match(/^- (20\d\d-\d\d-\d\d) (\w+) → (\w+): (.*)$/))
    .filter(Boolean)
    .map((m) => ({ date: m[1], from: m[2], to: m[3], text: m[4], age: ageDays(m[1]) }))
    .filter((l) => l.age > LIMITS.inbox);
  const byTo = {};
  for (const l of lines) (byTo[l.to] ||= []).push(l);
  for (const list of Object.values(byTo)) list.sort((a, b) => b.age - a.age);
  found.inbox = byTo;
}

// 3. 오래 열린 일
{
  const open = [];
  const rolesDir = path.join(HUB, "roles");
  for (const file of fs.readdirSync(rolesDir).filter((f) => f.endsWith(".md")).sort()) {
    const role = file.replace(/\.md$/, "");
    const items = bullets(section(read(`hub/roles/${file}`), "열린 일"));
    for (const item of items) {
      const date = latestDate(item);
      const age = ageDays(date);
      if (age === null || age <= LIMITS.open) continue;
      open.push({ role, date, age, text: titleOf(item), left: /남은 것|남긴 일|대기/.test(item) });
    }
  }
  open.sort((a, b) => b.age - a.age);
  found.open = open;
}

// 4. 멈춘 초안
{
  const drafts = [];
  const dir = path.join(HUB, "drafts");
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const text = read(`hub/drafts/${file}`);
    const status = text.split("\n").slice(0, 15).find((l) => /상태:/.test(l));
    if (!status || !/설계안|초안|결정 대기|사용자 확인/.test(status) || /구현됨|최종|끝/.test(status)) continue;
    const date = latestDate(text.split("\n").slice(0, 40).join("\n"));
    const age = ageDays(date);
    if (age === null || age <= LIMITS.draft) continue;
    drafts.push({ file, date, age, status: clip(status.replace(/^>\s*/, "").replace(/\*\*/g, ""), 60) });
  }
  drafts.sort((a, b) => b.age - a.age);
  found.drafts = drafts;
}

// 5. 안 나간 앱 빌드
{
  const row = read("hub/STATE.md")
    .split("\n")
    .find((l) => l.startsWith("| 다음 앱 버전"));
  found.build = null;
  if (row && /대기/.test(row)) {
    const date = firstDate(row);
    const version = row.match(/\|\s*다음 앱 버전\s*\|\s*([\d.]+)/)?.[1];
    found.build = { version, date, age: ageDays(date) };
  }
  const devOpen = bullets(section(read("hub/roles/dev.md"), "열린 일"));
  found.buildWaiting = devOpen.filter((i) => /앱 다음 빌드|다음 빌드|앱 빌드 필요/.test(i)).length;
}

// 6. 안 합친 브랜치·PR (gh api — 없으면 건너뜀)
{
  const gh = (p) =>
    JSON.parse(
      execFileSync("gh", ["api", p], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 20_000 }),
    );
  found.branches = null;
  try {
    const branches = gh(`repos/${REPO}/branches?per_page=100`).filter((b) => b.name !== "main");
    const prs = gh(`repos/${REPO}/pulls?state=open&per_page=100`);
    const prByHead = new Map(prs.map((p) => [p.head.ref, p]));
    const list = [];
    for (const b of branches) {
      const cmp = gh(`repos/${REPO}/compare/main...${encodeURIComponent(b.name)}`);
      if (!cmp.ahead_by) continue;
      const last = cmp.commits?.at(-1)?.commit?.committer?.date?.slice(0, 10) ?? null;
      const age = ageDays(last);
      const pr = prByHead.get(b.name);
      if (!pr && age !== null && age <= LIMITS.branch) continue;
      list.push({ name: b.name, ahead: cmp.ahead_by, last, age, pr: pr ? `#${pr.number}` : null });
    }
    for (const p of prs) {
      if (!list.some((l) => l.name === p.head.ref)) {
        list.push({ name: p.head.ref, ahead: null, last: p.created_at.slice(0, 10), age: ageDays(p.created_at.slice(0, 10)), pr: `#${p.number}` });
      }
    }
    list.sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
    found.branches = list;
  } catch {
    // gh가 없거나 막혔으면 이 칸은 비운다.
  }
}

// ---- 글로 ----

const lines = [];
const inboxCount = Object.values(found.inbox).reduce((n, l) => n + l.length, 0);
const oldestInbox = Math.max(0, ...Object.values(found.inbox).flat().map((l) => l.age));
const summary = [
  `결정 대기 ${found.decisions.waiting.length + found.decisions.asks.length}`,
  `안 가져간 넘긴 일 ${inboxCount}${inboxCount ? `(가장 오래된 것 ${oldestInbox}일)` : ""}`,
  `${LIMITS.open}일 넘은 열린 일 ${found.open.length}`,
  `멈춘 초안 ${found.drafts.length}`,
  found.build ? `${found.build.version} 빌드 대기 ${found.build.age}일` : null,
  found.branches ? `안 합친 브랜치·PR ${found.branches.length}` : null,
].filter(Boolean);

lines.push("# 잊힌 일", "");
lines.push("> **자동 생성 — 손으로 고치지 않는다.** `node scripts/hub-forgotten.mjs`가 허브 파일과 GitHub에서 오래 손대지 않은 것을 모은다.");
lines.push("> 예약 작업 \"잊힌 일 알림\"이 매일 아침 다시 만들고, 새로 생긴 것·오래된 것을 골라 폰으로 알린다.");
lines.push("> 끝난 일인데 여기 남아 있으면 허브가 안 고쳐진 것이다(받은 역할이 inbox 줄을 지우고 열린 일을 정리).", "");
lines.push(`기준일 ${todayKst} · ${summary.join(" · ")}`, "");

lines.push("## 사용자 결정 대기", "");
if (!found.decisions.waiting.length && !found.decisions.asks.length) lines.push("- 없음");
for (const w of found.decisions.waiting) lines.push(`- 보고함: ${clip(w.text, 110)}${w.date ? ` (${ageDays(w.date)}일)` : ""}`);
for (const a of found.decisions.asks) lines.push(`- 물어볼 것: ${a.text}${a.date ? ` (${a.date})` : ""}`);
lines.push("");

lines.push(`## 안 가져간 넘긴 일 (${LIMITS.inbox}일 넘음, \`hub/inbox.md\`)`, "");
if (!inboxCount) lines.push("- 없음");
for (const [to, list] of Object.entries(found.inbox).sort((a, b) => b[1].length - a[1].length)) {
  lines.push(`- **→ ${to}** ${list.length}줄, 가장 오래된 것 ${list[0].age}일`);
  for (const l of list.slice(0, 5)) lines.push(`  - ${l.date} ${l.from}: ${clip(l.text, 100)}`);
  if (list.length > 5) lines.push(`  - … 그 밖에 ${list.length - 5}줄`);
}
lines.push("");

lines.push(`## 오래 열린 일 (${LIMITS.open}일 넘게 날짜 그대로, \`hub/roles/\`)`, "");
if (!found.open.length) lines.push("- 없음");
for (const o of found.open) lines.push(`- ${o.role} · ${o.age}일 · ${o.text}${o.left ? " — 남은 것 있음" : ""}`);
lines.push("");

lines.push(`## 멈춘 초안 (${LIMITS.draft}일 넘음, \`hub/drafts/\`)`, "");
if (!found.drafts.length) lines.push("- 없음");
for (const d of found.drafts) lines.push(`- \`${d.file}\` · ${d.age}일 · ${d.status}`);
lines.push("");

lines.push("## 앱 빌드", "");
if (found.build) lines.push(`- ${found.build.version}이 저장소에 올라간 지 ${found.build.age}일째 빌드·출시 대기 (STATE "다음 앱 버전")`);
lines.push(`- dev 열린 일 중 "다음 빌드"를 기다리는 항목 ${found.buildWaiting}개`);
lines.push("");

lines.push(`## 안 합친 브랜치·PR (main에 없는 커밋, ${LIMITS.branch}일 넘음)`, "");
if (found.branches === null) lines.push("- 확인 못 함(gh 없음)");
else if (!found.branches.length) lines.push("- 없음");
else for (const b of found.branches) lines.push(`- \`${b.name}\`${b.pr ? ` PR ${b.pr}` : " (PR 없음)"}${b.ahead ? ` · 커밋 ${b.ahead}개` : ""} · 마지막 ${b.last} (${b.age}일)`);

const text = lines.join("\n").trimEnd() + "\n";
if (args.includes("--stdout")) process.stdout.write(text);
else {
  fs.writeFileSync(OUT, text);
  console.log(`hub/forgotten.md · ${summary.join(" · ")}`);
}
