import type { CharacterGuide, CharacterItem, LocalizedText } from "./types";

function m(ko: string, en: string): LocalizedText {
  return { ko, en };
}

function arLetter(
  isolated: string,
  name: string,
  pronunciation: string,
  forms: { initial?: string; medial?: string; final?: string },
  usageKo: string,
  usageEn: string,
  examples: Array<[string, string, string, string]>,
): CharacterItem {
  return {
    id: `ar-${name}`,
    character: isolated,
    speak: isolated,
    reading: name,
    pronunciation,
    category: "letters",
    usage: m(usageKo, usageEn),
    forms: { isolated, ...forms },
    examples: examples.map(([text, reading, mko, men]) => ({
      text,
      reading,
      meaning: m(mko, men),
    })),
  };
}

export const AR_GUIDE: CharacterGuide = {
  language: "ar",
  categories: [{ id: "letters", label: m("아랍 문자", "Arabic letters") }],
  notes: [
    {
      title: m("글자 위치", "Letter shape"),
      body: m(
        "아랍어는 오른쪽에서 왼쪽으로 씁니다. 같은 글자도 단어의 앞·가운데·끝에서 모양이 조금 달라집니다.",
        "Arabic is written right to left. Many letters change shape at the start, middle, or end of a word.",
      ),
    },
  ],
  items: [
    arLetter("ا", "alif", "aa / a", { initial: "ا", medial: "ـا", final: "ـا" }, "긴 a. 연결은 오른쪽만", "long a; connects on the right only", [["أنا", "ana", "나", "I"], ["باب", "bab", "문", "door"]]),
    arLetter("ب", "ba", "b", { initial: "بـ", medial: "ـبـ", final: "ـب" }, "b", "b", [["بيت", "bayt", "집", "house"], ["باب", "bab", "문", "door"]]),
    arLetter("ت", "ta", "t", { initial: "تـ", medial: "ـتـ", final: "ـت" }, "t", "t", [["تمر", "tamr", "대추", "dates"], ["بنت", "bint", "딸", "girl"]]),
    arLetter("ث", "tha", "th (thin)", { initial: "ثـ", medial: "ـثـ", final: "ـث" }, "think의 th", "th as in think", [["ثلاثة", "thalatha", "셋", "three"]]),
    arLetter("ج", "jim", "j", { initial: "جـ", medial: "ـجـ", final: "ـج" }, "j", "j", [["جميل", "jamil", "아름답다", "beautiful"], ["جاء", "ja'a", "왔다", "came"]]),
    arLetter("ح", "ha", "ħ", { initial: "حـ", medial: "ـحـ", final: "ـح" }, "목구멍에서 나는 h", "strong h from the throat", [["حب", "hubb", "사랑", "love"], ["مرحبا", "marhaba", "안녕", "hello"]]),
    arLetter("خ", "kha", "kh", { initial: "خـ", medial: "ـخـ", final: "ـخ" }, "거센 h/kh", "kh as in Bach", [["خبز", "khubz", "빵", "bread"], ["أخ", "akh", "형/남동생", "brother"]]),
    arLetter("د", "dal", "d", { initial: "د", medial: "ـد", final: "ـد" }, "d. 왼쪽에는 연결되지 않음", "d; does not connect to the left", [["دار", "dar", "집", "house"], ["يد", "yad", "손", "hand"]]),
    arLetter("ذ", "dhal", "dh (this)", { initial: "ذ", medial: "ـذ", final: "ـذ" }, "this의 th. 왼쪽 비연결", "th as in this; no left join", [["هذا", "hadha", "이것", "this"]]),
    arLetter("ر", "ra", "r", { initial: "ر", medial: "ـر", final: "ـر" }, "굴리는 r. 왼쪽 비연결", "rolled r; no left join", [["رجل", "rajul", "남자", "man"], ["برد", "bard", "추위", "cold"]]),
    arLetter("ز", "zay", "z", { initial: "ز", medial: "ـز", final: "ـز" }, "z. 왼쪽 비연결", "z; no left join", [["زيت", "zayt", "기름", "oil"]]),
    arLetter("س", "sin", "s", { initial: "سـ", medial: "ـسـ", final: "ـس" }, "s", "s", [["سلام", "salam", "평화/안녕", "peace / hello"], ["اسم", "ism", "이름", "name"]]),
    arLetter("ش", "shin", "sh", { initial: "شـ", medial: "ـشـ", final: "ـش" }, "sh", "sh", [["شمس", "shams", "해", "sun"], ["شكرا", "shukran", "고마워요", "thank you"]]),
    arLetter("ص", "sad", "s (emphatic)", { initial: "صـ", medial: "ـصـ", final: "ـص" }, "굵은 s", "emphatic s", [["صباح", "sabah", "아침", "morning"], ["قصة", "qissa", "이야기", "story"]]),
    arLetter("ض", "dad", "d (emphatic)", { initial: "ضـ", medial: "ـضـ", final: "ـض" }, "굵은 d", "emphatic d", [["رمضان", "ramadan", "라마단", "Ramadan"]]),
    arLetter("ط", "ta", "t (emphatic)", { initial: "طـ", medial: "ـطـ", final: "ـط" }, "굵은 t", "emphatic t", [["طالب", "talib", "학생", "student"]]),
    arLetter("ظ", "za", "dh (emphatic)", { initial: "ظـ", medial: "ـظـ", final: "ـظ" }, "굵은 dh", "emphatic dh", [["ظهر", "zuhr", "정오", "noon"]]),
    arLetter("ع", "ayn", "ʕ", { initial: "عـ", medial: "ـعـ", final: "ـع" }, "목구멍 막힘 소리", "voiced throat sound", [["عربي", "arabi", "아랍의", "Arabic"], ["نعم", "na'am", "네", "yes"]]),
    arLetter("غ", "ghayn", "gh", { initial: "غـ", medial: "ـغـ", final: "ـغ" }, "프랑스 r에 가까운 gh", "gh, like a voiced kh", [["غدا", "ghadan", "내일", "tomorrow"]]),
    arLetter("ف", "fa", "f", { initial: "فـ", medial: "ـفـ", final: "ـف" }, "f", "f", [["في", "fi", "~에", "in"], ["قهوة", "qahwa", "커피", "coffee"]]),
    arLetter("ق", "qaf", "q", { initial: "قـ", medial: "ـقـ", final: "ـق" }, "목 깊은 k", "deep k from the throat", [["قلب", "qalb", "마음", "heart"], ["قهوة", "qahwa", "커피", "coffee"]]),
    arLetter("ك", "kaf", "k", { initial: "كـ", medial: "ـكـ", final: "ـك" }, "k", "k", [["كتاب", "kitab", "책", "book"], ["كيف", "kayf", "어떻게", "how"]]),
    arLetter("ل", "lam", "l", { initial: "لـ", medial: "ـلـ", final: "ـل" }, "l", "l", [["لا", "la", "아니요", "no"], ["سلام", "salam", "안녕", "hello"]]),
    arLetter("م", "mim", "m", { initial: "مـ", medial: "ـمـ", final: "ـم" }, "m", "m", [["ماء", "ma'", "물", "water"], ["اسم", "ism", "이름", "name"]]),
    arLetter("ن", "nun", "n", { initial: "نـ", medial: "ـنـ", final: "ـن" }, "n", "n", [["نعم", "na'am", "네", "yes"], ["أنا", "ana", "나", "I"]]),
    arLetter("ه", "ha", "h", { initial: "هـ", medial: "ـهـ", final: "ـه" }, "가벼운 h", "light h", [["هذا", "hadha", "이것", "this"], ["قهوة", "qahwa", "커피", "coffee"]]),
    arLetter("و", "waw", "w / uu", { initial: "و", medial: "ـو", final: "ـو" }, "w 또는 긴 u. 왼쪽 비연결", "w or long u; no left join", [["ولد", "walad", "남자아이", "boy"], ["هو", "huwa", "그", "he"]]),
    arLetter("ي", "ya", "y / ii", { initial: "يـ", medial: "ـيـ", final: "ـي" }, "y 또는 긴 i", "y or long i", [["يد", "yad", "손", "hand"], ["في", "fi", "~에", "in"]]),
  ],
};
