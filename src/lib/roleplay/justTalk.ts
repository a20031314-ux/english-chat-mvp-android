import type { LearningLanguageCode } from "../learningLanguages.ts";
import type { RoleplayScenario, SentenceBank } from "./script.ts";

/**
 * "Just talk", in every language the app teaches.
 *
 * The scripted scenes are written one language at a time and their recordings
 * ship inside the app — eight English scenes are already four megabytes — so a
 * full set for fourteen languages is a download nobody wants. This one scene
 * costs almost nothing to add: only the greeting and the goodbye are recorded,
 * two files a language, and everything between them is the character speaking
 * now, synthesised in the same voice.
 *
 * That it exists everywhere matters more than it looks. Calling used to be a
 * realtime call reached from the chat screen, which worked in any language; the
 * scripted tab never did. Folding the two together would have left everyone not
 * learning English with nothing to speak to, and this is what fills that in.
 *
 * What a language needs is small and all of it is here: the two lines, their
 * gloss, the ways people actually say goodbye, a voice, and a title. The brief
 * the model reads stays in English because it is the model's, not the
 * learner's, and it is the same conversation in every language.
 */

/** Everything that differs between one language's "Just talk" and another's. */
type JustTalk = {
  language: LearningLanguageCode;
  /** Shown in the scene list, in the language being learned. */
  title: string;
  voice: string;
  greeting: string;
  goodbye: string;
  /**
   * Gloss for both lines, in the learner's own language. Undefined where the
   * line already is that language.
   */
  greetingGloss?: string;
  goodbyeGloss?: string;
  /** The ways a person ends this conversation, as the scene will hear them. */
  leaving: string[];
};

/**
 * Korean, because every gloss in the catalog is Korean: the app is written for
 * Korean speakers first and the scripted scenes were too. Reaching the other
 * interface languages means carrying a gloss per pair, which is a larger change
 * than this one and is not pretended at here.
 */
const HELLO_GLOSS = "안녕! 만나서 반가워. 오늘 하루 어때?";
const BYE_GLOSS = "좋아, 얘기 즐거웠어. 다음에 또 봐!";

