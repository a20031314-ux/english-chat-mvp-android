/**
 * 단계별 대본 — 듣고, 내 줄은 가리거나 멈춘 채 따라 말해 보고, 확인(2026-10-27 사용자 "단계별 스크립트" → "A에서 가리거나 멈추고 따라 말해보기 > 확인").
 *
 * 시범: 한국어·일본어·스페인어 1~2단계, 단계마다 두 편(그 단계의 장면·핵심 표현·문법 안에서, Claude가 씀 — 원어민 확인 전).
 * 줄마다 누가 말하는지(them = 상대, me = 학습자가 말할 줄)와 뜻(영어·한국어). 다른 앱 언어는 지금은 영어 뜻을 쓴다
 * — 넓힐 때 단계 글처럼 서버가 한 번 옮겨 저장(server/stageCopy.ts).
 * 학습 언어 글은 그 언어 그대로. 레벨 이름은 어디에도 보이지 않는다.
 */

export type ScriptGloss = { en: string; ko?: string };

export type StageScriptLine = {
  who: "them" | "me";
  /** 학습 언어. */
  text: string;
  gloss: ScriptGloss;
};

export type StageScript = {
  /** "ko-1-a". */
  id: string;
  /** 단계 순서(1 = 가장 쉬움) — stages의 order와 같다. */
  stage: number;
  setting: ScriptGloss;
  lines: StageScriptLine[];
};

const them = (text: string, en: string, ko?: string): StageScriptLine => ({ who: "them", text, gloss: { en, ...(ko ? { ko } : {}) } });
const me = (text: string, en: string, ko?: string): StageScriptLine => ({ who: "me", text, gloss: { en, ...(ko ? { ko } : {}) } });

const KO: StageScript[] = [
  {
    id: "ko-1-a",
    stage: 1,
    setting: { en: "Meeting someone new at a language exchange" },
    lines: [
      them("안녕하세요! 처음 뵙겠습니다.", "Hello! Nice to meet you."),
      me("안녕하세요. 만나서 반가워요.", "Hello. Nice to meet you."),
      them("이름이 뭐예요?", "What's your name?"),
      me("제 이름은 에밀리예요.", "My name is Emily."),
      them("에밀리 씨는 학생이에요?", "Are you a student, Emily?"),
      me("네, 맞아요. 저는 학생이에요.", "Yes, that's right. I'm a student."),
      them("한국어 잘하네요!", "Your Korean is good!"),
      me("아니요, 한국어 조금 해요.", "No, I speak a little Korean."),
    ],
  },
  {
    id: "ko-1-b",
    stage: 1,
    setting: { en: "Ordering a drink at a café" },
    lines: [
      them("어서 오세요. 주문하시겠어요?", "Welcome. Would you like to order?"),
      me("아이스 아메리카노 하나 주세요.", "One iced americano, please."),
      them("사이즈는 어떻게 해 드릴까요?", "What size would you like?"),
      me("잠깐만요. 큰 거 얼마예요?", "Just a moment. How much is the large one?"),
      them("큰 사이즈는 오천 원이에요.", "The large size is 5,000 won."),
      me("그럼 큰 거 주세요.", "Then the large one, please."),
      them("여기서 드시고 가세요?", "Is it for here?"),
      me("네, 여기서 마셔요. 감사합니다.", "Yes, I'll drink it here. Thank you."),
    ],
  },
  {
    id: "ko-2-a",
    stage: 2,
    setting: { en: "Making weekend plans with a friend" },
    lines: [
      them("주말에 뭐 했어요?", "What did you do on the weekend?"),
      me("친구를 만나고 영화를 봤어요.", "I met a friend and watched a movie."),
      them("재미있었어요?", "Was it fun?"),
      me("네, 진짜 재미있었어요.", "Yes, it was really fun."),
      them("이번 토요일에 시간 있어요?", "Do you have time this Saturday?"),
      me("네, 있어요. 같이 한강에 갈까요?", "Yes, I do. Shall we go to the Han River together?"),
      them("좋아요! 몇 시에 만날까요?", "Sounds good! What time shall we meet?"),
      me("두 시에 만나요. 그때 봐요!", "Let's meet at two. See you then!"),
    ],
  },
  {
    id: "ko-2-b",
    stage: 2,
    setting: { en: "Taking a taxi to the station" },
    lines: [
      them("어디로 가세요?", "Where are you going?"),
      me("서울역으로 가 주세요.", "To Seoul Station, please."),
      them("네, 이십 분쯤 걸려요.", "Okay, it takes about twenty minutes."),
      me("괜찮아요. 카드 돼요?", "That's fine. Do you take cards?"),
      them("네, 카드 돼요.", "Yes, cards are fine."),
      me("역 앞에서 내릴 거예요.", "I'll get off in front of the station."),
      them("여기서 내리실 거예요?", "Are you getting off here?"),
      me("네, 여기서 세워 주세요. 감사합니다.", "Yes, please stop here. Thank you."),
    ],
  },
];

