import type { StageScript } from "../../stageScripts.ts";

/**
 * th 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const TH_BANK: StageScript[] = [
  {
    "id": "th-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a market stall",
      "ko": "시장 과일 가게에서"
    },
    "expressions": [
      "ขอบคุณ",
      "เท่าไร"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ จะซื้ออะไรคะ",
        "gloss": {
          "en": "Hello, what would you like?",
          "ko": "안녕하세요, 뭐 사시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "มีมังคุดไหมครับ",
        "gloss": {
          "en": "Do you have mangosteens?",
          "ko": "망고스틴 있어요?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "มีค่ะ วันนี้หวานมากค่ะ",
        "gloss": {
          "en": "Yes, they're very sweet today.",
          "ko": "있어요. 오늘 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "กิโลละเท่าไรครับ",
        "gloss": {
          "en": "How much per kilo?",
          "ko": "일 킬로에 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "กิโลละหกสิบบาทค่ะ",
        "gloss": {
          "en": "Sixty baht a kilo.",
          "ko": "일 킬로에 육십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "เอาสองกิโลครับ",
        "gloss": {
          "en": "I'll take two kilos.",
          "ko": "이 킬로 주세요."
        },
        "frames": [
          "th-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ทั้งหมดหนึ่งร้อยยี่สิบบาทค่ะ",
        "gloss": {
          "en": "Sure. That's one hundred twenty baht in total.",
          "ko": "네, 전부 백이십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ขอบคุณครับ",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b02",
    "name": {
      "text": [
        "มินจุน"
      ],
      "en": [
        "Min-jun"
      ],
      "ko": [
        "민준"
      ]
    },
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "สวัสดี"
    ],
    "grammar": [
      1,
      2,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ ยินดีต้อนรับค่ะ",
        "gloss": {
          "en": "Hello, welcome.",
          "ko": "안녕하세요, 어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมจองห้องไว้ครับ",
        "gloss": {
          "en": "Hello, I have a reservation.",
          "ko": "안녕하세요, 방을 예약했어요."
        },
        "frames": [
          "th-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "ชื่ออะไรคะ",
        "gloss": {
          "en": "What's the name?",
          "ko": "성함이 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมชื่อมินจุนครับ",
        "gloss": {
          "en": "My name is Min-jun.",
          "ko": "제 이름은 민준이에요."
        },
        "frames": [
          "th-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "ค่ะ ห้องสามร้อยห้าค่ะ",
        "gloss": {
          "en": "Okay, room three-oh-five.",
          "ko": "네, 삼백오 호실이에요."
        }
      },
      {
        "who": "me",
        "text": "ขอรหัสไวไฟครับ",
        "gloss": {
          "en": "Can I have the Wi-Fi password?",
          "ko": "와이파이 비밀번호 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "นี่ค่ะ อาหารเช้าเจ็ดโมงนะคะ",
        "gloss": {
          "en": "Here it is. Breakfast is at seven.",
          "ko": "여기요. 아침 식사는 일곱 시예요."
        }
      },
      {
        "who": "me",
        "text": "ห้องอาหารอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Where is the dining room?",
          "ko": "식당은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      }
    ]
  },
  {
    "id": "th-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for the restroom in a mall",
      "ko": "쇼핑몰에서 화장실 찾기"
    },
    "expressions": [
      "ขอบคุณ",
      "ขอโทษ",
      "ห้องน้ำอยู่ที่ไหน",
      "ไม่เข้าใจ",
      "พูดช้าๆ หน่อย"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีครับ มีอะไรให้ช่วยไหมครับ",
        "gloss": {
          "en": "Hello, can I help you?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ ห้องน้ำอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Excuse me, where is the restroom?",
          "ko": "실례합니다, 화장실이 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "อยู่ชั้นสองครับ ข้างร้านกาแฟครับ",
        "gloss": {
          "en": "It's on the second floor, next to the coffee shop.",
          "ko": "이 층에 있어요. 카페 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่เข้าใจคำนี้ครับ พูดช้าๆ หน่อยได้ไหมครับ",
        "gloss": {
          "en": "I don't understand that word. Could you speak slowly?",
          "ko": "그 단어를 모르겠어요. 천천히 말해 주실 수 있어요?"
        },
        "frames": [
          "th-f1-11",
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ชั้นสอง ใกล้ร้านกาแฟครับ",
        "gloss": {
          "en": "Sure. Second floor, near the coffee shop.",
          "ko": "네. 이 층, 카페 근처요."
        }
      },
      {
        "who": "me",
        "text": "ลิฟต์อยู่ที่ไหนครับ",
        "gloss": {
          "en": "Where is the elevator?",
          "ko": "엘리베이터는 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "ตรงนั้นครับ",
        "gloss": {
          "en": "Over there.",
          "ko": "저기요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a street food stall",
      "ko": "길거리 음식 노점에서"
    },
    "expressions": [],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "กินอะไรดีคะ",
        "gloss": {
          "en": "What would you like to eat?",
          "ko": "뭐 드실래요?"
        }
      },
      {
        "who": "me",
        "text": "อันนี้คืออะไรครับ",
        "gloss": {
          "en": "What is this?",
          "ko": "이건 뭐예요?"
        },
        "frames": [
          "th-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "ส้มตำค่ะ อร่อยนะคะ",
        "gloss": {
          "en": "It's papaya salad. It's good.",
          "ko": "쏨땀이에요. 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "เผ็ดไหมครับ",
        "gloss": {
          "en": "Is it spicy?",
          "ko": "매워요?"
        }
      },
      {
        "who": "them",
        "text": "เผ็ดนิดหน่อยค่ะ",
        "gloss": {
          "en": "A little spicy.",
          "ko": "조금 매워요."
        }
      },
      {
        "who": "me",
        "text": "ไม่ใส่พริกได้ไหมครับ",
        "gloss": {
          "en": "Could you leave out the chili?",
          "ko": "고추 빼 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ",
        "gloss": {
          "en": "Sure.",
          "ko": "네, 돼요."
        }
      },
      {
        "who": "me",
        "text": "เอาหนึ่งจานครับ",
        "gloss": {
          "en": "I'll take one plate.",
          "ko": "한 접시 주세요."
        },
        "frames": [
          "th-f1-13"
        ]
      }
    ]
  },
  {
    "id": "th-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a new neighbor in the lobby",
      "ko": "로비에서 새 이웃과 인사"
    },
    "expressions": [
      "สวัสดี",
      "ยินดีที่ได้รู้จัก"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ มาใหม่เหรอคะ",
        "gloss": {
          "en": "Hello, are you new here?",
          "ko": "안녕하세요, 새로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมอยู่ที่ห้องสิบสองครับ",
        "gloss": {
          "en": "Hello, I'm in room twelve.",
          "ko": "안녕하세요, 저는 십이 호에 살아요."
        },
        "frames": [
          "th-f1-15",
          "th-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ยินดีที่ได้รู้จักค่ะ มาจากไหนคะ",
        "gloss": {
          "en": "Nice to meet you. Where are you from?",
          "ko": "반가워요. 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาจากเกาหลีครับ",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        },
        "frames": [
          "th-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "มาทำอะไรที่นี่คะ",
        "gloss": {
          "en": "What do you do here?",
          "ko": "여기서 무슨 일 하세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมเป็นครูสอนภาษาอังกฤษครับ",
        "gloss": {
          "en": "I'm an English teacher.",
          "ko": "저는 영어 선생님이에요."
        },
        "frames": [
          "th-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "ดีจังเลยค่ะ",
        "gloss": {
          "en": "That's great.",
          "ko": "멋지네요."
        }
      },
      {
        "who": "me",
        "text": "ยินดีที่ได้รู้จักครับ",
        "gloss": {
          "en": "Nice to meet you.",
          "ko": "만나서 반가워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call to find a friend's restaurant",
      "ko": "전화로 친구가 있는 식당 찾기"
    },
    "expressions": [
      "ขอโทษ",
      "ชื่ออะไร",
      "อีกครั้ง",
      "เดี๋ยวนะ",
      "โอเค"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล ตอนนี้อยู่ที่ไหน",
        "gloss": {
          "en": "Hello, where are you now?",
          "ko": "여보세요, 지금 어디야?"
        }
      },
      {
        "who": "me",
        "text": "ผมอยู่ที่สถานีอโศกครับ",
        "gloss": {
          "en": "I'm at Asok station.",
          "ko": "저는 아속역에 있어요."
        },
        "frames": [
          "th-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ดีเลย ร้านอยู่ใกล้มาก",
        "gloss": {
          "en": "Great, the restaurant is very close.",
          "ko": "잘됐다, 식당 아주 가까워."
        }
      },
      {
        "who": "me",
        "text": "ร้านชื่ออะไรครับ",
        "gloss": {
          "en": "What's the restaurant called?",
          "ko": "식당 이름이 뭐예요?"
        },
        "frames": [
          "th-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "ร้านบ้านส้มตำ อยู่ข้างธนาคาร",
        "gloss": {
          "en": "Baan Somtam, next to the bank.",
          "ko": "반쏨땀이야. 은행 옆에 있어."
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ พูดอีกครั้งได้ไหมครับ",
        "gloss": {
          "en": "Sorry, could you say that again?",
          "ko": "죄송한데, 다시 한 번 말해 줄 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "บ้าน ส้ม ตำ ข้างธนาคาร",
        "gloss": {
          "en": "Baan. Som. Tam. Next to the bank.",
          "ko": "반. 쏨. 땀. 은행 옆."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เดี๋ยวนะครับ",
        "gloss": {
          "en": "Okay. Wait a moment.",
          "ko": "알겠어요. 잠깐만요."
        }
      }
    ]
  },
  {
    "id": "th-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying cough medicine at a pharmacy",
      "ko": "약국에서 기침약 사기"
    },
    "expressions": [
      "ขอบคุณ",
      "เท่าไร",
      "เอาอันนี้"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ เป็นอะไรคะ",
        "gloss": {
          "en": "Hello, what's wrong?",
          "ko": "안녕하세요, 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "มียาแก้ไอไหมครับ",
        "gloss": {
          "en": "Do you have cough medicine?",
          "ko": "기침약 있어요?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "มีค่ะ ไอมากไหมคะ",
        "gloss": {
          "en": "Yes. Is your cough bad?",
          "ko": "있어요. 기침이 심해요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่มากครับ",
        "gloss": {
          "en": "Not too bad.",
          "ko": "심하지 않아요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "งั้นอันนี้ค่ะ กินวันละสามครั้งนะคะ",
        "gloss": {
          "en": "Then this one. Take it three times a day.",
          "ko": "그럼 이거예요. 하루 세 번 드세요."
        }
      },
      {
        "who": "me",
        "text": "อันนี้เท่าไรครับ",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "แปดสิบบาทค่ะ",
        "gloss": {
          "en": "Eighty baht.",
          "ko": "팔십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "เอาอันนี้ครับ ขอบคุณครับ",
        "gloss": {
          "en": "I'll take this one. Thank you.",
          "ko": "이걸로 할게요. 고마워요."
        },
        "frames": [
          "th-f1-13"
        ]
      }
    ]
  },
  {
    "id": "th-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Leaving a friend's home after dinner",
      "ko": "친구 집에서 저녁 먹고 나오기"
    },
    "expressions": [
      "ขอบคุณ",
      "ลาก่อน"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "อิ่มไหมคะ",
        "gloss": {
          "en": "Are you full?",
          "ko": "배불러요?"
        }
      },
      {
        "who": "me",
        "text": "อิ่มมากครับ อร่อยมากครับ",
        "gloss": {
          "en": "Very full. It was delicious.",
          "ko": "아주 배불러요. 정말 맛있었어요."
        }
      },
      {
        "who": "them",
        "text": "ดีใจจังค่ะ จะกลับแล้วเหรอคะ",
        "gloss": {
          "en": "I'm glad. Are you leaving already?",
          "ko": "다행이에요. 벌써 가요?"
        }
      },
      {
        "who": "me",
        "text": "ครับ ขอบคุณสำหรับอาหารเย็นครับ",
        "gloss": {
          "en": "Yes. Thank you for dinner.",
          "ko": "네. 저녁 고마워요."
        },
        "frames": [
          "th-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "ไม่เป็นไรค่ะ กลับยังไงคะ",
        "gloss": {
          "en": "You're welcome. How are you getting home?",
          "ko": "별말씀을요. 어떻게 가요?"
        }
      },
      {
        "who": "me",
        "text": "ป้ายรถเมล์อยู่ที่ไหนครับ",
        "gloss": {
          "en": "Where is the bus stop?",
          "ko": "버스 정류장은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "หน้าซอยค่ะ เดินไปห้านาทีค่ะ",
        "gloss": {
          "en": "At the end of the street. It's a five-minute walk.",
          "ko": "골목 입구에 있어요. 걸어서 오 분이에요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณสำหรับทุกอย่างครับ ลาก่อนครับ",
        "gloss": {
          "en": "Thank you for everything. Goodbye.",
          "ko": "여러모로 고마워요. 안녕히 계세요."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying an eraser at a stationery shop",
      "ko": "문구점에서 지우개 사기"
    },
    "expressions": [
      "ขอบคุณ",
      "ชื่ออะไร"
    ],
    "grammar": [
      1,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีครับ หาอะไรครับ",
        "gloss": {
          "en": "Hello, what are you looking for?",
          "ko": "안녕하세요, 뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "อันนี้ภาษาไทยชื่ออะไรครับ",
        "gloss": {
          "en": "What is this called in Thai?",
          "ko": "이건 태국어로 뭐라고 해요?"
        },
        "frames": [
          "th-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "เรียกว่ายางลบครับ",
        "gloss": {
          "en": "It's called yang-lop.",
          "ko": "양롭이라고 해요."
        }
      },
      {
        "who": "me",
        "text": "มียางลบสีขาวไหมครับ",
        "gloss": {
          "en": "Do you have a white eraser?",
          "ko": "흰 지우개 있어요?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "มีครับ อันละสิบบาทครับ",
        "gloss": {
          "en": "Yes, ten baht each.",
          "ko": "있어요. 하나에 십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "ขอสองอันครับ",
        "gloss": {
          "en": "Two, please.",
          "ko": "두 개 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "ยี่สิบบาทครับ",
        "gloss": {
          "en": "Twenty baht.",
          "ko": "이십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ขอบคุณครับ",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering iced coffee at a café",
      "ko": "카페에서 아이스커피 주문"
    },
    "expressions": [
      "ขอบคุณ",
      "เท่าไร"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "รับอะไรดีคะ",
        "gloss": {
          "en": "What can I get you?",
          "ko": "뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอกาแฟเย็นหนึ่งแก้วครับ",
        "gloss": {
          "en": "One iced coffee, please.",
          "ko": "아이스커피 한 잔 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "หวานปกติไหมคะ",
        "gloss": {
          "en": "Regular sweetness?",
          "ko": "단맛은 보통으로 할까요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่หวานครับ",
        "gloss": {
          "en": "No sugar, please.",
          "ko": "달지 않게 해 주세요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ทานที่นี่หรือกลับบ้านคะ",
        "gloss": {
          "en": "Sure. For here or to go?",
          "ko": "네. 드시고 가세요, 가져가세요?"
        }
      },
      {
        "who": "me",
        "text": "กลับบ้านครับ ทั้งหมดเท่าไรครับ",
        "gloss": {
          "en": "To go. How much is it all?",
          "ko": "가져갈게요. 전부 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "ห้าสิบห้าบาทค่ะ",
        "gloss": {
          "en": "Fifty-five baht.",
          "ko": "오십오 바트예요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ขอบคุณครับ",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a Thai school",
      "ko": "태국 학교 첫날"
    },
    "expressions": [
      "ขอบคุณ",
      "ยินดีที่ได้รู้จัก",
      "ใช่"
    ],
    "grammar": [
      0,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีครับ เป็นนักเรียนใหม่ใช่ไหมครับ",
        "gloss": {
          "en": "Hi, are you a new student?",
          "ko": "안녕하세요, 새로 온 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ผมเป็นนักเรียนแลกเปลี่ยนครับ",
        "gloss": {
          "en": "Yes, I'm an exchange student.",
          "ko": "네, 저는 교환학생이에요."
        },
        "frames": [
          "th-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "มาจากไหนครับ",
        "gloss": {
          "en": "Where are you from?",
          "ko": "어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาจากโซลครับ",
        "gloss": {
          "en": "I'm from Seoul.",
          "ko": "저는 서울에서 왔어요."
        },
        "frames": [
          "th-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "ห้องเรียนของเราอยู่ชั้นสามนะครับ",
        "gloss": {
          "en": "Our classroom is on the third floor.",
          "ko": "우리 교실은 삼 층이에요."
        }
      },
      {
        "who": "me",
        "text": "ห้องสมุดอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Where is the library?",
          "ko": "도서관은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "อยู่ตึกข้างๆ ครับ",
        "gloss": {
          "en": "It's in the building next door.",
          "ko": "옆 건물에 있어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ยินดีที่ได้รู้จักครับ",
        "gloss": {
          "en": "Thank you. Nice to meet you.",
          "ko": "고마워요. 만나서 반가워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Taking a taxi",
      "ko": "택시 타기"
    },
    "expressions": [
      "เท่าไร"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไปไหนครับ",
        "gloss": {
          "en": "Where to?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "ไปสยามได้ไหมครับ",
        "gloss": {
          "en": "Can you go to Siam?",
          "ko": "시암에 가 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ขึ้นมาเลยครับ",
        "gloss": {
          "en": "Sure, get in.",
          "ko": "네, 타세요."
        }
      },
      {
        "who": "me",
        "text": "เปิดมิเตอร์ได้ไหมครับ",
        "gloss": {
          "en": "Could you turn on the meter?",
          "ko": "미터기 켜 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ถึงแล้วครับ",
        "gloss": {
          "en": "Sure. ... We're here.",
          "ko": "네. ... 다 왔어요."
        }
      },
      {
        "who": "me",
        "text": "ทั้งหมดเท่าไรครับ",
        "gloss": {
          "en": "How much is it?",
          "ko": "전부 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "หนึ่งร้อยยี่สิบบาทครับ",
        "gloss": {
          "en": "One hundred twenty baht.",
          "ko": "백이십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ไม่ต้องทอนครับ",
        "gloss": {
          "en": "Here you go. Keep the change.",
          "ko": "여기요. 거스름돈은 괜찮아요."
        },
        "frames": [
          "th-f1-10"
        ]
      }
    ]
  },
  {
    "id": "th-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Finding a lost bag at the station office",
      "ko": "역 사무실에서 잃어버린 가방 찾기"
    },
    "expressions": [
      "สวัสดี",
      "ขอบคุณ",
      "ใช่"
    ],
    "grammar": [
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "มีอะไรให้ช่วยคะ",
        "gloss": {
          "en": "How can I help you?",
          "ko": "뭘 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมหากระเป๋าครับ",
        "gloss": {
          "en": "Hello, I'm looking for my bag.",
          "ko": "안녕하세요, 가방을 찾고 있어요."
        },
        "frames": [
          "th-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "กระเป๋าสีอะไรคะ",
        "gloss": {
          "en": "What color is the bag?",
          "ko": "가방이 무슨 색이에요?"
        }
      },
      {
        "who": "me",
        "text": "สีดำครับ ไม่ใหญ่ครับ",
        "gloss": {
          "en": "It's black. It's not big.",
          "ko": "검은색이에요. 크지 않아요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "อันนี้ใช่ไหมคะ",
        "gloss": {
          "en": "Is this the one?",
          "ko": "이거 맞아요?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ขอบคุณสำหรับความช่วยเหลือครับ",
        "gloss": {
          "en": "Yes! Thank you for your help.",
          "ko": "네, 맞아요! 도와주셔서 고마워요."
        },
        "frames": [
          "th-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "ไม่เป็นไรค่ะ เซ็นชื่อตรงนี้นะคะ",
        "gloss": {
          "en": "No problem. Please sign here.",
          "ko": "괜찮아요. 여기에 서명해 주세요."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ปากกาอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Sure. Where is a pen?",
          "ko": "네. 펜은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      }
    ]
  },
  {
    "id": "th-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Visiting a temple with a Thai friend",
      "ko": "태국 친구와 사원 구경"
    },
    "expressions": [
      "ขอบคุณ",
      "ใช่",
      "ไม่เข้าใจ",
      "โอเค"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ที่นี่คือวัดโพธิ์นะ",
        "gloss": {
          "en": "This is Wat Pho.",
          "ko": "여기가 왓포야."
        }
      },
      {
        "who": "me",
        "text": "สวยมากครับ อันนั้นคืออะไรครับ",
        "gloss": {
          "en": "It's beautiful. What is that?",
          "ko": "정말 예뻐요. 저건 뭐예요?"
        },
        "frames": [
          "th-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "พระนอนครับ ใหญ่มากใช่ไหม",
        "gloss": {
          "en": "The Reclining Buddha. Huge, isn't it?",
          "ko": "와불이야. 엄청 크지?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ถ่ายรูปได้ไหมครับ",
        "gloss": {
          "en": "Yes. Can I take photos?",
          "ko": "네. 사진 찍어도 돼요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ แต่ห้ามใช้แฟลชนะ",
        "gloss": {
          "en": "Yes, but no flash.",
          "ko": "돼. 그런데 플래시는 금지야."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่เข้าใจคำว่าห้ามครับ",
        "gloss": {
          "en": "I don't understand the word 'ham'.",
          "ko": "'함'이라는 말을 모르겠어요."
        },
        "frames": [
          "th-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "ห้าม แปลว่า ทำไม่ได้",
        "gloss": {
          "en": "'Ham' means you can't do it.",
          "ko": "'함'은 하면 안 된다는 뜻이야."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ขอบคุณครับ",
        "gloss": {
          "en": "Okay. Thanks.",
          "ko": "알겠어요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Bargaining for a shirt at a market",
      "ko": "시장에서 셔츠 값 흥정하기"
    },
    "expressions": [
      "เท่าไร",
      "แพงไป",
      "ลดได้ไหม",
      "โอเค"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "เสื้อตัวนี้สวยนะคะ",
        "gloss": {
          "en": "This shirt is nice.",
          "ko": "이 셔츠 예쁘죠."
        }
      },
      {
        "who": "me",
        "text": "ตัวนี้เท่าไรครับ",
        "gloss": {
          "en": "How much is this one?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "สามร้อยบาทค่ะ",
        "gloss": {
          "en": "Three hundred baht.",
          "ko": "삼백 바트예요."
        }
      },
      {
        "who": "me",
        "text": "แพงไปครับ ลดได้ไหมครับ",
        "gloss": {
          "en": "That's too expensive. Can you lower it?",
          "ko": "너무 비싸요. 깎아 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "สองร้อยห้าสิบค่ะ",
        "gloss": {
          "en": "Two hundred fifty.",
          "ko": "이백오십이요."
        }
      },
      {
        "who": "me",
        "text": "มีสีน้ำเงินไหมครับ",
        "gloss": {
          "en": "Do you have it in blue?",
          "ko": "파란색 있어요?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "มีค่ะ",
        "gloss": {
          "en": "Yes, we do.",
          "ko": "있어요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เอาตัวนี้ครับ",
        "gloss": {
          "en": "Okay, I'll take this one.",
          "ko": "좋아요, 이걸로 할게요."
        },
        "frames": [
          "th-f1-13"
        ]
      }
    ]
  },
  {
    "id": "th-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about the hot weather with a coworker",
      "ko": "동료와 더운 날씨 이야기"
    },
    "expressions": [
      "ใช่"
    ],
    "grammar": [
      2,
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "วันนี้ร้อนมากนะคะ",
        "gloss": {
          "en": "It's really hot today.",
          "ko": "오늘 정말 덥네요."
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ร้อนมากครับ",
        "gloss": {
          "en": "Yes, very hot.",
          "ko": "네, 정말 더워요."
        }
      },
      {
        "who": "them",
        "text": "คุณมาจากไหนคะ",
        "gloss": {
          "en": "Where are you from?",
          "ko": "어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาจากเกาหลีครับ",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        },
        "frames": [
          "th-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "ที่เกาหลีร้อนไหมคะ",
        "gloss": {
          "en": "Is it hot in Korea?",
          "ko": "한국은 더워요?"
        }
      },
      {
        "who": "me",
        "text": "ตอนนี้ไม่ร้อนครับ หนาวนิดหน่อยครับ",
        "gloss": {
          "en": "Not now. It's a bit cold.",
          "ko": "지금은 안 더워요. 조금 추워요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "ดื่มน้ำเย็นไหมคะ",
        "gloss": {
          "en": "Would you like some cold water?",
          "ko": "찬물 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "ขอน้ำเย็นหนึ่งแก้วครับ",
        "gloss": {
          "en": "A glass of cold water, please.",
          "ko": "찬물 한 잔 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      }
    ]
  },
  {
    "id": "th-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a clinic reception for the first time",
      "ko": "병원 접수처에 처음 가기"
    },
    "expressions": [
      "ขอบคุณ",
      "ใช่"
    ],
    "grammar": [
      0,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ มีบัตรคนไข้ไหมคะ",
        "gloss": {
          "en": "Hello, do you have a patient card?",
          "ko": "안녕하세요, 진료 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่มีครับ มาครั้งแรกครับ",
        "gloss": {
          "en": "No, it's my first time.",
          "ko": "없어요. 처음 왔어요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "เป็นคนไทยไหมคะ",
        "gloss": {
          "en": "Are you Thai?",
          "ko": "태국 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ใช่ครับ ผมเป็นคนเกาหลีครับ",
        "gloss": {
          "en": "No, I'm Korean.",
          "ko": "아니요, 저는 한국 사람이에요."
        },
        "frames": [
          "th-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "ขอดูพาสปอร์ตหน่อยค่ะ",
        "gloss": {
          "en": "May I see your passport?",
          "ko": "여권 좀 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ห้องหมออยู่ที่ไหนครับ",
        "gloss": {
          "en": "Here. Where is the doctor's room?",
          "ko": "여기요. 진료실은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "ชั้นสองค่ะ รอสักครู่นะคะ",
        "gloss": {
          "en": "Second floor. Please wait a moment.",
          "ko": "이 층이에요. 잠시 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ขอน้ำได้ไหมครับ",
        "gloss": {
          "en": "Thank you. Could I have some water?",
          "ko": "고마워요. 물 좀 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      }
    ]
  },
  {
    "id": "th-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a food delivery rider",
      "ko": "배달 기사와 통화하기"
    },
    "expressions": [
      "สวัสดี",
      "โอเค"
    ],
    "grammar": [
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหลครับ ส่งอาหารครับ ผมอยู่หน้าคอนโดครับ",
        "gloss": {
          "en": "Hello, food delivery. I'm in front of the condo.",
          "ko": "여보세요, 음식 배달이에요. 콘도 앞에 있어요."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมอยู่ที่ชั้นแปดครับ",
        "gloss": {
          "en": "Hello, I'm on the eighth floor.",
          "ko": "안녕하세요, 저는 팔 층에 있어요."
        },
        "frames": [
          "th-f1-15",
          "th-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ขึ้นไปไม่ได้ครับ ลงมารับได้ไหมครับ",
        "gloss": {
          "en": "I can't go up. Can you come down?",
          "ko": "올라갈 수가 없어요. 내려오실 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ รอห้านาทีได้ไหมครับ",
        "gloss": {
          "en": "Sure. Can you wait five minutes?",
          "ko": "네. 오 분만 기다려 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ จ่ายเงินสดนะครับ สองร้อยบาทครับ",
        "gloss": {
          "en": "Okay. It's cash, two hundred baht.",
          "ko": "네. 현금이고 이백 바트예요."
        }
      },
      {
        "who": "me",
        "text": "มีเงินทอนไหมครับ",
        "gloss": {
          "en": "Do you have change?",
          "ko": "거스름돈 있어요?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "มีครับ",
        "gloss": {
          "en": "Yes, I do.",
          "ko": "있어요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เดี๋ยวลงไปครับ",
        "gloss": {
          "en": "Okay, I'll be right down.",
          "ko": "알겠어요, 금방 내려갈게요."
        }
      }
    ]
  },
  {
    "id": "th-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Trying a Thai snack at the office",
      "ko": "사무실에서 태국 간식 맛보기"
    },
    "expressions": [
      "ขอบคุณ",
      "ชื่ออะไร",
      "โอเค"
    ],
    "grammar": [
      1,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "ลองกินนี่สิคะ",
        "gloss": {
          "en": "Try this.",
          "ko": "이거 먹어 봐요."
        }
      },
      {
        "who": "me",
        "text": "ขนมนี้ชื่ออะไรครับ",
        "gloss": {
          "en": "What is this snack called?",
          "ko": "이 간식 이름이 뭐예요?"
        },
        "frames": [
          "th-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "ขนมชั้นค่ะ",
        "gloss": {
          "en": "It's khanom chan.",
          "ko": "카놈찬이에요."
        }
      },
      {
        "who": "me",
        "text": "อร่อยครับ ไม่หวานมากครับ",
        "gloss": {
          "en": "It's good. Not too sweet.",
          "ko": "맛있어요. 너무 달지 않아요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "ซื้อที่ตลาดใกล้ๆ ค่ะ",
        "gloss": {
          "en": "I bought it at the market nearby.",
          "ko": "근처 시장에서 샀어요."
        }
      },
      {
        "who": "me",
        "text": "ตลาดอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Where is the market?",
          "ko": "시장은 어디에 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "หลังออฟฟิศค่ะ",
        "gloss": {
          "en": "Behind the office.",
          "ko": "사무실 뒤에 있어요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ขอบคุณสำหรับขนมครับ",
        "gloss": {
          "en": "Okay. Thanks for the snack.",
          "ko": "그렇군요. 간식 고마워요."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket",
      "ko": "기차표 사기"
    },
    "expressions": [
      "เท่าไร",
      "ไม่เข้าใจ"
    ],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไปไหนคะ",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "ขอตั๋วไปเชียงใหม่หนึ่งใบครับ",
        "gloss": {
          "en": "One ticket to Chiang Mai, please.",
          "ko": "치앙마이 가는 표 한 장 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "รถไฟกลางคืนนะคะ ชั้นสองไหมคะ",
        "gloss": {
          "en": "It's the night train. Second class?",
          "ko": "야간열차예요. 이등석으로 할까요?"
        }
      },
      {
        "who": "me",
        "text": "ชั้นสองเท่าไรครับ",
        "gloss": {
          "en": "How much is second class?",
          "ko": "이등석은 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "แปดร้อยบาทค่ะ",
        "gloss": {
          "en": "Eight hundred baht.",
          "ko": "팔백 바트예요."
        }
      },
      {
        "who": "me",
        "text": "เอาชั้นสองครับ",
        "gloss": {
          "en": "I'll take second class.",
          "ko": "이등석으로 할게요."
        },
        "frames": [
          "th-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "รถออกหกโมงเย็น ชานชาลาสามค่ะ",
        "gloss": {
          "en": "It leaves at six p.m. from platform three.",
          "ko": "저녁 여섯 시에 삼번 승강장에서 출발해요."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่เข้าใจคำว่าชานชาลาครับ",
        "gloss": {
          "en": "I don't understand the word 'chanchala'.",
          "ko": "'찬찰라'라는 말을 모르겠어요."
        },
        "frames": [
          "th-f1-11"
        ]
      }
    ]
  },
  {
    "id": "th-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A coworker invites you to lunch",
      "ko": "동료가 점심 먹자고 할 때"
    },
    "expressions": [
      "เสร็จแล้ว",
      "ดีเลย"
    ],
    "grammar": [
      0,
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "กินข้าวหรือยังครับ",
        "gloss": {
          "en": "Have you eaten yet?",
          "ko": "밥 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "ยังครับ ผมกำลังทำงานอยู่ครับ",
        "gloss": {
          "en": "Not yet. I'm working right now.",
          "ko": "아직이요. 지금 일하고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "ไปกินข้าวด้วยกันไหม",
        "gloss": {
          "en": "Want to go eat together?",
          "ko": "같이 밥 먹으러 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ ผมอยากกินข้าวมันไก่ครับ",
        "gloss": {
          "en": "Sounds good. I want to have chicken rice.",
          "ko": "좋아요. 카오만까이 먹고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "ร้านข้างออฟฟิศอร่อยนะ",
        "gloss": {
          "en": "The place next to the office is good.",
          "ko": "사무실 옆 가게가 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่เคยไปร้านนั้นเลยครับ",
        "gloss": {
          "en": "I've never been to that place.",
          "ko": "그 가게는 한 번도 안 가 봤어요."
        },
        "frames": [
          "th-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "งั้นไปกันเลย",
        "gloss": {
          "en": "Then let's go.",
          "ko": "그럼 지금 가요."
        }
      },
      {
        "who": "me",
        "text": "เดี๋ยวนะครับ ผมส่งอีเมลเสร็จแล้วครับ ไปกันครับ",
        "gloss": {
          "en": "Just a sec... I've finished sending the email. Let's go.",
          "ko": "잠깐만요... 이메일 다 보냈어요. 가요."
        },
        "frames": [
          "th-f2-01"
        ]
      }
    ]
  },
  {
    "id": "th-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Giving a taxi driver directions",
      "ko": "택시 기사에게 길 알려 주기"
    },
    "expressions": [
      "เลี้ยวซ้าย",
      "จอดตรงนี้"
    ],
    "grammar": [
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไปไหนครับ",
        "gloss": {
          "en": "Where to?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "ไปที่ตลาดนัดจตุจักรครับ",
        "gloss": {
          "en": "To Chatuchak Weekend Market, please.",
          "ko": "짜뚜짝 주말 시장으로 가 주세요."
        },
        "frames": [
          "th-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ขึ้นทางด่วนไหมครับ",
        "gloss": {
          "en": "Sure. Shall I take the expressway?",
          "ko": "네. 고속도로 탈까요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ต้องครับ เพราะวันนี้รถไม่ติดครับ",
        "gloss": {
          "en": "No need, because traffic isn't bad today.",
          "ko": "괜찮아요. 오늘은 차가 안 막히니까요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "ใกล้ถึงแล้วครับ จอดตรงไหนดีครับ",
        "gloss": {
          "en": "We're almost there. Where should I stop?",
          "ko": "거의 다 왔어요. 어디에 세울까요?"
        }
      },
      {
        "who": "me",
        "text": "เลี้ยวซ้ายตรงเซเว่นครับ",
        "gloss": {
          "en": "Turn left at the convenience store.",
          "ko": "편의점에서 왼쪽으로 돌아 주세요."
        },
        "frames": [
          "th-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ตรงนี้ได้ไหมครับ",
        "gloss": {
          "en": "Is here okay?",
          "ko": "여기 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "ครับ จอดตรงนี้ครับ ขอบคุณครับ",
        "gloss": {
          "en": "Yes, stop here. Thank you.",
          "ko": "네, 여기 세워 주세요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering at a Thai restaurant",
      "ko": "태국 식당에서 주문하기"
    },
    "expressions": [
      "ไม่เผ็ด",
      "อร่อยมาก",
      "เช็คบิล"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "รับอะไรดีคะ",
        "gloss": {
          "en": "What would you like?",
          "ko": "뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอผัดไทยกุ้งไม่เผ็ดครับ",
        "gloss": {
          "en": "Shrimp pad thai, not spicy, please.",
          "ko": "새우 팟타이, 안 맵게 주세요."
        },
        "frames": [
          "th-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ดื่มอะไรดีคะ",
        "gloss": {
          "en": "Sure. Anything to drink?",
          "ko": "네. 음료는 뭐로 하실래요?"
        }
      },
      {
        "who": "me",
        "text": "ขอน้ำมะพร้าวครับ ผมชอบน้ำมะพร้าวมากครับ",
        "gloss": {
          "en": "A coconut water, please. I really like coconut water.",
          "ko": "코코넛 워터 주세요. 코코넛 워터 정말 좋아해요."
        },
        "frames": [
          "th-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "อาหารเป็นยังไงบ้างคะ",
        "gloss": {
          "en": "How is the food?",
          "ko": "음식 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "อร่อยมากครับ",
        "gloss": {
          "en": "It's delicious.",
          "ko": "정말 맛있어요."
        }
      },
      {
        "who": "them",
        "text": "รับอะไรเพิ่มไหมคะ",
        "gloss": {
          "en": "Anything else?",
          "ko": "더 필요하신 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ครับ ผมอิ่มแล้วครับ เช็คบิลด้วยครับ",
        "gloss": {
          "en": "No, I'm full. The bill, please.",
          "ko": "아니요, 배불러요. 계산서 주세요."
        },
        "frames": [
          "th-f2-01"
        ]
      }
    ]
  },
  {
    "id": "th-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor about a headache",
      "ko": "두통으로 진료받기"
    },
    "expressions": [
      "ปวดหัว"
    ],
    "grammar": [
      0,
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "เป็นอะไรมาคะ",
        "gloss": {
          "en": "What brings you in?",
          "ko": "어디가 아파서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมปวดหัวมากครับ",
        "gloss": {
          "en": "I have a bad headache.",
          "ko": "머리가 많이 아파요."
        },
        "frames": [
          "th-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "เป็นมานานไหมคะ",
        "gloss": {
          "en": "How long have you had it?",
          "ko": "오래됐어요?"
        }
      },
      {
        "who": "me",
        "text": "ตั้งแต่เมื่อวานครับ เพราะผมนอนไม่พอครับ",
        "gloss": {
          "en": "Since yesterday, because I didn't get enough sleep.",
          "ko": "어제부터요. 잠을 충분히 못 자서요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "กินยาหรือยังคะ",
        "gloss": {
          "en": "Have you taken any medicine?",
          "ko": "약은 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมกินยาแล้วครับ แต่ยังไม่หายครับ",
        "gloss": {
          "en": "I've already taken some, but it hasn't gone away.",
          "ko": "벌써 먹었는데 아직 안 나았어요."
        },
        "frames": [
          "th-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "งั้นพักผ่อนเยอะๆ นะคะ เดี๋ยวหมอให้ยาเพิ่มค่ะ",
        "gloss": {
          "en": "Then get plenty of rest. I'll give you more medicine.",
          "ko": "그럼 푹 쉬세요. 약을 더 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ พรุ่งนี้ผมจะหยุดงานครับ",
        "gloss": {
          "en": "Thank you. Tomorrow I'll take the day off.",
          "ko": "고마워요. 내일은 일을 쉴게요."
        },
        "frames": [
          "th-f2-02"
        ]
      }
    ]
  },
  {
    "id": "th-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a trip to a floating market",
      "ko": "수상 시장 여행 계획"
    },
    "expressions": [],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "พรุ่งนี้ว่างไหม",
        "gloss": {
          "en": "Are you free tomorrow?",
          "ko": "내일 시간 있어?"
        }
      },
      {
        "who": "me",
        "text": "ว่างครับ พรุ่งนี้ผมจะไปตลาดน้ำครับ",
        "gloss": {
          "en": "Yes. Tomorrow I'm going to a floating market.",
          "ko": "있어요. 내일 수상 시장에 갈 거예요."
        },
        "frames": [
          "th-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "ตลาดน้ำไหน",
        "gloss": {
          "en": "Which floating market?",
          "ko": "어느 수상 시장?"
        }
      },
      {
        "who": "me",
        "text": "อัมพวาครับ เคยไปไหมครับ",
        "gloss": {
          "en": "Amphawa. Have you ever been?",
          "ko": "암파와요. 가 본 적 있어요?"
        },
        "frames": [
          "th-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "เคยไปครั้งหนึ่ง สนุกมาก",
        "gloss": {
          "en": "I went once. It was really fun.",
          "ko": "한 번 가 봤어. 정말 재밌었어."
        }
      },
      {
        "who": "me",
        "text": "ไปเที่ยวด้วยกันไหมครับ",
        "gloss": {
          "en": "Shall we go together?",
          "ko": "같이 놀러 갈래요?"
        },
        "frames": [
          "th-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ดีเลย เจอกันกี่โมง",
        "gloss": {
          "en": "Great. What time shall we meet?",
          "ko": "좋아. 몇 시에 만나?"
        }
      },
      {
        "who": "me",
        "text": "แปดโมงครับ เจอกันที่สถานีหมอชิตนะครับ",
        "gloss": {
          "en": "Eight o'clock. Let's meet at Mo Chit station.",
          "ko": "여덟 시요. 머칫역에서 만나요."
        },
        "frames": [
          "th-f2-17"
        ]
      }
    ]
  },
  {
    "id": "th-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend calls while you're cooking",
      "ko": "요리하는데 친구가 전화할 때"
    },
    "expressions": [
      "เสร็จแล้ว"
    ],
    "grammar": [
      2,
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล ทำอะไรอยู่",
        "gloss": {
          "en": "Hello, what are you doing?",
          "ko": "여보세요, 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "ผมกำลังทำกับข้าวอยู่ครับ",
        "gloss": {
          "en": "I'm cooking right now.",
          "ko": "지금 요리하고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "ทำอะไรกิน",
        "gloss": {
          "en": "What are you making?",
          "ko": "뭐 만들어?"
        }
      },
      {
        "who": "me",
        "text": "ต้มยำกุ้งครับ ผมอยากลองทำอาหารไทยครับ",
        "gloss": {
          "en": "Tom yum goong. I want to try cooking Thai food.",
          "ko": "똠얌꿍이요. 태국 음식을 만들어 보고 싶어서요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "เก่งจัง ใส่พริกเยอะไหม",
        "gloss": {
          "en": "Impressive. Are you putting in lots of chili?",
          "ko": "대단하다. 고추 많이 넣어?"
        }
      },
      {
        "who": "me",
        "text": "ไม่เยอะครับ เพราะผมกินเผ็ดไม่เก่งครับ",
        "gloss": {
          "en": "Not much, because I'm not good with spicy food.",
          "ko": "많이는 안 넣어요. 매운 걸 잘 못 먹어서요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "งั้นเย็นนี้ไปดูหนังกันไหม",
        "gloss": {
          "en": "Then want to see a movie this evening?",
          "ko": "그럼 오늘 저녁에 영화 보러 갈래?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ กินเสร็จแล้วผมจะโทรไปนะครับ",
        "gloss": {
          "en": "Sure. I'll call you after I eat.",
          "ko": "좋아요. 다 먹고 전화할게요."
        }
      }
    ]
  },
  {
    "id": "th-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Trying durian with a coworker",
      "ko": "동료와 두리안 먹어 보기"
    },
    "expressions": [
      "ไม่ค่อยชอบ"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "เคยกินทุเรียนไหมคะ",
        "gloss": {
          "en": "Have you ever had durian?",
          "ko": "두리안 먹어 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่เคยครับ ผมไม่เคยกินทุเรียนเลยครับ",
        "gloss": {
          "en": "No, I've never eaten durian.",
          "ko": "아니요, 두리안은 한 번도 안 먹어 봤어요."
        },
        "frames": [
          "th-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "ลองชิมไหมคะ หวานมากนะ",
        "gloss": {
          "en": "Want to try some? It's really sweet.",
          "ko": "먹어 볼래요? 정말 달아요."
        }
      },
      {
        "who": "me",
        "text": "กลิ่นแรงไหมครับ",
        "gloss": {
          "en": "Is the smell strong?",
          "ko": "냄새가 강해요?"
        }
      },
      {
        "who": "them",
        "text": "นิดหน่อยค่ะ แต่อร่อยนะคะ",
        "gloss": {
          "en": "A little, but it's tasty.",
          "ko": "조금요. 그래도 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ผมอยากลองครับ",
        "gloss": {
          "en": "Okay, I want to try it.",
          "ko": "좋아요, 먹어 보고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "เป็นยังไงบ้างคะ",
        "gloss": {
          "en": "How is it?",
          "ko": "어때요?"
        }
      },
      {
        "who": "me",
        "text": "อร่อยครับ แต่ผมไม่ค่อยชอบกลิ่นครับ",
        "gloss": {
          "en": "It's good, but I don't really like the smell.",
          "ko": "맛있어요. 그런데 냄새는 별로예요."
        },
        "frames": [
          "th-f2-14"
        ]
      }
    ]
  },
  {
    "id": "th-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling the hotel front desk",
      "ko": "호텔 프런트에 전화하기"
    },
    "expressions": [],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ แผนกต้อนรับค่ะ",
        "gloss": {
          "en": "Hello, front desk.",
          "ko": "안녕하세요, 프런트입니다."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ช่วยส่งผ้าเช็ดตัวมาที่ห้องหน่อยครับ",
        "gloss": {
          "en": "Hello, please send some towels to my room.",
          "ko": "안녕하세요, 방에 수건 좀 보내 주세요."
        },
        "frames": [
          "th-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ห้องอะไรคะ",
        "gloss": {
          "en": "Sure. Which room?",
          "ko": "네. 몇 호실이에요?"
        }
      },
      {
        "who": "me",
        "text": "ห้องสี่ร้อยสิบครับ",
        "gloss": {
          "en": "Room four-ten.",
          "ko": "사백십 호실이에요."
        }
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ต้องการอะไรอีกไหมคะ",
        "gloss": {
          "en": "Okay. Anything else?",
          "ko": "알겠습니다. 더 필요하신 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "ช่วยโทรปลุกตอนหกโมงเช้าหน่อยครับ",
        "gloss": {
          "en": "Please give me a wake-up call at six a.m.",
          "ko": "아침 여섯 시에 모닝콜 좀 해 주세요."
        },
        "frames": [
          "th-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ พรุ่งนี้ออกไปแต่เช้าเลยนะคะ",
        "gloss": {
          "en": "Sure. You're heading out early tomorrow.",
          "ko": "네. 내일 일찍 나가시네요."
        }
      },
      {
        "who": "me",
        "text": "ครับ พรุ่งนี้ผมจะไปสนามบินครับ",
        "gloss": {
          "en": "Yes, tomorrow I'm going to the airport.",
          "ko": "네, 내일 공항에 가요."
        },
        "frames": [
          "th-f2-02"
        ]
      }
    ]
  },
  {
    "id": "th-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A tourist asks you the way",
      "ko": "관광객이 길을 물을 때"
    },
    "expressions": [
      "ไปด้วยกันไหม",
      "ตรงไป",
      "เลี้ยวซ้าย"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ขอโทษค่ะ ไปสถานีรถไฟฟ้ายังไงคะ",
        "gloss": {
          "en": "Excuse me, how do I get to the train station?",
          "ko": "실례합니다, 전철역은 어떻게 가요?"
        }
      },
      {
        "who": "me",
        "text": "ตรงไปครับ แล้วเลี้ยวซ้ายตรงไฟแดงครับ",
        "gloss": {
          "en": "Go straight, then turn left at the traffic light.",
          "ko": "쭉 가다가 신호등에서 왼쪽으로 도세요."
        },
        "frames": [
          "th-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ไกลไหมคะ",
        "gloss": {
          "en": "Is it far?",
          "ko": "멀어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ไกลครับ ผมกำลังไปทางนั้นอยู่ครับ",
        "gloss": {
          "en": "Not far. I'm heading that way right now.",
          "ko": "안 멀어요. 저도 지금 그쪽으로 가고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "จริงเหรอคะ",
        "gloss": {
          "en": "Really?",
          "ko": "정말요?"
        }
      },
      {
        "who": "me",
        "text": "ครับ ไปด้วยกันไหมครับ",
        "gloss": {
          "en": "Yes. Shall we go together?",
          "ko": "네. 같이 갈래요?"
        },
        "frames": [
          "th-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ขอบคุณมากค่ะ",
        "gloss": {
          "en": "Thank you so much.",
          "ko": "정말 고마워요."
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ",
        "gloss": {
          "en": "No problem.",
          "ko": "별말씀을요."
        }
      }
    ]
  },
  {
    "id": "th-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about badminton with a friend",
      "ko": "친구와 배드민턴 이야기"
    },
    "expressions": [
      "ดีเลย"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "ว่างๆ ชอบทำอะไรครับ",
        "gloss": {
          "en": "What do you like to do in your free time?",
          "ko": "시간 날 때 뭐 하는 거 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "ผมชอบเล่นแบดมินตันมากครับ",
        "gloss": {
          "en": "I really like playing badminton.",
          "ko": "배드민턴 치는 걸 정말 좋아해요."
        },
        "frames": [
          "th-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "เล่นที่ไหนครับ",
        "gloss": {
          "en": "Where do you play?",
          "ko": "어디서 쳐요?"
        }
      },
      {
        "who": "me",
        "text": "ที่สนามใกล้บ้านครับ เคยเล่นไหมครับ",
        "gloss": {
          "en": "At a court near my house. Have you ever played?",
          "ko": "집 근처 코트에서요. 쳐 본 적 있어요?"
        },
        "frames": [
          "th-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "เคยครับ แต่ไม่เก่ง",
        "gloss": {
          "en": "Yes, but I'm not good.",
          "ko": "있어요. 그런데 잘 못 쳐요."
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ ไปเล่นด้วยกันไหมครับ",
        "gloss": {
          "en": "That's okay. Shall we go play together?",
          "ko": "괜찮아요. 같이 치러 갈래요?"
        },
        "frames": [
          "th-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ วันเสาร์นี้ดีไหม",
        "gloss": {
          "en": "Sure. How about this Saturday?",
          "ko": "좋아요. 이번 토요일 어때요?"
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ เจอกันที่สนามนะครับ",
        "gloss": {
          "en": "Great. Let's meet at the court.",
          "ko": "좋아요. 코트에서 만나요."
        },
        "frames": [
          "th-f2-17"
        ]
      }
    ]
  },
  {
    "id": "th-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Preparing for a meeting at the office",
      "ko": "사무실에서 회의 준비"
    },
    "expressions": [
      "เดี๋ยวเจอกัน"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "ประชุมกี่โมงคะ",
        "gloss": {
          "en": "What time is the meeting?",
          "ko": "회의 몇 시예요?"
        }
      },
      {
        "who": "me",
        "text": "บ่ายสองครับ คุณอ่านเอกสารหรือยังครับ",
        "gloss": {
          "en": "Two p.m. Have you read the documents yet?",
          "ko": "오후 두 시요. 자료 읽었어요?"
        },
        "frames": [
          "th-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "ยังเลยค่ะ ส่งให้หน่อยได้ไหมคะ",
        "gloss": {
          "en": "Not yet. Could you send them to me?",
          "ko": "아직이요. 좀 보내 줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมส่งให้แล้วครับ ดูในอีเมลนะครับ",
        "gloss": {
          "en": "I've already sent them. Check your email.",
          "ko": "벌써 보냈어요. 이메일 확인해 보세요."
        },
        "frames": [
          "th-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "เจอแล้วค่ะ ขอบคุณค่ะ",
        "gloss": {
          "en": "Found them. Thanks.",
          "ko": "찾았어요. 고마워요."
        }
      },
      {
        "who": "me",
        "text": "จองห้องประชุมหรือยังครับ",
        "gloss": {
          "en": "Have you booked the meeting room yet?",
          "ko": "회의실은 예약했어요?"
        },
        "frames": [
          "th-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "จองแล้วค่ะ ห้องเล็กชั้นสามค่ะ",
        "gloss": {
          "en": "Yes, the small room on the third floor.",
          "ko": "했어요. 삼 층 작은 방이요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เดี๋ยวเจอกันครับ",
        "gloss": {
          "en": "Okay, see you soon.",
          "ko": "좋아요, 이따 봐요."
        }
      }
    ]
  },
  {
    "id": "th-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's family home",
      "ko": "친구 집에서 가족과 저녁"
    },
    "expressions": [
      "ไม่ค่อยชอบ",
      "จริงเหรอ"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "กินผักชีได้ไหม",
        "gloss": {
          "en": "Can you eat coriander?",
          "ko": "고수 먹을 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "ผมไม่ค่อยชอบผักชีครับ",
        "gloss": {
          "en": "I don't really like coriander.",
          "ko": "고수는 별로 안 좋아해요."
        },
        "frames": [
          "th-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "งั้นไม่ใส่นะ ชอบกินอะไร",
        "gloss": {
          "en": "Then I won't add it. What do you like to eat?",
          "ko": "그럼 안 넣을게. 뭐 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "ผมชอบแกงเขียวหวานมากครับ",
        "gloss": {
          "en": "I really like green curry.",
          "ko": "그린 커리를 정말 좋아해요."
        },
        "frames": [
          "th-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "แม่ทำแกงเขียวหวานเก่งมาก",
        "gloss": {
          "en": "My mom makes great green curry.",
          "ko": "우리 엄마가 그린 커리 정말 잘 만들어."
        }
      },
      {
        "who": "me",
        "text": "จริงเหรอครับ ผมอยากชิมครับ",
        "gloss": {
          "en": "Really? I want to taste it.",
          "ko": "정말요? 먹어 보고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "กินเยอะๆ นะ",
        "gloss": {
          "en": "Eat a lot.",
          "ko": "많이 먹어."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ผมอิ่มแล้วครับ",
        "gloss": {
          "en": "Thank you. I'm already full.",
          "ko": "고마워요. 벌써 배불러요."
        },
        "frames": [
          "th-f2-01"
        ]
      }
    ]
  },
  {
    "id": "th-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling your boss in sick",
      "ko": "아파서 상사에게 전화하기"
    },
    "expressions": [
      "ไม่สบาย"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล วันนี้ทำไมยังไม่มาคะ",
        "gloss": {
          "en": "Hello, why aren't you in today?",
          "ko": "여보세요, 오늘 왜 아직 안 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ วันนี้ผมไม่สบาย ผมปวดท้องมากครับ",
        "gloss": {
          "en": "Sorry, I'm sick today. I have a bad stomachache.",
          "ko": "죄송해요. 오늘 몸이 안 좋아요. 배가 많이 아파요."
        },
        "frames": [
          "th-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "ไปหาหมอหรือยังคะ",
        "gloss": {
          "en": "Have you seen a doctor yet?",
          "ko": "병원은 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมไปหาหมอมาแล้วครับ",
        "gloss": {
          "en": "I've already been to the doctor.",
          "ko": "벌써 병원에 다녀왔어요."
        },
        "frames": [
          "th-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "พักผ่อนนะคะ พรุ่งนี้มาได้ไหม",
        "gloss": {
          "en": "Get some rest. Can you come tomorrow?",
          "ko": "푹 쉬어요. 내일은 올 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "พรุ่งนี้ผมจะมาทำงานครับ",
        "gloss": {
          "en": "Tomorrow I'll come to work.",
          "ko": "내일은 출근할게요."
        },
        "frames": [
          "th-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "โอเคค่ะ หายเร็วๆ นะคะ",
        "gloss": {
          "en": "Okay. Get well soon.",
          "ko": "알겠어요. 빨리 나아요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "th-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Telling the landlord about the air conditioner",
      "ko": "집주인에게 에어컨 문제 말하기"
    },
    "expressions": [],
    "grammar": [
      1,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ห้องเป็นยังไงบ้างคะ",
        "gloss": {
          "en": "How's the room?",
          "ko": "방은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "ดีครับ แต่แอร์ไม่เย็นครับ",
        "gloss": {
          "en": "It's good, but the AC isn't cold.",
          "ko": "좋아요. 그런데 에어컨이 시원하지 않아요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "เดี๋ยวให้ช่างไปดูนะคะ พรุ่งนี้สะดวกไหมคะ",
        "gloss": {
          "en": "I'll send a technician. Is tomorrow okay?",
          "ko": "기사님 보내 드릴게요. 내일 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "พรุ่งนี้ผมจะไม่อยู่บ้านครับ เพราะต้องไปทำงานครับ",
        "gloss": {
          "en": "Tomorrow I won't be home, because I have to go to work.",
          "ko": "내일은 집에 없을 거예요. 출근해야 해서요."
        },
        "frames": [
          "th-f2-02",
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "งั้นวันเสาร์ได้ไหมคะ",
        "gloss": {
          "en": "Then how about Saturday?",
          "ko": "그럼 토요일은 돼요?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ช่วยโทรมาก่อนหน่อยครับ",
        "gloss": {
          "en": "Sure. Please call me first.",
          "ko": "네. 오기 전에 전화 좀 해 주세요."
        },
        "frames": [
          "th-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ",
        "gloss": {
          "en": "Will do.",
          "ko": "알겠어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "th-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend picks you up at the airport",
      "ko": "친구가 공항에 마중 나올 때"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล ถึงแล้วหรือยัง",
        "gloss": {
          "en": "Hello, have you arrived yet?",
          "ko": "여보세요, 도착했어?"
        }
      },
      {
        "who": "me",
        "text": "ถึงแล้วครับ ผมกำลังรอกระเป๋าอยู่ครับ",
        "gloss": {
          "en": "I've arrived. I'm waiting for my bag right now.",
          "ko": "도착했어요. 지금 짐 기다리고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "โอเค ผมกำลังขับรถไป",
        "gloss": {
          "en": "Okay, I'm driving over.",
          "ko": "오케이, 지금 운전해서 가고 있어."
        }
      },
      {
        "who": "me",
        "text": "ไม่ต้องรีบนะครับ",
        "gloss": {
          "en": "No need to hurry.",
          "ko": "서두르지 않아도 돼요."
        }
      },
      {
        "who": "them",
        "text": "จะไปรับที่ประตูไหนดี",
        "gloss": {
          "en": "Which gate should I pick you up at?",
          "ko": "어느 출구로 데리러 갈까?"
        }
      },
      {
        "who": "me",
        "text": "เจอกันที่ประตูสามนะครับ",
        "gloss": {
          "en": "Let's meet at gate three.",
          "ko": "삼번 출구에서 만나요."
        },
        "frames": [
          "th-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "ได้เลย กินข้าวหรือยัง",
        "gloss": {
          "en": "Got it. Have you eaten?",
          "ko": "알았어. 밥은 먹었어?"
        }
      },
      {
        "who": "me",
        "text": "ยังครับ ไปกินข้าวด้วยกันไหมครับ",
        "gloss": {
          "en": "Not yet. Shall we go eat together?",
          "ko": "아직이요. 같이 밥 먹으러 갈래요?"
        },
        "frames": [
          "th-f2-06"
        ]
      }
    ]
  },
  {
    "id": "th-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a silk scarf as a souvenir",
      "ko": "기념품으로 실크 스카프 사기"
    },
    "expressions": [
      "ไม่ค่อยชอบ"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ซื้อให้ใครคะ",
        "gloss": {
          "en": "Who are you buying for?",
          "ko": "누구 선물이에요?"
        }
      },
      {
        "who": "me",
        "text": "ผมอยากซื้อของฝากให้แม่ครับ",
        "gloss": {
          "en": "I want to buy a souvenir for my mom.",
          "ko": "엄마 드릴 선물을 사고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "ผ้าไหมผืนนี้สวยไหมคะ",
        "gloss": {
          "en": "Isn't this silk scarf pretty?",
          "ko": "이 실크 스카프 예쁘죠?"
        }
      },
      {
        "who": "me",
        "text": "สวยครับ แต่ผมไม่ค่อยชอบสีแดงครับ",
        "gloss": {
          "en": "It's pretty, but I don't really like red.",
          "ko": "예뻐요. 그런데 빨간색은 별로예요."
        },
        "frames": [
          "th-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "สีฟ้ามีค่ะ",
        "gloss": {
          "en": "We have it in light blue.",
          "ko": "하늘색도 있어요."
        }
      },
      {
        "who": "me",
        "text": "ผมชอบสีฟ้ามากครับ",
        "gloss": {
          "en": "I really like light blue.",
          "ko": "하늘색 정말 좋아요."
        },
        "frames": [
          "th-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "ห่อของขวัญไหมคะ",
        "gloss": {
          "en": "Shall I gift-wrap it?",
          "ko": "선물 포장해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ครับ ช่วยห่อให้หน่อยครับ",
        "gloss": {
          "en": "Yes, please wrap it for me.",
          "ko": "네, 포장 좀 해 주세요."
        },
        "frames": [
          "th-f2-05"
        ]
      }
    ]
  },
  {
    "id": "th-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A motorbike taxi home in the rain",
      "ko": "비 오는 날 오토바이 택시로 귀가"
    },
    "expressions": [
      "เลี้ยวซ้าย"
    ],
    "grammar": [
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไปไหนครับ",
        "gloss": {
          "en": "Where to?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "ไปที่คอนโดในซอยสิบครับ",
        "gloss": {
          "en": "To the condo on Soi Ten, please.",
          "ko": "십 번 골목에 있는 콘도로 가 주세요."
        },
        "frames": [
          "th-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "รีบไหมครับ",
        "gloss": {
          "en": "Are you in a hurry?",
          "ko": "급하세요?"
        }
      },
      {
        "who": "me",
        "text": "รีบครับ เพราะฝนกำลังจะตกครับ",
        "gloss": {
          "en": "Yes, because it's about to rain.",
          "ko": "네, 곧 비가 올 것 같아서요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "ซอยสิบ เข้าทางไหนครับ",
        "gloss": {
          "en": "Soi Ten, which way in?",
          "ko": "십 번 골목, 어느 쪽으로 들어가요?"
        }
      },
      {
        "who": "me",
        "text": "เลี้ยวซ้ายตรงร้านกาแฟครับ",
        "gloss": {
          "en": "Turn left at the coffee shop.",
          "ko": "카페에서 왼쪽으로 돌아 주세요."
        },
        "frames": [
          "th-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ถึงแล้วครับ ห้าสิบบาทครับ",
        "gloss": {
          "en": "Here we are. Fifty baht.",
          "ko": "다 왔어요. 오십 바트예요."
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ขอบคุณครับ",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "th-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A Thai friend is going to visit Korea",
      "ko": "태국 친구가 한국에 놀러 온대요"
    },
    "expressions": [
      "จริงเหรอ",
      "ดีเลย"
    ],
    "grammar": [
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "เดือนหน้าฉันจะไปเกาหลีนะ",
        "gloss": {
          "en": "I'm going to Korea next month.",
          "ko": "다음 달에 나 한국 가."
        }
      },
      {
        "who": "me",
        "text": "จริงเหรอครับ เคยไปเกาหลีไหมครับ",
        "gloss": {
          "en": "Really? Have you ever been to Korea?",
          "ko": "정말요? 한국 가 본 적 있어요?"
        },
        "frames": [
          "th-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "ยังไม่เคยเลย อยากไปดูหิมะ",
        "gloss": {
          "en": "Never. I want to see snow.",
          "ko": "아직 없어. 눈 보고 싶어."
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ ผมอยากพาไปกินบาร์บีคิวเกาหลีครับ",
        "gloss": {
          "en": "Great. I want to take you to eat Korean barbecue.",
          "ko": "좋아요. 한국식 고기구이 먹으러 데려가고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "ช่วงนั้นหนาวไหม",
        "gloss": {
          "en": "Is it cold then?",
          "ko": "그때 추워?"
        }
      },
      {
        "who": "me",
        "text": "หนาวมากครับ ซื้อเสื้อกันหนาวหรือยังครับ",
        "gloss": {
          "en": "Very cold. Have you bought a winter coat yet?",
          "ko": "많이 추워요. 겨울 외투는 샀어요?"
        },
        "frames": [
          "th-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "ยังเลย",
        "gloss": {
          "en": "Not yet.",
          "ko": "아직."
        }
      },
      {
        "who": "me",
        "text": "งั้นไปซื้อด้วยกันไหมครับ",
        "gloss": {
          "en": "Then shall we go buy one together?",
          "ko": "그럼 같이 사러 갈래요?"
        },
        "frames": [
          "th-f2-06"
        ]
      }
    ]
  },
  {
    "id": "th-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for medicine for a toothache",
      "ko": "치통 약 사기"
    },
    "expressions": [],
    "grammar": [
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "เป็นอะไรคะ",
        "gloss": {
          "en": "What's the problem?",
          "ko": "어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมปวดฟันครับ",
        "gloss": {
          "en": "I have a toothache.",
          "ko": "이가 아파요."
        },
        "frames": [
          "th-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "ปวดมากไหมคะ",
        "gloss": {
          "en": "Does it hurt a lot?",
          "ko": "많이 아파요?"
        }
      },
      {
        "who": "me",
        "text": "มากครับ เมื่อคืนนอนไม่หลับเพราะปวดมากครับ",
        "gloss": {
          "en": "A lot. I couldn't sleep last night because it hurt so much.",
          "ko": "많이요. 너무 아파서 어젯밤에 잠을 못 잤어요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "อันนี้เป็นยาแก้ปวดค่ะ กินหลังอาหารนะคะ",
        "gloss": {
          "en": "This is a painkiller. Take it after meals.",
          "ko": "이건 진통제예요. 식후에 드세요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      },
      {
        "who": "them",
        "text": "ควรไปหาหมอฟันด้วยนะคะ",
        "gloss": {
          "en": "You should see a dentist too.",
          "ko": "치과에도 가 보셔야 해요."
        }
      },
      {
        "who": "me",
        "text": "ครับ พรุ่งนี้ผมจะไปหาหมอฟันครับ",
        "gloss": {
          "en": "Yes, tomorrow I'll go to the dentist.",
          "ko": "네, 내일 치과에 갈게요."
        },
        "frames": [
          "th-f2-02"
        ]
      }
    ]
  },
  {
    "id": "th-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Running into a friend at a café",
      "ko": "카페에서 친구와 마주침"
    },
    "expressions": [
      "ดีเลย",
      "เดี๋ยวเจอกัน"
    ],
    "grammar": [
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "อ้าว มาทำอะไรที่นี่",
        "gloss": {
          "en": "Oh, what are you doing here?",
          "ko": "어, 여기서 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "ผมกำลังอ่านหนังสือสอบอยู่ครับ",
        "gloss": {
          "en": "I'm studying for an exam right now.",
          "ko": "지금 시험 공부하고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "สอบภาษาไทยเหรอ ตื่นเต้นไหม",
        "gloss": {
          "en": "The Thai exam? Are you nervous?",
          "ko": "태국어 시험? 떨려?"
        }
      },
      {
        "who": "me",
        "text": "ตื่นเต้นครับ ผมไม่เคยสอบภาษาไทยเลยครับ",
        "gloss": {
          "en": "Yes, I've never taken a Thai exam.",
          "ko": "떨려요. 태국어 시험은 한 번도 안 봤거든요."
        },
        "frames": [
          "th-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "สู้ๆ นะ กาแฟร้านนี้อร่อยไหม",
        "gloss": {
          "en": "You can do it! Is the coffee here good?",
          "ko": "힘내! 이 집 커피 맛있어?"
        }
      },
      {
        "who": "me",
        "text": "อร่อยครับ ผมชอบลาเต้ร้านนี้มากครับ",
        "gloss": {
          "en": "It's good. I really like the latte here.",
          "ko": "맛있어요. 여기 라테 정말 좋아해요."
        },
        "frames": [
          "th-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "สอบเสร็จแล้วไปฉลองกันนะ",
        "gloss": {
          "en": "Let's celebrate after the exam.",
          "ko": "시험 끝나면 축하하러 가자."
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ เดี๋ยวเจอกันครับ",
        "gloss": {
          "en": "Sounds great. See you.",
          "ko": "좋아요. 또 봐요."
        }
      }
    ]
  },
  {
    "id": "th-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The hotel air conditioner is broken",
      "ko": "호텔 에어컨이 고장 났어요"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      0,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "แผนกต้อนรับค่ะ มีอะไรให้ช่วยคะ",
        "gloss": {
          "en": "Front desk. How can I help you?",
          "ko": "프런트입니다. 뭘 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมพักอยู่ห้องห้าร้อยสองครับ แอร์ในห้องเสียครับ",
        "gloss": {
          "en": "Hello, I'm staying in room five-oh-two. The air conditioner in my room is broken.",
          "ko": "안녕하세요, 오백이 호실에 묵고 있는데요. 방 에어컨이 고장 났어요."
        },
        "frames": [
          "th-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "ขอโทษด้วยค่ะ เกิดอะไรขึ้นคะ",
        "gloss": {
          "en": "I'm sorry. What happened?",
          "ko": "죄송합니다. 어떻게 된 건가요?"
        }
      },
      {
        "who": "me",
        "text": "เปิดแล้วมีแต่ลมร้อนครับ ช่วยให้ช่างมาดูหน่อยครับ",
        "gloss": {
          "en": "When I turn it on, only hot air comes out. Please have a technician come and look.",
          "ko": "켜면 더운 바람만 나와요. 기사님 좀 와서 봐 주시게 해 주세요."
        },
        "frames": [
          "th-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ แต่ช่างน่าจะมาถึงอีกประมาณหนึ่งชั่วโมงค่ะ",
        "gloss": {
          "en": "Sure, but the technician will probably take about an hour to get there.",
          "ko": "네, 그런데 기사님이 한 시간쯤 뒤에 도착할 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "ถ้าช่างมาช้า ผมก็ขอเปลี่ยนห้องเลยได้ไหมครับ",
        "gloss": {
          "en": "If the technician is going to be late, could I just change rooms?",
          "ko": "기사님이 늦게 오면 그냥 방을 바꿀 수 있을까요?"
        },
        "frames": [
          "th-f3-01",
          "th-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ เดี๋ยวจัดการให้นะคะ มีห้องว่างชั้นแปดค่ะ",
        "gloss": {
          "en": "Of course, I'll take care of it. There's a free room on the eighth floor.",
          "ko": "네, 바로 처리해 드릴게요. 팔 층에 빈방이 있어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณมากครับ ผมคิดว่าห้องชั้นแปดน่าจะเงียบกว่าด้วยครับ",
        "gloss": {
          "en": "Thank you very much. I think a room on the eighth floor will probably be quieter, too.",
          "ko": "정말 고마워요. 팔 층 방이 더 조용할 것 같기도 해요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      }
    ]
  },
  {
    "id": "th-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Rescheduling a dentist appointment",
      "ko": "치과 예약 바꾸기"
    },
    "expressions": [
      "ขอเลื่อนนัด",
      "น่าจะ"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "คลินิกทันตกรรม สวัสดีค่ะ",
        "gloss": {
          "en": "Dental clinic, hello.",
          "ko": "치과입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมมีนัดพรุ่งนี้บ่ายสามโมง แต่ติดประชุมครับ",
        "gloss": {
          "en": "Hello, I have an appointment tomorrow at three p.m., but I have a meeting.",
          "ko": "안녕하세요, 내일 오후 세 시에 예약이 있는데 회의가 생겼어요."
        }
      },
      {
        "who": "them",
        "text": "ต้องการเลื่อนนัดใช่ไหมคะ",
        "gloss": {
          "en": "You'd like to reschedule?",
          "ko": "예약을 미루고 싶으신 거죠?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ขอเลื่อนนัดเป็นวันพฤหัสหน้าได้ไหมครับ",
        "gloss": {
          "en": "Yes. Could I move it to next Thursday?",
          "ko": "네. 다음 주 목요일로 미룰 수 있을까요?"
        },
        "frames": [
          "th-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "วันพฤหัสหน้าว่างช่วงเช้าค่ะ สิบโมงสะดวกไหมคะ",
        "gloss": {
          "en": "Next Thursday morning is open. Is ten o'clock convenient?",
          "ko": "다음 주 목요일 오전이 비어 있어요. 열 시 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "สะดวกครับ ถ้าเป็นช่วงเช้า ผมก็ไปทำงานสายได้ครับ",
        "gloss": {
          "en": "That works. If it's in the morning, I can go to work late.",
          "ko": "괜찮아요. 오전이면 회사에 좀 늦게 가면 돼요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ฟันยังปวดอยู่ไหมคะ",
        "gloss": {
          "en": "All right. Does your tooth still hurt?",
          "ko": "알겠습니다. 이는 아직 아프세요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ค่อยปวดแล้วครับ น่าจะรอได้ครับ",
        "gloss": {
          "en": "Not much anymore. I can probably wait.",
          "ko": "이제 별로 안 아파요. 기다릴 수 있을 것 같아요."
        },
        "frames": [
          "th-f3-16"
        ]
      }
    ]
  },
  {
    "id": "th-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling your manager what the doctor said",
      "ko": "상사에게 의사 소견 전하기"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      1,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "เป็นยังไงบ้าง ไปหาหมอมาแล้วใช่ไหม",
        "gloss": {
          "en": "How are you? You went to the doctor, right?",
          "ko": "좀 어때요? 병원 다녀왔죠?"
        }
      },
      {
        "who": "me",
        "text": "ครับ หลังจากที่ตรวจเสร็จ หมอบอกว่าผมเป็นไข้หวัดใหญ่ครับ",
        "gloss": {
          "en": "Yes. After the checkup, the doctor said I have the flu.",
          "ko": "네. 진찰이 끝나고 의사가 독감이라고 했어요."
        },
        "frames": [
          "th-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "ตายจริง แล้วหมอว่ายังไงบ้าง",
        "gloss": {
          "en": "Oh no. What else did the doctor say?",
          "ko": "이런. 의사가 또 뭐래요?"
        }
      },
      {
        "who": "me",
        "text": "หมอให้ผมพักผ่อนสามวัน และเขียนใบรับรองแพทย์ให้ผมครับ",
        "gloss": {
          "en": "The doctor told me to rest for three days and wrote me a medical certificate.",
          "ko": "의사가 사흘 쉬라고 했고 진단서도 써 줬어요."
        },
        "frames": [
          "th-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "ไม่เป็นไรนะ งานที่ค้างอยู่ใครทำแทนได้บ้าง",
        "gloss": {
          "en": "That's fine. Who can cover your unfinished work?",
          "ko": "괜찮아요. 남은 일은 누가 대신할 수 있을까요?"
        }
      },
      {
        "who": "me",
        "text": "ผมคิดว่าคุณต้นน่าจะช่วยได้ครับ เพราะเขารู้เรื่องนี้ดีครับ",
        "gloss": {
          "en": "I think Ton can probably help, because he knows this project well.",
          "ko": "똔 씨가 도와줄 수 있을 것 같아요. 이 일을 잘 알거든요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "โอเค เดี๋ยวคุยกับต้นให้ พักผ่อนเยอะๆ นะ",
        "gloss": {
          "en": "Okay, I'll talk to Ton. Get plenty of rest.",
          "ko": "알겠어요, 똔 씨한테 말해 둘게요. 푹 쉬어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ก่อนที่จะนอน ผมจะส่งไฟล์ให้คุณต้นทางอีเมลครับ",
        "gloss": {
          "en": "Thank you. Before I go to sleep, I'll email the files to Ton.",
          "ko": "고마워요. 자기 전에 똔 씨한테 파일을 이메일로 보낼게요."
        },
        "frames": [
          "th-f3-03"
        ]
      }
    ]
  },
  {
    "id": "th-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a series a friend recommended",
      "ko": "친구가 추천한 드라마 이야기"
    },
    "expressions": [
      "สนุกมาก"
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
        "text": "ดูซีรีส์ที่ฉันแนะนำหรือยัง",
        "gloss": {
          "en": "Have you watched the series I recommended?",
          "ko": "내가 추천한 드라마 봤어?"
        }
      },
      {
        "who": "me",
        "text": "ดูแล้วครับ ซีรีส์ที่คุณแนะนำสนุกมากครับ",
        "gloss": {
          "en": "Yes. The series you recommended was really fun.",
          "ko": "봤어요. 추천해 준 드라마 정말 재밌었어요."
        },
        "frames": [
          "th-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "ใช่ไหมล่ะ ดูถึงตอนไหนแล้ว",
        "gloss": {
          "en": "Right? How far have you got?",
          "ko": "그렇지? 어디까지 봤어?"
        }
      },
      {
        "who": "me",
        "text": "ดูจบแล้วครับ ตอนจบเศร้ากว่าที่คิดครับ",
        "gloss": {
          "en": "I finished it. The ending was sadder than I expected.",
          "ko": "다 봤어요. 결말이 생각보다 슬펐어요."
        },
        "frames": [
          "th-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "ฉันร้องไห้เลยนะตอนนั้น",
        "gloss": {
          "en": "I actually cried at that part.",
          "ko": "나 그 장면에서 울었잖아."
        }
      },
      {
        "who": "me",
        "text": "ผมก็เหมือนกันครับ คุณคิดว่าภาคสองจะเป็นยังไงครับ",
        "gloss": {
          "en": "Me too. What do you think the second season will be like?",
          "ko": "저도요. 시즌 이는 어떨 것 같아요?"
        },
        "frames": [
          "th-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "น่าจะสนุกนะ แต่ต้องรออีกปีหนึ่ง",
        "gloss": {
          "en": "Probably fun, but we have to wait another year.",
          "ko": "재밌을 것 같아. 근데 일 년 더 기다려야 해."
        }
      },
      {
        "who": "me",
        "text": "ถ้าภาคสองออก เราก็ดูด้วยกันนะครับ",
        "gloss": {
          "en": "If the second season comes out, let's watch it together.",
          "ko": "시즌 이 나오면 같이 봐요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Chatting with another learner at a language school",
      "ko": "어학원에서 다른 학생과 대화"
    },
    "expressions": [
      "นานแค่ไหน"
    ],
    "grammar": [
      3,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "คุณพูดภาษาไทยเก่งนะคะ",
        "gloss": {
          "en": "Your Thai is really good.",
          "ko": "태국어 잘하시네요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ผมพูดได้นิดหน่อยครับ",
        "gloss": {
          "en": "Thank you. I can speak a little.",
          "ko": "고마워요. 조금 할 줄 알아요."
        },
        "frames": [
          "th-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "มาอยู่เมืองไทยนานหรือยังคะ",
        "gloss": {
          "en": "Have you been in Thailand long?",
          "ko": "태국에 온 지 오래됐어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาอยู่กรุงเทพฯ มาสองปีแล้วครับ",
        "gloss": {
          "en": "I've been living in Bangkok for two years.",
          "ko": "방콕에 산 지 이 년 됐어요."
        },
        "frames": [
          "th-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "ฉันเพิ่งมาได้สามเดือนเองค่ะ",
        "gloss": {
          "en": "I only arrived three months ago.",
          "ko": "저는 온 지 석 달밖에 안 됐어요."
        }
      },
      {
        "who": "me",
        "text": "แล้วคุณเรียนภาษาไทยมานานแค่ไหนแล้วครับ",
        "gloss": {
          "en": "And how long have you been studying Thai?",
          "ko": "그럼 태국어는 얼마나 배웠어요?"
        },
        "frames": [
          "th-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "ประมาณสองเดือนค่ะ อ่านยังไม่ค่อยได้เลย",
        "gloss": {
          "en": "About two months. I still can't really read.",
          "ko": "두 달쯤요. 아직 잘 못 읽어요."
        }
      },
      {
        "who": "me",
        "text": "ไม่ต้องห่วงครับ ผมคิดว่าการอ่านง่ายกว่าที่คิดครับ",
        "gloss": {
          "en": "Don't worry. I think reading is easier than you'd expect.",
          "ko": "걱정 마요. 읽기는 생각보다 쉬운 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-07"
        ]
      }
    ]
  },
  {
    "id": "th-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Taking a friend to your favorite restaurant",
      "ko": "단골 식당에 친구 데려가기"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ร้านนี้มีอะไรอร่อยบ้าง",
        "gloss": {
          "en": "What's good here?",
          "ko": "이 집은 뭐가 맛있어?"
        }
      },
      {
        "who": "me",
        "text": "ผมชอบแกงมัสมั่นที่สุดครับ",
        "gloss": {
          "en": "I like the massaman curry the most.",
          "ko": "저는 마사만 커리를 제일 좋아해요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "มาบ่อยเหรอ",
        "gloss": {
          "en": "Do you come here often?",
          "ko": "자주 와?"
        }
      },
      {
        "who": "me",
        "text": "บ่อยมากครับ ผมคิดว่าร้านนี้อร่อยที่สุดในซอยนี้ครับ",
        "gloss": {
          "en": "Very often. I think this place is the best on this street.",
          "ko": "아주 자주요. 이 골목에서 여기가 제일 맛있는 것 같아요."
        },
        "frames": [
          "th-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "แล้วเผ็ดไหม",
        "gloss": {
          "en": "Is it spicy?",
          "ko": "맵진 않아?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ค่อยเผ็ดครับ ถ้าคุณไม่ชอบเผ็ด ก็สั่งต้มข่าไก่ได้ครับ",
        "gloss": {
          "en": "Not very. If you don't like spicy food, you can order tom kha gai.",
          "ko": "별로 안 매워요. 매운 거 싫으면 똠카까이를 시켜도 돼요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ดีเลย สั่งทั้งสองอย่างเลย",
        "gloss": {
          "en": "Great, let's order both.",
          "ko": "좋아, 둘 다 시키자."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ หลังจากที่กินเสร็จ เราไปกินของหวานร้านข้างๆ กันนะครับ",
        "gloss": {
          "en": "Sure. After we finish eating, let's get dessert at the place next door.",
          "ko": "좋아요. 다 먹고 나서 옆 가게에 디저트 먹으러 가요."
        },
        "frames": [
          "th-f3-02"
        ]
      }
    ]
  },
  {
    "id": "th-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the condo office about a washing machine",
      "ko": "콘도 관리실에 세탁기 고장 신고"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "นิติบุคคลค่ะ มีอะไรให้ช่วยคะ",
        "gloss": {
          "en": "Building management. How can I help?",
          "ko": "관리사무소입니다. 뭘 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ เครื่องซักผ้าที่ห้องผมเสียครับ",
        "gloss": {
          "en": "Hello, the washing machine in my unit is broken.",
          "ko": "안녕하세요, 저희 집 세탁기가 고장 났어요."
        },
        "frames": [
          "th-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "เสียตั้งแต่เมื่อไรคะ",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터 고장 났어요?"
        }
      },
      {
        "who": "me",
        "text": "ตั้งแต่เมื่อวานครับ หลังจากที่ไฟดับ มันก็เปิดไม่ติดเลยครับ",
        "gloss": {
          "en": "Since yesterday. After the power went out, it won't turn on at all.",
          "ko": "어제부터요. 정전되고 나서 아예 안 켜져요."
        },
        "frames": [
          "th-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "เดี๋ยวจะส่งช่างไปดูให้ค่ะ วันนี้สะดวกไหมคะ",
        "gloss": {
          "en": "I'll send a technician. Is today convenient?",
          "ko": "기사님을 보내 드릴게요. 오늘 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "วันนี้ผมไม่อยู่ครับ ขอเป็นพรุ่งนี้เช้าได้ไหมครับ",
        "gloss": {
          "en": "I'm not home today. Could it be tomorrow morning?",
          "ko": "오늘은 집에 없어요. 내일 아침으로 해 주실 수 있을까요?"
        },
        "frames": [
          "th-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ช่างน่าจะไปถึงประมาณเก้าโมงค่ะ",
        "gloss": {
          "en": "Sure. The technician should arrive around nine.",
          "ko": "네. 기사님이 아홉 시쯤 도착할 거예요."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ถ้าผมไม่รับสาย ก็กดกริ่งได้เลยนะครับ",
        "gloss": {
          "en": "Okay. If I don't answer the phone, just ring the doorbell.",
          "ko": "알겠어요. 제가 전화를 안 받으면 그냥 초인종 눌러 주세요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A job interview",
      "ko": "회사 면접"
    },
    "expressions": [],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "เล่าให้ฟังหน่อยค่ะ ตอนนี้ทำงานอะไรอยู่คะ",
        "gloss": {
          "en": "Tell me a little about yourself. What do you do now?",
          "ko": "소개 좀 해 주세요. 지금 무슨 일을 하세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมเป็นนักออกแบบเว็บไซต์ครับ ทำงานนี้มาห้าปีแล้วครับ",
        "gloss": {
          "en": "I'm a web designer. I've been doing this for five years.",
          "ko": "웹 디자이너예요. 이 일을 한 지 오 년 됐어요."
        },
        "frames": [
          "th-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "พูดภาษาอังกฤษได้ไหมคะ",
        "gloss": {
          "en": "Can you speak English?",
          "ko": "영어 할 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ภาษาจีนผมก็พูดได้นิดหน่อยครับ",
        "gloss": {
          "en": "Yes. I can also speak a little Chinese.",
          "ko": "네. 중국어도 조금 할 줄 알아요."
        },
        "frames": [
          "th-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "ทำไมถึงอยากทำงานที่นี่คะ",
        "gloss": {
          "en": "Why do you want to work here?",
          "ko": "왜 여기서 일하고 싶으세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมคิดว่างานของบริษัทนี้น่าสนใจมากครับ",
        "gloss": {
          "en": "I think this company's work is really interesting.",
          "ko": "이 회사 일이 정말 흥미롭다고 생각해요."
        },
        "frames": [
          "th-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "ถ้าได้งาน จะเริ่มได้เมื่อไรคะ",
        "gloss": {
          "en": "If you get the job, when could you start?",
          "ko": "합격하면 언제부터 일할 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ถ้าได้งาน ผมก็เริ่มได้เดือนหน้าเลยครับ",
        "gloss": {
          "en": "If I get the job, I can start next month.",
          "ko": "합격하면 다음 달부터 바로 시작할 수 있어요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Moving a dinner plan with a friend",
      "ko": "친구와 저녁 약속 미루기"
    },
    "expressions": [
      "ขอเลื่อนนัด",
      "น่าจะ"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล คืนนี้เจอกันหกโมงนะ",
        "gloss": {
          "en": "Hello, see you at six tonight.",
          "ko": "여보세요, 오늘 저녁 여섯 시에 보자."
        }
      },
      {
        "who": "me",
        "text": "ขอโทษนะครับ วันนี้งานเยอะมาก ขอเลื่อนนัดเป็นพรุ่งนี้ได้ไหมครับ",
        "gloss": {
          "en": "Sorry, I have so much work today. Could I move it to tomorrow?",
          "ko": "미안해요. 오늘 일이 너무 많아서요. 내일로 미룰 수 있을까요?"
        },
        "frames": [
          "th-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "ได้สิ ไม่เป็นไร พรุ่งนี้กี่โมงดี",
        "gloss": {
          "en": "Sure, no problem. What time tomorrow?",
          "ko": "그럼, 괜찮아. 내일 몇 시가 좋아?"
        }
      },
      {
        "who": "me",
        "text": "พรุ่งนี้ผมน่าจะเลิกงานประมาณหกโมงครับ",
        "gloss": {
          "en": "Tomorrow I'll probably finish work around six.",
          "ko": "내일은 여섯 시쯤 퇴근할 것 같아요."
        },
        "frames": [
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "งั้นเจอกันที่ร้านเดิมนะ",
        "gloss": {
          "en": "Then let's meet at the usual place.",
          "ko": "그럼 늘 가던 데서 보자."
        }
      },
      {
        "who": "me",
        "text": "ร้านที่เราไปเมื่อเดือนที่แล้วใช่ไหมครับ",
        "gloss": {
          "en": "The place we went to last month, right?",
          "ko": "지난달에 갔던 가게 맞죠?"
        },
        "frames": [
          "th-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "ใช่ ร้านนั้นแหละ",
        "gloss": {
          "en": "Yes, that one.",
          "ko": "응, 거기."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ถ้าผมไปถึงก่อน ผมก็จะจองโต๊ะไว้ครับ",
        "gloss": {
          "en": "Okay. If I get there first, I'll grab a table.",
          "ko": "좋아요. 제가 먼저 도착하면 자리 잡아 둘게요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Buying running shoes",
      "ko": "운동화 사기"
    },
    "expressions": [],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ลองใส่แล้วเป็นยังไงบ้างคะ",
        "gloss": {
          "en": "How do they feel?",
          "ko": "신어 보니 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "สบายกว่าที่คิดครับ",
        "gloss": {
          "en": "More comfortable than I thought.",
          "ko": "생각보다 편해요."
        },
        "frames": [
          "th-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "คู่นี้รุ่นใหม่ค่ะ เบามากนะคะ",
        "gloss": {
          "en": "This is the new model. It's very light.",
          "ko": "이건 신상이에요. 아주 가벼워요."
        }
      },
      {
        "who": "me",
        "text": "คุณคิดว่าสีขาวเป็นยังไงครับ",
        "gloss": {
          "en": "What do you think of the white ones?",
          "ko": "흰색은 어떤 것 같아요?"
        },
        "frames": [
          "th-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "สีขาวสวยค่ะ แต่เปื้อนง่ายนะคะ",
        "gloss": {
          "en": "White looks nice, but it gets dirty easily.",
          "ko": "흰색 예뻐요. 그런데 쉽게 더러워져요."
        }
      },
      {
        "who": "me",
        "text": "จริงด้วยครับ ถ้าอย่างนั้นผมก็เอาสีดำดีกว่าครับ",
        "gloss": {
          "en": "True. In that case, I'd better take the black ones.",
          "ko": "맞아요. 그럼 검은색으로 할게요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ราคาสองพันห้าร้อยบาทค่ะ",
        "gloss": {
          "en": "Sure. That's two thousand five hundred baht.",
          "ko": "네. 이천오백 바트예요."
        }
      },
      {
        "who": "me",
        "text": "ขอจ่ายด้วยบัตรเครดิตได้ไหมครับ",
        "gloss": {
          "en": "Could I pay by credit card?",
          "ko": "신용카드로 계산해도 될까요?"
        },
        "frames": [
          "th-f3-10"
        ]
      }
    ]
  },
  {
    "id": "th-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a coworker about a trip to Chiang Mai",
      "ko": "동료에게 치앙마이 여행 이야기"
    },
    "expressions": [
      "สนุกมาก"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไปเชียงใหม่มาเป็นยังไงบ้าง เล่าให้ฟังหน่อย",
        "gloss": {
          "en": "How was Chiang Mai? Tell me about it.",
          "ko": "치앙마이 어땠어요? 얘기 좀 해 줘요."
        }
      },
      {
        "who": "me",
        "text": "สนุกมากครับ อากาศเย็นกว่าที่คิดครับ",
        "gloss": {
          "en": "It was great fun. The weather was cooler than I thought.",
          "ko": "정말 재밌었어요. 날씨가 생각보다 시원했어요."
        },
        "frames": [
          "th-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "ไปเที่ยวที่ไหนบ้าง",
        "gloss": {
          "en": "Where did you go?",
          "ko": "어디 어디 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "วันแรกไปดอยสุเทพครับ หลังจากที่ลงจากดอย เราไปเดินถนนคนเดินกันครับ",
        "gloss": {
          "en": "On the first day we went to Doi Suthep. After we came down the mountain, we walked around the walking street.",
          "ko": "첫날은 도이수텝에 갔어요. 산에서 내려온 뒤에 야시장 거리를 걸었어요."
        },
        "frames": [
          "th-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "ชอบที่ไหนที่สุด",
        "gloss": {
          "en": "Where did you like most?",
          "ko": "어디가 제일 좋았어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมชอบตลาดกลางคืนที่สุดครับ อาหารถูกและอร่อยมากครับ",
        "gloss": {
          "en": "I liked the night market the most. The food was cheap and delicious.",
          "ko": "야시장이 제일 좋았어요. 음식이 싸고 정말 맛있었어요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "น่าไปจัง ปีหน้าฉันอยากไปบ้าง",
        "gloss": {
          "en": "Sounds great. I want to go next year.",
          "ko": "가 보고 싶다. 내년에 나도 가고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "ถ้าคุณไป ผมก็แนะนำร้านอร่อยๆ ให้ได้นะครับ",
        "gloss": {
          "en": "If you go, I can recommend some good places to eat.",
          "ko": "가게 되면 맛집 추천해 줄게요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a café about a phone you left behind",
      "ko": "카페에 두고 온 휴대폰 문의"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ร้านกาแฟบ้านสวน สวัสดีค่ะ",
        "gloss": {
          "en": "Baan Suan Café, hello.",
          "ko": "반쑤언 카페입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมน่าจะลืมโทรศัพท์ไว้ที่ร้านครับ",
        "gloss": {
          "en": "Hello, I think I probably left my phone at your café.",
          "ko": "안녕하세요, 제가 카페에 휴대폰을 두고 온 것 같아요."
        },
        "frames": [
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "โทรศัพท์แบบไหนคะ",
        "gloss": {
          "en": "What does the phone look like?",
          "ko": "어떤 휴대폰이에요?"
        }
      },
      {
        "who": "me",
        "text": "สีดำ มีเคสสีน้ำเงินครับ ผมนั่งโต๊ะข้างหน้าต่างครับ",
        "gloss": {
          "en": "Black, with a blue case. I sat at the table by the window.",
          "ko": "검은색이고 파란 케이스예요. 창가 자리에 앉았어요."
        }
      },
      {
        "who": "them",
        "text": "เจอแล้วค่ะ พนักงานเก็บไว้ให้ค่ะ",
        "gloss": {
          "en": "Found it. Our staff kept it for you.",
          "ko": "찾았어요. 직원이 보관하고 있어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณมากครับ ขอไปรับตอนห้าโมงเย็นได้ไหมครับ",
        "gloss": {
          "en": "Thank you so much. Could I come pick it up at five p.m.?",
          "ko": "정말 고마워요. 저녁 다섯 시에 찾으러 가도 될까요?"
        },
        "frames": [
          "th-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ร้านปิดสองทุ่มค่ะ",
        "gloss": {
          "en": "Sure. We close at eight p.m.",
          "ko": "네. 저희는 저녁 여덟 시에 닫아요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ก่อนที่จะไป ผมจะโทรมาบอกอีกทีนะครับ",
        "gloss": {
          "en": "Okay. Before I come, I'll call again.",
          "ko": "알겠어요. 가기 전에 다시 전화할게요."
        },
        "frames": [
          "th-f3-03"
        ]
      }
    ]
  },
  {
    "id": "th-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a restaurant about a wrong delivery",
      "ko": "식당에 배달 잘못 온 것 알리기"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ ร้านครัวคุณยายค่ะ",
        "gloss": {
          "en": "Hello, Grandma's Kitchen.",
          "ko": "안녕하세요, 할머니 부엌입니다."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ อาหารที่ผมสั่งมาไม่ถูกครับ",
        "gloss": {
          "en": "Hello, the food I ordered isn't right.",
          "ko": "안녕하세요, 제가 주문한 음식이 잘못 왔어요."
        },
        "frames": [
          "th-f3-04",
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "ขอโทษด้วยค่ะ ได้อะไรไปคะ",
        "gloss": {
          "en": "I'm sorry. What did you get?",
          "ko": "죄송합니다. 뭐가 갔나요?"
        }
      },
      {
        "who": "me",
        "text": "ผมสั่งข้าวผัดปู แต่ได้ข้าวผัดกุ้งมาครับ ผมแพ้กุ้งครับ",
        "gloss": {
          "en": "I ordered crab fried rice but got shrimp fried rice. I'm allergic to shrimp.",
          "ko": "게살 볶음밥을 시켰는데 새우 볶음밥이 왔어요. 저 새우 알레르기가 있어요."
        }
      },
      {
        "who": "them",
        "text": "ขอโทษจริงๆ ค่ะ เดี๋ยวทำใหม่ส่งไปให้นะคะ ประมาณสามสิบนาทีค่ะ",
        "gloss": {
          "en": "I'm really sorry. We'll make a new one and send it, about thirty minutes.",
          "ko": "정말 죄송합니다. 새로 만들어서 보내 드릴게요. 삼십 분쯤 걸려요."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ถ้าส่งมาไม่ทัน ผมก็ต้องออกไปกินข้างนอกครับ",
        "gloss": {
          "en": "Okay. If it doesn't arrive in time, I'll have to go out to eat.",
          "ko": "알겠어요. 제때 안 오면 밖에 나가서 먹어야 해요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ไม่ช้าแน่นอนค่ะ ไรเดอร์ออกไปแล้วค่ะ",
        "gloss": {
          "en": "It definitely won't be late. The rider has already left.",
          "ko": "늦지 않을 거예요. 기사님이 벌써 출발했어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ผมคิดว่ารอได้ครับ",
        "gloss": {
          "en": "Thank you. I think I can wait.",
          "ko": "고마워요. 기다릴 수 있을 것 같아요."
        },
        "frames": [
          "th-f3-05"
        ]
      }
    ]
  },
  {
    "id": "th-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Small talk with a neighbor about the rainy season",
      "ko": "이웃과 장마철 이야기"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "ช่วงนี้ฝนตกทุกวันเลยนะคะ",
        "gloss": {
          "en": "It's been raining every day lately.",
          "ko": "요즘 매일 비가 오네요."
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ผมคิดว่าพรุ่งนี้ก็น่าจะตกอีกครับ",
        "gloss": {
          "en": "Yes. I think it'll probably rain again tomorrow.",
          "ko": "그러게요. 내일도 또 올 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "พรุ่งนี้จะไปไหนหรือเปล่าคะ",
        "gloss": {
          "en": "Are you going anywhere tomorrow?",
          "ko": "내일 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "ตั้งใจจะไปตลาดครับ แต่ถ้าฝนตกหนัก ผมก็อยู่บ้านดีกว่าครับ",
        "gloss": {
          "en": "I'm planning to go to the market, but if it rains hard, I'd better stay home.",
          "ko": "시장에 가려고요. 그런데 비가 많이 오면 집에 있는 게 낫겠어요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ระวังน้ำท่วมนะคะ ซอยนี้น้ำท่วมง่าย",
        "gloss": {
          "en": "Watch out for flooding. This street floods easily.",
          "ko": "침수 조심하세요. 이 골목은 물이 잘 차요."
        }
      },
      {
        "who": "me",
        "text": "จริงเหรอครับ ก่อนที่จะออกจากบ้าน ผมจะดูข่าวก่อนครับ",
        "gloss": {
          "en": "Really? Before I leave the house, I'll check the news.",
          "ko": "정말요? 집을 나서기 전에 뉴스부터 볼게요."
        },
        "frames": [
          "th-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "ดีค่ะ มีร่มไหมคะ",
        "gloss": {
          "en": "Good. Do you have an umbrella?",
          "ko": "좋아요. 우산 있어요?"
        }
      },
      {
        "who": "me",
        "text": "มีครับ แต่ร่มของผมเสียครับ",
        "gloss": {
          "en": "I do, but my umbrella is broken.",
          "ko": "있어요. 그런데 제 우산이 고장 났어요."
        },
        "frames": [
          "th-f3-14"
        ]
      }
    ]
  },
  {
    "id": "th-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Meeting someone at a photography club",
      "ko": "사진 동호회에서 만난 사람"
    },
    "expressions": [
      "นานแค่ไหน"
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
        "text": "กล้องสวยจังครับ ชอบถ่ายรูปเหรอครับ",
        "gloss": {
          "en": "Nice camera. Do you like taking photos?",
          "ko": "카메라 멋지네요. 사진 찍는 거 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "ครับ ผมชอบถ่ายรูปวิวที่สุดครับ",
        "gloss": {
          "en": "Yes. I like taking landscape photos the most.",
          "ko": "네. 풍경 사진 찍는 걸 제일 좋아해요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "ผมก็ชอบเหมือนกันครับ",
        "gloss": {
          "en": "Me too.",
          "ko": "저도 좋아해요."
        }
      },
      {
        "who": "me",
        "text": "คุณถ่ายรูปมานานแค่ไหนแล้วครับ",
        "gloss": {
          "en": "How long have you been taking photos?",
          "ko": "사진 찍은 지 얼마나 됐어요?"
        },
        "frames": [
          "th-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "ประมาณสิบปีแล้วครับ ตอนนี้ผมสอนถ่ายรูปด้วย",
        "gloss": {
          "en": "About ten years. I teach photography now, too.",
          "ko": "십 년쯤 됐어요. 지금은 사진도 가르쳐요."
        }
      },
      {
        "who": "me",
        "text": "เก่งจังครับ ผมเพิ่งเริ่มครับ ผมแต่งรูปได้นิดหน่อยครับ",
        "gloss": {
          "en": "Impressive. I just started. I can edit photos a little.",
          "ko": "대단하시네요. 저는 막 시작했어요. 사진 보정은 조금 할 줄 알아요."
        },
        "frames": [
          "th-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "ถ้าว่าง มาเรียนกับเราได้นะครับ",
        "gloss": {
          "en": "If you're free, you can come learn with us.",
          "ko": "시간 되면 저희랑 같이 배워요."
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ ถ้ามีคลาสวันเสาร์ ผมก็ไปได้ครับ",
        "gloss": {
          "en": "Great. If there's a Saturday class, I can come.",
          "ko": "좋아요. 토요일 수업이 있으면 갈 수 있어요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Viewing an apartment with a friend",
      "ko": "친구와 집 보러 가기"
    },
    "expressions": [],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ห้องนี้เป็นยังไงบ้าง",
        "gloss": {
          "en": "What do you think of this room?",
          "ko": "이 방 어때?"
        }
      },
      {
        "who": "me",
        "text": "ใหญ่กว่าที่คิดครับ แต่ไกลสถานีนิดหน่อยครับ",
        "gloss": {
          "en": "Bigger than I thought, but a bit far from the station.",
          "ko": "생각보다 넓어요. 그런데 역에서 좀 멀어요."
        },
        "frames": [
          "th-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "ห้องเมื่อเช้าใกล้สถานีกว่านะ",
        "gloss": {
          "en": "The one this morning was closer to the station.",
          "ko": "아침에 본 방이 역에서 더 가깝잖아."
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ คุณคิดว่าห้องเมื่อเช้าเป็นยังไงครับ",
        "gloss": {
          "en": "Right. What did you think of the one this morning?",
          "ko": "맞아요. 아침에 본 방은 어땠어요?"
        },
        "frames": [
          "th-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ฉันว่าห้องเมื่อเช้าเล็กไป แต่ถูกกว่า",
        "gloss": {
          "en": "I thought it was too small, but cheaper.",
          "ko": "너무 작은데 더 싸던데."
        }
      },
      {
        "who": "me",
        "text": "ผมคิดว่าห้องนี้น่าอยู่กว่าครับ",
        "gloss": {
          "en": "I think this room is nicer to live in.",
          "ko": "저는 이 방이 더 살기 좋은 것 같아요."
        },
        "frames": [
          "th-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "ถ้าชอบก็ตัดสินใจเลยสิ",
        "gloss": {
          "en": "If you like it, just decide.",
          "ko": "마음에 들면 그냥 결정해."
        }
      },
      {
        "who": "me",
        "text": "ก่อนที่จะเซ็นสัญญา ผมขอคิดอีกวันหนึ่งครับ",
        "gloss": {
          "en": "Before signing the contract, I'd like one more day to think.",
          "ko": "계약하기 전에 하루만 더 생각해 볼게요."
        },
        "frames": [
          "th-f3-03"
        ]
      }
    ]
  },
  {
    "id": "th-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A repairman fixes a leaking faucet",
      "ko": "수리 기사가 새는 수도꼭지를 고칠 때"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีครับ ช่างประปาครับ มีปัญหาอะไรครับ",
        "gloss": {
          "en": "Hello, I'm the plumber. What's the problem?",
          "ko": "안녕하세요, 배관 기사예요. 무슨 문제예요?"
        }
      },
      {
        "who": "me",
        "text": "ก๊อกน้ำในห้องน้ำเสียครับ ปิดแล้วน้ำยังไหลอยู่ครับ",
        "gloss": {
          "en": "The bathroom faucet is broken. Water keeps running even when it's off.",
          "ko": "화장실 수도꼭지가 고장 났어요. 잠가도 물이 계속 나와요."
        },
        "frames": [
          "th-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "เป็นมานานหรือยังครับ",
        "gloss": {
          "en": "Has it been like this long?",
          "ko": "이렇게 된 지 오래됐어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมคิดว่าน่าจะประมาณหนึ่งอาทิตย์ครับ",
        "gloss": {
          "en": "I think it's probably been about a week.",
          "ko": "일주일쯤 된 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "ต้องเปลี่ยนก๊อกใหม่ครับ ค่าของประมาณห้าร้อยบาท",
        "gloss": {
          "en": "It needs a new faucet. The part is about five hundred baht.",
          "ko": "새 수도꼭지로 바꿔야 해요. 부품값이 오백 바트쯤이에요."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ก่อนที่จะเปลี่ยน ช่วยดูท่อใต้อ่างล้างหน้าด้วยได้ไหมครับ",
        "gloss": {
          "en": "Okay. Before you replace it, could you also look at the pipe under the sink?",
          "ko": "네. 바꾸기 전에 세면대 밑 배관도 봐 주실 수 있어요?"
        },
        "frames": [
          "th-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ท่อไม่เป็นไรครับ เสร็จแล้วครับ",
        "gloss": {
          "en": "Sure. The pipe is fine. All done.",
          "ko": "네. 배관은 괜찮아요. 다 됐어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ ขอใบเสร็จได้ไหมครับ",
        "gloss": {
          "en": "Thank you. Could I have a receipt?",
          "ko": "고마워요. 영수증 받을 수 있을까요?"
        },
        "frames": [
          "th-f3-10"
        ]
      }
    ]
  },
  {
    "id": "th-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Catching up with an old classmate",
      "ko": "오랜만에 만난 동창과 근황 이야기"
    },
    "expressions": [
      "นานแค่ไหน"
    ],
    "grammar": [
      0,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ไม่เจอกันนานเลยนะ ตอนนี้ทำงานที่ไหน",
        "gloss": {
          "en": "Long time no see. Where are you working now?",
          "ko": "오랜만이다. 지금 어디서 일해?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาอยู่บริษัทท่องเที่ยวมาสามปีแล้วครับ",
        "gloss": {
          "en": "I've been at a travel company for three years.",
          "ko": "여행사에 들어간 지 삼 년 됐어요."
        },
        "frames": [
          "th-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "ดีจัง ยังเล่นกีตาร์อยู่ไหม",
        "gloss": {
          "en": "Nice. Do you still play guitar?",
          "ko": "좋네. 아직 기타 쳐?"
        }
      },
      {
        "who": "me",
        "text": "ยังเล่นอยู่ครับ แต่ตอนนี้ผมชอบวาดรูปที่สุดครับ",
        "gloss": {
          "en": "I still play, but right now I like drawing the most.",
          "ko": "아직 쳐요. 그런데 요즘은 그림 그리는 게 제일 좋아요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "วาดรูปเหรอ เท่จัง",
        "gloss": {
          "en": "Drawing? Cool.",
          "ko": "그림? 멋지다."
        }
      },
      {
        "who": "me",
        "text": "แล้วคุณล่ะครับ ทำงานที่โรงพยาบาลมานานแค่ไหนแล้วครับ",
        "gloss": {
          "en": "And you? How long have you been working at the hospital?",
          "ko": "그쪽은요? 병원에서 일한 지 얼마나 됐어요?"
        },
        "frames": [
          "th-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "ห้าปีแล้ว เหนื่อยมากแต่ชอบนะ",
        "gloss": {
          "en": "Five years. It's exhausting, but I like it.",
          "ko": "오 년 됐어. 많이 힘들지만 좋아."
        }
      },
      {
        "who": "me",
        "text": "เก่งมากครับ ถ้าว่างเมื่อไร เราก็ไปกินข้าวกันนะครับ",
        "gloss": {
          "en": "That's great. Whenever you're free, let's go eat together.",
          "ko": "대단해요. 시간 날 때 같이 밥 먹어요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Opening a bank account",
      "ko": "은행 계좌 만들기"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ ต้องการทำอะไรคะ",
        "gloss": {
          "en": "Hello, what can I do for you?",
          "ko": "안녕하세요, 무슨 업무 보시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมอยากเปิดบัญชีครับ",
        "gloss": {
          "en": "I'd like to open an account.",
          "ko": "계좌를 만들고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "มีพาสปอร์ตกับใบอนุญาตทำงานไหมคะ",
        "gloss": {
          "en": "Do you have your passport and work permit?",
          "ko": "여권이랑 취업 허가증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "มีครับ แต่ใบอนุญาตทำงานลืมไว้ที่บ้าน ขอส่งรูปถ่ายแทนได้ไหมครับ",
        "gloss": {
          "en": "Yes, but I left the work permit at home. Could I send a photo of it instead?",
          "ko": "있어요. 그런데 취업 허가증을 집에 두고 왔어요. 대신 사진을 보내도 될까요?"
        },
        "frames": [
          "th-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ต้องเป็นตัวจริงค่ะ",
        "gloss": {
          "en": "It has to be the original.",
          "ko": "원본이어야 해요."
        }
      },
      {
        "who": "me",
        "text": "เข้าใจครับ ถ้าผมกลับไปเอามา ก็ยังทันไหมครับ",
        "gloss": {
          "en": "I see. If I go back and get it, will there still be time?",
          "ko": "알겠어요. 다시 가서 가져오면 아직 시간 될까요?"
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ทันค่ะ ธนาคารปิดสี่โมงค่ะ",
        "gloss": {
          "en": "Yes, the bank closes at four.",
          "ko": "돼요. 은행은 네 시에 닫아요."
        }
      },
      {
        "who": "me",
        "text": "ครับ บ้านผมอยู่ใกล้ๆ น่าจะกลับมาได้ภายในหนึ่งชั่วโมงครับ",
        "gloss": {
          "en": "Okay. My place is close, so I can probably be back within an hour.",
          "ko": "네. 집이 가까워서 한 시간 안에 돌아올 수 있을 것 같아요."
        },
        "frames": [
          "th-f3-16"
        ]
      }
    ]
  },
  {
    "id": "th-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a friend's birthday party",
      "ko": "친구 생일 파티 계획"
    },
    "expressions": [
      "น่าจะ"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "วันเกิดฝนอาทิตย์หน้า จัดปาร์ตี้ที่ไหนดี",
        "gloss": {
          "en": "Fon's birthday is next week. Where should we have the party?",
          "ko": "다음 주가 폰 생일인데, 파티 어디서 할까?"
        }
      },
      {
        "who": "me",
        "text": "ผมคิดว่าร้านหมูกระทะใกล้มหาลัยน่าจะดีครับ",
        "gloss": {
          "en": "I think the Thai barbecue place near the university would probably be good.",
          "ko": "대학 근처 무까타 가게가 좋을 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "ร้านนั้นคนเยอะไหม",
        "gloss": {
          "en": "Is that place crowded?",
          "ko": "거기 사람 많아?"
        }
      },
      {
        "who": "me",
        "text": "วันธรรมดาไม่เยอะครับ ถ้าจองก่อน ก็ได้โต๊ะใหญ่ครับ",
        "gloss": {
          "en": "Not on weekdays. If we book ahead, we can get a big table.",
          "ko": "평일엔 많지 않아요. 미리 예약하면 큰 테이블 잡을 수 있어요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "แล้วของขวัญล่ะ ซื้ออะไรดี",
        "gloss": {
          "en": "And the present? What should we buy?",
          "ko": "선물은? 뭐 살까?"
        }
      },
      {
        "who": "me",
        "text": "ฝนฟังเพลงทุกวัน คุณคิดว่าหูฟังเป็นยังไงครับ",
        "gloss": {
          "en": "Fon listens to music every day. What do you think of headphones?",
          "ko": "폰은 매일 음악을 들으니까요. 헤드폰은 어떨 것 같아요?"
        },
        "frames": [
          "th-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ดีเหมือนกัน งั้นซื้อหูฟังนะ",
        "gloss": {
          "en": "Good idea. Let's get headphones then.",
          "ko": "그것도 좋네. 그럼 헤드폰 사자."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ก่อนที่จะไปร้าน เราไปซื้อของขวัญด้วยกันนะครับ",
        "gloss": {
          "en": "Okay. Before we go to the restaurant, let's go buy the present together.",
          "ko": "좋아요. 가게 가기 전에 같이 선물 사러 가요."
        },
        "frames": [
          "th-f3-03"
        ]
      }
    ]
  }
];
