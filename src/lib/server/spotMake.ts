/**
 * 틀린 곳 고르기 문항 미리 만들기 — 서버(퀴즈 다시 짜기 2단계, hub/work/drafts/quiz-redesign-2026-11-10.md §4 "만드는 때").
 * 사용자 2026-11-10 "그 유형이 나오기 전 타이밍에 미리 생성, 이후 일괄 적용" · "크레딧 API 써도 돼".
 *
 * 앱이 묶음을 짤 때 몇 문제 뒤에 낼 사전 예문(ref `w|낱말#0`)과 종류(form·meaning)를 부른다 → 모두가 같이 쓰는 `spot:v1:<언어>:<ref>:<종류>`에
 * 이미 있으면 그대로, 없으면 바꾸기(spotMake, Haiku) → 형식 검사(spotErrors.ts spotProblems) → 판정(spotJudge, Sonnet) → 통과만 저장.
 * 떨어진 문장은 {bad} 표시로 다시 안 만든다. 같은 문장 동시 요청은 잠금 한 번. 하루 전체 DAILY_BUDGET번까지. 학습자 글은 받지 않음(문장은 앱 사전 예문).
 */
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { kvGetJson, kvIncrBy, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";
import { loadWordSentences } from "../curriculum/wordSentencesLoad.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { spotCells, spotProblems, type SpotItem, type SpotKind, type SpotType } from "../curriculum/spotErrors.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
export const DAILY_BUDGET = 300;
const LOCK_SECONDS = 90;

export type SpotWant = { ref: string; type: SpotType; stage: number; g?: string };
export type SpotStored = { item: SpotItem } | { bad: string };

const storeKey = (language: string, want: SpotWant) => `spot:v1:${language}:${want.ref}:${want.type}`;

export async function spotStored(language: string, want: SpotWant): Promise<SpotStored | null> {
  return kvGetJson<SpotStored>(storeKey(language, want));
}

/** 그 언어 그 단계까지의 문법 칸(이름 en) — 꼴 틀림 지시에 씀. */
function grammarList(language: string, stage: number): string {
  const ladder = ladderFor(language);
  return (ladder?.stages ?? [])
    .filter((one) => one.order <= stage)
    .flatMap((one) => one.grammar.map((g, i) => `g|${one.order}:${i} ${g.name.en}`))
    .join("\n");
}

function parseJson(raw: string): Record<string, unknown> | null {
  const at = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (at < 0 || end < at) return null;
  try {
    return JSON.parse(raw.slice(at, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const KINDS: SpotKind[] = ["form", "particle", "order", "word", "missing", "spell", "agree", "tense", "article"];

/**
 * 하나 만들기: 있으면 그대로, 없으면 바꾸기 → 검사 → 판정. meter는 모델을 부를 때마다(앱 경로가 meterRequest로 셈).
 * 돌려줌: 통과한 문항 · null(잠김·예산 끝·재료 없음 — 앱은 그 자리에 다른 유형).
 */
export async function makeSpot(language: string, want: SpotWant, meter: () => void): Promise<SpotItem | null> {
  const key = storeKey(language, want);
  const have = await kvGetJson<SpotStored>(key);
  if (have) return "item" in have ? have.item : null;
  const [word, index] = want.ref.split("#");
  const book = await loadWordSentences(language);
  const source = book?.[word ?? ""]?.[Number(index) || 0];
  if (!source?.text || !source.en) return null;
  if (!(await kvSetJsonIfAbsent(`spot:v1:lock:${language}:${want.ref}:${want.type}`, 1, LOCK_SECONDS))) return null;
  const day = new Date().toISOString().slice(0, 10);
  if ((await kvIncrBy(`spot:v1:budget:${day}`, 1, 3 * 24 * 60 * 60)) > DAILY_BUDGET) return null;
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const cells = spotCells(source.text, language);
  const numbered = cells.map((cell, i) => `${i}:${cell}`).join("  ");
  meter();
  const made = await completeChat(client, "spotMake", {
    temperature: 0.6,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content:
          want.type === "form"
            ? `You make "find the wrong word" quiz items for learners of ${name} (level ${want.stage} of 5). Change exactly ONE cell of the given sentence into a common LEARNER MISTAKE of form (conjugation, agreement, particle/case, article, tense, word order inside the cell) from one of these grammar points:\n${grammarList(language, want.stage)}\nThe changed sentence must be unambiguously wrong — never a form that is also acceptable (no contraction, colloquial, regional, politeness or tense variant that still works). Everything else stays exactly as is.\nAnswer JSON only: {"at":<cell index>,"wrong":"<the wrong text now in that cell, no punctuation>","right":"<original correct text>","kind":"${KINDS.join("|")}","g":"<grammar key or empty>","why_en":"<one short line: the rule, without quoting the correct form>","why_ko":"<same in Korean>"}`
            : `You make "find the word that doesn't fit the context" quiz items for learners of ${name} (level ${want.stage} of 5). Replace exactly ONE content word of the given sentence with a word that is grammatically fine but CONTRADICTS the sentence's logic (usually an opposite: fast↔slow, more↔less, early↔late). Same part of speech, similar frequency and length, correctly inflected. There must be a clue in the sentence (because, but, so, too…to, a purpose) that makes only the original word fit, and changing the clue cell must NOT also repair the sentence. If the sentence has only one clue, write "lead": one short sentence in ${name} (simple words) that comes before it and fixes the clue's meaning. If no good item is possible, answer {"skip":true}.\nAnswer JSON only: {"at":<cell index>,"wrong":"<new word, no punctuation>","right":"<original word>","clue":[<clue cell indices>],"lead":"<sentence or empty>","why_en":"<one short line about the logic, without quoting the original word>","why_ko":"<same in Korean>"}`,
      },
      { role: "user", content: `Sentence: ${source.text}\nMeaning: ${source.en}\nCells: ${numbered}` },
    ],
  }).catch(() => null);
  const out = parseJson(String(made?.choices[0]?.message?.content ?? ""));
  if (!out || out.skip) {
    await kvSetJson(key, { bad: "skip" } satisfies SpotStored, TTL_SECONDS);
    return null;
  }
  const at = Number(out.at);
  const right = str(out.right);
  const wrong = str(out.wrong);
  const cell = cells[at] ?? "";
  if (!cell || !right || !cell.includes(right)) {
    await kvSetJson(key, { bad: "cell" } satisfies SpotStored, TTL_SECONDS);
    return null;
  }
  const line = source.text.replace(cell, cell.replace(right, wrong));
  const lead = str(out.lead);
  const clue = Array.isArray(out.clue) ? out.clue.map(Number).filter((n) => Number.isInteger(n)) : undefined;
  const kind = KINDS.includes(out.kind as SpotKind) ? (out.kind as SpotKind) : want.type === "meaning" ? "word" : "form";
  const g = /^g\|\d+:\d+$/.test(str(out.g)) ? str(out.g) : want.g;
  const item: SpotItem = {
    id: `${language}-x-${want.ref}-${want.type}`,
    stage: want.stage,
    shape: want.type === "meaning" && lead ? "l" : "s",
    src: want.ref,
    ...(want.type === "meaning" && lead ? { lead } : {}),
    lines: [line],
    errors: [{ line: 0, at, wrong, right, type: want.type, kind, ...(g && want.type === "form" ? { g } : {}), ...(want.type === "meaning" ? { w: word } : {}), why: { en: str(out.why_en), ko: str(out.why_ko) } }],
    ...(want.type === "meaning" && clue?.length ? { clue } : {}),
    gloss: { en: source.en, ko: source.ko ?? source.en },
  };
  // 바꾼 뒤 칸이 달라졌으면(띄어쓰기 없는 언어) 다시 맞춤.
  const after = spotCells(line, language);
  const moved = after.findIndex((one) => one.includes(wrong));
  if (moved >= 0) item.errors[0]!.at = moved;
  const problems = spotProblems(item, language);
  if (problems.length) {
    await kvSetJson(key, { bad: `form ${problems.join(",")}` } satisfies SpotStored, TTL_SECONDS);
    return null;
  }
  meter();
  const judged = await completeChat(client, "spotJudge", {
    temperature: 0,
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content: `You are a strict native ${name} teacher checking a quiz item. The learner must find the ONE wrong cell. Check: (1) the marked cell is clearly wrong as written; (2) it cannot be read as acceptable in any register or interpretation; (3) every other cell is correct and the whole sentence becomes natural when the marked cell is replaced by the fix; (4) for a context item: replacing any OTHER cell (especially the clue) would NOT also make the sentence make sense, reading the lead line if any; (5) the explanation does not simply reveal the fix. Answer JSON only: {"ok":true|false,"reason":"<short>"}`,
      },
      { role: "user", content: `${lead ? `Lead (context, not part of the quiz): ${lead}\n` : ""}Quiz sentence: ${line}\nCells: ${after.map((one, i) => `${i}:${one}`).join("  ")}\nWrong cell: ${item.errors[0]!.at} "${wrong}" → fix "${right}"\nType: ${want.type}\nCorrect sentence meaning: ${source.en}\nExplanation: ${item.errors[0]!.why.en}` },
    ],
  }).catch(() => null);
  const verdict = parseJson(String(judged?.choices[0]?.message?.content ?? ""));
  if (!verdict || verdict.ok !== true) {
    await kvSetJson(key, { bad: `judge ${str(verdict?.reason).slice(0, 120)}` } satisfies SpotStored, TTL_SECONDS);
    return null;
  }
  await kvSetJson(key, { item } satisfies SpotStored, TTL_SECONDS);
  return item;
}
