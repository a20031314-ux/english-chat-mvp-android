/**
 * 채팅 한 턴을 "답 먼저, 교정은 도착하면"으로 받는다(서버 /api/chat stream:true, 2026-10-22).
 * 서버는 NDJSON 두 줄을 보낸다: {"type":"reply",...} → {"type":"correction",...}.
 * 옛 서버나 오류는 보통 JSON 한 덩어리로 오므로 그것도 같은 모양으로 돌려준다.
 */

export type ChatReply = { assistantMessage: string; spokenReply?: string };
export type ChatCorrectionPayload = { corrected: string; natural: string; explanation: string };

export type ChatStreamLine =
  | ({ type: "reply" } & ChatReply)
  | { type: "correction"; correction: ChatCorrectionPayload | null; reused?: unknown[] }
  | { type: "error"; error: string };

/** 쌓인 글에서 끝난 줄만 꺼낸다. 남은 조각은 rest로. 깨진 줄은 건너뛴다. */
export function takeNdjsonLines(buffer: string): { lines: ChatStreamLine[]; rest: string } {
  const lines: ChatStreamLine[] = [];
  let rest = buffer;
  let cut: number;
  while ((cut = rest.indexOf("\n")) >= 0) {
    const raw = rest.slice(0, cut).trim();
    rest = rest.slice(cut + 1);
    if (!raw) continue;
    try {
      const item = JSON.parse(raw) as ChatStreamLine;
      if (item && typeof item === "object" && typeof item.type === "string") lines.push(item);
    } catch {
      // 줄 하나가 깨져도 나머지는 읽는다.
    }
  }
  return { lines, rest };
}

/**
 * 앱 안에서도 정말 흘려 받는 fetch. Capacitor가 fetch를 네이티브 HTTP로 바꿔 두면 몸통이 한 번에 오므로,
 * 브리지가 남겨 둔 WebView 원래 fetch를 쓴다(roleplay/listen.ts와 같은 방법).
 */
function streamingFetch(): typeof fetch {
  const saved = (globalThis as { CapacitorWebFetch?: typeof fetch }).CapacitorWebFetch;
  return saved ?? fetch;
}

export class ChatHttpError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string) {
    super(code || `HTTP ${status}`);
    this.status = status;
    this.code = code;
  }
}

/**
 * 보내고, 답이 오면 onReply(바로 화면에), 교정은 돌려주는 promise로.
 * 답이 오기 전 실패는 throw(부르는 쪽이 예전 방식으로 다시 보낼 수 있게). 답 뒤 실패는 correction null.
 */
export async function postChatStream(
  url: string,
  headers: HeadersInit,
  body: Record<string, unknown>,
  onReply: (reply: ChatReply) => void,
  /** 약한 곳을 대화에서 다시 썼을 때 그 이름들(서버 curriculum/reuse.ts, 교정 줄에 같이 옴). */
  onReused?: (labels: string[]) => void,
): Promise<ChatCorrectionPayload | null> {
  const response = await streamingFetch()(url, {
    method: "POST",
    headers: (() => {
      const merged = new Headers(headers);
      merged.set("Content-Type", "application/json");
      return merged;
    })(),
    body: JSON.stringify({ ...body, stream: true }),
  });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new ChatHttpError(response.status, typeof data.error === "string" ? data.error : "");
  }
  if (!type.includes("ndjson") || !response.body) {
    // 스트림을 모르는 서버: 한 덩어리 답.
    const data = (await response.json()) as ChatReply & { correction?: ChatCorrectionPayload; reused?: string[] };
    onReply({ assistantMessage: data.assistantMessage, spokenReply: data.spokenReply });
    if (Array.isArray(data.reused) && data.reused.length) onReused?.(data.reused);
    return data.correction ?? null;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let replied = false;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const taken = takeNdjsonLines(buffer);
      buffer = taken.rest;
      for (const line of taken.lines) {
        if (line.type === "reply") {
          replied = true;
          onReply({ assistantMessage: line.assistantMessage, spokenReply: line.spokenReply });
        } else if (line.type === "correction") {
          if (Array.isArray(line.reused) && line.reused.length) onReused?.(line.reused.filter((x: unknown): x is string => typeof x === "string"));
          return line.correction;
        } else if (line.type === "error" && !replied) {
          throw new ChatHttpError(500, line.error);
        }
      }
    }
  } catch (error) {
    if (!replied) throw error;
    return null;
  }
  if (!replied) throw new ChatHttpError(500, "EMPTY_STREAM");
  return null;
}
