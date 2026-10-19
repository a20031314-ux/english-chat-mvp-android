// 실사용 녹화 → 세로 쇼츠(1080×1920, 15~20초).
// 장면을 events.json 시각으로 자르고, 기다리는 구간은 빠르게, 카드는 확대, 자막·목소리·끝 화면을 입힌다.
//
// 이야기(STORIES):
//   chat   — 편한 말로 쓰기 → 표현 카드 (녹화: store-shots/promo/record.mjs <locale> → tmp/promo/<locale>/)
//   people — 사람·Room·줄 번역·💡 힌트·단체방, 사용자끼리 주고받기
//            (녹화: CAPTURE_MIC_WAV=… node --experimental-strip-types scripts/capture-whats-new.mjs promo-people --only <locale>
//             → tmp/promo/people/<locale>/)
// 결과: 그 폴더의 promo-<이야기>-<locale>.mp4
//
// Run: node store-shots/promo/make.mjs people ko   (이야기를 빼면 chat)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const story = args.length > 1 ? args[0] : "chat";
const locale = args.length > 1 ? args[1] : args[0] || "ko";
const ROOT = process.cwd();
// talk = room 녹화에 목소리(줄마다 다른 사람)를 입힌 판.
const SRC = story === "talk" ? "room" : story;
const DIR = story === "chat" ? path.join(ROOT, "tmp", "promo", locale) : path.join(ROOT, "tmp", "promo", SRC, locale);
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const ev = JSON.parse(fs.readFileSync(path.join(DIR, "events.json"), "utf8"));
const target = locale === "en" ? "es" : "en";

