/**
 * 말 빠르기만 바꾸기(높이는 그대로) — WSOLA, s16le 모노를 흘려 받으며 바로 내보낸다.
 *
 * 왜: Voxtral 목소리가 지금 튜터보다 빠르게 들림(사용자 2026-11-02 "살짝 느리게"). Voxtral의 `[pace=slow]`는
 * 30~50% 느려져 너무 많고 한국어엔 거의 안 먹어서, 서버에서 약 10%만 늘린다.
 *
 * 방법: 20ms 창을 반씩 겹쳐 놓되, 다음 창을 가져올 자리를 ±5ms 안에서 앞 창 끝과 가장 닮은 곳으로 골라(파형 상관)
 * 이어 붙인다 — 단순히 늘리면 생기는 떨림·울림이 적다. rate < 1이면 느려짐(0.9 = 길이 1/0.9배).
 */
export class TimeStretch {
  private readonly rate: number;
  private readonly win: number;
  private readonly hop: number;
  private readonly tol: number;
  private readonly analysisHop: number;
  private readonly window: Float32Array;
  private input: Float32Array = new Float32Array(0);
  /** input[0]이 원래 소리에서 몇 번째 샘플인지. */
  private inputStart = 0;
  /** 다음 창을 가져올 원래 자리(소수). */
  private nextPos = 0;
  /** 이미 낸 창의 뒤 절반(다음 창과 겹칠 부분). */
  private tail: Float32Array;
  /** 앞 창이 자연스럽게 이어졌을 소리(다음 창 자리 고르기의 기준). */
  private natural: Float32Array | null = null;
  private pendingByte: number | null = null;

  constructor(rate: number, sampleRate = 24000) {
    this.rate = rate;
    this.win = Math.round(sampleRate * 0.02);
    this.hop = this.win / 2;
    this.tol = Math.round(sampleRate * 0.005);
    this.analysisHop = this.hop * rate;
    this.window = new Float32Array(this.win);
    for (let i = 0; i < this.win; i++) this.window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / this.win);
    this.tail = new Float32Array(this.hop);
  }

  /** s16le 바이트 조각을 넣으면 늘린 s16le 바이트(없을 수도). */
  push(bytes: Uint8Array): Uint8Array {
    if (Math.abs(this.rate - 1) < 1e-3) return bytes;
    let data = bytes;
    if (this.pendingByte !== null) {
      data = new Uint8Array(bytes.byteLength + 1);
      data[0] = this.pendingByte;
      data.set(bytes, 1);
      this.pendingByte = null;
    }
    if (data.byteLength % 2) {
      this.pendingByte = data[data.byteLength - 1];
      data = data.subarray(0, data.byteLength - 1);
    }
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const samples = new Float32Array(data.byteLength / 2);
    for (let i = 0; i < samples.length; i++) samples[i] = view.getInt16(i * 2, true) / 32768;
    const joined = new Float32Array(this.input.length + samples.length);
    joined.set(this.input);
    joined.set(samples, this.input.length);
    this.input = joined;
    return this.run(false);
  }

  /** 남은 소리를 모두 내보낸다. */
  flush(): Uint8Array {
    if (Math.abs(this.rate - 1) < 1e-3) return new Uint8Array(0);
    return this.run(true);
  }

  private run(final: boolean): Uint8Array {
    const out: number[] = [];
    for (;;) {
      const target = Math.round(this.nextPos) - this.inputStart;
      // 다음 창 + 찾는 폭이 다 들어와 있어야 한다(끝이면 있는 만큼).
      const need = target + this.tol + this.win;
      if (need > this.input.length) {
        if (!final || target >= this.input.length) break;
      }
      let best = 0;
      if (this.natural) {
        let bestScore = -Infinity;
        for (let d = -this.tol; d <= this.tol; d++) {
          const at = target + d;
          if (at < 0 || at + this.hop > this.input.length) continue;
          let score = 0;
          for (let i = 0; i < this.hop; i++) score += this.natural[i] * this.input[at + i];
          if (score > bestScore) {
            bestScore = score;
            best = d;
          }
        }
      }
      const at = Math.max(0, target + best);
      const frame = new Float32Array(this.win);
      for (let i = 0; i < this.win; i++) frame[i] = (this.input[at + i] ?? 0) * this.window[i];
      for (let i = 0; i < this.hop; i++) out.push(this.tail[i] + frame[i]);
      this.tail = frame.slice(this.hop);
      // 이 창 바로 뒤에 원래 이어지던 소리 — 다음 창이 여기와 닮아야 끊김이 없다.
      this.natural = this.input.slice(at + this.hop, at + this.hop + this.hop);
      if (this.natural.length < this.hop) this.natural = null;
      this.nextPos += this.analysisHop;
      // 앞쪽 버리기(찾는 폭만큼은 남김).
      const keepFrom = Math.max(0, Math.round(this.nextPos) - this.inputStart - this.tol - 1);
      if (keepFrom > 4096) {
        this.input = this.input.slice(keepFrom);
        this.inputStart += keepFrom;
      }
    }
    if (final) {
      for (let i = 0; i < this.hop; i++) out.push(this.tail[i]);
      this.tail = new Float32Array(this.hop);
    }
    const bytes = new Uint8Array(out.length * 2);
    const view = new DataView(bytes.buffer);
    for (let i = 0; i < out.length; i++) {
      const s = Math.max(-1, Math.min(1, out[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return bytes;
  }
}

/** 흘러가는 s16le 24kHz 소리를 빠르기만 바꿔 흘려 보낸다(rate 1이면 그대로). Voxtral 밖 예전 엔진(id·th 등)용. */
export function stretchStream(stream: ReadableStream<Uint8Array>, rate: number): ReadableStream<Uint8Array> {
  if (rate === 1) return stream;
  const stretch = new TimeStretch(rate);
  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const out = stretch.push(chunk);
        if (out.byteLength) controller.enqueue(out);
      },
      flush(controller) {
        const out = stretch.flush();
        if (out.byteLength) controller.enqueue(out);
      },
    }),
  );
}
