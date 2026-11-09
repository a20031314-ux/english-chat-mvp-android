import { test } from "node:test";
import assert from "node:assert/strict";
import { frameUsed } from "./scriptBank.ts";
test("틀을 실제로 썼나: 빈칸 앞뒤 고정 부분이 들어야(영어·스페인어·일본어)", () => {
  assert.equal(frameUsed("Can I have ___, please?", "can I have a coffee please"), true);
  assert.equal(frameUsed("Can I have ___, please?", "Coffee please"), false);
  assert.equal(frameUsed("I'm from ___.", "I’m from Korea."), true);
  assert.equal(frameUsed("Me llamo ___.", "Hola, me llamo Ana"), true);
  assert.equal(frameUsed("___をください。", "みずをください"), true);
  assert.equal(frameUsed("___をください。", "みずがほしい"), false);
  assert.equal(frameUsed("___をください。", "はい、水をください。"), true);
  assert.equal(frameUsed("___은 어디예요?", "화장실은 어디예요?"), true);
  assert.equal(frameUsed("___ 주세요.", "물 주세요"), true);
  assert.equal(frameUsed("我想___。", "你好，我想喝咖啡。"), true);
  assert.equal(frameUsed("ขอ___หน่อย", "ขอน้ำหน่อยครับ"), true);
  // 고를 수 있는 꼴(한국어 이에요/예요·(으)·아서/어서 줄어든 꼴, 러시아어 мой / моя, 틀 전체 둘 중 하나).
  assert.equal(frameUsed("저는 ___이에요/예요.", "저는 루카스예요."), true);
  assert.equal(frameUsed("저는 ___이에요/예요.", "제가 루카스예요."), false);
  assert.equal(frameUsed("___(으)러 가요.", "옷을 사러 가요."), true);
  assert.equal(frameUsed("___(으)로 가 주세요.", "수서역으로 가 주세요."), true);
  assert.equal(frameUsed("___아서/어서 잠을 못 잤어요.", "방이 너무 더워서 잠을 못 잤어요."), true);
  assert.equal(frameUsed("저는 ___을/를 좋아해요.", "저는 커피를 좋아해요"), true);
  assert.equal(frameUsed("___은/는 뭐예요?", "이거 뭐예요?"), true);
  assert.equal(frameUsed("저는 ___을/를 할 수 있어요.", "저는 중국어도 할 수 있어요."), true);
  assert.equal(frameUsed("Это мой / моя / моё ___.", "Это моя сумка."), true);
  assert.equal(frameUsed("Привет, ___! / Здравствуйте, ___!", "Здравствуйте, Анна!"), true);
  assert.equal(frameUsed("___ที่ผม / ที่คุณ / ที่เรา …", "ละครที่คุณแนะนำสนุกมาก"), true);
});
