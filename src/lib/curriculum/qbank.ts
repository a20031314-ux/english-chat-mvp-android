/**
 * 자라는 문제은행 — 앱 쪽(2026-10-30 사용자 "그때그때 AI가 만들기, 문제은행식으로 계속 증식"). 규칙은 qbankRules.ts, 저장·만들기는 server/qbank.ts.
 *
 * - growBank: 지금 풀 열쇠들을 서버에 알리면(모아 둔 풀이 결과도 같이) 서버가 모자란 열쇠는 새 예문·헷갈리는 오답을 만들어 늘리고,
 *   열쇠마다 지금 묶음을 돌려준다 → 여기 등록 → quiz.ts가 문제 재료(grownSources)와 오답(grownDecoys)으로 쓴다(다음 문제부터).
 * - noteBankResult: 문제를 풀 때마다 문장·맞음·보인 보기·고른 보기만 모아 둔다(학습자가 친 글은 보내지 않음). 다음 growBank 때 같이 보낸다.
 * - 받은 묶음은 이 폰에 저장(qbank.v1.<언어>, 열쇠 STORE_MAX개까지 최근 것) — 다음에 앱을 열면 첫 문제부터 쓴다
 *   (2026-11-01 사용자 "문제은행 미리 받기" — 예전엔 메모리에만 있어 처음 낸 문제는 늘 앱 데이터 문장만).
 * 서버가 없거나 실패하면 아무것도 하지 않는다 — 문제는 미리 만든 데이터만으로도 나온다.
 */
import { apiUrl } from "../apiBase.ts";
import { rememberGlosses, type ScriptGloss } from "./stageScripts.ts";

/** wrong = 낱말(w|) 예문의 이 문장에 안 맞는 같은 낱말의 다른 꼴(고르기 오답, 2026-11-02). */
export type GrownItem = { text: string; piece: string; gloss: ScriptGloss; stage: number; wrong?: string[] };
type Grown = { items: GrownItem[]; decoys: Record<string, string[]> };

const GROWN = new Map<string, Grown>();
const at = (language: string, key: string) => `${language}|${key}`;

/** 이 폰에 남겨 두는 열쇠 수(언어마다, 최근 받은 것부터). */
export const STORE_MAX = 400;
const storeName = (language: string) => `qbank.v1.${language}`;
const loaded = new Set<string>();
/** gl = 영어·한국어 밖 앱 언어로 옮긴 뜻(앱 언어 → 영어 뜻 → 옮긴 뜻) — 다시 열 때 rememberGlosses로. */
type Stored = Record<string, Grown & { at: number; gl?: Record<string, Record<string, string>> }>;

