/**
 * The construction names (constructions.ts) in the interface languages other
 * than Korean and English, which are written beside each construction there.
 *
 * Column order: es, ja, zh, vi, fr, it, pt, ru, id, ar, th, hi. A missing
 * language reads the English name.
 */

export const LABEL_LANGUAGES = ["es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"] as const;

type Row = readonly [string, string, string, string, string, string, string, string, string, string, string, string];

export const CONSTRUCTION_LABELS: Record<string, Row> = {
  "be-verb": ["Verbo be", "be動詞", "be动词", "Động từ be", "Le verbe be", "Il verbo be", "Verbo be", "Глагол be", "Kata kerja be", "فعل be", "กริยา be", "be क्रिया"],
  "present-simple": ["Presente simple", "現在形・三単現のs", "一般现在时·第三人称单数", "Hiện tại đơn", "Présent simple", "Presente semplice", "Presente simples", "Present Simple", "Present simple", "المضارع البسيط", "Present simple", "सामान्य वर्तमान"],
  "articles": ["Artículos a/the", "冠詞 a/the", "冠词 a/the", "Mạo từ a/the", "Articles a/the", "Articoli a/the", "Artigos a/the", "Артикли a/the", "Artikel a/the", "أدوات التعريف والتنكير", "คำนำหน้านาม a/the", "आर्टिकल a/the"],
  "plurals": ["Plurales", "複数形", "复数", "Số nhiều", "Pluriels", "Plurali", "Plurais", "Множественное число", "Bentuk jamak", "الجمع", "พหูพจน์", "बहुवचन"],
  "do-questions": ["Preguntas y negaciones con do", "doの疑問文・否定文", "do 疑问句和否定句", "Câu hỏi và phủ định với do", "Questions et négations avec do", "Domande e negazioni con do", "Perguntas e negativas com do", "Вопросы и отрицания с do", "Kalimat tanya dan negatif dengan do", "الأسئلة والنفي باستخدام do", "คำถามและปฏิเสธด้วย do", "do वाले प्रश्न और नकार"],
  "prepositions-basic": ["Preposiciones básicas", "基本の前置詞", "基础介词", "Giới từ cơ bản", "Prépositions de base", "Preposizioni di base", "Preposições básicas", "Базовые предлоги", "Preposisi dasar", "حروف الجر الأساسية", "บุพบทพื้นฐาน", "मूल पूर्वसर्ग"],
  "can-ability": ["can (capacidad, peticiones)", "can（能力・依頼）", "can（能力·请求）", "can (khả năng, đề nghị)", "can (capacité, demande)", "can (capacità, richiesta)", "can (capacidade, pedido)", "can (умение, просьба)", "can (kemampuan, permintaan)", "can (القدرة والطلب)", "can (ความสามารถ, ขอร้อง)", "can (क्षमता, अनुरोध)"],
  "past-simple": ["Pasado simple", "過去形", "一般过去时", "Quá khứ đơn", "Prétérit", "Passato semplice", "Passado simples", "Past Simple", "Past simple", "الماضي البسيط", "อดีตกาลธรรมดา", "सामान्य भूत"],
  "present-continuous": ["Presente continuo", "現在進行形", "现在进行时", "Hiện tại tiếp diễn", "Présent continu", "Presente progressivo", "Presente contínuo", "Present Continuous", "Present continuous", "المضارع المستمر", "ปัจจุบันกาลต่อเนื่อง", "अपूर्ण वर्तमान"],
  "future-forms": ["Formas de futuro", "未来の表現", "将来时表达", "Cách nói tương lai", "Formes du futur", "Forme del futuro", "Formas de futuro", "Формы будущего", "Bentuk masa depan", "صيغ المستقبل", "รูปอนาคต", "भविष्य के रूप"],
  "comparatives": ["Comparativos y superlativos", "比較級・最上級", "比较级和最高级", "So sánh hơn và nhất", "Comparatifs et superlatifs", "Comparativi e superlativi", "Comparativos e superlativos", "Сравнительная и превосходная степени", "Perbandingan dan superlatif", "التفضيل والمقارنة", "ขั้นกว่าและขั้นสุด", "तुलनात्मक और उत्तमावस्था"],
  "countable-uncountable": ["Contables e incontables", "可算・不可算名詞", "可数与不可数名词", "Danh từ đếm được/không đếm được", "Dénombrables et indénombrables", "Numerabili e non numerabili", "Contáveis e incontáveis", "Исчисляемые и неисчисляемые", "Dapat dan tak dapat dihitung", "المعدود وغير المعدود", "นามนับได้/นับไม่ได้", "गणनीय और अगणनीय"],
  "pronouns": ["Pronombres y posesivos", "代名詞・所有格", "代词和所有格", "Đại từ và sở hữu", "Pronoms et possessifs", "Pronomi e possessivi", "Pronomes e possessivos", "Местоимения и притяжательные", "Kata ganti dan kepemilikan", "الضمائر والملكية", "สรรพนามและความเป็นเจ้าของ", "सर्वनाम और संबंधवाचक"],
  "conjunctions": ["Conectar con because, so, but", "接続詞 because/so/but", "连词 because/so/but", "Liên từ because/so/but", "Relier avec because, so, but", "Collegare con because, so, but", "Ligar com because, so, but", "Связки because, so, but", "Penghubung because, so, but", "الربط بـ because وso وbut", "คำเชื่อม because/so/but", "because, so, but से जोड़ना"],
  "adverbs-frequency": ["Adverbios de frecuencia y orden", "頻度の副詞・語順", "频率副词和语序", "Trạng từ tần suất và trật tự từ", "Adverbes de fréquence et ordre des mots", "Avverbi di frequenza e ordine", "Advérbios de frequência e ordem", "Наречия частоты и порядок слов", "Adverbia frekuensi dan urutan kata", "ظروف التكرار وترتيب الكلمات", "กริยาวิเศษณ์บอกความถี่และลำดับคำ", "आवृत्ति क्रियाविशेषण और शब्द क्रम"],
  "present-perfect": ["Presente perfecto", "現在完了", "现在完成时", "Hiện tại hoàn thành", "Present perfect", "Present perfect", "Present perfect", "Present Perfect", "Present perfect", "المضارع التام", "ปัจจุบันกาลสมบูรณ์", "पूर्ण वर्तमान"],
  "past-continuous": ["Pasado continuo", "過去進行形", "过去进行时", "Quá khứ tiếp diễn", "Passé continu", "Passato progressivo", "Passado contínuo", "Past Continuous", "Past continuous", "الماضي المستمر", "อดีตกาลต่อเนื่อง", "अपूर्ण भूत"],
  "first-conditional": ["Primer condicional", "条件文（if＋現在）", "第一条件句", "Câu điều kiện loại 1", "Conditionnel de type 1", "Periodo ipotetico di primo tipo", "Primeira condicional", "Условные предложения 1-го типа", "Kalimat pengandaian tipe 1", "الجملة الشرطية الأولى", "ประโยคเงื่อนไขแบบที่ 1", "पहला शर्तवाचक वाक्य"],
  "modals-advice": ["Modales should/have to/must", "助動詞 should/have to/must", "情态动词 should/have to/must", "Động từ khuyết thiếu should/have to/must", "Modaux should/have to/must", "Modali should/have to/must", "Modais should/have to/must", "Модальные should/have to/must", "Modal should/have to/must", "الأفعال الناقصة should/have to/must", "กริยาช่วย should/have to/must", "should/have to/must सहायक क्रियाएँ"],
  "gerund-infinitive": ["Gerundio e infinitivo", "動名詞・to不定詞", "动名词和不定式", "Danh động từ và động từ nguyên mẫu", "Gérondif et infinitif", "Gerundio e infinito", "Gerúndio e infinitivo", "Герундий и инфинитив", "Gerund dan infinitif", "المصدر بـ ing وto", "Gerund และ infinitive", "गेरुंड और इन्फ़िनिटिव"],
  "relative-clauses": ["Oraciones de relativo", "関係詞節", "关系从句", "Mệnh đề quan hệ", "Propositions relatives", "Frasi relative", "Orações relativas", "Придаточные определительные", "Klausa relatif", "جمل الصلة", "อนุประโยคขยายนาม", "संबंधवाचक उपवाक्य"],
  "passive-basic": ["Voz pasiva", "受動態", "被动语态", "Câu bị động", "Voix passive", "Forma passiva", "Voz passiva", "Страдательный залог", "Kalimat pasif", "المبني للمجهول", "กรรมวาจก", "कर्मवाच्य"],
  "so-such-that": ["so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that", "so/such … that"],
  "word-form": ["Forma de la palabra (sustantivo/adjetivo/adverbio)", "品詞の形（名詞・形容詞・副詞）", "词形（名词/形容词/副词）", "Dạng từ (danh/tính/trạng)", "Forme du mot (nom/adjectif/adverbe)", "Forma della parola (nome/aggettivo/avverbio)", "Forma da palavra (substantivo/adjetivo/advérbio)", "Форма слова (сущ./прил./нареч.)", "Bentuk kata (benda/sifat/keterangan)", "صيغة الكلمة (اسم/صفة/ظرف)", "รูปคำ (นาม/คุณศัพท์/กริยาวิเศษณ์)", "शब्द रूप (संज्ञा/विशेषण/क्रियाविशेषण)"],
  "phrasal-verbs": ["Verbos frasales", "句動詞", "短语动词", "Cụm động từ", "Verbes à particule", "Phrasal verb", "Phrasal verbs", "Фразовые глаголы", "Phrasal verb", "الأفعال المركبة", "Phrasal verb", "फ़्रेज़ल वर्ब"],
  "reported-speech": ["Estilo indirecto", "間接話法", "间接引语", "Câu tường thuật", "Discours indirect", "Discorso indiretto", "Discurso indireto", "Косвенная речь", "Kalimat tidak langsung", "الكلام المنقول", "คำพูดทางอ้อม", "अप्रत्यक्ष कथन"],
  "second-conditional": ["Segundo condicional", "仮定法過去", "第二条件句", "Câu điều kiện loại 2", "Conditionnel de type 2", "Periodo ipotetico di secondo tipo", "Segunda condicional", "Условные предложения 2-го типа", "Kalimat pengandaian tipe 2", "الجملة الشرطية الثانية", "ประโยคเงื่อนไขแบบที่ 2", "दूसरा शर्तवाचक वाक्य"],
  "third-conditional": ["Tercer condicional", "仮定法過去完了", "第三条件句", "Câu điều kiện loại 3", "Conditionnel de type 3", "Periodo ipotetico di terzo tipo", "Terceira condicional", "Условные предложения 3-го типа", "Kalimat pengandaian tipe 3", "الجملة الشرطية الثالثة", "ประโยคเงื่อนไขแบบที่ 3", "तीसरा शर्तवाचक वाक्य"],
  "past-perfect": ["Pasado perfecto", "過去完了", "过去完成时", "Quá khứ hoàn thành", "Plus-que-parfait", "Trapassato", "Passado perfeito", "Past Perfect", "Past perfect", "الماضي التام", "อดีตกาลสมบูรณ์", "पूर्ण भूत"],
  "modals-deduction": ["Modales de deducción", "推量の助動詞", "推测情态动词", "Động từ khuyết thiếu chỉ suy đoán", "Modaux de déduction", "Modali di deduzione", "Modais de dedução", "Модальные глаголы предположения", "Modal dugaan", "أفعال الاستنتاج الناقصة", "กริยาช่วยแสดงการคาดคะเน", "अनुमान की सहायक क्रियाएँ"],
  "wish-regret": ["wish y arrepentimiento", "wish・後悔の表現", "wish 与后悔表达", "wish và sự tiếc nuối", "wish et regret", "wish e rimpianto", "wish e arrependimento", "wish и сожаление", "wish dan penyesalan", "wish والندم", "wish และการเสียดาย", "wish और पछतावा"],
  "used-to": ["used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to", "used to / be used to"],
  "discourse-markers": ["Marcadores del discurso", "談話標識", "话语标记", "Từ nối diễn ngôn", "Connecteurs du discours", "Segnali discorsivi", "Marcadores do discurso", "Дискурсивные маркеры", "Penanda wacana", "أدوات الربط في الكلام", "คำเชื่อมความ", "प्रवचन संकेतक"],
  "collocations": ["Colocaciones", "コロケーション", "固定搭配", "Kết hợp từ", "Collocations", "Collocazioni", "Colocações", "Устойчивые сочетания", "Kolokasi", "المتلازمات اللفظية", "คำที่ใช้คู่กัน", "शब्द-संयोजन"],
  "mixed-conditionals": ["Condicionales mixtos", "混合仮定法", "混合条件句", "Câu điều kiện hỗn hợp", "Conditionnels mixtes", "Periodo ipotetico misto", "Condicionais mistas", "Смешанные условные", "Pengandaian campuran", "الشرط المختلط", "ประโยคเงื่อนไขแบบผสม", "मिश्रित शर्तवाचक"],
  "inversion-emphasis": ["Inversión y oraciones escindidas", "倒置・強調構文", "倒装和强调句", "Đảo ngữ và câu nhấn mạnh", "Inversion et phrases clivées", "Inversione e frasi scisse", "Inversão e frases clivadas", "Инверсия и эмфатические конструкции", "Inversi dan kalimat penegas", "التقديم والتأخير والتوكيد", "การสลับลำดับและการเน้น", "उलटा क्रम और बल देने वाले वाक्य"],
  "participle-clauses": ["Oraciones de participio", "分詞構文", "分词短语", "Mệnh đề phân từ", "Propositions participiales", "Frasi participiali", "Orações participiais", "Причастные обороты", "Klausa partisip", "الجمل بالمشتق", "อนุประโยค participle", "कृदंत उपवाक्य"],
  "hedging": ["Atenuación", "婉曲・留保の表現", "委婉与保留表达", "Cách nói rào đón", "Atténuation", "Attenuazione", "Atenuação", "Смягчение высказываний", "Pengungkapan hati-hati", "التحوّط في التعبير", "การพูดอย่างระมัดระวัง", "संकोचपूर्ण अभिव्यक्ति"],
};

export function translatedLabel(id: string, uiLanguage: string): string | undefined {
  const index = LABEL_LANGUAGES.indexOf(uiLanguage as (typeof LABEL_LANGUAGES)[number]);
  if (index < 0) return undefined;
  return CONSTRUCTION_LABELS[id]?.[index];
}
