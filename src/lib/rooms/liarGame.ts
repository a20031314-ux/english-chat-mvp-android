import type { SpectatorResult, WatchView } from "./spectators.ts";

/**
 * 말하는 방 라이어 게임(2026-10-23, 사용자 요청 "룸에 라이어게임·마피아 같은 재미, 사회자는 AI나 방장").
 *
 * 규칙은 전부 여기(순수 함수) — AI는 제시어를 고르고 라이어의 답을 판정할 때만 부른다(server/roomGame.ts).
 * 역할·차례·시간·투표 세기·승패를 AI에게 맡기면 틀리거나 바뀔 수 있어서다.
 *
 * 한 판: 말하기 자리에 있는 사람(사회자가 방장이면 방장 빼고)이 차례대로 배우는 언어로 제시어를 설명(그냥 말하면 자막에 남음)
 * → 다 돌면 투표 → 가장 많이 받은 사람이 라이어면 라이어가 제시어 맞히기(맞히면 라이어 승) → 결과.
 * 표가 갈리거나 엉뚱한 사람이 뽑히면 라이어 승. 시간은 서버 시계로, 지난 단계는 누가 묻든(방 물음·게임 동작) `tickLiar`가 넘긴다.
 */

export const LIAR_MIN_PLAYERS = 3;
export const LIAR_MAX_PLAYERS = 8;
export const LIAR_CLUE_MS = 40_000;
export const LIAR_VOTE_MS = 45_000;
export const LIAR_GUESS_MS = 45_000;
/** 제시어를 보여 줄 언어 수(방 언어 먼저, 그다음 사람들의 배우는 언어·앱 언어). */
export const LIAR_MAX_LANGUAGES = 6;
export const MAX_GUESS_CHARS = 60;

export const LIAR_TOPICS = ["random", "food", "animal", "place", "job", "thing", "sport", "hobby"] as const;
export type LiarTopic = (typeof LIAR_TOPICS)[number];

export type LiarPlayer = { peerId: string; accountId: string | null; nickname: string };
export type LiarPhase = "clue" | "vote" | "guess" | "done";
/** ai = 진행은 서버, 제시어는 AI, 방장도 참가 / host = 방장이 사회자(제시어·라이어를 보고, 참가하지 않음). */
export type LiarMode = "ai" | "host";
export type LiarReason = "caught" | "escaped" | "tie" | "guessed" | "missed" | "liarLeft";

export type LiarGame = {
  v: 1;
  kind?: "liar";
  id: string;
  mode: LiarMode;
  /** 시작한 방장(다음 차례·끝내기·한 판 더). */
  moderator: string;
  /** 차례 순서. */
  players: LiarPlayer[];
  liar: string;
  topic: LiarTopic;
  /** 언어 코드 → 주제 이름(AI가 고른 실제 주제, 모두에게 보임). */
  topicNames: Record<string, string>;
  /** 언어 코드 → 제시어(라이어에게는 안 보임). */
  words: Record<string, string>;
  laps: 1 | 2;
  phase: LiarPhase;
  /** 설명 차례: 0 … players × laps − 1. */
  turn: number;
  /** 지금 단계가 끝나는 때(서버 시계). */
  endsAt: number;
  startedAt: number;
  /** 투표를 닫은 뒤의 표(누가 → 누구). */
  votes?: Record<string, string>;
  accused?: string | null;
  guess?: string;
  winner?: "liar" | "players";
  reason?: LiarReason;
  /** 판이 끝난 뒤 관전자 추리 결과(rooms/spectators.ts). */
  spectatorResult?: SpectatorResult;
};

export function liarCurrent(game: LiarGame): LiarPlayer | null {
  if (game.phase !== "clue" || !game.players.length) return null;
  return game.players[game.turn % game.players.length] ?? null;
}

export function newLiarGame(input: {
  id: string;
  mode: LiarMode;
  moderator: string;
  players: LiarPlayer[];
  topic: LiarTopic;
  topicNames: Record<string, string>;
  words: Record<string, string>;
  laps: 1 | 2;
  now: number;
  /** 0 이상 1 미만 난수 두 개(순서 섞기·라이어 고르기) — 시험에서 고정하려고 밖에서 받는다. */
  random?: () => number;
}): LiarGame {
  const random = input.random ?? Math.random;
  const players = [...input.players];
  for (let i = players.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }
  const liar = players[Math.floor(random() * players.length)]?.peerId ?? "";
  return {
    v: 1,
    kind: "liar",
    id: input.id,
    mode: input.mode,
    moderator: input.moderator,
    players,
    liar,
    topic: input.topic,
    topicNames: input.topicNames,
    words: input.words,
    laps: input.laps,
    phase: "clue",
    turn: 0,
    endsAt: input.now + LIAR_CLUE_MS,
    startedAt: input.now,
  };
}

