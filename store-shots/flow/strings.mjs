// 스토어 학습 흐름 세트(2026-10-30, 사용자 "단순 기능나열이 아니라 앱에서 뭘 해야 할지, 학습 흐름이 명확하게.
// 로그인·아이콘 같은 세부는 넣지 말고 핵심 위주로, 큰 줄기의 학습 흐름 → 세부 기능은 뒤쪽에 몰아서").
//
// 1장 = 하루 흐름 한눈에(네 단계), 2~5장 = 그 단계 하나씩(큰 화면 하나 + 위에 단계 막대), 6~8장 = 세부 기능(화면 둘).
// 단계 이름은 앱 버튼 문구 그대로(copy.ts planTitle·scriptSay·keepTitle·homeTabTalk) — compose.mjs가 읽는다.
// 화면: tmp/store-raw/<locale>/<장면>.png (capture-whats-new.mjs store-flow). 화면 크기 824×1830.

/** crop = 화면에서 보일 위쪽 끝(0~1). 큰 화면은 아래로 넘쳐 잘린다. */
export const SHOTS = [
  { id: "overview", kind: "overview", rows: [["today-plan", 0.085], ["script-play", 0.13], ["keep-quiz", 0.035], ["chat-fix-open", 0.08]] },
  { id: "plan", kind: "step", step: 0, scene: "today-plan", crop: 0.085 },
  { id: "script", kind: "step", step: 1, scene: "script-play", crop: 0.0 },
  // 지속 학습 카드(▶ 계속 공부) 위에, 그걸 눌러 푼 문제를 크게 띄운다.
  { id: "keep", kind: "step", step: 2, scene: "keep-learning", crop: 0.39, float: ["keep-quiz", 0.035, 0.425] },
  { id: "talk", kind: "step", step: 3, scene: "chat-fix-open", crop: 0.075 },
  { id: "help", kind: "detail", scenes: [["chat-expression", 0.1], ["chat-ask", 0.0]] },
  { id: "callvideo", kind: "detail", scenes: [["meant", 0.0], ["video-study", 0.04]] },
  { id: "together", kind: "detail", scenes: [["quote", 0.0], ["group-pick", 0.0]] },
];

/**
 * 장마다 글. overview = [작은 제목, 큰 제목, [단계 설명 넷]], step = [큰 제목, 설명],
 * detail = [큰 제목, [화면 이름 둘], 설명]. more = 세부 장 위 작은 제목.
 */
