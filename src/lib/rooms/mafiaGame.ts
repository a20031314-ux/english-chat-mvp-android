/**
 * 말하는 방 마피아 게임(2026-10-23, 사용자 "이어서" — 라이어 게임 다음).
 *
 * 규칙은 여기(순수 함수), 저장·잠금은 `server/roomGameStore.ts`, AI는 시작할 때 배경 이야기 한 번만(`server/roomGame.ts`, 사회자 AI일 때).
 * 사람 5~8명. 마피아 1명(7명부터 2명), 의사 1, 경찰 1, 나머지 시민. 서로의 역할은 모르고 마피아끼리만 안다.
 *
 * 한 바퀴: 밤(마피아는 노릴 사람, 의사는 지킬 사람, 경찰은 확인할 사람을 고름 — 다 고르면 바로 아침) → 낮(밤에 무슨 일이 있었는지 알리고
 * 배우는 언어로 이야기, 시간이 다 되거나 사회자가 넘기면) → 투표(가장 많이 받은 사람이 나감, 동점이면 아무도) → 다시 밤.
 * 마피아가 모두 나가면 시민 승, 마피아 수가 나머지 수 이상이면 마피아 승. 나간 사람(당함·투표·방을 떠남)의 역할은 모두에게 보인다.
 */

import type { LiarMode, LiarPlayer } from "./liarGame.ts";

export const MAFIA_MIN_PLAYERS = 5;
export const MAFIA_MAX_PLAYERS = 8;
export const MAFIA_NIGHT_MS = 45_000;
export const MAFIA_DAY_MS = 120_000;
export const MAFIA_VOTE_MS = 45_000;

export type MafiaRole = "mafia" | "doctor" | "police" | "citizen";
export type MafiaPhase = "night" | "day" | "vote" | "done";
export type MafiaWinner = "mafia" | "town";

/** 언어 코드 → 글(AI가 쓴 배경 이야기). */
export type MafiaStory = { setting: Record<string, string>; intro: Record<string, string> };

export type MafiaGame = {
  v: 1;
  kind: "mafia";
  id: string;
  mode: LiarMode;
  moderator: string;
  players: LiarPlayer[];
  roles: Record<string, MafiaRole>;
  /** 아직 남은 사람. */
  alive: string[];
  phase: MafiaPhase;
  /** 몇 번째 밤·낮(1부터). */
  round: number;
  endsAt: number;
  startedAt: number;
  /** 지난밤: 당한 사람(의사가 지켰거나 마피아 표가 갈리면 null). */
  lastNight?: { round: number; killed: string | null; saved: boolean };
  /** 지난 투표: 나간 사람(동점이면 null)과 표. */
  lastVote?: { round: number; out: string | null; counts: Record<string, number> };
  /** 방을 떠나 빠진 사람. */
  left?: string[];
  /** 경찰이 확인한 것(경찰에게만 보임). */
  checks?: { round: number; target: string; mafia: boolean }[];
  story?: MafiaStory;
  winner?: MafiaWinner;
};

/** 사람 수 → 마피아 수. */
export function mafiaCount(players: number): number {
  return players >= 7 ? 2 : 1;
}

export function newMafiaGame(input: {
  id: string;
  mode: LiarMode;
  moderator: string;
  players: LiarPlayer[];
  now: number;
  story?: MafiaStory;
  random?: () => number;
}): MafiaGame {
  const random = input.random ?? Math.random;
  const order = [...input.players];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // 섞은 순서에서 역할을 나눈 뒤, 화면 순서는 들어온 순서 그대로(누가 무엇인지 순서로 알 수 없게).
  const roles: Record<string, MafiaRole> = {};
  const mafias = mafiaCount(order.length);
  order.forEach((player, index) => {
    roles[player.peerId] = index < mafias ? "mafia" : index === mafias ? "doctor" : index === mafias + 1 ? "police" : "citizen";
  });
  return {
    v: 1,
    kind: "mafia",
    id: input.id,
    mode: input.mode,
    moderator: input.moderator,
    players: input.players,
    roles,
    alive: input.players.map((player) => player.peerId),
    phase: "night",
    round: 1,
    endsAt: input.now + MAFIA_NIGHT_MS,
    startedAt: input.now,
    ...(input.story ? { story: input.story } : {}),
  };
}

const isMafia = (game: MafiaGame, peerId: string) => game.roles[peerId] === "mafia";

/** 이긴 쪽(아직이면 null). */
export function mafiaWinner(game: MafiaGame): MafiaWinner | null {
  const mafia = game.alive.filter((peer) => isMafia(game, peer)).length;
  const town = game.alive.length - mafia;
  if (mafia === 0) return "town";
  if (mafia >= town) return "mafia";
  return null;
}

/** 밤에 무엇을 할 수 있는 사람인가(남아 있는 마피아·의사·경찰). */
export function nightActor(game: MafiaGame, peerId: string): MafiaRole | null {
  if (!game.alive.includes(peerId)) return null;
  const role = game.roles[peerId];
  return role === "citizen" ? null : role;
}

