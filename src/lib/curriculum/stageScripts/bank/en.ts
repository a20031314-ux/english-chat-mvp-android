import type { StageScript } from "../../stageScripts.ts";

/**
 * en 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 줄 8개, 내 줄에 그 단계 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전.
 */
export const EN_BANK: StageScript[] = [
  {
    "id": "en-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a coffee shop counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "thanks a lot"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! What can I get for you?",
        "gloss": {
          "en": "Hi! What can I get for you?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Can I have a coffee, please?",
        "gloss": {
          "en": "Can I have a coffee, please?",
          "ko": "커피 한 잔 주시겠어요?"
        },
        "frames": [
          "en-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Hot or iced?",
        "gloss": {
          "en": "Sure. Hot or iced?",
          "ko": "네. 뜨거운 걸로요, 아이스로요?"
        }
      },
      {
        "who": "me",
        "text": "Hot, please. How much is it?",
        "gloss": {
          "en": "Hot, please. How much is it?",
          "ko": "뜨거운 걸로요. 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "It's four dollars.",
        "gloss": {
          "en": "It's four dollars.",
          "ko": "사 달러예요."
        }
      },
      {
        "who": "me",
        "text": "Here you are. Thanks a lot.",
        "gloss": {
          "en": "Here you are. Thanks a lot.",
          "ko": "여기요. 정말 고마워요."
        }
      },
      {
        "who": "them",
        "text": "You're welcome. Have a nice day!",
        "gloss": {
          "en": "You're welcome. Have a nice day!",
          "ko": "천만에요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "You too. See you later!",
        "gloss": {
          "en": "You too. See you later!",
          "ko": "당신도요. 다음에 봐요!"
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-1-b02",
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A new neighbor in the hallway",
      "ko": "복도에서 새 이웃과"
    },
    "expressions": [
      "nice to meet you",
      "where are you from",
      "me too"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello! Are you new here?",
        "gloss": {
          "en": "Hello! Are you new here?",
          "ko": "안녕하세요! 새로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I am. My name is Ji-woo.",
        "gloss": {
          "en": "Yes, I am. My name is Ji-woo.",
          "ko": "네. 제 이름은 지우예요."
        },
        "frames": [
          "en-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Nice to meet you, Ji-woo. I'm Tom.",
        "gloss": {
          "en": "Nice to meet you, Ji-woo. I'm Tom.",
          "ko": "반가워요, 지우 씨. 저는 톰이에요."
        }
      },
      {
        "who": "me",
        "text": "Nice to meet you too. Where are you from?",
        "gloss": {
          "en": "Nice to meet you too. Where are you from?",
          "ko": "저도 반가워요. 어디서 오셨어요?"
        }
      },
      {
        "who": "them",
        "text": "I'm from Australia. And you?",
        "gloss": {
          "en": "I'm from Australia. And you?",
          "ko": "호주에서 왔어요. 지우 씨는요?"
        }
      },
      {
        "who": "me",
        "text": "I'm from Korea.",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        },
        "frames": [
          "en-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Do you like this building?",
        "gloss": {
          "en": "Do you like this building?",
          "ko": "이 건물 마음에 들어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I like it a lot. It's very quiet.",
        "gloss": {
          "en": "Yes, I like it a lot. It's very quiet.",
          "ko": "네, 아주 마음에 들어요. 정말 조용해요."
        },
        "frames": [
          "en-f1-09"
        ]
      }
    ]
  },
  {
    "id": "en-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a market",
      "ko": "시장에서 과일 사기"
    },
    "expressions": [
      "how much is this",
      "just this one"
    ],
    "grammar": [
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good morning! Fresh apples today.",
        "gloss": {
          "en": "Good morning! Fresh apples today.",
          "ko": "좋은 아침이에요! 오늘 사과가 싱싱해요."
        }
      },
      {
        "who": "me",
        "text": "Good morning. How much is this?",
        "gloss": {
          "en": "Good morning. How much is this?",
          "ko": "좋은 아침이에요. 이거 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "The apples are two for a dollar.",
        "gloss": {
          "en": "The apples are two for a dollar.",
          "ko": "사과는 두 개에 일 달러예요."
        }
      },
      {
        "who": "me",
        "text": "I'd like four apples, please.",
        "gloss": {
          "en": "I'd like four apples, please.",
          "ko": "사과 네 개 주세요."
        },
        "frames": [
          "en-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Do you want a bag?",
        "gloss": {
          "en": "Sure. Do you want a bag?",
          "ko": "네. 봉투 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "No, thanks. I have a bag.",
        "gloss": {
          "en": "No, thanks. I have a bag.",
          "ko": "아니요, 괜찮아요. 가방 있어요."
        },
        "frames": [
          "en-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Do you want bananas too?",
        "gloss": {
          "en": "Do you want bananas too?",
          "ko": "바나나도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. Just the apples.",
        "gloss": {
          "en": "Not really. Just the apples.",
          "ko": "별로요. 사과만 주세요."
        }
      }
    ]
  },
  {
    "id": "en-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Lost near a train station",
      "ko": "기차역 근처에서 길을 잃음"
    },
    "expressions": [
      "excuse me",
      "where is the station",
      "on the left"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Are you okay? You look lost.",
        "gloss": {
          "en": "Are you okay? You look lost.",
          "ko": "괜찮으세요? 길을 잃으신 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Excuse me, where is the station?",
        "gloss": {
          "en": "Excuse me, where is the station?",
          "ko": "실례지만, 역이 어디예요?"
        },
        "frames": [
          "en-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Go straight. It's on the left.",
        "gloss": {
          "en": "Go straight. It's on the left.",
          "ko": "쭉 가세요. 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Is it next to the bank?",
        "gloss": {
          "en": "Is it next to the bank?",
          "ko": "은행 옆에 있어요?"
        }
      },
      {
        "who": "them",
        "text": "Yes, it's next to the bank.",
        "gloss": {
          "en": "Yes, it's next to the bank.",
          "ko": "네, 은행 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Can you say that again, please?",
        "gloss": {
          "en": "Can you say that again, please?",
          "ko": "다시 한 번 말해 주시겠어요?"
        },
        "frames": [
          "en-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Straight, then on the left.",
        "gloss": {
          "en": "Sure. Straight, then on the left.",
          "ko": "네. 쭉 가서 왼쪽이요."
        }
      },
      {
        "who": "me",
        "text": "Thanks a lot. Have a nice day!",
        "gloss": {
          "en": "Thanks a lot. Have a nice day!",
          "ko": "정말 고마워요. 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "en-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about jobs at a party",
      "ko": "모임에서 하는 일 이야기"
    },
    "expressions": [
      "what do you do",
      "how about you"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "So, what do you do?",
        "gloss": {
          "en": "So, what do you do?",
          "ko": "그래서, 무슨 일 하세요?"
        }
      },
      {
        "who": "me",
        "text": "I'm a teacher. How about you?",
        "gloss": {
          "en": "I'm a teacher. How about you?",
          "ko": "저는 선생님이에요. 당신은요?"
        },
        "frames": [
          "en-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "I'm a cook. I work at a hotel.",
        "gloss": {
          "en": "I'm a cook. I work at a hotel.",
          "ko": "저는 요리사예요. 호텔에서 일해요."
        }
      },
      {
        "who": "me",
        "text": "Oh, nice! I work at a school.",
        "gloss": {
          "en": "Oh, nice! I work at a school.",
          "ko": "오, 좋네요! 저는 학교에서 일해요."
        },
        "frames": [
          "en-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Do you like your job?",
        "gloss": {
          "en": "Do you like your job?",
          "ko": "일이 마음에 들어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I like children.",
        "gloss": {
          "en": "Yes, I like children.",
          "ko": "네, 저는 아이들을 좋아해요."
        },
        "frames": [
          "en-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "My sister is a teacher too.",
        "gloss": {
          "en": "My sister is a teacher too.",
          "ko": "제 여동생도 선생님이에요."
        }
      },
      {
        "who": "me",
        "text": "Really? Where does she work?",
        "gloss": {
          "en": "Really? Where does she work?",
          "ko": "정말요? 어디서 일해요?"
        }
      }
    ]
  },
  {
    "id": "en-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A morning routine chat at work",
      "ko": "직장에서 아침 일과 이야기"
    },
    "expressions": [
      "good morning",
      "not really"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good morning! You look tired.",
        "gloss": {
          "en": "Good morning! You look tired.",
          "ko": "좋은 아침이에요! 피곤해 보여요."
        }
      },
      {
        "who": "me",
        "text": "Good morning. I get up at five.",
        "gloss": {
          "en": "Good morning. I get up at five.",
          "ko": "좋은 아침이에요. 저는 다섯 시에 일어나요."
        },
        "frames": [
          "en-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Five? That's early!",
        "gloss": {
          "en": "Five? That's early!",
          "ko": "다섯 시요? 일찍이네요!"
        }
      },
      {
        "who": "me",
        "text": "Yes. I go to the gym before work.",
        "gloss": {
          "en": "Yes. I go to the gym before work.",
          "ko": "네. 출근 전에 헬스장에 가요."
        }
      },
      {
        "who": "them",
        "text": "Do you eat breakfast?",
        "gloss": {
          "en": "Do you eat breakfast?",
          "ko": "아침 먹어요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I don't eat in the morning.",
        "gloss": {
          "en": "Not really. I don't eat in the morning.",
          "ko": "별로요. 아침엔 안 먹어요."
        },
        "frames": [
          "en-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "I have coffee and bread every day.",
        "gloss": {
          "en": "I have coffee and bread every day.",
          "ko": "저는 매일 커피랑 빵을 먹어요."
        }
      },
      {
        "who": "me",
        "text": "That sounds nice. I like bread.",
        "gloss": {
          "en": "That sounds nice. I like bread.",
          "ko": "좋네요. 저도 빵 좋아해요."
        },
        "frames": [
          "en-f1-09"
        ]
      }
    ]
  },
  {
    "id": "en-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Borrowing a pen in class",
      "ko": "수업 중에 펜 빌리기"
    },
    "expressions": [
      "excuse me",
      "no problem"
    ],
    "grammar": [
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Okay, everyone. Open your books.",
        "gloss": {
          "en": "Okay, everyone. Open your books.",
          "ko": "자, 여러분. 책을 펴세요."
        }
      },
      {
        "who": "me",
        "text": "Excuse me. Do you have a pen?",
        "gloss": {
          "en": "Excuse me. Do you have a pen?",
          "ko": "저기요. 펜 있어요?"
        },
        "frames": [
          "en-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, I have two. Here you are.",
        "gloss": {
          "en": "Yes, I have two. Here you are.",
          "ko": "네, 두 개 있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. I don't have a pen today.",
        "gloss": {
          "en": "Thanks. I don't have a pen today.",
          "ko": "고마워요. 오늘 펜이 없어요."
        },
        "frames": [
          "en-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "No problem. Do you need paper too?",
        "gloss": {
          "en": "No problem. Do you need paper too?",
          "ko": "괜찮아요. 종이도 필요해요?"
        }
      },
      {
        "who": "me",
        "text": "No, thanks. I have a notebook.",
        "gloss": {
          "en": "No, thanks. I have a notebook.",
          "ko": "아니요, 괜찮아요. 공책 있어요."
        },
        "frames": [
          "en-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Okay. The class starts now.",
        "gloss": {
          "en": "Okay. The class starts now.",
          "ko": "알겠어요. 이제 수업 시작해요."
        }
      },
      {
        "who": "me",
        "text": "Great. See you after class.",
        "gloss": {
          "en": "Great. See you after class.",
          "ko": "좋아요. 수업 끝나고 봐요."
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering lunch at a small restaurant",
      "ko": "작은 식당에서 점심 주문"
    },
    "expressions": [
      "thanks a lot"
    ],
    "grammar": [
      6,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello! Are you ready to order?",
        "gloss": {
          "en": "Hello! Are you ready to order?",
          "ko": "안녕하세요! 주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. I'd like the chicken, please.",
        "gloss": {
          "en": "Yes. I'd like the chicken, please.",
          "ko": "네. 치킨으로 주세요."
        },
        "frames": [
          "en-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Rice or bread?",
        "gloss": {
          "en": "Sure. Rice or bread?",
          "ko": "네. 밥이요, 빵이요?"
        }
      },
      {
        "who": "me",
        "text": "Rice, please. Can I have water too?",
        "gloss": {
          "en": "Rice, please. Can I have water too?",
          "ko": "밥이요. 물도 주시겠어요?"
        },
        "frames": [
          "en-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Of course. Anything else?",
        "gloss": {
          "en": "Of course. Anything else?",
          "ko": "물론이죠. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "No, thanks. How much is it?",
        "gloss": {
          "en": "No, thanks. How much is it?",
          "ko": "아니요, 괜찮아요. 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "It's nine dollars.",
        "gloss": {
          "en": "It's nine dollars.",
          "ko": "구 달러예요."
        }
      },
      {
        "who": "me",
        "text": "Here you are. Thanks a lot!",
        "gloss": {
          "en": "Here you are. Thanks a lot!",
          "ko": "여기요. 정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "en-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the time at a bus stop",
      "ko": "버스 정류장에서 시간 묻기"
    },
    "expressions": [
      "excuse me",
      "what time is it"
    ],
    "grammar": [
      5,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi. Are you waiting for the bus too?",
        "gloss": {
          "en": "Hi. Are you waiting for the bus too?",
          "ko": "안녕하세요. 버스 기다리세요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. Excuse me, what time is it?",
        "gloss": {
          "en": "Yes. Excuse me, what time is it?",
          "ko": "네. 실례지만, 지금 몇 시예요?"
        },
        "frames": [
          "en-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "It's ten past eight.",
        "gloss": {
          "en": "It's ten past eight.",
          "ko": "여덟 시 십 분이에요."
        }
      },
      {
        "who": "me",
        "text": "Oh no. My class starts at nine.",
        "gloss": {
          "en": "Oh no. My class starts at nine.",
          "ko": "이런. 제 수업이 아홉 시에 시작해요."
        }
      },
      {
        "who": "them",
        "text": "Don't worry. The bus comes at quarter past.",
        "gloss": {
          "en": "Don't worry. The bus comes at quarter past.",
          "ko": "걱정 마세요. 버스가 십오 분에 와요."
        }
      },
      {
        "who": "me",
        "text": "Good. I don't like to be late.",
        "gloss": {
          "en": "Good. I don't like to be late.",
          "ko": "다행이에요. 늦는 거 싫어해요."
        },
        "frames": [
          "en-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Me too. Where is your class?",
        "gloss": {
          "en": "Me too. Where is your class?",
          "ko": "저도요. 수업이 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "It's next to the library.",
        "gloss": {
          "en": "It's next to the library.",
          "ko": "도서관 옆이에요."
        },
        "frames": [
          "en-f1-08"
        ]
      }
    ]
  },
  {
    "id": "en-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about family with a friend",
      "ko": "친구와 가족 이야기"
    },
    "expressions": [
      "how about you",
      "me too"
    ],
    "grammar": [
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Do you have brothers or sisters?",
        "gloss": {
          "en": "Do you have brothers or sisters?",
          "ko": "형제나 자매 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I have two sisters. How about you?",
        "gloss": {
          "en": "Yes, I have two sisters. How about you?",
          "ko": "네, 여동생이 둘 있어요. 당신은요?"
        },
        "frames": [
          "en-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "I have one brother. He lives in London.",
        "gloss": {
          "en": "I have one brother. He lives in London.",
          "ko": "남동생이 하나 있어요. 런던에 살아요."
        }
      },
      {
        "who": "me",
        "text": "My sisters live in Seoul.",
        "gloss": {
          "en": "My sisters live in Seoul.",
          "ko": "제 동생들은 서울에 살아요."
        }
      },
      {
        "who": "them",
        "text": "Do you see them a lot?",
        "gloss": {
          "en": "Do you see them a lot?",
          "ko": "자주 만나요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I see them in summer.",
        "gloss": {
          "en": "Not really. I see them in summer.",
          "ko": "별로요. 여름에 만나요."
        }
      },
      {
        "who": "them",
        "text": "I see my brother in winter.",
        "gloss": {
          "en": "I see my brother in winter.",
          "ko": "저는 겨울에 남동생을 만나요."
        }
      },
      {
        "who": "me",
        "text": "I like winter. My family likes it too.",
        "gloss": {
          "en": "I like winter. My family likes it too.",
          "ko": "저는 겨울이 좋아요. 우리 가족도 좋아해요."
        },
        "frames": [
          "en-f1-09"
        ]
      }
    ]
  },
  {
    "id": "en-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Signing up at a sports center",
      "ko": "스포츠 센터 등록"
    },
    "expressions": [
      "nice to meet you",
      "say that again"
    ],
    "grammar": [
      6,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! Can I help you?",
        "gloss": {
          "en": "Hi! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. I'd like a swimming class, please.",
        "gloss": {
          "en": "Yes. I'd like a swimming class, please.",
          "ko": "네. 수영 수업 듣고 싶어요."
        },
        "frames": [
          "en-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Can you swim?",
        "gloss": {
          "en": "Can you swim?",
          "ko": "수영할 줄 아세요?"
        }
      },
      {
        "who": "me",
        "text": "No, I can't swim. I'm new.",
        "gloss": {
          "en": "No, I can't swim. I'm new.",
          "ko": "아니요, 수영 못 해요. 처음이에요."
        },
        "frames": [
          "en-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "No problem. The class is on Tuesday at six.",
        "gloss": {
          "en": "No problem. The class is on Tuesday at six.",
          "ko": "괜찮아요. 수업은 화요일 여섯 시예요."
        }
      },
      {
        "who": "me",
        "text": "Sorry, can you say that again, please?",
        "gloss": {
          "en": "Sorry, can you say that again, please?",
          "ko": "죄송한데, 다시 말해 주시겠어요?"
        },
        "frames": [
          "en-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Tuesday, at six in the evening.",
        "gloss": {
          "en": "Tuesday, at six in the evening.",
          "ko": "화요일 저녁 여섯 시요."
        }
      },
      {
        "who": "me",
        "text": "Great. I can come on Tuesday.",
        "gloss": {
          "en": "Great. I can come on Tuesday.",
          "ko": "좋아요. 화요일에 올 수 있어요."
        },
        "frames": [
          "en-f1-11"
        ]
      }
    ]
  },
  {
    "id": "en-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for a supermarket",
      "ko": "슈퍼마켓 찾기"
    },
    "expressions": [
      "excuse me",
      "next to the bank",
      "on the left"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi. Do you need help?",
        "gloss": {
          "en": "Hi. Do you need help?",
          "ko": "안녕하세요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, please. Where is the supermarket?",
        "gloss": {
          "en": "Yes, please. Where is the supermarket?",
          "ko": "네. 슈퍼마켓이 어디예요?"
        },
        "frames": [
          "en-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "It's on Main Street.",
        "gloss": {
          "en": "It's on Main Street.",
          "ko": "메인 스트리트에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Is it far from here?",
        "gloss": {
          "en": "Is it far from here?",
          "ko": "여기서 멀어요?"
        }
      },
      {
        "who": "them",
        "text": "No. It's next to the bank, on the left.",
        "gloss": {
          "en": "No. It's next to the bank, on the left.",
          "ko": "아니요. 은행 옆, 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Next to the bank. Okay.",
        "gloss": {
          "en": "Next to the bank. Okay.",
          "ko": "은행 옆이요. 알겠어요."
        }
      },
      {
        "who": "them",
        "text": "Do you know the bank?",
        "gloss": {
          "en": "Do you know the bank?",
          "ko": "은행 아세요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I do. Thanks a lot!",
        "gloss": {
          "en": "Yes, I do. Thanks a lot!",
          "ko": "네, 알아요. 정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "en-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Weekend plans with a coworker",
      "ko": "동료와 주말 이야기"
    },
    "expressions": [
      "how about you",
      "see you later"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "What do you do on Saturdays?",
        "gloss": {
          "en": "What do you do on Saturdays?",
          "ko": "토요일에 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "I play tennis. How about you?",
        "gloss": {
          "en": "I play tennis. How about you?",
          "ko": "저는 테니스 쳐요. 당신은요?"
        }
      },
      {
        "who": "them",
        "text": "I don't play sports. I watch movies.",
        "gloss": {
          "en": "I don't play sports. I watch movies.",
          "ko": "저는 운동 안 해요. 영화 봐요."
        }
      },
      {
        "who": "me",
        "text": "Oh, I like movies too.",
        "gloss": {
          "en": "Oh, I like movies too.",
          "ko": "오, 저도 영화 좋아해요."
        },
        "frames": [
          "en-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Do you go to the cinema?",
        "gloss": {
          "en": "Do you go to the cinema?",
          "ko": "극장에 가요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I watch them at home.",
        "gloss": {
          "en": "Not really. I watch them at home.",
          "ko": "별로요. 집에서 봐요."
        }
      },
      {
        "who": "them",
        "text": "Me too. It's cheap and easy.",
        "gloss": {
          "en": "Me too. It's cheap and easy.",
          "ko": "저도요. 싸고 편하잖아요."
        }
      },
      {
        "who": "me",
        "text": "Yes! Okay, see you on Monday.",
        "gloss": {
          "en": "Yes! Okay, see you on Monday.",
          "ko": "맞아요! 그럼 월요일에 봐요."
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket",
      "ko": "기차표 사기"
    },
    "expressions": [
      "how much is this",
      "say that again"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Next, please. Where are you going?",
        "gloss": {
          "en": "Next, please. Where are you going?",
          "ko": "다음 분이요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "I'd like two tickets to Oxford, please.",
        "gloss": {
          "en": "I'd like two tickets to Oxford, please.",
          "ko": "옥스퍼드 가는 표 두 장 주세요."
        },
        "frames": [
          "en-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Sure. That's thirty pounds.",
        "gloss": {
          "en": "Sure. That's thirty pounds.",
          "ko": "네. 삼십 파운드예요."
        }
      },
      {
        "who": "me",
        "text": "Sorry, can you say that again, please?",
        "gloss": {
          "en": "Sorry, can you say that again, please?",
          "ko": "죄송한데, 다시 말해 주시겠어요?"
        },
        "frames": [
          "en-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Thirty pounds. Three, zero.",
        "gloss": {
          "en": "Thirty pounds. Three, zero.",
          "ko": "삼십 파운드요. 삼, 영."
        }
      },
      {
        "who": "me",
        "text": "Okay. What time is the next train?",
        "gloss": {
          "en": "Okay. What time is the next train?",
          "ko": "네. 다음 기차는 몇 시예요?"
        },
        "frames": [
          "en-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "It's at eleven, on platform two.",
        "gloss": {
          "en": "It's at eleven, on platform two.",
          "ko": "열한 시, 이 번 승강장이에요."
        }
      },
      {
        "who": "me",
        "text": "Thanks a lot. Have a nice day!",
        "gloss": {
          "en": "Thanks a lot. Have a nice day!",
          "ko": "정말 고마워요. 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "en-1-b15",
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a doctor's front desk",
      "ko": "병원 접수대에서"
    },
    "expressions": [
      "good morning",
      "excuse me"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good morning. Can I help you?",
        "gloss": {
          "en": "Good morning. Can I help you?",
          "ko": "좋은 아침이에요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Good morning. My name is Ji-woo.",
        "gloss": {
          "en": "Good morning. My name is Ji-woo.",
          "ko": "좋은 아침이에요. 제 이름은 지우예요."
        },
        "frames": [
          "en-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Do you have an appointment?",
        "gloss": {
          "en": "Do you have an appointment?",
          "ko": "예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. It's at ten.",
        "gloss": {
          "en": "Yes. It's at ten.",
          "ko": "네. 열 시예요."
        }
      },
      {
        "who": "them",
        "text": "Okay. Are you a student?",
        "gloss": {
          "en": "Okay. Are you a student?",
          "ko": "알겠어요. 학생이세요?"
        }
      },
      {
        "who": "me",
        "text": "No, I'm a nurse.",
        "gloss": {
          "en": "No, I'm a nurse.",
          "ko": "아니요, 저는 간호사예요."
        },
        "frames": [
          "en-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Great. Please sit over there.",
        "gloss": {
          "en": "Great. Please sit over there.",
          "ko": "좋아요. 저쪽에 앉아 계세요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. Where is the bathroom?",
        "gloss": {
          "en": "Thanks. Where is the bathroom?",
          "ko": "고마워요. 화장실이 어디예요?"
        },
        "frames": [
          "en-f1-07"
        ]
      }
    ]
  },
  {
    "id": "en-1-b16",
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a language exchange partner",
      "ko": "언어 교환 친구 만나기"
    },
    "expressions": [
      "nice to meet you",
      "where are you from",
      "what do you do"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! Are you Ji-woo?",
        "gloss": {
          "en": "Hi! Are you Ji-woo?",
          "ko": "안녕하세요! 지우 씨예요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I am. Nice to meet you.",
        "gloss": {
          "en": "Yes, I am. Nice to meet you.",
          "ko": "네, 맞아요. 만나서 반가워요."
        }
      },
      {
        "who": "them",
        "text": "Nice to meet you too. I'm Lucy.",
        "gloss": {
          "en": "Nice to meet you too. I'm Lucy.",
          "ko": "저도 반가워요. 저는 루시예요."
        }
      },
      {
        "who": "me",
        "text": "Where are you from, Lucy?",
        "gloss": {
          "en": "Where are you from, Lucy?",
          "ko": "루시 씨는 어디서 왔어요?"
        }
      },
      {
        "who": "them",
        "text": "I'm from Ireland. What do you do?",
        "gloss": {
          "en": "I'm from Ireland. What do you do?",
          "ko": "아일랜드에서 왔어요. 무슨 일 하세요?"
        }
      },
      {
        "who": "me",
        "text": "I'm a student. I study art.",
        "gloss": {
          "en": "I'm a student. I study art.",
          "ko": "저는 학생이에요. 미술을 공부해요."
        },
        "frames": [
          "en-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Cool! Can you speak Korean slowly for me?",
        "gloss": {
          "en": "Cool! Can you speak Korean slowly for me?",
          "ko": "멋지다! 저한테 한국어 천천히 말해 줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I can. Can you help me with English?",
        "gloss": {
          "en": "Yes, I can. Can you help me with English?",
          "ko": "네, 할 수 있어요. 제 영어도 도와줄래요?"
        },
        "frames": [
          "en-f1-11"
        ]
      }
    ]
  },
  {
    "id": "en-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Shopping for clothes",
      "ko": "옷 사기"
    },
    "expressions": [
      "how much is this",
      "just this one"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello! Can I help you?",
        "gloss": {
          "en": "Hello! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. Do you have this shirt in blue?",
        "gloss": {
          "en": "Yes. Do you have this shirt in blue?",
          "ko": "네. 이 셔츠 파란색 있어요?"
        },
        "frames": [
          "en-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, we do. Here you are.",
        "gloss": {
          "en": "Yes, we do. Here you are.",
          "ko": "네, 있어요. 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. How much is this?",
        "gloss": {
          "en": "Thanks. How much is this?",
          "ko": "고마워요. 이거 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "It's twenty dollars. The shoes are on sale too.",
        "gloss": {
          "en": "It's twenty dollars. The shoes are on sale too.",
          "ko": "이십 달러예요. 신발도 세일 중이에요."
        }
      },
      {
        "who": "me",
        "text": "Just this one, please.",
        "gloss": {
          "en": "Just this one, please.",
          "ko": "이것만 주세요."
        }
      },
      {
        "who": "them",
        "text": "Sure. Cash or card?",
        "gloss": {
          "en": "Sure. Cash or card?",
          "ko": "네. 현금이요, 카드요?"
        }
      },
      {
        "who": "me",
        "text": "Card, please. Thanks a lot.",
        "gloss": {
          "en": "Card, please. Thanks a lot.",
          "ko": "카드요. 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "en-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about hobbies in the park",
      "ko": "공원에서 취미 이야기"
    },
    "expressions": [
      "me too",
      "not really"
    ],
    "grammar": [
      6,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Is that your dog? He's cute!",
        "gloss": {
          "en": "Is that your dog? He's cute!",
          "ko": "그거 당신 개예요? 귀엽네요!"
        }
      },
      {
        "who": "me",
        "text": "Yes! He likes the park.",
        "gloss": {
          "en": "Yes! He likes the park.",
          "ko": "네! 공원을 좋아해요."
        }
      },
      {
        "who": "them",
        "text": "Do you walk him every day?",
        "gloss": {
          "en": "Do you walk him every day?",
          "ko": "매일 산책시켜요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. I get up at seven and walk him.",
        "gloss": {
          "en": "Yes. I get up at seven and walk him.",
          "ko": "네. 일곱 시에 일어나서 산책시켜요."
        },
        "frames": [
          "en-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "I can't get up early.",
        "gloss": {
          "en": "I can't get up early.",
          "ko": "저는 일찍 못 일어나요."
        }
      },
      {
        "who": "me",
        "text": "Me too, but my dog can!",
        "gloss": {
          "en": "Me too, but my dog can!",
          "ko": "저도요, 그런데 우리 개는 일어나요!"
        }
      },
      {
        "who": "them",
        "text": "Ha ha. Do you like running?",
        "gloss": {
          "en": "Ha ha. Do you like running?",
          "ko": "하하. 달리기 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I can swim, but I don't run.",
        "gloss": {
          "en": "Not really. I can swim, but I don't run.",
          "ko": "별로요. 수영은 할 수 있는데 달리기는 안 해요."
        },
        "frames": [
          "en-f1-11"
        ]
      }
    ]
  },
  {
    "id": "en-1-b19",
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a hotel reception",
      "ko": "호텔 프런트에서"
    },
    "expressions": [
      "good morning",
      "no problem",
      "you're welcome"
    ],
    "grammar": [
      5,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good evening. Welcome to the hotel.",
        "gloss": {
          "en": "Good evening. Welcome to the hotel.",
          "ko": "안녕하세요. 호텔에 오신 걸 환영해요."
        }
      },
      {
        "who": "me",
        "text": "Hi. My name is Ji-woo. I have a room.",
        "gloss": {
          "en": "Hi. My name is Ji-woo. I have a room.",
          "ko": "안녕하세요. 제 이름은 지우예요. 방을 예약했어요."
        },
        "frames": [
          "en-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Yes, room three ten. It's on the third floor.",
        "gloss": {
          "en": "Yes, room three ten. It's on the third floor.",
          "ko": "네, 삼백십 호예요. 삼 층에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. What time is breakfast?",
        "gloss": {
          "en": "Thanks. What time is breakfast?",
          "ko": "고마워요. 아침은 몇 시예요?"
        },
        "frames": [
          "en-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "Breakfast is at seven, in the restaurant.",
        "gloss": {
          "en": "Breakfast is at seven, in the restaurant.",
          "ko": "아침은 일곱 시, 식당에서예요."
        }
      },
      {
        "who": "me",
        "text": "Where is the restaurant?",
        "gloss": {
          "en": "Where is the restaurant?",
          "ko": "식당이 어디예요?"
        },
        "frames": [
          "en-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "It's next to the lift.",
        "gloss": {
          "en": "It's next to the lift.",
          "ko": "엘리베이터 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Great. Thanks a lot.",
        "gloss": {
          "en": "Great. Thanks a lot.",
          "ko": "좋아요. 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "en-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Saying goodbye after class",
      "ko": "수업 끝나고 인사"
    },
    "expressions": [
      "see you later",
      "have a nice day"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "That's all for today. Good job, everyone.",
        "gloss": {
          "en": "That's all for today. Good job, everyone.",
          "ko": "오늘은 여기까지예요. 모두 잘했어요."
        }
      },
      {
        "who": "me",
        "text": "Thank you. See you on Friday.",
        "gloss": {
          "en": "Thank you. See you on Friday.",
          "ko": "감사합니다. 금요일에 봐요."
        },
        "frames": [
          "en-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Do you have your homework?",
        "gloss": {
          "en": "Do you have your homework?",
          "ko": "숙제 챙겼어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I have it in my bag.",
        "gloss": {
          "en": "Yes, I have it in my bag.",
          "ko": "네, 가방에 있어요."
        },
        "frames": [
          "en-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Good. Do you take the bus home?",
        "gloss": {
          "en": "Good. Do you take the bus home?",
          "ko": "좋아요. 버스 타고 집에 가요?"
        }
      },
      {
        "who": "me",
        "text": "No, I don't. I walk home.",
        "gloss": {
          "en": "No, I don't. I walk home.",
          "ko": "아니요. 걸어서 가요."
        },
        "frames": [
          "en-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Nice. Have a nice day!",
        "gloss": {
          "en": "Nice. Have a nice day!",
          "ko": "좋네요. 좋은 하루 보내요!"
        }
      },
      {
        "who": "me",
        "text": "You too. See you later!",
        "gloss": {
          "en": "You too. See you later!",
          "ko": "선생님도요. 다음에 봬요!"
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  }
];
