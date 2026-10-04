import assert from "node:assert/strict";
import { test } from "node:test";
import {
  explanationLanguageGuard,
  explanationInLearningLanguage,
  explanationLooksMixedLanguage,
} from "./languageLearningAnalysis.ts";

test("Korean UI guard forbids Japanese sentences, English acronyms, and romaji", () => {
  const guard = explanationLanguageGuard({
    interfaceLanguage: "ko",
    learningLanguage: "ja",
  });
  assert.match(guard, /ONLY in Korean Hangul/);
  assert.match(guard, /Do not write the explanation in Japanese/);
  assert.match(guard, /benkyou/);
  assert.match(guard, /주어-목적어-동사/);
  assert.equal(/Furigana\/romaji next to a quoted form is OK/.test(guard), false);
});

test("explanationLooksMixedLanguage catches the sentence-analysis leaks", () => {
  const koreanOk =
    "「勉強する」는 '공부하다'라는 뜻입니다. 친구에게 쓰는 편한 말투입니다.";
  assert.equal(explanationLooksMixedLanguage(koreanOk, "ko", "ja"), false);

  const japaneseUsage =
    "'勉強する'는 '공부하다'라는 의미입니다. 日本語では「勉強する」という表現が非常によく使われます。";
  assert.equal(explanationLooksMixedLanguage(japaneseUsage, "ko", "ja"), true);

  const japaneseNuance =
    "「勉強する」は、普通体（カジュアルな言い方）です。友達や親しい人に対して使うことが多いです。";
  assert.equal(explanationLooksMixedLanguage(japaneseNuance, "ko", "ja"), true);

  const sov =
    "이 문장은 주어-목적어-동사(SOV) 순서입니다.";
  assert.equal(explanationLooksMixedLanguage(sov, "ko", "ja"), true);

  const romaji =
    "「勉強する」는 두 부분입니다. 勉強 (べんきょう, benkyou)는 명사입니다.";
  assert.equal(explanationLooksMixedLanguage(romaji, "ko", "ja"), true);

  const koreanWithKanji =
    "「する」는 동사입니다. 앞의 勉強는 '공부'라는 명사입니다.";
  assert.equal(explanationLooksMixedLanguage(koreanWithKanji, "ko", "ja"), false);
});

test("explanationInLearningLanguage catches a note written in the learning language", () => {
  // Seen from the live chat route on 2026-10-05, app in Spanish learning Korean.
  assert.equal(
    explanationInLearningLanguage("'가요'는 현재형이고, 어제 갔다는 과거의 일이라서 '갔어요'로 바꿔야 해.", "es", "ko"),
    true,
  );
  assert.equal(
    explanationInLearningLanguage("استخدمت \"أذهب\" بدلاً من \"ذهبت\". تحتاج إلى استخدام الزمن الماضي", "ja", "ar"),
    true,
  );
  // The same point, written properly, quoting the learning language.
  assert.equal(
    explanationInLearningLanguage("'가요' está en presente; como fue ayer, hay que usar el pasado '갔어요'.", "es", "ko"),
    false,
  );
  assert.equal(
    explanationInLearningLanguage("「行きます」は現在形なので、「行きました」にします。", "ko", "ja"),
    true,
  );
  assert.equal(
    explanationInLearningLanguage("'行きます'는 현재형이라서 어제 일에는 '行きました'를 써요.", "ko", "ja"),
    false,
  );
  assert.equal(explanationInLearningLanguage("Use the past tense here.", "en", "en"), false);
});
