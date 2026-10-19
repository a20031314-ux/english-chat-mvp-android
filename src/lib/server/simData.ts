/**
 * 가상 사용자 점검(scripts/sim-users)이 운영 저장소에 남긴 데이터를 지운다.
 *
 * 점검은 실행마다 새 사용자(`simcheck-<실행>-<사람>`)로 앱을 처음 쓰는 길을 그대로 걷는다 —
 * 지도 점검은 "새 사용자인데 지도가 이미 있음"을 잡아야 하므로 이름을 재사용할 수 없다.
 * 그 사람들의 학습 기록(프로필·표현 장부·지도 등)은 최대 400일 남아, 6시간마다 돌면 하루
 * 수백 명분이 쌓인다. 점검이 끝날 때 자기 실행의 데이터를 이것으로 지운다.
 *
 * 지울 수 있는 것은 키 이름에 `simcheck-`가 들어간 것뿐이다. 실제 사용자 id(RevenueCat·
 * 계정 id)에는 이 글자가 없다. 누구나 부를 수 있어도 점검 데이터 밖은 건드리지 못하고,
 * 저장소 전체를 훑는 SCAN이 Upstash 명령 수를 쓰므로 하루 횟수를 제한한다.
 */
import { kvDelete, kvIncrBy, kvScanKeys } from "./kv.ts";

export const SIM_USER_MARK = "simcheck-";

/** 하루에 지우기를 부를 수 있는 횟수(모든 점검 합쳐서). 예약 점검 하루 약 7번 + 손으로 돌리는 것. */
export const SIM_FORGET_DAILY_MAX = 40;

const PREFIX = /^[A-Za-z0-9_-]{3,80}$/;

/**
 * 지울 키 패턴. `prefix`는 실행 이름(끝에 `-`를 붙이면 그 실행만), `all`이면 모든 점검 데이터.
 * 잘못된 값이면 null — 패턴 글자(*, ?, [)가 들어가 점검 밖으로 넓어지는 일을 막는다.
 */
export function simForgetPattern(input: { prefix?: unknown; all?: unknown }): string | null {
  if (input.all === true) return `*${SIM_USER_MARK}*`;
  if (typeof input.prefix !== "string" || !PREFIX.test(input.prefix)) return null;
  return `*${SIM_USER_MARK}${input.prefix}*`;
}

/** 부른 쪽이 점검 사용자인가(`rc:simcheck-…`). */
export function isSimCaller(dataUserId: string): boolean {
  return dataUserId.startsWith(`rc:${SIM_USER_MARK}`);
}

export type SimForgetResult =
  | { ok: true; pattern: string; found: number; deleted: number; dryRun: boolean; sample: string[] }
  | { ok: false; error: "BAD_PREFIX" | "LIMIT" };

export async function forgetSimData(
  input: { prefix?: unknown; all?: unknown; dryRun?: unknown },
  now = Date.now(),
): Promise<SimForgetResult> {
  const pattern = simForgetPattern(input);
  if (!pattern) return { ok: false, error: "BAD_PREFIX" };
  const day = new Date(now).toISOString().slice(0, 10);
  const used = await kvIncrBy(`simforget:v1:${day}`, 1, 2 * 24 * 60 * 60);
  if (used > SIM_FORGET_DAILY_MAX) return { ok: false, error: "LIMIT" };
  const keys = (await kvScanKeys(pattern, 1000)).filter((key) => key.includes(SIM_USER_MARK));
  const dryRun = input.dryRun === true;
  if (!dryRun) {
    for (let i = 0; i < keys.length; i += 200) await kvDelete(keys.slice(i, i + 200));
  }
  return { ok: true, pattern, found: keys.length, deleted: dryRun ? 0 : keys.length, dryRun, sample: keys.slice(0, 5) };
}
