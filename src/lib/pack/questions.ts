/**
 * The questions a daily pack is made of (hub/drafts/daily-pack.md).
 *
 * Every line here is said by the tutor in the scene's voice, as written, to
 * every learner who reaches it — so each one is synthesised once and served
 * from the shared speech cache after that (api/tts). That is what makes a pack
 * nearly free: what is personal about it is which questions, in which order,
 * and what the learner is asked to try, never the tutor's words.
 *
 * Two kinds:
 * - openers start a short exchange. Each serves one of the gaps the learner
 *   ticked when they started (learner/selfCheck.ts), because the exchange it
 *   starts is the kind that gap is filled by: quick questions answered in a
 *   few words for speaking, something that happened for accuracy, describing a
 *   thing for vocabulary, a longer line to take in for listening, everyday
 *   small talk for sounding natural.
 * - follow-ups come after an opener's answer and point back at it without
 *   naming it ("How was it?"), grouped by the frame of the opener they fit.
 *   The tutor picks among them each turn, so one that no longer fits what was
 *   said is passed over rather than asked (api/roleplay/turn).
 *
 * Japanese is plain register throughout, like the Just talk scene's own lines.
 * Glosses are Korean, like the bank's (justTalk.ts BANK_GLOSS_LANGUAGE).
 *
 * Pure data.
 */

import type { GapId, UseId } from "../learner/selfCheck.ts";

/** What an opener asks about, which decides the follow-ups that fit after it. */
export type Frame = "quick" | "past" | "plan" | "habit" | "opinion" | "describe";

export type PackLine = { id: string; text: string; translation: string };

export type Opener = PackLine & {
  gap: GapId;
  frame: Frame;
  /** Where it belongs, when it belongs somewhere in particular. */
  use?: UseId;
};

export type PackBank = {
  /**
   * Said before the first of a run of quick questions, so "Coffee or tea?"
   * after "How's your day going?" is heard as a game starting rather than a
   * reply that missed what was said (seen on a phone, 2026-10-18).
   */
  quickLead: PackLine;
  openers: Opener[];
  follows: Record<Exclude<Frame, "quick">, PackLine[]>;
};

