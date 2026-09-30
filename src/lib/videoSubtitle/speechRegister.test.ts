import assert from "node:assert/strict";
import test from "node:test";
import { speechRegisterHint } from "./speechRegister.ts";

test("speechRegisterHint tells Korean captions to follow the video genre", () => {
  const hint = speechRegisterHint(
    {
      topic: "Premier League",
      domain: "sports-commentary",
      summary: "Live football commentary of a match.",
      speakerStyle: "live football commentary",
      terminology: [],
    },
    "ko",
  );
  assert.match(hint, /sports-commentary/);
  assert.match(hint, /live football commentary/);
  assert.match(hint, /현장 해설체/);
  assert.match(hint, /뉴스 앵커/);
  assert.match(hint, /중계는 금지/);
  assert.match(hint, /movie\/drama/);
});

test("a news programme keeps one register through its interviews", () => {
  // Reported from the app: the anchor read as 격식체 and every quoted speaker
  // as 해요체 — "일자리는 항상 진화해 왔어요" — because the interview rule and
  // the news rule both applied and the interview rule won the line.
  const hint = speechRegisterHint(
    {
      topic: "Trump on AI self-regulation",
      domain: "news",
      summary: "A news report on AI regulation with expert interviews.",
      speakerStyle: "news anchor with expert interviews",
      terminology: [],
    },
    "ko",
  );
  assert.match(hint, /news programme/);
  assert.match(hint, /인터뷰, 현장 발언 전부 격식체/);
  assert.match(hint, /반말과 해요체는/);
  // The rule that lets a line go its own way is withdrawn here.
  assert.doesNotMatch(hint, /follow the line/);
});

test("a talk show still follows the people in it", () => {
  const hint = speechRegisterHint(
    {
      topic: "Late night interview",
      domain: "talk-show",
      summary: "A comedian chatting with a host on a late night show.",
      speakerStyle: "host and guest, relaxed",
      terminology: [],
    },
    "ko",
  );
  assert.doesNotMatch(hint, /news programme/);
  assert.match(hint, /follow the line/);
});

test("the news lock is written in the language the learner reads", () => {
  const hint = speechRegisterHint(
    {
      topic: "Bank rates",
      domain: "news",
      summary: "A broadcast report on interest rates.",
      speakerStyle: "news anchor",
      terminology: [],
    },
    "fr",
  );
  assert.match(hint, /news programme/);
  assert.doesNotMatch(hint, /격식체/);
});
