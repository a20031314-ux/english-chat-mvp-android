import assert from "node:assert/strict";
import test from "node:test";
import { quotedPhrases } from "./stuck.ts";
import { buildBrief } from "./brief.ts";
import { emptyLedger } from "./ledger.ts";
import { emptyWeakRecord } from "../curriculum/weakPoints.ts";

test("the words to go on with are taken from the quotes of a help note, in any script", () => {
  assert.deepEqual(quotedPhrases("잘 모르겠으면 'I like to do...'라고 말해 보세요"), ["I like to do"]);
  assert.deepEqual(quotedPhrases("「おすすめは何ですか」と聞いてみましょう。"), ["おすすめは何ですか"]);
  assert.deepEqual(quotedPhrases("Puedes decir “¿Qué me recomiendas?” o “Quiero un café”."), ["¿Qué me recomiendas?", "Quiero un café"]);
  assert.deepEqual(quotedPhrases("ลองพูดว่า \"ขอกาแฟหนึ่งแก้ว\" ดูนะ"), ["ขอกาแฟหนึ่งแก้ว"]);
  assert.deepEqual(quotedPhrases("천천히 다시 말해 보세요."), []);
});

test("phrases from a stuck moment come first among those the tutor brings back", () => {
  const brief = buildBrief({
    ledger: emptyLedger("en", 0),
    weak: emptyWeakRecord(),
    stats: { turns: 0, correctionRate: null, medianLatencyMs: null, retryRate: null },
    stuckPhrases: ["What do you recommend"],
    now: Date.UTC(2026, 9, 16),
  });
  assert.deepEqual(brief.notes, [{ kind: "recycle", phrases: ["What do you recommend"] }]);
  assert.match(brief.prompt, /What do you recommend/);
});
