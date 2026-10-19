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
const GUIDE = VERSION === "guide" || GUIDE_VIDEO || GUIDE_CHAT || GUIDE_VOCAB || GUIDE_CALL;
const GUIDE_ITEMS = [
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
  { shot: "video-ask" },
];
const GUIDE_CHAT_ITEMS = [
  { shot: "chat-correct" },
  { shot: "chat-expression" },
  { shot: "chat-reading" },
  { shot: "chat-ask" },
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
];
const STORE_TABS_ITEMS = [
  { shot: "chat-correct" },
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
  { shot: "invite" },
  { shot: "groups" },
  { shot: "freetalk" },
  { shot: "quote" },
  { shot: "layouts" },
  { shot: "rooms-mini" },
  { shot: "hint" },
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
};

/** A line with one everyday mistake, in the language being learned. */
const SLIPPED_LINE = {
  en: "Yesterday I go to the beach with my friends and we swim a lot.",
  es: "Ayer yo voy a la playa con mis amigos y nadamos mucho.",
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
};

/**
 * Phrases the ledger already holds before a picture of "My phrases" is taken,
 * and where each was met, so the sheet shows more than one source.
 */
const LEDGER_SEED = {
  en: [["catch up", "video"], ["on the same page", "vocab"], ["make it up to you", "chat"], ["no worries", "roleplay"], ["stood me up", "video"]],
  es: [["ponerse al día", "video"], ["estar en la misma onda", "vocab"], ["no pasa nada", "roleplay"], ["me dejó plantado", "video"]],
};

/** A line using a phrase met in a video, so the chat says where it came from. */
const LINK_LINE = {
  en: "My friend stood me up again last night, so I had dinner alone.",
  es: "Mi amigo me dejó plantado otra vez anoche y cené solo.",
};

/** Lines with nothing to correct, so the My tab's network has grown a little. */
const CLEAN_LINES = {
  en: ["I usually walk to work when the weather is nice.", "We had dinner at a small Italian place last night.", "Could you send me the file before the meeting?"],
  es: ["Normalmente voy andando al trabajo cuando hace buen tiempo.", "Anoche cenamos en un restaurante italiano pequeño.", "¿Me puedes mandar el archivo antes de la reunión?"],
};

