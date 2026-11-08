/**
 * My 큰 칸(Stagebank · Quizbank · Logbank)의 "?" 설명(2026-10-31 사용자 "BANK류에 ? 버튼으로 설명 — 뭘 학습 가능하고, 어떻게 학습하는지,
 * 스크린샷이나 가능하면 학습 영상까지"). /api/guide `banks=1`이 주고 BankHelp(studyMap/BankHelp)가 그린다 — 칸마다 배울 수 있는 것(한 줄씩, Stagebank는
 * 그 언어 실제 분량 숫자도 같이) · 영상(있으면) · 이렇게 해요(그림 + 한 줄). 칸마다 글은 한 줄(RULES 6).
 * 그림은 /guide/<앱 언어>/<shot>.webp(scripts/capture-bank-guide.mjs), 영상은 /guide/<앱 언어>/<clip>.mp4(scripts/guide-clips.mjs bank-stage·bank-keep).
 * 버튼·칸 이름은 {ui:<키>} — 화면 문구 그대로.
 */
export type BankId = "stage" | "keep" | "log";
export type BankStep = { text: string; shot: string };
/**
 * 칸마다 정해진 순서로 그리는 조각(2026-11-02 사용자 "배울 수 있는 것·이렇게 공부해요처럼 구조를 정해 두지 말고 탭별로 핵심 기능 > 세부 기능,
 * 1. 2. 같은 틀도 고정하지 말고 사용자가 뭔지 직관적으로"): 첫 조각(lead)이 그 칸의 핵심 — 큰 글 + 그림·영상, 그 뒤는 세부 — 한 줄 + 작은 그림.
 * 제목·번호 없이 순서만. numbers = 그 학습 언어의 실제 분량(앱이 채움). can·how는 옛 앱(2.79 이하 BankHelp)이 그대로 읽는다.
 */
export type BankBlock = { text: string; lead?: boolean; shot?: string; clip?: string; numbers?: boolean };
export type BankGuide = { can: string[]; how: BankStep[]; clip?: string; shot?: string; blocks?: BankBlock[] };

const SHOTS: Record<BankId, string[]> = {
  stage: ["bank-stage-today", "bank-stage-lesson", "bank-stage-ladder"],
  keep: ["bank-keep-quiz", "bank-keep-answer", "bank-keep-answer", "bank-keep-settings"],
  log: ["bank-log-week", "bank-log-axis", "bank-log-day"],
};
const CLIPS: Partial<Record<BankId, string>> = { stage: "bank-stage", keep: "bank-keep" };

/** 칸마다 핵심 → 세부 순서(can/how 몇 번째 줄을 어떤 그림과). 겹치는 줄은 뺌(stage how[2]는 can[2]와, keep how[0]은 can[0]과 같은 말). */
type Pick = { from: "can" | "how"; i: number; lead?: boolean; shot?: string; clip?: boolean; numbers?: boolean };
const ORDER: Record<BankId, Pick[]> = {
  stage: [
    { from: "how", i: 0, lead: true, shot: "bank-stage-today", clip: true },
    { from: "can", i: 0, numbers: true },
    { from: "how", i: 1, shot: "bank-stage-lesson" },
    { from: "can", i: 1 },
    { from: "can", i: 2, shot: "bank-stage-ladder" },
  ],
  keep: [
    { from: "can", i: 0, lead: true, shot: "bank-keep-quiz", clip: true, numbers: true },
    { from: "how", i: 1, shot: "bank-keep-answer" },
    { from: "can", i: 1 },
    { from: "how", i: 2 },
    { from: "how", i: 3, shot: "bank-keep-settings" },
  ],
  log: [
    { from: "can", i: 0, lead: true, shot: "bank-log-week" },
    { from: "how", i: 0, shot: "bank-log-axis" },
    { from: "how", i: 1 },
    { from: "can", i: 1, shot: "bank-log-day" },
    { from: "how", i: 2 },
  ],
};

type Lines = Record<BankId, { can: string[]; how: string[] }>;

