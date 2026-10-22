import assert from "node:assert/strict";
import test from "node:test";
import { hangulIsStray, stripHangul } from "./strayHangul.ts";

test("한국어와 상관없는 대화의 한글만 걸린다", () => {
  assert.equal(hangulIsStray("(완전 지친 상태)", "ja", "ru"), true);
  assert.equal(hangulIsStray("Kalimat ini benar.", "id", "en"), false);
  assert.equal(hangulIsStray("이렇게 고쳤어요", "ko", "en"), false);
  assert.equal(hangulIsStray("안녕하세요", "ja", "ko"), false);
});

test("괄호 속 한글 덩어리만 빼고 나머지 글은 남긴다(일본어 앱·러시아어 학습, 라틴 문자 앱)", () => {
  assert.equal(
    stripHangul("«выжат как лимон» (완전 지친 상태, 完全に疲れ切っている、という意味です)"),
    "«выжат как лимон» (完全に疲れ切っている、という意味です)",
  );
  assert.equal(stripHangul("Это значит «устал» (피곤하다)."), "Это значит «устал».");
  assert.equal(stripHangul("Sí, claro. 좋아요! ¿Y tú?"), "Sí, claro. ¿Y tú?");
  assert.equal(stripHangul("No Korean here."), "No Korean here.");
});