/** 자막(장면 키마다)과 끝 화면 문구, 이야기마다. */
const COPY = {
  chat: {
    ko: {
      hook: "영어로 말하다\n막혔다면?",
      type: "그냥 한국어로\n쓰세요",
      reply: "튜터는 영어로\n대화를 이어가요",
      card: "하고 싶던 말은\n영어로 바로 아래",
      use: "그 표현으로\n바로 말해보기",
      endTitle: "막히면 편한 말로,\n표현은 바로 영어로",
      endSub: "AI 친구와 대화하며 배우는 언어 앱",
    },
  },
  people: {
    ko: {
      p1: "같은 언어 배우는\n사람들을 만나요",
      p2: "방에 들어가\n목소리로 함께",
      p3: "말하는 대로\n자막이 올라와요",
      p4: "모르는 말은\n눌러서 한국어로",
      p5: "막혀서 한국어로\n웅얼거려도",
      p6: "💡 할 말을\n영어로 알려줘요",
      p7: "보내면 다 같이 보는\n영어 자막으로",
      p8: "끝나도 단체방에서\n계속 이어가요",
      endTitle: "혼자 말고,\n같이 말하며 배워요",
      endSub: "같은 언어를 배우는 사람들과 목소리로",
    },
  },
};
COPY.room = {
  en: {
    r1: "Real learners.\nReal voices.", r2: "Live captions\nas they speak", r3: "Tap any line\nto translate", r4: "Stuck? Say it\nyour own way",
    r5: "💡 Get the line\nin Spanish", r6: "Send it.\nEveryone sees it.", endTitle: "Speak with people\nlearning like you", endSub: "Voice rooms with live captions",
  },
  ko: {
    r1: "진짜 학습자들과\n목소리로", r2: "말하는 대로\n자막이 떠요", r3: "모르는 줄은\n눌러서 한국어로", r4: "막히면\n한국어로 말해도",
    r5: "💡 할 말을\n영어로 알려줘요", r6: "보내면\n모두가 봐요", endTitle: "같은 언어 배우는 사람들과\n말하며 배워요", endSub: "자막이 뜨는 음성 대화방",
  },
  ja: {
    r1: "本物の学習者と\n声で話す", r2: "話した言葉が\nすぐ字幕に", r3: "わからない行は\nタップで日本語に", r4: "詰まったら\n日本語で言っても",
    r5: "💡 言いたいことを\n英語で教えてくれる", r6: "送れば\nみんなに届く", endTitle: "同じ言語を学ぶ人と\n話して学ぼう", endSub: "字幕が出るボイスルーム",
  },
  zh: {
    r1: "和真实的学习者\n开口聊", r2: "说话实时\n出字幕", r3: "看不懂的句子\n点一下翻成中文", r4: "卡住了\n说中文也行",
    r5: "💡 告诉你\n英语怎么说", r6: "发出去\n大家都能看到", endTitle: "和一起学语言的人\n边说边学", endSub: "带实时字幕的语音房",
  },
  es: {
    r1: "Estudiantes reales,\nvoces reales", r2: "Subtítulos\nmientras hablan", r3: "Toca una frase\npara traducirla", r4: "¿Te atascas?\nDilo en español",
    r5: "💡 Te da la frase\nen inglés", r6: "Envíala.\nTodos la ven.", endTitle: "Habla con gente\nque aprende como tú", endSub: "Salas de voz con subtítulos",
  },
  hi: {
    r1: "असली सीखने वाले,\nअसली आवाज़ें", r2: "बोलते ही\nसबटाइटल", r3: "कोई भी लाइन टैप करें,\nहिंदी में देखें", r4: "अटक गए?\nहिंदी में बोलें",
    r5: "💡 अंग्रेज़ी में\nवाक्य मिलेगा", r6: "भेजें,\nसब देखेंगे", endTitle: "साथ सीखने वालों से\nबोलकर सीखें", endSub: "सबटाइटल वाले वॉइस रूम",
  },
};
COPY.invite = {
  en: { i1: "Learning alone?\nBring a friend.", i2: "One link.\nThey're in.", i3: "Your own\nstudy team", i4: "Days together,\nregular meetups", i5: "Goals and phrases\nyou share", endTitle: "Learn with friends,\nnot alone", endSub: "Invite links, study mates and team spaces" },
  ko: { i1: "혼자 공부 말고\n친구를 불러요", i2: "링크 하나로\n바로 들어와요", i3: "우리만의\n공부 팀", i4: "같이 한 날,\n정기 모임까지", i5: "목표와 표현을\n함께 쌓아요", endTitle: "친구랑 같이,\n꾸준히 배워요", endSub: "친구 초대 · 러닝메이트 · 팀 워크스페이스" },
  ja: { i1: "一人で勉強より\n友達を呼ぼう", i2: "リンクひとつで\nすぐ参加", i3: "自分たちだけの\n勉強チーム", i4: "一緒にやった日も\n定例会も", i5: "目標と表現を\n一緒に貯める", endTitle: "友達と一緒に、\n続けて学ぼう", endSub: "友達招待・ラーニングメイト・チームスペース" },
  zh: { i1: "别一个人学\n叫上朋友", i2: "一个链接\n马上加入", i3: "我们自己的\n学习小组", i4: "一起学的天数\n固定聚会", i5: "目标和表达\n一起积累", endTitle: "和朋友一起\n坚持学下去", endSub: "邀请好友 · 学习伙伴 · 小组空间" },
  es: { i1: "¿Estudias solo?\nTrae a un amigo.", i2: "Un enlace\ny ya está dentro", i3: "Tu propio\nequipo de estudio", i4: "Días juntos,\nquedadas fijas", i5: "Metas y frases\ncompartidas", endTitle: "Aprende con amigos,\nno solo", endSub: "Invitaciones, compañeros y espacios de equipo" },
  hi: { i1: "अकेले पढ़ाई?\nदोस्त को बुलाएँ", i2: "एक लिंक,\nऔर वे अंदर", i3: "आपकी अपनी\nस्टडी टीम", i4: "साथ बिताए दिन,\nतय मुलाक़ातें", i5: "लक्ष्य और वाक्यांश\nसाथ में", endTitle: "दोस्तों के साथ सीखें,\nअकेले नहीं", endSub: "दोस्त बुलाएँ · लर्निंग मेट · टीम स्पेस" },
};
const FONT = { ko: "'Noto Sans CJK KR', sans-serif", ja: "'Noto Sans CJK JP', sans-serif", zh: "'Noto Sans CJK SC', sans-serif", hi: "'Noto Sans Devanagari', 'Noto Sans', sans-serif" };
const STORE_LINE = { ko: "Google Play에서 만나요", en: "Get it on Google Play", ja: "Google Playで配信中", zh: "在 Google Play 下载", es: "Disponible en Google Play", hi: "Google Play पर पाएँ" };
COPY.talk = COPY.room;
const C = { font: FONT[locale] ?? "'Noto Sans', sans-serif", store: STORE_LINE[locale] ?? STORE_LINE.en, ...(COPY[story]?.[locale] ?? {}) };
if (!COPY[story]?.[locale]) throw new Error(`no promo copy for ${story}/${locale}`);

