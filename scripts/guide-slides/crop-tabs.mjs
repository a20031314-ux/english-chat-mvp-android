// 사용법 AI 튜터·대화·영상 학습·사람·Room 장 넘겨 보기 재료: capture-whats-new.mjs가 찍은 전체 화면에서 기능 부분만 자른다 → tmp/guide-slides/raw/tab-*.png.
// 저장소 맨 위에서(한국어 앱 · 영어 학습):
//   npm run build:capacitor
//   CAPTURE_RUN=<새 값> API_BASE=https://www.languagebank.net node --experimental-strip-types scripts/capture-whats-new.mjs store-tabs --only ko   (chat-correct·chat-fix-open·chat-expression까지만 쓰므로 그 뒤 실패는 상관없음)
//   같은 식으로 guide-social · guide-more · guide-video --only ko → public/guide/ko에 쓴 그림을 tmp/guide-slides/src-ko/로 옮기고 `git checkout -- public/guide/ko`(옛 앱 사용법 그림은 그대로 둔다)
//   node scripts/guide-slides/crop-tabs.mjs → node --experimental-strip-types scripts/guide-slides/compose.mjs ko
// 자르는 자리(원본 픽셀 y 위·아래)는 화면이 바뀌면 다시 본다.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SRC = "tmp/guide-slides/src-ko", RAW = "tmp/guide-slides/raw";
const CROPS = {
  "tab-chat-1": [`tmp/store-raw/ko/chat-correct.png`, 200, 700],
  "tab-chat-2": [`tmp/store-raw/ko/chat-fix-open.png`, 200, 700],
  "tab-chat-3": [`tmp/store-raw/ko/chat-expression.png`, 830, 1260],
  "tab-talk-1": [`${SRC}/talk-calls.webp`, 60, 590],
  "tab-talk-2": [`${SRC}/r69-groups.webp`, 0, 560],
  "tab-talk-3": [`${SRC}/talk-dm.webp`, 0, 740],
  "tab-video-1": [`${SRC}/video-library.webp`, 360, 1050],
  "tab-video-2": [`${SRC}/video-study.webp`, 0, 700],
  "tab-video-3": [`${SRC}/video-ask.webp`, 0, 940],
  "tab-people-1": [`${SRC}/r69-people.webp`, 640, 1050],
  "tab-people-2": [`${SRC}/r69-board.webp`, 60, 850],
  "tab-rooms-1": [`${SRC}/r69-free.webp`, 420, 1000],
  "tab-rooms-2": [`${SRC}/room-game.webp`, 0, 960],
};
fs.mkdirSync(RAW, { recursive: true });
for (const [name, [file, top, bottom]] of Object.entries(CROPS)) {
  execFileSync("python3", ["-c", `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert("RGB")
im=im.crop((0,int(sys.argv[2]),im.width,min(int(sys.argv[3]),im.height)))
im=im.resize((780,round(im.height*780/im.width)),Image.LANCZOS)
im.save(sys.argv[4])
`, file, String(top), String(bottom), `${RAW}/${name}.png`]);
  console.log(name);
}
