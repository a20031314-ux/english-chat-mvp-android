/**
 * 통화 장면 공통 목록(2026-11-02, `hub/drafts/call-scripts-design-2026-11-01.md` 2·15절).
 *
 * 14개 언어가 같은 목록을 쓰고, 대본 글은 언어마다(callScene.ts). 장소는 그 나라에서 흔한 곳으로 바꿔 써도 된다
 * (일본어 카페 → 편의점 같은 식) — 해낼 일과 말 기능(fns, curriculum/functions.ts)은 그대로.
 *
 * 단계마다 30개: 최소 묶음 10(상황 errand 4 + 주제 topic 6 — 범위 약속을 덮는 것) + 변주 variant 20.
 * 내보낸 뒤 id는 바꾸지 않는다(장면 id·목소리 캐시가 묶임). 지금은 1단계만.
 */
export type SceneBrief = {
  id: string;
  stage: number;
  kind: "errand" | "topic" | "variant";
  title: { en: string; ko: string };
  tutorRole: string;
  /** 모델이 읽는 장면 설명(영어). */
  setting: string;
  /** 학습자가 해낼 것(영어). */
  objective: string;
  /** 말 기능(functions.ts id) — 이 장면이 꺼내 쓰게 하는 것. */
  fns: string[];
  /** 가장 잘 막히는 차례 — 가지·쉬운 말을 거기에. */
  likelyTrouble: string;
};

const b = (
  id: string,
  kind: SceneBrief["kind"],
  en: string,
  ko: string,
  tutorRole: string,
  setting: string,
  objective: string,
  fns: string[],
  likelyTrouble: string,
): SceneBrief => ({ id, stage: 1, kind, title: { en, ko }, tutorRole, setting, objective, fns, likelyTrouble });

