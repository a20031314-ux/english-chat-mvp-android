import type { CharacterGuide, CharacterItem, LocalizedText } from "./types.ts";

function m(ko: string, en: string): LocalizedText {
  return { ko, en };
}

function jamo(
  character: string,
  name: string,
  pronunciation: string,
  category: "consonants" | "vowels",
  usageKo: string,
  usageEn: string,
  examples: Array<[string, string, string]>,
): CharacterItem {
  return {
    id: `ko-${category}-${character}`,
    character,
    speak: examples[0]?.[0] ?? character,
    reading: name,
    pronunciation,
    category,
    usage: m(usageKo, usageEn),
    examples: examples.map(([text, mko, men]) => ({
      text,
      meaning: m(mko, men),
    })),
  };
}

export const KO_GUIDE: CharacterGuide = {
  language: "ko",
  categories: [
    { id: "consonants", label: m("자음", "Consonants") },
    { id: "vowels", label: m("모음", "Vowels") },
  ],
  items: [
    jamo("ㄱ", "기역", "g/k", "consonants", "초성에서 g, 받침에서 k에 가깝게", "g at start, k-like at end", [["가다", "가다", "to go"], ["고기", "고기", "meat"]]),
    jamo("ㄴ", "니은", "n", "consonants", "n 소리", "n sound", [["나", "나", "I"], ["눈", "눈", "eye / snow"]]),
    jamo("ㄷ", "디귿", "d/t", "consonants", "초성 d, 받침 t에 가깝게", "d at start, t-like at end", [["다리", "다리", "leg / bridge"], ["먹다", "먹다", "to eat"]]),
    jamo("ㄹ", "리을", "r/l", "consonants", "초성 r, 받침 l에 가깝게", "r-like start, l-like end", [["라면", "라면", "ramen"], ["말", "말", "horse / speech"]]),
    jamo("ㅁ", "미음", "m", "consonants", "m 소리", "m sound", [["마음", "마음", "heart"], ["몸", "몸", "body"]]),
    jamo("ㅂ", "비읍", "b/p", "consonants", "초성 b, 받침 p에 가깝게", "b at start, p-like at end", [["밥", "밥", "rice"], ["보다", "보다", "to see"]]),
    jamo("ㅅ", "시옷", "s", "consonants", "s 소리. 이 앞에서는 shi에 가깝게", "s; before i often shi", [["사람", "사람", "person"], ["시간", "시간", "time"]]),
    jamo("ㅇ", "이응", "ng / silent", "consonants", "초성에서는 소리 없음, 받침에서는 ng", "silent at start, ng at end", [["아이", "아이", "child"], ["강", "강", "river"]]),
    jamo("ㅈ", "지읒", "j", "consonants", "j 소리", "j sound", [["자다", "자다", "to sleep"], ["집", "집", "house"]]),
    jamo("ㅊ", "치읓", "ch", "consonants", "거센 j/ch", "aspirated ch", [["차", "차", "tea / car"], ["친구", "친구", "friend"]]),
    jamo("ㅋ", "키읔", "k", "consonants", "거센 k", "aspirated k", [["코", "코", "nose"], ["키", "키", "height"]]),
    jamo("ㅌ", "티읕", "t", "consonants", "거센 t", "aspirated t", [["타다", "타다", "to ride"], ["토끼", "토끼", "rabbit"]]),
    jamo("ㅍ", "피읖", "p", "consonants", "거센 p", "aspirated p", [["파", "파", "green onion"], ["포도", "포도", "grape"]]),
    jamo("ㅎ", "히읗", "h", "consonants", "h 소리", "h sound", [["하늘", "하늘", "sky"], ["하나", "하나", "one"]]),
    jamo("ㅏ", "아", "a", "vowels", "아", "open a as in father", [["가", "가", "go"], ["하나", "하나", "one"]]),
    jamo("ㅑ", "야", "ya", "vowels", "야", "ya", [["야", "야", "hey"], ["이야기", "이야기", "story"]]),
    jamo("ㅓ", "어", "eo", "vowels", "어 (입 조금 벌림)", "eo, like uh", [["서다", "서다", "to stand"], ["어디", "어디", "where"]]),
    jamo("ㅕ", "여", "yeo", "vowels", "여", "yeo", [["여자", "여자", "woman"], ["여기", "여기", "here"]]),
    jamo("ㅗ", "오", "o", "vowels", "오", "o", [["오다", "오다", "to come"], ["모자", "모자", "hat"]]),
    jamo("ㅛ", "요", "yo", "vowels", "요", "yo", [["요리", "요리", "cooking"], ["교실", "교실", "classroom"]]),
    jamo("ㅜ", "우", "u", "vowels", "우", "u as in food", [["우리", "우리", "we"], ["구름", "구름", "cloud"]]),
    jamo("ㅠ", "유", "yu", "vowels", "유", "yu", [["유리", "유리", "glass"], ["우유", "우유", "milk"]]),
    jamo("ㅡ", "으", "eu", "vowels", "으 (입 옆으로)", "eu, unrounded", [["그", "그", "he / that"], ["크다", "크다", "big"]]),
    jamo("ㅣ", "이", "i", "vowels", "이", "i as in see", [["이", "이 / 이빨", "this / teeth"], ["시간", "시간", "time"]]),
  ],
};