export const COPY = {
  ko: {
    overview: ["하루 학습 흐름", "매일 이 순서대로\n말하게 돼요", ["오늘 할 대본을 정해 줘요", "내 줄을 소리 내어 말해요", "틀린 건 퀴즈로 다시 나와요", "배운 걸 AI 튜터와 써 봐요"]],
    plan: ["오늘 할 것을\n정해 줘요", "하루 5·10·20분, 며칠이면 끝나는지 보여요"],
    script: ["내 줄을 말하면\n바로 짚어 줘요", "완벽하면 ★, 더 자연스러운 말이 있으면 알려 줘요"],
    keep: ["틀린 건 다시 나와요\n이번엔 ✓", "복습·어휘·문법·표현을 짧은 퀴즈로"],
    talk: ["배운 걸\n대화에서 써 봐요", "AI 튜터와 대화하면 틀린 곳만 고쳐 줘요"],
    more: "더 할 수 있는 것",
    help: ["막히면 한국어로", ["하고 싶던 말 보기", "모르는 부분만 묻기"], "편한 말로 써도 튜터는 배우는 언어로 이어가요"],
    callvideo: ["소리 내어 통화하고\n진짜 영상으로", ["AI 통화", "영상 학습"], "엉망으로 말해도 하려던 말을 찾아 줘요"],
    together: ["같은 언어 배우는\n사람들과", ["Room 목소리 대화", "단체방"], "실시간 자막을 보며 목소리로, 단체방으로"],
  },
  en: {
    overview: ["YOUR DAILY FLOW", "Every day,\nin this order", ["The app picks today's scripts", "Say your lines out loud", "Mistakes come back as quizzes", "Use it with the AI tutor"]],
    plan: ["Today's lesson,\nalready planned", "5, 10 or 20 minutes a day — see when you'll finish"],
    script: ["Say your line,\nget instant feedback", "★ when it's perfect, a more natural way when there is one"],
    keep: ["Mistakes come back.\nThis time: ✓", "Short quizzes on review, words, grammar and phrases"],
    talk: ["Use what you learned\nin real conversation", "Chat with the AI tutor — it fixes only what's wrong"],
    more: "MORE YOU CAN DO",
    help: ["Stuck? Write it in English", ["See how to say it", "Ask about just one part"], "Write in your language — the tutor keeps going in the one you're learning"],
    callvideo: ["Talk out loud,\nlearn from real videos", ["AI calls", "Video lessons"], "Even if it comes out messy, it finds what you meant"],
    together: ["Practice with people\nlearning the same language", ["Voice rooms", "Group chats"], "Talk with live captions, or keep going in group chats"],
  },
  ja: {
    overview: ["毎日の学習の流れ", "毎日この順番で\n話せるようになる", ["今日の台本をアプリが決める", "自分のセリフを声に出す", "間違いはクイズでまた出る", "覚えたことをAIチューターと使う"]],
    plan: ["今日やることを\n決めてくれる", "1日5・10・20分、何日で終わるか分かる"],
    script: ["セリフを言うと\nすぐに評価", "完璧なら★、もっと自然な言い方があれば教えてくれる"],
    keep: ["間違いはまた出る\n今度は✓", "復習・語彙・文法・表現を短いクイズで"],
    talk: ["覚えたことを\n会話で使う", "AIチューターと話すと、間違いだけ直してくれる"],
    more: "ほかにできること",
    help: ["詰まったら日本語で", ["言いたかったことを見る", "分からない所だけ質問"], "母語で書いても、チューターは学習中の言語で続けてくれる"],
    callvideo: ["声で通話して\n本物の動画で学ぶ", ["AI通話", "動画学習"], "めちゃくちゃに話しても、言いたかったことを見つけてくれる"],
    together: ["同じ言語を学ぶ\n仲間と", ["Roomで声の会話", "グループチャット"], "リアルタイム字幕を見ながら声で、グループチャットでも"],
  },
  zh: {
    overview: ["每天的学习流程", "每天按这个顺序\n开口说", ["应用安排今天的对话脚本", "把自己的台词大声说出来", "说错的会变成小测验再出现", "学到的跟AI导师用起来"]],
    plan: ["今天学什么\n帮你定好", "每天5·10·20分钟，几天学完一目了然"],
    script: ["说出你的台词\n马上点评", "完美得★，有更自然的说法也会告诉你"],
    keep: ["错过的会再出现\n这次答对✓", "复习·词汇·语法·表达，都是小测验"],
    talk: ["学到的\n用在对话里", "和AI导师聊天，只纠正说错的地方"],
    more: "还能做的",
    help: ["卡住了就用中文", ["看看想说的话怎么说", "只问不懂的部分"], "用母语写，导师也会用你在学的语言继续聊"],
    callvideo: ["开口通话\n看真实视频学", ["AI通话", "视频学习"], "说得再乱，也能找出你想说的话"],
    together: ["和学同一门语言的人\n一起练", ["Room语音聊天", "群聊"], "看着实时字幕用语音聊，也能在群里继续"],
  },
  es: {
    overview: ["TU RUTINA DIARIA", "Cada día,\nen este orden", ["La app elige los guiones de hoy", "Di tus frases en voz alta", "Los errores vuelven como quiz", "Úsalo con el tutor IA"]],
    plan: ["La lección de hoy,\nya planificada", "5, 10 o 20 minutos al día: ves cuándo terminas"],
    script: ["Di tu frase\ny te corrige al instante", "★ si es perfecta y una forma más natural si la hay"],
    keep: ["Los errores vuelven.\nEsta vez: ✓", "Quiz cortos de repaso, vocabulario, gramática y frases"],
    talk: ["Usa lo aprendido\nen una conversación", "Habla con el tutor IA: solo corrige lo que está mal"],
    more: "MÁS COSAS",
    help: ["¿Atascado? Escribe en español", ["Ver cómo decirlo", "Preguntar solo una parte"], "Escribe en tu idioma: el tutor sigue en el que aprendes"],
    callvideo: ["Habla en voz alta\ny aprende con videos reales", ["Llamadas con IA", "Clases con video"], "Aunque te salga mal, encuentra lo que querías decir"],
    together: ["Practica con gente\nque aprende tu idioma", ["Salas de voz", "Chats grupales"], "Habla con subtítulos en vivo o sigue en chats grupales"],
  },
  hi: {
    overview: ["रोज़ की पढ़ाई का क्रम", "हर दिन इसी क्रम में\nबोलना सीखें", ["ऐप आज की स्क्रिप्ट चुनता है", "अपनी लाइन बोलकर कहें", "गलतियाँ क्विज़ बनकर लौटती हैं", "सीखा हुआ AI ट्यूटर के साथ आज़माएँ"]],
    plan: ["आज क्या पढ़ना है\nपहले से तय", "रोज़ 5·10·20 मिनट — कितने दिन में पूरा, दिखता है"],
    script: ["अपनी लाइन बोलें\nतुरंत फ़ीडबैक", "सही हो तो ★, और स्वाभाविक तरीका हो तो वो भी"],
    keep: ["गलतियाँ फिर आती हैं\nइस बार ✓", "दोहराना·शब्द·व्याकरण·वाक्यांश छोटे क्विज़ में"],
    talk: ["सीखा हुआ\nबातचीत में इस्तेमाल करें", "AI ट्यूटर से बात करें — सिर्फ़ गलती सुधारता है"],
    more: "और क्या कर सकते हैं",
    help: ["अटकें तो हिंदी में लिखें", ["कहना था वो कैसे कहें", "सिर्फ़ एक हिस्सा पूछें"], "अपनी भाषा में लिखें — ट्यूटर सीखी जा रही भाषा में आगे बढ़ता है"],
    callvideo: ["बोलकर कॉल करें\nअसली वीडियो से सीखें", ["AI कॉल", "वीडियो से पढ़ाई"], "गड़बड़ बोलें तब भी, आप क्या कहना चाहते थे वो ढूँढता है"],
    together: ["वही भाषा सीखने वालों\nके साथ", ["Room में आवाज़ से बात", "ग्रुप चैट"], "लाइव कैप्शन के साथ आवाज़ से, या ग्रुप चैट में"],
  },
  pt: {
    overview: ["SUA ROTINA DIÁRIA", "Todo dia,\nnesta ordem", ["O app escolhe os roteiros de hoje", "Fale suas falas em voz alta", "Erros voltam como quiz", "Use com o tutor de IA"]],
    plan: ["A lição de hoje,\njá planejada", "5, 10 ou 20 minutos por dia — veja quando termina"],
    script: ["Fale sua fala\ne receba correção na hora", "★ quando está perfeito, e um jeito mais natural quando houver"],
    keep: ["Os erros voltam.\nDesta vez: ✓", "Quizzes curtos de revisão, vocabulário, gramática e expressões"],
    talk: ["Use o que aprendeu\nnuma conversa", "Converse com o tutor de IA — ele corrige só o que está errado"],
    more: "MAIS RECURSOS",
    help: ["Travou? Escreva em português", ["Ver como dizer", "Perguntar só uma parte"], "Escreva no seu idioma — o tutor continua no que você aprende"],
    callvideo: ["Fale em voz alta\ne aprenda com vídeos reais", ["Chamadas com IA", "Aulas com vídeo"], "Mesmo saindo errado, ele encontra o que você quis dizer"],
    together: ["Pratique com quem\naprende o mesmo idioma", ["Salas de voz", "Grupos"], "Converse com legendas ao vivo ou continue nos grupos"],
  },
  vi: {
    overview: ["LỘ TRÌNH MỖI NGÀY", "Mỗi ngày\ntheo thứ tự này", ["Ứng dụng chọn kịch bản hôm nay", "Nói to câu thoại của bạn", "Câu sai quay lại thành câu đố", "Dùng điều đã học với gia sư AI"]],
    plan: ["Bài hôm nay\nđã lên sẵn", "5·10·20 phút mỗi ngày — biết bao lâu thì xong"],
    script: ["Nói câu của bạn\nnhận xét ngay", "Hoàn hảo được ★, có cách tự nhiên hơn thì gợi ý"],
    keep: ["Câu sai sẽ quay lại\nLần này ✓", "Câu đố ngắn: ôn tập, từ vựng, ngữ pháp, mẫu câu"],
    talk: ["Dùng điều đã học\ntrong hội thoại", "Trò chuyện với gia sư AI — chỉ sửa chỗ sai"],
    more: "CÒN CÓ THỂ",
    help: ["Bí thì viết tiếng Việt", ["Xem cách nói điều muốn nói", "Chỉ hỏi phần chưa hiểu"], "Viết bằng tiếng mẹ đẻ — gia sư vẫn tiếp tục bằng ngôn ngữ bạn học"],
    callvideo: ["Gọi thoại nói to\nhọc từ video thật", ["Gọi với AI", "Học qua video"], "Nói lộn xộn vẫn tìm ra điều bạn muốn nói"],
    together: ["Luyện cùng người\nhọc cùng ngôn ngữ", ["Phòng nói chuyện", "Nhóm chat"], "Nói chuyện có phụ đề trực tiếp, hoặc tiếp tục trong nhóm chat"],
  },
  th: {
    overview: ["ลำดับการเรียนแต่ละวัน", "ทุกวัน\nตามลำดับนี้", ["แอปเลือกบทของวันนี้ให้", "พูดบทของคุณออกเสียง", "ที่ผิดกลับมาเป็นควิซ", "ใช้สิ่งที่เรียนกับติวเตอร์ AI"]],
    plan: ["วันนี้เรียนอะไร\nจัดไว้ให้แล้ว", "วันละ 5·10·20 นาที รู้ว่ากี่วันจบ"],
    script: ["พูดบทของคุณ\nได้ผลทันที", "เป๊ะได้ ★ ถ้ามีแบบที่เป็นธรรมชาติกว่าก็บอก"],
    keep: ["ที่ผิดจะกลับมา\nครั้งนี้ ✓", "ควิซสั้นๆ ทบทวน คำศัพท์ ไวยากรณ์ สำนวน"],
    talk: ["ใช้สิ่งที่เรียน\nในบทสนทนา", "คุยกับติวเตอร์ AI แก้แค่ที่ผิด"],
    more: "ทำอะไรได้อีก",
    help: ["ติดก็พิมพ์ภาษาไทย", ["ดูวิธีพูดสิ่งที่อยากพูด", "ถามเฉพาะส่วนที่ไม่เข้าใจ"], "พิมพ์ภาษาของคุณได้ ติวเตอร์ตอบต่อด้วยภาษาที่เรียน"],
    callvideo: ["โทรคุยออกเสียง\nเรียนจากวิดีโอจริง", ["โทรกับ AI", "เรียนจากวิดีโอ"], "พูดผิดๆ ถูกๆ ก็หาสิ่งที่คุณอยากพูดให้"],
    together: ["ฝึกกับคนที่\nเรียนภาษาเดียวกัน", ["ห้องคุยด้วยเสียง", "แชทกลุ่ม"], "คุยด้วยเสียงพร้อมซับสด หรือคุยต่อในแชทกลุ่ม"],
  },
  id: {
    overview: ["ALUR BELAJAR HARIAN", "Setiap hari\ndengan urutan ini", ["Aplikasi memilih naskah hari ini", "Ucapkan bagianmu dengan suara", "Yang salah kembali jadi kuis", "Pakai bersama tutor AI"]],
    plan: ["Pelajaran hari ini\nsudah disiapkan", "5·10·20 menit sehari — lihat kapan selesai"],
    script: ["Ucapkan kalimatmu,\nlangsung dinilai", "★ kalau sempurna, dan cara yang lebih alami kalau ada"],
    keep: ["Yang salah kembali lagi.\nKali ini ✓", "Kuis singkat: ulasan, kosakata, tata bahasa, ungkapan"],
    talk: ["Pakai yang dipelajari\ndalam percakapan", "Ngobrol dengan tutor AI — hanya yang salah dibetulkan"],
    more: "BISA JUGA",
    help: ["Buntu? Tulis pakai bahasa Indonesia", ["Lihat cara mengatakannya", "Tanya bagian yang belum paham"], "Tulis pakai bahasamu — tutor tetap lanjut dengan bahasa yang kamu pelajari"],
    callvideo: ["Bicara lewat panggilan,\nbelajar dari video asli", ["Panggilan AI", "Belajar dari video"], "Biar berantakan, ia menemukan maksudmu"],
    together: ["Latihan bersama yang\nbelajar bahasa yang sama", ["Ruang suara", "Grup chat"], "Ngobrol dengan teks langsung, atau lanjut di grup chat"],
  },
  ar: {
    overview: ["مسار التعلّم اليومي", "كل يوم\nبهذا الترتيب", ["التطبيق يختار نصوص اليوم", "قل جُملك بصوت عالٍ", "الأخطاء تعود في اختبار قصير", "استخدم ما تعلّمته مع المعلّم الذكي"]],
    plan: ["درس اليوم\nجاهز مسبقًا", "5 أو 10 أو 20 دقيقة يوميًا، وتعرف متى تنتهي"],
    script: ["قل جملتك\nواحصل على تقييم فوري", "★ إن كانت مثالية، وصيغة أكثر طبيعية إن وُجدت"],
    keep: ["الأخطاء تعود\nوهذه المرة ✓", "اختبارات قصيرة: مراجعة ومفردات وقواعد وتعابير"],
    talk: ["استخدم ما تعلّمته\nفي محادثة", "تحدّث مع المعلّم الذكي، يصحّح الخطأ فقط"],
    more: "ما يمكنك فعله أيضًا",
    help: ["تعثّرت؟ اكتب بالعربية", ["اعرف كيف تقولها", "اسأل عن جزء واحد فقط"], "اكتب بلغتك، ويكمل المعلّم باللغة التي تتعلّمها"],
    callvideo: ["تكلّم في مكالمة\nوتعلّم من فيديوهات حقيقية", ["مكالمات مع الذكاء", "التعلّم بالفيديو"], "حتى لو قلتها بشكل غير صحيح، يجد ما قصدته"],
    together: ["تدرّب مع من يتعلّمون\nاللغة نفسها", ["غرف صوتية", "دردشات جماعية"], "تحدّث بالصوت مع ترجمة فورية، أو تابع في الدردشات الجماعية"],
  },
  fr: {
    overview: ["VOTRE PARCOURS DU JOUR", "Chaque jour,\ndans cet ordre", ["L'appli choisit les dialogues du jour", "Dites vos répliques à voix haute", "Les erreurs reviennent en quiz", "Utilisez-le avec le tuteur IA"]],
    plan: ["La leçon du jour,\ndéjà prévue", "5, 10 ou 20 minutes par jour : vous voyez quand vous finirez"],
    script: ["Dites votre réplique,\nretour immédiat", "★ si c'est parfait, une tournure plus naturelle s'il y en a une"],
    keep: ["Les erreurs reviennent.\nCette fois : ✓", "Quiz courts : révision, vocabulaire, grammaire, expressions"],
    talk: ["Utilisez ce que vous avez appris\nen conversation", "Discutez avec le tuteur IA : il corrige seulement les erreurs"],
    more: "ET AUSSI",
    help: ["Bloqué ? Écrivez en français", ["Voir comment le dire", "Demander juste un passage"], "Écrivez dans votre langue : le tuteur continue dans celle que vous apprenez"],
    callvideo: ["Parlez à voix haute,\napprenez avec de vraies vidéos", ["Appels avec l'IA", "Leçons vidéo"], "Même si c'est maladroit, il retrouve ce que vous vouliez dire"],
    together: ["Pratiquez avec ceux qui\napprennent la même langue", ["Salons vocaux", "Discussions de groupe"], "Parlez avec des sous-titres en direct, ou continuez en groupe"],
  },
};

/** 배우는 언어별 등록정보(k1~k5): 1장 작은 제목 앞에 배우는 언어. */
export const KICKER = { "ko-ja": "일본어", "ko-zh": "중국어", "ko-es": "스페인어", "en-ko": "KOREAN", "ja-ko": "韓国語" };
