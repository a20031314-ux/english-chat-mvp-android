/**
 * 윗사람·손님에게 반말 — 모델이 자주 놓치는 말투 실수를 규칙으로 먼저 찾아 채팅 교정에 알려 준다.
 *
 * 한국어는 `koreanSlips.ts`(casualToElder)가 맡고, 여기는 존댓말이 문법으로 갈리는 다른 학습 언어.
 * 가상 사용자 점검(2026-10-22, Haiku 전환 뒤)에서 "말투 실수 짚음"이 71% → 25%로 떨어졌다:
 * 「先生、明日来る？」「Salut prof, donne-moi la réponse vite.」를 그대로 둠. 지시문에 이미 "윗사람에게 반말이면 고쳐라"가
 * 있는데도 놓쳐서, 한국어처럼 규칙이 찾은 것을 `noticed`로 넘긴다(채팅 route `runChat`).
 *
 * 일부러 넣지 않은 언어: 스페인어·이탈리아어·포르투갈어는 선생님께 tú/tu/você가 흔하고, 중국어 你는 您보다 덜 공손할 뿐
 * 틀린 말이 아니다 — 여기서 고치라고 하면 맞는 문장을 고치게 된다.
 * 부르는 말(先生·prof·Herr …)이 문장에 있을 때만 본다. 상대가 누군지 모르면 아무 말도 하지 않는다.
 */

type RegisterRule = {
  /** 존댓말을 써야 하는 상대를 부르는 말. 찾은 낱말을 돌려준다. */
  addressee: RegExp;
  /** 반말(친한 사이 꼴)이 쓰였는지. */
  casual: (text: string) => boolean;
  /** 존댓말 꼴이 이미 있으면 말하지 않는다. */
  polite: RegExp;
  /** 고칠 방향(지시문에 그대로). */
  fix: string;
};

/** 키릴 문자는 \b가 안 먹어서 앞뒤가 글자가 아닌지로 낱말을 가른다. */
const ruWord = (words: string) => new RegExp(`(?<![\\p{L}])(?:${words})(?![\\p{L}])`, "iu");

const RULES: Partial<Record<string, RegisterRule>> = {
  ja: {
    addressee: /(先生|せんせい|社長|部長|課長|店長|先輩|教授|お客様|お客さま)/u,
    casual: (text) => !/(です|ます|でした|ました|ません|ください|下さい|でしょう|ございます|いらっしゃ|なさ|おっしゃ)/u.test(text),
    polite: /(です|ます|でした|ました|ません|ください|下さい|でしょう|ございます)/u,
    fix: "です/ます form (and a request with ください or 〜ていただけますか instead of a bare command)",
  },
  fr: {
    addressee: /(?<![\p{L}])(monsieur|madame|mademoiselle|prof|professeur|professeure|docteur|docteure|maître|patron|patronne)(?![\p{L}])/iu,
    casual: (text) => /(?<![\p{L}])(tu|toi|te|ton|ta|tes)(?![\p{L}])|(?<![\p{L}])t['’]|-(moi|toi)(?![\p{L}])/iu.test(text),
    polite: /(?<![\p{L}])vous(?![\p{L}])/iu,
    fix: "vous (vouvoiement) — vous-forms of the verbs, votre/vos, and -moi → -moi with the vous imperative (e.g. a vous-form request)",
  },
  ru: {
    addressee: ruWord(
      "профессор|учитель|учительница|доктор|начальник|начальница|директор|директриса|[А-ЯЁ][а-яё]+\\s+[А-ЯЁ][а-яё]+(?:ович|евич|ич|овна|евна|ична|инична)",
    ),
    casual: (text) => ruWord("ты|тебя|тебе|тобой|твой|твоя|твоё|твое|твои|твоего|твоей").test(text),
    polite: ruWord("вы|вас|вам|вами|ваш|ваша|ваше|ваши"),
    fix: "вы (на «вы») — вы-forms of the verbs and ваш/ваша",
  },
};

/** 부르는 말 + 반말이 같이 있으면 그 부르는 말을, 아니면 null. */
export function casualToSuperior(text: string, target: string): string | null {
  const rule = RULES[target];
  if (!rule) return null;
  const found = text.match(rule.addressee);
  if (!found) return null;
  if (rule.polite.test(text)) return null;
  if (!rule.casual(text)) return null;
  return found[0];
}

/** 채팅 교정에 넘길 한 줄(없으면 ""). */
export function registerSlipHint(text: string, target: string, targetName: string): string {
  const who = casualToSuperior(text, target);
  if (!who) return "";
  const rule = RULES[target]!;
  return `They address "${who}" — someone owed polite speech in ${targetName} — with casual/familiar forms. That is a real mistake for this listener: make corrected use ${rule.fix}, keep natural polite too, keep their meaning, and name the register change in the explanation.`;
}
