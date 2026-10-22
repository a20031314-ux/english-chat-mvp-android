"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import { LIAR_TOPICS, MAX_GUESS_CHARS, pickWord, type LiarMode, type LiarTopic, type LiarView } from "@/lib/rooms/liarGame";
import { Face } from "./RoomParts";

/**
 * 말하는 방 라이어 게임 화면(2026-10-23). 규칙·진행은 서버(`api/rooms/game`, `rooms/liarGame.ts`),
 * 여기는 시작 창(방장)과 방 위쪽의 판 카드(내 제시어·차례·투표·결과)만. 설명은 자막으로 그냥 말하면 된다.
 * 화면에는 이름·상태·버튼만(hub/RULES.md 4번) — 규칙 설명은 사용법(?) Room 장.
 */

const TOPIC_LABEL: Record<LiarTopic, keyof RoomCopy> = {
  random: "gameTopicRandom",
  food: "gameTopicFood",
  animal: "gameTopicAnimal",
  place: "gameTopicPlace",
  job: "gameTopicJob",
  thing: "gameTopicThing",
  sport: "gameTopicSport",
  hobby: "gameTopicHobby",
};

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

export type GameStart = { mode: LiarMode; topic: LiarTopic; laps: 1 | 2; word?: string };

export function GameStartSheet({
  t,
  busy,
  error,
  onStart,
  onClose,
}: {
  t: RoomCopy;
  busy: boolean;
  error: string;
  onStart: (start: GameStart) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<LiarMode>("ai");
  const [topic, setTopic] = useState<LiarTopic>("random");
  const [laps, setLaps] = useState<1 | 2>(1);
  const [word, setWord] = useState("");
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${on ? "border-emerald-300/60 bg-emerald-300/15 text-white" : "border-white/15 text-slate-300"}`;
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60" onClick={onClose}>
        <div
          className="max-h-[80vh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-base font-semibold text-white">🎭 {t.gameLiar}</p>
          <div>
            <p className="mb-1 text-meta text-slate-400">{t.gameHostLabel}</p>
            <div className="flex gap-2">
              {(["ai", "host"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={mode === option} onClick={() => setMode(option)} className={chip(mode === option)}>
                  {option === "ai" ? `🤖 ${t.gameHostAi}` : `👑 ${t.gameHostMe}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-meta text-slate-400">{t.gameTopic}</p>
            <div className="flex flex-wrap gap-1.5">
              {LIAR_TOPICS.map((option) => (
                <button key={option} type="button" aria-pressed={topic === option} onClick={() => setTopic(option)} className={chip(topic === option)}>
                  {t[TOPIC_LABEL[option]]}
                </button>
              ))}
            </div>
          </div>
          {mode === "host" ? (
            <label className="block">
              <span className="mb-1 block text-meta text-slate-400">{t.gameWord}</span>
              <input
                value={word}
                onChange={(event) => setWord(event.target.value.slice(0, 40))}
                placeholder={t.gameWordAuto}
                dir="auto"
                className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </label>
          ) : null}
          <div>
            <p className="mb-1 text-meta text-slate-400">{t.gameLaps}</p>
            <div className="flex gap-2">
              {([1, 2] as const).map((option) => (
                <button key={option} type="button" aria-pressed={laps === option} onClick={() => setLaps(option)} className={chip(laps === option)}>
                  {option === 1 ? t.gameLap1 : t.gameLap2}
                </button>
              ))}
            </div>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => onStart({ mode, topic, laps, ...(mode === "host" && word.trim() ? { word: word.trim() } : {}) })}
            className="w-full rounded-xl bg-emerald-400/90 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {busy ? t.gameStarting : t.gameStart}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}

/** 남은 초(서버 시계 기준). */
function useSecondsLeft(endsAt: number, offsetMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);
  return Math.max(0, Math.ceil((endsAt - (now + offsetMs)) / 1000));
}

