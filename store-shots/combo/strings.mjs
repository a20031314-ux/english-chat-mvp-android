// 스토어 8장: 한 장에 탭의 핵심 기능 하나(큰 화면) + 세부 기능 둘(확대 카드) + 더 있는 기능(칩).
// 사용자 결정(2026-10-18): 한 장에 기능 하나일 필요 없음, 8장 안에서 핵심 기능 중심으로 세부 기능도 보이게.
// 화면은 실제 앱을 돌려 찍은 것(scripts/capture-whats-new.mjs store-my / store-tabs → tmp/store-raw/<locale>/).
// 영어 앱은 스페인어를, 나머지는 영어를 배운다.

/**
 * main = 큰 휴대폰 화면, details = [장면, 잘라 보일 위치(화면 높이 대비 위쪽 끝 0~1)] 두 개.
 * 카드는 화면 높이의 약 56%를 보여준다.
 */
export const SHOTS = [
  // 2026-10-25 사용자: 로그인·아이콘·프로필 세부 같은 자잘한 건 빼고 핵심 기능 위주로.
  { id: "map", main: "stage-next", details: [["stage-parts", 0.4], ["stage-start", 0.36]] },
  { id: "chat", main: "chat-expression", details: [["chat-fix-open", 0.06], ["links", 0.3]] },
  { id: "ask", main: "chat-ask", details: [["chat-word", 0.0], ["pick", 0.4]] },
  { id: "my", main: "parts-net", details: [["parts-graph", 0.1], ["notebook-today", 0.45]] },
  { id: "call", main: "meant", details: [["call-pack", 0.17], ["calltools", 0.4]] },
  { id: "video", main: "video-study", details: [["video-ask", 0.0], ["vocab-search", 0.04]] },
  { id: "room", main: "quote", details: [["room-game", 0.28], ["freetalk", 0.2]] },
  { id: "people", main: "group-pick", details: [["people-lang", 0.18], ["layouts", 0.22]] },
];

