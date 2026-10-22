import type { ScriptCourse } from "./types.ts";

/** 이탈리아어 철자와 발음 — 글자 그대로 읽는 언어라 몇 가지 규칙만 익히면 거의 다 읽힌다. */
export const IT_SCRIPT: ScriptCourse = {
  language: "it",
  version: 1,
  title: { en: "Italian spelling and sounds", ko: "이탈리아어 철자와 발음" },
  groups: [
    {
      id: "it-vowel-1",
      title: { en: "The five vowels", ko: "모음 다섯 개" },
      note: {
        en: "Each vowel always keeps its own clear sound, and every vowel is pronounced, even at the end of a word.",
        ko: "모음은 늘 같은 소리로 또렷하게, 낱말 끝 모음까지 빠짐없이 소리 낸다.",
      },
      items: [
        { char: "a", reading: "a", say: "a", example: { word: "amico", meaning: { en: "friend", ko: "친구" } } },
        { char: "e", reading: "e", say: "e", example: { word: "bene", meaning: { en: "well, good", ko: "잘, 좋게" } } },
        { char: "i", reading: "i", say: "i", example: { word: "vino", meaning: { en: "wine", ko: "와인" } } },
        { char: "o", reading: "o", say: "o", example: { word: "nome", meaning: { en: "name", ko: "이름" } } },
        { char: "u", reading: "u", say: "u", example: { word: "uno", meaning: { en: "one", ko: "하나" } } },
        { char: "ie / uo", reading: "ye / wo", say: "uomo", example: { word: "uomo", meaning: { en: "man", ko: "남자" } } },
      ],
    },
    {
      id: "it-c-1",
      title: { en: "c: hard and soft", ko: "c: 단단한 소리와 부드러운 소리" },
      note: {
        en: "c sounds like k before a, o, u and h, and like ch (as in church) before e and i.",
        ko: "c는 a·o·u·h 앞에서 k(ㅋ), e·i 앞에서 ch(ㅊ) 소리.",
      },
      items: [
        { char: "ca", reading: "ka", say: "ca", example: { word: "casa", meaning: { en: "house", ko: "집" } } },
        { char: "co", reading: "ko", say: "co", example: { word: "cosa", meaning: { en: "thing, what", ko: "것, 무엇" } } },
        { char: "cu", reading: "ku", say: "cu", example: { word: "cucina", meaning: { en: "kitchen", ko: "부엌" } } },
        { char: "ce", reading: "che", say: "ce", example: { word: "cena", meaning: { en: "dinner", ko: "저녁 식사" } } },
        { char: "ci", reading: "chi", say: "ci", example: { word: "cinema", meaning: { en: "cinema", ko: "영화관" } } },
        { char: "cia / cio / ciu", reading: "cha / cho / chu", say: "ciao", example: { word: "ciao", meaning: { en: "hi, bye", ko: "안녕" } } },
        { char: "che", reading: "ke", say: "che", example: { word: "anche", meaning: { en: "also", ko: "~도, 또한" } } },
        { char: "chi", reading: "ki", say: "chi", example: { word: "chiave", meaning: { en: "key", ko: "열쇠" } } },
        { char: "qu", reading: "kw", say: "quando", example: { word: "quattro", meaning: { en: "four", ko: "넷" } } },
      ],
    },
    {
      id: "it-g-1",
      title: { en: "g: hard and soft", ko: "g: 단단한 소리와 부드러운 소리" },
      note: {
        en: "g sounds like g in go before a, o, u and h, and like j in jam before e and i.",
        ko: "g는 a·o·u·h 앞에서 g(ㄱ), e·i 앞에서 j(ㅈ) 소리.",
      },
      items: [
        { char: "ga", reading: "ga", say: "ga", example: { word: "gatto", meaning: { en: "cat", ko: "고양이" } } },
        { char: "go", reading: "go", say: "go", example: { word: "gonna", meaning: { en: "skirt", ko: "치마" } } },
        { char: "gu", reading: "gu", say: "gu", example: { word: "gusto", meaning: { en: "taste, flavour", ko: "맛" } } },
        { char: "ge", reading: "je", say: "ge", example: { word: "gelato", meaning: { en: "ice cream", ko: "아이스크림" } } },
        { char: "gi", reading: "ji", say: "gi", example: { word: "gita", meaning: { en: "trip, outing", ko: "소풍, 나들이" } } },
        { char: "gia / gio / giu", reading: "ja / jo / ju", say: "giorno", example: { word: "giorno", meaning: { en: "day", ko: "날, 하루" } } },
        { char: "ghe", reading: "ge", say: "ghe", example: { word: "spaghetti", meaning: { en: "spaghetti", ko: "스파게티" } } },
        { char: "ghi", reading: "gi", say: "ghi", example: { word: "ghiaccio", meaning: { en: "ice", ko: "얼음" } } },
      ],
    },
    {
      id: "it-h-1",
      title: { en: "h is silent", ko: "h는 소리가 없다" },
      note: {
        en: "h is never pronounced: ho sounds exactly like o, and hanno like anno. It only changes c and g (che, ghi).",
        ko: "h는 소리 내지 않는다: ho는 o, hanno는 anno와 똑같이 들린다. c·g 뒤에서 소리를 바꾸는 일만 한다(che, ghi).",
      },
      items: [
        { char: "ho", reading: "o", say: "ho", example: { word: "ho fame", meaning: { en: "I'm hungry", ko: "배고파요" } } },
        { char: "hai", reading: "ai", say: "hai", example: { word: "hai tempo", meaning: { en: "do you have time", ko: "시간 있어?" } } },
        { char: "ha", reading: "a", say: "ha", example: { word: "ha ragione", meaning: { en: "he/she is right", ko: "그 사람 말이 맞아요" } } },
        { char: "hanno", reading: "an-no", say: "hanno", example: { word: "hanno sete", meaning: { en: "they are thirsty", ko: "그들은 목말라요" } } },
        { char: "hotel", reading: "o-tel", say: "hotel", example: { word: "hotel", meaning: { en: "hotel", ko: "호텔" } } },
      ],
    },
    {
      id: "it-double-1",
      title: { en: "Double consonants", ko: "겹자음" },
      note: {
        en: "A double consonant is held longer, with a small pause before it; it can change the meaning of a word.",
        ko: "겹자음은 앞에서 살짝 멈췄다가 길게 낸다(받침처럼). 뜻이 달라지기도 한다.",
      },
      items: [
        { char: "pala / palla", reading: "pa-la / pal-la", say: "palla", example: { word: "palla", meaning: { en: "ball", ko: "공" } } },
        { char: "sete / sette", reading: "se-te / set-te", say: "sette", example: { word: "sette", meaning: { en: "seven", ko: "일곱" } } },
        { char: "nono / nonno", reading: "no-no / non-no", say: "nonno", example: { word: "nonno", meaning: { en: "grandfather", ko: "할아버지" } } },
        { char: "caro / carro", reading: "ka-ro / kar-ro", say: "carro", example: { word: "caro", meaning: { en: "dear, expensive", ko: "소중한, 비싼" } } },
        { char: "fato / fatto", reading: "fa-to / fat-to", say: "fatto", example: { word: "fatto", meaning: { en: "done, fact", ko: "한, 사실" } } },
        { char: "capello / cappello", reading: "ka-pel-lo / kap-pel-lo", say: "cappello", example: { word: "cappello", meaning: { en: "hat", ko: "모자" } } },
        { char: "mm", reading: "mm (long m)", say: "mamma", example: { word: "mamma", meaning: { en: "mum", ko: "엄마" } } },
      ],
    },
    {
      id: "it-gn-1",
      title: { en: "gn and gli", ko: "gn과 gli" },
      note: {
        en: "gn sounds like ny (as in canyon) and gli like a soft lly; both are a little long between vowels.",
        ko: "gn은 '니'(냐·뇨)처럼, gli는 혀를 넓게 붙인 '리'(ㄹ리)처럼. 모음 사이에서는 조금 길게.",
      },
      items: [
        { char: "gn", reading: "ny", say: "gnocchi", example: { word: "gnocchi", meaning: { en: "gnocchi (potato dumplings)", ko: "뇨키(감자 반죽 요리)" } } },
        { char: "gna", reading: "nya", say: "lasagna", example: { word: "lasagna", meaning: { en: "lasagna", ko: "라자냐" } } },
        { char: "gno", reading: "nyo", say: "bagno", example: { word: "bagno", meaning: { en: "bathroom", ko: "화장실, 욕실" } } },
        { char: "gni", reading: "nyi", say: "ogni", example: { word: "ogni giorno", meaning: { en: "every day", ko: "매일" } } },
        { char: "gli", reading: "lyi", say: "figli", example: { word: "figli", meaning: { en: "children (sons and daughters)", ko: "자녀들" } } },
        { char: "glia", reading: "lya", say: "famiglia", example: { word: "famiglia", meaning: { en: "family", ko: "가족" } } },
        { char: "glio", reading: "lyo", say: "luglio", example: { word: "luglio", meaning: { en: "July", ko: "7월" } } },
      ],
    },
    {
      id: "it-sc-1",
      title: { en: "sc: sk or sh", ko: "sc: sk 소리와 sh 소리" },
      note: {
        en: "sc is sk before a, o, u and h, and sh (as in shoe) before e and i.",
        ko: "sc는 a·o·u·h 앞에서 sk(스ㅋ), e·i 앞에서 sh(쉬) 소리.",
      },
      items: [
        { char: "sca", reading: "ska", say: "scarpa", example: { word: "scarpa", meaning: { en: "shoe", ko: "신발" } } },
        { char: "sco", reading: "sko", say: "sconto", example: { word: "sconto", meaning: { en: "discount", ko: "할인" } } },
        { char: "scu", reading: "sku", say: "scuola", example: { word: "scuola", meaning: { en: "school", ko: "학교" } } },
        { char: "sce", reading: "she", say: "pesce", example: { word: "pesce", meaning: { en: "fish", ko: "생선, 물고기" } } },
        { char: "sci", reading: "shi", say: "piscina", example: { word: "piscina", meaning: { en: "swimming pool", ko: "수영장" } } },
        { char: "scia / scio", reading: "sha / sho", say: "sciarpa", example: { word: "sciarpa", meaning: { en: "scarf", ko: "목도리" } } },
        { char: "sche", reading: "ske", say: "scherzo", example: { word: "scherzo", meaning: { en: "joke", ko: "농담" } } },
        { char: "schi", reading: "ski", say: "schiena", example: { word: "schiena", meaning: { en: "back (body)", ko: "등" } } },
      ],
    },
    {
      id: "it-z-1",
      title: { en: "z, s and r", ko: "z, s, r" },
      note: {
        en: "z is ts or dz, never a plain z; r is always a tapped or rolled r with the tongue tip.",
        ko: "z는 ts(ㅊ에 가까움) 또는 dz(ㅈ에 가까움), r은 늘 혀끝을 튕기거나 굴리는 소리.",
      },
      items: [
        { char: "z (ts)", reading: "ts", say: "grazie", example: { word: "grazie", meaning: { en: "thank you", ko: "고마워요" } } },
        { char: "z (dz)", reading: "dz", say: "zero", example: { word: "zero", meaning: { en: "zero", ko: "영" } } },
        { char: "zz", reading: "tts", say: "pizza", example: { word: "pizza", meaning: { en: "pizza", ko: "피자" } } },
        { char: "s", reading: "s", say: "sole", example: { word: "sole", meaning: { en: "sun", ko: "해" } } },
        { char: "ss", reading: "ss", say: "rosso", example: { word: "rosso", meaning: { en: "red", ko: "빨간" } } },
        { char: "r", reading: "r (tapped)", say: "Roma", example: { word: "Roma", meaning: { en: "Rome", ko: "로마" } } },
        { char: "rr", reading: "rr (rolled)", say: "terra", example: { word: "terra", meaning: { en: "earth, ground", ko: "땅" } } },
      ],
    },
    {
      id: "it-stress-1",
      title: { en: "Stress and accent marks", ko: "강세와 강세 부호" },
      note: {
        en: "Most words stress the second-to-last syllable; a written accent (à è é ì ò ù) marks a stressed last syllable or tells two words apart.",
        ko: "대부분 끝에서 두 번째 음절에 강세. 부호(à è é ì ò ù)가 있으면 그 마지막 음절에 강세가 오거나, 같은 철자의 다른 낱말을 구별한다.",
      },
      items: [
        { char: "casa", reading: "KA-sa", say: "casa", example: { word: "casa", meaning: { en: "house", ko: "집" } } },
        { char: "città", reading: "chit-TA", say: "città", example: { word: "città", meaning: { en: "city", ko: "도시" } } },
        { char: "caffè", reading: "kaf-FE", say: "caffè", example: { word: "caffè", meaning: { en: "coffee", ko: "커피" } } },
        { char: "perché", reading: "per-KE", say: "perché", example: { word: "perché", meaning: { en: "why, because", ko: "왜, 왜냐하면" } } },
        { char: "più", reading: "PYU", say: "più", example: { word: "di più", meaning: { en: "more", ko: "더" } } },
        { char: "è / e", reading: "eh (is) / e (and)", say: "è", example: { word: "è bello", meaning: { en: "it's nice (è = is, e = and)", ko: "멋져요 (è = ~이다, e = 그리고)" } } },
        { char: "telefono", reading: "te-LE-fo-no", say: "telefono", example: { word: "telefono", meaning: { en: "telephone", ko: "전화" } } },
        { char: "macchina", reading: "MAK-ki-na", say: "macchina", example: { word: "macchina", meaning: { en: "car", ko: "자동차" } } },
      ],
    },
  ],
};
