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

export type SubtitleSegment = {
  id: string;
  startTime: number;
  endTime: number;
  rawOriginal: string;
  original: string;
  translation: string;
  confidence?: number;
  translationStatus: "draft" | "final";
  analysis?: SubtitleAnalysis;
};

export type SttSource = "whisper" | "youtube-asr";

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
};

export type YouTubeSource = {
  videoId: string;
  title?: string;
  durationSeconds: number;
  audioStreamUrl?: string;
  audioMimeType?: string;
  captionTracks: CaptionTrack[];
};

export type PreparedTranscript = {
  videoId: string;
  videoUrl: string;
  durationSeconds: number;
  sttSource: SttSource;
  context: VideoContext;
  segments: NormalizedSegment[];
};

export type TranslateWindowInput = {
  locale: string;
  context: VideoContext;
  currentSegments: NormalizedSegment[];
  previousSegments: NormalizedSegment[];
  nextSegments: NormalizedSegment[];
};
