import type { ScriptCourse } from "./types.ts";

/**
 * 아랍 문자 기초. 28글자를 모양이 같은 무리로(점만 다른 글자끼리) 익히고, 이어 쓸 때 모양이 바뀌는 것,
 * 짧은 모음 기호(فتحة·كسرة·ضمة·سكون·شدة), 긴 모음, ة, 태양·달 글자와 ال 순서로 간다.
 * 글자 하나는 TTS가 잘 못 읽어서 say는 글자 이름(باء·جيم…)이나 짧은 낱말.
 */
export const AR_SCRIPT: ScriptCourse = {
  language: "ar",
  version: 1,
  title: { en: "The Arabic alphabet and vowel marks", ko: "아랍 문자와 모음 기호" },
  groups: [
    {
      id: "ar-letters-1",
      title: { en: "ا and the ب family (ب ت ث)", ko: "ا와 ب 무리 (ب ت ث)" },
      note: {
        en: "Arabic is written right to left. ب ت ث share one shape; only the dots change (1 below, 2 above, 3 above).",
        ko: "아랍어는 오른쪽에서 왼쪽으로 쓴다. ب ت ث는 모양이 같고 점만 다르다(아래 1개, 위 2개, 위 3개).",
      },
      items: [
        { char: "ا", reading: "a / aa (alif)", say: "ألف", example: { word: "باب", meaning: { en: "door", ko: "문" } } },
        { char: "ب", reading: "b", say: "باء", example: { word: "بيت", meaning: { en: "house", ko: "집" } } },
        { char: "ت", reading: "t", say: "تاء", example: { word: "تفاح", meaning: { en: "apples", ko: "사과" } } },
        { char: "ث", reading: "th (as in think)", say: "ثاء", example: { word: "ثلاثة", meaning: { en: "three", ko: "셋" } } },
        { char: "بـ ـبـ ـب", reading: "b (start, middle, end)", say: "باء", example: { word: "خبز", meaning: { en: "bread", ko: "빵" } } },
      ],
    },
    {
      id: "ar-letters-2",
      title: { en: "ج ح خ and د ذ", ko: "ج ح خ 와 د ذ" },
      note: {
        en: "ح is a breathy h from deep in the throat; خ is a rough kh like clearing your throat. د ذ never join to the next letter.",
        ko: "ح는 목 깊은 곳에서 내쉬는 h, خ는 가래 끓듯 긁는 kh. د ذ는 다음 글자와 이어지지 않는다.",
      },
      items: [
        { char: "ج", reading: "j", say: "جيم", example: { word: "جميل", meaning: { en: "beautiful", ko: "아름다운" } } },
        { char: "ح", reading: "h (deep, breathy)", say: "حاء", example: { word: "حليب", meaning: { en: "milk", ko: "우유" } } },
        { char: "خ", reading: "kh", say: "خاء", example: { word: "خبز", meaning: { en: "bread", ko: "빵" } } },
        { char: "د", reading: "d", say: "دال", example: { word: "درس", meaning: { en: "lesson", ko: "수업" } } },
        { char: "ذ", reading: "dh (as in this)", say: "ذال", example: { word: "ذهب", meaning: { en: "gold", ko: "금" } } },
      ],
    },
    {
      id: "ar-letters-3",
      title: { en: "ر ز, س ش and ص ض", ko: "ر ز · س ش · ص ض" },
      note: {
        en: "ص ض are the heavy partners of س د: say them with the tongue pressed low and the mouth round, so the next vowel sounds darker.",
        ko: "ص ض는 س د의 무거운 짝: 혀뿌리를 내리고 입을 둥글게 해서 뒤 모음이 어둡게 들린다.",
      },
      items: [
        { char: "ر", reading: "r (rolled)", say: "راء", example: { word: "رز", meaning: { en: "rice", ko: "쌀·밥" } } },
        { char: "ز", reading: "z", say: "زاي", example: { word: "زيت", meaning: { en: "oil", ko: "기름" } } },
        { char: "س", reading: "s", say: "سين", example: { word: "سمك", meaning: { en: "fish", ko: "생선" } } },
        { char: "ش", reading: "sh", say: "شين", example: { word: "شاي", meaning: { en: "tea", ko: "차" } } },
        { char: "ص", reading: "s (heavy)", say: "صاد", example: { word: "صباح", meaning: { en: "morning", ko: "아침" } } },
        { char: "ض", reading: "d (heavy)", say: "ضاد", example: { word: "ضيف", meaning: { en: "guest", ko: "손님" } } },
      ],
    },
    {
      id: "ar-letters-4",
      title: { en: "ط ظ, ع غ and ف ق", ko: "ط ظ · ع غ · ف ق" },
      note: {
        en: "ع is a squeezed sound in the throat with no Korean or English match; ق is a k made far back in the throat, not ك.",
        ko: "ع는 목을 조여 내는 소리로 한국어·영어에 없다. ق는 ك보다 훨씬 목 안쪽에서 내는 k.",
      },
      items: [
        { char: "ط", reading: "t (heavy)", say: "طاء", example: { word: "طالب", meaning: { en: "student", ko: "학생" } } },
        { char: "ظ", reading: "dh (heavy)", say: "ظاء", example: { word: "ظهر", meaning: { en: "noon", ko: "정오" } } },
        { char: "ع", reading: "' (ayn, throat)", say: "عين", example: { word: "عين", meaning: { en: "eye", ko: "눈" } } },
        { char: "غ", reading: "gh (like a French r)", say: "غين", example: { word: "غرفة", meaning: { en: "room", ko: "방" } } },
        { char: "ف", reading: "f", say: "فاء", example: { word: "فم", meaning: { en: "mouth", ko: "입" } } },
        { char: "ق", reading: "q (deep k)", say: "قاف", example: { word: "قلم", meaning: { en: "pen", ko: "펜" } } },
      ],
    },
    {
      id: "ar-letters-5",
      title: { en: "ك ل م ن ه و ي", ko: "ك ل م ن ه و ي" },
      note: {
        en: "و and ي are consonants (w, y) and also long vowels (uu, ii). ن starts like ب but has one dot above.",
        ko: "و와 ي는 자음(w·y)이면서 긴 모음(uu·ii)도 된다. ن는 첫 모양이 ب와 같고 점이 위에 하나.",
      },
      items: [
        { char: "ك", reading: "k", say: "كاف", example: { word: "كتاب", meaning: { en: "book", ko: "책" } } },
        { char: "ل", reading: "l", say: "لام", example: { word: "ليل", meaning: { en: "night", ko: "밤" } } },
        { char: "م", reading: "m", say: "ميم", example: { word: "ماء", meaning: { en: "water", ko: "물" } } },
        { char: "ن", reading: "n", say: "نون", example: { word: "نور", meaning: { en: "light", ko: "빛" } } },
        { char: "ه", reading: "h", say: "هاء", example: { word: "هنا", meaning: { en: "here", ko: "여기" } } },
        { char: "و", reading: "w / uu", say: "واو", example: { word: "ولد", meaning: { en: "boy", ko: "남자아이" } } },
        { char: "ي", reading: "y / ii", say: "ياء", example: { word: "يد", meaning: { en: "hand", ko: "손" } } },
      ],
    },
    {
      id: "ar-forms-1",
      title: { en: "Letters join and change shape", ko: "글자는 이어지며 모양이 바뀐다" },
      note: {
        en: "Most letters have a start, middle and end shape inside a word. ا د ذ ر ز و never join to the letter after them, so a small gap follows.",
        ko: "대부분의 글자는 낱말 안에서 처음·가운데·끝 모양이 있다. ا د ذ ر ز و는 뒤 글자와 이어지지 않아 뒤에 작은 틈이 생긴다.",
      },
      items: [
        { char: "ي يـ ـيـ ـي", reading: "y (alone, start, middle, end)", say: "ياء", example: { word: "بيت", meaning: { en: "house", ko: "집" } } },
        { char: "ع عـ ـعـ ـع", reading: "' (alone, start, middle, end)", say: "عين", example: { word: "ساعة", meaning: { en: "hour, watch", ko: "시간·시계" } } },
        { char: "ه هـ ـهـ ـه", reading: "h (alone, start, middle, end)", say: "هاء", example: { word: "وجه", meaning: { en: "face", ko: "얼굴" } } },
        { char: "ك كـ ـكـ ـك", reading: "k (alone, start, middle, end)", say: "كاف", example: { word: "سكر", meaning: { en: "sugar", ko: "설탕" } } },
        { char: "م مـ ـمـ ـم", reading: "m (alone, start, middle, end)", say: "ميم", example: { word: "سمك", meaning: { en: "fish", ko: "생선" } } },
        { char: "لا", reading: "laa (ل + ا)", say: "لا", example: { word: "سلام", meaning: { en: "peace, hello", ko: "평화·안녕" } } },
        { char: "ا د ذ ر ز و", reading: "do not join forward", say: "ورد", example: { word: "ورد", meaning: { en: "roses", ko: "장미" } } },
      ],
    },
    {
      id: "ar-vowels-1",
      title: { en: "Short vowel marks", ko: "짧은 모음 기호" },
      note: {
        en: "Short vowels are small marks above or below a letter and are usually left out in everyday writing; textbooks and children's books show them.",
        ko: "짧은 모음은 글자 위아래의 작은 기호이고 보통 글에서는 생략한다. 교과서·어린이 책에는 붙어 있다.",
      },
      items: [
        { char: "بَ", reading: "ba (fatha)", say: "بَ", example: { word: "كَتَبَ", meaning: { en: "he wrote", ko: "그가 썼다" } } },
        { char: "بِ", reading: "bi (kasra)", say: "بِ", example: { word: "بِنْت", meaning: { en: "girl", ko: "여자아이" } } },
        { char: "بُ", reading: "bu (damma)", say: "بُ", example: { word: "كُرَة", meaning: { en: "ball", ko: "공" } } },
        { char: "بْ", reading: "b, no vowel (sukun)", say: "مَكْتَب", example: { word: "مَكْتَب", meaning: { en: "desk, office", ko: "책상·사무실" } } },
        { char: "بّ", reading: "bb, doubled (shadda)", say: "حَمّام", example: { word: "حَمّام", meaning: { en: "bathroom", ko: "화장실" } } },
        { char: "ـًا", reading: "-an (tanwin)", say: "شُكْرًا", example: { word: "شُكْرًا", meaning: { en: "thank you", ko: "고마워요" } } },
      ],
    },
    {
      id: "ar-vowels-2",
      title: { en: "Long vowels, ة and word endings", ko: "긴 모음·ة·낱말 끝" },
      note: {
        en: "ا و ي after a letter make long aa, uu, ii — hold them twice as long. ة at the end sounds a, and t when another word is joined to it.",
        ko: "글자 뒤 ا و ي는 긴 aa·uu·ii — 두 배로 늘인다. 끝의 ة는 a로 읽고, 뒤에 낱말이 이어지면 t로 읽는다.",
      },
      items: [
        { char: "با", reading: "baa", say: "باب", example: { word: "باب", meaning: { en: "door", ko: "문" } } },
        { char: "بو", reading: "buu", say: "نور", example: { word: "نور", meaning: { en: "light", ko: "빛" } } },
        { char: "بي", reading: "bii", say: "كبير", example: { word: "كبير", meaning: { en: "big", ko: "큰" } } },
        { char: "ـَو", reading: "aw", say: "يوم", example: { word: "يوم", meaning: { en: "day", ko: "날·하루" } } },
        { char: "ـَي", reading: "ay", say: "بيت", example: { word: "بيت", meaning: { en: "house", ko: "집" } } },
        { char: "ـة", reading: "a / at (ta marbuta)", say: "مدرسة", example: { word: "مدرسة", meaning: { en: "school", ko: "학교" } } },
        { char: "ى", reading: "aa at the end", say: "مستشفى", example: { word: "مستشفى", meaning: { en: "hospital", ko: "병원" } } },
        { char: "ء أ", reading: "' (glottal stop, hamza)", say: "أنا", example: { word: "أنا", meaning: { en: "I", ko: "나" } } },
      ],
    },
    {
      id: "ar-al-1",
      title: { en: "ال with sun and moon letters", ko: "ال과 태양 글자·달 글자" },
      note: {
        en: "ال means 'the'. Before a moon letter you say the l (al-qamar). Before a sun letter (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) the l is silent and that letter doubles (ash-shams).",
        ko: "ال은 '그'(정관사). 달 글자 앞에서는 l을 읽고(al-qamar), 태양 글자(ت ث د ذ ر ز س ش ص ض ط ظ ل ن) 앞에서는 l을 읽지 않고 그 글자를 겹쳐 읽는다(ash-shams).",
      },
      items: [
        { char: "القمر", reading: "al-qamar (moon letter)", say: "القمر", example: { word: "القمر", meaning: { en: "the moon", ko: "달" } } },
        { char: "الباب", reading: "al-baab (moon letter)", say: "الباب", example: { word: "الباب", meaning: { en: "the door", ko: "그 문" } } },
        { char: "الكتاب", reading: "al-kitaab (moon letter)", say: "الكتاب", example: { word: "الكتاب", meaning: { en: "the book", ko: "그 책" } } },
        { char: "الشمس", reading: "ash-shams (sun letter)", say: "الشمس", example: { word: "الشمس", meaning: { en: "the sun", ko: "해" } } },
        { char: "السلام", reading: "as-salaam (sun letter)", say: "السلام", example: { word: "السلام عليكم", meaning: { en: "peace be upon you (hello)", ko: "안녕하세요" } } },
        { char: "النور", reading: "an-nuur (sun letter)", say: "النور", example: { word: "صباح النور", meaning: { en: "good morning (reply)", ko: "좋은 아침(답 인사)" } } },
        { char: "التفاح", reading: "at-tuffaah (sun letter)", say: "التفاح", example: { word: "التفاح", meaning: { en: "the apples", ko: "그 사과" } } },
        { char: "الدرس", reading: "ad-dars (sun letter)", say: "الدرس", example: { word: "الدرس", meaning: { en: "the lesson", ko: "그 수업" } } },
      ],
    },
  ],
};