const JA: StageScript[] = [
  {
    id: "ja-1-a",
    stage: 1,
    setting: { en: "Meeting someone new at a language exchange", ko: "언어 교환 모임에서 처음 만난 사람" },
    lines: [
      them("はじめまして。リナです。", "Nice to meet you. I'm Rina.", "처음 뵙겠습니다. 리나예요."),
      me("はじめまして。キムです。よろしくお願いします。", "Nice to meet you. I'm Kim. Pleased to meet you.", "처음 뵙겠습니다. 김이에요. 잘 부탁드려요."),
      them("キムさんは学生ですか。", "Are you a student, Kim?", "김 씨는 학생이에요?"),
      me("はい、そうです。大学生です。", "Yes, I am. I'm a university student.", "네, 맞아요. 대학생이에요."),
      them("毎日日本語を勉強しますか。", "Do you study Japanese every day?", "매일 일본어를 공부해요?"),
      me("はい、毎朝勉強します。", "Yes, I study every morning.", "네, 매일 아침 공부해요."),
      them("すごいですね。じゃあ、また来週。", "Great. Well, see you next week.", "대단하네요. 그럼 다음 주에 봐요."),
      me("ありがとうございます。また来週。", "Thank you. See you next week.", "고마워요. 다음 주에 봐요."),
    ],
  },
  {
    id: "ja-1-b",
    stage: 1,
    setting: { en: "Paying at a convenience store", ko: "편의점에서 계산하기" },
    lines: [
      them("いらっしゃいませ。", "Welcome.", "어서 오세요."),
      me("すみません、これください。", "Excuse me, this one, please.", "저기요, 이거 주세요."),
      them("温めますか。", "Shall I heat it up?", "데워 드릴까요?"),
      me("はい、お願いします。", "Yes, please.", "네, 부탁해요."),
      them("袋はいりますか。", "Do you need a bag?", "봉투 필요하세요?"),
      me("大丈夫です。いくらですか。", "No, I'm fine. How much is it?", "괜찮아요. 얼마예요?"),
      them("五百二十円です。", "That's 520 yen.", "520엔이에요."),
      me("はい。ありがとうございます。", "Here you are. Thank you.", "여기요. 감사합니다."),
    ],
  },
  {
    id: "ja-2-a",
    stage: 2,
    setting: { en: "Making weekend plans with a friend", ko: "친구와 주말 약속 잡기" },
    lines: [
      them("久しぶりです！元気ですか。", "Long time no see! How are you?", "오랜만이에요! 잘 지냈어요?"),
      me("元気です。週末は友だちと買い物しました。", "I'm good. I went shopping with a friend on the weekend.", "잘 지냈어요. 주말에 친구랑 쇼핑했어요."),
      them("いいですね。土曜日、一緒に映画を見ませんか。", "Nice. Would you like to see a movie together on Saturday?", "좋네요. 토요일에 같이 영화 볼래요?"),
      me("いいですね。何時にしますか。", "Sounds good. What time shall we make it?", "좋아요. 몇 시로 할까요?"),
      them("二時はどうですか。", "How about two o'clock?", "두 시 어때요?"),
      me("大丈夫です。楽しみです。", "That works. I'm looking forward to it.", "괜찮아요. 기대돼요."),
      them("じゃあ、駅の前で待っています。", "Then I'll be waiting in front of the station.", "그럼 역 앞에서 기다리고 있을게요."),
      me("わかりました。また土曜日に。", "Got it. See you on Saturday.", "알겠어요. 토요일에 봐요."),
    ],
  },
  {
    id: "ja-2-b",
    stage: 2,
    setting: { en: "Describing a cold at a pharmacy", ko: "약국에서 감기 증상 말하기" },
    lines: [
      them("どうしましたか。", "What seems to be the problem?", "어디가 안 좋으세요?"),
      me("昨日から頭が痛いです。", "I've had a headache since yesterday.", "어제부터 머리가 아파요."),
      them("熱もありますか。", "Do you have a fever too?", "열도 있어요?"),
      me("少しだけあります。", "Just a little.", "조금 있어요."),
      them("じゃあ、この薬を一日三回飲んでください。", "Then please take this medicine three times a day.", "그럼 이 약을 하루 세 번 드세요."),
      me("ご飯の後で飲んでもいいですか。", "Can I take it after meals?", "밥 먹고 나서 먹어도 돼요?"),
      them("はい、大丈夫です。お大事に。", "Yes, that's fine. Take care.", "네, 괜찮아요. 몸조리 잘하세요."),
      me("ありがとうございます。", "Thank you.", "감사합니다."),
    ],
  },
];

