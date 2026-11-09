import type { AnalysisDimension } from "./types.ts";

const DIMENSION_ROLE: Record<AnalysisDimension, string> = {
  syntax:
    "Only THIS span's slot in THIS sentence (complements, auxiliary chain, what it attaches to). Do not define the word, conjugate it, or give extra examples.",
  usageInContext:
    "Only typical situations vs why this wording was chosen HERE. Do not recap inflection, word-origin, or a dictionary gloss.",
  phonology:
    "Only a pronunciation change in this span. If nothing actually changes, reply SKIP.",
  morphology:
    "Only the shape: stem vs ending / irregular form. One form fact. No usage lecture, no extra example sentence, no origin story.",
  pragmatics:
    "Only register, politeness, or interpersonal nuance. If the span is socially neutral, reply SKIP.",
  etymology:
    "Only a memorable origin of an idiom or frozen chunk. Irregular verb forms, participles, and plain vocabulary have no origin note — reply SKIP.",
};

const DIMENSION_ROLE_KO: Record<AnalysisDimension, string> = {
  syntax:
    "이 문장 안에서 이 표현이 어디에 붙는지(보어, 조동사 연쇄)만 한국어로. 뜻을 풀거나 활용을 설명하거나 예문을 만들지 마세요.",
  usageInContext:
    "이런 말을 언제 쓰는지, 이 문장에서 왜 이 형태인지만 한국어로. 불규칙 활용이나 어원을 반복하지 마세요.",
  phonology:
    "이 구에서 실제로 일어나는 발음 변화만. 없으면 SKIP.",
  morphology:
    "형태만: 어간/어미, 불규칙 모양. 한 가지 형태 사실만. 쓰임 설명, 예문, 유래는 쓰지 마세요.",
  pragmatics:
    "말투·높임·친소 관계만. 평범한 표현이면 SKIP.",
  etymology:
    "관용구나 덩어리의 유래가 기억에 도움이 될 때만. 불규칙 동사·분사·평범한 단어는 SKIP.",
};

export function dimensionRole(
  dimension: AnalysisDimension,
  explanationLanguage: string,
): string {
  if (explanationLanguage === "ko") return DIMENSION_ROLE_KO[dimension];
  return DIMENSION_ROLE[dimension];
}
