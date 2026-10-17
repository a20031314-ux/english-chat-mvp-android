/**
 * My 탭 "직접 묻기" 묶음 — 앱 언어로 "뭐가 늘었어?"를 묻는다.
 * 기록이 적으면(점수 합 3 미만) 모델 없이 thin 답이 정상이고, 기록이 있으면 앱 언어 2~4문장 + 키울 요소.
 * 답에 영어 요소 이름(accuracy 등)이 섞이면 안 된다(2026-10-16 고친 문제). 채팅 1회로 센다. 2명 중 1명.
 */
import { readFileSync } from "node:fs";
import { checkHttp, checkText, issue } from "../detect.mjs";

const KEYS = { speaking: "myElSpeaking", accuracy: "myElAccuracy", words: "myElWords", listening: "myElListening", pronunciation: "myElPronunciation", natural: "myElNatural" };

/**
 * 앱이 보내는 것과 같은 화면 속 요소 이름(GrowthNetwork elementNames). ko·en·es는 copy.ts, 나머지는 overlays.json에서
 * 그때그때 읽는다 — 이름이 바뀌어도 점검이 따라간다.
 */
function elementNames(locale) {
  if (["ko", "en", "es"].includes(locale)) {
    const src = readFileSync("src/lib/copy.ts", "utf8");
    const start = src.search(new RegExp(`\\n  ${locale}: \\{`));
    const block = start === -1 ? "" : src.slice(start, start + 200_000);
    return Object.fromEntries(Object.entries(KEYS).map(([id, key]) => [id, block.match(new RegExp(`${key}: "([^"]+)"`))?.[1]]).filter(([, v]) => v));
  }
  const overlays = JSON.parse(readFileSync("src/lib/locales/overlays.json", "utf8"));
  return Object.fromEntries(Object.entries(KEYS).map(([id, key]) => [id, overlays[locale]?.[key]]).filter(([, v]) => v));
}

const ELEMENTS = ["speaking", "accuracy", "words", "listening", "pronunciation", "natural"];
const ENGLISH_NAMES = /\b(speaking|accuracy|words|listening|pronunciation|naturalness|natural)\b/i;

export { elementNames };

export default {
  id: "ask",
  label: "직접 묻기",
  every: 2,
  estimate() {
    return { requests: 1, usd: 0.002 };
  },
  async run({ persona, userId, call, bank, step }) {
    const question = bank.askGrowth[persona.ui];
    const res = await call(userId, "/api/learner/ask", {
      body: { question, language: persona.target, interfaceLanguage: persona.ui, names: elementNames(persona.ui) },
    });
    const issues = checkHttp("ask", res);
    const body = res.body ?? {};
    if (res.status === 200) {
      if (body.thin) {
        if (body.grow && !ELEMENTS.includes(body.grow)) issues.push(issue("error", "ask_logic", `없는 요소: ${body.grow}`));
      } else {
        issues.push(...checkText("ask", persona, body.answer, { lang: "ui", label: "직접 묻기 답", required: true }));
        // 학습 언어가 영어면 영어 낱말이 인용으로 나올 수 있으니, 그때는 설명 꼬리("(lines needing …")만 본다.
        const english = persona.target === "en" ? /\((?:lines|turns|phrases) [a-z ]+\)/i : ENGLISH_NAMES;
        if (persona.ui !== "en" && english.test(body.answer ?? "")) issues.push(issue("warn", "ask_english_name", "답에 영어 요소 이름이 섞임", { sample: body.answer.slice(0, 100) }));
        if (body.grow && !ELEMENTS.includes(body.grow)) issues.push(issue("error", "ask_logic", `없는 요소: ${body.grow}`));
        const sentences = (body.answer ?? "").split(/[.!?。！？؟।]+/u).filter((s) => s.trim().length > 1).length;
        if (sentences > 6) issues.push(issue("warn", "ask_logic", `답이 ${sentences}문장(2~4문장이어야)`));
      }
    }
    step({ title: body.thin ? "직접 묻기 (기록 적음)" : "직접 묻기", input: question, status: res.status, ms: res.ms, outputs: [{ label: "답", text: body.answer ?? (body.thin ? "(기록이 적어 고정 안내)" : "") }, { label: "키울 요소", text: body.grow ?? "" }], issues });
  },
};
