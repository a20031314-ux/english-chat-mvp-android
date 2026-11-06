/**
 * 자라는 문제은행 규칙(2026-10-30 사용자 "그때그때 AI가 만들기 — 문제은행식으로 계속 증식하는 알고리즘"):
 * 열쇠(e|표현 · f|문장구조 · w|낱말)마다 모두가 같이 쓰는 묶음 하나 — 새 예문(빈칸·쓰기 문제의 재료)과 그 조각의 헷갈리는 오답.
 *
 * 늘어나는 법:
 * - 처음 부르면 바로 만든다(예문 넷 + 오답 셋).
 * - 그 뒤엔 풀린 수가 GROW_EVERY 늘 때마다 몇 개 더(살아 있는 예문이 CAP보다 적을 때, 열쇠마다 하루 GROW_PER_DAY번까지, 전체 하루 예산 따로).
 * 줄어드는 법(도태):
 * - 예문: RETIRE_AFTER번 넘게 풀렸는데 거의 다 맞힘(너무 쉬움) 또는 거의 다 틀림(문제가 이상함) → 빠지고, 빈자리는 다음 성장 때 채운다.
 * - 오답: 여러 번 보였는데 거의 아무도 안 고름(한눈에 지워짐) → 빠짐, 조각마다 오답이 둘보다 적으면 다음 성장 때 더 만든다.
 * 고정(2026-11-01 사용자 "출시 초반에만 문장 생성 → 시스템이 잘 돌아가면 고정"): frozen이면 너무 쉬운 예문·안 골리는 오답을 빼지 않는다
 *   (새로 채우지 않으니) — 거의 다 틀리는 이상한 예문만 뺀다. 성장도 멈춤(server/qbank.ts QBANK_FROZEN).
 * 학습자 글은 받지 않는다 — 문제 글(앱이 낸 문장)·맞음·고른 보기만. 순수 모듈: 서버(server/qbank.ts)와 테스트가 같이 쓴다.
 */
export type BankItem = {
  /** 문장(학습 언어). */
  t: string;
  /** 비운 조각(문장 안 그대로). */
  p: string;
  /** 영어 뜻. */
  g: string;
  /** 단계. */
  s: number;
  /** 풀린 수 · 맞힌 수. */
  n: number;
  r: number;
  /**
   * 낱말(w|)만: 이 문장 빈칸에 안 맞는 같은 낱말의 다른 꼴(시제·인칭·수·격·비교·어미 — 2026-11-02 사용자 "문법 문제는 과거형·현재형처럼
   * 형태만 달라진 같은 단어로 선지를 구성"). 모델이 문장마다 "이 꼴은 여기서 틀림"을 보고 만든 것 — 고르기 오답으로 먼저 쓴다.
   */
  w?: string[];
  /** 어디서 왔나: 없음 = 모델이 만듦, "talk" = 대화의 튜터 줄(걸러서, 2026-11-01). */
  o?: "talk";
  /** 빠짐(너무 쉬움 "easy" · 이상함 "odd"). */
  off?: "easy" | "odd";
};

export type BankDecoy = { d: string; n: number; k: number };

export type BankEntry = {
  items: BankItem[];
  /** 조각 → 오답들. */
  decoys: Record<string, BankDecoy[]>;
  /** 이 열쇠 문제가 풀린 수(성장 시점 판단). */
  served: number;
  /** 마지막 성장 때의 served. */
  grownAt: number;
  /** 성장한 날(UTC YYYY-MM-DD)과 그날 횟수. */
  day: string;
  dayGrows: number;
};

export const GROW_EVERY = 30;
export const CAP = 40;
export const GROW_PER_DAY = 3;
export const RETIRE_AFTER = 20;
export const DECOY_AFTER = 30;
export const MIN_DECOYS = 2;

export function emptyEntry(): BankEntry {
  return { items: [], decoys: {}, served: 0, grownAt: 0, day: "", dayGrows: 0 };
}

