/**
 * 말하는 방 힌트의 하루 상한. 편한 말로 한 줄마다 모델을 한 번 부르므로(카드와 같은 작은 모델),
 * 사람마다 하루 ROOM_HINTS_PER_DAY번까지(서버 날짜 UTC). 넘으면 앱은 힌트를 조용히 멈춘다.
 * 힌트 문장도, 말한 문장도 저장하지 않는다 — 세는 숫자만.
 */
import { kvIncrBy } from "./kv.ts";

export const ROOM_HINTS_PER_DAY = 40;

export async function takeRoomHint(userId: string, now = new Date()): Promise<boolean> {
  if (!userId) return false;
  const day = now.toISOString().slice(0, 10);
  const used = await kvIncrBy(`roomhint:v1:${userId}:${day}`, 1, 2 * 24 * 60 * 60);
  return used <= ROOM_HINTS_PER_DAY;
}
