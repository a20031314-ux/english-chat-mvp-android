import assert from "node:assert/strict";
import test from "node:test";
import { casualToSuperior, registerSlipHint } from "./registerSlips.ts";

test("윗사람에게 반말을 찾는다(ja·fr·de·ru)", () => {
  assert.equal(casualToSuperior("先生、明日来る？", "ja"), "先生");
  assert.equal(casualToSuperior("社長、これ早くやって。", "ja"), "社長");
  assert.equal(casualToSuperior("Salut prof, donne-moi la réponse vite.", "fr"), "prof");
  assert.equal(casualToSuperior("Monsieur, tu peux m'aider ?", "fr"), "Monsieur");
  assert.equal(casualToSuperior("Herr Müller, kannst du mir helfen?", "de"), "Herr");
  assert.equal(casualToSuperior("Профессор, ты можешь мне помочь?", "ru"), "Профессор");
  assert.equal(casualToSuperior("Иван Петрович, ты придёшь завтра?", "ru"), "Иван Петрович");
});

test("존댓말이거나 상대를 모르면 말하지 않는다", () => {
  assert.equal(casualToSuperior("先生、明日来ますか？", "ja"), null);
  assert.equal(casualToSuperior("明日来る？", "ja"), null);
  assert.equal(casualToSuperior("Bonjour madame, vous pouvez m'aider ?", "fr"), null);
  assert.equal(casualToSuperior("Salut, tu viens demain ?", "fr"), null);
  assert.equal(casualToSuperior("Herr Müller, können Sie mir helfen?", "de"), null);
  assert.equal(casualToSuperior("Профессор, вы можете мне помочь?", "ru"), null);
  // 스페인어·중국어는 선생님께 tú·你가 틀린 말이 아니라 일부러 보지 않는다.
  assert.equal(casualToSuperior("Oye profe, dame la respuesta ya.", "es"), null);
  assert.equal(casualToSuperior("老师，你明天来不来啊？", "zh"), null);
});

test("힌트는 고칠 방향을 담는다", () => {
  assert.match(registerSlipHint("先生、明日来る？", "ja", "Japanese"), /です\/ます/);
  assert.equal(registerSlipHint("Bonjour madame, vous allez bien ?", "fr", "French"), "");
});
