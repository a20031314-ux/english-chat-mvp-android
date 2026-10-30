import type { StageScript } from "../../stageScripts.ts";

/**
 * en 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
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
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A new neighbor in the hallway",
      "ko": "복도에서 새 이웃과"
    },
    "expressions": [
      "nice to meet you",
      "where are you from"
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
      "how much is this"
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
      "where is the station"
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
      "excuse me"
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
      "how about you"
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
      "next to the bank"
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
        "text": "Okay. It's next to the bank.",
        "gloss": {
          "en": "Okay. It's next to the bank.",
          "ko": "알겠어요. 은행 옆이군요."
        },
        "frames": [
          "en-f1-08"
        ]
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
      "how about you"
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
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a doctor's front desk",
      "ko": "병원 접수대에서"
    },
    "expressions": [
      "good morning"
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
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a language exchange partner",
      "ko": "언어 교환 친구 만나기"
    },
    "expressions": [
      "nice to meet you",
      "where are you from"
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
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a hotel reception",
      "ko": "호텔 프런트에서"
    },
    "expressions": [],
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
      "see you later"
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
  },
  {
    "id": "en-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday morning chat with a coworker",
      "ko": "월요일 아침 동료와 수다"
    },
    "expressions": [
      "how was your weekend",
      "it was fun",
      "not bad at all",
      "last night"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Morning! Did you do anything fun this weekend?",
        "gloss": {
          "en": "Morning! Did you do anything fun this weekend?",
          "ko": "좋은 아침이에요! 주말에 재미있는 거 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes! It was fun. I went hiking with my sister.",
        "gloss": {
          "en": "Yes! It was fun. I went hiking with my sister.",
          "ko": "네! 재미있었어요. 언니랑 등산 갔어요."
        },
        "frames": [
          "en-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Nice! Where did you go?",
        "gloss": {
          "en": "Nice! Where did you go?",
          "ko": "좋네요! 어디로 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "We went to a mountain near the city. How was your weekend?",
        "gloss": {
          "en": "We went to a mountain near the city. How was your weekend?",
          "ko": "시내 근처 산에 갔어요. 주말 어땠어요?"
        },
        "frames": [
          "en-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Quiet. I stayed home and cleaned. What did you do last night?",
        "gloss": {
          "en": "Quiet. I stayed home and cleaned. What did you do last night?",
          "ko": "조용했어요. 집에서 청소했어요. 어젯밤엔 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Last night I watched a movie with my roommate.",
        "gloss": {
          "en": "Last night I watched a movie with my roommate.",
          "ko": "어젯밤에 룸메이트랑 영화 봤어요."
        },
        "frames": [
          "en-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Was it good?",
        "gloss": {
          "en": "Was it good?",
          "ko": "재미있었어요?"
        }
      },
      {
        "who": "me",
        "text": "Not bad at all. It was funnier than I thought.",
        "gloss": {
          "en": "Not bad at all. It was funnier than I thought.",
          "ko": "꽤 괜찮았어요. 생각보다 웃겼어요."
        }
      }
    ]
  },
  {
    "id": "en-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a friend to the movies on the phone",
      "ko": "전화로 친구에게 영화 보자고 하기"
    },
    "expressions": [
      "are you free on",
      "let's meet at",
      "see you then"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hey! What are you up to?",
        "gloss": {
          "en": "Hey! What are you up to?",
          "ko": "안녕! 뭐 하고 있어요?"
        }
      },
      {
        "who": "me",
        "text": "I'm cooking dinner right now. Are you free on Saturday?",
        "gloss": {
          "en": "I'm cooking dinner right now. Are you free on Saturday?",
          "ko": "지금 저녁 만들고 있어요. 토요일에 시간 있어요?"
        },
        "frames": [
          "en-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "I think so. Why?",
        "gloss": {
          "en": "I think so. Why?",
          "ko": "있을 것 같아요. 왜요?"
        }
      },
      {
        "who": "me",
        "text": "I'm going to see a movie. Do you want to come?",
        "gloss": {
          "en": "I'm going to see a movie. Do you want to come?",
          "ko": "영화 보러 갈 거예요. 같이 갈래요?"
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Sounds good! What time?",
        "gloss": {
          "en": "Sounds good! What time?",
          "ko": "좋아요! 몇 시에요?"
        }
      },
      {
        "who": "me",
        "text": "Let's meet at six, in front of the theater.",
        "gloss": {
          "en": "Let's meet at six, in front of the theater.",
          "ko": "여섯 시에 극장 앞에서 만나요."
        },
        "frames": [
          "en-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Okay. See you then!",
        "gloss": {
          "en": "Okay. See you then!",
          "ko": "알겠어요. 그때 봐요!"
        }
      },
      {
        "who": "me",
        "text": "See you then. Don't be late!",
        "gloss": {
          "en": "See you then. Don't be late!",
          "ko": "그때 봐요. 늦지 마요!"
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering at a busy café",
      "ko": "붐비는 카페에서 주문하기"
    },
    "expressions": [
      "which one is better",
      "with oat milk"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi there. What can I get for you?",
        "gloss": {
          "en": "Hi there. What can I get for you?",
          "ko": "안녕하세요. 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Can I get a latte with oat milk?",
        "gloss": {
          "en": "Can I get a latte with oat milk?",
          "ko": "귀리 우유로 라테 한 잔 주실래요?"
        },
        "frames": [
          "en-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Small or large?",
        "gloss": {
          "en": "Sure. Small or large?",
          "ko": "네. 작은 거요, 큰 거요?"
        }
      },
      {
        "who": "me",
        "text": "Large, please. Do you have any cookies?",
        "gloss": {
          "en": "Large, please. Do you have any cookies?",
          "ko": "큰 걸로요. 쿠키 있어요?"
        },
        "frames": [
          "en-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, we have chocolate and lemon ones.",
        "gloss": {
          "en": "Yes, we have chocolate and lemon ones.",
          "ko": "네, 초콜릿이랑 레몬 쿠키가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Which one is better?",
        "gloss": {
          "en": "Which one is better?",
          "ko": "어느 게 더 맛있어요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The lemon one is more popular. For here or to go?",
        "gloss": {
          "en": "The lemon one is more popular. For here or to go?",
          "ko": "레몬이 더 인기 있어요. 드시고 가세요, 가져가세요?"
        }
      },
      {
        "who": "me",
        "text": "The lemon one, then. For here, please.",
        "gloss": {
          "en": "The lemon one, then. For here, please.",
          "ko": "그럼 레몬으로요. 먹고 갈게요."
        }
      }
    ]
  },
  {
    "id": "en-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a jacket at a clothing store",
      "ko": "옷 가게에서 재킷 사기"
    },
    "expressions": [
      "a bit expensive"
    ],
    "grammar": [
      3,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Can I help you with anything?",
        "gloss": {
          "en": "Can I help you with anything?",
          "ko": "도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. How much is this jacket?",
        "gloss": {
          "en": "Yes. How much is this jacket?",
          "ko": "네. 이 재킷 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "It's eighty dollars.",
        "gloss": {
          "en": "It's eighty dollars.",
          "ko": "팔십 달러예요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, that's a bit expensive. Do you have a cheaper one?",
        "gloss": {
          "en": "Hmm, that's a bit expensive. Do you have a cheaper one?",
          "ko": "음, 좀 비싸네요. 더 싼 거 있어요?"
        }
      },
      {
        "who": "them",
        "text": "This gray one is sixty dollars.",
        "gloss": {
          "en": "This gray one is sixty dollars.",
          "ko": "이 회색 건 육십 달러예요."
        }
      },
      {
        "who": "me",
        "text": "It's lighter than the other one, too. Can I try it on?",
        "gloss": {
          "en": "It's lighter than the other one, too. Can I try it on?",
          "ko": "다른 것보다 가볍기도 하네요. 입어 봐도 돼요?"
        },
        "frames": [
          "en-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Of course. The fitting room is on the left.",
        "gloss": {
          "en": "Of course. The fitting room is on the left.",
          "ko": "그럼요. 탈의실은 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. I'm going to take the gray one.",
        "gloss": {
          "en": "Thanks. I'm going to take the gray one.",
          "ko": "고마워요. 회색으로 할게요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking to a teacher after missing class",
      "ko": "수업을 빠진 뒤 선생님과"
    },
    "expressions": [],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "You weren't in class yesterday. What happened?",
        "gloss": {
          "en": "You weren't in class yesterday. What happened?",
          "ko": "어제 수업에 안 왔네요. 무슨 일 있었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sorry. I stayed home because I had a fever.",
        "gloss": {
          "en": "Sorry. I stayed home because I had a fever.",
          "ko": "죄송해요. 열이 나서 집에 있었어요."
        },
        "frames": [
          "en-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Oh, that's too bad. Are you okay now?",
        "gloss": {
          "en": "Oh, that's too bad. Are you okay now?",
          "ko": "저런, 안됐네요. 지금은 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, much better. Do you have any notes from the class?",
        "gloss": {
          "en": "Yes, much better. Do you have any notes from the class?",
          "ko": "네, 훨씬 나아요. 수업 자료 있어요?"
        },
        "frames": [
          "en-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, here they are. The test is next week.",
        "gloss": {
          "en": "Yes, here they are. The test is next week.",
          "ko": "네, 여기 있어요. 시험은 다음 주예요."
        }
      },
      {
        "who": "me",
        "text": "Thank you. I'm going to study this weekend.",
        "gloss": {
          "en": "Thank you. I'm going to study this weekend.",
          "ko": "감사해요. 이번 주말에 공부할 거예요."
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Good. Ask me if you have any questions.",
        "gloss": {
          "en": "Good. Ask me if you have any questions.",
          "ko": "좋아요. 궁금한 게 있으면 물어보세요."
        }
      },
      {
        "who": "me",
        "text": "I will. See you tomorrow!",
        "gloss": {
          "en": "I will. See you tomorrow!",
          "ko": "그럴게요. 내일 봬요!"
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A rainy Sunday, told to a coworker",
      "ko": "비 온 일요일 이야기를 동료에게"
    },
    "expressions": [
      "it was fun"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Did you go to the beach on Sunday?",
        "gloss": {
          "en": "Did you go to the beach on Sunday?",
          "ko": "일요일에 바다 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "No. It was raining, so we stayed home.",
        "gloss": {
          "en": "No. It was raining, so we stayed home.",
          "ko": "아니요. 비가 와서 집에 있었어요."
        },
        "frames": [
          "en-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Oh no. What did you do at home?",
        "gloss": {
          "en": "Oh no. What did you do at home?",
          "ko": "저런. 집에서 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "We played board games and made pizza.",
        "gloss": {
          "en": "We played board games and made pizza.",
          "ko": "보드게임 하고 피자 만들었어요."
        }
      },
      {
        "who": "them",
        "text": "That sounds nice, actually.",
        "gloss": {
          "en": "That sounds nice, actually.",
          "ko": "오히려 좋았겠는데요."
        }
      },
      {
        "who": "me",
        "text": "It was fun. My brother usually wins, but I won this time.",
        "gloss": {
          "en": "It was fun. My brother usually wins, but I won this time.",
          "ko": "재미있었어요. 보통 남동생이 이기는데 이번엔 제가 이겼어요."
        },
        "frames": [
          "en-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Maybe you can go to the beach next weekend.",
        "gloss": {
          "en": "Maybe you can go to the beach next weekend.",
          "ko": "다음 주말에 바다 가면 되겠네요."
        }
      },
      {
        "who": "me",
        "text": "Yes, I'm going to check the weather first this time.",
        "gloss": {
          "en": "Yes, I'm going to check the weather first this time.",
          "ko": "네, 이번엔 날씨부터 확인할 거예요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about morning routines at work",
      "ko": "회사에서 아침 습관 이야기"
    },
    "expressions": [
      "last night"
    ],
    "grammar": [
      7,
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "You look tired. Are you okay?",
        "gloss": {
          "en": "You look tired. Are you okay?",
          "ko": "피곤해 보여요. 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "I'm fine. I never have breakfast, so I'm always hungry in the morning.",
        "gloss": {
          "en": "I'm fine. I never have breakfast, so I'm always hungry in the morning.",
          "ko": "괜찮아요. 아침을 전혀 안 먹어서 아침엔 늘 배고파요."
        },
        "frames": [
          "en-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "You should eat something! I always have toast and eggs.",
        "gloss": {
          "en": "You should eat something! I always have toast and eggs.",
          "ko": "뭐라도 먹어야죠! 저는 항상 토스트랑 달걀 먹어요."
        }
      },
      {
        "who": "me",
        "text": "Last night I bought some cereal, actually.",
        "gloss": {
          "en": "Last night I bought some cereal, actually.",
          "ko": "사실 어젯밤에 시리얼을 좀 샀어요."
        },
        "frames": [
          "en-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Good idea. Did you eat some this morning?",
        "gloss": {
          "en": "Good idea. Did you eat some this morning?",
          "ko": "잘했어요. 오늘 아침에 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. It was easy. It's faster than eggs.",
        "gloss": {
          "en": "Yes. It was easy. It's faster than eggs.",
          "ko": "네. 쉬웠어요. 달걀보다 빨라요."
        },
        "frames": [
          "en-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "See? Now you can eat every day.",
        "gloss": {
          "en": "See? Now you can eat every day.",
          "ko": "거 봐요. 이제 매일 먹을 수 있겠네요."
        }
      },
      {
        "who": "me",
        "text": "I hope so. Maybe I can try toast next week.",
        "gloss": {
          "en": "I hope so. Maybe I can try toast next week.",
          "ko": "그러면 좋겠어요. 다음 주엔 토스트도 먹어 볼까 봐요."
        }
      }
    ]
  },
  {
    "id": "en-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning dinner with a roommate",
      "ko": "룸메이트와 저녁 준비하기"
    },
    "expressions": [
      "let me check"
    ],
    "grammar": [
      4,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "I'm going to make pasta tonight. Do we have everything?",
        "gloss": {
          "en": "I'm going to make pasta tonight. Do we have everything?",
          "ko": "오늘 밤에 파스타 만들 건데. 재료 다 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Let me check. We don't have much cheese.",
        "gloss": {
          "en": "Let me check. We don't have much cheese.",
          "ko": "확인해 볼게요. 치즈가 별로 없어요."
        },
        "frames": [
          "en-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "That's okay. Are there any tomatoes?",
        "gloss": {
          "en": "That's okay. Are there any tomatoes?",
          "ko": "괜찮아요. 토마토는 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, there are some in the fridge.",
        "gloss": {
          "en": "Yes, there are some in the fridge.",
          "ko": "네, 냉장고에 좀 있어요."
        }
      },
      {
        "who": "them",
        "text": "Can you go to the store later?",
        "gloss": {
          "en": "Can you go to the store later?",
          "ko": "이따가 가게에 다녀와 줄래요?"
        }
      },
      {
        "who": "me",
        "text": "Sure. I'm watching a show right now, but I can go after.",
        "gloss": {
          "en": "Sure. I'm watching a show right now, but I can go after.",
          "ko": "그럼요. 지금 드라마 보는 중인데 끝나고 갈게요."
        },
        "frames": [
          "en-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Great, thanks! Get some bread too.",
        "gloss": {
          "en": "Great, thanks! Get some bread too.",
          "ko": "좋아요, 고마워요! 빵도 좀 사 와요."
        }
      },
      {
        "who": "me",
        "text": "Okay. Is this your shopping bag? Can I use it?",
        "gloss": {
          "en": "Okay. Is this your shopping bag? Can I use it?",
          "ko": "알겠어요. 이거 장바구니 당신 거예요? 써도 돼요?"
        },
        "frames": [
          "en-f2-17"
        ]
      }
    ]
  },
  {
    "id": "en-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Looking for a lost phone at the office",
      "ko": "사무실에서 잃어버린 휴대폰 찾기"
    },
    "expressions": [
      "last night"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Is everything okay? You look worried.",
        "gloss": {
          "en": "Is everything okay? You look worried.",
          "ko": "괜찮아요? 걱정 있어 보여요."
        }
      },
      {
        "who": "me",
        "text": "I can't find my phone. Last night I left it on my desk.",
        "gloss": {
          "en": "I can't find my phone. Last night I left it on my desk.",
          "ko": "휴대폰을 못 찾겠어요. 어젯밤에 책상 위에 두고 갔거든요."
        },
        "frames": [
          "en-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Is this it? It was under the desk.",
        "gloss": {
          "en": "Is this it? It was under the desk.",
          "ko": "이거예요? 책상 밑에 있었어요."
        }
      },
      {
        "who": "me",
        "text": "No, mine is bigger. Is this yours?",
        "gloss": {
          "en": "No, mine is bigger. Is this yours?",
          "ko": "아니요, 제 건 더 커요. 이거 당신 거예요?"
        },
        "frames": [
          "en-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Oh, that's mine. Let me call your phone.",
        "gloss": {
          "en": "Oh, that's mine. Let me call your phone.",
          "ko": "아, 그건 제 거예요. 당신 폰에 전화해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Good idea. Wait, I can hear it!",
        "gloss": {
          "en": "Good idea. Wait, I can hear it!",
          "ko": "좋은 생각이에요. 잠깐, 소리가 들려요!"
        }
      },
      {
        "who": "them",
        "text": "Where is it?",
        "gloss": {
          "en": "Where is it?",
          "ko": "어디 있어요?"
        }
      },
      {
        "who": "me",
        "text": "It was in my bag the whole time! Thanks a lot.",
        "gloss": {
          "en": "It was in my bag the whole time! Thanks a lot.",
          "ko": "내내 가방 안에 있었네요! 정말 고마워요."
        },
        "frames": [
          "en-f2-03"
        ]
      }
    ]
  },
  {
    "id": "en-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the information desk of a bus station",
      "ko": "버스 터미널 안내 데스크에서"
    },
    "expressions": [
      "how long does it take"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello. Where are you going?",
        "gloss": {
          "en": "Hello. Where are you going?",
          "ko": "안녕하세요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "To the airport. How long does it take to get there by bus?",
        "gloss": {
          "en": "To the airport. How long does it take to get there by bus?",
          "ko": "공항이요. 버스로 거기까지 얼마나 걸려요?"
        },
        "frames": [
          "en-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "About fifty minutes. The next bus is at ten.",
        "gloss": {
          "en": "About fifty minutes. The next bus is at ten.",
          "ko": "오십 분쯤이요. 다음 버스는 열 시에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Which one is faster, the bus or the train?",
        "gloss": {
          "en": "Which one is faster, the bus or the train?",
          "ko": "버스랑 기차 중에 어느 게 더 빨라요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The train is faster, but it's more expensive.",
        "gloss": {
          "en": "The train is faster, but it's more expensive.",
          "ko": "기차가 더 빠르지만 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "I'm going to take the bus, then. I have lots of time.",
        "gloss": {
          "en": "I'm going to take the bus, then. I have lots of time.",
          "ko": "그럼 버스 탈게요. 시간이 많아요."
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Okay. You can buy a ticket here.",
        "gloss": {
          "en": "Okay. You can buy a ticket here.",
          "ko": "네. 표는 여기서 사시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Great. Can I get one ticket to the airport?",
        "gloss": {
          "en": "Great. Can I get one ticket to the airport?",
          "ko": "좋아요. 공항 가는 표 한 장 주실래요?"
        },
        "frames": [
          "en-f2-11"
        ]
      }
    ]
  },
  {
    "id": "en-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Saying no to a party invitation",
      "ko": "파티 초대를 거절하기"
    },
    "expressions": [
      "let's meet at",
      "see you then",
      "maybe next time",
      "by the way",
      "on the way"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "We're having a party on Saturday. Do you want to come?",
        "gloss": {
          "en": "We're having a party on Saturday. Do you want to come?",
          "ko": "토요일에 파티 하는데. 올래요?"
        }
      },
      {
        "who": "me",
        "text": "Thanks, but maybe next time. I'm working that day.",
        "gloss": {
          "en": "Thanks, but maybe next time. I'm working that day.",
          "ko": "고맙지만 다음에요. 그날 일해요."
        },
        "frames": [
          "en-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Oh, that's too bad. How about lunch on Sunday?",
        "gloss": {
          "en": "Oh, that's too bad. How about lunch on Sunday?",
          "ko": "아, 아쉽네요. 일요일 점심은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Sunday is great. Let's meet at noon.",
        "gloss": {
          "en": "Sunday is great. Let's meet at noon.",
          "ko": "일요일 좋아요. 열두 시에 만나요."
        },
        "frames": [
          "en-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Sounds good. Where?",
        "gloss": {
          "en": "Sounds good. Where?",
          "ko": "좋아요. 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "How about the new Thai place? It's on the way to the station.",
        "gloss": {
          "en": "How about the new Thai place? It's on the way to the station.",
          "ko": "새로 생긴 태국 음식점 어때요? 역 가는 길에 있어요."
        }
      },
      {
        "who": "them",
        "text": "Perfect. See you on Sunday!",
        "gloss": {
          "en": "Perfect. See you on Sunday!",
          "ko": "딱 좋네요. 일요일에 봐요!"
        }
      },
      {
        "who": "me",
        "text": "See you then. By the way, I'm bringing my sister.",
        "gloss": {
          "en": "See you then. By the way, I'm bringing my sister.",
          "ko": "그때 봐요. 그런데 동생도 데려갈게요."
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Texting a friend to plan dinner",
      "ko": "친구와 문자로 저녁 약속 잡기"
    },
    "expressions": [
      "are you free on",
      "let's meet at",
      "see you then"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Do you want to have dinner this week?",
        "gloss": {
          "en": "Do you want to have dinner this week?",
          "ko": "이번 주에 저녁 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Sure, but I'm meeting my cousin on Friday.",
        "gloss": {
          "en": "Sure, but I'm meeting my cousin on Friday.",
          "ko": "좋아요, 그런데 금요일엔 사촌을 만나요."
        },
        "frames": [
          "en-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Okay. What about another day?",
        "gloss": {
          "en": "Okay. What about another day?",
          "ko": "그래요. 다른 날은요?"
        }
      },
      {
        "who": "me",
        "text": "Are you free on Thursday?",
        "gloss": {
          "en": "Are you free on Thursday?",
          "ko": "목요일에 시간 있어요?"
        },
        "frames": [
          "en-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Yes! Where do you want to go?",
        "gloss": {
          "en": "Yes! Where do you want to go?",
          "ko": "네! 어디 가고 싶어요?"
        }
      },
      {
        "who": "me",
        "text": "Let's meet at the noodle place near my office.",
        "gloss": {
          "en": "Let's meet at the noodle place near my office.",
          "ko": "제 회사 근처 국숫집에서 만나요."
        },
        "frames": [
          "en-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Great. What time?",
        "gloss": {
          "en": "Great. What time?",
          "ko": "좋아요. 몇 시에요?"
        }
      },
      {
        "who": "me",
        "text": "Seven is good for me. See you then!",
        "gloss": {
          "en": "Seven is good for me. See you then!",
          "ko": "저는 일곱 시가 좋아요. 그때 봐요!"
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good evening. Do you have a reservation?",
        "gloss": {
          "en": "Good evening. Do you have a reservation?",
          "ko": "안녕하세요. 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. I'm going to stay for three nights.",
        "gloss": {
          "en": "Yes. I'm going to stay for three nights.",
          "ko": "네. 사흘 밤 묵을 거예요."
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Here's your key. Your room is on the fifth floor.",
        "gloss": {
          "en": "Here's your key. Your room is on the fifth floor.",
          "ko": "열쇠 여기 있어요. 방은 오 층이에요."
        }
      },
      {
        "who": "me",
        "text": "Thank you. Do you have any rooms with a better view?",
        "gloss": {
          "en": "Thank you. Do you have any rooms with a better view?",
          "ko": "감사해요. 전망이 더 좋은 방 있어요?"
        },
        "frames": [
          "en-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "There's one on the tenth floor, but it's a little more expensive.",
        "gloss": {
          "en": "There's one on the tenth floor, but it's a little more expensive.",
          "ko": "십 층에 하나 있는데 조금 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Which one is quieter?",
        "gloss": {
          "en": "Which one is quieter?",
          "ko": "어느 쪽이 더 조용해요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The tenth floor room. It's twenty dollars more a night.",
        "gloss": {
          "en": "The tenth floor room. It's twenty dollars more a night.",
          "ko": "십 층 방이요. 하룻밤에 이십 달러 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "It's quieter than the other one, so I'll take it.",
        "gloss": {
          "en": "It's quieter than the other one, so I'll take it.",
          "ko": "다른 방보다 조용하니까 그걸로 할게요."
        },
        "frames": [
          "en-f2-09"
        ]
      }
    ]
  },
  {
    "id": "en-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A phone call from a friend with car trouble",
      "ko": "차가 고장 난 친구의 전화"
    },
    "expressions": [
      "how long does it take",
      "what happened",
      "that's too bad"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! What are you up to?",
        "gloss": {
          "en": "Hi! What are you up to?",
          "ko": "안녕! 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "I'm cleaning my room right now.",
        "gloss": {
          "en": "I'm cleaning my room right now.",
          "ko": "지금 방 청소하고 있어요."
        },
        "frames": [
          "en-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh, sorry. Can you talk?",
        "gloss": {
          "en": "Oh, sorry. Can you talk?",
          "ko": "아, 미안해요. 통화 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, it's fine. What happened?",
        "gloss": {
          "en": "Yes, it's fine. What happened?",
          "ko": "네, 괜찮아요. 무슨 일이에요?"
        }
      },
      {
        "who": "them",
        "text": "My car broke down, so I'm at a café downtown.",
        "gloss": {
          "en": "My car broke down, so I'm at a café downtown.",
          "ko": "차가 고장 나서 시내 카페에 있어요."
        }
      },
      {
        "who": "me",
        "text": "That's too bad. How long does it take to fix it?",
        "gloss": {
          "en": "That's too bad. How long does it take to fix it?",
          "ko": "안됐네요. 고치는 데 얼마나 걸려요?"
        },
        "frames": [
          "en-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Two days. Can you give me a ride tomorrow?",
        "gloss": {
          "en": "Two days. Can you give me a ride tomorrow?",
          "ko": "이틀이요. 내일 저 좀 태워 줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sure. I'm going to pick you up at eight.",
        "gloss": {
          "en": "Sure. I'm going to pick you up at eight.",
          "ko": "그럼요. 여덟 시에 데리러 갈게요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a restaurant",
      "ko": "식당에서 저녁 주문하기"
    },
    "expressions": [],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Are you ready to order?",
        "gloss": {
          "en": "Are you ready to order?",
          "ko": "주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Almost. Which one is spicier, the curry or the soup?",
        "gloss": {
          "en": "Almost. Which one is spicier, the curry or the soup?",
          "ko": "거의요. 카레랑 수프 중에 어느 게 더 매워요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The curry is spicier.",
        "gloss": {
          "en": "The curry is spicier.",
          "ko": "카레가 더 매워요."
        }
      },
      {
        "who": "me",
        "text": "Then can I get the soup, please? I don't eat spicy food.",
        "gloss": {
          "en": "Then can I get the soup, please? I don't eat spicy food.",
          "ko": "그럼 수프로 주실래요? 저는 매운 걸 안 먹어요."
        },
        "frames": [
          "en-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Anything to drink?",
        "gloss": {
          "en": "Sure. Anything to drink?",
          "ko": "네. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Do you have any fresh juice?",
        "gloss": {
          "en": "Do you have any fresh juice?",
          "ko": "생과일 주스 있어요?"
        },
        "frames": [
          "en-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, orange and apple.",
        "gloss": {
          "en": "Yes, orange and apple.",
          "ko": "네, 오렌지랑 사과요."
        }
      },
      {
        "who": "me",
        "text": "Orange, please. Thank you.",
        "gloss": {
          "en": "Orange, please. Thank you.",
          "ko": "오렌지로 주세요. 감사해요."
        }
      }
    ]
  },
  {
    "id": "en-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Coming home after a weekend away",
      "ko": "주말 여행에서 돌아와 룸메이트와"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hey, you're back! I'm making tea right now. Do you want some?",
        "gloss": {
          "en": "Hey, you're back! I'm making tea right now. Do you want some?",
          "ko": "왔네요! 지금 차 끓이는데. 좀 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, please. How was your day?",
        "gloss": {
          "en": "Yes, please. How was your day?",
          "ko": "네, 주세요. 오늘 하루 어땠어요?"
        },
        "frames": [
          "en-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Busy. I had three meetings. How was your grandma's?",
        "gloss": {
          "en": "Busy. I had three meetings. How was your grandma's?",
          "ko": "바빴어요. 회의가 세 개였어요. 할머니 댁은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "It was great. She made a lot of food.",
        "gloss": {
          "en": "It was great. She made a lot of food.",
          "ko": "좋았어요. 할머니가 음식을 많이 해 주셨어요."
        },
        "frames": [
          "en-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Lucky you! How did you get back?",
        "gloss": {
          "en": "Lucky you! How did you get back?",
          "ko": "좋았겠다! 어떻게 돌아왔어요?"
        }
      },
      {
        "who": "me",
        "text": "I took the train. It was faster than the bus.",
        "gloss": {
          "en": "I took the train. It was faster than the bus.",
          "ko": "기차 탔어요. 버스보다 빨랐어요."
        },
        "frames": [
          "en-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Are you hungry?",
        "gloss": {
          "en": "Are you hungry?",
          "ko": "배고파요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I'm going to take a shower and go to bed.",
        "gloss": {
          "en": "Not really. I'm going to take a shower and go to bed.",
          "ko": "별로요. 샤워하고 잘 거예요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Choosing a gift at a market stall",
      "ko": "시장 가판대에서 선물 고르기"
    },
    "expressions": [
      "a little cheaper",
      "next weekend"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "These mugs are handmade. Take a look.",
        "gloss": {
          "en": "These mugs are handmade. Take a look.",
          "ko": "이 머그잔들은 수제예요. 구경해 보세요."
        }
      },
      {
        "who": "me",
        "text": "They're nice. Which one is the most popular?",
        "gloss": {
          "en": "They're nice. Which one is the most popular?",
          "ko": "예쁘네요. 어느 게 제일 인기 있어요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The blue one. But the green one is very nice too.",
        "gloss": {
          "en": "The blue one. But the green one is very nice too.",
          "ko": "파란 거요. 그런데 초록색도 아주 예뻐요."
        }
      },
      {
        "who": "me",
        "text": "The green one is a little cheaper, right?",
        "gloss": {
          "en": "The green one is a little cheaper, right?",
          "ko": "초록색이 조금 더 싸죠?"
        }
      },
      {
        "who": "them",
        "text": "Yes, it's twelve dollars. The blue one is fifteen.",
        "gloss": {
          "en": "Yes, it's twelve dollars. The blue one is fifteen.",
          "ko": "네, 십이 달러예요. 파란 건 십오 달러고요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, but the blue one is bigger. It's nicer than the other one.",
        "gloss": {
          "en": "Hmm, but the blue one is bigger. It's nicer than the other one.",
          "ko": "음, 그래도 파란 게 더 커요. 다른 것보다 예쁘네요."
        },
        "frames": [
          "en-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Is it a gift?",
        "gloss": {
          "en": "Is it a gift?",
          "ko": "선물이에요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, it's for my mom. I'm going to visit her next weekend.",
        "gloss": {
          "en": "Yes, it's for my mom. I'm going to visit her next weekend.",
          "ko": "네, 엄마 거예요. 다음 주말에 뵈러 가요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about a new video game",
      "ko": "새 비디오 게임 이야기"
    },
    "expressions": [
      "last night"
    ],
    "grammar": [
      0,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "You look tired today.",
        "gloss": {
          "en": "You look tired today.",
          "ko": "오늘 피곤해 보여요."
        }
      },
      {
        "who": "me",
        "text": "Last night I played games until two.",
        "gloss": {
          "en": "Last night I played games until two.",
          "ko": "어젯밤에 두 시까지 게임했어요."
        },
        "frames": [
          "en-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Again? Why so late?",
        "gloss": {
          "en": "Again? Why so late?",
          "ko": "또요? 왜 그렇게 늦게까지요?"
        }
      },
      {
        "who": "me",
        "text": "I stayed home because it was cold, and I played all day.",
        "gloss": {
          "en": "I stayed home because it was cold, and I played all day.",
          "ko": "추워서 집에 있었는데 하루 종일 했어요."
        },
        "frames": [
          "en-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "What game is it?",
        "gloss": {
          "en": "What game is it?",
          "ko": "무슨 게임이에요?"
        }
      },
      {
        "who": "me",
        "text": "It's a farming game. It's slower than the other one I play, but I like it.",
        "gloss": {
          "en": "It's a farming game. It's slower than the other one I play, but I like it.",
          "ko": "농사 게임이에요. 제가 하는 다른 게임보다 느리지만 좋아요."
        },
        "frames": [
          "en-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Maybe I can try it.",
        "gloss": {
          "en": "Maybe I can try it.",
          "ko": "저도 해 볼까 봐요."
        }
      },
      {
        "who": "me",
        "text": "Sure! I'm playing it right now, actually.",
        "gloss": {
          "en": "Sure! I'm playing it right now, actually.",
          "ko": "그래요! 사실 지금도 하고 있어요."
        },
        "frames": [
          "en-f2-04"
        ]
      }
    ]
  },
  {
    "id": "en-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a study group at school",
      "ko": "학교에서 스터디 모임 정하기"
    },
    "expressions": [
      "are you free on",
      "let's meet at",
      "see you then"
    ],
    "grammar": [
      4,
      7,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "The exam is next week. Do you want to study together?",
        "gloss": {
          "en": "The exam is next week. Do you want to study together?",
          "ko": "시험이 다음 주예요. 같이 공부할래요?"
        }
      },
      {
        "who": "me",
        "text": "Yes! We don't have much time. Are you free on Wednesday?",
        "gloss": {
          "en": "Yes! We don't have much time. Are you free on Wednesday?",
          "ko": "네! 시간이 별로 없어요. 수요일에 시간 있어요?"
        },
        "frames": [
          "en-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Wednesday is good. Where?",
        "gloss": {
          "en": "Wednesday is good. Where?",
          "ko": "수요일 좋아요. 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "Let's meet at the library after class.",
        "gloss": {
          "en": "Let's meet at the library after class.",
          "ko": "수업 끝나고 도서관에서 만나요."
        },
        "frames": [
          "en-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Okay. Should we ask Mina too?",
        "gloss": {
          "en": "Okay. Should we ask Mina too?",
          "ko": "좋아요. 미나도 부를까요?"
        }
      },
      {
        "who": "me",
        "text": "Sure. She always takes good notes.",
        "gloss": {
          "en": "Sure. She always takes good notes.",
          "ko": "그래요. 미나는 항상 필기를 잘해요."
        }
      },
      {
        "who": "them",
        "text": "I'll text her. See you on Wednesday!",
        "gloss": {
          "en": "I'll text her. See you on Wednesday!",
          "ko": "제가 문자할게요. 수요일에 봐요!"
        }
      },
      {
        "who": "me",
        "text": "See you then! I'm going to bring some snacks.",
        "gloss": {
          "en": "See you then! I'm going to bring some snacks.",
          "ko": "그때 봐요! 간식 좀 가져갈게요."
        },
        "frames": [
          "en-f2-05"
        ]
      }
    ]
  },
  {
    "id": "en-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Small talk at a hair salon",
      "ko": "미용실에서 가벼운 대화"
    },
    "expressions": [],
    "grammar": [
      2,
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "So, any plans for next weekend?",
        "gloss": {
          "en": "So, any plans for next weekend?",
          "ko": "다음 주말에 계획 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I'm going to go camping with friends.",
        "gloss": {
          "en": "Yes, I'm going to go camping with friends.",
          "ko": "네, 친구들이랑 캠핑 갈 거예요."
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Nice! Where are you going?",
        "gloss": {
          "en": "Nice! Where are you going?",
          "ko": "좋네요! 어디로 가요?"
        }
      },
      {
        "who": "me",
        "text": "To a lake. It takes two hours by car.",
        "gloss": {
          "en": "To a lake. It takes two hours by car.",
          "ko": "호수요. 차로 두 시간 걸려요."
        }
      },
      {
        "who": "them",
        "text": "How was your last camping trip?",
        "gloss": {
          "en": "How was your last camping trip?",
          "ko": "지난번 캠핑은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "It was raining, so we came home early.",
        "gloss": {
          "en": "It was raining, so we came home early.",
          "ko": "비가 와서 일찍 돌아왔어요."
        },
        "frames": [
          "en-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Oh, that's too bad. So, what would you like today?",
        "gloss": {
          "en": "Oh, that's too bad. So, what would you like today?",
          "ko": "아, 아쉬웠겠네요. 그럼 오늘은 어떻게 해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Can I get a trim? Just a little shorter, please.",
        "gloss": {
          "en": "Can I get a trim? Just a little shorter, please.",
          "ko": "다듬어 주실래요? 조금만 짧게요."
        },
        "frames": [
          "en-f2-11"
        ]
      }
    ]
  },
  {
    "id": "en-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling customer service about a lost order",
      "ko": "주문 배송 문제로 고객센터에 전화"
    },
    "expressions": [
      "get back to me"
    ],
    "grammar": [
      6,
      10,
      2,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thank you for calling. How can I help you today?",
        "gloss": {
          "en": "Thank you for calling. How can I help you today?",
          "ko": "전화 주셔서 감사합니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Hi. My order was sent to the wrong address.",
        "gloss": {
          "en": "Hi. My order was sent to the wrong address.",
          "ko": "안녕하세요. 제 주문이 엉뚱한 주소로 갔어요."
        },
        "frames": [
          "en-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "I'm sorry about that. Do you have your order number?",
        "gloss": {
          "en": "I'm sorry about that. Do you have your order number?",
          "ko": "죄송합니다. 주문 번호 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, it's in the email. They said it would arrive on Monday, but it didn't.",
        "gloss": {
          "en": "Yes, it's in the email. They said it would arrive on Monday, but it didn't.",
          "ko": "네, 이메일에 있어요. 월요일에 온다고 했는데 안 왔어요."
        },
        "frames": [
          "en-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "I see. I'll contact the delivery company right away.",
        "gloss": {
          "en": "I see. I'll contact the delivery company right away.",
          "ko": "알겠습니다. 바로 배송 회사에 연락할게요."
        }
      },
      {
        "who": "me",
        "text": "Could you find out where it is now and get back to me?",
        "gloss": {
          "en": "Could you find out where it is now and get back to me?",
          "ko": "지금 어디 있는지 알아보고 다시 연락 주실 수 있어요?"
        },
        "frames": [
          "en-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Of course. I'll call you within a day.",
        "gloss": {
          "en": "Of course. I'll call you within a day.",
          "ko": "물론이죠. 하루 안에 전화드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. If it doesn't come by Friday, I'll call you back.",
        "gloss": {
          "en": "Thanks. If it doesn't come by Friday, I'll call you back.",
          "ko": "감사해요. 금요일까지 안 오면 다시 전화할게요."
        },
        "frames": [
          "en-f3-04"
        ]
      }
    ]
  },
  {
    "id": "en-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Recommending a lunch place to a coworker",
      "ko": "동료에게 점심 식당 추천하기"
    },
    "expressions": [
      "make sure",
      "it's worth trying",
      "just in case"
    ],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Any ideas for lunch? I'm tired of sandwiches.",
        "gloss": {
          "en": "Any ideas for lunch? I'm tired of sandwiches.",
          "ko": "점심 뭐 먹을지 생각 있어요? 샌드위치는 질렸어요."
        }
      },
      {
        "who": "me",
        "text": "Have you ever tried the Vietnamese place on the corner?",
        "gloss": {
          "en": "Have you ever tried the Vietnamese place on the corner?",
          "ko": "모퉁이에 있는 베트남 식당 가 본 적 있어요?"
        },
        "frames": [
          "en-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "No, I've never been there. Is it good?",
        "gloss": {
          "en": "No, I've never been there. Is it good?",
          "ko": "아니요, 한 번도 안 가 봤어요. 맛있어요?"
        }
      },
      {
        "who": "me",
        "text": "It's great. It's worth trying the beef noodle soup.",
        "gloss": {
          "en": "It's great. It's worth trying the beef noodle soup.",
          "ko": "정말 맛있어요. 소고기 쌀국수는 꼭 먹어 볼 만해요."
        },
        "frames": [
          "en-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Is it spicy? I can't eat spicy food.",
        "gloss": {
          "en": "Is it spicy? I can't eat spicy food.",
          "ko": "매워요? 저는 매운 걸 못 먹어요."
        }
      },
      {
        "who": "me",
        "text": "Not really. You should ask for no chili, just in case.",
        "gloss": {
          "en": "Not really. You should ask for no chili, just in case.",
          "ko": "별로 안 매워요. 그래도 혹시 모르니 고추 빼 달라고 하세요."
        },
        "frames": [
          "en-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Okay, let's go at twelve.",
        "gloss": {
          "en": "Okay, let's go at twelve.",
          "ko": "좋아요, 열두 시에 가요."
        }
      },
      {
        "who": "me",
        "text": "Sounds good. Make sure you bring cash. They don't take cards.",
        "gloss": {
          "en": "Sounds good. Make sure you bring cash. They don't take cards.",
          "ko": "좋아요. 꼭 현금 챙기세요. 카드를 안 받아요."
        },
        "frames": [
          "en-f3-19"
        ]
      }
    ]
  },
  {
    "id": "en-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend about a cancelled flight",
      "ko": "친구에게 결항된 비행기 이야기"
    },
    "expressions": [
      "it turned out",
      "in the end"
    ],
    "grammar": [
      1,
      7,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "I heard your flight got cancelled. What happened?",
        "gloss": {
          "en": "I heard your flight got cancelled. What happened?",
          "ko": "비행기 결항됐다면서요. 무슨 일이었어요?"
        }
      },
      {
        "who": "me",
        "text": "There was a storm. We were already on the plane when it happened.",
        "gloss": {
          "en": "There was a storm. We were already on the plane when it happened.",
          "ko": "폭풍이 왔어요. 그때 저희는 이미 비행기에 타 있었어요."
        },
        "frames": [
          "en-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh no. So what did you do?",
        "gloss": {
          "en": "Oh no. So what did you do?",
          "ko": "저런. 그래서 어떻게 했어요?"
        }
      },
      {
        "who": "me",
        "text": "They gave us a hotel room, but it was so noisy that I couldn't sleep.",
        "gloss": {
          "en": "They gave us a hotel room, but it was so noisy that I couldn't sleep.",
          "ko": "호텔 방을 줬는데 너무 시끄러워서 잠을 못 잤어요."
        },
        "frames": [
          "en-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "That sounds awful. When did you get home?",
        "gloss": {
          "en": "That sounds awful. When did you get home?",
          "ko": "끔찍했겠네요. 집에는 언제 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "The next afternoon. It turned out there was only one flight a day.",
        "gloss": {
          "en": "The next afternoon. It turned out there was only one flight a day.",
          "ko": "다음 날 오후에요. 알고 보니 비행기가 하루에 한 편뿐이었어요."
        },
        "frames": [
          "en-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "No wonder you look tired.",
        "gloss": {
          "en": "No wonder you look tired.",
          "ko": "어쩐지 피곤해 보이더라고요."
        }
      },
      {
        "who": "me",
        "text": "Yeah. In the end, I took today off.",
        "gloss": {
          "en": "Yeah. In the end, I took today off.",
          "ko": "네. 결국 오늘은 쉬기로 했어요."
        }
      }
    ]
  },
  {
    "id": "en-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend who is sick on the night of plans",
      "ko": "약속 날 밤에 아픈 친구"
    },
    "expressions": [
      "let me know"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "I don't think I can come tonight. I have a bad headache.",
        "gloss": {
          "en": "I don't think I can come tonight. I have a bad headache.",
          "ko": "오늘 밤엔 못 갈 것 같아요. 머리가 너무 아파요."
        }
      },
      {
        "who": "me",
        "text": "Oh no. You should get some rest and drink lots of water.",
        "gloss": {
          "en": "Oh no. You should get some rest and drink lots of water.",
          "ko": "저런. 좀 쉬고 물을 많이 마셔요."
        },
        "frames": [
          "en-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "I will. But I have to finish a report for tomorrow.",
        "gloss": {
          "en": "I will. But I have to finish a report for tomorrow.",
          "ko": "그럴게요. 그런데 내일까지 보고서를 끝내야 해요."
        }
      },
      {
        "who": "me",
        "text": "Can't you ask your boss for more time?",
        "gloss": {
          "en": "Can't you ask your boss for more time?",
          "ko": "상사한테 시간을 더 달라고 하면 안 돼요?"
        }
      },
      {
        "who": "them",
        "text": "Maybe. I'll send her an email.",
        "gloss": {
          "en": "Maybe. I'll send her an email.",
          "ko": "그럴까 봐요. 이메일 보내 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Good idea. I have to go shopping anyway, so I can bring you some medicine.",
        "gloss": {
          "en": "Good idea. I have to go shopping anyway, so I can bring you some medicine.",
          "ko": "좋은 생각이에요. 어차피 장 보러 가야 하니까 약 좀 갖다줄게요."
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "That's so kind. Thank you.",
        "gloss": {
          "en": "That's so kind. Thank you.",
          "ko": "정말 고마워요."
        }
      },
      {
        "who": "me",
        "text": "No problem. Let me know if you need anything else.",
        "gloss": {
          "en": "No problem. Let me know if you need anything else.",
          "ko": "별말씀을요. 다른 거 필요하면 알려 줘요."
        },
        "frames": [
          "en-f3-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Catching up with a friend about quitting a job",
      "ko": "친구에게 퇴사 소식 전하기"
    },
    "expressions": [
      "to be honest",
      "it depends"
    ],
    "grammar": [
      4,
      8
    ],
    "lines": [
      {
        "who": "them",
        "text": "I heard you left your job. Is that true?",
        "gloss": {
          "en": "I heard you left your job. Is that true?",
          "ko": "회사 그만뒀다면서요. 정말이에요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. I decided to quit last month.",
        "gloss": {
          "en": "Yes. I decided to quit last month.",
          "ko": "네. 지난달에 그만두기로 했어요."
        },
        "frames": [
          "en-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Wow. Why?",
        "gloss": {
          "en": "Wow. Why?",
          "ko": "와. 왜요?"
        }
      },
      {
        "who": "me",
        "text": "To be honest, I wasn't happy there. The hours were too long.",
        "gloss": {
          "en": "To be honest, I wasn't happy there. The hours were too long.",
          "ko": "솔직히 거기서 행복하지 않았어요. 일하는 시간이 너무 길었어요."
        },
        "frames": [
          "en-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "How did you feel when you told your boss?",
        "gloss": {
          "en": "How did you feel when you told your boss?",
          "ko": "상사한테 말할 때 기분이 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "I felt really nervous, but she was very kind about it.",
        "gloss": {
          "en": "I felt really nervous, but she was very kind about it.",
          "ko": "정말 긴장됐는데, 상사가 아주 친절하게 받아 줬어요."
        },
        "frames": [
          "en-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "So what's next for you?",
        "gloss": {
          "en": "So what's next for you?",
          "ko": "그럼 이제 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "I'm looking for something new. It depends on what I find.",
        "gloss": {
          "en": "I'm looking for something new. It depends on what I find.",
          "ko": "새로운 일을 찾고 있어요. 뭘 찾느냐에 따라 달라요."
        }
      }
    ]
  },
  {
    "id": "en-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "At an office party, pointing someone out",
      "ko": "회사 파티에서 누군가를 소개하기"
    },
    "expressions": [
      "to be honest"
    ],
    "grammar": [
      5,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "Who's that woman by the window?",
        "gloss": {
          "en": "Who's that woman by the window?",
          "ko": "창가에 있는 저 여자분 누구예요?"
        }
      },
      {
        "who": "me",
        "text": "That's the person who designed our new office.",
        "gloss": {
          "en": "That's the person who designed our new office.",
          "ko": "우리 새 사무실을 디자인한 분이에요."
        },
        "frames": [
          "en-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Really? I love the new office.",
        "gloss": {
          "en": "Really? I love the new office.",
          "ko": "정말요? 새 사무실 정말 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Me too. Have you ever met her?",
        "gloss": {
          "en": "Me too. Have you ever met her?",
          "ko": "저도요. 그분 만나 본 적 있어요?"
        },
        "frames": [
          "en-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "No, never. Can you introduce me?",
        "gloss": {
          "en": "No, never. Can you introduce me?",
          "ko": "아니요, 한 번도요. 소개해 줄래요?"
        }
      },
      {
        "who": "me",
        "text": "Sure. She's really friendly, and she brought the cake today.",
        "gloss": {
          "en": "Sure. She's really friendly, and she brought the cake today.",
          "ko": "그럼요. 정말 친절한 분이고, 오늘 케이크도 그분이 가져왔어요."
        }
      },
      {
        "who": "them",
        "text": "Great. Let's go say hi.",
        "gloss": {
          "en": "Great. Let's go say hi.",
          "ko": "좋아요. 인사하러 가요."
        }
      },
      {
        "who": "me",
        "text": "Okay. To be honest, I've never talked to her much either.",
        "gloss": {
          "en": "Okay. To be honest, I've never talked to her much either.",
          "ko": "좋아요. 솔직히 저도 그분이랑 얘기를 많이 해 본 적은 없어요."
        },
        "frames": [
          "en-f3-18"
        ]
      }
    ]
  },
  {
    "id": "en-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Complaining about a hot hotel room",
      "ko": "더운 호텔 방 문제로 프런트에 말하기"
    },
    "expressions": [
      "what do you mean"
    ],
    "grammar": [
      10,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good evening. Is everything okay with your room?",
        "gloss": {
          "en": "Good evening. Is everything okay with your room?",
          "ko": "안녕하세요. 객실에 문제는 없으세요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. The air conditioner isn't working, and the room is very hot.",
        "gloss": {
          "en": "Not really. The air conditioner isn't working, and the room is very hot.",
          "ko": "사실 있어요. 에어컨이 안 돼서 방이 너무 더워요."
        }
      },
      {
        "who": "them",
        "text": "I'm sorry. Someone will check it soon.",
        "gloss": {
          "en": "I'm sorry. Someone will check it soon.",
          "ko": "죄송합니다. 곧 누가 확인할 거예요."
        }
      },
      {
        "who": "me",
        "text": "What do you mean by soon? It's already ten.",
        "gloss": {
          "en": "What do you mean by soon? It's already ten.",
          "ko": "곧이 언제예요? 벌써 열 시예요."
        },
        "frames": [
          "en-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Within twenty minutes, I promise.",
        "gloss": {
          "en": "Within twenty minutes, I promise.",
          "ko": "이십 분 안에요, 약속드릴게요."
        }
      },
      {
        "who": "me",
        "text": "I called an hour ago, and he told me it would be fixed by nine.",
        "gloss": {
          "en": "I called an hour ago, and he told me it would be fixed by nine.",
          "ko": "한 시간 전에 전화했는데, 그 직원이 아홉 시까지 고쳐 준다고 했어요."
        },
        "frames": [
          "en-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "I'm very sorry about that. I'll send someone right now.",
        "gloss": {
          "en": "I'm very sorry about that. I'll send someone right now.",
          "ko": "정말 죄송합니다. 지금 바로 사람을 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. If it isn't fixed soon, I'll call you back.",
        "gloss": {
          "en": "Thanks. If it isn't fixed soon, I'll call you back.",
          "ko": "감사해요. 곧 안 고쳐지면 다시 전화할게요."
        },
        "frames": [
          "en-f3-04"
        ]
      }
    ]
  },
  {
    "id": "en-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor about a sore throat",
      "ko": "목이 아파 병원에 가기"
    },
    "expressions": [
      "what do you mean",
      "that makes sense"
    ],
    "grammar": [
      0,
      3,
      8
    ],
    "lines": [
      {
        "who": "them",
        "text": "So, what brings you in today?",
        "gloss": {
          "en": "So, what brings you in today?",
          "ko": "오늘 어떻게 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "I've had a sore throat for three days, and I felt really tired yesterday.",
        "gloss": {
          "en": "I've had a sore throat for three days, and I felt really tired yesterday.",
          "ko": "사흘째 목이 아프고, 어제는 정말 피곤했어요."
        },
        "frames": [
          "en-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Do you have a fever?",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열이 있어요?"
        }
      },
      {
        "who": "me",
        "text": "A little. I have to give a presentation on Friday, so I'm worried.",
        "gloss": {
          "en": "A little. I have to give a presentation on Friday, so I'm worried.",
          "ko": "조금요. 금요일에 발표를 해야 해서 걱정이에요."
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "You should rest and take this medicine twice a day.",
        "gloss": {
          "en": "You should rest and take this medicine twice a day.",
          "ko": "푹 쉬고 이 약을 하루에 두 번 드세요."
        }
      },
      {
        "who": "me",
        "text": "What do you mean by twice a day? Morning and night?",
        "gloss": {
          "en": "What do you mean by twice a day? Morning and night?",
          "ko": "하루 두 번이면 언제요? 아침이랑 밤이요?"
        },
        "frames": [
          "en-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Yes, after breakfast and after dinner.",
        "gloss": {
          "en": "Yes, after breakfast and after dinner.",
          "ko": "네, 아침 먹고 한 번, 저녁 먹고 한 번이요."
        }
      },
      {
        "who": "me",
        "text": "That makes sense. Thank you, doctor.",
        "gloss": {
          "en": "That makes sense. Thank you, doctor.",
          "ko": "알겠어요. 감사합니다, 선생님."
        }
      }
    ]
  },
  {
    "id": "en-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Helping a friend move house",
      "ko": "친구 이사 도와주기"
    },
    "expressions": [
      "make sure",
      "run out of",
      "let me know"
    ],
    "grammar": [
      3,
      7,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thanks for helping me move this weekend!",
        "gloss": {
          "en": "Thanks for helping me move this weekend!",
          "ko": "이번 주말에 이사 도와줘서 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "No problem. Make sure you pack the glasses carefully.",
        "gloss": {
          "en": "No problem. Make sure you pack the glasses carefully.",
          "ko": "별말씀을요. 유리컵은 꼭 조심해서 싸요."
        },
        "frames": [
          "en-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "I will. Have you ever moved by yourself?",
        "gloss": {
          "en": "I will. Have you ever moved by yourself?",
          "ko": "그럴게요. 혼자 이사해 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, once. My back hurt the next day. It was so bad that I couldn't sleep.",
        "gloss": {
          "en": "Yes, once. My back hurt the next day. It was so bad that I couldn't sleep.",
          "ko": "네, 한 번요. 다음 날 허리가 아팠어요. 너무 아파서 잠을 못 잤어요."
        },
        "frames": [
          "en-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Oh no. What time are you coming?",
        "gloss": {
          "en": "Oh no. What time are you coming?",
          "ko": "저런. 몇 시에 올 거예요?"
        }
      },
      {
        "who": "me",
        "text": "I have to work in the morning, but I'll be there by two.",
        "gloss": {
          "en": "I have to work in the morning, but I'll be there by two.",
          "ko": "오전엔 일해야 하지만 두 시까지는 갈게요."
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Perfect. I'll order pizza for everyone.",
        "gloss": {
          "en": "Perfect. I'll order pizza for everyone.",
          "ko": "좋아요. 다 같이 먹게 피자 시킬게요."
        }
      },
      {
        "who": "me",
        "text": "Great. Let me know if you run out of boxes.",
        "gloss": {
          "en": "Great. Let me know if you run out of boxes.",
          "ko": "좋아요. 상자가 떨어지면 말해 줘요."
        },
        "frames": [
          "en-f3-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A wallet that wasn't really lost",
      "ko": "알고 보니 안 잃어버린 지갑"
    },
    "expressions": [
      "it turned out"
    ],
    "grammar": [
      6,
      10,
      3,
      8
    ],
    "lines": [
      {
        "who": "them",
        "text": "Did you ever find your wallet?",
        "gloss": {
          "en": "Did you ever find your wallet?",
          "ko": "지갑은 찾았어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes! It turned out it was in my coat pocket.",
        "gloss": {
          "en": "Yes! It turned out it was in my coat pocket.",
          "ko": "네! 알고 보니 코트 주머니에 있었어요."
        },
        "frames": [
          "en-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Ha! Where did you think you lost it?",
        "gloss": {
          "en": "Ha! Where did you think you lost it?",
          "ko": "하하! 어디서 잃어버린 줄 알았어요?"
        }
      },
      {
        "who": "me",
        "text": "On the bus. I felt really stupid.",
        "gloss": {
          "en": "On the bus. I felt really stupid.",
          "ko": "버스에서요. 정말 바보 같았어요."
        },
        "frames": [
          "en-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Don't worry, that happens to everyone.",
        "gloss": {
          "en": "Don't worry, that happens to everyone.",
          "ko": "괜찮아요, 누구나 그래요."
        }
      },
      {
        "who": "me",
        "text": "I called the bank, too. They said it would take a week to send a new card.",
        "gloss": {
          "en": "I called the bank, too. They said it would take a week to send a new card.",
          "ko": "은행에도 전화했어요. 새 카드 보내는 데 일주일 걸린다고 했어요."
        },
        "frames": [
          "en-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Did you cancel the card?",
        "gloss": {
          "en": "Did you cancel the card?",
          "ko": "카드는 정지했어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. So now I have to wait for the new one anyway.",
        "gloss": {
          "en": "Yes. So now I have to wait for the new one anyway.",
          "ko": "네. 그래서 이제 어차피 새 카드를 기다려야 해요."
        },
        "frames": [
          "en-f3-06"
        ]
      }
    ]
  },
  {
    "id": "en-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a small car accident",
      "ko": "작은 교통사고 이야기"
    },
    "expressions": [
      "on time",
      "sort it out"
    ],
    "grammar": [
      1,
      10,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "Are you okay? I heard about the accident.",
        "gloss": {
          "en": "Are you okay? I heard about the accident.",
          "ko": "괜찮아요? 사고 났다는 얘기 들었어요."
        }
      },
      {
        "who": "me",
        "text": "I'm fine. We were waiting at a traffic light when it happened.",
        "gloss": {
          "en": "I'm fine. We were waiting at a traffic light when it happened.",
          "ko": "괜찮아요. 사고 났을 때 저희는 신호를 기다리고 있었어요."
        },
        "frames": [
          "en-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "So the other car hit you from behind?",
        "gloss": {
          "en": "So the other car hit you from behind?",
          "ko": "그럼 다른 차가 뒤에서 박은 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. The driver was looking at his phone. He told me he didn't see us.",
        "gloss": {
          "en": "Yes. The driver was looking at his phone. He told me he didn't see us.",
          "ko": "네. 운전자가 휴대폰을 보고 있었어요. 저희를 못 봤다고 하더라고요."
        },
        "frames": [
          "en-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Wow. Did you call the police?",
        "gloss": {
          "en": "Wow. Did you call the police?",
          "ko": "와. 경찰은 불렀어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. They came on time, and the insurance company will sort it out.",
        "gloss": {
          "en": "Yes. They came on time, and the insurance company will sort it out.",
          "ko": "네. 제때 왔고, 보험 회사가 처리해 줄 거예요."
        }
      },
      {
        "who": "them",
        "text": "Good. You should see a doctor, just in case.",
        "gloss": {
          "en": "Good. You should see a doctor, just in case.",
          "ko": "다행이에요. 혹시 모르니 병원에 가 봐요."
        }
      },
      {
        "who": "me",
        "text": "I have to go tomorrow anyway, for a check-up.",
        "gloss": {
          "en": "I have to go tomorrow anyway, for a check-up.",
          "ko": "어차피 내일 검진 받으러 가야 해요."
        },
        "frames": [
          "en-f3-06"
        ]
      }
    ]
  },
  {
    "id": "en-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Suggesting a weekend trip",
      "ko": "주말 여행지 추천하기"
    },
    "expressions": [
      "have you ever been",
      "to be honest",
      "it's worth trying"
    ],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "I want to go somewhere this weekend, but I don't know where.",
        "gloss": {
          "en": "I want to go somewhere this weekend, but I don't know where.",
          "ko": "이번 주말에 어디 가고 싶은데 어디로 갈지 모르겠어요."
        }
      },
      {
        "who": "me",
        "text": "Have you ever been to the islands near the coast?",
        "gloss": {
          "en": "Have you ever been to the islands near the coast?",
          "ko": "해안 근처 섬들에 가 본 적 있어요?"
        },
        "frames": [
          "en-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "No. I've never even heard of them.",
        "gloss": {
          "en": "No. I've never even heard of them.",
          "ko": "아니요. 들어 본 적도 없어요."
        }
      },
      {
        "who": "me",
        "text": "You should go. It's worth trying the boat tour there.",
        "gloss": {
          "en": "You should go. It's worth trying the boat tour there.",
          "ko": "가 봐요. 거기 보트 투어는 해 볼 만해요."
        },
        "frames": [
          "en-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "How long is the boat tour?",
        "gloss": {
          "en": "How long is the boat tour?",
          "ko": "보트 투어는 얼마나 걸려요?"
        }
      },
      {
        "who": "me",
        "text": "About an hour. To be honest, I've never done the full tour myself.",
        "gloss": {
          "en": "About an hour. To be honest, I've never done the full tour myself.",
          "ko": "한 시간쯤이요. 솔직히 저도 전체 투어는 해 본 적 없어요."
        },
        "frames": [
          "en-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Ha! But you still recommend it?",
        "gloss": {
          "en": "Ha! But you still recommend it?",
          "ko": "하하! 그런데도 추천하는 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Yes! My sister went last summer, and she loved it.",
        "gloss": {
          "en": "Yes! My sister went last summer, and she loved it.",
          "ko": "네! 언니가 작년 여름에 갔는데 정말 좋아했어요."
        }
      }
    ]
  },
  {
    "id": "en-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a coworker to check a report",
      "ko": "동료에게 보고서 확인 부탁하기"
    },
    "expressions": [
      "make sure",
      "let me know",
      "so far",
      "get back to me"
    ],
    "grammar": [
      3,
      9,
      8
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi, do you have a minute?",
        "gloss": {
          "en": "Hi, do you have a minute?",
          "ko": "안녕하세요, 잠깐 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sure, but I have to finish this report by five.",
        "gloss": {
          "en": "Sure, but I have to finish this report by five.",
          "ko": "네, 그런데 다섯 시까지 이 보고서를 끝내야 해요."
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh, what's it about?",
        "gloss": {
          "en": "Oh, what's it about?",
          "ko": "아, 무슨 보고서예요?"
        }
      },
      {
        "who": "me",
        "text": "Our sales so far this year. Could you look at it and get back to me?",
        "gloss": {
          "en": "Our sales so far this year. Could you look at it and get back to me?",
          "ko": "올해 지금까지의 매출이요. 한번 보고 다시 말해 줄래요?"
        },
        "frames": [
          "en-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Of course. I'll check it after lunch.",
        "gloss": {
          "en": "Of course. I'll check it after lunch.",
          "ko": "물론이죠. 점심 먹고 확인할게요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. Make sure you look at the last page. The numbers there are confusing.",
        "gloss": {
          "en": "Thanks. Make sure you look at the last page. The numbers there are confusing.",
          "ko": "고마워요. 마지막 페이지는 꼭 봐 줘요. 거기 숫자가 헷갈려요."
        },
        "frames": [
          "en-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "No problem. And the meeting tomorrow is at ten, right?",
        "gloss": {
          "en": "No problem. And the meeting tomorrow is at ten, right?",
          "ko": "알겠어요. 그리고 내일 회의는 열 시죠?"
        }
      },
      {
        "who": "me",
        "text": "Right. Let me know if you can't come.",
        "gloss": {
          "en": "Right. Let me know if you can't come.",
          "ko": "맞아요. 못 오면 알려 줘요."
        },
        "frames": [
          "en-f3-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Exchanging shoes at a store",
      "ko": "가게에서 신발 교환하기"
    },
    "expressions": [
      "it turned out",
      "to be honest"
    ],
    "grammar": [
      0,
      10
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello. How can I help you?",
        "gloss": {
          "en": "Hello. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "I bought these shoes last week, but they're too small.",
        "gloss": {
          "en": "I bought these shoes last week, but they're too small.",
          "ko": "지난주에 이 신발을 샀는데 너무 작아요."
        }
      },
      {
        "who": "them",
        "text": "Did you try them on in the store?",
        "gloss": {
          "en": "Did you try them on in the store?",
          "ko": "매장에서 신어 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "No. To be honest, I was in a hurry.",
        "gloss": {
          "en": "No. To be honest, I was in a hurry.",
          "ko": "아니요. 솔직히 급했어요."
        },
        "frames": [
          "en-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "I see. Do you have the receipt?",
        "gloss": {
          "en": "I see. Do you have the receipt?",
          "ko": "그렇군요. 영수증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, here it is. They said it would be easy to exchange them.",
        "gloss": {
          "en": "Yes, here it is. They said it would be easy to exchange them.",
          "ko": "네, 여기요. 교환은 쉽다고 하던데요."
        },
        "frames": [
          "en-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Sure. What size do you need?",
        "gloss": {
          "en": "Sure. What size do you need?",
          "ko": "네. 어떤 사이즈가 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "One size bigger, please. It turned out my feet are bigger than I thought.",
        "gloss": {
          "en": "One size bigger, please. It turned out my feet are bigger than I thought.",
          "ko": "한 치수 크게요. 알고 보니 제 발이 생각보다 크더라고요."
        },
        "frames": [
          "en-f3-20"
        ]
      }
    ]
  },
  {
    "id": "en-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a movie after watching it",
      "ko": "영화를 본 뒤 감상 나누기"
    },
    "expressions": [
      "to be honest",
      "let me know",
      "fair enough"
    ],
    "grammar": [
      8,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "So, what did you think of the movie?",
        "gloss": {
          "en": "So, what did you think of the movie?",
          "ko": "영화 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "To be honest, I didn't like it much.",
        "gloss": {
          "en": "To be honest, I didn't like it much.",
          "ko": "솔직히 별로였어요."
        },
        "frames": [
          "en-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Really? Why not?",
        "gloss": {
          "en": "Really? Why not?",
          "ko": "정말요? 왜요?"
        }
      },
      {
        "who": "me",
        "text": "The story was confusing. I felt really lost in the middle.",
        "gloss": {
          "en": "The story was confusing. I felt really lost in the middle.",
          "ko": "이야기가 헷갈렸어요. 중간에 정말 무슨 내용인지 모르겠더라고요."
        },
        "frames": [
          "en-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "I thought the ending was amazing.",
        "gloss": {
          "en": "I thought the ending was amazing.",
          "ko": "저는 결말이 대단했다고 생각했어요."
        }
      },
      {
        "who": "me",
        "text": "Fair enough. The music was great, though.",
        "gloss": {
          "en": "Fair enough. The music was great, though.",
          "ko": "그럴 수 있죠. 음악은 정말 좋았어요."
        }
      },
      {
        "who": "them",
        "text": "Do you want to see the new one next week?",
        "gloss": {
          "en": "Do you want to see the new one next week?",
          "ko": "다음 주에 새로 나온 영화 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "Sure. Let me know if you find good seats.",
        "gloss": {
          "en": "Sure. Let me know if you find good seats.",
          "ko": "좋아요. 좋은 자리 있으면 알려 줘요."
        },
        "frames": [
          "en-f3-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's home",
      "ko": "친구 집에서 저녁 식사"
    },
    "expressions": [
      "no wonder"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Here, try this. It's my grandmother's recipe.",
        "gloss": {
          "en": "Here, try this. It's my grandmother's recipe.",
          "ko": "자, 이거 먹어 봐요. 할머니 요리법이에요."
        }
      },
      {
        "who": "me",
        "text": "Wow, it smells great. I've never had this before.",
        "gloss": {
          "en": "Wow, it smells great. I've never had this before.",
          "ko": "와, 냄새 좋네요. 이건 처음 먹어 봐요."
        },
        "frames": [
          "en-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "It's a kind of fish stew from my hometown.",
        "gloss": {
          "en": "It's a kind of fish stew from my hometown.",
          "ko": "우리 고향 생선 스튜 같은 거예요."
        }
      },
      {
        "who": "me",
        "text": "It's delicious. Have you ever made it for a party?",
        "gloss": {
          "en": "It's delicious. Have you ever made it for a party?",
          "ko": "정말 맛있어요. 파티 때 만들어 본 적 있어요?"
        },
        "frames": [
          "en-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Yes, many times. Everyone always asks for more.",
        "gloss": {
          "en": "Yes, many times. Everyone always asks for more.",
          "ko": "네, 여러 번요. 다들 항상 더 달라고 해요."
        }
      },
      {
        "who": "me",
        "text": "No wonder. You should open a restaurant!",
        "gloss": {
          "en": "No wonder. You should open a restaurant!",
          "ko": "그럴 만하네요. 식당 차려야겠어요!"
        },
        "frames": [
          "en-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Ha! Maybe one day. Do you want to take some home?",
        "gloss": {
          "en": "Ha! Maybe one day. Do you want to take some home?",
          "ko": "하하! 언젠가는요. 좀 싸 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "I'd love to. Thank you so much for dinner.",
        "gloss": {
          "en": "I'd love to. Thank you so much for dinner.",
          "ko": "좋아요. 저녁 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "en-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Running into a former coworker at a café",
      "ko": "카페에서 전 직장 동료를 마주침"
    },
    "expressions": [],
    "grammar": [
      5,
      10,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Who's that man at the counter? He's waving at you.",
        "gloss": {
          "en": "Who's that man at the counter? He's waving at you.",
          "ko": "계산대에 있는 저 남자 누구예요? 손 흔드는데요."
        }
      },
      {
        "who": "me",
        "text": "Oh, that's the person who replaced me at my old job.",
        "gloss": {
          "en": "Oh, that's the person who replaced me at my old job.",
          "ko": "아, 전 회사에서 제 후임으로 온 사람이에요."
        },
        "frames": [
          "en-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Really? Is he nice?",
        "gloss": {
          "en": "Really? Is he nice?",
          "ko": "정말요? 좋은 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "Yes. He told me he really likes the team.",
        "gloss": {
          "en": "Yes. He told me he really likes the team.",
          "ko": "네. 팀이 정말 좋다고 하더라고요."
        },
        "frames": [
          "en-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "How well do you know him?",
        "gloss": {
          "en": "How well do you know him?",
          "ko": "그 사람이랑 얼마나 친해요?"
        }
      },
      {
        "who": "me",
        "text": "We worked together for two weeks before I left.",
        "gloss": {
          "en": "We worked together for two weeks before I left.",
          "ko": "제가 나오기 전에 이 주 동안 같이 일했어요."
        }
      },
      {
        "who": "them",
        "text": "Do you still keep in touch with your old team?",
        "gloss": {
          "en": "Do you still keep in touch with your old team?",
          "ko": "아직 전 팀이랑 연락해요?"
        }
      },
      {
        "who": "me",
        "text": "A little. I decided to visit them next month, actually.",
        "gloss": {
          "en": "A little. I decided to visit them next month, actually.",
          "ko": "조금요. 사실 다음 달에 찾아가 보기로 했어요."
        },
        "frames": [
          "en-f3-07"
        ]
      }
    ]
  },
  {
    "id": "en-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A classmate tells you about a changed deadline",
      "ko": "같은 반 친구가 바뀐 마감일을 알려 줌"
    },
    "expressions": [
      "it turned out",
      "what do you mean"
    ],
    "grammar": [
      8,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Did you finish the essay? It's due tomorrow.",
        "gloss": {
          "en": "Did you finish the essay? It's due tomorrow.",
          "ko": "에세이 다 썼어요? 내일까지예요."
        }
      },
      {
        "who": "me",
        "text": "What do you mean by tomorrow? I thought it was next week!",
        "gloss": {
          "en": "What do you mean by tomorrow? I thought it was next week!",
          "ko": "내일이라니요? 다음 주인 줄 알았어요!"
        },
        "frames": [
          "en-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "No, the teacher changed the date on Monday.",
        "gloss": {
          "en": "No, the teacher changed the date on Monday.",
          "ko": "아니요, 월요일에 선생님이 날짜를 바꿨어요."
        }
      },
      {
        "who": "me",
        "text": "I wasn't in class on Monday. I felt really sick.",
        "gloss": {
          "en": "I wasn't in class on Monday. I felt really sick.",
          "ko": "월요일엔 수업에 안 갔어요. 정말 아팠거든요."
        },
        "frames": [
          "en-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Oh. You should email her and explain.",
        "gloss": {
          "en": "Oh. You should email her and explain.",
          "ko": "아. 선생님께 이메일로 설명해 봐요."
        }
      },
      {
        "who": "me",
        "text": "Good idea. I have to start tonight anyway.",
        "gloss": {
          "en": "Good idea. I have to start tonight anyway.",
          "ko": "좋은 생각이에요. 어차피 오늘 밤에 시작해야 해요."
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Let me know if I can help.",
        "gloss": {
          "en": "Let me know if I can help.",
          "ko": "도울 일 있으면 말해 줘요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. It turned out to be a busy week after all.",
        "gloss": {
          "en": "Thanks. It turned out to be a busy week after all.",
          "ko": "고마워요. 결국 바쁜 한 주가 됐네요."
        },
        "frames": [
          "en-f3-20"
        ]
      }
    ]
  },
  {
    "id": "en-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A phone call with a friend before a trip",
      "ko": "여행 전 친구와 통화"
    },
    "expressions": [
      "make sure",
      "just in case"
    ],
    "grammar": [
      3,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "I'm going to the mountains tomorrow. Any advice?",
        "gloss": {
          "en": "I'm going to the mountains tomorrow. Any advice?",
          "ko": "내일 산에 가요. 조언 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Make sure you bring a warm jacket. It gets cold at night.",
        "gloss": {
          "en": "Make sure you bring a warm jacket. It gets cold at night.",
          "ko": "따뜻한 재킷 꼭 챙겨요. 밤에 추워져요."
        },
        "frames": [
          "en-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Good idea. What about the trails?",
        "gloss": {
          "en": "Good idea. What about the trails?",
          "ko": "좋은 생각이에요. 등산로는요?"
        }
      },
      {
        "who": "me",
        "text": "They can be muddy. You should wear good shoes.",
        "gloss": {
          "en": "They can be muddy. You should wear good shoes.",
          "ko": "진흙탕일 수 있어요. 좋은 신발 신어요."
        },
        "frames": [
          "en-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Can you check the weather for me? My phone is almost dead.",
        "gloss": {
          "en": "Can you check the weather for me? My phone is almost dead.",
          "ko": "날씨 좀 봐 줄래요? 제 폰 배터리가 거의 없어요."
        }
      },
      {
        "who": "me",
        "text": "Sure, one second. If it doesn't load, I'll call you back.",
        "gloss": {
          "en": "Sure, one second. If it doesn't load, I'll call you back.",
          "ko": "그럼요, 잠깐만요. 안 열리면 다시 전화할게요."
        },
        "frames": [
          "en-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Okay, I'll wait.",
        "gloss": {
          "en": "Okay, I'll wait.",
          "ko": "네, 기다릴게요."
        }
      },
      {
        "who": "me",
        "text": "It loaded. It says sunny all weekend, but take an umbrella just in case.",
        "gloss": {
          "en": "It loaded. It says sunny all weekend, but take an umbrella just in case.",
          "ko": "열렸어요. 주말 내내 맑대요. 그래도 혹시 모르니 우산 챙겨요."
        }
      }
    ]
  },
  {
    "id": "en-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the building manager about a broken heater",
      "ko": "고장 난 난방기 때문에 관리인에게 전화"
    },
    "expressions": [
      "make sure",
      "get back to me"
    ],
    "grammar": [
      7,
      3,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hello, this is Mark, the building manager.",
        "gloss": {
          "en": "Hello, this is Mark, the building manager.",
          "ko": "여보세요, 건물 관리인 마크입니다."
        }
      },
      {
        "who": "me",
        "text": "Hi, I'm calling from apartment six. The heater stopped working last night.",
        "gloss": {
          "en": "Hi, I'm calling from apartment six. The heater stopped working last night.",
          "ko": "안녕하세요, 육 호인데요. 어젯밤에 난방기가 멈췄어요."
        }
      },
      {
        "who": "them",
        "text": "Oh no. Is it making any noise?",
        "gloss": {
          "en": "Oh no. Is it making any noise?",
          "ko": "저런. 무슨 소리가 나요?"
        }
      },
      {
        "who": "me",
        "text": "No, nothing. It was so cold that I couldn't sleep.",
        "gloss": {
          "en": "No, nothing. It was so cold that I couldn't sleep.",
          "ko": "아니요, 아무 소리도요. 너무 추워서 잠을 못 잤어요."
        },
        "frames": [
          "en-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "I'm sorry. I'll send someone tomorrow morning.",
        "gloss": {
          "en": "I'm sorry. I'll send someone tomorrow morning.",
          "ko": "죄송해요. 내일 아침에 사람을 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Could you call the repair company and get back to me with a time?",
        "gloss": {
          "en": "Could you call the repair company and get back to me with a time?",
          "ko": "수리 업체에 전화해 보고 시간 알려 주실 수 있어요?"
        },
        "frames": [
          "en-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Sure. They said it would take about an hour to fix.",
        "gloss": {
          "en": "Sure. They said it would take about an hour to fix.",
          "ko": "그럼요. 고치는 데 한 시간쯤 걸린다고 했어요."
        }
      },
      {
        "who": "me",
        "text": "Great. I have to leave at noon, so make sure they come early.",
        "gloss": {
          "en": "Great. I have to leave at noon, so make sure they come early.",
          "ko": "좋아요. 제가 열두 시에 나가야 하니까 꼭 일찍 오게 해 주세요."
        },
        "frames": [
          "en-f3-06"
        ]
      }
    ]
  }
];
