// 2.80 스토어 7장 글(앱 언어별). 제목 한 줄만 — 부제·세부 설명 없음(사용자 2026-11-16).
// lang·people·log 제목은 사용법 넘겨 보기 장면과 같은 문장(src/lib/guide/slideTitles.ts my-lang-1·tab-people-1·my-log-1)을 쓴다.
// typed = 쓰기 문제 칸에 넣는 답(그 언어 화면의 문제 문장에 맞는 학습 언어 문장 — en 앱은 스페인어 학습, 나머지는 영어 학습)
//   [답, 칸 왼쪽 x, 칸 가운데 y, 칸 폭(원본 px), 자를 높이]. 그 언어에 쓰기 문제 화면이 없으면 null → 퀴즈 칸 셋.
export const COPY = {
  ko: { call: "AI 튜터와 학습하세요", quiz: "다양한 유형의 퀴즈로<br>매일 학습", lesson: "AI 튜터와 수업하세요", chat: "AI 튜터와 채팅하세요", kinds: ["고르기", "뜻", "틀린 곳", "쓰기"] },
  en: { call: "Learn with an AI tutor", quiz: "Learn every day with<br>many kinds of quizzes", lesson: "Take lessons with an AI tutor", chat: "Chat with an AI tutor", kinds: ["Choose", "Meaning", "Find the error", "Write"] },
  es: { call: "Aprende con un tutor de IA", quiz: "Aprende cada día<br>con quizzes variados", lesson: "Toma clases con un tutor de IA", chat: "Chatea con un tutor de IA", kinds: ["Elegir", "Significado", "Error", "Escribir"] },
  ja: { call: "AIチューターと学ぼう", quiz: "いろいろなクイズで<br>毎日学習", lesson: "AIチューターとレッスン", chat: "AIチューターとチャット", kinds: ["選ぶ", "意味", "間違い探し", "書く"] },
  zh: { call: "和AI导师一起学习", quiz: "多种题型<br>每天学习", lesson: "和AI导师上课", chat: "和AI导师聊天", kinds: ["选择", "词义", "找错", "写句"] },
  vi: { call: "Học cùng gia sư AI", quiz: "Học mỗi ngày với<br>nhiều dạng câu đố", lesson: "Học bài cùng gia sư AI", chat: "Trò chuyện với gia sư AI", kinds: ["Chọn", "Nghĩa", "Tìm lỗi", "Viết"] },
  fr: { call: "Apprenez avec un tuteur IA", quiz: "Apprenez chaque jour<br>avec des quiz variés", lesson: "Prenez des cours avec un tuteur IA", chat: "Discutez avec un tuteur IA", kinds: ["Choisir", "Sens", "Erreur", "Écrire"] },
  it: { call: "Impara con un tutor IA", quiz: "Impara ogni giorno<br>con quiz di ogni tipo", lesson: "Fai lezione con un tutor IA", chat: "Chatta con un tutor IA", kinds: ["Scegli", "Significato", "Errore", "Scrivi"] },
  pt: { call: "Aprenda com um tutor de IA", quiz: "Aprenda todo dia com<br>vários tipos de quiz", lesson: "Tenha aulas com um tutor de IA", chat: "Converse com um tutor de IA", kinds: ["Escolher", "Significado", "Erro", "Escrever"] },
  ru: { call: "Учитесь с ИИ-репетитором", quiz: "Учитесь каждый день<br>с разными викторинами", lesson: "Уроки с ИИ-репетитором", chat: "Переписывайтесь<br>с ИИ-репетитором", kinds: ["Выбор", "Значение", "Ошибка", "Письмо"] },
  id: { call: "Belajar bersama tutor AI", quiz: "Belajar setiap hari<br>dengan beragam kuis", lesson: "Ikuti pelajaran dengan tutor AI", chat: "Mengobrol dengan tutor AI", kinds: ["Pilih", "Arti", "Cari salah", "Tulis"] },
  ar: { call: "تعلّم مع معلّم ذكاء اصطناعي", quiz: "تعلّم كل يوم<br>باختبارات متنوعة", lesson: "خذ دروسًا مع معلّم ذكاء اصطناعي", chat: "دردش مع معلّم ذكاء اصطناعي", kinds: ["اختيار", "المعنى", "الخطأ", "كتابة"] },
  th: { call: "เรียนกับติวเตอร์ AI", quiz: "เรียนทุกวัน<br>ด้วยควิซหลายแบบ", lesson: "เรียนบทเรียนกับติวเตอร์ AI", chat: "แชตกับติวเตอร์ AI", kinds: ["เลือก", "ความหมาย", "หาที่ผิด", "เขียน"] },
  hi: { call: "AI ट्यूटर के साथ सीखें", quiz: "हर दिन सीखें<br>कई तरह के क्विज़ से", lesson: "AI ट्यूटर से पाठ लें", chat: "AI ट्यूटर से चैट करें", kinds: ["चुनें", "अर्थ", "गलती", "लिखें"] },
};

const WHOLE = (answer) => [answer, 18, 187, 600, 235];
export const TYPED = {
  ko: WHOLE("Hi, what do you do?"),
  en: WHOLE("Hola, ¿cómo estás hoy?"),
  es: ["She lives near a river.", 18, 254, 510, 300],
  ja: null,
  zh: WHOLE("She lives near the river."),
  vi: ["She lives near a river.", 18, 254, 510, 300],
  fr: WHOLE("Excuse me, where are you from? Your accent is charming."),
  it: WHOLE("Excuse me, where are you from? Your accent is beautiful."),
  pt: WHOLE("Class starts at nine o'clock on Monday."),
  ru: WHOLE("My older brother is a nurse."),
  id: ["where are you from", 18, 476, 540, 525],
  ar: ["Can you speak a little slower, please?", 160, 187, 580, 235],
  th: WHOLE("She lives near the river."),
  hi: null,
};

/** 제목 글꼴 — 한자는 그 언어 글꼴이 먼저(ja = JP, zh = SC). */
export const FONT = {
  ja: '"Noto Sans CJK JP","Noto Sans JP",sans-serif',
  zh: '"Noto Sans CJK SC","Noto Sans SC",sans-serif',
  th: '"Noto Sans Thai","Noto Sans",sans-serif',
  ar: '"Noto Sans Arabic","Noto Sans",sans-serif',
  hi: '"Noto Sans Devanagari","Noto Sans",sans-serif',
  default: '"Noto Sans KR","Noto Sans CJK KR","Noto Sans",sans-serif',
};

/** Play 등록정보 폴더(fastlane/metadata/android/<폴더>). */
export const LISTING = { ko: "ko-KR", en: "en-US", es: "es-ES", ja: "ja-JP", zh: "zh-CN", vi: "vi", fr: "fr-FR", it: "it-IT", pt: "pt-PT", ru: "ru-RU", id: "id", ar: "ar", th: "th", hi: "hi-IN" };

/** 퀴즈 칸을 바꿔야 하는 언어: [조각, 자를 칸, 이름표 번호(kinds)] — ru는 풀이 화면(keep-after)이 뜻 문제라 뜻 칸과 겹쳐서 셋으로. */
export const QUIZ_TILES = {
  ru: [["keep-after", [0, 0, 772, 900], 1], ["type-spots", [0, 0, 772, 600], 2], ["type-type", [0, 0, 772, 235], 3]],
};