/** 등록정보마다 바꾸는 장면. 오늘의 팩은 영어·일본어 학습만 있어 영어 앱(스페인어 학습)은 내 문장 말해보기로. */
export const OVERRIDES = {
  en: { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
  // 오늘의 팩이 없는 배우는 언어(중국어·스페인어·한국어).
  "ko-zh": { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
  "ko-es": { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
  "en-ko": { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
  "ja-ko": { call: { details: [["call-ownline", 0.3], ["calltools", 0.4]] } },
};

export const LISTINGS = [
  { folder: "0_default-english", locale: "en", lang: "en", font: "'Noto Sans', sans-serif" },
  { folder: "1_korea", locale: "ko", lang: "ko", font: "'Noto Sans CJK KR', sans-serif" },
  { folder: "2_japan", locale: "ja", lang: "ja", font: "'Noto Sans CJK JP', sans-serif" },
  { folder: "3_china", locale: "zh", lang: "zh", font: "'Noto Sans CJK SC', sans-serif" },
  { folder: "4_spain", locale: "es", lang: "es", font: "'Noto Sans', sans-serif" },
  { folder: "5_india", locale: "hi", lang: "hi", font: "'Noto Sans Devanagari', 'Noto Sans', sans-serif" },
  // 나라 더 쪼개기(2026-10-23): 영어를 배우는 앱 언어별.
  { folder: "6_brazil", locale: "pt", lang: "pt-BR", font: "'Noto Sans', sans-serif" },
  { folder: "7_vietnam", locale: "vi", lang: "vi", font: "'Noto Sans', sans-serif" },
  { folder: "8_thailand", locale: "th", lang: "th", font: "'Noto Sans Thai', 'Noto Sans', sans-serif" },
  { folder: "9_indonesia", locale: "id", lang: "id", font: "'Noto Sans', sans-serif" },
  { folder: "10_arabic", locale: "ar", lang: "ar", dir: "rtl", font: "'Noto Naskh Arabic', 'Noto Sans', sans-serif" },
  { folder: "11_france", locale: "fr", lang: "fr", font: "'Noto Sans', sans-serif" },
  // 배우는 언어별 검색어 등록정보: locale = <앱 언어>-<배우는 언어>.
  { folder: "k1_ko-learn-ja", locale: "ko-ja", lang: "ko", font: "'Noto Sans CJK KR', sans-serif" },
  { folder: "k2_ko-learn-zh", locale: "ko-zh", lang: "ko", font: "'Noto Sans CJK KR', sans-serif" },
  { folder: "k3_ko-learn-es", locale: "ko-es", lang: "ko", font: "'Noto Sans CJK KR', sans-serif" },
  { folder: "k4_en-learn-ko", locale: "en-ko", lang: "en", font: "'Noto Sans', 'Noto Sans CJK KR', sans-serif" },
  { folder: "k5_ja-learn-ko", locale: "ja-ko", lang: "ja", font: "'Noto Sans CJK JP', sans-serif" },
];

/** 장마다 [작은 제목, 큰 제목, 설명, [화면 이름: 큰 화면, 세부1, 세부2], [더 있는 기능 칩 셋]]. */
export const COPY = {
  ko: {
    map: ["My · 대화로 시작", "할 수 있는 대화부터\n내 자리에서 시작해요", "대화 예시를 고르면 거기서 학습 지도가 시작돼요", ["이런 대화, 할 수 있어요?", "학습 지도", "미션"], ["이 부분의 문법", "글자·소리부터", "힌트 3단계"]],
    chat: ["채팅", "막히면 한국어로.\n영어는 바로 아래", "친구처럼 대화하고 틀린 곳만 고쳐줘요", ["표현 카드", "고칠 곳이 있어요", "영상에서 만난 표현"], ["해석", "먼저 말 걸기", "지난 대화"]],
    ask: ["문장분석", "궁금한 부분을 골라\n바로 물어보세요", "여기서 무슨 뜻인지 한국어로 알려줘요", ["빠른 질문", "단어 카드", "지도에 넣기"], ["왜 이런 형태야?", "비슷한 표현", "알아요·모르겠어요"]],
    my: ["My · 자라는 중", "대화할수록\n실력이 자라요", "여섯 갈래로 쌓이고, 물어보면 근거로 답해요", ["자라는 중", "직접 묻기", "내 표현"], ["망·그래프·지도 보기", "다음에 키울 곳", "오늘 해볼 것"]],
    call: ["통화", "AI 친구와\n소리 내서 말해요", "엉망으로 말해도 하려던 말을 찾아줘요", ["되살리기", "오늘의 팩 통화", "다시 말해보기"], ["막힐 때 도움말", "해석 접기·펴기", "내 문장 말해보기"]],
    video: ["영상 학습", "진짜 영상을\n한 문장씩 나눠서", "구간을 누르면 다시 재생, 자막도 바로 물어봐요", ["구간 나누기", "자막 질문", "단어장"], ["구간 묶기·쪼개기", "저장", "나오는 장면 찾기"]],
    room: ["Room", "같은 언어 배우는 사람들과\n목소리로 대화해요", "말하는 대로 자막, 누르면 내 언어로", ["낱말 골라 묻기", "💡 힌트", "작게 접기"], ["🌐 자유 대화방", "참여 요청·빈자리", "채팅 위주 보기"]],
    people: ["사람 · 대화", "함께 배우는 친구를\n찾고 이어가요", "팔로우하고, 단체방과 1:1로 계속 대화해요", ["사람", "단체방에서 골라 묻기", "친구 초대"], ["게시판·답글", "메시지·통화", "1:1 영상통화"]],
  },
  en: {
    map: ["MY · START FROM A CONVERSATION", "Start from what\nyou can already say", "Pick the conversations you can have; your map starts there", ["Could you have this conversation?", "Study map", "Missions"], ["Grammar in this part", "Letters and sounds first", "Three hints"]],
    chat: ["CHAT", "Stuck? Write in English.\nSee it in Spanish.", "Chat like friends; only the slips get fixed", ["Expression card", "Something to fix", "Met in a video"], ["Translation", "Tutor starts", "Past chats"]],
    ask: ["SENTENCE TOOLS", "Pick any part.\nAsk right away.", "What it means here, in plain English", ["Quick question", "Word card", "Put on my map"], ["Why this form?", "Other ways to say it", "Know it / Don't"]],
    my: ["MY PROGRESS", "Talk more,\nwatch it grow", "Six branches that only grow, and answers from your record", ["Growing", "Ask about me", "My phrases"], ["Net, graph or map", "What to grow next", "Try today"]],
    call: ["CALLS", "Speak out loud\nwith an AI friend", "Said it wrong? It finds what you meant", ["What you meant", "Say your own line", "Say it again"], ["Help when stuck", "Show or hide translations", "Pause and pick up later"]],
    video: ["VIDEO STUDY", "Real videos,\nsplit into sentences", "Tap a line to replay it, and ask about any subtitle", ["Split into lines", "Ask about a line", "Word bank"], ["Join or split lines", "Save", "Find scenes"]],
    room: ["ROOM", "Talk out loud with\nfellow learners", "Live captions as you speak, tap to translate", ["Pick words to ask", "💡 Hints", "Minimize"], ["🌐 Free talk", "Ask to join", "Chat-first view"]],
    people: ["PEOPLE · CHATS", "Find study friends\nand keep going", "Follow, then keep talking in groups and one to one", ["People", "Ask in group chat", "Invite a friend"], ["Board & replies", "Messages and calls", "1:1 video calls"]],
  },
  ja: {
    map: ["マイ · 会話から始める", "できる会話から\n自分の位置で始める", "会話の例を選ぶと、そこから学習マップが始まる", ["こんな会話、できますか？", "学習マップ", "ミッション"], ["この部分の文法", "まずは文字と音", "ヒント3段階"]],
    chat: ["チャット", "詰まったら日本語で。\n英語はすぐ下に", "友達のように話して、間違いだけ直してくれる", ["表現カード", "直すところがあります", "動画で出会った表現"], ["翻訳", "AIから話しかける", "過去の会話"]],
    ask: ["文の分析", "気になる所を選んで\nすぐ質問", "ここでの意味を日本語で教えてくれる", ["クイック質問", "単語カード", "マップに追加"], ["なぜこの形?", "似た表現", "わかる・わからない"]],
    my: ["マイ · 成長", "話すほど\n力が育つ", "6つの枝で積み上がり、聞けば記録をもとに答える", ["成長中", "質問する", "マイ表現"], ["ネット・グラフ・マップ", "次に育てる所", "やってみよう"]],
    call: ["通話", "AIの友達と\n声に出して話す", "めちゃくちゃに話しても言いたいことを見つける", ["言いたかったこと", "今日のパック通話", "もう一度言う"], ["詰まった時のヒント", "翻訳の表示切替", "自分の文を言ってみる"]],
    video: ["動画学習", "本物の動画を\n一文ずつに分けて", "区間をタップで再生、字幕もすぐ質問", ["区間に分ける", "字幕の質問", "単語帳"], ["区間をまとめる・分ける", "保存", "場面を探す"]],
    room: ["Room", "同じ言語を学ぶ人と\n声で話そう", "話した言葉は字幕に、タップで日本語に", ["単語を選んで質問", "💡 ヒント", "小さく"], ["🌐 フリートーク", "参加リクエスト", "チャット中心"]],
    people: ["人 · 会話", "一緒に学ぶ友達を\n見つけて続ける", "フォローして、グループや1対1で話し続ける", ["人", "グループで単語を質問", "友達を招待"], ["掲示板・返信", "メッセージ・通話", "1対1ビデオ通話"]],
  },
  zh: {
    map: ["我的 · 从对话开始", "从能做到的对话\n在你的位置开始", "选几段对话示例，学习地图就从那里开始", ["这样的对话，你能做到吗？", "学习地图", "任务练习"], ["这一部分的语法", "先学字母和发音", "三级提示"]],
    chat: ["聊天", "卡住了就用中文\n英语表达就在下面", "像朋友一样聊天，只改错的地方", ["表达卡片", "有需要修改的地方", "视频里见过的表达"], ["翻译", "让AI先开口", "历史对话"]],
    ask: ["句子分析", "选中想问的部分\n马上提问", "用中文告诉你这里是什么意思", ["快速提问", "单词卡片", "加入地图"], ["为什么这样用?", "类似表达", "知道·不知道"]],
    my: ["我的 · 成长", "越聊越多\n能力越长越大", "六个分支只增不减，问就根据记录回答", ["成长中", "直接问", "我的表达"], ["网·图表·地图", "下一步练什么", "今天试试"]],
    call: ["通话", "和AI朋友\n开口说", "说得再乱，也能找出你想说的", ["还原原意", "今日套餐通话", "再说一遍"], ["卡住时的提示", "翻译显示切换", "练自己的句子"]],
    video: ["视频学习", "真实视频\n按句子切分", "点片段重播，字幕也能马上问", ["切分句子", "字幕提问", "单词本"], ["合并·拆分片段", "收藏", "查找场景"]],
    room: ["Room", "和一起学语言的人\n开口聊天", "说话实时字幕，点一下翻成中文", ["选词提问", "💡 提示", "缩小"], ["🌐 自由聊天", "申请上麦", "以聊天为主"]],
    people: ["人 · 对话", "找到学习伙伴\n一直聊下去", "关注后，在群聊和私聊里继续交流", ["人", "群聊里选词提问", "邀请朋友"], ["论坛·回复", "私信·通话", "一对一视频通话"]],
  },
  es: {
    map: ["MI ESPACIO · EMPIEZA CON UNA CONVERSACIÓN", "Empieza por lo que\nya sabes decir", "Elige las conversaciones que puedes tener; tu mapa empieza ahí", ["¿Podrías tener esta conversación?", "Mapa", "Misiones"], ["Gramática de esta parte", "Primero letras y sonidos", "Tres pistas"]],
    chat: ["CHAT", "¿Te atascas? En español.\nEl inglés, debajo.", "Charla como con amigos; solo corrige lo que falla", ["Tarjeta de expresión", "Hay algo que corregir", "Visto en un vídeo"], ["Traducción", "El tutor empieza", "Chats anteriores"]],
    ask: ["ANÁLISIS DE FRASE", "Elige una parte.\nPregunta al momento.", "Qué significa aquí, en español", ["Pregunta rápida", "Tarjeta de palabra", "Al mapa"], ["¿Por qué esta forma?", "Otras formas", "Lo sé / No lo sé"]],
    my: ["MI PROGRESO", "Cuanto más hablas,\nmás creces", "Seis ramas que solo crecen, y respuestas con tu historial", ["Creciendo", "Pregunta", "Mis expresiones"], ["Red, gráfica o mapa", "Qué trabajar", "Prueba hoy"]],
    call: ["LLAMADAS", "Habla en voz alta\ncon un amigo IA", "¿Lo dijiste mal? Encuentra lo que querías decir", ["Lo que querías decir", "Llamada del día", "Dilo otra vez"], ["Ayuda si te atascas", "Mostrar traducciones", "Practica tu frase"]],
    video: ["VÍDEOS", "Vídeos reales,\nfrase a frase", "Toca una línea para repetirla y pregunta por el subtítulo", ["Dividir en frases", "Preguntar", "Vocabulario"], ["Unir o dividir", "Guardar", "Buscar escenas"]],
    room: ["ROOM", "Habla en voz alta\ncon otros estudiantes", "Subtítulos al hablar, toca para traducir", ["Elige palabras y pregunta", "💡 Pistas", "Minimizar"], ["🌐 Charla libre", "Pedir unirse", "Vista de chat"]],
    people: ["PERSONAS · CHATS", "Encuentra compañeros\ny sigue hablando", "Sigue a gente y habla en grupos y en privado", ["Personas", "Pregunta en el grupo", "Invitar"], ["Tablón y respuestas", "Mensajes y llamadas", "Videollamadas 1:1"]],
  },
  hi: {
    map: ["मेरा · बातचीत से शुरू", "जो बातचीत कर सकते हैं\nवहीं से शुरू करें", "उदाहरण बातचीत चुनें, नक्शा वहीं से शुरू होगा", ["क्या आप ऐसी बातचीत कर सकते हैं?", "नक्शा", "मिशन"], ["इस हिस्से का व्याकरण", "पहले अक्षर और ध्वनियाँ", "तीन संकेत"]],
    chat: ["चैट", "अटक गए? हिंदी में लिखिए।\nअंग्रेज़ी ठीक नीचे", "दोस्त की तरह बात करें, सिर्फ़ गलती सुधरेगी", ["वाक्यांश कार्ड", "कुछ सुधारना है", "वीडियो में मिला"], ["अनुवाद", "ट्यूटर पहले बोले", "पिछली चैट"]],
    ask: ["वाक्य विश्लेषण", "कोई भी हिस्सा चुनें,\nतुरंत पूछें", "यहाँ इसका मतलब, हिंदी में", ["तुरंत सवाल", "शब्द कार्ड", "नक्शे में डालें"], ["यह रूप क्यों?", "दूसरे तरीके", "आता है·नहीं आता"]],
    my: ["My · प्रगति", "जितनी बात करें,\nउतना आगे बढ़ें", "छह शाखाएँ जो बढ़ती ही हैं, और आपके रिकॉर्ड से जवाब", ["बढ़ रहा है", "सीधे पूछें", "मेरे वाक्यांश"], ["जाल·ग्राफ़·नक्शा", "आगे क्या बढ़ाएँ", "आज आज़माएँ"]],
    call: ["कॉल", "AI दोस्त से\nबोलकर बात करें", "गलत बोला? जो कहना था, वो मिल जाएगा", ["असली मतलब", "आज का पैक कॉल", "फिर से बोलें"], ["अटकने पर मदद", "अनुवाद दिखाएँ·छिपाएँ", "अपना वाक्य बोलें"]],
    video: ["वीडियो से सीखें", "असली वीडियो,\nवाक्य-दर-वाक्य", "लाइन टैप करें तो दोबारा चले, सबटाइटल पर सवाल भी", ["वाक्यों में बाँटें", "लाइन पर सवाल", "शब्दकोश"], ["जोड़ें·बाँटें", "सेव", "दृश्य खोजें"]],
    room: ["Room", "साथ सीखने वालों से\nबोलकर बात करें", "बोलते ही सबटाइटल, टैप करें तो हिंदी में", ["शब्द चुनकर पूछें", "💡 संकेत", "छोटा करें"], ["🌐 खुली बातचीत", "जुड़ने का अनुरोध", "चैट वाला दृश्य"]],
    people: ["लोग · बातचीत", "साथ सीखने वाले दोस्त\nढूँढें और जुड़े रहें", "फ़ॉलो करें, फिर ग्रुप और निजी बातचीत", ["लोग", "ग्रुप में शब्द पूछें", "दोस्त को बुलाएँ"], ["बोर्ड और जवाब", "संदेश·कॉल", "1:1 वीडियो कॉल"]],
  },
  pt: {
    map: ["MEU ESPAÇO · COMECE POR UMA CONVERSA", "Comece pelo que\nvocê já consegue dizer", "Escolha as conversas que você consegue ter; seu mapa começa daí", ["Você conseguiria ter esta conversa?", "Mapa de estudo", "Missões"], ["Gramática desta parte", "Primeiro letras e sons", "Três dicas"]],
    chat: ["CHAT", "Travou? Escreva em português.\nO inglês vem logo abaixo", "Converse como amigos; só os erros são corrigidos", ["Cartão de expressão", "Algo para corrigir", "Visto em um vídeo"], ["Tradução", "O tutor começa", "Conversas anteriores"]],
    ask: ["ANÁLISE DE FRASE", "Escolha qualquer parte.\nPergunte na hora.", "O que significa aqui, em português", ["Pergunta rápida", "Cartão de palavra", "Pôr no mapa"], ["Por que essa forma?", "Outras formas de dizer", "Sei / Não sei"]],
    my: ["MEU PROGRESSO", "Quanto mais você fala,\nmais você cresce", "Seis ramos que só crescem, e respostas com base no seu histórico", ["Crescendo", "Pergunte sobre mim", "Minhas expressões"], ["Rede, gráfico ou mapa", "O que melhorar", "Tente hoje"]],
    call: ["CHAMADAS", "Fale em voz alta\ncom um amigo de IA", "Falou errado? Ele encontra o que você quis dizer", ["O que você quis dizer", "Chamada do dia", "Diga de novo"], ["Ajuda quando travar", "Mostrar ou ocultar traduções", "Pratique sua frase"]],
    video: ["VÍDEOS", "Vídeos reais,\nfrase por frase", "Toque numa linha para repetir e pergunte sobre qualquer legenda", ["Dividir em frases", "Perguntar sobre a linha", "Vocabulário"], ["Juntar ou dividir", "Salvar", "Encontrar cenas"]],
    room: ["ROOM", "Fale em voz alta com\noutros estudantes", "Legendas ao vivo enquanto você fala, toque para traduzir", ["Escolha palavras e pergunte", "💡 Dicas", "Minimizar"], ["🌐 Conversa livre", "Pedir para entrar", "Visão de chat"]],
    people: ["PESSOAS · CONVERSAS", "Encontre parceiros de estudo\ne continue", "Siga pessoas e converse em grupos e no privado", ["Pessoas", "Pergunte no grupo", "Convidar um amigo"], ["Mural e respostas", "Mensagens e chamadas", "Videochamada 1:1"]],
  },
  fr: {
    map: ["MON ESPACE · PARTEZ D'UNE CONVERSATION", "Commencez par ce que\nvous savez déjà dire", "Choisissez les conversations que vous pouvez tenir ; votre carte part de là", ["Pourriez-vous tenir cette conversation ?", "Carte d'apprentissage", "Missions"], ["La grammaire de cette partie", "D'abord les lettres et les sons", "Trois indices"]],
    chat: ["CHAT", "Bloqué ? Écrivez en français.\nL'anglais juste en dessous", "Discutez comme entre amis ; seules les erreurs sont corrigées", ["Carte d'expression", "Quelque chose à corriger", "Vu dans une vidéo"], ["Traduction", "Le tuteur commence", "Anciennes discussions"]],
    ask: ["ANALYSE DE PHRASE", "Choisissez un passage.\nPosez votre question.", "Ce que ça veut dire ici, en français", ["Question rapide", "Carte de mot", "Ajouter à ma carte"], ["Pourquoi cette forme ?", "Autres façons de dire", "Je sais / Je ne sais pas"]],
    my: ["MES PROGRÈS", "Plus vous parlez,\nplus vous progressez", "Six branches qui ne font que grandir, et des réponses tirées de votre parcours", ["En progression", "Me poser une question", "Mes expressions"], ["Réseau, graphique ou carte", "Quoi travailler ensuite", "À essayer aujourd'hui"]],
    call: ["APPELS", "Parlez à voix haute\navec un ami IA", "Mal dit ? Il retrouve ce que vous vouliez dire", ["Ce que vous vouliez dire", "Appel du jour", "Redites-le"], ["De l'aide si vous bloquez", "Afficher ou masquer la traduction", "Dites votre propre phrase"]],
    video: ["VIDÉOS", "De vraies vidéos,\nphrase par phrase", "Touchez une ligne pour la réécouter, et questionnez un sous-titre", ["Découper en phrases", "Question sur une ligne", "Vocabulaire"], ["Fusionner ou couper", "Enregistrer", "Trouver des scènes"]],
    room: ["ROOM", "Parlez à voix haute avec\nd'autres apprenants", "Sous-titres en direct, touchez pour traduire", ["Choisir des mots et demander", "💡 Indices", "Réduire"], ["🌐 Discussion libre", "Demander à rejoindre", "Vue chat"]],
    people: ["PERSONNES · DISCUSSIONS", "Trouvez des partenaires\net continuez", "Suivez, puis discutez en groupe et en privé", ["Personnes", "Demander dans le groupe", "Inviter un ami"], ["Forum et réponses", "Messages et appels", "Appels vidéo 1:1"]],
  },
  vi: {
    map: ["CỦA TÔI · BẮT ĐẦU TỪ HỘI THOẠI", "Bắt đầu từ những gì\nbạn đã nói được", "Chọn các đoạn hội thoại bạn làm được, bản đồ học bắt đầu từ đó", ["Bạn có nói được đoạn này không?", "Bản đồ học", "Nhiệm vụ"], ["Ngữ pháp phần này", "Chữ cái và âm trước", "Ba gợi ý"]],
    chat: ["TRÒ CHUYỆN", "Bí từ? Viết bằng tiếng Việt.\nTiếng Anh ngay bên dưới", "Trò chuyện như bạn bè, chỉ sửa chỗ sai", ["Thẻ diễn đạt", "Có chỗ cần sửa", "Gặp trong video"], ["Bản dịch", "Gia sư mở lời", "Cuộc trò chuyện cũ"]],
    ask: ["PHÂN TÍCH CÂU", "Chọn chỗ muốn hỏi,\nhỏi ngay", "Nghĩa ở đây là gì, giải thích bằng tiếng Việt", ["Hỏi nhanh", "Thẻ từ", "Thêm vào bản đồ"], ["Sao lại dùng thế này?", "Cách nói khác", "Biết / Chưa biết"]],
    my: ["CỦA TÔI · TIẾN BỘ", "Nói càng nhiều,\ntiến bộ càng rõ", "Sáu nhánh chỉ có lớn lên, hỏi là trả lời dựa trên dữ liệu của bạn", ["Đang lớn", "Hỏi trực tiếp", "Cụm từ của tôi"], ["Mạng, biểu đồ, bản đồ", "Cần luyện gì tiếp", "Thử hôm nay"]],
    call: ["GỌI ĐIỆN", "Nói thành tiếng\nvới bạn AI", "Nói sai cũng không sao, AI tìm ra ý bạn muốn nói", ["Ý bạn muốn nói", "Cuộc gọi hôm nay", "Nói lại"], ["Trợ giúp khi bí", "Hiện/ẩn bản dịch", "Luyện câu của bạn"]],
    video: ["HỌC QUA VIDEO", "Video thật,\nchia theo từng câu", "Chạm vào câu để nghe lại, hỏi ngay về phụ đề", ["Chia câu", "Hỏi về phụ đề", "Sổ từ vựng"], ["Gộp hoặc tách câu", "Lưu", "Tìm cảnh"]],
    room: ["ROOM", "Nói chuyện bằng giọng nói\nvới người cùng học", "Phụ đề hiện khi bạn nói, chạm để dịch", ["Chọn từ để hỏi", "💡 Gợi ý", "Thu nhỏ"], ["🌐 Phòng nói tự do", "Xin lên nói", "Xem dạng chat"]],
    people: ["MỌI NGƯỜI · TRÒ CHUYỆN", "Tìm bạn cùng học\nvà trò chuyện tiếp", "Theo dõi, rồi nói chuyện trong nhóm và nhắn riêng", ["Mọi người", "Hỏi trong nhóm", "Mời bạn bè"], ["Bảng tin và trả lời", "Tin nhắn và cuộc gọi", "Gọi video 1:1"]],
  },
  id: {
    map: ["SAYA · MULAI DARI PERCAKAPAN", "Mulai dari yang\nsudah bisa kamu ucapkan", "Pilih percakapan yang bisa kamu lakukan, peta belajarmu mulai dari situ", ["Bisakah kamu melakukan percakapan ini?", "Peta belajar", "Misi"], ["Tata bahasa bagian ini", "Huruf dan bunyi dulu", "Tiga petunjuk"]],
    chat: ["CHAT", "Buntu? Tulis pakai bahasa Indonesia.\nBahasa Inggrisnya di bawah", "Ngobrol seperti teman, hanya yang salah yang dibetulkan", ["Kartu ungkapan", "Ada yang perlu diperbaiki", "Ditemui di video"], ["Terjemahan", "Tutor menyapa duluan", "Obrolan lama"]],
    ask: ["ANALISIS KALIMAT", "Pilih bagian mana saja,\nlangsung tanya", "Artinya di sini, dijelaskan dalam bahasa Indonesia", ["Pertanyaan cepat", "Kartu kata", "Masukkan ke peta"], ["Kenapa bentuknya begini?", "Cara lain mengatakannya", "Tahu / Belum tahu"]],
    my: ["PROGRES SAYA", "Makin sering ngobrol,\nmakin berkembang", "Enam cabang yang terus tumbuh, dan jawaban berdasarkan catatanmu", ["Sedang tumbuh", "Tanya langsung", "Ungkapanku"], ["Jaring, grafik, peta", "Yang perlu dilatih", "Coba hari ini"]],
    call: ["PANGGILAN", "Bicara langsung\ndengan teman AI", "Salah ucap? Dia menemukan maksudmu", ["Maksud sebenarnya", "Panggilan hari ini", "Ucapkan lagi"], ["Bantuan saat buntu", "Tampilkan/sembunyikan terjemahan", "Latih kalimatmu"]],
    video: ["BELAJAR DARI VIDEO", "Video asli,\ndipotong per kalimat", "Ketuk kalimat untuk memutar ulang, tanya soal subtitle kapan saja", ["Bagi per kalimat", "Tanya soal kalimat", "Bank kata"], ["Gabung atau pisah", "Simpan", "Cari adegan"]],
    room: ["ROOM", "Ngobrol pakai suara dengan\nsesama pelajar", "Subtitle langsung saat bicara, ketuk untuk menerjemahkan", ["Pilih kata untuk bertanya", "💡 Petunjuk", "Kecilkan"], ["🌐 Obrolan bebas", "Minta ikut bicara", "Tampilan chat"]],
    people: ["ORANG · OBROLAN", "Temukan teman belajar\ndan terus ngobrol", "Ikuti, lalu ngobrol di grup dan secara pribadi", ["Orang", "Tanya di grup", "Undang teman"], ["Papan dan balasan", "Pesan dan panggilan", "Video call 1:1"]],
  },
  th: {
    map: ["ของฉัน · เริ่มจากบทสนทนา", "เริ่มจากสิ่งที่\nคุณพูดได้แล้ว", "เลือกบทสนทนาที่คุณพูดได้ แผนที่การเรียนจะเริ่มจากตรงนั้น", ["คุณพูดบทสนทนานี้ได้ไหม?", "แผนที่การเรียน", "ภารกิจ"], ["ไวยากรณ์ของส่วนนี้", "เริ่มจากตัวอักษรและเสียง", "คำใบ้ 3 ขั้น"]],
    chat: ["แชท", "ติดอยู่? พิมพ์เป็นภาษาไทย\nภาษาอังกฤษอยู่ข้างล่าง", "คุยเหมือนเพื่อน แก้ให้เฉพาะจุดที่ผิด", ["การ์ดสำนวน", "มีจุดที่ควรแก้", "เจอในวิดีโอ"], ["คำแปล", "ให้ติวเตอร์เริ่มก่อน", "แชทก่อนหน้า"]],
    ask: ["วิเคราะห์ประโยค", "เลือกส่วนที่สงสัย\nถามได้ทันที", "บอกความหมายตรงนี้เป็นภาษาไทย", ["ถามด่วน", "การ์ดคำศัพท์", "ใส่ในแผนที่"], ["ทำไมใช้รูปนี้?", "สำนวนคล้ายกัน", "รู้แล้ว / ยังไม่รู้"]],
    my: ["ของฉัน · พัฒนาการ", "ยิ่งคุย\nยิ่งเก่งขึ้น", "หกสาขาที่มีแต่เติบโต ถามแล้วตอบจากบันทึกของคุณ", ["กำลังเติบโต", "ถามตรงๆ", "สำนวนของฉัน"], ["เครือข่าย กราฟ แผนที่", "ฝึกอะไรต่อ", "ลองวันนี้"]],
    call: ["โทร", "พูดออกเสียง\nกับเพื่อน AI", "พูดผิดไม่เป็นไร AI หาสิ่งที่คุณตั้งใจพูดให้", ["สิ่งที่ตั้งใจพูด", "คอลประจำวัน", "พูดอีกครั้ง"], ["ตัวช่วยเมื่อติด", "แสดง/ซ่อนคำแปล", "ฝึกประโยคของคุณ"]],
    video: ["เรียนจากวิดีโอ", "วิดีโอจริง\nแบ่งทีละประโยค", "แตะประโยคเพื่อฟังซ้ำ ถามเรื่องซับได้ทันที", ["แบ่งประโยค", "ถามเรื่องซับ", "คลังคำศัพท์"], ["รวมหรือแยกประโยค", "บันทึก", "หาฉาก"]],
    room: ["ROOM", "คุยด้วยเสียงกับ\nคนที่เรียนภาษาเดียวกัน", "พูดแล้วขึ้นซับทันที แตะเพื่อแปล", ["เลือกคำเพื่อถาม", "💡 คำใบ้", "ย่อหน้าต่าง"], ["🌐 ห้องคุยอิสระ", "ขอขึ้นพูด", "ดูแบบแชท"]],
    people: ["ผู้คน · แชท", "หาเพื่อนเรียน\nแล้วคุยกันต่อ", "ติดตาม แล้วคุยต่อในกลุ่มและแชทส่วนตัว", ["ผู้คน", "ถามในกลุ่ม", "ชวนเพื่อน"], ["บอร์ดและคำตอบ", "ข้อความและโทร", "วิดีโอคอล 1:1"]],
  },
  ar: {
    map: ["مساحتي · ابدأ من محادثة", "ابدأ بما\nتستطيع قوله الآن", "اختر المحادثات التي تستطيع إجراءها، ومن هناك تبدأ خريطتك", ["هل تستطيع إجراء هذه المحادثة؟", "خريطة التعلّم", "مهام"], ["قواعد هذا الجزء", "الحروف والأصوات أولًا", "ثلاثة تلميحات"]],
    chat: ["الدردشة", "تعثّرت؟ اكتب بالعربية.\nوالإنجليزية تحتها مباشرة", "دردش كما مع صديق، ويُصحَّح الخطأ فقط", ["بطاقة التعبير", "هناك ما يُصحَّح", "صادفته في فيديو"], ["الترجمة", "المعلّم يبدأ", "محادثات سابقة"]],
    ask: ["تحليل الجملة", "اختر أي جزء\nواسأل فورًا", "معناه هنا، بالعربية", ["سؤال سريع", "بطاقة الكلمة", "أضِف إلى الخريطة"], ["لماذا هذه الصيغة؟", "تعابير مشابهة", "أعرفها / لا أعرفها"]],
    my: ["تقدّمي", "كلما تحدّثت أكثر\nتقدّمت أكثر", "ستة فروع لا تتوقف عن النمو، وإجابات من سجلّك", ["في نموّ", "اسأل مباشرة", "تعابيري"], ["شبكة أو رسم أو خريطة", "ما الذي تطوّره بعدها", "جرّب اليوم"]],
    call: ["المكالمات", "تحدّث بصوتك\nمع صديق ذكي", "أخطأت في الكلام؟ يجد ما كنت تقصده", ["ما قصدته", "مكالمة اليوم", "قلها مرة أخرى"], ["مساعدة عند التعثّر", "إظهار الترجمة أو إخفاؤها", "تدرّب على جملتك"]],
    video: ["التعلّم بالفيديو", "فيديوهات حقيقية\nجملةً جملة", "المس السطر لإعادته، واسأل عن أي ترجمة", ["تقسيم إلى جمل", "اسأل عن السطر", "بنك الكلمات"], ["دمج أو تقسيم", "حفظ", "ابحث عن مشاهد"]],
    room: ["Room", "تحدّث بصوتك مع\nمتعلّمين آخرين", "ترجمة نصية مباشرة أثناء الكلام، المس للترجمة", ["اختر كلمات واسأل", "💡 تلميحات", "تصغير"], ["🌐 دردشة حرّة", "طلب الانضمام", "عرض الدردشة"]],
    people: ["الأشخاص · المحادثات", "اعثر على رفاق تعلّم\nوواصل الحديث", "تابِع، ثم تحدّث في المجموعات وعلى انفراد", ["الأشخاص", "اسأل في المجموعة", "ادعُ صديقًا"], ["لوحة النقاش والردود", "الرسائل والمكالمات", "مكالمة فيديو 1:1"]],
  },
};

// 배우는 언어별 검색어 등록정보(2026-10-23): 앱 언어의 문구를 그대로 쓰고, 배우는 언어가 드러나는 곳만 바꾼다.
// 화면은 tmp/store-raw/<앱 언어>-<배우는 언어>/ (capture-whats-new.mjs CAPTURE_TARGET).
const withChanges = (base, changes) => Object.fromEntries(Object.entries(base).map(([k, v]) => [k, changes[k] ? changes[k](structuredClone(v)) : v]));
const ownLineKo = (v) => { v[3] = ["되살리기", "내 문장 말해보기", "다시 말해보기"]; v[4] = ["막힐 때 도움말", "해석 접기·펴기", "나중에 이어서"]; return v; };
COPY["ko-ja"] = withChanges(COPY.ko, {
  map: (v) => { v[0] = "일본어 · 대화로 시작"; return v; },
  chat: (v) => { v[1] = "막히면 한국어로.\n일본어는 바로 아래"; return v; },
  room: (v) => { v[1] = "일본어 배우는 사람들과\n목소리로 대화해요"; return v; },
});
COPY["ko-zh"] = withChanges(COPY.ko, {
  map: (v) => { v[0] = "중국어 · 대화로 시작"; return v; },
  chat: (v) => { v[1] = "막히면 한국어로.\n중국어는 바로 아래"; return v; },
  call: ownLineKo,
  room: (v) => { v[1] = "중국어 배우는 사람들과\n목소리로 대화해요"; return v; },
});
COPY["ko-es"] = withChanges(COPY.ko, {
  map: (v) => { v[0] = "스페인어 · 대화로 시작"; return v; },
  chat: (v) => { v[1] = "막히면 한국어로.\n스페인어는 바로 아래"; return v; },
  call: ownLineKo,
  room: (v) => { v[1] = "스페인어 배우는 사람들과\n목소리로 대화해요"; return v; },
});
COPY["en-ko"] = withChanges(COPY.en, {
  map: (v) => { v[0] = "KOREAN · START FROM A CONVERSATION"; return v; },
  chat: (v) => { v[1] = "Stuck? Write in English.\nSee it in Korean."; return v; },
  room: (v) => { v[1] = "Talk out loud with\nKorean learners"; return v; },
});
COPY["ja-ko"] = withChanges(COPY.ja, {
  map: (v) => { v[0] = "韓国語 · 会話から始める"; return v; },
  chat: (v) => { v[1] = "詰まったら日本語で。\n韓国語はすぐ下に"; return v; },
  call: (v) => { v[3] = ["言いたかったこと", "自分の文を言ってみる", "もう一度言う"]; v[4] = ["詰まった時のヒント", "翻訳の表示切替", "あとで続きから"]; return v; },
  room: (v) => { v[1] = "韓国語を学ぶ人と\n声で話そう"; return v; },
});

// 2.72에서 Room 💡 힌트가 빠짐(2026-10-23, 사용자) — 세부 카드는 🌐 자유 대화방, 칩 자리에는 단체방으로 이어가기.
const ROOM_GROUP_CHIP = {
  ko: "이 방 사람들과 단체방", en: "Group chat with the room", ja: "この部屋の人とグループ", zh: "和房间里的人建群", es: "Grupo con la sala", hi: "कमरे वालों का ग्रुप",
  pt: "Grupo com a sala", fr: "Groupe avec la salle", vi: "Nhóm với người trong phòng", id: "Grup dengan orang di ruang", th: "ตั้งกลุ่มกับคนในห้อง", ar: "مجموعة مع أهل الغرفة",
};
for (const [key, copy] of Object.entries(COPY)) {
  const room = copy.room;
  const free = room[4][0];
  room[3] = [room[3][0], free, room[3][2]];
  room[4] = [ROOM_GROUP_CHIP[key.split("-")[0]], room[4][1], room[4][2]];
}

// 2.73(2026-10-24): My "단계" 보기·오늘의 학습·My에서 찾기, Room 게임, 사람 언어 칩·프로필·아이콘.
// 앱 문구(단계·오늘의 학습·My에서 찾기)는 앱의 실제 이름 그대로(copy.ts / overlays.json).
const NEW273 = {
  ko: { stage: "단계", today: "오늘의 학습", find: "My에서 찾기", view: "망·그래프·단계 보기", game: "🎭 라이어 게임·마피아", p40: "최대 40명", lang: "언어로 골라 보기", profile: "프로필·🙌 도움됐어요", icons: "아이콘 묶음" },
  en: { stage: "Stages", today: "Today's learning", find: "Find in My", view: "Net, graph or stages", game: "🎭 Liar & Mafia games", p40: "Up to 40 people", lang: "Filter by language", profile: "Profiles · 🙌 Helpful", icons: "Icon packs" },
  ja: { stage: "ステージ", today: "今日の学び", find: "マイで探す", view: "ネット・グラフ・ステージ", game: "🎭 ワードウルフ・マフィア", p40: "最大40人", lang: "言語で絞り込み", profile: "プロフィール・🙌 助かった", icons: "アイコンセット" },
  zh: { stage: "阶段", today: "今天的学习", find: "在“我的”里查找", view: "网·图表·阶段", game: "🎭 谁是卧底·狼人杀", p40: "最多 40 人", lang: "按语言筛选", profile: "个人资料·🙌 有帮助", icons: "图标包" },
  es: { stage: "Etapas", today: "Lo de hoy", find: "Buscar en Mi espacio", view: "Red, gráfica o etapas", game: "🎭 Mentiroso y Mafia", p40: "Hasta 40 personas", lang: "Filtrar por idioma", profile: "Perfil · 🙌 Me ayudó", icons: "Paquetes de iconos" },
  hi: { stage: "चरण", today: "आज की पढ़ाई", find: "मेरा में खोजें", view: "जाल·ग्राफ़·चरण", game: "🎭 झूठा और माफ़िया", p40: "40 लोगों तक", lang: "भाषा से चुनें", profile: "प्रोफ़ाइल·🙌 मदद मिली", icons: "आइकन पैक" },
  pt: { stage: "Etapas", today: "Aprendizado de hoje", find: "Encontrar em Meu espaço", view: "Rede, gráfico ou etapas", game: "🎭 Mentiroso e Máfia", p40: "Até 40 pessoas", lang: "Filtrar por idioma", profile: "Perfil · 🙌 Ajudou", icons: "Pacotes de ícones" },
  fr: { stage: "Étapes", today: "Appris aujourd'hui", find: "Trouver dans Moi", view: "Réseau, graphique ou étapes", game: "🎭 Menteur et Mafia", p40: "Jusqu'à 40 personnes", lang: "Filtrer par langue", profile: "Profil · 🙌 Utile", icons: "Packs d'icônes" },
  vi: { stage: "Giai đoạn", today: "Học hôm nay", find: "Tìm trong Của tôi", view: "Mạng, biểu đồ, giai đoạn", game: "🎭 Kẻ nói dối · Ma sói", p40: "Tối đa 40 người", lang: "Lọc theo ngôn ngữ", profile: "Hồ sơ · 🙌 Hữu ích", icons: "Bộ biểu tượng" },
  id: { stage: "Tahap", today: "Belajar hari ini", find: "Cari di Saya", view: "Jaring, grafik, tahap", game: "🎭 Pembohong & Mafia", p40: "Sampai 40 orang", lang: "Saring per bahasa", profile: "Profil · 🙌 Membantu", icons: "Paket ikon" },
  th: { stage: "ขั้น", today: "เรียนวันนี้", find: "หาในของฉัน", view: "เครือข่าย กราฟ ขั้น", game: "🎭 คนโกหก·มาเฟีย", p40: "สูงสุด 40 คน", lang: "เลือกตามภาษา", profile: "โปรไฟล์·🙌 ช่วยได้", icons: "ชุดไอคอน" },
  ar: { stage: "المراحل", today: "تعلّم اليوم", find: "ابحث في «أنا»", view: "شبكة أو رسم أو مراحل", game: "🎭 الكاذب والمافيا", p40: "حتى 40 شخصًا", lang: "تصفية حسب اللغة", profile: "الملف · 🙌 مفيد", icons: "حزم الأيقونات" },
};
const CHAT_VIEW = {
  ko: "방에서 채팅으로 보기", en: "Rooms in chat view", ja: "ルームをチャット表示で", zh: "语音房聊天视图", es: "Salas en vista de chat",
  hi: "कमरे चैट व्यू में", pt: "Salas em modo chat", fr: "Salons en vue chat", vi: "Phòng ở chế độ chat", id: "Ruang dalam tampilan chat",
  th: "ห้องแบบแชต", ar: "الغرف بعرض الدردشة",
};
const PARTS275 = {
"ko": [
"어휘·문법·표현·발음 네 갈래, 가장 모자란 곳부터 바로 연습",
"어휘·문법·표현·발음이 쌓이는 게 보이고, 물어보면 기록으로 답해요",
"이 단계의 표현",
"최근 2주"
],
"en": [
"Vocabulary, grammar, expressions, pronunciation — practise the weakest first",
"Watch vocabulary, grammar, expressions and pronunciation fill up",
"Expressions for this stage",
"Last two weeks"
],
"ja": [
"語彙・文法・表現・発音の4つ、いちばん足りない所からすぐ練習",
"語彙・文法・表現・発音がたまるのが見え、聞けば記録で答える",
"このステージの表現",
"最近2週間"
],
"zh": [
"词汇·语法·表达·发音四个方面，从最弱的开始马上练",
"看着词汇、语法、表达、发音一点点积累，问了就按记录回答",
"本阶段的表达",
"最近两周"
],
"es": [
"Vocabulario, gramática, expresiones y pronunciación: practica primero lo más flojo",
"Mira cómo crecen vocabulario, gramática, expresiones y pronunciación",
"Expresiones de esta etapa",
"Últimas dos semanas"
],
"hi": [
"शब्द, व्याकरण, अभिव्यक्ति, उच्चारण — सबसे कमज़ोर हिस्से से अभ्यास",
"शब्द, व्याकरण, अभिव्यक्ति और उच्चारण बढ़ते हुए देखें",
"इस चरण की अभिव्यक्तियाँ",
"पिछले दो हफ़्ते"
],
"pt": [
"Vocabulário, gramática, expressões e pronúncia: pratique primeiro o mais fraco",
"Veja vocabulário, gramática, expressões e pronúncia crescerem",
"Expressões desta etapa",
"Últimas duas semanas"
],
"fr": [
"Vocabulaire, grammaire, expressions, prononciation : travaillez d'abord le point faible",
"Voyez progresser vocabulaire, grammaire, expressions et prononciation",
"Expressions de l'étape",
"Deux dernières semaines"
],
"vi": [
"Từ vựng, ngữ pháp, cách diễn đạt, phát âm — luyện chỗ yếu nhất trước",
"Thấy từ vựng, ngữ pháp, diễn đạt, phát âm lớn dần",
"Cách diễn đạt của giai đoạn",
"Hai tuần qua"
],
"id": [
"Kosakata, tata bahasa, ungkapan, pelafalan — latih yang paling lemah dulu",
"Lihat kosakata, tata bahasa, ungkapan, dan pelafalan bertambah",
"Ungkapan tahap ini",
"Dua minggu terakhir"
],
"th": [
"คำศัพท์ ไวยากรณ์ สำนวน การออกเสียง — ฝึกส่วนที่อ่อนที่สุดก่อน",
"เห็นคำศัพท์ ไวยากรณ์ สำนวน การออกเสียงเพิ่มขึ้น",
"สำนวนของขั้นนี้",
"สองสัปดาห์ล่าสุด"
],
"ar": [
"المفردات والقواعد والتعابير والنطق — تدرّب على الأضعف أولًا",
"شاهد المفردات والقواعد والتعابير والنطق تنمو",
"تعابير هذه المرحلة",
"آخر أسبوعين"
]
};
const MAP_CORE = {
  ko: ["My · 단계", "1단계부터 5단계까지\n내 길이 보여요", "단계마다 문법·목표 대화·할 수 있는 것, 시작은 대화 예시로"],
  en: ["MY · STAGES", "See your path\nfrom stage 1 to 5", "Grammar, target conversations and goals for each stage"],
  ja: ["マイ · ステージ", "1から5まで\n自分の道が見える", "ステージごとに文法・目標の会話・できること"],
  zh: ["我的 · 阶段", "从第 1 到第 5 阶段\n路线一目了然", "每个阶段的语法、目标对话和能做到的事"],
  es: ["MI ESPACIO · ETAPAS", "Tu camino,\nde la etapa 1 a la 5", "Gramática, conversaciones meta y objetivos en cada etapa"],
  hi: ["मेरा · चरण", "चरण 1 से 5 तक\nअपना रास्ता देखें", "हर चरण का व्याकरण, लक्ष्य बातचीत और आप क्या कर पाएँगे"],
  pt: ["MEU ESPAÇO · ETAPAS", "Seu caminho,\nda etapa 1 à 5", "Gramática, conversas-alvo e metas em cada etapa"],
  fr: ["MOI · ÉTAPES", "Votre parcours,\nde l'étape 1 à 5", "Grammaire, conversations visées et objectifs à chaque étape"],
  vi: ["CỦA TÔI · GIAI ĐOẠN", "Lộ trình của bạn\ntừ giai đoạn 1 đến 5", "Ngữ pháp, hội thoại mục tiêu và việc làm được ở mỗi giai đoạn"],
  id: ["SAYA · TAHAP", "Jalurmu jelas,\ndari tahap 1 sampai 5", "Tata bahasa, percakapan target, dan tujuan di tiap tahap"],
  th: ["ของฉัน · ขั้น", "เห็นเส้นทางของคุณ\nตั้งแต่ขั้น 1 ถึง 5", "ไวยากรณ์ บทสนทนาเป้าหมาย และสิ่งที่ทำได้ในแต่ละขั้น"],
  ar: ["أنا · المراحل", "طريقك واضح\nمن المرحلة 1 إلى 5", "القواعد والمحادثات المستهدفة وما ستقدر عليه في كل مرحلة"],
};
const done273 = new WeakSet(); // 검색어 세트는 앱 언어 문구 배열을 같이 쓴다 — 한 번만 바꾼다.
for (const [key, copy] of Object.entries(COPY)) {
  const n = NEW273[key.split("-")[0]];
  copy.map[3] = [n.stage, copy.map[3][0], copy.map[3][2]];
  const m = MAP_CORE[key.split("-")[0]];
  const q = PARTS275[key.split("-")[0]];
  copy.map[0] = m[0]; copy.map[1] = m[1]; copy.map[2] = q[0];
  copy.map[3] = [n.stage, q[2], copy.map[3][1]];
  copy.my[2] = q[1];
  copy.my[3] = [copy.my[3][0], q[3], n.today];
  copy.my[3] = [copy.my[3][0], copy.my[3][1], n.today];
  copy.my[4] = [n.view, n.find, copy.my[4][2]];
  const room = copy.room;
  if (!done273.has(room)) {
    room.mini = room[3][2];
    const free = room[3][1];
    room[4] = [room[4][0], n.p40];
    room[3] = [room[3][0], n.game, free];
  }
  const people = copy.people;
  if (!done273.has(people)) {
    // 단체방에서 골라 묻기 · 방을 접고 대화 · 언어로 골라 보기. 칩은 게시판·메시지·1:1 영상통화 그대로.
    people[3] = [people[3][1], n.lang, CHAT_VIEW[key.split("-")[0]]];
  }
  done273.add(people);
  done273.add(room);
}
