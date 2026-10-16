/**
 * A pack turn's answer, put together from the tutor's judgement and the pack's
 * question (pack.ts).
 *
 * The tutor reads the turn as it always does — correction, meaning, whether
 * they were stuck — and adds a short reaction and the number of the question
 * it picked. What is spoken is that reaction, in the reaction table's fixed
 * words when it holds them (roleplay/reactions.ts), then the pack's question
 * as written, so both play from the shared speech cache.
 *
 * Left as the tutor wrote it: a stuck turn (its help is the turn), a turn
 * where the learner asked something or was leaving (no pick), and the pack's
 * free question, which the tutor writes itself.
 *
 * Pure.
 */

import type { Direction } from "../roleplay/director.ts";
import { findReaction } from "../roleplay/reactions.ts";
import { BANK_GLOSS_LANGUAGE } from "../roleplay/justTalk.ts";
import type { SentenceBank } from "../roleplay/script.ts";
import type { Candidate } from "./pack.ts";

const QUESTION_END = /[?？؟]\s*$/u;

/** The reaction half of what the tutor wrote: everything up to its first question, without it. */
export function reactionOnly(text: string): string {
  const parts = text.match(/[^.!?。！？؟]+[.!?。！？؟]*\s*/gu) ?? [text];
  const kept: string[] = [];
  for (const part of parts) {
    if (QUESTION_END.test(part.trim())) break;
    kept.push(part);
  }
  return kept.join("").trim();
}

export function shapePackDirection(
  direction: Direction,
  chosen: Candidate | null,
  input: {
    /** Every question asked: this answer ends the pack. */
    complete: boolean;
    language: string;
    nativeLanguage: string;
    bank: SentenceBank;
    canSplit: boolean;
    /** The learner step the conversation stays on while the pack runs. */
    nodeId: string;
  },
): Direction {
  if (input.complete) {
    // The last answer: the tutor closes. Not while they are stuck, where the
    // help is still the turn.
    return direction.assessment === "stuck" ? direction : { ...direction, next: { end: true } };
  }
  if (!chosen || chosen.free || direction.assessment === "stuck" || direction.assessment === "closing") {
    return direction;
  }
  const written = "text" in direction.say ? direction.say.text : "";
  const raw = reactionOnly(written);
  const found = raw ? findReaction(raw, input.language, input.bank) : null;
  const gloss = input.nativeLanguage === BANK_GLOSS_LANGUAGE;
  const reaction = found && !found.rest
    ? { text: found.text, ...(gloss && found.translation ? { translation: found.translation } : {}) }
    : raw
      ? { text: raw }
      : null;
  const question = { text: chosen.text, ...(gloss ? { translation: chosen.translation } : {}) };
  // A question was picked, so the conversation goes on whatever else came back.
  const next = "end" in direction.next ? { step: input.nodeId } : direction.next;
  if (input.canSplit) {
    return {
      ...direction,
      say: question,
      ...(reaction ? { react: reaction } : {}),
      next,
    };
  }
  return {
    ...direction,
    say: { text: reaction ? `${reaction.text} ${question.text}` : question.text },
    next,
  };
}
