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
