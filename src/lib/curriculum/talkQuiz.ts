/**
 * 대화에서 온 퀴즈(2026-11-01 사용자 "예문을 통화탭·채팅탭에서 생성되는 문장으로" → "문맥 문제는 대화를 떼 와서 보여 주는 식" → "진행해줘").
 *
 * ① 이 폰에서만(A): AI 채팅·AI 통화 기록(둘 다 이 폰에 있음 — ChatWindow conversationSessions · roleplay/callStore)에서
 *    Quizbank 소재(문장구조 조각·단계 핵심 표현)가 든 줄을 찾아, 그 앞 두세 줄과 함께 대화 조각으로 보여 주고 그 조각을 비운다.
 *    빈칸 줄 = 튜터 줄 또는 내가 고침받은 줄의 고친 꼴(내가 틀렸던 자리를 다시 써 봄). 대화 어디에도 정답이 그대로 보이면 안 냄.
 * ② 모두의 문제은행(B-1): 튜터 줄 중 앞 대화 없이 서는 것만, 폰에서 한 번 거른 뒤(shareable — 모든 낱말이 빈도 목록 안·숫자 없음·
 *    내 프로필 낱말 없음) 서버로 보내고, 서버가 한 번 더 판정해(개인 정보·민감한 내용·문맥 의존) 통과한 것만 더한다(server/qbank.ts offers).
 *    내가 쓴 줄은 보내지 않는다. 설정 talkShare(기본 켬, AI 대화 ⋮에서 끔).
 * 순수 함수(대화 읽기만 브라우저) — 화면(TodayPlan)·테스트가 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { ladderFor } from "./stages/index.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { nearOf, pieceAt, pieceOf, rng, shuffled, type QuizQuestion } from "./quiz.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type TalkLine = { who: "me" | "them"; text: string; gloss?: string; fixed?: boolean };
export type TalkQuestion = Extract<QuizQuestion, { kind: "talk" }>;

/** 빈칸 줄 앞에 보여 주는 줄 수. */
export const TALK_BEFORE = 3;

const lower = (text: string) => text.toLocaleLowerCase();

