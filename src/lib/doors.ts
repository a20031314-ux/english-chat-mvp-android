/**
 * 창구(door) — 겉으로는 따로인 서비스, 속은 같은 앱(사용자 결정 2026-10-20, `hub/drafts/doors.md`).
 *
 * 창구 하나 = 이 파일의 설정 한 묶음: 이름·주소(하위 도메인)·색·첫 화면·보이는 탭·소개 글(14개 언어)·검색어.
 * - 주소: `<host>.languagebank.net/`(next.config.ts rewrites → `/door/<id>`), 언어는 `/<언어>`(기본 `defaultLang`).
 *   도메인 연결 전에도 `www.languagebank.net/door/<id>`로 열린다.
 * - 소개 페이지(`app/door/[id]/[[...lang]]`)는 그 기능이 실제로 돌아가는 모습(지금 열린 방 수 등)을 보여 주고,
 *   "들어가기"는 같은 주소의 앱(`/?door=<id>`)으로 — 앱은 그 창구 모드로 열린다(첫 화면·탭만 바뀜, 계정·구독·기록은 하나).
 * - 구글 "출입구 페이지" 정책을 지키려고: 창구마다 실제로 쓰는 기능이 다르고, 그 주소에서 바로 쓴다. 비슷한 창구를 찍어내지 않는다.
 *
 * 새 창구: DOORS에 한 묶음 + next.config.ts의 host 한 줄 + Vercel 도메인·가비아 CNAME + Google 로그인 원본(사람).
 */
import type { AppTab } from "@/components/AppHome";

export const DOOR_LANGS = ["ko", "en", "es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"] as const;
export type DoorLang = (typeof DOOR_LANGS)[number];

export type DoorCopy = {
  /** 브라우저 탭·검색 결과 제목. */
  title: string;
  /** 검색 결과 설명(160자 안). */
  description: string;
  headline: string;
  sub: string;
  features: [string, string][];
  cta: string;
  app: string;
  /** {rooms}·{people}가 채워진다. */
  live: string;
  liveEmpty: string;
  privacy: string;
  /** 운영자 표시(숨기지 않는다). */
  operator: string;
};

export type Door = {
  id: string;
  /** 하위 도메인 앞부분(`call` → call.languagebank.net). */
  host: string;
  /** 서비스 이름(언어마다 다르면 copy에서 쓰고, 여기는 기본). */
  name: string;
  defaultLang: DoorLang;
  /** 앱을 이 창구로 열 때 첫 화면과 하단에 보일 탭(순서대로). */
  start: AppTab;
  tabs: AppTab[];
  /** 소개 페이지 색(`globals.css`의 `[data-door=…]` 토큰을 쓴다). */
  theme: string;
  /** 소개 페이지에 세는 것: 열린 방·말하는 사람(rooms) 또는 지금 접속한 사람(people). */
  live: "rooms" | "people";
  /** 사람 목록을 이 거르기로 연다(`RoomPeople`). */
  peopleFilter?: "online";
  copy: Record<DoorLang, DoorCopy>;
};

