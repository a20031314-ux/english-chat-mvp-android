/**
 * 🎭 이렇게도 말할 수 있었어요(2026-11-08 사용자 "결과화면에서 가능했던 대화흐름(학습자의 발화보다 더 고차원의 대화)을 가정해서
 * 몇 개를 수행하게 — 스크립트를 변형한 형태로" → "1,2는 추천대로, 3은 녹음받아쓰기 방식을 먼저, 4는 숙제 중 하나로").
 *
 * 끝난 통화 대본을 뼈대로 장면 둘: ① 같은 흐름에서 내 말만 한 단계 위로(늘) ② 한 걸음 더(더 깊은 화제) 또는 다른 갈래(다른 대답).
 * 연습은 대본처럼: 튜터 줄 듣고 → 내 차례엔 앱 언어 뜻 + 바뀐 조각만 빈칸 → 🎙 말해서 받아쓰기(모델 판단 없음, 낱말 대조) →
 * 마지막에 뜻만 보고 한 줄 전체. 수업 통화는 끝나면 저절로 만들고 그 통화의 숙제가 되며, 자유대화는 끝 화면에서 눌러야 만든다.
 *
 * 장면 속 내 줄은 내 말을 고쳐 쓴 것이라 학습자 문장 — 서버에 남기지 않고 이 폰에만(`callReplays.v1.<언어>`, 통화 20개).
 * 순수 모듈(저장은 localStorage를 받아서): 서버 라우트·화면·테스트가 같이 쓴다.
 */
import { compareToTarget, shadowPasses, typedMatches } from "./practice.ts";

export type ReplayKind = "same" | "further" | "branch";
export const REPLAY_KINDS: readonly ReplayKind[] = ["same", "further", "branch"];

/** 장면 한 줄: 튜터 줄, 또는 내 줄(앱 언어 뜻 + 빈칸으로 비울 바뀐 조각). */
export type ReplayLine =
  | { who: "tutor"; text: string }
  | { who: "me"; text: string; meaning: string; piece: string | null };

export type ReplayScene = { kind: ReplayKind; lines: ReplayLine[] };

/** 장면 하나의 결과(이 폰에만): 내 줄마다 맞힘 + 마지막 한 줄 전체. */
export type ReplayResult = { ok: number; of: number; whole: boolean; at: number };

export type StoredReplay = { callId: string; scenes: ReplayScene[]; results: Partial<Record<ReplayKind, ReplayResult>>; at: number };

export const MAX_REPLAY_CALLS = 20;
const MAX_LINE_CHARS = 220;
const MIN_ME_LINES = 2;
const MAX_ME_LINES = 4;

/* ---------- 모델에게 주는 지시·받은 답 읽기 ---------- */

export type ReplayInput = {
  target: string;
  native: string;
  level: number;
  lines: readonly { who: "tutor" | "learner"; text: string; better?: string }[];
};

/**
 * 지시. 베낄 수 있는 예문은 넣지 않는다(RULES "자주 걸리는 것") — 꼴만 말한다.
 * 내 말은 같은 뜻·같은 사실로 한 단계만 위로(배운 적 없는 틀만 가득하지 않게), 바뀐 조각을 piece로 — 그 자리만 빈칸이 된다.
 */