/** 줄 다듬기: 마크다운 표시·줄바꿈을 걷고, 너무 길거나 빈 줄은 버림. */
export function cleanLine(text: string): string {
  return text
    .replace(/\*\*|__|`|^#+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

type Hit = { key: string; piece: string; at: number };

/** 줄 안의 소재 자리(지금 단계까지의 문장구조 조각·핵심 표현). */
export function hitsIn(language: string, text: string, stage: number): Hit[] {
  const hits: Hit[] = [];
  for (const frame of allFramesFor(language)) {
    if (frame.stage > stage) continue;
    const piece = frame.core.find((core) => core && core.length >= 2 && text.includes(core));
    if (!piece) continue;
    const at = pieceAt(text, piece, language);
    if (at >= 0) hits.push({ key: `f|${frame.id}`, piece, at });
  }
  for (const step of ladderFor(language)?.stages ?? []) {
    if (step.order > stage) continue;
    for (const expression of step.expressions) {
      const piece = pieceOf(text, expression);
      if (!piece) continue;
      const at = pieceAt(text, piece, language);
      if (at >= 0) hits.push({ key: `e|${expression}`, piece, at });
    }
  }
  return hits;
}

function typeable(language: string, piece: string): boolean {
  if ((language === "ja" || language === "zh") && /\p{Script=Han}/u.test(piece)) return false;
  return isSpaceless(piece) ? [...piece].length <= 8 : segmentWords(piece, language).length <= 3 && piece.length <= 24;
}

/** 대화 조각 안에 그 조각이 또 있나(빈칸 줄의 그 자리 말고) — 있으면 답이 보임. */
function shownElsewhere(lines: readonly TalkLine[], at: number, hit: Hit, language: string): boolean {
  const target = lines[at]!.text;
  const rest = target.slice(0, hit.at) + " ".repeat(hit.piece.length) + target.slice(hit.at + hit.piece.length);
  const others = [...lines.filter((_, i) => i !== at).map((line) => line.text), rest];
  if (isSpaceless(hit.piece)) return others.some((text) => text.includes(hit.piece));
  return others.some((text) => pieceAt(lower(text), lower(hit.piece), language) >= 0);
}

export type TalkOptions = {
  stage: number;
  seed: string;
  /** 이 탭의 소재인가(문법 = f|, 표현 = e|). */
  wants: (key: string) => boolean;
  /** 먼저 낼 순서(작을수록 먼저). */
  rank?: (key: string) => number;
  /** 이번에 이미 낸 줄. */
  avoid?: ReadonlySet<string>;
};

/** 대화 조각 빈칸 한 문제(없으면 null). conversations = 대화마다 줄(오래된 것 → 최근). */
export function talkOf(language: string, conversations: readonly (readonly TalkLine[])[], options: TalkOptions): { question: TalkQuestion; key: string } | null {
  const random = rng(`${options.seed}|talk`);
  const picks: { conv: readonly TalkLine[]; at: number; hit: Hit; score: number }[] = [];
  for (const conv of conversations) {
    conv.forEach((line, at) => {
      // 빈칸 줄: 튜터 줄, 또는 고친 꼴이 된 내 줄(그대로의 내 줄은 틀렸을 수 있어 비우지 않음).
      if (line.who === "me" && !line.fixed) return;
      if (!line.text || line.text.length > 140 || options.avoid?.has(line.text)) return;
      const words = segmentWords(line.text, language);
      if (words.length < 3 || words.length > 20) return;
      for (const hit of hitsIn(language, line.text, options.stage)) {
        if (!options.wants(hit.key)) continue;
        const window = conv.slice(Math.max(0, at - TALK_BEFORE), at + 1);
        if (shownElsewhere(window, window.length - 1, hit, language)) continue;
        const near = nearOf(language, hit.key, hit.piece).filter((one) => lower(one) !== lower(hit.piece) && !lower(line.text).includes(lower(one)));
        if (!typeable(language, hit.piece) && near.length < 2) continue;
        picks.push({ conv, at, hit, score: options.rank?.(hit.key) ?? 0 });
      }
    });
  }
  if (!picks.length) return null;
  // 먼저 낼 소재부터, 같으면 내가 틀렸던 줄(고친 꼴) 먼저, 그다음 섞어서.
  const ordered = shuffled(picks, random).sort((a, b) => a.score - b.score || Number(Boolean(b.conv[b.at]!.fixed)) - Number(Boolean(a.conv[a.at]!.fixed)));
  const pick = ordered[0]!;
  const line = pick.conv[pick.at]!;
  const lines = pick.conv.slice(Math.max(0, pick.at - TALK_BEFORE), pick.at + 1).map((one) => ({ who: one.who, text: one.text, ...(one.gloss ? { gloss: one.gloss } : {}) }));
  const near = nearOf(language, pick.hit.key, pick.hit.piece).filter((one) => lower(one) !== lower(pick.hit.piece) && !lower(line.text).includes(lower(one)));
  const choices = typeable(language, pick.hit.piece) ? undefined : shuffled([pick.hit.piece, ...shuffled(near, random).slice(0, 2)], random);
  return {
    key: pick.hit.key,
    question: {
      kind: "talk",
      text: line.text,
      lines,
      at: lines.length - 1,
      before: line.text.slice(0, pick.hit.at),
      after: line.text.slice(pick.hit.at + pick.hit.piece.length),
      answer: pick.hit.piece,
      ...(near.length ? { near } : {}),
      ...(choices ? { options: choices } : {}),
      ...(line.fixed ? { mine: true } : {}),
      from: "talk",
    },
  };
}

/**
 * 모두의 문제은행에 보내도 되는 튜터 줄인가(폰에서 먼저 거름 — 서버가 한 번 더 판정).
 * known = 이 언어 빈도 낱말 목록(소문자) — 모든 낱말이 그 안에 있어야(사람·동네·회사 이름은 대부분 목록 밖). mine = 내 프로필·자기소개 낱말.
 */
export function shareable(language: string, line: TalkLine, known: ReadonlySet<string>, mine: ReadonlySet<string> = new Set()): boolean {
  if (line.who !== "them" || !line.text || line.text.length > 120) return false;
  if (/[\p{Nd}@#]|https?:|www\./u.test(line.text)) return false;
  // 사람을 부르는 꼴(이름 뒤 존칭) — 띄어쓰기 없는 말은 이름이 낱말 목록을 통과하기도 해서.
  if (/(さん|さま|様|くん|ちゃん|先生|小姐|女士|씨|님)(?=[\s\p{P}は가이을를에의도와과]|$)/u.test(line.text)) return false;
  const words = segmentWords(line.text, language)
    .map((word) => lower(word).replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter((word) => word && /[\p{L}]/u.test(word));
  if (words.length < 3 || words.length > 16) return false;
  return words.every((word) => (known.has(word) || known.has(word.replace(/['’].*$/, ""))) && !mine.has(word));
}

/**
 * 거를 때 쓰는 "흔한 낱말" 모음: 빈도 목록(사전형) + 앱 대본·문장구조 예문에 나온 꼴(are·did·sounds처럼 활용된 꼴을 받으려고).
 * 대소문자가 있는 글자는 소문자로 나온 꼴만 더한다(대본 속 사람 이름은 늘 대문자라 안 들어감).
 */
const commonCache = new Map<string, Set<string>>();
export function commonWords(language: string, frequency: readonly string[]): Set<string> {
  const cacheKey = `${language}|${frequency.length}`;
  const have = commonCache.get(cacheKey);
  if (have) return have;
  const out = new Set(frequency.map((word) => lower(word)));
  const texts = [...allScriptsFor(language).flatMap((script) => script.lines.map((line) => line.text)), ...allFramesFor(language).flatMap((frame) => frame.examples.map((example) => example.text))];
  for (const text of texts) {
    for (const raw of segmentWords(text, language)) {
      const word = raw.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");
      if (!word || !/\p{L}/u.test(word)) continue;
      const cased = word !== word.toLocaleUpperCase() || word !== word.toLocaleLowerCase();
      if (cased && word !== lower(word)) continue;
      out.add(lower(word));
    }
  }
  commonCache.set(cacheKey, out);
  return out;
}

// ---------- 이 폰의 대화 읽기(브라우저) ----------

type ChatMessage = { role?: string; content?: string };
type ChatSession = { languageCode?: string; messages?: ChatMessage[] };
type CallLine = { who?: string; text?: string; translation?: string; better?: string };
type Call = { language?: string; said?: CallLine[] };

/** 채팅 기록 한 대화 → 줄(내 줄은 고친 꼴이 있으면 그것으로, fixed). */
export function chatLines(session: ChatSession): TalkLine[] {
  const out: TalkLine[] = [];
  for (const message of session.messages ?? []) {
    if (message.role === "user") {
      const text = cleanLine(message.content ?? "");
      if (text) out.push({ who: "me", text });
      continue;
    }
    if (message.role !== "assistant") continue;
    try {
      const body = JSON.parse(message.content ?? "{}") as { assistantMessage?: string; correctionResult?: { corrected?: string; hasError?: boolean } | null; fromHowToSay?: boolean; ownLanguage?: boolean };
      if (body.fromHowToSay) continue;
      // 바로 앞 내 줄을 고친 꼴로(틀렸을 때만).
      const fix = body.correctionResult;
      const last = out[out.length - 1];
      if (fix?.hasError && fix.corrected && last?.who === "me" && !body.ownLanguage) out[out.length - 1] = { who: "me", text: cleanLine(fix.corrected), fixed: true };
      else if (body.ownLanguage && last?.who === "me") out.pop();
      const reply = cleanLine(body.assistantMessage ?? "");
      if (reply) out.push({ who: "them", text: reply });
    } catch {
      // 옛 모양은 건너뜀.
    }
  }
  return out;
}

/** 통화 기록 한 통화 → 줄(내 줄은 더 나은 꼴이 있으면 그것으로). */
export function callLines(call: Call): TalkLine[] {
  return (call.said ?? []).flatMap((line): TalkLine[] => {
    const text = cleanLine(line.text ?? "");
    if (!text || text === "…") return [];
    if (line.who === "tutor") return [{ who: "them", text, ...(line.translation ? { gloss: line.translation } : {}) }];
    return line.better ? [{ who: "me", text: cleanLine(line.better), fixed: true }] : [{ who: "me", text }];
  });
}

/** 이 폰의 이 학습 언어 대화들(채팅 기록 + 통화 기록, 최근 30개). */
export function readTalks(language: string): TalkLine[][] {
  const out: TalkLine[][] = [];
  try {
    const sessions = JSON.parse(globalThis.localStorage?.getItem("conversationSessions") ?? "[]") as ChatSession[];
    for (const session of Array.isArray(sessions) ? sessions : []) if (session?.languageCode === language) out.push(chatLines(session));
  } catch {
    // 없음.
  }
  try {
    const calls = JSON.parse(globalThis.localStorage?.getItem("roleplayConversations") ?? "[]") as Call[];
    for (const call of Array.isArray(calls) ? calls : []) if (call?.language === language) out.push(callLines(call));
  } catch {
    // 없음.
  }
  return out.filter((conv) => conv.length >= 2).slice(0, 30);
}

/** 대화 문장을 모두의 예문으로 보낼지(기본 켬, AI 대화 ⋮에서 끔). */
export const TALK_SHARE_KEY = "talkShare.v1";
export function talkShareOn(): boolean {
  try {
    return globalThis.localStorage?.getItem(TALK_SHARE_KEY) !== "off";
  } catch {
    return false;
  }
}
export function setTalkShare(on: boolean): void {
  try {
    globalThis.localStorage?.setItem(TALK_SHARE_KEY, on ? "on" : "off");
  } catch {
    // 이번에만.
  }
}
