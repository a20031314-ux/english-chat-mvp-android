export type VideoSubtitleErrorCode =
  | "MISSING_OPENAI_KEY"
  | "INVALID_URL"
  | "NO_AUDIO"
  | "NO_SPEECH"
  | "STT_FAILED"
  | "UNKNOWN_LANGUAGE"
  | "TRANSLATION_FAILED"
  | "TIMEOUT";

export class VideoPipelineError extends Error {
  constructor(
    public code: VideoSubtitleErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "VideoPipelineError";
  }
}
