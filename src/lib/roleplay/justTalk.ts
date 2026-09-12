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
