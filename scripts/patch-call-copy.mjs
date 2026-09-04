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

/** Heading over the top-up bundles. */
const pointsSectionTitle = {
  ja: "ポイントの追加",
  zh: "补充点数",
  vi: "Nạp thêm điểm",
  fr: "Recharger des points",
  pt: "Recarregar pontos",
  id: "Isi ulang poin",
  it: "Ricarica punti",
  ru: "Пополнить баланс",
  ar: "شحن النقاط",
  th: "เติมพอยต์",
  hi: "पॉइंट रीचार्ज करें",
};

/** Current balance. {n} is a numeral, so no plural rule is needed. */
const pointsBalance = {
  ja: "残り {n}P",
  zh: "剩余 {n}P",
  vi: "Còn {n}P",
  fr: "{n} P restants",
  pt: "{n}P restantes",
  id: "Sisa {n}P",
  it: "{n}P rimanenti",
  ru: "Осталось {n}P",
  ar: "المتبقي {n}P",
  th: "เหลือ {n}P",
  hi: "{n}P शेष",
};

/** Shown after a purchase is credited. */
const pointsPurchased = {
  ja: "{n}P を追加しました。",
  zh: "已添加 {n}P。",
  vi: "Đã cộng {n}P.",
  fr: "{n} P ajoutés.",
  pt: "{n}P adicionados.",
  id: "{n}P ditambahkan.",
  it: "{n}P aggiunti.",
  ru: "Начислено {n}P.",
  ar: "تمت إضافة {n}P.",
  th: "เพิ่ม {n}P แล้ว",
  hi: "{n}P जोड़े गए।",
};

/** The store returned nothing to sell. */
const pointsUnavailable = {
  ja: "現在ポイントを追加できません。",
  zh: "目前无法补充点数。",
  vi: "Hiện chưa thể nạp điểm.",
  fr: "Recharge indisponible pour le moment.",
  pt: "Recarga indisponível no momento.",
  id: "Isi ulang belum tersedia saat ini.",
  it: "Ricarica non disponibile al momento.",
  ru: "Пополнение сейчас недоступно.",
  ar: "الشحن غير متاح حاليًا.",
  th: "ยังเติมพอยต์ไม่ได้ในขณะนี้",
  hi: "अभी रीचार्ज उपलब्ध नहीं है।",
};

const packs = {
  callTranscriptTitle,
  chatCallNoPoints,
  pointsSectionTitle,
  pointsBalance,
  pointsPurchased,
  pointsUnavailable,
};

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
