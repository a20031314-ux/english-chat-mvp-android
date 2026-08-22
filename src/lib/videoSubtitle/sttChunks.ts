import type { SttSegment } from "@/lib/videoSubtitle/types";

/** Whisper upload slices. Long enough for context, small enough for Vercel body limits. */
export const STT_CHUNK_SECONDS = 75;
export const STT_CHUNK_OVERLAP_SECONDS = 2;
const WAV_RATE = 16000;

export function sttChunkStarts(durationSeconds: number): number[] {
  const duration = Math.max(0, durationSeconds);
  if (duration <= STT_CHUNK_SECONDS + 5) return [0];
  const step = STT_CHUNK_SECONDS - STT_CHUNK_OVERLAP_SECONDS;
  const starts: number[] = [];
  for (let t = 0; t < duration - 1; t += step) {
    starts.push(Number(t.toFixed(3)));
    if (t + STT_CHUNK_SECONDS >= duration - 0.4) break;
  }
  return starts.length > 0 ? starts : [0];
}

export function mergeSttChunks(
  chunks: Array<{ startTime: number; segments: SttSegment[] }>,
): SttSegment[] {
  const ordered = [...chunks].sort((a, b) => a.startTime - b.startTime);
  let merged: SttSegment[] = [];
  for (const chunk of ordered) {
    if (merged.length === 0) {
      merged = [...chunk.segments];
      continue;
    }
    const cut =
      chunk.startTime +
      (chunk.startTime <= 0 ? 0 : STT_CHUNK_OVERLAP_SECONDS / 2);
    merged = merged.filter((segment) => segment.startTime < cut);
    merged.push(
      ...chunk.segments.filter((segment) => segment.startTime >= cut),
    );
  }
  return merged.map((segment, index) => ({
    ...segment,
    id: `w-${index}-${Math.round(segment.startTime * 1000)}`,
  }));
}

function resampleMono(input: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const src = i * ratio;
    const left = Math.floor(src);
    const right = Math.min(input.length - 1, left + 1);
    const mix = src - left;
    out[i] = input[left]! * (1 - mix) + input[right]! * mix;
  }
  return out;
}

export function audioBufferSliceToWav(
  buffer: AudioBuffer,
  startSeconds: number,
  endSeconds: number,
): Uint8Array {
  const sr = buffer.sampleRate;
  const from = Math.max(0, Math.floor(startSeconds * sr));
  const to = Math.min(buffer.length, Math.floor(endSeconds * sr));
  const count = Math.max(0, to - from);
  const mixed = new Float32Array(count);
  const channels = Math.max(1, buffer.numberOfChannels);
  for (let c = 0; c < channels; c += 1) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < count; i += 1) {
      mixed[i] = (mixed[i] ?? 0) + (data[from + i] ?? 0) / channels;
    }
  }
  const pcm = resampleMono(mixed, sr, WAV_RATE);
  const bytes = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(bytes);
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, WAV_RATE, true);
  view.setUint32(28, WAV_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.length * 2, true);
  let offset = 44;
  for (let i = 0; i < pcm.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, pcm[i] ?? 0));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Uint8Array(bytes);
}
