/**
 * The pictures for the "what's new" sheet, one set per interface language.
 *
 * The sheet shows a change in the learner's own interface language, so a
 * picture taken in Korean would contradict the text under it for everyone
 * else. This drives the built app through each changed flow once per
 * interface language, with a realistic line written in that language, and
 * saves the result where the server hands it out:
 *
 *   public/whats-new/<version>/<locale>/<shot>.webp
 *
 * Those files are served by the website and left out of the app bundle
 * (scripts/build-capacitor.mjs removes them), so the app downloads only the
 * set for its own language.
 *
 * It talks to the deployed API, so every run costs a chat line, a quick
 * question and a map per language. Each language uses its own test user so
 * the daily chat limit does not stop the run halfway.
 *
 * Needs www/ built (npm run build:capacitor), Playwright, and sharp.
 *
 * What each picture should show: PRODUCT.md, "대표 장면".
 *
 * Run: node --experimental-strip-types scripts/capture-whats-new.mjs 2.64 [--only ko,ar]
 *   PLAYWRIGHT_MODULE / CHROMIUM as for check:browser-languages.
 *   CAPTURE_RUN=2 starts from fresh test users, when today's run left data behind.
 *   CAPTURE_USER=<prefix> reuses earlier test users (<prefix>-<locale>), for
 *   pictures that need a history: a map, phrases in the ledger.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const VERSION = args[0];
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const PORT = Number(process.env.PORT || 4198);

if (!VERSION) {
  console.error("Usage: capture-whats-new.mjs <version> [--only ko,ar]");
  process.exit(2);
}
if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("www/ is not built. Run npm run build:capacitor first.");
  process.exit(2);
}

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const sharp = (await import("sharp")).default;

/** copy.ts imports through "@/", which Node cannot resolve; read it through a copy that does not. */
async function loadModules() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `capture-${Date.now()}.ts`);
  fs.writeFileSync(file, source);
  try {
    const { copy } = await import(`file://${file.replace(/\\/g, "/")}`);
    const { RELEASE_NOTES } = await import(`file://${path.join(ROOT, "src/lib/whatsNew.ts").replace(/\\/g, "/")}`);
    return { copy, RELEASE_NOTES };
  } finally {
    fs.rmSync(file, { force: true });
  }
}

const { copy, RELEASE_NOTES } = await loadModules();
// 말하는 방 화면 문구(copy.ts와 따로, src/lib/rooms/copy.ts) — 단계에서 버튼 이름을 찾는 데.
const { roomCopy: roomCopyFor } = await import(`file://${path.join(ROOT, "src/lib/rooms/copy.ts").replace(/\\/g, "/")}`);
const { teamCopy: teamCopyFor } = await import(`file://${path.join(ROOT, "src/lib/rooms/teamCopy.ts").replace(/\\/g, "/")}`);
const { inviteCopy: inviteCopyFor } = await import(`file://${path.join(ROOT, "src/lib/invite/copy.ts").replace(/\\/g, "/")}`);
const { askPhrase } = await import(`file://${path.join(ROOT, "src/lib/rooms/quote.ts").replace(/\\/g, "/")}`);
/**
 * `guide` instead of a version takes the pictures for the map's how-to
 * (src/lib/guide/content.ts, sections with a `shot`) into public/guide/<locale>/.
 * Run it with CAPTURE_RUN set to something new: the first picture is the empty
 * goal form, which only a learner without a map sees.
 *
 * `guide-video` takes the video tab's how-to pictures into the same folder.
 * The video is opened from a saved study session rather than prepared, so it
 * works where YouTube cannot be reached; the player, which would show
 * YouTube's "unavailable" there, is covered with the video's thumbnail.
 */
const GUIDE_VIDEO = VERSION === "guide-video";
// `guide-chat` and `guide-vocab`: the chat and vocabulary tabs' how-to, every
// detail a learner can reach (a corrected line, the expression card, meaning,
// the sentence sheet, saving a word, the menu, history; search, saved words,
// hidden meanings, the characters tab). Each language spends two chat lines.
const GUIDE_CHAT = VERSION === "guide-chat";
const GUIDE_VOCAB = VERSION === "guide-vocab";
// `guide-call`: the call tab's how-to — today's pack on the door, the pack
// call under way, a finished call read back, saying a sentence of your own.
// The English interface learns Japanese here, the only other pack language.
const GUIDE_CALL = VERSION === "guide-call";
// `guide-social`: 사람·게시판·단체방·방 목록 사용법 그림(예전엔 2.69 새로워진 점 캡처를 r69-*로 복사했다).
// 하단 탭이 대화·영상·사람·Room·My로 바뀐 뒤(2026-10-20) 새로 찍는다. 방 안 화면(묻기·보는 방식·힌트·방장)은 전체 화면이라 그대로.
const GUIDE_SOCIAL = VERSION === "guide-social";
const GUIDE_SOCIAL_ITEMS = [
  { shot: "r69-people", step: "people" },
  { shot: "r69-board", step: "board" },
  { shot: "r69-groups", step: "groups" },
  { shot: "r69-free", step: "freetalk" },
  // 2.70: 대화 목록(맨 위 AI 튜터)과 친구 초대 보상 카드.
  { shot: "talk-list" },
  { shot: "invite-rewards" },
];
const GUIDE = VERSION === "guide" || GUIDE_VIDEO || GUIDE_CHAT || GUIDE_VOCAB || GUIDE_CALL || GUIDE_SOCIAL;
const GUIDE_ITEMS = [
  // 2.71: My 첫 화면 맨 위 "이런 대화, 할 수 있어요?"(단계 고르기, 사용법 my.start).
  { shot: "stage-start" },
  { shot: "goal" },
  { shot: "next" },
  { shot: "growth" },
  { shot: "graph" },
  { shot: "element" },
  { shot: "myask" },
  { shot: "mapview" },
  { shot: "chatnext" },
];
const GUIDE_VIDEO_ITEMS = [
  { shot: "video-library" },
  { shot: "video-study" },
  { shot: "video-bar" },
  // 끌어서 고르는 동작은 짧은 영상으로도(public/guide/<locale>/video-ask.mp4, 2026-10-20).
  { shot: "video-ask", clip: true },
];
const GUIDE_CHAT_ITEMS = [
  // 2.71: 고친 문장은 눌러서 보기(칩). 옛 빌드 사용법(chatBefore271.json)은 chat-correct 그림을 그대로 쓴다.
  { shot: "chat-fix" },
  { shot: "chat-expression" },
  { shot: "chat-reading" },
  { shot: "chat-ask", clip: true },
  { shot: "chat-word" },
  { shot: "chat-menu" },
  { shot: "chat-history" },
];
const GUIDE_CALL_ITEMS = [
  { shot: "call-pack" },
  { shot: "call-talk" },
  { shot: "call-review" },
  { shot: "call-ownline" },
];
const GUIDE_VOCAB_ITEMS = [
  { shot: "vocab-search" },
  { shot: "vocab-saved" },
  { shot: "vocab-hide" },
  { shot: "vocab-characters" },
];
// `store-my` and `store-tabs`: full-screen pictures of every tab's details for
// the Play listing, saved uncropped as PNG to tmp/store-raw/<locale>/ and framed
// with headlines by store-shots/compose-tabs.mjs. Two runs because a free test
// user has ten chat lines a day: store-my (My, map, missions, weak spots,
// growth; eight lines) and store-tabs (chat details, links, pick, call, video,
// vocabulary; three lines). Run each with its own CAPTURE_RUN.
const STORE_MY = VERSION === "store-my";
const STORE_TABS = VERSION === "store-tabs";
const STORE = STORE_MY || STORE_TABS;
const STORE_MY_ITEMS = [
  // The map, missions and weak spots sit in My's map view; growth in the network
  // view. The mission step draws the map when there is none yet.
  // 2.71: 지도가 없을 때 맨 위 "이런 대화, 할 수 있어요?"(대화 예시로 시작 단계 고르기).
  { shot: "stage-start" },
  { shot: "view-map", save: false },
  { shot: "mission" },
  { shot: "progress" },
  { shot: "ledger" },
  { shot: "weak" },
  { shot: "view-net", save: false },
  { shot: "growth" },
  { shot: "element" },
  { shot: "myask" },
  { shot: "mapview" },
  // 2.73: 노트 "오늘의 학습"(고정 응답으로 후보만 바꿔 끼움 — 맨 끝에).
  { shot: "notebook-today" },
];
const STORE_TABS_ITEMS = [
  // 2.71: 고친 문장은 눌러서 보는 칩. chat-correct와 같은 장면이라 그 뒤에 한 번 더 찍지 않고 칩을 연 모습도 남긴다.
  { shot: "chat-correct" },
  { shot: "chat-fix-open" },
  { shot: "chat-expression" },
  { shot: "chat-ask" },
  { shot: "chat-word" },
  { shot: "ledger", save: false },
  { shot: "links" },
  { shot: "pick" },
  { shot: "meant" },
  { shot: "calltools" },
  // 오늘의 팩 통화(가짜 마이크: CAPTURE_MIC_WAV).
  { shot: "call-ownline" },
  // 오늘의 팩은 영어·일본어 학습만 있다(pack/questions.ts) — 영어 앱(스페인어 학습)은 팩이 없어 거기서 멈춘다.
  { shot: "call-pack" },
  { shot: "call-talk" },
  { shot: "video-study" },
  { shot: "video-bar", save: false },
  { shot: "video-ask" },
  { shot: "vocab-search" },
  // 사람과 학습(2.68~2.69): 사람·초대·단체방·Room(자유 대화·줄 번역·채팅 위주·작게 접기·💡 힌트·방장).
  // 방·메시지는 고정 응답, 번역·힌트만 운영. 고정 응답이 /api를 가로채니 맨 끝에. 힌트는 CAPTURE_MIC_WAV가 필요.
  { shot: "people" },
  // 2.72~2.73: 언어 칩으로 거른 목록·프로필 칩·아이콘 묶음.
  { shot: "people-lang" },
  { shot: "profile-facts" },
  { shot: "icons" },
  { shot: "invite" },
  { shot: "groups" },
  { shot: "group-pick" },
  { shot: "freetalk" },
  { shot: "quote" },
  { shot: "layouts" },
  { shot: "rooms-mini" },
  // 2.72: Room 라이어 게임 판.
  { shot: "room-game" },
  { shot: "host" },
  { shot: "account" },
];
// `promo-people`: 홍보 쇼츠용 녹화(사용자끼리 주고받는 장면). 사진 대신 Chrome 화면 전송으로 2배 해상도 영상을 남긴다
// → tmp/promo/people/<locale>/raw.mp4 + events.json, 편집은 store-shots/promo/make.mjs people <locale>.
// 상대(Yuki·Lucía·Omar)는 고정 응답이고 말은 한 줄씩 올라온다. 번역·💡 힌트는 운영. CAPTURE_MIC_WAV가 필요.
// `promo-room`: Room 하나만(입장 → 실시간 자막 → 줄 번역 → 💡 힌트 → 보내기), 15초 쇼츠용.
// `promo-invite`: 친구 초대 → 친구가 받은 초대 → 함께 쓰는 팀 워크스페이스.
const PROMO = VERSION === "promo-people" || VERSION === "promo-room" || VERSION === "promo-invite";
const PROMO_NAME = VERSION.replace(/^promo-/, "");
const note = PROMO
  ? { version: "promo", items: [{ shot: VERSION, save: false }] }
  : STORE_MY
  ? { version: "store", items: STORE_MY_ITEMS }
  : STORE_TABS
  ? { version: "store", items: STORE_TABS_ITEMS }
  : GUIDE_CHAT
  ? { version: "guide", items: GUIDE_CHAT_ITEMS }
  : GUIDE_VOCAB
  ? { version: "guide", items: GUIDE_VOCAB_ITEMS }
  : GUIDE_CALL
  ? { version: "guide", items: GUIDE_CALL_ITEMS }
  : GUIDE_VIDEO
  ? { version: "guide", items: GUIDE_VIDEO_ITEMS }
  : GUIDE_SOCIAL
  ? { version: "guide", items: GUIDE_SOCIAL_ITEMS }
  : GUIDE ? { version: "guide", items: GUIDE_ITEMS } : RELEASE_NOTES.find((entry) => entry.version === VERSION);
if (!note) {
  console.error(`No release note for ${VERSION} in src/lib/whatsNew.ts.`);
  process.exit(2);
}

/**
 * A saved study session for the video pictures: a clip from this month's
 * library and lines that fit it, in the language being learned.
 */
const VIDEO_SESSION = {
  en: {
    videoId: "e7S8jWh6AEs",
    summary: "A short animated lesson on the paradox of value: why water, which we need to live, costs so little while diamonds cost so much.",
    lines: [
      "Why is water so cheap when we can't live without it?",
      "And why do diamonds cost a fortune when we don't really need them?",
      "Economists call this puzzle the paradox of value.",
      "The answer has to do with how much of something we already have.",
    ],
  },
  es: {
    videoId: "GLkkwbsPWEA",
    summary: "Una lección animada sobre por qué cuesta tanto dejar un mal hábito y cómo el cerebro aprende las rutinas.",
    lines: [
      "¿Alguna vez has intentado dejar de morderte las uñas?",
      "Miles de millones de personas luchan contra ese hábito.",
      "El problema es que el cerebro aprende las rutinas sin que nos demos cuenta.",
      "Por eso, romperlas exige algo más que fuerza de voluntad.",
    ],
  },
  ja: {
    videoId: "cS8oEgJ9CXU",
    summary: "悪い癖をやめるのが難しい理由と、脳が習慣を覚える仕組みを紹介する短いアニメ授業。",
    lines: [
      "爪をかむ癖をやめようとしたことはありますか？",
      "世界中で何十億人もの人が、悪い癖に悩んでいます。",
      "問題は、脳が気づかないうちに習慣を覚えてしまうことです。",
      "だから、やめるには意志の力だけでは足りないのです。",
    ],
  },
  zh: {
    videoId: "pamsHFJzKvo",
    summary: "一节简短的动画课：为什么改掉坏习惯这么难，大脑又是怎样学会习惯的。",
    lines: [
      "你有没有试过改掉咬指甲的习惯？",
      "全世界有几十亿人都在和坏习惯作斗争。",
      "问题在于，大脑会在我们不知不觉中学会这些习惯。",
      "所以，要改掉它们，光靠意志力是不够的。",
    ],
  },
  ko: {
    videoId: "xkGCgVqAwSo",
    summary: "베어링이 어떻게 마찰을 줄여 기계를 부드럽게 돌게 하는지 보여 주는 짧은 애니메이션 강의.",
    lines: [
      "바퀴가 처음 발명됐을 때 가장 큰 문제는 마찰이었어요.",
      "두 표면이 맞닿아 미끄러지면 열이 나고 금방 닳아요.",
      "베어링은 그 사이에 작은 공을 넣어 굴러가게 만들어요.",
      "덕분에 자전거부터 비행기까지 훨씬 부드럽게 움직여요.",
    ],
  },
};

/** A line with one everyday mistake, in the language being learned. */
const SLIPPED_LINE = {
  en: "Yesterday I go to the beach with my friends and we swim a lot.",
  es: "Ayer yo voy a la playa con mis amigos y nadamos mucho.",
  ja: "昨日、友達と海に行くて、たくさん泳ぎました。",
  zh: "昨天我跟朋友去海边，我们游泳了很多。",
  ko: "어제 친구들이랑 바다에 가요. 그리고 수영을 많이 해요.",
};

/** "give up", typed in each interface language: the vocabulary search goes from your language. */
const VOCAB_QUERY = {
  ko: "포기하다", en: "give up", es: "rendirse", ja: "諦める", zh: "放弃", vi: "từ bỏ", fr: "abandonner",
  it: "rinunciare", pt: "desistir", ru: "сдаваться", id: "menyerah", ar: "يستسلم", th: "ยอมแพ้", hi: "हार मानना",
};

/** Something a learner might really write when stuck, in each interface language. */
const STUCK_LINE = {
  ko: "주말에 친구랑 약속 있었는데 바람맞았어",
  en: "I had plans with a friend this weekend but they stood me up",
  es: "Tenía planes con un amigo el fin de semana, pero me dejó plantado",
  ja: "週末に友達と約束してたのに、すっぽかされちゃった",
  zh: "周末跟朋友约好了，结果被放鸽子了",
  vi: "Cuối tuần mình có hẹn với bạn mà bị cho leo cây",
  fr: "J'avais prévu de voir un ami ce week-end, mais il m'a posé un lapin",
  it: "Avevo un appuntamento con un amico nel weekend, ma mi ha dato buca",
  pt: "Eu tinha combinado com um amigo no fim de semana, mas ele me deu um bolo",
  ru: "На выходных договорился встретиться с другом, а он меня продинамил",
  id: "Akhir pekan aku ada janji sama teman, tapi dia nggak datang",
  ar: "كان عندي موعد مع صديق في عطلة نهاية الأسبوع، لكنه لم يأتِ",
  th: "สุดสัปดาห์นัดเพื่อนไว้ แต่โดนเทซะงั้น",
  hi: "वीकेंड पर दोस्त के साथ प्लान था, पर वो आया ही नहीं",
};