/** 이 사람이 이 대상을 고를 수 있나(밤 행동·투표). */
export function canPick(game: MafiaGame, actor: string, target: string): boolean {
  if (!game.alive.includes(actor) || !game.alive.includes(target)) return false;
  if (game.phase === "vote") return actor !== target;
  if (game.phase !== "night") return false;
  const role = nightActor(game, actor);
  if (role === "mafia") return !isMafia(game, target);
  if (role === "police") return actor !== target;
  return role === "doctor";
}

function tally(picks: Record<string, string>): { counts: Record<string, number>; top: string | null } {
  const counts: Record<string, number> = {};
  for (const target of Object.values(picks)) counts[target] = (counts[target] ?? 0) + 1;
  let top: string | null = null;
  let best = 0;
  let tie = false;
  for (const [target, count] of Object.entries(counts)) {
    if (count > best) {
      best = count;
      top = target;
      tie = false;
    } else if (count === best) tie = true;
  }
  return { counts, top: tie ? null : top };
}

/** 들어온 표·행동 중 규칙에 맞는 것만. */
export function validPicks(game: MafiaGame, picks: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(picks).filter(([actor, target]) => canPick(game, actor, target)));
}

function finish(game: MafiaGame, now: number): MafiaGame {
  const winner = mafiaWinner(game);
  return winner ? { ...game, phase: "done", winner, endsAt: now } : game;
}

function resolveNight(game: MafiaGame, picks: Record<string, string>, now: number): MafiaGame {
  const kept = validPicks(game, picks);
  const mafiaPicks = Object.fromEntries(Object.entries(kept).filter(([actor]) => isMafia(game, actor)));
  const target = tally(mafiaPicks).top;
  const doctor = game.alive.find((peer) => game.roles[peer] === "doctor");
  const police = game.alive.find((peer) => game.roles[peer] === "police");
  const saved = Boolean(target && doctor && kept[doctor] === target);
  const killed = target && !saved ? target : null;
  const checks = [...(game.checks ?? [])];
  if (police && kept[police]) checks.push({ round: game.round, target: kept[police], mafia: isMafia(game, kept[police]) });
  const next: MafiaGame = {
    ...game,
    alive: killed ? game.alive.filter((peer) => peer !== killed) : game.alive,
    lastNight: { round: game.round, killed, saved },
    checks,
    phase: "day",
    endsAt: now + MAFIA_DAY_MS,
  };
  return finish(next, now);
}

function resolveVote(game: MafiaGame, votes: Record<string, string>, now: number): MafiaGame {
  const { counts, top } = tally(validPicks(game, votes));
  const next: MafiaGame = {
    ...game,
    alive: top ? game.alive.filter((peer) => peer !== top) : game.alive,
    lastVote: { round: game.round, out: top, counts },
    phase: "night",
    round: game.round + 1,
    endsAt: now + MAFIA_NIGHT_MS,
  };
  return finish(next, now);
}

/** 밤에 할 일이 있는 사람이 모두 골랐나. */
function nightDone(game: MafiaGame, picks: Record<string, string>, present: Set<string>): boolean {
  const kept = validPicks(game, picks);
  return game.alive.filter((peer) => nightActor(game, peer) && present.has(peer)).every((peer) => kept[peer]);
}

/**
 * 시간이 지난 단계를 넘긴다. picks = 지금 단계(밤 행동 또는 투표)에 들어온 것.
 * 방을 떠난 사람은 바로 빠지고(역할 공개), 그 뒤 승패를 본다.
 */
export function tickMafia(game: MafiaGame, now: number, present: Set<string>, picks: Record<string, string> = {}): MafiaGame {
  let state = game;
  const gone = state.alive.filter((peer) => !present.has(peer));
  if (gone.length && state.phase !== "done") {
    state = finish({ ...state, alive: state.alive.filter((peer) => present.has(peer)), left: [...(state.left ?? []), ...gone] }, now);
  }
  for (let guard = 0; guard < 6 && state.phase !== "done"; guard += 1) {
    if (state.phase === "night") {
      if (now < state.endsAt && !nightDone(state, picks, present)) break;
      state = resolveNight(state, picks, now);
      picks = {};
      continue;
    }
    if (state.phase === "day") {
      if (now < state.endsAt) break;
      state = { ...state, phase: "vote", endsAt: now + MAFIA_VOTE_MS };
      picks = {};
      continue;
    }
    if (state.phase === "vote") {
      const voters = state.alive.filter((peer) => present.has(peer));
      const voted = Object.keys(validPicks(state, picks)).length;
      if (now < state.endsAt && voted < voters.length) break;
      state = resolveVote(state, picks, now);
      picks = {};
    }
  }
  return state;
}

