// 실사용 녹화 → 세로 쇼츠(1080×1920, 15~20초).
// 장면을 events.json 시각으로 자르고, 기다리는 구간은 빠르게, 카드는 확대, 자막·목소리·끝 화면을 입힌다.
//
// 이야기(STORIES):
//   chat   — 편한 말로 쓰기 → 표현 카드 (녹화: store-shots/promo/record.mjs <locale> → tmp/promo/<locale>/)
//   people — 사람·Room·줄 번역·💡 힌트·단체방, 사용자끼리 주고받기
//            (녹화: CAPTURE_MIC_WAV=… node --experimental-strip-types scripts/capture-whats-new.mjs promo-people --only <locale>
//             → tmp/promo/people/<locale>/)
// 결과: 그 폴더의 promo-<이야기>-<locale>.mp4
//
// Run: node store-shots/promo/make.mjs people ko   (이야기를 빼면 chat)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { FONT, LEARN, RTL, SPEECH, STORE_LINE } from "./combos.mjs";

const args = process.argv.slice(2);
const story = args.length > 1 ? args[0] : "chat";
const locale = args.length > 1 ? args[1] : args[0] || "ko";
const ROOT = process.cwd();
// talk = room 녹화에 목소리(줄마다 다른 사람)를 입힌 판.
const SRC = story === "talk" ? "room" : story;
// 통화 편은 앱 언어 + 배우는 언어로 폴더가 나뉜다(record-call.mjs, 학습 언어 여러 개 — 사용자 2026-10-26).
const CALL_TARGET = process.env.PROMO_TARGET || "ko";
const DIR = story === "chat" ? path.join(ROOT, "tmp", "promo", locale) : story === "call" ? path.join(ROOT, "tmp", "promo", "call", `${locale}-${CALL_TARGET}`) : path.join(ROOT, "tmp", "promo", SRC, locale);
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const ev = JSON.parse(fs.readFileSync(path.join(DIR, "events.json"), "utf8"));
// 오류교정(fix)부터는 combos.mjs의 학습 조합, 옛 이야기는 예전 조합(en → es, 나머지 → en).
const target = story === "fix" ? LEARN[locale] : locale === "en" ? "es" : "en";

