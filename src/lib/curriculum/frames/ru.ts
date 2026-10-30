import type { Frame } from "../frames.ts";

/** 러시아어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const RU_FRAMES: Frame[] = [
  {
    "id": "ru-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Меня зовут ___.",
    "core": [
      "Меня зовут",
      "меня зовут"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "Меня зовут",
      "Очень приятно"
    ],
    "examples": [
      {
        "text": "Меня зовут Минсу.",
        "slot": "Минсу",
        "cue": {
          "en": "Minsu (your name)",
          "ko": "민수(내 이름)"
        },
        "gloss": {
          "en": "My name is Minsu.",
          "ko": "제 이름은 민수예요."
        }
      },
      {
        "text": "Привет, меня зовут Анна. Очень приятно.",
        "slot": "Анна",
        "cue": {
          "en": "Anna",
          "ko": "안나"
        },
        "gloss": {
          "en": "Hi, my name is Anna. Nice to meet you.",
          "ko": "안녕하세요, 저는 안나예요. 반가워요."
        }
      },
      {
        "text": "Здравствуйте, меня зовут Ким Джиу.",
        "slot": "Ким Джиу",
        "cue": {
          "en": "Kim Jiwoo (full name)",
          "ko": "김지우(성과 이름)"
        },
        "gloss": {
          "en": "Hello, my name is Kim Jiwoo.",
          "ko": "안녕하세요, 제 이름은 김지우예요."
        }
      },
      {
        "text": "Меня зовут Олег. А вас?",
        "slot": "Олег",
        "cue": {
          "en": "Oleg",
          "ko": "올레그"
        },
        "gloss": {
          "en": "My name is Oleg. And you?",
          "ko": "저는 올레그예요. 당신은요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Я из ___.",
    "core": [
      "Я из",
      "я из"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "Я из Кореи"
    ],
    "examples": [
      {
        "text": "Я из Кореи.",
        "slot": "Кореи",
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
        "text": "Я из Сеула, а ты?",
        "slot": "Сеула",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I'm from Seoul, and you?",
          "ko": "저는 서울에서 왔어, 너는?"
        }
      },
      {
        "text": "Я из Пусана.",
        "slot": "Пусана",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm from Busan.",
          "ko": "저는 부산 출신이에요."
        }
      },
      {
        "text": "Мой друг из Японии, а я из Китая.",
        "slot": "Китая",
        "cue": {
          "en": "China",
          "ko": "중국"
        },
        "gloss": {
          "en": "My friend is from Japan, and I'm from China.",
          "ko": "제 친구는 일본, 저는 중국에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Я ___.",
    "core": [
      "Я",
      "я"
    ],
    "meaning": {
      "en": "Saying what you are (no \"to be\"): I'm a ___.",
      "ko": "직업·신분 말하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я студент.",
        "slot": "студент",
        "cue": {
          "en": "a student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "Я врач, а она учительница.",
        "slot": "врач",
        "cue": {
          "en": "a doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "I'm a doctor, and she's a teacher.",
          "ko": "저는 의사고, 그녀는 선생님이에요."
        }
      },
      {
        "text": "Нет, я программист.",
        "slot": "программист",
        "cue": {
          "en": "a programmer",
          "ko": "프로그래머"
        },
        "gloss": {
          "en": "No, I'm a programmer.",
          "ko": "아니요, 저는 프로그래머예요."
        }
      },
      {
        "text": "Я турист, я здесь неделю.",
        "slot": "турист",
        "cue": {
          "en": "a tourist",
          "ko": "관광객"
        },
        "gloss": {
          "en": "I'm a tourist, I'm here for a week.",
          "ko": "저는 관광객이에요, 여기 일주일 있어요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "Я работаю в ___.",
    "core": [
      "Я работаю",
      "я работаю"
    ],
    "meaning": {
      "en": "Saying where you work: I work at ___.",
      "ko": "일하는 곳 말하기: 저는 ___에서 일해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я работаю в банке.",
        "slot": "банке",
        "cue": {
          "en": "a bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "I work at a bank.",
          "ko": "저는 은행에서 일해요."
        }
      },
      {
        "text": "Я работаю в школе.",
        "slot": "школе",
        "cue": {
          "en": "a school",
          "ko": "학교"
        },
        "gloss": {
          "en": "I work at a school.",
          "ko": "저는 학교에서 일해요."
        }
      },
      {
        "text": "Сейчас я работаю в кафе.",
        "slot": "кафе",
        "cue": {
          "en": "a café",
          "ko": "카페"
        },
        "gloss": {
          "en": "Right now I work at a café.",
          "ko": "지금은 카페에서 일해요."
        }
      },
      {
        "text": "Я работаю в больнице, а ты?",
        "slot": "больнице",
        "cue": {
          "en": "a hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I work at a hospital, and you?",
          "ko": "저는 병원에서 일해, 너는?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-05",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Где здесь ___?",
    "core": [
      "Где здесь",
      "где здесь"
    ],
    "meaning": {
      "en": "Asking where something is nearby: Where is ___ around here?",
      "ko": "근처 위치 묻기: 여기 ___ 어디 있어요?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "Где здесь туалет"
    ],
    "examples": [
      {
        "text": "Где здесь туалет?",
        "slot": "туалет",
        "cue": {
          "en": "the toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the toilet here?",
          "ko": "여기 화장실 어디예요?"
        }
      },
      {
        "text": "Извините, где здесь метро?",
        "slot": "метро",
        "cue": {
          "en": "the metro",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Excuse me, where is the metro around here?",
          "ko": "실례지만, 여기 지하철역 어디예요?"
        }
      },
      {
        "text": "Где здесь аптека?",
        "slot": "аптека",
        "cue": {
          "en": "a pharmacy",
          "ko": "약국"
        },
        "gloss": {
          "en": "Where is a pharmacy around here?",
          "ko": "이 근처에 약국 어디 있어요?"
        }
      },
      {
        "text": "Скажите, где здесь банкомат?",
        "slot": "банкомат",
        "cue": {
          "en": "an ATM",
          "ko": "현금인출기"
        },
        "gloss": {
          "en": "Tell me, where is an ATM around here?",
          "ko": "저기요, 여기 현금인출기 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-06",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "Сколько стоит ___?",
    "core": [
      "Сколько стоит",
      "сколько стоит"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "Сколько стоит"
    ],
    "examples": [
      {
        "text": "Сколько стоит вода?",
        "slot": "вода",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "How much is the water?",
          "ko": "물 얼마예요?"
        }
      },
      {
        "text": "Сколько стоит этот хлеб?",
        "slot": "этот хлеб",
        "cue": {
          "en": "this bread",
          "ko": "이 빵"
        },
        "gloss": {
          "en": "How much is this bread?",
          "ko": "이 빵 얼마예요?"
        }
      },
      {
        "text": "Извините, сколько стоит кофе?",
        "slot": "кофе",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Excuse me, how much is the coffee?",
          "ko": "실례지만, 커피 얼마예요?"
        }
      },
      {
        "text": "Сколько стоит билет в музей?",
        "slot": "билет в музей",
        "cue": {
          "en": "a museum ticket",
          "ko": "박물관 표"
        },
        "gloss": {
          "en": "How much is a ticket to the museum?",
          "ko": "박물관 표 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-07",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "Можно ___, пожалуйста?",
    "core": [
      "Можно",
      "можно"
    ],
    "meaning": {
      "en": "Asking for something politely: Can I have ___, please?",
      "ko": "달라고 하기: ___ 주시겠어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "Пожалуйста"
    ],
    "examples": [
      {
        "text": "Можно воду без газа, пожалуйста?",
        "slot": "воду без газа",
        "cue": {
          "en": "still water",
          "ko": "탄산 없는 물"
        },
        "gloss": {
          "en": "Can I have still water, please?",
          "ko": "탄산 없는 물 주시겠어요?"
        }
      },
      {
        "text": "Можно меню, пожалуйста?",
        "slot": "меню",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "Can I have the menu, please?",
          "ko": "메뉴판 주시겠어요?"
        }
      },
      {
        "text": "Можно чай с лимоном?",
        "slot": "чай с лимоном",
        "cue": {
          "en": "tea with lemon",
          "ko": "레몬 넣은 차"
        },
        "gloss": {
          "en": "Can I have tea with lemon?",
          "ko": "레몬 넣은 차 주시겠어요?"
        }
      },
      {
        "text": "Можно ваш номер телефона?",
        "slot": "ваш номер телефона",
        "cue": {
          "en": "your phone number",
          "ko": "전화번호"
        },
        "gloss": {
          "en": "Can I have your phone number?",
          "ko": "전화번호 알려 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-08",
    "stage": 1,
    "fn": "have",
    "pattern": "У меня есть ___.",
    "core": [
      "У меня есть",
      "у меня есть"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___ 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "У меня есть брат и сестра.",
        "slot": "брат и сестра",
        "cue": {
          "en": "a brother and a sister",
          "ko": "형제와 자매"
        },
        "gloss": {
          "en": "I have a brother and a sister.",
          "ko": "저는 형제 하나, 자매 하나가 있어요."
        }
      },
      {
        "text": "У меня есть собака.",
        "slot": "собака",
        "cue": {
          "en": "a dog",
          "ko": "개"
        },
        "gloss": {
          "en": "I have a dog.",
          "ko": "저는 개가 있어요."
        }
      },
      {
        "text": "Да, у меня есть билет.",
        "slot": "билет",
        "cue": {
          "en": "a ticket",
          "ko": "표"
        },
        "gloss": {
          "en": "Yes, I have a ticket.",
          "ko": "네, 표 있어요."
        }
      },
      {
        "text": "У меня есть вопрос.",
        "slot": "вопрос",
        "cue": {
          "en": "a question",
          "ko": "질문"
        },
        "gloss": {
          "en": "I have a question.",
          "ko": "질문이 있어요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-09",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "У вас есть ___?",
    "core": [
      "У вас есть",
      "у вас есть"
    ],
    "meaning": {
      "en": "Asking if they have something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      5,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "У вас есть вода?",
        "slot": "вода",
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
        "text": "Извините, у вас есть карта метро?",
        "slot": "карта метро",
        "cue": {
          "en": "a metro map",
          "ko": "지하철 노선도"
        },
        "gloss": {
          "en": "Excuse me, do you have a metro map?",
          "ko": "실례지만, 지하철 노선도 있어요?"
        }
      },
      {
        "text": "У вас есть сок?",
        "slot": "сок",
        "cue": {
          "en": "juice",
          "ko": "주스"
        },
        "gloss": {
          "en": "Do you have juice?",
          "ko": "주스 있어요?"
        }
      },
      {
        "text": "У вас есть свободный столик?",
        "slot": "свободный столик",
        "cue": {
          "en": "a free table",
          "ko": "빈 테이블"
        },
        "gloss": {
          "en": "Do you have a free table?",
          "ko": "빈 테이블 있어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-10",
    "stage": 1,
    "fn": "possession",
    "pattern": "Это мой / моя / моё ___.",
    "core": [
      "Это мой",
      "это мой",
      "Это моя",
      "это моя",
      "Это моё",
      "это моё"
    ],
    "meaning": {
      "en": "Saying what's yours (with gender): This is my ___.",
      "ko": "내 것 말하기(성별에 맞춰): 이건 제 ___예요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Это мой телефон.",
        "slot": "телефон",
        "cue": {
          "en": "phone (masculine)",
          "ko": "휴대폰(남성)"
        },
        "gloss": {
          "en": "This is my phone.",
          "ko": "이건 제 휴대폰이에요."
        }
      },
      {
        "text": "Это моя сумка.",
        "slot": "сумка",
        "cue": {
          "en": "bag (feminine)",
          "ko": "가방(여성)"
        },
        "gloss": {
          "en": "This is my bag.",
          "ko": "이건 제 가방이에요."
        }
      },
      {
        "text": "Извините, это моё место.",
        "slot": "место",
        "cue": {
          "en": "seat (neuter)",
          "ko": "자리(중성)"
        },
        "gloss": {
          "en": "Excuse me, this is my seat.",
          "ko": "실례지만, 여기 제 자리예요."
        }
      },
      {
        "text": "Это моя мама, а это мой папа.",
        "slot": "мама",
        "cue": {
          "en": "mom (feminine)",
          "ko": "엄마(여성)"
        },
        "gloss": {
          "en": "This is my mom, and this is my dad.",
          "ko": "이쪽은 우리 엄마, 이쪽은 우리 아빠예요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-11",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "Что такое ___?",
    "core": [
      "Что такое",
      "что такое"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___가 뭐예요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Что такое квас?",
        "slot": "квас",
        "cue": {
          "en": "kvass",
          "ko": "크바스"
        },
        "gloss": {
          "en": "What is kvass?",
          "ko": "크바스가 뭐예요?"
        }
      },
      {
        "text": "Извините, что такое пельмени?",
        "slot": "пельмени",
        "cue": {
          "en": "pelmeni",
          "ko": "펠메니"
        },
        "gloss": {
          "en": "Excuse me, what are pelmeni?",
          "ko": "실례지만, 펠메니가 뭐예요?"
        }
      },
      {
        "text": "Что такое дача?",
        "slot": "дача",
        "cue": {
          "en": "a dacha",
          "ko": "다차"
        },
        "gloss": {
          "en": "What is a dacha?",
          "ko": "다차가 뭐예요?"
        }
      },
      {
        "text": "А что такое сырники?",
        "slot": "сырники",
        "cue": {
          "en": "syrniki",
          "ko": "시르니키"
        },
        "gloss": {
          "en": "And what are syrniki?",
          "ko": "그럼 시르니키는 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-12",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Я изучаю ___.",
    "core": [
      "Я изучаю",
      "я изучаю"
    ],
    "meaning": {
      "en": "Saying what you study: I study ___.",
      "ko": "공부하는 것 말하기: 저는 ___를 공부해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я изучаю русский язык.",
        "slot": "русский язык",
        "cue": {
          "en": "Russian",
          "ko": "러시아어"
        },
        "gloss": {
          "en": "I study Russian.",
          "ko": "저는 러시아어를 공부해요."
        }
      },
      {
        "text": "Я изучаю историю.",
        "slot": "историю",
        "cue": {
          "en": "history",
          "ko": "역사"
        },
        "gloss": {
          "en": "I study history.",
          "ko": "저는 역사를 공부해요."
        }
      },
      {
        "text": "Сейчас я изучаю музыку.",
        "slot": "музыку",
        "cue": {
          "en": "music",
          "ko": "음악"
        },
        "gloss": {
          "en": "Right now I study music.",
          "ko": "지금은 음악을 공부해요."
        }
      },
      {
        "text": "Я изучаю экономику, а ты?",
        "slot": "экономику",
        "cue": {
          "en": "economics",
          "ko": "경제학"
        },
        "gloss": {
          "en": "I study economics, and you?",
          "ko": "나는 경제학 공부해, 너는?"
        }
      }
    ]
  },
  {
    "id": "ru-f1-13",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "Я не понимаю ___.",
    "core": [
      "Я не понимаю",
      "я не понимаю"
    ],
    "meaning": {
      "en": "Saying you don't understand: I don't understand ___.",
      "ko": "모르겠다고 말하기: ___ 이해가 안 돼요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "Я не понимаю",
      "Извините"
    ],
    "examples": [
      {
        "text": "Извините, я не понимаю это слово.",
        "slot": "это слово",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "Sorry, I don't understand this word.",
          "ko": "죄송해요, 이 단어를 모르겠어요."
        }
      },
      {
        "text": "Я не понимаю вопрос.",
        "slot": "вопрос",
        "cue": {
          "en": "the question",
          "ko": "질문"
        },
        "gloss": {
          "en": "I don't understand the question.",
          "ko": "질문을 이해 못 했어요."
        }
      },
      {
        "text": "Я не понимаю, где метро.",
        "slot": "где метро",
        "cue": {
          "en": "where the metro is",
          "ko": "지하철역이 어딘지"
        },
        "gloss": {
          "en": "I don't understand where the metro is.",
          "ko": "지하철역이 어딘지 모르겠어요."
        }
      },
      {
        "text": "Простите, я не понимаю меню.",
        "slot": "меню",
        "cue": {
          "en": "the menu",
          "ko": "메뉴"
        },
        "gloss": {
          "en": "Sorry, I don't understand the menu.",
          "ko": "죄송해요, 메뉴를 잘 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-14",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "Говорите ___, пожалуйста.",
    "core": [
      "Говорите",
      "говорите"
    ],
    "meaning": {
      "en": "Asking someone to speak differently: Please speak ___.",
      "ko": "말하는 방식 부탁하기: ___ 말해 주세요."
    },
    "grammar": [],
    "expressions": [
      "Говорите медленнее",
      "Пожалуйста"
    ],
    "examples": [
      {
        "text": "Говорите медленнее, пожалуйста.",
        "slot": "медленнее",
        "cue": {
          "en": "more slowly",
          "ko": "더 천천히"
        },
        "gloss": {
          "en": "Please speak more slowly.",
          "ko": "더 천천히 말해 주세요."
        }
      },
      {
        "text": "Говорите громче, пожалуйста.",
        "slot": "громче",
        "cue": {
          "en": "louder",
          "ko": "더 크게"
        },
        "gloss": {
          "en": "Please speak louder.",
          "ko": "더 크게 말해 주세요."
        }
      },
      {
        "text": "Извините, говорите тише, пожалуйста.",
        "slot": "тише",
        "cue": {
          "en": "more quietly",
          "ko": "더 조용히"
        },
        "gloss": {
          "en": "Sorry, please speak more quietly.",
          "ko": "죄송한데, 좀 조용히 말해 주세요."
        }
      },
      {
        "text": "Говорите по-английски, пожалуйста.",
        "slot": "по-английски",
        "cue": {
          "en": "in English",
          "ko": "영어로"
        },
        "gloss": {
          "en": "Please speak in English.",
          "ko": "영어로 말해 주세요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-15",
    "stage": 1,
    "fn": "thank",
    "pattern": "Спасибо за ___.",
    "core": [
      "Спасибо за",
      "спасибо за"
    ],
    "meaning": {
      "en": "Thanking for something: Thank you for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [],
    "expressions": [
      "Спасибо"
    ],
    "examples": [
      {
        "text": "Спасибо за помощь.",
        "slot": "помощь",
        "cue": {
          "en": "the help",
          "ko": "도움"
        },
        "gloss": {
          "en": "Thank you for the help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "Спасибо за всё!",
        "slot": "всё",
        "cue": {
          "en": "everything",
          "ko": "모든 것"
        },
        "gloss": {
          "en": "Thank you for everything!",
          "ko": "다 고마워요!"
        }
      },
      {
        "text": "Спасибо за ужин, очень вкусно.",
        "slot": "ужин",
        "cue": {
          "en": "dinner",
          "ko": "저녁 식사"
        },
        "gloss": {
          "en": "Thank you for dinner, it's very tasty.",
          "ko": "저녁 고마워요, 정말 맛있어요."
        }
      },
      {
        "text": "Большое спасибо за кофе.",
        "slot": "кофе",
        "cue": {
          "en": "the coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Thank you very much for the coffee.",
          "ko": "커피 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "ru-f1-16",
    "stage": 1,
    "fn": "greet",
    "pattern": "Привет, ___! / Здравствуйте, ___!",
    "core": [
      "Привет",
      "Здравствуйте"
    ],
    "meaning": {
      "en": "Greeting someone by name: Hi, ___! / Hello, ___!",
      "ko": "이름 불러 인사하기: 안녕, ___! / 안녕하세요, ___!"
    },
    "grammar": [],
    "expressions": [
      "Привет",
      "Здравствуйте"
    ],
    "examples": [
      {
        "text": "Привет, Аня!",
        "slot": "Аня",
        "cue": {
          "en": "Anya",
          "ko": "아냐"
        },
        "gloss": {
          "en": "Hi, Anya!",
          "ko": "안녕, 아냐!"
        }
      },
      {
        "text": "Здравствуйте, Ольга Ивановна!",
        "slot": "Ольга Ивановна",
        "cue": {
          "en": "Olga Ivanovna (polite)",
          "ko": "올가 이바노브나(존칭)"
        },
        "gloss": {
          "en": "Hello, Olga Ivanovna!",
          "ko": "안녕하세요, 올가 이바노브나!"
        }
      },
      {
        "text": "Привет, Максим! Это мой брат.",
        "slot": "Максим",
        "cue": {
          "en": "Maxim",
          "ko": "막심"
        },
        "gloss": {
          "en": "Hi, Maxim! This is my brother.",
          "ko": "안녕, 막심! 이쪽은 우리 형이야."
        }
      },
      {
        "text": "Здравствуйте, доктор!",
        "slot": "доктор",
        "cue": {
          "en": "doctor",
          "ko": "의사 선생님"
        },
        "gloss": {
          "en": "Hello, doctor!",
          "ko": "안녕하세요, 선생님!"
        }
      }
    ]
  },
  {
    "id": "ru-f1-17",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Где ___?",
    "core": [
      "Где",
      "где"
    ],
    "meaning": {
      "en": "Asking where something or someone is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디 있어요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Где мой паспорт?",
        "slot": "мой паспорт",
        "cue": {
          "en": "my passport",
          "ko": "내 여권"
        },
        "gloss": {
          "en": "Where is my passport?",
          "ko": "제 여권 어디 있어요?"
        }
      },
      {
        "text": "Извините, где касса?",
        "slot": "касса",
        "cue": {
          "en": "the cash desk",
          "ko": "계산대"
        },
        "gloss": {
          "en": "Excuse me, where is the cash desk?",
          "ko": "실례지만, 계산대가 어디예요?"
        }
      },
      {
        "text": "Где моя сумка?",
        "slot": "моя сумка",
        "cue": {
          "en": "my bag",
          "ko": "내 가방"
        },
        "gloss": {
          "en": "Where is my bag?",
          "ko": "제 가방 어디 있어요?"
        }
      },
      {
        "text": "А где Аня?",
        "slot": "Аня",
        "cue": {
          "en": "Anya",
          "ko": "아냐"
        },
        "gloss": {
          "en": "And where is Anya?",
          "ko": "그런데 아냐는 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Вчера я ___.",
    "core": [
      "Вчера я",
      "вчера я"
    ],
    "meaning": {
      "en": "Saying what you did yesterday: Yesterday I ___.",
      "ko": "어제 한 일 말하기: 어제 저는 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Вчера я был дома.",
        "slot": "был дома",
        "cue": {
          "en": "was at home",
          "ko": "집에 있었다"
        },
        "gloss": {
          "en": "Yesterday I was at home.",
          "ko": "어제 저는 집에 있었어요."
        }
      },
      {
        "text": "Вчера я работал до вечера.",
        "slot": "работал до вечера",
        "cue": {
          "en": "worked until evening",
          "ko": "저녁까지 일했다"
        },
        "gloss": {
          "en": "Yesterday I worked until the evening.",
          "ko": "어제는 저녁까지 일했어요."
        }
      },
      {
        "text": "Вчера я смотрел футбол с другом.",
        "slot": "смотрел футбол",
        "cue": {
          "en": "watched football",
          "ko": "축구를 봤다"
        },
        "gloss": {
          "en": "Yesterday I watched football with a friend.",
          "ko": "어제 친구랑 축구를 봤어요."
        }
      },
      {
        "text": "Вчера я ходила в кино.",
        "slot": "ходила в кино",
        "cue": {
          "en": "went to the cinema (woman speaking)",
          "ko": "영화 보러 갔다(여성이 말할 때)"
        },
        "gloss": {
          "en": "Yesterday I went to the cinema.",
          "ko": "어제 영화 보러 갔어요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Я ходил в ___.",
    "core": [
      "Я ходил",
      "я ходил",
      "Я ходила",
      "я ходила"
    ],
    "meaning": {
      "en": "Saying where you went (and came back): I went to ___.",
      "ko": "다녀온 곳 말하기: ___에 갔다 왔어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я ходил в музей.",
        "slot": "музей",
        "cue": {
          "en": "a museum",
          "ko": "박물관"
        },
        "gloss": {
          "en": "I went to a museum.",
          "ko": "박물관에 갔다 왔어요."
        }
      },
      {
        "text": "В субботу я ходил на концерт.",
        "slot": "концерт",
        "cue": {
          "en": "a concert",
          "ko": "콘서트"
        },
        "gloss": {
          "en": "On Saturday I went to a concert.",
          "ko": "토요일에 콘서트에 갔어요."
        }
      },
      {
        "text": "Я ходила в бассейн утром.",
        "slot": "бассейн",
        "cue": {
          "en": "the swimming pool (woman speaking)",
          "ko": "수영장(여성이 말할 때)"
        },
        "gloss": {
          "en": "I went to the pool in the morning.",
          "ko": "아침에 수영장에 갔다 왔어요."
        }
      },
      {
        "text": "Вчера я ходил в театр.",
        "slot": "театр",
        "cue": {
          "en": "the theatre",
          "ko": "극장"
        },
        "gloss": {
          "en": "Yesterday I went to the theatre.",
          "ko": "어제 극장에 갔어요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-03",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Завтра я буду ___.",
    "core": [
      "я буду",
      "Я буду"
    ],
    "meaning": {
      "en": "Saying what you will be doing: Tomorrow I will ___.",
      "ko": "할 일 말하기: 내일 저는 ___ 거예요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Завтра я буду работать дома.",
        "slot": "работать дома",
        "cue": {
          "en": "work from home",
          "ko": "집에서 일하다"
        },
        "gloss": {
          "en": "Tomorrow I'll be working from home.",
          "ko": "내일은 집에서 일할 거예요."
        }
      },
      {
        "text": "Вечером я буду учить русский.",
        "slot": "учить русский",
        "cue": {
          "en": "study Russian",
          "ko": "러시아어를 공부하다"
        },
        "gloss": {
          "en": "In the evening I'll be studying Russian.",
          "ko": "저녁에는 러시아어를 공부할 거예요."
        }
      },
      {
        "text": "В субботу я буду отдыхать.",
        "slot": "отдыхать",
        "cue": {
          "en": "rest",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "On Saturday I'll be resting.",
          "ko": "토요일에는 쉴 거예요."
        }
      },
      {
        "text": "Завтра я буду смотреть сериал весь день.",
        "slot": "смотреть сериал",
        "cue": {
          "en": "watch a series",
          "ko": "드라마를 보다"
        },
        "gloss": {
          "en": "Tomorrow I'll be watching a series all day.",
          "ko": "내일은 하루 종일 드라마 볼 거예요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-04",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Скажите, пожалуйста, ___?",
    "core": [
      "Скажите, пожалуйста",
      "скажите, пожалуйста"
    ],
    "meaning": {
      "en": "Politely asking for information: Could you tell me ___?",
      "ko": "정중하게 묻기: 말씀 좀 해 주세요, ___?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Скажите, пожалуйста, где остановка?",
        "slot": "где остановка",
        "cue": {
          "en": "where the bus stop is",
          "ko": "정류장이 어디인지"
        },
        "gloss": {
          "en": "Could you tell me where the bus stop is?",
          "ko": "실례지만, 정류장이 어디예요?"
        }
      },
      {
        "text": "Скажите, пожалуйста, сколько это стоит?",
        "slot": "сколько это стоит",
        "cue": {
          "en": "how much it costs",
          "ko": "얼마인지"
        },
        "gloss": {
          "en": "Could you tell me how much this costs?",
          "ko": "이거 얼마인지 말씀해 주시겠어요?"
        }
      },
      {
        "text": "Скажите, пожалуйста, как пройти к метро?",
        "slot": "как пройти к метро",
        "cue": {
          "en": "how to get to the metro",
          "ko": "지하철역 가는 길"
        },
        "gloss": {
          "en": "Could you tell me how to get to the metro?",
          "ko": "지하철역 어떻게 가는지 알려 주시겠어요?"
        }
      },
      {
        "text": "Скажите, пожалуйста, во сколько поезд?",
        "slot": "во сколько поезд",
        "cue": {
          "en": "what time the train is",
          "ko": "기차가 몇 시인지"
        },
        "gloss": {
          "en": "Could you tell me what time the train is?",
          "ko": "기차가 몇 시인지 알려 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-05",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Покажите, пожалуйста, ___.",
    "core": [
      "Покажите",
      "покажите"
    ],
    "meaning": {
      "en": "Asking someone to show you: Please show me ___.",
      "ko": "보여 달라고 하기: ___ 보여 주세요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Покажите, пожалуйста, на карте.",
        "slot": "на карте",
        "cue": {
          "en": "on the map",
          "ko": "지도에서"
        },
        "gloss": {
          "en": "Please show me on the map.",
          "ko": "지도에서 보여 주세요."
        }
      },
      {
        "text": "Покажите, пожалуйста, этот свитер.",
        "slot": "этот свитер",
        "cue": {
          "en": "this sweater",
          "ko": "이 스웨터"
        },
        "gloss": {
          "en": "Please show me this sweater.",
          "ko": "이 스웨터 좀 보여 주세요."
        }
      },
      {
        "text": "Покажите другой цвет, пожалуйста.",
        "slot": "другой цвет",
        "cue": {
          "en": "another colour",
          "ko": "다른 색"
        },
        "gloss": {
          "en": "Please show me another colour.",
          "ko": "다른 색 보여 주세요."
        }
      },
      {
        "text": "Покажите, пожалуйста, ваш паспорт.",
        "slot": "ваш паспорт",
        "cue": {
          "en": "your passport",
          "ko": "여권"
        },
        "gloss": {
          "en": "Please show your passport.",
          "ko": "여권 보여 주세요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-06",
    "stage": 2,
    "fn": "want",
    "pattern": "Я хочу ___.",
    "core": [
      "Я хочу",
      "я хочу"
    ],
    "meaning": {
      "en": "Saying what you want to do: I want to ___.",
      "ko": "하고 싶은 것 말하기: ___ 하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Летом я хочу поехать на море.",
        "slot": "поехать на море",
        "cue": {
          "en": "go to the seaside",
          "ko": "바다에 가다"
        },
        "gloss": {
          "en": "In summer I want to go to the seaside.",
          "ko": "여름에 바다에 가고 싶어요."
        }
      },
      {
        "text": "Я хочу посмотреть этот фильм.",
        "slot": "посмотреть этот фильм",
        "cue": {
          "en": "watch this film",
          "ko": "이 영화를 보다"
        },
        "gloss": {
          "en": "I want to watch this film.",
          "ko": "이 영화 보고 싶어요."
        }
      },
      {
        "text": "Я хочу выучить русский.",
        "slot": "выучить русский",
        "cue": {
          "en": "learn Russian",
          "ko": "러시아어를 배우다"
        },
        "gloss": {
          "en": "I want to learn Russian.",
          "ko": "러시아어를 배우고 싶어요."
        }
      },
      {
        "text": "Я хочу есть, давай пообедаем.",
        "slot": "есть",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I want to eat, let's have lunch.",
          "ko": "배고파, 점심 먹자."
        }
      }
    ]
  },
  {
    "id": "ru-f2-07",
    "stage": 2,
    "fn": "live-where",
    "pattern": "Я живу в ___.",
    "core": [
      "Я живу",
      "я живу"
    ],
    "meaning": {
      "en": "Saying where you live: I live in ___.",
      "ko": "사는 곳 말하기: 저는 ___에 살아요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я живу в Москве.",
        "slot": "Москве",
        "cue": {
          "en": "Moscow",
          "ko": "모스크바"
        },
        "gloss": {
          "en": "I live in Moscow.",
          "ko": "저는 모스크바에 살아요."
        }
      },
      {
        "text": "Я живу в центре, недалеко от работы.",
        "slot": "центре",
        "cue": {
          "en": "the centre",
          "ko": "시내"
        },
        "gloss": {
          "en": "I live in the centre, not far from work.",
          "ko": "시내에 살아요, 회사에서 멀지 않아요."
        }
      },
      {
        "text": "Сейчас я живу в общежитии.",
        "slot": "общежитии",
        "cue": {
          "en": "a dormitory",
          "ko": "기숙사"
        },
        "gloss": {
          "en": "Right now I live in a dorm.",
          "ko": "지금은 기숙사에 살아요."
        }
      },
      {
        "text": "Я живу на улице Пушкина.",
        "slot": "улице Пушкина",
        "cue": {
          "en": "Pushkin Street",
          "ko": "푸시킨 거리"
        },
        "gloss": {
          "en": "I live on Pushkin Street.",
          "ko": "푸시킨 거리에 살아요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-08",
    "stage": 2,
    "fn": "directions",
    "pattern": "Я иду ___.",
    "core": [
      "Я иду",
      "я иду"
    ],
    "meaning": {
      "en": "Saying where you're going (on foot): I'm going to ___.",
      "ko": "가는 곳 말하기(걸어서): ___에 가는 중이에요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я иду в магазин, тебе что-нибудь купить?",
        "slot": "в магазин",
        "cue": {
          "en": "to the shop",
          "ko": "가게에"
        },
        "gloss": {
          "en": "I'm going to the shop, should I buy you anything?",
          "ko": "가게 가는데, 뭐 사다 줄까?"
        }
      },
      {
        "text": "Я иду на работу.",
        "slot": "на работу",
        "cue": {
          "en": "to work",
          "ko": "회사에"
        },
        "gloss": {
          "en": "I'm going to work.",
          "ko": "회사 가는 중이에요."
        }
      },
      {
        "text": "Сейчас я иду в аптеку.",
        "slot": "в аптеку",
        "cue": {
          "en": "to the pharmacy",
          "ko": "약국에"
        },
        "gloss": {
          "en": "I'm going to the pharmacy now.",
          "ko": "지금 약국 가요."
        }
      },
      {
        "text": "Я иду в банк, подожди меня.",
        "slot": "в банк",
        "cue": {
          "en": "to the bank",
          "ko": "은행에"
        },
        "gloss": {
          "en": "I'm going to the bank, wait for me.",
          "ko": "은행 가는데, 기다려 줘."
        }
      }
    ]
  },
  {
    "id": "ru-f2-09",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Я еду ___.",
    "core": [
      "Я еду",
      "я еду"
    ],
    "meaning": {
      "en": "Saying where you're travelling (by transport): I'm going to ___.",
      "ko": "타고 가는 곳 말하기: ___에 가요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Завтра я еду в Петербург.",
        "slot": "в Петербург",
        "cue": {
          "en": "to St Petersburg",
          "ko": "상트페테르부르크에"
        },
        "gloss": {
          "en": "Tomorrow I'm going to St Petersburg.",
          "ko": "내일 상트페테르부르크에 가요."
        }
      },
      {
        "text": "В субботу я еду на дачу.",
        "slot": "на дачу",
        "cue": {
          "en": "to the dacha",
          "ko": "다차에"
        },
        "gloss": {
          "en": "On Saturday I'm going to the dacha.",
          "ko": "토요일에 다차에 가요."
        }
      },
      {
        "text": "Я еду в аэропорт на такси.",
        "slot": "в аэропорт",
        "cue": {
          "en": "to the airport",
          "ko": "공항에"
        },
        "gloss": {
          "en": "I'm going to the airport by taxi.",
          "ko": "택시 타고 공항에 가요."
        }
      },
      {
        "text": "Летом я еду в Сочи.",
        "slot": "в Сочи",
        "cue": {
          "en": "to Sochi",
          "ko": "소치에"
        },
        "gloss": {
          "en": "In summer I'm going to Sochi.",
          "ko": "여름에 소치에 가요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-10",
    "stage": 2,
    "fn": "invite",
    "pattern": "Давай ___!",
    "core": [
      "Давай",
      "давай",
      "Давайте",
      "давайте"
    ],
    "meaning": {
      "en": "Suggesting doing something together: Let's ___!",
      "ko": "같이 하자고 하기: ___ 하자!"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "Давай"
    ],
    "examples": [
      {
        "text": "Давай пойдём в парк!",
        "slot": "пойдём в парк",
        "cue": {
          "en": "go to the park",
          "ko": "공원에 가다"
        },
        "gloss": {
          "en": "Let's go to the park!",
          "ko": "공원 가자!"
        }
      },
      {
        "text": "Давай встретимся в шесть.",
        "slot": "встретимся в шесть",
        "cue": {
          "en": "meet at six",
          "ko": "여섯 시에 만나다"
        },
        "gloss": {
          "en": "Let's meet at six.",
          "ko": "여섯 시에 만나자."
        }
      },
      {
        "text": "Давай посмотрим фильм вечером.",
        "slot": "посмотрим фильм",
        "cue": {
          "en": "watch a film",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "Let's watch a film this evening.",
          "ko": "저녁에 영화 보자."
        }
      },
      {
        "text": "Давайте закажем пиццу!",
        "slot": "закажем пиццу",
        "cue": {
          "en": "order pizza",
          "ko": "피자를 시키다"
        },
        "gloss": {
          "en": "Let's order pizza!",
          "ko": "피자 시켜요!"
        }
      }
    ]
  },
  {
    "id": "ru-f2-11",
    "stage": 2,
    "fn": "reason",
    "pattern": "…, потому что ___.",
    "core": [
      "потому что"
    ],
    "meaning": {
      "en": "Giving a reason: …, because ___.",
      "ko": "이유 말하기: ___ 때문에요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я не пришёл, потому что был занят.",
        "slot": "был занят",
        "cue": {
          "en": "was busy",
          "ko": "바빴다"
        },
        "gloss": {
          "en": "I didn't come because I was busy.",
          "ko": "바빠서 못 왔어요."
        }
      },
      {
        "text": "Я опоздал, потому что заблудился.",
        "slot": "заблудился",
        "cue": {
          "en": "got lost",
          "ko": "길을 잃었다"
        },
        "gloss": {
          "en": "I was late because I got lost.",
          "ko": "길을 잃어서 늦었어요."
        }
      },
      {
        "text": "Я учу русский, потому что люблю Москву.",
        "slot": "люблю Москву",
        "cue": {
          "en": "love Moscow",
          "ko": "모스크바를 좋아하다"
        },
        "gloss": {
          "en": "I'm learning Russian because I love Moscow.",
          "ko": "모스크바를 좋아해서 러시아어를 배워요."
        }
      },
      {
        "text": "Я сегодня дома, потому что у меня болит голова.",
        "slot": "у меня болит голова",
        "cue": {
          "en": "I have a headache",
          "ko": "머리가 아프다"
        },
        "gloss": {
          "en": "I'm at home today because I have a headache.",
          "ko": "머리가 아파서 오늘은 집에 있어요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-12",
    "stage": 2,
    "fn": "time-when",
    "pattern": "Во сколько ___?",
    "core": [
      "Во сколько",
      "во сколько"
    ],
    "meaning": {
      "en": "Asking what time: What time ___?",
      "ko": "몇 시인지 묻기: ___ 몇 시예요?"
    },
    "grammar": [],
    "expressions": [
      "Во сколько"
    ],
    "examples": [
      {
        "text": "Во сколько начинается фильм?",
        "slot": "начинается фильм",
        "cue": {
          "en": "the film starts",
          "ko": "영화가 시작하다"
        },
        "gloss": {
          "en": "What time does the film start?",
          "ko": "영화 몇 시에 시작해요?"
        }
      },
      {
        "text": "Во сколько встретимся?",
        "slot": "встретимся",
        "cue": {
          "en": "we meet",
          "ko": "우리가 만나다"
        },
        "gloss": {
          "en": "What time shall we meet?",
          "ko": "몇 시에 만날까?"
        }
      },
      {
        "text": "Во сколько ты заканчиваешь работу?",
        "slot": "ты заканчиваешь работу",
        "cue": {
          "en": "you finish work",
          "ko": "일이 끝나다"
        },
        "gloss": {
          "en": "What time do you finish work?",
          "ko": "너 몇 시에 일 끝나?"
        }
      },
      {
        "text": "Скажите, во сколько закрывается магазин?",
        "slot": "закрывается магазин",
        "cue": {
          "en": "the shop closes",
          "ko": "가게가 닫다"
        },
        "gloss": {
          "en": "Tell me, what time does the shop close?",
          "ko": "가게 몇 시에 닫아요?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-13",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Встретимся ___?",
    "core": [
      "Встретимся",
      "встретимся"
    ],
    "meaning": {
      "en": "Suggesting where or when to meet: Shall we meet ___?",
      "ko": "만날 곳·시간 정하기: ___에서 만날까?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "Где встретимся"
    ],
    "examples": [
      {
        "text": "Встретимся у метро?",
        "slot": "у метро",
        "cue": {
          "en": "by the metro",
          "ko": "지하철역 앞"
        },
        "gloss": {
          "en": "Shall we meet by the metro?",
          "ko": "지하철역 앞에서 만날까?"
        }
      },
      {
        "text": "Встретимся в центре?",
        "slot": "в центре",
        "cue": {
          "en": "in the centre",
          "ko": "시내"
        },
        "gloss": {
          "en": "Shall we meet in the centre?",
          "ko": "시내에서 만날까?"
        }
      },
      {
        "text": "Где встретимся? Может, на площади?",
        "slot": "на площади",
        "cue": {
          "en": "on the square",
          "ko": "광장"
        },
        "gloss": {
          "en": "Where shall we meet? Maybe on the square?",
          "ko": "어디서 만날까? 광장 어때?"
        }
      },
      {
        "text": "Встретимся в кафе на углу?",
        "slot": "в кафе на углу",
        "cue": {
          "en": "at the café on the corner",
          "ko": "모퉁이 카페"
        },
        "gloss": {
          "en": "Shall we meet at the café on the corner?",
          "ko": "모퉁이 카페에서 만날까?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-14",
    "stage": 2,
    "fn": "symptom",
    "pattern": "У меня болит ___.",
    "core": [
      "У меня болит",
      "у меня болит"
    ],
    "meaning": {
      "en": "Saying what hurts: My ___ hurts.",
      "ko": "아픈 곳 말하기: ___가 아파요."
    },
    "grammar": [],
    "expressions": [
      "У меня болит голова"
    ],
    "examples": [
      {
        "text": "У меня болит голова.",
        "slot": "голова",
        "cue": {
          "en": "head",
          "ko": "머리"
        },
        "gloss": {
          "en": "I have a headache.",
          "ko": "머리가 아파요."
        }
      },
      {
        "text": "У меня болит горло.",
        "slot": "горло",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "I have a sore throat.",
          "ko": "목이 아파요."
        }
      },
      {
        "text": "С утра у меня болит живот.",
        "slot": "живот",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "My stomach has hurt since the morning.",
          "ko": "아침부터 배가 아파요."
        }
      },
      {
        "text": "У меня болит спина, я не пойду.",
        "slot": "спина",
        "cue": {
          "en": "back",
          "ko": "허리"
        },
        "gloss": {
          "en": "My back hurts, I won't go.",
          "ko": "허리가 아파서 안 갈래."
        }
      }
    ]
  },
  {
    "id": "ru-f2-15",
    "stage": 2,
    "fn": "permission",
    "pattern": "Можно сфотографировать ___?",
    "core": [
      "Можно сфотографировать",
      "можно сфотографировать"
    ],
    "meaning": {
      "en": "Asking if you may take a photo: May I take a photo of ___?",
      "ko": "사진 찍어도 되는지 묻기: ___ 찍어도 돼요?"
    },
    "grammar": [],
    "expressions": [
      "Можно сфотографировать"
    ],
    "examples": [
      {
        "text": "Можно сфотографировать меню?",
        "slot": "меню",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "May I take a photo of the menu?",
          "ko": "메뉴판 찍어도 돼요?"
        }
      },
      {
        "text": "Извините, можно сфотографировать вас?",
        "slot": "вас",
        "cue": {
          "en": "you",
          "ko": "당신"
        },
        "gloss": {
          "en": "Excuse me, may I take your photo?",
          "ko": "실례지만, 사진 찍어도 될까요?"
        }
      },
      {
        "text": "Можно сфотографировать эту картину?",
        "slot": "эту картину",
        "cue": {
          "en": "this painting",
          "ko": "이 그림"
        },
        "gloss": {
          "en": "May I photograph this painting?",
          "ko": "이 그림 찍어도 돼요?"
        }
      },
      {
        "text": "Можно сфотографировать здесь?",
        "slot": "здесь",
        "cue": {
          "en": "here",
          "ko": "여기서"
        },
        "gloss": {
          "en": "Is it OK to take photos here?",
          "ko": "여기서 사진 찍어도 돼요?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-16",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "Что посоветуете ___?",
    "core": [
      "Что посоветуете",
      "что посоветуете"
    ],
    "meaning": {
      "en": "Asking for a recommendation: What do you recommend ___?",
      "ko": "추천 부탁하기: ___ 뭐가 좋을까요?"
    },
    "grammar": [],
    "expressions": [
      "Что посоветуете"
    ],
    "examples": [
      {
        "text": "Что посоветуете на обед?",
        "slot": "на обед",
        "cue": {
          "en": "for lunch",
          "ko": "점심으로"
        },
        "gloss": {
          "en": "What do you recommend for lunch?",
          "ko": "점심으로 뭐가 좋을까요?"
        }
      },
      {
        "text": "Что посоветуете от кашля?",
        "slot": "от кашля",
        "cue": {
          "en": "for a cough",
          "ko": "기침에"
        },
        "gloss": {
          "en": "What do you recommend for a cough?",
          "ko": "기침에는 뭐가 좋아요?"
        }
      },
      {
        "text": "Что посоветуете посмотреть в городе?",
        "slot": "посмотреть в городе",
        "cue": {
          "en": "to see in the city",
          "ko": "도시에서 볼 것"
        },
        "gloss": {
          "en": "What do you recommend seeing in the city?",
          "ko": "이 도시에서 뭘 보면 좋을까요?"
        }
      },
      {
        "text": "А что посоветуете на десерт?",
        "slot": "на десерт",
        "cue": {
          "en": "for dessert",
          "ko": "디저트로"
        },
        "gloss": {
          "en": "And what do you recommend for dessert?",
          "ko": "디저트는 뭐가 좋을까요?"
        }
      }
    ]
  },
  {
    "id": "ru-f2-17",
    "stage": 2,
    "fn": "order",
    "pattern": "Мне, пожалуйста, ___.",
    "core": [
      "Мне, пожалуйста",
      "мне, пожалуйста"
    ],
    "meaning": {
      "en": "Ordering: I'll have ___, please.",
      "ko": "주문하기: 저는 ___ 주세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Мне, пожалуйста, борщ.",
        "slot": "борщ",
        "cue": {
          "en": "borscht",
          "ko": "보르시"
        },
        "gloss": {
          "en": "I'll have borscht, please.",
          "ko": "저는 보르시 주세요."
        }
      },
      {
        "text": "Мне, пожалуйста, салат и компот.",
        "slot": "салат и компот",
        "cue": {
          "en": "a salad and kompot",
          "ko": "샐러드와 콤포트"
        },
        "gloss": {
          "en": "I'll have a salad and kompot, please.",
          "ko": "샐러드랑 콤포트 주세요."
        }
      },
      {
        "text": "Мне, пожалуйста, чай с лимоном.",
        "slot": "чай с лимоном",
        "cue": {
          "en": "tea with lemon",
          "ko": "레몬차"
        },
        "gloss": {
          "en": "I'll have tea with lemon, please.",
          "ko": "레몬차 주세요."
        }
      },
      {
        "text": "А мне, пожалуйста, котлету с пюре.",
        "slot": "котлету с пюре",
        "cue": {
          "en": "a cutlet with mash",
          "ko": "커틀릿과 으깬 감자"
        },
        "gloss": {
          "en": "And I'll have a cutlet with mash, please.",
          "ko": "저는 커틀릿이랑 으깬 감자 주세요."
        }
      }
    ]
  },
  {
    "id": "ru-f2-18",
    "stage": 2,
    "fn": "lost-problem",
    "pattern": "Я потерял ___.",
    "core": [
      "Я потерял",
      "я потерял",
      "Я потеряла",
      "я потеряла"
    ],
    "meaning": {
      "en": "Reporting something lost: I lost ___.",
      "ko": "잃어버린 것 알리기: ___ 잃어버렸어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я потерял телефон.",
        "slot": "телефон",
        "cue": {
          "en": "my phone",
          "ko": "휴대폰"
        },
        "gloss": {
          "en": "I lost my phone.",
          "ko": "휴대폰을 잃어버렸어요."
        }
      },
      {
        "text": "Кажется, я потерял ключи.",
        "slot": "ключи",
        "cue": {
          "en": "my keys",
          "ko": "열쇠"
        },
        "gloss": {
          "en": "I think I lost my keys.",
          "ko": "열쇠를 잃어버린 것 같아요."
        }
      },
      {
        "text": "Помогите, я потеряла паспорт!",
        "slot": "паспорт",
        "cue": {
          "en": "my passport (woman speaking)",
          "ko": "여권(여성이 말할 때)"
        },
        "gloss": {
          "en": "Help, I've lost my passport!",
          "ko": "도와주세요, 여권을 잃어버렸어요!"
        }
      },
      {
        "text": "Я потерял кошелёк в автобусе.",
        "slot": "кошелёк",
        "cue": {
          "en": "my wallet",
          "ko": "지갑"
        },
        "gloss": {
          "en": "I lost my wallet on the bus.",
          "ko": "버스에서 지갑을 잃어버렸어요."
        }
      }
    ]
  },
  {
    "id": "ru-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Мне кажется, ___.",
    "core": [
      "Мне кажется",
      "мне кажется"
    ],
    "meaning": {
      "en": "Giving an impression: It seems to me ___.",
      "ko": "내 느낌 말하기: 내 생각엔 ___ 같아."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "Мне кажется"
    ],
    "examples": [
      {
        "text": "Мне кажется, этот сериал слишком длинный.",
        "slot": "этот сериал слишком длинный",
        "cue": {
          "en": "the series is too long",
          "ko": "드라마가 너무 길다"
        },
        "gloss": {
          "en": "It seems to me this series is too long.",
          "ko": "이 드라마 너무 긴 것 같아."
        }
      },
      {
        "text": "Мне кажется, он уже ушёл.",
        "slot": "он уже ушёл",
        "cue": {
          "en": "he has already left",
          "ko": "그가 벌써 갔다"
        },
        "gloss": {
          "en": "I think he's already left.",
          "ko": "그 사람 벌써 간 것 같아."
        }
      },
      {
        "text": "Мне кажется, вентилятор не поможет.",
        "slot": "вентилятор не поможет",
        "cue": {
          "en": "a fan won't help",
          "ko": "선풍기로는 안 된다"
        },
        "gloss": {
          "en": "I don't think a fan will help.",
          "ko": "선풍기로는 안 될 것 같아요."
        }
      },
      {
        "text": "Мне кажется, ты прав.",
        "slot": "ты прав",
        "cue": {
          "en": "you're right",
          "ko": "네 말이 맞다"
        },
        "gloss": {
          "en": "I think you're right.",
          "ko": "네 말이 맞는 것 같아."
        }
      }
    ]
  },
  {
    "id": "ru-f3-02",
    "stage": 3,
    "fn": "opinion",
    "pattern": "По-моему, ___.",
    "core": [
      "По-моему",
      "по-моему"
    ],
    "meaning": {
      "en": "Saying what you think: In my opinion, ___.",
      "ko": "내 의견 말하기: 내 생각엔 ___."
    },
    "grammar": [],
    "expressions": [
      "По-моему"
    ],
    "examples": [
      {
        "text": "По-моему, первый сезон был лучше.",
        "slot": "первый сезон был лучше",
        "cue": {
          "en": "the first season was better",
          "ko": "첫 시즌이 더 나았다"
        },
        "gloss": {
          "en": "In my opinion, the first season was better.",
          "ko": "내 생각엔 첫 시즌이 더 나았어."
        }
      },
      {
        "text": "По-моему, это отличная идея.",
        "slot": "это отличная идея",
        "cue": {
          "en": "it's a great idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "I think it's a great idea.",
          "ko": "내 생각엔 좋은 생각이야."
        }
      },
      {
        "text": "По-моему, нам надо уходить.",
        "slot": "нам надо уходить",
        "cue": {
          "en": "we have to leave",
          "ko": "우리 가야 한다"
        },
        "gloss": {
          "en": "I think we need to go.",
          "ko": "내 생각엔 우리 가야 할 것 같아."
        }
      },
      {
        "text": "По-моему, он немного опаздывает.",
        "slot": "он немного опаздывает",
        "cue": {
          "en": "he's running a bit late",
          "ko": "그가 좀 늦는다"
        },
        "gloss": {
          "en": "I think he's running a bit late.",
          "ko": "그 사람 좀 늦는 것 같아."
        }
      }
    ]
  },
  {
    "id": "ru-f3-03",
    "stage": 3,
    "fn": "like",
    "pattern": "Мне нравится ___.",
    "core": [
      "Мне нравится",
      "мне нравится",
      "Мне нравятся",
      "мне нравятся"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: ___가 좋아."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Мне нравится этот сериал.",
        "slot": "этот сериал",
        "cue": {
          "en": "this series",
          "ko": "이 드라마"
        },
        "gloss": {
          "en": "I like this series.",
          "ko": "이 드라마 좋아."
        }
      },
      {
        "text": "Мне нравится твоя идея.",
        "slot": "твоя идея",
        "cue": {
          "en": "your idea",
          "ko": "네 생각"
        },
        "gloss": {
          "en": "I like your idea.",
          "ko": "네 생각 좋다."
        }
      },
      {
        "text": "Мне нравится гулять по вечерам.",
        "slot": "гулять по вечерам",
        "cue": {
          "en": "walking in the evenings",
          "ko": "저녁에 산책하기"
        },
        "gloss": {
          "en": "I like going for walks in the evening.",
          "ko": "저녁에 산책하는 걸 좋아해."
        }
      },
      {
        "text": "Мне нравятся такие фильмы.",
        "slot": "такие фильмы",
        "cue": {
          "en": "films like this",
          "ko": "이런 영화들"
        },
        "gloss": {
          "en": "I like films like that.",
          "ko": "이런 영화 좋아해."
        }
      }
    ]
  },
  {
    "id": "ru-f3-04",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "Как тебе ___?",
    "core": [
      "Как тебе",
      "как тебе"
    ],
    "meaning": {
      "en": "Asking what someone thinks: How do you like ___?",
      "ko": "상대 생각 묻기: ___ 어때?"
    },
    "grammar": [],
    "expressions": [
      "Как тебе"
    ],
    "examples": [
      {
        "text": "Как тебе этот сериал?",
        "slot": "этот сериал",
        "cue": {
          "en": "this series",
          "ko": "이 드라마"
        },
        "gloss": {
          "en": "How do you like this series?",
          "ko": "이 드라마 어때?"
        }
      },
      {
        "text": "Как тебе новый офис?",
        "slot": "новый офис",
        "cue": {
          "en": "the new office",
          "ko": "새 사무실"
        },
        "gloss": {
          "en": "How do you like the new office?",
          "ko": "새 사무실 어때?"
        }
      },
      {
        "text": "Ну, как тебе мой план?",
        "slot": "мой план",
        "cue": {
          "en": "my plan",
          "ko": "내 계획"
        },
        "gloss": {
          "en": "So, what do you think of my plan?",
          "ko": "그래서, 내 계획 어때?"
        }
      },
      {
        "text": "Как тебе вчерашний фильм?",
        "slot": "вчерашний фильм",
        "cue": {
          "en": "yesterday's film",
          "ko": "어제 본 영화"
        },
        "gloss": {
          "en": "How did you like yesterday's film?",
          "ko": "어제 영화 어땠어?"
        }
      }
    ]
  },
  {
    "id": "ru-f3-05",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Вы не могли бы ___?",
    "core": [
      "Вы не могли бы",
      "вы не могли бы"
    ],
    "meaning": {
      "en": "A very polite request: Could you possibly ___?",
      "ko": "더 공손하게 부탁하기: ___ 해 주실 수 있을까요?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "Вы не могли бы"
    ],
    "examples": [
      {
        "text": "Вы не могли бы прислать мастера?",
        "slot": "прислать мастера",
        "cue": {
          "en": "send a repairman",
          "ko": "수리 기사를 보내다"
        },
        "gloss": {
          "en": "Could you send a repairman?",
          "ko": "수리 기사를 보내 주실 수 있을까요?"
        }
      },
      {
        "text": "Вы не могли бы мне помочь с отчётом?",
        "slot": "помочь с отчётом",
        "cue": {
          "en": "help with the report",
          "ko": "보고서를 도와주다"
        },
        "gloss": {
          "en": "Could you help me with the report?",
          "ko": "보고서 좀 도와주실 수 있을까요?"
        }
      },
      {
        "text": "Вы не могли бы говорить чуть медленнее?",
        "slot": "говорить чуть медленнее",
        "cue": {
          "en": "speak a little slower",
          "ko": "조금 천천히 말하다"
        },
        "gloss": {
          "en": "Could you speak a little more slowly?",
          "ko": "조금만 천천히 말씀해 주실 수 있을까요?"
        }
      },
      {
        "text": "Извините, вы не могли бы подвинуться?",
        "slot": "подвинуться",
        "cue": {
          "en": "move over a bit",
          "ko": "조금 비켜 주다"
        },
        "gloss": {
          "en": "Excuse me, could you move over a bit?",
          "ko": "죄송한데, 조금만 비켜 주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "ru-f3-06",
    "stage": 3,
    "fn": "wish",
    "pattern": "Если бы ___, я бы…",
    "core": [
      "Если бы",
      "если бы"
    ],
    "meaning": {
      "en": "Imagining a different situation: If ___, I would…",
      "ko": "가정하기: ___라면 …할 텐데."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Если бы у меня было время, я бы поехал с вами.",
        "slot": "у меня было время",
        "cue": {
          "en": "I had time",
          "ko": "시간이 있다"
        },
        "gloss": {
          "en": "If I had time, I'd go with you.",
          "ko": "시간이 있으면 같이 갈 텐데."
        }
      },
      {
        "text": "Если бы я знал, я бы позвонил.",
        "slot": "я знал",
        "cue": {
          "en": "I had known",
          "ko": "알았다"
        },
        "gloss": {
          "en": "If I'd known, I would have called.",
          "ko": "알았으면 전화했을 텐데."
        }
      },
      {
        "text": "Если бы не пробки, я бы успел.",
        "slot": "не пробки",
        "cue": {
          "en": "it weren't for the traffic",
          "ko": "차가 안 막혔다"
        },
        "gloss": {
          "en": "If it weren't for the traffic, I'd have made it.",
          "ko": "차만 안 막혔으면 늦지 않았을 텐데."
        }
      },
      {
        "text": "Если бы он вышел завтра, я бы взял выходной.",
        "slot": "он вышел завтра",
        "cue": {
          "en": "it came out tomorrow",
          "ko": "내일 나온다"
        },
        "gloss": {
          "en": "If it came out tomorrow, I'd take a day off.",
          "ko": "그게 내일 나온다면 휴가 낼 텐데."
        }
      }
    ]
  },
  {
    "id": "ru-f3-07",
    "stage": 3,
    "fn": "must",
    "pattern": "Мне надо ___.",
    "core": [
      "Мне надо",
      "мне надо",
      "Мне нужно",
      "мне нужно"
    ],
    "meaning": {
      "en": "Saying what you have to do: I need to ___.",
      "ko": "해야 하는 일 말하기: ___ 해야 해."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Мне надо позвонить маме.",
        "slot": "позвонить маме",
        "cue": {
          "en": "call mom",
          "ko": "엄마에게 전화하다"
        },
        "gloss": {
          "en": "I need to call my mom.",
          "ko": "엄마한테 전화해야 해."
        }
      },
      {
        "text": "Мне нужно закончить отчёт к пятнице.",
        "slot": "закончить отчёт",
        "cue": {
          "en": "finish the report",
          "ko": "보고서를 끝내다"
        },
        "gloss": {
          "en": "I need to finish the report by Friday.",
          "ko": "금요일까지 보고서를 끝내야 해요."
        }
      },
      {
        "text": "Извини, мне надо уйти пораньше.",
        "slot": "уйти пораньше",
        "cue": {
          "en": "leave early",
          "ko": "일찍 가다"
        },
        "gloss": {
          "en": "Sorry, I need to leave early.",
          "ko": "미안, 일찍 가야 해."
        }
      },
      {
        "text": "Мне нужно просто нормально выспаться.",
        "slot": "нормально выспаться",
        "cue": {
          "en": "get a proper night's sleep",
          "ko": "푹 자다"
        },
        "gloss": {
          "en": "I just need a proper night's sleep.",
          "ko": "그냥 푹 자야 해요."
        }
      }
    ]
  },
  {
    "id": "ru-f3-08",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "…, чтобы ___.",
    "core": [
      "чтобы"
    ],
    "meaning": {
      "en": "Saying the purpose: …, so that / in order to ___.",
      "ko": "목적 말하기: ___ 하려고."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я пришёл пораньше, чтобы помочь.",
        "slot": "помочь",
        "cue": {
          "en": "help",
          "ko": "돕다"
        },
        "gloss": {
          "en": "I came early to help.",
          "ko": "도우려고 일찍 왔어."
        }
      },
      {
        "text": "Я звоню, чтобы извиниться.",
        "slot": "извиниться",
        "cue": {
          "en": "apologize",
          "ko": "사과하다"
        },
        "gloss": {
          "en": "I'm calling to apologize.",
          "ko": "사과하려고 전화했어."
        }
      },
      {
        "text": "Я учу русский, чтобы читать книги.",
        "slot": "читать книги",
        "cue": {
          "en": "read books",
          "ko": "책을 읽다"
        },
        "gloss": {
          "en": "I'm learning Russian to read books.",
          "ko": "책을 읽으려고 러시아어를 배워."
        }
      },
      {
        "text": "Я ушёл раньше, чтобы успеть на поезд.",
        "slot": "успеть на поезд",
        "cue": {
          "en": "catch the train",
          "ko": "기차를 타다"
        },
        "gloss": {
          "en": "I left early to catch the train.",
          "ko": "기차 시간 맞추려고 일찍 나왔어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-09",
    "stage": 3,
    "fn": "describe-person",
    "pattern": "Это ___, который…",
    "core": [
      "который",
      "которая",
      "которое",
      "которые",
      "которых"
    ],
    "meaning": {
      "en": "Describing with a relative clause: This is the ___ who/that…",
      "ko": "꾸며서 설명하기: …하는 ___예요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Это друг, который живёт в Петербурге.",
        "slot": "друг",
        "cue": {
          "en": "a friend",
          "ko": "친구"
        },
        "gloss": {
          "en": "This is a friend who lives in St Petersburg.",
          "ko": "상트페테르부르크에 사는 친구야."
        }
      },
      {
        "text": "Это коллега, которая мне всегда помогает.",
        "slot": "коллега",
        "cue": {
          "en": "a colleague",
          "ko": "동료"
        },
        "gloss": {
          "en": "This is the colleague who always helps me.",
          "ko": "나를 항상 도와주는 동료야."
        }
      },
      {
        "text": "Это сериал, который мне посоветовали.",
        "slot": "сериал",
        "cue": {
          "en": "a series",
          "ko": "드라마"
        },
        "gloss": {
          "en": "This is the series someone recommended to me.",
          "ko": "누가 추천해 준 드라마야."
        }
      },
      {
        "text": "Это таблицы, которые прислали в понедельник.",
        "slot": "таблицы",
        "cue": {
          "en": "the spreadsheets",
          "ko": "표"
        },
        "gloss": {
          "en": "These are the spreadsheets they sent on Monday.",
          "ko": "월요일에 보내 준 표들이에요."
        }
      }
    ]
  },
  {
    "id": "ru-f3-10",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Я наконец ___.",
    "core": [
      "наконец",
      "Наконец"
    ],
    "meaning": {
      "en": "Saying you finally finished something (completed aspect): I finally ___.",
      "ko": "끝낸 일 말하기(완료상): 드디어 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я наконец прочитал эту книгу.",
        "slot": "прочитал эту книгу",
        "cue": {
          "en": "finished reading this book",
          "ko": "이 책을 다 읽었다"
        },
        "gloss": {
          "en": "I finally finished this book.",
          "ko": "드디어 이 책을 다 읽었어."
        }
      },
      {
        "text": "Вчера я наконец досмотрел второй сезон.",
        "slot": "досмотрел второй сезон",
        "cue": {
          "en": "finished watching season two",
          "ko": "두 번째 시즌을 다 봤다"
        },
        "gloss": {
          "en": "Yesterday I finally finished season two.",
          "ko": "어제 드디어 두 번째 시즌 다 봤어."
        }
      },
      {
        "text": "Я наконец закончил отчёт!",
        "slot": "закончил отчёт",
        "cue": {
          "en": "finished the report",
          "ko": "보고서를 끝냈다"
        },
        "gloss": {
          "en": "I've finally finished the report!",
          "ko": "드디어 보고서 끝냈어!"
        }
      },
      {
        "text": "Я долго искал ключи и наконец нашёл.",
        "slot": "нашёл",
        "cue": {
          "en": "found them",
          "ko": "찾았다"
        },
        "gloss": {
          "en": "I looked for my keys for ages and finally found them.",
          "ko": "열쇠를 한참 찾다가 드디어 찾았어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-11",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "Я зайду ___.",
    "core": [
      "зайду",
      "Зайду"
    ],
    "meaning": {
      "en": "Saying you'll drop by: I'll drop in ___.",
      "ko": "들르겠다고 말하기: ___ 들를게."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я зайду к тебе вечером.",
        "slot": "к тебе вечером",
        "cue": {
          "en": "to your place this evening",
          "ko": "저녁에 너희 집에"
        },
        "gloss": {
          "en": "I'll drop by your place this evening.",
          "ko": "저녁에 너희 집에 들를게."
        }
      },
      {
        "text": "Зайду в аптеку по дороге.",
        "slot": "в аптеку",
        "cue": {
          "en": "to the pharmacy",
          "ko": "약국에"
        },
        "gloss": {
          "en": "I'll stop at the pharmacy on the way.",
          "ko": "가는 길에 약국에 들를게."
        }
      },
      {
        "text": "Я зайду к вам в два, если удобно.",
        "slot": "к вам в два",
        "cue": {
          "en": "to your desk at two",
          "ko": "두 시에 당신 자리로"
        },
        "gloss": {
          "en": "I'll come by at two, if that's convenient.",
          "ko": "괜찮으시면 두 시에 들를게요."
        }
      },
      {
        "text": "Я зайду за тобой в семь.",
        "slot": "за тобой в семь",
        "cue": {
          "en": "for you at seven",
          "ko": "일곱 시에 너를 데리러"
        },
        "gloss": {
          "en": "I'll come and get you at seven.",
          "ko": "일곱 시에 데리러 갈게."
        }
      }
    ]
  },
  {
    "id": "ru-f3-12",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "Прости за опоздание, ___.",
    "core": [
      "Прости за опоздание",
      "прости за опоздание"
    ],
    "meaning": {
      "en": "Apologizing for being late and explaining: Sorry I'm late, ___.",
      "ko": "늦어서 사과하고 사정 말하기: 늦어서 미안, ___."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "Прости за опоздание"
    ],
    "examples": [
      {
        "text": "Прости за опоздание, автобус ушёл прямо передо мной.",
        "slot": "автобус ушёл прямо передо мной",
        "cue": {
          "en": "the bus left right in front of me",
          "ko": "버스가 눈앞에서 떠났다"
        },
        "gloss": {
          "en": "Sorry I'm late, the bus left right in front of me.",
          "ko": "늦어서 미안, 버스가 눈앞에서 떠났어."
        }
      },
      {
        "text": "Прости за опоздание, я поздно вышел из дома.",
        "slot": "я поздно вышел из дома",
        "cue": {
          "en": "I left home late",
          "ko": "집에서 늦게 나왔다"
        },
        "gloss": {
          "en": "Sorry I'm late, I left home late.",
          "ko": "늦어서 미안, 집에서 늦게 나왔어."
        }
      },
      {
        "text": "Прости за опоздание, я зашёл не в тот зал.",
        "slot": "я зашёл не в тот зал",
        "cue": {
          "en": "I went into the wrong hall",
          "ko": "다른 상영관에 들어갔다"
        },
        "gloss": {
          "en": "Sorry I'm late, I went into the wrong screen.",
          "ko": "늦어서 미안, 다른 관에 들어갔었어."
        }
      },
      {
        "text": "Прости за опоздание, я пришёл не к тому входу.",
        "slot": "я пришёл не к тому входу",
        "cue": {
          "en": "I came to the wrong entrance",
          "ko": "다른 입구로 왔다"
        },
        "gloss": {
          "en": "Sorry I'm late, I came to the wrong entrance.",
          "ko": "늦어서 미안, 다른 입구로 왔어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-13",
    "stage": 3,
    "fn": "complain",
    "pattern": "Что-то ___ не работает.",
    "core": [
      "не работает"
    ],
    "meaning": {
      "en": "Reporting that something isn't working: The ___ isn't working.",
      "ko": "고장 알리기: ___가 안 돼요."
    },
    "grammar": [],
    "expressions": [
      "Что-то не работает"
    ],
    "examples": [
      {
        "text": "Что-то кондиционер не работает.",
        "slot": "кондиционер",
        "cue": {
          "en": "the air conditioner",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The air conditioner doesn't seem to work.",
          "ko": "에어컨이 안 되는 것 같아요."
        }
      },
      {
        "text": "Что-то интернет не работает.",
        "slot": "интернет",
        "cue": {
          "en": "the internet",
          "ko": "인터넷"
        },
        "gloss": {
          "en": "The internet isn't working for some reason.",
          "ko": "인터넷이 왜인지 안 돼요."
        }
      },
      {
        "text": "У меня принтер не работает.",
        "slot": "принтер",
        "cue": {
          "en": "the printer",
          "ko": "프린터"
        },
        "gloss": {
          "en": "My printer isn't working.",
          "ko": "제 프린터가 안 돼요."
        }
      },
      {
        "text": "Что-то душ не работает, нет горячей воды.",
        "slot": "душ",
        "cue": {
          "en": "the shower",
          "ko": "샤워기"
        },
        "gloss": {
          "en": "The shower isn't working, there's no hot water.",
          "ko": "샤워기가 안 돼요, 뜨거운 물이 안 나와요."
        }
      }
    ]
  },
  {
    "id": "ru-f3-14",
    "stage": 3,
    "fn": "guess",
    "pattern": "Может быть, ___.",
    "core": [
      "Может быть",
      "может быть"
    ],
    "meaning": {
      "en": "Guessing: Maybe ___.",
      "ko": "짐작하기: 어쩌면 ___일지도."
    },
    "grammar": [],
    "expressions": [
      "Может быть"
    ],
    "examples": [
      {
        "text": "Может быть, он уже ушёл.",
        "slot": "он уже ушёл",
        "cue": {
          "en": "he's already left",
          "ko": "그가 벌써 갔다"
        },
        "gloss": {
          "en": "Maybe he's already left.",
          "ko": "어쩌면 벌써 갔을지도 몰라."
        }
      },
      {
        "text": "Может быть, фильм начинается позже.",
        "slot": "фильм начинается позже",
        "cue": {
          "en": "the film starts later",
          "ko": "영화가 더 늦게 시작한다"
        },
        "gloss": {
          "en": "Maybe the film starts later.",
          "ko": "어쩌면 영화가 더 늦게 시작할지도 몰라."
        }
      },
      {
        "text": "Может быть, он просто забыл.",
        "slot": "он просто забыл",
        "cue": {
          "en": "he just forgot",
          "ko": "그냥 잊었다"
        },
        "gloss": {
          "en": "Maybe he just forgot.",
          "ko": "그냥 잊어버렸을지도 몰라."
        }
      },
      {
        "text": "Может быть, я ошибся.",
        "slot": "я ошибся",
        "cue": {
          "en": "I was wrong",
          "ko": "내가 잘못 알았다"
        },
        "gloss": {
          "en": "Maybe I was wrong.",
          "ko": "내가 잘못 알았을 수도 있어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-15",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "Я не уверен, что ___.",
    "core": [
      "Я не уверен",
      "я не уверен",
      "Я не уверена",
      "я не уверена"
    ],
    "meaning": {
      "en": "Gently doubting: I'm not sure that ___.",
      "ko": "부드럽게 의심하기: ___인지 잘 모르겠어."
    },
    "grammar": [],
    "expressions": [
      "Я не уверен"
    ],
    "examples": [
      {
        "text": "Я не уверен, что это хорошая идея.",
        "slot": "это хорошая идея",
        "cue": {
          "en": "it's a good idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "I'm not sure it's a good idea.",
          "ko": "좋은 생각인지 잘 모르겠어."
        }
      },
      {
        "text": "Я не уверен, что успею к пятнице.",
        "slot": "успею к пятнице",
        "cue": {
          "en": "I'll make it by Friday",
          "ko": "금요일까지 끝낼 수 있다"
        },
        "gloss": {
          "en": "I'm not sure I'll make it by Friday.",
          "ko": "금요일까지 할 수 있을지 모르겠어."
        }
      },
      {
        "text": "Я не уверена, что он прав.",
        "slot": "он прав",
        "cue": {
          "en": "he's right",
          "ko": "그가 옳다"
        },
        "gloss": {
          "en": "I'm not sure he's right.",
          "ko": "그 사람 말이 맞는지 모르겠어."
        }
      },
      {
        "text": "Честно говоря, я не уверен, что это правда.",
        "slot": "это правда",
        "cue": {
          "en": "it's true",
          "ko": "그게 사실이다"
        },
        "gloss": {
          "en": "Honestly, I'm not sure it's true.",
          "ko": "솔직히 그게 사실인지 모르겠어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-16",
    "stage": 3,
    "fn": "surprise",
    "pattern": "Ты серьёзно ___?",
    "core": [
      "Ты серьёзно",
      "ты серьёзно"
    ],
    "meaning": {
      "en": "Reacting with surprise: Are you serious, ___?",
      "ko": "놀람 표현하기: 진짜 ___?"
    },
    "grammar": [],
    "expressions": [
      "Ты серьёзно"
    ],
    "examples": [
      {
        "text": "Ты серьёзно не видел этот фильм?",
        "slot": "не видел этот фильм",
        "cue": {
          "en": "haven't seen this film",
          "ko": "이 영화를 안 봤다"
        },
        "gloss": {
          "en": "You seriously haven't seen this film?",
          "ko": "진짜 이 영화 안 봤어?"
        }
      },
      {
        "text": "Ты серьёзно уходишь?",
        "slot": "уходишь",
        "cue": {
          "en": "you're leaving",
          "ko": "간다"
        },
        "gloss": {
          "en": "Are you seriously leaving?",
          "ko": "진짜 가는 거야?"
        }
      },
      {
        "text": "Ты серьёзно хочешь переехать?",
        "slot": "хочешь переехать",
        "cue": {
          "en": "want to move",
          "ko": "이사하고 싶다"
        },
        "gloss": {
          "en": "You seriously want to move?",
          "ko": "진짜 이사하고 싶어?"
        }
      },
      {
        "text": "Ты серьёзно всё это прочитал?",
        "slot": "всё это прочитал",
        "cue": {
          "en": "read all of this",
          "ko": "이걸 다 읽었다"
        },
        "gloss": {
          "en": "You seriously read all of this?",
          "ko": "진짜 이걸 다 읽었어?"
        }
      }
    ]
  },
  {
    "id": "ru-f3-17",
    "stage": 3,
    "fn": "change-topic",
    "pattern": "Кстати, ___",
    "core": [
      "Кстати",
      "кстати"
    ],
    "meaning": {
      "en": "Changing the topic: By the way, ___",
      "ko": "화제 바꾸기: 그런데 말이야, ___"
    },
    "grammar": [],
    "expressions": [
      "Кстати"
    ],
    "examples": [
      {
        "text": "Кстати, ты смотрел новый сезон?",
        "slot": "ты смотрел новый сезон",
        "cue": {
          "en": "have you watched the new season",
          "ko": "새 시즌 봤어"
        },
        "gloss": {
          "en": "By the way, have you watched the new season?",
          "ko": "그런데, 새 시즌 봤어?"
        }
      },
      {
        "text": "Кстати, как твой проект?",
        "slot": "как твой проект",
        "cue": {
          "en": "how's your project",
          "ko": "프로젝트는 어때"
        },
        "gloss": {
          "en": "By the way, how's your project?",
          "ko": "그나저나, 프로젝트는 어때?"
        }
      },
      {
        "text": "Кстати, мне надо тебе кое-что сказать.",
        "slot": "мне надо тебе кое-что сказать",
        "cue": {
          "en": "I need to tell you something",
          "ko": "할 말이 있다"
        },
        "gloss": {
          "en": "By the way, I need to tell you something.",
          "ko": "그런데, 너한테 할 말이 있어."
        }
      },
      {
        "text": "Кстати, где ты купил эту куртку?",
        "slot": "где ты купил эту куртку",
        "cue": {
          "en": "where did you buy this jacket",
          "ko": "이 재킷 어디서 샀어"
        },
        "gloss": {
          "en": "By the way, where did you buy that jacket?",
          "ko": "그런데 그 재킷 어디서 샀어?"
        }
      }
    ]
  },
  {
    "id": "ru-f3-18",
    "stage": 3,
    "fn": "time-when",
    "pattern": "___ начинается в…",
    "core": [
      "начинается",
      "начинаются",
      "закрывается",
      "открывается"
    ],
    "meaning": {
      "en": "Saying when something starts, opens or closes (-ся verbs): ___ starts at…",
      "ko": "시작·개점·마감 시간 말하기(-ся 동사): ___가 …에 시작해."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Фильм начинается в восемь.",
        "slot": "Фильм",
        "cue": {
          "en": "the film",
          "ko": "영화"
        },
        "gloss": {
          "en": "The film starts at eight.",
          "ko": "영화는 여덟 시에 시작해."
        }
      },
      {
        "text": "Магазин закрывается в десять.",
        "slot": "Магазин",
        "cue": {
          "en": "the shop",
          "ko": "가게"
        },
        "gloss": {
          "en": "The shop closes at ten.",
          "ko": "가게는 열 시에 닫아."
        }
      },
      {
        "text": "Встреча начинается через час.",
        "slot": "Встреча",
        "cue": {
          "en": "the meeting",
          "ko": "회의"
        },
        "gloss": {
          "en": "The meeting starts in an hour.",
          "ko": "회의는 한 시간 뒤에 시작해."
        }
      },
      {
        "text": "Кафе открывается в девять.",
        "slot": "Кафе",
        "cue": {
          "en": "the café",
          "ko": "카페"
        },
        "gloss": {
          "en": "The café opens at nine.",
          "ko": "카페는 아홉 시에 열어."
        }
      }
    ]
  },
  {
    "id": "ru-f3-19",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Честно говоря, ___.",
    "core": [
      "Честно говоря",
      "честно говоря"
    ],
    "meaning": {
      "en": "Being honest: To be honest, ___.",
      "ko": "솔직하게 말하기: 솔직히 말하면 ___."
    },
    "grammar": [],
    "expressions": [
      "Честно говоря"
    ],
    "examples": [
      {
        "text": "Честно говоря, мне не понравилось.",
        "slot": "мне не понравилось",
        "cue": {
          "en": "I didn't like it",
          "ko": "마음에 안 들었다"
        },
        "gloss": {
          "en": "To be honest, I didn't like it.",
          "ko": "솔직히 별로였어."
        }
      },
      {
        "text": "Честно говоря, я очень устал.",
        "slot": "я очень устал",
        "cue": {
          "en": "I'm very tired",
          "ko": "많이 피곤하다"
        },
        "gloss": {
          "en": "To be honest, I'm really tired.",
          "ko": "솔직히 너무 피곤해."
        }
      },
      {
        "text": "Честно говоря, я забыл.",
        "slot": "я забыл",
        "cue": {
          "en": "I forgot",
          "ko": "잊어버렸다"
        },
        "gloss": {
          "en": "Honestly, I forgot.",
          "ko": "솔직히 잊어버렸어."
        }
      },
      {
        "text": "Честно говоря, я не знаю, что делать.",
        "slot": "я не знаю, что делать",
        "cue": {
          "en": "I don't know what to do",
          "ko": "어떻게 할지 모르겠다"
        },
        "gloss": {
          "en": "To be honest, I don't know what to do.",
          "ko": "솔직히 어떻게 해야 할지 모르겠어."
        }
      }
    ]
  },
  {
    "id": "ru-f4-01",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "С одной стороны, ___, с другой стороны, …",
    "core": [
      "С одной стороны",
      "с одной стороны"
    ],
    "meaning": {
      "en": "Weighing one side: On the one hand, ___.",
      "ko": "한쪽 면 말하기: 한편으로는 ___."
    },
    "grammar": [],
    "expressions": [
      "С одной стороны"
    ],
    "examples": [
      {
        "text": "С одной стороны, в большом городе больше возможностей.",
        "slot": "в большом городе больше возможностей",
        "cue": {
          "en": "a big city has more opportunities",
          "ko": "큰 도시에 기회가 더 많다"
        },
        "gloss": {
          "en": "On the one hand, a big city has more opportunities.",
          "ko": "한편으로는 큰 도시에 기회가 더 많아."
        }
      },
      {
        "text": "С одной стороны, новая программа удобнее.",
        "slot": "новая программа удобнее",
        "cue": {
          "en": "the new program is more convenient",
          "ko": "새 프로그램이 더 편하다"
        },
        "gloss": {
          "en": "On the one hand, the new program is more convenient.",
          "ko": "한편으로는 새 프로그램이 더 편해요."
        }
      },
      {
        "text": "Я, с одной стороны, рад переезду.",
        "slot": "рад переезду",
        "cue": {
          "en": "be glad about the move",
          "ko": "이사가 기쁘다"
        },
        "gloss": {
          "en": "On the one hand, I'm glad about the move.",
          "ko": "한편으로는 이사하는 게 기뻐."
        }
      },
      {
        "text": "С одной стороны, собака — это большая ответственность.",
        "slot": "собака — это большая ответственность",
        "cue": {
          "en": "a dog is a big responsibility",
          "ko": "개는 큰 책임이다"
        },
        "gloss": {
          "en": "On the one hand, a dog is a big responsibility.",
          "ko": "한편으로는 개는 큰 책임이야."
        }
      }
    ]
  },
  {
    "id": "ru-f4-02",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "С другой стороны, ___.",
    "core": [
      "С другой стороны",
      "с другой стороны"
    ],
    "meaning": {
      "en": "Weighing the other side: On the other hand, ___.",
      "ko": "다른 면 말하기: 다른 한편으로는 ___."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "С другой стороны"
    ],
    "examples": [
      {
        "text": "С другой стороны, жить там гораздо дороже.",
        "slot": "жить там гораздо дороже",
        "cue": {
          "en": "living there is much more expensive",
          "ko": "거기 사는 게 훨씬 비싸다"
        },
        "gloss": {
          "en": "On the other hand, living there is much more expensive.",
          "ko": "다른 한편으로는 거기 사는 게 훨씬 비싸."
        }
      },
      {
        "text": "С другой стороны, никто не обещал, что будет легко.",
        "slot": "никто не обещал, что будет легко",
        "cue": {
          "en": "nobody promised it would be easy",
          "ko": "쉬울 거라고 아무도 약속 안 했다"
        },
        "gloss": {
          "en": "On the other hand, nobody promised it would be easy.",
          "ko": "다른 한편으로는 쉬울 거라고 아무도 약속 안 했잖아."
        }
      },
      {
        "text": "А с другой стороны, отдых тоже нужен.",
        "slot": "отдых тоже нужен",
        "cue": {
          "en": "rest is needed too",
          "ko": "쉬는 것도 필요하다"
        },
        "gloss": {
          "en": "But on the other hand, you need rest too.",
          "ko": "그런데 다른 한편으로는 쉬는 것도 필요해."
        }
      },
      {
        "text": "С другой стороны, клиенты к нам уже привыкли.",
        "slot": "клиенты к нам уже привыкли",
        "cue": {
          "en": "customers are already used to us",
          "ko": "고객들이 이미 우리에게 익숙하다"
        },
        "gloss": {
          "en": "On the other hand, our customers are already used to us.",
          "ko": "다른 한편으로는 고객들이 이미 우리한테 익숙해요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-03",
    "stage": 4,
    "fn": "reason",
    "pattern": "Дело в том, что ___.",
    "core": [
      "Дело в том, что",
      "дело в том, что"
    ],
    "meaning": {
      "en": "Explaining the real reason: The thing is, ___.",
      "ko": "진짜 이유 설명하기: 실은 ___거든요."
    },
    "grammar": [],
    "expressions": [
      "Дело в том"
    ],
    "examples": [
      {
        "text": "Дело в том, что поезд опоздал на час.",
        "slot": "поезд опоздал на час",
        "cue": {
          "en": "the train was an hour late",
          "ko": "기차가 한 시간 늦었다"
        },
        "gloss": {
          "en": "The thing is, the train was an hour late.",
          "ko": "실은 기차가 한 시간 늦었거든요."
        }
      },
      {
        "text": "Дело в том, что я не получил ваше письмо.",
        "slot": "я не получил ваше письмо",
        "cue": {
          "en": "I didn't get your letter",
          "ko": "당신의 편지를 못 받았다"
        },
        "gloss": {
          "en": "The thing is, I didn't get your letter.",
          "ko": "실은 보내 주신 편지를 못 받았어요."
        }
      },
      {
        "text": "Извините, дело в том, что у нас сегодня нет свободных столиков.",
        "slot": "у нас сегодня нет свободных столиков",
        "cue": {
          "en": "we have no free tables today",
          "ko": "오늘 빈 테이블이 없다"
        },
        "gloss": {
          "en": "Sorry, the thing is, we have no free tables today.",
          "ko": "죄송해요, 실은 오늘 빈 테이블이 없어서요."
        }
      },
      {
        "text": "Дело в том, что отчёт ещё не готов.",
        "slot": "отчёт ещё не готов",
        "cue": {
          "en": "the report isn't ready yet",
          "ko": "보고서가 아직 안 됐다"
        },
        "gloss": {
          "en": "The thing is, the report isn't ready yet.",
          "ko": "실은 보고서가 아직 안 끝났어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-04",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "Это зависит от того, ___.",
    "core": [
      "зависит от того"
    ],
    "meaning": {
      "en": "Saying it depends: It depends on ___.",
      "ko": "조건에 따라 다르다고 말하기: ___에 달렸어."
    },
    "grammar": [],
    "expressions": [
      "Это зависит от"
    ],
    "examples": [
      {
        "text": "Это зависит от того, сколько у нас будет времени.",
        "slot": "сколько у нас будет времени",
        "cue": {
          "en": "how much time we'll have",
          "ko": "시간이 얼마나 있을지"
        },
        "gloss": {
          "en": "It depends on how much time we'll have.",
          "ko": "시간이 얼마나 있을지에 달렸어."
        }
      },
      {
        "text": "Всё зависит от того, что скажет врач.",
        "slot": "что скажет врач",
        "cue": {
          "en": "what the doctor says",
          "ko": "의사가 뭐라고 할지"
        },
        "gloss": {
          "en": "It all depends on what the doctor says.",
          "ko": "다 의사가 뭐라고 하느냐에 달렸어요."
        }
      },
      {
        "text": "Цена зависит от того, когда вы бронируете.",
        "slot": "когда вы бронируете",
        "cue": {
          "en": "when you book",
          "ko": "언제 예약하는지"
        },
        "gloss": {
          "en": "The price depends on when you book.",
          "ko": "가격은 언제 예약하느냐에 따라 달라요."
        }
      },
      {
        "text": "Успех зависит от того, как мы подготовимся.",
        "slot": "как мы подготовимся",
        "cue": {
          "en": "how we prepare",
          "ko": "우리가 어떻게 준비할지"
        },
        "gloss": {
          "en": "Success depends on how we prepare.",
          "ko": "성공은 우리가 어떻게 준비하느냐에 달렸어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-05",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Давайте обсудим ___.",
    "core": [
      "Давайте обсудим",
      "давайте обсудим"
    ],
    "meaning": {
      "en": "Opening a discussion: Let's discuss ___.",
      "ko": "논의 꺼내기: ___ 얘기해 봅시다."
    },
    "grammar": [],
    "expressions": [
      "Давайте обсудим"
    ],
    "examples": [
      {
        "text": "Давайте обсудим условия договора.",
        "slot": "условия договора",
        "cue": {
          "en": "the terms of the contract",
          "ko": "계약 조건"
        },
        "gloss": {
          "en": "Let's discuss the terms of the contract.",
          "ko": "계약 조건을 얘기해 봅시다."
        }
      },
      {
        "text": "Давайте обсудим, кто будет отвечать за рекламу.",
        "slot": "кто будет отвечать за рекламу",
        "cue": {
          "en": "who will be in charge of advertising",
          "ko": "누가 광고를 맡을지"
        },
        "gloss": {
          "en": "Let's discuss who will be in charge of advertising.",
          "ko": "누가 광고를 맡을지 얘기해 봅시다."
        }
      },
      {
        "text": "Тогда давайте обсудим сроки.",
        "slot": "сроки",
        "cue": {
          "en": "deadlines",
          "ko": "기한"
        },
        "gloss": {
          "en": "Then let's discuss the deadlines.",
          "ko": "그럼 기한을 얘기해 봅시다."
        }
      },
      {
        "text": "Давайте обсудим это после обеда.",
        "slot": "это после обеда",
        "cue": {
          "en": "this after lunch",
          "ko": "이것을 점심 뒤에"
        },
        "gloss": {
          "en": "Let's discuss this after lunch.",
          "ko": "이건 점심 먹고 얘기해요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-06",
    "stage": 4,
    "fn": "rephrase",
    "pattern": "Я имею в виду, что ___.",
    "core": [
      "Я имею в виду",
      "я имею в виду"
    ],
    "meaning": {
      "en": "Saying what you meant: I mean ___.",
      "ko": "내 말뜻 밝히기: 내 말은 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "Я имею в виду"
    ],
    "examples": [
      {
        "text": "Я имею в виду, что нам нужно больше людей.",
        "slot": "что нам нужно больше людей",
        "cue": {
          "en": "we need more people",
          "ko": "사람이 더 필요하다"
        },
        "gloss": {
          "en": "I mean that we need more people.",
          "ko": "제 말은 사람이 더 필요하다는 거예요."
        }
      },
      {
        "text": "Нет, я имею в виду другой ресторан.",
        "slot": "другой ресторан",
        "cue": {
          "en": "a different restaurant",
          "ko": "다른 식당"
        },
        "gloss": {
          "en": "No, I mean a different restaurant.",
          "ko": "아니, 다른 식당 말하는 거야."
        }
      },
      {
        "text": "Я имею в виду, что спешить не стоит.",
        "slot": "что спешить не стоит",
        "cue": {
          "en": "there's no point rushing",
          "ko": "서두를 필요가 없다"
        },
        "gloss": {
          "en": "I mean there's no need to rush.",
          "ko": "제 말은 서두를 필요 없다는 거예요."
        }
      },
      {
        "text": "Я имею в виду не цену, а качество.",
        "slot": "не цену, а качество",
        "cue": {
          "en": "not the price but the quality",
          "ko": "값이 아니라 품질"
        },
        "gloss": {
          "en": "I don't mean the price, I mean the quality.",
          "ko": "값 말고 품질 얘기예요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-07",
    "stage": 4,
    "fn": "guess",
    "pattern": "Судя по всему, ___.",
    "core": [
      "Судя по всему",
      "судя по всему"
    ],
    "meaning": {
      "en": "Drawing a conclusion from signs: By all accounts, ___.",
      "ko": "정황으로 짐작하기: 보아하니 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "Судя по всему"
    ],
    "examples": [
      {
        "text": "Судя по всему, дождь будет весь день.",
        "slot": "дождь будет весь день",
        "cue": {
          "en": "it will rain all day",
          "ko": "하루 종일 비가 오겠다"
        },
        "gloss": {
          "en": "By the looks of it, it will rain all day.",
          "ko": "보아하니 하루 종일 비가 오겠네."
        }
      },
      {
        "text": "Судя по всему, они уже договорились.",
        "slot": "они уже договорились",
        "cue": {
          "en": "they've already agreed",
          "ko": "그들이 벌써 합의했다"
        },
        "gloss": {
          "en": "Apparently they've already reached an agreement.",
          "ko": "보아하니 그 사람들 벌써 합의했나 봐."
        }
      },
      {
        "text": "Он, судя по всему, не придёт.",
        "slot": "не придёт",
        "cue": {
          "en": "he won't come",
          "ko": "그가 안 온다"
        },
        "gloss": {
          "en": "Apparently he isn't coming.",
          "ko": "보아하니 그 사람 안 오겠네."
        }
      },
      {
        "text": "Судя по всему, магазин закрыли на ремонт.",
        "slot": "магазин закрыли на ремонт",
        "cue": {
          "en": "the shop was closed for repairs",
          "ko": "가게가 수리로 문을 닫았다"
        },
        "gloss": {
          "en": "It looks like the shop has been closed for repairs.",
          "ko": "보아하니 가게가 수리 때문에 문을 닫았나 봐."
        }
      }
    ]
  },
  {
    "id": "ru-f4-08",
    "stage": 4,
    "fn": "the-more",
    "pattern": "Чем ___, тем лучше.",
    "core": [
      "тем лучше"
    ],
    "meaning": {
      "en": "The more…, the better: The ___, the better.",
      "ko": "~할수록 좋다고 말하기: ___할수록 좋아."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Чем раньше мы начнём, тем лучше.",
        "slot": "раньше мы начнём",
        "cue": {
          "en": "we start earlier",
          "ko": "우리가 더 일찍 시작하다"
        },
        "gloss": {
          "en": "The sooner we start, the better.",
          "ko": "빨리 시작할수록 좋아."
        }
      },
      {
        "text": "Чем меньше сахара, тем лучше.",
        "slot": "меньше сахара",
        "cue": {
          "en": "less sugar",
          "ko": "설탕이 더 적다"
        },
        "gloss": {
          "en": "The less sugar, the better.",
          "ko": "설탕은 적을수록 좋아."
        }
      },
      {
        "text": "Чем проще объяснение, тем лучше.",
        "slot": "проще объяснение",
        "cue": {
          "en": "a simpler explanation",
          "ko": "더 간단한 설명"
        },
        "gloss": {
          "en": "The simpler the explanation, the better.",
          "ko": "설명은 간단할수록 좋아요."
        }
      },
      {
        "text": "Чем больше людей придёт, тем лучше.",
        "slot": "больше людей придёт",
        "cue": {
          "en": "more people come",
          "ko": "사람이 더 많이 오다"
        },
        "gloss": {
          "en": "The more people come, the better.",
          "ko": "사람이 많이 올수록 좋아."
        }
      }
    ]
  },
  {
    "id": "ru-f4-09",
    "stage": 4,
    "fn": "concede",
    "pattern": "Хотя ___, …",
    "core": [
      "Хотя",
      "хотя"
    ],
    "meaning": {
      "en": "Conceding a point: Although ___, …",
      "ko": "일부 인정하기: ___이긴 하지만, …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Хотя было холодно, мы пошли на пляж.",
        "slot": "было холодно",
        "cue": {
          "en": "it was cold",
          "ko": "추웠다"
        },
        "gloss": {
          "en": "Although it was cold, we went to the beach.",
          "ko": "추웠지만 우리는 해변에 갔어."
        }
      },
      {
        "text": "Я согласна, хотя есть одна проблема.",
        "slot": "есть одна проблема",
        "cue": {
          "en": "there is one problem",
          "ko": "문제가 하나 있다"
        },
        "gloss": {
          "en": "I agree, although there is one problem.",
          "ko": "동의해요, 문제가 하나 있긴 하지만요."
        }
      },
      {
        "text": "Хотя он и опоздал, встреча прошла хорошо.",
        "slot": "он и опоздал",
        "cue": {
          "en": "he was late",
          "ko": "그가 늦었다"
        },
        "gloss": {
          "en": "Although he was late, the meeting went well.",
          "ko": "그 사람이 늦긴 했지만 회의는 잘 끝났어요."
        }
      },
      {
        "text": "Квартира уютная, хотя и маленькая.",
        "slot": "маленькая",
        "cue": {
          "en": "small",
          "ko": "작다"
        },
        "gloss": {
          "en": "The flat is cosy, though small.",
          "ko": "집이 작긴 해도 아늑해."
        }
      }
    ]
  },
  {
    "id": "ru-f4-10",
    "stage": 4,
    "fn": "concede",
    "pattern": "Несмотря на ___, …",
    "core": [
      "Несмотря на",
      "несмотря на"
    ],
    "meaning": {
      "en": "Saying something happened anyway: Despite ___, …",
      "ko": "그래도 했다고 말하기: ___에도 불구하고 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Несмотря на погоду, концерт не отменили.",
        "slot": "погоду",
        "cue": {
          "en": "the weather",
          "ko": "날씨"
        },
        "gloss": {
          "en": "Despite the weather, the concert wasn't cancelled.",
          "ko": "날씨에도 불구하고 공연은 취소되지 않았어요."
        }
      },
      {
        "text": "Несмотря на усталость, она закончила работу.",
        "slot": "усталость",
        "cue": {
          "en": "tiredness",
          "ko": "피곤함"
        },
        "gloss": {
          "en": "Despite being tired, she finished the work.",
          "ko": "피곤했는데도 그녀는 일을 끝냈어요."
        }
      },
      {
        "text": "Мы решили купить эту машину, несмотря на цену.",
        "slot": "цену",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "We decided to buy this car despite the price.",
          "ko": "가격에도 불구하고 이 차를 사기로 했어요."
        }
      },
      {
        "text": "Несмотря на все проблемы, проект сдали вовремя.",
        "slot": "все проблемы",
        "cue": {
          "en": "all the problems",
          "ko": "온갖 문제"
        },
        "gloss": {
          "en": "Despite all the problems, the project was handed in on time.",
          "ko": "온갖 문제에도 프로젝트는 제때 제출됐어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-11",
    "stage": 4,
    "fn": "debate",
    "pattern": "Вопрос в том, ___.",
    "core": [
      "Вопрос в том",
      "вопрос в том"
    ],
    "meaning": {
      "en": "Naming the real question: The question is whether ___.",
      "ko": "핵심 질문 짚기: 문제는 ___이냐는 거예요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Вопрос в том, успеем ли мы к пятнице.",
        "slot": "успеем ли мы к пятнице",
        "cue": {
          "en": "whether we'll make it by Friday",
          "ko": "금요일까지 해낼 수 있을지"
        },
        "gloss": {
          "en": "The question is whether we'll make it by Friday.",
          "ko": "문제는 금요일까지 끝낼 수 있느냐예요."
        }
      },
      {
        "text": "Вопрос в том, кто за это заплатит.",
        "slot": "кто за это заплатит",
        "cue": {
          "en": "who will pay for it",
          "ko": "누가 그 돈을 낼지"
        },
        "gloss": {
          "en": "The question is who will pay for it.",
          "ko": "문제는 누가 돈을 내느냐야."
        }
      },
      {
        "text": "Главный вопрос в том, нужно ли нам это вообще.",
        "slot": "нужно ли нам это вообще",
        "cue": {
          "en": "whether we need it at all",
          "ko": "우리에게 그게 필요하기는 한지"
        },
        "gloss": {
          "en": "The main question is whether we need it at all.",
          "ko": "핵심은 우리한테 그게 필요하긴 하냐는 거예요."
        }
      },
      {
        "text": "Вопрос в том, согласится ли директор.",
        "slot": "согласится ли директор",
        "cue": {
          "en": "whether the director will agree",
          "ko": "사장이 동의할지"
        },
        "gloss": {
          "en": "The question is whether the director will agree.",
          "ko": "문제는 사장님이 동의하느냐예요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-12",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "Подскажите, пожалуйста, ___?",
    "core": [
      "Подскажите, пожалуйста",
      "подскажите, пожалуйста"
    ],
    "meaning": {
      "en": "Politely asking for information: Could you tell me ___?",
      "ko": "정중하게 정보 묻기: ___ 알려 주시겠어요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Подскажите, пожалуйста, нужна ли предварительная запись?",
        "slot": "нужна ли предварительная запись",
        "cue": {
          "en": "whether an appointment is needed",
          "ko": "예약이 필요한지"
        },
        "gloss": {
          "en": "Could you tell me whether I need to book in advance?",
          "ko": "미리 예약해야 하는지 알려 주시겠어요?"
        }
      },
      {
        "text": "Подскажите, пожалуйста, как пройти к вокзалу?",
        "slot": "как пройти к вокзалу",
        "cue": {
          "en": "how to get to the station",
          "ko": "역에 어떻게 가는지"
        },
        "gloss": {
          "en": "Could you tell me how to get to the station?",
          "ko": "역에 어떻게 가는지 알려 주시겠어요?"
        }
      },
      {
        "text": "Подскажите, пожалуйста, есть ли у вас доставка?",
        "slot": "есть ли у вас доставка",
        "cue": {
          "en": "whether you deliver",
          "ko": "배달이 되는지"
        },
        "gloss": {
          "en": "Could you tell me whether you deliver?",
          "ko": "배달 되는지 알려 주시겠어요?"
        }
      },
      {
        "text": "Подскажите, пожалуйста, можно ли оплатить картой?",
        "slot": "можно ли оплатить картой",
        "cue": {
          "en": "whether I can pay by card",
          "ko": "카드로 낼 수 있는지"
        },
        "gloss": {
          "en": "Could you tell me whether I can pay by card?",
          "ko": "카드로 계산할 수 있는지 알려 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "ru-f4-13",
    "stage": 4,
    "fn": "compare",
    "pattern": "Это гораздо ___.",
    "core": [
      "гораздо"
    ],
    "meaning": {
      "en": "Saying something is much more so: It's much ___.",
      "ko": "훨씬 더하다고 말하기: 훨씬 ___."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Этот маршрут гораздо короче.",
        "slot": "короче",
        "cue": {
          "en": "shorter",
          "ko": "더 짧다"
        },
        "gloss": {
          "en": "This route is much shorter.",
          "ko": "이 길이 훨씬 짧아."
        }
      },
      {
        "text": "Поездом ехать гораздо дешевле.",
        "slot": "дешевле",
        "cue": {
          "en": "cheaper",
          "ko": "더 싸다"
        },
        "gloss": {
          "en": "It's much cheaper to go by train.",
          "ko": "기차로 가는 게 훨씬 싸요."
        }
      },
      {
        "text": "Сегодня мне гораздо лучше.",
        "slot": "лучше",
        "cue": {
          "en": "better",
          "ko": "더 낫다"
        },
        "gloss": {
          "en": "I feel much better today.",
          "ko": "오늘은 훨씬 나아요."
        }
      },
      {
        "text": "Новая версия работает гораздо быстрее.",
        "slot": "быстрее",
        "cue": {
          "en": "faster",
          "ko": "더 빠르다"
        },
        "gloss": {
          "en": "The new version runs much faster.",
          "ko": "새 버전이 훨씬 빨라요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-14",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Можно предложить ___.",
    "core": [
      "Можно предложить",
      "можно предложить"
    ],
    "meaning": {
      "en": "Putting forward an option: We could offer ___.",
      "ko": "대안 내놓기: ___을 제안해 볼 수 있어요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Можно предложить клиенту скидку.",
        "slot": "клиенту скидку",
        "cue": {
          "en": "a discount to the client",
          "ko": "고객에게 할인"
        },
        "gloss": {
          "en": "We could offer the client a discount.",
          "ko": "고객에게 할인을 제안해 볼 수 있어요."
        }
      },
      {
        "text": "Можно предложить другой вариант?",
        "slot": "другой вариант",
        "cue": {
          "en": "another option",
          "ko": "다른 방안"
        },
        "gloss": {
          "en": "May I suggest another option?",
          "ko": "다른 방안을 제안해도 될까요?"
        }
      },
      {
        "text": "Если сроки горят, можно предложить сдать работу частями.",
        "slot": "сдать работу частями",
        "cue": {
          "en": "hand in the work in parts",
          "ko": "일을 나눠서 넘기다"
        },
        "gloss": {
          "en": "If the deadline is tight, we could offer to hand in the work in parts.",
          "ko": "기한이 급하면 일을 나눠서 넘기자고 제안할 수 있어요."
        }
      },
      {
        "text": "Можно предложить им встречу в понедельник.",
        "slot": "им встречу в понедельник",
        "cue": {
          "en": "them a meeting on Monday",
          "ko": "그들에게 월요일 회의"
        },
        "gloss": {
          "en": "We could offer them a meeting on Monday.",
          "ko": "그쪽에 월요일 회의를 제안해 볼 수 있어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-15",
    "stage": 4,
    "fn": "story-past",
    "pattern": "Открыв ___, я увидел …",
    "core": [
      "Открыв",
      "открыв"
    ],
    "meaning": {
      "en": "Saying what you did first: Having opened ___, I …",
      "ko": "먼저 한 일 말하기: ___을 열고 나서 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Открыв дверь, я увидел соседа.",
        "slot": "дверь",
        "cue": {
          "en": "the door",
          "ko": "문"
        },
        "gloss": {
          "en": "Opening the door, I saw my neighbour.",
          "ko": "문을 열어 보니 이웃이 있었어."
        }
      },
      {
        "text": "Открыв письмо, она сразу позвонила мне.",
        "slot": "письмо",
        "cue": {
          "en": "the letter",
          "ko": "편지"
        },
        "gloss": {
          "en": "Having opened the letter, she called me right away.",
          "ko": "편지를 열어 보고 그녀는 바로 나한테 전화했어."
        }
      },
      {
        "text": "Я, открыв окно, почувствовал запах моря.",
        "slot": "окно",
        "cue": {
          "en": "the window",
          "ko": "창문"
        },
        "gloss": {
          "en": "When I opened the window, I smelled the sea.",
          "ko": "창문을 열자 바다 냄새가 났어."
        }
      },
      {
        "text": "Открыв приложение, вы увидите кнопку оплаты.",
        "slot": "приложение",
        "cue": {
          "en": "the app",
          "ko": "앱"
        },
        "gloss": {
          "en": "Once you open the app, you'll see the payment button.",
          "ko": "앱을 열면 결제 버튼이 보여요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-16",
    "stage": 4,
    "fn": "describe-person",
    "pattern": "Человек, умеющий ___, …",
    "core": [
      "умеющий"
    ],
    "meaning": {
      "en": "Describing someone by a skill: a person who can ___",
      "ko": "할 줄 아는 것으로 사람 묘사하기: ___할 줄 아는 사람"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Человек, умеющий слушать, всегда найдёт друзей.",
        "slot": "слушать",
        "cue": {
          "en": "listen",
          "ko": "들어 주다"
        },
        "gloss": {
          "en": "A person who knows how to listen will always find friends.",
          "ko": "들어 줄 줄 아는 사람은 늘 친구를 찾아요."
        }
      },
      {
        "text": "Нам нужен сотрудник, умеющий работать с клиентами.",
        "slot": "работать с клиентами",
        "cue": {
          "en": "work with clients",
          "ko": "고객을 상대하다"
        },
        "gloss": {
          "en": "We need an employee who can work with clients.",
          "ko": "고객을 상대할 줄 아는 직원이 필요해요."
        }
      },
      {
        "text": "Ребёнок, умеющий плавать, не боится воды.",
        "slot": "плавать",
        "cue": {
          "en": "swim",
          "ko": "수영하다"
        },
        "gloss": {
          "en": "A child who can swim isn't afraid of water.",
          "ko": "수영할 줄 아는 아이는 물을 무서워하지 않아요."
        }
      },
      {
        "text": "Повар, умеющий готовить без рецепта, — большая редкость.",
        "slot": "готовить без рецепта",
        "cue": {
          "en": "cook without a recipe",
          "ko": "레시피 없이 요리하다"
        },
        "gloss": {
          "en": "A cook who can cook without a recipe is a rare thing.",
          "ko": "레시피 없이 요리할 줄 아는 요리사는 드물어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-17",
    "stage": 4,
    "fn": "report",
    "pattern": "Решение было принято ___.",
    "core": [
      "было принято"
    ],
    "meaning": {
      "en": "Reporting a decision formally: The decision was made ___.",
      "ko": "격식 있게 결정 알리기: 결정은 ___ 내려졌어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Решение было принято на общем собрании.",
        "slot": "на общем собрании",
        "cue": {
          "en": "at the general meeting",
          "ko": "전체 회의에서"
        },
        "gloss": {
          "en": "The decision was made at the general meeting.",
          "ko": "결정은 전체 회의에서 내려졌어요."
        }
      },
      {
        "text": "Это правило было принято после аварии.",
        "slot": "после аварии",
        "cue": {
          "en": "after the accident",
          "ko": "사고 뒤에"
        },
        "gloss": {
          "en": "This rule was adopted after the accident.",
          "ko": "이 규칙은 사고 뒤에 정해졌어요."
        }
      },
      {
        "text": "Всё было принято без обсуждения.",
        "slot": "без обсуждения",
        "cue": {
          "en": "without discussion",
          "ko": "논의 없이"
        },
        "gloss": {
          "en": "Everything was approved without discussion.",
          "ko": "전부 논의 없이 통과됐어요."
        }
      },
      {
        "text": "Предложение было принято единогласно.",
        "slot": "единогласно",
        "cue": {
          "en": "unanimously",
          "ko": "만장일치로"
        },
        "gloss": {
          "en": "The proposal was accepted unanimously.",
          "ko": "제안은 만장일치로 받아들여졌어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-18",
    "stage": 4,
    "fn": "agree",
    "pattern": "Я согласен, ___.",
    "core": [
      "Я согласен",
      "я согласен",
      "Я согласна",
      "я согласна"
    ],
    "meaning": {
      "en": "Agreeing: I agree, ___.",
      "ko": "동의하기: 동의해요, ___."
    },
    "grammar": [],
    "expressions": [
      "Я согласен"
    ],
    "examples": [
      {
        "text": "Я согласен, это хорошая идея.",
        "slot": "это хорошая идея",
        "cue": {
          "en": "it's a good idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "I agree, it's a good idea.",
          "ko": "동의해, 좋은 생각이야."
        }
      },
      {
        "text": "Я согласна с тобой.",
        "slot": "с тобой",
        "cue": {
          "en": "with you",
          "ko": "너와"
        },
        "gloss": {
          "en": "I agree with you.",
          "ko": "네 말에 동의해."
        }
      },
      {
        "text": "В целом я согласен, хотя кое-что я бы изменил.",
        "slot": "хотя кое-что я бы изменил",
        "cue": {
          "en": "though I'd change a few things",
          "ko": "몇 가지는 바꾸고 싶다"
        },
        "gloss": {
          "en": "On the whole I agree, though I'd change a few things.",
          "ko": "대체로 동의하지만 몇 가지는 바꾸고 싶어요."
        }
      },
      {
        "text": "Я согласна, что нужно подождать.",
        "slot": "что нужно подождать",
        "cue": {
          "en": "that we should wait",
          "ko": "기다려야 한다"
        },
        "gloss": {
          "en": "I agree that we should wait.",
          "ko": "기다려야 한다는 데 동의해요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-19",
    "stage": 4,
    "fn": "disagree-soft",
    "pattern": "Не совсем так. ___",
    "core": [
      "Не совсем так",
      "не совсем так"
    ],
    "meaning": {
      "en": "Correcting someone gently: That's not quite right. ___",
      "ko": "부드럽게 바로잡기: 꼭 그렇진 않아요. ___"
    },
    "grammar": [],
    "expressions": [
      "Не совсем так"
    ],
    "examples": [
      {
        "text": "Не совсем так. Мы говорили о другом.",
        "slot": "Мы говорили о другом",
        "cue": {
          "en": "we were talking about something else",
          "ko": "우리는 다른 얘기를 했다"
        },
        "gloss": {
          "en": "Not quite. We were talking about something else.",
          "ko": "꼭 그렇진 않아요. 우리는 다른 얘기를 했어요."
        }
      },
      {
        "text": "Не совсем так: он не уволился, а перешёл в другой отдел.",
        "slot": "он не уволился, а перешёл в другой отдел",
        "cue": {
          "en": "he didn't quit but moved to another department",
          "ko": "그는 그만둔 게 아니라 다른 부서로 옮겼다"
        },
        "gloss": {
          "en": "Not quite: he didn't quit, he moved to another department.",
          "ko": "꼭 그렇진 않아요. 그만둔 게 아니라 다른 부서로 옮긴 거예요."
        }
      },
      {
        "text": "Это не совсем так, цены выросли только летом.",
        "slot": "цены выросли только летом",
        "cue": {
          "en": "prices only went up in summer",
          "ko": "가격은 여름에만 올랐다"
        },
        "gloss": {
          "en": "That's not quite true, prices only went up in summer.",
          "ko": "그건 꼭 그렇지 않아요. 가격은 여름에만 올랐어요."
        }
      },
      {
        "text": "Не совсем так. Решение ещё не принято.",
        "slot": "Решение ещё не принято",
        "cue": {
          "en": "the decision hasn't been made yet",
          "ko": "결정은 아직 안 났다"
        },
        "gloss": {
          "en": "Not quite. The decision hasn't been made yet.",
          "ko": "꼭 그렇진 않아요. 결정은 아직 안 났어요."
        }
      }
    ]
  },
  {
    "id": "ru-f4-20",
    "stage": 4,
    "fn": "opinion",
    "pattern": "Если честно, ___.",
    "core": [
      "Если честно",
      "если честно"
    ],
    "meaning": {
      "en": "Being frank: To be honest, ___.",
      "ko": "솔직하게 말하기: 솔직히 ___."
    },
    "grammar": [],
    "expressions": [
      "Если честно"
    ],
    "examples": [
      {
        "text": "Если честно, мне фильм не понравился.",
        "slot": "мне фильм не понравился",
        "cue": {
          "en": "I didn't like the film",
          "ko": "영화가 마음에 안 들었다"
        },
        "gloss": {
          "en": "To be honest, I didn't like the film.",
          "ko": "솔직히 영화 별로였어."
        }
      },
      {
        "text": "Если честно, я забыл про встречу.",
        "slot": "я забыл про встречу",
        "cue": {
          "en": "I forgot about the meeting",
          "ko": "약속을 잊었다"
        },
        "gloss": {
          "en": "To be honest, I forgot about the meeting.",
          "ko": "솔직히 약속을 잊어버렸어."
        }
      },
      {
        "text": "Я, если честно, не знаю, что ответить.",
        "slot": "не знаю, что ответить",
        "cue": {
          "en": "not know what to answer",
          "ko": "뭐라고 답할지 모르다"
        },
        "gloss": {
          "en": "To be honest, I don't know what to say.",
          "ko": "솔직히 뭐라고 답해야 할지 모르겠어요."
        }
      },
      {
        "text": "Если честно, этот план мне кажется рискованным.",
        "slot": "этот план мне кажется рискованным",
        "cue": {
          "en": "this plan seems risky to me",
          "ko": "이 계획이 위험해 보인다"
        },
        "gloss": {
          "en": "To be honest, this plan seems risky to me.",
          "ko": "솔직히 이 계획은 위험해 보여요."
        }
      }
    ]
  },
  {
    "id": "ru-f5-01",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Ты ведь ___.",
    "core": [
      "ведь"
    ],
    "meaning": {
      "en": "Reminding with a soft emphasis: After all, ___.",
      "ko": "부드럽게 상기시키기: ___잖아."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ты ведь обещал прийти.",
        "slot": "обещал прийти",
        "cue": {
          "en": "promise to come",
          "ko": "오겠다고 약속하다"
        },
        "gloss": {
          "en": "You did promise to come, didn't you.",
          "ko": "너 오겠다고 약속했잖아."
        }
      },
      {
        "text": "Не переживай, это ведь не экзамен.",
        "slot": "не экзамен",
        "cue": {
          "en": "not an exam",
          "ko": "시험이 아니다"
        },
        "gloss": {
          "en": "Don't worry, it's not an exam, after all.",
          "ko": "걱정 마, 시험도 아니잖아."
        }
      },
      {
        "text": "Возьми зонт, ведь обещали дождь.",
        "slot": "обещали дождь",
        "cue": {
          "en": "rain is forecast",
          "ko": "비 예보가 있다"
        },
        "gloss": {
          "en": "Take an umbrella, they did forecast rain.",
          "ko": "우산 챙겨, 비 온다고 했잖아."
        }
      },
      {
        "text": "Мы ведь уже это обсуждали.",
        "slot": "уже это обсуждали",
        "cue": {
          "en": "have already discussed this",
          "ko": "이미 이걸 논의했다"
        },
        "gloss": {
          "en": "We've already discussed this, haven't we.",
          "ko": "우리 이거 벌써 얘기했잖아."
        }
      }
    ]
  },
  {
    "id": "ru-f5-02",
    "stage": 5,
    "fn": "clarify",
    "pattern": "Я же не говорю, что ___.",
    "core": [
      "Я же не говорю",
      "я же не говорю"
    ],
    "meaning": {
      "en": "Heading off a misunderstanding: I'm not saying ___.",
      "ko": "오해 막기: ___라는 말은 아니잖아."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Я же не говорю, что ты виноват.",
        "slot": "что ты виноват",
        "cue": {
          "en": "you're to blame",
          "ko": "네 잘못이다"
        },
        "gloss": {
          "en": "I'm not saying it's your fault.",
          "ko": "네 잘못이라는 말은 아니잖아."
        }
      },
      {
        "text": "Я же не говорю, что это плохая идея.",
        "slot": "что это плохая идея",
        "cue": {
          "en": "it's a bad idea",
          "ko": "나쁜 생각이다"
        },
        "gloss": {
          "en": "I'm not saying it's a bad idea.",
          "ko": "나쁜 생각이라는 말은 아니잖아."
        }
      },
      {
        "text": "Да я же не говорю, что надо всё бросить.",
        "slot": "что надо всё бросить",
        "cue": {
          "en": "we should drop everything",
          "ko": "다 그만둬야 한다"
        },
        "gloss": {
          "en": "I'm not saying we should drop everything.",
          "ko": "다 그만두자는 말은 아니잖아."
        }
      },
      {
        "text": "Я же не говорю, что мне не понравилось.",
        "slot": "что мне не понравилось",
        "cue": {
          "en": "I didn't like it",
          "ko": "마음에 안 들었다"
        },
        "gloss": {
          "en": "I'm not saying I didn't like it.",
          "ko": "마음에 안 들었다는 말은 아니잖아."
        }
      }
    ]
  },
  {
    "id": "ru-f5-03",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Давай-ка ___.",
    "core": [
      "Давай-ка",
      "давай-ка"
    ],
    "meaning": {
      "en": "Suggesting in a friendly, softened way: Come on, let's ___.",
      "ko": "다정하게 권하기: 자, ___하자."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Давай-ка сделаем перерыв.",
        "slot": "сделаем перерыв",
        "cue": {
          "en": "take a break",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "Come on, let's take a break.",
          "ko": "자, 좀 쉬자."
        }
      },
      {
        "text": "Давай-ка я тебе помогу.",
        "slot": "я тебе помогу",
        "cue": {
          "en": "I'll help you",
          "ko": "내가 너를 돕다"
        },
        "gloss": {
          "en": "Here, let me help you.",
          "ko": "자, 내가 도와줄게."
        }
      },
      {
        "text": "Ну, давай-ка посмотрим, что тут у нас.",
        "slot": "посмотрим, что тут у нас",
        "cue": {
          "en": "see what we've got here",
          "ko": "여기 뭐가 있는지 보다"
        },
        "gloss": {
          "en": "Well, let's see what we've got here.",
          "ko": "자, 여기 뭐가 있나 볼까."
        }
      },
      {
        "text": "Давай-ка без спешки.",
        "slot": "без спешки",
        "cue": {
          "en": "without rushing",
          "ko": "서두르지 않고"
        },
        "gloss": {
          "en": "Let's not rush, okay?",
          "ko": "자, 서두르지 말자."
        }
      }
    ]
  },
  {
    "id": "ru-f5-04",
    "stage": 5,
    "fn": "feel",
    "pattern": "Что-то мне не ___.",
    "core": [
      "Что-то мне не",
      "что-то мне не"
    ],
    "meaning": {
      "en": "Saying you can't seem to: I just can't seem to ___.",
      "ko": "왠지 잘 안 된다고 말하기: 왠지 ___이 잘 안 돼."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Что-то мне не спится.",
        "slot": "спится",
        "cue": {
          "en": "sleep",
          "ko": "잠자다"
        },
        "gloss": {
          "en": "I just can't seem to sleep.",
          "ko": "왠지 잠이 안 와."
        }
      },
      {
        "text": "Что-то мне не работается сегодня.",
        "slot": "работается",
        "cue": {
          "en": "work",
          "ko": "일하다"
        },
        "gloss": {
          "en": "I just can't get any work done today.",
          "ko": "오늘은 왠지 일이 손에 안 잡혀."
        }
      },
      {
        "text": "Что-то мне не читается в последнее время.",
        "slot": "читается",
        "cue": {
          "en": "read",
          "ko": "읽다"
        },
        "gloss": {
          "en": "Somehow I can't get into reading lately.",
          "ko": "요즘 왠지 책이 안 읽혀."
        }
      },
      {
        "text": "Что-то мне не сидится дома.",
        "slot": "сидится",
        "cue": {
          "en": "stay put",
          "ko": "가만히 있다"
        },
        "gloss": {
          "en": "Somehow I can't stay put at home.",
          "ko": "왠지 집에 가만히 못 있겠어."
        }
      }
    ]
  },
  {
    "id": "ru-f5-05",
    "stage": 5,
    "fn": "wish",
    "pattern": "Вот бы ___!",
    "core": [
      "Вот бы",
      "вот бы"
    ],
    "meaning": {
      "en": "Daydreaming aloud: If only ___!",
      "ko": "바람 말하기: ___면 좋겠다!"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Вот бы сейчас в отпуск!",
        "slot": "сейчас в отпуск",
        "cue": {
          "en": "be on holiday now",
          "ko": "지금 휴가 가다"
        },
        "gloss": {
          "en": "If only I could be on holiday right now!",
          "ko": "지금 휴가 가면 좋겠다!"
        }
      },
      {
        "text": "Вот бы выиграть в лотерею!",
        "slot": "выиграть в лотерею",
        "cue": {
          "en": "win the lottery",
          "ko": "복권에 당첨되다"
        },
        "gloss": {
          "en": "If only I could win the lottery!",
          "ko": "복권 당첨되면 좋겠다!"
        }
      },
      {
        "text": "Ах, вот бы снег пошёл!",
        "slot": "снег пошёл",
        "cue": {
          "en": "it snows",
          "ko": "눈이 오다"
        },
        "gloss": {
          "en": "Oh, if only it would snow!",
          "ko": "아, 눈 왔으면 좋겠다!"
        }
      },
      {
        "text": "Вот бы он позвонил сегодня!",
        "slot": "он позвонил сегодня",
        "cue": {
          "en": "he calls today",
          "ko": "그가 오늘 전화하다"
        },
        "gloss": {
          "en": "If only he'd call today!",
          "ko": "그 사람이 오늘 전화하면 좋겠다!"
        }
      }
    ]
  },
  {
    "id": "ru-f5-06",
    "stage": 5,
    "fn": "report",
    "pattern": "В связи с ___, …",
    "core": [
      "В связи с",
      "в связи с"
    ],
    "meaning": {
      "en": "Giving a reason in official style: Due to ___, …",
      "ko": "공식체로 이유 말하기: ___로 인해 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "В связи с плохой погодой рейс задерживается.",
        "slot": "плохой погодой",
        "cue": {
          "en": "bad weather",
          "ko": "나쁜 날씨"
        },
        "gloss": {
          "en": "Due to bad weather, the flight is delayed.",
          "ko": "악천후로 인해 항공편이 지연됩니다."
        }
      },
      {
        "text": "В связи с праздником магазин не работает.",
        "slot": "праздником",
        "cue": {
          "en": "the holiday",
          "ko": "명절"
        },
        "gloss": {
          "en": "Due to the holiday, the shop is closed.",
          "ko": "명절로 인해 매장은 쉽니다."
        }
      },
      {
        "text": "Занятия отменены в связи с болезнью преподавателя.",
        "slot": "болезнью преподавателя",
        "cue": {
          "en": "the teacher's illness",
          "ko": "강사의 병"
        },
        "gloss": {
          "en": "Classes are cancelled due to the teacher's illness.",
          "ko": "강사의 병으로 인해 수업이 취소되었습니다."
        }
      },
      {
        "text": "В связи с переездом офиса мы временно не принимаем посетителей.",
        "slot": "переездом офиса",
        "cue": {
          "en": "the office move",
          "ko": "사무실 이전"
        },
        "gloss": {
          "en": "Due to the office move, we are temporarily not receiving visitors.",
          "ko": "사무실 이전으로 인해 당분간 방문객을 받지 않습니다."
        }
      }
    ]
  },
  {
    "id": "ru-f5-07",
    "stage": 5,
    "fn": "report",
    "pattern": "В целях ___ …",
    "core": [
      "В целях",
      "в целях"
    ],
    "meaning": {
      "en": "Stating a purpose in official style: For the purpose of ___, …",
      "ko": "공식체로 목적 말하기: ___을 위하여 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "В целях безопасности двери закрываются в десять вечера.",
        "slot": "безопасности",
        "cue": {
          "en": "safety",
          "ko": "안전"
        },
        "gloss": {
          "en": "For safety reasons, the doors are locked at ten p.m.",
          "ko": "안전을 위하여 문은 밤 열 시에 닫힙니다."
        }
      },
      {
        "text": "В целях экономии свет в коридоре выключают.",
        "slot": "экономии",
        "cue": {
          "en": "saving money",
          "ko": "절약"
        },
        "gloss": {
          "en": "To save money, the corridor lights are switched off.",
          "ko": "절약을 위하여 복도 불을 끕니다."
        }
      },
      {
        "text": "Камеры установлены в целях охраны порядка.",
        "slot": "охраны порядка",
        "cue": {
          "en": "keeping order",
          "ko": "질서 유지"
        },
        "gloss": {
          "en": "Cameras have been installed to keep order.",
          "ko": "질서 유지를 위하여 카메라가 설치되었습니다."
        }
      },
      {
        "text": "В целях защиты данных пароль нужно менять каждый месяц.",
        "slot": "защиты данных",
        "cue": {
          "en": "data protection",
          "ko": "정보 보호"
        },
        "gloss": {
          "en": "For data protection, the password must be changed every month.",
          "ko": "정보 보호를 위하여 비밀번호를 매달 바꿔야 합니다."
        }
      }
    ]
  },
  {
    "id": "ru-f5-08",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "Оплата осуществляется ___.",
    "core": [
      "осуществляется",
      "осуществляются"
    ],
    "meaning": {
      "en": "Describing procedure in official style: Payment is made ___.",
      "ko": "공식체로 절차 설명하기: 결제는 ___ 이루어집니다."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Оплата осуществляется только картой.",
        "slot": "только картой",
        "cue": {
          "en": "by card only",
          "ko": "카드로만"
        },
        "gloss": {
          "en": "Payment is by card only.",
          "ko": "결제는 카드로만 가능합니다."
        }
      },
      {
        "text": "Доставка осуществляется в течение недели.",
        "slot": "в течение недели",
        "cue": {
          "en": "within a week",
          "ko": "일주일 안에"
        },
        "gloss": {
          "en": "Delivery is made within a week.",
          "ko": "배송은 일주일 안에 이루어집니다."
        }
      },
      {
        "text": "Работы осуществляются с понедельника по пятницу.",
        "slot": "с понедельника по пятницу",
        "cue": {
          "en": "from Monday to Friday",
          "ko": "월요일부터 금요일까지"
        },
        "gloss": {
          "en": "The work is carried out Monday to Friday.",
          "ko": "작업은 월요일부터 금요일까지 진행됩니다."
        }
      },
      {
        "text": "Приём документов осуществляется по записи.",
        "slot": "по записи",
        "cue": {
          "en": "by appointment",
          "ko": "예약제로"
        },
        "gloss": {
          "en": "Documents are accepted by appointment.",
          "ko": "서류 접수는 예약제로 진행됩니다."
        }
      }
    ]
  },
  {
    "id": "ru-f5-09",
    "stage": 5,
    "fn": "request-action",
    "pattern": "Подожди минутку, ___.",
    "core": [
      "минутку"
    ],
    "meaning": {
      "en": "Asking for a moment warmly: Just a minute, ___.",
      "ko": "다정하게 잠깐 기다려 달라고 하기: 잠깐만, ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Подожди минутку, я сейчас вернусь.",
        "slot": "я сейчас вернусь",
        "cue": {
          "en": "I'll be right back",
          "ko": "금방 돌아오다"
        },
        "gloss": {
          "en": "Wait a sec, I'll be right back.",
          "ko": "잠깐만, 금방 올게."
        }
      },
      {
        "text": "Подождите минутку, я найду ваш заказ.",
        "slot": "я найду ваш заказ",
        "cue": {
          "en": "I'll find your order",
          "ko": "주문을 찾다"
        },
        "gloss": {
          "en": "Just a moment, I'll find your order.",
          "ko": "잠시만요, 주문 찾아 드릴게요."
        }
      },
      {
        "text": "Подожди минутку, у меня звонок.",
        "slot": "у меня звонок",
        "cue": {
          "en": "I have a call",
          "ko": "전화가 왔다"
        },
        "gloss": {
          "en": "Hang on a sec, I've got a call.",
          "ko": "잠깐만, 전화 왔어."
        }
      },
      {
        "text": "Посиди минутку, чайник уже кипит.",
        "slot": "чайник уже кипит",
        "cue": {
          "en": "the kettle is already boiling",
          "ko": "주전자 물이 벌써 끓다"
        },
        "gloss": {
          "en": "Sit for a minute, the kettle's already boiling.",
          "ko": "잠깐 앉아 있어, 물 벌써 끓어."
        }
      }
    ]
  },
  {
    "id": "ru-f5-10",
    "stage": 5,
    "fn": "concession",
    "pattern": "___, а вот …",
    "core": [
      "а вот"
    ],
    "meaning": {
      "en": "Contrasting with emphasis: ___, but as for …",
      "ko": "대조하며 강조하기: ___, 그런데 …은"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Машина-то у меня есть, а вот прав нет.",
        "slot": "Машина-то у меня есть",
        "cue": {
          "en": "I do have a car",
          "ko": "차는 있다"
        },
        "gloss": {
          "en": "I do have a car, but no licence.",
          "ko": "차는 있는데 면허가 없어."
        }
      },
      {
        "text": "Работа интересная, а вот зарплата маленькая.",
        "slot": "Работа интересная",
        "cue": {
          "en": "the job is interesting",
          "ko": "일이 재미있다"
        },
        "gloss": {
          "en": "The job is interesting, but the pay is low.",
          "ko": "일은 재미있는데 월급이 적어."
        }
      },
      {
        "text": "Время-то есть, а вот желания нет.",
        "slot": "Время-то есть",
        "cue": {
          "en": "there is time",
          "ko": "시간은 있다"
        },
        "gloss": {
          "en": "There's time, all right, but no desire.",
          "ko": "시간은 있는데 하고 싶지가 않아."
        }
      },
      {
        "text": "Английский я понимаю, а вот говорю с трудом.",
        "slot": "Английский я понимаю",
        "cue": {
          "en": "I understand English",
          "ko": "영어는 알아듣는다"
        },
        "gloss": {
          "en": "English I understand, but speaking is hard.",
          "ko": "영어는 알아듣는데 말하기가 힘들어."
        }
      }
    ]
  },
  {
    "id": "ru-f5-11",
    "stage": 5,
    "fn": "regret-light",
    "pattern": "___ я так и не …",
    "core": [
      "так и не"
    ],
    "meaning": {
      "en": "Saying something never got done: I never did ___.",
      "ko": "끝내 못 한 일 말하기: ___은 끝내 못 했어."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Фильм этот я так и не посмотрел.",
        "slot": "Фильм этот",
        "cue": {
          "en": "this film",
          "ko": "이 영화"
        },
        "gloss": {
          "en": "I never did get round to watching this film.",
          "ko": "이 영화는 끝내 못 봤어."
        }
      },
      {
        "text": "Письмо он так и не отправил.",
        "slot": "Письмо",
        "cue": {
          "en": "the letter",
          "ko": "편지"
        },
        "gloss": {
          "en": "He never did send the letter.",
          "ko": "편지는 그가 끝내 안 보냈어."
        }
      },
      {
        "text": "Ответа мы так и не получили.",
        "slot": "Ответа",
        "cue": {
          "en": "a reply",
          "ko": "답장"
        },
        "gloss": {
          "en": "We never did get a reply.",
          "ko": "답은 끝내 못 받았어요."
        }
      },
      {
        "text": "Ключи она так и не нашла.",
        "slot": "Ключи",
        "cue": {
          "en": "the keys",
          "ko": "열쇠"
        },
        "gloss": {
          "en": "She never did find the keys.",
          "ko": "열쇠는 그녀가 끝내 못 찾았어."
        }
      }
    ]
  },
  {
    "id": "ru-f5-12",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "Ещё бы! ___",
    "core": [
      "Ещё бы",
      "ещё бы"
    ],
    "meaning": {
      "en": "Reacting with \"of course\": You bet! ___",
      "ko": "당연하다고 반응하기: 당연하지! ___"
    },
    "grammar": [],
    "expressions": [
      "Ещё бы"
    ],
    "examples": [
      {
        "text": "Ещё бы! Я этого целый год ждал.",
        "slot": "Я этого целый год ждал",
        "cue": {
          "en": "I waited a whole year for this",
          "ko": "이걸 일 년 내내 기다렸다"
        },
        "gloss": {
          "en": "You bet! I waited a whole year for this.",
          "ko": "당연하지! 이거 일 년 내내 기다렸어."
        }
      },
      {
        "text": "Ещё бы, весь день на ногах!",
        "slot": "весь день на ногах",
        "cue": {
          "en": "on my feet all day",
          "ko": "하루 종일 서 있다"
        },
        "gloss": {
          "en": "No wonder, I've been on my feet all day!",
          "ko": "당연하지, 하루 종일 서 있었는데!"
        }
      },
      {
        "text": "Ещё бы он не обиделся после таких слов!",
        "slot": "он не обиделся после таких слов",
        "cue": {
          "en": "he'd be hurt after such words",
          "ko": "그런 말 듣고 서운해하다"
        },
        "gloss": {
          "en": "Of course he was hurt after words like that!",
          "ko": "그런 말을 들었으니 서운할 만하지!"
        }
      },
      {
        "text": "Ещё бы! Такой торт кто угодно съест.",
        "slot": "Такой торт кто угодно съест",
        "cue": {
          "en": "anyone would eat a cake like that",
          "ko": "그런 케이크면 누구든 먹는다"
        },
        "gloss": {
          "en": "Of course! Anyone would eat a cake like that.",
          "ko": "당연하지! 그런 케이크면 누구라도 먹지."
        }
      }
    ]
  },
  {
    "id": "ru-f5-13",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Руки не доходят ___.",
    "core": [
      "Руки не доходят",
      "руки не доходят"
    ],
    "meaning": {
      "en": "Saying you never get round to it: I never get round to ___.",
      "ko": "손이 안 간다고 말하기: ___까지는 손이 안 가."
    },
    "grammar": [],
    "expressions": [
      "Руки не доходят"
    ],
    "examples": [
      {
        "text": "Руки не доходят разобрать шкаф.",
        "slot": "разобрать шкаф",
        "cue": {
          "en": "sort out the wardrobe",
          "ko": "옷장을 정리하다"
        },
        "gloss": {
          "en": "I never get round to sorting out the wardrobe.",
          "ko": "옷장 정리까지는 손이 안 가."
        }
      },
      {
        "text": "Всё руки не доходят до ремонта.",
        "slot": "до ремонта",
        "cue": {
          "en": "to the renovation",
          "ko": "수리까지"
        },
        "gloss": {
          "en": "I still haven't got round to the renovation.",
          "ko": "수리까지는 영 손이 안 가."
        }
      },
      {
        "text": "Хочу записаться в бассейн, но руки не доходят.",
        "slot": "Хочу записаться в бассейн",
        "cue": {
          "en": "want to sign up for the pool",
          "ko": "수영장에 등록하고 싶다"
        },
        "gloss": {
          "en": "I want to sign up for the pool, but I never get round to it.",
          "ko": "수영장 등록하고 싶은데 손이 안 가."
        }
      },
      {
        "text": "Руки не доходят ответить на все письма.",
        "slot": "ответить на все письма",
        "cue": {
          "en": "answer all the emails",
          "ko": "모든 메일에 답하다"
        },
        "gloss": {
          "en": "I never get round to answering all the emails.",
          "ko": "메일에 다 답장할 짬이 안 나."
        }
      }
    ]
  },
  {
    "id": "ru-f5-14",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Мне не до ___.",
    "core": [
      "Мне не до",
      "мне не до"
    ],
    "meaning": {
      "en": "Saying you have no head for something now: I'm in no mood for ___.",
      "ko": "지금은 그럴 여유가 없다고 하기: ___할 때가 아니야."
    },
    "grammar": [],
    "expressions": [
      "Мне не до этого"
    ],
    "examples": [
      {
        "text": "Мне не до шуток.",
        "slot": "шуток",
        "cue": {
          "en": "jokes",
          "ko": "농담"
        },
        "gloss": {
          "en": "I'm in no mood for jokes.",
          "ko": "지금 농담할 기분 아니야."
        }
      },
      {
        "text": "Извини, мне не до кино сейчас.",
        "slot": "кино",
        "cue": {
          "en": "the cinema",
          "ko": "영화"
        },
        "gloss": {
          "en": "Sorry, I can't think about the cinema right now.",
          "ko": "미안, 지금 영화 볼 여유가 없어."
        }
      },
      {
        "text": "Мне не до этого, у меня экзамены.",
        "slot": "этого",
        "cue": {
          "en": "that",
          "ko": "그것"
        },
        "gloss": {
          "en": "I've no time for that, I have exams.",
          "ko": "그럴 여유 없어, 시험 기간이야."
        }
      },
      {
        "text": "Мне не до отдыха, работы много.",
        "slot": "отдыха",
        "cue": {
          "en": "rest",
          "ko": "휴식"
        },
        "gloss": {
          "en": "I can't think about resting, there's too much work.",
          "ko": "쉴 때가 아니야, 일이 많아."
        }
      }
    ]
  },
  {
    "id": "ru-f5-15",
    "stage": 5,
    "fn": "concede",
    "pattern": "Так и быть, ___.",
    "core": [
      "Так и быть",
      "так и быть"
    ],
    "meaning": {
      "en": "Giving in graciously: Oh, all right, ___.",
      "ko": "못 이기는 척 들어주기: 그래, 좋아, ___."
    },
    "grammar": [],
    "expressions": [
      "Так и быть"
    ],
    "examples": [
      {
        "text": "Так и быть, возьму тебя с собой.",
        "slot": "возьму тебя с собой",
        "cue": {
          "en": "I'll take you with me",
          "ko": "너를 데려가다"
        },
        "gloss": {
          "en": "Oh, all right, I'll take you with me.",
          "ko": "그래, 좋아, 데려가 줄게."
        }
      },
      {
        "text": "Ладно, так и быть: сегодня посуду мою я.",
        "slot": "сегодня посуду мою я",
        "cue": {
          "en": "I'll do the dishes today",
          "ko": "오늘 설거지는 내가 한다"
        },
        "gloss": {
          "en": "Fine, all right: I'll do the dishes today.",
          "ko": "알았어, 좋아. 오늘 설거지는 내가 할게."
        }
      },
      {
        "text": "Так и быть, дам вам ещё один день.",
        "slot": "дам вам ещё один день",
        "cue": {
          "en": "I'll give you one more day",
          "ko": "하루 더 주다"
        },
        "gloss": {
          "en": "All right, I'll give you one more day.",
          "ko": "좋아요, 하루 더 드리죠."
        }
      },
      {
        "text": "Так и быть, прощаю.",
        "slot": "прощаю",
        "cue": {
          "en": "I forgive you",
          "ko": "용서하다"
        },
        "gloss": {
          "en": "Oh, all right, you're forgiven.",
          "ko": "그래, 용서해 줄게."
        }
      }
    ]
  },
  {
    "id": "ru-f5-16",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "Как говорится, ___.",
    "core": [
      "Как говорится",
      "как говорится"
    ],
    "meaning": {
      "en": "Bringing in a saying: As they say, ___.",
      "ko": "속담 끌어오기: 말하자면 ___라잖아."
    },
    "grammar": [],
    "expressions": [
      "Как говорится"
    ],
    "examples": [
      {
        "text": "Как говорится, лучше поздно, чем никогда.",
        "slot": "лучше поздно, чем никогда",
        "cue": {
          "en": "better late than never",
          "ko": "늦어도 안 하는 것보다 낫다"
        },
        "gloss": {
          "en": "As they say, better late than never.",
          "ko": "늦어도 안 하는 것보단 낫다잖아."
        }
      },
      {
        "text": "Как говорится, на вкус и цвет товарищей нет.",
        "slot": "на вкус и цвет товарищей нет",
        "cue": {
          "en": "tastes differ",
          "ko": "취향은 제각각이다"
        },
        "gloss": {
          "en": "As they say, there's no accounting for taste.",
          "ko": "취향은 제각각이라잖아."
        }
      },
      {
        "text": "Ну что ж, как говорится, утро вечера мудренее.",
        "slot": "утро вечера мудренее",
        "cue": {
          "en": "sleep on it",
          "ko": "하룻밤 자고 생각하자"
        },
        "gloss": {
          "en": "Well, as they say, the morning is wiser than the evening.",
          "ko": "뭐, 하룻밤 자고 나면 생각이 정리된다잖아."
        }
      },
      {
        "text": "Как говорится, без труда не выловишь и рыбку из пруда.",
        "slot": "без труда не выловишь и рыбку из пруда",
        "cue": {
          "en": "no pain, no gain",
          "ko": "노력 없이는 얻는 게 없다"
        },
        "gloss": {
          "en": "As they say, no pain, no gain.",
          "ko": "노력 없이는 얻는 게 없다잖아."
        }
      }
    ]
  },
  {
    "id": "ru-f5-17",
    "stage": 5,
    "fn": "debate",
    "pattern": "Не в этом дело. ___",
    "core": [
      "Не в этом дело",
      "не в этом дело"
    ],
    "meaning": {
      "en": "Shifting to the real point: That's not the point. ___",
      "ko": "핵심 바로잡기: 그게 문제가 아니야. ___"
    },
    "grammar": [],
    "expressions": [
      "Не в этом дело"
    ],
    "examples": [
      {
        "text": "Не в этом дело. Просто я устал.",
        "slot": "Просто я устал",
        "cue": {
          "en": "I'm just tired",
          "ko": "그냥 피곤하다"
        },
        "gloss": {
          "en": "That's not the point. I'm just tired.",
          "ko": "그게 문제가 아니야. 그냥 피곤해."
        }
      },
      {
        "text": "Деньги тут ни при чём, не в этом дело.",
        "slot": "Деньги тут ни при чём",
        "cue": {
          "en": "money has nothing to do with it",
          "ko": "돈은 상관없다"
        },
        "gloss": {
          "en": "Money has nothing to do with it, that's not the point.",
          "ko": "돈은 상관없어, 그게 문제가 아니야."
        }
      },
      {
        "text": "Не в этом дело: главное — что он не предупредил.",
        "slot": "главное — что он не предупредил",
        "cue": {
          "en": "the main thing is he didn't warn us",
          "ko": "중요한 건 그가 미리 말 안 한 것"
        },
        "gloss": {
          "en": "That's not the point: the main thing is he didn't warn us.",
          "ko": "그게 문제가 아니라, 중요한 건 미리 말을 안 했다는 거야."
        }
      },
      {
        "text": "Да не в этом дело, я просто хочу понять, что случилось.",
        "slot": "я просто хочу понять, что случилось",
        "cue": {
          "en": "I just want to understand what happened",
          "ko": "무슨 일인지 이해하고 싶다"
        },
        "gloss": {
          "en": "That's not it, I just want to understand what happened.",
          "ko": "그게 아니라, 무슨 일이 있었는지 알고 싶을 뿐이야."
        }
      }
    ]
  },
  {
    "id": "ru-f5-18",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "Не берите в голову, ___.",
    "core": [
      "Не берите в голову",
      "не берите в голову"
    ],
    "meaning": {
      "en": "Reassuring someone politely: Don't worry about it, ___.",
      "ko": "정중하게 안심시키기: 마음 쓰지 마세요, ___."
    },
    "grammar": [],
    "expressions": [
      "Не берите в голову"
    ],
    "examples": [
      {
        "text": "Не берите в голову, всё уже решено.",
        "slot": "всё уже решено",
        "cue": {
          "en": "everything is already settled",
          "ko": "다 이미 해결됐다"
        },
        "gloss": {
          "en": "Don't worry about it, it's all settled.",
          "ko": "마음 쓰지 마세요, 다 해결됐어요."
        }
      },
      {
        "text": "Не берите в голову, с кем не бывает.",
        "slot": "с кем не бывает",
        "cue": {
          "en": "it happens to everyone",
          "ko": "누구에게나 있는 일이다"
        },
        "gloss": {
          "en": "Don't worry about it, it happens to everyone.",
          "ko": "신경 쓰지 마세요, 누구나 그럴 수 있죠."
        }
      },
      {
        "text": "Не берите в голову, это мелочь.",
        "slot": "это мелочь",
        "cue": {
          "en": "it's a trifle",
          "ko": "사소한 일이다"
        },
        "gloss": {
          "en": "Don't give it a thought, it's nothing.",
          "ko": "마음 쓰지 마세요, 별일 아니에요."
        }
      },
      {
        "text": "Да не берите в голову, мы сами всё уберём.",
        "slot": "мы сами всё уберём",
        "cue": {
          "en": "we'll clean up ourselves",
          "ko": "우리가 다 치우겠다"
        },
        "gloss": {
          "en": "Oh, don't worry about it, we'll clean everything up ourselves.",
          "ko": "신경 쓰지 마세요, 저희가 다 치울게요."
        }
      }
    ]
  },
  {
    "id": "ru-f5-19",
    "stage": 5,
    "fn": "change-topic",
    "pattern": "Я тут подумал: ___.",
    "core": [
      "Я тут подумал",
      "я тут подумал",
      "Я тут подумала",
      "я тут подумала"
    ],
    "meaning": {
      "en": "Floating a new idea: I've been thinking: ___.",
      "ko": "새 생각 꺼내기: 나 생각해 봤는데, ___."
    },
    "grammar": [],
    "expressions": [
      "Я тут подумал"
    ],
    "examples": [
      {
        "text": "Я тут подумал: может, поедем на выходные за город?",
        "slot": "может, поедем на выходные за город",
        "cue": {
          "en": "go out of town for the weekend",
          "ko": "주말에 교외로 가다"
        },
        "gloss": {
          "en": "I've been thinking: shall we go out of town for the weekend?",
          "ko": "생각해 봤는데, 주말에 교외로 갈까?"
        }
      },
      {
        "text": "Я тут подумала, что нам пора сделать ремонт.",
        "slot": "что нам пора сделать ремонт",
        "cue": {
          "en": "it's time we renovated",
          "ko": "수리할 때가 됐다"
        },
        "gloss": {
          "en": "I've been thinking it's time we did some renovating.",
          "ko": "생각해 봤는데 이제 집 수리할 때가 된 것 같아."
        }
      },
      {
        "text": "Слушай, я тут подумал: давай пригласим родителей.",
        "slot": "давай пригласим родителей",
        "cue": {
          "en": "let's invite our parents",
          "ko": "부모님을 초대하자"
        },
        "gloss": {
          "en": "Listen, I've been thinking: let's invite our parents.",
          "ko": "있잖아, 생각해 봤는데 부모님 초대하자."
        }
      },
      {
        "text": "Я тут подумала: а зачем нам вторая машина?",
        "slot": "а зачем нам вторая машина",
        "cue": {
          "en": "why do we need a second car",
          "ko": "차가 두 대 왜 필요하냐"
        },
        "gloss": {
          "en": "I've been thinking: why do we need a second car?",
          "ko": "생각해 봤는데, 차가 두 대나 왜 필요해?"
        }
      }
    ]
  },
  {
    "id": "ru-f5-20",
    "stage": 5,
    "fn": "concede",
    "pattern": "Делать нечего, ___.",
    "core": [
      "Делать нечего",
      "делать нечего"
    ],
    "meaning": {
      "en": "Accepting what can't be helped: Nothing for it, ___.",
      "ko": "어쩔 수 없다고 받아들이기: 어쩔 수 없지, ___."
    },
    "grammar": [],
    "expressions": [
      "Делать нечего"
    ],
    "examples": [
      {
        "text": "Делать нечего, придётся идти пешком.",
        "slot": "придётся идти пешком",
        "cue": {
          "en": "we'll have to walk",
          "ko": "걸어가야 한다"
        },
        "gloss": {
          "en": "Nothing for it, we'll have to walk.",
          "ko": "어쩔 수 없지, 걸어가야겠다."
        }
      },
      {
        "text": "Автобус ушёл — делать нечего, ждём следующий.",
        "slot": "ждём следующий",
        "cue": {
          "en": "we wait for the next one",
          "ko": "다음 것을 기다린다"
        },
        "gloss": {
          "en": "The bus has gone — nothing for it, we wait for the next one.",
          "ko": "버스 떠났네. 어쩔 수 없지, 다음 거 기다리자."
        }
      },
      {
        "text": "Делать нечего, будем решать проблему сами.",
        "slot": "будем решать проблему сами",
        "cue": {
          "en": "we'll solve the problem ourselves",
          "ko": "문제를 우리가 직접 해결하다"
        },
        "gloss": {
          "en": "Nothing for it, we'll solve the problem ourselves.",
          "ko": "어쩔 수 없지, 우리가 직접 해결하자."
        }
      },
      {
        "text": "Магазин закрыт. Делать нечего, вернёмся завтра.",
        "slot": "вернёмся завтра",
        "cue": {
          "en": "we'll come back tomorrow",
          "ko": "내일 다시 오다"
        },
        "gloss": {
          "en": "The shop is closed. Nothing for it, we'll come back tomorrow.",
          "ko": "가게가 닫혔네. 어쩔 수 없지, 내일 다시 오자."
        }
      }
    ]
  }
];
