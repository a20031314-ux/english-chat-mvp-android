import assert from "node:assert/strict";
import test from "node:test";
import {
  compactViewerContext,
  emptyViewerContext,
} from "./viewerTypes.ts";

test("emptyViewerContext seeds from topic/summary", () => {
  const ctx = emptyViewerContext({
    topic: "monster story",
    summary: "A has a monster inside him.",
  });
  assert.equal(ctx.ongoingTopics[0], "monster story");
  assert.match(ctx.storySoFar, /monster/);
});

test("compactViewerContext trims long memory", () => {
  const ctx = compactViewerContext({
    storySoFar: "x".repeat(800),
    currentSituation: "now",
    characters: [{ label: "A", notes: ["has monster"] }],
    entities: [
      {
        name: "monster",
        description: "inside A",
        relatedTo: "A",
        evidenceLevel: "established",
      },
    ],
    establishedFacts: ["A has a monster inside him"],
    ongoingTopics: ["control"],
    conversationState: "B questioning A",
    recentEvents: ["transform"],
  });
  assert.ok(ctx.storySoFar.length <= 500);
  assert.equal(ctx.entities[0]?.name, "monster");
});
