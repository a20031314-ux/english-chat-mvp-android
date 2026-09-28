/**
 * Hearing a turn begin and end, without a microphone in the room.
 *
 * Its own file, not because the detector is large but because listen.ts reaches
 * for request objects through the "@/" alias, which Node cannot resolve when a
 * test imports it directly. modelCalls.ts was split out of the metering code
 * over exactly that and says so in its first paragraph; this is the same split
 * for the same reason.
 *
 * Worth being reachable: two bugs have come out of these few lines. A pause
 * dial that cut people off mid-sentence, and a tally that threw away the quiet
 * inside a word and so never recognised a short turn at all — "what's up" was
 * not heard as speech, and since only a pause after speech ends a turn, nothing
 * ended it either.
 */

/** Loud enough to be someone talking rather than a room being a room. */
const SPEECH_RMS = 0.02;
/** Below this a burst is a cough, a chair, a door — not a turn. */
const MIN_SPEECH_MS = 300;
/**
 * The longest quiet that can sit inside one word.
 *
 * Speech is not continuous noise — a stop consonant is a silence — so the tally
 * above survives a gap this short and starts again after a longer one. Long
 * enough to hold "what's up" together, short enough that two separate coughs
 * are still two separate things.
 */
const WORD_GAP_MS = 400;
/**
 * How long a pause has to last before the turn counts as finished.
 *
 * Long enough to survive the gap between words and a moment of thinking
 * mid-sentence; short enough that finishing does not feel like waiting. People
 * pause longer in a language they are learning, which is why this is not the
 * 500ms a native-speaker VAD would use.
 *
 * Was 1400, and came down after the first real conversation on a phone: from
 * the learner's last word there are three more waits before they hear anything
 * — hearing what was said, deciding what to answer, saying it out loud, about
 * six seconds in all — and this one is the only part of it that is a number
 * rather than a model. Half a second off the front of six is worth having, and
 * it is the cheapest half second available.
 *
 * It is a dial, and this is the direction with a cost: too short and someone
 * thinking mid-sentence gets cut off, which is worse than waiting. If turns
 * start being sent while people are still talking, this is the reason, and 1400
 * is where it was.
 */
const TRAILING_SILENCE_MS = 900;

/**
 * What one frame of sound does to a turn in progress.
 *
 * Pulled out of the microphone so it can be run without one. Two bugs have come
 * out of this handful of lines — a pause dial that cut people off mid-sentence,
 * and a tally that threw away the quiet inside a word and so never recognised a
 * short turn at all — and neither was reachable by a test while it lived inside
 * an interval callback holding an AnalyserNode.
 *
 * Pure: give it where the turn stood and how loud this frame was, and it says
 * where the turn stands now.
 */
export type TurnSoFar = {
  /** When the current run of loud frames began, or null while it is quiet. */
  loudSince: number | null;
  /** How much talking has been heard, added up rather than run unbroken. */
  spokenMs: number;
  /** When the current quiet began, or null while somebody is talking. */
  silenceSince: number | null;
  /** Whether enough has been heard to call this a turn rather than a noise. */
  spoke: boolean;
  /** When the talking started, for measuring how long they hesitated. */
  firstSpeechAt: number | null;
};

export const TURN_NOT_STARTED: TurnSoFar = {
  loudSince: null,
  spokenMs: 0,
  silenceSince: null,
  spoke: false,
  firstSpeechAt: null,
};

export function hearFrame(
  was: TurnSoFar,
  level: number,
  now: number,
): { turn: TurnSoFar; finished: boolean } {
  if (level >= SPEECH_RMS) {
    const loudSince = was.loudSince ?? now;
    const spoke = was.spoke || was.spokenMs + (now - loudSince) >= MIN_SPEECH_MS;
    return {
      turn: {
        loudSince,
        spokenMs: was.spokenMs,
        silenceSince: null,
        spoke,
        firstSpeechAt: was.firstSpeechAt ?? loudSince,
      },
      finished: false,
    };
  }

  // Add what was just said to the tally rather than throwing it away. A word is
  // not a continuous noise: "what's up" drops below the threshold at the stop in
  // "what's" and again through the s, and requiring three hundred unbroken
  // milliseconds meant a short turn never counted as speech at all. Nothing
  // then ended it either, because only a pause after speech does — so the
  // learner had to keep talking until some stretch happened to be loud enough
  // throughout. Reported from a phone.
  const spokenMs = was.spokenMs + (was.loudSince === null ? 0 : now - was.loudSince);
  const silenceSince = was.silenceSince ?? now;
  const quietFor = now - silenceSince;

  // A gap this long means the burst was on its own: a cough, a chair, a door.
  // Those are what the threshold exists to refuse, and they do not come with
  // the rest of a word close behind them.
  const forgotten = !was.spoke && quietFor >= WORD_GAP_MS;

  return {
    turn: {
      loudSince: null,
      spokenMs: forgotten ? 0 : spokenMs,
      silenceSince,
      spoke: was.spoke,
      firstSpeechAt: forgotten ? null : was.firstSpeechAt,
    },
    // Only a pause after real speech ends a turn. Silence before it just means
    // they have not started.
    finished: was.spoke && quietFor >= TRAILING_SILENCE_MS,
  };
}
