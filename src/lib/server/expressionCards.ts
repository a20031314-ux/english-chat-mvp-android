/**
 * 표현 카드(2026-11-03 사용자 "표현을 퀴즈 쪽으로 — 1번 어휘 탭에 섞기"): 단계마다 그 단계 핵심 표현(stages expressions)에
 * 낱말 카드(server/wordCards.ts)와 같은 꼴 — 예문 한 줄·그 표현 꼴·뜻·예문 뜻 — 을 한 번 만들어 모두가 같이 쓴다(`exprcards:v2`).
 * 앱 언어가 영어가 아니면 뜻 둘을 옮겨 둔다. 학습자 글 없음.
 * 검사: 예문에 표현이 그대로(낱말 속이 아니게, quiz.ts pieceOf) 들고, 짧고, 뜻이 비어 있지 않고 표현을 그대로 베끼지 않은 줄만. 못 지킨 표현은 카드 없이 빠진다.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { textsFingerprint, translated } from "./stageCopy.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { deckExpressions } from "../curriculum/expressionDeck.ts";
import { pieceOf } from "../curriculum/quiz.ts";
import { segmentWords } from "../wordSegments.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";
import type { WordCard } from "./wordCards.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;

/** 카드 하나가 쓸 만한가(순수 — 테스트). */
export function expressionCardOk(language: string, card: WordCard): boolean {
  if (!card.example || !card.gloss || !card.exampleGloss) return false;
  if (card.example.length > 110) return false;
  if (pieceOf(card.example, card.w) !== card.piece) return false;
  // 뜻 칸에 표현을 그대로 옮겨 적은 것(번역 없음)은 버린다.
  if (card.gloss.trim().toLocaleLowerCase() === card.w.trim().toLocaleLowerCase()) return false;
  const words = segmentWords(card.example, language).length;
  return words >= 2 && words <= 16;
}

async function makeCards(language: string, expressions: readonly string[]): Promise<WordCard[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const completion = await completeChat(client, "translate", {
    temperature: 0.3,
    max_tokens: 6000,
    messages: [
      {
        role: "system",
        content: `You write flashcards for a learner of ${name}. Each numbered item is a fixed ${name} expression that people say as a whole. For each one, write what ONE person says in ONE turn of an everyday conversation (4 to 12 words) that contains the expression exactly as given, letter for letter (capital letters may differ). Never put two speakers in it: if the expression is normally a reply (like thanks, agreeing or answering), write only that reply, starting with the expression and adding a few words after it. The words around the expression must fit it naturally. Use simple, common words around it. No names of real people, brands or places, nothing rude. Then give the English meaning of the expression as people use it (2 to 8 words, the sense in conversation, not a word-by-word gloss) and a faithful, natural English translation of the sentence that keeps its meaning.
Answer with exactly one line per item, in the same order, as <number>|<sentence>|<English meaning of the expression>|<English translation of the sentence>, and nothing else.`,
      },
      { role: "user", content: expressions.map((text, index) => `${index + 1}|${text}`).join("\n") },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const byNumber = new Map<number, string[]>();
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*(\d+)\s*\|(.*)$/.exec(line);
    if (match) byNumber.set(Number(match[1]), match[2]!.split("|").map((part) => part.trim()));
  }
  const out: WordCard[] = [];
  expressions.forEach((text, index) => {
    const parts = byNumber.get(index + 1);
    if (!parts || parts.length < 3) return;
    const [example, gloss, exampleGloss] = parts as [string, string, string];
    const piece = pieceOf(example, text);
    if (!piece) return;
    const card: WordCard = { w: text, piece, example, gloss, exampleGloss };
    if (expressionCardOk(language, card)) out.push(card);
  });
  return out.length ? out : null;
}

/** 한 단계 표현 카드(문장구조와 같은 표현은 빠짐 — curriculum/expressionDeck.ts). 앱 언어가 영어가 아니면 뜻을 그 말로. */
export async function expressionCards(language: string, stage: number, ui: string, uiName: string, onMake?: () => void): Promise<WordCard[]> {
  if (!ladderFor(language)?.stages.some((one) => one.order === stage)) return [];
  const wanted = deckExpressions(language, stage)
    .filter((one) => one.stage === stage)
    .map((one) => one.text);
  if (!wanted.length) return [];
  const key = `exprcards:v2:${language}:${stage}`;
  let cards = await kvGetJson<WordCard[]>(key).catch(() => null);
  const have = new Set((cards ?? []).map((card) => card.w));
  const missing = wanted.filter((text) => !have.has(text));
  // 처음이거나, 빠진 표현이 남았으면(검사에서 버려진 것) 그것만 하루 한 번 다시. 처음 만들기가 실패해도 표시를 남겨
  // 요청마다 모델을 다시 부르지 않는다(실패면 30분 뒤 — 2026-11-03 변경 감시 major).
  const retryKey = `exprcards:v2:retry:${language}:${stage}`;
  const retried = missing.length ? await kvGetJson<number>(retryKey).catch(() => null) : null;
  if (!retried && (!cards?.length || missing.length)) {
    await kvSetJson(retryKey, 1, cards?.length ? 24 * 60 * 60 : 30 * 60).catch(() => undefined);
    onMake?.();
    const made = await makeCards(language, cards?.length ? missing : wanted).catch(() => null);
    if (made?.length) {
      // 같은 단계를 두 요청이 함께 만들면 먼저 저장된 것을 쓴다.
      const raced = await kvGetJson<WordCard[]>(key).catch(() => null);
      const base = Array.isArray(raced) && raced.length ? raced : (cards ?? []);
      const known = new Set(base.map((card) => card.w));
      cards = [...base, ...made.filter((card) => !known.has(card.w))];
      await kvSetJson(key, cards, TTL_SECONDS).catch(() => undefined);
    }
  }
  if (!cards?.length) return [];
  const order = new Map(wanted.map((text, index) => [text, index]));
  cards = cards.filter((card) => order.has(card.w)).sort((a, b) => order.get(a.w)! - order.get(b.w)!);
  if (ui === "en") return cards;
  const lines = cards.flatMap((card) => [card.gloss, card.exampleGloss]);
  const moved = await translated(lines, ui, uiName, `exprcards:v2:${language}:${stage}:${ui}:${textsFingerprint(lines)}`, onMake);
  if (!moved) return cards;
  return cards.map((card, index) => ({ ...card, gloss: moved[index * 2]!, exampleGloss: moved[index * 2 + 1]! }));
}
