import { test } from "node:test";
import assert from "node:assert/strict";
import { STUN_ONLY, cleanIceServers, iceServers, resetTurnCache, turnConfigured } from "./turn.ts";

const ENV = { CLOUDFLARE_TURN_KEY_ID: "key123", CLOUDFLARE_TURN_API_TOKEN: "secret" } as unknown as NodeJS.ProcessEnv;

const CF_REPLY = {
  iceServers: [
    { urls: ["stun:stun.cloudflare.com:3478", "stun:stun.cloudflare.com:53"] },
    {
      urls: [
        "turn:turn.cloudflare.com:3478?transport=udp",
        "turn:turn.cloudflare.com:53?transport=udp",
        "turns:turn.cloudflare.com:443?transport=tcp",
      ],
      username: "u",
      credential: "c",
    },
  ],
};

test("설정이 없으면 STUN만, 바깥에 묻지 않는다", async () => {
  resetTurnCache();
  let called = false;
  const result = await iceServers({} as NodeJS.ProcessEnv, (async () => {
    called = true;
    return new Response("{}");
  }) as typeof fetch);
  assert.equal(turnConfigured({} as NodeJS.ProcessEnv), false);
  assert.deepEqual(result, { servers: STUN_ONLY, relay: false });
  assert.equal(called, false);
});

test("Cloudflare에서 받은 중계 주소: 53번 포트는 빼고, 키는 머리에만", async () => {
  resetTurnCache();
  let seen: { url: string; auth: string | null; body: string } | null = null;
  const fetcher = (async (url: string, init: RequestInit) => {
    seen = { url, auth: new Headers(init.headers).get("authorization"), body: String(init.body) };
    return new Response(JSON.stringify(CF_REPLY), { status: 201 });
  }) as unknown as typeof fetch;
  const result = await iceServers(ENV, fetcher, 1_000);
  assert.equal(result.relay, true);
  assert.ok(seen);
  const sent = seen as { url: string; auth: string | null; body: string };
  assert.match(sent.url, /\/turn\/keys\/key123\/credentials\/generate-ice-servers$/);
  assert.equal(sent.auth, "Bearer secret");
  assert.equal(JSON.parse(sent.body).ttl, 12 * 60 * 60);
  const urls = result.servers.flatMap((row) => (Array.isArray(row.urls) ? row.urls : [row.urls]));
  assert.ok(urls.every((url) => !url.includes(":53")));
  assert.ok(urls.includes("turns:turn.cloudflare.com:443?transport=tcp"));
  assert.equal(result.servers[1].username, "u");
  // 반나절 안에는 다시 묻지 않는다.
  const again = await iceServers(ENV, (async () => {
    throw new Error("should not call");
  }) as typeof fetch, 1_000 + 60_000);
  assert.equal(again.relay, true);
});

test("Cloudflare 오류면 STUN만으로 — 통화는 지금처럼", async () => {
  resetTurnCache();
  const result = await iceServers(ENV, (async () => new Response("no", { status: 500 })) as typeof fetch);
  assert.deepEqual(result, { servers: STUN_ONLY, relay: false });
  resetTurnCache();
  const noRelay = await iceServers(ENV, (async () => new Response(JSON.stringify({ iceServers: [{ urls: "stun:x:3478" }] }), { status: 201 })) as typeof fetch);
  assert.equal(noRelay.relay, false);
});

test("이상한 항목은 버린다", () => {
  assert.deepEqual(cleanIceServers(null), []);
  assert.deepEqual(cleanIceServers([{ urls: "http://x" }, { urls: [] }, 3]), []);
  assert.deepEqual(cleanIceServers([{ urls: "stun:a:3478" }]), [{ urls: ["stun:a:3478"] }]);
});