const EN: PackBank = {
  quickLead: {
    id: "lead.quick",
    text: "Okay, a few quick ones — just say the first thing that comes to mind.",
    translation: "좋아요, 빠른 질문 몇 개요. 처음 떠오르는 대로 말해 봐요.",
  },
  openers: [
    // Words do not come out quickly: answered in a word or two.
    { id: "q.coffee", gap: "speaking", frame: "quick", text: "Coffee or tea?", translation: "커피예요, 차예요?" },
    { id: "q.morning", gap: "speaking", frame: "quick", text: "Are you a morning person?", translation: "아침형이에요?" },
    { id: "q.pets", gap: "speaking", frame: "quick", text: "Cats or dogs?", translation: "고양이요, 강아지요?" },
    { id: "q.rain", gap: "speaking", frame: "quick", text: "Do you like rainy days?", translation: "비 오는 날 좋아해요?" },
    { id: "q.sleep", gap: "speaking", frame: "quick", text: "Did you sleep well last night?", translation: "어젯밤에 잘 잤어요?" },
    { id: "q.snack", gap: "speaking", frame: "quick", text: "Sweet or salty snacks?", translation: "단 간식이요, 짠 간식이요?" },
    { id: "q.beach", gap: "speaking", frame: "quick", text: "Beach or mountains?", translation: "바다요, 산이요?" },
    { id: "q.busy", gap: "speaking", frame: "quick", text: "Are you busy this week?", translation: "이번 주 바빠요?" },
    { id: "q.lunch", gap: "speaking", frame: "quick", use: "work", text: "Did you have lunch yet?", translation: "점심 먹었어요?" },
    { id: "q.window", gap: "speaking", frame: "quick", use: "travel", text: "Window seat or aisle seat?", translation: "창가 자리요, 통로 자리요?" },
    // Building sentences: something that happened, told in full.
    { id: "a.weekend", gap: "accuracy", frame: "past", text: "What did you do last weekend?", translation: "지난 주말에 뭐 했어요?" },
    { id: "a.movie", gap: "accuracy", frame: "past", use: "video", text: "What was the last movie you watched?", translation: "마지막으로 본 영화가 뭐예요?" },
    { id: "a.dinner", gap: "accuracy", frame: "past", text: "What did you have for dinner yesterday?", translation: "어제 저녁에 뭐 먹었어요?" },
    { id: "a.afterwork", gap: "accuracy", frame: "past", use: "work", text: "What did you do after work yesterday?", translation: "어제 퇴근하고 뭐 했어요?" },
    { id: "a.holiday", gap: "accuracy", frame: "past", use: "travel", text: "Where did you go on your last holiday?", translation: "지난 휴가 때 어디 갔어요?" },
    { id: "a.dayoff", gap: "accuracy", frame: "past", text: "How did you spend your last day off?", translation: "지난 쉬는 날은 어떻게 보냈어요?" },
    // Words: describing something, where the right word matters.
    { id: "w.area", gap: "words", frame: "describe", text: "What's your neighborhood like?", translation: "사는 동네는 어때요?" },
    { id: "w.food", gap: "words", frame: "describe", text: "What's your favorite place to eat like?", translation: "제일 좋아하는 식당은 어떤 곳이에요?" },
    { id: "w.room", gap: "words", frame: "describe", text: "What does your room look like?", translation: "방은 어떻게 생겼어요?" },
    { id: "w.job", gap: "words", frame: "describe", use: "work", text: "What's a normal day at work like for you?", translation: "평소 회사에서 하루는 어때요?" },
    { id: "w.city", gap: "words", frame: "describe", use: "travel", text: "What's the best city you've ever visited?", translation: "가 본 도시 중에 어디가 제일 좋았어요?" },
    { id: "w.show", gap: "words", frame: "describe", use: "video", text: "What show are you into these days?", translation: "요즘 빠져 있는 프로그램 있어요?" },
    // Listening: a longer line to take in before answering.
    { id: "l.cook", gap: "listening", frame: "habit", text: "I've been trying to cook more at home lately, mostly simple pasta and soup. Do you cook much?", translation: "요즘 집에서 요리를 더 하려고 하는데, 주로 간단한 파스타나 수프예요. 요리 자주 해요?" },
    { id: "l.town", gap: "listening", frame: "opinion", text: "My friend just moved to a small town, and she says it's much quieter than she expected. Would you rather live in a city or a small town?", translation: "친구가 작은 동네로 이사했는데, 생각보다 훨씬 조용하대요. 도시랑 작은 동네 중에 어디 살고 싶어요?" },
    { id: "l.phone", gap: "listening", frame: "habit", text: "I usually check my phone right after I wake up, which I know isn't great. What's the first thing you do in the morning?", translation: "저는 일어나자마자 휴대폰부터 보는데, 좋지 않은 건 알아요. 아침에 제일 먼저 뭐 해요?" },
    { id: "l.series", gap: "listening", frame: "habit", use: "video", text: "I started a new series last week, and now I can't stop watching it. Do you watch anything in the evenings?", translation: "지난주에 새 시리즈를 보기 시작했는데 멈출 수가 없어요. 저녁에 뭐 봐요?" },
    { id: "l.remote", gap: "listening", frame: "opinion", use: "work", text: "Our team started working from home two days a week, and honestly, it's been nice. How does your workplace do it?", translation: "우리 팀은 일주일에 이틀 재택을 시작했는데, 솔직히 좋아요. 그쪽 회사는 어떻게 해요?" },
    { id: "l.suitcase", gap: "listening", frame: "past", use: "travel", text: "The last time I traveled, my suitcase went missing for two days. Has anything like that ever happened to you?", translation: "지난번 여행 때 캐리어가 이틀 동안 없어졌어요. 그런 일 있었어요?" },
    // Sounding natural: everyday small talk.
    { id: "n.week", gap: "natural", frame: "opinion", text: "How's your week going so far?", translation: "이번 주 어때요?" },
    { id: "n.plans", gap: "natural", frame: "plan", text: "Got any plans for the weekend?", translation: "주말에 계획 있어요?" },
    { id: "n.relax", gap: "natural", frame: "habit", text: "What do you usually do to relax?", translation: "쉴 때 보통 뭐 해요?" },
    { id: "n.fun", gap: "natural", frame: "past", text: "Have you been up to anything fun lately?", translation: "요즘 뭐 재밌는 거 했어요?" },
    { id: "n.forward", gap: "natural", frame: "plan", text: "What's something you're looking forward to?", translation: "요즘 기대되는 거 있어요?" },
  ],
  follows: {
    past: [
      { id: "f.past.how", text: "How was it?", translation: "어땠어요?" },
      { id: "f.past.who", text: "Who were you with?", translation: "누구랑 있었어요?" },
      { id: "f.past.best", text: "What was the best part?", translation: "제일 좋았던 게 뭐예요?" },
      { id: "f.past.next", text: "What happened next?", translation: "그다음엔 어떻게 됐어요?" },
      { id: "f.past.again", text: "Would you do it again?", translation: "또 하고 싶어요?" },
    ],
    plan: [
      { id: "f.plan.most", text: "What are you looking forward to most?", translation: "제일 기대되는 게 뭐예요?" },
      { id: "f.plan.who", text: "Who's going with you?", translation: "누구랑 같이 가요?" },
      { id: "f.plan.since", text: "How long have you been planning it?", translation: "언제부터 계획했어요?" },
    ],
    habit: [
      { id: "f.habit.often", text: "How often do you do that?", translation: "얼마나 자주 해요?" },
      { id: "f.habit.start", text: "When did you start?", translation: "언제 시작했어요?" },
      { id: "f.habit.like", text: "What do you like about it?", translation: "어떤 점이 좋아요?" },
    ],
    opinion: [
      { id: "f.op.why", text: "Why do you think so?", translation: "왜 그렇게 생각해요?" },
      { id: "f.op.always", text: "Have you always felt that way?", translation: "원래부터 그렇게 느꼈어요?" },
      { id: "f.op.change", text: "What would you change about it?", translation: "바꾼다면 뭘 바꾸고 싶어요?" },
    ],
    describe: [
      { id: "f.desc.like", text: "What do you like most about it?", translation: "어떤 점이 제일 좋아요?" },
      { id: "f.desc.diff", text: "How is it different from before?", translation: "예전이랑 뭐가 달라요?" },
      { id: "f.desc.more", text: "Can you tell me a bit more?", translation: "조금 더 얘기해 줄래요?" },
    ],
  },
};

