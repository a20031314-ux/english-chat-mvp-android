import type { Frame } from "../frames.ts";

/** 인도네시아어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const ID_FRAMES: Frame[] = [
  {
    "id": "id-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Nama saya ___.",
    "core": [
      "Nama saya",
      "nama saya"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      1,
      2
    ],
    "expressions": [
      "nama saya"
    ],
    "examples": [
      {
        "text": "Nama saya Ji-woo.",
        "slot": "Ji-woo",
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
        "text": "Halo, nama saya Dewi.",
        "slot": "Dewi",
        "cue": {
          "en": "Dewi",
          "ko": "데위"
        },
        "gloss": {
          "en": "Hello, my name is Dewi.",
          "ko": "안녕하세요, 제 이름은 데위예요."
        }
      },
      {
        "text": "Nama saya Min-ho. Senang bertemu.",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho",
          "ko": "민호"
        },
        "gloss": {
          "en": "My name is Min-ho. Nice to meet you.",
          "ko": "제 이름은 민호예요. 반가워요."
        }
      },
      {
        "text": "Nama saya Andrea Park.",
        "slot": "Andrea Park",
        "cue": {
          "en": "Andrea Park (full name)",
          "ko": "안드레아 박(성과 이름)"
        },
        "gloss": {
          "en": "My name is Andrea Park.",
          "ko": "제 이름은 안드레아 박이에요."
        }
      }
    ]
  },
  {
    "id": "id-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Saya dari ___.",
    "core": [
      "Saya dari",
      "saya dari"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      6,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya dari Korea.",
        "slot": "Korea",
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
        "text": "Saya dari Seoul.",
        "slot": "Seoul",
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
        "text": "Saya dari Jepang. Kamu?",
        "slot": "Jepang",
        "cue": {
          "en": "Japan",
          "ko": "일본"
        },
        "gloss": {
          "en": "I'm from Japan. And you?",
          "ko": "저는 일본에서 왔어요. 너는?"
        }
      },
      {
        "text": "Dia dari Bandung, saya dari Busan.",
        "slot": "Busan",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "She's from Bandung, I'm from Busan.",
          "ko": "그 사람은 반둥, 저는 부산에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "id-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Saya ___.",
    "core": [
      "Saya",
      "saya"
    ],
    "meaning": {
      "en": "Saying what you are (no 'to be' needed): I'm a ___.",
      "ko": "직업·신분 말하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya mahasiswa.",
        "slot": "mahasiswa",
        "cue": {
          "en": "university student",
          "ko": "대학생"
        },
        "gloss": {
          "en": "I'm a university student.",
          "ko": "저는 대학생이에요."
        }
      },
      {
        "text": "Saya guru.",
        "slot": "guru",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm a teacher.",
          "ko": "저는 선생님이에요."
        }
      },
      {
        "text": "Saya dokter.",
        "slot": "dokter",
        "cue": {
          "en": "doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "I'm a doctor.",
          "ko": "저는 의사예요."
        }
      },
      {
        "text": "Saya karyawan bank.",
        "slot": "karyawan bank",
        "cue": {
          "en": "bank employee",
          "ko": "은행원"
        },
        "gloss": {
          "en": "I'm a bank employee.",
          "ko": "저는 은행원이에요."
        }
      }
    ]
  },
  {
    "id": "id-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "Saya kerja di ___.",
    "core": [
      "kerja di"
    ],
    "meaning": {
      "en": "Saying where you work: I work at ___.",
      "ko": "일하는 곳 말하기: 저는 ___에서 일해요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya kerja di hotel.",
        "slot": "hotel",
        "cue": {
          "en": "a hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "I work at a hotel.",
          "ko": "저는 호텔에서 일해요."
        }
      },
      {
        "text": "Saya kerja di bank.",
        "slot": "bank",
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
        "text": "Saya kerja di Jakarta.",
        "slot": "Jakarta",
        "cue": {
          "en": "Jakarta",
          "ko": "자카르타"
        },
        "gloss": {
          "en": "I work in Jakarta.",
          "ko": "저는 자카르타에서 일해요."
        }
      },
      {
        "text": "Saya kerja di rumah sakit.",
        "slot": "rumah sakit",
        "cue": {
          "en": "a hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I work at a hospital.",
          "ko": "저는 병원에서 일해요."
        }
      }
    ]
  },
  {
    "id": "id-f1-05",
    "stage": 1,
    "fn": "greet",
    "pattern": "Selamat ___.",
    "core": [
      "Selamat",
      "selamat"
    ],
    "meaning": {
      "en": "Greeting by time of day: Good ___.",
      "ko": "시간대 인사: 좋은 ___예요(안녕하세요)."
    },
    "grammar": [],
    "expressions": [
      "selamat pagi",
      "selamat siang",
      "selamat malam"
    ],
    "examples": [
      {
        "text": "Selamat pagi, Bu.",
        "slot": "pagi",
        "cue": {
          "en": "morning",
          "ko": "아침"
        },
        "gloss": {
          "en": "Good morning, ma'am.",
          "ko": "안녕하세요(아침), 선생님."
        }
      },
      {
        "text": "Selamat siang, Pak.",
        "slot": "siang",
        "cue": {
          "en": "midday",
          "ko": "낮"
        },
        "gloss": {
          "en": "Good afternoon, sir.",
          "ko": "안녕하세요(낮), 아저씨."
        }
      },
      {
        "text": "Selamat malam, semuanya.",
        "slot": "malam",
        "cue": {
          "en": "evening",
          "ko": "저녁"
        },
        "gloss": {
          "en": "Good evening, everyone.",
          "ko": "여러분, 안녕하세요(저녁)."
        }
      },
      {
        "text": "Selamat sore, Dewi.",
        "slot": "sore",
        "cue": {
          "en": "late afternoon",
          "ko": "오후 늦게"
        },
        "gloss": {
          "en": "Good afternoon, Dewi.",
          "ko": "데위, 안녕(오후)."
        }
      }
    ]
  },
  {
    "id": "id-f1-06",
    "stage": 1,
    "fn": "thank",
    "pattern": "Terima kasih, ___.",
    "core": [
      "Terima kasih",
      "terima kasih"
    ],
    "meaning": {
      "en": "Thanking someone: Thank you, ___.",
      "ko": "고마움 말하기: 고마워요, ___."
    },
    "grammar": [],
    "expressions": [
      "terima kasih"
    ],
    "examples": [
      {
        "text": "Terima kasih, Bu.",
        "slot": "Bu",
        "cue": {
          "en": "ma'am (Ibu)",
          "ko": "여성 어른(이부)"
        },
        "gloss": {
          "en": "Thank you, ma'am.",
          "ko": "고맙습니다, 아주머니."
        }
      },
      {
        "text": "Terima kasih, Pak.",
        "slot": "Pak",
        "cue": {
          "en": "sir (Bapak)",
          "ko": "남성 어른(바팍)"
        },
        "gloss": {
          "en": "Thank you, sir.",
          "ko": "고맙습니다, 아저씨."
        }
      },
      {
        "text": "Terima kasih, Dewi.",
        "slot": "Dewi",
        "cue": {
          "en": "Dewi",
          "ko": "데위"
        },
        "gloss": {
          "en": "Thank you, Dewi.",
          "ko": "고마워, 데위."
        }
      },
      {
        "text": "Terima kasih, Mas.",
        "slot": "Mas",
        "cue": {
          "en": "a young man (Mas)",
          "ko": "젊은 남자(마스)"
        },
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "id-f1-07",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___ berapa?",
    "core": [
      "berapa",
      "Berapa"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Satu kilo berapa?",
        "slot": "Satu kilo",
        "cue": {
          "en": "one kilo",
          "ko": "1킬로"
        },
        "gloss": {
          "en": "How much for one kilo?",
          "ko": "1킬로에 얼마예요?"
        }
      },
      {
        "text": "Mangga ini berapa?",
        "slot": "Mangga ini",
        "cue": {
          "en": "these mangoes",
          "ko": "이 망고"
        },
        "gloss": {
          "en": "How much are these mangoes?",
          "ko": "이 망고 얼마예요?"
        }
      },
      {
        "text": "Air mineral berapa?",
        "slot": "Air mineral",
        "cue": {
          "en": "mineral water",
          "ko": "생수"
        },
        "gloss": {
          "en": "How much is the mineral water?",
          "ko": "생수 얼마예요?"
        }
      },
      {
        "text": "Tas itu berapa?",
        "slot": "Tas itu",
        "cue": {
          "en": "that bag",
          "ko": "저 가방"
        },
        "gloss": {
          "en": "How much is that bag?",
          "ko": "저 가방 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "id-f1-08",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___ di mana?",
    "core": [
      "di mana"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "위치 묻기: ___ 어디예요?"
    },
    "grammar": [
      4,
      6
    ],
    "expressions": [
      "toiletnya di mana",
      "permisi"
    ],
    "examples": [
      {
        "text": "Toiletnya di mana?",
        "slot": "Toiletnya",
        "cue": {
          "en": "the toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where's the toilet?",
          "ko": "화장실이 어디예요?"
        }
      },
      {
        "text": "Lift di mana?",
        "slot": "Lift",
        "cue": {
          "en": "the lift",
          "ko": "엘리베이터"
        },
        "gloss": {
          "en": "Where's the lift?",
          "ko": "엘리베이터 어디예요?"
        }
      },
      {
        "text": "Permisi, pintu keluar di mana?",
        "slot": "pintu keluar",
        "cue": {
          "en": "the exit",
          "ko": "출구"
        },
        "gloss": {
          "en": "Excuse me, where's the exit?",
          "ko": "실례지만 출구가 어디예요?"
        }
      },
      {
        "text": "Kamar saya di mana?",
        "slot": "Kamar saya",
        "cue": {
          "en": "my room",
          "ko": "내 방"
        },
        "gloss": {
          "en": "Where's my room?",
          "ko": "제 방은 어디예요?"
        }
      }
    ]
  },
  {
    "id": "id-f1-09",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Ada ___?",
    "core": [
      "Ada",
      "ada"
    ],
    "meaning": {
      "en": "Asking if there is / they have ___: Is there ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ada air mineral?",
        "slot": "air mineral",
        "cue": {
          "en": "mineral water",
          "ko": "생수"
        },
        "gloss": {
          "en": "Do you have mineral water?",
          "ko": "생수 있어요?"
        }
      },
      {
        "text": "Ada handuk?",
        "slot": "handuk",
        "cue": {
          "en": "a towel",
          "ko": "수건"
        },
        "gloss": {
          "en": "Is there a towel?",
          "ko": "수건 있어요?"
        }
      },
      {
        "text": "Ada wifi di sini?",
        "slot": "wifi",
        "cue": {
          "en": "wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there wifi here?",
          "ko": "여기 와이파이 있어요?"
        }
      },
      {
        "text": "Permisi, ada ATM di dekat sini?",
        "slot": "ATM",
        "cue": {
          "en": "an ATM",
          "ko": "현금인출기"
        },
        "gloss": {
          "en": "Excuse me, is there an ATM near here?",
          "ko": "실례지만 이 근처에 현금인출기 있어요?"
        }
      }
    ]
  },
  {
    "id": "id-f1-10",
    "stage": 1,
    "fn": "want",
    "pattern": "Saya mau ___.",
    "core": [
      "Saya mau",
      "saya mau"
    ],
    "meaning": {
      "en": "Saying what you want: I want ___ / I'll take ___.",
      "ko": "원하는 것 말하기: ___ 주세요/원해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "saya mau ini"
    ],
    "examples": [
      {
        "text": "Saya mau ini.",
        "slot": "ini",
        "cue": {
          "en": "this one",
          "ko": "이것"
        },
        "gloss": {
          "en": "I'll take this one.",
          "ko": "이거 주세요."
        }
      },
      {
        "text": "Saya mau itu, Bu.",
        "slot": "itu",
        "cue": {
          "en": "that one",
          "ko": "저것"
        },
        "gloss": {
          "en": "I'll take that one, ma'am.",
          "ko": "저거 주세요."
        }
      },
      {
        "text": "Saya mau air mineral.",
        "slot": "air mineral",
        "cue": {
          "en": "mineral water",
          "ko": "생수"
        },
        "gloss": {
          "en": "I'd like mineral water.",
          "ko": "생수 주세요."
        }
      },
      {
        "text": "Saya mau teh manis.",
        "slot": "teh manis",
        "cue": {
          "en": "sweet tea",
          "ko": "달콤한 차"
        },
        "gloss": {
          "en": "I'd like sweet tea.",
          "ko": "단 차 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f1-11",
    "stage": 1,
    "fn": "request-action",
    "pattern": "Tolong ___.",
    "core": [
      "Tolong",
      "tolong"
    ],
    "meaning": {
      "en": "Asking someone to do something: Please ___.",
      "ko": "부탁하기: ___ 해 주세요."
    },
    "grammar": [],
    "expressions": [
      "tolong",
      "pelan-pelan saja",
      "sekali lagi"
    ],
    "examples": [
      {
        "text": "Tolong pelan-pelan saja.",
        "slot": "pelan-pelan saja",
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
        "text": "Tolong sekali lagi.",
        "slot": "sekali lagi",
        "cue": {
          "en": "once more",
          "ko": "한 번 더"
        },
        "gloss": {
          "en": "Once more, please.",
          "ko": "한 번 더 부탁해요."
        }
      },
      {
        "text": "Tolong tulis di sini.",
        "slot": "tulis di sini",
        "cue": {
          "en": "write it here",
          "ko": "여기에 쓰기"
        },
        "gloss": {
          "en": "Please write it here.",
          "ko": "여기에 써 주세요."
        }
      },
      {
        "text": "Tolong bantu saya.",
        "slot": "bantu saya",
        "cue": {
          "en": "help me",
          "ko": "나를 도와주기"
        },
        "gloss": {
          "en": "Please help me.",
          "ko": "저 좀 도와주세요."
        }
      }
    ]
  },
  {
    "id": "id-f1-12",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "Saya bukan ___.",
    "core": [
      "bukan",
      "Bukan"
    ],
    "meaning": {
      "en": "Saying what you or something is not (nouns take bukan): I'm not ___.",
      "ko": "명사 부정하기: 저는 ___가 아니에요."
    },
    "grammar": [
      5,
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya bukan orang Jepang.",
        "slot": "orang Jepang",
        "cue": {
          "en": "Japanese person",
          "ko": "일본 사람"
        },
        "gloss": {
          "en": "I'm not Japanese.",
          "ko": "저는 일본 사람이 아니에요."
        }
      },
      {
        "text": "Saya bukan guru.",
        "slot": "guru",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm not a teacher.",
          "ko": "저는 선생님이 아니에요."
        }
      },
      {
        "text": "Ini bukan tas saya.",
        "slot": "tas saya",
        "cue": {
          "en": "my bag",
          "ko": "내 가방"
        },
        "gloss": {
          "en": "This isn't my bag.",
          "ko": "이건 제 가방이 아니에요."
        }
      },
      {
        "text": "Dia bukan mahasiswa.",
        "slot": "mahasiswa",
        "cue": {
          "en": "university student",
          "ko": "대학생"
        },
        "gloss": {
          "en": "He's not a university student.",
          "ko": "그 사람은 대학생이 아니에요."
        }
      }
    ]
  },
  {
    "id": "id-f1-13",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "Saya tidak ___.",
    "core": [
      "Saya tidak",
      "saya tidak"
    ],
    "meaning": {
      "en": "Saying you don't / can't (verbs and adjectives take tidak): I don't ___.",
      "ko": "동사·형용사 부정하기: 저는 ___ 않아요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "saya tidak mengerti"
    ],
    "examples": [
      {
        "text": "Saya tidak mengerti.",
        "slot": "mengerti",
        "cue": {
          "en": "understand",
          "ko": "이해하다"
        },
        "gloss": {
          "en": "I don't understand.",
          "ko": "이해가 안 돼요."
        }
      },
      {
        "text": "Saya tidak tahu.",
        "slot": "tahu",
        "cue": {
          "en": "know",
          "ko": "알다"
        },
        "gloss": {
          "en": "I don't know.",
          "ko": "몰라요."
        }
      },
      {
        "text": "Saya tidak lapar.",
        "slot": "lapar",
        "cue": {
          "en": "hungry",
          "ko": "배고프다"
        },
        "gloss": {
          "en": "I'm not hungry.",
          "ko": "배 안 고파요."
        }
      },
      {
        "text": "Maaf, saya tidak bisa bahasa Jawa.",
        "slot": "bisa bahasa Jawa",
        "cue": {
          "en": "speak Javanese",
          "ko": "자바어를 할 줄 알다"
        },
        "gloss": {
          "en": "Sorry, I can't speak Javanese.",
          "ko": "죄송해요, 자바어는 못 해요."
        }
      }
    ]
  },
  {
    "id": "id-f1-14",
    "stage": 1,
    "fn": "possession",
    "pattern": "Ini ___ saya.",
    "core": [
      "Ini",
      "ini",
      "Itu",
      "itu"
    ],
    "meaning": {
      "en": "Saying whose something is: This is my ___.",
      "ko": "누구 것인지 말하기: 이건 제 ___예요."
    },
    "grammar": [
      2,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ini tas saya.",
        "slot": "tas",
        "cue": {
          "en": "bag",
          "ko": "가방"
        },
        "gloss": {
          "en": "This is my bag.",
          "ko": "이건 제 가방이에요."
        }
      },
      {
        "text": "Ini paspor saya.",
        "slot": "paspor",
        "cue": {
          "en": "passport",
          "ko": "여권"
        },
        "gloss": {
          "en": "This is my passport.",
          "ko": "이건 제 여권이에요."
        }
      },
      {
        "text": "Itu teman saya.",
        "slot": "teman",
        "cue": {
          "en": "friend",
          "ko": "친구"
        },
        "gloss": {
          "en": "That's my friend.",
          "ko": "저 사람은 제 친구예요."
        }
      },
      {
        "text": "Ini kunci kamar saya.",
        "slot": "kunci kamar",
        "cue": {
          "en": "room key",
          "ko": "방 열쇠"
        },
        "gloss": {
          "en": "This is my room key.",
          "ko": "이건 제 방 열쇠예요."
        }
      }
    ]
  },
  {
    "id": "id-f1-15",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "Ini ___ apa?",
    "core": [
      "apa"
    ],
    "meaning": {
      "en": "Asking what kind of thing it is: What ___ is this?",
      "ko": "무엇인지 묻기: 이건 무슨 ___예요?"
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ini buah apa?",
        "slot": "buah",
        "cue": {
          "en": "fruit",
          "ko": "과일"
        },
        "gloss": {
          "en": "What fruit is this?",
          "ko": "이건 무슨 과일이에요?"
        }
      },
      {
        "text": "Itu toko apa?",
        "slot": "toko",
        "cue": {
          "en": "shop",
          "ko": "가게"
        },
        "gloss": {
          "en": "What shop is that?",
          "ko": "저건 무슨 가게예요?"
        }
      },
      {
        "text": "Ini kue apa?",
        "slot": "kue",
        "cue": {
          "en": "cake",
          "ko": "과자·떡"
        },
        "gloss": {
          "en": "What kind of cake is this?",
          "ko": "이건 무슨 과자예요?"
        }
      },
      {
        "text": "Ini sambal apa?",
        "slot": "sambal",
        "cue": {
          "en": "chilli sauce",
          "ko": "삼발(고추 양념)"
        },
        "gloss": {
          "en": "What chilli sauce is this?",
          "ko": "이건 무슨 삼발이에요?"
        }
      }
    ]
  },
  {
    "id": "id-f1-16",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Nama ___ siapa?",
    "core": [
      "siapa"
    ],
    "meaning": {
      "en": "Asking someone's name: What's ___ name?",
      "ko": "이름 묻기: ___ 이름이 뭐예요?"
    },
    "grammar": [
      4,
      1,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Nama kamu siapa?",
        "slot": "kamu",
        "cue": {
          "en": "you (friend)",
          "ko": "너"
        },
        "gloss": {
          "en": "What's your name?",
          "ko": "이름이 뭐야?"
        }
      },
      {
        "text": "Nama Anda siapa?",
        "slot": "Anda",
        "cue": {
          "en": "you (polite)",
          "ko": "당신(정중)"
        },
        "gloss": {
          "en": "What is your name?",
          "ko": "성함이 어떻게 되세요?"
        }
      },
      {
        "text": "Nama dia siapa?",
        "slot": "dia",
        "cue": {
          "en": "him / her",
          "ko": "그 사람"
        },
        "gloss": {
          "en": "What's his name?",
          "ko": "그 사람 이름이 뭐예요?"
        }
      },
      {
        "text": "Nama Ibu siapa?",
        "slot": "Ibu",
        "cue": {
          "en": "you (to an older woman)",
          "ko": "어머님·선생님(여성)"
        },
        "gloss": {
          "en": "What's your name, ma'am?",
          "ko": "선생님 성함이 어떻게 되세요?"
        }
      }
    ]
  },
  {
    "id": "id-f1-17",
    "stage": 1,
    "fn": "location-now",
    "pattern": "Saya di ___.",
    "core": [
      "Saya di",
      "saya di"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm at ___.",
      "ko": "지금 있는 곳 말하기: 저는 ___에 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya di lantai dua.",
        "slot": "lantai dua",
        "cue": {
          "en": "second floor",
          "ko": "2층"
        },
        "gloss": {
          "en": "I'm on the second floor.",
          "ko": "저는 2층에 있어요."
        }
      },
      {
        "text": "Saya di depan toko buku.",
        "slot": "depan toko buku",
        "cue": {
          "en": "in front of the bookshop",
          "ko": "서점 앞"
        },
        "gloss": {
          "en": "I'm in front of the bookshop.",
          "ko": "저는 서점 앞에 있어요."
        }
      },
      {
        "text": "Saya di kamar.",
        "slot": "kamar",
        "cue": {
          "en": "my room",
          "ko": "방"
        },
        "gloss": {
          "en": "I'm in my room.",
          "ko": "저는 방에 있어요."
        }
      },
      {
        "text": "Saya di lobi hotel.",
        "slot": "lobi hotel",
        "cue": {
          "en": "the hotel lobby",
          "ko": "호텔 로비"
        },
        "gloss": {
          "en": "I'm in the hotel lobby.",
          "ko": "저는 호텔 로비에 있어요."
        }
      }
    ]
  },
  {
    "id": "id-f1-18",
    "stage": 1,
    "fn": "greet",
    "pattern": "Sampai jumpa ___.",
    "core": [
      "Sampai jumpa",
      "sampai jumpa"
    ],
    "meaning": {
      "en": "Saying goodbye: See you ___.",
      "ko": "헤어질 때: ___ 봐요."
    },
    "grammar": [],
    "expressions": [
      "sampai jumpa"
    ],
    "examples": [
      {
        "text": "Sampai jumpa besok.",
        "slot": "besok",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "See you tomorrow.",
          "ko": "내일 봐요."
        }
      },
      {
        "text": "Sampai jumpa lagi.",
        "slot": "lagi",
        "cue": {
          "en": "again",
          "ko": "다시"
        },
        "gloss": {
          "en": "See you again.",
          "ko": "또 봐요."
        }
      },
      {
        "text": "Sampai jumpa nanti.",
        "slot": "nanti",
        "cue": {
          "en": "later",
          "ko": "나중에"
        },
        "gloss": {
          "en": "See you later.",
          "ko": "이따 봐요."
        }
      },
      {
        "text": "Sampai jumpa minggu depan.",
        "slot": "minggu depan",
        "cue": {
          "en": "next week",
          "ko": "다음 주"
        },
        "gloss": {
          "en": "See you next week.",
          "ko": "다음 주에 봐요."
        }
      }
    ]
  },
  {
    "id": "id-f1-19",
    "stage": 1,
    "fn": "apologize",
    "pattern": "Maaf, ___.",
    "core": [
      "Maaf",
      "maaf"
    ],
    "meaning": {
      "en": "Saying sorry or excuse me before something: Sorry, ___.",
      "ko": "사과·양해 구하기: 죄송해요, ___."
    },
    "grammar": [],
    "expressions": [
      "maaf",
      "saya tidak mengerti",
      "sekali lagi",
      "permisi"
    ],
    "examples": [
      {
        "text": "Maaf, saya tidak mengerti.",
        "slot": "saya tidak mengerti",
        "cue": {
          "en": "I don't understand",
          "ko": "이해가 안 돼요"
        },
        "gloss": {
          "en": "Sorry, I don't understand.",
          "ko": "죄송해요, 이해가 안 돼요."
        }
      },
      {
        "text": "Maaf, sekali lagi?",
        "slot": "sekali lagi",
        "cue": {
          "en": "once more",
          "ko": "한 번 더"
        },
        "gloss": {
          "en": "Sorry, once more?",
          "ko": "죄송한데 한 번 더요?"
        }
      },
      {
        "text": "Maaf, permisi.",
        "slot": "permisi",
        "cue": {
          "en": "excuse me",
          "ko": "실례합니다"
        },
        "gloss": {
          "en": "Sorry, excuse me.",
          "ko": "죄송합니다, 실례할게요."
        }
      },
      {
        "text": "Maaf, saya terlambat.",
        "slot": "saya terlambat",
        "cue": {
          "en": "I'm late",
          "ko": "늦었어요"
        },
        "gloss": {
          "en": "Sorry, I'm late.",
          "ko": "죄송해요, 늦었어요."
        }
      }
    ]
  },
  {
    "id": "id-f1-20",
    "stage": 1,
    "fn": "count",
    "pattern": "Saya mau ___ kilo.",
    "core": [
      "kilo"
    ],
    "meaning": {
      "en": "Saying how much you want: I'd like ___ kilo(s).",
      "ko": "양 말하기: ___킬로 주세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Saya mau satu kilo.",
        "slot": "satu",
        "cue": {
          "en": "one",
          "ko": "하나"
        },
        "gloss": {
          "en": "I'd like one kilo.",
          "ko": "1킬로 주세요."
        }
      },
      {
        "text": "Saya mau dua kilo.",
        "slot": "dua",
        "cue": {
          "en": "two",
          "ko": "둘"
        },
        "gloss": {
          "en": "I'd like two kilos.",
          "ko": "2킬로 주세요."
        }
      },
      {
        "text": "Saya mau setengah kilo.",
        "slot": "setengah",
        "cue": {
          "en": "half",
          "ko": "반"
        },
        "gloss": {
          "en": "I'd like half a kilo.",
          "ko": "반 킬로 주세요."
        }
      },
      {
        "text": "Saya mau tiga kilo, Bu.",
        "slot": "tiga",
        "cue": {
          "en": "three",
          "ko": "셋"
        },
        "gloss": {
          "en": "I'd like three kilos, ma'am.",
          "ko": "3킬로 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Saya sudah ___.",
    "core": [
      "sudah",
      "Sudah"
    ],
    "meaning": {
      "en": "Saying something is already done: I've already ___.",
      "ko": "이미 한 일 말하기: 벌써 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "sudah"
    ],
    "examples": [
      {
        "text": "Saya sudah makan.",
        "slot": "makan",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I've already eaten.",
          "ko": "벌써 먹었어요."
        }
      },
      {
        "text": "Saya sudah pesan ojek.",
        "slot": "pesan ojek",
        "cue": {
          "en": "order a motorbike taxi",
          "ko": "오토바이 택시 부르기"
        },
        "gloss": {
          "en": "I've already ordered a motorbike taxi.",
          "ko": "오토바이 택시 벌써 불렀어요."
        }
      },
      {
        "text": "Aku sudah sampai di depan.",
        "slot": "sampai di depan",
        "cue": {
          "en": "arrive out front",
          "ko": "앞에 도착하다"
        },
        "gloss": {
          "en": "I'm already out front.",
          "ko": "나 벌써 앞에 도착했어."
        }
      },
      {
        "text": "Saya sudah minum obat.",
        "slot": "minum obat",
        "cue": {
          "en": "take medicine",
          "ko": "약 먹기"
        },
        "gloss": {
          "en": "I've already taken medicine.",
          "ko": "약은 벌써 먹었어요."
        }
      }
    ]
  },
  {
    "id": "id-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Saya belum ___.",
    "core": [
      "belum",
      "Belum"
    ],
    "meaning": {
      "en": "Saying something isn't done yet: I haven't ___ yet.",
      "ko": "아직 안 한 일 말하기: 아직 ___ 안 했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "belum"
    ],
    "examples": [
      {
        "text": "Saya belum makan.",
        "slot": "makan",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I haven't eaten yet.",
          "ko": "아직 안 먹었어요."
        }
      },
      {
        "text": "Saya belum mandi.",
        "slot": "mandi",
        "cue": {
          "en": "shower",
          "ko": "씻다"
        },
        "gloss": {
          "en": "I haven't showered yet.",
          "ko": "아직 안 씻었어요."
        }
      },
      {
        "text": "Aku belum tahu.",
        "slot": "tahu",
        "cue": {
          "en": "know",
          "ko": "알다"
        },
        "gloss": {
          "en": "I don't know yet.",
          "ko": "아직 몰라."
        }
      },
      {
        "text": "Saya belum minum obat.",
        "slot": "minum obat",
        "cue": {
          "en": "take medicine",
          "ko": "약 먹기"
        },
        "gloss": {
          "en": "I haven't taken any medicine yet.",
          "ko": "아직 약을 안 먹었어요."
        }
      }
    ]
  },
  {
    "id": "id-f2-03",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "Aku lagi ___.",
    "core": [
      "lagi"
    ],
    "meaning": {
      "en": "Saying what you're doing right now: I'm ___ing.",
      "ko": "지금 하는 일 말하기: 지금 ___하는 중이야."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "lagi apa"
    ],
    "examples": [
      {
        "text": "Aku lagi masak.",
        "slot": "masak",
        "cue": {
          "en": "cook",
          "ko": "요리하다"
        },
        "gloss": {
          "en": "I'm cooking.",
          "ko": "나 지금 요리 중이야."
        }
      },
      {
        "text": "Lagi apa? Aku lagi santai.",
        "slot": "santai",
        "cue": {
          "en": "relax",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "What are you up to? I'm just relaxing.",
          "ko": "뭐 해? 나는 그냥 쉬고 있어."
        }
      },
      {
        "text": "Aku lagi nonton film.",
        "slot": "nonton film",
        "cue": {
          "en": "watch a film",
          "ko": "영화 보기"
        },
        "gloss": {
          "en": "I'm watching a film.",
          "ko": "나 영화 보는 중이야."
        }
      },
      {
        "text": "Aku lagi membaca buku.",
        "slot": "membaca buku",
        "cue": {
          "en": "read a book",
          "ko": "책 읽기"
        },
        "gloss": {
          "en": "I'm reading a book.",
          "ko": "나 책 읽는 중이야."
        }
      }
    ]
  },
  {
    "id": "id-f2-04",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Besok aku mau ___.",
    "core": [
      "Besok",
      "besok"
    ],
    "meaning": {
      "en": "Saying your plan for tomorrow: Tomorrow I'm going to ___.",
      "ko": "내일 계획 말하기: 내일 ___ 하려고 해."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "besok"
    ],
    "examples": [
      {
        "text": "Besok aku mau ke pantai.",
        "slot": "ke pantai",
        "cue": {
          "en": "go to the beach",
          "ko": "해변에 가다"
        },
        "gloss": {
          "en": "Tomorrow I'm going to the beach.",
          "ko": "내일 해변에 갈 거야."
        }
      },
      {
        "text": "Besok aku mau berenang.",
        "slot": "berenang",
        "cue": {
          "en": "swim",
          "ko": "수영하다"
        },
        "gloss": {
          "en": "Tomorrow I want to go swimming.",
          "ko": "내일 수영하려고."
        }
      },
      {
        "text": "Besok aku mau membeli sepatu.",
        "slot": "membeli sepatu",
        "cue": {
          "en": "buy shoes",
          "ko": "신발 사기"
        },
        "gloss": {
          "en": "Tomorrow I'm going to buy shoes.",
          "ko": "내일 신발 사려고."
        }
      },
      {
        "text": "Besok aku mau istirahat di rumah.",
        "slot": "istirahat di rumah",
        "cue": {
          "en": "rest at home",
          "ko": "집에서 쉬기"
        },
        "gloss": {
          "en": "Tomorrow I want to rest at home.",
          "ko": "내일은 집에서 쉬려고."
        }
      }
    ]
  },
  {
    "id": "id-f2-05",
    "stage": 2,
    "fn": "want",
    "pattern": "Saya ingin ___.",
    "core": [
      "ingin"
    ],
    "meaning": {
      "en": "Saying what you'd like to do: I'd like to ___.",
      "ko": "하고 싶은 것 말하기: ___ 하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya ingin ke Bali.",
        "slot": "ke Bali",
        "cue": {
          "en": "go to Bali",
          "ko": "발리에 가다"
        },
        "gloss": {
          "en": "I'd like to go to Bali.",
          "ko": "발리에 가고 싶어요."
        }
      },
      {
        "text": "Saya ingin belajar masak.",
        "slot": "belajar masak",
        "cue": {
          "en": "learn to cook",
          "ko": "요리 배우기"
        },
        "gloss": {
          "en": "I'd like to learn to cook.",
          "ko": "요리를 배우고 싶어요."
        }
      },
      {
        "text": "Saya ingin cepat sembuh.",
        "slot": "cepat sembuh",
        "cue": {
          "en": "get better quickly",
          "ko": "빨리 낫다"
        },
        "gloss": {
          "en": "I want to get better quickly.",
          "ko": "빨리 낫고 싶어요."
        }
      },
      {
        "text": "Aku ingin mencoba sate.",
        "slot": "mencoba sate",
        "cue": {
          "en": "try satay",
          "ko": "사테 먹어 보기"
        },
        "gloss": {
          "en": "I want to try satay.",
          "ko": "사테 먹어 보고 싶어."
        }
      }
    ]
  },
  {
    "id": "id-f2-06",
    "stage": 2,
    "fn": "invite",
    "pattern": "Ayo ___!",
    "core": [
      "Ayo",
      "ayo",
      "Yuk",
      "yuk"
    ],
    "meaning": {
      "en": "Suggesting doing something together: Let's ___!",
      "ko": "같이 하자고 하기: ___ 하자!"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "ayo"
    ],
    "examples": [
      {
        "text": "Ayo makan siang bersama!",
        "slot": "makan siang",
        "cue": {
          "en": "have lunch",
          "ko": "점심 먹기"
        },
        "gloss": {
          "en": "Let's have lunch together!",
          "ko": "같이 점심 먹자!"
        }
      },
      {
        "text": "Ayo nonton film!",
        "slot": "nonton film",
        "cue": {
          "en": "watch a film",
          "ko": "영화 보기"
        },
        "gloss": {
          "en": "Let's watch a film!",
          "ko": "영화 보자!"
        }
      },
      {
        "text": "Yuk, ke pantai!",
        "slot": "ke pantai",
        "cue": {
          "en": "go to the beach",
          "ko": "해변 가기"
        },
        "gloss": {
          "en": "Come on, let's go to the beach!",
          "ko": "해변 가자!"
        }
      },
      {
        "text": "Ayo berangkat sekarang!",
        "slot": "berangkat",
        "cue": {
          "en": "set off",
          "ko": "출발하다"
        },
        "gloss": {
          "en": "Let's set off now!",
          "ko": "이제 출발하자!"
        }
      }
    ]
  },
  {
    "id": "id-f2-07",
    "stage": 2,
    "fn": "permission",
    "pattern": "Boleh saya ___?",
    "core": [
      "Boleh",
      "boleh"
    ],
    "meaning": {
      "en": "Asking permission: May I ___?",
      "ko": "허락 구하기: ___ 해도 돼요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "boleh"
    ],
    "examples": [
      {
        "text": "Boleh saya duduk di sini?",
        "slot": "duduk di sini",
        "cue": {
          "en": "sit here",
          "ko": "여기 앉기"
        },
        "gloss": {
          "en": "May I sit here?",
          "ko": "여기 앉아도 돼요?"
        }
      },
      {
        "text": "Boleh saya bayar pakai kartu?",
        "slot": "bayar pakai kartu",
        "cue": {
          "en": "pay by card",
          "ko": "카드로 계산하기"
        },
        "gloss": {
          "en": "May I pay by card?",
          "ko": "카드로 계산해도 돼요?"
        }
      },
      {
        "text": "Boleh saya minta air putih?",
        "slot": "minta air putih",
        "cue": {
          "en": "ask for plain water",
          "ko": "맹물 달라고 하기"
        },
        "gloss": {
          "en": "Could I have some plain water?",
          "ko": "맹물 좀 주실 수 있어요?"
        }
      },
      {
        "text": "Boleh saya pinjam pulpen?",
        "slot": "pinjam pulpen",
        "cue": {
          "en": "borrow a pen",
          "ko": "펜 빌리기"
        },
        "gloss": {
          "en": "May I borrow a pen?",
          "ko": "펜 좀 빌려도 돼요?"
        }
      }
    ]
  },
  {
    "id": "id-f2-08",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Minta tolong ___, ya.",
    "core": [
      "Minta tolong",
      "minta tolong",
      "Tolong",
      "tolong"
    ],
    "meaning": {
      "en": "Asking for a favour: Could you please ___?",
      "ko": "부탁하기: ___ 좀 해 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "minta tolong",
      "bungkus"
    ],
    "examples": [
      {
        "text": "Minta tolong pelan-pelan, ya.",
        "slot": "pelan-pelan",
        "cue": {
          "en": "go slowly",
          "ko": "천천히"
        },
        "gloss": {
          "en": "Could you go slowly, please?",
          "ko": "천천히 가 주세요."
        }
      },
      {
        "text": "Minta tolong berhenti di depan, ya.",
        "slot": "berhenti di depan",
        "cue": {
          "en": "stop up ahead",
          "ko": "앞에서 세우기"
        },
        "gloss": {
          "en": "Could you stop up ahead, please?",
          "ko": "앞에서 세워 주세요."
        }
      },
      {
        "text": "Minta tolong bungkus, ya.",
        "slot": "bungkus",
        "cue": {
          "en": "wrap it to take away",
          "ko": "포장하기"
        },
        "gloss": {
          "en": "Could you wrap it to take away, please?",
          "ko": "포장해 주세요."
        }
      },
      {
        "text": "Tolong tunggu sebentar, ya.",
        "slot": "tunggu sebentar",
        "cue": {
          "en": "wait a moment",
          "ko": "잠깐 기다리기"
        },
        "gloss": {
          "en": "Please wait a moment.",
          "ko": "잠깐만 기다려 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f2-09",
    "stage": 2,
    "fn": "reason",
    "pattern": "… karena ___.",
    "core": [
      "karena"
    ],
    "meaning": {
      "en": "Giving a reason: … because ___.",
      "ko": "이유 말하기: ___ 때문에 …"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "saya sakit kepala"
    ],
    "examples": [
      {
        "text": "Aku nggak datang karena hujan.",
        "slot": "hujan",
        "cue": {
          "en": "it was raining",
          "ko": "비가 와서"
        },
        "gloss": {
          "en": "I didn't come because it was raining.",
          "ko": "비가 와서 안 갔어."
        }
      },
      {
        "text": "Saya pulang cepat karena saya sakit kepala.",
        "slot": "saya sakit kepala",
        "cue": {
          "en": "I have a headache",
          "ko": "머리가 아파서"
        },
        "gloss": {
          "en": "I'm going home early because I have a headache.",
          "ko": "머리가 아파서 일찍 집에 가요."
        }
      },
      {
        "text": "Aku telat karena macet.",
        "slot": "macet",
        "cue": {
          "en": "there was a traffic jam",
          "ko": "길이 막혀서"
        },
        "gloss": {
          "en": "I'm late because of the traffic jam.",
          "ko": "길이 막혀서 늦었어."
        }
      },
      {
        "text": "Saya pesan bungkus karena buru-buru.",
        "slot": "buru-buru",
        "cue": {
          "en": "I'm in a hurry",
          "ko": "바빠서"
        },
        "gloss": {
          "en": "I'm getting it to go because I'm in a hurry.",
          "ko": "바빠서 포장으로 시켰어요."
        }
      }
    ]
  },
  {
    "id": "id-f2-10",
    "stage": 2,
    "fn": "experience",
    "pattern": "Kamu pernah ___?",
    "core": [
      "pernah"
    ],
    "meaning": {
      "en": "Asking about or stating experience: Have you ever ___?",
      "ko": "경험 묻고 말하기: ___ 해 본 적 있어?"
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kamu pernah ke Yogyakarta?",
        "slot": "ke Yogyakarta",
        "cue": {
          "en": "go to Yogyakarta",
          "ko": "족자카르타에 가다"
        },
        "gloss": {
          "en": "Have you ever been to Yogyakarta?",
          "ko": "족자카르타 가 본 적 있어?"
        }
      },
      {
        "text": "Kamu pernah makan durian?",
        "slot": "makan durian",
        "cue": {
          "en": "eat durian",
          "ko": "두리안 먹기"
        },
        "gloss": {
          "en": "Have you ever eaten durian?",
          "ko": "두리안 먹어 본 적 있어?"
        }
      },
      {
        "text": "Aku belum pernah naik ojek.",
        "slot": "naik ojek",
        "cue": {
          "en": "ride a motorbike taxi",
          "ko": "오토바이 택시 타기"
        },
        "gloss": {
          "en": "I've never taken a motorbike taxi.",
          "ko": "오토바이 택시는 아직 타 본 적 없어."
        }
      },
      {
        "text": "Saya pernah tinggal di Bandung.",
        "slot": "tinggal di Bandung",
        "cue": {
          "en": "live in Bandung",
          "ko": "반둥에 살다"
        },
        "gloss": {
          "en": "I've lived in Bandung before.",
          "ko": "반둥에 살아 본 적 있어요."
        }
      }
    ]
  },
  {
    "id": "id-f2-11",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Ketemu ___, ya?",
    "core": [
      "Ketemu",
      "ketemu"
    ],
    "meaning": {
      "en": "Setting a time or place to meet: Let's meet ___, okay?",
      "ko": "약속 정하기: ___ 만나자, 응?"
    },
    "grammar": [],
    "expressions": [
      "besok",
      "nanti"
    ],
    "examples": [
      {
        "text": "Ketemu di stasiun, ya?",
        "slot": "di stasiun",
        "cue": {
          "en": "at the station",
          "ko": "역에서"
        },
        "gloss": {
          "en": "Let's meet at the station, okay?",
          "ko": "역에서 만나자, 응?"
        }
      },
      {
        "text": "Ketemu jam sepuluh, ya?",
        "slot": "jam sepuluh",
        "cue": {
          "en": "at ten",
          "ko": "10시에"
        },
        "gloss": {
          "en": "Let's meet at ten, okay?",
          "ko": "10시에 만나자, 응?"
        }
      },
      {
        "text": "Ketemu besok, ya?",
        "slot": "besok",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "See you tomorrow, okay?",
          "ko": "내일 만나자, 응?"
        }
      },
      {
        "text": "Ketemu nanti sore, ya?",
        "slot": "nanti sore",
        "cue": {
          "en": "later this afternoon",
          "ko": "이따 오후에"
        },
        "gloss": {
          "en": "Let's meet later this afternoon, okay?",
          "ko": "이따 오후에 만나자, 응?"
        }
      }
    ]
  },
  {
    "id": "id-f2-12",
    "stage": 2,
    "fn": "time-when",
    "pattern": "___ jam berapa?",
    "core": [
      "jam berapa"
    ],
    "meaning": {
      "en": "Asking what time something happens: What time ___?",
      "ko": "시간 묻기: ___ 몇 시예요?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "jam berapa"
    ],
    "examples": [
      {
        "text": "Kita berangkat jam berapa?",
        "slot": "Kita berangkat",
        "cue": {
          "en": "we leave",
          "ko": "우리가 출발하다"
        },
        "gloss": {
          "en": "What time do we leave?",
          "ko": "우리 몇 시에 출발해?"
        }
      },
      {
        "text": "Filmnya mulai jam berapa?",
        "slot": "Filmnya mulai",
        "cue": {
          "en": "the film starts",
          "ko": "영화가 시작하다"
        },
        "gloss": {
          "en": "What time does the film start?",
          "ko": "영화 몇 시에 시작해?"
        }
      },
      {
        "text": "Apoteknya tutup jam berapa?",
        "slot": "Apoteknya tutup",
        "cue": {
          "en": "the pharmacy closes",
          "ko": "약국이 닫다"
        },
        "gloss": {
          "en": "What time does the pharmacy close?",
          "ko": "약국 몇 시에 닫아요?"
        }
      },
      {
        "text": "Kamu pulang jam berapa?",
        "slot": "Kamu pulang",
        "cue": {
          "en": "you go home",
          "ko": "네가 집에 가다"
        },
        "gloss": {
          "en": "What time are you going home?",
          "ko": "너 몇 시에 집에 가?"
        }
      }
    ]
  },
  {
    "id": "id-f2-13",
    "stage": 2,
    "fn": "order",
    "pattern": "Saya pesan ___.",
    "core": [
      "Saya pesan",
      "saya pesan"
    ],
    "meaning": {
      "en": "Ordering food: I'll have ___.",
      "ko": "주문하기: ___ 주세요."
    },
    "grammar": [],
    "expressions": [
      "makan di sini",
      "bungkus"
    ],
    "examples": [
      {
        "text": "Saya pesan nasi goreng.",
        "slot": "nasi goreng",
        "cue": {
          "en": "fried rice",
          "ko": "나시고렝"
        },
        "gloss": {
          "en": "I'll have fried rice.",
          "ko": "나시고렝 주세요."
        }
      },
      {
        "text": "Saya pesan es teh manis.",
        "slot": "es teh manis",
        "cue": {
          "en": "sweet iced tea",
          "ko": "달콤한 아이스티"
        },
        "gloss": {
          "en": "I'll have a sweet iced tea.",
          "ko": "달콤한 아이스티 주세요."
        }
      },
      {
        "text": "Saya pesan mi ayam, makan di sini.",
        "slot": "mi ayam",
        "cue": {
          "en": "chicken noodles",
          "ko": "닭고기 국수"
        },
        "gloss": {
          "en": "I'll have chicken noodles, to eat here.",
          "ko": "미아얌 주세요, 여기서 먹을게요."
        }
      },
      {
        "text": "Saya pesan sate ayam, bungkus.",
        "slot": "sate ayam",
        "cue": {
          "en": "chicken satay",
          "ko": "닭고기 사테"
        },
        "gloss": {
          "en": "I'll have chicken satay, to go.",
          "ko": "닭고기 사테 포장으로 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f2-14",
    "stage": 2,
    "fn": "order",
    "pattern": "___, nggak pedas ya.",
    "core": [
      "nggak pedas"
    ],
    "meaning": {
      "en": "Ordering without chilli: ___, not spicy, please.",
      "ko": "덜 맵게 주문하기: ___, 안 맵게 해 주세요."
    },
    "grammar": [],
    "expressions": [
      "nggak pedas ya"
    ],
    "examples": [
      {
        "text": "Nasi gorengnya satu, nggak pedas ya.",
        "slot": "Nasi gorengnya satu",
        "cue": {
          "en": "one fried rice",
          "ko": "나시고렝 하나"
        },
        "gloss": {
          "en": "One fried rice, not spicy, please.",
          "ko": "나시고렝 하나, 안 맵게 해 주세요."
        }
      },
      {
        "text": "Mi ayam dua, nggak pedas ya.",
        "slot": "Mi ayam dua",
        "cue": {
          "en": "two chicken noodles",
          "ko": "닭고기 국수 둘"
        },
        "gloss": {
          "en": "Two chicken noodles, not spicy, please.",
          "ko": "미아얌 두 개, 안 맵게 해 주세요."
        }
      },
      {
        "text": "Sotonya satu, nggak pedas ya.",
        "slot": "Sotonya satu",
        "cue": {
          "en": "one soto soup",
          "ko": "소토 수프 하나"
        },
        "gloss": {
          "en": "One soto, not spicy, please.",
          "ko": "소토 하나, 안 맵게 해 주세요."
        }
      },
      {
        "text": "Ayam bakar satu, nggak pedas ya.",
        "slot": "Ayam bakar satu",
        "cue": {
          "en": "one grilled chicken",
          "ko": "구운 닭 하나"
        },
        "gloss": {
          "en": "One grilled chicken, not spicy, please.",
          "ko": "구운 닭 하나, 안 맵게 해 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f2-15",
    "stage": 2,
    "fn": "directions",
    "pattern": "___ di sini, Pak.",
    "core": [
      "di sini"
    ],
    "meaning": {
      "en": "Telling a driver what to do here: ___ here, please.",
      "ko": "기사님께 말하기: 여기서 ___ 주세요."
    },
    "grammar": [],
    "expressions": [
      "kiri di sini"
    ],
    "examples": [
      {
        "text": "Kiri di sini, Pak.",
        "slot": "Kiri",
        "cue": {
          "en": "pull over (left)",
          "ko": "왼쪽에 세우기"
        },
        "gloss": {
          "en": "Pull over here, please.",
          "ko": "여기서 세워 주세요."
        }
      },
      {
        "text": "Berhenti di sini, Pak.",
        "slot": "Berhenti",
        "cue": {
          "en": "stop",
          "ko": "멈추다"
        },
        "gloss": {
          "en": "Stop here, please.",
          "ko": "여기서 멈춰 주세요."
        }
      },
      {
        "text": "Turun di sini, Mas.",
        "slot": "Turun",
        "cue": {
          "en": "get off",
          "ko": "내리다"
        },
        "gloss": {
          "en": "I'll get off here.",
          "ko": "여기서 내릴게요."
        }
      },
      {
        "text": "Tunggu di sini, ya.",
        "slot": "Tunggu",
        "cue": {
          "en": "wait",
          "ko": "기다리다"
        },
        "gloss": {
          "en": "Wait here, okay?",
          "ko": "여기서 기다려 줘요."
        }
      }
    ]
  },
  {
    "id": "id-f2-16",
    "stage": 2,
    "fn": "symptom",
    "pattern": "Saya sakit ___.",
    "core": [
      "sakit"
    ],
    "meaning": {
      "en": "Saying what hurts: I have a ___ache.",
      "ko": "아픈 곳 말하기: ___가 아파요."
    },
    "grammar": [],
    "expressions": [
      "saya sakit kepala"
    ],
    "examples": [
      {
        "text": "Saya sakit kepala.",
        "slot": "kepala",
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
        "text": "Saya sakit perut.",
        "slot": "perut",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "I have a stomachache.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "Saya sakit gigi.",
        "slot": "gigi",
        "cue": {
          "en": "tooth",
          "ko": "이"
        },
        "gloss": {
          "en": "I have a toothache.",
          "ko": "이가 아파요."
        }
      },
      {
        "text": "Anak saya sakit tenggorokan.",
        "slot": "tenggorokan",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "My child has a sore throat.",
          "ko": "우리 아이가 목이 아파요."
        }
      }
    ]
  },
  {
    "id": "id-f2-17",
    "stage": 2,
    "fn": "duration",
    "pattern": "Saya ___ sejak …",
    "core": [
      "sejak",
      "Sejak"
    ],
    "meaning": {
      "en": "Saying how long something has gone on: I've had ___ since …",
      "ko": "얼마나 됐는지 말하기: … 부터 ___했어요."
    },
    "grammar": [],
    "expressions": [
      "masuk angin"
    ],
    "examples": [
      {
        "text": "Saya batuk sejak kemarin.",
        "slot": "batuk",
        "cue": {
          "en": "a cough",
          "ko": "기침"
        },
        "gloss": {
          "en": "I've been coughing since yesterday.",
          "ko": "어제부터 기침이 나요."
        }
      },
      {
        "text": "Saya demam sejak tadi malam.",
        "slot": "demam",
        "cue": {
          "en": "a fever",
          "ko": "열"
        },
        "gloss": {
          "en": "I've had a fever since last night.",
          "ko": "어젯밤부터 열이 나요."
        }
      },
      {
        "text": "Saya masuk angin sejak kemarin.",
        "slot": "masuk angin",
        "cue": {
          "en": "a chill (masuk angin)",
          "ko": "몸살 기운"
        },
        "gloss": {
          "en": "I've been feeling under the weather since yesterday.",
          "ko": "어제부터 몸살 기운이 있어요."
        }
      },
      {
        "text": "Saya pilek sejak hari Senin.",
        "slot": "pilek",
        "cue": {
          "en": "a runny nose",
          "ko": "콧물"
        },
        "gloss": {
          "en": "I've had a runny nose since Monday.",
          "ko": "월요일부터 콧물이 나요."
        }
      }
    ]
  },
  {
    "id": "id-f2-18",
    "stage": 2,
    "fn": "routine",
    "pattern": "Setiap pagi saya ___.",
    "core": [
      "Setiap",
      "setiap"
    ],
    "meaning": {
      "en": "Describing your routine: Every morning I ___.",
      "ko": "일과 말하기: 매일 아침 ___해요."
    },
    "grammar": [
      1,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Setiap pagi saya membaca berita.",
        "slot": "membaca berita",
        "cue": {
          "en": "read the news",
          "ko": "뉴스 읽기"
        },
        "gloss": {
          "en": "Every morning I read the news.",
          "ko": "매일 아침 뉴스를 읽어요."
        }
      },
      {
        "text": "Setiap pagi saya berolahraga.",
        "slot": "berolahraga",
        "cue": {
          "en": "exercise",
          "ko": "운동하다"
        },
        "gloss": {
          "en": "Every morning I exercise.",
          "ko": "매일 아침 운동해요."
        }
      },
      {
        "text": "Setiap pagi saya minum kopi.",
        "slot": "minum kopi",
        "cue": {
          "en": "drink coffee",
          "ko": "커피 마시기"
        },
        "gloss": {
          "en": "Every morning I drink coffee.",
          "ko": "매일 아침 커피를 마셔요."
        }
      },
      {
        "text": "Setiap pagi saya mengantar anak ke sekolah.",
        "slot": "mengantar anak ke sekolah",
        "cue": {
          "en": "take my child to school",
          "ko": "아이를 학교에 데려다주기"
        },
        "gloss": {
          "en": "Every morning I take my child to school.",
          "ko": "매일 아침 아이를 학교에 데려다줘요."
        }
      }
    ]
  },
  {
    "id": "id-f2-19",
    "stage": 2,
    "fn": "describe-thing",
    "pattern": "___ seru banget!",
    "core": [
      "seru banget",
      "Seru banget"
    ],
    "meaning": {
      "en": "Saying something was great fun: ___ was so much fun!",
      "ko": "재밌었다고 말하기: ___ 진짜 재밌었어!"
    },
    "grammar": [],
    "expressions": [
      "seru banget"
    ],
    "examples": [
      {
        "text": "Filmnya seru banget!",
        "slot": "Filmnya",
        "cue": {
          "en": "the film",
          "ko": "그 영화"
        },
        "gloss": {
          "en": "The film was so exciting!",
          "ko": "영화 진짜 재밌었어!"
        }
      },
      {
        "text": "Konsernya seru banget!",
        "slot": "Konsernya",
        "cue": {
          "en": "the concert",
          "ko": "그 콘서트"
        },
        "gloss": {
          "en": "The concert was so much fun!",
          "ko": "콘서트 완전 신났어!"
        }
      },
      {
        "text": "Liburannya seru banget!",
        "slot": "Liburannya",
        "cue": {
          "en": "the holiday",
          "ko": "그 휴가"
        },
        "gloss": {
          "en": "The holiday was so much fun!",
          "ko": "휴가 진짜 재밌었어!"
        }
      },
      {
        "text": "Permainannya seru banget!",
        "slot": "Permainannya",
        "cue": {
          "en": "the game",
          "ko": "그 게임"
        },
        "gloss": {
          "en": "The game was so much fun!",
          "ko": "그 게임 완전 재밌었어!"
        }
      }
    ]
  },
  {
    "id": "id-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Menurut saya, ___.",
    "core": [
      "Menurut saya",
      "menurut saya",
      "Menurut aku",
      "menurut aku"
    ],
    "meaning": {
      "en": "Giving your opinion: In my opinion, ___.",
      "ko": "내 생각 말하기: 제 생각에는 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "menurut saya"
    ],
    "examples": [
      {
        "text": "Menurut saya, filmnya agak membosankan.",
        "slot": "filmnya agak membosankan",
        "cue": {
          "en": "the film is a bit boring",
          "ko": "영화가 좀 지루하다"
        },
        "gloss": {
          "en": "In my opinion, the film is a bit boring.",
          "ko": "제 생각엔 영화가 좀 지루해요."
        }
      },
      {
        "text": "Menurut saya, Lombok lebih indah.",
        "slot": "Lombok lebih indah",
        "cue": {
          "en": "Lombok is more beautiful",
          "ko": "롬복이 더 아름답다"
        },
        "gloss": {
          "en": "In my opinion, Lombok is more beautiful.",
          "ko": "제 생각엔 롬복이 더 아름다워요."
        }
      },
      {
        "text": "Menurut aku, idenya bagus.",
        "slot": "idenya bagus",
        "cue": {
          "en": "the idea is good",
          "ko": "아이디어가 좋다"
        },
        "gloss": {
          "en": "I think the idea is good.",
          "ko": "내 생각엔 아이디어 좋아."
        }
      },
      {
        "text": "Menurut saya, harganya terlalu mahal.",
        "slot": "harganya terlalu mahal",
        "cue": {
          "en": "the price is too high",
          "ko": "값이 너무 비싸다"
        },
        "gloss": {
          "en": "In my opinion, the price is too high.",
          "ko": "제 생각엔 가격이 너무 비싸요."
        }
      }
    ]
  },
  {
    "id": "id-f3-02",
    "stage": 3,
    "fn": "guess",
    "pattern": "Kayaknya ___.",
    "core": [
      "Kayaknya",
      "kayaknya"
    ],
    "meaning": {
      "en": "Guessing: It looks like ___ / I guess ___.",
      "ko": "짐작하기: ___인 것 같아."
    },
    "grammar": [],
    "expressions": [
      "kayaknya",
      "capek banget"
    ],
    "examples": [
      {
        "text": "Kayaknya mau hujan.",
        "slot": "mau hujan",
        "cue": {
          "en": "it's going to rain",
          "ko": "비가 올 것이다"
        },
        "gloss": {
          "en": "Looks like it's going to rain.",
          "ko": "비 올 것 같아."
        }
      },
      {
        "text": "Kayaknya dia capek banget.",
        "slot": "dia capek banget",
        "cue": {
          "en": "she's really tired",
          "ko": "그녀가 많이 피곤하다"
        },
        "gloss": {
          "en": "She seems really tired.",
          "ko": "그 사람 엄청 피곤한 것 같아."
        }
      },
      {
        "text": "Kayaknya kamarnya sudah penuh.",
        "slot": "kamarnya sudah penuh",
        "cue": {
          "en": "the rooms are full",
          "ko": "방이 다 찼다"
        },
        "gloss": {
          "en": "It looks like the rooms are full.",
          "ko": "방이 다 찬 것 같아요."
        }
      },
      {
        "text": "Kayaknya ceritanya agak dipaksakan.",
        "slot": "ceritanya agak dipaksakan",
        "cue": {
          "en": "the story is a bit forced",
          "ko": "이야기가 좀 억지스럽다"
        },
        "gloss": {
          "en": "I think the story is a bit forced.",
          "ko": "이야기가 좀 억지스러운 것 같아."
        }
      }
    ]
  },
  {
    "id": "id-f3-03",
    "stage": 3,
    "fn": "compare",
    "pattern": "… lebih ___ daripada …",
    "core": [
      "lebih"
    ],
    "meaning": {
      "en": "Comparing two things: … is more ___ than …",
      "ko": "둘 비교하기: …가 …보다 더 ___해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Lombok lebih sepi daripada Bali.",
        "slot": "sepi",
        "cue": {
          "en": "quiet",
          "ko": "한적하다"
        },
        "gloss": {
          "en": "Lombok is quieter than Bali.",
          "ko": "롬복이 발리보다 더 한적해요."
        }
      },
      {
        "text": "Kerja di sini lebih santai daripada di kantor lama.",
        "slot": "santai",
        "cue": {
          "en": "relaxed",
          "ko": "여유롭다"
        },
        "gloss": {
          "en": "Working here is more relaxed than at my old office.",
          "ko": "여기서 일하는 게 예전 회사보다 더 여유로워요."
        }
      },
      {
        "text": "Musim ini lebih seru daripada musim lalu.",
        "slot": "seru",
        "cue": {
          "en": "exciting",
          "ko": "재밌다"
        },
        "gloss": {
          "en": "This season is more exciting than last season.",
          "ko": "이번 시즌이 지난 시즌보다 더 재밌어."
        }
      },
      {
        "text": "Naik kereta lebih cepat daripada naik mobil.",
        "slot": "cepat",
        "cue": {
          "en": "fast",
          "ko": "빠르다"
        },
        "gloss": {
          "en": "Taking the train is faster than going by car.",
          "ko": "기차 타는 게 차 타는 것보다 더 빨라요."
        }
      }
    ]
  },
  {
    "id": "id-f3-04",
    "stage": 3,
    "fn": "compare",
    "pattern": "Yang paling ___ itu …",
    "core": [
      "paling"
    ],
    "meaning": {
      "en": "Picking out the most: The most ___ one is …",
      "ko": "가장 ~한 것 말하기: 제일 ___한 건 …예요."
    },
    "grammar": [
      2,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Yang paling bagus itu pantainya.",
        "slot": "bagus",
        "cue": {
          "en": "nice",
          "ko": "좋다"
        },
        "gloss": {
          "en": "The best part is the beach.",
          "ko": "제일 좋은 건 해변이에요."
        }
      },
      {
        "text": "Yang paling aku suka itu tokoh utamanya.",
        "slot": "aku suka",
        "cue": {
          "en": "I like",
          "ko": "내가 좋아하다"
        },
        "gloss": {
          "en": "The one I like most is the main character.",
          "ko": "내가 제일 좋아하는 건 주인공이야."
        }
      },
      {
        "text": "Yang paling susah itu bangun pagi.",
        "slot": "susah",
        "cue": {
          "en": "hard",
          "ko": "어렵다"
        },
        "gloss": {
          "en": "The hardest thing is getting up early.",
          "ko": "제일 힘든 건 아침에 일어나는 거예요."
        }
      },
      {
        "text": "Yang paling ramah itu Pak Dodi.",
        "slot": "ramah",
        "cue": {
          "en": "friendly",
          "ko": "친절하다"
        },
        "gloss": {
          "en": "The friendliest one is Mr Dodi.",
          "ko": "제일 친절한 사람은 도디 씨예요."
        }
      }
    ]
  },
  {
    "id": "id-f3-05",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Bisa tolong ___?",
    "core": [
      "Bisa tolong",
      "bisa tolong"
    ],
    "meaning": {
      "en": "Politely asking someone to do something (-kan / -i verbs): Could you please ___?",
      "ko": "공손하게 부탁하기: ___ 해 주실 수 있어요?"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Bisa tolong kirimkan konfirmasinya?",
        "slot": "kirimkan konfirmasinya",
        "cue": {
          "en": "send the confirmation",
          "ko": "확인서 보내 주기"
        },
        "gloss": {
          "en": "Could you please send the confirmation?",
          "ko": "확인서 좀 보내 주실 수 있어요?"
        }
      },
      {
        "text": "Bisa tolong carikan kamar lain?",
        "slot": "carikan kamar lain",
        "cue": {
          "en": "find another room",
          "ko": "다른 방 찾아 주기"
        },
        "gloss": {
          "en": "Could you please find me another room?",
          "ko": "다른 방 좀 찾아 주실 수 있어요?"
        }
      },
      {
        "text": "Bisa tolong jelaskan sekali lagi?",
        "slot": "jelaskan sekali lagi",
        "cue": {
          "en": "explain once more",
          "ko": "한 번 더 설명하기"
        },
        "gloss": {
          "en": "Could you please explain once more?",
          "ko": "한 번 더 설명해 주실 수 있어요?"
        }
      },
      {
        "text": "Bisa tolong matikan AC-nya?",
        "slot": "matikan AC-nya",
        "cue": {
          "en": "turn off the AC",
          "ko": "에어컨 끄기"
        },
        "gloss": {
          "en": "Could you please turn off the AC?",
          "ko": "에어컨 좀 꺼 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "id-f3-06",
    "stage": 3,
    "fn": "complain",
    "pattern": "Ada masalah dengan ___.",
    "core": [
      "Ada masalah",
      "ada masalah"
    ],
    "meaning": {
      "en": "Reporting a problem: There's a problem with ___.",
      "ko": "문제 알리기: ___에 문제가 있어요."
    },
    "grammar": [],
    "expressions": [
      "ada masalah"
    ],
    "examples": [
      {
        "text": "Ada masalah dengan pemesanan saya.",
        "slot": "pemesanan saya",
        "cue": {
          "en": "my booking",
          "ko": "내 예약"
        },
        "gloss": {
          "en": "There's a problem with my booking.",
          "ko": "제 예약에 문제가 있어요."
        }
      },
      {
        "text": "Ada masalah dengan AC di kamar.",
        "slot": "AC di kamar",
        "cue": {
          "en": "the AC in the room",
          "ko": "방 에어컨"
        },
        "gloss": {
          "en": "There's a problem with the AC in the room.",
          "ko": "방 에어컨에 문제가 있어요."
        }
      },
      {
        "text": "Ada masalah dengan tagihan saya.",
        "slot": "tagihan saya",
        "cue": {
          "en": "my bill",
          "ko": "내 청구서"
        },
        "gloss": {
          "en": "There's a problem with my bill.",
          "ko": "제 청구서에 문제가 있어요."
        }
      },
      {
        "text": "Ada masalah dengan laptop saya.",
        "slot": "laptop saya",
        "cue": {
          "en": "my laptop",
          "ko": "내 노트북"
        },
        "gloss": {
          "en": "There's a problem with my laptop.",
          "ko": "제 노트북에 문제가 있어요."
        }
      }
    ]
  },
  {
    "id": "id-f3-07",
    "stage": 3,
    "fn": "while-when",
    "pattern": "Waktu ___, …",
    "core": [
      "Waktu",
      "waktu"
    ],
    "meaning": {
      "en": "Saying when something happened in the past: When ___, …",
      "ko": "과거의 때 말하기: ___ 때 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Waktu di Lombok, aku naik ke bukit setiap pagi.",
        "slot": "di Lombok",
        "cue": {
          "en": "in Lombok",
          "ko": "롬복에 있다"
        },
        "gloss": {
          "en": "When I was in Lombok, I climbed the hill every morning.",
          "ko": "롬복에 있을 때 매일 아침 언덕에 올랐어."
        }
      },
      {
        "text": "Waktu kecil, saya tinggal di Medan.",
        "slot": "kecil",
        "cue": {
          "en": "little",
          "ko": "어리다"
        },
        "gloss": {
          "en": "When I was little, I lived in Medan.",
          "ko": "어릴 때 메단에 살았어요."
        }
      },
      {
        "text": "Waktu saya sampai, kamarnya belum siap.",
        "slot": "saya sampai",
        "cue": {
          "en": "I arrived",
          "ko": "내가 도착하다"
        },
        "gloss": {
          "en": "When I arrived, the room wasn't ready.",
          "ko": "제가 도착했을 때 방이 아직 준비 안 됐었어요."
        }
      },
      {
        "text": "Waktu kuliah, aku sering begadang.",
        "slot": "kuliah",
        "cue": {
          "en": "at university",
          "ko": "대학 다니다"
        },
        "gloss": {
          "en": "When I was at university, I often stayed up late.",
          "ko": "대학 다닐 때 자주 밤을 샜어."
        }
      }
    ]
  },
  {
    "id": "id-f3-08",
    "stage": 3,
    "fn": "condition",
    "pattern": "Kalau ___, …",
    "core": [
      "Kalau",
      "kalau"
    ],
    "meaning": {
      "en": "Saying what happens if: If ___, …",
      "ko": "조건 말하기: ___면 …"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "lebih baik",
      "ada masalah"
    ],
    "examples": [
      {
        "text": "Kalau hujan, kita di rumah saja.",
        "slot": "hujan",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "If it rains, we'll just stay home.",
          "ko": "비 오면 그냥 집에 있자."
        }
      },
      {
        "text": "Kalau sempat, mampir ke kantor, ya.",
        "slot": "sempat",
        "cue": {
          "en": "you have time",
          "ko": "시간이 되다"
        },
        "gloss": {
          "en": "If you have time, drop by the office.",
          "ko": "시간 되면 사무실에 들러."
        }
      },
      {
        "text": "Kalau mau sepi, lebih baik datang bulan Mei.",
        "slot": "mau sepi",
        "cue": {
          "en": "you want it quiet",
          "ko": "한적한 걸 원하다"
        },
        "gloss": {
          "en": "If you want it quiet, it's better to come in May.",
          "ko": "한적한 게 좋으면 5월에 오는 게 나아."
        }
      },
      {
        "text": "Kalau ada masalah, telepon saya saja.",
        "slot": "ada masalah",
        "cue": {
          "en": "there's a problem",
          "ko": "문제가 있다"
        },
        "gloss": {
          "en": "If there's a problem, just call me.",
          "ko": "문제 있으면 그냥 저한테 전화하세요."
        }
      }
    ]
  },
  {
    "id": "id-f3-09",
    "stage": 3,
    "fn": "lost-problem",
    "pattern": "___ tertinggal di …",
    "core": [
      "tertinggal"
    ],
    "meaning": {
      "en": "Saying something got left behind by accident: I left ___ at …",
      "ko": "실수로 두고 온 것 말하기: ___를 …에 두고 왔어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kuncinya tertinggal di mobil.",
        "slot": "Kuncinya",
        "cue": {
          "en": "the key",
          "ko": "열쇠"
        },
        "gloss": {
          "en": "The key got left in the car.",
          "ko": "열쇠를 차에 두고 왔어요."
        }
      },
      {
        "text": "Dompet aku tertinggal di taksi.",
        "slot": "Dompet aku",
        "cue": {
          "en": "my wallet",
          "ko": "내 지갑"
        },
        "gloss": {
          "en": "I left my wallet in the taxi.",
          "ko": "지갑을 택시에 두고 내렸어."
        }
      },
      {
        "text": "Charger saya tertinggal di kamar.",
        "slot": "Charger saya",
        "cue": {
          "en": "my charger",
          "ko": "내 충전기"
        },
        "gloss": {
          "en": "I left my charger in the room.",
          "ko": "충전기를 방에 두고 왔어요."
        }
      },
      {
        "text": "Kacamataku tertinggal di kapal.",
        "slot": "Kacamataku",
        "cue": {
          "en": "my glasses",
          "ko": "내 안경"
        },
        "gloss": {
          "en": "I left my glasses on the boat.",
          "ko": "안경을 배에 두고 내렸어."
        }
      }
    ]
  },
  {
    "id": "id-f3-10",
    "stage": 3,
    "fn": "want",
    "pattern": "Saya mau yang ___.",
    "core": [
      "yang"
    ],
    "meaning": {
      "en": "Picking out the one you want: I'd like the one that's ___.",
      "ko": "골라서 말하기: ___인 걸로 할게요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Saya mau yang warna biru.",
        "slot": "warna biru",
        "cue": {
          "en": "blue",
          "ko": "파란색"
        },
        "gloss": {
          "en": "I'd like the blue one.",
          "ko": "파란색으로 할게요."
        }
      },
      {
        "text": "Saya mau yang paling murah.",
        "slot": "paling murah",
        "cue": {
          "en": "cheapest",
          "ko": "제일 싼"
        },
        "gloss": {
          "en": "I'd like the cheapest one.",
          "ko": "제일 싼 걸로 할게요."
        }
      },
      {
        "text": "Saya mau yang menghadap laut.",
        "slot": "menghadap laut",
        "cue": {
          "en": "facing the sea",
          "ko": "바다 쪽"
        },
        "gloss": {
          "en": "I'd like the one facing the sea.",
          "ko": "바다 보이는 걸로 할게요."
        }
      },
      {
        "text": "Saya mau yang ada sarapannya.",
        "slot": "ada sarapannya",
        "cue": {
          "en": "with breakfast",
          "ko": "조식 포함"
        },
        "gloss": {
          "en": "I'd like the one with breakfast.",
          "ko": "조식 포함인 걸로 할게요."
        }
      }
    ]
  },
  {
    "id": "id-f3-11",
    "stage": 3,
    "fn": "report",
    "pattern": "… sudah di___.",
    "core": [
      "sudah di"
    ],
    "meaning": {
      "en": "Saying something has been done (di- passive): … has been ___.",
      "ko": "되어 있다고 말하기(di- 수동): …가 ___됐어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kamarnya sudah dibersihkan.",
        "slot": "bersihkan",
        "cue": {
          "en": "clean",
          "ko": "청소하다"
        },
        "gloss": {
          "en": "The room has been cleaned.",
          "ko": "방은 청소됐어요."
        }
      },
      {
        "text": "Pesanannya sudah dikirim.",
        "slot": "kirim",
        "cue": {
          "en": "send",
          "ko": "보내다"
        },
        "gloss": {
          "en": "The order has been sent.",
          "ko": "주문은 발송됐어요."
        }
      },
      {
        "text": "Tagihannya sudah dibayar.",
        "slot": "bayar",
        "cue": {
          "en": "pay",
          "ko": "지불하다"
        },
        "gloss": {
          "en": "The bill has been paid.",
          "ko": "청구서는 지불됐어요."
        }
      },
      {
        "text": "Datanya sudah disimpan.",
        "slot": "simpan",
        "cue": {
          "en": "save",
          "ko": "저장하다"
        },
        "gloss": {
          "en": "The data has been saved.",
          "ko": "데이터는 저장됐어요."
        }
      }
    ]
  },
  {
    "id": "id-f3-12",
    "stage": 3,
    "fn": "report",
    "pattern": "___ sudah saya cek.",
    "core": [
      "sudah saya cek"
    ],
    "meaning": {
      "en": "Saying you've checked something: I've checked ___.",
      "ko": "확인했다고 말하기: ___는 제가 확인했어요."
    },
    "grammar": [],
    "expressions": [
      "sudah saya cek"
    ],
    "examples": [
      {
        "text": "Emailnya sudah saya cek.",
        "slot": "Emailnya",
        "cue": {
          "en": "the email",
          "ko": "이메일"
        },
        "gloss": {
          "en": "I've checked the email.",
          "ko": "이메일은 제가 확인했어요."
        }
      },
      {
        "text": "Jadwalnya sudah saya cek.",
        "slot": "Jadwalnya",
        "cue": {
          "en": "the schedule",
          "ko": "일정"
        },
        "gloss": {
          "en": "I've checked the schedule.",
          "ko": "일정은 제가 확인했어요."
        }
      },
      {
        "text": "Datanya sudah saya cek.",
        "slot": "Datanya",
        "cue": {
          "en": "the data",
          "ko": "데이터"
        },
        "gloss": {
          "en": "I've checked the data.",
          "ko": "데이터는 제가 확인했어요."
        }
      },
      {
        "text": "Kamarnya sudah saya cek.",
        "slot": "Kamarnya",
        "cue": {
          "en": "the room",
          "ko": "방"
        },
        "gloss": {
          "en": "I've checked the room.",
          "ko": "방은 제가 확인했어요."
        }
      }
    ]
  },
  {
    "id": "id-f3-13",
    "stage": 3,
    "fn": "agree",
    "pattern": "Saya setuju ___.",
    "core": [
      "setuju"
    ],
    "meaning": {
      "en": "Agreeing or gently disagreeing: I agree ___.",
      "ko": "동의·반대하기: ___ 동의해요."
    },
    "grammar": [],
    "expressions": [
      "saya setuju",
      "kurang setuju"
    ],
    "examples": [
      {
        "text": "Saya setuju dengan idenya.",
        "slot": "dengan idenya",
        "cue": {
          "en": "with the idea",
          "ko": "그 아이디어에"
        },
        "gloss": {
          "en": "I agree with the idea.",
          "ko": "그 아이디어에 동의해요."
        }
      },
      {
        "text": "Saya setuju sama kamu.",
        "slot": "sama kamu",
        "cue": {
          "en": "with you",
          "ko": "너에게"
        },
        "gloss": {
          "en": "I agree with you.",
          "ko": "네 말에 동의해."
        }
      },
      {
        "text": "Aku kurang setuju soal itu.",
        "slot": "soal itu",
        "cue": {
          "en": "about that",
          "ko": "그 점에 대해"
        },
        "gloss": {
          "en": "I don't really agree about that.",
          "ko": "그건 좀 동의하기 어려워."
        }
      },
      {
        "text": "Saya setuju banget.",
        "slot": "banget",
        "cue": {
          "en": "totally",
          "ko": "완전히"
        },
        "gloss": {
          "en": "I totally agree.",
          "ko": "완전 동의해요."
        }
      }
    ]
  },
  {
    "id": "id-f3-14",
    "stage": 3,
    "fn": "surprise",
    "pattern": "Ternyata ___.",
    "core": [
      "Ternyata",
      "ternyata"
    ],
    "meaning": {
      "en": "Saying what turned out to be true: It turned out ___.",
      "ko": "알고 보니 말하기: 알고 보니 ___."
    },
    "grammar": [],
    "expressions": [
      "ternyata",
      "lumayan"
    ],
    "examples": [
      {
        "text": "Ternyata pantainya sepi sekali.",
        "slot": "pantainya sepi sekali",
        "cue": {
          "en": "the beach was really quiet",
          "ko": "해변이 아주 한적했다"
        },
        "gloss": {
          "en": "It turned out the beach was really quiet.",
          "ko": "알고 보니 해변이 아주 한적했어."
        }
      },
      {
        "text": "Ternyata dia orang Bandung.",
        "slot": "dia orang Bandung",
        "cue": {
          "en": "she's from Bandung",
          "ko": "그 사람이 반둥 출신이다"
        },
        "gloss": {
          "en": "Turns out she's from Bandung.",
          "ko": "알고 보니 그 사람 반둥 출신이래."
        }
      },
      {
        "text": "Ternyata kamarnya sudah penuh.",
        "slot": "kamarnya sudah penuh",
        "cue": {
          "en": "the rooms were full",
          "ko": "방이 다 찼다"
        },
        "gloss": {
          "en": "It turned out the rooms were full.",
          "ko": "알고 보니 방이 다 찼더라고요."
        }
      },
      {
        "text": "Ternyata ceritanya lumayan bagus.",
        "slot": "ceritanya lumayan bagus",
        "cue": {
          "en": "the story is pretty good",
          "ko": "이야기가 꽤 괜찮다"
        },
        "gloss": {
          "en": "The story turned out to be pretty good.",
          "ko": "알고 보니 이야기가 꽤 괜찮더라."
        }
      }
    ]
  },
  {
    "id": "id-f3-15",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Untungnya, ___.",
    "core": [
      "Untungnya",
      "untungnya"
    ],
    "meaning": {
      "en": "Saying what luckily happened: Luckily, ___.",
      "ko": "다행인 일 말하기: 다행히 ___."
    },
    "grammar": [],
    "expressions": [
      "untungnya"
    ],
    "examples": [
      {
        "text": "Untungnya, ada kamar lain.",
        "slot": "ada kamar lain",
        "cue": {
          "en": "there was another room",
          "ko": "다른 방이 있었다"
        },
        "gloss": {
          "en": "Luckily, there was another room.",
          "ko": "다행히 다른 방이 있었어요."
        }
      },
      {
        "text": "Untungnya, datanya sudah disimpan.",
        "slot": "datanya sudah disimpan",
        "cue": {
          "en": "the data was saved",
          "ko": "데이터가 저장돼 있었다"
        },
        "gloss": {
          "en": "Luckily, the data had been saved.",
          "ko": "다행히 데이터가 저장돼 있었어."
        }
      },
      {
        "text": "Untungnya, hujannya cepat berhenti.",
        "slot": "hujannya cepat berhenti",
        "cue": {
          "en": "the rain stopped quickly",
          "ko": "비가 금방 그쳤다"
        },
        "gloss": {
          "en": "Luckily, the rain stopped quickly.",
          "ko": "다행히 비가 금방 그쳤어."
        }
      },
      {
        "text": "Untungnya, dompetnya ketemu.",
        "slot": "dompetnya ketemu",
        "cue": {
          "en": "the wallet was found",
          "ko": "지갑을 찾았다"
        },
        "gloss": {
          "en": "Luckily, the wallet turned up.",
          "ko": "다행히 지갑을 찾았어."
        }
      }
    ]
  },
  {
    "id": "id-f3-16",
    "stage": 3,
    "fn": "regret-light",
    "pattern": "Sayangnya, ___.",
    "core": [
      "Sayangnya",
      "sayangnya"
    ],
    "meaning": {
      "en": "Saying what was a shame: Unfortunately, ___.",
      "ko": "아쉬운 일 말하기: 아쉽게도 ___."
    },
    "grammar": [],
    "expressions": [
      "sayangnya"
    ],
    "examples": [
      {
        "text": "Sayangnya, kacamataku tertinggal.",
        "slot": "kacamataku tertinggal",
        "cue": {
          "en": "I left my glasses behind",
          "ko": "안경을 두고 왔다"
        },
        "gloss": {
          "en": "Unfortunately, I left my glasses behind.",
          "ko": "아쉽게도 안경을 두고 왔어."
        }
      },
      {
        "text": "Sayangnya, tiketnya sudah habis.",
        "slot": "tiketnya sudah habis",
        "cue": {
          "en": "the tickets were sold out",
          "ko": "표가 매진됐다"
        },
        "gloss": {
          "en": "Unfortunately, the tickets were sold out.",
          "ko": "아쉽게도 표가 매진됐어요."
        }
      },
      {
        "text": "Sayangnya, akhir ceritanya kurang bagus.",
        "slot": "akhir ceritanya kurang bagus",
        "cue": {
          "en": "the ending wasn't great",
          "ko": "결말이 별로였다"
        },
        "gloss": {
          "en": "Unfortunately, the ending wasn't great.",
          "ko": "아쉽게도 결말이 좀 별로였어."
        }
      },
      {
        "text": "Sayangnya, saya tidak bisa datang.",
        "slot": "saya tidak bisa datang",
        "cue": {
          "en": "I can't come",
          "ko": "나는 못 간다"
        },
        "gloss": {
          "en": "Unfortunately, I can't come.",
          "ko": "아쉽게도 저는 못 가요."
        }
      }
    ]
  },
  {
    "id": "id-f3-17",
    "stage": 3,
    "fn": "sequence",
    "pattern": "Terus, ___.",
    "core": [
      "Terus",
      "terus"
    ],
    "meaning": {
      "en": "Moving the story on: Then, ___.",
      "ko": "이야기 이어 가기: 그러고 나서 ___."
    },
    "grammar": [],
    "expressions": [
      "terus",
      "gimana ya"
    ],
    "examples": [
      {
        "text": "Terus, kami makan di pantai.",
        "slot": "kami makan di pantai",
        "cue": {
          "en": "we ate on the beach",
          "ko": "우리는 해변에서 먹었다"
        },
        "gloss": {
          "en": "Then we ate on the beach.",
          "ko": "그러고 나서 해변에서 밥 먹었어."
        }
      },
      {
        "text": "Terus, laptopnya mati.",
        "slot": "laptopnya mati",
        "cue": {
          "en": "the laptop died",
          "ko": "노트북이 꺼졌다"
        },
        "gloss": {
          "en": "Then the laptop died.",
          "ko": "그러다가 노트북이 꺼졌어."
        }
      },
      {
        "text": "Terus, gimana ya?",
        "slot": "gimana ya",
        "cue": {
          "en": "what now",
          "ko": "어떡하지"
        },
        "gloss": {
          "en": "So then, what should we do?",
          "ko": "그럼 어떡하지?"
        }
      },
      {
        "text": "Terus, kita ke mana?",
        "slot": "kita ke mana",
        "cue": {
          "en": "where we go",
          "ko": "우리 어디 가다"
        },
        "gloss": {
          "en": "Then where do we go?",
          "ko": "그다음엔 어디 가?"
        }
      }
    ]
  },
  {
    "id": "id-f3-18",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "Menurut kamu, ___?",
    "core": [
      "Menurut kamu",
      "menurut kamu",
      "Menurut Anda",
      "menurut Anda"
    ],
    "meaning": {
      "en": "Asking what someone thinks: What do you think — ___?",
      "ko": "상대 생각 묻기: 네 생각엔 ___?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "lebih baik"
    ],
    "examples": [
      {
        "text": "Menurut kamu, ceritanya masuk akal?",
        "slot": "ceritanya masuk akal",
        "cue": {
          "en": "the story makes sense",
          "ko": "이야기가 말이 된다"
        },
        "gloss": {
          "en": "Do you think the story makes sense?",
          "ko": "네 생각엔 이야기가 말이 돼?"
        }
      },
      {
        "text": "Menurut kamu, lebih baik naik kereta?",
        "slot": "lebih baik naik kereta",
        "cue": {
          "en": "it's better to take the train",
          "ko": "기차가 더 낫다"
        },
        "gloss": {
          "en": "Do you think it's better to take the train?",
          "ko": "네 생각엔 기차 타는 게 나아?"
        }
      },
      {
        "text": "Menurut Anda, kamar ini cukup?",
        "slot": "kamar ini cukup",
        "cue": {
          "en": "this room is enough",
          "ko": "이 방이면 충분하다"
        },
        "gloss": {
          "en": "Do you think this room is enough?",
          "ko": "이 방이면 충분하다고 보세요?"
        }
      },
      {
        "text": "Menurut kamu, kantor barunya gimana?",
        "slot": "kantor barunya gimana",
        "cue": {
          "en": "how the new office is",
          "ko": "새 회사가 어떤지"
        },
        "gloss": {
          "en": "What do you think of the new office?",
          "ko": "새 회사 어떤 것 같아?"
        }
      }
    ]
  },
  {
    "id": "id-f3-19",
    "stage": 3,
    "fn": "rephrase",
    "pattern": "Sebenarnya ___.",
    "core": [
      "Sebenarnya",
      "sebenarnya"
    ],
    "meaning": {
      "en": "Saying how things really are: Actually, ___.",
      "ko": "사실대로 말하기: 사실은 ___."
    },
    "grammar": [],
    "expressions": [
      "sebenarnya",
      "sama saja",
      "capek banget"
    ],
    "examples": [
      {
        "text": "Sebenarnya saya kurang suka pedas.",
        "slot": "saya kurang suka pedas",
        "cue": {
          "en": "I don't really like spicy food",
          "ko": "매운 걸 별로 안 좋아한다"
        },
        "gloss": {
          "en": "Actually, I don't really like spicy food.",
          "ko": "사실 저는 매운 걸 별로 안 좋아해요."
        }
      },
      {
        "text": "Sebenarnya kerjanya lebih santai.",
        "slot": "kerjanya lebih santai",
        "cue": {
          "en": "the work is more relaxed",
          "ko": "일이 더 여유롭다"
        },
        "gloss": {
          "en": "Actually, the work is more relaxed.",
          "ko": "사실 일은 더 여유로워."
        }
      },
      {
        "text": "Sebenarnya aku capek banget.",
        "slot": "aku capek banget",
        "cue": {
          "en": "I'm really tired",
          "ko": "나 엄청 피곤하다"
        },
        "gloss": {
          "en": "Actually, I'm really tired.",
          "ko": "사실 나 엄청 피곤해."
        }
      },
      {
        "text": "Sebenarnya sama saja.",
        "slot": "sama saja",
        "cue": {
          "en": "it's all the same",
          "ko": "다 똑같다"
        },
        "gloss": {
          "en": "Actually, it's all the same.",
          "ko": "사실 그게 그거야."
        }
      }
    ]
  },
  {
    "id": "id-f4-01",
    "stage": 4,
    "fn": "concede",
    "pattern": "Meskipun ___, …",
    "core": [
      "Meskipun",
      "meskipun"
    ],
    "meaning": {
      "en": "Conceding a point: Even though ___, …",
      "ko": "일부 인정하기: ___에도(~지만), …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Meskipun mahal, kualitasnya bagus.",
        "slot": "mahal",
        "cue": {
          "en": "be expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "Even though it's expensive, the quality is good.",
          "ko": "비싸지만 품질은 좋아요."
        }
      },
      {
        "text": "Meskipun hujan deras, rapatnya tetap jalan.",
        "slot": "hujan deras",
        "cue": {
          "en": "rain heavily",
          "ko": "비가 많이 오다"
        },
        "gloss": {
          "en": "Even though it was pouring, the meeting went ahead.",
          "ko": "비가 많이 왔는데도 회의는 그대로 했어요."
        }
      },
      {
        "text": "Meskipun gajinya kecil, dia betah bekerja di sana.",
        "slot": "gajinya kecil",
        "cue": {
          "en": "the pay is low",
          "ko": "월급이 적다"
        },
        "gloss": {
          "en": "Even though the pay is low, he likes working there.",
          "ko": "월급이 적은데도 그는 거기서 일하는 걸 좋아해요."
        }
      },
      {
        "text": "Kami tetap datang meskipun agak capek.",
        "slot": "agak capek",
        "cue": {
          "en": "be a bit tired",
          "ko": "좀 피곤하다"
        },
        "gloss": {
          "en": "We still came even though we were a bit tired.",
          "ko": "좀 피곤했지만 그래도 왔어요."
        }
      }
    ]
  },
  {
    "id": "id-f4-02",
    "stage": 4,
    "fn": "concede",
    "pattern": "…, walaupun ___.",
    "core": [
      "walaupun",
      "Walaupun"
    ],
    "meaning": {
      "en": "Conceding a point: …, although ___.",
      "ko": "일부 인정하기: …, ___이긴 하지만."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Layanannya cepat, walaupun harganya agak mahal.",
        "slot": "harganya agak mahal",
        "cue": {
          "en": "the price is a bit high",
          "ko": "값이 좀 비싸다"
        },
        "gloss": {
          "en": "The service is fast, although the price is a bit high.",
          "ko": "서비스는 빨라요, 값이 좀 비싸긴 하지만요."
        }
      },
      {
        "text": "Proyeknya berhasil, walaupun anggarannya terbatas.",
        "slot": "anggarannya terbatas",
        "cue": {
          "en": "the budget is limited",
          "ko": "예산이 빠듯하다"
        },
        "gloss": {
          "en": "The project succeeded, although the budget was limited.",
          "ko": "예산이 빠듯했지만 프로젝트는 성공했어요."
        }
      },
      {
        "text": "Kami akhirnya setuju, walaupun belum semua orang yakin.",
        "slot": "belum semua orang yakin",
        "cue": {
          "en": "not everyone is convinced yet",
          "ko": "아직 모두가 확신하지는 않다"
        },
        "gloss": {
          "en": "We finally agreed, although not everyone was convinced yet.",
          "ko": "아직 모두가 확신한 건 아니지만 결국 합의했어요."
        }
      },
      {
        "text": "Walaupun lelah, dia menyelesaikan laporannya malam itu.",
        "slot": "lelah",
        "cue": {
          "en": "be tired",
          "ko": "지치다"
        },
        "gloss": {
          "en": "Although she was tired, she finished her report that night.",
          "ko": "지쳤는데도 그녀는 그날 밤 보고서를 끝냈어요."
        }
      }
    ]
  },
  {
    "id": "id-f4-03",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "…, supaya ___.",
    "core": [
      "supaya",
      "Supaya"
    ],
    "meaning": {
      "en": "Saying the purpose: …, so that ___.",
      "ko": "목적 말하기: …, ___하도록."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ayo mulai lebih awal, supaya tidak terlambat.",
        "slot": "tidak terlambat",
        "cue": {
          "en": "not be late",
          "ko": "늦지 않다"
        },
        "gloss": {
          "en": "Let's start earlier so that we're not late.",
          "ko": "늦지 않게 일찍 시작해요."
        }
      },
      {
        "text": "Tolong kirim datanya sekarang, supaya saya bisa cek malam ini.",
        "slot": "saya bisa cek malam ini",
        "cue": {
          "en": "I can check it tonight",
          "ko": "오늘 밤 확인할 수 있다"
        },
        "gloss": {
          "en": "Please send the data now so that I can check it tonight.",
          "ko": "오늘 밤 확인할 수 있게 지금 자료를 보내 주세요."
        }
      },
      {
        "text": "Simpan nomornya di catatan, supaya tidak lupa.",
        "slot": "tidak lupa",
        "cue": {
          "en": "not forget",
          "ko": "잊지 않다"
        },
        "gloss": {
          "en": "Save the number in your notes so you don't forget.",
          "ko": "잊지 않게 번호를 메모에 저장해 두세요."
        }
      },
      {
        "text": "Supaya rapatnya efektif, kirim agendanya sehari sebelumnya.",
        "slot": "rapatnya efektif",
        "cue": {
          "en": "the meeting is effective",
          "ko": "회의가 효율적이다"
        },
        "gloss": {
          "en": "So that the meeting is effective, send the agenda the day before.",
          "ko": "회의가 효율적이도록 안건을 하루 전에 보내 주세요."
        }
      }
    ]
  },
  {
    "id": "id-f4-04",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "…, sehingga ___.",
    "core": [
      "sehingga"
    ],
    "meaning": {
      "en": "Saying the result: …, so (as a result) ___.",
      "ko": "결과 말하기: …, 그래서 ___."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Hujan turun semalaman, sehingga jalanan banjir.",
        "slot": "jalanan banjir",
        "cue": {
          "en": "the streets flood",
          "ko": "길이 물에 잠기다"
        },
        "gloss": {
          "en": "It rained all night, so the streets flooded.",
          "ko": "밤새 비가 와서 길이 물에 잠겼어요."
        }
      },
      {
        "text": "Servernya mati, sehingga pesanan tidak bisa diproses.",
        "slot": "pesanan tidak bisa diproses",
        "cue": {
          "en": "orders can't be processed",
          "ko": "주문을 처리할 수 없다"
        },
        "gloss": {
          "en": "The server went down, so orders couldn't be processed.",
          "ko": "서버가 꺼져서 주문을 처리할 수 없었어요."
        }
      },
      {
        "text": "Harga bensin naik, sehingga ongkos kirim ikut naik.",
        "slot": "ongkos kirim ikut naik",
        "cue": {
          "en": "shipping costs go up too",
          "ko": "배송비도 같이 오르다"
        },
        "gloss": {
          "en": "Fuel prices went up, so shipping costs rose too.",
          "ko": "기름값이 올라서 배송비도 같이 올랐어요."
        }
      },
      {
        "text": "Dia jarang tidur, sehingga sering sakit.",
        "slot": "sering sakit",
        "cue": {
          "en": "often get sick",
          "ko": "자주 아프다"
        },
        "gloss": {
          "en": "He rarely sleeps, so he often gets sick.",
          "ko": "그는 잠을 잘 안 자서 자주 아파요."
        }
      }
    ]
  },
  {
    "id": "id-f4-05",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "Seharusnya ___.",
    "core": [
      "Seharusnya",
      "seharusnya"
    ],
    "meaning": {
      "en": "Saying what should have been done: (We) should have ___.",
      "ko": "~했어야 했다고 말하기: ___했어야 했어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Seharusnya kita kabari klien lebih cepat.",
        "slot": "kita kabari klien lebih cepat",
        "cue": {
          "en": "we let the client know sooner",
          "ko": "고객에게 더 빨리 알리다"
        },
        "gloss": {
          "en": "We should have told the client sooner.",
          "ko": "고객에게 더 빨리 알렸어야 했어요."
        }
      },
      {
        "text": "Seharusnya saya cek ulang angkanya.",
        "slot": "saya cek ulang angkanya",
        "cue": {
          "en": "I double-check the figures",
          "ko": "내가 숫자를 다시 확인하다"
        },
        "gloss": {
          "en": "I should have double-checked the figures.",
          "ko": "숫자를 다시 확인했어야 했어요."
        }
      },
      {
        "text": "Seharusnya kamu bilang dari awal.",
        "slot": "kamu bilang dari awal",
        "cue": {
          "en": "you say so from the start",
          "ko": "네가 처음부터 말하다"
        },
        "gloss": {
          "en": "You should have said so from the start.",
          "ko": "처음부터 말했어야지."
        }
      },
      {
        "text": "Kita seharusnya berangkat lebih pagi.",
        "slot": "berangkat lebih pagi",
        "cue": {
          "en": "leave earlier",
          "ko": "더 일찍 출발하다"
        },
        "gloss": {
          "en": "We should have left earlier.",
          "ko": "더 일찍 출발했어야 했어요."
        }
      }
    ]
  },
  {
    "id": "id-f4-06",
    "stage": 4,
    "fn": "report",
    "pattern": "… bilang bahwa ___.",
    "core": [
      "bilang bahwa"
    ],
    "meaning": {
      "en": "Reporting what someone said: … said that ___.",
      "ko": "들은 말 보고하기: …가 ___라고 했어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Dia bilang bahwa datanya belum lengkap.",
        "slot": "datanya belum lengkap",
        "cue": {
          "en": "the data isn't complete yet",
          "ko": "자료가 아직 다 안 됐다"
        },
        "gloss": {
          "en": "She said that the data isn't complete yet.",
          "ko": "그녀가 자료가 아직 다 안 됐다고 했어요."
        }
      },
      {
        "text": "Manajernya bilang bahwa jadwal rapat diganti.",
        "slot": "jadwal rapat diganti",
        "cue": {
          "en": "the meeting schedule is changed",
          "ko": "회의 일정이 바뀌다"
        },
        "gloss": {
          "en": "The manager said that the meeting schedule was changed.",
          "ko": "매니저가 회의 일정이 바뀌었다고 했어요."
        }
      },
      {
        "text": "Dokter bilang bahwa saya harus banyak istirahat.",
        "slot": "saya harus banyak istirahat",
        "cue": {
          "en": "I must rest a lot",
          "ko": "많이 쉬어야 하다"
        },
        "gloss": {
          "en": "The doctor said that I have to rest a lot.",
          "ko": "의사가 많이 쉬어야 한다고 했어요."
        }
      },
      {
        "text": "Klien bilang bahwa mereka puas dengan desainnya.",
        "slot": "mereka puas dengan desainnya",
        "cue": {
          "en": "they are happy with the design",
          "ko": "디자인에 만족하다"
        },
        "gloss": {
          "en": "The client said that they're happy with the design.",
          "ko": "고객이 디자인에 만족한다고 했어요."
        }
      }
    ]
  },
  {
    "id": "id-f4-07",
    "stage": 4,
    "fn": "disagree-soft",
    "pattern": "Mungkin ini kurang ___.",
    "core": [
      "kurang"
    ],
    "meaning": {
      "en": "Softening criticism: Maybe this is not quite ___.",
      "ko": "부드럽게 반대하기: 이건 좀 덜 ___한 것 같아요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Mungkin ini kurang tepat untuk sekarang.",
        "slot": "tepat",
        "cue": {
          "en": "appropriate",
          "ko": "알맞다"
        },
        "gloss": {
          "en": "Maybe this isn't quite right for now.",
          "ko": "지금은 이게 좀 맞지 않는 것 같아요."
        }
      },
      {
        "text": "Menurut saya, warnanya kurang cocok.",
        "slot": "cocok",
        "cue": {
          "en": "matching",
          "ko": "어울리다"
        },
        "gloss": {
          "en": "I think the colour doesn't quite match.",
          "ko": "색이 좀 안 어울리는 것 같아요."
        }
      },
      {
        "text": "Penjelasannya mungkin kurang jelas bagi pembaca baru.",
        "slot": "jelas",
        "cue": {
          "en": "clear",
          "ko": "분명하다"
        },
        "gloss": {
          "en": "The explanation may not be clear enough for new readers.",
          "ko": "설명이 새 독자에게는 좀 불분명할 수 있어요."
        }
      },
      {
        "text": "Rasanya kurang manis, ya?",
        "slot": "manis",
        "cue": {
          "en": "sweet",
          "ko": "달다"
        },
        "gloss": {
          "en": "It's not quite sweet enough, is it?",
          "ko": "맛이 좀 덜 달죠?"
        }
      }
    ]
  },
  {
    "id": "id-f4-08",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "___ bisa kurang sedikit?",
    "core": [
      "bisa kurang"
    ],
    "meaning": {
      "en": "Negotiating a price: Could ___ be a little lower?",
      "ko": "가격 조율하기: ___ 좀 깎아 주실 수 있어요?"
    },
    "grammar": [],
    "expressions": [
      "harganya bisa kurang"
    ],
    "examples": [
      {
        "text": "Harganya bisa kurang sedikit, Pak?",
        "slot": "Harganya",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "Could you lower the price a little, sir?",
          "ko": "가격 좀 깎아 주실 수 있어요?"
        }
      },
      {
        "text": "Ongkos kirimnya bisa kurang sedikit, Bu?",
        "slot": "Ongkos kirimnya",
        "cue": {
          "en": "the shipping fee",
          "ko": "배송비"
        },
        "gloss": {
          "en": "Could the shipping be a bit cheaper, ma'am?",
          "ko": "배송비 좀 깎아 주실 수 있어요?"
        }
      },
      {
        "text": "Biaya sewanya bisa kurang sedikit kalau saya bayar di muka?",
        "slot": "Biaya sewanya",
        "cue": {
          "en": "the rent",
          "ko": "임대료"
        },
        "gloss": {
          "en": "Could the rent be a little lower if I pay in advance?",
          "ko": "선불로 내면 임대료를 좀 깎아 주실 수 있나요?"
        }
      },
      {
        "text": "Tarif desainnya bisa kurang sedikit untuk proyek kecil ini?",
        "slot": "Tarif desainnya",
        "cue": {
          "en": "the design fee",
          "ko": "디자인 비용"
        },
        "gloss": {
          "en": "Could the design fee be a bit lower for this small project?",
          "ko": "이 작은 프로젝트라면 디자인 비용을 좀 낮춰 주실 수 있나요?"
        }
      }
    ]
  },
  {
    "id": "id-f4-09",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Bagaimana kalau ___?",
    "core": [
      "Bagaimana kalau",
      "bagaimana kalau"
    ],
    "meaning": {
      "en": "Proposing a deal: How about ___?",
      "ko": "조건 제안하기: ___하면 어때요?"
    },
    "grammar": [],
    "expressions": [
      "bagaimana kalau"
    ],
    "examples": [
      {
        "text": "Bagaimana kalau kita bagi dua biayanya?",
        "slot": "kita bagi dua biayanya",
        "cue": {
          "en": "we split the cost",
          "ko": "비용을 반씩 나누다"
        },
        "gloss": {
          "en": "How about we split the cost?",
          "ko": "비용을 반씩 나누면 어때요?"
        }
      },
      {
        "text": "Bagaimana kalau rapatnya dipindah ke hari Jumat?",
        "slot": "rapatnya dipindah ke hari Jumat",
        "cue": {
          "en": "the meeting is moved to Friday",
          "ko": "회의를 금요일로 옮기다"
        },
        "gloss": {
          "en": "How about moving the meeting to Friday?",
          "ko": "회의를 금요일로 옮기면 어때요?"
        }
      },
      {
        "text": "Bagaimana kalau saya bayar setengah sekarang?",
        "slot": "saya bayar setengah sekarang",
        "cue": {
          "en": "I pay half now",
          "ko": "지금 반을 내다"
        },
        "gloss": {
          "en": "How about I pay half now?",
          "ko": "지금 반을 내면 어떨까요?"
        }
      },
      {
        "text": "Kalau begitu, bagaimana kalau kita coba dulu sebulan?",
        "slot": "kita coba dulu sebulan",
        "cue": {
          "en": "we try it for a month first",
          "ko": "먼저 한 달 해 보다"
        },
        "gloss": {
          "en": "In that case, how about we try it for a month first?",
          "ko": "그럼 먼저 한 달 해 보면 어때요?"
        }
      }
    ]
  },
  {
    "id": "id-f4-10",
    "stage": 4,
    "fn": "persuade",
    "pattern": "Kalau boleh usul, ___.",
    "core": [
      "Kalau boleh usul",
      "kalau boleh usul"
    ],
    "meaning": {
      "en": "Making a suggestion politely: If I may suggest, ___.",
      "ko": "정중하게 제안하기: 제안드리자면, ___."
    },
    "grammar": [],
    "expressions": [
      "kalau boleh usul"
    ],
    "examples": [
      {
        "text": "Kalau boleh usul, kita tunda dulu peluncurannya.",
        "slot": "kita tunda dulu peluncurannya",
        "cue": {
          "en": "we postpone the launch for now",
          "ko": "출시를 일단 미루다"
        },
        "gloss": {
          "en": "If I may suggest, let's postpone the launch for now.",
          "ko": "제안드리자면, 출시를 일단 미뤄요."
        }
      },
      {
        "text": "Kalau boleh usul, presentasinya dibuat lebih singkat.",
        "slot": "presentasinya dibuat lebih singkat",
        "cue": {
          "en": "the presentation is made shorter",
          "ko": "발표를 더 짧게 하다"
        },
        "gloss": {
          "en": "If I may suggest, let's make the presentation shorter.",
          "ko": "제안드리자면, 발표를 더 짧게 했으면 해요."
        }
      },
      {
        "text": "Kalau boleh usul, kita tanya pendapat pelanggan dulu.",
        "slot": "kita tanya pendapat pelanggan dulu",
        "cue": {
          "en": "we ask customers first",
          "ko": "먼저 고객 의견을 묻다"
        },
        "gloss": {
          "en": "If I may suggest, let's ask our customers first.",
          "ko": "제안드리자면, 먼저 고객 의견을 물어봐요."
        }
      },
      {
        "text": "Kalau boleh usul, rapat mingguan cukup setengah jam saja.",
        "slot": "rapat mingguan cukup setengah jam saja",
        "cue": {
          "en": "the weekly meeting only needs half an hour",
          "ko": "주간 회의는 삼십 분이면 충분하다"
        },
        "gloss": {
          "en": "If I may suggest, half an hour is enough for the weekly meeting.",
          "ko": "제안드리자면, 주간 회의는 삼십 분이면 충분해요."
        }
      }
    ]
  },
  {
    "id": "id-f4-11",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Di satu sisi, ___. Di sisi lain, …",
    "core": [
      "Di satu sisi",
      "di satu sisi"
    ],
    "meaning": {
      "en": "Weighing both sides: On the one hand, ___. On the other hand, …",
      "ko": "장단점 따지기: 한편으로는 ___. 다른 한편으로는 …"
    },
    "grammar": [],
    "expressions": [
      "di satu sisi",
      "di sisi lain"
    ],
    "examples": [
      {
        "text": "Di satu sisi, kerja dari rumah lebih hemat. Di sisi lain, kita jarang ketemu tim.",
        "slot": "kerja dari rumah lebih hemat",
        "cue": {
          "en": "working from home saves money",
          "ko": "재택근무가 더 절약되다"
        },
        "gloss": {
          "en": "On the one hand, working from home saves money. On the other hand, we rarely see the team.",
          "ko": "한편으로는 재택근무가 더 절약돼요. 다른 한편으로는 팀을 잘 못 만나요."
        }
      },
      {
        "text": "Di satu sisi, gajinya tinggi. Di sisi lain, jam kerjanya panjang.",
        "slot": "gajinya tinggi",
        "cue": {
          "en": "the pay is high",
          "ko": "월급이 많다"
        },
        "gloss": {
          "en": "On the one hand, the pay is high. On the other hand, the hours are long.",
          "ko": "한편으로는 월급이 많아요. 다른 한편으로는 근무 시간이 길어요."
        }
      },
      {
        "text": "Di satu sisi, kota ini ramai dan seru. Di sisi lain, biaya hidupnya mahal.",
        "slot": "kota ini ramai dan seru",
        "cue": {
          "en": "this city is lively and fun",
          "ko": "이 도시는 활기차고 재미있다"
        },
        "gloss": {
          "en": "On the one hand, this city is lively and fun. On the other hand, it's expensive to live in.",
          "ko": "한편으로는 이 도시가 활기차고 재미있어요. 다른 한편으로는 생활비가 비싸요."
        }
      },
      {
        "text": "Memang, di satu sisi aplikasinya praktis. Tapi di sisi lain, datanya kurang aman.",
        "slot": "aplikasinya praktis",
        "cue": {
          "en": "the app is practical",
          "ko": "앱이 편리하다"
        },
        "gloss": {
          "en": "True, on the one hand the app is practical. But on the other hand, the data isn't very safe.",
          "ko": "맞아요, 한편으로는 앱이 편리해요. 하지만 다른 한편으로는 데이터가 좀 불안해요."
        }
      }
    ]
  },
  {
    "id": "id-f4-12",
    "stage": 4,
    "fn": "concede",
    "pattern": "Saya paham maksudnya, tapi ___.",
    "core": [
      "Saya paham maksudnya",
      "saya paham maksudnya"
    ],
    "meaning": {
      "en": "Acknowledging, then objecting: I see what you mean, but ___.",
      "ko": "인정하고 반론하기: 무슨 뜻인지 알지만 ___."
    },
    "grammar": [],
    "expressions": [
      "saya paham maksudnya"
    ],
    "examples": [
      {
        "text": "Saya paham maksudnya, tapi waktunya terlalu mepet.",
        "slot": "waktunya terlalu mepet",
        "cue": {
          "en": "the time is too tight",
          "ko": "시간이 너무 빠듯하다"
        },
        "gloss": {
          "en": "I see what you mean, but the time is too tight.",
          "ko": "무슨 뜻인지 알지만 시간이 너무 빠듯해요."
        }
      },
      {
        "text": "Saya paham maksudnya, tapi anggarannya belum ada.",
        "slot": "anggarannya belum ada",
        "cue": {
          "en": "there's no budget yet",
          "ko": "아직 예산이 없다"
        },
        "gloss": {
          "en": "I see what you mean, but there's no budget yet.",
          "ko": "무슨 뜻인지 알지만 아직 예산이 없어요."
        }
      },
      {
        "text": "Saya paham maksudnya, tapi klien mungkin tidak setuju.",
        "slot": "klien mungkin tidak setuju",
        "cue": {
          "en": "the client may not agree",
          "ko": "고객이 동의하지 않을 수도 있다"
        },
        "gloss": {
          "en": "I see what you mean, but the client may not agree.",
          "ko": "무슨 뜻인지 알지만 고객이 동의하지 않을 수도 있어요."
        }
      },
      {
        "text": "Iya, saya paham maksudnya, tapi aturannya memang begitu.",
        "slot": "aturannya memang begitu",
        "cue": {
          "en": "that's just the rule",
          "ko": "규칙이 원래 그렇다"
        },
        "gloss": {
          "en": "Yes, I see what you mean, but that's simply the rule.",
          "ko": "네, 무슨 뜻인지 알지만 규칙이 원래 그래요."
        }
      }
    ]
  },
  {
    "id": "id-f4-13",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "Tapi masalahnya, ___.",
    "core": [
      "Tapi masalahnya",
      "tapi masalahnya"
    ],
    "meaning": {
      "en": "Pointing out the catch: But the problem is, ___.",
      "ko": "문제점 짚기: 그런데 문제는 ___."
    },
    "grammar": [],
    "expressions": [
      "tapi masalahnya"
    ],
    "examples": [
      {
        "text": "Idenya bagus. Tapi masalahnya, siapa yang mau mengerjakan?",
        "slot": "siapa yang mau mengerjakan",
        "cue": {
          "en": "who will do it",
          "ko": "누가 맡을까"
        },
        "gloss": {
          "en": "The idea is good. But the problem is, who's going to do it?",
          "ko": "아이디어는 좋아요. 그런데 문제는 누가 맡느냐예요."
        }
      },
      {
        "text": "Rumahnya luas. Tapi masalahnya, jauh dari kantor.",
        "slot": "jauh dari kantor",
        "cue": {
          "en": "far from the office",
          "ko": "회사에서 멀다"
        },
        "gloss": {
          "en": "The house is big. But the problem is, it's far from the office.",
          "ko": "집은 넓어요. 그런데 문제는 회사에서 멀다는 거예요."
        }
      },
      {
        "text": "Tapi masalahnya, anggaran kita sudah habis.",
        "slot": "anggaran kita sudah habis",
        "cue": {
          "en": "our budget has run out",
          "ko": "예산이 이미 바닥났다"
        },
        "gloss": {
          "en": "But the problem is, our budget has already run out.",
          "ko": "그런데 문제는 예산이 이미 바닥났다는 거예요."
        }
      },
      {
        "text": "Saya mau ikut, tapi masalahnya saya belum dapat izin.",
        "slot": "saya belum dapat izin",
        "cue": {
          "en": "I haven't got permission yet",
          "ko": "아직 허락을 못 받았다"
        },
        "gloss": {
          "en": "I want to come, but the problem is I haven't got permission yet.",
          "ko": "가고 싶은데 문제는 아직 허락을 못 받았다는 거예요."
        }
      }
    ]
  },
  {
    "id": "id-f4-14",
    "stage": 4,
    "fn": "deadline",
    "pattern": "Tenggat ___ kapan, ya?",
    "core": [
      "Tenggat",
      "tenggat"
    ],
    "meaning": {
      "en": "Asking about a deadline: When is ___ due?",
      "ko": "마감 묻기: ___ 마감이 언제예요?"
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Tenggat laporannya kapan, ya?",
        "slot": "laporannya",
        "cue": {
          "en": "the report",
          "ko": "보고서"
        },
        "gloss": {
          "en": "When is the report due?",
          "ko": "보고서 마감이 언제예요?"
        }
      },
      {
        "text": "Tenggat pendaftarannya kapan, ya?",
        "slot": "pendaftarannya",
        "cue": {
          "en": "the registration",
          "ko": "등록"
        },
        "gloss": {
          "en": "When is the registration deadline?",
          "ko": "등록 마감이 언제예요?"
        }
      },
      {
        "text": "Tenggat pembayaran pajaknya kapan, ya?",
        "slot": "pembayaran pajaknya",
        "cue": {
          "en": "the tax payment",
          "ko": "세금 납부"
        },
        "gloss": {
          "en": "When is the tax payment due?",
          "ko": "세금 납부 마감이 언제예요?"
        }
      },
      {
        "text": "Boleh tahu tenggat revisinya kapan?",
        "slot": "revisinya",
        "cue": {
          "en": "the revision",
          "ko": "수정본"
        },
        "gloss": {
          "en": "May I know when the revision is due?",
          "ko": "수정본 마감이 언제인지 알 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "id-f4-15",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Kelebihannya, ___.",
    "core": [
      "Kelebihannya",
      "kelebihannya"
    ],
    "meaning": {
      "en": "Naming the advantage: The advantage is, ___.",
      "ko": "장점 말하기: 장점은 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kelebihannya, aplikasi ini gratis. Kekurangannya, banyak iklan.",
        "slot": "aplikasi ini gratis",
        "cue": {
          "en": "this app is free",
          "ko": "이 앱은 무료다"
        },
        "gloss": {
          "en": "The advantage is that this app is free. The downside is lots of ads.",
          "ko": "장점은 이 앱이 무료라는 거예요. 단점은 광고가 많아요."
        }
      },
      {
        "text": "Kelebihannya, lokasinya dekat stasiun.",
        "slot": "lokasinya dekat stasiun",
        "cue": {
          "en": "it's close to the station",
          "ko": "역에서 가깝다"
        },
        "gloss": {
          "en": "The advantage is that it's close to the station.",
          "ko": "장점은 역에서 가깝다는 거예요."
        }
      },
      {
        "text": "Kelebihannya, kita bisa kerja dari mana saja.",
        "slot": "kita bisa kerja dari mana saja",
        "cue": {
          "en": "we can work from anywhere",
          "ko": "어디서든 일할 수 있다"
        },
        "gloss": {
          "en": "The advantage is that we can work from anywhere.",
          "ko": "장점은 어디서든 일할 수 있다는 거예요."
        }
      },
      {
        "text": "Menurut saya, kelebihannya ada di harganya yang murah.",
        "slot": "ada di harganya yang murah",
        "cue": {
          "en": "lies in the low price",
          "ko": "싼 가격에 있다"
        },
        "gloss": {
          "en": "In my view, its strength lies in the low price.",
          "ko": "제 생각엔 장점은 싼 가격에 있어요."
        }
      }
    ]
  },
  {
    "id": "id-f4-16",
    "stage": 4,
    "fn": "persuade",
    "pattern": "Kita perlu memper___.",
    "core": [
      "memper"
    ],
    "meaning": {
      "en": "Proposing an improvement: We need to make ___ more …",
      "ko": "개선 제안하기: ___를 더 ~하게 해야 해요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kita perlu mempercepat prosesnya.",
        "slot": "cepat prosesnya",
        "cue": {
          "en": "faster — the process",
          "ko": "더 빠르게 — 과정"
        },
        "gloss": {
          "en": "We need to speed up the process.",
          "ko": "과정을 더 빠르게 해야 해요."
        }
      },
      {
        "text": "Kita perlu memperjelas aturannya.",
        "slot": "jelas aturannya",
        "cue": {
          "en": "clearer — the rules",
          "ko": "더 분명하게 — 규칙"
        },
        "gloss": {
          "en": "We need to make the rules clearer.",
          "ko": "규칙을 더 분명하게 해야 해요."
        }
      },
      {
        "text": "Kita perlu memperluas pasarnya ke luar Jawa.",
        "slot": "luas pasarnya ke luar Jawa",
        "cue": {
          "en": "wider — the market beyond Java",
          "ko": "더 넓게 — 자바 밖으로 시장"
        },
        "gloss": {
          "en": "We need to expand the market beyond Java.",
          "ko": "시장을 자바 밖으로 넓혀야 해요."
        }
      },
      {
        "text": "Pemerintah perlu memperketat pengawasan.",
        "slot": "ketat pengawasan",
        "cue": {
          "en": "stricter — supervision",
          "ko": "더 엄격하게 — 감독"
        },
        "gloss": {
          "en": "The government needs to tighten supervision.",
          "ko": "정부는 감독을 더 엄격하게 해야 해요."
        }
      }
    ]
  },
  {
    "id": "id-f4-17",
    "stage": 4,
    "fn": "report",
    "pattern": "Intinya, ___.",
    "core": [
      "Intinya",
      "intinya"
    ],
    "meaning": {
      "en": "Summing up: The bottom line is, ___.",
      "ko": "요점 정리하기: 요점은 ___."
    },
    "grammar": [],
    "expressions": [
      "intinya"
    ],
    "examples": [
      {
        "text": "Intinya, kita butuh tambahan waktu.",
        "slot": "kita butuh tambahan waktu",
        "cue": {
          "en": "we need more time",
          "ko": "시간이 더 필요하다"
        },
        "gloss": {
          "en": "The bottom line is, we need more time.",
          "ko": "요점은 시간이 더 필요하다는 거예요."
        }
      },
      {
        "text": "Intinya, semua pihak harus sepakat dulu.",
        "slot": "semua pihak harus sepakat dulu",
        "cue": {
          "en": "all parties must agree first",
          "ko": "모든 쪽이 먼저 합의해야 하다"
        },
        "gloss": {
          "en": "The point is, everyone has to agree first.",
          "ko": "요점은 모든 쪽이 먼저 합의해야 한다는 거예요."
        }
      },
      {
        "text": "Jadi intinya, proyek ini masih bisa jalan.",
        "slot": "proyek ini masih bisa jalan",
        "cue": {
          "en": "this project can still go ahead",
          "ko": "이 프로젝트는 아직 진행할 수 있다"
        },
        "gloss": {
          "en": "So basically, this project can still go ahead.",
          "ko": "그러니까 요점은 이 프로젝트를 아직 진행할 수 있다는 거예요."
        }
      },
      {
        "text": "Intinya, jangan menunda sampai menit terakhir.",
        "slot": "jangan menunda sampai menit terakhir",
        "cue": {
          "en": "don't put it off to the last minute",
          "ko": "마지막까지 미루지 말다"
        },
        "gloss": {
          "en": "The point is, don't leave it to the last minute.",
          "ko": "요점은 마지막 순간까지 미루지 말라는 거예요."
        }
      }
    ]
  },
  {
    "id": "id-f4-18",
    "stage": 4,
    "fn": "rephrase",
    "pattern": "Dengan kata lain, ___.",
    "core": [
      "Dengan kata lain",
      "dengan kata lain"
    ],
    "meaning": {
      "en": "Saying it another way: In other words, ___.",
      "ko": "다른 말로 바꿔 말하기: 다시 말해 ___."
    },
    "grammar": [],
    "expressions": [
      "dengan kata lain"
    ],
    "examples": [
      {
        "text": "Dengan kata lain, kita harus mulai dari awal.",
        "slot": "kita harus mulai dari awal",
        "cue": {
          "en": "we have to start over",
          "ko": "처음부터 다시 해야 하다"
        },
        "gloss": {
          "en": "In other words, we have to start over.",
          "ko": "다시 말해 처음부터 다시 해야 해요."
        }
      },
      {
        "text": "Dengan kata lain, penjualannya turun.",
        "slot": "penjualannya turun",
        "cue": {
          "en": "sales went down",
          "ko": "매출이 줄었다"
        },
        "gloss": {
          "en": "In other words, sales went down.",
          "ko": "다시 말해 매출이 줄었어요."
        }
      },
      {
        "text": "Dia belum menjawab. Dengan kata lain, dia masih ragu.",
        "slot": "dia masih ragu",
        "cue": {
          "en": "he's still unsure",
          "ko": "그는 아직 망설인다"
        },
        "gloss": {
          "en": "He hasn't answered. In other words, he's still unsure.",
          "ko": "그는 아직 답이 없어요. 다시 말해 아직 망설이는 거예요."
        }
      },
      {
        "text": "Kontraknya selesai bulan ini, dengan kata lain kita harus cari klien baru.",
        "slot": "kita harus cari klien baru",
        "cue": {
          "en": "we have to find new clients",
          "ko": "새 고객을 찾아야 하다"
        },
        "gloss": {
          "en": "The contract ends this month; in other words, we need to find new clients.",
          "ko": "계약이 이번 달에 끝나요. 다시 말해 새 고객을 찾아야 해요."
        }
      }
    ]
  },
  {
    "id": "id-f4-19",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "Tergantung ___.",
    "core": [
      "Tergantung",
      "tergantung"
    ],
    "meaning": {
      "en": "Saying it depends: It depends on ___.",
      "ko": "꼭 그렇지는 않다고 말하기: ___에 달려 있어요."
    },
    "grammar": [],
    "expressions": [
      "tergantung"
    ],
    "examples": [
      {
        "text": "Tergantung cuacanya besok.",
        "slot": "cuacanya besok",
        "cue": {
          "en": "tomorrow's weather",
          "ko": "내일 날씨"
        },
        "gloss": {
          "en": "It depends on tomorrow's weather.",
          "ko": "내일 날씨에 달려 있어요."
        }
      },
      {
        "text": "Tergantung anggarannya, Pak.",
        "slot": "anggarannya",
        "cue": {
          "en": "the budget",
          "ko": "예산"
        },
        "gloss": {
          "en": "It depends on the budget, sir.",
          "ko": "예산에 달려 있어요."
        }
      },
      {
        "text": "Semuanya tergantung keputusan direktur.",
        "slot": "keputusan direktur",
        "cue": {
          "en": "the director's decision",
          "ko": "이사의 결정"
        },
        "gloss": {
          "en": "It all depends on the director's decision.",
          "ko": "모든 게 이사님 결정에 달려 있어요."
        }
      },
      {
        "text": "Harganya tergantung ukuran dan bahannya.",
        "slot": "ukuran dan bahannya",
        "cue": {
          "en": "the size and material",
          "ko": "크기와 재료"
        },
        "gloss": {
          "en": "The price depends on the size and material.",
          "ko": "가격은 크기와 재료에 따라 달라요."
        }
      }
    ]
  },
  {
    "id": "id-f4-20",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Kita sepakat ___, ya?",
    "core": [
      "Kita sepakat",
      "kita sepakat"
    ],
    "meaning": {
      "en": "Confirming an agreement: So we agree on ___, right?",
      "ko": "합의 확인하기: ___로 합의한 거죠?"
    },
    "grammar": [],
    "expressions": [
      "kita sepakat"
    ],
    "examples": [
      {
        "text": "Kita sepakat pakai desain yang kedua, ya?",
        "slot": "pakai desain yang kedua",
        "cue": {
          "en": "use the second design",
          "ko": "두 번째 디자인을 쓰다"
        },
        "gloss": {
          "en": "So we agree to use the second design, right?",
          "ko": "두 번째 디자인으로 하기로 한 거죠?"
        }
      },
      {
        "text": "Kita sepakat harganya tetap, ya?",
        "slot": "harganya tetap",
        "cue": {
          "en": "the price stays the same",
          "ko": "가격은 그대로다"
        },
        "gloss": {
          "en": "So we agree the price stays the same, right?",
          "ko": "가격은 그대로 하기로 한 거죠?"
        }
      },
      {
        "text": "Jadi kita sepakat rapat lagi minggu depan, ya?",
        "slot": "rapat lagi minggu depan",
        "cue": {
          "en": "meet again next week",
          "ko": "다음 주에 다시 회의하다"
        },
        "gloss": {
          "en": "So we agree to meet again next week, right?",
          "ko": "그럼 다음 주에 다시 회의하기로 한 거죠?"
        }
      },
      {
        "text": "Kita sepakat bayar setengah di muka, ya?",
        "slot": "bayar setengah di muka",
        "cue": {
          "en": "pay half up front",
          "ko": "절반을 먼저 내다"
        },
        "gloss": {
          "en": "So we agree on paying half up front, right?",
          "ko": "절반을 먼저 내기로 한 거죠?"
        }
      }
    ]
  },
  {
    "id": "id-f5-01",
    "stage": 5,
    "fn": "debate",
    "pattern": "___ merupakan …",
    "core": [
      "merupakan"
    ],
    "meaning": {
      "en": "Defining formally: ___ is (constitutes) …",
      "ko": "격식 있게 정의하기: ___은(는) …이다."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kerja sama ini merupakan langkah yang penting.",
        "slot": "Kerja sama ini",
        "cue": {
          "en": "this cooperation",
          "ko": "이 협력"
        },
        "gloss": {
          "en": "This cooperation is an important step.",
          "ko": "이 협력은 중요한 한 걸음입니다."
        }
      },
      {
        "text": "Bahasa daerah merupakan bagian dari identitas kita.",
        "slot": "Bahasa daerah",
        "cue": {
          "en": "regional languages",
          "ko": "지역어"
        },
        "gloss": {
          "en": "Regional languages are part of our identity.",
          "ko": "지역어는 우리 정체성의 일부입니다."
        }
      },
      {
        "text": "Kemacetan merupakan masalah lama di kota besar.",
        "slot": "Kemacetan",
        "cue": {
          "en": "traffic congestion",
          "ko": "교통 체증"
        },
        "gloss": {
          "en": "Traffic congestion is an old problem in big cities.",
          "ko": "교통 체증은 대도시의 오랜 문제입니다."
        }
      },
      {
        "text": "Pendidikan merupakan kunci untuk masa depan.",
        "slot": "Pendidikan",
        "cue": {
          "en": "education",
          "ko": "교육"
        },
        "gloss": {
          "en": "Education is the key to the future.",
          "ko": "교육은 미래로 가는 열쇠입니다."
        }
      }
    ]
  },
  {
    "id": "id-f5-02",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "Izinkan saya ___.",
    "core": [
      "Izinkan saya",
      "izinkan saya"
    ],
    "meaning": {
      "en": "Speaking formally: Allow me to ___.",
      "ko": "격식 있게 말하기: ___하겠습니다(허락해 주십시오)."
    },
    "grammar": [],
    "expressions": [
      "izinkan saya"
    ],
    "examples": [
      {
        "text": "Izinkan saya menyampaikan beberapa kata.",
        "slot": "menyampaikan beberapa kata",
        "cue": {
          "en": "say a few words",
          "ko": "몇 마디 하다"
        },
        "gloss": {
          "en": "Allow me to say a few words.",
          "ko": "몇 말씀 드리겠습니다."
        }
      },
      {
        "text": "Izinkan saya memperkenalkan diri.",
        "slot": "memperkenalkan diri",
        "cue": {
          "en": "introduce myself",
          "ko": "제 소개를 하다"
        },
        "gloss": {
          "en": "Allow me to introduce myself.",
          "ko": "제 소개를 드리겠습니다."
        }
      },
      {
        "text": "Sebelum mulai, izinkan saya mengucapkan terima kasih.",
        "slot": "mengucapkan terima kasih",
        "cue": {
          "en": "express my thanks",
          "ko": "감사 인사를 하다"
        },
        "gloss": {
          "en": "Before we begin, allow me to say thank you.",
          "ko": "시작하기 전에 감사 인사를 드리겠습니다."
        }
      },
      {
        "text": "Izinkan saya menjelaskan sedikit latar belakangnya.",
        "slot": "menjelaskan sedikit latar belakangnya",
        "cue": {
          "en": "explain the background a little",
          "ko": "배경을 조금 설명하다"
        },
        "gloss": {
          "en": "Allow me to explain a bit of the background.",
          "ko": "배경을 조금 설명드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "id-f5-03",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "Atas nama ___, …",
    "core": [
      "Atas nama",
      "atas nama"
    ],
    "meaning": {
      "en": "Speaking for a group: On behalf of ___, …",
      "ko": "대표해서 말하기: ___을(를) 대표해서 …"
    },
    "grammar": [],
    "expressions": [
      "atas nama tim"
    ],
    "examples": [
      {
        "text": "Atas nama tim, saya ucapkan selamat.",
        "slot": "tim",
        "cue": {
          "en": "the team",
          "ko": "팀"
        },
        "gloss": {
          "en": "On behalf of the team, congratulations.",
          "ko": "팀을 대표해 축하드립니다."
        }
      },
      {
        "text": "Atas nama keluarga besar, kami mohon maaf.",
        "slot": "keluarga besar",
        "cue": {
          "en": "the whole family",
          "ko": "온 가족"
        },
        "gloss": {
          "en": "On behalf of the whole family, we apologise.",
          "ko": "온 가족을 대표해 사과드립니다."
        }
      },
      {
        "text": "Saya berbicara atas nama seluruh karyawan.",
        "slot": "seluruh karyawan",
        "cue": {
          "en": "all the staff",
          "ko": "전 직원"
        },
        "gloss": {
          "en": "I'm speaking on behalf of all the staff.",
          "ko": "저는 전 직원을 대표해 말씀드립니다."
        }
      },
      {
        "text": "Atas nama panitia, terima kasih sudah datang.",
        "slot": "panitia",
        "cue": {
          "en": "the organising committee",
          "ko": "준비위원회"
        },
        "gloss": {
          "en": "On behalf of the committee, thank you for coming.",
          "ko": "준비위원회를 대표해 와 주셔서 감사합니다."
        }
      }
    ]
  },
  {
    "id": "id-f5-04",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Dengan segala hormat, ___.",
    "core": [
      "Dengan segala hormat",
      "dengan segala hormat"
    ],
    "meaning": {
      "en": "Disagreeing respectfully: With all due respect, ___.",
      "ko": "정중하게 반대하기: 외람되지만 ___."
    },
    "grammar": [],
    "expressions": [
      "dengan segala hormat"
    ],
    "examples": [
      {
        "text": "Dengan segala hormat, saya kurang setuju dengan usulan ini.",
        "slot": "saya kurang setuju dengan usulan ini",
        "cue": {
          "en": "I don't quite agree with this proposal",
          "ko": "이 제안에 별로 동의하지 않다"
        },
        "gloss": {
          "en": "With all due respect, I don't quite agree with this proposal.",
          "ko": "외람되지만 이 제안에는 그다지 동의하지 않습니다."
        }
      },
      {
        "text": "Dengan segala hormat, Pak, angka itu kurang akurat.",
        "slot": "angka itu kurang akurat",
        "cue": {
          "en": "that figure isn't quite accurate",
          "ko": "그 숫자는 정확하지 않다"
        },
        "gloss": {
          "en": "With all due respect, sir, that figure isn't quite accurate.",
          "ko": "외람되지만 그 숫자는 정확하지 않은 것 같습니다."
        }
      },
      {
        "text": "Dengan segala hormat, sepertinya keputusan ini terlalu cepat.",
        "slot": "sepertinya keputusan ini terlalu cepat",
        "cue": {
          "en": "this decision seems too hasty",
          "ko": "이 결정은 너무 성급한 것 같다"
        },
        "gloss": {
          "en": "With all due respect, this decision seems too hasty.",
          "ko": "외람되지만 이 결정은 너무 성급한 것 같습니다."
        }
      },
      {
        "text": "Saya mohon, dengan segala hormat, agar rapatnya ditunda.",
        "slot": "agar rapatnya ditunda",
        "cue": {
          "en": "that the meeting be postponed",
          "ko": "회의를 미뤄 달라"
        },
        "gloss": {
          "en": "With all due respect, I ask that the meeting be postponed.",
          "ko": "외람되지만 회의를 미뤄 주시기를 부탁드립니다."
        }
      }
    ]
  },
  {
    "id": "id-f5-05",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Sepertinya ___ agak sulit.",
    "core": [
      "agak sulit"
    ],
    "meaning": {
      "en": "Refusing indirectly: It seems ___ would be a bit difficult.",
      "ko": "돌려 거절하기: ___은(는) 좀 어려울 것 같아요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sepertinya minggu ini agak sulit, Pak.",
        "slot": "minggu ini",
        "cue": {
          "en": "this week",
          "ko": "이번 주"
        },
        "gloss": {
          "en": "I'm afraid this week would be a bit difficult, sir.",
          "ko": "이번 주는 좀 어려울 것 같습니다."
        }
      },
      {
        "text": "Sepertinya besok agak sulit buat saya.",
        "slot": "besok",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "Tomorrow seems a bit difficult for me.",
          "ko": "내일은 저한테 좀 어려울 것 같아요."
        }
      },
      {
        "text": "Untuk hari Sabtu, sepertinya agak sulit.",
        "slot": "Untuk hari Sabtu",
        "cue": {
          "en": "for Saturday",
          "ko": "토요일은"
        },
        "gloss": {
          "en": "For Saturday, it looks a bit difficult.",
          "ko": "토요일은 좀 어려울 것 같아요."
        }
      },
      {
        "text": "Sepertinya target itu agak sulit dikejar bulan ini.",
        "slot": "target itu",
        "cue": {
          "en": "that target",
          "ko": "그 목표"
        },
        "gloss": {
          "en": "That target seems a bit hard to reach this month.",
          "ko": "그 목표는 이번 달에 맞추기 좀 어려울 것 같아요."
        }
      }
    ]
  },
  {
    "id": "id-f5-06",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___ lain kali aja, ya.",
    "core": [
      "lain kali aja"
    ],
    "meaning": {
      "en": "Putting something off casually: Let's do ___ another time.",
      "ko": "가볍게 미루기: ___은(는) 다음에 하자."
    },
    "grammar": [],
    "expressions": [
      "lain kali aja"
    ],
    "examples": [
      {
        "text": "Nontonnya lain kali aja, ya.",
        "slot": "Nontonnya",
        "cue": {
          "en": "the movie (watching)",
          "ko": "영화 보기"
        },
        "gloss": {
          "en": "Let's watch the movie another time, okay?",
          "ko": "영화는 다음에 보자."
        }
      },
      {
        "text": "Makan barengnya lain kali aja, ya.",
        "slot": "Makan barengnya",
        "cue": {
          "en": "eating together",
          "ko": "같이 밥 먹기"
        },
        "gloss": {
          "en": "Let's have that meal together another time.",
          "ko": "같이 밥 먹는 건 다음에 하자."
        }
      },
      {
        "text": "Kalau gitu, ngopinya lain kali aja.",
        "slot": "ngopinya",
        "cue": {
          "en": "the coffee (meet-up)",
          "ko": "커피 마시기"
        },
        "gloss": {
          "en": "In that case, let's get coffee another time.",
          "ko": "그럼 커피는 다음에 마시자."
        }
      },
      {
        "text": "Ceritanya lain kali aja, sekarang aku buru-buru.",
        "slot": "Ceritanya",
        "cue": {
          "en": "the story",
          "ko": "이야기"
        },
        "gloss": {
          "en": "Tell me the story another time, I'm in a rush now.",
          "ko": "이야기는 다음에 하자, 지금 급해."
        }
      }
    ]
  },
  {
    "id": "id-f5-07",
    "stage": 5,
    "fn": "best-to",
    "pattern": "Mending ___, deh.",
    "core": [
      "Mending",
      "mending"
    ],
    "meaning": {
      "en": "Saying what's better: Better to ___.",
      "ko": "~하는 게 낫다고 말하기: ___하는 게 낫겠다."
    },
    "grammar": [],
    "expressions": [
      "mending"
    ],
    "examples": [
      {
        "text": "Mending naik kereta, deh.",
        "slot": "naik kereta",
        "cue": {
          "en": "take the train",
          "ko": "기차를 타다"
        },
        "gloss": {
          "en": "Better to take the train.",
          "ko": "기차 타는 게 낫겠다."
        }
      },
      {
        "text": "Mending kita pulang sekarang, deh.",
        "slot": "kita pulang sekarang",
        "cue": {
          "en": "we go home now",
          "ko": "지금 집에 가다"
        },
        "gloss": {
          "en": "We'd better head home now.",
          "ko": "지금 집에 가는 게 낫겠다."
        }
      },
      {
        "text": "Kalau capek, mending istirahat dulu.",
        "slot": "istirahat dulu",
        "cue": {
          "en": "rest first",
          "ko": "먼저 쉬다"
        },
        "gloss": {
          "en": "If you're tired, better rest first.",
          "ko": "피곤하면 먼저 쉬는 게 나아."
        }
      },
      {
        "text": "Mending nonton di bioskop, suaranya lebih mantap.",
        "slot": "nonton di bioskop",
        "cue": {
          "en": "watch it at the cinema",
          "ko": "영화관에서 보다"
        },
        "gloss": {
          "en": "Better to watch it at the cinema, the sound is way better.",
          "ko": "영화관에서 보는 게 나아, 소리가 훨씬 좋거든."
        }
      }
    ]
  },
  {
    "id": "id-f5-08",
    "stage": 5,
    "fn": "surprise",
    "pattern": "Kok ___ sih?",
    "core": [
      "Kok"
    ],
    "meaning": {
      "en": "Surprise or mild protest: How come ___?",
      "ko": "놀람·가벼운 항의: 어떻게 ___해?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "kok bisa"
    ],
    "examples": [
      {
        "text": "Kok kamu nggak bilang dari tadi sih?",
        "slot": "kamu nggak bilang dari tadi",
        "cue": {
          "en": "you didn't say so earlier",
          "ko": "아까부터 말 안 하다"
        },
        "gloss": {
          "en": "How come you didn't say so earlier?",
          "ko": "왜 아까 말 안 했어?"
        }
      },
      {
        "text": "Kok bisa dompetnya ketinggalan?",
        "slot": "bisa dompetnya ketinggalan",
        "cue": {
          "en": "the wallet got left behind",
          "ko": "지갑을 두고 오다"
        },
        "gloss": {
          "en": "How on earth did the wallet get left behind?",
          "ko": "어떻게 지갑을 두고 올 수가 있어?"
        }
      },
      {
        "text": "Kok tokonya udah tutup sih?",
        "slot": "tokonya udah tutup",
        "cue": {
          "en": "the shop is already closed",
          "ko": "가게가 벌써 닫았다"
        },
        "gloss": {
          "en": "How come the shop's already closed?",
          "ko": "왜 가게가 벌써 닫았지?"
        }
      },
      {
        "text": "Kok dia belum datang juga?",
        "slot": "dia belum datang juga",
        "cue": {
          "en": "he still hasn't come",
          "ko": "그가 아직도 안 오다"
        },
        "gloss": {
          "en": "How come he still hasn't shown up?",
          "ko": "왜 걔 아직도 안 와?"
        }
      }
    ]
  },
  {
    "id": "id-f5-09",
    "stage": 5,
    "fn": "request-action",
    "pattern": "___ dong!",
    "core": [
      "dong"
    ],
    "meaning": {
      "en": "Pushing a request casually: ___, come on!",
      "ko": "가볍게 졸라 부탁하기: ___ 좀 해 줘!"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Bantuin aku dong!",
        "slot": "Bantuin aku",
        "cue": {
          "en": "help me",
          "ko": "나를 도와주다"
        },
        "gloss": {
          "en": "Come on, help me out!",
          "ko": "나 좀 도와줘!"
        }
      },
      {
        "text": "Cepetan dong, filmnya udah mulai.",
        "slot": "Cepetan",
        "cue": {
          "en": "hurry up",
          "ko": "서두르다"
        },
        "gloss": {
          "en": "Hurry up, the film's already started.",
          "ko": "빨리 좀 해, 영화 벌써 시작했어."
        }
      },
      {
        "text": "Kasih tahu dong jawabannya.",
        "slot": "Kasih tahu",
        "cue": {
          "en": "tell",
          "ko": "알려 주다"
        },
        "gloss": {
          "en": "Come on, tell me the answer.",
          "ko": "답 좀 알려 줘."
        }
      },
      {
        "text": "Jangan marah dong, aku cuma bercanda.",
        "slot": "Jangan marah",
        "cue": {
          "en": "don't be angry",
          "ko": "화내지 마"
        },
        "gloss": {
          "en": "Don't be mad, I was only joking.",
          "ko": "화내지 마, 그냥 농담이었어."
        }
      }
    ]
  },
  {
    "id": "id-f5-10",
    "stage": 5,
    "fn": "concession",
    "pattern": "Emang sih ___, tapi …",
    "core": [
      "Emang sih",
      "emang sih"
    ],
    "meaning": {
      "en": "Admitting, then pushing back: Sure, ___, but …",
      "ko": "인정하고 되받기: ___긴 한데 …"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "emang sih"
    ],
    "examples": [
      {
        "text": "Emang sih harganya mahal, tapi awet.",
        "slot": "harganya mahal",
        "cue": {
          "en": "it's expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "Sure, it's expensive, but it lasts.",
          "ko": "비싸긴 한데 오래 가."
        }
      },
      {
        "text": "Emang sih aku telat, tapi bukan salahku.",
        "slot": "aku telat",
        "cue": {
          "en": "I was late",
          "ko": "내가 늦었다"
        },
        "gloss": {
          "en": "Okay, I was late, but it wasn't my fault.",
          "ko": "내가 늦긴 했는데 내 잘못은 아니야."
        }
      },
      {
        "text": "Emang sih jauh, tapi pemandangannya bagus.",
        "slot": "jauh",
        "cue": {
          "en": "it's far",
          "ko": "멀다"
        },
        "gloss": {
          "en": "Sure, it's far, but the view is great.",
          "ko": "멀긴 한데 경치가 좋아."
        }
      },
      {
        "text": "Iya, emang sih dia agak cerewet, tapi baik hati.",
        "slot": "dia agak cerewet",
        "cue": {
          "en": "she's a bit chatty",
          "ko": "그녀가 좀 수다스럽다"
        },
        "gloss": {
          "en": "Yeah, she's a bit of a talker, but she's kind.",
          "ko": "응, 걔가 좀 수다스럽긴 한데 마음은 착해."
        }
      }
    ]
  },
  {
    "id": "id-f5-11",
    "stage": 5,
    "fn": "plan-intent",
    "pattern": "Biar aku yang ___.",
    "core": [
      "Biar aku yang",
      "biar aku yang"
    ],
    "meaning": {
      "en": "Offering to handle it: Let me be the one to ___.",
      "ko": "내가 맡겠다고 하기: ___은(는) 내가 할게."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Biar aku yang bayarin.",
        "slot": "bayarin",
        "cue": {
          "en": "pay (for you)",
          "ko": "대신 내다"
        },
        "gloss": {
          "en": "Let me pay for it.",
          "ko": "내가 낼게."
        }
      },
      {
        "text": "Biar aku yang beresin kamarnya.",
        "slot": "beresin kamarnya",
        "cue": {
          "en": "tidy up the room",
          "ko": "방을 치우다"
        },
        "gloss": {
          "en": "Let me tidy up the room.",
          "ko": "방은 내가 치울게."
        }
      },
      {
        "text": "Biar aku yang ngomong ke bos.",
        "slot": "ngomong ke bos",
        "cue": {
          "en": "talk to the boss",
          "ko": "사장님한테 말하다"
        },
        "gloss": {
          "en": "Let me be the one to talk to the boss.",
          "ko": "사장님한테는 내가 말할게."
        }
      },
      {
        "text": "Santai, biar aku yang jemputin anak-anak.",
        "slot": "jemputin anak-anak",
        "cue": {
          "en": "pick up the kids",
          "ko": "아이들을 데리러 가다"
        },
        "gloss": {
          "en": "Relax, I'll pick up the kids.",
          "ko": "걱정 마, 애들은 내가 데리러 갈게."
        }
      }
    ]
  },
  {
    "id": "id-f5-12",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "___ satu-satu.",
    "core": [
      "satu-satu"
    ],
    "meaning": {
      "en": "Doing things one by one: ___ one at a time.",
      "ko": "하나씩 하기: ___ 하나하나."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Nanti aku bacain satu-satu.",
        "slot": "Nanti aku bacain",
        "cue": {
          "en": "I'll read them out later",
          "ko": "나중에 읽어 주다"
        },
        "gloss": {
          "en": "I'll read them out one by one later.",
          "ko": "나중에 하나하나 읽어 줄게."
        }
      },
      {
        "text": "Tolong masuk satu-satu, ya.",
        "slot": "Tolong masuk",
        "cue": {
          "en": "please come in",
          "ko": "들어오세요"
        },
        "gloss": {
          "en": "Please come in one at a time.",
          "ko": "한 명씩 들어오세요."
        }
      },
      {
        "text": "Kita cek kopernya satu-satu.",
        "slot": "Kita cek kopernya",
        "cue": {
          "en": "we check the suitcases",
          "ko": "가방을 확인하다"
        },
        "gloss": {
          "en": "Let's check the suitcases one by one.",
          "ko": "가방을 하나씩 확인하자."
        }
      },
      {
        "text": "Dia jawab pertanyaannya satu-satu dengan sabar.",
        "slot": "Dia jawab pertanyaannya",
        "cue": {
          "en": "she answers the questions",
          "ko": "그녀가 질문에 답하다"
        },
        "gloss": {
          "en": "She patiently answered the questions one by one.",
          "ko": "그녀는 질문에 하나하나 차분히 답했어요."
        }
      }
    ]
  },
  {
    "id": "id-f5-13",
    "stage": 5,
    "fn": "change-topic",
    "pattern": "Soal ___, …",
    "core": [
      "Soal",
      "soal"
    ],
    "meaning": {
      "en": "Putting the topic first: As for ___, …",
      "ko": "화제 먼저 꺼내기: ___ 말인데요, …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Soal itu, nanti kita bahas lagi.",
        "slot": "itu",
        "cue": {
          "en": "that",
          "ko": "그것"
        },
        "gloss": {
          "en": "As for that, we'll discuss it again later.",
          "ko": "그건 나중에 다시 얘기해요."
        }
      },
      {
        "text": "Soal harga, saya ikut saja.",
        "slot": "harga",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "As for the price, I'll go along with whatever.",
          "ko": "가격은 저는 그냥 따를게요."
        }
      },
      {
        "text": "Soal makan malam, kamu yang pilih.",
        "slot": "makan malam",
        "cue": {
          "en": "dinner",
          "ko": "저녁"
        },
        "gloss": {
          "en": "As for dinner, you choose.",
          "ko": "저녁은 네가 골라."
        }
      },
      {
        "text": "Kalau soal kerjaan, dia memang paling rajin.",
        "slot": "kerjaan",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "When it comes to work, he really is the most diligent.",
          "ko": "일에 관해서라면 그가 정말 제일 부지런해요."
        }
      }
    ]
  },
  {
    "id": "id-f5-14",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Ujung-ujungnya, ___.",
    "core": [
      "Ujung-ujungnya",
      "ujung-ujungnya"
    ],
    "meaning": {
      "en": "Telling how it ended up: In the end, ___.",
      "ko": "결말 말하기: 결국 ___."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "ujung-ujungnya"
    ],
    "examples": [
      {
        "text": "Ujung-ujungnya, aku yang bayar semua.",
        "slot": "aku yang bayar semua",
        "cue": {
          "en": "I paid for everything",
          "ko": "내가 다 냈다"
        },
        "gloss": {
          "en": "In the end, I was the one who paid for everything.",
          "ko": "결국 내가 다 냈어."
        }
      },
      {
        "text": "Kami debat lama, ujung-ujungnya pesan pizza juga.",
        "slot": "pesan pizza juga",
        "cue": {
          "en": "order pizza anyway",
          "ko": "결국 피자를 시키다"
        },
        "gloss": {
          "en": "We argued for ages and ended up ordering pizza anyway.",
          "ko": "한참 따지다가 결국 피자 시켰어."
        }
      },
      {
        "text": "Ujung-ujungnya, rapatnya dibatalkan.",
        "slot": "rapatnya dibatalkan",
        "cue": {
          "en": "the meeting was cancelled",
          "ko": "회의가 취소됐다"
        },
        "gloss": {
          "en": "In the end, the meeting was cancelled.",
          "ko": "결국 회의가 취소됐어요."
        }
      },
      {
        "text": "Dia bilang mau diet, ujung-ujungnya makan martabak lagi.",
        "slot": "makan martabak lagi",
        "cue": {
          "en": "eat martabak again",
          "ko": "또 마르타박을 먹다"
        },
        "gloss": {
          "en": "He said he'd diet, but he ended up eating martabak again.",
          "ko": "다이어트한다더니 결국 또 마르타박 먹었어."
        }
      }
    ]
  },
  {
    "id": "id-f5-15",
    "stage": 5,
    "fn": "opinion",
    "pattern": "Jujur aja, ___.",
    "core": [
      "Jujur aja",
      "jujur aja"
    ],
    "meaning": {
      "en": "Speaking frankly: To be honest, ___.",
      "ko": "솔직하게 말하기: 솔직히 ___."
    },
    "grammar": [],
    "expressions": [
      "jujur aja"
    ],
    "examples": [
      {
        "text": "Jujur aja, aku kurang suka idenya.",
        "slot": "aku kurang suka idenya",
        "cue": {
          "en": "I don't really like the idea",
          "ko": "그 아이디어가 별로다"
        },
        "gloss": {
          "en": "To be honest, I don't really like the idea.",
          "ko": "솔직히 그 아이디어 별로야."
        }
      },
      {
        "text": "Jujur aja, filmnya bagus banget.",
        "slot": "filmnya bagus banget",
        "cue": {
          "en": "the film is really good",
          "ko": "영화가 정말 좋다"
        },
        "gloss": {
          "en": "Honestly, the film is really good.",
          "ko": "솔직히 영화 정말 좋아."
        }
      },
      {
        "text": "Jujur aja ya, masakannya agak keasinan.",
        "slot": "masakannya agak keasinan",
        "cue": {
          "en": "the food is a bit too salty",
          "ko": "음식이 좀 짜다"
        },
        "gloss": {
          "en": "To be honest, the food is a bit too salty.",
          "ko": "솔직히 음식이 좀 짜."
        }
      },
      {
        "text": "Ya, jujur aja, aku nggak siap presentasi hari ini.",
        "slot": "aku nggak siap presentasi hari ini",
        "cue": {
          "en": "I'm not ready to present today",
          "ko": "오늘 발표 준비가 안 됐다"
        },
        "gloss": {
          "en": "Well, honestly, I'm not ready to present today.",
          "ko": "음, 솔직히 오늘 발표 준비 안 됐어."
        }
      }
    ]
  },
  {
    "id": "id-f5-16",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "Ya ampun, ___.",
    "core": [
      "Ya ampun",
      "ya ampun"
    ],
    "meaning": {
      "en": "Reacting with dismay: Oh my gosh, ___.",
      "ko": "놀라 반응하기: 어머나, ___."
    },
    "grammar": [],
    "expressions": [
      "ya ampun"
    ],
    "examples": [
      {
        "text": "Ya ampun, maaf banget aku telat.",
        "slot": "maaf banget aku telat",
        "cue": {
          "en": "I'm so sorry I'm late",
          "ko": "늦어서 정말 미안하다"
        },
        "gloss": {
          "en": "Oh my gosh, I'm so sorry I'm late.",
          "ko": "어머, 늦어서 정말 미안해."
        }
      },
      {
        "text": "Ya ampun, kamu kurus banget sekarang!",
        "slot": "kamu kurus banget sekarang",
        "cue": {
          "en": "you're so thin now",
          "ko": "지금 너무 말랐다"
        },
        "gloss": {
          "en": "Oh my gosh, you're so thin now!",
          "ko": "어머나, 너 지금 너무 말랐다!"
        }
      },
      {
        "text": "Ya ampun, kuncinya ketinggalan di mobil.",
        "slot": "kuncinya ketinggalan di mobil",
        "cue": {
          "en": "the keys were left in the car",
          "ko": "열쇠를 차에 두고 왔다"
        },
        "gloss": {
          "en": "Oh no, I left the keys in the car.",
          "ko": "아이고, 열쇠를 차에 두고 왔네."
        }
      },
      {
        "text": "Aduh, ya ampun, hujannya deras banget.",
        "slot": "hujannya deras banget",
        "cue": {
          "en": "the rain is really heavy",
          "ko": "비가 엄청 온다"
        },
        "gloss": {
          "en": "Oh dear, the rain is really heavy.",
          "ko": "아이고, 비가 엄청 오네."
        }
      }
    ]
  },
  {
    "id": "id-f5-17",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "Santai aja, ___.",
    "core": [
      "Santai aja",
      "santai aja"
    ],
    "meaning": {
      "en": "Reassuring someone: Take it easy, ___.",
      "ko": "안심시키기: 걱정 마, ___."
    },
    "grammar": [],
    "expressions": [
      "santai aja"
    ],
    "examples": [
      {
        "text": "Santai aja, masih banyak waktu.",
        "slot": "masih banyak waktu",
        "cue": {
          "en": "there's still plenty of time",
          "ko": "아직 시간이 많다"
        },
        "gloss": {
          "en": "Relax, there's still plenty of time.",
          "ko": "걱정 마, 아직 시간 많아."
        }
      },
      {
        "text": "Santai aja, nanti juga ketemu.",
        "slot": "nanti juga ketemu",
        "cue": {
          "en": "it'll turn up",
          "ko": "곧 찾게 되다"
        },
        "gloss": {
          "en": "Take it easy, it'll turn up.",
          "ko": "걱정 마, 곧 찾을 거야."
        }
      },
      {
        "text": "Santai aja, bos nggak marah kok.",
        "slot": "bos nggak marah kok",
        "cue": {
          "en": "the boss isn't angry",
          "ko": "사장님은 화 안 났다"
        },
        "gloss": {
          "en": "Relax, the boss isn't angry.",
          "ko": "걱정 마, 사장님 화 안 나셨어."
        }
      },
      {
        "text": "Udah, santai aja, semua orang pernah salah.",
        "slot": "semua orang pernah salah",
        "cue": {
          "en": "everyone makes mistakes",
          "ko": "누구나 실수한다"
        },
        "gloss": {
          "en": "Come on, take it easy, everyone makes mistakes.",
          "ko": "됐어, 걱정 마, 누구나 실수해."
        }
      }
    ]
  },
  {
    "id": "id-f5-18",
    "stage": 5,
    "fn": "concession",
    "pattern": "Apa boleh buat, ___.",
    "core": [
      "Apa boleh buat",
      "apa boleh buat"
    ],
    "meaning": {
      "en": "Accepting what can't be helped: It can't be helped, ___.",
      "ko": "어쩔 수 없음 받아들이기: 어쩔 수 없죠, ___."
    },
    "grammar": [],
    "expressions": [
      "apa boleh buat"
    ],
    "examples": [
      {
        "text": "Apa boleh buat, acaranya harus ditunda.",
        "slot": "acaranya harus ditunda",
        "cue": {
          "en": "the event has to be postponed",
          "ko": "행사를 미뤄야 한다"
        },
        "gloss": {
          "en": "It can't be helped, the event has to be postponed.",
          "ko": "어쩔 수 없죠, 행사를 미뤄야 해요."
        }
      },
      {
        "text": "Apa boleh buat, kita naik ojek saja.",
        "slot": "kita naik ojek saja",
        "cue": {
          "en": "we just take a motorbike taxi",
          "ko": "그냥 오토바이 택시를 타다"
        },
        "gloss": {
          "en": "Oh well, let's just take a motorbike taxi.",
          "ko": "어쩔 수 없지, 그냥 오젝 타자."
        }
      },
      {
        "text": "Tiketnya habis. Apa boleh buat, kita nonton besok.",
        "slot": "kita nonton besok",
        "cue": {
          "en": "we watch it tomorrow",
          "ko": "내일 보다"
        },
        "gloss": {
          "en": "The tickets are sold out. Oh well, we'll watch it tomorrow.",
          "ko": "표가 다 팔렸어. 어쩔 수 없지, 내일 보자."
        }
      },
      {
        "text": "Ya sudah, apa boleh buat, saya lembur malam ini.",
        "slot": "saya lembur malam ini",
        "cue": {
          "en": "I work overtime tonight",
          "ko": "오늘 밤 야근하다"
        },
        "gloss": {
          "en": "Fine, it can't be helped, I'll work late tonight.",
          "ko": "그래요, 어쩔 수 없죠, 오늘 밤 야근할게요."
        }
      }
    ]
  },
  {
    "id": "id-f5-19",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Saya jadi nggak enak hati ___.",
    "core": [
      "nggak enak hati"
    ],
    "meaning": {
      "en": "Saying you feel bad (toward someone): I feel bad ___.",
      "ko": "미안한 마음 말하기: ___ 마음이 불편해요."
    },
    "grammar": [],
    "expressions": [
      "nggak enak hati"
    ],
    "examples": [
      {
        "text": "Saya jadi nggak enak hati sama Bapak.",
        "slot": "sama Bapak",
        "cue": {
          "en": "toward you (sir)",
          "ko": "선생님께"
        },
        "gloss": {
          "en": "I feel bad toward you, sir.",
          "ko": "선생님께 괜히 죄송스럽네요."
        }
      },
      {
        "text": "Aku nggak enak hati kalau menolak terus.",
        "slot": "kalau menolak terus",
        "cue": {
          "en": "if I keep saying no",
          "ko": "계속 거절하면"
        },
        "gloss": {
          "en": "I feel bad if I keep saying no.",
          "ko": "계속 거절하면 마음이 불편해."
        }
      },
      {
        "text": "Kami jadi nggak enak hati karena merepotkan.",
        "slot": "karena merepotkan",
        "cue": {
          "en": "for causing trouble",
          "ko": "폐를 끼쳐서"
        },
        "gloss": {
          "en": "We feel bad for putting you out.",
          "ko": "폐를 끼쳐서 저희가 죄송하네요."
        }
      },
      {
        "text": "Dia nggak enak hati minta tolong lagi.",
        "slot": "minta tolong lagi",
        "cue": {
          "en": "ask for help again",
          "ko": "또 도와 달라고 하다"
        },
        "gloss": {
          "en": "She feels awkward asking for help again.",
          "ko": "그녀는 또 도와 달라고 하기가 미안해요."
        }
      }
    ]
  }
];