/** 사회자(방장)의 "다음": 낮 이야기를 끝내고 투표로. 밤·투표는 시간이나 모두 고르기로만 넘어간다. */
export function skipMafiaDay(game: MafiaGame, peerId: string, now: number): MafiaGame {
  if (game.phase !== "day" || peerId !== game.moderator) return game;
  return { ...game, phase: "vote", endsAt: now + MAFIA_VOTE_MS };
}

export function mafiaStepKey(game: MafiaGame): string {
  return `${game.phase}:${game.round}`;
}

/** 이 사람에게 보일 판. */
export type MafiaView = {
  kind: "mafia";
  id: string;
  mode: LiarMode;
  moderator: string;
  players: LiarPlayer[];
  alive: string[];
  phase: MafiaPhase;
  round: number;
  endsAt: number;
  me: "player" | "out" | "moderator" | "watcher";
  /** 내 역할(참가자만). */
  role?: MafiaRole;
  /** 나간 사람·끝난 판·사회자에게 보이는 역할. */
  roles: Record<string, MafiaRole>;
  /** 마피아끼리: 같은 편, 밤에 고른 것. */
  team?: string[];
  teamPicks?: Record<string, string>;
  /** 내가 지금 단계에서 고른 것. */
  myPick?: string;
  /** 밤에 고른 사람 수 / 해야 할 사람 수, 투표 수 / 남은 사람 수. */
  acted?: number;
  actors?: number;
  lastNight?: MafiaGame["lastNight"];
  lastVote?: MafiaGame["lastVote"];
  left?: string[];
  checks?: MafiaGame["checks"];
  story?: MafiaStory;
  winner?: MafiaWinner;
};

export function mafiaView(game: MafiaGame, viewer: string, picks: Record<string, string> = {}): MafiaView {
  const playing = game.players.some((player) => player.peerId === viewer);
  const moderator = game.mode === "host" && viewer === game.moderator;
  const me: MafiaView["me"] = moderator ? "moderator" : !playing ? "watcher" : game.alive.includes(viewer) ? "player" : "out";
  const done = game.phase === "done";
  const role = playing ? game.roles[viewer] : undefined;
  const shownRoles: Record<string, MafiaRole> = {};
  for (const player of game.players) {
    const peer = player.peerId;
    if (done || moderator || !game.alive.includes(peer) || peer === viewer || (role === "mafia" && game.roles[peer] === "mafia")) {
      shownRoles[peer] = game.roles[peer];
    }
  }
  const kept = validPicks(game, picks);
  const team = role === "mafia" ? game.players.map((p) => p.peerId).filter((peer) => game.roles[peer] === "mafia") : undefined;
  const teamPicks =
    game.phase === "night" && (role === "mafia" || moderator)
      ? Object.fromEntries(Object.entries(kept).filter(([actor]) => game.roles[actor] === "mafia"))
      : undefined;
  const actors = game.phase === "night" ? game.alive.filter((peer) => nightActor(game, peer)).length : game.phase === "vote" ? game.alive.length : undefined;
  const acted =
    game.phase === "night"
      ? Object.keys(kept).filter((actor) => nightActor(game, actor)).length
      : game.phase === "vote"
        ? Object.keys(kept).length
        : undefined;
  return {
    kind: "mafia",
    id: game.id,
    mode: game.mode,
    moderator: game.moderator,
    players: game.players,
    alive: game.alive,
    phase: game.phase,
    round: game.round,
    endsAt: game.endsAt,
    me,
    ...(role ? { role } : {}),
    roles: shownRoles,
    ...(team ? { team } : {}),
    ...(teamPicks ? { teamPicks } : {}),
    ...(kept[viewer] ? { myPick: kept[viewer] } : {}),
    ...(acted !== undefined ? { acted, actors } : {}),
    ...(game.lastNight ? { lastNight: game.lastNight } : {}),
    ...(game.lastVote ? { lastVote: game.lastVote } : {}),
    ...(game.left?.length ? { left: game.left } : {}),
    ...((role === "police" || moderator || done) && game.checks?.length ? { checks: game.checks } : {}),
    ...(game.story ? { story: game.story } : {}),
    ...(game.winner ? { winner: game.winner } : {}),
  };
}

/** AI가 쓴 배경 이야기 읽기 — 모든 언어가 있어야(하나라도 비면 이야기 없이). */
export function readMafiaStory(raw: unknown, languages: string[]): MafiaStory | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const setting = (row.setting ?? {}) as Record<string, unknown>;
  const intro = (row.intro ?? {}) as Record<string, unknown>;
  const out: MafiaStory = { setting: {}, intro: {} };
  for (const code of languages) {
    const s = typeof setting[code] === "string" ? (setting[code] as string).replace(/\s+/g, " ").trim().slice(0, 40) : "";
    const i = typeof intro[code] === "string" ? (intro[code] as string).replace(/\s+/g, " ").trim().slice(0, 220) : "";
    if (!s || !i) return null;
    out.setting[code] = s;
    out.intro[code] = i;
  }
  return out;
}
