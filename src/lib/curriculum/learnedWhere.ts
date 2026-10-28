/**
 * 오늘 배운 것 칩을 누르면 그게 오늘 한 어디에, 어떤 문장으로 나왔는지(2026-10-28 사용자 "배운 걸 클릭하면 그게 어디 있고
 * 어떻게 표현됐는지 표시하거나 그쪽으로 이동"). 모델을 부르지 않는다 — 대본 줄·문장구조 예문에서 찾는다.
 * - 문장구조(f|id): 그 문장구조의 예문 + 대본에서 그 문장구조 태그가 붙은 내 줄.
 * - 문법(g|단계:번호): 그 문법이 붙은 대본의, 그 문법을 쓰는 문장구조 태그가 붙은 줄(없으면 내 줄 앞 둘) + 그 문법 문장구조의 예문.
 * - 단어·표현(e|표현): 그 표현이 든 줄(낱말은 wordSegments로 — 띄어 쓰지 않는 언어·한국어 조사 붙음).
 */
import { allFramesFor, type Frame } from "./frames.ts";
import { allScriptsFor, type ScriptGloss, type StageScript } from "./stageScripts.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type WhereLine = { text: string; gloss: ScriptGloss; who: "me" | "them" | "example"; hit: [number, number] | null };
/** lines가 비면 그 대본에 표현이 꼴을 바꿔 나온 것(줄은 못 짚음). */
export type Where = { id: string; kind: "script" | "frame"; stage: number; lines: WhereLine[] };

const LINES_PER_ITEM = 3;

function plain(text: string): string {
  // 문장부호·기호만 빈칸으로 — 결합 부호(\p{M}, 태국어·힌디어 모음)는 그대로.
  return text.toLocaleLowerCase().replace(/[\p{P}\p{S}]/gu, " ");
}

/** 줄에 그 표현이 있는지: 낱말이 이어서 같거나(마지막 낱말은 뒤에 조사·어미가 붙어도), 띄어 쓰지 않는 글이면 글자째. */
export function hasPhrase(line: string, phrase: string, language?: string): boolean {
  const want = segmentWords(plain(phrase), language);
  if (!want.length) return false;
  const have = segmentWords(plain(line), language);
  for (let start = 0; start + want.length <= have.length; start++) {
    const ok = want.every((word, i) => (i === want.length - 1 ? have[start + i]!.startsWith(word) : have[start + i] === word));
    if (ok) return true;
  }
  if (isSpaceless(phrase)) return plain(line).replace(/\s+/g, "").includes(plain(phrase).replace(/\s+/g, ""));
  return false;
}

/** 줄 안에서 표현이 걸친 자리(대소문자 무시, 끝 문장부호 뺌) — 못 찾으면 null(굵게 안 함). */
export function phraseRange(line: string, phrase: string): [number, number] | null {
  const core = phrase.replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, "");
  if (!core) return null;
  const at = line.toLocaleLowerCase().indexOf(core.toLocaleLowerCase());
  return at < 0 ? null : [at, at + core.length];
}

function exampleLines(frame: Frame): WhereLine[] {
  return frame.examples.slice(0, 2).map((example) => ({ text: example.text, gloss: example.gloss, who: "example" as const, hit: null }));
}

function scriptLines(script: StageScript, keep: (text: string, frames: readonly string[]) => boolean, phrase?: string): WhereLine[] {
  return script.lines
    .filter((line) => keep(line.text, line.frames ?? []))
    .slice(0, LINES_PER_ITEM)
    .map((line) => ({ text: line.text, gloss: line.gloss, who: line.who, hit: phrase ? phraseRange(line.text, phrase) : null }));
}

export function whereLearned(language: string, key: string, ids: readonly string[]): Where[] {
  const scripts = allScriptsFor(language);
  const frames = allFramesFor(language);
  const out: Where[] = [];
  for (const id of ids) {
    const script = scripts.find((s) => s.id === id);
    const frame = script ? null : frames.find((f) => f.id === id);
    let lines: WhereLine[] = [];
    if (key.startsWith("f|")) {
      const target = key.slice(2);
      if (frame && frame.id === target) lines = exampleLines(frame);
      else if (script) lines = scriptLines(script, (_, tags) => tags.includes(target));
    } else if (key.startsWith("g|")) {
      const [stage, index] = key.slice(2).split(":").map(Number);
      const withGrammar = new Set(frames.filter((f) => f.stage === stage && (f.grammar ?? []).includes(index!)).map((f) => f.id));
      if (frame && withGrammar.has(frame.id)) lines = exampleLines(frame);
      else if (script && script.stage === stage && (script.grammar ?? []).includes(index!)) {
        lines = scriptLines(script, (_, tags) => tags.some((tag) => withGrammar.has(tag)));
        if (!lines.length) lines = scriptLines(script, () => true).filter((line) => line.who === "me").slice(0, 2);
      }
    } else if (key.startsWith("e|") && script) {
      const phrase = key.slice(2);
      lines = scriptLines(script, (text) => hasPhrase(text, phrase, language), phrase);
    }
    // 표현이 줄에 꼴을 바꿔 나왔으면(활용·성별) 줄 없이 그 대본만 — 눌러서 열 수는 있게.
    const listed = key.startsWith("e|") && script?.expressions.includes(key.slice(2));
    if (lines.length || listed) out.push({ id, kind: script ? "script" : "frame", stage: (script ?? frame)!.stage, lines });
  }
  return out;
}
