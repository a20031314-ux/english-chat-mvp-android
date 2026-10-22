import type { ScriptCourse } from "./types.ts";

/** 스페인어 철자-발음 기초. 글자는 라틴 문자 그대로라 "쓴 대로 읽는 규칙"과 한국어 화자가 헷갈리는 소리만 다룬다. */
export const ES_SCRIPT: ScriptCourse = {
  language: "es",
  version: 1,
  title: { en: "Spanish spelling and sounds", ko: "스페인어 철자와 소리" },
  groups: [
    {
      id: "es-vowel-1",
      title: { en: "The five vowels", ko: "다섯 모음" },
      note: {
        en: "Each vowel always has one short, clear sound, wherever it is in the word.",
        ko: "모음은 어디에 있든 늘 짧고 또렷한 한 소리(아·에·이·오·우)로 읽는다.",
      },
      items: [
        { char: "a", reading: "a", say: "a", example: { word: "casa", meaning: { en: "house", ko: "집" } } },
        { char: "e", reading: "e", say: "e", example: { word: "mesa", meaning: { en: "table", ko: "탁자" } } },
        { char: "i", reading: "i", say: "i", example: { word: "sí", meaning: { en: "yes", ko: "네" } } },
        { char: "o", reading: "o", say: "o", example: { word: "ojo", meaning: { en: "eye", ko: "눈" } } },
        { char: "u", reading: "u", say: "u", example: { word: "uno", meaning: { en: "one", ko: "하나" } } },
      ],
    },
    {
      id: "es-cons-1",
      title: { en: "Consonants that sound as expected", ko: "보이는 대로 읽는 자음" },
      note: {
        en: "p, t and k sounds are soft, with no puff of air: closer to Korean ㅃ ㄸ ㄲ than ㅍ ㅌ ㅋ.",
        ko: "p·t 소리는 바람 없이 부드럽게: ㅍ·ㅌ보다 ㅃ·ㄸ에 가깝다.",
      },
      items: [
        { char: "m", reading: "m", say: "ma", example: { word: "mamá", meaning: { en: "mum", ko: "엄마" } } },
        { char: "n", reading: "n", say: "no", example: { word: "noche", meaning: { en: "night", ko: "밤" } } },
        { char: "p", reading: "p", say: "pan", example: { word: "pan", meaning: { en: "bread", ko: "빵" } } },
        { char: "t", reading: "t", say: "té", example: { word: "tomate", meaning: { en: "tomato", ko: "토마토" } } },
        { char: "d", reading: "d", say: "dedo", example: { word: "dedo", meaning: { en: "finger", ko: "손가락" } } },
        { char: "l", reading: "l", say: "luna", example: { word: "luna", meaning: { en: "moon", ko: "달" } } },
        { char: "s", reading: "s", say: "sol", example: { word: "sol", meaning: { en: "sun", ko: "해" } } },
        { char: "f", reading: "f", say: "foto", example: { word: "foto", meaning: { en: "photo", ko: "사진" } } },
        { char: "ch", reading: "ch", say: "chico", example: { word: "chico", meaning: { en: "boy", ko: "남자아이" } } },
      ],
    },
    {
      id: "es-bv-1",
      title: { en: "b and v sound the same", ko: "b와 v는 같은 소리" },
      note: {
        en: "b and v are both a b sound; between vowels the lips barely touch. There is no English v sound.",
        ko: "b와 v는 둘 다 ㅂ 소리 — 모음 사이에선 입술을 살짝만 붙인다. 영어 v처럼 이로 입술을 물지 않는다.",
      },
      items: [
        { char: "b", reading: "b", say: "bien", example: { word: "bien", meaning: { en: "well, good", ko: "잘, 좋게" } } },
        { char: "v", reading: "b", say: "vino", example: { word: "vino", meaning: { en: "wine", ko: "와인" } } },
        { char: "ba / va", reading: "ba", say: "vaca", example: { word: "vaca", meaning: { en: "cow", ko: "소" } } },
        { char: "bo / vo", reading: "bo", say: "boca", example: { word: "boca", meaning: { en: "mouth", ko: "입" } } },
        { char: "-b- / -v-", reading: "b", say: "nuevo", example: { word: "nuevo", meaning: { en: "new", ko: "새로운" } } },
      ],
    },
    {
      id: "es-cons-2",
      title: { en: "j, g and the silent h", ko: "j·g와 소리 없는 h" },
      note: {
        en: "j, and g before e or i, are a rough h from the throat. h is always silent.",
        ko: "j, 그리고 e·i 앞의 g는 목에서 긁는 ㅎ 소리. h는 늘 소리 내지 않는다.",
      },
      items: [
        { char: "j", reading: "h", say: "jamón", example: { word: "jamón", meaning: { en: "ham", ko: "햄" } } },
        { char: "ge / gi", reading: "he / hi", say: "gente", example: { word: "gente", meaning: { en: "people", ko: "사람들" } } },
        { char: "ga / go / gu", reading: "ga / go / gu", say: "gato", example: { word: "gato", meaning: { en: "cat", ko: "고양이" } } },
        { char: "gue / gui", reading: "ge / gi", say: "guitarra", example: { word: "guitarra", meaning: { en: "guitar", ko: "기타" } } },
        { char: "güe / güi", reading: "gwe / gwi", say: "pingüino", example: { word: "pingüino", meaning: { en: "penguin", ko: "펭귄" } } },
        { char: "h", reading: "silent", say: "hola", example: { word: "hola", meaning: { en: "hello", ko: "안녕" } } },
        { char: "ho / ha", reading: "o / a", say: "hora", example: { word: "hora", meaning: { en: "hour", ko: "시간, 시" } } },
      ],
    },
    {
      id: "es-cons-3",
      title: { en: "ñ, ll and y", ko: "ñ·ll·y" },
      note: {
        en: "ll and y sound the same in most places, like y in yes (in Argentina closer to sh).",
        ko: "ll과 y는 대부분 같은 소리, '야·요'의 ㅣ 소리(아르헨티나에선 '샤'에 가깝다).",
      },
      items: [
        { char: "ñ", reading: "ny", say: "niño", example: { word: "niño", meaning: { en: "child", ko: "아이" } } },
        { char: "ña / ño", reading: "nya / nyo", say: "año", example: { word: "año", meaning: { en: "year", ko: "해, 년" } } },
        { char: "n / ñ", reading: "n vs ny", say: "uña", example: { word: "uña", meaning: { en: "nail", ko: "손톱" } } },
        { char: "ll", reading: "y", say: "calle", example: { word: "calle", meaning: { en: "street", ko: "거리" } } },
        { char: "lla / llo", reading: "ya / yo", say: "pollo", example: { word: "pollo", meaning: { en: "chicken", ko: "닭고기" } } },
        { char: "y", reading: "y", say: "playa", example: { word: "playa", meaning: { en: "beach", ko: "해변" } } },
        { char: "-y", reading: "i", say: "hoy", example: { word: "hoy", meaning: { en: "today", ko: "오늘" } } },
      ],
    },
    {
      id: "es-r-1",
      title: { en: "r and rr", ko: "r과 rr" },
      note: {
        en: "One r between vowels is a single quick tap of the tongue; rr, and r at the start of a word, is rolled.",
        ko: "모음 사이 r 하나는 혀를 한 번 튕기고(ㄹ), rr과 낱말 첫 r은 혀를 떨어 굴린다.",
      },
      items: [
        { char: "r", reading: "r", say: "pero", example: { word: "pero", meaning: { en: "but", ko: "하지만" } } },
        { char: "rr", reading: "rr", say: "perro", example: { word: "perro", meaning: { en: "dog", ko: "개" } } },
        { char: "r-", reading: "rr", say: "rosa", example: { word: "rosa", meaning: { en: "rose", ko: "장미" } } },
        { char: "caro / carro", reading: "karo / karro", say: "carro", example: { word: "caro", meaning: { en: "expensive", ko: "비싼" } } },
        { char: "tr / dr", reading: "tr / dr", say: "tres", example: { word: "tres", meaning: { en: "three", ko: "셋" } } },
        { char: "-r", reading: "r", say: "comer", example: { word: "comer", meaning: { en: "to eat", ko: "먹다" } } },
        { char: "l / r", reading: "l vs r", say: "pelo", example: { word: "pelo", meaning: { en: "hair", ko: "머리카락" } } },
      ],
    },
    {
      id: "es-ck-1",
      title: { en: "c, qu, z and k", ko: "c·qu·z·k" },
      note: {
        en: "c is k before a, o, u and s before e, i (in Spain th). z is also s (in Spain th). For ke/ki write que/qui.",
        ko: "c는 a·o·u 앞에서 ㄲ/ㅋ, e·i 앞에서 ㅅ(스페인에선 혀를 이 사이에 낀 th). z도 ㅅ(스페인 th). '케·키'는 que·qui로 쓴다.",
      },
      items: [
        { char: "ca / co / cu", reading: "ka / ko / ku", say: "cama", example: { word: "cama", meaning: { en: "bed", ko: "침대" } } },
        { char: "ce / ci", reading: "se / si", say: "cine", example: { word: "cine", meaning: { en: "cinema", ko: "영화관" } } },
        { char: "za / zo / zu", reading: "sa / so / su", say: "zapato", example: { word: "zapato", meaning: { en: "shoe", ko: "신발" } } },
        { char: "-z", reading: "s", say: "luz", example: { word: "luz", meaning: { en: "light", ko: "빛, 불" } } },
        { char: "que / qui", reading: "ke / ki", say: "queso", example: { word: "queso", meaning: { en: "cheese", ko: "치즈" } } },
        { char: "k", reading: "k", say: "kilo", example: { word: "kilo", meaning: { en: "kilo", ko: "킬로" } } },
        { char: "x", reading: "ks", say: "taxi", example: { word: "taxi", meaning: { en: "taxi", ko: "택시" } } },
      ],
    },
    {
      id: "es-diph-1",
      title: { en: "Two vowels together", ko: "모음 둘이 붙을 때" },
      note: {
        en: "i and u next to another vowel glide into it in one beat: bueno is bwe-no, not bu-e-no.",
        ko: "i·u가 다른 모음 옆에 오면 한 박자로 붙여 읽는다: bueno는 '부·에·노' 세 박자가 아니라 '붸노' 두 박자.",
      },
      items: [
        { char: "ue", reading: "we", say: "bueno", example: { word: "bueno", meaning: { en: "good", ko: "좋은" } } },
        { char: "ie", reading: "ye", say: "tiempo", example: { word: "tiempo", meaning: { en: "time, weather", ko: "시간, 날씨" } } },
        { char: "ai / ay", reading: "ai", say: "aire", example: { word: "aire", meaning: { en: "air", ko: "공기" } } },
        { char: "ei / ey", reading: "ei", say: "seis", example: { word: "seis", meaning: { en: "six", ko: "여섯" } } },
        { char: "oi / oy", reading: "oi", say: "hoy", example: { word: "soy", meaning: { en: "I am", ko: "나는 ~이다" } } },
        { char: "au", reading: "au", say: "auto", example: { word: "auto", meaning: { en: "car", ko: "자동차" } } },
        { char: "ua", reading: "wa", say: "agua", example: { word: "agua", meaning: { en: "water", ko: "물" } } },
        { char: "io", reading: "yo", say: "radio", example: { word: "radio", meaning: { en: "radio", ko: "라디오" } } },
      ],
    },
    {
      id: "es-stress-1",
      title: { en: "Where the stress falls", ko: "어디에 힘을 주나" },
      note: {
        en: "Ending in a vowel, n or s: stress the second-to-last syllable. Ending in another consonant: the last. An accent mark overrides both.",
        ko: "모음·n·s로 끝나면 끝에서 둘째 음절, 다른 자음으로 끝나면 마지막 음절에 힘. 강세 표시(´)가 있으면 그 자리가 우선.",
      },
      items: [
        { char: "CA-sa", reading: "KA-sa", say: "casa", example: { word: "casa", meaning: { en: "house", ko: "집" } } },
        { char: "JO-ven", reading: "HO-ben", say: "joven", example: { word: "joven", meaning: { en: "young", ko: "젊은" } } },
        { char: "LU-nes", reading: "LU-nes", say: "lunes", example: { word: "lunes", meaning: { en: "Monday", ko: "월요일" } } },
        { char: "ha-BLAR", reading: "a-BLAR", say: "hablar", example: { word: "hablar", meaning: { en: "to speak", ko: "말하다" } } },
        { char: "ciu-DAD", reading: "syu-DAD", say: "ciudad", example: { word: "ciudad", meaning: { en: "city", ko: "도시" } } },
        { char: "es-pa-ÑOL", reading: "es-pa-NYOL", say: "español", example: { word: "español", meaning: { en: "Spanish", ko: "스페인어" } } },
      ],
    },
    {
      id: "es-accent-1",
      title: { en: "Written accents: á é í ó ú", ko: "강세 표시: á é í ó ú" },
      note: {
        en: "The mark only shows where to put the stress; the vowel sound itself does not change.",
        ko: "표시는 힘줄 자리만 알려 준다 — 모음 소리 자체는 바뀌지 않는다.",
      },
      items: [
        { char: "á", reading: "A", say: "papá", example: { word: "papá", meaning: { en: "dad", ko: "아빠" } } },
        { char: "é", reading: "E", say: "café", example: { word: "café", meaning: { en: "coffee", ko: "커피" } } },
        { char: "í", reading: "I", say: "aquí", example: { word: "aquí", meaning: { en: "here", ko: "여기" } } },
        { char: "ó", reading: "O", say: "canción", example: { word: "canción", meaning: { en: "song", ko: "노래" } } },
        { char: "ú", reading: "U", say: "música", example: { word: "música", meaning: { en: "music", ko: "음악" } } },
        { char: "TE-lé-fo-no", reading: "te-LE-fo-no", say: "teléfono", example: { word: "teléfono", meaning: { en: "telephone", ko: "전화" } } },
        { char: "ÁR-bol", reading: "AR-bol", say: "árbol", example: { word: "árbol", meaning: { en: "tree", ko: "나무" } } },
      ],
    },
    {
      id: "es-mark-1",
      title: { en: "Marks that change meaning, and ¿ ¡", ko: "뜻을 가르는 표시와 ¿ ¡" },
      note: {
        en: "Questions and exclamations open with an upside-down mark: ¿…? and ¡…!. Read the whole sentence with that tone from the start.",
        ko: "물음·느낌 문장은 앞에 거꾸로 된 부호로 연다: ¿…?, ¡…!. 첫 낱말부터 그 억양으로 읽는다.",
      },
      items: [
        { char: "sí / si", reading: "si (yes / if)", say: "sí", example: { word: "sí", meaning: { en: "yes (si = if)", ko: "네 (si = 만약)" } } },
        { char: "tú / tu", reading: "tu (you / your)", say: "tú", example: { word: "tú", meaning: { en: "you (tu = your)", ko: "너 (tu = 너의)" } } },
        { char: "papá / papa", reading: "pa-PA / PA-pa", say: "papa", example: { word: "papa", meaning: { en: "potato (papá = dad)", ko: "감자 (papá = 아빠)" } } },
        { char: "¿…?", reading: "rising tone", say: "¿Qué?", example: { word: "¿Qué?", meaning: { en: "What?", ko: "뭐라고?" } } },
        { char: "¡…!", reading: "exclaim", say: "¡Hola!", example: { word: "¡Hola!", meaning: { en: "Hi!", ko: "안녕!" } } },
        { char: "¿Dónde…?", reading: "DON-de", say: "¿Dónde?", example: { word: "¿Dónde?", meaning: { en: "Where?", ko: "어디?" } } },
      ],
    },
  ],
};
