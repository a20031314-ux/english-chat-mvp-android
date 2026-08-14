import { useMemo } from "react";
import {
  findActiveSubtitle,
  type VideoSubtitle,
} from "@/lib/videoLearning";

export function useActiveSubtitle(
  currentTime: number,
  subtitles: VideoSubtitle[],
): VideoSubtitle | null {
  return useMemo(
    () => findActiveSubtitle(currentTime, subtitles),
    [currentTime, subtitles],
  );
}
