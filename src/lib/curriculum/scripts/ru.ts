import type { ScriptCourse } from "./types.ts";

/** 러시아어 글자·소리 기초: 키릴 문자 33자, 부드러운·딱딱한 기호, 강세와 약해지는 모음, 쓰기와 다른 소리. */
export const RU_SCRIPT: ScriptCourse = {
  language: "ru",
  version: 1,
  title: { en: "Cyrillic letters and sounds", ko: "키릴 문자와 소리" },
  groups: [
    {
      id: "ru-same-1",
      title: { en: "Look and sound like Latin letters", ko: "모양도 소리도 라틴 문자와 같은 글자" },
      items: [
        { char: "А а", reading: "a", say: "а", example: { word: "автобус", meaning: { en: "bus", ko: "버스" } } },
        { char: "К к", reading: "k", say: "ка", example: { word: "кот", meaning: { en: "cat", ko: "고양이" } } },
        { char: "М м", reading: "m", say: "ма", example: { word: "мама", meaning: { en: "mom", ko: "엄마" } } },
        { char: "О о", reading: "o", say: "о", example: { word: "он", meaning: { en: "he", ko: "그" } } },
        { char: "Т т", reading: "t", say: "та", example: { word: "торт", meaning: { en: "cake", ko: "케이크" } } },
      ],
    },
    {
      id: "ru-false-2",
      title: { en: "Look like Latin letters, sound different", ko: "모양은 라틴 문자인데 소리가 다른 글자" },
      note: {
        en: "These are the classic traps: В is v, Н is n, Р is r, С is s, У is u, Х is kh, Е is ye.",
        ko: "자주 헷갈리는 글자: В는 v, Н는 n, Р는 r, С는 s, У는 u, Х는 kh(ㅎ), Е는 ye(예).",
      },
      items: [
        { char: "В в", reading: "v", say: "ва", example: { word: "вода", meaning: { en: "water", ko: "물" } } },
        { char: "Н н", reading: "n", say: "на", example: { word: "нос", meaning: { en: "nose", ko: "코" } } },
        { char: "Р р", reading: "r (rolled)", say: "ра", example: { word: "рука", meaning: { en: "hand", ko: "손" } } },
        { char: "С с", reading: "s", say: "са", example: { word: "сок", meaning: { en: "juice", ko: "주스" } } },
        { char: "У у", reading: "u", say: "у", example: { word: "утро", meaning: { en: "morning", ko: "아침" } } },
        { char: "Х х", reading: "kh", say: "ха", example: { word: "хлеб", meaning: { en: "bread", ko: "빵" } } },
        { char: "Е е", reading: "ye", say: "е", example: { word: "нет", meaning: { en: "no", ko: "아니요" } } },
      ],
    },
    {
      id: "ru-cons-3",
      title: { en: "New shapes: consonants", ko: "새 모양: 자음" },
      items: [
        { char: "Б б", reading: "b", say: "ба", example: { word: "банк", meaning: { en: "bank", ko: "은행" } } },
        { char: "Г г", reading: "g", say: "га", example: { word: "газета", meaning: { en: "newspaper", ko: "신문" } } },
        { char: "Д д", reading: "d", say: "да", example: { word: "дом", meaning: { en: "house", ko: "집" } } },
        { char: "З з", reading: "z", say: "за", example: { word: "зима", meaning: { en: "winter", ko: "겨울" } } },
        { char: "Л л", reading: "l", say: "ла", example: { word: "лампа", meaning: { en: "lamp", ko: "전등" } } },
        { char: "П п", reading: "p", say: "па", example: { word: "папа", meaning: { en: "dad", ko: "아빠" } } },
        { char: "Ф ф", reading: "f", say: "фа", example: { word: "фото", meaning: { en: "photo", ko: "사진" } } },
      ],
    },
    {
      id: "ru-vowel-4",
      title: { en: "New shapes: vowels and Й", ko: "새 모양: 모음 글자와 Й" },
      note: {
        en: "Я, Ю, Ё (and Е) say ya, yu, yo (ye) at the start of a word; after a consonant they make it soft.",
        ko: "Я·Ю·Ё(그리고 Е)는 낱말 처음에서 야·유·요(예), 자음 뒤에서는 그 자음을 부드럽게 만든다.",
      },
      items: [
        { char: "И и", reading: "i", say: "и", example: { word: "имя", meaning: { en: "name", ko: "이름" } } },
        { char: "Й й", reading: "y (short)", say: "мой", example: { word: "мой", meaning: { en: "my", ko: "나의" } } },
        { char: "Ы ы", reading: "y (deep i)", say: "мы", example: { word: "мы", meaning: { en: "we", ko: "우리" } } },
        { char: "Э э", reading: "e", say: "э", example: { word: "это", meaning: { en: "this", ko: "이것" } } },
        { char: "Ю ю", reading: "yu", say: "ю", example: { word: "юг", meaning: { en: "south", ko: "남쪽" } } },
        { char: "Я я", reading: "ya", say: "я", example: { word: "яблоко", meaning: { en: "apple", ko: "사과" } } },
        { char: "Ё ё", reading: "yo", say: "ё", example: { word: "ёлка", meaning: { en: "fir tree", ko: "전나무" } } },
      ],
    },
    {
      id: "ru-hush-5",
      title: { en: "New shapes: zh, ts, ch, sh, shch", ko: "새 모양: zh·ts·ch·sh·shch 소리" },
      note: {
        en: "Ж, Ш, Ц are always hard (жи, ши sound like zhy, shy); Ч and Щ are always soft.",
        ko: "Ж·Ш·Ц는 늘 딱딱하게(жи·ши는 '즤·싀'처럼), Ч·Щ는 늘 부드럽게 난다.",
      },
      items: [
        { char: "Ж ж", reading: "zh", say: "жа", example: { word: "журнал", meaning: { en: "magazine", ko: "잡지" } } },
        { char: "Ц ц", reading: "ts", say: "ца", example: { word: "цирк", meaning: { en: "circus", ko: "서커스" } } },
        { char: "Ч ч", reading: "ch", say: "ча", example: { word: "чай", meaning: { en: "tea", ko: "차" } } },
        { char: "Ш ш", reading: "sh", say: "ша", example: { word: "шапка", meaning: { en: "hat", ko: "모자" } } },
        { char: "Щ щ", reading: "shch (long soft sh)", say: "ща", example: { word: "борщ", meaning: { en: "borscht", ko: "보르시" } } },
      ],
    },
    {
      id: "ru-signs-6",
      title: { en: "Soft sign and hard sign", ko: "부드러운 기호와 딱딱한 기호" },
      note: {
        en: "Ь and Ъ have no sound of their own: Ь makes the consonant before it soft, Ъ keeps it apart from the next vowel.",
        ko: "Ь·Ъ는 소리가 없다: Ь는 앞 자음을 부드럽게, Ъ는 앞 자음과 뒤 모음을 끊어 읽게 한다.",
      },
      items: [
        { char: "Ь ь", reading: "' (softens)", say: "соль", example: { word: "соль", meaning: { en: "salt", ko: "소금" } } },
        { char: "Ъ ъ", reading: "(separates)", say: "подъезд", example: { word: "подъезд", meaning: { en: "building entrance", ko: "건물 출입구" } } },
        { char: "т / ть", reading: "t / t'", say: "брат, брать", example: { word: "мать", meaning: { en: "mother", ko: "어머니" } } },
        { char: "н / нь", reading: "n / n'", say: "он, конь", example: { word: "день", meaning: { en: "day", ko: "날, 낮" } } },
        { char: "л / ль", reading: "l / l'", say: "угол, уголь", example: { word: "учитель", meaning: { en: "teacher", ko: "선생님" } } },
        { char: "да / дя", reading: "da / d'a", say: "да, дядя", example: { word: "дядя", meaning: { en: "uncle", ko: "삼촌" } } },
      ],
    },
    {
      id: "ru-stress-7",
      title: { en: "Stress: one strong syllable", ko: "강세: 힘주는 음절 하나" },
      note: {
        en: "Every word has one stressed syllable, louder and longer. Normal text does not mark it; dictionaries use ´.",
        ko: "낱말마다 강세 음절이 하나 있고, 더 세고 길게 읽는다. 보통 글에는 표시가 없고 사전에서 ´로 보여 준다.",
      },
      items: [
        { char: "ма́ма", reading: "MA-ma", say: "мама", example: { word: "мама", meaning: { en: "mom", ko: "엄마" } } },
        { char: "кни́га", reading: "KNI-ga", say: "книга", example: { word: "книга", meaning: { en: "book", ko: "책" } } },
        { char: "рука́", reading: "ru-KA", say: "рука", example: { word: "рука", meaning: { en: "hand", ko: "손" } } },
        { char: "у́лица", reading: "U-li-tsa", say: "улица", example: { word: "улица", meaning: { en: "street", ko: "거리" } } },
        { char: "му́зыка", reading: "MU-zy-ka", say: "музыка", example: { word: "музыка", meaning: { en: "music", ko: "음악" } } },
        { char: "суббо́та", reading: "sub-BO-ta", say: "суббота", example: { word: "суббота", meaning: { en: "Saturday", ko: "토요일" } } },
      ],
    },
    {
      id: "ru-reduce-8",
      title: { en: "Unstressed О, Е and Я", ko: "강세 없는 О·Е·Я" },
      note: {
        en: "Without stress, О sounds like a short a; Е and Я sound like a short i.",
        ko: "강세가 없으면 О는 짧은 '아'로, Е·Я는 짧은 '이'로 소리 난다.",
      },
      items: [
        { char: "вода́", reading: "va-DA", say: "вода", example: { word: "вода", meaning: { en: "water", ko: "물" } } },
        { char: "окно́", reading: "ak-NO", say: "окно", example: { word: "окно", meaning: { en: "window", ko: "창문" } } },
        { char: "хорошо́", reading: "kha-ra-SHO", say: "хорошо", example: { word: "хорошо", meaning: { en: "good, fine", ko: "좋아요" } } },
        { char: "молоко́", reading: "ma-la-KO", say: "молоко", example: { word: "молоко", meaning: { en: "milk", ko: "우유" } } },
        { char: "спаси́бо", reading: "spa-SI-ba", say: "спасибо", example: { word: "спасибо", meaning: { en: "thank you", ko: "고마워요" } } },
        { char: "Москва́", reading: "mas-KVA", say: "Москва", example: { word: "Москва", meaning: { en: "Moscow", ko: "모스크바" } } },
        { char: "сейча́с", reading: "si-CHAS", say: "сейчас", example: { word: "сейчас", meaning: { en: "now", ko: "지금" } } },
        { char: "язы́к", reading: "yi-ZYK", say: "язык", example: { word: "язык", meaning: { en: "language, tongue", ko: "언어, 혀" } } },
      ],
    },
    {
      id: "ru-spoken-9",
      title: { en: "Written one way, said another", ko: "쓰는 것과 다르게 나는 소리" },
      note: {
        en: "At the end of a word, б д г з ж в sound like п т к с ш ф. Г in -ого / -его sounds like в.",
        ko: "낱말 끝의 б·д·г·з·ж·в는 п·т·к·с·ш·ф로 난다. -ого·-его의 г는 в로 읽는다.",
      },
      items: [
        { char: "хлеб", reading: "khlep", say: "хлеб", example: { word: "хлеб", meaning: { en: "bread", ko: "빵" } } },
        { char: "друг", reading: "druk", say: "друг", example: { word: "друг", meaning: { en: "friend", ko: "친구" } } },
        { char: "год", reading: "got", say: "год", example: { word: "год", meaning: { en: "year", ko: "해, 년" } } },
        { char: "гараж", reading: "ga-RASH", say: "гараж", example: { word: "гараж", meaning: { en: "garage", ko: "차고" } } },
        { char: "любовь", reading: "lyu-BOF'", say: "любовь", example: { word: "любовь", meaning: { en: "love", ko: "사랑" } } },
        { char: "его", reading: "ye-VO", say: "его", example: { word: "его", meaning: { en: "him, his", ko: "그를, 그의" } } },
        { char: "сегодня", reading: "si-VOD-nya", say: "сегодня", example: { word: "сегодня", meaning: { en: "today", ko: "오늘" } } },
        { char: "что", reading: "shto", say: "что", example: { word: "что", meaning: { en: "what", ko: "무엇" } } },
      ],
    },
  ],
};
