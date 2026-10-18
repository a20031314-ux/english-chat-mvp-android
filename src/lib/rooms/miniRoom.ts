/**
 * 접어 둔 말하는 방. RoomsScreen이 방을 접으면 여기에 적고, AppHome이 탭 바 바로 위에
 * 막대를 그린다 — 화면 위에 떠서 입력창을 가리지 않게, 내용 영역이 그만큼 줄어든다.
 */
export type MiniRoom = { title: string; back: string; open: () => void };

let current: MiniRoom | null = null;
const listeners = new Set<() => void>();

export function setMiniRoom(next: MiniRoom | null): void {
  current = next;
  for (const listener of listeners) listener();
}

export function readMiniRoom(): MiniRoom | null {
  return current;
}

export function subscribeMiniRoom(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