function storage(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

/** 이 폰에 저장해 둔 묶음을 한 번 읽어 등록(메모리에 이미 있는 열쇠는 그대로). */
function loadStored(language: string): void {
  if (loaded.has(language)) return;
  loaded.add(language);
  try {
    const stored = JSON.parse(storage()?.getItem(storeName(language)) ?? "{}") as Stored;
    for (const [key, grown] of Object.entries(stored)) {
      if (!GROWN.has(at(language, key)) && Array.isArray(grown?.items)) GROWN.set(at(language, key), { items: grown.items, decoys: grown.decoys ?? {} });
      for (const [ui, glosses] of Object.entries(grown?.gl ?? {})) rememberGlosses(ui, glosses);
    }
  } catch {
    // 깨진 저장은 무시(다음 저장이 덮음).
  }
}

function saveStored(language: string, fresh: Record<string, Grown>, ui: string, moved: Readonly<Record<string, string>>): void {
  const store = storage();
  if (!store) return;
  try {
    const stored = JSON.parse(store.getItem(storeName(language)) ?? "{}") as Stored;
    const now = Date.now();
    for (const [key, grown] of Object.entries(fresh)) {
      const mine = Object.fromEntries(grown.items.flatMap((item) => (moved[item.gloss.en] ? [[item.gloss.en, moved[item.gloss.en]!]] : [])));
      const gl = { ...(stored[key]?.gl ?? {}), ...(Object.keys(mine).length ? { [ui]: mine } : {}) };
      stored[key] = { ...grown, at: now, ...(Object.keys(gl).length ? { gl } : {}) };
    }
    const kept = Object.entries(stored)
      .sort((a, b) => (b[1].at ?? 0) - (a[1].at ?? 0))
      .slice(0, STORE_MAX);
    store.setItem(storeName(language), JSON.stringify(Object.fromEntries(kept)));
  } catch {
    // 저장 한도 등 — 메모리에는 있음.
  }
}

/** 문제은행이 자랄 수 있는 열쇠(표현·문장구조·낱말). */
export function bankable(key: string): boolean {
  return key.startsWith("e|") || key.startsWith("f|") || key.startsWith("w|");
}

export function registerGrown(language: string, key: string, grown: Grown): void {
  GROWN.set(at(language, key), grown);
}

/** 문제은행이 더한 그 조각의 헷갈리는 오답(대소문자는 조각에 맞춤). */
export function grownDecoys(language: string, key: string, piece: string): string[] {
  loadStored(language);
  const decoys = GROWN.get(at(language, key))?.decoys;
  if (!decoys) return [];
  const found = decoys[piece] ?? Object.entries(decoys).find(([p]) => p.toLocaleLowerCase() === piece.toLocaleLowerCase())?.[1] ?? [];
  const upper = piece.charAt(0) !== piece.charAt(0).toLocaleLowerCase();
  return upper ? found.map((one) => one.charAt(0).toLocaleUpperCase() + one.slice(1)) : found;
}

/** 문제은행이 더한 예문(빈칸·쓰기 문제 재료). */
export function grownItems(language: string, key: string): GrownItem[] {
  loadStored(language);
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
      // dict: 이 앱은 낱말 문제에 사전 예문을 먼저 쓴다 — 서버는 사전 예문이 있는 낱말을 키우지 않는다(2026-11-06, 옛 앱은 그대로 키움).
      body: JSON.stringify({ language, ui, keys: wanted, results, dict: 1 }),
    });
    if (!response.ok) return;
    const body = (await response.json()) as { banks?: Record<string, { items: { text: string; piece: string; gloss: string; uiGloss?: string; stage: number; wrong?: string[] }[]; decoys: Record<string, string[]> }> };
    let count = 0;
    const moved: Record<string, string> = {};
    const fresh: Record<string, Grown> = {};
    for (const [key, bank] of Object.entries(body.banks ?? {})) {
      if (!bank) continue;
      const grown: Grown = {
        decoys: bank.decoys ?? {},
        items: (bank.items ?? []).map((item) => {
          // 앱 언어 뜻은 다른 뜻풀이처럼 glossFor가 찾게(rememberGlosses), 한국어는 ko 칸에.
          if (item.uiGloss && ui !== "en" && ui !== "ko") moved[item.gloss] = item.uiGloss;
          const gloss: ScriptGloss = { en: item.gloss, ...(ui === "ko" && item.uiGloss ? { ko: item.uiGloss } : {}) };
          const wrong = Array.isArray(item.wrong) ? item.wrong.filter((one): one is string => typeof one === "string" && one.length > 0 && one.length <= 40).slice(0, 3) : [];
          return { text: item.text, piece: item.piece, stage: item.stage, gloss, ...(wrong.length ? { wrong } : {}) };
        }),
      };
      registerGrown(language, key, grown);
      if (grown.items.length || Object.keys(grown.decoys).length) fresh[key] = grown;
      count += 1;
    }
    saveStored(language, fresh, ui, moved);
    if (Object.keys(moved).length) rememberGlosses(ui, moved);
    onGrown?.(count);
  } catch {
    // 다음에 다시(결과는 버림 — 셈이 조금 덜 될 뿐).
  }
}

/**
 * 대화에서 온 튜터 줄을 모두의 문제은행에 내놓는다(lib/curriculum/talkQuiz.ts shareable로 이미 거른 줄만, 한 번에 다섯).
 * 서버가 한 번 더 판정해 통과한 것만 더한다. 보낸 줄은 이 폰에 기억해 다시 보내지 않는다(talkOffered.v1.<언어>, 500줄).
 */
export async function offerBank(language: string, offers: readonly { key: string; text: string; stage: number }[]): Promise<number> {
  const store = storage();
  const name = `talkOffered.v1.${language}`;
  let sent: string[] = [];
  try {
    sent = JSON.parse(store?.getItem(name) ?? "[]") as string[];
  } catch {
    sent = [];
  }
  const fresh = offers.filter((one) => !sent.includes(one.text)).slice(0, 5);
  if (!fresh.length) return 0;
  try {
    store?.setItem(name, JSON.stringify([...sent, ...fresh.map((one) => one.text)].slice(-500)));
  } catch {
    // 이번에만.
  }
  try {
    const response = await fetch(apiUrl("/api/curriculum/qbank"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, offers: fresh }),
    });
    if (!response.ok) return 0;
    const body = (await response.json()) as { offered?: number };
    return body.offered ?? 0;
  } catch {
    return 0;
  }
}
