// 사용법(?) 칸의 설명 영상 — 실제 앱을 조작하는 장면 + 영상 안 자막 한 줄씩(사용자 2026-10-29 "기능 사용 + 그 안에 설명까지").
// 2026-10-29 사용자 "UI를 다 보여 주지 않고 부분적으로 — 줌인, 넘기는 속도가 너무 빠름, 입력 > 자막 > 보내기 > 결과 > 설명 흐름으로 천천히, 모든 기능이 안 보여도 돼":
//   장면마다 지금 쓰는 부분만 4:5로 잘라 키우고(focus — 자막 말풍선도 그 옆에), 실제 속도로(채점 기다림만 빨리) — 한 장면 = 보여 주기·자막 → 누르기 → 결과 → 설명 자막.
// 소리 없음·반복. 결과는 public/guide/<앱 언어>/<영상>.mp4(600×750), 칸 ↔ 영상은 src/lib/guide/content.ts GUIDE_CLIPS·lib/guide/overview.ts.
// 자막의 버튼 이름은 그 언어의 실제 문구(copy.ts)를 그대로 끼운다({planTitle} 같은 자리).
//
// 순서(저장소 맨 위에서):
//   1. npm run build:capacitor            (www — 지금 화면)
//   2. PLAYWRIGHT_MODULE=… node scripts/guide-clips.mjs <my-today|flow> [ko,en,ja…]
//      /api는 운영으로(시험 사용자 simcheck-clip-…, 끝나면 지움), 🎤는 가짜 마이크 + 받아쓰기를 그 줄로 바꿔 끼움.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, serve, state, api, loadCopy, ROOT, API } from "./ux-check/lib.mjs";

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "vi", "id", "hi", "ar", "fr", "it", "pt", "ru"];
const [clipName = "my-today", only] = process.argv.slice(2);
const locales = only ? only.split(",") : LOCALES;
const learnFor = (locale) => (locale === "en" ? "es" : "en");
const VW = 390, VH = 844;

