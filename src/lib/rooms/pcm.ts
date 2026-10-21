/**
 * 마이크 소리를 직접 모아 WAV로 만든다(2026-10-22) — 녹음을 "소리가 커진 뒤"에야 시작하던 탓에 첫 음절이 잘리던 것을 고치려고.
 *
 * 늘 최근 PREROLL_MS만큼을 고리 버퍼에 담아 두고, 말이 시작되면 그 앞부분부터 이어 붙인다. 작게·웅얼거리며 시작한 말일수록
 * 감지가 늦어 많이 잘렸다(`hub/drafts/speech-models-2026-10-21.md` "소리 크기"). 보낼 때는 16kHz 한 채널 16비트로 줄인다 —
 * 8초 조각이 약 256KB. 받아쓰기 모델은 16kHz면 충분하다.
 */

export const PREROLL_MS = 400;
export const WAV_RATE = 16_000;

/** 최근 n개 표본만 간직하는 고리 버퍼. */
export class PcmRing {
  private readonly buffer: Float32Array;
  private start = 0;
  private length = 0;

  constructor(capacity: number) {
    this.buffer = new Float32Array(Math.max(1, Math.floor(capacity)));
  }

  push(samples: Float32Array): void {
    const cap = this.buffer.length;
    for (let i = 0; i < samples.length; i++) {
      const at = (this.start + this.length) % cap;
      this.buffer[at] = samples[i];
      if (this.length < cap) this.length++;
      else this.start = (this.start + 1) % cap;
    }
  }

  /** 담긴 것을 오래된 것부터 복사해 돌려준다. */
  snapshot(): Float32Array {
    const out = new Float32Array(this.length);
    for (let i = 0; i < this.length; i++) out[i] = this.buffer[(this.start + i) % this.buffer.length];
    return out;
  }
}

/** 여러 조각을 하나로. */
export function concatPcm(parts: Float32Array[]): Float32Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Float32Array(total);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

/** 표본 빈도를 낮춘다(구간 평균 — 받아쓰기용으로는 충분). */
export function downsample(samples: Float32Array, fromRate: number, toRate = WAV_RATE): Float32Array {
  if (fromRate <= toRate) return samples;
  const ratio = fromRate / toRate;
  const out = new Float32Array(Math.floor(samples.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const from = Math.floor(i * ratio);
    const to = Math.min(samples.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = from; j < to; j++) sum += samples[j];
    out[i] = sum / Math.max(1, to - from);
  }
  return out;
}

/** 한 채널 16비트 WAV. */
export function encodeWav(samples: Float32Array, rate = WAV_RATE): Uint8Array {
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const text = (at: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(at + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  return bytes;
}
