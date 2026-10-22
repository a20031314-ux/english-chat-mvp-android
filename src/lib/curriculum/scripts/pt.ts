import type { ScriptCourse } from "./types.ts";

/** 포르투갈어(브라질) 철자-발음 기초. 읽는 법은 브라질 표준(상파울루·리우 공통) 기준. */
export const PT_SCRIPT: ScriptCourse = {
  language: "pt",
  version: 1,
  title: { en: "Brazilian Portuguese spelling and sounds", ko: "브라질 포르투갈어 철자와 발음" },
  groups: [
    {
      id: "pt-vowel-1",
      title: { en: "Vowels: open and closed e, o", ko: "모음: 열린 e·o와 닫힌 e·o" },
      note: {
        en: "e and o each have an open and a closed sound: é, ó are open; ê, ô are closed. Without an accent, learn it with the word.",
        ko: "e와 o는 열린 소리와 닫힌 소리가 있다: é·ó는 열린(입 크게), ê·ô는 닫힌 소리. 기호가 없으면 낱말과 함께 익힌다.",
      },
      items: [
        { char: "a", reading: "a (ba-TA-ta)", say: "batata", example: { word: "batata", meaning: { en: "potato", ko: "감자" } } },
        { char: "é", reading: "eh (open, like 'bed')", say: "pé", example: { word: "pé", meaning: { en: "foot", ko: "발" } } },
        { char: "ê", reading: "e (closed, like 'say' without the y)", say: "você", example: { word: "você", meaning: { en: "you", ko: "당신, 너" } } },
        { char: "i", reading: "i (like 'see')", say: "vida", example: { word: "vida", meaning: { en: "life", ko: "삶" } } },
        { char: "ó", reading: "aw (open, like 'law')", say: "avó", example: { word: "avó", meaning: { en: "grandmother", ko: "할머니" } } },
        { char: "ô", reading: "o (closed, like 'go' without the w)", say: "avô", example: { word: "avô", meaning: { en: "grandfather", ko: "할아버지" } } },
        { char: "u", reading: "u (like 'moon')", say: "uva", example: { word: "uva", meaning: { en: "grape", ko: "포도" } } },
      ],
    },
    {
      id: "pt-end-2",
      title: { en: "Final -o and -e, de and te", ko: "끝소리 -o·-e와 de·te" },
      note: {
        en: "At the end of a word, unstressed o sounds like u and e like i. Before that i sound, d becomes dj and t becomes tch.",
        ko: "낱말 끝의 힘 없는 o는 '우', e는 '이'처럼 난다. 그 '이' 소리 앞에서 d는 '지', t는 '치'가 된다.",
      },
      items: [
        { char: "-o", reading: "u (GA-tu)", say: "gato", example: { word: "gato", meaning: { en: "cat", ko: "고양이" } } },
        { char: "-e", reading: "i (NO-mi)", say: "nome", example: { word: "nome", meaning: { en: "name", ko: "이름" } } },
        { char: "de", reading: "dji (si-DA-dji)", say: "cidade", example: { word: "cidade", meaning: { en: "city", ko: "도시" } } },
        { char: "te", reading: "tchi (NOY-tchi)", say: "noite", example: { word: "noite", meaning: { en: "night", ko: "밤" } } },
        { char: "di", reading: "dji (DJI-a)", say: "dia", example: { word: "dia", meaning: { en: "day", ko: "날, 낮" } } },
        { char: "ti", reading: "tchi (TCHI-a)", say: "tia", example: { word: "tia", meaning: { en: "aunt", ko: "이모, 고모" } } },
      ],
    },
    {
      id: "pt-nasal-3",
      title: { en: "Nasal vowels", ko: "콧소리 모음" },
      note: {
        en: "~ and an m or n closing a syllable make the vowel nasal; the m or n is not said as its own sound. Do not close your lips on final -m.",
        ko: "~ 표시와 음절 끝의 m·n은 모음을 콧소리로 만든다. m·n을 따로 소리 내지 않고, 끝의 -m에서 입술을 다물지 않는다.",
      },
      items: [
        { char: "ã", reading: "ã (nasal 'a')", say: "irmã", example: { word: "irmã", meaning: { en: "sister", ko: "자매(언니·누나·여동생)" } } },
        { char: "ão", reading: "ãw (nasal 'ow')", say: "pão", example: { word: "pão", meaning: { en: "bread", ko: "빵" } } },
        { char: "ãe", reading: "ãy (nasal 'eye')", say: "mãe", example: { word: "mãe", meaning: { en: "mother", ko: "엄마" } } },
        { char: "õe", reading: "õy (nasal 'oy')", say: "botões", example: { word: "botões", meaning: { en: "buttons", ko: "단추들" } } },
        { char: "-am", reading: "ãw (FA-lãw)", say: "falam", example: { word: "falam", meaning: { en: "they speak", ko: "(그들이) 말한다" } } },
        { char: "-em", reading: "ẽy (bẽy)", say: "bem", example: { word: "bem", meaning: { en: "well", ko: "잘" } } },
        { char: "-im", reading: "ĩ (nasal 'ee')", say: "sim", example: { word: "sim", meaning: { en: "yes", ko: "네" } } },
        { char: "-om, -um", reading: "õ, ũ (nasal 'o', 'oo')", say: "bom", example: { word: "bom", meaning: { en: "good", ko: "좋은" } } },
        { char: "an, en, on", reading: "ã, ẽ, õ before a consonant (TẼ-pu)", say: "tempo", example: { word: "tempo", meaning: { en: "time, weather", ko: "시간, 날씨" } } },
      ],
    },
    {
      id: "pt-digraph-4",
      title: { en: "lh, nh, ch, ç, qu, gu", ko: "lh·nh·ch·ç·qu·gu" },
      note: {
        en: "ç is always s and only comes before a, o, u. In que, qui, gue, gui the u is usually silent.",
        ko: "ç는 언제나 's' 소리이고 a·o·u 앞에만 온다. que·qui·gue·gui의 u는 보통 소리 나지 않는다.",
      },
      items: [
        { char: "lh", reading: "ly (like 'million')", say: "filho", example: { word: "filho", meaning: { en: "son", ko: "아들" } } },
        { char: "nh", reading: "ny (like 'canyon')", say: "vinho", example: { word: "vinho", meaning: { en: "wine", ko: "와인" } } },
        { char: "ch", reading: "sh", say: "chuva", example: { word: "chuva", meaning: { en: "rain", ko: "비" } } },
        { char: "ç", reading: "s (PRA-sa)", say: "praça", example: { word: "praça", meaning: { en: "square, plaza", ko: "광장" } } },
        { char: "que, qui", reading: "ke, ki (u silent)", say: "queijo", example: { word: "queijo", meaning: { en: "cheese", ko: "치즈" } } },
        { char: "qua", reading: "kwa", say: "quatro", example: { word: "quatro", meaning: { en: "four", ko: "넷" } } },
        { char: "gue, gui", reading: "ge, gi (hard g, u silent)", say: "guitarra", example: { word: "guitarra", meaning: { en: "guitar", ko: "기타" } } },
      ],
    },
    {
      id: "pt-cgj-5",
      title: { en: "c, g and j", ko: "c·g·j" },
      note: {
        en: "c and g are soft before e and i (s, zh) and hard before a, o, u (k, g). j is always zh.",
        ko: "c와 g는 e·i 앞에서 부드럽게(s·zh), a·o·u 앞에서 단단하게(k·g) 난다. j는 언제나 zh.",
      },
      items: [
        { char: "ca, co, cu", reading: "k", say: "copo", example: { word: "copo", meaning: { en: "glass, cup", ko: "컵" } } },
        { char: "ce, ci", reading: "s", say: "cinema", example: { word: "cinema", meaning: { en: "cinema", ko: "영화관" } } },
        { char: "ga, go, gu", reading: "g (hard)", say: "água", example: { word: "água", meaning: { en: "water", ko: "물" } } },
        { char: "ge, gi", reading: "zh (like 'measure')", say: "gente", example: { word: "gente", meaning: { en: "people", ko: "사람들" } } },
        { char: "j", reading: "zh (like 'measure')", say: "janela", example: { word: "janela", meaning: { en: "window", ko: "창문" } } },
      ],
    },
    {
      id: "pt-r-6",
      title: { en: "r, rr and silent h", ko: "r·rr와 소리 없는 h" },
      note: {
        en: "In Brazil, r at the start of a word and rr sound like an English h; a single r between vowels is a quick flap. caro (expensive) and carro (car) are different words.",
        ko: "브라질에서는 낱말 첫 r과 rr가 영어 h(ㅎ)처럼, 모음 사이 r 하나는 혀를 한 번 튕기는 ㄹ처럼 난다. caro(비싼)와 carro(자동차)는 다른 낱말.",
      },
      items: [
        { char: "r- (start)", reading: "h (HI-u)", say: "rio", example: { word: "rio", meaning: { en: "river", ko: "강" } } },
        { char: "rr", reading: "h (KA-hu)", say: "carro", example: { word: "carro", meaning: { en: "car", ko: "자동차" } } },
        { char: "-r- (between vowels)", reading: "flap r (KA-ru)", say: "caro", example: { word: "caro", meaning: { en: "expensive", ko: "비싼" } } },
        { char: "pr, br, tr", reading: "flap r after a consonant", say: "prato", example: { word: "prato", meaning: { en: "plate", ko: "접시" } } },
        { char: "r (end of syllable)", reading: "soft h, often dropped at the very end (POH-ta, ko-MEH)", say: "porta", example: { word: "porta", meaning: { en: "door", ko: "문" } } },
        { char: "h", reading: "silent (O-ra)", say: "hora", example: { word: "hora", meaning: { en: "hour", ko: "시(時), 시간" } } },
      ],
    },
    {
      id: "pt-s-7",
      title: { en: "s, ss and z", ko: "s·ss·z" },
      note: {
        en: "A single s between vowels sounds like z; ss is always s. In Rio, s before a consonant or at the end often sounds like sh.",
        ko: "모음 사이 s 하나는 z처럼, ss는 언제나 s. 리우에서는 자음 앞·낱말 끝의 s가 흔히 sh처럼 들린다.",
      },
      items: [
        { char: "s (start)", reading: "s", say: "sol", example: { word: "sol", meaning: { en: "sun", ko: "해" } } },
        { char: "ss", reading: "s (MA-sa)", say: "massa", example: { word: "massa", meaning: { en: "pasta, dough", ko: "파스타, 반죽" } } },
        { char: "-s- (between vowels)", reading: "z (KA-za)", say: "casa", example: { word: "casa", meaning: { en: "house", ko: "집" } } },
        { char: "z", reading: "z", say: "zero", example: { word: "zero", meaning: { en: "zero", ko: "영(0)" } } },
        { char: "s + consonant", reading: "s (Rio: sh) — FES-ta", say: "festa", example: { word: "festa", meaning: { en: "party", ko: "파티" } } },
        { char: "-s, -z (end)", reading: "s (Rio: sh) — tres, fe-LIS", say: "três", example: { word: "três", meaning: { en: "three", ko: "셋" } } },
      ],
    },
    {
      id: "pt-xl-8",
      title: { en: "x and final l", ko: "x와 음절 끝 l" },
      note: {
        en: "x is most often sh (at the start and after ai, ei); its other sounds are learned with the word. l at the end of a syllable sounds like u.",
        ko: "x는 대개 sh(낱말 첫머리, ai·ei 뒤). 다른 소리는 낱말과 함께 익힌다. 음절 끝의 l은 '우'처럼 난다.",
      },
      items: [
        { char: "x = sh", reading: "sh (PEY-shi)", say: "peixe", example: { word: "peixe", meaning: { en: "fish", ko: "생선, 물고기" } } },
        { char: "x = ks", reading: "ks (TAK-si)", say: "táxi", example: { word: "táxi", meaning: { en: "taxi", ko: "택시" } } },
        { char: "ex- = z", reading: "z (e-ZẼ-plu)", say: "exemplo", example: { word: "exemplo", meaning: { en: "example", ko: "예" } } },
        { char: "x = s", reading: "s (PRO-si-mu)", say: "próximo", example: { word: "próximo", meaning: { en: "next", ko: "다음" } } },
        { char: "l", reading: "l", say: "lua", example: { word: "lua", meaning: { en: "moon", ko: "달" } } },
        { char: "-l (end of syllable)", reading: "u (bra-ZIU)", say: "Brasil", example: { word: "Brasil", meaning: { en: "Brazil", ko: "브라질" } } },
      ],
    },
    {
      id: "pt-accent-9",
      title: { en: "Accent marks and stress", ko: "강세와 기호(á â ã é ê ó ô)" },
      note: {
        en: "An accent marks the stressed syllable: ´ open, ^ closed, ~ nasal. With no accent, stress the second-to-last syllable, except words ending in r, l, z, i, u (stress the last).",
        ko: "기호가 있는 음절에 힘을 준다: ´ 열린 소리, ^ 닫힌 소리, ~ 콧소리. 기호가 없으면 끝에서 두 번째 음절, 단 r·l·z·i·u로 끝나면 마지막 음절.",
      },
      items: [
        { char: "á", reading: "stressed open a (so-FA)", say: "sofá", example: { word: "sofá", meaning: { en: "sofa", ko: "소파" } } },
        { char: "â", reading: "stressed closed a, 'uh' (KÂ-me-ra)", say: "câmera", example: { word: "câmera", meaning: { en: "camera", ko: "카메라" } } },
        { char: "ã", reading: "stressed nasal a (a-ma-NHÃ)", say: "amanhã", example: { word: "amanhã", meaning: { en: "tomorrow", ko: "내일" } } },
        { char: "é", reading: "stressed open e (ka-FEH)", say: "café", example: { word: "café", meaning: { en: "coffee", ko: "커피" } } },
        { char: "ê", reading: "stressed closed e (por-tu-GES)", say: "português", example: { word: "português", meaning: { en: "Portuguese", ko: "포르투갈어" } } },
        { char: "ó", reading: "stressed open o (SAW)", say: "só", example: { word: "só", meaning: { en: "only", ko: "오직, 그냥" } } },
        { char: "ô", reading: "stressed closed o (O-ni-bus)", say: "ônibus", example: { word: "ônibus", meaning: { en: "bus", ko: "버스" } } },
        { char: "í, ú", reading: "stressed i, u (pa-IS, a-SU-kar)", say: "país", example: { word: "país", meaning: { en: "country", ko: "나라" } } },
        { char: "mesa", reading: "no mark: second-to-last (ME-za)", say: "mesa", example: { word: "mesa", meaning: { en: "table", ko: "식탁, 책상" } } },
        { char: "-r, -l, -z, -i, -u", reading: "no mark: last syllable (fa-LAR)", say: "falar", example: { word: "falar", meaning: { en: "to speak", ko: "말하다" } } },
      ],
    },
  ],
};
