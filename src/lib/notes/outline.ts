/**
 * 노트의 목차: 모든 학습 언어, 모든 사람에게 같은 장 8개 × 주제 3개.
 *
 * 사용자 결정(2026-10-19, hub/drafts/my-study-room.md): 이름은 노트, 난이도 없음,
 * 뼈대는 모두 같게. 목차는 모델이 만들지 않는다 — 이름은 여기 14개 UI 언어로 고정이고,
 * 사람마다 다른 건 그 안에 모이는 것(표현·단어·질문)이다.
 *
 * `about`은 화면에 나오지 않는다: 표현을 주제에 넣을 때 모델에게 주는 영어 설명
 * (/api/notes/place). 바꾸면 이미 넣은 자리는 그대로이고 새 표현부터 바뀐다.
 */

export const NOTE_LOCALES = ["ko", "en", "es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"] as const;
export type NoteLocale = (typeof NOTE_LOCALES)[number];
type Names = Record<NoteLocale, string>;

export type NoteTopic = { id: string; about: string; name: Names };
export type NoteChapter = { id: string; name: Names; topics: NoteTopic[] };

const n = (
  ko: string, en: string, es: string, ja: string, zh: string, vi: string, fr: string,
  it: string, pt: string, ru: string, id: string, ar: string, th: string, hi: string,
): Names => ({ ko, en, es, ja, zh, vi, fr, it, pt, ru, id, ar, th, hi });