/** "Try saying:", for the help shown when a learner was stuck in a call. */
/** A sentence typed into "say a sentence of your own", in the language learned. */
const OWN_LINE = { en: "Could you say that one more time, please?", ja: "もう一度言ってもらえますか？", es: "¿Me lo puedes repetir, por favor?" };

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
};
// 2.69 힌트 장면: 상대가 나이를 묻고, 나는 편한 말로 "어.. 스물둘.."(받아쓰기는 고정 응답, 힌트는 운영 /api/chat).
const HINT_QUESTION = { en: "How old are you?", es: "¿Cuántos años tienes?" };
const HINT_FRAGMENT = {
  ko: "어.. 스물둘..", en: "uh... I'm twenty-two", es: "eh… veintidós", ja: "えっと…にじゅうに", zh: "呃…二十二", vi: "ờ… hai mươi hai", fr: "euh… vingt-deux",
  it: "ehm… ventidue", pt: "é… vinte e dois", ru: "э-э… двадцать два", id: "eh… dua puluh dua", ar: "اممم… اثنان وعشرون", th: "อืม... ยี่สิบสอง", hi: "उम्म… बाईस",
};
// 2.69 단체방 장면: 이름과 글(학습 언어).
const GROUP_LINES = {
  en: { name: "Study buddies ☕", a: "Who wants to practice tonight?", b: "Me! After dinner works for me.", c: "Let’s call at 9." },
  es: { name: "Compañeros ☕", a: "¿Quién quiere practicar esta noche?", b: "¡Yo! Después de cenar me va bien.", c: "Llamamos a las nueve." },
};
const DM_LINES = {
  en: { hi: "Hi! Thanks for the chat in the room.", reply: "It was fun! Do you want to practice again tomorrow?" },
  es: { hi: "¡Hola! Gracias por la charla en la sala.", reply: "¡Fue divertido! ¿Practicamos otra vez mañana?" },
};
// 2.69 노트 장면: 쌓인 표현(장부, 고정 응답)·단어장 한 개·문장분석 질문 하나, 자리는 미리 정해 둠(서버 안 부름).
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
};
// 2.69 러닝메이트·팀 장면: 단체방을 팀으로 올린 워크스페이스(고정 응답) — 목표·정기 모임·같이 한 날·쌓인 것.
const TEAM_SPACE = {
  en: { goal: "Each of us tells one story from the weekend", phrase: "It was a piece of cake.", share: ["catch up", "to talk after not seeing each other"], call: ["How was your weekend?", "I went hiking with my sister.", "Nice! Where did you go?"] },
  es: { goal: "Cada uno cuenta una historia del fin de semana", phrase: "Fue pan comido.", share: ["ponerse al día", "hablar después de no verse"], call: ["¿Qué tal tu fin de semana?", "Fui de excursión con mi hermana.", "¡Qué bien! ¿Adónde fuisteis?"] },
};
function socialMocks(page, target, ui) {
  const now = Date.now();
  // 2.69 host 장면: 내가 방장이 된 것처럼(물을 때마다 읽음).
  page.__social = page.__social ?? { hostMe: false };
  const roomName = target === "es" ? "Español ↔ 日本語" : "English ↔ 日本語";
  const baseRoom = { id: "capt01", name: roomName, languages: [target, "ja"], hostPeerId: "p_yukiyukiyuki", hostAccountId: PEOPLE.yuki.id, hostNickname: "Yuki", createdAt: now - 600_000 };
  const member = (key, peerId, role, extra = {}) => ({ peerId, nickname: PEOPLE[key].nickname, role, muted: false, hand: false, accountId: PEOPLE[key].id, langs: [target, "ja"], joinedAt: now - 500_000, lastSeen: Date.now(), ...extra }); // 응답 때마다 지금: 오래되면 앱이 나간 사람으로 지운다
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
  const profile = (key) => ({ id: PEOPLE[key].id, nickname: PEOPLE[key].nickname, bio: "", photo: PEOPLE[key].photo, since: "2026-09", followers: 12, following: 8, hosted: 5, helped: 9, isMe: key === "me", isFollowing: false, blockedByMe: false });
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
      const free = { id: "capt03", name: target === "es" ? "🌍 Charla de los viernes" : "🌍 Friday chat", languages: [], free: true, hostPeerId: peers.lucia, hostAccountId: PEOPLE.lucia.id, hostNickname: "Lucía", createdAt: now - 300_000, speakers: 3, listeners: 1, faces: [faces[1], faces[0], faces[2]] };
      if (body.action === "list") return json(route, { rooms: [...(page.__social.free ? [free] : []), { ...room, speakers: 2, listeners: 2, faces, followed: true }] });
      if (body.action === "join") return json(route, { member: members[3], room, now: Date.now() });
      if (body.action === "poll" && page.__social.live) {
        const at = page.__social.revealedAt ?? {};
        const shown = lines
          .filter((l) => l.seq <= (page.__social.shown ?? 0) && l.seq > (body.since ?? 0))
          .map((l) => ({ ...l, startedAt: at[l.seq] - 2500, endedAt: at[l.seq] }));
        return json(route, { now: Date.now(), room, members, signals: [], lines: shown });
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
            { id: PEOPLE.yuki.id, nickname: "Yuki", bio: "🇯🇵 → 🌏 ☕ 🎧", hasPhoto: true, ui: "ja", learn: target, lastSeen: seen(1), isFollowing: true },
            { id: PEOPLE.lucia.id, nickname: "Lucía", bio: "🇪🇸 → 🇯🇵 🍣 📚", hasPhoto: true, ui: "es", learn: "ja", lastSeen: seen(40), isFollowing: false },
            { id: PEOPLE.omar.id, nickname: "Omar", bio: "🇪🇬 → 🌍 ⚽", hasPhoto: true, ui: "ar", learn: target, lastSeen: seen(60 * 26), isFollowing: false },
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
      const group = { id: "g_capturegrp", name: g.name, languages: [target, "ja"], owner: PEOPLE.me.id, members: [PEOPLE.me.id, PEOPLE.yuki.id, PEOPLE.lucia.id, PEOPLE.omar.id], invited: [], callRoomId: "capt04", createdAt: now - 86_400_000, lastAt: now - 60_000, lastText: g.c, lastFrom: PEOPLE.lucia.id, lastSeq: 6 };
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
    await tapAt(page, page.locator("li", { hasText: target === "es" ? "Español ↔ 日本語" : "English ↔ 日本語" }).first().locator("button").first());
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
    await tapAt(page, page.locator("li", { hasText: target === "es" ? "Español ↔ 日本語" : "English ↔ 日本語" }).first().locator("button").first());
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
    const chatTab = page.getByRole("button", { name: exactly(ui.homeTabChat) });
    if (!(await chatTab.count()) && ui.modeAi) await page.getByText(ui.modeAi, { exact: true }).first().click();
    await wait(800);
    await chatTab.last().click();
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
      localStorage.setItem("boardFilter", "all");
    });
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
  },
  async people({ page, ui, wait, target }) {
    // 2.69: 화면 위 스위치 "사람과 학습" → 사람 탭(고정 응답).
    await socialMocks(page, target, ui);
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "networkidle" });
    await wait(2500);
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
    await page.locator("li", { hasText: target === "es" ? "Español ↔ 日本語" : "English ↔ 日本語" }).first().locator("button").first().click();
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
  async quote({ page, locale, wait }) {
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
    const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
    await page.locator("textarea:visible").first().fill(SLIPPED_LINE[target]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 60; i++) {
      await wait(500);
      if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before + 1) break;
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
    await reading.last().click();
    await translated;
    await wait(2000);
  },
  async "chat-ask"({ page, ui, wait }) {
    await STEPS.ask({ page, ui, wait });
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
    await page.getByRole("button", { name: exactly(ui.vocabPreviewClose) }).first().click();
    await wait(2500);
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
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
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
    await page.locator("ul li [role=button]").nth(1).click();
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
  async "video-ask"({ page, ui, wait }) {
    // Continues from video-bar: the sheet is open on the subtitle.
    const slider = page.locator("[role=dialog] [role=slider]").first();
    const box = await slider.boundingBox();
    const count = await slider.locator("> span").count();
    const x = (i) => box.x + (box.width * (i + 0.5)) / count;
    const y = box.y + box.height / 2;
    await page.mouse.move(x(Math.max(0, count - 3)), y);
    await page.mouse.down();
    await page.mouse.move(x(count - 1), y, { steps: 5 });
    await page.mouse.up();
    await wait(700);
    await page.getByRole("button", { name: ui.quickAskMeaning }).click();
    const loading = ui.askLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(1000);
      if (!(await page.locator("[role=dialog]").last().innerText()).includes(loading)) break;
    }
    await wait(1000);
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
    const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
    await page.locator("textarea:visible").first().fill(LINK_LINE[target]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 60; i++) {
      await wait(500);
      if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
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
    // The call tab can keep a request open, so "networkidle" may never come.
    await page.goto(`${BASE}/?screen=roleplay`, { waitUntil: "domcontentloaded" });
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
    await page.goto(`${BASE}/?screen=roleplay`, { waitUntil: "domcontentloaded" });
    const open = page.getByRole("button", { name: exactly(ui.roleplayOwnLineOpen) });
    for (let i = 0; i < 40 && !(await open.count()); i++) await wait(500);
    await open.first().click();
    await wait(800);
    const field = page.getByPlaceholder(ui.roleplayOwnLinePlaceholder);
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
    await page.getByRole("button", { name: exactly(ui.roleplaySayAgain) }).first().scrollIntoViewIfNeeded();
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
  async ask({ page, ui, wait }) {
    // Continues from the chat step: the tutor's reply is the sentence asked about.
    await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).last().click();
    await wait(4500);
    const slider = page.locator("[role=slider]");
    const box = await slider.boundingBox();
    const count = await page.locator("[role=slider] > span").count();
    const x = (i) => box.x + (box.width * (i + 0.5)) / count;
    const y = box.y + box.height / 2;
    await page.mouse.move(x(Math.max(0, count - 3)), y);
    await page.mouse.down();
    await page.mouse.move(x(count - 1), y, { steps: 5 });
    await page.mouse.up();
    await wait(700);
    await page.getByRole("button", { name: ui.quickAskMeaning }).click();
    const loading = ui.askLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(1000);
      if (!(await page.locator("[role=dialog]").innerText()).includes(loading)) break;
    }
    await wait(800);
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
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
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
    // The call tab can keep a request open, so "networkidle" may never come.
    await page.goto(`${BASE}/?screen=roleplay`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    await page.getByRole("button", { name: new RegExp(escape(PAST_CALL[target][1].text)) }).first().click();
    await wait(1500);
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

/** Without the header and the tab bar, which say nothing about the change. */
async function save(png, locale, shot) {
  if (STORE) {
    // The whole screen, tab bar included: the store frame shows the app as it is.
    const dir = path.join(ROOT, "tmp", "store-raw", locale);
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
  const context = await browser.newContext({ viewport: { width: 412, height: STORE ? 915 : 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ...(GUIDE_CALL || process.env.CAPTURE_MIC_WAV ? { permissions: ["microphone"] } : {}) });
  const page = await context.newPage();
  await page.route("**/api/**", (route) =>
    route.continue({ headers: { ...route.request().headers(), "x-rc-user": `${process.env.CAPTURE_USER || `whats-new-capture-${day}${process.env.CAPTURE_RUN ? `-${process.env.CAPTURE_RUN}` : ""}`}-${locale}` } }),
  );
  const wait = (ms) => page.waitForTimeout(ms);
  // 홍보 녹화: 누른 곳 표시 + Chrome 화면 전송 프레임 + 장면 시각.
  const events = {};
  // 시각은 숫자, 글자(예: 힌트 문장)는 두 번째 값으로.
  const mark = (name, value) => (events[name] = value === undefined ? Date.now() / 1000 : value);
  const frames = [];
  let cdp = null;
  const promoDir = path.join(ROOT, "tmp", "promo", PROMO_NAME, locale);
  if (PROMO) {
    fs.rmSync(promoDir, { recursive: true, force: true });
    fs.mkdirSync(path.join(promoDir, "frames"), { recursive: true });
    await context.addInitScript(() => {
      addEventListener("pointerdown", (e) => {
        const dot = document.createElement("div");
        dot.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.8);z-index:99999;pointer-events:none;transition:transform .45s ease-out,opacity .45s ease-out`;
        document.body.appendChild(dot);
        requestAnimationFrame(() => { dot.style.transform = "scale(1.8)"; dot.style.opacity = "0"; });
        setTimeout(() => dot.remove(), 600);
      }, true);
    });
    cdp = await context.newCDPSession(page);
    cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
      const file = path.join(promoDir, "frames", `${String(frames.length).padStart(5, "0")}.jpg`);
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
    }, [locale === "en" ? (GUIDE_CALL ? "ja" : "es") : "en", locale]);
    const target = locale === "en" ? (GUIDE_CALL ? "ja" : "es") : "en";
    // CAPTURE_SHOTS=chat,pick retakes only those, for a language whose run stopped partway.
    const onlyShots = process.env.CAPTURE_SHOTS?.split(",");
    for (const item of note.items) {
      if (onlyShots && !onlyShots.includes(item.shot)) continue;
      const step = STEPS[item.shot];
      if (!step) throw new Error(`no capture step for "${item.shot}"`);
      if (PROMO && cdp) await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 824, maxHeight: 1830, everyNthFrame: 1 });
      await step({ page, ui, locale, wait, target, mark });
      if (PROMO && cdp) {
        await cdp.send("Page.stopScreencast").catch(() => {});
        await finishPromo(promoDir, frames, events);
        console.log(`${locale} promo → ${path.relative(ROOT, promoDir)}/raw.mp4`);
      }
      if (item.save === false) continue;
      await save(await page.screenshot(), locale, item.shot);
      console.log(`${locale} ${item.shot}`);
    }
  } catch (error) {
    await page.screenshot({ path: path.join(ROOT, "tmp", `capture-failed-${locale}.png`) }).catch(() => undefined);
    failed += 1;
    console.log(`${locale} FAILED: ${String(error).slice(0, 300)}`);
  }
  await context.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
