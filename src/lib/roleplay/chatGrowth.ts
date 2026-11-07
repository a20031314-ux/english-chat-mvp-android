/**
 * AI 채팅 한 줄 → Logbank 장부(src "chat")·고쳐 씀 재료(2026-11-07 사용자 "틀렸던 문장 > 이후 배워서 활용한 문장"). 이 폰에만.
 * 장부의 chat 줄은 체크 셋(통화·사람 대화처럼 씀 → 앎)·오늘 카드 막힌 것에 들어가고, 띠 %에는 안 든다(서버 채팅 기록이 이미 담음 — fillInputs.ts).
 */
import { noteLedger, readLedger } from "../curriculum/logLedger.ts";
import { dayOfSeconds } from "../curriculum/checkState.ts";
import { noteGrowthLines } from "../curriculum/growthLines.ts";
import { loadBank } from "../curriculum/vocabBank.ts";
import { growthLinesOf } from "./talkGrowth.ts";
import type { TranscriptLine } from "./review.ts";

/** corrected = 튜터가 고친 문장(고칠 게 없으면 ""). */
export function noteChatLine(language: string, text: string, corrected: string): void {
  if (!text.trim()) return;
  const line: TranscriptLine = { who: "learner", text, ...(corrected.trim() && corrected.trim() !== text.trim() ? { better: corrected.trim() } : {}) };
  const t = Math.round(Date.now() / 1000);
  const note = (bank: ReadonlyMap<string, string> | null) => {
    const found = growthLinesOf(language, [line], "chat", t, bank);
    noteGrowthLines(language, found);
    // 채팅은 줄마다 오니, 같은 날 채팅에서 이미 쓴(또는 틀린) 열쇠는 다시 안 셈 — 한 대화에서 두 번 썼다고 바로 앎이 되지 않게(통화는 한 통에 한 번).
    const today = dayOfSeconds(t);
    const seen = new Set(readLedger(language).filter((event) => event.src === "chat" && dayOfSeconds(event.t) === today).map((event) => `${event.r}|${event.k}`));
    const fresh = (r: "miss" | "used", k: string) => !seen.has(`${r}|${k}`);
    noteLedger(language, [
      ...found.miss.flatMap((one) => one.k.filter((k) => fresh("miss", k)).map((k) => ({ k, src: "chat" as const, r: "miss" as const, t }))),
      ...found.used.flatMap((one) => one.k.filter((k) => fresh("used", k)).map((k) => ({ k, src: "chat" as const, r: "used" as const, t }))),
    ]);
  };
  void loadBank(language)
    .then((bank) => note(new Map(bank.map((word) => [word.w.toLocaleLowerCase(), word.pos]))))
    .catch(() => note(null));
}
