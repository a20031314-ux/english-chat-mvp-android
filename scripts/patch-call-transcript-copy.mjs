/**
 * Add the call transcript's header label to the generated locales.
 *
 * The header carries the only words the transcript shows. Everything else in it
 * is the call's own sentences, which are already in whatever language was
 * spoken, and the line count, which is a numeral. So this is the one string
 * that has to exist in every UI language.
 *
 * ko, en and es are written out in copy.ts itself and are not touched here.
 *
 * Run: node scripts/patch-call-transcript-copy.mjs
 */
import fs from "fs";

const path = "./src/lib/locales/generated.json";
const generated = JSON.parse(fs.readFileSync(path, "utf8"));

/** Deliberately short: it sits above the transcript, not as a heading over a page. */
const callTranscriptTitle = {
  ja: "通話の記録",
  zh: "通话记录",
  vi: "Bản ghi cuộc gọi",
  fr: "Transcription de l’appel",
  pt: "Transcrição da chamada",
  id: "Transkrip panggilan",
  it: "Trascrizione della chiamata",
  ru: "Расшифровка звонка",
  ar: "نص المكالمة",
  th: "บันทึกการโทร",
  hi: "कॉल ट्रांसक्रिप्ट",
};

const missing = Object.keys(generated).filter((l) => !callTranscriptTitle[l]);
if (missing.length > 0) {
  console.error(`No translation for: ${missing.join(", ")}`);
  process.exit(1);
}

for (const [locale, value] of Object.entries(callTranscriptTitle)) {
  if (!generated[locale]) {
    console.error(`generated.json has no locale "${locale}".`);
    process.exit(1);
  }
  generated[locale].callTranscriptTitle = value;
}

fs.writeFileSync(path, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
console.log(
  `callTranscriptTitle added to ${Object.keys(callTranscriptTitle).length} locales.`,
);