const ES: StageScript[] = [
  {
    id: "es-1-a",
    stage: 1,
    setting: { en: "Meeting a classmate on the first day of class", ko: "어학 수업 첫날 같은 반 친구와 인사" },
    lines: [
      them("¡Hola! ¿Qué tal? Me llamo Lucía.", "Hi! How are you? My name is Lucía.", "안녕! 잘 지내? 나는 루시아야."),
      me("Hola, Lucía. Mucho gusto. Me llamo Jun.", "Hi, Lucía. Nice to meet you. My name is Jun.", "안녕, 루시아. 반가워. 나는 준이야."),
      them("¿De dónde eres, Jun?", "Where are you from, Jun?", "준은 어디서 왔어?"),
      me("Soy de Corea. ¿Y tú?", "I'm from Korea. And you?", "한국에서 왔어. 너는?"),
      them("Soy de México. ¿Dónde vives?", "I'm from Mexico. Where do you live?", "멕시코에서 왔어. 어디 살아?"),
      me("Vivo cerca de la escuela.", "I live near the school.", "학교 근처에 살아."),
      them("¡Qué bien! Hasta luego, Jun.", "How nice! See you later, Jun.", "좋다! 이따 봐, 준."),
      me("Hasta luego.", "See you later.", "이따 봐."),
    ],
  },
  {
    id: "es-1-b",
    stage: 1,
    setting: { en: "Buying fruit at a market stall", ko: "시장 가판대에서 과일 사기" },
    lines: [
      them("Buenos días. ¿Qué quiere?", "Good morning. What would you like?", "안녕하세요. 뭐 드릴까요?"),
      me("Buenos días. Quiero dos naranjas, por favor.", "Good morning. I'd like two oranges, please.", "안녕하세요. 오렌지 두 개 주세요."),
      them("Muy bien. ¿Algo más?", "Very good. Anything else?", "좋아요. 더 필요한 거 있어요?"),
      me("Sí, una manzana. ¿Cuánto cuesta?", "Yes, an apple. How much is it?", "네, 사과 하나요. 얼마예요?"),
      them("Todo es un euro con cincuenta.", "It's one euro fifty altogether.", "전부 1유로 50센트예요."),
      me("Perdón, no entiendo. Más despacio, por favor.", "Sorry, I don't understand. More slowly, please.", "죄송해요, 못 알아들었어요. 천천히 말해 주세요."),
      them("Un euro… con… cincuenta.", "One euro… fifty.", "1유로… 50센트요."),
      me("Vale, gracias. Adiós.", "Okay, thanks. Goodbye.", "네, 고마워요. 안녕히 계세요."),
    ],
  },
  {
    id: "es-2-a",
    stage: 2,
    setting: { en: "Making weekend plans with a friend", ko: "친구와 주말 약속 잡기" },
    lines: [
      them("¡Hola! ¿Qué hiciste el fin de semana?", "Hi! What did you do on the weekend?", "안녕! 주말에 뭐 했어?"),
      me("Ayer fui a la playa con mi hermana.", "Yesterday I went to the beach with my sister.", "어제 여동생이랑 바다에 갔어."),
      them("¡Qué bien! ¿Quieres venir al cine el sábado?", "Nice! Do you want to come to the movies on Saturday?", "좋다! 토요일에 영화 보러 갈래?"),
      me("Sí, claro. ¿A qué hora?", "Yes, of course. What time?", "응, 좋아. 몇 시에?"),
      them("¿Te viene bien a las ocho?", "Does eight o'clock work for you?", "여덟 시 괜찮아?"),
      me("Sí, me viene bien.", "Yes, that works for me.", "응, 괜찮아."),
      them("¡Perfecto! Nos vemos el sábado.", "Perfect! See you on Saturday.", "좋아! 토요일에 보자."),
      me("¡Qué buena idea! Nos vemos.", "What a great idea! See you.", "좋은 생각이야! 그때 봐."),
    ],
  },
  {
    id: "es-2-b",
    stage: 2,
    setting: { en: "Ordering lunch at a restaurant", ko: "식당에서 점심 주문하기" },
    lines: [
      them("Buenas tardes. ¿Qué va a tomar?", "Good afternoon. What will you have?", "안녕하세요. 뭐 드시겠어요?"),
      me("¿Qué me recomienda?", "What do you recommend?", "뭐가 좋아요?"),
      them("La sopa del día está muy buena.", "The soup of the day is very good.", "오늘의 수프가 아주 맛있어요."),
      me("Vale, para mí la sopa, por favor.", "Okay, the soup for me, please.", "좋아요, 저는 수프로 주세요."),
      them("¿Y para beber?", "And to drink?", "마실 건요?"),
      me("Agua, por favor.", "Water, please.", "물 주세요."),
      them("¿Algo más?", "Anything else?", "더 필요한 거 있으세요?"),
      me("No, gracias. La cuenta, por favor.", "No, thanks. The bill, please.", "아니요, 괜찮아요. 계산서 주세요."),
    ],
  },
];