const LANGUAGES: JustTalk[] = [
  {
    language: "en",
    title: "Just talk",
    voice: "marin",
    greeting: "Hey! Good to see you. How's your day going?",
    goodbye: "Alright — it was really nice talking to you. See you next time!",
    greetingGloss: "안녕! 반가워. 오늘 하루 어때?",
    goodbyeGloss: "좋아, 얘기 즐거웠어. 다음에 또 봐!",
    leaving: [
      "goodbye",
      "i have to go",
      "i gotta go",
      "talk to you later",
      "see you later",
    ],
  },
  {
    language: "ko",
    title: "그냥 수다",
    voice: "sage",
    greeting: "안녕! 얼굴 보니까 좋다. 오늘 하루 어땠어?",
    goodbye: "좋아, 오늘 얘기 진짜 즐거웠어. 다음에 또 보자!",
    leaving: ["안녕히 계세요", "이제 가볼게", "다음에 봐", "그만 가봐야겠어", "잘 있어"],
  },
  {
    language: "ja",
    title: "ただ話す",
    voice: "nova",
    greeting: "やあ！会えてうれしいよ。今日はどんな一日だった？",
    goodbye: "うん、話せて楽しかった。またね！",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["またね", "そろそろ行くね", "またあとで", "さようなら", "じゃあね"],
  },
  {
    language: "zh",
    title: "随便聊聊",
    voice: "shimmer",
    greeting: "嘿！见到你真好。今天过得怎么样？",
    goodbye: "好，今天聊得很开心。下次见！",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["再见", "我该走了", "下次见", "回头见", "拜拜"],
  },
  {
    language: "es",
    title: "Solo charlar",
    voice: "verse",
    greeting: "¡Hola! Qué bueno verte. ¿Cómo va tu día?",
    goodbye: "Bueno, me encantó charlar contigo. ¡Hasta la próxima!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["adiós", "me tengo que ir", "hasta luego", "nos vemos", "chao"],
  },
  {
    language: "fr",
    title: "Juste discuter",
    voice: "ballad",
    greeting: "Salut ! Ça fait plaisir de te voir. Ta journée se passe comment ?",
    goodbye: "Allez, c'était vraiment sympa de parler avec toi. À la prochaine !",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["au revoir", "je dois y aller", "à plus tard", "à bientôt", "je file"],
  },
  {
    language: "it",
    title: "Solo due chiacchiere",
    voice: "coral",
    greeting: "Ciao! Che piacere vederti. Com'è andata la giornata?",
    goodbye: "Dai, è stato davvero bello parlare con te. Alla prossima!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["arrivederci", "devo andare", "a dopo", "ci vediamo", "ciao ciao"],
  },
  {
    language: "pt",
    title: "Só conversar",
    voice: "alloy",
    greeting: "Oi! Que bom te ver. Como foi seu dia?",
    goodbye: "Beleza, adorei conversar com você. Até a próxima!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["tchau", "tenho que ir", "até logo", "a gente se vê", "até mais"],
  },
  {
    language: "ru",
    title: "Просто поболтать",
    voice: "ash",
    greeting: "Привет! Рад тебя видеть. Как прошёл день?",
    goodbye: "Ладно, было очень приятно поговорить. До скорого!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["пока", "мне пора", "до скорого", "увидимся", "до свидания"],
  },
  {
    language: "ar",
    title: "مجرد دردشة",
    voice: "onyx",
    greeting: "أهلاً! سعيد برؤيتك. كيف كان يومك؟",
    goodbye: "طيب، سعدت بالحديث معك. إلى اللقاء!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["مع السلامة", "يجب أن أذهب", "إلى اللقاء", "أراك لاحقا", "وداعا"],
  },
  {
    language: "id",
    title: "Ngobrol santai",
    voice: "echo",
    greeting: "Hai! Senang ketemu kamu. Gimana harimu?",
    goodbye: "Oke, senang banget ngobrol sama kamu. Sampai ketemu lagi!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["dadah", "aku harus pergi", "sampai jumpa", "ketemu lagi ya", "selamat tinggal"],
  },
  {
    language: "vi",
    title: "Chỉ trò chuyện",
    voice: "fable",
    greeting: "Chào bạn! Gặp bạn vui quá. Hôm nay của bạn thế nào?",
    goodbye: "Rồi, nói chuyện với bạn vui lắm. Hẹn gặp lại nhé!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["tạm biệt", "mình phải đi rồi", "hẹn gặp lại", "gặp lại sau", "chào nhé"],
  },
  {
    language: "th",
    title: "คุยเล่น",
    voice: "cedar",
    greeting: "สวัสดี! ดีใจที่ได้เจอนะ วันนี้เป็นยังไงบ้าง",
    goodbye: "โอเค คุยกับเธอสนุกมากเลย ไว้เจอกันใหม่นะ",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["ลาก่อน", "ต้องไปแล้ว", "ไว้เจอกันใหม่", "แล้วเจอกัน", "บ๊ายบาย"],
  },
  {
    language: "hi",
    title: "बस बातचीत",
    voice: "marin",
    greeting: "अरे! तुमसे मिलकर अच्छा लगा। आज का दिन कैसा रहा?",
    goodbye: "ठीक है, तुमसे बात करके मज़ा आया। फिर मिलेंगे!",
    greetingGloss: HELLO_GLOSS,
    goodbyeGloss: BYE_GLOSS,
    leaving: ["अलविदा", "मुझे जाना है", "फिर मिलेंगे", "बाद में मिलते हैं", "चलता हूँ"],
  },
];