export const SCENE_BRIEFS: SceneBrief[] = [
  // 최소 묶음 — 상황 4
  b("s1-cafe", "errand", "Ordering a drink", "음료 주문하기", "barista / counter staff",
    "A small café or convenience-store counter, not busy. The tutor serves the learner, who has just come in.",
    "Order a drink, say how many, ask the price and pay.",
    ["greet", "want", "request-thing", "count", "ask-price", "thank"],
    "Catching the price when it is said aloud, and saying 'one' or 'two'."),
  b("s1-way", "errand", "Asking the way", "길 묻기", "passer-by",
    "A street near a station. The learner stops a friendly passer-by to ask where something is.",
    "Ask where a place is, say you did not understand, ask them to say it slowly, and thank them.",
    ["apologize", "ask-where", "not-understand", "repeat-slow", "thank"],
    "Following the directions the first time; they need to ask for a repeat."),
  b("s1-shop", "errand", "Do you have this?", "이거 있어요?", "shop assistant",
    "A small shop. The learner looks for an item and asks whether they have it and what it costs.",
    "Ask if they have something, answer yes/no questions, ask the price and take it.",
    ["ask-have", "ask-what", "yes-no", "ask-price", "want"],
    "Answering a yes/no question from the assistant (size, colour, a bag)."),
  b("s1-checkin", "errand", "Checking in", "체크인하기", "receptionist",
    "The front desk of a small hotel or hostel. The learner has a booking.",
    "Say your name, answer simple questions, ask when breakfast is and where the room is.",
    ["greet", "introduce", "time-when", "ask-where", "possession"],
    "Spelling or repeating the name, and catching a time."),
  // 최소 묶음 — 주제 6
  b("s1-meet", "topic", "Meeting someone new", "처음 만난 사람과", "friendly classmate",
    "The first day of a language class or a language-exchange meetup. The tutor starts the chat.",
    "Greet, say your name, where you are from and what you do, and ask the same back.",
    ["greet", "introduce", "origin", "job"],
    "Asking the same question back instead of only answering."),
  b("s1-family", "topic", "My family", "가족 이야기", "friend",
    "A friend is looking at a photo on the learner's phone and asks who is in it.",
    "Say who people are, how many brothers or sisters you have, and whose something is.",
    ["have", "count", "possession", "like"],
    "Saying how many and using 'my / his / her'."),
  b("s1-likes", "topic", "What I like", "좋아하는 것", "new friend",
    "Two new friends chat over a drink about food and things they like.",
    "Say what you like and do not like, and ask what they like.",
    ["like", "dislike", "want", "yes-no"],
    "Saying 'I don't like' rather than only nodding."),
  b("s1-can", "topic", "What I can do", "할 수 있는 것", "club member",
    "Joining a weekend club; a member asks what the learner can do (sports, cooking, languages).",
    "Say what you can and cannot do, and ask back.",
    ["can", "cannot", "like", "yes-no"],
    "The negative form of 'can'."),
  b("s1-day", "topic", "My day", "하루 일과", "colleague",
    "A colleague chats in the morning about when the learner gets up, starts work and has lunch.",
    "Say when you do things and where you are now.",
    ["time-when", "location-now", "greet"],
    "Saying a time with a number."),
  b("s1-town", "topic", "Where I live", "사는 곳", "neighbour",
    "A new neighbour asks where the learner lives and what is nearby.",
    "Say where you live, what there is near your home, and what you like about it.",
    ["location-now", "have", "ask-have", "like"],
    "Saying 'there is / there isn't'."),
  // 변주 20
  b("s1-market", "variant", "Buying fruit at a market", "시장에서 과일 사기", "stall owner",
    "An outdoor market stall selling fruit.", "Ask the price, say how many you want and pay.",
    ["ask-price", "count", "want", "thank"], "Numbers and 'for five'."),
  b("s1-bakery", "variant", "At the bakery", "빵집에서", "baker",
    "A small bakery in the morning.", "Ask what something is, choose and pay.",
    ["ask-what", "want", "count", "ask-price"], "Asking what an item is called."),
  b("s1-lunch", "variant", "Ordering lunch", "점심 주문하기", "server",
    "A small casual restaurant at lunchtime.", "Order food and a drink, answer the server's questions, ask for the bill.",
    ["want", "request-thing", "yes-no", "ask-price"], "Answering 'anything else?'."),
  b("s1-bus", "variant", "At the bus stop", "버스 정류장에서", "person waiting",
    "A bus stop; the learner asks someone about the next bus.", "Ask where the bus goes and when it comes.",
    ["ask-where", "time-when", "thank"], "Catching a time or a number."),
  b("s1-ticket", "variant", "Buying a train ticket", "기차표 사기", "ticket clerk",
    "A station ticket window.", "Say where you want to go, how many tickets, and ask the price and the time.",
    ["want", "count", "ask-price", "time-when"], "Saying the destination and 'one way'."),
  b("s1-taxi", "variant", "Taking a taxi", "택시 타기", "taxi driver",
    "Getting into a taxi.", "Say where you are going, answer simple questions, ask how much.",
    ["want", "location-now", "ask-price", "thank"], "Saying the address or place name clearly."),
  b("s1-pharmacy", "variant", "At the pharmacy", "약국에서", "pharmacist",
    "A pharmacy; the learner has a headache.", "Say what you need, answer yes/no, ask the price.",
    ["ask-have", "want", "yes-no", "ask-price"], "Answering 'since when?' simply."),
  b("s1-clothes", "variant", "Buying clothes", "옷 사기", "shop assistant",
    "A clothes shop.", "Ask for a size or colour, say if you like it, and take it.",
    ["ask-have", "like", "dislike", "want"], "Size and colour words."),
  b("s1-lost", "variant", "Lost and found", "분실물 찾기", "lost-property clerk",
    "A lost-property desk at a station.", "Say what you lost, whose it is and when, and where to come back.",
    ["possession", "have", "time-when", "ask-where"], "Describing the item in a few words."),
  b("s1-tourist", "variant", "At the tourist office", "관광 안내소에서", "tourist-office staff",
    "A tourist information desk.", "Ask what there is to see, where it is and when it opens.",
    ["ask-what", "ask-where", "time-when", "thank"], "Opening times."),
  b("s1-library", "variant", "Getting a library card", "도서관 카드 만들기", "librarian",
    "A public library front desk.", "Say your name, where you live, and ask how long you can keep a book.",
    ["introduce", "location-now", "time-when", "request-action"], "Spelling a name or giving a number."),
  b("s1-gym", "variant", "Joining a gym", "헬스장 등록하기", "gym staff",
    "A gym reception.", "Ask the price and the opening hours, say what you want to do.",
    ["ask-price", "time-when", "want", "can"], "Prices per month."),
  b("s1-clinic", "variant", "At the clinic reception", "병원 접수하기", "receptionist",
    "A clinic reception desk.", "Give your name, say it is your first time, answer simple questions.",
    ["introduce", "yes-no", "time-when", "not-understand"], "Being asked to fill something in."),
  b("s1-neighbour", "variant", "Meeting a neighbour", "새 이웃과 인사", "neighbour",
    "The hallway or entrance of an apartment building.", "Greet, say your name and which floor you live on, say goodbye.",
    ["greet", "introduce", "location-now", "greet"], "Saying goodbye politely."),
  b("s1-exchange", "variant", "Language exchange", "언어 교환", "exchange partner",
    "A café language-exchange meetup.", "Say what languages you can speak and what you want to learn.",
    ["introduce", "can", "cannot", "want"], "Talking about languages."),
  b("s1-pen", "variant", "Borrowing a pen", "펜 빌리기", "classmate",
    "During class; the learner needs a pen.", "Ask for something, say whose it is, thank them and give it back.",
    ["request-thing", "possession", "thank", "apologize"], "Asking politely."),
  b("s1-phone", "variant", "Finding a friend by phone", "전화로 친구 찾기", "friend on the phone",
    "Meeting a friend near a station; they cannot find each other and talk on the phone.", "Say where you are now and what you can see, agree where to meet.",
    ["location-now", "ask-where", "time-when", "repeat-slow"], "Saying where you are."),
  b("s1-colleague", "variant", "Morning at work", "회사 아침 인사", "colleague",
    "Arriving at the office in the morning.", "Greet, say how you are, and say when you will have lunch.",
    ["greet", "time-when", "want"], "Answering 'how are you?' with more than one word."),
  b("s1-help", "variant", "Asking for help", "도와 달라고 하기", "staff member",
    "In a shop or station; the learner needs someone to help with a machine.", "Say you do not understand, ask them to help or do something.",
    ["not-understand", "request-action", "repeat-slow", "thank"], "Asking someone to do something."),
  b("s1-goodbye", "variant", "After class", "수업 끝나고", "classmate",
    "Leaving class; a classmate chats for a minute.", "Say where you are going now, when the next class is, and say goodbye.",
    ["location-now", "time-when", "greet"], "Ending a conversation naturally."),
];

export function briefsForStage(stage: number): SceneBrief[] {
  return SCENE_BRIEFS.filter((brief) => brief.stage === stage);
}