/** 영상마다 장면 자막(14개 언어). 「」 안은 그 언어 앱의 실제 버튼·칸 이름. */
const CAPTIONS = {
  // 사용법 맨 앞 "학습 흐름"(lib/guide/overview.ts와 같은 순서): 고르기 → 말하기 → ★ → 지속 학습 → 고르기 → 결과 → 대화.
  flow: {
    ko: ["①「{planTitle}」에서 하나를 눌러요", "내 차례: 「{scriptSay}」를 누르고 말해요", "맞게 말하면 ★", "②「{keepTitle}」: ▶「{studyMore}」", "알맞은 말을 골라요", "맞으면 ✓, 틀리면 정답이 초록으로", "③「{homeTabTalk}」: AI 튜터와 써 봐요"],
    en: ["① Tap one in “{planTitle}”", "Your turn: tap “{scriptSay}” and speak", "Say it right for ★", "② “{keepTitle}”: ▶ “{studyMore}”", "Pick the right words", "Right: ✓ — wrong: the answer turns green", "③ “{homeTabTalk}”: use it with the AI tutor"],
    es: ["① Toca uno en «{planTitle}»", "Tu turno: toca «{scriptSay}» y habla", "Dilo bien y ganas ★", "② «{keepTitle}»: ▶ «{studyMore}»", "Elige las palabras correctas", "Bien: ✓ — mal: la respuesta se pone verde", "③ «{homeTabTalk}»: úsalo con el tutor IA"],
    ja: ["①「{planTitle}」から1つタップ", "自分の番：「{scriptSay}」を押して話す", "正しく言えたら★", "②「{keepTitle}」：▶「{studyMore}」", "合う言葉を選ぶ", "正解は✓、違うと正解が緑に", "③「{homeTabTalk}」：AIチューターと使う"],
    zh: ["①在「{planTitle}」里点一个", "轮到你：点「{scriptSay}」开口说", "说对了得★", "②「{keepTitle}」：▶「{studyMore}」", "选出合适的话", "对了✓，错了正确答案变绿", "③「{homeTabTalk}」：和AI导师用起来"],
    th: ["① แตะหนึ่งรายการใน “{planTitle}”", "ถึงตาคุณ: แตะ “{scriptSay}” แล้วพูด", "พูดถูกได้ ★", "② “{keepTitle}”: ▶ “{studyMore}”", "เลือกคำที่ถูก", "ถูก: ✓ — ผิด: คำตอบจะเป็นสีเขียว", "③ “{homeTabTalk}”: ลองใช้กับติวเตอร์ AI"],
    vi: ["① Chạm một mục trong “{planTitle}”", "Đến lượt bạn: chạm “{scriptSay}” rồi nói", "Nói đúng được ★", "② “{keepTitle}”: ▶ “{studyMore}”", "Chọn từ đúng", "Đúng: ✓ — sai: đáp án hiện màu xanh", "③ “{homeTabTalk}”: dùng với gia sư AI"],
    id: ["① Ketuk satu di “{planTitle}”", "Giliranmu: ketuk “{scriptSay}” lalu bicara", "Ucapkan benar dapat ★", "② “{keepTitle}”: ▶ “{studyMore}”", "Pilih kata yang tepat", "Benar: ✓ — salah: jawaban jadi hijau", "③ “{homeTabTalk}”: pakai bersama tutor AI"],
    hi: ["① “{planTitle}” में से एक पर टैप करें", "आपकी बारी: “{scriptSay}” दबाकर बोलें", "सही बोलें तो ★", "② “{keepTitle}”: ▶ “{studyMore}”", "सही शब्द चुनें", "सही: ✓ — गलत: सही उत्तर हरा", "③ “{homeTabTalk}”: AI ट्यूटर के साथ"],
    ar: ["① اضغط على واحد في «{planTitle}»", "دورك: اضغط «{scriptSay}» وتكلّم", "قلها صحيحة لتحصل على ★", "② «{keepTitle}»: ▶ «{studyMore}»", "اختر الكلمات الصحيحة", "صحيح: ✓ — خطأ: يظهر الجواب بالأخضر", "③ «{homeTabTalk}»: استخدمه مع المعلّم الذكي"],
    fr: ["① Touchez-en un dans « {planTitle} »", "À vous : touchez « {scriptSay} » et parlez", "Bien dit : ★", "② « {keepTitle} » : ▶ « {studyMore} »", "Choisissez les bons mots", "Juste : ✓ — faux : la réponse passe au vert", "③ « {homeTabTalk} » : avec le tuteur IA"],
    it: ["① Tocca uno in «{planTitle}»", "Tocca a te: premi «{scriptSay}» e parla", "Detto bene: ★", "② «{keepTitle}»: ▶ «{studyMore}»", "Scegli le parole giuste", "Giusto: ✓ — sbagliato: la risposta diventa verde", "③ «{homeTabTalk}»: usalo con il tutor IA"],
    pt: ["① Toque em um em “{planTitle}”", "Sua vez: toque em “{scriptSay}” e fale", "Falou certo: ★", "② “{keepTitle}”: ▶ “{studyMore}”", "Escolha as palavras certas", "Certo: ✓ — errado: a resposta fica verde", "③ “{homeTabTalk}”: use com o tutor de IA"],
    ru: ["① Нажмите на пункт в «{planTitle}»", "Ваша очередь: нажмите «{scriptSay}» и говорите", "Сказали верно — ★", "② «{keepTitle}»: ▶ «{studyMore}»", "Выберите нужные слова", "Верно: ✓ — неверно: ответ станет зелёным", "③ «{homeTabTalk}»: с ИИ-репетитором"],
  },
  "my-today": {
    ko: ["「{planTitle}」에서 하나를 눌러요", "내 차례에 「{scriptSay}」", "맞게 말하면 ★, 위 줄이 차요", "끝까지 말하면 「{scriptCompleted}」", "「{planTitle}」에 ✓"],
    en: ["Tap one in “{planTitle}”", "Your turn: “{scriptSay}”", "Say it right for ★ — the bar fills", "Finish for “{scriptCompleted}”", "“{planTitle}” gets a ✓"],
    es: ["Toca uno en «{planTitle}»", "Tu turno: «{scriptSay}»", "Dilo bien: ★ y la barra avanza", "Al terminar: «{scriptCompleted}»", "«{planTitle}» queda con ✓"],
    ja: ["「{planTitle}」から1つタップ", "自分の番は「{scriptSay}」", "正しく言えたら★、上のバーが進む", "最後まで言うと「{scriptCompleted}」", "「{planTitle}」に✓"],
    zh: ["在「{planTitle}」里点一个", "轮到你：「{scriptSay}」", "说对得★，上方进度增加", "说完显示「{scriptCompleted}」", "「{planTitle}」打上✓"],
    th: ["แตะหนึ่งรายการใน “{planTitle}”", "ถึงตาคุณ: “{scriptSay}”", "พูดถูกได้ ★ แถบด้านบนเพิ่มขึ้น", "พูดจนจบได้ “{scriptCompleted}”", "“{planTitle}” ขึ้น ✓"],
    vi: ["Chạm một mục trong “{planTitle}”", "Đến lượt bạn: “{scriptSay}”", "Nói đúng được ★, thanh phía trên tăng", "Nói hết sẽ “{scriptCompleted}”", "“{planTitle}” có dấu ✓"],
    id: ["Ketuk satu di “{planTitle}”", "Giliranmu: “{scriptSay}”", "Ucapkan dengan benar: ★, bilah di atas bertambah", "Selesaikan untuk “{scriptCompleted}”", "“{planTitle}” dapat ✓"],
    hi: ["“{planTitle}” में से एक पर टैप करें", "आपकी बारी: “{scriptSay}”", "सही बोलें तो ★, ऊपर की पट्टी बढ़ती है", "पूरा बोलने पर “{scriptCompleted}”", "“{planTitle}” पर ✓"],
    ar: ["اضغط على واحد في «{planTitle}»", "دورك: «{scriptSay}»", "قلها صحيحة: ★ ويتقدّم الشريط", "أكمل حتى النهاية: «{scriptCompleted}»", "تظهر ✓ في «{planTitle}»"],
    fr: ["Touchez-en un dans « {planTitle} »", "À vous : « {scriptSay} »", "Bien dit : ★ et la barre avance", "Allez au bout : « {scriptCompleted} »", "« {planTitle} » coché ✓"],
    it: ["Tocca uno in «{planTitle}»", "Tocca a te: «{scriptSay}»", "Detto bene: ★ e la barra avanza", "Arriva in fondo: «{scriptCompleted}»", "«{planTitle}» con ✓"],
    pt: ["Toque em um em “{planTitle}”", "Sua vez: “{scriptSay}”", "Falou certo: ★ e a barra avança", "Até o fim: “{scriptCompleted}”", "“{planTitle}” ganha ✓"],
    ru: ["Нажмите на один пункт в «{planTitle}»", "Ваша очередь: «{scriptSay}»", "Сказали верно — ★, полоса растёт", "До конца — «{scriptCompleted}»", "В «{planTitle}» появляется ✓"],
  },
  // My 큰 칸 "?" 설명 영상(2026-10-31, lib/guide/banks.ts CLIPS): Stagebank = 오늘 할 것 ▶ → 설명 → 퀴즈, Quizbank = 빈칸 → 답한 뒤 예문 → 다음 → ⚙.
  "bank-stage": {
    ko: ["「{planTitle}」: 지금 할 것 하나 ▶", "「{explanation}」: 뜻 · 구조 · 예문", "「{scriptNext}」 → 「{quizTag}」: 그 틀로 빈칸", "마지막은 「{homeTabTalk}」: 그 틀로 대답해요"],
    en: ["“{planTitle}”: one thing to do now ▶", "“{explanation}”: meaning · parts · examples", "“{scriptNext}” → “{quizTag}”: fill the gap", "Last, “{homeTabTalk}”: answer with the pattern"],
    es: ["«{planTitle}»: una cosa que hacer ahora ▶", "«{explanation}»: significado · partes · ejemplos", "«{scriptNext}» → «{quizTag}»: completa el hueco", "Al final, «{homeTabTalk}»: responde con el patrón"],
    ja: ["「{planTitle}」：今やることがひとつ ▶", "「{explanation}」：意味・構造・例文", "「{scriptNext}」→「{quizTag}」：その型で空欄", "最後は「{homeTabTalk}」：その型で答える"],
    zh: ["「{planTitle}」：现在要做的一件事 ▶", "「{explanation}」：意思 · 结构 · 例句", "「{scriptNext}」→「{quizTag}」：用这个句型填空", "最后「{homeTabTalk}」：用这个句型回答"],
    th: ["“{planTitle}”: สิ่งที่ต้องทำตอนนี้ ▶", "“{explanation}”: ความหมาย · โครงสร้าง · ตัวอย่าง", "“{scriptNext}” → “{quizTag}”: เติมช่องว่าง", "สุดท้าย “{homeTabTalk}”: ตอบด้วยแพตเทิร์นนั้น"],
    vi: ["“{planTitle}”: một việc cần làm ngay ▶", "“{explanation}”: nghĩa · cấu trúc · ví dụ", "“{scriptNext}” → “{quizTag}”: điền chỗ trống", "Cuối cùng “{homeTabTalk}”: trả lời bằng mẫu đó"],
    id: ["“{planTitle}”: satu hal untuk sekarang ▶", "“{explanation}”: arti · struktur · contoh", "“{scriptNext}” → “{quizTag}”: isi titik kosong", "Terakhir “{homeTabTalk}”: jawab dengan pola itu"],
    hi: ["“{planTitle}”: अभी का एक काम ▶", "“{explanation}”: अर्थ · ढाँचा · उदाहरण", "“{scriptNext}” → “{quizTag}”: खाली जगह भरें", "आख़िर में “{homeTabTalk}”: उसी ढाँचे से जवाब"],
    ar: ["«{planTitle}»: شيء واحد الآن ▶", "«{explanation}»: المعنى · البنية · أمثلة", "«{scriptNext}» ← «{quizTag}»: املأ الفراغ", "أخيرًا «{homeTabTalk}»: أجب بالقالب نفسه"],
    fr: ["« {planTitle} » : une chose à faire ▶", "« {explanation} » : sens · structure · exemples", "« {scriptNext} » → « {quizTag} » : complétez le trou", "Enfin « {homeTabTalk} » : répondez avec le modèle"],
    it: ["«{planTitle}»: una cosa da fare ▶", "«{explanation}»: significato · struttura · esempi", "«{scriptNext}» → «{quizTag}»: riempi il vuoto", "Infine «{homeTabTalk}»: rispondi con lo schema"],
    pt: ["“{planTitle}”: uma coisa para fazer ▶", "“{explanation}”: sentido · estrutura · exemplos", "“{scriptNext}” → “{quizTag}”: preencha a lacuna", "Por fim “{homeTabTalk}”: responda com o modelo"],
    ru: ["«{planTitle}»: одно дело на сейчас ▶", "«{explanation}»: смысл · структура · примеры", "«{scriptNext}» → «{quizTag}»: заполните пропуск", "В конце «{homeTabTalk}»: ответьте по шаблону"],
  },
  "bank-keep": {
    ko: ["「{keepTitle}」: 탭을 고르고 빈칸을 채워요", "답하면 뜻과 다른 예문", "「{scriptNext}」: 다음 문제", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: 어떤 낱말"],
    en: ["“{keepTitle}”: pick a tab, fill the gap", "After you answer: meaning and more examples", "“{scriptNext}”: the next question", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: which words"],
    es: ["«{keepTitle}»: elige pestaña y completa el hueco", "Al responder: significado y más ejemplos", "«{scriptNext}»: la siguiente pregunta", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: qué palabras"],
    ja: ["「{keepTitle}」：タブを選んで空欄を埋める", "答えると意味とほかの例文", "「{scriptNext}」：次の問題", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}：どの言葉"],
    zh: ["「{keepTitle}」：选标签，填空", "答完显示意思和更多例句", "「{scriptNext}」：下一题", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}：哪些词"],
    th: ["“{keepTitle}”: เลือกแท็บ เติมช่องว่าง", "ตอบแล้วเห็นความหมายและตัวอย่างอื่น", "“{scriptNext}”: ข้อถัดไป", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: คำไหน"],
    vi: ["“{keepTitle}”: chọn thẻ, điền chỗ trống", "Trả lời xong: nghĩa và thêm ví dụ", "“{scriptNext}”: câu tiếp theo", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: từ nào"],
    id: ["“{keepTitle}”: pilih tab, isi titik kosong", "Setelah menjawab: arti dan contoh lain", "“{scriptNext}”: soal berikutnya", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: kata yang mana"],
    hi: ["“{keepTitle}”: टैब चुनें, खाली जगह भरें", "जवाब के बाद अर्थ और और उदाहरण", "“{scriptNext}”: अगला सवाल", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: कौन-से शब्द"],
    ar: ["«{keepTitle}»: اختر تبويبًا واملأ الفراغ", "بعد الإجابة: المعنى وأمثلة أخرى", "«{scriptNext}»: السؤال التالي", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: أي كلمات"],
    fr: ["« {keepTitle} » : un onglet, un trou à compléter", "Après la réponse : sens et autres exemples", "« {scriptNext} » : question suivante", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic} : quels mots"],
    it: ["«{keepTitle}»: scegli una scheda, riempi il vuoto", "Dopo la risposta: significato e altri esempi", "«{scriptNext}»: domanda successiva", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: quali parole"],
    pt: ["“{keepTitle}”: escolha a aba, preencha a lacuna", "Depois de responder: sentido e mais exemplos", "“{scriptNext}”: próxima pergunta", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: quais palavras"],
    ru: ["«{keepTitle}»: выберите вкладку, заполните пропуск", "После ответа — значение и другие примеры", "«{scriptNext}»: следующий вопрос", "⚙ {vocabByStage} · {vocabByPos} · {vocabByTopic}: какие слова"],
  },
};

const copyAll = await loadCopy();
const PORT = 4530;
const server = await serve(PORT);
const browser = await chromium.launch({
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-audio-capture=${path.join(ROOT, "tmp/ux/voice.wav")}`],
});

for (const locale of locales) {
  const ui = copyAll[locale];
  const lines = CAPTIONS[clipName]?.[locale];
  if (!ui || !lines) throw new Error(`no captions for ${clipName}/${locale}`);
  const caption = (i) => lines[i].replace(/\{(\w+)\}/g, (_, key) => String(ui[key] ?? key).trim());
  const learn = learnFor(locale);
  state.uid = `simcheck-clip-${Date.now().toString(36)}-${locale}`;
  await api("/api/learner/self-check", { language: learn, stage: `${learn}-1` });

  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2, colorScheme: "dark" });
  await ctx.addInitScript(([learn, locale]) => {
    localStorage.setItem("appTargetLanguage", learn);
    localStorage.setItem("appUiLocale", locale);
    localStorage.setItem("whatsNewSeenVersion", "9.99");
    localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
    localStorage.setItem("myViewMode.stageShown", "1");
    // 누른 자리에 동그라미(영상에서 어디를 눌렀는지 보이게).
    window.addEventListener("mousedown", (e) => {
      const dot = document.createElement("div");
      dot.style.cssText = `position:fixed;left:${e.clientX - 20}px;top:${e.clientY - 20}px;width:40px;height:40px;border-radius:50%;background:rgba(255,214,10,.35);border:3px solid rgba(255,214,10,.95);z-index:2147483647;pointer-events:none;transition:opacity .9s ease-out,transform .9s ease-out`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => { dot.style.opacity = "0"; dot.style.transform = "scale(1.7)"; });
      setTimeout(() => dot.remove(), 1000);
    }, true);
  }, [learn, locale]);
  const page = await ctx.newPage();
  let sayNext = "";
  await page.route("**/api/roleplay/listen", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: sayNext }) }));

  // 녹화: 화면 프레임 + 빨리 감을 구간(채점 기다림) + 확대할 곳(focus).
  const frames = [];
  const fast = [];
  const focuses = [];
  const cdp = await ctx.newCDPSession(page);
  const work = path.join(ROOT, "tmp", "guide-clips", clipName, locale);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(path.join(work, "out"), { recursive: true });
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = path.join(work, `${String(frames.length).padStart(5, "0")}.jpg`);
    // 영상을 다 만든 뒤 늦게 온 프레임은 버린다(작업 폴더를 이미 지웠을 수 있음).
    try {
      fs.writeFileSync(file, Buffer.from(data, "base64"));
    } catch {
      return;
    }
    frames.push({ file, at: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  const now = () => page.evaluate(() => Date.now() / 1000);
  const wait = (ms) => page.waitForTimeout(ms);

  /** 고른 것들을 감싸는 상자(화면 좌표, CSS px). */
  const boxOf = async (...locators) => {
    let box = null;
    for (const locator of locators) {
      const one = await locator.boundingBox().catch(() => null);
      if (!one) continue;
      box = box
        ? { x: Math.min(box.x, one.x), y: Math.min(box.y, one.y), r: Math.max(box.r, one.x + one.width), b: Math.max(box.b, one.y + one.height) }
        : { x: one.x, y: one.y, r: one.x + one.width, b: one.y + one.height };
    }
    return box;
  };
  /** 자막을 그 상자 바로 아래(자리가 없으면 위)에 띄우고, 상자 + 자막을 확대한다. */
  const show = async (text, box, place = "below") => {
    // 화면 안 부분만, 긴 것(목록·카드)은 위쪽만 — 자막까지 4:5(최대 390×487) 안에 들어가게.
    const raw = box ?? { x: 0, y: 70, r: VW, b: 420 };
    const y = Math.max(56, raw.y);
    const area = { x: Math.max(0, raw.x), y, r: Math.min(VW, raw.r), b: Math.min(VH, raw.b, y + 340) };
    const below = place === "below" ? area.b + 76 < VH : area.y - 70 < 56;
    const top = below ? area.b + 12 : Math.max(8, area.y - 70);
    await page.evaluate(([text, rtl, top]) => {
      let cap = document.getElementById("__guide_cap");
      if (!cap) {
        cap = document.createElement("div");
        cap.id = "__guide_cap";
        cap.style.cssText = "position:fixed;left:14px;right:14px;z-index:2147483646;pointer-events:none;display:flex;justify-content:center;transition:opacity .3s";
        const pill = document.createElement("div");
        pill.style.cssText = "max-width:100%;padding:10px 16px;border-radius:16px;background:rgba(255,214,10,.97);color:#111;font:700 17px/1.3 -apple-system,'Noto Sans','Noto Sans CJK KR','Noto Sans Thai','Noto Sans Devanagari','Noto Sans Arabic',sans-serif;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.45)";
        cap.appendChild(pill);
        document.body.appendChild(cap);
      }
      cap.style.top = `${top}px`;
      cap.firstChild.dir = rtl ? "rtl" : "ltr";
      cap.style.opacity = "0";
      setTimeout(() => { cap.firstChild.textContent = text; cap.style.opacity = "1"; }, 150);
    }, [text, locale === "ar", top]);
    await wait(250);
    const pill = await page.locator("#__guide_cap > div").boundingBox().catch(() => null);
    const union = pill ? { x: Math.min(area.x, pill.x), y: Math.min(area.y, pill.y), r: Math.max(area.r, pill.x + pill.width), b: Math.max(area.b, pill.y + pill.height) } : area;
    focuses.push({ at: await now(), box: union });
  };
  const hide = () => page.evaluate(() => { const c = document.getElementById("__guide_cap"); if (c) c.style.opacity = "0"; });

  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  await wait(8000);
  const plan = page.locator("[data-today-plan]").first();
  const list = plan.locator("ul").first();
  const firstItem = list.locator("li button").first();
  const BANK = clipName.startsWith("bank-");
  if (!BANK) {
    await firstItem.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -60));
  } else {
    // 칸 머리가 화면 위쪽에 오게.
    await page.locator(clipName === "bank-keep" ? '[data-my-layer="keep"]' : '[data-my-layer="stage"]').first().evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => {});
    await page.evaluate(() => window.scrollBy(0, -70));
    await wait(clipName === "bank-keep" ? 6000 : 1500);
  }
  await wait(600);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await wait(300);
  const start = await now();

  const pack = await (await fetch(`${API}/api/curriculum/scripts?pack=1&lang=${learn}`, { headers: { "x-rc-user": state.uid } })).json();
  const script = (pack.scripts ?? []).filter((s) => s.stage === 1).sort((a, b) => (a.situation ?? 99) - (b.situation ?? 99))[0];
  const mine = script.lines.filter((l) => l.who === "me");
  const sheet = () => page.locator("div.fixed").last();
  const sayButton = () => page.locator("div.fixed button", { hasText: new RegExp(ui.scriptSay.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).last();
  const nextButton = () => page.locator("div.fixed button", { hasText: new RegExp(`^${ui.scriptNext}$`) }).last();
  const finished = () => sheet().innerText().then((t) => t.includes(ui.scriptCompleted)).catch(() => false);
  /** 내 차례까지(튜터 줄은 "다음"으로 넘김). 내 차례면 true. */
  const toMyTurn = async () => {
    for (let turn = 0; turn < 8; turn += 1) {
      for (let w = 0; w < 30 && !(await sayButton().count()) && !(await nextButton().count()) && !(await finished()); w += 1) await wait(300);
      if (await finished()) return false;
      if (await sayButton().count()) return true;
      if (await nextButton().count()) { await nextButton().click(); await wait(1000); continue; }
      return false;
    }
    return false;
  };
  /** 🎤 한 번(받아쓰기는 그 줄) — 채점 기다림은 빨리 감기. */
  const sayOnce = async () => {
    const k = (await page.locator("div.fixed ol li.justify-end").count()) - 1;
    sayNext = mine[Math.max(0, k)]?.text ?? "";
    await sayButton().click();
    const from = await now();
    await wait(1500);
    for (let w = 0; w < 40; w += 1) {
      const busy = await sheet().evaluate((el) => /…|\.\.\./.test(el.innerText.slice(-200))).catch(() => false);
      if (!busy && ((await sayButton().count()) || (await nextButton().count()) || (await finished()))) break;
      await wait(400);
    }
    fast.push([from + 0.4, (await now()) - 0.2]);
  };
  const lastMine = () => page.locator("div.fixed ol li.justify-end").last();
  const closeTop = () => page.locator("div.fixed button", { hasText: new RegExp(`^${ui.billingClose}$`) }).last().click({ timeout: 3000 }).catch(() => page.keyboard.press("Escape"));
  const closeX = async () => {
    const x = page.locator(`div.fixed button[aria-label="${ui.billingClose}"]`).filter({ hasText: "✕" }).last();
    if (await x.count()) await x.click({ timeout: 3000 }).catch(closeTop);
    else await closeTop();
  };
  let said = 0;

  if (BANK) {
    const answer = async (scope) => {
      const q = scope.locator("section[data-kind]").first();
      const kind = await q.getAttribute("data-kind").catch(() => null);
      if (kind === "choose") await q.locator("button.rounded-xl").first().click().catch(() => {});
      else if (kind === "type") {
        await q.locator("input").first().click().catch(() => {});
        await page.keyboard.type("the", { delay: 140 });
        await wait(500);
        await q.locator("input").first().press("Enter").catch(() => {});
      }
    };
    if (clipName === "bank-stage") {
      const stageBox = page.locator('[data-my-layer="stage"]').first();
      await show(caption(0), await boxOf(stageBox));
      await wait(3400);
      await page.locator("[data-today-current]").first().click();
      await hide();
      await wait(4500);
      await show(caption(1), { x: 0, y: 60, r: VW, b: 470 });
      await wait(3800);
      await hide();
      await page.evaluate(() => document.querySelectorAll("div.fixed .overflow-y-auto").forEach((el) => el.scrollBy({ top: 260, behavior: "smooth" })));
      await wait(2200);
      const next = page.locator("div.fixed button", { hasText: new RegExp(`^${ui.scriptNext}$`) }).last();
      await next.scrollIntoViewIfNeeded().catch(() => {});
      await next.click().catch(() => {});
      await wait(2500);
      const lesson = page.locator("div.fixed").last();
      await show(caption(2), await boxOf(lesson.locator("section[data-kind]").first()), "above");
      await wait(3400);
      await hide();
      await answer(lesson);
      await wait(3500);
      await show(caption(3), await boxOf(lesson.locator("section[data-kind]").first()), "above");
      await wait(3800);
      await hide();
    } else {
      const keep = page.locator('[data-my-layer="keep"]').first();
      await show(caption(0), await boxOf(keep));
      await wait(3600);
      await hide();
      await answer(keep);
      await wait(3000);
      await show(caption(1), await boxOf(keep.locator("section[data-kind]").first()), "above");
      await wait(4200);
      await hide();
      await keep.locator("section[data-kind] button").last().click().catch(() => {});
      await wait(2200);
      await show(caption(2), await boxOf(keep.locator("section[data-kind]").first()), "above");
      await wait(3200);
      await hide();
      await keep.locator('[data-quiz-settings="keep"]').first().click().catch(() => {});
      await wait(1800);
      await show(caption(3), { x: 0, y: 420, r: VW, b: VH }, "above");
      await wait(3800);
      await hide();
    }
  } else {
  // 장면 1: 일일 학습 목록에서 하나 고르기.
  await show(caption(0), await boxOf(list));
  await wait(3200);
  await firstItem.click();
  await hide();
  await wait(1800);

  // 장면 2: 내 차례 — 힌트 카드와 🎤만 크게, 누르고, 결과(★)를 보고, 설명.
  if (await toMyTurn()) {
    const turnBox = await boxOf(page.locator("div.fixed ol li").last(), sayButton());
    await show(caption(1), turnBox);
    await wait(3400);
    await sayOnce();
    said += 1;
    await hide();
    await wait(400);
    await focuses.push({ at: await now(), box: await boxOf(lastMine()) });
    await wait(1400);
    await show(caption(2), await boxOf(lastMine()));
    await wait(3600);
    await hide();
  }

  if (clipName === "flow") {
    await closeX();
    await wait(1400);
    // 장면 3: 지속 학습 카드 → ▶ 계속 공부.
    const keep = page.locator("[data-keep-learning]").first();
    await keep.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await wait(700);
    await show(caption(3), await boxOf(keep));
    await wait(3400);
    await keep.locator("[data-study-start]").first().click();
    await hide();
    // 퀴즈 창은 화면 위쪽부터 — 카드 자리(아래)를 확대한 채 빈 화면이 보이지 않게.
    focuses.push({ at: await now(), box: { x: 0, y: 56, r: VW, b: 520 } });
    await wait(2400);
    // 고르는 문제(고르기·뜻·듣기·틀린 곳)가 나올 때까지 — 순서·말하기는 한 번 눌러서는 결과가 안 보인다. 다시 여는 동안은 빨리 감기.
    for (let tries = 0; tries < 4; tries += 1) {
      const kind = await page.locator("[data-quiz] section[data-kind]").first().getAttribute("data-kind").catch(() => null);
      if (["choose", "meaning", "listen", "fix"].includes(kind ?? "")) break;
      const from = await now();
      await page.locator(`button[aria-label="${ui.billingClose}"]`).last().click({ timeout: 3000 }).catch(() => page.keyboard.press("Escape"));
      await wait(900);
      await keep.locator("[data-study-start]").first().click().catch(() => {});
      await wait(2200);
      fast.push([from, (await now()) - 0.1]);
    }
    // 장면 4: 문제 하나 — 고르고, 결과, 설명.
    const question = page.locator("[data-quiz] section").first();
    // 맞힌 답은 0.9초 뒤 다음 문제로 넘어간다(QuestionView) — 영상에서는 결과를 읽게 길게.
    await page.evaluate(() => {
      const original = window.setTimeout;
      window.setTimeout = (fn, ms, ...rest) => original(fn, ms === 900 ? 6500 : ms, ...rest);
    });
    await show(caption(4), await boxOf(question), "above");
    await wait(3400);
    const options = page.locator("[data-quiz] section button.rounded-xl");
    if (await options.count()) await options.nth(Math.min(1, (await options.count()) - 1)).click();
    await hide();
    await wait(1600);
    await show(caption(5), await boxOf(question), "above");
    await wait(3800);
    await hide();
    await page.locator(`button[aria-label="${ui.billingClose}"]`).last().click({ timeout: 3000 }).catch(() => page.keyboard.press("Escape"));
    await wait(1000);
    // 장면 5: 대화 탭의 AI 튜터 줄.
    await page.locator(`nav button[aria-label="${ui.homeTabTalk}"]`).first().click({ timeout: 5000 }).catch(() => page.goto(`http://localhost:${PORT}/?screen=talk`));
    await wait(1800);
    await show(caption(6), { x: 0, y: 80, r: VW, b: 250 });
    await wait(4200);
  } else {
    // my-today: 끝까지 말하고 → 완료 → 목록에 ✓.
    for (let i = 0; i < 12; i += 1) {
      if (!(await toMyTurn())) break;
      await sayOnce();
      said += 1;
      await wait(900);
    }
    await sheet().locator("ol").last().evaluate((el) => el.scrollTo({ top: el.scrollHeight })).catch(() => {});
    await wait(600);
    await show(caption(3), await boxOf(sheet().getByText(ui.scriptCompleted).first()));
    await wait(3800);
    await closeTop();
    await hide();
    await wait(1200);
    await show(caption(4), await boxOf(list));
    await wait(4000);
  }
  }
  const end = await now();
  if (process.env.CLIP_DEBUG) console.log(JSON.stringify(focuses.map((f) => ({ t: +(f.at - start).toFixed(1), ...f.box }))));
  await cdp.send("Page.stopScreencast").catch(() => {});

  // 시간: 채점 기다림만 5배로 빨리, 나머지는 실제 속도.
  const SPEED = 5;
  const shown = (t) => {
    let out = t - start;
    for (const [a, b] of fast) {
      if (t <= a) continue;
      out -= (Math.min(t, b) - a) * (1 - 1 / SPEED);
    }
    return out;
  };
  const kept = frames.filter((f) => f.at >= start && f.at <= end);
  // 확대: 장면마다 그 상자를 4:5로(너비 270~390 CSS px), 바뀔 때 0.7초 동안 부드럽게.
  const cropOf = (box) => {
    const pad = 14;
    const b = { x: box.x - pad, y: box.y - pad, r: box.r + pad, b: box.b + pad };
    let w = Math.min(VW, Math.max(270, b.r - b.x, (b.b - b.y) * 0.8));
    const h = w / 0.8;
    const cx = (b.x + b.r) / 2, cy = (b.y + b.b) / 2;
    return { x: Math.max(0, Math.min(VW - w, cx - w / 2)), y: Math.max(0, Math.min(VH - h, cy - h / 2)), w, h };
  };
  const FULL = cropOf({ x: 0, y: 60, r: VW, b: 60 + VW / 0.8 });
  const crops = focuses.map((f) => ({ at: f.at, crop: cropOf(f.box) }));
  const cropAt = (t) => {
    let prev = FULL, cur = FULL, since = -1;
    for (const one of crops) {
      if (one.at > t) break;
      prev = cur; cur = one.crop; since = one.at;
    }
    if (since < 0) return cur;
    const k = Math.min(1, (t - since) / 0.7);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    return { x: prev.x + (cur.x - prev.x) * e, y: prev.y + (cur.y - prev.y) * e, w: prev.w + (cur.w - prev.w) * e, h: prev.h + (cur.h - prev.h) * e };
  };
  // 고정 20fps로 다시 뽑는다: 화면이 멈춰 있는 동안엔 새 프레임이 안 오지만 확대는 움직여야 하니까.
  // 실제 시간을 한 칸씩(채점 기다림 안은 SPEED배 큰 칸) 가며 그때 화면 + 그때 확대.
  const FPS = 20;
  const inFast = (t) => fast.some(([a, b]) => t >= a && t < b);
  const plan2 = [];
  let at = 0;
  for (let t = start; t < end; t += (inFast(t) ? SPEED : 1) / FPS) {
    while (at + 1 < kept.length && kept[at + 1].at <= t) at += 1;
    plan2.push({ src: kept[at].file, out: path.join(work, "out", `${String(plan2.length).padStart(5, "0")}.jpg`), crop: cropAt(t) });
  }
  fs.writeFileSync(path.join(work, "plan.json"), JSON.stringify(plan2));
  execFileSync("python3", ["-c", `
import json,sys
from PIL import Image
plan=json.load(open(sys.argv[1])); cache={}
for p in plan:
    im=cache.get(p["src"]) or Image.open(p["src"]); cache.clear(); cache[p["src"]]=im
    s=im.width/${VW}
    c=p["crop"]; box=(round(c["x"]*s),round(c["y"]*s),round((c["x"]+c["w"])*s),round((c["y"]+c["h"])*s))
    im.crop(box).resize((600,750),Image.LANCZOS).save(p["out"],quality=90)
`, path.join(work, "plan.json")]);
  const outDir = path.join(ROOT, "public", "guide", locale);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${clipName}.mp4`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", path.join(work, "out", "%05d.jpg"),
    "-vf", "format=yuv420p", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-movflags", "+faststart", out]);
  console.log(`${locale} ${clipName}: ${kept.length}프레임 → ${shown(end).toFixed(1)}초, ${(fs.statSync(out).size / 1024).toFixed(0)}KB, 말한 줄 ${said}`);
  fs.rmSync(work, { recursive: true, force: true });
  await api("/api/simcheck/forget", {});
  await ctx.close();
}
await browser.close();
server.close();