/** A goal for the study map, in each interface language. */
const GOAL = {
  ko: "해외 출장에서 회의 끝나고 동료들과 저녁 먹으면서 자연스럽게 스몰토크하고 싶어요",
  en: "I want to make easy small talk with colleagues over dinner on a business trip",
  es: "Quiero charlar con naturalidad con mis colegas durante la cena en un viaje de trabajo",
  ja: "海外出張で、会議のあと同僚と夕食をとりながら自然に雑談したい",
  zh: "出差时想在会后和同事吃晚饭时自然地闲聊",
  vi: "Tôi muốn nói chuyện tự nhiên với đồng nghiệp trong bữa tối khi đi công tác nước ngoài",
  fr: "Je veux bavarder naturellement avec mes collègues au dîner pendant un voyage d'affaires",
  it: "Voglio chiacchierare in modo naturale con i colleghi a cena durante un viaggio di lavoro",
  pt: "Quero conversar naturalmente com colegas no jantar durante uma viagem de negócios",
  ru: "Хочу непринуждённо болтать с коллегами за ужином в командировке",
  id: "Saya ingin ngobrol santai dengan rekan kerja saat makan malam di perjalanan dinas",
  ar: "أريد أن أتحدث بشكل طبيعي مع زملائي على العشاء خلال رحلة عمل",
  th: "อยากคุยเล่นกับเพื่อนร่วมงานได้อย่างเป็นธรรมชาติตอนกินข้าวเย็นระหว่างไปทำงานต่างประเทศ",
  hi: "बिज़नेस ट्रिप पर डिनर के दौरान सहकर्मियों से सहज होकर बातचीत करना चाहता हूँ",
};

/**
 * The same kind of mistake twice, in the language being learned (English, or
 * Spanish for the English interface), so the map takes it in as a weak spot.
 */
const REPEATED_MISTAKE = {
  en: ["Yesterday I go to the office early and eat breakfast there.", "Last weekend I meet my friends and we watch a movie."],
  // One kind of mistake only (ser for estar); "Ayer yo soy…" also changed the
  // tense and was read as a different kind.
  es: ["Hoy yo soy muy cansado después del trabajo.", "Mi hermana es enferma desde el lunes.", "Ahora yo soy muy contento con mi trabajo."],
  // 조사 하나(に会う → を会う)만 틀린다.
  ja: ["昨日、駅で友達を会いました。", "週末、先生を会って少し話しました。", "明日、母を会う予定です。"],
  // 양사 하나(个)만 틀린다.
  zh: ["我昨天买了一个书。", "她家有三个猫。", "我想喝一个咖啡。"],
  // 목적격 조사(을/를 → 이/가) 하나만 틀린다.
  ko: ["저는 아침마다 커피가 마셔요.", "어제 친구랑 영화가 봤어요.", "주말에 책이 읽었어요."],
};

/** A call already had, read back, with one sentence rebuilt into what was meant. */
const PAST_CALL = {
  ja: [
    { who: "tutor", text: "やあ！週末はどうだった？" },
    { who: "learner", text: "昨日カフェ行くとコーヒーたくさん飲むした", meant: "昨日カフェに行って、コーヒーをたくさん飲んだ。" },
    { who: "tutor", text: "いいね！どのカフェに行ったの？" },
    { who: "learner", text: "会社の近くの新しいところ。" },
    { who: "tutor", text: "そこ、評判いいよね。混んでた？" },
    { who: "learner", text: "はい、とても混む。長い待った", better: "うん、すごく混んでた。長く待ったよ。" },
    { who: "tutor", text: "おいしいコーヒーのためならしかたないね！" },
  ],
  en: [
    { who: "tutor", text: "Hi! How was your weekend?" },
    { who: "learner", text: "I am go cafe yesterday and drink coffee much", meant: "I went to a cafe yesterday and drank a lot of coffee." },
    { who: "tutor", text: "Oh, nice! Which cafe did you go to?" },
    { who: "learner", text: "The new one near my office." },
    { who: "tutor", text: "I've heard good things about it. Was it busy?" },
    { who: "learner", text: "Yes, very busy. I wait long time", better: "Yes, it was very busy. I waited a long time." },
    { who: "tutor", text: "That's the price of a good coffee!" },
  ],
  es: [
    { who: "tutor", text: "¡Hola! ¿Qué tal tu fin de semana?" },
    { who: "learner", text: "Ayer yo ir café y tomar mucho café", meant: "Ayer fui a una cafetería y tomé mucho café." },
    { who: "tutor", text: "¡Qué bien! ¿A qué cafetería fuiste?" },
    { who: "learner", text: "La nueva cerca de mi oficina." },
    { who: "tutor", text: "Me han hablado bien de ella. ¿Había mucha gente?" },
    { who: "learner", text: "Sí, mucha gente. Yo esperé mucho tiempo", better: "Sí, había mucha gente. Esperé mucho tiempo." },
    { who: "tutor", text: "¡Es el precio de un buen café!" },
  ],
  zh: [
    { who: "tutor", text: "嗨！周末过得怎么样？" },
    { who: "learner", text: "昨天我去咖啡店喝很多咖啡了", meant: "昨天我去了咖啡店，喝了很多咖啡。" },
    { who: "tutor", text: "不错！你去的是哪家咖啡店？" },
    { who: "learner", text: "我公司附近新开的那家。" },
    { who: "tutor", text: "听说那家挺不错的。人多吗？" },
    { who: "learner", text: "对，人很多。我等很长时间", better: "对，人特别多。我等了很长时间。" },
    { who: "tutor", text: "好咖啡就是值得等嘛！" },
  ],
  ko: [
    { who: "tutor", text: "안녕! 주말 어떻게 보냈어?" },
    { who: "learner", text: "어제 카페 가요 커피 많이 마셔요", meant: "어제 카페에 가서 커피를 많이 마셨어요." },
    { who: "tutor", text: "좋다! 어느 카페에 갔어?" },
    { who: "learner", text: "회사 근처에 새로 생긴 곳이요." },
    { who: "tutor", text: "거기 괜찮다고 들었어. 사람 많았어?" },
    { who: "learner", text: "네, 사람 아주 많아요. 오래 기다려요", better: "네, 사람이 정말 많았어요. 오래 기다렸어요." },
    { who: "tutor", text: "맛있는 커피를 위해서라면 어쩔 수 없지!" },
  ],
};

/**
 * Phrases the ledger already holds before a picture of "My phrases" is taken,
 * and where each was met, so the sheet shows more than one source.
 */
const LEDGER_SEED = {
  en: [["catch up", "video"], ["on the same page", "vocab"], ["make it up to you", "chat"], ["no worries", "roleplay"], ["stood me up", "video"]],
  es: [["ponerse al día", "video"], ["estar en la misma onda", "vocab"], ["no pasa nada", "roleplay"], ["me dejó plantado", "video"]],
  ja: [["久しぶり", "video"], ["気が合う", "vocab"], ["埋め合わせする", "chat"], ["気にしないで", "roleplay"], ["すっぽかされた", "video"]],
  zh: [["好久不见", "video"], ["想到一块儿去了", "vocab"], ["补偿你", "chat"], ["没关系", "roleplay"], ["放我鸽子", "video"]],
  ko: [["오랜만이야", "video"], ["말이 잘 통하다", "vocab"], ["다음에 꼭 갚을게", "chat"], ["괜찮아", "roleplay"], ["바람맞았어", "video"]],
};

/** A line using a phrase met in a video, so the chat says where it came from. */
const LINK_LINE = {
  en: "My friend stood me up again last night, so I had dinner alone.",
  es: "Mi amigo me dejó plantado otra vez anoche y cené solo.",
  ja: "昨日の夜、また友達にすっぽかされたから、一人で晩ご飯を食べた。",
  zh: "昨晚朋友又放我鸽子了，所以我一个人吃了晚饭。",
  ko: "어젯밤에 친구한테 또 바람맞았어. 그래서 혼자 저녁 먹었어.",
};

/** Lines with nothing to correct, so the My tab's network has grown a little. */
const CLEAN_LINES = {
  en: ["I usually walk to work when the weather is nice.", "We had dinner at a small Italian place last night.", "Could you send me the file before the meeting?"],
  es: ["Normalmente voy andando al trabajo cuando hace buen tiempo.", "Anoche cenamos en un restaurante italiano pequeño.", "¿Me puedes mandar el archivo antes de la reunión?"],
  ja: ["天気がいい日は、たいてい歩いて会社に行きます。", "昨日の夜、小さなイタリアンのお店で晩ご飯を食べました。", "会議の前にファイルを送ってもらえますか？"],
  zh: ["天气好的时候，我一般走路去上班。", "昨天晚上我们在一家小意大利餐厅吃了晚饭。", "你能在开会前把文件发给我吗？"],
  ko: ["날씨가 좋으면 보통 걸어서 출근해요.", "어젯밤에 작은 이탈리안 식당에서 저녁을 먹었어요.", "회의 전에 파일 좀 보내 줄 수 있어요?"],
};

/** "Try saying:", for the help shown when a learner was stuck in a call. */
/** A sentence typed into "say a sentence of your own", in the language learned. */
const OWN_LINE = { en: "Could you say that one more time, please?", ja: "もう一度言ってもらえますか？", es: "¿Me lo puedes repetir, por favor?", zh: "你能再说一遍吗？", ko: "한 번만 더 말해 줄 수 있어요?" };

const TIP_LEAD = {
  ko: "이렇게 말해 보세요:", en: "Try saying:", es: "Prueba a decir:", ja: "こう言ってみましょう:", zh: "可以这样说：",
  vi: "Thử nói:", fr: "Essayez de dire :", it: "Prova a dire:", pt: "Tente dizer:", ru: "Попробуйте сказать:",
  id: "Coba katakan:", ar: "جرّب أن تقول:", th: "ลองพูดว่า:", hi: "ऐसे बोलकर देखें:",
};

/** An answer with one slip in it, so the check has something to correct. */
function withSlip(answer) {
  const swaps = [[/\bI am\b/, "I is"], [/\bis\b/, "are"], [/\bwent\b/, "go"], [/\bestá\b/, "es"], [/\bsoy\b/, "estoy"], [/\bfui\b/, "voy"]];
  for (const [from, to] of swaps) if (from.test(answer)) return answer.replace(from, to);
  const words = answer.split(" ");
  return words.length > 3 ? [...words.slice(0, 1), ...words.slice(2)].join(" ") : answer;
}

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    try {
      const upstream = await fetch(API + req.url, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      res.writeHead(upstream.status, { "content-type": upstream.headers.get("content-type") || "application/octet-stream" });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502);
      res.end();
    }
    return;
  }
  let file = path.join(WWW, decodeURIComponent(req.url.split("?")[0]));
  if (file.endsWith(path.sep)) file += "index.html";
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
const BASE = `http://127.0.0.1:${PORT}`;

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactly = (text) => new RegExp(`^${escape(text)}$`);

/**
 * How to reach each picture. Keyed by the `shot` names release notes use; a
 * release that needs a new picture adds a step here.
 */

/**
 * 말하는 방·메시지·계정 장면(2.68). 사람끼리 하는 기능이라 실제 사람을 부를 수 없어
 * /api/rooms·/api/social·/api/dm·/api/account/me를 고정 응답으로 바꿔 찍는다
 * (번역·표현만 운영 API). 얼굴은 사진 대신 색 원(실제 사람 얼굴이 아님).
 */
