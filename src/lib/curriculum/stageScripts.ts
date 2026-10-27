/**
 * 단계별 대본 — 처음 배우는 단계부터 원어민과 말하는 단계까지(2026-10-27 사용자 "단계별 스크립트" → "가리거나 멈추고 따라 말해보기 > 확인"
 * → "처음 배우는 단계부터 원어민과 대화가 가능한 수준까지, My탭도 거기 맞추고": 다음 단계 = 네 갈래 70% + 대본, 먼저 ko·ja·es 1~5단계).
 *
 * 단계(curriculum/stages)의 상황마다(지금 넷) 대본 하나. 줄은 상대(them)·나(me)가 번갈아, 뜻은 영어·한국어(다른 앱 언어는 지금 영어).
 * - 1~2단계: 고정 대본. 따라 말하기 → 첫 글자만 → 가리기. 통과 = 가리기나 첫 글자만으로 내 줄을 모두 맞게.
 * - 3~4단계: 상대 줄이 조금씩 바뀐다(alt — 그다음 내 줄은 그대로 맞게 씀). 통과 = 가리기나 "내 말로"(뜻만 보고 내 말로, 모델이 뜻이 통하는지 봄).
 * - 5단계: 원어민 대본 + goal(이 대화에서 해낼 것). 대본 통과 또는 그 상황으로 통화.
 * 대본은 Claude가 쓰고 다른 눈으로 한 번 고쳤다(원어민 확인 전). 학습 언어 글은 그 언어 그대로, 레벨 이름은 어디에도 없다.
 * 통과한 대본 id만 계정에 남는다(server/stageScriptStore.ts) — 말한 문장은 남지 않는다.
 */
import { ES } from "./stageScripts/es.ts";
import { JA } from "./stageScripts/ja.ts";
import { KO } from "./stageScripts/ko.ts";

export type ScriptGloss = { en: string; ko?: string };

export type ScriptVariant = { text: string; gloss: ScriptGloss };

export type StageScriptLine = {
  who: "them" | "me";
  /** 학습 언어. */
  text: string;
  gloss: ScriptGloss;
  /** 3~4단계 상대 줄: 같은 자리에서 원어민이 대신 할 수 있는 말(다음 내 줄은 그대로 맞는다). */
  alt?: ScriptVariant[];
};

export type StageScript = {
  /** "ko-1-1" = 언어-단계-상황 번호. */
  id: string;
  /** 단계 순서(1 = 가장 쉬움) — stages의 order와 같다. */
  stage: number;
  /** 그 단계 situations의 몇 번째(0부터). 없으면 표현 대본(그 단계 핵심 표현 중 상황 대본에 안 나온 것을 쓰는 짧은 대본). */
  situation?: number;
  /** 학습자가 내 줄에서 쓰는 그 단계 핵심 표현(stages expressions 글 그대로) — 통과하면 장부에 오른다(2026-10-28 "표현연결"). */
  expressions: string[];
  setting: ScriptGloss;
  /** 5단계: 이 대화에서 해낼 것. */
  goal?: ScriptGloss;
  lines: StageScriptLine[];
};

export type ScriptMode = "shadow" | "hint" | "hide" | "own";

const ALL: Partial<Record<string, StageScript[]>> = { ko: KO, ja: JA, es: ES };

/** 이 학습 언어·단계의 대본(없으면 빈 목록 — 아직 대본이 없는 언어). */
export function scriptsFor(language: string, stage: number): StageScript[] {
  return (ALL[language] ?? []).filter((script) => script.stage === stage);
}

export function scriptById(language: string, id: string): StageScript | null {
  return (ALL[language] ?? []).find((script) => script.id === id) ?? null;
}

/** 대본이 있는 학습 언어인지(다음 단계 조건에 대본을 넣을지). */
export function hasScripts(language: string): boolean {
  return Boolean(ALL[language]?.length);
}

/** 그 단계에서 고를 수 있는 보는 방식(앞 단계는 첫 글자 힌트, 뒤 단계는 내 말로). */
export function modesFor(stage: number): ScriptMode[] {
  return stage <= 2 ? ["shadow", "hint", "hide"] : ["shadow", "hide", "own"];
}