/**
 * What keeps a conversation going, as opposed to what finishes an errand.
 *
 * The scripted scenes are made of lines that answer a step — "what size?",
 * "card or cash?" — and none of them fit a conversation about somebody's
 * weekend. These belong to no step: a reaction, a follow-up question, asking
 * someone to say it again. They were drafted, read by a model that did not
 * write them, and none tripped the list.
 *
 * They ship as words rather than as audio: sixty kilobytes a line is what kept
 * the bank at ninety-three sentences, and a line can be spoken without a file
 * now. Warmed into the edge before a release so that the first person to hear
 * one does not wait.
 *
 * Japanese has its own set below. The other twelve languages have none, and
 * their character writes every line it says.
 */
const TALK_LINES_EN: SentenceBank = {
  "talk.go-on": { text: "Oh really? Tell me more.", translation: "정말요? 좀 더 얘기해 주세요.", source: "grown" },
  "talk.nice": { text: "That sounds great.", translation: "좋네요.", source: "grown" },
  "talk.rough": { text: "Oh no, that sounds rough.", translation: "아이고, 힘들었겠어요.", source: "grown" },
  "talk.same": { text: "Same here, actually.", translation: "저도 그래요.", source: "grown" },
  "talk.how-was": { text: "How was it?", translation: "어땠어요?", source: "grown" },
  "talk.why": { text: "Oh yeah? Why's that?", translation: "그래요? 왜요?", source: "grown" },
  "talk.when": { text: "When was that?", translation: "그게 언제였어요?", source: "grown" },
  "talk.who-with": { text: "Who did you go with?", translation: "누구랑 갔어요?", source: "grown" },
  "talk.often": { text: "Do you do that a lot?", translation: "자주 하세요?", source: "grown" },
  "talk.pardon": { text: "Sorry, say that again?", translation: "죄송해요, 다시 한 번요?", source: "grown" },
  "talk.didnt-catch": { text: "I didn't quite catch that.", translation: "잘 못 들었어요.", source: "grown" },
  "talk.slower": { text: "Take your time.", translation: "천천히 하세요.", source: "grown" },
  "talk.you-mean": { text: "You mean like on the weekend?", translation: "주말에 말이죠?", source: "grown" },
  "talk.by-the-way": { text: "Oh, by the way —", translation: "아 그런데요,", source: "grown" },
  "talk.speaking-of": { text: "Speaking of which, how's work?", translation: "그러고 보니 일은 어때요?", source: "grown" },
  "talk.and-you": { text: "What about you?", translation: "그쪽은요?", source: "grown" },
  "talk.agree": { text: "Yeah, exactly.", translation: "네, 맞아요.", source: "grown" },
  "talk.surprised": { text: "Wait, seriously?", translation: "잠깐, 진짜요?", source: "grown" },
  "talk.think-so": { text: "Hmm, I'm not sure about that one.", translation: "음, 그건 잘 모르겠네요.", source: "grown" },
  "talk.there-what": { text: "What did you do there?", translation: "거기서 뭐 했어요?", source: "grown" },
  "talk.there-long": { text: "How long were you there?", translation: "거기 얼마나 있었어요?", source: "grown" },
  "talk.then-what": { text: "And then what?", translation: "그다음엔 뭐 했어요?", source: "grown" },
  "talk.next": { text: "What happened next?", translation: "그다음엔요?", source: "grown" },
  "talk.how-go": { text: "How did that go?", translation: "그건 어떻게 됐어요?", source: "grown" },
  "talk.hard": { text: "Was it hard?", translation: "힘들었어요?", source: "grown" },
  "talk.what-like": { text: "What are they like?", translation: "그 사람들 어때요?", source: "grown" },
  "talk.how-know": { text: "How do you know them?", translation: "어떻게 아는 사이예요?", source: "grown" },
  "talk.who-else": { text: "Who else was there?", translation: "또 누가 있었어요?", source: "grown" },
  "talk.again": { text: "Would you do it again?", translation: "또 할 거예요?", source: "grown" },
  "talk.why-that": { text: "What made you choose that?", translation: "왜 그걸 골랐어요?", source: "grown" },
  "talk.feel": { text: "How did you feel about it?", translation: "어떤 기분이었어요?", source: "grown" },
  "talk.always": { text: "Has it always been like that?", translation: "원래 그래요?", source: "grown" },
  "talk.best-part": { text: "What's the best part of it?", translation: "제일 좋은 게 뭐예요?", source: "grown" },
  "talk.busy": { text: "Is it always that busy?", translation: "항상 그렇게 바빠요?", source: "grown" },
  "talk.good-point": { text: "That's a good point.", translation: "좋은 지적이에요.", source: "grown" },
  "talk.tough": { text: "That must have been tough.", translation: "많이 힘들었겠어요.", source: "grown" },
  "talk.glad": { text: "I'm glad it worked out.", translation: "잘 돼서 다행이에요.", source: "grown" },
  "talk.impressive": { text: "Wow, that's impressive.", translation: "와, 대단하네요.", source: "grown" },
  "talk.funny": { text: "Ha, that's funny.", translation: "하하, 재밌네요.", source: "grown" },
  "talk.makes-sense": { text: "Ah, that makes sense.", translation: "아, 그렇구나.", source: "grown" },
  "talk.never-done": { text: "I've never done that.", translation: "저는 그거 해 본 적 없어요.", source: "grown" },
  "talk.jealous": { text: "Honestly, I'm a bit jealous.", translation: "솔직히 좀 부럽네요.", source: "grown" },
  "talk.know-feeling": { text: "Yeah, I know that feeling.", translation: "네, 그 기분 알아요.", source: "grown" },
  "talk.since-when": { text: "How long have you been doing that?", translation: "그거 한 지 얼마나 됐어요?", source: "grown" },
  "talk.worth-it": { text: "Was it worth it?", translation: "할 만했어요?", source: "grown" },
  "talk.hard-part": { text: "What's the hardest part?", translation: "제일 힘든 게 뭐예요?", source: "grown" },
  "talk.how-start": { text: "How did that start?", translation: "어쩌다 그렇게 된 거예요?", source: "grown" },
  "talk.where-that": { text: "Where was that?", translation: "그게 어디였어요?", source: "grown" },
  "talk.they-say": { text: "What did they say?", translation: "그 사람들은 뭐래요?", source: "grown" },
  "talk.any-help": { text: "Does anyone help with that?", translation: "그거 도와주는 사람은 있어요?", source: "grown" },
  "talk.how-long-take": { text: "How long did that take?", translation: "그거 얼마나 걸렸어요?", source: "grown" },
  "talk.ok-now": { text: "Are they doing okay now?", translation: "그분 지금은 괜찮아요?", source: "grown" },
  "talk.what-next": { text: "So what's next?", translation: "그럼 이제 뭐 할 거예요?", source: "grown" },
};