/**
 * 장면 자르기(원본 시각): [시작, 끝, 속도, 자막 키, 확대]. 확대 = { by, x, y }(창 위치 비율),
 * voice = 목소리로 읽을 글자, voiceIn = 확대 장면 시작 뒤 몇 초에.
 */
const STORIES = {
  chat: () => ({
    segs: [
      [Math.max(0, ev.typeStart - 1.8), ev.typeStart + 0.1, 1, "hook"],
      [ev.typeStart + 0.1, ev.sent + 0.3, 1, "type"],
      [ev.sent + 0.3, ev.reply - 0.2, 3, "type"],
      [ev.reply - 0.2, ev.cardTap + 0.1, 1, "reply"],
      [ev.cardTap + 0.1, ev.card, 2.5, "reply"],
      // 카드(오른쪽 정렬 말풍선, 화면 위쪽 1/3): 오른쪽 끝이 잘리지 않게 창을 오른쪽으로.
      [ev.card, ev.use - 0.1, 1, "card", { by: 0.25, x: 0.9, y: 0.2 }],
      [ev.use - 0.1, ev.end - 0.4, 1, "use"],
    ],
    voice: ev.expression,
    voiceIn: 0.5,
  }),
  people: () => ({
    segs: [
      [Math.max(0, ev.people - 0.4), ev.follow + 0.8, 1, "p1"],
      [ev.follow + 0.8, ev.join + 0.4, 1.8, "p2"],
      [ev.join + 0.4, ev.lines + 1.4, 1.7, "p3"],
      [ev.lines + 1.4, ev.translated + 1.3, 1.2, "p4"],
      // 힌트를 기다리는 시간은 운영 응답에 따라 달라서, 늘 약 2.2초로 줄인다.
      [ev.question - 0.1, ev.hint - 0.3, Math.max(1.4, (ev.hint - 0.2 - ev.question) / 2.2), "p5"],
      // 💡 힌트 카드(자막 칸, 화면 가운데쯤).
      [ev.hint - 0.3, ev.sent - 0.1, 1, "p6", { by: 0.2, x: 0.5, y: 0.42 }],
      [ev.sent - 0.1, ev.sent + 1.9, 1, "p7"],
      [ev.group - 0.3, ev.group + 2.2, 1, "p8"],
    ],
    voice: ev.hintText,
    voiceIn: 0.6,
  }),
};
STORIES.room = () => ({
  segs: [
    [Math.max(0, ev.rooms - 1.2), ev.join + 0.5, 1, "r1"],
    [ev.join + 0.3, ev.lines + 1.2, 1.8, "r2"],
    [ev.lines + 1.2, ev.translated + 1.2, 1.2, "r3"],
    // 힌트를 기다리는 시간은 운영 응답에 따라 달라서, 늘 약 2초로 줄인다.
    [ev.question - 0.1, ev.hint - 0.3, Math.max(1.3, (ev.hint - 0.2 - ev.question) / 2.0), "r4"],
    [ev.hint - 0.3, ev.sent - 0.1, 1, "r5", { by: 0.2, x: 0.5, y: 0.42 }],
    [ev.sent - 0.1, ev.sent + 1.8, 1, "r6"],
  ],
  voice: ev.hintText,
  voiceIn: 0.6,
});
// 친구 초대 → 친구가 받은 초대 → 팀 워크스페이스(녹화: capture-whats-new.mjs promo-invite).
STORIES.invite = () => ({
  segs: [
    [Math.max(0, ev.people - 0.9), ev.invite + 1.7, 1, "i1"],
    [ev.welcome - 0.3, ev.welcome + 2.3, 1, "i2"],
    [ev.messages - 0.2, ev.space - 0.2, 1.3, "i3"],
    // 워크스페이스는 카드가 화면 가로를 꽉 채워 확대하면 양쪽이 잘린다: 확대 없이.
    [ev.space - 0.2, ev.space + 2.0, 1, "i4"],
    [ev.space + 2.0, ev.end - 0.2, 1.2, "i5"],
  ],
});
// 목소리 대화판: 줄이 뜰 때 그 사람 목소리로 읽고(Yuki·Lucía는 학습 언어, 나는 막혀서 편한 말로 웅얼 → 💡 문장을 학습 언어로),
// 세부 기능(자막 줄·번역·힌트 카드·보낸 댓글)은 확대해서 보여준다. 말이 나오는 구간은 1배속.
// 확대 창: 자막 칸은 화면 위 1/3 아래쪽, 글줄은 왼쪽 정렬이라 창을 왼쪽에 붙인다.
const UI_LANG = { ko: "ko-KR", ja: "ja-JP", zh: "zh-CN", es: "es-ES", hi: "hi-IN", en: "en-US" };
const TARGET_LANG = target === "en" ? "en-US" : "es-ES";
STORIES.talk = () => {
  // 자막 칸(화면 위에서 43~61%)과 채팅 칸(62~75%)을 띄워 키운다.
  const CAPS = { pop: [0.432, 0.61] };
  const CHAT = { pop: [0.615, 0.75] };
  return {
    segs: [
      [Math.max(0, ev.rooms - 1.2), ev.join + 0.4, 1.3, "r1"],
      [ev.join + 0.4, ev.line1 - 0.1, 2, "r1"],
      [ev.line1 - 0.1, ev.tap - 0.2, 1, "r2", CAPS],
      [ev.tap - 0.2, ev.translated + 1.6, 1.3, "r3", CAPS],
      [ev.question - 0.2, ev.mumble + 0.1, 1, "r4", CAPS],
      // 힌트는 운영 응답을 기다리므로 약 2.6초로 줄인다(웅얼거림 목소리는 이 구간 처음부터 제 속도로).
      [ev.mumble + 0.1, ev.hint - 0.5, Math.max(1, (ev.hint - 0.6 - ev.mumble) / 2.6), "r4", CAPS],
      [ev.hint - 0.5, ev.sent - 0.1, 1, "r5", CAPS],
      [ev.sent - 0.1, ev.sent + 2.0, 1, "r6", CHAT],
    ],
    voices: [
      { text: ev.line1Text, lang: TARGET_LANG, voice: "nova", src: ev.line1 + 0.25 },
      { text: ev.line2Text, lang: TARGET_LANG, voice: "shimmer", src: ev.line2 + 0.2 },
      { text: ev.questionText, lang: TARGET_LANG, voice: "nova", src: ev.question + 0.2 },
      { text: ev.mumbleText, lang: UI_LANG[locale] ?? "en-US", voice: "ash", src: ev.mumble + 0.15 },
      { text: ev.hintText, lang: TARGET_LANG, voice: "ash", src: ev.hint + 0.6 },
    ],
  };
};
const plan = STORIES[story]();