export function replayPrompt(input: ReplayInput): string {
  const level = Math.min(5, Math.max(1, Math.round(input.level) || 2));
  const transcript = input.lines
    .filter((line) => line.text.trim())
    .slice(-30)
    .map((line) =>
      line.who === "tutor"
        ? `TUTOR: ${line.text.trim()}`
        : `LEARNER: ${line.text.trim()}${line.better ? `   (put right: ${line.better.trim()})` : ""}`,
    )
    .join("\n");
  return `You write two short practice scenes from a real phone call between a ${input.target} tutor and a learner (level ${level} of 5). The learner will act out their own part again, saying better lines than they managed in the call.

The call:
${transcript}

Write exactly two scenes, in ${input.target}.
Scene 1, "same": follow the call's own flow and topic. Keep the tutor's lines close to what the tutor said (shorten them if long). Rewrite each of the learner's turns one step above what they said: the same meaning and the same facts, but more complete, better connected, more natural, with their mistakes put right. One step only — use what a level ${Math.min(5, level + 1)} learner can say, not rare words or long sentences.
Scene 2: pick whichever fits the call better — "further": the conversation goes one step deeper where the learner stopped short (the tutor follows up on something they said, and they answer with more detail); or "branch": at one key moment the learner gives a different, fuller answer and the talk goes that way. New details must fit what they told the tutor about themselves.

Each scene: starts with a tutor line, then alternates, ${MIN_ME_LINES} to ${MAX_ME_LINES} learner lines, each under 18 words. For every learner line give:
- "meaning": what it means, in ${input.native}, natural and short.
- "piece": the part of the line that is the step up — the words the learner would not have said in the call (a phrase of one to five words, copied exactly from the line). Not a name, not a number. If nothing in the line is new, use its most useful phrase.

Answer only JSON: {"scenes":[{"kind":"same","lines":[{"who":"tutor","text":"..."},{"who":"me","text":"...","meaning":"...","piece":"..."}]},{"kind":"further","lines":[...]}]}`;
}

function clean(text: unknown): string {
  return typeof text === "string" ? text.replace(/\s+/g, " ").trim().slice(0, MAX_LINE_CHARS) : "";
}

/** 받은 답을 읽는다 — 장면 꼴이 아니면 버리고, 빈칸 조각이 줄에 없으면 빈칸 없이(줄 전체). 첫 장면은 늘 same. */
export function parseReplay(raw: unknown): ReplayScene[] {
  let value = raw;
  if (typeof raw === "string") {
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      value = JSON.parse(start >= 0 && end > start ? raw.slice(start, end + 1) : raw);
    } catch {
      return [];
    }
  }
  let scenes = (value as { scenes?: unknown } | null)?.scenes;
  // Haiku가 JSON 모드에서 배열을 글로 한 번 더 싸서 줄 때가 있다("scenes":"[...]").
  if (typeof scenes === "string") {
    try {
      scenes = JSON.parse(scenes);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(scenes)) return [];
  const out: ReplayScene[] = [];
  for (const scene of scenes.slice(0, 3)) {
    const kind = (scene as { kind?: unknown })?.kind;
    if (typeof kind !== "string" || !REPLAY_KINDS.includes(kind as ReplayKind)) continue;
    if (out.some((one) => one.kind === kind)) continue;
    const rows = (scene as { lines?: unknown }).lines;
    if (!Array.isArray(rows)) continue;
    const lines: ReplayLine[] = [];
    for (const row of rows.slice(0, 12)) {
      const who = (row as { who?: unknown })?.who;
      const text = clean((row as { text?: unknown }).text);
      if (!text) continue;
      if (who === "tutor") {
        lines.push({ who: "tutor", text });
        continue;
      }
      if (who !== "me" && who !== "learner") continue;
      const meaning = clean((row as { meaning?: unknown }).meaning);
      if (!meaning) continue;
      const piece = clean((row as { piece?: unknown }).piece);
      const usable = piece && text.includes(piece) && [...piece].length < [...text].length * 0.9 ? piece : null;
      lines.push({ who: "me", text, meaning, piece: usable });
    }
    const mine = lines.filter((line) => line.who === "me").length;
    if (mine < MIN_ME_LINES || mine > MAX_ME_LINES + 1) continue;
    if (lines[0]?.who !== "tutor") continue;
    out.push({ kind: kind as ReplayKind, lines });
  }
  const same = out.find((scene) => scene.kind === "same");
  if (!same) return [];
  const other = out.find((scene) => scene.kind !== "same");
  return other ? [same, other] : [same];
}

/** 연습할 만한 통화인가: 내 줄(말한 것)이 둘 이상. */
export function replayable(lines: readonly { who: string; text: string }[]): boolean {
  return lines.filter((line) => line.who === "learner" && line.text.trim() && line.text.trim() !== "…").length >= 2;
}

/* ---------- 맞음 ---------- */

/** 빈칸 차례: 들은(쓴) 말에 그 조각의 낱말이 다 나왔나 — 조각 밖 낱말은 봐준다(받아쓰기가 앞뒤를 달리 적어도). */
export function pieceSaid(piece: string, heard: string): boolean {
  if (!heard.trim()) return false;
  const compared = compareToTarget(piece, heard);
  return compared.outcomes.length > 0 && compared.outcomes.every((outcome) => outcome.kind === "kept");
}

