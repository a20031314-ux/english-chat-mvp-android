import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccounts } from "@/lib/server/accountStore";
import { blockedEitherWay } from "@/lib/server/socialStore";
import { openThreadDirect, send } from "@/lib/server/dmStore";
import { createRoom } from "@/lib/server/roomStore";
import { fetchPortoneVerification, portoneConfigured } from "@/lib/server/identityVerify";
import { isOff, joinOrPoll, leaveQueue, pausedUntil, randomEnabled, readAdult, recordAdult, recordStrike, takeFrameTurn } from "@/lib/server/randomStore";
import { getOpenAIClient } from "@/lib/server/openai";
import { meterRequest } from "@/lib/server/meterRequest";
import { readMeta } from "@/lib/server/roomStore";
import { addReport } from "@/lib/server/socialStore";
import { isRoomId } from "@/lib/rooms/protocol";
import { RANDOM_FRAME_MAX_CHARS, isRandomMode, type RandomStatus } from "@/lib/random/protocol";
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

/**
 * 해외용 나이 확인(신분증·얼굴 나이 추정 업체, `hub/drafts/doors.md`): 업체를 정하고 계약한 뒤 붙인다.
 * 그때까지 false — 해외 접속자는 "해외 인증 준비 중"을 보고, 한국 휴대폰 번호가 있으면 포트원으로 인증할 수 있다.
 */
function globalVerifyConfigured(): boolean {
  return false;
}

async function statusFor(me: string | null, country: string | null = null): Promise<RandomStatus> {
  if (!randomEnabled()) return { state: "off" };
  if (!me) return { state: "signedOut" };
  const record = await readAdult(me);
  if (record?.offBy) return { state: "blocked" };
  if (!record) return { state: "unverified", verifyReady: portoneConfigured(), globalReady: globalVerifyConfigured(), country };
  if (await isOff(record)) return { state: "blocked" };
  if (!record.adult) return { state: "minor" };
  const until = await pausedUntil(me);
  return until ? { state: "paused", until } : { state: "ready" };
}

/** 검사 모델(OpenAI moderation, 이미지·무료 — 사진 검사와 같은 것). 못 물어보면 null(걸린 것으로 보지 않음). */
async function frameFlagged(dataUrl: string): Promise<boolean | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  try {
    const result = await client.moderations.create({
      model: "omni-moderation-latest",
      input: [{ type: "image_url", image_url: { url: dataUrl } }],
    });
    return result.results.some((row) => row.flagged);
  } catch (error) {
    console.error("[random] frame moderation failed", error);
    return null;
  }
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
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase().slice(0, 2) || null;

  if (action === "status") return jsonWithCors(request, { status: await statusFor(me, country) });
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
    return jsonWithCors(request, { status: await statusFor(me, country) });
  }

  // AI 영상 검사(랜덤 영상 방만). 화면은 검사 뒤 버린다(저장하지 않음).
  if (action === "frame") {
    if (!isRoomId(body.roomId) || (body.who !== "self" && body.who !== "other")) return bad(request, "BAD_FRAME");
    const image = typeof body.image === "string" ? body.image : "";
    if (image.length > RANDOM_FRAME_MAX_CHARS || !/^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) return bad(request, "BAD_FRAME");
    const meta = await readMeta(body.roomId);
    if (!meta?.random || !(meta.allowed ?? []).includes(me)) return bad(request, "NOT_IN_ROOM", 403);
    if (!(await takeFrameTurn(me))) return jsonWithCors(request, { flagged: false, skipped: true });
    void meterRequest(request, "randomFrame");
    const flagged = await frameFlagged(image);
    if (!flagged) return jsonWithCors(request, { flagged: false });
    if (body.who === "self") {
      const strike = await recordStrike(me);
      return jsonWithCors(request, { flagged: true, pausedUntil: strike.pausedUntil, off: strike.off });
    }
    // 상대 화면: 통화를 끝내고 운영자 확인용 신고만(보낸 화면이 진짜 상대 것인지 서버가 알 수 없어 자동 정지는 하지 않는다).
    const other = (meta.allowed ?? []).find((id) => id !== me) ?? null;
    if (other) {
      await addReport({ at: new Date().toISOString(), reporter: me, target: other, reason: "ai_video", roomId: meta.id, lines: [] });
    }
    return jsonWithCors(request, { flagged: true });
  }

  if (action === "leave") {
    await leaveQueue(me);
    return jsonWithCors(request, { ok: true });
  }

  if (action === "join" || action === "poll") {
    const status = await statusFor(me, country);
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
