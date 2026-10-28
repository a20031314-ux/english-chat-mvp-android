"use client";

import { useEffect, useRef, useState } from "react";
import { TTSButton } from "@/components/TTSButton";
import { LedgerLinks } from "@/components/LedgerLinks";
import { CorrectionChip, LineTools } from "@/components/conversation/LineTools";
import { readCorrectionView } from "@/lib/correctionView";
import { compareToTarget, type WordOutcome } from "@/lib/roleplay/practice";
import type { Practice } from "@/lib/roleplay/practice";
import type { Review, StuckTurn, TranscriptLine } from "@/lib/roleplay/review";
import type { UICopy } from "@/lib/copy";

/**
 * Looking back at a turn: the button that offers it, and the panel it opens.
 *
 * Both halves live here because they are one decision. The scene is never
 * stopped for the learner; it is offered, on the turn it happened, and they
 * take it or they do not. Everything about the shape of these two follows from
 * that — see roleplay/review.ts for the reasoning and RoleplayScreen for the
 * microphone the panel closes on its way in.
 *
 * Kept out of RoleplayScreen so it can be looked at without a microphone and
 * without spending a turn: /dev/roleplay-review renders exactly these.
 */

/** A line of the transcript, with the offer on it when the turn was a struggle. */
export type { TranscriptLine } from "@/lib/roleplay/review";