function nextTurn(game: LiarGame, now: number): LiarGame {
  const turn = game.turn + 1;
  if (turn >= game.players.length * game.laps) return { ...game, turn, phase: "vote", endsAt: now + LIAR_VOTE_MS };
  return { ...game, turn, endsAt: now + LIAR_CLUE_MS };
}

/** 표를 센다. 한 사람에게 가장 많이 모였을 때만 그 사람(같으면 null). 자기 자신·게임 밖 사람에게 준 표는 버린다. */
export function tallyVotes(game: LiarGame, votes: Record<string, string>): { counts: Record<string, number>; top: string | null } {
  const inGame = new Set(game.players.map((player) => player.peerId));
  const counts: Record<string, number> = {};
  for (const [voter, target] of Object.entries(votes)) {
    if (!inGame.has(voter) || !inGame.has(target) || voter === target) continue;
    counts[target] = (counts[target] ?? 0) + 1;
  }
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

function cleanVotes(game: LiarGame, votes: Record<string, string>): Record<string, string> {
  const inGame = new Set(game.players.map((player) => player.peerId));
  return Object.fromEntries(Object.entries(votes).filter(([voter, target]) => inGame.has(voter) && inGame.has(target) && voter !== target));
}

function closeVote(game: LiarGame, votes: Record<string, string>, now: number): LiarGame {
  const kept = cleanVotes(game, votes);
  const { top } = tallyVotes(game, kept);
  if (!top) return { ...game, phase: "done", votes: kept, accused: null, winner: "liar", reason: "tie", endsAt: now };
  if (top === game.liar) return { ...game, phase: "guess", votes: kept, accused: top, endsAt: now + LIAR_GUESS_MS };
  return { ...game, phase: "done", votes: kept, accused: top, winner: "liar", reason: "escaped", endsAt: now };
}

/**
 * 시간이 지난 단계를 넘긴다. present = 지금 방에 있는 사람, votes = 지금까지 들어온 표(투표 중일 때만 의미).
 * 방에 없는 사람의 차례는 바로 건너뛰고, 라이어가 나가면 끝. 투표는 방에 있는 참가자가 모두 내면 바로 닫는다.
 */
export function tickLiar(game: LiarGame, now: number, present: Set<string>, votes: Record<string, string> = {}): LiarGame {
  let state = game;
  for (let guard = 0; guard < 40 && state.phase !== "done"; guard += 1) {
    if (!present.has(state.liar)) return { ...state, phase: "done", reason: "liarLeft", endsAt: now };
    if (state.phase === "clue") {
      const current = liarCurrent(state);
      if (current && present.has(current.peerId) && now < state.endsAt) break;
      state = nextTurn(state, now);
      continue;
    }
    if (state.phase === "vote") {
      const voters = state.players.filter((player) => present.has(player.peerId));
      const voted = voters.filter((player) => votes[player.peerId]).length;
      if (now < state.endsAt && voted < voters.length) break;
      state = closeVote(state, votes, now);
      continue;
    }
    if (state.phase === "guess") {
      if (now < state.endsAt) break;
      state = { ...state, phase: "done", winner: "players", reason: "missed", endsAt: now };
    }
  }
  return state;
}

/** "다 말했어요"(지금 차례인 사람) 또는 "다음"(사회자). 그 밖에는 그대로. */
export function skipLiarTurn(game: LiarGame, peerId: string, now: number): LiarGame {
  const current = liarCurrent(game);
  if (!current || (current.peerId !== peerId && game.moderator !== peerId)) return game;
  return nextTurn(game, now);
}

/** 라이어가 낸 답. correct는 서버가 판정(글자 비교 → 아니면 AI). */
export function guessLiar(game: LiarGame, peerId: string, guess: string, correct: boolean, now: number): LiarGame {
  if (game.phase !== "guess" || peerId !== game.liar) return game;
  return { ...game, phase: "done", guess, winner: correct ? "liar" : "players", reason: correct ? "guessed" : "caught", endsAt: now };
}

/** 이 단계·차례에서 한 번만 넘기기 위한 이름(서버가 SET NX 잠금 키로 쓴다). */
export function liarStepKey(game: LiarGame): string {
  return `${game.phase}:${game.turn}`;
}


/** 글자만 비교: 대소문자·문장부호·띄어쓰기·영어 관사를 빼고 같거나, 한쪽이 다른 쪽을 품으면(“an apple” ↔ “apple”). */
export function normalizeGuess(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/^(the|an?|el|la|los|las|un|una|le|les|une|il|lo|gli|o|os|as|um|uma)\s+/u, "")
    .replace(/[\p{P}\p{S}\s]+/gu, "");
}

export function guessMatchesWord(guess: string, words: Record<string, string>): boolean {
  const said = normalizeGuess(guess);
  if (!said) return false;
  return Object.values(words).some((word) => {
    const target = normalizeGuess(word);
    if (!target) return false;
    if (said === target) return true;
    // 짧은 낱말끼리 포함은 오판이 쉬워(“cat” ⊂ “catalog”) 두 글자 넘게 차이 나면 인정하지 않는다.
    return (said.includes(target) || target.includes(said)) && Math.abs(said.length - target.length) <= 2 && Math.min(said.length, target.length) >= 2;
  });
}

