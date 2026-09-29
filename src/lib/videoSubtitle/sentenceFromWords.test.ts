import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyLlmSentenceMarks,
  matchSentencesToWordIndices,
  refineSpansWithLlm,
  splitSentencesFromWords,
} from "./sentenceFromWords.ts";
import { flattenSttToTimedWords, spanFromWordSlice } from "./timedWords.ts";
import { regularizeSttSegments } from "./sttChunks.ts";
import type { TimedWord } from "./types.ts";

function words(
  rows: Array<[string, number, number, string?]>,
): TimedWord[] {
  return rows.map(([text, start, end, speaker]) => ({
    text,
    startMs: Math.round(start * 1000),
    endMs: Math.round(end * 1000),
    ...(speaker ? { speakerTag: speaker } : {}),
  }));
}

test("flatten then punct-split does not cut after got in a VAD chunk pair", () => {
  const segments = regularizeSttSegments([
    {
      id: "a",
      text: "and then it got",
      startTime: 12.0,
      endTime: 13.4,
      words: [
        { word: "and", start: 12.0, end: 12.15 },
        { word: "then", start: 12.18, end: 12.35 },
        { word: "it", start: 12.4, end: 12.5 },
        { word: "got", start: 12.55, end: 13.35 },
      ],
    },
    {
      id: "b",
      text: "Him turfed out of the party",
      startTime: 13.5,
      endTime: 15.2,
      words: [
        { word: "Him", start: 13.5, end: 13.7 },
        { word: "turfed", start: 13.75, end: 14.1 },
        { word: "out", start: 14.15, end: 14.3 },
        { word: "of", start: 14.32, end: 14.4 },
        { word: "the", start: 14.42, end: 14.5 },
        { word: "party", start: 14.55, end: 15.15 },
      ],
    },
  ]);
  assert.equal(segments.length, 1);
  assert.match(segments[0]!.text, /got Him turfed out of the party/i);
  assert.ok(segments[0]!.startTime <= 12.05);
  assert.ok(segments[0]!.endTime >= 15.1);
  assert.equal(segments[0]!.words?.length, 10);
});

test("punctuation still splits after a finished sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Hello", 0, 0.4],
      ["there.", 0.45, 0.9],
      ["This", 1.0, 1.2],
      ["is", 1.25, 1.35],
      ["next.", 1.4, 1.8],
    ]),
  );
  assert.deepEqual(
    spans.map((span) => span.text),
    ["Hello there.", "This is next."],
  );
  assert.equal(spans[0]!.startIndex, 0);
  assert.equal(spans[0]!.endIndex, 1);
  assert.equal(spans[1]!.startIndex, 2);
});

test("false period after an open noun phrase does not split", () => {
  const spans = splitSentencesFromWords(
    words([
      ["as", 0, 0.2],
      ["a", 0.25, 0.35],
      ["first.", 0.4, 0.7],
      ["language.", 0.8, 1.3],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /first\. language\./i);
});

test("Mr. abbreviation does not start a new sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Meet", 0, 0.3],
      ["Mr.", 0.35, 0.55],
      ["Smith", 0.6, 0.9],
      ["today.", 1.0, 1.4],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /Mr\. Smith today\./);
});

test("speaker tag change forces a split even without punctuation", () => {
  const spans = splitSentencesFromWords(
    words([
      ["I", 0, 0.2, "A"],
      ["know", 0.25, 0.5, "A"],
      ["Wait", 0.7, 0.95, "B"],
      ["what", 1.0, 1.3, "B"],
    ]),
  );
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "I know");
  assert.equal(spans[1]!.text, "Wait what");
});

test(">> marker starts a new sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Hello", 0, 0.4],
      ["there.", 0.45, 0.9],
      [">>", 1.2, 1.3],
      ["No", 1.35, 1.5],
      ["way.", 1.55, 1.9],
    ]),
  );
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "Hello there.");
  assert.match(spans[1]!.text, /No way/);
});

test("LLM marks map back onto word indices", () => {
  const list = words([
    ["I", 0, 0.1],
    ["need", 0.12, 0.3],
    ["to", 0.32, 0.4],
    ["leave", 0.42, 0.6],
    ["now", 0.62, 0.8],
    ["We", 0.9, 1.0],
    ["can", 1.05, 1.2],
    ["talk", 1.22, 1.4],
    ["later", 1.45, 1.7],
  ]);
  const spans = applyLlmSentenceMarks(
    list,
    "I need to leave now ||| We can talk later",
  );
  assert.ok(spans);
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "I need to leave now");
  assert.equal(spans[1]!.text, "We can talk later");
  assert.equal(spans[0]!.startMs, 0);
  assert.ok(spans[1]!.startMs >= 900);
});

test("LLM mismatch falls back to punctuation spans", async () => {
  const list = words([
    ["and", 0, 0.2],
    ["then", 0.22, 0.4],
    ["it", 0.42, 0.5],
    ["got", 0.52, 0.7],
    ["Him", 0.8, 1.0],
    ["turfed", 1.05, 1.4],
    ["out", 1.45, 1.6],
    ["of", 1.62, 1.7],
    ["the", 1.72, 1.8],
    ["party", 1.85, 2.2],
  ]);
  const fallback = splitSentencesFromWords(list);
  const refined = await refineSpansWithLlm(list, fallback, async () => {
    return "and then it got him kicked ||| out of the party";
  });
  assert.equal(refined.length, 1);
  assert.match(refined[0]!.text, /got Him turfed/);
});