export function RoleplayLine({
  line,
  ui,
  onReview,
  onTranslate,
  onAnalyze,
  onSayAgain,
  showTranslation,
  ledgerLanguage,
}: {
  line: TranscriptLine;
  ui: UICopy;
  onReview: (turn: StuckTurn) => void;
  /** Ask for the gloss of a line that has none. Absent where nothing can. */
  onTranslate?: (text: string) => void;
  /**
   * Open the line in the sentence sheet, where it can be taken apart and asked
   * about. Only given where no microphone is open — a finished scene or one
   * read back — so a question typed there can never land as a spoken turn.
   */
  onAnalyze?: (text: string) => void;
  /**
   * Say one of their own lines again and hear which words came through — the
   * corrected one when there is a correction, since that is the one to learn.
   * Only where no call microphone is open: a finished scene, or one read back.
   */
  onSayAgain?: (target: string) => Promise<{ heard: string; practice: Practice | null }>;
  /**
   * Whether the character's translations are on show. Off, a line keeps its
   * translation folded until it is tapped — the learner listens first and
   * reads only what they need. Absent means on, as read-back has always been.
   */
  showTranslation?: boolean;
  /** The language spoken, to connect the line to the ledger. Absent: no links. */
  ledgerLanguage?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const translationShown = showTranslation !== false || revealed;
  // 줄을 누르면 할 일 한 줄(conversation/LineTools) — 채팅·1:1과 같은 문법(2026-10-23).
  const [toolsOpen, setToolsOpen] = useState(false);
  // 고친 문장은 채팅과 같은 설정(눌러서 보기 / 바로 보기, lib/correctionView.ts)을 따른다.
  const [fixOpen, setFixOpen] = useState(() => readCorrectionView() === "auto");
  const hasFix = Boolean(line.better || line.meant || line.about);
  const tapLine = () => {
    setToolsOpen((open) => !open);
    if (line.who === "tutor" && !translationShown) {
      setRevealed(true);
      if (!line.translation) onTranslate?.(line.text);
    }
  };
  const [sayingAgain, setSayingAgain] = useState(false);
  const againRef = useRef<HTMLDivElement>(null);
  const sayTarget = (line.meant || line.better || line.text).trim();
  const canSayAgain = Boolean(onSayAgain && line.who === "learner" && sayTarget && sayTarget !== "…");
  return (
    <li className={`mb-2 flex ${line.who === "learner" ? "justify-end" : "justify-start"}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={toolsOpen}
        onClick={tapLine}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          tapLine();
        }}
        className={`max-w-[80%] cursor-pointer rounded-2xl px-3 py-2 ${
          line.who === "learner"
            ? "bg-white/10 text-neutral-200"
            : "bg-[#141414] text-neutral-100"
        }`}
      >
        {/* Tapping a line the character wrote asks for its gloss. Written
            lines arrive without one on purpose: the answer is spoken as soon as
            the words exist, and a translation nobody has asked to read should
            not be standing between them and the sound.
 
            It has to look tappable, which it did not. This was a button drawn
            exactly like the paragraph beside it, so the offer existed and
            nobody could see it — reported from a Japanese conversation, where
            every line after the greeting is written rather than picked from the
            bank and so every line after the greeting appeared to have lost its
            translation. In English the bank's own glosses covered most lines
            and hid the problem. A dotted underline says there is more here
            without needing a word in fourteen languages to say it. */}
        {/* 말한 글은 학습 언어 그대로의 방향(아랍어 앱에서도 "Hi!"가 "!Hi"가 되지 않게). 번역이 접혀 있는 튜터 줄은 점선 —
            누르면 펼쳐진다는 표시(글자 없이, 14개 언어 문구 없이). */}
        <p
          dir="auto"
          className={`text-[14px] leading-snug ${
            line.who === "tutor" && !translationShown
              ? "decoration-dotted decoration-neutral-500 underline-offset-4 [text-decoration-line:underline]"
              : ""
          }`}
        >
          {line.text}
          {/* 받아쓰기가 확신이 낮은 내 말: 끝에 "?" 하나, 누르면 한 줄 설명. */}
          {line.who === "learner" && line.unsure ? <UnsureMark text={ui.heardUnsure} /> : null}
        </p>
        {line.translation && translationShown ? (
          <p className="mt-1 text-[12px] text-neutral-500">{line.translation}</p>
        ) : null}
        {/* Help for the moment they were stuck in: marked as help, so it is
            not read as what the line means. */}
        {line.tip ? (
          <div className="mt-1.5 rounded-lg border border-amber-300/30 bg-amber-300/10 px-2 py-1.5">
            <p className="text-[10px] font-medium text-amber-200">{ui.roleplayTip}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-amber-50">{line.tip}</p>
          </div>
        ) : null}
        {/* Read in the seconds after they stop talking, while they wait to be
            answered — the one moment in a spoken turn when their eyes are free.
            Never said aloud; the character does not know it is here. */}
        {hasFix && !fixOpen ? (
          <CorrectionChip label={ui.chatCorrectionChip} onOpen={() => setFixOpen(true)} tone="dark" />
        ) : null}
        {hasFix && fixOpen ? (
          <div onClick={(event) => event.stopPropagation()} className="mt-1.5 border-t border-white/10 pt-1.5">
            {/* What they were trying to say, when what came out was too
                broken to just put right. Asked, not told: they know what they
                meant, and it can be heard and said again. */}
            {line.meant ? (
              <>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {ui.roleplayMeant}
                </p>
                <div className="mt-0.5 flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-[13px] leading-snug text-emerald-200">
                    {line.meant}
                  </p>
                  <TTSButton text={line.meant} className="shrink-0" />
                </div>
              </>
            ) : null}
            {line.better ? (
              <>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {ui.roleplayBetter}
                </p>
                <p dir="auto" className="mt-0.5 text-[13px] leading-snug text-emerald-200">
                  {line.better}
                </p>
              </>
            ) : null}
            {line.about ? (
              <p
                className={`text-[12px] leading-snug text-neutral-400 ${
                  line.better ? "mt-1" : ""
                }`}
              >
                {line.about}
              </p>
            ) : null}
          </div>
        ) : null}
        {/* Stays on the turn for the rest of the scene. Pressing it is a
            decision the learner can take later, when they are not in the
            middle of being asked to speak. */}
        {line.stuck ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onReview(line.stuck!);
              }}
              className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-neutral-300 hover:bg-white/10"
            >
              {ui.roleplayWhyStuck}
            </button>
          </div>
        ) : null}
        {toolsOpen && line.text.trim() && line.text !== "…" ? (
          <LineTools
            text={line.text}
            listenLabel={ui.listen}
            listen={Boolean(onAnalyze)}
            analyzeLabel={onAnalyze ? ui.insightAnalyze : undefined}
            translation={
              line.who === "tutor" && line.translation
                ? { label: ui.roleplayTranslations, shown: translationShown, onToggle: () => setRevealed((value) => !value) }
                : null
            }
            extra={
              canSayAgain && !sayingAgain ? (
                <button
                  type="button"
                  onClick={() => setSayingAgain(true)}
                  className="rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  {ui.roleplaySayAgain}
                </button>
              ) : null
            }
          />
        ) : null}
        {ledgerLanguage && line.who === "learner" && line.text.trim() && line.text !== "…" ? (
          <LedgerLinks
            ui={ui}
            kind="mine"
            masteredOnly
            here="call"
            line={line.who === "learner" ? line.meant || line.better || line.text : line.text}
            language={ledgerLanguage}
          />
        ) : null}
        {canSayAgain && sayingAgain ? (
          <div ref={againRef} onClick={(event) => event.stopPropagation()} className="mt-2 rounded-xl bg-black/30 p-2.5 text-left">
            <div className="flex items-start gap-2">
              <p dir="auto" className="min-w-0 flex-1 text-[13px] leading-snug text-neutral-100">
                {sayTarget}
              </p>
              <TTSButton text={sayTarget} className="shrink-0" />
            </div>
            <SayItBack
              target={sayTarget}
              ui={ui}
              onListen={onSayAgain!}
              onGrew={() => againRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })}
            />
            <button
              type="button"
              onClick={() => setSayingAgain(false)}
              className="mt-2 text-[11px] text-neutral-500 underline-offset-4 hover:text-neutral-300 hover:underline"
            >
              {ui.billingClose}
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The line as it came out, with the words that did not survive marked.
 *
 * Shown before anything is said about it, because it is the finding: which word
 * turned into which is arithmetic the learner can check against their own ears,
 * and it stands whether or not the sentence explaining it ever arrives.
 */
export function Attempt({ outcomes, ui }: { outcomes: WordOutcome[]; ui: UICopy }) {
  // 대본 모양(대소문자·문장부호, outcome.shown)으로 보인다 — 옛 서버 답은 shown이 없어 비교용 낱말 그대로(2026-10-29).
  const edge = (shown: string | undefined, at: "lead" | "trail") =>
    shown ? (shown.match(at === "lead" ? /^[^\p{L}\p{M}\p{N}']*/u : /[^\p{L}\p{M}\p{N}']*$/u)?.[0] ?? "") : "";
  return (
    <div className="mt-3 rounded-xl bg-white/5 p-3">
      <p className="text-[11px] text-neutral-500">{ui.roleplayPracticeHeard}</p>
      <p dir="auto" className="mt-1 text-[14px] leading-relaxed">
        {outcomes.map((outcome, index) => (
          <span key={index}>
            {outcome.kind === "kept" ? (
              <span className="text-neutral-100">{outcome.shown ?? outcome.word}</span>
            ) : outcome.kind === "changed" ? (
              <span className="text-amber-300">
                {edge(outcome.shown, "lead")}
                {outcome.heardAs}
                <span className="text-neutral-500"> ({outcome.shown ? outcome.shown.slice(edge(outcome.shown, "lead").length, outcome.shown.length - edge(outcome.shown, "trail").length) || outcome.word : outcome.word})</span>
                {edge(outcome.shown, "trail")}
              </span>
            ) : (
              <span className="text-neutral-500 line-through">{outcome.shown ?? outcome.word}</span>
            )}
            {outcome.space === false ? "" : " "}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * Saying the line back, inside the panel.
 *
 * Its own microphone, opened and closed here. The scene's is shut for as long
 * as the panel is up, and it has to stay shut: a line said in practice must not
 * arrive as the next turn of the conversation.
 */
export function SayItBack({
  target,
  ui,
  onListen,
  onGrew,
}: {
  target: string;
  ui: UICopy;
  onListen: (target: string) => Promise<{ heard: string; practice: Practice | null }>;
  /** The panel got taller — bring what appeared into view. */
  onGrew: () => void;
}) {
  const [state, setState] = useState<
    | { at: "idle" }
    | { at: "listening" }
    | { at: "read"; heard: string; practice: Practice | null }
  >({ at: "idle" });

  const listen = async () => {
    setState({ at: "listening" });
    const result = await onListen(target);
    setState({ at: "read", ...result });
  };

  // An attempt lands below everything already on screen, and on a phone that is
  // below the fold: without this the learner says the line and nothing visibly
  // happens. After the paint, so the panel has its new height by then.
  useEffect(() => {
    if (state.at === "read") onGrew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.at === "read") {
    return (
      <>
        <Attempt outcomes={compareToTarget(target, state.heard).outcomes} ui={ui} />
        {state.practice ? (
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-200">
            {state.practice.note}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void listen()}
          className="mt-2 rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.roleplayPracticeRetry}
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void listen()}
      disabled={state.at === "listening"}
      className="mt-2 w-full rounded-xl border border-white/20 px-4 py-2.5 text-[13px] text-neutral-200 hover:bg-white/10 disabled:opacity-60"
    >
      {state.at === "listening" ? ui.roleplayPracticeListening : ui.roleplayPracticeCta}
    </button>
  );
}

/**
 * The panel itself. `review` is null while it is being put together, and
 * `failed` says the attempt came back with nothing.
 *
 * Anchored to the bottom rather than centred: it is read on a phone, with a
 * thumb on the close button, and it is capped so the conversation it is about
 * stays visible behind it.
 */
export function RoleplayReviewPanel({
  turn,
  review,
  failed,
  ui,
  onClose,
  onSayItBack,
}: {
  turn: StuckTurn;
  review: Review | null;
  failed: boolean;
  ui: UICopy;
  onClose: () => void;
  /** Listen once and read the attempt. Absent where there is no microphone. */
  onSayItBack?: (target: string) => Promise<{ heard: string; practice: Practice | null }>;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const toBottom = () => {
    const panel = scroller.current;
    if (!panel) return;
    panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/70 p-3">
      <div
        ref={scroller}
        className="max-h-[80%] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
      >
        <h3 className="text-sm font-semibold text-white">{ui.roleplayReviewTitle}</h3>
        <p className="mt-1 text-[12px] text-neutral-500">{turn.asked}</p>

        {review ? (
          <>
            <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-200">
              {review.why}
            </p>
            {review.say ? (
              <div className="mt-3 rounded-xl bg-white/5 p-3">
                <p className="text-[11px] text-neutral-500">{ui.roleplayReviewSay}</p>
                <p className="mt-1 text-[14px] text-neutral-100">{review.say}</p>
                {review.meaning ? (
                  <p className="mt-0.5 text-[12px] text-neutral-500">{review.meaning}</p>
                ) : null}
                {/* Reading it is not saying it. The line is right here and the
                    scene is already stopped, so this is the cheapest moment
                    there will ever be to try it. */}
                {onSayItBack ? (
                  <SayItBack
                    target={review.say}
                    ui={ui}
                    onListen={onSayItBack}
                    onGrew={toBottom}
                  />
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-[13px] text-neutral-400">
            {failed ? ui.roleplayReviewFailed : ui.roleplayReviewLoading}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100"
        >
          {ui.billingClose}
        </button>
      </div>
    </div>
  );
}

function UnsureMark({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((was) => !was);
        }}
        aria-label={text}
        className="ms-1 align-middle text-meta font-semibold text-amber-300"
      >
        ?
      </button>
      {open ? <span className="mt-1 block text-meta text-amber-200">{text}</span> : null}
    </>
  );
}