/** 제시어를 보여 줄 언어: 방 언어 → 사람들의 [배우는 언어, 앱 언어] 순서, 겹치지 않게 최대 LIAR_MAX_LANGUAGES. */
export function liarLanguages(roomLanguages: string[], memberLangs: (string[] | undefined)[], isLanguage: (code: string) => boolean): string[] {
  const out: string[] = [];
  const add = (code: string | undefined) => {
    if (code && isLanguage(code) && !out.includes(code) && out.length < LIAR_MAX_LANGUAGES) out.push(code);
  };
  roomLanguages.forEach(add);
  for (const langs of memberLangs) add(langs?.[0]);
  for (const langs of memberLangs) add(langs?.[1]);
  return out;
}

/** 이 사람에게 보여 줄 게임(라이어·제시어는 보면 안 되는 사람에게 빼고). */
export type LiarView = {
  kind: "liar";
  id: string;
  mode: LiarMode;
  moderator: string;
  players: LiarPlayer[];
  topic: LiarTopic;
  topicNames: Record<string, string>;
  laps: 1 | 2;
  phase: LiarPhase;
  turn: number;
  endsAt: number;
  current: string | null;
  /** 나: 라이어·참가자·사회자(방장이 사회자일 때)·구경(말하기 자리에 없었음). */
  me: "liar" | "player" | "moderator" | "watcher";
  words?: Record<string, string>;
  liar?: string;
  /** 투표 중: 낸 사람 수와 내 표. */
  voted?: number;
  myVote?: string;
  votes?: Record<string, string>;
  accused?: string | null;
  guess?: string;
  winner?: "liar" | "players";
  reason?: LiarReason;
  /** 관전자 추리(방 물음이 붙임). */
  watch?: WatchView;
};

export function liarView(game: LiarGame, viewer: string, votes: Record<string, string> = {}): LiarView {
  const playing = game.players.some((player) => player.peerId === viewer);
  const me: LiarView["me"] = game.mode === "host" && viewer === game.moderator ? "moderator" : !playing ? "watcher" : viewer === game.liar ? "liar" : "player";
  const done = game.phase === "done";
  const seesWord = done || me === "player" || me === "moderator";
  const seesLiar = done || me === "moderator" || game.phase === "guess";
  return {
    kind: "liar",
    id: game.id,
    mode: game.mode,
    moderator: game.moderator,
    players: game.players,
    topic: game.topic,
    topicNames: game.topicNames,
    laps: game.laps,
    phase: game.phase,
    turn: game.turn,
    endsAt: game.endsAt,
    current: liarCurrent(game)?.peerId ?? null,
    me,
    ...(seesWord ? { words: game.words } : {}),
    ...(seesLiar ? { liar: game.liar } : {}),
    ...(game.phase === "vote" ? { voted: Object.keys(cleanVotes(game, votes)).length, ...(votes[viewer] ? { myVote: votes[viewer] } : {}) } : {}),
    ...(game.votes && (done || game.phase === "guess") ? { votes: game.votes } : {}),
    ...(game.accused !== undefined ? { accused: game.accused } : {}),
    ...(game.guess !== undefined && done ? { guess: game.guess } : {}),
    ...(game.winner ? { winner: game.winner } : {}),
    ...(game.reason ? { reason: game.reason } : {}),
  };
}

/** 화면에 보일 말: 배우는 언어 먼저, 없으면 앱 언어, 그것도 없으면 처음 것. */
export function pickWord(words: Record<string, string> | undefined, ...order: string[]): string {
  if (!words) return "";
  for (const code of order) if (words[code]) return words[code];
  return Object.values(words)[0] ?? "";
}

/* AI가 고른 제시어 읽기(server/roomGame.ts가 부름) — 모든 언어가 채워졌을 때만. */

export type LiarWordPick = { topicNames: Record<string, string>; words: Record<string, string>; english: string };

function cleanEntry(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, 40) : "";
}

/** AI의 답에서 모든 언어가 채워졌는지 보고 고른다(하나라도 비면 null). */
export function readWordPick(raw: unknown, languages: string[]): LiarWordPick | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const topic = (row.topic ?? {}) as Record<string, unknown>;
  const word = (row.word ?? {}) as Record<string, unknown>;
  const topicNames: Record<string, string> = {};
  const words: Record<string, string> = {};
  for (const code of languages) {
    const t = cleanEntry(topic[code]);
    const w = cleanEntry(word[code]);
    if (!t || !w) return null;
    topicNames[code] = t;
    words[code] = w;
  }
  const english = cleanEntry(row.english) || words.en || Object.values(words)[0] || "";
  return { topicNames, words, english };
}