/**
 * The same, in Japanese.
 *
 * Drafted by scripts/draft-roleplay-repertoire.mjs, which is given three things
 * the English set had to be written without: what goes wrong in Japanese in its
 * own terms (lib/languageFocus.ts), the scene's own two lines as the register to
 * hold, and each id as a job to fill rather than a string to translate. Read
 * afterwards by a model that did not write them, which passed fifty and put
 * three in front of a person — the same shape the English pass had, and all
 * three were things only a reader of the language could see: 自分 reading rough
 * for some speakers, a line about being crowded under a gloss about being busy,
 * and a missing particle. Those three are corrected here.
 *
 * The register held on its own: every line is plain, matching やあ！会えてうれしいよ,
 * with no です/ます anywhere. That was the instruction worth giving as an example
 * rather than as a rule.
 */
const TALK_LINES_JA: SentenceBank = {
  "talk.go-on": { text: "へえ、もっと教えてよ。", translation: "그래? 더 이야기해줘.", source: "grown" },
  "talk.nice": { text: "それ、いいね。", translation: "좋네.", source: "grown" },
  "talk.rough": { text: "うわ、それは大変だったね。", translation: "아이고, 힘들었겠다.", source: "grown" },
  "talk.same": { text: "あ、実は私もそうだったよ。", translation: "나도 사실 그런데.", source: "grown" },
  "talk.how-was": { text: "どうだった？", translation: "어땠어?", source: "grown" },
  "talk.why": { text: "そうなんだ、なんで？", translation: "그래? 왜?", source: "grown" },
  "talk.when": { text: "それ、いつだったの？", translation: "그거 언제였어?", source: "grown" },
  "talk.who-with": { text: "誰と行ったの？", translation: "누구랑 갔어?", source: "grown" },
  "talk.often": { text: "それ、よくやるの？", translation: "그거 자주 해?", source: "grown" },
  "talk.pardon": { text: "ごめん、もう一回言ってくれる？", translation: "미안, 다시 말해줄래?", source: "grown" },
  "talk.didnt-catch": { text: "ちょっと聞き取れなかった。", translation: "잘 못 들었어.", source: "grown" },
  "talk.slower": { text: "ゆっくりで大丈夫だよ。", translation: "천천히 말해도 돼.", source: "grown" },
  "talk.you-mean": { text: "あ、週末みたいな感じ？", translation: "아, 주말처럼?", source: "grown" },
  "talk.by-the-way": { text: "あ、ところでさ―", translation: "아, 근데 있잖아―", source: "grown" },
  "talk.speaking-of": { text: "そういえば、仕事はどう？", translation: "그러고 보니, 일은 어때?", source: "grown" },
  "talk.and-you": { text: "で、そっちは？", translation: "너는?", source: "grown" },
  "talk.agree": { text: "うん、ほんとそれ。", translation: "응, 진짜 그래.", source: "grown" },
  "talk.surprised": { text: "え、マジで？", translation: "에, 진짜야?", source: "grown" },
  "talk.think-so": { text: "うーん、それはどうかな。", translation: "음… 그건 잘 모르겠다.", source: "grown" },
  "talk.there-what": { text: "そこで何したの？", translation: "거기서 뭐 했어?", source: "grown" },
  "talk.there-long": { text: "どれくらいそこにいたの？", translation: "거기 얼마나 있었어?", source: "grown" },
  "talk.then-what": { text: "そのあとどうなったの？", translation: "그다음엔 어떻게 됐어?", source: "grown" },
  "talk.next": { text: "次はどうなった？", translation: "다음에는 어떻게 됐어?", source: "grown" },
  "talk.how-go": { text: "うまくいった？", translation: "잘 됐어?", source: "grown" },
  "talk.hard": { text: "それ、難しかった？", translation: "그거 어려웠어?", source: "grown" },
  "talk.what-like": { text: "どんな人？", translation: "어떤 사람이야?", source: "grown" },
  "talk.how-know": { text: "その人とはどうやって知り合ったの？", translation: "그 사람이랑 어떻게 알게 됐어?", source: "grown" },
  "talk.who-else": { text: "他には誰がいたの？", translation: "다른 사람도 있었어?", source: "grown" },
  "talk.again": { text: "またやりたいと思う？", translation: "다시 하고 싶어?", source: "grown" },
  "talk.why-that": { text: "それはどうして選んだの？", translation: "왜 그걸 골랐어?", source: "grown" },
  "talk.feel": { text: "それについてどう感じた？", translation: "그거 어떻게 느꼈어?", source: "grown" },
  "talk.always": { text: "前からずっとそうだったの？", translation: "전부터 쭉 그랬어?", source: "grown" },
  "talk.best-part": { text: "一番良かったところは？", translation: "제일 좋았던 점이 뭐야?", source: "grown" },
  "talk.busy": { text: "いつもそんなに忙しいの？", translation: "항상 그렇게 바빠?", source: "grown" },
  "talk.good-point": { text: "それ、いいとこついてるね。", translation: "그거 좋은 지적이야.", source: "grown" },
  "talk.tough": { text: "それはきっとつらかったよね。", translation: "그거 많이 힘들었겠다.", source: "grown" },
  "talk.glad": { text: "うまくいってよかったね。", translation: "잘 돼서 다행이다.", source: "grown" },
  "talk.impressive": { text: "すごいね、それ！", translation: "대단하다!", source: "grown" },
  "talk.funny": { text: "あはは、それ面白いね。", translation: "하하, 그거 웃기네.", source: "grown" },
  "talk.makes-sense": { text: "あー、なるほどね。", translation: "아, 그렇구나.", source: "grown" },
  "talk.never-done": { text: "それやったことないなあ。", translation: "그건 해본 적 없어.", source: "grown" },
  "talk.jealous": { text: "正直、ちょっとうらやましいな。", translation: "솔직히 좀 부럽다.", source: "grown" },
  "talk.know-feeling": { text: "うん、その気持ちわかるよ。", translation: "그 기분 나도 알아.", source: "grown" },
  "talk.since-when": { text: "いつからそれやってるの？", translation: "언제부터 그거 했어?", source: "grown" },
  "talk.worth-it": { text: "やってみてよかった？", translation: "해볼 만했어?", source: "grown" },
  "talk.hard-part": { text: "一番大変なのはどこ？", translation: "제일 힘든 부분이 뭐야?", source: "grown" },
  "talk.how-start": { text: "それ、どうやって始めたの？", translation: "그거 어떻게 시작하게 됐어?", source: "grown" },
  "talk.where-that": { text: "それってどこだった？", translation: "그거 어디였어?", source: "grown" },
  "talk.they-say": { text: "その人、なんて言ってた？", translation: "그 사람이 뭐라고 했어?", source: "grown" },
  "talk.any-help": { text: "それ誰か手伝ってくれるの？", translation: "그거 누가 도와줘?", source: "grown" },
  "talk.how-long-take": { text: "どのくらいかかったの？", translation: "얼마나 걸렸어?", source: "grown" },
  "talk.ok-now": { text: "今はもう大丈夫？", translation: "지금은 괜찮아?", source: "grown" },
  "talk.what-next": { text: "じゃあ、次はどうするの？", translation: "그럼 이제 어떻게 할 거야?", source: "grown" },
};

