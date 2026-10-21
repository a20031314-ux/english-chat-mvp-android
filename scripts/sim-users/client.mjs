/**
 * 운영(또는 미리보기) API를 부르는 공통 창구. 요청 수를 세고, 상한을 넘으면 보내지 않는다.
 * 모든 묶음(suite)이 이걸로 부르니, --max-requests 하나로 실행 전체 비용을 막는다.
 */
export function makeClient({ api, maxRequests = 3000, timeoutMs = 40_000, appVersion = "sim-users", modelRoutes = null, chatStream = false }) {
  const state = { count: 0, byPath: new Map() };

  // force: 정리 요청(임시 계정·테스트 글 지우기)은 상한을 넘어도 보낸다 — 지우지 못하고 남는 것을 막는다.
  async function call(userId, path, opts = {}) {
    // Vercel 앞단 보호가 몰아 보낸 요청을 잠깐 막으면(403 Forbidden, 앱의 답이 아님) 쉬었다 다시 — 앱 오류로 세지 않는다.
    for (const wait of [3_000, 10_000, 30_000]) {
      const res = await once(userId, path, opts);
      if (!isEdgeBlock(res)) return res;
      state.edgeBlocks = (state.edgeBlocks ?? 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    return once(userId, path, opts);
  }

  async function once(userId, path, { method = "POST", body, query, headers = {}, timeout = timeoutMs, force = false } = {}) {
    if (!force && state.count >= maxRequests) return { status: 0, ms: 0, path, error: "MAX_REQUESTS 도달 — 보내지 않음" };
    state.count += 1;
    const base = path.split("?")[0];
    state.byPath.set(base, (state.byPath.get(base) ?? 0) + 1);
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    // --chat-stream: 새 앱처럼 채팅 턴을 스트림으로(답 먼저, 교정 나중) — 두 줄을 한 응답으로 합치고 첫 줄 시간을 firstMs로.
    if (chatStream && base === "/api/chat" && body && body.mode === "chat") body = { ...body, stream: true };
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
          // 점검에서만 모델 경로 바꾸기(서버 llm.ts adoptSimRoutes, simcheck- 사용자만).
          ...(modelRoutes ? { "x-sim-model-routes": modelRoutes } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      if ((response.headers.get("content-type") ?? "").includes("ndjson")) {
        return await readStream(response, started, path);
      }
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

async function readStream(response, started, path) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let firstMs = null;
  const merged = {};
  let status = response.status;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let cut;
    while ((cut = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, cut).trim();
      buffer = buffer.slice(cut + 1);
      if (!line) continue;
      const item = JSON.parse(line);
      if (firstMs === null) firstMs = Date.now() - started;
      if (item.type === "reply") Object.assign(merged, { assistantMessage: item.assistantMessage, spokenReply: item.spokenReply });
      else if (item.type === "correction") merged.correction = item.correction ?? undefined;
      else if (item.type === "error") { status = 500; Object.assign(merged, { error: item.error, detail: item.detail }); }
    }
  }
  return { status, ms: Date.now() - started, firstMs, path, body: merged };
}

/** 앱 서버가 아니라 Vercel 앞단이 막은 응답: {"error":{"code":"403","message":"Forbidden","id":"iad1::…"}} */
export function isEdgeBlock(res) {
  const e = res?.body?.error;
  return res?.status === 403 && e && typeof e === "object" && e.message === "Forbidden" && typeof e.id === "string" && e.id.includes("::");
}
