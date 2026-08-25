import {
  FREE_CATALOG_TRIAL_COUNT,
  FREE_MONTHLY_IMPORT_POINTS,
  MAX_VIDEO_PREP_SECONDS,
  PREMIUM_MONTHLY_IMPORT_POINTS,
  VIDEO_IMPORT_POINT_SECONDS,
} from "./config.ts";
import {
  isLibraryVideoId,
  isTrialEligibleClip,
} from "../videoLibrary/catalog.ts";
import type { LearningLanguageCode } from "../learningLanguages.ts";

export function monthlyImportPoints(isPremium: boolean) {
  return isPremium ? PREMIUM_MONTHLY_IMPORT_POINTS : FREE_MONTHLY_IMPORT_POINTS;
}

export function maxVideoPrepSeconds(_isPremium = true) {
  return MAX_VIDEO_PREP_SECONDS;
}

/** @deprecated Seconds equivalent of the monthly import allowance. */
export function monthlyVideoPrepAllowanceSeconds(isPremium: boolean) {
  return monthlyImportPoints(isPremium) * VIDEO_IMPORT_POINT_SECONDS;
}

export function videoPrepMinutes(seconds: number) {
  return Math.max(0, Math.round(seconds / 60));
}

export function importPointsForDuration(durationSeconds: number) {
  const duration = Math.max(0, Math.ceil(durationSeconds));
  if (duration <= 0) return 1;
  return Math.ceil(duration / VIDEO_IMPORT_POINT_SECONDS);
}

export function remainingImportSeconds(usedPoints: number, isPremium: boolean) {
  const remaining = Math.max(0, monthlyImportPoints(isPremium) - usedPoints);
  return remaining * VIDEO_IMPORT_POINT_SECONDS;
}

export type VideoAccessReason =
  | "quota"
  | "too_long"
  | "import_locked"
  | "catalog_locked";

export type VideoAccessDecision =
  | {
      ok: true;
      kind: "library" | "import";
      billablePoints: number;
    }
  | { ok: false; reason: VideoAccessReason; maxSeconds: number };

export function evaluateVideoAccess(input: {
  isPremium: boolean;
  videoId: string;
  language: LearningLanguageCode;
  durationSeconds?: number | null;
  usedPoints: number;
  billedVideoIds: string[];
  trialVideoIds: string[];
}): VideoAccessDecision {
  const perVideo = maxVideoPrepSeconds(input.isPremium);
  const duration = Math.max(0, Math.ceil(input.durationSeconds ?? 0));
  if (duration > perVideo) {
    return { ok: false, reason: "too_long", maxSeconds: perVideo };
  }

  if (isLibraryVideoId(input.videoId)) {
    if (input.isPremium) {
      return { ok: true, kind: "library", billablePoints: 0 };
    }
    if (input.trialVideoIds.includes(input.videoId)) {
      return { ok: true, kind: "library", billablePoints: 0 };
    }
    if (
      input.trialVideoIds.length < FREE_CATALOG_TRIAL_COUNT &&
      isTrialEligibleClip(input.videoId, input.language)
    ) {
      return { ok: true, kind: "library", billablePoints: 0 };
    }
    return { ok: false, reason: "catalog_locked", maxSeconds: perVideo };
  }

  if (!input.isPremium) {
    return { ok: false, reason: "import_locked", maxSeconds: perVideo };
  }

  if (input.billedVideoIds.includes(input.videoId)) {
    return { ok: true, kind: "import", billablePoints: 0 };
  }

  const remaining = Math.max(
    0,
    monthlyImportPoints(true) - Math.max(0, input.usedPoints),
  );
  if (remaining <= 0) {
    return { ok: false, reason: "quota", maxSeconds: perVideo };
  }

  const points =
    duration > 0 ? importPointsForDuration(duration) : 1;
  if (points > remaining) {
    return { ok: false, reason: "quota", maxSeconds: perVideo };
  }

  return { ok: true, kind: "import", billablePoints: points };
}

/** Legacy helper used by older call sites that only knew duration. */
export function evaluateVideoPrep(input: {
  isPremium: boolean;
  usedSeconds: number;
  durationSeconds?: number | null;
}):
  | { ok: true; billableSeconds: number }
  | { ok: false; reason: "quota" | "too_long"; maxSeconds: number } {
  const usedPoints = Math.ceil(
    Math.max(0, input.usedSeconds) / VIDEO_IMPORT_POINT_SECONDS,
  );
  const decision = evaluateVideoAccess({
    isPremium: input.isPremium,
    videoId: "",
    language: "en",
    durationSeconds: input.durationSeconds,
    usedPoints,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  if (!decision.ok) {
    if (decision.reason === "too_long") {
      return { ok: false, reason: "too_long", maxSeconds: decision.maxSeconds };
    }
    return { ok: false, reason: "quota", maxSeconds: decision.maxSeconds };
  }
  return {
    ok: true,
    billableSeconds: decision.billablePoints * VIDEO_IMPORT_POINT_SECONDS,
  };
}
