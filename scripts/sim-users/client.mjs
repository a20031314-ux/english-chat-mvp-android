/**
 * 운영(또는 미리보기) API를 부르는 공통 창구. 요청 수를 세고, 상한을 넘으면 보내지 않는다.
 * 모든 묶음(suite)이 이걸로 부르니, --max-requests 하나로 실행 전체 비용을 막는다.
 */
export function makeClient({ api, maxRequests = 3000, timeoutMs = 40_000, appVersion = "sim-users" }) {
  const state = { count: 0, byPath: new Map() };

  // force: 정리 요청(임시 계정·테스트 글 지우기)은 상한을 넘어도 보낸다 — 지우지 못하고 남는 것을 막는다.
  async function call(userId, path, { method = "POST", body, query, headers = {}, timeout = timeoutMs, force = false } = {}) {
    if (!force && state.count >= maxRequests) return { status: 0, ms: 0, path, error: "MAX_REQUESTS 도달 — 보내지 않음" };
    state.count += 1;
    const base = path.split("?")[0];
    state.byPath.set(base, (state.byPath.get(base) ?? 0) + 1);
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${api}${path}${qs}`, {
        method,
        headers: {
          ...(body !== undefined ? { "content-type": "application/json" } : {}),
          "x-rc-user": userId,
          "x-app-version": appVersion,
          "x-tz-offset": "540",
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const text = await response.text();
      let parsed = null;
      try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text.slice(0, 400) }; }
      return { status: response.status, ms: Date.now() - started, path, body: parsed };
    } catch (error) {
      return { status: 0, ms: Date.now() - started, path, error: error.name === "AbortError" ? `시간 초과 ${timeout / 1000}초` : String(error) };
    } finally {
      clearTimeout(timer);
    }
  }

  return { call, state };
}
