import { NextRequest } from "next/server";
import { discoverContent } from "@/lib/contentDiscovery/discoverContent";
import { isDiscoveryTopicId } from "@/lib/contentDiscovery/topicCategories";
import type {
  ContentDiscoveryType,
  PreferredDurationBucket,
} from "@/lib/contentDiscovery/types";
import { asLearnerLevel } from "@/lib/languageAnalysisPrompt";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

function asContentType(value: unknown): ContentDiscoveryType | null {
  return value === "video" || value === "reading" ? value : null;
}

function asDurationBucket(value: unknown): PreferredDurationBucket | undefined {
  if (
    value === "short" ||
    value === "medium" ||
    value === "long" ||
    value === "any"
  ) {
    return value;
  }
  return undefined;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: {
    targetLanguage?: unknown;
    topic?: unknown;
    topicCategory?: unknown;
    contentType?: unknown;
    preferredDuration?: unknown;
    learnerLevel?: unknown;
    naturalQuery?: unknown;
    interfaceLanguage?: unknown;
    locale?: unknown;
    requireOriginalCaptions?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const contentType = asContentType(body.contentType);
  if (!contentType) {
    return jsonWithCors(
      request,
      { error: "contentType required (video|reading)" },
      { status: 400 },
    );
  }

  const topic =
    typeof body.topic === "string" ? body.topic.trim() : "";
  const naturalQuery =
    typeof body.naturalQuery === "string" ? body.naturalQuery.trim() : "";
  const topicCategory = isDiscoveryTopicId(body.topicCategory)
    ? body.topicCategory
    : undefined;
  if (!topic && !naturalQuery && !topicCategory) {
    return jsonWithCors(
      request,
      { error: "topicCategory, topic, or naturalQuery required" },
      { status: 400 },
    );
  }

  try {
    const result = await discoverContent({
      targetLanguage: coerceLanguageCode(body.targetLanguage),
      contentType,
      ...(topic ? { topic } : {}),
      ...(topicCategory ? { topicCategory } : {}),
      ...(naturalQuery ? { naturalQuery } : {}),
      ...(asDurationBucket(body.preferredDuration)
        ? { preferredDuration: asDurationBucket(body.preferredDuration) }
        : {}),
      ...(asLearnerLevel(body.learnerLevel)
        ? { learnerLevel: asLearnerLevel(body.learnerLevel) }
        : {}),
      interfaceLanguage:
        (typeof body.interfaceLanguage === "string" &&
          body.interfaceLanguage) ||
        (typeof body.locale === "string" && body.locale) ||
        "ko",
      ...(body.requireOriginalCaptions === true
        ? { requireOriginalCaptions: true }
        : {}),
    });

    return jsonWithCors(request, {
      intent: result.intent,
      candidates: result.candidates,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error("[content-discovery]", error);
    return jsonWithCors(
      request,
      { error: "DISCOVERY_FAILED" },
      { status: 500 },
    );
  }
}
