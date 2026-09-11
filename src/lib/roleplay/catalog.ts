import type { RoleplayScenario, SentenceBank } from "./script.ts";

/**
 * Tutor sentences, keyed for reuse.
 *
 * Separate from the scenarios because a café says "What size?" in every script
 * it appears in, and recording it once per script would be paying repeatedly for
 * the same eight seconds. Anything written here can be pointed at from anywhere.
 *
 * Written to be spoken: short turns, contractions, the things people say when
 * they hand over a coffee rather than the things a textbook prints.
 */
export const SENTENCES: Record<string, SentenceBank> = {
  en: {
    // --- Just talk. No errand, so only the opening and the goodbye are
    // written; everything between is the director's.
    "open.hi": {
      text: "Hey! Good to see you. How's your day going?",
      translation: "안녕! 반가워. 오늘 하루 어때?",
    },
    "open.bye": {
      text: "Alright — it was really nice talking to you. See you next time!",
      translation: "좋아, 얘기 즐거웠어. 다음에 또 봐!",
    },
    "cafe.greet": {
      text: "Hi there! What can I get you?",
      translation: "안녕하세요! 뭐 드릴까요?",
    },
    "cafe.size": {
      text: "Sure. What size — small or large?",
      translation: "네. 사이즈는 스몰이요, 라지요?",
    },
    "cafe.milk-yes": {
      text: "We do, yeah. Oat, soy, whole — whatever you like.",
      translation: "네, 있어요. 오트, 두유, 일반 우유 다 됩니다.",
    },
    "cafe.here-or-to-go": {
      text: "Got it. For here or to go?",
      translation: "알겠습니다. 드시고 가세요, 가져가세요?",
    },
    "cafe.total": {
      text: "That'll be four fifty. Card or cash?",
      translation: "4달러 50센트입니다. 카드요, 현금이요?",
    },
    "cafe.closing": {
      text: "Perfect. It'll be right up — have a good one!",
      translation: "좋아요. 금방 나옵니다. 좋은 하루 보내세요!",
    },
    // Recovery. Cheap, in character, and it buys a retry without waking anyone.
    "cafe.pardon": {
      text: "Sorry, what was that?",
      translation: "죄송해요, 뭐라고 하셨죠?",
    },
    // Corrections. Written in advance because most misses at a given turn are
    // the same miss — which is what the situation briefs record. Generated with
    // every other line and free to play.
    "cafe.fix-order": {
      text: "No rush. Can I get you a latte? Or a coffee?",
      translation:
        '천천히 보세요. 라떼 드릴까요, 커피 드릴까요?  ·  "Can I get a latte, please."라고 하면 됩니다.',
    },
    "cafe.fix-size": {
      text: "Sorry — small, or large?",
      translation:
        '죄송해요, 스몰이요 라지요?  ·  "Small" 또는 "Large" 한 단어면 됩니다.',
    },
    "cafe.fix-here": {
      text: "Are you drinking it here? Or is it to go?",
      translation:
        '여기서 드시고 가세요? 아니면 가져가세요?  ·  매장에서 드시면 "For here", 가져가시면 "To go"예요.',
    },
    "cafe.fix-payment": {
      text: "Sorry — card, or cash?",
      translation:
        '죄송해요, 카드요 현금이요?  ·  "Card, please."라고 답하면 됩니다.',
    },
    // --- Ordering a meal. The trouble the brief names is wanting to ask what is
    // in a dish and having no phrase for it, so the correction hands one over
    // instead of asking them to try the order again.
    "restaurant.greet": {
      text: "Are you ready to order, or do you need another minute?",
      translation: "주문하시겠어요, 아니면 조금 더 보시겠어요?",
    },
    "restaurant.dish-answer": {
      text: "The chicken? It's grilled, with potatoes and a bit of garlic. Not spicy at all.",
      translation: "치킨이요? 구운 거고요, 감자랑 마늘이 조금 들어가요. 안 매워요.",
    },
    "restaurant.sides": {
      text: "Good choice. Fries or salad with that?",
      translation: "좋은 선택이에요. 감자튀김이랑 샐러드 중에 뭐로 드릴까요?",
    },
    "restaurant.drinks": {
      text: "Got it. And anything to drink?",
      translation: "알겠습니다. 음료는 어떻게 하시겠어요?",
    },
    "restaurant.confirm": {
      text: "Perfect. I'll get that started for you.",
      translation: "좋습니다. 바로 준비해 드릴게요.",
    },
    "restaurant.pardon": {
      text: "Sorry, I didn't catch that.",
      translation: "죄송해요, 못 들었어요.",
    },
    "restaurant.fix-order": {
      text: "Take your time. Can I get you the chicken? Or shall I tell you what's in it?",
      translation:
        '천천히 보세요. 치킨으로 드릴까요? 아니면 뭐가 들었는지 말씀드릴까요?  ·  "I\'ll have the chicken, please."로 주문하거나 "What\'s in it?"이라고 물어보세요.',
    },
    "restaurant.fix-sides": {
      text: "Sorry — fries, or salad?",
      translation:
        '죄송해요, 감자튀김이요 샐러드요?  ·  "Fries" 또는 "Salad" 한 단어면 됩니다.',
    },
    "restaurant.fix-drinks": {
      text: "Something to drink? Water, maybe?",
      translation:
        '음료는요? 물 드릴까요?  ·  "Water\'s fine, thanks."라고 하면 됩니다.',
    },
    // --- Asking the way. The trouble is nodding through directions nobody
    // understood, so the branch that asks for them again is the lesson rather
    // than a detour: it rejoins the same question once the line has repeated.
    "directions.greet": {
      text: "You look a bit lost. Are you looking for somewhere?",
      translation: "길 잃으셨어요? 어디 찾으세요?",
    },
    "directions.give": {
      text: "Sure. Go straight down this road, past the traffic lights, and it's on your left.",
      translation: "네. 이 길로 쭉 가시다가 신호등을 지나면 왼쪽에 있어요.",
    },
    "directions.repeat": {
      text: "Of course. Straight down, past the lights, then it's on your left.",
      translation: "그럼요. 쭉 가서, 신호등 지나서, 왼쪽이에요.",
    },
    "directions.right": {
      text: "That's it. You've got it.",
      translation: "맞아요. 제대로 이해하셨네요.",
    },
    "directions.far-answer": {
      text: "Ten minutes, maybe. Easy walk. Good luck!",
      translation: "한 10분쯤이요. 걸어갈 만해요. 잘 찾으세요!",
    },
    "directions.pardon": {
      text: "Sorry, say that again?",
      translation: "네? 다시 말씀해 주시겠어요?",
    },
    "directions.fix-ask": {
      text: "Where is it you're trying to get to? The station, maybe?",
      translation:
        '어디로 가시려는 거예요? 역이요?  ·  "How do I get to the station?"처럼 물어보면 됩니다.',
    },
    "directions.fix-confirm": {
      text: "So that's straight on, then left. Got it? Or shall I say it again?",
      translation:
        '그러니까 쭉 가서 왼쪽이요. 아시겠어요? 다시 말해 드릴까요?  ·  들은 대로 "So, straight on, then left?"라고 확인하거나 "Could you say that again?"이라고 하세요.',
    },
    "directions.fix-far": {
      text: "Is it far? Is that what you wanted to ask?",
      translation:
        '먼지 궁금하신 거예요?  ·  "Is it far?" 또는 "Can I walk there?"라고 물어보면 됩니다.',
    },
    // --- Trying something on. Asking for a size without naming the item is the
    // miss the brief records, so the correction is about the words that are
    // missing rather than about the size.
    "shop.greet": {
      text: "Hi! Let me know if you need a hand with anything.",
      translation: "안녕하세요! 필요한 거 있으면 말씀해 주세요.",
    },
    "shop.price": {
      text: "That one's thirty-five.",
      translation: "그건 35달러예요.",
    },
    "shop.check": {
      text: "Let me have a look... yes, we've got a medium. Want to try it on?",
      translation: "한번 볼게요... 네, 미디엄 있어요. 입어보실래요?",
    },
    "shop.fitting": {
      text: "The fitting rooms are just behind you, on the right.",
      translation: "탈의실은 바로 뒤쪽 오른편에 있어요.",
    },
    "shop.close": {
      text: "No problem at all. I'll be at the till whenever you're ready.",
      translation: "네, 괜찮습니다. 계산대에 있을 테니 준비되시면 오세요.",
    },
    // Word for word the café's, and therefore the same recording. A shop
    // assistant and a barista say this identically, which is what keying the
    // bank by content rather than by scenario is for.
    "shop.pardon": {
      text: "Sorry, what was that?",
      translation: "죄송해요, 뭐라고 하셨죠?",
    },
    "shop.fix-ask": {
      text: "Which one is it? Do you have this in a medium, is that it?",
      translation:
        '어떤 거요? 이거 미디엄 있냐는 말씀이신가요?  ·  어떤 옷인지 함께 말해 주세요. "Do you have this in a medium?"처럼요.',
    },
    "shop.fix-try": {
      text: "Do you want to try it on? Yes, please — or no thanks?",
      translation:
        '입어보실래요? 네, 아니면 괜찮으세요?  ·  "Yes, please." 또는 "No thanks."라고 하면 됩니다.',
    },
    "shop.fix-decide": {
      text: "How was it? I'll take it — or was it a bit tight?",
      translation:
        '어떠셨어요? 사시겠어요, 아니면 좀 꽉 끼던가요?  ·  "I\'ll take it." 또는 "It\'s a bit tight."라고 하면 됩니다.',
    },
    // --- Checking in. The brief's trouble is being asked for a document and not
    // catching which one, so asking back is written in as a branch: it is the
    // thing a learner should do, and here it is answered rather than penalised.
    "hotel.greet": {
      text: "Good afternoon! Are you checking in?",
      translation: "안녕하세요! 체크인하시나요?",
    },
    "hotel.ask-id": {
      text: "Thank you. Could I see your passport, please?",
      translation: "감사합니다. 여권 좀 보여 주시겠어요?",
    },
    "hotel.id-repeat": {
      text: "Your passport, yes — just for the check-in.",
      translation: "네, 여권이요. 체크인 확인용입니다.",
    },
    "hotel.breakfast": {
      text: "Perfect. You're in room 412, and breakfast is downstairs.",
      translation: "좋습니다. 412호이시고, 조식은 아래층입니다.",
    },
    "hotel.answer": {
      text: "Seven to ten, just past the lift. Here's your key — enjoy your stay!",
      translation:
        "7시부터 10시까지고, 엘리베이터 지나서 있어요. 키 여기 있습니다. 즐겁게 지내세요!",
    },
    "hotel.pardon": {
      text: "Sorry, could you say that again?",
      translation: "죄송해요, 다시 말씀해 주시겠어요?",
    },
    "hotel.fix-name": {
      text: "What's the name it's under? Kim, perhaps?",
      translation:
        '어느 성함으로 예약하셨어요? Kim이신가요?  ·  "It\'s under Kim."처럼 예약자 이름만 말하면 됩니다.',
    },
    "hotel.fix-id": {
      text: "Your passport, if you have it — here you are, and I'll be quick.",
      translation:
        '여권 있으시면 주세요. 금방 확인해 드릴게요.  ·  여권을 달라는 거예요. "Here you are."라고 하며 건네면 됩니다.',
    },
    "hotel.fix-breakfast": {
      text: "Was there anything else? What time is breakfast, maybe?",
      translation:
        '더 궁금하신 거 있으세요? 조식 시간이요?  ·  "What time is breakfast?"라고 물어보면 됩니다.',
    },
    // --- A taxi. The scenario exists for its last turn: the brief says people
    // cannot say "here is fine" at the moment they need it, so that node is the
    // one left without a scripted "sorry?".
    "taxi.greet": {
      text: "Evening. Where are you headed?",
      translation: "안녕하세요. 어디로 모실까요?",
    },
    "taxi.price": {
      text: "Should be about fifteen, depending on the traffic.",
      translation: "한 15달러쯤 나올 거예요. 차 막히는 정도에 따라 다르고요.",
    },
    "taxi.route": {
      text: "Right. The motorway's quicker but there's a toll — is that alright?",
      translation: "네. 고속도로가 빠른데 통행료가 있어요. 괜찮으세요?",
    },
    "taxi.arriving": {
      text: "Okay, we're on the street now. Whereabouts do you want me to stop?",
      translation: "자, 이제 그 길에 들어왔어요. 어디에 세워 드릴까요?",
    },
    "taxi.close": {
      text: "No problem. That's fifteen even. Have a good evening!",
      translation: "네. 15달러입니다. 좋은 저녁 보내세요!",
    },
    "taxi.pardon": {
      text: "Sorry, what was that?",
      translation: "죄송해요, 뭐라고 하셨죠?",
    },
    "taxi.fix-dest": {
      text: "Where to? The central station? Or have you got an address for me?",
      translation:
        '어디로 갈까요? 중앙역이요? 아니면 주소 있으세요?  ·  "Can you take me to the central station."처럼 말하면 됩니다.',
    },
    "taxi.fix-route": {
      text: "That's fine? Or would you rather I took the normal road?",
      translation:
        '괜찮으세요? 아니면 일반 도로로 갈까요?  ·  "That\'s fine." 또는 "The normal road, please."라고 하면 됩니다.',
    },
    "taxi.fix-stop": {
      text: "Just say when. Here is fine? Or a bit further?",
      translation:
        '말씀만 하세요. 여기 세울까요, 좀 더 갈까요?  ·  "Here is fine."이라고 하면 됩니다.',
    },
    // --- Meeting someone new. The only one here that is not an errand, and the
    // one whose trouble is silence rather than a missing word: the brief says
    // people run out after the name and the job, so the last node asks for a
    // question back and its correction is what to ask.
    // Mina is named in the greeting rather than later, because the branch that
    // asks how the tutor knows everyone has to be a question the learner could
    // actually have thought of by then.
    "intro.greet": {
      text: "Hey — I don't think we've met. I'm Sam, one of Mina's friends.",
      translation: "안녕하세요, 처음 뵙는 것 같네요. 저는 Sam이고 미나 친구예요.",
    },
    "intro.job-q": {
      text: "Nice to meet you. So what do you do?",
      translation: "반가워요. 무슨 일 하세요?",
    },
    "intro.host": {
      text: "Most people here, through Mina. We used to work together, years ago.",
      translation: "여기 대부분 미나를 통해서요. 예전에 같이 일했었어요.",
    },
    "intro.job-answer": {
      text: "Oh, nice. I'm in design — mostly websites. Are you here with Mina too?",
      translation:
        "아, 좋네요. 저는 디자인 쪽이에요. 주로 웹사이트요. 미나랑 같이 오셨어요?",
    },
    "intro.close": {
      text: "Ha, small world. Come on, let me get you a drink.",
      translation: "하, 세상 좁네요. 자, 마실 것 좀 가져다 드릴게요.",
    },
    "intro.pardon": {
      text: "Sorry, I didn't catch that.",
      translation: "죄송해요, 못 들었어요.",
    },
    "intro.fix-name": {
      text: "Sorry, I didn't catch your name — I'm Sam, and you are?",
      translation:
        '죄송해요, 성함을 못 들었어요. 저는 Sam이에요.  ·  "Hi, I\'m Jisoo."처럼 이름만 말해도 됩니다.',
    },
    "intro.fix-job": {
      text: "Work, study, something else? I work in design, myself.",
      translation:
        '일하세요, 공부하세요? 저는 디자인 쪽이에요.  ·  "I work at a bank." 또는 "I\'m a student."처럼 짧게요.',
    },
    // A correction has to name something the node will actually accept, or it
    // hands the learner a sentence and then refuses it.
    "intro.fix-common": {
      text: "How do you know her, then? Or did you come with someone?",
      translation:
        '미나는 어떻게 아세요? 아니면 누구랑 오셨어요?  ·  "How do you know her?" 또는 "What about you?"라고 되물어 보세요.',
    },
  },
};