/**
 * The languages whose open conversation has lines of its own.
 *
 * Add a row to give a language a bank; everything else — the two-line turn, the
 * cooldown that stops a line repeating, the edge warming, the counters — reads
 * this and needs no change. Twelve languages still have none and their
 * character writes every line it says.
 */
const TALK_LINES: Partial<Record<LearningLanguageCode, SentenceBank>> = {
  en: TALK_LINES_EN,
  ja: TALK_LINES_JA,
};

/**
 * The release that first carried each language's lines inside the app.
 *
 * A repertoire line is named by id and resolved against the bank compiled into
 * the APK, so the server can only answer with one to a build that has it. The
 * server deploys on a push and the app arrives weeks later, which makes every
 * language added here a compatibility question rather than only a content one.
 *
 * It is not enough to ask whether a build understands the bank at all — that is
 * what x-roleplay-bank asks, and 2.53 answers yes while holding no Japanese
 * lines whatsoever. Simulated against the bank 2.53 actually ships: nothing is
 * queued and the microphone opens, which is the character saying nothing.
 *
 * So the question is per language and the answer is a version. A build older
 * than this is offered no repertoire for that language and its character writes
 * its own lines, which is exactly what every language without a bank does
 * today — the fallback is the present, not a worse version of it.
 *
 * Adding a language means adding its row here too, naming the release that will
 * carry it. Naming one that has already shipped without the lines is the one
 * mistake this cannot catch.
 */
