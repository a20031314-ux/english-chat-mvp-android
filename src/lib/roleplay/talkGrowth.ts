/**
 * 대화 줄 → "고쳐 씀" 재료(curriculum/growthLines.ts). 통화 끝(callHooks useCallRecap)·AI 채팅 교정(ChatWindow)·사람 대화 교정(rooms/client)이 같이 쓴다.
 * 열쇠는 통화 정리와 같은 규칙(recap.ts recapLedgerKeys·wordLedgerKeys): 고친 줄은 바른 꼴에만 든 열쇠, 고쳐지지 않은 줄은 쓴 열쇠.
 */
import { recapLedgerKeys, wordLedgerKeys } from "./recap.ts";
import type { TranscriptLine } from "./review.ts";
import type { MissLine, TalkSource, UsedLine } from "../curriculum/growthView.ts";

/** bank = 빈도 목록(낱말 → 품사) — 없으면 문장구조·문법·표현 열쇠만. t = 초. */
export function growthLinesOf(language: string, lines: readonly TranscriptLine[], source: TalkSource, t: number, bank: ReadonlyMap<string, string> | null): { miss: MissLine[]; used: UsedLine[] } {
  const miss: MissLine[] = [];
  const used: UsedLine[] = [];
  for (const line of lines) {
    if (line.who !== "learner" || !line.text.trim() || line.text === "…") continue;
    const right = (line.meant || line.better || "").trim();
    const frames = recapLedgerKeys(language, [line]);
    const words = bank ? wordLedgerKeys(language, [line], bank) : { miss: [], used: [] };
    if (right && right !== line.text.trim()) {
      const k = [...new Set([...frames.miss, ...words.miss])];
      if (k.length) miss.push({ k, w: line.text.trim(), r: right, t, s: source });
    } else {
      const k = [...new Set([...frames.used, ...words.used])];
      if (k.length) used.push({ k, x: line.text.trim(), t, s: source });
    }
  }
  return { miss, used };
}