const FACE = (a, b) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/></svg>`,
  );
const PEOPLE = {
  me: { id: "lb_" + "1".repeat(24), nickname: "Minji", photo: FACE("#7c3aed", "#f59e0b") },
  yuki: { id: "lb_" + "2".repeat(24), nickname: "Yuki", photo: FACE("#0ea5e9", "#22c55e") },
  omar: { id: "lb_" + "3".repeat(24), nickname: "Omar", photo: FACE("#f43f5e", "#fb923c") },
  lucia: { id: "lb_" + "4".repeat(24), nickname: "Lucía", photo: FACE("#14b8a6", "#6366f1") },
};
const ROOM_LINES = {
  en: [
    ["yuki", "I went to Kyoto last weekend. The temples were beautiful."],
    ["lucia", "Nice! Did you try any local food?"],
    ["yuki", "Yes, I had matcha ice cream. It was so good."],
    ["omar", "I want to go to Japan someday.", "text"],
  ],
  es: [
    ["yuki", "El fin de semana pasado fui a Kioto. Los templos eran preciosos."],
    ["lucia", "¡Qué bien! ¿Probaste la comida local?"],
    ["yuki", "Sí, tomé helado de matcha. Estaba buenísimo."],
    ["omar", "Algún día quiero ir a Japón.", "text"],
  ],
  ja: [
    ["yuki", "先週末、京都に行ったんです。お寺がすごくきれいでした。"],
    ["lucia", "いいですね！地元の料理は食べましたか？"],
    ["yuki", "はい、抹茶アイスを食べました。本当においしかったです。"],
    ["omar", "いつか日本に行ってみたいです。", "text"],
  ],
  zh: [
    ["yuki", "上个周末我去了京都，寺庙特别漂亮。"],
    ["lucia", "真好！你尝了当地的美食吗？"],
    ["yuki", "尝了，我吃了抹茶冰淇淋，特别好吃。"],
    ["omar", "我也想有一天去日本。", "text"],
  ],
  ko: [
    ["yuki", "지난 주말에 교토에 갔어요. 절이 정말 예뻤어요."],
    ["lucia", "좋네요! 현지 음식도 먹어 봤어요?"],
    ["yuki", "네, 말차 아이스크림을 먹었어요. 진짜 맛있었어요."],
    ["omar", "언젠가 일본에 가 보고 싶어요.", "text"],
  ],
};
// 2.69 힌트 장면: 상대가 나이를 묻고, 나는 편한 말로 "어.. 스물둘.."(받아쓰기는 고정 응답, 힌트는 운영 /api/chat).
const HINT_QUESTION = { en: "How old are you?", es: "¿Cuántos años tienes?", ja: "何歳ですか？", zh: "你多大了？", ko: "몇 살이에요?" };
const HINT_FRAGMENT = {
  ko: "어.. 스물둘..", en: "uh... I'm twenty-two", es: "eh… veintidós", ja: "えっと…にじゅうに", zh: "呃…二十二", vi: "ờ… hai mươi hai", fr: "euh… vingt-deux",
  it: "ehm… ventidue", pt: "é… vinte e dois", ru: "э-э… двадцать два", id: "eh… dua puluh dua", ar: "اممم… اثنان وعشرون", th: "อืม... ยี่สิบสอง", hi: "उम्म… बाईस",
};
// 2.69 단체방 장면: 이름과 글(학습 언어).
const GROUP_LINES = {
  en: { name: "Study buddies ☕", a: "Who wants to practice tonight?", b: "Me! After dinner works for me.", c: "Let’s call at 9." },
  es: { name: "Compañeros ☕", a: "¿Quién quiere practicar esta noche?", b: "¡Yo! Después de cenar me va bien.", c: "Llamamos a las nueve." },
  ja: { name: "勉強仲間 ☕", a: "今夜、練習したい人いる？", b: "はい！晩ご飯のあとなら大丈夫です。", c: "9時に通話しよう。" },
  zh: { name: "学习搭子 ☕", a: "今晚谁想一起练习？", b: "我！吃完晚饭以后可以。", c: "九点打电话吧。" },
  ko: { name: "공부 친구들 ☕", a: "오늘 밤에 같이 연습할 사람?", b: "저요! 저녁 먹고 나서 괜찮아요.", c: "9시에 통화해요." },
};
const DM_LINES = {
  en: { hi: "Hi! Thanks for the chat in the room.", reply: "It was fun! Do you want to practice again tomorrow?" },
  es: { hi: "¡Hola! Gracias por la charla en la sala.", reply: "¡Fue divertido! ¿Practicamos otra vez mañana?" },
  ja: { hi: "こんにちは！ルームでの会話、ありがとうございました。", reply: "楽しかったです！明日もまた練習しませんか？" },
  zh: { hi: "你好！谢谢你在房间里跟我聊天。", reply: "很开心！明天还要一起练习吗？" },
  ko: { hi: "안녕하세요! 방에서 같이 얘기해 줘서 고마워요.", reply: "재밌었어요! 내일 또 연습할래요?" },
};
// 2.69 노트 장면: 쌓인 표현(장부, 고정 응답)·단어장 한 개·문장분석 질문 하나, 자리는 미리 정해 둠(서버 안 부름).
// 2.74 단계 보기 장면: 습득한 표현 6개(1단계 문법 셋·2단계 하나·정해진 말·관용구) + 고친 장면 하나.
const STAGE_PHRASES = {
  en: ["My sister is a nurse", "She works from home", "Do you like coffee?", "I went to the beach", "Nice to meet you", "break the ice", ["I has two cats", "I have two cats"]],
  es: ["Soy de Corea", "Me llamo Jun", "¿Dónde vives?", "Ayer fui al cine", "Mucho gusto", "echar de menos", ["Yo es estudiante", "Yo soy estudiante"]],
};
// 2.73 오늘의 학습 장면: 배우는 언어의 틀린 줄·고친 줄·뼈대 칸(notes/notebook.ts skeletonFor id). 셋째 줄은 오타.
const NOTEBOOK_LINES = {
  en: [["I go to the park yesterday.", "I went to the park yesterday.", "g2-past-simple"], ["She don't like coffee.", "She doesn't like coffee.", "g1-present-simple"], ["I'm so exited!", "I'm so excited!"]],
  es: [["Ayer voy al parque.", "Ayer fui al parque.", "g2-common-irregular-preterites-fui-hice-tuv"], ["Ella no le gusta el café.", "A ella no le gusta el café.", "g2-gustar-and-encantar"], ["Tengo hanbre.", "Tengo hambre."]],
};
// 첫 카드의 한 줄 설명(앱 언어) — 서버가 카드에 붙이는 note와 같은 자리.
const NOTEBOOK_NOTE = {
  ko: "어제 일이라 과거형 went를 써요.",
  en: "Ayer is about the past, so ir becomes fui.",
  es: "Es algo de ayer, así que va en pasado: went.",
  ja: "昨日のことなので過去形のwentを使います。",
  zh: "说的是昨天的事，要用过去式 went。",
  vi: "Chuyện hôm qua nên dùng thì quá khứ went.",
  fr: "C’est hier, donc au passé : went.",
  it: "È successo ieri, quindi al passato: went.",
  pt: "Foi ontem, então vai no passado: went.",
  ru: "Это было вчера, поэтому прошедшее время: went.",
  id: "Kejadiannya kemarin, jadi pakai bentuk lampau went.",
  ar: "الحدث أمس، لذا نستخدم الماضي went.",
  th: "เป็นเรื่องเมื่อวาน จึงใช้รูปอดีต went",
  hi: "बात कल की है, इसलिए भूतकाल went आता है।",
};
const NOTES_DATA = {
  en: {
    phrases: [["Could I get the bill?", "mastered", "out.shops"], ["Where is the nearest station?", "learned", "out.transport"], ["Sorry I'm late", "learned", "help.sorry"],
      ["I went hiking last weekend", "met", "past.yesterday"], ["What do you do for work?", "mastered", "people.job"], ["I'm looking forward to it", "met", "future.plans"],
      ["Can I try this on?", "met", "out.shops"], ["I usually get up at seven", "learned", "day.routine"]],
    word: ["commute", "day.routine"], ask: { sentence: "I usually commute by train.", selected: "commute", topic: "day.routine" },
  },
  es: {
    phrases: [["¿Me trae la cuenta?", "mastered", "out.shops"], ["¿Dónde está la estación?", "learned", "out.transport"], ["Perdón por llegar tarde", "learned", "help.sorry"],
      ["Ayer fui a la playa", "met", "past.yesterday"], ["¿A qué te dedicas?", "mastered", "people.job"], ["Tengo muchas ganas", "met", "future.plans"],
      ["¿Me lo puedo probar?", "met", "out.shops"], ["Normalmente me levanto a las siete", "learned", "day.routine"]],
    word: ["madrugar", "day.routine"], ask: { sentence: "Mañana tengo que madrugar.", selected: "madrugar", topic: "day.routine" },
  },
  ja: {
    phrases: [["お会計お願いします", "mastered", "out.shops"], ["一番近い駅はどこですか？", "learned", "out.transport"], ["遅れてすみません", "learned", "help.sorry"],
      ["先週末、ハイキングに行きました", "met", "past.yesterday"], ["お仕事は何をしていますか？", "mastered", "people.job"], ["楽しみにしています", "met", "future.plans"],
      ["試着してもいいですか？", "met", "out.shops"], ["たいてい7時に起きます", "learned", "day.routine"]],
    word: ["通勤", "day.routine"], ask: { sentence: "いつも電車で通勤しています。", selected: "通勤", topic: "day.routine" },
  },
  zh: {
    phrases: [["买单", "mastered", "out.shops"], ["最近的地铁站在哪儿？", "learned", "out.transport"], ["不好意思，我来晚了", "learned", "help.sorry"],
      ["上周末我去爬山了", "met", "past.yesterday"], ["你是做什么工作的？", "mastered", "people.job"], ["我很期待", "met", "future.plans"],
      ["可以试一下吗？", "met", "out.shops"], ["我一般七点起床", "learned", "day.routine"]],
    word: ["通勤", "day.routine"], ask: { sentence: "我平时坐地铁通勤。", selected: "通勤", topic: "day.routine" },
  },
  ko: {
    phrases: [["계산서 주세요", "mastered", "out.shops"], ["가장 가까운 역이 어디예요?", "learned", "out.transport"], ["늦어서 미안해요", "learned", "help.sorry"],
      ["지난 주말에 등산 갔어요", "met", "past.yesterday"], ["무슨 일 하세요?", "mastered", "people.job"], ["기대돼요", "met", "future.plans"],
      ["입어 봐도 돼요?", "met", "out.shops"], ["보통 7시에 일어나요", "learned", "day.routine"]],
    word: ["출근", "day.routine"], ask: { sentence: "저는 보통 지하철로 출근해요.", selected: "출근", topic: "day.routine" },
  },
};
// 2.69 게시판 장면: 학습 언어로 쓴 글 셋(고정 응답).
const BOARD_POSTS = {
  en: [
    ["yuki", "I ordered coffee in English for the first time today! The barista understood me 😊", 4],
    ["lucia", "Question: is it “on the weekend” or “at the weekend”? I hear both.", 7],
    ["omar", "Looking for someone to practise small talk with on Saturdays. I'm a beginner but I try every day.", 2],
  ],
  es: [
    ["yuki", "¡Hoy pedí un café en español por primera vez! El camarero me entendió 😊", 4],
    ["lucia", "Pregunta: ¿se dice «pedí» o «pidí»? Siempre lo confundo.", 7],
    ["omar", "Busco a alguien para practicar los sábados. Soy principiante pero practico cada día.", 2],
  ],
  ja: [
    ["lucia", "今日はじめて日本語でコーヒーを注文しました！店員さんに通じました 😊", 4],
    ["omar", "質問です：「行ってきます」と「行きます」はどう違いますか？", 7],
    ["yuki", "土曜日に一緒に話す練習をしませんか？日本語なら手伝えます。", 2],
  ],
  zh: [
    ["yuki", "今天第一次用中文点了咖啡！店员听懂了 😊", 4],
    ["lucia", "请问：“再”和“又”有什么区别？我总是搞混。", 7],
    ["omar", "想找人周六一起练口语。我是初学者，但每天都在练习。", 2],
  ],
  ko: [
    ["yuki", "오늘 처음으로 한국어로 커피를 주문했어요! 직원분이 알아들으셨어요 😊", 4],
    ["lucia", "질문: '-아서'랑 '-니까'는 어떻게 달라요? 자꾸 헷갈려요.", 7],
    ["omar", "토요일마다 같이 스몰토크 연습할 사람 찾아요. 초보지만 매일 연습해요.", 2],
  ],
};
// 2.69 러닝메이트·팀 장면: 단체방을 팀으로 올린 워크스페이스(고정 응답) — 목표·정기 모임·같이 한 날·쌓인 것.
const TEAM_SPACE = {
  en: { goal: "Each of us tells one story from the weekend", phrase: "It was a piece of cake.", share: ["catch up", "to talk after not seeing each other"], call: ["How was your weekend?", "I went hiking with my sister.", "Nice! Where did you go?"] },
  es: { goal: "Cada uno cuenta una historia del fin de semana", phrase: "Fue pan comido.", share: ["ponerse al día", "hablar después de no verse"], call: ["¿Qué tal tu fin de semana?", "Fui de excursión con mi hermana.", "¡Qué bien! ¿Adónde fuisteis?"] },
  ja: { goal: "週末にあったことを一人一つ話す", phrase: "朝飯前だったよ。", share: ["近況を話す", "しばらく会っていなかった人と話すこと"], call: ["週末はどうだった？", "姉とハイキングに行ったよ。", "いいね！どこに行ったの？"] },
  zh: { goal: "每人讲一个周末的故事", phrase: "小菜一碟。", share: ["叙叙旧", "好久没见后聊聊近况"], call: ["周末过得怎么样？", "我和姐姐去爬山了。", "不错！去哪儿了？"] },
  ko: { goal: "주말 이야기 하나씩 하기", phrase: "식은 죽 먹기였어.", share: ["근황 토크", "한동안 못 본 사람과 요즘 얘기 나누기"], call: ["주말 어떻게 보냈어?", "언니랑 등산 갔어.", "좋다! 어디로 갔어?"] },
};
// 2.72 라이어 게임 장면의 주제·제시어(14개 언어 — 앱 언어·학습 언어 어느 쪽이든 보이게).
const GAME_TOPIC = { ko: "음식", en: "food", es: "comida", ja: "食べ物", zh: "食物", vi: "đồ ăn", fr: "nourriture", it: "cibo", pt: "comida", ru: "еда", id: "makanan", ar: "طعام", th: "อาหาร", hi: "खाना" };
const GAME_WORD = { ko: "피자", en: "pizza", es: "pizza", ja: "ピザ", zh: "披萨", vi: "pizza", fr: "pizza", it: "pizza", pt: "pizza", ru: "пицца", id: "pizza", ar: "بيتزا", th: "พิซซ่า", hi: "पिज़्ज़ा" };
/** 방 이름(학습 언어 ↔ 상대 언어). 상대 언어는 일본어, 일본어를 배우면 한국어. */
const ROOM_NAME = { en: "English ↔ 日本語", es: "Español ↔ 日本語", ja: "日本語 ↔ 한국어", zh: "中文 ↔ 日本語", ko: "한국어 ↔ 日本語" };
const FREE_ROOM = { en: "🌍 Friday chat", es: "🌍 Charla de los viernes", ja: "🌍 金曜日のおしゃべり", zh: "🌍 周五闲聊", ko: "🌍 금요일 수다" };
const otherLang = (target) => (target === "ja" ? "ko" : "ja");
const roomNameFor = (target) => ROOM_NAME[target] ?? ROOM_NAME.en;
// 방·단체방 줄에서 골라 물을 구절(pickPhrase가 낱말 칩에서 찾는다).
const QUOTE_PICK = { en: "last weekend", es: "fin de semana", ja: "先週末", zh: "上个周末", ko: "지난 주말" };
const GROUP_PICK = { en: "works for me", es: "me va bien", ja: "大丈夫", zh: "吃完晚饭", ko: "먹고 나서" };
function socialMocks(page, target, ui) {
  const now = Date.now();
  // 2.69 host 장면: 내가 방장이 된 것처럼(물을 때마다 읽음).
  page.__social = page.__social ?? { hostMe: false };
  const roomName = roomNameFor(target);
  const baseRoom = { id: "capt01", name: roomName, languages: [target, otherLang(target)], hostPeerId: "p_yukiyukiyuki", hostAccountId: PEOPLE.yuki.id, hostNickname: "Yuki", createdAt: now - 600_000 };
  const member = (key, peerId, role, extra = {}) => ({ peerId, nickname: PEOPLE[key].nickname, role, muted: false, hand: false, accountId: PEOPLE[key].id, langs: [target, otherLang(target)], joinedAt: now - 500_000, lastSeen: Date.now(), ...extra }); // 응답 때마다 지금: 오래되면 앱이 나간 사람으로 지운다
  const peers = { yuki: "p_yukiyukiyuki", lucia: "p_lucialucialu", omar: "p_omaromaromar" };
  // 홍보 녹화(live): Yuki·Lucía가 말하고 Yuki가 묻는 세 줄만, page.__social.shown만큼 한 줄씩 보인다.
  const source = page.__social.live
    ? [ROOM_LINES[target][0], ROOM_LINES[target][1], ["yuki", HINT_QUESTION[target]]]
    : [...ROOM_LINES[target], ...(page.__social.hint ? [["yuki", HINT_QUESTION[target]]] : [])];
  const lines = source.map(([who, text, kind], index) => ({
    seq: index + 1, kind: kind ?? "speech", peerId: peers[who], accountId: PEOPLE[who].id, nickname: PEOPLE[who].nickname, text,
    startedAt: now - 90_000 + index * 15_000, endedAt: now - 85_000 + index * 15_000,
  }));
  // 2.69: Omar가 Yuki의 첫 줄을 집어 물은 질문(줄 옆 ❓ 1).
  const first = lines[0];
  if (!page.__social.live) lines.push({
    seq: lines.length + 1, kind: "text", peerId: peers.omar, accountId: PEOPLE.omar.id, nickname: "Omar", text: askPhrase(target),
    startedAt: now - 20_000, endedAt: now - 20_000, ask: true,
    quote: { seq: first.seq, nickname: first.nickname, text: first.text, peerId: first.peerId, accountId: first.accountId },
  });
  const account = { id: PEOPLE.me.id, createdAt: "2026-10-01T00:00:00.000Z", email: null, google: false, username: "minji", profile: { nickname: "Minji", bio: "🇰🇷 → 🇯🇵 ✈️ ☕", photo: PEOPLE.me.photo } };
  const thread = { id: [PEOPLE.me.id, PEOPLE.yuki.id].sort().join("__"), members: [PEOPLE.me.id, PEOPLE.yuki.id].sort(), starter: PEOPLE.yuki.id, status: "open", createdAt: now - 7_200_000, lastAt: now - 60_000, lastText: DM_LINES[target].reply, lastFrom: PEOPLE.yuki.id, lastSeq: 4 };
  const messages = [
    { seq: 1, from: PEOPLE.yuki.id, kind: "text", text: DM_LINES[target].hi, at: now - 7_200_000 },
    { seq: 2, from: PEOPLE.yuki.id, kind: "call", text: "", roomId: "capt02", at: now - 7_000_000 },
    { seq: 3, from: PEOPLE.me.id, kind: "callLog", text: "3", roomId: "capt02", at: now - 6_400_000, lines: lines.slice(0, 3).map((line) => ({ from: line.accountId, nickname: line.nickname, text: line.text })) },
    { seq: 4, from: PEOPLE.yuki.id, kind: "text", text: DM_LINES[target].reply, at: now - 60_000 },
  ];
  const profile = (key) => ({
    id: PEOPLE[key].id, nickname: PEOPLE[key].nickname, bio: "", photo: PEOPLE[key].photo, since: "2026-09", followers: 12, following: 8, hosted: 5, helped: 9, isMe: key === "me", isFollowing: false, blockedByMe: false,
    // 2.72 프로필(Yuki만 꽉 채움): 사실 칩·도움됐어요·꾸준함·올린 글.
    ...(key === "yuki"
      ? {
          bio: "🇯🇵 → 🌏 ☕ 🎧",
          facts: { country: "JP", native: "ja", speaks: [target === "ja" ? "ko" : target], learns: [target === "ja" ? "ko" : target], interests: ["travel", "cafe", "music", "photo"], work: "worker", meetModes: ["call", "text"], meetTimes: ["evening"] },
          badges: { help: { count: 9, lang: target }, streak: { week: 5, run: 3 } },
          posts: [{ id: "bp_capture1", author: PEOPLE.yuki.id, language: target, text: BOARD_POSTS[target][0][1], at: now - 3_600_000, comments: 4, likes: 6, liked: false }],
        }
      : {}),
  });
  const json = (route, body) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  return Promise.all([
    page.route("**/api/rooms", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      const hostMe = page.__social.hostMe;
      const mePeer = body.peerId || "p_meeeeeeeeeee";
      const members = [member("yuki", peers.yuki, "speaker"), member("lucia", peers.lucia, "speaker"), member("omar", peers.omar, "listener", { hand: !page.__social.hint }), member("me", mePeer, hostMe ? "speaker" : "listener")];
      const room = hostMe ? { ...baseRoom, hostPeerId: mePeer, hostAccountId: PEOPLE.me.id, hostNickname: "Minji" } : baseRoom;
      const faces = members.map((m) => ({ accountId: m.accountId, nickname: m.nickname }));
      // 2.69 자유 대화 장면: 목록 맨 위에 🌐 방 하나.
      const free = { id: "capt03", name: FREE_ROOM[target] ?? FREE_ROOM.en, languages: [], free: true, hostPeerId: peers.lucia, hostAccountId: PEOPLE.lucia.id, hostNickname: "Lucía", createdAt: now - 300_000, speakers: 3, listeners: 1, faces: [faces[1], faces[0], faces[2]] };
      if (body.action === "list") return json(route, { rooms: [...(page.__social.free ? [free] : []), { ...room, speakers: 2, listeners: 2, faces, followed: true, ...(page.__social.game ? { gameKind: "liar" } : {}) }] });
      if (body.action === "join") return json(route, { member: members[3], room, now: Date.now() });
      if (body.action === "poll" && page.__social.live) {
        const at = page.__social.revealedAt ?? {};
        const shown = lines
          .filter((l) => l.seq <= (page.__social.shown ?? 0) && l.seq > (body.since ?? 0))
          .map((l) => ({ ...l, startedAt: at[l.seq] - 2500, endedAt: at[l.seq] }));
        return json(route, { now: Date.now(), room, members, signals: [], lines: shown });
      }
      // 2.72 라이어 게임 장면: 방장(나)·Yuki·Lucía가 플레이어, Yuki 차례(제시어는 앱 언어·학습 언어로).
      if (body.action === "poll" && page.__social.game) {
        const game = {
          kind: "liar", id: "lg_capture1", mode: "ai", moderator: "ai",
          players: [{ peerId: mePeer, accountId: PEOPLE.me.id, nickname: "Minji" }, { peerId: peers.yuki, accountId: PEOPLE.yuki.id, nickname: "Yuki" }, { peerId: peers.lucia, accountId: PEOPLE.lucia.id, nickname: "Lucía" }],
          topic: "food", topicNames: GAME_TOPIC, laps: 1, phase: "clue", turn: 1, endsAt: Date.now() + 38_000, current: peers.yuki, me: "player", words: GAME_WORD,
          watch: { can: false, spectator: false, count: 1 },
        };
        return json(route, { now: Date.now(), room: { ...room, game: { id: game.id, kind: "liar" } }, members, signals: [], lines: body.since ? [] : lines.slice(0, 2), game });
      }
      if (body.action === "poll") return json(route, { now: Date.now(), room, members, signals: [], lines: body.since ? [] : lines });
      if (body.action === "peek") return json(route, { room });
      if (body.action === "line")
        return json(route, { line: { seq: 90 + Math.floor(Math.random() * 9), kind: body.kind, peerId: mePeer, accountId: PEOPLE.me.id, nickname: "Minji", text: body.text, startedAt: body.startedAt, endedAt: body.endedAt } });
      if (body.action === "parked") return json(route, { rooms: [] });
      return json(route, { ok: true });
    }),
    page.route("**/api/social", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      if (body.action === "mine") return json(route, { following: [], blocked: [] });
      if (body.action === "people") {
        const seen = (minutes) => Date.now() - minutes * 60_000;
        return json(route, {
          people: [
            // 2.72: 국적(국기)·모국어·관심사 칩·도움됐어요 수(프로필 사실, account/profileFacts.ts).
            { id: PEOPLE.yuki.id, nickname: "Yuki", bio: "🇯🇵 → 🌏 ☕ 🎧", hasPhoto: true, ui: "ja", learn: target === "ja" ? "ko" : target, learns: [target === "ja" ? "ko" : target], lastSeen: seen(1), isFollowing: true, country: "JP", native: "ja", interests: ["travel", "cafe", "music"], sharedInterests: 2, help: 9, meetModes: ["call"] },
            { id: PEOPLE.lucia.id, nickname: "Lucía", bio: "🇪🇸 → 🇯🇵 🍣 📚", hasPhoto: true, ui: "es", learn: "ja", learns: ["ja"], lastSeen: seen(40), isFollowing: false, country: "ES", native: "es", interests: ["food", "books", "anime"], sharedInterests: 1, help: 3 },
            { id: PEOPLE.omar.id, nickname: "Omar", bio: "🇪🇬 → 🌍 ⚽", hasPhoto: true, ui: "ar", learn: target, learns: [target], lastSeen: seen(60 * 26), isFollowing: false, country: "EG", native: "ar", interests: ["sports", "games"] },
          ],
        });
      }
      if (body.action === "profile") {
        const key = Object.keys(PEOPLE).find((k) => PEOPLE[k].id === body.target) ?? "yuki";
        return json(route, { profile: profile(key) });
      }
      return json(route, { ok: true });
    }),
    page.route("**/api/dm", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      // 홍보 녹화(Room만): 쪽지 알림 띠가 방 화면을 가리지 않게 받은 쪽지 없음.
      if (body.action === "inbox") return json(route, { threads: page.__social.roomOnly ? [] : [{ thread, other: PEOPLE.yuki.id, unread: 1, request: false }] });
      if (body.action === "open") return json(route, { thread, messages, blocked: false });
      if (body.action === "poll") return json(route, { thread, messages: [] });
      return json(route, { ok: true });
    }),
    page.route("**/api/roleplay/listen", (route) => {
      const text = page.__social.hintText ?? "";
      // 홍보 녹화: 한 번만 받아쓰고 끝(가짜 마이크가 반복해 말해도 줄이 하나).
      if (page.__social.live) page.__social.hintText = "";
      return json(route, { text });
    }),
    page.route("**/api/groups", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      const g = GROUP_LINES[target];
      const group = { id: "g_capturegrp", name: g.name, languages: [target, otherLang(target)], owner: PEOPLE.me.id, members: [PEOPLE.me.id, PEOPLE.yuki.id, PEOPLE.lucia.id, PEOPLE.omar.id], invited: [], callRoomId: "capt04", createdAt: now - 86_400_000, lastAt: now - 60_000, lastText: g.c, lastFrom: PEOPLE.lucia.id, lastSeq: 6 };
      const messages = [
        { seq: 1, from: PEOPLE.yuki.id, kind: "text", text: g.a, at: now - 3_600_000 },
        { seq: 2, from: PEOPLE.omar.id, kind: "text", text: g.b, at: now - 3_500_000 },
        { seq: 3, from: PEOPLE.lucia.id, kind: "text", text: askPhrase(target), at: now - 3_400_000, ask: true, quote: { seq: 2, nickname: "", text: g.b, accountId: PEOPLE.omar.id } },
        { seq: 4, from: PEOPLE.lucia.id, kind: "text", text: g.c, at: now - 120_000 },
        { seq: 5, from: PEOPLE.yuki.id, kind: "system", text: "call", roomId: "capt04", at: now - 60_000 },
      ];
      if (page.__social.team) {
        const day = 86_400_000;
        group.team = { kind: "team", since: now - 20 * day, goal: TEAM_SPACE[target].goal, goalBy: PEOPLE.yuki.id, schedule: { days: [2, 4], time: "21:00", tz: "Asia/Seoul" } };
        if (body.action === "space") {
          const ts = TEAM_SPACE[target];
          const days = [0, 1, 2, 3, 5, 6].map((n) => new Date(now - n * day).toISOString().slice(0, 10));
          const items = [
            { id: "s1", kind: "share", at: now - 3_600_000, by: PEOPLE.lucia.id, text: ts.share[0], note: ts.share[1] },
            { id: "s2", kind: "phrase", at: now - 2 * day, by: PEOPLE.me.id, from: PEOPLE.yuki.id, text: ts.phrase },
            { id: "s3", kind: "session", at: now - 3 * day, by: PEOPLE.yuki.id, text: "3", lines: ts.call.map((text, i) => ({ from: [PEOPLE.yuki.id, PEOPLE.omar.id, PEOPLE.lucia.id][i], nickname: ["Yuki", "Omar", "Lucía"][i], text })) },
          ];
          return json(route, { group, space: { items, days } });
        }
      }
      if (body.action === "mine") return json(route, { groups: [{ group, unread: 2, invite: false }] });
      if (body.action === "open") return json(route, { group, messages, call: { roomId: "capt04", live: 2 } });
      if (body.action === "poll") return json(route, { group, messages: [], call: { roomId: "capt04", live: 2 } });
      return json(route, { ok: true });
    }),
    page.route("**/api/invite", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      if (body.action === "lookup" && page.__social.inviterMe)
        // 홍보 녹화: 내가 보낸 초대를 친구가 받은 모습.
        return json(route, { inviter: { id: PEOPLE.me.id, nickname: "Minji", bio: "🇰🇷 → 🌏 ✈️ ☕", photo: PEOPLE.me.photo, learn: target, ui: "ko" }, room: null, isMe: false });
      if (body.action === "lookup")
        return json(route, { inviter: { id: PEOPLE.yuki.id, nickname: "Yuki", bio: "🇯🇵 → 🌏 ☕ 🎧", photo: PEOPLE.yuki.photo, learn: target, ui: "ja" }, room: null, isMe: false });
      if (body.action === "mine") return json(route, { code: "capture01" });
      // 친구 초대 보상 카드(InviteRewards): 모양이 다르면 화면 전체가 깨진다.
      if (body.action === "status") return json(route, { friends: 0, points: 0, earlyLeft: 100, reward: { inviter: 50, invitee: 30, early: true }, pass: null, news: [] });
      return json(route, { ok: true });
    }),
    page.route("**/api/account/me", (route) => json(route, { account })),
    page.evaluate((acct) => {
      localStorage.setItem("ec_auth_token", "capture-token");
      localStorage.setItem("ec_account", JSON.stringify(acct));
    }, account),
  ]);
}

/** 누른 곳에 손가락 원을 남기며 누른다(홍보 녹화). */
async function tapAt(page, locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => undefined);
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

/** 줄 아래 낱말 칩에서 [처음, 끝]을 누른다 — 사이가 구절로 골라진다(RoomParts LineActions). */
async function pickWords(page, [from, to], wait) {
  const chips = page.locator("div.flex.flex-wrap.gap-1 > button[aria-pressed]").filter({ visible: true });
  if ((await chips.count()) <= to) return;
  await chips.nth(from).click();
  if (to !== from) await chips.nth(to).click();
  await wait(500);
  // 자막 칸은 따로 스크롤된다: 고른 구절이 든 "❓ … 무슨 뜻이에요?" 버튼까지 보이게.
  await page.locator("button", { hasText: "❓ “" }).filter({ visible: true }).last().evaluate((el) => el.scrollIntoView({ block: "center" })).catch(() => undefined);
  await wait(500);
}

/** 낱말 칩에서 구절이 시작·끝나는 칩을 찾아 누른다(띄어쓰기 없는 언어도 칩을 이어 붙여 맞춘다). */
async function pickPhrase(page, phrase, wait) {
  const chips = page.locator("div.flex.flex-wrap.gap-1 > button[aria-pressed]").filter({ visible: true });
  const words = (await chips.allInnerTexts()).map((w) => w.trim());
  const flat = (x) => x.replace(/\s+/g, "");
  const want = flat(phrase);
  for (let i = 0; i < words.length; i++) {
    let joined = "";
    for (let j = i; j < words.length; j++) {
      joined += flat(words[j]);
      if (!want.startsWith(joined) && !joined.startsWith(want)) break;
      if (joined.length >= want.length) return pickWords(page, [i, j], wait);
    }
  }
  // 못 찾으면 줄 가운데 두 낱말.
  const mid = Math.max(0, Math.floor(words.length / 2) - 1);
  if (words.length > 1) await pickWords(page, [mid, mid + 1], wait);
}

/** AI 대화의 튜터 말풍선(누르면 할 일 한 줄이 열리는 줄, MessageBubble). */
function tutorLines(page) {
  return page.locator("div[role=button][aria-expanded].rounded-bl-sm");
}

/** 마지막 튜터 줄을 눌러 분석을 연다. 여러 문장이면 가장 긴 문장을 고른다. */
async function openLineAnalysis(page, ui, wait) {
  const analyze = page.getByRole("button", { name: exactly(ui.insightAnalyze) });
  if (!(await analyze.count())) {
    await tutorLines(page).last().click();
    await wait(700);
  }
  await analyze.last().click();
  await wait(700);
  if ((await analyze.last().getAttribute("aria-expanded")) === "true") {
    const options = analyze.last().locator("xpath=following-sibling::div[1]/button");
    const texts = await options.allInnerTexts();
    let best = 0;
    texts.forEach((text, i) => { if (text.length > texts[best].length) best = i; });
    await options.nth(best).click();
  }
}

const STEPS = {
  async "promo-room"({ page, ui, locale, wait, target, mark }) {
    // 목소리를 입히는 쇼츠: 줄마다 시각과 글자를 남기고, 말이 끝날 만큼 기다린다(make.mjs room이 TTS로 입힌다).
    const t = roomCopyFor(locale);
    page.__social = { hostMe: true, hint: true, live: true, roomOnly: true, shown: 0, revealedAt: {}, hintText: "" };
    await socialMocks(page, target, ui);
    const reveal = (n) => {
      page.__social.shown = n;
      page.__social.revealedAt[n] = Date.now();
    };
    mark("line1Text", ROOM_LINES[target][0][1]);
    mark("line2Text", ROOM_LINES[target][1][1]);
    mark("questionText", HINT_QUESTION[target]);
    mark("mumbleText", HINT_FRAGMENT[locale]);
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(1500);
    const later = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await later.count()) await later.first().click();
    await wait(700);
    mark("rooms");
    await wait(700);
    await tapAt(page, page.locator("li", { hasText: roomNameFor(target) }).first().locator("button").first());
    mark("join");
    await wait(2000);
    reveal(1);
    mark("line1");
    await wait(6000);
    reveal(2);
    mark("line2");
    await wait(4300);
    const line = page.locator('div[class*="z-[80]"] li > div > button.w-full').nth(1);
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    mark("tap");
    await tapAt(page, line);
    await translated;
    mark("translated");
    await wait(1800);
    reveal(3);
    mark("question");
    await wait(2200);
    page.__social.hintText = HINT_FRAGMENT[locale];
    mark("mumble");
    const card = page.getByText(t.hintTry);
    for (let i = 0; i < 60 && !(await card.count()); i++) await wait(500);
    if (!(await card.count())) throw new Error("no hint card");
    mark("hint");
    mark("hintText", await card.first().evaluate((el) => {
      const box = el.closest("div")?.parentElement ?? el.parentElement;
      return box.innerText.split("\n").map((x) => x.trim()).filter((x) => x && !x.includes("💡"))[1] ?? "";
    }).catch(() => ""));
    await wait(3200);
    await tapAt(page, page.getByRole("button", { name: exactly(t.sendThis) }).last());
    mark("sent");
    await wait(2400);
    mark("end");
  },
  async "promo-invite"({ page, ui, locale, wait, target, mark }) {
    const inv = inviteCopyFor(locale);
    page.__social = { hostMe: false, roomOnly: true, inviterMe: true, team: true };
    await socialMocks(page, target, ui);
    // 웹에는 휴대폰 공유 창이 없다: 링크를 복사하고 "복사했어요"가 뜨는 웹 동작 그대로.
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => undefined);
    await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
    // 1. 나: 사람 탭 → 친구 초대.
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(1400);
    mark("people");
    await wait(900);
    await tapAt(page, page.getByRole("button", { name: new RegExp(`${escape(inv.invite)}$`) }).first());
    mark("invite");
    await wait(2200);
    // 2. 친구: 링크로 들어오면 "Minji님이 초대했어요".
    await page.goto(`${BASE}/?screen=people&invite=capture01`, { waitUntil: "networkidle" });
    await wait(1200);
    mark("welcome");
    await wait(2600);
    // 3. 같이: 메시지 탭의 팀(단체방) → 워크스페이스.
    await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
    await page.goto(`${BASE}/?screen=messages`, { waitUntil: "networkidle" });
    await wait(1200);
    const later = page.getByRole("button", { name: exactly(inv.later) });
    if (await later.count()) await later.first().click();
    await wait(600);
    mark("messages");
    await wait(700);
    await tapAt(page, page.locator("li button", { hasText: GROUP_LINES[target].name }).first());
    mark("group");
    await wait(1800);
    await tapAt(page, page.getByRole("tab", { name: exactly(teamCopyFor(locale).tabSpace) }));
    mark("space");
    await wait(2200);
    // 쌓인 것까지 천천히 내려 본다.
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 120);
      await wait(260);
    }
    mark("scrolled");
    await wait(1800);
    mark("end");
  },
  async "promo-people"({ page, ui, locale, wait, target, mark }) {
    const t = roomCopyFor(locale);
    // 고정 응답이 만들어지기 전에 정해야 세 줄(질문 포함)로 짜인다.
    page.__social = { hostMe: true, hint: true, live: true, shown: 0, revealedAt: {}, hintText: "" };
    await socialMocks(page, target, ui);
    const reveal = (n) => {
      page.__social.shown = n;
      page.__social.revealedAt[n] = Date.now();
    };
    // 1. 사람: 같은 언어를 배우는 사람들 → Lucía 팔로우.
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(1500);
    const later = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await later.count()) await later.first().click();
    await wait(800);
    mark("people");
    await wait(1600);
    await tapAt(page, page.getByRole("button", { name: new RegExp(`${escape(t.follow)}$`) }).first());
    mark("follow");
    await wait(1400);
    // 2. Room 탭 → 방 카드 → 말하기로 들어가기.
    await tapAt(page, page.getByRole("button", { name: exactly(ui.homeTabRooms) }).last());
    await wait(1600);
    mark("rooms");
    await wait(900);
    await tapAt(page, page.locator("li", { hasText: roomNameFor(target) }).first().locator("button").first());
    mark("join");
    await wait(2600);
    // 3. 상대가 말하는 대로 자막이 한 줄씩.
    reveal(1);
    await wait(2300);
    reveal(2);
    mark("lines");
    await wait(2000);
    // 4. 모르는 줄을 눌러 내 언어로(운영 /api/translate).
    const line = page.locator('div[class*="z-[80]"] li > div > button.w-full').nth(1);
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    await tapAt(page, line);
    await translated;
    mark("translated");
    await wait(2000);
    // 5. 나에게 묻는다 → 나는 편한 말로 웅얼 → 💡 힌트(운영).
    reveal(3);
    mark("question");
    await wait(1800);
    page.__social.hintText = HINT_FRAGMENT[locale];
    const card = page.getByText(t.hintTry);
    for (let i = 0; i < 60 && !(await card.count()); i++) await wait(500);
    if (!(await card.count())) throw new Error("no hint card");
    mark("hint");
    // 힌트 문장(편집에서 목소리로 읽어 준다): 카드에서 "이렇게 말해 보세요" 다음 줄.
    mark("hintText", await card.first().evaluate((el) => {
      const box = el.closest("div")?.parentElement ?? el.parentElement;
      return box.innerText.split("\n").map((x) => x.trim()).filter((x) => x && !x.includes("💡"))[1] ?? "";
    }).catch(() => ""));
    await wait(2600);
    // 6. 이걸로 보내기 → 내 말이 학습 언어 자막으로.
    await tapAt(page, page.getByRole("button", { name: exactly(t.sendThis) }).last());
    mark("sent");
    await wait(2400);
    // 7. 방이 끝나도: 단체방에서 계속.
    await tapAt(page, page.locator('div[class*="z-[80]"] header').getByRole("button", { name: exactly(t.minimize) }));
    await wait(700);
    await tapAt(page, page.getByRole("button", { name: exactly(ui.homeTabMessages) }).last());
    await wait(1500);
    await tapAt(page, page.locator("li button", { hasText: GROUP_LINES[target].name }).first());
    mark("group");
    await wait(3000);
    mark("end");
  },
  async rooms({ page, ui, locale, wait, target }) {
    await socialMocks(page, target, ui);
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(2000);
    await page.getByRole("button", { name: exactly(roomCopyFor(locale).justListen) }).first().click();
    await wait(3500);
    // 둘째 줄(질문)을 눌러 앱 언어 번역을 띄운다(운영 /api/translate).
    const line = page.locator('div[class*="z-[80]"] li > div > button.w-full').nth(1);
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    await line.click();
    await translated;
    await wait(1200);
  },
  async "rooms-mini"({ page, ui, locale, wait }) {
    // 방을 작게 접고 채팅 탭으로: 탭 바 위에 방 막대가 떠 있어야 한다(연결은 그대로).
    await page.locator('div[class*="z-[80]"] header').getByRole("button", { name: exactly(roomCopyFor(locale).minimize) }).click();
    await wait(800);
    // 2.69: 하단이 "사람과 학습" 묶음이면 위 스위치로 "AI와 학습"에 가서 채팅 탭(막대가 따라온다).
    // 2.69 하단 탭(대화 · 영상 · 사람 · Room · My): 대화 탭 맨 위 AI 튜터 줄을 누르면 채팅(막대가 따라온다).
    const talkTab = page.getByRole("button", { name: exactly(ui.homeTabTalk ?? "") });
    if (ui.homeTabTalk && (await talkTab.count())) {
      await talkTab.last().click();
      await wait(1000);
      await page.getByRole("button", { name: new RegExp(ui.talkAiTutor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).first().click();
    } else {
      const chatTab = page.getByRole("button", { name: exactly(ui.homeTabChat) });
      if (!(await chatTab.count()) && ui.modeAi) await page.getByText(ui.modeAi, { exact: true }).first().click();
      await wait(800);
      await chatTab.last().click();
    }
    await wait(2500);
  },
  async dm({ page, locale, wait }) {
    const t = roomCopyFor(locale);
    // 접어 둔 방이면 막대를 눌러 다시 연다.
    const bar = page.locator("button", { hasText: t.miniBack });
    if (await bar.count()) {
      await bar.first().click();
      await wait(1200);
    }
    // 자리의 방장 얼굴 → 프로필 시트 → 메시지 → 대화(고정 응답).
    await page.locator('div[class*="z-[80]"] header ul li button').first().click();
    await wait(1500);
    await page.locator('div[class*="z-[90]"]').getByRole("button", { name: new RegExp(escape(t.message)) }).click();
    await wait(2500);
    await page.locator('div[class*="z-[95]"] button', { hasText: t.callEnded }).click();
    await wait(600);
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    await page.locator('div[class*="z-[95]"] div.max-w-\\[80\\%\\] > button').last().click();
    await translated;
    await wait(1200);
  },
  async notes({ page, wait, target }) {
    const data = NOTES_DATA[target];
    const now = Date.now();
    const key = (text) => text.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 160);
    const places = Object.fromEntries([...data.phrases.map(([text, , topic]) => [key(text), topic]), [key(data.word[0]), data.word[1]], [key(data.ask.selected), data.ask.topic]]);
    await page.evaluate(([data, target, places, now]) => {
      localStorage.setItem(`notesPlace:v1:${target}`, JSON.stringify(places));
      localStorage.setItem("vocabularyEntries", JSON.stringify([{ id: "capture-word", word: data.word[0], gloss: "—", languageCode: target, createdAt: now }]));
      localStorage.setItem(`ledgerWordListSent:v1:${target}`, "1");
      localStorage.setItem("notesViewMode", "\"outline\"");
    }, [data, target, places, now]);
    const ui = await page.evaluate(() => localStorage.getItem("appUiLocale"));
    await page.evaluate(([data, target, ui, now]) => {
      const sentence = data.ask.sentence;
      localStorage.setItem("sentenceNotes.v1", JSON.stringify({ [`${target}>${ui}:${sentence}`]: { sentence, language: target, uiLanguage: ui,
        threads: [{ id: "t1", selected: data.ask.selected, turns: [{ question: "?", answer: "—", at: now }] }], updatedAt: now } }));
    }, [data, target, ui, now]);
    await page.route("**/api/learner/ledger?*compact=1*", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: data.phrases.map(([text, state]) => ({ text, state, firstMet: { tab: "chat", at: now }, lastOutput: null })) }) }),
    );
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.locator("section", { has: page.locator('input[type="search"]') }).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -40);
    await wait(800);
  },
  async board({ page, ui, wait, target }) {
    await socialMocks(page, target, ui);
    const now = Date.now();
    const posts = BOARD_POSTS[target].map(([who, text, comments], index) => ({ id: `b_capture${index}`, author: PEOPLE[who].id, language: target, text, at: now - (index + 1) * 2_400_000, comments }));
    await page.route("**/api/board", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      const authors = Object.values(PEOPLE).map((p) => ({ id: p.id, nickname: p.nickname }));
      if (body.action === "list") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ posts, authors, next: posts.length }) });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.evaluate(() => {
      localStorage.setItem("peopleViewMode", "board");
      localStorage.setItem("boardTopic", "all");
    });
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
  },
  async "talk-list"({ page, ui, locale, wait, target }) {
    // 대화 탭: 맨 위 AI 튜터 줄, 아래 단체방·1:1(고정 응답).
    await socialMocks(page, target, ui);
    page.__social.roomOnly = false;
    await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
    await page.goto(`${BASE}/?screen=talk`, { waitUntil: "networkidle" });
    await wait(2500);
    const close = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await close.count()) await close.first().click();
    await wait(800);
  },
  async "invite-rewards"({ page, ui, wait, target }) {
    // 사람 탭 맨 위 친구 초대 보상 카드(고정 응답 status).
    await socialMocks(page, target, ui);
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
  },
  async people({ page, ui, wait, target }) {
    // 2.69: 화면 위 스위치 "사람과 학습" → 사람 탭(고정 응답).
    await socialMocks(page, target, ui);
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
  },
  async "profile-facts"({ page, ui, wait, target }) {
    // 2.72: 사람 탭 → Yuki 프로필 시트(국기·모국어·관심사 칩·도움됐어요·꾸준함·올린 글, 고정 응답).
    await socialMocks(page, target, ui);
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "people"));
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.getByRole("button", { name: "Yuki", exact: true }).first().click();
    await wait(2500);
  },
  async "stage-board"({ page, locale, wait, target }) {
    // 2.74: My 자라는 중 "단계" — 사다리·1단계 문법 칸(습득한 표현·숙지·고친 장면)·관용 표현 줄. 칸 이름은 운영 응답, 표현·카드만 끼운다.
    await page.route("**/api/notebook?*", async (route) => {
      if (route.request().method() !== "GET" || route.request().url().includes("shot=")) return route.fallback();
      const response = await route.fetch({ headers: { ...route.request().headers(), "x-rc-user": `whats-new-capture-notebook-${locale}` }, timeout: 60_000 });
      const book = await response.json();
      const grammar = (book.nodes ?? []).filter((n) => n.chapter === "grammar");
      const s1 = grammar.filter((n) => n.stage === 1);
      const s2 = grammar.filter((n) => n.stage === 2);
      const lines = STAGE_PHRASES[target] ?? STAGE_PHRASES.en;
      const pick = [[s1[0], lines[0], "mastered"], [s1[1], lines[1], "learned"], [s1[3], lines[2], "learned"], [s2[0], lines[3], "learned"], [{ id: "i-set" }, lines[4], "mastered"], [{ id: "i-idiom" }, lines[5], "learned"]].filter(([n]) => n);
      book.phrases = pick.map(([node, text, state], i) => ({ key: `k${i}`, text, state, node: node.id }));
      book.cards = s1[2] ? [{ id: "fxcapture01", wrong: lines[6][0], right: lines[6][1], note: "", node: s1[2].id, where: "chat", at: Date.now(), kind: "mistake" }] : [];
      book.pending = [];
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(book) });
    });
    await page.evaluate(() => localStorage.setItem("myViewMode", "map"));
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    const ladder = page.locator('ol button[aria-pressed]');
    for (let i = 0; i < 40 && !(await ladder.count()); i++) await wait(500);
    await ladder.first().evaluate((el) => el.closest("section")?.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -60);
    await wait(1200);
  },
  async "find-in-my"({ page, ui, wait, target }) {
    // 2.74: 실제 채팅 한 줄 → 튜터 줄 분석 → 🔎 My에서 찾기 → My 단계 그 칸 + ❓ 상자(화면 함께).
    const line = { en: "I have been to Japan twice.", es: "Ayer fui al cine con mis amigos.", ja: "写真を撮ってもいいですか。" }[target] ?? "I have been to Japan twice.";
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1500);
    await page.locator("textarea:visible").first().fill(line);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 40 && (await page.locator('[role="button"][aria-expanded="false"]').count()) < 2; i++) await wait(500);
    await wait(3000);
    await page.locator('[role="button"][aria-expanded="false"]').first().click();
    await wait(500);
    await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).first().click();
    await wait(4000);
    await page.getByRole("button", { name: new RegExp(escape(ui.findInMy)) }).first().click();
    const add = page.getByRole("button", { name: exactly(ui.notebookQuestionAdd) });
    for (let i = 0; i < 60 && !(await add.count()); i++) await wait(500);
    await wait(1200);
  },
  async "noto-icons"({ page, ui, wait, target }) {
    // 2.74: 사람 탭 🙂 아이콘 → 기본 묶음 Noto 😀 시트(목록·그림은 운영 — 기본 묶음은 로그인 없이도 첫 쪽 맨 앞).
    await socialMocks(page, target, ui);
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "icons"));
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    const pack = page.getByText("Noto 😀").first();
    for (let i = 0; i < 40 && !(await pack.count()); i++) await wait(500);
    await pack.click();
    await wait(4000);
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "people"));
  },
  async "people-lang"({ page, ui, locale, wait, target }) {
    // 2.73: 사람 탭 언어 칩 "배우는 언어·쓰는 말이 같은 사람"을 고른 목록(고정 응답 — 서버가 거른 것처럼 내 모국어를 쓰고 같은 언어를 배우는 사람만).
    await socialMocks(page, target, ui);
    await page.route("**/api/social", (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      if (body.action !== "people" || body.match !== "both") return route.fallback();
      const seen = (minutes) => Date.now() - minutes * 60_000;
      const both = (key, minutes, extra) => ({ id: PEOPLE[key].id, nickname: PEOPLE[key].nickname, bio: "", hasPhoto: true, ui: locale, learn: target, learns: [target], native: locale, lastSeen: seen(minutes), isFollowing: false, ...extra });
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ people: [both("yuki", 2, { bio: "☕ 🎧 ✈️", interests: ["travel", "cafe"], sharedInterests: 1, help: 4 }), both("lucia", 35, { bio: "📚 🎬", interests: ["books"], help: 1 }), both("omar", 60 * 5, { bio: "⚽ 🎮", interests: ["sports", "games"] })] }),
      });
    });
    await page.evaluate(() => {
      localStorage.setItem("peopleViewMode", "people");
      localStorage.setItem("peopleFilter", "both");
    });
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.evaluate(() => localStorage.setItem("peopleFilter", "all"));
  },
  async "notebook-today"({ page, locale, wait, target }) {
    // 2.73: My → 노트 → "오늘의 학습" 시트(오늘 튜터가 고친 줄 셋, 하나는 그때 화면이 이 기기에 있음).
    // 칸 이름은 운영 응답(앱 언어로 옮긴 단계 글) 그대로, 후보만 바꿔 끼운다.
    const lines = NOTEBOOK_LINES[target] ?? NOTEBOOK_LINES.en;
    const note = NOTEBOOK_NOTE[locale] ?? NOTEBOOK_NOTE.en;
    await page.route("**/api/notebook?*", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      const response = await route.fetch({ headers: { ...route.request().headers(), "x-rc-user": `whats-new-capture-notebook-${locale}` }, timeout: 60_000 });
      const book = await response.json();
      const at = Date.now();
      const card = (index, [wrong, right, node], extra) => ({ id: `fx_capture${index}`, wrong, right, node, at: at - (3 - index) * 600_000, day: book.today, kind: "mistake", ...extra });
      book.cards = [];
      book.pending = [card(0, lines[0], { note }), card(1, lines[1], { again: true }), card(2, lines[2], { kind: "typo", node: null })];
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(book) });
    });
    // 그때 화면(기기 안 IndexedDB, notes/sceneShots.ts와 같은 열쇠).
    const shot = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640"><rect width="360" height="640" fill="#0b1020"/><rect x="0" y="0" width="360" height="56" fill="#111827"/><rect x="150" y="120" width="190" height="56" rx="18" fill="#6d28d9"/><rect x="20" y="200" width="230" height="74" rx="18" fill="#1f2937"/><rect x="150" y="300" width="190" height="40" rx="18" fill="#6d28d9"/><rect x="170" y="352" width="150" height="22" rx="11" fill="#7f1d1d"/><rect x="20" y="400" width="250" height="90" rx="18" fill="#1f2937"/><rect x="12" y="586" width="336" height="42" rx="21" fill="#1f2937"/></svg>`)).jpeg({ quality: 70 }).toBuffer();
    await page.evaluate(([key, language, image]) => new Promise((resolve) => {
      const request = indexedDB.open("notebookShots", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("shots", { keyPath: "key" });
      request.onsuccess = () => {
        const tx = request.result.transaction("shots", "readwrite");
        tx.objectStore("shots").put({ key, language, at: Date.now(), image });
        tx.oncomplete = () => resolve(null);
        tx.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    }), [`${target}|${lines[0][0].normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "").slice(0, 300)}`, target, `data:image/jpeg;base64,${shot.toString("base64")}`]);
    await page.evaluate(() => localStorage.setItem("notesViewMode", "\"outline\""));
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(3000);
    const today = page.locator("button", { hasText: new RegExp(`${escape(copy[locale].notebookToday)} · 3`) }).first();
    await today.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await today.click();
    await wait(1500);
    // 첫 줄의 "화면 함께"를 켠 모습.
    const withScreen = page.getByText(copy[locale].notebookWithScreen, { exact: true }).first();
    if (await withScreen.count()) await withScreen.click();
    await wait(800);
  },
  async "room-game"({ page, ui, locale, wait, target }) {
    // 2.72: 내가 말하기 자리에 있는 방에서 라이어 게임 판(Yuki 차례, 제시어 피자) — 고정 응답.
    const t = roomCopyFor(locale);
    // roomOnly: 받은 쪽지 띠가 판을 가리지 않게. 마이크는 페이지가 뜨기 전에 조용한 가짜로(안내 줄이 안 뜨게).
    page.__social = { hostMe: true, game: true, roomOnly: true };
    await socialMocks(page, target, ui);
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = async () => new AudioContext().createMediaStreamDestination().stream;
    });
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(2000);
    const later = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await later.count()) await later.first().click();
    await page.getByRole("button", { name: exactly(t.justListen) }).first().click();
    await wait(4500);
    const micNotice = page.getByText(t.micDenied);
    if (await micNotice.count()) await micNotice.first().click();
    await wait(800);
  },
  async icons({ page, ui, wait, target }) {
    // 2.72: 사람 탭 → 아이콘 → 묶음 시트(고정 응답, 그림은 여기서 만든 움직이는 WebP).
    await socialMocks(page, target, ui);
    const sharp = (await import("sharp")).default;
    const colors = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#14b8a6", "#ef4444", "#eab308"];
    const face = (bg, mouth) =>
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><circle cx="64" cy="64" r="60" fill="${bg}"/><circle cx="44" cy="52" r="9" fill="#111"/><circle cx="84" cy="52" r="9" fill="#111"/><path d="${mouth}" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`);
    const images = new Map();
    for (let i = 0; i < colors.length; i++) {
      const frames = await Promise.all(["M36 82 Q64 108 92 82", "M40 88 Q64 96 88 88"].map((mouth) => sharp(face(colors[i], mouth)).png().toBuffer()));
      images.set(`ic_capture0${i}`, await sharp(frames, { join: { animated: true } }).webp({ delay: [400, 400], loop: 0 }).toBuffer());
    }
    const phrase = { en: "Nice!", es: "¡Genial!", ja: "いいね！", zh: "太棒了！", ko: "좋아요!" }[target];
    const pack = (id, owner, ownerName, name, license, uses, n) => ({
      id, owner, ownerName, name, license, uses, added: false, createdAt: Date.now(),
      icons: [...images.keys()].slice(0, n).map((icon, index) => ({ id: icon, w: 128, h: 128, animated: true, ...(index === 0 ? { phrase: { lang: target, text: phrase } } : {}) })),
    });
    const packs = [pack("ip_capture01", PEOPLE.yuki.id, "Yuki", "Smile 😀", "cc-by-4.0", 128, 8), pack("ip_capture02", PEOPLE.lucia.id, "Lucía", "Gatos 🐱", "cc0", 54, 6)];
    await page.route("**/api/icons**", async (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        const icon = new URL(request.url()).searchParams.get("f")?.split(".")[1] ?? "";
        const bytes = images.get(icon);
        return bytes ? route.fulfill({ status: 200, contentType: "image/webp", body: bytes }) : route.fulfill({ status: 404, body: "" });
      }
      const body = JSON.parse(request.postData() || "{}");
      if (body.action === "list") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ packs, next: 2 }) });
      if (body.action === "mine") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ packs: [], own: [] }) });
      return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "icons"));
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.getByText("Smile 😀").first().click();
    await wait(2000);
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "people"));
  },
  async "icon-sale"({ page, ui, wait, target }) {
    // 2.74: 판매 묶음 시트(가격·"이 앱에서 산 사람만"·"nP로 사기") — 고정 응답, 그림은 여기서 만든 움직이는 WebP.
    await socialMocks(page, target, ui);
    const sharp = (await import("sharp")).default;
    const colors = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#14b8a6", "#ef4444", "#eab308"];
    const face = (bg, mouth) =>
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><circle cx="64" cy="64" r="60" fill="${bg}"/><circle cx="44" cy="52" r="9" fill="#111"/><circle cx="84" cy="52" r="9" fill="#111"/><path d="${mouth}" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`);
    const images = new Map();
    for (let i = 0; i < colors.length; i++) {
      const frames = await Promise.all(["M36 82 Q64 108 92 82", "M40 88 Q64 96 88 88"].map((mouth) => sharp(face(colors[i], mouth)).png().toBuffer()));
      images.set(`ic_capture0${i}`, await sharp(frames, { join: { animated: true } }).webp({ delay: [400, 400], loop: 0 }).toBuffer());
    }
    const phrase = { en: "Nice!", es: "¡Genial!", ja: "いいね！", zh: "太棒了！", ko: "좋아요!" }[target];
    const icons = [...images.keys()].map((icon, index) => ({ id: icon, w: 128, h: 128, animated: true, ...(index === 0 && phrase ? { phrase: { lang: target, text: phrase } } : {}) }));
    const sale = { id: "ip_capture02", owner: PEOPLE.lucia.id, ownerName: "Lucía", name: "Gatos 🐱", license: "app", price: 5, sale: "approved", bought: false, uses: 54, added: false, createdAt: Date.now(), icons };
    const free = { id: "ip_capture01", owner: PEOPLE.yuki.id, ownerName: "Yuki", name: "Smile 😀", license: "cc-by-4.0", uses: 128, added: false, createdAt: Date.now(), icons: icons.slice(0, 6) };
    await page.route("**/api/icons**", async (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        const icon = new URL(request.url()).searchParams.get("f")?.split(".")[1] ?? "";
        const bytes = images.get(icon);
        return bytes ? route.fulfill({ status: 200, contentType: "image/webp", body: bytes }) : route.fulfill({ status: 404, body: "" });
      }
      const body = JSON.parse(request.postData() || "{}");
      if (body.action === "list") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ packs: [sale, free], next: 2 }) });
      if (body.action === "mine") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ packs: [], own: [] }) });
      return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "icons"));
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.getByText("Gatos 🐱").first().click();
    await wait(2000);
    await page.evaluate(() => localStorage.setItem("peopleViewMode", "people"));
  },
  async invite({ page, wait }) {
    // 초대 링크로 연 것처럼(?invite=) — "Yuki님이 초대했어요" 시트(고정 응답).
    await page.goto(`${BASE}/?screen=people&invite=capture01`, { waitUntil: "networkidle" });
    await wait(3000);
  },
  async groups({ page, locale, wait, target }) {
    // 메시지 탭 → 단체방 하나 → 대화(묻기 줄·통화 중 띠).
    await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
    await page.goto(`${BASE}/?screen=messages`, { waitUntil: "networkidle" });
    await wait(2500);
    const close = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await close.count()) await close.first().click();
    await page.locator("li button", { hasText: GROUP_LINES[target].name }).first().click();
    await wait(3000);
  },
  async team({ page, ui, locale, wait, target }) {
    // 메시지 탭 → 팀으로 올린 단체방 → "워크스페이스"(고정 응답).
    if (!page.__social) await socialMocks(page, target, ui);
    page.__social.team = true;
    await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
    await page.goto(`${BASE}/?screen=messages`, { waitUntil: "networkidle" });
    await wait(2500);
    const close = page.getByRole("button", { name: exactly(inviteCopyFor(locale).later) });
    if (await close.count()) await close.first().click();
    await page.locator("li button", { hasText: GROUP_LINES[target].name }).first().click();
    await wait(2500);
    await page.getByRole("tab", { name: exactly(teamCopyFor(locale).tabSpace) }).click();
    await wait(2500);
  },
  async hint({ page, ui, locale, wait, target }) {
    // 내가 방장(말하기 자리)으로 들어가 가짜 마이크로 한 마디 → 받아쓰기는 편한 말 조각(고정) → 💡 힌트.
    // 가짜 마이크 녹음은 CAPTURE_MIC_WAV(말소리가 든 wav).
    const t = roomCopyFor(locale);
    if (!page.__social) await socialMocks(page, target, ui);
    page.__social.hostMe = true;
    page.__social.hint = true;
    page.__social.hintText = HINT_FRAGMENT[locale];
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(2000);
    await page.locator("li", { hasText: roomNameFor(target) }).first().locator("button").first().click();
    const card = page.getByText(t.hintTry);
    for (let i = 0; i < 60 && !(await card.count()); i++) await wait(1000);
    if (!(await card.count())) throw new Error("no hint card");
    page.__social.hintText = "";
    await wait(1500);
  },
  async freetalk({ page, locale, wait }) {
    // 목록 맨 위 🌐 자유 대화방 + 새 방 만들기에서 "🌐 자유 대화"를 고른 모습.
    const t = roomCopyFor(locale);
    page.__social.free = true;
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(2000);
    await page.getByRole("button", { name: new RegExp(`${escape(t.newRoom)}$`) }).first().click();
    await page.getByPlaceholder(t.roomName).fill(t.freeTalk);
    await page.getByRole("button", { name: exactly(`🌐 ${t.freeTalk}`) }).first().click();
    await wait(1500);
  },
  async quote({ page, locale, wait, target }) {
    // 방에 들어가 Yuki의 첫 줄을 눌러 번역 + "무슨 뜻이에요?·답하기·쪽지로 묻기", 아래에 Omar의 질문.
    const t = roomCopyFor(locale);
    page.__social.free = false;
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "networkidle" });
    await wait(2000);
    await page.getByRole("button", { name: exactly(t.justListen) }).first().click();
    await wait(3500);
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    await page.locator('div[class*="z-[80]"] li > div > button.w-full').first().click();
    await translated;
    await wait(1200);
    // 줄 안 낱말 골라 묻기: 두 낱말을 누르면 그 사이가 구절로(en "last weekend", es "fin de semana").
    await pickPhrase(page, QUOTE_PICK[target], wait);
  },
  async "group-pick"({ page, wait, target }) {
    // 단체방에서 남의 줄을 눌러 번역 + 낱말 골라 묻기(en "works for me", es "me va bien" — ¡Yo! 뒤라 한 칸 밀림).
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    await page.getByText(GROUP_LINES[target].b, { exact: true }).filter({ visible: true }).last().click();
    await translated;
    await wait(1200);
    await pickPhrase(page, GROUP_PICK[target], wait);
  },
  async layouts({ page, locale, wait }) {
    // 2.69(다시 자름): 채팅 위주 — 자막 칸·채팅 칸과 아래 참여 방식이 같이 보인다.
    await page.locator('div[class*="z-[80]"] header').getByRole("button", { name: exactly(roomCopyFor(locale).layoutChat) }).click();
    await wait(1500);
  },
  async host({ page, locale, wait }) {
    // 내가 방장인 것처럼 바꾸고(고정 응답), 대화 보기로 돌아와 "방 닫기" → 고르기 시트.
    const t = roomCopyFor(locale);
    // 찍는 브라우저엔 마이크가 없다: 말하기 자리로 바뀔 때 조용한 가짜 마이크를 준다(안내가 안 뜨게).
    await page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = async () => new AudioContext().createMediaStreamDestination().stream;
    });
    page.__social.hostMe = true;
    await page.locator('div[class*="z-[80]"] header').getByRole("button", { name: exactly(t.viewTimeline) }).click();
    page.__social.hint = false;
    const close = page.locator('div[class*="z-[80]"] header').getByRole("button", { name: exactly(t.closeRoom) });
    for (let i = 0; i < 20 && !(await close.count()); i++) await wait(500);
    // 찍는 브라우저엔 마이크가 없어 뜨는 안내는 눌러서 닫는다(실제 폰과 무관).
    const micNotice = page.getByText(t.micDenied);
    if (await micNotice.count()) await micNotice.first().click();
    await close.click();
    await wait(1000);
  },
  async account({ page, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(2500);
  },
  async "view-map"({ page }) {
    await page.evaluate(() => localStorage.setItem("myViewMode", "map"));
  },
  async "view-net"({ page }) {
    await page.evaluate(() => localStorage.setItem("myViewMode", "net"));
  },
  async "chat-correct"({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1500);
    const before = await tutorLines(page).count();
    await page.locator("textarea:visible").first().fill(SLIPPED_LINE[target]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 60; i++) {
      await wait(500);
      if ((await tutorLines(page).count()) > before) break;
    }
    await wait(2500);
  },
  async "chat-expression"({ page, ui, locale, wait }) {
    // Continues the same conversation: a line in the learner's own language.
    await page.locator("textarea:visible").first().fill(STUCK_LINE[locale]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    const show = page.getByRole("button", { name: exactly(ui.chatShowExpression) });
    for (let i = 0; i < 60 && !(await show.count()); i++) await wait(500);
    await wait(1500);
    await show.last().click();
    const use = page.getByRole("button", { name: exactly(ui.chatUseExpression) });
    for (let i = 0; i < 40 && !(await use.count()); i++) await wait(1000);
    await wait(800);
  },
  async "chat-reading"({ page, ui, wait }) {
    const reading = page.getByRole("button", { name: exactly(ui.chatReading) });
    const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
    // 2026-10-23부터 말풍선을 눌러야 줄 할 일(듣기·번역·분석)이 열린다.
    await page.locator('[role="button"][aria-expanded="false"]').last().click();
    await wait(300);
    await reading.last().click();
    await translated;
    await wait(2000);
  },
  async "chat-ask"({ page, ui, wait, mark }) {
    await STEPS.ask({ page, ui, wait, mark });
  },
  async "chat-word"({ page, ui, wait }) {
    // Continues in the sentence sheet: one word of the sentence, its card and Save.
    // The longest word of the sentence, which is the likeliest to be worth a card.
    const words = page.locator("[role=dialog] p button");
    const texts = await words.allInnerTexts();
    let best = 0;
    texts.forEach((text, i) => {
      if (text.trim().length > texts[best].trim().length) best = i;
    });
    if (texts.length) await words.nth(best).click();
    const loading = ui.vocabPreviewLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(700);
      if (!(await page.locator("[role=dialog]").last().innerText()).includes(loading)) break;
    }
    await wait(1200);
  },
  async "chat-menu"({ page, ui, wait }) {
    // The chat can keep a request open, so "networkidle" may never come.
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    await page.getByRole("button", { name: exactly(ui.sessionMenu) }).first().click();
    await wait(800);
  },
  async "chat-history"({ page, ui, wait }) {
    await page.getByRole("button", { name: exactly(ui.chatHistoryTitle) }).first().click();
    await wait(1500);
  },
  async "vocab-search"({ page, ui, locale, wait }) {
    // 2.69부터 단어장은 My 노트 안: 옛 링크(?screen=vocab)가 노트의 단어장 시트를 연다(sim-users/screens.mjs와 같게).
    await page.goto(`${BASE}/?screen=vocab`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    await page.locator("input:visible").last().fill(VOCAB_QUERY[locale]);
    await page.getByRole("button", { name: exactly(ui.vocabSearchCta) }).last().click();
    for (let i = 0; i < 40 && !(await page.getByText(ui.vocabResultsTitle).count()); i++) await wait(500);
    await wait(1500);
  },
  async "vocab-saved"({ page, ui, wait }) {
    // Save the first two results, close the search and look at the list.
    const saves = page.getByRole("button", { name: exactly(ui.vocabSave) });
    const n = Math.min(2, await saves.count());
    for (let i = 0; i < n; i++) {
      await page.getByRole("button", { name: exactly(ui.vocabSave) }).first().click();
      await wait(1200);
    }
    // 단어장이 노트 시트 안이라(2.69) 같은 이름의 "닫기"가 둘: 검색 결과의 것(맨 위 층)을 닫는다.
    await page.getByRole("button", { name: exactly(ui.vocabPreviewClose) }).last().click();
    await wait(2500);
    // 그래도 노트가 닫혔으면 단어장을 다시 연다(저장한 단어는 기기에 남아 있다).
    if (!(await page.getByText(ui.vocabSavedTitle).count())) {
      await page.goto(`${BASE}/?screen=vocab`, { waitUntil: "domcontentloaded" });
      await wait(4000);
    }
    await page.getByText(ui.vocabSavedTitle).first().scrollIntoViewIfNeeded();
    await wait(800);
  },
  async "vocab-hide"({ page, ui, wait }) {
    await page.getByRole("button", { name: exactly(ui.vocabHideGloss) }).first().click();
    await wait(1000);
  },
  async "vocab-characters"({ page, ui, locale, wait }) {
    // The characters tab appears when the learning language is written in
    // another script: Japanese, or Korean for the Japanese interface.
    await page.evaluate((t) => localStorage.setItem("appTargetLanguage", t), locale === "ja" ? "ko" : "ja");
    await page.goto(`${BASE}/?screen=vocab`, { waitUntil: "networkidle" });
    await wait(1500);
    await page.getByRole("button", { name: exactly(ui.vocabTabCharacters) }).first().click();
    await wait(2000);
  },
  async next({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    if (await page.getByRole("button", { name: ui.mapDraw }).count()) await STEPS.map({ page, ui, locale, wait });
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    for (let i = 0; i < 30 && !(await page.getByRole("button", { name: ui.nextByChat }).count()); i++) await wait(500);
    await wait(1200);
  },
  async growth({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    for (const line of CLEAN_LINES[target]) {
      const before = await tutorLines(page).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await tutorLines(page).count()) > before) break;
      }
      await wait(1500);
    }
    // Growth is written after the reply has gone out.
    await wait(4000);
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
    await wait(5000);
    await page.locator(`section[aria-label="${ui.myNetworkTitle}"]`).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -90);
    await wait(800);
  },
  async element({ page, ui, wait }) {
    await page.locator(`[aria-label^="${ui.myElAccuracy}"]`).first().click();
    await wait(1500);
  },
  async myask({ page, ui, wait }) {
    await page.locator("[role=dialog]").getByRole("button", { name: ui.billingClose }).first().click();
    await wait(600);
    await page.getByRole("button", { name: exactly(ui.myAskQuick1) }).first().click();
    await wait(1000);
    for (let i = 0; i < 45 && (await page.getByText(ui.myAskThinking).count()); i++) await wait(1000);
    await wait(800);
    await page.getByRole("button", { name: new RegExp(escape(ui.myGrowIt)) }).first().scrollIntoViewIfNeeded().catch(() => undefined);
    await page.mouse.wheel(0, 120);
    await wait(800);
  },
  async graph({ page, ui, wait }) {
    await page.getByRole("button", { name: exactly(ui.myViewGraph) }).first().click();
    await wait(1200);
    await page.locator(`section[aria-label="${ui.myNetworkTitle}"]`).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -90);
    await wait(800);
  },
  async mapview({ page, ui, wait }) {
    const toggle = page.getByRole("button", { name: exactly(ui.myViewMap) }).first();
    await toggle.click();
    await wait(1800);
    await page.locator(`section[aria-label="${ui.myNetworkTitle}"]`).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -90);
    await wait(800);
  },
  async chatnext({ page, ui, wait }) {
    // A fresh conversation, so the card shows.
    await page.evaluate(() => {
      for (const key of ["conversationSessions", "activeConversationSessionId", "activeConversationSessionIds"]) localStorage.removeItem(key);
    });
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(3000);
    for (let i = 0; i < 30 && !(await page.getByRole("button", { name: ui.nextByChat }).count()); i++) await wait(500);
    await page.getByRole("button", { name: ui.nextByChat }).first().click();
    for (let i = 0; i < 40 && !(await page.getByText(ui.practiceNow).count()); i++) await wait(500);
    await wait(5000);
  },
  async "video-library"({ page, ui, wait }) {
    await page.goto(`${BASE}/?screen=video`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.getByText(ui.videoLearnLibraryTitle).first().scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 120);
    await wait(1500);
  },
  async "video-study"({ page, wait, target }) {
    const session = VIDEO_SESSION[target];
    await page.evaluate(([language, seed]) => {
      const now = Date.now();
      const cues = seed.lines.map((original, i) => ({ id: `guide-${i}`, startTime: 3 + i * 4, endTime: 7 + i * 4, original }));
      localStorage.setItem("videoStudySessions", JSON.stringify([{
        id: "guide-capture", videoId: seed.videoId, videoUrl: `https://www.youtube.com/watch?v=${seed.videoId}`,
        situationSummary: seed.summary, durationSeconds: 7 + seed.lines.length * 4, cues, baselineCues: cues,
        languageCode: language, createdAt: now, updatedAt: now,
      }]));
    }, [target, session]);
    await page.goto(`${BASE}/?screen=video`, { waitUntil: "networkidle" });
    await wait(2000);
    await page.getByText(session.lines[0]).first().click();
    for (let i = 0; i < 30 && !(await page.locator("ul li [role=button]").count()); i++) await wait(500);
    await wait(1500);
    // Pick the second line so the card above shows a subtitle, as during playback.
    // 짧은 줄은 한 구간으로 묶일 수 있다(일본어·중국어): 줄이 하나뿐이면 그 줄을.
    const rows = page.locator("ul li [role=button]");
    await rows.nth((await rows.count()) > 1 ? 1 : 0).click();
    await wait(800);
    await page.evaluate((videoId) => {
      for (const frame of document.querySelectorAll("iframe")) {
        const still = document.createElement("img");
        still.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        still.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
        frame.replaceWith(still);
      }
    }, session.videoId);
    await wait(1500);
  },
  async "video-bar"({ page, wait }) {
    // Continues from video-study: the bar beside the subtitle on the card.
    // The first bar on the page is not always the card's; try each until the sheet opens.
    const bars = page.locator("button.w-1");
    const n = await bars.count();
    for (let i = 0; i < n && !(await page.locator("[role=dialog] [role=slider]").count()); i++) {
      await bars.nth(i).click({ force: true }).catch(() => undefined);
      for (let t = 0; t < 10 && !(await page.locator("[role=dialog] [role=slider]").count()); t++) await wait(500);
    }
    await page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 15000 }).catch(() => undefined);
    await wait(2000);
  },
  async "video-ask"({ page, ui, wait, mark = () => {} }) {
    // Continues from video-bar: the sheet is open on the subtitle.
    const slider = page.locator("[role=dialog] [role=slider]").first();
    const box = await slider.boundingBox();
    const count = await slider.locator("> span").count();
    const x = (i) => box.x + (box.width * (i + 0.5)) / count;
    const y = box.y + box.height / 2;
    mark("clipStart");
    await page.mouse.move(x(Math.max(0, count - 3)), y);
    await wait(400);
    await page.mouse.down();
    await page.mouse.move(x(count - 1), y, { steps: 12 });
    await wait(300);
    await page.mouse.up();
    await wait(900);
    await page.getByRole("button", { name: ui.quickAskMeaning }).click();
    const loading = ui.askLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(1000);
      if (!(await page.locator("[role=dialog]").last().innerText()).includes(loading)) break;
    }
    await wait(1000);
    mark("clipEnd");
  },
  // 2.71 새로워진 점·사용법: 고친 문장 칩(눌러서 보기)이 보이는 같은 장면.
  async "chat-fix"(context) {
    await STEPS["chat-correct"](context);
  },
  async "chat-fix-open"({ page, ui, wait }) {
    // chat-correct 다음: 마지막 고친 문장 칩을 눌러 펼친 모습.
    const chip = page.getByRole("button", { name: new RegExp(escape(ui.chatCorrectionChip)) }).last();
    if (await chip.count()) {
      await chip.click();
      // 확인 모델이 끝날 때까지("확인 중…" 칩이 사라질 때까지) 기다린다.
      for (let i = 0; i < 40; i++) {
        await wait(500);
        const busy = await page.getByRole("button", { name: new RegExp(escape(ui.chatCorrectionChecking ?? "\u0000")) }).count();
        if (!busy && i > 2) break;
      }
      await wait(800);
    }
  },
  async "stage-start"({ page, ui, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    const title = page.getByText(ui.stageCheckTitle, { exact: true });
    for (let i = 0; i < 40 && !(await title.count()); i++) await wait(500);
    await title.first().scrollIntoViewIfNeeded();
    await wait(800);
  },
  async goal({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    // The map starts from ticks (learner/selfCheck.ts): two gaps, a focus, a use.
    await page.getByRole("button", { name: exactly(ui.selfGapSpeaking) }).click();
    await page.getByRole("button", { name: exactly(ui.selfGapListening) }).click();
    await page.getByRole("button", { name: exactly(ui.selfFocusSpeaking) }).click();
    await page.getByRole("button", { name: exactly(ui.selfUseTravel) }).click();
    await page.getByRole("button", { name: ui.mapDraw }).scrollIntoViewIfNeeded();
    await wait(600);
  },
  async ledger({ page, ui, locale, wait, target }) {
    await page.evaluate(async ([language, seed]) => {
      await fetch("/api/learner/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, meets: seed.map(([text, tab]) => ({ kind: "save", text, tab })) }),
      });
    }, [target, LEDGER_SEED[target]]);
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    // The pick picture needs a map to put the phrase on.
    if (await page.getByRole("button", { name: ui.mapDraw }).count()) await STEPS.map({ page, ui, locale, wait });
    await page.getByRole("button", { name: new RegExp(escape(ui.ledgerTitle)) }).first().click();
    await wait(2500);
  },
  async links({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(2000);
    const before = await tutorLines(page).count();
    await page.locator("textarea:visible").first().fill(LINK_LINE[target]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 60; i++) {
      await wait(500);
      if ((await tutorLines(page).count()) > before) break;
    }
    await wait(2500);
    const link = ui.linkMetIn.split("{place}")[1]?.trim() || ui.linkMetIn.split("{place}")[0].trim();
    await page.getByText(link).last().scrollIntoViewIfNeeded().catch(() => undefined);
    await wait(600);
  },
  async pick({ page, ui, wait }) {
    // Continues from the links step: a phrase from the tutor's reply.
    await STEPS.ask({ page, ui, wait });
    await page.getByRole("button", { name: exactly(ui.markUnknown) }).first().click();
    await wait(800);
    await page.getByRole("button", { name: exactly(ui.markToMap) }).first().click();
    const done = ui.markedToMap.split("{topic}")[0].trim();
    for (let i = 0; i < 60; i++) {
      await wait(1000);
      if (done && (await page.locator("[role=dialog]").innerText()).includes(done)) break;
    }
    await page.getByRole("button", { name: exactly(ui.markOpenMap) }).first().scrollIntoViewIfNeeded().catch(() => undefined);
    await wait(800);
  },
  async "call-pack"({ page, ui, wait }) {
    // 2026-10-23부터 오늘의 팩은 대화 목록 AI 튜터 아래(통화 첫 화면 없음). 사람 기능이 없는 빌드면 AI 대화의 빈 화면.
    await page.goto(`${BASE}/?screen=talk`, { waitUntil: "domcontentloaded" });
    const card = page.getByText(exactly(ui.packTitle)).first();
    for (let i = 0; i < 40 && !(await card.count()); i++) await wait(500);
    if (!(await card.count())) throw new Error("no pack card");
    await wait(1500);
  },
  async "call-talk"({ page, ui, wait }) {
    // Continues from the door: the pack call, its band and the tutor's first line.
    await page.getByRole("button", { name: new RegExp(`^${escape(ui.packStart)}|^${escape(ui.packContinue.split("(")[0].trim())}`) }).first().click();
    const band = page.getByText(new RegExp(escape(ui.packProgress.split("{n}")[0].trim()))).first();
    for (let i = 0; i < 40 && !(await band.count()); i++) await wait(500);
    // The first line on screen; taken before the fake microphone's tone is heard as a turn.
    await wait(6000);
  },
  async "call-review"({ page, ui, locale, wait, target }) {
    await STEPS.calltools({ page, ui, locale, wait, target });
  },
  async "call-ownline"({ page, ui, wait, target }) {
    // 2026-10-23부터 AI 대화 ⋮ → "내 문장 말해보기"(시트).
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    const menu = page.getByRole("button", { name: exactly(ui.sessionMenu) });
    for (let i = 0; i < 40 && !(await menu.count()); i++) await wait(500);
    await wait(2500);
    const own = page.getByRole("button", { name: exactly(ui.roleplayOwnLineOpen) });
    for (let i = 0; i < 4 && !(await own.count()); i++) {
      await menu.first().click();
      await wait(1200);
    }
    await own.first().click();
    await wait(800);
    const field = page.getByLabel(ui.roleplayOwnLinePlaceholder);
    await field.fill(OWN_LINE[target] ?? OWN_LINE.en);
    await field.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await wait(800);
  },
  async calltools({ page, ui, locale, wait, target }) {
    const said = PAST_CALL[target].map((line, i) =>
      // The help offered when they stalled before "I waited…", not the correction.
      i === 5 ? { ...line, tip: `${TIP_LEAD[locale]} “${line.better.split(". ").pop()}”` } : line,
    );
    await STEPS.meant({ page, ui, wait, target, said });
    // 막혔을 때 도움말 + 다시 말해보기(있으면) — 둘째 줄의 칩도 연다.
    const chips = page.locator('div[class*="z-[70]"]').last().getByRole("button", { name: exactly(ui.chatCorrectionChip) });
    if ((await chips.count()) > 0) await chips.last().click().catch(() => undefined);
    await wait(1200);
    await page.getByRole("button", { name: exactly(ui.roleplaySayAgain) }).first().scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => undefined);
    await wait(800);
  },
  async chat({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1200);
    await page.locator("textarea:visible").first().fill(STUCK_LINE[locale]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    const show = page.getByRole("button", { name: exactly(ui.chatShowExpression) });
    for (let i = 0; i < 40 && !(await show.count()); i++) await wait(500);
    await wait(1500);
    await show.first().click();
    const use = page.getByRole("button", { name: exactly(ui.chatUseExpression) });
    for (let i = 0; i < 40 && !(await use.count()); i++) await wait(1000);
    await wait(600);
  },
  async ask({ page, ui, wait, mark = () => {} }) {
    // Continues from the chat step: the tutor's reply is the sentence asked about.
    // 2026-10-23부터 줄을 눌러야 분석 버튼이 열리고, 여러 문장이면 고른다(conversation/LineTools) — 가장 긴 문장.
    await openLineAnalysis(page, ui, wait);
    await wait(4500);
    const slider = page.locator("[role=slider]");
    const box = await slider.boundingBox();
    const count = await page.locator("[role=slider] > span").count();
    const x = (i) => box.x + (box.width * (i + 0.5)) / count;
    const y = box.y + box.height / 2;
    mark("clipStart");
    await page.mouse.move(x(Math.max(0, count - 3)), y);
    await wait(400);
    await page.mouse.down();
    await page.mouse.move(x(count - 1), y, { steps: 12 });
    await wait(300);
    await page.mouse.up();
    await wait(900);
    await page.getByRole("button", { name: ui.quickAskMeaning }).click();
    const loading = ui.askLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(1000);
      if (!(await page.locator("[role=dialog]").innerText()).includes(loading)) break;
    }
    await wait(800);
    mark("clipEnd");
  },
  async map({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    await page.getByRole("button", { name: exactly(ui.selfGapSpeaking) }).click();
    await page.getByRole("button", { name: exactly(ui.selfFocusSpeaking) }).click();
    await page.locator("textarea:visible").first().fill(GOAL[locale]);
    await page.getByRole("button", { name: ui.mapDraw }).click();
    const drawing = ui.mapDrawing.split("…")[0];
    for (let i = 0; i < 120; i++) {
      await wait(1000);
      if (!(await page.locator("body").innerText()).includes(drawing)) break;
    }
    await wait(1200);
  },
  async mission({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    if (await page.getByRole("button", { name: ui.mapDraw }).count()) await STEPS.map({ page, ui, locale, wait });
    await page.getByRole("button", { name: new RegExp(escape(ui.mapContinue)) }).first().click();
    await wait(1000);
    const missions = page.waitForResponse((r) => r.url().includes("/api/curriculum/missions"), { timeout: 90000 });
    await page.getByRole("button", { name: new RegExp(escape(ui.missionStart)) }).first().click();
    const data = await (await missions).json();
    const order = [...data.missions.filter((m) => m.weak), ...data.missions.filter((m) => !m.weak)];
    await wait(1200);
    await page.getByRole("button", { name: exactly(ui.missionHint) }).click();
    await wait(500);
    await page.locator("textarea:visible").last().fill(withSlip(order[0].answer));
    await page.getByRole("button", { name: exactly(ui.missionCheck) }).click();
    const checking = ui.missionChecking.replace("…", "");
    for (let i = 0; i < 45; i++) {
      await wait(1000);
      if (!(await page.locator("body").innerText()).includes(checking)) break;
    }
    await wait(1500);
  },
  async progress({ page, ui, wait }) {
    // Continues from the mission: back on the map, the topic's phrases by state.
    // 정확히 "닫기"만: 이름에 같은 낱말이 든 다른 버튼(스페인어 Cerrar…)을 누르지 않게.
    await page.getByRole("button", { name: exactly(ui.billingClose) }).first().click();
    // The map reloads its counts when the task screen closes.
    await page.waitForResponse((r) => r.url().includes("/api/curriculum?"), { timeout: 30000 }).catch(() => undefined);
    await wait(2000);
    await page.getByRole("button", { name: new RegExp(escape(ui.mapContinue)) }).first().click();
    for (let i = 0; i < 20 && !(await page.getByText(ui.topicItemsTitle).count()); i++) await wait(500);
    await wait(1200);
  },
  async weak({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1200);
    for (const line of REPEATED_MISTAKE[target]) {
      const before = await tutorLines(page).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await tutorLines(page).count()) > before) break;
      }
      await wait(1500);
    }
    // The map takes the mistake in after the reply has gone out.
    const chip = ui.mapWeakChip.split("{n}")[0].trim();
    for (let i = 0; i < 24; i++) {
      await wait(5000);
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
      await wait(1500);
      if ((await page.locator("body").innerText()).includes(chip)) break;
    }
    await page.getByText(ui.mapOrderTitle).first().scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, -260);
    await wait(800);
  },
  async meant({ page, ui, wait, target, said: lines }) {
    const now = Date.now();
    await page.evaluate(([said, language, at]) => {
      const saved = [{
        id: "whats-new-capture", scenarioId: "cafe-order", language,
        title: said.find((l) => l.who === "learner").text, startedAt: at - 600000, updatedAt: at, finishedAt: at,
        state: { scenarioId: "cafe-order", nodeId: "done", mode: "free", difficulty: {}, attempts: 0, hintShown: false,
          listeningSince: null, visited: [], queue: [], pending: null, freeTurns: 0, directedTurns: 0, history: [],
          closing: false, finished: true },
        said, memory: { text: "", upTo: 0 },
      }];
      localStorage.setItem("roleplayConversations", JSON.stringify(saved));
    }, [lines ?? PAST_CALL[target], target, now]);
    // 2026-10-23부터 지난 통화는 AI 대화 ⋮ → 채팅 기록의 "통화" 목록(과 대화 안 🗒 카드).
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(3000);
    await page.getByRole("button", { name: exactly(ui.sessionMenu) }).first().click();
    await page.getByRole("button", { name: exactly(ui.chatHistoryTitle) }).first().click();
    await wait(800);
    await page.getByRole("button", { name: new RegExp(escape(PAST_CALL[target][1].text)) }).first().click();
    await wait(1500);
    // 2026-10-23부터 돌아보기는 줄 아래 ✎ 칩(눌러야 하려던 말 카드) — 첫 칩을 연다.
    const chip = page.locator('div[class*="z-[70]"]').last().getByRole("button", { name: exactly(ui.chatCorrectionChip) });
    if (await chip.count()) {
      await chip.first().click({ timeout: 5000 }).catch(() => undefined);
      await wait(1500);
    }
  },
};

