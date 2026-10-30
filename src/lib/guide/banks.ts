/**
 * My 큰 칸(Stagebank · Quizbank · Logbank)의 "?" 설명(2026-10-31 사용자 "BANK류에 ? 버튼으로 설명 — 뭘 학습 가능하고, 어떻게 학습하는지,
 * 스크린샷이나 가능하면 학습 영상까지"). /api/guide `banks=1`이 주고 BankHelp(studyMap/BankHelp)가 그린다 — 칸마다 배울 수 있는 것(한 줄씩, Stagebank는
 * 그 언어 실제 분량 숫자도 같이) · 영상(있으면) · 이렇게 해요(그림 + 한 줄). 칸마다 글은 한 줄(RULES 6).
 * 그림은 /guide/<앱 언어>/<shot>.webp(scripts/capture-bank-guide.mjs), 영상은 /guide/<앱 언어>/<clip>.mp4(scripts/guide-clips.mjs bank-stage·bank-keep).
 * 버튼·칸 이름은 {ui:<키>} — 화면 문구 그대로.
 */
export type BankId = "stage" | "keep" | "log";
export type BankStep = { text: string; shot: string };
export type BankGuide = { can: string[]; how: BankStep[]; clip?: string; shot?: string };

const SHOTS: Record<BankId, string[]> = {
  stage: ["bank-stage-today", "bank-stage-lesson", "bank-stage-ladder"],
  keep: ["bank-keep-quiz", "bank-keep-answer", "bank-keep-settings"],
  log: ["bank-log-week", "bank-log-day"],
};
const CLIPS: Partial<Record<BankId, string>> = { stage: "bank-stage", keep: "bank-keep" };

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
const R = "{ui:quizTargetRate}";
const K = "{ui:keepTitle}";
const SR = "{ui:skillRecord}";
const C = "{ui:checkupTitle}";