export const REPERTOIRE_SINCE: Partial<Record<LearningLanguageCode, string>> = {
  en: "2.52",
  ja: "2.54",
};

/**
 * Whether the character is offered the bank's lines in an open conversation.
 *
 * Off, on a measurement rather than a feeling. Twelve turns, twice, with a
 * model that did not write them judging whether each reply answered what was
 * said: the bank led sixteen turns and five did not fit, against none of the
 * eight the character wrote for itself. A reply that does not fit teaches the
 * wrong thing, which is a worse price than the one it was buying — five per
 * cent of a minute and about a second of waiting.
 *
 * The failures were not bad lines. "That sounds great." opened eight turns in
 * twelve; taking it and every other judging line out moved the problem rather
 * than fixing it, and "Oh really? Tell me more." took over five turns in eight,
 * answering "i went to busan last weekend" with "Where was that?" A line
 * written in advance cannot know what has already been said, and the model
 * reaches for one as a gesture rather than because it fits — shorten the list
 * and it reaches for whatever is left.
 *
 * This is the second time the offer has been withdrawn. The first was when
 * nothing picked them at all; they are picked now, which is the improvement
 * that made this measurable, and they are picked wrongly a quarter of the time.
 *
 * What stays is everything except the offer. The lines are still written, still
 * reviewed, still in the bank; the two-line turn, the cooldown, the version
 * bridge and the warming all still work and all go quiet, because they read the
 * scene's repertoire and it is empty. A scripted step is the place a single
 * ready line really is the whole turn, and when those scenes are offered again
 * this is the flag to turn back on.
 */
