"use client";

import { ChatFaceSlot } from "@/components/speech/CallKit";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TTSButton } from "@/components/TTSButton";
import { SayItBack } from "@/components/speech/Attempt";
import { LedgerLinks } from "@/components/LedgerLinks";
import { CorrectionChip, LineTools } from "@/components/conversation/LineTools";
import { readCorrectionView } from "@/lib/correctionView";
import { rememberFix } from "@/lib/curriculum/gaps";
import type { Practice } from "@/lib/roleplay/practice";
import type { Review, StuckTurn, TranscriptLine } from "@/lib/roleplay/review";
import type { UICopy } from "@/lib/copy";
import { correctedHighlightParts, originalHighlightParts } from "@/lib/textDiff";

/**
 * 내가 한 말 — 틀린 곳만 표시(사용자 2026-11-01 "사용자 문장을 모두 지우지 말고 틀린 부분만 표시하고, 정답 문장도 그렇게").
 * 틀린 낱말·글자는 빨간 취소선, 빠진 말 자리는 ‸. 나머지는 그대로.
 */
export function SaidWithMistakes({ said, right, className = "" }: { said: string; right: string; className?: string }) {
  // ‸는 정말 빠진 말 자리에만: 바로 앞이 틀린 곳이면 바꿔 쓴 것(취소선이 이미 보여 줌), 문장부호만 빠진 것도 표시하지 않는다.
  const parts = originalHighlightParts(said, right).filter(
    (part, index, all) => !part.missingHint || (/[\p{L}\p{N}]/u.test(part.missingHint) && !lastWordWasWrong(all, index)),
  );
  return (
    <span dir="auto" className={className} data-fix-said>
      {parts.map((part, index) =>
        part.missingHint ? (
          <span key={index} aria-hidden className="mx-px font-semibold text-bad">
            ‸
          </span>
        ) : part.error ? (
          <span key={index} className="text-bad line-through decoration-bad">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
}

function lastWordWasWrong(parts: ReturnType<typeof originalHighlightParts>, index: number): boolean {
  for (let at = index - 1; at >= 0; at -= 1) {
    const part = parts[at]!;
    if (!part.text.trim()) continue;
    return part.error;
  }
  return false;
}

/** 고친 문장 — 바뀐·새로 들어간 곳만 초록 굵게, 나머지는 보통 글자. */
export function RightWithChanges({ said, right, className = "" }: { said: string; right: string; className?: string }) {
  const parts = correctedHighlightParts(said, right);
  return (
    <span dir="auto" className={className} data-fix-right>
      {parts.map((part, index) =>
        part.added && /[\p{L}\p{N}]/u.test(part.text) ? (
          <span key={index} className="font-semibold text-good">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
}

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
  onLooked,
  face,
  flat = false,
}: {
  line: TranscriptLine;
  /**
   * 끝난 통화·돌아보기의 넘겨 보는 장(CallPages) 안 — 눌러서 펼치는 것 없이 다 펼친 채(사용자 2026-11-01
   * "클릭해서 펼치는 걸로 하지 말고 넘김 버튼으로 넘겨 가면서"): 고친 말은 바로, 할 일 줄은 늘, 번역은 머리의 번역 켬/끔만 따름.
   * 펼쳐서 장 길이가 바뀌지 않으니 장 나눔이 그대로다.
   */
  flat?: boolean;
  /** 줄 옆 얼굴 — 튜터 왼쪽, 나 오른쪽(채팅과 같게, 2026-11-01). */
  face?: ReactNode;
  ui: UICopy;
  onReview: (turn: StuckTurn) => void;
  /** 튜터 줄의 접힌 번역을 눌러 봤다 — 통화 정리의 "뜻을 본 말"(roleplay/recap.ts). */
  onLooked?: () => void;
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
  const translationShown = showTranslation !== false || (!flat && revealed);
  // 줄을 누르면 할 일 한 줄(conversation/LineTools) — 채팅·1:1과 같은 문법(2026-10-23). 넘겨 보는 장에서는 늘 보임.
  const [toolsTapped, setToolsOpen] = useState(false);
  const toolsOpen = flat || toolsTapped;
  // 고친 문장은 채팅과 같은 설정(눌러서 보기 / 바로 보기, lib/correctionView.ts)을 따른다. 넘겨 보는 장에서는 늘 펼침.
  const [fixTapped, setFixOpen] = useState(() => readCorrectionView() === "auto");
  const fixOpen = flat || fixTapped;
  const hasFix = Boolean(line.better || line.meant || line.about);
  // Opening a correction of their own line marks what was added as a gap for the continuous study (curriculum/gaps.ts, this phone only).
  useEffect(() => {
    if (fixOpen && line.who === "learner" && line.better && ledgerLanguage) rememberFix(ledgerLanguage, { wrong: line.text, right: line.better, note: line.about ?? "" });
  }, [fixOpen, line.who, line.better, line.text, line.about, ledgerLanguage]);
  const tapLine = () => {
    if (flat) return;
    setToolsOpen((open) => !open);
    if (line.who === "tutor" && !translationShown) {
      setRevealed(true);
      if (!line.looked) onLooked?.();
      if (!line.translation) onTranslate?.(line.text);
    }
  };
  const [sayingAgain, setSayingAgain] = useState(false);
  const againRef = useRef<HTMLDivElement>(null);
  const sayTarget = (line.meant || line.better || line.smoother || line.text).trim();
  // 맞게 말한 줄의 더 자연스러운 말(💡, 2026-11-02) — 고친 말이 없을 때만, 보는 방식은 고친 말과 같은 설정.
  const smoother = line.who === "learner" && !line.better && !line.meant ? (line.smoother ?? "").trim() : "";
  const canSayAgain = Boolean(onSayAgain && line.who === "learner" && sayTarget && sayTarget !== "…");
  return (
    <li className={`mb-2 flex items-end gap-2 ${line.who === "learner" ? "justify-end" : "justify-start"}`}>
      {line.who !== "learner" && face ? <ChatFaceSlot>{face}</ChatFaceSlot> : null}
      <div
        role={flat ? undefined : "button"}
        tabIndex={flat ? undefined : 0}
        aria-expanded={flat ? undefined : toolsOpen}
        onClick={tapLine}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          tapLine();
        }}
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${flat ? "" : "cursor-pointer"} ${
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
            line.who === "tutor" && !translationShown && !flat
              ? "decoration-dotted decoration-neutral-500 underline-offset-4 [text-decoration-line:underline]"
              : ""
          }`}
        >
          {line.who === "learner" && fixOpen && line.better && line.better.trim() !== line.text.trim() ? (
            <SaidWithMistakes said={line.text} right={line.better} />
          ) : (
            line.text
          )}
          {/* 받아쓰기가 확신이 낮은 내 말: 끝에 "?" 하나, 누르면 한 줄 설명. */}
          {line.who === "learner" && line.unsure ? <UnsureMark text={ui.heardUnsure} /> : null}
          {/* 튜터 수업에서 다시 말해 맞힌 줄: 끝에 🔁✓(이름은 title — 화면 글 없이, 2026-11-02). */}
          {line.who === "learner" && line.redo === "pass" ? (
            <span className="ms-1.5 text-meta text-good" title={ui.roleplaySayAgain} aria-label={ui.roleplaySayAgain}>
              🔁✓
            </span>
          ) : null}
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
        {smoother && !fixOpen ? (
          <button
            type="button"
            data-natural-chip
            onClick={(event) => {
              event.stopPropagation();
              setFixOpen(true);
            }}
            className="mt-2 inline-flex items-center gap-1 rounded-full border border-good/50 bg-good/15 px-2.5 py-0.5 text-caption text-emerald-100"
          >
            <span aria-hidden="true">💡</span>
            {ui.chatNaturalChip}
          </button>
        ) : null}
        {smoother && fixOpen ? (
          <div data-natural-tip onClick={(event) => event.stopPropagation()} className="mt-1.5 border-t border-white/10 pt-1.5">
            <p className="text-meta text-slate-400">💡 {ui.chatNaturalChip}</p>
            <div className="mt-0.5 flex items-start gap-2">
              <p dir="auto" className="min-w-0 flex-1 text-note leading-snug text-emerald-200">
                {smoother}
              </p>
              <TTSButton text={smoother} className="shrink-0" />
            </div>
          </div>
        ) : null}
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
                <p dir="auto" className="mt-0.5 text-[13px] leading-snug text-slate-100">
                  <RightWithChanges said={line.text} right={line.better} />
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
              line.who === "tutor" && line.translation && !flat
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
      {line.who === "learner" && face ? <ChatFaceSlot>{face}</ChatFaceSlot> : null}
    </li>
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
        {/* 통화 중 💡 힌트(turn.live): 지금 이어 말할 말 — 이름은 기존 문구 missionHint·roleplayBetter·roleplayResume. */}
        <h3 className="text-sm font-semibold text-white">{turn.live ? `💡 ${ui.missionHint}` : ui.roleplayReviewTitle}</h3>
        <p className="mt-1 text-[12px] text-neutral-500">{turn.asked}</p>

        {review ? (
          <>
            <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-200">
              {review.why}
            </p>
            {review.say ? (
              <div className="mt-3 rounded-xl bg-white/5 p-3">
                <p className="text-[11px] text-neutral-500">{turn.live ? ui.roleplayBetter : ui.roleplayReviewSay}</p>
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
          {turn.live ? ui.roleplayResume : ui.billingClose}
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
