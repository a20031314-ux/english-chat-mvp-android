import { apiUrl } from "@/lib/apiBase";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import {
  normalizeLibraryListing,
  type LibraryListing,
} from "@/lib/videoLibrary/libraryListing";

export { bundledListing } from "@/lib/videoLibrary/libraryListing";
export type { LibraryListing } from "@/lib/videoLibrary/libraryListing";

/**
 * This month's clips from the deployment, or null if it could not be asked.
 *
 * The reading of the answer is in libraryListing.ts, which has no browser in
 * it and can be run by a test. This is only the asking.
 */
export async function fetchLibraryListing(
  language: LearningLanguageCode,
  signal?: AbortSignal,
): Promise<LibraryListing | null> {
  try {
    const response = await fetch(
      apiUrl(`/api/video-library?language=${encodeURIComponent(language)}`),
      { signal },
    );
    if (!response.ok) return null;
    return normalizeLibraryListing(await response.json());
  } catch {
    return null;
  }
}
