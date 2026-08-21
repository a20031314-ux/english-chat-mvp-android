export type StudySource = "video" | "epub" | "pdf" | "image" | "text";

export type StudyDocumentType = "epub" | "pdf" | "txt" | "image";

export type StudySentence = {
  id: string;
  text: string;
  position: number;
};

export type StudyParagraph = {
  id: string;
  text: string;
  sentences: StudySentence[];
};

export type StudyImageOverlay = {
  sentenceId: string;
  paragraphId: string;
  /** Normalized 0–1 box on the source image. */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type StudySection = {
  id: string;
  title?: string;
  page?: number;
  chapter?: string;
  /** EPUB spine path, used to render the original chapter HTML. */
  sourcePath?: string;
  paragraphs: StudyParagraph[];
  /** Original photo/poster; shown instead of extracted text. */
  imageDataUrl?: string;
  overlays?: StudyImageOverlay[];
  /** True after a line-level OCR pass, even if no usable boxes were found. */
  lineBoxes?: boolean;
  /** Word-layout engine version, e.g. tess-words-1. */
  ocrEngine?: string;
};

export type ReadingProgress = {
  documentId: string;
  sectionId?: string;
  paragraphId?: string;
  sentenceId?: string;
  page?: number;
  progressPercent: number;
  scrollTop?: number;
  zoom?: number;
  updatedAt: string;
};

export type StudyDocument = {
  id: string;
  title: string;
  source: StudySource;
  type: StudyDocumentType;
  /** Original file in IndexedDB `files` store. */
  sourceFileId?: string;
  fileName?: string;
  language?: string;
  sections: StudySection[];
  createdAt: string;
  progress: ReadingProgress;
  stats: {
    savedExpressions: number;
    analyzedSentences: number;
  };
};

export type StudyAnnotation = {
  id: string;
  documentId: string;
  sectionId: string;
  paragraphId: string;
  sentenceId: string;
  page?: number;
  chapter?: string;
  sourceText: string;
  selectedText: string;
  kind: "sentence" | "span";
  boundingBox?: { x: number; y: number; w: number; h: number };
  createdAt: string;
};

export type ImportStage =
  | "reading"
  | "extracting"
  | "normalizing"
  | "ready";

export type ImportErrorCode =
  | "unsupported"
  | "protected"
  | "no_text"
  | "too_large"
  | "image_ocr_unavailable"
  | "failed";

export class StudyImportError extends Error {
  code: ImportErrorCode;
  constructor(code: ImportErrorCode, message: string) {
    super(message);
    this.name = "StudyImportError";
    this.code = code;
  }
}

export type ContentTextAnchor = {
  id: string;
  text: string;
  sourceType: "epub" | "pdf" | "image" | "txt";
  previousText?: string;
  nextText?: string;
  location: {
    sectionId?: string;
    chapter?: string;
    page?: number;
    boundingBox?: { x: number; y: number; w: number; h: number };
  };
};

export type StudySourceFile = {
  id: string;
  documentId: string;
  mime: string;
  name: string;
  blob: Blob;
};

export type ExtractedTextBox = {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ExtractedSection = {
  title?: string;
  page?: number;
  chapter?: string;
  sourcePath?: string;
  keepEmpty?: boolean;
  paragraphs: string[];
  imageDataUrl?: string;
  boxes?: ExtractedTextBox[];
  /** Each paragraph is already one complete sentence from vision OCR. */
  readySentences?: boolean;
};
