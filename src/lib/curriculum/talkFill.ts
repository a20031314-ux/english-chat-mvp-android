/**
 * 대화 채우기(사용자 2026-11-24 "대화 내용 자체를 문제로 — 사용자가 틀린 부분, 혹은 특정 부분만 문제화해서 대화를 채우는 형태로" → "일단 만들어줘"):
 * 이 폰의 AI 채팅·통화 기록(talkQuiz.ts readTalks)에서 앞 두세 줄과 함께 한 줄을 보이고, 그 줄의 한 곳을 비운다.
 *   ① 내가 고침받은 줄 — 고친 꼴에서 바뀐 곳(fixSpan)을 비우고, 내가 처음 한 말은 줄 그어 보인다(was). 처음 한 꼴을 그대로 치면 틀림(near).
 *   ② 소재가 든 줄(튜터 줄·내가 맞게 쓴 줄) — 그 단계까지의 문장구조 조각·표현 자리(talkQuiz.ts hitsIn).
 * 서버로 아무것도 보내지 않는다(학습자 문장은 이 폰에만). 맞힌 줄은 다시 안 내고, 틀린 줄은 20시간 뒤 다시(talkFill.v1.<언어>). 순수(읽기·쓰기 함수만 브라우저).
 */
import type { QuizQuestion } from "./quiz.ts";
import { hitsIn, type TalkLine } from "./talkQuiz.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type TalkFillLine = TalkLine & { was?: string };
export type TalkFillQuestion = Extract<QuizQuestion, { kind: "talk" }>;

/** 낱말 자리(글 안 시작·끝) — 띄어쓰기 없는 말은 낱말로 자른 것을 차례로 찾는다. */
function spans(text: string, language: string): { s: number; e: number; w: string }[] {
  const out: { s: number; e: number; w: string }[] = [];
  let from = 0;
  for (const word of segmentWords(text, language)) {
    const at = text.indexOf(word, from);
    if (at < 0) continue;
    out.push({ s: at, e: at + word.length, w: word });
    from = at + word.length;
  }
  return out;
}

const bare = (word: string) => word.toLocaleLowerCase().replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");

/**
 * 처음 한 말(was) → 고친 말(fixed): 앞뒤로 같은 낱말을 걷고 남은 고친 쪽 자리. 넷 낱말까지·줄의 70% 미만일 때만(통째로 고친 줄은 안 냄).
 * 지운 것만 있는 고침(낱말이 빠지기만 함)은 null. 순수.
 */
export function fixSpan(was: string, fixed: string, language: string): { start: number; end: number; answer: string; wrong: string } | null {
  const a = spans(was, language);
  const b = spans(fixed, language);
  if (!a.length || !b.length) return null;
  let head = 0;
  while (head < a.length && head < b.length && bare(a[head]!.w) === bare(b[head]!.w)) head += 1;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && bare(a[a.length - 1 - tail]!.w) === bare(b[b.length - 1 - tail]!.w)) tail += 1;
  // 띄어쓰기 없는 말은 어미만 바뀐 고침(見ます → 見ました)이 흔해 앞 낱말 하나를 같이 비운다 — 어미만으로는 앞 줄에도 흔히 보여 답이 샌다.
  if (head > 0 && isSpaceless(fixed) && head < b.length - tail) head -= 1;
  const changed = b.slice(head, b.length - tail);
  if (!changed.length || changed.length > 4 || changed.length / b.length >= 0.7) return null;
  const start = changed[0]!.s;
  const end = changed[changed.length - 1]!.e;
  const gone = a.slice(head, a.length - tail);
  const answer = fixed.slice(start, end).replace(/[\p{P}]+$/u, "");
  if (!answer.trim()) return null;
  const wrong = gone.length ? was.slice(gone[0]!.s, gone[gone.length - 1]!.e).replace(/[\p{P}]+$/u, "") : "";
  return { start, end: start + answer.length, answer, wrong };
}

/** 줄 묶음의 짧은 지문(이 폰 기록 열쇠). */
export function lineId(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return `t|${(h >>> 0).toString(36)}`;
}

