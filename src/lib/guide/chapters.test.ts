import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GUIDE_CHAPTERS, GUIDE_EN, GUIDE_KO, GUIDE_SECTION_IDS, guideChapters, guideSection, type Guide, type GuideTabId } from "./content.ts";
import { RELEASE_NOTES, newGuideSections } from "../whatsNew.ts";

const translations = JSON.parse(readFileSync(new URL("./translations.json", import.meta.url), "utf8")) as Record<string, Guide>;
const ALL: Record<string, Guide> = { ko: GUIDE_KO, en: GUIDE_EN, ...translations };
const TABS = Object.keys(GUIDE_SECTION_IDS) as GuideTabId[];

test("칸 이름 수가 모든 언어의 칸 수와 같다", () => {
  for (const [locale, guide] of Object.entries(ALL)) {
    for (const tab of TABS) {
      assert.equal(guide[tab].sections.length, GUIDE_SECTION_IDS[tab].length, `${locale} ${tab}`);
    }
  }
});

test("칸 이름은 겹치지 않는다", () => {
  const ids = TABS.flatMap((tab) => GUIDE_SECTION_IDS[tab]);
  assert.equal(new Set(ids).size, ids.length);
});

test("모든 묶음의 칸이 모든 언어에 있다", () => {
  for (const [locale, guide] of Object.entries(ALL)) {
    for (const chapter of GUIDE_CHAPTERS) {
      for (const id of chapter.sections) assert.ok(guideSection(guide, id), `${locale} ${chapter.id} ${id}`);
    }
    assert.equal(guideChapters(guide).length, GUIDE_CHAPTERS.length, locale);
  }
});

test("모든 칸이 어느 묶음엔가 들어 있다", () => {
  const inChapters = new Set(GUIDE_CHAPTERS.flatMap((chapter) => chapter.sections));
  for (const id of TABS.flatMap((tab) => GUIDE_SECTION_IDS[tab])) assert.ok(inChapters.has(id), id);
});

test("새로워진 점이 가리키는 칸이 있다", () => {
  for (const note of RELEASE_NOTES) {
    for (const item of note.items) {
      if (item.guide) assert.ok(guideSection(GUIDE_KO, item.guide), `${note.version} ${item.id} → ${item.guide}`);
    }
  }
  assert.ok(newGuideSections("2.69").includes("people.board"));
  assert.deepEqual(newGuideSections("0.1"), []);
});

test("글에 탭 경로를 쓰지 않는다(지금 글, 14개 언어)", () => {
  // 옛 묶음 이름과 "~탭에서/의 ~탭" 꼴. 화면으로 가는 길은 "이 화면으로 가기" 버튼이 맡는다.
  const banned = [
    /사람과 학습|AI와 학습|통화 탭|Learn with people|Calls tab|人と学ぶ|和人一起学|Con personas|Avec des gens|Con le persone|Com pessoas|С людьми|Belajar dengan orang|التعلّم مع الناس|เรียนกับผู้คน|लोगों के साथ सीखें/,
  ];
  for (const [locale, guide] of Object.entries(ALL)) {
    for (const tab of TABS) {
      for (const section of guide[tab].sections) {
        for (const text of [section.heading, ...section.body]) {
          for (const pattern of banned) assert.doesNotMatch(text, pattern, `${locale} ${tab}: ${text}`);
        }
      }
    }
  }
});