/**
 * The scenarios, one graph per situation.
 *
 * `onMiss` points at a scripted recovery wherever one makes sense, so a mumble
 * costs a repeated line rather than a live tutor. Where it is left out, the
 * tutor is what happens — which is the arrangement in miniature: the script
 * covers what it can and the tutor handles the edges.
 */
export const SCENARIOS: RoleplayScenario[] = [
  // First, because it is the one that asks nothing of the learner up front: no
  // topic to pick, just a person to talk to.
  {
    id: "open-talk",
    language: "en",
    voice: "marin",
    title: "Just talk",
    setting:
      "A relaxed catch-up with a friendly acquaintance over coffee, with no errand to finish. The tutor is someone easy to talk to and curious about the learner's day, plans and interests; the learner can bring up anything at all.",
    tutorRole: "friend",
    openEnded: true,
    start: "hi",
    nodes: {
      hi: { type: "tutor", id: "hi", say: "open.hi", next: "talk" },
      talk: {
        type: "learner",
        id: "talk",
        goal: "편하게 아무 얘기나 해 보세요.",
        // Only the way out is scripted. Everything else the learner says is
        // the conversation, and goes to the director.
        expect: [
          {
            match: [
              "goodbye",
              "i have to go",
              "i gotta go",
              "talk to you later",
              "see you later",
            ],
            go: "bye",
          },
        ],
      },
      bye: { type: "tutor", id: "bye", say: "open.bye", next: null },
    },
  },
  {
    id: "cafe-order",
    language: "en",
    voice: "coral",
    title: "Ordering at a café",
    setting:
      "A small café at mid-morning. The tutor is the barista behind the counter; the learner is a customer who has just walked in. It is not busy, so the barista has time to be friendly and to repeat things.",
    tutorRole: "barista",
    start: "greet",
    nodes: {
      greet: { type: "tutor", id: "greet", say: "cafe.greet", next: "order" },
      order: {
        type: "learner",
        id: "order",
        goal: "마시고 싶은 것을 주문하세요.",
        hint: '"Can I get ~" 또는 "I\'ll have ~"로 시작하면 자연스러워요.',
        expect: [
          // The specific before the general: asking about milk is also an order
          // in most phrasings, and would be swallowed by the drink branch.
          {
            match: ["oat milk", "soy milk", "do you have milk", "any milk"],
            go: "milk-answer",
          },
          {
            match: [
              "can I get a coffee",
              "i'll have a latte",
              "a latte please",
              "could I have an americano",
              "one coffee please",
              // Bare nouns, because an order is usually just the drink. A long
              // phrasing needs most of its words back to clear the threshold,
              // so "one americano" would miss "could I have an americano".
              "latte",
              "coffee",
              "americano",
              "tea",
            ],
            go: "size",
          },
        ],
        onMiss: "pardon-order",
        correction: "cafe.fix-order",
      },
      // A branch that rejoins: the milk question is answered and the order
      // carries on where it left off, so it costs one sentence, not a new path.
      "milk-answer": {
        type: "tutor",
        id: "milk-answer",
        say: "cafe.milk-yes",
        next: "order",
      },
      "pardon-order": {
        type: "tutor",
        id: "pardon-order",
        say: "cafe.pardon",
        next: "order",
      },
      size: { type: "tutor", id: "size", say: "cafe.size", next: "size-answer" },
      "size-answer": {
        type: "learner",
        id: "size-answer",
        goal: "사이즈를 고르세요.",
        expect: [
          {
            match: ["small", "large", "small please", "large please", "a small one"],
            go: "here-or-to-go",
          },
        ],
        onMiss: "pardon-size",
        correction: "cafe.fix-size",
      },
      "pardon-size": {
        type: "tutor",
        id: "pardon-size",
        say: "cafe.pardon",
        next: "size-answer",
      },
      "here-or-to-go": {
        type: "tutor",
        id: "here-or-to-go",
        say: "cafe.here-or-to-go",
        next: "here-answer",
      },
      "here-answer": {
        type: "learner",
        id: "here-answer",
        goal: "매장에서 마실지 가져갈지 답하세요.",
        hint: '매장에서 마시면 "For here", 가져가면 "To go"예요.',
        expect: [
          {
            match: [
              "for here",
              "to go",
              "take away",
              "takeaway",
              "eat in",
              "i'll drink it here",
            ],
            go: "total",
          },
        ],
        // No onMiss: a miss here goes straight to the correction, because the
        // trouble is known and the answer is one written sentence.
        correction: "cafe.fix-here",
      },
      total: { type: "tutor", id: "total", say: "cafe.total", next: "payment" },
      payment: {
        type: "learner",
        id: "payment",
        goal: "결제 방법을 말하세요.",
        expect: [
          {
            match: ["card", "by card", "cash", "i'll pay by card", "credit card"],
            go: "closing",
          },
        ],
        onMiss: "pardon-payment",
        correction: "cafe.fix-payment",
      },
      "pardon-payment": {
        type: "tutor",
        id: "pardon-payment",
        say: "cafe.pardon",
        next: "payment",
      },
      closing: { type: "tutor", id: "closing", say: "cafe.closing", next: null },
    },
  },
  {
    id: "restaurant-order",
    language: "en",
    voice: "sage",
    title: "Ordering a meal",
    setting:
      "A restaurant table, menus already handed out. The tutor is the server coming back to take the order; the learner has read the menu but not decided everything.",
    tutorRole: "server",
    start: "greet",
    nodes: {
      greet: {
        type: "tutor",
        id: "greet",
        say: "restaurant.greet",
        next: "order",
      },
      order: {
        type: "learner",
        id: "order",
        goal: "먹고 싶은 메뉴를 주문하세요.",
        hint: '"I\'ll have ~" 또는 "Can I get ~"로 시작하면 자연스러워요.',
        expect: [
          // Written as the invariant head of the sentence rather than the whole
          // of it: matching scores how much of a phrasing was heard, so "I'll
          // have the" carries over to every dish on the menu and "I'll have the
          // chicken" would half-fail on the salmon.
          {
            match: [
              "what is in it",
              "what's in it",
              // Short enough to survive "what is in the chicken", where the
              // longer phrasing above loses a word and drops under the bar.
              "what is in",
              "does it come with",
              "is it spicy",
            ],
            go: "dish-answer",
          },
          {
            match: [
              "i'll have the",
              "can I get the",
              "i'd like the",
              "i'll take the",
              // Naming the dish alone is the commonest answer of all. These tie
              // with "what is in" on a question like "what is in the chicken",
              // and ties keep the earlier branch, so the question still wins.
              "chicken",
              "pasta",
              "steak",
              "salmon",
            ],
            go: "sides",
          },
        ],
        // No onMiss. The brief says the miss here is a missing phrase rather
        // than a mumble, and "sorry?" does not hand anyone a phrase.
        correction: "restaurant.fix-order",
      },
      "dish-answer": {
        type: "tutor",
        id: "dish-answer",
        say: "restaurant.dish-answer",
        next: "order",
      },
      sides: {
        type: "tutor",
        id: "sides",
        say: "restaurant.sides",
        next: "sides-answer",
      },
      "sides-answer": {
        type: "learner",
        id: "sides-answer",
        goal: "감자튀김과 샐러드 중에 고르세요.",
        expect: [
          {
            match: ["fries", "salad", "just fries", "the salad please"],
            go: "drinks",
          },
        ],
        onMiss: "pardon-sides",
        correction: "restaurant.fix-sides",
      },
      "pardon-sides": {
        type: "tutor",
        id: "pardon-sides",
        say: "restaurant.pardon",
        next: "sides-answer",
      },
      drinks: {
        type: "tutor",
        id: "drinks",
        say: "restaurant.drinks",
        next: "drinks-answer",
      },
      "drinks-answer": {
        type: "learner",
        id: "drinks-answer",
        goal: "음료를 정하거나 필요 없다고 말하세요.",
        expect: [
          {
            match: [
              "water",
              "a glass of wine",
              "a beer",
              "just a coke",
              // Declining is half the answers to "anything to drink?", and not
              // one of these was accepted before.
              "nothing for me",
              "nothing",
              "no thanks",
              "i'm good",
              "no drinks",
            ],
            go: "confirm",
          },
        ],
        onMiss: "pardon-drinks",
        correction: "restaurant.fix-drinks",
      },
      "pardon-drinks": {
        type: "tutor",
        id: "pardon-drinks",
        say: "restaurant.pardon",
        next: "drinks-answer",
      },
      confirm: {
        type: "tutor",
        id: "confirm",
        say: "restaurant.confirm",
        next: null,
      },
    },
  },
  {
    id: "directions",
    language: "en",
    voice: "echo",
    title: "Asking the way",
    setting:
      "A street corner. The tutor is a local who is happy to help but walking somewhere; the learner is lost and holding a phone.",
    tutorRole: "passer-by",
    start: "greet",
    nodes: {
      greet: {
        type: "tutor",
        id: "greet",
        say: "directions.greet",
        next: "ask",
      },
      ask: {
        type: "learner",
        id: "ask",
        goal: "찾는 곳이 어디인지 물어보세요.",
        hint: '"How do I get to ~?"가 가장 무난합니다.',
        expect: [
          {
            match: [
              "how do I get to",
              "where is the",
              "i'm looking for",
              "how can I get to",
            ],
            go: "give",
          },
        ],
        onMiss: "pardon-ask",
        correction: "directions.fix-ask",
      },
      "pardon-ask": {
        type: "tutor",
        id: "pardon-ask",
        say: "directions.pardon",
        next: "ask",
      },
      give: {
        type: "tutor",
        id: "give",
        say: "directions.give",
        next: "confirm-back",
      },
      "confirm-back": {
        type: "learner",
        id: "confirm-back",
        goal: "들은 길을 다시 말해 확인하세요. 못 들었으면 다시 말해 달라고 하세요.",
        expect: [
          // Asking for the directions again is the skill this scenario exists to
          // teach, so it is a branch that rejoins rather than a miss. The brief's
          // trouble is nodding through, and this is the sentence that stops it.
          {
            match: [
              "could you say that again",
              "say that again",
              "can you repeat that",
              "one more time",
              "sorry, again",
            ],
            go: "repeat",
          },
          {
            match: [
              "straight on then left",
              "straight and then left",
              "past the lights",
              "then turn left",
              "so I go straight",
            ],
            go: "right",
          },
        ],
        correction: "directions.fix-confirm",
      },
      repeat: {
        type: "tutor",
        id: "repeat",
        say: "directions.repeat",
        next: "confirm-back",
      },
      right: {
        type: "tutor",
        id: "right",
        say: "directions.right",
        next: "far-question",
      },
      "far-question": {
        type: "learner",
        id: "far-question",
        goal: "걸어갈 만한 거리인지 물어보세요.",
        expect: [
          {
            match: [
              "is it far",
              "can I walk",
              "how long does it take",
              "is it walking distance",
            ],
            go: "far-answer",
          },
        ],
        onMiss: "pardon-far",
        correction: "directions.fix-far",
      },
      "pardon-far": {
        type: "tutor",
        id: "pardon-far",
        say: "directions.pardon",
        next: "far-question",
      },
      "far-answer": {
        type: "tutor",
        id: "far-answer",
        say: "directions.far-answer",
        next: null,
      },
    },
  },
  {
    id: "shop-size",
    language: "en",
    voice: "shimmer",
    title: "Trying something on",
    setting:
      "A clothing shop. The tutor works there; the learner is holding something in the wrong size.",
    tutorRole: "shop assistant",
    start: "greet",
    nodes: {
      greet: { type: "tutor", id: "greet", say: "shop.greet", next: "ask-size" },
      "ask-size": {
        type: "learner",
        id: "ask-size",
        goal: "다른 사이즈가 있는지 물어보세요. 어떤 옷인지도 함께요.",
        hint: '"Do you have this in a medium?"처럼 물어보세요.',
        expect: [
          {
            match: ["how much is this", "how much is it", "what's the price"],
            go: "price-answer",
          },
          {
            match: [
              "do you have this in",
              "have you got this in",
              "is this in a",
              "do you have a bigger",
              "another size",
              "a bigger one",
              "a smaller one",
              "in a medium",
            ],
            go: "check",
          },
        ],
        // No onMiss. The miss here is a sentence with the item left out, and the
        // correction is exactly the half that was missing.
        correction: "shop.fix-ask",
      },
      "price-answer": {
        type: "tutor",
        id: "price-answer",
        say: "shop.price",
        next: "ask-size",
      },
      check: {
        type: "tutor",
        id: "check",
        say: "shop.check",
        next: "try-answer",
      },
      "try-answer": {
        type: "learner",
        id: "try-answer",
        goal: "입어보겠다고 하거나, 그냥 사겠다고 답하세요.",
        expect: [
          {
            match: [
              "yes please",
              "can I try it on",
              "sure",
              "yes",
              "okay",
              "no thanks",
              "i'm good",
              "it's ok",
            ],
            go: "fitting",
          },
        ],
        onMiss: "pardon-try",
        correction: "shop.fix-try",
      },
      "pardon-try": {
        type: "tutor",
        id: "pardon-try",
        say: "shop.pardon",
        next: "try-answer",
      },
      fitting: {
        type: "tutor",
        id: "fitting",
        say: "shop.fitting",
        next: "decide",
      },
      decide: {
        type: "learner",
        id: "decide",
        goal: "맞는지 말하고, 살지 말지 정하세요.",
        expect: [
          {
            match: [
              "i'll take it",
              "i'll buy it",
              "i like it",
              "too tight",
              "it fits",
              "it's a bit tight",
              "it doesn't fit",
              "i'll leave it",
            ],
            go: "close",
          },
        ],
        onMiss: "pardon-decide",
        correction: "shop.fix-decide",
      },
      "pardon-decide": {
        type: "tutor",
        id: "pardon-decide",
        say: "shop.pardon",
        next: "decide",
      },
      // One ending for both outcomes, because "I'll take it" and "it doesn't
      // fit" are the same moment from behind the counter.
      close: { type: "tutor", id: "close", say: "shop.close", next: null },
    },
  },
  {
    id: "hotel-checkin",
    language: "en",
    voice: "nova",
    title: "Checking into a hotel",
    setting:
      "A hotel front desk in the afternoon. The tutor is the receptionist; the learner has a booking on their phone.",
    tutorRole: "receptionist",
    start: "greet",
    nodes: {
      greet: { type: "tutor", id: "greet", say: "hotel.greet", next: "name" },
      name: {
        type: "learner",
        id: "name",
        goal: "예약한 이름을 말하세요.",
        hint: '"I have a booking under ~" 또는 "It\'s under ~"',
        expect: [
          {
            match: [
              "i have a booking under",
              "the name is",
              "my name is",
              "it's under",
              "under",
              "i booked under",
            ],
            go: "ask-id",
          },
        ],
        onMiss: "pardon-name",
        correction: "hotel.fix-name",
      },
      "pardon-name": {
        type: "tutor",
        id: "pardon-name",
        say: "hotel.pardon",
        next: "name",
      },
      "ask-id": {
        type: "tutor",
        id: "ask-id",
        say: "hotel.ask-id",
        next: "id-answer",
      },
      "id-answer": {
        type: "learner",
        id: "id-answer",
        goal: "여권을 건네며 답하세요. 뭘 달라는지 못 알아들었으면 되물어 보세요.",
        expect: [
          // Asking which document is the right move, not a failure, so it is
          // answered and rejoins. The brief's trouble is not catching which one,
          // and a repeated "sorry?" is the single thing that would not help.
          {
            match: [
              "sorry what do you need",
              "which one",
              "do you need my passport",
              "what document",
            ],
            go: "id-repeat",
          },
          {
            match: [
              "here you are",
              "here it is",
              "here you go",
              "of course",
              // Handing something over is mostly done with a word, not a
              // sentence. "Sure", "yes" and "here" were all refused.
              "sure",
              "yes",
              "here",
              "okay",
            ],
            go: "breakfast-info",
          },
        ],
        correction: "hotel.fix-id",
      },
      "id-repeat": {
        type: "tutor",
        id: "id-repeat",
        say: "hotel.id-repeat",
        next: "id-answer",
      },
      "breakfast-info": {
        type: "tutor",
        id: "breakfast-info",
        say: "hotel.breakfast",
        next: "breakfast-q",
      },
      "breakfast-q": {
        type: "learner",
        id: "breakfast-q",
        goal: "조식 시간이나 방에 대해 하나 물어보세요.",
        expect: [
          {
            match: [
              "what time is breakfast",
              "when does breakfast start",
              "where is breakfast",
              "is breakfast included",
              "breakfast time",
              "what time",
            ],
            go: "answer",
          },
        ],
        onMiss: "pardon-breakfast",
        correction: "hotel.fix-breakfast",
      },
      "pardon-breakfast": {
        type: "tutor",
        id: "pardon-breakfast",
        say: "hotel.pardon",
        next: "breakfast-q",
      },
      answer: {
        type: "tutor",
        id: "answer",
        say: "hotel.answer",
        next: null,
      },
    },
  },
  {
    id: "taxi",
    language: "en",
    voice: "onyx",
    title: "Taking a taxi",
    setting:
      "The back of a taxi that has just pulled over. The tutor is the driver; the learner has an address written down.",
    tutorRole: "driver",
    start: "greet",
    nodes: {
      greet: {
        type: "tutor",
        id: "greet",
        say: "taxi.greet",
        next: "destination",
      },
      destination: {
        type: "learner",
        id: "destination",
        goal: "어디로 가는지 말하세요.",
        hint: '"Can you take me to ~?" 또는 "This address, please."',
        expect: [
          {
            match: [
              "how much will it be",
              "how much is it to",
              "roughly how much",
            ],
            go: "price-answer",
          },
          {
            match: [
              "can you take me to",
              "i'm going to",
              "this address please",
              "could you take me to",
              // So that answering the driver's own question with just the place
              // works, which is what a person actually says.
              "the central station",
              "the address",
              "the airport",
              "the station",
            ],
            go: "route",
          },
        ],
        onMiss: "pardon-dest",
        correction: "taxi.fix-dest",
      },
      "price-answer": {
        type: "tutor",
        id: "price-answer",
        say: "taxi.price",
        next: "destination",
      },
      "pardon-dest": {
        type: "tutor",
        id: "pardon-dest",
        say: "taxi.pardon",
        next: "destination",
      },
      route: {
        type: "tutor",
        id: "route",
        say: "taxi.route",
        next: "route-answer",
      },
      "route-answer": {
        type: "learner",
        id: "route-answer",
        goal: "그 길로 가도 되는지 답하세요.",
        expect: [
          {
            match: [
              "that's fine",
              "yes",
              "yeah",
              "sure",
              "okay",
              "fine",
              "it's ok",
              "no problem",
              "go ahead",
              "the normal road",
              "whichever is faster",
            ],
            go: "arriving",
          },
        ],
        onMiss: "pardon-route",
        correction: "taxi.fix-route",
      },
      "pardon-route": {
        type: "tutor",
        id: "pardon-route",
        say: "taxi.pardon",
        next: "route-answer",
      },
      arriving: {
        type: "tutor",
        id: "arriving",
        say: "taxi.arriving",
        next: "stop",
      },
      stop: {
        type: "learner",
        id: "stop",
        goal: "여기서 세워 달라고 말하세요.",
        expect: [
          {
            match: [
              "here is fine",
              "just here please",
              "anywhere here",
              "you can stop here",
              "stop here",
              "this is fine",
              "right here",
              "here",
            ],
            go: "close",
          },
        ],
        // The turn the whole scenario is built around: the brief says people
        // cannot say this at the moment they need it, so a miss goes straight to
        // the sentence rather than round another "sorry?".
        correction: "taxi.fix-stop",
      },
      close: { type: "tutor", id: "close", say: "taxi.close", next: null },
    },
  },
  {
    id: "introducing-yourself",
    language: "en",
    voice: "verse",
    title: "Meeting someone new",
    setting:
      "A party where the learner knows one person. The tutor is a stranger who has just said hello.",
    tutorRole: "someone at a gathering",
    start: "greet",
    nodes: {
      greet: { type: "tutor", id: "greet", say: "intro.greet", next: "name" },
      name: {
        type: "learner",
        id: "name",
        goal: "이름을 말하고 인사하세요.",
        expect: [
          {
            match: [
              "i'm",
              "my name is",
              "nice to meet you",
              "hi i'm",
              "hi",
              "hello",
              "hey",
            ],
            go: "job-q",
          },
        ],
        onMiss: "pardon-name",
        correction: "intro.fix-name",
      },
      "pardon-name": {
        type: "tutor",
        id: "pardon-name",
        say: "intro.pardon",
        next: "name",
      },
      "job-q": { type: "tutor", id: "job-q", say: "intro.job-q", next: "job" },
      job: {
        type: "learner",
        id: "job",
        goal: "무슨 일을 하는지 말하세요.",
        expect: [
          {
            match: [
              "do you know many people here",
              "how do you know everyone",
              "do you know everyone here",
            ],
            go: "host-answer",
          },
          {
            match: [
              "i work",
              "i'm a",
              "i'm studying",
              "i work at",
              "i study",
              "a student",
              "a designer",
            ],
            go: "job-answer",
          },
        ],
        onMiss: "pardon-job",
        correction: "intro.fix-job",
      },
      "pardon-job": {
        type: "tutor",
        id: "pardon-job",
        say: "intro.pardon",
        next: "job",
      },
      "host-answer": {
        type: "tutor",
        id: "host-answer",
        say: "intro.host",
        next: "job",
      },
      "job-answer": {
        type: "tutor",
        id: "job-answer",
        say: "intro.job-answer",
        next: "common",
      },
      common: {
        type: "learner",
        id: "common",
        goal: "공통점을 말하거나, 상대에게 하나 되물어 보세요.",
        expect: [
          {
            match: [
              "yes we work together",
              "we work together",
              "i came with her",
              "we're old friends",
              "a friend",
              "what about you",
              "and you",
              "how do you know her",
            ],
            go: "close",
          },
        ],
        // Running out after the name and the job is the brief's trouble, and a
        // "sorry?" here would only ask them to run out again.
        correction: "intro.fix-common",
      },
      close: { type: "tutor", id: "close", say: "intro.close", next: null },
    },
  },
];

export function sentencesFor(language: string): SentenceBank {
  return SENTENCES[language] ?? {};
}

export function scenariosForLanguage(language: string): RoleplayScenario[] {
  return SCENARIOS.filter((scenario) => scenario.language === language);
}

export function findScenario(id: string): RoleplayScenario | null {
  return SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}