/**
 * 사전에 올릴 만한 예문(2026-11-06 사용자 "예문 없는 단어는 퀴즈 풀 때마다 예문 생성 → 사전에 추가", "자동 + 주기적 확인"):
 * 빠지지 않았고, 도태 판정을 받을 만큼(RETIRE_AFTER번) 풀렸는데 너무 쉽지도(95% 이상) 이상하지도(15% 이하) 않은 모델 예문.
 * 대화에서 온 줄(o: "talk")은 올리지 않는다 — 사전은 고정 파일에 남으니까. 고정(frozen)이라 easy를 안 빼도 여기서 거른다.
 */
export const PROMOTE_AFTER = RETIRE_AFTER;

export function promotable(item: BankItem): boolean {
  if (item.off || item.o === "talk" || item.n < PROMOTE_AFTER) return false;
  const rate = item.r / item.n;
  return rate > 0.15 && rate < 0.95;
}

/**
 * 사전에서 연 낱말로 만든 예문처럼 아직 덜 풀린 것도 검토 표에 올린다(2026-11-06 사용자 "단어장에서 검색 후 열었을 때 생성하는 흐름도").
 * 많이 풀렸으면 promotable 기준 그대로, 덜 풀렸으면 사람이·Cursor가 보고 정한다(뺀 것·대화 줄은 아님).
 */
export function reviewable(item: BankItem): boolean {
  if (item.off || item.o === "talk") return false;
  return item.n < PROMOTE_AFTER || promotable(item);
}

export function liveItems(entry: BankEntry): BankItem[] {
  return entry.items.filter((item) => !item.off);
}

/** 풀린 결과 하나. options = 그 문제에 보인 보기, picked = 고른 보기(쓰기 문제는 없음). */
export type BankResult = { text: string; correct: boolean; options?: string[]; picked?: string };

/** 결과를 셈에 넣고 도태시킨다(새 객체). */
export function applyResults(entry: BankEntry, results: readonly BankResult[], options: { frozen?: boolean } = {}): BankEntry {
  const next: BankEntry = { ...entry, items: entry.items.map((item) => ({ ...item })), decoys: Object.fromEntries(Object.entries(entry.decoys).map(([p, list]) => [p, list.map((d) => ({ ...d }))])) };
  for (const result of results) {
    next.served += 1;
    const item = next.items.find((one) => one.t === result.text);
    if (item && !item.off) {
      item.n += 1;
      if (result.correct) item.r += 1;
      if (item.n >= RETIRE_AFTER) {
        const rate = item.r / item.n;
        if (rate >= 0.95 && !options.frozen) item.off = "easy";
        else if (rate <= 0.15) item.off = "odd";
      }
    }
    for (const list of Object.values(next.decoys)) {
      for (const decoy of list) {
        if (!result.options?.includes(decoy.d)) continue;
        decoy.n += 1;
        if (result.picked === decoy.d) decoy.k += 1;
      }
    }
  }
  // 한눈에 지워지는 오답: 여러 번 보였는데 3% 밑으로만 골림 — 둘은 남긴다(다음 성장 때 채움).
  for (const [piece, list] of Object.entries(next.decoys)) {
    if (options.frozen) break;
    const weak = list.filter((d) => d.n >= DECOY_AFTER && d.k / d.n < 0.03);
    if (!weak.length) continue;
    next.decoys[piece] = list.filter((d) => !weak.includes(d));
  }
  return next;
}

/** 오늘 더 만들어야 하나(어떤 열쇠의 묶음). forms = 낱말(w|) 열쇠 — 예문마다 꼴 오답이 든 예문이 둘도 안 되면 한 번 더(예전 묶음 채우기). */
export function needGrow(entry: BankEntry, today: string, options: { forms?: boolean } = {}): boolean {
  const dayGrows = entry.day === today ? entry.dayGrows : 0;
  if (dayGrows >= GROW_PER_DAY) return false;
  const live = liveItems(entry).length;
  if (live === 0) return true;
  if (options.forms && liveItems(entry).filter((item) => (item.w?.length ?? 0) >= 2).length < 2 && entry.items.length < CAP) return true;
  const thinDecoys = Object.values(entry.decoys).some((list) => list.length < MIN_DECOYS) || Object.keys(entry.decoys).length === 0;
  if (thinDecoys) return true;
  return live < CAP && entry.served - entry.grownAt >= GROW_EVERY;
}