const ALL: Partial<Record<string, StageScript[]>> = { ko: KO, ja: JA, es: ES };

/** 이 학습 언어·단계의 대본(없으면 빈 목록 — 시범 밖 언어·단계). */
export function scriptsFor(language: string, stage: number): StageScript[] {
  return (ALL[language] ?? []).filter((script) => script.stage === stage);
}

/** 앱 언어로 된 뜻. 한국어 앱은 ko(없으면 en), 나머지는 지금 en. */
export function glossFor(gloss: ScriptGloss, uiLanguage: string): string {
  return uiLanguage === "ko" ? (gloss.ko ?? gloss.en) : gloss.en;
}

/**
 * "첫 글자만": 낱말마다 첫 글자만 두고 나머지 글자는 _로(띄어쓰기·문장부호는 그대로).
 * 낱말 나누기는 Intl.Segmenter — 띄어쓰기 없는 말(ja·zh·th)도 낱말 덩어리마다 첫 글자가 남는다.
 */
export function hintOf(text: string, language: string): string {
  const mask = (word: string) => {
    const chars = [...word];
    return chars[0] + chars.slice(1).map((ch) => (/[\p{L}\p{N}]/u.test(ch) ? "_" : ch)).join("");
  };
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return text.replace(/[\p{L}\p{N}]+/gu, mask);
  const segmenter = new Intl.Segmenter(language, { granularity: "word" });
  return [...segmenter.segment(text)].map((part) => (part.isWordLike ? mask(part.segment) : part.segment)).join("");
}
