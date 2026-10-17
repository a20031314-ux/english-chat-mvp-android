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
import { BANK_GLOSS_LANGUAGE, JUST_TALK_BYE } from "../roleplay/justTalk.ts";
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
  picked: Candidate | null,
  input: {
    /** Every question asked: this answer ends the pack. */
    complete: boolean;
    language: string;
    nativeLanguage: string;
    bank: SentenceBank;
    canSplit: boolean;
    /** The learner step the conversation stays on while the pack runs. */
    nodeId: string;
    /** The question planned next, asked when the tutor picked none and asked nothing. */
    planned?: Candidate | null;
  },
): { direction: Direction; asked: Candidate | null } {
  const as = (shaped: Direction, asked: Candidate | null = null) => ({ direction: shaped, asked });
  let chosen = picked;
  if (input.complete) {
    // The last answer: a reaction, then the scene's own recorded goodbye. Not
    // the tutor's closing words — seen on production, it closed with a new
    // question ("What will you see there?") nobody could answer. Not while
    // they are stuck, where the help is still the turn.
    if (direction.assessment === "stuck") return as(direction);
    const bye = input.bank[JUST_TALK_BYE];
    const said = "text" in direction.say ? reactionOnly(direction.say.text) : "";
    if (!bye) return as({ ...direction, ...(said ? { say: { text: said } } : {}), next: { end: true } });
    const gloss = input.nativeLanguage === BANK_GLOSS_LANGUAGE ? bye.translation : undefined;
    const goodbye = { text: bye.text, ...(gloss ? { translation: gloss } : {}) };
    if (input.canSplit) {
      return as({ ...direction, say: goodbye, ...(said ? { react: { text: said } } : {}), next: { end: true } });
    }
    return as({ ...direction, say: { text: said ? `${said} ${bye.text}` : bye.text }, next: { end: true } });
  }
  if (direction.assessment === "stuck" || direction.assessment === "closing") return as(direction);
  // The tutor's own question, written into its line: asked, and the pack moves past it.
  if (chosen?.free) return as(direction, chosen);
  const written0 = "text" in direction.say ? direction.say.text : "";
  if (!chosen) {
    // No pick. Fine when the tutor asked or answered something itself; when it
    // only reacted, the learner would be left with nothing to answer, so the
    // planned question follows (seen on the first production run).
    if (QUESTION_END.test(written0.trim()) || !input.planned || input.planned.free) return as(direction);
    chosen = input.planned;
  }
  const raw = reactionOnly(written0);
  const found = raw ? findReaction(raw, input.language, input.bank) : null;
  const gloss = input.nativeLanguage === BANK_GLOSS_LANGUAGE;
  const reaction = found && !found.rest
    ? { text: found.text, ...(gloss && found.translation ? { translation: found.translation } : {}) }
    : raw
      ? { text: raw }
      : null;
  const question = {
    text: chosen.lead ? `${chosen.lead.text} ${chosen.text}` : chosen.text,
    ...(gloss ? { translation: chosen.lead ? `${chosen.lead.translation} ${chosen.translation}` : chosen.translation } : {}),
  };
  // A question was picked, so the conversation goes on whatever else came back.
  const next = "end" in direction.next ? { step: input.nodeId } : direction.next;
  if (input.canSplit) {
    return as({ ...direction, say: question, ...(reaction ? { react: reaction } : {}), next }, chosen);
  }
  return as({ ...direction, say: { text: reaction ? `${reaction.text} ${question.text}` : question.text }, next }, chosen);
}