/** 홍보 녹화 마무리: 바뀔 때만 온 프레임을 다음 프레임까지 보여 주는 25fps 영상으로, 장면 시각은 영상 기준 초로. */
async function finishPromo(dir, frames, events) {
  const { execFileSync } = await import("node:child_process");
  const start = frames[0].at;
  const end = events.end ?? frames.at(-1).at + 1;
  const list = frames.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.01, (i + 1 < frames.length ? frames[i + 1].at : end) - f.at).toFixed(3)}`).join("\n");
  fs.writeFileSync(path.join(dir, "frames.txt"), `${list}\nfile '${frames.at(-1).file}'\n`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(dir, "frames.txt"),
    "-vf", "fps=25,scale=824:1830:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", path.join(dir, "raw.mp4")]);
  for (const key of Object.keys(events)) if (typeof events[key] === "number") events[key] = +(events[key] - start).toFixed(3);
  fs.rmSync(path.join(dir, "frames"), { recursive: true, force: true });
  fs.writeFileSync(path.join(dir, "events.json"), JSON.stringify(events, null, 2));
}

/**
 * 사용법 그림에 "여기를 누르세요" 테두리(2026-10-20). 글은 그림 옆(사용법 칸)에만 쓰고 그림 안에는 넣지 않는다 —
 * 14개 언어로 같은 설명을 또 쓰지 않게, 600px로 줄였을 때 읽히지 않는 글자를 만들지 않게.
 * 단계가 끝난 화면에서 그 칸의 글이 가리키는 버튼을 찾는다. 못 찾으면 테두리 없이 찍는다.
 */
const exactLabel = (page, name) => page.getByRole("button", { name: exactly(name) });
const SPOTS = {
  "stage-start": ({ page, ui }) => page.getByRole("button", { name: exactly(ui.stageCan) }).locator(".."),
  goal: ({ page, ui }) => page.getByRole("button", { name: ui.mapDraw }),
  "chat-fix": ({ page, ui }) => page.getByRole("button", { name: new RegExp(escape(ui.chatCorrectionChip)) }).last(),
  next: ({ page, ui }) => page.getByRole("button", { name: ui.nextByChat }),
  growth: ({ page, ui }) => page.getByText(ui.myNext, { exact: true }),
  graph: ({ page, ui }) => exactLabel(page, ui.myViewGraph),
  element: ({ page, ui }) => page.locator("[role=dialog]").getByRole("button", { name: new RegExp(escape(ui.myGrowIt)) }),
  myask: ({ page, ui }) => page.getByRole("button", { name: new RegExp(escape(ui.myGrowIt)) }),
  mapview: ({ page, ui }) => exactLabel(page, ui.myViewMap),
  chatnext: ({ page, ui }) => page.getByText(ui.practiceNow, { exact: true }),
  "chat-expression": ({ page, ui }) => exactLabel(page, ui.chatUseExpression).last(),
  "chat-reading": ({ page, ui }) => exactLabel(page, ui.chatReading).last(),
  "chat-ask": ({ page }) => page.locator("[role=dialog] [role=slider]"),
  "chat-word": ({ page, ui }) => page.locator("[role=dialog]").last().getByRole("button", { name: exactly(ui.vocabSave) }).last(),
  "chat-menu": ({ page, ui }) => exactLabel(page, ui.chatHistoryTitle),
  "vocab-search": ({ page, ui }) => exactLabel(page, ui.vocabSearchCta).last(),
  "vocab-saved": ({ page, ui }) => page.getByText(ui.vocabSavedTitle),
  "vocab-hide": ({ page, ui }) => exactLabel(page, ui.vocabHideGloss),
  "vocab-characters": ({ page, ui }) => exactLabel(page, ui.vocabTabCharacters),
  "video-library": ({ page, ui }) => page.getByText(ui.videoLearnLibraryTitle),
  "video-ask": ({ page }) => page.locator("[role=dialog] [role=slider]"),
  "call-pack": ({ page, ui }) => page.getByRole("button", { name: new RegExp(`^${escape(ui.packStart)}|^${escape(ui.packContinue.split("(")[0].trim())}`) }),
  "call-talk": ({ page, ui }) => page.getByText(new RegExp(escape(ui.packProgress.split("{n}")[0].trim()))),
  "call-review": ({ page, ui }) => exactLabel(page, ui.roleplaySayAgain),
  "call-ownline": ({ page, ui }) => exactLabel(page, ui.roleplayOwnLineUse),
  "r69-free": ({ page, locale }) => exactLabel(page, `🌐 ${roomCopyFor(locale).freeTalk}`),
  "talk-list": ({ page, ui }) => page.getByRole("button", { name: new RegExp(escape(ui.talkAiTutor)) }),
  "invite-rewards": ({ page, locale }) => page.getByText(`🎁 ${inviteCopyFor(locale).rewardTitle}`, { exact: true }).locator(".."),
};

async function drawSpot(page, item, ui, locale) {
  const make = SPOTS[item.shot];
  if (!GUIDE || !make) return false;
  const target = make({ page, ui, locale }).first();
  if (!(await target.count().catch(() => 0)) || !(await target.isVisible().catch(() => false))) {
    console.log(`  (테두리 없음: ${item.shot})`);
    return false;
  }
  await target.scrollIntoViewIfNeeded().catch(() => undefined);
  const box = await target.boundingBox();
  if (!box) return false;
  await page.evaluate((b) => {
    const ring = document.createElement("div");
    ring.id = "__capture_spot";
    const pad = 5;
    ring.style.cssText = `position:fixed;left:${b.x - pad}px;top:${b.y - pad}px;width:${b.width + pad * 2}px;height:${b.height + pad * 2}px;` +
      "border:3px solid #fbbf24;border-radius:12px;box-shadow:0 0 0 5px rgba(251,191,36,.28);z-index:2147483647;pointer-events:none";
    document.body.appendChild(ring);
  }, box);
  return true;
}
async function clearSpot(page) {
  await page.evaluate(() => document.getElementById("__capture_spot")?.remove()).catch(() => undefined);
}

/** 끌기 같은 동작은 짧은 영상으로(사용법 칸 `clip`). 프레임 → 600px mp4, 그림과 같게 위아래를 자른다. */
async function saveClip(all, locale, shot, events) {
  const from = typeof events.clipStart === "number" ? events.clipStart - 0.3 : -Infinity;
  const to = typeof events.clipEnd === "number" ? events.clipEnd + 1.5 : Infinity;
  const frames = all.filter((f) => f.at >= from && f.at <= to);
  if (frames.length < 5) return;
  const { execFileSync } = await import("node:child_process");
  const dir = path.join(ROOT, "public", "guide", locale);
  const work = path.join(ROOT, "tmp", "clip", locale, shot);
  fs.mkdirSync(work, { recursive: true });
  const end = frames.at(-1).at + 1.2;
  const list = frames.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.01, (i + 1 < frames.length ? frames[i + 1].at : end) - f.at).toFixed(3)}`).join("\n");
  fs.writeFileSync(path.join(work, "frames.txt"), `${list}\nfile '${frames.at(-1).file}'\n`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(work, "frames.txt"),
    "-vf", "fps=15,crop=iw:ih*0.838:0:ih*0.092,scale=600:-2:flags=lanczos,format=yuv420p",
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-movflags", "+faststart", path.join(dir, `${shot}.mp4`)]);
  fs.rmSync(work, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "tmp", "clip", locale, "frames"), { recursive: true, force: true });
}

