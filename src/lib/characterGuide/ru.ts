import type { CharacterGuide, CharacterItem, LocalizedText } from "./types.ts";

function m(ko: string, en: string): LocalizedText {
  return { ko, en };
}

function letter(
  upper: string,
  lower: string,
  pronunciation: string,
  usageKo: string,
  usageEn: string,
  examples: Array<[string, string, string, string]>,
): CharacterItem {
  return {
    id: `ru-${lower}`,
    character: upper,
    speak: lower,
    reading: lower,
    pronunciation,
    category: "letters",
    usage: m(usageKo, usageEn),
    examples: examples.map(([text, reading, mko, men]) => ({
      text,
      reading,
      meaning: m(mko, men),
    })),
  };
}

export const RU_GUIDE: CharacterGuide = {
  language: "ru",
  categories: [{ id: "letters", label: m("키릴 문자", "Cyrillic") }],
  items: [
    letter("А", "а", "a", "아", "like a in father", [["мама", "mama", "엄마", "mom"], ["да", "da", "네", "yes"]]),
    letter("Б", "б", "b", "ㅂ", "b", [["брат", "brat", "형/남동생", "brother"], ["хлеб", "khleb", "빵", "bread"]]),
    letter("В", "в", "v", "v", "v", [["вода", "voda", "물", "water"], ["вот", "vot", "여기", "here"]]),
    letter("Г", "г", "g", "ㄱ", "g", [["город", "gorod", "도시", "city"], ["где", "gde", "어디", "where"]]),
    letter("Д", "д", "d", "ㄷ", "d", [["дом", "dom", "집", "house"], ["да", "da", "네", "yes"]]),
    letter("Е", "е", "ye", "ye", "ye as in yes", [["есть", "yest", "있다/먹다", "there is / to eat"], ["нет", "nyet", "아니요", "no"]]),
    letter("Ё", "ё", "yo", "yo", "yo", [["ёлка", "yolka", "크리스마스 트리", "fir tree"]]),
    letter("Ж", "ж", "zh", "zh (주)", "zh as in measure", [["уже", "uzhe", "이미", "already"], ["жить", "zhit", "살다", "to live"]]),
    letter("З", "з", "z", "z", "z", [["завтра", "zavtra", "내일", "tomorrow"], ["язык", "yazyk", "언어", "language"]]),
    letter("И", "и", "i", "이", "ee", [["имя", "imya", "이름", "name"], ["и", "i", "그리고", "and"]]),
    letter("Й", "й", "y", "짧은 i", "short y, as in boy", [["мой", "moy", "나의", "my"], ["чай", "chay", "차", "tea"]]),
    letter("К", "к", "k", "ㅋ", "k", [["как", "kak", "어떻게", "how"], ["кто", "kto", "누구", "who"]]),
    letter("Л", "л", "l", "l", "l", [["лимон", "limon", "레몬", "lemon"], ["стол", "stol", "탁자", "table"]]),
    letter("М", "м", "m", "ㅁ", "m", [["мама", "mama", "엄마", "mom"], ["дом", "dom", "집", "house"]]),
    letter("Н", "н", "n", "ㄴ", "n", [["нет", "nyet", "아니요", "no"], ["она", "ona", "그녀", "she"]]),
    letter("О", "о", "o", "오 (강세 없을 땐 a에 가깝게)", "o; unstressed often like a", [["он", "on", "그", "he"], ["хорошо", "khorosho", "좋다", "good"]]),
    letter("П", "п", "p", "ㅍ", "p", [["папа", "papa", "아빠", "dad"], ["спать", "spat", "자다", "to sleep"]]),
    letter("Р", "р", "r", "혀 떠는 r", "rolled r", [["работа", "rabota", "일", "work"], ["мир", "mir", "세계/평화", "world / peace"]]),
    letter("С", "с", "s", "ㅅ", "s", [["спасибо", "spasibo", "고마워요", "thank you"], ["слово", "slovo", "단어", "word"]]),
    letter("Т", "т", "t", "ㅌ", "t", [["ты", "ty", "너", "you"], ["тут", "tut", "여기", "here"]]),
    letter("У", "у", "u", "우", "oo", [["утро", "utro", "아침", "morning"], ["друг", "drug", "친구", "friend"]]),
    letter("Ф", "ф", "f", "f", "f", [["кофе", "kofe", "커피", "coffee"], ["фото", "foto", "사진", "photo"]]),
    letter("Х", "х", "kh", "흐 (독일 ch)", "kh as in Bach", [["хорошо", "khorosho", "좋다", "good"], ["хлеб", "khleb", "빵", "bread"]]),
    letter("Ц", "ц", "ts", "ts", "ts as in cats", [["центр", "tsentr", "중심", "center"], ["отец", "otets", "아버지", "father"]]),
    letter("Ч", "ч", "ch", "ch", "ch", [["час", "chas", "시간", "hour"], ["что", "shto", "무엇", "what"]]),
    letter("Ш", "ш", "sh", "sh", "sh", [["школа", "shkola", "학교", "school"], ["хорошо", "khorosho", "좋다", "good"]]),
    letter("Щ", "щ", "shch", "더 부드러운 sh", "softer longer sh", [["ещё", "yeshchyo", "아직/더", "still / more"], ["борщ", "borshch", "보르시", "borscht"]]),
    letter("Ъ", "ъ", "hard sign", "경음부호. 앞뒤를 끊음", "hard sign: separates sounds", [["объект", "obyekt", "대상", "object"]]),
    letter("Ы", "ы", "y", "으에 가까운 i", "back unrounded i", [["ты", "ty", "너", "you"], ["мы", "my", "우리", "we"]]),
    letter("Ь", "ь", "soft sign", "연음부호. 앞 자음을 부드럽게", "soft sign: palatalizes the previous consonant", [["день", "den", "날", "day"], ["очень", "ochen", "매우", "very"]]),
    letter("Э", "э", "e", "에", "e as in met", [["это", "eto", "이것", "this"], ["этот", "etot", "이", "this"]]),
    letter("Ю", "ю", "yu", "유", "yu", [["юбка", "yubka", "치마", "skirt"], ["меню", "menyu", "메뉴", "menu"]]),
    letter("Я", "я", "ya", "야", "ya", [["я", "ya", "나", "I"], ["время", "vremya", "시간", "time"]]),
  ],
};