test("matched LLM sentences must equal the original word sequence", () => {
  const list = words([
    ["and", 0, 0.2],
    ["then", 0.22, 0.4],
    ["it", 0.42, 0.5],
    ["got", 0.52, 0.7],
  ]);
  assert.equal(
    matchSentencesToWordIndices(list, ["and then it went"]),
    null,
  );
});

test("Japanese tokens stay in LLM sentence matching", () => {
  const list = words([
    ["アメリカはですね", 0, 2.4],
    ["次の話題に入ります", 2.5, 4.8],
    ["逆にこの君K3の課題があるとすれば何ですか?", 5.0, 8.2],
  ]);
  const matched = matchSentencesToWordIndices(list, [
    "アメリカはですね",
    "次の話題に入ります",
    "逆にこの君K3の課題があるとすれば何ですか?",
  ]);
  assert.ok(matched);
  assert.equal(matched?.length, 3);
  assert.equal(matched?.[0]?.startIndex, 0);
  assert.equal(matched?.[2]?.endIndex, 2);
});

test("regularizeSttSegments keeps consecutive Japanese Whisper lines", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "アメリカはですねOpenAI、Claude、Geminiを使っています",
      startTime: 2.1,
      endTime: 6.4,
    },
    {
      id: "b",
      text: "DeepSeekやMoonshotも同じように見ています",
      startTime: 6.5,
      endTime: 10.2,
    },
    {
      id: "c",
      text: "逆にこの君K3の課題があるとすれば何ですか?",
      startTime: 52.5,
      endTime: 55.1,
    },
  ]);
  assert.equal(rows.length, 3);
  assert.match(rows[0]!.text, /OpenAI/);
  assert.match(rows[1]!.text, /DeepSeek/);
  assert.match(rows[2]!.text, /K3/);
  assert.ok(rows[0]!.startTime < 3);
});

test("flattenSttToTimedWords concatenates chunk words in list order", () => {
  const list = flattenSttToTimedWords([
    {
      id: "a",
      text: "and then it got",
      startTime: 1,
      endTime: 2,
      words: [
        { word: "and", start: 1, end: 1.2 },
        { word: "then", start: 1.25, end: 1.4 },
        { word: "it", start: 1.45, end: 1.55 },
        { word: "got", start: 1.6, end: 1.9 },
      ],
    },
    {
      id: "b",
      text: "Him turfed",
      startTime: 2,
      endTime: 2.6,
      words: [
        { word: "Him", start: 2.0, end: 2.2 },
        { word: "turfed", start: 2.25, end: 2.55 },
      ],
    },
  ]);
  assert.deepEqual(
    list.map((word) => word.text),
    ["and", "then", "it", "got", "Him", "turfed"],
  );
  const span = spanFromWordSlice(list, 0, 5);
  assert.equal(span?.text, "and then it got Him turfed");
  assert.equal(span?.startMs, 1000);
  assert.ok((span?.endMs ?? 0) >= 2550);
});

test("a one-word aside is not a subtitle of its own", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Right.", 4.07, 4.46],
      ["But", 4.5, 4.66],
      ["it", 4.7, 4.82],
      ["still", 4.86, 5.05],
      ["shoots", 5.1, 5.4],
      ["4K.", 5.45, 5.9],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /^Right\. But it still shoots 4K\./);
  assert.equal(spans[0]!.startMs, 4070);
});

