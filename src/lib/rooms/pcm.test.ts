import assert from "node:assert/strict";
import test from "node:test";
import { PcmRing, concatPcm, downsample, encodeWav } from "./pcm.ts";

test("고리 버퍼는 최근 표본만 순서대로 간직한다", () => {
  const ring = new PcmRing(4);
  ring.push(new Float32Array([1, 2, 3]));
  assert.deepEqual([...ring.snapshot()], [1, 2, 3]);
  ring.push(new Float32Array([4, 5, 6]));
  assert.deepEqual([...ring.snapshot()], [3, 4, 5, 6]);
});

test("앞부분 + 녹음을 이어 붙인다", () => {
  assert.deepEqual([...concatPcm([new Float32Array([1]), new Float32Array([2, 3])])], [1, 2, 3]);
});

test("48kHz → 16kHz는 길이가 1/3", () => {
  const out = downsample(new Float32Array(48_000).fill(0.5), 48_000);
  assert.equal(out.length, 16_000);
  assert.ok(Math.abs(out[100] - 0.5) < 1e-6);
  // 이미 낮으면 그대로
  const same = new Float32Array(10);
  assert.equal(downsample(same, 16_000), same);
});

test("WAV 머리글과 크기", () => {
  const wav = encodeWav(new Float32Array([0, 1, -1]));
  const text = (from: number, to: number) => String.fromCharCode(...wav.subarray(from, to));
  assert.equal(text(0, 4), "RIFF");
  assert.equal(text(8, 12), "WAVE");
  const view = new DataView(wav.buffer);
  assert.equal(view.getUint32(24, true), 16_000);
  assert.equal(view.getUint32(40, true), 6);
  assert.equal(view.getInt16(46, true), 0x7fff);
  assert.equal(view.getInt16(48, true), -0x8000);
});
