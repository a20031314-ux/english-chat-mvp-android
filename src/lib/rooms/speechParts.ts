/**
 * 말 덩어리를 "쉼마다 조각"으로 자르는 규칙(화면·소리 없이 시험할 수 있게 따로 둠, speech.ts가 씀).
 *
 * 예전에는 말이 끝나고 1.2초 조용해야 한 덩어리를 통째로 받아썼다 — 긴 말은 다 끝날 때까지 자막이 없었다.
 * 이제는 짧게 쉴 때마다(0.6초) 그때까지를 한 조각으로 먼저 보내고, 1.2초 안에 다시 말하면 같은 말(같은 말풍선)로 잇는다.
 * 소리는 조각마다 한 번씩만 보내므로 받아쓰기 비용은 그대로다. 쉬는 곳에서 자르니 낱말이 잘리는 일은 거의 없다.
 */

/** 이만큼 쉬면 그때까지를 한 조각으로 보낸다. */
export const PART_PAUSE_MS = 600;
/** 이만큼 조용하면 말 하나가 끝난 것(다음 말은 새 말풍선). */
export const END_SILENCE_MS = 1_200;
/** 쉬지 않고 이어 말해도 이만큼 지나면 끊어 보낸다(자막이 너무 늦지 않게). */
export const MAX_PART_MS = 8_000;
/** 조각 안의 소리가 이보다 짧으면 기침·숨소리로 보고 버린다. */
export const MIN_PART_VOICED_MS = 400;
/**
 * 짧은 쉼에서 자르려면 조각에 말소리가 이만큼은 있어야 한다. 낱말 하나("昨日")만 따로 받아쓰면 맥락이 없어
 * 틀리기 쉽다 — 일본어 시험에서 「友達と公園に行きました」를 쪼개니 「公園」이 「応援」으로 나왔다(통째로는 3번 다 맞음).
 * 그래서 짧은 말은 말이 끝날 때(1.2초) 통째로, 긴 말만 쉼마다 나눈다.
 */
export const MIN_CUT_VOICED_MS = 1_500;

export type PartState = {
  /** 지금 말(말풍선) 번호. 말 사이에는 null. */
  utterance: string | null;
  /** 이 말에서 다음 조각의 순번(0부터). */
  nextPart: number;
  /** 녹음 중인 조각이 있는지와 그 시작. */
  recording: boolean;
  partStartedAt: number;
  partVoicedMs: number;
  /** 마지막으로 소리가 난 때(말 사이 판단에도 씀). */
  lastVoiceAt: number;
};

export const IDLE: PartState = {
  utterance: null,
  nextPart: 0,
  recording: false,
  partStartedAt: 0,
  partVoicedMs: 0,
  lastVoiceAt: 0,
};

export type PartAction =
  /** 녹음 시작(새 조각). newUtterance면 새 말풍선. */
  | { kind: "begin"; utterance: string; part: number; newUtterance: boolean }
  /** 녹음 끝. keep이면 받아쓰러 보낸다. */
  | { kind: "finish"; utterance: string; part: number; keep: boolean; startedAt: number; endedAt: number }
  /** 말 하나가 끝났다(말풍선 닫기). */
  | { kind: "end"; utterance: string };

/**
 * 한 틱(50ms)마다 부른다. voiced = 지금 소리가 말소리 크기를 넘었는지.
 * newId는 새 말 번호를 만드는 함수(시험에서는 정해진 값).
 */
export function stepParts(
  was: PartState,
  input: { now: number; voiced: boolean; tickMs: number; muted?: boolean },
  newId: () => string,
): { state: PartState; actions: PartAction[] } {
  const { now, voiced, tickMs } = input;
  const actions: PartAction[] = [];
  let state = { ...was };

  const finishPart = () => {
    if (!state.recording || !state.utterance) return;
    actions.push({
      kind: "finish",
      utterance: state.utterance,
      part: state.nextPart,
      keep: state.partVoicedMs >= MIN_PART_VOICED_MS,
      startedAt: state.partStartedAt,
      endedAt: state.lastVoiceAt || now,
    });
    // 버린 조각(기침)은 순번을 쓰지 않는다 — 받는 쪽은 0부터 이어진 조각만 본다.
    state = { ...state, recording: false, nextPart: state.partVoicedMs >= MIN_PART_VOICED_MS ? state.nextPart + 1 : state.nextPart, partVoicedMs: 0 };
  };
  const endUtterance = () => {
    if (!state.utterance) return;
    actions.push({ kind: "end", utterance: state.utterance });
    state = { ...state, utterance: null, nextPart: 0 };
  };

  if (input.muted) {
    finishPart();
    endUtterance();
    return { state, actions };
  }

  if (!state.recording) {
    if (voiced) {
      const continuing = state.utterance !== null && now - state.lastVoiceAt < END_SILENCE_MS;
      if (!continuing) {
        endUtterance();
        state = { ...state, utterance: newId(), nextPart: 0 };
      }
      state = { ...state, recording: true, partStartedAt: now, partVoicedMs: tickMs, lastVoiceAt: now };
      actions.push({ kind: "begin", utterance: state.utterance as string, part: state.nextPart, newUtterance: !continuing });
    } else if (state.utterance !== null && now - state.lastVoiceAt >= END_SILENCE_MS) {
      endUtterance();
    }
    return { state, actions };
  }

  if (voiced) {
    state = { ...state, lastVoiceAt: now, partVoicedMs: state.partVoicedMs + tickMs };
  }
  const quiet = now - state.lastVoiceAt;
  const pauseCut = quiet >= PART_PAUSE_MS && state.partVoicedMs >= MIN_CUT_VOICED_MS;
  if (pauseCut || quiet >= END_SILENCE_MS || now - state.partStartedAt >= MAX_PART_MS) {
    finishPart();
    // 조각 길이로 끊었는데 아직 말하는 중이면, 다음 틱에서 같은 말로 새 조각이 시작된다.
  }
  return { state, actions };
}

/** 받아쓴 조각들을 한 말풍선 글로 잇는다. 띄어쓰기 없는 글자(한자·가나·타이 문자)끼리는 붙인다. */
export function joinPartTexts(parts: string[]): string {
  let out = "";
  for (const raw of parts) {
    const text = raw.trim();
    if (!text) continue;
    if (!out) {
      out = text;
      continue;
    }
    if (SPACELESS.test(out.slice(-1)) && SPACELESS.test(text[0])) {
      out += text;
      continue;
    }
    // 받아쓰기는 조각마다 끝에 마침표를 붙인다. 다음 조각이 소문자로 이어지면(문장 중간) 그 마침표는 뺀다: "amiga. y vimos" → "amiga y vimos".
    if (/^\p{Ll}/u.test(text) && /[^.]\.$/.test(out)) out = out.slice(0, -1);
    out += ` ${text}`;
  }
  return out;
}

const SPACELESS = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}、。！？「」]/u;
