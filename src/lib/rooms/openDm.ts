/**
 * 다른 탭(사람 탭 등)에서 1:1 대화를 연다. 대화 화면은 RoomsScreen이 그린다 —
 * 그 화면은 다른 탭에서도 떠 있으므로(AppHome) 여기에 적으면 그 위에 대화가 뜬다.
 */
type Listener = (accountId: string) => void;
const listeners = new Set<Listener>();

export function requestDm(accountId: string): void {
  for (const listener of listeners) listener(accountId);
}

export function onDmRequest(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