export function GamePanel({
  t,
  game,
  selfId,
  isHost,
  locale,
  targetLanguage,
  offsetMs,
  busy,
  onNext,
  onVote,
  onGuess,
  onAgain,
  onEnd,
  onClose,
}: {
  t: RoomCopy;
  game: LiarView;
  selfId: string;
  isHost: boolean;
  locale: string;
  targetLanguage: string;
  offsetMs: number;
  busy: boolean;
  onNext: () => void;
  onVote: (target: string) => void;
  onGuess: (text: string) => void;
  onAgain: () => void;
  onEnd: () => void;
  onClose: () => void;
}) {
  const [guess, setGuess] = useState("");
  const left = useSecondsLeft(game.endsAt, offsetMs);
  const name = (peerId: string | null | undefined) =>
    peerId === selfId ? t.you2 : (game.players.find((player) => player.peerId === peerId)?.nickname ?? "");
  const word = pickWord(game.words, targetLanguage, locale);
  const wordHelp = pickWord(game.words, locale);
  const topic = pickWord(game.topicNames, targetLanguage, locale);
  const topicHelp = pickWord(game.topicNames, locale);
  const playing = game.me === "player" || game.me === "liar";
  const done = game.phase === "done";
  const counts: Record<string, number> = {};
  for (const target of Object.values(game.votes ?? {})) counts[target] = (counts[target] ?? 0) + 1;

  let result = "";
  if (done) {
    if (game.reason === "tie") result = t.gameTie;
    else if (game.reason === "escaped") result = fill(t.gameWrongPick, { name: name(game.accused) });
    else if (game.reason === "guessed") result = fill(t.gameGuessed, { guess: game.guess ?? "" });
    else if (game.reason === "caught") result = fill(t.gameMissed, { guess: game.guess ?? "" });
    else if (game.reason === "missed") result = t.gameNoGuess;
    else if (game.reason === "liarLeft") result = t.gameLiarLeft;
  }

  return (
    <section className="mt-2 rounded-xl border border-emerald-300/30 bg-emerald-300/5 px-3 py-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-meta font-medium text-emerald-200">
          🎭 {t.gameLiar}
          {game.mode === "host" ? ` · 👑 ${t.gameHostLabel}` : ` · 🤖 ${t.gameHostLabel}`}
        </p>
        {!done ? <span className="shrink-0 text-meta tabular-nums text-slate-300">{left}s</span> : null}
        {done && !isHost ? (
          <button type="button" onClick={onClose} aria-label={t.gameClose} className="shrink-0 rounded-lg px-1.5 text-sm text-slate-400 hover:bg-white/10">
            ×
          </button>
        ) : null}
      </div>

      {/* 내 카드: 제시어 / 라이어 / 사회자(다 봄) / 구경 */}
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-meta text-slate-400" dir="auto">
          {t.gameTopic}: {topic}
          {topicHelp && topicHelp !== topic ? ` (${topicHelp})` : ""}
        </span>
        {game.me === "liar" && !done ? <span className="text-chat font-semibold text-rose-200">🤫 {t.gameYouLiar}</span> : null}
        {game.me === "watcher" && !done ? <span className="text-meta text-slate-400">{t.gameWatching}</span> : null}
        {word && (game.me !== "liar" || done) ? (
          <span className="text-chat font-semibold text-white" dir="auto">
            {fill(t.gameWordIs, { word })}
            {wordHelp && wordHelp !== word ? <span className="ms-1 text-sm font-normal text-slate-300">({wordHelp})</span> : null}
          </span>
        ) : null}
        {game.liar && (game.me === "moderator" || done) ? (
          <span className="text-sm text-rose-200" dir="auto">
            {fill(t.gameLiarIs, { name: name(game.liar) })}
          </span>
        ) : null}
      </div>

      {game.phase === "clue" ? (
        <div className="mt-1.5 flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm text-white" dir="auto">
            🎤 {game.current === selfId ? t.gameMyTurn : fill(t.gameTurn, { name: name(game.current) })}
            <span className="ms-1 text-meta text-slate-400">
              {(game.turn % Math.max(1, game.players.length)) + 1}/{game.players.length}
              {game.laps === 2 ? ` · ${Math.floor(game.turn / Math.max(1, game.players.length)) + 1}/2` : ""}
            </span>
          </p>
          {game.current === selfId ? (
            <button type="button" disabled={busy} onClick={onNext} className="shrink-0 rounded-lg bg-emerald-400/90 px-3 py-1 text-sm font-medium text-black disabled:opacity-60">
              {t.gameSaid}
            </button>
          ) : isHost ? (
            <button type="button" disabled={busy} onClick={onNext} className="shrink-0 rounded-lg border border-white/20 px-3 py-1 text-sm text-slate-200 disabled:opacity-60">
              {t.gameNext}
            </button>
          ) : null}
        </div>
      ) : null}

      {game.phase === "vote" ? (
        <div className="mt-1.5">
          <p className="text-sm text-white">
            🗳 {t.gameVoteTitle} <span className="text-meta text-slate-400">{fill(t.gameVoted, { n: game.voted ?? 0, m: game.players.length })}</span>
          </p>
          {playing ? (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {game.players
                .filter((player) => player.peerId !== selfId)
                .map((player) => (
                  <li key={player.peerId}>
                    <button
                      type="button"
                      disabled={busy}
                      aria-pressed={game.myVote === player.peerId}
                      onClick={() => onVote(player.peerId)}
                      className={`flex items-center gap-1.5 rounded-full border py-0.5 pe-2.5 ps-0.5 text-sm ${
                        game.myVote === player.peerId ? "border-rose-300/70 bg-rose-300/15 text-white" : "border-white/15 text-slate-200"
                      }`}
                    >
                      <Face accountId={player.accountId} name={player.nickname} size={22} />
                      <span dir="auto">{player.nickname}</span>
                    </button>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {game.phase === "guess" ? (
        game.me === "liar" ? (
          <form
            className="mt-1.5 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (guess.trim()) onGuess(guess.trim());
            }}
          >
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value.slice(0, MAX_GUESS_CHARS))}
              placeholder={t.gameGuessTitle}
              aria-label={t.gameGuessTitle}
              dir="auto"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white placeholder:text-slate-500"
            />
            <button type="submit" disabled={busy || !guess.trim()} className="shrink-0 rounded-xl bg-emerald-400/90 px-3 py-1.5 text-sm font-medium text-black disabled:opacity-50">
              {t.gameGuessSend}
            </button>
          </form>
        ) : (
          <p className="mt-1.5 text-sm text-white" dir="auto">
            🤔 {fill(t.gameGuessing, { name: name(game.liar) })}
          </p>
        )
      ) : null}

      {done ? (
        <div className="mt-1.5 space-y-1">
          {game.winner ? (
            <p className={`text-base font-semibold ${game.winner === "liar" ? "text-rose-200" : "text-emerald-200"}`}>
              {game.winner === "liar" ? `🤫 ${t.gameLiarWins}` : `🎉 ${t.gamePlayersWin}`}
            </p>
          ) : null}
          {result ? (
            <p className="text-sm text-slate-200" dir="auto">
              {result}
            </p>
          ) : null}
          {Object.keys(counts).length ? (
            <p className="text-meta text-slate-400" dir="auto">
              🗳{" "}
              {Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([target, count]) => `${name(target)} ${fill(t.gameVotes, { n: count })}`)
                .join(" · ")}
            </p>
          ) : null}
          {isHost ? (
            <div className="flex gap-2 pt-0.5">
              <button type="button" disabled={busy} onClick={onAgain} className="flex-1 rounded-lg bg-emerald-400/90 px-3 py-1.5 text-sm font-medium text-black disabled:opacity-60">
                {t.gameAgain}
              </button>
              <button type="button" disabled={busy} onClick={onEnd} className="flex-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200 disabled:opacity-60">
                {t.gameEnd}
              </button>
            </div>
          ) : null}
        </div>
      ) : isHost ? (
        <div className="mt-1 text-end">
          <button type="button" disabled={busy} onClick={onEnd} className="text-meta text-slate-400 underline-offset-2 hover:underline disabled:opacity-60">
            {t.gameEnd}
          </button>
        </div>
      ) : null}
    </section>
  );
}
