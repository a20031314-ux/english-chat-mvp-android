/**
 * The sentence constructions a learner's English is followed on.
 *
 * A fixed list, not whatever a model calls a mistake today: progress means
 * comparing this week with last month, and that needs the same names both
 * times. Each has a band — roughly where in a course it is usually met — so the
 * bands a learner has made their own can be read as "this is your level now".
 *
 * The bands follow the usual A1–C1 ordering of grammar syllabi. They are a
 * ladder for the screen, not a certificate; the screen says so.
 *
 * English only for now. Other learning languages get their own list here, and
 * nothing that reads one changes.
 *
 * Plain module: the server, the screen and the tests read the same list.
 */

export const BANDS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Band = (typeof BANDS)[number];

export type Construction = {
  id: string;
  band: Band;
  /** Short name in Korean and English; other interface languages read the English. */
  ko: string;
  en: string;
  /** What the classifier is told it is, with an example. */
  hint: string;
};

export const ENGLISH_CONSTRUCTIONS: Construction[] = [
  // A1
  { id: "be-verb", band: "A1", ko: "be동사", en: "be verb", hint: "am/is/are agreement: She is tired." },
  { id: "present-simple", band: "A1", ko: "현재시제·3인칭 -s", en: "Present simple", hint: "habits and -s: He works here." },
  { id: "articles", band: "A1", ko: "관사 a/the", en: "Articles", hint: "a seat, the cafe, no article where none belongs" },
  { id: "plurals", band: "A1", ko: "복수형", en: "Plurals", hint: "two coffees, many people" },
  { id: "do-questions", band: "A1", ko: "do 의문문·부정문", en: "Questions and negatives with do", hint: "Do you like it? I don't know." },
  { id: "prepositions-basic", band: "A1", ko: "기본 전치사", en: "Basic prepositions", hint: "in/on/at for place and time" },
  { id: "can-ability", band: "A1", ko: "can (능력·요청)", en: "can", hint: "Can I sit here? I can't swim." },
  // A2
  { id: "past-simple", band: "A2", ko: "과거시제", en: "Past simple", hint: "went, didn't go, Did you go?" },
  { id: "present-continuous", band: "A2", ko: "현재진행", en: "Present continuous", hint: "I'm waiting for him." },
  { id: "future-forms", band: "A2", ko: "미래 표현", en: "Future forms", hint: "going to / will / present continuous for plans" },
  { id: "comparatives", band: "A2", ko: "비교급·최상급", en: "Comparatives and superlatives", hint: "bigger than, the best" },
  { id: "countable-uncountable", band: "A2", ko: "셀 수 있는/없는 명사", en: "Countable and uncountable", hint: "much/many, some/any, a piece of advice" },
  { id: "pronouns", band: "A2", ko: "대명사·소유격", en: "Pronouns and possessives", hint: "me/my/mine, him/his" },
  { id: "conjunctions", band: "A2", ko: "접속사 because/so/but", en: "Linking with because, so, but", hint: "I stayed because it rained." },
  { id: "adverbs-frequency", band: "A2", ko: "빈도부사·어순", en: "Frequency adverbs and word order", hint: "I usually go, I've never been" },
  // B1
  { id: "present-perfect", band: "B1", ko: "현재완료", en: "Present perfect", hint: "I've been there, I haven't finished yet" },
  { id: "past-continuous", band: "B1", ko: "과거진행", en: "Past continuous", hint: "I was walking when it started." },
  { id: "first-conditional", band: "B1", ko: "조건문 (if + 현재)", en: "First conditional", hint: "If it rains, we'll stay." },
  { id: "modals-advice", band: "B1", ko: "조동사 should/have to/must", en: "Modals of advice and obligation", hint: "You should try it. I have to leave." },
  { id: "gerund-infinitive", band: "B1", ko: "동명사·to부정사", en: "Gerunds and infinitives", hint: "end up going, want to go, enjoy cooking" },
  { id: "relative-clauses", band: "B1", ko: "관계사절", en: "Relative clauses", hint: "the place where we met, the man who called" },
  { id: "passive-basic", band: "B1", ko: "수동태", en: "Passive voice", hint: "It was built in 1900." },
  { id: "so-such-that", band: "B1", ko: "so/such … that", en: "so/such … that", hint: "so crowded that I couldn't sit" },
  { id: "word-form", band: "B1", ko: "품사 형태 (명사/형용사/부사)", en: "Word form", hint: "crowd vs crowded, quick vs quickly" },
  { id: "phrasal-verbs", band: "B1", ko: "구동사", en: "Phrasal verbs", hint: "end up, wait it out, figure out" },
  { id: "reported-speech", band: "B1", ko: "간접화법", en: "Reported speech", hint: "She said she was tired." },
  // B2
  { id: "second-conditional", band: "B2", ko: "가정법 과거", en: "Second conditional", hint: "If I had time, I would go." },
  { id: "third-conditional", band: "B2", ko: "가정법 과거완료", en: "Third conditional", hint: "If I'd known, I would have come." },
  { id: "past-perfect", band: "B2", ko: "과거완료", en: "Past perfect", hint: "It had already started when we arrived." },
  { id: "modals-deduction", band: "B2", ko: "추측 조동사", en: "Modals of deduction", hint: "It must be him. She might have left." },
  { id: "wish-regret", band: "B2", ko: "wish·후회 표현", en: "wish and regret", hint: "I wish I had more time. I should have asked." },
  { id: "used-to", band: "B2", ko: "used to / be used to", en: "used to / be used to", hint: "I used to live there. I'm used to it." },
  { id: "discourse-markers", band: "B2", ko: "담화 연결어", en: "Discourse markers", hint: "Actually, Anyway, On the other hand" },
  { id: "collocations", band: "B2", ko: "연어 (자연스러운 단어 조합)", en: "Collocations", hint: "make a decision, heavy rain, take a seat" },
  // C1
  { id: "mixed-conditionals", band: "C1", ko: "혼합 가정법", en: "Mixed conditionals", hint: "If I'd taken it, I'd be there now." },
  { id: "inversion-emphasis", band: "C1", ko: "도치·강조 구문", en: "Inversion and cleft sentences", hint: "Never have I…, What I need is…" },
  { id: "participle-clauses", band: "C1", ko: "분사구문", en: "Participle clauses", hint: "Having finished, we left." },
  { id: "hedging", band: "C1", ko: "완곡·유보 표현", en: "Hedging", hint: "It seems that, I'd say, arguably" },
];

const BY_ID = new Map(ENGLISH_CONSTRUCTIONS.map((c) => [c.id, c]));

export function constructionsFor(language: string): Construction[] {
  return language.split("-")[0] === "en" ? ENGLISH_CONSTRUCTIONS : [];
}

export function findConstruction(id: string): Construction | undefined {
  return BY_ID.get(id);
}

export function constructionLabel(construction: Construction, uiLanguage: string): string {
  return uiLanguage === "ko" ? construction.ko : construction.en;
}
