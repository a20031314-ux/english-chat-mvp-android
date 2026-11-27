#!/usr/bin/env node
/**
 * Play에 실제로 올라간 버전을 허브에 적는다(사용자 2026-11-28 "2.81이 올라가 있는데 허브엔 2.79처럼 — 되풀이").
 *
 * 사람이 Play에 올린 것을 채팅이 기억에 기대 적으면 늘 늦거나 틀린다. 그래서 예약 워크플로
 * `.github/workflows/play-versions.yml`이 매일 Play API(읽기만, fastlane track_versions)로 트랙마다
 * versionCode·출시 이름을 받아 이 스크립트에 넘긴다.
 *
 *   node scripts/play-versions.mjs <play-versions.json>
 *
 * 하는 일:
 * - `hub/STATE.md` 버전 표 "Play에 올라간 앱" 줄을 production 트랙 값으로 바꾼다(Play 확인 날짜와 함께).
 * - `hub/app/play-versions.md`에 트랙마다 값·저장소 versionCode와 어긋남을 적는다.
 * 값이 그대로면 파일을 건드리지 않는다(날짜만 바뀐 커밋을 만들지 않으려고, 확인 시각은 워크플로 기록에).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE = path.join(ROOT, "hub/STATE.md");
const PAGE = path.join(ROOT, "hub/app/play-versions.md");
const GRADLE = path.join(ROOT, "android/app/build.gradle");
const TRACKS = ["production", "beta", "alpha", "internal"];
const TRACK_NAME = { production: "프로덕션", beta: "공개 테스트", alpha: "비공개 테스트", internal: "내부 테스트" };

/** 출시 이름("95 (2.81)", "2.81" 등)에서 버전 이름을 꺼낸다. 없으면 "". */
export function versionNameOf(name) {
  const hit = String(name ?? "").match(/\d+\.\d+(?:\.\d+)?/);
  return hit ? hit[0] : "";
}

/** 트랙 하나 = 가장 높은 versionCode와 그 이름. 비었으면 null. */
export function topOf(track) {
  const codes = (track?.codes ?? []).map(Number).filter((code) => Number.isFinite(code) && code > 0);
  if (!codes.length) return null;
  const code = Math.max(...codes);
  const names = track?.names ?? [];
  const name = names.map(versionNameOf).find(Boolean) ?? "";
  return { code, name };
}

/** STATE "Play에 올라간 앱" 칸에 넣을 글. */
export function stateCell(data, repoCode) {
  const production = topOf(data.tracks?.production);
  if (!production) return null;
  const day = String(data.checkedAt ?? "").slice(0, 10);
  const label = production.name ? `${production.name} (versionCode ${production.code})` : `versionCode ${production.code}`;
  const testing = TRACKS.slice(1)
    .map((track) => ({ track, top: topOf(data.tracks?.[track]) }))
    .filter((row) => row.top && row.top.code > production.code)
    .map((row) => `${TRACK_NAME[row.track]} ${row.top.name || row.top.code}`);
  const ahead = production.code > repoCode ? ` — 저장소 versionCode ${repoCode}보다 높음, 저장소 버전을 올려야 함` : "";
  return `**${label}**(Play 확인 ${day})${testing.length ? ` · ${testing.join(" · ")}` : ""}${ahead}`;
}

/** STATE 본문에서 그 줄 둘째 칸만 바꾼다. */
export function patchState(text, cell) {
  return text.replace(/^(\| Play에 올라간 앱 \| )(.*?)( \| [^\n]*\|)$/m, (_, head, _old, tail) => `${head}${cell}${tail}`);
}

export function pageOf(data, repoCode) {
  const rows = TRACKS.map((track) => {
    const top = topOf(data.tracks?.[track]);
    const error = data.tracks?.[track]?.error;
    const value = top ? `${top.name || "—"} · versionCode ${top.code}` : error ? `읽지 못함 (${error})` : "없음";
    return `| ${TRACK_NAME[track]} \`${track}\` | ${value} |`;
  });
  const production = topOf(data.tracks?.production);
  const gap = production && production.code !== repoCode
    ? `\n저장소 \`android/app/build.gradle\` versionCode **${repoCode}** ↔ 프로덕션 **${production.code}** — ${production.code > repoCode ? "Play가 앞섬: 저장소 버전을 올려 다음 빌드가 거절되지 않게" : "저장소가 앞섬: 다음 버전을 아직 안 올렸거나 검토 중"}.\n`
    : `\n저장소 versionCode ${repoCode}와 프로덕션이 같음.\n`;
  return `# Play 트랙 버전

> **자동 — 손으로 고치지 않는다.** 예약 워크플로 \`play-versions\`(매일, Play API 읽기만)가 \`scripts/play-versions.mjs\`로 적는다.
> 값이 바뀐 날만 커밋한다. 마지막으로 바뀐 것을 확인한 날: ${String(data.checkedAt ?? "").slice(0, 10)}. \`hub/STATE.md\` "Play에 올라간 앱"도 같은 값.

| 트랙 | 버전 |
|---|---|
${rows.join("\n")}
${gap}`;
}

function repoVersionCode() {
  const hit = readFileSync(GRADLE, "utf8").match(/versionCode\s+(\d+)/);
  return hit ? Number(hit[1]) : 0;
}

/** 날짜를 뺀 내용이 같은가 — 날짜만 바뀐 것은 고치지 않는다. */
const sameIgnoringDate = (a, b) => a.replace(/\d{4}-\d{2}-\d{2}/g, "") === b.replace(/\d{4}-\d{2}-\d{2}/g, "");

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/play-versions.mjs <play-versions.json>");
    process.exit(2);
  }
  const data = JSON.parse(readFileSync(file, "utf8"));
  const repoCode = repoVersionCode();
  const cell = stateCell(data, repoCode);
  if (!cell) {
    console.error("production 트랙 값을 못 읽음 — 허브는 그대로", JSON.stringify(data.tracks?.production ?? {}));
    process.exit(1);
  }
  const state = readFileSync(STATE, "utf8");
  const nextState = patchState(state, cell);
  let changed = 0;
  if (!sameIgnoringDate(state, nextState)) {
    writeFileSync(STATE, nextState);
    changed++;
  }
  let page = "";
  try {
    page = readFileSync(PAGE, "utf8");
  } catch {}
  const nextPage = pageOf(data, repoCode);
  if (!sameIgnoringDate(page, nextPage)) {
    writeFileSync(PAGE, nextPage);
    changed++;
  }
  console.log(changed ? `바꿈 ${changed}개 — ${cell}` : `그대로 — ${cell}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
