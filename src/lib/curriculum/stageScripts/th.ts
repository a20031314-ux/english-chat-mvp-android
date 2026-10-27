import type { StageScript } from "../stageScripts.ts";

/** th 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const TH: StageScript[] = [
  {
    "id": "th-1-1",
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
    "situation": 0,
    "setting": {
      "en": "First day of a Thai class: meeting Yuki, a classmate from Japan",
      "ko": "태국어 수업 첫날, 일본에서 온 같은 반 친구 유키와 인사하기"
    },
    "expressions": [
      "สวัสดี",
      "ครับ",
      "ยินดีที่ได้รู้จัก",
      "มาจากไหน",
      "ใช่"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ ฉันชื่อยูกิค่ะ คุณชื่ออะไรคะ",
        "gloss": {
          "en": "Hello, I'm Yuki. What's your name?",
          "ko": "안녕하세요, 저는 유키예요. 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมชื่อมินจุนครับ ยินดีที่ได้รู้จักครับ",
        "gloss": {
          "en": "Hello, my name is Min-jun. Nice to meet you.",
          "ko": "안녕하세요, 저는 민준이에요. 만나서 반가워요."
        },
        "frames": [
          "th-f1-01",
          "th-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "ยินดีที่ได้รู้จักค่ะ คุณมาจากไหนคะ",
        "gloss": {
          "en": "Nice to meet you too. Where are you from?",
          "ko": "저도 반가워요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมมาจากเกาหลีครับ คุณมาจากไหนครับ",
        "gloss": {
          "en": "I'm from Korea. Where are you from?",
          "ko": "저는 한국에서 왔어요. 유키 씨는 어디서 왔어요?"
        },
        "frames": [
          "th-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "ฉันมาจากญี่ปุ่นค่ะ คุณเป็นนักเรียนไหมคะ",
        "gloss": {
          "en": "I'm from Japan. Are you a student?",
          "ko": "저는 일본에서 왔어요. 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ใช่ครับ ผมเป็นพนักงานบริษัทครับ",
        "gloss": {
          "en": "No, I'm an office worker.",
          "ko": "아니요, 저는 회사원이에요."
        },
        "frames": [
          "th-f1-03",
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "ห้องเรียนเราอยู่ชั้นสามใช่ไหมคะ",
        "gloss": {
          "en": "Our classroom is on the third floor, right?",
          "ko": "우리 교실 삼 층 맞죠?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ ห้องเรียนอยู่ชั้นสามครับ",
        "gloss": {
          "en": "Yes, the classroom is on the third floor.",
          "ko": "네, 교실은 삼 층에 있어요."
        }
      }
    ]
  },
  {
    "id": "th-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying mangoes from a vendor at a market stall",
      "ko": "시장 과일 노점에서 상인에게 망고 사기"
    },
    "expressions": [
      "สวัสดี",
      "ครับ",
      "เท่าไร",
      "แพงไป",
      "ลดได้ไหม",
      "โอเค",
      "เอาอันนี้",
      "ไม่เป็นไร",
      "ขอบคุณ"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ จะเอาอะไรคะ",
        "gloss": {
          "en": "Hello, what would you like?",
          "ko": "안녕하세요, 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ มะม่วงกิโลละเท่าไรครับ",
        "gloss": {
          "en": "Hello. How much are the mangoes a kilo?",
          "ko": "안녕하세요. 망고 1킬로에 얼마예요?"
        },
        "frames": [
          "th-f1-15",
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "กิโลละหนึ่งร้อยบาทค่ะ หวานมากนะคะ",
        "gloss": {
          "en": "A hundred baht a kilo. They're very sweet.",
          "ko": "1킬로에 100바트예요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "แพงไปครับ ลดได้ไหมครับ",
        "gloss": {
          "en": "That's too expensive. Can you go lower?",
          "ko": "너무 비싸요. 깎아 줄 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ กิโลละแปดสิบบาทค่ะ",
        "gloss": {
          "en": "OK, eighty baht a kilo.",
          "ko": "좋아요, 1킬로에 80바트요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เอาอันนี้สองกิโลครับ",
        "gloss": {
          "en": "OK. I'll take these, two kilos.",
          "ko": "좋아요. 이걸로 2킬로 주세요."
        },
        "frames": [
          "th-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "ทั้งหมดหนึ่งร้อยหกสิบบาทค่ะ เอาถุงไหมคะ",
        "gloss": {
          "en": "That's a hundred and sixty baht altogether. Do you want a bag?",
          "ko": "전부 160바트예요. 봉지 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ ขอบคุณครับ",
        "gloss": {
          "en": "No need. Thank you.",
          "ko": "괜찮아요. 고맙습니다."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a staff member in a shopping mall where the toilet is",
      "ko": "쇼핑몰 직원에게 화장실 위치 묻기"
    },
    "expressions": [
      "ขอโทษ",
      "ห้องน้ำอยู่ที่ไหน",
      "ไม่เข้าใจ",
      "พูดช้าๆ หน่อย",
      "ชื่ออะไร",
      "โอเค",
      "ขอบคุณ"
    ],
    "grammar": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ",
        "gloss": {
          "en": "Hello, can I help you?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ ห้องน้ำอยู่ที่ไหนครับ",
        "gloss": {
          "en": "Excuse me, where is the toilet?",
          "ko": "실례합니다, 화장실이 어디 있어요?"
        },
        "frames": [
          "th-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "ห้องน้ำอยู่ชั้นสอง ข้างร้านกาแฟค่ะ",
        "gloss": {
          "en": "The toilet is on the second floor, next to the café.",
          "ko": "화장실은 이 층 카페 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ ผมไม่เข้าใจ พูดช้าๆ หน่อยได้ไหมครับ",
        "gloss": {
          "en": "Sorry, I don't understand. Could you speak a bit slowly?",
          "ko": "죄송해요, 못 알아들었어요. 좀 천천히 말해 주실 수 있어요?"
        },
        "frames": [
          "th-f1-11",
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ชั้นสอง ข้างร้านกาแฟค่ะ",
        "gloss": {
          "en": "Sure. Second floor, next to the café.",
          "ko": "네. 이 층, 카페 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "ชั้นสองนะครับ ร้านกาแฟชื่ออะไรครับ",
        "gloss": {
          "en": "Second floor, OK. What's the café called?",
          "ko": "이 층이요. 카페 이름이 뭐예요?"
        },
        "frames": [
          "th-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "ร้านชื่อบ้านกาแฟค่ะ ลิฟต์อยู่ทางขวาค่ะ",
        "gloss": {
          "en": "It's called Baan Kafae. The lift is on the right.",
          "ko": "가게 이름은 반까페예요. 엘리베이터는 오른쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ขอบคุณมากครับ",
        "gloss": {
          "en": "OK. Thank you very much.",
          "ko": "알겠어요. 정말 고맙습니다."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-1-4",
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
    "situation": 3,
    "setting": {
      "en": "Checking out and saying goodbye to the hotel receptionist",
      "ko": "체크아웃하며 호텔 직원과 작별 인사하기"
    },
    "expressions": [
      "สวัสดี",
      "ใช่",
      "สบายดีไหม",
      "เดี๋ยวนะ",
      "เท่าไร",
      "ขอบคุณ",
      "ลาก่อน"
    ],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ คุณมินจุน จะเช็กเอาต์ใช่ไหมคะ",
        "gloss": {
          "en": "Hello, Mr. Min-jun. Checking out?",
          "ko": "안녕하세요, 민준 님. 체크아웃하시죠?"
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ใช่ครับ สบายดีไหมครับ",
        "gloss": {
          "en": "Hello. Yes. How are you?",
          "ko": "안녕하세요. 네. 잘 지내셨어요?"
        },
        "frames": [
          "th-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "สบายดีค่ะ ขอกุญแจห้องด้วยนะคะ",
        "gloss": {
          "en": "I'm well. Could I have the room key, please?",
          "ko": "잘 지내요. 방 열쇠 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "นี่ครับ ขอใบเสร็จด้วยครับ",
        "gloss": {
          "en": "Here you are. A receipt too, please.",
          "ko": "여기요. 영수증도 주세요."
        },
        "frames": [
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "นี่ใบเสร็จค่ะ จะให้เรียกแท็กซี่ไหมคะ",
        "gloss": {
          "en": "Here's the receipt. Shall I call you a taxi?",
          "ko": "영수증 여기 있어요. 택시 불러 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "เดี๋ยวนะครับ แท็กซี่ไปสนามบินเท่าไรครับ",
        "gloss": {
          "en": "Just a moment. How much is a taxi to the airport?",
          "ko": "잠깐만요. 공항까지 택시 얼마예요?"
        },
        "frames": [
          "th-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "ประมาณสี่ร้อยบาทค่ะ ขอบคุณที่มาพักนะคะ",
        "gloss": {
          "en": "About four hundred baht. Thank you for staying with us.",
          "ko": "400바트 정도예요. 묵어 주셔서 감사합니다."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณมากครับ ลาก่อนครับ",
        "gloss": {
          "en": "Thank you very much. Goodbye.",
          "ko": "정말 고맙습니다. 안녕히 계세요."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-1-x1",
    "stage": 1,
    "setting": {
      "en": "In Thai class: the teacher explains the polite particles ครับ and ค่ะ",
      "ko": "태국어 수업: 선생님이 공손 어미 크랍과 카를 설명함"
    },
    "expressions": [
      "ขอโทษ",
      "อีกครั้ง",
      "ค่ะ",
      "ครับ",
      "ใช่",
      "ขอบคุณ"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "ผู้หญิงพูดว่าค่ะ ผู้ชายพูดว่าครับนะคะ",
        "gloss": {
          "en": "Women say kha, men say khrap.",
          "ko": "여자는 '카', 남자는 '크랍'이라고 해요."
        }
      },
      {
        "who": "me",
        "text": "ขอโทษครับ พูดอีกครั้งได้ไหมครับ",
        "gloss": {
          "en": "Sorry, could you say that again?",
          "ko": "죄송해요, 다시 말해 주실 수 있어요?"
        },
        "frames": [
          "th-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "ผู้หญิงพูดว่าค่ะ ผู้ชายพูดว่าครับค่ะ",
        "gloss": {
          "en": "Women say kha, men say khrap.",
          "ko": "여자는 '카', 남자는 '크랍'이라고 해요."
        }
      },
      {
        "who": "me",
        "text": "ผู้หญิงพูดว่าค่ะ ผมพูดว่าครับ ใช่ไหมครับ",
        "gloss": {
          "en": "Women say kha, and I say khrap, right?",
          "ko": "여자는 '카', 저는 '크랍'이라고 하는 거죠?"
        },
        "frames": [
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "ใช่ค่ะ เก่งมากค่ะ",
        "gloss": {
          "en": "That's right. Very good.",
          "ko": "맞아요. 아주 잘했어요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับครู",
        "gloss": {
          "en": "Thank you, teacher.",
          "ko": "고맙습니다, 선생님."
        },
        "frames": [
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-2-1",
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
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Bumping into your friend Ton and making plans for the weekend",
      "ko": "친구 똔을 우연히 만나 주말 약속 잡기"
    },
    "expressions": [
      "ไปไหนมา",
      "ว่างไหม",
      "ไปด้วยกันไหม",
      "เจอกันกี่โมง"
    ],
    "grammar": [
      0,
      1,
      3,
      5
    ],
    "earlierGrammar": [
      "1:2",
      "1:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "อ้าว มินจุน ไม่ได้เจอกันนานเลย",
        "gloss": {
          "en": "Oh, Min-jun! Long time no see.",
          "ko": "어, 민준! 진짜 오랜만이다."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับพี่ต้น ไปไหนมาครับ",
        "gloss": {
          "en": "Hi, Ton. Where have you been?",
          "ko": "안녕하세요, 똔 형. 어디 갔다 와요?"
        },
        "frames": [
          "th-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "ไปซื้อของที่ตลาดมา กินข้าวหรือยัง",
        "gloss": {
          "en": "I've been shopping at the market. Have you eaten?",
          "ko": "시장에 장 보러 갔다 왔어. 밥 먹었어?"
        }
      },
      {
        "who": "me",
        "text": "กินแล้วครับ เสาร์นี้พี่ว่างไหมครับ",
        "gloss": {
          "en": "I've eaten. Are you free this Saturday?",
          "ko": "먹었어요. 형 이번 토요일에 시간 있어요?"
        },
        "frames": [
          "th-f2-01",
          "th-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "ว่างนะ มีอะไรเหรอ",
        "gloss": {
          "en": "Yes, I'm free. What's up?",
          "ko": "응, 한가해. 왜?"
        }
      },
      {
        "who": "me",
        "text": "ผมอยากไปทะเลครับ ไปด้วยกันไหมครับ",
        "gloss": {
          "en": "I want to go to the beach. Do you want to come along?",
          "ko": "바다에 가고 싶어요. 같이 갈래요?"
        },
        "frames": [
          "th-f2-04",
          "th-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ดีเลย แต่วันเสาร์พี่จะไปหาแม่ ไปวันอาทิตย์ได้ไหม",
        "gloss": {
          "en": "Great! But on Saturday I'm visiting my mum. Can we go on Sunday?",
          "ko": "좋지! 근데 토요일엔 엄마 보러 가. 일요일에 가도 돼?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ วันอาทิตย์ก็ได้ครับ เจอกันกี่โมงดีครับ",
        "gloss": {
          "en": "Sure, Sunday's fine. What time shall we meet?",
          "ko": "네, 일요일도 좋아요. 몇 시에 만날까요?"
        }
      },
      {
        "who": "them",
        "text": "เจ็ดโมงเช้าที่สถานีหมอชิตนะ",
        "gloss": {
          "en": "Seven in the morning at Mo Chit station.",
          "ko": "아침 일곱 시에 머칫역에서 보자."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ ผมจะไปรอที่สถานี แล้วเจอกันวันอาทิตย์นะครับ",
        "gloss": {
          "en": "OK. I'll wait at the station. See you on Sunday.",
          "ko": "좋아요. 역에서 기다릴게요. 일요일에 봐요."
        },
        "frames": [
          "th-f2-02"
        ]
      }
    ]
  },
  {
    "id": "th-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering stir-fried holy basil at a street food stall",
      "ko": "길거리 노점에서 바질 볶음 주문하기"
    },
    "expressions": [
      "ไม่เผ็ด",
      "เผ็ดนิดหน่อย",
      "ไม่ค่อยชอบ",
      "อร่อยมาก",
      "ชอบมาก",
      "เช็คบิล"
    ],
    "grammar": [
      0,
      3
    ],
    "earlierGrammar": [
      "1:2",
      "1:4",
      "1:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "จะรับอะไรดีคะ",
        "gloss": {
          "en": "What would you like?",
          "ko": "뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอผัดกะเพราหมูหนึ่งจานครับ ไม่เผ็ดนะครับ",
        "gloss": {
          "en": "One plate of pork with holy basil, please. Not spicy.",
          "ko": "돼지고기 바질 볶음 하나 주세요. 안 맵게요."
        },
        "frames": [
          "th-f2-12",
          "th-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "ไม่เผ็ดเลยเหรอคะ เผ็ดนิดหน่อยได้ไหมคะ",
        "gloss": {
          "en": "Not spicy at all? How about a little spicy?",
          "ko": "전혀 안 맵게요? 조금 맵게는 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "เผ็ดนิดหน่อยก็ได้ครับ ผมไม่ค่อยชอบเผ็ดมากครับ",
        "gloss": {
          "en": "A little spicy is fine. I don't really like it very hot.",
          "ko": "조금 맵게는 괜찮아요. 너무 매운 건 별로 안 좋아해요."
        },
        "frames": [
          "th-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ใส่ไข่ดาวไหมคะ",
        "gloss": {
          "en": "Sure. Do you want a fried egg on top?",
          "ko": "네. 계란 프라이 올려 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ใส่ครับ ผมอยากลองไข่ดาวแบบไทยครับ",
        "gloss": {
          "en": "Yes, please. I want to try a Thai-style fried egg.",
          "ko": "네, 올려 주세요. 태국식 계란 프라이 먹어 보고 싶어요."
        },
        "frames": [
          "th-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "ได้แล้วค่ะ ร้อนนะคะ",
        "gloss": {
          "en": "Here you go. It's hot.",
          "ko": "나왔어요. 뜨거워요."
        }
      },
      {
        "who": "me",
        "text": "อร่อยมากครับ ผมชอบมากครับ",
        "gloss": {
          "en": "It's delicious. I really like it.",
          "ko": "정말 맛있어요. 너무 좋아요."
        }
      },
      {
        "who": "them",
        "text": "ขอบคุณค่ะ จะเอาอะไรเพิ่มไหมคะ",
        "gloss": {
          "en": "Thank you. Would you like anything else?",
          "ko": "고마워요. 더 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ครับ อิ่มแล้วครับ เช็คบิลด้วยครับ",
        "gloss": {
          "en": "No, I'm full. The bill, please.",
          "ko": "아니요, 배불러요. 계산해 주세요."
        },
        "frames": [
          "th-f2-01"
        ]
      }
    ]
  },
  {
    "id": "th-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Taking a metered taxi to a shopping mall in Bangkok",
      "ko": "방콕에서 미터 택시를 타고 쇼핑몰에 가기"
    },
    "expressions": [
      "ตรงไป",
      "เลี้ยวซ้าย",
      "จอดตรงนี้"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "earlierGrammar": [
      "1:0",
      "1:4"
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
        "text": "ไปที่สยามพารากอนครับ ช่วยเปิดมิเตอร์หน่อยครับ",
        "gloss": {
          "en": "To Siam Paragon, please. Please turn on the meter.",
          "ko": "시암 파라곤으로 가 주세요. 미터기 좀 켜 주세요."
        },
        "frames": [
          "th-f2-10",
          "th-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "ได้ครับ ขึ้นทางด่วนไหมครับ รถติดมาก",
        "gloss": {
          "en": "Sure. Shall we take the expressway? The traffic's bad.",
          "ko": "네. 고속도로 탈까요? 길이 많이 막혀요."
        }
      },
      {
        "who": "me",
        "text": "ไม่ขึ้นทางด่วนครับ เพราะวันนี้ผมไม่รีบครับ",
        "gloss": {
          "en": "No expressway, please. I'm not in a hurry today.",
          "ko": "고속도로는 안 탈게요. 오늘은 안 바빠서요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "มาเที่ยวกรุงเทพฯ เหรอครับ",
        "gloss": {
          "en": "Are you visiting Bangkok?",
          "ko": "방콕에 여행 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่ใช่ครับ ผมทำงานที่นี่ ตอนนี้ผมกำลังเรียนภาษาไทยอยู่ครับ",
        "gloss": {
          "en": "No, I work here. I'm learning Thai at the moment.",
          "ko": "아니요, 여기서 일해요. 지금 태국어를 배우고 있어요."
        },
        "frames": [
          "th-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "เก่งมากครับ ใกล้ถึงแล้ว จะลงตรงไหนครับ",
        "gloss": {
          "en": "You're very good. We're nearly there. Where do you want to get out?",
          "ko": "잘하시네요. 거의 다 왔어요. 어디서 내리세요?"
        }
      },
      {
        "who": "me",
        "text": "ตรงไปอีกนิดครับ แล้วเลี้ยวซ้ายครับ",
        "gloss": {
          "en": "Go straight a little more, then turn left.",
          "ko": "조금 더 직진하다가 왼쪽으로 도세요."
        },
        "frames": [
          "th-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "เลี้ยวซ้ายแล้วครับ ตรงนี้ใช่ไหมครับ",
        "gloss": {
          "en": "We've turned left. Is it here?",
          "ko": "왼쪽으로 돌았어요. 여기 맞아요?"
        }
      },
      {
        "who": "me",
        "text": "ใช่ครับ จอดตรงนี้ครับ เท่าไรครับ",
        "gloss": {
          "en": "Yes, stop here, please. How much is it?",
          "ko": "네, 여기 세워 주세요. 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "th-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Buying cold medicine at a pharmacy",
      "ko": "약국에서 감기약 사기"
    },
    "expressions": [
      "ไม่สบาย",
      "ปวดหัว",
      "ยังไม่ได้"
    ],
    "grammar": [
      1,
      4,
      7
    ],
    "earlierGrammar": [
      "1:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ เป็นอะไรมาคะ",
        "gloss": {
          "en": "Hello. What seems to be the problem?",
          "ko": "안녕하세요. 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "ผมไม่สบายครับ ปวดหัวแล้วก็มีน้ำมูกครับ",
        "gloss": {
          "en": "I'm not well. I have a headache and a runny nose.",
          "ko": "몸이 안 좋아요. 머리가 아프고 콧물이 나요."
        },
        "frames": [
          "th-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "เป็นมากี่วันแล้วคะ มีไข้ไหมคะ",
        "gloss": {
          "en": "How many days has it been? Do you have a fever?",
          "ko": "며칠 됐어요? 열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "สองวันแล้วครับ ไม่มีไข้ครับ",
        "gloss": {
          "en": "Two days now. No fever.",
          "ko": "이틀 됐어요. 열은 없어요."
        },
        "frames": [
          "th-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "กินยาอะไรไปหรือยังคะ",
        "gloss": {
          "en": "Have you taken any medicine yet?",
          "ko": "약은 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ยังไม่ได้กินครับ เพราะไม่รู้ว่าจะกินยาอะไรครับ",
        "gloss": {
          "en": "Not yet, because I didn't know what to take.",
          "ko": "아직 안 먹었어요. 무슨 약을 먹어야 할지 몰라서요."
        },
        "frames": [
          "th-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "งั้นกินยานี้นะคะ วันละสามครั้งหลังอาหาร แล้วก็พักผ่อนเยอะๆ ค่ะ",
        "gloss": {
          "en": "Then take this. Three times a day after meals, and get plenty of rest.",
          "ko": "그럼 이 약 드세요. 하루 세 번 식후에요. 그리고 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "ช่วยเขียนวิธีกินให้หน่อยครับ ผมจะได้ไม่ลืมครับ",
        "gloss": {
          "en": "Could you write down how to take it? So I won't forget.",
          "ko": "먹는 법 좀 써 주세요. 안 잊어버리게요."
        },
        "frames": [
          "th-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ เขียนไว้ที่กล่องแล้วนะคะ ทั้งหมดหนึ่งร้อยยี่สิบบาทค่ะ",
        "gloss": {
          "en": "Sure, I've written it on the box. That's a hundred and twenty baht.",
          "ko": "네, 상자에 써 놨어요. 전부 120바트예요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณครับ คืนนี้ผมจะนอนเร็วครับ",
        "gloss": {
          "en": "Thank you. I'll go to bed early tonight.",
          "ko": "고맙습니다. 오늘 밤엔 일찍 잘게요."
        },
        "frames": [
          "th-f2-02",
          "th-f1-14"
        ]
      }
    ]
  },
  {
    "id": "th-2-x1",
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
    "stage": 2,
    "setting": {
      "en": "A friend phones after work and you agree to meet for dinner",
      "ko": "퇴근 후 친구 전화를 받고 저녁 약속 잡기"
    },
    "expressions": [
      "เสร็จแล้ว",
      "กินข้าวหรือยัง",
      "ดีเลย",
      "เดี๋ยวเจอกัน",
      "เลี้ยวขวา"
    ],
    "grammar": [
      0,
      6
    ],
    "earlierGrammar": [
      "1:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ฮัลโหล มินจุน ทำอะไรอยู่",
        "gloss": {
          "en": "Hello, Min-jun. What are you up to?",
          "ko": "여보세요, 민준. 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "งานเสร็จแล้วครับ พี่กินข้าวหรือยังครับ",
        "gloss": {
          "en": "I've just finished work. Have you eaten yet?",
          "ko": "일 다 끝났어요. 형은 밥 먹었어요?"
        },
        "frames": [
          "th-f2-01",
          "th-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "ยังเลย ไปกินข้าวมันไก่ด้วยกันไหม",
        "gloss": {
          "en": "Not yet. Want to go for chicken rice together?",
          "ko": "아직. 같이 카오만까이 먹으러 갈래?"
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ ผมไม่เคยกินข้าวมันไก่ร้านนั้นครับ",
        "gloss": {
          "en": "Great. I've never had the chicken rice at that place.",
          "ko": "좋아요. 그 가게 카오만까이는 먹어 본 적이 없어요."
        },
        "frames": [
          "th-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "อร่อยมากนะ เจอกันหน้าร้านอีกสิบนาที",
        "gloss": {
          "en": "It's really good. Meet in front of the shop in ten minutes.",
          "ko": "진짜 맛있어. 십 분 뒤에 가게 앞에서 보자."
        }
      },
      {
        "who": "me",
        "text": "โอเคครับ เดี๋ยวเจอกันครับ",
        "gloss": {
          "en": "OK, see you in a bit.",
          "ko": "네, 이따 봬요."
        }
      },
      {
        "who": "them",
        "text": "ร้านอยู่ในซอยข้างสถานีนะ",
        "gloss": {
          "en": "The shop is in the lane next to the station.",
          "ko": "가게는 역 옆 골목에 있어."
        }
      },
      {
        "who": "me",
        "text": "ออกจากสถานีแล้วเลี้ยวขวาใช่ไหมครับ",
        "gloss": {
          "en": "I come out of the station and turn right, right?",
          "ko": "역에서 나와서 오른쪽으로 돌면 되죠?"
        },
        "frames": [
          "th-f2-11"
        ]
      }
    ]
  },
  {
    "id": "th-2-x2",
    "stage": 2,
    "setting": {
      "en": "A friend tells you they have their driving test tomorrow",
      "ko": "친구가 내일 운전면허 시험을 본다고 말함"
    },
    "expressions": [
      "จริงเหรอ",
      "สู้ๆ"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "พรุ่งนี้ผมจะไปสอบใบขับขี่ครับ",
        "gloss": {
          "en": "Tomorrow I'm taking my driving test.",
          "ko": "내일 운전면허 시험 봐요."
        }
      },
      {
        "who": "me",
        "text": "จริงเหรอครับ เคยสอบมาก่อนไหมครับ",
        "gloss": {
          "en": "Really? Have you taken it before?",
          "ko": "정말요? 전에 본 적 있어요?"
        },
        "frames": [
          "th-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "เคยครับ แต่ไม่ผ่าน ตื่นเต้นมากเลย",
        "gloss": {
          "en": "Yes, but I failed. I'm really nervous.",
          "ko": "네, 근데 떨어졌어요. 너무 떨려요."
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ ผมก็เคยสอบไม่ผ่านครับ",
        "gloss": {
          "en": "Don't worry. I've failed a test too.",
          "ko": "괜찮아요. 저도 떨어진 적 있어요."
        },
        "frames": [
          "th-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "จริงเหรอ แล้วครั้งที่สองผ่านไหม",
        "gloss": {
          "en": "Really? And did you pass the second time?",
          "ko": "정말요? 그럼 두 번째엔 붙었어요?"
        }
      },
      {
        "who": "me",
        "text": "ผ่านครับ พี่ก็ต้องผ่านแน่นอน สู้ๆ นะครับ",
        "gloss": {
          "en": "I did. You'll definitely pass too. Good luck!",
          "ko": "붙었어요. 형도 꼭 붙을 거예요. 파이팅!"
        }
      }
    ]
  },
  {
    "id": "th-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Calling hotel reception at night because the room's air conditioner is broken",
      "ko": "밤에 호텔 프런트에 전화해 방 에어컨 고장 알리기"
    },
    "expressions": [
      "มีปัญหานิดหน่อย",
      "แอร์เสีย",
      "น่าจะ",
      "เปลี่ยนห้องได้ไหม"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "1:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ แผนกต้อนรับค่ะ มีอะไรให้ช่วยคะ",
        "gloss": {
          "en": "Hello, reception. How can I help?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "สวัสดีค่ะ ยินดีให้บริการค่ะ",
            "gloss": {
              "en": "Hello, happy to help.",
              "ko": "안녕하세요, 말씀하세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมพักห้องแปดศูนย์สองครับ มีปัญหานิดหน่อยครับ",
        "gloss": {
          "en": "Hello, I'm in room eight-oh-two. There's a bit of a problem.",
          "ko": "안녕하세요, 802호인데요. 문제가 좀 있어요."
        }
      },
      {
        "who": "them",
        "text": "เกิดอะไรขึ้นคะ",
        "gloss": {
          "en": "What's happened?",
          "ko": "무슨 일이세요?"
        },
        "alt": [
          {
            "text": "มีปัญหาอะไรคะ",
            "gloss": {
              "en": "What's the problem?",
              "ko": "어떤 문제인가요?"
            }
          },
          {
            "text": "ห้องเป็นอะไรคะ",
            "gloss": {
              "en": "What's wrong with the room?",
              "ko": "방에 무슨 문제가 있나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "แอร์เสียครับ ผมเปิดมาสองชั่วโมงแล้ว แต่ไม่เย็นเลยครับ",
        "gloss": {
          "en": "The air con is broken. I've had it on for two hours, but it's not cold at all.",
          "ko": "에어컨이 고장 났어요. 두 시간째 켜 놨는데 전혀 안 시원해요."
        },
        "frames": [
          "th-f3-14",
          "th-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "ขอโทษด้วยนะคะ ลองกดรีโมตให้เย็นที่สุดหรือยังคะ",
        "gloss": {
          "en": "I'm sorry. Have you tried setting the remote to the coldest?",
          "ko": "죄송합니다. 리모컨을 제일 시원하게 맞춰 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ลองแล้วครับ ผมคิดว่าน่าจะเป็นที่ตัวเครื่องครับ",
        "gloss": {
          "en": "I have. I think it's probably the unit itself.",
          "ko": "해 봤어요. 기계 자체 문제인 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "เดี๋ยวจะให้ช่างขึ้นไปดูนะคะ แต่ช่างน่าจะว่างอีกประมาณหนึ่งชั่วโมงค่ะ",
        "gloss": {
          "en": "I'll send a technician up, but he'll probably only be free in about an hour.",
          "ko": "기사님을 올려 보낼게요. 그런데 한 시간쯤 뒤에나 시간이 날 것 같아요."
        },
        "alt": [
          {
            "text": "ตอนนี้ช่างกำลังซ่อมห้องอื่นอยู่ อีกสักพักนะคะ",
            "gloss": {
              "en": "The technician is fixing another room right now. It'll be a while.",
              "ko": "지금 기사님이 다른 방을 고치고 있어서 좀 걸려요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ถ้าช่างมาช้า ผมก็นอนไม่ได้ครับ เปลี่ยนห้องได้ไหมครับ",
        "gloss": {
          "en": "If he's that late, I won't be able to sleep. Can I change rooms?",
          "ko": "기사님이 늦게 오면 잠을 못 자요. 방을 바꿀 수 있을까요?"
        },
        "frames": [
          "th-f3-01",
          "th-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ มีห้องว่างที่ชั้นสิบ วิวดีกว่าห้องเดิมด้วยค่ะ",
        "gloss": {
          "en": "Yes. There's a free room on the tenth floor, with a better view than yours.",
          "ko": "네. 십 층에 빈방이 있어요. 지금 방보다 전망도 좋아요."
        }
      },
      {
        "who": "me",
        "text": "ดีเลยครับ ผมอยากได้ห้องที่เงียบที่สุดครับ",
        "gloss": {
          "en": "Great. I'd like the quietest room possible.",
          "ko": "좋아요. 제일 조용한 방이면 좋겠어요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ เดี๋ยวจัดการให้นะคะ ขอโทษที่ทำให้ไม่สะดวกค่ะ",
        "gloss": {
          "en": "Of course, I'll sort it out. Sorry for the inconvenience.",
          "ko": "알겠습니다, 바로 처리해 드릴게요. 불편을 드려 죄송합니다."
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ ขอให้พนักงานช่วยยกกระเป๋าด้วยได้ไหมครับ",
        "gloss": {
          "en": "That's OK. Could you have someone help carry my bags?",
          "ko": "괜찮아요. 직원분이 짐 옮기는 걸 좀 도와주시게 할 수 있을까요?"
        },
        "frames": [
          "th-f3-11"
        ]
      }
    ]
  },
  {
    "id": "th-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Back at the office, telling a coworker about your holiday in Krabi",
      "ko": "사무실에 돌아와 동료에게 끄라비 휴가 이야기하기"
    },
    "expressions": [
      "สนุกมาก",
      "คุ้มมาก",
      "เหนื่อยมาก",
      "ประทับใจ"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "2:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "กลับมาแล้วเหรอ ไปเที่ยวไหนมาคะ",
        "gloss": {
          "en": "You're back! Where did you go?",
          "ko": "돌아왔네요! 어디 다녀왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ไปกระบี่มาครับ สนุกมากครับ",
        "gloss": {
          "en": "I went to Krabi. It was really fun.",
          "ko": "끄라비에 다녀왔어요. 정말 재밌었어요."
        }
      },
      {
        "who": "them",
        "text": "ดีจัง ไปกี่วันคะ",
        "gloss": {
          "en": "Lucky you. How many days?",
          "ko": "좋겠다. 며칠 갔어요?"
        },
        "alt": [
          {
            "text": "อิจฉาจัง ไปนานไหมคะ",
            "gloss": {
              "en": "I'm jealous. Were you away long?",
              "ko": "부럽다. 오래 있었어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ไปสี่วันครับ หลังจากที่ถึงโรงแรม ผมไปทะเลเลยครับ",
        "gloss": {
          "en": "Four days. After I got to the hotel, I went straight to the beach.",
          "ko": "4일이요. 호텔에 도착하자마자 바로 바다에 갔어요."
        },
        "frames": [
          "th-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "น้ำทะเลสวยไหมคะ",
        "gloss": {
          "en": "Was the sea nice?",
          "ko": "바다 예뻤어요?"
        }
      },
      {
        "who": "me",
        "text": "สวยมากครับ ผมคิดว่าทะเลที่กระบี่สวยที่สุดในเมืองไทยครับ",
        "gloss": {
          "en": "Beautiful. I think the sea at Krabi is the most beautiful in Thailand.",
          "ko": "정말 예뻤어요. 끄라비 바다가 태국에서 제일 예쁜 것 같아요."
        },
        "frames": [
          "th-f3-05",
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "เคยไปภูเก็ตไหมคะ ภูเก็ตก็สวยนะ",
        "gloss": {
          "en": "Have you been to Phuket? Phuket is lovely too.",
          "ko": "푸껫은 가 봤어요? 푸껫도 예쁜데."
        }
      },
      {
        "who": "me",
        "text": "เคยครับ แต่ภูเก็ตคนเยอะกว่ากระบี่ครับ",
        "gloss": {
          "en": "I have, but Phuket is more crowded than Krabi.",
          "ko": "가 봤어요. 그런데 푸껫은 끄라비보다 사람이 많아요."
        }
      },
      {
        "who": "them",
        "text": "ที่พักแพงไหมคะ",
        "gloss": {
          "en": "Was the place you stayed expensive?",
          "ko": "숙소는 비쌌어요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่แพงครับ ที่พักที่ผมจองไว้ราคาถูก แต่ดีมาก คุ้มมากครับ",
        "gloss": {
          "en": "No. The place I booked was cheap but really good. Great value.",
          "ko": "안 비쌌어요. 제가 예약한 숙소는 싼데 아주 좋았어요. 정말 가성비 좋았어요."
        },
        "frames": [
          "th-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "ดีจัง แล้วกลับมาเหนื่อยไหมคะ",
        "gloss": {
          "en": "Nice. Are you tired after the trip?",
          "ko": "좋네요. 다녀와서 피곤하지 않아요?"
        },
        "alt": [
          {
            "text": "ไปเที่ยวแบบนี้คงเหนื่อยแย่เลยนะคะ",
            "gloss": {
              "en": "A trip like that must have worn you out.",
              "ko": "그렇게 다녀오면 엄청 피곤하겠어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "เหนื่อยมากครับ แต่ประทับใจมาก ถ้ามีวันหยุดอีก ผมก็จะไปอีกครับ",
        "gloss": {
          "en": "Very tired, but it was really memorable. If I get more days off, I'll go again.",
          "ko": "엄청 피곤하지만 정말 인상 깊었어요. 또 휴가가 생기면 또 갈 거예요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-3",
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
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Phoning a dental clinic to move your appointment",
      "ko": "치과에 전화해 예약 날짜 바꾸기"
    },
    "expressions": [
      "ขอเลื่อนนัด",
      "แล้วแต่คุณ"
    ],
    "grammar": [
      1,
      4,
      6,
      7
    ],
    "earlierGrammar": [
      "1:1",
      "2:1",
      "2:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ คลินิกทันตกรรมยิ้มสวยค่ะ",
        "gloss": {
          "en": "Hello, Yim Suay Dental Clinic.",
          "ko": "안녕하세요, 임쑤어이 치과입니다."
        },
        "alt": [
          {
            "text": "สวัสดีค่ะ คลินิกทันตกรรมค่ะ มีอะไรให้ช่วยคะ",
            "gloss": {
              "en": "Hello, dental clinic. How can I help?",
              "ko": "안녕하세요, 치과입니다. 무엇을 도와드릴까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมชื่อมินจุนครับ มีนัดวันพฤหัสนี้บ่ายสองโมงครับ",
        "gloss": {
          "en": "Hello, my name is Min-jun. I have an appointment this Thursday at two p.m.",
          "ko": "안녕하세요, 민준이라고 합니다. 이번 목요일 오후 두 시에 예약이 있어요."
        },
        "frames": [
          "th-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "ค่ะ คุณมินจุน มีอะไรให้ช่วยคะ",
        "gloss": {
          "en": "Yes, Mr. Min-jun. What can I do for you?",
          "ko": "네, 민준 님. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอเลื่อนนัดได้ไหมครับ เพราะหัวหน้าให้ผมไปประชุมที่เชียงใหม่ครับ",
        "gloss": {
          "en": "Could I move the appointment? My boss is sending me to a meeting in Chiang Mai.",
          "ko": "예약을 미룰 수 있을까요? 상사가 치앙마이 회의에 가라고 해서요."
        },
        "frames": [
          "th-f3-15",
          "th-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "ได้ค่ะ อยากเลื่อนเป็นวันไหนคะ",
        "gloss": {
          "en": "Of course. Which day would you like?",
          "ko": "네. 언제로 바꾸고 싶으세요?"
        },
        "alt": [
          {
            "text": "ได้ค่ะ สะดวกวันไหนคะ",
            "gloss": {
              "en": "Sure. Which day suits you?",
              "ko": "네. 언제가 편하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ผมกลับวันเสาร์ครับ หลังจากนั้นวันไหนก็ได้ แล้วแต่คุณครับ",
        "gloss": {
          "en": "I'm back on Saturday. Any day after that is fine, it's up to you.",
          "ko": "토요일에 돌아와요. 그 뒤로는 아무 날이나 괜찮아요. 편하신 대로 해 주세요."
        }
      },
      {
        "who": "them",
        "text": "วันจันทร์หน้ามีคิวสิบโมงเช้ากับบ่ายสามโมงค่ะ",
        "gloss": {
          "en": "Next Monday we have ten a.m. and three p.m.",
          "ko": "다음 주 월요일에 오전 열 시하고 오후 세 시가 비어 있어요."
        }
      },
      {
        "who": "me",
        "text": "บ่ายสามโมงดีกว่าครับ เพราะตอนเช้ารถติดมาก",
        "gloss": {
          "en": "Three p.m. is better. The traffic is terrible in the morning.",
          "ko": "오후 세 시가 더 좋아요. 아침엔 길이 너무 막혀서요."
        }
      },
      {
        "who": "them",
        "text": "ได้ค่ะ ตอนนี้ยังปวดฟันอยู่ไหมคะ",
        "gloss": {
          "en": "All right. Is your tooth still hurting?",
          "ko": "알겠습니다. 지금도 이가 아프세요?"
        },
        "alt": [
          {
            "text": "ได้ค่ะ อาการตอนนี้เป็นยังไงบ้างคะ",
            "gloss": {
              "en": "All right. How are your symptoms now?",
              "ko": "알겠습니다. 지금 증상은 어떠세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ยังปวดอยู่ครับ ปวดมาหนึ่งสัปดาห์แล้วครับ",
        "gloss": {
          "en": "It still hurts. It's been hurting for a week.",
          "ko": "아직 아파요. 아픈 지 일주일 됐어요."
        },
        "frames": [
          "th-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "ถ้าปวดมาก กินยาแก้ปวดได้ค่ะ ก่อนมาก็โทรมาบอกอีกทีนะคะ",
        "gloss": {
          "en": "If it hurts a lot, you can take a painkiller. Call us again before you come.",
          "ko": "많이 아프면 진통제를 드셔도 돼요. 오시기 전에 한 번 더 전화 주세요."
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ ก่อนที่จะไป ผมจะโทรมาอีกครั้งครับ ขอบคุณครับ",
        "gloss": {
          "en": "OK. Before I come, I'll call again. Thank you.",
          "ko": "네. 가기 전에 다시 전화할게요. 고맙습니다."
        },
        "frames": [
          "th-f3-03"
        ]
      }
    ]
  },
  {
    "id": "th-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Talking with a friend about a new Thai drama everyone is watching",
      "ko": "친구와 요즘 다들 보는 태국 드라마 이야기하기"
    },
    "expressions": [
      "ไม่แน่ใจ",
      "คิดว่าไง",
      "เห็นด้วย",
      "ก็ได้นะ"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      5,
      7
    ],
    "earlierGrammar": [
      "2:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ดูละครเรื่องใหม่ของช่องสามหรือยัง",
        "gloss": {
          "en": "Have you watched the new drama on Channel Three?",
          "ko": "3번 채널 새 드라마 봤어?"
        },
        "alt": [
          {
            "text": "เห็นละครเรื่องใหม่ที่ทุกคนพูดถึงหรือยัง",
            "gloss": {
              "en": "Have you seen the new drama everyone's talking about?",
              "ko": "다들 얘기하는 새 드라마 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ดูแล้วครับ ผมดูมาห้าตอนแล้ว สนุกกว่าที่คิดครับ",
        "gloss": {
          "en": "Yes. I've watched five episodes so far. It's more fun than I expected.",
          "ko": "봤어요. 벌써 다섯 편 봤어요. 생각보다 재밌어요."
        },
        "frames": [
          "th-f3-13",
          "th-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "ใช่ไหมล่ะ ชอบใครที่สุด",
        "gloss": {
          "en": "Right? Who do you like most?",
          "ko": "그치? 누가 제일 좋아?"
        }
      },
      {
        "who": "me",
        "text": "ผมชอบนางเอกที่สุดครับ เธอเล่นเก่งมาก",
        "gloss": {
          "en": "I like the female lead most. She's a great actress.",
          "ko": "여자 주인공이 제일 좋아요. 연기를 정말 잘해요."
        },
        "frames": [
          "th-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "เห็นด้วย แต่ตอนล่าสุดเศร้ามาก ร้องไห้เลย",
        "gloss": {
          "en": "Agreed. But the latest episode was so sad. I cried.",
          "ko": "맞아. 근데 지난 회는 너무 슬펐어. 울었잖아."
        },
        "alt": [
          {
            "text": "ใช่ เล่นดีมาก แต่ตอนล่าสุดเศร้าไปหน่อย",
            "gloss": {
              "en": "Yes, she's great. But the latest episode was a bit too sad.",
              "ko": "응, 연기 진짜 좋지. 근데 지난 회는 좀 너무 슬펐어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "จริงๆ ผมไม่แน่ใจว่าพระเอกจะกลับมาไหม คุณคิดว่าไงครับ",
        "gloss": {
          "en": "Honestly, I'm not sure if the male lead will come back. What do you think?",
          "ko": "솔직히 남자 주인공이 돌아올지 모르겠어요. 어떻게 생각해요?"
        },
        "frames": [
          "th-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ฉันคิดว่าเขาน่าจะกลับมาตอนจบนะ",
        "gloss": {
          "en": "I think he'll probably come back at the end.",
          "ko": "난 마지막에 돌아올 것 같아."
        }
      },
      {
        "who": "me",
        "text": "เห็นด้วยครับ ถ้าพระเอกไม่กลับมา คนดูก็โกรธแน่ๆ ครับ",
        "gloss": {
          "en": "I agree. If he doesn't come back, viewers will definitely be angry.",
          "ko": "저도 그렇게 생각해요. 안 돌아오면 시청자들이 분명 화낼 거예요."
        },
        "frames": [
          "th-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ดูซับภาษาอะไรอ่ะ ภาษาอังกฤษเหรอ",
        "gloss": {
          "en": "What subtitles do you watch with? English?",
          "ko": "자막은 뭘로 봐? 영어?"
        }
      },
      {
        "who": "me",
        "text": "ดูซับไทยครับ ตอนนี้ผมอ่านภาษาไทยได้นิดหน่อยแล้วครับ",
        "gloss": {
          "en": "Thai subtitles. I can read Thai a little now.",
          "ko": "태국어 자막으로 봐요. 이제 태국어를 조금 읽을 수 있거든요."
        },
        "frames": [
          "th-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "เก่งจัง งั้นคืนนี้มาดูตอนใหม่ที่บ้านฉันไหม",
        "gloss": {
          "en": "Impressive. Then do you want to come and watch the new episode at my place tonight?",
          "ko": "대단하다. 그럼 오늘 밤에 우리 집에서 새 회차 볼래?"
        },
        "alt": [
          {
            "text": "คืนนี้ตอนใหม่ออก มาดูด้วยกันไหม",
            "gloss": {
              "en": "The new episode is out tonight. Want to watch it together?",
              "ko": "오늘 밤에 새 회차 나와. 같이 볼래?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ก็ได้นะครับ หลังจากที่เลิกงาน ผมจะรีบไปครับ",
        "gloss": {
          "en": "Sure, why not. After I finish work, I'll come straight over.",
          "ko": "그래요. 퇴근하고 바로 갈게요."
        },
        "frames": [
          "th-f3-02"
        ]
      }
    ]
  },
  {
    "id": "th-3-x1",
    "stage": 3,
    "setting": {
      "en": "A friend panics because their laptop won't turn on the night before a deadline",
      "ko": "마감 전날 노트북이 안 켜져서 당황한 친구 돕기"
    },
    "expressions": [
      "ใจเย็นๆ",
      "เกิดอะไรขึ้น",
      "ตั้งแต่เมื่อไร",
      "น่าจะ",
      "เดี๋ยวจัดการให้"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "แย่แล้ว คอมเปิดไม่ติด พรุ่งนี้ต้องส่งงาน",
        "gloss": {
          "en": "Oh no, my laptop won't turn on, and I have to hand in my work tomorrow.",
          "ko": "큰일 났어. 노트북이 안 켜져. 내일 과제 내야 하는데."
        }
      },
      {
        "who": "me",
        "text": "ใจเย็นๆ ครับ เกิดอะไรขึ้นครับ",
        "gloss": {
          "en": "Calm down. What happened?",
          "ko": "진정해요. 무슨 일이에요?"
        }
      },
      {
        "who": "them",
        "text": "ไม่รู้เหมือนกัน กดปุ่มแล้วจอดำอย่างเดียว",
        "gloss": {
          "en": "I don't know. I press the button and the screen just stays black.",
          "ko": "나도 몰라. 버튼을 눌러도 화면이 까맣기만 해."
        }
      },
      {
        "who": "me",
        "text": "เป็นตั้งแต่เมื่อไรครับ",
        "gloss": {
          "en": "Since when has it been like this?",
          "ko": "언제부터 그랬어요?"
        }
      },
      {
        "who": "them",
        "text": "ตั้งแต่เมื่อเช้า หลังจากอัปเดตเครื่อง",
        "gloss": {
          "en": "Since this morning, after an update.",
          "ko": "오늘 아침부터. 업데이트하고 나서."
        }
      },
      {
        "who": "me",
        "text": "ผมน่าจะแก้ได้ครับ เดี๋ยวจัดการให้ครับ",
        "gloss": {
          "en": "I can probably fix it. Leave it to me.",
          "ko": "제가 고칠 수 있을 것 같아요. 제가 처리해 줄게요."
        },
        "frames": [
          "th-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "ขอบคุณมาก ช่วยได้เยอะเลย",
        "gloss": {
          "en": "Thanks so much. That's a big help.",
          "ko": "정말 고마워. 큰 도움이 돼."
        }
      },
      {
        "who": "me",
        "text": "ไม่เป็นไรครับ ถ้าแก้ไม่ได้ เราก็ไปร้านซ่อมด้วยกันครับ",
        "gloss": {
          "en": "No problem. If I can't fix it, we'll go to a repair shop together.",
          "ko": "별말씀을요. 못 고치면 같이 수리점에 가요."
        },
        "frames": [
          "th-f3-01"
        ]
      }
    ]
  },
  {
    "id": "th-3-x2",
    "stage": 3,
    "setting": {
      "en": "A classmate tells you about the Thai cooking class she took",
      "ko": "같은 반 친구가 다녀온 태국 요리 수업 이야기를 들음"
    },
    "expressions": [
      "เล่าให้ฟังหน่อย",
      "นานแค่ไหน",
      "ไม่คุ้ม",
      "สะดวกไหม"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "เมื่อวานฉันไปเรียนทำอาหารไทยมา",
        "gloss": {
          "en": "Yesterday I went to a Thai cooking class.",
          "ko": "어제 태국 요리 수업에 다녀왔어."
        }
      },
      {
        "who": "me",
        "text": "จริงเหรอครับ เล่าให้ฟังหน่อยครับ เรียนนานแค่ไหนครับ",
        "gloss": {
          "en": "Really? Tell me about it. How long was the class?",
          "ko": "정말요? 얘기 좀 해 줘요. 얼마나 배웠어요?"
        },
        "frames": [
          "th-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "สามชั่วโมง แต่ค่าเรียนสองพันบาท แพงมาก",
        "gloss": {
          "en": "Three hours, but it cost two thousand baht. Really expensive.",
          "ko": "세 시간. 근데 수업료가 이천 바트야. 엄청 비싸."
        }
      },
      {
        "who": "me",
        "text": "สองพันบาทเหรอครับ ผมคิดว่าไม่คุ้มนะครับ",
        "gloss": {
          "en": "Two thousand baht? I don't think that's worth it.",
          "ko": "이천 바트요? 그건 값어치를 못 하는 것 같은데요."
        },
        "frames": [
          "th-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "แต่ได้กินเยอะนะ อาทิตย์หน้าไปด้วยกันไหม",
        "gloss": {
          "en": "But you get to eat a lot. Want to come along next week?",
          "ko": "그래도 많이 먹을 수 있어. 다음 주에 같이 갈래?"
        }
      },
      {
        "who": "me",
        "text": "ไปครับ วันเสาร์สะดวกไหมครับ",
        "gloss": {
          "en": "Yes, let's. Is Saturday good for you?",
          "ko": "갈래요. 토요일 괜찮아요?"
        }
      }
    ]
  },
  {
    "id": "th-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "A team meeting with your manager about an app project that is running late",
      "ko": "늦어지는 앱 프로젝트에 대해 팀장과 회의하기"
    },
    "expressions": [
      "ตามที่คุยกันไว้",
      "พูดตรงๆ นะ",
      "ทันกำหนด",
      "ประเด็นคือ",
      "มีข้อดีข้อเสีย",
      "ขอเสริมนิดนึง",
      "เลื่อนออกไป",
      "สรุปว่า",
      "ตกลงตามนี้"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      6,
      7
    ],
    "earlierGrammar": [
      "2:0",
      "2:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ตอนนี้โปรเจกต์แอปใหม่ไปถึงไหนแล้วคะ",
        "gloss": {
          "en": "Where are we with the new app project?",
          "ko": "새 앱 프로젝트 지금 어디까지 진행됐어요?"
        },
        "alt": [
          {
            "text": "ช่วยอัปเดตความคืบหน้าโปรเจกต์หน่อยค่ะ",
            "gloss": {
              "en": "Could you give us an update on the project?",
              "ko": "프로젝트 진행 상황 좀 공유해 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ตามที่คุยกันไว้เมื่อสัปดาห์ก่อน ส่วนออกแบบเสร็จแล้วครับ แต่ส่วนระบบยังช้าอยู่ครับ",
        "gloss": {
          "en": "As we discussed last week, the design part is done, but the back-end is still behind.",
          "ko": "지난주에 이야기한 대로 디자인 부분은 끝났어요. 그런데 시스템 쪽이 아직 늦어요."
        }
      },
      {
        "who": "them",
        "text": "แล้วจะทันกำหนดสิ้นเดือนไหมคะ",
        "gloss": {
          "en": "So will we make the end-of-month deadline?",
          "ko": "그럼 월말 마감은 맞출 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "พูดตรงๆ นะครับ เท่าที่ผมดู น่าจะไม่ทันกำหนดครับ",
        "gloss": {
          "en": "To be honest, as far as I can see, we probably won't make the deadline.",
          "ko": "솔직히 말씀드리면, 제가 보기엔 마감을 못 맞출 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "ทำไมถึงช้าขนาดนั้นคะ",
        "gloss": {
          "en": "Why is it so far behind?",
          "ko": "왜 그렇게 늦어졌어요?"
        },
        "alt": [
          {
            "text": "มีปัญหาตรงไหนคะ",
            "gloss": {
              "en": "Where's the problem?",
              "ko": "어디에 문제가 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ประเด็นคือคนในทีมถูกย้ายไปช่วยโปรเจกต์อื่นสองคนครับ",
        "gloss": {
          "en": "The point is, two people on the team were moved to help on another project.",
          "ko": "핵심은 팀원 두 명이 다른 프로젝트 지원으로 빠졌다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "แล้วเราจะแก้ยังไงดีคะ",
        "gloss": {
          "en": "So how should we fix it?",
          "ko": "그럼 어떻게 해결하면 좋을까요?"
        }
      },
      {
        "who": "me",
        "text": "ผมเสนอว่าเราแก้โดยตัดฟีเจอร์ที่ไม่จำเป็นออกก่อนครับ",
        "gloss": {
          "en": "I suggest we fix it by cutting the features we don't need first.",
          "ko": "필요 없는 기능을 먼저 빼는 방식으로 해결하자고 제안드려요."
        }
      },
      {
        "who": "them",
        "text": "ถ้าตัดฟีเจอร์ ลูกค้าอาจจะไม่พอใจนะคะ",
        "gloss": {
          "en": "If we cut features, the client might not be happy.",
          "ko": "기능을 빼면 고객이 불만스러워할 수도 있어요."
        },
        "alt": [
          {
            "text": "แต่ลูกค้าอยากได้ทุกฟีเจอร์นะคะ",
            "gloss": {
              "en": "But the client wants every feature.",
              "ko": "그런데 고객은 기능을 다 원하잖아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ถึงแม้ว่าฟีเจอร์จะน้อยลง แต่แอปจะเสถียรกว่าครับ มีข้อดีข้อเสียครับ",
        "gloss": {
          "en": "Even though there'll be fewer features, the app will be more stable. There are pros and cons.",
          "ko": "기능은 줄어도 앱은 더 안정적일 거예요. 장단점이 있어요."
        }
      },
      {
        "who": "them",
        "text": "หรือเราจะขอเลื่อนวันส่งกับลูกค้าดีคะ",
        "gloss": {
          "en": "Or should we ask the client to push back the delivery date?",
          "ko": "아니면 고객한테 납기를 미뤄 달라고 할까요?"
        }
      },
      {
        "who": "me",
        "text": "ขอเสริมนิดนึงครับ ยิ่งเราเลื่อนออกไปนาน ลูกค้ายิ่งไม่มั่นใจครับ",
        "gloss": {
          "en": "Let me add one thing. The longer we push it back, the less confident the client will be.",
          "ko": "한마디만 덧붙이자면, 오래 미룰수록 고객 신뢰는 더 떨어져요."
        }
      },
      {
        "who": "them",
        "text": "จริงค่ะ งั้นตัดฟีเจอร์ก่อน แล้วรอจนกว่าลูกค้าจะตอบนะคะ",
        "gloss": {
          "en": "True. Then let's cut features first and wait until the client replies.",
          "ko": "맞아요. 그럼 기능부터 빼고 고객 답을 기다려요."
        }
      },
      {
        "who": "me",
        "text": "สรุปว่าเราตัดฟีเจอร์ก่อน และไม่เลื่อนวันส่ง ตกลงตามนี้นะครับ",
        "gloss": {
          "en": "So, to sum up: we cut features first and don't move the delivery date. Agreed?",
          "ko": "정리하면, 기능을 먼저 빼고 납기는 안 미룬다. 이렇게 정한 거죠?"
        }
      }
    ]
  },
  {
    "id": "th-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Viewing a condo and negotiating the monthly rent with the owner",
      "ko": "콘도를 보고 집주인과 월세 협상하기"
    },
    "expressions": [
      "ต่อรองได้ไหม",
      "จริงๆ แล้ว",
      "ยืดหยุ่นได้",
      "ขอคิดดูก่อน",
      "เอาเป็นว่า"
    ],
    "grammar": [
      0,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ห้องนี้เดือนละหนึ่งหมื่นแปดพันบาทครับ รวมค่าส่วนกลางแล้ว",
        "gloss": {
          "en": "This unit is eighteen thousand baht a month, including the service fee.",
          "ko": "이 방은 한 달에 만 팔천 바트예요. 관리비 포함이에요."
        },
        "alt": [
          {
            "text": "ค่าเช่าเดือนละหนึ่งหมื่นแปดพันครับ ไม่รวมค่าน้ำค่าไฟ",
            "gloss": {
              "en": "The rent is eighteen thousand a month, not including water and electricity.",
              "ko": "월세는 만 팔천이에요. 수도·전기 요금은 별도고요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ห้องสวยมากครับ แต่ราคาสูงกว่างบไปนิดหน่อย ต่อรองได้ไหมครับ",
        "gloss": {
          "en": "It's a lovely room, but it's a bit over my budget. Is the price negotiable?",
          "ko": "방은 정말 예뻐요. 그런데 예산보다 조금 높아서요. 조정 가능할까요?"
        }
      },
      {
        "who": "them",
        "text": "คุณอยากได้ราคาเท่าไรครับ",
        "gloss": {
          "en": "What price did you have in mind?",
          "ko": "얼마 생각하세요?"
        }
      },
      {
        "who": "me",
        "text": "ถ้าผมเซ็นสัญญาหนึ่งปี เดือนละหนึ่งหมื่นหกพันได้ไหมครับ",
        "gloss": {
          "en": "If I sign a one-year contract, could it be sixteen thousand a month?",
          "ko": "1년 계약하면 한 달에 만 육천은 어떨까요?"
        }
      },
      {
        "who": "them",
        "text": "หนึ่งหมื่นหกพันคงไม่ได้ครับ ห้องแถวนี้ราคาขึ้นทุกปี",
        "gloss": {
          "en": "Sixteen thousand probably won't work. Rents around here go up every year.",
          "ko": "만 육천은 어려울 것 같아요. 이 동네는 해마다 오르거든요."
        },
        "alt": [
          {
            "text": "ราคานั้นต่ำไปหน่อยครับ",
            "gloss": {
              "en": "That's a bit low.",
              "ko": "그 가격은 좀 낮네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "เท่าที่ผมดูมา ห้องขนาดนี้ในตึกเดียวกันก็ราคาประมาณนี้ครับ",
        "gloss": {
          "en": "As far as I've seen, rooms this size in the same building go for about that.",
          "ko": "제가 알아본 바로는 같은 건물 이 크기 방이 그 정도 가격이에요."
        }
      },
      {
        "who": "them",
        "text": "แต่ห้องผมเพิ่งเปลี่ยนเฟอร์นิเจอร์ใหม่หมดนะครับ",
        "gloss": {
          "en": "But I've just replaced all the furniture in mine.",
          "ko": "그래도 제 방은 가구를 전부 새로 바꿨어요."
        }
      },
      {
        "who": "me",
        "text": "จริงๆ แล้วผมชอบห้องนี้มากครับ ถึงแม้ว่าจะไกลรถไฟฟ้า แต่วิวสวยมากครับ",
        "gloss": {
          "en": "Actually, I really like this room. Even though it's far from the Skytrain, the view is beautiful.",
          "ko": "사실 이 방이 정말 마음에 들어요. 지상철역에서 멀긴 해도 전망이 정말 좋아요."
        }
      },
      {
        "who": "them",
        "text": "งั้นหนึ่งหมื่นเจ็ดพันได้ไหมครับ",
        "gloss": {
          "en": "Then how about seventeen thousand?",
          "ko": "그럼 만 칠천은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "เรื่องวันย้ายเข้า ผมยืดหยุ่นได้ครับ แต่ราคาขอคิดดูก่อนนะครับ",
        "gloss": {
          "en": "I can be flexible on the move-in date, but let me think about the price first.",
          "ko": "입주 날짜는 맞춰 드릴 수 있어요. 그런데 가격은 좀 생각해 볼게요."
        }
      },
      {
        "who": "them",
        "text": "ได้ครับ แต่มีคนสนใจห้องนี้อีกสองคนนะครับ",
        "gloss": {
          "en": "Sure, but two other people are interested in this room.",
          "ko": "그러세요. 그런데 이 방 보려는 사람이 두 명 더 있어요."
        },
        "alt": [
          {
            "text": "ได้ครับ แต่ห้องนี้น่าจะมีคนจองเร็วๆ นี้นะครับ",
            "gloss": {
              "en": "Sure, but someone will probably book this room soon.",
              "ko": "그러세요. 그런데 이 방 곧 나갈 것 같아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ยิ่งรอนาน ผมก็ยิ่งเสี่ยงจะเสียห้องนี้ไปใช่ไหมครับ",
        "gloss": {
          "en": "So the longer I wait, the more I risk losing it, right?",
          "ko": "오래 기다릴수록 이 방을 놓칠 위험이 커진다는 거죠?"
        }
      },
      {
        "who": "them",
        "text": "ใช่ครับ ถ้าจะเอา ผมอยากให้ตัดสินใจภายในวันนี้",
        "gloss": {
          "en": "Yes. If you want it, I'd like you to decide today.",
          "ko": "네. 하실 거면 오늘 안에 결정해 주셨으면 해요."
        }
      },
      {
        "who": "me",
        "text": "เอาเป็นว่าหนึ่งหมื่นเจ็ดพันครับ ไม่ว่ายังไงผมก็จะดูแลห้องอย่างดีครับ",
        "gloss": {
          "en": "Let's say seventeen thousand, then. Whatever happens, I'll take good care of the room.",
          "ko": "그럼 만 칠천으로 하죠. 무슨 일이 있어도 방은 잘 관리할게요."
        }
      }
    ]
  },
  {
    "id": "th-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Debating a news story about a new tourist entry fee with a friend",
      "ko": "새 관광객 입국세 뉴스를 두고 친구와 토론하기"
    },
    "expressions": [
      "ในความเห็นส่วนตัว",
      "ไม่ค่อยเห็นด้วย",
      "แล้วแต่สถานการณ์",
      "ว่าแต่"
    ],
    "grammar": [
      1,
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "เห็นข่าวไหม รัฐบาลจะเก็บค่าเข้าประเทศนักท่องเที่ยวคนละสามร้อยบาท",
        "gloss": {
          "en": "Did you see the news? The government is going to charge tourists a three-hundred-baht entry fee.",
          "ko": "뉴스 봤어? 정부가 관광객한테 1인당 300바트 입국세를 받는대."
        },
        "alt": [
          {
            "text": "รู้ยังว่าต่อไปนักท่องเที่ยวต้องจ่ายค่าเข้าประเทศสามร้อยบาท",
            "gloss": {
              "en": "Did you know tourists will have to pay a three-hundred-baht entry fee?",
              "ko": "앞으로 관광객이 입국세 300바트를 내야 한다는 거 알아?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "เห็นแล้วครับ ในความเห็นส่วนตัว ผมว่าก็สมเหตุสมผลนะครับ",
        "gloss": {
          "en": "I saw it. Personally, I think it's reasonable.",
          "ko": "봤어요. 개인적으로는 합리적이라고 생각해요."
        }
      },
      {
        "who": "them",
        "text": "จริงเหรอ แต่นักท่องเที่ยวอาจจะมาน้อยลงนะ",
        "gloss": {
          "en": "Really? But fewer tourists might come.",
          "ko": "정말? 그래도 관광객이 줄 수도 있잖아."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่ค่อยเห็นด้วยครับ สามร้อยบาทคงไม่ทำให้คนเปลี่ยนใจครับ",
        "gloss": {
          "en": "I don't really agree. Three hundred baht probably won't make people change their minds.",
          "ko": "저는 좀 생각이 달라요. 300바트 때문에 마음을 바꾸진 않을 거예요."
        }
      },
      {
        "who": "them",
        "text": "แต่คนบ่นกันเยอะว่าไม่รู้เงินจะไปไหน",
        "gloss": {
          "en": "But lots of people are complaining they don't know where the money will go.",
          "ko": "근데 그 돈이 어디로 가는지 모르겠다고 불평하는 사람이 많아."
        },
        "alt": [
          {
            "text": "แต่ข่าวบอกว่ายังไม่ชัดว่าจะเอาเงินไปทำอะไร",
            "gloss": {
              "en": "But the news says it's not clear what the money will be used for.",
              "ko": "근데 뉴스에선 그 돈을 어디에 쓸지 아직 불분명하대."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ประเด็นนั้นผมเห็นด้วยครับ ถ้าเงินถูกเอาไปใช้ผิดทาง ก็ไม่มีประโยชน์ครับ",
        "gloss": {
          "en": "On that point I agree. If the money gets misused, there's no benefit.",
          "ko": "그 부분은 동의해요. 돈이 엉뚱하게 쓰이면 아무 의미가 없죠."
        }
      },
      {
        "who": "them",
        "text": "แล้วเขาจะเก็บเงินยังไง ที่สนามบินเหรอ",
        "gloss": {
          "en": "And how will they collect it? At the airport?",
          "ko": "그럼 어떻게 걷는대? 공항에서?"
        }
      },
      {
        "who": "me",
        "text": "เท่าที่ผมอ่านมา เขาจะเก็บโดยรวมไว้ในค่าตั๋วเครื่องบินครับ",
        "gloss": {
          "en": "As far as I've read, they'll collect it by adding it to the plane ticket.",
          "ko": "제가 읽은 바로는 항공권 값에 포함하는 방식으로 걷는대요."
        }
      },
      {
        "who": "them",
        "text": "ก็สะดวกดีนะ แต่คนที่ขับรถมาจากลาวล่ะ",
        "gloss": {
          "en": "That's convenient. But what about people who drive in from Laos?",
          "ko": "편하긴 하네. 근데 라오스에서 차로 오는 사람들은?"
        }
      },
      {
        "who": "me",
        "text": "อันนั้นแล้วแต่สถานการณ์ครับ ด่านทางบกอาจจะเก็บทีหลัง",
        "gloss": {
          "en": "That depends on the situation. Land borders might charge it later.",
          "ko": "그건 상황에 따라 다르겠죠. 육로 국경은 나중에 걷을 수도 있고요."
        }
      },
      {
        "who": "them",
        "text": "ฉันว่าเรื่องนี้คนคงเถียงกันอีกนาน",
        "gloss": {
          "en": "I think people will be arguing about this for a long time.",
          "ko": "이 얘기는 사람들이 한참 싸울 것 같아."
        },
        "alt": [
          {
            "text": "เรื่องนี้คงเถียงกันไม่จบง่ายๆ",
            "gloss": {
              "en": "This argument probably won't end any time soon.",
              "ko": "이건 쉽게 안 끝날 것 같아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ใช่ครับ ไม่ว่าจะเลือกทางไหน ก็ต้องมีคนไม่พอใจครับ",
        "gloss": {
          "en": "Yes. Whichever way they choose, someone will be unhappy.",
          "ko": "맞아요. 어느 쪽을 택하든 불만인 사람은 있을 거예요."
        }
      },
      {
        "who": "them",
        "text": "นั่นสิ เอาไว้ค่อยเถียงกันต่อ",
        "gloss": {
          "en": "Exactly. Let's argue about it some other time.",
          "ko": "그러게. 나중에 또 얘기하자."
        }
      },
      {
        "who": "me",
        "text": "ว่าแต่ เย็นนี้จะกินอะไรกันดีครับ",
        "gloss": {
          "en": "By the way, what shall we eat this evening?",
          "ko": "그건 그렇고, 오늘 저녁 뭐 먹을까요?"
        }
      }
    ]
  },
  {
    "id": "th-4-4",
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
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "A job interview for a marketing position at a Thai company",
      "ko": "태국 회사 마케팅 직무 취업 면접"
    },
    "expressions": [
      "เกรงใจ",
      "ไม่ต้องรีบ"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      7
    ],
    "earlierGrammar": [
      "3:5",
      "3:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "สวัสดีค่ะ เชิญนั่งค่ะ ช่วยแนะนำตัวสั้นๆ หน่อยค่ะ",
        "gloss": {
          "en": "Hello, please have a seat. Could you briefly introduce yourself?",
          "ko": "안녕하세요, 앉으세요. 간단히 자기소개 부탁드려요."
        },
        "alt": [
          {
            "text": "ก่อนอื่น ช่วยเล่าเกี่ยวกับตัวเองหน่อยค่ะ",
            "gloss": {
              "en": "First, tell us a bit about yourself.",
              "ko": "먼저 본인에 대해 이야기해 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ผมชื่อมินจุนครับ ทำงานด้านการตลาดมาห้าปีแล้ว และพูดภาษาไทยได้ครับ",
        "gloss": {
          "en": "Hello, my name is Min-jun. I've worked in marketing for five years, and I speak Thai.",
          "ko": "안녕하세요, 민준입니다. 마케팅 분야에서 5년 일했고 태국어를 할 수 있습니다."
        }
      },
      {
        "who": "them",
        "text": "ทำไมถึงสนใจตำแหน่งนี้คะ",
        "gloss": {
          "en": "Why are you interested in this position?",
          "ko": "이 직무에 왜 관심을 가지셨어요?"
        }
      },
      {
        "who": "me",
        "text": "เพราะบริษัทนี้ทำตลาดทั้งในเกาหลีและไทยครับ ยิ่งผมรู้จักสองตลาดนี้ดี ก็ยิ่งช่วยทีมได้มากครับ",
        "gloss": {
          "en": "Because this company works in both Korea and Thailand. The better I know both markets, the more I can help the team.",
          "ko": "이 회사가 한국과 태국 시장을 둘 다 하기 때문입니다. 두 시장을 잘 알수록 팀에 더 도움이 될 수 있습니다."
        }
      },
      {
        "who": "them",
        "text": "เคยมีปัญหากับลูกค้าไหมคะ",
        "gloss": {
          "en": "Have you ever had problems with a client?",
          "ko": "고객과 문제가 있었던 적이 있나요?"
        },
        "alt": [
          {
            "text": "เคยเจอลูกค้าที่ทำงานด้วยยากๆ ไหมคะ",
            "gloss": {
              "en": "Have you ever dealt with a difficult client?",
              "ko": "까다로운 고객을 상대해 본 적 있나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "เคยครับ ครั้งหนึ่งผมถูกลูกค้าตำหนิเพราะงานล่าช้าครับ",
        "gloss": {
          "en": "Yes. Once I was criticised by a client because the work was late.",
          "ko": "있습니다. 한번은 일이 늦어져서 고객에게 질책을 받았습니다."
        }
      },
      {
        "who": "them",
        "text": "แล้วตอนนั้นแก้ปัญหายังไงคะ",
        "gloss": {
          "en": "And how did you solve it then?",
          "ko": "그때 어떻게 해결하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "ผมแก้โดยรายงานความคืบหน้าให้ลูกค้าทุกวัน จนกว่างานจะเสร็จครับ",
        "gloss": {
          "en": "I handled it by reporting progress to the client every day until the work was done.",
          "ko": "일이 끝날 때까지 매일 고객에게 진행 상황을 보고하는 방식으로 해결했습니다."
        }
      },
      {
        "who": "them",
        "text": "ที่นี่ต้องเข้าออฟฟิศสัปดาห์ละห้าวัน ไหวไหมคะ",
        "gloss": {
          "en": "Here you have to come into the office five days a week. Is that OK?",
          "ko": "여기는 주 5일 출근해야 해요. 괜찮으세요?"
        },
        "alt": [
          {
            "text": "ที่นี่ไม่มีทำงานจากบ้านนะคะ โอเคไหมคะ",
            "gloss": {
              "en": "There's no working from home here. Is that all right?",
              "ko": "여기는 재택근무가 없어요. 괜찮으세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ไม่มีปัญหาครับ ถึงแม้ว่าบ้านผมจะไกล แต่ผมพร้อมย้ายครับ",
        "gloss": {
          "en": "No problem. Although I live far away, I'm ready to move.",
          "ko": "문제없습니다. 집이 멀긴 하지만 이사할 준비가 되어 있습니다."
        }
      },
      {
        "who": "them",
        "text": "เรื่องเงินเดือน คาดหวังไว้เท่าไรคะ",
        "gloss": {
          "en": "What salary are you expecting?",
          "ko": "희망 연봉은 어느 정도세요?"
        }
      },
      {
        "who": "me",
        "text": "พูดแล้วก็เกรงใจนะครับ แต่ผมหวังไว้ประมาณหกหมื่นบาทครับ",
        "gloss": {
          "en": "I feel a little awkward saying it, but I'm hoping for about sixty thousand baht.",
          "ko": "말씀드리기 좀 송구하지만, 6만 바트 정도를 희망합니다."
        }
      },
      {
        "who": "them",
        "text": "ได้ค่ะ เราจะแจ้งผลภายในสองสัปดาห์นะคะ",
        "gloss": {
          "en": "All right. We'll let you know the result within two weeks.",
          "ko": "알겠습니다. 2주 안에 결과를 알려 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณมากครับ ไม่ต้องรีบนะครับ ผมจะรอฟังข่าวครับ",
        "gloss": {
          "en": "Thank you very much. There's no rush. I'll wait to hear from you.",
          "ko": "정말 감사합니다. 천천히 하셔도 됩니다. 연락 기다리겠습니다."
        }
      }
    ]
  },
  {
    "id": "th-5-1",
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
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Your senior colleague Nong asks you to give up your weekend to help with a client presentation",
      "ko": "선배 넝이 고객 발표 준비를 위해 주말을 내 달라고 부탁함"
    },
    "goal": {
      "en": "Turn down giving up your weekend without hurting the relationship, and offer a smaller kind of help instead.",
      "ko": "관계를 해치지 않으면서 주말 부탁은 거절하고, 대신 작은 도움을 제안하기"
    },
    "expressions": [
      "ไม่ใช่ไม่อยากนะ",
      "อันที่จริง",
      "เกรงว่าจะไม่สะดวก",
      "เข้าใจหัวอกเลย",
      "ถือว่าโอเค",
      "ว่ากันตามตรง",
      "ค่อยเป็นค่อยไป"
    ],
    "grammar": [
      1,
      2,
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "มินจุน พอจะว่างช่วยพี่ทำพรีเซนต์ลูกค้าเสาร์นี้ไหม",
        "gloss": {
          "en": "Min-jun, any chance you're free to help me with the client presentation this Saturday?",
          "ko": "민준, 혹시 이번 토요일에 고객 발표 준비 좀 도와줄 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "พี่หน่องครับ ไม่ใช่ไม่อยากนะครับ แต่เสาร์นี้ผมต้องไปงานแต่งเพื่อนสนิทที่ต่างจังหวัดครับ",
        "gloss": {
          "en": "Nong, it's not that I don't want to, but this Saturday I have a close friend's wedding upcountry.",
          "ko": "넝 선배, 하기 싫은 게 아니라요, 이번 토요일에 지방에서 친한 친구 결혼식이 있어서요."
        }
      },
      {
        "who": "them",
        "text": "โอ๊ย งานนี้สำคัญมากนะ พี่ไว้ใจมินจุนที่สุดแล้ว",
        "gloss": {
          "en": "Oh no, this one's really important. You're the one I trust most.",
          "ko": "아이고, 이번 건 진짜 중요한데. 내가 제일 믿는 게 민준이야."
        }
      },
      {
        "who": "me",
        "text": "ขอบคุณที่ไว้ใจครับ อันที่จริงผมก็อยากช่วยพี่ แต่เกรงว่าจะไม่สะดวกจริงๆ ครับ",
        "gloss": {
          "en": "Thanks for trusting me. Actually, I'd like to help, but I'm afraid it really isn't convenient.",
          "ko": "믿어 주셔서 감사해요. 사실 저도 돕고 싶은데, 정말 사정이 여의치 않을 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "แล้ววันอาทิตย์ล่ะ ครึ่งวันก็ได้",
        "gloss": {
          "en": "What about Sunday, then? Even half a day.",
          "ko": "그럼 일요일은? 반나절이라도."
        }
      },
      {
        "who": "me",
        "text": "วันอาทิตย์ผมเพิ่งกลับมา คงค่อนข้างเหนื่อยครับ กลัวงานจะออกมาไม่ดีพอ",
        "gloss": {
          "en": "I'll only just be back on Sunday, so I'll be rather tired. I'm worried the work wouldn't be good enough.",
          "ko": "일요일엔 막 돌아와서 꽤 피곤할 거예요. 결과물이 시원찮을까 봐 걱정돼요."
        }
      },
      {
        "who": "them",
        "text": "พี่เข้าใจ แต่หัวหน้าบอกว่างานนี้พลาดไม่ได้เลย",
        "gloss": {
          "en": "I get it, but the boss said we absolutely can't mess this one up.",
          "ko": "이해는 해. 근데 팀장님이 이번 건은 절대 실수하면 안 된대."
        }
      },
      {
        "who": "me",
        "text": "เข้าใจหัวอกเลยครับ ความกดดันแบบนี้ผมก็เคยเจอมาแล้ว",
        "gloss": {
          "en": "I know exactly how you feel. I've been under that kind of pressure too.",
          "ko": "그 마음 정말 알아요. 저도 그런 압박을 겪어 봤어요."
        }
      },
      {
        "who": "them",
        "text": "งั้นมีทางไหนที่ช่วยพี่ได้บ้างไหม",
        "gloss": {
          "en": "Then is there any way you can help me?",
          "ko": "그럼 나 도와줄 방법이 뭐라도 있을까?"
        }
      },
      {
        "who": "me",
        "text": "ผมทำสไลด์ส่วนข้อมูลตลาดให้ได้ครับ ส่งให้ภายในคืนวันศุกร์ ถือว่าโอเคไหมครับ",
        "gloss": {
          "en": "I can do the market-data slides for you and send them by Friday night. Would that be OK?",
          "ko": "시장 데이터 슬라이드는 제가 만들어서 금요일 밤까지 보내 드릴 수 있어요. 그 정도면 괜찮을까요?"
        }
      },
      {
        "who": "them",
        "text": "ก็ดีนะ แต่พี่ยังต้องซ้อมพูดคนเดียวอยู่ดี",
        "gloss": {
          "en": "That helps, but I'll still have to rehearse on my own.",
          "ko": "그것도 좋지. 근데 발표 연습은 결국 혼자 해야 하네."
        }
      },
      {
        "who": "me",
        "text": "ว่ากันตามตรง พี่พูดเก่งกว่าผมเยอะเลยครับ ไม่ต้องห่วงหรอกครับ",
        "gloss": {
          "en": "Honestly, you're a much better speaker than me. You really don't need to worry.",
          "ko": "솔직히 선배가 저보다 발표를 훨씬 잘하잖아요. 걱정 안 하셔도 돼요."
        }
      },
      {
        "who": "them",
        "text": "ปากหวานนะเรา",
        "gloss": {
          "en": "Aren't you a smooth talker.",
          "ko": "말은 참 잘해."
        }
      },
      {
        "who": "me",
        "text": "ไม่ได้เอาใจนะครับ พูดจริง ค่อยเป็นค่อยไป เตรียมทีละส่วนก็ทันครับ",
        "gloss": {
          "en": "I'm not just flattering you, I mean it. Take it step by step, one part at a time, and you'll make it.",
          "ko": "비위 맞추는 거 아니에요, 진심이에요. 차근차근 한 부분씩 준비하면 충분해요."
        }
      },
      {
        "who": "them",
        "text": "โอเค งั้นฝากส่วนข้อมูลตลาดด้วยนะ ขอบใจมาก",
        "gloss": {
          "en": "OK, then I'll leave the market data to you. Thanks a lot.",
          "ko": "알았어. 그럼 시장 데이터 부분 부탁해. 정말 고마워."
        }
      },
      {
        "who": "me",
        "text": "ได้เลยครับ ติดตรงไหนทักมาได้ตลอดนะครับ ขอให้ผ่านไปด้วยดีครับ",
        "gloss": {
          "en": "Sure. If you get stuck anywhere, message me any time. I hope it goes well.",
          "ko": "그럼요. 막히는 데 있으면 언제든 연락 주세요. 잘되길 바랄게요."
        }
      }
    ]
  },
  {
    "id": "th-5-2",
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
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "At a farewell party, giving a speech for Somsak, a colleague retiring after many years; the MC and Somsak respond",
      "ko": "오래 함께한 동료 솜삭의 송별회에서 연설하기(사회자와 솜삭이 중간중간 반응함)"
    },
    "goal": {
      "en": "Give a warm, formal farewell speech that honours your colleague, with one light, funny moment.",
      "ko": "동료를 기리는 따뜻하고 격식 있는 송별사를 하되, 가볍게 웃기는 순간을 한 번 넣기"
    },
    "expressions": [
      "ขอบพระคุณ",
      "เป็นเกียรติอย่างยิ่ง",
      "อันที่จริง",
      "ไม่ได้ตั้งใจ",
      "พูดเล่นน่า",
      "ด้วยความเคารพ",
      "มองโลกในแง่ดี"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ต่อไปขอเชิญคุณมินจุนกล่าวความรู้สึกถึงคุณสมศักดิ์ค่ะ",
        "gloss": {
          "en": "Next, we invite Min-jun to say a few words to Somsak.",
          "ko": "다음으로 민준 님을 모셔서 솜삭 님께 한 말씀 듣겠습니다."
        }
      },
      {
        "who": "me",
        "text": "ขอบพระคุณครับ เรียนท่านผู้บริหารและเพื่อนร่วมงานทุกท่าน ผมรู้สึกเป็นเกียรติอย่างยิ่งที่ได้พูดในวันนี้ครับ",
        "gloss": {
          "en": "Thank you. Distinguished executives and colleagues, I am deeply honoured to speak today.",
          "ko": "감사합니다. 존경하는 임원 여러분, 동료 여러분, 오늘 이 자리에서 말씀드리게 되어 큰 영광입니다."
        }
      },
      {
        "who": "them",
        "text": "อย่าพูดให้ผมร้องไห้นะครับ",
        "gloss": {
          "en": "Don't make me cry, now.",
          "ko": "나 울리지 마요."
        }
      },
      {
        "who": "me",
        "text": "ผมจะพยายามครับ สิบปีที่ได้ทำงานกับพี่สมศักดิ์ ถือว่าเป็นช่วงที่ผมได้เรียนรู้มากที่สุดครับ",
        "gloss": {
          "en": "I'll try. The ten years I worked with Somsak were, I'd say, the years I learned the most.",
          "ko": "노력할게요. 솜삭 선배와 일한 10년은 제가 가장 많이 배운 시간이라고 할 수 있습니다."
        }
      },
      {
        "who": "them",
        "text": "ผมสอนอะไรคุณเยอะขนาดนั้นเลยเหรอ",
        "gloss": {
          "en": "Did I really teach you that much?",
          "ko": "내가 그렇게나 많이 가르쳤어요?"
        }
      },
      {
        "who": "me",
        "text": "เยอะครับ พี่ใจเย็นเสียจนสิบปีมานี้ไม่มีใครเคยเห็นพี่โกรธเลยครับ",
        "gloss": {
          "en": "You did. You're so calm that in ten years no one has ever seen you angry.",
          "ko": "많이요. 선배는 얼마나 침착한지 10년 동안 화내는 걸 본 사람이 아무도 없어요."
        }
      },
      {
        "who": "them",
        "text": "ช่วยเล่าเรื่องประทับใจสักเรื่องได้ไหมคะ",
        "gloss": {
          "en": "Could you share one memorable story?",
          "ko": "기억에 남는 일화 하나 들려주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "ได้ครับ อันที่จริงวันแรกที่ผมมาทำงาน ผมส่งอีเมลผิดไปหาลูกค้าทั้งบริษัทครับ",
        "gloss": {
          "en": "Of course. Actually, on my first day here, I sent an email to the wrong client, the whole company.",
          "ko": "네. 사실 제가 입사 첫날 엉뚱한 메일을 고객사 전체에 보냈습니다."
        }
      },
      {
        "who": "them",
        "text": "จำได้ วันนั้นวุ่นวายมาก",
        "gloss": {
          "en": "I remember. What a chaotic day that was.",
          "ko": "기억나요. 그날 난리도 아니었지."
        }
      },
      {
        "who": "me",
        "text": "ผมไม่ได้ตั้งใจเลยครับ แต่พี่บอกว่าความผิดพลาดคือครู แล้วช่วยผมแก้จนเสร็จ",
        "gloss": {
          "en": "I really didn't mean to, but you told me mistakes are teachers, and helped me fix it all.",
          "ko": "정말 일부러 그런 건 아니었는데, 선배가 실수는 스승이라며 끝까지 같이 수습해 주셨죠."
        }
      },
      {
        "who": "them",
        "text": "แล้วตอนนี้ยังส่งผิดอยู่ไหม",
        "gloss": {
          "en": "And do you still send emails to the wrong people?",
          "ko": "요즘도 메일 잘못 보내요?"
        }
      },
      {
        "who": "me",
        "text": "พูดเล่นน่าพี่ ตอนนี้ผมตรวจสามรอบทุกครั้งครับ",
        "gloss": {
          "en": "Oh, come on! These days I check three times, every time.",
          "ko": "에이, 농담도 참. 요즘은 매번 세 번씩 확인해요."
        }
      },
      {
        "who": "them",
        "text": "มีอะไรอยากฝากถึงคุณสมศักดิ์อีกไหมคะ",
        "gloss": {
          "en": "Is there anything else you'd like to say to Somsak?",
          "ko": "솜삭 님께 더 전하고 싶은 말씀이 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "ด้วยความเคารพครับ ขอให้พี่มีความสุขกับการพักผ่อน และมองโลกในแง่ดีแบบนี้ตลอดไปนะครับ",
        "gloss": {
          "en": "With all respect, I wish you happiness in your retirement, and may you always stay this positive.",
          "ko": "존경하는 마음으로, 편히 쉬시면서 행복하시고 지금처럼 늘 긍정적으로 지내시길 바랍니다."
        }
      },
      {
        "who": "them",
        "text": "ขอบคุณมากนะ ผมจะคิดถึงทุกคน",
        "gloss": {
          "en": "Thank you so much. I'll miss everyone.",
          "ko": "정말 고마워요. 모두 보고 싶을 거예요."
        }
      },
      {
        "who": "me",
        "text": "พวกเราก็จะคิดถึงพี่ครับ ขอบพระคุณทุกท่านที่รับฟังครับ",
        "gloss": {
          "en": "We'll miss you too. Thank you all for listening.",
          "ko": "저희도 선배가 많이 그리울 거예요. 들어 주신 모든 분께 감사드립니다."
        }
      }
    ]
  },
  {
    "id": "th-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Chatting with a friend about a viral comedy clip and a new dance trend",
      "ko": "친구와 화제가 된 코미디 영상과 새 댄스 챌린지 이야기하기"
    },
    "goal": {
      "en": "Keep a light, joking chat going: give your honest take on the clip and use a couple of idioms naturally.",
      "ko": "가벼운 농담 섞인 대화를 이어 가며 영상에 대한 솔직한 생각을 말하고 관용 표현을 자연스럽게 쓰기"
    },
    "expressions": [
      "เกินคาด",
      "ขำไม่ออก",
      "จะว่าไปแล้ว",
      "ปากว่าตาขยิบ",
      "ไม่ได้แย่ขนาดนั้น",
      "น้ำขึ้นให้รีบตัก",
      "ฟังดูดีนะ"
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
        "text": "ดูคลิปตลกที่กำลังไวรัลหรือยัง ที่ล้อข่าวการเมืองน่ะ",
        "gloss": {
          "en": "Have you seen the comedy clip that's going viral? The one parodying political news.",
          "ko": "요즘 뜨는 코미디 영상 봤어? 정치 뉴스 패러디하는 거."
        }
      },
      {
        "who": "me",
        "text": "ดูแล้วครับ ตอนแรกนึกว่าจะเฉยๆ แต่ตลกเกินคาดมากครับ",
        "gloss": {
          "en": "I have. At first I thought it'd be meh, but it was way funnier than I expected.",
          "ko": "봤어요. 처음엔 별로일 줄 알았는데 기대 이상으로 웃기더라고요."
        }
      },
      {
        "who": "them",
        "text": "ใช่ไหมล่ะ ฉันหัวเราะจนน้ำตาไหลเลย",
        "gloss": {
          "en": "Right? I laughed till I cried.",
          "ko": "그치? 나 눈물 날 때까지 웃었어."
        }
      },
      {
        "who": "me",
        "text": "ผมก็ขำเสียจนคนบนรถไฟฟ้าหันมามองครับ",
        "gloss": {
          "en": "I laughed so hard that people on the Skytrain turned to look at me.",
          "ko": "저도 얼마나 웃었는지 지상철 사람들이 다 쳐다봤어요."
        }
      },
      {
        "who": "them",
        "text": "แต่บางมุกก็แรงไปนะ บางคนว่าล้อเลียนเกินไป",
        "gloss": {
          "en": "But some jokes went too far. Some people say it's too mocking.",
          "ko": "근데 몇몇 개그는 좀 셌어. 너무 조롱한다는 사람도 있고."
        }
      },
      {
        "who": "me",
        "text": "มุกเรื่องค่าครองชีพออกจะแรงไปหน่อยครับ บางช่วงผมก็ขำไม่ออกเหมือนกัน",
        "gloss": {
          "en": "The cost-of-living joke was a bit on the harsh side. At some points I couldn't laugh either.",
          "ko": "물가 얘기 개그는 좀 센 편이었어요. 어떤 부분은 저도 웃음이 안 나오더라고요."
        }
      },
      {
        "who": "them",
        "text": "นั่นสิ เพราะมันเรื่องจริงไง",
        "gloss": {
          "en": "Exactly, because it's true.",
          "ko": "그러니까. 다 진짜 얘기라서 그렇지."
        }
      },
      {
        "who": "me",
        "text": "จะว่าไปแล้ว นักการเมืองที่ปากว่าตาขยิบก็เป็นวัตถุดิบชั้นดีของตลกเลยนะครับ",
        "gloss": {
          "en": "Come to think of it, politicians who say one thing and do another are prime material for comedians.",
          "ko": "생각해 보면 말과 행동이 다른 정치인들이야말로 개그의 최고 소재죠."
        }
      },
      {
        "who": "them",
        "text": "ฮ่าๆ จริง แล้วเห็นเทรนด์เต้นท่าใหม่ในติ๊กต็อกหรือยัง",
        "gloss": {
          "en": "Ha, true. And have you seen the new dance trend on TikTok?",
          "ko": "하하, 맞아. 그리고 틱톡 새 댄스 챌린지 봤어?"
        }
      },
      {
        "who": "me",
        "text": "เห็นแล้วครับ ผมลองเต้นตามแล้วด้วย แต่ไม่กล้าโพสต์หรอกครับ",
        "gloss": {
          "en": "I have. I even tried the dance, but I wouldn't dare post it.",
          "ko": "봤어요. 따라 춰 보기도 했는데 올릴 엄두는 안 나요."
        }
      },
      {
        "who": "them",
        "text": "ทำไมล่ะ โพสต์สิ คงตลกดี",
        "gloss": {
          "en": "Why not? Post it! It'd be funny.",
          "ko": "왜? 올려 봐. 웃길 것 같은데."
        }
      },
      {
        "who": "me",
        "text": "ผมเต้นก็ไม่ได้แย่ขนาดนั้นนะครับ แค่ขาไม่ค่อยไปตามจังหวะ",
        "gloss": {
          "en": "My dancing isn't that bad, you know. My legs just don't quite keep the beat.",
          "ko": "제 춤이 그렇게까지 엉망은 아니에요. 다리가 박자를 잘 못 따라갈 뿐이죠."
        }
      },
      {
        "who": "them",
        "text": "เทรนด์นี้กำลังมาแรงเลยนะ",
        "gloss": {
          "en": "This trend is really taking off right now.",
          "ko": "이 챌린지 지금 엄청 뜨고 있어."
        }
      },
      {
        "who": "me",
        "text": "จริงครับ น้ำขึ้นให้รีบตัก ถ้าไม่รีบโพสต์ อาทิตย์หน้าก็ตกเทรนด์แล้ว",
        "gloss": {
          "en": "True. Make hay while the sun shines. If I don't post soon, it'll be old news by next week.",
          "ko": "맞아요. 물 들어올 때 노 저어야죠. 빨리 안 올리면 다음 주엔 한물가요."
        }
      },
      {
        "who": "them",
        "text": "งั้นถ่ายคู่กันไหม ฉันเต้นด้วย",
        "gloss": {
          "en": "Then shall we film it together? I'll dance too.",
          "ko": "그럼 같이 찍을래? 나도 출게."
        }
      },
      {
        "who": "me",
        "text": "ฟังดูดีนะครับ อย่างน้อยถ้าคนหัวเราะ ก็หัวเราะเราสองคนพร้อมกันครับ",
        "gloss": {
          "en": "Sounds good. At least if people laugh, they'll be laughing at both of us.",
          "ko": "좋은데요. 적어도 사람들이 웃으면 우리 둘을 같이 비웃겠죠."
        }
      }
    ]
  },
  {
    "id": "th-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Appearing as a guest on a talk show as a Korean cooking YouTuber living in Thailand",
      "ko": "태국에 사는 한국 요리 유튜버로서 토크쇼에 게스트로 출연하기"
    },
    "goal": {
      "en": "Answer the host with humour and humility, and handle a teasing question gracefully.",
      "ko": "진행자의 질문에 유머와 겸손으로 답하고, 놀리는 질문도 여유 있게 받아넘기기"
    },
    "expressions": [
      "อันที่จริง",
      "ทั้งนี้ทั้งนั้น",
      "ปากว่าตาขยิบ",
      "ขอบพระคุณ"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ยินดีต้อนรับครับ วันนี้เรามีแขกพิเศษ ยูทูบเบอร์สอนทำอาหารเกาหลีที่พูดไทยชัดมาก",
        "gloss": {
          "en": "Welcome! Today we have a special guest, a Korean cooking YouTuber whose Thai is really clear.",
          "ko": "어서 오세요! 오늘은 특별한 게스트, 태국어를 아주 또박또박 잘하는 한국 요리 유튜버를 모셨습니다."
        }
      },
      {
        "who": "me",
        "text": "สวัสดีครับ ขอบคุณที่เชิญมานะครับ ตื่นเต้นมากเลยครับ",
        "gloss": {
          "en": "Hello, thank you for having me. I'm really nervous.",
          "ko": "안녕하세요, 불러 주셔서 감사해요. 엄청 떨리네요."
        }
      },
      {
        "who": "them",
        "text": "ช่องคุณมีคนดูหลักล้าน คิดว่าตัวเองดังหรือยังครับ",
        "gloss": {
          "en": "Your channel has millions of viewers. Do you think you're famous yet?",
          "ko": "채널 시청자가 수백만인데요, 이제 유명해졌다고 생각하세요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่หรอกครับ ผมค่อนข้างเป็นคนธรรมดา ไปตลาดก็ยังต่อราคาผักเหมือนเดิมครับ",
        "gloss": {
          "en": "Oh no. I'm a fairly ordinary person. I still haggle over vegetables at the market.",
          "ko": "아니에요. 저는 꽤 평범한 사람이에요. 시장 가면 아직도 채솟값 깎아요."
        }
      },
      {
        "who": "them",
        "text": "ทำไมถึงเริ่มทำช่องนี้ครับ",
        "gloss": {
          "en": "Why did you start this channel?",
          "ko": "이 채널은 왜 시작하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "อันที่จริงเริ่มเพราะเหงาครับ ตอนมาไทยใหม่ๆ ไม่มีเพื่อน เลยถ่ายคลิปทำกับข้าวคุยกับกล้อง",
        "gloss": {
          "en": "Actually, I started because I was lonely. When I first came to Thailand I had no friends, so I filmed myself cooking and talked to the camera.",
          "ko": "사실 외로워서 시작했어요. 태국에 처음 왔을 때 친구가 없어서 요리하면서 카메라랑 대화하는 영상을 찍었죠."
        }
      },
      {
        "who": "them",
        "text": "แล้วกว่าจะมีคนดูเยอะแบบนี้ ใช้เวลานานไหมครับ",
        "gloss": {
          "en": "And did it take long to get this many viewers?",
          "ko": "이렇게 시청자가 많아지기까지 오래 걸렸나요?"
        }
      },
      {
        "who": "me",
        "text": "นานครับ สามปีแรกคนดูหลักสิบเอง ทั้งนี้ทั้งนั้น ความสำเร็จก็ขึ้นอยู่กับความอดทนด้วยครับ",
        "gloss": {
          "en": "It did. For the first three years I had only dozens of viewers. All in all, success also depends on patience.",
          "ko": "오래 걸렸어요. 처음 3년은 시청자가 수십 명뿐이었죠. 결국 성공은 인내에도 달려 있는 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "มีคนบอกว่าคุณใส่พริกเยอะเสียจนคนเกาหลีกินไม่ได้ จริงไหมครับ",
        "gloss": {
          "en": "People say you put in so much chilli that Koreans can't eat it. Is that true?",
          "ko": "고추를 너무 많이 넣어서 한국 사람은 못 먹는다는 말이 있던데, 사실인가요?"
        }
      },
      {
        "who": "me",
        "text": "ไม่จริงหรอกครับ แต่ยอมรับว่าอยู่ไทยนานจนลิ้นผมเปลี่ยนไปแล้วครับ",
        "gloss": {
          "en": "Not true. But I admit I've been in Thailand so long my taste buds have changed.",
          "ko": "사실이 아니에요. 그래도 태국에 오래 살아서 입맛이 바뀐 건 인정해요."
        }
      },
      {
        "who": "them",
        "text": "แฟนคลับบอกว่าคุณประกาศจะลดน้ำหนัก แต่ทุกคลิปกินหมูกระทะ",
        "gloss": {
          "en": "Fans say you announced a diet, but you eat Thai barbecue in every clip.",
          "ko": "팬들 말로는 다이어트한다고 해 놓고 영상마다 무까타를 드신다던데요."
        }
      },
      {
        "who": "me",
        "text": "อันนี้ต้องยอมรับครับ เรื่องนี้ผมปากว่าตาขยิบจริงๆ ครับ",
        "gloss": {
          "en": "I have to admit it. On this one I really don't practise what I preach.",
          "ko": "그건 인정할게요. 이 부분은 제가 정말 말과 행동이 달라요."
        }
      },
      {
        "who": "them",
        "text": "ฮ่าๆ แล้วต่อไปมีแผนอะไรครับ",
        "gloss": {
          "en": "Ha! So what are your plans next?",
          "ko": "하하, 앞으로 계획은 뭔가요?"
        }
      },
      {
        "who": "me",
        "text": "ผมอยากเปิดร้านเล็กๆ ครับ แต่การเปิดร้านต้องใช้ความพร้อมหลายอย่าง เลยยังไม่รีบครับ",
        "gloss": {
          "en": "I'd like to open a small restaurant, but opening one takes a lot of preparation, so I'm not rushing.",
          "ko": "작은 식당을 열고 싶어요. 그런데 가게를 여는 건 준비할 게 많아서 서두르지 않으려고요."
        }
      },
      {
        "who": "them",
        "text": "สุดท้ายนี้ อยากฝากอะไรถึงคนดูไหมครับ",
        "gloss": {
          "en": "Finally, is there anything you'd like to say to the viewers?",
          "ko": "마지막으로 시청자분들께 하고 싶은 말씀 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "ขอบพระคุณทุกท่านที่ติดตามครับ ถ้าทำอาหารแล้วไม่อร่อย อย่าเพิ่งท้อนะครับ ลองใหม่ได้เสมอ",
        "gloss": {
          "en": "Thank you, everyone, for following. If your cooking doesn't turn out tasty, don't give up yet. You can always try again.",
          "ko": "구독해 주시는 모든 분께 감사드립니다. 요리가 맛없게 돼도 포기하지 마세요. 언제든 다시 해 보면 돼요."
        }
      }
    ]
  }
];
