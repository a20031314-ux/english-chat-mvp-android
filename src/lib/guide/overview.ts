/**
 * 사용법 창의 큰 그림(2026-10-29 사용자 "텍스트는 줄이고 실사용 이미지나 영상으로 — 탭별로 해야 할 것, 할 수 있는 것,
 * 전체 학습 흐름이 명확하게"). 맨 앞 "학습 흐름"(영상 하나 + 그림 셋, 한 줄씩)과 장마다 카드 둘(해야 할 것 · 할 수 있는 것,
 * 그림 + 한 줄). 예전 칸들은 그 아래 접힌 "세부 기능"에 그대로 남는다(GuideSheet).
 *
 * 이 구조를 그리는 빌드만 `overview=1`을 보내 받는다 — 옛 빌드의 응답은 그대로.
 * 그림은 /guide/<locale>/<shot>.webp(capture-whats-new.mjs guide·guide-overview), 영상은 guide-clips.mjs flow.
 * 버튼·탭 이름은 {ui:<키>} — 화면 문구 그대로.
 */
export type GuideCard = { text: string; shot: string };
export type GuideOverview = {
  flow: { clip: string; shot: string; steps: GuideCard[] };
  chapters: Record<string, { todo: GuideCard; cando: GuideCard }>;
};

/** 장 id → [해야 할 것 그림, 할 수 있는 것 그림]. */
const CARD_SHOTS: Record<string, [string, string]> = {
  // 2.79(2026-11-01): My = 문장구조 수업·Logbank, 통화 = 실제 통화 화면·통화 정리(capture-bank-guide·capture-whats-new guide-279 그림).
  my: ["bank-stage-lesson", "bank-log-week"],
  "ai-chat": ["chat-fix", "chat-expression"],
  "ai-call": ["real-call", "call-recap"],
  messages: ["talk-dm", "r69-groups"],
  video: ["video-library", "video-ask"],
  people: ["people-lang", "board-topics"],
  rooms: ["r69-free", "rooms-room"],
};
const FLOW_SHOTS = ["bank-stage-today", "bank-keep-quiz", "talk-calls"];
export const OVERVIEW_CHAPTERS = Object.keys(CARD_SHOTS);

type Lines = { flow: [string, string, string]; cards: Record<keyof typeof CARD_SHOTS, [string, string]> };

const P = "{ui:planTitle}";
const K = "{ui:keepTitle}";
const T = "{ui:homeTabTalk}";
const M = "{ui:myProgressTitle}";
const S = "{ui:stagebankTitle}";
const G = "{ui:logbankTitle}";
const R = "{ui:callRecapTitle}";

