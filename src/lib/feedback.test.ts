import assert from "node:assert/strict";
import test from "node:test";
import { acceptableImage, dataUrlBytes, FEEDBACK_IMAGE_MAX_BYTES, isFeedbackTab } from "./feedback.ts";

test("feedback keeps only a picture it can show, within the size asked for", () => {
  const small = `data:image/jpeg;base64,${Buffer.alloc(3000).toString("base64")}`;
  assert.equal(dataUrlBytes(small), 3000);
  assert.equal(acceptableImage(small), small);
  const large = `data:image/jpeg;base64,${Buffer.alloc(FEEDBACK_IMAGE_MAX_BYTES + 10).toString("base64")}`;
  assert.equal(acceptableImage(large), "");
  assert.equal(acceptableImage("data:text/html;base64,PGgxPg=="), "");
  assert.equal(acceptableImage("javascript:alert(1)"), "");
  assert.equal(isFeedbackTab("map"), true);
  assert.equal(isFeedbackTab("settings"), false);
});