// ── 1. 장면 자르기(원본 시각) ──
const segs = plan.segs;
const END_CARD = story === "chat" || story === "people" ? 2.6 : 2.2;
let out = 0;
const timeline = segs.map(([a, b, speed, cap, zoom]) => {
  const dur = (b - a) / speed;
  const row = { a, b, speed, cap, zoom, at: out, dur };
  out += dur;
  return row;
});
const phoneDur = out;
const total = phoneDur + END_CARD;

// ── 2. 그림(자막·프레임·끝 화면)은 HTML로 그려 PNG ──
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function png(file, body, { transparent = true } = {}) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:${transparent ? "transparent" : "#15161A"};font-family:${C.font};color:#fff}
  </style></head><body>${body}</body></html>`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: transparent });
}
const PHONE = { x: 210, y: 400, w: 660 }; // 824×1830 → 660×1466
PHONE.h = Math.round((PHONE.w * 1830) / 824);
const R = 64;
// 배경 + 휴대폰 테두리(가운데는 투명하게 뚫어 영상이 보이게: 영상 위에 덮는다).
await png(path.join(DIR, "bg.png"), "", { transparent: false });
await png(path.join(DIR, "frame.png"), `
  <div style="position:absolute;left:${PHONE.x - 14}px;top:${PHONE.y - 14}px;width:${PHONE.w}px;height:${PHONE.h}px;
    border:14px solid #000;border-radius:${R}px;box-shadow:0 0 0 2px #34353C, 0 40px 120px rgba(0,0,0,.6), 0 0 0 9999px #15161A"></div>`);
