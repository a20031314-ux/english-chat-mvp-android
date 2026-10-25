// 홍보 쇼츠 배경음: 저작권 걱정 없는 직접 만든 로파이 루프(코드 4개 × 2마디, 84bpm, 약 23초 — make.mjs가 반복해 깐다).
// 사용자 결정 2026-10-26 "목소리는 빼고 자막과 음악으로". 다른 음원을 쓰려면 tmp/promo/music.wav를 바꿔 두면 된다.
// Run: node store-shots/promo/music.mjs [out.wav]
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2] || path.join(process.cwd(), "tmp", "promo", "music.wav");
const SR = 44100;
const BPM = 84;
const beat = 60 / BPM;
const bars = 8;
const len = Math.round(bars * 4 * beat * SR);
const L = new Float32Array(len);
const R = new Float32Array(len);
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// 코드: Fmaj7 · Em7 · Dm7 · Cmaj7 (2마디씩).
const CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
];

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function add(buf, start, samples, pan = 0) {
  const s = Math.round(start * SR);
  for (let i = 0; i < samples.length && s + i < len; i++) {
    L[s + i] += samples[i] * (1 - Math.max(0, pan));
    R[s + i] += samples[i] * (1 + Math.min(0, pan));
  }
}

function pad(freq, dur) {
  const n = Math.round(dur * SR);
  const outp = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.6) * Math.min(1, (dur - t) / 0.8);
    const v = Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 1.003 * t) + 0.25 * Math.sin(2 * Math.PI * freq * 2 * t);
    outp[i] = v * env * 0.045;
  }
  return outp;
}

function pluck(freq, dur = 0.6, amp = 0.09) {
  const n = Math.round(dur * SR);
  const outp = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 7) * Math.min(1, t / 0.004);
    outp[i] = (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 3 * t) * Math.exp(-t * 18)) * env * amp;
  }
  return outp;
}

function bass(freq, dur) {
  const n = Math.round(dur * SR);
  const outp = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 1.6);
    outp[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.16;
  }
  return outp;
}

function kick() {
  const n = Math.round(0.35 * SR);
  const outp = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 48 + 70 * Math.exp(-t * 30);
    phase += (2 * Math.PI * f) / SR;
    outp[i] = Math.sin(phase) * Math.exp(-t * 9) * 0.32;
  }
  return outp;
}

function noiseHit(dur, decay, amp, bright = true) {
  const n = Math.round(dur * SR);
  const outp = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = rand();
    const v = bright ? x - prev : (x + prev) / 2; // 고역/저역 대충 거르기
    prev = x;
    outp[i] = v * Math.exp(-t * decay) * amp;
  }
  return outp;
}

for (let bar = 0; bar < bars; bar++) {
  const chord = CHORDS[Math.floor(bar / 2) % CHORDS.length];
  const t0 = bar * 4 * beat;
  if (bar % 2 === 0) for (const note of chord) add(null, t0, pad(midi(note), 8 * beat), (note % 3) * 0.15 - 0.15);
  add(null, t0, bass(midi(chord[0] - 12), 2 * beat));
  add(null, t0 + 2.5 * beat, bass(midi(chord[0] - 12), 1.5 * beat));
  // 아르페지오: 8분음표, 코드 음을 한 옥타브 위로 오르내림(조금 흔들리게).
  const arp = [0, 1, 2, 3, 2, 1, 2, 3].map((k) => chord[k] + 12);
  arp.forEach((note, k) => {
    const swing = k % 2 ? 0.06 * beat : 0;
    add(null, t0 + k * 0.5 * beat + swing, pluck(midi(note), 0.7, k === 0 ? 0.08 : 0.055), k % 2 ? 0.35 : -0.35);
  });
  for (let b = 0; b < 4; b++) {
    const tb = t0 + b * beat;
    if (b === 0 || b === 2) add(null, tb, kick());
    if (b === 1 || b === 3) add(null, tb, noiseHit(0.25, 22, 0.07, false));
    add(null, tb, noiseHit(0.05, 90, 0.035));
    add(null, tb + 0.5 * beat + 0.06 * beat, noiseHit(0.05, 90, 0.022));
  }
}

let peak = 0;
for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.5 / peak;
const data = Buffer.alloc(len * 4);
for (let i = 0; i < len; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.concat([header, data]));
console.log(`${out}  ${(len / SR).toFixed(1)}초`);
