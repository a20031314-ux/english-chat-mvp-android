import assert from "node:assert/strict";
import test from "node:test";
import {
  droppedLockedCollocation,
  lockedCollocationLabels,
} from "./lockedCollocations.ts";

test("locks not just / n't just, not filler just", () => {
  assert.deepEqual(
    lockedCollocationLabels("And it's not just necessities like water"),
    ["not just"],
  );
  assert.deepEqual(lockedCollocationLabels("It isn't just water."), ["not just"]);
  assert.deepEqual(lockedCollocationLabels("Don't just sit there."), ["not just"]);
  assert.deepEqual(lockedCollocationLabels("I just think we should go."), []);
  assert.deepEqual(lockedCollocationLabels("It's just water."), []);
});

test("flags Korean that drops the not-merely sense", () => {
  assert.equal(
    droppedLockedCollocation(
      "And it's not just necessities like water",
      "물과 같은 필수품은 아니죠",
      "ko",
    ),
    true,
  );
  assert.equal(
    droppedLockedCollocation(
      "And it's not just necessities like water",
      "물 같은 필수품뿐만이 아니죠",
      "ko",
    ),
    false,
  );
  assert.equal(
    droppedLockedCollocation(
      "It's not only water",
      "물만의 문제는 아니에요",
      "ko",
    ),
    false,
  );
  assert.equal(
    droppedLockedCollocation("Don't just sit there.", "앉아만 있지 마.", "ko"),
    false,
  );
  assert.equal(
    droppedLockedCollocation("I just think we should go.", "그냥 가야 할 것 같아.", "ko"),
    false,
  );
});

test("locks not even / not yet", () => {
  assert.equal(
    droppedLockedCollocation("He didn't even call.", "전화 안 했어.", "ko"),
    true,
  );
  assert.equal(
    droppedLockedCollocation("He didn't even call.", "전화도 안 했어.", "ko"),
    false,
  );
  assert.equal(
    droppedLockedCollocation("It's not yet ready.", "안 됐어.", "ko"),
    true,
  );
  assert.equal(
    droppedLockedCollocation("It's not yet ready.", "아직 안 됐어.", "ko"),
    false,
  );
});

test("literal caption detector treats dropped not-just as bad", async () => {
  const { looksLikeLiteralOrForeignCaption } = await import("./calqueDetect.ts");
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "And it's not just necessities like water",
      "물과 같은 필수품은 아니죠",
      "ko",
    ),
    true,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "And it's not just necessities like water",
      "물 같은 필수품뿐만이 아니죠",
      "ko",
    ),
    false,
  );
});
