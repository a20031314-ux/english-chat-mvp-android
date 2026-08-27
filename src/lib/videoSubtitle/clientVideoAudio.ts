import { apiUrl } from "@/lib/apiBase";
import { downloadYouTubeAudioBytes } from "@/lib/videoSubtitle/downloadAudioBytes";
import {
  audioBufferSliceToWav,
  mergeSttChunks,
  regularizeSttSegments,
  speechCoversDuration,
  STT_CHUNK_SECONDS,
  sttChunkStarts,
} from "@/lib/videoSubtitle/sttChunks";
import type { SttSegment, YouTubeSource } from "@/lib/videoSubtitle/types";
import { transcribeYouTubeCaptions } from "@/lib/videoSubtitle/youtubeCaptions";
import { resolveYouTubeSource } from "@/lib/videoSubtitle/youtubePlayer";

const WHISPER_MAX_SECONDS = 900;
const JSON_UPLOAD_MAX_BYTES = 2_800_000;

export class ClientAudioError extends Error {
  constructor(public code: string) {
    super(code);
    this.name = "ClientAudioError";
  }
}

function bytesAsArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function bytesToBase64(bytes: Uint8Array): string {
  const parts: string[] = [];
  const step = 4096;
  for (let i = 0; i < bytes.length; i += step) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + step)));
  }
  return btoa(parts.join(""));
}

async function decodeAudioBytes(bytes: Uint8Array): Promise<AudioBuffer | null> {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  const context = new Ctor();
  try {
    return await context.decodeAudioData(bytesAsArrayBuffer(bytes));
  } catch {
    return null;
  } finally {
    await context.close().catch(() => undefined);
  }
}

async function transcribeChunk(input: {
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
  startTime: number;
  language: string;
  signal?: AbortSignal;
}): Promise<SttSegment[]> {
  const payload = {
    audioBase64: bytesToBase64(input.bytes),
    filename: input.filename,
    mimeType: input.mimeType,
    startTime: input.startTime,
    language: input.language,
  };
  let response = await fetch(apiUrl("/api/video-subtitles/transcribe-chunk"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: input.signal,
  });
  if (response.status === 400 || response.status === 415) {
    const file = new File([bytesAsArrayBuffer(input.bytes)], input.filename, {
      type: input.mimeType,
    });
    const form = new FormData();
    form.append("file", file);
    form.append("startTime", String(input.startTime));
    form.append("language", input.language);
    response = await fetch(apiUrl("/api/video-subtitles/transcribe-chunk"), {
      method: "POST",
      body: form,
      signal: input.signal,
    });
  }
  if (!response.ok) {
    console.error("[video-client-audio] transcribe-chunk", response.status);
    throw new ClientAudioError(
      response.status === 503 ? "MISSING_OPENAI_KEY" : "STT_FAILED",
    );
  }
  const data = (await response.json()) as { segments?: SttSegment[] };
  return Array.isArray(data.segments) ? data.segments : [];
}

/**
 * Download YouTube audio on-device (home/mobile IP), split ~75s, Whisper on Vercel.
 */
export async function transcribeYouTubeAudioOnDevice(
  videoUrl: string,
  options: {
    targetLanguage: string;
    signal?: AbortSignal;
    onProgress?: (percent: number) => void;
  },
): Promise<SttSegment[]> {
  console.error("[video-client-audio] start 2.31");
  options.onProgress?.(18);
  let source: YouTubeSource;
  try {
    source = await resolveYouTubeSource(videoUrl);
  } catch {
    throw new ClientAudioError("NO_AUDIO");
  }
  if (options.signal?.aborted) throw new ClientAudioError("TIMEOUT");

  try {
    const captions = await transcribeYouTubeCaptions(
      source.captionTracks,
      source.videoId,
      source.cookie,
      { preferredLocale: options.targetLanguage, requireLanguageMatch: true },
    );
    if (
      captions.length > 0 &&
      speechCoversDuration(captions, source.durationSeconds)
    ) {
      console.error("[video-client-audio] device captions", captions.length);
      options.onProgress?.(80);
      return regularizeSttSegments(captions);
    }
    if (captions.length > 0) {
      console.error("[video-client-audio] sparse captions, using audio", {
        lines: captions.length,
        duration: source.durationSeconds,
      });
    } else {
      // The only silent way into Whisper: no track survived the language match.
      // Whisper timestamps come from the audio, not the video timeline, so the
      // reason matters when captions and speech drift apart.
      console.error("[video-client-audio] no matching captions, using audio", {
        want: options.targetLanguage,
        tracks: source.captionTracks.map(
          (track) => `${track.languageCode}${track.kind ? ":" + track.kind : ""}`,
        ),
      });
    }
  } catch (error) {
    console.error("[video-client-audio] device captions failed", error);
  }

  const downloaded = await downloadYouTubeAudioBytes({
    audioStreamUrl: source.audioStreamUrl,
    audioMimeType: source.audioMimeType,
    videoStreamUrl: source.videoStreamUrl,
    mediaUserAgent: source.mediaUserAgent,
    maxSeconds: Math.min(
      WHISPER_MAX_SECONDS,
      Math.max(90, Math.ceil((source.durationSeconds || WHISPER_MAX_SECONDS) + 15)),
    ),
  });
  if (!downloaded) {
    console.error("[video-client-audio] download empty", {
      hasAudio: Boolean(source.audioStreamUrl),
      hasVideo: Boolean(source.videoStreamUrl),
    });
    throw new ClientAudioError("NO_AUDIO");
  }
  options.onProgress?.(40);

  const decoded = await decodeAudioBytes(downloaded.bytes);
  const chunks: Array<{ startTime: number; segments: SttSegment[] }> = [];
  if (decoded && decoded.duration > 0.5) {
    const starts = sttChunkStarts(decoded.duration);
    for (let i = 0; i < starts.length; i += 1) {
      if (options.signal?.aborted) throw new ClientAudioError("TIMEOUT");
      const start = starts[i]!;
      const end = Math.min(decoded.duration, start + STT_CHUNK_SECONDS);
      const wav = audioBufferSliceToWav(decoded, start, end);
      options.onProgress?.(
        42 + Math.round(((i + 1) / Math.max(1, starts.length)) * 35),
      );
      const segments = await transcribeChunk({
        bytes: wav,
        mimeType: "audio/wav",
        filename: `speech-${Math.round(start)}.wav`,
        startTime: start,
        language: options.targetLanguage,
        signal: options.signal,
      }).catch((error) => {
        console.error("[video-client-audio] wav chunk", start, error);
        return [];
      });
      if (segments.length > 0) {
        chunks.push({ startTime: start, segments });
      }
    }
  } else {
    const segments = await transcribeChunk({
      bytes: downloaded.bytes.slice(0, JSON_UPLOAD_MAX_BYTES),
      mimeType: downloaded.mimeType,
      filename: downloaded.filename,
      startTime: 0,
      language: options.targetLanguage,
      signal: options.signal,
    });
    chunks.push({ startTime: 0, segments });
  }

  const merged = mergeSttChunks(chunks);
  if (merged.length === 0) throw new ClientAudioError("NO_SPEECH");
  options.onProgress?.(80);
  return merged;
}
