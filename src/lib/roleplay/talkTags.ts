/**
 * 통화 처음 줄 표시(2026-11-07 밤 사용자 "사용한 표현이나 문법 요소가 많아지는가(단순 단어 조합에서 뭘 활용할지를 아는가)" ·
 * "같거나 비슷한 튜터의 질문에 대한 대답" → "진행해줘"). 서버(통화 끝 튜터 메모 호출 /api/roleplay/context final)와 앱이 같이 쓴다.
 *
 * - 앱이 그 통화 처음 OPENING_LINES줄(튜터·나)을 번호와 함께 보낸다.
 * - 같은 호출이 (1) 내 줄마다 맞게 쓴 문법 칸(그 학습 언어 단계 문법 목록의 id "단계:번호" → 열쇠 g|단계:번호),
 *   (2) 튜터 줄 가운데 묻는 줄마다 질문 종류(QUESTION_KINDS)를 고른다. 호출 수는 그대로.
 * - 지금 감지기(recap.ts recapLedgerKeys — 커리큘럼 틀과 똑같은 줄만)는 과거형·because·want to 같은 것을 거의 못 잡아(2026-11-07 확인) 이 표시가 문법 쪽 재료.
 */
import { ladderFor } from "../curriculum/stages/index.ts";

export const OPENING_LINES = 20;
export const QUESTION_KINDS = ["day", "weekend", "past", "plans", "work", "study", "food", "travel", "hobby", "family", "home", "feelings", "opinion", "other"] as const;
export type QuestionKind = (typeof QUESTION_KINDS)[number];
export type OpeningLine = { who: "tutor" | "learner"; text: string };
/** 줄 번호(0부터, 보낸 처음 줄 안) → 열쇠 / 질문 종류. */
export type TalkTags = { uses: Record<number, string[]>; asks: Record<number, QuestionKind> };

/** 그 학습 언어 단계 문법 목록: id "단계:번호" · 영어 이름. */
export function grammarList(language: string): { id: string; name: string }[] {
  return (ladderFor(language)?.stages ?? []).flatMap((stage) => stage.grammar.map((grammar, index) => ({ id: `${stage.order}:${index}`, name: grammar.name.en ?? Object.values(grammar.name)[0] ?? "" }))).filter((one) => one.name);
}

/** 서버: 보낸 처음 줄(자리 그대로 — 빈 줄도 번호는 지킴). */
export function readOpening(raw: unknown): OpeningLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, OPENING_LINES).map((line) => {
    const record = (typeof line === "object" && line !== null ? line : {}) as { who?: unknown; text?: unknown };
    return { who: record.who === "learner" ? "learner" : "tutor", text: typeof record.text === "string" ? record.text.trim().slice(0, 300) : "" };
  });
}

/** 튜터 메모 지시에 덧붙일 몫(처음 줄이 없으면 ""). 예문을 넣지 않는다(RULES — 베낄 문장 없음). */
export function tagPrompt(language: string, opening: readonly OpeningLine[]): string {
  if (!opening.some((line) => line.who === "learner" && line.text)) return "";
  const list = grammarList(language);
  const lines = opening.map((line, i) => (line.text ? `${i}. ${line.who === "tutor" ? "You" : "Them"}: ${line.text}` : "")).filter(Boolean).join("\n");
  return `
The first lines of this call, numbered:
${lines}

Also write "uses": for each numbered "Them" line, the grammar points from this list that the line really uses and gets right (the form is there and correct, not only a word from it). Use the ids only. A line that is only words without a sentence structure, or that gets the form wrong, gets an empty list.
${list.map((one) => `${one.id} ${one.name}`).join("\n")}
Write it as {"<line number>": ["<id>"]}, only for "Them" lines.
Also write "asks": for each numbered "You" line that asks them something, what it asks about, from this list only: ${QUESTION_KINDS.join(", ")} (day = how their day is or was; past = something they did, not the weekend; opinion = what they think or prefer). Write it as {"<line number>": "<kind>"}.`;
}

/** 서버·앱: 모델 답의 uses·asks — 목록 안 id·종류만, 맞는 쪽 줄에만. */
export function readTags(language: string, opening: readonly OpeningLine[], raw: { uses?: unknown; asks?: unknown }): TalkTags {
  const ids = new Set(grammarList(language).map((one) => one.id));
  const uses: Record<number, string[]> = {};
  const asks: Record<number, QuestionKind> = {};
  if (raw.uses && typeof raw.uses === "object") {
    for (const [at, value] of Object.entries(raw.uses as Record<string, unknown>)) {
      const i = Number(at);
      if (!Number.isInteger(i) || opening[i]?.who !== "learner" || !Array.isArray(value)) continue;
      const keys = [...new Set(value.filter((one): one is string => typeof one === "string" && ids.has(one)))].slice(0, 4).map((id) => `g|${id}`);
      if (keys.length) uses[i] = keys;
    }
  }
  if (raw.asks && typeof raw.asks === "object") {
    for (const [at, value] of Object.entries(raw.asks as Record<string, unknown>)) {
      const i = Number(at);
      if (!Number.isInteger(i) || opening[i]?.who !== "tutor" || typeof value !== "string" || !(QUESTION_KINDS as readonly string[]).includes(value)) continue;
      asks[i] = value as QuestionKind;
    }
  }
  return { uses, asks };
}
