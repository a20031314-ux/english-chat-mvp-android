import type { ScriptCourse } from "./types.ts";

/** 베트남어 글자·소리 기초(북부 표준어, 하노이 발음 기준). 성조 → 모음 → 자음 → 끝소리 → 겹모음 순서. */
export const VI_SCRIPT: ScriptCourse = {
  language: "vi",
  version: 1,
  title: { en: "Tones, vowels and spelling", ko: "성조·모음·철자 읽기" },
  groups: [
    {
      id: "vi-tone-1",
      title: { en: "The six tones", ko: "여섯 성조" },
      note: {
        en: "Every syllable has one tone, shown by a mark on the vowel. Change the tone and you get a different word.",
        ko: "음절마다 성조가 하나 있고 모음 위아래 기호로 표시한다. 성조가 바뀌면 다른 낱말이 된다.",
      },
      items: [
        { char: "ma", reading: "ma — level, mid pitch, no mark (ngang)", say: "ma", example: { word: "ba", meaning: { en: "three", ko: "셋" } } },
        { char: "má", reading: "má — rises high (sắc)", say: "má", example: { word: "cá", meaning: { en: "fish", ko: "물고기" } } },
        { char: "mà", reading: "mà — falls low and soft (huyền)", say: "mà", example: { word: "bà", meaning: { en: "grandmother", ko: "할머니" } } },
        { char: "mả", reading: "mả — dips then comes back up (hỏi)", say: "mả", example: { word: "hỏi", meaning: { en: "to ask", ko: "묻다" } } },
        { char: "mã", reading: "mã — rises with a catch in the middle (ngã)", say: "mã", example: { word: "sữa", meaning: { en: "milk", ko: "우유" } } },
        { char: "mạ", reading: "mạ — short, drops and stops sharply (nặng)", say: "mạ", example: { word: "mẹ", meaning: { en: "mother", ko: "엄마" } } },
      ],
    },
    {
      id: "vi-vowel-1",
      title: { en: "Basic vowels", ko: "기본 모음" },
      note: {
        en: "Each vowel letter keeps one sound. e is open (like 애), i and y sound the same.",
        ko: "모음 글자는 소리가 하나로 정해져 있다. e는 입을 벌린 '애', i와 y는 같은 '이'.",
      },
      items: [
        { char: "a", reading: "a (아)", say: "a", example: { word: "ba", meaning: { en: "three", ko: "셋" } } },
        { char: "e", reading: "e, open (애)", say: "em", example: { word: "em", meaning: { en: "younger sibling; you (to someone younger)", ko: "동생; 너(아랫사람에게)" } } },
        { char: "i / y", reading: "i (이)", say: "đi", example: { word: "đi", meaning: { en: "to go", ko: "가다" } } },
        { char: "o", reading: "o, open (어와 오 사이, like 'saw')", say: "to", example: { word: "to", meaning: { en: "big", ko: "크다" } } },
        { char: "u", reading: "u (우)", say: "bún", example: { word: "bún", meaning: { en: "rice noodles", ko: "쌀국수 면(분)" } } },
      ],
    },
    {
      id: "vi-vowel-2",
      title: { en: "Vowels with marks: ă â ê ô ơ ư", ko: "기호 붙은 모음: ă â ê ô ơ ư" },
      note: {
        en: "These marks change the vowel itself, not the tone. A word can carry both: ở has ơ plus the hỏi tone.",
        ko: "이 기호는 성조가 아니라 모음 자체를 바꾼다. 한 글자에 둘 다 붙기도 한다: ở = ơ + hỏi 성조.",
      },
      items: [
        { char: "ă", reading: "a, short (짧은 아)", say: "ăn", example: { word: "ăn", meaning: { en: "to eat", ko: "먹다" } } },
        { char: "â", reading: "uh, short (짧은 어)", say: "bận", example: { word: "bận", meaning: { en: "busy", ko: "바쁘다" } } },
        { char: "ê", reading: "e, closed (에)", say: "đêm", example: { word: "đêm", meaning: { en: "night", ko: "밤" } } },
        { char: "ô", reading: "o, closed (오)", say: "cô", example: { word: "cô", meaning: { en: "female teacher; aunt", ko: "여자 선생님; 고모" } } },
        { char: "ơ", reading: "uh, long (긴 어)", say: "cơm", example: { word: "cơm", meaning: { en: "cooked rice; meal", ko: "밥" } } },
        { char: "ư", reading: "eu, unrounded (으)", say: "thư", example: { word: "thư", meaning: { en: "letter (mail)", ko: "편지" } } },
      ],
    },
    {
      id: "vi-cons-1",
      title: { en: "Consonants, and đ vs d", ko: "자음, 그리고 đ와 d" },
      note: {
        en: "đ (with a bar) is a hard d. Plain d is not a d at all: in the north it sounds like z, the same as gi and r.",
        ko: "줄 그은 đ가 'ㄷ' 소리다. 그냥 d는 'ㄷ'이 아니라 북부에서 'z(ㅈ)' 소리로, gi·r과 같다.",
      },
      items: [
        { char: "đ", reading: "d, hard (ㄷ)", say: "đỏ", example: { word: "đỏ", meaning: { en: "red", ko: "빨갛다" } } },
        { char: "d", reading: "z (north; y in the south)", say: "dễ", example: { word: "dễ", meaning: { en: "easy", ko: "쉽다" } } },
        { char: "b", reading: "b (ㅂ, voiced)", say: "bố", example: { word: "bố", meaning: { en: "father", ko: "아빠" } } },
        { char: "c / k", reading: "k, no puff of air (ㄲ에 가까움); k before e, ê, i", say: "cà phê", example: { word: "cà phê", meaning: { en: "coffee", ko: "커피" } } },
        { char: "g / gh", reading: "g, soft and throaty; gh before e, ê, i", say: "ga", example: { word: "ga", meaning: { en: "train station", ko: "기차역" } } },
        { char: "h", reading: "h (ㅎ)", say: "hoa", example: { word: "hoa", meaning: { en: "flower", ko: "꽃" } } },
        { char: "l", reading: "l (ㄹ, tongue on teeth)", say: "làm", example: { word: "làm", meaning: { en: "to do; to work", ko: "하다; 일하다" } } },
        { char: "r", reading: "z (north; r in the south)", say: "rau", example: { word: "rau", meaning: { en: "vegetables", ko: "채소" } } },
        { char: "v", reading: "v (윗니를 아랫입술에)", say: "về", example: { word: "về", meaning: { en: "to go back home", ko: "돌아가다" } } },
      ],
    },
    {
      id: "vi-cons-2",
      title: { en: "Spellings that surprise", ko: "생각과 다른 철자" },
      note: {
        en: "t has no puff of air (ㄸ), th has one (ㅌ). In the north tr = ch, x = s, and gi = d = r (z).",
        ko: "t는 바람 없이 'ㄸ', th는 바람 있게 'ㅌ'. 북부에서는 tr = ch, x = s, gi = d = r(z)로 같다.",
      },
      items: [
        { char: "ph", reading: "f", say: "phở", example: { word: "phở", meaning: { en: "phở noodle soup", ko: "쌀국수(퍼)" } } },
        { char: "t", reading: "t, no puff of air (ㄸ)", say: "tôi", example: { word: "tôi", meaning: { en: "I, me", ko: "나, 저" } } },
        { char: "th", reading: "t with a puff of air (ㅌ)", say: "thích", example: { word: "thích", meaning: { en: "to like", ko: "좋아하다" } } },
        { char: "kh", reading: "kh, breathy (ㅋ를 목에서 긁듯)", say: "không", example: { word: "không", meaning: { en: "no; not", ko: "아니다; 안" } } },
        { char: "tr", reading: "ch (ㅉ) in the north", say: "trà", example: { word: "trà", meaning: { en: "tea", ko: "차" } } },
        { char: "ch", reading: "ch (ㅉ)", say: "chợ", example: { word: "chợ", meaning: { en: "market", ko: "시장" } } },
        { char: "nh", reading: "ny (냐·녀의 ㄴ)", say: "nhà", example: { word: "nhà", meaning: { en: "house; home", ko: "집" } } },
        { char: "ng / ngh", reading: "ng at the start (응); ngh before e, ê, i", say: "ngon", example: { word: "ngon", meaning: { en: "tasty", ko: "맛있다" } } },
        { char: "gi", reading: "z (ㅈ) in the north", say: "gì", example: { word: "gì", meaning: { en: "what", ko: "무엇" } } },
        { char: "x / s", reading: "s (ㅆ); the same in the north", say: "xe", example: { word: "xe", meaning: { en: "vehicle; motorbike", ko: "차; 오토바이" } } },
        { char: "qu", reading: "kw (꾸+아)", say: "quán", example: { word: "quán", meaning: { en: "small shop; eatery", ko: "가게; 식당" } } },
      ],
    },
    {
      id: "vi-final-1",
      title: { en: "Final consonants", ko: "끝소리(받침)" },
      note: {
        en: "Final c, t, p and ch are held, not released, like Korean 받침. A syllable ending in them takes only the sắc or nặng tone.",
        ko: "끝의 c·t·p·ch는 한국어 받침처럼 막고 터뜨리지 않는다. 이 끝소리로 끝나는 음절은 sắc이나 nặng 성조만 붙는다.",
      },
      items: [
        { char: "-c", reading: "-k (받침 ㄱ); after o, ô, u the lips close", say: "học", example: { word: "học", meaning: { en: "to study", ko: "공부하다" } } },
        { char: "-t", reading: "-t (받침 ㄷ)", say: "một", example: { word: "một", meaning: { en: "one", ko: "하나" } } },
        { char: "-p", reading: "-p (받침 ㅂ)", say: "đẹp", example: { word: "đẹp", meaning: { en: "beautiful", ko: "예쁘다" } } },
        { char: "-m", reading: "-m (받침 ㅁ)", say: "tám", example: { word: "tám", meaning: { en: "eight", ko: "여덟" } } },
        { char: "-n", reading: "-n (받침 ㄴ)", say: "bán", example: { word: "bán", meaning: { en: "to sell", ko: "팔다" } } },
        { char: "-ng", reading: "-ng (받침 ㅇ); after o, ô, u the lips close", say: "uống", example: { word: "uống", meaning: { en: "to drink", ko: "마시다" } } },
        { char: "-nh", reading: "-ng with an i glide (anh ≈ 아잉)", say: "anh", example: { word: "anh", meaning: { en: "older brother; you (to a man)", ko: "형·오빠; 당신(남자에게)" } } },
        { char: "-ch", reading: "-k with an i glide (ách ≈ 아익)", say: "sách", example: { word: "sách", meaning: { en: "book", ko: "책" } } },
      ],
    },
    {
      id: "vi-vowel-3",
      title: { en: "Vowel pairs", ko: "겹모음" },
      note: {
        en: "Glide from the first vowel to the second in one beat. ay is a short a + i, ai is a long a + i.",
        ko: "앞 모음에서 뒤 모음으로 한 박자에 미끄러진다. ay는 짧은 '아이', ai는 긴 '아-이'.",
      },
      items: [
        { char: "ai", reading: "aai (긴 아이)", say: "hai", example: { word: "hai", meaning: { en: "two", ko: "둘" } } },
        { char: "ay", reading: "ai, short (짧은 아이)", say: "tay", example: { word: "tay", meaning: { en: "hand", ko: "손" } } },
        { char: "ao", reading: "ao (아오)", say: "cao", example: { word: "cao", meaning: { en: "tall; high", ko: "높다; 키가 크다" } } },
        { char: "ây", reading: "uhi, short (어이)", say: "đây", example: { word: "đây", meaning: { en: "here", ko: "여기" } } },
        { char: "oi / ôi", reading: "oi (open 어이 / closed 오이)", say: "tối", example: { word: "tối", meaning: { en: "evening; dark", ko: "저녁; 어둡다" } } },
        { char: "ơi", reading: "uhi, long (긴 어이)", say: "chơi", example: { word: "chơi", meaning: { en: "to play; to hang out", ko: "놀다" } } },
        { char: "ui", reading: "ui (우이)", say: "vui", example: { word: "vui", meaning: { en: "happy; fun", ko: "기쁘다; 즐겁다" } } },
        { char: "ưa / ươ", reading: "eu-uh (으어)", say: "mưa", example: { word: "mưa", meaning: { en: "rain", ko: "비" } } },
        { char: "ia / iê", reading: "i-uh (이어)", say: "tiền", example: { word: "tiền", meaning: { en: "money", ko: "돈" } } },
        { char: "ua / uô", reading: "u-uh (우어)", say: "mua", example: { word: "mua", meaning: { en: "to buy", ko: "사다" } } },
      ],
    },
  ],
};