export const NOTE_OUTLINE: NoteChapter[] = [
  {
    id: "people",
    name: n("나와 사람들", "Me and others", "Yo y los demás", "自分と人", "我和他人", "Tôi và mọi người", "Moi et les autres", "Io e gli altri", "Eu e os outros", "Я и другие", "Aku dan orang lain", "أنا والآخرون", "ฉันและคนอื่น", "मैं और लोग"),
    topics: [
      { id: "people.intro", about: "introducing yourself, names, where you are from, greetings", name: n("자기소개", "Introducing yourself", "Presentarse", "自己紹介", "自我介绍", "Giới thiệu bản thân", "Se présenter", "Presentarsi", "Apresentar-se", "Знакомство", "Perkenalan diri", "التعريف بنفسك", "แนะนำตัว", "अपना परिचय") },
      { id: "people.family", about: "family, friends, relationships, describing people", name: n("가족과 친구", "Family and friends", "Familia y amigos", "家族と友だち", "家人和朋友", "Gia đình và bạn bè", "Famille et amis", "Famiglia e amici", "Família e amigos", "Семья и друзья", "Keluarga dan teman", "العائلة والأصدقاء", "ครอบครัวและเพื่อน", "परिवार और दोस्त") },
      { id: "people.job", about: "jobs, what you do, studies, hobbies and interests", name: n("하는 일과 관심사", "Work and interests", "Trabajo e intereses", "仕事と趣味", "工作和兴趣", "Công việc và sở thích", "Travail et centres d'intérêt", "Lavoro e interessi", "Trabalho e interesses", "Работа и интересы", "Pekerjaan dan minat", "العمل والاهتمامات", "งานและความสนใจ", "काम और रुचियाँ") },
    ],
  },
  {
    id: "day",
    name: n("하루", "My day", "Mi día", "一日", "一天", "Một ngày", "Ma journée", "La mia giornata", "Meu dia", "Мой день", "Hariku", "يومي", "หนึ่งวัน", "मेरा दिन"),
    topics: [
      { id: "day.routine", about: "daily routine, morning to night, habits", name: n("아침부터 밤까지", "Morning to night", "De la mañana a la noche", "朝から夜まで", "从早到晚", "Từ sáng đến tối", "Du matin au soir", "Dalla mattina alla sera", "Da manhã à noite", "С утра до вечера", "Dari pagi sampai malam", "من الصباح إلى الليل", "ตั้งแต่เช้าถึงค่ำ", "सुबह से रात तक") },
      { id: "day.home", about: "home, chores, cooking, food at home, rest", name: n("집에서", "At home", "En casa", "家で", "在家", "Ở nhà", "À la maison", "A casa", "Em casa", "Дома", "Di rumah", "في البيت", "ที่บ้าน", "घर पर") },
      { id: "day.time", about: "time, dates, days of the week, weather, numbers in daily life", name: n("시간·날짜·날씨", "Time, dates, weather", "Hora, fechas y tiempo", "時間・日付・天気", "时间、日期和天气", "Giờ, ngày và thời tiết", "Heure, dates et météo", "Ora, date e meteo", "Horas, datas e tempo", "Время, даты, погода", "Waktu, tanggal, cuaca", "الوقت والتاريخ والطقس", "เวลา วันที่ และอากาศ", "समय, तारीख़, मौसम") },
    ],
  },
  {
    id: "past",
    name: n("지난 일", "What happened", "Lo que pasó", "過ぎたこと", "过去的事", "Chuyện đã qua", "Ce qui s'est passé", "Quello che è successo", "O que aconteceu", "Что было", "Yang sudah terjadi", "ما حدث", "เรื่องที่ผ่านมา", "जो हुआ"),
    topics: [
      { id: "past.yesterday", about: "what you did yesterday or last weekend, recent activities", name: n("어제 한 일", "What I did", "Lo que hice", "昨日したこと", "昨天做的事", "Việc đã làm", "Ce que j'ai fait", "Cosa ho fatto", "O que eu fiz", "Что я делал", "Yang kulakukan", "ما فعلته", "สิ่งที่ทำเมื่อวาน", "मैंने क्या किया") },
      { id: "past.trips", about: "trips, places you visited, experiences you have had", name: n("다녀온 곳과 경험", "Places and experiences", "Lugares y experiencias", "行った場所と経験", "去过的地方和经历", "Nơi đã đến và trải nghiệm", "Lieux et expériences", "Luoghi ed esperienze", "Lugares e experiências", "Места и опыт", "Tempat dan pengalaman", "أماكن وتجارب", "ที่ที่ไปและประสบการณ์", "जगहें और अनुभव") },
      { id: "past.stories", about: "telling a story, events, what happened and how it felt", name: n("있었던 일 이야기하기", "Telling a story", "Contar una historia", "出来事を話す", "讲经历", "Kể chuyện", "Raconter une histoire", "Raccontare un fatto", "Contar uma história", "Рассказать историю", "Bercerita", "سرد قصة", "เล่าเรื่องที่เกิดขึ้น", "किस्सा सुनाना") },
    ],
  },
  {
    id: "future",
    name: n("앞으로", "What's next", "Lo que viene", "これから", "接下来", "Sắp tới", "Et après", "Prossimamente", "O que vem", "Что дальше", "Ke depan", "ما سيأتي", "ต่อจากนี้", "आगे क्या"),
    topics: [
      { id: "future.plans", about: "plans, intentions, what you will do", name: n("계획", "Plans", "Planes", "予定", "计划", "Kế hoạch", "Projets", "Programmi", "Planos", "Планы", "Rencana", "الخطط", "แผน", "योजनाएँ") },
      { id: "future.meet", about: "making appointments, inviting, accepting or declining, arranging to meet", name: n("약속 잡기", "Making plans together", "Quedar con alguien", "約束をする", "约时间", "Hẹn gặp", "Fixer un rendez-vous", "Darsi appuntamento", "Marcar um encontro", "Договориться о встрече", "Membuat janji", "تحديد موعد", "นัดหมาย", "मिलने का समय तय करना") },
      { id: "future.wishes", about: "wishes, hopes, dreams, what you would like", name: n("바라는 것", "Wishes and hopes", "Deseos", "願いと夢", "愿望", "Mong muốn", "Souhaits", "Desideri", "Desejos", "Желания", "Keinginan", "الأمنيات", "สิ่งที่อยากได้", "इच्छाएँ") },
    ],
  },
  {
    id: "mind",
    name: n("생각과 느낌", "Thoughts and feelings", "Opiniones y sentimientos", "考えと気持ち", "想法和感受", "Suy nghĩ và cảm xúc", "Pensées et sentiments", "Pensieri e sentimenti", "Ideias e sentimentos", "Мысли и чувства", "Pikiran dan perasaan", "الأفكار والمشاعر", "ความคิดและความรู้สึก", "विचार और भावनाएँ"),
    topics: [
      { id: "mind.likes", about: "likes and dislikes, preferences, favourites", name: n("좋고 싫음", "Likes and dislikes", "Gustos", "好き嫌い", "喜好", "Thích và không thích", "Goûts", "Gusti", "Gostos", "Нравится и нет", "Suka dan tidak suka", "ما أحبه وما لا أحبه", "ชอบและไม่ชอบ", "पसंद-नापसंद") },
      { id: "mind.reasons", about: "giving opinions and reasons, explaining why", name: n("이유 말하기", "Giving reasons", "Dar razones", "理由を言う", "说理由", "Nói lý do", "Donner des raisons", "Dare motivi", "Dar razões", "Объяснить почему", "Memberi alasan", "إبداء الأسباب", "บอกเหตุผล", "कारण बताना") },
      { id: "mind.feelings", about: "feelings, emotions, agreeing and disagreeing, reacting", name: n("감정과 맞장구", "Feelings and reactions", "Emociones y reacciones", "気持ちとあいづち", "情绪和回应", "Cảm xúc và phản hồi", "Émotions et réactions", "Emozioni e reazioni", "Emoções e reações", "Эмоции и реакции", "Perasaan dan tanggapan", "المشاعر والتفاعل", "อารมณ์และการตอบรับ", "भावनाएँ और प्रतिक्रिया") },
    ],
  },
  {
    id: "help",
    name: n("부탁과 해결", "Asking and solving", "Pedir y resolver", "頼みごとと解決", "请求和解决", "Nhờ và giải quyết", "Demander et résoudre", "Chiedere e risolvere", "Pedir e resolver", "Просьбы и решения", "Meminta dan menyelesaikan", "الطلب والحل", "ขอร้องและแก้ปัญหา", "माँगना और सुलझाना"),
    topics: [
      { id: "help.asking", about: "asking for things, requests, asking for help or permission", name: n("부탁하기", "Asking for things", "Pedir cosas", "お願いする", "请求帮助", "Nhờ vả", "Demander quelque chose", "Chiedere qualcosa", "Pedir algo", "Попросить", "Meminta sesuatu", "طلب شيء", "ขอร้อง", "कुछ माँगना") },
      { id: "help.problems", about: "problems, complaints, something broken or wrong, fixing it", name: n("문제 말하기", "Explaining a problem", "Explicar un problema", "問題を伝える", "说明问题", "Nói về vấn đề", "Expliquer un problème", "Spiegare un problema", "Explicar um problema", "Объяснить проблему", "Menjelaskan masalah", "شرح مشكلة", "บอกปัญหา", "समस्या बताना") },
      { id: "help.sorry", about: "apologizing, thanking, polite expressions", name: n("사과와 감사", "Sorry and thank you", "Disculpas y gracias", "謝罪とお礼", "道歉和感谢", "Xin lỗi và cảm ơn", "Excuses et remerciements", "Scuse e ringraziamenti", "Desculpas e agradecimentos", "Извинения и благодарность", "Maaf dan terima kasih", "الاعتذار والشكر", "ขอโทษและขอบคุณ", "माफ़ी और धन्यवाद") },
    ],
  },
  {
    id: "out",
    name: n("밖에서", "Out and about", "Por la calle", "外で", "在外面", "Ra ngoài", "En ville", "In giro", "Na rua", "В городе", "Di luar", "في الخارج", "นอกบ้าน", "बाहर"),
    topics: [
      { id: "out.shops", about: "shops, restaurants, cafes, ordering, paying", name: n("가게·식당", "Shops and restaurants", "Tiendas y restaurantes", "お店・レストラン", "商店和餐厅", "Cửa hàng và nhà hàng", "Magasins et restaurants", "Negozi e ristoranti", "Lojas e restaurantes", "Магазины и рестораны", "Toko dan restoran", "المحلات والمطاعم", "ร้านค้าและร้านอาหาร", "दुकानें और रेस्तराँ") },
      { id: "out.transport", about: "directions, transport, getting around, tickets", name: n("길과 교통", "Directions and transport", "Direcciones y transporte", "道案内と交通", "问路和交通", "Đường đi và giao thông", "Itinéraires et transports", "Indicazioni e trasporti", "Direções e transporte", "Дорога и транспорт", "Arah dan transportasi", "الاتجاهات والمواصلات", "เส้นทางและการเดินทาง", "रास्ता और यातायात") },
      { id: "out.travel", about: "hotels, travel, airports, sightseeing", name: n("숙소·여행", "Hotels and travel", "Hoteles y viajes", "宿と旅行", "住宿和旅行", "Khách sạn và du lịch", "Hôtels et voyages", "Hotel e viaggi", "Hotéis e viagens", "Отели и поездки", "Hotel dan perjalanan", "الفنادق والسفر", "ที่พักและการท่องเที่ยว", "होटल और यात्रा") },
    ],
  },
  {
    id: "work",
    name: n("일과 공부", "Work and study", "Trabajo y estudios", "仕事と勉強", "工作和学习", "Công việc và học tập", "Travail et études", "Lavoro e studio", "Trabalho e estudos", "Работа и учёба", "Kerja dan belajar", "العمل والدراسة", "งานและการเรียน", "काम और पढ़ाई"),
    topics: [
      { id: "work.meetings", about: "meetings, conversations with colleagues, small talk at work", name: n("회의와 동료", "Meetings and colleagues", "Reuniones y colegas", "会議と同僚", "会议和同事", "Họp và đồng nghiệp", "Réunions et collègues", "Riunioni e colleghi", "Reuniões e colegas", "Встречи и коллеги", "Rapat dan rekan kerja", "الاجتماعات والزملاء", "การประชุมและเพื่อนร่วมงาน", "मीटिंग और सहकर्मी") },
      { id: "work.writing", about: "emails, messages, writing formally", name: n("메일·메시지", "Emails and messages", "Correos y mensajes", "メール・メッセージ", "邮件和消息", "Email và tin nhắn", "E-mails et messages", "Email e messaggi", "E-mails e mensagens", "Письма и сообщения", "Email dan pesan", "البريد والرسائل", "อีเมลและข้อความ", "ईमेल और संदेश") },
      { id: "work.study", about: "studying, classes, asking questions, learning the language itself", name: n("공부와 질문", "Studying and asking", "Estudiar y preguntar", "勉強と質問", "学习和提问", "Học và hỏi", "Étudier et poser des questions", "Studiare e fare domande", "Estudar e perguntar", "Учёба и вопросы", "Belajar dan bertanya", "الدراسة والسؤال", "เรียนและถามคำถาม", "पढ़ाई और सवाल") },
    ],
  },
];

export const NOTE_TOPIC_IDS: string[] = NOTE_OUTLINE.flatMap((chapter) => chapter.topics.map((topic) => topic.id));

export function isNoteTopicId(value: unknown): value is string {
  return typeof value === "string" && NOTE_TOPIC_IDS.includes(value);
}

export function noteName(names: Names, locale: string): string {
  return names[(NOTE_LOCALES as readonly string[]).includes(locale) ? (locale as NoteLocale) : "en"];
}

export function chapterOf(topicId: string): NoteChapter | null {
  return NOTE_OUTLINE.find((chapter) => chapter.topics.some((topic) => topic.id === topicId)) ?? null;
}

export function topicById(topicId: string): NoteTopic | null {
  for (const chapter of NOTE_OUTLINE) {
    const topic = chapter.topics.find((row) => row.id === topicId);
    if (topic) return topic;
  }
  return null;
}
