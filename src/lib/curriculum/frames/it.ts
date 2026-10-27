import type { Frame } from "../frames.ts";

/** 이탈리아어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const IT_FRAMES: Frame[] = [
  {
    "id": "it-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Mi chiamo ___.",
    "core": [
      "Mi chiamo",
      "mi chiamo"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "mi chiamo",
      "piacere"
    ],
    "examples": [
      {
        "text": "Mi chiamo Minji.",
        "slot": "Minji",
        "cue": {
          "en": "Minji (your name)",
          "ko": "민지(내 이름)"
        },
        "gloss": {
          "en": "My name is Minji.",
          "ko": "제 이름은 민지예요."
        }
      },
      {
        "text": "Piacere, mi chiamo Luca.",
        "slot": "Luca",
        "cue": {
          "en": "Luca",
          "ko": "루카"
        },
        "gloss": {
          "en": "Nice to meet you, my name is Luca.",
          "ko": "반가워요, 저는 루카예요."
        }
      },
      {
        "text": "Mi chiamo Anna Rossi.",
        "slot": "Anna Rossi",
        "cue": {
          "en": "Anna Rossi (full name)",
          "ko": "안나 로시(성과 이름)"
        },
        "gloss": {
          "en": "My name is Anna Rossi.",
          "ko": "제 이름은 안나 로시예요."
        }
      },
      {
        "text": "Ciao, mi chiamo Jun. E tu?",
        "slot": "Jun",
        "cue": {
          "en": "Jun",
          "ko": "준"
        },
        "gloss": {
          "en": "Hi, my name is Jun. And you?",
          "ko": "안녕, 나는 준이야. 너는?"
        }
      }
    ]
  },
  {
    "id": "it-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Sono di ___.",
    "core": [
      "Sono di",
      "sono di"
    ],
    "meaning": {
      "en": "Saying which city you are from: I'm from ___.",
      "ko": "출신 도시 말하기: 저는 ___ 출신이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "sono di"
    ],
    "examples": [
      {
        "text": "Sono di Seul.",
        "slot": "Seul",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I'm from Seoul.",
          "ko": "저는 서울 출신이에요."
        }
      },
      {
        "text": "Sono di Busan.",
        "slot": "Busan",
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
        "text": "Sono di Roma, e tu?",
        "slot": "Roma",
        "cue": {
          "en": "Rome",
          "ko": "로마"
        },
        "gloss": {
          "en": "I'm from Rome, and you?",
          "ko": "저는 로마 출신이에요, 당신은요?"
        }
      },
      {
        "text": "Io sono di Milano, lei è di Napoli.",
        "slot": "Milano",
        "cue": {
          "en": "Milan",
          "ko": "밀라노"
        },
        "gloss": {
          "en": "I'm from Milan, she's from Naples.",
          "ko": "저는 밀라노, 그녀는 나폴리 출신이에요."
        }
      }
    ]
  },
  {
    "id": "it-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Sono ___.",
    "core": [
      "Sono",
      "sono"
    ],
    "meaning": {
      "en": "Saying what you are: I'm (a) ___ (no article before jobs).",
      "ko": "신분·국적 말하기: 저는 ___예요(직업 앞엔 관사 없음)."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sono studentessa.",
        "slot": "studentessa",
        "cue": {
          "en": "a student (female)",
          "ko": "학생(여성)"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "Sono coreano.",
        "slot": "coreano",
        "cue": {
          "en": "Korean (male)",
          "ko": "한국 사람(남성)"
        },
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        }
      },
      {
        "text": "Sono insegnante.",
        "slot": "insegnante",
        "cue": {
          "en": "a teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm a teacher.",
          "ko": "저는 선생님이에요."
        }
      },
      {
        "text": "Sono infermiera.",
        "slot": "infermiera",
        "cue": {
          "en": "a nurse (female)",
          "ko": "간호사(여성)"
        },
        "gloss": {
          "en": "I'm a nurse.",
          "ko": "저는 간호사예요."
        }
      }
    ]
  },
  {
    "id": "it-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "Lavoro in ___.",
    "core": [
      "Lavoro in",
      "lavoro in"
    ],
    "meaning": {
      "en": "Saying where you work: I work in ___.",
      "ko": "일하는 곳 말하기: ___에서 일해요."
    },
    "grammar": [
      3,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Lavoro in un ufficio.",
        "slot": "un ufficio",
        "cue": {
          "en": "an office",
          "ko": "사무실"
        },
        "gloss": {
          "en": "I work in an office.",
          "ko": "사무실에서 일해요."
        }
      },
      {
        "text": "Lavoro in una banca.",
        "slot": "una banca",
        "cue": {
          "en": "a bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "I work in a bank.",
          "ko": "은행에서 일해요."
        }
      },
      {
        "text": "Lavoro in un ristorante.",
        "slot": "un ristorante",
        "cue": {
          "en": "a restaurant",
          "ko": "식당"
        },
        "gloss": {
          "en": "I work in a restaurant.",
          "ko": "식당에서 일해요."
        }
      },
      {
        "text": "Lavoro in un ospedale.",
        "slot": "un ospedale",
        "cue": {
          "en": "a hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I work in a hospital.",
          "ko": "병원에서 일해요."
        }
      }
    ]
  },
  {
    "id": "it-f1-05",
    "stage": 1,
    "fn": "live-where",
    "pattern": "Abito a ___.",
    "core": [
      "Abito a",
      "abito a"
    ],
    "meaning": {
      "en": "Saying the city you live in: I live in ___.",
      "ko": "사는 도시 말하기: ___에 살아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Abito a Seul.",
        "slot": "Seul",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I live in Seoul.",
          "ko": "서울에 살아요."
        }
      },
      {
        "text": "Abito a Roma con mia sorella.",
        "slot": "Roma",
        "cue": {
          "en": "Rome",
          "ko": "로마"
        },
        "gloss": {
          "en": "I live in Rome with my sister.",
          "ko": "여동생과 로마에 살아요."
        }
      },
      {
        "text": "Abito a Torino da un anno.",
        "slot": "Torino",
        "cue": {
          "en": "Turin",
          "ko": "토리노"
        },
        "gloss": {
          "en": "I've lived in Turin for a year.",
          "ko": "토리노에 산 지 1년 됐어요."
        }
      },
      {
        "text": "Adesso abito a Firenze.",
        "slot": "Firenze",
        "cue": {
          "en": "Florence",
          "ko": "피렌체"
        },
        "gloss": {
          "en": "Now I live in Florence.",
          "ko": "지금은 피렌체에 살아요."
        }
      }
    ]
  },
  {
    "id": "it-f1-06",
    "stage": 1,
    "fn": "want",
    "pattern": "Vorrei ___, per favore.",
    "core": [
      "Vorrei",
      "vorrei"
    ],
    "meaning": {
      "en": "Asking politely for something: I'd like ___, please.",
      "ko": "정중하게 달라고 하기: ___ 주세요."
    },
    "grammar": [
      7,
      2
    ],
    "expressions": [
      "per favore"
    ],
    "examples": [
      {
        "text": "Vorrei un caffè, per favore.",
        "slot": "un caffè",
        "cue": {
          "en": "a coffee",
          "ko": "커피 한 잔"
        },
        "gloss": {
          "en": "I'd like a coffee, please.",
          "ko": "커피 한 잔 주세요."
        }
      },
      {
        "text": "Vorrei un biglietto per Roma, per favore.",
        "slot": "un biglietto per Roma",
        "cue": {
          "en": "a ticket to Rome",
          "ko": "로마행 표 한 장"
        },
        "gloss": {
          "en": "I'd like a ticket to Rome, please.",
          "ko": "로마행 표 한 장 주세요."
        }
      },
      {
        "text": "Vorrei una bottiglia d'acqua, per favore.",
        "slot": "una bottiglia d'acqua",
        "cue": {
          "en": "a bottle of water",
          "ko": "물 한 병"
        },
        "gloss": {
          "en": "I'd like a bottle of water, please.",
          "ko": "물 한 병 주세요."
        }
      },
      {
        "text": "Vorrei due etti di prosciutto, per favore.",
        "slot": "due etti di prosciutto",
        "cue": {
          "en": "two hundred grams of ham",
          "ko": "햄 200그램"
        },
        "gloss": {
          "en": "I'd like two hundred grams of ham, please.",
          "ko": "햄 200그램 주세요."
        }
      }
    ]
  },
  {
    "id": "it-f1-07",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "Quanto costa ___?",
    "core": [
      "Quanto costa",
      "quanto costa"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      5,
      2
    ],
    "expressions": [
      "quanto costa"
    ],
    "examples": [
      {
        "text": "Quanto costa questa borsa?",
        "slot": "questa borsa",
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
        "text": "Quanto costa il biglietto?",
        "slot": "il biglietto",
        "cue": {
          "en": "the ticket",
          "ko": "표"
        },
        "gloss": {
          "en": "How much is the ticket?",
          "ko": "표가 얼마예요?"
        }
      },
      {
        "text": "Quanto costa un chilo di mele?",
        "slot": "un chilo di mele",
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
        "text": "Quanto costa la camera per una notte?",
        "slot": "la camera per una notte",
        "cue": {
          "en": "the room for one night",
          "ko": "하룻밤 방값"
        },
        "gloss": {
          "en": "How much is the room for one night?",
          "ko": "방 하룻밤에 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-08",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Dov'è ___?",
    "core": [
      "Dov'è",
      "dov'è"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "위치 묻기: ___ 어디예요?"
    },
    "grammar": [
      5,
      2
    ],
    "expressions": [
      "dov'è il bagno",
      "scusi"
    ],
    "examples": [
      {
        "text": "Scusi, dov'è il bagno?",
        "slot": "il bagno",
        "cue": {
          "en": "the bathroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Excuse me, where is the bathroom?",
          "ko": "실례지만, 화장실이 어디예요?"
        }
      },
      {
        "text": "Dov'è la stazione?",
        "slot": "la stazione",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Where is the station?",
          "ko": "역이 어디예요?"
        }
      },
      {
        "text": "Dov'è la fermata dell'autobus?",
        "slot": "la fermata dell'autobus",
        "cue": {
          "en": "the bus stop",
          "ko": "버스 정류장"
        },
        "gloss": {
          "en": "Where is the bus stop?",
          "ko": "버스 정류장이 어디예요?"
        }
      },
      {
        "text": "Dov'è il museo?",
        "slot": "il museo",
        "cue": {
          "en": "the museum",
          "ko": "박물관"
        },
        "gloss": {
          "en": "Where is the museum?",
          "ko": "박물관이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-09",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "C'è ___ qui vicino?",
    "core": [
      "C'è",
      "c'è"
    ],
    "meaning": {
      "en": "Asking if there is something nearby: Is there ___ near here?",
      "ko": "근처에 있는지 묻기: 이 근처에 ___ 있어요?"
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "C'è una farmacia qui vicino?",
        "slot": "una farmacia",
        "cue": {
          "en": "a pharmacy",
          "ko": "약국"
        },
        "gloss": {
          "en": "Is there a pharmacy near here?",
          "ko": "이 근처에 약국 있어요?"
        }
      },
      {
        "text": "C'è un bancomat qui vicino?",
        "slot": "un bancomat",
        "cue": {
          "en": "a cash machine",
          "ko": "현금인출기"
        },
        "gloss": {
          "en": "Is there a cash machine near here?",
          "ko": "이 근처에 현금인출기 있어요?"
        }
      },
      {
        "text": "C'è un supermercato qui vicino?",
        "slot": "un supermercato",
        "cue": {
          "en": "a supermarket",
          "ko": "슈퍼마켓"
        },
        "gloss": {
          "en": "Is there a supermarket near here?",
          "ko": "이 근처에 슈퍼마켓 있어요?"
        }
      },
      {
        "text": "Scusi, c'è una fermata della metro qui vicino?",
        "slot": "una fermata della metro",
        "cue": {
          "en": "a metro stop",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Excuse me, is there a metro stop near here?",
          "ko": "실례지만, 이 근처에 지하철역 있어요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-10",
    "stage": 1,
    "fn": "have",
    "pattern": "Ho ___.",
    "core": [
      "Ho",
      "ho"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: ___ 있어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ho una domanda.",
        "slot": "una domanda",
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
        "text": "Ho due biglietti.",
        "slot": "due biglietti",
        "cue": {
          "en": "two tickets",
          "ko": "표 두 장"
        },
        "gloss": {
          "en": "I have two tickets.",
          "ko": "표가 두 장 있어요."
        }
      },
      {
        "text": "Ho una prenotazione.",
        "slot": "una prenotazione",
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
        "text": "Ho un fratello e una sorella.",
        "slot": "un fratello e una sorella",
        "cue": {
          "en": "a brother and a sister",
          "ko": "남자 형제 하나, 여자 형제 하나"
        },
        "gloss": {
          "en": "I have a brother and a sister.",
          "ko": "형제가 한 명, 자매가 한 명 있어요."
        }
      }
    ]
  },
  {
    "id": "it-f1-11",
    "stage": 1,
    "fn": "cannot",
    "pattern": "Non parlo ___.",
    "core": [
      "Non parlo",
      "non parlo"
    ],
    "meaning": {
      "en": "Saying what language you don't speak (well): I don't speak ___.",
      "ko": "못 하는 말 말하기: ___ 못 해요."
    },
    "grammar": [
      6,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Non parlo bene l'italiano.",
        "slot": "bene l'italiano",
        "cue": {
          "en": "Italian well",
          "ko": "이탈리아어를 잘"
        },
        "gloss": {
          "en": "I don't speak Italian well.",
          "ko": "이탈리아어를 잘 못 해요."
        }
      },
      {
        "text": "Non parlo tedesco.",
        "slot": "tedesco",
        "cue": {
          "en": "German",
          "ko": "독일어"
        },
        "gloss": {
          "en": "I don't speak German.",
          "ko": "독일어는 못 해요."
        }
      },
      {
        "text": "Scusi, non parlo francese.",
        "slot": "francese",
        "cue": {
          "en": "French",
          "ko": "프랑스어"
        },
        "gloss": {
          "en": "Sorry, I don't speak French.",
          "ko": "죄송해요, 프랑스어는 못 해요."
        }
      },
      {
        "text": "Non parlo ancora molto bene.",
        "slot": "ancora molto bene",
        "cue": {
          "en": "very well yet",
          "ko": "아직 아주 잘"
        },
        "gloss": {
          "en": "I don't speak very well yet.",
          "ko": "아직 잘 못 해요."
        }
      }
    ]
  },
  {
    "id": "it-f1-12",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "Scusi, non capisco ___.",
    "core": [
      "Non capisco",
      "non capisco"
    ],
    "meaning": {
      "en": "Saying you don't understand something: Sorry, I don't understand ___.",
      "ko": "모르겠다고 말하기: 죄송해요, ___ 이해가 안 돼요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "scusi",
      "non capisco"
    ],
    "examples": [
      {
        "text": "Scusi, non capisco questa parola.",
        "slot": "questa parola",
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
        "text": "Scusi, non capisco il menù.",
        "slot": "il menù",
        "cue": {
          "en": "the menu",
          "ko": "메뉴"
        },
        "gloss": {
          "en": "Sorry, I don't understand the menu.",
          "ko": "죄송해요, 메뉴를 모르겠어요."
        }
      },
      {
        "text": "Scusi, non capisco la domanda.",
        "slot": "la domanda",
        "cue": {
          "en": "the question",
          "ko": "질문"
        },
        "gloss": {
          "en": "Sorry, I don't understand the question.",
          "ko": "죄송해요, 질문을 못 알아들었어요."
        }
      },
      {
        "text": "Scusi, non capisco bene.",
        "slot": "bene",
        "cue": {
          "en": "well",
          "ko": "잘"
        },
        "gloss": {
          "en": "Sorry, I don't understand well.",
          "ko": "죄송해요, 잘 못 알아듣겠어요."
        }
      }
    ]
  },
  {
    "id": "it-f1-13",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "Può ripetere ___, per favore?",
    "core": [
      "Può ripetere",
      "può ripetere"
    ],
    "meaning": {
      "en": "Asking someone to repeat: Could you repeat ___, please?",
      "ko": "다시 말해 달라고 하기: ___ 다시 말씀해 주시겠어요?"
    },
    "grammar": [],
    "expressions": [
      "può ripetere",
      "per favore"
    ],
    "examples": [
      {
        "text": "Può ripetere il nome, per favore?",
        "slot": "il nome",
        "cue": {
          "en": "the name",
          "ko": "이름"
        },
        "gloss": {
          "en": "Could you repeat the name, please?",
          "ko": "이름을 다시 말씀해 주시겠어요?"
        }
      },
      {
        "text": "Può ripetere il prezzo, per favore?",
        "slot": "il prezzo",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "Could you repeat the price, please?",
          "ko": "가격을 다시 말씀해 주시겠어요?"
        }
      },
      {
        "text": "Può ripetere l'indirizzo, per favore?",
        "slot": "l'indirizzo",
        "cue": {
          "en": "the address",
          "ko": "주소"
        },
        "gloss": {
          "en": "Could you repeat the address, please?",
          "ko": "주소를 다시 말씀해 주시겠어요?"
        }
      },
      {
        "text": "Può ripetere il numero della camera, per favore?",
        "slot": "il numero della camera",
        "cue": {
          "en": "the room number",
          "ko": "방 번호"
        },
        "gloss": {
          "en": "Could you repeat the room number, please?",
          "ko": "방 번호를 다시 말씀해 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-14",
    "stage": 1,
    "fn": "thank",
    "pattern": "Grazie per ___.",
    "core": [
      "Grazie per",
      "grazie per"
    ],
    "meaning": {
      "en": "Thanking for something: Thanks for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "grazie"
    ],
    "examples": [
      {
        "text": "Grazie per l'aiuto.",
        "slot": "l'aiuto",
        "cue": {
          "en": "the help",
          "ko": "도와준 것"
        },
        "gloss": {
          "en": "Thanks for the help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "Grazie per il caffè.",
        "slot": "il caffè",
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
        "text": "Grazie per la pazienza.",
        "slot": "la pazienza",
        "cue": {
          "en": "your patience",
          "ko": "기다려 준 것"
        },
        "gloss": {
          "en": "Thanks for your patience.",
          "ko": "기다려 줘서 고마워요."
        }
      },
      {
        "text": "Grazie per il regalo, è bellissimo!",
        "slot": "il regalo",
        "cue": {
          "en": "the present",
          "ko": "선물"
        },
        "gloss": {
          "en": "Thanks for the present, it's beautiful!",
          "ko": "선물 고마워요, 정말 예뻐요!"
        }
      }
    ]
  },
  {
    "id": "it-f1-15",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "Che cos'è ___?",
    "core": [
      "Che cos'è",
      "che cos'è"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___ 뭐예요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Che cos'è questo?",
        "slot": "questo",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "What is this?",
          "ko": "이건 뭐예요?"
        }
      },
      {
        "text": "Che cos'è la focaccia?",
        "slot": "la focaccia",
        "cue": {
          "en": "focaccia",
          "ko": "포카치아"
        },
        "gloss": {
          "en": "What is focaccia?",
          "ko": "포카치아가 뭐예요?"
        }
      },
      {
        "text": "Scusi, che cos'è un tramezzino?",
        "slot": "un tramezzino",
        "cue": {
          "en": "a tramezzino",
          "ko": "트라메지노"
        },
        "gloss": {
          "en": "Excuse me, what is a tramezzino?",
          "ko": "저기요, 트라메지노가 뭐예요?"
        }
      },
      {
        "text": "Che cos'è la ribollita?",
        "slot": "la ribollita",
        "cue": {
          "en": "ribollita",
          "ko": "리볼리타"
        },
        "gloss": {
          "en": "What is ribollita?",
          "ko": "리볼리타가 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-16",
    "stage": 1,
    "fn": "greet",
    "pattern": "___, a presto!",
    "core": [
      "a presto"
    ],
    "meaning": {
      "en": "Saying goodbye: ___, see you soon!",
      "ko": "헤어질 때 인사: ___, 또 봐요!"
    },
    "grammar": [],
    "expressions": [
      "a presto",
      "ciao",
      "arrivederci"
    ],
    "examples": [
      {
        "text": "Ciao, a presto!",
        "slot": "Ciao",
        "cue": {
          "en": "bye (friendly)",
          "ko": "안녕(친근하게)"
        },
        "gloss": {
          "en": "Bye, see you soon!",
          "ko": "안녕, 또 봐!"
        }
      },
      {
        "text": "Arrivederci, a presto!",
        "slot": "Arrivederci",
        "cue": {
          "en": "goodbye (polite)",
          "ko": "안녕히 계세요(정중하게)"
        },
        "gloss": {
          "en": "Goodbye, see you soon!",
          "ko": "안녕히 계세요, 또 뵐게요!"
        }
      },
      {
        "text": "Grazie di tutto, a presto!",
        "slot": "Grazie di tutto",
        "cue": {
          "en": "thanks for everything",
          "ko": "여러 가지로 고마워요"
        },
        "gloss": {
          "en": "Thanks for everything, see you soon!",
          "ko": "여러모로 고마워요, 또 봐요!"
        }
      },
      {
        "text": "Buona serata, a presto!",
        "slot": "Buona serata",
        "cue": {
          "en": "have a nice evening",
          "ko": "좋은 저녁 보내세요"
        },
        "gloss": {
          "en": "Have a nice evening, see you soon!",
          "ko": "좋은 저녁 보내세요, 또 봐요!"
        }
      }
    ]
  },
  {
    "id": "it-f1-17",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "Come si dice ___ in italiano?",
    "core": [
      "Come si dice",
      "come si dice"
    ],
    "meaning": {
      "en": "Asking how to say a word: How do you say ___ in Italian?",
      "ko": "말 묻기: ___ 이탈리아어로 뭐라고 해요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Come si dice «receipt» in italiano?",
        "slot": "«receipt»",
        "cue": {
          "en": "receipt",
          "ko": "영수증"
        },
        "gloss": {
          "en": "How do you say 'receipt' in Italian?",
          "ko": "'영수증'을 이탈리아어로 뭐라고 해요?"
        }
      },
      {
        "text": "Come si dice «cheers» in italiano?",
        "slot": "«cheers»",
        "cue": {
          "en": "cheers",
          "ko": "건배"
        },
        "gloss": {
          "en": "How do you say 'cheers' in Italian?",
          "ko": "'건배'를 이탈리아어로 뭐라고 해요?"
        }
      },
      {
        "text": "Scusi, come si dice «spoon» in italiano?",
        "slot": "«spoon»",
        "cue": {
          "en": "spoon",
          "ko": "숟가락"
        },
        "gloss": {
          "en": "Excuse me, how do you say 'spoon' in Italian?",
          "ko": "저기요, '숟가락'을 이탈리아어로 뭐라고 해요?"
        }
      },
      {
        "text": "Come si dice questa cosa in italiano?",
        "slot": "questa cosa",
        "cue": {
          "en": "this thing",
          "ko": "이것"
        },
        "gloss": {
          "en": "How do you say this thing in Italian?",
          "ko": "이걸 이탈리아어로 뭐라고 해요?"
        }
      }
    ]
  },
  {
    "id": "it-f1-18",
    "stage": 1,
    "fn": "greet",
    "pattern": "___, signora!",
    "core": [
      "signora"
    ],
    "meaning": {
      "en": "Greeting politely at the right time of day: ___, madam!",
      "ko": "때에 맞게 정중히 인사하기: ___, 부인!"
    },
    "grammar": [],
    "expressions": [
      "buongiorno",
      "buonasera",
      "arrivederci",
      "grazie"
    ],
    "examples": [
      {
        "text": "Buongiorno, signora!",
        "slot": "Buongiorno",
        "cue": {
          "en": "good morning",
          "ko": "아침·낮 인사"
        },
        "gloss": {
          "en": "Good morning, madam!",
          "ko": "안녕하세요(아침·낮)!"
        }
      },
      {
        "text": "Buonasera, signora!",
        "slot": "Buonasera",
        "cue": {
          "en": "good evening",
          "ko": "저녁 인사"
        },
        "gloss": {
          "en": "Good evening, madam!",
          "ko": "안녕하세요(저녁)!"
        }
      },
      {
        "text": "Arrivederci, signora!",
        "slot": "Arrivederci",
        "cue": {
          "en": "goodbye",
          "ko": "헤어질 때"
        },
        "gloss": {
          "en": "Goodbye, madam!",
          "ko": "안녕히 계세요!"
        }
      },
      {
        "text": "Grazie, signora!",
        "slot": "Grazie",
        "cue": {
          "en": "thank you",
          "ko": "고맙다고"
        },
        "gloss": {
          "en": "Thank you, madam!",
          "ko": "감사합니다!"
        }
      }
    ]
  },
  {
    "id": "it-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Ieri ho ___.",
    "core": [
      "Ieri",
      "ieri"
    ],
    "meaning": {
      "en": "Saying what you did yesterday: Yesterday I ___.",
      "ko": "어제 한 일 말하기: 어제 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ieri ho mangiato una pizza con gli amici.",
        "slot": "mangiato una pizza",
        "cue": {
          "en": "ate a pizza",
          "ko": "피자를 먹었다"
        },
        "gloss": {
          "en": "Yesterday I ate a pizza with friends.",
          "ko": "어제 친구들과 피자를 먹었어요."
        }
      },
      {
        "text": "Ieri ho lavorato fino a tardi.",
        "slot": "lavorato fino a tardi",
        "cue": {
          "en": "worked until late",
          "ko": "늦게까지 일했다"
        },
        "gloss": {
          "en": "Yesterday I worked until late.",
          "ko": "어제 늦게까지 일했어요."
        }
      },
      {
        "text": "Ieri ho visto un film italiano.",
        "slot": "visto un film italiano",
        "cue": {
          "en": "watched an Italian film",
          "ko": "이탈리아 영화를 봤다"
        },
        "gloss": {
          "en": "Yesterday I watched an Italian film.",
          "ko": "어제 이탈리아 영화를 봤어요."
        }
      },
      {
        "text": "Ieri sera ho comprato un regalo per mia madre.",
        "slot": "comprato un regalo per mia madre",
        "cue": {
          "en": "bought a present for my mother",
          "ko": "엄마 선물을 샀다"
        },
        "gloss": {
          "en": "Last night I bought a present for my mother.",
          "ko": "어젯밤에 엄마 선물을 샀어요."
        }
      }
    ]
  },
  {
    "id": "it-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Sabato sono andato ___.",
    "core": [
      "sono andat"
    ],
    "meaning": {
      "en": "Saying where you went (essere + agreement): On Saturday I went ___.",
      "ko": "간 곳 말하기(essere, 성·수 일치): 토요일에 ___ 갔어요."
    },
    "grammar": [
      1,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sabato sono andato al mare.",
        "slot": "al mare",
        "cue": {
          "en": "to the seaside",
          "ko": "바다에"
        },
        "gloss": {
          "en": "On Saturday I went to the seaside.",
          "ko": "토요일에 바다에 갔어요."
        }
      },
      {
        "text": "Sabato sono andata al cinema con Giulia.",
        "slot": "al cinema con Giulia",
        "cue": {
          "en": "to the cinema with Giulia (female speaker)",
          "ko": "줄리아와 영화관에(여성 화자)"
        },
        "gloss": {
          "en": "On Saturday I went to the cinema with Giulia.",
          "ko": "토요일에 줄리아와 영화관에 갔어요."
        }
      },
      {
        "text": "Sabato sono andata in montagna.",
        "slot": "in montagna",
        "cue": {
          "en": "to the mountains (female speaker)",
          "ko": "산에(여성 화자)"
        },
        "gloss": {
          "en": "On Saturday I went to the mountains.",
          "ko": "토요일에 산에 갔어요."
        }
      },
      {
        "text": "Sabato sono andato dai miei genitori.",
        "slot": "dai miei genitori",
        "cue": {
          "en": "to my parents' place",
          "ko": "부모님 댁에"
        },
        "gloss": {
          "en": "On Saturday I went to my parents' place.",
          "ko": "토요일에 부모님 댁에 갔어요."
        }
      }
    ]
  },
  {
    "id": "it-f2-03",
    "stage": 2,
    "fn": "routine",
    "pattern": "La mattina mi ___.",
    "core": [
      "La mattina mi",
      "la mattina mi"
    ],
    "meaning": {
      "en": "Describing your morning routine with reflexive verbs: In the morning I ___.",
      "ko": "재귀동사로 아침 일과 말하기: 아침에 저는 ___."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "La mattina mi alzo alle sette.",
        "slot": "alzo alle sette",
        "cue": {
          "en": "get up at seven",
          "ko": "7시에 일어난다"
        },
        "gloss": {
          "en": "In the morning I get up at seven.",
          "ko": "아침에 7시에 일어나요."
        }
      },
      {
        "text": "La mattina mi sveglio presto.",
        "slot": "sveglio presto",
        "cue": {
          "en": "wake up early",
          "ko": "일찍 깬다"
        },
        "gloss": {
          "en": "In the morning I wake up early.",
          "ko": "아침에 일찍 깨요."
        }
      },
      {
        "text": "La mattina mi faccio la doccia.",
        "slot": "faccio la doccia",
        "cue": {
          "en": "have a shower",
          "ko": "샤워한다"
        },
        "gloss": {
          "en": "In the morning I have a shower.",
          "ko": "아침에 샤워해요."
        }
      },
      {
        "text": "La mattina mi preparo in fretta.",
        "slot": "preparo in fretta",
        "cue": {
          "en": "get ready in a hurry",
          "ko": "서둘러 준비한다"
        },
        "gloss": {
          "en": "In the morning I get ready in a hurry.",
          "ko": "아침에 서둘러 준비해요."
        }
      }
    ]
  },
  {
    "id": "it-f2-04",
    "stage": 2,
    "fn": "like",
    "pattern": "Mi piace ___.",
    "core": [
      "Mi piace",
      "mi piace"
    ],
    "meaning": {
      "en": "Saying what you like (one thing or an activity): I like ___.",
      "ko": "좋아하는 것(하나·활동) 말하기: ___ 좋아해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mi piace cucinare.",
        "slot": "cucinare",
        "cue": {
          "en": "cooking",
          "ko": "요리하기"
        },
        "gloss": {
          "en": "I like cooking.",
          "ko": "요리하는 걸 좋아해요."
        }
      },
      {
        "text": "Mi piace molto questa città.",
        "slot": "questa città",
        "cue": {
          "en": "this city",
          "ko": "이 도시"
        },
        "gloss": {
          "en": "I really like this city.",
          "ko": "이 도시가 정말 좋아요."
        }
      },
      {
        "text": "Mi piace il caffè italiano.",
        "slot": "il caffè italiano",
        "cue": {
          "en": "Italian coffee",
          "ko": "이탈리아 커피"
        },
        "gloss": {
          "en": "I like Italian coffee.",
          "ko": "이탈리아 커피를 좋아해요."
        }
      },
      {
        "text": "Mi piace camminare in centro.",
        "slot": "camminare in centro",
        "cue": {
          "en": "walking in the centre",
          "ko": "시내를 걷기"
        },
        "gloss": {
          "en": "I like walking in the centre.",
          "ko": "시내를 걷는 걸 좋아해요."
        }
      }
    ]
  },
  {
    "id": "it-f2-05",
    "stage": 2,
    "fn": "like",
    "pattern": "Mi piacciono ___.",
    "core": [
      "Mi piacciono",
      "mi piacciono"
    ],
    "meaning": {
      "en": "Saying what you like (plural things): I like ___.",
      "ko": "좋아하는 것(여러 개) 말하기: ___ 좋아해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mi piacciono i film italiani.",
        "slot": "i film italiani",
        "cue": {
          "en": "Italian films",
          "ko": "이탈리아 영화"
        },
        "gloss": {
          "en": "I like Italian films.",
          "ko": "이탈리아 영화를 좋아해요."
        }
      },
      {
        "text": "Mi piacciono le serie coreane.",
        "slot": "le serie coreane",
        "cue": {
          "en": "Korean series",
          "ko": "한국 드라마"
        },
        "gloss": {
          "en": "I like Korean series.",
          "ko": "한국 드라마를 좋아해요."
        }
      },
      {
        "text": "Mi piacciono molto i gatti.",
        "slot": "i gatti",
        "cue": {
          "en": "cats",
          "ko": "고양이"
        },
        "gloss": {
          "en": "I really like cats.",
          "ko": "고양이를 아주 좋아해요."
        }
      },
      {
        "text": "Mi piacciono i mercati all'aperto.",
        "slot": "i mercati all'aperto",
        "cue": {
          "en": "open-air markets",
          "ko": "야외 시장"
        },
        "gloss": {
          "en": "I like open-air markets.",
          "ko": "야외 시장을 좋아해요."
        }
      }
    ]
  },
  {
    "id": "it-f2-06",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "Sto ___.",
    "core": [
      "Sto",
      "sto"
    ],
    "meaning": {
      "en": "Saying what you're doing right now: I'm ___ing.",
      "ko": "지금 하는 일 말하기: ___ 하는 중이에요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sto aspettando l'autobus.",
        "slot": "aspettando l'autobus",
        "cue": {
          "en": "waiting for the bus",
          "ko": "버스를 기다리는 중"
        },
        "gloss": {
          "en": "I'm waiting for the bus.",
          "ko": "버스를 기다리는 중이에요."
        }
      },
      {
        "text": "Sto lavorando, ti chiamo dopo.",
        "slot": "lavorando",
        "cue": {
          "en": "working",
          "ko": "일하는 중"
        },
        "gloss": {
          "en": "I'm working, I'll call you later.",
          "ko": "일하는 중이야, 이따 전화할게."
        }
      },
      {
        "text": "Sto arrivando!",
        "slot": "arrivando",
        "cue": {
          "en": "on my way",
          "ko": "가는 중"
        },
        "gloss": {
          "en": "I'm on my way!",
          "ko": "지금 가는 중이야!"
        }
      },
      {
        "text": "Sto cucinando la cena.",
        "slot": "cucinando la cena",
        "cue": {
          "en": "cooking dinner",
          "ko": "저녁을 만드는 중"
        },
        "gloss": {
          "en": "I'm cooking dinner.",
          "ko": "저녁을 만드는 중이에요."
        }
      }
    ]
  },
  {
    "id": "it-f2-07",
    "stage": 2,
    "fn": "permission",
    "pattern": "Posso ___?",
    "core": [
      "Posso",
      "posso"
    ],
    "meaning": {
      "en": "Asking permission: Can I ___?",
      "ko": "허락 구하기: ___ 해도 돼요?"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "posso fare una foto"
    ],
    "examples": [
      {
        "text": "Posso fare una foto?",
        "slot": "fare una foto",
        "cue": {
          "en": "take a photo",
          "ko": "사진 찍기"
        },
        "gloss": {
          "en": "Can I take a photo?",
          "ko": "사진 찍어도 돼요?"
        }
      },
      {
        "text": "Posso sedermi qui?",
        "slot": "sedermi qui",
        "cue": {
          "en": "sit here",
          "ko": "여기 앉기"
        },
        "gloss": {
          "en": "Can I sit here?",
          "ko": "여기 앉아도 돼요?"
        }
      },
      {
        "text": "Posso pagare con la carta?",
        "slot": "pagare con la carta",
        "cue": {
          "en": "pay by card",
          "ko": "카드로 결제하기"
        },
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드로 계산해도 돼요?"
        }
      },
      {
        "text": "Posso aprire la finestra?",
        "slot": "aprire la finestra",
        "cue": {
          "en": "open the window",
          "ko": "창문 열기"
        },
        "gloss": {
          "en": "Can I open the window?",
          "ko": "창문 열어도 돼요?"
        }
      }
    ]
  },
  {
    "id": "it-f2-08",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Puoi ___?",
    "core": [
      "Puoi",
      "puoi"
    ],
    "meaning": {
      "en": "Asking a friend to do something: Can you ___?",
      "ko": "친구에게 부탁하기: ___ 해 줄 수 있어?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Puoi aiutarmi un attimo?",
        "slot": "aiutarmi un attimo",
        "cue": {
          "en": "help me for a moment",
          "ko": "잠깐 도와주기"
        },
        "gloss": {
          "en": "Can you help me for a moment?",
          "ko": "잠깐 도와줄 수 있어?"
        }
      },
      {
        "text": "Puoi parlare più piano?",
        "slot": "parlare più piano",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하기"
        },
        "gloss": {
          "en": "Can you speak more slowly?",
          "ko": "더 천천히 말해 줄 수 있어?"
        }
      },
      {
        "text": "Puoi chiudere la porta?",
        "slot": "chiudere la porta",
        "cue": {
          "en": "close the door",
          "ko": "문 닫기"
        },
        "gloss": {
          "en": "Can you close the door?",
          "ko": "문 좀 닫아 줄래?"
        }
      },
      {
        "text": "Puoi mandarmi l'indirizzo?",
        "slot": "mandarmi l'indirizzo",
        "cue": {
          "en": "send me the address",
          "ko": "주소 보내 주기"
        },
        "gloss": {
          "en": "Can you send me the address?",
          "ko": "주소 보내 줄 수 있어?"
        }
      }
    ]
  },
  {
    "id": "it-f2-09",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Domani ___.",
    "core": [
      "Domani",
      "domani"
    ],
    "meaning": {
      "en": "Saying a plan with the present tense: Tomorrow I ___.",
      "ko": "현재형으로 계획 말하기: 내일 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Domani vado a Firenze in treno.",
        "slot": "vado a Firenze in treno",
        "cue": {
          "en": "go to Florence by train",
          "ko": "기차로 피렌체에 간다"
        },
        "gloss": {
          "en": "Tomorrow I'm going to Florence by train.",
          "ko": "내일 기차로 피렌체에 가요."
        }
      },
      {
        "text": "Domani lavoro da casa.",
        "slot": "lavoro da casa",
        "cue": {
          "en": "work from home",
          "ko": "재택근무한다"
        },
        "gloss": {
          "en": "Tomorrow I'm working from home.",
          "ko": "내일은 재택근무해요."
        }
      },
      {
        "text": "Domani resto a casa e mi riposo.",
        "slot": "resto a casa",
        "cue": {
          "en": "stay home",
          "ko": "집에 있는다"
        },
        "gloss": {
          "en": "Tomorrow I'm staying home and resting.",
          "ko": "내일은 집에서 쉬어요."
        }
      },
      {
        "text": "Domani parto per Roma.",
        "slot": "parto per Roma",
        "cue": {
          "en": "leave for Rome",
          "ko": "로마로 떠난다"
        },
        "gloss": {
          "en": "Tomorrow I leave for Rome.",
          "ko": "내일 로마로 떠나요."
        }
      }
    ]
  },
  {
    "id": "it-f2-10",
    "stage": 2,
    "fn": "invite",
    "pattern": "Ti va di ___?",
    "core": [
      "Ti va di",
      "ti va di"
    ],
    "meaning": {
      "en": "Inviting a friend: Do you feel like ___?",
      "ko": "같이 하자고 하기: ___ 할래?"
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Ti va di venire al cinema?",
        "slot": "venire al cinema",
        "cue": {
          "en": "coming to the cinema",
          "ko": "영화관에 가기"
        },
        "gloss": {
          "en": "Do you feel like coming to the cinema?",
          "ko": "영화 보러 갈래?"
        }
      },
      {
        "text": "Ti va di mangiare una pizza?",
        "slot": "mangiare una pizza",
        "cue": {
          "en": "having a pizza",
          "ko": "피자 먹기"
        },
        "gloss": {
          "en": "Do you feel like having a pizza?",
          "ko": "피자 먹을래?"
        }
      },
      {
        "text": "Ti va di fare una passeggiata?",
        "slot": "fare una passeggiata",
        "cue": {
          "en": "going for a walk",
          "ko": "산책하기"
        },
        "gloss": {
          "en": "Do you feel like going for a walk?",
          "ko": "산책할래?"
        }
      },
      {
        "text": "Ti va di andare al mare sabato?",
        "slot": "andare al mare sabato",
        "cue": {
          "en": "going to the seaside on Saturday",
          "ko": "토요일에 바다 가기"
        },
        "gloss": {
          "en": "Do you feel like going to the seaside on Saturday?",
          "ko": "토요일에 바다 갈래?"
        }
      }
    ]
  },
  {
    "id": "it-f2-11",
    "stage": 2,
    "fn": "accept",
    "pattern": "Volentieri, ___!",
    "core": [
      "Volentieri",
      "volentieri"
    ],
    "meaning": {
      "en": "Accepting an invitation: Gladly, ___!",
      "ko": "제안 받아들이기: 좋아, ___!"
    },
    "grammar": [],
    "expressions": [
      "volentieri",
      "a che ora",
      "mi piacerebbe",
      "ci vediamo"
    ],
    "examples": [
      {
        "text": "Volentieri, a che ora?",
        "slot": "a che ora",
        "cue": {
          "en": "what time",
          "ko": "몇 시"
        },
        "gloss": {
          "en": "Gladly, what time?",
          "ko": "좋아, 몇 시에?"
        }
      },
      {
        "text": "Volentieri, grazie!",
        "slot": "grazie",
        "cue": {
          "en": "thanks",
          "ko": "고마워"
        },
        "gloss": {
          "en": "Gladly, thanks!",
          "ko": "좋아, 고마워!"
        }
      },
      {
        "text": "Volentieri, mi piacerebbe molto!",
        "slot": "mi piacerebbe molto",
        "cue": {
          "en": "I'd really like that",
          "ko": "정말 그러고 싶어"
        },
        "gloss": {
          "en": "Gladly, I'd really like that!",
          "ko": "좋아, 정말 그러고 싶어!"
        }
      },
      {
        "text": "Volentieri, ci vediamo lì!",
        "slot": "ci vediamo lì",
        "cue": {
          "en": "see you there",
          "ko": "거기서 보자"
        },
        "gloss": {
          "en": "Gladly, see you there!",
          "ko": "좋아, 거기서 보자!"
        }
      }
    ]
  },
  {
    "id": "it-f2-12",
    "stage": 2,
    "fn": "decline",
    "pattern": "Che peccato, ___.",
    "core": [
      "Che peccato",
      "che peccato"
    ],
    "meaning": {
      "en": "Declining with regret: What a shame, ___.",
      "ko": "아쉬워하며 거절하기: 아쉽다, ___."
    },
    "grammar": [],
    "expressions": [
      "che peccato"
    ],
    "examples": [
      {
        "text": "Che peccato, sabato lavoro.",
        "slot": "sabato lavoro",
        "cue": {
          "en": "I'm working on Saturday",
          "ko": "토요일에 일해"
        },
        "gloss": {
          "en": "What a shame, I'm working on Saturday.",
          "ko": "아쉽다, 토요일엔 일해."
        }
      },
      {
        "text": "Che peccato, stasera non posso.",
        "slot": "stasera non posso",
        "cue": {
          "en": "I can't tonight",
          "ko": "오늘 저녁엔 안 돼"
        },
        "gloss": {
          "en": "What a shame, I can't tonight.",
          "ko": "아쉽다, 오늘 저녁엔 안 돼."
        }
      },
      {
        "text": "Che peccato, ho già un impegno.",
        "slot": "ho già un impegno",
        "cue": {
          "en": "I already have plans",
          "ko": "이미 약속이 있어"
        },
        "gloss": {
          "en": "What a shame, I already have plans.",
          "ko": "아쉽다, 이미 약속이 있어."
        }
      },
      {
        "text": "Che peccato, domani parto.",
        "slot": "domani parto",
        "cue": {
          "en": "I leave tomorrow",
          "ko": "내일 떠나"
        },
        "gloss": {
          "en": "What a shame, I leave tomorrow.",
          "ko": "아쉽다, 내일 떠나."
        }
      }
    ]
  },
  {
    "id": "it-f2-13",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Ci vediamo ___.",
    "core": [
      "Ci vediamo",
      "ci vediamo"
    ],
    "meaning": {
      "en": "Arranging where or when to meet: See you ___.",
      "ko": "만날 곳·때 정하기: ___ 보자."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "ci vediamo"
    ],
    "examples": [
      {
        "text": "Ci vediamo alla stazione.",
        "slot": "alla stazione",
        "cue": {
          "en": "at the station",
          "ko": "역에서"
        },
        "gloss": {
          "en": "See you at the station.",
          "ko": "역에서 보자."
        }
      },
      {
        "text": "Ci vediamo al bar alle sette.",
        "slot": "al bar alle sette",
        "cue": {
          "en": "at the café at seven",
          "ko": "7시에 카페에서"
        },
        "gloss": {
          "en": "See you at the café at seven.",
          "ko": "7시에 카페에서 보자."
        }
      },
      {
        "text": "Ci vediamo davanti al cinema.",
        "slot": "davanti al cinema",
        "cue": {
          "en": "in front of the cinema",
          "ko": "영화관 앞에서"
        },
        "gloss": {
          "en": "See you in front of the cinema.",
          "ko": "영화관 앞에서 보자."
        }
      },
      {
        "text": "Allora ci vediamo nel pomeriggio.",
        "slot": "nel pomeriggio",
        "cue": {
          "en": "in the afternoon",
          "ko": "오후에"
        },
        "gloss": {
          "en": "So see you in the afternoon.",
          "ko": "그럼 오후에 보자."
        }
      }
    ]
  },
  {
    "id": "it-f2-14",
    "stage": 2,
    "fn": "time-when",
    "pattern": "A che ora ___?",
    "core": [
      "A che ora",
      "a che ora"
    ],
    "meaning": {
      "en": "Asking what time something happens: What time ___?",
      "ko": "시간 묻기: 몇 시에 ___?"
    },
    "grammar": [],
    "expressions": [
      "a che ora"
    ],
    "examples": [
      {
        "text": "A che ora ci vediamo?",
        "slot": "ci vediamo",
        "cue": {
          "en": "do we meet",
          "ko": "만나다"
        },
        "gloss": {
          "en": "What time shall we meet?",
          "ko": "몇 시에 만날까?"
        }
      },
      {
        "text": "A che ora parte il treno?",
        "slot": "parte il treno",
        "cue": {
          "en": "does the train leave",
          "ko": "기차가 출발하다"
        },
        "gloss": {
          "en": "What time does the train leave?",
          "ko": "기차가 몇 시에 출발해요?"
        }
      },
      {
        "text": "A che ora comincia il film?",
        "slot": "comincia il film",
        "cue": {
          "en": "does the film start",
          "ko": "영화가 시작하다"
        },
        "gloss": {
          "en": "What time does the film start?",
          "ko": "영화가 몇 시에 시작해요?"
        }
      },
      {
        "text": "A che ora partite?",
        "slot": "partite",
        "cue": {
          "en": "are you (all) leaving",
          "ko": "너희가 출발하다"
        },
        "gloss": {
          "en": "What time are you leaving?",
          "ko": "너희 몇 시에 출발해?"
        }
      }
    ]
  },
  {
    "id": "it-f2-15",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "Cosa mi consiglia ___?",
    "core": [
      "Cosa mi consiglia",
      "cosa mi consiglia"
    ],
    "meaning": {
      "en": "Asking for a recommendation politely: What do you recommend ___?",
      "ko": "정중하게 추천 부탁하기: ___ 뭘 추천하세요?"
    },
    "grammar": [],
    "expressions": [
      "cosa mi consiglia"
    ],
    "examples": [
      {
        "text": "Cosa mi consiglia di secondo?",
        "slot": "di secondo",
        "cue": {
          "en": "as a main course",
          "ko": "메인 요리로"
        },
        "gloss": {
          "en": "What do you recommend as a main course?",
          "ko": "메인 요리는 뭘 추천하세요?"
        }
      },
      {
        "text": "Cosa mi consiglia da bere?",
        "slot": "da bere",
        "cue": {
          "en": "to drink",
          "ko": "마실 것으로"
        },
        "gloss": {
          "en": "What do you recommend to drink?",
          "ko": "마실 건 뭘 추천하세요?"
        }
      },
      {
        "text": "Cosa mi consiglia per il mal di testa?",
        "slot": "per il mal di testa",
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
        "text": "Cosa mi consiglia stasera?",
        "slot": "stasera",
        "cue": {
          "en": "tonight",
          "ko": "오늘 저녁"
        },
        "gloss": {
          "en": "What do you recommend tonight?",
          "ko": "오늘 저녁엔 뭘 추천하세요?"
        }
      }
    ]
  },
  {
    "id": "it-f2-16",
    "stage": 2,
    "fn": "symptom",
    "pattern": "Mi fa male ___.",
    "core": [
      "Mi fa male",
      "mi fa male"
    ],
    "meaning": {
      "en": "Saying where it hurts: My ___ hurts.",
      "ko": "아픈 곳 말하기: ___ 아파요."
    },
    "grammar": [],
    "expressions": [
      "mi fa male la testa"
    ],
    "examples": [
      {
        "text": "Mi fa male la testa.",
        "slot": "la testa",
        "cue": {
          "en": "head",
          "ko": "머리"
        },
        "gloss": {
          "en": "My head hurts.",
          "ko": "머리가 아파요."
        }
      },
      {
        "text": "Mi fa male la gola.",
        "slot": "la gola",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "My throat hurts.",
          "ko": "목이 아파요."
        }
      },
      {
        "text": "Mi fa male lo stomaco.",
        "slot": "lo stomaco",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "My stomach hurts.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "Da ieri mi fa male la schiena.",
        "slot": "la schiena",
        "cue": {
          "en": "back",
          "ko": "허리"
        },
        "gloss": {
          "en": "My back has hurt since yesterday.",
          "ko": "어제부터 허리가 아파요."
        }
      }
    ]
  },
  {
    "id": "it-f2-17",
    "stage": 2,
    "fn": "order",
    "pattern": "Per me ___, grazie.",
    "core": [
      "Per me",
      "per me"
    ],
    "meaning": {
      "en": "Ordering food and drink: For me ___, thanks.",
      "ko": "주문하기: 저는 ___ 주세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Per me una pizza margherita, grazie.",
        "slot": "una pizza margherita",
        "cue": {
          "en": "a margherita pizza",
          "ko": "마르게리타 피자"
        },
        "gloss": {
          "en": "A margherita pizza for me, thanks.",
          "ko": "저는 마르게리타 피자 주세요."
        }
      },
      {
        "text": "Per me il risotto ai funghi, grazie.",
        "slot": "il risotto ai funghi",
        "cue": {
          "en": "the mushroom risotto",
          "ko": "버섯 리소토"
        },
        "gloss": {
          "en": "The mushroom risotto for me, thanks.",
          "ko": "저는 버섯 리소토 주세요."
        }
      },
      {
        "text": "Per me un'acqua frizzante, grazie.",
        "slot": "un'acqua frizzante",
        "cue": {
          "en": "a sparkling water",
          "ko": "탄산수"
        },
        "gloss": {
          "en": "A sparkling water for me, thanks.",
          "ko": "저는 탄산수 주세요."
        }
      },
      {
        "text": "Per me il tiramisù, grazie.",
        "slot": "il tiramisù",
        "cue": {
          "en": "the tiramisu",
          "ko": "티라미수"
        },
        "gloss": {
          "en": "The tiramisu for me, thanks.",
          "ko": "저는 티라미수 주세요."
        }
      }
    ]
  },
  {
    "id": "it-f2-18",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Ho già ___.",
    "core": [
      "Ho già",
      "ho già"
    ],
    "meaning": {
      "en": "Saying you've already done something: I've already ___.",
      "ko": "이미 한 일 말하기: 벌써 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "ho già finito"
    ],
    "examples": [
      {
        "text": "Ho già finito.",
        "slot": "finito",
        "cue": {
          "en": "finished",
          "ko": "끝냈다"
        },
        "gloss": {
          "en": "I've already finished.",
          "ko": "벌써 끝냈어요."
        }
      },
      {
        "text": "Ho già mangiato, grazie.",
        "slot": "mangiato",
        "cue": {
          "en": "eaten",
          "ko": "먹었다"
        },
        "gloss": {
          "en": "I've already eaten, thanks.",
          "ko": "벌써 먹었어요, 고마워요."
        }
      },
      {
        "text": "Ho già visto questo film.",
        "slot": "visto questo film",
        "cue": {
          "en": "seen this film",
          "ko": "이 영화를 봤다"
        },
        "gloss": {
          "en": "I've already seen this film.",
          "ko": "이 영화 벌써 봤어요."
        }
      },
      {
        "text": "Ho già prenotato il tavolo.",
        "slot": "prenotato il tavolo",
        "cue": {
          "en": "booked the table",
          "ko": "자리를 예약했다"
        },
        "gloss": {
          "en": "I've already booked the table.",
          "ko": "자리는 벌써 예약했어요."
        }
      }
    ]
  },
  {
    "id": "it-f2-19",
    "stage": 2,
    "fn": "ask-opinion-simple",
    "pattern": "Com'è andato ___?",
    "core": [
      "Com'è andat",
      "com'è andat"
    ],
    "meaning": {
      "en": "Asking how something went: How did ___ go?",
      "ko": "어땠는지 묻기: ___ 어땠어?"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Com'è andato il weekend?",
        "slot": "il weekend",
        "cue": {
          "en": "the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "How was the weekend?",
          "ko": "주말 어땠어?"
        }
      },
      {
        "text": "Com'è andato il viaggio?",
        "slot": "il viaggio",
        "cue": {
          "en": "the trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "How was the trip?",
          "ko": "여행 어땠어?"
        }
      },
      {
        "text": "Com'è andato l'esame?",
        "slot": "l'esame",
        "cue": {
          "en": "the exam",
          "ko": "시험"
        },
        "gloss": {
          "en": "How did the exam go?",
          "ko": "시험 어떻게 됐어?"
        }
      },
      {
        "text": "Com'è andata la cena?",
        "slot": "la cena",
        "cue": {
          "en": "the dinner (feminine: andata)",
          "ko": "저녁 식사(여성형: andata)"
        },
        "gloss": {
          "en": "How did the dinner go?",
          "ko": "저녁 식사 어땠어?"
        }
      }
    ]
  },
  {
    "id": "it-f3-01",
    "stage": 3,
    "fn": "habit-past",
    "pattern": "Da piccolo ___.",
    "core": [
      "Da piccol",
      "da piccol"
    ],
    "meaning": {
      "en": "Saying what you used to do as a child (imperfetto): As a kid I ___.",
      "ko": "어릴 때 하던 일(반과거): 어렸을 때 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Da piccolo andavo sempre dai nonni d'estate.",
        "slot": "andavo sempre dai nonni d'estate",
        "cue": {
          "en": "always went to my grandparents' in summer",
          "ko": "여름마다 조부모님 댁에 갔다"
        },
        "gloss": {
          "en": "As a kid I always went to my grandparents' in summer.",
          "ko": "어렸을 때 여름이면 늘 할머니 댁에 갔어요."
        }
      },
      {
        "text": "Da piccolo giocavo a calcio tutti i giorni.",
        "slot": "giocavo a calcio tutti i giorni",
        "cue": {
          "en": "played football every day",
          "ko": "매일 축구를 했다"
        },
        "gloss": {
          "en": "As a kid I played football every day.",
          "ko": "어렸을 때 매일 축구를 했어요."
        }
      },
      {
        "text": "Da piccola avevo paura del buio.",
        "slot": "avevo paura del buio",
        "cue": {
          "en": "was afraid of the dark (female)",
          "ko": "어둠을 무서워했다(여성)"
        },
        "gloss": {
          "en": "As a little girl I was afraid of the dark.",
          "ko": "어렸을 때 어둠을 무서워했어요."
        }
      },
      {
        "text": "Da piccola abitavo in campagna.",
        "slot": "abitavo in campagna",
        "cue": {
          "en": "lived in the countryside (female)",
          "ko": "시골에 살았다(여성)"
        },
        "gloss": {
          "en": "As a little girl I lived in the countryside.",
          "ko": "어렸을 때 시골에 살았어요."
        }
      }
    ]
  },
  {
    "id": "it-f3-02",
    "stage": 3,
    "fn": "while-when",
    "pattern": "Mentre ___, mi ha chiamato Giulia.",
    "core": [
      "Mentre",
      "mentre"
    ],
    "meaning": {
      "en": "Background (imperfetto) interrupted by an event (passato prossimo): While I was ___, Giulia called me.",
      "ko": "배경(반과거)과 끼어든 일(근과거): ___ 하는 동안 줄리아가 전화했어요."
    },
    "grammar": [
      1,
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mentre aspettavo il treno, mi ha chiamato Giulia.",
        "slot": "aspettavo il treno",
        "cue": {
          "en": "I was waiting for the train",
          "ko": "기차를 기다리고 있었다"
        },
        "gloss": {
          "en": "While I was waiting for the train, Giulia called me.",
          "ko": "기차를 기다리는데 줄리아가 전화했어요."
        }
      },
      {
        "text": "Mentre cucinavo, mi ha chiamato Giulia.",
        "slot": "cucinavo",
        "cue": {
          "en": "I was cooking",
          "ko": "요리하고 있었다"
        },
        "gloss": {
          "en": "While I was cooking, Giulia called me.",
          "ko": "요리하는데 줄리아가 전화했어요."
        }
      },
      {
        "text": "Mentre uscivo di casa, mi ha chiamato Giulia.",
        "slot": "uscivo di casa",
        "cue": {
          "en": "I was leaving the house",
          "ko": "집을 나서고 있었다"
        },
        "gloss": {
          "en": "As I was leaving the house, Giulia called me.",
          "ko": "집을 나서는데 줄리아가 전화했어요."
        }
      },
      {
        "text": "Mentre ero sotto la doccia, mi ha chiamato Giulia.",
        "slot": "ero sotto la doccia",
        "cue": {
          "en": "I was in the shower",
          "ko": "샤워 중이었다"
        },
        "gloss": {
          "en": "While I was in the shower, Giulia called me.",
          "ko": "샤워하는데 줄리아가 전화했어요."
        }
      }
    ]
  },
  {
    "id": "it-f3-03",
    "stage": 3,
    "fn": "guess",
    "pattern": "Sarà ___.",
    "core": [
      "Sarà",
      "sarà"
    ],
    "meaning": {
      "en": "Guessing with the future: He/She/It must be ___.",
      "ko": "미래형으로 짐작하기: 아마 ___일 거야."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sarà stanco, ha lavorato tutto il giorno.",
        "slot": "stanco",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "He must be tired, he worked all day.",
          "ko": "피곤하겠지, 하루 종일 일했잖아."
        }
      },
      {
        "text": "Sarà nel traffico.",
        "slot": "nel traffico",
        "cue": {
          "en": "stuck in traffic",
          "ko": "차가 막힌다"
        },
        "gloss": {
          "en": "He's probably stuck in traffic.",
          "ko": "아마 차가 막히나 봐."
        }
      },
      {
        "text": "Sarà già a casa.",
        "slot": "già a casa",
        "cue": {
          "en": "already home",
          "ko": "벌써 집에 있다"
        },
        "gloss": {
          "en": "She's probably already home.",
          "ko": "벌써 집에 있을 거야."
        }
      },
      {
        "text": "Sarà una bella serata.",
        "slot": "una bella serata",
        "cue": {
          "en": "a lovely evening",
          "ko": "즐거운 저녁"
        },
        "gloss": {
          "en": "It'll be a lovely evening.",
          "ko": "즐거운 저녁이 될 거야."
        }
      }
    ]
  },
  {
    "id": "it-f3-04",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Gli ho ___.",
    "core": [
      "Gli ho",
      "gli ho"
    ],
    "meaning": {
      "en": "Saying what you did to/for him (indirect pronoun gli): I ___ him.",
      "ko": "그에게 한 일 말하기(간접목적 대명사 gli): 그에게 ___."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Gli ho mandato un messaggio, ma non mi ha risposto.",
        "slot": "mandato un messaggio",
        "cue": {
          "en": "sent a message",
          "ko": "문자를 보냈다"
        },
        "gloss": {
          "en": "I sent him a message, but he didn't answer me.",
          "ko": "그에게 문자를 보냈는데 답이 없었어요."
        }
      },
      {
        "text": "Gli ho scritto ieri sera.",
        "slot": "scritto ieri sera",
        "cue": {
          "en": "wrote last night",
          "ko": "어젯밤에 썼다"
        },
        "gloss": {
          "en": "I wrote to him last night.",
          "ko": "어젯밤에 그에게 연락했어요."
        }
      },
      {
        "text": "Gli ho detto la verità.",
        "slot": "detto la verità",
        "cue": {
          "en": "told the truth",
          "ko": "사실대로 말했다"
        },
        "gloss": {
          "en": "I told him the truth.",
          "ko": "그에게 사실대로 말했어요."
        }
      },
      {
        "text": "Gli ho chiesto aiuto.",
        "slot": "chiesto aiuto",
        "cue": {
          "en": "asked for help",
          "ko": "도움을 청했다"
        },
        "gloss": {
          "en": "I asked him for help.",
          "ko": "그에게 도움을 청했어요."
        }
      }
    ]
  },
  {
    "id": "it-f3-05",
    "stage": 3,
    "fn": "experience",
    "pattern": "Ci sono stato ___.",
    "core": [
      "Ci sono stat",
      "ci sono stat"
    ],
    "meaning": {
      "en": "Saying you've been there (ci = there): I've been there ___.",
      "ko": "가 본 적 말하기(ci = 거기): 거기 ___ 가 봤어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ci sono stato l'anno scorso.",
        "slot": "l'anno scorso",
        "cue": {
          "en": "last year",
          "ko": "작년에"
        },
        "gloss": {
          "en": "I was there last year.",
          "ko": "작년에 거기 가 봤어요."
        }
      },
      {
        "text": "Ci sono stato due volte.",
        "slot": "due volte",
        "cue": {
          "en": "twice",
          "ko": "두 번"
        },
        "gloss": {
          "en": "I've been there twice.",
          "ko": "거기 두 번 가 봤어요."
        }
      },
      {
        "text": "Ci sono stata da bambina.",
        "slot": "da bambina",
        "cue": {
          "en": "as a little girl",
          "ko": "어릴 때(여성)"
        },
        "gloss": {
          "en": "I went there as a little girl.",
          "ko": "어릴 때 거기 가 봤어요."
        }
      },
      {
        "text": "Ci sono stata in luna di miele.",
        "slot": "in luna di miele",
        "cue": {
          "en": "on my honeymoon",
          "ko": "신혼여행 때"
        },
        "gloss": {
          "en": "I went there on my honeymoon.",
          "ko": "신혼여행 때 거기 갔어요."
        }
      }
    ]
  },
  {
    "id": "it-f3-06",
    "stage": 3,
    "fn": "count",
    "pattern": "Ne ho ___.",
    "core": [
      "Ne ho",
      "ne ho"
    ],
    "meaning": {
      "en": "Talking about a quantity of something already mentioned (ne): I have/did ___ of it.",
      "ko": "앞에서 말한 것의 양 말하기(ne): 그걸 ___."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ne ho visti tre episodi di fila.",
        "slot": "visti tre episodi di fila",
        "cue": {
          "en": "watched three episodes in a row",
          "ko": "세 편 연달아 봤다"
        },
        "gloss": {
          "en": "I watched three episodes of it in a row.",
          "ko": "세 편을 연달아 봤어요."
        }
      },
      {
        "text": "Ne ho comprati due chili.",
        "slot": "comprati due chili",
        "cue": {
          "en": "bought two kilos",
          "ko": "2킬로 샀다"
        },
        "gloss": {
          "en": "I bought two kilos of them.",
          "ko": "2킬로 샀어요."
        }
      },
      {
        "text": "Ne ho parlato con il capo.",
        "slot": "parlato con il capo",
        "cue": {
          "en": "talked to the boss about it",
          "ko": "상사와 이야기했다"
        },
        "gloss": {
          "en": "I talked to the boss about it.",
          "ko": "그 일로 상사와 이야기했어요."
        }
      },
      {
        "text": "Ne ho bisogno subito.",
        "slot": "bisogno subito",
        "cue": {
          "en": "need it right away",
          "ko": "당장 필요하다"
        },
        "gloss": {
          "en": "I need it right away.",
          "ko": "그게 당장 필요해요."
        }
      }
    ]
  },
  {
    "id": "it-f3-07",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Potrebbe ___?",
    "core": [
      "Potrebbe",
      "potrebbe"
    ],
    "meaning": {
      "en": "Polite request with the conditional (Lei): Could you ___?",
      "ko": "조건법으로 정중하게 부탁하기(Lei): ___ 주실 수 있을까요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Potrebbe cambiarmi la camera?",
        "slot": "cambiarmi la camera",
        "cue": {
          "en": "change my room",
          "ko": "방을 바꿔 주다"
        },
        "gloss": {
          "en": "Could you change my room?",
          "ko": "방을 바꿔 주실 수 있을까요?"
        }
      },
      {
        "text": "Potrebbe chiamarmi un taxi?",
        "slot": "chiamarmi un taxi",
        "cue": {
          "en": "call me a taxi",
          "ko": "택시를 불러 주다"
        },
        "gloss": {
          "en": "Could you call me a taxi?",
          "ko": "택시 좀 불러 주실 수 있을까요?"
        }
      },
      {
        "text": "Potrebbe parlare più lentamente?",
        "slot": "parlare più lentamente",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하다"
        },
        "gloss": {
          "en": "Could you speak more slowly?",
          "ko": "더 천천히 말씀해 주실 수 있을까요?"
        }
      },
      {
        "text": "Scusi, potrebbe aiutarmi con le valigie?",
        "slot": "aiutarmi con le valigie",
        "cue": {
          "en": "help me with the suitcases",
          "ko": "짐 드는 걸 도와주다"
        },
        "gloss": {
          "en": "Excuse me, could you help me with the suitcases?",
          "ko": "실례지만, 짐 좀 도와주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "it-f3-08",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Mi potresti ___?",
    "core": [
      "Mi potresti",
      "mi potresti"
    ],
    "meaning": {
      "en": "Polite request to a friend or colleague (tu): Could you ___ for me?",
      "ko": "친구·동료에게 정중히 부탁하기(tu): ___ 줄 수 있어?"
    },
    "grammar": [
      5,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mi potresti dare una mano?",
        "slot": "dare una mano",
        "cue": {
          "en": "give a hand",
          "ko": "도와주다"
        },
        "gloss": {
          "en": "Could you give me a hand?",
          "ko": "좀 도와줄 수 있어?"
        }
      },
      {
        "text": "Mi potresti prestare il caricabatterie?",
        "slot": "prestare il caricabatterie",
        "cue": {
          "en": "lend the charger",
          "ko": "충전기를 빌려주다"
        },
        "gloss": {
          "en": "Could you lend me your charger?",
          "ko": "충전기 좀 빌려줄 수 있어?"
        }
      },
      {
        "text": "Mi potresti mandare il file?",
        "slot": "mandare il file",
        "cue": {
          "en": "send the file",
          "ko": "파일을 보내 주다"
        },
        "gloss": {
          "en": "Could you send me the file?",
          "ko": "파일 좀 보내 줄 수 있어?"
        }
      },
      {
        "text": "Mi potresti spiegare questa formula?",
        "slot": "spiegare questa formula",
        "cue": {
          "en": "explain this formula",
          "ko": "이 수식을 설명해 주다"
        },
        "gloss": {
          "en": "Could you explain this formula to me?",
          "ko": "이 수식 좀 설명해 줄 수 있어?"
        }
      }
    ]
  },
  {
    "id": "it-f3-09",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Penso che ___.",
    "core": [
      "Penso che",
      "penso che"
    ],
    "meaning": {
      "en": "Giving an opinion (subjunctive): I think ___.",
      "ko": "의견 말하기(접속법): ___ 것 같아요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Penso che sia una buona idea.",
        "slot": "sia una buona idea",
        "cue": {
          "en": "it's a good idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "I think it's a good idea.",
          "ko": "좋은 생각인 것 같아요."
        }
      },
      {
        "text": "Penso che abbia ragione tu.",
        "slot": "abbia ragione tu",
        "cue": {
          "en": "you're right",
          "ko": "네가 맞다"
        },
        "gloss": {
          "en": "I think you're right.",
          "ko": "네 말이 맞는 것 같아."
        }
      },
      {
        "text": "Penso che sia troppo tardi.",
        "slot": "sia troppo tardi",
        "cue": {
          "en": "it's too late",
          "ko": "너무 늦었다"
        },
        "gloss": {
          "en": "I think it's too late.",
          "ko": "너무 늦은 것 같아요."
        }
      },
      {
        "text": "Penso che sia la serie più bella dell'anno.",
        "slot": "sia la serie più bella dell'anno",
        "cue": {
          "en": "it's the best series of the year",
          "ko": "올해 최고의 드라마다"
        },
        "gloss": {
          "en": "I think it's the best series of the year.",
          "ko": "올해 최고의 드라마인 것 같아요."
        }
      }
    ]
  },
  {
    "id": "it-f3-10",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "Non credo che ___.",
    "core": [
      "Non credo che",
      "non credo che"
    ],
    "meaning": {
      "en": "Disagreeing gently (subjunctive): I don't think ___.",
      "ko": "부드럽게 반대하기(접속법): ___ 것 같지 않아요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Non credo che sia vero.",
        "slot": "sia vero",
        "cue": {
          "en": "it's true",
          "ko": "사실이다"
        },
        "gloss": {
          "en": "I don't think it's true.",
          "ko": "사실이 아닌 것 같아요."
        }
      },
      {
        "text": "Non credo che abbia capito.",
        "slot": "abbia capito",
        "cue": {
          "en": "he understood",
          "ko": "그가 이해했다"
        },
        "gloss": {
          "en": "I don't think he understood.",
          "ko": "그가 이해한 것 같지 않아요."
        }
      },
      {
        "text": "Non credo che sia una buona idea.",
        "slot": "sia una buona idea",
        "cue": {
          "en": "it's a good idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "I don't think it's a good idea.",
          "ko": "좋은 생각 같지 않아요."
        }
      },
      {
        "text": "Non credo che arrivi in tempo.",
        "slot": "arrivi in tempo",
        "cue": {
          "en": "she'll arrive on time",
          "ko": "제시간에 온다"
        },
        "gloss": {
          "en": "I don't think she'll arrive on time.",
          "ko": "제시간에 올 것 같지 않아요."
        }
      }
    ]
  },
  {
    "id": "it-f3-11",
    "stage": 3,
    "fn": "request-action",
    "pattern": "Dimmi ___.",
    "core": [
      "Dimmi",
      "dimmi"
    ],
    "meaning": {
      "en": "Informal imperative (tu): Tell me ___.",
      "ko": "tu 명령형: ___ 말해 줘."
    },
    "grammar": [
      7,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Dimmi la verità.",
        "slot": "la verità",
        "cue": {
          "en": "the truth",
          "ko": "사실"
        },
        "gloss": {
          "en": "Tell me the truth.",
          "ko": "사실대로 말해 줘."
        }
      },
      {
        "text": "Dimmi cosa ne pensi.",
        "slot": "cosa ne pensi",
        "cue": {
          "en": "what you think about it",
          "ko": "네 생각"
        },
        "gloss": {
          "en": "Tell me what you think about it.",
          "ko": "네 생각을 말해 줘."
        }
      },
      {
        "text": "Dimmi quando sei libero.",
        "slot": "quando sei libero",
        "cue": {
          "en": "when you're free",
          "ko": "언제 시간 되는지"
        },
        "gloss": {
          "en": "Tell me when you're free.",
          "ko": "언제 시간 되는지 말해 줘."
        }
      },
      {
        "text": "Dai, dimmi solo una cosa.",
        "slot": "solo una cosa",
        "cue": {
          "en": "just one thing",
          "ko": "딱 하나만"
        },
        "gloss": {
          "en": "Come on, just tell me one thing.",
          "ko": "에이, 하나만 말해 줘."
        }
      }
    ]
  },
  {
    "id": "it-f3-12",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "Prova ___!",
    "core": [
      "Prova",
      "prova"
    ],
    "meaning": {
      "en": "Giving advice with the informal imperative: Try ___!",
      "ko": "tu 명령형으로 조언하기: ___ 해 봐!"
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Prova questa serie!",
        "slot": "questa serie",
        "cue": {
          "en": "this series",
          "ko": "이 드라마"
        },
        "gloss": {
          "en": "Try this series!",
          "ko": "이 드라마 한번 봐 봐!"
        }
      },
      {
        "text": "Prova a riavviare il computer!",
        "slot": "a riavviare il computer",
        "cue": {
          "en": "restarting the computer",
          "ko": "컴퓨터 재시작"
        },
        "gloss": {
          "en": "Try restarting the computer!",
          "ko": "컴퓨터를 다시 켜 봐!"
        }
      },
      {
        "text": "Prova il tiramisù, è buonissimo!",
        "slot": "il tiramisù",
        "cue": {
          "en": "the tiramisu",
          "ko": "티라미수"
        },
        "gloss": {
          "en": "Try the tiramisu, it's delicious!",
          "ko": "티라미수 먹어 봐, 진짜 맛있어!"
        }
      },
      {
        "text": "Prova a chiamarlo stasera!",
        "slot": "a chiamarlo stasera",
        "cue": {
          "en": "calling him tonight",
          "ko": "오늘 밤 그에게 전화하기"
        },
        "gloss": {
          "en": "Try calling him tonight!",
          "ko": "오늘 밤에 그에게 전화해 봐!"
        }
      }
    ]
  },
  {
    "id": "it-f3-13",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "Scusa il ritardo, ___.",
    "core": [
      "Scusa il ritardo",
      "scusa il ritardo"
    ],
    "meaning": {
      "en": "Apologizing for being late and explaining: Sorry I'm late, ___.",
      "ko": "늦은 걸 사과하고 이유 말하기: 늦어서 미안, ___."
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [
      "scusa il ritardo"
    ],
    "examples": [
      {
        "text": "Scusa il ritardo, c'era un traffico incredibile.",
        "slot": "c'era un traffico incredibile",
        "cue": {
          "en": "the traffic was unbelievable",
          "ko": "차가 엄청 막혔다"
        },
        "gloss": {
          "en": "Sorry I'm late, the traffic was unbelievable.",
          "ko": "늦어서 미안, 차가 엄청 막혔어."
        }
      },
      {
        "text": "Scusa il ritardo, il treno era in ritardo.",
        "slot": "il treno era in ritardo",
        "cue": {
          "en": "the train was late",
          "ko": "기차가 늦었다"
        },
        "gloss": {
          "en": "Sorry I'm late, the train was delayed.",
          "ko": "늦어서 미안, 기차가 늦었어."
        }
      },
      {
        "text": "Scusa il ritardo, non trovavo le chiavi.",
        "slot": "non trovavo le chiavi",
        "cue": {
          "en": "I couldn't find my keys",
          "ko": "열쇠를 못 찾았다"
        },
        "gloss": {
          "en": "Sorry I'm late, I couldn't find my keys.",
          "ko": "늦어서 미안, 열쇠를 못 찾았어."
        }
      },
      {
        "text": "Scusa il ritardo, ho perso l'autobus.",
        "slot": "ho perso l'autobus",
        "cue": {
          "en": "I missed the bus",
          "ko": "버스를 놓쳤다"
        },
        "gloss": {
          "en": "Sorry I'm late, I missed the bus.",
          "ko": "늦어서 미안, 버스를 놓쳤어."
        }
      }
    ]
  },
  {
    "id": "it-f3-14",
    "stage": 3,
    "fn": "sympathy",
    "pattern": "Non ti preoccupare, ___.",
    "core": [
      "Non ti preoccupare",
      "non ti preoccupare"
    ],
    "meaning": {
      "en": "Reassuring someone: Don't worry, ___.",
      "ko": "안심시키기: 걱정 마, ___."
    },
    "grammar": [],
    "expressions": [
      "non ti preoccupare",
      "non fa niente"
    ],
    "examples": [
      {
        "text": "Non ti preoccupare, non fa niente.",
        "slot": "non fa niente",
        "cue": {
          "en": "it doesn't matter",
          "ko": "괜찮아"
        },
        "gloss": {
          "en": "Don't worry, it doesn't matter.",
          "ko": "걱정 마, 괜찮아."
        }
      },
      {
        "text": "Non ti preoccupare, succede a tutti.",
        "slot": "succede a tutti",
        "cue": {
          "en": "it happens to everyone",
          "ko": "누구나 그래"
        },
        "gloss": {
          "en": "Don't worry, it happens to everyone.",
          "ko": "걱정 마, 누구나 그래."
        }
      },
      {
        "text": "Non ti preoccupare, ti aiuto io.",
        "slot": "ti aiuto io",
        "cue": {
          "en": "I'll help you",
          "ko": "내가 도와줄게"
        },
        "gloss": {
          "en": "Don't worry, I'll help you.",
          "ko": "걱정 마, 내가 도와줄게."
        }
      },
      {
        "text": "Non ti preoccupare, c'è ancora tempo.",
        "slot": "c'è ancora tempo",
        "cue": {
          "en": "there's still time",
          "ko": "아직 시간 있어"
        },
        "gloss": {
          "en": "Don't worry, there's still time.",
          "ko": "걱정 마, 아직 시간 있어."
        }
      }
    ]
  },
  {
    "id": "it-f3-15",
    "stage": 3,
    "fn": "invite",
    "pattern": "Se ti va, ___.",
    "core": [
      "Se ti va",
      "se ti va"
    ],
    "meaning": {
      "en": "Offering or suggesting casually: If you like, ___.",
      "ko": "가볍게 제안하기: 괜찮으면 ___."
    },
    "grammar": [],
    "expressions": [
      "se ti va"
    ],
    "examples": [
      {
        "text": "Se ti va, andiamo al cinema.",
        "slot": "andiamo al cinema",
        "cue": {
          "en": "let's go to the cinema",
          "ko": "영화 보러 가자"
        },
        "gloss": {
          "en": "If you like, let's go to the cinema.",
          "ko": "괜찮으면 영화 보러 가자."
        }
      },
      {
        "text": "Se ti va, ci vediamo stasera.",
        "slot": "ci vediamo stasera",
        "cue": {
          "en": "let's meet tonight",
          "ko": "오늘 저녁에 보자"
        },
        "gloss": {
          "en": "If you like, let's meet tonight.",
          "ko": "괜찮으면 오늘 저녁에 보자."
        }
      },
      {
        "text": "Se ti va, ti mando il link.",
        "slot": "ti mando il link",
        "cue": {
          "en": "I'll send you the link",
          "ko": "링크 보내 줄게"
        },
        "gloss": {
          "en": "If you like, I'll send you the link.",
          "ko": "괜찮으면 링크 보내 줄게."
        }
      },
      {
        "text": "Se ti va, dopo ti offro un caffè.",
        "slot": "dopo ti offro un caffè",
        "cue": {
          "en": "I'll buy you a coffee later",
          "ko": "이따 커피 살게"
        },
        "gloss": {
          "en": "If you like, I'll buy you a coffee later.",
          "ko": "괜찮으면 이따 커피 살게."
        }
      }
    ]
  },
  {
    "id": "it-f3-16",
    "stage": 3,
    "fn": "look-forward",
    "pattern": "Non vedo l'ora di ___.",
    "core": [
      "Non vedo l'ora",
      "non vedo l'ora"
    ],
    "meaning": {
      "en": "Saying you can't wait: I can't wait to ___.",
      "ko": "기대된다고 말하기: 빨리 ___ 싶어."
    },
    "grammar": [],
    "expressions": [
      "non vedo l'ora"
    ],
    "examples": [
      {
        "text": "Non vedo l'ora di vedere il finale.",
        "slot": "vedere il finale",
        "cue": {
          "en": "see the ending",
          "ko": "결말을 보다"
        },
        "gloss": {
          "en": "I can't wait to see the ending.",
          "ko": "빨리 결말을 보고 싶어."
        }
      },
      {
        "text": "Non vedo l'ora di partire.",
        "slot": "partire",
        "cue": {
          "en": "leave",
          "ko": "떠나다"
        },
        "gloss": {
          "en": "I can't wait to leave.",
          "ko": "빨리 떠나고 싶어."
        }
      },
      {
        "text": "Non vedo l'ora di rivederti.",
        "slot": "rivederti",
        "cue": {
          "en": "see you again",
          "ko": "너를 다시 보다"
        },
        "gloss": {
          "en": "I can't wait to see you again.",
          "ko": "빨리 다시 보고 싶어."
        }
      },
      {
        "text": "Non vedo l'ora di finire questo progetto.",
        "slot": "finire questo progetto",
        "cue": {
          "en": "finish this project",
          "ko": "이 프로젝트를 끝내다"
        },
        "gloss": {
          "en": "I can't wait to finish this project.",
          "ko": "이 프로젝트 빨리 끝내고 싶어."
        }
      }
    ]
  },
  {
    "id": "it-f3-17",
    "stage": 3,
    "fn": "complain",
    "pattern": "Purtroppo ___ non funziona.",
    "core": [
      "non funziona"
    ],
    "meaning": {
      "en": "Reporting a problem politely: Unfortunately ___ isn't working.",
      "ko": "정중하게 문제 알리기: 아쉽게도 ___ 안 돼요."
    },
    "grammar": [],
    "expressions": [
      "purtroppo"
    ],
    "examples": [
      {
        "text": "Purtroppo l'aria condizionata non funziona.",
        "slot": "l'aria condizionata",
        "cue": {
          "en": "the air conditioning",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "Unfortunately the air conditioning isn't working.",
          "ko": "아쉽게도 에어컨이 안 돼요."
        }
      },
      {
        "text": "Purtroppo il riscaldamento non funziona.",
        "slot": "il riscaldamento",
        "cue": {
          "en": "the heating",
          "ko": "난방"
        },
        "gloss": {
          "en": "Unfortunately the heating isn't working.",
          "ko": "아쉽게도 난방이 안 돼요."
        }
      },
      {
        "text": "Purtroppo la doccia non funziona.",
        "slot": "la doccia",
        "cue": {
          "en": "the shower",
          "ko": "샤워기"
        },
        "gloss": {
          "en": "Unfortunately the shower isn't working.",
          "ko": "아쉽게도 샤워기가 고장 났어요."
        }
      },
      {
        "text": "Purtroppo il wifi non funziona.",
        "slot": "il wifi",
        "cue": {
          "en": "the wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Unfortunately the wifi isn't working.",
          "ko": "아쉽게도 와이파이가 안 돼요."
        }
      }
    ]
  },
  {
    "id": "it-f3-18",
    "stage": 3,
    "fn": "surprise",
    "pattern": "Sul serio? ___?",
    "core": [
      "Sul serio",
      "sul serio"
    ],
    "meaning": {
      "en": "Reacting with surprise: Seriously? ___?",
      "ko": "놀람 표현하기: 진짜? ___?"
    },
    "grammar": [],
    "expressions": [
      "sul serio"
    ],
    "examples": [
      {
        "text": "Sul serio? Non l'hai mai visto?",
        "slot": "Non l'hai mai visto",
        "cue": {
          "en": "you've never seen it",
          "ko": "한 번도 안 봤다"
        },
        "gloss": {
          "en": "Seriously? You've never seen it?",
          "ko": "진짜? 한 번도 안 봤어?"
        }
      },
      {
        "text": "Sul serio? Si è licenziato?",
        "slot": "Si è licenziato",
        "cue": {
          "en": "he quit",
          "ko": "그가 그만뒀다"
        },
        "gloss": {
          "en": "Seriously? He quit?",
          "ko": "진짜? 그만뒀어?"
        }
      },
      {
        "text": "Sul serio? Ti sposi?",
        "slot": "Ti sposi",
        "cue": {
          "en": "you're getting married",
          "ko": "결혼한다"
        },
        "gloss": {
          "en": "Seriously? You're getting married?",
          "ko": "진짜? 결혼해?"
        }
      },
      {
        "text": "Sul serio? Hai vinto tu?",
        "slot": "Hai vinto tu",
        "cue": {
          "en": "you won",
          "ko": "네가 이겼다"
        },
        "gloss": {
          "en": "Seriously? You won?",
          "ko": "진짜? 네가 이겼어?"
        }
      }
    ]
  },
  {
    "id": "it-f3-19",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Per fortuna ___.",
    "core": [
      "Per fortuna",
      "per fortuna"
    ],
    "meaning": {
      "en": "Saying what luckily happened: Luckily ___.",
      "ko": "다행이었던 일 말하기: 다행히 ___."
    },
    "grammar": [],
    "expressions": [
      "per fortuna"
    ],
    "examples": [
      {
        "text": "Per fortuna c'era ancora un posto.",
        "slot": "c'era ancora un posto",
        "cue": {
          "en": "there was still a seat",
          "ko": "아직 자리가 있었다"
        },
        "gloss": {
          "en": "Luckily there was still a seat.",
          "ko": "다행히 아직 자리가 있었어."
        }
      },
      {
        "text": "Per fortuna il tecnico è arrivato subito.",
        "slot": "il tecnico è arrivato subito",
        "cue": {
          "en": "the technician came right away",
          "ko": "기사가 바로 왔다"
        },
        "gloss": {
          "en": "Luckily the technician came right away.",
          "ko": "다행히 기사님이 바로 왔어."
        }
      },
      {
        "text": "Per fortuna avevo l'ombrello.",
        "slot": "avevo l'ombrello",
        "cue": {
          "en": "I had my umbrella",
          "ko": "우산이 있었다"
        },
        "gloss": {
          "en": "Luckily I had my umbrella.",
          "ko": "다행히 우산이 있었어."
        }
      },
      {
        "text": "Per fortuna Marco mi ha aiutato.",
        "slot": "Marco mi ha aiutato",
        "cue": {
          "en": "Marco helped me",
          "ko": "마르코가 도와줬다"
        },
        "gloss": {
          "en": "Luckily Marco helped me.",
          "ko": "다행히 마르코가 도와줬어."
        }
      }
    ]
  },
  {
    "id": "it-f3-20",
    "stage": 3,
    "fn": "wish",
    "pattern": "Magari ___!",
    "core": [
      "Magari",
      "magari"
    ],
    "meaning": {
      "en": "Hoping or suggesting softly: Maybe ___! / If only ___!",
      "ko": "바람·가벼운 제안: ___면 좋겠다!"
    },
    "grammar": [],
    "expressions": [
      "magari"
    ],
    "examples": [
      {
        "text": "Magari ci vediamo domani!",
        "slot": "ci vediamo domani",
        "cue": {
          "en": "we'll see each other tomorrow",
          "ko": "내일 보다"
        },
        "gloss": {
          "en": "Maybe we'll see each other tomorrow!",
          "ko": "내일 볼 수 있으면 좋겠다!"
        }
      },
      {
        "text": "Magari fosse vero!",
        "slot": "fosse vero",
        "cue": {
          "en": "it were true",
          "ko": "사실이다"
        },
        "gloss": {
          "en": "If only it were true!",
          "ko": "그게 사실이면 좋겠다!"
        }
      },
      {
        "text": "Magari la prossima volta!",
        "slot": "la prossima volta",
        "cue": {
          "en": "next time",
          "ko": "다음번"
        },
        "gloss": {
          "en": "Maybe next time!",
          "ko": "다음번엔 꼭!"
        }
      },
      {
        "text": "Magari la guardiamo insieme!",
        "slot": "la guardiamo insieme",
        "cue": {
          "en": "we watch it together",
          "ko": "같이 본다"
        },
        "gloss": {
          "en": "Maybe we can watch it together!",
          "ko": "같이 보면 좋겠다!"
        }
      }
    ]
  }
];
