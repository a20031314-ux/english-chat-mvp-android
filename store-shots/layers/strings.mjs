// 스토어 8장(마케팅 층위) 글 — 앱 언어마다. 버튼 이름(통화 버튼·요약 칸·대화 탭)은 앱 문구(copy.ts)를 그대로 쓰고 여기엔 없다.
// 숫자: 2장 = 그림 속 학습 언어 문장구조 수(ROLES lesson2), 3장 = 그림 속 학습 언어 문법 칸 수(ROLES quiz) — marketing-layers 끝 표.
// 원어민 확인 전(store-listing 스킬 기준으로 씀).

/** 앱 언어 → Play 등록정보 폴더(fastlane/metadata/android/<폴더>). */
export const PLAY_FOLDER = {
  ko: "ko-KR", en: "en-US", ja: "ja-JP", zh: "zh-CN", es: "es-ES", hi: "hi-IN", fr: "fr-FR",
  it: "it-IT", pt: "pt-PT", ru: "ru-RU", id: "id", th: "th", vi: "vi", ar: "ar",
};

/**
 * 장마다 그림 속 학습 언어(앱 언어와 겹치지 않게): lesson1 = 1장 Stagebank 칸, quiz = 1·3·8장 Quizbank, lesson2 = 2장 수업,
 * call = 4장 통화(미리 보기 — ja·en 문장만 있음), past = 5장 지난 통화, review = 7·8장 다시 보기.
 */
// 2장 수업은 그 앱 언어 뜻풀이가 있는 영어로(일본어 수업은 ko·en 밖 앱 언어에서 뜻이 영어로 나옴 — 2026-11-02 확인).
const DEFAULT_ROLES = { lesson1: "en", quiz: "es", lesson2: "en", call: "ja", past: "en", review: "fr" };
export const ROLES = {
  ko: { lesson2: "ja" },
  en: { lesson1: "es", quiz: "es", lesson2: "ja", call: "ja", past: "ja", review: "fr" },
  es: { lesson1: "en", quiz: "fr", lesson2: "en", call: "ja", past: "en", review: "it" },
  ja: { lesson1: "en", quiz: "es", lesson2: "en", call: "en", past: "en", review: "fr" },
  fr: { lesson1: "en", quiz: "es", lesson2: "en", call: "ja", past: "en", review: "it" },
};
export const rolesFor = (ui) => ({ ...DEFAULT_ROLES, ...(ROLES[ui] ?? {}) });

/** 그림 속 학습 언어의 분량(2026-11-01 content-scope 표). */
export const SCOPE = { en: [96, 40], es: [99, 37], ja: [96, 40], ko: [100, 40], zh: [99, 35], fr: [97, 37], it: [97, 38] };

/** 4장 고친 말 카드(통화 언어 ja: 昨日友達を会いました → に). 설명은 앱 언어로. ja 앱은 영어 통화(미리 보기 기본 문장). */
export const COACH = {
  ja: { said: "昨日友達を会いました", right: "昨日友達に会いました。" },
  en: { said: "yesterday I go to beach", right: "Yesterday I went to the beach." },
};
export const COACH_WHY = {
  ko: "会う는 を가 아니라 に를 써요.",
  en: "会う (“meet”) takes に, not を.",
  ja: "昨日のことなので go ではなく went。",
  zh: "会う 要用 に，不用 を。",
  es: "会う («ver a alguien») va con に, no con を.",
  hi: "会う के साथ を नहीं, に आता है।",
  fr: "会う (« rencontrer ») se construit avec に, pas を.",
  it: "会う («incontrare») vuole に, non を.",
  pt: "会う («encontrar») usa に, não を.",
  ru: "С 会う («встретить») нужна に, а не を.",
  id: "会う (bertemu) memakai に, bukan を.",
  th: "会う (พบ) ใช้ に ไม่ใช่ を",
  vi: "会う (gặp) đi với に, không phải を.",
  ar: "الفعل 会う (يقابل) يأتي مع に وليس を.",
};

/**
 * h = 장마다 [큰 제목, 작은 글] (8장). rows = 1장 세 칸, loop = 1장 되돌아오는 화살표, call = 4장 버튼 설명(🎓·🙉·💬·💡 차례),
 * known/wrong = 8장 두 줄. {n} = 문장구조 수, {g} = 문법 칸 수.
 */
