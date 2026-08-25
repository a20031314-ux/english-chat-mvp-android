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