const GROUP_CALL: Door = {
  id: "group-call",
  host: "call",
  name: "Moyeo",
  defaultLang: "ko",
  start: "rooms",
  tabs: ["rooms", "talk", "map"],
  theme: "moyeo",
  live: "rooms",
  copy: {
    ko: {
      title: "Moyeo 모여 — 외국인과 단체통화, 언어교환 음성 채팅방",
      description: "전 세계 사람들과 단체통화로 말해 보세요. 말한 문장은 자막으로 바로 뜨고 번역도 볼 수 있어요. 듣기만 해도, 채팅만 해도 괜찮아요.",
      headline: "세계 어디든, 지금 모여서 말해요",
      sub: "외국인과 여럿이 함께하는 단체통화. 말하면 자막이 뜨고, 못 알아들은 줄은 눌러서 번역해요.",
      features: [
        ["🎙 최대 8명이 같이 말해요", "빈자리를 눌러 참여를 요청하고, 방장이 올려 주면 바로 말해요."],
        ["💬 말이 자막으로", "누가 무슨 말을 했는지 줄마다 남아요. 놓친 말은 번역으로 다시 봐요."],
        ["👂 듣기만, 채팅만도 OK", "마이크 없이 들어가 듣거나 댓글로만 함께해도 돼요."],
      ],
      cta: "지금 방 둘러보기",
      app: "앱으로 받기",
      live: "지금 열린 방 {rooms}개 · {people}명이 함께하는 중",
      liveEmpty: "지금은 열린 방이 없어요. 첫 방을 열어 보세요.",
      privacy: "개인정보 처리방침",
      operator: "languagebank가 운영해요",
    },
    en: {
      title: "Moyeo — group voice calls with people worldwide, language exchange rooms",
      description: "Join a group call with people around the world. What you say shows up as captions, with a translation one tap away. Just listening or chatting is fine too.",
      headline: "Gather from anywhere and talk, right now",
      sub: "Group calls with people from other countries. Speech turns into captions, and any line you missed is one tap from a translation.",
      features: [
        ["🎙 Up to 8 people talking", "Tap an empty seat to ask to join; once the host brings you up, you talk."],
        ["💬 Speech becomes captions", "Every line stays with who said it. Missed something? Read it again, translated."],
        ["👂 Just listen, or just chat", "Come in without a mic to listen, or join in with comments only."],
      ],
      cta: "Browse rooms now",
      app: "Get the app",
      live: "{rooms} rooms open now · {people} people talking",
      liveEmpty: "No rooms are open right now. Open the first one.",
      privacy: "Privacy policy",
      operator: "Run by languagebank",
    },
    es: {
      title: "Moyeo — llamadas grupales con gente de todo el mundo, salas de intercambio",
      description: "Únete a una llamada grupal con personas de todo el mundo. Lo que dices aparece como subtítulos y la traducción está a un toque. También puedes solo escuchar o chatear.",
      headline: "Reúnete desde cualquier lugar y habla, ahora",
      sub: "Llamadas grupales con gente de otros países. Lo hablado se convierte en subtítulos y cualquier línea se traduce con un toque.",
      features: [
        ["🎙 Hasta 8 personas hablando", "Toca un asiento libre para pedir unirte; cuando el anfitrión te sube, hablas."],
        ["💬 La voz, en subtítulos", "Cada línea queda con quien la dijo. ¿Te perdiste algo? Léelo traducido."],
        ["👂 Solo escuchar o solo chatear", "Entra sin micrófono para escuchar o participa solo con comentarios."],
      ],
      cta: "Ver salas ahora",
      app: "Descargar la app",
      live: "{rooms} salas abiertas · {people} personas hablando",
      liveEmpty: "Ahora no hay salas abiertas. Abre la primera.",
      privacy: "Política de privacidad",
      operator: "Gestionado por languagebank",
    },
    ja: {
      title: "Moyeo — 世界の人とグループ通話、言語交換の音声ルーム",
      description: "世界中の人とグループ通話で話してみましょう。話した文はすぐ字幕になり、翻訳も見られます。聞くだけ、チャットだけでも大丈夫。",
      headline: "どこからでも、いま集まって話そう",
      sub: "海外の人と何人かで話すグループ通話。話すと字幕が出て、聞き取れなかった行はタップで翻訳。",
      features: [
        ["🎙 最大8人で話せる", "空いている席を押して参加をリクエスト。ホストが上げてくれたらすぐ話せます。"],
        ["💬 声が字幕に", "誰が何を言ったか行ごとに残ります。聞き逃したら翻訳で確認。"],
        ["👂 聞くだけ・チャットだけもOK", "マイクなしで聞いたり、コメントだけで参加したりできます。"],
      ],
      cta: "ルームを見てみる",
      app: "アプリを入手",
      live: "いま開いているルーム {rooms} · {people}人が参加中",
      liveEmpty: "いまは開いているルームがありません。最初のルームを開いてみましょう。",
      privacy: "プライバシーポリシー",
      operator: "運営: languagebank",
    },
    zh: {
      title: "Moyeo — 和世界各地的人群聊语音，语言交换语音房",
      description: "和世界各地的人一起群聊语音。说的话会马上变成字幕，还能看翻译。只听或只打字也可以。",
      headline: "无论在哪，现在就聚在一起聊",
      sub: "和外国朋友多人一起的语音群聊。说话就有字幕，没听懂的那句点一下就能看翻译。",
      features: [
        ["🎙 最多8人一起说", "点空座位申请上麦，房主让你上麦后就能说话。"],
        ["💬 声音变成字幕", "每句话和说话的人都会留下。没听清？看翻译再读一遍。"],
        ["👂 只听、只聊也行", "不开麦进来听，或只用评论参与都可以。"],
      ],
      cta: "现在看看房间",
      app: "下载应用",
      live: "当前开放 {rooms} 个房间 · {people} 人在聊",
      liveEmpty: "现在没有开放的房间。来开第一个吧。",
      privacy: "隐私政策",
      operator: "由 languagebank 运营",
    },
    vi: {
      title: "Moyeo — gọi nhóm với người khắp thế giới, phòng trao đổi ngôn ngữ",
      description: "Tham gia gọi nhóm với mọi người trên thế giới. Lời bạn nói hiện thành phụ đề, bản dịch chỉ một chạm. Chỉ nghe hay chỉ nhắn cũng được.",
      headline: "Ở đâu cũng được, tụ lại và nói ngay",
      sub: "Gọi nhóm cùng người nước ngoài. Lời nói thành phụ đề, câu nào chưa nghe kịp thì chạm để xem bản dịch.",
      features: [
        ["🎙 Tối đa 8 người cùng nói", "Chạm ghế trống để xin tham gia; khi chủ phòng mời lên là bạn nói được."],
        ["💬 Lời nói thành phụ đề", "Mỗi câu đều ghi lại ai đã nói. Lỡ mất? Đọc lại bản dịch."],
        ["👂 Chỉ nghe hoặc chỉ nhắn", "Vào không cần mic để nghe, hoặc tham gia chỉ bằng bình luận."],
      ],
      cta: "Xem phòng ngay",
      app: "Tải ứng dụng",
      live: "{rooms} phòng đang mở · {people} người đang trò chuyện",
      liveEmpty: "Hiện chưa có phòng nào mở. Hãy mở phòng đầu tiên.",
      privacy: "Chính sách quyền riêng tư",
      operator: "Vận hành bởi languagebank",
    },
    fr: {
      title: "Moyeo — appels de groupe avec des gens du monde entier, salons d’échange linguistique",
      description: "Rejoignez un appel de groupe avec des gens du monde entier. Vos paroles s’affichent en sous-titres, la traduction à un toucher. Écouter ou juste écrire, c’est possible aussi.",
      headline: "D’où que vous soyez, réunissez-vous et parlez",
      sub: "Des appels de groupe avec des gens d’autres pays. La parole devient sous-titres, et chaque ligne manquée se traduit d’un toucher.",
      features: [
        ["🎙 Jusqu’à 8 personnes", "Touchez une place libre pour demander à participer ; quand l’hôte vous fait monter, vous parlez."],
        ["💬 La voix en sous-titres", "Chaque ligne reste avec son auteur. Raté ? Relisez-la traduite."],
        ["👂 Juste écouter ou écrire", "Entrez sans micro pour écouter, ou participez seulement par commentaires."],
      ],
      cta: "Voir les salons",
      app: "Télécharger l’app",
      live: "{rooms} salons ouverts · {people} personnes en discussion",
      liveEmpty: "Aucun salon ouvert pour l’instant. Ouvrez le premier.",
      privacy: "Politique de confidentialité",
      operator: "Géré par languagebank",
    },
    it: {
      title: "Moyeo — chiamate di gruppo con persone da tutto il mondo, stanze di scambio linguistico",
      description: "Partecipa a una chiamata di gruppo con persone di tutto il mondo. Quello che dici diventa sottotitoli, la traduzione è a un tocco. Puoi anche solo ascoltare o scrivere.",
      headline: "Da ovunque, ritrovatevi e parlate adesso",
      sub: "Chiamate di gruppo con persone di altri paesi. La voce diventa sottotitoli e ogni riga persa si traduce con un tocco.",
      features: [
        ["🎙 Fino a 8 persone", "Tocca un posto libero per chiedere di partecipare; quando l’host ti fa salire, parli."],
        ["💬 La voce in sottotitoli", "Ogni riga resta con chi l’ha detta. Persa? Rileggila tradotta."],
        ["👂 Solo ascoltare o scrivere", "Entra senza microfono per ascoltare o partecipa solo con i commenti."],
      ],
      cta: "Guarda le stanze",
      app: "Scarica l’app",
      live: "{rooms} stanze aperte · {people} persone in chiamata",
      liveEmpty: "Ora non ci sono stanze aperte. Apri la prima.",
      privacy: "Informativa sulla privacy",
      operator: "Gestito da languagebank",
    },
    pt: {
      title: "Moyeo — chamadas em grupo com pessoas do mundo todo, salas de intercâmbio de idiomas",
      description: "Entre numa chamada em grupo com pessoas do mundo todo. O que você fala vira legenda, com tradução a um toque. Só ouvir ou só conversar por texto também vale.",
      headline: "De qualquer lugar, juntem-se e falem agora",
      sub: "Chamadas em grupo com pessoas de outros países. A fala vira legenda, e qualquer linha perdida se traduz com um toque.",
      features: [
        ["🎙 Até 8 pessoas falando", "Toque num lugar vazio para pedir para participar; quando o anfitrião te chama, você fala."],
        ["💬 A voz vira legenda", "Cada linha fica com quem a disse. Perdeu algo? Leia de novo, traduzido."],
        ["👂 Só ouvir ou só escrever", "Entre sem microfone para ouvir ou participe só com comentários."],
      ],
      cta: "Ver salas agora",
      app: "Baixar o app",
      live: "{rooms} salas abertas · {people} pessoas conversando",
      liveEmpty: "Nenhuma sala aberta agora. Abra a primeira.",
      privacy: "Política de privacidade",
      operator: "Mantido por languagebank",
    },
    ru: {
      title: "Moyeo — групповые звонки с людьми со всего мира, комнаты языкового обмена",
      description: "Присоединяйтесь к групповому звонку с людьми со всего мира. Сказанное сразу появляется субтитрами, перевод — в одно касание. Можно просто слушать или писать.",
      headline: "Откуда угодно — собирайтесь и говорите",
      sub: "Групповые звонки с людьми из других стран. Речь превращается в субтитры, а пропущенную строку можно перевести одним касанием.",
      features: [
        ["🎙 До 8 человек", "Нажмите на свободное место, чтобы попроситься; когда ведущий пригласит, говорите."],
        ["💬 Речь — в субтитры", "Каждая строка остаётся с тем, кто её сказал. Пропустили? Прочитайте перевод."],
        ["👂 Только слушать или писать", "Заходите без микрофона, чтобы слушать, или участвуйте только комментариями."],
      ],
      cta: "Посмотреть комнаты",
      app: "Скачать приложение",
      live: "Открыто комнат: {rooms} · общаются {people}",
      liveEmpty: "Сейчас нет открытых комнат. Откройте первую.",
      privacy: "Политика конфиденциальности",
      operator: "Работает на languagebank",
    },
    id: {
      title: "Moyeo — telepon grup dengan orang dari seluruh dunia, ruang tukar bahasa",
      description: "Ikut telepon grup dengan orang dari seluruh dunia. Ucapanmu langsung jadi teks, terjemahannya cukup sekali ketuk. Cuma mendengar atau mengetik juga boleh.",
      headline: "Dari mana saja, kumpul dan ngobrol sekarang",
      sub: "Telepon grup bersama orang dari negara lain. Ucapan jadi teks, dan kalimat yang terlewat bisa diterjemahkan sekali ketuk.",
      features: [
        ["🎙 Sampai 8 orang bicara", "Ketuk kursi kosong untuk minta bergabung; setelah host menaikkanmu, kamu bicara."],
        ["💬 Suara jadi teks", "Setiap baris tersimpan dengan siapa yang mengucapkannya. Terlewat? Baca terjemahannya."],
        ["👂 Cuma dengar atau ngetik", "Masuk tanpa mikrofon untuk mendengar, atau ikut lewat komentar saja."],
      ],
      cta: "Lihat ruang sekarang",
      app: "Unduh aplikasi",
      live: "{rooms} ruang terbuka · {people} orang mengobrol",
      liveEmpty: "Belum ada ruang yang terbuka. Buka yang pertama.",
      privacy: "Kebijakan privasi",
      operator: "Dikelola oleh languagebank",
    },
    ar: {
      title: "Moyeo — مكالمات جماعية مع أشخاص من حول العالم، غرف تبادل لغوي",
      description: "انضم إلى مكالمة جماعية مع أشخاص من حول العالم. ما تقوله يظهر ترجمةً نصية فورًا، والترجمة بلمسة. يمكنك أيضًا الاستماع فقط أو الكتابة فقط.",
      headline: "من أي مكان، اجتمعوا وتحدثوا الآن",
      sub: "مكالمات جماعية مع أشخاص من بلدان أخرى. الكلام يتحول إلى نص، وأي سطر فاتك يُترجم بلمسة.",
      features: [
        ["🎙 حتى 8 أشخاص يتحدثون", "اضغط على مقعد فارغ لطلب المشاركة؛ عندما يرفعك المضيف تتحدث."],
        ["💬 الكلام نصًا", "يبقى كل سطر مع من قاله. فاتك شيء؟ اقرأه مترجمًا."],
        ["👂 استمع فقط أو اكتب فقط", "ادخل بلا ميكروفون لتستمع، أو شارك بالتعليقات فقط."],
      ],
      cta: "تصفح الغرف الآن",
      app: "حمّل التطبيق",
      live: "{rooms} غرف مفتوحة الآن · {people} يتحدثون",
      liveEmpty: "لا توجد غرف مفتوحة الآن. افتح أول غرفة.",
      privacy: "سياسة الخصوصية",
      operator: "تديره languagebank",
    },
    th: {
      title: "Moyeo — โทรกลุ่มกับคนทั่วโลก ห้องแลกเปลี่ยนภาษา",
      description: "ร่วมโทรกลุ่มกับคนทั่วโลก สิ่งที่พูดขึ้นเป็นคำบรรยายทันที ดูคำแปลได้ด้วยการแตะ ฟังอย่างเดียวหรือพิมพ์อย่างเดียวก็ได้",
      headline: "อยู่ที่ไหนก็มารวมกันคุยได้เลย",
      sub: "โทรกลุ่มกับคนต่างประเทศ เสียงพูดกลายเป็นคำบรรยาย ประโยคไหนฟังไม่ทันแตะเพื่อดูคำแปล",
      features: [
        ["🎙 พูดพร้อมกันได้ถึง 8 คน", "แตะที่นั่งว่างเพื่อขอร่วมพูด เมื่อโฮสต์เชิญขึ้นก็พูดได้เลย"],
        ["💬 เสียงกลายเป็นคำบรรยาย", "ทุกประโยคเก็บไว้พร้อมชื่อคนพูด ฟังไม่ทันก็อ่านคำแปลได้"],
        ["👂 ฟังอย่างเดียวหรือพิมพ์อย่างเดียว", "เข้าแบบไม่เปิดไมค์เพื่อฟัง หรือร่วมด้วยคอมเมนต์อย่างเดียว"],
      ],
      cta: "ดูห้องตอนนี้",
      app: "ดาวน์โหลดแอป",
      live: "เปิดอยู่ {rooms} ห้อง · {people} คนกำลังคุย",
      liveEmpty: "ตอนนี้ยังไม่มีห้องเปิด ลองเปิดห้องแรกดู",
      privacy: "นโยบายความเป็นส่วนตัว",
      operator: "ดำเนินการโดย languagebank",
    },
    hi: {
      title: "Moyeo — दुनिया भर के लोगों से ग्रुप कॉल, भाषा अदला-बदली के वॉइस रूम",
      description: "दुनिया भर के लोगों के साथ ग्रुप कॉल में बात करें। आपकी बात तुरंत सबटाइटल बनती है, अनुवाद एक टैप पर। सिर्फ़ सुनना या सिर्फ़ चैट करना भी ठीक है।",
      headline: "कहीं से भी, अभी मिलकर बात करें",
      sub: "दूसरे देशों के लोगों के साथ ग्रुप कॉल। बोली सबटाइटल बनती है, और छूटी लाइन एक टैप में अनुवाद होती है।",
      features: [
        ["🎙 8 लोग तक साथ बोलें", "जुड़ने का अनुरोध करने के लिए खाली सीट दबाएँ; होस्ट ऊपर लाए तो बोलें।"],
        ["💬 आवाज़ सबटाइटल में", "हर लाइन बोलने वाले के नाम के साथ रहती है। छूट गया? अनुवाद में पढ़ें।"],
        ["👂 सिर्फ़ सुनें या सिर्फ़ लिखें", "बिना माइक आकर सुनें, या सिर्फ़ कमेंट से जुड़ें।"],
      ],
      cta: "अभी रूम देखें",
      app: "ऐप पाएँ",
      live: "अभी {rooms} रूम खुले · {people} लोग बात कर रहे",
      liveEmpty: "अभी कोई रूम खुला नहीं है। पहला रूम खोलें।",
      privacy: "गोपनीयता नीति",
      operator: "languagebank द्वारा संचालित",
    },
  },
};

