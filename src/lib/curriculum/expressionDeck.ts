/**
 * Quizbank 어휘 탭에 섞는 표현(2026-11-03 사용자 "표현을 퀴즈 쪽으로 편입 — 어휘 탭에 섞기"):
 * 단계 데이터의 핵심 표현(stages expressions) 중 **통째로 외우는 덩어리**만. 문장구조와 사실상 같은 표현
 * ("are you free on" = 문장구조 "Are you free on ___?")은 문장구조에서 배우므로 뺀다.
 * 순수 모듈 — 화면(TodayPlan)·서버(expressionCards)·테스트가 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { ladderFor } from "./stages/index.ts";

export type DeckExpression = { key: string; text: string; stage: number };

const norm = (text: string) =>
  text
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * 이 표현이 문장구조와 사실상 같은가: 표현을 가리키는 틀에서 빈칸(___)을 뺀 말이 표현과 같거나, 표현이 그 틀을 채운 꼴일 때
 * ("are you free on" = "Are you free on ___?", "how was your weekend" = "How was your ___?" 채움).
 * 틀의 일부일 뿐인 인사·덩어리("gracias" ⊂ "Gracias por ___", "last night" ⊂ "Last night I ___")는 따로 외우는 표현으로 남긴다.
 */
export function isFrameExpression(language: string, expression: string): boolean {
  const target = norm(expression);
  if (!target) return false;
  for (const frame of allFramesFor(language)) {
    if (!frame.expressions?.includes(expression)) continue;
    const fixed = norm(frame.pattern.replace(/_{2,}/g, " "));
    if (!fixed) continue;
    if (target === fixed || target.startsWith(`${fixed} `)) return true;
    // 띄어 쓰지 않는 말(ja·zh·th): 빈칸이 끝에 있는 틀이면 앞머리, 앞에 있는 틀이면 끝머리.
    if (!/\s/.test(fixed) && fixed.length >= 2) {
      const blankFirst = frame.pattern.trim().startsWith("_");
      if (blankFirst ? target.endsWith(fixed) : target.startsWith(fixed)) return true;
    }
  }
  return false;
}

/** 1~upTo단계 덩어리 표현(단계 순 → 단계 안 목록 순). */
export function deckExpressions(language: string, upTo: number): DeckExpression[] {
  const out: DeckExpression[] = [];
  const seen = new Set<string>();
  for (const stage of ladderFor(language)?.stages ?? []) {
    if (stage.order > upTo) break;
    for (const text of stage.expressions) {
      if (seen.has(text) || isFrameExpression(language, text)) continue;
      seen.add(text);
      out.push({ key: `e|${text}`, text, stage: stage.order });
    }
  }
  return out;
}

/** 어휘 묶음 하나에 섞을 표현 수(낱말 묶음 크기에 대해): 표현이 남았으면 한 개. */
export const EXPRESSIONS_PER_BATCH = 1;

/** 낼 다음 표현(아직 안 본 것 — seen: 원에 기록이 있거나 이미 앎, ready: 카드가 온 것). */
export function nextExpressions(
  deck: readonly DeckExpression[],
  options: {
    seen: (key: string) => boolean;
    ready: (key: string) => boolean;
    skip?: ReadonlySet<string>;
    n?: number;
    /**
     * 이 단계부터(첫 측정 표현 단계): 그 아래 단계 표현은 위 단계를 다 낸 뒤에야.
     * 2026-11-09 측정: es·ar 표현 5단계인데 hola·gracias가 1단계부터 차례로 — 80문제 중 17개.
     */
    from?: number;
  },
): string[] {
  const n = options.n ?? EXPRESSIONS_PER_BATCH;
  const out: string[] = [];
  const from = options.from ?? 0;
  const ordered = from > 1 ? [...deck.filter((one) => one.stage >= from), ...deck.filter((one) => one.stage < from)] : deck;
  for (const one of ordered) {
    if (out.length >= n) break;
    if (options.skip?.has(one.key) || options.seen(one.key) || !options.ready(one.key)) continue;
    out.push(one.key);
  }
  return out;
}
