/**
 * 점검 묶음 목록. 순서가 실행 순서다 — 채팅이 먼저 기록을 쌓아야 뒤 묶음이 읽을 게 생긴다.
 * 새 기능을 서버에 더하면 여기에 묶음을 하나 더한다(`hub/roles/qa.md` "가상 사용자 점검").
 *
 * every = 몇 명 중 1명이 이 묶음을 도나(비싼 묶음일수록 크게). 196명 기준:
 *   chat 196 · map 28 · next 196 · ask 98 · sheet 98 · pack 49 · rooms(방·프로필·팔로우, 2명씩) 7
 * 한 사람 안에서 무료 하루 채팅 10번을 넘지 않게: 채팅 턴(≤6) + 미션 확인 2 + 직접 묻기 1.
 */
import chat from "./chat.mjs";
import map from "./map.mjs";
import next from "./next.mjs";
import ask from "./ask.mjs";
import sheet from "./sheet.mjs";
import pack from "./pack.mjs";
import rooms from "./rooms.mjs";

export const SUITES = [chat, map, next, ask, sheet, pack, rooms];

export function suiteById(id) {
  return SUITES.find((s) => s.id === id) ?? null;
}
