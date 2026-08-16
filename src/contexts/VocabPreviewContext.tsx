"use client";

import { createContext, useContext } from "react";
import type { VocabLookupResult } from "@/lib/vocabulary";

export type VocabPreviewContextValue = {
  open: (word: string, contextSentence?: string) => void;
  close: () => void;
  save: () => void;
  saveLabel: string;
  isWordSaved: (word: string) => boolean;
  savingWord: string | null;
  word: string | null;
  detail: VocabLookupResult | null;
  isLoading: boolean;
  loadFailed: boolean;
  isSaving: boolean;
  alreadySaved: boolean;
};

export const VocabPreviewContext =
  createContext<VocabPreviewContextValue | null>(null);

export function useVocabPreviewOptional() {
  return useContext(VocabPreviewContext);
}