/** 자막(장면 키마다)과 끝 화면 문구, 이야기마다. */
const COPY = {
  chat: {
    ko: {
      hook: "영어로 말하다\n막혔다면?",
      type: "그냥 한국어로\n쓰세요",
      reply: "튜터는 영어로\n대화를 이어가요",
      card: "하고 싶던 말은\n영어로 바로 아래",
      use: "그 표현으로\n바로 말해보기",
      endTitle: "막히면 편한 말로,\n표현은 바로 영어로",
      endSub: "AI 친구와 대화하며 배우는 언어 앱",
    },
  },
  people: {
    ko: {
      p1: "같은 언어 배우는\n사람들을 만나요",
      p2: "방에 들어가\n목소리로 함께",
      p3: "말하는 대로\n자막이 올라와요",
      p4: "모르는 말은\n눌러서 한국어로",
      p5: "막혀서 한국어로\n웅얼거려도",
      p6: "💡 할 말을\n영어로 알려줘요",
      p7: "보내면 다 같이 보는\n영어 자막으로",
      p8: "끝나도 단체방에서\n계속 이어가요",
      endTitle: "혼자 말고,\n같이 말하며 배워요",
      endSub: "같은 언어를 배우는 사람들과 목소리로",
    },
  },
};
COPY.room = {
  en: {
    r1: "Real learners.\nReal voices.", r2: "Live captions\nas they speak", r3: "Tap any line\nto translate", r4: "Stuck? Say it\nyour own way",
    r5: "💡 Get the line\nin Spanish", r6: "Send it.\nEveryone sees it.", endTitle: "Speak with people\nlearning like you", endSub: "Voice rooms with live captions",
  },
  ko: {
    r1: "진짜 학습자들과\n목소리로", r2: "말하는 대로\n자막이 떠요", r3: "모르는 줄은\n눌러서 한국어로", r4: "막히면\n한국어로 말해도",
    r5: "💡 할 말을\n영어로 알려줘요", r6: "보내면\n모두가 봐요", endTitle: "같은 언어 배우는 사람들과\n말하며 배워요", endSub: "자막이 뜨는 음성 대화방",
  },
  ja: {
    r1: "本物の学習者と\n声で話す", r2: "話した言葉が\nすぐ字幕に", r3: "わからない行は\nタップで日本語に", r4: "詰まったら\n日本語で言っても",
    r5: "💡 言いたいことを\n英語で教えてくれる", r6: "送れば\nみんなに届く", endTitle: "同じ言語を学ぶ人と\n話して学ぼう", endSub: "字幕が出るボイスルーム",
  },
  zh: {
    r1: "和真实的学习者\n开口聊", r2: "说话实时\n出字幕", r3: "看不懂的句子\n点一下翻成中文", r4: "卡住了\n说中文也行",
    r5: "💡 告诉你\n英语怎么说", r6: "发出去\n大家都能看到", endTitle: "和一起学语言的人\n边说边学", endSub: "带实时字幕的语音房",
  },
  es: {
    r1: "Estudiantes reales,\nvoces reales", r2: "Subtítulos\nmientras hablan", r3: "Toca una frase\npara traducirla", r4: "¿Te atascas?\nDilo en español",
    r5: "💡 Te da la frase\nen inglés", r6: "Envíala.\nTodos la ven.", endTitle: "Habla con gente\nque aprende como tú", endSub: "Salas de voz con subtítulos",
  },
  hi: {
    r1: "असली सीखने वाले,\nअसली आवाज़ें", r2: "बोलते ही\nसबटाइटल", r3: "कोई भी लाइन टैप करें,\nहिंदी में देखें", r4: "अटक गए?\nहिंदी में बोलें",
    r5: "💡 अंग्रेज़ी में\nवाक्य मिलेगा", r6: "भेजें,\nसब देखेंगे", endTitle: "साथ सीखने वालों से\nबोलकर सीखें", endSub: "सबटाइटल वाले वॉइस रूम",
  },
};
COPY.invite = {
  en: { i1: "Learning alone?\nBring a friend.", i2: "One link.\nThey're in.", i3: "Your own\nstudy team", i4: "Days together,\nregular meetups", i5: "Goals and phrases\nyou share", endTitle: "Learn with friends,\nnot alone", endSub: "Invite links, study mates and team spaces" },
  ko: { i1: "혼자 공부 말고\n친구를 불러요", i2: "링크 하나로\n바로 들어와요", i3: "우리만의\n공부 팀", i4: "같이 한 날,\n정기 모임까지", i5: "목표와 표현을\n함께 쌓아요", endTitle: "친구랑 같이,\n꾸준히 배워요", endSub: "친구 초대 · 러닝메이트 · 팀 워크스페이스" },
  ja: { i1: "一人で勉強より\n友達を呼ぼう", i2: "リンクひとつで\nすぐ参加", i3: "自分たちだけの\n勉強チーム", i4: "一緒にやった日も\n定例会も", i5: "目標と表現を\n一緒に貯める", endTitle: "友達と一緒に、\n続けて学ぼう", endSub: "友達招待・ラーニングメイト・チームスペース" },
  zh: { i1: "别一个人学\n叫上朋友", i2: "一个链接\n马上加入", i3: "我们自己的\n学习小组", i4: "一起学的天数\n固定聚会", i5: "目标和表达\n一起积累", endTitle: "和朋友一起\n坚持学下去", endSub: "邀请好友 · 学习伙伴 · 小组空间" },
  es: { i1: "¿Estudias solo?\nTrae a un amigo.", i2: "Un enlace\ny ya está dentro", i3: "Tu propio\nequipo de estudio", i4: "Días juntos,\nquedadas fijas", i5: "Metas y frases\ncompartidas", endTitle: "Aprende con amigos,\nno solo", endSub: "Invitaciones, compañeros y espacios de equipo" },
  hi: { i1: "अकेले पढ़ाई?\nदोस्त को बुलाएँ", i2: "एक लिंक,\nऔर वे अंदर", i3: "आपकी अपनी\nस्टडी टीम", i4: "साथ बिताए दिन,\nतय मुलाक़ातें", i5: "लक्ष्य और वाक्यांश\nसाथ में", endTitle: "दोस्तों के साथ सीखें,\nअकेले नहीं", endSub: "दोस्त बुलाएँ · लर्निंग मेट · टीम स्पेस" },
};
COPY.talk = COPY.room;
// 오류교정: 학습 언어로 틀린 문장 → 내 줄 아래 ✎ 칩 → 고친 문장(녹화: record-fix.mjs). 학습 조합은 combos.mjs LEARN.
COPY.fix = {
  en: { hook: "Is my Korean\nright?", type: "Just write it.\nMistakes are fine.", chip: "Something off?\nYou'll see a mark", fixed: "The fix sits\nright below yours", endTitle: "Write first.\nGet fixed right below.", endSub: "Learn languages by chatting with AI" },
  es: { hook: "¿Está bien\nmi inglés?", type: "Escribe sin miedo.\nEquivocarse vale.", chip: "¿Algo falla?\nSe marca bajo tu frase", fixed: "La corrección,\njusto debajo", endTitle: "Escribe primero.\nCorrige justo debajo.", endSub: "Aprende idiomas conversando con IA" },
  ar: { hook: "هل إنجليزيتي\nصحيحة؟", type: "اكتب فقط.\nالخطأ مسموح.", chip: "هناك خطأ؟\nتظهر علامة تحت جملتك", fixed: "الجملة المصحّحة\nتحت جملتك مباشرة", endTitle: "اكتب أولاً،\nوالتصحيح تحتها مباشرة", endSub: "تعلّم اللغات بالمحادثة مع الذكاء الاصطناعي" },
  id: { hook: "Bahasa Inggrisku\nsudah benar?", type: "Tulis saja.\nSalah itu wajar.", chip: "Ada yang salah?\nAda tanda di bawah kalimatmu", fixed: "Kalimat yang benar\nlangsung di bawahnya", endTitle: "Tulis dulu,\nkoreksi langsung di bawahnya", endSub: "Belajar bahasa dengan mengobrol bersama AI" },
  vi: { hook: "Câu tiếng Anh này\nđúng chưa?", type: "Cứ viết đi.\nSai cũng không sao.", chip: "Có lỗi?\nCó dấu ngay dưới câu của bạn", fixed: "Câu đã sửa\nngay bên dưới", endTitle: "Viết trước,\nsửa ngay bên dưới", endSub: "Học ngoại ngữ bằng cách trò chuyện với AI" },
  th: { hook: "ภาษาอังกฤษของฉัน\nถูกไหม?", type: "พิมพ์ไปเลย\nผิดได้ไม่เป็นไร", chip: "มีจุดผิด?\nมีป้ายขึ้นใต้ประโยค", fixed: "ประโยคที่แก้แล้ว\nอยู่ใต้ประโยคของคุณ", endTitle: "เขียนก่อน\nแล้วแก้ให้ใต้ประโยคเลย", endSub: "เรียนภาษาด้วยการคุยกับ AI" },
  ko: { hook: "일본어로 쓴 이 문장,\n맞을까?", type: "틀려도 괜찮아요\n그냥 써 보세요", chip: "고칠 곳이 있으면\n내 문장 아래 표시", fixed: "고친 문장은\n바로 아래에", endTitle: "먼저 써 보고,\n바로 아래서 고쳐요", endSub: "AI와 대화하며 배우는 언어 앱" },
  ja: { hook: "この韓国語、\n合ってる？", type: "間違えてもOK\nまず書いてみて", chip: "直すところがあれば\n文の下に表示", fixed: "直した文は\nすぐ下に", endTitle: "まず書いて、\nすぐ下で直す", endSub: "AIと話して学ぶ語学アプリ" },
};

// 막히면 편한 말로(chat)·문장 뜯어보기(analyze) 영어·스페인어 자막(2026-10-25, 학습 조합은 combos.mjs).
COPY.chat.en = { hook: "Don't know how\nto say it in Korean?", type: "Just type it\nin English", reply: "Minjun keeps going\nin Korean", card: "What you meant,\nin Korean", use: "Now say it\nyourself", endTitle: "Stuck? Use your words.\nKeep talking in Korean.", endSub: "Learn languages by chatting with AI" };
COPY.chat.es = { hook: "¿No sabes cómo\ndecirlo en inglés?", type: "Escríbelo\nen español", reply: "El tutor sigue\nen inglés", card: "Lo que querías decir,\nen inglés", use: "Ahora dilo\ntú", endTitle: "¿Te atascas? Usa tus palabras.\nSigue hablando en inglés.", endSub: "Aprende idiomas conversando con IA" };
COPY.analyze = {
  en: { hook: "What does that\nKorean line mean?", reply: "Minjun replies\nin real Korean", tap: "Tap any line\nto break it down", why: "Ask why.\nGet the grammar.", endTitle: "Understand every\nline you read", endSub: "Learn languages by chatting with AI" },
  es: { hook: "¿Qué significa\nesa frase en inglés?", reply: "El tutor responde\nen inglés real", tap: "Toca una frase\npara analizarla", why: "Pregunta por qué.\nEntiende la gramática.", endTitle: "Entiende cada frase\nque lees", endSub: "Aprende idiomas conversando con IA" },
};
/**
 * 설명 목소리(UI 언어, 2026-10-25 사용자 "보이스로 설명도"): 자막 칸이 처음 나올 때 화면을 멈추고 읽는다 → 그다음 실제 동작.
 * 버튼 이름은 그 언어 앱의 실제 버튼 문구로.
 */
