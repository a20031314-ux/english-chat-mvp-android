/**
 * 지난 통화에서 고친 문장 — 다음 통화가 "저번엔 틀렸는데 이번엔 맞았어"를 말할 수 있게(2026-11-04).
 *
 * 삶(lifeFacts)과 다른 목록. 큰 실수만: 날짜, 틀린 점 한 줄, 고친 문장.
 * 그 통화에서 다시 말해 맞춘 것은 넣지 않는다(이미 그 자리에서 끝났음).
 * 다음 통화에서 그 문장을 맞게 말하면 목록에서 빼서, 맞았다는 말을 반복하지 않는다. 이 폰에만.
 */
import type { TranscriptLine } from "./review.ts";

const KEY = "tutorFixes.v1";
const DAY = 86_400_000;

export const FIX_MAX = 12;
/** 이보다 오래된 고침은 다음 통화에 안 실린다. */
export const FIX_KEEP_DAYS = 60;

export type FixMemory = { right: string; said: string; point: string; at: number; callId: string };

type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };

function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function dayStamp(at: number): string {
  const date = new Date(at);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 문장부호·띄어쓰기만 다른 줄은 같은 문장. 모음 부호는 남긴다. */
export function sameFix(a: string, b: string): boolean {
  const norm = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const left = norm(a);
  const right = norm(b);
  if (left.length < 8 || right.length < 8) return false;
  return left === right || left.includes(right) || right.includes(left);
}

function readAll(store: Store): Record<string, FixMemory[]> {
  try {
    const raw = JSON.parse(store.getItem(KEY) ?? "{}") as Record<string, unknown>;
    const out: Record<string, FixMemory[]> = {};
    for (const [language, list] of Object.entries(raw)) {
      if (!Array.isArray(list)) continue;
      out[language] = list.filter(isFix);
    }
    return out;
  } catch {
    return {};
  }
}

function isFix(raw: unknown): raw is FixMemory {
  if (typeof raw !== "object" || raw === null) return false;
  const row = raw as FixMemory;
  return typeof row.right === "string" && row.right.trim() !== "" && typeof row.said === "string" && typeof row.point === "string" && typeof row.at === "number" && typeof row.callId === "string";
}

export function readFixes(language: string, store: Store | null = browserStore()): FixMemory[] {
  if (!store) return [];
  return readAll(store)[language] ?? [];
}

/** 이번 통화 대본에서 아직 다시 맞히지 못한 고침만. 다시 말해 맞춘 줄은 빠진다. */
export function fixesFromLines(lines: readonly Pick<TranscriptLine, "who" | "text" | "better" | "meant" | "about" | "redo">[]): { right: string; said: string; point: string }[] {
  const out: { right: string; said: string; point: string }[] = [];
  let open: { right: string; said: string; point: string } | null = null;
  const keep = () => {
    if (open) out.push(open);
    open = null;
  };
  for (const line of lines) {
    if (line.who !== "learner") continue;
    if (line.redo === "pass") {
      open = null;
      continue;
    }
    const right = (line.meant || line.better || "").trim();
    const said = line.text.trim();
    if (!right || right === said) continue;
    keep();
    open = { right, said, point: (line.about ?? "").trim().slice(0, 80) };
  }
  keep();
  return out;
}

export function mergeFixes(
  language: string,
  fixes: readonly { right: string; said: string; point: string }[],
  at: number,
  callId: string,
  store: Store | null = browserStore(),
): FixMemory[] {
  if (!store) return [];
  const all = readAll(store);
  const list = all[language] ?? [];
  for (const fix of fixes) {
    const right = fix.right.trim().slice(0, 200);
    if (!right) continue;
    const found = list.find((one) => sameFix(one.right, right));
    if (found) {
      if (found.callId === callId) continue;
      found.at = at;
      found.callId = callId;
      found.right = right;
      found.said = fix.said.trim().slice(0, 200);
      found.point = fix.point.trim().slice(0, 80);
      continue;
    }
    list.push({ right, said: fix.said.trim().slice(0, 200), point: fix.point.trim().slice(0, 80), at, callId });
  }
  const kept = list.slice(-FIX_MAX);
  all[language] = kept;
  store.setItem(KEY, JSON.stringify(all));
  return kept;
}

/**
 * 이번 말이 예전에 고친 문장과 같고, 이번 차례는 다시 고치지 않았으면 그 항목을 뺀다.
 * 또 틀렸으면 그대로 둔다.
 */
export function settleFixes(language: string, heard: string, corrected: boolean, store: Store | null = browserStore()): FixMemory[] {
  if (!store) return [];
  const all = readAll(store);
  const list = all[language] ?? [];
  if (corrected || !heard.trim()) return list;
  const kept = list.filter((fix) => !sameFix(heard, fix.right));
  if (kept.length === list.length) return list;
  all[language] = kept;
  store.setItem(KEY, JSON.stringify(all));
  return kept;
}

/** 다음 통화 지시. 오래된 것은 빼서 맞았다는 말을 반복하지 않게. */
export function fixesPrompt(list: readonly FixMemory[], now = Date.now()): string {
  const fresh = list.filter((fix) => now - fix.at <= FIX_KEEP_DAYS * DAY).slice(-FIX_MAX);
  if (!fresh.length) return "";
  const lines = fresh.map((fix) => `${dayStamp(fix.at)} | ${fix.point || "—"} | ${fix.right}`);
  return lines.join("\n");
}
