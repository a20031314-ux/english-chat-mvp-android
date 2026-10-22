import { kvDelete, kvGetJson, kvGetJsonMany, kvIncrBy, kvListPush, kvListRange, kvListTrim, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import {
  liarStepKey,
  sameLiarStep,
  tickLiar,
  type LiarGame,
} from "../rooms/liarGame.ts";

/**
 * 말하는 방 게임의 저장·잠금(2026-10-23). 규칙은 `rooms/liarGame.ts`, AI(제시어·판정)는 `server/roomGame.ts`.
 *
 * - `room:game:<방>`: 지금 판 하나(2시간). 방 정보의 `game`에 그 판 번호가 있을 때만 방 물음이 읽는다(저장소 명령을 늘리지 않으려고).
 * - `room:gvote:<방>:<판>:<사람>`: 한 사람의 표 — 사람마다 따로 써서 동시에 내도 덮어쓰지 않는다.
 * - `room:glock:<방>:<판>:<단계>`: 한 단계를 한 번만 넘기는 잠금(SET NX). 여러 사람의 물음이 동시에 넘기려 해도 하나만 쓴다.
 * - `room:gwords:<방>`: 최근 제시어(영어) 20개 — 같은 방에서 같은 말이 또 나오지 않게.
 * - `roomgame:v1:<계정>:<날>`: 방장 한 명이 하루에 시작한 판 수(AI 호출 상한).
 * 학습자 문장은 저장하지 않는다 — 설명은 자막 줄(방이 열린 동안만)로 남고, 라이어의 답은 판이 끝나면 판과 함께 사라진다.
 */

export const GAME_TTL_SECONDS = 2 * 60 * 60;
export const GAMES_PER_DAY = 30;
const RECENT_WORDS = 20;

const gameKey = (room: string) => `room:game:${room}`;
const voteKey = (room: string, game: string, peer: string) => `room:gvote:${room}:${game}:${peer}`;
const lockKey = (room: string, game: string, step: string) => `room:glock:${room}:${game}:${step}`;
const wordsKey = (room: string) => `room:gwords:${room}`;

export async function readGame(roomId: string, gameId?: string): Promise<LiarGame | null> {
  const game = await kvGetJson<LiarGame>(gameKey(roomId));
  if (!game || (gameId && game.id !== gameId)) return null;
  return game;
}

export async function writeGame(roomId: string, game: LiarGame): Promise<void> {
  await kvSetJson(gameKey(roomId), game, GAME_TTL_SECONDS);
}

export async function deleteGame(roomId: string): Promise<void> {
  await kvDelete([gameKey(roomId)]);
}

export async function readVotes(roomId: string, game: LiarGame): Promise<Record<string, string>> {
  if (game.phase !== "vote") return {};
  const rows = await kvGetJsonMany<string>(game.players.map((player) => voteKey(roomId, game.id, player.peerId)));
  const votes: Record<string, string> = {};
  game.players.forEach((player, index) => {
    const target = rows[index];
    if (typeof target === "string") votes[player.peerId] = target;
  });
  return votes;
}

export async function writeVote(roomId: string, game: LiarGame, voter: string, target: string): Promise<void> {
  await kvSetJson(voteKey(roomId, game.id, voter), target, GAME_TTL_SECONDS);
}

/**
 * 바뀐 판을 쓴다 — 이 단계에서 처음 넘기는 사람만(잠금). 못 잡으면 누가 이미 넘겼으니 저장된 판을 다시 읽어 돌려준다.
 */
export async function commitStep(roomId: string, before: LiarGame, after: LiarGame): Promise<LiarGame> {
  if (sameLiarStep(before, after) && before.guess === after.guess) return before;
  const took = await kvSetJsonIfAbsent(lockKey(roomId, before.id, liarStepKey(before)), 1, GAME_TTL_SECONDS);
  if (!took) return (await readGame(roomId, before.id)) ?? before;
  await writeGame(roomId, after);
  return after;
}

/** 방 물음마다: 판을 읽어 지난 단계를 넘기고(필요하면 저장) 지금 판과 표를 돌려준다. */
export async function currentGame(
  roomId: string,
  gameId: string,
  present: Set<string>,
  now = Date.now(),
): Promise<{ game: LiarGame; votes: Record<string, string> } | null> {
  const stored = await readGame(roomId, gameId);
  if (!stored) return null;
  const votes = await readVotes(roomId, stored);
  const ticked = tickLiar(stored, now, present, votes);
  const game = await commitStep(roomId, stored, ticked);
  return { game, votes: game.phase === "vote" ? votes : {} };
}

/** 방장이 오늘 시작할 수 있는 판이 남았나(하나 쓴다). */
export async function takeGameStart(accountId: string, now = new Date()): Promise<boolean> {
  const day = now.toISOString().slice(0, 10);
  return (await kvIncrBy(`roomgame:v1:${accountId}:${day}`, 1, 2 * 24 * 60 * 60)) <= GAMES_PER_DAY;
}

export async function recentWords(roomId: string): Promise<string[]> {
  return kvListRange(wordsKey(roomId), -RECENT_WORDS, -1);
}

export async function rememberWord(roomId: string, word: string): Promise<void> {
  if (!word) return;
  await kvListPush(wordsKey(roomId), [word], GAME_TTL_SECONDS * 3);
  await kvListTrim(wordsKey(roomId), RECENT_WORDS);
}