const TEXT: Record<string, Lines> = {
  ko: {
    flow: [`1. 「${S}」: 오늘 할 것을 하나씩`, `2. 「${K}」: 직접 써서 풀고 시험`, `3. 「${T}」: 배운 말을 AI 튜터와 써 봐요`],
    cards: {
      my: [`문장구조를 설명 → 퀴즈 → 대화로 익혀요`, `「${G}」: 날마다 한 공부가 모여요`],
      "ai-chat": ["학습 언어로 쓰면 튜터가 고쳐 줘요", "막히면 편한 말로 — 표현을 받아 써요"],
      "ai-call": [`📞 진짜 통화처럼 말해요`, `끝나면 「${R}」에서 내 문장으로 수업`],
      messages: ["1:1 메시지·📞 통화로 연습해요", "단체방에서 여럿이 함께"],
      video: ["영상 하나 골라 자막으로 봐요", "문장을 골라 뜻·문법을 물어봐요"],
      people: ["같은 언어를 배우는 사람 찾기", "게시판에 묻고 메이트 구하기"],
      rooms: ["방을 만들거나 들어가요", "말하거나 듣기만 — 자막·번역"],
    },
  },
  en: {
    flow: [`1. “${S}”: today’s study, one at a time`, `2. “${K}”: type answers and take tests`, `3. “${T}”: use it with the AI tutor`],
    cards: {
      my: [`Learn a pattern: explanation → quiz → talk`, `“${G}”: each day’s work in one place`],
      "ai-chat": ["Write in the language you learn — the tutor corrects it", "Stuck? Write it your way and get the phrase"],
      "ai-call": [`📞 Talk like a real call`, `Afterwards, “${R}” turns your sentence into a lesson`],
      messages: ["Practise in one-to-one messages and 📞 calls", "Group chats with several people"],
      video: ["Pick a video and watch with subtitles", "Pick a sentence and ask what it means"],
      people: ["Find people learning the same language", "Ask on the board, find study mates"],
      rooms: ["Open a room or join one", "Talk or just listen — captions and translation"],
    },
  },
  es: {
    flow: [`1. «${S}»: lo de hoy, uno a uno`, `2. «${K}»: escribe respuestas y haz exámenes`, `3. «${T}»: úsalo con el tutor IA`],
    cards: {
      my: [`Aprende una estructura: explicación → prueba → diálogo`, `«${G}»: lo de cada día en un sitio`],
      "ai-chat": ["Escribe en el idioma que aprendes: el tutor lo corrige", "¿Te atascas? Escríbelo a tu manera y recibe la frase"],
      "ai-call": [`📞 Habla como en una llamada real`, `Al final, «${R}» hace una lección con tu frase`],
      messages: ["Practica con mensajes y 📞 llamadas uno a uno", "Chats de grupo con varias personas"],
      video: ["Elige un vídeo y míralo con subtítulos", "Elige una frase y pregunta qué significa"],
      people: ["Encuentra gente que aprende tu idioma", "Pregunta en el tablón y busca compañeros"],
      rooms: ["Abre una sala o entra en una", "Habla o solo escucha: subtítulos y traducción"],
    },
  },
  ja: {
    flow: [`1.「${S}」：今日やることを1つずつ`, `2.「${K}」：書いて解いてテスト`, `3.「${T}」：覚えた言葉をAIチューターと使う`],
    cards: {
      my: [`文型を説明 → クイズ → 会話で身につける`, `「${G}」：毎日の学習がたまる`],
      "ai-chat": ["学習言語で書くとチューターが直してくれる", "詰まったら普段の言葉で — 表現を受け取る"],
      "ai-call": [`📞 本物の通話のように話す`, `終わったら「${R}」で自分の文のレッスン`],
      messages: ["1対1のメッセージ・📞通話で練習", "グループチャットでみんなと"],
      video: ["動画を選んで字幕で見る", "文を選んで意味・文法を聞く"],
      people: ["同じ言語を学ぶ人を探す", "掲示板で質問・仲間探し"],
      rooms: ["ルームを作る・入る", "話す・聞くだけでも — 字幕と翻訳"],
    },
  },
  zh: {
    flow: [`1.「${S}」：今天的任务逐个完成`, `2.「${K}」：自己写答案、参加考试`, `3.「${T}」：和AI导师用学到的话`],
    cards: {
      my: [`句型：讲解 → 小测 → 对话`, `「${G}」：每天的学习都在这里`],
      "ai-chat": ["用学习语言写，导师帮你改", "卡住了就用自己的话写，拿到表达"],
      "ai-call": [`📞 像真通话一样说`, `结束后在「${R}」用你的句子上课`],
      messages: ["用一对一消息和📞通话练习", "在群聊里和大家一起"],
      video: ["选一个视频，看着字幕学", "选一句话，问意思和语法"],
      people: ["找学同一种语言的人", "在留言板提问、找学伴"],
      rooms: ["开个房间或加入", "说话或只听 — 字幕和翻译"],
    },
  },
  vi: {
    flow: [`1. “${S}”: việc hôm nay, từng mục một`, `2. “${K}”: tự gõ đáp án và làm bài kiểm tra`, `3. “${T}”: dùng điều đã học với gia sư AI`],
    cards: {
      my: [`Học mẫu câu: giải thích → câu đố → hội thoại`, `“${G}”: việc học mỗi ngày ở một chỗ`],
      "ai-chat": ["Viết bằng ngôn ngữ đang học — gia sư sửa cho", "Bí thì viết theo cách của bạn, nhận cách nói"],
      "ai-call": [`📞 Nói như gọi thật`, `Gọi xong, “${R}” biến câu của bạn thành bài học`],
      messages: ["Luyện bằng tin nhắn và 📞 gọi 1:1", "Nhóm chat cùng nhiều người"],
      video: ["Chọn một video, xem với phụ đề", "Chọn câu, hỏi nghĩa và ngữ pháp"],
      people: ["Tìm người học cùng ngôn ngữ", "Hỏi trên bảng tin, tìm bạn học"],
      rooms: ["Mở phòng hoặc vào phòng", "Nói hoặc chỉ nghe — phụ đề và dịch"],
    },
  },
  fr: {
    flow: [`1. « ${S} » : le travail du jour, un par un`, `2. « ${K} » : écrivez vos réponses, passez des examens`, `3. « ${T} » : utilisez-le avec le tuteur IA`],
    cards: {
      my: [`Une structure : explication → quiz → dialogue`, `« ${G} » : chaque journée au même endroit`],
      "ai-chat": ["Écrivez dans la langue apprise : le tuteur corrige", "Bloqué ? Écrivez à votre façon et recevez la tournure"],
      "ai-call": [`📞 Parlez comme dans un vrai appel`, `Ensuite, « ${R} » fait une leçon de votre phrase`],
      messages: ["Pratiquez en messages et 📞 appels à deux", "Discussions de groupe à plusieurs"],
      video: ["Choisissez une vidéo, regardez avec sous-titres", "Choisissez une phrase et demandez son sens"],
      people: ["Trouvez des gens qui apprennent la même langue", "Posez vos questions au tableau, trouvez des partenaires"],
      rooms: ["Ouvrez un salon ou rejoignez-en un", "Parlez ou écoutez — sous-titres et traduction"],
    },
  },
  it: {
    flow: [`1. «${S}»: il lavoro di oggi, uno alla volta`, `2. «${K}»: scrivi le risposte e fai esami`, `3. «${T}»: usalo con il tutor IA`],
    cards: {
      my: [`Una struttura: spiegazione → quiz → dialogo`, `«${G}»: ogni giorno in un posto`],
      "ai-chat": ["Scrivi nella lingua che studi: il tutor corregge", "Bloccato? Scrivi a modo tuo e ricevi la frase"],
      "ai-call": [`📞 Parla come in una vera chiamata`, `Poi «${R}» fa una lezione sulla tua frase`],
      messages: ["Esercitati con messaggi e 📞 chiamate a due", "Chat di gruppo con più persone"],
      video: ["Scegli un video e guardalo coi sottotitoli", "Scegli una frase e chiedi cosa significa"],
      people: ["Trova chi studia la stessa lingua", "Chiedi in bacheca, trova compagni"],
      rooms: ["Apri una stanza o entra", "Parla o ascolta soltanto — sottotitoli e traduzione"],
    },
  },
  pt: {
    flow: [`1. “${S}”: o de hoje, um por vez`, `2. “${K}”: digite respostas e faça provas`, `3. “${T}”: use com o tutor de IA`],
    cards: {
      my: [`Uma estrutura: explicação → quiz → diálogo`, `“${G}”: cada dia num só lugar`],
      "ai-chat": ["Escreva no idioma que aprende: o tutor corrige", "Travou? Escreva do seu jeito e receba a frase"],
      "ai-call": [`📞 Fale como numa chamada real`, `No fim, “${R}” vira aula com a sua frase`],
      messages: ["Pratique em mensagens e 📞 chamadas a dois", "Grupos com várias pessoas"],
      video: ["Escolha um vídeo e veja com legendas", "Escolha uma frase e pergunte o sentido"],
      people: ["Ache quem aprende o mesmo idioma", "Pergunte no mural, ache parceiros"],
      rooms: ["Abra uma sala ou entre em uma", "Fale ou só escute — legendas e tradução"],
    },
  },
  ru: {
    flow: [`1. «${S}»: задания на сегодня по одному`, `2. «${K}»: вводите ответы и сдавайте тесты`, `3. «${T}»: применяйте с ИИ-репетитором`],
    cards: {
      my: [`Конструкция: объяснение → тест → диалог`, `«${G}»: каждый день в одном месте`],
      "ai-chat": ["Пишите на изучаемом языке — репетитор исправит", "Застряли? Напишите по-своему и получите фразу"],
      "ai-call": [`📞 Говорите как в настоящем звонке`, `Потом «${R}» — урок по вашей фразе`],
      messages: ["Практикуйтесь в личных сообщениях и 📞 звонках", "Групповые чаты с несколькими людьми"],
      video: ["Выберите видео и смотрите с субтитрами", "Выберите фразу и спросите, что она значит"],
      people: ["Найдите тех, кто учит тот же язык", "Спрашивайте на доске, ищите напарников"],
      rooms: ["Создайте комнату или войдите", "Говорите или просто слушайте — субтитры и перевод"],
    },
  },
  id: {
    flow: [`1. “${S}”: tugas hari ini satu per satu`, `2. “${K}”: ketik jawaban dan ikut ujian`, `3. “${T}”: pakai bersama tutor AI`],
    cards: {
      my: [`Pola kalimat: penjelasan → kuis → obrolan`, `“${G}”: belajar tiap hari di satu tempat`],
      "ai-chat": ["Tulis dalam bahasa yang dipelajari — tutor memperbaiki", "Buntu? Tulis dengan caramu, dapatkan ungkapannya"],
      "ai-call": [`📞 Bicara seperti telepon sungguhan`, `Setelahnya, “${R}” jadi pelajaran dari kalimatmu`],
      messages: ["Latihan lewat pesan dan 📞 panggilan 1:1", "Grup chat bersama banyak orang"],
      video: ["Pilih video, tonton dengan subtitle", "Pilih kalimat, tanyakan artinya"],
      people: ["Cari orang yang belajar bahasa yang sama", "Bertanya di papan, cari teman belajar"],
      rooms: ["Buka ruang atau bergabung", "Bicara atau cuma dengar — teks dan terjemahan"],
    },
  },
  ar: {
    flow: [`1. «${S}»: مهام اليوم واحدة واحدة`, `2. «${K}»: اكتب الإجابات وادخل الامتحانات`, `3. «${T}»: استخدمه مع المعلّم الذكي`],
    cards: {
      my: [`تركيب: شرح ← اختبار ← حوار`, `«${G}»: تعلّم كل يوم في مكان واحد`],
      "ai-chat": ["اكتب باللغة التي تتعلمها — يصحّحها المعلّم", "علقت؟ اكتب بطريقتك واحصل على العبارة"],
      "ai-call": [`📞 تحدّث كأنها مكالمة حقيقية`, `بعدها «${R}» يجعل جملتك درسًا`],
      messages: ["تدرّب برسائل و📞 مكالمات ثنائية", "محادثات جماعية مع عدة أشخاص"],
      video: ["اختر فيديو وشاهده بالترجمة", "اختر جملة واسأل عن معناها"],
      people: ["ابحث عمّن يتعلم اللغة نفسها", "اسأل في اللوحة وابحث عن رفقاء"],
      rooms: ["افتح غرفة أو ادخل واحدة", "تحدّث أو استمع فقط — ترجمة مكتوبة"],
    },
  },
  th: {
    flow: [`1. “${S}”: สิ่งที่ต้องทำวันนี้ทีละอย่าง`, `2. “${K}”: พิมพ์คำตอบและสอบ`, `3. “${T}”: ลองใช้กับติวเตอร์ AI`],
    cards: {
      my: [`รูปประโยค: คำอธิบาย → แบบทดสอบ → บทสนทนา`, `“${G}”: การเรียนแต่ละวันอยู่ที่เดียว`],
      "ai-chat": ["เขียนเป็นภาษาที่เรียน ติวเตอร์ช่วยแก้", "ติดอยู่? เขียนแบบที่ถนัด แล้วรับสำนวน"],
      "ai-call": [`📞 คุยเหมือนโทรจริง`, `จบแล้ว “${R}” เปลี่ยนประโยคของคุณเป็นบทเรียน`],
      messages: ["ฝึกด้วยข้อความและ 📞 โทรแบบตัวต่อตัว", "แชตกลุ่มกับหลายคน"],
      video: ["เลือกวิดีโอแล้วดูพร้อมซับ", "เลือกประโยคแล้วถามความหมาย"],
      people: ["หาคนที่เรียนภาษาเดียวกัน", "ถามในบอร์ด หาเพื่อนเรียน"],
      rooms: ["เปิดห้องหรือเข้าห้อง", "พูดหรือฟังอย่างเดียวก็ได้ มีซับและคำแปล"],
    },
  },
  hi: {
    flow: [`1. “${S}”: आज का काम एक-एक करके`, `2. “${K}”: जवाब लिखें और परीक्षा दें`, `3. “${T}”: AI ट्यूटर के साथ इस्तेमाल करें`],
    cards: {
      my: [`वाक्य-ढाँचा: समझाना → क्विज़ → बातचीत`, `“${G}”: हर दिन की पढ़ाई एक जगह`],
      "ai-chat": ["सीखी जा रही भाषा में लिखें — ट्यूटर सुधारता है", "अटके? अपने तरीके से लिखें और वाक्यांश पाएँ"],
      "ai-call": [`📞 असली कॉल की तरह बोलें`, `बाद में “${R}” आपके वाक्य से पाठ बनाता है`],
      messages: ["1:1 संदेश और 📞 कॉल से अभ्यास करें", "कई लोगों के साथ ग्रुप चैट"],
      video: ["वीडियो चुनें और सबटाइटल के साथ देखें", "वाक्य चुनें और उसका अर्थ पूछें"],
      people: ["वही भाषा सीखने वालों को ढूँढें", "बोर्ड पर पूछें, साथी खोजें"],
      rooms: ["रूम बनाएँ या जुड़ें", "बोलें या बस सुनें — कैप्शन और अनुवाद"],
    },
  },
};

/** 한 언어의 큰 그림(없는 언어는 영어). */
export function guideOverview(language: string): GuideOverview {
  const lines = TEXT[language] ?? TEXT.en!;
  return {
    flow: { clip: "flow", shot: FLOW_SHOTS[0]!, steps: lines.flow.map((text, index) => ({ text, shot: FLOW_SHOTS[index]! })) },
    chapters: Object.fromEntries(
      Object.entries(CARD_SHOTS).map(([id, [todo, cando]]) => [
        id,
        { todo: { text: lines.cards[id]![0], shot: todo }, cando: { text: lines.cards[id]![1], shot: cando } },
      ]),
    ),
  };
}

export const OVERVIEW_LANGUAGES = Object.keys(TEXT);
