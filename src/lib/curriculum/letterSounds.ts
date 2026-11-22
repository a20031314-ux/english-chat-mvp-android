/**
 * 글자·소리 카드의 소리: 미리 골라 둔 파일(public/letter-sounds/<lang>/<code>.mp3, scripts/letter-sounds.mjs)을 먼저 튼다.
 * 한 박자 글자를 그때그때 TTS로 부르면 소리가 비거나 아주 작게 오는 일이 있어서(2026-11-22 ja ン·ほ). 파일이 없으면 TTS.
 * 파일은 앱에 싣지 않고 웹에서 받는다(build-capacitor served 목록).
 */
import { apiUrl } from "@/lib/apiBase";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { letterSoundPath } from "@/lib/curriculum/letterSoundFile";

let current: HTMLAudioElement | null = null;

export async function playLetter(lang: string, text: string, speech: string): Promise<void> {
  const spoken = text.trim();
  if (!spoken) return;
  stopTts();
  current?.pause();
  if (typeof Audio !== "undefined") {
    const audio = new Audio(apiUrl(letterSoundPath(lang, spoken)));
    current = audio;
    try {
      await audio.play();
      return;
    } catch {
      if (current === audio) current = null;
    }
  }
  await playTts(spoken, speech);
}