/** 한 줄 전체 차례: 말했으면 따라 말하기 통과 기준(긴 줄은 80%), 썼으면 낱말이 다 같아야. */
export function wholeSaid(line: string, heard: string, typed: boolean): boolean {
  return typed ? typedMatches(line, heard).matched : shadowPasses(line, heard);
}

/** 빈칸으로 보일 줄: 조각 자리만 ___. 조각이 없으면 null(그 줄은 뜻만 보고 전체를 말함). */
export function blanked(line: Extract<ReplayLine, { who: "me" }>): string | null {
  if (!line.piece) return null;
  const at = line.text.indexOf(line.piece);
  return at < 0 ? null : `${line.text.slice(0, at)}___${line.text.slice(at + line.piece.length)}`;
}

/** 마지막 "한 줄 전체" 차례로 고를 내 줄: 조각이 있는 줄 중 가장 긴 것(떠올려 만들 거리가 가장 많은 줄). */
export function wholeLineOf(scene: ReplayScene): Extract<ReplayLine, { who: "me" }> | null {
  const mine = scene.lines.filter((line): line is Extract<ReplayLine, { who: "me" }> => line.who === "me");
  if (!mine.length) return null;
  return [...mine].sort((a, b) => [...b.text].length - [...a.text].length)[0]!;
}

/* ---------- 이 폰에 남기기 ---------- */

const REPLAYS = "callReplays.v1";
const HOMEWORK = "callHomework.v1";

function read<T>(store: Storage | undefined | null, key: string, fallback: T): T {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(store: Storage | undefined | null, key: string, value: unknown) {
  try {
    store?.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장이 막힌 창 — 이번 화면에서만 */
  }
}

export function readReplays(store: Storage | undefined | null, language: string): StoredReplay[] {
  const rows = read<unknown>(store, `${REPLAYS}.${language}`, []);
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (row): row is StoredReplay =>
      Boolean(row) && typeof (row as StoredReplay).callId === "string" && Array.isArray((row as StoredReplay).scenes) && (row as StoredReplay).scenes.length > 0,
  );
}

export function replayFor(store: Storage | undefined | null, language: string, callId: string): StoredReplay | null {
  return readReplays(store, language).find((row) => row.callId === callId) ?? null;
}

export function keepReplay(store: Storage | undefined | null, language: string, row: StoredReplay): void {
  const rest = readReplays(store, language).filter((one) => one.callId !== row.callId);
  write(store, `${REPLAYS}.${language}`, [row, ...rest].slice(0, MAX_REPLAY_CALLS));
}

export function noteReplayResult(store: Storage | undefined | null, language: string, callId: string, kind: ReplayKind, result: ReplayResult): StoredReplay | null {
  const row = replayFor(store, language, callId);
  if (!row) return null;
  const next = { ...row, results: { ...row.results, [kind]: result } };
  keepReplay(store, language, next);
  const homework = readHomework(store, language);
  if (homework && homework.callId === callId && homework.kind === "replay" && !homework.done) {
    write(store, `${HOMEWORK}.${language}`, { ...homework, done: result.at });
  }
  return next;
}

/**
 * 수업 숙제(설계 call-modes 5절, 2026-11-08 — 종류 하나씩 늘림): 한 번에 하나, 새 숙제가 지난 숙제를 덮어씀, 안 해도 잠금 없음.
 * 지금 종류는 replay(🎭)뿐 — 퀴즈 한 판·세 줄 쓰기·사전 찾기는 다음에.
 */
export type Homework = { kind: "replay"; callId: string; at: number; done?: number };

export function readHomework(store: Storage | undefined | null, language: string): Homework | null {
  const row = read<Homework | null>(store, `${HOMEWORK}.${language}`, null);
  return row && row.kind === "replay" && typeof row.callId === "string" && typeof row.at === "number" ? row : null;
}

export function giveHomework(store: Storage | undefined | null, language: string, homework: Homework): void {
  write(store, `${HOMEWORK}.${language}`, homework);
}
