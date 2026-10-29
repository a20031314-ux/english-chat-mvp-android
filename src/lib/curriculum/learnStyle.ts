/**
 * "이 부분은 이렇게 익히는 게 좋다"(2026-10-29 사용자 → "1번 2번 만들어줘"): 학습 조합이 "알아서"일 때 퀴즈 세 문제의 모양.
 *
 * 1) 항목 성격별 기본 순서(모두 같음):
 *    낱말(두 낱말까지)      뜻 고르기 → 듣고 고르기 → 말하기   (뜻·소리를 묶고 꺼냄)
 *    문법·문장구조          맞추기 → 빈칸 → 말하기             (어순·형태를 조립부터)
 *    덩어리 표현(긴 표현)    듣고 고르기 → 말하기 → 말하기       (쪼개지 말고 통째로)
 *    높임·말투가 갈리는 말   빈칸 → 뜻 고르기 → 말하기           (언제 쓰는지)
 *    소리가 까다로운 말      듣고 고르기 → 듣고 고르기 → 말하기  (성조·장음·촉음·목구멍소리)
 *    높임·소리는 언어마다 짧은 목록(REGISTER·SOUND)으로, 없는 언어는 앞의 셋만.
 * 2) 사람마다 고치기: 그 열쇠를 이 폰에서 모양별로 맞히고 틀린 기록(KindLog)에서 가장 약한 모양을 앞에 두 번 —
 *    고르기는 되는데 말하기가 틀리면 말하기 둘, 듣기가 틀리면 듣기 둘, 맞추기가 틀리면 맞추기 둘.
 *    앞 모양들을 두 번 넘게 다 맞혔으면 쉬운 모양을 건너뛰고 말하기 위주.
 * 화면에 설명은 띄우지 않는다(조합 "알아서"가 조용히 이 순서로). 문장은 남기지 않음 — 열쇠·모양·횟수만, 이 폰에.
 */
import type { QuizQuestion } from "./quiz.ts";
import { isWordish } from "../notes/stageParts.ts";

export type ItemStyle = "word" | "structure" | "chunk" | "register" | "sound";
type Kind = QuizQuestion["kind"];

export const STYLE_KINDS: Record<ItemStyle, Kind[]> = {
  word: ["meaning", "listen", "say"],
  structure: ["order", "choose", "say"],
  chunk: ["listen", "say", "say"],
  register: ["choose", "meaning", "say"],
  sound: ["listen", "listen", "say"],
};

/** 높임·말투가 갈리는 표지(학습 언어). */
const REGISTER: Record<string, RegExp> = {
  ja: /(です|ます|ございます|いただ|ください|お願い|おっしゃ|いらっしゃ)/u,
  ko: /(습니다|세요|십시오|드리|께서|여쭤)/u,
  en: /\b(could you|would you|may i|i'd like|would you mind|excuse me)\b/iu,
  es: /\b(usted|ustedes|podría|quisiera|disculpe)\b/iu,
  fr: /\b(vous|voudrais|pourriez|excusez)\b/iu,
  de: /\b(Sie|Ihnen|könnten|würden)\b/u,
  th: /(ครับ|ค่ะ|คะ|ขอ)/u,
  zh: /(您|请|麻烦)/u,
  vi: /\b(ạ|dạ|xin)\b/iu,
  id: /\b(bapak|ibu|mohon|silakan)\b/iu,
};

/** 소리가 까다로운 말(학습 언어 글자 모양으로 가늠). */
const SOUND: Record<string, RegExp> = {
  ja: /[っッー]|おう|えい|ゅう|ょう/u,
  th: /[่-๋]/u,
  zh: /^[\p{Script=Han}]{1,2}$/u,
  ar: /[عحقخغضظطص]/u,
  vi: /[ảẩẳẻểỉỏổởủửỷãẫẵẽễĩõỗỡũữỹ]/iu,
};

export function itemStyle(language: string, key: string): ItemStyle {
  if (key.startsWith("f|") || key.startsWith("g|")) return "structure";
  const text = key.slice(2);
  if (REGISTER[language]?.test(text)) return "register";
  if (SOUND[language]?.test(text)) return "sound";
  return isWordish(text, language) ? "word" : "chunk";
}

/** 열쇠 → 모양 → [맞힘, 푼 수](이 폰). */
export type KindLog = Record<string, Partial<Record<Kind, [number, number]>>>;
const KIND_LOG_KEY = "quizKinds.v1";
const KIND_LOG_MAX = 400;

export function recordKind(log: KindLog, key: string, kind: Kind, right: boolean): KindLog {
  const row = { ...(log[key] ?? {}) };
  const [r, n] = row[kind] ?? [0, 0];
  row[kind] = [r + (right ? 1 : 0), n + 1];
  const next = { ...log, [key]: row };
  const keys = Object.keys(next);
  if (keys.length > KIND_LOG_MAX) for (const old of keys.slice(0, keys.length - KIND_LOG_MAX)) delete next[old];
  return next;
}

/** 이 열쇠의 세 문제 모양: 기본 순서를 그 사람 기록으로 고친 것. */
export function styleKinds(language: string, key: string, log?: KindLog | null): Kind[] {
  const base = STYLE_KINDS[itemStyle(language, key)];
  const row = log?.[key];
  if (!row) return base;
  const tried = (Object.entries(row) as [Kind, [number, number]][]).filter(([, [, n]]) => n > 0);
  const weak = tried.filter(([, [r, n]]) => r < n).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0]?.[0];
  if (weak) {
    if (weak === "say") return ["say", "say", base.find((k) => k !== "say") ?? "choose"];
    return [weak, weak, "say"];
  }
  // 기본 순서의 말하기 아닌 모양을 모두 두 번 넘게 맞혔으면 말하기 위주.
  const easy = base.filter((k) => k !== "say");
  if (easy.length && easy.every((k) => (row[k]?.[0] ?? 0) >= 2)) return ["say", "say", base[0]!];
  return base;
}

export function readKindLog(language: string): KindLog {
  try {
    return (JSON.parse(localStorage.getItem(`${KIND_LOG_KEY}.${language}`) ?? "null") as KindLog | null) ?? {};
  } catch {
    return {};
  }
}

export function saveKind(language: string, key: string, kind: Kind, right: boolean): void {
  try {
    localStorage.setItem(`${KIND_LOG_KEY}.${language}`, JSON.stringify(recordKind(readKindLog(language), key, kind, right)));
  } catch {
    // 남기지 못하면 다음엔 기본 순서로.
  }
}