const BANK_OFFERED_IN_OPEN_TALK = false;

/** The brief, which is the model's to read and so stays in one language. */
const SETTING =
  "A relaxed catch-up with a friendly acquaintance over coffee, with no errand to finish. The tutor is someone easy to talk to and curious about the learner's day, plans and interests; the learner can bring up anything at all.";

export const JUST_TALK_HELLO = "open.hi";
export const JUST_TALK_BYE = "open.bye";

/** The scene id for a language, matching the English one already in the catalog. */
export function justTalkId(language: string): string {
  return `open-talk-${language}`;
}

/** The two lines a language needs recorded, to be merged into the bank. */
export function justTalkSentences(): Record<string, SentenceBank> {
  const banks: Record<string, SentenceBank> = {};
  for (const entry of LANGUAGES) {
    banks[entry.language] = {
      [JUST_TALK_HELLO]: {
        text: entry.greeting,
        ...(entry.greetingGloss ? { translation: entry.greetingGloss } : {}),
      },
      [JUST_TALK_BYE]: {
        text: entry.goodbye,
        ...(entry.goodbyeGloss ? { translation: entry.goodbyeGloss } : {}),
      },
      ...(TALK_LINES[entry.language] ?? {}),
    };
  }
  return banks;
}

/**
 * One open conversation per language.
 *
 * Only the way out is scripted, exactly as in the English one: everything else
 * the learner says goes to the character. Missing the goodbye costs nothing —
 * the character reads it as a closing and ends the scene itself.
 */
export function justTalkScenarios(): RoleplayScenario[] {
  return LANGUAGES.map((entry) => ({
    id: justTalkId(entry.language),
    language: entry.language,
    voice: entry.voice,
    title: entry.title,
    setting: SETTING,
    tutorRole: "friend",
    openEnded: true,
    ...(BANK_OFFERED_IN_OPEN_TALK && TALK_LINES[entry.language]
      ? { repertoire: Object.keys(TALK_LINES[entry.language]!) }
      : {}),
    start: "hi",
    nodes: {
      hi: { type: "tutor", id: "hi", say: JUST_TALK_HELLO, next: "talk" },
      talk: {
        type: "learner",
        id: "talk",
        goal: "편하게 아무 얘기나 해 보세요.",
        expect: [{ match: entry.leaving, go: "bye" }],
      },
      bye: { type: "tutor", id: "bye", say: JUST_TALK_BYE, next: null },
    },
  }));
}
