import { kvHashGetAll, kvHashIncrMany } from "./kv.ts";
import { statFields, statsFromFields, type AskedItem, type ItemStats } from "../curriculum/itemStats.ts";

/**
 * 문제 난이도 통계(curriculum/itemStats.ts) — 학습 언어마다 해시 하나, 열쇠별 낸 수(n|)·맞힌 수(r|)만.
 * 누가 풀었는지는 남기지 않아 계정을 지울 때 지울 것이 없다. 점검 사용자(simcheck-)의 답은 세지 않는다.
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;

export function itemStatsKey(language: string): string {
  return `itemStats:v1:${language}`;
}

export async function addItemStats(userId: string, language: string, asked: readonly AskedItem[]): Promise<void> {
  if (!asked.length || /^(rc:)?simcheck-/.test(userId)) return;
  await kvHashIncrMany(itemStatsKey(language), statFields(asked), TTL_SECONDS);
}

export async function readItemStats(language: string): Promise<ItemStats> {
  return statsFromFields(await kvHashGetAll(itemStatsKey(language)));
}
