// 스토어 8장: 한 장에 탭의 핵심 기능 하나(큰 화면) + 세부 기능 둘(확대 카드) + 더 있는 기능(칩).
// 사용자 결정(2026-10-18): 한 장에 기능 하나일 필요 없음, 8장 안에서 핵심 기능 중심으로 세부 기능도 보이게.
// 화면은 실제 앱을 돌려 찍은 것(scripts/capture-whats-new.mjs store-my / store-tabs → tmp/store-raw/<locale>/).
// 영어 앱은 스페인어를, 나머지는 영어를 배운다.

/**
 * main = 큰 휴대폰 화면, details = [장면, 잘라 보일 위치(화면 높이 대비 위쪽 끝 0~1)] 두 개.
 * 카드는 화면 높이의 약 56%를 보여준다.
 */
export const SHOTS = [
  { id: "map", main: "mapview", details: [["mission", 0.08], ["weak", 0.12]] },
  { id: "chat", main: "chat-expression", details: [["chat-correct", 0.06], ["links", 0.3]] },
  { id: "ask", main: "chat-ask", details: [["chat-word", 0.0], ["pick", 0.4]] },
  { id: "my", main: "growth", details: [["myask", 0.44], ["ledger", 0.0]] },
  { id: "call", main: "meant", details: [["call-pack", 0.17], ["calltools", 0.4]] },
  { id: "video", main: "video-study", details: [["video-ask", 0.0], ["vocab-search", 0.04]] },
  { id: "room", main: "quote", details: [["hint", 0.22], ["rooms-mini", 0.44]] },
  { id: "people", main: "people", details: [["group-pick", 0.0], ["invite", 0.46]] },
];

