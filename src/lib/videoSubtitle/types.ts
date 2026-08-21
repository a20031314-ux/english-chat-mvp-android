export type SttWord = {
  word: string;
  start: number;
  end: number;
};

export type SttSegment = {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: SttWord[];
  confidence?: number;
  uncertain?: boolean;
};

export type NormalizedSegment = {
  id: string;
  startTime: number;
  endTime: number;
  rawText: string;
  normalizedText: string;
  words?: SttWord[];
  confidence?: number;
  uncertain?: boolean;
};

export type VideoContextTerm = {
  term: string;
  meaning?: string;
  preferredTranslation?: string;
};

export type VideoContext = {
  topic: string;
  domain: string;
  summary: string;
  speakerStyle: string;
  terminology: VideoContextTerm[];
};

export type SubtitleAnalysis = {
  flags?: string[];
};

export type UtteranceTone = {
  formality: string;
  politeness: string;
  intimacy: string;
  emotion: string;
  intensity: string;
  confidence: string;
  hesitation: string;
  humor: string;
  sarcasm: string;
  attitude: string;
};

export type SubtitleDebugInfo = {
  original: string;
  scene?: {
    setting?: string;
    situation?: string;
    interaction?: string;
    mood?: string;
    visualCues?: string[];
    confidence?: number;
    startTime: number;
    endTime: number;
  };
  previous: string[];
  next: string[];
  meaning?: string;
  toneSummary?: string;
  finalSubtitle: string;
  nativeUnderstanding?: {
    understoodMeaning: string;
    references?: Array<{
      expression: string;
      refersTo: string;
      evidenceLevel?: string;
      confidence?: number;
    }>;
    intent?: string;
    tone?: string;
  };
};

export type SubtitleSegment = {
  id: string;
  startTime: number;
  endTime: number;
  rawOriginal: string;
  original: string;
  /** On-screen adapted caption (what the user reads). */
  translation: string;
  /** Internal: what the speaker meant. */
  meaning?: string;
  /** @deprecated use meaning */
  literalMeaning?: string;
  tone?: UtteranceTone;
  speakerStyle?: string;
  interpretationConfidence?: number;
  confidence?: number;
  translationStatus: "draft" | "final";
  analysis?: SubtitleAnalysis;
  /** Native-viewer understanding used to build this caption (for learning/debug). */
  nativeUnderstanding?: {
    understoodMeaning: string;
    references?: Array<{
      expression: string;
      refersTo: string;
      evidenceLevel?: string;
      confidence?: number;
    }>;
    intent?: string;
    tone?: string;
    establishedNote?: string;
    confidence?: number;
  };
  /** Development only — how the caption was decided. */
  debug?: SubtitleDebugInfo;
};

export type SttSource = "whisper" | "youtube-asr" | "youtube-manual" | "youtube-official-ui";

export type CaptionMode = "speech" | "official-ui";

export type ExtractedAudio = {
  bytes: Buffer;
  filename: string;
  mimeType: string;
  durationHintSeconds?: number;
};

export type CaptionTrack = {
  languageCode: string;
  kind?: string;
  name?: string;
  baseUrl: string;
  /** Innertube client that produced this URL. ANDROID tracks work without a PoToken. */
  client?: "android" | "ios" | "web";
};

export type YouTubeSource = {
  videoId: string;
  title?: string;
  durationSeconds: number;
  audioStreamUrl?: string;
  audioMimeType?: string;
  /** Low-res progressive video for scene/frame extraction (optional). */
  videoStreamUrl?: string;
  mediaUserAgent?: string;
  cookie?: string;
  captionTracks: CaptionTrack[];
};

export type PreparedTranscript = {
  videoId: string;
  videoUrl: string;
  durationSeconds: number;
  sttSource: SttSource;
  /** How on-screen learning captions / translations are sourced. */
  captionMode?: CaptionMode;
  context: VideoContext;
  /** Learning-language speech lines (playback / study unit source). */
  segments: NormalizedSegment[];
  /**
   * Official UI-locale caption lines used as translations when captionMode
   * is official-ui (mapped onto speech units by time overlap).
   */
  officialUiSegments?: NormalizedSegment[];
  /** @deprecated use officialUiSegments — kept for older clients */
  speechSegments?: NormalizedSegment[];
  /** Cached visual scene contexts for the progressive window. */
  sceneContexts?: import("@/lib/videoSubtitle/sceneTypes").SceneContext[];
  /** Accumulated native-viewer memory after prepare/first window. */
  viewerContext?: import("@/lib/videoSubtitle/viewerTypes").ViewerContext;
  firstCues?: SubtitleSegment[];
  firstWindowEnd?: number;
  processingWindows?: Array<{ start: number; end: number }>;
};

export type TranslateWindowInput = {
  locale: string;
  context: VideoContext;
  currentSegments: NormalizedSegment[];
  previousSegments: NormalizedSegment[];
  nextSegments: NormalizedSegment[];
  sceneContexts?: import("@/lib/videoSubtitle/sceneTypes").SceneContext[];
  viewerContext?: import("@/lib/videoSubtitle/viewerTypes").ViewerContext;
};

export type TranslateWindowResult = {
  cues: SubtitleSegment[];
  viewerContext: import("@/lib/videoSubtitle/viewerTypes").ViewerContext;
};