const capKeys = [...new Set(segs.map((x) => x[3]))];
const PALETTE = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
const accent = Object.fromEntries(capKeys.map((k, i) => [k, PALETTE[i % PALETTE.length]]));
for (const key of capKeys) {
  await png(path.join(DIR, `cap-${key}.png`), `
    <div style="position:absolute;top:96px;left:0;right:0;text-align:center">
      <div style="display:inline-block;width:56px;height:8px;border-radius:4px;background:${accent[key]};margin-bottom:26px"></div>
      <h1 style="margin:0;font-size:88px;line-height:1.14;font-weight:900;letter-spacing:-.02em;white-space:pre-line">${esc(C[key])}</h1>
    </div>`);
}
const icon = fs.readFileSync(path.join(ROOT, "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")).toString("base64");
await png(path.join(DIR, "end.png"), `
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:0">
    <img src="data:image/png;base64,${icon}" style="width:220px;height:220px;border-radius:50%">
    <div style="margin-top:40px;font-size:64px;font-weight:800;letter-spacing:-.01em">languagebank</div>
    <h1 style="margin:46px 0 0;font-size:84px;line-height:1.16;font-weight:900;white-space:pre-line">${esc(C.endTitle)}</h1>
    <p style="margin:30px 0 0;font-size:38px;color:#B7B8BF">${esc(C.endSub)}</p>
    <div style="margin-top:80px;padding:26px 54px;border-radius:999px;background:#fff;color:#111;font-size:40px;font-weight:800">${esc(C.store)}</div>
  </div>`, { transparent: false });
await browser.close();

