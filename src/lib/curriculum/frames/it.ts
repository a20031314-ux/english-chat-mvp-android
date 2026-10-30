import type { Frame } from "../frames.ts";

/** 이탈리아어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  },
  {
    "id": "it-f4-01",
    "stage": 4,
    "fn": "advice-give",
    "pattern": "Sarebbe meglio ___.",
    "core": [
      "Sarebbe meglio",
      "sarebbe meglio"
    ],
    "meaning": {
      "en": "Suggesting a better option: It would be better to ___.",
      "ko": "더 나은 쪽 제안하기: ___하는 게 낫겠어요."
    },
    "grammar": [],
    "expressions": [
      "sarebbe meglio"
    ],
    "examples": [
      {
        "text": "Sarebbe meglio partire prima delle sette.",
        "slot": "partire prima delle sette",
        "cue": {
          "en": "leave before seven",
          "ko": "일곱 시 전에 출발하다"
        },
        "gloss": {
          "en": "It would be better to leave before seven.",
          "ko": "일곱 시 전에 출발하는 게 낫겠어요."
        }
      },
      {
        "text": "Secondo me sarebbe meglio aspettare la risposta del cliente.",
        "slot": "aspettare la risposta del cliente",
        "cue": {
          "en": "wait for the client's answer",
          "ko": "고객의 답을 기다리다"
        },
        "gloss": {
          "en": "In my opinion it would be better to wait for the client's answer.",
          "ko": "제 생각엔 고객의 답을 기다리는 게 낫겠어요."
        }
      },
      {
        "text": "Forse sarebbe meglio prenotare un tavolo.",
        "slot": "prenotare un tavolo",
        "cue": {
          "en": "book a table",
          "ko": "테이블을 예약하다"
        },
        "gloss": {
          "en": "Maybe it would be better to book a table.",
          "ko": "테이블을 예약하는 게 낫겠어요."
        }
      },
      {
        "text": "Sarebbe meglio dirlo subito a tutti.",
        "slot": "dirlo subito a tutti",
        "cue": {
          "en": "tell everyone right away",
          "ko": "모두에게 바로 말하다"
        },
        "gloss": {
          "en": "It would be better to tell everyone right away.",
          "ko": "모두에게 바로 말하는 게 낫겠어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-02",
    "stage": 4,
    "fn": "disagree-soft",
    "pattern": "Non credo che sia ___.",
    "core": [
      "Non credo che sia",
      "non credo che sia"
    ],
    "meaning": {
      "en": "Doubting politely with the subjunctive: I don't think it's ___.",
      "ko": "접속법으로 부드럽게 의심하기: ___라고는 생각하지 않아요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Non credo che sia una buona idea.",
        "slot": "una buona idea",
        "cue": {
          "en": "a good idea",
          "ko": "좋은 생각"
        },
        "gloss": {
          "en": "I don't think it's a good idea.",
          "ko": "좋은 생각 같지 않아요."
        }
      },
      {
        "text": "Non credo che sia il momento giusto per cambiare.",
        "slot": "il momento giusto per cambiare",
        "cue": {
          "en": "the right time to change",
          "ko": "바꿀 적절한 때"
        },
        "gloss": {
          "en": "I don't think it's the right time to change.",
          "ko": "지금이 바꿀 때라고는 생각하지 않아요."
        }
      },
      {
        "text": "A dire il vero, non credo che sia così semplice.",
        "slot": "così semplice",
        "cue": {
          "en": "that simple",
          "ko": "그렇게 간단한"
        },
        "gloss": {
          "en": "To be honest, I don't think it's that simple.",
          "ko": "사실 그렇게 간단하지는 않을 것 같아요."
        }
      },
      {
        "text": "Non credo che sia colpa sua.",
        "slot": "colpa sua",
        "cue": {
          "en": "his fault",
          "ko": "그의 잘못"
        },
        "gloss": {
          "en": "I don't think it's his fault.",
          "ko": "그 사람 잘못은 아닌 것 같아요."
        }
      }
    ]
  },
  {
    "id": "it-f4-03",
    "stage": 4,
    "fn": "wish",
    "pattern": "Spero che ___.",
    "core": [
      "Spero che",
      "spero che"
    ],
    "meaning": {
      "en": "Hoping, with the subjunctive: I hope that ___.",
      "ko": "접속법으로 바람 말하기: ___면 좋겠어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Spero che tu stia meglio.",
        "slot": "tu stia meglio",
        "cue": {
          "en": "you are feeling better",
          "ko": "네가 나아지다"
        },
        "gloss": {
          "en": "I hope you're feeling better.",
          "ko": "좀 나아졌으면 좋겠어."
        }
      },
      {
        "text": "Spero che il treno non sia in ritardo.",
        "slot": "il treno non sia in ritardo",
        "cue": {
          "en": "the train is not late",
          "ko": "기차가 늦지 않다"
        },
        "gloss": {
          "en": "I hope the train isn't late.",
          "ko": "기차가 늦지 않으면 좋겠어요."
        }
      },
      {
        "text": "Spero che abbiano capito il problema.",
        "slot": "abbiano capito il problema",
        "cue": {
          "en": "they have understood the problem",
          "ko": "그들이 문제를 이해했다"
        },
        "gloss": {
          "en": "I hope they've understood the problem.",
          "ko": "그 사람들이 문제를 이해했으면 좋겠어요."
        }
      },
      {
        "text": "Spero che vada tutto bene domani.",
        "slot": "vada tutto bene domani",
        "cue": {
          "en": "everything goes well tomorrow",
          "ko": "내일 다 잘되다"
        },
        "gloss": {
          "en": "I hope everything goes well tomorrow.",
          "ko": "내일 다 잘되면 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-04",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "Se avessi ___, …",
    "core": [
      "Se avessi",
      "se avessi"
    ],
    "meaning": {
      "en": "Imagining an unreal present (se + imperfect subjunctive + conditional): If I had ___, I would ___.",
      "ko": "지금과 다른 가정(se + 접속법 반과거 + 조건법): 내게 ___이 있다면 ~할 텐데."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Se avessi più tempo, imparerei a suonare la chitarra.",
        "slot": "più tempo, imparerei a suonare la chitarra",
        "cue": {
          "en": "more time, would learn the guitar",
          "ko": "시간이 더 있다, 기타를 배울 것이다"
        },
        "gloss": {
          "en": "If I had more time, I'd learn to play the guitar.",
          "ko": "시간이 더 있다면 기타를 배울 텐데요."
        }
      },
      {
        "text": "Se avessi una macchina, ti accompagnerei io.",
        "slot": "una macchina, ti accompagnerei io",
        "cue": {
          "en": "a car, would drive you myself",
          "ko": "차가 있다, 내가 데려다줄 것이다"
        },
        "gloss": {
          "en": "If I had a car, I'd take you myself.",
          "ko": "차가 있으면 내가 데려다줄 텐데."
        }
      },
      {
        "text": "Se avessi i soldi, comprerei una casa al mare.",
        "slot": "i soldi, comprerei una casa al mare",
        "cue": {
          "en": "the money, would buy a house by the sea",
          "ko": "돈이 있다, 바닷가 집을 살 것이다"
        },
        "gloss": {
          "en": "If I had the money, I'd buy a house by the sea.",
          "ko": "돈이 있다면 바닷가에 집을 살 텐데요."
        }
      },
      {
        "text": "Non so cosa farei se avessi il tuo problema.",
        "slot": "il tuo problema",
        "cue": {
          "en": "your problem",
          "ko": "네 문제"
        },
        "gloss": {
          "en": "I don't know what I'd do if I had your problem.",
          "ko": "내가 너 같은 문제가 있다면 어떻게 할지 모르겠어."
        }
      }
    ]
  },
  {
    "id": "it-f4-05",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "Avrei preferito ___.",
    "core": [
      "Avrei preferito",
      "avrei preferito"
    ],
    "meaning": {
      "en": "Saying what you would have preferred (past conditional): I would have preferred ___.",
      "ko": "조건법 과거로 아쉬움 말하기: ___였으면 더 좋았을 텐데요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Avrei preferito saperlo prima.",
        "slot": "saperlo prima",
        "cue": {
          "en": "know it earlier",
          "ko": "미리 알다"
        },
        "gloss": {
          "en": "I would have preferred to know earlier.",
          "ko": "미리 알았으면 좋았을 텐데요."
        }
      },
      {
        "text": "Avrei preferito un tavolo vicino alla finestra.",
        "slot": "un tavolo vicino alla finestra",
        "cue": {
          "en": "a table near the window",
          "ko": "창가 테이블"
        },
        "gloss": {
          "en": "I would have preferred a table near the window.",
          "ko": "창가 테이블이었으면 더 좋았을 텐데요."
        }
      },
      {
        "text": "Sinceramente avrei preferito restare a casa.",
        "slot": "restare a casa",
        "cue": {
          "en": "stay at home",
          "ko": "집에 있다"
        },
        "gloss": {
          "en": "Honestly, I would have preferred to stay at home.",
          "ko": "솔직히 집에 있는 게 더 좋았을 거예요."
        }
      },
      {
        "text": "Avrei preferito che me lo dicessi tu.",
        "slot": "che me lo dicessi tu",
        "cue": {
          "en": "that you told me yourself",
          "ko": "네가 직접 말해 주다"
        },
        "gloss": {
          "en": "I would have preferred you to tell me yourself.",
          "ko": "네가 직접 말해 줬으면 좋았을 텐데."
        }
      }
    ]
  },
  {
    "id": "it-f4-06",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "Avrei dovuto ___.",
    "core": [
      "Avrei dovuto",
      "avrei dovuto"
    ],
    "meaning": {
      "en": "Admitting what you should have done: I should have ___.",
      "ko": "해야 했던 일 인정하기: ___했어야 했는데요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Avrei dovuto chiamarti ieri sera.",
        "slot": "chiamarti ieri sera",
        "cue": {
          "en": "call you last night",
          "ko": "어젯밤 너에게 전화하다"
        },
        "gloss": {
          "en": "I should have called you last night.",
          "ko": "어젯밤에 전화했어야 했는데."
        }
      },
      {
        "text": "Avrei dovuto studiare di più per l'esame.",
        "slot": "studiare di più per l'esame",
        "cue": {
          "en": "study more for the exam",
          "ko": "시험공부를 더 하다"
        },
        "gloss": {
          "en": "I should have studied more for the exam.",
          "ko": "시험공부를 더 했어야 했어요."
        }
      },
      {
        "text": "Forse avrei dovuto dirglielo subito.",
        "slot": "dirglielo subito",
        "cue": {
          "en": "tell him right away",
          "ko": "그에게 바로 말하다"
        },
        "gloss": {
          "en": "Maybe I should have told him right away.",
          "ko": "그 사람한테 바로 말했어야 했나 봐요."
        }
      },
      {
        "text": "Avrei dovuto portare l'ombrello.",
        "slot": "portare l'ombrello",
        "cue": {
          "en": "bring the umbrella",
          "ko": "우산을 가져오다"
        },
        "gloss": {
          "en": "I should have brought the umbrella.",
          "ko": "우산을 가져왔어야 했어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-07",
    "stage": 4,
    "fn": "report",
    "pattern": "Mi ha detto che ___.",
    "core": [
      "Mi ha detto che",
      "mi ha detto che"
    ],
    "meaning": {
      "en": "Reporting what someone said, shifting tenses: He/She told me that ___.",
      "ko": "시제를 바꿔 남의 말 전하기: ___라고 했어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mi ha detto che sarebbe arrivato in ritardo.",
        "slot": "sarebbe arrivato in ritardo",
        "cue": {
          "en": "would arrive late",
          "ko": "늦게 도착할 것이다"
        },
        "gloss": {
          "en": "He told me he would arrive late.",
          "ko": "늦게 올 거라고 했어요."
        }
      },
      {
        "text": "Il medico mi ha detto che dovevo riposare.",
        "slot": "dovevo riposare",
        "cue": {
          "en": "had to rest",
          "ko": "쉬어야 했다"
        },
        "gloss": {
          "en": "The doctor told me I had to rest.",
          "ko": "의사가 쉬어야 한다고 했어요."
        }
      },
      {
        "text": "Mia sorella mi ha detto che avrebbe cambiato casa.",
        "slot": "avrebbe cambiato casa",
        "cue": {
          "en": "would move house",
          "ko": "이사할 것이다"
        },
        "gloss": {
          "en": "My sister told me she would move house.",
          "ko": "언니가 이사할 거라고 했어요."
        }
      },
      {
        "text": "Mi ha detto che non aveva mai visto il mare.",
        "slot": "non aveva mai visto il mare",
        "cue": {
          "en": "had never seen the sea",
          "ko": "바다를 본 적이 없었다"
        },
        "gloss": {
          "en": "She told me she had never seen the sea.",
          "ko": "바다를 한 번도 본 적이 없다고 했어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-08",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Va bene, purché ___.",
    "core": [
      "purché"
    ],
    "meaning": {
      "en": "Agreeing on a condition: All right, as long as ___.",
      "ko": "조건을 걸고 받아들이기: 좋아요, ___라면요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Va bene, purché tu mi avvisi prima.",
        "slot": "tu mi avvisi prima",
        "cue": {
          "en": "you let me know beforehand",
          "ko": "네가 미리 알려 주다"
        },
        "gloss": {
          "en": "All right, as long as you let me know beforehand.",
          "ko": "좋아, 미리 알려 주기만 하면."
        }
      },
      {
        "text": "Accetto, purché la consegna sia entro venerdì.",
        "slot": "la consegna sia entro venerdì",
        "cue": {
          "en": "delivery is by Friday",
          "ko": "납품이 금요일까지다"
        },
        "gloss": {
          "en": "I accept, as long as delivery is by Friday.",
          "ko": "금요일까지 납품한다면 받아들일게요."
        }
      },
      {
        "text": "Puoi usare la mia macchina, purché la riporti stasera.",
        "slot": "la riporti stasera",
        "cue": {
          "en": "you bring it back tonight",
          "ko": "오늘 밤 돌려주다"
        },
        "gloss": {
          "en": "You can use my car, as long as you bring it back tonight.",
          "ko": "오늘 밤에 돌려주기만 하면 내 차 써도 돼."
        }
      },
      {
        "text": "Firmo il contratto, purché l'affitto resti lo stesso.",
        "slot": "l'affitto resti lo stesso",
        "cue": {
          "en": "the rent stays the same",
          "ko": "월세가 그대로다"
        },
        "gloss": {
          "en": "I'll sign the contract, as long as the rent stays the same.",
          "ko": "월세가 그대로라면 계약할게요."
        }
      }
    ]
  },
  {
    "id": "it-f4-09",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Facciamo così, a meno che ___.",
    "core": [
      "a meno che"
    ],
    "meaning": {
      "en": "Setting a plan with an exception: Let's do this, unless ___.",
      "ko": "예외를 달아 정하기: 이렇게 해요, ___하지 않는 한."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Facciamo così, a meno che tu non abbia un'idea migliore.",
        "slot": "tu non abbia un'idea migliore",
        "cue": {
          "en": "you have a better idea",
          "ko": "더 좋은 생각이 있다"
        },
        "gloss": {
          "en": "Let's do this, unless you have a better idea.",
          "ko": "더 좋은 생각이 없으면 이렇게 하자."
        }
      },
      {
        "text": "Domani partiamo presto, a meno che non piova.",
        "slot": "non piova",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "We'll leave early tomorrow, unless it rains.",
          "ko": "비가 안 오면 내일 일찍 떠나요."
        }
      },
      {
        "text": "Ci vediamo alle otto, a meno che lei non preferisca un altro orario.",
        "slot": "lei non preferisca un altro orario",
        "cue": {
          "en": "you prefer another time (formal)",
          "ko": "다른 시간을 원하다(존댓말)"
        },
        "gloss": {
          "en": "See you at eight, unless you'd prefer another time.",
          "ko": "다른 시간이 더 좋으시지 않다면 여덟 시에 봬요."
        }
      },
      {
        "text": "Non cambio niente, a meno che il capo non me lo chieda.",
        "slot": "il capo non me lo chieda",
        "cue": {
          "en": "the boss asks me to",
          "ko": "상사가 요청하다"
        },
        "gloss": {
          "en": "I won't change anything, unless the boss asks me to.",
          "ko": "상사가 요청하지 않는 한 아무것도 안 바꿔요."
        }
      }
    ]
  },
  {
    "id": "it-f4-10",
    "stage": 4,
    "fn": "concede",
    "pattern": "Benché ___, …",
    "core": [
      "Benché",
      "benché"
    ],
    "meaning": {
      "en": "Conceding with the subjunctive: Although ___, ...",
      "ko": "접속법으로 양보하기: ___이긴 하지만 ~."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Benché sia stanco, vengo volentieri alla festa.",
        "slot": "sia stanco",
        "cue": {
          "en": "be tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "Although I'm tired, I'm happy to come to the party.",
          "ko": "피곤하긴 하지만 파티에 기꺼이 갈게요."
        }
      },
      {
        "text": "Benché costi molto, vale la pena provarlo.",
        "slot": "costi molto",
        "cue": {
          "en": "cost a lot",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "Although it costs a lot, it's worth trying.",
          "ko": "비싸긴 하지만 해 볼 만해요."
        }
      },
      {
        "text": "Ho accettato il lavoro, benché lo stipendio fosse basso.",
        "slot": "lo stipendio fosse basso",
        "cue": {
          "en": "the salary was low",
          "ko": "월급이 낮았다"
        },
        "gloss": {
          "en": "I took the job, although the salary was low.",
          "ko": "월급이 낮았지만 그 일을 받아들였어요."
        }
      },
      {
        "text": "Benché piovesse, siamo usciti lo stesso.",
        "slot": "piovesse",
        "cue": {
          "en": "it was raining",
          "ko": "비가 오고 있었다"
        },
        "gloss": {
          "en": "Although it was raining, we went out anyway.",
          "ko": "비가 왔지만 그래도 나갔어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-11",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "Di solito viene ___.",
    "core": [
      "Di solito viene",
      "di solito viene"
    ],
    "meaning": {
      "en": "Explaining how things are done (passive with venire): Usually it is ___.",
      "ko": "venire 수동으로 절차 설명하기: 보통 ___돼요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Di solito viene pagato a fine mese.",
        "slot": "pagato a fine mese",
        "cue": {
          "en": "paid at the end of the month",
          "ko": "월말에 지급되다"
        },
        "gloss": {
          "en": "It's usually paid at the end of the month.",
          "ko": "보통 월말에 지급돼요."
        }
      },
      {
        "text": "Il pacco di solito viene consegnato in due giorni.",
        "slot": "consegnato in due giorni",
        "cue": {
          "en": "delivered in two days",
          "ko": "이틀 안에 배송되다"
        },
        "gloss": {
          "en": "The parcel is usually delivered in two days.",
          "ko": "소포는 보통 이틀 안에 배송돼요."
        }
      },
      {
        "text": "Di solito viene controllato dal responsabile.",
        "slot": "controllato dal responsabile",
        "cue": {
          "en": "checked by the manager",
          "ko": "책임자가 확인하다"
        },
        "gloss": {
          "en": "It's usually checked by the manager.",
          "ko": "보통 책임자가 확인해요."
        }
      },
      {
        "text": "Questo piatto di solito viene servito con il pane.",
        "slot": "servito con il pane",
        "cue": {
          "en": "served with bread",
          "ko": "빵과 함께 나오다"
        },
        "gloss": {
          "en": "This dish is usually served with bread.",
          "ko": "이 요리는 보통 빵과 함께 나와요."
        }
      }
    ]
  },
  {
    "id": "it-f4-12",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "Qui si ___.",
    "core": [
      "Qui si",
      "qui si"
    ],
    "meaning": {
      "en": "Saying what is done here (si passivante): Here one ___ / ___ is done here.",
      "ko": "si 수동으로 여기서 하는 일 말하기: 여기선 ___해요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Qui si parlano tre lingue.",
        "slot": "parlano tre lingue",
        "cue": {
          "en": "three languages are spoken",
          "ko": "세 가지 언어를 쓰다"
        },
        "gloss": {
          "en": "Three languages are spoken here.",
          "ko": "여기선 세 가지 언어를 써요."
        }
      },
      {
        "text": "Qui si vendono i biglietti per il concerto.",
        "slot": "vendono i biglietti per il concerto",
        "cue": {
          "en": "concert tickets are sold",
          "ko": "콘서트 표를 팔다"
        },
        "gloss": {
          "en": "Concert tickets are sold here.",
          "ko": "여기서 콘서트 표를 팔아요."
        }
      },
      {
        "text": "Scusi, qui si paga alla cassa?",
        "slot": "paga alla cassa",
        "cue": {
          "en": "pay at the till",
          "ko": "계산대에서 계산하다"
        },
        "gloss": {
          "en": "Excuse me, do you pay at the till here?",
          "ko": "실례지만 여기선 계산대에서 계산하나요?"
        }
      },
      {
        "text": "Qui si mangia benissimo.",
        "slot": "mangia benissimo",
        "cue": {
          "en": "eat very well",
          "ko": "아주 잘 먹다"
        },
        "gloss": {
          "en": "You eat really well here.",
          "ko": "여기 음식 정말 맛있어요."
        }
      }
    ]
  },
  {
    "id": "it-f4-13",
    "stage": 4,
    "fn": "describe-person",
    "pattern": "È la persona con cui ___.",
    "core": [
      "con cui"
    ],
    "meaning": {
      "en": "Describing someone or something with a relative (con cui): the person I ___ with.",
      "ko": "관계대명사 con cui로 설명하기: 내가 함께 ___한 사람."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "È il collega con cui lavoro da tre anni.",
        "slot": "lavoro da tre anni",
        "cue": {
          "en": "have worked for three years",
          "ko": "삼 년째 함께 일하다"
        },
        "gloss": {
          "en": "He's the colleague I've worked with for three years.",
          "ko": "삼 년째 같이 일하는 동료예요."
        }
      },
      {
        "text": "È l'amica con cui sono andata in Spagna.",
        "slot": "sono andata in Spagna",
        "cue": {
          "en": "went to Spain (female)",
          "ko": "스페인에 갔다(여성)"
        },
        "gloss": {
          "en": "She's the friend I went to Spain with.",
          "ko": "같이 스페인에 갔던 친구예요."
        }
      },
      {
        "text": "Non trovo la penna con cui ho firmato il contratto.",
        "slot": "ho firmato il contratto",
        "cue": {
          "en": "signed the contract",
          "ko": "계약서에 서명했다"
        },
        "gloss": {
          "en": "I can't find the pen I signed the contract with.",
          "ko": "계약서에 서명한 펜을 못 찾겠어요."
        }
      },
      {
        "text": "Ecco la signora con cui ho parlato ieri.",
        "slot": "ho parlato ieri",
        "cue": {
          "en": "talked yesterday",
          "ko": "어제 이야기했다"
        },
        "gloss": {
          "en": "Here's the lady I spoke with yesterday.",
          "ko": "어제 이야기한 분이 저기 계세요."
        }
      }
    ]
  },
  {
    "id": "it-f4-14",
    "stage": 4,
    "fn": "describe-thing",
    "pattern": "È un progetto per il quale ___.",
    "core": [
      "per il quale"
    ],
    "meaning": {
      "en": "Adding detail with il quale: a project for which ___.",
      "ko": "관계대명사 il quale로 덧붙이기: ___한 (그) 일."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "È un progetto per il quale abbiamo lavorato molto.",
        "slot": "abbiamo lavorato molto",
        "cue": {
          "en": "we worked a lot",
          "ko": "많이 일했다"
        },
        "gloss": {
          "en": "It's a project we worked hard on.",
          "ko": "우리가 많이 공들인 프로젝트예요."
        }
      },
      {
        "text": "Il motivo per il quale ti chiamo è semplice.",
        "slot": "ti chiamo",
        "cue": {
          "en": "I'm calling you",
          "ko": "너에게 전화하다"
        },
        "gloss": {
          "en": "The reason I'm calling you is simple.",
          "ko": "전화한 이유는 간단해."
        }
      },
      {
        "text": "È un premio per il quale ha lottato tutta la vita.",
        "slot": "ha lottato tutta la vita",
        "cue": {
          "en": "fought all his life",
          "ko": "평생 애썼다"
        },
        "gloss": {
          "en": "It's a prize he fought for all his life.",
          "ko": "그가 평생 애써 온 상이에요."
        }
      },
      {
        "text": "Questo è il cliente per il quale abbiamo preparato l'offerta.",
        "slot": "abbiamo preparato l'offerta",
        "cue": {
          "en": "we prepared the offer",
          "ko": "제안서를 준비했다"
        },
        "gloss": {
          "en": "This is the client we prepared the offer for.",
          "ko": "이분이 우리가 제안서를 준비한 고객이에요."
        }
      }
    ]
  },
  {
    "id": "it-f4-15",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Da un lato ___, dall'altro …",
    "core": [
      "Da un lato",
      "da un lato"
    ],
    "meaning": {
      "en": "Weighing two sides: On the one hand ___, on the other ...",
      "ko": "양쪽 따지기: 한편으로는 ___, 다른 한편으로는 ~."
    },
    "grammar": [],
    "expressions": [
      "da un lato",
      "dall'altro"
    ],
    "examples": [
      {
        "text": "Da un lato è comodo, dall'altro costa troppo.",
        "slot": "è comodo",
        "cue": {
          "en": "it's convenient",
          "ko": "편하다"
        },
        "gloss": {
          "en": "On the one hand it's convenient, on the other it costs too much.",
          "ko": "편하긴 한데 너무 비싸요."
        }
      },
      {
        "text": "Da un lato vorrei restare, dall'altro ho bisogno di cambiare.",
        "slot": "vorrei restare",
        "cue": {
          "en": "I'd like to stay",
          "ko": "남고 싶다"
        },
        "gloss": {
          "en": "On the one hand I'd like to stay, on the other I need a change.",
          "ko": "한편으로는 남고 싶지만 다른 한편으로는 변화가 필요해요."
        }
      },
      {
        "text": "Da un lato il lavoro da casa fa risparmiare tempo, dall'altro ci si sente soli.",
        "slot": "il lavoro da casa fa risparmiare tempo",
        "cue": {
          "en": "working from home saves time",
          "ko": "재택근무는 시간을 아껴 준다"
        },
        "gloss": {
          "en": "On the one hand working from home saves time, on the other you feel lonely.",
          "ko": "재택근무는 시간을 아껴 주지만 한편으론 외로워요."
        }
      },
      {
        "text": "Il centro è bello: da un lato ci sono tanti negozi, dall'altro c'è troppo traffico.",
        "slot": "ci sono tanti negozi",
        "cue": {
          "en": "there are lots of shops",
          "ko": "가게가 많다"
        },
        "gloss": {
          "en": "The centre is nice: on the one hand there are lots of shops, on the other there's too much traffic.",
          "ko": "시내는 좋아요. 가게는 많은데 차가 너무 막혀요."
        }
      }
    ]
  },
  {
    "id": "it-f4-16",
    "stage": 4,
    "fn": "opinion",
    "pattern": "Il punto è che ___.",
    "core": [
      "Il punto è che",
      "il punto è che"
    ],
    "meaning": {
      "en": "Getting to the heart of the matter: The point is that ___.",
      "ko": "핵심 짚기: 요점은 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "il punto è"
    ],
    "examples": [
      {
        "text": "Il punto è che nessuno ci ha avvisato.",
        "slot": "nessuno ci ha avvisato",
        "cue": {
          "en": "nobody warned us",
          "ko": "아무도 알려 주지 않았다"
        },
        "gloss": {
          "en": "The point is that nobody warned us.",
          "ko": "요점은 아무도 우리한테 알려 주지 않았다는 거예요."
        }
      },
      {
        "text": "Hai ragione, ma il punto è che non abbiamo tempo.",
        "slot": "non abbiamo tempo",
        "cue": {
          "en": "we don't have time",
          "ko": "시간이 없다"
        },
        "gloss": {
          "en": "You're right, but the point is we don't have time.",
          "ko": "맞는 말인데, 문제는 시간이 없다는 거예요."
        }
      },
      {
        "text": "Il punto è che il prezzo è salito troppo.",
        "slot": "il prezzo è salito troppo",
        "cue": {
          "en": "the price has gone up too much",
          "ko": "값이 너무 올랐다"
        },
        "gloss": {
          "en": "The point is that the price has gone up too much.",
          "ko": "요점은 값이 너무 올랐다는 거예요."
        }
      },
      {
        "text": "Il punto è che dobbiamo decidere oggi.",
        "slot": "dobbiamo decidere oggi",
        "cue": {
          "en": "we have to decide today",
          "ko": "오늘 정해야 한다"
        },
        "gloss": {
          "en": "The point is that we have to decide today.",
          "ko": "요점은 오늘 정해야 한다는 거예요."
        }
      }
    ]
  },
  {
    "id": "it-f4-17",
    "stage": 4,
    "fn": "concede",
    "pattern": "Hai ragione, ma ___.",
    "core": [
      "Hai ragione",
      "hai ragione"
    ],
    "meaning": {
      "en": "Conceding a point, then adding yours: You're right, but ___.",
      "ko": "일부 인정하고 내 말 붙이기: 네 말이 맞아, 하지만 ___."
    },
    "grammar": [],
    "expressions": [
      "hai ragione"
    ],
    "examples": [
      {
        "text": "Hai ragione, ma il prezzo è troppo alto.",
        "slot": "il prezzo è troppo alto",
        "cue": {
          "en": "the price is too high",
          "ko": "값이 너무 비싸다"
        },
        "gloss": {
          "en": "You're right, but the price is too high.",
          "ko": "네 말이 맞아, 그런데 값이 너무 비싸."
        }
      },
      {
        "text": "Forse hai ragione, ma io ci proverei lo stesso.",
        "slot": "io ci proverei lo stesso",
        "cue": {
          "en": "I'd try anyway",
          "ko": "그래도 해 볼 것이다"
        },
        "gloss": {
          "en": "Maybe you're right, but I'd try anyway.",
          "ko": "네 말이 맞을지도 모르지만 난 그래도 해 볼래."
        }
      },
      {
        "text": "Hai ragione, ma non possiamo cambiare tutto adesso.",
        "slot": "non possiamo cambiare tutto adesso",
        "cue": {
          "en": "we can't change everything now",
          "ko": "지금 다 바꿀 수는 없다"
        },
        "gloss": {
          "en": "You're right, but we can't change everything now.",
          "ko": "맞아, 그런데 지금 다 바꿀 순 없어."
        }
      },
      {
        "text": "Su questo hai ragione, ma il problema resta.",
        "slot": "il problema resta",
        "cue": {
          "en": "the problem remains",
          "ko": "문제는 남는다"
        },
        "gloss": {
          "en": "You're right about that, but the problem remains.",
          "ko": "그 점은 맞는데 문제는 그대로야."
        }
      }
    ]
  },
  {
    "id": "it-f4-18",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "Non mi sembra ___.",
    "core": [
      "Non mi sembra",
      "non mi sembra"
    ],
    "meaning": {
      "en": "Objecting gently: It doesn't seem ___ to me.",
      "ko": "부드럽게 반대하기: ___ 같지 않아요."
    },
    "grammar": [],
    "expressions": [
      "non mi sembra"
    ],
    "examples": [
      {
        "text": "Non mi sembra giusto.",
        "slot": "giusto",
        "cue": {
          "en": "fair",
          "ko": "공정한"
        },
        "gloss": {
          "en": "It doesn't seem fair to me.",
          "ko": "공정하지 않은 것 같아요."
        }
      },
      {
        "text": "Non mi sembra il momento di parlarne.",
        "slot": "il momento di parlarne",
        "cue": {
          "en": "the time to talk about it",
          "ko": "그 얘기를 할 때"
        },
        "gloss": {
          "en": "It doesn't seem the time to talk about it.",
          "ko": "지금 그 얘기를 할 때는 아닌 것 같아요."
        }
      },
      {
        "text": "Sinceramente non mi sembra una buona idea.",
        "slot": "una buona idea",
        "cue": {
          "en": "a good idea",
          "ko": "좋은 생각"
        },
        "gloss": {
          "en": "Honestly, it doesn't seem a good idea to me.",
          "ko": "솔직히 좋은 생각 같지 않아요."
        }
      },
      {
        "text": "Non mi sembra possibile pagare così tanto.",
        "slot": "possibile pagare così tanto",
        "cue": {
          "en": "possible to pay so much",
          "ko": "그렇게 많이 내는 게 가능한"
        },
        "gloss": {
          "en": "It doesn't seem possible to pay so much.",
          "ko": "그렇게 많이 내야 한다니 말이 안 되는 것 같아요."
        }
      }
    ]
  },
  {
    "id": "it-f4-19",
    "stage": 4,
    "fn": "persuade",
    "pattern": "Vale la pena ___.",
    "core": [
      "Vale la pena",
      "vale la pena"
    ],
    "meaning": {
      "en": "Persuading that something is worth it: It's worth ___.",
      "ko": "해 볼 가치가 있다고 설득하기: ___할 만해요."
    },
    "grammar": [],
    "expressions": [
      "vale la pena"
    ],
    "examples": [
      {
        "text": "Vale la pena provarci.",
        "slot": "provarci",
        "cue": {
          "en": "give it a try",
          "ko": "시도해 보다"
        },
        "gloss": {
          "en": "It's worth a try.",
          "ko": "해 볼 만해요."
        }
      },
      {
        "text": "Secondo me vale la pena visitare il museo.",
        "slot": "visitare il museo",
        "cue": {
          "en": "visit the museum",
          "ko": "박물관에 가 보다"
        },
        "gloss": {
          "en": "In my opinion the museum is worth visiting.",
          "ko": "제 생각엔 박물관은 가 볼 만해요."
        }
      },
      {
        "text": "Non vale la pena arrabbiarsi per così poco.",
        "slot": "arrabbiarsi per così poco",
        "cue": {
          "en": "get angry over so little",
          "ko": "그런 일로 화내다"
        },
        "gloss": {
          "en": "It's not worth getting angry over so little.",
          "ko": "그런 일로 화낼 필요 없어요."
        }
      },
      {
        "text": "Vale la pena aspettare qualche giorno.",
        "slot": "aspettare qualche giorno",
        "cue": {
          "en": "wait a few days",
          "ko": "며칠 기다리다"
        },
        "gloss": {
          "en": "It's worth waiting a few days.",
          "ko": "며칠 기다릴 만해요."
        }
      }
    ]
  },
  {
    "id": "it-f4-20",
    "stage": 4,
    "fn": "change-topic",
    "pattern": "Per quanto riguarda ___, ...",
    "core": [
      "Per quanto riguarda",
      "per quanto riguarda"
    ],
    "meaning": {
      "en": "Turning to a specific point: As for ___, ...",
      "ko": "주제 하나로 넘어가기: ___에 대해서는 ~."
    },
    "grammar": [],
    "expressions": [
      "per quanto riguarda"
    ],
    "examples": [
      {
        "text": "Per quanto riguarda il pagamento, possiamo parlarne domani.",
        "slot": "il pagamento",
        "cue": {
          "en": "the payment",
          "ko": "결제"
        },
        "gloss": {
          "en": "As for the payment, we can talk about it tomorrow.",
          "ko": "결제는 내일 이야기해요."
        }
      },
      {
        "text": "Per quanto riguarda l'orario, per me va bene tutto.",
        "slot": "l'orario",
        "cue": {
          "en": "the time",
          "ko": "시간"
        },
        "gloss": {
          "en": "As for the time, anything works for me.",
          "ko": "시간은 저는 다 괜찮아요."
        }
      },
      {
        "text": "E per quanto riguarda le ferie, hai già deciso?",
        "slot": "le ferie",
        "cue": {
          "en": "the holidays",
          "ko": "휴가"
        },
        "gloss": {
          "en": "And as for the holidays, have you decided yet?",
          "ko": "그리고 휴가는 벌써 정했어?"
        }
      },
      {
        "text": "Per quanto riguarda il contratto, aspetto la sua risposta.",
        "slot": "il contratto",
        "cue": {
          "en": "the contract",
          "ko": "계약"
        },
        "gloss": {
          "en": "As for the contract, I'm waiting for your reply.",
          "ko": "계약은 답을 기다리겠습니다."
        }
      }
    ]
  },
  {
    "id": "it-f5-01",
    "stage": 5,
    "fn": "hypothetical",
    "pattern": "Se avessi accettato ___, adesso …",
    "core": [
      "Se avessi accettato",
      "se avessi accettato"
    ],
    "meaning": {
      "en": "Mixed conditional (past choice, present result): If I had accepted ___, now I would ___.",
      "ko": "섞인 가정(과거 선택, 지금 결과): 그때 ___을 받아들였다면 지금쯤 ~할 텐데."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Se avessi accettato quell'offerta, adesso vivrei a Torino.",
        "slot": "vivrei a Torino",
        "cue": {
          "en": "would live in Turin",
          "ko": "토리노에 살고 있을 것이다"
        },
        "gloss": {
          "en": "If I had accepted that offer, I'd be living in Turin now.",
          "ko": "그 제안을 받아들였다면 지금 토리노에 살고 있을 텐데요."
        }
      },
      {
        "text": "Se avessi accettato il suo consiglio, adesso non sarei in questo guaio.",
        "slot": "non sarei in questo guaio",
        "cue": {
          "en": "wouldn't be in this mess",
          "ko": "이런 곤란에 빠져 있지 않을 것이다"
        },
        "gloss": {
          "en": "If I had taken his advice, I wouldn't be in this mess now.",
          "ko": "그 조언을 들었다면 지금 이런 곤란은 없을 텐데요."
        }
      },
      {
        "text": "Se avessi accettato quel lavoro, adesso guadagnerei di più.",
        "slot": "guadagnerei di più",
        "cue": {
          "en": "would earn more",
          "ko": "돈을 더 벌 것이다"
        },
        "gloss": {
          "en": "If I had taken that job, I'd be earning more now.",
          "ko": "그 일을 맡았다면 지금 돈을 더 벌고 있을 텐데요."
        }
      },
      {
        "text": "Chissà, se avessi accettato l'invito, adesso sarei in vacanza con loro.",
        "slot": "sarei in vacanza con loro",
        "cue": {
          "en": "would be on holiday with them",
          "ko": "그들과 휴가 중일 것이다"
        },
        "gloss": {
          "en": "Who knows, if I had accepted the invitation, I'd be on holiday with them now.",
          "ko": "그 초대를 받아들였다면 지금쯤 그 사람들과 휴가 중일지도 몰라요."
        }
      }
    ]
  },
  {
    "id": "it-f5-02",
    "stage": 5,
    "fn": "negotiate",
    "pattern": "Cerco una soluzione che ___.",
    "core": [
      "una soluzione che"
    ],
    "meaning": {
      "en": "Describing what you need, with the subjunctive in a relative clause: a solution that ___.",
      "ko": "관계절 접속법으로 원하는 것 말하기: ___하는 해결책."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Cerco una soluzione che funzioni per tutti.",
        "slot": "funzioni per tutti",
        "cue": {
          "en": "works for everyone",
          "ko": "모두에게 맞다"
        },
        "gloss": {
          "en": "I'm looking for a solution that works for everyone.",
          "ko": "모두에게 맞는 해결책을 찾고 있어요."
        }
      },
      {
        "text": "Ci serve una soluzione che non costi troppo.",
        "slot": "non costi troppo",
        "cue": {
          "en": "doesn't cost too much",
          "ko": "너무 비싸지 않다"
        },
        "gloss": {
          "en": "We need a solution that doesn't cost too much.",
          "ko": "너무 비싸지 않은 해결책이 필요해요."
        }
      },
      {
        "text": "Vorrei trovare una soluzione che piaccia anche ai clienti.",
        "slot": "piaccia anche ai clienti",
        "cue": {
          "en": "the clients like too",
          "ko": "고객도 좋아하다"
        },
        "gloss": {
          "en": "I'd like to find a solution the clients like too.",
          "ko": "고객도 좋아할 해결책을 찾고 싶어요."
        }
      },
      {
        "text": "Proponiamo una soluzione che sia più semplice da usare.",
        "slot": "sia più semplice da usare",
        "cue": {
          "en": "is easier to use",
          "ko": "쓰기 더 쉽다"
        },
        "gloss": {
          "en": "We're proposing a solution that is easier to use.",
          "ko": "쓰기 더 쉬운 해결책을 제안합니다."
        }
      }
    ]
  },
  {
    "id": "it-f5-03",
    "stage": 5,
    "fn": "describe-person",
    "pattern": "È l'unica persona che ___.",
    "core": [
      "l'unica persona che"
    ],
    "meaning": {
      "en": "Singling someone out (subjunctive after l'unico): the only person who ___.",
      "ko": "유일한 사람 짚기(접속법): ___하는 유일한 사람."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "È l'unica persona che mi capisca davvero.",
        "slot": "mi capisca davvero",
        "cue": {
          "en": "really understands me",
          "ko": "나를 정말 이해하다"
        },
        "gloss": {
          "en": "She's the only person who really understands me.",
          "ko": "나를 정말 이해하는 유일한 사람이에요."
        }
      },
      {
        "text": "Sei l'unica persona che sappia la verità.",
        "slot": "sappia la verità",
        "cue": {
          "en": "knows the truth",
          "ko": "진실을 알다"
        },
        "gloss": {
          "en": "You're the only person who knows the truth.",
          "ko": "진실을 아는 사람은 너뿐이야."
        }
      },
      {
        "text": "Era l'unica persona che parlasse tedesco in ufficio.",
        "slot": "parlasse tedesco in ufficio",
        "cue": {
          "en": "spoke German in the office",
          "ko": "사무실에서 독일어를 했다"
        },
        "gloss": {
          "en": "She was the only person in the office who spoke German.",
          "ko": "사무실에서 독일어를 하는 사람은 그녀뿐이었어요."
        }
      },
      {
        "text": "Elena è l'unica persona che abbia letto tutto il rapporto.",
        "slot": "abbia letto tutto il rapporto",
        "cue": {
          "en": "has read the whole report",
          "ko": "보고서를 다 읽었다"
        },
        "gloss": {
          "en": "Elena is the only person who has read the whole report.",
          "ko": "보고서를 다 읽은 사람은 엘레나뿐이에요."
        }
      }
    ]
  },
  {
    "id": "it-f5-04",
    "stage": 5,
    "fn": "concession",
    "pattern": "Per quanto ___, …",
    "core": [
      "Per quanto",
      "per quanto"
    ],
    "meaning": {
      "en": "Conceding however much (subjunctive): However ___, ...",
      "ko": "아무리 ~해도(접속법): 아무리 ___해도 ~."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Per quanto sia difficile, voglio provarci.",
        "slot": "sia difficile",
        "cue": {
          "en": "be difficult",
          "ko": "어렵다"
        },
        "gloss": {
          "en": "However difficult it is, I want to try.",
          "ko": "아무리 어려워도 해 보고 싶어요."
        }
      },
      {
        "text": "Per quanto mi piaccia il mare, non ci vivrei.",
        "slot": "mi piaccia il mare",
        "cue": {
          "en": "I like the sea",
          "ko": "바다를 좋아하다"
        },
        "gloss": {
          "en": "Much as I like the sea, I wouldn't live there.",
          "ko": "바다를 아무리 좋아해도 거기 살지는 않을 거예요."
        }
      },
      {
        "text": "Il film, per quanto sia lungo, non annoia mai.",
        "slot": "sia lungo",
        "cue": {
          "en": "be long",
          "ko": "길다"
        },
        "gloss": {
          "en": "The film, long as it is, is never boring.",
          "ko": "그 영화는 길긴 해도 전혀 지루하지 않아요."
        }
      },
      {
        "text": "Per quanto ci abbia pensato, non ho trovato una risposta.",
        "slot": "ci abbia pensato",
        "cue": {
          "en": "I've thought about it",
          "ko": "그것을 생각해 봤다"
        },
        "gloss": {
          "en": "However much I've thought about it, I haven't found an answer.",
          "ko": "아무리 생각해도 답을 못 찾았어요."
        }
      }
    ]
  },
  {
    "id": "it-f5-05",
    "stage": 5,
    "fn": "cannot",
    "pattern": "Non ce la faccio a ___.",
    "core": [
      "Non ce la faccio",
      "non ce la faccio"
    ],
    "meaning": {
      "en": "Saying you can't manage (farcela): I can't manage to ___.",
      "ko": "farcela로 버겁다고 말하기: ___하는 건 못 하겠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Non ce la faccio a finire tutto entro stasera.",
        "slot": "finire tutto entro stasera",
        "cue": {
          "en": "finish everything by tonight",
          "ko": "오늘 밤까지 다 끝내다"
        },
        "gloss": {
          "en": "I can't manage to finish everything by tonight.",
          "ko": "오늘 밤까지 다 끝내는 건 무리예요."
        }
      },
      {
        "text": "Scusa, non ce la faccio a venire alla cena.",
        "slot": "venire alla cena",
        "cue": {
          "en": "come to the dinner",
          "ko": "저녁 모임에 가다"
        },
        "gloss": {
          "en": "Sorry, I can't make it to the dinner.",
          "ko": "미안, 저녁 모임엔 못 갈 것 같아."
        }
      },
      {
        "text": "Non ce la faccio più a sentire questo rumore.",
        "slot": "sentire questo rumore",
        "cue": {
          "en": "hear this noise",
          "ko": "이 소음을 듣다"
        },
        "gloss": {
          "en": "I can't stand hearing this noise any more.",
          "ko": "이 소음은 더는 못 참겠어요."
        }
      },
      {
        "text": "Da sola non ce la faccio a spostare il divano.",
        "slot": "spostare il divano",
        "cue": {
          "en": "move the sofa",
          "ko": "소파를 옮기다"
        },
        "gloss": {
          "en": "I can't move the sofa on my own.",
          "ko": "혼자서는 소파를 못 옮기겠어요."
        }
      }
    ]
  },
  {
    "id": "it-f5-06",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "Non prendertela, ___.",
    "core": [
      "Non prendertela",
      "non prendertela"
    ],
    "meaning": {
      "en": "Telling someone not to take it badly (prendersela): Don't take it personally, ___.",
      "ko": "prendersela로 달래기: 기분 나빠하지 마, ___."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Non prendertela, non lo ha detto con cattiveria.",
        "slot": "non lo ha detto con cattiveria",
        "cue": {
          "en": "he didn't say it to be mean",
          "ko": "나쁜 뜻으로 말한 게 아니다"
        },
        "gloss": {
          "en": "Don't take it badly, he didn't mean it nastily.",
          "ko": "기분 나빠하지 마, 나쁜 뜻으로 한 말 아니야."
        }
      },
      {
        "text": "Dai, non prendertela, capita a tutti.",
        "slot": "capita a tutti",
        "cue": {
          "en": "it happens to everyone",
          "ko": "누구에게나 일어난다"
        },
        "gloss": {
          "en": "Come on, don't take it to heart, it happens to everyone.",
          "ko": "에이, 속상해하지 마, 누구나 그래."
        }
      },
      {
        "text": "Non prendertela, la prossima volta andrà meglio.",
        "slot": "la prossima volta andrà meglio",
        "cue": {
          "en": "next time will go better",
          "ko": "다음엔 더 잘될 것이다"
        },
        "gloss": {
          "en": "Don't get upset, next time it'll go better.",
          "ko": "속상해하지 마, 다음엔 더 잘될 거야."
        }
      },
      {
        "text": "Non prendertela troppo, è solo un esame.",
        "slot": "è solo un esame",
        "cue": {
          "en": "it's only an exam",
          "ko": "그냥 시험일 뿐이다"
        },
        "gloss": {
          "en": "Don't take it too hard, it's only an exam.",
          "ko": "너무 속상해하지 마, 그냥 시험이잖아."
        }
      }
    ]
  },
  {
    "id": "it-f5-07",
    "stage": 5,
    "fn": "compliment",
    "pattern": "Te la caverai ___.",
    "core": [
      "te la cav",
      "Te la cav"
    ],
    "meaning": {
      "en": "Reassuring someone they'll manage (cavarsela): You'll get by ___.",
      "ko": "cavarsela로 북돋우기: 넌 ___ 잘 해낼 거야."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Te la caverai benissimo, vedrai.",
        "slot": "benissimo",
        "cue": {
          "en": "very well",
          "ko": "아주 잘"
        },
        "gloss": {
          "en": "You'll do just fine, you'll see.",
          "ko": "아주 잘 해낼 거야, 두고 봐."
        }
      },
      {
        "text": "Con il francese te la cavi bene.",
        "slot": "bene",
        "cue": {
          "en": "well",
          "ko": "잘"
        },
        "gloss": {
          "en": "You get by well in French.",
          "ko": "프랑스어는 꽤 하네."
        }
      },
      {
        "text": "Non preoccuparti, te la caverai anche questa volta.",
        "slot": "anche questa volta",
        "cue": {
          "en": "this time too",
          "ko": "이번에도"
        },
        "gloss": {
          "en": "Don't worry, you'll manage this time too.",
          "ko": "걱정 마, 이번에도 잘 넘길 거야."
        }
      },
      {
        "text": "Tu te la cavi sempre, anche nei momenti difficili.",
        "slot": "anche nei momenti difficili",
        "cue": {
          "en": "even in hard moments",
          "ko": "힘든 때에도"
        },
        "gloss": {
          "en": "You always manage, even in hard times.",
          "ko": "넌 힘들 때도 늘 잘 헤쳐 나가잖아."
        }
      }
    ]
  },
  {
    "id": "it-f5-08",
    "stage": 5,
    "fn": "hearsay",
    "pattern": "A quanto pare ___.",
    "core": [
      "A quanto pare",
      "a quanto pare"
    ],
    "meaning": {
      "en": "Passing on unconfirmed news (conditional of distance): Apparently ___.",
      "ko": "확인 안 된 소식 전하기(거리 두는 조건법): 듣자 하니 ___래요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "a quanto pare"
    ],
    "examples": [
      {
        "text": "A quanto pare il ristorante avrebbe chiuso per sempre.",
        "slot": "il ristorante avrebbe chiuso per sempre",
        "cue": {
          "en": "the restaurant has closed for good",
          "ko": "그 식당이 영영 문을 닫았다"
        },
        "gloss": {
          "en": "Apparently the restaurant has closed for good.",
          "ko": "듣자 하니 그 식당이 아예 문을 닫았대요."
        }
      },
      {
        "text": "A quanto pare il direttore se ne sarebbe già andato.",
        "slot": "il direttore se ne sarebbe già andato",
        "cue": {
          "en": "the director has already left",
          "ko": "관리자가 벌써 떠났다"
        },
        "gloss": {
          "en": "Apparently the director has already left.",
          "ko": "듣자 하니 관리자가 벌써 떠났대요."
        }
      },
      {
        "text": "A quanto pare i biglietti sarebbero già finiti.",
        "slot": "i biglietti sarebbero già finiti",
        "cue": {
          "en": "the tickets have already sold out",
          "ko": "표가 벌써 다 팔렸다"
        },
        "gloss": {
          "en": "Apparently the tickets have already sold out.",
          "ko": "표가 벌써 매진됐대요."
        }
      },
      {
        "text": "Il negozio, a quanto pare, aprirebbe di nuovo a marzo.",
        "slot": "aprirebbe di nuovo a marzo",
        "cue": {
          "en": "would reopen in March",
          "ko": "삼월에 다시 연다"
        },
        "gloss": {
          "en": "The shop, apparently, is reopening in March.",
          "ko": "그 가게는 삼월에 다시 연대요."
        }
      }
    ]
  },
  {
    "id": "it-f5-09",
    "stage": 5,
    "fn": "hearsay",
    "pattern": "Secondo i giornali, ___.",
    "core": [
      "Secondo i giornali",
      "secondo i giornali"
    ],
    "meaning": {
      "en": "Reporting a source while keeping your distance (conditional): According to the papers, ___.",
      "ko": "출처를 밝히며 거리 두기(조건법): 신문에 따르면 ___래요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Secondo i giornali, il ministro si sarebbe dimesso.",
        "slot": "il ministro si sarebbe dimesso",
        "cue": {
          "en": "the minister resigned",
          "ko": "장관이 사임했다"
        },
        "gloss": {
          "en": "According to the papers, the minister has resigned.",
          "ko": "신문에 따르면 장관이 사임했대요."
        }
      },
      {
        "text": "Secondo i giornali, l'incendio sarebbe partito da una cucina.",
        "slot": "l'incendio sarebbe partito da una cucina",
        "cue": {
          "en": "the fire started in a kitchen",
          "ko": "불이 부엌에서 시작됐다"
        },
        "gloss": {
          "en": "According to the papers, the fire started in a kitchen.",
          "ko": "신문에 따르면 불이 한 부엌에서 시작됐대요."
        }
      },
      {
        "text": "Secondo i giornali, il nuovo stadio costerebbe il doppio.",
        "slot": "il nuovo stadio costerebbe il doppio",
        "cue": {
          "en": "the new stadium costs double",
          "ko": "새 경기장이 두 배로 든다"
        },
        "gloss": {
          "en": "According to the papers, the new stadium would cost double.",
          "ko": "신문에 따르면 새 경기장 비용이 두 배래요."
        }
      },
      {
        "text": "Il sindaco, secondo i giornali, avrebbe già firmato.",
        "slot": "avrebbe già firmato",
        "cue": {
          "en": "has already signed",
          "ko": "벌써 서명했다"
        },
        "gloss": {
          "en": "The mayor, according to the papers, has already signed.",
          "ko": "신문에 따르면 시장이 벌써 서명했대요."
        }
      }
    ]
  },
  {
    "id": "it-f5-10",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Finita la riunione, ___.",
    "core": [
      "Finita la riunione",
      "finita la riunione"
    ],
    "meaning": {
      "en": "Moving a story on with a past participle clause: Once the meeting was over, ___.",
      "ko": "과거분사 구문으로 이야기 잇기: 회의가 끝나고 ___."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Finita la riunione, siamo andati tutti a cena.",
        "slot": "siamo andati tutti a cena",
        "cue": {
          "en": "we all went to dinner",
          "ko": "모두 저녁 먹으러 갔다"
        },
        "gloss": {
          "en": "Once the meeting was over, we all went to dinner.",
          "ko": "회의가 끝나고 다 같이 저녁 먹으러 갔어요."
        }
      },
      {
        "text": "Finita la riunione, ho chiamato subito il cliente.",
        "slot": "ho chiamato subito il cliente",
        "cue": {
          "en": "I called the client right away",
          "ko": "바로 고객에게 전화했다"
        },
        "gloss": {
          "en": "Once the meeting was over, I called the client right away.",
          "ko": "회의가 끝나자마자 고객에게 전화했어요."
        }
      },
      {
        "text": "Finita la riunione, Paolo è tornato a casa.",
        "slot": "Paolo è tornato a casa",
        "cue": {
          "en": "Paolo went home",
          "ko": "파올로가 집에 갔다"
        },
        "gloss": {
          "en": "Once the meeting was over, Paolo went home.",
          "ko": "회의가 끝나고 파올로는 집에 갔어요."
        }
      },
      {
        "text": "Ci vediamo al bar, finita la riunione.",
        "slot": "Ci vediamo al bar",
        "cue": {
          "en": "see each other at the café",
          "ko": "카페에서 만나다"
        },
        "gloss": {
          "en": "See you at the café once the meeting's over.",
          "ko": "회의 끝나면 카페에서 봐요."
        }
      }
    ]
  },
  {
    "id": "it-f5-11",
    "stage": 5,
    "fn": "reason",
    "pattern": "Lavorando da casa, ___.",
    "core": [
      "Lavorando da casa",
      "lavorando da casa"
    ],
    "meaning": {
      "en": "Giving circumstances with a gerund: Working from home, ___.",
      "ko": "제룬디오로 상황 붙이기: 재택근무를 하면서 ___."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Lavorando da casa, risparmio due ore al giorno.",
        "slot": "risparmio due ore al giorno",
        "cue": {
          "en": "I save two hours a day",
          "ko": "하루 두 시간을 아낀다"
        },
        "gloss": {
          "en": "Working from home, I save two hours a day.",
          "ko": "재택근무를 하니 하루에 두 시간을 아껴요."
        }
      },
      {
        "text": "Lavorando da casa, riesco a concentrarmi meglio.",
        "slot": "riesco a concentrarmi meglio",
        "cue": {
          "en": "I can concentrate better",
          "ko": "더 집중할 수 있다"
        },
        "gloss": {
          "en": "Working from home, I can concentrate better.",
          "ko": "재택근무를 하면 더 집중이 잘돼요."
        }
      },
      {
        "text": "Il mese scorso, lavorando da casa, ho finito il progetto in anticipo.",
        "slot": "ho finito il progetto in anticipo",
        "cue": {
          "en": "I finished the project early",
          "ko": "프로젝트를 일찍 끝냈다"
        },
        "gloss": {
          "en": "Last month, working from home, I finished the project early.",
          "ko": "지난달 재택근무를 하면서 프로젝트를 일찍 끝냈어요."
        }
      },
      {
        "text": "Lavorando da casa, a volte mi sento un po' solo.",
        "slot": "a volte mi sento un po' solo",
        "cue": {
          "en": "sometimes I feel a bit lonely",
          "ko": "가끔 좀 외롭다"
        },
        "gloss": {
          "en": "Working from home, I sometimes feel a bit lonely.",
          "ko": "재택근무를 하다 보면 가끔 좀 외로워요."
        }
      }
    ]
  },
  {
    "id": "it-f5-12",
    "stage": 5,
    "fn": "formal-request",
    "pattern": "Volevo chiederle se ___.",
    "core": [
      "Volevo chiederle",
      "volevo chiederle"
    ],
    "meaning": {
      "en": "Asking politely with the softening imperfect (Lei): I wanted to ask you whether ___.",
      "ko": "반과거로 부드럽게 묻기(Lei): ___인지 여쭤보고 싶었어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Volevo chiederle se fosse possibile lavorare da casa il venerdì.",
        "slot": "fosse possibile lavorare da casa il venerdì",
        "cue": {
          "en": "it was possible to work from home on Fridays",
          "ko": "금요일에 재택근무가 가능하다"
        },
        "gloss": {
          "en": "I wanted to ask you if it would be possible to work from home on Fridays.",
          "ko": "금요일에 재택근무가 가능한지 여쭤보고 싶었어요."
        }
      },
      {
        "text": "Volevo chiederle se avesse un minuto.",
        "slot": "avesse un minuto",
        "cue": {
          "en": "you had a minute",
          "ko": "잠깐 시간이 있다"
        },
        "gloss": {
          "en": "I wanted to ask if you had a minute.",
          "ko": "잠깐 시간 있으신지 여쭤보려고요."
        }
      },
      {
        "text": "Volevo chiederle se potessimo spostare la riunione.",
        "slot": "potessimo spostare la riunione",
        "cue": {
          "en": "we could move the meeting",
          "ko": "회의를 옮길 수 있다"
        },
        "gloss": {
          "en": "I wanted to ask if we could move the meeting.",
          "ko": "회의를 옮길 수 있을지 여쭤보고 싶었어요."
        }
      },
      {
        "text": "Scusi, volevo chiederle se la camera fosse ancora libera.",
        "slot": "la camera fosse ancora libera",
        "cue": {
          "en": "the room was still free",
          "ko": "방이 아직 비어 있다"
        },
        "gloss": {
          "en": "Excuse me, I wanted to ask if the room was still free.",
          "ko": "실례지만 방이 아직 비어 있는지 여쭤보려고요."
        }
      }
    ]
  },
  {
    "id": "it-f5-13",
    "stage": 5,
    "fn": "formal-request",
    "pattern": "Volevo sapere se ___.",
    "core": [
      "Volevo sapere se",
      "volevo sapere se"
    ],
    "meaning": {
      "en": "Enquiring politely with the softening imperfect: I wanted to know if ___.",
      "ko": "반과거로 부드럽게 문의하기: ___인지 알고 싶었어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Volevo sapere se c'erano ancora posti liberi.",
        "slot": "c'erano ancora posti liberi",
        "cue": {
          "en": "there were still free seats",
          "ko": "아직 빈자리가 있었다"
        },
        "gloss": {
          "en": "I wanted to know if there were still seats free.",
          "ko": "아직 빈자리가 있는지 알고 싶었어요."
        }
      },
      {
        "text": "Buongiorno, volevo sapere se il museo è aperto domenica.",
        "slot": "il museo è aperto domenica",
        "cue": {
          "en": "the museum is open on Sunday",
          "ko": "박물관이 일요일에 연다"
        },
        "gloss": {
          "en": "Good morning, I wanted to know if the museum is open on Sunday.",
          "ko": "안녕하세요, 박물관이 일요일에 여는지 알고 싶어서요."
        }
      },
      {
        "text": "Volevo sapere se avete ricevuto la mia email.",
        "slot": "avete ricevuto la mia email",
        "cue": {
          "en": "you received my email",
          "ko": "내 이메일을 받았다"
        },
        "gloss": {
          "en": "I wanted to know if you received my email.",
          "ko": "제 이메일을 받으셨는지 알고 싶었어요."
        }
      },
      {
        "text": "Volevo sapere se le andava bene giovedì.",
        "slot": "le andava bene giovedì",
        "cue": {
          "en": "Thursday suited you",
          "ko": "목요일이 괜찮다"
        },
        "gloss": {
          "en": "I wanted to know if Thursday suited you.",
          "ko": "목요일 괜찮으신지 여쭤보려고요."
        }
      }
    ]
  },
  {
    "id": "it-f5-14",
    "stage": 5,
    "fn": "plan-intent",
    "pattern": "___, lo porto io.",
    "core": [
      "lo porto io"
    ],
    "meaning": {
      "en": "Fronting the thing for emphasis (dislocation): The ___, I'll bring it.",
      "ko": "앞으로 빼서 강조하기: ___은 내가 가져갈게."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Il vino, lo porto io.",
        "slot": "Il vino",
        "cue": {
          "en": "the wine",
          "ko": "와인"
        },
        "gloss": {
          "en": "The wine, I'll bring it.",
          "ko": "와인은 내가 가져갈게."
        }
      },
      {
        "text": "Il dolce, lo porto io.",
        "slot": "Il dolce",
        "cue": {
          "en": "the dessert",
          "ko": "디저트"
        },
        "gloss": {
          "en": "The dessert, I'll bring it.",
          "ko": "디저트는 내가 가져갈게."
        }
      },
      {
        "text": "Tranquilla, il pane lo porto io.",
        "slot": "il pane",
        "cue": {
          "en": "the bread",
          "ko": "빵"
        },
        "gloss": {
          "en": "Don't worry, I'll bring the bread.",
          "ko": "걱정 마, 빵은 내가 가져갈게."
        }
      },
      {
        "text": "Il regalo per Anna, lo porto io.",
        "slot": "Il regalo per Anna",
        "cue": {
          "en": "the present for Anna",
          "ko": "안나 선물"
        },
        "gloss": {
          "en": "The present for Anna, I'll bring it.",
          "ko": "안나 선물은 내가 가져갈게."
        }
      }
    ]
  },
  {
    "id": "it-f5-15",
    "stage": 5,
    "fn": "opinion",
    "pattern": "La storia, l'ho trovata ___.",
    "core": [
      "l'ho trovata"
    ],
    "meaning": {
      "en": "Fronting a feminine topic and judging it (dislocation, agreement): That one, I found it ___.",
      "ko": "여성 명사를 앞으로 빼서 평하기(일치): 그건 ___였어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "La storia l'ho trovata un po' lenta.",
        "slot": "un po' lenta",
        "cue": {
          "en": "a bit slow",
          "ko": "좀 느린"
        },
        "gloss": {
          "en": "I found the story a bit slow.",
          "ko": "이야기는 좀 늘어지더라고요."
        }
      },
      {
        "text": "La cena, l'ho trovata ottima.",
        "slot": "ottima",
        "cue": {
          "en": "excellent",
          "ko": "훌륭한"
        },
        "gloss": {
          "en": "The dinner, I found it excellent.",
          "ko": "저녁은 정말 훌륭했어요."
        }
      },
      {
        "text": "La sua proposta l'ho trovata molto interessante.",
        "slot": "molto interessante",
        "cue": {
          "en": "very interesting",
          "ko": "아주 흥미로운"
        },
        "gloss": {
          "en": "I found her proposal very interesting.",
          "ko": "그 제안은 아주 흥미로웠어요."
        }
      },
      {
        "text": "La chiave l'ho trovata sotto il tappeto.",
        "slot": "sotto il tappeto",
        "cue": {
          "en": "under the rug",
          "ko": "깔개 밑에서"
        },
        "gloss": {
          "en": "The key, I found it under the rug.",
          "ko": "열쇠는 깔개 밑에서 찾았어요."
        }
      }
    ]
  },
  {
    "id": "it-f5-16",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Non è che ___.",
    "core": [
      "Non è che",
      "non è che"
    ],
    "meaning": {
      "en": "Softening a negative: It's not that ___.",
      "ko": "강한 말 누그러뜨리기: ___라는 건 아니고요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "non è che"
    ],
    "examples": [
      {
        "text": "Non è che sia sbagliato, ma si può fare meglio.",
        "slot": "sia sbagliato",
        "cue": {
          "en": "it's wrong",
          "ko": "틀렸다"
        },
        "gloss": {
          "en": "It's not that it's wrong, but it can be done better.",
          "ko": "틀린 건 아닌데 더 잘할 수 있어요."
        }
      },
      {
        "text": "Non è che non mi piaccia, è solo un po' caro.",
        "slot": "non mi piaccia",
        "cue": {
          "en": "I don't like it",
          "ko": "마음에 안 든다"
        },
        "gloss": {
          "en": "It's not that I don't like it, it's just a bit expensive.",
          "ko": "싫은 건 아니고 좀 비쌀 뿐이에요."
        }
      },
      {
        "text": "Scusa, non è che sia la serata giusta.",
        "slot": "sia la serata giusta",
        "cue": {
          "en": "it's the right evening",
          "ko": "적당한 저녁이다"
        },
        "gloss": {
          "en": "Sorry, it's not exactly the right evening.",
          "ko": "미안, 오늘이 딱 좋은 날은 아니라서."
        }
      },
      {
        "text": "Non è che abbia molta voglia di uscire stasera.",
        "slot": "abbia molta voglia di uscire stasera",
        "cue": {
          "en": "I really feel like going out tonight",
          "ko": "오늘 밤 나가고 싶다"
        },
        "gloss": {
          "en": "It's not that I really feel like going out tonight.",
          "ko": "오늘 밤엔 딱히 나가고 싶지 않아요."
        }
      }
    ]
  },
  {
    "id": "it-f5-17",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Mettiamola così: ___.",
    "core": [
      "Mettiamola così",
      "mettiamola così"
    ],
    "meaning": {
      "en": "Reframing tactfully: Let's put it this way: ___.",
      "ko": "돌려서 말하기: 이렇게 말해 볼게요, ___."
    },
    "grammar": [],
    "expressions": [
      "mettiamola così"
    ],
    "examples": [
      {
        "text": "Mettiamola così: non è il mio film preferito.",
        "slot": "non è il mio film preferito",
        "cue": {
          "en": "it's not my favourite film",
          "ko": "내가 제일 좋아하는 영화는 아니다"
        },
        "gloss": {
          "en": "Let's put it this way: it's not my favourite film.",
          "ko": "이렇게 말할게요, 제가 좋아하는 영화는 아니에요."
        }
      },
      {
        "text": "Mettiamola così: ci serve più tempo.",
        "slot": "ci serve più tempo",
        "cue": {
          "en": "we need more time",
          "ko": "시간이 더 필요하다"
        },
        "gloss": {
          "en": "Let's put it this way: we need more time.",
          "ko": "말하자면 시간이 더 필요해요."
        }
      },
      {
        "text": "Mettiamola così: il prezzo è un po' alto per noi.",
        "slot": "il prezzo è un po' alto per noi",
        "cue": {
          "en": "the price is a bit high for us",
          "ko": "우리에겐 값이 좀 비싸다"
        },
        "gloss": {
          "en": "Let's put it this way: the price is a bit high for us.",
          "ko": "말하자면 저희한텐 값이 좀 높아요."
        }
      },
      {
        "text": "Allora, mettiamola così: la prossima volta scelgo io il ristorante.",
        "slot": "la prossima volta scelgo io il ristorante",
        "cue": {
          "en": "next time I choose the restaurant",
          "ko": "다음엔 내가 식당을 고른다"
        },
        "gloss": {
          "en": "Right, let's put it this way: next time I choose the restaurant.",
          "ko": "그럼 이렇게 하자, 다음엔 내가 식당 고를게."
        }
      }
    ]
  },
  {
    "id": "it-f5-18",
    "stage": 5,
    "fn": "guess",
    "pattern": "Mi sa che ___.",
    "core": [
      "Mi sa che",
      "mi sa che"
    ],
    "meaning": {
      "en": "Guessing casually: I have a feeling that ___.",
      "ko": "편하게 짐작하기: 아무래도 ___인 것 같아."
    },
    "grammar": [],
    "expressions": [
      "mi sa che"
    ],
    "examples": [
      {
        "text": "Mi sa che ha ragione lei.",
        "slot": "ha ragione lei",
        "cue": {
          "en": "she's right",
          "ko": "그녀가 맞다"
        },
        "gloss": {
          "en": "I have a feeling she's right.",
          "ko": "아무래도 그녀 말이 맞는 것 같아."
        }
      },
      {
        "text": "Mi sa che stasera piove.",
        "slot": "stasera piove",
        "cue": {
          "en": "it'll rain tonight",
          "ko": "오늘 밤 비가 온다"
        },
        "gloss": {
          "en": "I think it's going to rain tonight.",
          "ko": "오늘 밤에 비 올 것 같아."
        }
      },
      {
        "text": "Mi sa che abbiamo sbagliato strada.",
        "slot": "abbiamo sbagliato strada",
        "cue": {
          "en": "we took the wrong road",
          "ko": "길을 잘못 들었다"
        },
        "gloss": {
          "en": "I think we've taken the wrong road.",
          "ko": "아무래도 길을 잘못 든 것 같아."
        }
      },
      {
        "text": "Mi sa che il negozio è già chiuso.",
        "slot": "il negozio è già chiuso",
        "cue": {
          "en": "the shop is already closed",
          "ko": "가게가 벌써 닫았다"
        },
        "gloss": {
          "en": "I have a feeling the shop's already closed.",
          "ko": "가게가 벌써 닫은 것 같아."
        }
      }
    ]
  },
  {
    "id": "it-f5-19",
    "stage": 5,
    "fn": "concession",
    "pattern": "Tutto sommato, ___.",
    "core": [
      "Tutto sommato",
      "tutto sommato"
    ],
    "meaning": {
      "en": "Weighing it all up: All things considered, ___.",
      "ko": "다 따져 보고 말하기: 이것저것 따져 보면 ___."
    },
    "grammar": [],
    "expressions": [
      "tutto sommato"
    ],
    "examples": [
      {
        "text": "Tutto sommato, è stata una bella serata.",
        "slot": "è stata una bella serata",
        "cue": {
          "en": "it was a lovely evening",
          "ko": "좋은 저녁이었다"
        },
        "gloss": {
          "en": "All things considered, it was a lovely evening.",
          "ko": "이래저래 해도 좋은 저녁이었어요."
        }
      },
      {
        "text": "Il viaggio è stato lungo, ma tutto sommato ne è valsa la pena.",
        "slot": "ne è valsa la pena",
        "cue": {
          "en": "it was worth it",
          "ko": "그럴 만한 가치가 있었다"
        },
        "gloss": {
          "en": "The trip was long, but all things considered it was worth it.",
          "ko": "여행은 길었지만 따져 보면 그럴 만했어요."
        }
      },
      {
        "text": "Tutto sommato, il nuovo capo non è male.",
        "slot": "il nuovo capo non è male",
        "cue": {
          "en": "the new boss isn't bad",
          "ko": "새 상사가 나쁘지 않다"
        },
        "gloss": {
          "en": "All things considered, the new boss isn't bad.",
          "ko": "따져 보면 새 상사도 나쁘지 않아요."
        }
      },
      {
        "text": "Tutto sommato preferisco restare qui.",
        "slot": "preferisco restare qui",
        "cue": {
          "en": "I prefer to stay here",
          "ko": "여기 있는 게 더 좋다"
        },
        "gloss": {
          "en": "All in all, I'd rather stay here.",
          "ko": "이것저것 따져 보면 여기 있는 게 더 나아요."
        }
      }
    ]
  },
  {
    "id": "it-f5-20",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Non me la sento di ___.",
    "core": [
      "Non me la sento",
      "non me la sento"
    ],
    "meaning": {
      "en": "Declining gently by saying you don't feel up to it: I don't feel up to ___.",
      "ko": "눈치 있게 거절하기: ___할 자신이 없어요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "non me la sento"
    ],
    "examples": [
      {
        "text": "Non me la sento di parlare in pubblico.",
        "slot": "parlare in pubblico",
        "cue": {
          "en": "speak in public",
          "ko": "사람들 앞에서 말하다"
        },
        "gloss": {
          "en": "I don't feel up to speaking in public.",
          "ko": "사람들 앞에서 말할 자신이 없어요."
        }
      },
      {
        "text": "Scusa, stasera non me la sento di uscire.",
        "slot": "uscire",
        "cue": {
          "en": "go out",
          "ko": "나가다"
        },
        "gloss": {
          "en": "Sorry, I don't feel up to going out tonight.",
          "ko": "미안, 오늘 밤엔 나갈 기분이 아니야."
        }
      },
      {
        "text": "Non me la sento di lasciarlo solo.",
        "slot": "lasciarlo solo",
        "cue": {
          "en": "leave him alone",
          "ko": "그를 혼자 두다"
        },
        "gloss": {
          "en": "I don't have the heart to leave him alone.",
          "ko": "그를 혼자 둘 마음이 안 들어요."
        }
      },
      {
        "text": "Sinceramente non me la sento di firmare adesso.",
        "slot": "firmare adesso",
        "cue": {
          "en": "sign now",
          "ko": "지금 서명하다"
        },
        "gloss": {
          "en": "Honestly, I don't feel ready to sign now.",
          "ko": "솔직히 지금 서명할 자신은 없어요."
        }
      }
    ]
  }
];
