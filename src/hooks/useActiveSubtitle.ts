import { useMemo } from "react";
import {
  findActiveSubtitle,
  type VideoSubtitle,
} from "@/lib/videoLearning";

export function useActiveSubtitle(
  currentTime: number,
  subtitles: VideoSubtitle[],
  mode: "english" | "korean" = "korean",
): VideoSubtitle | null {
  return useMemo(
    () => findActiveSubtitle(currentTime, subtitles, mode),
    [currentTime, subtitles, mode],
  );
}
