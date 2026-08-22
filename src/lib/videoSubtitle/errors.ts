export type VideoSubtitleErrorCode =
  | "MISSING_OPENAI_KEY"
  | "INVALID_URL"
  | "NO_AUDIO"
  | "NO_SPEECH"
  | "CLIENT_AUDIO_REQUIRED"
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