test("a one-word aside at the end goes to the line before it", () => {
  const spans = splitSentencesFromWords(
    words([
      ["That", 0, 0.2],
      ["is", 0.25, 0.4],
      ["the", 0.45, 0.6],
      ["whole", 0.65, 0.9],
      ["video.", 0.95, 1.4],
      ["Thanks.", 1.5, 1.9],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /video\. Thanks\.$/);
});

test("a short answer stays a line of its own between two other turns", () => {
  // Merged forward it would be put in the other speaker's mouth. A one-word
  // answer is the whole turn, which is the one case where it earns a cue.
  const spans = splitSentencesFromWords(
    words([
      ["Did", 0, 0.2, "A"],
      ["you", 0.25, 0.4, "A"],
      ["like", 0.45, 0.6, "A"],
      ["it?", 0.65, 0.9, "A"],
      ["Yes.", 1.1, 1.5, "B"],
      ["Good", 1.7, 1.9, "A"],
      ["to", 1.95, 2.05, "A"],
      ["hear", 2.1, 2.3, "A"],
      ["that.", 2.35, 2.7, "A"],
    ]),
  );
  assert.equal(spans.length, 3);
  assert.equal(spans[1]!.text, "Yes.");
});

test("a period dropped mid-phrase does not cut the sentence", () => {
  // What a speech model does to a fast talker: a full stop after a word that
  // no open-ending rule catches, and then the sentence carries on lowercase.
  const spans = splitSentencesFromWords(
    words([
      ["So", 0, 0.16],
      ["the", 0.18, 0.3],
      ["sensor", 0.34, 0.66],
      ["is.", 0.7, 0.9],
      ["actually", 0.94, 1.3],
      ["smaller", 1.34, 1.7],
      ["than", 1.74, 1.9],
      ["you", 1.94, 2.06],
      ["think.", 2.1, 2.5],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /sensor is\. actually smaller/);
});

test("a real sentence boundary still cuts, capital and all", () => {
  const spans = splitSentencesFromWords(
    words([
      ["The", 0, 0.16],
      ["sensor", 0.2, 0.5],
      ["is", 0.54, 0.66],
      ["small.", 0.7, 1.0],
      ["It", 1.1, 1.24],
      ["still", 1.28, 1.5],
      ["shoots", 1.54, 1.8],
      ["4K.", 1.84, 2.2],
    ]),
  );
  assert.deepEqual(
    spans.map((span) => span.text),
    ["The sensor is small.", "It still shoots 4K."],
  );
});

test("captions that never capitalise are still cut at their full stops", () => {
  // YouTube's automatic captions come lowercase; there is no capital to read,
  // so the mid-phrase rule has to stay out of the way.
  const spans = splitSentencesFromWords(
    words([
      ["the", 0, 0.16],
      ["sensor", 0.2, 0.5],
      ["is", 0.54, 0.66],
      ["small.", 0.7, 1.0],
      ["it", 1.1, 1.24],
      ["still", 1.28, 1.5],
      ["shoots", 1.54, 1.8],
      ["4k.", 1.84, 2.2],
    ]),
  );
  assert.equal(spans.length, 2);
});

test("a filler the model swallowed does not throw the whole answer away", () => {
  // Asked to punctuate automatic captions, the model tidies: it drops the "um"
  // it was told to keep. Refusing over that costs every sentence in the piece.
  const rows = words([
    ["very", 0, 0.3],
    ["hard", 0.32, 0.6],
    ["to", 0.62, 0.7],
    ["make", 0.72, 1.0],
    ["um", 1.1, 1.3],
    ["each", 1.4, 1.7],
    ["one", 1.72, 1.9],
    ["of", 1.92, 2.0],
    ["these", 2.02, 2.3],
  ]);
  const spans = applyLlmSentenceMarks(
    rows,
    "very hard to make ||| each one of these",
  );
  assert.ok(spans);
  assert.equal(spans!.length, 2);
  // The filler is still in the video, so it is still in one of the lines.
  assert.equal(
    spans!.map((span) => span.text).join(" ").includes("um"),
    true,
  );
  assert.ok(spans![1]!.endIndex === rows.length - 1);
});

test("a rewritten answer is still refused", () => {
  const rows = words([
    ["the", 0, 0.2],
    ["sensor", 0.22, 0.5],
    ["is", 0.52, 0.6],
    ["actually", 0.62, 1.0],
    ["smaller", 1.02, 1.4],
  ]);
  assert.equal(
    applyLlmSentenceMarks(rows, "the chip is in fact tinier than you think"),
    null,
  );
});

test("words left past the last sentence join the line before them", () => {
  const rows = words([
    ["one", 0, 0.2],
    ["two", 0.22, 0.4],
    ["three", 0.42, 0.6],
    ["four", 0.62, 0.8],
  ]);
  const spans = applyLlmSentenceMarks(rows, "one two ||| three");
  assert.ok(spans);
  assert.equal(spans!.length, 2);
  assert.equal(spans![1]!.endIndex, 3);
  assert.match(spans![1]!.text, /three four/);
});

test("an unpunctuated transcript is marked in pieces, and one bad piece costs only itself", async () => {
  const rows = words(
    Array.from({ length: 420 }, (_, index) => [
      `w${index}`,
      index * 0.4,
      index * 0.4 + 0.3,
    ] as [string, number, number]),
  );
  const asked: string[] = [];
  const spans = await refineSpansWithLlm(
    rows,
    splitSentencesFromWords(rows),
    async (text) => {
      asked.push(text);
      // The second request comes back rewritten and has to be refused.
      if (asked.length === 2) return "nothing like the words that went in";
      const parts = text.split(/\s+/);
      const half = Math.floor(parts.length / 2);
      return `${parts.slice(0, half).join(" ")} ||| ${parts.slice(half).join(" ")}`;
    },
  );
  assert.ok(asked.length >= 3, `expected several requests, got ${asked.length}`);
  for (const text of asked) {
    assert.ok(
      text.split(/\s+/).length < 300,
      "each request should be a piece, not the whole transcript",
    );
  }
  // Every word is still covered exactly once, in order.
  assert.equal(spans[0]!.startIndex, 0);
  assert.equal(spans[spans.length - 1]!.endIndex, rows.length - 1);
  for (let i = 1; i < spans.length; i += 1) {
    assert.equal(spans[i]!.startIndex, spans[i - 1]!.endIndex + 1);
  }
  // The refused piece survives as one line instead of taking the rest with it.
  assert.ok(spans.length > 2);
});
