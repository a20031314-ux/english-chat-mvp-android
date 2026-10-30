import type { StageScript } from "../../stageScripts.ts";

/**
 * ko 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const KO_BANK: StageScript[] = [
  {
    "id": "ko-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "감사합니다",
      "얼마예요",
      "여기요",
      "아니요"
    ],
    "grammar": [
      3,
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 뭐 드릴까요?",
        "gloss": {
          "en": "Welcome. What can I get you?",
          "ko": "어서 오세요. 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "카페라테 주세요.",
        "gloss": {
          "en": "A café latte, please.",
          "ko": "카페라테 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "우유는 일반 우유로 드릴까요?",
        "gloss": {
          "en": "Is regular milk okay?",
          "ko": "우유는 일반 우유로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 저는 우유를 안 마셔요. 두유 있어요?",
        "gloss": {
          "en": "No, I don't drink milk. Do you have soy milk?",
          "ko": "아니요, 저는 우유를 안 마셔요. 두유 있어요?"
        },
        "frames": [
          "ko-f1-14",
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 있어요. 두유로 해 드릴게요.",
        "gloss": {
          "en": "Yes, we do. I'll make it with soy milk.",
          "ko": "네, 있어요. 두유로 해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 얼마예요?",
        "gloss": {
          "en": "Thank you. How much is it?",
          "ko": "감사합니다. 얼마예요?"
        },
        "frames": [
          "ko-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "오천 원이에요.",
        "gloss": {
          "en": "It's five thousand won.",
          "ko": "오천 원이에요."
        }
      },
      {
        "who": "me",
        "text": "여기요.",
        "gloss": {
          "en": "Here you go.",
          "ko": "여기요."
        }
      }
    ]
  },
  {
    "id": "ko-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서"
    },
    "expressions": [
      "안녕하세요",
      "아니요",
      "한국어 조금 해요"
    ],
    "grammar": [
      0,
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요! 처음 뵙겠습니다.",
        "gloss": {
          "en": "Hello! Nice to meet you.",
          "ko": "안녕하세요! 처음 뵙겠습니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 저는 대학생이에요.",
        "gloss": {
          "en": "Hello. I'm a college student.",
          "ko": "안녕하세요. 저는 대학생이에요."
        },
        "frames": [
          "ko-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "아, 그래요? 어느 나라 사람이에요?",
        "gloss": {
          "en": "Oh, really? Where are you from?",
          "ko": "아, 그래요? 어느 나라 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "저는 베트남 사람이에요.",
        "gloss": {
          "en": "I'm Vietnamese.",
          "ko": "저는 베트남 사람이에요."
        },
        "frames": [
          "ko-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "한국어 잘해요!",
        "gloss": {
          "en": "Your Korean is good!",
          "ko": "한국어 잘해요!"
        }
      },
      {
        "who": "me",
        "text": "아니요, 한국어 조금 해요.",
        "gloss": {
          "en": "No, I speak a little Korean.",
          "ko": "아니요, 한국어 조금 해요."
        },
        "frames": [
          "ko-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "무슨 공부를 해요?",
        "gloss": {
          "en": "What do you study?",
          "ko": "무슨 공부를 해요?"
        }
      },
      {
        "who": "me",
        "text": "저는 경영학을 공부해요.",
        "gloss": {
          "en": "I study business.",
          "ko": "저는 경영학을 공부해요."
        },
        "frames": [
          "ko-f1-17"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying gimbap at a convenience store",
      "ko": "편의점에서 김밥 사기"
    },
    "expressions": [
      "안녕하세요",
      "이거 뭐예요",
      "이거 주세요",
      "얼마예요",
      "감사합니다"
    ],
    "grammar": [
      0,
      3,
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요.",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 이거 뭐예요?",
        "gloss": {
          "en": "Hello. What is this?",
          "ko": "안녕하세요. 이거 뭐예요?"
        },
        "frames": [
          "ko-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "그건 김밥이에요. 안에 햄이 있어요.",
        "gloss": {
          "en": "That's gimbap. There's ham inside.",
          "ko": "그건 김밥이에요. 안에 햄이 있어요."
        }
      },
      {
        "who": "me",
        "text": "아, 저는 고기를 안 먹어요.",
        "gloss": {
          "en": "Oh, I don't eat meat.",
          "ko": "아, 저는 고기를 안 먹어요."
        },
        "frames": [
          "ko-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "그럼 이건 어때요? 참치 김밥이에요.",
        "gloss": {
          "en": "Then how about this one? It's tuna gimbap.",
          "ko": "그럼 이건 어때요? 참치 김밥이에요."
        }
      },
      {
        "who": "me",
        "text": "좋아요. 이거 주세요. 얼마예요?",
        "gloss": {
          "en": "Great. I'll take this. How much is it?",
          "ko": "좋아요. 이거 주세요. 얼마예요?"
        },
        "frames": [
          "ko-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "삼천 원이에요.",
        "gloss": {
          "en": "It's three thousand won.",
          "ko": "삼천 원이에요."
        }
      },
      {
        "who": "me",
        "text": "여기요. 감사합니다.",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ko-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking for the restroom at a subway station",
      "ko": "지하철역에서 화장실 묻기"
    },
    "expressions": [
      "안녕하세요",
      "화장실 어디예요",
      "죄송합니다",
      "천천히 말해 주세요",
      "감사합니다",
      "안녕히 계세요"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 뭐 도와드릴까요?",
        "gloss": {
          "en": "Yes, can I help you?",
          "ko": "네, 뭐 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 화장실 어디예요?",
        "gloss": {
          "en": "Hello. Where is the restroom?",
          "ko": "안녕하세요. 화장실 어디예요?"
        },
        "frames": [
          "ko-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "저기 개찰구 밖, 왼쪽에 있어요.",
        "gloss": {
          "en": "It's outside the ticket gate, on the left.",
          "ko": "저기 개찰구 밖, 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "죄송합니다. 천천히 말해 주세요.",
        "gloss": {
          "en": "Sorry. Please speak slowly.",
          "ko": "죄송합니다. 천천히 말해 주세요."
        },
        "frames": [
          "ko-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "저기, 왼쪽에, 있어요.",
        "gloss": {
          "en": "Over there, on the left.",
          "ko": "저기, 왼쪽에, 있어요."
        }
      },
      {
        "who": "me",
        "text": "아, 감사합니다. 지하철 지도 있어요?",
        "gloss": {
          "en": "Oh, thank you. Do you have a subway map?",
          "ko": "아, 감사합니다. 지하철 지도 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 여기 있어요.",
        "gloss": {
          "en": "Yes, here you are.",
          "ko": "네, 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 안녕히 계세요.",
        "gloss": {
          "en": "Thank you. Goodbye.",
          "ko": "감사합니다. 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "ko-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Getting a table at a Korean restaurant",
      "ko": "식당에서 자리 잡고 주문하기"
    },
    "expressions": [
      "감사합니다"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 몇 분이세요?",
        "gloss": {
          "en": "Welcome. How many are you?",
          "ko": "어서 오세요. 몇 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "세 명이에요.",
        "gloss": {
          "en": "There are three of us.",
          "ko": "세 명이에요."
        },
        "frames": [
          "ko-f1-20"
        ]
      },
      {
        "who": "them",
        "text": "이쪽으로 앉으세요. 메뉴 여기 있어요.",
        "gloss": {
          "en": "Please sit over here. Here's the menu.",
          "ko": "이쪽으로 앉으세요. 메뉴 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 이건 뭐예요?",
        "gloss": {
          "en": "Thank you. What's this?",
          "ko": "감사합니다. 이건 뭐예요?"
        },
        "frames": [
          "ko-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "비빔밥이에요. 조금 매워요.",
        "gloss": {
          "en": "It's bibimbap. It's a little spicy.",
          "ko": "비빔밥이에요. 조금 매워요."
        }
      },
      {
        "who": "me",
        "text": "좋아요. 저는 매운 음식을 좋아해요.",
        "gloss": {
          "en": "Good. I like spicy food.",
          "ko": "좋아요. 저는 매운 음식을 좋아해요."
        },
        "frames": [
          "ko-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "음료는요?",
        "gloss": {
          "en": "And to drink?",
          "ko": "음료는요?"
        }
      },
      {
        "who": "me",
        "text": "저는 술을 안 마셔요. 물 주세요.",
        "gloss": {
          "en": "I don't drink alcohol. Water, please.",
          "ko": "저는 술을 안 마셔요. 물 주세요."
        },
        "frames": [
          "ko-f1-14",
          "ko-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for a lost bag at a station office",
      "ko": "역 분실물 센터에서 가방 찾기"
    },
    "expressions": [
      "아니요",
      "감사합니다"
    ],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "뭐 잃어버리셨어요?",
        "gloss": {
          "en": "Did you lose something?",
          "ko": "뭐 잃어버리셨어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 가방이 없어요.",
        "gloss": {
          "en": "Yes, my bag is missing.",
          "ko": "네, 가방이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "이 가방이에요?",
        "gloss": {
          "en": "Is it this bag?",
          "ko": "이 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 제 가방이 아니에요.",
        "gloss": {
          "en": "No, that's not my bag.",
          "ko": "아니요, 제 가방이 아니에요."
        },
        "frames": [
          "ko-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "그럼 이건요?",
        "gloss": {
          "en": "Then how about this one?",
          "ko": "그럼 이건요?"
        }
      },
      {
        "who": "me",
        "text": "네, 맞아요! 이건 제 가방이에요.",
        "gloss": {
          "en": "Yes, that's it! This is my bag.",
          "ko": "네, 맞아요! 이건 제 가방이에요."
        },
        "frames": [
          "ko-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "여기에 이름 써 주세요.",
        "gloss": {
          "en": "Please write your name here.",
          "ko": "여기에 이름 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "네. 정말 감사합니다.",
        "gloss": {
          "en": "Okay. Thank you so much.",
          "ko": "네. 정말 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ko-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call with a friend",
      "ko": "친구와 통화하기"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "여보세요? 지금 어디예요?",
        "gloss": {
          "en": "Hello? Where are you now?",
          "ko": "여보세요? 지금 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "지금 학교에 있어요.",
        "gloss": {
          "en": "I'm at school now.",
          "ko": "지금 학교에 있어요."
        },
        "frames": [
          "ko-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "저는 카페에 있어요. 시간 있어요?",
        "gloss": {
          "en": "I'm at a café. Do you have time?",
          "ko": "저는 카페에 있어요. 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "미안해요, 지금 시간이 없어요.",
        "gloss": {
          "en": "Sorry, I don't have time right now.",
          "ko": "미안해요, 지금 시간이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "괜찮아요. 내일은요?",
        "gloss": {
          "en": "That's okay. How about tomorrow?",
          "ko": "괜찮아요. 내일은요?"
        }
      },
      {
        "who": "me",
        "text": "내일은 좋아요. 저는 내일 시간이 있어요.",
        "gloss": {
          "en": "Tomorrow is good. I have time tomorrow.",
          "ko": "내일은 좋아요. 저는 내일 시간이 있어요."
        },
        "frames": [
          "ko-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 내일 봐요.",
        "gloss": {
          "en": "Great! See you tomorrow.",
          "ko": "좋아요! 내일 봐요."
        }
      },
      {
        "who": "me",
        "text": "네, 내일 봐요.",
        "gloss": {
          "en": "Okay, see you tomorrow.",
          "ko": "네, 내일 봐요."
        }
      }
    ]
  },
  {
    "id": "ko-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 프런트에서 체크인"
    },
    "expressions": [
      "감사합니다"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 체크인하세요?",
        "gloss": {
          "en": "Hello. Are you checking in?",
          "ko": "안녕하세요. 체크인하세요?"
        }
      },
      {
        "who": "me",
        "text": "네. 이건 제 여권이에요.",
        "gloss": {
          "en": "Yes. This is my passport.",
          "ko": "네. 이건 제 여권이에요."
        },
        "frames": [
          "ko-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "감사합니다. 방은 칠 층이에요. 여기 카드 키예요.",
        "gloss": {
          "en": "Thank you. Your room is on the seventh floor. Here's your key card.",
          "ko": "감사합니다. 방은 칠 층이에요. 여기 카드 키예요."
        }
      },
      {
        "who": "me",
        "text": "와이파이 있어요?",
        "gloss": {
          "en": "Is there Wi-Fi?",
          "ko": "와이파이 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네. 비밀번호는 카드 뒤에 있어요.",
        "gloss": {
          "en": "Yes. The password is on the back of the card.",
          "ko": "네. 비밀번호는 카드 뒤에 있어요."
        }
      },
      {
        "who": "me",
        "text": "아침 식사는 어디예요?",
        "gloss": {
          "en": "Where is breakfast?",
          "ko": "아침 식사는 어디예요?"
        },
        "frames": [
          "ko-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "일 층 식당이에요. 일곱 시부터예요.",
        "gloss": {
          "en": "It's in the restaurant on the first floor. It starts at seven.",
          "ko": "일 층 식당이에요. 일곱 시부터예요."
        }
      },
      {
        "who": "me",
        "text": "네, 감사합니다.",
        "gloss": {
          "en": "Okay, thank you.",
          "ko": "네, 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ko-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day in a Korean class",
      "ko": "한국어 수업 첫날"
    },
    "expressions": [
      "아니요",
      "잘 모르겠어요",
      "감사합니다"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 새 학생이에요?",
        "gloss": {
          "en": "Hello. Are you a new student?",
          "ko": "안녕하세요. 새 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "네. 저는 미국 사람이에요.",
        "gloss": {
          "en": "Yes. I'm American.",
          "ko": "네. 저는 미국 사람이에요."
        },
        "frames": [
          "ko-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "반가워요. 한국어 책 있어요?",
        "gloss": {
          "en": "Nice to meet you. Do you have the Korean book?",
          "ko": "반가워요. 한국어 책 있어요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 책이 없어요.",
        "gloss": {
          "en": "No, I don't have the book.",
          "ko": "아니요, 책이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "괜찮아요. 이 책 보세요.",
        "gloss": {
          "en": "That's okay. Look at this book.",
          "ko": "괜찮아요. 이 책 보세요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 이 단어는 잘 모르겠어요.",
        "gloss": {
          "en": "Thank you. I'm not sure about this word.",
          "ko": "감사합니다. 이 단어는 잘 모르겠어요."
        },
        "frames": [
          "ko-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "'숙제'예요. 집에서 하는 공부예요.",
        "gloss": {
          "en": "It's 'homework.' It's studying you do at home.",
          "ko": "'숙제'예요. 집에서 하는 공부예요."
        }
      },
      {
        "who": "me",
        "text": "아, 숙제! 감사합니다.",
        "gloss": {
          "en": "Oh, homework! Thank you.",
          "ko": "아, 숙제! 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ko-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying apples at a market stall",
      "ko": "시장 과일 가게에서 사과 사기"
    },
    "expressions": [
      "얼마예요",
      "다시 한번 말해 주세요",
      "아니요",
      "괜찮아요",
      "안녕히 계세요"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요! 사과 맛있어요.",
        "gloss": {
          "en": "Welcome! The apples are delicious.",
          "ko": "어서 오세요! 사과 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "사과 얼마예요?",
        "gloss": {
          "en": "How much are the apples?",
          "ko": "사과 얼마예요?"
        },
        "frames": [
          "ko-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "한 개에 천 원이에요.",
        "gloss": {
          "en": "They're a thousand won each.",
          "ko": "한 개에 천 원이에요."
        }
      },
      {
        "who": "me",
        "text": "다시 한번 말해 주세요.",
        "gloss": {
          "en": "Please say that again.",
          "ko": "다시 한번 말해 주세요."
        },
        "frames": [
          "ko-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "천 원이요, 천 원.",
        "gloss": {
          "en": "A thousand won, a thousand.",
          "ko": "천 원이요, 천 원."
        }
      },
      {
        "who": "me",
        "text": "그럼 사과 세 개 주세요.",
        "gloss": {
          "en": "Then three apples, please.",
          "ko": "그럼 사과 세 개 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "여기 있어요. 귤도 있어요.",
        "gloss": {
          "en": "Here you are. We have tangerines too.",
          "ko": "여기 있어요. 귤도 있어요."
        }
      },
      {
        "who": "me",
        "text": "아니요, 괜찮아요. 안녕히 계세요.",
        "gloss": {
          "en": "No, I'm okay. Goodbye.",
          "ko": "아니요, 괜찮아요. 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "ko-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's home",
      "ko": "친구 집에서 저녁 먹기"
    },
    "expressions": [
      "감사합니다",
      "괜찮아요"
    ],
    "grammar": [
      0,
      3,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 와요! 배고파요?",
        "gloss": {
          "en": "Come on in! Are you hungry?",
          "ko": "어서 와요! 배고파요?"
        }
      },
      {
        "who": "me",
        "text": "네! 와, 이건 뭐예요?",
        "gloss": {
          "en": "Yes! Wow, what's this?",
          "ko": "네! 와, 이건 뭐예요?"
        },
        "frames": [
          "ko-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "불고기예요. 먹어 봐요.",
        "gloss": {
          "en": "It's bulgogi. Try some.",
          "ko": "불고기예요. 먹어 봐요."
        }
      },
      {
        "who": "me",
        "text": "미안해요. 저는 채식주의자예요.",
        "gloss": {
          "en": "Sorry. I'm a vegetarian.",
          "ko": "미안해요. 저는 채식주의자예요."
        },
        "frames": [
          "ko-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "아, 그래요? 그럼 이 잡채 먹어요. 고기 없어요.",
        "gloss": {
          "en": "Oh, really? Then have this japchae. There's no meat.",
          "ko": "아, 그래요? 그럼 이 잡채 먹어요. 고기 없어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 저는 잡채를 좋아해요.",
        "gloss": {
          "en": "Thank you. I like japchae.",
          "ko": "감사합니다. 저는 잡채를 좋아해요."
        },
        "frames": [
          "ko-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "맥주도 있어요.",
        "gloss": {
          "en": "There's beer too.",
          "ko": "맥주도 있어요."
        }
      },
      {
        "who": "me",
        "text": "괜찮아요. 저는 술을 안 마셔요.",
        "gloss": {
          "en": "I'm fine. I don't drink alcohol.",
          "ko": "괜찮아요. 저는 술을 안 마셔요."
        },
        "frames": [
          "ko-f1-14"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying cold medicine at a pharmacy",
      "ko": "약국에서 감기약 사기"
    },
    "expressions": [
      "안녕하세요",
      "아니요",
      "죄송합니다",
      "천천히 말해 주세요",
      "감사합니다",
      "얼마예요"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요.",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 감기약 있어요?",
        "gloss": {
          "en": "Hello. Do you have cold medicine?",
          "ko": "안녕하세요. 감기약 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 있어요. 열이 있어요?",
        "gloss": {
          "en": "Yes, we do. Do you have a fever?",
          "ko": "네, 있어요. 열이 있어요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 열은 없어요.",
        "gloss": {
          "en": "No, I don't have a fever.",
          "ko": "아니요, 열은 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "그럼 이 약 드세요. 하루에 세 번이에요.",
        "gloss": {
          "en": "Then take this medicine. It's three times a day.",
          "ko": "그럼 이 약 드세요. 하루에 세 번이에요."
        }
      },
      {
        "who": "me",
        "text": "죄송합니다. 천천히 말해 주세요.",
        "gloss": {
          "en": "Sorry. Please speak slowly.",
          "ko": "죄송합니다. 천천히 말해 주세요."
        },
        "frames": [
          "ko-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "하루에, 세 번, 드세요.",
        "gloss": {
          "en": "Take it three times, a day.",
          "ko": "하루에, 세 번, 드세요."
        }
      },
      {
        "who": "me",
        "text": "네, 감사합니다. 얼마예요?",
        "gloss": {
          "en": "Okay, thank you. How much is it?",
          "ko": "네, 감사합니다. 얼마예요?"
        },
        "frames": [
          "ko-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about hobbies at lunch with a coworker",
      "ko": "점심시간에 동료와 취미 이야기"
    },
    "expressions": [
      "아니요"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "주말에 보통 뭐 해요?",
        "gloss": {
          "en": "What do you usually do on weekends?",
          "ko": "주말에 보통 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "저는 등산을 좋아해요.",
        "gloss": {
          "en": "I like hiking.",
          "ko": "저는 등산을 좋아해요."
        },
        "frames": [
          "ko-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "와, 저도요! 등산화 있어요?",
        "gloss": {
          "en": "Wow, me too! Do you have hiking boots?",
          "ko": "와, 저도요! 등산화 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 저는 등산화가 있어요.",
        "gloss": {
          "en": "Yes, I have hiking boots.",
          "ko": "네, 저는 등산화가 있어요."
        },
        "frames": [
          "ko-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "북한산 알아요?",
        "gloss": {
          "en": "Do you know Bukhansan?",
          "ko": "북한산 알아요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 북한산은 잘 모르겠어요.",
        "gloss": {
          "en": "No, I don't really know Bukhansan.",
          "ko": "아니요, 북한산은 잘 모르겠어요."
        },
        "frames": [
          "ko-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "정말 좋은 산이에요. 같이 가요!",
        "gloss": {
          "en": "It's a really nice mountain. Let's go together!",
          "ko": "정말 좋은 산이에요. 같이 가요!"
        }
      },
      {
        "who": "me",
        "text": "좋아요!",
        "gloss": {
          "en": "Sounds good!",
          "ko": "좋아요!"
        }
      }
    ]
  },
  {
    "id": "ko-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a dictionary at a bookstore",
      "ko": "서점에서 사전 사기"
    },
    "expressions": [
      "얼마예요",
      "아니요",
      "괜찮아요"
    ],
    "grammar": [
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "찾으시는 책 있어요?",
        "gloss": {
          "en": "Are you looking for a book?",
          "ko": "찾으시는 책 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 한국어 사전 있어요?",
        "gloss": {
          "en": "Yes, do you have a Korean dictionary?",
          "ko": "네, 한국어 사전 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 있어요. 한국어 공부해요?",
        "gloss": {
          "en": "Yes, we do. Do you study Korean?",
          "ko": "네, 있어요. 한국어 공부해요?"
        }
      },
      {
        "who": "me",
        "text": "네, 저는 한국어를 공부해요.",
        "gloss": {
          "en": "Yes, I study Korean.",
          "ko": "네, 저는 한국어를 공부해요."
        },
        "frames": [
          "ko-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "이 사전 어때요? 쉬워요.",
        "gloss": {
          "en": "How about this dictionary? It's easy.",
          "ko": "이 사전 어때요? 쉬워요."
        }
      },
      {
        "who": "me",
        "text": "좋아요. 얼마예요?",
        "gloss": {
          "en": "Good. How much is it?",
          "ko": "좋아요. 얼마예요?"
        },
        "frames": [
          "ko-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "이만 원이에요. 봉투 필요해요?",
        "gloss": {
          "en": "It's twenty thousand won. Do you need a bag?",
          "ko": "이만 원이에요. 봉투 필요해요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 괜찮아요. 저는 가방이 있어요.",
        "gloss": {
          "en": "No, I'm fine. I have a bag.",
          "ko": "아니요, 괜찮아요. 저는 가방이 있어요."
        },
        "frames": [
          "ko-f1-10"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a neighbor in the elevator",
      "ko": "엘리베이터에서 이웃 만나기"
    },
    "expressions": [
      "만나서 반가워요",
      "아니요",
      "안녕히 가세요"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 새로 이사 왔어요?",
        "gloss": {
          "en": "Hello. Did you just move in?",
          "ko": "안녕하세요. 새로 이사 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 만나서 반가워요. 저는 오백삼 호예요.",
        "gloss": {
          "en": "Yes, nice to meet you. I'm in unit five-oh-three.",
          "ko": "네, 만나서 반가워요. 저는 오백삼 호예요."
        },
        "frames": [
          "ko-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "아, 반가워요! 저는 칠 층에 살아요. 학생이에요?",
        "gloss": {
          "en": "Oh, nice to meet you! I live on the seventh floor. Are you a student?",
          "ko": "아, 반가워요! 저는 칠 층에 살아요. 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 학생이 아니에요. 요리사예요.",
        "gloss": {
          "en": "No, I'm not a student. I'm a cook.",
          "ko": "아니요, 학생이 아니에요. 요리사예요."
        },
        "frames": [
          "ko-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "와, 멋있어요! 무슨 요리를 좋아해요?",
        "gloss": {
          "en": "Wow, that's cool! What kind of food do you like?",
          "ko": "와, 멋있어요! 무슨 요리를 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "저는 한식을 좋아해요.",
        "gloss": {
          "en": "I like Korean food.",
          "ko": "저는 한식을 좋아해요."
        },
        "frames": [
          "ko-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 그럼 안녕히 가세요.",
        "gloss": {
          "en": "Nice! Well, goodbye.",
          "ko": "좋아요! 그럼 안녕히 가세요."
        }
      },
      {
        "who": "me",
        "text": "네, 안녕히 가세요.",
        "gloss": {
          "en": "Yes, goodbye.",
          "ko": "네, 안녕히 가세요."
        }
      }
    ]
  },
  {
    "id": "ko-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying tickets at a museum",
      "ko": "박물관 매표소에서"
    },
    "expressions": [
      "여기요",
      "감사합니다"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 몇 명이에요?",
        "gloss": {
          "en": "Hello. How many people?",
          "ko": "안녕하세요. 몇 명이에요?"
        }
      },
      {
        "who": "me",
        "text": "두 명이에요.",
        "gloss": {
          "en": "There are two of us.",
          "ko": "두 명이에요."
        },
        "frames": [
          "ko-f1-20"
        ]
      },
      {
        "who": "them",
        "text": "학생이에요?",
        "gloss": {
          "en": "Are you students?",
          "ko": "학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "네, 저는 학생이에요. 학생증 여기요.",
        "gloss": {
          "en": "Yes, I'm a student. Here's my student ID.",
          "ko": "네, 저는 학생이에요. 학생증 여기요."
        },
        "frames": [
          "ko-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "그럼 학생 한 명, 어른 한 명이에요. 만 이천 원이에요.",
        "gloss": {
          "en": "Then that's one student and one adult. It's twelve thousand won.",
          "ko": "그럼 학생 한 명, 어른 한 명이에요. 만 이천 원이에요."
        }
      },
      {
        "who": "me",
        "text": "여기요. 지도 있어요?",
        "gloss": {
          "en": "Here you go. Do you have a map?",
          "ko": "여기요. 지도 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 여기 있어요. 영어 지도도 있어요.",
        "gloss": {
          "en": "Yes, here you are. There's an English map too.",
          "ko": "네, 여기 있어요. 영어 지도도 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 사물함은 어디예요?",
        "gloss": {
          "en": "Thank you. Where are the lockers?",
          "ko": "감사합니다. 사물함은 어디예요?"
        },
        "frames": [
          "ko-f1-08"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a new office",
      "ko": "새 회사 첫날 동료와"
    },
    "expressions": [
      "처음 뵙겠습니다",
      "감사합니다",
      "한국어 조금 해요",
      "아니요"
    ],
    "grammar": [
      0,
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요! 오늘 처음 왔어요?",
        "gloss": {
          "en": "Hello! Is today your first day?",
          "ko": "안녕하세요! 오늘 처음 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 처음 뵙겠습니다. 저는 디자이너예요.",
        "gloss": {
          "en": "Yes, nice to meet you. I'm a designer.",
          "ko": "네, 처음 뵙겠습니다. 저는 디자이너예요."
        },
        "frames": [
          "ko-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "반가워요. 어느 나라 사람이에요?",
        "gloss": {
          "en": "Nice to meet you. Where are you from?",
          "ko": "반가워요. 어느 나라 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "저는 프랑스 사람이에요.",
        "gloss": {
          "en": "I'm French.",
          "ko": "저는 프랑스 사람이에요."
        },
        "frames": [
          "ko-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "한국어 잘해요!",
        "gloss": {
          "en": "Your Korean is good!",
          "ko": "한국어 잘해요!"
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 한국어 조금 해요.",
        "gloss": {
          "en": "Thank you. I speak a little Korean.",
          "ko": "감사합니다. 한국어 조금 해요."
        },
        "frames": [
          "ko-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "커피 마셔요?",
        "gloss": {
          "en": "Do you drink coffee?",
          "ko": "커피 마셔요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 저는 커피를 안 마셔요. 녹차를 좋아해요.",
        "gloss": {
          "en": "No, I don't drink coffee. I like green tea.",
          "ko": "아니요, 저는 커피를 안 마셔요. 녹차를 좋아해요."
        },
        "frames": [
          "ko-f1-14",
          "ko-f1-12"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Small talk about the cold at a bus stop",
      "ko": "버스 정류장에서 날씨 이야기"
    },
    "expressions": [
      "감사합니다",
      "안녕히 가세요"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "오늘 진짜 추워요.",
        "gloss": {
          "en": "It's really cold today.",
          "ko": "오늘 진짜 추워요."
        }
      },
      {
        "who": "me",
        "text": "네. 그런데 저는 장갑이 없어요.",
        "gloss": {
          "en": "Yes. But I don't have gloves.",
          "ko": "네. 그런데 저는 장갑이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "저는 핫팩이 두 개 있어요. 이거 써요.",
        "gloss": {
          "en": "I have two hand warmers. Use this one.",
          "ko": "저는 핫팩이 두 개 있어요. 이거 써요."
        }
      },
      {
        "who": "me",
        "text": "와, 감사합니다! 이건 뭐예요?",
        "gloss": {
          "en": "Wow, thank you! What is this?",
          "ko": "와, 감사합니다! 이건 뭐예요?"
        },
        "frames": [
          "ko-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "핫팩이에요. 따뜻해요.",
        "gloss": {
          "en": "It's a hand warmer. It's warm.",
          "ko": "핫팩이에요. 따뜻해요."
        }
      },
      {
        "who": "me",
        "text": "와, 좋아요. 저는 겨울을 안 좋아해요.",
        "gloss": {
          "en": "Wow, nice. I don't like winter.",
          "ko": "와, 좋아요. 저는 겨울을 안 좋아해요."
        }
      },
      {
        "who": "them",
        "text": "저도요. 아, 제 버스 왔어요!",
        "gloss": {
          "en": "Me neither. Oh, my bus is here!",
          "ko": "저도요. 아, 제 버스 왔어요!"
        }
      },
      {
        "who": "me",
        "text": "네, 안녕히 가세요!",
        "gloss": {
          "en": "Okay, goodbye!",
          "ko": "네, 안녕히 가세요!"
        }
      }
    ]
  },
  {
    "id": "ko-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Receiving a package at the door",
      "ko": "현관에서 택배 받기"
    },
    "expressions": [
      "감사합니다",
      "아니요",
      "괜찮아요"
    ],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요, 택배예요. 여기 사인해 주세요.",
        "gloss": {
          "en": "Hello, delivery. Please sign here.",
          "ko": "안녕하세요, 택배예요. 여기 사인해 주세요."
        }
      },
      {
        "who": "me",
        "text": "네. 그런데 펜이 없어요.",
        "gloss": {
          "en": "Okay. But I don't have a pen.",
          "ko": "네. 그런데 펜이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "여기 펜 있어요.",
        "gloss": {
          "en": "Here's a pen.",
          "ko": "여기 펜 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 이 상자도 제 거예요?",
        "gloss": {
          "en": "Thank you. Is this box mine too?",
          "ko": "감사합니다. 이 상자도 제 거예요?"
        }
      },
      {
        "who": "them",
        "text": "네, 두 개 다 손님 거예요.",
        "gloss": {
          "en": "Yes, both of them are yours.",
          "ko": "네, 두 개 다 손님 거예요."
        }
      },
      {
        "who": "me",
        "text": "아니요, 이건 제 상자가 아니에요. 이름이 달라요.",
        "gloss": {
          "en": "No, this isn't my box. The name is different.",
          "ko": "아니요, 이건 제 상자가 아니에요. 이름이 달라요."
        },
        "frames": [
          "ko-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "아, 죄송합니다! 옆집 거예요.",
        "gloss": {
          "en": "Oh, I'm sorry! It's for next door.",
          "ko": "아, 죄송합니다! 옆집 거예요."
        }
      },
      {
        "who": "me",
        "text": "괜찮아요. 이건 제 상자예요.",
        "gloss": {
          "en": "That's okay. This one is my box.",
          "ko": "괜찮아요. 이건 제 상자예요."
        },
        "frames": [
          "ko-f1-19"
        ]
      }
    ]
  },
  {
    "id": "ko-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way at a tourist information center",
      "ko": "관광 안내소에서 길 묻기"
    },
    "expressions": [
      "안녕하세요",
      "다시 한번 말해 주세요",
      "죄송합니다",
      "감사합니다",
      "안녕히 계세요"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "안녕하세요. 뭐 도와드릴까요?",
        "gloss": {
          "en": "Hello. How can I help you?",
          "ko": "안녕하세요. 뭐 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 지금 서울역에 있어요. 경복궁 어디예요?",
        "gloss": {
          "en": "Hello. I'm at Seoul Station now. Where is Gyeongbokgung?",
          "ko": "안녕하세요. 지금 서울역에 있어요. 경복궁 어디예요?"
        },
        "frames": [
          "ko-f1-18",
          "ko-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "경복궁은 지하철로 가요. 삼호선이에요.",
        "gloss": {
          "en": "You go to Gyeongbokgung by subway. It's Line Three.",
          "ko": "경복궁은 지하철로 가요. 삼호선이에요."
        }
      },
      {
        "who": "me",
        "text": "죄송합니다. 다시 한번 말해 주세요.",
        "gloss": {
          "en": "Sorry. Please say that again.",
          "ko": "죄송합니다. 다시 한번 말해 주세요."
        },
        "frames": [
          "ko-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "삼, 호, 선이요. 지도 드릴까요?",
        "gloss": {
          "en": "Line, Three. Shall I give you a map?",
          "ko": "삼, 호, 선이요. 지도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "네, 지도 주세요.",
        "gloss": {
          "en": "Yes, a map, please.",
          "ko": "네, 지도 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "여기 있어요.",
        "gloss": {
          "en": "Here you are.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 안녕히 계세요.",
        "gloss": {
          "en": "Thank you. Goodbye.",
          "ko": "감사합니다. 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "ko-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday morning chat at the office",
      "ko": "월요일 아침 사무실에서"
    },
    "expressions": [
      "주말에 뭐 했어요",
      "재미있었어요",
      "다음에 같이 가요"
    ],
    "grammar": [
      0,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "좋은 아침이에요!",
        "gloss": {
          "en": "Good morning!",
          "ko": "좋은 아침이에요!"
        }
      },
      {
        "who": "me",
        "text": "좋은 아침이에요. 주말에 뭐 했어요?",
        "gloss": {
          "en": "Good morning. What did you do over the weekend?",
          "ko": "좋은 아침이에요. 주말에 뭐 했어요?"
        },
        "frames": [
          "ko-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "집에서 쉬었어요. 주말 잘 보냈어요?",
        "gloss": {
          "en": "I rested at home. Did you have a good weekend?",
          "ko": "집에서 쉬었어요. 주말 잘 보냈어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 어제 놀이공원에 갔어요.",
        "gloss": {
          "en": "Yes, I went to an amusement park yesterday.",
          "ko": "네, 어제 놀이공원에 갔어요."
        },
        "frames": [
          "ko-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "와, 어땠어요?",
        "gloss": {
          "en": "Wow, how was it?",
          "ko": "와, 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "롤러코스터가 진짜 재미있었어요.",
        "gloss": {
          "en": "The roller coaster was really fun.",
          "ko": "롤러코스터가 진짜 재미있었어요."
        },
        "frames": [
          "ko-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "부러워요. 저도 가고 싶어요.",
        "gloss": {
          "en": "I'm jealous. I want to go too.",
          "ko": "부러워요. 저도 가고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "다음에 같이 가요!",
        "gloss": {
          "en": "Let's go together next time!",
          "ko": "다음에 같이 가요!"
        },
        "frames": [
          "ko-f2-04"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Trying on a dress at a clothing store",
      "ko": "옷 가게에서 원피스 입어 보기"
    },
    "expressions": [
      "입어 봐도 돼요",
      "카드 돼요"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 천천히 보세요.",
        "gloss": {
          "en": "Welcome. Take your time.",
          "ko": "어서 오세요. 천천히 보세요."
        }
      },
      {
        "who": "me",
        "text": "이 원피스 입어 봐도 돼요?",
        "gloss": {
          "en": "Can I try on this dress?",
          "ko": "이 원피스 입어 봐도 돼요?"
        },
        "frames": [
          "ko-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "네, 탈의실은 저쪽이에요. 사이즈 어때요?",
        "gloss": {
          "en": "Sure, the fitting room is over there. How's the size?",
          "ko": "네, 탈의실은 저쪽이에요. 사이즈 어때요?"
        }
      },
      {
        "who": "me",
        "text": "좀 작아요. 다른 사이즈 있어요?",
        "gloss": {
          "en": "It's a bit small. Do you have another size?",
          "ko": "좀 작아요. 다른 사이즈 있어요?"
        },
        "frames": [
          "ko-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "네, 여기 큰 사이즈요.",
        "gloss": {
          "en": "Yes, here's a bigger size.",
          "ko": "네, 여기 큰 사이즈요."
        }
      },
      {
        "who": "me",
        "text": "이게 딱 좋아요. 카드 돼요?",
        "gloss": {
          "en": "This one is just right. Can I pay by card?",
          "ko": "이게 딱 좋아요. 카드 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 영수증 드릴까요?",
        "gloss": {
          "en": "Yes, you can. Would you like a receipt?",
          "ko": "네, 돼요. 영수증 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "네, 주세요. 감사합니다.",
        "gloss": {
          "en": "Yes, please. Thank you.",
          "ko": "네, 주세요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ko-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Taking a taxi to the airport",
      "ko": "택시 타고 공항 가기"
    },
    "expressions": [
      "카드 돼요"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어디로 갈까요?",
        "gloss": {
          "en": "Hello. Where to?",
          "ko": "어서 오세요. 어디로 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "인천공항으로 가 주세요.",
        "gloss": {
          "en": "To Incheon Airport, please.",
          "ko": "인천공항으로 가 주세요."
        },
        "frames": [
          "ko-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "네. 제일 터미널이에요?",
        "gloss": {
          "en": "Okay. Is it Terminal One?",
          "ko": "네. 제일 터미널이에요?"
        }
      },
      {
        "who": "me",
        "text": "네, 제일 터미널이요. 저 진짜 급해요.",
        "gloss": {
          "en": "Yes, Terminal One. I'm in a real hurry.",
          "ko": "네, 제일 터미널이요. 저 진짜 급해요."
        },
        "frames": [
          "ko-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "걱정 마세요. 지금 길이 안 막혀요.",
        "gloss": {
          "en": "Don't worry. The roads aren't busy right now.",
          "ko": "걱정 마세요. 지금 길이 안 막혀요."
        }
      },
      {
        "who": "me",
        "text": "다행이에요. 카드 돼요?",
        "gloss": {
          "en": "That's a relief. Can I pay by card?",
          "ko": "다행이에요. 카드 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 다 왔어요. 어디서 세워 드릴까요?",
        "gloss": {
          "en": "Yes, you can. We're here. Where should I stop?",
          "ko": "네, 돼요. 다 왔어요. 어디서 세워 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "저기 삼 번 출구 앞에서 세워 주세요.",
        "gloss": {
          "en": "Please stop in front of Exit Three over there.",
          "ko": "저기 삼 번 출구 앞에서 세워 주세요."
        },
        "frames": [
          "ko-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting with a passenger on the bus",
      "ko": "버스에서 옆 승객과 이야기"
    },
    "expressions": [
      "어디서 내려요",
      "진짜요"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어디 가요?",
        "gloss": {
          "en": "Where are you headed?",
          "ko": "어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "남대문시장에 가요. 시장은 어디서 내려요?",
        "gloss": {
          "en": "I'm going to Namdaemun Market. Where do I get off for the market?",
          "ko": "남대문시장에 가요. 시장은 어디서 내려요?"
        },
        "frames": [
          "ko-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "회현역 앞에서 내려요. 시장에 뭐 사러 가요?",
        "gloss": {
          "en": "Get off in front of Hoehyeon Station. What are you going to buy?",
          "ko": "회현역 앞에서 내려요. 시장에 뭐 사러 가요?"
        }
      },
      {
        "who": "me",
        "text": "엄마 선물을 사러 가요.",
        "gloss": {
          "en": "I'm going to buy a present for my mom.",
          "ko": "엄마 선물을 사러 가요."
        },
        "frames": [
          "ko-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "좋네요. 시장에 맛있는 호떡도 있어요.",
        "gloss": {
          "en": "Nice. There's tasty hotteok at the market too.",
          "ko": "좋네요. 시장에 맛있는 호떡도 있어요."
        }
      },
      {
        "who": "me",
        "text": "진짜요? 호떡 먹고 싶어요.",
        "gloss": {
          "en": "Really? I want to eat hotteok.",
          "ko": "진짜요? 호떡 먹고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "꼭 먹어 봐요. 아, 다음 정류장이에요!",
        "gloss": {
          "en": "Make sure you try it. Oh, the next stop is yours!",
          "ko": "꼭 먹어 봐요. 아, 다음 정류장이에요!"
        }
      },
      {
        "who": "me",
        "text": "감사합니다! 안녕히 가세요.",
        "gloss": {
          "en": "Thank you! Goodbye.",
          "ko": "감사합니다! 안녕히 가세요."
        }
      }
    ]
  },
  {
    "id": "ko-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor at a clinic",
      "ko": "동네 병원 진료실에서"
    },
    "expressions": [
      "머리가 아파요",
      "피곤해요"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "어디가 불편하세요?",
        "gloss": {
          "en": "What seems to be the problem?",
          "ko": "어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "어제부터 머리가 아파요.",
        "gloss": {
          "en": "I've had a headache since yesterday.",
          "ko": "어제부터 머리가 아파요."
        },
        "frames": [
          "ko-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "열도 있어요?",
        "gloss": {
          "en": "Do you have a fever too?",
          "ko": "열도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 조금 있어요. 그리고 저 진짜 피곤해요.",
        "gloss": {
          "en": "Yes, a little. And I'm really tired.",
          "ko": "네, 조금 있어요. 그리고 저 진짜 피곤해요."
        },
        "frames": [
          "ko-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "감기예요. 약 먹고 푹 쉬세요.",
        "gloss": {
          "en": "It's a cold. Take medicine and get plenty of rest.",
          "ko": "감기예요. 약 먹고 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "내일 회사에 갈 수 있어요?",
        "gloss": {
          "en": "Can I go to work tomorrow?",
          "ko": "내일 회사에 갈 수 있어요?"
        }
      },
      {
        "who": "them",
        "text": "내일은 집에서 쉬세요.",
        "gloss": {
          "en": "Rest at home tomorrow.",
          "ko": "내일은 집에서 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "네. 그럼 약국에 약 사러 가요.",
        "gloss": {
          "en": "Okay. Then I'll go to the pharmacy to get medicine.",
          "ko": "네. 그럼 약국에 약 사러 가요."
        },
        "frames": [
          "ko-f2-09"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Making weekend plans on the phone",
      "ko": "전화로 주말 약속 잡기"
    },
    "expressions": [
      "그때 봐요"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "이번 토요일에 시간 있어요?",
        "gloss": {
          "en": "Are you free this Saturday?",
          "ko": "이번 토요일에 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "오전에는 수업이 있어요. 오후 세 시에 만날까요?",
        "gloss": {
          "en": "I have a class in the morning. Shall we meet at three in the afternoon?",
          "ko": "오전에는 수업이 있어요. 오후 세 시에 만날까요?"
        },
        "frames": [
          "ko-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 뭐 할까요?",
        "gloss": {
          "en": "Sounds good. What shall we do?",
          "ko": "좋아요. 뭐 할까요?"
        }
      },
      {
        "who": "me",
        "text": "인사동 구경하고 같이 저녁 먹을까요?",
        "gloss": {
          "en": "Shall we look around Insadong and then have dinner together?",
          "ko": "인사동 구경하고 같이 저녁 먹을까요?"
        },
        "frames": [
          "ko-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 저 인사동 처음이에요.",
        "gloss": {
          "en": "Great! It's my first time in Insadong.",
          "ko": "좋아요! 저 인사동 처음이에요."
        }
      },
      {
        "who": "me",
        "text": "저는 인사동에서 전통차를 마시고 싶어요.",
        "gloss": {
          "en": "I want to drink traditional tea in Insadong.",
          "ko": "저는 인사동에서 전통차를 마시고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "좋네요. 그럼 안국역에서 봐요.",
        "gloss": {
          "en": "Nice. Then see you at Anguk Station.",
          "ko": "좋네요. 그럼 안국역에서 봐요."
        }
      },
      {
        "who": "me",
        "text": "네, 그때 봐요!",
        "gloss": {
          "en": "Okay, see you then!",
          "ko": "네, 그때 봐요!"
        }
      }
    ]
  },
  {
    "id": "ko-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Arriving late to meet a friend",
      "ko": "친구와의 약속에 늦었을 때"
    },
    "expressions": [
      "늦어서 미안해요",
      "배고파요"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "어, 왔어요? 한참 기다렸어요.",
        "gloss": {
          "en": "Oh, you're here? I waited a long time.",
          "ko": "어, 왔어요? 한참 기다렸어요."
        }
      },
      {
        "who": "me",
        "text": "늦어서 미안해요. 버스를 잘못 탔어요.",
        "gloss": {
          "en": "Sorry I'm late. I took the wrong bus.",
          "ko": "늦어서 미안해요. 버스를 잘못 탔어요."
        },
        "frames": [
          "ko-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "괜찮아요. 배 안 고파요?",
        "gloss": {
          "en": "It's okay. Aren't you hungry?",
          "ko": "괜찮아요. 배 안 고파요?"
        }
      },
      {
        "who": "me",
        "text": "저 진짜 배고파요.",
        "gloss": {
          "en": "I'm really hungry.",
          "ko": "저 진짜 배고파요."
        },
        "frames": [
          "ko-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "그럼 뭐 먹을까요?",
        "gloss": {
          "en": "Then what shall we eat?",
          "ko": "그럼 뭐 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "떡볶이 먹고 싶어요.",
        "gloss": {
          "en": "I want to eat tteokbokki.",
          "ko": "떡볶이 먹고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 이 근처에 맛집 있어요.",
        "gloss": {
          "en": "Great. There's a good place near here.",
          "ko": "좋아요. 이 근처에 맛집 있어요."
        }
      },
      {
        "who": "me",
        "text": "좋아요, 가요!",
        "gloss": {
          "en": "Great, let's go!",
          "ko": "좋아요, 가요!"
        }
      }
    ]
  },
  {
    "id": "ko-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Part-time job interview at a café",
      "ko": "카페 아르바이트 면접"
    },
    "expressions": [],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "카페에서 일해 봤어요?",
        "gloss": {
          "en": "Have you worked at a café before?",
          "ko": "카페에서 일해 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "네. 저는 라테 아트를 할 수 있어요.",
        "gloss": {
          "en": "Yes. I can do latte art.",
          "ko": "네. 저는 라테 아트를 할 수 있어요."
        },
        "frames": [
          "ko-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "와, 좋아요. 주말에도 일할 수 있어요?",
        "gloss": {
          "en": "Wow, great. Can you work on weekends too?",
          "ko": "와, 좋아요. 주말에도 일할 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 주말에도 일하고 싶어요.",
        "gloss": {
          "en": "Yes, I want to work on weekends too.",
          "ko": "네, 주말에도 일하고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "외국어는요?",
        "gloss": {
          "en": "What about foreign languages?",
          "ko": "외국어는요?"
        }
      },
      {
        "who": "me",
        "text": "저는 영어하고 중국어도 할 수 있어요.",
        "gloss": {
          "en": "I can speak English and Chinese too.",
          "ko": "저는 영어하고 중국어도 할 수 있어요."
        },
        "frames": [
          "ko-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "좋네요. 다음 주 월요일부터 시작할 수 있어요?",
        "gloss": {
          "en": "Good. Can you start next Monday?",
          "ko": "좋네요. 다음 주 월요일부터 시작할 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네! 월요일에 몇 시까지 올까요?",
        "gloss": {
          "en": "Yes! What time should I come on Monday?",
          "ko": "네! 월요일에 몇 시까지 올까요?"
        }
      }
    ]
  },
  {
    "id": "ko-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about yesterday with a classmate",
      "ko": "반 친구와 어제 이야기"
    },
    "expressions": [
      "재미있었어요",
      "진짜요",
      "몇 시에 만날까요"
    ],
    "grammar": [
      0,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "어제 뭐 했어요?",
        "gloss": {
          "en": "What did you do yesterday?",
          "ko": "어제 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "어제 홍대에서 친구를 만났어요.",
        "gloss": {
          "en": "I met a friend in Hongdae yesterday.",
          "ko": "어제 홍대에서 친구를 만났어요."
        },
        "frames": [
          "ko-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "뭐 했어요?",
        "gloss": {
          "en": "What did you do?",
          "ko": "뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "버스킹을 보고 노래방에 갔어요. 노래방이 진짜 재미있었어요.",
        "gloss": {
          "en": "We watched some buskers and went to karaoke. Karaoke was really fun.",
          "ko": "버스킹을 보고 노래방에 갔어요. 노래방이 진짜 재미있었어요."
        },
        "frames": [
          "ko-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "좋았겠다! 저도 노래방 좋아해요.",
        "gloss": {
          "en": "Sounds fun! I like karaoke too.",
          "ko": "좋았겠다! 저도 노래방 좋아해요."
        }
      },
      {
        "who": "me",
        "text": "진짜요? 다음에 같이 노래방에 가요.",
        "gloss": {
          "en": "Really? Let's go to karaoke together next time.",
          "ko": "진짜요? 다음에 같이 노래방에 가요."
        },
        "frames": [
          "ko-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 금요일 저녁 어때요?",
        "gloss": {
          "en": "Great! How about Friday evening?",
          "ko": "좋아요! 금요일 저녁 어때요?"
        }
      },
      {
        "who": "me",
        "text": "좋아요. 몇 시에 만날까요?",
        "gloss": {
          "en": "Good. What time shall we meet?",
          "ko": "좋아요. 몇 시에 만날까요?"
        },
        "frames": [
          "ko-f2-11"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering naengmyeon at a restaurant",
      "ko": "식당에서 냉면 주문하기"
    },
    "expressions": [],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "주문하시겠어요?",
        "gloss": {
          "en": "Are you ready to order?",
          "ko": "주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "이 비빔냉면 먹고 싶어요. 그런데 많이 매워요?",
        "gloss": {
          "en": "I'd like this spicy cold noodle dish. But is it very spicy?",
          "ko": "이 비빔냉면 먹고 싶어요. 그런데 많이 매워요?"
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "네, 좀 매워요.",
        "gloss": {
          "en": "Yes, it's a bit spicy.",
          "ko": "네, 좀 매워요."
        }
      },
      {
        "who": "me",
        "text": "다른 메뉴 있어요? 안 매운 거요.",
        "gloss": {
          "en": "Do you have another dish? Something not spicy.",
          "ko": "다른 메뉴 있어요? 안 매운 거요."
        },
        "frames": [
          "ko-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "물냉면은 안 매워요.",
        "gloss": {
          "en": "The cold broth noodles aren't spicy.",
          "ko": "물냉면은 안 매워요."
        }
      },
      {
        "who": "me",
        "text": "그럼 물냉면 주세요. 만두 포장도 돼요?",
        "gloss": {
          "en": "Then cold broth noodles, please. Can I also get dumplings to go?",
          "ko": "그럼 물냉면 주세요. 만두 포장도 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요.",
        "gloss": {
          "en": "Yes, you can.",
          "ko": "네, 돼요."
        }
      },
      {
        "who": "me",
        "text": "그럼 만두 하나 포장해 주세요.",
        "gloss": {
          "en": "Then one order of dumplings to go, please.",
          "ko": "그럼 만두 하나 포장해 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket at the station",
      "ko": "기차역 매표소에서"
    },
    "expressions": [],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "어디까지 가세요?",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디까지 가세요?"
        }
      },
      {
        "who": "me",
        "text": "내일 경주에 갈 거예요. 아침 기차 있어요?",
        "gloss": {
          "en": "I'm going to Gyeongju tomorrow. Is there a morning train?",
          "ko": "내일 경주에 갈 거예요. 아침 기차 있어요?"
        },
        "frames": [
          "ko-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "여덟 시 기차 있어요.",
        "gloss": {
          "en": "There's an eight o'clock train.",
          "ko": "여덟 시 기차 있어요."
        }
      },
      {
        "who": "me",
        "text": "창가 자리 돼요?",
        "gloss": {
          "en": "Is a window seat available?",
          "ko": "창가 자리 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 돌아오는 표도 필요해요?",
        "gloss": {
          "en": "Yes, it is. Do you need a return ticket too?",
          "ko": "네, 돼요. 돌아오는 표도 필요해요?"
        }
      },
      {
        "who": "me",
        "text": "네, 일요일에 돌아오고 싶어요.",
        "gloss": {
          "en": "Yes, I want to come back on Sunday.",
          "ko": "네, 일요일에 돌아오고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "일요일 오후 다섯 시 어때요?",
        "gloss": {
          "en": "How about five p.m. on Sunday?",
          "ko": "일요일 오후 다섯 시 어때요?"
        }
      },
      {
        "who": "me",
        "text": "좋아요. 그걸로 주세요.",
        "gloss": {
          "en": "Good. I'll take that one, please.",
          "ko": "좋아요. 그걸로 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about swimming with a friend",
      "ko": "친구와 수영 이야기"
    },
    "expressions": [],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "요즘 운동해요?",
        "gloss": {
          "en": "Do you exercise these days?",
          "ko": "요즘 운동해요?"
        }
      },
      {
        "who": "me",
        "text": "네, 아침마다 수영하러 가요.",
        "gloss": {
          "en": "Yes, I go swimming every morning.",
          "ko": "네, 아침마다 수영하러 가요."
        },
        "frames": [
          "ko-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "와, 수영 잘해요?",
        "gloss": {
          "en": "Wow, are you good at swimming?",
          "ko": "와, 수영 잘해요?"
        }
      },
      {
        "who": "me",
        "text": "네, 저는 접영도 할 수 있어요.",
        "gloss": {
          "en": "Yes, I can even do the butterfly.",
          "ko": "네, 저는 접영도 할 수 있어요."
        },
        "frames": [
          "ko-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "대박! 저는 수영을 못 해요.",
        "gloss": {
          "en": "Wow! I can't swim.",
          "ko": "대박! 저는 수영을 못 해요."
        }
      },
      {
        "who": "me",
        "text": "그럼 다음에 같이 수영장에 가요.",
        "gloss": {
          "en": "Then let's go to the pool together next time.",
          "ko": "그럼 다음에 같이 수영장에 가요."
        },
        "frames": [
          "ko-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 그런데 저 물이 좀 무서워요.",
        "gloss": {
          "en": "Okay! But I'm a little scared of water.",
          "ko": "좋아요! 그런데 저 물이 좀 무서워요."
        }
      },
      {
        "who": "me",
        "text": "괜찮아요. 제가 가르쳐 줄 수 있어요.",
        "gloss": {
          "en": "It's okay. I can teach you.",
          "ko": "괜찮아요. 제가 가르쳐 줄 수 있어요."
        }
      }
    ]
  },
  {
    "id": "ko-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Bargaining for a bag at a market",
      "ko": "시장에서 가방 값 깎기"
    },
    "expressions": [
      "좀 깎아 주세요",
      "다른 색 있어요",
      "대박"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "이 가방 어때요? 오만 원이에요.",
        "gloss": {
          "en": "How about this bag? It's fifty thousand won.",
          "ko": "이 가방 어때요? 오만 원이에요."
        }
      },
      {
        "who": "me",
        "text": "좀 비싸요. 좀 깎아 주세요.",
        "gloss": {
          "en": "It's a bit expensive. Please give me a discount.",
          "ko": "좀 비싸요. 좀 깎아 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "그럼 사만 오천 원이에요.",
        "gloss": {
          "en": "Then forty-five thousand won.",
          "ko": "그럼 사만 오천 원이에요."
        }
      },
      {
        "who": "me",
        "text": "다른 색 있어요?",
        "gloss": {
          "en": "Do you have another color?",
          "ko": "다른 색 있어요?"
        },
        "frames": [
          "ko-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "검은색하고 갈색 있어요.",
        "gloss": {
          "en": "We have black and brown.",
          "ko": "검은색하고 갈색 있어요."
        }
      },
      {
        "who": "me",
        "text": "갈색이 좋아요. 현금 돼요?",
        "gloss": {
          "en": "I like the brown one. Is cash okay?",
          "ko": "갈색이 좋아요. 현금 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "현금이면 사만 원에 드릴게요.",
        "gloss": {
          "en": "If it's cash, I'll give it to you for forty thousand.",
          "ko": "현금이면 사만 원에 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "대박! 이거 주세요.",
        "gloss": {
          "en": "Awesome! I'll take it.",
          "ko": "대박! 이거 주세요."
        },
        "frames": [
          "ko-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about a friend's birthday party",
      "ko": "친구 생일 파티 이야기"
    },
    "expressions": [
      "재미있었어요"
    ],
    "grammar": [
      0,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "생일 파티 어땠어요?",
        "gloss": {
          "en": "How was the birthday party?",
          "ko": "생일 파티 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "파티가 진짜 재미있었어요.",
        "gloss": {
          "en": "The party was really fun.",
          "ko": "파티가 진짜 재미있었어요."
        },
        "frames": [
          "ko-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "케이크는요?",
        "gloss": {
          "en": "How about the cake?",
          "ko": "케이크는요?"
        }
      },
      {
        "who": "me",
        "text": "정말 맛있었어요. 그런데 저 진짜 배불러요.",
        "gloss": {
          "en": "It was really good. But I'm really full.",
          "ko": "정말 맛있었어요. 그런데 저 진짜 배불러요."
        },
        "frames": [
          "ko-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "하하. 선물은 뭐 줬어요?",
        "gloss": {
          "en": "Haha. What did you give as a present?",
          "ko": "하하. 선물은 뭐 줬어요?"
        }
      },
      {
        "who": "me",
        "text": "어제 백화점에 갔어요. 거기서 향수를 샀어요.",
        "gloss": {
          "en": "I went to the department store yesterday. I bought perfume there.",
          "ko": "어제 백화점에 갔어요. 거기서 향수를 샀어요."
        },
        "frames": [
          "ko-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "와, 친구가 좋아했겠어요.",
        "gloss": {
          "en": "Wow, your friend must have liked it.",
          "ko": "와, 친구가 좋아했겠어요."
        }
      },
      {
        "who": "me",
        "text": "네, 진짜 좋아했어요.",
        "gloss": {
          "en": "Yes, they really liked it.",
          "ko": "네, 진짜 좋아했어요."
        }
      }
    ]
  },
  {
    "id": "ko-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Weather small talk with a coworker",
      "ko": "동료와 날씨 이야기"
    },
    "expressions": [],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "내일 비가 많이 와요.",
        "gloss": {
          "en": "It's going to rain a lot tomorrow.",
          "ko": "내일 비가 많이 와요."
        }
      },
      {
        "who": "me",
        "text": "정말요? 내일 바다에 갈 거예요.",
        "gloss": {
          "en": "Really? I'm going to the beach tomorrow.",
          "ko": "정말요? 내일 바다에 갈 거예요."
        },
        "frames": [
          "ko-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "우산 있어요?",
        "gloss": {
          "en": "Do you have an umbrella?",
          "ko": "우산 있어요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 우산이 없어요.",
        "gloss": {
          "en": "No, I don't have an umbrella.",
          "ko": "아니요, 우산이 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "저기 편의점에서 팔아요.",
        "gloss": {
          "en": "They sell them at the convenience store over there.",
          "ko": "저기 편의점에서 팔아요."
        }
      },
      {
        "who": "me",
        "text": "그럼 지금 우산을 사러 가요.",
        "gloss": {
          "en": "Then I'll go buy an umbrella now.",
          "ko": "그럼 지금 우산을 사러 가요."
        },
        "frames": [
          "ko-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "바다에서 뭐 할 거예요?",
        "gloss": {
          "en": "What are you going to do at the beach?",
          "ko": "바다에서 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "회를 먹고 싶어요.",
        "gloss": {
          "en": "I want to eat raw fish.",
          "ko": "회를 먹고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling a café about a lost wallet",
      "ko": "카페에 전화해서 잃어버린 지갑 찾기"
    },
    "expressions": [
      "진짜요"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 하늘 카페입니다.",
        "gloss": {
          "en": "Hello, Haneul Café.",
          "ko": "네, 하늘 카페입니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요. 어제 오후에 카페에 갔어요. 그런데 지갑이 없어요.",
        "gloss": {
          "en": "Hello. I went to your café yesterday afternoon. But my wallet is missing.",
          "ko": "안녕하세요. 어제 오후에 카페에 갔어요. 그런데 지갑이 없어요."
        },
        "frames": [
          "ko-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "무슨 색 지갑이에요?",
        "gloss": {
          "en": "What color is the wallet?",
          "ko": "무슨 색 지갑이에요?"
        }
      },
      {
        "who": "me",
        "text": "갈색이에요. 오늘 찾고 싶어요.",
        "gloss": {
          "en": "It's brown. I want to get it back today.",
          "ko": "갈색이에요. 오늘 찾고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "아, 여기 있어요! 저녁 열 시까지 열어요.",
        "gloss": {
          "en": "Oh, it's here! We're open until ten p.m.",
          "ko": "아, 여기 있어요! 저녁 열 시까지 열어요."
        }
      },
      {
        "who": "me",
        "text": "진짜요? 지금 지갑 찾으러 가요.",
        "gloss": {
          "en": "Really? I'm coming to pick up my wallet now.",
          "ko": "진짜요? 지금 지갑 찾으러 가요."
        },
        "frames": [
          "ko-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 기다릴게요.",
        "gloss": {
          "en": "Okay, we'll be waiting.",
          "ko": "네, 기다릴게요."
        }
      },
      {
        "who": "me",
        "text": "정말 감사해요. 저 진짜 걱정했어요.",
        "gloss": {
          "en": "Thank you so much. I was really worried.",
          "ko": "정말 감사해요. 저 진짜 걱정했어요."
        },
        "frames": [
          "ko-f2-20"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying tickets and popcorn at a cinema",
      "ko": "영화관에서 표와 팝콘 사기"
    },
    "expressions": [],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 무슨 영화 보세요?",
        "gloss": {
          "en": "Welcome. Which movie are you seeing?",
          "ko": "어서 오세요. 무슨 영화 보세요?"
        }
      },
      {
        "who": "me",
        "text": "일곱 시 액션 영화요. 학생 할인 돼요?",
        "gloss": {
          "en": "The seven o'clock action movie. Is there a student discount?",
          "ko": "일곱 시 액션 영화요. 학생 할인 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 학생증 있어요?",
        "gloss": {
          "en": "Yes, there is. Do you have a student ID?",
          "ko": "네, 돼요. 학생증 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네, 여기요. 팝콘도 있어요?",
        "gloss": {
          "en": "Yes, here. Do you have popcorn too?",
          "ko": "네, 여기요. 팝콘도 있어요?"
        },
        "frames": [
          "ko-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "네. 큰 거, 작은 거 있어요.",
        "gloss": {
          "en": "Yes. We have large and small.",
          "ko": "네. 큰 거, 작은 거 있어요."
        }
      },
      {
        "who": "me",
        "text": "큰 거 주세요. 다른 맛 있어요?",
        "gloss": {
          "en": "A large one, please. Do you have another flavor?",
          "ko": "큰 거 주세요. 다른 맛 있어요?"
        },
        "frames": [
          "ko-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "캐러멜 맛도 있어요.",
        "gloss": {
          "en": "We also have caramel.",
          "ko": "캐러멜 맛도 있어요."
        }
      },
      {
        "who": "me",
        "text": "그럼 반반 돼요?",
        "gloss": {
          "en": "Then can I get half and half?",
          "ko": "그럼 반반 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Helping a friend move",
      "ko": "친구 이사 도와주기"
    },
    "expressions": [
      "힘내요",
      "연락할게요"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "이번 주말에 이사해요. 좀 도와줄 수 있어요?",
        "gloss": {
          "en": "I'm moving this weekend. Can you help a little?",
          "ko": "이번 주말에 이사해요. 좀 도와줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "네. 저는 운전을 할 수 있어요. 차도 있어요.",
        "gloss": {
          "en": "Sure. I can drive. I have a car too.",
          "ko": "네. 저는 운전을 할 수 있어요. 차도 있어요."
        },
        "frames": [
          "ko-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "와, 진짜 고마워요! 아침 아홉 시 괜찮아요?",
        "gloss": {
          "en": "Wow, thank you so much! Is nine in the morning okay?",
          "ko": "와, 진짜 고마워요! 아침 아홉 시 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "좀 일러요. 열 시에 만날까요?",
        "gloss": {
          "en": "That's a bit early. Shall we meet at ten?",
          "ko": "좀 일러요. 열 시에 만날까요?"
        },
        "frames": [
          "ko-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 끝나고 뭐 먹을까요?",
        "gloss": {
          "en": "Okay. What shall we eat afterward?",
          "ko": "좋아요. 끝나고 뭐 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "짐 정리하고 같이 저녁 먹을까요?",
        "gloss": {
          "en": "Shall we unpack and then have dinner together?",
          "ko": "짐 정리하고 같이 저녁 먹을까요?"
        },
        "frames": [
          "ko-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 그날 봐요.",
        "gloss": {
          "en": "Great! See you that day.",
          "ko": "좋아요! 그날 봐요."
        }
      },
      {
        "who": "me",
        "text": "힘내요! 토요일에 연락할게요.",
        "gloss": {
          "en": "Hang in there! I'll call you on Saturday.",
          "ko": "힘내요! 토요일에 연락할게요."
        }
      }
    ]
  },
  {
    "id": "ko-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Borrowing a book at the library",
      "ko": "도서관에서 책 빌리기"
    },
    "expressions": [],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "무엇을 도와드릴까요?",
        "gloss": {
          "en": "How can I help you?",
          "ko": "무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "이 책을 빌리고 싶어요.",
        "gloss": {
          "en": "I'd like to borrow this book.",
          "ko": "이 책을 빌리고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "회원 카드 있어요?",
        "gloss": {
          "en": "Do you have a library card?",
          "ko": "회원 카드 있어요?"
        }
      },
      {
        "who": "me",
        "text": "아니요, 카드가 없어요.",
        "gloss": {
          "en": "No, I don't have a card.",
          "ko": "아니요, 카드가 없어요."
        },
        "frames": [
          "ko-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "지금 만들 수 있어요. 신분증 있어요?",
        "gloss": {
          "en": "You can make one now. Do you have ID?",
          "ko": "지금 만들 수 있어요. 신분증 있어요?"
        }
      },
      {
        "who": "me",
        "text": "여권 돼요?",
        "gloss": {
          "en": "Is a passport okay?",
          "ko": "여권 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 책은 이 주 동안 빌릴 수 있어요.",
        "gloss": {
          "en": "Yes, it is. You can borrow books for two weeks.",
          "ko": "네, 돼요. 책은 이 주 동안 빌릴 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 이 작가의 다른 책 있어요?",
        "gloss": {
          "en": "Thank you. Do you have another book by this author?",
          "ko": "감사합니다. 이 작가의 다른 책 있어요?"
        },
        "frames": [
          "ko-f2-14"
        ]
      }
    ]
  },
  {
    "id": "ko-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a hair salon",
      "ko": "미용실에서"
    },
    "expressions": [
      "다른 색 있어요"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어떻게 해 드릴까요?",
        "gloss": {
          "en": "Welcome. What would you like done?",
          "ko": "어서 오세요. 어떻게 해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "머리를 짧게 자르고 싶어요.",
        "gloss": {
          "en": "I want to cut my hair short.",
          "ko": "머리를 짧게 자르고 싶어요."
        },
        "frames": [
          "ko-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "이 정도요?",
        "gloss": {
          "en": "About this much?",
          "ko": "이 정도요?"
        }
      },
      {
        "who": "me",
        "text": "조금 더요. 그리고 염색도 돼요?",
        "gloss": {
          "en": "A little more. And can I get it dyed too?",
          "ko": "조금 더요. 그리고 염색도 돼요?"
        },
        "frames": [
          "ko-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "네, 돼요. 이 색 어때요?",
        "gloss": {
          "en": "Yes, you can. How about this color?",
          "ko": "네, 돼요. 이 색 어때요?"
        }
      },
      {
        "who": "me",
        "text": "좀 어두워요. 다른 색 있어요?",
        "gloss": {
          "en": "It's a bit dark. Do you have another color?",
          "ko": "좀 어두워요. 다른 색 있어요?"
        },
        "frames": [
          "ko-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "이 밝은 갈색 어때요?",
        "gloss": {
          "en": "How about this light brown?",
          "ko": "이 밝은 갈색 어때요?"
        }
      },
      {
        "who": "me",
        "text": "좋아요! 저 진짜 기대돼요.",
        "gloss": {
          "en": "I like it! I'm really excited.",
          "ko": "좋아요! 저 진짜 기대돼요."
        },
        "frames": [
          "ko-f2-20"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the front desk about a broken air conditioner",
      "ko": "호텔 방 에어컨 고장으로 프런트에 전화"
    },
    "expressions": [
      "문제가 생겼어요"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 프런트입니다.",
        "gloss": {
          "en": "Hello, front desk.",
          "ko": "네, 프런트입니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요, 칠백오 호인데요.",
        "gloss": {
          "en": "Hello, this is room seven-oh-five.",
          "ko": "안녕하세요, 칠백오 호인데요."
        },
        "frames": [
          "ko-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "네, 손님. 무슨 일이세요?",
        "gloss": {
          "en": "Yes, sir. What can I do for you?",
          "ko": "네, 손님. 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "에어컨에 문제가 생겼어요. 방이 너무 더워서 잠을 못 잤어요.",
        "gloss": {
          "en": "There's a problem with the air conditioner. The room was so hot I couldn't sleep.",
          "ko": "에어컨에 문제가 생겼어요. 방이 너무 더워서 잠을 못 잤어요."
        },
        "frames": [
          "ko-f3-07",
          "ko-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "정말 죄송합니다. 바로 확인해 보겠습니다.",
        "gloss": {
          "en": "We're very sorry. We'll check right away.",
          "ko": "정말 죄송합니다. 바로 확인해 보겠습니다."
        }
      },
      {
        "who": "me",
        "text": "혹시 방 변경 가능해요?",
        "gloss": {
          "en": "Is it possible to change rooms?",
          "ko": "혹시 방 변경 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 가능합니다. 십 층에 빈방이 있어요.",
        "gloss": {
          "en": "Yes, it is. There's an empty room on the tenth floor.",
          "ko": "네, 가능합니다. 십 층에 빈방이 있어요."
        }
      },
      {
        "who": "me",
        "text": "빈방이 있어서 다행이에요.",
        "gloss": {
          "en": "I'm glad there's a room available.",
          "ko": "빈방이 있어서 다행이에요."
        },
        "frames": [
          "ko-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Exchanging shoes at a shoe store",
      "ko": "신발 가게에서 교환·환불하기"
    },
    "expressions": [
      "교환하고 싶은데요",
      "환불 가능해요"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 무엇을 도와드릴까요?",
        "gloss": {
          "en": "Welcome. How can I help you?",
          "ko": "어서 오세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "어제 이 신발을 샀는데 좀 작아요. 교환하고 싶은데요.",
        "gloss": {
          "en": "I bought these shoes yesterday, but they're a bit small. I'd like to exchange them.",
          "ko": "어제 이 신발을 샀는데 좀 작아요. 교환하고 싶은데요."
        },
        "frames": [
          "ko-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "영수증 있으세요?",
        "gloss": {
          "en": "Do you have the receipt?",
          "ko": "영수증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "네, 여기 있어요. 한 치수 큰 걸로 가능해요?",
        "gloss": {
          "en": "Yes, here it is. Is one size up possible?",
          "ko": "네, 여기 있어요. 한 치수 큰 걸로 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "죄송한데 지금 그 사이즈가 없어요.",
        "gloss": {
          "en": "Sorry, but we don't have that size right now.",
          "ko": "죄송한데 지금 그 사이즈가 없어요."
        }
      },
      {
        "who": "me",
        "text": "그럼 환불 가능해요?",
        "gloss": {
          "en": "Then is a refund possible?",
          "ko": "그럼 환불 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 가능해요. 카드로 다시 넣어 드릴게요.",
        "gloss": {
          "en": "Yes, it is. I'll put it back on your card.",
          "ko": "네, 가능해요. 카드로 다시 넣어 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "환불이 돼서 다행이에요.",
        "gloss": {
          "en": "I'm glad I can get a refund.",
          "ko": "환불이 돼서 다행이에요."
        },
        "frames": [
          "ko-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Answering a customer call at a call center",
      "ko": "고객센터에서 전화 응대하기"
    },
    "expressions": [
      "확인해 보겠습니다"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "여보세요, 주문한 물건이 아직 안 왔어요.",
        "gloss": {
          "en": "Hello, the item I ordered still hasn't arrived.",
          "ko": "여보세요, 주문한 물건이 아직 안 왔어요."
        }
      },
      {
        "who": "me",
        "text": "죄송합니다. 주문 내용을 확인해 보겠습니다.",
        "gloss": {
          "en": "I'm sorry. I'll check your order.",
          "ko": "죄송합니다. 주문 내용을 확인해 보겠습니다."
        },
        "frames": [
          "ko-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "지난주 금요일에 주문했어요.",
        "gloss": {
          "en": "I ordered it last Friday.",
          "ko": "지난주 금요일에 주문했어요."
        }
      },
      {
        "who": "me",
        "text": "배송이 조금 늦어지고 있네요. 택배 회사에 바로 연락해 보겠습니다.",
        "gloss": {
          "en": "The delivery is running a little late. I'll contact the courier right away.",
          "ko": "배송이 조금 늦어지고 있네요. 택배 회사에 바로 연락해 보겠습니다."
        },
        "frames": [
          "ko-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "오늘 안에 꼭 받고 싶어요.",
        "gloss": {
          "en": "I really want to get it today.",
          "ko": "오늘 안에 꼭 받고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "네, 제가 기사님 번호를 문자로 보내 드릴게요.",
        "gloss": {
          "en": "Okay, I'll text you the driver's number.",
          "ko": "네, 제가 기사님 번호를 문자로 보내 드릴게요."
        },
        "frames": [
          "ko-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "네, 고마워요.",
        "gloss": {
          "en": "Okay, thanks.",
          "ko": "네, 고마워요."
        }
      },
      {
        "who": "me",
        "text": "다시 문제가 있으면 연락 주세요.",
        "gloss": {
          "en": "If there's another problem, please let us know.",
          "ko": "다시 문제가 있으면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Inviting a neighbor to the market",
      "ko": "이웃에게 시장 같이 가자고 하기"
    },
    "expressions": [
      "제 생각에는"
    ],
    "grammar": [
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "어디 가요?",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "지금 시장에 가는데 같이 갈래요?",
        "gloss": {
          "en": "I'm heading to the market now. Want to come along?",
          "ko": "지금 시장에 가는데 같이 갈래요?"
        },
        "frames": [
          "ko-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 뭐 사러 가요?",
        "gloss": {
          "en": "Sure! What are you going to buy?",
          "ko": "좋아요! 뭐 사러 가요?"
        }
      },
      {
        "who": "me",
        "text": "내일 친구들이 와서 제가 요리할게요.",
        "gloss": {
          "en": "My friends are coming tomorrow, so I'm going to cook.",
          "ko": "내일 친구들이 와서 제가 요리할게요."
        },
        "frames": [
          "ko-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "와, 무슨 요리 해요?",
        "gloss": {
          "en": "Wow, what are you making?",
          "ko": "와, 무슨 요리 해요?"
        }
      },
      {
        "who": "me",
        "text": "제 생각에는 불고기가 제일 좋아요. 다들 좋아해요.",
        "gloss": {
          "en": "I think bulgogi is the best. Everyone likes it.",
          "ko": "제 생각에는 불고기가 제일 좋아요. 다들 좋아해요."
        },
        "frames": [
          "ko-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "저도 맛보고 싶어요!",
        "gloss": {
          "en": "I want to taste it too!",
          "ko": "저도 맛보고 싶어요!"
        }
      },
      {
        "who": "me",
        "text": "그럼요! 내일 저녁에 놀러 오세요.",
        "gloss": {
          "en": "Of course! Come over tomorrow evening.",
          "ko": "그럼요! 내일 저녁에 놀러 오세요."
        }
      }
    ]
  },
  {
    "id": "ko-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Becoming casual with a friend before a party",
      "ko": "파티 전 친구와 말 놓기"
    },
    "expressions": [
      "편하게 말해"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "우리 동갑인데 말 놓을까요?",
        "gloss": {
          "en": "We're the same age. Shall we speak casually?",
          "ko": "우리 동갑인데 말 놓을까요?"
        }
      },
      {
        "who": "me",
        "text": "좋아! 편하게 말해.",
        "gloss": {
          "en": "Sure! Talk to me casually.",
          "ko": "좋아! 편하게 말해."
        },
        "frames": [
          "ko-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "좋아! 토요일 파티에 올 거지?",
        "gloss": {
          "en": "Great! You're coming to the party on Saturday, right?",
          "ko": "좋아! 토요일 파티에 올 거지?"
        }
      },
      {
        "who": "me",
        "text": "응, 갈게. 음료수는 내가 가져갈게.",
        "gloss": {
          "en": "Yeah, I'll come. I'll bring the drinks.",
          "ko": "응, 갈게. 음료수는 내가 가져갈게."
        },
        "frames": [
          "ko-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "고마워. 케이크는 내가 살게.",
        "gloss": {
          "en": "Thanks. I'll buy the cake.",
          "ko": "고마워. 케이크는 내가 살게."
        }
      },
      {
        "who": "me",
        "text": "너무 무리하지 마.",
        "gloss": {
          "en": "Don't overdo it.",
          "ko": "너무 무리하지 마."
        },
        "frames": [
          "ko-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "알았어. 그럼 토요일에 봐!",
        "gloss": {
          "en": "Okay. See you Saturday, then!",
          "ko": "알았어. 그럼 토요일에 봐!"
        }
      },
      {
        "who": "me",
        "text": "응, 늦으면 연락 줘.",
        "gloss": {
          "en": "Yeah, text me if you're running late.",
          "ko": "응, 늦으면 연락 줘."
        }
      }
    ]
  },
  {
    "id": "ko-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a drama with a friend",
      "ko": "친구와 드라마 이야기"
    },
    "expressions": [
      "스포 하지 마",
      "말도 안 돼"
    ],
    "grammar": [
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "그 드라마 마지막 화 봤어?",
        "gloss": {
          "en": "Did you watch the last episode of that drama?",
          "ko": "그 드라마 마지막 화 봤어?"
        }
      },
      {
        "who": "me",
        "text": "아직! 스포 하지 마!",
        "gloss": {
          "en": "Not yet! No spoilers!",
          "ko": "아직! 스포 하지 마!"
        },
        "frames": [
          "ko-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "알았어. 그럼 이번 주말에 우리 집에서 같이 볼래?",
        "gloss": {
          "en": "Okay. Then want to watch it together at my place this weekend?",
          "ko": "알았어. 그럼 이번 주말에 우리 집에서 같이 볼래?"
        }
      },
      {
        "who": "me",
        "text": "좋아! 과자는 내가 가져갈게.",
        "gloss": {
          "en": "Sure! I'll bring the snacks.",
          "ko": "좋아! 과자는 내가 가져갈게."
        },
        "frames": [
          "ko-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "근데 너 분명히 울 거야. 진짜 슬퍼.",
        "gloss": {
          "en": "But you're definitely going to cry. It's really sad.",
          "ko": "근데 너 분명히 울 거야. 진짜 슬퍼."
        }
      },
      {
        "who": "me",
        "text": "말도 안 돼. 나 안 울어.",
        "gloss": {
          "en": "No way. I won't cry.",
          "ko": "말도 안 돼. 나 안 울어."
        }
      },
      {
        "who": "them",
        "text": "두고 봐. 아, 그리고 늦지 마!",
        "gloss": {
          "en": "We'll see. Oh, and don't be late!",
          "ko": "두고 봐. 아, 그리고 늦지 마!"
        }
      },
      {
        "who": "me",
        "text": "걱정하지 마. 일찍 갈게.",
        "gloss": {
          "en": "Don't worry. I'll come early.",
          "ko": "걱정하지 마. 일찍 갈게."
        },
        "frames": [
          "ko-f3-19"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Declining a team dinner and suggesting another place",
      "ko": "회식 거절하고 다른 곳 제안하기"
    },
    "expressions": [
      "어떻게 생각해요",
      "제 생각에는"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "내일 저녁에 회식 있어요. 같이 가요.",
        "gloss": {
          "en": "There's a team dinner tomorrow evening. Come along.",
          "ko": "내일 저녁에 회식 있어요. 같이 가요."
        }
      },
      {
        "who": "me",
        "text": "죄송해요. 내일 아침에 발표가 있기 때문에 못 가요.",
        "gloss": {
          "en": "Sorry. I can't go because I have a presentation tomorrow morning.",
          "ko": "죄송해요. 내일 아침에 발표가 있기 때문에 못 가요."
        },
        "frames": [
          "ko-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "아, 그래요? 그럼 다음 주 금요일은요? 노래방도 가요.",
        "gloss": {
          "en": "Oh, really? Then how about next Friday? We're going to karaoke too.",
          "ko": "아, 그래요? 그럼 다음 주 금요일은요? 노래방도 가요."
        }
      },
      {
        "who": "me",
        "text": "금요일은 괜찮아요. 그런데 노래방은 좀…",
        "gloss": {
          "en": "Friday is fine. But karaoke is a bit…",
          "ko": "금요일은 괜찮아요. 그런데 노래방은 좀…"
        },
        "frames": [
          "ko-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "하하, 노래 싫어해요?",
        "gloss": {
          "en": "Haha, you don't like singing?",
          "ko": "하하, 노래 싫어해요?"
        }
      },
      {
        "who": "me",
        "text": "노래를 잘 못해서요. 고깃집은 어떻게 생각해요?",
        "gloss": {
          "en": "I'm not good at singing. What do you think about a barbecue place?",
          "ko": "노래를 잘 못해서요. 고깃집은 어떻게 생각해요?"
        },
        "frames": [
          "ko-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "좋아요! 회사 앞 고깃집 어때요?",
        "gloss": {
          "en": "Sounds good! How about the barbecue place in front of the office?",
          "ko": "좋아요! 회사 앞 고깃집 어때요?"
        }
      },
      {
        "who": "me",
        "text": "제 생각에는 거기가 제일 좋아요.",
        "gloss": {
          "en": "In my opinion, that place is the best.",
          "ko": "제 생각에는 거기가 제일 좋아요."
        },
        "frames": [
          "ko-f3-16"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a coworker about noisy neighbors",
      "ko": "동료에게 시끄러운 이웃 이야기"
    },
    "expressions": [],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "얼굴이 피곤해 보여요. 무슨 일 있어요?",
        "gloss": {
          "en": "You look tired. Is something wrong?",
          "ko": "얼굴이 피곤해 보여요. 무슨 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "옆집이 너무 시끄러워서 잠을 못 잤어요.",
        "gloss": {
          "en": "My neighbors were so noisy that I couldn't sleep.",
          "ko": "옆집이 너무 시끄러워서 잠을 못 잤어요."
        },
        "frames": [
          "ko-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "아이고. 관리실에 말했어요?",
        "gloss": {
          "en": "Oh no. Did you tell the building office?",
          "ko": "아이고. 관리실에 말했어요?"
        }
      },
      {
        "who": "me",
        "text": "아직요. 오늘 제가 관리실에 전화할게요.",
        "gloss": {
          "en": "Not yet. I'll call the building office today.",
          "ko": "아직요. 오늘 제가 관리실에 전화할게요."
        },
        "frames": [
          "ko-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "그게 좋겠어요. 커피 마실래요? 제가 살게요.",
        "gloss": {
          "en": "Good idea. Want some coffee? My treat.",
          "ko": "그게 좋겠어요. 커피 마실래요? 제가 살게요."
        }
      },
      {
        "who": "me",
        "text": "고마워요. 그런데 오늘 커피는 좀… 일찍 자고 싶어요.",
        "gloss": {
          "en": "Thanks. But coffee today is a bit… I want to go to bed early.",
          "ko": "고마워요. 그런데 오늘 커피는 좀… 일찍 자고 싶어요."
        },
        "frames": [
          "ko-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "그래요. 오늘은 푹 자요.",
        "gloss": {
          "en": "Okay. Get a good sleep tonight.",
          "ko": "그래요. 오늘은 푹 자요."
        }
      },
      {
        "who": "me",
        "text": "고마워요. 내일 다시 이야기할게요.",
        "gloss": {
          "en": "Thanks. I'll tell you more tomorrow.",
          "ko": "고마워요. 내일 다시 이야기할게요."
        }
      }
    ]
  },
  {
    "id": "ko-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Hurrying to a concert with a friend",
      "ko": "친구와 공연에 늦지 않으려고 서두르기"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "공연이 일곱 시에 시작해요. 벌써 여섯 시 반이에요!",
        "gloss": {
          "en": "The concert starts at seven. It's already six thirty!",
          "ko": "공연이 일곱 시에 시작해요. 벌써 여섯 시 반이에요!"
        }
      },
      {
        "who": "me",
        "text": "버스가 안 오니까 택시 타요.",
        "gloss": {
          "en": "The bus isn't coming, so let's take a taxi.",
          "ko": "버스가 안 오니까 택시 타요."
        },
        "frames": [
          "ko-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 택시비는 제가 낼게요.",
        "gloss": {
          "en": "Okay. I'll pay for the taxi.",
          "ko": "좋아요. 택시비는 제가 낼게요."
        }
      },
      {
        "who": "me",
        "text": "아니에요, 오늘은 제가 계산할게요.",
        "gloss": {
          "en": "No, I'll pay today.",
          "ko": "아니에요, 오늘은 제가 계산할게요."
        },
        "frames": [
          "ko-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "고마워요. 와, 다 왔어요! 여섯 시 오십 분이에요.",
        "gloss": {
          "en": "Thanks. Oh, we're here! It's six fifty.",
          "ko": "고마워요. 와, 다 왔어요! 여섯 시 오십 분이에요."
        }
      },
      {
        "who": "me",
        "text": "늦지 않아서 다행이에요.",
        "gloss": {
          "en": "I'm glad we're not late.",
          "ko": "늦지 않아서 다행이에요."
        },
        "frames": [
          "ko-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "빨리 들어가요!",
        "gloss": {
          "en": "Let's hurry in!",
          "ko": "빨리 들어가요!"
        }
      },
      {
        "who": "me",
        "text": "잠깐만요, 티켓은 제가 보여 드릴게요.",
        "gloss": {
          "en": "Wait, I'll show them the tickets.",
          "ko": "잠깐만요, 티켓은 제가 보여 드릴게요."
        },
        "frames": [
          "ko-f3-11"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a vacation with a coworker",
      "ko": "동료와 휴가 여행 이야기"
    },
    "expressions": [
      "어떻게 생각해요",
      "제 생각에는",
      "그럴 수도 있죠"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "이번 휴가 때 어디 가요?",
        "gloss": {
          "en": "Where are you going this vacation?",
          "ko": "이번 휴가 때 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "아직 몰라요. 부산에 가 본 적이 있어요.",
        "gloss": {
          "en": "I don't know yet. I've been to Busan before.",
          "ko": "아직 몰라요. 부산에 가 본 적이 있어요."
        },
        "frames": [
          "ko-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "그럼 이번엔 강릉 어때요? 바다가 정말 예뻐요.",
        "gloss": {
          "en": "Then how about Gangneung this time? The sea is really beautiful.",
          "ko": "그럼 이번엔 강릉 어때요? 바다가 정말 예뻐요."
        }
      },
      {
        "who": "me",
        "text": "겨울 바다는 어떻게 생각해요? 좀 춥지 않아요?",
        "gloss": {
          "en": "What do you think about the sea in winter? Isn't it a bit cold?",
          "ko": "겨울 바다는 어떻게 생각해요? 좀 춥지 않아요?"
        },
        "frames": [
          "ko-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "겨울 바다도 좋아요. 사람이 적어서 조용해요.",
        "gloss": {
          "en": "The winter sea is nice too. It's quiet because there are fewer people.",
          "ko": "겨울 바다도 좋아요. 사람이 적어서 조용해요."
        }
      },
      {
        "who": "me",
        "text": "그럴 수도 있죠. 그래도 제 생각에는 여름 바다가 제일 좋아요.",
        "gloss": {
          "en": "That could be. But in my opinion, the summer sea is the best.",
          "ko": "그럴 수도 있죠. 그래도 제 생각에는 여름 바다가 제일 좋아요."
        },
        "frames": [
          "ko-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "그럼 여름에 같이 가요.",
        "gloss": {
          "en": "Then let's go together in the summer.",
          "ko": "그럼 여름에 같이 가요."
        }
      },
      {
        "who": "me",
        "text": "좋아요! 날짜 정해지면 연락 주세요.",
        "gloss": {
          "en": "Great! Let me know when the dates are set.",
          "ko": "좋아요! 날짜 정해지면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Changing a restaurant reservation by phone",
      "ko": "전화로 식당 예약 바꾸기"
    },
    "expressions": [],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 맛나 식당입니다.",
        "gloss": {
          "en": "Hello, Matna Restaurant.",
          "ko": "네, 맛나 식당입니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요, 어제 예약한 사람인데요.",
        "gloss": {
          "en": "Hello, I'm the one who made a reservation yesterday.",
          "ko": "안녕하세요, 어제 예약한 사람인데요."
        },
        "frames": [
          "ko-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "네, 무엇을 도와드릴까요?",
        "gloss": {
          "en": "Yes, how can I help you?",
          "ko": "네, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "시간을 좀 바꾸고 싶은데요.",
        "gloss": {
          "en": "I'd like to change the time, if possible.",
          "ko": "시간을 좀 바꾸고 싶은데요."
        },
        "frames": [
          "ko-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "몇 시로 바꿔 드릴까요?",
        "gloss": {
          "en": "What time would you like?",
          "ko": "몇 시로 바꿔 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "여덟 시 가능해요?",
        "gloss": {
          "en": "Is eight o'clock possible?",
          "ko": "여덟 시 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 가능합니다. 인원은 그대로예요?",
        "gloss": {
          "en": "Yes, it is. Is the number of people the same?",
          "ko": "네, 가능합니다. 인원은 그대로예요?"
        }
      },
      {
        "who": "me",
        "text": "한 명 더 와요. 자리가 없으면 연락 주세요.",
        "gloss": {
          "en": "One more person is coming. If there's no room, please let me know.",
          "ko": "한 명 더 와요. 자리가 없으면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "First day on a new team",
      "ko": "새 팀에 온 첫날"
    },
    "expressions": [
      "잘 부탁드립니다",
      "수고하셨습니다"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "오늘부터 같이 일하게 됐네요. 잘 부탁해요.",
        "gloss": {
          "en": "So we're working together from today. I look forward to it.",
          "ko": "오늘부터 같이 일하게 됐네요. 잘 부탁해요."
        }
      },
      {
        "who": "me",
        "text": "저도 잘 부탁드립니다. 열심히 해 보겠습니다.",
        "gloss": {
          "en": "I look forward to working with you too. I'll do my best.",
          "ko": "저도 잘 부탁드립니다. 열심히 해 보겠습니다."
        },
        "frames": [
          "ko-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "이 보고서 내일까지 가능해요?",
        "gloss": {
          "en": "Can you get this report done by tomorrow?",
          "ko": "이 보고서 내일까지 가능해요?"
        }
      },
      {
        "who": "me",
        "text": "네, 오늘까지 정리해 보겠습니다.",
        "gloss": {
          "en": "Yes, I'll try to get it organized by today.",
          "ko": "네, 오늘까지 정리해 보겠습니다."
        },
        "frames": [
          "ko-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 다 하면 메일로 보내 줘요.",
        "gloss": {
          "en": "Great. When you're done, send it by email.",
          "ko": "좋아요. 다 하면 메일로 보내 줘요."
        }
      },
      {
        "who": "me",
        "text": "네, 끝나면 제가 메일로 보내 드릴게요.",
        "gloss": {
          "en": "Sure, when I'm done I'll email it to you.",
          "ko": "네, 끝나면 제가 메일로 보내 드릴게요."
        },
        "frames": [
          "ko-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "오늘은 여기까지 해요. 수고했어요.",
        "gloss": {
          "en": "Let's stop here for today. Good work.",
          "ko": "오늘은 여기까지 해요. 수고했어요."
        }
      },
      {
        "who": "me",
        "text": "네, 수고하셨습니다!",
        "gloss": {
          "en": "Yes, thank you for your hard work!",
          "ko": "네, 수고하셨습니다!"
        }
      }
    ]
  },
  {
    "id": "ko-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Getting a bike repaired",
      "ko": "자전거 수리점에서"
    },
    "expressions": [
      "문제가 생겼어요"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 무슨 일이세요?",
        "gloss": {
          "en": "Welcome. What's the matter?",
          "ko": "어서 오세요. 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "자전거 브레이크에 문제가 생겼어요.",
        "gloss": {
          "en": "There's a problem with my bike's brakes.",
          "ko": "자전거 브레이크에 문제가 생겼어요."
        },
        "frames": [
          "ko-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "한번 볼게요. 아, 브레이크 줄이 끊어졌네요.",
        "gloss": {
          "en": "Let me take a look. Ah, the brake cable is broken.",
          "ko": "한번 볼게요. 아, 브레이크 줄이 끊어졌네요."
        }
      },
      {
        "who": "me",
        "text": "오늘 수리 가능해요?",
        "gloss": {
          "en": "Is it possible to fix it today?",
          "ko": "오늘 수리 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 한 시간쯤 걸려요.",
        "gloss": {
          "en": "Yes, it takes about an hour.",
          "ko": "네, 한 시간쯤 걸려요."
        }
      },
      {
        "who": "me",
        "text": "그럼 근처 카페에서 기다릴게요. 끝나면 연락 주세요.",
        "gloss": {
          "en": "Then I'll wait at a café nearby. Let me know when it's done.",
          "ko": "그럼 근처 카페에서 기다릴게요. 끝나면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "네, 전화번호 여기 써 주세요.",
        "gloss": {
          "en": "Okay, please write your phone number here.",
          "ko": "네, 전화번호 여기 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "네. 오늘 고칠 수 있어서 다행이에요.",
        "gloss": {
          "en": "Sure. I'm glad it can be fixed today.",
          "ko": "네. 오늘 고칠 수 있어서 다행이에요."
        },
        "frames": [
          "ko-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Turning down a club meeting before an exam",
      "ko": "시험 때문에 동아리 모임 거절하기"
    },
    "expressions": [
      "그건 좀"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "내일 저녁에 동아리 모임 있어요. 올 수 있어요?",
        "gloss": {
          "en": "There's a club meeting tomorrow evening. Can you come?",
          "ko": "내일 저녁에 동아리 모임 있어요. 올 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "미안해요. 내일 아침에 시험이 있기 때문에 못 가요.",
        "gloss": {
          "en": "Sorry. I can't go because I have an exam tomorrow morning.",
          "ko": "미안해요. 내일 아침에 시험이 있기 때문에 못 가요."
        },
        "frames": [
          "ko-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "아, 그렇구나. 시험 잘 봐요!",
        "gloss": {
          "en": "Oh, I see. Good luck on your exam!",
          "ko": "아, 그렇구나. 시험 잘 봐요!"
        }
      },
      {
        "who": "me",
        "text": "고마워요. 다음 모임은 언제예요?",
        "gloss": {
          "en": "Thanks. When is the next meeting?",
          "ko": "고마워요. 다음 모임은 언제예요?"
        }
      },
      {
        "who": "them",
        "text": "아직 몰라요. 아마 다음 주 목요일이에요.",
        "gloss": {
          "en": "I'm not sure yet. Probably next Thursday.",
          "ko": "아직 몰라요. 아마 다음 주 목요일이에요."
        }
      },
      {
        "who": "me",
        "text": "목요일은 괜찮아요. 시간 정해지면 연락 주세요.",
        "gloss": {
          "en": "Thursday is fine. Let me know when the time is set.",
          "ko": "목요일은 괜찮아요. 시간 정해지면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "네! 그날은 다 같이 등산 갈 수도 있어요.",
        "gloss": {
          "en": "Okay! We might all go hiking that day.",
          "ko": "네! 그날은 다 같이 등산 갈 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "등산은 좀… 그건 좀 힘들어요.",
        "gloss": {
          "en": "Hiking is a bit… That's a bit hard for me.",
          "ko": "등산은 좀… 그건 좀 힘들어요."
        },
        "frames": [
          "ko-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a taxi company about a lost phone",
      "ko": "택시에 두고 내린 휴대폰 찾기"
    },
    "expressions": [],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 택시 고객센터입니다.",
        "gloss": {
          "en": "Hello, taxi customer service.",
          "ko": "네, 택시 고객센터입니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요, 아까 택시에 휴대폰을 두고 내린 사람인데요.",
        "gloss": {
          "en": "Hello, I left my phone in a taxi a while ago.",
          "ko": "안녕하세요, 아까 택시에 휴대폰을 두고 내린 사람인데요."
        },
        "frames": [
          "ko-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "몇 시쯤 타셨어요?",
        "gloss": {
          "en": "Around what time did you take it?",
          "ko": "몇 시쯤 타셨어요?"
        }
      },
      {
        "who": "me",
        "text": "두 시쯤 강남역에서 탔어요. 혹시 오늘 찾는 거 가능해요?",
        "gloss": {
          "en": "I got on at Gangnam Station around two. Is it possible to get it back today?",
          "ko": "두 시쯤 강남역에서 탔어요. 혹시 오늘 찾는 거 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "기사님께 확인해 보겠습니다.",
        "gloss": {
          "en": "We'll check with the driver.",
          "ko": "기사님께 확인해 보겠습니다."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 친구 번호를 드릴게요. 찾으면 연락 주세요.",
        "gloss": {
          "en": "Thank you. I'll give you my friend's number. If you find it, please let me know.",
          "ko": "감사합니다. 친구 번호를 드릴게요. 찾으면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "아, 기사님이 휴대폰을 찾았어요!",
        "gloss": {
          "en": "Oh, the driver found the phone!",
          "ko": "아, 기사님이 휴대폰을 찾았어요!"
        }
      },
      {
        "who": "me",
        "text": "정말요? 찾아서 다행이에요.",
        "gloss": {
          "en": "Really? I'm so glad you found it.",
          "ko": "정말요? 찾아서 다행이에요."
        },
        "frames": [
          "ko-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a classmate for notes after being sick",
      "ko": "아파서 빠진 수업 노트 부탁하기"
    },
    "expressions": [],
    "grammar": [
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "어제 왜 수업에 안 왔어요?",
        "gloss": {
          "en": "Why weren't you in class yesterday?",
          "ko": "어제 왜 수업에 안 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "열이 나서 잠을 못 잤어요.",
        "gloss": {
          "en": "I had a fever, so I couldn't sleep.",
          "ko": "열이 나서 잠을 못 잤어요."
        },
        "frames": [
          "ko-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "아이고, 지금은 괜찮아요?",
        "gloss": {
          "en": "Oh no, are you okay now?",
          "ko": "아이고, 지금은 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "네, 많이 나았어요. 그런데 수업 노트를 좀 보고 싶은데요.",
        "gloss": {
          "en": "Yes, I'm much better. But I'd like to see your class notes, if that's okay.",
          "ko": "네, 많이 나았어요. 그런데 수업 노트를 좀 보고 싶은데요."
        },
        "frames": [
          "ko-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "그럼요. 사진 찍어서 보내 줄게요.",
        "gloss": {
          "en": "Of course. I'll take pictures and send them to you.",
          "ko": "그럼요. 사진 찍어서 보내 줄게요."
        }
      },
      {
        "who": "me",
        "text": "고마워요. 다음에 제가 커피 한 잔 사 드릴게요.",
        "gloss": {
          "en": "Thanks. Next time I'll buy you a coffee.",
          "ko": "고마워요. 다음에 제가 커피 한 잔 사 드릴게요."
        },
        "frames": [
          "ko-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "좋아요. 다음 주 시험 걱정돼요?",
        "gloss": {
          "en": "Sounds good. Are you worried about next week's exam?",
          "ko": "좋아요. 다음 주 시험 걱정돼요?"
        }
      },
      {
        "who": "me",
        "text": "조금요. 같이 공부하면 괜찮을 거예요.",
        "gloss": {
          "en": "A little. If we study together, it'll be okay.",
          "ko": "조금요. 같이 공부하면 괜찮을 거예요."
        }
      }
    ]
  },
  {
    "id": "ko-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Weekend trip plans with a coworker",
      "ko": "동료와 주말 여행 계획 이야기"
    },
    "expressions": [
      "어떻게 생각해요"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "주말에 뭐 할 거예요?",
        "gloss": {
          "en": "What are you doing this weekend?",
          "ko": "주말에 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "전주에 가요. 전에도 한 번 전주에 가 본 적이 있어요.",
        "gloss": {
          "en": "I'm going to Jeonju. I've been to Jeonju once before.",
          "ko": "전주에 가요. 전에도 한 번 전주에 가 본 적이 있어요."
        },
        "frames": [
          "ko-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "와, 전주 비빔밥 유명하죠.",
        "gloss": {
          "en": "Wow, Jeonju bibimbap is famous.",
          "ko": "와, 전주 비빔밥 유명하죠."
        }
      },
      {
        "who": "me",
        "text": "네. 그런데 한옥마을은 어떻게 생각해요? 사람이 많아요?",
        "gloss": {
          "en": "Yes. But what do you think about the hanok village? Is it crowded?",
          "ko": "네. 그런데 한옥마을은 어떻게 생각해요? 사람이 많아요?"
        },
        "frames": [
          "ko-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "주말에는 좀 많아요. 아침에 일찍 가세요.",
        "gloss": {
          "en": "It's a bit crowded on weekends. Go early in the morning.",
          "ko": "주말에는 좀 많아요. 아침에 일찍 가세요."
        }
      },
      {
        "who": "me",
        "text": "좋은 생각이네요. 맛집 알면 연락 주세요.",
        "gloss": {
          "en": "Good idea. If you know any good restaurants, let me know.",
          "ko": "좋은 생각이네요. 맛집 알면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "네, 맛집 목록 보내 줄게요.",
        "gloss": {
          "en": "Sure, I'll send you a list of good places.",
          "ko": "네, 맛집 목록 보내 줄게요."
        }
      },
      {
        "who": "me",
        "text": "고마워요. 제가 선물 사 올게요.",
        "gloss": {
          "en": "Thanks. I'll bring you back a gift.",
          "ko": "고마워요. 제가 선물 사 올게요."
        }
      }
    ]
  },
  {
    "id": "ko-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the apartment office about a toilet problem",
      "ko": "아파트 관리사무소에 화장실 고장 알리기"
    },
    "expressions": [
      "문제가 생겼어요"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "네, 관리사무소입니다.",
        "gloss": {
          "en": "Hello, management office.",
          "ko": "네, 관리사무소입니다."
        }
      },
      {
        "who": "me",
        "text": "안녕하세요, 삼백이 호인데요.",
        "gloss": {
          "en": "Hello, this is unit three-oh-two.",
          "ko": "안녕하세요, 삼백이 호인데요."
        },
        "frames": [
          "ko-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "네, 무슨 일이세요?",
        "gloss": {
          "en": "Yes, what's the matter?",
          "ko": "네, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "화장실 변기에 문제가 생겼어요. 물이 안 내려가요.",
        "gloss": {
          "en": "There's a problem with the toilet. It won't flush.",
          "ko": "화장실 변기에 문제가 생겼어요. 물이 안 내려가요."
        },
        "frames": [
          "ko-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "오늘 오후에 기사님이 갈 수 있어요. 집에 계세요?",
        "gloss": {
          "en": "A technician can come this afternoon. Will you be home?",
          "ko": "오늘 오후에 기사님이 갈 수 있어요. 집에 계세요?"
        }
      },
      {
        "who": "me",
        "text": "오후에는 회사에 있어요. 저녁 일곱 시 가능해요?",
        "gloss": {
          "en": "I'll be at work in the afternoon. Is seven in the evening possible?",
          "ko": "오후에는 회사에 있어요. 저녁 일곱 시 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 일곱 시에 갈게요.",
        "gloss": {
          "en": "Okay, we'll come at seven.",
          "ko": "네, 일곱 시에 갈게요."
        }
      },
      {
        "who": "me",
        "text": "감사합니다. 늦으시면 연락 주세요.",
        "gloss": {
          "en": "Thank you. If you're running late, please let me know.",
          "ko": "감사합니다. 늦으시면 연락 주세요."
        },
        "frames": [
          "ko-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ko-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Packing for a camping trip with a friend",
      "ko": "친구와 캠핑 준비"
    },
    "expressions": [
      "편하게 말해"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "이번 캠핑 때 뭐 가져올 거야?",
        "gloss": {
          "en": "What are you bringing on this camping trip?",
          "ko": "이번 캠핑 때 뭐 가져올 거야?"
        }
      },
      {
        "who": "me",
        "text": "텐트는 내가 가져갈게.",
        "gloss": {
          "en": "I'll bring the tent.",
          "ko": "텐트는 내가 가져갈게."
        },
        "frames": [
          "ko-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "오, 좋아! 그럼 고기는 내가 살게.",
        "gloss": {
          "en": "Oh, great! Then I'll buy the meat.",
          "ko": "오, 좋아! 그럼 고기는 내가 살게."
        }
      },
      {
        "who": "me",
        "text": "고마워. 의자는 걱정하지 마.",
        "gloss": {
          "en": "Thanks. Don't worry about the chairs.",
          "ko": "고마워. 의자는 걱정하지 마."
        },
        "frames": [
          "ko-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "그런데 나 캠핑 처음이야. 좀 긴장돼.",
        "gloss": {
          "en": "But it's my first time camping. I'm a little nervous.",
          "ko": "그런데 나 캠핑 처음이야. 좀 긴장돼."
        }
      },
      {
        "who": "me",
        "text": "괜찮아. 모르는 거 있으면 편하게 말해.",
        "gloss": {
          "en": "It's fine. If there's anything you don't know, just say it.",
          "ko": "괜찮아. 모르는 거 있으면 편하게 말해."
        },
        "frames": [
          "ko-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "알았어. 그럼 토요일 아침에 봐!",
        "gloss": {
          "en": "Okay. See you Saturday morning, then!",
          "ko": "알았어. 그럼 토요일 아침에 봐!"
        }
      },
      {
        "who": "me",
        "text": "응, 늦지 마!",
        "gloss": {
          "en": "Yeah, don't be late!",
          "ko": "응, 늦지 마!"
        }
      }
    ]
  },
  {
    "id": "ko-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Opening a bank account",
      "ko": "은행에서 통장 만들기"
    },
    "expressions": [],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "어서 오세요. 어떤 업무 보시겠어요?",
        "gloss": {
          "en": "Welcome. What can we help you with?",
          "ko": "어서 오세요. 어떤 업무 보시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "통장을 만들고 싶은데요.",
        "gloss": {
          "en": "I'd like to open a bank account.",
          "ko": "통장을 만들고 싶은데요."
        },
        "frames": [
          "ko-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "신분증 있으세요?",
        "gloss": {
          "en": "Do you have ID?",
          "ko": "신분증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "네, 외국인등록증 여기 있어요. 체크카드도 같이 가능해요?",
        "gloss": {
          "en": "Yes, here's my alien registration card. Is a debit card possible at the same time?",
          "ko": "네, 외국인등록증 여기 있어요. 체크카드도 같이 가능해요?"
        },
        "frames": [
          "ko-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "네, 가능합니다. 이 서류 작성해 주세요.",
        "gloss": {
          "en": "Yes, it is. Please fill out this form.",
          "ko": "네, 가능합니다. 이 서류 작성해 주세요."
        }
      },
      {
        "who": "me",
        "text": "이 부분은 잘 모르겠어요.",
        "gloss": {
          "en": "I'm not sure about this part.",
          "ko": "이 부분은 잘 모르겠어요."
        },
        "frames": [
          "ko-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "여기에는 주소를 쓰시면 돼요.",
        "gloss": {
          "en": "You just write your address here.",
          "ko": "여기에는 주소를 쓰시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "아, 알겠어요. 다 쓰면 말씀드릴게요.",
        "gloss": {
          "en": "Oh, I see. I'll let you know when I'm done.",
          "ko": "아, 알겠어요. 다 쓰면 말씀드릴게요."
        }
      }
    ]
  }
];