const lower = (text: string) => text.toLocaleLowerCase();

/** 모델이 만든 예문을 받을지: 조각을 그대로 담고, 숫자 없고, 이미 있는 문장이 아님. */
export function acceptItem(entry: BankEntry, text: string, piece: string, existing: ReadonlySet<string>): boolean {
  const t = text.trim();
  if (!t || t.length > 140 || /\p{Nd}/u.test(t)) return false;
  if (!lower(t).includes(lower(piece))) return false;
  if (existing.has(t) || entry.items.some((item) => item.t === t)) return false;
  return true;
}

/** 오답을 받을지: 정답과 다르고, 정답을 품거나 정답에 들지 않고, 숫자 없음, 이미 있는 오답이 아님. */
export function acceptDecoy(piece: string, decoy: string, have: readonly BankDecoy[]): boolean {
  const d = decoy.trim();
  if (!d || d.length > 60 || /\p{Nd}/u.test(d)) return false;
  if (lower(d) === lower(piece) || lower(d).includes(lower(piece)) || lower(piece).includes(lower(d))) return false;
  return !have.some((one) => lower(one.d) === lower(d));
}

const SPACELESS = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u;

/** 문장에 그 말이 따로 선 낱말로 있나(띄어쓰기 없는 말은 들어 있기만 해도). */
function standsIn(sentence: string, word: string): boolean {
  const t = lower(sentence);
  const w = lower(word);
  if (SPACELESS.test(w) || SPACELESS.test(t)) return t.includes(w);
  const letter = /[\p{L}\p{M}\p{Nd}]/u;
  for (let at = t.indexOf(w); at >= 0; at = t.indexOf(w, at + 1)) {
    const before = at > 0 ? t[at - 1]! : "";
    const after = t[at + w.length] ?? "";
    if ((!before || !letter.test(before)) && (!after || !letter.test(after))) return true;
  }
  return false;
}

/**
 * 예문 하나의 꼴 오답(낱말 w|)을 받을지: 빈칸 꼴과 다르고(대소문자 무시), 그 문장에 낱말로 이미 없고, 숫자·긴 글 아님, 겹치지 않게 셋까지.
 * 같은 낱말의 꼴이라 빈칸 꼴을 품거나 그 안에 들어도 된다(be → been, work → works).
 */
export function acceptForms(sentence: string, piece: string, forms: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of forms) {
    const form = raw.trim();
    if (!form || form.length > 40 || /[\p{Nd}|;]/u.test(form)) continue;
    if (lower(form) === lower(piece) || standsIn(sentence, form)) continue;
    if (out.some((one) => lower(one) === lower(form))) continue;
    out.push(form);
    if (out.length >= 3) break;
  }
  return out;
}

/** 앱에 보낼 모양: 살아 있는 예문(덜 풀린 것 먼저, 열둘까지)과 조각마다 오답. 낱말 예문은 그 문장의 꼴 오답(wrong)도. */
export function publicView(entry: BankEntry): { items: { text: string; piece: string; gloss: string; stage: number; wrong?: string[] }[]; decoys: Record<string, string[]> } {
  const items = liveItems(entry)
    .sort((a, b) => a.n - b.n)
    .slice(0, 12)
    .map((item) => ({ text: item.t, piece: item.p, gloss: item.g, stage: item.s, ...(item.w?.length ? { wrong: item.w } : {}) }));
  const decoys = Object.fromEntries(Object.entries(entry.decoys).map(([piece, list]) => [piece, list.map((d) => d.d)]));
  return { items, decoys };
}