export const COPY = {
  ko: {
    h: [
      ["언어 공부의 모든 것", "문장구조 90여 개 · 낱말 약 7,000개 · 문법 35~40가지"],
      ["문장 틀을 잡아요", "문장구조 {n}개, 하나씩 내 것으로"],
      ["많이 풀어서 채워요", "낱말 약 7,000개 · 문법 {g}가지\n막힌 것·약한 곳·잊을 때 된 것부터"],
      ["AI 튜터와\n소리 내어 말해요", "큰 실수만 짚고, 바로 다시 말해 봐요"],
      ["통화가 끝나면\n고칠 말만 모아 줘요", "하려던 말을 바른 문장으로"],
      ["같은 언어 배우는\n사람들과", "단체 통화 · 단체방 · Room"],
      ["틀린 말은 정리해서\n다시 문제로", "통화에서 고친 말 → 그 틀 수업 · 다시 보기"],
      ["아는 건 빼고,\n모르는 것만", "내게 필요한 것부터 먼저 나와요"],
    ],
    rows: ["문장 틀을 잡고", "많이 풀어서 채우고", "말하며 바로 고쳐요"],
    loop: "틀린 말은 다시 문제로",
    call: ["큰 실수만 짚고 다시 말해 봐요", "튜터가 더 쉽게 다시 말해요", "필요할 때만 자막", "막히면 힌트"],
    known: "✓ 맞힌 건 잊을 때쯤 한 번 더",
    wrong: "✗ 틀린 건 따로 모아 다시",
  },
  en: {
    h: [
      ["All your language\nlearning in one app", "90+ sentence patterns · about 7,000 words · 35–40 grammar points"],
      ["Get the sentence\npatterns down", "{n} patterns, one at a time"],
      ["Practice until\nit sticks", "About 7,000 words · {g} grammar points\nMisses, weak spots and fading words first"],
      ["Talk out loud\nwith an AI tutor", "Only big mistakes get flagged — then say it again"],
      ["After the call,\njust what to fix", "What you meant, as a correct sentence"],
      ["Learn with others\nstudying it too", "Group calls · Group chats · Room"],
      ["Mistakes come back\nas quizzes", "Lines fixed in calls → that pattern’s lesson · Review"],
      ["Skip what you know,\npractice what you don’t", "What you need comes first"],
    ],
    rows: ["Build sentence patterns", "Fill in with practice", "Speak and get corrected"],
    loop: "Mistakes come back as quizzes",
    call: ["Only big mistakes, then try again", "The tutor says it again, more simply", "Subtitles only when you want", "A hint when you’re stuck"],
    known: "✓ Got it? Back when you might forget",
    wrong: "✗ Missed it? Saved for review",
  },
  ja: {
    h: [
      ["語学が\nぜんぶ、ひとつに", "文型90以上・単語約7,000・文法35〜40項目"],
      ["文の型を\n身につける", "文型{n}個を、ひとつずつ自分のものに"],
      ["たくさん解いて\n定着させる", "単語約7,000・文法{g}項目\nつまずき・苦手・忘れかけから先に"],
      ["AIチューターと\n声に出して話す", "大きなミスだけ指摘、すぐ言い直し"],
      ["通話が終わったら\n直す言葉だけ", "言いたかったことを正しい文に"],
      ["同じ言語を学ぶ\n仲間と", "グループ通話・グループチャット・Room"],
      ["間違えた言葉は\nまた問題に", "通話で直した文 → その文型のレッスン・復習"],
      ["わかるものは飛ばして、\nわからないものだけ", "必要なものから先に出てきます"],
    ],
    rows: ["文の型をつかみ", "たくさん解いて定着", "話してすぐ直す"],
    loop: "間違いはまた問題に",
    call: ["大きなミスだけ、すぐ言い直し", "チューターがやさしく言い直す", "必要なときだけ字幕", "詰まったらヒント"],
    known: "✓ 正解は忘れかけた頃にもう一度",
    wrong: "✗ 間違いはまとめて復習",
  },
  zh: {
    h: [
      ["学语言，\n一个应用就够了", "90+ 句型 · 约 7,000 个单词 · 35–40 个语法点"],
      ["先把句型\n打牢", "{n} 个句型，一个一个变成自己的"],
      ["多练，\n才能记牢", "约 7,000 个单词 · {g} 个语法点\n卡住的、薄弱的、快忘的先练"],
      ["和 AI 老师\n开口说", "只指出大错，马上再说一遍"],
      ["通话结束，\n只整理要改的话", "把你想说的话变成正确的句子"],
      ["和学同一种语言的\n人一起", "群组通话 · 群聊 · Room"],
      ["说错的话\n变成练习题", "通话中改过的句子 → 该句型课程 · 复习"],
      ["会的跳过，\n只练不会的", "你需要的优先出现"],
    ],
    rows: ["打好句型", "多练巩固", "边说边改"],
    loop: "错的会再变成题目",
    call: ["只指大错，马上再说", "老师用更简单的话再说一遍", "需要时才开字幕", "卡住时给提示"],
    known: "✓ 答对的，快忘时再来一次",
    wrong: "✗ 答错的，集中复习",
  },
  es: {
    h: [
      ["Todo para aprender\nidiomas, en una app", "Más de 90 estructuras · unas 7.000 palabras · 35–40 puntos de gramática"],
      ["Domina las\nestructuras", "{n} estructuras, una a una"],
      ["Practica hasta\nque se quede", "Unas 7.000 palabras · {g} puntos de gramática\nPrimero lo que fallas y lo que olvidas"],
      ["Habla en voz alta\ncon un tutor IA", "Solo marca los errores grandes; repítelo al momento"],
      ["Al terminar,\nsolo lo que hay que corregir", "Lo que querías decir, bien dicho"],
      ["Con gente que aprende\ntu mismo idioma", "Llamadas en grupo · Chats de grupo · Room"],
      ["Tus errores vuelven\ncomo ejercicios", "Frases corregidas en llamadas → lección de esa estructura · Repaso"],
      ["Salta lo que sabes,\npractica lo que no", "Primero, lo que necesitas"],
    ],
    rows: ["Domina estructuras", "Practica y afianza", "Habla y corrige"],
    loop: "Los errores vuelven como ejercicios",
    call: ["Solo errores grandes; repítelo", "El tutor lo repite más fácil", "Subtítulos solo si los quieres", "Una pista si te atascas"],
    known: "✓ ¿Acertaste? Vuelve cuando podrías olvidarlo",
    wrong: "✗ ¿Fallaste? Guardado para repasar",
  },
  hi: {
    h: [
      ["भाषा सीखने के लिए\nसब कुछ, एक ऐप में", "90+ वाक्य ढाँचे · करीब 7,000 शब्द · 35–40 व्याकरण बिंदु"],
      ["वाक्य के ढाँचे\nपक्के करें", "{n} ढाँचे, एक-एक करके"],
      ["खूब अभ्यास,\nताकि याद रहे", "करीब 7,000 शब्द · {g} व्याकरण बिंदु\nजो अटका, कमज़ोर या भूलने वाला — पहले वही"],
      ["AI ट्यूटर से\nबोलकर बात करें", "सिर्फ़ बड़ी गलती बताए, तुरंत दोबारा बोलें"],
      ["कॉल के बाद,\nसिर्फ़ सुधारने वाली बातें", "जो कहना था, सही वाक्य में"],
      ["वही भाषा सीखने\nवालों के साथ", "ग्रुप कॉल · ग्रुप चैट · Room"],
      ["गलतियाँ फिर से\nसवाल बनती हैं", "कॉल में सुधरे वाक्य → उस ढाँचे का पाठ · दोहराना"],
      ["जो आता है छोड़ें,\nजो नहीं आता वही", "जिसकी ज़रूरत है, वह पहले"],
    ],
    rows: ["ढाँचे पक्के करें", "अभ्यास से भरें", "बोलें और सुधारें"],
    loop: "गलतियाँ फिर सवाल बनती हैं",
    call: ["सिर्फ़ बड़ी गलती, फिर दोबारा", "ट्यूटर आसान शब्दों में दोहराए", "ज़रूरत हो तभी सबटाइटल", "अटकें तो संकेत"],
    known: "✓ सही? भूलने से पहले फिर एक बार",
    wrong: "✗ गलत? दोहराने के लिए अलग",
  },
  fr: {
    h: [
      ["Tout pour apprendre\nune langue, en une app", "Plus de 90 structures · environ 7 000 mots · 35 à 40 points de grammaire"],
      ["Maîtrisez les\nstructures de phrase", "{n} structures, une à une"],
      ["Pratiquez jusqu’à\nce que ça reste", "Environ 7 000 mots · {g} points de grammaire\nD’abord vos erreurs et ce que vous oubliez"],
      ["Parlez à voix haute\navec un tuteur IA", "Seules les grosses erreurs sont relevées — redites aussitôt"],
      ["Après l’appel,\nl’essentiel à corriger", "Ce que vous vouliez dire, en bonne phrase"],
      ["Avec ceux qui apprennent\nla même langue", "Appels de groupe · Discussions de groupe · Room"],
      ["Vos erreurs reviennent\nen exercices", "Phrases corrigées en appel → leçon de la structure · Révision"],
      ["Passez ce que vous savez,\ntravaillez le reste", "Ce dont vous avez besoin d’abord"],
    ],
    rows: ["Maîtriser les structures", "Pratiquer pour retenir", "Parler et se corriger"],
    loop: "Les erreurs reviennent en exercices",
    call: ["Seules les grosses erreurs, puis on redit", "Le tuteur reformule plus simplement", "Sous-titres seulement si besoin", "Un indice si vous bloquez"],
    known: "✓ Réussi ? Ça revient quand vous risquez d’oublier",
    wrong: "✗ Raté ? Gardé pour la révision",
  },
  it: {
    h: [
      ["Tutto per imparare\nle lingue, in un’app", "Oltre 90 strutture · circa 7.000 parole · 35–40 punti di grammatica"],
      ["Padroneggia le\nstrutture della frase", "{n} strutture, una alla volta"],
      ["Esercitati finché\nnon resta", "Circa 7.000 parole · {g} punti di grammatica\nPrima errori, punti deboli e ciò che stai dimenticando"],
      ["Parla ad alta voce\ncon un tutor IA", "Segnala solo gli errori grandi: poi lo ridici subito"],
      ["Dopo la chiamata,\nsolo cosa correggere", "Quello che volevi dire, nella frase giusta"],
      ["Con chi impara\nla tua stessa lingua", "Chiamate di gruppo · Chat di gruppo · Room"],
      ["Gli errori tornano\ncome esercizi", "Frasi corrette in chiamata → lezione della struttura · Ripasso"],
      ["Salta ciò che sai,\nallena ciò che non sai", "Prima ciò che ti serve"],
    ],
    rows: ["Fissa le strutture", "Esercitati e consolida", "Parla e correggi"],
    loop: "Gli errori tornano come esercizi",
    call: ["Solo errori grandi, poi riprova", "Il tutor lo ripete più semplice", "Sottotitoli solo se vuoi", "Un indizio se ti blocchi"],
    known: "✓ Giusto? Torna quando potresti dimenticarlo",
    wrong: "✗ Sbagliato? Salvato per il ripasso",
  },
  pt: {
    h: [
      ["Tudo para aprender\nlínguas, numa só app", "Mais de 90 estruturas · cerca de 7.000 palavras · 35–40 pontos de gramática"],
      ["Domine as\nestruturas de frase", "{n} estruturas, uma de cada vez"],
      ["Pratique até\nficar", "Cerca de 7.000 palavras · {g} pontos de gramática\nPrimeiro os erros, os pontos fracos e o que está a esquecer"],
      ["Fale em voz alta\ncom um tutor de IA", "Só aponta os erros grandes — e repete logo"],
      ["No fim da chamada,\nsó o que corrigir", "O que queria dizer, numa frase certa"],
      ["Com quem aprende\na mesma língua", "Chamadas de grupo · Chats de grupo · Room"],
      ["Os erros voltam\ncomo exercícios", "Frases corrigidas em chamadas → lição da estrutura · Revisão"],
      ["Salte o que sabe,\npratique o que não sabe", "Primeiro, o que precisa"],
    ],
    rows: ["Domine estruturas", "Pratique e fixe", "Fale e corrija"],
    loop: "Os erros voltam como exercícios",
    call: ["Só erros grandes, depois repete", "O tutor repete de forma mais simples", "Legendas só quando quiser", "Uma dica se ficar preso"],
    known: "✓ Acertou? Volta quando puder esquecer",
    wrong: "✗ Errou? Guardado para rever",
  },
  ru: {
    h: [
      ["Всё для изучения\nязыка — в одном приложении", "90+ конструкций · около 7 000 слов · 35–40 тем грамматики"],
      ["Освойте\nконструкции фраз", "{n} конструкций — по одной"],
      ["Практика, пока\nне запомнится", "Около 7 000 слов · {g} тем грамматики\nСначала ошибки, слабые места и то, что забывается"],
      ["Говорите вслух\nс ИИ-репетитором", "Отмечает только крупные ошибки — и сразу повторите"],
      ["После звонка —\nтолько что исправить", "То, что вы хотели сказать, правильной фразой"],
      ["С теми, кто учит\nтот же язык", "Групповые звонки · Групповые чаты · Room"],
      ["Ошибки возвращаются\nзаданиями", "Исправленные фразы из звонков → урок этой конструкции · Повторение"],
      ["Пропустите известное,\nучите неизвестное", "Нужное — в первую очередь"],
    ],
    rows: ["Освойте конструкции", "Закрепите практикой", "Говорите и исправляйте"],
    loop: "Ошибки возвращаются заданиями",
    call: ["Только крупные ошибки, затем ещё раз", "Репетитор повторит проще", "Субтитры — только когда нужно", "Подсказка, если застряли"],
    known: "✓ Верно? Вернётся, когда можно забыть",
    wrong: "✗ Ошибка? Сохранено для повторения",
  },
  id: {
    h: [
      ["Semua untuk belajar\nbahasa, dalam satu app", "90+ pola kalimat · sekitar 7.000 kata · 35–40 materi tata bahasa"],
      ["Kuasai pola\nkalimat", "{n} pola, satu per satu"],
      ["Latihan sampai\nbenar-benar ingat", "Sekitar 7.000 kata · {g} materi tata bahasa\nYang salah, yang lemah, dan yang mulai lupa duluan"],
      ["Bicara langsung\ndengan tutor AI", "Hanya kesalahan besar yang dikoreksi — lalu ucapkan lagi"],
      ["Setelah telepon,\nhanya yang perlu diperbaiki", "Yang ingin kamu katakan, jadi kalimat yang benar"],
      ["Bersama orang yang\nbelajar bahasa yang sama", "Telepon grup · Obrolan grup · Room"],
      ["Kesalahan kembali\njadi latihan", "Kalimat yang dikoreksi saat telepon → pelajaran polanya · Ulasan"],
      ["Lewati yang sudah tahu,\nlatih yang belum", "Yang kamu butuhkan muncul duluan"],
    ],
    rows: ["Kuasai pola", "Latihan biar melekat", "Bicara & koreksi"],
    loop: "Kesalahan kembali jadi latihan",
    call: ["Hanya kesalahan besar, lalu coba lagi", "Tutor mengulang lebih sederhana", "Subtitle hanya saat perlu", "Petunjuk saat buntu"],
    known: "✓ Benar? Muncul lagi saat mulai lupa",
    wrong: "✗ Salah? Disimpan untuk diulang",
  },
  th: {
    h: [
      ["ทุกอย่างสำหรับเรียนภาษา\nในแอปเดียว", "โครงสร้างประโยค 90+ · คำศัพท์ราว 7,000 คำ · ไวยากรณ์ 35–40 เรื่อง"],
      ["วางโครงสร้าง\nประโยคให้แน่น", "{n} โครงสร้าง ทีละอันจนเป็นของคุณ"],
      ["ฝึกเยอะ ๆ\nจนจำได้", "คำศัพท์ราว 7,000 คำ · ไวยากรณ์ {g} เรื่อง\nเรื่องที่ติด จุดอ่อน และที่ใกล้ลืมมาก่อน"],
      ["พูดออกเสียง\nกับติวเตอร์ AI", "บอกเฉพาะข้อผิดใหญ่ แล้วพูดใหม่ทันที"],
      ["วางสายแล้ว\nสรุปเฉพาะที่ต้องแก้", "สิ่งที่อยากพูด ในประโยคที่ถูกต้อง"],
      ["กับคนที่เรียน\nภาษาเดียวกัน", "โทรกลุ่ม · แชทกลุ่ม · Room"],
      ["คำที่พูดผิด\nกลับมาเป็นโจทย์", "ประโยคที่แก้ในสาย → บทเรียนโครงสร้างนั้น · ทบทวน"],
      ["ข้ามที่รู้แล้ว\nฝึกแค่ที่ยังไม่รู้", "สิ่งที่คุณต้องการขึ้นมาก่อน"],
    ],
    rows: ["วางโครงสร้าง", "ฝึกให้แม่น", "พูดแล้วแก้ทันที"],
    loop: "ที่ผิดกลับมาเป็นโจทย์",
    call: ["บอกเฉพาะข้อผิดใหญ่ แล้วพูดใหม่", "ติวเตอร์พูดใหม่ให้ง่ายขึ้น", "ซับไตเติลเฉพาะตอนต้องการ", "ติดเมื่อไรมีคำใบ้"],
    known: "✓ ตอบถูก? กลับมาอีกตอนใกล้ลืม",
    wrong: "✗ ตอบผิด? เก็บไว้ทบทวน",
  },
  vi: {
    h: [
      ["Mọi thứ để học\nngoại ngữ, trong một app", "90+ mẫu câu · khoảng 7.000 từ · 35–40 điểm ngữ pháp"],
      ["Nắm chắc\nmẫu câu", "{n} mẫu câu, từng cái một"],
      ["Luyện nhiều\nđể nhớ lâu", "Khoảng 7.000 từ · {g} điểm ngữ pháp\nCái bị vấp, điểm yếu, cái sắp quên — làm trước"],
      ["Nói thành tiếng\nvới gia sư AI", "Chỉ nhắc lỗi lớn, rồi nói lại ngay"],
      ["Gọi xong,\nchỉ tóm những câu cần sửa", "Điều bạn muốn nói, thành câu đúng"],
      ["Cùng những người học\nchung một ngôn ngữ", "Gọi nhóm · Trò chuyện nhóm · Room"],
      ["Câu nói sai\nquay lại thành bài tập", "Câu đã sửa trong cuộc gọi → bài học mẫu câu đó · Ôn lại"],
      ["Bỏ qua cái đã biết,\nchỉ luyện cái chưa biết", "Cái bạn cần sẽ đến trước"],
    ],
    rows: ["Nắm mẫu câu", "Luyện cho nhớ", "Nói và sửa ngay"],
    loop: "Câu sai quay lại thành bài tập",
    call: ["Chỉ lỗi lớn, rồi nói lại", "Gia sư nói lại dễ hơn", "Phụ đề chỉ khi cần", "Gợi ý khi bị kẹt"],
    known: "✓ Đúng? Quay lại khi sắp quên",
    wrong: "✗ Sai? Gom lại để ôn",
  },
  ar: {
    h: [
      ["كل ما تحتاجه لتعلم اللغة\nفي تطبيق واحد", "أكثر من 90 تركيبًا · نحو 7,000 كلمة · 35–40 درسًا في القواعد"],
      ["أتقن تراكيب\nالجمل", "{n} تركيبًا، واحدًا تلو الآخر"],
      ["تدرّب حتى\nيثبت في ذهنك", "نحو 7,000 كلمة · {g} درسًا في القواعد\nما تعثّرت فيه ونقاط ضعفك وما أوشكت أن تنساه أولًا"],
      ["تحدّث بصوتك\nمع مدرّس ذكاء اصطناعي", "ينبّهك إلى الأخطاء الكبيرة فقط، ثم تعيد فورًا"],
      ["بعد المكالمة،\nفقط ما يحتاج إلى تصحيح", "ما أردت قوله، في جملة صحيحة"],
      ["مع من يتعلمون\nاللغة نفسها", "مكالمات جماعية · دردشات جماعية · Room"],
      ["أخطاؤك تعود\nتمارين", "جمل صُحّحت في المكالمة ← درس ذلك التركيب · المراجعة"],
      ["تخطَّ ما تعرفه،\nوتدرّب على ما لا تعرفه", "ما تحتاجه يأتي أولًا"],
    ],
    rows: ["أتقن التراكيب", "تدرّب لتثبّت", "تحدّث وصحّح"],
    loop: "الأخطاء تعود تمارين",
    call: ["الأخطاء الكبيرة فقط، ثم أعد", "يعيد المدرّس الجملة بأبسط", "ترجمة نصية عند الحاجة فقط", "تلميح عندما تتعثر"],
    known: "✓ أصبت؟ يعود حين قد تنساه",
    wrong: "✗ أخطأت؟ محفوظ للمراجعة",
  },
};

/** 그림 위 학습 언어 칩: 국기만(언어 이름 번역 없이). */
export const FLAG = { en: "🇺🇸", es: "🇪🇸", ja: "🇯🇵", ko: "🇰🇷", fr: "🇫🇷", it: "🇮🇹", zh: "🇨🇳" };
