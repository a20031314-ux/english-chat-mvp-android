import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { bankLanguages, bankScriptsUpTo, scriptById, scriptsFor } from "./stageScripts.ts";
import { frameUsed, pickBankScript } from "./scriptBank.ts";
import { todayPlan } from "./dailyPlan.ts";

test("대본 은행: 언어마다 1~3단계 20개씩, 줄 8개 번갈아, 내 줄 틀 태그는 그 단계 이하의 틀이고 줄에 그대로, 한국어 뜻, 숫자는 글로, 단계 목록에는 안 들어감", () => {
  const languages = bankLanguages();
  assert.ok(languages.length >= 14, languages.join(","));
  for (const language of languages) {
    const bank = bankScriptsUpTo(language, 5);
    for (const stage of [1, 2, 3]) assert.ok(bank.filter((script) => script.stage === stage).length >= 20, `${language} ${stage}단계`);
    const frames = new Map(allFramesFor(language).map((frame) => [frame.id, frame]));
    const ids = new Set<string>();
    for (const script of bank) {
      assert.ok(script.bank, script.id);
      assert.ok(script.id.startsWith(`${language}-`), script.id);
      assert.ok(!ids.has(script.id), `${script.id} 겹침`);
      ids.add(script.id);
      assert.equal(script.lines.length, 8, script.id);
      assert.equal(scriptById(language, script.id)?.id, script.id);
      assert.ok(!scriptsFor(language, script.stage).some((one) => one.id === script.id), `${script.id} 단계 목록 밖`);
      assert.ok(script.setting.en && script.setting.ko, script.id);
      script.lines.forEach((line, i) => {
        assert.equal(line.who, i % 2 === 0 ? "them" : "me", `${script.id} ${i}`);
        assert.ok(line.gloss.ko && line.gloss.en, `${script.id} ${i} 뜻`);
        assert.ok(!/\p{Nd}/u.test(line.text), `${script.id} ${i} 숫자는 글로`);
        for (const id of line.frames ?? []) {
          const frame = frames.get(id);
          assert.ok(frame && frame.stage <= script.stage, `${script.id} ${i} 틀 ${id}`);
          assert.ok(frameUsed(frame.pattern, line.text), `${script.id} ${i} 줄에 틀 ${frame.pattern}이 없음`);
        }
      });
    }
  }
});

test("고르기: 지금 단계 이하에서, 안 한 장면 먼저, 같은 날 같은 장면 — 은행 없는 언어는 null", () => {
  const first = pickBankScript({ language: "en", stage: 3, passed: new Set(), seed: "2026-10-30" });
  assert.ok(first && first.stage <= 3);
  assert.equal(pickBankScript({ language: "en", stage: 3, passed: new Set(), seed: "2026-10-30" })?.id, first!.id);
  const next = pickBankScript({ language: "en", stage: 3, passed: new Set([first!.id]), seed: "2026-10-30" });
  assert.ok(next && next.id !== first!.id);
  assert.ok((pickBankScript({ language: "ja", stage: 2, passed: new Set(), seed: "x" })?.stage ?? 9) <= 2);
  assert.equal(pickBankScript({ language: "xx", stage: 1, passed: new Set() }), null);
  // 다 했으면 다시(null 아님).
  const all = new Set(bankScriptsUpTo("en", 1).map((script) => script.id));
  assert.ok(pickBankScript({ language: "en", stage: 1, passed: all }));
});

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

test("오늘 할 것: 은행 장면은 하루 끝에 대화 한 칸", () => {
  const plan = todayPlan({ language: "en", stage: 1, passed: new Set(), review: {}, pace: 10, order: "curriculum", scene: { id: "en-1-b01", stage: 1 }, now: 0 });
  const last = plan[plan.length - 1]!;
  assert.equal(last.id, "en-1-b01");
  assert.equal(last.kind, "script");
});