export type FillMemo = Record<string, { ok: boolean; t: number }>;

/**
 * 낼 대화 채우기 문제(최대 n개): 고침받은 줄 먼저(최근 대화부터), 그다음 소재가 든 줄. 맞힌 줄·지난 20시간에 낸 줄은 뺌.
 * 앞 줄 어디에도 정답이 그대로 보이면 안 냄. 순수.
 */
export function talkFills(language: string, convs: readonly (readonly TalkFillLine[])[], options: { stage: number; memo: FillMemo; now: number; n: number }): { key: string; question: TalkFillQuestion; id: string }[] {
  const out: { key: string; question: TalkFillQuestion; id: string }[] = [];
  const open = (id: string) => {
    const seen = options.memo[id];
    return !seen || (!seen.ok && options.now - seen.t >= 20 * 3600);
  };
  const make = (conv: readonly TalkFillLine[], at: number, cut: { start: number; end: number; answer: string }, extra: { key?: string; near?: string[]; was?: string; mine?: boolean }) => {
    const line = conv[at]!;
    const id = lineId(`${line.text}|${cut.answer}`);
    if (!open(id) || out.some((one) => one.id === id)) return;
    const lines = conv.slice(Math.max(0, at - 3), at + 1).map((one) => ({ who: one.who, text: one.text, ...(one.gloss ? { gloss: one.gloss } : {}) }));
    const shown = lines.slice(0, -1).map((one) => one.text.toLocaleLowerCase()).join(" ");
    if (shown.includes(cut.answer.toLocaleLowerCase())) return;
    const question: TalkFillQuestion = {
      kind: "talk",
      text: line.text,
      lines,
      at: lines.length - 1,
      before: line.text.slice(0, cut.start),
      after: line.text.slice(cut.start + cut.answer.length),
      answer: cut.answer,
      ...(extra.near?.length ? { near: extra.near } : {}),
      ...(extra.was ? { was: extra.was } : {}),
      ...(extra.mine ? { mine: true } : {}),
      from: extra.key ?? id,
    };
    out.push({ key: extra.key ?? id, question, id });
  };
  // ① 고침받은 내 줄.
  for (const conv of convs) {
    conv.forEach((line, at) => {
      if (out.length >= options.n || line.who !== "me" || !line.fixed || !line.was || at === 0) return;
      const cut = fixSpan(line.was, line.text, language);
      if (!cut) return;
      const hit = hitsIn(language, line.text, options.stage).find((one) => one.at <= cut.start && one.at + one.piece.length >= cut.end);
      make(conv, at, cut, { ...(hit ? { key: hit.key } : {}), ...(cut.wrong ? { near: [cut.wrong] } : {}), was: line.was, mine: true });
    });
  }
  // ② 소재가 든 튜터 줄. 고침받지 않은 내 줄은 맞는 문장인지 모르니 빈칸으로 내지 않는다(사용자 2026-11-28 — 틀린 내 말이 문제로 나옴).
  for (const conv of convs) {
    conv.forEach((line, at) => {
      if (out.length >= options.n || at === 0 || line.who !== "them") return;
      const hit = hitsIn(language, line.text, options.stage)[0];
      if (!hit) return;
      make(conv, at, { start: hit.at, end: hit.at + hit.piece.length, answer: hit.piece }, { key: hit.key });
    });
  }
  return out.slice(0, options.n);
}

const MEMO = "talkFill.v1";

export function readFillMemo(language: string): FillMemo {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(`${MEMO}.${language}`) ?? "{}") as FillMemo;
  } catch {
    return {};
  }
}

export function noteFill(language: string, id: string, ok: boolean, now: number): void {
  try {
    const memo = readFillMemo(language);
    memo[id] = { ok, t: now };
    const kept = Object.entries(memo).sort((a, b) => b[1].t - a[1].t).slice(0, 400);
    globalThis.localStorage?.setItem(`${MEMO}.${language}`, JSON.stringify(Object.fromEntries(kept)));
  } catch {
    // 이번에만.
  }
}
