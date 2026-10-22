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
 * The section "Conversation Content We Keep" is what allows learner speech to
 * be kept. Two retentions, because they are two kinds of thing: the words
 * themselves for twelve months, and measurements about a turn that carry no
 * words (learnerMetrics.ts) for fourteen, so a month can be compared with the
 * same month a year before. The words are written only when
 * LEARNER_TEXT_STORE is on, and it is off.
 */

const LAST_UPDATED_EN = "October 23, 2026";
const LAST_UPDATED_KO = "2026년 10월 23일";

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
      "• Sentences or words you ask to have analysed, translated or looked up, and questions you type about them.",
      "• Study maps. The goal you write and the level you choose are sent to our AI provider to draw a study map; the map, the goal and which topics you mark as started or done are kept on our server, linked to the anonymous app identifier, so the map is there when you come back.",
      "• Reports you send about AI-generated content, including any note you add.",
      "• An anonymous app identifier, created by our billing provider for your installation, and usage counts tied to it — for example how many chat messages you sent today, how many points or call minutes you have used, and which app version you are on. These are used for free limits, points and premium access.",
      "• An account, only if you choose to sign in (signing in is optional). With a username and password, we keep the username and a one-way hash of the password, never the password itself. With Google sign-in we receive your Google account ID, email address and name from Google; with email sign-in, your email address, to which we send a one-time code. You may add a nickname, a profile photo and a short self-introduction. Once you sign in, the records above that were linked to this installation's anonymous app identifier are linked to your account instead, so they follow you to another device.",
      "• Messages between members (test feature, signed-in users only): when you send a message to another member, its text, the time and who sent it are kept on our servers so the other person can read it, together with a short record of calls between you (the words each of you said, as captions). They are kept for 30 days after the last message in that conversation and then deleted. Deleting a conversation from your list hides it only for you (the other person keeps theirs); the server copy is deleted on the same schedule. Deleting a message you sent (including a photo or a call record) removes it for everyone and deletes it from the server at once. Group chats (up to 20 members who joined by invitation) work the same way: the members' messages, who is in the group and who was invited are kept for 30 days after the last message. If either of you blocks the other, no new messages can be sent and neither can invite the other to a group. A group can be made a team, and two members can become study mates (a team of two). For a team, its messages, members, the phrases members asked about in it, the captions of its calls and what members share in its workspace, together with the days the team was active, are kept while the team exists — up to one year after its last activity — instead of 30 days. When you leave a team, or are removed, what you added to its workspace (including your lines in its call records) is deleted. A signed-in member's nickname, photo, self-introduction, when they last used the app, and their app and learning languages are shown to other members in the “People” list (last 2 weeks) so they can find partners; you can hide yourself in the profile editor. The last-used time and languages are kept for 60 days. If you share an invite link, anyone who opens it sees your nickname, photo, self-introduction and languages; we keep your invite code and, when someone joins through it, a record that you invited them (until your account is deleted). When the app is installed from an invite link, it reads the invite code from Google Play’s install referrer once, on first launch. Invite rewards: if someone who joined through your link signs in within 48 hours of creating their account and uses the app on two different days within seven days, both of you receive points (and inviters can unlock time-limited plans at 3 and 10 friends). To decide this we keep, for each invited account, who invited it, when, and the days it used the app; we keep the number of friends and points each inviter received. These are deleted with the account. Reports you make about a member (the reason and up to five of their recent lines) are kept for 90 days for review. Profile details and contribution: you can add to your profile your native language, other languages you speak, interests, what you do and how you like to talk (chosen from fixed lists); these are shown to other members with your profile and are kept until you change them or delete your account. If you allow it, your interests and what you do are also given to the AI tutor as conversation topics (you can turn this off). When someone thanks you for answering their question (only the person who asked can), and when feedback you sent is adopted, we keep counts and the times of the last 30 days; we keep the days you chatted or called with the tutor (last 60 days); and, to stop repeat thanks, whom you thanked and when. Counts of thanks, adopted feedback and study days are shown on your profile unless you hide them, and recent contribution can move your profile and new board posts higher in lists. Your mistakes, weak points, levels and sentences are never shown to other members. These are deleted with the account.",
      "• Board posts (signed-in members only): posts and comments you write on the board in the People tab, with the time and the language you were learning, are shown to other signed-in members and kept until you delete them. Only the writer can edit or delete a post or comment, and the writer of a post can also delete comments on it. When you delete your account, your posts and comments are deleted with it. Posts from members who blocked you, or whom you blocked, are not shown.",
      "• Photos in messages, group chats and board posts (signed-in members only): when you attach a photo, the app shrinks it on your device and sends it to our server. Before it is stored, it is checked automatically by OpenAI’s moderation model, and a photo that looks sexual, violent or hateful is refused and not kept. Stored photos are kept privately in our file storage (Vercel Blob) and are shown only through our server: photos in a 1:1 message or group chat only to the people in that conversation, board photos to other members. Photos in messages and group chats (including teams) are deleted 30 days after they were sent; a photo you picked but did not send is deleted after one day; board photos are deleted when you delete the post or comment. When you delete your account, every photo you uploaded is deleted. We count how many photos you upload each day (10 a day on the free plan, 50 on paid plans).",
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
      "• Information about the conversation that helps us understand it, without the words themselves: the language, which line you were answering, how long you took to answer, how long your sentence was, how confident speech recognition was, how many tries a step took, whether your sentence needed correcting, and when it happened.",
      "These records are linked only to the anonymous app identifier, not to your name or contact details. We use them to measure and improve how the app teaches — for example, to find corrections that were wrong, replies that did not fit what you said, or sentences worth adding to the app's prepared lines. They may be reviewed by us, and may be processed by our AI provider for this purpose.",
      "Please avoid sharing sensitive personal information (such as contact details, ID numbers, health or financial information) in chats and calls.",
      "We keep the text of what was said for up to 12 months. We keep the information about the conversation that does not contain your words for up to 14 months, so that the same season can be compared from one year to the next. After that, both are deleted. You can ask us to delete them or to stop keeping them at any time (see “Your Choices and Rights”).",
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
      "We do not sell personal information. If you use the Android app without a subscription, it shows ads through Google AdMob (see “Advertising” below). On the website, people without a subscription may see ads between list items through Google AdSense. Subscribers see no ads. We do not use your conversations, your learning records or your account details for advertising.",
    ],
  },
  {
    title: "AI and Other Service Providers",
    body: [
      "We use the following providers to run languagebank. They process information only to provide their service to us:",
      "• OpenAI (United States) — generating replies, corrections and explanations; transcribing speech; generating speech; translation.",
      "• Vercel (United States) — hosting the app's web pages and server, including server logs.",
      "• Upstash (via Vercel) — storing usage counts, points and the conversation records described above.",
      "• RevenueCat (United States) — subscription and purchase status (and your account ID, if you sign in, so a subscription follows your account).",
      "• Resend (United States) — sending the one-time sign-in code to your email address.",
      "• Google — Google Play Billing for purchases; YouTube and Google APIs for playing videos, reading captions and searching videos and channels.",
      "• Brave Search — web search when finding learning content.",
      "• Google AdMob (United States) — showing ads in the Android app to people without a subscription (see “Advertising”).",
      "• Google AdSense (United States) — showing ads on the website to people without a subscription (see “Advertising”).",
      "Under its API terms, OpenAI does not use data sent through its API to train its models by default, and may keep it for a limited period to monitor for abuse.",
    ],
  },
  {
    title: "Advertising",
    body: [
      "The Android app shows ads to people without a subscription: a full-screen ad at the natural end of an activity (for example when a call or a mission ends) or when you open the app, a banner at the bottom of some screens, an ad shaped like a card between items in some lists, and an optional ad you can choose to watch for more chats. Subscribers see no ads, and the iOS app and the web show none.",
      "Ads are provided by Google AdMob. To show and measure ads, the Google Mobile Ads SDK on your device may collect your device's advertising ID, IP address, device and app information, and how you interact with ads, under Google's policies (https://policies.google.com/technologies/ads). We do not send AdMob your conversations, learning records, email or account details.",
      "When you watch an ad for more chats, AdMob tells our server that the ad was completed, together with a code our server issued for your app so the chats go to the right person. We keep only a count of those rewards per day.",
      "On the website, ads between list items are provided by Google AdSense. Google may use cookies and similar technologies, your IP address and browser information to show and measure ads, under Google's policies (https://policies.google.com/technologies/partner-sites). The website has no full-screen ads and no ads for more chats. We do not send AdSense your conversations, learning records, email or account details.",
      "Where the law requires consent (for example in the European Economic Area and the United Kingdom), the app asks before personalised ads are shown. You can reset or turn off your advertising ID in your device settings (Settings → Google → Ads, or Settings → Privacy → Ads).",
    ],
  },
  {
    title: "How Long We Keep Information",
    body: [
      "• Audio from practice calls: not stored; discarded after transcription.",
      "• Chat messages, photos and other content sent for processing: not stored after the reply is produced, except as described in “Conversation Content We Keep”.",
      "• Text of conversations described in “Conversation Content We Keep”: up to 12 months.",
      "• Study maps (goal, map and progress): while you use them, and deleted about 13 months after the map was last opened or changed. A new goal replaces the map; the one it replaced is kept once so it can be restored.",
      "• Information about conversations that does not contain your words (such as response time, length and recognition confidence): up to 14 months.",
      "• Daily and monthly usage counts: up to about 70 days. Free trial usage and purchased points: for as long as they are needed to provide what you were given or bought.",
      "• Server logs: for a limited period set by our hosting provider.",
      "• Account (username and password hash, email address, Google account ID, nickname, photo and self-introduction): until you delete the account. When you delete it in the app (Profile → Edit → Delete account), the account and profile are deleted at once and the learning records linked to it within 30 days.",
      "• Information on your device: until you delete it.",
    ],
  },
  {
    title: "Your Choices and Rights",
    body: [
      "You can ask us to access, correct or delete information about you, or to stop keeping conversation records, by emailing us. If you have not signed in, we may ask for details that help us find your records, such as a purchase receipt or when you used the app. If you have signed in, you can also delete your account and its records yourself in the app.",
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
      "• 분석·번역·뜻 찾기를 요청한 문장이나 단어, 그리고 그에 대해 입력한 질문.",
      "• 학습 지도: 이용자가 적은 학습 목표와 고른 수준은 학습 지도를 만들기 위해 AI 제공자에게 전송됩니다. 만들어진 지도, 목표, 시작하거나 완료로 표시한 주제는 다시 열었을 때 이어서 볼 수 있도록 익명 앱 식별자에 연결해 서버에 보관합니다.",
      "• AI 생성 내용에 대한 신고와, 신고 시 함께 적은 메모.",
      "• 익명 앱 식별자(결제 제공자가 설치마다 만드는 식별값)와 이에 연결된 이용 횟수: 예를 들어 오늘 보낸 채팅 수, 사용한 포인트와 통화 시간, 앱 버전. 무료 이용 한도, 포인트, 프리미엄 이용에 사용합니다.",
      "• 계정(로그인을 선택한 경우에만, 로그인은 선택 사항): 아이디·비밀번호 로그인은 아이디와 비밀번호를 되돌릴 수 없게 변환한 값(해시)만 보관하며 비밀번호 원문은 보관하지 않습니다. Google 로그인은 Google로부터 Google 계정 ID, 이메일 주소, 이름을 받고, 이메일 로그인은 일회용 코드를 보낼 이메일 주소를 받습니다. 이용자가 닉네임, 프로필 사진, 자기소개를 추가할 수 있습니다. 로그인하면 이 설치의 익명 앱 식별자에 연결돼 있던 위 기록이 계정에 연결되어 다른 기기에서도 이어집니다.",
      "• 회원 사이의 메시지(시험 기능, 로그인한 경우에만): 다른 회원에게 메시지를 보내면 상대가 읽을 수 있도록 메시지 글자·보낸 시각·보낸 사람을 서버에 보관하고, 두 사람 사이 통화의 짧은 기록(각자 말한 내용의 자막)도 함께 보관합니다. 그 대화의 마지막 메시지로부터 30일 동안 보관한 뒤 삭제합니다. 대화를 내 목록에서 지우면 나에게만 안 보이고(상대의 대화는 그대로), 서버의 기록은 위 기간에 따라 삭제됩니다. 보낸 메시지(사진·통화 기록 포함)를 지우면 그 줄은 모두에게서 사라지고 서버에서도 바로 삭제됩니다. 단체방(초대로 들어온 최대 20명)도 같아서, 참여한 사람들의 메시지·참여자·초대받은 사람을 마지막 메시지로부터 30일 보관합니다. 한쪽이 차단하면 새 메시지를 보낼 수 없고 서로 단체방에 초대할 수도 없습니다. 단체방은 팀으로 만들 수 있고, 두 회원은 러닝메이트(둘만의 팀)가 될 수 있습니다. 팀의 메시지·참여자, 팀에서 물어본 표현, 팀 통화의 자막, 워크스페이스에 공유한 것과 함께 활동한 날짜는 30일이 아니라 팀이 있는 동안(마지막 활동 뒤 최대 1년) 보관합니다. 팀에서 나가거나 내보내지면 내가 워크스페이스에 남긴 것(통화 기록 속 내 말 포함)은 삭제합니다. 로그인한 회원의 닉네임·사진·자기소개, 마지막으로 앱을 쓴 시각, 앱 언어와 학습 언어는 다른 회원이 친구를 찾을 수 있도록 “사람” 목록에 보이며(최근 2주), 프로필 편집에서 숨길 수 있습니다. 마지막 사용 시각과 언어는 60일 보관합니다. 초대 링크를 보내면 링크를 연 사람은 내 닉네임·사진·자기소개·언어를 볼 수 있고, 내 초대 코드와 그 링크로 들어온 사람을 내가 초대했다는 기록을 보관합니다(내 계정을 지울 때까지). 초대 링크로 앱을 설치하면 첫 실행 때 한 번 Google Play의 설치 경로에서 초대 코드를 읽습니다. 초대 보상: 내 링크로 들어온 사람이 가입 후 48시간 안에 로그인하고 7일 안에 서로 다른 이틀 앱을 쓰면 두 사람 모두 포인트를 받습니다(초대한 사람은 3명·10명에서 기간제 요금이 열림). 이를 위해 초대받은 계정마다 누가 언제 초대했는지와 앱을 쓴 날짜를, 초대한 사람마다 데려온 친구 수와 받은 포인트를 보관하며, 계정을 지우면 함께 삭제합니다. 회원을 신고하면 신고 이유와 그 회원의 최근 줄(최대 5개)을 검토를 위해 90일 보관합니다. 프로필 사실과 기여: 프로필에 모국어, 할 수 있는 언어, 관심사, 하는 일, 대화 방식(정해진 목록에서 고름)을 더할 수 있고, 이는 프로필과 함께 다른 회원에게 보이며 바꾸거나 계정을 지울 때까지 보관합니다. 허용하면 관심사와 하는 일을 AI 튜터에게 대화 소재로도 전달합니다(끌 수 있음). 내 답에 질문한 사람이 \"도움됐어요\"를 누르거나(질문한 사람만 누를 수 있음) 내가 보낸 의견이 반영되면 그 수와 최근 30일의 시각을, 튜터와 채팅·통화한 날짜(최근 60일)를, 같은 사람에게 거듭 누르지 못하게 누구에게 언제 눌렀는지를 보관합니다. 도움됐어요·반영된 의견·공부한 날 수는 숨기지 않으면 프로필에 보이고, 최근 기여는 목록에서 내 프로필과 새 게시글을 위쪽에 보이게 할 수 있습니다. 실수·약점·수준·문장은 다른 회원에게 보이지 않습니다. 계정을 지우면 함께 삭제합니다.",
      "• 게시판 글(로그인한 회원만): “사람” 탭 게시판에 쓴 글과 댓글은 쓴 시각·그때의 학습 언어와 함께 로그인한 다른 회원에게 보이며, 직접 지울 때까지 보관합니다. 글과 댓글은 쓴 사람만 고치거나 지울 수 있고, 글쓴이는 자기 글의 댓글도 지울 수 있습니다. 계정을 삭제하면 그 사람의 글과 댓글도 함께 삭제합니다. 나를 차단했거나 내가 차단한 회원의 글은 보이지 않습니다.",
      "• 메시지·단체방·게시판의 사진(로그인한 회원만): 사진을 붙이면 앱이 기기에서 줄여 서버로 보냅니다. 저장하기 전에 OpenAI의 검사 모델로 자동 검사하고, 성적·폭력적·혐오 사진으로 보이면 거절하고 보관하지 않습니다. 저장한 사진은 비공개 파일 저장소(Vercel Blob)에 두고 우리 서버를 거쳐서만 보여 줍니다: 1:1 메시지·단체방 사진은 그 대화의 사람에게만, 게시판 사진은 다른 회원에게. 메시지·단체방(팀 포함)의 사진은 보낸 지 30일 뒤, 골랐지만 보내지 않은 사진은 하루 뒤, 게시판 사진은 그 글·댓글을 지울 때 삭제합니다. 계정을 삭제하면 올린 사진 전부를 삭제합니다. 하루에 올린 사진 수를 셉니다(무료 하루 10장, 유료 50장).",
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
      "• 대화를 이해하는 데 필요한 정보(발화 내용 자체는 포함하지 않음): 언어, 이용자가 답한 대사, 답하기까지 걸린 시간, 발화의 길이, 음성 인식의 신뢰도, 한 단계에서 시도한 횟수, 교정이 필요했는지 여부, 일시 등",
      "이 기록은 익명 앱 식별자에만 연결되며 이름이나 연락처와 연결되지 않습니다. 잘못된 교정, 이용자의 말과 맞지 않는 답변을 찾거나, 앱에 미리 준비해 둘 문장을 고르는 등 서비스가 가르치는 방식을 측정하고 개선하는 데 사용합니다. 이 목적을 위해 운영자가 열람하거나 AI 제공자가 처리할 수 있습니다.",
      "채팅과 통화에서 연락처, 주민등록번호 등 식별번호, 건강·금융 정보 같은 민감한 개인정보는 말하지 않도록 주의해 주세요.",
      "발화 내용(글자)은 최대 12개월, 발화 내용이 포함되지 않은 대화 정보는 전년 같은 시기와 비교할 수 있도록 최대 14개월 보관한 뒤 삭제합니다. 언제든지 삭제나 보관 중단을 요청할 수 있습니다(“이용자의 선택과 권리” 참고).",
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
      "개인정보를 판매하지 않습니다. 구독하지 않고 안드로이드 앱을 쓰면 Google AdMob을 통해 광고가 표시됩니다(아래 “광고” 참고). 웹 사이트에서는 구독하지 않은 이용자에게 Google AdSense를 통해 목록 사이에 광고가 표시될 수 있습니다. 구독자에게는 광고가 표시되지 않습니다. 대화 내용, 학습 기록, 계정 정보는 광고에 사용하지 않습니다.",
    ],
  },
  {
    title: "처리 위탁 및 국외 이전",
    body: [
      "서비스 운영을 위해 아래 업체에 정보 처리를 맡기며, 이 과정에서 정보가 국외로 이전됩니다. 이전은 이용자가 해당 기능을 사용할 때 네트워크를 통해 이루어집니다.",
      "• OpenAI (미국): 채팅·통화·영상 내용, 통화 음성(글자 변환용), 분석 요청 문장 / 답변·교정·설명 생성, 음성 인식, 음성 합성, 번역 / 처리 후 OpenAI 정책에 따라 남용 감시를 위해 제한된 기간 보관",
      "• Vercel (미국): 요청 내용과 서버 로그 / 앱 웹페이지와 서버 호스팅 / 호스팅 제공자가 정한 기간",
      "• Upstash (Vercel을 통해 이용): 익명 앱 식별자, 이용 횟수, 포인트, “보관하는 대화 내용”의 기록과 대화 정보 / 데이터 저장 / 이 방침의 보관 기간",
      "• RevenueCat (미국): 익명 앱 식별자(로그인한 경우 계정 ID), 구독·구매 상태 / 결제 상태 확인, 구독을 계정에 연결 / 구독 관리에 필요한 기간",
      "• Resend (미국): 이메일 주소 / 로그인 일회용 코드 메일 발송 / 발송에 필요한 기간",
      "• Google (미국): 구매 정보, 영상 ID, 검색어 / Google Play 결제, YouTube 영상 재생·자막·검색 / 각 서비스 정책에 따름",
      "• Brave Search (미국): 검색어 / 학습 콘텐츠 검색 / 각 서비스 정책에 따름",
      "• Google AdMob (미국): 광고 ID, IP 주소, 기기·앱 정보, 광고 반응 / 구독하지 않은 이용자에게 안드로이드 앱 광고 표시·측정 / Google 정책에 따름",
      "• Google AdSense (미국): 쿠키 등 브라우저 식별 정보, IP 주소, 브라우저 정보, 광고 반응 / 구독하지 않은 이용자에게 웹 광고 표시·측정 / Google 정책에 따름",
      "OpenAI는 API 약관에 따라 API로 전송된 데이터를 기본적으로 모델 학습에 사용하지 않습니다.",
      "국외 이전을 원하지 않으면 해당 기능을 사용하지 않거나 서비스 이용을 중단할 수 있습니다. 다만 이 경우 채팅·통화·영상 학습 등 핵심 기능을 이용할 수 없습니다.",
    ],
  },
  {
    title: "광고",
    body: [
      "안드로이드 앱은 구독하지 않은 이용자에게 광고를 표시합니다. 활동이 자연스럽게 끝나는 때(예: 통화나 미션이 끝났을 때)나 앱을 열 때 전체 화면 광고가 나올 수 있고, 일부 화면 아래쪽에 배너와 일부 목록 사이에 카드 모양 광고가 있으며, 채팅을 더 쓰고 싶을 때 직접 골라 보는 광고가 있습니다. 구독자와 iOS 앱에는 광고가 없고, 웹 사이트에는 목록 사이 광고만 있습니다.",
      "광고는 Google AdMob이 제공합니다. 광고 표시와 측정을 위해 기기의 Google 모바일 광고 SDK가 Google 정책(https://policies.google.com/technologies/ads)에 따라 광고 ID, IP 주소, 기기·앱 정보, 광고 반응을 수집할 수 있습니다. 대화 내용, 학습 기록, 이메일, 계정 정보는 AdMob에 보내지 않습니다.",
      "광고를 보고 채팅을 더 받으면, AdMob이 광고를 끝까지 봤다는 사실과 우리 서버가 앱에 발급한 확인 코드를 서버로 보내 올바른 사람에게 채팅이 늘어나게 합니다. 서버는 하루 보상 횟수만 남깁니다.",
      "웹 사이트의 목록 사이 광고는 Google AdSense가 제공합니다. Google은 광고 표시와 측정을 위해 Google 정책(https://policies.google.com/technologies/partner-sites)에 따라 쿠키 등 유사 기술, IP 주소, 브라우저 정보를 쓸 수 있습니다. 웹에는 전체 화면 광고와 채팅을 더 받는 광고가 없습니다. 대화 내용, 학습 기록, 이메일, 계정 정보는 AdSense에 보내지 않습니다.",
      "법이 동의를 요구하는 지역(예: 유럽경제지역, 영국)에서는 맞춤 광고 전에 동의를 묻습니다. 광고 ID는 기기 설정(설정 → Google → 광고, 또는 설정 → 개인정보 보호 → 광고)에서 재설정하거나 끌 수 있습니다.",
    ],
  },
  {
    title: "보관 기간",
    body: [
      "• 통화 녹음 음성: 저장하지 않으며 글자 변환 후 폐기",
      "• 처리를 위해 보낸 채팅 메시지·사진 등: 답변을 만든 뒤 보관하지 않음(단, “보관하는 대화 내용”에 해당하는 기록은 제외)",
      "• “보관하는 대화 내용”의 발화 내용(글자): 최대 12개월",
      "• 학습 지도(목표, 지도, 진행 상황): 이용하는 동안 보관하며, 마지막으로 열거나 바꾼 때로부터 약 13개월 뒤 삭제. 새 목표를 만들면 지도가 바뀌고, 바뀌기 전 지도는 되돌릴 수 있도록 한 개만 보관",
      "• 발화 내용이 포함되지 않은 대화 정보(답하기까지 걸린 시간, 발화 길이, 인식 신뢰도 등): 최대 14개월",
      "• 일별·월별 이용 횟수: 약 70일 이내. 무료 체험 사용량과 구매한 포인트: 제공하거나 구매한 내용을 이행하는 데 필요한 기간",
      "• 서버 로그: 호스팅 제공자가 정한 제한된 기간",
      "• 계정(아이디·비밀번호 해시, 이메일 주소, Google 계정 ID, 닉네임, 사진, 자기소개): 계정을 삭제할 때까지. 앱에서 삭제하면(프로필 → 편집 → 계정 삭제) 계정과 프로필은 바로, 계정에 연결된 학습 기록은 30일 안에 삭제",
      "• 기기에 저장된 정보: 이용자가 삭제할 때까지",
    ],
  },
  {
    title: "이용자의 선택과 권리",
    body: [
      "이메일로 자신의 정보에 대한 열람, 정정, 삭제, 처리 정지(대화 기록 보관 중단 포함)를 요청할 수 있습니다. 로그인하지 않은 경우 기록을 찾기 위해 구매 영수증이나 이용 시점 같은 정보를 요청할 수 있습니다. 로그인한 경우 앱에서 직접 계정과 기록을 삭제할 수도 있습니다.",
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
