import type { NextRequest } from "next/server";
import {
  evaluateVideoAccess,
  maxVideoPrepSeconds,
  monthlyImportPoints,
  remainingImportSeconds,
} from "@/lib/billing/videoPrep";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { parseYouTubeInput } from "@/lib/videoLearning";
import {
  addCatalogTrialVideo,
  addMonthlyImportPoints,
  getBilledImportVideoIds,
  getCatalogTrialVideoIds,
  getMonthlyImportPointsUsed,
} from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import {
  VideoPipelineError,
  type VideoSubtitleErrorCode,
} from "@/lib/videoSubtitle/errors";

export function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

function requestLanguage(request: NextRequest): LearningLanguageCode {
  const header = request.headers.get("x-learning-language");
  if (header && header.length === 2) {
    return header as LearningLanguageCode;
  }
  return DEFAULT_LEARNING_LANGUAGE_CODE;
}

export function videoPrepLimitsForRequest(request: NextRequest) {
  const isPremium = isPremiumClientRequest(request);
  const userId = requestUserId(request);
  const usedPoints = getMonthlyImportPointsUsed(userId);
  return {
    isPremium,
    userId,
    usedPoints,
    billedVideoIds: getBilledImportVideoIds(userId),
    trialVideoIds: getCatalogTrialVideoIds(userId),
    remainingPrepSeconds: remainingImportSeconds(usedPoints, isPremium),
    maxDurationSeconds: maxVideoPrepSeconds(isPremium),
    language: requestLanguage(request),
    importPointsLimit: monthlyImportPoints(isPremium),
  };
}

function errorCodeForReason(
  reason: "quota" | "too_long" | "import_locked" | "catalog_locked",
): VideoSubtitleErrorCode {
  if (reason === "too_long") return "VIDEO_TOO_LONG";
  if (reason === "import_locked") return "IMPORT_LOCKED";
  if (reason === "catalog_locked") return "CATALOG_LOCKED";
  return "VIDEO_QUOTA";
}

export function assertVideoPrepAllowed(
  request: NextRequest,
  options?: { durationSeconds?: number | null; videoUrl?: string },
) {
  const parsed = parseYouTubeInput(options?.videoUrl ?? "");
  const limits = videoPrepLimitsForRequest(request);
  const decision = evaluateVideoAccess({
    isPremium: limits.isPremium,
    videoId: parsed.ok ? parsed.videoId : "",
    language: limits.language,
    durationSeconds: options?.durationSeconds,
    usedPoints: limits.usedPoints,
    billedVideoIds: limits.billedVideoIds,
    trialVideoIds: limits.trialVideoIds,
  });
  if (!decision.ok) {
    throw new VideoPipelineError(errorCodeForReason(decision.reason));
  }
  return { ...limits, decision };
}

export function recordVideoPrepForRequest(
  request: NextRequest,
  durationSeconds: number,
  videoUrl?: string,
) {
  const parsed = parseYouTubeInput(videoUrl ?? "");
  const videoId = parsed.ok ? parsed.videoId : "";
  const checked = assertVideoPrepAllowed(request, {
    durationSeconds,
    videoUrl,
  });
  if (checked.decision.kind === "library") {
    if (!checked.isPremium && videoId) {
      addCatalogTrialVideo(checked.userId, videoId);
    }
    return checked.usedPoints;
  }
  return addMonthlyImportPoints(
    checked.userId,
    checked.decision.billablePoints,
    videoId,
  );
}
