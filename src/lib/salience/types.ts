/** Universal Dependencies-lite token. Index is 0-based in the token list. */
export type UdToken = {
  index: number;
  text: string;
  lemma: string;
  upos: string;
  morphFeatures: Record<string, string>;
  depRelation: string;
  headIndex: number;
  charStart: number;
  charEnd: number;
};

export type SalienceCandidate = {
  tokenRange: { start: number; end: number };
  originalText: string;
  linguisticScore: number;
  sourceExpressionScore: number;
  signalTags: string[];
  totalScore: number;
};

export type AnalysisDimension =
  | "syntax"
  | "usageInContext"
  | "phonology"
  | "morphology"
  | "pragmatics"
  | "etymology";

export type SourceContext = "videoLearning" | "webReading" | "ebook" | "chat";

export type LearnerLevel = "beginner" | "intermediate" | "advanced";

export const LEARNER_LEVELS: LearnerLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export type RankedSalienceCandidate = SalienceCandidate & {
  salienceReason: string;
  charStart: number;
  charEnd: number;
};

export type LanguageProfile = {
  languageCode: string;
  activeDimensions: AnalysisDimension[];
  dimensionFocus: Partial<Record<AnalysisDimension, string[]>>;
};

export type LinguisticScanInput = {
  sentence: string;
  language: string;
  nativeLanguage: string;
};

export type LinguisticScanResult = {
  tokens: UdToken[];
  parser: "english-rules" | "generic-tokenize";
  candidates: SalienceCandidate[];
};

export type ExampleSentence = {
  sentence: string;
  meaning: string;
};

export type DimensionPromptContext = {
  language: string;
  languageName: string;
  nativeLanguage: string;
  explanationLanguage: string;
  sentence: string;
  spanText: string;
  signalTags: string[];
  focus: string[];
  siblingDimensions?: AnalysisDimension[];
};

export type DimensionCall = {
  dimension: AnalysisDimension;
  prompt: string;
  explanationLanguage: string;
  learningLanguage: string;
};

export type AnalysisResult = {
  tokenRange: { start: number; end: number };
  originalText: string;
  translation: string;
  dimensionResults: Partial<Record<AnalysisDimension, string>>;
  salienceReason: string;
  examples: ExampleSentence[];
  calledDimensions: AnalysisDimension[];
};
