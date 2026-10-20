/**
 * 영상·음성 통화의 연결 길(ICE 서버). 사람끼리 직접 잇는 게 기본이고(STUN, 비용 0),
 * 회사·통신사 망처럼 직접 안 되는 짝만 중계(TURN)를 쓴다.
 *
 * 중계는 Cloudflare Realtime TURN — 키(TURN key id·API 토큰)는 서버에만 두고, 앱에는
 * 짧게 쓰는 아이디·비밀번호만 준다. 환경 변수가 없으면 지금처럼 STUN만(꺼진 상태).
 * 요금: 나가는 데이터 1GB당 $0.05, 월 1,000GB 무료(hub/drafts/video-workspace.md).
 *
 * 비공개 통화 방(1:1·러닝메이트·단체방)에만 준다(api/rooms "ice"). 공개 방은 16명 메시라
 * 중계를 쓰면 데이터가 크게 늘어 아직 주지 않는다.
 */

export type IceServer = { urls: string | string[]; username?: string; credential?: string };

export const STUN_ONLY: IceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

/** 발급한 아이디의 수명. 방이 6시간 남으니 그보다 길게. */
export const TURN_TTL_SECONDS = 12 * 60 * 60;
/** 같은 서버 인스턴스는 받은 아이디를 이만큼 다시 쓴다(수명의 절반 — 받은 사람이 반나절은 쓸 수 있게). */
const REUSE_MS = 6 * 60 * 60 * 1000;

let cached: { at: number; servers: IceServer[] } | null = null;

export function turnConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.CLOUDFLARE_TURN_KEY_ID?.trim() && env.CLOUDFLARE_TURN_API_TOKEN?.trim());
}

/**
 * 브라우저가 막는 53번 포트 주소는 뺀다(Cloudflare 문서: 시간만 끈다).
 * 빈 주소만 남은 항목도 뺀다.
 */
export function cleanIceServers(servers: unknown): IceServer[] {
  if (!Array.isArray(servers)) return [];
  const out: IceServer[] = [];
  for (const row of servers) {
    if (!row || typeof row !== "object") continue;
    const { urls, username, credential } = row as Record<string, unknown>;
    const list = (Array.isArray(urls) ? urls : [urls]).filter(
      (url): url is string => typeof url === "string" && /^(stun|turns?):/.test(url) && !/:53(\?|$)/.test(url),
    );
    if (!list.length) continue;
    out.push({
      urls: list,
      ...(typeof username === "string" ? { username } : {}),
      ...(typeof credential === "string" ? { credential } : {}),
    });
  }
  return out;
}

/** 통화에 쓸 ICE 서버. 중계를 못 받으면(설정 없음·오류) STUN만 — 통화는 지금처럼 된다. */
export async function iceServers(
  env: NodeJS.ProcessEnv = process.env,
  fetcher: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<{ servers: IceServer[]; relay: boolean }> {
  if (!turnConfigured(env)) return { servers: STUN_ONLY, relay: false };
  if (cached && now - cached.at < REUSE_MS) return { servers: cached.servers, relay: true };
  try {
    const keyId = env.CLOUDFLARE_TURN_KEY_ID!.trim();
    const response = await fetcher(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(keyId)}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${env.CLOUDFLARE_TURN_API_TOKEN!.trim()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ttl: TURN_TTL_SECONDS }),
        signal: AbortSignal.timeout(4_000),
      },
    );
    if (!response.ok) throw new Error(`TURN ${response.status}`);
    const servers = cleanIceServers(((await response.json()) as { iceServers?: unknown }).iceServers);
    if (!servers.some((row) => (Array.isArray(row.urls) ? row.urls : [row.urls]).some((url) => url.startsWith("turn")))) {
      throw new Error("TURN: no relay url");
    }
    cached = { at: now, servers };
    return { servers, relay: true };
  } catch (error) {
    console.warn("[turn] falling back to STUN", error);
    return { servers: STUN_ONLY, relay: false };
  }
}

/** 테스트용. */
export function resetTurnCache(): void {
  cached = null;
}
