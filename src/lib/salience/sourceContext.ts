import type { SourceContext } from "./types.ts";

const SOURCE_CONTEXT_HINT: Record<SourceContext, string> = {
  videoLearning:
    "This is spoken subtitle / video dialogue. Prefer idioms, phrasal verbs, and high-value spoken chunks. Skip ordinary words that a subtitle just happens to contain.",
  webReading:
    "This is web/community/SNS text. Prefer slang, neologisms, abbreviations, memes, and in-group wording. Skip standard encyclopedia phrasing.",
  ebook:
    "This is bookish / written prose. Prefer literary diction, rhetorical devices, and formal connectors. Skip everyday spoken fillers.",
  chat:
    "This is chat or a teaching example. Prefer reusable conversational chunks. Skip items that are only interesting as trivia.",
};

export function sourceContextFromTranslation(
  sourceType?: string | null,
): SourceContext {
  switch (sourceType) {
    case "subtitle":
      return "videoLearning";
    case "web":
    case "community":
    case "social":
      return "webReading";
    case "formal":
      return "ebook";
    case "conversation":
    case "example":
    case "report":
    case "unknown":
    default:
      return "chat";
  }
}

export function sourceContextHint(context: SourceContext): string {
  return SOURCE_CONTEXT_HINT[context];
}

export function studyDocumentSourceType(
  documentType?: string | null,
): "formal" | "web" {
  if (documentType === "epub" || documentType === "pdf" || documentType === "txt") {
    return "formal";
  }
  return "web";
}
