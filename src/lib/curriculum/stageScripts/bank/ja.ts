import type { StageScript } from "../../stageScripts.ts";

/**
 * ja 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const JA_BANK: StageScript[] = [
  {
    "id": "ja-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a convenience store",
      "ko": "편의점에서"
    },
    "expressions": [
      "すみません",
      "大丈夫です",
      "お願いします",
      "ありがとうございます"
    ],
    "grammar": [
      1,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、お水はありますか。",
        "gloss": {
          "en": "Excuse me, do you have water?",
          "ko": "저기요, 물 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、こちらです。",
        "gloss": {
          "en": "Yes, it's right here.",
          "ko": "네, 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "これはいくらですか。",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "ja-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "百円です。袋はいりますか。",
        "gloss": {
          "en": "It's a hundred yen. Do you need a bag?",
          "ko": "백 엔이에요. 봉투 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "大丈夫です。カードでお願いします。",
        "gloss": {
          "en": "No, thanks. By card, please.",
          "ko": "괜찮아요. 카드로 할게요."
        },
        "frames": [
          "ja-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "はい。ありがとうございました。",
        "gloss": {
          "en": "All right. Thank you very much.",
          "ko": "네. 감사합니다."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서 처음 만난 사람과"
    },
    "expressions": [
      "はじめまして",
      "よろしくお願いします"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。はじめまして。田中です。",
        "gloss": {
          "en": "Hello. Nice to meet you. I'm Tanaka.",
          "ko": "안녕하세요. 처음 뵙겠습니다. 다나카예요."
        }
      },
      {
        "who": "me",
        "text": "はじめまして。わたしは留学生です。",
        "gloss": {
          "en": "Nice to meet you. I'm an exchange student.",
          "ko": "처음 뵙겠습니다. 저는 유학생이에요."
        },
        "frames": [
          "ja-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。どこから来ましたか。",
        "gloss": {
          "en": "I see. Where are you from?",
          "ko": "그렇군요. 어디에서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "タイから来ました。",
        "gloss": {
          "en": "I'm from Thailand.",
          "ko": "태국에서 왔어요."
        },
        "frames": [
          "ja-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "日本の何が好きですか。",
        "gloss": {
          "en": "What do you like about Japan?",
          "ko": "일본의 뭐가 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "日本の音楽が好きです。",
        "gloss": {
          "en": "I like Japanese music.",
          "ko": "일본 음악을 좋아해요."
        },
        "frames": [
          "ja-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。よろしくお願いします。",
        "gloss": {
          "en": "Nice. I look forward to getting to know you.",
          "ko": "좋네요. 잘 부탁해요."
        }
      },
      {
        "who": "me",
        "text": "よろしくお願いします。",
        "gloss": {
          "en": "Same here, nice to meet you.",
          "ko": "잘 부탁해요."
        }
      }
    ]
  },
  {
    "id": "ja-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Finding the right train at a station",
      "ko": "역에서 탈 전철 찾기"
    },
    "expressions": [
      "すみません",
      "わかりません",
      "わかりました",
      "ありがとうございます"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、どうしましたか。",
        "gloss": {
          "en": "Yes, can I help you?",
          "ko": "네, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、京都行きの電車はどれですか。",
        "gloss": {
          "en": "Excuse me, which train goes to Kyoto?",
          "ko": "저기요, 교토행 전철은 어느 거예요?"
        },
        "frames": [
          "ja-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "三番線の電車です。",
        "gloss": {
          "en": "It's the train on track three.",
          "ko": "삼 번 승강장 전철이에요."
        }
      },
      {
        "who": "me",
        "text": "三番線はどこですか。",
        "gloss": {
          "en": "Where is track three?",
          "ko": "삼 번 승강장은 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "あの階段の上です。",
        "gloss": {
          "en": "It's up those stairs.",
          "ko": "저 계단 위예요."
        }
      },
      {
        "who": "me",
        "text": "すみません、「階段」がわかりません。",
        "gloss": {
          "en": "Sorry, I don't understand the word for \"stairs\".",
          "ko": "죄송해요, '계단'이라는 말을 모르겠어요."
        },
        "frames": [
          "ja-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "あれです。あそこです。",
        "gloss": {
          "en": "That. Over there.",
          "ko": "저거요. 저기요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。ありがとうございます。",
        "gloss": {
          "en": "Got it. Thank you.",
          "ko": "알겠어요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering curry at a restaurant",
      "ko": "식당에서 카레 주문하기"
    },
    "expressions": [
      "すみません",
      "お願いします"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。ご注文は？",
        "gloss": {
          "en": "Welcome. What would you like?",
          "ko": "어서 오세요. 주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、これは何ですか。",
        "gloss": {
          "en": "Excuse me, what is this?",
          "ko": "저기요, 이건 뭐예요?"
        },
        "frames": [
          "ja-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "豚肉のカレーです。",
        "gloss": {
          "en": "It's pork curry.",
          "ko": "돼지고기 카레예요."
        }
      },
      {
        "who": "me",
        "text": "豚肉は食べません。",
        "gloss": {
          "en": "I don't eat pork.",
          "ko": "돼지고기는 안 먹어요."
        },
        "frames": [
          "ja-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "じゃあ、野菜カレーはどうですか。",
        "gloss": {
          "en": "Then how about the vegetable curry?",
          "ko": "그럼 채소 카레는 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "じゃあ、野菜カレーをください。",
        "gloss": {
          "en": "Then the vegetable curry, please.",
          "ko": "그럼 채소 카레 주세요."
        },
        "frames": [
          "ja-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "はい、少々お待ちください。",
        "gloss": {
          "en": "Sure, just a moment please.",
          "ko": "네, 잠시만 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "お願いします。",
        "gloss": {
          "en": "Thank you.",
          "ko": "부탁해요."
        }
      }
    ]
  },
  {
    "id": "ja-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Breakfast at a hotel",
      "ko": "호텔에서 아침 식사 묻기"
    },
    "expressions": [
      "おはようございます",
      "ありがとうございます"
    ],
    "grammar": [
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。",
        "gloss": {
          "en": "Good morning.",
          "ko": "좋은 아침이에요."
        }
      },
      {
        "who": "me",
        "text": "おはようございます。朝ご飯はどこですか。",
        "gloss": {
          "en": "Good morning. Where is breakfast?",
          "ko": "좋은 아침이에요. 아침 식사는 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "二階のレストランです。",
        "gloss": {
          "en": "It's in the restaurant on the second floor.",
          "ko": "이 층 레스토랑이에요."
        }
      },
      {
        "who": "me",
        "text": "コーヒーはありますか。",
        "gloss": {
          "en": "Do you have coffee?",
          "ko": "커피 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、あります。紅茶もありますよ。",
        "gloss": {
          "en": "Yes, we do. There's tea too.",
          "ko": "네, 있어요. 홍차도 있어요."
        }
      },
      {
        "who": "me",
        "text": "コーヒーが好きです。",
        "gloss": {
          "en": "I like coffee.",
          "ko": "커피를 좋아해요."
        },
        "frames": [
          "ja-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "では、ごゆっくりどうぞ。",
        "gloss": {
          "en": "Well then, enjoy your meal.",
          "ko": "그럼 천천히 드세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call to find a friend near a station",
      "ko": "역 근처에서 친구를 찾는 전화"
    },
    "expressions": [
      "わかりました",
      "ちょっと待ってください"
    ],
    "grammar": [
      1,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "もしもし、今どこですか。",
        "gloss": {
          "en": "Hello, where are you now?",
          "ko": "여보세요, 지금 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "今、渋谷駅にいます。",
        "gloss": {
          "en": "I'm at Shibuya Station now.",
          "ko": "지금 시부야역에 있어요."
        },
        "frames": [
          "ja-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "わたしは駅の前のカフェにいます。",
        "gloss": {
          "en": "I'm at the café in front of the station.",
          "ko": "저는 역 앞 카페에 있어요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。カフェの名前は何ですか。",
        "gloss": {
          "en": "Okay. What's the café's name?",
          "ko": "알겠어요. 카페 이름이 뭐예요?"
        },
        "frames": [
          "ja-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "「さくら」です。",
        "gloss": {
          "en": "It's called Sakura.",
          "ko": "'사쿠라'예요."
        }
      },
      {
        "who": "me",
        "text": "「さくら」はどこですか。",
        "gloss": {
          "en": "Where is Sakura?",
          "ko": "'사쿠라'는 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "本屋の隣です。",
        "gloss": {
          "en": "It's next to the bookstore.",
          "ko": "서점 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。ちょっと待ってください。",
        "gloss": {
          "en": "Got it. Please wait a moment.",
          "ko": "알겠어요. 잠깐만 기다려 주세요."
        }
      }
    ]
  },
  {
    "id": "ja-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Chatting with a coworker before a day off",
      "ko": "쉬는 날 전에 동료와 이야기"
    },
    "expressions": [
      "おはようございます"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。",
        "gloss": {
          "en": "Good morning.",
          "ko": "좋은 아침이에요."
        }
      },
      {
        "who": "me",
        "text": "おはようございます。",
        "gloss": {
          "en": "Good morning.",
          "ko": "좋은 아침이에요."
        }
      },
      {
        "who": "them",
        "text": "明日は休みですね。どこに行きますか。",
        "gloss": {
          "en": "Tomorrow is a day off. Where are you going?",
          "ko": "내일 쉬는 날이네요. 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "明日、海に行きます。",
        "gloss": {
          "en": "I'm going to the beach tomorrow.",
          "ko": "내일 바다에 가요."
        },
        "frames": [
          "ja-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。海が好きですか。",
        "gloss": {
          "en": "Nice. Do you like the sea?",
          "ko": "좋네요. 바다 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "はい、海が好きです。",
        "gloss": {
          "en": "Yes, I like the sea.",
          "ko": "네, 바다를 좋아해요."
        },
        "frames": [
          "ja-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "わたしは山に行きます。",
        "gloss": {
          "en": "I'm going to the mountains.",
          "ko": "저는 산에 가요."
        }
      },
      {
        "who": "me",
        "text": "そうですか。山の名前は何ですか。",
        "gloss": {
          "en": "Oh really? What's the mountain called?",
          "ko": "그래요? 산 이름이 뭐예요?"
        },
        "frames": [
          "ja-f1-03"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bakery",
      "ko": "빵집에서"
    },
    "expressions": [
      "こんにちは",
      "お願いします"
    ],
    "grammar": [
      4,
      5,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "こんにちは。メロンパンはどれですか。",
        "gloss": {
          "en": "Hello. Which one is the melon bread?",
          "ko": "안녕하세요. 멜론빵은 어느 거예요?"
        },
        "frames": [
          "ja-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "これです。人気ですよ。",
        "gloss": {
          "en": "This one. It's popular.",
          "ko": "이거예요. 인기 있어요."
        }
      },
      {
        "who": "me",
        "text": "メロンパンはいくらですか。",
        "gloss": {
          "en": "How much is the melon bread?",
          "ko": "멜론빵은 얼마예요?"
        },
        "frames": [
          "ja-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "二百円です。",
        "gloss": {
          "en": "It's two hundred yen.",
          "ko": "이백 엔이에요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、メロンパンをください。二つお願いします。",
        "gloss": {
          "en": "Then the melon bread, please. Two of them.",
          "ko": "그럼 멜론빵 주세요. 두 개요."
        },
        "frames": [
          "ja-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "ありがとうございます。四百円です。",
        "gloss": {
          "en": "Thank you. That's four hundred yen.",
          "ko": "감사합니다. 사백 엔이에요."
        }
      },
      {
        "who": "me",
        "text": "カードでお願いします。",
        "gloss": {
          "en": "By card, please.",
          "ko": "카드로 할게요."
        },
        "frames": [
          "ja-f1-13"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's home",
      "ko": "친구 집에서 저녁 식사"
    },
    "expressions": [
      "すみません",
      "ありがとうございます",
      "いただきます"
    ],
    "grammar": [
      2,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃい。どうぞ。",
        "gloss": {
          "en": "Welcome. Come in.",
          "ko": "어서 와요. 들어오세요."
        }
      },
      {
        "who": "me",
        "text": "ご招待をありがとうございます。",
        "gloss": {
          "en": "Thank you for inviting me.",
          "ko": "초대해 주셔서 감사해요."
        },
        "frames": [
          "ja-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "今日はすき焼きです。",
        "gloss": {
          "en": "Tonight we're having sukiyaki.",
          "ko": "오늘은 스키야키예요."
        }
      },
      {
        "who": "me",
        "text": "すみません、牛肉は食べません。",
        "gloss": {
          "en": "Sorry, I don't eat beef.",
          "ko": "죄송해요, 소고기는 안 먹어요."
        },
        "frames": [
          "ja-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "大丈夫です。魚もありますよ。",
        "gloss": {
          "en": "No problem. There's fish too.",
          "ko": "괜찮아요. 생선도 있어요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。魚が好きです。",
        "gloss": {
          "en": "Thank you. I like fish.",
          "ko": "고마워요. 생선 좋아해요."
        },
        "frames": [
          "ja-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "じゃあ、食べましょう。",
        "gloss": {
          "en": "Well, let's eat.",
          "ko": "그럼 먹어요."
        }
      },
      {
        "who": "me",
        "text": "いただきます。",
        "gloss": {
          "en": "Let's eat!",
          "ko": "잘 먹겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying cold medicine at a pharmacy",
      "ko": "약국에서 감기약 사기"
    },
    "expressions": [
      "すみません",
      "わかりません",
      "わかりました"
    ],
    "grammar": [
      1,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "子どもの風邪の薬はありますか。",
        "gloss": {
          "en": "Do you have cold medicine for children?",
          "ko": "어린이 감기약 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、ありますよ。この二つです。",
        "gloss": {
          "en": "Yes, we do. These two.",
          "ko": "네, 있어요. 이 두 개예요."
        }
      },
      {
        "who": "me",
        "text": "三歳の子どもの薬はどれですか。",
        "gloss": {
          "en": "Which one is for a three-year-old?",
          "ko": "세 살 아이 약은 어느 거예요?"
        },
        "frames": [
          "ja-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "こちらです。一日三回、飲みます。",
        "gloss": {
          "en": "This one. Take it three times a day.",
          "ko": "이거예요. 하루에 세 번 먹어요."
        }
      },
      {
        "who": "me",
        "text": "すみません、「一日三回」がわかりません。",
        "gloss": {
          "en": "Sorry, I don't understand \"three times a day\".",
          "ko": "죄송해요, '하루 세 번'을 모르겠어요."
        },
        "frames": [
          "ja-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "朝と昼と夜です。",
        "gloss": {
          "en": "Morning, noon and night.",
          "ko": "아침, 점심, 저녁이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。これをください。",
        "gloss": {
          "en": "I see. I'll take this one, please.",
          "ko": "알겠어요. 이거 주세요."
        },
        "frames": [
          "ja-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a tourist information center",
      "ko": "관광 안내소에서"
    },
    "expressions": [
      "こんにちは",
      "ありがとうございます",
      "わかりました"
    ],
    "grammar": [
      6,
      7,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。観光案内所です。",
        "gloss": {
          "en": "Hello. This is the tourist information center.",
          "ko": "안녕하세요. 관광 안내소예요."
        }
      },
      {
        "who": "me",
        "text": "こんにちは。明日、奈良に行きます。",
        "gloss": {
          "en": "Hello. I'm going to Nara tomorrow.",
          "ko": "안녕하세요. 내일 나라에 가요."
        },
        "frames": [
          "ja-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。奈良は鹿がいますよ。",
        "gloss": {
          "en": "Nice. There are deer in Nara.",
          "ko": "좋네요. 나라에는 사슴이 있어요."
        }
      },
      {
        "who": "me",
        "text": "奈良の地図はありますか。",
        "gloss": {
          "en": "Do you have a map of Nara?",
          "ko": "나라 지도 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、どうぞ。",
        "gloss": {
          "en": "Yes, here you are.",
          "ko": "네, 여기요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。バス停はどこですか。",
        "gloss": {
          "en": "Thank you. Where is the bus stop?",
          "ko": "감사합니다. 버스 정류장은 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "地図のここです。",
        "gloss": {
          "en": "It's here on the map.",
          "ko": "지도에서 여기예요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。",
        "gloss": {
          "en": "I see.",
          "ko": "알겠어요."
        }
      }
    ]
  },
  {
    "id": "ja-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a shirt at a clothing store",
      "ko": "옷 가게에서 셔츠 사기"
    },
    "expressions": [
      "すみません",
      "お願いします"
    ],
    "grammar": [
      1,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、このシャツの黒はありますか。",
        "gloss": {
          "en": "Excuse me, do you have this shirt in black?",
          "ko": "저기요, 이 셔츠 검은색 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、ありますよ。どうぞ。",
        "gloss": {
          "en": "Yes, we do. Here you go.",
          "ko": "네, 있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "これはいくらですか。",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "ja-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "三千円です。",
        "gloss": {
          "en": "It's three thousand yen.",
          "ko": "삼천 엔이에요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、これをください。",
        "gloss": {
          "en": "Then I'll take this, please.",
          "ko": "그럼 이거 주세요."
        },
        "frames": [
          "ja-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "お支払いはどうしますか。",
        "gloss": {
          "en": "How would you like to pay?",
          "ko": "결제는 어떻게 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "現金でお願いします。",
        "gloss": {
          "en": "Cash, please.",
          "ko": "현금으로 할게요."
        },
        "frames": [
          "ja-f1-13"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day in a Japanese class",
      "ko": "일본어 교실 첫날"
    },
    "expressions": [
      "はじめまして",
      "すみません",
      "わかりません"
    ],
    "grammar": [
      0,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "はじめまして。このクラスの先生です。",
        "gloss": {
          "en": "Nice to meet you. I'm this class's teacher.",
          "ko": "처음 뵙겠습니다. 이 반 선생님이에요."
        }
      },
      {
        "who": "me",
        "text": "はじめまして。わたしは新しい学生です。",
        "gloss": {
          "en": "Nice to meet you. I'm a new student.",
          "ko": "처음 뵙겠습니다. 저는 새 학생이에요."
        },
        "frames": [
          "ja-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "ようこそ。どこから来ましたか。",
        "gloss": {
          "en": "Welcome. Where are you from?",
          "ko": "환영해요. 어디에서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ベトナムから来ました。",
        "gloss": {
          "en": "I'm from Vietnam.",
          "ko": "베트남에서 왔어요."
        },
        "frames": [
          "ja-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "日本語の教科書はありますか。",
        "gloss": {
          "en": "Do you have the Japanese textbook?",
          "ko": "일본어 교과서 있어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、これはわたしの教科書です。",
        "gloss": {
          "en": "Yes, this is my textbook.",
          "ko": "네, 이게 제 교과서예요."
        },
        "frames": [
          "ja-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。何か質問はありますか。",
        "gloss": {
          "en": "Good. Do you have any questions?",
          "ko": "좋아요. 질문 있어요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、宿題がわかりません。",
        "gloss": {
          "en": "Sorry, I don't understand the homework.",
          "ko": "죄송해요, 숙제를 모르겠어요."
        },
        "frames": [
          "ja-f1-14"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a station lost-and-found counter",
      "ko": "역 분실물 창구에서"
    },
    "expressions": [
      "ありがとうございます"
    ],
    "grammar": [
      3,
      7,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、忘れ物ですか。",
        "gloss": {
          "en": "Yes, did you leave something behind?",
          "ko": "네, 물건을 두고 내리셨어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、黒いかばんはありますか。",
        "gloss": {
          "en": "Yes, do you have a black bag?",
          "ko": "네, 검은 가방 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "このかばんですか。",
        "gloss": {
          "en": "Is it this bag?",
          "ko": "이 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "はい、これはわたしのかばんです。",
        "gloss": {
          "en": "Yes, this is my bag.",
          "ko": "네, 이게 제 가방이에요."
        },
        "frames": [
          "ja-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "中に何がありますか。",
        "gloss": {
          "en": "What's inside?",
          "ko": "안에 뭐가 있어요?"
        }
      },
      {
        "who": "me",
        "text": "財布と日本語の本です。",
        "gloss": {
          "en": "My wallet and a Japanese book.",
          "ko": "지갑하고 일본어 책이에요."
        }
      },
      {
        "who": "them",
        "text": "はい、どうぞ。",
        "gloss": {
          "en": "All right, here you go.",
          "ko": "네, 여기요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。出口はどこですか。",
        "gloss": {
          "en": "Thank you. Where is the exit?",
          "ko": "감사합니다. 출구는 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a ramen shop",
      "ko": "라멘 가게에서"
    },
    "expressions": [
      "すみません",
      "わかりました",
      "お願いします"
    ],
    "grammar": [
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、しょうゆラーメンはどれですか。",
        "gloss": {
          "en": "Excuse me, which one is the soy sauce ramen?",
          "ko": "저기요, 간장 라멘은 어느 거예요?"
        },
        "frames": [
          "ja-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "この赤いボタンです。",
        "gloss": {
          "en": "It's this red button.",
          "ko": "이 빨간 버튼이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。麺は硬めでお願いします。",
        "gloss": {
          "en": "I see. Firm noodles, please.",
          "ko": "알겠어요. 면은 꼬들꼬들하게 해 주세요."
        },
        "frames": [
          "ja-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "はい。ネギは大丈夫ですか。",
        "gloss": {
          "en": "Sure. Are green onions okay?",
          "ko": "네. 파는 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、ネギは食べません。",
        "gloss": {
          "en": "Sorry, I don't eat green onions.",
          "ko": "죄송해요, 파는 안 먹어요."
        },
        "frames": [
          "ja-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。ネギなしですね。",
        "gloss": {
          "en": "Got it. No green onions.",
          "ko": "알겠어요. 파 빼고요."
        }
      },
      {
        "who": "me",
        "text": "お願いします。",
        "gloss": {
          "en": "Yes, please.",
          "ko": "부탁해요."
        }
      }
    ]
  },
  {
    "id": "ja-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A coworker brings you a souvenir",
      "ko": "동료가 여행 선물을 줄 때"
    },
    "expressions": [
      "いただきます"
    ],
    "grammar": [
      0,
      4,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "これ、旅行のお土産です。どうぞ。",
        "gloss": {
          "en": "This is a souvenir from my trip. Here.",
          "ko": "이거 여행 선물이에요. 받으세요."
        }
      },
      {
        "who": "me",
        "text": "わあ、お土産をありがとうございます。",
        "gloss": {
          "en": "Wow, thank you for the souvenir.",
          "ko": "와, 선물 고마워요."
        },
        "frames": [
          "ja-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "北海道のお菓子です。",
        "gloss": {
          "en": "They're sweets from Hokkaido.",
          "ko": "홋카이도 과자예요."
        }
      },
      {
        "who": "me",
        "text": "これは何ですか。",
        "gloss": {
          "en": "What is this?",
          "ko": "이건 뭐예요?"
        },
        "frames": [
          "ja-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "チョコレートのクッキーです。",
        "gloss": {
          "en": "They're chocolate cookies.",
          "ko": "초콜릿 쿠키예요."
        }
      },
      {
        "who": "me",
        "text": "チョコレートが好きです。",
        "gloss": {
          "en": "I like chocolate.",
          "ko": "초콜릿 좋아해요."
        },
        "frames": [
          "ja-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "よかったです。",
        "gloss": {
          "en": "I'm glad.",
          "ko": "다행이에요."
        }
      },
      {
        "who": "me",
        "text": "いただきます。",
        "gloss": {
          "en": "I'll have one, thanks!",
          "ko": "잘 먹겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Calling a clinic when you can't find it",
      "ko": "병원을 못 찾아서 전화하기"
    },
    "expressions": [
      "もう一度お願いします",
      "わかりました"
    ],
    "grammar": [
      7,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、さくらクリニックです。",
        "gloss": {
          "en": "Hello, Sakura Clinic.",
          "ko": "네, 사쿠라 클리닉이에요."
        }
      },
      {
        "who": "me",
        "text": "すみません、今、郵便局の前にいます。",
        "gloss": {
          "en": "Excuse me, I'm in front of the post office now.",
          "ko": "저기요, 지금 우체국 앞에 있어요."
        },
        "frames": [
          "ja-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "郵便局の右に銀行があります。クリニックは銀行の二階です。",
        "gloss": {
          "en": "There's a bank to the right of the post office. The clinic is on the bank's second floor.",
          "ko": "우체국 오른쪽에 은행이 있어요. 클리닉은 은행 이 층이에요."
        }
      },
      {
        "who": "me",
        "text": "もう一度お願いします。",
        "gloss": {
          "en": "Could you say that again, please?",
          "ko": "한 번 더 말해 주세요."
        }
      },
      {
        "who": "them",
        "text": "郵便局の右に銀行があります。クリニックは二階です。",
        "gloss": {
          "en": "There's a bank to the right of the post office. The clinic is on the second floor.",
          "ko": "우체국 오른쪽에 은행이 있어요. 클리닉은 이 층이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。入口はどこですか。",
        "gloss": {
          "en": "Got it. Where is the entrance?",
          "ko": "알겠어요. 입구는 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "銀行の左です。",
        "gloss": {
          "en": "It's to the left of the bank.",
          "ko": "은행 왼쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。エレベーターはありますか。",
        "gloss": {
          "en": "Okay. Is there an elevator?",
          "ko": "알겠어요. 엘리베이터 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      }
    ]
  },
  {
    "id": "ja-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a café",
      "ko": "카페에서 주문하기"
    },
    "expressions": [
      "トイレはどこですか",
      "ありがとうございます",
      "お願いします"
    ],
    "grammar": [
      5,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。ご注文をどうぞ。",
        "gloss": {
          "en": "Welcome. What can I get you?",
          "ko": "어서 오세요. 주문하세요."
        }
      },
      {
        "who": "me",
        "text": "アイスコーヒーをください。",
        "gloss": {
          "en": "An iced coffee, please.",
          "ko": "아이스커피 주세요."
        },
        "frames": [
          "ja-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "サイズはどうしますか。",
        "gloss": {
          "en": "What size would you like?",
          "ko": "사이즈는 어떻게 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "大きいサイズでお願いします。",
        "gloss": {
          "en": "The large size, please.",
          "ko": "큰 사이즈로 할게요."
        },
        "frames": [
          "ja-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "はい。ここで飲みますか。",
        "gloss": {
          "en": "Sure. Will you drink it here?",
          "ko": "네. 여기서 드세요?"
        }
      },
      {
        "who": "me",
        "text": "はい。トイレはどこですか。",
        "gloss": {
          "en": "Yes. Where is the restroom?",
          "ko": "네. 화장실은 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "あちらです。",
        "gloss": {
          "en": "It's over there.",
          "ko": "저쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a market",
      "ko": "시장에서 과일 사기"
    },
    "expressions": [
      "ありがとうございます"
    ],
    "grammar": [
      4,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃい！今日はりんごが安いですよ。",
        "gloss": {
          "en": "Welcome! Apples are cheap today.",
          "ko": "어서 오세요! 오늘은 사과가 싸요."
        }
      },
      {
        "who": "me",
        "text": "その黄色い果物は何ですか。",
        "gloss": {
          "en": "What's that yellow fruit?",
          "ko": "그 노란 과일은 뭐예요?"
        },
        "frames": [
          "ja-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "これは柿です。秋の果物です。",
        "gloss": {
          "en": "This is a persimmon. It's an autumn fruit.",
          "ko": "이건 감이에요. 가을 과일이에요."
        }
      },
      {
        "who": "me",
        "text": "柿はいくらですか。",
        "gloss": {
          "en": "How much are the persimmons?",
          "ko": "감은 얼마예요?"
        },
        "frames": [
          "ja-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "一つ百五十円です。",
        "gloss": {
          "en": "A hundred and fifty yen each.",
          "ko": "한 개에 백오십 엔이에요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、この柿をください。三つお願いします。",
        "gloss": {
          "en": "Then these persimmons, please. Three of them.",
          "ko": "그럼 이 감 주세요. 세 개요."
        },
        "frames": [
          "ja-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "はい、ありがとうございます。",
        "gloss": {
          "en": "Here you go, thank you.",
          "ko": "네, 감사합니다."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a movie theater",
      "ko": "영화관에서"
    },
    "expressions": [
      "すみません",
      "わかりました"
    ],
    "grammar": [
      3,
      7,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "チケットを見せてください。",
        "gloss": {
          "en": "Please show me your ticket.",
          "ko": "티켓 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "はい、これはわたしのチケットです。",
        "gloss": {
          "en": "Sure, this is my ticket.",
          "ko": "네, 이게 제 티켓이에요."
        },
        "frames": [
          "ja-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      },
      {
        "who": "me",
        "text": "すみません、三番シアターはどこですか。",
        "gloss": {
          "en": "Excuse me, where is Theater Three?",
          "ko": "저기요, 삼 관은 어디예요?"
        },
        "frames": [
          "ja-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "あちらの右です。",
        "gloss": {
          "en": "It's over there on the right.",
          "ko": "저쪽 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "ポップコーンはありますか。",
        "gloss": {
          "en": "Do you have popcorn?",
          "ko": "팝콘 있어요?"
        },
        "frames": [
          "ja-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "はい、売店にあります。",
        "gloss": {
          "en": "Yes, at the snack counter.",
          "ko": "네, 매점에 있어요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。",
        "gloss": {
          "en": "Got it.",
          "ko": "알겠어요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a temple entrance in Kyoto",
      "ko": "교토의 절 입구에서"
    },
    "expressions": [
      "写真を撮ってもいいですか"
    ],
    "grammar": [
      4,
      6,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。チケットはこちらです。",
        "gloss": {
          "en": "Hello. Here's your ticket.",
          "ko": "안녕하세요. 티켓 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "すみません、ここで写真を撮ってもいいですか。",
        "gloss": {
          "en": "Excuse me, may I take photos here?",
          "ko": "저기요, 여기서 사진 찍어도 돼요?"
        },
        "frames": [
          "ja-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "中はだめですが、庭は大丈夫ですよ。ここは初めてですか。",
        "gloss": {
          "en": "Not inside, but the garden is fine. Is this your first time here?",
          "ko": "안은 안 되지만 정원은 괜찮아요. 여기는 처음이세요?"
        }
      },
      {
        "who": "me",
        "text": "はい。でも、金閣寺には行ったことがあります。",
        "gloss": {
          "en": "Yes. But I've been to Kinkaku-ji.",
          "ko": "네. 그래도 금각사에는 가 본 적이 있어요."
        },
        "frames": [
          "ja-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。秋の庭もきれいですよ。",
        "gloss": {
          "en": "I see. The garden is beautiful in autumn too.",
          "ko": "그렇군요. 가을 정원도 예뻐요."
        }
      },
      {
        "who": "me",
        "text": "秋にまた来たいです。",
        "gloss": {
          "en": "I want to come again in autumn.",
          "ko": "가을에 또 오고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "ぜひ。ゆっくり見てください。",
        "gloss": {
          "en": "Please do. Take your time looking around.",
          "ko": "꼭 오세요. 천천히 둘러보세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a coworker to lunch",
      "ko": "동료에게 점심 같이 먹자고 하기"
    },
    "expressions": [
      "まだです",
      "楽しみです"
    ],
    "grammar": [
      5,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "お疲れさまです。もうお昼ご飯を食べましたか。",
        "gloss": {
          "en": "Hi there. Have you had lunch yet?",
          "ko": "수고 많으세요. 점심 벌써 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "まだです。一緒に食べに行きませんか。",
        "gloss": {
          "en": "Not yet. Would you like to go eat together?",
          "ko": "아직이요. 같이 먹으러 갈래요?"
        },
        "frames": [
          "ja-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。そば屋とカレー屋、どっちがいいですか。",
        "gloss": {
          "en": "Sounds good. Which is better, the soba place or the curry place?",
          "ko": "좋아요. 메밀국수 집이랑 카레 집 중에 어디가 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "じゃあ、そば屋にしましょう。",
        "gloss": {
          "en": "Then let's go with the soba place.",
          "ko": "그럼 메밀국수 집으로 해요."
        },
        "frames": [
          "ja-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "何時にしますか。",
        "gloss": {
          "en": "What time shall we make it?",
          "ko": "몇 시로 할까요?"
        }
      },
      {
        "who": "me",
        "text": "十二時半に一階のロビーで会いましょう。",
        "gloss": {
          "en": "Let's meet in the first-floor lobby at twelve thirty.",
          "ko": "열두 시 반에 일 층 로비에서 만나요."
        },
        "frames": [
          "ja-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。じゃあ、またあとで。",
        "gloss": {
          "en": "Got it. See you later then.",
          "ko": "알겠어요. 그럼 이따 봐요."
        }
      },
      {
        "who": "me",
        "text": "はい、楽しみです。",
        "gloss": {
          "en": "Okay, I'm looking forward to it.",
          "ko": "네, 기대돼요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor for a headache",
      "ko": "두통으로 병원 진료"
    },
    "expressions": [
      "頭が痛いです"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。どうしましたか。",
        "gloss": {
          "en": "Hello. What seems to be the problem?",
          "ko": "안녕하세요. 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "昨日の夜から頭が痛いです。",
        "gloss": {
          "en": "My head has hurt since last night.",
          "ko": "어젯밤부터 머리가 아파요."
        },
        "frames": [
          "ja-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "熱はありますか。",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、少しあります。今日、お風呂に入ってもいいですか。",
        "gloss": {
          "en": "Yes, a little. May I take a bath today?",
          "ko": "네, 조금 있어요. 오늘 목욕해도 돼요?"
        },
        "frames": [
          "ja-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "今日はやめてください。この薬を朝と夜に飲んでください。",
        "gloss": {
          "en": "Please don't today. Take this medicine in the morning and at night.",
          "ko": "오늘은 하지 마세요. 이 약을 아침과 밤에 드세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、もう一度ゆっくり言ってください。",
        "gloss": {
          "en": "Sorry, please say that again slowly.",
          "ko": "죄송해요, 한 번 더 천천히 말해 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "朝と夜に一つずつ飲んでください。",
        "gloss": {
          "en": "Take one in the morning and one at night.",
          "ko": "아침과 밤에 하나씩 드세요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。ありがとうございます。",
        "gloss": {
          "en": "I understand. Thank you.",
          "ko": "알겠어요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Reporting a lost wallet at a police box",
      "ko": "파출소에 지갑 분실 신고"
    },
    "expressions": [],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうしましたか。",
        "gloss": {
          "en": "What happened?",
          "ko": "무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、財布をなくしました。",
        "gloss": {
          "en": "Excuse me, I lost my wallet.",
          "ko": "저기요, 지갑을 잃어버렸어요."
        },
        "frames": [
          "ja-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "どこでなくしましたか。",
        "gloss": {
          "en": "Where did you lose it?",
          "ko": "어디서 잃어버렸어요?"
        }
      },
      {
        "who": "me",
        "text": "たぶん電車の中です。昨日、新宿で電車に乗りました。",
        "gloss": {
          "en": "Probably on the train. Yesterday I got on a train in Shinjuku.",
          "ko": "아마 전철 안이에요. 어제 신주쿠에서 전철을 탔어요."
        },
        "frames": [
          "ja-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "財布は何色ですか。",
        "gloss": {
          "en": "What color is the wallet?",
          "ko": "지갑은 무슨 색이에요?"
        }
      },
      {
        "who": "me",
        "text": "茶色です。中にカードと学生証が入っています。",
        "gloss": {
          "en": "It's brown. My cards and student ID are inside.",
          "ko": "갈색이에요. 안에 카드랑 학생증이 들어 있어요."
        }
      },
      {
        "who": "them",
        "text": "わかりました。連絡先をここに書いてください。",
        "gloss": {
          "en": "I see. Please write your contact details here.",
          "ko": "알겠어요. 연락처를 여기에 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "はい。今、駅の近くのホテルに泊まっています。",
        "gloss": {
          "en": "Okay. I'm staying at a hotel near the station right now.",
          "ko": "네. 지금 역 근처 호텔에 묵고 있어요."
        },
        "frames": [
          "ja-f2-11"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a hair salon",
      "ko": "미용실에서"
    },
    "expressions": [
      "少しだけ"
    ],
    "grammar": [
      3,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。今日はどうしますか。",
        "gloss": {
          "en": "Welcome. What would you like today?",
          "ko": "어서 오세요. 오늘은 어떻게 해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "髪を短くしたいです。",
        "gloss": {
          "en": "I want to make my hair shorter.",
          "ko": "머리를 짧게 하고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "どのくらい切りますか。",
        "gloss": {
          "en": "How much should I cut?",
          "ko": "얼마나 자를까요?"
        }
      },
      {
        "who": "me",
        "text": "前髪は少しだけ切ってください。",
        "gloss": {
          "en": "Please cut my bangs just a little.",
          "ko": "앞머리는 조금만 잘라 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。カラーもしますか。",
        "gloss": {
          "en": "Got it. Would you like color too?",
          "ko": "알겠어요. 염색도 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "うーん、明るい茶色はどうですか。",
        "gloss": {
          "en": "Hmm, how about a light brown?",
          "ko": "음, 밝은 갈색은 어때요?"
        },
        "frames": [
          "ja-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "似合うと思いますよ。",
        "gloss": {
          "en": "I think it would suit you.",
          "ko": "잘 어울릴 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、それにしましょう。",
        "gloss": {
          "en": "Then let's go with that.",
          "ko": "그럼 그걸로 해요."
        },
        "frames": [
          "ja-f2-06"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday small talk about the weekend",
      "ko": "월요일에 주말 이야기"
    },
    "expressions": [
      "一緒に行きませんか"
    ],
    "grammar": [
      0,
      6,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。週末はどうでしたか。",
        "gloss": {
          "en": "Good morning. How was your weekend?",
          "ko": "좋은 아침이에요. 주말은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "楽しかったです。昨日、友だちと鎌倉に行きました。",
        "gloss": {
          "en": "It was fun. Yesterday I went to Kamakura with a friend.",
          "ko": "즐거웠어요. 어제 친구랑 가마쿠라에 갔어요."
        },
        "frames": [
          "ja-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。何をしましたか。",
        "gloss": {
          "en": "Nice. What did you do?",
          "ko": "좋네요. 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "お寺を見て、しらす丼を食べました。しらす丼を食べたことがありますか。",
        "gloss": {
          "en": "I saw temples and ate a whitebait rice bowl. Have you ever had one?",
          "ko": "절을 보고 시라스동을 먹었어요. 시라스동 먹어 본 적 있어요?"
        },
        "frames": [
          "ja-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "いいえ、まだです。おいしいですか。",
        "gloss": {
          "en": "No, not yet. Is it good?",
          "ko": "아뇨, 아직이요. 맛있어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、とてもおいしいです。今度、一緒に行きませんか。",
        "gloss": {
          "en": "Yes, it's really good. Would you like to go together sometime?",
          "ko": "네, 정말 맛있어요. 다음에 같이 갈래요?"
        },
        "frames": [
          "ja-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。ぜひ。",
        "gloss": {
          "en": "Sounds great. I'd love to.",
          "ko": "좋아요. 꼭이요."
        }
      },
      {
        "who": "me",
        "text": "来月はどうですか。",
        "gloss": {
          "en": "How about next month?",
          "ko": "다음 달은 어때요?"
        },
        "frames": [
          "ja-f2-16"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Leaving a work dinner early",
      "ko": "회식에서 먼저 일어나기"
    },
    "expressions": [
      "楽しみです"
    ],
    "grammar": [
      7,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "このあと、二次会に一緒に行きませんか。",
        "gloss": {
          "en": "Would you like to come to the after-party with us?",
          "ko": "이따 이차에 같이 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、今日はちょっと…。",
        "gloss": {
          "en": "Sorry, today is a bit difficult…",
          "ko": "죄송해요, 오늘은 좀…"
        },
        "frames": [
          "ja-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。残念です。",
        "gloss": {
          "en": "I see. That's too bad.",
          "ko": "그래요? 아쉽네요."
        }
      },
      {
        "who": "me",
        "text": "明日は朝から仕事があるから、先に帰ります。",
        "gloss": {
          "en": "I have work from the morning tomorrow, so I'll head home first.",
          "ko": "내일 아침부터 일이 있어서 먼저 들어갈게요."
        },
        "frames": [
          "ja-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。気をつけて。",
        "gloss": {
          "en": "Okay. Get home safe.",
          "ko": "알겠어요. 조심히 가요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。来週、一緒に飲みませんか。",
        "gloss": {
          "en": "Thank you. Would you like to have a drink together next week?",
          "ko": "고마워요. 다음 주에 같이 한잔할래요?"
        },
        "frames": [
          "ja-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。じゃあ、来週の金曜日にしましょう。",
        "gloss": {
          "en": "Sounds good. Let's make it next Friday then.",
          "ko": "좋아요. 그럼 다음 주 금요일로 해요."
        }
      },
      {
        "who": "me",
        "text": "はい。来週の金曜日が楽しみです。",
        "gloss": {
          "en": "Sure. I'm looking forward to next Friday.",
          "ko": "네. 다음 주 금요일이 기대돼요."
        },
        "frames": [
          "ja-f2-14"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "First day at a cooking class",
      "ko": "요리 교실 첫날"
    },
    "expressions": [
      "本当ですか",
      "楽しみです"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "はじめまして。この料理教室は初めてですか。",
        "gloss": {
          "en": "Nice to meet you. Is this your first time at this cooking class?",
          "ko": "처음 뵙겠습니다. 이 요리 교실은 처음이세요?"
        }
      },
      {
        "who": "me",
        "text": "はい、初めてです。この近くに住んでいます。",
        "gloss": {
          "en": "Yes, it's my first time. I live near here.",
          "ko": "네, 처음이에요. 이 근처에 살아요."
        },
        "frames": [
          "ja-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。料理はよくしますか。",
        "gloss": {
          "en": "I see. Do you cook often?",
          "ko": "그렇군요. 요리는 자주 해요?"
        }
      },
      {
        "who": "me",
        "text": "カレーは作ったことがありますが、和食は初めてです。",
        "gloss": {
          "en": "I've made curry before, but Japanese food is new to me.",
          "ko": "카레는 만들어 본 적이 있지만 일식은 처음이에요."
        },
        "frames": [
          "ja-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "今日は天ぷらを作りますよ。",
        "gloss": {
          "en": "We're making tempura today.",
          "ko": "오늘은 튀김을 만들 거예요."
        }
      },
      {
        "who": "me",
        "text": "本当ですか。天ぷらが楽しみです。",
        "gloss": {
          "en": "Really? I'm looking forward to the tempura.",
          "ko": "정말요? 튀김 기대돼요."
        },
        "frames": [
          "ja-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "一緒に頑張りましょう。",
        "gloss": {
          "en": "Let's do our best together.",
          "ko": "같이 열심히 해요."
        }
      },
      {
        "who": "me",
        "text": "はい、よろしくお願いします。",
        "gloss": {
          "en": "Yes, I'm glad to be here with you.",
          "ko": "네, 잘 부탁드려요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Eating out with a friend at a gyoza place",
      "ko": "친구와 만두 가게에서"
    },
    "expressions": [
      "何がおすすめですか",
      "楽しみです"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ここ、初めてですか。何にしますか。",
        "gloss": {
          "en": "Is this your first time here? What will you have?",
          "ko": "여기 처음이에요? 뭐 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "はい、初めてです。この店は何がおすすめですか。",
        "gloss": {
          "en": "Yes, it's my first time. What do you recommend at this place?",
          "ko": "네, 처음이에요. 이 가게는 뭐가 맛있어요?"
        },
        "frames": [
          "ja-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "ラーメンもいいけど、ぎょうざが有名ですよ。",
        "gloss": {
          "en": "The ramen is good too, but the gyoza is famous.",
          "ko": "라멘도 괜찮지만 교자가 유명해요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、ぎょうざにしましょう。",
        "gloss": {
          "en": "Then let's go with the gyoza.",
          "ko": "그럼 교자로 해요."
        },
        "frames": [
          "ja-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "飲み物は？ビールを飲みますか。",
        "gloss": {
          "en": "What about drinks? Will you have a beer?",
          "ko": "음료는요? 맥주 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、お酒はちょっと…。ウーロン茶にします。",
        "gloss": {
          "en": "Sorry, alcohol is a bit… I'll have oolong tea.",
          "ko": "죄송해요, 술은 좀… 우롱차로 할게요."
        },
        "frames": [
          "ja-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。すみません、注文お願いします！",
        "gloss": {
          "en": "Okay. Excuse me, we'd like to order!",
          "ko": "알겠어요. 저기요, 주문할게요!"
        }
      },
      {
        "who": "me",
        "text": "ぎょうざ、楽しみです。",
        "gloss": {
          "en": "I'm looking forward to the gyoza.",
          "ko": "교자 기대돼요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost on the way to a museum",
      "ko": "미술관 가는 길에 길을 잃었을 때"
    },
    "expressions": [
      "道に迷いました"
    ],
    "grammar": [
      3,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうしましたか。大丈夫ですか。",
        "gloss": {
          "en": "What's wrong? Are you okay?",
          "ko": "무슨 일이에요? 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、道に迷いました。",
        "gloss": {
          "en": "Excuse me, I'm lost.",
          "ko": "죄송해요, 길을 잃었어요."
        }
      },
      {
        "who": "them",
        "text": "どこに行きたいですか。",
        "gloss": {
          "en": "Where do you want to go?",
          "ko": "어디 가고 싶어요?"
        }
      },
      {
        "who": "me",
        "text": "美術館に行きたいです。",
        "gloss": {
          "en": "I want to go to the art museum.",
          "ko": "미술관에 가고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "この道をまっすぐ行って、二つ目の角を右です。",
        "gloss": {
          "en": "Go straight down this street and turn right at the second corner.",
          "ko": "이 길로 쭉 가서 두 번째 모퉁이에서 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "すみません、地図で教えてください。",
        "gloss": {
          "en": "Sorry, please show me on the map.",
          "ko": "죄송해요, 지도로 알려 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "はい。今、ここにいます。ここが美術館です。",
        "gloss": {
          "en": "Sure. We're here now. This is the museum.",
          "ko": "네. 지금 여기 있어요. 여기가 미술관이에요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。この地図の写真を撮ってもいいですか。",
        "gloss": {
          "en": "I see. May I take a photo of this map?",
          "ko": "알겠어요. 이 지도 사진 찍어도 돼요?"
        },
        "frames": [
          "ja-f2-01"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Phone call with a friend who is running late",
      "ko": "늦는 친구와 통화"
    },
    "expressions": [],
    "grammar": [
      2,
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "もしもし、もう駅に着きましたか。",
        "gloss": {
          "en": "Hello, have you arrived at the station yet?",
          "ko": "여보세요, 벌써 역에 도착했어요?"
        }
      },
      {
        "who": "me",
        "text": "はい。今、改札の前で待っています。",
        "gloss": {
          "en": "Yes. I'm waiting in front of the ticket gates now.",
          "ko": "네. 지금 개찰구 앞에서 기다리고 있어요."
        },
        "frames": [
          "ja-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ごめんなさい、電車が遅れています。",
        "gloss": {
          "en": "I'm sorry, my train is running late.",
          "ko": "미안해요, 전철이 늦어지고 있어요."
        }
      },
      {
        "who": "me",
        "text": "大丈夫です。もう晩ご飯を食べましたか。",
        "gloss": {
          "en": "No problem. Have you had dinner yet?",
          "ko": "괜찮아요. 저녁 벌써 먹었어요?"
        },
        "frames": [
          "ja-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "いいえ、まだです。",
        "gloss": {
          "en": "No, not yet.",
          "ko": "아뇨, 아직이요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、駅の近くのラーメン屋はどうですか。",
        "gloss": {
          "en": "Then how about the ramen shop near the station?",
          "ko": "그럼 역 근처 라멘 가게 어때요?"
        },
        "frames": [
          "ja-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。あと十分で着きます。",
        "gloss": {
          "en": "Sounds good. I'll be there in ten minutes.",
          "ko": "좋아요. 십 분 뒤에 도착해요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。じゃあ、改札で会いましょう。",
        "gloss": {
          "en": "Okay. Let's meet at the ticket gates then.",
          "ko": "알겠어요. 그럼 개찰구에서 만나요."
        },
        "frames": [
          "ja-f2-05"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Arriving early at a hotel",
      "ko": "호텔에 일찍 도착했을 때"
    },
    "expressions": [],
    "grammar": [
      4,
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。チェックインは三時からです。",
        "gloss": {
          "en": "Welcome. Check-in is from three o'clock.",
          "ko": "어서 오세요. 체크인은 세 시부터예요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。荷物をここに置いてもいいですか。",
        "gloss": {
          "en": "I see. May I leave my luggage here?",
          "ko": "알겠어요. 짐을 여기 둬도 돼요?"
        },
        "frames": [
          "ja-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "はい、お預かりします。",
        "gloss": {
          "en": "Yes, we'll keep it for you.",
          "ko": "네, 맡아 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。この近くで昼ご飯を食べたいです。",
        "gloss": {
          "en": "Thank you. I want to have lunch around here.",
          "ko": "감사합니다. 이 근처에서 점심을 먹고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "駅の方にお店がたくさんありますよ。",
        "gloss": {
          "en": "There are lots of places toward the station.",
          "ko": "역 쪽에 가게가 많아요."
        }
      },
      {
        "who": "me",
        "text": "すみません、地図を見せてください。",
        "gloss": {
          "en": "Excuse me, please show me a map.",
          "ko": "죄송해요, 지도 좀 보여 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "はい、どうぞ。この道です。",
        "gloss": {
          "en": "Here you are. It's this street.",
          "ko": "네, 여기요. 이 길이에요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。じゃあ、三時に戻ります。",
        "gloss": {
          "en": "Thank you. I'll be back at three, then.",
          "ko": "감사합니다. 그럼 세 시에 돌아올게요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a birthday gift at a department store",
      "ko": "백화점에서 생일 선물 사기"
    },
    "expressions": [
      "何がおすすめですか",
      "いいですね"
    ],
    "grammar": [
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。何かお探しですか。",
        "gloss": {
          "en": "Welcome. Are you looking for something?",
          "ko": "어서 오세요. 찾으시는 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "友だちの誕生日プレゼントを買いたいです。",
        "gloss": {
          "en": "I want to buy a birthday present for a friend.",
          "ko": "친구 생일 선물을 사고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。お友だちは何が好きですか。",
        "gloss": {
          "en": "I see. What does your friend like?",
          "ko": "그렇군요. 친구분은 뭘 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "お茶が好きです。プレゼントは何がおすすめですか。",
        "gloss": {
          "en": "She likes tea. What do you recommend as a present?",
          "ko": "차를 좋아해요. 선물로는 뭐가 좋아요?"
        },
        "frames": [
          "ja-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "このお茶のセットはどうですか。人気ですよ。",
        "gloss": {
          "en": "How about this tea set? It's popular.",
          "ko": "이 차 세트는 어떠세요? 인기 있어요."
        }
      },
      {
        "who": "me",
        "text": "いいですね。じゃあ、これをプレゼント用に包装してください。",
        "gloss": {
          "en": "Nice. Then please gift-wrap this.",
          "ko": "좋네요. 그럼 이거 선물용으로 포장해 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "はい。カードもお付けしますか。",
        "gloss": {
          "en": "Certainly. Shall I add a card too?",
          "ko": "네. 카드도 넣어 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "はい、お願いします。友だちのパーティーが楽しみです。",
        "gloss": {
          "en": "Yes, please. I'm looking forward to my friend's party.",
          "ko": "네, 부탁해요. 친구 파티가 기대돼요."
        },
        "frames": [
          "ja-f2-14"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Dinner with a host family",
      "ko": "홈스테이 가족과 저녁 식사"
    },
    "expressions": [
      "楽しみです"
    ],
    "grammar": [
      2,
      6,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "日本の生活はどうですか。",
        "gloss": {
          "en": "How is life in Japan?",
          "ko": "일본 생활은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "楽しいです。今、毎日日本語を勉強しています。",
        "gloss": {
          "en": "It's fun. I'm studying Japanese every day now.",
          "ko": "즐거워요. 지금 매일 일본어를 공부하고 있어요."
        },
        "frames": [
          "ja-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "温泉に行ったことがありますか。",
        "gloss": {
          "en": "Have you ever been to a hot spring?",
          "ko": "온천에 가 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、箱根に行ったことがあります。",
        "gloss": {
          "en": "Yes, I've been to Hakone.",
          "ko": "네, 하코네에 가 본 적이 있어요."
        },
        "frames": [
          "ja-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。冬休みはどこに行きたいですか。",
        "gloss": {
          "en": "Nice. Where do you want to go over winter break?",
          "ko": "좋네요. 겨울 방학엔 어디 가고 싶어요?"
        }
      },
      {
        "who": "me",
        "text": "北海道に行きたいです。雪を見たいです。",
        "gloss": {
          "en": "I want to go to Hokkaido. I want to see snow.",
          "ko": "홋카이도에 가고 싶어요. 눈을 보고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "北海道は寒いですよ。",
        "gloss": {
          "en": "Hokkaido is cold, you know.",
          "ko": "홋카이도는 추워요."
        }
      },
      {
        "who": "me",
        "text": "大丈夫です。冬休みが楽しみです。",
        "gloss": {
          "en": "That's fine. I'm looking forward to winter break.",
          "ko": "괜찮아요. 겨울 방학이 기대돼요."
        },
        "frames": [
          "ja-f2-14"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Borrowing a book at the library",
      "ko": "도서관에서 책 빌리기"
    },
    "expressions": [],
    "grammar": [
      3,
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。",
        "gloss": {
          "en": "Hello.",
          "ko": "안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "こんにちは。この本を借りたいです。",
        "gloss": {
          "en": "Hello. I'd like to borrow this book.",
          "ko": "안녕하세요. 이 책을 빌리고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "図書館のカードはありますか。",
        "gloss": {
          "en": "Do you have a library card?",
          "ko": "도서관 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ。カードを作ってもいいですか。",
        "gloss": {
          "en": "No. May I make a card?",
          "ko": "아뇨. 카드를 만들어도 돼요?"
        },
        "frames": [
          "ja-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "はい。この紙に名前と住所を書いてください。",
        "gloss": {
          "en": "Sure. Please write your name and address on this form.",
          "ko": "네. 이 종이에 이름과 주소를 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "今、大学の寮に住んでいます。寮の住所でもいいですか。",
        "gloss": {
          "en": "I live in the university dorm right now. Is the dorm address okay?",
          "ko": "지금 대학 기숙사에 살아요. 기숙사 주소도 돼요?"
        },
        "frames": [
          "ja-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "はい、大丈夫です。本は二週間で返してください。",
        "gloss": {
          "en": "Yes, that's fine. Please return the book in two weeks.",
          "ko": "네, 괜찮아요. 책은 이 주 안에 반납해 주세요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。ありがとうございます。",
        "gloss": {
          "en": "Got it. Thank you.",
          "ko": "알겠어요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking with a classmate before class",
      "ko": "수업 전에 반 친구와"
    },
    "expressions": [],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。元気ですか。",
        "gloss": {
          "en": "Good morning. How are you?",
          "ko": "좋은 아침이에요. 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "ちょっと眠いです。昨日、遅くまで勉強しました。",
        "gloss": {
          "en": "A bit sleepy. Yesterday I studied until late.",
          "ko": "좀 졸려요. 어제 늦게까지 공부했어요."
        },
        "frames": [
          "ja-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "テストの勉強ですか。",
        "gloss": {
          "en": "Studying for the test?",
          "ko": "시험 공부요?"
        }
      },
      {
        "who": "me",
        "text": "はい。もうレポートを出しましたか。",
        "gloss": {
          "en": "Yes. Have you handed in the report yet?",
          "ko": "네. 리포트 벌써 냈어요?"
        },
        "frames": [
          "ja-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "はい、もう終わりました。",
        "gloss": {
          "en": "Yes, I've already finished it.",
          "ko": "네, 벌써 끝냈어요."
        }
      },
      {
        "who": "me",
        "text": "すごいですね。あとで書き方を教えてください。",
        "gloss": {
          "en": "That's great. Please show me how to write it later.",
          "ko": "대단하네요. 이따 쓰는 법 좀 알려 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "いいですよ。昼休みに図書館で会いましょう。",
        "gloss": {
          "en": "Sure. Let's meet at the library at lunch break.",
          "ko": "좋아요. 점심시간에 도서관에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。じゃあ、昼休みに。",
        "gloss": {
          "en": "Thanks. See you at lunch break, then.",
          "ko": "고마워요. 그럼 점심시간에 봐요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Making movie plans on the phone",
      "ko": "전화로 영화 약속 잡기"
    },
    "expressions": [
      "何時にしますか"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "もしもし。今週の土曜日、映画を見に行きませんか。",
        "gloss": {
          "en": "Hello. Would you like to go see a movie this Saturday?",
          "ko": "여보세요. 이번 주 토요일에 영화 보러 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、今週の土曜日はちょっと…。",
        "gloss": {
          "en": "Sorry, this Saturday is a bit difficult…",
          "ko": "미안해요, 이번 주 토요일은 좀…"
        },
        "frames": [
          "ja-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。じゃあ、日曜日はどうですか。",
        "gloss": {
          "en": "I see. Then how about Sunday?",
          "ko": "그래요? 그럼 일요일은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "日曜日は大丈夫です。何時にしますか。",
        "gloss": {
          "en": "Sunday is fine. What time shall we make it?",
          "ko": "일요일은 괜찮아요. 몇 시로 할까요?"
        }
      },
      {
        "who": "them",
        "text": "午後二時はどうですか。",
        "gloss": {
          "en": "How about two in the afternoon?",
          "ko": "오후 두 시 어때요?"
        }
      },
      {
        "who": "me",
        "text": "じゃあ、二時にしましょう。",
        "gloss": {
          "en": "Then let's make it two o'clock.",
          "ko": "그럼 두 시로 해요."
        },
        "frames": [
          "ja-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "どこで会いますか。",
        "gloss": {
          "en": "Where shall we meet?",
          "ko": "어디서 만날까요?"
        }
      },
      {
        "who": "me",
        "text": "映画館の前で会いましょう。",
        "gloss": {
          "en": "Let's meet in front of the movie theater.",
          "ko": "영화관 앞에서 만나요."
        },
        "frames": [
          "ja-f2-05"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Feeling sick at the office",
      "ko": "회사에서 몸이 안 좋을 때"
    },
    "expressions": [
      "お疲れさまです"
    ],
    "grammar": [
      7,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうしましたか。顔色が悪いですよ。",
        "gloss": {
          "en": "What's wrong? You look pale.",
          "ko": "무슨 일이에요? 안색이 안 좋아요."
        }
      },
      {
        "who": "me",
        "text": "少しおなかが痛いです。",
        "gloss": {
          "en": "My stomach hurts a little.",
          "ko": "배가 좀 아파요."
        },
        "frames": [
          "ja-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "大丈夫ですか。今日は早く帰ってください。",
        "gloss": {
          "en": "Are you okay? Please go home early today.",
          "ko": "괜찮아요? 오늘은 일찍 들어가세요."
        }
      },
      {
        "who": "me",
        "text": "すみません。熱もあるから、先に帰ります。",
        "gloss": {
          "en": "Sorry. I have a fever too, so I'll head home first.",
          "ko": "죄송해요. 열도 있어서 먼저 들어갈게요."
        },
        "frames": [
          "ja-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "お大事に。",
        "gloss": {
          "en": "Take care of yourself.",
          "ko": "몸조리 잘해요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。この資料を課長に渡してください。",
        "gloss": {
          "en": "Thank you. Please give these documents to the section manager.",
          "ko": "고마워요. 이 자료를 과장님께 전해 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。気をつけて。",
        "gloss": {
          "en": "Will do. Take care going home.",
          "ko": "알겠어요. 조심히 가요."
        }
      },
      {
        "who": "me",
        "text": "お疲れさまです。",
        "gloss": {
          "en": "See you, thanks for everything today.",
          "ko": "수고하세요."
        }
      }
    ]
  },
  {
    "id": "ja-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Catching up with a friend after their trip",
      "ko": "여행 다녀온 친구와 오랜만에"
    },
    "expressions": [
      "久しぶりです",
      "いいですね"
    ],
    "grammar": [
      0,
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "久しぶりです。元気ですか。",
        "gloss": {
          "en": "Long time no see. How are you?",
          "ko": "오랜만이에요. 잘 지냈어요?"
        }
      },
      {
        "who": "me",
        "text": "久しぶりです。元気です。旅行はどうでしたか。",
        "gloss": {
          "en": "Long time no see. I'm good. How was your trip?",
          "ko": "오랜만이에요. 잘 지냈어요. 여행은 어땠어요?"
        },
        "frames": [
          "ja-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "とても楽しかったです。沖縄に行きました。",
        "gloss": {
          "en": "It was really fun. I went to Okinawa.",
          "ko": "정말 즐거웠어요. 오키나와에 갔어요."
        }
      },
      {
        "who": "me",
        "text": "いいですね。わたしも沖縄に行きたいです。",
        "gloss": {
          "en": "Nice. I want to go to Okinawa too.",
          "ko": "좋네요. 저도 오키나와에 가고 싶어요."
        },
        "frames": [
          "ja-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "海がとてもきれいでした。写真、見ますか。",
        "gloss": {
          "en": "The sea was beautiful. Want to see the photos?",
          "ko": "바다가 정말 예뻤어요. 사진 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "はい、見せてください。",
        "gloss": {
          "en": "Yes, please show me.",
          "ko": "네, 보여 주세요."
        },
        "frames": [
          "ja-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "これです。ホテルから見た海です。",
        "gloss": {
          "en": "Here. This is the sea from the hotel.",
          "ko": "이거예요. 호텔에서 본 바다예요."
        }
      },
      {
        "who": "me",
        "text": "すごい！ホテルの料理はどうでしたか。",
        "gloss": {
          "en": "Wow! How was the food at the hotel?",
          "ko": "대단해요! 호텔 음식은 어땠어요?"
        },
        "frames": [
          "ja-f2-15"
        ]
      }
    ]
  },
  {
    "id": "ja-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting with a taxi driver",
      "ko": "택시 기사와 이야기"
    },
    "expressions": [],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "どちらまでですか。",
        "gloss": {
          "en": "Where to?",
          "ko": "어디까지 가세요?"
        }
      },
      {
        "who": "me",
        "text": "横浜駅までお願いします。",
        "gloss": {
          "en": "To Yokohama Station, please.",
          "ko": "요코하마역까지 가 주세요."
        }
      },
      {
        "who": "them",
        "text": "はい。観光ですか。",
        "gloss": {
          "en": "Sure. Are you sightseeing?",
          "ko": "네. 관광이세요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ、横浜に住んでいます。",
        "gloss": {
          "en": "No, I live in Yokohama.",
          "ko": "아뇨, 요코하마에 살아요."
        },
        "frames": [
          "ja-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。お仕事ですか。",
        "gloss": {
          "en": "I see. Do you work here?",
          "ko": "그렇군요. 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "はい。今、日本の会社で働いています。",
        "gloss": {
          "en": "Yes. I'm working at a Japanese company now.",
          "ko": "네. 지금 일본 회사에서 일하고 있어요."
        },
        "frames": [
          "ja-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "日本語、上手ですね。",
        "gloss": {
          "en": "Your Japanese is good.",
          "ko": "일본어 잘하시네요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。運転手さんは海外に行ったことがありますか。",
        "gloss": {
          "en": "Thank you. Have you ever been abroad?",
          "ko": "감사합니다. 기사님은 해외에 가 본 적 있어요?"
        },
        "frames": [
          "ja-f2-08"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to meet a friend",
      "ko": "친구와의 약속에 늦었을 때"
    },
    "expressions": [
      "遅れてごめん",
      "確かに"
    ],
    "grammar": [
      0,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "あ、やっと来た！ずっと待ってたよ。",
        "gloss": {
          "en": "Oh, you're finally here! I've been waiting forever.",
          "ko": "아, 드디어 왔다! 계속 기다렸어."
        }
      },
      {
        "who": "me",
        "text": "遅れてごめん！電車が止まっちゃって。",
        "gloss": {
          "en": "Sorry I'm late! The train stopped.",
          "ko": "늦어서 미안! 전철이 멈춰 버려서."
        }
      },
      {
        "who": "them",
        "text": "え、そうなの？連絡くれたらよかったのに。",
        "gloss": {
          "en": "Oh really? You could have messaged me.",
          "ko": "어, 그랬어? 연락 주지 그랬어."
        }
      },
      {
        "who": "me",
        "text": "ごめん、スマホの電池が切れて、連絡できなかったんだ。",
        "gloss": {
          "en": "Sorry, my phone died, so I couldn't contact you.",
          "ko": "미안, 휴대폰 배터리가 나가서 연락을 못 했어."
        },
        "frames": [
          "ja-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "そっか。まあ、仕方ないね。",
        "gloss": {
          "en": "I see. Well, it can't be helped.",
          "ko": "그렇구나. 뭐, 어쩔 수 없지."
        }
      },
      {
        "who": "me",
        "text": "次からは充電を忘れないようにするね。",
        "gloss": {
          "en": "From now on I'll make sure not to forget to charge it.",
          "ko": "다음부터는 충전 잊지 않도록 할게."
        },
        "frames": [
          "ja-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "うん。あ、映画がもうすぐ始まるよ！",
        "gloss": {
          "en": "Okay. Oh, the movie's about to start!",
          "ko": "응. 아, 영화 곧 시작해!"
        }
      },
      {
        "who": "me",
        "text": "確かに、急がないとね。",
        "gloss": {
          "en": "True, we'd better hurry.",
          "ko": "맞다, 서둘러야겠네."
        },
        "frames": [
          "ja-f3-12"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the front desk about the air conditioner",
      "ko": "호텔 프런트에 에어컨 고장 알리기"
    },
    "expressions": [
      "実は",
      "よかったら"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、フロントです。",
        "gloss": {
          "en": "Front desk, how can I help?",
          "ko": "네, 프런트입니다."
        }
      },
      {
        "who": "me",
        "text": "すみません、五百三号室ですが、エアコンがつかないんです。",
        "gloss": {
          "en": "Excuse me, this is room five-oh-three. The air conditioner won't turn on.",
          "ko": "저기요, 오백삼 호실인데요, 에어컨이 안 켜져요."
        },
        "frames": [
          "ja-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "申し訳ございません。リモコンの電池は大丈夫ですか。",
        "gloss": {
          "en": "We're very sorry. Are the remote's batteries okay?",
          "ko": "정말 죄송합니다. 리모컨 건전지는 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "実は、さっき電池も替えてみたんです。",
        "gloss": {
          "en": "Actually, I already tried changing the batteries.",
          "ko": "실은 아까 건전지도 바꿔 봤어요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "そうですか。すぐに係の者が参ります。",
        "gloss": {
          "en": "I see. Someone will come right away.",
          "ko": "그러셨군요. 바로 담당자가 가겠습니다."
        }
      },
      {
        "who": "me",
        "text": "よかったら、毛布も持ってきてもらえますか。",
        "gloss": {
          "en": "If you don't mind, could you also bring a blanket?",
          "ko": "괜찮으시면 담요도 가져다주실 수 있어요?"
        },
        "frames": [
          "ja-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "かしこまりました。少々お待ちください。",
        "gloss": {
          "en": "Certainly. Please wait a moment.",
          "ko": "알겠습니다. 잠시만 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。助かります。",
        "gloss": {
          "en": "Thank you. That really helps.",
          "ko": "감사합니다. 정말 도움이 돼요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a teacher how to improve listening",
      "ko": "선생님께 듣기 실력 늘리는 법 묻기"
    },
    "expressions": [
      "実は",
      "とりあえず"
    ],
    "grammar": [
      2,
      5,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "今日の授業はどうでしたか。",
        "gloss": {
          "en": "How was today's class?",
          "ko": "오늘 수업은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "楽しかったです。でも、どうすれば聞き取りが上手になりますか。",
        "gloss": {
          "en": "It was fun. But what should I do to get better at listening?",
          "ko": "재미있었어요. 그런데 어떻게 하면 듣기를 잘하게 될까요?"
        },
        "frames": [
          "ja-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "毎日、少しでも日本語を聞くといいですよ。",
        "gloss": {
          "en": "It's good to listen to Japanese every day, even a little.",
          "ko": "매일 조금이라도 일본어를 들으면 좋아요."
        }
      },
      {
        "who": "me",
        "text": "実は、毎朝ニュースを聞くようにしています。",
        "gloss": {
          "en": "Actually, I try to listen to the news every morning.",
          "ko": "실은 매일 아침 뉴스를 들으려고 하고 있어요."
        },
        "frames": [
          "ja-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "すごいですね。じゃあ、ドラマも見たらどうですか。",
        "gloss": {
          "en": "That's great. Then why not watch dramas too?",
          "ko": "대단하네요. 그럼 드라마도 보면 어때요?"
        }
      },
      {
        "who": "me",
        "text": "ドラマですか。とりあえず、字幕なしで見てみます。",
        "gloss": {
          "en": "Dramas? For now, I'll try watching without subtitles.",
          "ko": "드라마요? 일단 자막 없이 봐 볼게요."
        },
        "frames": [
          "ja-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "最初は難しいけど、すぐに慣れますよ。",
        "gloss": {
          "en": "It's hard at first, but you'll get used to it quickly.",
          "ko": "처음엔 어렵지만 금방 익숙해져요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。頑張ります。",
        "gloss": {
          "en": "Thank you. I'll do my best.",
          "ko": "감사합니다. 열심히 할게요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend you passed a test",
      "ko": "친구에게 시험 합격 소식 전하기"
    },
    "expressions": [
      "ちょっと聞いてよ",
      "マジで"
    ],
    "grammar": [
      0,
      1,
      4,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうしたの？うれしそうだね。",
        "gloss": {
          "en": "What's up? You look happy.",
          "ko": "무슨 일이야? 기분 좋아 보이네."
        }
      },
      {
        "who": "me",
        "text": "ちょっと聞いてよ！日本語の試験に合格したんだ。",
        "gloss": {
          "en": "Guess what! I passed my Japanese exam.",
          "ko": "내 말 좀 들어 봐! 일본어 시험에 합격했어."
        },
        "frames": [
          "ja-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "え、本当？すごいじゃん！",
        "gloss": {
          "en": "What, really? That's amazing!",
          "ko": "어, 진짜? 대단하다!"
        }
      },
      {
        "who": "me",
        "text": "マジでうれしい。やっとニュースも少しわかるようになったよ。",
        "gloss": {
          "en": "I'm seriously happy. I can finally understand the news a little.",
          "ko": "진짜 기뻐. 드디어 뉴스도 조금 알아듣게 됐어."
        },
        "frames": [
          "ja-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "おめでとう！お祝いしなきゃね。",
        "gloss": {
          "en": "Congratulations! We have to celebrate.",
          "ko": "축하해! 축하 파티 해야겠다."
        }
      },
      {
        "who": "me",
        "text": "ありがとう。時間があったら、一緒に飲みに行こうよ。",
        "gloss": {
          "en": "Thanks. If you have time, let's go for drinks together.",
          "ko": "고마워. 시간 있으면 같이 한잔하러 가자."
        },
        "frames": [
          "ja-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "いいね。駅前の新しい居酒屋はどう？",
        "gloss": {
          "en": "Sounds good. How about the new izakaya by the station?",
          "ko": "좋아. 역 앞에 새로 생긴 이자카야 어때?"
        }
      },
      {
        "who": "me",
        "text": "あそこ、おいしそうだね。",
        "gloss": {
          "en": "That place looks good.",
          "ko": "거기 맛있어 보이더라."
        },
        "frames": [
          "ja-f3-07"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Weather chat with a neighbor in the morning",
      "ko": "아침에 이웃과 날씨 이야기"
    },
    "expressions": [
      "実は"
    ],
    "grammar": [
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。今日は曇っていますね。",
        "gloss": {
          "en": "Good morning. It's cloudy today.",
          "ko": "좋은 아침이에요. 오늘은 흐리네요."
        }
      },
      {
        "who": "me",
        "text": "そうですね。夕方から雨が降るかもしれません。",
        "gloss": {
          "en": "Yes. It might rain from the evening.",
          "ko": "그러네요. 저녁부터 비가 올지도 몰라요."
        },
        "frames": [
          "ja-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "え、本当ですか。洗濯物を外に干したままなんです。",
        "gloss": {
          "en": "Oh, really? I left my laundry hanging outside.",
          "ko": "어, 정말요? 빨래를 밖에 널어 둔 채예요."
        }
      },
      {
        "who": "me",
        "text": "早めに取り込んだほうがいいかもしれませんね。",
        "gloss": {
          "en": "It might be better to bring it in early.",
          "ko": "일찍 걷는 게 좋을지도 몰라요."
        },
        "frames": [
          "ja-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "そうします。傘は持っていますか。",
        "gloss": {
          "en": "I'll do that. Do you have an umbrella?",
          "ko": "그렇게 할게요. 우산은 갖고 계세요?"
        }
      },
      {
        "who": "me",
        "text": "実は、傘を会社に忘れたんです。",
        "gloss": {
          "en": "Actually, I left my umbrella at work.",
          "ko": "실은 우산을 회사에 두고 왔어요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "よかったら、これを使ってください。",
        "gloss": {
          "en": "If you like, please use this one.",
          "ko": "괜찮으면 이거 쓰세요."
        }
      },
      {
        "who": "me",
        "text": "いいんですか。じゃあ、明日返しますね。",
        "gloss": {
          "en": "Are you sure? Then I'll return it tomorrow.",
          "ko": "그래도 돼요? 그럼 내일 돌려드릴게요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend cancels lunch because of work",
      "ko": "친구가 일 때문에 점심 약속을 취소할 때"
    },
    "expressions": [
      "仕方ない"
    ],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ごめん、明日のランチ、行けなくなっちゃった。",
        "gloss": {
          "en": "Sorry, I can't make lunch tomorrow after all.",
          "ko": "미안, 내일 점심 못 가게 됐어."
        }
      },
      {
        "who": "me",
        "text": "え、どうしたの？",
        "gloss": {
          "en": "Oh, what happened?",
          "ko": "어, 무슨 일 있어?"
        }
      },
      {
        "who": "them",
        "text": "急に仕事が入っちゃって…。",
        "gloss": {
          "en": "Some work suddenly came up…",
          "ko": "갑자기 일이 생겨서…"
        }
      },
      {
        "who": "me",
        "text": "急な仕事なら、仕方ないね。",
        "gloss": {
          "en": "If it's sudden work, it can't be helped.",
          "ko": "갑자기 생긴 일이면 어쩔 수 없지."
        },
        "frames": [
          "ja-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "本当にごめんね。来週はどう？",
        "gloss": {
          "en": "I'm really sorry. How about next week?",
          "ko": "정말 미안해. 다음 주는 어때?"
        }
      },
      {
        "who": "me",
        "text": "来週なら大丈夫。水曜日は休みだよね？",
        "gloss": {
          "en": "Next week works. You're off on Wednesday, right?",
          "ko": "다음 주면 괜찮아. 수요일은 쉬는 날이지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うん、水曜日なら一日空いてるよ。",
        "gloss": {
          "en": "Yeah, I'm free all day Wednesday.",
          "ko": "응, 수요일이면 하루 종일 비어 있어."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、水曜日にしよう。何かあったら言ってね。",
        "gloss": {
          "en": "Then let's do Wednesday. If anything comes up, let me know.",
          "ko": "그럼 수요일로 하자. 무슨 일 있으면 말해 줘."
        },
        "frames": [
          "ja-f3-03"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a coworker to check your document",
      "ko": "동료에게 자료 확인 부탁하기"
    },
    "expressions": [
      "よかったら",
      "なるほど",
      "とりあえず"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "お疲れさまです。どうしたんですか。",
        "gloss": {
          "en": "Hi there. What's up?",
          "ko": "수고 많으세요. 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、よかったら、この資料を見てもらえますか。",
        "gloss": {
          "en": "Sorry, if you don't mind, could you look at this document?",
          "ko": "죄송한데, 괜찮으면 이 자료 좀 봐 주실 수 있어요?"
        },
        "frames": [
          "ja-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "いいですよ。…うん、ここのグラフはちょっとわかりにくいかもしれません。",
        "gloss": {
          "en": "Sure. …Hmm, this graph might be a little hard to understand.",
          "ko": "좋아요. …음, 여기 그래프가 좀 알아보기 어려울지도 몰라요."
        }
      },
      {
        "who": "me",
        "text": "なるほど。どうすればわかりやすくなりますか。",
        "gloss": {
          "en": "I see. What should I do to make it clearer?",
          "ko": "그렇군요. 어떻게 하면 알기 쉬워질까요?"
        },
        "frames": [
          "ja-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "色を二つだけにしたらいいと思いますよ。",
        "gloss": {
          "en": "I think it'd be good to use just two colors.",
          "ko": "색을 두 가지만 쓰면 좋을 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "とりあえず、色を変えてみます。",
        "gloss": {
          "en": "For now, I'll try changing the colors.",
          "ko": "일단 색을 바꿔 볼게요."
        },
        "frames": [
          "ja-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "何かあったら、また聞いてくださいね。",
        "gloss": {
          "en": "If anything comes up, just ask again.",
          "ko": "무슨 일 있으면 또 물어보세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。本当に助かります。",
        "gloss": {
          "en": "Thank you. That really helps.",
          "ko": "고마워요. 정말 도움이 돼요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about healthy habits with a colleague",
      "ko": "동료와 건강 습관 이야기"
    },
    "expressions": [
      "無理しないで"
    ],
    "grammar": [
      5,
      3,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "最近、元気そうですね。何かしているんですか。",
        "gloss": {
          "en": "You look well lately. Are you doing something?",
          "ko": "요즘 건강해 보이네요. 뭐 하는 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "はい、毎朝駅まで歩くようにしています。",
        "gloss": {
          "en": "Yes, I try to walk to the station every morning.",
          "ko": "네, 매일 아침 역까지 걸어가려고 하고 있어요."
        },
        "frames": [
          "ja-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。わたしは最近よく眠れなくて…。",
        "gloss": {
          "en": "Nice. I haven't been sleeping well lately…",
          "ko": "좋네요. 저는 요즘 잠을 잘 못 자서…"
        }
      },
      {
        "who": "me",
        "text": "寝る前にスマホを見ないほうがいいかもしれません。",
        "gloss": {
          "en": "Maybe it's better not to look at your phone before bed.",
          "ko": "자기 전에 휴대폰을 안 보는 게 좋을지도 몰라요."
        },
        "frames": [
          "ja-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "確かに、毎晩見ていますね。",
        "gloss": {
          "en": "True, I look at it every night.",
          "ko": "맞아요, 매일 밤 보고 있네요."
        }
      },
      {
        "who": "me",
        "text": "実は、わたしも前はそうだったんです。",
        "gloss": {
          "en": "Actually, I used to be like that too.",
          "ko": "실은 저도 전에는 그랬어요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "そうなんですか。じゃあ、今日からやってみます。",
        "gloss": {
          "en": "Really? Then I'll try it starting today.",
          "ko": "그래요? 그럼 오늘부터 해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "無理しないでくださいね。",
        "gloss": {
          "en": "Don't push yourself too hard.",
          "ko": "무리하지 마세요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving at a ryokan with a friend",
      "ko": "친구와 료칸에 도착해서"
    },
    "expressions": [
      "せっかくだから"
    ],
    "grammar": [
      0,
      2,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "やっと着いたね！旅館、すごくきれいだね。",
        "gloss": {
          "en": "We finally made it! The inn is so nice.",
          "ko": "드디어 도착했다! 료칸 엄청 예쁘다."
        }
      },
      {
        "who": "me",
        "text": "本当だね。夕ご飯もおいしそうだね。",
        "gloss": {
          "en": "It really is. Dinner looks good too.",
          "ko": "진짜 그러네. 저녁도 맛있어 보이네."
        },
        "frames": [
          "ja-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "夕ご飯まで時間があるけど、どうする？",
        "gloss": {
          "en": "We have time before dinner. What do you want to do?",
          "ko": "저녁까지 시간 있는데 뭐 할래?"
        }
      },
      {
        "who": "me",
        "text": "せっかくだから、近くの海を見に行きたいな。",
        "gloss": {
          "en": "Since we're here, I'd like to go see the sea nearby.",
          "ko": "모처럼 왔으니까 근처 바다 보러 가고 싶어."
        },
        "frames": [
          "ja-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "いいね。でも、雨が降りそうだよ。",
        "gloss": {
          "en": "Sounds good. But it looks like it's going to rain.",
          "ko": "좋아. 근데 비 올 것 같아."
        }
      },
      {
        "who": "me",
        "text": "フロントで傘を借りたらいいよ。たぶんあると思うよ。",
        "gloss": {
          "en": "You could borrow umbrellas at the front desk. I think they have some.",
          "ko": "프런트에서 우산 빌리면 돼. 아마 있을 거야."
        },
        "frames": [
          "ja-f3-15",
          "ja-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "そうだね。聞いてみよう。",
        "gloss": {
          "en": "Right. Let's ask.",
          "ko": "그렇네. 물어보자."
        }
      },
      {
        "who": "me",
        "text": "部屋の鍵、持ったよね？",
        "gloss": {
          "en": "You've got the room key, right?",
          "ko": "방 열쇠 챙겼지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Cheering up a friend after a bad presentation",
      "ko": "발표를 망친 친구 위로하기"
    },
    "expressions": [
      "そうなんだ",
      "確かに"
    ],
    "grammar": [
      0,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "はあ…。今日のプレゼン、全然うまくいかなかった。",
        "gloss": {
          "en": "Sigh… Today's presentation didn't go well at all.",
          "ko": "하아… 오늘 발표 완전히 망했어."
        }
      },
      {
        "who": "me",
        "text": "そうなんだ。でも、準備はたくさんしたよね？",
        "gloss": {
          "en": "Oh no. But you prepared a lot, right?",
          "ko": "그랬구나. 그래도 준비 많이 했잖아?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うん。でも、緊張して、言いたいことを忘れちゃった。",
        "gloss": {
          "en": "Yeah. But I got nervous and forgot what I wanted to say.",
          "ko": "응. 근데 긴장해서 하고 싶은 말을 잊어버렸어."
        }
      },
      {
        "who": "me",
        "text": "確かに、大勢の前だと緊張するね。",
        "gloss": {
          "en": "True, you get nervous in front of a lot of people.",
          "ko": "맞아, 사람 많은 데선 긴장되지."
        },
        "frames": [
          "ja-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "来月もまたあるんだけど、どうしよう。",
        "gloss": {
          "en": "I have another one next month. What should I do?",
          "ko": "다음 달에 또 있는데 어떡하지."
        }
      },
      {
        "who": "me",
        "text": "友だちの前で一回練習したらいいよ。わたしが聞くよ。",
        "gloss": {
          "en": "You could practice once in front of a friend. I'll listen.",
          "ko": "친구 앞에서 한 번 연습해 보면 돼. 내가 들어 줄게."
        },
        "frames": [
          "ja-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "本当？ありがとう。",
        "gloss": {
          "en": "Really? Thanks.",
          "ko": "진짜? 고마워."
        }
      },
      {
        "who": "me",
        "text": "大丈夫。次はきっとうまくいくと思うよ。",
        "gloss": {
          "en": "Don't worry. I think it'll definitely go well next time.",
          "ko": "괜찮아. 다음엔 분명 잘될 거야."
        },
        "frames": [
          "ja-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling about a missed delivery",
      "ko": "놓친 택배 때문에 전화하기"
    },
    "expressions": [
      "実は"
    ],
    "grammar": [
      1,
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、さくら運輸です。",
        "gloss": {
          "en": "Hello, Sakura Delivery.",
          "ko": "네, 사쿠라 운수입니다."
        }
      },
      {
        "who": "me",
        "text": "すみません、実は、昨日の荷物を受け取れなかったんです。",
        "gloss": {
          "en": "Excuse me, actually I couldn't receive my package yesterday.",
          "ko": "저기요, 실은 어제 택배를 못 받았어요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "不在票はお持ちですか。",
        "gloss": {
          "en": "Do you have the missed-delivery slip?",
          "ko": "부재 안내표 갖고 계세요?"
        }
      },
      {
        "who": "me",
        "text": "はい。よかったら、今日の夜に届けてもらえますか。",
        "gloss": {
          "en": "Yes. If possible, could you deliver it tonight?",
          "ko": "네. 괜찮으면 오늘 밤에 배달해 주실 수 있어요?"
        },
        "frames": [
          "ja-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "今日の夜ですね。七時から九時はいかがですか。",
        "gloss": {
          "en": "Tonight, then. How about between seven and nine?",
          "ko": "오늘 밤이요. 일곱 시부터 아홉 시는 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "八時より前だと、まだ家に帰っていないかもしれません。",
        "gloss": {
          "en": "Before eight, I might not be home yet.",
          "ko": "여덟 시 전이면 아직 집에 안 왔을지도 몰라요."
        },
        "frames": [
          "ja-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "では、八時から九時にお届けします。",
        "gloss": {
          "en": "Then we'll deliver between eight and nine.",
          "ko": "그럼 여덟 시부터 아홉 시 사이에 배달해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。よろしくお願いします。",
        "gloss": {
          "en": "Thank you. I appreciate it.",
          "ko": "감사합니다. 잘 부탁드려요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend helps you move",
      "ko": "친구가 이사를 도와줄 때"
    },
    "expressions": [
      "助かる"
    ],
    "grammar": [
      0,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "段ボール、これで全部？",
        "gloss": {
          "en": "Is this all the boxes?",
          "ko": "상자 이게 다야?"
        }
      },
      {
        "who": "me",
        "text": "うん、ありがとう。本当に助かる。",
        "gloss": {
          "en": "Yeah, thanks. You're a real help.",
          "ko": "응, 고마워. 진짜 도움 돼."
        }
      },
      {
        "who": "them",
        "text": "このテーブル、重そうだね。二人で運ぼうか。",
        "gloss": {
          "en": "This table looks heavy. Shall we carry it together?",
          "ko": "이 테이블 무거워 보인다. 둘이 옮길까?"
        }
      },
      {
        "who": "me",
        "text": "うん。重かったら言ってね。",
        "gloss": {
          "en": "Okay. If it's too heavy, let me know.",
          "ko": "응. 무거우면 말해."
        },
        "frames": [
          "ja-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "よし、これで終わり！",
        "gloss": {
          "en": "There, all done!",
          "ko": "좋아, 이걸로 끝!"
        }
      },
      {
        "who": "me",
        "text": "お疲れさま！おなかすいたよね？",
        "gloss": {
          "en": "Good work! You must be hungry, right?",
          "ko": "수고했어! 배고프지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うん、もうぺこぺこ。何食べる？",
        "gloss": {
          "en": "Yeah, I'm starving. What should we eat?",
          "ko": "응, 완전 배고파. 뭐 먹을까?"
        }
      },
      {
        "who": "me",
        "text": "駅前のラーメン屋がいいと思うよ。",
        "gloss": {
          "en": "I think the ramen place by the station would be good.",
          "ko": "역 앞 라멘집이 좋을 것 같아."
        },
        "frames": [
          "ja-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about learning guitar",
      "ko": "기타 배우는 이야기"
    },
    "expressions": [
      "そうなんだ"
    ],
    "grammar": [
      4,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "最近、ギターの練習、どう？",
        "gloss": {
          "en": "How's guitar practice going lately?",
          "ko": "요즘 기타 연습 어때?"
        }
      },
      {
        "who": "me",
        "text": "楽しいよ。やっと一曲弾けるようになったよ。",
        "gloss": {
          "en": "It's fun. I can finally play a whole song.",
          "ko": "재미있어. 드디어 한 곡 칠 수 있게 됐어."
        },
        "frames": [
          "ja-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "すごい！わたしも昔ちょっと弾いてたんだ。",
        "gloss": {
          "en": "Amazing! I used to play a little too.",
          "ko": "대단하다! 나도 예전에 조금 쳤었어."
        }
      },
      {
        "who": "me",
        "text": "そうなんだ！時間があったら、一緒に弾こうよ。",
        "gloss": {
          "en": "Really! If you have time, let's play together.",
          "ko": "그랬구나! 시간 있으면 같이 치자."
        },
        "frames": [
          "ja-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "いいね。でも、もう忘れてるかも。",
        "gloss": {
          "en": "Sounds good. But I may have forgotten it all.",
          "ko": "좋아. 근데 이제 다 잊어버렸을지도."
        }
      },
      {
        "who": "me",
        "text": "大丈夫だと思うよ。すぐ思い出すよ。",
        "gloss": {
          "en": "I think you'll be fine. It'll come back quickly.",
          "ko": "괜찮을 거야. 금방 기억날 거야."
        },
        "frames": [
          "ja-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "じゃあ、土曜日にうちに来る？",
        "gloss": {
          "en": "Then want to come over on Saturday?",
          "ko": "그럼 토요일에 우리 집 올래?"
        }
      },
      {
        "who": "me",
        "text": "うん、楽しみ！ギター持って行くね。",
        "gloss": {
          "en": "Yeah, can't wait! I'll bring my guitar.",
          "ko": "응, 기대돼! 기타 가져갈게."
        }
      }
    ]
  },
  {
    "id": "ja-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Changing your address at city hall",
      "ko": "시청에서 주소 변경하기"
    },
    "expressions": [
      "実は",
      "とりあえず"
    ],
    "grammar": [
      1,
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。今日はどうされましたか。",
        "gloss": {
          "en": "Hello. How can I help you today?",
          "ko": "안녕하세요. 오늘은 무슨 일로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "実は、先週引っ越したんです。",
        "gloss": {
          "en": "Actually, I moved last week.",
          "ko": "실은 지난주에 이사했어요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "住所の変更ですね。この紙に新しい住所を書いてください。",
        "gloss": {
          "en": "An address change, then. Please write your new address on this form.",
          "ko": "주소 변경이시군요. 이 종이에 새 주소를 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、この漢字が読めないんです。",
        "gloss": {
          "en": "Sorry, I can't read this kanji.",
          "ko": "죄송해요, 이 한자를 못 읽겠어요."
        },
        "frames": [
          "ja-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "そこは「住所」です。今住んでいるところを書いてください。",
        "gloss": {
          "en": "That says \"address\". Please write where you live now.",
          "ko": "거기는 '주소'예요. 지금 사는 곳을 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。とりあえず、書いてみます。",
        "gloss": {
          "en": "I see. For now, I'll try filling it in.",
          "ko": "알겠어요. 일단 써 볼게요."
        },
        "frames": [
          "ja-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "書けたら、あちらで番号の紙を取って待ってください。",
        "gloss": {
          "en": "When you're done, take a number over there and wait.",
          "ko": "다 쓰면 저쪽에서 번호표를 뽑고 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。わからなかったら、また聞きます。",
        "gloss": {
          "en": "Thank you. If I get stuck, I'll ask again.",
          "ko": "감사합니다. 모르면 또 물어볼게요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Clothes shopping with a friend",
      "ko": "친구와 옷 쇼핑"
    },
    "expressions": [
      "確かに",
      "せっかくだから"
    ],
    "grammar": [
      6,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "このコート、どう？",
        "gloss": {
          "en": "What do you think of this coat?",
          "ko": "이 코트 어때?"
        }
      },
      {
        "who": "me",
        "text": "いいね。暖かそうだね。",
        "gloss": {
          "en": "Nice. It looks warm.",
          "ko": "좋다. 따뜻해 보여."
        },
        "frames": [
          "ja-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "でも、ちょっと高いんだよね。",
        "gloss": {
          "en": "But it's a bit expensive.",
          "ko": "근데 좀 비싸."
        }
      },
      {
        "who": "me",
        "text": "確かに、二万円は高いね。",
        "gloss": {
          "en": "True, twenty thousand yen is a lot.",
          "ko": "맞아, 이만 엔은 비싸네."
        },
        "frames": [
          "ja-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "どうしよう。",
        "gloss": {
          "en": "What should I do?",
          "ko": "어떡하지."
        }
      },
      {
        "who": "me",
        "text": "セールまで待ったらいいよ。来週から始まると思うよ。",
        "gloss": {
          "en": "You could wait for the sale. I think it starts next week.",
          "ko": "세일까지 기다리면 돼. 다음 주부터 시작할 거야."
        },
        "frames": [
          "ja-f3-15",
          "ja-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "そうだね。じゃあ、今日は見るだけにする。",
        "gloss": {
          "en": "You're right. Then I'll just look today.",
          "ko": "그렇네. 그럼 오늘은 구경만 할래."
        }
      },
      {
        "who": "me",
        "text": "せっかくだから、上の階のカフェにも行きたいな。",
        "gloss": {
          "en": "Since we're here, I'd like to go to the café upstairs too.",
          "ko": "모처럼 왔으니까 위층 카페에도 가고 싶어."
        },
        "frames": [
          "ja-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Missing a meeting at work",
      "ko": "회사 회의에 빠졌을 때"
    },
    "expressions": [
      "どうしよう",
      "やっぱり",
      "マジで",
      "助かる"
    ],
    "grammar": [
      0,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "さっきの会議、どうしたの？来なかったよね。",
        "gloss": {
          "en": "What happened at the meeting earlier? You didn't come.",
          "ko": "아까 회의 어떻게 된 거야? 안 왔잖아."
        }
      },
      {
        "who": "me",
        "text": "ごめん、時間を間違えて、行けなかったんだ。",
        "gloss": {
          "en": "Sorry, I got the time wrong and couldn't make it.",
          "ko": "미안, 시간을 착각해서 못 갔어."
        },
        "frames": [
          "ja-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "そうだったんだ。部長が探してたよ。",
        "gloss": {
          "en": "Oh, I see. The manager was looking for you.",
          "ko": "그랬구나. 부장님이 찾으셨어."
        }
      },
      {
        "who": "me",
        "text": "どうしよう。やっぱり怒ってたよね？",
        "gloss": {
          "en": "What should I do? He was angry after all, right?",
          "ko": "어떡하지. 역시 화나셨지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うーん、ちょっとね。でも、ちゃんと話したら大丈夫だと思うよ。",
        "gloss": {
          "en": "Hmm, a little. But I think if you explain properly, it'll be fine.",
          "ko": "음, 조금. 근데 제대로 말씀드리면 괜찮을 거야."
        }
      },
      {
        "who": "me",
        "text": "そうだね。次からはカレンダーをちゃんと見るようにするね。",
        "gloss": {
          "en": "You're right. From now on I'll make sure to check my calendar.",
          "ko": "그렇네. 다음부터는 캘린더를 꼭 확인하도록 할게."
        },
        "frames": [
          "ja-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "うん。会議のメモ、送ろうか？",
        "gloss": {
          "en": "Okay. Shall I send you the meeting notes?",
          "ko": "응. 회의 메모 보내 줄까?"
        }
      },
      {
        "who": "me",
        "text": "マジで？助かる。ありがとう。",
        "gloss": {
          "en": "Seriously? That helps a lot. Thanks.",
          "ko": "진짜? 도움 돼. 고마워."
        }
      }
    ]
  },
  {
    "id": "ja-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a hike on the phone",
      "ko": "전화로 등산 계획 세우기"
    },
    "expressions": [
      "助かる"
    ],
    "grammar": [
      3,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "もしもし。土曜日の山登り、晴れるかな。",
        "gloss": {
          "en": "Hello. Do you think it'll be sunny for Saturday's hike?",
          "ko": "여보세요. 토요일 등산 날씨 맑을까?"
        }
      },
      {
        "who": "me",
        "text": "天気予報だと、晴れると思うよ。",
        "gloss": {
          "en": "According to the forecast, I think it'll be sunny.",
          "ko": "일기예보 보니까 맑을 것 같아."
        },
        "frames": [
          "ja-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "よかった。朝は何時に出る？",
        "gloss": {
          "en": "Great. What time do we leave in the morning?",
          "ko": "다행이다. 아침에 몇 시에 나가?"
        }
      },
      {
        "who": "me",
        "text": "六時に駅に集合だよね？",
        "gloss": {
          "en": "We're meeting at the station at six, right?",
          "ko": "여섯 시에 역에서 모이는 거지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うん。お弁当はどうする？",
        "gloss": {
          "en": "Yeah. What about lunch boxes?",
          "ko": "응. 도시락은 어떻게 할까?"
        }
      },
      {
        "who": "me",
        "text": "わたしが作るよ。苦手な物があったら言ってね。",
        "gloss": {
          "en": "I'll make them. If there's anything you don't like, let me know.",
          "ko": "내가 만들게. 싫어하는 거 있으면 말해."
        },
        "frames": [
          "ja-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "ありがとう。じゃあ、飲み物はわたしが買っていくね。",
        "gloss": {
          "en": "Thanks. Then I'll buy the drinks.",
          "ko": "고마워. 그럼 음료는 내가 사 갈게."
        }
      },
      {
        "who": "me",
        "text": "助かる。楽しみだね。",
        "gloss": {
          "en": "That helps. Can't wait.",
          "ko": "도움 돼. 기대된다."
        }
      }
    ]
  },
  {
    "id": "ja-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Trying out a university tennis club",
      "ko": "대학 테니스부 체험"
    },
    "expressions": [
      "実は",
      "とりあえず"
    ],
    "grammar": [
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。テニス部の体験に来たんですか。",
        "gloss": {
          "en": "Hello. Did you come to try out the tennis club?",
          "ko": "안녕하세요. 테니스부 체험하러 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "はい。実は、テニスは初めてなんです。",
        "gloss": {
          "en": "Yes. Actually, it's my first time playing tennis.",
          "ko": "네. 실은 테니스는 처음이에요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "大丈夫ですよ。初めての人も多いです。",
        "gloss": {
          "en": "That's fine. Lots of people are beginners.",
          "ko": "괜찮아요. 처음인 사람도 많아요."
        }
      },
      {
        "who": "me",
        "text": "よかった。とりあえず、ボールを打ってみます。",
        "gloss": {
          "en": "Good. For now, I'll try hitting the ball.",
          "ko": "다행이다. 일단 공을 쳐 볼게요."
        },
        "frames": [
          "ja-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "いいですね。…上手ですよ！",
        "gloss": {
          "en": "Great. …You're good!",
          "ko": "좋아요. …잘하시네요!"
        }
      },
      {
        "who": "me",
        "text": "本当ですか。毎週来たら、上手になるかもしれません。",
        "gloss": {
          "en": "Really? If I come every week, I might get good.",
          "ko": "정말요? 매주 오면 잘하게 될지도 모르겠어요."
        },
        "frames": [
          "ja-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ぜひ来てください。",
        "gloss": {
          "en": "Please do come.",
          "ko": "꼭 오세요."
        }
      },
      {
        "who": "me",
        "text": "はい、また来ます。よろしくお願いします。",
        "gloss": {
          "en": "Yes, I'll come again. Thanks for having me.",
          "ko": "네, 또 올게요. 잘 부탁드려요."
        }
      }
    ]
  },
  {
    "id": "ja-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Visiting a friend who baked a cake",
      "ko": "케이크를 구운 친구 집에 놀러 가서"
    },
    "expressions": [
      "そうなんだ"
    ],
    "grammar": [
      3,
      6,
      7,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃい！ちょうどケーキが焼けたところ。",
        "gloss": {
          "en": "Welcome! The cake just came out of the oven.",
          "ko": "어서 와! 마침 케이크가 다 구워졌어."
        }
      },
      {
        "who": "me",
        "text": "わあ、いいにおい。おいしそうだね。",
        "gloss": {
          "en": "Wow, it smells great. It looks delicious.",
          "ko": "와, 좋은 냄새. 맛있어 보인다."
        },
        "frames": [
          "ja-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "初めて作ったんだ。うまくできたかな。",
        "gloss": {
          "en": "It's my first time making one. I hope it turned out okay.",
          "ko": "처음 만들어 본 거야. 잘 됐으려나."
        }
      },
      {
        "who": "me",
        "text": "すごくきれいだし、おいしいと思うよ。",
        "gloss": {
          "en": "It looks really nice, and I think it'll taste good.",
          "ko": "엄청 예쁘고 맛있을 것 같아."
        },
        "frames": [
          "ja-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "食べてみて。…どう？",
        "gloss": {
          "en": "Try some. …How is it?",
          "ko": "먹어 봐. …어때?"
        }
      },
      {
        "who": "me",
        "text": "おいしい！これ、本当に初めて作ったんだよね？",
        "gloss": {
          "en": "Delicious! You really made this for the first time, right?",
          "ko": "맛있어! 이거 진짜 처음 만든 거 맞지?"
        },
        "frames": [
          "ja-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "うん、動画を見ながら作ったんだ。",
        "gloss": {
          "en": "Yeah, I made it while watching a video.",
          "ko": "응, 영상 보면서 만들었어."
        }
      },
      {
        "who": "me",
        "text": "そうなんだ。時間があったら、一緒に作ろうよ。",
        "gloss": {
          "en": "I see. If you have time, let's make one together.",
          "ko": "그렇구나. 시간 있으면 같이 만들자."
        },
        "frames": [
          "ja-f3-18"
        ]
      }
    ]
  },
  {
    "id": "ja-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the lost-and-found center",
      "ko": "분실물 센터에 전화하기"
    },
    "expressions": [
      "実は",
      "よかったら"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、駅の忘れ物センターです。",
        "gloss": {
          "en": "Hello, station lost-and-found center.",
          "ko": "네, 역 분실물 센터입니다."
        }
      },
      {
        "who": "me",
        "text": "すみません、かばんが見つからないんです。",
        "gloss": {
          "en": "Excuse me, I can't find my bag.",
          "ko": "저기요, 가방을 못 찾겠어요."
        },
        "frames": [
          "ja-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "どの電車に乗りましたか。",
        "gloss": {
          "en": "Which train did you take?",
          "ko": "어느 전철을 타셨어요?"
        }
      },
      {
        "who": "me",
        "text": "実は、よく覚えていないんです。たぶん八時ごろの電車です。",
        "gloss": {
          "en": "Actually, I don't remember well. Probably a train around eight.",
          "ko": "실은 잘 기억이 안 나요. 아마 여덟 시쯤 전철이에요."
        },
        "frames": [
          "ja-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "かばんは何色ですか。",
        "gloss": {
          "en": "What color is the bag?",
          "ko": "가방은 무슨 색이에요?"
        }
      },
      {
        "who": "me",
        "text": "黒いリュックです。よかったら、ほかの駅にも聞いてもらえますか。",
        "gloss": {
          "en": "It's a black backpack. If possible, could you ask other stations too?",
          "ko": "검은 백팩이에요. 괜찮으면 다른 역에도 물어봐 주실 수 있어요?"
        },
        "frames": [
          "ja-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "わかりました。調べてみますね。",
        "gloss": {
          "en": "Understood. I'll look into it.",
          "ko": "알겠습니다. 알아볼게요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。明日、もう一度電話するかもしれません。",
        "gloss": {
          "en": "Thank you. I might call again tomorrow.",
          "ko": "감사합니다. 내일 한 번 더 전화할지도 몰라요."
        },
        "frames": [
          "ja-f3-06"
        ]
      }
    ]
  }
];
