import { kvDelete, kvGetJson, kvGetJsonMany, kvIncrBy, kvListPush, kvListRange, kvListTrim, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { liarStepKey, liarView, tickLiar, type LiarGame, type LiarView } from "../rooms/liarGame.ts";
import { mafiaStepKey, mafiaView, tickMafia, type MafiaGame, type MafiaView } from "../rooms/mafiaGame.ts";

/**
 * 말하는 방 게임의 저장·잠금(2026-10-23). 규칙은 `rooms/liarGame.ts`·`rooms/mafiaGame.ts`, AI는 `server/roomGame.ts`.
 *
 * - `room:game:<방>`: 지금 판 하나(2시간). 방 정보의 `game`에 그 판 번호가 있을 때만 방 물음이 읽는다(저장소 명령을 늘리지 않으려고).
 * - `room:gvote:<방>:<판>[:<단계>]:<사람>`: 한 사람의 표·밤 행동 — 사람마다 따로 써서 동시에 내도 덮어쓰지 않는다.
 * - `room:glock:<방>:<판>:<단계>`: 한 단계를 한 번만 넘기는 잠금(SET NX). 여러 사람의 물음이 동시에 넘기려 해도 하나만 쓴다.
 * - `room:gwords:<방>`: 최근 제시어(영어) 20개 — 같은 방에서 같은 말이 또 나오지 않게.
 * - `roomgame:v1:<계정>:<날>`: 방장 한 명이 하루에 시작한 판 수(AI 호출 상한).
 * 학습자 문장은 저장하지 않는다 — 설명·토론은 자막 줄(방이 열린 동안만)로 남고, 라이어의 답은 판이 끝나면 판과 함께 사라진다.
 */

export type RoomGame = LiarGame | MafiaGame;
export type RoomGameView = LiarView | MafiaView;

export const GAME_TTL_SECONDS = 2 * 60 * 60;
export const GAMES_PER_DAY = 30;
const RECENT_WORDS = 20;

const gameKey = (room: string) => `room:game:${room}`;
const lockKey = (room: string, game: string, step: string) => `room:glock:${room}:${game}:${step}`;
const wordsKey = (room: string) => `room:gwords:${room}`;

export const isMafia = (game: RoomGame): game is MafiaGame => (game as MafiaGame).kind === "mafia";

/** 이 단계에서 고르는 사람(표·밤 행동)과 키. 고를 게 없는 단계면 빈 목록. */
function pickKeys(roomId: string, game: RoomGame): { peer: string; key: string }[] {
  if (isMafia(game)) {
    if (game.phase !== "night" && game.phase !== "vote") return [];
    return game.alive.map((peer) => ({ peer, key: `room:gvote:${roomId}:${game.id}:${game.phase}${game.round}:${peer}` }));
  }
  if (game.phase !== "vote") return [];
  return game.players.map((player) => ({ peer: player.peerId, key: `room:gvote:${roomId}:${game.id}:${player.peerId}` }));
}

function stepKey(game: RoomGame): string {
  return isMafia(game) ? mafiaStepKey(game) : liarStepKey(game);
}

function sameStep(a: RoomGame, b: RoomGame): boolean {
  if (isMafia(a) && isMafia(b)) return a.phase === b.phase && a.round === b.round;
  if (!isMafia(a) && !isMafia(b)) return a.phase === b.phase && a.turn === b.turn;
  return false;
}

export async function readGame(roomId: string, gameId?: string): Promise<RoomGame | null> {
  const game = await kvGetJson<RoomGame>(gameKey(roomId));
  if (!game || (gameId && game.id !== gameId)) return null;
  return game;
}

export async function writeGame(roomId: string, game: RoomGame): Promise<void> {
  await kvSetJson(gameKey(roomId), game, GAME_TTL_SECONDS);
}

export async function deleteGame(roomId: string): Promise<void> {
  await kvDelete([gameKey(roomId)]);
}

/** 지금 단계에 들어온 표·밤 행동(누가 → 누구). */
export async function readVotes(roomId: string, game: RoomGame): Promise<Record<string, string>> {
  const keys = pickKeys(roomId, game);
  if (!keys.length) return {};
  const rows = await kvGetJsonMany<string>(keys.map((row) => row.key));
  const votes: Record<string, string> = {};
  keys.forEach((row, index) => {
    const target = rows[index];
    if (typeof target === "string") votes[row.peer] = target;
  });
  return votes;
}

/** 표·밤 행동 하나. 그 단계에서 고를 수 없는 사람이면 false. */
export async function writeVote(roomId: string, game: RoomGame, voter: string, target: string): Promise<boolean> {
  const row = pickKeys(roomId, game).find((entry) => entry.peer === voter);
  if (!row) return false;
  await kvSetJson(row.key, target, GAME_TTL_SECONDS);
  return true;
}

/**
 * 바뀐 판을 쓴다 — 이 단계에서 처음 넘기는 사람만(잠금). 못 잡으면 누가 이미 넘겼으니 저장된 판을 다시 읽어 돌려준다.
 * (마피아에서 방을 떠난 사람만 빠질 때처럼 단계가 그대로면 잠그지 않고 쓴다 — 같은 결과라 겹쳐 써도 같다.)
 */
export async function commitStep<T extends RoomGame>(roomId: string, before: T, after: T): Promise<T> {
  if (sameStep(before, after)) {
    if (before !== after && JSON.stringify(before) !== JSON.stringify(after)) await writeGame(roomId, after);
    return after;
  }
  const took = await kvSetJsonIfAbsent(lockKey(roomId, before.id, stepKey(before)), 1, GAME_TTL_SECONDS);
  if (!took) return ((await readGame(roomId, before.id)) as T | null) ?? before;
  await writeGame(roomId, after);
  return after;
}

function tick(game: RoomGame, now: number, present: Set<string>, votes: Record<string, string>): RoomGame {
  return isMafia(game) ? tickMafia(game, now, present, votes) : tickLiar(game, now, present, votes);
}

/** 방 물음마다: 판을 읽어 지난 단계를 넘기고(필요하면 저장) 지금 판과 그 단계의 표를 돌려준다. */
export async function currentGame(
  roomId: string,
  gameId: string,
  present: Set<string>,
  now = Date.now(),
): Promise<{ game: RoomGame; votes: Record<string, string> } | null> {
  const stored = await readGame(roomId, gameId);
  if (!stored) return null;
  const votes = await readVotes(roomId, stored);
  const ticked = tick(stored, now, present, votes);
  const game = await commitStep(roomId, stored, ticked);
  return { game, votes: stepKey(game) === stepKey(stored) ? votes : await readVotes(roomId, game) };
}

/** 이 사람에게 보일 판. */
export function gameView(game: RoomGame, viewer: string, votes: Record<string, string> = {}): RoomGameView {
  return isMafia(game) ? mafiaView(game, viewer, votes) : liarView(game, viewer, game.phase === "vote" ? votes : {});
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