/**
 * Pingo — 1:1 대화 창구(사용자 결정 2026-10-20 "랜덤채팅은 가+나 섞어서"). 1단계(나): 무작위 연결이 아니라
 * 지금 접속한 사람 중 언어가 맞는 사람을 프로필과 함께 보여 주고, 내가 골라 대화를 요청 → 상대가 수락하면 1:1.
 * 2단계(가, 본인인증한 성인끼리 "바로 연결")는 본인인증 계약 뒤(`hub/drafts/doors.md`).
 */
const RANDOM_CHAT: Door = {
  id: "random-chat",
  host: "talk",
  name: "Pingo",
  defaultLang: "ko",
  start: "people",
  tabs: ["people", "talk", "map"],
  theme: "pingo",
  live: "people",
  peopleFilter: "online",
  copy: {
    ko: {
      title: "Pingo 핑고 — 외국인과 1:1 채팅, 랜덤채팅 말고 언어가 맞는 사람과",
      description: "지금 접속한 외국인 중 내 언어를 배우는 사람을 골라 1:1로 대화해요. 무작위 연결이 아니라 프로필을 보고 고르고, 상대가 수락해야 시작돼요.",
      headline: "지금 접속한 외국인과, 1:1로",
      sub: "내 말을 배우는 사람과 상대 말을 배우는 내가 만나요. 프로필을 보고 골라 대화를 요청하면, 상대가 수락할 때 시작해요.",
      features: [
        ["🟢 지금 접속 중인 사람부터", "방금 앱을 쓴 사람이 맨 위에. 쓰는 말과 배우는 말이 바로 보여요."],
        ["🤝 서로 고르고 수락해야 시작", "아무나 연결되지 않아요. 요청을 받은 사람이 수락해야 대화가 열려요."],
        ["🛡 차단·신고 바로", "불편하면 프로필에서 바로 차단하고 신고할 수 있어요."],
      ],
      cta: "지금 접속한 사람 보기",
      app: "앱으로 받기",
      live: "지금 {people}명이 접속 중",
      liveEmpty: "지금 접속한 사람이 적어요. 먼저 들어와 기다려 보세요.",
      privacy: "개인정보 처리방침",
      operator: "languagebank가 운영해요",
    },
    en: {
      title: "Pingo — 1:1 chat with people abroad, matched by language, not at random",
      description: "Pick someone online now who is learning your language and chat one-to-one. Not random: you choose from profiles, and a chat starts only when they accept.",
      headline: "Chat one-to-one with someone online now",
      sub: "You meet people learning your language while you learn theirs. Pick a profile, send a request, and the chat starts when they accept.",
      features: [
        ["🟢 People online now come first", "Whoever just used the app is at the top, with the languages they speak and learn."],
        ["🤝 Both sides choose", "Nobody is connected at random. A chat opens only when the other person accepts."],
        ["🛡 Block and report right away", "If something feels off, block and report from their profile."],
      ],
      cta: "See who's online",
      app: "Get the app",
      live: "{people} people online now",
      liveEmpty: "Few people are online right now. Come in and wait a moment.",
      privacy: "Privacy policy",
      operator: "Run by languagebank",
    },
    es: {
      title: "Pingo — chat 1:1 con gente de otros países, por idioma y no al azar",
      description: "Elige a alguien conectado ahora que aprende tu idioma y chatea uno a uno. No es aleatorio: eliges por perfil y el chat empieza solo si acepta.",
      headline: "Chatea uno a uno con alguien conectado ahora",
      sub: "Conoces a gente que aprende tu idioma mientras tú aprendes el suyo. Elige un perfil, envía una solicitud y el chat empieza cuando acepta.",
      features: [
        ["🟢 Primero quien está conectado", "Arriba quien acaba de usar la app, con los idiomas que habla y aprende."],
        ["🤝 Eligen los dos", "Nadie se conecta al azar. El chat se abre solo cuando la otra persona acepta."],
        ["🛡 Bloquear y denunciar al instante", "Si algo no va bien, bloquea y denuncia desde su perfil."],
      ],
      cta: "Ver quién está conectado",
      app: "Descargar la app",
      live: "{people} personas conectadas ahora",
      liveEmpty: "Ahora hay poca gente conectada. Entra y espera un momento.",
      privacy: "Política de privacidad",
      operator: "Gestionado por languagebank",
    },
    ja: {
      title: "Pingo — 海外の人と1対1チャット、ランダムではなく言語で選ぶ",
      description: "いまオンラインの人の中から、自分の言語を学んでいる人を選んで1対1で話せます。ランダムではなくプロフィールを見て選び、相手が承認すると始まります。",
      headline: "いまオンラインの人と、1対1で",
      sub: "自分の言語を学ぶ人と、その人の言語を学ぶ自分が出会います。プロフィールを見てリクエストし、相手が承認したら会話スタート。",
      features: [
        ["🟢 いまオンラインの人から", "さっきアプリを使った人が一番上に。話す言語と学ぶ言語がすぐわかります。"],
        ["🤝 お互いに選んで承認", "勝手につながりません。リクエストを受けた人が承認すると会話が開きます。"],
        ["🛡 すぐブロック・通報", "嫌だと思ったら、プロフィールからすぐブロック・通報できます。"],
      ],
      cta: "オンラインの人を見る",
      app: "アプリを入手",
      live: "いま {people}人がオンライン",
      liveEmpty: "いまオンラインの人が少なめです。先に入って待ってみましょう。",
      privacy: "プライバシーポリシー",
      operator: "運営: languagebank",
    },
    zh: {
      title: "Pingo — 和外国人一对一聊天，按语言匹配而不是随机",
      description: "从现在在线的人里选一个在学你语言的人，一对一聊天。不是随机连接：看资料来选，对方接受后才开始。",
      headline: "和现在在线的人，一对一聊",
      sub: "你遇到在学你语言的人，你也在学他的语言。看资料发出请求，对方接受后就开始聊天。",
      features: [
        ["🟢 先看现在在线的人", "刚用过应用的人排在最上面，会说和在学的语言一目了然。"],
        ["🤝 双方都要选择", "不会随机连上任何人。对方接受后对话才会打开。"],
        ["🛡 随时拉黑、举报", "觉得不舒服，可以在资料页马上拉黑并举报。"],
      ],
      cta: "看看谁在线",
      app: "下载应用",
      live: "现在有 {people} 人在线",
      liveEmpty: "现在在线的人不多。先进来等一会儿吧。",
      privacy: "隐私政策",
      operator: "由 languagebank 运营",
    },
    vi: {
      title: "Pingo — chat 1:1 với người nước ngoài, ghép theo ngôn ngữ chứ không ngẫu nhiên",
      description: "Chọn một người đang online đang học ngôn ngữ của bạn và trò chuyện 1:1. Không ngẫu nhiên: bạn chọn theo hồ sơ, chỉ bắt đầu khi họ chấp nhận.",
      headline: "Trò chuyện 1:1 với người đang online",
      sub: "Bạn gặp người học ngôn ngữ của bạn, còn bạn học ngôn ngữ của họ. Chọn hồ sơ, gửi yêu cầu, và bắt đầu khi họ chấp nhận.",
      features: [
        ["🟢 Người đang online lên trước", "Ai vừa dùng ứng dụng ở trên cùng, kèm ngôn ngữ họ nói và đang học."],
        ["🤝 Cả hai cùng chọn", "Không ai bị nối ngẫu nhiên. Cuộc trò chuyện chỉ mở khi người kia chấp nhận."],
        ["🛡 Chặn và báo cáo ngay", "Thấy không thoải mái thì chặn và báo cáo ngay trong hồ sơ."],
      ],
      cta: "Xem ai đang online",
      app: "Tải ứng dụng",
      live: "{people} người đang online",
      liveEmpty: "Hiện ít người online. Vào trước và chờ một chút nhé.",
      privacy: "Chính sách quyền riêng tư",
      operator: "Vận hành bởi languagebank",
    },
    fr: {
      title: "Pingo — chat 1:1 avec des gens d’autres pays, par langue et non au hasard",
      description: "Choisissez une personne en ligne qui apprend votre langue et discutez en tête-à-tête. Pas de hasard : vous choisissez par profil, et la discussion commence seulement si elle accepte.",
      headline: "Discutez en tête-à-tête avec quelqu’un en ligne",
      sub: "Vous rencontrez des gens qui apprennent votre langue pendant que vous apprenez la leur. Choisissez un profil, envoyez une demande : ça commence quand la personne accepte.",
      features: [
        ["🟢 Les personnes en ligne d’abord", "Celles qui viennent d’utiliser l’app sont en haut, avec les langues parlées et apprises."],
        ["🤝 Les deux choisissent", "Personne n’est connecté au hasard. La discussion s’ouvre seulement si l’autre accepte."],
        ["🛡 Bloquer et signaler tout de suite", "Si quelque chose ne va pas, bloquez et signalez depuis son profil."],
      ],
      cta: "Voir qui est en ligne",
      app: "Télécharger l’app",
      live: "{people} personnes en ligne",
      liveEmpty: "Peu de monde en ligne pour l’instant. Entrez et patientez un peu.",
      privacy: "Politique de confidentialité",
      operator: "Géré par languagebank",
    },
    it: {
      title: "Pingo — chat 1:1 con persone di altri paesi, per lingua e non a caso",
      description: "Scegli qualcuno online che impara la tua lingua e chatta a tu per tu. Non è casuale: scegli dal profilo e la chat inizia solo se accetta.",
      headline: "Chatta a tu per tu con qualcuno online ora",
      sub: "Incontri chi impara la tua lingua mentre tu impari la sua. Scegli un profilo, invia una richiesta e si comincia quando accetta.",
      features: [
        ["🟢 Prima chi è online", "In cima chi ha appena usato l’app, con le lingue che parla e impara."],
        ["🤝 Scelgono entrambi", "Nessuno viene collegato a caso. La chat si apre solo quando l’altra persona accetta."],
        ["🛡 Blocca e segnala subito", "Se qualcosa non va, blocca e segnala dal suo profilo."],
      ],
      cta: "Guarda chi è online",
      app: "Scarica l’app",
      live: "{people} persone online ora",
      liveEmpty: "Ora ci sono poche persone online. Entra e aspetta un attimo.",
      privacy: "Informativa sulla privacy",
      operator: "Gestito da languagebank",
    },
    pt: {
      title: "Pingo — chat 1:1 com pessoas de outros países, por idioma e não aleatório",
      description: "Escolha alguém online que aprende o seu idioma e converse a dois. Não é aleatório: você escolhe pelo perfil e a conversa só começa se a pessoa aceitar.",
      headline: "Converse a dois com alguém online agora",
      sub: "Você conhece quem aprende o seu idioma enquanto aprende o dela. Escolha um perfil, envie um pedido e a conversa começa quando a pessoa aceita.",
      features: [
        ["🟢 Quem está online vem primeiro", "No topo, quem acabou de usar o app, com os idiomas que fala e aprende."],
        ["🤝 Os dois escolhem", "Ninguém é conectado ao acaso. A conversa só abre quando a outra pessoa aceita."],
        ["🛡 Bloquear e denunciar na hora", "Se algo incomodar, bloqueie e denuncie pelo perfil."],
      ],
      cta: "Ver quem está online",
      app: "Baixar o app",
      live: "{people} pessoas online agora",
      liveEmpty: "Pouca gente online agora. Entre e espere um pouco.",
      privacy: "Política de privacidade",
      operator: "Mantido por languagebank",
    },
    ru: {
      title: "Pingo — чат 1:1 с людьми из других стран, по языку, а не наугад",
      description: "Выберите человека онлайн, который учит ваш язык, и общайтесь один на один. Не наугад: вы выбираете по профилю, а чат начинается, только если человек согласится.",
      headline: "Общайтесь один на один с теми, кто онлайн",
      sub: "Вы встречаете тех, кто учит ваш язык, пока вы учите их. Выберите профиль, отправьте запрос — разговор начнётся, когда человек примет.",
      features: [
        ["🟢 Сначала те, кто онлайн", "Наверху те, кто только что заходил, с языками, которые они знают и учат."],
        ["🤝 Выбирают оба", "Никого не соединяют наугад. Чат откроется, только когда собеседник примет запрос."],
        ["🛡 Блок и жалоба сразу", "Если что-то не так, заблокируйте и пожалуйтесь из профиля."],
      ],
      cta: "Посмотреть, кто онлайн",
      app: "Скачать приложение",
      live: "Сейчас онлайн: {people}",
      liveEmpty: "Сейчас онлайн мало людей. Заходите и немного подождите.",
      privacy: "Политика конфиденциальности",
      operator: "Работает на languagebank",
    },
    id: {
      title: "Pingo — chat 1:1 dengan orang luar negeri, dicocokkan lewat bahasa, bukan acak",
      description: "Pilih orang yang sedang online dan belajar bahasamu, lalu ngobrol berdua. Bukan acak: kamu memilih dari profil, dan obrolan baru mulai kalau dia menerima.",
      headline: "Ngobrol berdua dengan yang sedang online",
      sub: "Kamu bertemu orang yang belajar bahasamu, sementara kamu belajar bahasanya. Pilih profil, kirim permintaan, dan mulai saat dia menerima.",
      features: [
        ["🟢 Yang online duluan", "Yang baru memakai aplikasi ada di atas, lengkap dengan bahasa yang dipakai dan dipelajari."],
        ["🤝 Sama-sama memilih", "Tidak ada yang tersambung acak. Obrolan terbuka hanya kalau orang itu menerima."],
        ["🛡 Blokir dan laporkan langsung", "Kalau tidak nyaman, blokir dan laporkan dari profilnya."],
      ],
      cta: "Lihat yang online",
      app: "Unduh aplikasi",
      live: "{people} orang online sekarang",
      liveEmpty: "Sedang sedikit yang online. Masuk dulu dan tunggu sebentar.",
      privacy: "Kebijakan privasi",
      operator: "Dikelola oleh languagebank",
    },
    ar: {
      title: "Pingo — دردشة فردية مع أشخاص من بلدان أخرى، حسب اللغة لا عشوائيًا",
      description: "اختر شخصًا متصلًا الآن يتعلّم لغتك وتحدث معه على انفراد. ليست عشوائية: تختار من الملف الشخصي، ولا تبدأ الدردشة إلا إذا قبل.",
      headline: "تحدث على انفراد مع شخص متصل الآن",
      sub: "تلتقي بمن يتعلّم لغتك بينما تتعلّم لغته. اختر ملفًا وأرسل طلبًا، وتبدأ الدردشة عندما يقبل.",
      features: [
        ["🟢 المتصلون الآن أولًا", "في الأعلى من استخدم التطبيق للتو، مع اللغات التي يتحدثها ويتعلّمها."],
        ["🤝 الطرفان يختاران", "لا أحد يُوصل عشوائيًا. تُفتح الدردشة فقط عندما يقبل الطرف الآخر."],
        ["🛡 حظر وإبلاغ فورًا", "إن شعرت بعدم الارتياح، احظر وأبلغ من ملفه الشخصي."],
      ],
      cta: "شاهد من المتصل",
      app: "حمّل التطبيق",
      live: "{people} متصلون الآن",
      liveEmpty: "عدد المتصلين قليل الآن. ادخل وانتظر قليلًا.",
      privacy: "سياسة الخصوصية",
      operator: "تديره languagebank",
    },
    th: {
      title: "Pingo — แชท 1:1 กับคนต่างชาติ จับคู่ตามภาษา ไม่ใช่สุ่ม",
      description: "เลือกคนที่ออนไลน์อยู่และกำลังเรียนภาษาของคุณ แล้วคุยกันแบบตัวต่อตัว ไม่ใช่การสุ่ม: เลือกจากโปรไฟล์ และจะเริ่มเมื่ออีกฝ่ายตอบรับ",
      headline: "คุยตัวต่อตัวกับคนที่ออนไลน์อยู่ตอนนี้",
      sub: "คุณได้เจอคนที่เรียนภาษาของคุณ ขณะที่คุณเรียนภาษาของเขา เลือกโปรไฟล์ ส่งคำขอ แล้วเริ่มคุยเมื่ออีกฝ่ายตอบรับ",
      features: [
        ["🟢 คนที่ออนไลน์ขึ้นก่อน", "คนที่เพิ่งใช้แอปอยู่บนสุด พร้อมภาษาที่พูดและภาษาที่เรียน"],
        ["🤝 ต่างฝ่ายต่างเลือก", "ไม่มีการเชื่อมต่อแบบสุ่ม แชทจะเปิดเมื่ออีกฝ่ายตอบรับเท่านั้น"],
        ["🛡 บล็อกและรายงานได้ทันที", "ถ้ารู้สึกไม่สบายใจ บล็อกและรายงานจากโปรไฟล์ได้เลย"],
      ],
      cta: "ดูว่าใครออนไลน์",
      app: "ดาวน์โหลดแอป",
      live: "ออนไลน์อยู่ {people} คน",
      liveEmpty: "ตอนนี้คนออนไลน์น้อย เข้ามารอสักครู่ได้เลย",
      privacy: "นโยบายความเป็นส่วนตัว",
      operator: "ดำเนินการโดย languagebank",
    },
    hi: {
      title: "Pingo — दूसरे देशों के लोगों से 1:1 चैट, भाषा से मिलान, रैंडम नहीं",
      description: "अभी ऑनलाइन किसी ऐसे व्यक्ति को चुनें जो आपकी भाषा सीख रहा हो, और आमने-सामने चैट करें। रैंडम नहीं: आप प्रोफ़ाइल देखकर चुनते हैं, और चैट तभी शुरू होती है जब वह स्वीकार करे।",
      headline: "अभी ऑनलाइन किसी से आमने-सामने बात करें",
      sub: "आप उनसे मिलते हैं जो आपकी भाषा सीख रहे हैं, और आप उनकी। प्रोफ़ाइल चुनें, अनुरोध भेजें, और स्वीकार होते ही बात शुरू।",
      features: [
        ["🟢 पहले ऑनलाइन लोग", "जिन्होंने अभी ऐप इस्तेमाल किया वे सबसे ऊपर, बोली और सीखी जा रही भाषाओं के साथ।"],
        ["🤝 दोनों चुनते हैं", "कोई रैंडम नहीं जुड़ता। चैट तभी खुलती है जब सामने वाला स्वीकार करे।"],
        ["🛡 तुरंत ब्लॉक और रिपोर्ट", "कुछ ठीक न लगे तो प्रोफ़ाइल से तुरंत ब्लॉक और रिपोर्ट करें।"],
      ],
      cta: "देखें कौन ऑनलाइन है",
      app: "ऐप पाएँ",
      live: "अभी {people} लोग ऑनलाइन",
      liveEmpty: "अभी कम लोग ऑनलाइन हैं। आइए और थोड़ा इंतज़ार करें।",
      privacy: "गोपनीयता नीति",
      operator: "languagebank द्वारा संचालित",
    },
  },
};

