import type { Frame } from "../frames.ts";

/** 아랍어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  }
];
