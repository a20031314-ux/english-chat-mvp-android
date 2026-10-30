/**
 * 자라는 문제은행 — 앱 쪽(2026-10-30 사용자 "그때그때 AI가 만들기, 문제은행식으로 계속 증식"). 규칙은 qbankRules.ts, 저장·만들기는 server/qbank.ts.
 *
 * - growBank: 지금 풀 열쇠들을 서버에 알리면(모아 둔 풀이 결과도 같이) 서버가 모자란 열쇠는 새 예문·헷갈리는 오답을 만들어 늘리고,
 *   열쇠마다 지금 묶음을 돌려준다 → 여기 등록 → quiz.ts가 문제 재료(grownSources)와 오답(grownDecoys)으로 쓴다(다음 문제부터).
 * - noteBankResult: 문제를 풀 때마다 문장·맞음·보인 보기·고른 보기만 모아 둔다(학습자가 친 글은 보내지 않음). 다음 growBank 때 같이 보낸다.
 * 서버가 없거나 실패하면 아무것도 하지 않는다 — 문제는 미리 만든 데이터만으로도 나온다.
 */
import { apiUrl } from "../apiBase.ts";
import { rememberGlosses, type ScriptGloss } from "./stageScripts.ts";

export type GrownItem = { text: string; piece: string; gloss: ScriptGloss; stage: number };
type Grown = { items: GrownItem[]; decoys: Record<string, string[]> };

const GROWN = new Map<string, Grown>();
const at = (language: string, key: string) => `${language}|${key}`;

/** 문제은행이 자랄 수 있는 열쇠(표현·문장구조·낱말). */
export function bankable(key: string): boolean {
  return key.startsWith("e|") || key.startsWith("f|") || key.startsWith("w|");
}

export function registerGrown(language: string, key: string, grown: Grown): void {
  GROWN.set(at(language, key), grown);
}

/** 문제은행이 더한 그 조각의 헷갈리는 오답(대소문자는 조각에 맞춤). */
export function grownDecoys(language: string, key: string, piece: string): string[] {
  const decoys = GROWN.get(at(language, key))?.decoys;
  if (!decoys) return [];
  const found = decoys[piece] ?? Object.entries(decoys).find(([p]) => p.toLocaleLowerCase() === piece.toLocaleLowerCase())?.[1] ?? [];
  const upper = piece.charAt(0) !== piece.charAt(0).toLocaleLowerCase();
  return upper ? found.map((one) => one.charAt(0).toLocaleUpperCase() + one.slice(1)) : found;
}

/** 문제은행이 더한 예문(빈칸·쓰기 문제 재료). */
export function grownItems(language: string, key: string): GrownItem[] {
  return GROWN.get(at(language, key))?.items ?? [];
}

type Pending = { key: string; text: string; correct: boolean; options?: string[]; picked?: string };
const PENDING = new Map<string, Pending[]>();

/** 푼 문제 하나(문장·맞음·보기·고른 보기만). */
export function noteBankResult(language: string, key: string, result: Omit<Pending, "key">): void {
  if (!bankable(key) || !result.text) return;
  const list = PENDING.get(language) ?? [];
  list.push({ key, ...result });
  PENDING.set(language, list.slice(-60));
}

const asked = new Map<string, number>();

/** 이 열쇠들의 묶음을 받아 등록(같은 열쇠는 10분에 한 번). 끝나면 onGrown(새로 등록한 열쇠 수). */
export async function growBank(language: string, ui: string, keys: readonly { key: string; stage: number }[], onGrown?: (count: number) => void): Promise<void> {
  const now = Date.now();
  const wanted = keys.filter((one) => bankable(one.key) && now - (asked.get(at(language, one.key)) ?? 0) > 10 * 60 * 1000).slice(0, 8);
  const results = PENDING.get(language) ?? [];
  if (!wanted.length && results.length < 10) return;
  for (const one of wanted) asked.set(at(language, one.key), now);
  PENDING.set(language, []);
  try {
    const response = await fetch(apiUrl("/api/curriculum/qbank"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, ui, keys: wanted, results }),
    });
    if (!response.ok) return;
    const body = (await response.json()) as { banks?: Record<string, { items: { text: string; piece: string; gloss: string; uiGloss?: string; stage: number }[]; decoys: Record<string, string[]> }> };
    let count = 0;
    const moved: Record<string, string> = {};
    for (const [key, bank] of Object.entries(body.banks ?? {})) {
      registerGrown(language, key, {
        decoys: bank.decoys ?? {},
        items: (bank.items ?? []).map((item) => {
          // 앱 언어 뜻은 다른 뜻풀이처럼 glossFor가 찾게(rememberGlosses), 한국어는 ko 칸에.
          if (item.uiGloss && ui !== "en" && ui !== "ko") moved[item.gloss] = item.uiGloss;
          const gloss: ScriptGloss = { en: item.gloss, ...(ui === "ko" && item.uiGloss ? { ko: item.uiGloss } : {}) };
          return { text: item.text, piece: item.piece, stage: item.stage, gloss };
        }),
      });
      count += 1;
    }
    if (Object.keys(moved).length) rememberGlosses(ui, moved);
    onGrown?.(count);
  } catch {
    // 다음에 다시(결과는 버림 — 셈이 조금 덜 될 뿐).
  }
}
