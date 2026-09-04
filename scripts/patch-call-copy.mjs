/**
 * Add the call feature's own strings to the generated locales.
 *
 * Most call copy sits in the English overlay in copy.ts, which means ja, zh, vi
 * and the rest read it in English. These are the ones worth not doing that to:
 * the transcript header is a label the learner sees on every screen after a
 * call, and the out-of-points line is the app declining to do the thing they
 * asked for, which is the worst moment to be unreadable.
 *
 * ko, en and es are written out in copy.ts itself and are not touched here.
 *
 * Run: node scripts/patch-call-copy.mjs
 */
import fs from "fs";

const path = "./src/lib/locales/generated.json";
const generated = JSON.parse(fs.readFileSync(path, "utf8"));

/** Short: it sits above the transcript, not as a heading over a page. */
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

/**
 * Says what ran out and when it comes back. It deliberately does not offer to
 * sell anything, because there is nothing to buy yet — the line changes when
 * that exists.
 */
const chatCallNoPoints = {
  ja: "通話ポイントを使い切りました。来月また補充されます。",
  zh: "通话点数已用完，下个月会重新补充。",
  vi: "Bạn đã dùng hết điểm gọi. Điểm sẽ được nạp lại vào tháng sau.",
  fr: "Vous n’avez plus de points d’appel. Ils seront rechargés le mois prochain.",
  pt: "Você ficou sem pontos de chamada. Eles são recarregados no próximo mês.",
  id: "Poin panggilan Anda habis. Poin akan diisi ulang bulan depan.",
  it: "Hai esaurito i punti chiamata. Si ricaricano il mese prossimo.",
  ru: "Минуты звонков закончились. Они пополнятся в следующем месяце.",
  ar: "لقد استنفدت نقاط المكالمات. سيتم تجديدها الشهر المقبل.",
  th: "คุณใช้พอยต์โทรหมดแล้ว พอยต์จะเติมใหม่เดือนหน้า",
  hi: "आपके कॉल पॉइंट खत्म हो गए हैं। ये अगले महीने फिर से भर जाएंगे।",
};

const packs = { callTranscriptTitle, chatCallNoPoints };

for (const [key, byLocale] of Object.entries(packs)) {
  const missing = Object.keys(generated).filter((locale) => !byLocale[locale]);
  if (missing.length > 0) {
    console.error(`${key} has no translation for: ${missing.join(", ")}`);
    process.exit(1);
  }
  for (const [locale, value] of Object.entries(byLocale)) {
    if (!generated[locale]) {
      console.error(`generated.json has no locale "${locale}".`);
      process.exit(1);
    }
    generated[locale][key] = value;
  }
}

fs.writeFileSync(path, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
console.log(
  `${Object.keys(packs).length} keys written to ${Object.keys(generated).length} locales.`,
);
