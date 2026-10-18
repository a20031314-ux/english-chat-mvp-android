import { test } from "node:test";
import assert from "node:assert/strict";
import { TEAM_COPY_KEYS, TEAM_COPY_LOCALES, fillTeam, teamCopy } from "./teamCopy.ts";

test("팀 문구: 14개 언어 모두 키가 비지 않고 자리 표시가 그대로", () => {
  assert.equal(TEAM_COPY_LOCALES.length, 14);
  for (const locale of TEAM_COPY_LOCALES) {
    const t = teamCopy(locale);
    for (const key of TEAM_COPY_KEYS) assert.ok(t[key]?.trim(), `${locale} ${key}`);
    for (const key of ["callAskTitle", "askedBy", "sharedBy"] as const) assert.ok(t[key].includes("{name}"), `${locale} ${key}`);
    for (const key of ["streak", "week", "sessionLines"] as const) assert.ok(t[key].includes("{n}"), `${locale} ${key}`);
  }
});

test("채우기: 태국어·스페인어", () => {
  assert.equal(fillTeam(teamCopy("th").streak, { n: 3 }), "ทำด้วยกันติดต่อกัน 3 วัน");
  assert.equal(fillTeam(teamCopy("es").askedBy, { name: "Lucía" }), "Preguntó Lucía");
});
