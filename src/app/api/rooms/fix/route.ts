import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { takeFixMarks } from "@/lib/server/entitlementStore";
import { contentHash } from "@/lib/roleplay/script";
import { turnTranscribeModel, wantsTrialReport } from "@/lib/server/speechModels";
import { secondModelFor, transcribeOnce } from "@/lib/server/secondListen";
import { runRoomFix } from "@/lib/server/roomFix";
import { compareTranscripts } from "@/lib/rooms/agreement";
import { joinPartTexts } from "@/lib/rooms/speechParts";
import { leansOnOwnLanguage } from "@/lib/roleplay/transcript";
import { writtenInLearningLanguage } from "@/lib/inputLanguage";
import { coerceLanguageCode, isInterfaceLanguage } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * 말하는 방 내 줄 교정(2026-10-22, 사용자 결정) — 내 말이 끝나면 앱이 그 말의 조각들을 보낸다.
 *
 * 1. 받아쓰기(`/api/roleplay/listen`)가 남긴 표가 있는 조각만(글 지문이 같아야). 표는 오늘 방 자막 한도 안에서만 생기고 한 번 쓰면 지워진다.
 * 2. 내 배우는 언어로 한 말만(편한 말에 기댄 줄은 고치지 않는다).
 * 3. 확신이 어중간한 조각(check)은 다른 모델로 한 번 더 받아써 견준다(rooms/agreement.ts): 구조가 다르면 교정 안 함,
 *    낱말 몇 개만 다르면 그 낱말은 고치지 않고 교정.
 * 4. 채팅 교정과 같은 기준으로 고친다(server/roomFix.ts). 결과는 말한 사람에게만 — 방에 올리지 않고 저장하지 않는다.
 * 앱은 결과를 접어 두고("✎ 고칠 곳이 있어요") 누르면 연다. 위험한 줄은 열 때 `/api/chat/verify`가 한 번 더 본다.
 */

const MAX_PART_BYTES = 8 * 1024 * 1024;
const MAX_PARTS = 24;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type PartIn = { part: number; text: string; audioBase64: string; mimeType: string };

function readParts(raw: unknown): PartIn[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_PARTS) return null;
  const parts: PartIn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const part = row.part;
    const text = typeof row.text === "string" ? row.text.replace(/\s+/g, " ").trim().slice(0, 600) : "";
    if (typeof part !== "number" || !Number.isInteger(part) || part < 0 || part >= 100 || !text) return null;
    parts.push({
      part,
      text,
      audioBase64: typeof row.audioBase64 === "string" ? row.audioBase64 : "",
      mimeType: typeof row.mimeType === "string" ? row.mimeType : "audio/webm",
    });
  }
  return parts.sort((a, b) => a.part - b.part);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const utterance = typeof body.utterance === "string" && /^[A-Za-z0-9_-]{4,40}$/.test(body.utterance) ? body.utterance : "";
  const parts = readParts(body.parts);
  if (!utterance || !parts) return jsonWithCors(request, { error: "utterance and parts required" }, { status: 400 });
  const target = coerceLanguageCode(body.targetLanguage);
  const ui =
    typeof body.interfaceLanguage === "string" && isInterfaceLanguage(body.interfaceLanguage) ? body.interfaceLanguage : "ko";
  const recent = Array.isArray(body.recent)
    ? body.recent.filter((line): line is string => typeof line === "string").map((line) => line.slice(0, 300)).slice(-6)
    : [];
  const skip = (reason: string, extra: Record<string, unknown> = {}) => jsonWithCors(request, { skip: reason, ...extra });

  const userId = requestUserId(request);
  if (!isIdentified(userId)) return skip("anonymous");
  const marks = await takeFixMarks(userId, utterance, parts.map((row) => row.part)).catch(() => parts.map(() => null));
  const trust: ("high" | "check")[] = [];
  for (const [index, row] of parts.entries()) {
    const mark = marks[index];
    if (!mark || mark.h !== contentHash(row.text)) return skip("no_mark");
    trust.push(mark.trust);
  }

  const text = joinPartTexts(parts.map((row) => row.text));
  if (!writtenInLearningLanguage(text, target, ui) || leansOnOwnLanguage(text, target, ui)) return skip("language");

  const openai = getOpenAIClient();
  if (!openai) return skip("no_model");

  // 어중간한 조각만 두 번째 의견(나란히).
  const primary = turnTranscribeModel(request);
  const second = secondModelFor(primary);
  const disputed: string[] = [];
  const heard: { part: number; second: string; kind: string }[] = [];
  const checks = parts.filter((_, index) => trust[index] === "check");
  if (checks.length) {
    if (checks.some((row) => !row.audioBase64)) return skip("no_audio");
    let results: { row: PartIn; again: string }[];
    try {
      results = await Promise.all(
        checks.map(async (row) => {
          const bytes = Buffer.from(row.audioBase64, "base64");
          if (bytes.byteLength === 0 || bytes.byteLength > MAX_PART_BYTES) throw new Error("bad audio");
          await meterRequest(request, "roomFixListen");
          const filename = row.mimeType.includes("wav") ? "line.wav" : row.mimeType.includes("mp4") ? "line.mp4" : "line.webm";
          const again = await transcribeOnce(openai, second, { bytes, mimeType: row.mimeType, filename, languages: [target] });
          return { row, again };
        }),
      );
    } catch (error) {
      console.error("[rooms/fix] second listen", error);
      return skip("second_failed");
    }
    for (const { row, again } of results) {
      const agreement = compareTranscripts(row.text, again, target);
      heard.push({ part: row.part, second: again, kind: agreement.kind });
      if (agreement.kind === "differ") {
        return skip("differ", wantsTrialReport(request) ? { heard, model: second } : {});
      }
      disputed.push(...agreement.disputed);
    }
  }

  await meterRequest(request, "roomFix");
  try {
    const fix = await runRoomFix(openai, { text, target, ui, recent, disputed: [...new Set(disputed)] });
    return jsonWithCors(request, {
      original: text,
      ...fix,
      ...(disputed.length ? { disputed: [...new Set(disputed)] } : {}),
      ...(wantsTrialReport(request) ? { trust, heard, model: second } : {}),
    });
  } catch (error) {
    console.error("[rooms/fix]", error);
    return skip("failed");
  }
}
