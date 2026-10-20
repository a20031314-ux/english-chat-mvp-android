/**
 * 운영자가 사람 기능을 정지한 계정: 서버가 쓰기에 403 `{error: "SUSPENDED", until}`로 답한다(server/opsStore.ts).
 * 사람 기능 클라이언트(rooms/client.ts·random/client.ts·mediaClient.ts)가 그 답을 여기 남기면
 * 앱 틀의 `SuspendedNotice`가 한 번 띄운다. 화면마다 따로 처리하지 않는다.
 */
export type Suspension = { until: number | null };

let current: Suspension | null = null;
const listeners = new Set<() => void>();

/** 응답 본문이 정지 답이면 남기고 true. */
export function noteSuspended(status: number, body: unknown): boolean {
  if (status !== 403 || !body || typeof body !== "object" || (body as { error?: unknown }).error !== "SUSPENDED") return false;
  const until = (body as { until?: unknown }).until;
  current = { until: typeof until === "number" ? until : null };
  for (const listener of listeners) listener();
  return true;
}

export function readSuspended(): Suspension | null {
  return current;
}

export function clearSuspended(): void {
  current = null;
  for (const listener of listeners) listener();
}

export function subscribeSuspended(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