const NARR = {
  fix: {
    en: { hook: "Not sure if your Korean is right?", type: "Just write it. Mistakes are part of learning.", chip: "If something's off, a small mark shows up under your line.", fixed: "Tap it, and the corrected sentence appears right below yours.", end: "Write first. Get fixed right below. languagebank." },
    es: { hook: "¿No sabes si tu inglés está bien?", type: "Escríbelo sin miedo. Equivocarse es parte de aprender.", chip: "Si algo falla, aparece una marca debajo de tu frase.", fixed: "Tócala, y la frase corregida aparece justo debajo de la tuya.", end: "Escribe primero. Corrige justo debajo. languagebank." },
  },
  chat: {
    en: { hook: "Stuck in the middle of a Korean conversation?", type: "Just type what you mean, in English.", reply: "Minjun keeps the conversation going in Korean, so you never drop out.", card: "Tap 'Show how to say it', and see exactly how to say it in Korean.", use: "Then send it yourself.", end: "Stuck? Use your own words, and keep talking. languagebank." },
    es: { hook: "¿Te quedas en blanco en medio de una conversación en inglés?", type: "Escribe lo que quieres decir, en español.", reply: "El tutor sigue la conversación en inglés, así nunca te quedas fuera.", card: "Toca 'Ver cómo se dice', y verás exactamente cómo se dice en inglés.", use: "Y luego lo envías tú.", end: "¿Te atascas? Usa tus palabras y sigue hablando. languagebank." },
  },
  analyze: {
    en: { hook: "Chatting in Korean, but not sure what the reply really means?", reply: "Minjun answers the way a Korean friend would.", tap: "Tap the line, choose Analyze, and see it with its meaning.", why: "Then ask why it's written this way, and get the grammar explained in English.", end: "Understand every line. languagebank." },
    es: { hook: "¿Chateas en inglés pero no entiendes del todo la respuesta?", reply: "El tutor responde como lo haría un amigo nativo.", tap: "Toca la frase, elige Analizar, y mírala con su significado.", why: "Luego pregunta por qué se dice así, y te explica la gramática en español.", end: "Entiende cada frase. languagebank." },
  },
};

// 한국어판(일본어 배우기, 튜터 Yuki — combos.mjs ko→ja, 2026-10-25 사용자 "같은 내용으로 한국어 영상").
COPY.chat.ko = { hook: "일본어로 뭐라고\n할지 막힐 때", type: "그냥 한국어로\n쓰세요", reply: "튜터는 일본어로\n대화를 이어가요", card: "하고 싶던 말은\n일본어로 바로 아래", use: "그 표현으로\n바로 말해보기", endTitle: "막히면 편한 말로,\n대화는 계속 일본어로", endSub: "AI와 대화하며 배우는 언어 앱" };
COPY.analyze.ko = { hook: "이 일본어 문장,\n무슨 뜻일까?", reply: "유키는 진짜\n일본어로 답해요", tap: "줄을 누르면\n문장을 뜯어봐요", why: "왜 이렇게 쓰는지\n물어보세요", endTitle: "읽는 문장마다\n이해하며 배워요", endSub: "AI와 대화하며 배우는 언어 앱" };
NARR.fix.ko = { hook: "일본어로 쓴 문장, 맞는지 헷갈리죠?", type: "틀려도 괜찮아요. 일단 써 보세요.", chip: "고칠 곳이 있으면, 내 문장 아래에 표시가 떠요.", fixed: "누르면 고친 문장이 바로 아래에 나와요.", end: "먼저 써 보고, 바로 아래서 고쳐요. 랭귀지뱅크." };
NARR.chat.ko = { hook: "일본어로 대화하다가 말문이 막혔나요?", type: "하고 싶은 말을 그냥 한국어로 쓰세요.", reply: "유키는 일본어로 대화를 계속 이어가요. 대화가 끊기지 않아요.", card: "'표현 보기'를 누르면, 일본어로 어떻게 말하는지 바로 보여줘요.", use: "그다음 그 표현으로 직접 말해 보세요.", end: "막히면 편한 말로, 대화는 계속. 랭귀지뱅크." };
NARR.analyze.ko = { hook: "일본어로 대화하는데, 답장이 정확히 무슨 뜻인지 모르겠다면?", reply: "유키는 일본 친구처럼 자연스럽게 답해요.", tap: "그 줄을 누르고 '분석'을 고르면, 뜻과 함께 문장을 보여줘요.", why: "'왜 이런 형태야?'를 누르면, 문법을 한국어로 설명해 줘요.", end: "문장마다 이해하며 배워요. 랭귀지뱅크." };

// 2026-10-26 사용자 "목소리는 빼고 자막과 음악, 문장 일부 고르기·구체적 질문·틀린 문장 고치기·My로 이어지기".
Object.assign(COPY.fix.en, { my: "Your fixed lines\nwait in My", note: "Pick them.\nThey become your notes." });
Object.assign(COPY.fix.es, { my: "Tus frases corregidas\nte esperan en Mi espacio", note: "Elígelas.\nSe vuelven tus apuntes." });
Object.assign(COPY.fix.ko, { my: "고친 문장은\nMy에 모여요", note: "골라 담으면\n내 노트가 돼요" });
COPY.analyze2 = {
  en: { hook: "What does that\nKorean line mean?", tap: "Tap a line\nto break it down", pick: "Drag to pick\njust the part you want", ask: "Ask exactly\nwhat you need", answer: "A straight answer,\nin English", my: "It lands in My,\nright where it belongs", endTitle: "Understand every\nline you read", endSub: "Learn languages by chatting with AI" },
  es: { hook: "¿Qué significa\nesa frase en inglés?", tap: "Toca una frase\npara analizarla", pick: "Desliza y elige\nsolo la parte que quieras", ask: "Pregunta justo\nlo que necesitas", answer: "Una respuesta clara,\nen español", my: "Y se guarda en Mi espacio,\nen su lugar", endTitle: "Entiende cada frase\nque lees", endSub: "Aprende idiomas conversando con IA" },
  ko: { hook: "이 일본어 문장,\n무슨 뜻일까?", tap: "줄을 누르면\n문장을 뜯어봐요", pick: "궁금한 부분만\n끌어서 골라요", ask: "궁금한 걸\n그대로 물어보세요", answer: "한국어로\n바로 답해줘요", my: "My의 제자리에\n쏙 담겨요", endTitle: "읽는 문장마다\n이해하며 배워요", endSub: "AI와 대화하며 배우는 언어 앱" },
};

// 통화 편 자막(배우는 언어 이름을 넣는다). 장면은 PROMO_PARTS로 고른다(여러 언어를 이어 붙일 때 첫 편만 hook).
const LANG_NAME = { en: { ko: "Korean", es: "Spanish", ja: "Japanese", fr: "French", zh: "Chinese", en: "English" } };
{
  const n = LANG_NAME[locale]?.[CALL_TARGET] ?? CALL_TARGET;
  COPY.call = {
    en: { hook: "Speak out loud\nwith an AI friend", say: `${n}\nSay it, mistakes and all`, fix: `${n}\nIt shows what you could say`, more: `${n}\nAnd the talk keeps going`, endTitle: "Speak out loud,\nin any language", endSub: "Learn languages by talking with AI" },
  };
}
const DIR_ATTR = RTL.has(locale) ? ' dir="rtl"' : "";
const COPY_KEY = story === "analyze" && ev.pickStart != null ? "analyze2" : story;
const C = { font: FONT[locale] ?? "'Noto Sans', sans-serif", store: STORE_LINE[locale] ?? STORE_LINE.en, ...(COPY[COPY_KEY]?.[locale] ?? {}) };
if (!COPY[COPY_KEY]?.[locale]) throw new Error(`no promo copy for ${story}/${locale}`);

