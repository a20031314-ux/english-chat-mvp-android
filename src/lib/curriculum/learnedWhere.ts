import { type ScriptGloss } from "./stageScripts.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type WhereLine = { text: string; gloss: ScriptGloss; who: "me" | "them" | "example"; hit: [number, number] | null };
/** lines가 비면 그 대본에 표현이 꼴을 바꿔 나온 것(줄은 못 짚음). */
export type Where = { id: string; kind: "script" | "frame"; stage: number; lines: WhereLine[] };
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
