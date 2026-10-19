/**
 * "보내주신 의견이 반영됐어요" 시트 문구 — 14개 언어(feedbackFixCopy.test.ts가 빠짐을 막는다).
 * 한국어 밖은 Claude가 썼다(원어민 확인 권장). {v} 고친 것이 들어간 앱 버전.
 * 카드마다 다른 "무엇이 바뀌었나" 한 줄은 여기가 아니라 반영할 때 서버로 보낸다(feedbackFix.ts).
 */
const ko = {
  title: "보내주신 의견이 반영됐어요",
  thanks: "의견 보내주셔서 고마워요.",
  before: "고치기 전",
  after: "고친 뒤",
  needsUpdate: "앱을 {v}로 업데이트하면 바뀐 모습을 볼 수 있어요.",
  update: "업데이트",
  ok: "확인",
};

type FixCopy = typeof ko;

const en: FixCopy = {
  title: "We made the change you suggested",
  thanks: "Thank you for your feedback.",
  before: "Before",
  after: "After",
  needsUpdate: "Update the app to {v} to see the change.",
  update: "Update",
  ok: "OK",
};

const LOCALES: Record<string, FixCopy> = {
  es: {
    title: "Hicimos el cambio que sugeriste",
    thanks: "Gracias por tu comentario.",
    before: "Antes",
    after: "Después",
    needsUpdate: "Actualiza la app a la versión {v} para ver el cambio.",
    update: "Actualizar",
    ok: "Aceptar",
  },
  ja: {
    title: "いただいたご意見を反映しました",
    thanks: "ご意見ありがとうございます。",
    before: "修正前",
    after: "修正後",
    needsUpdate: "アプリを{v}にアップデートすると変更を確認できます。",
    update: "アップデート",
    ok: "OK",
  },
  zh: {
    title: "你的意见已经采纳",
    thanks: "感谢你的反馈。",
    before: "修改前",
    after: "修改后",
    needsUpdate: "把应用更新到 {v} 就能看到变化。",
    update: "更新",
    ok: "好的",
  },
  vi: {
    title: "Góp ý của bạn đã được áp dụng",
    thanks: "Cảm ơn bạn đã góp ý.",
    before: "Trước",
    after: "Sau",
    needsUpdate: "Cập nhật ứng dụng lên {v} để xem thay đổi.",
    update: "Cập nhật",
    ok: "OK",
  },
  fr: {
    title: "Nous avons appliqué ta suggestion",
    thanks: "Merci pour ton avis.",
    before: "Avant",
    after: "Après",
    needsUpdate: "Mets l'appli à jour vers la version {v} pour voir le changement.",
    update: "Mettre à jour",
    ok: "OK",
  },
  it: {
    title: "Abbiamo applicato il tuo suggerimento",
    thanks: "Grazie per il tuo feedback.",
    before: "Prima",
    after: "Dopo",
    needsUpdate: "Aggiorna l'app alla versione {v} per vedere la modifica.",
    update: "Aggiorna",
    ok: "OK",
  },
  pt: {
    title: "Aplicamos a sua sugestão",
    thanks: "Obrigado pelo seu feedback.",
    before: "Antes",
    after: "Depois",
    needsUpdate: "Atualize o app para a versão {v} para ver a mudança.",
    update: "Atualizar",
    ok: "OK",
  },
  ru: {
    title: "Мы учли ваш отзыв",
    thanks: "Спасибо за отзыв.",
    before: "До",
    after: "После",
    needsUpdate: "Обновите приложение до версии {v}, чтобы увидеть изменения.",
    update: "Обновить",
    ok: "ОК",
  },
  id: {
    title: "Masukanmu sudah kami terapkan",
    thanks: "Terima kasih atas masukanmu.",
    before: "Sebelum",
    after: "Sesudah",
    needsUpdate: "Perbarui aplikasi ke versi {v} untuk melihat perubahannya.",
    update: "Perbarui",
    ok: "OK",
  },
  ar: {
    title: "طبّقنا الاقتراح الذي أرسلته",
    thanks: "شكرًا على ملاحظتك.",
    before: "قبل",
    after: "بعد",
    needsUpdate: "حدّث التطبيق إلى الإصدار {v} لترى التغيير.",
    update: "تحديث",
    ok: "حسنًا",
  },
  th: {
    title: "เราปรับตามความคิดเห็นของคุณแล้ว",
    thanks: "ขอบคุณสำหรับความคิดเห็น",
    before: "ก่อนแก้",
    after: "หลังแก้",
    needsUpdate: "อัปเดตแอปเป็นเวอร์ชัน {v} เพื่อดูสิ่งที่เปลี่ยน",
    update: "อัปเดต",
    ok: "ตกลง",
  },
  hi: {
    title: "आपका सुझाव लागू कर दिया गया है",
    thanks: "अपनी राय भेजने के लिए धन्यवाद।",
    before: "पहले",
    after: "बाद में",
    needsUpdate: "बदलाव देखने के लिए ऐप को {v} पर अपडेट करें।",
    update: "अपडेट करें",
    ok: "ठीक है",
  },
};

export const FIX_COPY_LOCALES = ["ko", "en", ...Object.keys(LOCALES)];
export const FIX_COPY_KEYS = Object.keys(en) as (keyof FixCopy)[];

export function fixCopy(locale: string): FixCopy {
  const base = (locale || "").toLowerCase().split(/[-_]/)[0];
  if (base === "ko") return ko;
  if (base === "en") return en;
  return LOCALES[base] ?? en;
}

export type { FixCopy };