// CAPTURE_TARGET=ja: 배우는 언어를 바꿔 찍는다(맞춤 등록정보 "배우는 언어별 검색어"). 결과는 tmp/store-raw/<앱 언어>-<배우는 언어>/.
const TARGET_OVERRIDE = process.env.CAPTURE_TARGET || "";
function TARGET_FOR(locale) {
  return TARGET_OVERRIDE || (locale === "en" ? (GUIDE_CALL ? "ja" : "es") : "en");
}

/** Without the header and the tab bar, which say nothing about the change. */
async function save(png, locale, shot) {
  if (STORE) {
    // The whole screen, tab bar included: the store frame shows the app as it is.
    const dir = path.join(ROOT, "tmp", process.env.CAPTURE_IOS === "1" ? "store-raw-ios" : "store-raw", TARGET_OVERRIDE ? `${locale}-${TARGET_OVERRIDE}` : locale);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${shot}.png`), png);
    return;
  }
  const dir = GUIDE
    ? path.join(ROOT, "public", "guide", locale)
    : path.join(ROOT, "public", "whats-new", VERSION, locale);
  fs.mkdirSync(dir, { recursive: true });
  const image = sharp(png);
  const { width, height } = await image.metadata();
  const top = Math.round(height * 0.092);
  const bottom = Math.round(height * 0.07);
  await image
    .extract({ left: 0, top, width, height: height - top - bottom })
    .resize({ width: 600 })
    .webp({ quality: 72 })
    .toFile(path.join(dir, `${shot}.webp`));
}

const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  // The call opens the microphone; a fake one answers the permission prompt.
  ...(GUIDE_CALL || process.env.CAPTURE_MIC_WAV
    ? { args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required", ...(process.env.CAPTURE_MIC_WAV ? [`--use-file-for-fake-audio-capture=${process.env.CAPTURE_MIC_WAV}`] : [])] }
    : {}),
});
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
let failed = 0;
for (const locale of only ?? Object.keys(copy)) {
  const ui = copy[locale];
  // The store frame expects a 20:9 phone (store-shots/frame.html).
  // CAPTURE_IOS=1: App Store 스크린샷 — 6.9인치 아이폰(440×956, 3배 = 1320×2868), 앱이 iOS로 돎(사람 기능 없는 하단 탭·AI 동의 넘김),
  // tmp/store-raw-ios/<locale>/. 앱 모드라 API를 운영 주소로 바로 부르므로 그 요청을 받아 CORS를 붙여 돌려준다.
  const IOS = process.env.CAPTURE_IOS === "1";
  const captureUser = `${process.env.CAPTURE_USER || `whats-new-capture-${day}${process.env.CAPTURE_RUN ? `-${process.env.CAPTURE_RUN}` : ""}`}-${locale}${TARGET_OVERRIDE ? `-${TARGET_OVERRIDE}` : ""}`;
  const context = await browser.newContext({ viewport: IOS ? { width: 440, height: 956 } : { width: 412, height: STORE ? 915 : 860 }, deviceScaleFactor: IOS ? 3 : 2, isMobile: true, hasTouch: true, ...(GUIDE_CALL || process.env.CAPTURE_MIC_WAV ? { permissions: ["microphone"] } : {}) });
  if (IOS) {
    await context.addInitScript(() => {
      window.CapacitorCustomPlatform = { name: "ios", plugins: {} };
      try { localStorage.setItem("aiDataConsent", "capture"); } catch {}
    });
  }
  const page = await context.newPage();
  await page.route("**/api/**", (route) =>
    route.continue({ headers: { ...route.request().headers(), "x-rc-user": captureUser } }),
  );
  if (IOS) {
    await page.route(`${API}/**`, async (route) => {
      const cors = { "access-control-allow-origin": BASE, "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS" };
      if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
      try {
        const response = await route.fetch({ headers: { ...route.request().headers(), "x-rc-user": captureUser }, timeout: 120_000 }); // 지도 그리기(Sonnet)는 40초 넘게 걸림 — 기본 30초면 끊김
        await route.fulfill({ response, headers: { ...response.headers(), ...cors } });
      } catch {
        await route.abort();
      }
    });
  }
  const wait = (ms) => page.waitForTimeout(ms);
  // 2.69 웹: 화면에 따라 주기적으로 묻는 요청이 이어져 networkidle이 안 올 때가 있다 — 15초 기다려 보고 넘어간다.
  const rawGoto = page.goto.bind(page);
  page.goto = async (url, opts = {}) => {
    if (opts.waitUntil !== "networkidle") return rawGoto(url, opts);
    try {
      return await rawGoto(url, { ...opts, timeout: 15000 });
    } catch (error) {
      if (!String(error).includes("Timeout")) throw error;
      await page.waitForTimeout(1500);
      return null;
    }
  };
  // 화면이 깨지면(오류 페이지) 그대로 찍히니 원인을 남긴다.
  page.on("pageerror", (error) => console.log(`  [${locale} 페이지 오류] ${String(error).slice(0, 400)}`));
  // 홍보 녹화: 누른 곳 표시 + Chrome 화면 전송 프레임 + 장면 시각.
  const events = {};
  // 시각은 숫자, 글자(예: 힌트 문장)는 두 번째 값으로.
  const mark = (name, value) => (events[name] = value === undefined ? Date.now() / 1000 : value);
  const frames = [];
  let cdp = null;
  const promoDir = path.join(ROOT, "tmp", "promo", PROMO_NAME, locale);
  if (PROMO || GUIDE) {
    if (PROMO) {
      fs.rmSync(promoDir, { recursive: true, force: true });
      fs.mkdirSync(path.join(promoDir, "frames"), { recursive: true });
    }
    await context.addInitScript(() => {
      addEventListener("pointerdown", (e) => {
        const dot = document.createElement("div");
        dot.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.8);z-index:99999;pointer-events:none;transition:transform .45s ease-out,opacity .45s ease-out`;
        document.body.appendChild(dot);
        requestAnimationFrame(() => { dot.style.transform = "scale(1.8)"; dot.style.opacity = "0"; });
        setTimeout(() => dot.remove(), 600);
      }, true);
      // 끄는 동안 손가락 자리(사용법 영상).
      addEventListener("pointermove", (e) => {
        if (!e.buttons) return;
        const dot = document.createElement("div");
        dot.style.cssText = `position:fixed;left:${e.clientX - 14}px;top:${e.clientY - 14}px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.3);border:2px solid rgba(255,255,255,.75);z-index:99999;pointer-events:none;transition:opacity .4s ease-out`;
        document.body.appendChild(dot);
        requestAnimationFrame(() => { dot.style.opacity = "0"; });
        setTimeout(() => dot.remove(), 450);
      }, true);
    });
    cdp = await context.newCDPSession(page);
    cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
      const frameDir = PROMO ? path.join(promoDir, "frames") : path.join(ROOT, "tmp", "clip", locale, "frames");
      fs.mkdirSync(frameDir, { recursive: true });
      const file = path.join(frameDir, `${String(frames.length).padStart(5, "0")}.jpg`);
      fs.writeFileSync(file, Buffer.from(data, "base64"));
      frames.push({ file, at: metadata.timestamp });
      await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
    });
  }
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([target, uiLocale]) => {
      localStorage.setItem("appTargetLanguage", target);
      localStorage.setItem("appUiLocale", uiLocale);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("callDataNoticeSeen.v1", "1");
      localStorage.setItem("myViewMode.stageShown", "1"); // 장면이 고른 My 보기를 첫 열기 "단계"가 덮지 않게
    }, [TARGET_FOR(locale), locale]);
    const target = TARGET_FOR(locale);
    // CAPTURE_SHOTS=chat,pick retakes only those, for a language whose run stopped partway.
    const onlyShots = process.env.CAPTURE_SHOTS?.split(",");
    for (const item of note.items) {
      if (onlyShots && !onlyShots.includes(item.shot)) continue;
      // 오늘의 팩은 영어·일본어 학습만 있다(pack/questions.ts): 다른 배우는 언어는 팩 장면을 건너뛴다.
      if (STORE && ["call-pack", "call-talk"].includes(item.shot) && !["en", "ja"].includes(target)) continue;
      const step = STEPS[item.step ?? item.shot];
      if (!step) throw new Error(`no capture step for "${item.shot}"`);
      const recording = (PROMO || (GUIDE && item.clip)) && cdp;
      if (recording) {
        frames.length = 0;
        await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, maxWidth: 824, maxHeight: 1830, everyNthFrame: 1 });
      }
      await step({ page, ui, locale, wait, target, mark });
      if (GUIDE && item.clip && cdp) {
        await wait(1200);
        await cdp.send("Page.stopScreencast").catch(() => {});
        await saveClip(frames, locale, item.shot, events);
        delete events.clipStart;
        delete events.clipEnd;
        console.log(`${locale} ${item.shot} (영상 ${frames.length}프레임)`);
      }
      if (PROMO && cdp) {
        await cdp.send("Page.stopScreencast").catch(() => {});
        await finishPromo(promoDir, frames, events);
        console.log(`${locale} promo → ${path.relative(ROOT, promoDir)}/raw.mp4`);
      }
      if (item.save === false) continue;
      const spotted = await drawSpot(page, item, ui, locale);
      await save(await page.screenshot(), locale, item.shot);
      if (spotted) await clearSpot(page);
      console.log(`${locale} ${item.shot}`);
    }
  } catch (error) {
    await page.screenshot({ path: path.join(ROOT, "tmp", `capture-failed-${locale}.png`) }).catch(() => undefined);
    failed += 1;
    console.log(`${locale} FAILED: ${String(error?.stack ?? error).slice(0, 900)}`);
  }
  await context.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
