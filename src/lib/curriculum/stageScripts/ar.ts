import type { StageScript } from "../stageScripts.ts";

/** ar 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~5단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const AR: StageScript[] = [
  {
    "id": "ar-1-1",
    "name": {
      "text": [
        "جي وو"
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
      "en": "First day of an Arabic course: meeting Sara, a classmate",
      "ko": "아랍어 수업 첫날, 같은 반 친구 사라와"
    },
    "expressions": [
      "وعليكم السلام",
      "تشرفنا",
      "نعم",
      "شكرا"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "السلام عليكم! أنا سارة. ما اسمك؟",
        "gloss": {
          "en": "Peace be upon you! I'm Sara. What's your name?",
          "ko": "안녕하세요! 저는 사라예요. 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "وعليكم السلام. اسمي جي وو. تشرفنا.",
        "gloss": {
          "en": "And peace be upon you. My name is Ji-woo. Nice to meet you.",
          "ko": "안녕하세요. 제 이름은 지우예요. 반가워요."
        },
        "frames": [
          "ar-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "تشرفنا. من أين أنت؟",
        "gloss": {
          "en": "Nice to meet you. Where are you from?",
          "ko": "반가워요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "أنا من كوريا. وأنتِ؟",
        "gloss": {
          "en": "I'm from Korea. And you?",
          "ko": "저는 한국에서 왔어요. 당신은요?"
        },
        "frames": [
          "ar-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "أنا من الأردن. هل أنت طالب هنا؟",
        "gloss": {
          "en": "I'm from Jordan. Are you a student here?",
          "ko": "저는 요르단에서 왔어요. 여기 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أنا طالب. وأنتِ طالبة؟",
        "gloss": {
          "en": "Yes, I'm a student. And are you a student?",
          "ko": "네, 학생이에요. 당신도 학생이에요?"
        },
        "frames": [
          "ar-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "نعم، أنا طالبة أيضا. هل هذا كتابك؟",
        "gloss": {
          "en": "Yes, I'm a student too. Is this your book?",
          "ko": "네, 저도 학생이에요. 이거 당신 책이에요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، هذا كتابي. شكرا!",
        "gloss": {
          "en": "Yes, this is my book. Thanks!",
          "ko": "네, 제 책이에요. 고마워요!"
        },
        "frames": [
          "ar-f1-14"
        ]
      }
    ]
  },
  {
    "id": "ar-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "At a fruit stall in the market in Amman",
      "ko": "암만 시장의 과일 노점에서"
    },
    "expressions": [
      "صباح الخير",
      "بكم هذا",
      "آسف",
      "لا أفهم",
      "مرة ثانية",
      "من فضلك",
      "طيب",
      "شكرا"
    ],
    "grammar": [
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! تفضل.",
        "gloss": {
          "en": "Good morning! What can I get you?",
          "ko": "안녕하세요! 어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "صباح الخير. بكم هذا التفاح؟",
        "gloss": {
          "en": "Good morning. How much are these apples?",
          "ko": "안녕하세요. 이 사과 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "الكيلو بدينار واحد.",
        "gloss": {
          "en": "One dinar a kilo.",
          "ko": "1킬로에 1디나르예요."
        }
      },
      {
        "who": "me",
        "text": "آسف، لا أفهم. مرة ثانية، من فضلك.",
        "gloss": {
          "en": "Sorry, I don't understand. Once more, please.",
          "ko": "죄송해요, 못 알아들었어요. 한 번 더 말해 주세요."
        },
        "frames": [
          "ar-f1-17",
          "ar-f1-12",
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "الكيلو... بدينار... واحد.",
        "gloss": {
          "en": "A kilo... one... dinar.",
          "ko": "1킬로에... 1... 디나르요."
        }
      },
      {
        "who": "me",
        "text": "طيب. أريد كيلو تفاح، من فضلك.",
        "gloss": {
          "en": "OK. I'd like a kilo of apples, please.",
          "ko": "네. 사과 1킬로 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "تفضل. هل تريد موزا أيضا؟",
        "gloss": {
          "en": "Here you go. Do you want bananas too?",
          "ko": "여기요. 바나나도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "لا، شكرا. عندي موز في البيت.",
        "gloss": {
          "en": "No, thanks. I have bananas at home.",
          "ko": "아니요, 괜찮아요. 집에 바나나가 있어요."
        },
        "frames": [
          "ar-f1-07"
        ]
      }
    ]
  },
  {
    "id": "ar-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "In the street in the evening, asking a passer-by the way",
      "ko": "저녁에 길에서 지나가는 사람에게 길 묻기"
    },
    "expressions": [
      "مساء الخير",
      "من فضلك",
      "آسف",
      "لا أفهم",
      "شوي شوي",
      "شكرا",
      "أين الحمام",
      "مع السلامة"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير. هل تحتاج مساعدة؟",
        "gloss": {
          "en": "Good evening. Do you need help?",
          "ko": "안녕하세요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. أين محطة المترو، من فضلك؟",
        "gloss": {
          "en": "Good evening. Where's the metro station, please?",
          "ko": "안녕하세요. 지하철역이 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "المحطة قريبة. امش إلى الأمام، ثم يمين.",
        "gloss": {
          "en": "The station is close. Walk straight ahead, then right.",
          "ko": "역은 가까워요. 앞으로 쭉 가서 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "آسف، لا أفهم. شوي شوي، من فضلك.",
        "gloss": {
          "en": "Sorry, I don't understand. Slowly, please.",
          "ko": "죄송해요, 못 알아들었어요. 천천히 말해 주세요."
        },
        "frames": [
          "ar-f1-17",
          "ar-f1-12",
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "طيب. إلى الأمام... ثم يمين. هناك المحطة.",
        "gloss": {
          "en": "OK. Straight ahead... then right. The station is there.",
          "ko": "네. 앞으로... 그다음 오른쪽. 거기 역이 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا! وأين الحمام هنا؟",
        "gloss": {
          "en": "Thanks! And where's the toilet around here?",
          "ko": "고마워요! 그리고 여기 화장실은 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "الحمام في المحطة، على اليسار.",
        "gloss": {
          "en": "The toilet is in the station, on the left.",
          "ko": "화장실은 역 안 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا جزيلا. مع السلامة!",
        "gloss": {
          "en": "Thank you very much. Goodbye!",
          "ko": "정말 고마워요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "ar-1-4",
    "name": {
      "text": [
        "جي وو"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Checking in at a small hotel",
      "ko": "작은 호텔에서 체크인하기"
    },
    "expressions": [
      "مرحبا",
      "نعم",
      "شكرا",
      "من فضلك"
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
        "text": "مرحبا، أهلا بك في الفندق.",
        "gloss": {
          "en": "Hello, welcome to the hotel.",
          "ko": "안녕하세요, 호텔에 오신 걸 환영해요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا. عندي حجز باسم جي وو.",
        "gloss": {
          "en": "Hello. I have a reservation under the name Ji-woo.",
          "ko": "안녕하세요. 지우 이름으로 예약했어요."
        },
        "frames": [
          "ar-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "لحظة... نعم. ما اسم العائلة؟",
        "gloss": {
          "en": "One moment... yes. What's the family name?",
          "ko": "잠시만요... 네. 성이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "اسم العائلة كيم. هذا جواز سفري.",
        "gloss": {
          "en": "The family name is Kim. This is my passport.",
          "ko": "성은 김이에요. 이건 제 여권이에요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "شكرا. غرفتك في الطابق الثالث. هذا المفتاح.",
        "gloss": {
          "en": "Thanks. Your room is on the third floor. Here's the key.",
          "ko": "감사합니다. 방은 3층이에요. 여기 열쇠요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. ما رقم الغرفة؟",
        "gloss": {
          "en": "Thanks. What's the room number?",
          "ko": "고마워요. 방 번호가 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "ثلاثمئة وخمسة. هل تريد شيئا آخر؟",
        "gloss": {
          "en": "Three hundred and five. Would you like anything else?",
          "ko": "305호예요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أريد ماء، من فضلك.",
        "gloss": {
          "en": "Yes, I'd like some water, please.",
          "ko": "네, 물 좀 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      }
    ]
  },
  {
    "id": "ar-1-x1",
    "stage": 1,
    "setting": {
      "en": "In a café, a stranger asks about the seat next to you",
      "ko": "카페에서 낯선 사람이 옆자리를 물어볼 때"
    },
    "expressions": [
      "السلام عليكم",
      "نعم",
      "تفضل",
      "عفوا",
      "كيف حالك",
      "بخير والحمد لله"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! هل هذا المكان فارغ؟",
        "gloss": {
          "en": "Good morning! Is this seat free?",
          "ko": "안녕하세요! 이 자리 비어 있어요?"
        }
      },
      {
        "who": "me",
        "text": "السلام عليكم. نعم، تفضل.",
        "gloss": {
          "en": "Peace be upon you. Yes, go ahead.",
          "ko": "안녕하세요. 네, 앉으세요."
        }
      },
      {
        "who": "them",
        "text": "شكرا جزيلا!",
        "gloss": {
          "en": "Thank you so much!",
          "ko": "정말 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "عفوا. كيف حالك؟",
        "gloss": {
          "en": "You're welcome. How are you?",
          "ko": "천만에요. 잘 지내세요?"
        }
      },
      {
        "who": "them",
        "text": "بخير، شكرا. وأنت؟",
        "gloss": {
          "en": "Fine, thanks. And you?",
          "ko": "잘 지내요, 고마워요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "بخير والحمد لله.",
        "gloss": {
          "en": "Fine, thank God.",
          "ko": "잘 지내요, 덕분에요."
        }
      }
    ]
  },
  {
    "id": "ar-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Making weekend plans with your friend Omar",
      "ko": "친구 오마르와 주말 약속 잡기"
    },
    "expressions": [
      "فكرة حلوة",
      "أكيد",
      "متى نلتقي",
      "ممكن",
      "إن شاء الله",
      "نشوفك بكرة"
    ],
    "grammar": [
      1,
      2,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "1:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ماذا ستفعل يوم السبت؟",
        "gloss": {
          "en": "What are you doing on Saturday?",
          "ko": "토요일에 뭐 할 거야?"
        }
      },
      {
        "who": "me",
        "text": "سأزور جدتي في الصباح. وأنت؟",
        "gloss": {
          "en": "I'll visit my grandmother in the morning. And you?",
          "ko": "아침에 할머니 댁에 갈 거야. 너는?"
        },
        "frames": [
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "سأذهب إلى البحر مع أخي. يلا، تعال معنا!",
        "gloss": {
          "en": "I'm going to the beach with my brother. Come on, come with us!",
          "ko": "나는 형이랑 바다에 갈 거야. 같이 가자!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! أحب السباحة كثيرا.",
        "gloss": {
          "en": "Great idea! I really like swimming.",
          "ko": "좋은 생각이야! 나 수영 정말 좋아해."
        },
        "frames": [
          "ar-f2-17",
          "ar-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. سنخرج بعد الظهر.",
        "gloss": {
          "en": "Great. We'll leave in the afternoon.",
          "ko": "좋아. 오후에 출발할 거야."
        }
      },
      {
        "who": "me",
        "text": "أكيد. متى نلتقي بالضبط؟",
        "gloss": {
          "en": "Sure. When exactly do we meet?",
          "ko": "좋아. 정확히 언제 만나?"
        },
        "frames": [
          "ar-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "الساعة الثالثة أمام بيتي. ممكن؟",
        "gloss": {
          "en": "Three o'clock in front of my house. OK?",
          "ko": "세 시에 우리 집 앞에서. 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "ممكن تأتي الساعة الرابعة؟ أدرس حتى الثالثة.",
        "gloss": {
          "en": "Could you come at four? I study until three.",
          "ko": "네 시에 와 줄 수 있어? 세 시까지 공부하거든."
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "ما في مشكلة. الساعة الرابعة إذن.",
        "gloss": {
          "en": "No problem. Four o'clock, then.",
          "ko": "문제없어. 그럼 네 시."
        }
      },
      {
        "who": "me",
        "text": "إن شاء الله. نشوفك بكرة، لن أتأخر!",
        "gloss": {
          "en": "God willing. See you tomorrow, I won't be late!",
          "ko": "그래. 내일 봐, 안 늦을게!"
        },
        "frames": [
          "ar-f2-05"
        ]
      }
    ]
  },
  {
    "id": "ar-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering at a café in the old town",
      "ko": "구시가지 카페에서 주문하기"
    },
    "expressions": [
      "صباح النور",
      "ماذا تنصح",
      "ممكن",
      "ما شاء الله",
      "الحساب من فضلك"
    ],
    "grammar": [
      1,
      2,
      3,
      5
    ],
    "earlierGrammar": [
      "1:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! ماذا تطلب؟",
        "gloss": {
          "en": "Good morning! What would you like?",
          "ko": "안녕하세요! 뭘로 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "صباح النور. ماذا تنصح اليوم؟",
        "gloss": {
          "en": "Good morning. What do you recommend today?",
          "ko": "안녕하세요. 오늘은 뭘 추천하세요?"
        },
        "frames": [
          "ar-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "القهوة التركية ممتازة، والكعكة بالتمر طازجة.",
        "gloss": {
          "en": "The Turkish coffee is excellent, and the date cake is fresh.",
          "ko": "터키 커피가 정말 좋고, 대추 케이크도 신선해요."
        }
      },
      {
        "who": "me",
        "text": "سآخذ القهوة التركية بدون سكر. لا أحب السكر.",
        "gloss": {
          "en": "I'll have the Turkish coffee without sugar. I don't like sugar.",
          "ko": "터키 커피 설탕 없이 주세요. 설탕을 안 좋아해서요."
        },
        "frames": [
          "ar-f2-11",
          "ar-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "على راحتك. شيء آخر؟",
        "gloss": {
          "en": "As you like. Anything else?",
          "ko": "원하시는 대로요. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، ممكن تعطيني قطعة من الكعكة؟",
        "gloss": {
          "en": "Yes, could you give me a piece of the cake?",
          "ko": "네, 케이크 한 조각 주실래요?"
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. تفضل، بالهناء والشفاء.",
        "gloss": {
          "en": "Of course. Here you are, enjoy.",
          "ko": "물론이죠. 여기요, 맛있게 드세요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. ما شاء الله، الكعكة لذيذة جدا!",
        "gloss": {
          "en": "Thanks. Wow, the cake is really delicious!",
          "ko": "고마워요. 와, 케이크 정말 맛있어요!"
        }
      },
      {
        "who": "them",
        "text": "الحمد لله أنها أعجبتك.",
        "gloss": {
          "en": "I'm glad you like it.",
          "ko": "마음에 드셨다니 다행이에요."
        }
      },
      {
        "who": "me",
        "text": "الحساب من فضلك. ممكن أدفع بالبطاقة؟",
        "gloss": {
          "en": "The bill, please. Can I pay by card?",
          "ko": "계산서 주세요. 카드로 계산해도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      }
    ]
  },
  {
    "id": "ar-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "At a pharmacy with a headache",
      "ko": "머리가 아파서 간 약국에서"
    },
    "expressions": [
      "عندي صداع",
      "إن شاء الله",
      "يعطيك العافية"
    ],
    "grammar": [
      0,
      2,
      3,
      5,
      7
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير. كيف أساعدك؟",
        "gloss": {
          "en": "Good evening. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. عندي صداع منذ الصباح.",
        "gloss": {
          "en": "Good evening. I've had a headache since the morning.",
          "ko": "안녕하세요. 아침부터 머리가 아파요."
        },
        "frames": [
          "ar-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "سلامتك. هل أخذت دواء؟",
        "gloss": {
          "en": "Oh dear. Have you taken any medicine?",
          "ko": "저런. 약은 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لم آخذ أي دواء. ولم أنم جيدا أمس.",
        "gloss": {
          "en": "No, I haven't taken any medicine. And I didn't sleep well yesterday.",
          "ko": "아니요, 아무 약도 안 먹었어요. 그리고 어제 잠을 잘 못 잤어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "ربما بسبب التعب. خذ هذه الحبوب، حبة كل ثماني ساعات.",
        "gloss": {
          "en": "Maybe it's tiredness. Take these pills, one every eight hours.",
          "ko": "피곤해서 그럴 거예요. 이 약을 여덟 시간마다 한 알씩 드세요."
        }
      },
      {
        "who": "me",
        "text": "طيب. ممكن آخذها مع القهوة؟",
        "gloss": {
          "en": "OK. Can I take them with coffee?",
          "ko": "네. 커피랑 같이 먹어도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "الأفضل مع الماء، وبعد الأكل.",
        "gloss": {
          "en": "Better with water, and after eating.",
          "ko": "물이랑, 식사 후에 드시는 게 좋아요."
        }
      },
      {
        "who": "me",
        "text": "فهمت. سأشرب ماء كثيرا لأن الجو حار.",
        "gloss": {
          "en": "Got it. I'll drink lots of water because it's hot.",
          "ko": "알겠어요. 날이 더우니까 물을 많이 마실게요."
        },
        "frames": [
          "ar-f2-06",
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. وإذا بقي الصداع، اذهب إلى الطبيب.",
        "gloss": {
          "en": "Great. And if the headache doesn't go, see a doctor.",
          "ko": "좋아요. 그래도 두통이 계속되면 병원에 가세요."
        }
      },
      {
        "who": "me",
        "text": "إن شاء الله. شكرا، يعطيك العافية!",
        "gloss": {
          "en": "I will. Thanks, I appreciate your help!",
          "ko": "그럴게요. 고마워요, 수고하세요!"
        }
      }
    ]
  },
  {
    "id": "ar-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Your neighbour Abu Sami drops by for tea and asks about your family",
      "ko": "이웃 아부 사미가 차 마시러 와서 가족 이야기를 묻는다"
    },
    "expressions": [
      "أهلا وسهلا",
      "الله يعافيك",
      "بالهناء والشفاء"
    ],
    "grammar": [
      1,
      2,
      3,
      6,
      7
    ],
    "earlierGrammar": [
      "1:3",
      "1:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير يا جاري! كيف حالك؟",
        "gloss": {
          "en": "Good evening, neighbour! How are you?",
          "ko": "안녕하세요, 이웃님! 잘 지내세요?"
        }
      },
      {
        "who": "me",
        "text": "أهلا وسهلا! بخير والحمد لله. تفضل، اجلس.",
        "gloss": {
          "en": "Welcome! Fine, thank God. Come in, sit down.",
          "ko": "어서 오세요! 잘 지내요. 들어와서 앉으세요."
        }
      },
      {
        "who": "them",
        "text": "شكرا. من هذا في الصورة؟",
        "gloss": {
          "en": "Thanks. Who's this in the photo?",
          "ko": "고마워요. 사진 속 이 사람은 누구예요?"
        }
      },
      {
        "who": "me",
        "text": "هذا أخي الكبير. يعمل في مستشفى في سول.",
        "gloss": {
          "en": "That's my older brother. He works at a hospital in Seoul.",
          "ko": "우리 형이에요. 서울에 있는 병원에서 일해요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله! وهذه أختك؟",
        "gloss": {
          "en": "How wonderful! And is this your sister?",
          "ko": "와! 그리고 이분은 누나예요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، وهذا بيت أختي في بوسان. سأزورها في العطلة.",
        "gloss": {
          "en": "Yes, and this is my sister's house in Busan. I'll visit her during the holiday.",
          "ko": "네, 그리고 이건 부산에 있는 누나 집이에요. 방학 때 놀러 갈 거예요."
        },
        "frames": [
          "ar-f2-15",
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "جميل! وأنت، هل تتصل بعائلتك كثيرا؟",
        "gloss": {
          "en": "Lovely! And you, do you call your family often?",
          "ko": "좋네요! 가족한테 자주 전화해요?"
        }
      },
      {
        "who": "me",
        "text": "أتصل بأمي كل يوم، لكن لا أتصل بأخي كثيرا لأنه مشغول.",
        "gloss": {
          "en": "I call my mum every day, but I don't call my brother much because he's busy.",
          "ko": "엄마한테는 매일 전화하는데, 형은 바빠서 자주 안 해요."
        },
        "frames": [
          "ar-f2-03",
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "الشاي لذيذ. يعطيك العافية!",
        "gloss": {
          "en": "The tea is delicious. Thank you for your trouble!",
          "ko": "차 맛있네요. 수고 많으셨어요!"
        }
      },
      {
        "who": "me",
        "text": "الله يعافيك. بالهناء والشفاء!",
        "gloss": {
          "en": "Thank you. Enjoy!",
          "ko": "별말씀을요. 맛있게 드세요!"
        }
      }
    ]
  },
  {
    "id": "ar-2-x1",
    "stage": 2,
    "setting": {
      "en": "A friend invites you to the cinema the night before your exam",
      "ko": "시험 전날 밤 친구가 영화 보러 가자고 할 때"
    },
    "expressions": [
      "للأسف",
      "ما في مشكلة",
      "يلا",
      "الله يسلمك"
    ],
    "grammar": [
      0,
      3
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "يلا نذهب إلى السينما الليلة!",
        "gloss": {
          "en": "Let's go to the cinema tonight!",
          "ko": "오늘 밤 영화 보러 가자!"
        }
      },
      {
        "who": "me",
        "text": "للأسف، لن أخرج الليلة. عندي امتحان غدا.",
        "gloss": {
          "en": "Unfortunately, I won't go out tonight. I have an exam tomorrow.",
          "ko": "아쉽지만 오늘 밤은 안 나가. 내일 시험이 있어."
        },
        "frames": [
          "ar-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "طيب. وبعد الامتحان؟",
        "gloss": {
          "en": "OK. And after the exam?",
          "ko": "그래. 시험 끝나고는?"
        }
      },
      {
        "who": "me",
        "text": "بعد الامتحان ما في مشكلة. يلا، يوم الخميس!",
        "gloss": {
          "en": "After the exam, no problem. Come on, Thursday!",
          "ko": "시험 끝나면 괜찮아. 좋아, 목요일에 가자!"
        },
        "frames": [
          "ar-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. أنا سأشتري التذاكر.",
        "gloss": {
          "en": "Great. I'll buy the tickets.",
          "ko": "좋아. 표는 내가 살게."
        }
      },
      {
        "who": "me",
        "text": "شكرا. ذهبت إلى السينما الأسبوع الماضي وشاهدت فيلما رائعا.",
        "gloss": {
          "en": "Thanks. I went to the cinema last week and saw a great film.",
          "ko": "고마워. 지난주에 영화관 갔는데 정말 좋은 영화를 봤어."
        }
      },
      {
        "who": "them",
        "text": "إذن ستختار أنت الفيلم. مع السلامة!",
        "gloss": {
          "en": "Then you choose the film. Bye!",
          "ko": "그럼 영화는 네가 골라. 잘 가!"
        }
      },
      {
        "who": "me",
        "text": "الله يسلمك. نشوفك يوم الخميس!",
        "gloss": {
          "en": "Bye, take care. See you Thursday!",
          "ko": "응, 잘 가. 목요일에 봐!"
        }
      }
    ]
  },
  {
    "id": "ar-2-x2",
    "stage": 2,
    "setting": {
      "en": "A friend is finishing dinner at your place",
      "ko": "우리 집에서 친구가 저녁을 다 먹어 갈 때"
    },
    "expressions": [
      "شيء آخر",
      "على راحتك",
      "ممكن",
      "بالهناء والشفاء"
    ],
    "grammar": [
      1,
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "الأكل لذيذ جدا!",
        "gloss": {
          "en": "The food is really tasty!",
          "ko": "음식 정말 맛있어!"
        }
      },
      {
        "who": "me",
        "text": "بالهناء والشفاء. هل تحتاج إلى شيء آخر؟",
        "gloss": {
          "en": "Enjoy. Do you need anything else?",
          "ko": "맛있게 먹어. 더 필요한 거 있어?"
        }
      },
      {
        "who": "them",
        "text": "لا، شكرا. سأذهب بعد قليل.",
        "gloss": {
          "en": "No, thanks. I'll head off in a bit.",
          "ko": "아니, 고마워. 조금 있다가 갈게."
        }
      },
      {
        "who": "me",
        "text": "على راحتك. ممكن أوصلك بالسيارة؟",
        "gloss": {
          "en": "Whatever suits you. Can I drive you home?",
          "ko": "편할 대로 해. 차로 데려다줄까?"
        },
        "frames": [
          "ar-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "شكرا، بيتي قريب. أحب المشي في الليل.",
        "gloss": {
          "en": "Thanks, my house is close. I like walking at night.",
          "ko": "고마워, 우리 집 가까워. 밤에 걷는 거 좋아해."
        }
      },
      {
        "who": "me",
        "text": "وأنا أيضا أحب المشي. سأمشي معك قليلا.",
        "gloss": {
          "en": "I like walking too. I'll walk with you for a bit.",
          "ko": "나도 걷는 거 좋아해. 조금 같이 걸을게."
        },
        "frames": [
          "ar-f2-07",
          "ar-f2-02"
        ]
      }
    ]
  },
  {
    "id": "ar-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Back from a trip to Jordan, telling your friend Rana about it",
      "ko": "요르단 여행에서 돌아와 친구 라나에게 이야기하기"
    },
    "expressions": [
      "بصراحة",
      "تخيل",
      "على فكرة"
    ],
    "grammar": [
      0,
      1,
      3,
      5
    ],
    "earlierGrammar": [
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "الحمد لله على السلامة! كيف كانت الرحلة إلى الأردن؟",
        "gloss": {
          "en": "Welcome back safely! How was the trip to Jordan?",
          "ko": "무사히 돌아와서 다행이야! 요르단 여행 어땠어?"
        },
        "alt": [
          {
            "text": "أهلا! رجعت أخيرا! كيف كانت الرحلة؟",
            "gloss": {
              "en": "Hi! You're finally back! How was the trip?",
              "ko": "와! 드디어 왔네! 여행 어땠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "الله يسلمك. بصراحة، كانت أجمل رحلة في حياتي.",
        "gloss": {
          "en": "Thank you. Honestly, it was the best trip of my life.",
          "ko": "고마워. 솔직히 내 인생 최고의 여행이었어."
        }
      },
      {
        "who": "them",
        "text": "ما شاء الله! أين ذهبتم أولا؟",
        "gloss": {
          "en": "Wow! Where did you go first?",
          "ko": "와! 처음엔 어디 갔어?"
        }
      },
      {
        "who": "me",
        "text": "أولا زرنا البتراء، ثم ذهبنا إلى وادي رم.",
        "gloss": {
          "en": "First we visited Petra, then we went to Wadi Rum.",
          "ko": "먼저 페트라에 갔고, 그다음 와디럼에 갔어."
        },
        "frames": [
          "ar-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "سمعت أن الصحراء هناك رائعة. هل نمتم في خيمة؟",
        "gloss": {
          "en": "I heard the desert there is amazing. Did you sleep in a tent?",
          "ko": "거기 사막이 정말 멋지다던데. 텐트에서 잤어?"
        },
        "alt": [
          {
            "text": "وادي رم؟ يعني نمتم في الصحراء؟",
            "gloss": {
              "en": "Wadi Rum? So you slept in the desert?",
              "ko": "와디럼? 그럼 사막에서 잤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "نعم. كنا نشرب الشاي وننظر إلى النجوم كل ليلة.",
        "gloss": {
          "en": "Yes. Every night we'd drink tea and look at the stars.",
          "ko": "응. 매일 밤 차를 마시면서 별을 봤어."
        },
        "frames": [
          "ar-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "يا سلام! وماذا حدث بعد ذلك؟",
        "gloss": {
          "en": "Wow! And what happened after that?",
          "ko": "우와! 그다음엔?"
        }
      },
      {
        "who": "me",
        "text": "بعد ذلك ذهبنا إلى العقبة. البحر هناك أجمل من البحر عندنا.",
        "gloss": {
          "en": "After that we went to Aqaba. The sea there is nicer than ours.",
          "ko": "그다음엔 아카바에 갔어. 거기 바다가 우리 바다보다 예뻐."
        },
        "frames": [
          "ar-f3-11",
          "ar-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "جميل! هل حصلت أي مشكلة؟",
        "gloss": {
          "en": "Lovely! Did anything go wrong?",
          "ko": "좋다! 무슨 문제는 없었어?"
        },
        "alt": [
          {
            "text": "وهل كان كل شيء سهلا؟",
            "gloss": {
              "en": "And was everything easy?",
              "ko": "다 순조로웠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "تخيل، في المطار ضاعت حقيبتي! لكن في النهاية وجدوها.",
        "gloss": {
          "en": "Imagine, my bag got lost at the airport! But in the end they found it.",
          "ko": "있잖아, 공항에서 내 가방이 없어졌어! 그래도 결국 찾았어."
        },
        "frames": [
          "ar-f3-16",
          "ar-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "الحمد لله! إذا سافرت مرة ثانية، سآتي معك.",
        "gloss": {
          "en": "Thank God! If you travel again, I'm coming with you.",
          "ko": "다행이다! 다음에 또 가면 나도 같이 갈래."
        }
      },
      {
        "who": "me",
        "text": "أكيد! على فكرة، أريد أن أرجع في الربيع.",
        "gloss": {
          "en": "Sure! By the way, I want to go back in spring.",
          "ko": "당연하지! 그런데 나 봄에 다시 가고 싶어."
        },
        "frames": [
          "ar-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "On the phone with your landlord, Mr Samir, about the broken air conditioner",
      "ko": "집주인 사미르 씨에게 고장 난 에어컨 문제로 전화하기"
    },
    "expressions": [
      "بصراحة",
      "يا خسارة",
      "ولا يهمك",
      "حصل خير",
      "المهم"
    ],
    "grammar": [
      0,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "1:6",
      "2:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو، مساء الخير.",
        "gloss": {
          "en": "Hello, good evening.",
          "ko": "여보세요, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "مساء الخير يا أستاذ سمير. عندي مشكلة: المكيف لا يعمل منذ أمس.",
        "gloss": {
          "en": "Good evening, Mr Samir. I have a problem: the air conditioner hasn't worked since yesterday.",
          "ko": "안녕하세요, 사미르 씨. 문제가 있어요. 어제부터 에어컨이 안 돼요."
        }
      },
      {
        "who": "them",
        "text": "سلامتك! ماذا حدث بالضبط؟",
        "gloss": {
          "en": "Oh dear! What happened exactly?",
          "ko": "저런! 정확히 무슨 일이에요?"
        },
        "alt": [
          {
            "text": "غريب! كان يعمل جيدا الشهر الماضي.",
            "gloss": {
              "en": "Strange! It was working fine last month.",
              "ko": "이상하네요! 지난달엔 잘 됐는데요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "كنت أشاهد التلفزيون عندما توقف فجأة، وبعد ذلك بدأ يصدر صوتا غريبا.",
        "gloss": {
          "en": "I was watching TV when it suddenly stopped, and after that it started making a strange noise.",
          "ko": "TV를 보고 있는데 갑자기 멈추더니, 그 뒤로 이상한 소리가 나기 시작했어요."
        },
        "frames": [
          "ar-f3-02",
          "ar-f3-01",
          "ar-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "هل جربت أن تطفئه وتشغله مرة ثانية؟",
        "gloss": {
          "en": "Have you tried switching it off and on again?",
          "ko": "껐다가 다시 켜 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، جربت، لكنه لا يعمل. بصراحة، لا أستطيع أن أنام من الحر.",
        "gloss": {
          "en": "Yes, I tried, but it doesn't work. Honestly, I can't sleep because of the heat.",
          "ko": "네, 해 봤는데 안 돼요. 솔직히 더워서 잠을 못 자겠어요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "أفهم. الفني مشغول اليوم، ممكن يأتي بعد يومين.",
        "gloss": {
          "en": "I understand. The technician is busy today; he can come in two days.",
          "ko": "알겠어요. 기사님이 오늘 바빠서 이틀 뒤에 올 수 있어요."
        },
        "alt": [
          {
            "text": "الفني في إجازة حتى الأحد، للأسف.",
            "gloss": {
              "en": "The technician is on leave until Sunday, unfortunately.",
              "ko": "기사님이 아쉽게도 일요일까지 휴가예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "يا خسارة. يجب أن نصلح المكيف اليوم، الجو حار جدا.",
        "gloss": {
          "en": "What a shame. We need to fix the AC today, it's really hot.",
          "ko": "아쉽네요. 오늘 에어컨을 고쳐야 해요, 너무 더워요."
        },
        "frames": [
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "طيب، سأحاول أن أجد فنيا آخر.",
        "gloss": {
          "en": "OK, I'll try to find another technician.",
          "ko": "알겠어요, 다른 기사님을 찾아볼게요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. إذا وجدت فنيا، اتصل بي في أي وقت.",
        "gloss": {
          "en": "Thanks. If you find a technician, call me any time.",
          "ko": "고마워요. 기사님 찾으시면 언제든 전화 주세요."
        },
        "frames": [
          "ar-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. وآسف على هذا الإزعاج.",
        "gloss": {
          "en": "Of course. And sorry for the trouble.",
          "ko": "물론이죠. 불편을 드려 죄송해요."
        },
        "alt": [
          {
            "text": "إن شاء الله يأتي اليوم. آسف جدا.",
            "gloss": {
              "en": "Hopefully he'll come today. I'm very sorry.",
              "ko": "오늘 오시면 좋겠네요. 정말 죄송해요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ولا يهمك، حصل خير. المهم أن يعمل المكيف.",
        "gloss": {
          "en": "Don't worry about it, no harm done. What matters is that the AC works.",
          "ko": "괜찮아요, 별일 아니에요. 에어컨만 되면 돼요."
        }
      }
    ]
  },
  {
    "id": "ar-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "With your friend Huda after viewing two flats, deciding which one to take",
      "ko": "집 두 곳을 보고 나서 친구 후다와 어느 집으로 할지 정하기"
    },
    "expressions": [
      "مش متأكد",
      "معك حق",
      "من جهة أخرى",
      "يعني",
      "أظن أن",
      "أنا موافق"
    ],
    "grammar": [
      1,
      2,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "2:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "إذن، ما رأيك؟ الشقة الأولى أم الثانية؟",
        "gloss": {
          "en": "So, what do you think? The first flat or the second?",
          "ko": "그래서 어때? 첫 번째 집이야, 두 번째 집이야?"
        },
        "alt": [
          {
            "text": "صعب، صح؟ أي شقة أعجبتك أكثر؟",
            "gloss": {
              "en": "Tough, right? Which flat did you like more?",
              "ko": "어렵지? 어느 집이 더 좋았어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "مش متأكد. الشقة الأولى أكبر من الثانية، لكنها أغلى.",
        "gloss": {
          "en": "I'm not sure. The first flat is bigger than the second, but it's more expensive.",
          "ko": "잘 모르겠어. 첫 번째 집이 두 번째보다 크지만 더 비싸."
        },
        "frames": [
          "ar-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "والثانية قريبة من عملك، يعني ستوفر وقتا كثيرا.",
        "gloss": {
          "en": "And the second is close to your work, so you'd save a lot of time.",
          "ko": "그리고 두 번째는 회사랑 가까워서 시간이 많이 절약될 거야."
        }
      },
      {
        "who": "me",
        "text": "معك حق. من جهة أخرى، الشقة التي رأيناها أولا فيها شرفة كبيرة.",
        "gloss": {
          "en": "You're right. On the other hand, the flat we saw first has a big balcony.",
          "ko": "맞아. 반면에 처음에 본 집은 큰 발코니가 있어."
        },
        "frames": [
          "ar-f3-15",
          "ar-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "الشرفة جميلة، لكن الشارع هناك مزعج جدا.",
        "gloss": {
          "en": "The balcony is nice, but the street there is very noisy.",
          "ko": "발코니는 좋은데, 거기 길이 너무 시끄러워."
        },
        "alt": [
          {
            "text": "نعم، لكن هل تحتاج إلى شرفة فعلا؟",
            "gloss": {
              "en": "Yes, but do you really need a balcony?",
              "ko": "응, 근데 발코니가 정말 필요해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "صحيح. أنا أعمل من البيت أحيانا، يعني أحتاج مكانا هادئا.",
        "gloss": {
          "en": "True. I sometimes work from home, so I need a quiet place.",
          "ko": "맞아. 가끔 재택근무를 해서 조용한 곳이 필요해."
        }
      },
      {
        "who": "them",
        "text": "إذن الثانية أهدأ. وهي أيضا أرخص بمئة دينار.",
        "gloss": {
          "en": "Then the second is quieter. And it's a hundred dinars cheaper too.",
          "ko": "그럼 두 번째가 더 조용해. 게다가 백 디나르 더 싸."
        }
      },
      {
        "who": "me",
        "text": "أظن أن الثانية أفضل لي. لكن أريد أن أراها مرة ثانية قبل القرار.",
        "gloss": {
          "en": "I think the second is better for me. But I want to see it again before deciding.",
          "ko": "두 번째가 나한테 더 나은 것 같아. 그래도 결정하기 전에 한 번 더 보고 싶어."
        },
        "frames": [
          "ar-f3-13",
          "ar-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "فكرة جيدة. إذا ذهبنا يوم السبت، سأكون معك.",
        "gloss": {
          "en": "Good idea. If we go on Saturday, I'll come with you.",
          "ko": "좋은 생각이야. 토요일에 가면 나도 같이 갈게."
        },
        "alt": [
          {
            "text": "ممكن نرجع غدا بعد العمل إذا أردت.",
            "gloss": {
              "en": "We could go back tomorrow after work if you like.",
              "ko": "원하면 내일 퇴근하고 다시 가도 돼."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ممتاز. إذا كانت هادئة في المساء، سأوقع العقد.",
        "gloss": {
          "en": "Great. If it's quiet in the evening, I'll sign the contract.",
          "ko": "좋아. 저녁에도 조용하면 계약할게."
        },
        "frames": [
          "ar-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "وإذا وقعت، سنحتفل!",
        "gloss": {
          "en": "And if you sign, we'll celebrate!",
          "ko": "계약하면 축하하자!"
        }
      },
      {
        "who": "me",
        "text": "أنا موافق! وشكرا على مساعدتك اليوم.",
        "gloss": {
          "en": "I'm in! And thanks for your help today.",
          "ko": "좋아! 그리고 오늘 도와줘서 고마워."
        },
        "frames": [
          "ar-f1-11"
        ]
      }
    ]
  },
  {
    "id": "ar-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Talking with a colleague about the series everyone is watching",
      "ko": "동료와 모두가 보는 드라마 이야기하기"
    },
    "expressions": [
      "تخيل",
      "بالعكس",
      "في رأيي",
      "يعني",
      "معك حق",
      "على الأقل",
      "أظن أن"
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
        "text": "هل شاهدت الحلقة الأخيرة من المسلسل؟",
        "gloss": {
          "en": "Did you watch the last episode of the series?",
          "ko": "그 드라마 마지막 회 봤어?"
        },
        "alt": [
          {
            "text": "على فكرة، هل وصلت إلى الحلقة الأخيرة؟",
            "gloss": {
              "en": "By the way, have you got to the last episode?",
              "ko": "그런데, 마지막 회까지 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "نعم، شاهدتها أمس. تخيل، بقيت مستيقظا حتى الثانية ليلا!",
        "gloss": {
          "en": "Yes, I watched it yesterday. Imagine, I stayed up until two in the morning!",
          "ko": "응, 어제 봤어. 있잖아, 새벽 두 시까지 안 잤어!"
        },
        "frames": [
          "ar-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "وما رأيك في النهاية؟ أنا لم تعجبني.",
        "gloss": {
          "en": "And what did you think of the ending? I didn't like it.",
          "ko": "결말은 어땠어? 난 별로였어."
        },
        "alt": [
          {
            "text": "بصراحة، النهاية كانت ضعيفة، صح؟",
            "gloss": {
              "en": "Honestly, the ending was weak, right?",
              "ko": "솔직히 결말 약했지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "بالعكس! في رأيي، كانت أفضل حلقة في المسلسل.",
        "gloss": {
          "en": "On the contrary! In my opinion, it was the best episode of the series.",
          "ko": "오히려 반대야! 내 생각엔 시리즈 최고의 회였어."
        },
        "frames": [
          "ar-f3-17",
          "ar-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "حقا؟ لماذا؟ البطل مات بطريقة غريبة.",
        "gloss": {
          "en": "Really? Why? The hero died in such a strange way.",
          "ko": "진짜? 왜? 주인공이 이상하게 죽었잖아."
        }
      },
      {
        "who": "me",
        "text": "لأن الممثل الذي لعب دور البطل كان رائعا. أنا بكيت!",
        "gloss": {
          "en": "Because the actor who played the hero was amazing. I cried!",
          "ko": "주인공 역을 한 배우가 정말 대단했거든. 나 울었어!"
        },
        "frames": [
          "ar-f3-04",
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "صحيح، التمثيل كان ممتازا. لكن القصة كانت أبطأ من الموسم الأول.",
        "gloss": {
          "en": "True, the acting was excellent. But the story was slower than the first season.",
          "ko": "맞아, 연기는 최고였어. 근데 이야기가 시즌 1보다 느렸어."
        },
        "alt": [
          {
            "text": "التمثيل جيد، لكن الكاتب أطال القصة كثيرا.",
            "gloss": {
              "en": "The acting's good, but the writer dragged the story out a lot.",
              "ko": "연기는 좋은데, 작가가 이야기를 너무 늘였어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "يعني، معك حق قليلا. على الأقل الموسيقى كانت جميلة.",
        "gloss": {
          "en": "Well, you're a bit right. At least the music was beautiful.",
          "ko": "뭐, 네 말이 좀 맞아. 적어도 음악은 좋았어."
        },
        "frames": [
          "ar-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. هل تعرف متى يبدأ الموسم الجديد؟",
        "gloss": {
          "en": "Definitely. Do you know when the new season starts?",
          "ko": "그건 그래. 새 시즌 언제 시작하는지 알아?"
        }
      },
      {
        "who": "me",
        "text": "أظن أن الموسم الجديد سيبدأ في الشتاء.",
        "gloss": {
          "en": "I think the new season will start in winter.",
          "ko": "새 시즌은 겨울에 시작할 것 같아."
        },
        "frames": [
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "طويل! ماذا سنشاهد حتى ذلك الوقت؟",
        "gloss": {
          "en": "That's ages! What will we watch until then?",
          "ko": "오래 남았네! 그때까지 뭐 보지?"
        }
      },
      {
        "who": "me",
        "text": "عندي فكرة: يجب أن تشاهد المسلسل الذي كنت أشاهده في الجامعة.",
        "gloss": {
          "en": "I have an idea: you should watch the series I used to watch at university.",
          "ko": "좋은 생각 있어. 내가 대학 때 보던 드라마를 꼭 봐야 해."
        },
        "frames": [
          "ar-f3-05",
          "ar-f3-04",
          "ar-f3-01"
        ]
      }
    ]
  },
  {
    "id": "ar-3-x1",
    "stage": 3,
    "setting": {
      "en": "Catching up with a friend who just got back from a trip",
      "ko": "여행에서 막 돌아온 친구와 근황 나누기"
    },
    "expressions": [
      "الله يبارك فيك",
      "بصراحة",
      "مبروك",
      "ما رأيك",
      "سلامتك",
      "الحمد لله على السلامة"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "سمعت أنك حصلت على العمل الجديد. مبروك!",
        "gloss": {
          "en": "I heard you got the new job. Congratulations!",
          "ko": "새 직장 붙었다며. 축하해!"
        }
      },
      {
        "who": "me",
        "text": "الله يبارك فيك! بصراحة، كنت خائفا من المقابلة.",
        "gloss": {
          "en": "Thank you! Honestly, I was scared of the interview.",
          "ko": "고마워! 솔직히 면접이 무서웠어."
        }
      },
      {
        "who": "them",
        "text": "وأختي أيضا نجحت في امتحانها أمس.",
        "gloss": {
          "en": "And my sister passed her exam yesterday too.",
          "ko": "그리고 우리 언니도 어제 시험에 합격했어."
        }
      },
      {
        "who": "me",
        "text": "مبروك لها! ما رأيك أن نحتفل معا يوم الجمعة؟",
        "gloss": {
          "en": "Congratulations to her! How about we celebrate together on Friday?",
          "ko": "언니도 축하해! 금요일에 같이 축하하는 거 어때?"
        },
        "frames": [
          "ar-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "فكرة حلوة، لكن عندي زكام قوي هذه الأيام.",
        "gloss": {
          "en": "Great idea, but I've got a bad cold these days.",
          "ko": "좋은 생각인데, 요즘 감기가 심해."
        }
      },
      {
        "who": "me",
        "text": "سلامتك! إذا كنت متعبا، نحتفل الأسبوع القادم.",
        "gloss": {
          "en": "Get well soon! If you're tired, we'll celebrate next week.",
          "ko": "얼른 나아! 피곤하면 다음 주에 축하하자."
        },
        "frames": [
          "ar-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "شكرا. على فكرة، رجعت من السفر أمس فقط.",
        "gloss": {
          "en": "Thanks. By the way, I only got back from my trip yesterday.",
          "ko": "고마워. 그런데 나 어제 여행에서 막 돌아왔어."
        }
      },
      {
        "who": "me",
        "text": "الحمد لله على السلامة! يجب أن تحكي لي كل شيء.",
        "gloss": {
          "en": "Welcome back safely! You have to tell me everything.",
          "ko": "무사히 와서 다행이다! 다 얘기해 줘야 해."
        },
        "frames": [
          "ar-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ar-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "A team meeting with your manager, Ms Dina, about a project that is two weeks late",
      "ko": "2주 늦어진 프로젝트로 디나 팀장과 팀 회의"
    },
    "expressions": [
      "إذا سمحت لي",
      "في الواقع",
      "أفهم وجهة نظرك",
      "خلينا نكون واقعيين",
      "ليس بالضرورة",
      "هذا يعتمد على",
      "من ناحيتي",
      "بالإضافة إلى ذلك",
      "خلاص اتفقنا",
      "باختصار"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير جميعا. كما تعرفون، المشروع متأخر أسبوعين. ما السبب؟",
        "gloss": {
          "en": "Good morning, everyone. As you know, the project is two weeks behind. What's the reason?",
          "ko": "좋은 아침입니다. 아시다시피 프로젝트가 2주 늦어졌어요. 이유가 뭐죠?"
        },
        "alt": [
          {
            "text": "لنبدأ مباشرة: لماذا تأخر المشروع؟",
            "gloss": {
              "en": "Let's get straight to it: why is the project late?",
              "ko": "바로 시작하죠. 프로젝트가 왜 늦어졌나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "إذا سمحت لي، سأشرح. في الواقع، تم تغيير التصميم مرتين الشهر الماضي.",
        "gloss": {
          "en": "If you'll allow me, I'll explain. In fact, the design was changed twice last month.",
          "ko": "제가 설명드리겠습니다. 사실 지난달에 디자인이 두 번 바뀌었어요."
        },
        "frames": [
          "ar-f4-17",
          "ar-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "أفهم، لكن العميل ينتظر، وهو غير راض.",
        "gloss": {
          "en": "I understand, but the client is waiting, and he isn't happy.",
          "ko": "알겠어요, 하지만 고객이 기다리고 있고 만족하지 않아요."
        }
      },
      {
        "who": "me",
        "text": "أفهم وجهة نظرك. لو عرفنا بالتغييرات مبكرا لأنهينا العمل في الوقت.",
        "gloss": {
          "en": "I understand your point of view. If we'd known about the changes early, we would have finished on time.",
          "ko": "그 입장 이해합니다. 변경 사항을 일찍 알았다면 제때 끝냈을 거예요."
        },
        "frames": [
          "ar-f4-11",
          "ar-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "ممكن، لكن ماذا نفعل الآن؟",
        "gloss": {
          "en": "Maybe, but what do we do now?",
          "ko": "그럴 수도 있죠. 그런데 지금은 어떻게 하죠?"
        },
        "alt": [
          {
            "text": "هذا كلام عن الماضي. ما الحل الآن؟",
            "gloss": {
              "en": "That's about the past. What's the solution now?",
              "ko": "그건 지난 얘기고요. 지금 해결책은요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "خلينا نكون واقعيين: كلما أضفنا مهام جديدة، زاد التأخير.",
        "gloss": {
          "en": "Let's be realistic: the more new tasks we add, the bigger the delay gets.",
          "ko": "현실적으로 보죠. 새 업무를 더할수록 지연이 커져요."
        },
        "frames": [
          "ar-f4-15",
          "ar-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "يعني تقترح أن نلغي بعض المهام؟",
        "gloss": {
          "en": "So you're suggesting we cancel some tasks?",
          "ko": "그럼 일부 업무를 취소하자는 건가요?"
        }
      },
      {
        "who": "me",
        "text": "ليس بالضرورة. قد يكون من الأفضل أن نؤجل بعضها إلى المرحلة الثانية.",
        "gloss": {
          "en": "Not necessarily. It might be better to postpone some of them to the second phase.",
          "ko": "꼭 그렇진 않아요. 일부를 2단계로 미루는 게 나을 수도 있어요."
        },
        "frames": [
          "ar-f4-12",
          "ar-f4-06"
        ]
      },
      {
        "who": "them",
        "text": "والعميل؟ هل سيقبل بذلك؟",
        "gloss": {
          "en": "And the client? Will he accept that?",
          "ko": "고객은요? 받아들일까요?"
        },
        "alt": [
          {
            "text": "وهل تظن أن العميل سيوافق؟",
            "gloss": {
              "en": "And do you think the client will agree?",
              "ko": "고객이 동의할 거라고 보세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "هذا يعتمد على طريقة العرض. أما الميزانية فلن تتغير.",
        "gloss": {
          "en": "That depends on how we present it. As for the budget, it won't change.",
          "ko": "어떻게 제시하느냐에 달렸어요. 예산은 바뀌지 않을 거고요."
        },
        "frames": [
          "ar-f4-13",
          "ar-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "نقطة مهمة. من سيتصل به؟",
        "gloss": {
          "en": "Good point. Who'll call him?",
          "ko": "중요한 점이네요. 누가 연락하죠?"
        }
      },
      {
        "who": "me",
        "text": "من ناحيتي، أستطيع أن أتصل به اليوم. بالإضافة إلى ذلك، سأرسل له خطة جديدة.",
        "gloss": {
          "en": "For my part, I can call him today. In addition, I'll send him a new plan.",
          "ko": "제가 오늘 연락할 수 있어요. 그리고 새 계획도 보내겠습니다."
        },
        "frames": [
          "ar-f4-10",
          "ar-f4-09",
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. إذن نلتقي يوم الخميس لنراجع الخطة؟",
        "gloss": {
          "en": "Excellent. So we meet on Thursday to review the plan?",
          "ko": "좋아요. 그럼 목요일에 만나서 계획을 검토할까요?"
        }
      },
      {
        "who": "me",
        "text": "خلاص اتفقنا. باختصار: نؤجل بعض المهام، ونسلم الباقي في الوقت.",
        "gloss": {
          "en": "Agreed, then. In short: we postpone some tasks and deliver the rest on time.",
          "ko": "네, 그렇게 하죠. 요약하면, 일부는 미루고 나머지는 제때 넘기는 거예요."
        },
        "frames": [
          "ar-f4-16"
        ]
      }
    ]
  },
  {
    "id": "ar-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Negotiating the rent for a flat with an estate agent",
      "ko": "부동산 중개인과 월세 협상하기"
    },
    "expressions": [
      "بشكل عام",
      "عن جد",
      "من الآخر",
      "في نفس الوقت",
      "نتفق على",
      "ما عندي مانع",
      "على كل حال"
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
        "text": "الشقة كما رأيت ممتازة، والإيجار خمسمئة دينار في الشهر.",
        "gloss": {
          "en": "As you've seen, the flat is excellent, and the rent is five hundred dinars a month.",
          "ko": "보신 대로 집은 훌륭하고, 월세는 한 달에 오백 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "الشقة جميلة، رغم أن المطبخ صغير قليلا. لكن السعر مرتفع بصراحة.",
        "gloss": {
          "en": "The flat is lovely, although the kitchen is a bit small. But honestly, the price is high.",
          "ko": "집은 예쁘네요, 부엌이 좀 작긴 하지만요. 그런데 솔직히 가격이 높아요."
        },
        "frames": [
          "ar-f4-03"
        ]
      },
      {
        "who": "them",
        "text": "هذا سعر السوق في هذه المنطقة.",
        "gloss": {
          "en": "That's the market price in this area.",
          "ko": "이 동네 시세예요."
        },
        "alt": [
          {
            "text": "كل الشقق هنا بنفس السعر تقريبا.",
            "gloss": {
              "en": "All the flats here are about the same price.",
              "ko": "여기 집들은 다 비슷한 가격이에요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "بشكل عام، معك حق، لكن الشقة لم يتم تجديدها منذ سنوات.",
        "gloss": {
          "en": "Generally speaking, you're right, but the flat hasn't been renovated in years.",
          "ko": "대체로 맞는 말씀인데, 이 집은 몇 년째 수리가 안 됐잖아요."
        },
        "frames": [
          "ar-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "وما السعر الذي تقترحه؟",
        "gloss": {
          "en": "And what price do you suggest?",
          "ko": "그럼 얼마를 제안하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "لو كان الإيجار أربعمئة وخمسين لوقعت العقد اليوم.",
        "gloss": {
          "en": "If the rent were four hundred and fifty, I'd sign the contract today.",
          "ko": "월세가 사백오십이면 오늘 바로 계약할게요."
        },
        "frames": [
          "ar-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "أربعمئة وخمسون صعب جدا. المالك لن يقبل.",
        "gloss": {
          "en": "Four hundred and fifty is very hard. The owner won't accept.",
          "ko": "사백오십은 너무 어려워요. 집주인이 안 받아들일 거예요."
        },
        "alt": [
          {
            "text": "صعب. ما رأيك في أربعمئة وثمانين؟",
            "gloss": {
              "en": "That's hard. How about four hundred and eighty?",
              "ko": "어렵네요. 사백팔십은 어떠세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "عن جد؟ من الآخر: أنا مستأجر هادئ، وأدفع دائما في الوقت.",
        "gloss": {
          "en": "Seriously? Bottom line: I'm a quiet tenant, and I always pay on time.",
          "ko": "정말요? 결론부터 말하면, 저는 조용한 세입자고 항상 제때 내요."
        }
      },
      {
        "who": "them",
        "text": "أفهم. ممكن أربعمئة وثمانين إذا دفعت ثلاثة أشهر مقدما.",
        "gloss": {
          "en": "I see. Four hundred and eighty is possible if you pay three months in advance.",
          "ko": "알겠어요. 석 달 치를 미리 내시면 사백팔십 가능해요."
        }
      },
      {
        "who": "me",
        "text": "ثلاثة أشهر؟ هذا كثير. في نفس الوقت، أفهم أن المالك يريد ضمانا.",
        "gloss": {
          "en": "Three months? That's a lot. At the same time, I understand the owner wants a guarantee.",
          "ko": "석 달이요? 많네요. 그래도 집주인이 보장을 원하는 건 이해해요."
        }
      },
      {
        "who": "them",
        "text": "إذن ما اقتراحك؟",
        "gloss": {
          "en": "So what do you propose?",
          "ko": "그럼 어떻게 하시겠어요?"
        },
        "alt": [
          {
            "text": "طيب، كيف نحل المشكلة؟",
            "gloss": {
              "en": "OK, how do we solve this?",
              "ko": "좋아요, 어떻게 해결할까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "نتفق على أربعمئة وسبعين، وأدفع شهرين مقدما. وما عندي مانع من عقد لسنتين.",
        "gloss": {
          "en": "Let's agree on four hundred and seventy, and I'll pay two months in advance. And I don't mind a two-year contract.",
          "ko": "사백칠십으로 하고 두 달 치를 미리 낼게요. 2년 계약도 괜찮아요."
        },
        "frames": [
          "ar-f4-14"
        ]
      },
      {
        "who": "them",
        "text": "سأتصل بالمالك وأخبرك. أظن أنه سيوافق.",
        "gloss": {
          "en": "I'll call the owner and let you know. I think he'll agree.",
          "ko": "집주인한테 전화해 보고 알려 드릴게요. 동의하실 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "على كل حال، شكرا لك. ربما أزور شقة أخرى اليوم، لكن هذه هي الأفضل.",
        "gloss": {
          "en": "Anyway, thank you. I might see another flat today, but this one is the best.",
          "ko": "어쨌든 감사해요. 오늘 다른 집도 볼지 모르지만, 여기가 제일 좋아요."
        },
        "frames": [
          "ar-f4-07"
        ]
      }
    ]
  },
  {
    "id": "ar-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "A lunchtime debate with colleagues about working from home",
      "ko": "점심시간에 동료들과 재택근무 토론하기"
    },
    "expressions": [
      "لا أختلف معك",
      "ليس بالضرورة",
      "نقطة مهمة",
      "هذا يعتمد على",
      "باختصار",
      "بالإضافة إلى ذلك"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "أنا أرى أن العمل عن بعد أفضل للجميع.",
        "gloss": {
          "en": "I think remote work is better for everyone.",
          "ko": "나는 재택근무가 모두에게 더 낫다고 봐."
        },
        "alt": [
          {
            "text": "صراحة، لا أريد أن أرجع إلى المكتب أبدا.",
            "gloss": {
              "en": "Honestly, I never want to go back to the office.",
              "ko": "솔직히 사무실로 절대 돌아가고 싶지 않아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "لا أختلف معك. العمل عن بعد يوفر وقتا كثيرا.",
        "gloss": {
          "en": "I don't disagree with you. Remote work saves a lot of time.",
          "ko": "네 말에 반대하진 않아. 재택근무는 시간을 많이 아껴 줘."
        },
        "frames": [
          "ar-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "بالضبط! والإنتاجية أعلى في البيت.",
        "gloss": {
          "en": "Exactly! And productivity is higher at home.",
          "ko": "바로 그거야! 그리고 집에서 생산성이 더 높아."
        }
      },
      {
        "who": "me",
        "text": "ليس بالضرورة. يقال إن بعض الفرق تفقد التواصل مع الوقت.",
        "gloss": {
          "en": "Not necessarily. It's said some teams lose touch over time.",
          "ko": "꼭 그렇진 않아. 시간이 지나면 소통이 끊기는 팀도 있다고 하더라."
        },
        "frames": [
          "ar-f4-12",
          "ar-f4-18"
        ]
      },
      {
        "who": "them",
        "text": "لكن الاجتماعات عبر الإنترنت سهلة.",
        "gloss": {
          "en": "But online meetings are easy.",
          "ko": "하지만 온라인 회의는 쉽잖아."
        },
        "alt": [
          {
            "text": "هذا ممكن، لكن عندنا أدوات كثيرة للتواصل.",
            "gloss": {
              "en": "That's possible, but we have lots of tools for staying in touch.",
              "ko": "그럴 수도 있지만, 소통 도구가 많잖아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "صحيح، لكن كلما قلت اللقاءات، ضعفت العلاقة بين الزملاء.",
        "gloss": {
          "en": "True, but the fewer the meetings, the weaker the bond between colleagues.",
          "ko": "맞아, 그래도 만남이 줄수록 동료 사이가 멀어져."
        },
        "frames": [
          "ar-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "وماذا عن الموظفين الذين يسكنون بعيدا؟",
        "gloss": {
          "en": "And what about employees who live far away?",
          "ko": "그럼 멀리 사는 직원들은?"
        }
      },
      {
        "who": "me",
        "text": "نقطة مهمة. بالنسبة لهم، قد يكون العمل من البيت هو الحل الأفضل.",
        "gloss": {
          "en": "Good point. For them, working from home might be the best solution.",
          "ko": "중요한 지적이야. 그 사람들한테는 재택이 최선일 수도 있어."
        }
      },
      {
        "who": "them",
        "text": "إذن أنت مع العمل عن بعد أم ضده؟",
        "gloss": {
          "en": "So are you for remote work or against it?",
          "ko": "그래서 너는 재택 찬성이야, 반대야?"
        },
        "alt": [
          {
            "text": "يعني ما موقفك في النهاية؟",
            "gloss": {
              "en": "So what's your position in the end?",
              "ko": "그래서 결국 네 입장은 뭐야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "هذا يعتمد على طبيعة العمل. أما أنا فأحب يومين في المكتب.",
        "gloss": {
          "en": "That depends on the nature of the job. As for me, I like two days in the office.",
          "ko": "일의 성격에 따라 달라. 나는 사무실 이틀이 좋아."
        },
        "frames": [
          "ar-f4-13",
          "ar-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "يومان فقط؟ المدير يريد أربعة.",
        "gloss": {
          "en": "Only two days? The manager wants four.",
          "ko": "이틀만? 부장님은 나흘을 원하셔."
        }
      },
      {
        "who": "me",
        "text": "مع أن المدير يريد أربعة، أظن أن ثلاثة أيام حل وسط معقول.",
        "gloss": {
          "en": "Although the manager wants four, I think three days is a reasonable compromise.",
          "ko": "부장님은 나흘을 원하시지만, 사흘이 적당한 절충안 같아."
        },
        "frames": [
          "ar-f4-03",
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "ممكن. لكن من سيقنعه؟",
        "gloss": {
          "en": "Maybe. But who's going to convince him?",
          "ko": "그럴 수도. 근데 누가 설득해?"
        }
      },
      {
        "who": "me",
        "text": "باختصار، نكتب له اقتراحا مشتركا. بالإضافة إلى ذلك، نجرب الفكرة لشهرين.",
        "gloss": {
          "en": "In short, we write him a joint proposal. On top of that, we trial the idea for two months.",
          "ko": "요컨대 같이 제안서를 쓰자. 그리고 두 달 동안 시범으로 해 보고."
        },
        "frames": [
          "ar-f4-16",
          "ar-f4-09"
        ]
      }
    ]
  },
  {
    "id": "ar-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Discussing a podcast episode about sleep with a friend",
      "ko": "친구와 수면에 관한 팟캐스트 한 회 이야기하기"
    },
    "expressions": [
      "بشكل عام",
      "عن جد",
      "في الواقع",
      "ما يمشي الحال",
      "أفهم وجهة نظرك",
      "بالإضافة إلى ذلك",
      "خلاص اتفقنا",
      "على كل حال",
      "ما عندي مانع"
    ],
    "grammar": [
      1,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "هل سمعت الحلقة الجديدة من البودكاست عن النوم؟",
        "gloss": {
          "en": "Have you heard the new podcast episode about sleep?",
          "ko": "수면에 관한 팟캐스트 새 회 들었어?"
        }
      },
      {
        "who": "me",
        "text": "نعم، سمعتها في الطريق إلى العمل. بشكل عام، كانت مفيدة جدا.",
        "gloss": {
          "en": "Yes, I listened to it on the way to work. Overall, it was really useful.",
          "ko": "응, 출근길에 들었어. 전반적으로 정말 유익했어."
        }
      },
      {
        "who": "them",
        "text": "الضيف قال إن قلة النوم أخطر من التدخين!",
        "gloss": {
          "en": "The guest said lack of sleep is more dangerous than smoking!",
          "ko": "게스트가 수면 부족이 흡연보다 위험하다고 했잖아!"
        },
        "alt": [
          {
            "text": "هل صدقت ما قاله الضيف عن النوم والتدخين؟",
            "gloss": {
              "en": "Did you believe what the guest said about sleep and smoking?",
              "ko": "게스트가 수면이랑 흡연에 대해 한 말 믿었어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "عن جد، هذا مبالغ فيه قليلا. لكن السهر يؤثر على كل شيء.",
        "gloss": {
          "en": "Honestly, that's a bit exaggerated. But staying up late affects everything.",
          "ko": "진짜, 그건 좀 과장이야. 그래도 밤샘은 모든 것에 영향을 줘."
        }
      },
      {
        "who": "them",
        "text": "أنا أنام خمس ساعات فقط، وأنا بخير.",
        "gloss": {
          "en": "I only sleep five hours, and I'm fine.",
          "ko": "나는 다섯 시간만 자는데 멀쩡해."
        }
      },
      {
        "who": "me",
        "text": "في الواقع، قد تشعر أنك بخير، لكن جسمك يتعب. ما يمشي الحال هكذا.",
        "gloss": {
          "en": "Actually, you might feel fine, but your body gets worn out. It can't go on like this.",
          "ko": "사실 괜찮다고 느낄 수는 있지만 몸은 지쳐. 이대로는 안 돼."
        },
        "frames": [
          "ar-f4-17"
        ]
      },
      {
        "who": "them",
        "text": "طيب يا دكتور! وماذا نصح الضيف؟",
        "gloss": {
          "en": "OK, doctor! And what did the guest recommend?",
          "ko": "알았어, 의사 선생님! 게스트는 뭘 권했어?"
        },
        "alt": [
          {
            "text": "طيب، وما الحل حسب البودكاست؟",
            "gloss": {
              "en": "OK, and what's the solution according to the podcast?",
              "ko": "알았어, 팟캐스트에선 해결책이 뭐래?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "قال إنه كلما ابتعدنا عن الهاتف قبل النوم، نمنا أفضل.",
        "gloss": {
          "en": "He said the further we keep from our phones before bed, the better we sleep.",
          "ko": "자기 전에 휴대폰을 멀리할수록 더 잘 잔대."
        },
        "frames": [
          "ar-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "مستحيل! الهاتف هو آخر شيء أنظر إليه كل ليلة.",
        "gloss": {
          "en": "Impossible! My phone is the last thing I look at every night.",
          "ko": "말도 안 돼! 매일 밤 마지막으로 보는 게 휴대폰인데."
        }
      },
      {
        "who": "me",
        "text": "أفهم وجهة نظرك، أنا مثلك تماما. لو تركته في المطبخ لنمت أسرع.",
        "gloss": {
          "en": "I understand your point of view, I'm exactly the same. If I left it in the kitchen, I'd fall asleep faster.",
          "ko": "네 말 이해해, 나도 똑같아. 부엌에 두면 더 빨리 잠들 텐데."
        },
        "frames": [
          "ar-f4-11",
          "ar-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "فكرة. وماذا قال عن القهوة؟",
        "gloss": {
          "en": "That's an idea. And what did he say about coffee?",
          "ko": "그것도 방법이네. 커피에 대해선 뭐래?"
        }
      },
      {
        "who": "me",
        "text": "قال إن القهوة بعد العصر قد تؤخر النوم. بالإضافة إلى ذلك، نصح بالمشي كل يوم.",
        "gloss": {
          "en": "He said coffee after late afternoon can delay sleep. On top of that, he recommended walking every day.",
          "ko": "늦은 오후 이후 커피는 잠을 늦출 수 있대. 그리고 매일 걸으라고 했어."
        },
        "frames": [
          "ar-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "إذن نجرب معا لمدة أسبوع؟ بدون هاتف في الليل؟",
        "gloss": {
          "en": "So shall we try it together for a week? No phone at night?",
          "ko": "그럼 일주일 같이 해 볼까? 밤에 휴대폰 없이?"
        }
      },
      {
        "who": "me",
        "text": "خلاص اتفقنا. على كل حال، ما عندي مانع من نوم أطول!",
        "gloss": {
          "en": "Deal. Anyway, I've got nothing against more sleep!",
          "ko": "좋아, 그렇게 하자. 어쨌든 더 오래 자는 건 대환영이야!"
        }
      }
    ]
  },
  {
    "id": "ar-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "The farewell party for your colleague Layla, who is leaving for a new job",
      "ko": "새 직장으로 떠나는 동료 레일라의 송별회"
    },
    "goal": {
      "en": "Give a warm, witty toast that thanks Layla and wishes her well in her new job",
      "ko": "레일라에게 고마움을 전하고 새 직장에서 잘되길 비는 따뜻하고 재치 있는 송별사를 한다"
    },
    "expressions": [
      "لا يسعني إلا",
      "من القلب",
      "لا يخفى على أحد",
      "إن جاز التعبير",
      "رب ضارة نافعة"
    ],
    "grammar": [
      0,
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
        "text": "يا جماعة، لحظة من فضلكم! الكلمة الآن لزميلنا. تفضل!",
        "gloss": {
          "en": "Everyone, a moment please! Our colleague has the floor now. Go ahead!",
          "ko": "여러분, 잠시만요! 이제 동료 한 분이 한마디 하겠습니다. 하세요!"
        }
      },
      {
        "who": "me",
        "text": "شكرا. لقد عملت مع ليلى خمس سنوات، ولا يسعني إلا أن أقول: شكرا من القلب.",
        "gloss": {
          "en": "Thank you. I've worked with Layla for five years, and all I can say is: thank you from the bottom of my heart.",
          "ko": "고마워요. 레일라와 5년을 함께 일했는데, 진심으로 고맙다는 말밖에 할 수 없네요."
        },
        "frames": [
          "ar-f5-01",
          "ar-f5-03"
        ]
      },
      {
        "who": "them",
        "text": "الله! كلام جميل!",
        "gloss": {
          "en": "Oh, beautifully said!",
          "ko": "와, 멋진 말이다!"
        }
      },
      {
        "who": "me",
        "text": "لا يخفى على أحد أن ليلى كانت قلب هذا الفريق، إن جاز التعبير.",
        "gloss": {
          "en": "It's no secret to anyone that Layla was the heart of this team, if I may put it that way.",
          "ko": "이렇게 말해도 될지 모르겠지만, 레일라가 이 팀의 심장이었다는 건 다들 아는 사실이죠."
        },
        "frames": [
          "ar-f5-11",
          "ar-f5-15"
        ]
      },
      {
        "who": "them",
        "text": "صحيح! ومن غيرها كان يحضر الكعك كل خميس؟",
        "gloss": {
          "en": "So true! And who else brought cake every Thursday?",
          "ko": "맞아! 매주 목요일 케이크를 누가 가져왔겠어?"
        }
      },
      {
        "who": "me",
        "text": "بالضبط! ومن منا لم يطلب منها المساعدة في آخر لحظة؟",
        "gloss": {
          "en": "Exactly! And which of us hasn't asked her for help at the last minute?",
          "ko": "그러니까요! 우리 중에 마지막 순간에 레일라한테 도움 안 청한 사람 있어요?"
        },
        "frames": [
          "ar-f5-13"
        ]
      },
      {
        "who": "them",
        "text": "أنا! كل يوم تقريبا!",
        "gloss": {
          "en": "Me! Almost every day!",
          "ko": "저요! 거의 매일!"
        }
      },
      {
        "who": "me",
        "text": "لقد تغير مكتبنا بفضلها تغيرا كبيرا. صار أكثر هدوءا، وأكثر حلاوة أيضا!",
        "gloss": {
          "en": "Our office changed enormously thanks to her. It got calmer, and sweeter too!",
          "ko": "레일라 덕분에 사무실이 정말 많이 바뀌었어요. 더 차분해지고, 더 달콤해졌죠!"
        },
        "frames": [
          "ar-f5-01",
          "ar-f5-06"
        ]
      },
      {
        "who": "them",
        "text": "وماذا ستفعلون بدونها؟",
        "gloss": {
          "en": "And what will you all do without her?",
          "ko": "레일라 없이 어떻게들 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "بصراحة يعني، لا أعرف. يبدو أن اجتماعاتنا ستكون أطول وأقل متعة.",
        "gloss": {
          "en": "Honestly, I really don't know. It looks like our meetings will be longer and less fun.",
          "ko": "솔직히, 모르겠어요. 회의가 더 길고 재미없어질 것 같네요."
        },
        "frames": [
          "ar-f5-14",
          "ar-f5-10"
        ]
      },
      {
        "who": "them",
        "text": "يا جماعة، ستجعلونني أبكي!",
        "gloss": {
          "en": "Guys, you're going to make me cry!",
          "ko": "여러분, 저 울겠어요!"
        }
      },
      {
        "who": "me",
        "text": "لا تبكي يا ليلى، رب ضارة نافعة: الشركة الجديدة محظوظة بك.",
        "gloss": {
          "en": "Don't cry, Layla, every cloud has a silver lining: the new company is lucky to have you.",
          "ko": "울지 마요, 레일라. 전화위복이에요. 새 회사는 운이 좋네요."
        },
        "frames": [
          "ar-f5-19"
        ]
      },
      {
        "who": "them",
        "text": "شكرا لكم، والله سأشتاق إليكم كثيرا.",
        "gloss": {
          "en": "Thank you all, I truly will miss you so much.",
          "ko": "고마워요, 정말 많이 보고 싶을 거예요."
        }
      },
      {
        "who": "me",
        "text": "ونحن أيضا. بارك الله فيك، ووفقك في عملك الجديد.",
        "gloss": {
          "en": "And we'll miss you. God bless you, and may He grant you success in your new job.",
          "ko": "우리도요. 늘 복 받고, 새 직장에서 잘되길 빌어요."
        },
        "frames": [
          "ar-f5-09"
        ]
      },
      {
        "who": "them",
        "text": "آمين! وإذا احتجتم أي شيء، أنا هنا.",
        "gloss": {
          "en": "Amen! And if you ever need anything, I'm here.",
          "ko": "아멘! 필요한 거 있으면 언제든 연락해요."
        }
      },
      {
        "who": "me",
        "text": "إذن، ارفعوا أكوابكم: إلى ليلى، وإلى نجاح لا حدود له!",
        "gloss": {
          "en": "So, raise your cups: to Layla, and to boundless success!",
          "ko": "자, 잔을 드세요. 레일라를 위해, 그리고 끝없는 성공을 위해!"
        }
      }
    ]
  },
  {
    "id": "ar-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Visiting your friend Khaled's family after his father has died",
      "ko": "친구 칼리드의 아버지가 돌아가셔서 조문 가기"
    },
    "goal": {
      "en": "Offer condolences with the proper formal words and offer your friend concrete help",
      "ko": "알맞은 격식 있는 말로 조의를 표하고 친구에게 구체적인 도움을 건넨다"
    },
    "expressions": [
      "البقية في حياتك",
      "عظم الله أجركم",
      "الصبر مفتاح الفرج",
      "على العين والراس"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "earlierGrammar": [
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا بك يا ابني، تفضل.",
        "gloss": {
          "en": "Welcome, son, come in.",
          "ko": "어서 오게, 들어오게."
        }
      },
      {
        "who": "me",
        "text": "السلام عليكم يا عمي. البقية في حياتك، عظم الله أجركم.",
        "gloss": {
          "en": "Peace be upon you, uncle. My condolences; may God reward your patience.",
          "ko": "안녕하세요, 아버님. 삼가 고인의 명복을 빕니다."
        }
      },
      {
        "who": "them",
        "text": "وعليكم السلام. شكر الله سعيك.",
        "gloss": {
          "en": "And upon you peace. May God reward your coming.",
          "ko": "고맙네. 와 줘서 고맙네."
        }
      },
      {
        "who": "me",
        "text": "رحمه الله وأسكنه فسيح جناته. لقد كان رجلا طيبا جدا.",
        "gloss": {
          "en": "May God have mercy on him and grant him paradise. He was a truly good man.",
          "ko": "고인께서 편히 잠드시길 빕니다. 정말 좋은 분이셨어요."
        },
        "frames": [
          "ar-f5-08",
          "ar-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "نعم، كان يحبك كثيرا، وكان يسأل عنك دائما.",
        "gloss": {
          "en": "Yes, he was very fond of you, and he always asked after you.",
          "ko": "그래, 자네를 정말 아꼈지. 늘 자네 안부를 물었어."
        }
      },
      {
        "who": "me",
        "text": "وأنا كنت أحبه حبا كبيرا. ما زلت أتذكر قصصه عن البحر.",
        "gloss": {
          "en": "And I loved him dearly. I still remember his stories about the sea.",
          "ko": "저도 정말 좋아했어요. 바다 이야기를 해 주시던 게 아직도 기억나요."
        },
        "frames": [
          "ar-f5-07"
        ]
      },
      {
        "who": "them",
        "text": "الحمد لله على كل حال. كان مريضا منذ مدة.",
        "gloss": {
          "en": "Praise be to God in every circumstance. He'd been ill for some time.",
          "ko": "어쩌겠나. 한동안 아프셨네."
        }
      },
      {
        "who": "me",
        "text": "الصبر مفتاح الفرج يا عمي، والله معكم.",
        "gloss": {
          "en": "Patience brings relief in the end, uncle, and God is with you.",
          "ko": "아버님, 힘내세요. 하느님이 함께하실 거예요."
        }
      },
      {
        "who": "them",
        "text": "شكرا لأنك جئت. لم أتوقع أن تأتي من بعيد.",
        "gloss": {
          "en": "Thanks for coming. I didn't expect you to come all that way.",
          "ko": "와 줘서 고마워. 멀리서 올 줄은 몰랐어."
        }
      },
      {
        "who": "me",
        "text": "كيف لا آتي؟ أنت أخي يا خالد.",
        "gloss": {
          "en": "How could I not come? You're my brother, Khaled.",
          "ko": "내가 어떻게 안 와? 넌 내 형제야, 칼리드."
        }
      },
      {
        "who": "them",
        "text": "لا أعرف ماذا أفعل الآن. الأوراق والترتيبات كثيرة.",
        "gloss": {
          "en": "I don't know what to do now. There's so much paperwork and so many arrangements.",
          "ko": "이제 뭘 해야 할지 모르겠어. 서류랑 준비할 게 너무 많아."
        }
      },
      {
        "who": "me",
        "text": "لا تحمل هم شيء. أي شيء تحتاجه، على العين والراس.",
        "gloss": {
          "en": "Don't worry about a thing. Anything you need, consider it done.",
          "ko": "아무 걱정 마. 필요한 건 뭐든 기꺼이 할게."
        },
        "frames": [
          "ar-f5-20"
        ]
      },
      {
        "who": "them",
        "text": "أنت دائما هكذا. لكن لا أريد أن أتعبك.",
        "gloss": {
          "en": "You're always like this. But I don't want to put you out.",
          "ko": "넌 늘 이렇다니까. 그래도 너 힘들게 하고 싶지 않아."
        }
      },
      {
        "who": "me",
        "text": "أي تعب؟ غدا صباحا أمر عليك ونذهب معا إلى البلدية.",
        "gloss": {
          "en": "What trouble? Tomorrow morning I'll come by and we'll go to the municipality together.",
          "ko": "힘들긴 뭐가 힘들어? 내일 아침에 들를 테니 같이 구청에 가자."
        }
      },
      {
        "who": "them",
        "text": "الله يجزيك الخير.",
        "gloss": {
          "en": "May God reward you.",
          "ko": "정말 고마워."
        }
      },
      {
        "who": "me",
        "text": "وإياك. لم أفعل شيئا إلا الواجب.",
        "gloss": {
          "en": "And you. I've done nothing but my duty.",
          "ko": "별말을. 당연한 일을 하는 것뿐이야."
        },
        "frames": [
          "ar-f5-04"
        ]
      }
    ]
  },
  {
    "id": "ar-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "A guest on a public panel discussion about language and identity",
      "ko": "언어와 정체성에 관한 공개 토론회에 초대 손님으로"
    },
    "goal": {
      "en": "Argue a nuanced view on language and identity and handle an awkward personal question with humour",
      "ko": "언어와 정체성에 대해 균형 잡힌 의견을 펴고, 곤란한 개인 질문은 유머로 넘긴다"
    },
    "expressions": [
      "مش هيك القصد",
      "لا يخفى على أحد",
      "العين بصيرة واليد قصيرة",
      "إن جاز التعبير",
      "بالمختصر المفيد"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "4:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "نرحب بضيفنا. سؤالي الأول: هل اللغة جزء أساسي من الهوية؟",
        "gloss": {
          "en": "We welcome our guest. My first question: is language a fundamental part of identity?",
          "ko": "손님을 환영합니다. 첫 질문입니다. 언어는 정체성의 핵심일까요?"
        }
      },
      {
        "who": "me",
        "text": "شكرا على الدعوة. إن اللغة ليست مجرد أداة، بل هي طريقة نرى بها العالم.",
        "gloss": {
          "en": "Thank you for the invitation. Language is not merely a tool; it is a way through which we see the world.",
          "ko": "초대해 주셔서 감사합니다. 언어는 단순한 도구가 아니라 세상을 보는 방식입니다."
        },
        "frames": [
          "ar-f5-02"
        ]
      },
      {
        "who": "them",
        "text": "لكن كثيرا من الشباب اليوم يفضلون الإنجليزية. أليس هذا خطرا؟",
        "gloss": {
          "en": "But many young people today prefer English. Isn't that a danger?",
          "ko": "하지만 요즘 많은 젊은이가 영어를 선호합니다. 위험하지 않을까요?"
        }
      },
      {
        "who": "me",
        "text": "يبدو أن الأمر أعقد مما نظن. الشباب لا يتركون لغتهم، بل يضيفون إليها.",
        "gloss": {
          "en": "It seems the matter is more complex than we think. Young people aren't abandoning their language; they're adding to it.",
          "ko": "생각보다 복잡한 문제 같습니다. 젊은이들은 자기 언어를 버리는 게 아니라 거기에 더하고 있어요."
        },
        "frames": [
          "ar-f5-10"
        ]
      },
      {
        "who": "them",
        "text": "هل تقصد أن خلط اللغات شيء إيجابي؟",
        "gloss": {
          "en": "Do you mean that mixing languages is a positive thing?",
          "ko": "언어를 섞는 게 긍정적이라는 뜻인가요?"
        }
      },
      {
        "who": "me",
        "text": "مش هيك القصد تماما. أقصد أن الخلط طبيعي، ومن منا لا يخلط أحيانا؟",
        "gloss": {
          "en": "That's not quite what I mean. I mean mixing is natural, and which of us doesn't mix sometimes?",
          "ko": "꼭 그런 뜻은 아닙니다. 섞는 건 자연스럽다는 거죠. 우리 중에 가끔 안 섞는 사람이 있나요?"
        },
        "frames": [
          "ar-f5-17",
          "ar-f5-13"
        ]
      },
      {
        "who": "them",
        "text": "أنا معلمة، وأرى أن طلابي لا يستطيعون كتابة فقرة بالفصحى!",
        "gloss": {
          "en": "I'm a teacher, and I see my students can't write a paragraph in Standard Arabic!",
          "ko": "저는 교사인데, 학생들이 표준어로 한 문단도 못 써요!"
        }
      },
      {
        "who": "me",
        "text": "لا يخفى على أحد أن هذه مشكلة حقيقية. العين بصيرة واليد قصيرة: المدارس تحتاج إلى دعم أكبر.",
        "gloss": {
          "en": "It's no secret this is a real problem. We see it clearly, but our hands are tied: schools need more support.",
          "ko": "이게 실제 문제라는 건 다 압니다. 알면서도 손쓸 수가 없는 거죠. 학교에 지원이 더 필요해요."
        },
        "frames": [
          "ar-f5-11"
        ]
      },
      {
        "who": "them",
        "text": "هل التكنولوجيا هي السبب؟",
        "gloss": {
          "en": "Is technology the cause?",
          "ko": "기술이 원인일까요?"
        }
      },
      {
        "who": "me",
        "text": "لا أظن أنها السبب الوحيد. التكنولوجيا غيرت طريقة كلامنا تغييرا جذريا، لكنها قد تساعدنا أيضا.",
        "gloss": {
          "en": "I don't think it's the only cause. Technology has radically changed the way we speak, but it may help us too.",
          "ko": "유일한 원인은 아니라고 봅니다. 기술이 우리 말투를 근본적으로 바꿨지만, 도움이 될 수도 있어요."
        }
      },
      {
        "who": "them",
        "text": "سؤال صعب الآن: هل تتكلم الفصحى في بيتك؟",
        "gloss": {
          "en": "A hard question now: do you speak Standard Arabic at home?",
          "ko": "이제 어려운 질문입니다. 집에서 표준어를 쓰시나요?"
        }
      },
      {
        "who": "me",
        "text": "سؤال محرج، إن جاز التعبير! بصراحة يعني، في البيت لا أتكلم إلا العامية.",
        "gloss": {
          "en": "An awkward question, if I may say so! Honestly, at home I speak nothing but dialect.",
          "ko": "곤란한 질문이네요! 솔직히 말하면 집에서는 사투리만 써요."
        },
        "frames": [
          "ar-f5-15",
          "ar-f5-14",
          "ar-f5-04"
        ]
      },
      {
        "who": "them",
        "text": "أليس هذا تناقضا؟",
        "gloss": {
          "en": "Isn't that a contradiction?",
          "ko": "모순 아닌가요?"
        }
      },
      {
        "who": "me",
        "text": "ليس تناقضا، بل هو الواقع. لكل لغة مكانها، أليس كذلك؟",
        "gloss": {
          "en": "It's not a contradiction; it's reality. Every language has its place, doesn't it?",
          "ko": "모순이 아니라 현실입니다. 언어마다 제자리가 있잖아요, 그렇지 않나요?"
        },
        "frames": [
          "ar-f5-12"
        ]
      },
      {
        "who": "them",
        "text": "نقطة جميلة. كلمة أخيرة للجمهور؟",
        "gloss": {
          "en": "A nice point. A final word for the audience?",
          "ko": "좋은 지적입니다. 청중께 마지막 한마디?"
        }
      },
      {
        "who": "me",
        "text": "بالمختصر المفيد: احموا لغتكم بحبها، لا بالخوف عليها.",
        "gloss": {
          "en": "In a nutshell: protect your language by loving it, not by fearing for it.",
          "ko": "한마디로, 언어를 걱정이 아니라 사랑으로 지키세요."
        }
      }
    ]
  },
  {
    "id": "ar-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "An evening out with old friends when Tarek, who hasn't been around for months, finally shows up",
      "ko": "몇 달째 안 보이던 타레크가 드디어 나타난 친구들과의 저녁 자리"
    },
    "goal": {
      "en": "Tease an old friend playfully, then smooth things over when a joke lands badly",
      "ko": "오랜 친구를 장난스럽게 놀리다가, 농담이 지나치면 자연스럽게 수습한다"
    },
    "expressions": [
      "يا سلام",
      "ما شفناك من زمان",
      "مش هيك القصد",
      "لا تاخذها على خاطرك",
      "حط نفسك مكاني",
      "اللي فات مات",
      "كلامك على راسي",
      "خليها على الله"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير يا شباب! آسف على التأخير.",
        "gloss": {
          "en": "Evening, guys! Sorry I'm late.",
          "ko": "안녕, 얘들아! 늦어서 미안."
        }
      },
      {
        "who": "me",
        "text": "يا سلام! ما شفناك من زمان! ظننا أنك هاجرت.",
        "gloss": {
          "en": "Well, look who it is! Haven't seen you in ages! We thought you'd emigrated.",
          "ko": "이게 누구야! 진짜 오랜만이다! 이민 간 줄 알았잖아."
        }
      },
      {
        "who": "them",
        "text": "كنت مشغولا جدا بالعمل الجديد، والله.",
        "gloss": {
          "en": "I've been really busy with the new job, I swear.",
          "ko": "새 직장 때문에 진짜 바빴어."
        }
      },
      {
        "who": "me",
        "text": "العمل الجديد؟ أم الطبخ؟ يبدو أن وزنك زاد قليلا!",
        "gloss": {
          "en": "The new job? Or the cooking? Looks like you've put on a bit of weight!",
          "ko": "새 직장? 아니면 요리? 살 좀 찐 것 같은데!"
        },
        "frames": [
          "ar-f5-10"
        ]
      },
      {
        "who": "them",
        "text": "عن جد؟ يعني أنا سمين الآن؟",
        "gloss": {
          "en": "Seriously? So I'm fat now?",
          "ko": "진짜? 그러니까 나 뚱뚱하다는 거야?"
        }
      },
      {
        "who": "me",
        "text": "لا لا، مش هيك القصد! كنت أمزح. لا تاخذها على خاطرك.",
        "gloss": {
          "en": "No, no, that's not what I meant! I was joking. Don't take it to heart.",
          "ko": "아니아니, 그런 뜻 아니야! 농담이었어. 마음에 담아 두지 마."
        },
        "frames": [
          "ar-f5-17",
          "ar-f5-18"
        ]
      },
      {
        "who": "them",
        "text": "ماشي، سامحتك هذه المرة. لكن أنت أيضا: كم مرة رسبت في امتحان القيادة؟",
        "gloss": {
          "en": "Fine, I'll let it go this time. But what about you: how many times did you fail your driving test?",
          "ko": "알았어, 이번엔 봐줄게. 근데 너도, 운전면허 시험 몇 번 떨어졌더라?"
        }
      },
      {
        "who": "me",
        "text": "ثلاث مرات فقط! ومن منا لم يرسب مرة أو مرتين؟",
        "gloss": {
          "en": "Only three times! And which of us hasn't failed once or twice?",
          "ko": "세 번뿐이야! 한두 번 안 떨어진 사람이 어딨어?"
        },
        "frames": [
          "ar-f5-13"
        ]
      },
      {
        "who": "them",
        "text": "مرة أو مرتين، نعم. لكن ثلاث مرات؟",
        "gloss": {
          "en": "Once or twice, sure. But three times?",
          "ko": "한두 번은 그렇지. 근데 세 번?"
        }
      },
      {
        "who": "me",
        "text": "حط نفسك مكاني: الفاحص كان يصرخ صراخا متواصلا!",
        "gloss": {
          "en": "Put yourself in my shoes: the examiner was shouting non-stop!",
          "ko": "내 입장이 돼 봐. 감독관이 쉬지 않고 소리를 질렀다니까!"
        },
        "frames": [
          "ar-f5-16"
        ]
      },
      {
        "who": "them",
        "text": "طيب، والمرة الرابعة؟",
        "gloss": {
          "en": "OK, and the fourth time?",
          "ko": "그래서 네 번째는?"
        }
      },
      {
        "who": "me",
        "text": "لقد نجحت، والحمد لله! اللي فات مات.",
        "gloss": {
          "en": "I passed, thank God! What's done is done.",
          "ko": "붙었지, 다행히! 지난 일은 지난 일이야."
        },
        "frames": [
          "ar-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "مبروك يا بطل! لكن لن أركب معك أبدا.",
        "gloss": {
          "en": "Congrats, champ! But I'm never getting in a car with you.",
          "ko": "축하해, 영웅! 근데 너랑은 절대 차 안 탈 거야."
        }
      },
      {
        "who": "me",
        "text": "كلامك على راسي... لكنك ستحتاجني عندما تتعطل سيارتك!",
        "gloss": {
          "en": "Fair enough... but you'll need me when your car breaks down!",
          "ko": "네 말 명심할게... 근데 네 차 고장 나면 나 찾게 될걸!"
        }
      },
      {
        "who": "them",
        "text": "معك حق، معك حق. طيب، من سيدفع ثمن العشاء الليلة؟",
        "gloss": {
          "en": "You're right, you're right. OK, who's paying for dinner tonight?",
          "ko": "맞네, 맞아. 좋아, 오늘 저녁은 누가 사?"
        }
      },
      {
        "who": "me",
        "text": "طبعا الذي تأخر! وإذا لم تكن معك نقود، خليها على الله.",
        "gloss": {
          "en": "The one who was late, of course! And if you've got no cash on you, we'll leave it in God's hands.",
          "ko": "당연히 늦게 온 사람이지! 돈 없으면 뭐, 운에 맡기자."
        }
      }
    ]
  },
  {
    "id": "ar-5-x1",
    "stage": 5,
    "setting": {
      "en": "Exchanging Eid greetings with your neighbour",
      "ko": "이웃과 명절 인사 나누기"
    },
    "expressions": [
      "كل عام وأنتم بخير",
      "يا سلام",
      "العين بصيرة واليد قصيرة",
      "خليها على الله"
    ],
    "grammar": [
      0,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "كل عام وأنتم بخير يا جاري!",
        "gloss": {
          "en": "Happy Eid, neighbour!",
          "ko": "명절 잘 보내요, 이웃님!"
        }
      },
      {
        "who": "me",
        "text": "وأنتم بخير وصحة! كل عام وأنتم بخير، وعيد مبارك.",
        "gloss": {
          "en": "And to you, in good health! Many happy returns, and a blessed Eid.",
          "ko": "이웃님도요! 해마다 건강하시고, 복된 명절 되세요."
        }
      },
      {
        "who": "them",
        "text": "تفضل، هذه حلويات العيد من أمي.",
        "gloss": {
          "en": "Here, these are Eid sweets from my mother.",
          "ko": "여기요, 어머니가 만드신 명절 과자예요."
        }
      },
      {
        "who": "me",
        "text": "يا سلام! لقد تعبت أمك تعبا كبيرا. بارك الله فيها.",
        "gloss": {
          "en": "How lovely! Your mother went to so much trouble. God bless her.",
          "ko": "와! 어머님이 정말 많이 애쓰셨네요. 감사하다고 전해 주세요."
        },
        "frames": [
          "ar-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "وأنت، هل ستسافر إلى أهلك في العيد؟",
        "gloss": {
          "en": "And you, will you travel to your family for Eid?",
          "ko": "명절에 가족한테 가요?"
        }
      },
      {
        "who": "me",
        "text": "العين بصيرة واليد قصيرة: التذاكر غالية جدا. خليها على الله، ربما في الصيف.",
        "gloss": {
          "en": "I'd love to, but my hands are tied: tickets are very expensive. I'll leave it to God, maybe in summer.",
          "ko": "마음은 굴뚝같은데 형편이 안 돼요. 표가 너무 비싸서요. 어떻게 되겠죠, 여름에나."
        }
      }
    ]
  }
];
