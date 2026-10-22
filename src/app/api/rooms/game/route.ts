import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { requestAuth } from "@/lib/server/premiumRequest";
import { suspendedResponse } from "@/lib/server/suspension";
import { isMember, readMeta, roomMembers, setRoomGame } from "@/lib/server/roomStore";
import { commitStep, currentGame, deleteGame, recentWords, rememberWord, takeGameStart, writeGame, writeVote } from "@/lib/server/roomGameStore";
import { judgeLiarGuess, pickLiarWord } from "@/lib/server/roomGame";
import {
  LIAR_MAX_PLAYERS,
  LIAR_MIN_PLAYERS,
  LIAR_TOPICS,
  MAX_GUESS_CHARS,
  guessLiar,
  guessMatchesWord,
  liarLanguages,
  liarView,
  newLiarGame,
  skipLiarTurn,
  type LiarTopic,
} from "@/lib/rooms/liarGame";
import { cleanText, isPeerId, isRoomId, newRoomId } from "@/lib/rooms/protocol";
import { isLearningLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * 말하는 방 게임(라이어 게임, 2026-10-23). 규칙은 `rooms/liarGame.ts`, 저장·AI는 `server/roomGame.ts`.
 *
 * - start: 방장만. 말하기 자리의 로그인한 사람 3~8명(사회자가 방장이면 방장 빼고). AI가 제시어를 방의 언어들로 고른다
 *   (방장이 사회자면 방장이 쓴 말을 옮기기만). 방장 한 명이 하루 30판.
 * - next: 지금 차례인 사람("다 말했어요") 또는 방장("다음").
 * - vote: 참가자가 다른 참가자 하나에. 다 내면 방 물음이 바로 닫는다.
 * - guess: 뽑힌 라이어가 제시어를 맞힌다(글자로 안 맞으면 AI가 판정).
 * - end: 방장이 판을 치운다.
 * 판은 방 물음(`/api/rooms` poll)이 `game`으로 돌려준다 — 여기 답도 같은 모양.
 */

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const auth = requestAuth(request);
  if (!auth) return bad(request, "SIGNED_OUT", 401);
  const stop = await suspendedResponse(request, auth.accountId);
  if (stop) return stop;
  if (!isRoomId(body.roomId) || !isPeerId(body.peerId)) return bad(request, "BAD_ROOM");
  const roomId = body.roomId;
  const peerId = body.peerId;
  const me = await isMember(roomId, peerId);
  if (!me || me.accountId !== auth.accountId) return bad(request, "NOT_IN_ROOM", 404);
  const meta = await readMeta(roomId);
  if (!meta) return bad(request, "NO_ROOM", 404);
  const isHost = meta.hostPeerId === peerId;
  const action = body.action;

  if (action === "start") {
    if (!isHost) return bad(request, "NOT_HOST", 403);
    if (meta.random || meta.video) return bad(request, "NO_GAME_HERE", 409);
    const mode = body.mode === "host" ? "host" : "ai";
    const topic: LiarTopic = (LIAR_TOPICS as readonly string[]).includes(body.topic as string) ? (body.topic as LiarTopic) : "random";
    const laps = body.laps === 2 ? 2 : 1;
    const seed = mode === "host" ? cleanText(body.word, 40) : "";
    const members = await roomMembers(roomId);
    const players = members
      .filter((member) => member.role === "speaker" && member.accountId && !member.textOnly)
      .filter((member) => !(mode === "host" && member.peerId === peerId))
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .slice(0, LIAR_MAX_PLAYERS);
    if (players.length < LIAR_MIN_PLAYERS) return jsonWithCors(request, { error: "NOT_ENOUGH", need: LIAR_MIN_PLAYERS }, { status: 409 });
    const openai = getOpenAIClient();
    if (!openai) return bad(request, "NO_AI", 503);
    if (!(await takeGameStart(auth.accountId))) return bad(request, "GAME_LIMIT", 429);
    const languages = liarLanguages(
      meta.languages,
      [...players, ...(mode === "host" ? [me] : [])].map((member) => member.langs),
      isLearningLanguageCode,
    );
    if (!languages.length) languages.push("en");
    void meterRequest(request, "roomGameWord");
    const pick = await pickLiarWord(openai, { topic, languages, avoid: await recentWords(roomId), ...(seed ? { seed } : {}) });
    if (!pick) return bad(request, "WORD_FAILED", 502);
    const game = newLiarGame({
      id: newRoomId(),
      mode,
      moderator: peerId,
      players: players.map((member) => ({ peerId: member.peerId, accountId: member.accountId ?? null, nickname: member.nickname })),
      topic,
      topicNames: pick.topicNames,
      words: pick.words,
      laps,
      now: Date.now(),
    });
    await writeGame(roomId, game);
    await setRoomGame(roomId, game.id);
    await rememberWord(roomId, pick.english);
    return jsonWithCors(request, { game: liarView(game, peerId) });
  }

  if (action === "end") {
    if (!isHost) return bad(request, "NOT_HOST", 403);
    await setRoomGame(roomId, null);
    await deleteGame(roomId);
    return jsonWithCors(request, { game: null });
  }

  if (!meta.game) return bad(request, "NO_GAME", 404);
  const present = new Set((await roomMembers(roomId)).map((member) => member.peerId));
  const found = await currentGame(roomId, meta.game, present);
  if (!found) return bad(request, "NO_GAME", 404);
  let game = found.game;
  let votes = found.votes;
  const now = Date.now();

  if (action === "next") {
    game = await commitStep(roomId, game, skipLiarTurn(game, peerId, now));
  } else if (action === "vote") {
    const target = body.target;
    if (game.phase !== "vote") return bad(request, "NOT_VOTING", 409);
    if (!game.players.some((player) => player.peerId === peerId)) return bad(request, "NOT_PLAYING", 403);
    if (typeof target !== "string" || target === peerId || !game.players.some((player) => player.peerId === target)) return bad(request, "BAD_TARGET");
    await writeVote(roomId, game, peerId, target);
    votes = { ...votes, [peerId]: target };
    const again = await currentGame(roomId, game.id, present);
    if (again) {
      game = again.game;
      votes = again.game.phase === "vote" ? { ...again.votes, [peerId]: target } : {};
    }
  } else if (action === "guess") {
    if (game.phase !== "guess" || game.liar !== peerId) return bad(request, "NOT_GUESSING", 409);
    const guess = cleanText(body.text, MAX_GUESS_CHARS);
    if (!guess) return bad(request, "NO_TEXT");
    let correct = guessMatchesWord(guess, game.words);
    if (!correct) {
      const openai = getOpenAIClient();
      if (openai) {
        void meterRequest(request, "roomGameJudge");
        correct = await judgeLiarGuess(openai, { guess, words: game.words });
      }
    }
    game = await commitStep(roomId, game, guessLiar(game, peerId, guess, correct, Date.now()));
  } else {
    return bad(request, "UNKNOWN_ACTION");
  }
  return jsonWithCors(request, { game: liarView(game, peerId, game.phase === "vote" ? votes : {}) });
}
