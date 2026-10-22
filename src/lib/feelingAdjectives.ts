/**
 * 영어 감정 형용사 -ing/-ed 혼동(느끼는 사람 vs 그렇게 만드는 것)을 고친 문장으로 올리는 안전망.
 *
 * 왜(2026-10-22, Haiku 전환 뒤 운영 확인): 사람이 주어인 줄에서 -ing를 쓴 실수를 모델이
 * natural에서만 -ed로 바꾸고 corrected·설명은 그대로 두었다. 학습자에겐 "그렇게 써도 된다"로 보인다.
 * "나는 지루한 사람이다"도 문법상 가능하므로 규칙만으로 정하지 않고, **모델이 natural에서 짝 꼴로 바꿨을 때만**
 * corrected에도 올린다(모델의 뜻 판단 + 규칙의 자리 확인).
 *
 * - 사람 + be/feel/get (+ so·very…) + -ing → -ed
 * - it/that/this + be (+ so·very…) + -ed → -ing
 * 영어 학습일 때만 쓴다(다른 언어엔 이 혼동이 없다).
 */

const STEMS: Array<[ing: string, ed: string]> = [
  ["boring", "bored"],
  ["interesting", "interested"],
  ["exciting", "excited"],
  ["tiring", "tired"],
  ["confusing", "confused"],
  ["annoying", "annoyed"],
  ["amazing", "amazed"],
  ["surprising", "surprised"],
  ["embarrassing", "embarrassed"],
  ["disappointing", "disappointed"],
  ["frustrating", "frustrated"],
  ["exhausting", "exhausted"],
  ["satisfying", "satisfied"],
  ["shocking", "shocked"],
  ["terrifying", "terrified"],
  ["frightening", "frightened"],
  ["relaxing", "relaxed"],
  ["depressing", "depressed"],
  ["worrying", "worried"],
  ["amusing", "amused"],
  ["fascinating", "fascinated"],
  ["overwhelming", "overwhelmed"],
  ["thrilling", "thrilled"],
  ["touching", "touched"],
];

const ING_TO_ED = new Map(STEMS.map(([ing, ed]) => [ing, ed]));
const ED_TO_ING = new Map(STEMS.map(([ing, ed]) => [ed, ing]));

const ADVERBS = "(?:(?:so|very|really|super|kinda|kind\\s+of|a\\s+bit|a\\s+little|too|quite|pretty|extremely|totally|completely|always|often|never|just|getting|feeling)\\s+){0,3}";
const PERSON =
  "(?:i\\s+(?:am|was|feel|felt|get|got|'m)|i'm|im|we\\s+(?:are|were|feel|felt|get|got)|we're|you\\s+(?:are|were|feel|felt|look|looked)|you're|he\\s+(?:is|was|feels|felt|gets|got|looks)|he's|she\\s+(?:is|was|feels|felt|gets|got|looks)|she's|they\\s+(?:are|were|feel|felt|get|got|look)|they're|my\\s+\\w+\\s+(?:is|was|feels|felt|gets|got))";
const THING = "(?:it\\s+(?:is|was)|it's|that\\s+(?:is|was)|that's|this\\s+(?:is|was))";

export type FeelingSlip = { from: string; to: string };

