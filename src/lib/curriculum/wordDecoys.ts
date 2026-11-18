/**
 * 빈도 낱말(w|) 빈칸의 헷갈리는 오답 — 그 낱말의 흔한 실수 꼴(활용·성수·격·닮은 철자, 2026-11-01).
 * 처음엔 비어 있고, 가상 사용자 점검의 "오답이 한눈에 지워짐"(/mark easy-decoy) 표시를 고치는 쪽이 채운다(scripts/ux-check/FIX.md).
 * 키: 학습 언어 → 문장 속 조각(소문자) → 오답. 맞는 대안(축약·동의어)은 넣지 않는다(RULES 11 ②).
 * 퀴즈는 이 표를 문장구조·표현의 오답처럼 먼저 쓰고, 없으면 같은 품사 낱말(quiz.ts decoys).
 */
export const WORD_DECOYS: Record<string, Record<string, string[]>> = {
  // 2026-11-01 가상 사용자 표시(hub/work/drafts/ux-marks-2026-11-01.md): 보기가 한눈에 지워지거나 맞는 대안이던 것.
  // 2026-11-01 체감 점검(hub/work/drafts/ux-check-2026-11-01.md 바로 고칠 것 #3~#7): 대명사는 격·소유 꼴, 명사는 수·성·품사 꼴.
  en: { totally: ["total", "totaled"], i: ["me", "my", "mine"], you: ["your", "yours"], naked: ["nakedness", "nakedly"] },
  es: { el: ["la", "los", "las"], ello: ["lo", "le"], crimen: ["crímenes", "criminales"], tamaño: ["tamaños", "grande", "mediano"] },
  ja: { ない: ["なく", "なくて", "なかっ"], する: ["して", "すれ"] },
};

/**
 * 뜻 고르기(w|·e|)의 오답으로 먼저 쓸 다른 낱말·표현 열쇠 — 그 예문 자리에 넣어도 말이 되는 것(앱 언어마다 그 열쇠의 뜻을 씀).
 * 같은 품사·주제로 고른 보기가 예문에 안 맞아 한눈에 지워지던 것(체감 점검 2026-11-19 표시 easy-decoy). 맞는 대안(동의어)은 넣지 않는다.
 */
export const MEANING_DECOYS: Record<string, Record<string, string[]>> = {
  en: {
    "w|autonomy": ["w|support", "w|attention", "w|advice"],
    "w|accelerate": ["w|slow", "w|stop", "w|turn"],
    "w|stethoscope": ["w|microphone", "w|mirror", "w|flashlight"],
  },
  es: {
    "w|clavar": ["w|pintar", "w|mover", "w|limpiar"],
    "e|a qué hora": ["e|cuánto cuesta", "e|qué tal", "e|se puede"],
    "e|la cuenta": ["w|menú", "w|postre", "w|propina"],
    "e|en cuanto a": ["e|a pesar de", "e|por cierto", "e|en cambio"],
    "w|lecho": ["w|asiento", "w|mesa", "w|manta"],
  },
};

export function meaningDecoyKeys(language: string, key: string): string[] {
  return MEANING_DECOYS[language]?.[key] ?? [];
}

export function wordNearMisses(language: string, piece: string): string[] {
  return WORD_DECOYS[language]?.[piece.toLocaleLowerCase()] ?? [];
}
