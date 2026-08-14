"use client";

import { createContext, useContext } from "react";

export type VocabPreviewContextValue = {
  open: (word: string) => void;
  close: () => void;
  saveLabel: string;
  isWordSaved: (word: string) => boolean;
  savingWord: string | null;
};

export const VocabPreviewContext =
  createContext<VocabPreviewContextValue | null>(null);

export function useVocabPreviewOptional() {
  return useContext(VocabPreviewContext);
}
