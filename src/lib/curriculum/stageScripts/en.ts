import type { StageScript } from "../stageScripts.ts";

/** en 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const EN: StageScript[] = [
  {
    "id": "en-1-1",
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
    "situation": 0,
    "setting": {
      "en": "First day of an English class: chatting with Emma, a classmate",
      "ko": "영어 수업 첫날, 같은 반 친구 엠마와"
    },
    "expressions": [
      "nice to meet you",
      "where are you from",
      "how about you",
      "me too",
      "see you later"
    ],
    "grammar": [
      0,
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! I'm Emma. Are you new in this class?",
        "gloss": {
          "en": "Hi! I'm Emma. Are you new in this class?",
          "ko": "안녕! 난 엠마야. 이 수업 처음이야?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I am. My name is Ji-woo. Nice to meet you.",
        "gloss": {
          "en": "Yes, I am. My name is Ji-woo. Nice to meet you.",
          "ko": "응. 내 이름은 지우야. 만나서 반가워."
        },
        "frames": [
          "en-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Nice to meet you too, Ji-woo. Where are you from?",
        "gloss": {
          "en": "Nice to meet you too, Ji-woo. Where are you from?",
          "ko": "나도 반가워, 지우. 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "I'm from Korea. Where are you from?",
        "gloss": {
          "en": "I'm from Korea. Where are you from?",
          "ko": "한국에서 왔어. 너는 어디서 왔어?"
        },
        "frames": [
          "en-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "I'm from Canada. What do you do?",
        "gloss": {
          "en": "I'm from Canada. What do you do?",
          "ko": "난 캐나다에서 왔어. 너는 무슨 일 해?"
        }
      },
      {
        "who": "me",
        "text": "I'm a nurse. I work at a hospital. How about you?",
        "gloss": {
          "en": "I'm a nurse. I work at a hospital. How about you?",
          "ko": "난 간호사야. 병원에서 일해. 너는?"
        },
        "frames": [
          "en-f1-03",
          "en-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "I'm a teacher. I can't speak Korean, but I love Korean food!",
        "gloss": {
          "en": "I'm a teacher. I can't speak Korean, but I love Korean food!",
          "ko": "난 선생님이야. 한국어는 못 하지만 한국 음식은 정말 좋아해!"
        }
      },
      {
        "who": "me",
        "text": "Me too! See you later, Emma.",
        "gloss": {
          "en": "Me too! See you later, Emma.",
          "ko": "나도! 이따 봐, 엠마."
        },
        "frames": [
          "en-f1-16"
        ]
      }
    ]
  },
  {
    "id": "en-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "At a small gift shop, buying a mug and a postcard",
      "ko": "작은 기념품 가게에서 머그잔과 엽서 사기"
    },
    "expressions": [
      "good morning",
      "excuse me",
      "how much is this",
      "just this one",
      "thanks a lot"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good morning! Can I help you?",
        "gloss": {
          "en": "Good morning! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Good morning. Excuse me, how much is this?",
        "gloss": {
          "en": "Good morning. Excuse me, how much is this?",
          "ko": "안녕하세요. 저기요, 이거 얼마예요?"
        },
        "frames": [
          "en-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "The blue mug? It's twelve dollars. The small mugs are eight.",
        "gloss": {
          "en": "The blue mug? It's twelve dollars. The small mugs are eight.",
          "ko": "파란 머그잔이요? 십이 달러예요. 작은 머그잔은 팔 달러고요."
        }
      },
      {
        "who": "me",
        "text": "Okay. Do you have postcards?",
        "gloss": {
          "en": "Okay. Do you have postcards?",
          "ko": "네. 엽서 있어요?"
        },
        "frames": [
          "en-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Yes, they're on the table by the door. Do you want two or three?",
        "gloss": {
          "en": "Yes, they're on the table by the door. Do you want two or three?",
          "ko": "네, 문 옆 테이블에 있어요. 두 장 드릴까요, 세 장 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Just this one, thanks. And I'd like the blue mug, please.",
        "gloss": {
          "en": "Just this one, thanks. And I'd like the blue mug, please.",
          "ko": "이거 한 장만요. 그리고 파란 머그잔도 주세요."
        },
        "frames": [
          "en-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Great. That's thirteen dollars. Here you go. Have a nice day!",
        "gloss": {
          "en": "Great. That's thirteen dollars. Here you go. Have a nice day!",
          "ko": "좋아요. 십삼 달러입니다. 여기 있어요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Thanks a lot. You too!",
        "gloss": {
          "en": "Thanks a lot. You too!",
          "ko": "정말 고마워요. 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "en-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "On a city street, asking a stranger the way to the train station",
      "ko": "시내 길에서 모르는 사람에게 기차역 가는 길 묻기"
    },
    "expressions": [
      "excuse me",
      "where is the station",
      "say that again",
      "on the left",
      "next to the bank",
      "not really"
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
        "text": "Hi! You look lost. Can I help?",
        "gloss": {
          "en": "Hi! You look lost. Can I help?",
          "ko": "안녕하세요! 길 잃으신 것 같네요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, please. Excuse me, where is the station?",
        "gloss": {
          "en": "Yes, please. Excuse me, where is the station?",
          "ko": "네, 부탁해요. 실례지만, 역이 어디예요?"
        },
        "frames": [
          "en-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "The train station? Go straight and turn left at the bank.",
        "gloss": {
          "en": "The train station? Go straight and turn left at the bank.",
          "ko": "기차역이요? 쭉 가서 은행에서 왼쪽으로 도세요."
        }
      },
      {
        "who": "me",
        "text": "Sorry, can you say that again, please?",
        "gloss": {
          "en": "Sorry, can you say that again, please?",
          "ko": "죄송한데, 다시 한번 말해 주실래요?"
        },
        "frames": [
          "en-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Go straight. The station is on the left, next to the bank.",
        "gloss": {
          "en": "Sure. Go straight. The station is on the left, next to the bank.",
          "ko": "그럼요. 쭉 가세요. 역은 왼쪽, 은행 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "On the left, next to the bank. Is it far?",
        "gloss": {
          "en": "On the left, next to the bank. Is it far?",
          "ko": "왼쪽, 은행 옆이요. 멀어요?"
        },
        "frames": [
          "en-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "No, it's about five minutes. Do you know Park Street?",
        "gloss": {
          "en": "No, it's about five minutes. Do you know Park Street?",
          "ko": "아뇨, 오 분쯤이에요. 파크 스트리트 아세요?"
        }
      },
      {
        "who": "me",
        "text": "Not really, but I can find it. Thank you!",
        "gloss": {
          "en": "Not really, but I can find it. Thank you!",
          "ko": "잘은 몰라요, 그래도 찾을 수 있어요. 고마워요!"
        },
        "frames": [
          "en-f1-11"
        ]
      }
    ]
  },
  {
    "id": "en-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Chatting with a coworker about your morning routine",
      "ko": "동료와 아침 일과 이야기하기"
    },
    "expressions": [
      "what do you do",
      "not really",
      "what time is it",
      "have a nice day"
    ],
    "grammar": [
      1,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "So, do you get up early?",
        "gloss": {
          "en": "So, do you get up early?",
          "ko": "그래서, 일찍 일어나요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I do. I get up at six every day.",
        "gloss": {
          "en": "Yes, I do. I get up at six every day.",
          "ko": "네. 매일 여섯 시에 일어나요."
        },
        "frames": [
          "en-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Six! Wow. I get up at eight. What do you do in the morning?",
        "gloss": {
          "en": "Six! Wow. I get up at eight. What do you do in the morning?",
          "ko": "여섯 시요! 와. 난 여덟 시에 일어나요. 아침에 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "I drink coffee and take the bus. What do you do after work?",
        "gloss": {
          "en": "I drink coffee and take the bus. What do you do after work?",
          "ko": "커피 마시고 버스 타요. 퇴근하고는 뭐 해요?"
        }
      },
      {
        "who": "them",
        "text": "I go to the gym on Mondays. My sister goes with me. Do you like the gym?",
        "gloss": {
          "en": "I go to the gym on Mondays. My sister goes with me. Do you like the gym?",
          "ko": "월요일마다 헬스장에 가요. 여동생도 같이 가고요. 헬스장 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Not really. I can't run fast. I walk in the park on Sundays.",
        "gloss": {
          "en": "Not really. I can't run fast. I walk in the park on Sundays.",
          "ko": "별로요. 저는 빨리 못 달려요. 일요일엔 공원에서 걸어요."
        },
        "frames": [
          "en-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "That's nice. Oh no, I have a class at nine!",
        "gloss": {
          "en": "That's nice. Oh no, I have a class at nine!",
          "ko": "좋네요. 아, 나 아홉 시에 수업 있는데!"
        }
      },
      {
        "who": "me",
        "text": "What time is it? Oh, it's late! Have a nice day!",
        "gloss": {
          "en": "What time is it? Oh, it's late! Have a nice day!",
          "ko": "지금 몇 시예요? 어, 늦었네요! 좋은 하루 보내요!"
        },
        "frames": [
          "en-f1-19"
        ]
      }
    ]
  },
  {
    "id": "en-1-x1",
    "stage": 1,
    "setting": {
      "en": "In class, a classmate needs a pen",
      "ko": "수업 중 펜이 필요한 같은 반 친구"
    },
    "expressions": [
      "no problem",
      "you're welcome"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Excuse me, do you have a pen?",
        "gloss": {
          "en": "Excuse me, do you have a pen?",
          "ko": "저기, 펜 있어?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I have two pens. Here you go.",
        "gloss": {
          "en": "Yes, I have two pens. Here you go.",
          "ko": "응, 펜 두 개 있어. 여기."
        },
        "frames": [
          "en-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Thanks a lot! Sorry, I can't find my pen.",
        "gloss": {
          "en": "Thanks a lot! Sorry, I can't find my pen.",
          "ko": "정말 고마워! 미안, 내 펜을 못 찾겠어."
        }
      },
      {
        "who": "me",
        "text": "No problem. Do you need a notebook too?",
        "gloss": {
          "en": "No problem. Do you need a notebook too?",
          "ko": "괜찮아. 공책도 필요해?"
        }
      },
      {
        "who": "them",
        "text": "No, I have a notebook. Thank you so much!",
        "gloss": {
          "en": "No, I have a notebook. Thank you so much!",
          "ko": "아니, 공책은 있어. 정말 고마워!"
        }
      },
      {
        "who": "me",
        "text": "You're welcome.",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에."
        }
      }
    ]
  },
  {
    "id": "en-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Monday morning at the office, catching up with your coworker Jake",
      "ko": "월요일 아침 사무실에서 동료 제이크와 주말 이야기"
    },
    "expressions": [
      "how was your weekend",
      "it was fun",
      "by the way",
      "what happened",
      "that's too bad"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Morning! How was your weekend?",
        "gloss": {
          "en": "Morning! How was your weekend?",
          "ko": "좋은 아침! 주말 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "It was fun! I went to the beach with my sister. How was your weekend?",
        "gloss": {
          "en": "It was fun! I went to the beach with my sister. How was your weekend?",
          "ko": "재밌었어! 언니랑 바다에 갔어. 너는 주말 어땠어?"
        },
        "frames": [
          "en-f2-03",
          "en-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Pretty quiet. I stayed home and watched movies. What did you do on Sunday?",
        "gloss": {
          "en": "Pretty quiet. I stayed home and watched movies. What did you do on Sunday?",
          "ko": "꽤 조용했어. 집에서 영화 봤어. 일요일엔 뭐 했어?"
        }
      },
      {
        "who": "me",
        "text": "I visited my parents. My mom cooked a big lunch, so I ate too much.",
        "gloss": {
          "en": "I visited my parents. My mom cooked a big lunch, so I ate too much.",
          "ko": "부모님 댁에 갔어. 엄마가 점심을 푸짐하게 해 주셔서 너무 많이 먹었어."
        },
        "frames": [
          "en-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Ha, that sounds nice. Are you busy this week?",
        "gloss": {
          "en": "Ha, that sounds nice. Are you busy this week?",
          "ko": "하하, 좋았겠다. 이번 주 바빠?"
        }
      },
      {
        "who": "me",
        "text": "Yeah, I'm writing the new report right now. I'm going to finish it on Wednesday.",
        "gloss": {
          "en": "Yeah, I'm writing the new report right now. I'm going to finish it on Wednesday.",
          "ko": "응, 지금 새 보고서 쓰는 중이야. 수요일에 끝낼 거야."
        },
        "frames": [
          "en-f2-04",
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Good luck with that. Do you want a coffee? I'm going downstairs.",
        "gloss": {
          "en": "Good luck with that. Do you want a coffee? I'm going downstairs.",
          "ko": "힘내. 커피 마실래? 나 아래층 가는데."
        }
      },
      {
        "who": "me",
        "text": "Oh, yes, please! By the way, what happened to the coffee machine?",
        "gloss": {
          "en": "Oh, yes, please! By the way, what happened to the coffee machine?",
          "ko": "아, 응, 부탁해! 그런데 커피 머신은 어떻게 된 거야?"
        }
      },
      {
        "who": "them",
        "text": "It broke on Friday. They're fixing it today.",
        "gloss": {
          "en": "It broke on Friday. They're fixing it today.",
          "ko": "금요일에 고장 났어. 오늘 고치고 있대."
        }
      },
      {
        "who": "me",
        "text": "That's too bad. I never have breakfast, so I always need my coffee!",
        "gloss": {
          "en": "That's too bad. I never have breakfast, so I always need my coffee!",
          "ko": "아쉽다. 난 아침을 절대 안 먹어서 항상 커피가 필요하거든!"
        },
        "frames": [
          "en-f2-14",
          "en-f2-13"
        ]
      }
    ]
  },
  {
    "id": "en-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Texting your friend Mia to make plans for the weekend",
      "ko": "친구 미아와 메시지로 주말 약속 잡기"
    },
    "expressions": [
      "what are you up to",
      "let me check",
      "sounds good",
      "how long does it take",
      "let's meet at",
      "maybe next time",
      "see you then"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hey! Long time no see. How are you?",
        "gloss": {
          "en": "Hey! Long time no see. How are you?",
          "ko": "안녕! 오랜만이야. 잘 지내?"
        }
      },
      {
        "who": "me",
        "text": "Hey, Mia! I'm good. What are you up to?",
        "gloss": {
          "en": "Hey, Mia! I'm good. What are you up to?",
          "ko": "안녕, 미아! 잘 지내. 뭐 하고 있어?"
        }
      },
      {
        "who": "them",
        "text": "I'm cooking dinner right now. Are you free on Saturday?",
        "gloss": {
          "en": "I'm cooking dinner right now. Are you free on Saturday?",
          "ko": "지금 저녁 하는 중이야. 토요일에 시간 돼?"
        }
      },
      {
        "who": "me",
        "text": "Saturday? Let me check. I'm working in the morning, but I'm free after three.",
        "gloss": {
          "en": "Saturday? Let me check. I'm working in the morning, but I'm free after three.",
          "ko": "토요일? 잠깐 확인해 볼게. 오전엔 일하는데 세 시 이후엔 괜찮아."
        }
      },
      {
        "who": "them",
        "text": "Great! There's a new pizza place downtown. Do you want to try it?",
        "gloss": {
          "en": "Great! There's a new pizza place downtown. Do you want to try it?",
          "ko": "좋아! 시내에 새 피자집 생겼는데. 가 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Sounds good! How long does it take to get there?",
        "gloss": {
          "en": "Sounds good! How long does it take to get there?",
          "ko": "좋아! 거기까지 얼마나 걸려?"
        },
        "frames": [
          "en-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "About twenty minutes by bus. Where do you want to meet?",
        "gloss": {
          "en": "About twenty minutes by bus. Where do you want to meet?",
          "ko": "버스로 이십 분쯤. 어디서 만날까?"
        }
      },
      {
        "who": "me",
        "text": "Let's meet at the bus stop at five. Is that okay?",
        "gloss": {
          "en": "Let's meet at the bus stop at five. Is that okay?",
          "ko": "다섯 시에 버스 정류장에서 만나자. 괜찮아?"
        },
        "frames": [
          "en-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Perfect. And on Sunday, do you want to go hiking with us?",
        "gloss": {
          "en": "Perfect. And on Sunday, do you want to go hiking with us?",
          "ko": "완벽해. 그리고 일요일에 우리랑 등산 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Maybe next time. I'm visiting my grandma on Sunday. See you then!",
        "gloss": {
          "en": "Maybe next time. I'm visiting my grandma on Sunday. See you then!",
          "ko": "다음에 갈게. 일요일엔 할머니 댁에 가거든. 그때 봐!"
        },
        "frames": [
          "en-f2-19"
        ]
      }
    ]
  },
  {
    "id": "en-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Ordering a drink and a snack at a busy café",
      "ko": "붐비는 카페에서 음료와 간식 주문하기"
    },
    "expressions": [
      "with oat milk",
      "which one is better",
      "for here or to go",
      "on the way"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi there! What can I get for you?",
        "gloss": {
          "en": "Hi there! What can I get for you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Hi. Can I get a large latte with oat milk, please?",
        "gloss": {
          "en": "Hi. Can I get a large latte with oat milk, please?",
          "ko": "안녕하세요. 귀리 우유로 라테 큰 사이즈 한 잔 주실래요?"
        },
        "frames": [
          "en-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Sure. Anything else? The muffins are fresh today.",
        "gloss": {
          "en": "Sure. Anything else? The muffins are fresh today.",
          "ko": "네. 더 필요한 건요? 오늘 머핀이 갓 나왔어요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, which one is better, the blueberry or the chocolate?",
        "gloss": {
          "en": "Hmm, which one is better, the blueberry or the chocolate?",
          "ko": "음, 블루베리랑 초콜릿 중에 어느 게 더 나아요?"
        },
        "frames": [
          "en-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "The chocolate one is more popular, but the blueberry is my favorite.",
        "gloss": {
          "en": "The chocolate one is more popular, but the blueberry is my favorite.",
          "ko": "초콜릿이 더 인기 있는데, 제가 제일 좋아하는 건 블루베리예요."
        }
      },
      {
        "who": "me",
        "text": "Okay, I'll have the blueberry one. Do you have any cookies too?",
        "gloss": {
          "en": "Okay, I'll have the blueberry one. Do you have any cookies too?",
          "ko": "그럼 블루베리로 할게요. 쿠키도 있어요?"
        },
        "frames": [
          "en-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Sorry, we don't have any cookies today. For here or to go?",
        "gloss": {
          "en": "Sorry, we don't have any cookies today. For here or to go?",
          "ko": "죄송해요, 오늘은 쿠키가 없어요. 드시고 가세요, 가져가세요?"
        }
      },
      {
        "who": "me",
        "text": "For here or to go? Oh, to go, please. I'm on the way to work.",
        "gloss": {
          "en": "For here or to go? Oh, to go, please. I'm on the way to work.",
          "ko": "드시고 가냐고요? 아, 가져갈게요. 출근하는 길이라서요."
        }
      },
      {
        "who": "them",
        "text": "Got it. That's seven fifty. You can tap your card here.",
        "gloss": {
          "en": "Got it. That's seven fifty. You can tap your card here.",
          "ko": "알겠습니다. 칠 달러 오십 센트예요. 여기 카드 대시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Here you go. Thanks, have a good one!",
        "gloss": {
          "en": "Here you go. Thanks, have a good one!",
          "ko": "여기요. 고마워요, 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "en-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Checking in at a hotel late in the evening on a trip",
      "ko": "여행 중 저녁 늦게 호텔 체크인"
    },
    "expressions": [
      "by the way",
      "last night"
    ],
    "grammar": [
      0,
      2,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Good evening, welcome to the Bayview Hotel. How can I help you?",
        "gloss": {
          "en": "Good evening, welcome to the Bayview Hotel. How can I help you?",
          "ko": "안녕하세요, 베이뷰 호텔에 오신 걸 환영합니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Hi, I have a reservation under Kim. Two nights.",
        "gloss": {
          "en": "Hi, I have a reservation under Kim. Two nights.",
          "ko": "안녕하세요, 김으로 예약했어요. 이틀 밤이요."
        }
      },
      {
        "who": "them",
        "text": "Let me see... Yes, a double room. Can I see your passport, please?",
        "gloss": {
          "en": "Let me see... Yes, a double room. Can I see your passport, please?",
          "ko": "확인해 볼게요... 네, 더블룸이네요. 여권 좀 볼 수 있을까요?"
        }
      },
      {
        "who": "me",
        "text": "Sure, here's my passport. Is breakfast included?",
        "gloss": {
          "en": "Sure, here's my passport. Is breakfast included?",
          "ko": "네, 여기 제 여권이요. 조식 포함인가요?"
        }
      },
      {
        "who": "them",
        "text": "Yes, breakfast is from seven to ten in the restaurant on the first floor.",
        "gloss": {
          "en": "Yes, breakfast is from seven to ten in the restaurant on the first floor.",
          "ko": "네, 조식은 일 층 식당에서 일곱 시부터 열 시까지예요."
        }
      },
      {
        "who": "me",
        "text": "Great. By the way, is there a quieter room? Our last hotel was really noisy.",
        "gloss": {
          "en": "Great. By the way, is there a quieter room? Our last hotel was really noisy.",
          "ko": "좋네요. 그런데 더 조용한 방이 있을까요? 지난번 호텔이 정말 시끄러웠거든요."
        }
      },
      {
        "who": "them",
        "text": "Of course. The rooms on the top floor are the quietest.",
        "gloss": {
          "en": "Of course. The rooms on the top floor are the quietest.",
          "ko": "물론이죠. 맨 위층 방이 제일 조용해요."
        }
      },
      {
        "who": "me",
        "text": "That's perfect. We flew in from Chicago last night, so we're really tired.",
        "gloss": {
          "en": "That's perfect. We flew in from Chicago last night, so we're really tired.",
          "ko": "딱 좋아요. 어젯밤에 시카고에서 비행기로 와서 정말 피곤하거든요."
        },
        "frames": [
          "en-f2-01",
          "en-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "I understand. Here are your keys. Your room is on the tenth floor.",
        "gloss": {
          "en": "I understand. Here are your keys. Your room is on the tenth floor.",
          "ko": "그러시겠어요. 열쇠 여기 있습니다. 방은 십 층이에요."
        }
      },
      {
        "who": "me",
        "text": "Thank you. Oh, and can you call us a taxi tomorrow morning? We're going to the museum.",
        "gloss": {
          "en": "Thank you. Oh, and can you call us a taxi tomorrow morning? We're going to the museum.",
          "ko": "감사합니다. 아, 그리고 내일 아침에 택시 좀 불러 주실 수 있어요? 박물관에 가거든요."
        }
      }
    ]
  },
  {
    "id": "en-2-5",
    "stage": 2,
    "situation": 4,
    "setting": {
      "en": "Shopping for a winter jacket and comparing prices",
      "ko": "겨울 재킷을 사며 값 비교하기"
    },
    "expressions": [
      "next weekend",
      "a bit expensive",
      "a little cheaper",
      "not bad at all"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! Are you looking for anything special?",
        "gloss": {
          "en": "Hi! Are you looking for anything special?",
          "ko": "안녕하세요! 특별히 찾으시는 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, I need a warm jacket for next weekend. I'm going to visit Denver.",
        "gloss": {
          "en": "Yes, I need a warm jacket for next weekend. I'm going to visit Denver.",
          "ko": "네, 다음 주말에 입을 따뜻한 재킷이 필요해요. 덴버에 갈 거라서요."
        },
        "frames": [
          "en-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Nice! This black one is really popular. It's one hundred twenty dollars.",
        "gloss": {
          "en": "Nice! This black one is really popular. It's one hundred twenty dollars.",
          "ko": "좋네요! 이 검은색이 정말 인기 있어요. 백이십 달러예요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, that's a bit expensive. Do you have anything a little cheaper?",
        "gloss": {
          "en": "Hmm, that's a bit expensive. Do you have anything a little cheaper?",
          "ko": "음, 좀 비싸네요. 조금 더 싼 거 있어요?"
        }
      },
      {
        "who": "them",
        "text": "Sure. This gray one is eighty dollars. It's lighter, but it's still warm.",
        "gloss": {
          "en": "Sure. This gray one is eighty dollars. It's lighter, but it's still warm.",
          "ko": "그럼요. 이 회색은 팔십 달러예요. 더 가볍지만 그래도 따뜻해요."
        }
      },
      {
        "who": "me",
        "text": "I like the color. Is it warmer than the blue one?",
        "gloss": {
          "en": "I like the color. Is it warmer than the blue one?",
          "ko": "색이 마음에 들어요. 파란 것보다 더 따뜻해요?"
        },
        "frames": [
          "en-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Yeah, the blue one is the thinnest. Do you want to try it on?",
        "gloss": {
          "en": "Yeah, the blue one is the thinnest. Do you want to try it on?",
          "ko": "네, 파란 게 제일 얇아요. 입어 보실래요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, please. Hmm, it's not bad at all! But the sleeves are too long.",
        "gloss": {
          "en": "Yes, please. Hmm, it's not bad at all! But the sleeves are too long.",
          "ko": "네. 음, 전혀 나쁘지 않네요! 그런데 소매가 너무 길어요."
        }
      },
      {
        "who": "them",
        "text": "We have it in a smaller size too. I'll get it for you.",
        "gloss": {
          "en": "We have it in a smaller size too. I'll get it for you.",
          "ko": "더 작은 사이즈도 있어요. 가져다드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Thanks! Oh, and is this bag yours? It was on the chair.",
        "gloss": {
          "en": "Thanks! Oh, and is this bag yours? It was on the chair.",
          "ko": "고마워요! 아, 그리고 이 가방 당신 거예요? 의자 위에 있었어요."
        },
        "frames": [
          "en-f2-17"
        ]
      }
    ]
  },
  {
    "id": "en-2-x1",
    "stage": 2,
    "setting": {
      "en": "Messaging a friend to plan a movie night",
      "ko": "친구와 메시지로 영화 볼 약속 잡기"
    },
    "expressions": [
      "are you free on"
    ],
    "grammar": [
      4,
      6
    ],
    "earlierGrammar": [
      "1:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hey! Do you want to see a movie this week?",
        "gloss": {
          "en": "Hey! Do you want to see a movie this week?",
          "ko": "안녕! 이번 주에 영화 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Sure! Are you free on Thursday? I'm busy on Wednesday.",
        "gloss": {
          "en": "Sure! Are you free on Thursday? I'm busy on Wednesday.",
          "ko": "좋아! 목요일에 시간 돼? 수요일엔 바빠."
        },
        "frames": [
          "en-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Thursday works. I usually finish work at six.",
        "gloss": {
          "en": "Thursday works. I usually finish work at six.",
          "ko": "목요일 괜찮아. 난 보통 여섯 시에 퇴근해."
        }
      },
      {
        "who": "me",
        "text": "Me too. Let's have dinner first, because the movie starts at eight.",
        "gloss": {
          "en": "Me too. Let's have dinner first, because the movie starts at eight.",
          "ko": "나도. 영화가 여덟 시에 시작하니까 먼저 저녁 먹자."
        },
        "frames": [
          "en-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Great idea. Is Sam coming too?",
        "gloss": {
          "en": "Great idea. Is Sam coming too?",
          "ko": "좋은 생각이야. 샘도 와?"
        }
      },
      {
        "who": "me",
        "text": "I don't think so. He doesn't have much free time these days.",
        "gloss": {
          "en": "I don't think so. He doesn't have much free time these days.",
          "ko": "아닐 것 같아. 요즘 샘은 시간이 별로 없거든."
        },
        "frames": [
          "en-f2-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Over dinner, telling friends about a trip to Lisbon that went wrong",
      "ko": "저녁 자리에서 친구들에게 꼬였던 리스본 여행 이야기하기"
    },
    "expressions": [
      "have you ever been",
      "it turned out",
      "the thing is",
      "in the end"
    ],
    "grammar": [
      0,
      1,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "So how was Portugal? Tell us everything!",
        "gloss": {
          "en": "So how was Portugal? Tell us everything!",
          "ko": "그래서 포르투갈은 어땠어? 전부 얘기해 봐!"
        }
      },
      {
        "who": "me",
        "text": "Honestly, it was kind of a disaster. Have you ever been to Lisbon?",
        "gloss": {
          "en": "Honestly, it was kind of a disaster. Have you ever been to Lisbon?",
          "ko": "솔직히 좀 엉망이었어. 리스본 가 본 적 있어?"
        },
        "frames": [
          "en-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "No, never. Why, what happened?",
        "gloss": {
          "en": "No, never. Why, what happened?",
          "ko": "아니, 한 번도. 왜, 무슨 일 있었어?"
        },
        "alt": [
          {
            "text": "Not yet, but it's on my list. Why, what went wrong?",
            "gloss": {
              "en": "Not yet, but it's on my list. Why, what went wrong?",
              "ko": "아직, 근데 가 보고 싶은 곳이야. 왜, 뭐가 잘못됐는데?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Well, we were waiting at the gate when they canceled our flight.",
        "gloss": {
          "en": "Well, we were waiting at the gate when they canceled our flight.",
          "ko": "음, 탑승구에서 기다리고 있는데 항공편이 취소됐어."
        },
        "frames": [
          "en-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh no! So what did you do?",
        "gloss": {
          "en": "Oh no! So what did you do?",
          "ko": "어떡해! 그래서 어떻게 했어?"
        }
      },
      {
        "who": "me",
        "text": "We had to sleep at the airport. It was such a long night that I almost cried.",
        "gloss": {
          "en": "We had to sleep at the airport. It was such a long night that I almost cried.",
          "ko": "공항에서 자야 했어. 밤이 너무 길어서 거의 울 뻔했어."
        },
        "frames": [
          "en-f3-06",
          "en-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "That's terrible! Did they give you a new flight?",
        "gloss": {
          "en": "That's terrible! Did they give you a new flight?",
          "ko": "끔찍하다! 새 항공편은 받았어?"
        },
        "alt": [
          {
            "text": "Wow. Did the airline at least book you on another flight?",
            "gloss": {
              "en": "Wow. Did the airline at least book you on another flight?",
              "ko": "와. 항공사가 적어도 다른 비행기는 잡아 줬어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Yes, but it turned out we were put on a flight the next evening.",
        "gloss": {
          "en": "Yes, but it turned out we were put on a flight the next evening.",
          "ko": "응, 근데 알고 보니 다음 날 저녁 비행기로 잡혔더라고."
        },
        "frames": [
          "en-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Wait, so you lost a whole day of your vacation?",
        "gloss": {
          "en": "Wait, so you lost a whole day of your vacation?",
          "ko": "잠깐, 그럼 휴가 하루를 통째로 날린 거야?"
        }
      },
      {
        "who": "me",
        "text": "Yeah. And the thing is, my suitcase was sent to Madrid by mistake.",
        "gloss": {
          "en": "Yeah. And the thing is, my suitcase was sent to Madrid by mistake.",
          "ko": "응. 그런데 문제는, 내 여행 가방이 실수로 마드리드로 보내졌다는 거야."
        },
        "frames": [
          "en-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "No way! Did you get it back?",
        "gloss": {
          "en": "No way! Did you get it back?",
          "ko": "말도 안 돼! 가방은 돌려받았어?"
        }
      },
      {
        "who": "me",
        "text": "In the end, yes. Two days later! I'm never flying with them again.",
        "gloss": {
          "en": "In the end, yes. Two days later! I'm never flying with them again.",
          "ko": "결국엔 받았어. 이틀 뒤에! 그 항공사는 다시는 안 탈 거야."
        }
      }
    ]
  },
  {
    "id": "en-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling an online store's customer service about a late delivery",
      "ko": "온라인 쇼핑몰 고객센터에 늦은 배송 문의 전화"
    },
    "expressions": [
      "so far",
      "what do you mean",
      "to be honest",
      "sort it out",
      "as soon as possible"
    ],
    "grammar": [
      0,
      2,
      3,
      6,
      10
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thanks for calling ShopNow. My name is Dana. How can I help you today?",
        "gloss": {
          "en": "Thanks for calling ShopNow. My name is Dana. How can I help you today?",
          "ko": "샵나우에 전화 주셔서 감사합니다. 저는 데이나예요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Hi, Dana. I'm calling about an order. It hasn't arrived yet.",
        "gloss": {
          "en": "Hi, Dana. I'm calling about an order. It hasn't arrived yet.",
          "ko": "안녕하세요, 데이나. 주문 건 때문에 전화했어요. 아직 안 왔어요."
        }
      },
      {
        "who": "them",
        "text": "I'm sorry to hear that. Can I have your order number, please?",
        "gloss": {
          "en": "I'm sorry to hear that. Can I have your order number, please?",
          "ko": "불편을 드려 죄송합니다. 주문 번호 좀 알려 주시겠어요?"
        },
        "alt": [
          {
            "text": "Oh no, let's take a look. What's the order number?",
            "gloss": {
              "en": "Oh no, let's take a look. What's the order number?",
              "ko": "저런, 확인해 볼게요. 주문 번호가 어떻게 되세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Sure, it's seven seven two four one.",
        "gloss": {
          "en": "Sure, it's seven seven two four one.",
          "ko": "네, 칠칠이사일이에요."
        }
      },
      {
        "who": "them",
        "text": "Thank you. I see it was shipped last Monday. It should have arrived by Thursday.",
        "gloss": {
          "en": "Thank you. I see it was shipped last Monday. It should have arrived by Thursday.",
          "ko": "감사합니다. 지난 월요일에 발송됐네요. 목요일까지는 도착했어야 했는데요."
        }
      },
      {
        "who": "me",
        "text": "Right. I was told it would arrive on Thursday, but so far nothing.",
        "gloss": {
          "en": "Right. I was told it would arrive on Thursday, but so far nothing.",
          "ko": "맞아요. 목요일에 온다고 들었는데 지금까지 아무것도 안 왔어요."
        },
        "frames": [
          "en-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "I'm really sorry. It looks like it was sent to the wrong warehouse.",
        "gloss": {
          "en": "I'm really sorry. It looks like it was sent to the wrong warehouse.",
          "ko": "정말 죄송합니다. 다른 물류 창고로 보내진 것 같아요."
        },
        "alt": [
          {
            "text": "I apologize. It seems the package got stuck at one of our warehouses.",
            "gloss": {
              "en": "I apologize. It seems the package got stuck at one of our warehouses.",
              "ko": "죄송합니다. 택배가 저희 창고 한 곳에 묶여 있는 것 같아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "What do you mean? Is it lost?",
        "gloss": {
          "en": "What do you mean? Is it lost?",
          "ko": "무슨 말씀이세요? 잃어버린 거예요?"
        },
        "frames": [
          "en-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "No, no, it's safe. It's just going to be a few days late.",
        "gloss": {
          "en": "No, no, it's safe. It's just going to be a few days late.",
          "ko": "아뇨, 아뇨, 안전해요. 며칠 늦어질 뿐이에요."
        }
      },
      {
        "who": "me",
        "text": "To be honest, I have to have it by Friday. Can you sort it out as soon as possible?",
        "gloss": {
          "en": "To be honest, I have to have it by Friday. Can you sort it out as soon as possible?",
          "ko": "솔직히 금요일까지는 꼭 받아야 해요. 최대한 빨리 해결해 주실 수 있나요?"
        },
        "frames": [
          "en-f3-18",
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "If I upgrade it to express shipping now, it'll arrive tomorrow. Is that okay?",
        "gloss": {
          "en": "If I upgrade it to express shipping now, it'll arrive tomorrow. Is that okay?",
          "ko": "지금 특급 배송으로 바꿔 드리면 내일 도착해요. 괜찮으세요?"
        },
        "alt": [
          {
            "text": "I can send it again by express, and it'll be there tomorrow. Would that work?",
            "gloss": {
              "en": "I can send it again by express, and it'll be there tomorrow. Would that work?",
              "ko": "특급으로 다시 보내 드리면 내일 도착할 거예요. 그렇게 해 드릴까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Great, thanks. If it doesn't arrive tomorrow, I'll call you back.",
        "gloss": {
          "en": "Great, thanks. If it doesn't arrive tomorrow, I'll call you back.",
          "ko": "좋아요, 감사합니다. 내일 안 오면 다시 전화할게요."
        },
        "frames": [
          "en-f3-04"
        ]
      }
    ]
  },
  {
    "id": "en-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Showing a new colleague how things work on her first day",
      "ko": "첫 출근한 새 동료에게 일하는 방식 알려 주기"
    },
    "expressions": [
      "it depends",
      "make sure",
      "on time",
      "figure it out",
      "let me know"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      8,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi! Sorry to bother you. I just started today, and I'm a bit lost.",
        "gloss": {
          "en": "Hi! Sorry to bother you. I just started today, and I'm a bit lost.",
          "ko": "안녕하세요! 방해해서 죄송해요. 오늘 막 입사했는데 좀 헤매고 있어요."
        }
      },
      {
        "who": "me",
        "text": "No worries! Have you set up your laptop yet?",
        "gloss": {
          "en": "No worries! Have you set up your laptop yet?",
          "ko": "괜찮아요! 노트북 설정은 했어요?"
        }
      },
      {
        "who": "them",
        "text": "Not yet. I don't know the password.",
        "gloss": {
          "en": "Not yet. I don't know the password.",
          "ko": "아직요. 비밀번호를 몰라서요."
        },
        "alt": [
          {
            "text": "Kind of. I'm stuck on the password, though.",
            "gloss": {
              "en": "Kind of. I'm stuck on the password, though.",
              "ko": "대충요. 근데 비밀번호에서 막혔어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "You have to ask IT. That's the guy who sits by the window.",
        "gloss": {
          "en": "You have to ask IT. That's the guy who sits by the window.",
          "ko": "IT 팀에 물어봐야 해요. 창가에 앉은 저분이에요."
        },
        "frames": [
          "en-f3-06",
          "en-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Got it. And what about lunch? Do people eat together here?",
        "gloss": {
          "en": "Got it. And what about lunch? Do people eat together here?",
          "ko": "알겠어요. 점심은요? 여기는 다 같이 먹어요?"
        }
      },
      {
        "who": "me",
        "text": "It depends. Most people eat at their desks, but on Fridays we go out together.",
        "gloss": {
          "en": "It depends. Most people eat at their desks, but on Fridays we go out together.",
          "ko": "그때그때 달라요. 대부분 자리에서 먹는데 금요일엔 다 같이 나가요."
        }
      },
      {
        "who": "them",
        "text": "Nice. Is there anything I should know about the Monday meeting?",
        "gloss": {
          "en": "Nice. Is there anything I should know about the Monday meeting?",
          "ko": "좋네요. 월요일 회의에 대해 알아 둘 게 있을까요?"
        },
        "alt": [
          {
            "text": "Cool. Any tips for the team meeting on Monday?",
            "gloss": {
              "en": "Cool. Any tips for the team meeting on Monday?",
              "ko": "좋아요. 월요일 팀 회의 관련해서 팁 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Yeah, make sure you're on time. The boss hates waiting.",
        "gloss": {
          "en": "Yeah, make sure you're on time. The boss hates waiting.",
          "ko": "네, 꼭 시간 맞춰 오세요. 팀장님이 기다리는 걸 정말 싫어하거든요."
        },
        "frames": [
          "en-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Good to know! What if I can't understand the new software?",
        "gloss": {
          "en": "Good to know! What if I can't understand the new software?",
          "ko": "알아 두면 좋겠네요! 새 프로그램을 이해 못 하면 어쩌죠?"
        }
      },
      {
        "who": "me",
        "text": "Don't worry. It's really confusing at first, but you'll figure it out.",
        "gloss": {
          "en": "Don't worry. It's really confusing at first, but you'll figure it out.",
          "ko": "걱정 마요. 처음엔 정말 헷갈리는데 금방 알게 될 거예요."
        }
      },
      {
        "who": "them",
        "text": "Thanks so much. You've been super helpful.",
        "gloss": {
          "en": "Thanks so much. You've been super helpful.",
          "ko": "정말 고마워요. 큰 도움이 됐어요."
        }
      },
      {
        "who": "me",
        "text": "Anytime. If you have questions, just let me know.",
        "gloss": {
          "en": "Anytime. If you have questions, just let me know.",
          "ko": "언제든지요. 궁금한 거 있으면 그냥 말해 줘요."
        },
        "frames": [
          "en-f3-16"
        ]
      }
    ]
  },
  {
    "id": "en-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Your friend is stressed about exams and can't sleep",
      "ko": "시험 때문에 스트레스받아 잠을 못 자는 친구"
    },
    "expressions": [
      "no wonder",
      "it's worth trying",
      "fair enough",
      "just in case"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      8
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ugh, I can't sleep. I have so much work, and my exams start next week.",
        "gloss": {
          "en": "Ugh, I can't sleep. I have so much work, and my exams start next week.",
          "ko": "아, 잠이 안 와. 할 게 너무 많은데 다음 주에 시험이 시작해."
        }
      },
      {
        "who": "me",
        "text": "That sounds really stressful. Have you slept at all this week?",
        "gloss": {
          "en": "That sounds really stressful. Have you slept at all this week?",
          "ko": "정말 스트레스받겠다. 이번 주에 잠은 좀 잤어?"
        }
      },
      {
        "who": "them",
        "text": "Like four hours a night. I'm so tired that I can't focus.",
        "gloss": {
          "en": "Like four hours a night. I'm so tired that I can't focus.",
          "ko": "하룻밤에 네 시간 정도. 너무 피곤해서 집중이 안 돼."
        },
        "alt": [
          {
            "text": "Barely. Maybe four hours a night, and I keep forgetting things.",
            "gloss": {
              "en": "Barely. Maybe four hours a night, and I keep forgetting things.",
              "ko": "거의 못 잤어. 하룻밤에 네 시간쯤인데 자꾸 깜빡해."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "No wonder you can't focus! You should take a break and get some rest.",
        "gloss": {
          "en": "No wonder you can't focus! You should take a break and get some rest.",
          "ko": "집중이 안 될 만하지! 잠깐 쉬면서 좀 자는 게 좋겠어."
        },
        "frames": [
          "en-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "But if I take a break, I'll fall behind.",
        "gloss": {
          "en": "But if I take a break, I'll fall behind.",
          "ko": "근데 쉬면 뒤처질 거야."
        }
      },
      {
        "who": "me",
        "text": "I get it, but if you don't sleep, you'll get sick. Then you'll fall even further behind.",
        "gloss": {
          "en": "I get it, but if you don't sleep, you'll get sick. Then you'll fall even further behind.",
          "ko": "알지, 근데 잠을 안 자면 아플 거야. 그럼 더 뒤처지게 돼."
        }
      },
      {
        "who": "them",
        "text": "Maybe you're right. What do you do when you're stressed?",
        "gloss": {
          "en": "Maybe you're right. What do you do when you're stressed?",
          "ko": "네 말이 맞을지도. 너는 스트레스받을 때 뭐 해?"
        },
        "alt": [
          {
            "text": "Hmm. So what helps you when you're stressed out?",
            "gloss": {
              "en": "Hmm. So what helps you when you're stressed out?",
              "ko": "음. 그럼 너는 스트레스받을 때 뭐가 도움이 돼?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "I try to go for a walk every day. It's worth trying, honestly.",
        "gloss": {
          "en": "I try to go for a walk every day. It's worth trying, honestly.",
          "ko": "매일 산책하려고 해. 진짜 한번 해 볼 만해."
        },
        "frames": [
          "en-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "I don't know. Walking feels like a waste of time.",
        "gloss": {
          "en": "I don't know. Walking feels like a waste of time.",
          "ko": "글쎄. 걷는 건 시간 낭비 같아."
        }
      },
      {
        "who": "me",
        "text": "Fair enough, but it really clears my head. Just try it for ten minutes.",
        "gloss": {
          "en": "Fair enough, but it really clears my head. Just try it for ten minutes.",
          "ko": "그럴 수 있지, 근데 머리가 진짜 맑아져. 딱 십 분만 해 봐."
        }
      },
      {
        "who": "them",
        "text": "Okay, I'll try tomorrow. Thanks for listening.",
        "gloss": {
          "en": "Okay, I'll try tomorrow. Thanks for listening.",
          "ko": "알았어, 내일 해 볼게. 들어 줘서 고마워."
        }
      },
      {
        "who": "me",
        "text": "Of course. Call me tonight, just in case you need to talk.",
        "gloss": {
          "en": "Of course. Call me tonight, just in case you need to talk.",
          "ko": "당연하지. 혹시 얘기하고 싶으면 오늘 밤에 전화해."
        }
      }
    ]
  },
  {
    "id": "en-3-5",
    "stage": 3,
    "situation": 4,
    "setting": {
      "en": "At a doctor's appointment, describing a sore throat and fever",
      "ko": "병원 진료에서 목 통증과 열 증상 설명하기"
    },
    "expressions": [
      "run out of",
      "that makes sense"
    ],
    "grammar": [
      0,
      2,
      3,
      7,
      9,
      10
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hi, come in and have a seat. What seems to be the problem?",
        "gloss": {
          "en": "Hi, come in and have a seat. What seems to be the problem?",
          "ko": "안녕하세요, 들어와서 앉으세요. 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Hi, doctor. I've had a sore throat and a headache since Monday.",
        "gloss": {
          "en": "Hi, doctor. I've had a sore throat and a headache since Monday.",
          "ko": "안녕하세요, 선생님. 월요일부터 목이 아프고 두통이 있어요."
        }
      },
      {
        "who": "them",
        "text": "I see. Have you had a fever?",
        "gloss": {
          "en": "I see. Have you had a fever?",
          "ko": "그렇군요. 열도 났어요?"
        },
        "alt": [
          {
            "text": "Okay. Any fever or chills?",
            "gloss": {
              "en": "Okay. Any fever or chills?",
              "ko": "네. 열이나 오한은요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Yes, a little. It was so high last night that I couldn't sleep.",
        "gloss": {
          "en": "Yes, a little. It was so high last night that I couldn't sleep.",
          "ko": "네, 조금요. 어젯밤엔 열이 너무 높아서 잠을 못 잤어요."
        },
        "frames": [
          "en-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Have you taken anything for it?",
        "gloss": {
          "en": "Have you taken anything for it?",
          "ko": "약은 뭐 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "I took some painkillers, but I've run out of them now.",
        "gloss": {
          "en": "I took some painkillers, but I've run out of them now.",
          "ko": "진통제를 먹었는데 이제 다 떨어졌어요."
        }
      },
      {
        "who": "them",
        "text": "Okay. Let me take a look. Say 'ah'... Your throat is very red.",
        "gloss": {
          "en": "Okay. Let me take a look. Say 'ah'... Your throat is very red.",
          "ko": "네. 한번 볼게요. '아' 해 보세요... 목이 많이 빨갛네요."
        },
        "alt": [
          {
            "text": "Let's have a look. Open wide... Yeah, your throat is pretty swollen.",
            "gloss": {
              "en": "Let's have a look. Open wide... Yeah, your throat is pretty swollen.",
              "ko": "한번 봅시다. 크게 벌려 보세요... 네, 목이 꽤 부었네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "The pharmacist told me it was probably just a cold.",
        "gloss": {
          "en": "The pharmacist told me it was probably just a cold.",
          "ko": "약사는 그냥 감기일 거라고 했어요."
        },
        "frames": [
          "en-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "It might be an infection. You should rest, and you have to finish all of these pills.",
        "gloss": {
          "en": "It might be an infection. You should rest, and you have to finish all of these pills.",
          "ko": "감염일 수도 있어요. 쉬셔야 하고, 이 약은 다 드셔야 해요."
        }
      },
      {
        "who": "me",
        "text": "Okay. Do I have to stay home from work?",
        "gloss": {
          "en": "Okay. Do I have to stay home from work?",
          "ko": "알겠습니다. 회사는 쉬어야 하나요?"
        },
        "frames": [
          "en-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Yes, for two or three days. If you don't feel better by Friday, come back and see me.",
        "gloss": {
          "en": "Yes, for two or three days. If you don't feel better by Friday, come back and see me.",
          "ko": "네, 이삼 일 정도요. 금요일까지 안 나아지면 다시 오세요."
        }
      },
      {
        "who": "me",
        "text": "That makes sense. Thank you. I'll call if it gets worse.",
        "gloss": {
          "en": "That makes sense. Thank you. I'll call if it gets worse.",
          "ko": "그렇겠네요. 감사합니다. 더 나빠지면 전화할게요."
        }
      }
    ]
  },
  {
    "id": "en-3-x1",
    "stage": 3,
    "setting": {
      "en": "Your last day at work, saying goodbye to a teammate",
      "ko": "회사 마지막 날, 팀 동료와 작별하기"
    },
    "expressions": [
      "keep in touch",
      "get back to me"
    ],
    "grammar": [
      4,
      8,
      9
    ],
    "lines": [
      {
        "who": "them",
        "text": "So today's your last day? I can't believe it.",
        "gloss": {
          "en": "So today's your last day? I can't believe it.",
          "ko": "오늘이 마지막 날이야? 믿기지가 않네."
        }
      },
      {
        "who": "me",
        "text": "I know! I decided to take a job in Seattle. I'm excited but a little nervous.",
        "gloss": {
          "en": "I know! I decided to take a job in Seattle. I'm excited but a little nervous.",
          "ko": "그러게! 시애틀에서 일하기로 했어. 설레는데 좀 긴장돼."
        },
        "frames": [
          "en-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "We'll miss you. The team won't be the same.",
        "gloss": {
          "en": "We'll miss you. The team won't be the same.",
          "ko": "보고 싶을 거야. 팀이 예전 같지 않겠다."
        }
      },
      {
        "who": "me",
        "text": "I'll miss you guys too. Let's keep in touch, okay?",
        "gloss": {
          "en": "I'll miss you guys too. Let's keep in touch, okay?",
          "ko": "나도 다들 보고 싶을 거야. 계속 연락하고 지내자, 알았지?"
        }
      },
      {
        "who": "them",
        "text": "Definitely. Is there anything I can do before you go?",
        "gloss": {
          "en": "Definitely. Is there anything I can do before you go?",
          "ko": "당연하지. 가기 전에 내가 해 줄 거 있어?"
        }
      },
      {
        "who": "me",
        "text": "Actually, yes. Can you look over my handover notes and get back to me by noon?",
        "gloss": {
          "en": "Actually, yes. Can you look over my handover notes and get back to me by noon?",
          "ko": "사실 있어. 내 인수인계 메모 좀 훑어보고 정오까지 알려 줄래?"
        },
        "frames": [
          "en-f3-13"
        ]
      }
    ]
  },
  {
    "id": "en-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Arguing with a friend about the ending of a TV series you both watched",
      "ko": "같이 본 드라마 결말을 두고 친구와 논쟁하기"
    },
    "expressions": [
      "no way",
      "that's a good point",
      "to be fair",
      "you might be right",
      "having said that",
      "it's hard to say",
      "when it comes to"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "earlierGrammar": [
      "2:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Okay, I have to say it. That finale was a total mess.",
        "gloss": {
          "en": "Okay, I have to say it. That finale was a total mess.",
          "ko": "좋아, 말해야겠다. 그 마지막 회는 완전 엉망이었어."
        }
      },
      {
        "who": "me",
        "text": "No way! I thought it was brilliant. It was the perfect ending.",
        "gloss": {
          "en": "No way! I thought it was brilliant. It was the perfect ending.",
          "ko": "말도 안 돼! 난 최고였다고 생각해. 완벽한 결말이었어."
        }
      },
      {
        "who": "them",
        "text": "Seriously? They killed off the main character in the last five minutes!",
        "gloss": {
          "en": "Seriously? They killed off the main character in the last five minutes!",
          "ko": "진심이야? 마지막 오 분 만에 주인공을 죽였잖아!"
        },
        "alt": [
          {
            "text": "Come on. Killing off the main character in the last five minutes?",
            "gloss": {
              "en": "Come on. Killing off the main character in the last five minutes?",
              "ko": "에이. 마지막 오 분에 주인공을 죽이는 게 말이 돼?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "That's a good point, but if he'd survived, the whole story wouldn't have made sense.",
        "gloss": {
          "en": "That's a good point, but if he'd survived, the whole story wouldn't have made sense.",
          "ko": "일리는 있어. 근데 그가 살았으면 이야기 전체가 말이 안 됐을 거야."
        }
      },
      {
        "who": "them",
        "text": "But the writers had promised a happy ending for years.",
        "gloss": {
          "en": "But the writers had promised a happy ending for years.",
          "ko": "근데 작가들이 몇 년 동안 해피 엔딩을 약속했잖아."
        }
      },
      {
        "who": "me",
        "text": "To be fair, they'd been hinting at it since season two.",
        "gloss": {
          "en": "To be fair, they'd been hinting at it since season two.",
          "ko": "공정하게 말하면, 시즌 이부터 계속 암시했었어."
        }
      },
      {
        "who": "them",
        "text": "Hinting? Where? I watched every episode twice.",
        "gloss": {
          "en": "Hinting? Where? I watched every episode twice.",
          "ko": "암시? 어디서? 난 전 회차를 두 번씩 봤는데."
        },
        "alt": [
          {
            "text": "Really? I must have missed that, and I watched it twice.",
            "gloss": {
              "en": "Really? I must have missed that, and I watched it twice.",
              "ko": "정말? 난 놓쳤나 봐. 두 번이나 봤는데."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Remember the hospital scene? He must have known he wasn't going to make it.",
        "gloss": {
          "en": "Remember the hospital scene? He must have known he wasn't going to make it.",
          "ko": "병원 장면 기억나? 그는 자기가 살아남지 못할 걸 알았던 게 틀림없어."
        }
      },
      {
        "who": "them",
        "text": "Hmm. Okay, maybe. But it still felt rushed.",
        "gloss": {
          "en": "Hmm. Okay, maybe. But it still felt rushed.",
          "ko": "음. 그래, 그럴 수도. 그래도 서두른 느낌이었어."
        }
      },
      {
        "who": "me",
        "text": "You might be right. If I were the writer, I'd add one more episode.",
        "gloss": {
          "en": "You might be right. If I were the writer, I'd add one more episode.",
          "ko": "네 말이 맞을 수도 있어. 내가 작가라면 한 회를 더 넣었을 거야."
        }
      },
      {
        "who": "them",
        "text": "Exactly! One more episode would have fixed everything.",
        "gloss": {
          "en": "Exactly! One more episode would have fixed everything.",
          "ko": "바로 그거야! 한 회만 더 있었으면 다 해결됐을 거야."
        }
      },
      {
        "who": "me",
        "text": "Having said that, I wouldn't change the ending itself. It was brave.",
        "gloss": {
          "en": "Having said that, I wouldn't change the ending itself. It was brave.",
          "ko": "그렇긴 해도 결말 자체는 안 바꿀 거야. 용감한 선택이었어."
        }
      },
      {
        "who": "them",
        "text": "Fine. Let's agree to disagree. Are you watching the spin-off?",
        "gloss": {
          "en": "Fine. Let's agree to disagree. Are you watching the spin-off?",
          "ko": "좋아. 서로 생각이 다른 걸로 하자. 스핀오프는 볼 거야?"
        },
        "alt": [
          {
            "text": "Alright, we'll never agree. So, are you going to watch the spin-off?",
            "gloss": {
              "en": "Alright, we'll never agree. So, are you going to watch the spin-off?",
              "ko": "그래, 우린 절대 의견이 안 맞겠다. 그래서 스핀오프는 볼 거야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "It's hard to say. When it comes to spin-offs, I'm usually disappointed.",
        "gloss": {
          "en": "It's hard to say. When it comes to spin-offs, I'm usually disappointed.",
          "ko": "글쎄, 모르겠어. 스핀오프라면 보통 실망하거든."
        }
      }
    ]
  },
  {
    "id": "en-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "In a team meeting, pushing back on a launch deadline",
      "ko": "팀 회의에서 출시 마감 일정에 이의 제기하기"
    },
    "expressions": [
      "a tight deadline",
      "take into account",
      "it's not worth it",
      "meet halfway",
      "as long as",
      "in the long run",
      "make a decision"
    ],
    "grammar": [
      0,
      1,
      5,
      7
    ],
    "earlierGrammar": [
      "2:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "So the plan is to launch the new app on March first. Any questions?",
        "gloss": {
          "en": "So the plan is to launch the new app on March first. Any questions?",
          "ko": "그러니까 계획은 삼월 일일에 새 앱을 출시하는 거예요. 질문 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Yes, actually. Honestly, that's a tight deadline for our team.",
        "gloss": {
          "en": "Yes, actually. Honestly, that's a tight deadline for our team.",
          "ko": "네, 사실 있어요. 솔직히 우리 팀에게는 빠듯한 마감이에요."
        }
      },
      {
        "who": "them",
        "text": "I know it's tight, but the client is expecting it.",
        "gloss": {
          "en": "I know it's tight, but the client is expecting it.",
          "ko": "빠듯한 건 알지만 고객이 기다리고 있어요."
        },
        "alt": [
          {
            "text": "I understand, but we've already promised it to the client.",
            "gloss": {
              "en": "I understand, but we've already promised it to the client.",
              "ko": "이해해요. 그런데 이미 고객에게 약속했어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "I get that. But we need to take into account the testing phase. We used to have three weeks for that.",
        "gloss": {
          "en": "I get that. But we need to take into account the testing phase. We used to have three weeks for that.",
          "ko": "알겠어요. 그래도 테스트 단계를 고려해야 해요. 예전엔 테스트에 삼 주를 썼잖아요."
        }
      },
      {
        "who": "them",
        "text": "What if we cut the testing down to one week?",
        "gloss": {
          "en": "What if we cut the testing down to one week?",
          "ko": "테스트를 일주일로 줄이면 어때요?"
        }
      },
      {
        "who": "me",
        "text": "I'd rather not. If we rushed the testing, we'd have bugs everywhere. It's not worth it.",
        "gloss": {
          "en": "I'd rather not. If we rushed the testing, we'd have bugs everywhere. It's not worth it.",
          "ko": "그건 피하고 싶어요. 테스트를 서두르면 곳곳에 버그가 생길 거예요. 그럴 가치가 없어요."
        }
      },
      {
        "who": "them",
        "text": "So what do you suggest?",
        "gloss": {
          "en": "So what do you suggest?",
          "ko": "그럼 어떻게 하자는 거예요?"
        },
        "alt": [
          {
            "text": "Okay, then what would you propose?",
            "gloss": {
              "en": "Okay, then what would you propose?",
              "ko": "좋아요, 그럼 어떤 안이 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Could we meet halfway? We launch the core features in March and the rest in April.",
        "gloss": {
          "en": "Could we meet halfway? We launch the core features in March and the rest in April.",
          "ko": "중간에서 타협할 수 있을까요? 핵심 기능은 삼월에, 나머지는 사월에 내는 거죠."
        }
      },
      {
        "who": "them",
        "text": "Hmm. The client might not like that.",
        "gloss": {
          "en": "Hmm. The client might not like that.",
          "ko": "음. 고객이 싫어할 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "As long as the main features work, they'll be happy. In the long run, it saves us time.",
        "gloss": {
          "en": "As long as the main features work, they'll be happy. In the long run, it saves us time.",
          "ko": "핵심 기능만 제대로 돌아가면 만족할 거예요. 길게 보면 시간도 아끼고요."
        }
      },
      {
        "who": "them",
        "text": "Last time, we missed the deadline by two weeks, remember?",
        "gloss": {
          "en": "Last time, we missed the deadline by two weeks, remember?",
          "ko": "지난번에 마감을 이 주나 넘겼던 거 기억하죠?"
        },
        "alt": [
          {
            "text": "We were late on the last project too, though.",
            "gloss": {
              "en": "We were late on the last project too, though.",
              "ko": "그래도 지난 프로젝트도 늦었잖아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Exactly. If we'd been more realistic back then, we wouldn't have missed it.",
        "gloss": {
          "en": "Exactly. If we'd been more realistic back then, we wouldn't have missed it.",
          "ko": "바로 그거예요. 그때 더 현실적으로 잡았다면 마감을 놓치지 않았을 거예요."
        }
      },
      {
        "who": "them",
        "text": "Fair point. Let me talk to the client and come back to you.",
        "gloss": {
          "en": "Fair point. Let me talk to the client and come back to you.",
          "ko": "일리 있네요. 고객과 얘기해 보고 다시 알려 줄게요."
        }
      },
      {
        "who": "me",
        "text": "Thanks. We need to make a decision by Friday, so the team can plan.",
        "gloss": {
          "en": "Thanks. We need to make a decision by Friday, so the team can plan.",
          "ko": "고마워요. 팀이 계획을 세울 수 있게 금요일까지는 결정해야 해요."
        }
      }
    ]
  },
  {
    "id": "en-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Answering questions in a job interview for a marketing role",
      "ko": "마케팅 직무 면접에서 질문에 답하기"
    },
    "expressions": [
      "should have known",
      "come up with",
      "to some extent",
      "whether or not"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      7
    ],
    "earlierGrammar": [
      "3:0",
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thanks for coming in. Tell me a bit about yourself.",
        "gloss": {
          "en": "Thanks for coming in. Tell me a bit about yourself.",
          "ko": "와 주셔서 감사합니다. 자기소개를 좀 해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Sure. I've worked in marketing for six years. Before that, I used to be a teacher.",
        "gloss": {
          "en": "Sure. I've worked in marketing for six years. Before that, I used to be a teacher.",
          "ko": "네. 마케팅 분야에서 육 년 일했습니다. 그 전에는 교사였어요."
        }
      },
      {
        "who": "them",
        "text": "Interesting. Why did you decide to move into marketing?",
        "gloss": {
          "en": "Interesting. Why did you decide to move into marketing?",
          "ko": "흥미롭네요. 왜 마케팅으로 옮기기로 하셨어요?"
        },
        "alt": [
          {
            "text": "What made you switch from teaching to marketing?",
            "gloss": {
              "en": "What made you switch from teaching to marketing?",
              "ko": "어떤 계기로 교직에서 마케팅으로 바꾸셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "I'd always loved writing, and by the time I left teaching, I'd already done some freelance work.",
        "gloss": {
          "en": "I'd always loved writing, and by the time I left teaching, I'd already done some freelance work.",
          "ko": "늘 글쓰기를 좋아했고, 교직을 그만둘 즈음엔 이미 프리랜서 일도 좀 했었어요."
        }
      },
      {
        "who": "them",
        "text": "Tell me about a time you made a mistake at work.",
        "gloss": {
          "en": "Tell me about a time you made a mistake at work.",
          "ko": "일하면서 실수했던 경험을 말씀해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Once I missed a client's email, and we lost the account. I should have known to double-check.",
        "gloss": {
          "en": "Once I missed a client's email, and we lost the account. I should have known to double-check.",
          "ko": "한번은 고객 이메일을 놓쳐서 거래처를 잃었어요. 다시 확인했어야 했는데 말이죠."
        }
      },
      {
        "who": "them",
        "text": "What did you learn from that?",
        "gloss": {
          "en": "What did you learn from that?",
          "ko": "그 일에서 뭘 배우셨어요?"
        }
      },
      {
        "who": "me",
        "text": "I had to come up with a system to track every request. We haven't missed one since.",
        "gloss": {
          "en": "I had to come up with a system to track every request. We haven't missed one since.",
          "ko": "모든 요청을 추적하는 방법을 생각해 내야 했어요. 그 뒤로는 하나도 놓치지 않았어요."
        }
      },
      {
        "who": "them",
        "text": "Great. How do you deal with pressure?",
        "gloss": {
          "en": "Great. How do you deal with pressure?",
          "ko": "좋네요. 압박감은 어떻게 다루세요?"
        },
        "alt": [
          {
            "text": "And how do you handle stress or tight timelines?",
            "gloss": {
              "en": "And how do you handle stress or tight timelines?",
              "ko": "그럼 스트레스나 빠듯한 일정은 어떻게 대처하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "To some extent, I actually enjoy it. It helps me focus and set priorities.",
        "gloss": {
          "en": "To some extent, I actually enjoy it. It helps me focus and set priorities.",
          "ko": "어느 정도는 오히려 즐겨요. 집중하고 우선순위를 정하는 데 도움이 되거든요."
        }
      },
      {
        "who": "them",
        "text": "If you got this job, what would you change first?",
        "gloss": {
          "en": "If you got this job, what would you change first?",
          "ko": "이 일을 맡게 되면 무엇부터 바꾸시겠어요?"
        },
        "alt": [
          {
            "text": "Imagine you're starting here next week. What's the first thing you'd do?",
            "gloss": {
              "en": "Imagine you're starting here next week. What's the first thing you'd do?",
              "ko": "다음 주부터 여기서 일한다고 생각해 보세요. 가장 먼저 뭘 하시겠어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "If I joined the team, I'd start by talking to every client. I'd want to hear their side.",
        "gloss": {
          "en": "If I joined the team, I'd start by talking to every client. I'd want to hear their side.",
          "ko": "팀에 들어가면 모든 고객과 대화하는 것부터 시작하겠어요. 고객 입장을 듣고 싶어요."
        }
      },
      {
        "who": "them",
        "text": "Last question. Where do you see yourself in five years?",
        "gloss": {
          "en": "Last question. Where do you see yourself in five years?",
          "ko": "마지막 질문이에요. 오 년 뒤 자신의 모습은 어떨 것 같나요?"
        }
      },
      {
        "who": "me",
        "text": "Whether or not I'm a manager by then, I want to be making a real difference here.",
        "gloss": {
          "en": "Whether or not I'm a manager by then, I want to be making a real difference here.",
          "ko": "그때 관리자이든 아니든, 여기서 실질적인 변화를 만들고 있고 싶어요."
        }
      }
    ]
  },
  {
    "id": "en-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Wondering with a friend why your friend Lena suddenly stopped replying",
      "ko": "친구와 함께 레나가 갑자기 연락이 끊긴 이유 추측하기"
    },
    "expressions": [
      "it must have been",
      "it's up to you"
    ],
    "grammar": [
      0,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Have you heard from Lena lately? She hasn't answered my messages in two weeks.",
        "gloss": {
          "en": "Have you heard from Lena lately? She hasn't answered my messages in two weeks.",
          "ko": "요즘 레나한테 연락 왔어? 이 주째 내 메시지에 답이 없어."
        }
      },
      {
        "who": "me",
        "text": "No, nothing. She can't have seen my message either, or she would have replied.",
        "gloss": {
          "en": "No, nothing. She can't have seen my message either, or she would have replied.",
          "ko": "아니, 전혀. 내 메시지도 못 봤을 거야. 봤으면 답했겠지."
        }
      },
      {
        "who": "them",
        "text": "Do you think she's mad at us?",
        "gloss": {
          "en": "Do you think she's mad at us?",
          "ko": "우리한테 화난 걸까?"
        },
        "alt": [
          {
            "text": "You don't think we upset her, do you?",
            "gloss": {
              "en": "You don't think we upset her, do you?",
              "ko": "설마 우리가 기분 상하게 한 건 아니겠지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "I doubt it. She might have just gotten really busy with her new job.",
        "gloss": {
          "en": "I doubt it. She might have just gotten really busy with her new job.",
          "ko": "아닐 거야. 새 직장 일로 정말 바빠졌을 수도 있어."
        }
      },
      {
        "who": "them",
        "text": "Maybe. But she missed my birthday party, and she'd never done that before.",
        "gloss": {
          "en": "Maybe. But she missed my birthday party, and she'd never done that before.",
          "ko": "그럴지도. 근데 내 생일 파티에 안 왔잖아. 전엔 그런 적이 없었는데."
        }
      },
      {
        "who": "me",
        "text": "Wow. It must have been something serious, then.",
        "gloss": {
          "en": "Wow. It must have been something serious, then.",
          "ko": "와. 그럼 뭔가 심각한 일이었던 게 틀림없어."
        }
      },
      {
        "who": "them",
        "text": "Should we go to her place?",
        "gloss": {
          "en": "Should we go to her place?",
          "ko": "레나 집에 가 볼까?"
        },
        "alt": [
          {
            "text": "Do you think we should just show up at her apartment?",
            "gloss": {
              "en": "Do you think we should just show up at her apartment?",
              "ko": "그냥 레나 아파트로 찾아가야 할까?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "I'm not sure. If I were her, I'd want some space.",
        "gloss": {
          "en": "I'm not sure. If I were her, I'd want some space.",
          "ko": "잘 모르겠어. 내가 레나라면 혼자 있고 싶을 것 같아."
        }
      },
      {
        "who": "them",
        "text": "But what if she needs help and doesn't want to ask?",
        "gloss": {
          "en": "But what if she needs help and doesn't want to ask?",
          "ko": "근데 도움이 필요한데 말을 못 하는 거라면?"
        }
      },
      {
        "who": "me",
        "text": "That's true. I wish I'd checked on her when she first went quiet.",
        "gloss": {
          "en": "That's true. I wish I'd checked on her when she first went quiet.",
          "ko": "맞아. 처음 연락이 뜸해졌을 때 안부를 물어볼걸."
        }
      },
      {
        "who": "them",
        "text": "Let's call her tonight. Or should I go over alone?",
        "gloss": {
          "en": "Let's call her tonight. Or should I go over alone?",
          "ko": "오늘 밤에 전화해 보자. 아니면 나 혼자 가 볼까?"
        },
        "alt": [
          {
            "text": "Why don't we both call her tonight? Or is that too much?",
            "gloss": {
              "en": "Why don't we both call her tonight? Or is that too much?",
              "ko": "오늘 밤에 둘이 같이 전화해 보는 건 어때? 너무 부담스러우려나?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "It's up to you. Anyway, the point is she knows we care.",
        "gloss": {
          "en": "It's up to you. Anyway, the point is she knows we care.",
          "ko": "네가 정해. 아무튼 중요한 건 우리가 신경 쓴다는 걸 레나가 아는 거야."
        }
      },
      {
        "who": "them",
        "text": "True. I'll call her after work.",
        "gloss": {
          "en": "True. I'll call her after work.",
          "ko": "맞아. 퇴근하고 전화해 볼게."
        }
      },
      {
        "who": "me",
        "text": "Good. Let me know what she says, okay?",
        "gloss": {
          "en": "Good. Let me know what she says, okay?",
          "ko": "좋아. 레나가 뭐라고 하는지 알려 줘, 알았지?"
        }
      }
    ]
  },
  {
    "id": "en-4-5",
    "stage": 4,
    "situation": 4,
    "setting": {
      "en": "Telling a friend how your hometown has changed since you left",
      "ko": "떠난 뒤 고향이 어떻게 변했는지 친구에게 이야기하기"
    },
    "expressions": [
      "on the other hand",
      "in the long run",
      "out of the question"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "2:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "So you just got back from your hometown? How was it?",
        "gloss": {
          "en": "So you just got back from your hometown? How was it?",
          "ko": "고향에 막 다녀왔다며? 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Weird, honestly. Everything had changed since my last visit.",
        "gloss": {
          "en": "Weird, honestly. Everything had changed since my last visit.",
          "ko": "솔직히 이상했어. 지난번에 갔을 때 이후로 모든 게 바뀌어 있었어."
        }
      },
      {
        "who": "them",
        "text": "Really? In what way?",
        "gloss": {
          "en": "Really? In what way?",
          "ko": "정말? 어떻게?"
        },
        "alt": [
          {
            "text": "Oh yeah? What's different?",
            "gloss": {
              "en": "Oh yeah? What's different?",
              "ko": "그래? 뭐가 달라졌는데?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "There used to be a little cinema downtown. Now it's a huge parking lot.",
        "gloss": {
          "en": "There used to be a little cinema downtown. Now it's a huge parking lot.",
          "ko": "시내에 작은 영화관이 있었는데 지금은 거대한 주차장이야."
        }
      },
      {
        "who": "them",
        "text": "That's sad. I bet the locals weren't happy about that.",
        "gloss": {
          "en": "That's sad. I bet the locals weren't happy about that.",
          "ko": "슬프다. 동네 사람들이 싫어했겠네."
        }
      },
      {
        "who": "me",
        "text": "Some weren't. On the other hand, the new shopping mall has brought a lot of jobs.",
        "gloss": {
          "en": "Some weren't. On the other hand, the new shopping mall has brought a lot of jobs.",
          "ko": "싫어한 사람도 있었지. 반면에 새 쇼핑몰이 일자리를 많이 가져왔어."
        }
      },
      {
        "who": "them",
        "text": "So do you think the changes are good overall?",
        "gloss": {
          "en": "So do you think the changes are good overall?",
          "ko": "그럼 전체적으로 변화가 좋다고 생각해?"
        },
        "alt": [
          {
            "text": "So, better or worse, all things considered?",
            "gloss": {
              "en": "So, better or worse, all things considered?",
              "ko": "그래서 다 따져 보면 나아진 거야, 나빠진 거야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "In the long run, maybe. But I'm still not used to all the traffic.",
        "gloss": {
          "en": "In the long run, maybe. But I'm still not used to all the traffic.",
          "ko": "길게 보면 아마도. 근데 그 많은 차들엔 아직 적응이 안 돼."
        }
      },
      {
        "who": "them",
        "text": "Would you ever move back there?",
        "gloss": {
          "en": "Would you ever move back there?",
          "ko": "다시 거기로 이사 갈 생각 있어?"
        }
      },
      {
        "who": "me",
        "text": "Moving back is out of the question for now. If I lived there, I'd need a car.",
        "gloss": {
          "en": "Moving back is out of the question for now. If I lived there, I'd need a car.",
          "ko": "다시 이사 가는 건 지금은 말도 안 돼. 거기 살면 차가 있어야 할 거야."
        }
      },
      {
        "who": "them",
        "text": "Ha, yeah. And your parents? Are they still there?",
        "gloss": {
          "en": "Ha, yeah. And your parents? Are they still there?",
          "ko": "하하, 그렇지. 부모님은? 아직 거기 계셔?"
        },
        "alt": [
          {
            "text": "What about your family? Do they still live there?",
            "gloss": {
              "en": "What about your family? Do they still live there?",
              "ko": "가족은? 아직 거기 사셔?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Yeah, but they're getting used to the changes faster than I am.",
        "gloss": {
          "en": "Yeah, but they're getting used to the changes faster than I am.",
          "ko": "응, 근데 부모님이 나보다 변화에 더 빨리 적응하고 계셔."
        }
      },
      {
        "who": "them",
        "text": "Funny how that works. Do you ever miss it?",
        "gloss": {
          "en": "Funny how that works. Do you ever miss it?",
          "ko": "재밌다, 그렇게 되네. 고향이 그리울 때 있어?"
        }
      },
      {
        "who": "me",
        "text": "All the time. I wish I'd taken more photos of the old town before it disappeared.",
        "gloss": {
          "en": "All the time. I wish I'd taken more photos of the old town before it disappeared.",
          "ko": "늘 그래. 옛 동네가 사라지기 전에 사진을 더 찍어 둘걸."
        }
      }
    ]
  },
  {
    "id": "en-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Your colleague Priya asks what you thought of her proposal draft",
      "ko": "동료 프리야가 자기 제안서 초안을 어떻게 봤는지 묻는다"
    },
    "goal": {
      "en": "Point out that the main recommendation is buried and a few numbers may be off, without discouraging Priya, and agree on what she'll change.",
      "ko": "프리야의 기를 꺾지 않으면서 핵심 제안이 묻혀 있고 숫자 몇 개가 틀렸을 수 있다는 점을 짚고, 무엇을 고칠지 함께 정한다."
    },
    "expressions": [
      "by and large",
      "it seems to me",
      "that said",
      "bear in mind",
      "more or less",
      "for the record"
    ],
    "grammar": [
      1,
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "3:0",
      "4:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hey, did you get a chance to read my draft of the proposal?",
        "gloss": {
          "en": "Hey, did you get a chance to read my draft of the proposal?",
          "ko": "저기, 내 제안서 초안 읽어 볼 시간 있었어?"
        }
      },
      {
        "who": "me",
        "text": "I did, yeah. By and large, I think it's really strong. The research section is excellent.",
        "gloss": {
          "en": "I did, yeah. By and large, I think it's really strong. The research section is excellent.",
          "ko": "응, 읽었어. 전반적으로 정말 탄탄한 것 같아. 조사 부분은 훌륭해."
        }
      },
      {
        "who": "them",
        "text": "Thanks! But I'm sensing a 'but' coming.",
        "gloss": {
          "en": "Thanks! But I'm sensing a 'but' coming.",
          "ko": "고마워! 근데 '하지만'이 나올 것 같은 느낌인데."
        }
      },
      {
        "who": "me",
        "text": "Ha, you know me too well. It seems to me that the main recommendation gets a bit lost.",
        "gloss": {
          "en": "Ha, you know me too well. It seems to me that the main recommendation gets a bit lost.",
          "ko": "하하, 나를 너무 잘 아네. 내가 보기엔 핵심 제안이 좀 묻히는 것 같아."
        }
      },
      {
        "who": "them",
        "text": "Lost how? It's all in there.",
        "gloss": {
          "en": "Lost how? It's all in there.",
          "ko": "묻힌다니? 다 들어 있는데."
        }
      },
      {
        "who": "me",
        "text": "It is, but it doesn't show up until page eight. What a busy reader needs is the answer up front.",
        "gloss": {
          "en": "It is, but it doesn't show up until page eight. What a busy reader needs is the answer up front.",
          "ko": "들어 있긴 한데 팔 쪽에 가서야 나와. 바쁜 독자에게 필요한 건 맨 앞의 결론이야."
        }
      },
      {
        "who": "them",
        "text": "Hmm. I wanted to build up to it, though. Walk them through the logic first.",
        "gloss": {
          "en": "Hmm. I wanted to build up to it, though. Walk them through the logic first.",
          "ko": "음. 근데 난 차근차근 쌓아 가고 싶었어. 먼저 논리를 보여 주고."
        }
      },
      {
        "who": "me",
        "text": "I get that. That said, bear in mind that the board will probably only skim the first two pages.",
        "gloss": {
          "en": "I get that. That said, bear in mind that the board will probably only skim the first two pages.",
          "ko": "그 마음 알아. 그렇긴 해도 이사회는 아마 앞 두 쪽만 훑어볼 거라는 걸 염두에 둬."
        }
      },
      {
        "who": "them",
        "text": "Okay, fair. So you'd move the recommendation to the top?",
        "gloss": {
          "en": "Okay, fair. So you'd move the recommendation to the top?",
          "ko": "그래, 맞는 말이야. 그럼 제안을 맨 위로 옮기자는 거지?"
        }
      },
      {
        "who": "me",
        "text": "I'd suggest a short summary on page one. Having read it twice, I think the logic would still hold.",
        "gloss": {
          "en": "I'd suggest a short summary on page one. Having read it twice, I think the logic would still hold.",
          "ko": "첫 쪽에 짧은 요약을 넣길 제안해. 두 번 읽어 보니 그래도 논리는 충분히 살 것 같아."
        }
      },
      {
        "who": "them",
        "text": "What about the budget section? Was that clear?",
        "gloss": {
          "en": "What about the budget section? Was that clear?",
          "ko": "예산 부분은? 그건 명확했어?"
        }
      },
      {
        "who": "me",
        "text": "More or less. A couple of the numbers might be slightly off, but nothing major.",
        "gloss": {
          "en": "More or less. A couple of the numbers might be slightly off, but nothing major.",
          "ko": "대체로. 숫자 몇 개가 살짝 틀렸을 수도 있는데 큰 문제는 아니야."
        }
      },
      {
        "who": "them",
        "text": "Ugh, really? Which ones?",
        "gloss": {
          "en": "Ugh, really? Which ones?",
          "ko": "아, 진짜? 어떤 거?"
        }
      },
      {
        "who": "me",
        "text": "I've left comments on them. Admittedly, I could be wrong. Even so, it's worth double-checking.",
        "gloss": {
          "en": "I've left comments on them. Admittedly, I could be wrong. Even so, it's worth double-checking.",
          "ko": "거기에 댓글 달아 놨어. 물론 내가 틀릴 수도 있어. 그래도 다시 확인해 볼 만해."
        }
      },
      {
        "who": "them",
        "text": "Okay. I'll rework the opening and check the numbers by Thursday.",
        "gloss": {
          "en": "Okay. I'll rework the opening and check the numbers by Thursday.",
          "ko": "알았어. 목요일까지 도입부 고치고 숫자 확인할게."
        }
      },
      {
        "who": "me",
        "text": "Sounds great. For the record, it's one of the best drafts I've seen from our team.",
        "gloss": {
          "en": "Sounds great. For the record, it's one of the best drafts I've seen from our team.",
          "ko": "좋아. 분명히 말해 두는데, 우리 팀에서 본 초안 중 손꼽히게 좋아."
        }
      }
    ]
  },
  {
    "id": "en-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "A dinner-table debate with a friend's father about remote work",
      "ko": "저녁 식사 자리에서 친구 아버지와 재택근무 논쟁"
    },
    "goal": {
      "en": "Defend keeping remote work as an option, admit its real downsides, and keep the debate friendly with an older guest.",
      "ko": "재택근무를 선택지로 남겨야 한다고 주장하되 실제 단점은 인정하고, 어른과의 논쟁을 화기애애하게 이어 간다."
    },
    "expressions": [
      "arguably",
      "with all due respect",
      "on the fence",
      "the bottom line",
      "needless to say",
      "not to mention"
    ],
    "grammar": [
      1,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "4:0",
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Honestly, I think remote work is killing company culture. Everyone should be back in the office.",
        "gloss": {
          "en": "Honestly, I think remote work is killing company culture. Everyone should be back in the office.",
          "ko": "솔직히 재택근무가 회사 문화를 망치고 있다고 봐. 다들 사무실로 돌아와야 해."
        }
      },
      {
        "who": "me",
        "text": "Hmm, I'm not sure I agree. Arguably, culture is about how people treat each other, not where they sit.",
        "gloss": {
          "en": "Hmm, I'm not sure I agree. Arguably, culture is about how people treat each other, not where they sit.",
          "ko": "음, 저는 동의하기 어려워요. 문화는 어디 앉느냐보다 서로를 어떻게 대하느냐의 문제라고 볼 수 있죠."
        }
      },
      {
        "who": "them",
        "text": "But you can't build real relationships over video calls.",
        "gloss": {
          "en": "But you can't build real relationships over video calls.",
          "ko": "그래도 화상 통화로는 진짜 관계를 쌓을 수 없어."
        }
      },
      {
        "who": "me",
        "text": "Admittedly, it's harder. Even so, my team has never been closer, and half of us have never met in person.",
        "gloss": {
          "en": "Admittedly, it's harder. Even so, my team has never been closer, and half of us have never met in person.",
          "ko": "물론 더 어렵긴 해요. 그래도 저희 팀은 지금이 가장 끈끈하고, 반은 서로 직접 만난 적도 없어요."
        }
      },
      {
        "who": "them",
        "text": "Okay, but your team is the exception.",
        "gloss": {
          "en": "Okay, but your team is the exception.",
          "ko": "그래, 근데 너희 팀은 예외야."
        }
      },
      {
        "who": "me",
        "text": "Maybe. What I've noticed, though, is that people seem far less stressed without the commute.",
        "gloss": {
          "en": "Maybe. What I've noticed, though, is that people seem far less stressed without the commute.",
          "ko": "그럴지도요. 그런데 제가 느낀 건 출퇴근이 없으니 사람들이 훨씬 덜 지쳐 보인다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "Sure, they're less stressed because they're doing laundry during meetings!",
        "gloss": {
          "en": "Sure, they're less stressed because they're doing laundry during meetings!",
          "ko": "그렇지, 회의 중에 빨래하니까 덜 지치겠지!"
        }
      },
      {
        "who": "me",
        "text": "Ha! Some, maybe. With all due respect, that's a management issue, not a remote-work issue.",
        "gloss": {
          "en": "Ha! Some, maybe. With all due respect, that's a management issue, not a remote-work issue.",
          "ko": "하하! 일부는 그럴 수도요. 외람된 말씀이지만, 그건 관리의 문제지 재택근무의 문제가 아니에요."
        }
      },
      {
        "who": "them",
        "text": "Fair. But what about young people just starting out? How do they learn?",
        "gloss": {
          "en": "Fair. But what about young people just starting out? How do they learn?",
          "ko": "일리 있어. 근데 이제 막 일을 시작한 젊은 사람들은? 그 사람들은 어떻게 배워?"
        }
      },
      {
        "who": "me",
        "text": "That's a good point, and honestly, I'm on the fence about that part.",
        "gloss": {
          "en": "That's a good point, and honestly, I'm on the fence about that part.",
          "ko": "좋은 지적이에요. 솔직히 그 부분은 저도 확신이 없어요."
        }
      },
      {
        "who": "them",
        "text": "See? Even you admit it.",
        "gloss": {
          "en": "See? Even you admit it.",
          "ko": "거 봐. 너도 인정하잖아."
        }
      },
      {
        "who": "me",
        "text": "Had I started my career remotely, I'd probably have struggled too.",
        "gloss": {
          "en": "Had I started my career remotely, I'd probably have struggled too.",
          "ko": "제가 커리어를 재택으로 시작했다면 아마 저도 힘들었을 거예요."
        }
      },
      {
        "who": "them",
        "text": "So you agree with me!",
        "gloss": {
          "en": "So you agree with me!",
          "ko": "그러니까 내 말에 동의하는 거네!"
        }
      },
      {
        "who": "me",
        "text": "Not quite. The bottom line is that people should have the choice.",
        "gloss": {
          "en": "Not quite. The bottom line is that people should have the choice.",
          "ko": "꼭 그렇진 않아요. 결론은 사람들에게 선택권이 있어야 한다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "Even if productivity drops?",
        "gloss": {
          "en": "Even if productivity drops?",
          "ko": "생산성이 떨어져도?"
        }
      },
      {
        "who": "me",
        "text": "Needless to say, that would change things. But so far it hasn't, not to mention the savings on office space.",
        "gloss": {
          "en": "Needless to say, that would change things. But so far it hasn't, not to mention the savings on office space.",
          "ko": "말할 것도 없이 그러면 얘기가 달라지죠. 그런데 지금까진 안 떨어졌고, 사무실 비용 절감은 말할 것도 없고요."
        }
      }
    ]
  },
  {
    "id": "en-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Meeting your landlord to discuss a rent increase",
      "ko": "월세 인상 문제로 집주인과 만나 이야기하기"
    },
    "goal": {
      "en": "Negotiate a smaller rent increase using your record as a tenant and the unfixed heating, while keeping a good relationship with the landlord.",
      "ko": "성실한 세입자였다는 점과 고쳐지지 않은 난방을 근거로 인상 폭을 줄이되, 집주인과 좋은 관계를 유지한다."
    },
    "expressions": [
      "to put it mildly",
      "be that as it may",
      "the elephant in the room",
      "for the time being",
      "in hindsight"
    ],
    "grammar": [
      2,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "3:0",
      "3:6",
      "4:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thanks for meeting me. As I mentioned in my email, the rent's going up by two hundred dollars next month.",
        "gloss": {
          "en": "Thanks for meeting me. As I mentioned in my email, the rent's going up by two hundred dollars next month.",
          "ko": "만나 줘서 고마워요. 이메일로 말한 것처럼 다음 달부터 월세가 이백 달러 올라요."
        }
      },
      {
        "who": "me",
        "text": "Thanks for explaining in person. To put it mildly, it came as a bit of a surprise.",
        "gloss": {
          "en": "Thanks for explaining in person. To put it mildly, it came as a bit of a surprise.",
          "ko": "직접 설명해 주셔서 감사해요. 순하게 말해도, 좀 놀랐어요."
        }
      },
      {
        "who": "them",
        "text": "I understand, but costs have gone up across the board. Taxes, insurance, everything.",
        "gloss": {
          "en": "I understand, but costs have gone up across the board. Taxes, insurance, everything.",
          "ko": "이해해요. 그런데 전반적으로 비용이 올랐어요. 세금, 보험, 전부요."
        }
      },
      {
        "who": "me",
        "text": "I appreciate that. Having lived here for four years, though, I've always paid on time.",
        "gloss": {
          "en": "I appreciate that. Having lived here for four years, though, I've always paid on time.",
          "ko": "그건 이해해요. 그래도 여기 사 년 사는 동안 월세는 늘 제때 냈어요."
        }
      },
      {
        "who": "them",
        "text": "And I'm grateful for that, believe me.",
        "gloss": {
          "en": "And I'm grateful for that, believe me.",
          "ko": "그건 정말 고맙게 생각해요, 진심으로요."
        }
      },
      {
        "who": "me",
        "text": "Be that as it may, two hundred is quite a jump. Would you consider something closer to one hundred?",
        "gloss": {
          "en": "Be that as it may, two hundred is quite a jump. Would you consider something closer to one hundred?",
          "ko": "그렇다 해도 이백은 꽤 큰 폭이에요. 백 달러 정도로 생각해 주실 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "One hundred is a bit low. Prices in this area have really gone up.",
        "gloss": {
          "en": "One hundred is a bit low. Prices in this area have really gone up.",
          "ko": "백은 좀 낮아요. 이 동네 시세가 정말 많이 올랐거든요."
        }
      },
      {
        "who": "me",
        "text": "There's also the elephant in the room: the heating still hasn't been fixed since January.",
        "gloss": {
          "en": "There's also the elephant in the room: the heating still hasn't been fixed since January.",
          "ko": "그리고 다들 알면서 말 안 하는 문제도 있죠. 난방이 일월부터 아직 안 고쳐졌어요."
        }
      },
      {
        "who": "them",
        "text": "Right, the boiler. I've been meaning to sort that out.",
        "gloss": {
          "en": "Right, the boiler. I've been meaning to sort that out.",
          "ko": "아, 보일러요. 해결하려고 계속 마음먹고 있었어요."
        }
      },
      {
        "who": "me",
        "text": "It's been three months. The delay in fixing it has made the winter pretty hard, to be honest.",
        "gloss": {
          "en": "It's been three months. The delay in fixing it has made the winter pretty hard, to be honest.",
          "ko": "벌써 석 달째예요. 솔직히 수리가 늦어지는 바람에 겨울이 꽤 힘들었어요."
        }
      },
      {
        "who": "them",
        "text": "Okay, that's fair. What if I fix the boiler this month and we say one fifty?",
        "gloss": {
          "en": "Okay, that's fair. What if I fix the boiler this month and we say one fifty?",
          "ko": "그래요, 맞는 말이에요. 이번 달에 보일러 고치고 백오십으로 하면 어때요?"
        }
      },
      {
        "who": "me",
        "text": "That's more reasonable. Admittedly, it's still more than I'd hoped. Even so, I'd rather stay.",
        "gloss": {
          "en": "That's more reasonable. Admittedly, it's still more than I'd hoped. Even so, I'd rather stay.",
          "ko": "그게 더 합리적이네요. 물론 바랐던 것보다는 많지만, 그래도 계속 살고 싶어요."
        }
      },
      {
        "who": "them",
        "text": "I'd like you to stay too. You're a great tenant.",
        "gloss": {
          "en": "I'd like you to stay too. You're a great tenant.",
          "ko": "나도 계속 살았으면 해요. 좋은 세입자니까요."
        }
      },
      {
        "who": "me",
        "text": "Could we keep it at one fifty for the time being, and perhaps review it next year?",
        "gloss": {
          "en": "Could we keep it at one fifty for the time being, and perhaps review it next year?",
          "ko": "당분간은 백오십으로 하고, 내년에 다시 검토해 보면 어떨까요?"
        }
      },
      {
        "who": "them",
        "text": "I think I can live with that. I'll send you the new lease this week.",
        "gloss": {
          "en": "I think I can live with that. I'll send you the new lease this week.",
          "ko": "그 정도면 괜찮을 것 같아요. 이번 주에 새 계약서 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Perfect. In hindsight, I should have brought up the heating sooner. Thanks for being flexible.",
        "gloss": {
          "en": "Perfect. In hindsight, I should have brought up the heating sooner. Thanks for being flexible.",
          "ko": "좋아요. 돌이켜 보니 난방 얘기를 더 일찍 꺼냈어야 했네요. 유연하게 맞춰 주셔서 감사해요."
        }
      }
    ]
  },
  {
    "id": "en-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "At a friends' get-together, telling the story of your airport luggage mix-up",
      "ko": "친구 모임에서 공항 가방이 바뀐 사연 들려주기"
    },
    "goal": {
      "en": "Tell a funny story with good timing, build up to the punchline, and react naturally when your friends interrupt.",
      "ko": "웃긴 이야기를 타이밍 좋게 들려주고, 반전까지 차근차근 끌고 가며, 친구들이 끼어들 때 자연스럽게 받는다."
    },
    "expressions": [
      "beside the point",
      "a blessing in disguise"
    ],
    "grammar": [
      0,
      1,
      2
    ],
    "earlierGrammar": [
      "3:5",
      "4:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Okay, you have to tell them the airport story. It's hilarious.",
        "gloss": {
          "en": "Okay, you have to tell them the airport story. It's hilarious.",
          "ko": "자, 그 공항 얘기 해 줘. 진짜 웃기거든."
        }
      },
      {
        "who": "me",
        "text": "Oh no, really? Okay, okay. So this was last summer, on my way to my cousin's wedding.",
        "gloss": {
          "en": "Oh no, really? Okay, okay. So this was last summer, on my way to my cousin's wedding.",
          "ko": "아, 진짜? 알았어, 알았어. 그러니까 작년 여름, 사촌 결혼식에 가는 길이었어."
        }
      },
      {
        "who": "them",
        "text": "In Mexico, right?",
        "gloss": {
          "en": "In Mexico, right?",
          "ko": "멕시코였지?"
        }
      },
      {
        "who": "me",
        "text": "Right. Running late as usual, I grabbed the first black suitcase off the belt.",
        "gloss": {
          "en": "Right. Running late as usual, I grabbed the first black suitcase off the belt.",
          "ko": "맞아. 늘 그렇듯 늦어서, 컨베이어에서 처음 나온 검은 가방을 집어 들었지."
        }
      },
      {
        "who": "them",
        "text": "Wait, how do you take the wrong suitcase?",
        "gloss": {
          "en": "Wait, how do you take the wrong suitcase?",
          "ko": "잠깐, 가방을 어떻게 잘못 가져가?"
        }
      },
      {
        "who": "me",
        "text": "They looked identical! Whether I should've checked the tag is beside the point.",
        "gloss": {
          "en": "They looked identical! Whether I should've checked the tag is beside the point.",
          "ko": "완전 똑같이 생겼다니까! 태그를 확인했어야 했냐는 건 지금 중요한 게 아니고."
        }
      },
      {
        "who": "them",
        "text": "Ha! So when did you notice?",
        "gloss": {
          "en": "Ha! So when did you notice?",
          "ko": "하하! 그래서 언제 알았어?"
        }
      },
      {
        "who": "me",
        "text": "Only at the hotel. I opened it, and what I saw was a bright pink clown costume.",
        "gloss": {
          "en": "Only at the hotel. I opened it, and what I saw was a bright pink clown costume.",
          "ko": "호텔에서야. 열었는데 내 눈에 들어온 건 형광 분홍색 광대 옷이었어."
        }
      },
      {
        "who": "them",
        "text": "No way! A clown costume?",
        "gloss": {
          "en": "No way! A clown costume?",
          "ko": "말도 안 돼! 광대 옷?"
        }
      },
      {
        "who": "me",
        "text": "Complete with giant shoes. Not knowing what else to do, I called the number on the tag.",
        "gloss": {
          "en": "Complete with giant shoes. Not knowing what else to do, I called the number on the tag.",
          "ko": "커다란 신발까지 다 있었어. 달리 어쩔 줄 몰라서 태그에 적힌 번호로 전화했지."
        }
      },
      {
        "who": "them",
        "text": "And who answered?",
        "gloss": {
          "en": "And who answered?",
          "ko": "그래서 누가 받았는데?"
        }
      },
      {
        "who": "me",
        "text": "A very panicked clown, who was supposed to perform at a kid's party that afternoon.",
        "gloss": {
          "en": "A very panicked clown, who was supposed to perform at a kid's party that afternoon.",
          "ko": "엄청 당황한 광대였어. 그날 오후에 아이 생일 파티에서 공연하기로 돼 있었대."
        }
      },
      {
        "who": "them",
        "text": "Oh my gosh. And your suitcase?",
        "gloss": {
          "en": "Oh my gosh. And your suitcase?",
          "ko": "세상에. 그럼 네 가방은?"
        }
      },
      {
        "who": "me",
        "text": "He had it, of course. So we each drove halfway and swapped bags at a gas station.",
        "gloss": {
          "en": "He had it, of course. So we each drove halfway and swapped bags at a gas station.",
          "ko": "당연히 그 사람한테 있었지. 그래서 둘 다 반씩 운전해 가서 주유소에서 가방을 바꿨어."
        }
      },
      {
        "who": "them",
        "text": "And then you missed the wedding?",
        "gloss": {
          "en": "And then you missed the wedding?",
          "ko": "그래서 결혼식은 놓쳤어?"
        }
      },
      {
        "who": "me",
        "text": "Almost! But it was a blessing in disguise. If I hadn't grabbed his suitcase, we wouldn't be friends today.",
        "gloss": {
          "en": "Almost! But it was a blessing in disguise. If I hadn't grabbed his suitcase, we wouldn't be friends today.",
          "ko": "거의! 근데 전화위복이었어. 그 사람 가방을 안 집었으면 지금 우리가 친구가 아니었을 테니까."
        }
      }
    ]
  },
  {
    "id": "en-5-5",
    "stage": 5,
    "situation": 4,
    "setting": {
      "en": "Discussing a podcast interview with a tech CEO with a friend",
      "ko": "친구와 IT 기업 대표 인터뷰 팟캐스트 이야기하기"
    },
    "goal": {
      "en": "Share a nuanced opinion on the episode, point out what the guest left unsaid, and still recommend it with fair caveats.",
      "ko": "에피소드에 대해 미묘한 의견을 나누고, 출연자가 말하지 않은 부분을 짚으면서도 공정한 단서를 달아 추천한다."
    },
    "expressions": [
      "read between the lines",
      "a grey area",
      "it seems to me",
      "by and large",
      "in hindsight",
      "bear in mind"
    ],
    "grammar": [
      1,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "4:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Did you listen to the new episode with that tech CEO?",
        "gloss": {
          "en": "Did you listen to the new episode with that tech CEO?",
          "ko": "그 IT 대표 나온 새 에피소드 들었어?"
        }
      },
      {
        "who": "me",
        "text": "I did, on my run this morning. Interesting, but I came away with mixed feelings.",
        "gloss": {
          "en": "I did, on my run this morning. Interesting, but I came away with mixed feelings.",
          "ko": "응, 오늘 아침에 달리면서. 흥미로웠는데 듣고 나니 기분이 복잡했어."
        }
      },
      {
        "who": "them",
        "text": "Really? I thought he was surprisingly honest about the layoffs.",
        "gloss": {
          "en": "Really? I thought he was surprisingly honest about the layoffs.",
          "ko": "정말? 난 정리해고 얘기를 의외로 솔직하게 하던데."
        }
      },
      {
        "who": "me",
        "text": "Sort of. If you read between the lines, he never actually took responsibility.",
        "gloss": {
          "en": "Sort of. If you read between the lines, he never actually took responsibility.",
          "ko": "그런 편이지. 근데 행간을 읽어 보면 실제로 책임을 진 적은 한 번도 없어."
        }
      },
      {
        "who": "them",
        "text": "Hmm, he did say mistakes were made.",
        "gloss": {
          "en": "Hmm, he did say mistakes were made.",
          "ko": "음, 실수가 있었다고는 했잖아."
        }
      },
      {
        "who": "me",
        "text": "Exactly. That phrase is a classic way of avoiding the question of who made them.",
        "gloss": {
          "en": "Exactly. That phrase is a classic way of avoiding the question of who made them.",
          "ko": "바로 그거야. 그 말은 누가 실수했는지를 피해 가는 전형적인 방식이야."
        }
      },
      {
        "who": "them",
        "text": "Okay, but the host pushed him on it, didn't she?",
        "gloss": {
          "en": "Okay, but the host pushed him on it, didn't she?",
          "ko": "그래, 근데 진행자가 그걸로 몰아붙이긴 했잖아?"
        }
      },
      {
        "who": "me",
        "text": "A bit. Although she asked good questions, she let him off the hook too easily.",
        "gloss": {
          "en": "A bit. Although she asked good questions, she let him off the hook too easily.",
          "ko": "조금. 좋은 질문을 하긴 했지만 너무 쉽게 놓아줬어."
        }
      },
      {
        "who": "them",
        "text": "What about the part on using AI to replace staff? I thought that was fair.",
        "gloss": {
          "en": "What about the part on using AI to replace staff? I thought that was fair.",
          "ko": "AI로 직원을 대체하는 부분은? 난 그건 공정했다고 봤는데."
        }
      },
      {
        "who": "me",
        "text": "That's a grey area, I think. It seems to me that the law just hasn't caught up yet.",
        "gloss": {
          "en": "That's a grey area, I think. It seems to me that the law just hasn't caught up yet.",
          "ko": "그건 애매한 영역 같아. 내가 보기엔 법이 아직 못 따라온 것 같아."
        }
      },
      {
        "who": "them",
        "text": "So you're saying you didn't like it?",
        "gloss": {
          "en": "So you're saying you didn't like it?",
          "ko": "그러니까 별로였다는 거야?"
        }
      },
      {
        "who": "me",
        "text": "No, no. By and large, it was worth the hour. Not once did he dodge the numbers, which I respected.",
        "gloss": {
          "en": "No, no. By and large, it was worth the hour. Not once did he dodge the numbers, which I respected.",
          "ko": "아니, 아니. 전반적으로 한 시간 들일 만했어. 숫자 질문은 한 번도 피하지 않았는데, 그건 존중해."
        }
      },
      {
        "who": "them",
        "text": "Ha, high praise. Would you recommend it to Sam?",
        "gloss": {
          "en": "Ha, high praise. Would you recommend it to Sam?",
          "ko": "하하, 극찬이네. 샘한테 추천할 거야?"
        }
      },
      {
        "who": "me",
        "text": "Definitely. In hindsight, his decision to cut the training budget might explain a lot.",
        "gloss": {
          "en": "Definitely. In hindsight, his decision to cut the training budget might explain a lot.",
          "ko": "물론이지. 돌이켜 보면 교육 예산을 깎은 그 결정이 많은 걸 설명해 줄지도 몰라."
        }
      },
      {
        "who": "them",
        "text": "Oh, interesting. I hadn't thought about that.",
        "gloss": {
          "en": "Oh, interesting. I hadn't thought about that.",
          "ko": "오, 흥미롭다. 그건 생각 못 했네."
        }
      },
      {
        "who": "me",
        "text": "Just bear in mind it's two hours long. You'll want to listen at one and a half speed.",
        "gloss": {
          "en": "Just bear in mind it's two hours long. You'll want to listen at one and a half speed.",
          "ko": "두 시간짜리라는 것만 염두에 둬. 일 점 오 배속으로 듣고 싶어질 거야."
        }
      }
    ]
  }
];