export const DOORS: Door[] = [GROUP_CALL, RANDOM_CHAT];

export function doorById(id: string | null | undefined): Door | null {
  return DOORS.find((door) => door.id === id) ?? null;
}

export function isDoorLang(value: string | null | undefined): value is DoorLang {
  return (DOOR_LANGS as readonly string[]).includes(value ?? "");
}

export const DOOR_BASE_DOMAIN = "languagebank.net";

/** 이 창구의 대표 주소(언어가 기본이면 `/`, 아니면 `/<언어>`). */
export function doorUrl(door: Door, lang: DoorLang): string {
  return `https://${door.host}.${DOOR_BASE_DOMAIN}${lang === door.defaultLang ? "/" : `/${lang}`}`;
}

/** 이 주소가 어느 창구인지(하위 도메인 → 창구). */
export function doorForHost(hostname: string): Door | null {
  const host = hostname.toLowerCase();
  return DOORS.find((door) => host === `${door.host}.${DOOR_BASE_DOMAIN}`) ?? null;
}

/**
 * 앱 쪽: 지금 창구 모드인지. 창구 주소(call.languagebank.net 등)로 열었거나, 확인용으로 `?door=<id>`를 붙였을 때.
 * 기기에 저장하지 않는다 — www로 다시 열면 원래 앱 그대로.
 */
export function readEntryDoor(): Door | null {
  if (typeof window === "undefined") return null;
  try {
    return doorForHost(window.location.hostname) ?? doorById(new URLSearchParams(window.location.search).get("door"));
  } catch {
    return null;
  }
}
