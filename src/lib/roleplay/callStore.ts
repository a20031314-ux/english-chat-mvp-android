/**
 * 저장된 AI 통화 목록을 화면 여럿이 같이 본다(2026-10-23, conversation-unify 3단계):
 * 통화 화면(CallHost)이 쓰고, AI 대화는 그 대화 안에 🗒 통화 기록 카드로, 지난 대화 서랍은 목록으로 읽는다.
 * 저장 자체는 예전 그대로(`roleplayConversations`, saved.ts) — 바뀐 것은 바뀌었다고 알리는 것뿐.
 */
import { readSaved, removeSaved, upsertSaved, writeSaved, type SavedConversation } from "./saved.ts";

const EMPTY: SavedConversation[] = [];
let cache: SavedConversation[] | null = null;
const listeners = new Set<() => void>();

function storage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function readCalls(): SavedConversation[] {
  if (cache) return cache;
  const store = storage();
  cache = store ? readSaved(store) : EMPTY;
  return cache;
}

export function readCallsOnServer(): SavedConversation[] {
  return EMPTY;
}

export function subscribeCalls(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: SavedConversation[]) {
  cache = next;
  const store = storage();
  if (store) writeSaved(store, next);
  listeners.forEach((listener) => listener());
}

export function keepCall(conversation: SavedConversation): void {
  write(upsertSaved(readCalls(), conversation));
}

export function discardCall(id: string): void {
  write(removeSaved(readCalls(), id));
}
