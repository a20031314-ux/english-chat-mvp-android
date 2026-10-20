import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccounts } from "@/lib/server/accountStore";
import { blockedEitherWay } from "@/lib/server/socialStore";
import { openThreadDirect, send } from "@/lib/server/dmStore";
import { createRoom } from "@/lib/server/roomStore";
import { fetchPortoneVerification, portoneConfigured } from "@/lib/server/identityVerify";
import { isOff, joinOrPoll, leaveQueue, randomEnabled, readAdult, recordAdult } from "@/lib/server/randomStore";
import { isRandomMode, type RandomStatus } from "@/lib/random/protocol";
import { isLearningLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * 랜덤 연결(창구 Spin, lib/random/protocol.ts). 스위치 `RANDOM_ENABLED=1`이 없으면 상태만 "off"로 답하고 아무것도 잇지 않는다.
 *
 * - status: 내 상태(off · signedOut · unverified · minor · blocked · ready)
 * - verify {verificationId}: 포트원 본인인증 번호 → 서버가 포트원에 직접 물어 성인인지 남긴다(나이·ci 해시만)
 * - join / poll {mode, learn, ui}: 기다리기·짝 찾기(2초마다). 짝이 정해지면 1:1 대화가 바로 열리고, 영상이면 둘만의 영상 방도
 * - leave: 그만 찾기
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

async function statusFor(me: string | null): Promise<RandomStatus> {
  if (!randomEnabled()) return { state: "off" };
  if (!me) return { state: "signedOut" };
  const record = await readAdult(me);
  if (!record) return { state: "unverified", verifyReady: portoneConfigured() };
  if (await isOff(record)) return { state: "blocked" };
  return record.adult ? { state: "ready" } : { state: "minor" };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const auth = requestAuth(request);
  const me = auth?.accountId ?? null;
  const action = body.action;

  if (action === "status") return jsonWithCors(request, { status: await statusFor(me) });
  if (!randomEnabled()) return bad(request, "OFF", 403);
  if (!me) return bad(request, "SIGNED_OUT", 401);

  if (action === "verify") {
    const verificationId = typeof body.verificationId === "string" ? body.verificationId.trim() : "";
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(verificationId)) return bad(request, "BAD_ID");
    const found = await fetchPortoneVerification(verificationId);
    if (!found.ok) return bad(request, found.reason, found.reason === "NOT_CONFIGURED" ? 503 : 400);
    // 인증 창을 연 계정과 같아야 한다(앱이 customData에 계정 id를 넣어 연다).
    if (found.customData !== me) return bad(request, "NOT_MINE", 403);
    const result = await recordAdult(me, verificationId, { birthDate: found.birthDate, ci: found.ci, foreigner: found.foreigner });
    if (result === "USED" || result === "CI_TAKEN" || result === "OFF") return bad(request, result, 409);
    return jsonWithCors(request, { status: await statusFor(me) });
  }

  if (action === "leave") {
    await leaveQueue(me);
    return jsonWithCors(request, { ok: true });
  }

  if (action === "join" || action === "poll") {
    const status = await statusFor(me);
    if (status.state !== "ready") return bad(request, status.state.toUpperCase(), 403);
    if (!isRandomMode(body.mode)) return bad(request, "BAD_MODE");
    const learn = typeof body.learn === "string" && isLearningLanguageCode(body.learn) ? body.learn : null;
    const ui = typeof body.ui === "string" && isLearningLanguageCode(body.ui) ? body.ui : null;
    const match = await joinOrPoll({
      me,
      mode: body.mode,
      side: { learn, ui },
      blocked: (other) => blockedEitherWay(me, other),
      connect: async (a, b, mode) => {
        const thread = await openThreadDirect(a.id, b.id);
        const [left, right] = await readAccounts([a.id, b.id]);
        const names = {
          [a.id]: left?.profile.nickname || left?.username || "",
          [b.id]: right?.profile.nickname || right?.username || "",
        };
        if (mode === "chat") return { threadId: thread.id, names };
        const room = await createRoom({
          name: "🎲",
          languages: [],
          hostPeerId: `random${thread.id.slice(-10)}`,
          hostAccountId: a.id,
          hostNickname: names[a.id],
          private: true,
          allowed: [a.id, b.id],
          threadId: thread.id,
          video: true,
          random: true,
        });
        // 대화에 "통화" 줄 — 둘 중 누가 나갔다 와도 다시 들어갈 수 있고, 끝나면 자막·채팅이 통화 기록으로 남는다.
        await send({ from: a.id, to: b.id, kind: "call", text: "", roomId: room.id });
        return { threadId: thread.id, roomId: room.id, names };
      },
    });
    return jsonWithCors(request, { match });
  }

  return bad(request, "UNKNOWN_ACTION");
}
