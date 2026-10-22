/**
 * 점검 묶음 목록. 순서가 실행 순서다 — 채팅이 먼저 기록을 쌓아야 뒤 묶음이 읽을 게 생긴다.
 * 새 기능을 서버에 더하면 여기에 묶음을 하나 더한다(`hub/roles/qa.md` "가상 사용자 점검").
 *
 * every = 몇 명 중 1명이 이 묶음을 도나(비싼 묶음일수록 크게). 196명 기준:
 *   chat 196 · map 28 · next 196 · ask 98 · sheet 98 · pack 49 · rooms(방·프로필·팔로우, 2명씩) 7
 *   roomsplus(방 새 기능) 14 · dm(1:1 메시지) 14 · groups(단체방) 14 · people(사람·친구 초대) 14 · notes(노트·업데이트 안내) 14
 *   board(게시판) 14 · team(러닝메이트·팀) 14
 *   tiers(문장 종류 8칸 1차 세분화, 한 사람이 한 칸) 196 — tiers-report.mjs로 칸별 기준
 *   사람 사이 묶음의 임시 계정은 숨김(사람 목록에 안 뜸)·끝에 삭제(accounts.mjs).
 * 한 사람 안에서 무료 하루 채팅 10번을 넘지 않게: 채팅 턴(≤6) + 미션 확인 2 + 직접 묻기 1.
 */
import chat from "./chat.mjs";
import map from "./map.mjs";
import next from "./next.mjs";
import ask from "./ask.mjs";
import sheet from "./sheet.mjs";
import pack from "./pack.mjs";
import rooms from "./rooms.mjs";
import roomsplus from "./roomsplus.mjs";
import dm from "./dm.mjs";
import groups from "./groups.mjs";
import people from "./people.mjs";
import notes from "./notes.mjs";
import board from "./board.mjs";
import team from "./team.mjs";
import tiers from "./tiers.mjs";

export const SUITES = [chat, map, next, ask, sheet, pack, rooms, roomsplus, dm, groups, people, notes, board, team, tiers];

export function suiteById(id) {
  return SUITES.find((s) => s.id === id) ?? null;
}
