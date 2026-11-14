/**
 * 문법 문제 물음에 붙이는 문법 이름(사용자 2026-11-14 "빈칸에 들어갈 대명사는? 식으로", "문법이름으로 해줘").
 * 사다리·Languagebank의 문법 이름(stages/*.ts name)은 형태를 품고 있어("be동사 am / is / are", "because / so / but로 잇기")
 * 넣어 둔 문제 535개 중 229개에서 이름에 답이 그대로 보인다 — 그래서 형태를 뺀 짧은 이름을 따로 둔다(grammarAskNames.ts, 한국어·영어).
 * 다른 앱 언어는 이름이 없어 지금 물음 그대로(영어 이름이 섞이지 않게). 순수.
 */
import { GRAMMAR_ASK_NAMES as NAMES } from "./grammarAskNames.ts";

/** 그 문법 칸(g|단계:번호)의 물음용 이름 — 앱 언어가 한국어·영어일 때만, 없으면 "". */
export function grammarAskName(language: string, locale: string, key: string | undefined): string {
  if (!key?.startsWith("g|") || (locale !== "ko" && locale !== "en")) return "";
  return NAMES[language]?.[key.slice(2)]?.[locale] ?? "";
}

/** 한국어 주제 조사: 괄호 앞 마지막 한글의 받침으로 은/는. 한글이 없으면 "는". */
export function topicParticle(name: string): "은" | "는" {
  const bare = name.replace(/\([^)]*\)/g, "");
  const last = [...bare].reverse().find((ch) => ch >= "가" && ch <= "힣");
  if (!last) return "는";
  return (last.charCodeAt(0) - 0xac00) % 28 ? "은" : "는";
}

/** "{kind}" 자리에 이름을 넣는다. 한국어는 이름 뒤에 은/는을 붙인다("빈칸에 들어갈 관계사는?"). */
export function askWithName(template: string, name: string, locale: string): string {
  return template.replace("{kind}", locale === "ko" ? `${name}${topicParticle(name)}` : name);
}
