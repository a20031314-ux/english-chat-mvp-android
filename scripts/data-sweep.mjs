/**
 * 운영 저장소(Upstash KV)를 데이터 지도와 맞춰 보고 정리한다. PC에서, KV 키가 있을 때.
 *
 *   node --experimental-strip-types scripts/data-sweep.mjs                       (보고만: 묶음별 개수·점검 데이터·코드에 없는 키)
 *   node --experimental-strip-types scripts/data-sweep.mjs --delete-test         (점검 데이터 지우기)
 *   node --experimental-strip-types scripts/data-sweep.mjs --delete-orphans a:v1,b:   (보고서에서 확인한 "코드에 없는" 묶음만 지우기)
 *
 * KV 키: KV_REST_API_URL·KV_REST_API_TOKEN(또는 UPSTASH_REDIS_REST_*) — cost-report.mjs와 같음.
 * 나누는 법:
 *   - 점검: 키의 한 칸이 점검 사용자 id(simcheck-·claude-·language-pass·capture-·probe-로 시작). 실제 사용자 id는 RevenueCat·계정 id라 이 글자로 시작하지 않는다.
 *   - 지도에 있음: scripts/data-map.json의 묶음으로 시작.
 *   - 코드에 없음: 둘 다 아님 — 기능을 없앴거나 키 이름을 바꾼 흔적. 이름만 바꾼 경우와 구별이 안 되므로 자동으로 지우지 않고,
 *     사람이 보고서를 보고 --delete-orphans에 묶음 이름을 적어야만 지운다.
 * 실제 사용자 데이터(지도에 있는 것)는 이 스크립트가 지우지 않는다.
 * 키 전체를 한 번 훑는 데 Upstash 명령이 (키 수 / 1000)번쯤 든다 — 주 1회면 충분.
 * 보고서: tmp/data-sweep/<날짜>.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kvConfigured, kvDelete, kvScanKeys } from "../src/lib/server/kv.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const listArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1].split(",").map((s) => s.trim()).filter(Boolean) : [];
};

export const TEST_ID = /^(simcheck-|claude-|language-pass|capture-|probe-)/;

export function isTestKey(key) {
  return key.split(":").some((seg) => TEST_ID.test(seg));
}

/** 키가 속한 지도 묶음(가장 긴 것), 없으면 null. */
export function groupFor(key, groups) {
  let best = null;
  for (const g of groups) {
    const hit = g.endsWith(":") ? key.startsWith(g) : key === g || key.startsWith(`${g}:`);
    if (hit && (!best || g.length > best.length)) best = g;
  }
  return best;
}

/** 코드에 없는 키의 묶음 이름(앞 두 칸). */
export function orphanGroup(key) {
  const segs = key.split(":");
  return segs.length > 1 ? `${segs[0]}:${segs[1]}` : segs[0];
}

export function classify(keys, groups) {
  const known = {};
  const test = {};
  const orphan = {};
  for (const key of keys) {
    const g = groupFor(key, groups);
    if (isTestKey(key)) (test[g ?? orphanGroup(key)] ??= []).push(key);
    else if (g) (known[g] ??= []).push(key);
    else (orphan[orphanGroup(key)] ??= []).push(key);
  }
  return { known, test, orphan };
}

async function main() {
  if (!kvConfigured()) {
    console.error("KV 키가 없어요. KV_REST_API_URL·KV_REST_API_TOKEN을 넣고 다시 돌리세요(Vercel 환경 변수와 같은 값).");
    process.exit(1);
  }
  const notes = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/data-map.json"), "utf8"));
  const groups = Object.keys(notes.groups);
  const started = Date.now();
  const keys = await kvScanKeys("*", 1000);
  const { known, test, orphan } = classify(keys, groups);
  const count = (o) => Object.values(o).reduce((a, v) => a + v.length, 0);
  const day = new Date().toISOString().slice(0, 10);
  const lines = [
    `# 데이터 정리 보고 ${day}`,
    "",
    `키 ${keys.length.toLocaleString("ko-KR")}개 (훑는 데 ${Math.round((Date.now() - started) / 1000)}초) — 지도에 있음 ${count(known).toLocaleString("ko-KR")} · 점검 ${count(test).toLocaleString("ko-KR")} · **코드에 없음 ${count(orphan).toLocaleString("ko-KR")}**`,
    "",
    "## 코드에 없는 키 (확인 뒤 `--delete-orphans 묶음,묶음`으로만 지움)",
    "",
    "| 묶음 | 개수 | 예 |",
    "|---|---|---|",
    ...Object.entries(orphan).sort((a, b) => b[1].length - a[1].length).map(([g, ks]) => `| \`${g}\` | ${ks.length} | \`${ks[0]}\` |`),
    "",
    "## 점검 데이터 (`--delete-test`로 지움)",
    "",
    "| 묶음 | 개수 |",
    "|---|---|",
    ...Object.entries(test).sort((a, b) => b[1].length - a[1].length).map(([g, ks]) => `| \`${g}\` | ${ks.length} |`),
    "",
    "## 지도에 있는 데이터 (지우지 않음)",
    "",
    "| 묶음 | 기능 | 개수 |",
    "|---|---|---|",
    ...Object.entries(known).sort((a, b) => b[1].length - a[1].length).map(([g, ks]) => `| \`${g}\` | ${notes.groups[g]?.feature ?? ""} | ${ks.length} |`),
    "",
  ];

  if (args.includes("--delete-test")) {
    const all = Object.values(test).flat();
    for (let i = 0; i < all.length; i += 200) await kvDelete(all.slice(i, i + 200));
    lines.push(`점검 데이터 ${all.length}개 지움.`, "");
  }
  const orphanPick = listArg("--delete-orphans");
  if (orphanPick.length) {
    const unknown = orphanPick.filter((g) => !orphan[g]);
    if (unknown.length) lines.push(`코드에 없는 묶음이 아니라서 건너뜀: ${unknown.join(", ")}`, "");
    const all = orphanPick.filter((g) => orphan[g]).flatMap((g) => orphan[g]);
    for (let i = 0; i < all.length; i += 200) await kvDelete(all.slice(i, i + 200));
    lines.push(`코드에 없는 키 ${all.length}개 지움(${orphanPick.filter((g) => orphan[g]).join(", ")}).`, "");
  }

  const out = path.join(ROOT, "tmp/data-sweep", `${day}.md`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n"));
  console.log(lines.slice(0, 3).join("\n"));
  console.log(`보고서: ${path.relative(ROOT, out)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
