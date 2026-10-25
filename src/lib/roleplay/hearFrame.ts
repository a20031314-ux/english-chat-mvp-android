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

/*
 * How loud this microphone is, for deciding what counts as speech.
 *
 * The speech level above (0.02) was set on Android phones. On iOS the line
 * follows the room instead — never above Android's.
 */
const IOS_MIN_SPEECH_RMS = 0.004;
const CALIBRATION_MS = 400;
/** 말한 뒤에는 그 턴에서 가장 큰 소리의 이 비율 아래를 쉼으로 본다(아이폰 원음은 방 소리가 그대로 남음). */
const IOS_PAUSE_OF_PEAK = 0.2;
/**
 * 기준의 위 끝. 0.02로 두었더니 방이 조금 시끄러우면(처음 0.4초 중간값 0.007 이상) 기준이 0.02에 붙고,
 * 원음 마이크로 보통 크기로 말한 소리(0.017)가 한 번도 넘지 못해 턴마다 "…"로 끝났다(TestFlight 85.9 진단, 2026-10-25).
 */
const IOS_MAX_SPEECH_RMS = 0.014;

export type LevelScaler = {
  scale: (level: number, sinceStart: number) => number;
  threshold: () => number;
};

/**
 * 아이폰(2026-10-20 원음 녹음으로 바꾼 뒤): 자동 음량·잡음 억제를 끈 마이크는 방 소리가 늘 깔려 있어,
 * 처음 0.4초의 가장 조용한 순간을 기준으로 잡으면 말이 끝난 뒤의 방 소리도 "말"로 읽혀 턴이 20초 끝까지
 * 끝나지 않았다("인식이 늦다"). 기준은 처음 0.4초의 중간값으로, 말이 시작된 뒤에는 그 턴의 가장 큰 소리에
 * 비해 충분히 작으면 쉼으로 본다.
 */
export function makeLevelScaler(ios: boolean): LevelScaler {
  if (!ios) return { scale: (level) => level, threshold: () => 0.02 };
  const calibration: number[] = [];
  let threshold = IOS_MIN_SPEECH_RMS;
  let peak = 0;
  const update = () => {
    if (calibration.length === 0) return;
    const sorted = [...calibration].sort((a, b) => a - b);
    const floor = sorted[Math.floor(sorted.length / 2)];
    threshold = Math.min(IOS_MAX_SPEECH_RMS, Math.max(IOS_MIN_SPEECH_RMS, floor * 3));
  };
  return {
    scale: (level, sinceStart) => {
      if (sinceStart < CALIBRATION_MS && level > 0) {
        calibration.push(level);
        update();
      }
      if (level >= threshold && level > peak) peak = level;
      // 쉼: 가장 큰 소리의 비율 아래, 또는 기준의 1.5배 아래. 처음 0.4초가 아주 조용해 기준이 바닥(0.004)에
      // 붙으면 0.12배(0.0037)보다 방 소리가 커서 턴이 20초 끝까지 안 끝났다(85.9 진단 2026-10-25: thr 0.004 · peak 0.031 · turn 19.7s).
      if (peak > 0 && level < Math.max(peak * IOS_PAUSE_OF_PEAK, Math.min(threshold * 1.5, peak * 0.5))) return 0;
      return level * (0.02 / threshold);
    },
    threshold: () => threshold,
  };
}

/**
 * 기다림이 다 지나도록 "말"로 볼 만큼 큰 소리가 없던 턴이라도, 기준 가까이까지 올라간 소리가 있었으면
 * 받아쓰기에 보낸다 — 작게 말한 목소리를 통째로 버리지 않게. 방 소리만 있던 턴(기준의 절반 아래)은 보내지 않는다
 * (받아쓰기가 정적에서 문장을 지어냄).
 */
export function quietVoiceWorthSending(peak: number, threshold: number): boolean {
  return peak >= 0.008 && peak >= threshold * 0.6;
}
