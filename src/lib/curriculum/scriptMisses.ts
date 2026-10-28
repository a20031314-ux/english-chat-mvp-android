/**
 * 대본·문장구조에서 🎤로 틀린 줄(2026-10-28 사용자 "틀린 걸 상기시켜 주는 기능"): 이 폰에만, 우리 대본의 줄 번호와 때만.
 * 학습자가 말한 문장은 남기지 않는다(줄 글은 대본에서 다시 읽는다). 나중에 그 줄을 맞히면 지운다.
 * 쓰는 곳: 대본을 다시 열면 그 줄에 ◐, My "지난번에 틀린 것" 띠, 아침 알림.
 */

const KEY = "scriptMisses.v1";
/** 언어 → 대본·문장구조 id → 줄 번호 → { 틀린 횟수, 마지막 때 }. */
type Store = Record<string, Record<string, Record<string, { n: number; at: number }>>>;

type Storage_ = Pick<Storage, "getItem" | "setItem">;

function storage(): Storage_ | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function read(store: Storage_ | null): Store {
  try {
    const raw = JSON.parse(store?.getItem(KEY) ?? "{}") as Store;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function write(data: Store, store: Storage_ | null) {
  try {
    store?.setItem(KEY, JSON.stringify(data));
  } catch {
    // 이 화면에서만.
  }
}

/** 한 줄의 결과: 틀리면 횟수를 올리고(몇 번째인지 돌려줌), 맞히면 지운다(0). */
export function noteLine(language: string, id: string, line: number, missed: boolean, now = Date.now(), store: Storage_ | null = storage()): number {
  const data = read(store);
  const byId = { ...(data[language] ?? {}) };
  const lines = { ...(byId[id] ?? {}) };
  let n = 0;
  if (missed) {
    n = (lines[line]?.n ?? 0) + 1;
    lines[line] = { n, at: now };
  } else delete lines[line];
  if (Object.keys(lines).length) byId[id] = lines;
  else delete byId[id];
  // 오래된 것부터 버려 대본 60개까지.
  const kept = Object.entries(byId)
    .sort((a, b) => Math.max(...Object.values(b[1]).map((x) => x.at)) - Math.max(...Object.values(a[1]).map((x) => x.at)))
    .slice(0, 60);
  data[language] = Object.fromEntries(kept);
  write(data, store);
  return n;
}

/** 이 대본에서 지난번에 틀린 줄 번호. */
export function missedLines(language: string, id: string, store: Storage_ | null = storage()): Set<number> {
  return new Set(Object.keys(read(store)[language]?.[id] ?? {}).map(Number));
}

export type Miss = { id: string; line: number; n: number; at: number };

/** 이 언어에서 틀린 줄 전부, 최근 순. */
export function allMisses(language: string, store: Storage_ | null = storage()): Miss[] {
  const byId = read(store)[language] ?? {};
  return Object.entries(byId)
    .flatMap(([id, lines]) => Object.entries(lines).map(([line, value]) => ({ id, line: Number(line), n: value.n, at: value.at })))
    .sort((a, b) => b.at - a.at);
}