/** 등록정보마다 바꾸는 장면. 오늘의 팩은 영어·일본어 학습만 있어 영어 앱(스페인어 학습)은 내 문장 말해보기로. */
export const OVERRIDES = {
  en: { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
};

export const LISTINGS = [
  { folder: "0_default-english", locale: "en", lang: "en", font: "'Noto Sans', sans-serif" },
  { folder: "1_korea", locale: "ko", lang: "ko", font: "'Noto Sans CJK KR', sans-serif" },
  { folder: "2_japan", locale: "ja", lang: "ja", font: "'Noto Sans CJK JP', sans-serif" },
  { folder: "3_china", locale: "zh", lang: "zh", font: "'Noto Sans CJK SC', sans-serif" },
  { folder: "4_spain", locale: "es", lang: "es", font: "'Noto Sans', sans-serif" },
  { folder: "5_india", locale: "hi", lang: "hi", font: "'Noto Sans Devanagari', 'Noto Sans', sans-serif" },
];

/** 장마다 [작은 제목, 큰 제목, 설명, [화면 이름: 큰 화면, 세부1, 세부2], [더 있는 기능 칩 셋]]. */
export const COPY = {
  ko: {
    map: ["My · 학습 지도", "목표만 정하면\n공부할 길이 보여요", "체크 몇 개로 상황·표현·어휘·발음 지도를 그려요", ["학습 지도", "할 일 연습", "자주 틀림"], ["힌트 3단계", "숙지·배운 것 표시", "복습하기"]],
    chat: ["채팅", "막히면 한국어로.\n영어는 바로 아래", "친구처럼 대화하고 틀린 곳만 고쳐줘요", ["표현 카드", "교정", "영상에서 만난 표현"], ["해석", "먼저 말 걸기", "지난 대화"]],
    ask: ["문장분석", "궁금한 부분을 골라\n바로 물어보세요", "여기서 무슨 뜻인지 한국어로 알려줘요", ["빠른 질문", "단어 카드", "지도에 넣기"], ["왜 이런 형태야?", "비슷한 표현", "알아요·모르겠어요"]],
    my: ["My · 자라는 중", "대화할수록\n실력이 자라요", "여섯 갈래로 쌓이고, 물어보면 근거로 답해요", ["자라는 중", "직접 묻기", "내 표현"], ["망·그래프·지도 보기", "다음에 키울 곳", "오늘 해볼 것"]],
    call: ["통화", "AI 친구와\n소리 내서 말해요", "엉망으로 말해도 하려던 말을 찾아줘요", ["되살리기", "오늘의 팩 통화", "다시 말해보기"], ["막힐 때 도움말", "해석 접기·펴기", "내 문장 말해보기"]],
    video: ["영상 학습", "진짜 영상을\n한 문장씩 나눠서", "구간을 누르면 다시 재생, 자막도 바로 물어봐요", ["구간 나누기", "자막 질문", "단어장"], ["구간 묶기·쪼개기", "저장", "나오는 장면 찾기"]],
    room: ["Room", "같은 언어 배우는 사람들과\n목소리로 대화해요", "말하는 대로 자막, 누르면 내 언어로", ["낱말 골라 묻기", "💡 힌트", "작게 접기"], ["🌐 자유 대화방", "참여 요청·빈자리", "채팅 위주 보기"]],
    people: ["사람 · 대화", "함께 배우는 친구를\n찾고 이어가요", "팔로우하고, 단체방과 1:1로 계속 대화해요", ["사람", "단체방에서 골라 묻기", "친구 초대"], ["게시판·답글", "메시지·통화", "1:1 영상통화"]],
  },
  en: {
    map: ["MY · STUDY MAP", "Pick a goal.\nGet a map.", "A few ticks draw situations, phrases, words and sounds", ["Study map", "Missions", "Weak spots"], ["Three hints", "Learned vs. mastered", "Review"]],
    chat: ["CHAT", "Stuck? Write in English.\nSee it in Spanish.", "Chat like friends; only the slips get fixed", ["Expression card", "Corrections", "Met in a video"], ["Translation", "Tutor starts", "Past chats"]],
    ask: ["SENTENCE TOOLS", "Pick any part.\nAsk right away.", "What it means here, in plain English", ["Quick question", "Word card", "Put on my map"], ["Why this form?", "Other ways to say it", "Know it / Don't"]],
    my: ["MY PROGRESS", "Talk more,\nwatch it grow", "Six branches that only grow, and answers from your record", ["Growing", "Ask about me", "My phrases"], ["Net, graph or map", "What to grow next", "Try today"]],
    call: ["CALLS", "Speak out loud\nwith an AI friend", "Said it wrong? It finds what you meant", ["What you meant", "Say your own line", "Say it again"], ["Help when stuck", "Show or hide translations", "Pause and pick up later"]],
    video: ["VIDEO STUDY", "Real videos,\nsplit into sentences", "Tap a line to replay it, and ask about any subtitle", ["Split into lines", "Ask about a line", "Word bank"], ["Join or split lines", "Save", "Find scenes"]],
    room: ["ROOM", "Talk out loud with\nfellow learners", "Live captions as you speak, tap to translate", ["Pick words to ask", "💡 Hints", "Minimize"], ["🌐 Free talk", "Ask to join", "Chat-first view"]],
    people: ["PEOPLE · CHATS", "Find study friends\nand keep going", "Follow, then keep talking in groups and one to one", ["People", "Ask in group chat", "Invite a friend"], ["Board & replies", "Messages and calls", "1:1 video calls"]],
  },
  ja: {
    map: ["マイ · 学習マップ", "目標を決めるだけで\n学ぶ道が見える", "チェックだけで場面・表現・語彙・発音のマップに", ["学習マップ", "ミッション", "よくある間違い"], ["ヒント3段階", "習得・学習済み", "復習"]],
    chat: ["チャット", "詰まったら日本語で。\n英語はすぐ下に", "友達のように話して、間違いだけ直してくれる", ["表現カード", "添削", "動画で出会った表現"], ["翻訳", "AIから話しかける", "過去の会話"]],
    ask: ["文の分析", "気になる所を選んで\nすぐ質問", "ここでの意味を日本語で教えてくれる", ["クイック質問", "単語カード", "マップに追加"], ["なぜこの形?", "似た表現", "わかる・わからない"]],
    my: ["マイ · 成長", "話すほど\n力が育つ", "6つの枝で積み上がり、聞けば記録をもとに答える", ["成長中", "質問する", "マイ表現"], ["ネット・グラフ・マップ", "次に育てる所", "やってみよう"]],
    call: ["通話", "AIの友達と\n声に出して話す", "めちゃくちゃに話しても言いたいことを見つける", ["言いたかったこと", "今日のパック通話", "もう一度言う"], ["詰まった時のヒント", "翻訳の表示切替", "自分の文を言ってみる"]],
    video: ["動画学習", "本物の動画を\n一文ずつに分けて", "区間をタップで再生、字幕もすぐ質問", ["区間に分ける", "字幕の質問", "単語帳"], ["区間をまとめる・分ける", "保存", "場面を探す"]],
    room: ["Room", "同じ言語を学ぶ人と\n声で話そう", "話した言葉は字幕に、タップで日本語に", ["単語を選んで質問", "💡 ヒント", "小さく"], ["🌐 フリートーク", "参加リクエスト", "チャット中心"]],
    people: ["人 · 会話", "一緒に学ぶ友達を\n見つけて続ける", "フォローして、グループや1対1で話し続ける", ["人", "グループで単語を質問", "友達を招待"], ["掲示板・返信", "メッセージ・通話", "1対1ビデオ通話"]],
  },
  zh: {
    map: ["我的 · 学习地图", "定下目标\n学习路线一目了然", "勾选几项，画出场景、表达、词汇和发音地图", ["学习地图", "任务练习", "常犯错误"], ["三级提示", "已学·已掌握", "复习"]],
    chat: ["聊天", "卡住了就用中文\n英语表达就在下面", "像朋友一样聊天，只改错的地方", ["表达卡片", "纠错", "视频里见过的表达"], ["翻译", "让AI先开口", "历史对话"]],
    ask: ["句子分析", "选中想问的部分\n马上提问", "用中文告诉你这里是什么意思", ["快速提问", "单词卡片", "加入地图"], ["为什么这样用?", "类似表达", "知道·不知道"]],
    my: ["我的 · 成长", "越聊越多\n能力越长越大", "六个分支只增不减，问就根据记录回答", ["成长中", "直接问", "我的表达"], ["网·图表·地图", "下一步练什么", "今天试试"]],
    call: ["通话", "和AI朋友\n开口说", "说得再乱，也能找出你想说的", ["还原原意", "今日套餐通话", "再说一遍"], ["卡住时的提示", "翻译显示切换", "练自己的句子"]],
    video: ["视频学习", "真实视频\n按句子切分", "点片段重播，字幕也能马上问", ["切分句子", "字幕提问", "单词本"], ["合并·拆分片段", "收藏", "查找场景"]],
    room: ["Room", "和一起学语言的人\n开口聊天", "说话实时字幕，点一下翻成中文", ["选词提问", "💡 提示", "缩小"], ["🌐 自由聊天", "申请上麦", "以聊天为主"]],
    people: ["人 · 对话", "找到学习伙伴\n一直聊下去", "关注后，在群聊和私聊里继续交流", ["人", "群聊里选词提问", "邀请朋友"], ["论坛·回复", "私信·通话", "一对一视频通话"]],
  },
  es: {
    map: ["MI MAPA", "Elige una meta.\nVe tu camino.", "Unas marcas dibujan situaciones, frases, palabras y sonidos", ["Mapa", "Misiones", "Errores frecuentes"], ["Tres pistas", "Aprendido y dominado", "Repasar"]],
    chat: ["CHAT", "¿Te atascas? En español.\nEl inglés, debajo.", "Charla como con amigos; solo corrige lo que falla", ["Tarjeta de expresión", "Corrección", "Visto en un vídeo"], ["Traducción", "El tutor empieza", "Chats anteriores"]],
    ask: ["ANÁLISIS DE FRASE", "Elige una parte.\nPregunta al momento.", "Qué significa aquí, en español", ["Pregunta rápida", "Tarjeta de palabra", "Al mapa"], ["¿Por qué esta forma?", "Otras formas", "Lo sé / No lo sé"]],
    my: ["MI PROGRESO", "Cuanto más hablas,\nmás creces", "Seis ramas que solo crecen, y respuestas con tu historial", ["Creciendo", "Pregunta", "Mis expresiones"], ["Red, gráfica o mapa", "Qué trabajar", "Prueba hoy"]],
    call: ["LLAMADAS", "Habla en voz alta\ncon un amigo IA", "¿Lo dijiste mal? Encuentra lo que querías decir", ["Lo que querías decir", "Llamada del día", "Dilo otra vez"], ["Ayuda si te atascas", "Mostrar traducciones", "Practica tu frase"]],
    video: ["VÍDEOS", "Vídeos reales,\nfrase a frase", "Toca una línea para repetirla y pregunta por el subtítulo", ["Dividir en frases", "Preguntar", "Vocabulario"], ["Unir o dividir", "Guardar", "Buscar escenas"]],
    room: ["ROOM", "Habla en voz alta\ncon otros estudiantes", "Subtítulos al hablar, toca para traducir", ["Elige palabras y pregunta", "💡 Pistas", "Minimizar"], ["🌐 Charla libre", "Pedir unirse", "Vista de chat"]],
    people: ["PERSONAS · CHATS", "Encuentra compañeros\ny sigue hablando", "Sigue a gente y habla en grupos y en privado", ["Personas", "Pregunta en el grupo", "Invitar"], ["Tablón y respuestas", "Mensajes y llamadas", "Videollamadas 1:1"]],
  },
  hi: {
    map: ["My · सीखने का नक्शा", "लक्ष्य चुनें,\nरास्ता दिख जाएगा", "कुछ टिक से स्थितियाँ, वाक्यांश, शब्द और उच्चारण का नक्शा", ["नक्शा", "मिशन", "बार-बार की गलती"], ["तीन संकेत", "सीखा·पक्का", "दोहराएँ"]],
    chat: ["चैट", "अटक गए? हिंदी में लिखिए।\nअंग्रेज़ी ठीक नीचे", "दोस्त की तरह बात करें, सिर्फ़ गलती सुधरेगी", ["वाक्यांश कार्ड", "सुधार", "वीडियो में मिला"], ["अनुवाद", "ट्यूटर पहले बोले", "पिछली चैट"]],
    ask: ["वाक्य विश्लेषण", "कोई भी हिस्सा चुनें,\nतुरंत पूछें", "यहाँ इसका मतलब, हिंदी में", ["तुरंत सवाल", "शब्द कार्ड", "नक्शे में डालें"], ["यह रूप क्यों?", "दूसरे तरीके", "आता है·नहीं आता"]],
    my: ["My · प्रगति", "जितनी बात करें,\nउतना आगे बढ़ें", "छह शाखाएँ जो बढ़ती ही हैं, और आपके रिकॉर्ड से जवाब", ["बढ़ रहा है", "सीधे पूछें", "मेरे वाक्यांश"], ["जाल·ग्राफ़·नक्शा", "आगे क्या बढ़ाएँ", "आज आज़माएँ"]],
    call: ["कॉल", "AI दोस्त से\nबोलकर बात करें", "गलत बोला? जो कहना था, वो मिल जाएगा", ["असली मतलब", "आज का पैक कॉल", "फिर से बोलें"], ["अटकने पर मदद", "अनुवाद दिखाएँ·छिपाएँ", "अपना वाक्य बोलें"]],
    video: ["वीडियो से सीखें", "असली वीडियो,\nवाक्य-दर-वाक्य", "लाइन टैप करें तो दोबारा चले, सबटाइटल पर सवाल भी", ["वाक्यों में बाँटें", "लाइन पर सवाल", "शब्दकोश"], ["जोड़ें·बाँटें", "सेव", "दृश्य खोजें"]],
    room: ["Room", "साथ सीखने वालों से\nबोलकर बात करें", "बोलते ही सबटाइटल, टैप करें तो हिंदी में", ["शब्द चुनकर पूछें", "💡 संकेत", "छोटा करें"], ["🌐 खुली बातचीत", "जुड़ने का अनुरोध", "चैट वाला दृश्य"]],
    people: ["लोग · बातचीत", "साथ सीखने वाले दोस्त\nढूँढें और जुड़े रहें", "फ़ॉलो करें, फिर ग्रुप और निजी बातचीत", ["लोग", "ग्रुप में शब्द पूछें", "दोस्त को बुलाएँ"], ["बोर्ड और जवाब", "संदेश·कॉल", "1:1 वीडियो कॉल"]],
  },
};
