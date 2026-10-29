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
  my: ["stage-scripts", "ov-progress"],
  "ai-chat": ["chat-fix", "chat-expression"],
  "ai-call": ["call-ownline", "call-review"],
  messages: ["talk-dm", "r69-groups"],
  video: ["video-library", "video-ask"],
  people: ["people-lang", "board-topics"],
  rooms: ["r69-free", "rooms-room"],
};
const FLOW_SHOTS = ["ov-today", "keep-learning", "talk-calls"];
export const OVERVIEW_CHAPTERS = Object.keys(CARD_SHOTS);

type Lines = { flow: [string, string, string]; cards: Record<keyof typeof CARD_SHOTS, [string, string]> };

const P = "{ui:planTitle}";
const K = "{ui:keepTitle}";
const T = "{ui:homeTabTalk}";
const M = "{ui:myProgressTitle}";

const TEXT: Record<string, Lines> = {
  ko: {
    flow: [`1. 「${P}」: 오늘 할 대본을 말해요`, `2. 「${K}」: 퀴즈로 빈 곳을 채워요`, `3. 「${T}」: 배운 말을 AI 튜터와 써 봐요`],
    cards: {
      my: ["단계 대본을 말해서 하나씩 통과해요", `📊 「${M}」: 단계·익힌 것을 한곳에서`],
      "ai-chat": ["학습 언어로 쓰면 튜터가 고쳐 줘요", "막히면 편한 말로 — 표현을 받아 써요"],
      "ai-call": ["📞 말로 대화해요", "끝나면 줄마다 돌아보고 다시 말해요"],
      messages: ["1:1 메시지·📞 통화로 연습해요", "단체방에서 여럿이 함께"],
      video: ["영상 하나 골라 자막으로 봐요", "문장을 골라 뜻·문법을 물어봐요"],
      people: ["같은 언어를 배우는 사람 찾기", "게시판에 묻고 메이트 구하기"],
      rooms: ["방을 만들거나 들어가요", "말하거나 듣기만 — 자막·번역"],
    },
  },
  en: {
    flow: [`1. “${P}”: say today’s scripts`, `2. “${K}”: fill the gaps with quizzes`, `3. “${T}”: use it with the AI tutor`],
    cards: {
      my: ["Say each stage script to pass it", `📊 “${M}”: stage and what you know, in one place`],
      "ai-chat": ["Write in the language you learn — the tutor corrects it", "Stuck? Write it your way and get the phrase"],
      "ai-call": ["📞 Talk out loud", "Afterwards, go over each line and say it again"],
      messages: ["Practise in one-to-one messages and 📞 calls", "Group chats with several people"],
      video: ["Pick a video and watch with subtitles", "Pick a sentence and ask what it means"],
      people: ["Find people learning the same language", "Ask on the board, find study mates"],
      rooms: ["Open a room or join one", "Talk or just listen — captions and translation"],
    },
  },
  es: {
    flow: [`1. «${P}»: di los guiones de hoy`, `2. «${K}»: completa lo que falta con pruebas`, `3. «${T}»: úsalo con el tutor IA`],
    cards: {
      my: ["Di cada guion de la etapa para superarlo", `📊 «${M}»: etapa y lo que sabes, en un sitio`],
      "ai-chat": ["Escribe en el idioma que aprendes: el tutor lo corrige", "¿Te atascas? Escríbelo a tu manera y recibe la frase"],
      "ai-call": ["📞 Habla en voz alta", "Al terminar, repasa cada línea y repítela"],
      messages: ["Practica con mensajes y 📞 llamadas uno a uno", "Chats de grupo con varias personas"],
      video: ["Elige un vídeo y míralo con subtítulos", "Elige una frase y pregunta qué significa"],
      people: ["Encuentra gente que aprende tu idioma", "Pregunta en el tablón y busca compañeros"],
      rooms: ["Abre una sala o entra en una", "Habla o solo escucha: subtítulos y traducción"],
    },
  },
  ja: {
    flow: [`1.「${P}」：今日の台本を話す`, `2.「${K}」：クイズで足りないところを埋める`, `3.「${T}」：覚えた言葉をAIチューターと使う`],
    cards: {
      my: ["段階の台本を話して1つずつ合格", `📊「${M}」：段階と身についたことを1か所で`],
      "ai-chat": ["学習言語で書くとチューターが直してくれる", "詰まったら普段の言葉で — 表現を受け取る"],
      "ai-call": ["📞 声で会話する", "終わったら1行ずつ振り返って言い直す"],
      messages: ["1対1のメッセージ・📞通話で練習", "グループチャットでみんなと"],
      video: ["動画を選んで字幕で見る", "文を選んで意味・文法を聞く"],
      people: ["同じ言語を学ぶ人を探す", "掲示板で質問・仲間探し"],
      rooms: ["ルームを作る・入る", "話す・聞くだけでも — 字幕と翻訳"],
    },
  },
  zh: {
    flow: [`1.「${P}」：说今天的剧本`, `2.「${K}」：用小测验补上空缺`, `3.「${T}」：和AI导师用学到的话`],
    cards: {
      my: ["说出阶段剧本，一个个通过", `📊「${M}」：阶段和已掌握的都在一处`],
      "ai-chat": ["用学习语言写，导师帮你改", "卡住了就用自己的话写，拿到表达"],
      "ai-call": ["📞 开口对话", "结束后逐句回顾、再说一遍"],
      messages: ["用一对一消息和📞通话练习", "在群聊里和大家一起"],
      video: ["选一个视频，看着字幕学", "选一句话，问意思和语法"],
      people: ["找学同一种语言的人", "在留言板提问、找学伴"],
      rooms: ["开个房间或加入", "说话或只听 — 字幕和翻译"],
    },
  },
  vi: {
    flow: [`1. “${P}”: nói các kịch bản hôm nay`, `2. “${K}”: lấp chỗ trống bằng câu đố`, `3. “${T}”: dùng điều đã học với gia sư AI`],
    cards: {
      my: ["Nói từng kịch bản của chặng để qua", `📊 “${M}”: chặng và điều đã biết ở một chỗ`],
      "ai-chat": ["Viết bằng ngôn ngữ đang học — gia sư sửa cho", "Bí thì viết theo cách của bạn, nhận cách nói"],
      "ai-call": ["📞 Nói chuyện thành tiếng", "Xong thì xem lại từng câu và nói lại"],
      messages: ["Luyện bằng tin nhắn và 📞 gọi 1:1", "Nhóm chat cùng nhiều người"],
      video: ["Chọn một video, xem với phụ đề", "Chọn câu, hỏi nghĩa và ngữ pháp"],
      people: ["Tìm người học cùng ngôn ngữ", "Hỏi trên bảng tin, tìm bạn học"],
      rooms: ["Mở phòng hoặc vào phòng", "Nói hoặc chỉ nghe — phụ đề và dịch"],
    },
  },
  fr: {
    flow: [`1. « ${P} » : dites les scripts du jour`, `2. « ${K} » : comblez les trous par des quiz`, `3. « ${T} » : utilisez-le avec le tuteur IA`],
    cards: {
      my: ["Dites chaque script de l’étape pour le valider", `📊 « ${M} » : étape et acquis au même endroit`],
      "ai-chat": ["Écrivez dans la langue apprise : le tuteur corrige", "Bloqué ? Écrivez à votre façon et recevez la tournure"],
      "ai-call": ["📞 Parlez à voix haute", "Ensuite, reprenez chaque ligne et redites-la"],
      messages: ["Pratiquez en messages et 📞 appels à deux", "Discussions de groupe à plusieurs"],
      video: ["Choisissez une vidéo, regardez avec sous-titres", "Choisissez une phrase et demandez son sens"],
      people: ["Trouvez des gens qui apprennent la même langue", "Posez vos questions au tableau, trouvez des partenaires"],
      rooms: ["Ouvrez un salon ou rejoignez-en un", "Parlez ou écoutez — sous-titres et traduction"],
    },
  },
  it: {
    flow: [`1. «${P}»: di’ i copioni di oggi`, `2. «${K}»: colma le lacune con i quiz`, `3. «${T}»: usalo con il tutor IA`],
    cards: {
      my: ["Di’ ogni copione della tappa per superarlo", `📊 «${M}»: tappa e cose imparate in un posto`],
      "ai-chat": ["Scrivi nella lingua che studi: il tutor corregge", "Bloccato? Scrivi a modo tuo e ricevi la frase"],
      "ai-call": ["📞 Parla ad alta voce", "Alla fine rivedi ogni riga e ripetila"],
      messages: ["Esercitati con messaggi e 📞 chiamate a due", "Chat di gruppo con più persone"],
      video: ["Scegli un video e guardalo coi sottotitoli", "Scegli una frase e chiedi cosa significa"],
      people: ["Trova chi studia la stessa lingua", "Chiedi in bacheca, trova compagni"],
      rooms: ["Apri una stanza o entra", "Parla o ascolta soltanto — sottotitoli e traduzione"],
    },
  },
  pt: {
    flow: [`1. “${P}”: fale os roteiros de hoje`, `2. “${K}”: preencha lacunas com quizzes`, `3. “${T}”: use com o tutor de IA`],
    cards: {
      my: ["Fale cada roteiro da etapa para passar", `📊 “${M}”: etapa e o que você sabe num só lugar`],
      "ai-chat": ["Escreva no idioma que aprende: o tutor corrige", "Travou? Escreva do seu jeito e receba a frase"],
      "ai-call": ["📞 Converse em voz alta", "No fim, reveja cada fala e repita"],
      messages: ["Pratique em mensagens e 📞 chamadas a dois", "Grupos com várias pessoas"],
      video: ["Escolha um vídeo e veja com legendas", "Escolha uma frase e pergunte o sentido"],
      people: ["Ache quem aprende o mesmo idioma", "Pergunte no mural, ache parceiros"],
      rooms: ["Abra uma sala ou entre em uma", "Fale ou só escute — legendas e tradução"],
    },
  },
  ru: {
    flow: [`1. «${P}»: проговорите сценарии на сегодня`, `2. «${K}»: закройте пробелы тестами`, `3. «${T}»: применяйте с ИИ-репетитором`],
    cards: {
      my: ["Проговорите каждый сценарий этапа, чтобы пройти", `📊 «${M}»: этап и выученное в одном месте`],
      "ai-chat": ["Пишите на изучаемом языке — репетитор исправит", "Застряли? Напишите по-своему и получите фразу"],
      "ai-call": ["📞 Говорите вслух", "Потом разберите каждую реплику и повторите"],
      messages: ["Практикуйтесь в личных сообщениях и 📞 звонках", "Групповые чаты с несколькими людьми"],
      video: ["Выберите видео и смотрите с субтитрами", "Выберите фразу и спросите, что она значит"],
      people: ["Найдите тех, кто учит тот же язык", "Спрашивайте на доске, ищите напарников"],
      rooms: ["Создайте комнату или войдите", "Говорите или просто слушайте — субтитры и перевод"],
    },
  },
  id: {
    flow: [`1. “${P}”: ucapkan naskah hari ini`, `2. “${K}”: isi celah dengan kuis`, `3. “${T}”: pakai bersama tutor AI`],
    cards: {
      my: ["Ucapkan tiap naskah tahap untuk lulus", `📊 “${M}”: tahap dan yang sudah dikuasai di satu tempat`],
      "ai-chat": ["Tulis dalam bahasa yang dipelajari — tutor memperbaiki", "Buntu? Tulis dengan caramu, dapatkan ungkapannya"],
      "ai-call": ["📞 Bicara langsung", "Setelahnya, tinjau tiap baris dan ucapkan lagi"],
      messages: ["Latihan lewat pesan dan 📞 panggilan 1:1", "Grup chat bersama banyak orang"],
      video: ["Pilih video, tonton dengan subtitle", "Pilih kalimat, tanyakan artinya"],
      people: ["Cari orang yang belajar bahasa yang sama", "Bertanya di papan, cari teman belajar"],
      rooms: ["Buka ruang atau bergabung", "Bicara atau cuma dengar — teks dan terjemahan"],
    },
  },
  ar: {
    flow: [`1. «${P}»: قل نصوص اليوم`, `2. «${K}»: املأ الفجوات بالاختبارات`, `3. «${T}»: استخدمه مع المعلّم الذكي`],
    cards: {
      my: ["قل كل نص في المرحلة لتجتازه", `📊 «${M}»: المرحلة وما تعرفه في مكان واحد`],
      "ai-chat": ["اكتب باللغة التي تتعلمها — يصحّحها المعلّم", "علقت؟ اكتب بطريقتك واحصل على العبارة"],
      "ai-call": ["📞 تحدّث بصوتك", "بعدها راجع كل سطر وقله مرة أخرى"],
      messages: ["تدرّب برسائل و📞 مكالمات ثنائية", "محادثات جماعية مع عدة أشخاص"],
      video: ["اختر فيديو وشاهده بالترجمة", "اختر جملة واسأل عن معناها"],
      people: ["ابحث عمّن يتعلم اللغة نفسها", "اسأل في اللوحة وابحث عن رفقاء"],
      rooms: ["افتح غرفة أو ادخل واحدة", "تحدّث أو استمع فقط — ترجمة مكتوبة"],
    },
  },
  th: {
    flow: [`1. “${P}”: พูดบทของวันนี้`, `2. “${K}”: เติมส่วนที่ขาดด้วยแบบทดสอบ`, `3. “${T}”: ลองใช้กับติวเตอร์ AI`],
    cards: {
      my: ["พูดบทของแต่ละขั้นให้ผ่านทีละบท", `📊 “${M}”: ขั้นและสิ่งที่รู้แล้วในที่เดียว`],
      "ai-chat": ["เขียนเป็นภาษาที่เรียน ติวเตอร์ช่วยแก้", "ติดอยู่? เขียนแบบที่ถนัด แล้วรับสำนวน"],
      "ai-call": ["📞 คุยด้วยเสียง", "จบแล้วดูทีละประโยคและพูดอีกครั้ง"],
      messages: ["ฝึกด้วยข้อความและ 📞 โทรแบบตัวต่อตัว", "แชตกลุ่มกับหลายคน"],
      video: ["เลือกวิดีโอแล้วดูพร้อมซับ", "เลือกประโยคแล้วถามความหมาย"],
      people: ["หาคนที่เรียนภาษาเดียวกัน", "ถามในบอร์ด หาเพื่อนเรียน"],
      rooms: ["เปิดห้องหรือเข้าห้อง", "พูดหรือฟังอย่างเดียวก็ได้ มีซับและคำแปล"],
    },
  },
  hi: {
    flow: [`1. “${P}”: आज की स्क्रिप्ट बोलें`, `2. “${K}”: क्विज़ से कमियाँ भरें`, `3. “${T}”: AI ट्यूटर के साथ इस्तेमाल करें`],
    cards: {
      my: ["हर चरण की स्क्रिप्ट बोलकर पास करें", `📊 “${M}”: चरण और सीखा हुआ एक जगह`],
      "ai-chat": ["सीखी जा रही भाषा में लिखें — ट्यूटर सुधारता है", "अटके? अपने तरीके से लिखें और वाक्यांश पाएँ"],
      "ai-call": ["📞 बोलकर बात करें", "बाद में हर पंक्ति देखें और फिर बोलें"],
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
