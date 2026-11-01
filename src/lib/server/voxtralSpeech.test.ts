import test from "node:test";
import assert from "node:assert/strict";
import { float32ToPcm16, sseAudioDecoder, voxtralReference } from "./voxtralSpeech.ts";
import { tutorVoice } from "../chatPartner.ts";
import { VOXTRAL_LANGUAGES } from "./voxtralLanguages.ts";

function floats(values: number[]): Buffer {
  const buffer = Buffer.alloc(values.length * 4);
  values.forEach((value, i) => buffer.writeFloatLE(value, i * 4));
  return buffer;
}

test("float32 → s16le, clipping and keeping a split sample for the next chunk", () => {
  const bytes = floats([0, 1, -1, 2, 0.5]);
  const { pcm, rest } = float32ToPcm16(new Uint8Array(bytes.subarray(0, 18)));
  assert.equal(rest.byteLength, 2);
  const view = Buffer.from(pcm);
  assert.deepEqual([0, 1, 2, 3].map((i) => view.readInt16LE(i * 2)), [0, 32767, -32768, 32767]);
});

test("SSE decoder reads events split across network chunks", () => {
  const audio = floats([0.25, -0.25, 0.5]).toString("base64");
  const event = `event: speech.audio.delta\ndata: {"type":"speech.audio.delta","audio_data":"${audio}"}\n\n`;
  const done = `event: speech.audio.done\ndata: {"type":"speech.audio.done","usage":{}}\n\n`;
  const decoder = sseAudioDecoder();
  const all = event + event + done;
  const out: Uint8Array[] = [];
  for (let i = 0; i < all.length; i += 37) out.push(...decoder.push(all.slice(i, i + 37)));
  const pcm = Buffer.concat(out);
  assert.equal(pcm.byteLength, 12);
  assert.ok(Math.abs(pcm.readInt16LE(0) - 0.25 * 0x7fff) <= 1);
  assert.ok(Math.abs(pcm.readInt16LE(2) + 0.25 * 0x8000) <= 1);
  assert.ok(decoder.done());
});

test("every Voxtral language has a reference for both tutors; id and th stay on the old voice", () => {
  for (const lang of VOXTRAL_LANGUAGES) {
    for (const gender of ["f", "m"] as const) assert.ok(voxtralReference(lang, tutorVoice(lang, gender)), `${lang}-${gender}`);
  }
  assert.equal(voxtralReference("id", tutorVoice("id", "f")), null);
  assert.equal(voxtralReference("th", tutorVoice("th", "m")), null);
  // A scene voice outside the tutor table borrows the tutor of the same gender (old es open-talk used verse).
  assert.equal(voxtralReference("es", "verse"), voxtralReference("es", tutorVoice("es", "m")));
});

test("time stretch keeps pitch and lengthens by 1/rate, fed in odd-sized chunks", async () => {
  const { TimeStretch } = await import("./timeStretch.ts");
  const rate = 24000;
  const pcm = Buffer.alloc(rate * 2);
  for (let i = 0; i < rate; i++) pcm.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 200 * i) / rate) * 12000), i * 2);
  const stretch = new TimeStretch(0.9);
  const parts: Uint8Array[] = [];
  for (let i = 0; i < pcm.length; i += 777) parts.push(stretch.push(pcm.subarray(i, i + 777)));
  parts.push(stretch.flush());
  const out = Buffer.concat(parts);
  const seconds = out.length / 2 / rate;
  assert.ok(Math.abs(seconds - 1 / 0.9) < 0.03, `${seconds}s`);
  // 높이: 가운데 0.5초의 영점 교차 수 ≈ 200Hz.
  let crossings = 0;
  for (let i = rate * 0.25; i < rate * 0.75; i++) if ((out.readInt16LE(i * 2) >= 0) !== (out.readInt16LE((i + 1) * 2) >= 0)) crossings++;
  assert.ok(Math.abs(crossings / 2 / 0.5 - 200) < 10, `${crossings / 2 / 0.5}Hz`);
});