/**
 * 장면 자르기(원본 시각): [시작, 끝, 속도, 자막 키, 확대]. 확대 = { by, x, y }(창 위치 비율),
 * voice = 목소리로 읽을 글자, voiceIn = 확대 장면 시작 뒤 몇 초에.
 */
const STORIES = {
  chat: () => ({
    segs: [
      [Math.max(0, ev.typeStart - 1.8), ev.typeStart + 0.1, 1, "hook"],
      [ev.typeStart + 0.1, ev.sent + 0.3, 1, "type"],
      [ev.sent + 0.3, ev.reply - 0.2, 3, "type"],
      [ev.reply - 0.2, ev.cardTap + 0.1, 1, "reply"],
      [ev.cardTap + 0.1, ev.card, 2.5, "reply"],
      // 카드(오른쪽 정렬 말풍선, 화면 위쪽 1/3): 오른쪽 끝이 잘리지 않게 창을 오른쪽으로.
      [ev.card, ev.use - 0.1, 1, "card", { by: 0.25, x: 0.9, y: 0.2 }],
      [ev.use - 0.1, ev.end - 0.4, 1, "use"],
    ],
    voice: ev.expression,
    voiceIn: 0.5,
  }),
  people: () => ({
    segs: [
      [Math.max(0, ev.people - 0.4), ev.follow + 0.8, 1, "p1"],
      [ev.follow + 0.8, ev.join + 0.4, 1.8, "p2"],
      [ev.join + 0.4, ev.lines + 1.4, 1.7, "p3"],
      [ev.lines + 1.4, ev.translated + 1.3, 1.2, "p4"],
      // 힌트를 기다리는 시간은 운영 응답에 따라 달라서, 늘 약 2.2초로 줄인다.
      [ev.question - 0.1, ev.hint - 0.3, Math.max(1.4, (ev.hint - 0.2 - ev.question) / 2.2), "p5"],
      // 💡 힌트 카드(자막 칸, 화면 가운데쯤).
      [ev.hint - 0.3, ev.sent - 0.1, 1, "p6", { by: 0.2, x: 0.5, y: 0.42 }],
      [ev.sent - 0.1, ev.sent + 1.9, 1, "p7"],
      [ev.group - 0.3, ev.group + 2.2, 1, "p8"],
    ],
    voice: ev.hintText,
    voiceIn: 0.6,
  }),
};
STORIES.room = () => ({
  segs: [
    [Math.max(0, ev.rooms - 1.2), ev.join + 0.5, 1, "r1"],
    [ev.join + 0.3, ev.lines + 1.2, 1.8, "r2"],
    [ev.lines + 1.2, ev.translated + 1.2, 1.2, "r3"],
    // 힌트를 기다리는 시간은 운영 응답에 따라 달라서, 늘 약 2초로 줄인다.
    [ev.question - 0.1, ev.hint - 0.3, Math.max(1.3, (ev.hint - 0.2 - ev.question) / 2.0), "r4"],
    [ev.hint - 0.3, ev.sent - 0.1, 1, "r5", { by: 0.2, x: 0.5, y: 0.42 }],
    [ev.sent - 0.1, ev.sent + 1.8, 1, "r6"],
  ],
  voice: ev.hintText,
  voiceIn: 0.6,
});
// 친구 초대 → 친구가 받은 초대 → 팀 워크스페이스(녹화: capture-whats-new.mjs promo-invite).
STORIES.invite = () => ({
  segs: [
    [Math.max(0, ev.people - 0.9), ev.invite + 1.7, 1, "i1"],
    [ev.welcome - 0.3, ev.welcome + 2.3, 1, "i2"],
    [ev.messages - 0.2, ev.space - 0.2, 1.3, "i3"],
    // 워크스페이스는 카드가 화면 가로를 꽉 채워 확대하면 양쪽이 잘린다: 확대 없이.
    [ev.space - 0.2, ev.space + 2.0, 1, "i4"],
    [ev.space + 2.0, ev.end - 0.2, 1.2, "i5"],
  ],
});
// 목소리 대화판: 줄이 뜰 때 그 사람 목소리로 읽고(Yuki·Lucía는 학습 언어, 나는 막혀서 편한 말로 웅얼 → 💡 문장을 학습 언어로),
// 세부 기능(자막 줄·번역·힌트 카드·보낸 댓글)은 확대해서 보여준다. 말이 나오는 구간은 1배속.
// 확대 창: 자막 칸은 화면 위 1/3 아래쪽, 글줄은 왼쪽 정렬이라 창을 왼쪽에 붙인다.
const UI_LANG = { ko: "ko-KR", ja: "ja-JP", zh: "zh-CN", es: "es-ES", hi: "hi-IN", en: "en-US" };
const TARGET_LANG = target === "en" ? "en-US" : "es-ES";
// 앱 TTS(운영 /api/tts, 24kHz 원시 PCM) → 앞뒤 무음을 자른 wav. 같은 글·목소리는 다시 받지 않는다.
// curl: 작업 공간 프록시에서 Node fetch가 끊길 때가 있다.
function tts(text, lang, voice, tempo = 1) {
  const key = Buffer.from(`${voice}|${tempo}|${lang}|${text}`).toString("base64url").slice(0, 60);
  const pcm = path.join(DIR, `tts-${key}.pcm`);
  const wav = path.join(DIR, `tts-${key}.wav`);
  if (!fs.existsSync(wav)) {
    const url = `${API}/api/tts?text=${encodeURIComponent(text)}&lang=${lang}&voice=${voice}`;
    execFileSync("curl", ["-sSf", "-o", pcm, "-H", `x-rc-user: promo-voice-${locale}`, url]);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, "-af", `silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse${tempo !== 1 ? `,atempo=${tempo}` : ""}`, wav]);
  }
  const len = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString());
  return { wav, len, text };
}
// 기능 설명(내레이터, UI 언어) → 그 기능의 실제 대화. 설명하는 동안 화면은 그 장면 첫 모습에 멈춘다.
const NARRATION = {
  en: { n1: "In Room, you talk live with people learning the same language.", n2: "Whatever people say turns into captions as they speak.", n3: "Don't get a line? Tap it to see it in English.",
    n4: "Stuck? Just say it in your own language.", n5: "A hint gives you that line in Spanish.", n6: "Send it, and everyone in the room sees it.", end: "languagebank. Speak with people learning like you." },
  ko: { n1: "Room에서는 같은 언어를 배우는 사람들과 목소리로 대화해요.", n2: "말하는 대로 바로 자막이 올라와요.", n3: "모르는 줄은 누르면 한국어로 보여줘요.",
    n4: "말이 막히면 그냥 한국어로 말해도 돼요.", n5: "그러면 힌트가 할 말을 영어로 알려줘요.", n6: "보내면 방에 있는 모두가 볼 수 있어요.", end: "languagebank. 같은 언어 배우는 사람들과 말하며 배워요." },
  ja: { n1: "Roomでは、同じ言語を学ぶ人と声で話せます。", n2: "話した言葉が、すぐに字幕になります。", n3: "わからない行は、タップすると日本語で表示されます。",
    n4: "言葉に詰まったら、日本語で話しても大丈夫。", n5: "ヒントが、言いたいことを英語で教えてくれます。", n6: "送れば、ルームのみんなに届きます。", end: "languagebank。同じ言語を学ぶ人と、話して学ぼう。" },
  zh: { n1: "在 Room 里，你可以和学同一种语言的人语音聊天。", n2: "大家说的话会实时变成字幕。", n3: "看不懂的句子，点一下就能看中文。",
    n4: "卡住了？直接说中文也可以。", n5: "提示会告诉你这句话用英语怎么说。", n6: "发出去，房间里的人都能看到。", end: "languagebank，和一起学语言的人边说边学。" },
  es: { n1: "En Room hablas en directo con gente que aprende tu mismo idioma.", n2: "Lo que dicen aparece en subtítulos mientras hablan.", n3: "¿No entiendes una frase? Tócala y la verás en español.",
    n4: "¿Te atascas? Dilo en español, sin problema.", n5: "Una pista te da esa frase en inglés.", n6: "Envíala y todos en la sala la verán.", end: "languagebank. Habla con gente que aprende como tú." },
  hi: { n1: "Room में आप वही भाषा सीख रहे लोगों से आवाज़ में बात करते हैं।", n2: "लोग जो बोलते हैं, वह तुरंत सबटाइटल बन जाता है।", n3: "कोई लाइन समझ न आए तो टैप करें, हिंदी में दिखेगी।",
    n4: "अटक गए? बस हिंदी में बोल दीजिए।", n5: "हिंट आपको वही बात अंग्रेज़ी में बताता है।", n6: "भेजिए, और रूम में सब देख लेंगे।", end: "languagebank. साथ सीखने वालों से बोलकर सीखें।" },
};
const NARRATOR = "coral";
STORIES.talk = () => {
  // 자막 칸(화면 위에서 43~61%)과 채팅 칸(62~75%)을 띄워 키운다.
  const CAPS = { pop: [0.432, 0.61] };
  const CHAT = { pop: [0.615, 0.75] };
  const N = NARRATION[locale];
  if (!N) throw new Error(`no narration for ${locale}`);
  const ui = UI_LANG[locale] ?? "en-US";
  // 멈춘 화면 + 설명: 원본 한 프레임(0.04초)을 설명 길이만큼 늘인다.
  const hold = (src, key, cap, zoom) => {
    const n = tts(N[key], ui, NARRATOR, 1.12);
    const dur = n.len + 0.4;
    return [src, src + 0.04, 0.04 / dur, cap, zoom, { narr: n }];
  };
  return {
    segs: [
      [Math.max(0, ev.rooms - 0.6), ev.rooms + 0.1, 1, "r1"],
      hold(ev.rooms + 0.1, "n1", "r1"),
      [ev.rooms + 0.15, ev.join + 0.4, 1.3, "r1"],
      [ev.join + 0.4, ev.line1 - 0.3, 2, "r2"],
      hold(ev.line1 - 0.3, "n2", "r2", CAPS),
      [ev.line1 - 0.1, ev.tap - 0.3, 1, "r2", CAPS],
      hold(ev.tap - 0.3, "n3", "r3", CAPS),
      [ev.tap - 0.2, ev.translated + 1.6, 1.3, "r3", CAPS],
      hold(ev.question - 0.2, "n4", "r4", CAPS),
      [ev.question - 0.2, ev.mumble + 0.1, 1, "r4", CAPS],
      // 힌트는 운영 응답을 기다리므로 약 2.6초로 줄인다(웅얼거림 목소리는 이 구간 처음부터 제 속도로).
      [ev.mumble + 0.1, ev.hint + 0.15, Math.max(1, (ev.hint - 0.6 - ev.mumble) / 2.6), "r4", CAPS],
      hold(ev.hint + 0.2, "n5", "r5", CAPS),
      [ev.hint + 0.25, ev.sent - 0.15, 1, "r5", CAPS],
      hold(ev.sent - 0.15, "n6", "r6", CAPS),
      [ev.sent - 0.1, ev.sent + 2.0, 1, "r6", CHAT],
    ],
    voices: [
      { text: ev.line1Text, lang: TARGET_LANG, voice: "nova", src: ev.line1 + 0.25 },
      { text: ev.line2Text, lang: TARGET_LANG, voice: "shimmer", src: ev.line2 + 0.2 },
      { text: ev.questionText, lang: TARGET_LANG, voice: "nova", src: ev.question + 0.2 },
      { text: ev.mumbleText, lang: ui, voice: "ash", src: ev.mumble + 0.15 },
      { text: ev.hintText, lang: TARGET_LANG, voice: "ash", src: ev.hint + 0.9 },
    ],
    endNarr: tts(N.end, ui, NARRATOR, 1.12),
  };
};
// 오류교정: 칩 장면부터 내 줄(말풍선)을 확대해 고친 문장까지 이어 보여 주고, 고친 문장을 학습 언어 목소리로.
STORIES.fix = () => {
  const b = ev.bubbleBox ?? { x: 0.1, y: 0.2, w: 0.8, h: 0.12 };
  const by = 0.16;
  // 말풍선 가운데가 창 가운데 오게: 확대한 화면에서 잘라 낼 위치(0~1).
  const at = (c) => Math.min(1, Math.max(0, (c * (1 + by) - 0.5) / by));
  // 오른쪽에 붙은 말풍선(내 줄)은 창을 오른쪽 끝에, 왼쪽(아랍어 앱)은 왼쪽 끝에 — 가운데로 맞추면 끝이 잘린다.
  const zx = b.x + b.w > 0.9 ? 1 : b.x < 0.1 ? 0 : +at(b.x + b.w / 2).toFixed(3);
  const zoom = { by, x: zx, y: +at(b.y + b.h / 2).toFixed(3) };
  const lines = String(ev.bubbleText ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  // 칩이 뜬 뒤에서 멈춘다(그 전 프레임은 말풍선이 아직 다시 그려지는 중일 때가 있음, es).
  const chipStart = ev.chip + 0.15;
  const withMy = ev.added != null && Boolean(COPY.fix[locale]?.my);
  const chipEnd = ev.chipTap + 0.1;
  return {
    segs: [
      [Math.max(0, ev.typeStart - 1.6), ev.typeStart + 0.1, 1, "hook"],
      [ev.typeStart + 0.1, ev.sentAt + 0.2, 1.6, "type"],
      [ev.sentAt + 0.2, chipStart, Math.max(1, (chipStart - ev.sentAt - 0.2) / 1.2), "type"],
      [chipStart, chipEnd, 1, "chip", zoom],
      // 위험한 줄은 확인 모델이 한 번 더 본다("확인하는 중…") — 그 기다림은 빠르게, "고친 문장" 칸은 열린 뒤부터.
      ...(ev.open > chipEnd + 0.4 ? [[chipEnd, ev.open + 0.2, Math.max(1, (ev.open - chipEnd) / 1.2), "chip", zoom]] : []),
      [Math.max(chipEnd, ev.open + 0.2), (withMy ? ev.fixedEnd : ev.end) - 0.2, 1, "fixed", zoom],
      ...(withMy
        ? [
            [ev.fixedEnd - 0.2, ev.myShown + 0.2, Math.max(1, (ev.myShown - ev.fixedEnd) / 1.2), "my"],
            [ev.myShown + 0.2, ev.todayTap + 0.1, 1, "my"],
            [ev.todayTap + 0.1, ev.added + 0.3, 1, "note"],
            [ev.added + 0.3, ev.end - 0.2, 1.4, "note"],
          ]
        : []),
    ],
    voice: lines.at(-1) ?? "",
    voiceIn: chipEnd - chipStart + 0.5,
  };
};

// 문장 뜯어보기: 학습 언어 한 줄 → 튜터 답 → 줄 누르기·분석 → "왜 이런 꼴?" 설명(녹화: record-analyze.mjs).
STORIES.analyze = () => ev.pickStart != null ? {
  segs: [
    [Math.max(0, ev.typeStart - 1.2), ev.sentAt + 0.2, 2.2, "hook"],
    [ev.sentAt + 0.2, ev.lineTap - 0.2, Math.max(1, (ev.lineTap - ev.sentAt) / 2.5), "hook"],
    [ev.lineTap - 0.2, ev.loaded + 0.4, Math.max(1, (ev.loaded - ev.lineTap) / 3), "tap"],
    [ev.pickStart - 0.5, ev.picked + 1.4, 1, "pick"],
    [ev.askType - 0.3, ev.askTap + 0.3, 1.6, "ask"],
    [ev.askTap + 0.3, ev.answer, Math.max(1, (ev.answer - ev.askTap) / 1.5), "ask"],
    [ev.answer, ev.findShown, 1, "answer"],
    [ev.findShown - 0.2, ev.myShown + 0.2, Math.max(1, (ev.myShown - ev.findShown) / 1.5), "my"],
    [ev.myShown + 0.2, ev.end - 0.2, 1, "my"],
  ],
} : ({
  segs: [
    [Math.max(0, ev.typeStart - 1.2), ev.sentAt + 0.2, 2.2, "hook"],
    [ev.sentAt + 0.2, ev.lineTap - 0.2, Math.max(1, (ev.lineTap - ev.sentAt) / 2.5), "reply"],
    [ev.lineTap - 0.2, ev.loaded + 0.4, Math.max(1, (ev.loaded - ev.lineTap) / 3), "tap"],
    [ev.askTap - 0.6, ev.answer + 0.3, Math.max(1, (ev.answer - ev.askTap) / 2), "why"],
    [ev.answer + 0.3, ev.end - 0.2, 1, "why"],
  ],
  voice: ev.picked || String(ev.reply ?? "").split("\n")[0],
  voiceSrc: ev.sheet + 0.6,
});

// 통화: 📞 → 튜터가 먼저 인사 → 틀리게 말함 → ✎ → "이렇게 말해도 돼요" → 한 마디 더(녹화: record-call.mjs).
STORIES.call = () => {
  const parts = (process.env.PROMO_PARTS || "hook,say,fix,more").split(",");
  const segs = [];
  if (parts.includes("hook")) segs.push([Math.max(0, ev.callTap - 1.0), ev.transTap + 0.3, 1, "hook"]);
  if (parts.includes("say")) {
    segs.push([parts.includes("hook") ? ev.transTap + 0.3 : Math.max(0, ev.said1 - 4), ev.said1 - 0.3, parts.includes("hook") ? Math.max(1, (ev.said1 - ev.transTap) / 4) : 2, "say"]);
    segs.push([ev.said1 - 0.3, ev.chip + 0.6, 1, "say"]);
  }
  if (parts.includes("fix")) {
    segs.push([ev.chip + 0.6, ev.chipTap - 0.2, Math.max(1, (ev.chipTap - ev.chip) / 1.2), "fix"]);
    segs.push([ev.chipTap - 0.2, ev.open + 2.4, 1, "fix"]);
  }
  if (parts.includes("more")) {
    segs.push([ev.open + 2.4, ev.said2 + 0.2, Math.max(1, (ev.said2 - ev.open) / 4), "more"]);
    segs.push([ev.said2 + 0.2, ev.reply2 + 0.4, Math.max(1, (ev.reply2 - ev.said2) / 2), "more"]);
  }
  return { segs };
};
const plan = STORIES[story]();
// 목소리는 기본으로 뺀다(사용자 2026-10-26 "목소리는 빼고 자막과 음악") — 넣으려면 PROMO_VOICE=1.
const VOICE_ON = process.env.PROMO_VOICE === "1";
if (!VOICE_ON) {
  plan.voice = null;
  plan.voices = [];
}
// 설명 목소리가 있는 편: 칸마다 멈춤 + 설명, 학습 언어 문장은 그 자리에서 멈추고 읽는다.
if (VOICE_ON && NARR[story]?.[locale] && process.env.PROMO_NARRATE !== "0") {
  const N = NARR[story][locale];
  const uiLang = SPEECH[locale] ?? "en-US";
  const pause = (src, cap, zoom, said) => {
    const dur = said.len + 0.5;
    return [src, src + 0.04, 0.04 / dur, cap, zoom, { narr: said }];
  };
  let segsN = plan.segs.map((x) => [...x]);
  // 학습 언어 문장: 그 시각에서 장면을 나눠 멈추고 읽는다(설명과 겹치지 않게).
  const learnSrc = plan.voiceSrc ?? (story === "fix" ? ev.open + 0.8 : story === "chat" ? ev.card + 0.3 : null);
  if (plan.voice && learnSrc != null) {
    const i = segsN.findIndex(([a, b]) => learnSrc > a && learnSrc < b - 0.05);
    if (i >= 0) {
      const [a, b, speed, cap, zoom] = segsN[i];
      const said = tts(plan.voice, SPEECH[target] ?? "en-US", "nova");
      segsN.splice(i, 1, [a, learnSrc, speed, cap, zoom], pause(learnSrc, cap, zoom, said), [learnSrc + 0.04, b, speed, cap, zoom]);
      plan.voice = null;
    }
  }
  const seen = new Set();
  const out = [];
  for (const seg of segsN) {
    const key = seg[3];
    if (N[key] && !seen.has(key) && !seg[5]) {
      seen.add(key);
      out.push(pause(seg[0], key, seg[4], tts(N[key], uiLang, NARRATOR, 1.08)));
    }
    out.push(seg);
  }
  plan.segs = out;
  if (N.end) plan.endNarr = tts(N.end, uiLang, NARRATOR, 1.08);
}

// ── 1. 장면 자르기(원본 시각) ──
const segs = plan.segs;
const END_CARD = plan.endNarr ? Math.max(2.6, plan.endNarr.len + 1.0) : story === "chat" || story === "people" || story === "fix" ? 2.6 : 2.2;
let out = 0;
const timeline = segs.map(([a, b, speed, cap, zoom, extra]) => {
  const dur = (b - a) / speed;
  const row = { a, b, speed, cap, zoom, at: out, dur, narr: extra?.narr };
  out += dur;
  return row;
});
const phoneDur = out;
const total = phoneDur + END_CARD;

// ── 2. 그림(자막·프레임·끝 화면)은 HTML로 그려 PNG ──
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function png(file, body, { transparent = true } = {}) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:${transparent ? "transparent" : "#15161A"};font-family:${C.font};color:#fff}
  </style></head><body>${body}</body></html>`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // 자막은 줄을 꺾지 않고, 가로 1000px을 넘으면 글자를 줄인다(세 줄로 넘쳐 휴대폰을 가리던 것).
  await page.evaluate(() => {
    for (const h of document.querySelectorAll("h1[data-fit]")) {
      let size = parseFloat(getComputedStyle(h).fontSize);
      const width = () => {
        const r = document.createRange();
        r.selectNodeContents(h);
        return r.getBoundingClientRect().width;
      };
      while (width() > 1000 && size > 40) {
        size -= 2;
        h.style.fontSize = `${size}px`;
      }
    }
  });
  await page.screenshot({ path: file, omitBackground: transparent });
}
const PHONE = { x: 210, y: 400, w: 660 }; // 824×1830 → 660×1466
PHONE.h = Math.round((PHONE.w * 1830) / 824);
const R = 64;
// 배경 + 휴대폰 테두리(가운데는 투명하게 뚫어 영상이 보이게: 영상 위에 덮는다).
await png(path.join(DIR, "bg.png"), "", { transparent: false });
await png(path.join(DIR, "frame.png"), `
  <div style="position:absolute;left:${PHONE.x - 14}px;top:${PHONE.y - 14}px;width:${PHONE.w}px;height:${PHONE.h}px;
    border:14px solid #000;border-radius:${R}px;box-shadow:0 0 0 2px #34353C, 0 40px 120px rgba(0,0,0,.6), 0 0 0 9999px #15161A"></div>`);
const capKeys = [...new Set(segs.map((x) => x[3]))];
const PALETTE = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
const accent = Object.fromEntries(capKeys.map((k, i) => [k, PALETTE[i % PALETTE.length]]));
for (const key of capKeys) {
  await png(path.join(DIR, `cap-${key}.png`), `
    <div${DIR_ATTR} style="position:absolute;top:96px;left:0;right:0;text-align:center">
      <div style="display:inline-block;width:56px;height:8px;border-radius:4px;background:${accent[key]};margin-bottom:26px"></div>
      <h1 data-fit style="margin:0;display:block;font-size:88px;line-height:1.14;font-weight:900;letter-spacing:-.02em;white-space:pre">${esc(C[key])}</h1>
    </div>`);
}
const icon = fs.readFileSync(path.join(ROOT, "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")).toString("base64");
await png(path.join(DIR, "end.png"), `
  <div${DIR_ATTR} style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0">
    <img src="data:image/png;base64,${icon}" style="width:220px;height:220px;border-radius:50%">
    <div style="margin-top:40px;font-size:64px;font-weight:800;letter-spacing:-.01em">languagebank</div>
    <h1 style="margin:46px 0 0;font-size:84px;line-height:1.16;font-weight:900;white-space:pre-line">${esc(C.endTitle)}</h1>
    <p style="margin:30px 0 0;font-size:38px;color:#B7B8BF">${esc(C.endSub)}</p>
    <div style="margin-top:80px;padding:26px 54px;border-radius:999px;background:#fff;color:#111;font-size:40px;font-weight:800">${esc(C.store)}</div>
  </div>`, { transparent: false });
await browser.close();

// ── 3. 목소리: 카드·힌트의 문장을 앱 TTS로(운영 /api/tts, 24kHz 원시 PCM) ──
let voice = null;
// 여러 목소리: [{ wav, at(결과 영상 초) }]
const voiceTracks = [];
const outAt = (src) => {
  const playing = timeline.filter((s) => !s.narr);
  const row = playing.find((s) => src >= s.a && src < s.b) ?? playing.find((s) => s.a >= src);
  return row ? row.at + Math.max(0, src - row.a) / row.speed : 0;
};
for (const [i, v] of (plan.voices ?? []).entries()) {
  if (!v.text) continue;
  try {
    // 멈춘 구간(설명) 안의 시각은 건너뛰고 실제로 재생되는 구간에 맞춘다.
    voiceTracks.push({ ...tts(v.text, v.lang, v.voice), at: outAt(v.src) });
  } catch {
    console.log(`목소리 ${i} 실패: ${v.text}`);
  }
}
for (const s of timeline) if (s.narr) voiceTracks.push({ ...s.narr, at: s.at + 0.25 });
if (plan.endNarr) voiceTracks.push({ ...plan.endNarr, at: phoneDur + 0.35 });
if (plan.voice) {
  // curl: 작업 공간 프록시에서 Node fetch가 끊길 때가 있다.
  const url = `${API}/api/tts?text=${encodeURIComponent(plan.voice)}&lang=${SPEECH[target] ?? "en-US"}`;
  try {
    execFileSync("curl", ["-sSf", "-o", path.join(DIR, "voice.pcm"), "-H", `x-rc-user: promo-voice-${locale}`, url]);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", path.join(DIR, "voice.pcm"), path.join(DIR, "voice.wav")]);
    voice = path.join(DIR, "voice.wav");
  } catch {
    console.log("목소리 없이 만든다(TTS 실패).");
  }
}

// ── 4. ffmpeg: 장면 → 이어 붙이기 → 확대 → 프레임·자막·끝 화면·목소리 ──
const sameZoom = (a, b) => !a?.zoom?.pop && a?.zoom && b?.zoom && JSON.stringify(a.zoom) === JSON.stringify(b.zoom);
const parts = timeline.map((s, i) => {
  // 멈춘 장면(설명)은 프레임을 먼저 늘려야 확대가 그 동안 움직인다.
  let f = s.narr
    ? `[0:v]trim=start=${s.a.toFixed(3)}:end=${(s.a + 0.04).toFixed(3)},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${s.dur.toFixed(3)},trim=duration=${s.dur.toFixed(3)},fps=25`
    : `[0:v]trim=start=${s.a.toFixed(3)}:end=${s.b.toFixed(3)},setpts=(PTS-STARTPTS)/${s.speed}`;
  if (s.zoom && !s.zoom.pop) {
    // 0.5초 동안 by배만큼 확대, 창은 zoom.x·zoom.y 비율 위치.
    const z = s.zoom;
    // 들어갈 때 0.5초 확대, 장면 끝 0.4초에 다시 원래대로.
    // 확대는 장면 내내 같은 배율(crop은 첫 프레임 크기로 정해져 배율이 바뀌면 창이 어긋남).
    f += `,scale=w=${Math.round(824 * (1 + z.by) / 2) * 2}:h=-2,crop=824:1830:x='(in_w-824)*${z.x}':y='(in_h-1830)*${z.y}'`;
  }
  return `${f},fps=25,setsar=1[p${i}]`;
});
const concat = `${timeline.map((_, i) => `[p${i}]`).join("")}concat=n=${timeline.length}:v=1:a=0[phone]`;
const capInputs = capKeys;
const inputs = ["-i", path.join(DIR, "raw.mp4"), "-loop", "1", "-t", String(total), "-i", path.join(DIR, "bg.png"),
  "-loop", "1", "-t", String(total), "-i", path.join(DIR, "frame.png"),
  ...capInputs.flatMap((k) => ["-loop", "1", "-t", String(total), "-i", path.join(DIR, `cap-${k}.png`)]),
  "-loop", "1", "-t", String(END_CARD), "-i", path.join(DIR, "end.png")];
if (voice) inputs.push("-i", voice);
for (const v of voiceTracks) inputs.push("-i", v.wav);
// 확대 창(pop): 휴대폰 위에 그 부분만 화면 가로 가까이 키워 띄운다 — 글줄이 가로를 다 써서 화면째 확대하면 잘린다.
const pops = timeline.filter((s) => s.zoom?.pop);
const popFirst = inputs.filter((x) => x === "-i").length;
for (const _ of pops) inputs.push("-i", path.join(DIR, "raw.mp4"));
const endIdx = 3 + capInputs.length;
const between = (a, b) => `between(t,${a.toFixed(3)},${b.toFixed(3)})`;
const capWindows = Object.fromEntries(capInputs.map((k) => {
  const rows = timeline.filter((s) => s.cap === k);
  return [k, rows.length ? [rows[0].at, rows.at(-1).at + rows.at(-1).dur] : null];
}));
let chain = `[1:v][phonev]overlay=x=${PHONE.x}:y=${PHONE.y}:shortest=0[s0];[s0][2:v]overlay=0:0[s1]`;
let last = "s1";
capInputs.forEach((k, i) => {
  const w = capWindows[k];
  if (!w) return;
  chain += `;[${last}][${3 + i}:v]overlay=0:0:enable='${between(w[0], w[1])}'[c${i}]`;
  last = `c${i}`;
});
pops.forEach((s, i) => {
  const [y0, y1] = s.zoom.pop;
  const h = Math.round(((y1 - y0) * 1830) / 2) * 2;
  const W = 1000;
  const top = Math.round(PHONE.y + ((y0 + y1) / 2) * PHONE.h - ((h * W) / 824 + 16) / 2);
  chain += `;[${popFirst + i}:v]trim=start=${s.a.toFixed(3)}:end=${s.b.toFixed(3)},${s.narr ? `setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${s.dur.toFixed(3)}` : `setpts=(PTS-STARTPTS)/${s.speed}`},crop=824:${h}:0:${Math.round(y0 * 1830)},scale=${W}:-2,pad=iw+16:ih+16:8:8:color=0x7CC4FF,format=rgba,fade=in:st=0:d=0.3:alpha=1,fps=25,setpts=PTS+${s.at.toFixed(3)}/TB[pop${i}]`;
  chain += `;[${last}][pop${i}]overlay=x=${(1080 - W - 16) / 2}:y=${top}:eof_action=pass:enable='${between(s.at, s.at + s.dur)}'[q${i}]`;
  last = `q${i}`;
});
chain += `;[${endIdx}:v]setpts=PTS-STARTPTS+${phoneDur.toFixed(3)}/TB[endv];[${last}][endv]overlay=0:0:enable='gte(t,${phoneDur.toFixed(3)})'[v]`;
const phoneScale = `[phone]scale=${PHONE.w}:${PHONE.h},tpad=stop_mode=clone:stop_duration=${END_CARD}[phonev]`;
const cardAt = (timeline.find((s) => s.zoom)?.at ?? 0) + (plan.voiceIn ?? 0);
const audio = voice
  ? `;[${endIdx + 1}:a]adelay=${Math.round(cardAt * 1000)}|${Math.round(cardAt * 1000)},apad,atrim=0:${total.toFixed(3)}[a]`
  : "";
let mix = "";
if (voiceTracks.length) {
  const first = endIdx + 1 + (voice ? 1 : 0);
  const labels = voiceTracks.map((v, i) => {
    const ms = Math.round(v.at * 1000);
    mix += `;[${first + i}:a]adelay=${ms}|${ms},apad=whole_dur=${total.toFixed(3)}[v${i}]`;
    return `[v${i}]`;
  });
  mix += `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=longest,atrim=0:${total.toFixed(3)}[a]`;
}
// 배경음(직접 만든 루프, music.mjs): 반복해 깔고 앞뒤를 부드럽게. 목소리가 있으면 그 아래로 작게.
const MUSIC = path.join(ROOT, "tmp", "promo", "music.wav");
if (process.env.PROMO_MUSIC !== "0" && !fs.existsSync(MUSIC)) execFileSync("node", [path.join(ROOT, "store-shots", "promo", "music.mjs"), MUSIC]);
let music = "";
let audioOut = voice || voiceTracks.length ? "[a]" : null;
if (process.env.PROMO_MUSIC !== "0") {
  const mi = inputs.filter((x) => x === "-i").length;
  inputs.push("-stream_loop", "-1", "-i", MUSIC);
  const vol = audioOut ? 0.22 : 0.6;
  music = `;[${mi}:a]volume=${vol},atrim=0:${total.toFixed(3)},afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, total - 1.6).toFixed(3)}:d=1.6[m]`;
  if (audioOut) music += `;[a][m]amix=inputs=2:normalize=0:duration=first[am]`;
  audioOut = audioOut ? "[am]" : "[m]";
}
const filter = [...parts, concat, phoneScale, chain].join(";") + audio + mix + music;
const file = process.env.PROMO_OUT || path.join(DIR, `promo-${story}-${locale}.mp4`);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[v]",
  ...(audioOut ? ["-map", audioOut, "-c:a", "aac", "-b:a", "160k"] : []),
  "-t", (process.env.PROMO_NOEND === "1" ? phoneDur : total).toFixed(3), "-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file]);
console.log(`${file}  ${total.toFixed(1)}초`);
for (const v of voiceTracks) console.log(`목소리 ${v.at.toFixed(1)}s +${v.len.toFixed(1)}s  ${v.text}`);
console.log(timeline.map((s) => `${s.cap.padEnd(6)} ${s.at.toFixed(1)}–${(s.at + s.dur).toFixed(1)}s x${s.speed}${s.zoom ? " 확대" : ""}`).join("\n"));