/** 이 방식으로 맞힌 줄이 통과로 셈해지는지 — 따라 말하기(원문을 보며)는 연습, 통과는 아니다. */
export function countsForPass(stage: number, mode: ScriptMode): boolean {
  return stage <= 2 ? mode === "hint" || mode === "hide" : mode === "hide" || mode === "own";
}

/** 한 번 해 본 결과: 내 줄마다 맞았는지·어떤 방식이었는지·원문을 열어 봤는지. */
export type LineRun = { clean: boolean; mode: ScriptMode; revealed: boolean };

/** 통과 = 내 줄이 모두, 통과로 세는 방식으로, 원문을 열지 않고 맞았다. */
export function runPasses(script: StageScript, runs: Record<number, LineRun>): boolean {
  return script.lines.every((line, i) => {
    if (line.who !== "me") return true;
    const run = runs[i];
    return Boolean(run && run.clean && !run.revealed && countsForPass(script.stage, run.mode));
  });
}

/** 상대 줄의 이번 판: 원래 줄 또는 alt 중 하나(pick = 0..n). */
export function variantOf(line: StageScriptLine, pick: number): ScriptVariant {
  const all: ScriptVariant[] = [{ text: line.text, gloss: line.gloss }, ...(line.alt ?? [])];
  return all[Math.abs(pick) % all.length]!;
}

/** 앱 언어로 된 뜻. 한국어 앱은 ko(없으면 en), 나머지는 지금 en. */
export function glossFor(gloss: ScriptGloss, uiLanguage: string): string {
  return uiLanguage === "ko" ? (gloss.ko ?? gloss.en) : gloss.en;
}

/** 상황 대본인지(다음 단계 조건에 드는 것). 표현 대본은 표현 갈래를 채우는 연습. */
export function isSituationScript(script: StageScript): boolean {
  return typeof script.situation === "number";
}

/**
 * 단계마다 상황 대본 통과 수 / 상황 대본 수(다음 단계 조건) + 통과한 id 전부(표현 대본 포함) — /api/notebook parts에 붙는다.
 */
export function scriptTally(language: string, stage: number, passed: ReadonlySet<string>): { done: number; total: number; passed: string[] } {
  const list = scriptsFor(language, stage);
  const situations = list.filter(isSituationScript);
  return {
    done: situations.filter((script) => passed.has(script.id)).length,
    total: situations.length,
    passed: list.filter((script) => passed.has(script.id)).map((script) => script.id),
  };
}

/** 통과로 장부에 올릴 결과: 첫 글자 힌트를 본 줄이 있으면 도움 받음, 아니면 혼자. */
export function passOutcome(runs: Record<number, LineRun>): "unaided" | "helped" {
  return Object.values(runs).some((run) => run.mode === "hint") ? "helped" : "unaided";
}

/** 아직 배우지 않은 표현이 든 첫 대본(표현 갈래 연습 → 그 대본을 연다). */
export function scriptForExpressions(language: string, stage: number, open: readonly string[]): StageScript | null {
  const wanted = new Set(open);
  const list = scriptsFor(language, stage);
  return list.find((script) => !isSituationScript(script) && script.expressions.some((e) => wanted.has(e))) ?? list.find((script) => script.expressions.some((e) => wanted.has(e))) ?? null;
}

/**
 * "첫 글자만": 낱말마다 첫 글자만 두고 나머지 글자는 _로(띄어쓰기·문장부호는 그대로).
 * 낱말 나누기는 Intl.Segmenter — 띄어쓰기 없는 말(ja·zh·th)도 낱말 덩어리마다 첫 글자가 남는다.
 */
export function hintOf(text: string, language: string): string {
  const mask = (word: string) => {
    const chars = [...word];
    return chars[0] + chars.slice(1).map((ch) => (/[\p{L}\p{N}]/u.test(ch) ? "_" : ch)).join("");
  };
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return text.replace(/[\p{L}\p{N}]+/gu, mask);
  const segmenter = new Intl.Segmenter(language, { granularity: "word" });
  return [...segmenter.segment(text)].map((part) => (part.isWordLike ? mask(part.segment) : part.segment)).join("");
}
