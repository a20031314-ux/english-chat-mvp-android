import type { ScriptCourse } from "./types.ts";

/** 인도네시아어 철자-발음 기초. 철자가 규칙적이라 소리가 다른 글자와 규칙만 짚는다. */
export const ID_SCRIPT: ScriptCourse = {
  language: "id",
  version: 1,
  title: { en: "Indonesian spelling and sounds", ko: "인도네시아어 철자와 소리" },
  groups: [
    {
      id: "id-vowel-1",
      title: { en: "Vowels a, i, u, o", ko: "모음 a·i·u·o" },
      note: {
        en: "Each vowel keeps one clear sound wherever it is; never weaken it.",
        ko: "모음은 어디서나 한 소리로 또렷하게 읽고 약하게 줄이지 않는다.",
      },
      items: [
        { char: "a", reading: "a (아)", say: "apa", example: { word: "apa", meaning: { en: "what", ko: "무엇" } } },
        { char: "i", reading: "i (이)", say: "ini", example: { word: "ini", meaning: { en: "this", ko: "이것" } } },
        { char: "u", reading: "u (우)", say: "susu", example: { word: "susu", meaning: { en: "milk", ko: "우유" } } },
        { char: "o", reading: "o (오)", say: "toko", example: { word: "toko", meaning: { en: "shop", ko: "가게" } } },
        { char: "ai", reading: "ai (아이)", say: "pantai", example: { word: "pantai", meaning: { en: "beach", ko: "해변" } } },
        { char: "au", reading: "au (아우)", say: "pulau", example: { word: "pulau", meaning: { en: "island", ko: "섬" } } },
      ],
    },
    {
      id: "id-vowel-2",
      title: { en: "The two e sounds", ko: "두 가지 e 소리" },
      note: {
        en: "The letter e is written the same for both sounds: weak e (like 으) is more common; learn each word's e by ear.",
        ko: "e는 두 소리를 같은 글자로 쓴다: 약한 e('으' 비슷)가 더 흔하고, 낱말마다 귀로 익힌다.",
      },
      items: [
        { char: "e (weak)", reading: "e (으)", say: "besar", example: { word: "besar", meaning: { en: "big", ko: "크다" } } },
        { char: "e (weak)", reading: "e (으)", say: "kecil", example: { word: "kecil", meaning: { en: "small", ko: "작다" } } },
        { char: "e (weak)", reading: "e (으)", say: "beli", example: { word: "beli", meaning: { en: "buy", ko: "사다" } } },
        { char: "é (clear)", reading: "é (에)", say: "enak", example: { word: "enak", meaning: { en: "tasty", ko: "맛있다" } } },
        { char: "é (clear)", reading: "é (에)", say: "sate", example: { word: "sate", meaning: { en: "satay", ko: "꼬치구이" } } },
        { char: "é (clear)", reading: "é (에)", say: "meja", example: { word: "meja", meaning: { en: "table", ko: "탁자" } } },
      ],
    },
    {
      id: "id-cons-1",
      title: { en: "Consonants that differ from English: c, j, y, w", ko: "영어와 다른 자음 c·j·y·w" },
      note: {
        en: "c is always ch, never k or s; consonants p, t, k sound unaspirated, close to Korean ㅃ, ㄸ, ㄲ.",
        ko: "c는 늘 '치(ㅊ)' 소리, k·s가 아니다. p·t·k는 숨을 거의 안 내 ㅃ·ㄸ·ㄲ에 가깝다.",
      },
      items: [
        { char: "c", reading: "ch (ㅊ)", say: "cari", example: { word: "cari", meaning: { en: "look for", ko: "찾다" } } },
        { char: "c", reading: "ch (ㅊ)", say: "kucing", example: { word: "kucing", meaning: { en: "cat", ko: "고양이" } } },
        { char: "j", reading: "j (ㅈ)", say: "jalan", example: { word: "jalan", meaning: { en: "street, walk", ko: "길·걷다" } } },
        { char: "y", reading: "y (ㅣ 반모음)", say: "saya", example: { word: "saya", meaning: { en: "I", ko: "나·저" } } },
        { char: "w", reading: "w (ㅜ 반모음)", say: "warna", example: { word: "warna", meaning: { en: "colour", ko: "색" } } },
        { char: "p", reading: "p (ㅃ)", say: "pagi", example: { word: "pagi", meaning: { en: "morning", ko: "아침" } } },
        { char: "t", reading: "t (ㄸ)", say: "tas", example: { word: "tas", meaning: { en: "bag", ko: "가방" } } },
        { char: "k", reading: "k (ㄲ)", say: "kopi", example: { word: "kopi", meaning: { en: "coffee", ko: "커피" } } },
      ],
    },
    {
      id: "id-cons-2",
      title: { en: "The rolled r", ko: "굴리는 r" },
      note: {
        en: "r is a tapped or rolled tongue-tip sound everywhere, including at the end of a word.",
        ko: "r은 어디서나 혀끝을 튕기거나 굴리는 소리로, 낱말 끝에서도 분명히 낸다.",
      },
      items: [
        { char: "r", reading: "r (굴림)", say: "rumah", example: { word: "rumah", meaning: { en: "house", ko: "집" } } },
        { char: "r", reading: "r (굴림)", say: "baru", example: { word: "baru", meaning: { en: "new", ko: "새롭다" } } },
        { char: "r", reading: "r (굴림)", say: "pasar", example: { word: "pasar", meaning: { en: "market", ko: "시장" } } },
        { char: "r", reading: "r (굴림)", say: "terima kasih", example: { word: "terima kasih", meaning: { en: "thank you", ko: "고마워요" } } },
        { char: "l / r", reading: "l (ㄹ) / r (굴림)", say: "lari", example: { word: "lari", meaning: { en: "run", ko: "달리다" } } },
      ],
    },
    {
      id: "id-digraph-1",
      title: { en: "Letter pairs ng, ny", ko: "두 글자 소리 ng·ny" },
      note: {
        en: "ng is one sound (Korean final ㅇ) even at the start of a syllable; ny is like 냐·뇨.",
        ko: "ng는 한 소리(받침 ㅇ)로, 음절 첫머리에서도 그렇다. ny는 '냐·뇨'처럼.",
      },
      items: [
        { char: "ng", reading: "ng (ㅇ)", say: "uang", example: { word: "uang", meaning: { en: "money", ko: "돈" } } },
        { char: "ng", reading: "ng (ㅇ)", say: "dengan", example: { word: "dengan", meaning: { en: "with", ko: "~와 함께" } } },
        { char: "ng", reading: "ng (ㅇ)", say: "ngobrol", example: { word: "ngobrol", meaning: { en: "chat", ko: "수다 떨다" } } },
        { char: "ngg", reading: "ngg (ㅇ+ㄱ)", say: "tinggal", example: { word: "tinggal", meaning: { en: "live, stay", ko: "살다·머물다" } } },
        { char: "ny", reading: "ny (냐)", say: "nyanyi", example: { word: "nyanyi", meaning: { en: "sing", ko: "노래하다" } } },
        { char: "ny", reading: "ny (냐)", say: "banyak", example: { word: "banyak", meaning: { en: "many", ko: "많다" } } },
      ],
    },
    {
      id: "id-digraph-2",
      title: { en: "Borrowed sounds sy, kh, f, z", ko: "빌려 온 소리 sy·kh·f·z" },
      note: {
        en: "These come mainly from Arabic and English loanwords; in casual speech kh often becomes k and f becomes p.",
        ko: "주로 아랍어·영어에서 온 낱말에 나온다. 편한 말에선 kh가 k로, f가 p로 들리기도 한다.",
      },
      items: [
        { char: "sy", reading: "sy (샤)", say: "syukur", example: { word: "syukur", meaning: { en: "gratitude", ko: "감사" } } },
        { char: "sy", reading: "sy (샤)", say: "masyarakat", example: { word: "masyarakat", meaning: { en: "society", ko: "사회" } } },
        { char: "kh", reading: "kh (목 긁는 ㅎ)", say: "khusus", example: { word: "khusus", meaning: { en: "special", ko: "특별한" } } },
        { char: "kh", reading: "kh (목 긁는 ㅎ)", say: "akhir", example: { word: "akhir", meaning: { en: "end", ko: "끝" } } },
        { char: "f", reading: "f", say: "foto", example: { word: "foto", meaning: { en: "photo", ko: "사진" } } },
        { char: "z", reading: "z", say: "izin", example: { word: "izin", meaning: { en: "permission", ko: "허락" } } },
      ],
    },
    {
      id: "id-final-1",
      title: { en: "Word endings: final k, h", ko: "낱말 끝 소리 k·h" },
      note: {
        en: "Final k is a glottal stop: close the throat and stop, without releasing a k. Final h is a soft breath you can hear.",
        ko: "끝 k는 목을 닫아 멈추는 소리(성문 파열음)로 'ㅋ'를 터뜨리지 않는다. 끝 h는 들릴 듯한 약한 숨.",
      },
      items: [
        { char: "-k", reading: "' (멈춤)", say: "tidak", example: { word: "tidak", meaning: { en: "not", ko: "아니다" } } },
        { char: "-k", reading: "' (멈춤)", say: "anak", example: { word: "anak", meaning: { en: "child", ko: "아이" } } },
        { char: "-k", reading: "' (멈춤)", say: "bapak", example: { word: "bapak", meaning: { en: "sir, father", ko: "아버지·~님(남)" } } },
        { char: "-k", reading: "' (멈춤)", say: "masak", example: { word: "masak", meaning: { en: "cook", ko: "요리하다" } } },
        { char: "-h", reading: "h (약한 숨)", say: "murah", example: { word: "murah", meaning: { en: "cheap", ko: "싸다" } } },
        { char: "-h", reading: "h (약한 숨)", say: "sudah", example: { word: "sudah", meaning: { en: "already", ko: "이미" } } },
      ],
    },
    {
      id: "id-stress-1",
      title: { en: "Word stress and rhythm", ko: "낱말 강세와 리듬" },
      note: {
        en: "Stress is light and usually on the second-to-last syllable; if that syllable has weak e, it moves to the last one.",
        ko: "강세는 가볍고 보통 끝에서 두 번째 음절에 온다. 그 음절이 약한 e면 마지막 음절로 옮긴다.",
      },
      items: [
        { char: "MA-kan", reading: "ma-kan", say: "makan", example: { word: "makan", meaning: { en: "eat", ko: "먹다" } } },
        { char: "SA-ya", reading: "sa-ya", say: "saya", example: { word: "saya", meaning: { en: "I", ko: "나·저" } } },
        { char: "be-SAR", reading: "be-sar", say: "besar", example: { word: "besar", meaning: { en: "big", ko: "크다" } } },
        { char: "te-MAN", reading: "te-man", say: "teman", example: { word: "teman", meaning: { en: "friend", ko: "친구" } } },
        { char: "se-KO-lah", reading: "se-ko-lah", say: "sekolah", example: { word: "sekolah", meaning: { en: "school", ko: "학교" } } },
        { char: "ma-ha-SIS-wa", reading: "ma-ha-sis-wa", say: "mahasiswa", example: { word: "mahasiswa", meaning: { en: "university student", ko: "대학생" } } },
        { char: "BU-ku", reading: "bu-ku", say: "buku", example: { word: "buku", meaning: { en: "book", ko: "책" } } },
      ],
    },
  ],
};
