/**
 * 사용법 장 안의 넘겨 보기 장면(2026-11-14 사용자 "탭 → 칸 → 핵심 사용 장면, 넘기면 세부 — 기능이 보이는 부분만 잘라, 그림 안에 기능 이름·설명").
 * 장면 한 장 = 그림 한 장(/guide/<앱 언어>/<shot>.webp) — 기능 이름·설명 한 줄이 그림 안에 있다(scripts/guide-slides/).
 * 첫 장이 그 칸의 핵심, 그 뒤가 세부. 🔊처럼 아이콘만으로 통하는 것은 설명하지 않는다.
 * /api/guide `slides=1`이 앱 언어에 그림이 있는 장만 준다 — 없는 언어·옛 빌드는 장의 예전 칸 글 그대로.
 * 칸 이름은 {ui:<키>} — 화면 문구 그대로. 그림을 다시 만들려면 scripts/guide-slides/(shoot → compose).
 */
/** title·desc는 그림 안에 그려진 글(scripts/guide-slides/compose.mjs가 읽어 그림)이고, 앱은 읽어 주기(alt)로만 쓴다. */
export type GuideSlide = { shot: string; title: string; desc: string };
export type GuideSlideGroup = { id: string; title: string; slides: GuideSlide[] };

/** 장 id → 칸들. 그림을 찍은 앱 언어만. */
const SLIDES: Record<string, Record<string, GuideSlideGroup[]>> = {
  ko: {
    my: [
      {
        id: "keep",
        title: "{ui:keepTitle}",
        slides: [
          { shot: "my-keep-1", title: "Quizbank", desc: "퀴즈를 한 흐름으로 풀어요 — − · + 로 쉽게·어렵게" },
          { shot: "my-keep-2", title: "맞힐수록 다음 단계로", desc: "같은 문법·표현을 맞히면 한 단계씩 어려워지고, 틀리면 그 단계에서 다른 문장으로 다시" },
          { shot: "my-keep-3", title: "부족한 곳을 계속 채워요", desc: "틀린 것, [다시]를 누른 것, 대화에서 막힌 것을 다시 내고, 자주 틀리는 종류를 더 많이 내요" },
        ],
      },
      {
        id: "lang",
        title: "{ui:languagebankTitle}",
        slides: [
          { shot: "my-lang-1", title: "Languagebank", desc: "배울 단어·표현·문법이 단계별로 — 찾기도 여기서" },
          { shot: "my-lang-2", title: "묶음 ▶ 넘겨 보기", desc: "주제·단계 묶음을 카드로 넘기며 뜻·단어·예문을 떠올려요" },
          { shot: "my-lang-3", title: "단어 화면", desc: "한 단어의 뜻 여러 개와 예문을 한눈에" },
        ],
      },
      {
        id: "log",
        title: "{ui:logbankTitle}",
        slides: [
          { shot: "my-log-1", title: "Logbank", desc: "주·월마다 배운 것 — 퀴즈로 배운 수(학습), 대화에서 쓴 수(활용)" },
          { shot: "my-log-2", title: "그날 학습", desc: "날을 누르면 언제 무엇을 했는지 시간 순서로" },
          { shot: "my-log-3", title: "맞음 ✓ · 틀림 ✗", desc: "한 번 한 공부의 단어·문법·표현마다 결과가 남아요" },
        ],
      },
    ],
  },
};

/** 이 앱 언어로 그림이 있는 장만(없으면 undefined). */
export function guideSlides(language: string): Record<string, GuideSlideGroup[]> | undefined {
  return SLIDES[language];
}
