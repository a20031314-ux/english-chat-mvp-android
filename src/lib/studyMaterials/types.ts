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

export type StudySection = {
  id: string;
  title?: string;
  page?: number;
  chapter?: string;
  paragraphs: StudyParagraph[];
};

export type ReadingProgress = {
  documentId: string;
  sectionId?: string;
  paragraphId?: string;
  sentenceId?: string;
  page?: number;
  progressPercent: number;
  updatedAt: string;
};

export type StudyDocument = {
  id: string;
  title: string;
  source: StudySource;
  type: StudyDocumentType;
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

export type ExtractedSection = {
  title?: string;
  page?: number;
  chapter?: string;
  paragraphs: string[];
};
