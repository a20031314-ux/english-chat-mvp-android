import type { StageScript } from "../../stageScripts.ts";

/**
 * ar 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const AR_BANK: StageScript[] = [
  {
    "id": "ar-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter in Amman",
      "ko": "암만의 카페 계산대에서"
    },
    "expressions": [
      "مرحبا",
      "عفوا",
      "من فضلك",
      "طيب",
      "تفضل",
      "مع السلامة"
    ],
    "grammar": [
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "مرحبا! تفضل.",
        "gloss": {
          "en": "Hi! Go ahead.",
          "ko": "안녕하세요! 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا. أريد قهوة، من فضلك.",
        "gloss": {
          "en": "Hi. I'd like a coffee, please.",
          "ko": "안녕하세요. 커피 한 잔 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "قهوة عربية أم أمريكية؟",
        "gloss": {
          "en": "Arabic coffee or American?",
          "ko": "아랍 커피요, 아메리카노요?"
        }
      },
      {
        "who": "me",
        "text": "قهوة عربية. بكم القهوة؟",
        "gloss": {
          "en": "Arabic coffee. How much is the coffee?",
          "ko": "아랍 커피요. 커피 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "دينار واحد.",
        "gloss": {
          "en": "One dinar.",
          "ko": "일 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "طيب. عندي دينار. تفضل.",
        "gloss": {
          "en": "OK. I have a dinar. Here you go.",
          "ko": "네. 일 디나르 있어요. 여기요."
        },
        "frames": [
          "ar-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "شكرا.",
        "gloss": {
          "en": "Thanks.",
          "ko": "고마워요."
        }
      },
      {
        "who": "me",
        "text": "عفوا. مع السلامة.",
        "gloss": {
          "en": "You're welcome. Goodbye.",
          "ko": "별말씀을요. 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인할 때"
    },
    "expressions": [
      "مساء الخير",
      "شكرا",
      "تفضل"
    ],
    "grammar": [
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير، أهلا بك.",
        "gloss": {
          "en": "Good evening, welcome.",
          "ko": "안녕하세요, 어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. عندي حجز.",
        "gloss": {
          "en": "Good evening. I have a reservation.",
          "ko": "안녕하세요. 예약했어요."
        },
        "frames": [
          "ar-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "جواز السفر، من فضلك.",
        "gloss": {
          "en": "Your passport, please.",
          "ko": "여권 주세요."
        }
      },
      {
        "who": "me",
        "text": "تفضل. هذا جواز سفري.",
        "gloss": {
          "en": "Here you go. This is my passport.",
          "ko": "여기요. 제 여권이에요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "شكرا. غرفتك في الطابق الثاني.",
        "gloss": {
          "en": "Thanks. Your room is on the second floor.",
          "ko": "고마워요. 방은 이 층이에요."
        }
      },
      {
        "who": "me",
        "text": "أين المصعد؟",
        "gloss": {
          "en": "Where is the lift?",
          "ko": "엘리베이터는 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "هناك، على اليمين.",
        "gloss": {
          "en": "Over there, on the right.",
          "ko": "저기 오른쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا على المساعدة.",
        "gloss": {
          "en": "Thanks for the help.",
          "ko": "도와줘서 고마워요."
        },
        "frames": [
          "ar-f1-11"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way on a street in Cairo",
      "ko": "카이로 길에서 길 묻기"
    },
    "expressions": [
      "السلام عليكم",
      "شكرا",
      "من فضلك",
      "طيب",
      "لا أفهم",
      "شوي شوي",
      "مع السلامة"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "نعم؟ تفضل.",
        "gloss": {
          "en": "Yes? Can I help?",
          "ko": "네? 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "السلام عليكم. أين محطة المترو؟",
        "gloss": {
          "en": "Hello. Where is the metro station?",
          "ko": "안녕하세요. 지하철역이 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "وعليكم السلام. المحطة هناك، بعد الشارع الثاني، قريبة جدا.",
        "gloss": {
          "en": "Hello. The station is there, after the second street, very close.",
          "ko": "안녕하세요. 역은 저기, 두 번째 길 지나서 있어요. 아주 가까워요."
        }
      },
      {
        "who": "me",
        "text": "لا أفهم. شوي شوي، من فضلك.",
        "gloss": {
          "en": "I don't understand. Slowly, please.",
          "ko": "잘 모르겠어요. 천천히 말해 주세요."
        },
        "frames": [
          "ar-f1-12",
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "المحطة... هناك... قريبة.",
        "gloss": {
          "en": "The station... there... close.",
          "ko": "역은... 저기... 가까워요."
        }
      },
      {
        "who": "me",
        "text": "آه، شكرا! بكم التذكرة؟",
        "gloss": {
          "en": "Ah, thanks! How much is the ticket?",
          "ko": "아, 고마워요! 표는 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "لا أعرف، آسف.",
        "gloss": {
          "en": "I don't know, sorry.",
          "ko": "모르겠어요, 미안해요."
        }
      },
      {
        "who": "me",
        "text": "طيب، شكرا. مع السلامة.",
        "gloss": {
          "en": "OK, thanks. Goodbye.",
          "ko": "네, 고마워요. 안녕히 가세요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b04",
    "stage": 1,
    "bank": true,
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
    "setting": {
      "en": "Language exchange evening: meeting Layla",
      "ko": "언어 교환 모임에서 라일라와"
    },
    "expressions": [
      "تشرفنا"
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
        "text": "مرحبا! أنا ليلى. ما اسمك؟",
        "gloss": {
          "en": "Hi! I'm Layla. What's your name?",
          "ko": "안녕하세요! 저는 라일라예요. 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "اسمي جي وو. تشرفنا.",
        "gloss": {
          "en": "My name is Ji-woo. Nice to meet you.",
          "ko": "제 이름은 지우예요. 반가워요."
        },
        "frames": [
          "ar-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "تشرفنا! من أين أنت؟",
        "gloss": {
          "en": "Nice to meet you! Where are you from?",
          "ko": "반가워요! 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "أنا من كوريا. وأنتِ؟",
        "gloss": {
          "en": "I'm from Korea. And you?",
          "ko": "한국에서 왔어요. 당신은요?"
        },
        "frames": [
          "ar-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "أنا من لبنان. هل أنت طالب؟",
        "gloss": {
          "en": "I'm from Lebanon. Are you a student?",
          "ko": "저는 레바논에서 왔어요. 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "لا، أنا مهندس.",
        "gloss": {
          "en": "No, I'm an engineer.",
          "ko": "아니요, 엔지니어예요."
        },
        "frames": [
          "ar-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "جميل! ومن هذا؟",
        "gloss": {
          "en": "Nice! And who is this?",
          "ko": "좋네요! 이분은 누구예요?"
        }
      },
      {
        "who": "me",
        "text": "هذا صديقي. هو طبيب.",
        "gloss": {
          "en": "This is my friend. He's a doctor.",
          "ko": "제 친구예요. 의사예요."
        },
        "frames": [
          "ar-f1-14",
          "ar-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a pharmacy",
      "ko": "약국에서"
    },
    "expressions": [
      "مساء الخير",
      "شكرا",
      "من فضلك",
      "طيب",
      "بكم هذا",
      "مع السلامة"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير. تفضل.",
        "gloss": {
          "en": "Good evening. How can I help?",
          "ko": "안녕하세요. 뭘 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. عندك دواء للرأس؟",
        "gloss": {
          "en": "Good evening. Do you have something for a headache?",
          "ko": "안녕하세요. 두통약 있어요?"
        },
        "frames": [
          "ar-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "نعم. هذا دواء جيد.",
        "gloss": {
          "en": "Yes. This is a good medicine.",
          "ko": "네. 이 약이 좋아요."
        }
      },
      {
        "who": "me",
        "text": "بكم هذا؟",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "ثلاثة دنانير.",
        "gloss": {
          "en": "Three dinars.",
          "ko": "삼 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "طيب، أريد هذا، من فضلك.",
        "gloss": {
          "en": "OK, I'd like this one, please.",
          "ko": "네, 이걸로 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "تفضل. سلامتك.",
        "gloss": {
          "en": "Here you are. Get well soon.",
          "ko": "여기요. 빨리 나으세요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. مع السلامة.",
        "gloss": {
          "en": "Thanks. Goodbye.",
          "ko": "고마워요. 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call to find a friend",
      "ko": "친구를 찾으려고 전화할 때"
    },
    "expressions": [
      "مرحبا",
      "كيف حالك",
      "آسف",
      "نعم"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو؟",
        "gloss": {
          "en": "Hello?",
          "ko": "여보세요?"
        }
      },
      {
        "who": "me",
        "text": "مرحبا يا سامي، كيف حالك؟",
        "gloss": {
          "en": "Hi, Sami, how are you?",
          "ko": "안녕, 사미. 잘 지내요?"
        },
        "frames": [
          "ar-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "بخير والحمد لله. أين أنت؟",
        "gloss": {
          "en": "Fine, thank God. Where are you?",
          "ko": "잘 지내요. 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "أنا في المطعم.",
        "gloss": {
          "en": "I'm at the restaurant.",
          "ko": "식당에 있어요."
        },
        "frames": [
          "ar-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "أي مطعم؟",
        "gloss": {
          "en": "Which restaurant?",
          "ko": "어느 식당이요?"
        }
      },
      {
        "who": "me",
        "text": "آسف، لا أعرف الاسم.",
        "gloss": {
          "en": "Sorry, I don't know the name.",
          "ko": "미안해요, 이름을 몰라요."
        },
        "frames": [
          "ar-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "طيب، أنا قريب. أنت في الداخل؟",
        "gloss": {
          "en": "OK, I'm close. Are you inside?",
          "ko": "알았어요, 저 근처예요. 안에 있어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أنا في الداخل.",
        "gloss": {
          "en": "Yes, I'm inside.",
          "ko": "네, 안에 있어요."
        },
        "frames": [
          "ar-f1-16"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "In Arabic class: a new word",
      "ko": "아랍어 수업에서 모르는 단어"
    },
    "expressions": [
      "شكرا",
      "من فضلك",
      "آسف",
      "طيب",
      "لا أفهم",
      "مرة ثانية"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "افتحوا الكتاب، من فضلكم.",
        "gloss": {
          "en": "Open your books, please.",
          "ko": "책을 펴 주세요."
        }
      },
      {
        "who": "me",
        "text": "آسف، ما معنى هذه الكلمة؟",
        "gloss": {
          "en": "Sorry, what does this word mean?",
          "ko": "죄송한데, 이 단어 뜻이 뭐예요?"
        },
        "frames": [
          "ar-f1-17",
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "سوق يعني مكان نشتري فيه.",
        "gloss": {
          "en": "Souq means a place where we buy things.",
          "ko": "'수크'는 물건을 사는 곳이라는 뜻이에요."
        }
      },
      {
        "who": "me",
        "text": "لا أفهم. مرة ثانية، من فضلك.",
        "gloss": {
          "en": "I don't understand. Once more, please.",
          "ko": "이해가 안 돼요. 한 번 더 말해 주세요."
        },
        "frames": [
          "ar-f1-12",
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "السوق مكان للشراء، مثل المول.",
        "gloss": {
          "en": "A souq is a place for shopping, like a mall.",
          "ko": "수크는 쇼핑하는 곳이에요. 쇼핑몰처럼요."
        }
      },
      {
        "who": "me",
        "text": "آه، طيب! شكرا على الشرح.",
        "gloss": {
          "en": "Ah, OK! Thanks for the explanation.",
          "ko": "아, 알겠어요! 설명해 줘서 고마워요."
        },
        "frames": [
          "ar-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "عفوا.",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에요."
        }
      },
      {
        "who": "me",
        "text": "شكرا يا أستاذ.",
        "gloss": {
          "en": "Thank you, teacher.",
          "ko": "고맙습니다, 선생님."
        }
      }
    ]
  },
  {
    "id": "ar-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Missing bag at the airport",
      "ko": "공항에서 가방을 못 찾을 때"
    },
    "expressions": [
      "مرحبا",
      "شكرا",
      "نعم"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "نعم، كيف أساعدك؟",
        "gloss": {
          "en": "Yes, how can I help you?",
          "ko": "네, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مرحبا. أين حقائب الرحلة من دبي؟",
        "gloss": {
          "en": "Hello. Where are the bags from the Dubai flight?",
          "ko": "안녕하세요. 두바이에서 온 비행기 짐은 어디 있어요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "هناك. هل هذه حقيبتك؟",
        "gloss": {
          "en": "Over there. Is this your bag?",
          "ko": "저기요. 이게 당신 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "لا، ليست حقيبتي. حقيبتي زرقاء.",
        "gloss": {
          "en": "No, it's not my bag. My bag is blue.",
          "ko": "아니요, 제 가방이 아니에요. 제 가방은 파란색이에요."
        }
      },
      {
        "who": "them",
        "text": "وهذه الحقيبة الزرقاء؟",
        "gloss": {
          "en": "And this blue bag?",
          "ko": "그럼 이 파란 가방은요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، هذا اسمي عليها.",
        "gloss": {
          "en": "Yes, this is my name on it.",
          "ko": "네, 거기 제 이름이 있어요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "تفضل.",
        "gloss": {
          "en": "Here you are.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا على المساعدة!",
        "gloss": {
          "en": "Thanks for the help!",
          "ko": "도와줘서 고마워요!"
        },
        "frames": [
          "ar-f1-11"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bakery",
      "ko": "빵집에서"
    },
    "expressions": [
      "صباح الخير",
      "من فضلك",
      "طيب"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير!",
        "gloss": {
          "en": "Good morning!",
          "ko": "안녕하세요!"
        }
      },
      {
        "who": "me",
        "text": "صباح الخير. عندك خبز عربي؟",
        "gloss": {
          "en": "Good morning. Do you have Arabic bread?",
          "ko": "안녕하세요. 아랍 빵 있어요?"
        },
        "frames": [
          "ar-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "نعم، طازج.",
        "gloss": {
          "en": "Yes, fresh.",
          "ko": "네, 갓 구운 거예요."
        }
      },
      {
        "who": "me",
        "text": "أريد كيس خبز، من فضلك.",
        "gloss": {
          "en": "I'd like a bag of bread, please.",
          "ko": "빵 한 봉지 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "شيء آخر؟",
        "gloss": {
          "en": "Anything else?",
          "ko": "다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "ما هذا؟",
        "gloss": {
          "en": "What is this?",
          "ko": "이건 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "هذا كعك بالسمسم.",
        "gloss": {
          "en": "These are sesame rings.",
          "ko": "참깨 빵이에요."
        }
      },
      {
        "who": "me",
        "text": "طيب، بكم الكعك؟",
        "gloss": {
          "en": "OK, how much are the sesame rings?",
          "ko": "좋아요, 참깨 빵은 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a neighbour on the stairs",
      "ko": "계단에서 이웃을 만났을 때"
    },
    "expressions": [
      "مرحبا",
      "صباح الخير",
      "كيف حالك",
      "تشرفنا",
      "شكرا",
      "نعم"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! أنت جديد هنا؟",
        "gloss": {
          "en": "Good morning! Are you new here?",
          "ko": "안녕하세요! 새로 이사 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "صباح الخير. نعم، أنا في الشقة الثالثة.",
        "gloss": {
          "en": "Good morning. Yes, I'm in flat three.",
          "ko": "안녕하세요. 네, 삼 호에 살아요."
        },
        "frames": [
          "ar-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "أهلا وسهلا! أنا خالد.",
        "gloss": {
          "en": "Welcome! I'm Khaled.",
          "ko": "환영해요! 저는 할리드예요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا يا خالد، كيف حالك؟",
        "gloss": {
          "en": "Hi, Khaled, how are you?",
          "ko": "안녕하세요, 할리드 씨. 잘 지내세요?"
        },
        "frames": [
          "ar-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "بخير والحمد لله. من أين أنت؟",
        "gloss": {
          "en": "Fine, thank God. Where are you from?",
          "ko": "잘 지내요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "أنا من كوريا.",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        },
        "frames": [
          "ar-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "أهلا! تفضل عندنا للقهوة.",
        "gloss": {
          "en": "Welcome! Come over for coffee.",
          "ko": "반가워요! 우리 집에 커피 마시러 오세요."
        }
      },
      {
        "who": "me",
        "text": "شكرا! تشرفنا.",
        "gloss": {
          "en": "Thanks! Nice to meet you.",
          "ko": "고마워요! 반가워요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a restaurant",
      "ko": "식당에서 주문할 때"
    },
    "expressions": [
      "شكرا",
      "من فضلك",
      "نعم",
      "طيب",
      "أين الحمام"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير، تفضل. هذه القائمة.",
        "gloss": {
          "en": "Good evening, welcome. Here's the menu.",
          "ko": "안녕하세요, 어서 오세요. 메뉴 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. ما هذا الطبق؟",
        "gloss": {
          "en": "Thanks. What is this dish?",
          "ko": "고마워요. 이 요리는 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "هذا منسف: لحم ورز ولبن.",
        "gloss": {
          "en": "This is mansaf: meat, rice and yoghurt.",
          "ko": "만사프예요. 고기, 밥, 요구르트예요."
        }
      },
      {
        "who": "me",
        "text": "طيب، أريد منسف، من فضلك.",
        "gloss": {
          "en": "OK, I'd like the mansaf, please.",
          "ko": "좋아요, 만사프 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "وماء؟",
        "gloss": {
          "en": "And water?",
          "ko": "물도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، من فضلك. أين الحمام؟",
        "gloss": {
          "en": "Yes, please. Where is the toilet?",
          "ko": "네, 주세요. 화장실은 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "هناك، على اليسار.",
        "gloss": {
          "en": "Over there, on the left.",
          "ko": "저기 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا.",
        "gloss": {
          "en": "Thanks.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "شكرا",
      "آسف",
      "نعم",
      "طيب"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير. عندك موعد؟",
        "gloss": {
          "en": "Good morning. Do you have an appointment?",
          "ko": "안녕하세요. 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، عندي موعد مع الطبيب.",
        "gloss": {
          "en": "Yes, I have an appointment with the doctor.",
          "ko": "네, 의사 선생님과 예약이 있어요."
        },
        "frames": [
          "ar-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "عندك بطاقة التأمين؟",
        "gloss": {
          "en": "Do you have your insurance card?",
          "ko": "보험 카드 있어요?"
        }
      },
      {
        "who": "me",
        "text": "آسف، ما عندي بطاقة.",
        "gloss": {
          "en": "Sorry, I don't have a card.",
          "ko": "죄송해요, 카드가 없어요."
        },
        "frames": [
          "ar-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "لا مشكلة. اجلس هنا، من فضلك.",
        "gloss": {
          "en": "No problem. Sit here, please.",
          "ko": "괜찮아요. 여기 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "طيب. والطبيب، ما اسمه؟",
        "gloss": {
          "en": "OK. And the doctor, what's his name?",
          "ko": "네. 그런데 의사 선생님 성함이 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "الدكتور حسن. هو طبيب ممتاز.",
        "gloss": {
          "en": "Doctor Hassan. He's an excellent doctor.",
          "ko": "하산 선생님이에요. 아주 좋은 의사예요."
        }
      },
      {
        "who": "me",
        "text": "شكرا.",
        "gloss": {
          "en": "Thanks.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a clothes shop",
      "ko": "옷가게에서"
    },
    "expressions": [
      "مرحبا",
      "شكرا",
      "آسف",
      "طيب",
      "بكم هذا"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا، تفضل.",
        "gloss": {
          "en": "Hello, come in.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا. عندك قميص أزرق؟",
        "gloss": {
          "en": "Hi. Do you have a blue shirt?",
          "ko": "안녕하세요. 파란 셔츠 있어요?"
        },
        "frames": [
          "ar-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "نعم، هذا قميص أزرق.",
        "gloss": {
          "en": "Yes, this is a blue shirt.",
          "ko": "네, 이게 파란 셔츠예요."
        }
      },
      {
        "who": "me",
        "text": "بكم هذا القميص؟",
        "gloss": {
          "en": "How much is this shirt?",
          "ko": "이 셔츠 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "عشرون دينارا.",
        "gloss": {
          "en": "Twenty dinars.",
          "ko": "이십 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "آسف، هذا غالي.",
        "gloss": {
          "en": "Sorry, that's expensive.",
          "ko": "죄송하지만 비싸네요."
        },
        "frames": [
          "ar-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "طيب، خمسة عشر.",
        "gloss": {
          "en": "OK, fifteen.",
          "ko": "좋아요, 십오 디나르요."
        }
      },
      {
        "who": "me",
        "text": "طيب، شكرا!",
        "gloss": {
          "en": "OK, thanks!",
          "ko": "좋아요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ar-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Showing family photos to a colleague",
      "ko": "동료에게 가족 사진을 보여 줄 때"
    },
    "expressions": [],
    "grammar": [
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "من هذا في الصورة؟",
        "gloss": {
          "en": "Who is this in the photo?",
          "ko": "사진 속 이 사람은 누구예요?"
        }
      },
      {
        "who": "me",
        "text": "هذا أخي.",
        "gloss": {
          "en": "This is my brother.",
          "ko": "제 형이에요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله. ماذا يعمل؟",
        "gloss": {
          "en": "How nice. What does he do?",
          "ko": "멋지네요. 무슨 일 해요?"
        }
      },
      {
        "who": "me",
        "text": "هو مدرس.",
        "gloss": {
          "en": "He's a teacher.",
          "ko": "선생님이에요."
        },
        "frames": [
          "ar-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "وهذه؟",
        "gloss": {
          "en": "And this one?",
          "ko": "이분은요?"
        }
      },
      {
        "who": "me",
        "text": "هذه أختي. هي طبيبة.",
        "gloss": {
          "en": "This is my sister. She's a doctor.",
          "ko": "제 누나예요. 의사예요."
        }
      },
      {
        "who": "them",
        "text": "جميل! أين هم الآن؟",
        "gloss": {
          "en": "Lovely! Where are they now?",
          "ko": "좋네요! 지금 어디 있어요?"
        }
      },
      {
        "who": "me",
        "text": "هم في كوريا. أنا في عمان.",
        "gloss": {
          "en": "They're in Korea. I'm in Amman.",
          "ko": "가족은 한국에 있어요. 저는 암만에 있어요."
        },
        "frames": [
          "ar-f1-16"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bus stop",
      "ko": "버스 정류장에서"
    },
    "expressions": [
      "السلام عليكم",
      "شكرا",
      "من فضلك",
      "آسف",
      "طيب",
      "مرة ثانية"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "نعم؟",
        "gloss": {
          "en": "Yes?",
          "ko": "네?"
        }
      },
      {
        "who": "me",
        "text": "السلام عليكم. أين الباص إلى الجامعة؟",
        "gloss": {
          "en": "Hello. Where is the bus to the university?",
          "ko": "안녕하세요. 대학교 가는 버스는 어디 있어요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "وعليكم السلام. رقم سبعة، هناك.",
        "gloss": {
          "en": "Hello. Number seven, over there.",
          "ko": "안녕하세요. 칠 번이요, 저기요."
        }
      },
      {
        "who": "me",
        "text": "آسف، مرة ثانية، من فضلك.",
        "gloss": {
          "en": "Sorry, once more, please.",
          "ko": "죄송해요, 한 번 더 말해 주세요."
        },
        "frames": [
          "ar-f1-17",
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "الباص رقم سبعة. الأبيض.",
        "gloss": {
          "en": "Bus number seven. The white one.",
          "ko": "칠 번 버스요. 하얀 버스요."
        }
      },
      {
        "who": "me",
        "text": "شكرا! بكم التذكرة؟",
        "gloss": {
          "en": "Thanks! How much is the ticket?",
          "ko": "고마워요! 표는 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "نصف دينار.",
        "gloss": {
          "en": "Half a dinar.",
          "ko": "반 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "طيب، شكرا.",
        "gloss": {
          "en": "OK, thanks.",
          "ko": "네, 고마워요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Visiting a friend's new home",
      "ko": "친구의 새집에 놀러 갔을 때"
    },
    "expressions": [
      "شكرا",
      "من فضلك"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا وسهلا! تفضل.",
        "gloss": {
          "en": "Welcome! Come in.",
          "ko": "어서 와요! 들어와요."
        }
      },
      {
        "who": "me",
        "text": "شكرا على الدعوة.",
        "gloss": {
          "en": "Thanks for the invitation.",
          "ko": "초대해 줘서 고마워요."
        },
        "frames": [
          "ar-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "اجلس. قهوة أم شاي؟",
        "gloss": {
          "en": "Sit down. Coffee or tea?",
          "ko": "앉아요. 커피 마실래요, 차 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "شاي، من فضلك.",
        "gloss": {
          "en": "Tea, please.",
          "ko": "차 주세요."
        },
        "frames": [
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "تفضل. هذا بيتي الجديد.",
        "gloss": {
          "en": "Here you are. This is my new home.",
          "ko": "여기요. 여기가 제 새집이에요."
        }
      },
      {
        "who": "me",
        "text": "جميل جدا! ما هذا؟",
        "gloss": {
          "en": "Very nice! What's this?",
          "ko": "정말 좋네요! 이건 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "هذا عود. أنا موسيقي.",
        "gloss": {
          "en": "It's an oud. I'm a musician.",
          "ko": "우드라는 악기예요. 저는 음악가예요."
        }
      },
      {
        "who": "me",
        "text": "آه، أنا طالب موسيقى!",
        "gloss": {
          "en": "Oh, I'm a music student!",
          "ko": "아, 저는 음악 전공 학생이에요!"
        },
        "frames": [
          "ar-f1-03"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a SIM card",
      "ko": "휴대폰 유심을 살 때"
    },
    "expressions": [
      "مرحبا",
      "من فضلك",
      "نعم",
      "طيب",
      "تفضل"
    ],
    "grammar": [
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "مرحبا، تفضل.",
        "gloss": {
          "en": "Hi, how can I help?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مرحبا. أريد شريحة هاتف، من فضلك.",
        "gloss": {
          "en": "Hi. I'd like a SIM card, please.",
          "ko": "안녕하세요. 유심 하나 주세요."
        },
        "frames": [
          "ar-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "عندك جواز سفر؟",
        "gloss": {
          "en": "Do you have a passport?",
          "ko": "여권 있어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، عندي. تفضل.",
        "gloss": {
          "en": "Yes, I have one. Here you go.",
          "ko": "네, 있어요. 여기요."
        },
        "frames": [
          "ar-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "شكرا. شريحة مع إنترنت؟",
        "gloss": {
          "en": "Thanks. A SIM with internet?",
          "ko": "고마워요. 인터넷 되는 유심으로요?"
        }
      },
      {
        "who": "me",
        "text": "نعم. بكم الشريحة؟",
        "gloss": {
          "en": "Yes. How much is the SIM?",
          "ko": "네. 유심은 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "عشرة دنانير.",
        "gloss": {
          "en": "Ten dinars.",
          "ko": "십 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "طيب، تفضل.",
        "gloss": {
          "en": "OK, here you go.",
          "ko": "네, 여기요."
        }
      }
    ]
  },
  {
    "id": "ar-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a new office",
      "ko": "새 회사 첫 출근 날"
    },
    "expressions": [
      "صباح الخير",
      "تشرفنا",
      "شكرا",
      "نعم"
    ],
    "grammar": [
      0,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! أنت الموظف الجديد؟",
        "gloss": {
          "en": "Good morning! Are you the new employee?",
          "ko": "안녕하세요! 새로 온 직원이에요?"
        }
      },
      {
        "who": "me",
        "text": "صباح الخير. نعم، أنا الموظف الجديد.",
        "gloss": {
          "en": "Good morning. Yes, I'm the new employee.",
          "ko": "안녕하세요. 네, 새로 온 직원이에요."
        },
        "frames": [
          "ar-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "أهلا! أنا مريم، مديرة المكتب.",
        "gloss": {
          "en": "Welcome! I'm Maryam, the office manager.",
          "ko": "환영해요! 저는 사무실 관리자 마리암이에요."
        }
      },
      {
        "who": "me",
        "text": "تشرفنا. أين مكتبي؟",
        "gloss": {
          "en": "Nice to meet you. Where is my desk?",
          "ko": "반가워요. 제 자리는 어디예요?"
        },
        "frames": [
          "ar-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "هنا. هذا مكتبك.",
        "gloss": {
          "en": "Here. This is your desk.",
          "ko": "여기요. 여기가 당신 자리예요."
        }
      },
      {
        "who": "me",
        "text": "شكرا! ما كلمة السر؟",
        "gloss": {
          "en": "Thanks! What is the password?",
          "ko": "고마워요! 비밀번호가 뭐예요?"
        },
        "frames": [
          "ar-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "كلمة السر على الورقة.",
        "gloss": {
          "en": "The password is on the paper.",
          "ko": "비밀번호는 종이에 적혀 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا على المساعدة!",
        "gloss": {
          "en": "Thanks for the help!",
          "ko": "도와줘서 고마워요!"
        },
        "frames": [
          "ar-f1-11"
        ]
      }
    ]
  },
  {
    "id": "ar-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A food delivery at the door",
      "ko": "현관에서 음식 배달을 받을 때"
    },
    "expressions": [
      "مرحبا",
      "شكرا",
      "آسف",
      "نعم",
      "تفضل"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "مرحبا، توصيل!",
        "gloss": {
          "en": "Hi, delivery!",
          "ko": "안녕하세요, 배달이에요!"
        }
      },
      {
        "who": "me",
        "text": "مرحبا! نعم، هذا بيتي.",
        "gloss": {
          "en": "Hi! Yes, this is my place.",
          "ko": "안녕하세요! 네, 여기 저희 집이에요."
        },
        "frames": [
          "ar-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "هذا طلبك: البيتزا والعصير.",
        "gloss": {
          "en": "Here's your order: the pizza and the juice.",
          "ko": "주문하신 피자랑 주스예요."
        }
      },
      {
        "who": "me",
        "text": "آسف، العصير ليس لي.",
        "gloss": {
          "en": "Sorry, the juice isn't mine.",
          "ko": "죄송한데, 주스는 제 게 아니에요."
        },
        "frames": [
          "ar-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "آه، آسف! خطأ.",
        "gloss": {
          "en": "Oh, sorry! A mistake.",
          "ko": "아, 죄송해요! 실수했네요."
        }
      },
      {
        "who": "me",
        "text": "لا مشكلة. بكم البيتزا؟",
        "gloss": {
          "en": "No problem. How much is the pizza?",
          "ko": "괜찮아요. 피자는 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "سبعة دنانير.",
        "gloss": {
          "en": "Seven dinars.",
          "ko": "칠 디나르예요."
        }
      },
      {
        "who": "me",
        "text": "تفضل. شكرا!",
        "gloss": {
          "en": "Here you go. Thanks!",
          "ko": "여기요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ar-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Taking a taxi to the hotel",
      "ko": "호텔까지 택시를 탈 때"
    },
    "expressions": [
      "مساء الخير",
      "شكرا",
      "من فضلك"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير. إلى أين؟",
        "gloss": {
          "en": "Good evening. Where to?",
          "ko": "안녕하세요. 어디로 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. إلى الفندق الكبير، من فضلك.",
        "gloss": {
          "en": "Good evening. To the Grand Hotel, please.",
          "ko": "안녕하세요. 그랜드 호텔로 가 주세요."
        },
        "frames": [
          "ar-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "طيب. أنت سائح؟",
        "gloss": {
          "en": "OK. Are you a tourist?",
          "ko": "네. 관광객이에요?"
        }
      },
      {
        "who": "me",
        "text": "لا، أنا طالب هنا.",
        "gloss": {
          "en": "No, I'm a student here.",
          "ko": "아니요, 여기서 공부하는 학생이에요."
        },
        "frames": [
          "ar-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "جميل. من أين أنت؟",
        "gloss": {
          "en": "Nice. Where are you from?",
          "ko": "좋네요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "أنا من كوريا.",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        },
        "frames": [
          "ar-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "وصلنا. هذا الفندق.",
        "gloss": {
          "en": "We're here. This is the hotel.",
          "ko": "도착했어요. 여기가 호텔이에요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. بكم؟",
        "gloss": {
          "en": "Thanks. How much?",
          "ko": "고마워요. 얼마예요?"
        },
        "frames": [
          "ar-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Weekend plans with a colleague",
      "ko": "동료와 주말 계획 이야기"
    },
    "expressions": [
      "إن شاء الله",
      "للأسف",
      "نشوفك بكرة"
    ],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ماذا ستفعل في نهاية الأسبوع؟",
        "gloss": {
          "en": "What will you do at the weekend?",
          "ko": "주말에 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "سوف أزور صديقي في الزرقاء.",
        "gloss": {
          "en": "I'll visit my friend in Zarqa.",
          "ko": "자르카에 사는 친구를 만나러 갈 거예요."
        },
        "frames": [
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "جميل! وهل ستأتي إلى حفلة سارة يوم السبت؟",
        "gloss": {
          "en": "Nice! And will you come to Sara's party on Saturday?",
          "ko": "좋네요! 토요일 사라 파티에는 올 거예요?"
        }
      },
      {
        "who": "me",
        "text": "للأسف، لن أحضر الحفلة.",
        "gloss": {
          "en": "Unfortunately, I won't come to the party.",
          "ko": "아쉽지만 파티에는 못 가요."
        },
        "frames": [
          "ar-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "لماذا؟",
        "gloss": {
          "en": "Why?",
          "ko": "왜요?"
        }
      },
      {
        "who": "me",
        "text": "لن أحضر لأن عندي امتحان يوم الأحد.",
        "gloss": {
          "en": "I won't come because I have an exam on Sunday.",
          "ko": "일요일에 시험이 있어서 못 가요."
        },
        "frames": [
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ما في مشكلة. إن شاء الله المرة القادمة.",
        "gloss": {
          "en": "No problem. Next time, hopefully.",
          "ko": "괜찮아요. 다음에 꼭 와요."
        }
      },
      {
        "who": "me",
        "text": "إن شاء الله. نشوفك بكرة!",
        "gloss": {
          "en": "Hopefully. See you tomorrow!",
          "ko": "그럴게요. 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "ar-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering at a sweet shop café",
      "ko": "디저트 카페에서 주문할 때"
    },
    "expressions": [
      "يعطيك العافية",
      "ممكن",
      "ماذا تنصح"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا وسهلا! ماذا تطلب؟",
        "gloss": {
          "en": "Welcome! What would you like?",
          "ko": "어서 오세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "ماذا تنصح اليوم؟",
        "gloss": {
          "en": "What do you recommend today?",
          "ko": "오늘은 뭘 추천해요?"
        },
        "frames": [
          "ar-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "أنصحك بالكنافة. هي طازجة.",
        "gloss": {
          "en": "I recommend the knafeh. It's fresh.",
          "ko": "크나페를 추천해요. 방금 만들었어요."
        }
      },
      {
        "who": "me",
        "text": "طيب، سآخذ الكنافة وشاي بالنعناع.",
        "gloss": {
          "en": "OK, I'll have the knafeh and mint tea.",
          "ko": "좋아요, 크나페랑 민트차로 할게요."
        },
        "frames": [
          "ar-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. شيء آخر؟",
        "gloss": {
          "en": "Sure. Anything else?",
          "ko": "네. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "لا، شكرا. ممكن أجلس عند الشباك؟",
        "gloss": {
          "en": "No, thanks. Can I sit by the window?",
          "ko": "아니요, 괜찮아요. 창가에 앉아도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "طبعا، على راحتك.",
        "gloss": {
          "en": "Of course, as you like.",
          "ko": "물론이죠, 편하게 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "يعطيك العافية.",
        "gloss": {
          "en": "Thank you so much.",
          "ko": "수고하세요."
        }
      }
    ]
  },
  {
    "id": "ar-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor with a headache",
      "ko": "두통으로 병원에 갔을 때"
    },
    "expressions": [
      "ماذا تنصح",
      "عندي صداع"
    ],
    "grammar": [
      0,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "سلامتك! ما المشكلة؟",
        "gloss": {
          "en": "Sorry to hear that! What's the problem?",
          "ko": "어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "عندي صداع منذ الصباح.",
        "gloss": {
          "en": "I've had a headache since the morning.",
          "ko": "아침부터 머리가 아파요."
        },
        "frames": [
          "ar-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "هل نمت جيدا؟",
        "gloss": {
          "en": "Did you sleep well?",
          "ko": "잠은 잘 잤어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لم أنم جيدا لأن الجو حار.",
        "gloss": {
          "en": "No, I didn't sleep well because it's hot.",
          "ko": "아니요, 더워서 잘 못 잤어요."
        },
        "frames": [
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "هل أكلت شيئا اليوم؟",
        "gloss": {
          "en": "Did you eat anything today?",
          "ko": "오늘 뭐 좀 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "أكلت فطورا خفيفا أمس، واليوم لا شيء.",
        "gloss": {
          "en": "I had a light breakfast yesterday, and nothing today.",
          "ko": "어제 아침을 가볍게 먹었고, 오늘은 아무것도 안 먹었어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "طيب. خذ هذا الدواء واشرب ماء كثيرا.",
        "gloss": {
          "en": "OK. Take this medicine and drink lots of water.",
          "ko": "알겠어요. 이 약 먹고 물 많이 마셔요."
        }
      },
      {
        "who": "me",
        "text": "شكرا يا دكتور. ماذا تنصح للأكل؟",
        "gloss": {
          "en": "Thank you, doctor. What do you recommend for food?",
          "ko": "고맙습니다, 선생님. 음식은 뭘 먹는 게 좋아요?"
        },
        "frames": [
          "ar-f2-12"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting about hobbies",
      "ko": "취미 이야기"
    },
    "expressions": [
      "فكرة حلوة"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "ماذا تحب أن تفعل في وقت الفراغ؟",
        "gloss": {
          "en": "What do you like to do in your free time?",
          "ko": "시간 날 때 뭐 하는 거 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "أحب السباحة والقراءة.",
        "gloss": {
          "en": "I like swimming and reading.",
          "ko": "수영이랑 독서를 좋아해요."
        },
        "frames": [
          "ar-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "وأنا أيضا! أسبح كل أسبوع. وأنت؟",
        "gloss": {
          "en": "Me too! I swim every week. And you?",
          "ko": "저도요! 저는 매주 수영해요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "أسبح كل يوم في الصباح.",
        "gloss": {
          "en": "I swim every day in the morning.",
          "ko": "저는 매일 아침에 수영해요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله! وهل تحب الجري؟",
        "gloss": {
          "en": "Wow! And do you like running?",
          "ko": "대단하네요! 달리기도 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "لا أحب الجري. هو متعب جدا.",
        "gloss": {
          "en": "I don't like running. It's very tiring.",
          "ko": "달리기는 싫어해요. 너무 힘들어요."
        },
        "frames": [
          "ar-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "يلا نسبح معا يوم الجمعة!",
        "gloss": {
          "en": "Let's swim together on Friday!",
          "ko": "금요일에 같이 수영해요!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! سأحضر نظارتي.",
        "gloss": {
          "en": "Great idea! I'll bring my goggles.",
          "ko": "좋은 생각이에요! 물안경 챙길게요."
        },
        "frames": [
          "ar-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A dinner invitation by phone",
      "ko": "전화로 저녁 초대를 받을 때"
    },
    "expressions": [
      "فكرة حلوة"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو، مرحبا! عندي فكرة.",
        "gloss": {
          "en": "Hello, hi! I have an idea.",
          "ko": "여보세요, 안녕! 좋은 생각이 있어요."
        }
      },
      {
        "who": "me",
        "text": "أهلا! ما هي؟",
        "gloss": {
          "en": "Hi! What is it?",
          "ko": "안녕하세요! 뭔데요?"
        }
      },
      {
        "who": "them",
        "text": "يلا نأكل في المطعم اللبناني الليلة!",
        "gloss": {
          "en": "Let's eat at the Lebanese restaurant tonight!",
          "ko": "오늘 밤에 레바논 식당에서 밥 먹어요!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! سأتصل بأخي أيضا.",
        "gloss": {
          "en": "Great idea! I'll call my brother too.",
          "ko": "좋은 생각이에요! 형한테도 전화할게요."
        },
        "frames": [
          "ar-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. متى نلتقي؟",
        "gloss": {
          "en": "Great. When shall we meet?",
          "ko": "좋아요. 언제 만날까요?"
        }
      },
      {
        "who": "me",
        "text": "نلتقي الساعة الثامنة؟",
        "gloss": {
          "en": "Shall we meet at eight?",
          "ko": "여덟 시에 만날까요?"
        },
        "frames": [
          "ar-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. أين؟",
        "gloss": {
          "en": "Sure. Where?",
          "ko": "좋아요. 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "نلتقي أمام المطعم؟",
        "gloss": {
          "en": "Shall we meet in front of the restaurant?",
          "ko": "식당 앞에서 만날까요?"
        },
        "frames": [
          "ar-f2-14"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Visiting grandma's house with a friend",
      "ko": "친구와 할머니 댁에 갔을 때"
    },
    "expressions": [
      "يلا"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "أين نحن؟ هذا بيتك؟",
        "gloss": {
          "en": "Where are we? Is this your house?",
          "ko": "여기 어디예요? 당신 집이에요?"
        }
      },
      {
        "who": "me",
        "text": "لا، هذا بيت جدتي.",
        "gloss": {
          "en": "No, this is my grandmother's house.",
          "ko": "아니요, 우리 할머니 댁이에요."
        },
        "frames": [
          "ar-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله، البيت جميل!",
        "gloss": {
          "en": "Wow, the house is beautiful!",
          "ko": "와, 집이 정말 예뻐요!"
        }
      },
      {
        "who": "me",
        "text": "أزور جدتي كل يوم جمعة.",
        "gloss": {
          "en": "I visit my grandmother every Friday.",
          "ko": "매주 금요일에 할머니를 찾아뵈어요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "وهل جدتك في البيت الآن؟",
        "gloss": {
          "en": "And is your grandmother home now?",
          "ko": "할머니는 지금 집에 계세요?"
        }
      },
      {
        "who": "me",
        "text": "لا، ذهبت إلى بيت خالتي أمس.",
        "gloss": {
          "en": "No, she went to my aunt's house yesterday.",
          "ko": "아니요, 어제 이모 댁에 가셨어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "طيب. ماذا نفعل الآن؟",
        "gloss": {
          "en": "OK. What do we do now?",
          "ko": "그럼 이제 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "يلا نشرب شاي في الحديقة!",
        "gloss": {
          "en": "Let's drink tea in the garden!",
          "ko": "정원에서 차 마셔요!"
        },
        "frames": [
          "ar-f2-16"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for help at hotel reception",
      "ko": "호텔 프런트에 부탁할 때"
    },
    "expressions": [
      "ممكن"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير، كيف أساعدك؟",
        "gloss": {
          "en": "Good evening, how can I help you?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "مساء الخير. ممكن تغير الغرفة؟ المكيف لا يعمل.",
        "gloss": {
          "en": "Good evening. Could you change my room? The air conditioner isn't working.",
          "ko": "안녕하세요. 방을 바꿔 주실 수 있어요? 에어컨이 안 돼요."
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "آسف جدا! سأرسل الفني الآن.",
        "gloss": {
          "en": "I'm very sorry! I'll send the technician now.",
          "ko": "정말 죄송합니다! 지금 기사님을 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "ممكن أنتظر في المطعم؟",
        "gloss": {
          "en": "Can I wait in the restaurant?",
          "ko": "식당에서 기다려도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. هل تريد شيئا آخر؟",
        "gloss": {
          "en": "Sure. Do you want anything else?",
          "ko": "그럼요. 더 필요한 건 없으세요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، ممكن تطلب لي تاكسي غدا الصباح؟",
        "gloss": {
          "en": "Yes, could you order me a taxi tomorrow morning?",
          "ko": "네, 내일 아침에 택시 좀 불러 주실 수 있어요?"
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "ما في مشكلة. في أي ساعة؟",
        "gloss": {
          "en": "No problem. At what time?",
          "ko": "문제없어요. 몇 시에요?"
        }
      },
      {
        "who": "me",
        "text": "سوف أخرج في السابعة.",
        "gloss": {
          "en": "I'll leave at seven.",
          "ko": "일곱 시에 나갈 거예요."
        },
        "frames": [
          "ar-f2-02"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about food with a colleague",
      "ko": "동료와 음식 이야기"
    },
    "expressions": [
      "فكرة حلوة"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "هل أكلت المقلوبة من قبل؟",
        "gloss": {
          "en": "Have you eaten maqluba before?",
          "ko": "마클루바 먹어 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لم آكل المقلوبة من قبل.",
        "gloss": {
          "en": "No, I've never eaten maqluba before.",
          "ko": "아니요, 마클루바는 먹어 본 적이 없어요."
        },
        "frames": [
          "ar-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "سأطبخ لك المقلوبة يوم الجمعة!",
        "gloss": {
          "en": "I'll cook maqluba for you on Friday!",
          "ko": "금요일에 마클루바 만들어 줄게요!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! سأحضر الحلويات.",
        "gloss": {
          "en": "Great idea! I'll bring dessert.",
          "ko": "좋은 생각이에요! 디저트는 제가 가져갈게요."
        },
        "frames": [
          "ar-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. هل تحب الطعام الحار؟",
        "gloss": {
          "en": "Great. Do you like spicy food?",
          "ko": "좋아요. 매운 음식 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "لا أحب الطعام الحار كثيرا.",
        "gloss": {
          "en": "I don't like spicy food much.",
          "ko": "매운 음식은 별로 안 좋아해요."
        },
        "frames": [
          "ar-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "ما في مشكلة، المقلوبة ليست حارة.",
        "gloss": {
          "en": "No problem, maqluba isn't spicy.",
          "ko": "괜찮아요, 마클루바는 안 매워요."
        }
      },
      {
        "who": "me",
        "text": "ممتاز. نشوفك يوم الجمعة!",
        "gloss": {
          "en": "Great. See you on Friday!",
          "ko": "좋아요. 금요일에 봐요!"
        }
      }
    ]
  },
  {
    "id": "ar-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a coach ticket to Aqaba",
      "ko": "아카바행 버스표를 살 때"
    },
    "expressions": [
      "صباح النور",
      "يعطيك العافية",
      "ممكن"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير. إلى أين؟",
        "gloss": {
          "en": "Good morning. Where to?",
          "ko": "안녕하세요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "صباح النور. سآخذ تذكرة إلى العقبة، من فضلك.",
        "gloss": {
          "en": "Good morning. I'll take a ticket to Aqaba, please.",
          "ko": "안녕하세요. 아카바행 표 한 장 주세요."
        },
        "frames": [
          "ar-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ذهاب فقط أم ذهاب وعودة؟",
        "gloss": {
          "en": "One way or return?",
          "ko": "편도요, 왕복이요?"
        }
      },
      {
        "who": "me",
        "text": "ذهاب فقط، لأن صديقي سيوصلني بالسيارة.",
        "gloss": {
          "en": "One way, because my friend will drive me back.",
          "ko": "편도요. 친구가 차로 데려다줄 거라서요."
        },
        "frames": [
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "طيب. الباص يتحرك الساعة التاسعة.",
        "gloss": {
          "en": "OK. The bus leaves at nine.",
          "ko": "네. 버스는 아홉 시에 출발해요."
        }
      },
      {
        "who": "me",
        "text": "ممكن تكتب رقم المقعد؟",
        "gloss": {
          "en": "Could you write the seat number?",
          "ko": "좌석 번호를 적어 주실 수 있어요?"
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "أكيد، تفضل.",
        "gloss": {
          "en": "Sure, here you are.",
          "ko": "그럼요, 여기요."
        }
      },
      {
        "who": "me",
        "text": "يعطيك العافية.",
        "gloss": {
          "en": "Thank you so much.",
          "ko": "수고하세요."
        }
      }
    ]
  },
  {
    "id": "ar-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Paying the bill at a restaurant",
      "ko": "식당에서 계산할 때"
    },
    "expressions": [
      "ممكن",
      "الحساب من فضلك"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "كيف كان الأكل؟",
        "gloss": {
          "en": "How was the food?",
          "ko": "음식은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "ممتاز! أكلت هنا أمس أيضا.",
        "gloss": {
          "en": "Excellent! I ate here yesterday too.",
          "ko": "최고였어요! 어제도 여기서 먹었어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله! هل تريد حلويات؟",
        "gloss": {
          "en": "Wonderful! Would you like dessert?",
          "ko": "고마워요! 디저트 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "لا شكرا. سآخذ قهوة فقط.",
        "gloss": {
          "en": "No thanks. I'll just have coffee.",
          "ko": "아니요, 괜찮아요. 커피만 주세요."
        },
        "frames": [
          "ar-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "تفضل القهوة.",
        "gloss": {
          "en": "Here's your coffee.",
          "ko": "커피 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. الحساب من فضلك.",
        "gloss": {
          "en": "Thanks. The bill, please.",
          "ko": "고마워요. 계산서 주세요."
        }
      },
      {
        "who": "them",
        "text": "أكيد. تفضل الحساب.",
        "gloss": {
          "en": "Sure. Here's the bill.",
          "ko": "네. 계산서 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "ممكن أدفع بالبطاقة؟",
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드로 계산해도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning to study with a classmate",
      "ko": "반 친구와 공부 약속을 잡을 때"
    },
    "expressions": [
      "إن شاء الله",
      "ممكن",
      "أكيد"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "عندنا امتحان يوم الخميس. متى نلتقي للدراسة؟",
        "gloss": {
          "en": "We have an exam on Thursday. When shall we meet to study?",
          "ko": "목요일에 시험이 있잖아요. 공부하러 언제 만날까요?"
        }
      },
      {
        "who": "me",
        "text": "نلتقي في المكتبة غدا؟",
        "gloss": {
          "en": "Shall we meet at the library tomorrow?",
          "ko": "내일 도서관에서 만날까요?"
        },
        "frames": [
          "ar-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "غدا عندي عمل. ماذا عن يوم الثلاثاء؟",
        "gloss": {
          "en": "I'm working tomorrow. How about Tuesday?",
          "ko": "내일은 일이 있어요. 화요일은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "ممكن. أدرس في المكتبة كل يوم بعد الظهر.",
        "gloss": {
          "en": "Possible. I study at the library every afternoon.",
          "ko": "좋아요. 저는 매일 오후에 도서관에서 공부해요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز، الثلاثاء بعد الظهر إذن.",
        "gloss": {
          "en": "Great, Tuesday afternoon then.",
          "ko": "좋아요, 그럼 화요일 오후로 해요."
        }
      },
      {
        "who": "me",
        "text": "نلتقي عند الباب الرئيسي؟",
        "gloss": {
          "en": "Shall we meet at the main entrance?",
          "ko": "정문에서 만날까요?"
        },
        "frames": [
          "ar-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "أكيد. لا تنس الكتاب!",
        "gloss": {
          "en": "Sure. Don't forget the book!",
          "ko": "좋아요. 책 잊지 마요!"
        }
      },
      {
        "who": "me",
        "text": "أكيد، إن شاء الله.",
        "gloss": {
          "en": "Sure, I'll try.",
          "ko": "네, 꼭 챙길게요."
        }
      }
    ]
  },
  {
    "id": "ar-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling about a phone left in a taxi",
      "ko": "택시에 두고 내린 휴대폰 때문에 전화할 때"
    },
    "expressions": [
      "ممكن"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو، شركة التاكسي. تفضل.",
        "gloss": {
          "en": "Hello, taxi company. Go ahead.",
          "ko": "여보세요, 택시 회사입니다. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا. نسيت هاتفي في التاكسي أمس.",
        "gloss": {
          "en": "Hello. I left my phone in a taxi yesterday.",
          "ko": "안녕하세요. 어제 택시에 휴대폰을 두고 내렸어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "آسف لذلك. أين ركبت التاكسي؟",
        "gloss": {
          "en": "Sorry about that. Where did you take the taxi?",
          "ko": "저런. 택시는 어디서 탔어요?"
        }
      },
      {
        "who": "me",
        "text": "ركبت من فندق النخيل إلى وسط البلد.",
        "gloss": {
          "en": "I went from the Palm Hotel to downtown.",
          "ko": "팜 호텔에서 시내까지 탔어요."
        }
      },
      {
        "who": "them",
        "text": "طيب. سنسأل السائقين.",
        "gloss": {
          "en": "OK. We'll ask the drivers.",
          "ko": "알겠어요. 기사님들께 물어볼게요."
        }
      },
      {
        "who": "me",
        "text": "ممكن تتصل بي اليوم؟",
        "gloss": {
          "en": "Could you call me today?",
          "ko": "오늘 전화 주실 수 있어요?"
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "أكيد، إن شاء الله.",
        "gloss": {
          "en": "Sure, God willing.",
          "ko": "네, 그럴게요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. سوف أنتظر في الفندق.",
        "gloss": {
          "en": "Thanks. I'll wait at the hotel.",
          "ko": "고마워요. 호텔에서 기다릴게요."
        },
        "frames": [
          "ar-f2-02"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Joining a gym",
      "ko": "헬스장에 등록할 때"
    },
    "expressions": [
      "ماذا تنصح"
    ],
    "grammar": [
      1,
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا وسهلا في النادي!",
        "gloss": {
          "en": "Welcome to the gym!",
          "ko": "헬스장에 오신 걸 환영해요!"
        }
      },
      {
        "who": "me",
        "text": "أهلا بك. لم أتمرن في النادي من قبل.",
        "gloss": {
          "en": "Hello. I've never worked out at a gym before.",
          "ko": "안녕하세요. 헬스장에서 운동해 본 적이 없어요."
        },
        "frames": [
          "ar-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "لا مشكلة. ماذا تحب؟",
        "gloss": {
          "en": "No problem. What do you like?",
          "ko": "괜찮아요. 뭘 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "أحب ركوب الدراجة.",
        "gloss": {
          "en": "I like cycling.",
          "ko": "자전거 타는 걸 좋아해요."
        },
        "frames": [
          "ar-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "عندنا دراجات ممتازة، ومسبح أيضا.",
        "gloss": {
          "en": "We have great bikes, and a pool too.",
          "ko": "좋은 자전거가 있고, 수영장도 있어요."
        }
      },
      {
        "who": "me",
        "text": "ماذا تنصح للمبتدئين؟",
        "gloss": {
          "en": "What do you recommend for beginners?",
          "ko": "초보자한테는 뭘 추천해요?"
        },
        "frames": [
          "ar-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "أنصحك بثلاثة أيام في الأسبوع.",
        "gloss": {
          "en": "I recommend three days a week.",
          "ko": "일주일에 사흘을 추천해요."
        }
      },
      {
        "who": "me",
        "text": "طيب، سوف أبدأ يوم الأحد.",
        "gloss": {
          "en": "OK, I'll start on Sunday.",
          "ko": "좋아요, 일요일부터 시작할게요."
        },
        "frames": [
          "ar-f2-02"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Turning down a wedding invitation",
      "ko": "결혼식 초대를 거절할 때"
    },
    "expressions": [
      "إن شاء الله",
      "ما شاء الله",
      "للأسف",
      "أكيد"
    ],
    "grammar": [
      2,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "الأسبوع القادم عرس أخي. يلا تعال!",
        "gloss": {
          "en": "My brother's wedding is next week. Come!",
          "ko": "다음 주에 형 결혼식이에요. 꼭 와요!"
        }
      },
      {
        "who": "me",
        "text": "ما شاء الله، مبروك! للأسف، لن أكون هنا.",
        "gloss": {
          "en": "How wonderful, congratulations! Unfortunately, I won't be here.",
          "ko": "와, 축하해요! 아쉽지만 저는 그때 여기 없어요."
        },
        "frames": [
          "ar-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "لماذا؟",
        "gloss": {
          "en": "Why?",
          "ko": "왜요?"
        }
      },
      {
        "who": "me",
        "text": "أنا مسافر إلى كوريا لأن جدي مريض.",
        "gloss": {
          "en": "I'm travelling to Korea because my grandfather is ill.",
          "ko": "할아버지가 편찮으셔서 한국에 가요."
        },
        "frames": [
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "سلامته! إن شاء الله يكون بخير.",
        "gloss": {
          "en": "I hope he gets well! God willing, he'll be fine.",
          "ko": "얼른 나으시길 바라요! 괜찮으실 거예요."
        }
      },
      {
        "who": "me",
        "text": "إن شاء الله. سوف أرسل هدية لأخيك.",
        "gloss": {
          "en": "Hopefully. I'll send a gift for your brother.",
          "ko": "그러길 바라요. 형님께 선물 보낼게요."
        },
        "frames": [
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "لا داعي، شكرا!",
        "gloss": {
          "en": "There's no need, thanks!",
          "ko": "그럴 필요 없어요, 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "أكيد، هذا واجب!",
        "gloss": {
          "en": "Of course, it's the least I can do!",
          "ko": "당연히 해야죠!"
        }
      }
    ]
  },
  {
    "id": "ar-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for help in a supermarket",
      "ko": "슈퍼마켓에서 도움을 청할 때"
    },
    "expressions": [
      "يعطيك العافية",
      "ممكن"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "مرحبا، هل تحتاج مساعدة؟",
        "gloss": {
          "en": "Hi, do you need help?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، ممكن تساعدني؟ لا أجد الأرز.",
        "gloss": {
          "en": "Yes, could you help me? I can't find the rice.",
          "ko": "네, 좀 도와주실래요? 쌀을 못 찾겠어요."
        },
        "frames": [
          "ar-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "الأرز في الممر الثالث، هناك.",
        "gloss": {
          "en": "The rice is in the third aisle, over there.",
          "ko": "쌀은 저기 세 번째 통로에 있어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. ممكن أترك العربة هنا لحظة؟",
        "gloss": {
          "en": "Thanks. Can I leave the trolley here for a moment?",
          "ko": "고마워요. 카트를 잠깐 여기 둬도 돼요?"
        },
        "frames": [
          "ar-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "ما في مشكلة.",
        "gloss": {
          "en": "No problem.",
          "ko": "괜찮아요."
        }
      },
      {
        "who": "me",
        "text": "أشتري الخبز هنا كل يوم.",
        "gloss": {
          "en": "I buy bread here every day.",
          "ko": "저 매일 여기서 빵 사요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "أهلا وسهلا بك دائما!",
        "gloss": {
          "en": "You're always welcome!",
          "ko": "언제든 환영이에요!"
        }
      },
      {
        "who": "me",
        "text": "يعطيك العافية.",
        "gloss": {
          "en": "Thank you so much.",
          "ko": "수고하세요."
        }
      }
    ]
  },
  {
    "id": "ar-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Coffee break at work",
      "ko": "회사에서 커피 마시는 시간"
    },
    "expressions": [
      "صباح النور",
      "فكرة حلوة"
    ],
    "grammar": [
      0,
      1,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! تبدو تعبان.",
        "gloss": {
          "en": "Good morning! You look tired.",
          "ko": "안녕하세요! 피곤해 보여요."
        }
      },
      {
        "who": "me",
        "text": "صباح النور. نعم، لم أنم جيدا أمس.",
        "gloss": {
          "en": "Good morning. Yes, I didn't sleep well yesterday.",
          "ko": "안녕하세요. 네, 어제 잠을 잘 못 잤어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "لماذا؟",
        "gloss": {
          "en": "Why?",
          "ko": "왜요?"
        }
      },
      {
        "who": "me",
        "text": "لم أنم لأن ابني كان مريضا.",
        "gloss": {
          "en": "I didn't sleep because my son was ill.",
          "ko": "아들이 아파서 못 잤어요."
        },
        "frames": [
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "سلامته! هل تشرب القهوة؟",
        "gloss": {
          "en": "I hope he's better! Do you drink coffee?",
          "ko": "빨리 낫길 바라요! 커피 마셔요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أشرب القهوة كل يوم في المكتب.",
        "gloss": {
          "en": "Yes, I drink coffee every day at the office.",
          "ko": "네, 매일 사무실에서 커피 마셔요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "يلا نشرب قهوة الآن!",
        "gloss": {
          "en": "Let's have a coffee now!",
          "ko": "지금 커피 한잔해요!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! سأحضر الكوب.",
        "gloss": {
          "en": "Great idea! I'll get my mug.",
          "ko": "좋은 생각이에요! 컵 가져올게요."
        },
        "frames": [
          "ar-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for a book recommendation",
      "ko": "서점에서 책을 추천받을 때"
    },
    "expressions": [
      "يعطيك العافية",
      "ماذا تنصح"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا، تبحث عن كتاب؟",
        "gloss": {
          "en": "Hi, are you looking for a book?",
          "ko": "안녕하세요, 책 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "نعم. ماذا تنصح لمبتدئ في العربية؟",
        "gloss": {
          "en": "Yes. What do you recommend for a beginner in Arabic?",
          "ko": "네. 아랍어 초보자한테는 뭘 추천해요?"
        },
        "frames": [
          "ar-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "هذا الكتاب سهل. هل قرأت قصص الأطفال؟",
        "gloss": {
          "en": "This book is easy. Have you read children's stories?",
          "ko": "이 책이 쉬워요. 동화책 읽어 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لم أقرأ قصص أطفال بالعربية من قبل.",
        "gloss": {
          "en": "No, I've never read children's stories in Arabic before.",
          "ko": "아니요, 아랍어 동화책은 읽어 본 적이 없어요."
        },
        "frames": [
          "ar-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "ابدأ بها. هي سهلة وجميلة.",
        "gloss": {
          "en": "Start with them. They're easy and nice.",
          "ko": "그걸로 시작해요. 쉽고 재미있어요."
        }
      },
      {
        "who": "me",
        "text": "أحب القصص القصيرة. سآخذ هذا.",
        "gloss": {
          "en": "I like short stories. I'll take this one.",
          "ko": "짧은 이야기를 좋아해요. 이걸로 할게요."
        },
        "frames": [
          "ar-f2-07",
          "ar-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "اختيار ممتاز.",
        "gloss": {
          "en": "Excellent choice.",
          "ko": "잘 고르셨어요."
        }
      },
      {
        "who": "me",
        "text": "شكرا، يعطيك العافية.",
        "gloss": {
          "en": "Thanks, thank you so much.",
          "ko": "고마워요, 수고하세요."
        }
      }
    ]
  },
  {
    "id": "ar-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Showing a friend around the neighbourhood",
      "ko": "친구에게 동네를 구경시켜 줄 때"
    },
    "expressions": [
      "فكرة حلوة"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "من يسكن في هذا البيت الكبير؟",
        "gloss": {
          "en": "Who lives in this big house?",
          "ko": "이 큰 집엔 누가 살아요?"
        }
      },
      {
        "who": "me",
        "text": "هذا بيت مديري.",
        "gloss": {
          "en": "This is my boss's house.",
          "ko": "우리 사장님 집이에요."
        },
        "frames": [
          "ar-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله! وأنت أين تسكن؟",
        "gloss": {
          "en": "Wow! And where do you live?",
          "ko": "와! 당신은 어디 살아요?"
        }
      },
      {
        "who": "me",
        "text": "أسكن هناك. أمشي إلى العمل كل يوم.",
        "gloss": {
          "en": "I live over there. I walk to work every day.",
          "ko": "저기 살아요. 매일 걸어서 출근해요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "جميل. هل في مطاعم هنا؟",
        "gloss": {
          "en": "Nice. Are there restaurants here?",
          "ko": "좋네요. 여기 식당도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أكلت في مطعم سوري هنا أمس.",
        "gloss": {
          "en": "Yes, I ate at a Syrian restaurant here yesterday.",
          "ko": "네, 어제 여기 시리아 식당에서 먹었어요."
        },
        "frames": [
          "ar-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "يلا نأكل هناك!",
        "gloss": {
          "en": "Let's eat there!",
          "ko": "거기서 먹어요!"
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة! سأدفع أنا اليوم.",
        "gloss": {
          "en": "Great idea! I'll pay today.",
          "ko": "좋은 생각이에요! 오늘은 제가 낼게요."
        },
        "frames": [
          "ar-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ar-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling in sick to your manager",
      "ko": "상사에게 아파서 못 간다고 전화할 때"
    },
    "expressions": [
      "صباح النور",
      "للأسف",
      "الله يسلمك"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو، صباح الخير.",
        "gloss": {
          "en": "Hello, good morning.",
          "ko": "여보세요, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "صباح النور. آسف، عندي حمى منذ الصباح.",
        "gloss": {
          "en": "Good morning. Sorry, I've had a fever since the morning.",
          "ko": "안녕하세요. 죄송한데, 아침부터 열이 나요."
        },
        "frames": [
          "ar-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "سلامتك! هل ستأتي إلى العمل؟",
        "gloss": {
          "en": "Get well soon! Will you come to work?",
          "ko": "저런! 출근할 수 있겠어요?"
        }
      },
      {
        "who": "me",
        "text": "للأسف، لن آتي اليوم.",
        "gloss": {
          "en": "Unfortunately, I won't come today.",
          "ko": "죄송하지만 오늘은 못 가요."
        },
        "frames": [
          "ar-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "لا مشكلة. اذهب إلى الطبيب.",
        "gloss": {
          "en": "No problem. Go to the doctor.",
          "ko": "괜찮아요. 병원에 가 봐요."
        }
      },
      {
        "who": "me",
        "text": "سوف أذهب إلى العيادة بعد الظهر.",
        "gloss": {
          "en": "I'll go to the clinic in the afternoon.",
          "ko": "오후에 병원에 갈 거예요."
        },
        "frames": [
          "ar-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "إن شاء الله تتحسن.",
        "gloss": {
          "en": "I hope you feel better.",
          "ko": "빨리 낫길 바라요."
        }
      },
      {
        "who": "me",
        "text": "الله يسلمك. شكرا.",
        "gloss": {
          "en": "Thank you. Thanks.",
          "ko": "고마워요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ar-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Small talk about the weather at a bus stop",
      "ko": "버스 정류장에서 날씨 이야기"
    },
    "expressions": [],
    "grammar": [
      1,
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "الجو حار جدا اليوم!",
        "gloss": {
          "en": "It's very hot today!",
          "ko": "오늘 정말 덥네요!"
        }
      },
      {
        "who": "me",
        "text": "نعم. لا أحب الصيف هنا.",
        "gloss": {
          "en": "Yes. I don't like the summer here.",
          "ko": "네. 여기 여름은 싫어요."
        },
        "frames": [
          "ar-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "وأنا أيضا. أحب الشتاء أكثر.",
        "gloss": {
          "en": "Me neither. I like winter more.",
          "ko": "저도요. 겨울이 더 좋아요."
        }
      },
      {
        "who": "me",
        "text": "أحب الشتاء لأن الجو بارد ولطيف.",
        "gloss": {
          "en": "I like winter because the weather is cool and pleasant.",
          "ko": "겨울은 시원하고 쾌적해서 좋아요."
        },
        "frames": [
          "ar-f2-07",
          "ar-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "هل جاء الباص؟",
        "gloss": {
          "en": "Has the bus come?",
          "ko": "버스 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "لا. أنتظر هنا عشرين دقيقة كل يوم.",
        "gloss": {
          "en": "No. I wait here twenty minutes every day.",
          "ko": "아니요. 매일 여기서 이십 분씩 기다려요."
        },
        "frames": [
          "ar-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "يا الله! الانتظار صعب في الحر.",
        "gloss": {
          "en": "Oh my! Waiting is hard in the heat.",
          "ko": "어휴! 더울 때 기다리는 건 힘들어요."
        }
      },
      {
        "who": "me",
        "text": "نعم، لا أحب الانتظار.",
        "gloss": {
          "en": "Yes, I don't like waiting.",
          "ko": "맞아요, 기다리는 건 싫어요."
        },
        "frames": [
          "ar-f2-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Viewing flats with an estate agent",
      "ko": "부동산 중개인과 집 보러 갔을 때"
    },
    "expressions": [
      "في رأيي",
      "أظن أن",
      "معك حق"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "إذن، هل أعجبتك الشقتان؟",
        "gloss": {
          "en": "So, did you like both flats?",
          "ko": "그래서 두 집 다 마음에 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، لكن هذه الشقة أوسع من تلك.",
        "gloss": {
          "en": "Yes, but this flat is roomier than that one.",
          "ko": "네, 그런데 이 집이 저 집보다 넓어요."
        },
        "frames": [
          "ar-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "صحيح، لكن الثانية أقرب إلى عملك.",
        "gloss": {
          "en": "True, but the second one is closer to your work.",
          "ko": "맞아요. 그래도 두 번째 집이 회사에서 더 가까워요."
        }
      },
      {
        "who": "me",
        "text": "معك حق، لكنها أغلى قليلا.",
        "gloss": {
          "en": "You're right, but it's a bit more expensive.",
          "ko": "맞아요. 그런데 조금 더 비싸요."
        },
        "frames": [
          "ar-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "ما رأيك؟ أيهما تختار؟",
        "gloss": {
          "en": "What do you think? Which one will you choose?",
          "ko": "어떻게 생각하세요? 어느 집으로 하실래요?"
        }
      },
      {
        "who": "me",
        "text": "في رأيي، المساحة أهم من المسافة.",
        "gloss": {
          "en": "In my opinion, space matters more than distance.",
          "ko": "제 생각엔 거리보다 넓이가 더 중요해요."
        },
        "frames": [
          "ar-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "طيب، لكن يجب أن نقرر اليوم.",
        "gloss": {
          "en": "OK, but we have to decide today.",
          "ko": "좋아요. 그런데 오늘 결정해야 해요."
        }
      },
      {
        "who": "me",
        "text": "أظن أن الأولى أفضل لي.",
        "gloss": {
          "en": "I think the first one is better for me.",
          "ko": "저한테는 첫 번째 집이 나은 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Looking at old photos with a friend",
      "ko": "친구와 옛날 사진을 볼 때"
    },
    "expressions": [
      "بصراحة",
      "معك حق"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "هذه صورتك وأنت صغير؟",
        "gloss": {
          "en": "Is this a photo of you as a child?",
          "ko": "이거 어렸을 때 사진이에요?"
        }
      },
      {
        "who": "me",
        "text": "نعم! كنت أسكن في قرية صغيرة قرب البحر.",
        "gloss": {
          "en": "Yes! I used to live in a small village near the sea.",
          "ko": "네! 바닷가 작은 마을에 살았어요."
        },
        "frames": [
          "ar-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "ما أجمل ذلك! وماذا كنت تفعل هناك؟",
        "gloss": {
          "en": "How lovely! And what did you do there?",
          "ko": "정말 좋네요! 거기서 뭐 하고 지냈어요?"
        }
      },
      {
        "who": "me",
        "text": "كنت أسبح كل يوم مع أصدقائي.",
        "gloss": {
          "en": "I used to swim every day with my friends.",
          "ko": "매일 친구들이랑 수영했어요."
        },
        "frames": [
          "ar-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "وهل ما زلت تسبح؟",
        "gloss": {
          "en": "And do you still swim?",
          "ko": "지금도 수영해요?"
        }
      },
      {
        "who": "me",
        "text": "لا، بصراحة لا أستطيع أن أجد وقتا الآن.",
        "gloss": {
          "en": "No, honestly I can't find the time now.",
          "ko": "아니요, 솔직히 요즘은 시간이 안 나요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "يا خسارة! السباحة رياضة رائعة.",
        "gloss": {
          "en": "What a shame! Swimming is a great sport.",
          "ko": "아깝네요! 수영은 정말 좋은 운동인데."
        }
      },
      {
        "who": "me",
        "text": "معك حق، يجب أن أرجع إلى السباحة.",
        "gloss": {
          "en": "You're right, I should get back to swimming.",
          "ko": "맞아요, 다시 수영을 시작해야겠어요."
        },
        "frames": [
          "ar-f3-15",
          "ar-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a friend after missing a flight",
      "ko": "비행기를 놓치고 친구에게 전화할 때"
    },
    "expressions": [
      "تخيل"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "ألو؟ أين أنت؟ ألم تسافر؟",
        "gloss": {
          "en": "Hello? Where are you? Didn't you fly?",
          "ko": "여보세요? 어디예요? 비행기 안 탔어요?"
        }
      },
      {
        "who": "me",
        "text": "تخيل، فاتتني الطائرة!",
        "gloss": {
          "en": "Imagine, I missed the plane!",
          "ko": "글쎄, 비행기를 놓쳤어요!"
        },
        "frames": [
          "ar-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "يا خسارة! كيف حصل ذلك؟",
        "gloss": {
          "en": "What a shame! How did that happen?",
          "ko": "어떡해요! 어쩌다 그랬어요?"
        }
      },
      {
        "who": "me",
        "text": "كنت أنتظر في المقهى عندما أغلقوا البوابة.",
        "gloss": {
          "en": "I was waiting in the café when they closed the gate.",
          "ko": "카페에서 기다리고 있었는데 그사이 탑승구를 닫았어요."
        },
        "frames": [
          "ar-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "ولا يهمك، المهم أنك بخير. ماذا ستفعل الآن؟",
        "gloss": {
          "en": "Never mind, the main thing is you're OK. What will you do now?",
          "ko": "괜찮아요, 무사하면 됐죠. 이제 어떻게 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "يجب أن أشتري تذكرة جديدة لبكرة.",
        "gloss": {
          "en": "I have to buy a new ticket for tomorrow.",
          "ko": "내일 표를 새로 사야 해요."
        },
        "frames": [
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "إذا احتجت مساعدة، أنا هنا.",
        "gloss": {
          "en": "If you need help, I'm here.",
          "ko": "도움이 필요하면 말해요."
        }
      },
      {
        "who": "me",
        "text": "شكرا، أنت صديق حقيقي.",
        "gloss": {
          "en": "Thanks, you're a true friend.",
          "ko": "고마워요, 역시 좋은 친구예요."
        }
      }
    ]
  },
  {
    "id": "ar-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a film you saw",
      "ko": "본 영화 이야기를 할 때"
    },
    "expressions": [
      "بالعكس",
      "ما رأيك"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "كيف كانت السينما أمس؟",
        "gloss": {
          "en": "How was the cinema yesterday?",
          "ko": "어제 영화관 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "الفيلم الذي شاهدته كان رائعا.",
        "gloss": {
          "en": "The film I watched was great.",
          "ko": "제가 본 영화는 정말 좋았어요."
        },
        "frames": [
          "ar-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "حقا؟ قرأت أن القصة ضعيفة.",
        "gloss": {
          "en": "Really? I read that the story is weak.",
          "ko": "정말요? 줄거리가 약하다고 읽었는데요."
        }
      },
      {
        "who": "me",
        "text": "بالعكس، القصة كانت ذكية ومفاجئة.",
        "gloss": {
          "en": "On the contrary, the story was clever and surprising.",
          "ko": "오히려 줄거리가 똑똑하고 놀라웠어요."
        },
        "frames": [
          "ar-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "طيب، ربما أشاهده في نهاية الأسبوع.",
        "gloss": {
          "en": "OK, maybe I'll watch it at the weekend.",
          "ko": "그래요, 주말에 볼까 봐요."
        }
      },
      {
        "who": "me",
        "text": "أنصحك به. ما رأيك في أفلام الخيال العلمي؟",
        "gloss": {
          "en": "I recommend it. What do you think of science fiction films?",
          "ko": "추천해요. SF 영화는 어떻게 생각해요?"
        },
        "frames": [
          "ar-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "بصراحة، لا أحبها كثيرا.",
        "gloss": {
          "en": "Honestly, I don't like them much.",
          "ko": "솔직히 별로 안 좋아해요."
        }
      },
      {
        "who": "me",
        "text": "إذن ستحب هذا الفيلم، لأنه ليس خيالا علميا.",
        "gloss": {
          "en": "Then you'll like this film, because it isn't science fiction.",
          "ko": "그럼 이 영화는 좋아할 거예요. SF가 아니거든요."
        }
      }
    ]
  },
  {
    "id": "ar-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arranging to pick a friend up at the airport",
      "ko": "공항에 친구를 마중 나갈 약속"
    },
    "expressions": [
      "ولا يهمك"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "طائرتي تصل الساعة الخامسة مساء.",
        "gloss": {
          "en": "My plane lands at five in the evening.",
          "ko": "제 비행기는 저녁 다섯 시에 도착해요."
        }
      },
      {
        "who": "me",
        "text": "ممتاز، سأنتظرك عند باب الوصول.",
        "gloss": {
          "en": "Great, I'll wait for you at the arrivals gate.",
          "ko": "좋아요, 도착 출구에서 기다릴게요."
        }
      },
      {
        "who": "them",
        "text": "وإذا تأخرت الطائرة؟",
        "gloss": {
          "en": "And if the plane is late?",
          "ko": "비행기가 늦으면요?"
        }
      },
      {
        "who": "me",
        "text": "إذا تأخرت الطائرة، اتصل بي.",
        "gloss": {
          "en": "If the plane is late, call me.",
          "ko": "비행기가 늦으면 전화해요."
        },
        "frames": [
          "ar-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "طيب. أو أستطيع أن آخذ تاكسي.",
        "gloss": {
          "en": "OK. Or I can take a taxi.",
          "ko": "알았어요. 아니면 택시를 타도 돼요."
        }
      },
      {
        "who": "me",
        "text": "لا، أستطيع أن آتي بسيارتي، لا مشكلة.",
        "gloss": {
          "en": "No, I can come in my car, no problem.",
          "ko": "아니에요, 제 차로 갈 수 있어요. 괜찮아요."
        },
        "frames": [
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "شكرا جزيلا، أنت لطيف جدا.",
        "gloss": {
          "en": "Thank you so much, you're very kind.",
          "ko": "정말 고마워요, 너무 친절해요."
        }
      },
      {
        "who": "me",
        "text": "ولا يهمك. أريد أن أعرفك على عائلتي أيضا.",
        "gloss": {
          "en": "Don't mention it. I want to introduce you to my family too.",
          "ko": "별말씀을요. 우리 가족도 소개해 주고 싶어요."
        },
        "frames": [
          "ar-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a colleague about a weekend in Alexandria",
      "ko": "동료에게 알렉산드리아 주말 여행 이야기"
    },
    "expressions": [
      "في رأيي",
      "أظن أن"
    ],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "كيف كانت عطلتك في الإسكندرية؟",
        "gloss": {
          "en": "How was your holiday in Alexandria?",
          "ko": "알렉산드리아 여행은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "كانت ممتازة! أولا زرنا القلعة، ثم أكلنا السمك على البحر.",
        "gloss": {
          "en": "It was excellent! First we visited the citadel, then we ate fish by the sea.",
          "ko": "최고였어요! 먼저 성채에 갔다가, 그다음에 바닷가에서 생선을 먹었어요."
        },
        "frames": [
          "ar-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ما شاء الله! وماذا فعلتم بعد ذلك؟",
        "gloss": {
          "en": "Wonderful! And what did you do after that?",
          "ko": "좋네요! 그다음엔 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "بعد ذلك مشينا على الكورنيش حتى المساء.",
        "gloss": {
          "en": "After that we walked along the corniche until evening.",
          "ko": "그 뒤로 저녁까지 해변 산책로를 걸었어요."
        },
        "frames": [
          "ar-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "والجو؟ هل كان حارا؟",
        "gloss": {
          "en": "And the weather? Was it hot?",
          "ko": "날씨는요? 더웠어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، أظن أن الجو هناك ألطف من القاهرة.",
        "gloss": {
          "en": "No, I think the weather there is nicer than Cairo.",
          "ko": "아니요, 거기 날씨가 카이로보다 좋은 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "إذن يجب أن أذهب في الصيف.",
        "gloss": {
          "en": "Then I should go in the summer.",
          "ko": "그럼 여름에 가 봐야겠네요."
        }
      },
      {
        "who": "me",
        "text": "أكيد. في رأيي، هي أجمل مدينة على البحر.",
        "gloss": {
          "en": "Definitely. In my opinion, it's the most beautiful city by the sea.",
          "ko": "꼭 가 보세요. 제 생각엔 바닷가 도시 중에 제일 예뻐요."
        },
        "frames": [
          "ar-f3-12"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Car breakdown: calling a mechanic",
      "ko": "차가 고장 나서 정비소에 전화할 때"
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
        "text": "ألو، ورشة الأمل. تفضل.",
        "gloss": {
          "en": "Hello, Al-Amal garage. Go ahead.",
          "ko": "여보세요, 알아말 정비소입니다. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "مرحبا. كنت أقود إلى العمل عندما سمعت صوتا غريبا.",
        "gloss": {
          "en": "Hello. I was driving to work when I heard a strange noise.",
          "ko": "안녕하세요. 출근하려고 운전하는데 이상한 소리가 났어요."
        },
        "frames": [
          "ar-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "سلامتك! هل يعمل المحرك الآن؟",
        "gloss": {
          "en": "Oh no! Is the engine running now?",
          "ko": "저런! 지금 시동은 걸려요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لا أستطيع أن أشغله.",
        "gloss": {
          "en": "No, I can't start it.",
          "ko": "아니요, 시동이 안 걸려요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "أظن أن المشكلة في البطارية.",
        "gloss": {
          "en": "I think the problem is the battery.",
          "ko": "배터리 문제인 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "يجب أن أكون في اجتماع بعد ساعة. هل تستطيع أن تأتي بسرعة؟",
        "gloss": {
          "en": "I have to be at a meeting in an hour. Can you come quickly?",
          "ko": "한 시간 뒤에 회의가 있어요. 빨리 와 주실 수 있어요?"
        },
        "frames": [
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "سأرسل فنيا خلال نصف ساعة.",
        "gloss": {
          "en": "I'll send a mechanic within half an hour.",
          "ko": "삼십 분 안에 기사를 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "الحمد لله. إذا تأخر، اتصل بي من فضلك.",
        "gloss": {
          "en": "Thank God. If he's late, call me please.",
          "ko": "다행이에요. 늦어지면 전화 주세요."
        },
        "frames": [
          "ar-f3-09"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing where to have dinner with a friend",
      "ko": "친구와 저녁 먹을 곳을 고를 때"
    },
    "expressions": [
      "بصراحة",
      "معك حق",
      "ما رأيك",
      "أنا موافق"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "يلا نأكل في المطعم الجديد في الشارع الثاني.",
        "gloss": {
          "en": "Let's eat at the new restaurant on the next street.",
          "ko": "옆 골목에 새로 생긴 식당에서 먹어요."
        }
      },
      {
        "who": "me",
        "text": "بصراحة، سمعت أنه غالي جدا.",
        "gloss": {
          "en": "Honestly, I heard it's very expensive.",
          "ko": "솔직히 거기 아주 비싸다고 들었어요."
        }
      },
      {
        "who": "them",
        "text": "غالي قليلا، لكن الأكل ممتاز.",
        "gloss": {
          "en": "It's a bit expensive, but the food is excellent.",
          "ko": "조금 비싸지만 음식이 정말 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "ما رأيك في المطعم السوري قرب البيت؟",
        "gloss": {
          "en": "What do you think of the Syrian restaurant near home?",
          "ko": "집 근처 시리아 식당은 어때요?"
        },
        "frames": [
          "ar-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "أكلنا هناك الأسبوع الماضي. أريد شيئا جديدا.",
        "gloss": {
          "en": "We ate there last week. I want something new.",
          "ko": "거긴 지난주에 먹었잖아요. 새로운 데 가고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "معك حق، يجب أن نجرب مكانا جديدا.",
        "gloss": {
          "en": "You're right, we should try a new place.",
          "ko": "맞아요, 새로운 데를 가 봐야겠네요."
        },
        "frames": [
          "ar-f3-15",
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "إذن نذهب الساعة الثامنة؟",
        "gloss": {
          "en": "So shall we go at eight?",
          "ko": "그럼 여덟 시에 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "أنا موافق. أريد أن أحجز طاولة الآن.",
        "gloss": {
          "en": "I agree. I want to book a table now.",
          "ko": "좋아요. 지금 자리 예약할게요."
        },
        "frames": [
          "ar-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend passed the driving test",
      "ko": "친구가 운전면허 시험에 붙었을 때"
    },
    "expressions": [
      "أظن أن",
      "مبروك",
      "أنا موافق"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "عندي خبر! نجحت في امتحان السواقة!",
        "gloss": {
          "en": "I have news! I passed the driving test!",
          "ko": "소식이 있어요! 운전면허 시험에 붙었어요!"
        }
      },
      {
        "who": "me",
        "text": "مبروك! كنت متأكدا أنك ستنجح.",
        "gloss": {
          "en": "Congratulations! I was sure you'd pass.",
          "ko": "축하해요! 붙을 줄 알았어요."
        }
      },
      {
        "who": "them",
        "text": "الله يبارك فيك. الآن أستطيع أن أوصلك إلى العمل.",
        "gloss": {
          "en": "Thank you. Now I can drive you to work.",
          "ko": "고마워요. 이제 회사까지 태워 줄 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "ممتاز! وأنا أستطيع أن أدفع ثمن البنزين.",
        "gloss": {
          "en": "Great! And I can pay for the petrol.",
          "ko": "좋아요! 기름값은 제가 낼게요."
        },
        "frames": [
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ولا يهمك. يلا نحتفل الليلة!",
        "gloss": {
          "en": "Don't worry about it. Let's celebrate tonight!",
          "ko": "신경 쓰지 마요. 오늘 밤에 축하해요!"
        }
      },
      {
        "who": "me",
        "text": "أريد أن أحتفل، لكن عندي عمل كثير الليلة.",
        "gloss": {
          "en": "I want to celebrate, but I have a lot of work tonight.",
          "ko": "축하하고 싶은데 오늘 밤엔 일이 많아요."
        },
        "frames": [
          "ar-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "يا خسارة! إذن يوم الجمعة؟",
        "gloss": {
          "en": "What a shame! Friday, then?",
          "ko": "아쉽네요! 그럼 금요일은요?"
        }
      },
      {
        "who": "me",
        "text": "أظن أن الجمعة مناسب. أنا موافق!",
        "gloss": {
          "en": "I think Friday works. I'm in!",
          "ko": "금요일은 괜찮을 것 같아요. 좋아요!"
        },
        "frames": [
          "ar-f3-13"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a coworker about a promotion",
      "ko": "동료에게 승진 소식을 전할 때"
    },
    "expressions": [
      "أظن أن",
      "الله يبارك فيك",
      "معك حق",
      "بالعكس",
      "تخيل"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "صباح الخير! تبدو سعيدا اليوم.",
        "gloss": {
          "en": "Good morning! You look happy today.",
          "ko": "안녕하세요! 오늘 기분 좋아 보여요."
        }
      },
      {
        "who": "me",
        "text": "تخيل، حصلت على ترقية!",
        "gloss": {
          "en": "Imagine, I got a promotion!",
          "ko": "글쎄, 저 승진했어요!"
        },
        "frames": [
          "ar-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "مبروك! تستحقها.",
        "gloss": {
          "en": "Congratulations! You deserve it.",
          "ko": "축하해요! 그럴 만해요."
        }
      },
      {
        "who": "me",
        "text": "الله يبارك فيك. أظن أن العمل سيكون أصعب الآن.",
        "gloss": {
          "en": "Thank you. I think the work will be harder now.",
          "ko": "고마워요. 이제 일이 더 힘들어질 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "لا تقلق، الأمر سهل عليك.",
        "gloss": {
          "en": "Don't worry, it'll be easy for you.",
          "ko": "걱정 마요, 당신한테는 쉬울 거예요."
        }
      },
      {
        "who": "me",
        "text": "بالعكس، يجب أن أتعلم أشياء كثيرة.",
        "gloss": {
          "en": "On the contrary, I have to learn a lot of things.",
          "ko": "오히려 배울 게 정말 많아요."
        },
        "frames": [
          "ar-f3-17",
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "المهم أن تبدأ بهدوء.",
        "gloss": {
          "en": "The main thing is to start calmly.",
          "ko": "천천히 시작하는 게 중요해요."
        }
      },
      {
        "who": "me",
        "text": "معك حق. سأتكلم مع المدير بكرة.",
        "gloss": {
          "en": "You're right. I'll talk to the manager tomorrow.",
          "ko": "맞아요. 내일 부장님과 이야기해 볼게요."
        },
        "frames": [
          "ar-f3-15"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "At the doctor with back pain",
      "ko": "허리가 아파 병원에 갔을 때"
    },
    "expressions": [],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "سلامتك. ماذا حدث؟",
        "gloss": {
          "en": "Sorry to hear that. What happened?",
          "ko": "어디가 불편하세요? 무슨 일이 있었어요?"
        }
      },
      {
        "who": "me",
        "text": "كنت أرفع صندوقا ثقيلا عندما شعرت بألم في ظهري.",
        "gloss": {
          "en": "I was lifting a heavy box when I felt pain in my back.",
          "ko": "무거운 상자를 들다가 허리가 아팠어요."
        },
        "frames": [
          "ar-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "هل تستطيع أن تنحني؟",
        "gloss": {
          "en": "Can you bend down?",
          "ko": "허리를 숙일 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "لا، لا أستطيع أن أنحني أو أجلس طويلا.",
        "gloss": {
          "en": "No, I can't bend down or sit for long.",
          "ko": "아니요, 숙이지도 오래 앉아 있지도 못해요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "يجب أن ترتاح أسبوعا، ولا ترفع أشياء ثقيلة.",
        "gloss": {
          "en": "You must rest for a week and not lift heavy things.",
          "ko": "일주일 쉬고 무거운 건 들지 마세요."
        }
      },
      {
        "who": "me",
        "text": "لكن يجب أن أذهب إلى العمل. هل أستطيع أن أعمل من البيت؟",
        "gloss": {
          "en": "But I have to go to work. Can I work from home?",
          "ko": "그래도 출근해야 하는데요. 재택근무는 해도 돼요?"
        },
        "frames": [
          "ar-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "نعم، العمل من البيت أفضل.",
        "gloss": {
          "en": "Yes, working from home is better.",
          "ko": "네, 집에서 일하는 게 나아요."
        }
      },
      {
        "who": "me",
        "text": "طيب. وإذا زاد الألم، ماذا أفعل؟",
        "gloss": {
          "en": "OK. And if the pain gets worse, what do I do?",
          "ko": "알겠어요. 더 아프면 어떻게 해요?"
        }
      }
    ]
  },
  {
    "id": "ar-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about last night's football match",
      "ko": "어젯밤 축구 경기 이야기"
    },
    "expressions": [
      "في رأيي",
      "أظن أن"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "هل شاهدت المباراة أمس؟",
        "gloss": {
          "en": "Did you watch the match yesterday?",
          "ko": "어제 경기 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم! في رأيي، الفريق الأحمر لعب أفضل.",
        "gloss": {
          "en": "Yes! In my opinion, the red team played better.",
          "ko": "네! 제 생각엔 빨간 팀이 더 잘했어요."
        },
        "frames": [
          "ar-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "بالعكس، الأزرق كان أقوى في الشوط الثاني.",
        "gloss": {
          "en": "On the contrary, the blue team was stronger in the second half.",
          "ko": "아니에요, 후반전엔 파란 팀이 더 강했어요."
        }
      },
      {
        "who": "me",
        "text": "ممكن، لكن الحكم كان ضعيفا.",
        "gloss": {
          "en": "Maybe, but the referee was weak.",
          "ko": "그럴 수도요. 그런데 심판이 별로였어요."
        }
      },
      {
        "who": "them",
        "text": "معك حق في هذا. وما رأيك في اللاعب الجديد؟",
        "gloss": {
          "en": "You're right about that. And what do you think of the new player?",
          "ko": "그건 맞아요. 새로 온 선수는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "أظن أن أداءه كان ممتازا.",
        "gloss": {
          "en": "I think his performance was excellent.",
          "ko": "정말 잘한 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "والمباراة القادمة؟",
        "gloss": {
          "en": "And the next match?",
          "ko": "다음 경기는요?"
        }
      },
      {
        "who": "me",
        "text": "أريد أن أشاهدها في الملعب هذه المرة.",
        "gloss": {
          "en": "I want to watch it at the stadium this time.",
          "ko": "이번엔 경기장에서 보고 싶어요."
        },
        "frames": [
          "ar-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a day in the old city with a visitor",
      "ko": "놀러 온 친구와 구시가지 하루 계획"
    },
    "expressions": [],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "ماذا نفعل بكرة؟",
        "gloss": {
          "en": "What shall we do tomorrow?",
          "ko": "내일 뭐 할까요?"
        }
      },
      {
        "who": "me",
        "text": "أولا نزور المتحف، ثم نأكل الفلافل في وسط البلد.",
        "gloss": {
          "en": "First we visit the museum, then we eat falafel downtown.",
          "ko": "먼저 박물관에 가고, 그다음에 시내에서 팔라펠을 먹어요."
        },
        "frames": [
          "ar-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "فكرة جميلة. وبعد الأكل؟",
        "gloss": {
          "en": "Nice idea. And after eating?",
          "ko": "좋아요. 먹고 나서는요?"
        }
      },
      {
        "who": "me",
        "text": "بعد ذلك نصعد إلى القلعة لنشاهد الغروب.",
        "gloss": {
          "en": "After that we go up to the citadel to watch the sunset.",
          "ko": "그다음엔 성채에 올라가서 노을을 봐요."
        },
        "frames": [
          "ar-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "وإذا تعبنا من المشي؟",
        "gloss": {
          "en": "And if we get tired of walking?",
          "ko": "걷다가 지치면요?"
        }
      },
      {
        "who": "me",
        "text": "لا تقلق، أستطيع أن أطلب تاكسي بسهولة.",
        "gloss": {
          "en": "Don't worry, I can easily order a taxi.",
          "ko": "걱정 마요, 택시는 쉽게 부를 수 있어요."
        },
        "frames": [
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز. متى نخرج؟",
        "gloss": {
          "en": "Great. When do we leave?",
          "ko": "좋아요. 언제 나가요?"
        }
      },
      {
        "who": "me",
        "text": "يجب أن نخرج مبكرا، لأن المتحف يكون مزدحما.",
        "gloss": {
          "en": "We should leave early, because the museum gets crowded.",
          "ko": "박물관이 붐비니까 일찍 나가야 해요."
        },
        "frames": [
          "ar-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Visiting a friend in hospital",
      "ko": "병원에 입원한 친구를 찾아갔을 때"
    },
    "expressions": [
      "سلامتك",
      "ولا يهمك"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "أهلا! شكرا على الزيارة.",
        "gloss": {
          "en": "Hi! Thanks for visiting.",
          "ko": "안녕! 와 줘서 고마워요."
        }
      },
      {
        "who": "me",
        "text": "سلامتك! كيف تشعر اليوم؟",
        "gloss": {
          "en": "Get well soon! How do you feel today?",
          "ko": "얼른 나아요! 오늘은 좀 어때요?"
        }
      },
      {
        "who": "them",
        "text": "أحسن، الحمد لله. لكن لا أستطيع أن آكل كثيرا.",
        "gloss": {
          "en": "Better, thank God. But I can't eat much.",
          "ko": "좀 나아졌어요. 그런데 많이 못 먹어요."
        }
      },
      {
        "who": "me",
        "text": "أريد أن أساعدك. هل تحتاج شيئا من البيت؟",
        "gloss": {
          "en": "I want to help you. Do you need anything from home?",
          "ko": "도와주고 싶어요. 집에서 필요한 거 있어요?"
        },
        "frames": [
          "ar-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "ممكن تحضر لي كتابي؟",
        "gloss": {
          "en": "Could you bring me my book?",
          "ko": "제 책 좀 가져다줄래요?"
        }
      },
      {
        "who": "me",
        "text": "أكيد. إذا احتجت أي شيء آخر، اتصل بي.",
        "gloss": {
          "en": "Sure. If you need anything else, call me.",
          "ko": "그럼요. 다른 거 필요하면 전화해요."
        },
        "frames": [
          "ar-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "الله يخليك.",
        "gloss": {
          "en": "Bless you.",
          "ko": "정말 고마워요."
        }
      },
      {
        "who": "me",
        "text": "ولا يهمك. يجب أن ترتاح الآن.",
        "gloss": {
          "en": "Don't mention it. You must rest now.",
          "ko": "별말씀을요. 이제 좀 쉬어요."
        },
        "frames": [
          "ar-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a new colleague where you used to live",
      "ko": "새 동료에게 예전에 살던 곳 이야기"
    },
    "expressions": [
      "في رأيي",
      "معك حق",
      "على الأقل"
    ],
    "grammar": [
      0,
      1,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "أين كنت تعيش قبل عمان؟",
        "gloss": {
          "en": "Where did you live before Amman?",
          "ko": "암만 오기 전엔 어디 살았어요?"
        }
      },
      {
        "who": "me",
        "text": "كنت أعيش في سيول، وكنت أعمل في بنك.",
        "gloss": {
          "en": "I used to live in Seoul, and I used to work at a bank.",
          "ko": "서울에 살았고, 은행에서 일했어요."
        },
        "frames": [
          "ar-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "وأيهما أفضل؟ سيول أم عمان؟",
        "gloss": {
          "en": "And which is better? Seoul or Amman?",
          "ko": "어디가 더 좋아요? 서울이요, 암만이요?"
        }
      },
      {
        "who": "me",
        "text": "صعب! في رأيي، الحياة في عمان أهدأ.",
        "gloss": {
          "en": "That's hard! In my opinion, life in Amman is calmer.",
          "ko": "어렵네요! 제 생각엔 암만 생활이 더 여유로워요."
        },
        "frames": [
          "ar-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "صحيح، لكن الجو هنا حار في الصيف.",
        "gloss": {
          "en": "True, but it's hot here in the summer.",
          "ko": "맞아요. 그런데 여기 여름은 덥잖아요."
        }
      },
      {
        "who": "me",
        "text": "معك حق، لكن على الأقل الشتاء ليس باردا جدا.",
        "gloss": {
          "en": "You're right, but at least the winter isn't very cold.",
          "ko": "맞아요. 그래도 겨울이 그렇게 춥지는 않잖아요."
        },
        "frames": [
          "ar-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "هل تشتاق إلى كوريا؟",
        "gloss": {
          "en": "Do you miss Korea?",
          "ko": "한국이 그리워요?"
        }
      },
      {
        "who": "me",
        "text": "أكيد، أريد أن أزور أهلي في الصيف.",
        "gloss": {
          "en": "Of course, I want to visit my family in the summer.",
          "ko": "물론이죠. 여름에 가족을 보러 가고 싶어요."
        },
        "frames": [
          "ar-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Lost wallet at a café",
      "ko": "카페에서 지갑을 잃어버렸을 때"
    },
    "expressions": [
      "أظن أن",
      "تخيل"
    ],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير، هل تحتاج مساعدة؟",
        "gloss": {
          "en": "Good evening, do you need help?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "نعم، أظن أن محفظتي سقطت هنا.",
        "gloss": {
          "en": "Yes, I think my wallet fell here.",
          "ko": "네, 여기서 지갑을 떨어뜨린 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "أين كنت تجلس؟",
        "gloss": {
          "en": "Where were you sitting?",
          "ko": "어디 앉아 계셨어요?"
        }
      },
      {
        "who": "me",
        "text": "كنت أجلس عند الشباك عندما جاء صديقي.",
        "gloss": {
          "en": "I was sitting by the window when my friend came.",
          "ko": "친구가 왔을 때 창가에 앉아 있었어요."
        },
        "frames": [
          "ar-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "لحظة... هل هذه محفظتك السوداء؟",
        "gloss": {
          "en": "One moment... is this your black wallet?",
          "ko": "잠깐만요... 이 검은 지갑이 손님 거예요?"
        }
      },
      {
        "who": "me",
        "text": "نعم! تخيل، كل شيء ما زال فيها!",
        "gloss": {
          "en": "Yes! Imagine, everything is still in it!",
          "ko": "네! 세상에, 안에 있던 게 다 그대로예요!"
        },
        "frames": [
          "ar-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "المهم أنك وجدتها.",
        "gloss": {
          "en": "The main thing is you found it.",
          "ko": "찾았으니 다행이에요."
        }
      },
      {
        "who": "me",
        "text": "شكرا جزيلا. إذا رأيت مفاتيحي أيضا، اتصل بي من فضلك.",
        "gloss": {
          "en": "Thank you so much. If you see my keys too, call me please.",
          "ko": "정말 고마워요. 제 열쇠도 보이면 전화 주세요."
        },
        "frames": [
          "ar-f3-09"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a film for movie night",
      "ko": "영화 보는 밤에 볼 영화를 고를 때"
    },
    "expressions": [
      "ما رأيك"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "ماذا نشاهد الليلة؟",
        "gloss": {
          "en": "What shall we watch tonight?",
          "ko": "오늘 밤에 뭐 볼까요?"
        }
      },
      {
        "who": "me",
        "text": "الفيلم الذي شاهدته في الطائرة كان رائعا.",
        "gloss": {
          "en": "The film I watched on the plane was great.",
          "ko": "비행기에서 본 영화가 정말 좋았어요."
        },
        "frames": [
          "ar-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "لكنك شاهدته من قبل.",
        "gloss": {
          "en": "But you've already seen it.",
          "ko": "그건 이미 봤잖아요."
        }
      },
      {
        "who": "me",
        "text": "لا مشكلة، أستطيع أن أشاهده مرة ثانية.",
        "gloss": {
          "en": "No problem, I can watch it again.",
          "ko": "괜찮아요, 한 번 더 봐도 돼요."
        },
        "frames": [
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "بصراحة، أفضل فيلما مضحكا.",
        "gloss": {
          "en": "Honestly, I'd prefer a funny film.",
          "ko": "솔직히 웃긴 영화가 좋아요."
        }
      },
      {
        "who": "me",
        "text": "طيب، ما رأيك في فيلم كوميدي مصري؟",
        "gloss": {
          "en": "OK, what do you think of an Egyptian comedy?",
          "ko": "그럼 이집트 코미디 영화는 어때요?"
        },
        "frames": [
          "ar-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "فكرة ممتازة! وأنا سأحضر الفشار.",
        "gloss": {
          "en": "Great idea! And I'll bring the popcorn.",
          "ko": "좋아요! 팝콘은 제가 가져올게요."
        }
      },
      {
        "who": "me",
        "text": "وأنا يجب أن أشتري العصير.",
        "gloss": {
          "en": "And I need to buy the juice.",
          "ko": "그럼 저는 주스를 사 와야겠네요."
        },
        "frames": [
          "ar-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking with your teacher about your Arabic",
      "ko": "선생님과 아랍어 실력 이야기"
    },
    "expressions": [
      "أظن أن"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "كيف عربيتك الآن؟",
        "gloss": {
          "en": "How is your Arabic now?",
          "ko": "요즘 아랍어 실력은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "أستطيع أن أقرأ الآن، لكن ببطء.",
        "gloss": {
          "en": "I can read now, but slowly.",
          "ko": "이제 읽을 수는 있는데, 아직 느려요."
        },
        "frames": [
          "ar-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "ممتاز! وماذا عن الكلام؟",
        "gloss": {
          "en": "Excellent! And what about speaking?",
          "ko": "잘했어요! 말하기는요?"
        }
      },
      {
        "who": "me",
        "text": "لا أستطيع أن أفهم الناس عندما يتكلمون بسرعة.",
        "gloss": {
          "en": "I can't understand people when they speak fast.",
          "ko": "사람들이 빨리 말하면 못 알아들어요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "هذا طبيعي. يجب أن تسمع أكثر.",
        "gloss": {
          "en": "That's normal. You should listen more.",
          "ko": "그건 당연해요. 더 많이 들어야 해요."
        }
      },
      {
        "who": "me",
        "text": "أريد أن أشاهد مسلسلات عربية. ماذا تنصح؟",
        "gloss": {
          "en": "I want to watch Arabic series. What do you recommend?",
          "ko": "아랍 드라마를 보고 싶어요. 뭘 추천해요?"
        },
        "frames": [
          "ar-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "ابدأ بمسلسل بسيط مع ترجمة.",
        "gloss": {
          "en": "Start with a simple series with subtitles.",
          "ko": "자막 있는 쉬운 드라마부터 시작해요."
        }
      },
      {
        "who": "me",
        "text": "فكرة حلوة. أظن أن هذا سيساعدني كثيرا.",
        "gloss": {
          "en": "Great idea. I think that will help me a lot.",
          "ko": "좋은 생각이에요. 그게 많이 도움이 될 것 같아요."
        },
        "frames": [
          "ar-f3-13"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking to a neighbour about noise at night",
      "ko": "이웃에게 밤 소음 이야기를 할 때"
    },
    "expressions": [
      "بصراحة",
      "بالعكس"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "مساء الخير يا جاري. هل كل شيء بخير؟",
        "gloss": {
          "en": "Good evening, neighbour. Is everything OK?",
          "ko": "안녕하세요. 별일 없으시죠?"
        }
      },
      {
        "who": "me",
        "text": "مساء النور. بصراحة، الصوت من شقتكم عال في الليل.",
        "gloss": {
          "en": "Good evening. Honestly, the noise from your flat is loud at night.",
          "ko": "안녕하세요. 솔직히 밤에 댁에서 나는 소리가 커요."
        }
      },
      {
        "who": "them",
        "text": "آسف! لكن نحن ننام مبكرا.",
        "gloss": {
          "en": "Sorry! But we go to bed early.",
          "ko": "죄송해요! 그런데 저희는 일찍 자는데요."
        }
      },
      {
        "who": "me",
        "text": "بالعكس، أسمع الموسيقى حتى منتصف الليل تقريبا.",
        "gloss": {
          "en": "Not at all, I hear music until almost midnight.",
          "ko": "아니에요, 거의 자정까지 음악 소리가 들려요."
        },
        "frames": [
          "ar-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "آه، أظن أن هذا ابني. يدرس مع الموسيقى.",
        "gloss": {
          "en": "Oh, I think that's my son. He studies with music on.",
          "ko": "아, 우리 아들인가 봐요. 음악 틀고 공부하거든요."
        }
      },
      {
        "who": "me",
        "text": "لا أستطيع أن أنام، وعندي عمل مبكرا.",
        "gloss": {
          "en": "I can't sleep, and I have work early.",
          "ko": "잠을 못 자요. 아침 일찍 출근도 해야 하고요."
        },
        "frames": [
          "ar-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "حصل خير. سأتكلم معه الليلة.",
        "gloss": {
          "en": "No harm done. I'll talk to him tonight.",
          "ko": "괜찮아요. 오늘 밤에 아들한테 말할게요."
        }
      },
      {
        "who": "me",
        "text": "شكرا. إذا احتجت شيئا، اتصل بي.",
        "gloss": {
          "en": "Thanks. If you need anything, call me.",
          "ko": "고마워요. 필요한 거 있으면 연락 주세요."
        },
        "frames": [
          "ar-f3-09"
        ]
      }
    ]
  },
  {
    "id": "ar-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend about a busy day",
      "ko": "친구에게 바빴던 하루 이야기"
    },
    "expressions": [
      "معك حق"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "أين كنت اليوم؟ اتصلت بك مرتين.",
        "gloss": {
          "en": "Where were you today? I called you twice.",
          "ko": "오늘 어디 있었어요? 두 번이나 전화했는데."
        }
      },
      {
        "who": "me",
        "text": "آسف! كنت أتكلم مع موظف البنك عندما اتصلت.",
        "gloss": {
          "en": "Sorry! I was talking to the bank clerk when you called.",
          "ko": "미안해요! 전화했을 때 은행 직원이랑 이야기하고 있었어요."
        },
        "frames": [
          "ar-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "لا مشكلة. هل كان يومك صعبا؟",
        "gloss": {
          "en": "No problem. Was your day hard?",
          "ko": "괜찮아요. 오늘 힘들었어요?"
        }
      },
      {
        "who": "me",
        "text": "نعم! أولا ذهبت إلى البنك، ثم إلى البريد.",
        "gloss": {
          "en": "Yes! First I went to the bank, then to the post office.",
          "ko": "네! 먼저 은행에 갔다가, 그다음에 우체국에 갔어요."
        },
        "frames": [
          "ar-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "وبعد ذلك؟",
        "gloss": {
          "en": "And after that?",
          "ko": "그다음엔요?"
        }
      },
      {
        "who": "me",
        "text": "بعد ذلك نسيت مفاتيحي في البريد، ورجعت مرة ثانية!",
        "gloss": {
          "en": "After that I forgot my keys at the post office and went back again!",
          "ko": "그 뒤엔 우체국에 열쇠를 두고 와서 다시 갔어요!"
        },
        "frames": [
          "ar-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "يا خسارة! على الأقل وجدتها.",
        "gloss": {
          "en": "What a pain! At least you found them.",
          "ko": "저런! 그래도 찾았으니 다행이에요."
        }
      },
      {
        "who": "me",
        "text": "معك حق، الحمد لله.",
        "gloss": {
          "en": "You're right, thank God.",
          "ko": "맞아요, 다행이에요."
        },
        "frames": [
          "ar-f3-15"
        ]
      }
    ]
  }
];
