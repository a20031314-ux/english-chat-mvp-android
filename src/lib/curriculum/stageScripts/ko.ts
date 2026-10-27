import type { StageScript } from "../stageScripts.ts";

/** ko 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현 대본(x), 대본마다 쓰는 핵심 표현. Claude가 쓰고 한 번 다시 고침, 원어민 확인 전. */
export const KO: StageScript[] = [
  {
    "id": "ko-1-1",
    "name": {
      "text": [
        "루카스"
      ],
      "en": [
        "Lucas"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "Meeting someone new at a language exchange",
      "ko": "언어 교환 모임에서 처음 만난 사람과 인사하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요! 여기 처음 오셨어요?",
        "gloss": {
          "en": "Hi! Is this your first time here?"
        }
      },
      {
        "who": "me",
        "text": "네, 처음이에요. 저는 루카스예요.",
        "gloss": {
          "en": "Yes, it's my first time. I'm Lucas."
        }
      },
      {
        "who": "them",
        "text": "반가워요. 저는 지은이에요. 루카스 씨는 어느 나라 사람이에요?",
        "gloss": {
          "en": "Nice to meet you. I'm Jieun. Where are you from, Lucas?"
        }
      },
      {
        "who": "me",
        "text": "브라질 사람이에요. 만나서 반가워요.",
        "gloss": {
          "en": "I'm Brazilian. Nice to meet you."
        }
      },
      {
        "who": "them",
        "text": "학생이에요?",
        "gloss": {
          "en": "Are you a student?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 학생이 아니에요. 회사원이에요.",
        "gloss": {
          "en": "No, I'm not a student. I'm an office worker."
        }
      },
      {
        "who": "them",
        "text": "아, 그래요? 한국어 공부 재미있어요?",
        "gloss": {
          "en": "Oh, really? Is studying Korean fun?"
        }
      },
      {
        "who": "me",
        "text": "네, 재미있어요. 그런데 조금 어려워요.",
        "gloss": {
          "en": "Yes, it's fun. But it's a little hard."
        }
      }
    ],
    "expressions": [
      "만나서 반가워요",
      "아니요"
    ]
  },
  {
    "id": "ko-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying snacks at a convenience store",
      "ko": "편의점에서 간식 사기"
    },
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요.",
        "gloss": {
          "en": "Welcome."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 이거 얼마예요?",
        "gloss": {
          "en": "Hello. How much is this?"
        }
      },
      {
        "who": "them",
        "text": "그거 이천 원이에요.",
        "gloss": {
          "en": "That's two thousand won."
        }
      },
      {
        "who": "me",
        "text": "이거 주세요. 그리고 물 한 병도 주세요.",
        "gloss": {
          "en": "This one, please. And a bottle of water too."
        }
      },
      {
        "who": "them",
        "text": "네, 전부 삼천 원이에요. 봉투 필요하세요?",
        "gloss": {
          "en": "Okay, that's three thousand won in total. Do you need a bag?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 괜찮아요. 여기요.",
        "gloss": {
          "en": "No, that's okay. Here you go."
        }
      },
      {
        "who": "them",
        "text": "영수증 드릴까요?",
        "gloss": {
          "en": "Would you like the receipt?"
        }
      },
      {
        "who": "me",
        "text": "네, 주세요. 감사합니다. 안녕히 계세요.",
        "gloss": {
          "en": "Yes, please. Thank you. Goodbye."
        }
      }
    ],
    "expressions": [
      "안녕하세요",
      "얼마예요",
      "이거 주세요",
      "아니요",
      "괜찮아요",
      "여기요",
      "감사합니다",
      "안녕히 계세요"
    ]
  },
  {
    "id": "ko-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Ordering a drink at a café",
      "ko": "카페에서 음료 주문하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 주문 도와드릴게요.",
        "gloss": {
          "en": "Welcome. I can take your order."
        }
      },
      {
        "who": "me",
        "text": "따뜻한 라떼 하나 주세요.",
        "gloss": {
          "en": "One hot latte, please."
        }
      },
      {
        "who": "them",
        "text": "우유는 일반 우유로 해 드릴까요?",
        "gloss": {
          "en": "Regular milk for that?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 저는 우유를 안 마셔요. 두유 있어요?",
        "gloss": {
          "en": "No, I don't drink milk. Do you have soy milk?"
        }
      },
      {
        "who": "them",
        "text": "네, 있어요. 오백 원 추가돼요. 매장에서 드세요?",
        "gloss": {
          "en": "Yes, we do. It's five hundred won extra. Is it for here?"
        }
      },
      {
        "who": "me",
        "text": "네? 천천히 말해 주세요.",
        "gloss": {
          "en": "Sorry? Please speak slowly."
        }
      },
      {
        "who": "them",
        "text": "여기서 드세요? 아니면 가져가세요?",
        "gloss": {
          "en": "Are you drinking it here? Or taking it out?"
        }
      },
      {
        "who": "me",
        "text": "아, 가져가요. 감사합니다.",
        "gloss": {
          "en": "Oh, I'm taking it out. Thank you."
        }
      }
    ],
    "expressions": [
      "아니요",
      "천천히 말해 주세요",
      "감사합니다"
    ]
  },
  {
    "id": "ko-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Asking for directions inside a station",
      "ko": "역 안에서 길 묻기"
    },
    "lines": [
      {
        "who": "them",
        "text": "손님, 뭐 도와드릴까요?",
        "gloss": {
          "en": "Can I help you with something?"
        }
      },
      {
        "who": "me",
        "text": "네, 잠깐만요. 화장실 어디예요?",
        "gloss": {
          "en": "Yes, just a moment. Where is the restroom?"
        }
      },
      {
        "who": "them",
        "text": "화장실은 저기 계단 옆에 있어요.",
        "gloss": {
          "en": "The restroom is over there, next to the stairs."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 이 근처에 편의점도 있어요?",
        "gloss": {
          "en": "Thank you. Is there a convenience store near here too?"
        }
      },
      {
        "who": "them",
        "text": "네, 삼 번 출구 앞에 있어요.",
        "gloss": {
          "en": "Yes, there's one in front of exit three."
        }
      },
      {
        "who": "me",
        "text": "죄송합니다. 다시 한번 말해 주세요.",
        "gloss": {
          "en": "Sorry. Please say that again."
        }
      },
      {
        "who": "them",
        "text": "삼 번 출구요. 저쪽이에요.",
        "gloss": {
          "en": "Exit three. It's that way."
        }
      },
      {
        "who": "me",
        "text": "아, 네. 감사합니다. 안녕히 계세요.",
        "gloss": {
          "en": "Ah, okay. Thank you. Goodbye."
        }
      }
    ],
    "expressions": [
      "잠깐만요",
      "화장실 어디예요",
      "감사합니다",
      "죄송합니다",
      "다시 한번 말해 주세요",
      "안녕히 계세요"
    ]
  },
  {
    "id": "ko-1-x1",
    "stage": 1,
    "setting": {
      "en": "Trying street food at a market stall",
      "ko": "시장 노점에서 길거리 음식 고르기"
    },
    "expressions": [
      "이거 뭐예요",
      "네 맞아요",
      "잘 모르겠어요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 맛있는 거 많아요.",
        "gloss": {
          "en": "Welcome. We have lots of tasty things."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 이거 뭐예요?",
        "gloss": {
          "en": "Hello. What is this?"
        }
      },
      {
        "who": "them",
        "text": "호떡이에요. 안에 설탕하고 견과류가 있어요. 처음 먹어요?",
        "gloss": {
          "en": "It's hotteok. There's sugar and nuts inside. Is this your first time eating it?"
        }
      },
      {
        "who": "me",
        "text": "네, 맞아요. 처음 먹어요.",
        "gloss": {
          "en": "Yes, that's right. It's my first time."
        }
      },
      {
        "who": "them",
        "text": "떡볶이도 맛있어요. 매운 거 잘 먹어요?",
        "gloss": {
          "en": "The tteokbokki is good too. Can you handle spicy food?"
        }
      },
      {
        "who": "me",
        "text": "음, 잘 모르겠어요. 오늘은 호떡 하나 주세요.",
        "gloss": {
          "en": "Hmm, I'm not sure. Just one hotteok today, please."
        }
      }
    ]
  },
  {
    "id": "ko-1-x2",
    "name": {
      "text": [
        "안나"
      ],
      "en": [
        "Anna"
      ]
    },
    "stage": 1,
    "setting": {
      "en": "Meeting a new neighbor at the door",
      "ko": "새로 이사 온 이웃과 현관에서 인사하기"
    },
    "expressions": [
      "처음 뵙겠습니다",
      "한국어 조금 해요",
      "안녕히 가세요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 옆집에 이사 왔어요. 저는 박민수예요.",
        "gloss": {
          "en": "Hello. I just moved in next door. I'm Park Minsu."
        }
      },
      {
        "who": "me",
        "text": "아, 안녕하세요. 처음 뵙겠습니다. 저는 안나예요.",
        "gloss": {
          "en": "Oh, hello. Nice to meet you. I'm Anna."
        }
      },
      {
        "who": "them",
        "text": "와, 한국어 잘하시네요!",
        "gloss": {
          "en": "Wow, you speak Korean well!"
        }
      },
      {
        "who": "me",
        "text": "아니에요. 한국어 조금 해요.",
        "gloss": {
          "en": "Not really. I speak a little Korean."
        }
      },
      {
        "who": "them",
        "text": "이거 떡이에요. 맛있게 드세요.",
        "gloss": {
          "en": "These are rice cakes. Enjoy."
        }
      },
      {
        "who": "me",
        "text": "와, 감사합니다. 안녕히 가세요.",
        "gloss": {
          "en": "Oh, thank you. Goodbye."
        }
      }
    ]
  },
  {
    "id": "ko-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Making weekend plans with a friend",
      "ko": "친구와 주말 약속 잡기"
    },
    "lines": [
      {
        "who": "them",
        "text": "다니엘 씨, 이번 주말에 뭐 할 거예요?",
        "gloss": {
          "en": "Daniel, what are you going to do this weekend?"
        }
      },
      {
        "who": "me",
        "text": "아직 계획 없어요. 지난주에는 집에서 쉬었어요.",
        "gloss": {
          "en": "I don't have plans yet. Last week I just rested at home."
        }
      },
      {
        "who": "them",
        "text": "그럼 토요일에 같이 북촌에 갈까요? 한옥이 진짜 예뻐요.",
        "gloss": {
          "en": "Then shall we go to Bukchon together on Saturday? The hanok houses are really pretty."
        }
      },
      {
        "who": "me",
        "text": "좋아요! 저도 한옥을 보고 싶어요.",
        "gloss": {
          "en": "Sounds good! I want to see hanok houses too."
        }
      },
      {
        "who": "them",
        "text": "몇 시에 만날까요? 오전 괜찮아요?",
        "gloss": {
          "en": "What time shall we meet? Is the morning okay?"
        }
      },
      {
        "who": "me",
        "text": "오전에는 아르바이트가 있어요. 오후 두 시에 만날 수 있어요.",
        "gloss": {
          "en": "I have my part-time job in the morning. I can meet at two in the afternoon."
        }
      },
      {
        "who": "them",
        "text": "그럼 두 시에 안국역에서 만나요.",
        "gloss": {
          "en": "Then let's meet at Anguk Station at two."
        }
      },
      {
        "who": "me",
        "text": "네, 좋아요. 구경하고 같이 저녁 먹을까요?",
        "gloss": {
          "en": "Okay, great. Shall we look around and then have dinner together?"
        }
      },
      {
        "who": "them",
        "text": "좋아요. 근처에 맛있는 칼국수집 알아요.",
        "gloss": {
          "en": "Sure. I know a good noodle place nearby."
        }
      },
      {
        "who": "me",
        "text": "와, 대박! 그럼 그때 봐요.",
        "gloss": {
          "en": "Wow, awesome! See you then."
        }
      }
    ],
    "expressions": [
      "그때 봐요",
      "대박"
    ]
  },
  {
    "id": "ko-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Taking a taxi to the station",
      "ko": "택시 타고 역에 가기"
    },
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어디로 가세요?",
        "gloss": {
          "en": "Hello. Where are you going?"
        }
      },
      {
        "who": "me",
        "text": "수서역으로 가 주세요. 기차 타러 가요.",
        "gloss": {
          "en": "Suseo Station, please. I'm going to catch a train."
        }
      },
      {
        "who": "them",
        "text": "몇 시 기차예요?",
        "gloss": {
          "en": "What time is your train?"
        }
      },
      {
        "who": "me",
        "text": "네 시 반 기차예요. 그때까지 갈 수 있어요?",
        "gloss": {
          "en": "It's at four thirty. Can we get there by then?"
        }
      },
      {
        "who": "them",
        "text": "지금 차가 좀 막히는데, 삼십 분이면 도착할 거예요.",
        "gloss": {
          "en": "Traffic's a bit heavy now, but we'll get there in thirty minutes."
        }
      },
      {
        "who": "me",
        "text": "아, 다행이에요. 아, 카드 돼요?",
        "gloss": {
          "en": "Oh, what a relief. Oh, do you take cards?"
        }
      },
      {
        "who": "them",
        "text": "네, 돼요. 거의 다 왔어요. 어디서 내려 드릴까요?",
        "gloss": {
          "en": "Yes, I do. We're almost there. Where should I drop you off?"
        }
      },
      {
        "who": "me",
        "text": "역 입구 앞에서 세워 주세요.",
        "gloss": {
          "en": "Please stop in front of the station entrance."
        }
      },
      {
        "who": "them",
        "text": "도착했습니다. 만 사천 원 나왔어요.",
        "gloss": {
          "en": "Here we are. It comes to fourteen thousand won."
        }
      },
      {
        "who": "me",
        "text": "여기 카드요. 수고하세요!",
        "gloss": {
          "en": "Here's my card. Have a good one!"
        }
      }
    ],
    "expressions": [
      "카드 돼요"
    ]
  },
  {
    "id": "ko-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Trying on clothes at a shop in Myeongdong",
      "ko": "명동 옷 가게에서 옷 입어 보기"
    },
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 편하게 보세요.",
        "gloss": {
          "en": "Welcome. Take your time looking around."
        }
      },
      {
        "who": "me",
        "text": "저기요, 이 재킷 입어 봐도 돼요?",
        "gloss": {
          "en": "Excuse me, can I try on this jacket?"
        }
      },
      {
        "who": "them",
        "text": "네, 입어 보세요. 사이즈 뭐 입으세요?",
        "gloss": {
          "en": "Sure, go ahead. What size do you wear?"
        }
      },
      {
        "who": "me",
        "text": "보통 미디엄 입어요.",
        "gloss": {
          "en": "I usually wear a medium."
        }
      },
      {
        "who": "them",
        "text": "어떠세요? 잘 맞으세요?",
        "gloss": {
          "en": "How is it? Does it fit well?"
        }
      },
      {
        "who": "me",
        "text": "좀 작아요. 큰 사이즈 있어요? 그리고 다른 색 있어요?",
        "gloss": {
          "en": "It's a bit small. Do you have a bigger size? And do you have other colors?"
        }
      },
      {
        "who": "them",
        "text": "큰 사이즈는 검은색하고 베이지만 있어요.",
        "gloss": {
          "en": "In the bigger size we only have black and beige."
        }
      },
      {
        "who": "me",
        "text": "그럼 베이지를 입어 보고 싶어요.",
        "gloss": {
          "en": "Then I'd like to try the beige one."
        }
      },
      {
        "who": "them",
        "text": "네, 여기요. 이건 딱 맞으시네요. 오만 구천 원이에요.",
        "gloss": {
          "en": "Here you go. This one fits you perfectly. It's fifty-nine thousand won."
        }
      },
      {
        "who": "me",
        "text": "음, 생각보다 비싸요. 좀 깎아 주세요. 그럼 오늘 살 거예요.",
        "gloss": {
          "en": "Hmm, it's more expensive than I thought. Please give me a discount. Then I'll buy it today."
        }
      }
    ],
    "expressions": [
      "입어 봐도 돼요",
      "다른 색 있어요",
      "좀 깎아 주세요"
    ]
  },
  {
    "id": "ko-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Buying medicine at a pharmacy",
      "ko": "약국에서 약 사기"
    },
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어디가 불편하세요?",
        "gloss": {
          "en": "Hello. What seems to be the problem?"
        }
      },
      {
        "who": "me",
        "text": "머리가 아파요. 그리고 목도 좀 아파요. 약 있어요?",
        "gloss": {
          "en": "I have a headache. And my throat hurts a bit too. Do you have any medicine?"
        }
      },
      {
        "who": "them",
        "text": "언제부터 그러셨어요?",
        "gloss": {
          "en": "Since when has it been like this?"
        }
      },
      {
        "who": "me",
        "text": "어제부터 아팠어요. 밤에 잠을 잘 못 잤어요.",
        "gloss": {
          "en": "It's hurt since yesterday. I couldn't sleep well last night."
        }
      },
      {
        "who": "them",
        "text": "열은 있어요?",
        "gloss": {
          "en": "Do you have a fever?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 열은 없어요. 빨리 낫고 싶어요.",
        "gloss": {
          "en": "No, I don't have a fever. I want to get better quickly."
        }
      },
      {
        "who": "them",
        "text": "그럼 이 약 드세요. 하루에 세 번, 식사하고 드세요.",
        "gloss": {
          "en": "Then take this medicine. Three times a day, after meals."
        }
      },
      {
        "who": "me",
        "text": "죄송해요, 다시 한번 말해 주세요.",
        "gloss": {
          "en": "Sorry, please say that again."
        }
      },
      {
        "who": "them",
        "text": "하루에 세 번이요. 밥 먹고 한 알씩 드세요.",
        "gloss": {
          "en": "Three times a day. Take one pill after you eat."
        }
      },
      {
        "who": "me",
        "text": "네, 알겠어요. 카드 돼요?",
        "gloss": {
          "en": "Okay, got it. Do you take cards?"
        }
      }
    ],
    "expressions": [
      "머리가 아파요",
      "약 있어요",
      "카드 돼요"
    ]
  },
  {
    "id": "ko-2-x1",
    "stage": 2,
    "setting": {
      "en": "Monday morning chat with a classmate",
      "ko": "월요일 아침 반 친구와 주말 이야기"
    },
    "expressions": [
      "재미있었어요",
      "주말에 뭐 했어요",
      "진짜요",
      "다음에 같이 가요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "마크 씨, 주말 잘 보냈어요?",
        "gloss": {
          "en": "Mark, did you have a good weekend?"
        }
      },
      {
        "who": "me",
        "text": "네! 친구하고 한강에서 자전거 탔어요. 진짜 재미있었어요. 수진 씨는 주말에 뭐 했어요?",
        "gloss": {
          "en": "Yes! I rode bikes by the Han River with a friend. It was really fun. What did you do on the weekend, Sujin?"
        }
      },
      {
        "who": "them",
        "text": "저는 남산타워에 처음 가 봤어요.",
        "gloss": {
          "en": "I went to Namsan Tower for the first time."
        }
      },
      {
        "who": "me",
        "text": "진짜요? 저는 아직 못 가 봤어요.",
        "gloss": {
          "en": "Really? I haven't been there yet."
        }
      },
      {
        "who": "them",
        "text": "밤에 가면 야경이 정말 예뻐요.",
        "gloss": {
          "en": "If you go at night, the night view is really beautiful."
        }
      },
      {
        "who": "me",
        "text": "와, 다음에 같이 가요!",
        "gloss": {
          "en": "Wow, let's go together next time!"
        }
      }
    ]
  },
  {
    "id": "ko-2-x2",
    "stage": 2,
    "setting": {
      "en": "Planning a café visit with a classmate",
      "ko": "반 친구와 카페 갈 약속 잡기"
    },
    "expressions": [
      "언제 시간 있어요",
      "몇 시에 만날까요",
      "연락할게요",
      "힘내요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "학교 앞에 새 카페 생겼어요. 케이크가 진짜 맛있대요.",
        "gloss": {
          "en": "A new café opened in front of school. They say the cake is really good."
        }
      },
      {
        "who": "me",
        "text": "와, 가 보고 싶어요. 언제 시간 있어요?",
        "gloss": {
          "en": "Oh, I want to go. When are you free?"
        }
      },
      {
        "who": "them",
        "text": "이번 주는 시험이 있어서 좀 바빠요. 다음 주 월요일 어때요?",
        "gloss": {
          "en": "I have exams this week, so I'm a bit busy. How about next Monday?"
        }
      },
      {
        "who": "me",
        "text": "좋아요. 몇 시에 만날까요?",
        "gloss": {
          "en": "Sounds good. What time should we meet?"
        }
      },
      {
        "who": "them",
        "text": "음, 아직 잘 모르겠어요. 시험 끝나고 얘기해요.",
        "gloss": {
          "en": "Hmm, I'm not sure yet. Let's talk after my exams."
        }
      },
      {
        "who": "me",
        "text": "네, 그럼 제가 연락할게요. 시험 힘내요!",
        "gloss": {
          "en": "Okay, then I'll get in touch. Good luck with your exams!"
        }
      }
    ]
  },
  {
    "id": "ko-2-x3",
    "stage": 2,
    "setting": {
      "en": "Arriving late to meet a friend",
      "ko": "친구와의 약속에 늦게 도착하기"
    },
    "expressions": [
      "늦어서 미안해요",
      "피곤해요",
      "배고파요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어, 왔어요? 한참 기다렸어요.",
        "gloss": {
          "en": "Oh, you're here? I've been waiting a while."
        }
      },
      {
        "who": "me",
        "text": "늦어서 미안해요. 버스를 잘못 탔어요.",
        "gloss": {
          "en": "Sorry I'm late. I got on the wrong bus."
        }
      },
      {
        "who": "them",
        "text": "괜찮아요. 근데 얼굴이 좀 안 좋아 보여요.",
        "gloss": {
          "en": "It's okay. But you don't look so good."
        }
      },
      {
        "who": "me",
        "text": "어제 잠을 잘 못 자서 좀 피곤해요.",
        "gloss": {
          "en": "I didn't sleep well last night, so I'm a bit tired."
        }
      },
      {
        "who": "them",
        "text": "그럼 빨리 밥 먹으러 가요.",
        "gloss": {
          "en": "Then let's hurry and go eat."
        }
      },
      {
        "who": "me",
        "text": "좋아요. 저 진짜 배고파요.",
        "gloss": {
          "en": "Sounds good. I'm really hungry."
        }
      }
    ]
  },
  {
    "id": "ko-2-x4",
    "stage": 2,
    "setting": {
      "en": "Taking a taxi to a market",
      "ko": "택시 타고 시장 가기"
    },
    "expressions": [
      "어디서 내려요",
      "여기서 세워 주세요"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어디로 가세요?",
        "gloss": {
          "en": "Hello. Where are you headed?"
        }
      },
      {
        "who": "me",
        "text": "남대문시장이요. 그런데 시장은 어디서 내려요?",
        "gloss": {
          "en": "Namdaemun Market. But where should I get off for the market?"
        }
      },
      {
        "who": "them",
        "text": "정문 앞이 제일 가까워요. 거기서 내려 드릴게요.",
        "gloss": {
          "en": "The main gate is closest. I'll drop you off there."
        }
      },
      {
        "who": "me",
        "text": "좋아요. 오래 걸려요?",
        "gloss": {
          "en": "Great. Will it take long?"
        }
      },
      {
        "who": "them",
        "text": "아니요, 금방 가요. …자, 다 왔어요. 그런데 정문 앞에 차가 너무 많네요.",
        "gloss": {
          "en": "No, we'll be there soon. …Okay, we're here. But there are too many cars by the main gate."
        }
      },
      {
        "who": "me",
        "text": "괜찮아요. 여기서 세워 주세요.",
        "gloss": {
          "en": "That's fine. Please stop here."
        }
      }
    ]
  },
  {
    "id": "ko-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Chatting with a friend about a K-drama ending",
      "ko": "친한 친구와 드라마 결말 이야기하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "너 어제 그 드라마 마지막 화 봤어? 나 아직도 충격이야.",
        "gloss": {
          "en": "Did you watch the last episode of that drama yesterday? I'm still in shock."
        }
      },
      {
        "who": "me",
        "text": "응, 봤어! 나는 결말 진짜 좋았는데. 너는 어떻게 생각해?",
        "gloss": {
          "en": "Yeah, I watched it! I really liked the ending. What did you think?"
        }
      },
      {
        "who": "them",
        "text": "나는 솔직히 별로였어. 주인공이 왜 갑자기 떠나? 말도 안 돼.",
        "gloss": {
          "en": "Honestly, I didn't like it. Why does the main character suddenly leave? It makes no sense."
        },
        "alt": [
          {
            "text": "난 좀 아쉬웠어. 주인공이 마지막에 그냥 떠나 버리잖아.",
            "gloss": {
              "en": "I was a bit disappointed. The main character just leaves at the end."
            }
          },
          {
            "text": "글쎄, 나는 좀 허무했어. 갑자기 떠나는 게 이해가 안 돼.",
            "gloss": {
              "en": "I don't know, it felt kind of empty. I don't get why they suddenly leave."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그럴 수도 있지. 근데 아빠가 아파서 간 거니까 나는 이해됐어.",
        "gloss": {
          "en": "I can see that. But they left because their dad was sick, so it made sense to me."
        }
      },
      {
        "who": "them",
        "text": "아 그렇구나. 나 중간에 졸아서 그 부분 놓쳤나 봐.",
        "gloss": {
          "en": "Oh, I see. I must have dozed off and missed that part."
        },
        "alt": [
          {
            "text": "아, 진짜? 나 그 장면에서 폰 보느라 못 봤나 봐.",
            "gloss": {
              "en": "Oh, really? I must have missed that scene because I was on my phone."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "진짜? 그럼 그 장면 다시 봐. 보면 생각이 바뀔 거야.",
        "gloss": {
          "en": "Seriously? Then watch that scene again. You'll change your mind."
        }
      },
      {
        "who": "them",
        "text": "알았어. 근데 혹시 시즌 투 나와?",
        "gloss": {
          "en": "Okay. By the way, is there going to be a season two?"
        },
        "alt": [
          {
            "text": "그래서, 다음 시즌 나온대?",
            "gloss": {
              "en": "So, are they making another season?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "아직 몰라. 나오면 바로 알려 줄게.",
        "gloss": {
          "en": "Don't know yet. If it comes out, I'll tell you right away."
        }
      },
      {
        "who": "them",
        "text": "좋아. 너 그 작가가 쓴 다른 드라마도 본 적 있어?",
        "gloss": {
          "en": "Cool. Have you ever watched any other drama by that writer?"
        },
        "alt": [
          {
            "text": "근데 그 작가 전 작품도 봤어?",
            "gloss": {
              "en": "By the way, did you see that writer's previous show too?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "응, 본 적 있어. 그것도 결말 때문에 말이 많았는데, 나는 재미있었어.",
        "gloss": {
          "en": "Yeah, I have. People argued about its ending too, but I enjoyed it."
        }
      },
      {
        "who": "them",
        "text": "그럼 주말에 그거 같이 볼래? 나는 아직 안 봤거든. 치킨은 내가 살게.",
        "gloss": {
          "en": "Then want to watch it together this weekend? I haven't seen it yet. I'll get the chicken."
        },
        "alt": [
          {
            "text": "그럼 이번 주말에 우리 집에서 같이 보자. 치킨은 내가 쏠게.",
            "gloss": {
              "en": "Then let's watch it at my place this weekend. Chicken's on me."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "좋아! 그럼 맥주는 내가 가져갈게.",
        "gloss": {
          "en": "Deal! Then I'll bring the beer."
        }
      }
    ],
    "expressions": [
      "어떻게 생각해요",
      "그럴 수도 있죠"
    ]
  },
  {
    "id": "ko-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Reporting a broken air conditioner at a guesthouse",
      "ko": "게스트하우스에서 고장 난 에어컨 신고하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "네, 프런트입니다. 무엇을 도와드릴까요?",
        "gloss": {
          "en": "Front desk. How can I help you?"
        }
      },
      {
        "who": "me",
        "text": "안녕하세요, 이백삼 호인데요. 문제가 생겼어요. 에어컨이 안 돼요.",
        "gloss": {
          "en": "Hello, this is room two-oh-three. Something's gone wrong. The air conditioner isn't working."
        }
      },
      {
        "who": "them",
        "text": "아, 그러세요? 혹시 리모컨 전원 버튼은 눌러 보셨어요?",
        "gloss": {
          "en": "Oh, really? Have you tried pressing the power button on the remote?"
        },
        "alt": [
          {
            "text": "죄송합니다. 리모컨으로 켜 보셨어요?",
            "gloss": {
              "en": "I'm sorry. Have you tried turning it on with the remote?"
            }
          },
          {
            "text": "아이고, 불편하셨겠어요. 리모컨은 눌러 보셨어요?",
            "gloss": {
              "en": "Oh dear, that must be uncomfortable. Have you tried the remote?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 여러 번 눌렀는데 계속 더운 바람만 나와요.",
        "gloss": {
          "en": "Yes, I pressed it several times, but only hot air keeps coming out."
        }
      },
      {
        "who": "them",
        "text": "그럼 제가 바로 올라가서 확인해 보겠습니다.",
        "gloss": {
          "en": "Then I'll come up right away and take a look."
        },
        "alt": [
          {
            "text": "그러면 직원이 지금 올라가서 확인해 보겠습니다.",
            "gloss": {
              "en": "Then a staff member will come up now and check it."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "감사합니다. 방이 너무 더워서 어젯밤에 잠을 못 잤어요.",
        "gloss": {
          "en": "Thank you. The room was so hot that I couldn't sleep last night."
        }
      },
      {
        "who": "them",
        "text": "정말 죄송합니다. 그런데 수리 기사님이 저녁에나 오실 수 있을 것 같아요.",
        "gloss": {
          "en": "I'm really sorry. But it looks like the repair technician can't come until the evening."
        },
        "alt": [
          {
            "text": "죄송해요. 수리 기사님이 오늘 늦게야 오신대요.",
            "gloss": {
              "en": "I'm sorry. The technician says they can only come late today."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "저녁이면 너무 늦어요. 혹시 다른 방으로 옮길 수 있어요?",
        "gloss": {
          "en": "The evening is too late. Could I possibly move to another room?"
        }
      },
      {
        "who": "them",
        "text": "오늘은 방이 다 찼는데, 내일은 옮겨 드릴 수 있어요.",
        "gloss": {
          "en": "We're fully booked today, but we can move you tomorrow."
        },
        "alt": [
          {
            "text": "지금 빈방이 없어서요. 내일 아침이면 바꿔 드릴 수 있어요.",
            "gloss": {
              "en": "We don't have any empty rooms right now. We can switch you tomorrow morning."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그럼 오늘 밤은 어떻게 해요? 선풍기라도 있으면 빌려주세요.",
        "gloss": {
          "en": "Then what do I do tonight? If you have a fan, please lend it to me."
        }
      },
      {
        "who": "them",
        "text": "네, 선풍기는 바로 가져다 드릴게요. 그리고 오늘 숙박비는 조금 빼 드릴게요.",
        "gloss": {
          "en": "Sure, I'll bring a fan right away. And we'll take a bit off tonight's rate."
        },
        "alt": [
          {
            "text": "선풍기 바로 올려 드릴게요. 불편을 드려서 오늘 요금은 일부 환불해 드릴게요.",
            "gloss": {
              "en": "I'll bring a fan up right away. Since we've inconvenienced you, we'll refund part of tonight's rate."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "아, 그렇게 해 주시면 좋겠어요. 감사합니다.",
        "gloss": {
          "en": "Oh, that would be great. Thank you."
        }
      }
    ],
    "expressions": [
      "문제가 생겼어요"
    ]
  },
  {
    "id": "ko-3-3",
    "name": {
      "text": [
        "리사"
      ],
      "en": [
        "Lisa"
      ]
    },
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "First day at a part-time job",
      "ko": "아르바이트 첫날"
    },
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요, 오늘부터 일하는 분 맞죠?",
        "gloss": {
          "en": "Hi, you're the one starting today, right?"
        }
      },
      {
        "who": "me",
        "text": "네, 안녕하세요. 오늘부터 일하게 된 리사예요. 잘 부탁드립니다.",
        "gloss": {
          "en": "Yes, hello. I'm Lisa, I'm starting today. I look forward to working with you."
        }
      },
      {
        "who": "them",
        "text": "반가워요. 혹시 카페에서 일해 본 적 있어요?",
        "gloss": {
          "en": "Nice to meet you. Have you ever worked at a café?"
        },
        "alt": [
          {
            "text": "반가워요. 전에 카페 일 해 봤어요?",
            "gloss": {
              "en": "Nice to meet you. Have you done café work before?"
            }
          },
          {
            "text": "어서 와요. 이런 일 경험 있어요?",
            "gloss": {
              "en": "Welcome. Do you have experience with this kind of work?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 한국에서는 처음인데 고향에서 일 년 동안 일한 적이 있어요.",
        "gloss": {
          "en": "Yes. It's my first time in Korea, but I worked at one back home for a year."
        }
      },
      {
        "who": "them",
        "text": "잘됐네요. 그럼 오늘은 계산하는 것부터 배워 볼까요?",
        "gloss": {
          "en": "Great. Then shall we start today with how to ring people up?"
        },
        "alt": [
          {
            "text": "좋네요. 그럼 오늘은 포스기 쓰는 법부터 알려 줄게요.",
            "gloss": {
              "en": "Good. Then today I'll start by showing you how to use the register."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 모르는 거 있으면 바로 물어볼게요.",
        "gloss": {
          "en": "Okay, if there's anything I don't know, I'll ask right away."
        }
      },
      {
        "who": "them",
        "text": "좋아요. 아, 손님 많을 때는 주문부터 받고 음료는 나중에 만들어요.",
        "gloss": {
          "en": "Good. Oh, when it's busy, we take orders first and make the drinks after."
        },
        "alt": [
          {
            "text": "그리고 바쁠 때는 주문 먼저 받고, 음료는 뒤에서 만들어요.",
            "gloss": {
              "en": "And when it's busy, take the orders first; drinks get made in the back."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "아, 그렇구나. 그럼 저는 주문 받는 걸 먼저 할게요.",
        "gloss": {
          "en": "Oh, I see. Then I'll take care of orders first."
        }
      },
      {
        "who": "them",
        "text": "네. 그리고 오늘 마감까지 할 수 있어요?",
        "gloss": {
          "en": "Okay. And can you stay until closing today?"
        },
        "alt": [
          {
            "text": "혹시 오늘 마감까지 남아 줄 수 있어요?",
            "gloss": {
              "en": "By any chance, could you stay until closing today?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "죄송한데, 오늘은 저녁에 수업이 있기 때문에 여섯 시까지만 할 수 있어요.",
        "gloss": {
          "en": "Sorry, I have a class this evening, so I can only work until six today."
        }
      },
      {
        "who": "them",
        "text": "아, 그래요? 그럼 괜찮아요. 다음 주부터 부탁해요.",
        "gloss": {
          "en": "Oh, really? Then that's fine. I'll count on you from next week."
        },
        "alt": [
          {
            "text": "아, 그렇구나. 괜찮아요, 그럼 다음부터 해 줘요.",
            "gloss": {
              "en": "Oh, I see. That's fine, then do it from next time."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 다음 주부터는 마감까지 할게요. 잘 부탁드립니다!",
        "gloss": {
          "en": "Sure, from next week I'll stay until closing. Thanks for everything!"
        }
      }
    ],
    "expressions": [
      "잘 부탁드립니다",
      "아 그렇구나"
    ]
  },
  {
    "id": "ko-3-4",
    "name": {
      "text": [
        "마이클 리"
      ],
      "en": [
        "Michael Lee"
      ]
    },
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Asking to exchange an item bought online",
      "ko": "온라인에서 산 물건 교환 요청하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요, 고객센터입니다. 무엇을 도와드릴까요?",
        "gloss": {
          "en": "Hello, customer service. How can I help you?"
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 지난주에 운동화를 샀는데 교환하고 싶은데요.",
        "gloss": {
          "en": "Hello. I bought sneakers last week and I'd like to exchange them."
        }
      },
      {
        "who": "them",
        "text": "네, 확인해 드릴게요. 주문하신 분 성함이 어떻게 되세요?",
        "gloss": {
          "en": "Sure, let me check. What's the name on the order?"
        },
        "alt": [
          {
            "text": "네, 주문자 성함 먼저 말씀해 주시겠어요?",
            "gloss": {
              "en": "Sure, could you tell me the name of the person who ordered first?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "마이클 리예요. 주문 번호도 필요하세요?",
        "gloss": {
          "en": "It's Michael Lee. Do you need the order number too?"
        }
      },
      {
        "who": "them",
        "text": "아니요, 성함으로 확인됐어요. 어떤 문제가 있으세요?",
        "gloss": {
          "en": "No, I found it with your name. What seems to be the problem?"
        },
        "alt": [
          {
            "text": "아니요, 괜찮아요. 확인됐습니다. 교환 사유가 어떻게 되세요?",
            "gloss": {
              "en": "No, that's fine. I've found it. What's the reason for the exchange?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "사이즈가 작아서 발이 아파요. 한 치수 큰 걸로 바꾸고 싶어요.",
        "gloss": {
          "en": "They're too small, so my feet hurt. I'd like to change them for one size up."
        }
      },
      {
        "who": "them",
        "text": "혹시 밖에서 신으셨어요? 밖에서 신으시면 교환이 어려워요.",
        "gloss": {
          "en": "Did you wear them outside, by any chance? If they've been worn outside, an exchange is difficult."
        },
        "alt": [
          {
            "text": "혹시 밖에서 신으셨나요? 그러면 교환이 안 되거든요.",
            "gloss": {
              "en": "Have you worn them outside? Because then we can't exchange them."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "아니요, 집에서 한 번만 신어 봤어요. 상자도 그대로 있어요.",
        "gloss": {
          "en": "No, I only tried them on once at home. I still have the box, too."
        }
      },
      {
        "who": "them",
        "text": "그럼 교환 가능하세요. 그런데 지금 그 사이즈가 품절이라서 다음 주에 들어와요.",
        "gloss": {
          "en": "Then you can exchange them. But that size is sold out right now, so it comes in next week."
        },
        "alt": [
          {
            "text": "네, 교환은 되는데요, 큰 사이즈는 다음 주에 입고될 예정이에요.",
            "gloss": {
              "en": "Yes, you can exchange them, but the larger size is due in next week."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그럼 기다릴게요. 혹시 다음 주에도 없으면 환불 가능해요?",
        "gloss": {
          "en": "Then I'll wait. If it's still not there next week, can I get a refund?"
        }
      },
      {
        "who": "them",
        "text": "네, 그때는 환불해 드릴게요. 택배 기사님이 내일 상품 가지러 가실 거예요.",
        "gloss": {
          "en": "Yes, in that case we'll refund you. A courier will come to pick up the item tomorrow."
        },
        "alt": [
          {
            "text": "물론이죠. 그리고 회수는 내일 기사님이 방문하실 거예요.",
            "gloss": {
              "en": "Of course. And a courier will come by tomorrow to collect it."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 알겠습니다. 그럼 내일 문 앞에 둘게요. 감사합니다.",
        "gloss": {
          "en": "Okay, got it. Then I'll leave it by the door tomorrow. Thank you."
        }
      }
    ],
    "expressions": [
      "교환하고 싶은데요",
      "환불 가능해요"
    ]
  },
  {
    "id": "ko-3-x1",
    "stage": 3,
    "setting": {
      "en": "Begging a friend for drama spoilers",
      "ko": "친구한테 드라마 내용 물어보기"
    },
    "expressions": [
      "스포 하지 마",
      "그래서 어떻게 됐어",
      "말도 안 돼",
      "다음 화 언제 나와"
    ],
    "lines": [
      {
        "who": "them",
        "text": "너 그 드라마 어제 거 봤어? 대박이었는데.",
        "gloss": {
          "en": "Did you watch yesterday's episode of that drama? It was insane."
        }
      },
      {
        "who": "me",
        "text": "아니, 아직 못 봤어. 스포 하지 마!",
        "gloss": {
          "en": "No, I haven't seen it yet. No spoilers!"
        }
      },
      {
        "who": "them",
        "text": "알았어, 알았어. 근데 마지막 장면은 진짜 꼭 봐야 돼.",
        "gloss": {
          "en": "Okay, okay. But you really have to see the last scene."
        }
      },
      {
        "who": "me",
        "text": "아, 궁금해 죽겠네. 그냥 말해 줘. 그래서 어떻게 됐어?",
        "gloss": {
          "en": "Ugh, I'm dying to know. Just tell me. So what happened?"
        }
      },
      {
        "who": "them",
        "text": "주인공 형이 사실 범인이었어.",
        "gloss": {
          "en": "The main character's brother was actually the culprit."
        }
      },
      {
        "who": "me",
        "text": "헐, 말도 안 돼! 다음 화 언제 나와?",
        "gloss": {
          "en": "No way, that can't be! When does the next episode come out?"
        }
      }
    ]
  },
  {
    "id": "ko-3-x2",
    "stage": 3,
    "setting": {
      "en": "Classmates choosing a place for the end-of-term party",
      "ko": "종강 파티 장소 정하기"
    },
    "expressions": [
      "그건 좀",
      "완전 공감해요",
      "제 생각에는"
    ],
    "lines": [
      {
        "who": "them",
        "text": "종강 파티 어디서 할지 들었어요? 반장이 노래방 가자고 하던데요.",
        "gloss": {
          "en": "Did you hear where the end-of-term party is? The class rep wants to go to karaoke."
        }
      },
      {
        "who": "me",
        "text": "노래방이요? 음, 그건 좀… 노래 시키면 너무 부담스러워요.",
        "gloss": {
          "en": "Karaoke? Hmm, that's a bit… It's so much pressure when they make you sing."
        }
      },
      {
        "who": "them",
        "text": "맞아요. 저도 마이크만 잡으면 얼굴이 빨개져요.",
        "gloss": {
          "en": "Right. My face turns red the moment I hold a mic."
        }
      },
      {
        "who": "me",
        "text": "완전 공감해요. 그리고 노래방에서는 얘기도 잘 못 하잖아요.",
        "gloss": {
          "en": "I totally get that. And you can't really talk at karaoke, either."
        }
      },
      {
        "who": "them",
        "text": "그럼 어디가 좋을까요? 다들 의견이 달라서요.",
        "gloss": {
          "en": "Then where would be good? Everyone has a different opinion."
        }
      },
      {
        "who": "me",
        "text": "제 생각에는 학교 앞 고깃집이 제일 좋을 것 같아요. 노래방은 끝나고 가고 싶은 사람만 가고요.",
        "gloss": {
          "en": "In my opinion, the barbecue place in front of school would be best. Then only people who want to can go to karaoke after."
        }
      }
    ]
  },
  {
    "id": "ko-3-x3",
    "stage": 3,
    "setting": {
      "en": "Dropping formal speech with a coworker after an event",
      "ko": "행사 끝나고 동료와 말 놓기"
    },
    "expressions": [
      "그러니까요",
      "수고하셨습니다",
      "말 놓을까요",
      "편하게 말해"
    ],
    "lines": [
      {
        "who": "them",
        "text": "드디어 끝났네요. 오늘 진짜 정신없었어요.",
        "gloss": {
          "en": "It's finally over. Today was really hectic."
        }
      },
      {
        "who": "me",
        "text": "그러니까요. 그래도 잘 끝나서 다행이에요. 수고하셨습니다!",
        "gloss": {
          "en": "Tell me about it. Still, I'm glad it went well. Thanks for your hard work!"
        }
      },
      {
        "who": "them",
        "text": "수고하셨어요. 근데 우리 동갑이라면서요? 매니저님한테 들었어요.",
        "gloss": {
          "en": "You too. But I heard we're the same age? The manager told me."
        }
      },
      {
        "who": "me",
        "text": "아, 그래요? 그럼 우리 말 놓을까요?",
        "gloss": {
          "en": "Oh, really? Then shall we drop the formal speech?"
        }
      },
      {
        "who": "them",
        "text": "좋아요! 아, 근데 갑자기 반말하려니까 좀 어색하네요.",
        "gloss": {
          "en": "Sure! Oh, but switching to casual all of a sudden feels a little awkward."
        }
      },
      {
        "who": "me",
        "text": "괜찮아, 편하게 말해. 다음 주에도 잘 부탁해!",
        "gloss": {
          "en": "It's fine, talk to me casually. Looking forward to working with you next week too!"
        }
      }
    ]
  },
  {
    "id": "ko-3-x4",
    "stage": 3,
    "setting": {
      "en": "Asking a senior to look over your slides",
      "ko": "선배에게 발표 자료 봐 달라고 부탁하기"
    },
    "expressions": [
      "혹시 시간 괜찮으세요",
      "확인해 보겠습니다"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어, 서연 씨. 무슨 일이에요?",
        "gloss": {
          "en": "Oh, Seoyeon. What's up?"
        }
      },
      {
        "who": "me",
        "text": "선배님, 혹시 시간 괜찮으세요? 발표 자료 좀 봐 주셨으면 해서요.",
        "gloss": {
          "en": "Do you happen to have a moment? I was hoping you could look over my presentation slides."
        }
      },
      {
        "who": "them",
        "text": "아, 그거요. 근데 어제 보낸 파일이 안 열리던데요?",
        "gloss": {
          "en": "Oh, those. But the file you sent yesterday wouldn't open."
        }
      },
      {
        "who": "me",
        "text": "정말요? 죄송합니다. 바로 확인해 보겠습니다.",
        "gloss": {
          "en": "Really? I'm sorry. I'll check it right away."
        }
      },
      {
        "who": "them",
        "text": "네, 다시 보내 주면 점심 먹고 볼게요.",
        "gloss": {
          "en": "Okay, if you resend it, I'll look after lunch."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 지금 바로 다시 보내 드릴게요.",
        "gloss": {
          "en": "Thank you. I'll send it again right now."
        }
      }
    ]
  },
  {
    "id": "ko-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Reporting a client request to a team leader",
      "ko": "팀장님께 거래처 요청 보고하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "아, 민재 씨. 아까 한빛상사랑 통화했다면서요? 뭐래요?",
        "gloss": {
          "en": "Oh, Minjae. I heard you were on the phone with Hanbit Trading earlier? What did they say?"
        }
      },
      {
        "who": "me",
        "text": "네, 팀장님. 한빛상사 김 과장님께서 견적서를 다시 보내 달래요.",
        "gloss": {
          "en": "Yes, sir. Manager Kim at Hanbit Trading is asking us to send the quote again."
        }
      },
      {
        "who": "them",
        "text": "다시요? 지난주에 보낸 거에 문제 있대요?",
        "gloss": {
          "en": "Again? Did they say there's a problem with the one we sent last week?"
        },
        "alt": [
          {
            "text": "또요? 저번에 보낸 거 뭐가 문제래요?",
            "gloss": {
              "en": "Again? What do they say is wrong with the last one?"
            }
          },
          {
            "text": "견적서를요? 왜요, 뭐가 안 맞는대요?",
            "gloss": {
              "en": "The quote? Why, what do they say doesn't match?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "문제라기보다는, 수량을 이백 개에서 삼백 개로 늘리고 싶으시대요.",
        "gloss": {
          "en": "It's not so much a problem; they say they want to increase the quantity from two hundred to three hundred units."
        }
      },
      {
        "who": "them",
        "text": "아, 그래요? 그럼 단가도 다시 계산해야겠네요.",
        "gloss": {
          "en": "Oh, really? Then we'll have to recalculate the unit price too."
        },
        "alt": [
          {
            "text": "그러면 단가부터 다시 봐야겠네요.",
            "gloss": {
              "en": "Then we'll need to look at the unit price again first."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 그래서 말씀드리는 건데요, 수량이 늘면 할인이 가능한지도 물어보셨어요.",
        "gloss": {
          "en": "Yes, that's why I'm bringing it up. They also asked whether a discount would be possible if the quantity goes up."
        }
      },
      {
        "who": "them",
        "text": "음, 할인은 좀 곤란한데… 지난번에도 많이 깎아 드렸잖아요.",
        "gloss": {
          "en": "Hmm, a discount is a bit tricky… We already gave them a big discount last time, you know."
        },
        "alt": [
          {
            "text": "할인까지요? 지난번에 이미 꽤 빼 드렸잖아요.",
            "gloss": {
              "en": "A discount too? We already took quite a bit off last time, you know."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 그 부분은요, 저도 말씀드렸거든요. 그런데 이번에 다른 업체 견적도 받았다고 하시더라고요.",
        "gloss": {
          "en": "Yes, as for that, I mentioned it to them too. But I found out they've also gotten a quote from another company this time."
        }
      },
      {
        "who": "them",
        "text": "그래요? 그럼 그냥 넘길 수는 없겠네요. 언제까지 달래요?",
        "gloss": {
          "en": "Really? Then we can't just let it slide. By when do they want it?"
        },
        "alt": [
          {
            "text": "아, 그럼 신경 좀 써야겠네요. 기한은 언제까지래요?",
            "gloss": {
              "en": "Ah, then we'd better pay attention. What's their deadline?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "이번 주 금요일까지 받고 싶으시대요.",
        "gloss": {
          "en": "They say they'd like to have it by this Friday."
        }
      },
      {
        "who": "them",
        "text": "금요일이면 빠듯할 텐데… 생산팀 확인도 해야 하고.",
        "gloss": {
          "en": "Friday will probably be tight… We also need to check with the production team."
        },
        "alt": [
          {
            "text": "금요일이요? 생산팀이랑도 맞춰 봐야 하는데 시간이 좀 빠듯하겠네요.",
            "gloss": {
              "en": "Friday? We have to coordinate with production too, so time will be a bit tight."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그럼 제가 오늘 생산팀하고 일정 조율해 보고, 내일 오전까지 초안 만들어서 확인 부탁드릴게요.",
        "gloss": {
          "en": "Then I'll coordinate the schedule with production today, prepare a draft by tomorrow morning, and ask you to check it."
        }
      },
      {
        "who": "them",
        "text": "좋아요. 할인 폭은 제가 본부장님께 여쭤볼게요.",
        "gloss": {
          "en": "Good. I'll ask the division head about how much of a discount we can give."
        },
        "alt": [
          {
            "text": "그래요, 할인 문제는 제가 본부장님하고 따로 얘기해 볼게요.",
            "gloss": {
              "en": "Alright, I'll talk to the division head separately about the discount."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "네, 알겠습니다. 말씀하신 대로 진행하겠습니다.",
        "gloss": {
          "en": "Yes, understood. I'll proceed as you said."
        }
      }
    ],
    "expressions": [
      "말씀하신 대로",
      "확인 부탁드립니다",
      "일정 조율해 볼게요",
      "그 부분은요"
    ]
  },
  {
    "id": "ko-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Telling a friend about missing your subway stop",
      "ko": "친구에게 지하철역을 지나친 이야기하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "야, 너 왜 이렇게 늦었어? 한 시간 기다렸잖아.",
        "gloss": {
          "en": "Hey, why are you so late? I waited an hour, you know."
        }
      },
      {
        "who": "me",
        "text": "말도 마. 나 오늘 지하철에서 완전 난리 났었어.",
        "gloss": {
          "en": "Don't even ask. Today was a total mess on the subway."
        }
      },
      {
        "who": "them",
        "text": "왜, 무슨 일 있었어?",
        "gloss": {
          "en": "Why, what happened?"
        },
        "alt": [
          {
            "text": "왜? 또 무슨 일인데?",
            "gloss": {
              "en": "Why? What happened this time?"
            }
          },
          {
            "text": "뭐야, 무슨 일 있었어?",
            "gloss": {
              "en": "What? Did something happen?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "어제 야근해서 너무 피곤했거든. 앉자마자 잠들어 버렸어.",
        "gloss": {
          "en": "I worked late last night, so I was super tired. I fell asleep the moment I sat down."
        }
      },
      {
        "who": "them",
        "text": "설마 내릴 데 지나친 거야?",
        "gloss": {
          "en": "Don't tell me you missed your stop?"
        },
        "alt": [
          {
            "text": "헐, 그래서 못 내렸어?",
            "gloss": {
              "en": "No way, so you didn't get off?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "응. 깼는데 다섯 정거장이나 지나 있더라.",
        "gloss": {
          "en": "Yep. When I woke up, I was five whole stops past it."
        }
      },
      {
        "who": "them",
        "text": "대박. 그래서 다시 돌아왔어?",
        "gloss": {
          "en": "Wow. So did you head back?"
        },
        "alt": [
          {
            "text": "말도 안 돼. 그래서 바로 반대로 탔어?",
            "gloss": {
              "en": "No way. So did you take the train back the other way right away?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "반대쪽으로 갈아타려고 급하게 내리는 바람에 우산을 두고 내렸어.",
        "gloss": {
          "en": "I got off in such a rush to switch to the other side that I left my umbrella on the train."
        }
      },
      {
        "who": "them",
        "text": "아, 진짜? 그 우산 너 아끼던 거잖아.",
        "gloss": {
          "en": "Oh, really? That's the umbrella you really liked, isn't it?"
        },
        "alt": [
          {
            "text": "헐, 그 비싼 우산? 너 엄청 아끼던 거잖아.",
            "gloss": {
              "en": "What, that expensive umbrella? You loved that thing."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그러니까. 그것뿐이면 다행인데, 하마터면 핸드폰도 놓고 내릴 뻔했어.",
        "gloss": {
          "en": "I know. And that's not even the worst of it — I almost left my phone behind too."
        }
      },
      {
        "who": "them",
        "text": "너 요즘 너무 무리하는 거 아니야?",
        "gloss": {
          "en": "Aren't you pushing yourself too hard lately?"
        },
        "alt": [
          {
            "text": "야, 너 진짜 요즘 너무 피곤한 거 아니야?",
            "gloss": {
              "en": "Hey, aren't you way too tired these days?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그러게 말이야. 이번 주까지만 버티면 프로젝트 끝나거든.",
        "gloss": {
          "en": "Tell me about it. If I can just hang in there till this week, the project's done."
        }
      },
      {
        "who": "them",
        "text": "됐어, 늦은 건 봐줄게. 대신 오늘 밥은 네가 사.",
        "gloss": {
          "en": "Fine, I'll let the lateness go. But you're buying dinner today."
        },
        "alt": [
          {
            "text": "알았어, 이번만 봐준다. 대신 밥은 네가 사.",
            "gloss": {
              "en": "Okay, just this once. But dinner's on you."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "당연하지. 오늘은 내가 쏠게. 진짜 미안해.",
        "gloss": {
          "en": "Of course. Today's on me. I'm really sorry."
        }
      }
    ],
    "expressions": [
      "말도 마",
      "하마터면",
      "그러게 말이야",
      "내가 쏠게"
    ]
  },
  {
    "id": "ko-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Calling customer service about a delayed delivery",
      "ko": "배송 지연으로 고객센터에 전화하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "기다려 주셔서 감사합니다. 상담원 이수진입니다. 무엇을 도와드릴까요?",
        "gloss": {
          "en": "Thank you for waiting. This is Lee Sujin. How can I help you?"
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 지난주에 주문한 소파가 아직 안 와서 전화드렸어요.",
        "gloss": {
          "en": "Hello. I'm calling because the sofa I ordered last week still hasn't arrived."
        }
      },
      {
        "who": "them",
        "text": "불편을 드려 죄송합니다. 주문하신 분 성함하고 주문 번호 확인 부탁드립니다.",
        "gloss": {
          "en": "Sorry for the inconvenience. May I have the name and order number, please?"
        },
        "alt": [
          {
            "text": "그러셨군요. 주문자 성함하고 주문 번호 말씀해 주시겠어요?",
            "gloss": {
              "en": "I see. Could you tell me the orderer's name and the order number?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "주문자는 정다은이고요, 주문 번호는 에이 칠칠공삼이에요.",
        "gloss": {
          "en": "The order is under Jung Daeun, and the order number is A seven seven zero three."
        }
      },
      {
        "who": "them",
        "text": "확인해 보니 물류센터 입고가 늦어지는 바람에 배송이 지연되고 있습니다.",
        "gloss": {
          "en": "I've checked, and the delivery is delayed because the item arrived late at the distribution center."
        },
        "alt": [
          {
            "text": "조회해 보니까 창고 입고가 밀려서 아직 출고가 안 됐네요.",
            "gloss": {
              "en": "I've looked it up, and because the warehouse was backed up, it hasn't shipped yet."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "근데 주문할 때는 분명히 화요일까지 도착한다고 되어 있었거든요.",
        "gloss": {
          "en": "But when I ordered, it definitely said it would arrive by Tuesday."
        }
      },
      {
        "who": "them",
        "text": "네, 맞습니다. 안내해 드린 날짜보다 늦어져서 정말 죄송합니다.",
        "gloss": {
          "en": "Yes, that's right. I'm very sorry it's later than the date we gave you."
        },
        "alt": [
          {
            "text": "네, 말씀하신 대로 화요일 도착 예정이었는데 늦어져서 죄송합니다.",
            "gloss": {
              "en": "Yes, as you said, it was due Tuesday, and I'm sorry it's late."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "이번 주말에 집들이가 있어서 그 전에 꼭 받아야 되거든요. 언제쯤 받을 수 있을까요?",
        "gloss": {
          "en": "I'm having a housewarming this weekend, so I really need it before then. When can I expect it?"
        }
      },
      {
        "who": "them",
        "text": "지금으로서는 다음 주 월요일 출고 예정이라 주말 전에는 어려우실 텐데요.",
        "gloss": {
          "en": "As of now it's scheduled to ship next Monday, so before the weekend will probably be difficult."
        },
        "alt": [
          {
            "text": "확인해 보니 다음 주 월요일에 출고될 예정이라서, 주말까지는 좀 힘드실 것 같아요.",
            "gloss": {
              "en": "It looks like it's due to ship next Monday, so it might be hard to get it by the weekend."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그럼 좀 곤란한데요. 혹시 다른 지역 창고에 재고가 있는지 확인해 주실 수 있을까요?",
        "gloss": {
          "en": "That's a bit of a problem, then. Could you check whether a warehouse in another region has it in stock?"
        }
      },
      {
        "who": "them",
        "text": "네, 잠시만요… 부산 창고에 같은 색상이 하나 남아 있긴 한데, 배송비가 추가될 수 있어요.",
        "gloss": {
          "en": "Sure, one moment… There is one left in the same color at the Busan warehouse, but there may be an extra shipping charge."
        },
        "alt": [
          {
            "text": "잠시만 기다려 주세요. 다른 창고에 재고가 있긴 한데요, 이 경우에는 추가 배송비가 발생합니다.",
            "gloss": {
              "en": "Please hold on. Another warehouse does have stock, but in that case there's an additional shipping fee."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "배송이 늦어진 건 제 잘못이 아니잖아요. 추가 비용은 좀 그런 것 같아요.",
        "gloss": {
          "en": "The delay isn't my fault, though. An extra charge doesn't seem quite right."
        }
      },
      {
        "who": "them",
        "text": "맞는 말씀이세요. 그럼 추가 배송비 없이 금요일까지 받으실 수 있게 처리해 드리겠습니다.",
        "gloss": {
          "en": "You're right. Then I'll arrange it so you receive it by Friday with no extra shipping fee."
        },
        "alt": [
          {
            "text": "네, 고객님 말씀이 맞습니다. 이번에는 추가 비용 없이 금요일 도착으로 진행해 드릴게요.",
            "gloss": {
              "en": "Yes, you're right. This time we'll arrange Friday delivery with no extra charge."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "감사합니다. 그럼 출발하면 문자로 알려 주세요.",
        "gloss": {
          "en": "Thank you. Then please text me once it's on its way."
        }
      }
    ],
    "expressions": []
  },
  {
    "id": "ko-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Discussing a news story over lunch with coworkers",
      "ko": "점심 먹으며 동료와 뉴스 이야기하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "지은 씨, 오늘 아침 뉴스 봤어요? 정부에서 주 사일제를 시범 운영한대요.",
        "gloss": {
          "en": "Jieun, did you see the news this morning? They say the government is piloting a four-day work week."
        }
      },
      {
        "who": "me",
        "text": "네, 봤어요. 제가 알기로는 일단 공공기관부터 시작한대요.",
        "gloss": {
          "en": "Yes, I saw it. As far as I know, they're starting with public institutions first."
        }
      },
      {
        "who": "them",
        "text": "우리 회사도 하면 좋겠다. 금요일마다 쉬면 얼마나 좋아요.",
        "gloss": {
          "en": "I wish our company would do it too. How great would it be to have every Friday off?"
        },
        "alt": [
          {
            "text": "와, 우리도 빨리 했으면 좋겠어요. 매주 삼 일 연휴잖아요.",
            "gloss": {
              "en": "Wow, I hope we get it soon too. It'd be a three-day weekend every week."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "그러게요. 근데 솔직히 말하면, 저는 좀 걱정되는 부분도 있거든요.",
        "gloss": {
          "en": "I know, right? But to be honest, there's something that worries me a bit."
        }
      },
      {
        "who": "them",
        "text": "왜요? 쉬는 날 많으면 좋잖아요.",
        "gloss": {
          "en": "Why? More days off is a good thing, isn't it?"
        },
        "alt": [
          {
            "text": "어떤 게요? 쉬는 거 싫어하는 사람도 있어요?",
            "gloss": {
              "en": "What do you mean? Is there anyone who doesn't like time off?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "쉬는 건 좋은데, 일은 그대로면 나머지 나흘 동안 야근이 늘어날 텐데요.",
        "gloss": {
          "en": "Time off is nice, but if the workload stays the same, there'll probably be more overtime on the other four days."
        }
      },
      {
        "who": "them",
        "text": "아, 듣고 보니 그렇네요.",
        "gloss": {
          "en": "Oh, now that you mention it, that's true."
        },
        "alt": [
          {
            "text": "아, 그 생각은 못 했네요.",
            "gloss": {
              "en": "Oh, I hadn't thought of that."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "제 친구 회사가 작년에 비슷하게 해 봤는데, 처음 몇 달은 다들 엄청 힘들어하더라고요.",
        "gloss": {
          "en": "My friend's company tried something similar last year, and I heard everyone really struggled the first few months."
        }
      },
      {
        "who": "them",
        "text": "그래요? 그래서 결국 그만뒀대요?",
        "gloss": {
          "en": "Really? So did they end up giving it up?"
        },
        "alt": [
          {
            "text": "진짜요? 그럼 지금은 다시 원래대로 돌아갔대요?",
            "gloss": {
              "en": "Really? So have they gone back to how it was?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "아니요, 회의를 반으로 줄이니까 오히려 괜찮아졌대요.",
        "gloss": {
          "en": "No, apparently once they cut meetings in half, things actually got better."
        }
      },
      {
        "who": "them",
        "text": "하긴 우리도 쓸데없는 회의가 좀 많잖아요.",
        "gloss": {
          "en": "Well, we do have quite a few pointless meetings ourselves, you know."
        },
        "alt": [
          {
            "text": "그건 맞아요. 우리 회사도 회의만 줄여도 훨씬 나을 거예요.",
            "gloss": {
              "en": "That's true. Our company would be much better off just cutting meetings."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "맞아요. 아무튼 무조건 좋다, 나쁘다 하기보다는 회사 상황에 맞게 하는 게 중요한 것 같아요.",
        "gloss": {
          "en": "Right. Anyway, rather than calling it simply good or bad, I think what matters is fitting it to each company's situation."
        }
      },
      {
        "who": "them",
        "text": "그 말이 맞네요. 그건 그렇고, 커피 마시러 갈래요? 오늘은 제가 살게요.",
        "gloss": {
          "en": "You're right about that. Anyway, want to go get coffee? It's on me today."
        },
        "alt": [
          {
            "text": "역시 지은 씨 말 들으면 정리가 돼요. 아, 커피 한잔하고 들어갈래요? 제가 쏠게요.",
            "gloss": {
              "en": "Talking to you always helps me sort things out. Oh, want to grab a coffee before we head back? My treat."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "좋아요! 대신 다음엔 제가 살게요.",
        "gloss": {
          "en": "Sounds good! But next time it's on me."
        }
      }
    ],
    "expressions": [
      "제가 알기로는",
      "솔직히 말하면",
      "아무튼"
    ]
  },
  {
    "id": "ko-4-x1",
    "stage": 4,
    "setting": {
      "en": "Running into an old friend on the street",
      "ko": "길에서 오랜만에 친구 만나기"
    },
    "expressions": [
      "오랜만이야",
      "별일 없지",
      "그럴 줄 알았어",
      "그건 그렇고"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어? 너 여기서 뭐 해?",
        "gloss": {
          "en": "Huh? What are you doing here?"
        }
      },
      {
        "who": "me",
        "text": "와, 진짜 오랜만이야! 졸업하고 처음 보는 거지? 별일 없지?",
        "gloss": {
          "en": "Wow, it's been ages! First time since graduation, right? Everything okay with you?"
        }
      },
      {
        "who": "them",
        "text": "응, 그냥 그렇지 뭐. 아, 나 지난달에 결국 회사 옮겼어.",
        "gloss": {
          "en": "Yeah, same old. Oh, I finally switched companies last month."
        }
      },
      {
        "who": "me",
        "text": "그럴 줄 알았어. 너 전부터 거기 힘들다고 했잖아.",
        "gloss": {
          "en": "I knew it. You'd been saying it was rough there for a while."
        }
      },
      {
        "who": "them",
        "text": "맞아. 지금은 훨씬 편해. 너는 아직 그 동네 살아?",
        "gloss": {
          "en": "Yeah. It's way easier now. Do you still live in that neighborhood?"
        }
      },
      {
        "who": "me",
        "text": "응, 그대로야. 그건 그렇고, 너 번호 안 바뀌었지? 우리 언제 밥 한번 먹자.",
        "gloss": {
          "en": "Yeah, same place. Anyway, your number's still the same, right? Let's grab a meal sometime."
        }
      },
      {
        "who": "them",
        "text": "그대로야. 이번엔 진짜 연락할게.",
        "gloss": {
          "en": "Same number. This time I'll actually call."
        }
      },
      {
        "who": "me",
        "text": "약속했다! 연락 기다릴게.",
        "gloss": {
          "en": "You promised! I'll be waiting."
        }
      }
    ]
  },
  {
    "id": "ko-4-x2",
    "stage": 4,
    "setting": {
      "en": "Feedback on a design draft from a team leader",
      "ko": "팀장에게 디자인 시안 피드백 받기"
    },
    "expressions": [
      "듣고 보니",
      "검토해 보겠습니다",
      "어쩔 수 없죠"
    ],
    "lines": [
      {
        "who": "them",
        "text": "지수 씨, 어제 보낸 시안 봤어요. 근데 색이 좀 어둡다는 의견이 있었어요.",
        "gloss": {
          "en": "Jisu, I saw the draft you sent yesterday. But some people felt the colors were a bit dark."
        }
      },
      {
        "who": "me",
        "text": "아, 그래요? 저는 차분해서 괜찮다고 생각했는데요.",
        "gloss": {
          "en": "Oh, really? I thought it was fine because it felt calm."
        }
      },
      {
        "who": "them",
        "text": "저도 처음엔 그랬는데, 휴대폰 화면으로 보니까 글씨가 잘 안 보이더라고요.",
        "gloss": {
          "en": "I thought so too at first, but on a phone screen the text was hard to read."
        }
      },
      {
        "who": "me",
        "text": "듣고 보니 그렇네요. 휴대폰 화면 기준으로 다시 검토해 보겠습니다.",
        "gloss": {
          "en": "Now that you mention it, you're right. I'll go over it again with phone screens in mind."
        }
      },
      {
        "who": "them",
        "text": "고마워요. 다만 수정하면 발표 날짜는 좀 미뤄야 할 것 같아요.",
        "gloss": {
          "en": "Thanks. Though if we revise it, we'll probably have to push back the presentation date a bit."
        }
      },
      {
        "who": "me",
        "text": "어쩔 수 없죠. 제대로 하는 게 더 중요하니까요.",
        "gloss": {
          "en": "It can't be helped. Doing it right matters more."
        }
      }
    ]
  },
  {
    "id": "ko-4-x3",
    "stage": 4,
    "setting": {
      "en": "Reassuring a friend after a tense meeting",
      "ko": "회의 뒤 걱정하는 친구 달래기"
    },
    "expressions": [
      "신경 쓰지 마",
      "그 말이 맞네"
    ],
    "lines": [
      {
        "who": "them",
        "text": "아까 회의에서 내가 한 말 때문에 팀장님 기분 상하신 것 같아.",
        "gloss": {
          "en": "I think the team leader got upset because of what I said in the meeting earlier."
        }
      },
      {
        "who": "me",
        "text": "에이, 신경 쓰지 마. 팀장님 원래 표정이 그래.",
        "gloss": {
          "en": "Come on, don't worry about it. That's just how the team leader's face always looks."
        }
      },
      {
        "who": "them",
        "text": "그래도 내가 좀 세게 말하긴 했어. 따로 말씀드리는 게 낫겠지?",
        "gloss": {
          "en": "Still, I did say it pretty harshly. It'd be better to talk to him separately, right?"
        }
      },
      {
        "who": "me",
        "text": "그 말이 맞네. 그러면 너도 마음이 편할 거야.",
        "gloss": {
          "en": "You're right. That way you'll feel better too."
        }
      },
      {
        "who": "them",
        "text": "그래, 점심 먹고 잠깐 찾아가 봐야겠다.",
        "gloss": {
          "en": "Okay, I'll stop by for a minute after lunch."
        }
      },
      {
        "who": "me",
        "text": "응, 잘될 거야. 너무 걱정하지 마.",
        "gloss": {
          "en": "Yeah, it'll go fine. Don't worry too much."
        }
      }
    ]
  },
  {
    "id": "ko-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Declining weekend work from a manager",
      "ko": "과장님의 주말 근무 부탁 거절하기"
    },
    "goal": {
      "en": "Turn down the weekend work without sounding unwilling, and offer something useful instead",
      "ko": "하기 싫어 보이지 않게 주말 근무를 거절하고, 대신 도울 방법을 제안하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "수빈 씨, 잠깐 시간 돼?",
        "gloss": {
          "en": "Subin, got a minute?"
        }
      },
      {
        "who": "me",
        "text": "네, 과장님. 무슨 일 있으세요?",
        "gloss": {
          "en": "Yes, sir. Is something up?"
        }
      },
      {
        "who": "them",
        "text": "다름이 아니라, 이번 토요일에 박람회 부스 좀 같이 지켜 줄 수 있나 해서. 한 명이 갑자기 빠져서 말이야.",
        "gloss": {
          "en": "It's just that I was wondering if you could help staff the expo booth this Saturday. Someone suddenly dropped out."
        }
      },
      {
        "who": "me",
        "text": "아… 이번 토요일이요? 그게… 제가 사정이 좀 있어서요.",
        "gloss": {
          "en": "Ah… this Saturday? Well… I've got something going on."
        }
      },
      {
        "who": "them",
        "text": "무슨 일 있어? 웬만하면 수빈 씨가 와 주면 좋겠는데.",
        "gloss": {
          "en": "Something come up? I'd really like it if you could come, if at all possible."
        }
      },
      {
        "who": "me",
        "text": "사실 그날 동생 결혼식이거든요. 도와드리고 싶은 마음은 굴뚝같은데, 이번에는 정말 빠지기가 어려울 것 같아요.",
        "gloss": {
          "en": "Actually, my sibling's wedding is that day. I'd really love to help, but this time I honestly don't think I can skip it."
        }
      },
      {
        "who": "them",
        "text": "아, 결혼식이면 어쩔 수 없지. 그건 당연히 가야지.",
        "gloss": {
          "en": "Oh, a wedding — then there's nothing to be done. Of course you have to go."
        }
      },
      {
        "who": "me",
        "text": "죄송해요. 괜히 저 때문에 일정이 꼬일까 봐 마음에 걸리네요.",
        "gloss": {
          "en": "I'm sorry. It weighs on me that the schedule might get messed up because of me."
        }
      },
      {
        "who": "them",
        "text": "아니야, 내가 갑자기 말한 거니까. 근데 사람을 어디서 구하나…",
        "gloss": {
          "en": "No, I'm the one who asked out of the blue. But where am I going to find someone…"
        }
      },
      {
        "who": "me",
        "text": "혹시 영업팀 민호 씨한테 한번 물어보시는 건 어떨까요? 지난번 박람회 때도 부스를 맡았었거든요.",
        "gloss": {
          "en": "How about asking Minho on the sales team? He handled the booth at the last expo too."
        }
      },
      {
        "who": "them",
        "text": "아, 맞다. 그 친구가 해 봤지. 좋은 생각이네.",
        "gloss": {
          "en": "Oh, right. He's done it before. Good idea."
        }
      },
      {
        "who": "me",
        "text": "그리고 부스 자료는 금요일까지 제가 다 챙겨 놓을게요. 당일엔 신경 안 쓰셔도 되게요.",
        "gloss": {
          "en": "And I'll have all the booth materials ready by Friday, so you won't have to worry about them on the day."
        }
      },
      {
        "who": "them",
        "text": "그렇게만 해 줘도 큰 도움이지. 고마워.",
        "gloss": {
          "en": "That alone is a big help. Thanks."
        }
      },
      {
        "who": "me",
        "text": "아니에요. 다음에 이런 일 있으면 그땐 제가 먼저 나설게요.",
        "gloss": {
          "en": "Not at all. If something like this comes up again, I'll be the first to volunteer."
        }
      },
      {
        "who": "them",
        "text": "말이라도 고맙네. 결혼식 잘 다녀오고, 동생한테 축하한다고 전해 줘.",
        "gloss": {
          "en": "Thanks for saying so. Enjoy the wedding, and pass on my congratulations to your sibling."
        }
      },
      {
        "who": "me",
        "text": "네, 감사합니다, 과장님. 월요일에 박람회 어땠는지 꼭 들려주세요.",
        "gloss": {
          "en": "Will do, thank you. Be sure to tell me how the expo went on Monday."
        }
      }
    ],
    "expressions": [
      "사정이 좀 있어서",
      "마음은 굴뚝같은데",
      "마음에 걸려요"
    ]
  },
  {
    "id": "ko-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Comforting a friend who just quit their job",
      "ko": "방금 회사를 그만둔 친구 위로하기"
    },
    "goal": {
      "en": "Comfort your friend and help them see the decision positively without brushing off their worries",
      "ko": "친구의 걱정을 가볍게 넘기지 않으면서 위로하고, 그만둔 결정을 긍정적으로 보게 돕기"
    },
    "lines": [
      {
        "who": "them",
        "text": "나 결국 회사 그만뒀어.",
        "gloss": {
          "en": "I finally quit my job."
        }
      },
      {
        "who": "me",
        "text": "진짜? 언제? 아니, 일단 고생 많았어.",
        "gloss": {
          "en": "Seriously? When? No wait — first of all, you've been through a lot."
        }
      },
      {
        "who": "them",
        "text": "어제 사직서 냈어. 막상 내고 나니까 기분이 좀 이상하더라.",
        "gloss": {
          "en": "I handed in my resignation yesterday. Once I actually did it, I felt kind of weird."
        }
      },
      {
        "who": "me",
        "text": "그럴 만도 하지. 삼 년 넘게 다닌 데잖아. 시원섭섭하겠다.",
        "gloss": {
          "en": "No wonder. You were there over three years. It must be bittersweet."
        }
      },
      {
        "who": "them",
        "text": "응, 속은 시원한데… 한편으로는 괜히 했나 싶기도 하고.",
        "gloss": {
          "en": "Yeah, I feel relieved… but part of me wonders if I shouldn't have."
        }
      },
      {
        "who": "me",
        "text": "야, 괜히 한 거 아니야. 너 작년부터 매일 야근하다가 몸까지 상했잖아.",
        "gloss": {
          "en": "Hey, it wasn't for nothing. You've been working late every day since last year, and it wrecked your health."
        }
      },
      {
        "who": "them",
        "text": "그렇긴 한데, 다들 버티는데 나만 도망친 것 같아서.",
        "gloss": {
          "en": "That's true, but everyone else is sticking it out, and I feel like I'm the only one who ran away."
        }
      },
      {
        "who": "me",
        "text": "무슨 소리야. 버티는 게 꼭 정답은 아니지. 나 같으면 진작 그만뒀을걸.",
        "gloss": {
          "en": "What are you talking about? Sticking it out isn't always the answer. If it were me, I'd have quit ages ago."
        }
      },
      {
        "who": "them",
        "text": "근데 이제 뭐 하지? 모아 둔 돈도 많지 않은데.",
        "gloss": {
          "en": "But what do I do now? I don't have much saved up."
        }
      },
      {
        "who": "me",
        "text": "당장 뭘 정하려고 하지 마. 한 달 정도는 그냥 푹 쉬어도 돼. 그동안 너무 달렸잖아.",
        "gloss": {
          "en": "Don't try to decide anything right away. It's fine to just rest properly for a month or so. You've been running nonstop."
        }
      },
      {
        "who": "them",
        "text": "부모님은 또 뭐라고 하실지…",
        "gloss": {
          "en": "And who knows what my parents will say…"
        }
      },
      {
        "who": "me",
        "text": "처음엔 걱정하시겠지. 그래도 네가 얼마나 힘들었는지 아시면 이해하실 거야.",
        "gloss": {
          "en": "They'll worry at first. But once they know how hard it was for you, they'll understand."
        }
      },
      {
        "who": "them",
        "text": "네 말 들으니까 좀 낫다. 혼자 있으면 생각이 자꾸 꼬리에 꼬리를 물어서.",
        "gloss": {
          "en": "Hearing you say that helps. When I'm alone, one thought just keeps leading to another."
        }
      },
      {
        "who": "me",
        "text": "그럴 땐 혼자 끙끙대지 말고 연락해. 말이 나온 김에, 오늘 저녁에 한잔할래?",
        "gloss": {
          "en": "When that happens, don't stew over it alone — call me. And while we're on it, want to grab a drink tonight?"
        }
      },
      {
        "who": "them",
        "text": "좋지. 근데 오늘은 내가 살게. 퇴사 기념으로.",
        "gloss": {
          "en": "Sure. But it's on me tonight. To celebrate quitting."
        }
      },
      {
        "who": "me",
        "text": "무슨 소리야, 백수한테 얻어먹을 순 없지. 오늘은 내가 쏜다.",
        "gloss": {
          "en": "No way, I can't let an unemployed person treat me. Tonight's on me."
        }
      }
    ],
    "expressions": [
      "고생 많았어",
      "그럴 만도 하지",
      "시원섭섭하다",
      "괜히 했다",
      "말이 나온 김에",
      "한잔해"
    ]
  },
  {
    "id": "ko-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Small talk with seniors at a company dinner (회식)",
      "ko": "회식 자리에서 상사와 가볍게 이야기하기"
    },
    "goal": {
      "en": "Keep the conversation warm and respectful with your seniors, and handle the drinking politely",
      "ko": "상사들과 예의 있으면서도 편안한 분위기로 대화하고, 술자리를 무난하게 넘기기"
    },
    "lines": [
      {
        "who": "them",
        "text": "자, 다들 잔 채웠지? 지우 씨는 회사 들어온 지 얼마나 됐지?",
        "gloss": {
          "en": "Alright, everyone's glass full? Jiwoo, how long has it been since you joined?"
        }
      },
      {
        "who": "me",
        "text": "이번 달로 딱 석 달 됐습니다, 부장님.",
        "gloss": {
          "en": "It's been exactly three months as of this month, sir."
        }
      },
      {
        "who": "them",
        "text": "벌써 그렇게 됐나? 어때, 일은 좀 할 만해?",
        "gloss": {
          "en": "Has it been that long already? So, how's the work — manageable?"
        }
      },
      {
        "who": "me",
        "text": "처음엔 정신이 없었는데, 선배님들 덕분에 이제 조금 감이 잡히는 것 같아요.",
        "gloss": {
          "en": "It was hectic at first, but thanks to all of you, I think I'm starting to get the hang of it."
        }
      },
      {
        "who": "them",
        "text": "하하, 말도 잘하네. 근데 술은 좀 해?",
        "gloss": {
          "en": "Ha, you've got a way with words. So, do you drink?"
        }
      },
      {
        "who": "me",
        "text": "마시기는 하는데 많이는 못 마셔요. 그래도 이런 자리는 좋아합니다.",
        "gloss": {
          "en": "I do drink, but I can't drink much. Still, I enjoy get-togethers like this."
        }
      },
      {
        "who": "them",
        "text": "괜찮아, 요즘은 억지로 안 시켜. 우리 때는 진짜 장난 아니었는데.",
        "gloss": {
          "en": "That's fine, nobody forces anyone these days. Back in our day, it was no joke."
        }
      },
      {
        "who": "me",
        "text": "저도 그런 얘기 들었어요. 그때는 회식이 새벽까지 갔다면서요?",
        "gloss": {
          "en": "I've heard about that too. I heard company dinners went on until dawn back then?"
        }
      },
      {
        "who": "them",
        "text": "말도 마. 이 차, 삼 차는 기본이었지. 다음 날 멀쩡한 척하느라 다들 고생했어.",
        "gloss": {
          "en": "Don't get me started. Second and third rounds were standard. Everyone had a hard time pretending to be fine the next day."
        }
      },
      {
        "who": "me",
        "text": "하하, 상상이 돼요. 그래도 그게 지금까지 다 추억으로 남은 셈이네요.",
        "gloss": {
          "en": "Ha, I can picture it. Still, it all ended up becoming good memories, I guess."
        }
      },
      {
        "who": "them",
        "text": "그렇지. 아, 지우 씨는 고향이 어디라고 했지?",
        "gloss": {
          "en": "That's true. Oh, Jiwoo, where did you say you're from?"
        }
      },
      {
        "who": "me",
        "text": "대구입니다. 부장님도 경상도 쪽이시라고 들었는데요.",
        "gloss": {
          "en": "Daegu, sir. I heard you're from the Gyeongsang area too."
        }
      },
      {
        "who": "them",
        "text": "어, 나 부산이야! 어쩐지 말투가 정겹더라.",
        "gloss": {
          "en": "Yeah, I'm from Busan! No wonder your accent felt familiar."
        }
      },
      {
        "who": "me",
        "text": "역시 그러셨구나. 다음에 부산 맛집 좀 알려 주세요.",
        "gloss": {
          "en": "I thought so. Please tell me some good places to eat in Busan sometime."
        }
      },
      {
        "who": "them",
        "text": "그럼, 내가 발이 넓어서 아는 데 많지. 자, 우리 막내를 위해서 한잔하자!",
        "gloss": {
          "en": "Of course — I know a lot of people, so I know plenty of places. Now, let's have a toast to our newest member!"
        }
      },
      {
        "who": "me",
        "text": "감사합니다, 부장님! 제가 먼저 한 잔 따라 드릴게요.",
        "gloss": {
          "en": "Thank you, sir! Let me pour you a drink first."
        }
      }
    ],
    "expressions": [
      "선배님 덕분에"
    ]
  },
  {
    "id": "ko-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Explaining a variety show joke to a foreign friend",
      "ko": "외국인 친구에게 예능 속 농담 설명하기"
    },
    "goal": {
      "en": "Explain the proverb behind the joke and why it was funny, so your friend really gets it",
      "ko": "농담에 쓰인 속담과 웃긴 이유를 설명해서 친구가 제대로 이해하게 하기"
    },
    "lines": [
      {
        "who": "them",
        "text": "아까 그 장면에서 다들 왜 그렇게 웃은 거야? 나만 못 알아들었어.",
        "gloss": {
          "en": "Why was everyone laughing so hard at that scene earlier? I was the only one who didn't get it."
        }
      },
      {
        "who": "me",
        "text": "어느 장면? 아, 그 형이 미션 끝나기도 전에 좋아하니까 \"김칫국부터 마시네\" 한 거?",
        "gloss": {
          "en": "Which scene? Oh, when that guy celebrated before the mission was even over and someone said \"drinking the kimchi soup first\"?"
        }
      },
      {
        "who": "them",
        "text": "응, 그거. 갑자기 김칫국이 왜 나와? 밥 먹는 장면도 아니었잖아.",
        "gloss": {
          "en": "Yeah, that. Why kimchi soup all of a sudden? They weren't even eating."
        }
      },
      {
        "who": "me",
        "text": "그게 속담이거든. 원래는 \"떡 줄 사람은 생각도 안 하는데 김칫국부터 마신다\"야.",
        "gloss": {
          "en": "It's a proverb. The full version is \"The person with the rice cakes isn't even thinking of giving you any, and you're already drinking the kimchi soup.\""
        }
      },
      {
        "who": "them",
        "text": "떡이랑 김칫국이 무슨 상관인데?",
        "gloss": {
          "en": "What do rice cakes have to do with kimchi soup?"
        }
      },
      {
        "who": "me",
        "text": "옛날에는 떡 먹을 때 목 막히지 말라고 김칫국을 같이 마셨대. 근데 아무도 떡을 준다고 안 했는데 혼자 김칫국부터 들이켜는 거지.",
        "gloss": {
          "en": "Apparently people used to drink kimchi soup with rice cakes so they wouldn't choke. But here, nobody's offered you any rice cakes, and you're already gulping down the soup."
        }
      },
      {
        "who": "them",
        "text": "아, 그러니까 아직 아무것도 안 정해졌는데 혼자 기대한다는 거네?",
        "gloss": {
          "en": "Oh, so it means getting your hopes up when nothing's been decided yet?"
        }
      },
      {
        "who": "me",
        "text": "그렇지! 눈치가 빠르네. 결과도 안 나왔는데 혼자 신난 사람한테 하는 말이야. 친구끼리는 그냥 '김칫국 마시지 마' 이렇게도 많이 해.",
        "gloss": {
          "en": "Exactly! You catch on fast. It's what you say to someone who's excited before the results are even in. Between friends people also just say \"don't drink the kimchi soup.\""
        }
      },
      {
        "who": "them",
        "text": "아 그렇구나. 근데 그게 그렇게까지 웃겨?",
        "gloss": {
          "en": "Ah, I see. But is that really that funny?"
        }
      },
      {
        "who": "me",
        "text": "그 형이 원래 맨날 큰소리치다가 꼭 마지막에 지는 캐릭터거든. 다들 이번에도 그럴 줄 알았던 거지.",
        "gloss": {
          "en": "That guy's whole character is that he always brags and then loses at the very end. Everyone figured it'd happen again."
        }
      },
      {
        "who": "them",
        "text": "아, 그래서 자막에 \"또?\" 이렇게 나온 거구나.",
        "gloss": {
          "en": "Oh, so that's why the caption said \"Again?\""
        }
      },
      {
        "who": "me",
        "text": "맞아. 게다가 결국 진짜 졌잖아. 그래서 더 빵 터진 거야.",
        "gloss": {
          "en": "Right. And then he actually lost in the end. That's why it got such a big laugh."
        }
      },
      {
        "who": "them",
        "text": "이제야 이해가 되네. 설명 들으니까 진짜 웃기다.",
        "gloss": {
          "en": "Now I finally get it. After hearing the explanation, it's actually really funny."
        }
      },
      {
        "who": "me",
        "text": "이런 건 맥락을 알아야 웃기니까, 처음엔 못 알아들을 만하지.",
        "gloss": {
          "en": "This kind of thing is only funny if you know the context, so it makes sense you didn't get it at first."
        }
      },
      {
        "who": "them",
        "text": "너는 어떻게 그런 걸 다 알아?",
        "gloss": {
          "en": "How do you know all this stuff?"
        }
      },
      {
        "who": "me",
        "text": "나도 처음엔 하나도 몰랐어. 근데 예능을 매일 보다 보니까 저절로 귀가 트이더라.",
        "gloss": {
          "en": "I didn't get any of it at first either. But after watching variety shows every day, my ear just opened up on its own."
        }
      }
    ],
    "expressions": [
      "눈치가 빠르네",
      "김칫국 마시지 마"
    ]
  },
  {
    "id": "ko-5-x1",
    "stage": 5,
    "setting": {
      "en": "Hearing about a friend's housewarming party",
      "ko": "친구 집들이 이야기 듣기"
    },
    "expressions": [
      "발이 넓다",
      "손이 크다"
    ],
    "lines": [
      {
        "who": "them",
        "text": "어제 수진이 집들이 갔다며? 사람 많았어?",
        "gloss": {
          "en": "I heard you went to Sujin's housewarming yesterday? Were there a lot of people?"
        }
      },
      {
        "who": "me",
        "text": "응, 엄청 많았어. 수진이가 발이 넓잖아. 회사 사람에 동네 친구까지 다 왔더라.",
        "gloss": {
          "en": "Yeah, tons. Sujin knows everybody. Coworkers, neighborhood friends, everyone came."
        }
      },
      {
        "who": "them",
        "text": "음식은? 수진이 요리 잘하잖아.",
        "gloss": {
          "en": "What about the food? Sujin's a great cook."
        }
      },
      {
        "who": "me",
        "text": "말도 마. 손이 커서 음식을 산더미처럼 해 놨어. 다들 싸 가지고 갔어.",
        "gloss": {
          "en": "Don't even ask. She's so generous she made mountains of food. Everyone took some home."
        }
      },
      {
        "who": "them",
        "text": "역시. 나도 갈 걸 그랬다.",
        "gloss": {
          "en": "Of course. I should have gone too."
        }
      },
      {
        "who": "me",
        "text": "다음에 또 한대. 그때는 꼭 같이 가자.",
        "gloss": {
          "en": "She says she'll do it again. Let's definitely go together then."
        }
      }
    ]
  },
  {
    "id": "ko-5-x2",
    "stage": 5,
    "setting": {
      "en": "Turning down a gym membership offer",
      "ko": "헬스장 등록 권유 정중하게 거절하기"
    },
    "expressions": [
      "생각 좀 해 볼게요",
      "다음 기회에"
    ],
    "lines": [
      {
        "who": "them",
        "text": "회원님, 오늘 등록하시면 개인 레슨을 무료로 드려요. 오늘까지만 하는 이벤트예요.",
        "gloss": {
          "en": "If you sign up today, you get personal training sessions for free. The promotion ends today."
        }
      },
      {
        "who": "me",
        "text": "아, 좋긴 한데요… 금액이 커서 생각 좀 해 볼게요.",
        "gloss": {
          "en": "Oh, it sounds good, but… it's a big amount, so I'll think about it."
        }
      },
      {
        "who": "them",
        "text": "그럼 오늘 한 번 체험해 보시는 건 어떠세요?",
        "gloss": {
          "en": "Then how about trying a session today?"
        }
      },
      {
        "who": "me",
        "text": "오늘은 약속이 있어서요. 다음 기회에 할게요.",
        "gloss": {
          "en": "I have plans today. I'll do it another time."
        }
      },
      {
        "who": "them",
        "text": "아쉽네요. 그럼 연락처 남겨 주시면 이벤트 있을 때 알려 드릴게요.",
        "gloss": {
          "en": "That's a shame. If you leave your number, we'll let you know about promotions."
        }
      },
      {
        "who": "me",
        "text": "네, 그렇게 해 주세요. 감사합니다.",
        "gloss": {
          "en": "Sure, please do. Thank you."
        }
      }
    ]
  },
  {
    "id": "ko-5-x3",
    "stage": 5,
    "setting": {
      "en": "A friend shares a secret",
      "ko": "친구가 비밀 털어놓기"
    },
    "expressions": [
      "입이 무겁다",
      "눈치 보지 마"
    ],
    "lines": [
      {
        "who": "them",
        "text": "나 너한테만 말하는 건데… 다음 달에 회사 그만둘 거야.",
        "gloss": {
          "en": "I'm only telling you this… I'm quitting my job next month."
        }
      },
      {
        "who": "me",
        "text": "진짜? 걱정 마. 나 입이 무거운 거 알잖아.",
        "gloss": {
          "en": "Really? Don't worry. You know I can keep a secret."
        }
      },
      {
        "who": "them",
        "text": "응, 그래서 너한테 말하는 거야. 근데 팀장님한테는 아직 말을 못 했어. 다들 바쁜 때라서.",
        "gloss": {
          "en": "Yeah, that's why I'm telling you. But I haven't told my team leader yet. Everyone's so busy right now."
        }
      },
      {
        "who": "me",
        "text": "눈치 보지 마. 네 인생인데 네가 정하는 거지.",
        "gloss": {
          "en": "Don't worry about what others think. It's your life, it's your call."
        }
      },
      {
        "who": "them",
        "text": "그렇긴 한데, 괜히 미안하더라고.",
        "gloss": {
          "en": "I know, but I still feel kind of guilty."
        }
      },
      {
        "who": "me",
        "text": "그 마음은 알아. 그래도 말할 거면 빨리 하는 게 서로 편해.",
        "gloss": {
          "en": "I get that. But if you're going to tell them, sooner is easier for everyone."
        }
      }
    ]
  },
  {
    "id": "ko-5-x4",
    "stage": 5,
    "setting": {
      "en": "A friend stands up to a line-cutter",
      "ko": "새치기한 사람 이야기"
    },
    "expressions": [
      "어이가 없네",
      "속이 시원하다"
    ],
    "lines": [
      {
        "who": "them",
        "text": "아까 편의점에서 어떤 아저씨가 줄 다 무시하고 맨 앞에 끼어들었어.",
        "gloss": {
          "en": "Earlier at the convenience store, some guy ignored the whole line and cut right to the front."
        }
      },
      {
        "who": "me",
        "text": "뭐? 어이가 없네. 그래서 가만히 있었어?",
        "gloss": {
          "en": "What? Unbelievable. So did you just let it go?"
        }
      },
      {
        "who": "them",
        "text": "아니, 내가 \"뒤에 줄 있어요\" 했지. 그랬더니 뒤에 있던 사람들도 다 한마디씩 하더라.",
        "gloss": {
          "en": "No, I said, \"There's a line back here.\" Then everyone behind me chimed in too."
        }
      },
      {
        "who": "me",
        "text": "잘했다! 듣기만 해도 속이 시원하다.",
        "gloss": {
          "en": "Good for you! Just hearing it makes me feel so much better."
        }
      },
      {
        "who": "them",
        "text": "결국 그 아저씨가 민망했는지 맨 뒤로 가더라.",
        "gloss": {
          "en": "In the end he must have been embarrassed, because he went to the back."
        }
      },
      {
        "who": "me",
        "text": "당연하지. 그런 건 누가 한 번은 말해 줘야 돼.",
        "gloss": {
          "en": "Of course. Someone has to say something to people like that."
        }
      }
    ]
  }
];
