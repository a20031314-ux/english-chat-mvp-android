import { test } from "node:test";
import assert from "node:assert/strict";
import { fillTeam, teamCopy } from "./teamCopy.ts";
test("채우기: 태국어·스페인어", () => {
  assert.equal(fillTeam(teamCopy("th").streak, { n: 3 }), "ทำด้วยกันติดต่อกัน 3 วัน");
  assert.equal(fillTeam(teamCopy("es").askedBy, { name: "Lucía" }), "Preguntó Lucía");
});
