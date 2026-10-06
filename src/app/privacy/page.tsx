import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | languagebank",
  description: "Privacy Policy for the languagebank language learning app.",
};

/**
 * The policy, in English and in Korean.
 *
 * Written against what the app actually does as of the date below, and worth
 * re-reading whenever that changes: the previous version described the realtime
 * call ("streamed… not recorded") for weeks after the call tab stopped being
 * one, and said nothing about the lines the character writes being kept. Each
 * claim here names a behaviour in the code — if the code moves, this moves.
 *
 * The section "Conversation content we keep" is what allows learner speech to
 * be kept as text. Nothing writes it yet (entitlementStore.ts keeps only the
 * character's lines); this is the notice that has to exist before anything does.
 */

const LAST_UPDATED_EN = "October 6, 2026";
const LAST_UPDATED_KO = "2026년 10월 6일";

type Section = { title: string; body: string[] };

const en: Section[] = [
  {
    title: "Introduction",
    body: [
      "languagebank (“we,” “us,” or “our”) helps people learn languages through chat practice with corrections, spoken practice calls with an AI character, and learning from videos.",
      "This Privacy Policy explains what information we process when you use languagebank on Google Play or the web, why, how long we keep it, and the choices you have.",
      "languagebank does not ask you to create an account, and does not ask for your name, email address or phone number to use its features.",
    ],
  },
  {
    title: "Information We Process",
    body: [
      "• Chat messages and photos you send in the chat tab, so the app can reply, correct your sentences and explain them.",
      "• Practice calls. When you start a call and allow microphone access, the app records each of your turns as a short audio clip on your device and sends it to our server, which has it transcribed into text. The transcript, together with the recent conversation, is used to write the character's reply, which is then turned into speech. We do not store the audio clips: each one is discarded once it has been transcribed. The microphone is used only while a call is open.",
      "• Video learning. Links or video IDs you open, and the video's captions or audio, so the app can prepare subtitles, translations and explanations. Video audio may be transcribed on your device or by our AI provider.",
      "• Searches you make when looking for videos or channels, which are sent to search providers to return results.",
      "• Sentences or words you ask to have analysed, translated or looked up.",
      "• Reports you send about AI-generated content, including any note you add.",
      "• An anonymous app identifier, created by our billing provider for your installation, and usage counts tied to it — for example how many chat messages you sent today, how many points or call minutes you have used, and which app version you are on. These are used for free limits, points and premium access.",
      "• Purchase and subscription status, handled through Google Play Billing and RevenueCat. We never receive your full payment card details.",
      "• Basic technical information needed to run the service securely, such as IP address, device and platform type, and request times, recorded in server logs.",
    ],
  },
  {
    title: "Conversation Content We Keep",
    body: [
      "To improve the quality of corrections, conversations, translations and voice, we may keep text records of conversations:",
      "• What the AI character or assistant said.",
      "• What you said or typed — as text only. For calls this is the transcript of your speech, never the audio recording.",
      "• Information about the conversation that helps us understand it, such as the language, the line you were answering, how long you took to answer, how many tries a step took, and when it happened.",
      "These records are linked only to the anonymous app identifier, not to your name or contact details. We use them to measure and improve how the app teaches — for example, to find corrections that were wrong, replies that did not fit what you said, or sentences worth adding to the app's prepared lines. They may be reviewed by us, and may be processed by our AI provider for this purpose.",
      "Please avoid sharing sensitive personal information (such as contact details, ID numbers, health or financial information) in chats and calls.",
      "We keep these records for up to 12 months, after which they are deleted. You can ask us to delete them or to stop keeping them at any time (see “Your Choices and Rights”).",
    ],
  },
  {
    title: "Information Stored on Your Device",
    body: [
      "Some information is kept only on your device and is not sent to us for storage: your chat history, saved call conversations (up to 20), saved videos and study sessions, your vocabulary, and your language and app settings.",
      "You can remove it by deleting conversations in the app, clearing the app's data, or uninstalling the app.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "• To provide chat, corrections, practice calls, translations, video learning and other features.",
      "• To apply free limits, count points and call time, and unlock premium features.",
      "• To keep the service secure, prevent abuse and fix problems.",
      "• To measure and improve the quality of the app, as described in “Conversation Content We Keep”.",
      "• To respond to your requests.",
      "We do not sell personal information, and we do not use your information for advertising.",
    ],
  },
  {
    title: "AI and Other Service Providers",
    body: [
      "We use the following providers to run languagebank. They process information only to provide their service to us:",
      "• OpenAI (United States) — generating replies, corrections and explanations; transcribing speech; generating speech; translation.",
      "• Vercel (United States) — hosting the app's web pages and server, including server logs.",
      "• Upstash (via Vercel) — storing usage counts, points and the conversation records described above.",
      "• RevenueCat (United States) — subscription and purchase status.",
      "• Google — Google Play Billing for purchases; YouTube and Google APIs for playing videos, reading captions and searching videos and channels.",
      "• Brave Search — web search when finding learning content.",
      "Under its API terms, OpenAI does not use data sent through its API to train its models by default, and may keep it for a limited period to monitor for abuse.",
    ],
  },
  {
    title: "How Long We Keep Information",
    body: [
      "• Audio from practice calls: not stored; discarded after transcription.",
      "• Chat messages, photos and other content sent for processing: not stored after the reply is produced, except as described in “Conversation Content We Keep”.",
      "• Conversation records described in “Conversation Content We Keep”: up to 12 months.",
      "• Daily and monthly usage counts: up to about 70 days. Free trial usage and purchased points: for as long as they are needed to provide what you were given or bought.",
      "• Server logs: for a limited period set by our hosting provider.",
      "• Information on your device: until you delete it.",
    ],
  },
  {
    title: "Your Choices and Rights",
    body: [
      "You can ask us to access, correct or delete information about you, or to stop keeping conversation records, by emailing us. Because languagebank has no accounts, we may ask for details that help us find your records, such as a purchase receipt or when you used the app.",
      "You can stop using the microphone at any time by ending the call or turning off microphone permission in your device settings.",
      "Depending on where you live, you may have further rights under local law, including the right to object to processing and to complain to a data protection authority.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "Data between the app and our servers is sent over HTTPS. We limit access to stored information and keep it only as long as described above.",
      "No method of transmission or storage is completely secure, but we work to protect your information against unauthorized access.",
    ],
  },
  {
    title: "Children",
    body: [
      "languagebank is not directed to children under 14. We do not knowingly collect personal information from children under 14. If you believe a child has used the app, contact us and we will delete their information.",
    ],
  },
  {
    title: "Changes to this Policy",
    body: [
      "We may update this policy when the app changes. We will update the date at the top of this page, and tell you in the app when a change is significant.",
    ],
  },
  {
    title: "Contact",
    body: ["For privacy questions or requests: a20031314@gmail.com"],
  },
];