function caseLike(source: string, word: string): string {
  return source[0] === source[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word;
}

const words = (text: string) => new Set(text.toLowerCase().match(/[a-z']+/g) ?? []);

/**
 * natural이 감정 형용사를 짝 꼴로 바꿨는데 corrected엔 그대로 남은 경우 corrected를 고친다.
 * 고칠 게 없으면 null.
 */
export function promoteFeelingSlip(
  corrected: string,
  natural: string,
): { corrected: string; slips: FeelingSlip[] } | null {
  if (!corrected.trim() || !natural.trim()) return null;
  const inCorrected = words(corrected);
  const inNatural = words(natural);
  const slips: FeelingSlip[] = [];
  let next = corrected;

  const tryPairs = (pairs: Map<string, string>, subject: string) => {
    for (const [wrong, right] of pairs) {
      if (!inCorrected.has(wrong) || inCorrected.has(right)) continue;
      if (!inNatural.has(right) || inNatural.has(wrong)) continue;
      const pattern = new RegExp(`(\\b${subject}\\s+${ADVERBS})(${wrong})\\b`, "i");
      const match = next.match(pattern);
      if (!match) continue;
      next = next.replace(pattern, (_all, head: string, word: string) => head + caseLike(word, right));
      slips.push({ from: match[2], to: caseLike(match[2], right) });
    }
  };
  tryPairs(ING_TO_ED, PERSON);
  tryPairs(ED_TO_ING, THING);

  return slips.length ? { corrected: next, slips } : null;
}

/** 앱 언어로 쓴 짧은 설명. 낱말은 영어 그대로 따옴표 안에. */
const EXPLAIN: Record<string, (from: string, to: string, feeler: boolean) => string> = {
  ko: (f, t, p) => p
    ? `'${f}'는 그런 느낌을 주는 쪽을 말해요. 내가 그렇게 느낄 때는 '${t}'를 써요.`
    : `'${f}'는 그렇게 느끼는 사람을 말해요. 그렇게 만드는 것을 말할 때는 '${t}'를 써요.`,
  en: (f, t, p) => p
    ? `'${f}' describes what causes the feeling; for the person who feels it, use '${t}'.`
    : `'${f}' describes the person who feels it; for what causes the feeling, use '${t}'.`,
  es: (f, t, p) => p
    ? `'${f}' describe lo que causa la sensación; para la persona que la siente se usa '${t}'.`
    : `'${f}' describe a la persona que lo siente; para lo que lo causa se usa '${t}'.`,
  ja: (f, t, p) => p
    ? `'${f}'はそう感じさせる側を表します。自分がそう感じるときは'${t}'を使います。`
    : `'${f}'はそう感じている人を表します。そう感じさせるものには'${t}'を使います。`,
  zh: (f, t, p) => p
    ? `'${f}'形容让人产生这种感觉的事物；自己有这种感觉时用'${t}'。`
    : `'${f}'形容有这种感觉的人；形容引起这种感觉的事物时用'${t}'。`,
  vi: (f, t, p) => p
    ? `'${f}' chỉ điều gây ra cảm giác; khi chính mình cảm thấy vậy thì dùng '${t}'.`
    : `'${f}' chỉ người có cảm giác đó; khi nói về điều gây ra cảm giác thì dùng '${t}'.`,
  fr: (f, t, p) => p
    ? `'${f}' décrit ce qui provoque le sentiment ; pour la personne qui le ressent, on dit '${t}'.`
    : `'${f}' décrit la personne qui ressent ; pour ce qui provoque le sentiment, on dit '${t}'.`,
  pt: (f, t, p) => p
    ? `'${f}' descreve o que causa a sensação; para a pessoa que sente, usa-se '${t}'.`
    : `'${f}' descreve a pessoa que sente; para o que causa a sensação, usa-se '${t}'.`,
  id: (f, t, p) => p
    ? `'${f}' menggambarkan hal yang menimbulkan perasaan itu; untuk orang yang merasakannya, pakai '${t}'.`
    : `'${f}' menggambarkan orang yang merasakannya; untuk hal yang menimbulkannya, pakai '${t}'.`,
  it: (f, t, p) => p
    ? `'${f}' descrive ciò che provoca la sensazione; per la persona che la prova si usa '${t}'.`
    : `'${f}' descrive la persona che prova la sensazione; per ciò che la provoca si usa '${t}'.`,
  ru: (f, t, p) => p
    ? `'${f}' описывает то, что вызывает чувство; о человеке, который его испытывает, говорят '${t}'.`
    : `'${f}' описывает человека, который испытывает чувство; о том, что его вызывает, говорят '${t}'.`,
  ar: (f, t, p) => p
    ? `'${f}' تصف الشيء الذي يسبب الشعور؛ أما الشخص الذي يشعر به فنقول عنه '${t}'.`
    : `'${f}' تصف الشخص الذي يشعر؛ أما الشيء الذي يسبب الشعور فنقول عنه '${t}'.`,
  th: (f, t, p) => p
    ? `'${f}' ใช้กับสิ่งที่ทำให้รู้สึกแบบนั้น ถ้าเราเป็นคนที่รู้สึกเองให้ใช้ '${t}'`
    : `'${f}' ใช้กับคนที่รู้สึกแบบนั้น ถ้าพูดถึงสิ่งที่ทำให้รู้สึกให้ใช้ '${t}'`,
  hi: (f, t, p) => p
    ? `'${f}' उस चीज़ के लिए है जो यह एहसास कराती है; जो व्यक्ति ख़ुद ऐसा महसूस करे, उसके लिए '${t}' बोलते हैं।`
    : `'${f}' उस व्यक्ति के लिए है जो ऐसा महसूस करता है; जो चीज़ यह एहसास कराए, उसके लिए '${t}' बोलते हैं।`,
};

export function explainFeelingSlips(slips: FeelingSlip[], interfaceLanguage: string): string {
  const write = EXPLAIN[interfaceLanguage] ?? EXPLAIN.en;
  return slips
    .map(({ from, to }) => write(from, to, from.toLowerCase().endsWith("ing")))
    .join(" ");
}

export const FEELING_EXPLAIN_LANGUAGES = Object.keys(EXPLAIN);