const JA: PackBank = {
  quickLead: {
    id: "lead.quick",
    text: "じゃあ、ぱっと答える質問をいくつか。最初に浮かんだことを言ってみて。",
    translation: "그럼 바로 답하는 질문 몇 개. 처음 떠오른 걸 말해 봐.",
  },
  openers: [
    { id: "q.coffee", gap: "speaking", frame: "quick", text: "コーヒー派？紅茶派？", translation: "커피파? 홍차파?" },
    { id: "q.morning", gap: "speaking", frame: "quick", text: "朝型？夜型？", translation: "아침형? 저녁형?" },
    { id: "q.pets", gap: "speaking", frame: "quick", text: "犬と猫、どっちが好き？", translation: "강아지랑 고양이 중에 뭐가 좋아?" },
    { id: "q.rain", gap: "speaking", frame: "quick", text: "雨の日は好き？", translation: "비 오는 날 좋아해?" },
    { id: "q.sleep", gap: "speaking", frame: "quick", text: "昨日はよく眠れた？", translation: "어제 잘 잤어?" },
    { id: "q.snack", gap: "speaking", frame: "quick", text: "甘いおやつとしょっぱいおやつ、どっちが好き？", translation: "단 간식이랑 짠 간식 중에 뭐가 좋아?" },
    { id: "q.beach", gap: "speaking", frame: "quick", text: "海と山、どっちが好き？", translation: "바다랑 산 중에 어디가 좋아?" },
    { id: "q.busy", gap: "speaking", frame: "quick", text: "今週は忙しい？", translation: "이번 주 바빠?" },
    { id: "q.lunch", gap: "speaking", frame: "quick", use: "work", text: "もうお昼食べた？", translation: "점심 먹었어?" },
    { id: "q.window", gap: "speaking", frame: "quick", use: "travel", text: "窓側と通路側、どっちがいい？", translation: "창가랑 통로 중에 어디가 좋아?" },
    { id: "a.weekend", gap: "accuracy", frame: "past", text: "先週末は何してた？", translation: "지난 주말에 뭐 했어?" },
    { id: "a.movie", gap: "accuracy", frame: "past", use: "video", text: "最後に見た映画は何？", translation: "마지막으로 본 영화가 뭐야?" },
    { id: "a.dinner", gap: "accuracy", frame: "past", text: "昨日の晩ごはんは何を食べた？", translation: "어제 저녁에 뭐 먹었어?" },
    { id: "a.afterwork", gap: "accuracy", frame: "past", use: "work", text: "昨日、仕事のあとは何した？", translation: "어제 퇴근하고 뭐 했어?" },
    { id: "a.holiday", gap: "accuracy", frame: "past", use: "travel", text: "この前の休みはどこに行った？", translation: "지난 휴가 때 어디 갔어?" },
    { id: "a.dayoff", gap: "accuracy", frame: "past", text: "この前の休みの日はどう過ごした？", translation: "지난 쉬는 날은 어떻게 보냈어?" },
    { id: "w.area", gap: "words", frame: "describe", text: "住んでるところはどんな感じ？", translation: "사는 동네는 어때?" },
    { id: "w.food", gap: "words", frame: "describe", text: "お気に入りのお店ってどんなところ？", translation: "제일 좋아하는 가게는 어떤 곳이야?" },
    { id: "w.room", gap: "words", frame: "describe", text: "部屋はどんな感じ？", translation: "방은 어떤 느낌이야?" },
    { id: "w.job", gap: "words", frame: "describe", use: "work", text: "普段の仕事の一日ってどんな感じ？", translation: "평소 회사에서 하루는 어때?" },
    { id: "w.city", gap: "words", frame: "describe", use: "travel", text: "今まで行った中で一番よかった街はどこ？", translation: "가 본 도시 중에 어디가 제일 좋았어?" },
    { id: "w.show", gap: "words", frame: "describe", use: "video", text: "最近ハマってる番組ある？", translation: "요즘 빠져 있는 프로그램 있어?" },
    { id: "l.cook", gap: "listening", frame: "habit", text: "最近、家で料理するようにしてて、だいたい簡単なパスタとかスープなんだ。料理はよくする？", translation: "요즘 집에서 요리하려고 하는데, 주로 간단한 파스타나 수프야. 요리 자주 해?" },
    { id: "l.town", gap: "listening", frame: "opinion", text: "友達が小さい町に引っ越したんだけど、思ってたよりずっと静かなんだって。住むなら都会と田舎、どっちがいい？", translation: "친구가 작은 동네로 이사했는데, 생각보다 훨씬 조용하대. 산다면 도시랑 시골 중에 어디가 좋아?" },
    { id: "l.phone", gap: "listening", frame: "habit", text: "朝起きてすぐスマホを見ちゃうんだよね。よくないってわかってるんだけど。朝起きて最初に何する？", translation: "아침에 일어나자마자 휴대폰부터 보게 돼. 안 좋은 건 아는데. 일어나서 제일 먼저 뭐 해?" },
    { id: "l.series", gap: "listening", frame: "habit", use: "video", text: "先週新しいドラマを見始めたら、止まらなくなっちゃって。夜は何か見てる？", translation: "지난주에 새 드라마를 보기 시작했더니 멈출 수가 없어. 저녁에 뭐 봐?" },
    { id: "l.remote", gap: "listening", frame: "opinion", use: "work", text: "うちのチーム、週二日在宅になったんだけど、正直けっこういいんだ。そっちの職場はどう？", translation: "우리 팀은 일주일에 이틀 재택이 됐는데, 솔직히 꽤 좋아. 그쪽 회사는 어때?" },
    { id: "l.suitcase", gap: "listening", frame: "past", use: "travel", text: "前に旅行したとき、スーツケースが二日間なくなったんだよね。そういうことあった？", translation: "전에 여행 갔을 때 캐리어가 이틀 동안 없어졌거든. 그런 일 있었어?" },
    { id: "n.week", gap: "natural", frame: "opinion", text: "今週はどう？", translation: "이번 주 어때?" },
    { id: "n.plans", gap: "natural", frame: "plan", text: "週末は何か予定ある？", translation: "주말에 계획 있어?" },
    { id: "n.relax", gap: "natural", frame: "habit", text: "リラックスしたいときは何してる？", translation: "쉬고 싶을 때 뭐 해?" },
    { id: "n.fun", gap: "natural", frame: "past", text: "最近何か楽しいことあった？", translation: "요즘 뭐 재밌는 일 있었어?" },
    { id: "n.forward", gap: "natural", frame: "plan", text: "何か楽しみにしてることある？", translation: "기대되는 거 있어?" },
  ],
  follows: {
    past: [
      { id: "f.past.how", text: "どうだった？", translation: "어땠어?" },
      { id: "f.past.who", text: "誰と一緒だったの？", translation: "누구랑 같이 있었어?" },
      { id: "f.past.best", text: "一番よかったのは何？", translation: "제일 좋았던 건 뭐야?" },
      { id: "f.past.next", text: "そのあとどうなったの？", translation: "그다음에 어떻게 됐어?" },
      { id: "f.past.again", text: "またやりたい？", translation: "또 하고 싶어?" },
    ],
    plan: [
      { id: "f.plan.most", text: "何が一番楽しみ？", translation: "뭐가 제일 기대돼?" },
      { id: "f.plan.who", text: "誰と行くの？", translation: "누구랑 가?" },
      { id: "f.plan.since", text: "いつから計画してたの？", translation: "언제부터 계획했어?" },
    ],
    habit: [
      { id: "f.habit.often", text: "どのくらいの頻度でやってるの？", translation: "얼마나 자주 해?" },
      { id: "f.habit.start", text: "いつ始めたの？", translation: "언제 시작했어?" },
      { id: "f.habit.like", text: "どんなところが好き？", translation: "어떤 점이 좋아?" },
    ],
    opinion: [
      { id: "f.op.why", text: "どうしてそう思うの？", translation: "왜 그렇게 생각해?" },
      { id: "f.op.always", text: "前からそう思ってた？", translation: "전부터 그렇게 생각했어?" },
      { id: "f.op.change", text: "変えるとしたら何を変えたい？", translation: "바꾼다면 뭘 바꾸고 싶어?" },
    ],
    describe: [
      { id: "f.desc.like", text: "どんなところが一番好き？", translation: "어떤 점이 제일 좋아?" },
      { id: "f.desc.diff", text: "前とどう違う？", translation: "예전이랑 뭐가 달라?" },
      { id: "f.desc.more", text: "もうちょっと詳しく教えて。", translation: "조금 더 자세히 얘기해 줘." },
    ],
  },
};

const BANKS: Record<string, PackBank> = { en: EN, ja: JA };

/** The questions a language's packs are made of, or null where there are none yet. */
export function packBankFor(language: string): PackBank | null {
  return BANKS[language] ?? null;
}

/** Languages a daily pack can be made in. */
export function packLanguages(): string[] {
  return Object.keys(BANKS);
}
