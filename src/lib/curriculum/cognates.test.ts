import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cognateIn, falseFriendIn, type CognateBook } from "./cognates.ts";

const book = JSON.parse(readFileSync(new URL("./pairs/cognates.json", import.meta.url), "utf8")) as CognateBook;
const cognateOf = async (l2: string, word: string, l1: string) => cognateIn(book, l2, word, l1);
const falseFriendOf = async (l2: string, word: string, l1: string) => falseFriendIn(book, l2, word, l1);

test("닮은 말: 뜻이 같은 것 (problema → problem · información → informação · 学校 ↔ 学校)", async () => {
  assert.equal(await cognateOf("es", "problema", "en"), "problem");
  assert.equal(await cognateOf("es", "información", "pt"), "informação");
  assert.equal(await cognateOf("ja", "学校", "zh"), "学校");
  assert.equal(await cognateOf("pt", "flor", "en"), null, "flor ≠ floor");
  assert.equal(await cognateOf("fr", "casque", "en"), null, "casque ≠ case");
});

test("뜻이 다른 닮은 말 (éxito ≠ exit · librairie ≠ library · puxar ≠ push), 닮은 말 목록에서는 빠짐", async () => {
  assert.equal(await falseFriendOf("es", "éxito", "en"), "exit");
  assert.equal(await falseFriendOf("fr", "librairie", "en"), "library");
  assert.equal(await falseFriendOf("pt", "puxar", "en"), "push");
  assert.equal(await cognateOf("es", "éxito", "en"), null);
  assert.equal(await falseFriendOf("es", "problema", "en"), null);
});
