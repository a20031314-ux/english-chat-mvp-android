/**
 * 관전자 추리(2026-10-23, 사용자 "관전자 참여 — 추리·투표식, 플레이어와 관전자가 서로 영향을 주지 못하게").
 *
 * 관전자 = 방에 있지만 이 판의 플레이어가 아닌 사람(듣기 자리·채팅만·늦게 온 사람), 마피아에서 탈락한 사람.
 * 방장이 사회자인 판의 방장은 답을 알아서 빠진다.
 * - 라이어 게임: "누가 라이어?" 하나를 찍고 바꿀 수 있다. 투표가 끝나 라이어가 드러나기 전(설명·투표 중)까지만.
 * - 마피아: 낮·밤마다(라운드마다) "누가 마피아?" 하나. 남아 있는 사람만 찍을 수 있다(드러난 마피아를 찍어 점수를 얻지 않게).
 * 서로 영향을 주지 않게: 관전자의 표는 플레이어 투표에 들어가지 않고, 누가 누구를 찍었는지는 판이 끝날 때까지 아무에게도 보이지 않는다
 * (보이는 것은 "관전자 n명 추리 중"뿐). 관전자에게도 플레이어 투표의 결과는 끝나야 보인다(진행 중엔 낸 수만, 원래 그대로).
 * 끝나면 맞힌 사람과 그 방의 추리 순위(방이 열린 동안, 맞힌 횟수).
 */

import type { LiarGame, LiarPlayer } from "./liarGame.ts";
import type { MafiaGame } from "./mafiaGame.ts";

type AnyGame = LiarGame | MafiaGame;
const mafiaGame = (game: AnyGame): game is MafiaGame => (game as MafiaGame).kind === "mafia";

/** 판에 걸린 관전자 한 사람(처음 찍을 때 남긴다 — 방을 떠나도 결과에 이름이 남게). */
export type Watcher = { peerId: string; accountId: string | null; nickname: string };

export type Prediction = { peerId: string; round: number; target: string };

export type SpectatorResult = {
  /** 한 번이라도 찍은 관전자 수. */
  total: number;
  /** 맞힌 사람(마피아는 처음 맞힌 라운드). */
  right: { peerId: string; nickname: string; round?: number }[];
  /** 끝나기 전 마지막으로 찍은 대상별 수. */
  counts: Record<string, number>;
  /** 이 방의 추리 순위(맞힌 횟수, 상위 3). */
  board: { nickname: string; hits: number }[];
};

/** 이 사람에게 보일 관전자 쪽. */
export type WatchView = {
  /** 내가 지금 찍을 수 있나(관전자이고 아직 열려 있음). */
  can: boolean;
  /** 내가 관전자인가(찍을 수 있는 때가 지나도). */
  spectator: boolean;
  /** 이번 라운드에 내가 찍은 사람. */
  mine?: string;
  /** 찍은 관전자 수(누가 누구를 찍었는지는 끝나야). */
  count: number;
  result?: SpectatorResult;
};

export function isSpectator(game: AnyGame, peerId: string): boolean {
  if (game.mode === "host" && peerId === game.moderator) return false;
  const playing = game.players.some((player) => player.peerId === peerId);
  if (mafiaGame(game)) return !playing || !game.alive.includes(peerId);
  return !playing;
}

/** 지금 찍는 라운드(라이어 0, 마피아는 낮·밤 번호). */
export function predictionRound(game: AnyGame): number {
  return mafiaGame(game) ? game.round : 0;
}

export function predictionOpen(game: AnyGame): boolean {
  return mafiaGame(game) ? game.phase !== "done" : game.phase === "clue" || game.phase === "vote";
}

export function canPredict(game: AnyGame, peerId: string, target: string): boolean {
  if (!predictionOpen(game) || !isSpectator(game, peerId) || target === peerId) return false;
  if (mafiaGame(game)) return game.alive.includes(target);
  return game.players.some((player) => player.peerId === target);
}

/** 누가 맞혔나. 라이어: 마지막으로 찍은 사람이 라이어. 마피아: 어느 라운드든 마피아를 찍었으면(처음 맞힌 라운드), 맞힌 라운드 수가 그 사람의 점수. */
export function scorePredictions(
  game: AnyGame,
  watchers: Watcher[],
  predictions: Prediction[],
): { right: SpectatorResult["right"]; counts: Record<string, number>; hits: Record<string, number>; total: number } {
  const byPeer = new Map<string, Prediction[]>();
  for (const row of predictions) byPeer.set(row.peerId, [...(byPeer.get(row.peerId) ?? []), row]);
  const counts: Record<string, number> = {};
  const hits: Record<string, number> = {};
  const right: SpectatorResult["right"] = [];
  for (const watcher of watchers) {
    const rows = (byPeer.get(watcher.peerId) ?? []).sort((a, b) => a.round - b.round);
    if (!rows.length) continue;
    const last = rows[rows.length - 1];
    counts[last.target] = (counts[last.target] ?? 0) + 1;
    if (mafiaGame(game)) {
      const good = rows.filter((row) => game.roles[row.target] === "mafia");
      if (good.length) {
        hits[watcher.peerId] = good.length;
        right.push({ peerId: watcher.peerId, nickname: watcher.nickname, round: good[0].round });
      }
    } else if (last.target === game.liar) {
      hits[watcher.peerId] = 1;
      right.push({ peerId: watcher.peerId, nickname: watcher.nickname });
    }
  }
  return { right, counts, hits, total: [...byPeer.keys()].filter((peer) => watchers.some((w) => w.peerId === peer)).length };
}

/** 방의 추리 순위에 이번 판 맞힌 횟수를 더한다(계정 기준, 없으면 이름표). */
export type Board = Record<string, { nickname: string; hits: number }>;

export function addToBoard(board: Board, watchers: Watcher[], hits: Record<string, number>): Board {
  const next: Board = { ...board };
  for (const watcher of watchers) {
    const add = hits[watcher.peerId];
    if (!add) continue;
    const key = watcher.accountId ?? watcher.peerId;
    next[key] = { nickname: watcher.nickname, hits: (next[key]?.hits ?? 0) + add };
  }
  return next;
}

export function topOfBoard(board: Board, limit = 3): SpectatorResult["board"] {
  return Object.values(board)
    .sort((a, b) => b.hits - a.hits || a.nickname.localeCompare(b.nickname))
    .slice(0, limit);
}

/** 관전자 목록에 없는 사람이면 더한다. */
export function withWatcher(watchers: Watcher[], watcher: Watcher): Watcher[] {
  return watchers.some((row) => row.peerId === watcher.peerId) ? watchers : [...watchers, watcher];
}

export type { LiarPlayer };
