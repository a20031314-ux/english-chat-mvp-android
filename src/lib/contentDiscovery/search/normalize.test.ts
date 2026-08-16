import assert from "node:assert/strict";
import test from "node:test";
import {
  dedupeVideoCandidates,
  isSupportedVideoUrl,
  mvpLearningScore,
  normalizeSearchResult,
} from "./normalize.ts";
import { buildVideoSearchQueries, withVideoSiteHint } from "./queryBuilder.ts";
import { videoCandidateToContentCandidate } from "./toContentCandidate.ts";
import type { ContentSearchIntent } from "../types.ts";

test("normalizeSearchResult keeps only supported YouTube URLs", () => {
  const ok = normalizeSearchResult({
    title: "React tutorial",
    url: "https://www.youtube.com/watch?v=dQw4w9wgGcQ",
    snippet: "learn react",
    source: "brave",
    searchQuery: "programming",
  });
  assert.ok(ok);
  assert.equal(ok?.id, "dQw4w9wgGcQ");
  assert.equal(ok?.url, "https://www.youtube.com/watch?v=dQw4w9wgGcQ");

  const bad = normalizeSearchResult({
    title: "A blog post",
    url: "https://example.com/article",
  });
  assert.equal(bad, null);
  assert.equal(isSupportedVideoUrl("https://vimeo.com/123"), false);
});

test("dedupeVideoCandidates merges tags for the same video id", () => {
  const rows = dedupeVideoCandidates([
    {
      id: "dQw4w9wgGcQ",
      title: "One",
      url: "https://www.youtube.com/watch?v=dQw4w9wgGcQ",
      source: "youtube",
      category: "tech",
    },
    {
      id: "dQw4w9wgGcQ",
      title: "One",
      url: "https://www.youtube.com/watch?v=dQw4w9wgGcQ",
      source: "youtube",
      category: "interview",
      description: "later",
    },
  ]);
  assert.equal(rows.length, 1);
  assert.ok(rows[0]?.topics?.includes("interview"));
});

test("buildVideoSearchQueries returns several intents for a category", () => {
  const intent: ContentSearchIntent = {
    language: "en",
    topic: "technology and science",
    contentType: "video",
    duration: {},
    durationBucket: "any",
    keywords: ["technology"],
    topicCategory: "tech",
  };
  const queries = buildVideoSearchQueries(intent);
  assert.ok(queries.length >= 3);
  assert.ok(queries.some((row) => /program|software|develop|coding/i.test(row)));
  assert.equal(
    withVideoSiteHint("programming", true),
    "programming site:youtube.com",
  );
});

test("videoCandidateToContentCandidate keeps the existing card URL contract", () => {
  const card = videoCandidateToContentCandidate({
    id: "dQw4w9wgGcQ",
    title: "Talk",
    url: "https://www.youtube.com/watch?v=dQw4w9wgGcQ",
    source: "youtube",
    creator: "Channel",
    duration: 120,
    learningScore: mvpLearningScore(
      {
        id: "dQw4w9wgGcQ",
        title: "Talk",
        url: "https://www.youtube.com/watch?v=dQw4w9wgGcQ",
        source: "youtube",
      },
      "talk",
    ),
  });
  assert.equal(card.type, "video");
  assert.equal(card.url, "https://www.youtube.com/watch?v=dQw4w9wgGcQ");
  assert.equal(card.externalId, "dQw4w9wgGcQ");
  assert.equal(card.authorOrChannel, "Channel");
  assert.equal(card.durationSeconds, 120);
});
