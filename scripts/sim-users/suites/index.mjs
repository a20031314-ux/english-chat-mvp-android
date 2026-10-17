/**
 * 점검 묶음 목록. 순서가 실행 순서다 — 채팅이 먼저 기록을 쌓아야 뒤 묶음이 읽을 게 생긴다.
 * 새 기능을 서버에 더하면 여기에 묶음을 하나 더한다(`hub/roles/qa.md` "가상 사용자 점검").
 */
import chat from "./chat.mjs";

export const SUITES = [chat];

export function suiteById(id) {
  return SUITES.find((s) => s.id === id) ?? null;
}