const TEXT: Record<string, Lines> = {
  ko: {
    stage: {
      can: [`${F}: 빈칸 하나짜리 틀로 내 문장을 만들어요`, `${S}: 장면을 듣고 내 줄을 말해요`, "0~5단계 — 조건을 채우면 단계 시험"],
      how: [`「${P}」: 지금 할 것 하나 ▶`, `「${X}」›「${Q}」›「${T}」 순서로 익혀요`, "단계 화면: 사다리 · 연습 방식 · 다음 단계까지"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: 빈칸을 쓰거나 골라요`, `「${W}」: 통화·채팅에서 고친 말이 문제로`],
      how: ["탭을 고르고 빈칸을 채워요", `답하면 뜻과 다른 예문 → 「${N}」`, `⚙ 「${R}」 30~70%: 낮을수록 모르는 말이 많이`],
    },
    log: {
      can: ["주마다·날마다 배운 말과 튜터가 고친 줄", `📈 「${SR}」 · 📝 「${C}」`],
      how: [`주 머리: 익힘 · 배움 · 고침 · ${K} 맞힌 수`, "말을 누르면 뜻과 예문"],
    },
  },
  en: {
    stage: {
      can: [`${F}: build your own sentence from a one-gap pattern`, `${S}: hear a scene and say your lines`, "Stages 0–5 — meet the goal, then take the stage test"],
      how: [`“${P}”: one thing to do now ▶`, `Learn it in order: “${X}” › “${Q}” › “${T}”`, "Stage screen: the ladder, how to practise, what’s left"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: type or pick the missing words`, `“${W}”: lines fixed in calls and chats come back as questions`],
      how: ["Pick a tab and fill the gap", `After you answer: the meaning and more examples → “${N}”`, `⚙ “${R}” 30–70%: lower means more new words`],
    },
    log: {
      can: ["What you learned and lines the tutor fixed, by week and day", `📈 “${SR}” · 📝 “${C}”`],
      how: [`Each week: known · learned · fixed · ${K} right answers`, "Tap a word for its meaning and examples"],
    },
  },
  es: {
    stage: {
      can: [`${F}: arma tu frase con un patrón de un hueco`, `${S}: escucha una escena y di tus frases`, "Etapas 0–5: cumple la meta y haz el examen de etapa"],
      how: [`«${P}»: una cosa que hacer ahora ▶`, `En orden: «${X}» › «${Q}» › «${T}»`, "Pantalla de etapa: escalera, forma de practicar, lo que falta"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: escribe o elige lo que falta`, `«${W}»: lo que te corrigieron en llamadas y chats vuelve como pregunta`],
      how: ["Elige una pestaña y completa el hueco", `Al responder: el significado y más ejemplos → «${N}»`, `⚙ «${R}» 30–70 %: más bajo, más palabras nuevas`],
    },
    log: {
      can: ["Lo que aprendiste y lo que corrigió el tutor, por semana y día", `📈 «${SR}» · 📝 «${C}»`],
      how: [`Cada semana: dominado · aprendido · corregido · aciertos en ${K}`, "Toca una palabra para ver su significado y ejemplos"],
    },
  },
  ja: {
    stage: {
      can: [`${F}：空欄ひとつの型で自分の文を作る`, `${S}：場面を聞いて自分のセリフを言う`, "0〜5段階 — 条件を満たすと段階テスト"],
      how: [`「${P}」：今やることがひとつ ▶`, `「${X}」›「${Q}」›「${T}」の順で身につける`, "段階の画面：はしご・練習のしかた・次の段階まで"],
    },
    keep: {
      can: [`${V}・${G}・${E}：空欄を書くか選ぶ`, `「${W}」：通話やチャットで直された言葉が問題に`],
      how: ["タブを選んで空欄を埋める", `答えると意味とほかの例文 →「${N}」`, `⚙「${R}」30〜70%：低いほど知らない言葉が多く`],
    },
    log: {
      can: ["週ごと・日ごとに覚えた言葉とチューターが直した文", `📈「${SR}」・📝「${C}」`],
      how: [`週の見出し：定着・学習・修正・${K}の正解数`, "言葉を押すと意味と例文"],
    },
  },
  zh: {
    stage: {
      can: [`${F}：用只有一个空的句型造自己的句子`, `${S}：听一个场景，说出自己的台词`, "0～5阶段 — 达到条件就参加阶段测试"],
      how: [`「${P}」：现在要做的一件事 ▶`, `按「${X}」›「${Q}」›「${T}」的顺序掌握`, "阶段页面：阶梯 · 练习方式 · 离下一阶段还差多少"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}：填写或选择空缺的词`, `「${W}」：通话和聊天里被纠正的话会变成题目`],
      how: ["选一个标签，填空", `答完显示意思和更多例句 →「${N}」`, `⚙「${R}」30～70%：越低，生词越多`],
    },
    log: {
      can: ["按周、按天列出学到的话和导师纠正的句子", `📈「${SR}」 · 📝「${C}」`],
      how: [`每周标题：掌握 · 学过 · 纠正 · ${K}答对数`, "点一个词看意思和例句"],
    },
  },
  th: {
    stage: {
      can: [`${F}: สร้างประโยคของคุณจากแพตเทิร์นที่มีช่องว่างเดียว`, `${S}: ฟังฉากแล้วพูดบทของคุณ`, "ระดับ 0–5 — ครบเงื่อนไขแล้วสอบระดับ"],
      how: [`“${P}”: สิ่งที่ต้องทำตอนนี้หนึ่งอย่าง ▶`, `เรียนตามลำดับ “${X}” › “${Q}” › “${T}”`, "หน้าระดับ: บันได · วิธีฝึก · เหลืออีกเท่าไร"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: พิมพ์หรือเลือกคำที่หายไป`, `“${W}”: ประโยคที่ถูกแก้ในการโทรและแชตกลับมาเป็นโจทย์`],
      how: ["เลือกแท็บแล้วเติมช่องว่าง", `ตอบแล้วเห็นความหมายและตัวอย่างอื่น → “${N}”`, `⚙ “${R}” 30–70%: ยิ่งต่ำ คำใหม่ยิ่งมาก`],
    },
    log: {
      can: ["สิ่งที่เรียนและประโยคที่ติวเตอร์แก้ แยกตามสัปดาห์และวัน", `📈 “${SR}” · 📝 “${C}”`],
      how: [`หัวสัปดาห์: จำได้ · เรียนแล้ว · แก้แล้ว · ตอบถูกใน ${K}`, "แตะคำเพื่อดูความหมายและตัวอย่าง"],
    },
  },
  vi: {
    stage: {
      can: [`${F}: tự đặt câu từ một mẫu có một chỗ trống`, `${S}: nghe một cảnh rồi nói lời của bạn`, "Cấp 0–5 — đạt điều kiện thì làm bài kiểm tra cấp"],
      how: [`“${P}”: một việc cần làm bây giờ ▶`, `Học theo thứ tự “${X}” › “${Q}” › “${T}”`, "Màn hình cấp: bậc thang · cách luyện · còn bao nhiêu"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: gõ hoặc chọn từ còn thiếu`, `“${W}”: câu được sửa trong cuộc gọi và trò chuyện thành câu hỏi`],
      how: ["Chọn một thẻ rồi điền chỗ trống", `Trả lời xong thấy nghĩa và thêm ví dụ → “${N}”`, `⚙ “${R}” 30–70%: càng thấp càng nhiều từ mới`],
    },
    log: {
      can: ["Những gì bạn đã học và câu gia sư đã sửa, theo tuần và ngày", `📈 “${SR}” · 📝 “${C}”`],
      how: [`Đầu tuần: đã thuộc · đã học · đã sửa · câu đúng ở ${K}`, "Chạm vào một từ để xem nghĩa và ví dụ"],
    },
  },
  id: {
    stage: {
      can: [`${F}: buat kalimatmu dari pola dengan satu titik kosong`, `${S}: dengarkan adegan lalu ucapkan bagianmu`, "Tahap 0–5 — penuhi syaratnya lalu ikut tes tahap"],
      how: [`“${P}”: satu hal untuk dilakukan sekarang ▶`, `Pelajari berurutan: “${X}” › “${Q}” › “${T}”`, "Layar tahap: tangga · cara latihan · sisa menuju tahap berikutnya"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: ketik atau pilih kata yang hilang`, `“${W}”: kalimat yang dikoreksi saat panggilan dan chat jadi soal`],
      how: ["Pilih tab lalu isi titik kosong", `Setelah menjawab: arti dan contoh lain → “${N}”`, `⚙ “${R}” 30–70%: makin rendah, makin banyak kata baru`],
    },
    log: {
      can: ["Yang kamu pelajari dan kalimat yang dikoreksi tutor, per minggu dan hari", `📈 “${SR}” · 📝 “${C}”`],
      how: [`Judul minggu: dikuasai · dipelajari · dikoreksi · benar di ${K}`, "Ketuk kata untuk melihat arti dan contoh"],
    },
  },
  hi: {
    stage: {
      can: [`${F}: एक खाली जगह वाले ढाँचे से अपना वाक्य बनाएँ`, `${S}: दृश्य सुनें और अपनी पंक्तियाँ बोलें`, "स्तर 0–5 — शर्त पूरी होने पर स्तर टेस्ट"],
      how: [`“${P}”: अभी करने का एक काम ▶`, `क्रम से सीखें: “${X}” › “${Q}” › “${T}”`, "स्तर स्क्रीन: सीढ़ी · अभ्यास का तरीका · अगले स्तर तक कितना बाकी"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: छूटा शब्द लिखें या चुनें`, `“${W}”: कॉल और चैट में सुधारी गई बातें सवाल बनकर आती हैं`],
      how: ["टैब चुनें और खाली जगह भरें", `जवाब के बाद अर्थ और और उदाहरण → “${N}”`, `⚙ “${R}” 30–70%: जितना कम, उतने ज़्यादा नए शब्द`],
    },
    log: {
      can: ["हफ़्ते और दिन के हिसाब से सीखी बातें और ट्यूटर के सुधारे वाक्य", `📈 “${SR}” · 📝 “${C}”`],
      how: [`हफ़्ते का शीर्षक: पक्का · सीखा · सुधारा · ${K} में सही`, "शब्द पर टैप करें — अर्थ और उदाहरण"],
    },
  },
  ar: {
    stage: {
      can: [`${F}: كوّن جملتك من قالب فيه فراغ واحد`, `${S}: استمع إلى مشهد وقل جملك`, "المراحل 0–5 — حقّق الشرط ثم اختبار المرحلة"],
      how: [`«${P}»: شيء واحد تفعله الآن ▶`, `تعلّمه بالترتيب: «${X}» › «${Q}» › «${T}»`, "شاشة المرحلة: السلّم · طريقة التدريب · ما بقي للمرحلة التالية"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: اكتب الكلمة الناقصة أو اخترها`, `«${W}»: ما صُحّح لك في المكالمات والمحادثات يعود سؤالًا`],
      how: ["اختر تبويبًا واملأ الفراغ", `بعد الإجابة: المعنى وأمثلة أخرى ← «${N}»`, `⚙ «${R}» 30–70%: كلما قلّت زادت الكلمات الجديدة`],
    },
    log: {
      can: ["ما تعلّمته والجمل التي صحّحها المعلّم، حسب الأسبوع واليوم", `📈 «${SR}» · 📝 «${C}»`],
      how: [`رأس الأسبوع: أتقنته · تعلّمته · صُحّح · إجابات صحيحة في ${K}`, "اضغط على كلمة لترى معناها وأمثلة"],
    },
  },
  fr: {
    stage: {
      can: [`${F} : faites votre phrase avec un modèle à un trou`, `${S} : écoutez une scène et dites vos répliques`, "Étapes 0–5 — objectif atteint, puis test d’étape"],
      how: [`« ${P} » : une chose à faire maintenant ▶`, `Dans l’ordre : « ${X} » › « ${Q} » › « ${T} »`, "Écran d’étape : échelle, façon de s’entraîner, ce qui reste"],
    },
    keep: {
      can: [`${V} · ${G} · ${E} : tapez ou choisissez le mot manquant`, `« ${W} » : ce qu’on vous a corrigé en appel et en chat revient en question`],
      how: ["Choisissez un onglet et complétez le trou", `Après la réponse : le sens et d’autres exemples → « ${N} »`, `⚙ « ${R} » 30–70 % : plus bas, plus de mots nouveaux`],
    },
    log: {
      can: ["Ce que vous avez appris et les phrases corrigées, par semaine et par jour", `📈 « ${SR} » · 📝 « ${C} »`],
      how: [`En tête de semaine : acquis · appris · corrigé · bonnes réponses ${K}`, "Touchez un mot pour son sens et des exemples"],
    },
  },
  it: {
    stage: {
      can: [`${F}: crea la tua frase con uno schema a un vuoto`, `${S}: ascolta una scena e di’ le tue battute`, "Livelli 0–5 — raggiunto l’obiettivo, il test di livello"],
      how: [`«${P}»: una cosa da fare ora ▶`, `In ordine: «${X}» › «${Q}» › «${T}»`, "Schermata del livello: scala, modo di esercitarsi, quanto manca"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: scrivi o scegli la parola mancante`, `«${W}»: ciò che ti hanno corretto in chiamate e chat torna come domanda`],
      how: ["Scegli una scheda e riempi il vuoto", `Dopo la risposta: il significato e altri esempi → «${N}»`, `⚙ «${R}» 30–70%: più basso, più parole nuove`],
    },
    log: {
      can: ["Ciò che hai imparato e le frasi corrette dal tutor, per settimana e giorno", `📈 «${SR}» · 📝 «${C}»`],
      how: [`Ogni settimana: acquisito · imparato · corretto · giuste in ${K}`, "Tocca una parola per significato ed esempi"],
    },
  },
  pt: {
    stage: {
      can: [`${F}: monte sua frase com um modelo de uma lacuna`, `${S}: ouça uma cena e diga suas falas`, "Etapas 0–5 — cumpra a meta e faça o teste da etapa"],
      how: [`“${P}”: uma coisa para fazer agora ▶`, `Na ordem: “${X}” › “${Q}” › “${T}”`, "Tela da etapa: escada, jeito de praticar, quanto falta"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: digite ou escolha a palavra que falta`, `“${W}”: o que foi corrigido em chamadas e chats volta como pergunta`],
      how: ["Escolha uma aba e preencha a lacuna", `Depois de responder: o sentido e mais exemplos → “${N}”`, `⚙ “${R}” 30–70%: quanto menor, mais palavras novas`],
    },
    log: {
      can: ["O que você aprendeu e as frases corrigidas pelo tutor, por semana e dia", `📈 “${SR}” · 📝 “${C}”`],
      how: [`Cabeçalho da semana: dominado · aprendido · corrigido · acertos no ${K}`, "Toque numa palavra para ver o sentido e exemplos"],
    },
  },
  ru: {
    stage: {
      can: [`${F}: составьте свою фразу по шаблону с одним пропуском`, `${S}: послушайте сцену и скажите свои реплики`, "Уровни 0–5 — выполните условие и пройдите тест уровня"],
      how: [`«${P}»: одно дело на сейчас ▶`, `По порядку: «${X}» › «${Q}» › «${T}»`, "Экран уровня: лестница, способ практики, сколько осталось"],
    },
    keep: {
      can: [`${V} · ${G} · ${E}: впишите или выберите пропущенное`, `«${W}»: исправленное в звонках и чатах возвращается вопросом`],
      how: ["Выберите вкладку и заполните пропуск", `После ответа — значение и другие примеры → «${N}»`, `⚙ «${R}» 30–70%: чем ниже, тем больше новых слов`],
    },
    log: {
      can: ["Что вы выучили и что исправил репетитор — по неделям и дням", `📈 «${SR}» · 📝 «${C}»`],
      how: [`Заголовок недели: освоено · выучено · исправлено · верно в ${K}`, "Нажмите на слово — значение и примеры"],
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
    };
  }
  return out;
}
