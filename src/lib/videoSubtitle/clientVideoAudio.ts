import { apiUrl } from "@/lib/apiBase";
import { downloadYouTubeAudioBytes, filenameForMime, targetBytesForSeconds } from "@/lib/videoSubtitle/downloadAudioBytes";
import {
  audioBufferSliceToWav,
  mergeSttChunks,
  STT_CHUNK_SECONDS,
  sttChunkStarts,
} from "@/lib/videoSubtitle/sttChunks";
import type { SttSegment, YouTubeSource } from "@/lib/videoSubtitle/types";
import { resolveYouTubeSource } from "@/lib/videoSubtitle/youtubePlayer";

const WHISPER_MAX_SECONDS = 900;

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
  const form = new FormData();
  form.append(
    "file",
    new Blob([bytesAsArrayBuffer(input.bytes)], { type: input.mimeType }),
    input.filename,
  );
  form.append("startTime", String(input.startTime));
  form.append("language", input.language);
  const response = await fetch(apiUrl("/api/video-subtitles/transcribe-chunk"), {
    method: "POST",
    body: form,
    signal: input.signal,
  });
  if (!response.ok) {
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
  options.onProgress?.(18);
  let source: YouTubeSource;
  try {
    source = await resolveYouTubeSource(videoUrl);
  } catch {
    throw new ClientAudioError("NO_AUDIO");
  }
  if (options.signal?.aborted) throw new ClientAudioError("TIMEOUT");

  let firstPromise: Promise<SttSegment[]> | undefined;
  const prefixBytes = targetBytesForSeconds(STT_CHUNK_SECONDS);
  const firstMime = source.audioMimeType || "audio/webm";
  const downloaded = await downloadYouTubeAudioBytes({
    audioStreamUrl: source.audioStreamUrl,
    audioMimeType: source.audioMimeType,
    videoStreamUrl: source.videoStreamUrl,
    mediaUserAgent: source.mediaUserAgent,
    maxSeconds: Math.min(
      WHISPER_MAX_SECONDS,
      Math.max(90, Math.ceil((source.durationSeconds || WHISPER_MAX_SECONDS) + 15)),
    ),
    progress: {
      prefixBytes,
      onPrefix: (prefix) => {
        firstPromise = transcribeChunk({
          bytes: prefix,
          mimeType: firstMime,
          filename: filenameForMime(firstMime),
          startTime: 0,
          language: options.targetLanguage,
          signal: options.signal,
        }).catch(() => []);
      },
    },
  });
  if (!downloaded) throw new ClientAudioError("NO_AUDIO");
  options.onProgress?.(40);

  const chunks: Array<{ startTime: number; segments: SttSegment[] }> = [];
  const first = firstPromise ? await firstPromise : [];
  if (first.length > 0) {
    chunks.push({ startTime: 0, segments: first });
  }

  const decoded = await decodeAudioBytes(downloaded.bytes);
  if (decoded) {
    const starts = sttChunkStarts(decoded.duration).filter((start) =>
      first.length > 0 ? start > 1 : true,
    );
    for (let i = 0; i < starts.length; i += 1) {
      if (options.signal?.aborted) throw new ClientAudioError("TIMEOUT");
      const start = starts[i]!;
      const end = Math.min(decoded.duration, start + STT_CHUNK_SECONDS);
      const wav = audioBufferSliceToWav(decoded, start, end);
      options.onProgress?.(
        45 + Math.round(((i + 1) / Math.max(1, starts.length)) * 30),
      );
      const segments = await transcribeChunk({
        bytes: wav,
        mimeType: "audio/wav",
        filename: `speech-${Math.round(start)}.wav`,
        startTime: start,
        language: options.targetLanguage,
        signal: options.signal,
      }).catch(() => []);
      if (segments.length > 0) {
        chunks.push({ startTime: start, segments });
      }
    }
  } else if (first.length === 0) {
    const segments = await transcribeChunk({
      bytes: downloaded.bytes.slice(0, 3_800_000),
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
