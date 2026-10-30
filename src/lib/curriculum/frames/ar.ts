import type { Frame } from "../frames.ts";

/** 아랍어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const AR_FRAMES: Frame[] = [
  {
    "id": "ar-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "اسمي ___.",
    "core": [
      "اسمي"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "تشرفنا",
      "مرحبا"
    ],
    "examples": [
      {
        "text": "اسمي جي وو.",
        "slot": "جي وو",
        "cue": {
          "en": "Ji-woo (your name)",
          "ko": "지우(내 이름)"
        },
        "gloss": {
          "en": "My name is Ji-woo.",
          "ko": "제 이름은 지우예요."
        }
      },
      {
        "text": "مرحبا، اسمي سارة. تشرفنا.",
        "slot": "سارة",
        "cue": {
          "en": "Sara",
          "ko": "사라"
        },
        "gloss": {
          "en": "Hello, my name is Sara. Nice to meet you.",
          "ko": "안녕하세요, 제 이름은 사라예요. 반가워요."
        }
      },
      {
        "text": "اسمي أحمد، وما اسمك؟",
        "slot": "أحمد",
        "cue": {
          "en": "Ahmad",
          "ko": "아흐마드"
        },
        "gloss": {
          "en": "My name is Ahmad, and what's your name?",
          "ko": "제 이름은 아흐마드예요, 당신 이름은요?"
        }
      },
      {
        "text": "اسمي مين هو.",
        "slot": "مين هو",
        "cue": {
          "en": "Min-ho",
          "ko": "민호"
        },
        "gloss": {
          "en": "My name is Min-ho.",
          "ko": "제 이름은 민호예요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "أنا من ___.",
    "core": [
      "أنا من"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "어디서 왔는지 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أنا من كوريا.",
        "slot": "كوريا",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        }
      },
      {
        "text": "أنا من سول.",
        "slot": "سول",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I'm from Seoul.",
          "ko": "저는 서울에서 왔어요."
        }
      },
      {
        "text": "أنا من مصر. وأنت؟",
        "slot": "مصر",
        "cue": {
          "en": "Egypt",
          "ko": "이집트"
        },
        "gloss": {
          "en": "I'm from Egypt. And you?",
          "ko": "저는 이집트에서 왔어요. 당신은요?"
        }
      },
      {
        "text": "أنا من المغرب.",
        "slot": "المغرب",
        "cue": {
          "en": "Morocco",
          "ko": "모로코"
        },
        "gloss": {
          "en": "I'm from Morocco.",
          "ko": "저는 모로코에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "أنا ___.",
    "core": [
      "أنا"
    ],
    "meaning": {
      "en": "Saying what you are: I'm a ___.",
      "ko": "하는 일 말하기: 저는 ___예요."
    },
    "grammar": [
      0,
      1,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أنا طالب.",
        "slot": "طالب",
        "cue": {
          "en": "student (man)",
          "ko": "학생(남자)"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "أنا طالبة.",
        "slot": "طالبة",
        "cue": {
          "en": "student (woman)",
          "ko": "학생(여자)"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "أنا مهندسة.",
        "slot": "مهندسة",
        "cue": {
          "en": "engineer (woman)",
          "ko": "엔지니어(여자)"
        },
        "gloss": {
          "en": "I'm an engineer.",
          "ko": "저는 엔지니어예요."
        }
      },
      {
        "text": "أنا طبيب في مستشفى.",
        "slot": "طبيب",
        "cue": {
          "en": "doctor (man)",
          "ko": "의사(남자)"
        },
        "gloss": {
          "en": "I'm a doctor in a hospital.",
          "ko": "저는 병원 의사예요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-04",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "أين ___؟",
    "core": [
      "أين"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디예요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "أين الحمام",
      "من فضلك"
    ],
    "examples": [
      {
        "text": "أين الحمام، من فضلك؟",
        "slot": "الحمام",
        "cue": {
          "en": "the toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where's the toilet, please?",
          "ko": "화장실이 어디예요?"
        }
      },
      {
        "text": "أين محطة المترو؟",
        "slot": "محطة المترو",
        "cue": {
          "en": "the metro station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Where's the metro station?",
          "ko": "지하철역이 어디예요?"
        }
      },
      {
        "text": "أين الفندق؟",
        "slot": "الفندق",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "Where's the hotel?",
          "ko": "호텔이 어디예요?"
        }
      },
      {
        "text": "أين السوق، من فضلك؟",
        "slot": "السوق",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "Where's the market, please?",
          "ko": "시장이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-05",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "بكم ___؟",
    "core": [
      "بكم"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      4,
      5
    ],
    "expressions": [
      "بكم هذا"
    ],
    "examples": [
      {
        "text": "بكم هذا؟",
        "slot": "هذا",
        "cue": {
          "en": "this (thing)",
          "ko": "이것"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "بكم هذه الحقيبة؟",
        "slot": "هذه الحقيبة",
        "cue": {
          "en": "this bag",
          "ko": "이 가방"
        },
        "gloss": {
          "en": "How much is this bag?",
          "ko": "이 가방 얼마예요?"
        }
      },
      {
        "text": "بكم كيلو التفاح؟",
        "slot": "كيلو التفاح",
        "cue": {
          "en": "a kilo of apples",
          "ko": "사과 1킬로"
        },
        "gloss": {
          "en": "How much is a kilo of apples?",
          "ko": "사과 1킬로에 얼마예요?"
        }
      },
      {
        "text": "بكم التذكرة؟",
        "slot": "التذكرة",
        "cue": {
          "en": "the ticket",
          "ko": "표"
        },
        "gloss": {
          "en": "How much is the ticket?",
          "ko": "표가 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-06",
    "stage": 1,
    "fn": "want",
    "pattern": "أريد ___، من فضلك.",
    "core": [
      "أريد"
    ],
    "meaning": {
      "en": "Saying what you want: I'd like ___, please.",
      "ko": "원하는 것 말하기: ___ 주세요."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "من فضلك"
    ],
    "examples": [
      {
        "text": "أريد كيلو تفاح، من فضلك.",
        "slot": "كيلو تفاح",
        "cue": {
          "en": "a kilo of apples",
          "ko": "사과 1킬로"
        },
        "gloss": {
          "en": "I'd like a kilo of apples, please.",
          "ko": "사과 1킬로 주세요."
        }
      },
      {
        "text": "أريد ماء، من فضلك.",
        "slot": "ماء",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "I'd like some water, please.",
          "ko": "물 주세요."
        }
      },
      {
        "text": "أريد غرفة لليلتين، من فضلك.",
        "slot": "غرفة لليلتين",
        "cue": {
          "en": "a room for two nights",
          "ko": "이틀 밤 묵을 방"
        },
        "gloss": {
          "en": "I'd like a room for two nights, please.",
          "ko": "이틀 묵을 방을 원해요."
        }
      },
      {
        "text": "أريد قهوة، من فضلك.",
        "slot": "قهوة",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "I'd like a coffee, please.",
          "ko": "커피 주세요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-07",
    "stage": 1,
    "fn": "have",
    "pattern": "عندي ___.",
    "core": [
      "عندي"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___이 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "عندي حجز.",
        "slot": "حجز",
        "cue": {
          "en": "a reservation",
          "ko": "예약"
        },
        "gloss": {
          "en": "I have a reservation.",
          "ko": "예약했어요."
        }
      },
      {
        "text": "عندي سؤال.",
        "slot": "سؤال",
        "cue": {
          "en": "a question",
          "ko": "질문"
        },
        "gloss": {
          "en": "I have a question.",
          "ko": "질문이 있어요."
        }
      },
      {
        "text": "عندي أخ وأخت.",
        "slot": "أخ وأخت",
        "cue": {
          "en": "a brother and a sister",
          "ko": "형제 한 명과 자매 한 명"
        },
        "gloss": {
          "en": "I have a brother and a sister.",
          "ko": "형제 한 명, 자매 한 명이 있어요."
        }
      },
      {
        "text": "عندي موعد اليوم.",
        "slot": "موعد",
        "cue": {
          "en": "an appointment",
          "ko": "약속"
        },
        "gloss": {
          "en": "I have an appointment today.",
          "ko": "오늘 약속이 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-08",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "عندك ___؟",
    "core": [
      "عندك"
    ],
    "meaning": {
      "en": "Asking if someone has something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      3,
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "عندك ماء؟",
        "slot": "ماء",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Do you have water?",
          "ko": "물 있어요?"
        }
      },
      {
        "text": "عندك غرفة لليلة واحدة؟",
        "slot": "غرفة لليلة واحدة",
        "cue": {
          "en": "a room for one night",
          "ko": "하룻밤 묵을 방"
        },
        "gloss": {
          "en": "Do you have a room for one night?",
          "ko": "하룻밤 묵을 방 있어요?"
        }
      },
      {
        "text": "عندك قلم؟",
        "slot": "قلم",
        "cue": {
          "en": "a pen",
          "ko": "펜"
        },
        "gloss": {
          "en": "Do you have a pen?",
          "ko": "펜 있어요?"
        }
      },
      {
        "text": "عندك خريطة؟",
        "slot": "خريطة",
        "cue": {
          "en": "a map",
          "ko": "지도"
        },
        "gloss": {
          "en": "Do you have a map?",
          "ko": "지도 있어요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-09",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "ما ___؟",
    "core": [
      "ما"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___이 뭐예요?"
    },
    "grammar": [
      3,
      4,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ما اسمك؟",
        "slot": "اسمك",
        "cue": {
          "en": "your name",
          "ko": "당신 이름"
        },
        "gloss": {
          "en": "What's your name?",
          "ko": "이름이 뭐예요?"
        }
      },
      {
        "text": "ما هذا؟",
        "slot": "هذا",
        "cue": {
          "en": "this (thing)",
          "ko": "이것"
        },
        "gloss": {
          "en": "What's this?",
          "ko": "이게 뭐예요?"
        }
      },
      {
        "text": "ما رقم الغرفة؟",
        "slot": "رقم الغرفة",
        "cue": {
          "en": "the room number",
          "ko": "방 번호"
        },
        "gloss": {
          "en": "What's the room number?",
          "ko": "방 번호가 뭐예요?"
        }
      },
      {
        "text": "ما هذه الفاكهة؟",
        "slot": "هذه الفاكهة",
        "cue": {
          "en": "this fruit",
          "ko": "이 과일"
        },
        "gloss": {
          "en": "What's this fruit?",
          "ko": "이 과일은 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-10",
    "stage": 1,
    "fn": "greet",
    "pattern": "مرحبا يا ___، كيف حالك؟",
    "core": [
      "مرحبا"
    ],
    "meaning": {
      "en": "Greeting someone by name: Hi, ___, how are you?",
      "ko": "이름 불러 인사하기: 안녕, ___, 잘 지내요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "مرحبا",
      "كيف حالك"
    ],
    "examples": [
      {
        "text": "مرحبا يا سارة، كيف حالك؟",
        "slot": "سارة",
        "cue": {
          "en": "Sara",
          "ko": "사라"
        },
        "gloss": {
          "en": "Hi, Sara, how are you?",
          "ko": "안녕, 사라, 잘 지내요?"
        }
      },
      {
        "text": "مرحبا يا أحمد، كيف حالك؟",
        "slot": "أحمد",
        "cue": {
          "en": "Ahmad",
          "ko": "아흐마드"
        },
        "gloss": {
          "en": "Hi, Ahmad, how are you?",
          "ko": "안녕, 아흐마드, 잘 지내요?"
        }
      },
      {
        "text": "مرحبا يا ليلى، كيف حالك؟",
        "slot": "ليلى",
        "cue": {
          "en": "Layla",
          "ko": "레일라"
        },
        "gloss": {
          "en": "Hi, Layla, how are you?",
          "ko": "안녕, 레일라, 잘 지내요?"
        }
      },
      {
        "text": "مرحبا يا عمر، كيف حالك؟",
        "slot": "عمر",
        "cue": {
          "en": "Omar",
          "ko": "오마르"
        },
        "gloss": {
          "en": "Hi, Omar, how are you?",
          "ko": "안녕, 오마르, 잘 지내요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-11",
    "stage": 1,
    "fn": "thank",
    "pattern": "شكرا على ___.",
    "core": [
      "شكرا على"
    ],
    "meaning": {
      "en": "Thanking for something: Thanks for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [],
    "expressions": [
      "شكرا"
    ],
    "examples": [
      {
        "text": "شكرا على المساعدة.",
        "slot": "المساعدة",
        "cue": {
          "en": "the help",
          "ko": "도움"
        },
        "gloss": {
          "en": "Thanks for the help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "شكرا على القهوة.",
        "slot": "القهوة",
        "cue": {
          "en": "the coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Thanks for the coffee.",
          "ko": "커피 고마워요."
        }
      },
      {
        "text": "شكرا على وقتك.",
        "slot": "وقتك",
        "cue": {
          "en": "your time",
          "ko": "시간 내 준 것"
        },
        "gloss": {
          "en": "Thanks for your time.",
          "ko": "시간 내 줘서 고마워요."
        }
      },
      {
        "text": "شكرا على الهدية.",
        "slot": "الهدية",
        "cue": {
          "en": "the present",
          "ko": "선물"
        },
        "gloss": {
          "en": "Thanks for the present.",
          "ko": "선물 고마워요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-12",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "لا أفهم ___.",
    "core": [
      "لا أفهم"
    ],
    "meaning": {
      "en": "Saying you don't understand: I don't understand ___.",
      "ko": "모르겠다고 말하기: ___을 이해 못 하겠어요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "لا أفهم",
      "آسف"
    ],
    "examples": [
      {
        "text": "لا أفهم هذه الكلمة.",
        "slot": "هذه الكلمة",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "I don't understand this word.",
          "ko": "이 단어를 모르겠어요."
        }
      },
      {
        "text": "لا أفهم السؤال.",
        "slot": "السؤال",
        "cue": {
          "en": "the question",
          "ko": "질문"
        },
        "gloss": {
          "en": "I don't understand the question.",
          "ko": "질문을 이해 못 하겠어요."
        }
      },
      {
        "text": "آسف، لا أفهم هذا.",
        "slot": "هذا",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "Sorry, I don't understand this.",
          "ko": "죄송해요, 이건 이해가 안 돼요."
        }
      },
      {
        "text": "لا أفهم العربية جيدا.",
        "slot": "العربية",
        "cue": {
          "en": "Arabic",
          "ko": "아랍어"
        },
        "gloss": {
          "en": "I don't understand Arabic well.",
          "ko": "아랍어를 잘 못 알아들어요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-13",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "___، من فضلك.",
    "core": [
      "من فضلك"
    ],
    "meaning": {
      "en": "Asking someone to repeat or slow down: ___, please.",
      "ko": "다시·천천히 말해 달라고 하기: ___ 부탁해요."
    },
    "grammar": [],
    "expressions": [
      "مرة ثانية",
      "شوي شوي",
      "من فضلك"
    ],
    "examples": [
      {
        "text": "مرة ثانية، من فضلك.",
        "slot": "مرة ثانية",
        "cue": {
          "en": "once more",
          "ko": "한 번 더"
        },
        "gloss": {
          "en": "Once more, please.",
          "ko": "한 번 더 말해 주세요."
        }
      },
      {
        "text": "شوي شوي، من فضلك.",
        "slot": "شوي شوي",
        "cue": {
          "en": "slowly",
          "ko": "천천히"
        },
        "gloss": {
          "en": "Slowly, please.",
          "ko": "천천히 말해 주세요."
        }
      },
      {
        "text": "ببطء، من فضلك.",
        "slot": "ببطء",
        "cue": {
          "en": "slowly (formal)",
          "ko": "천천히(격식)"
        },
        "gloss": {
          "en": "Slowly, please.",
          "ko": "천천히 부탁드려요."
        }
      },
      {
        "text": "اكتبها، من فضلك.",
        "slot": "اكتبها",
        "cue": {
          "en": "write it",
          "ko": "써 주기"
        },
        "gloss": {
          "en": "Write it down, please.",
          "ko": "써 주세요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-14",
    "stage": 1,
    "fn": "possession",
    "pattern": "هذا ___.",
    "core": [
      "هذا",
      "هذه"
    ],
    "meaning": {
      "en": "Saying whose something is: This is my / your ___.",
      "ko": "누구 것인지 말하기: 이건 제(당신) ___예요."
    },
    "grammar": [
      2,
      3,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "هذه حقيبتي.",
        "slot": "حقيبتي",
        "cue": {
          "en": "my bag",
          "ko": "내 가방"
        },
        "gloss": {
          "en": "This is my bag.",
          "ko": "이건 제 가방이에요."
        }
      },
      {
        "text": "هذا مفتاحي.",
        "slot": "مفتاحي",
        "cue": {
          "en": "my key",
          "ko": "내 열쇠"
        },
        "gloss": {
          "en": "This is my key.",
          "ko": "이건 제 열쇠예요."
        }
      },
      {
        "text": "هذا جواز سفري.",
        "slot": "جواز سفري",
        "cue": {
          "en": "my passport",
          "ko": "내 여권"
        },
        "gloss": {
          "en": "This is my passport.",
          "ko": "이건 제 여권이에요."
        }
      },
      {
        "text": "هذه غرفتك؟",
        "slot": "غرفتك",
        "cue": {
          "en": "your room",
          "ko": "당신 방"
        },
        "gloss": {
          "en": "Is this your room?",
          "ko": "여기가 당신 방이에요?"
        }
      }
    ]
  },
  {
    "id": "ar-f1-15",
    "stage": 1,
    "fn": "job",
    "pattern": "هو ___.",
    "core": [
      "هو",
      "هي"
    ],
    "meaning": {
      "en": "Saying what someone does: He / She is a ___.",
      "ko": "다른 사람의 일 말하기: 그(그녀)는 ___예요."
    },
    "grammar": [
      0,
      1,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "هو طبيب.",
        "slot": "طبيب",
        "cue": {
          "en": "doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "He's a doctor.",
          "ko": "그는 의사예요."
        }
      },
      {
        "text": "هي مهندسة.",
        "slot": "مهندسة",
        "cue": {
          "en": "engineer (woman)",
          "ko": "엔지니어(여자)"
        },
        "gloss": {
          "en": "She's an engineer.",
          "ko": "그녀는 엔지니어예요."
        }
      },
      {
        "text": "هي ممرضة في المستشفى.",
        "slot": "ممرضة",
        "cue": {
          "en": "nurse (woman)",
          "ko": "간호사(여자)"
        },
        "gloss": {
          "en": "She's a nurse at the hospital.",
          "ko": "그녀는 병원 간호사예요."
        }
      },
      {
        "text": "هو سائق تاكسي.",
        "slot": "سائق تاكسي",
        "cue": {
          "en": "taxi driver",
          "ko": "택시 기사"
        },
        "gloss": {
          "en": "He's a taxi driver.",
          "ko": "그는 택시 기사예요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-16",
    "stage": 1,
    "fn": "location-now",
    "pattern": "أنا في ___.",
    "core": [
      "أنا في"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm at / in ___.",
      "ko": "지금 있는 곳 말하기: 저는 ___에 있어요."
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أنا في الفندق.",
        "slot": "الفندق",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "I'm at the hotel.",
          "ko": "저는 호텔에 있어요."
        }
      },
      {
        "text": "أنا في السوق الآن.",
        "slot": "السوق",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "I'm at the market now.",
          "ko": "지금 시장에 있어요."
        }
      },
      {
        "text": "أنا في محطة المترو.",
        "slot": "محطة المترو",
        "cue": {
          "en": "the metro station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "I'm at the metro station.",
          "ko": "지하철역에 있어요."
        }
      },
      {
        "text": "أنا في البيت.",
        "slot": "البيت",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home.",
          "ko": "집에 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f1-17",
    "stage": 1,
    "fn": "apologize",
    "pattern": "آسف، ___.",
    "core": [
      "آسف"
    ],
    "meaning": {
      "en": "Apologizing: Sorry, ___.",
      "ko": "사과하기: 죄송해요, ___."
    },
    "grammar": [],
    "expressions": [
      "آسف"
    ],
    "examples": [
      {
        "text": "آسف، أنا متأخر.",
        "slot": "أنا متأخر",
        "cue": {
          "en": "I'm late",
          "ko": "늦었어요"
        },
        "gloss": {
          "en": "Sorry, I'm late.",
          "ko": "죄송해요, 늦었어요."
        }
      },
      {
        "text": "آسف، لا أعرف.",
        "slot": "لا أعرف",
        "cue": {
          "en": "I don't know",
          "ko": "몰라요"
        },
        "gloss": {
          "en": "Sorry, I don't know.",
          "ko": "죄송해요, 모르겠어요."
        }
      },
      {
        "text": "آسف، هذا مكاني.",
        "slot": "هذا مكاني",
        "cue": {
          "en": "this is my seat",
          "ko": "여기는 제 자리"
        },
        "gloss": {
          "en": "Sorry, this is my seat.",
          "ko": "죄송한데, 여기 제 자리예요."
        }
      },
      {
        "text": "آسف، عندي سؤال.",
        "slot": "عندي سؤال",
        "cue": {
          "en": "I have a question",
          "ko": "질문이 있어요"
        },
        "gloss": {
          "en": "Sorry, I have a question.",
          "ko": "죄송한데, 질문이 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "___ أمس.",
    "core": [
      "أمس"
    ],
    "meaning": {
      "en": "Saying what you did: ___ yesterday.",
      "ko": "한 일 말하기: 어제 ___."
    },
    "grammar": [
      0,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ذهبت إلى السوق أمس.",
        "slot": "ذهبت إلى السوق",
        "cue": {
          "en": "went to the market",
          "ko": "시장에 갔다"
        },
        "gloss": {
          "en": "I went to the market yesterday.",
          "ko": "어제 시장에 갔어요."
        }
      },
      {
        "text": "زرت بيت صديقي أمس.",
        "slot": "زرت بيت صديقي",
        "cue": {
          "en": "visited my friend's house",
          "ko": "친구 집에 갔다"
        },
        "gloss": {
          "en": "I visited my friend's house yesterday.",
          "ko": "어제 친구 집에 갔어요."
        }
      },
      {
        "text": "شاهدت فيلما جميلا أمس.",
        "slot": "شاهدت فيلما جميلا",
        "cue": {
          "en": "watched a good film",
          "ko": "좋은 영화를 봤다"
        },
        "gloss": {
          "en": "I watched a good film yesterday.",
          "ko": "어제 좋은 영화를 봤어요."
        }
      },
      {
        "text": "لم أنم جيدا أمس.",
        "slot": "لم أنم جيدا",
        "cue": {
          "en": "didn't sleep well",
          "ko": "잠을 잘 못 잤다"
        },
        "gloss": {
          "en": "I didn't sleep well yesterday.",
          "ko": "어제 잠을 잘 못 잤어요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-02",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "سوف ___.",
    "core": [
      "سوف",
      "سأ"
    ],
    "meaning": {
      "en": "Saying what you will do: I will ___.",
      "ko": "할 일 말하기: ___ 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "سوف أزور جدتي يوم الجمعة.",
        "slot": "أزور جدتي",
        "cue": {
          "en": "visit my grandmother",
          "ko": "할머니를 뵈러 가다"
        },
        "gloss": {
          "en": "I'll visit my grandmother on Friday.",
          "ko": "금요일에 할머니를 뵈러 갈 거예요."
        }
      },
      {
        "text": "سأسافر إلى القاهرة في الصيف.",
        "slot": "أسافر إلى القاهرة",
        "cue": {
          "en": "travel to Cairo",
          "ko": "카이로로 여행 가다"
        },
        "gloss": {
          "en": "I'll travel to Cairo in the summer.",
          "ko": "여름에 카이로에 갈 거예요."
        }
      },
      {
        "text": "سوف نشاهد فيلما مساء السبت.",
        "slot": "نشاهد فيلما",
        "cue": {
          "en": "watch a film (we)",
          "ko": "영화를 보다(우리)"
        },
        "gloss": {
          "en": "We'll watch a film on Saturday evening.",
          "ko": "토요일 저녁에 영화를 볼 거예요."
        }
      },
      {
        "text": "سأدرس في المكتبة غدا.",
        "slot": "أدرس في المكتبة",
        "cue": {
          "en": "study at the library",
          "ko": "도서관에서 공부하다"
        },
        "gloss": {
          "en": "I'll study at the library tomorrow.",
          "ko": "내일 도서관에서 공부할 거예요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-03",
    "stage": 2,
    "fn": "routine",
    "pattern": "___ كل يوم.",
    "core": [
      "كل يوم",
      "كل صباح",
      "كل مساء"
    ],
    "meaning": {
      "en": "Describing your routine: ___ every day.",
      "ko": "하루 일과 말하기: 매일 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أشرب القهوة كل صباح.",
        "slot": "أشرب القهوة",
        "cue": {
          "en": "drink coffee",
          "ko": "커피를 마시다"
        },
        "gloss": {
          "en": "I drink coffee every morning.",
          "ko": "매일 아침 커피를 마셔요."
        }
      },
      {
        "text": "أمشي إلى العمل كل يوم.",
        "slot": "أمشي إلى العمل",
        "cue": {
          "en": "walk to work",
          "ko": "걸어서 출근하다"
        },
        "gloss": {
          "en": "I walk to work every day.",
          "ko": "매일 걸어서 출근해요."
        }
      },
      {
        "text": "نأكل مع العائلة كل مساء.",
        "slot": "نأكل مع العائلة",
        "cue": {
          "en": "eat with the family (we)",
          "ko": "가족과 먹다(우리)"
        },
        "gloss": {
          "en": "We eat with the family every evening.",
          "ko": "매일 저녁 가족과 같이 먹어요."
        }
      },
      {
        "text": "تدرس أختي العربية كل يوم.",
        "slot": "تدرس أختي العربية",
        "cue": {
          "en": "my sister studies Arabic",
          "ko": "언니가 아랍어를 공부하다"
        },
        "gloss": {
          "en": "My sister studies Arabic every day.",
          "ko": "언니는 매일 아랍어를 공부해요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-04",
    "stage": 2,
    "fn": "experience",
    "pattern": "لم ___ من قبل.",
    "core": [
      "من قبل"
    ],
    "meaning": {
      "en": "Saying you've never done something: I've never ___ before.",
      "ko": "해 본 적 없다고 말하기: ___ 본 적이 없어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لم أزر مصر من قبل.",
        "slot": "أزر مصر",
        "cue": {
          "en": "visit Egypt",
          "ko": "이집트에 가다"
        },
        "gloss": {
          "en": "I've never visited Egypt before.",
          "ko": "이집트에 가 본 적이 없어요."
        }
      },
      {
        "text": "لم أجرب الكنافة من قبل.",
        "slot": "أجرب الكنافة",
        "cue": {
          "en": "try kunafa",
          "ko": "쿠나파를 먹어 보다"
        },
        "gloss": {
          "en": "I've never tried kunafa before.",
          "ko": "쿠나파를 먹어 본 적이 없어요."
        }
      },
      {
        "text": "لم أسمع هذه الأغنية من قبل.",
        "slot": "أسمع هذه الأغنية",
        "cue": {
          "en": "hear this song",
          "ko": "이 노래를 듣다"
        },
        "gloss": {
          "en": "I've never heard this song before.",
          "ko": "이 노래는 처음 들어요."
        }
      },
      {
        "text": "لم أركب الجمل من قبل.",
        "slot": "أركب الجمل",
        "cue": {
          "en": "ride a camel",
          "ko": "낙타를 타다"
        },
        "gloss": {
          "en": "I've never ridden a camel before.",
          "ko": "낙타를 타 본 적이 없어요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-05",
    "stage": 2,
    "fn": "decline",
    "pattern": "للأسف، لن ___.",
    "core": [
      "لن"
    ],
    "meaning": {
      "en": "Declining politely: Unfortunately, I won't ___.",
      "ko": "정중하게 거절하기: 아쉽지만 ___ 못 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "للأسف"
    ],
    "examples": [
      {
        "text": "للأسف، لن أحضر الحفلة.",
        "slot": "أحضر الحفلة",
        "cue": {
          "en": "come to the party",
          "ko": "파티에 가다"
        },
        "gloss": {
          "en": "Unfortunately, I won't come to the party.",
          "ko": "아쉽지만 파티에는 못 가요."
        }
      },
      {
        "text": "للأسف، لن أخرج اليوم.",
        "slot": "أخرج اليوم",
        "cue": {
          "en": "go out today",
          "ko": "오늘 나가다"
        },
        "gloss": {
          "en": "Unfortunately, I won't go out today.",
          "ko": "아쉽지만 오늘은 안 나가요."
        }
      },
      {
        "text": "للأسف، لن أكون في البيت غدا.",
        "slot": "أكون في البيت",
        "cue": {
          "en": "be at home",
          "ko": "집에 있다"
        },
        "gloss": {
          "en": "Unfortunately, I won't be at home tomorrow.",
          "ko": "아쉽지만 내일은 집에 없어요."
        }
      },
      {
        "text": "للأسف، لن نسافر هذا الصيف.",
        "slot": "نسافر",
        "cue": {
          "en": "travel (we)",
          "ko": "여행 가다(우리)"
        },
        "gloss": {
          "en": "Unfortunately, we won't travel this summer.",
          "ko": "아쉽지만 올여름엔 여행 못 가요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-06",
    "stage": 2,
    "fn": "reason",
    "pattern": "... لأن ___.",
    "core": [
      "لأن"
    ],
    "meaning": {
      "en": "Giving a reason: ... because ___.",
      "ko": "이유 말하기: ___ 때문에 ..."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لن أخرج لأن الجو حار جدا.",
        "slot": "الجو حار جدا",
        "cue": {
          "en": "it's very hot",
          "ko": "날씨가 너무 덥다"
        },
        "gloss": {
          "en": "I won't go out because it's very hot.",
          "ko": "너무 더워서 안 나갈 거예요."
        }
      },
      {
        "text": "تأخرت لأن الطريق مزدحم.",
        "slot": "الطريق مزدحم",
        "cue": {
          "en": "the road is busy",
          "ko": "길이 막힌다"
        },
        "gloss": {
          "en": "I was late because the road is busy.",
          "ko": "길이 막혀서 늦었어요."
        }
      },
      {
        "text": "أنا متعب لأني لم أنم جيدا.",
        "slot": "لم أنم جيدا",
        "cue": {
          "en": "I didn't sleep well",
          "ko": "잠을 잘 못 잤다"
        },
        "gloss": {
          "en": "I'm tired because I didn't sleep well.",
          "ko": "잠을 잘 못 자서 피곤해요."
        }
      },
      {
        "text": "أحب الصيف لأن البحر قريب.",
        "slot": "البحر قريب",
        "cue": {
          "en": "the sea is close",
          "ko": "바다가 가깝다"
        },
        "gloss": {
          "en": "I like summer because the sea is close.",
          "ko": "바다가 가까워서 여름이 좋아요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-07",
    "stage": 2,
    "fn": "like",
    "pattern": "أحب ___.",
    "core": [
      "أحب"
    ],
    "meaning": {
      "en": "Saying what you like doing: I like ___.",
      "ko": "좋아하는 것 말하기: ___을 좋아해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أحب القراءة.",
        "slot": "القراءة",
        "cue": {
          "en": "reading",
          "ko": "독서"
        },
        "gloss": {
          "en": "I like reading.",
          "ko": "책 읽는 걸 좋아해요."
        }
      },
      {
        "text": "أحب السباحة كثيرا.",
        "slot": "السباحة",
        "cue": {
          "en": "swimming",
          "ko": "수영"
        },
        "gloss": {
          "en": "I really like swimming.",
          "ko": "수영을 정말 좋아해요."
        }
      },
      {
        "text": "أحب الطبخ مع أمي.",
        "slot": "الطبخ",
        "cue": {
          "en": "cooking",
          "ko": "요리"
        },
        "gloss": {
          "en": "I like cooking with my mum.",
          "ko": "엄마랑 요리하는 걸 좋아해요."
        }
      },
      {
        "text": "أحب المشي في الصباح.",
        "slot": "المشي",
        "cue": {
          "en": "walking",
          "ko": "걷기"
        },
        "gloss": {
          "en": "I like walking in the morning.",
          "ko": "아침에 걷는 걸 좋아해요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-08",
    "stage": 2,
    "fn": "dislike",
    "pattern": "لا أحب ___.",
    "core": [
      "لا أحب"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: ___을 안 좋아해요."
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لا أحب الانتظار.",
        "slot": "الانتظار",
        "cue": {
          "en": "waiting",
          "ko": "기다리기"
        },
        "gloss": {
          "en": "I don't like waiting.",
          "ko": "기다리는 걸 싫어해요."
        }
      },
      {
        "text": "لا أحب الاستيقاظ مبكرا.",
        "slot": "الاستيقاظ",
        "cue": {
          "en": "waking up",
          "ko": "일어나기"
        },
        "gloss": {
          "en": "I don't like waking up early.",
          "ko": "일찍 일어나는 걸 싫어해요."
        }
      },
      {
        "text": "لا أحب التسوق يوم الجمعة.",
        "slot": "التسوق",
        "cue": {
          "en": "shopping",
          "ko": "쇼핑"
        },
        "gloss": {
          "en": "I don't like shopping on Fridays.",
          "ko": "금요일에 장 보는 건 싫어요."
        }
      },
      {
        "text": "لا أحب القهوة بالسكر.",
        "slot": "القهوة بالسكر",
        "cue": {
          "en": "coffee with sugar",
          "ko": "설탕 넣은 커피"
        },
        "gloss": {
          "en": "I don't like coffee with sugar.",
          "ko": "설탕 넣은 커피는 싫어요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-09",
    "stage": 2,
    "fn": "request-action",
    "pattern": "ممكن ___؟",
    "core": [
      "ممكن"
    ],
    "meaning": {
      "en": "Asking someone to do something: Could you ___?",
      "ko": "해 달라고 부탁하기: ___ 주실 수 있어요?"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "ممكن"
    ],
    "examples": [
      {
        "text": "ممكن تساعدني؟",
        "slot": "تساعدني",
        "cue": {
          "en": "help me",
          "ko": "도와주다"
        },
        "gloss": {
          "en": "Could you help me?",
          "ko": "도와주실 수 있어요?"
        }
      },
      {
        "text": "ممكن تكتب العنوان؟",
        "slot": "تكتب العنوان",
        "cue": {
          "en": "write the address",
          "ko": "주소를 써 주다"
        },
        "gloss": {
          "en": "Could you write the address?",
          "ko": "주소 좀 써 주실래요?"
        }
      },
      {
        "text": "ممكن تتكلم ببطء؟",
        "slot": "تتكلم ببطء",
        "cue": {
          "en": "speak slowly",
          "ko": "천천히 말하다"
        },
        "gloss": {
          "en": "Could you speak slowly?",
          "ko": "천천히 말해 주실래요?"
        }
      },
      {
        "text": "ممكن تعطيني الحساب؟",
        "slot": "تعطيني الحساب",
        "cue": {
          "en": "give me the bill",
          "ko": "계산서를 주다"
        },
        "gloss": {
          "en": "Could you give me the bill?",
          "ko": "계산서 좀 주실래요?"
        }
      }
    ]
  },
  {
    "id": "ar-f2-10",
    "stage": 2,
    "fn": "permission",
    "pattern": "ممكن ___؟",
    "core": [
      "ممكن"
    ],
    "meaning": {
      "en": "Asking permission: Can I ___?",
      "ko": "허락 구하기: ___도 돼요?"
    },
    "grammar": [
      1,
      5
    ],
    "expressions": [
      "ممكن"
    ],
    "examples": [
      {
        "text": "ممكن أجلس هنا؟",
        "slot": "أجلس هنا",
        "cue": {
          "en": "sit here",
          "ko": "여기 앉다"
        },
        "gloss": {
          "en": "Can I sit here?",
          "ko": "여기 앉아도 돼요?"
        }
      },
      {
        "text": "ممكن أدفع بالبطاقة؟",
        "slot": "أدفع بالبطاقة",
        "cue": {
          "en": "pay by card",
          "ko": "카드로 내다"
        },
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드로 계산해도 돼요?"
        }
      },
      {
        "text": "ممكن أفتح الشباك؟",
        "slot": "أفتح الشباك",
        "cue": {
          "en": "open the window",
          "ko": "창문을 열다"
        },
        "gloss": {
          "en": "Can I open the window?",
          "ko": "창문 열어도 돼요?"
        }
      },
      {
        "text": "ممكن أسأل سؤالا؟",
        "slot": "أسأل سؤالا",
        "cue": {
          "en": "ask a question",
          "ko": "질문하다"
        },
        "gloss": {
          "en": "Can I ask a question?",
          "ko": "질문해도 돼요?"
        }
      }
    ]
  },
  {
    "id": "ar-f2-11",
    "stage": 2,
    "fn": "order",
    "pattern": "سآخذ ___.",
    "core": [
      "سآخذ"
    ],
    "meaning": {
      "en": "Ordering: I'll have ___.",
      "ko": "주문하기: ___로 할게요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "سآخذ القهوة بدون سكر.",
        "slot": "القهوة بدون سكر",
        "cue": {
          "en": "coffee without sugar",
          "ko": "설탕 없는 커피"
        },
        "gloss": {
          "en": "I'll have the coffee without sugar.",
          "ko": "커피 설탕 없이 할게요."
        }
      },
      {
        "text": "سآخذ كعكة الشوكولاتة.",
        "slot": "كعكة الشوكولاتة",
        "cue": {
          "en": "the chocolate cake",
          "ko": "초콜릿 케이크"
        },
        "gloss": {
          "en": "I'll have the chocolate cake.",
          "ko": "초콜릿 케이크로 할게요."
        }
      },
      {
        "text": "سآخذ عصير البرتقال.",
        "slot": "عصير البرتقال",
        "cue": {
          "en": "the orange juice",
          "ko": "오렌지 주스"
        },
        "gloss": {
          "en": "I'll have the orange juice.",
          "ko": "오렌지 주스로 할게요."
        }
      },
      {
        "text": "سآخذ الشاي بالنعناع.",
        "slot": "الشاي بالنعناع",
        "cue": {
          "en": "the mint tea",
          "ko": "민트차"
        },
        "gloss": {
          "en": "I'll have the mint tea.",
          "ko": "민트차로 할게요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-12",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "ماذا تنصح ___؟",
    "core": [
      "ماذا تنصح"
    ],
    "meaning": {
      "en": "Asking for a recommendation: What do you recommend ___?",
      "ko": "추천해 달라고 하기: ___ 뭘 추천하세요?"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "ماذا تنصح"
    ],
    "examples": [
      {
        "text": "ماذا تنصح للصداع؟",
        "slot": "للصداع",
        "cue": {
          "en": "for a headache",
          "ko": "두통에"
        },
        "gloss": {
          "en": "What do you recommend for a headache?",
          "ko": "두통에는 뭘 추천하세요?"
        }
      },
      {
        "text": "ماذا تنصح من الحلويات؟",
        "slot": "من الحلويات",
        "cue": {
          "en": "from the desserts",
          "ko": "디저트 중에서"
        },
        "gloss": {
          "en": "What do you recommend from the desserts?",
          "ko": "디저트는 뭘 추천하세요?"
        }
      },
      {
        "text": "ماذا تنصح للعشاء؟",
        "slot": "للعشاء",
        "cue": {
          "en": "for dinner",
          "ko": "저녁으로"
        },
        "gloss": {
          "en": "What do you recommend for dinner?",
          "ko": "저녁은 뭘 추천하세요?"
        }
      },
      {
        "text": "ماذا تنصح في القاهرة؟",
        "slot": "في القاهرة",
        "cue": {
          "en": "in Cairo",
          "ko": "카이로에서"
        },
        "gloss": {
          "en": "What do you recommend in Cairo?",
          "ko": "카이로에서는 뭘 추천하세요?"
        }
      }
    ]
  },
  {
    "id": "ar-f2-13",
    "stage": 2,
    "fn": "symptom",
    "pattern": "عندي ___ منذ الصباح.",
    "core": [
      "عندي"
    ],
    "meaning": {
      "en": "Describing a symptom: I've had ___ since the morning.",
      "ko": "아픈 곳 말하기: 아침부터 ___이 있어요."
    },
    "grammar": [],
    "expressions": [
      "عندي صداع"
    ],
    "examples": [
      {
        "text": "عندي صداع منذ الصباح.",
        "slot": "صداع",
        "cue": {
          "en": "a headache",
          "ko": "두통"
        },
        "gloss": {
          "en": "I've had a headache since the morning.",
          "ko": "아침부터 머리가 아파요."
        }
      },
      {
        "text": "عندي ألم في بطني منذ الصباح.",
        "slot": "ألم في بطني",
        "cue": {
          "en": "a stomach ache",
          "ko": "배 아픔"
        },
        "gloss": {
          "en": "I've had a stomach ache since the morning.",
          "ko": "아침부터 배가 아파요."
        }
      },
      {
        "text": "عندي حرارة منذ الصباح.",
        "slot": "حرارة",
        "cue": {
          "en": "a fever",
          "ko": "열"
        },
        "gloss": {
          "en": "I've had a fever since the morning.",
          "ko": "아침부터 열이 나요."
        }
      },
      {
        "text": "عندي سعال منذ الصباح.",
        "slot": "سعال",
        "cue": {
          "en": "a cough",
          "ko": "기침"
        },
        "gloss": {
          "en": "I've had a cough since the morning.",
          "ko": "아침부터 기침이 나요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-14",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "نلتقي ___؟",
    "core": [
      "نلتقي"
    ],
    "meaning": {
      "en": "Suggesting a time or place: Shall we meet ___?",
      "ko": "시간·장소 정하기: ___ 만날까요?"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "نلتقي يوم السبت؟",
        "slot": "يوم السبت",
        "cue": {
          "en": "on Saturday",
          "ko": "토요일에"
        },
        "gloss": {
          "en": "Shall we meet on Saturday?",
          "ko": "토요일에 만날까요?"
        }
      },
      {
        "text": "نلتقي أمام المكتبة؟",
        "slot": "أمام المكتبة",
        "cue": {
          "en": "in front of the library",
          "ko": "도서관 앞에서"
        },
        "gloss": {
          "en": "Shall we meet in front of the library?",
          "ko": "도서관 앞에서 만날까요?"
        }
      },
      {
        "text": "نلتقي الساعة الخامسة؟",
        "slot": "الساعة الخامسة",
        "cue": {
          "en": "at five o'clock",
          "ko": "다섯 시에"
        },
        "gloss": {
          "en": "Shall we meet at five?",
          "ko": "다섯 시에 만날까요?"
        }
      },
      {
        "text": "نلتقي بعد الدرس؟",
        "slot": "بعد الدرس",
        "cue": {
          "en": "after class",
          "ko": "수업 끝나고"
        },
        "gloss": {
          "en": "Shall we meet after class?",
          "ko": "수업 끝나고 만날까요?"
        }
      }
    ]
  },
  {
    "id": "ar-f2-15",
    "stage": 2,
    "fn": "possession",
    "pattern": "هذا بيت ___.",
    "core": [
      "بيت"
    ],
    "meaning": {
      "en": "Saying whose place it is: This is ___'s house.",
      "ko": "누구 것인지 말하기: 여기는 ___의 집이에요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "هذا بيت صديقي.",
        "slot": "صديقي",
        "cue": {
          "en": "my friend",
          "ko": "내 친구"
        },
        "gloss": {
          "en": "This is my friend's house.",
          "ko": "여기는 제 친구 집이에요."
        }
      },
      {
        "text": "هذا بيت أختي.",
        "slot": "أختي",
        "cue": {
          "en": "my sister",
          "ko": "내 언니(누나)"
        },
        "gloss": {
          "en": "This is my sister's house.",
          "ko": "여기는 언니 집이에요."
        }
      },
      {
        "text": "هذا بيت جدتي.",
        "slot": "جدتي",
        "cue": {
          "en": "my grandmother",
          "ko": "우리 할머니"
        },
        "gloss": {
          "en": "This is my grandmother's house.",
          "ko": "여기는 할머니 댁이에요."
        }
      },
      {
        "text": "هذا بيت مدرسي.",
        "slot": "مدرسي",
        "cue": {
          "en": "my teacher",
          "ko": "우리 선생님"
        },
        "gloss": {
          "en": "This is my teacher's house.",
          "ko": "여기는 선생님 댁이에요."
        }
      }
    ]
  },
  {
    "id": "ar-f2-16",
    "stage": 2,
    "fn": "invite",
    "pattern": "يلا ___!",
    "core": [
      "يلا"
    ],
    "meaning": {
      "en": "Inviting someone: Come on, let's ___!",
      "ko": "같이 하자고 하기: 자, ___!"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "يلا"
    ],
    "examples": [
      {
        "text": "يلا نشرب قهوة!",
        "slot": "نشرب قهوة",
        "cue": {
          "en": "have a coffee",
          "ko": "커피 마시다"
        },
        "gloss": {
          "en": "Come on, let's have a coffee!",
          "ko": "자, 커피 마시자!"
        }
      },
      {
        "text": "يلا نذهب إلى البحر!",
        "slot": "نذهب إلى البحر",
        "cue": {
          "en": "go to the beach",
          "ko": "바다에 가다"
        },
        "gloss": {
          "en": "Come on, let's go to the beach!",
          "ko": "자, 바다 가자!"
        }
      },
      {
        "text": "يلا نأكل!",
        "slot": "نأكل",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "Come on, let's eat!",
          "ko": "자, 먹자!"
        }
      },
      {
        "text": "يلا نمشي قليلا!",
        "slot": "نمشي قليلا",
        "cue": {
          "en": "walk a bit",
          "ko": "좀 걷다"
        },
        "gloss": {
          "en": "Come on, let's walk a bit!",
          "ko": "자, 좀 걷자!"
        }
      }
    ]
  },
  {
    "id": "ar-f2-17",
    "stage": 2,
    "fn": "accept",
    "pattern": "فكرة حلوة! سأ___.",
    "core": [
      "فكرة حلوة"
    ],
    "meaning": {
      "en": "Accepting a suggestion: Great idea! I'll ___.",
      "ko": "제안 받아들이기: 좋은 생각이야! ___게."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "فكرة حلوة"
    ],
    "examples": [
      {
        "text": "فكرة حلوة! سآتي معك.",
        "slot": "آتي معك",
        "cue": {
          "en": "come with you",
          "ko": "같이 가다"
        },
        "gloss": {
          "en": "Great idea! I'll come with you.",
          "ko": "좋은 생각이야! 같이 갈게."
        }
      },
      {
        "text": "فكرة حلوة! سأتصل بأخي.",
        "slot": "أتصل بأخي",
        "cue": {
          "en": "call my brother",
          "ko": "형에게 전화하다"
        },
        "gloss": {
          "en": "Great idea! I'll call my brother.",
          "ko": "좋은 생각이야! 형한테 전화할게."
        }
      },
      {
        "text": "فكرة حلوة! سأحجز طاولة.",
        "slot": "أحجز طاولة",
        "cue": {
          "en": "book a table",
          "ko": "자리를 예약하다"
        },
        "gloss": {
          "en": "Great idea! I'll book a table.",
          "ko": "좋은 생각이야! 자리 예약할게."
        }
      },
      {
        "text": "فكرة حلوة! سأحضر الكعكة.",
        "slot": "أحضر الكعكة",
        "cue": {
          "en": "bring the cake",
          "ko": "케이크를 가져오다"
        },
        "gloss": {
          "en": "Great idea! I'll bring the cake.",
          "ko": "좋은 생각이야! 케이크 가져갈게."
        }
      }
    ]
  },
  {
    "id": "ar-f3-01",
    "stage": 3,
    "fn": "habit-past",
    "pattern": "كنت ___.",
    "core": [
      "كنت",
      "كنا"
    ],
    "meaning": {
      "en": "Saying what you used to do: I used to ___.",
      "ko": "예전에 하던 일 말하기: 예전에 ___곤 했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "كنت أسكن في القاهرة عندما كنت صغيرا.",
        "slot": "أسكن في القاهرة",
        "cue": {
          "en": "live in Cairo",
          "ko": "카이로에 살다"
        },
        "gloss": {
          "en": "I used to live in Cairo when I was little.",
          "ko": "어릴 때 카이로에 살았어요."
        }
      },
      {
        "text": "كنت ألعب كرة القدم كل يوم.",
        "slot": "ألعب كرة القدم",
        "cue": {
          "en": "play football",
          "ko": "축구를 하다"
        },
        "gloss": {
          "en": "I used to play football every day.",
          "ko": "예전엔 매일 축구를 했어요."
        }
      },
      {
        "text": "كنت أشرب الشاي فقط.",
        "slot": "أشرب الشاي",
        "cue": {
          "en": "drink tea",
          "ko": "차를 마시다"
        },
        "gloss": {
          "en": "I used to drink only tea.",
          "ko": "예전엔 차만 마셨어요."
        }
      },
      {
        "text": "كنا نزور جدي كل صيف.",
        "slot": "نزور جدي",
        "cue": {
          "en": "visit my grandfather (we)",
          "ko": "할아버지 댁에 가다(우리)"
        },
        "gloss": {
          "en": "We used to visit my grandfather every summer.",
          "ko": "우리는 여름마다 할아버지 댁에 갔어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-02",
    "stage": 3,
    "fn": "while-when",
    "pattern": "كنت ___ عندما ...",
    "core": [
      "عندما"
    ],
    "meaning": {
      "en": "Saying what you were doing when something happened: I was ___ when ...",
      "ko": "~할 때 말하기: ...했을 때 ___고 있었어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "كنت أنام عندما اتصلت.",
        "slot": "أنام",
        "cue": {
          "en": "sleep",
          "ko": "자다"
        },
        "gloss": {
          "en": "I was sleeping when you called.",
          "ko": "네가 전화했을 때 자고 있었어."
        }
      },
      {
        "text": "كنت أطبخ عندما وصل الضيوف.",
        "slot": "أطبخ",
        "cue": {
          "en": "cook",
          "ko": "요리하다"
        },
        "gloss": {
          "en": "I was cooking when the guests arrived.",
          "ko": "손님들이 왔을 때 요리하고 있었어요."
        }
      },
      {
        "text": "كنا نشاهد الفيلم عندما انقطعت الكهرباء.",
        "slot": "نشاهد الفيلم",
        "cue": {
          "en": "watch the film (we)",
          "ko": "영화를 보다(우리)"
        },
        "gloss": {
          "en": "We were watching the film when the power went out.",
          "ko": "정전됐을 때 우리는 영화를 보고 있었어요."
        }
      },
      {
        "text": "كنت أمشي في الشارع عندما بدأ المطر.",
        "slot": "أمشي في الشارع",
        "cue": {
          "en": "walk in the street",
          "ko": "길을 걷다"
        },
        "gloss": {
          "en": "I was walking in the street when the rain started.",
          "ko": "비가 오기 시작했을 때 길을 걷고 있었어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-03",
    "stage": 3,
    "fn": "compare",
    "pattern": "هذه الشقة ___ من تلك.",
    "core": [
      "من تلك",
      "أكبر من",
      "أجمل من",
      "أفضل من",
      "أرخص من",
      "أهدأ من"
    ],
    "meaning": {
      "en": "Comparing two things: This flat is ___ than that one.",
      "ko": "둘을 비교하기: 이 집이 저 집보다 더 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "هذه الشقة أكبر من تلك.",
        "slot": "أكبر",
        "cue": {
          "en": "bigger",
          "ko": "더 크다"
        },
        "gloss": {
          "en": "This flat is bigger than that one.",
          "ko": "이 집이 저 집보다 커요."
        }
      },
      {
        "text": "هذه الشقة أرخص من تلك.",
        "slot": "أرخص",
        "cue": {
          "en": "cheaper",
          "ko": "더 싸다"
        },
        "gloss": {
          "en": "This flat is cheaper than that one.",
          "ko": "이 집이 저 집보다 싸요."
        }
      },
      {
        "text": "هذه الشقة أهدأ من تلك.",
        "slot": "أهدأ",
        "cue": {
          "en": "quieter",
          "ko": "더 조용하다"
        },
        "gloss": {
          "en": "This flat is quieter than that one.",
          "ko": "이 집이 저 집보다 조용해요."
        }
      },
      {
        "text": "هذه الشقة أجمل من تلك.",
        "slot": "أجمل",
        "cue": {
          "en": "nicer",
          "ko": "더 예쁘다"
        },
        "gloss": {
          "en": "This flat is nicer than that one.",
          "ko": "이 집이 저 집보다 예뻐요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-04",
    "stage": 3,
    "fn": "describe-thing",
    "pattern": "الفيلم الذي ___ كان رائعا.",
    "core": [
      "الذي",
      "التي"
    ],
    "meaning": {
      "en": "Describing with \"that / who\": The film that ___ was great.",
      "ko": "꾸며 말하기: ___ 영화는 정말 좋았어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "الفيلم الذي شاهدناه كان رائعا.",
        "slot": "شاهدناه",
        "cue": {
          "en": "we watched",
          "ko": "우리가 본"
        },
        "gloss": {
          "en": "The film we watched was great.",
          "ko": "우리가 본 영화는 정말 좋았어요."
        }
      },
      {
        "text": "المطعم الذي أكلنا فيه كان غاليا.",
        "slot": "أكلنا فيه",
        "cue": {
          "en": "we ate at",
          "ko": "우리가 먹은"
        },
        "gloss": {
          "en": "The restaurant we ate at was expensive.",
          "ko": "우리가 간 식당은 비쌌어요."
        }
      },
      {
        "text": "الشقة التي رأيناها أمس كانت جميلة.",
        "slot": "رأيناها أمس",
        "cue": {
          "en": "we saw yesterday",
          "ko": "어제 본"
        },
        "gloss": {
          "en": "The flat we saw yesterday was lovely.",
          "ko": "어제 본 집은 예뻤어요."
        }
      },
      {
        "text": "الممثل الذي لعب دور البطل كان ممتازا.",
        "slot": "لعب دور البطل",
        "cue": {
          "en": "played the hero",
          "ko": "주인공을 연기한"
        },
        "gloss": {
          "en": "The actor who played the hero was excellent.",
          "ko": "주인공 역을 한 배우는 훌륭했어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-05",
    "stage": 3,
    "fn": "must",
    "pattern": "يجب أن ___.",
    "core": [
      "يجب أن"
    ],
    "meaning": {
      "en": "Saying what has to be done: We must / You should ___.",
      "ko": "해야 하는 일 말하기: ___해야 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "يجب أن نصلح المكيف اليوم.",
        "slot": "نصلح المكيف",
        "cue": {
          "en": "fix the air conditioner (we)",
          "ko": "에어컨을 고치다(우리)"
        },
        "gloss": {
          "en": "We must fix the air conditioner today.",
          "ko": "오늘 에어컨을 고쳐야 해요."
        }
      },
      {
        "text": "يجب أن أذهب الآن.",
        "slot": "أذهب",
        "cue": {
          "en": "go (I)",
          "ko": "가다(나)"
        },
        "gloss": {
          "en": "I have to go now.",
          "ko": "이제 가야 해요."
        }
      },
      {
        "text": "يجب أن تشاهد هذا المسلسل.",
        "slot": "تشاهد هذا المسلسل",
        "cue": {
          "en": "watch this series (you)",
          "ko": "이 드라마를 보다(너)"
        },
        "gloss": {
          "en": "You should watch this series.",
          "ko": "이 드라마 꼭 봐야 해."
        }
      },
      {
        "text": "يجب أن نحجز مبكرا.",
        "slot": "نحجز",
        "cue": {
          "en": "book (we)",
          "ko": "예약하다(우리)"
        },
        "gloss": {
          "en": "We should book early.",
          "ko": "일찍 예약해야 해요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-06",
    "stage": 3,
    "fn": "can",
    "pattern": "أستطيع أن ___.",
    "core": [
      "أستطيع أن"
    ],
    "meaning": {
      "en": "Saying what you can do: I can ___.",
      "ko": "할 수 있는 것 말하기: ___ 수 있어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أستطيع أن أساعدك.",
        "slot": "أساعدك",
        "cue": {
          "en": "help you",
          "ko": "너를 돕다"
        },
        "gloss": {
          "en": "I can help you.",
          "ko": "내가 도와줄 수 있어."
        }
      },
      {
        "text": "أستطيع أن أدفع الآن.",
        "slot": "أدفع",
        "cue": {
          "en": "pay",
          "ko": "내다"
        },
        "gloss": {
          "en": "I can pay now.",
          "ko": "지금 낼 수 있어요."
        }
      },
      {
        "text": "أستطيع أن أنتقل الشهر القادم.",
        "slot": "أنتقل",
        "cue": {
          "en": "move house",
          "ko": "이사하다"
        },
        "gloss": {
          "en": "I can move next month.",
          "ko": "다음 달에 이사할 수 있어요."
        }
      },
      {
        "text": "أستطيع أن أتكلم العربية قليلا.",
        "slot": "أتكلم العربية",
        "cue": {
          "en": "speak Arabic",
          "ko": "아랍어를 하다"
        },
        "gloss": {
          "en": "I can speak a little Arabic.",
          "ko": "아랍어를 조금 할 수 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-07",
    "stage": 3,
    "fn": "cannot",
    "pattern": "لا أستطيع أن ___.",
    "core": [
      "لا أستطيع أن"
    ],
    "meaning": {
      "en": "Saying what you can't do: I can't ___.",
      "ko": "못 하는 것 말하기: ___ 수 없어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لا أستطيع أن أنام من الحر.",
        "slot": "أنام",
        "cue": {
          "en": "sleep",
          "ko": "자다"
        },
        "gloss": {
          "en": "I can't sleep because of the heat.",
          "ko": "더워서 잠을 못 자요."
        }
      },
      {
        "text": "لا أستطيع أن أحضر غدا.",
        "slot": "أحضر",
        "cue": {
          "en": "come",
          "ko": "오다"
        },
        "gloss": {
          "en": "I can't come tomorrow.",
          "ko": "내일은 못 가요."
        }
      },
      {
        "text": "لا أستطيع أن أفتح الشباك.",
        "slot": "أفتح الشباك",
        "cue": {
          "en": "open the window",
          "ko": "창문을 열다"
        },
        "gloss": {
          "en": "I can't open the window.",
          "ko": "창문이 안 열려요."
        }
      },
      {
        "text": "لا أستطيع أن أدفع أكثر.",
        "slot": "أدفع أكثر",
        "cue": {
          "en": "pay more",
          "ko": "더 내다"
        },
        "gloss": {
          "en": "I can't pay more.",
          "ko": "더는 못 내요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-08",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "أريد أن ___.",
    "core": [
      "أريد أن"
    ],
    "meaning": {
      "en": "Saying what you intend to do: I want to ___.",
      "ko": "하려는 것 말하기: ___고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أريد أن أزور البتراء.",
        "slot": "أزور البتراء",
        "cue": {
          "en": "visit Petra",
          "ko": "페트라에 가다"
        },
        "gloss": {
          "en": "I want to visit Petra.",
          "ko": "페트라에 가 보고 싶어요."
        }
      },
      {
        "text": "أريد أن أرى الشقة مرة ثانية.",
        "slot": "أرى الشقة",
        "cue": {
          "en": "see the flat",
          "ko": "집을 보다"
        },
        "gloss": {
          "en": "I want to see the flat again.",
          "ko": "그 집을 한 번 더 보고 싶어요."
        }
      },
      {
        "text": "أريد أن أتعلم الطبخ.",
        "slot": "أتعلم الطبخ",
        "cue": {
          "en": "learn to cook",
          "ko": "요리를 배우다"
        },
        "gloss": {
          "en": "I want to learn to cook.",
          "ko": "요리를 배우고 싶어요."
        }
      },
      {
        "text": "أريد أن أغير الغرفة.",
        "slot": "أغير الغرفة",
        "cue": {
          "en": "change rooms",
          "ko": "방을 바꾸다"
        },
        "gloss": {
          "en": "I want to change rooms.",
          "ko": "방을 바꾸고 싶어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-09",
    "stage": 3,
    "fn": "condition",
    "pattern": "إذا ___، اتصل بي.",
    "core": [
      "إذا"
    ],
    "meaning": {
      "en": "Saying what to do if something happens: If ___, call me.",
      "ko": "조건 말하기: ___면 전화해."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "إذا تأخرت، اتصل بي.",
        "slot": "تأخرت",
        "cue": {
          "en": "you're late",
          "ko": "늦다"
        },
        "gloss": {
          "en": "If you're late, call me.",
          "ko": "늦으면 전화해."
        }
      },
      {
        "text": "إذا احتجت شيئا، اتصل بي.",
        "slot": "احتجت شيئا",
        "cue": {
          "en": "you need something",
          "ko": "뭐가 필요하다"
        },
        "gloss": {
          "en": "If you need anything, call me.",
          "ko": "뭐 필요하면 전화해."
        }
      },
      {
        "text": "إذا وصل الفني، اتصل بي.",
        "slot": "وصل الفني",
        "cue": {
          "en": "the technician arrives",
          "ko": "기사님이 오다"
        },
        "gloss": {
          "en": "If the technician arrives, call me.",
          "ko": "기사님이 오시면 전화 주세요."
        }
      },
      {
        "text": "إذا ضعت، اتصل بي.",
        "slot": "ضعت",
        "cue": {
          "en": "you get lost",
          "ko": "길을 잃다"
        },
        "gloss": {
          "en": "If you get lost, call me.",
          "ko": "길 잃으면 전화해."
        }
      }
    ]
  },
  {
    "id": "ar-f3-10",
    "stage": 3,
    "fn": "sequence",
    "pattern": "أولا ___، ثم ...",
    "core": [
      "أولا"
    ],
    "meaning": {
      "en": "Ordering events: First ___, then ...",
      "ko": "순서대로 말하기: 먼저 ___, 그다음 ..."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أولا زرنا البتراء، ثم ذهبنا إلى العقبة.",
        "slot": "زرنا البتراء",
        "cue": {
          "en": "we visited Petra",
          "ko": "페트라에 갔다"
        },
        "gloss": {
          "en": "First we visited Petra, then we went to Aqaba.",
          "ko": "먼저 페트라에 갔고, 그다음 아카바에 갔어요."
        }
      },
      {
        "text": "أولا أكلنا، ثم مشينا على البحر.",
        "slot": "أكلنا",
        "cue": {
          "en": "we ate",
          "ko": "먹었다"
        },
        "gloss": {
          "en": "First we ate, then we walked by the sea.",
          "ko": "먼저 먹고, 그다음 바닷가를 걸었어요."
        }
      },
      {
        "text": "أولا اتصلت بالفني، ثم كتبت رسالة.",
        "slot": "اتصلت بالفني",
        "cue": {
          "en": "I called the technician",
          "ko": "기사님께 전화했다"
        },
        "gloss": {
          "en": "First I called the technician, then I wrote a message.",
          "ko": "먼저 기사님께 전화하고, 그다음 메시지를 썼어요."
        }
      },
      {
        "text": "أولا شربنا القهوة، ثم بدأنا الحلقة.",
        "slot": "شربنا القهوة",
        "cue": {
          "en": "we had coffee",
          "ko": "커피를 마셨다"
        },
        "gloss": {
          "en": "First we had coffee, then we started the episode.",
          "ko": "먼저 커피를 마시고, 그다음 드라마를 틀었어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-11",
    "stage": 3,
    "fn": "story-past",
    "pattern": "بعد ذلك ___.",
    "core": [
      "بعد ذلك",
      "في النهاية"
    ],
    "meaning": {
      "en": "Telling what happened next: After that / In the end, ___.",
      "ko": "있었던 일 이야기하기: 그다음에(결국) ___."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "بعد ذلك ذهبنا إلى السوق.",
        "slot": "ذهبنا إلى السوق",
        "cue": {
          "en": "we went to the market",
          "ko": "시장에 갔다"
        },
        "gloss": {
          "en": "After that we went to the market.",
          "ko": "그다음에 시장에 갔어요."
        }
      },
      {
        "text": "في النهاية رجعنا إلى الفندق.",
        "slot": "رجعنا إلى الفندق",
        "cue": {
          "en": "we went back to the hotel",
          "ko": "호텔로 돌아갔다"
        },
        "gloss": {
          "en": "In the end we went back to the hotel.",
          "ko": "결국 호텔로 돌아갔어요."
        }
      },
      {
        "text": "في النهاية اخترنا الشقة الصغيرة.",
        "slot": "اخترنا الشقة الصغيرة",
        "cue": {
          "en": "we chose the small flat",
          "ko": "작은 집을 골랐다"
        },
        "gloss": {
          "en": "In the end we chose the small flat.",
          "ko": "결국 작은 집을 골랐어요."
        }
      },
      {
        "text": "بعد ذلك نمنا ساعتين.",
        "slot": "نمنا ساعتين",
        "cue": {
          "en": "we slept for two hours",
          "ko": "두 시간 잤다"
        },
        "gloss": {
          "en": "After that we slept for two hours.",
          "ko": "그다음에 두 시간 잤어요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-12",
    "stage": 3,
    "fn": "opinion",
    "pattern": "في رأيي، ___.",
    "core": [
      "في رأيي"
    ],
    "meaning": {
      "en": "Giving your opinion: In my opinion, ___.",
      "ko": "내 생각 말하기: 내 생각엔 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "في رأيي"
    ],
    "examples": [
      {
        "text": "في رأيي، الحلقة الأخيرة كانت ضعيفة.",
        "slot": "الحلقة الأخيرة كانت ضعيفة",
        "cue": {
          "en": "the last episode was weak",
          "ko": "마지막 회가 약했다"
        },
        "gloss": {
          "en": "In my opinion, the last episode was weak.",
          "ko": "내 생각엔 마지막 회가 약했어."
        }
      },
      {
        "text": "في رأيي، الشقة الثانية أفضل.",
        "slot": "الشقة الثانية أفضل",
        "cue": {
          "en": "the second flat is better",
          "ko": "두 번째 집이 낫다"
        },
        "gloss": {
          "en": "In my opinion, the second flat is better.",
          "ko": "내 생각엔 두 번째 집이 나아."
        }
      },
      {
        "text": "في رأيي، الرحلة كانت قصيرة.",
        "slot": "الرحلة كانت قصيرة",
        "cue": {
          "en": "the trip was short",
          "ko": "여행이 짧았다"
        },
        "gloss": {
          "en": "In my opinion, the trip was short.",
          "ko": "내 생각엔 여행이 짧았어."
        }
      },
      {
        "text": "في رأيي، يجب أن نسأل المالك.",
        "slot": "يجب أن نسأل المالك",
        "cue": {
          "en": "we should ask the owner",
          "ko": "집주인에게 물어봐야 한다"
        },
        "gloss": {
          "en": "In my opinion, we should ask the owner.",
          "ko": "내 생각엔 집주인에게 물어봐야 해."
        }
      }
    ]
  },
  {
    "id": "ar-f3-13",
    "stage": 3,
    "fn": "guess",
    "pattern": "أظن أن ___.",
    "core": [
      "أظن أن"
    ],
    "meaning": {
      "en": "Guessing: I think that ___.",
      "ko": "짐작하기: ___ 것 같아요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "أظن أن"
    ],
    "examples": [
      {
        "text": "أظن أن الفني سيأتي غدا.",
        "slot": "الفني سيأتي غدا",
        "cue": {
          "en": "the technician will come tomorrow",
          "ko": "기사님이 내일 온다"
        },
        "gloss": {
          "en": "I think the technician will come tomorrow.",
          "ko": "기사님이 내일 오실 것 같아요."
        }
      },
      {
        "text": "أظن أن المطعم مغلق اليوم.",
        "slot": "المطعم مغلق اليوم",
        "cue": {
          "en": "the restaurant is closed today",
          "ko": "식당이 오늘 문을 닫았다"
        },
        "gloss": {
          "en": "I think the restaurant is closed today.",
          "ko": "식당이 오늘 문 닫은 것 같아요."
        }
      },
      {
        "text": "أظن أن الموسم الجديد سيبدأ في الشتاء.",
        "slot": "الموسم الجديد سيبدأ في الشتاء",
        "cue": {
          "en": "the new season starts in winter",
          "ko": "새 시즌이 겨울에 시작한다"
        },
        "gloss": {
          "en": "I think the new season will start in winter.",
          "ko": "새 시즌은 겨울에 시작할 것 같아요."
        }
      },
      {
        "text": "أظن أن السعر مناسب.",
        "slot": "السعر مناسب",
        "cue": {
          "en": "the price is fair",
          "ko": "가격이 적당하다"
        },
        "gloss": {
          "en": "I think the price is fair.",
          "ko": "가격이 적당한 것 같아요."
        }
      }
    ]
  },
  {
    "id": "ar-f3-14",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "ما رأيك في ___؟",
    "core": [
      "ما رأيك"
    ],
    "meaning": {
      "en": "Asking what someone thinks: What do you think of ___?",
      "ko": "상대 생각 묻기: ___ 어떻게 생각해?"
    },
    "grammar": [],
    "expressions": [
      "ما رأيك"
    ],
    "examples": [
      {
        "text": "ما رأيك في المسلسل؟",
        "slot": "المسلسل",
        "cue": {
          "en": "the series",
          "ko": "그 드라마"
        },
        "gloss": {
          "en": "What do you think of the series?",
          "ko": "그 드라마 어떻게 생각해?"
        }
      },
      {
        "text": "ما رأيك في الشقة الثانية؟",
        "slot": "الشقة الثانية",
        "cue": {
          "en": "the second flat",
          "ko": "두 번째 집"
        },
        "gloss": {
          "en": "What do you think of the second flat?",
          "ko": "두 번째 집 어때?"
        }
      },
      {
        "text": "ما رأيك في هذا المطعم؟",
        "slot": "هذا المطعم",
        "cue": {
          "en": "this restaurant",
          "ko": "이 식당"
        },
        "gloss": {
          "en": "What do you think of this restaurant?",
          "ko": "이 식당 어때?"
        }
      },
      {
        "text": "ما رأيك في الرحلة؟",
        "slot": "الرحلة",
        "cue": {
          "en": "the trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "What did you think of the trip?",
          "ko": "여행 어땠어?"
        }
      }
    ]
  },
  {
    "id": "ar-f3-15",
    "stage": 3,
    "fn": "agree",
    "pattern": "معك حق، ___.",
    "core": [
      "معك حق"
    ],
    "meaning": {
      "en": "Agreeing: You're right, ___.",
      "ko": "동의하기: 네 말이 맞아, ___."
    },
    "grammar": [],
    "expressions": [
      "معك حق"
    ],
    "examples": [
      {
        "text": "معك حق، الشقة الثانية أفضل.",
        "slot": "الشقة الثانية أفضل",
        "cue": {
          "en": "the second flat is better",
          "ko": "두 번째 집이 낫다"
        },
        "gloss": {
          "en": "You're right, the second flat is better.",
          "ko": "네 말이 맞아, 두 번째 집이 나아."
        }
      },
      {
        "text": "معك حق، الحلقة كانت طويلة.",
        "slot": "الحلقة كانت طويلة",
        "cue": {
          "en": "the episode was long",
          "ko": "그 회가 길었다"
        },
        "gloss": {
          "en": "You're right, the episode was long.",
          "ko": "맞아, 그 회는 길었어."
        }
      },
      {
        "text": "معك حق، يجب أن نسأل أولا.",
        "slot": "يجب أن نسأل أولا",
        "cue": {
          "en": "we should ask first",
          "ko": "먼저 물어봐야 한다"
        },
        "gloss": {
          "en": "You're right, we should ask first.",
          "ko": "맞아, 먼저 물어봐야 해."
        }
      },
      {
        "text": "معك حق، السعر مرتفع.",
        "slot": "السعر مرتفع",
        "cue": {
          "en": "the price is high",
          "ko": "가격이 높다"
        },
        "gloss": {
          "en": "You're right, the price is high.",
          "ko": "맞아, 가격이 높아."
        }
      }
    ]
  },
  {
    "id": "ar-f3-16",
    "stage": 3,
    "fn": "surprise",
    "pattern": "تخيل، ___!",
    "core": [
      "تخيل"
    ],
    "meaning": {
      "en": "Telling surprising news: Imagine, ___!",
      "ko": "놀라운 일 말하기: 있잖아, ___!"
    },
    "grammar": [],
    "expressions": [
      "تخيل"
    ],
    "examples": [
      {
        "text": "تخيل، فقدت جواز سفري!",
        "slot": "فقدت جواز سفري",
        "cue": {
          "en": "I lost my passport",
          "ko": "여권을 잃어버렸다"
        },
        "gloss": {
          "en": "Imagine, I lost my passport!",
          "ko": "있잖아, 여권을 잃어버렸어!"
        }
      },
      {
        "text": "تخيل، المكيف توقف في الليل!",
        "slot": "المكيف توقف في الليل",
        "cue": {
          "en": "the AC stopped at night",
          "ko": "밤에 에어컨이 멈췄다"
        },
        "gloss": {
          "en": "Imagine, the AC stopped in the night!",
          "ko": "있잖아, 밤에 에어컨이 멈췄어!"
        }
      },
      {
        "text": "تخيل، البطل مات في الحلقة الأخيرة!",
        "slot": "البطل مات في الحلقة الأخيرة",
        "cue": {
          "en": "the hero died in the last episode",
          "ko": "주인공이 마지막 회에 죽었다"
        },
        "gloss": {
          "en": "Imagine, the hero died in the last episode!",
          "ko": "있잖아, 주인공이 마지막 회에서 죽었어!"
        }
      },
      {
        "text": "تخيل، قابلت مدرسي القديم في المطار!",
        "slot": "قابلت مدرسي القديم في المطار",
        "cue": {
          "en": "I met my old teacher at the airport",
          "ko": "공항에서 옛 선생님을 만났다"
        },
        "gloss": {
          "en": "Imagine, I met my old teacher at the airport!",
          "ko": "있잖아, 공항에서 옛날 선생님을 만났어!"
        }
      }
    ]
  },
  {
    "id": "ar-f3-17",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "بالعكس، ___.",
    "core": [
      "بالعكس"
    ],
    "meaning": {
      "en": "Disagreeing gently: On the contrary, ___.",
      "ko": "부드럽게 반대하기: 오히려 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "بالعكس",
      "أظن أن"
    ],
    "examples": [
      {
        "text": "بالعكس، الحلقة كانت ممتازة.",
        "slot": "الحلقة كانت ممتازة",
        "cue": {
          "en": "the episode was excellent",
          "ko": "그 회가 훌륭했다"
        },
        "gloss": {
          "en": "On the contrary, the episode was excellent.",
          "ko": "오히려 그 회는 훌륭했어."
        }
      },
      {
        "text": "بالعكس، أظن أن السعر مناسب.",
        "slot": "السعر مناسب",
        "cue": {
          "en": "the price is fair",
          "ko": "가격이 적당하다"
        },
        "gloss": {
          "en": "On the contrary, I think the price is fair.",
          "ko": "오히려 가격이 적당한 것 같아."
        }
      },
      {
        "text": "بالعكس، الشقة الصغيرة أهدأ.",
        "slot": "الشقة الصغيرة أهدأ",
        "cue": {
          "en": "the small flat is quieter",
          "ko": "작은 집이 더 조용하다"
        },
        "gloss": {
          "en": "On the contrary, the small flat is quieter.",
          "ko": "오히려 작은 집이 더 조용해."
        }
      },
      {
        "text": "بالعكس، الرحلة كانت سهلة.",
        "slot": "الرحلة كانت سهلة",
        "cue": {
          "en": "the trip was easy",
          "ko": "여행이 수월했다"
        },
        "gloss": {
          "en": "On the contrary, the trip was easy.",
          "ko": "오히려 여행은 수월했어."
        }
      }
    ]
  },
  {
    "id": "ar-f4-01",
    "stage": 4,
    "fn": "report",
    "pattern": "تم ___.",
    "core": [
      "تم"
    ],
    "meaning": {
      "en": "Reporting what was done (passive): ___ was done.",
      "ko": "한 일 알리기(수동): ___이/가 되었어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "تم تأجيل الاجتماع إلى الأسبوع القادم.",
        "slot": "تأجيل الاجتماع",
        "cue": {
          "en": "postpone the meeting",
          "ko": "회의를 미루다"
        },
        "gloss": {
          "en": "The meeting was postponed to next week.",
          "ko": "회의가 다음 주로 미뤄졌어요."
        }
      },
      {
        "text": "تم إرسال التقرير إلى المدير صباحا.",
        "slot": "إرسال التقرير",
        "cue": {
          "en": "send the report",
          "ko": "보고서를 보내다"
        },
        "gloss": {
          "en": "The report was sent to the manager this morning.",
          "ko": "보고서는 아침에 부장님께 보내졌어요."
        }
      },
      {
        "text": "تم تغيير التصميم مرتين.",
        "slot": "تغيير التصميم",
        "cue": {
          "en": "change the design",
          "ko": "디자인을 바꾸다"
        },
        "gloss": {
          "en": "The design was changed twice.",
          "ko": "디자인이 두 번 바뀌었어요."
        }
      },
      {
        "text": "تم إلغاء الرحلة بسبب الطقس.",
        "slot": "إلغاء الرحلة",
        "cue": {
          "en": "cancel the trip",
          "ko": "여행을 취소하다"
        },
        "gloss": {
          "en": "The trip was cancelled because of the weather.",
          "ko": "날씨 때문에 여행이 취소됐어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-02",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "لو ___ لـ...",
    "core": [
      "لو"
    ],
    "meaning": {
      "en": "Imagining what would have happened: If ___, I would have …",
      "ko": "가정해서 말하기: 만약 ___했다면 …했을 텐데요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لو عرفت مبكرا لساعدتك.",
        "slot": "عرفت مبكرا",
        "cue": {
          "en": "know earlier",
          "ko": "일찍 알다"
        },
        "gloss": {
          "en": "If I had known earlier, I would have helped you.",
          "ko": "일찍 알았다면 도와줬을 텐데요."
        }
      },
      {
        "text": "لو كان عندي وقت لسافرت معكم.",
        "slot": "كان عندي وقت",
        "cue": {
          "en": "have time",
          "ko": "시간이 있다"
        },
        "gloss": {
          "en": "If I had time, I would travel with you.",
          "ko": "시간이 있으면 같이 여행 갔을 텐데요."
        }
      },
      {
        "text": "لو كان الإيجار أرخص لوقعت العقد.",
        "slot": "كان الإيجار أرخص",
        "cue": {
          "en": "the rent be cheaper",
          "ko": "월세가 더 싸다"
        },
        "gloss": {
          "en": "If the rent were cheaper, I would sign the contract.",
          "ko": "월세가 더 싸면 계약할 텐데요."
        }
      },
      {
        "text": "لو سألتني لقلت لك الحقيقة.",
        "slot": "سألتني",
        "cue": {
          "en": "ask me",
          "ko": "나에게 묻다"
        },
        "gloss": {
          "en": "If you had asked me, I would have told you the truth.",
          "ko": "물어봤다면 사실대로 말했을 거예요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-03",
    "stage": 4,
    "fn": "concede",
    "pattern": "رغم أن ___، ...",
    "core": [
      "رغم أن",
      "مع أن"
    ],
    "meaning": {
      "en": "Admitting a point but going on: Although ___, …",
      "ko": "인정하면서 이어 말하기: 비록 ___지만, …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "رغم أن الفكرة جيدة، التكلفة عالية.",
        "slot": "الفكرة جيدة",
        "cue": {
          "en": "the idea is good",
          "ko": "아이디어가 좋다"
        },
        "gloss": {
          "en": "Although the idea is good, the cost is high.",
          "ko": "아이디어는 좋지만 비용이 많이 들어요."
        }
      },
      {
        "text": "رغم أن المطبخ صغير، الشقة جميلة.",
        "slot": "المطبخ صغير",
        "cue": {
          "en": "the kitchen is small",
          "ko": "부엌이 작다"
        },
        "gloss": {
          "en": "Although the kitchen is small, the flat is lovely.",
          "ko": "부엌은 작지만 집이 예뻐요."
        }
      },
      {
        "text": "مع أن المدير يريد أربعة أيام، ثلاثة أيام تكفي.",
        "slot": "المدير يريد أربعة أيام",
        "cue": {
          "en": "the manager wants four days",
          "ko": "부장님이 나흘을 원하다"
        },
        "gloss": {
          "en": "Although the manager wants four days, three days are enough.",
          "ko": "부장님은 나흘을 원하지만 사흘이면 충분해요."
        }
      },
      {
        "text": "مع أن الطريق طويل، وصلنا في الوقت.",
        "slot": "الطريق طويل",
        "cue": {
          "en": "the road is long",
          "ko": "길이 멀다"
        },
        "gloss": {
          "en": "Although the road was long, we arrived on time.",
          "ko": "길은 멀었지만 제시간에 도착했어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-04",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "___ يوفر الكثير من الوقت.",
    "core": [
      "يوفر"
    ],
    "meaning": {
      "en": "Naming an advantage with a verbal noun: ___ saves a lot of time.",
      "ko": "장점 말하기(동명사 주어): ___은/는 시간을 많이 아껴 줘요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "العمل عن بعد يوفر الكثير من الوقت.",
        "slot": "العمل عن بعد",
        "cue": {
          "en": "working remotely",
          "ko": "재택근무"
        },
        "gloss": {
          "en": "Working remotely saves a lot of time.",
          "ko": "재택근무는 시간을 많이 아껴 줘요."
        }
      },
      {
        "text": "التخطيط المبكر يوفر الكثير من الوقت.",
        "slot": "التخطيط المبكر",
        "cue": {
          "en": "planning early",
          "ko": "미리 계획하기"
        },
        "gloss": {
          "en": "Planning early saves a lot of time.",
          "ko": "미리 계획하면 시간이 많이 절약돼요."
        }
      },
      {
        "text": "استخدام القطار يوفر الكثير من الوقت.",
        "slot": "استخدام القطار",
        "cue": {
          "en": "using the train",
          "ko": "기차 이용"
        },
        "gloss": {
          "en": "Taking the train saves a lot of time.",
          "ko": "기차를 타면 시간이 많이 절약돼요."
        }
      },
      {
        "text": "الطبخ مرة في الأسبوع يوفر الكثير من الوقت.",
        "slot": "الطبخ مرة في الأسبوع",
        "cue": {
          "en": "cooking once a week",
          "ko": "일주일에 한 번 요리하기"
        },
        "gloss": {
          "en": "Cooking once a week saves a lot of time.",
          "ko": "일주일에 한 번 요리하면 시간이 많이 절약돼요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-05",
    "stage": 4,
    "fn": "the-more",
    "pattern": "كلما ___، زاد ...",
    "core": [
      "كلما"
    ],
    "meaning": {
      "en": "Saying one thing grows with another: The more ___, the more …",
      "ko": "~할수록 ~하다: ___할수록 더 …해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "كلما تأخرنا، زادت المشكلة.",
        "slot": "تأخرنا",
        "cue": {
          "en": "we be late",
          "ko": "우리가 늦다"
        },
        "gloss": {
          "en": "The later we are, the bigger the problem gets.",
          "ko": "늦을수록 문제가 커져요."
        }
      },
      {
        "text": "كلما قرأت أكثر، تحسنت لغتي.",
        "slot": "قرأت أكثر",
        "cue": {
          "en": "read more",
          "ko": "더 많이 읽다"
        },
        "gloss": {
          "en": "The more I read, the better my language gets.",
          "ko": "많이 읽을수록 언어 실력이 늘어요."
        }
      },
      {
        "text": "كلما ابتعدنا عن الهاتف قبل النوم، نمنا أفضل.",
        "slot": "ابتعدنا عن الهاتف قبل النوم",
        "cue": {
          "en": "stay away from the phone before sleep",
          "ko": "자기 전에 휴대폰을 멀리하다"
        },
        "gloss": {
          "en": "The more we stay off the phone before bed, the better we sleep.",
          "ko": "자기 전에 휴대폰을 멀리할수록 잠을 잘 자요."
        }
      },
      {
        "text": "كلما تكلمت مع الناس، زادت ثقتي بنفسي.",
        "slot": "تكلمت مع الناس",
        "cue": {
          "en": "talk with people",
          "ko": "사람들과 이야기하다"
        },
        "gloss": {
          "en": "The more I talk with people, the more confident I get.",
          "ko": "사람들과 이야기할수록 자신감이 생겨요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-06",
    "stage": 4,
    "fn": "advice-give",
    "pattern": "قد يكون من الأفضل أن ___.",
    "core": [
      "قد يكون من الأفضل أن"
    ],
    "meaning": {
      "en": "Suggesting softly: It might be better to ___.",
      "ko": "부드럽게 제안하기: ___하는 게 나을 수도 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "قد يكون من الأفضل أن ننتظر قليلا.",
        "slot": "ننتظر قليلا",
        "cue": {
          "en": "wait a little (we)",
          "ko": "조금 기다리다(우리)"
        },
        "gloss": {
          "en": "It might be better to wait a little.",
          "ko": "조금 기다리는 게 나을 수도 있어요."
        }
      },
      {
        "text": "قد يكون من الأفضل أن نؤجل بعضها إلى المرحلة الثانية.",
        "slot": "نؤجل بعضها إلى المرحلة الثانية",
        "cue": {
          "en": "postpone some to the second phase (we)",
          "ko": "일부를 2단계로 미루다(우리)"
        },
        "gloss": {
          "en": "It might be better to postpone some of them to the second phase.",
          "ko": "일부는 2단계로 미루는 게 나을 수도 있어요."
        }
      },
      {
        "text": "قد يكون من الأفضل أن تتصل به اليوم.",
        "slot": "تتصل به اليوم",
        "cue": {
          "en": "call him today (you)",
          "ko": "오늘 그에게 전화하다(너)"
        },
        "gloss": {
          "en": "It might be better for you to call him today.",
          "ko": "오늘 그에게 전화하는 게 나을 수도 있어요."
        }
      },
      {
        "text": "قد يكون من الأفضل أن نسأل المدير أولا.",
        "slot": "نسأل المدير أولا",
        "cue": {
          "en": "ask the manager first (we)",
          "ko": "먼저 부장님께 묻다(우리)"
        },
        "gloss": {
          "en": "It might be better to ask the manager first.",
          "ko": "먼저 부장님께 여쭤보는 게 나을 수도 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-07",
    "stage": 4,
    "fn": "guess",
    "pattern": "ربما ___.",
    "core": [
      "ربما"
    ],
    "meaning": {
      "en": "Saying something is possible: Maybe ___.",
      "ko": "가능성 말하기: 어쩌면 ___할지도 몰라요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ربما أزور شقة أخرى اليوم.",
        "slot": "أزور شقة أخرى اليوم",
        "cue": {
          "en": "visit another flat today",
          "ko": "오늘 다른 집을 보러 가다"
        },
        "gloss": {
          "en": "Maybe I'll visit another flat today.",
          "ko": "어쩌면 오늘 다른 집을 보러 갈지도 몰라요."
        }
      },
      {
        "text": "ربما نسافر في الصيف.",
        "slot": "نسافر في الصيف",
        "cue": {
          "en": "travel in the summer (we)",
          "ko": "여름에 여행하다(우리)"
        },
        "gloss": {
          "en": "Maybe we'll travel in the summer.",
          "ko": "어쩌면 여름에 여행 갈지도 몰라요."
        }
      },
      {
        "text": "ربما يتأخر القطار قليلا.",
        "slot": "يتأخر القطار قليلا",
        "cue": {
          "en": "the train be a bit late",
          "ko": "기차가 조금 늦다"
        },
        "gloss": {
          "en": "The train may be a little late.",
          "ko": "기차가 조금 늦을지도 몰라요."
        }
      },
      {
        "text": "ربما تكون الفكرة جيدة، لكنها مكلفة.",
        "slot": "تكون الفكرة جيدة",
        "cue": {
          "en": "the idea be good",
          "ko": "아이디어가 좋다"
        },
        "gloss": {
          "en": "Maybe the idea is good, but it's expensive.",
          "ko": "아이디어는 좋을지도 모르지만 비싸요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-08",
    "stage": 4,
    "fn": "change-topic",
    "pattern": "أما ___ فـ...",
    "core": [
      "أما"
    ],
    "meaning": {
      "en": "Turning to another point: As for ___, …",
      "ko": "화제 넘기기: ___은/는 말이죠, …"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "أما الميزانية فسنناقشها لاحقا.",
        "slot": "الميزانية",
        "cue": {
          "en": "the budget",
          "ko": "예산"
        },
        "gloss": {
          "en": "As for the budget, we'll discuss it later.",
          "ko": "예산은 나중에 논의할게요."
        }
      },
      {
        "text": "أما أنا فأحب يومين في المكتب.",
        "slot": "أنا",
        "cue": {
          "en": "me",
          "ko": "나"
        },
        "gloss": {
          "en": "As for me, I like two days in the office.",
          "ko": "저는 사무실에 이틀 나가는 게 좋아요."
        }
      },
      {
        "text": "أما المطبخ فصغير قليلا.",
        "slot": "المطبخ",
        "cue": {
          "en": "the kitchen",
          "ko": "부엌"
        },
        "gloss": {
          "en": "As for the kitchen, it's a bit small.",
          "ko": "부엌은 좀 작아요."
        }
      },
      {
        "text": "أما التصميم الجديد فجاهز تقريبا.",
        "slot": "التصميم الجديد",
        "cue": {
          "en": "the new design",
          "ko": "새 디자인"
        },
        "gloss": {
          "en": "As for the new design, it's almost ready.",
          "ko": "새 디자인은 거의 다 됐어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-09",
    "stage": 4,
    "fn": "persuade",
    "pattern": "بالإضافة إلى ذلك، ___.",
    "core": [
      "بالإضافة إلى ذلك"
    ],
    "meaning": {
      "en": "Adding another point: In addition, ___.",
      "ko": "덧붙이기: 게다가 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "بالإضافة إلى ذلك"
    ],
    "examples": [
      {
        "text": "بالإضافة إلى ذلك، سأرسل له خطة جديدة.",
        "slot": "سأرسل له خطة جديدة",
        "cue": {
          "en": "send him a new plan",
          "ko": "그에게 새 계획을 보내다"
        },
        "gloss": {
          "en": "In addition, I'll send him a new plan.",
          "ko": "게다가 그에게 새 계획도 보낼게요."
        }
      },
      {
        "text": "بالإضافة إلى ذلك، الشقة قريبة من المحطة.",
        "slot": "الشقة قريبة من المحطة",
        "cue": {
          "en": "the flat is near the station",
          "ko": "집이 역에서 가깝다"
        },
        "gloss": {
          "en": "In addition, the flat is near the station.",
          "ko": "게다가 집이 역에서 가까워요."
        }
      },
      {
        "text": "بالإضافة إلى ذلك، نصح الطبيب بالمشي كل يوم.",
        "slot": "نصح الطبيب بالمشي كل يوم",
        "cue": {
          "en": "the doctor advised walking every day",
          "ko": "의사가 매일 걷기를 권하다"
        },
        "gloss": {
          "en": "In addition, the doctor advised walking every day.",
          "ko": "게다가 의사는 매일 걸으라고 했어요."
        }
      },
      {
        "text": "بالإضافة إلى ذلك، يمكننا أن نجرب الفكرة لشهرين.",
        "slot": "يمكننا أن نجرب الفكرة لشهرين",
        "cue": {
          "en": "we can try the idea for two months",
          "ko": "두 달 동안 그 생각을 시험해 볼 수 있다"
        },
        "gloss": {
          "en": "In addition, we can try the idea for two months.",
          "ko": "게다가 두 달 동안 시험해 볼 수도 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-10",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "من ناحيتي، ___.",
    "core": [
      "من ناحيتي"
    ],
    "meaning": {
      "en": "Saying what you can offer: For my part, ___.",
      "ko": "내 쪽 입장 말하기: 제 쪽에서는 ___."
    },
    "grammar": [],
    "expressions": [
      "من ناحيتي"
    ],
    "examples": [
      {
        "text": "من ناحيتي، أستطيع أن أتصل به اليوم.",
        "slot": "أستطيع أن أتصل به اليوم",
        "cue": {
          "en": "I can call him today",
          "ko": "오늘 그에게 전화할 수 있다"
        },
        "gloss": {
          "en": "For my part, I can call him today.",
          "ko": "제 쪽에서는 오늘 그에게 전화할 수 있어요."
        }
      },
      {
        "text": "من ناحيتي، ما عندي مانع من التأجيل.",
        "slot": "ما عندي مانع من التأجيل",
        "cue": {
          "en": "I don't mind postponing",
          "ko": "미루는 것도 괜찮다"
        },
        "gloss": {
          "en": "For my part, I don't mind postponing.",
          "ko": "저로서는 미뤄도 괜찮아요."
        }
      },
      {
        "text": "من ناحيتي، أفضل أن نبدأ مبكرا.",
        "slot": "أفضل أن نبدأ مبكرا",
        "cue": {
          "en": "prefer to start early",
          "ko": "일찍 시작하는 게 좋다"
        },
        "gloss": {
          "en": "For my part, I'd prefer we start early.",
          "ko": "저는 일찍 시작하는 게 좋아요."
        }
      },
      {
        "text": "من ناحيتي، سأنهي التقرير قبل الخميس.",
        "slot": "سأنهي التقرير قبل الخميس",
        "cue": {
          "en": "finish the report before Thursday",
          "ko": "목요일 전에 보고서를 끝내다"
        },
        "gloss": {
          "en": "For my part, I'll finish the report before Thursday.",
          "ko": "저는 목요일 전에 보고서를 끝낼게요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-11",
    "stage": 4,
    "fn": "concede",
    "pattern": "أفهم وجهة نظرك، لكن ___.",
    "core": [
      "أفهم وجهة نظرك"
    ],
    "meaning": {
      "en": "Answering an objection politely: I understand your point, but ___.",
      "ko": "반론에 정중히 답하기: 무슨 말인지 알겠지만 ___."
    },
    "grammar": [],
    "expressions": [
      "أفهم وجهة نظرك"
    ],
    "examples": [
      {
        "text": "أفهم وجهة نظرك، لكن التكلفة عالية جدا.",
        "slot": "التكلفة عالية جدا",
        "cue": {
          "en": "the cost is very high",
          "ko": "비용이 아주 많이 들다"
        },
        "gloss": {
          "en": "I understand your point, but the cost is very high.",
          "ko": "무슨 말인지 알겠지만 비용이 너무 많이 들어요."
        }
      },
      {
        "text": "أفهم وجهة نظرك، لكن الوقت لا يكفي.",
        "slot": "الوقت لا يكفي",
        "cue": {
          "en": "there isn't enough time",
          "ko": "시간이 부족하다"
        },
        "gloss": {
          "en": "I understand your point, but there isn't enough time.",
          "ko": "무슨 말인지 알겠지만 시간이 부족해요."
        }
      },
      {
        "text": "أفهم وجهة نظرك، لكن الفريق متعب.",
        "slot": "الفريق متعب",
        "cue": {
          "en": "the team is tired",
          "ko": "팀이 지쳐 있다"
        },
        "gloss": {
          "en": "I understand your point, but the team is tired.",
          "ko": "무슨 말인지 알겠지만 팀이 지쳐 있어요."
        }
      },
      {
        "text": "أفهم وجهة نظرك، لكن العميل يريد النتيجة الآن.",
        "slot": "العميل يريد النتيجة الآن",
        "cue": {
          "en": "the client wants the result now",
          "ko": "고객이 결과를 지금 원하다"
        },
        "gloss": {
          "en": "I understand your point, but the client wants the result now.",
          "ko": "무슨 말인지 알겠지만 고객은 지금 결과를 원해요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-12",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "ليس بالضرورة أن ___.",
    "core": [
      "ليس بالضرورة"
    ],
    "meaning": {
      "en": "Saying it's not necessarily so: It's not necessarily the case that ___.",
      "ko": "꼭 그렇지는 않다고 말하기: 꼭 ___라는 법은 없어요."
    },
    "grammar": [],
    "expressions": [
      "ليس بالضرورة"
    ],
    "examples": [
      {
        "text": "ليس بالضرورة أن يكون الأغلى هو الأفضل.",
        "slot": "يكون الأغلى هو الأفضل",
        "cue": {
          "en": "the most expensive be the best",
          "ko": "가장 비싼 게 가장 좋다"
        },
        "gloss": {
          "en": "The most expensive isn't necessarily the best.",
          "ko": "가장 비싼 게 꼭 가장 좋은 건 아니에요."
        }
      },
      {
        "text": "ليس بالضرورة أن نجتمع كل يوم.",
        "slot": "نجتمع كل يوم",
        "cue": {
          "en": "meet every day (we)",
          "ko": "매일 모이다(우리)"
        },
        "gloss": {
          "en": "We don't necessarily have to meet every day.",
          "ko": "꼭 매일 모일 필요는 없어요."
        }
      },
      {
        "text": "ليس بالضرورة أن تعرف كل الكلمات.",
        "slot": "تعرف كل الكلمات",
        "cue": {
          "en": "know all the words (you)",
          "ko": "모든 단어를 알다(너)"
        },
        "gloss": {
          "en": "You don't necessarily need to know every word.",
          "ko": "모든 단어를 꼭 알아야 하는 건 아니에요."
        }
      },
      {
        "text": "ليس بالضرورة أن ينجح الحل نفسه مرتين.",
        "slot": "ينجح الحل نفسه مرتين",
        "cue": {
          "en": "the same solution work twice",
          "ko": "같은 방법이 두 번 통하다"
        },
        "gloss": {
          "en": "The same solution won't necessarily work twice.",
          "ko": "같은 방법이 꼭 두 번 통하는 건 아니에요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-13",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "هذا يعتمد على ___.",
    "core": [
      "هذا يعتمد على"
    ],
    "meaning": {
      "en": "Saying the answer depends: That depends on ___.",
      "ko": "조건에 따라 다르다고 말하기: 그건 ___에 달렸어요."
    },
    "grammar": [],
    "expressions": [
      "هذا يعتمد على"
    ],
    "examples": [
      {
        "text": "هذا يعتمد على طبيعة العمل.",
        "slot": "طبيعة العمل",
        "cue": {
          "en": "the nature of the work",
          "ko": "일의 성격"
        },
        "gloss": {
          "en": "That depends on the nature of the work.",
          "ko": "그건 일의 성격에 달렸어요."
        }
      },
      {
        "text": "هذا يعتمد على طريقة العرض.",
        "slot": "طريقة العرض",
        "cue": {
          "en": "the way it's presented",
          "ko": "발표 방식"
        },
        "gloss": {
          "en": "That depends on how it's presented.",
          "ko": "그건 발표 방식에 달렸어요."
        }
      },
      {
        "text": "هذا يعتمد على الميزانية.",
        "slot": "الميزانية",
        "cue": {
          "en": "the budget",
          "ko": "예산"
        },
        "gloss": {
          "en": "That depends on the budget.",
          "ko": "그건 예산에 달렸어요."
        }
      },
      {
        "text": "هذا يعتمد على رأي المدير.",
        "slot": "رأي المدير",
        "cue": {
          "en": "the manager's opinion",
          "ko": "부장님 의견"
        },
        "gloss": {
          "en": "That depends on what the manager thinks.",
          "ko": "그건 부장님 의견에 달렸어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-14",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "نتفق على ___.",
    "core": [
      "نتفق على"
    ],
    "meaning": {
      "en": "Settling terms: Let's agree on ___.",
      "ko": "조건 정하기: ___(으)로 합의해요."
    },
    "grammar": [],
    "expressions": [
      "نتفق على"
    ],
    "examples": [
      {
        "text": "نتفق على أربعمئة وسبعين.",
        "slot": "أربعمئة وسبعين",
        "cue": {
          "en": "four hundred and seventy",
          "ko": "사백칠십"
        },
        "gloss": {
          "en": "Let's agree on four hundred and seventy.",
          "ko": "사백칠십으로 합의해요."
        }
      },
      {
        "text": "نتفق على موعد جديد للتسليم.",
        "slot": "موعد جديد للتسليم",
        "cue": {
          "en": "a new delivery date",
          "ko": "새 납품 날짜"
        },
        "gloss": {
          "en": "Let's agree on a new delivery date.",
          "ko": "새 납품 날짜를 정해요."
        }
      },
      {
        "text": "نتفق على هذا السعر إذن.",
        "slot": "هذا السعر",
        "cue": {
          "en": "this price",
          "ko": "이 가격"
        },
        "gloss": {
          "en": "Then let's agree on this price.",
          "ko": "그럼 이 가격으로 해요."
        }
      },
      {
        "text": "نتفق على يومين في المكتب.",
        "slot": "يومين في المكتب",
        "cue": {
          "en": "two days in the office",
          "ko": "사무실 출근 이틀"
        },
        "gloss": {
          "en": "Let's agree on two days in the office.",
          "ko": "사무실 출근은 이틀로 해요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-15",
    "stage": 4,
    "fn": "persuade",
    "pattern": "خلينا نكون واقعيين: ___.",
    "core": [
      "خلينا نكون واقعيين"
    ],
    "meaning": {
      "en": "Bringing people back to facts: Let's be realistic: ___.",
      "ko": "현실적으로 설득하기: 현실적으로 보자면, ___."
    },
    "grammar": [],
    "expressions": [
      "خلينا نكون واقعيين"
    ],
    "examples": [
      {
        "text": "خلينا نكون واقعيين: الوقت لا يكفي لكل شيء.",
        "slot": "الوقت لا يكفي لكل شيء",
        "cue": {
          "en": "there isn't time for everything",
          "ko": "모든 걸 할 시간이 없다"
        },
        "gloss": {
          "en": "Let's be realistic: there isn't time for everything.",
          "ko": "현실적으로 보자면, 모든 걸 할 시간은 없어요."
        }
      },
      {
        "text": "خلينا نكون واقعيين: الميزانية محدودة.",
        "slot": "الميزانية محدودة",
        "cue": {
          "en": "the budget is limited",
          "ko": "예산이 한정되어 있다"
        },
        "gloss": {
          "en": "Let's be realistic: the budget is limited.",
          "ko": "현실적으로 보자면, 예산이 한정돼 있어요."
        }
      },
      {
        "text": "خلينا نكون واقعيين: لن ننتهي اليوم.",
        "slot": "لن ننتهي اليوم",
        "cue": {
          "en": "we won't finish today",
          "ko": "오늘 못 끝내다"
        },
        "gloss": {
          "en": "Let's be realistic: we won't finish today.",
          "ko": "현실적으로 보자면, 오늘은 못 끝내요."
        }
      },
      {
        "text": "خلينا نكون واقعيين: العميل لن يدفع أكثر.",
        "slot": "العميل لن يدفع أكثر",
        "cue": {
          "en": "the client won't pay more",
          "ko": "고객이 더 내지 않다"
        },
        "gloss": {
          "en": "Let's be realistic: the client won't pay more.",
          "ko": "현실적으로 보자면, 고객은 더 안 낼 거예요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-16",
    "stage": 4,
    "fn": "report",
    "pattern": "باختصار، ___.",
    "core": [
      "باختصار"
    ],
    "meaning": {
      "en": "Summing up: In short, ___.",
      "ko": "요약하기: 간단히 말해서 ___."
    },
    "grammar": [],
    "expressions": [
      "باختصار"
    ],
    "examples": [
      {
        "text": "باختصار، نؤجل بعض المهام ونسلم الباقي في الوقت.",
        "slot": "نؤجل بعض المهام ونسلم الباقي في الوقت",
        "cue": {
          "en": "postpone some tasks and deliver the rest on time",
          "ko": "일부 일은 미루고 나머지는 제때 넘기다"
        },
        "gloss": {
          "en": "In short, we postpone some tasks and deliver the rest on time.",
          "ko": "간단히 말해서, 일부는 미루고 나머지는 제때 넘겨요."
        }
      },
      {
        "text": "باختصار، الشقة جميلة لكنها غالية.",
        "slot": "الشقة جميلة لكنها غالية",
        "cue": {
          "en": "the flat is nice but expensive",
          "ko": "집이 예쁘지만 비싸다"
        },
        "gloss": {
          "en": "In short, the flat is nice but expensive.",
          "ko": "간단히 말해서, 집은 예쁘지만 비싸요."
        }
      },
      {
        "text": "باختصار، نحتاج إلى أسبوع إضافي.",
        "slot": "نحتاج إلى أسبوع إضافي",
        "cue": {
          "en": "we need an extra week",
          "ko": "일주일이 더 필요하다"
        },
        "gloss": {
          "en": "In short, we need an extra week.",
          "ko": "간단히 말해서, 일주일이 더 필요해요."
        }
      },
      {
        "text": "باختصار، نكتب له اقتراحا مشتركا.",
        "slot": "نكتب له اقتراحا مشتركا",
        "cue": {
          "en": "write him a joint proposal",
          "ko": "그에게 공동 제안서를 쓰다"
        },
        "gloss": {
          "en": "In short, we write him a joint proposal.",
          "ko": "간단히 말해서, 같이 제안서를 써서 보내요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-17",
    "stage": 4,
    "fn": "clarify",
    "pattern": "في الواقع، ___.",
    "core": [
      "في الواقع"
    ],
    "meaning": {
      "en": "Correcting or explaining the facts: Actually, ___.",
      "ko": "사실 바로잡기: 실은 ___."
    },
    "grammar": [],
    "expressions": [
      "في الواقع"
    ],
    "examples": [
      {
        "text": "في الواقع، الاجتماع انتهى قبل ساعة.",
        "slot": "الاجتماع انتهى قبل ساعة",
        "cue": {
          "en": "the meeting ended an hour ago",
          "ko": "회의가 한 시간 전에 끝나다"
        },
        "gloss": {
          "en": "Actually, the meeting ended an hour ago.",
          "ko": "실은 회의가 한 시간 전에 끝났어요."
        }
      },
      {
        "text": "في الواقع، لم أقرأ التقرير بعد.",
        "slot": "لم أقرأ التقرير بعد",
        "cue": {
          "en": "haven't read the report yet",
          "ko": "보고서를 아직 안 읽다"
        },
        "gloss": {
          "en": "Actually, I haven't read the report yet.",
          "ko": "실은 보고서를 아직 못 읽었어요."
        }
      },
      {
        "text": "في الواقع، السعر يشمل الكهرباء.",
        "slot": "السعر يشمل الكهرباء",
        "cue": {
          "en": "the price includes electricity",
          "ko": "가격에 전기세가 포함되다"
        },
        "gloss": {
          "en": "Actually, the price includes electricity.",
          "ko": "실은 가격에 전기세가 포함돼 있어요."
        }
      },
      {
        "text": "في الواقع، تم تغيير الخطة في آخر لحظة.",
        "slot": "تم تغيير الخطة في آخر لحظة",
        "cue": {
          "en": "the plan was changed at the last minute",
          "ko": "계획이 막판에 바뀌다"
        },
        "gloss": {
          "en": "Actually, the plan was changed at the last minute.",
          "ko": "실은 계획이 막판에 바뀌었어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-18",
    "stage": 4,
    "fn": "hearsay",
    "pattern": "يقال إن ___.",
    "core": [
      "يقال إن"
    ],
    "meaning": {
      "en": "Passing on what people say (passive): It is said that ___.",
      "ko": "들은 말 전하기(수동): ___라고들 해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "يقال إن بعض الفرق تفقد التواصل مع الوقت.",
        "slot": "بعض الفرق تفقد التواصل مع الوقت",
        "cue": {
          "en": "some teams lose touch over time",
          "ko": "어떤 팀은 시간이 지나며 소통이 끊기다"
        },
        "gloss": {
          "en": "It is said that some teams lose touch over time.",
          "ko": "어떤 팀은 시간이 지나면 소통이 끊긴다고들 해요."
        }
      },
      {
        "text": "يقال إن المطعم الجديد ممتاز.",
        "slot": "المطعم الجديد ممتاز",
        "cue": {
          "en": "the new restaurant is excellent",
          "ko": "새 식당이 아주 좋다"
        },
        "gloss": {
          "en": "People say the new restaurant is excellent.",
          "ko": "새 식당이 아주 좋다고들 해요."
        }
      },
      {
        "text": "يقال إن الإيجارات سترتفع هذا العام.",
        "slot": "الإيجارات سترتفع هذا العام",
        "cue": {
          "en": "rents will rise this year",
          "ko": "올해 월세가 오르다"
        },
        "gloss": {
          "en": "It is said that rents will go up this year.",
          "ko": "올해 월세가 오른다고들 해요."
        }
      },
      {
        "text": "يقال إن المدير سيغادر الشركة.",
        "slot": "المدير سيغادر الشركة",
        "cue": {
          "en": "the manager will leave the company",
          "ko": "부장님이 회사를 떠나다"
        },
        "gloss": {
          "en": "Word is that the manager will leave the company.",
          "ko": "부장님이 회사를 떠난다는 말이 있어요."
        }
      }
    ]
  },
  {
    "id": "ar-f4-19",
    "stage": 4,
    "fn": "advice-give",
    "pattern": "لو كنت مكانك، ل___.",
    "core": [
      "لو كنت مكانك"
    ],
    "meaning": {
      "en": "Advising through a hypothetical: If I were you, I would ___.",
      "ko": "가정으로 조언하기: 내가 너라면 ___할 텐데."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لو كنت مكانك، لقبلت العرض.",
        "slot": "قبلت العرض",
        "cue": {
          "en": "accept the offer",
          "ko": "제안을 받아들이다"
        },
        "gloss": {
          "en": "If I were you, I'd accept the offer.",
          "ko": "내가 너라면 그 제안을 받아들일 거야."
        }
      },
      {
        "text": "لو كنت مكانك، لسألت الطبيب.",
        "slot": "سألت الطبيب",
        "cue": {
          "en": "ask the doctor",
          "ko": "의사에게 묻다"
        },
        "gloss": {
          "en": "If I were you, I'd ask the doctor.",
          "ko": "내가 너라면 의사한테 물어볼 거야."
        }
      },
      {
        "text": "لو كنت مكانك، لنمت مبكرا الليلة.",
        "slot": "نمت مبكرا الليلة",
        "cue": {
          "en": "go to bed early tonight",
          "ko": "오늘 밤 일찍 자다"
        },
        "gloss": {
          "en": "If I were you, I'd go to bed early tonight.",
          "ko": "내가 너라면 오늘 밤 일찍 잘 거야."
        }
      },
      {
        "text": "لو كنت مكانك، لانتظرت قليلا.",
        "slot": "انتظرت قليلا",
        "cue": {
          "en": "wait a little",
          "ko": "조금 기다리다"
        },
        "gloss": {
          "en": "If I were you, I'd wait a little.",
          "ko": "내가 너라면 조금 기다리겠어."
        }
      }
    ]
  },
  {
    "id": "ar-f5-01",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "لقد ___.",
    "core": [
      "لقد"
    ],
    "meaning": {
      "en": "Stressing that something really happened: (Indeed) I have ___.",
      "ko": "강조하며 말하기: 정말로 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لقد كان لي شرف العمل معكم.",
        "slot": "كان لي شرف العمل معكم",
        "cue": {
          "en": "have the honour of working with you",
          "ko": "여러분과 함께 일하는 영광을 누리다"
        },
        "gloss": {
          "en": "It has been an honour to work with you.",
          "ko": "여러분과 함께 일한 건 정말 영광이었어요."
        }
      },
      {
        "text": "لقد نجحت في الامتحان أخيرا.",
        "slot": "نجحت في الامتحان",
        "cue": {
          "en": "pass the exam",
          "ko": "시험에 붙다"
        },
        "gloss": {
          "en": "I've finally passed the exam.",
          "ko": "드디어 시험에 붙었어요."
        }
      },
      {
        "text": "لقد عملت مع ليلى سنوات طويلة.",
        "slot": "عملت مع ليلى",
        "cue": {
          "en": "work with Layla",
          "ko": "라일라와 함께 일하다"
        },
        "gloss": {
          "en": "I worked with Layla for many long years.",
          "ko": "라일라와 정말 오랜 세월 함께 일했어요."
        }
      },
      {
        "text": "لقد تغير كل شيء في الحي.",
        "slot": "تغير كل شيء",
        "cue": {
          "en": "everything change",
          "ko": "모든 것이 바뀌다"
        },
        "gloss": {
          "en": "Everything in the neighbourhood has changed.",
          "ko": "동네가 정말 다 바뀌었어요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-02",
    "stage": 5,
    "fn": "debate",
    "pattern": "إن ___ ليس مجرد ...، بل ...",
    "core": [
      "إن"
    ],
    "meaning": {
      "en": "Making a strong formal claim: Indeed, ___ is not just …, but …",
      "ko": "격식 있게 힘주어 주장하기: 무릇 ___은/는 단지 …이 아니라 …예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "إن اللغة ليست مجرد أداة، بل هي طريقة نرى بها العالم.",
        "slot": "اللغة",
        "cue": {
          "en": "language",
          "ko": "언어"
        },
        "gloss": {
          "en": "Language is not just a tool; it is a way we see the world.",
          "ko": "언어는 단지 도구가 아니라 세상을 보는 방식이에요."
        }
      },
      {
        "text": "إن العمل ليس مجرد راتب، بل هو جزء من حياتنا.",
        "slot": "العمل",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "Work is not just a salary; it is part of our lives.",
          "ko": "일은 단지 월급이 아니라 삶의 일부예요."
        }
      },
      {
        "text": "إن الصداقة ليست مجرد كلام، بل هي أفعال.",
        "slot": "الصداقة",
        "cue": {
          "en": "friendship",
          "ko": "우정"
        },
        "gloss": {
          "en": "Friendship is not just words; it is deeds.",
          "ko": "우정은 말이 아니라 행동이에요."
        }
      },
      {
        "text": "إن السفر ليس مجرد متعة، بل هو مدرسة.",
        "slot": "السفر",
        "cue": {
          "en": "travel",
          "ko": "여행"
        },
        "gloss": {
          "en": "Travel is not just fun; it is a school.",
          "ko": "여행은 단지 즐거움이 아니라 배움터예요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-03",
    "stage": 5,
    "fn": "thank",
    "pattern": "لا يسعني إلا أن ___.",
    "core": [
      "لا يسعني إلا"
    ],
    "meaning": {
      "en": "Formal speech: I can only ___ (I cannot but ___).",
      "ko": "격식 있는 인사말: ___할 수밖에 없어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "لا يسعني إلا"
    ],
    "examples": [
      {
        "text": "لا يسعني إلا أن أشكركم.",
        "slot": "أشكركم",
        "cue": {
          "en": "thank you all",
          "ko": "여러분께 감사하다"
        },
        "gloss": {
          "en": "I can only thank you all.",
          "ko": "여러분께 감사드릴 뿐입니다."
        }
      },
      {
        "text": "لا يسعني إلا أن أعتذر عن التأخير.",
        "slot": "أعتذر عن التأخير",
        "cue": {
          "en": "apologize for the delay",
          "ko": "늦어진 것을 사과하다"
        },
        "gloss": {
          "en": "I can only apologize for the delay.",
          "ko": "늦어진 점 사과드릴 수밖에 없습니다."
        }
      },
      {
        "text": "لا يسعني إلا أن أتمنى لكم التوفيق.",
        "slot": "أتمنى لكم التوفيق",
        "cue": {
          "en": "wish you success",
          "ko": "여러분의 성공을 빌다"
        },
        "gloss": {
          "en": "I can only wish you every success.",
          "ko": "여러분의 성공을 빌 뿐입니다."
        }
      },
      {
        "text": "لا يسعني إلا أن أعبر عن فخري بهذا الفريق.",
        "slot": "أعبر عن فخري بهذا الفريق",
        "cue": {
          "en": "express my pride in this team",
          "ko": "이 팀이 자랑스럽다고 말하다"
        },
        "gloss": {
          "en": "I can only express how proud I am of this team.",
          "ko": "이 팀이 정말 자랑스럽다는 말밖에 할 게 없습니다."
        }
      }
    ]
  },
  {
    "id": "ar-f5-04",
    "stage": 5,
    "fn": "describe-thing",
    "pattern": "لا ___ إلا ...",
    "core": [
      "إلا"
    ],
    "meaning": {
      "en": "Saying 'only' with an exception: I ___ nothing but …",
      "ko": "예외로 '~만' 말하기: …밖에 ___하지 않아요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "في البيت لا أتكلم إلا العامية.",
        "slot": "أتكلم",
        "cue": {
          "en": "speak",
          "ko": "말하다"
        },
        "gloss": {
          "en": "At home I speak nothing but the dialect.",
          "ko": "집에서는 사투리만 써요."
        }
      },
      {
        "text": "لا أشرب إلا القهوة في الصباح.",
        "slot": "أشرب",
        "cue": {
          "en": "drink",
          "ko": "마시다"
        },
        "gloss": {
          "en": "In the morning I drink only coffee.",
          "ko": "아침에는 커피만 마셔요."
        }
      },
      {
        "text": "لم أفعل شيئا إلا الواجب.",
        "slot": "أفعل شيئا",
        "cue": {
          "en": "do anything",
          "ko": "무언가를 하다"
        },
        "gloss": {
          "en": "I did nothing but my duty.",
          "ko": "도리를 했을 뿐이에요."
        }
      },
      {
        "text": "لا نعرف عنه إلا اسمه.",
        "slot": "نعرف عنه",
        "cue": {
          "en": "know about him (we)",
          "ko": "그에 대해 알다(우리)"
        },
        "gloss": {
          "en": "We know nothing about him except his name.",
          "ko": "그에 대해선 이름밖에 몰라요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-05",
    "stage": 5,
    "fn": "describe-thing",
    "pattern": "... غير ___.",
    "core": [
      "غير"
    ],
    "meaning": {
      "en": "Exception with غير: no one/nothing except ___.",
      "ko": "غير로 예외 말하기: ___ 말고는 없어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لا أعرف أحدا هنا غير أخي.",
        "slot": "أخي",
        "cue": {
          "en": "my brother",
          "ko": "내 형/동생"
        },
        "gloss": {
          "en": "I don't know anyone here except my brother.",
          "ko": "여기서 아는 사람은 동생밖에 없어요."
        }
      },
      {
        "text": "لم يحضر غير ثلاثة أشخاص.",
        "slot": "ثلاثة أشخاص",
        "cue": {
          "en": "three people",
          "ko": "세 사람"
        },
        "gloss": {
          "en": "Only three people came.",
          "ko": "세 사람밖에 안 왔어요."
        }
      },
      {
        "text": "ما عندي غير هذا الحل.",
        "slot": "هذا الحل",
        "cue": {
          "en": "this solution",
          "ko": "이 해결책"
        },
        "gloss": {
          "en": "I have no solution other than this one.",
          "ko": "이 방법밖에 없어요."
        }
      },
      {
        "text": "لم يبق غير أسبوع على الامتحان.",
        "slot": "أسبوع على الامتحان",
        "cue": {
          "en": "a week until the exam",
          "ko": "시험까지 일주일"
        },
        "gloss": {
          "en": "There's only a week left until the exam.",
          "ko": "시험까지 일주일밖에 안 남았어요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-06",
    "stage": 5,
    "fn": "changed",
    "pattern": "تغير ___ تغيرا كبيرا.",
    "core": [
      "تغيرا كبيرا",
      "تغيرا جذريا"
    ],
    "meaning": {
      "en": "Stressing how much something changed: ___ changed enormously.",
      "ko": "크게 변했다고 강조하기: ___이/가 크게 변했어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "تغيرت المدينة تغيرا كبيرا.",
        "slot": "المدينة",
        "cue": {
          "en": "the city",
          "ko": "도시"
        },
        "gloss": {
          "en": "The city has changed enormously.",
          "ko": "도시가 정말 크게 변했어요."
        }
      },
      {
        "text": "لقد تغير مكتبنا بفضلها تغيرا كبيرا.",
        "slot": "مكتبنا",
        "cue": {
          "en": "our office",
          "ko": "우리 사무실"
        },
        "gloss": {
          "en": "Thanks to her, our office has changed a great deal.",
          "ko": "그녀 덕분에 우리 사무실이 크게 바뀌었어요."
        }
      },
      {
        "text": "تغير أخي تغيرا كبيرا بعد السفر.",
        "slot": "أخي",
        "cue": {
          "en": "my brother",
          "ko": "내 형/동생"
        },
        "gloss": {
          "en": "My brother changed a lot after travelling.",
          "ko": "동생이 여행 뒤로 많이 변했어요."
        }
      },
      {
        "text": "تغيرت حياتي تغيرا جذريا بعد الزواج.",
        "slot": "حياتي",
        "cue": {
          "en": "my life",
          "ko": "내 삶"
        },
        "gloss": {
          "en": "My life changed radically after marriage.",
          "ko": "결혼 후 제 삶이 완전히 바뀌었어요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-07",
    "stage": 5,
    "fn": "like",
    "pattern": "___ حبا كبيرا.",
    "core": [
      "حبا كبيرا"
    ],
    "meaning": {
      "en": "Stressing how much you love something: I love ___ dearly.",
      "ko": "강하게 좋아한다고 말하기: ___을/를 정말 많이 사랑해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "كنت أحبه حبا كبيرا.",
        "slot": "كنت أحبه",
        "cue": {
          "en": "love him (used to)",
          "ko": "그를 사랑하다(예전)"
        },
        "gloss": {
          "en": "I loved him dearly.",
          "ko": "그분을 정말 많이 좋아했어요."
        }
      },
      {
        "text": "أحب هذه المدينة حبا كبيرا.",
        "slot": "أحب هذه المدينة",
        "cue": {
          "en": "love this city",
          "ko": "이 도시를 사랑하다"
        },
        "gloss": {
          "en": "I love this city dearly.",
          "ko": "이 도시를 정말 사랑해요."
        }
      },
      {
        "text": "تحب أمي حديقتها حبا كبيرا.",
        "slot": "تحب أمي حديقتها",
        "cue": {
          "en": "my mother loves her garden",
          "ko": "엄마가 정원을 사랑하다"
        },
        "gloss": {
          "en": "My mother loves her garden dearly.",
          "ko": "엄마는 정원을 정말 아끼세요."
        }
      },
      {
        "text": "أحببنا ذلك المعلم حبا كبيرا.",
        "slot": "أحببنا ذلك المعلم",
        "cue": {
          "en": "we loved that teacher",
          "ko": "우리가 그 선생님을 좋아하다"
        },
        "gloss": {
          "en": "We loved that teacher dearly.",
          "ko": "우리는 그 선생님을 정말 좋아했어요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-08",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "رحمه الله و___.",
    "core": [
      "رحمه الله",
      "رحمها الله"
    ],
    "meaning": {
      "en": "Offering a prayer for someone who died: May God have mercy on him and ___.",
      "ko": "고인을 위해 기원하기: 하나님이 그에게 자비를 베푸시고 ___하시길."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "رحمه الله وأسكنه فسيح جناته.",
        "slot": "أسكنه فسيح جناته",
        "cue": {
          "en": "grant him a place in paradise",
          "ko": "그를 천국에 머물게 하다"
        },
        "gloss": {
          "en": "May God have mercy on him and grant him paradise.",
          "ko": "고인이 편히 쉬시길 빕니다."
        }
      },
      {
        "text": "رحمها الله وغفر لها.",
        "slot": "غفر لها",
        "cue": {
          "en": "forgive her",
          "ko": "그녀를 용서하다"
        },
        "gloss": {
          "en": "May God have mercy on her and forgive her.",
          "ko": "고인이 용서받고 편히 쉬시길 빕니다."
        }
      },
      {
        "text": "رحمه الله وجعل مثواه الجنة.",
        "slot": "جعل مثواه الجنة",
        "cue": {
          "en": "make paradise his resting place",
          "ko": "천국을 그의 안식처로 삼다"
        },
        "gloss": {
          "en": "May God have mercy on him and make paradise his home.",
          "ko": "고인이 천국에서 쉬시길 빕니다."
        }
      },
      {
        "text": "رحمها الله وصبركم على فراقها.",
        "slot": "صبركم على فراقها",
        "cue": {
          "en": "give you patience at her loss",
          "ko": "그녀를 잃은 슬픔을 견디게 하다"
        },
        "gloss": {
          "en": "May God have mercy on her and give you patience at her loss.",
          "ko": "고인이 편히 쉬시고 여러분이 슬픔을 견디시길 빕니다."
        }
      }
    ]
  },
  {
    "id": "ar-f5-09",
    "stage": 5,
    "fn": "thank",
    "pattern": "بارك الله فيك ___.",
    "core": [
      "بارك الله فيك",
      "بارك الله فيكم"
    ],
    "meaning": {
      "en": "Thanking with a blessing: God bless you ___.",
      "ko": "축복으로 고마움 말하기: ___ 정말 고마워요(축복을 빌어요)."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "بارك الله فيك على هذه المساعدة.",
        "slot": "على هذه المساعدة",
        "cue": {
          "en": "for this help",
          "ko": "이 도움에 대해"
        },
        "gloss": {
          "en": "God bless you for this help.",
          "ko": "도와줘서 정말 고마워요."
        }
      },
      {
        "text": "بارك الله فيكم على الضيافة الجميلة.",
        "slot": "على الضيافة الجميلة",
        "cue": {
          "en": "for the lovely hospitality",
          "ko": "따뜻한 대접에 대해"
        },
        "gloss": {
          "en": "God bless you all for the lovely hospitality.",
          "ko": "따뜻하게 대접해 주셔서 감사합니다."
        }
      },
      {
        "text": "بارك الله فيك على وقتك وصبرك.",
        "slot": "على وقتك وصبرك",
        "cue": {
          "en": "for your time and patience",
          "ko": "시간 내주고 참아 준 것에 대해"
        },
        "gloss": {
          "en": "God bless you for your time and patience.",
          "ko": "시간 내 주고 기다려 줘서 고마워요."
        }
      },
      {
        "text": "بارك الله فيك، ووفقك في عملك الجديد.",
        "slot": "ووفقك في عملك الجديد",
        "cue": {
          "en": "and grant you success in your new job",
          "ko": "새 일에서 잘되길"
        },
        "gloss": {
          "en": "God bless you and grant you success in your new job.",
          "ko": "새 일에서도 잘되길 빌어요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-10",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "يبدو أن ___.",
    "core": [
      "يبدو أن"
    ],
    "meaning": {
      "en": "Hedging: It seems that ___.",
      "ko": "에둘러 말하기: ___인 것 같아요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "يبدو أن الأمر أعقد مما توقعنا.",
        "slot": "الأمر أعقد مما توقعنا",
        "cue": {
          "en": "the matter is more complex than we expected",
          "ko": "일이 예상보다 복잡하다"
        },
        "gloss": {
          "en": "It seems the matter is more complex than we expected.",
          "ko": "일이 생각보다 복잡한 것 같아요."
        }
      },
      {
        "text": "يبدو أن اجتماعاتنا ستكون أطول.",
        "slot": "اجتماعاتنا ستكون أطول",
        "cue": {
          "en": "our meetings will be longer",
          "ko": "회의가 더 길어지다"
        },
        "gloss": {
          "en": "It seems our meetings will be longer.",
          "ko": "회의가 더 길어질 것 같아요."
        }
      },
      {
        "text": "يبدو أن وزنك زاد قليلا!",
        "slot": "وزنك زاد قليلا",
        "cue": {
          "en": "you've put on a little weight",
          "ko": "살이 좀 찌다"
        },
        "gloss": {
          "en": "Looks like you've put on a bit of weight!",
          "ko": "살이 좀 찐 것 같은데!"
        }
      },
      {
        "text": "يبدو أن المطر لن يتوقف اليوم.",
        "slot": "المطر لن يتوقف اليوم",
        "cue": {
          "en": "the rain won't stop today",
          "ko": "오늘 비가 그치지 않다"
        },
        "gloss": {
          "en": "It seems the rain won't stop today.",
          "ko": "오늘은 비가 안 그칠 것 같아요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-11",
    "stage": 5,
    "fn": "debate",
    "pattern": "لا يخفى على أحد أن ___.",
    "core": [
      "لا يخفى على أحد"
    ],
    "meaning": {
      "en": "Stating something everyone knows: It is no secret that ___.",
      "ko": "누구나 아는 사실 말하기: ___라는 건 다 아는 사실이에요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "لا يخفى على أحد"
    ],
    "examples": [
      {
        "text": "لا يخفى على أحد أن ليلى كانت قلب هذا الفريق.",
        "slot": "ليلى كانت قلب هذا الفريق",
        "cue": {
          "en": "Layla was the heart of this team",
          "ko": "라일라가 이 팀의 중심이었다"
        },
        "gloss": {
          "en": "It's no secret that Layla was the heart of this team.",
          "ko": "라일라가 이 팀의 중심이었다는 건 다 아는 사실이에요."
        }
      },
      {
        "text": "لا يخفى على أحد أن هذه مشكلة حقيقية.",
        "slot": "هذه مشكلة حقيقية",
        "cue": {
          "en": "this is a real problem",
          "ko": "이건 진짜 문제다"
        },
        "gloss": {
          "en": "It's no secret that this is a real problem.",
          "ko": "이게 진짜 문제라는 건 다 알아요."
        }
      },
      {
        "text": "لا يخفى على أحد أن الأسعار ارتفعت كثيرا.",
        "slot": "الأسعار ارتفعت كثيرا",
        "cue": {
          "en": "prices have risen a lot",
          "ko": "물가가 많이 올랐다"
        },
        "gloss": {
          "en": "It's no secret that prices have gone up a lot.",
          "ko": "물가가 많이 오른 건 다 아는 사실이에요."
        }
      },
      {
        "text": "لا يخفى على أحد أن الشباب يحبون التكنولوجيا.",
        "slot": "الشباب يحبون التكنولوجيا",
        "cue": {
          "en": "young people love technology",
          "ko": "젊은이들이 기술을 좋아하다"
        },
        "gloss": {
          "en": "It's no secret that young people love technology.",
          "ko": "젊은 사람들이 기술을 좋아한다는 건 다 알죠."
        }
      }
    ]
  },
  {
    "id": "ar-f5-12",
    "stage": 5,
    "fn": "debate",
    "pattern": "___، أليس كذلك؟",
    "core": [
      "أليس كذلك"
    ],
    "meaning": {
      "en": "Asking a rhetorical tag question: ___, isn't it?",
      "ko": "수사 의문으로 동의 끌어내기: ___, 그렇지 않나요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "لكل لغة مكانها، أليس كذلك؟",
        "slot": "لكل لغة مكانها",
        "cue": {
          "en": "every language has its place",
          "ko": "언어마다 제자리가 있다"
        },
        "gloss": {
          "en": "Every language has its place, doesn't it?",
          "ko": "언어마다 제자리가 있잖아요, 안 그래요?"
        }
      },
      {
        "text": "الفكرة كانت جيدة في البداية، أليس كذلك؟",
        "slot": "الفكرة كانت جيدة في البداية",
        "cue": {
          "en": "the idea was good at first",
          "ko": "처음엔 생각이 좋았다"
        },
        "gloss": {
          "en": "The idea was good at first, wasn't it?",
          "ko": "처음엔 괜찮은 생각이었잖아요, 그렇죠?"
        }
      },
      {
        "text": "أنت من بيروت، أليس كذلك؟",
        "slot": "أنت من بيروت",
        "cue": {
          "en": "you're from Beirut",
          "ko": "베이루트 출신이다"
        },
        "gloss": {
          "en": "You're from Beirut, aren't you?",
          "ko": "베이루트 출신이시죠, 그렇죠?"
        }
      },
      {
        "text": "الامتحان كان صعبا، أليس كذلك؟",
        "slot": "الامتحان كان صعبا",
        "cue": {
          "en": "the exam was hard",
          "ko": "시험이 어려웠다"
        },
        "gloss": {
          "en": "The exam was hard, wasn't it?",
          "ko": "시험 어려웠죠, 그렇죠?"
        }
      }
    ]
  },
  {
    "id": "ar-f5-13",
    "stage": 5,
    "fn": "debate",
    "pattern": "ومن منا لم ___؟",
    "core": [
      "ومن منا لم",
      "ومن منا لا"
    ],
    "meaning": {
      "en": "Rhetorical question to include everyone: And who among us hasn't ___?",
      "ko": "수사 의문으로 공감 끌어내기: ___ 안 해 본 사람이 어디 있어요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ومن منا لم يخطئ في البداية؟",
        "slot": "يخطئ في البداية",
        "cue": {
          "en": "make mistakes at the start",
          "ko": "처음에 실수하다"
        },
        "gloss": {
          "en": "And who among us didn't make mistakes at the start?",
          "ko": "처음에 실수 안 해 본 사람이 어디 있어요?"
        }
      },
      {
        "text": "ومن منا لم يرسب مرة أو مرتين؟",
        "slot": "يرسب مرة أو مرتين",
        "cue": {
          "en": "fail once or twice",
          "ko": "한두 번 떨어지다"
        },
        "gloss": {
          "en": "And who among us hasn't failed once or twice?",
          "ko": "한두 번 안 떨어져 본 사람이 어디 있어요?"
        }
      },
      {
        "text": "ومن منا لم يطلب منها المساعدة في آخر لحظة؟",
        "slot": "يطلب منها المساعدة في آخر لحظة",
        "cue": {
          "en": "ask her for help at the last minute",
          "ko": "막판에 그녀에게 도움을 청하다"
        },
        "gloss": {
          "en": "And which of us never asked her for help at the last minute?",
          "ko": "막판에 그녀한테 도움 안 청해 본 사람이 누가 있어요?"
        }
      },
      {
        "text": "ومن منا لا يخلط أحيانا؟",
        "slot": "يخلط أحيانا",
        "cue": {
          "en": "mix languages sometimes",
          "ko": "가끔 말을 섞다"
        },
        "gloss": {
          "en": "And which of us doesn't mix languages sometimes?",
          "ko": "가끔 말 안 섞는 사람이 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "ar-f5-14",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "بصراحة يعني، ___.",
    "core": [
      "بصراحة يعني"
    ],
    "meaning": {
      "en": "Switching to a casual, honest tone: Honestly, you know, ___.",
      "ko": "일부러 말투를 풀어 솔직하게: 솔직히 말하면, ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "بصراحة يعني، لا أعرف.",
        "slot": "لا أعرف",
        "cue": {
          "en": "I don't know",
          "ko": "모르다"
        },
        "gloss": {
          "en": "Honestly, you know, I don't know.",
          "ko": "솔직히 말하면, 잘 모르겠어요."
        }
      },
      {
        "text": "بصراحة يعني، في البيت لا أتكلم إلا العامية.",
        "slot": "في البيت لا أتكلم إلا العامية",
        "cue": {
          "en": "at home I only speak dialect",
          "ko": "집에서는 사투리만 쓰다"
        },
        "gloss": {
          "en": "Honestly, at home I only speak dialect.",
          "ko": "솔직히 집에서는 사투리만 써요."
        }
      },
      {
        "text": "بصراحة يعني، الاقتراح يحتاج إلى وقت أطول.",
        "slot": "الاقتراح يحتاج إلى وقت أطول",
        "cue": {
          "en": "the proposal needs more time",
          "ko": "제안이 시간이 더 필요하다"
        },
        "gloss": {
          "en": "Honestly, the proposal needs more time.",
          "ko": "솔직히 그 제안은 시간이 더 필요해요."
        }
      },
      {
        "text": "الموضوع، بصراحة يعني، أكبر من مجرد لغة.",
        "slot": "أكبر من مجرد لغة",
        "cue": {
          "en": "bigger than just language",
          "ko": "단순한 언어 문제보다 크다"
        },
        "gloss": {
          "en": "The issue, honestly, is bigger than just language.",
          "ko": "이 문제는, 솔직히, 언어만의 문제가 아니에요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-15",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___، إن جاز التعبير.",
    "core": [
      "إن جاز التعبير"
    ],
    "meaning": {
      "en": "Flagging a figurative phrase: ___, so to speak.",
      "ko": "비유임을 밝히기: ___, 말하자면 그래요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "إن جاز التعبير"
    ],
    "examples": [
      {
        "text": "كانت ليلى قلب هذا الفريق، إن جاز التعبير.",
        "slot": "كانت ليلى قلب هذا الفريق",
        "cue": {
          "en": "Layla was the heart of this team",
          "ko": "라일라가 이 팀의 중심이었다"
        },
        "gloss": {
          "en": "Layla was the heart of this team, so to speak.",
          "ko": "라일라는 말하자면 이 팀의 심장이었어요."
        }
      },
      {
        "text": "سؤال محرج، إن جاز التعبير!",
        "slot": "سؤال محرج",
        "cue": {
          "en": "an awkward question",
          "ko": "난처한 질문"
        },
        "gloss": {
          "en": "An awkward question, so to speak!",
          "ko": "말하자면 좀 난처한 질문이네요!"
        }
      },
      {
        "text": "المدينة متحف مفتوح، إن جاز التعبير.",
        "slot": "المدينة متحف مفتوح",
        "cue": {
          "en": "the city is an open-air museum",
          "ko": "도시가 야외 박물관이다"
        },
        "gloss": {
          "en": "The city is an open-air museum, so to speak.",
          "ko": "이 도시는 말하자면 야외 박물관이에요."
        }
      },
      {
        "text": "هذا الكتاب صديقي الأول، إن جاز التعبير.",
        "slot": "هذا الكتاب صديقي الأول",
        "cue": {
          "en": "this book is my first friend",
          "ko": "이 책이 내 첫 친구다"
        },
        "gloss": {
          "en": "This book is my first friend, so to speak.",
          "ko": "이 책은 말하자면 제 첫 친구예요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-16",
    "stage": 5,
    "fn": "persuade",
    "pattern": "حط نفسك مكاني: ___.",
    "core": [
      "حط نفسك مكاني"
    ],
    "meaning": {
      "en": "Asking for empathy (colloquial): Put yourself in my shoes: ___.",
      "ko": "입장 바꿔 생각하게 하기(구어): 내 입장이 돼 봐, ___."
    },
    "grammar": [],
    "expressions": [
      "حط نفسك مكاني"
    ],
    "examples": [
      {
        "text": "حط نفسك مكاني: الفاحص كان يصرخ صراخا متواصلا!",
        "slot": "الفاحص كان يصرخ صراخا متواصلا",
        "cue": {
          "en": "the examiner kept shouting",
          "ko": "시험관이 계속 소리 지르다"
        },
        "gloss": {
          "en": "Put yourself in my shoes: the examiner kept shouting non-stop!",
          "ko": "내 입장이 돼 봐, 시험관이 계속 소리를 질렀다니까!"
        }
      },
      {
        "text": "حط نفسك مكاني: كيف أرفض طلب أمي؟",
        "slot": "كيف أرفض طلب أمي؟",
        "cue": {
          "en": "how can I refuse my mother",
          "ko": "엄마 부탁을 어떻게 거절하다"
        },
        "gloss": {
          "en": "Put yourself in my shoes: how can I refuse my mother?",
          "ko": "내 입장이 돼 봐, 엄마 부탁을 어떻게 거절해?"
        }
      },
      {
        "text": "حط نفسك مكاني: العمل كثير والوقت قليل.",
        "slot": "العمل كثير والوقت قليل",
        "cue": {
          "en": "lots of work and little time",
          "ko": "일은 많고 시간은 없다"
        },
        "gloss": {
          "en": "Put yourself in my shoes: lots of work and little time.",
          "ko": "내 입장이 돼 봐, 일은 많고 시간은 없어."
        }
      },
      {
        "text": "حط نفسك مكاني: ماذا كنت ستفعل؟",
        "slot": "ماذا كنت ستفعل؟",
        "cue": {
          "en": "what would you have done",
          "ko": "너라면 어떻게 했겠니"
        },
        "gloss": {
          "en": "Put yourself in my shoes: what would you have done?",
          "ko": "내 입장이 돼 봐, 너라면 어떻게 했겠어?"
        }
      }
    ]
  },
  {
    "id": "ar-f5-17",
    "stage": 5,
    "fn": "clarify",
    "pattern": "مش هيك القصد، ___.",
    "core": [
      "مش هيك القصد"
    ],
    "meaning": {
      "en": "Correcting a misunderstanding (colloquial): That's not what I meant, ___.",
      "ko": "오해 바로잡기(구어): 그런 뜻이 아니야, ___."
    },
    "grammar": [],
    "expressions": [
      "مش هيك القصد"
    ],
    "examples": [
      {
        "text": "مش هيك القصد! كنت أمزح.",
        "slot": "كنت أمزح",
        "cue": {
          "en": "I was joking",
          "ko": "농담이었다"
        },
        "gloss": {
          "en": "That's not what I meant! I was joking.",
          "ko": "그런 뜻 아니야! 농담이었어."
        }
      },
      {
        "text": "مش هيك القصد، أقصد أن الخلط طبيعي.",
        "slot": "أقصد أن الخلط طبيعي",
        "cue": {
          "en": "I mean mixing is natural",
          "ko": "섞어 쓰는 게 자연스럽다는 뜻이다"
        },
        "gloss": {
          "en": "That's not quite it; I mean that mixing is natural.",
          "ko": "그런 뜻이 아니라, 섞어 쓰는 게 자연스럽다는 거예요."
        }
      },
      {
        "text": "مش هيك القصد، كنت أسأل فقط.",
        "slot": "كنت أسأل فقط",
        "cue": {
          "en": "I was only asking",
          "ko": "그냥 물어본 것이다"
        },
        "gloss": {
          "en": "That's not what I meant, I was only asking.",
          "ko": "그런 뜻 아니야, 그냥 물어본 거야."
        }
      },
      {
        "text": "مش هيك القصد، أردت أن أساعدك.",
        "slot": "أردت أن أساعدك",
        "cue": {
          "en": "I wanted to help you",
          "ko": "도와주고 싶었다"
        },
        "gloss": {
          "en": "That's not what I meant, I wanted to help you.",
          "ko": "그런 뜻 아니야, 도와주고 싶었던 거야."
        }
      }
    ]
  },
  {
    "id": "ar-f5-18",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "لا تاخذها على خاطرك، ___.",
    "core": [
      "لا تاخذها على خاطرك"
    ],
    "meaning": {
      "en": "Smoothing hurt feelings (colloquial): Don't take it personally, ___.",
      "ko": "서운함 달래기(구어): 마음에 두지 마, ___."
    },
    "grammar": [],
    "expressions": [
      "لا تاخذها على خاطرك"
    ],
    "examples": [
      {
        "text": "لا تاخذها على خاطرك، كنت أمزح.",
        "slot": "كنت أمزح",
        "cue": {
          "en": "I was joking",
          "ko": "농담이었다"
        },
        "gloss": {
          "en": "Don't take it personally, I was joking.",
          "ko": "마음에 두지 마, 농담이었어."
        }
      },
      {
        "text": "لا تاخذها على خاطرك، المدير متوتر اليوم.",
        "slot": "المدير متوتر اليوم",
        "cue": {
          "en": "the manager is stressed today",
          "ko": "부장님이 오늘 예민하다"
        },
        "gloss": {
          "en": "Don't take it personally, the manager is stressed today.",
          "ko": "마음에 두지 마, 부장님이 오늘 예민하셔."
        }
      },
      {
        "text": "لا تاخذها على خاطرك، الكل يخطئ أحيانا.",
        "slot": "الكل يخطئ أحيانا",
        "cue": {
          "en": "everyone makes mistakes sometimes",
          "ko": "누구나 가끔 실수하다"
        },
        "gloss": {
          "en": "Don't take it to heart, everyone makes mistakes sometimes.",
          "ko": "마음에 두지 마, 누구나 가끔 실수해."
        }
      },
      {
        "text": "لا تاخذها على خاطرك، ما قصدت شيئا.",
        "slot": "ما قصدت شيئا",
        "cue": {
          "en": "I didn't mean anything",
          "ko": "아무 뜻 없었다"
        },
        "gloss": {
          "en": "Don't take it personally, I didn't mean anything by it.",
          "ko": "마음에 두지 마, 아무 뜻 없었어."
        }
      }
    ]
  },
  {
    "id": "ar-f5-19",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "___، رب ضارة نافعة.",
    "core": [
      "رب ضارة نافعة"
    ],
    "meaning": {
      "en": "Reacting with a proverb: ___, every cloud has a silver lining.",
      "ko": "속담으로 반응하기: ___, 전화위복이에요."
    },
    "grammar": [],
    "expressions": [
      "رب ضارة نافعة"
    ],
    "examples": [
      {
        "text": "خسرت العمل، لكن رب ضارة نافعة.",
        "slot": "خسرت العمل",
        "cue": {
          "en": "lose the job",
          "ko": "일자리를 잃다"
        },
        "gloss": {
          "en": "I lost the job, but every cloud has a silver lining.",
          "ko": "일자리를 잃었지만 전화위복이에요."
        }
      },
      {
        "text": "تأجلت الرحلة، ورب ضارة نافعة.",
        "slot": "تأجلت الرحلة",
        "cue": {
          "en": "the trip was postponed",
          "ko": "여행이 미뤄지다"
        },
        "gloss": {
          "en": "The trip was postponed, and maybe that's a blessing in disguise.",
          "ko": "여행이 미뤄졌는데, 오히려 잘된 걸지도 몰라요."
        }
      },
      {
        "text": "تعطلت السيارة فمشينا، ورب ضارة نافعة.",
        "slot": "تعطلت السيارة فمشينا",
        "cue": {
          "en": "the car broke down so we walked",
          "ko": "차가 고장 나서 걸었다"
        },
        "gloss": {
          "en": "The car broke down so we walked — a blessing in disguise.",
          "ko": "차가 고장 나서 걸었는데, 전화위복이었어요."
        }
      },
      {
        "text": "ألغي الحفل، لكن رب ضارة نافعة: ارتحنا قليلا.",
        "slot": "ألغي الحفل",
        "cue": {
          "en": "the party was cancelled",
          "ko": "파티가 취소되다"
        },
        "gloss": {
          "en": "The party was cancelled, but there's a silver lining: we got some rest.",
          "ko": "파티가 취소됐지만 전화위복이에요. 좀 쉬었거든요."
        }
      }
    ]
  },
  {
    "id": "ar-f5-20",
    "stage": 5,
    "fn": "accept",
    "pattern": "___ على العين والراس.",
    "core": [
      "على العين والراس"
    ],
    "meaning": {
      "en": "Accepting warmly (colloquial): ___ — with pleasure, gladly.",
      "ko": "기꺼이 받아들이기(구어): ___, 얼마든지요."
    },
    "grammar": [],
    "expressions": [
      "على العين والراس"
    ],
    "examples": [
      {
        "text": "أي شيء تحتاجه، على العين والراس.",
        "slot": "أي شيء تحتاجه",
        "cue": {
          "en": "anything you need",
          "ko": "필요한 건 뭐든지"
        },
        "gloss": {
          "en": "Anything you need, it would be my pleasure.",
          "ko": "필요한 건 뭐든지 기꺼이 할게요."
        }
      },
      {
        "text": "تريد أن أساعدك في النقل؟ على العين والراس.",
        "slot": "تريد أن أساعدك في النقل؟",
        "cue": {
          "en": "you want me to help you move",
          "ko": "이사를 도와주길 원하다"
        },
        "gloss": {
          "en": "You want me to help you move? Gladly.",
          "ko": "이사 도와 달라고? 얼마든지."
        }
      },
      {
        "text": "زيارتكم لنا على العين والراس.",
        "slot": "زيارتكم لنا",
        "cue": {
          "en": "your visit to us",
          "ko": "우리 집에 오시는 것"
        },
        "gloss": {
          "en": "Your visit is most welcome.",
          "ko": "오시는 건 언제든 대환영이에요."
        }
      },
      {
        "text": "ضيوفك على العين والراس.",
        "slot": "ضيوفك",
        "cue": {
          "en": "your guests",
          "ko": "네 손님들"
        },
        "gloss": {
          "en": "Your guests are most welcome.",
          "ko": "네 손님이라면 대환영이야."
        }
      }
    ]
  }
];
