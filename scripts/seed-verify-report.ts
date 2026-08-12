/**
 * Build a SessionReport from scripts/_verify-chat-payload.json using app libs,
 * generate review cards, then print a browser-injectable bundle.
 *
 * Run: npx tsx scripts/seed-verify-report.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const memory = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, String(value));
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
    },
    dispatchEvent: () => true,
  };

  const { buildSessionReport, saveSessionReport, SESSION_REPORTS_KEY } =
    await import("../src/lib/sessionReports");
  const { requestConversationAnalysis } = await import(
    "../src/lib/requestConversationAnalysis"
  );
  const { CONVERSATION_ANALYSIS_VERSION } = await import(
    "../src/lib/conversationAnalysis"
  );
  const { collectReviewSeedsForReport, reportHasReviewableAnalysis } =
    await import("../src/lib/reviewSources");
  const { uniqueReviewSentences } = await import("../src/lib/reviewMaterials");

  const payloadPath = path.join(__dirname, "_verify-chat-payload.json");
  const payload = JSON.parse(readFileSync(payloadPath, "utf8")) as {
    sessionId: string;
    createdAt: number;
    endedAt: number;
    locale: "ko";
    messages: Array<{
      id: string;
      role: "user" | "assistant" | "helper";
      content: string;
      createdAt: number;
    }>;
  };

  const report = buildSessionReport({
    sessionId: payload.sessionId,
    createdAt: payload.createdAt,
    messages: payload.messages,
    messageCount: payload.messages.length,
    locale: payload.locale,
    endedAt: payload.endedAt,
  });

  const aiAnalysis = await requestConversationAnalysis(
    payload.messages,
    payload.locale,
  );
  if (aiAnalysis) {
    report.conversationAnalysis = aiAnalysis;
    report.conversationAnalysisVersion = CONVERSATION_ANALYSIS_VERSION;
  }

  saveSessionReport(report);

  const seeds = collectReviewSeedsForReport(report);
  console.log("reviewable:", reportHasReviewableAnalysis(report));
  console.log("grammar seeds:", seeds.grammar.length);
  console.log("vocab seeds:", seeds.vocabulary.length);
  console.log(
    "score:",
    report.score,
    "insufficient:",
    report.scoreInsufficient,
    "breakdown:",
    report.scoreBreakdown?.factors.map((f) => `${f.id}:${f.earned}/${f.max}`),
  );

  const reviewRes = await fetch("http://localhost:3000/api/review-materials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale: "ko",
      grammar: seeds.grammar,
      vocabulary: seeds.vocabulary,
    }),
  });

  let cards: unknown[] = [];
  if (reviewRes.ok) {
    const data = (await reviewRes.json()) as { cards?: unknown[] };
    cards = Array.isArray(data.cards) ? data.cards : [];
  } else {
    console.warn("review-materials failed", reviewRes.status);
    cards = seeds.grammar.map((item) => ({
      kind: "grammar",
      id: item.id,
      title: "",
      explanation: item.explanation,
      original: item.original,
      corrected: item.corrected,
      examples: uniqueReviewSentences(item.examples, [
        item.original,
        item.corrected,
      ]),
    }));
  }

  const pack = {
    reportId: report.id,
    reportTitle: report.title,
    locale: "ko",
    sourceKey: seeds.sourceKey,
    generatedAt: Date.now(),
    cards,
  };

  const session = {
    id: payload.sessionId,
    title: report.title,
    createdAt: payload.createdAt,
    endedAt: payload.endedAt,
    messageCount: payload.messages.length,
    messages: payload.messages,
  };

  const bundle = {
    session,
    report,
    pack,
    sessionReportsKey: SESSION_REPORTS_KEY,
  };

  const outPath = path.join(__dirname, "_verify-report-bundle.json");
  writeFileSync(outPath, JSON.stringify(bundle, null, 2), "utf8");
  console.log("Wrote", outPath);
  console.log(
    "grammar cards:",
    (cards as Array<{ kind?: string }>).filter((c) => c.kind === "grammar")
      .length,
  );
  for (const card of cards as Array<{
    kind?: string;
    explanation?: string;
    original?: string;
  }>) {
    if (card.kind !== "grammar") continue;
    console.log(
      "-",
      (card.original || "").slice(0, 36),
      "|",
      (card.explanation || "").slice(0, 80),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
