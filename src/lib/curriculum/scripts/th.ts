import type { ScriptCourse } from "./types.ts";

/**
 * 태국 문자 기초. 자주 쓰는 자음을 성조 규칙의 바탕인 세 무리(중자음·고자음·저자음)로 익히고,
 * 자음 앞·위·아래·뒤에 붙는 모음(짧은·긴), 끝소리(받침), 다섯 성조, 성조 기호 ่ ้ 순서로 간다.
 * 자음 하나는 TTS가 잘 못 읽어서 say는 글자 이름("ก ไก่"), 모음은 อ를 받친 꼴, 나머지는 짧은 낱말.
 */
export const TH_SCRIPT: ScriptCourse = {
  language: "th",
  version: 1,
  title: { en: "Thai letters and tones", ko: "태국 문자와 성조" },
  groups: [
    {
      id: "th-mid-1",
      title: { en: "Mid-class consonants (ก จ ด ต บ ป อ)", ko: "중자음 (ก จ ด ต บ ป อ)" },
      note: {
        en: "Each letter has a name word (ก ไก่ = \"k as in chicken\"). ก ต ป have no puff of air, like Korean ㄲ ㄸ ㅃ; อ is a silent holder for vowels.",
        ko: "글자마다 이름 낱말이 있다(ก ไก่ = '닭의 k'). ก ต ป는 숨 없이 ㄲ ㄸ ㅃ처럼, อ는 소리 없이 모음을 받치는 글자.",
      },
      items: [
        { char: "ก", reading: "k (ko kai)", say: "ก ไก่", example: { word: "กิน", meaning: { en: "to eat", ko: "먹다" } } },
        { char: "จ", reading: "ch / j (cho chan)", say: "จ จาน", example: { word: "จาน", meaning: { en: "plate", ko: "접시" } } },
        { char: "ด", reading: "d (do dek)", say: "ด เด็ก", example: { word: "ดี", meaning: { en: "good", ko: "좋다" } } },
        { char: "ต", reading: "t (to tao)", say: "ต เต่า", example: { word: "ตา", meaning: { en: "eye", ko: "눈" } } },
        { char: "บ", reading: "b (bo baimai)", say: "บ ใบไม้", example: { word: "บ้าน", meaning: { en: "house", ko: "집" } } },
        { char: "ป", reading: "p (po pla)", say: "ป ปลา", example: { word: "ปลา", meaning: { en: "fish", ko: "물고기" } } },
        { char: "อ", reading: "silent / o (o ang)", say: "อ อ่าง", example: { word: "อาหาร", meaning: { en: "food", ko: "음식" } } },
      ],
    },
    {
      id: "th-high-2",
      title: { en: "High-class consonants (ข ฉ ถ ผ ฝ ส ห)", ko: "고자음 (ข ฉ ถ ผ ฝ ส ห)" },
      note: {
        en: "kh, th, ph are k, t, p with a puff of air, like Korean ㅋ ㅌ ㅍ — not English \"th\" or \"f\".",
        ko: "kh·th·ph는 숨을 내는 ㅋ·ㅌ·ㅍ 소리다 — 영어 th나 f가 아니다.",
      },
      items: [
        { char: "ข", reading: "kh (kho khai)", say: "ข ไข่", example: { word: "ขาว", meaning: { en: "white", ko: "하얗다" } } },
        { char: "ฉ", reading: "ch (cho ching)", say: "ฉ ฉิ่ง", example: { word: "ฉัน", meaning: { en: "I (me)", ko: "나" } } },
        { char: "ถ", reading: "th (tho thung)", say: "ถ ถุง", example: { word: "ถูก", meaning: { en: "cheap", ko: "싸다" } } },
        { char: "ผ", reading: "ph (pho phueng)", say: "ผ ผึ้ง", example: { word: "ผม", meaning: { en: "I (male speaker); hair", ko: "저(남자); 머리카락" } } },
        { char: "ฝ", reading: "f (fo fa)", say: "ฝ ฝา", example: { word: "ฝน", meaning: { en: "rain", ko: "비" } } },
        { char: "ส", reading: "s (so suea)", say: "ส เสือ", example: { word: "สวย", meaning: { en: "beautiful", ko: "예쁘다" } } },
        { char: "ห", reading: "h (ho hip)", say: "ห หีบ", example: { word: "หัว", meaning: { en: "head", ko: "머리" } } },
      ],
    },
    {
      id: "th-low-3",
      title: { en: "Low-class consonants with a high partner (ค ช ท พ ฟ)", ko: "짝이 있는 저자음 (ค ช ท พ ฟ)" },
      note: {
        en: "These sound the same as a high-class letter (ค = ข, ท = ถ, พ = ผ, ฟ = ฝ, ช ≈ ฉ); only the tone rules differ.",
        ko: "고자음과 소리가 같다(ค = ข, ท = ถ, พ = ผ, ฟ = ฝ, ช ≈ ฉ). 다른 것은 성조 규칙뿐.",
      },
      items: [
        { char: "ค", reading: "kh (kho khwai)", say: "ค ควาย", example: { word: "คน", meaning: { en: "person", ko: "사람" } } },
        { char: "ช", reading: "ch (cho chang)", say: "ช ช้าง", example: { word: "ชา", meaning: { en: "tea", ko: "차" } } },
        { char: "ท", reading: "th (tho thahan)", say: "ท ทหาร", example: { word: "ทะเล", meaning: { en: "sea", ko: "바다" } } },
        { char: "พ", reading: "ph (pho phan)", say: "พ พาน", example: { word: "พ่อ", meaning: { en: "father", ko: "아버지" } } },
        { char: "ฟ", reading: "f (fo fan)", say: "ฟ ฟัน", example: { word: "ไฟ", meaning: { en: "fire; light", ko: "불; 전등" } } },
      ],
    },
    {
      id: "th-low-4",
      title: { en: "Low-class consonants: ง น ม ย ร ล ว", ko: "저자음 ง น ม ย ร ล ว" },
      note: {
        en: "ง is the \"ng\" of Korean 받침 ㅇ, but Thai also uses it at the start of a word. In casual speech ร often sounds like ล.",
        ko: "ง는 받침 ㅇ 소리(ng)인데 태국어는 낱말 첫소리에도 쓴다. 편한 말에서는 ร를 ล처럼 내는 일이 많다.",
      },
      items: [
        { char: "ง", reading: "ng (ngo ngu)", say: "ง งู", example: { word: "งาน", meaning: { en: "work", ko: "일" } } },
        { char: "น", reading: "n (no nu)", say: "น หนู", example: { word: "น้ำ", meaning: { en: "water", ko: "물" } } },
        { char: "ม", reading: "m (mo ma)", say: "ม ม้า", example: { word: "แม่", meaning: { en: "mother", ko: "어머니" } } },
        { char: "ย", reading: "y (yo yak)", say: "ย ยักษ์", example: { word: "ยา", meaning: { en: "medicine", ko: "약" } } },
        { char: "ร", reading: "r (ro ruea)", say: "ร เรือ", example: { word: "รถ", meaning: { en: "car", ko: "차(자동차)" } } },
        { char: "ล", reading: "l (lo ling)", say: "ล ลิง", example: { word: "ลม", meaning: { en: "wind", ko: "바람" } } },
        { char: "ว", reading: "w (wo waen)", say: "ว แหวน", example: { word: "วัน", meaning: { en: "day", ko: "날" } } },
      ],
    },
    {
      id: "th-vowel-5",
      title: { en: "Vowels after, above and below: short and long", ko: "뒤·위·아래 모음: 짧은 것과 긴 것" },
      note: {
        en: "อ here only holds the vowel's place; put any consonant there. A long vowel is held about twice as long, and length changes the word.",
        ko: "อ는 모음 자리만 보여 주는 받침 글자 — 어느 자음이든 그 자리에 온다. 긴 모음은 두 배쯤 끌고, 길이가 다르면 다른 낱말.",
      },
      items: [
        { char: "อะ", reading: "a (short)", say: "อะ", example: { word: "จะ", meaning: { en: "will (future)", ko: "～할 것이다" } } },
        { char: "อา", reading: "aa (long)", say: "อา", example: { word: "มา", meaning: { en: "to come", ko: "오다" } } },
        { char: "อั–", reading: "a (short, before a final)", say: "กัน", example: { word: "กับ", meaning: { en: "with", ko: "～와 함께" } } },
        { char: "อิ", reading: "i (short)", say: "อิ", example: { word: "ปิด", meaning: { en: "to close", ko: "닫다" } } },
        { char: "อี", reading: "ii (long)", say: "อี", example: { word: "ดี", meaning: { en: "good", ko: "좋다" } } },
        { char: "อึ", reading: "ue (short, like Korean ㅡ)", say: "อึ", example: { word: "ขึ้น", meaning: { en: "to go up", ko: "오르다" } } },
        { char: "อือ", reading: "uee (long ㅡ)", say: "อือ", example: { word: "มือ", meaning: { en: "hand", ko: "손" } } },
        { char: "อุ", reading: "u (short)", say: "อุ", example: { word: "ทุก", meaning: { en: "every", ko: "모든" } } },
        { char: "อู", reading: "uu (long)", say: "อู", example: { word: "ดู", meaning: { en: "to look, watch", ko: "보다" } } },
      ],
    },
    {
      id: "th-vowel-6",
      title: { en: "Vowels written before the consonant (เ แ โ) and ออ", ko: "자음 앞에 쓰는 모음 (เ แ โ)과 ออ" },
      note: {
        en: "เ แ โ are written before the consonant but sounded after it: เก is \"ke\", not \"ek\".",
        ko: "เ แ โ는 자음 앞에 쓰지만 소리는 자음 뒤에 난다: เก는 '에ㄱ'이 아니라 '께'.",
      },
      items: [
        { char: "เอะ", reading: "e (short)", say: "เอะ", example: { word: "เตะ", meaning: { en: "to kick", ko: "차다" } } },
        { char: "เอ", reading: "ee (long)", say: "เอ", example: { word: "เวลา", meaning: { en: "time", ko: "시간" } } },
        { char: "แอะ", reading: "ae (short, like Korean ㅐ)", say: "แอะ", example: { word: "แกะ", meaning: { en: "sheep", ko: "양" } } },
        { char: "แอ", reading: "aae (long ㅐ)", say: "แอ", example: { word: "แดง", meaning: { en: "red", ko: "빨갛다" } } },
        { char: "โอะ", reading: "o (short)", say: "โอะ", example: { word: "โต๊ะ", meaning: { en: "table", ko: "탁자" } } },
        { char: "โอ", reading: "oo (long)", say: "โอ", example: { word: "โมง", meaning: { en: "o'clock", ko: "～시" } } },
        { char: "เอาะ", reading: "aw (short, open o — between Korean ㅗ and ㅓ)", say: "เอาะ", example: { word: "เกาะ", meaning: { en: "island", ko: "섬" } } },
        { char: "ออ", reading: "aaw (long open o)", say: "ออ", example: { word: "รอ", meaning: { en: "to wait", ko: "기다리다" } } },
      ],
    },
    {
      id: "th-vowel-7",
      title: { en: "Vowel combinations (ไ ใ เา ำ เีย เือ ัว เออ)", ko: "합친 모음 (ไ ใ เา ำ เีย เือ ัว เออ)" },
      note: {
        en: "ไ and ใ sound the same (ai); ใ appears in only about twenty words, such as ใจ and ใช่.",
        ko: "ไ와 ใ는 소리가 같다(ai). ใ는 ใจ·ใช่처럼 스무 낱말 정도에만 쓴다.",
      },
      items: [
        { char: "ไอ", reading: "ai", say: "ไอ", example: { word: "ไป", meaning: { en: "to go", ko: "가다" } } },
        { char: "ใอ", reading: "ai", say: "ใจ", example: { word: "ใจ", meaning: { en: "heart, mind", ko: "마음" } } },
        { char: "เอา", reading: "ao", say: "เอา", example: { word: "เขา", meaning: { en: "he, she", ko: "그, 그녀" } } },
        { char: "อำ", reading: "am", say: "อำ", example: { word: "ทำ", meaning: { en: "to do, make", ko: "하다, 만들다" } } },
        { char: "เอีย", reading: "ia", say: "เอีย", example: { word: "เรียน", meaning: { en: "to study", ko: "공부하다" } } },
        { char: "เอือ", reading: "uea", say: "เอือ", example: { word: "เพื่อน", meaning: { en: "friend", ko: "친구" } } },
        { char: "อัว", reading: "ua", say: "อัว", example: { word: "ตัว", meaning: { en: "body", ko: "몸" } } },
        { char: "เออ", reading: "oe (like Korean ㅓ, long)", say: "เออ", example: { word: "เธอ", meaning: { en: "you; she", ko: "너; 그녀" } } },
      ],
    },
    {
      id: "th-final-8",
      title: { en: "Final consonant sounds", ko: "끝소리 (받침)" },
      note: {
        en: "At the end of a syllable many letters merge into eight sounds. -k, -t, -p are stopped without releasing air, like Korean 받침 ㄱ ㄷ ㅂ.",
        ko: "음절 끝에서는 여러 글자가 여덟 소리로 모인다. -k·-t·-p는 받침 ㄱ·ㄷ·ㅂ처럼 터뜨리지 않고 막는다.",
      },
      items: [
        { char: "–ก –ข –ค", reading: "-k", say: "ปาก", example: { word: "ปาก", meaning: { en: "mouth", ko: "입" } } },
        { char: "–ด –ต –จ –ช –ท –ส", reading: "-t", say: "พูด", example: { word: "พูด", meaning: { en: "to speak", ko: "말하다" } } },
        { char: "–บ –ป –พ –ฟ", reading: "-p", say: "ชอบ", example: { word: "ชอบ", meaning: { en: "to like", ko: "좋아하다" } } },
        { char: "–ง", reading: "-ng", say: "ทาง", example: { word: "ทาง", meaning: { en: "way, road", ko: "길" } } },
        { char: "–น –ล –ร", reading: "-n", say: "อาหาร", example: { word: "อาหาร", meaning: { en: "food", ko: "음식" } } },
        { char: "–ม", reading: "-m", say: "สาม", example: { word: "สาม", meaning: { en: "three", ko: "셋" } } },
        { char: "–ย", reading: "-i", say: "ขาย", example: { word: "ขาย", meaning: { en: "to sell", ko: "팔다" } } },
        { char: "–ว", reading: "-o (w)", say: "ขาว", example: { word: "ขาว", meaning: { en: "white", ko: "하얗다" } } },
      ],
    },
    {
      id: "th-tone-9",
      title: { en: "The five tones", ko: "다섯 성조" },
      note: {
        en: "Thai has five tones: mid, low, falling, high and rising. Changing the tone changes the word — มา, ม้า and หมา are three different words.",
        ko: "태국어 성조는 다섯: 평성·저성·하강·고성·상승. 성조가 바뀌면 낱말이 바뀐다 — มา·ม้า·หมา는 서로 다른 낱말.",
      },
      items: [
        { char: "มา", reading: "maa (mid, flat)", say: "มา", example: { word: "มา", meaning: { en: "to come", ko: "오다" } } },
        { char: "ไก่", reading: "kài (low)", say: "ไก่", example: { word: "ไก่", meaning: { en: "chicken", ko: "닭" } } },
        { char: "ข้าว", reading: "khâao (falling)", say: "ข้าว", example: { word: "ข้าว", meaning: { en: "rice", ko: "밥, 쌀" } } },
        { char: "ม้า", reading: "máa (high)", say: "ม้า", example: { word: "ม้า", meaning: { en: "horse", ko: "말(동물)" } } },
        { char: "หมา", reading: "mǎa (rising)", say: "หมา", example: { word: "หมา", meaning: { en: "dog", ko: "개" } } },
        { char: "ใหม่", reading: "mài (low)", say: "ใหม่", example: { word: "ใหม่", meaning: { en: "new", ko: "새로운" } } },
        { char: "ไม่", reading: "mâi (falling)", say: "ไม่", example: { word: "ไม่", meaning: { en: "not", ko: "안, 아니다" } } },
        { char: "ไหม", reading: "mǎi (rising)", say: "ไหม", example: { word: "ไหม", meaning: { en: "question word (…?)", ko: "의문 끝말(～요?)" } } },
      ],
    },
    {
      id: "th-mark-10",
      title: { en: "Tone marks ่ and ้", ko: "성조 기호 ่ 와 ้" },
      note: {
        en: "The same mark gives a different tone by class: ่ is low on mid/high letters but falling on low letters; ้ is falling on mid/high letters but high on low letters.",
        ko: "같은 기호도 자음 무리에 따라 성조가 다르다: ่는 중·고자음에서 저성, 저자음에서 하강; ้는 중·고자음에서 하강, 저자음에서 고성.",
      },
      items: [
        { char: "ตา", reading: "taa — mid letter, no mark → mid", say: "ตา", example: { word: "ตา", meaning: { en: "eye", ko: "눈" } } },
        { char: "ก่อน", reading: "kàwn — mid + ่ → low", say: "ก่อน", example: { word: "ก่อน", meaning: { en: "before, first", ko: "먼저, 전에" } } },
        { char: "ได้", reading: "dâi — mid + ้ → falling", say: "ได้", example: { word: "ได้", meaning: { en: "can; to get", ko: "～할 수 있다; 얻다" } } },
        { char: "สาม", reading: "sǎam — high letter, no mark → rising", say: "สาม", example: { word: "สาม", meaning: { en: "three", ko: "셋" } } },
        { char: "ข่าว", reading: "khàao — high + ่ → low", say: "ข่าว", example: { word: "ข่าว", meaning: { en: "news", ko: "뉴스" } } },
        { char: "ห้า", reading: "hâa — high + ้ → falling", say: "ห้า", example: { word: "ห้า", meaning: { en: "five", ko: "다섯" } } },
        { char: "พ่อ", reading: "phâw — low + ่ → falling", say: "พ่อ", example: { word: "พ่อ", meaning: { en: "father", ko: "아버지" } } },
        { char: "น้ำ", reading: "náam — low + ้ → high", say: "น้ำ", example: { word: "น้ำ", meaning: { en: "water", ko: "물" } } },
      ],
    },
    {
      id: "th-read-11",
      title: { en: "First words to read", ko: "처음 읽어 볼 낱말" },
      note: {
        en: "Thai writes words together without spaces; a space marks the end of a phrase or sentence.",
        ko: "태국어는 낱말 사이를 띄지 않고 붙여 쓴다. 띄어 쓴 곳은 구절이나 문장이 끝난 자리.",
      },
      items: [
        { char: "สวัสดี", reading: "sawatdii", say: "สวัสดี", example: { word: "สวัสดี", meaning: { en: "hello", ko: "안녕하세요" } } },
        { char: "ขอบคุณ", reading: "khàwp khun", say: "ขอบคุณ", example: { word: "ขอบคุณ", meaning: { en: "thank you", ko: "고마워요" } } },
        { char: "ครับ", reading: "khráp (said by men)", say: "ครับ", example: { word: "ครับ", meaning: { en: "polite ending (male speaker)", ko: "정중한 끝말(남자)" } } },
        { char: "ค่ะ", reading: "khâ (said by women)", say: "ค่ะ", example: { word: "ค่ะ", meaning: { en: "polite ending (female speaker)", ko: "정중한 끝말(여자)" } } },
        { char: "ใช่", reading: "châi", say: "ใช่", example: { word: "ใช่", meaning: { en: "yes, that's right", ko: "네, 맞아요" } } },
        { char: "เท่าไร", reading: "thâorai", say: "เท่าไร", example: { word: "เท่าไร", meaning: { en: "how much", ko: "얼마" } } },
        { char: "อร่อย", reading: "aròi", say: "อร่อย", example: { word: "อร่อย", meaning: { en: "delicious", ko: "맛있다" } } },
        { char: "ภาษาไทย", reading: "phaasǎa thai", say: "ภาษาไทย", example: { word: "ภาษาไทย", meaning: { en: "Thai language", ko: "태국어" } } },
      ],
    },
  ],
};