const F = "{ui:amountFrames}";
const S = "{ui:stageScriptsTitle}";
const P = "{ui:planTitle}";
const X = "{ui:explanation}";
const Q = "{ui:quizTag}";
const T = "{ui:homeTabTalk}";
const V = "{ui:partVocab}";
const G = "{ui:partGrammar}";
const E = "{ui:partExpression}";
const W = "{ui:weakTitle}";
const N = "{ui:scriptNext}";
const K = "{ui:keepTitle}";
const SR = "{ui:skillRecord}";
const C = "{ui:checkupTitle}";
const WT = "{ui:wordTestTitle}";
const VB = "{ui:vocabByStage} · {ui:vocabByPos} · {ui:vocabByTopic}";

const TEXT: Record<string, Lines> = {
  ko: {
    stage: {
      can: [`${F}: 빈칸 하나짜리 틀로 내 문장을 만들어요`, `${S}: 장면을 듣고 내 줄을 말해요`, "0~5단계 — 조건을 채우면 단계 시험"],
      how: [`「${P}」: 지금 할 것 하나 ▶`, `「${X}」›「${Q}」›「${T}」 순서로 익혀요`, "단계 화면: 사다리 · 문장구조 · 상황 · 문법"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: 빈칸을 쓰거나 골라요`, `「${W}」: 통화·채팅에서 고친 말이 문제로`],
      how: ["탭을 고르고 빈칸을 채워요", `답하면 뜻과 다른 예문 → 「${N}」`, `단어는 처음 보는 것만 — 본 단어는 📝 「${WT}」에서`, `⚙ ${VB}: 어떤 단어`],
    },
    log: {
      can: ["육각형: 단어·문장 이해·활용, 듣기, 실전 대화 — 1~5단계 채운 %", "📎 「{ui:fillRecords}」: 날마다 한 공부와 튜터가 고친 줄"],
      how: ["꼭짓점을 누르면 단계 게이지와 세부 칸", "번호 칸을 누르면 「{ui:fillShort}」 · 「{ui:fillOrder}」 · 「{ui:fillWhy}」", "⏱ 막대를 누르면 그날 한 공부"],
    },
  },
  en: {
    stage: {
      can: [`${F}: build your own sentence from a one-gap pattern`, `${S}: hear a scene and say your lines`, "Stages 0–5 — meet the goal, then take the stage test"],
      how: [`“${P}”: one thing to do now ▶`, `Learn it in order: “${X}” › “${Q}” › “${T}”`, "Stage screen: the ladder, patterns, situations, and grammar"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: type or pick the missing words`, `“${W}”: lines fixed in calls and chats come back as questions`],
      how: ["Pick a tab and fill the gap", `After you answer: the meaning and more examples → “${N}”`, `Vocabulary: only new words — seen ones come back in 📝 “${WT}”`, `⚙ ${VB}: which words`],
    },
    log: {
      can: ["Hexagon: words, sentences, listening, talk — % of stages 1–5 filled", "📎 “{ui:fillRecords}”: what you did each day and lines the tutor fixed"],
      how: ["Tap a corner for its stage gauge and detail rows", "Tap a numbered row for “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ Tap a bar for that day’s study"],
    },
  },
  es: {
    stage: {
      can: [`${F}: arma tu frase con un patrón de un hueco`, `${S}: escucha una escena y di tus frases`, "Etapas 0–5: cumple la meta y haz el examen de etapa"],
      how: [`«${P}»: una cosa que hacer ahora ▶`, `En orden: «${X}» › «${Q}» › «${T}»`, "Pantalla de etapa: escalera, estructuras, situaciones y gramática"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: escribe o elige lo que falta`, `«${W}»: lo que te corrigieron en llamadas y chats vuelve como pregunta`],
      how: ["Elige una pestaña y completa el hueco", `Al responder: el significado y más ejemplos → «${N}»`, `Vocabulario: solo palabras nuevas — las vistas vuelven en 📝 «${WT}»`, `⚙ ${VB}: qué palabras`],
    },
    log: {
      can: ["Hexágono: palabras, frases, escucha, charla — % de etapas 1–5", "📎 «{ui:fillRecords}»: lo que hiciste cada día y las frases que corrigió el tutor"],
      how: ["Toca un vértice para ver su medidor por etapas y los detalles", "Toca una fila numerada para ver «{ui:fillShort}» · «{ui:fillOrder}» · «{ui:fillWhy}»", "⏱ Toca una barra para ver lo que estudiaste ese día"],
    },
  },
  ja: {
    stage: {
      can: [`${F}：空欄ひとつの型で自分の文を作る`, `${S}：場面を聞いて自分のセリフを言う`, "0〜5段階 — 条件を満たすと段階テスト"],
      how: [`「${P}」：今やることがひとつ ▶`, `「${X}」›「${Q}」›「${T}」の順で身につける`, "段階の画面：はしご・文型・場面・文法"],
    },
    keep: {
      can: [`${V}・${G}・${E}：空欄を書くか選ぶ`, `「${W}」：通話やチャットで直された言葉が問題に`],
      how: ["タブを選んで空欄を埋める", `答えると意味とほかの例文 →「${N}」`, `単語は初めての言葉だけ — 見た言葉は📝「${WT}」で`, `⚙ ${VB}：どの言葉`],
    },
    log: {
      can: ["六角形：語彙・文・リスニング・会話 — 1〜5段階を埋めた％", "📎「{ui:fillRecords}」：毎日の学習とチューターが直した文"],
      how: ["頂点を押すと段階ゲージと細かい項目", "番号の項目を押すと「{ui:fillShort}」・「{ui:fillOrder}」・「{ui:fillWhy}」", "⏱ 棒を押すとその日の学習"],
    },
  },
  zh: {
    stage: {
      can: [`${F}：用只有一个空的句型造自己的句子`, `${S}：听一个场景，说出自己的台词`, "0～5阶段 — 达到条件就参加阶段测试"],
      how: [`「${P}」：现在要做的一件事 ▶`, `按「${X}」›「${Q}」›「${T}」的顺序掌握`, "阶段页面：阶梯 · 句型 · 情景 · 语法"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}：填写或选择空缺的词`, `「${W}」：通话和聊天里被纠正的话会变成题目`],
      how: ["选一个标签，填空", `答完显示意思和更多例句 →「${N}」`, `词汇只出新词——见过的词在📝「${WT}」里再出`, `⚙ ${VB}：哪些词`],
    },
    log: {
      can: ["六边形：词汇、句子、听力、对话 — 1~5阶段填满的％", "📎「{ui:fillRecords}」：每天学了什么和导师纠正的句子"],
      how: ["点顶点看阶段进度条和细项", "点编号细项看「{ui:fillShort}」·「{ui:fillOrder}」·「{ui:fillWhy}」", "⏱ 点柱子看那天的学习"],
    },
  },
  th: {
    stage: {
      can: [`${F}: สร้างประโยคของคุณจากแพตเทิร์นที่มีช่องว่างเดียว`, `${S}: ฟังฉากแล้วพูดบทของคุณ`, "ระดับ 0–5 — ครบเงื่อนไขแล้วสอบระดับ"],
      how: [`“${P}”: สิ่งที่ต้องทำตอนนี้หนึ่งอย่าง ▶`, `เรียนตามลำดับ “${X}” › “${Q}” › “${T}”`, "หน้าระดับ: บันได · โครงสร้าง · สถานการณ์ · ไวยากรณ์"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: พิมพ์หรือเลือกคำที่หายไป`, `“${W}”: ประโยคที่ถูกแก้ในการโทรและแชตกลับมาเป็นโจทย์`],
      how: ["เลือกแท็บแล้วเติมช่องว่าง", `ตอบแล้วเห็นความหมายและตัวอย่างอื่น → “${N}”`, `คำศัพท์: เฉพาะคำใหม่ — คำที่เคยเห็นกลับมาใน 📝 “${WT}”`, `⚙ ${VB}: คำไหน`],
    },
    log: {
      can: ["หกเหลี่ยม: คำ ประโยค การฟัง สนทนา — เติมระดับ 1–5 กี่ %", "📎 “{ui:fillRecords}”: เรียนอะไรในแต่ละวันและประโยคที่ติวเตอร์แก้"],
      how: ["แตะมุมเพื่อดูเกจรายระดับและรายละเอียด", "แตะแถวที่มีเลขเพื่อดู “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ แตะแท่งเพื่อดูสิ่งที่เรียนวันนั้น"],
    },
  },
  vi: {
    stage: {
      can: [`${F}: tự đặt câu từ một mẫu có một chỗ trống`, `${S}: nghe một cảnh rồi nói lời của bạn`, "Cấp 0–5 — đạt điều kiện thì làm bài kiểm tra cấp"],
      how: [`“${P}”: một việc cần làm bây giờ ▶`, `Học theo thứ tự “${X}” › “${Q}” › “${T}”`, "Màn hình cấp: bậc thang · cấu trúc · tình huống · ngữ pháp"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: gõ hoặc chọn từ còn thiếu`, `“${W}”: câu được sửa trong cuộc gọi và trò chuyện thành câu hỏi`],
      how: ["Chọn một thẻ rồi điền chỗ trống", `Trả lời xong thấy nghĩa và thêm ví dụ → “${N}”`, `Từ vựng: chỉ từ mới — từ đã gặp quay lại trong 📝 “${WT}”`, `⚙ ${VB}: từ nào`],
    },
    log: {
      can: ["Lục giác: từ, câu, nghe, hội thoại — % cấp 1–5 đã lấp", "📎 “{ui:fillRecords}”: mỗi ngày đã học gì và câu gia sư sửa"],
      how: ["Chạm một đỉnh để xem thanh đo theo cấp và các mục chi tiết", "Chạm mục có số để xem “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ Chạm một cột để xem hôm đó đã học gì"],
    },
  },
  id: {
    stage: {
      can: [`${F}: buat kalimatmu dari pola dengan satu titik kosong`, `${S}: dengarkan adegan lalu ucapkan bagianmu`, "Tahap 0–5 — penuhi syaratnya lalu ikut tes tahap"],
      how: [`“${P}”: satu hal untuk dilakukan sekarang ▶`, `Pelajari berurutan: “${X}” › “${Q}” › “${T}”`, "Layar tahap: tangga · struktur · situasi · tata bahasa"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: ketik atau pilih kata yang hilang`, `“${W}”: kalimat yang dikoreksi saat panggilan dan chat jadi soal`],
      how: ["Pilih tab lalu isi titik kosong", `Setelah menjawab: arti dan contoh lain → “${N}”`, `Kosakata: hanya kata baru — yang sudah dilihat muncul di 📝 “${WT}”`, `⚙ ${VB}: kata yang mana`],
    },
    log: {
      can: ["Segi enam: kata, kalimat, dengar, bicara — % tahap 1–5 terisi", "📎 “{ui:fillRecords}”: yang kamu pelajari tiap hari dan kalimat yang dikoreksi tutor"],
      how: ["Ketuk sudut untuk melihat pengukur per tahap dan rinciannya", "Ketuk baris bernomor untuk “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ Ketuk batang untuk melihat belajar hari itu"],
    },
  },
  hi: {
    stage: {
      can: [`${F}: एक खाली जगह वाले ढाँचे से अपना वाक्य बनाएँ`, `${S}: दृश्य सुनें और अपनी पंक्तियाँ बोलें`, "स्तर 0–5 — शर्त पूरी होने पर स्तर टेस्ट"],
      how: [`“${P}”: अभी करने का एक काम ▶`, `क्रम से सीखें: “${X}” › “${Q}” › “${T}”`, "स्तर स्क्रीन: सीढ़ी · संरचना · स्थिति · व्याकरण"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: छूटा शब्द लिखें या चुनें`, `“${W}”: कॉल और चैट में सुधारी गई बातें सवाल बनकर आती हैं`],
      how: ["टैब चुनें और खाली जगह भरें", `जवाब के बाद अर्थ और और उदाहरण → “${N}”`, `शब्द: सिर्फ़ नए — देखे हुए 📝 “${WT}” में फिर`, `⚙ ${VB}: कौन-से शब्द`],
    },
    log: {
      can: ["षट्भुज: शब्द, वाक्य, सुनना, बातचीत — चरण 1–5 कितने % भरे", "📎 “{ui:fillRecords}”: हर दिन क्या पढ़ा और ट्यूटर ने कौन-से वाक्य सुधारे"],
      how: ["कोने पर टैप करें — चरण वाला गेज और ब्योरे", "नंबर वाली पंक्ति पर टैप करें — “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ किसी बार पर टैप करें — उस दिन की पढ़ाई"],
    },
  },
  ar: {
    stage: {
      can: [`${F}: كوّن جملتك من قالب فيه فراغ واحد`, `${S}: استمع إلى مشهد وقل جملك`, "المراحل 0–5 — حقّق الشرط ثم اختبار المرحلة"],
      how: [`«${P}»: شيء واحد تفعله الآن ▶`, `تعلّمه بالترتيب: «${X}» › «${Q}» › «${T}»`, "شاشة المرحلة: السلّم · التراكيب · المواقف · القواعد"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: اكتب الكلمة الناقصة أو اخترها`, `«${W}»: ما صُحّح لك في المكالمات والمحادثات يعود سؤالًا`],
      how: ["اختر تبويبًا واملأ الفراغ", `بعد الإجابة: المعنى وأمثلة أخرى ← «${N}»`, `المفردات: كلمات جديدة فقط — ما رأيته يعود في 📝 «${WT}»`, `⚙ ${VB}: أي كلمات`],
    },
    log: {
      can: ["السداسي: مفردات، جمل، استماع، محادثة — ٪ المراحل 1–5", "📎 «{ui:fillRecords}»: ما درسته كل يوم والجمل التي صحّحها المعلّم"],
      how: ["اضغط على رأس لترى مقياس المراحل والتفاصيل", "اضغط على صف مرقّم لترى «{ui:fillShort}» · «{ui:fillOrder}» · «{ui:fillWhy}»", "⏱ اضغط على عمود لترى ما درسته ذلك اليوم"],
    },
  },
  fr: {
    stage: {
      can: [`${F} : faites votre phrase avec un modèle à un trou`, `${S} : écoutez une scène et dites vos répliques`, "Étapes 0–5 — objectif atteint, puis test d’étape"],
      how: [`« ${P} » : une chose à faire maintenant ▶`, `Dans l’ordre : « ${X} » › « ${Q} » › « ${T} »`, "Écran d’étape : échelle, structures, situations, grammaire"],
    },
    keep: {
      can: [`${V} · ${G} · ${E} : tapez ou choisissez le mot manquant`, `« ${W} » : ce qu’on vous a corrigé en appel et en chat revient en question`],
      how: ["Choisissez un onglet et complétez le trou", `Après la réponse : le sens et d’autres exemples → « ${N} »`, `Vocabulaire : seulement des mots nouveaux — les autres dans 📝 « ${WT} »`, `⚙ ${VB} : quels mots`],
    },
    log: {
      can: ["Hexagone : mots, phrases, écoute, oral — % des étapes 1–5", "📎 « {ui:fillRecords} » : ton travail du jour et les phrases corrigées"],
      how: ["Touche un sommet pour sa jauge par étape et le détail", "Touche une ligne numérotée pour « {ui:fillShort} » · « {ui:fillOrder} » · « {ui:fillWhy} »", "⏱ Touche une barre pour ce que tu as étudié ce jour-là"],
    },
  },
  it: {
    stage: {
      can: [`${F}: crea la tua frase con uno schema a un vuoto`, `${S}: ascolta una scena e di’ le tue battute`, "Livelli 0–5 — raggiunto l’obiettivo, il test di livello"],
      how: [`«${P}»: una cosa da fare ora ▶`, `In ordine: «${X}» › «${Q}» › «${T}»`, "Schermata del livello: scala, strutture, situazioni, grammatica"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: scrivi o scegli la parola mancante`, `«${W}»: ciò che ti hanno corretto in chiamate e chat torna come domanda`],
      how: ["Scegli una scheda e riempi il vuoto", `Dopo la risposta: il significato e altri esempi → «${N}»`, `Vocaboli: solo parole nuove — quelle viste tornano in 📝 «${WT}»`, `⚙ ${VB}: quali parole`],
    },
    log: {
      can: ["Esagono: parole, frasi, ascolto, dialogo — % delle tappe 1–5", "📎 «{ui:fillRecords}»: cosa hai fatto ogni giorno e le frasi corrette dal tutor"],
      how: ["Tocca un vertice per l’indicatore per tappa e i dettagli", "Tocca una riga numerata per «{ui:fillShort}» · «{ui:fillOrder}» · «{ui:fillWhy}»", "⏱ Tocca una barra per lo studio di quel giorno"],
    },
  },
  pt: {
    stage: {
      can: [`${F}: monte sua frase com um modelo de uma lacuna`, `${S}: ouça uma cena e diga suas falas`, "Etapas 0–5 — cumpra a meta e faça o teste da etapa"],
      how: [`“${P}”: uma coisa para fazer agora ▶`, `Na ordem: “${X}” › “${Q}” › “${T}”`, "Tela da etapa: escada, estruturas, situações, gramática"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: digite ou escolha a palavra que falta`, `“${W}”: o que foi corrigido em chamadas e chats volta como pergunta`],
      how: ["Escolha uma aba e preencha a lacuna", `Depois de responder: o sentido e mais exemplos → “${N}”`, `Vocabulário: só palavras novas — as vistas voltam no 📝 “${WT}”`, `⚙ ${VB}: quais palavras`],
    },
    log: {
      can: ["Hexágono: palavras, frases, escuta, conversa — % das etapas 1–5", "📎 “{ui:fillRecords}”: o que você fez a cada dia e as frases que o tutor corrigiu"],
      how: ["Toque num vértice para ver o medidor por etapa e os detalhes", "Toque numa linha numerada para ver “{ui:fillShort}” · “{ui:fillOrder}” · “{ui:fillWhy}”", "⏱ Toque numa barra para ver o estudo daquele dia"],
    },
  },
  ru: {
    stage: {
      can: [`${F}: составьте свою фразу по шаблону с одним пропуском`, `${S}: послушайте сцену и скажите свои реплики`, "Уровни 0–5 — выполните условие и пройдите тест уровня"],
      how: [`«${P}»: одно дело на сейчас ▶`, `По порядку: «${X}» › «${Q}» › «${T}»`, "Экран уровня: лестница, структуры, ситуации, грамматика"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: впишите или выберите пропущенное`, `«${W}»: исправленное в звонках и чатах возвращается вопросом`],
      how: ["Выберите вкладку и заполните пропуск", `После ответа — значение и другие примеры → «${N}»`, `Слова: только новые — знакомые вернутся в 📝 «${WT}»`, `⚙ ${VB}: какие слова`],
    },
    log: {
      can: ["Шестиугольник: слова, фразы, слух, речь — % этапов 1–5", "📎 «{ui:fillRecords}»: что ты делал каждый день и фразы, исправленные репетитором"],
      how: ["Нажми на вершину — шкала по этапам и подробности", "Нажми на строку с номером — «{ui:fillShort}» · «{ui:fillOrder}» · «{ui:fillWhy}»", "⏱ Нажми на столбик — занятия за тот день"],
    },
  },
};

export const BANK_LANGUAGES = Object.keys(TEXT);

/** 그 앱 언어의 세 칸 설명(없는 언어는 영어). */
export function bankGuides(language: string): Record<BankId, BankGuide> {
  const lines = TEXT[language] ?? TEXT.en!;
  const out = {} as Record<BankId, BankGuide>;
  for (const id of Object.keys(SHOTS) as BankId[]) {
    const shots = SHOTS[id];
    out[id] = {
      can: lines[id].can,
      how: lines[id].how.map((text, i) => ({ text, shot: shots[i] ?? shots[0]! })),
      ...(CLIPS[id] ? { clip: CLIPS[id], shot: shots[0] } : {}),
      blocks: ORDER[id]
        .map((pick): BankBlock | null => {
          const text = lines[id][pick.from][pick.i];
          if (!text) return null;
          return {
            text,
            ...(pick.lead ? { lead: true } : {}),
            ...(pick.shot ? { shot: pick.shot } : {}),
            ...(pick.clip && CLIPS[id] ? { clip: CLIPS[id] } : {}),
            ...(pick.numbers ? { numbers: true } : {}),
          };
        })
        .filter((one): one is BankBlock => Boolean(one)),
    };
  }
  return out;
}
