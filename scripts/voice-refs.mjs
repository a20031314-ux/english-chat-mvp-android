/**
 * Voxtral 목소리 흉내용 참고 소리 — 튜터의 지금 목소리(OpenAI, 언어·여자/남자)로 약 8초를 읽혀 저장한다(2026-11-02).
 *
 * 왜: Voxtral에는 언어마다 미리 만든 목소리가 한쪽 성별뿐이거나 없다(id·th). 튜터 목소리를 그대로 흉내 내면(`ref_audio`)
 * 성별이 다 채워지고, 앱에 녹음돼 들어간 줄·이미 캐시된 줄과 같은 사람처럼 들린다(높이 차 대부분 ±15Hz, 받아쓰기 일치 같음).
 *
 * 2026-11-02 캐릭터: 튜터마다 성격·목소리 지시와 그 사람 말투의 문장(lib/tutorPersona.ts `ref`·`voice`)으로 읽힌다 —
 * 운영 /api/tts가 튜터 목소리에 그 사람의 목소리 지시를 붙이므로(같은 날 배포 뒤) 여기서는 문장만 바꾼다. Voxtral은 지시를 못 받아서
 * 이 참고 소리의 어조·빠르기·결을 흉내 내는 것이 캐릭터 목소리의 전부다(원가 그대로).
 *
 * 쓰는 법(목소리 표 `chatPartner.ts`·캐릭터 `tutorPersona.ts`가 바뀌었을 때만): node --experimental-strip-types scripts/voice-refs.mjs
 * → 운영 /api/tts를 지시를 받는 엔진으로 강제(점검 머리글, 기본 speech = gpt-4o-mini-tts, `VOICE_REF_ENGINE=realtime`)해 읽히고
 * src/lib/server/voiceRefs.generated.ts에 base64로 쓴다. `VOICE_REF_OUT=<폴더>`면 mp3도 남긴다(들어보기 페이지용).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const { tutorVoice } = await import("../src/lib/chatPartner.ts");
const { learningLanguageSpeechTag } = await import("../src/lib/learningLanguages.ts");
const { VOXTRAL_LANGUAGES } = await import("../src/lib/server/voxtralLanguages.ts");
const { tutorPersona } = await import("../src/lib/tutorPersona.ts");
const ENGINE = process.env.VOICE_REF_ENGINE || "speech";
const KEEP = process.env.VOICE_REF_OUT || "";

// 튜터가 자기 얘기를 하는 평범한 두 문장(받아쓰기로 확인한 글). 성별에 따라 꼴이 바뀌는 말(hi 등)은 남자 꼴이어도 목소리만 쓴다.
const REF = {
  en: "Oh, that sounds like a lovely weekend. I usually just stay home, read a little, and cook something simple. What about you?",
  ko: "아, 주말 정말 좋았겠다. 나는 보통 집에서 책 조금 읽고 간단하게 요리해. 너는 주말에 뭐 해?",
  ja: "へえ、いい週末だったね。私はだいたい家で本を読んだり、簡単な料理を作ったりしてるよ。あなたは？",
  zh: "哇，听起来周末过得很不错。我一般在家看看书，做点简单的饭。你呢，周末喜欢做什么？",
  es: "Ah, qué fin de semana tan bonito. Yo normalmente me quedo en casa, leo un poco y cocino algo sencillo. ¿Y tú?",
  fr: "Ah, ça a l'air d'un super week-end. Moi, je reste souvent à la maison, je lis un peu et je cuisine un truc simple. Et toi ?",
  it: "Ah, sembra proprio un bel fine settimana. Io di solito resto a casa, leggo un po' e cucino qualcosa di semplice. E tu?",
  pt: "Ah, parece um fim de semana ótimo. Eu normalmente fico em casa, leio um pouco e cozinho alguma coisa simples. E você?",
  ru: "О, звучит как отличные выходные. Я обычно сижу дома, немного читаю и готовлю что-нибудь простое. А ты?",
  ar: "آه، يبدو أنها كانت عطلة رائعة. أنا عادةً أبقى في البيت، أقرأ قليلاً وأطبخ شيئاً بسيطاً. وأنت؟",
  vi: "Ồ, nghe có vẻ là một cuối tuần tuyệt vời. Mình thường ở nhà, đọc sách một chút và nấu món gì đó đơn giản. Còn bạn?",
  hi: "अरे, यह तो बहुत अच्छा वीकेंड लग रहा है। मैं आमतौर पर घर पर रहता हूँ, थोड़ा पढ़ता हूँ और कुछ आसान बनाता हूँ। और तुम?",
};

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "voice-refs-"));
const out = {};
for (const lang of VOXTRAL_LANGUAGES) {
  for (const gender of ["f", "m"]) {
    const voice = tutorVoice(lang, gender);
    const text = tutorPersona(lang, gender)?.ref || REF[lang];
    const res = await fetch(`https://www.languagebank.net/api/tts?${new URLSearchParams({ text, lang: learningLanguageSpeechTag(lang), voice })}`, {
      headers: { "x-rc-user": "simcheck-voice-refs", "x-tts-engine": ENGINE },
    });
    if (!res.ok) throw new Error(`${lang}-${gender}: ${res.status}`);
    const pcm = path.join(dir, `${lang}-${gender}.pcm`);
    const mp3 = path.join(dir, `${lang}-${gender}.mp3`);
    fs.writeFileSync(pcm, Buffer.from(await res.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, "-b:a", "48k", mp3]);
    out[`${lang}-${gender}`] = { voice, b64: fs.readFileSync(mp3).toString("base64") };
    if (KEEP) {
      fs.mkdirSync(KEEP, { recursive: true });
      fs.copyFileSync(mp3, path.join(KEEP, `${lang}-${gender}.mp3`));
    }
    console.log(lang, gender, voice, ENGINE, fs.statSync(mp3).size);
  }
}
const body = Object.entries(out).map(([k, v]) => `  // ${v.voice}\n  "${k}": "${v.b64}",`).join("\n");
fs.writeFileSync(
  "src/lib/server/voiceRefs.generated.ts",
  `// 자동 생성 — scripts/voice-refs.mjs. 손으로 고치지 않는다. 언어-성별 → 튜터 지금 목소리 약 8초(mp3 base64).\nexport const VOICE_REFS: Record<string, string> = {\n${body}\n};\n`,
);
