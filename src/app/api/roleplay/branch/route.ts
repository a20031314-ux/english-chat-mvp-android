import { NextRequest } from "next/server";
import { serverTutorGender, tutorChoices } from "@/lib/chatPartner";
import { BRANCH_SYSTEM, branchPrompt, learnerNode, otherScript, readPick, ruleBranch, type BranchPick } from "@/lib/roleplay/branchPick";
import { sceneTutor } from "@/lib/roleplay/callScene";
import { findScene } from "@/lib/roleplay/sceneStore";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { completeChat } from "@/lib/server/llm";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * POST { sceneId, nodeId, heard, strictness?, tutorGender? } → { go, branch, by }
 *
 * 장면 통화의 가지 고르기(2026-11-02, `hub/drafts/call-scripts-design-2026-11-01.md` 4절 2, lib/roleplay/branchPick.ts).
 * 앱이 규칙 맞추기로 못 받은 학습자 말을 보내면: 서버가 규칙을 한 번 더(같은 엄격함) → 그래도 없으면 Haiku가 가지 하나 또는 없음.
 * `by: "none"`이면 앱은 지금처럼 튜터(/api/roleplay/turn)를 부른다. 장면은 서버의 것만(요청의 글을 믿지 않음).
 * 학습자 말은 판단에만 쓰고 어디에도 남기지 않는다. 짧게만 받는다(300자).
 * 아직 이 API를 부르는 앱은 없다 — 장면 고르기 화면과 같이(앱 빌드).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const NONE: BranchPick = { go: null, branch: null, by: "none" };

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const sceneId = typeof body.sceneId === "string" ? body.sceneId.trim() : "";
  const nodeId = typeof body.nodeId === "string" ? body.nodeId.trim().slice(0, 80) : "";
  const heard = typeof body.heard === "string" ? body.heard.replace(/\s+/g, " ").trim() : "";
  if (!sceneId || !nodeId || heard.length > 300) {
    return jsonWithCors(request, { error: "bad input" }, { status: 400 });
  }
  const scene = await findScene(sceneId);
  const node = scene ? learnerNode(scene, nodeId) : null;
  if (!scene || !node) return jsonWithCors(request, { error: "unknown scene or step" }, { status: 400 });
  if (!heard) return jsonWithCors(request, NONE);

  const gender = serverTutorGender(scene.language, body.tutorGender);
  const tutor = sceneTutor(scene.language, gender, tutorChoices(scene.language)[gender]);
  const raw = typeof body.strictness === "number" && Number.isFinite(body.strictness) ? body.strictness : 0.6;
  const strictness = Math.min(0.9, Math.max(0.3, raw));

  // 규칙으로 맞으면 모델 없이(앱이 엄격함을 높게 보냈거나 옛 판단과 다를 때).
  const byRule = ruleBranch(scene, nodeId, heard, strictness, tutor);
  if (byRule) return jsonWithCors(request, byRule);

  // 학습 언어 글자가 하나도 없는 말(한국어 장면에 영어로)은 모델 없이 없음 — 튜터가 받는다.
  if (otherScript(scene.language, heard)) return jsonWithCors(request, NONE);

  const client = getOpenAIClient();
  if (!client) return jsonWithCors(request, NONE);
  await meterRequest(request, "roleplayBranch");
  let failure = "";
  const completion = await completeChat(client, "roleplayBranch", {
    response_format: { type: "json_object" },
    max_tokens: 300,
    messages: [
      { role: "system", content: BRANCH_SYSTEM },
      { role: "user", content: branchPrompt(scene, node, heard, tutor) },
    ],
  }).catch((error: unknown) => {
    failure = error instanceof Error ? error.message.slice(0, 200) : "error";
    return null;
  });
  const reply = completion?.choices[0]?.message?.content ?? "";
  const pick = readPick(reply, node.expect.length);
  const result: BranchPick = pick === null ? NONE : { go: node.expect[pick]!.go, branch: pick, by: "model" };
  // 점검용: 머리 x-branch-debug면 모델 답(학습자 말은 없음)을 같이.
  const debug = request.headers.get("x-branch-debug") === "1" ? { reply: reply.slice(0, 200), failure, rev: "b3" } : {};
  return jsonWithCors(request, { ...result, ...debug });
}