// ── 3. 목소리: 카드·힌트의 문장을 앱 TTS로(운영 /api/tts, 24kHz 원시 PCM) ──
let voice = null;
// 여러 목소리: [{ wav, at(결과 영상 초) }]
const voiceTracks = [];
const outAt = (src) => {
  const row = timeline.find((s) => src >= s.a && src < s.b) ?? timeline.find((s) => s.a >= src);
  return row ? row.at + Math.max(0, src - row.a) / row.speed : 0;
};
for (const [i, v] of (plan.voices ?? []).entries()) {
  if (!v.text) continue;
  const url = `${API}/api/tts?text=${encodeURIComponent(v.text)}&lang=${v.lang}&voice=${v.voice}`;
  const pcm = path.join(DIR, `voice-${i}.pcm`);
  const wav = path.join(DIR, `voice-${i}.wav`);
  try {
    execFileSync("curl", ["-sSf", "-o", pcm, "-H", `x-rc-user: promo-voice-${locale}`, url]);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, "-af", "silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse", wav]);
    const len = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString());
    voiceTracks.push({ wav, at: outAt(v.src), len, text: v.text });
  } catch {
    console.log(`목소리 ${i} 실패: ${v.text}`);
  }
}
if (plan.voice) {
  // curl: 작업 공간 프록시에서 Node fetch가 끊길 때가 있다.
  const url = `${API}/api/tts?text=${encodeURIComponent(plan.voice)}&lang=${target === "en" ? "en-US" : "es-ES"}`;
  try {
    execFileSync("curl", ["-sSf", "-o", path.join(DIR, "voice.pcm"), "-H", `x-rc-user: promo-voice-${locale}`, url]);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", path.join(DIR, "voice.pcm"), path.join(DIR, "voice.wav")]);
    voice = path.join(DIR, "voice.wav");
  } catch {
    console.log("목소리 없이 만든다(TTS 실패).");
  }
}

// ── 4. ffmpeg: 장면 → 이어 붙이기 → 확대 → 프레임·자막·끝 화면·목소리 ──
const sameZoom = (a, b) => !a?.zoom?.pop && a?.zoom && b?.zoom && JSON.stringify(a.zoom) === JSON.stringify(b.zoom);
const parts = timeline.map((s, i) => {
  let f = `[0:v]trim=start=${s.a.toFixed(3)}:end=${s.b.toFixed(3)},setpts=(PTS-STARTPTS)/${s.speed}`;
  if (s.zoom && !s.zoom.pop) {
    // 0.5초 동안 by배만큼 확대, 창은 zoom.x·zoom.y 비율 위치.
    const z = s.zoom;
    // 들어갈 때 0.5초 확대, 장면 끝 0.4초에 다시 원래대로.
    f += `,scale=w='trunc(824*(1+${z.by}*max(0,min(${sameZoom(timeline[i - 1], s) ? "1" : "min(1,t/0.5)"},${sameZoom(s, timeline[i + 1]) ? "1" : `(${s.dur.toFixed(3)}-t)/0.4`})))/2)*2':h=-2:eval=frame,crop=824:1830:x='(in_w-824)*${z.x}':y='(in_h-1830)*${z.y}'`;
  }
  return `${f},fps=25,setsar=1[p${i}]`;
});
const concat = `${timeline.map((_, i) => `[p${i}]`).join("")}concat=n=${timeline.length}:v=1:a=0[phone]`;
const capInputs = capKeys;
const inputs = ["-i", path.join(DIR, "raw.mp4"), "-loop", "1", "-t", String(total), "-i", path.join(DIR, "bg.png"),
  "-loop", "1", "-t", String(total), "-i", path.join(DIR, "frame.png"),
  ...capInputs.flatMap((k) => ["-loop", "1", "-t", String(total), "-i", path.join(DIR, `cap-${k}.png`)]),
  "-loop", "1", "-t", String(END_CARD), "-i", path.join(DIR, "end.png")];
