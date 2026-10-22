import type { ScriptCourse } from "./types.ts";

/** 영어 철자-발음 규칙(파닉스) — 라틴 문자는 아는 한국어 사용자 기준. 낱말 하나로 소리를 들려준다. */
export const EN_SCRIPT: ScriptCourse = {
  language: "en",
  version: 1,
  title: { en: "Spelling and sounds (phonics)", ko: "철자와 소리(파닉스)" },
  groups: [
    {
      id: "en-short-1",
      title: { en: "Short vowels", ko: "짧은 모음" },
      note: {
        en: "One vowel between consonants is usually short: c-a-t.",
        ko: "자음 사이에 모음 하나면 보통 짧게 읽어요: c-a-t.",
      },
      items: [
        { char: "a", reading: "a as in cat (open 'ae')", say: "cat", example: { word: "cat", meaning: { en: "cat", ko: "고양이" } } },
        { char: "e", reading: "e as in bed", say: "bed", example: { word: "bed", meaning: { en: "bed", ko: "침대" } } },
        { char: "i", reading: "i as in sit (short, relaxed 'i')", say: "sit", example: { word: "sit", meaning: { en: "to sit", ko: "앉다" } } },
        { char: "o", reading: "o as in hot (open 'ah')", say: "hot", example: { word: "hot", meaning: { en: "hot", ko: "뜨거운" } } },
        { char: "u", reading: "u as in cup (short 'uh')", say: "cup", example: { word: "cup", meaning: { en: "cup", ko: "컵" } } },
      ],
    },
    {
      id: "en-long-2",
      title: { en: "Long vowels and silent e", ko: "긴 모음과 소리 없는 e" },
      note: {
        en: "A final e is silent and makes the vowel before it say its name: cap → cape.",
        ko: "끝의 e는 소리가 없고 앞 모음을 알파벳 이름대로 읽게 해요: cap → cape.",
      },
      items: [
        { char: "a_e", reading: "ay as in cake", say: "cake", example: { word: "cake", meaning: { en: "cake", ko: "케이크" } } },
        { char: "i_e", reading: "eye as in bike", say: "bike", example: { word: "bike", meaning: { en: "bicycle", ko: "자전거" } } },
        { char: "o_e", reading: "oh as in home", say: "home", example: { word: "home", meaning: { en: "home", ko: "집" } } },
        { char: "u_e", reading: "you as in cute", say: "cute", example: { word: "cute", meaning: { en: "cute", ko: "귀여운" } } },
        { char: "e_e", reading: "ee as in these", say: "these", example: { word: "these", meaning: { en: "these", ko: "이것들" } } },
        { char: "-y", reading: "eye at the end of a short word, as in my", say: "my", example: { word: "my", meaning: { en: "my", ko: "나의" } } },
      ],
    },
    {
      id: "en-team-3",
      title: { en: "Vowel teams", ko: "모음 두 개가 한 소리" },
      note: {
        en: "Two vowels together often make one sound. ow can also be 'oh' (snow).",
        ko: "모음 두 개가 붙으면 보통 한 소리예요. ow는 'oh'로도 읽어요(snow).",
      },
      items: [
        { char: "ee", reading: "long ee as in see", say: "see", example: { word: "see", meaning: { en: "to see", ko: "보다" } } },
        { char: "ea", reading: "long ee as in eat", say: "eat", example: { word: "eat", meaning: { en: "to eat", ko: "먹다" } } },
        { char: "ai", reading: "ay as in rain", say: "rain", example: { word: "rain", meaning: { en: "rain", ko: "비" } } },
        { char: "ay", reading: "ay at the end, as in day", say: "day", example: { word: "day", meaning: { en: "day", ko: "날, 하루" } } },
        { char: "oa", reading: "oh as in boat", say: "boat", example: { word: "boat", meaning: { en: "boat", ko: "배" } } },
        { char: "oo", reading: "long oo as in moon", say: "moon", example: { word: "moon", meaning: { en: "moon", ko: "달" } } },
        { char: "ou", reading: "ow as in out", say: "out", example: { word: "out", meaning: { en: "out", ko: "밖으로" } } },
        { char: "ow", reading: "ow as in cow", say: "cow", example: { word: "cow", meaning: { en: "cow", ko: "소" } } },
        { char: "oy", reading: "oy as in boy", say: "boy", example: { word: "boy", meaning: { en: "boy", ko: "소년" } } },
      ],
    },
    {
      id: "en-rl-4",
      title: { en: "r and l", ko: "r과 l" },
      note: {
        en: "r: tongue curls back and touches nothing. l: tongue tip presses behind the top teeth.",
        ko: "r은 혀를 뒤로 말고 아무 데도 닿지 않게, l은 혀끝을 윗니 뒤에 붙여요.",
      },
      items: [
        { char: "r", reading: "r as in red (tongue does not touch)", say: "red", example: { word: "red", meaning: { en: "red", ko: "빨간" } } },
        { char: "l", reading: "l as in light (tongue tip up)", say: "light", example: { word: "light", meaning: { en: "light", ko: "빛, 불" } } },
        { char: "pr", reading: "p + r as in pray", say: "pray", example: { word: "pray", meaning: { en: "to pray", ko: "기도하다" } } },
        { char: "pl", reading: "p + l as in play", say: "play", example: { word: "play", meaning: { en: "to play", ko: "놀다" } } },
        { char: "fr", reading: "f + r as in fry", say: "fry", example: { word: "fry", meaning: { en: "to fry", ko: "튀기다" } } },
        { char: "fl", reading: "f + l as in fly", say: "fly", example: { word: "fly", meaning: { en: "to fly", ko: "날다" } } },
        { char: "-ll", reading: "dark l at the end, as in ball", say: "ball", example: { word: "ball", meaning: { en: "ball", ko: "공" } } },
        { char: "wr", reading: "r (w is silent) as in write", say: "write", example: { word: "write", meaning: { en: "to write", ko: "쓰다" } } },
      ],
    },
    {
      id: "en-fvz-5",
      title: { en: "f, p, v, b, z, j", ko: "f·p·v·b·z·j" },
      note: {
        en: "f and v: top teeth on the lower lip. p and b: both lips close. z buzzes; j starts like 'dj'.",
        ko: "f·v는 윗니를 아랫입술에, p·b는 두 입술을 붙여요. z는 '즈' 하고 떨리는 소리, j는 '쥐'처럼 시작해요.",
      },
      items: [
        { char: "f", reading: "f as in fan (teeth on lip, air)", say: "fan", example: { word: "fan", meaning: { en: "fan", ko: "선풍기, 팬" } } },
        { char: "p", reading: "p as in pan (lips pop)", say: "pan", example: { word: "pan", meaning: { en: "pan", ko: "프라이팬" } } },
        { char: "v", reading: "v as in van (teeth on lip, voice)", say: "van", example: { word: "van", meaning: { en: "van", ko: "승합차" } } },
        { char: "b", reading: "b as in bat (lips, voice)", say: "bat", example: { word: "bat", meaning: { en: "bat", ko: "방망이, 박쥐" } } },
        { char: "z", reading: "z as in zoo (buzzing s)", say: "zoo", example: { word: "zoo", meaning: { en: "zoo", ko: "동물원" } } },
        { char: "j", reading: "j as in jam ('dj')", say: "jam", example: { word: "jam", meaning: { en: "jam", ko: "잼" } } },
      ],
    },
    {
      id: "en-digraph-6",
      title: { en: "Two letters, one sound", ko: "두 글자가 한 소리" },
      note: {
        en: "For th, put the tongue tip between the teeth: breath only in think, voice in this.",
        ko: "th는 혀끝을 이 사이에: think는 바람만, this는 목소리를 내요.",
      },
      items: [
        { char: "sh", reading: "sh as in ship", say: "ship", example: { word: "ship", meaning: { en: "ship", ko: "배" } } },
        { char: "ch", reading: "ch as in chair", say: "chair", example: { word: "chair", meaning: { en: "chair", ko: "의자" } } },
        { char: "th", reading: "th as in think (breath only)", say: "think", example: { word: "think", meaning: { en: "to think", ko: "생각하다" } } },
        { char: "th (voiced)", reading: "th as in this (with voice)", say: "this", example: { word: "this", meaning: { en: "this", ko: "이것" } } },
        { char: "ph", reading: "f as in phone", say: "phone", example: { word: "phone", meaning: { en: "phone", ko: "전화" } } },
        { char: "wh", reading: "w as in white", say: "white", example: { word: "white", meaning: { en: "white", ko: "하얀" } } },
        { char: "ng", reading: "ng as in ring (no g sound after)", say: "ring", example: { word: "ring", meaning: { en: "ring", ko: "반지" } } },
        { char: "ck", reading: "k as in duck", say: "duck", example: { word: "duck", meaning: { en: "duck", ko: "오리" } } },
        { char: "kn", reading: "n (k is silent) as in know", say: "know", example: { word: "know", meaning: { en: "to know", ko: "알다" } } },
      ],
    },
    {
      id: "en-rvowel-7",
      title: { en: "Vowel + r", ko: "모음 + r" },
      note: {
        en: "er, ir and ur sound the same: 'er' as in her.",
        ko: "er·ir·ur은 모두 같은 소리예요: her의 'er'.",
      },
      items: [
        { char: "ar", reading: "ar as in car", say: "car", example: { word: "car", meaning: { en: "car", ko: "자동차" } } },
        { char: "or", reading: "or as in fork", say: "fork", example: { word: "fork", meaning: { en: "fork", ko: "포크" } } },
        { char: "er", reading: "er as in her", say: "her", example: { word: "her", meaning: { en: "her", ko: "그녀" } } },
        { char: "ir", reading: "er as in bird", say: "bird", example: { word: "bird", meaning: { en: "bird", ko: "새" } } },
        { char: "ur", reading: "er as in turn", say: "turn", example: { word: "turn", meaning: { en: "to turn", ko: "돌다" } } },
        { char: "air", reading: "air as in hair", say: "hair", example: { word: "hair", meaning: { en: "hair", ko: "머리카락" } } },
      ],
    },
    {
      id: "en-ending-8",
      title: { en: "-ed and -s endings", ko: "-ed와 -s 끝소리" },
      note: {
        en: "-ed adds a syllable only after t or d (wanted). Do not add a vowel after the end sound.",
        ko: "-ed는 t·d 뒤에서만 한 음절이 늘어요(wanted). 끝소리 뒤에 '으'를 붙이지 마세요.",
      },
      items: [
        { char: "-ed (t)", reading: "t at the end, as in walked", say: "walked", example: { word: "walked", meaning: { en: "walked", ko: "걸었다" } } },
        { char: "-ed (d)", reading: "d at the end, as in played", say: "played", example: { word: "played", meaning: { en: "played", ko: "놀았다" } } },
        { char: "-ed (id)", reading: "id, an extra syllable, as in wanted", say: "wanted", example: { word: "wanted", meaning: { en: "wanted", ko: "원했다" } } },
        { char: "-s (s)", reading: "s at the end, as in cats", say: "cats", example: { word: "cats", meaning: { en: "cats", ko: "고양이들" } } },
        { char: "-s (z)", reading: "z at the end, as in dogs", say: "dogs", example: { word: "dogs", meaning: { en: "dogs", ko: "개들" } } },
        { char: "-es (iz)", reading: "iz, an extra syllable, as in buses", say: "buses", example: { word: "buses", meaning: { en: "buses", ko: "버스들" } } },
      ],
    },
    {
      id: "en-stress-9",
      title: { en: "Word stress", ko: "낱말 강세" },
      note: {
        en: "Say the stressed syllable longer and louder; the others get weaker, often 'uh'.",
        ko: "강세 음절은 길고 크게, 나머지는 약하게(흔히 '어')로 읽어요.",
      },
      items: [
        { char: "TA·ble", reading: "stress on 1st: TAY-bul", say: "table", example: { word: "table", meaning: { en: "table", ko: "탁자" } } },
        { char: "PHO·to", reading: "stress on 1st: FOH-toh", say: "photo", example: { word: "photo", meaning: { en: "photo", ko: "사진" } } },
        { char: "ho·TEL", reading: "stress on 2nd: hoh-TEL", say: "hotel", example: { word: "hotel", meaning: { en: "hotel", ko: "호텔" } } },
        { char: "ba·NA·na", reading: "stress on 2nd: buh-NA-nuh", say: "banana", example: { word: "banana", meaning: { en: "banana", ko: "바나나" } } },
        { char: "com·PU·ter", reading: "stress on 2nd: kum-PYOO-ter", say: "computer", example: { word: "computer", meaning: { en: "computer", ko: "컴퓨터" } } },
        { char: "CHOC·o·late", reading: "stress on 1st, 2 syllables: CHOK-lit", say: "chocolate", example: { word: "chocolate", meaning: { en: "chocolate", ko: "초콜릿" } } },
        { char: "pho·TOG·ra·pher", reading: "stress on 2nd: fuh-TOG-ruh-fer", say: "photographer", example: { word: "photographer", meaning: { en: "photographer", ko: "사진작가" } } },
      ],
    },
  ],
};