const ko: Section[] = [
  {
    title: "개요",
    body: [
      "languagebank(이하 “서비스”)는 교정이 포함된 채팅 연습, AI 캐릭터와의 말하기 통화 연습, 영상 학습을 통해 언어 학습을 돕는 앱입니다.",
      "이 개인정보처리방침은 Google Play 및 웹에서 서비스를 이용할 때 어떤 정보를 왜 처리하고, 얼마나 보관하며, 이용자가 어떤 선택을 할 수 있는지 설명합니다.",
      "서비스는 회원가입을 요구하지 않으며, 기능 이용을 위해 이름·이메일·전화번호를 받지 않습니다.",
    ],
  },
  {
    title: "처리하는 정보",
    body: [
      "• 채팅 탭에서 보내는 메시지와 사진: 답변, 문장 교정, 설명을 제공하기 위해 처리합니다.",
      "• 말하기 통화: 통화를 시작하고 마이크 권한을 허용하면, 앱이 이용자의 발화를 턴마다 짧은 음성으로 기기에서 녹음해 서버로 보내고, 서버가 이를 글자로 변환합니다. 변환된 글자와 최근 대화는 캐릭터의 답변을 만드는 데 쓰이고, 답변은 음성으로 합성됩니다. 녹음된 음성은 저장하지 않으며 글자 변환 후 즉시 폐기합니다. 마이크는 통화가 열려 있는 동안에만 사용됩니다.",
      "• 영상 학습: 이용자가 연 영상 링크나 영상 ID, 영상의 자막 또는 음성. 자막·번역·설명을 만들기 위해 처리하며, 영상 음성은 기기에서 또는 AI 제공자를 통해 글자로 변환될 수 있습니다.",
      "• 영상이나 채널을 찾을 때 입력한 검색어: 결과를 받기 위해 검색 제공자에게 전송됩니다.",
      "• 분석·번역·뜻 찾기를 요청한 문장이나 단어.",
      "• AI 생성 내용에 대한 신고와, 신고 시 함께 적은 메모.",
      "• 익명 앱 식별자(결제 제공자가 설치마다 만드는 식별값)와 이에 연결된 이용 횟수: 예를 들어 오늘 보낸 채팅 수, 사용한 포인트와 통화 시간, 앱 버전. 무료 이용 한도, 포인트, 프리미엄 이용에 사용합니다.",
      "• 구독·구매 상태: Google Play 결제와 RevenueCat을 통해 처리되며, 카드 번호 등 결제 정보 전체는 받지 않습니다.",
      "• 서비스를 안전하게 운영하는 데 필요한 기본 기술 정보: IP 주소, 기기·플랫폼 종류, 요청 시각 등이 서버 로그에 기록됩니다.",
    ],
  },
  {
    title: "보관하는 대화 내용",
    body: [
      "교정·대화·번역·음성의 품질을 개선하기 위해 대화를 글자 형태로 보관할 수 있습니다.",
      "• AI 캐릭터 또는 도우미가 한 말",
      "• 이용자가 말하거나 입력한 내용(글자만 보관합니다. 통화의 경우 음성을 변환한 글자이며, 녹음 음성은 보관하지 않습니다)",
      "• 대화를 이해하는 데 필요한 정보: 언어, 이용자가 답한 대사, 답하기까지 걸린 시간, 한 단계에서 시도한 횟수, 일시 등",
      "이 기록은 익명 앱 식별자에만 연결되며 이름이나 연락처와 연결되지 않습니다. 잘못된 교정, 이용자의 말과 맞지 않는 답변을 찾거나, 앱에 미리 준비해 둘 문장을 고르는 등 서비스가 가르치는 방식을 측정하고 개선하는 데 사용합니다. 이 목적을 위해 운영자가 열람하거나 AI 제공자가 처리할 수 있습니다.",
      "채팅과 통화에서 연락처, 주민등록번호 등 식별번호, 건강·금융 정보 같은 민감한 개인정보는 말하지 않도록 주의해 주세요.",
      "이 기록은 최대 12개월간 보관한 뒤 삭제합니다. 언제든지 삭제나 보관 중단을 요청할 수 있습니다(“이용자의 선택과 권리” 참고).",
    ],
  },
  {
    title: "기기에만 저장되는 정보",
    body: [
      "채팅 기록, 저장된 통화 대화(최대 20개), 저장한 영상과 학습 기록, 단어장, 언어·앱 설정은 이용자의 기기에만 저장되며 서버에 보관하지 않습니다.",
      "앱에서 대화를 삭제하거나, 앱 데이터를 지우거나, 앱을 삭제하면 지워집니다.",
    ],
  },
  {
    title: "이용 목적",
    body: [
      "• 채팅, 교정, 말하기 통화, 번역, 영상 학습 등 기능 제공",
      "• 무료 이용 한도 적용, 포인트와 통화 시간 계산, 프리미엄 기능 제공",
      "• 서비스 보안 유지, 부정 이용 방지, 오류 수정",
      "• “보관하는 대화 내용”에 적은 서비스 품질 측정과 개선",
      "• 이용자 문의 대응",
      "개인정보를 판매하지 않으며, 광고에 사용하지 않습니다.",
    ],
  },
  {
    title: "처리 위탁 및 국외 이전",
    body: [
      "서비스 운영을 위해 아래 업체에 정보 처리를 맡기며, 이 과정에서 정보가 국외로 이전됩니다. 이전은 이용자가 해당 기능을 사용할 때 네트워크를 통해 이루어집니다.",
      "• OpenAI (미국): 채팅·통화·영상 내용, 통화 음성(글자 변환용), 분석 요청 문장 / 답변·교정·설명 생성, 음성 인식, 음성 합성, 번역 / 처리 후 OpenAI 정책에 따라 남용 감시를 위해 제한된 기간 보관",
      "• Vercel (미국): 요청 내용과 서버 로그 / 앱 웹페이지와 서버 호스팅 / 호스팅 제공자가 정한 기간",
      "• Upstash (Vercel을 통해 이용): 익명 앱 식별자, 이용 횟수, 포인트, “보관하는 대화 내용”의 기록 / 데이터 저장 / 이 방침의 보관 기간",
      "• RevenueCat (미국): 익명 앱 식별자, 구독·구매 상태 / 결제 상태 확인 / 구독 관리에 필요한 기간",
      "• Google (미국): 구매 정보, 영상 ID, 검색어 / Google Play 결제, YouTube 영상 재생·자막·검색 / 각 서비스 정책에 따름",
      "• Brave Search (미국): 검색어 / 학습 콘텐츠 검색 / 각 서비스 정책에 따름",
      "OpenAI는 API 약관에 따라 API로 전송된 데이터를 기본적으로 모델 학습에 사용하지 않습니다.",
      "국외 이전을 원하지 않으면 해당 기능을 사용하지 않거나 서비스 이용을 중단할 수 있습니다. 다만 이 경우 채팅·통화·영상 학습 등 핵심 기능을 이용할 수 없습니다.",
    ],
  },
  {
    title: "보관 기간",
    body: [
      "• 통화 녹음 음성: 저장하지 않으며 글자 변환 후 폐기",
      "• 처리를 위해 보낸 채팅 메시지·사진 등: 답변을 만든 뒤 보관하지 않음(단, “보관하는 대화 내용”에 해당하는 기록은 제외)",
      "• “보관하는 대화 내용”의 기록: 최대 12개월",
      "• 일별·월별 이용 횟수: 약 70일 이내. 무료 체험 사용량과 구매한 포인트: 제공하거나 구매한 내용을 이행하는 데 필요한 기간",
      "• 서버 로그: 호스팅 제공자가 정한 제한된 기간",
      "• 기기에 저장된 정보: 이용자가 삭제할 때까지",
    ],
  },
  {
    title: "이용자의 선택과 권리",
    body: [
      "이메일로 자신의 정보에 대한 열람, 정정, 삭제, 처리 정지(대화 기록 보관 중단 포함)를 요청할 수 있습니다. 서비스에 계정이 없으므로, 기록을 찾기 위해 구매 영수증이나 이용 시점 같은 정보를 요청할 수 있습니다.",
      "통화를 끝내거나 기기 설정에서 마이크 권한을 끄면 언제든지 마이크 사용을 멈출 수 있습니다.",
      "개인정보 침해에 관한 상담이나 신고는 개인정보침해신고센터(privacy.kisa.or.kr, 국번없이 118) 등에 할 수 있습니다.",
    ],
  },
  {
    title: "안전성 확보 조치",
    body: [
      "앱과 서버 사이의 데이터는 HTTPS로 암호화해 전송합니다. 보관하는 정보에 대한 접근을 제한하고, 위에 적은 기간 동안만 보관합니다.",
    ],
  },
  {
    title: "아동",
    body: [
      "서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만 아동의 개인정보를 알면서 수집하지 않습니다. 아동이 서비스를 이용한 사실을 알게 되면 연락해 주세요. 해당 정보를 삭제하겠습니다.",
    ],
  },
  {
    title: "방침의 변경",
    body: [
      "앱이 바뀌면 이 방침을 고칠 수 있습니다. 이 페이지 상단의 날짜를 갱신하고, 중요한 변경은 앱 안에서 알립니다.",
    ],
  },
  {
    title: "개인정보 보호책임자 및 문의",
    body: ["개인정보 관련 문의·요청: a20031314@gmail.com"],
  },
];

function Policy({ id, lang, heading, updated, sections }: {
  id: string;
  lang: string;
  heading: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <section id={id} lang={lang} className="scroll-mt-6">
      <header className="mb-8 border-b border-white/10 pb-6">
        <p className="text-sm font-medium text-slate-500">languagebank</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
        <p className="mt-3 text-sm text-slate-300">{updated}</p>
      </header>
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white/5 text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-8 flex gap-4 text-sm text-slate-300">
          <a href="#en" className="underline underline-offset-2 hover:text-slate-100">English</a>
          <a href="#ko" className="underline underline-offset-2 hover:text-slate-100">한국어</a>
        </nav>

        <Policy id="en" lang="en" heading="Privacy Policy" updated={`Last updated: ${LAST_UPDATED_EN}`} sections={en} />

        <div className="my-14 border-t border-white/10" />

        <Policy id="ko" lang="ko" heading="개인정보처리방침" updated={`최종 수정일: ${LAST_UPDATED_KO}`} sections={ko} />

        <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300">
          <p className="font-medium text-slate-100">Developer: languagebank</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:a20031314@gmail.com"
              className="text-slate-100 underline underline-offset-2 hover:text-slate-200"
            >
              a20031314@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