if (voice) inputs.push("-i", voice);
for (const v of voiceTracks) inputs.push("-i", v.wav);
// 확대 창(pop): 휴대폰 위에 그 부분만 화면 가로 가까이 키워 띄운다 — 글줄이 가로를 다 써서 화면째 확대하면 잘린다.
const pops = timeline.filter((s) => s.zoom?.pop);
const popFirst = inputs.filter((x) => x === "-i").length;
for (const _ of pops) inputs.push("-i", path.join(DIR, "raw.mp4"));
const endIdx = 3 + capInputs.length;
const between = (a, b) => `between(t,${a.toFixed(3)},${b.toFixed(3)})`;
const capWindows = Object.fromEntries(capInputs.map((k) => {
  const rows = timeline.filter((s) => s.cap === k);
  return [k, rows.length ? [rows[0].at, rows.at(-1).at + rows.at(-1).dur] : null];
}));
let chain = `[1:v][phonev]overlay=x=${PHONE.x}:y=${PHONE.y}:shortest=0[s0];[s0][2:v]overlay=0:0[s1]`;
let last = "s1";
capInputs.forEach((k, i) => {
  const w = capWindows[k];
  if (!w) return;
  chain += `;[${last}][${3 + i}:v]overlay=0:0:enable='${between(w[0], w[1])}'[c${i}]`;
  last = `c${i}`;
});
pops.forEach((s, i) => {
  const [y0, y1] = s.zoom.pop;
  const h = Math.round(((y1 - y0) * 1830) / 2) * 2;
  const W = 1000;
  const top = Math.round(PHONE.y + ((y0 + y1) / 2) * PHONE.h - ((h * W) / 824 + 16) / 2);
  chain += `;[${popFirst + i}:v]trim=start=${s.a.toFixed(3)}:end=${s.b.toFixed(3)},setpts=(PTS-STARTPTS)/${s.speed},crop=824:${h}:0:${Math.round(y0 * 1830)},scale=${W}:-2,pad=iw+16:ih+16:8:8:color=0x7CC4FF,format=rgba,fade=in:st=0:d=0.3:alpha=1,fps=25,setpts=PTS+${s.at.toFixed(3)}/TB[pop${i}]`;
  chain += `;[${last}][pop${i}]overlay=x=${(1080 - W - 16) / 2}:y=${top}:eof_action=pass:enable='${between(s.at, s.at + s.dur)}'[q${i}]`;
  last = `q${i}`;
});
chain += `;[${endIdx}:v]setpts=PTS-STARTPTS+${phoneDur.toFixed(3)}/TB[endv];[${last}][endv]overlay=0:0:enable='gte(t,${phoneDur.toFixed(3)})'[v]`;
const phoneScale = `[phone]scale=${PHONE.w}:${PHONE.h},tpad=stop_mode=clone:stop_duration=${END_CARD}[phonev]`;
const cardAt = (timeline.find((s) => s.zoom)?.at ?? 0) + (plan.voiceIn ?? 0);
const audio = voice
  ? `;[${endIdx + 1}:a]adelay=${Math.round(cardAt * 1000)}|${Math.round(cardAt * 1000)},apad,atrim=0:${total.toFixed(3)}[a]`
  : "";
let mix = "";
if (voiceTracks.length) {
  const first = endIdx + 1 + (voice ? 1 : 0);
  const labels = voiceTracks.map((v, i) => {
    const ms = Math.round(v.at * 1000);
    mix += `;[${first + i}:a]adelay=${ms}|${ms},apad=whole_dur=${total.toFixed(3)}[v${i}]`;
    return `[v${i}]`;
  });
  mix += `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=longest,atrim=0:${total.toFixed(3)}[a]`;
}
const filter = [...parts, concat, phoneScale, chain].join(";") + audio + mix;
const file = path.join(DIR, `promo-${story}-${locale}.mp4`);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[v]",
  ...(voice || voiceTracks.length ? ["-map", "[a]", "-c:a", "aac", "-b:a", "160k"] : []),
  "-t", total.toFixed(3), "-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file]);
console.log(`${file}  ${total.toFixed(1)}초`);
for (const v of voiceTracks) console.log(`목소리 ${v.at.toFixed(1)}s +${v.len.toFixed(1)}s  ${v.text}`);
console.log(timeline.map((s) => `${s.cap.padEnd(6)} ${s.at.toFixed(1)}–${(s.at + s.dur).toFixed(1)}s x${s.speed}${s.zoom ? " 확대" : ""}`).join("\n"));
