import type { Frame } from "../frames.ts";

/** 프랑스어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const FR_FRAMES: Frame[] = [
  {
    "id": "fr-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Je m'appelle ___.",
    "core": [
      "Je m'appelle",
      "je m'appelle"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "Je m'appelle",
      "Enchanté"
    ],
    "examples": [
      {
        "text": "Je m'appelle Minho.",
        "slot": "Minho",
        "cue": {
          "en": "Minho (your name)",
          "ko": "민호(내 이름)"
        },
        "gloss": {
          "en": "My name is Minho.",
          "ko": "제 이름은 민호예요."
        }
      },
      {
        "text": "Bonjour, je m'appelle Daniel. Enchanté.",
        "slot": "Daniel",
        "cue": {
          "en": "Daniel",
          "ko": "다니엘"
        },
        "gloss": {
          "en": "Hello, my name is Daniel. Nice to meet you.",
          "ko": "안녕하세요, 저는 다니엘이에요. 반가워요."
        }
      },
      {
        "text": "Je m'appelle Sora Kim.",
        "slot": "Sora Kim",
        "cue": {
          "en": "Sora Kim (full name)",
          "ko": "김소라(성과 이름)"
        },
        "gloss": {
          "en": "My name is Sora Kim.",
          "ko": "제 이름은 김소라예요."
        }
      },
      {
        "text": "Je m'appelle Julie. Et vous ?",
        "slot": "Julie",
        "cue": {
          "en": "Julie",
          "ko": "쥘리"
        },
        "gloss": {
          "en": "My name is Julie. And you?",
          "ko": "저는 쥘리예요. 그쪽은요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Je viens de ___.",
    "core": [
      "Je viens de",
      "je viens de",
      "Je viens d'",
      "je viens d'",
      "Je viens du",
      "je viens du"
    ],
    "meaning": {
      "en": "Saying where you come from: I come from ___.",
      "ko": "출신 말하기: ___에서 왔어요."
    },
    "grammar": [],
    "expressions": [
      "Je viens de Corée"
    ],
    "examples": [
      {
        "text": "Je viens de Corée.",
        "slot": "Corée",
        "cue": {
          "en": "Korea (la Corée)",
          "ko": "한국(la Corée)"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        }
      },
      {
        "text": "Je viens de Busan, en Corée.",
        "slot": "Busan",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm from Busan, in Korea.",
          "ko": "한국 부산에서 왔어요."
        }
      },
      {
        "text": "Je viens du Japon.",
        "slot": "du Japon",
        "cue": {
          "en": "Japan (de + le = du)",
          "ko": "일본(de + le = du)"
        },
        "gloss": {
          "en": "I'm from Japan.",
          "ko": "일본에서 왔어요."
        }
      },
      {
        "text": "Je viens d'Espagne, et vous ?",
        "slot": "Espagne",
        "cue": {
          "en": "Spain (d' before a vowel)",
          "ko": "스페인(모음 앞 d')"
        },
        "gloss": {
          "en": "I'm from Spain, and you?",
          "ko": "스페인에서 왔어요, 그쪽은요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Je suis ___.",
    "core": [
      "Je suis",
      "je suis"
    ],
    "meaning": {
      "en": "Saying what you are: I am ___ (job).",
      "ko": "직업 말하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je suis ingénieur.",
        "slot": "ingénieur",
        "cue": {
          "en": "an engineer (no article)",
          "ko": "엔지니어(관사 없이)"
        },
        "gloss": {
          "en": "I'm an engineer.",
          "ko": "저는 엔지니어예요."
        }
      },
      {
        "text": "Je suis étudiant à Paris.",
        "slot": "étudiant",
        "cue": {
          "en": "a student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm a student in Paris.",
          "ko": "저는 파리에서 공부하는 학생이에요."
        }
      },
      {
        "text": "Je suis professeur de musique.",
        "slot": "professeur",
        "cue": {
          "en": "a teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm a music teacher.",
          "ko": "저는 음악 선생님이에요."
        }
      },
      {
        "text": "Je suis infirmier, et vous ?",
        "slot": "infirmier",
        "cue": {
          "en": "a nurse",
          "ko": "간호사"
        },
        "gloss": {
          "en": "I'm a nurse, and you?",
          "ko": "저는 간호사예요, 그쪽은요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "Je travaille ___.",
    "core": [
      "Je travaille",
      "je travaille"
    ],
    "meaning": {
      "en": "Saying where you work: I work ___.",
      "ko": "일하는 곳 말하기: ___에서 일해요."
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je travaille dans une banque.",
        "slot": "dans une banque",
        "cue": {
          "en": "in a bank (une banque)",
          "ko": "은행에서(une banque)"
        },
        "gloss": {
          "en": "I work in a bank.",
          "ko": "은행에서 일해요."
        }
      },
      {
        "text": "Je travaille à l'hôpital.",
        "slot": "à l'hôpital",
        "cue": {
          "en": "at the hospital",
          "ko": "병원에서"
        },
        "gloss": {
          "en": "I work at the hospital.",
          "ko": "병원에서 일해요."
        }
      },
      {
        "text": "Je travaille dans un café le samedi.",
        "slot": "dans un café",
        "cue": {
          "en": "in a café (un café)",
          "ko": "카페에서(un café)"
        },
        "gloss": {
          "en": "I work in a café on Saturdays.",
          "ko": "토요일마다 카페에서 일해요."
        }
      },
      {
        "text": "Je travaille à la maison.",
        "slot": "à la maison",
        "cue": {
          "en": "at home",
          "ko": "집에서"
        },
        "gloss": {
          "en": "I work from home.",
          "ko": "집에서 일해요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-05",
    "stage": 1,
    "fn": "location-now",
    "pattern": "Je suis à ___.",
    "core": [
      "Je suis à",
      "je suis à",
      "Je suis au",
      "je suis au"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm at/in ___.",
      "ko": "지금 있는 곳 말하기: 지금 ___에 있어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je suis à la gare.",
        "slot": "la gare",
        "cue": {
          "en": "the station (la gare)",
          "ko": "기차역(la gare)"
        },
        "gloss": {
          "en": "I'm at the station.",
          "ko": "기차역에 있어요."
        }
      },
      {
        "text": "Je suis à Paris pour le travail.",
        "slot": "Paris",
        "cue": {
          "en": "Paris",
          "ko": "파리"
        },
        "gloss": {
          "en": "I'm in Paris for work.",
          "ko": "일 때문에 파리에 있어요."
        }
      },
      {
        "text": "Je suis au café, en face.",
        "slot": "café",
        "cue": {
          "en": "the café (à + le = au)",
          "ko": "카페(à + le = au)"
        },
        "gloss": {
          "en": "I'm at the café, opposite.",
          "ko": "맞은편 카페에 있어요."
        }
      },
      {
        "text": "Je suis à la maison ce soir.",
        "slot": "la maison",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home tonight.",
          "ko": "오늘 저녁엔 집에 있어요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-06",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "Je voudrais ___, s'il vous plaît.",
    "core": [
      "Je voudrais",
      "je voudrais"
    ],
    "meaning": {
      "en": "Asking politely for something: I'd like ___, please.",
      "ko": "정중하게 달라고 하기: ___ 주세요."
    },
    "grammar": [
      6,
      2
    ],
    "expressions": [
      "Je voudrais",
      "S'il vous plaît"
    ],
    "examples": [
      {
        "text": "Je voudrais une baguette, s'il vous plaît.",
        "slot": "une baguette",
        "cue": {
          "en": "a baguette",
          "ko": "바게트 하나"
        },
        "gloss": {
          "en": "I'd like a baguette, please.",
          "ko": "바게트 하나 주세요."
        }
      },
      {
        "text": "Je voudrais un café, s'il vous plaît.",
        "slot": "un café",
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
        "text": "Bonjour, je voudrais deux croissants, s'il vous plaît.",
        "slot": "deux croissants",
        "cue": {
          "en": "two croissants",
          "ko": "크루아상 두 개"
        },
        "gloss": {
          "en": "Hello, I'd like two croissants, please.",
          "ko": "안녕하세요, 크루아상 두 개 주세요."
        }
      },
      {
        "text": "Je voudrais le menu, s'il vous plaît.",
        "slot": "le menu",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "I'd like the menu, please.",
          "ko": "메뉴판 주세요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-07",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Est-ce qu'il y a ___ ?",
    "core": [
      "il y a",
      "Il y a"
    ],
    "meaning": {
      "en": "Asking if there is something: Is there ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      1,
      5,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Est-ce qu'il y a des croissants ?",
        "slot": "des croissants",
        "cue": {
          "en": "croissants (des)",
          "ko": "크루아상(des)"
        },
        "gloss": {
          "en": "Are there any croissants?",
          "ko": "크루아상 있어요?"
        }
      },
      {
        "text": "Est-ce qu'il y a une pharmacie près d'ici ?",
        "slot": "une pharmacie",
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
        "text": "Il y a un distributeur dans la gare ?",
        "slot": "un distributeur",
        "cue": {
          "en": "a cash machine",
          "ko": "현금 인출기"
        },
        "gloss": {
          "en": "Is there a cash machine in the station?",
          "ko": "역 안에 현금 인출기 있어요?"
        }
      },
      {
        "text": "Est-ce qu'il y a le wifi ici ?",
        "slot": "le wifi",
        "cue": {
          "en": "wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there wifi here?",
          "ko": "여기 와이파이 있어요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-08",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Où est ___ ?",
    "core": [
      "Où est",
      "où est"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디예요?"
    },
    "grammar": [
      7,
      2
    ],
    "expressions": [
      "Excusez-moi"
    ],
    "examples": [
      {
        "text": "Où est la station de métro ?",
        "slot": "la station de métro",
        "cue": {
          "en": "the metro station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Where is the metro station?",
          "ko": "지하철역이 어디예요?"
        }
      },
      {
        "text": "Excusez-moi, où est la ligne quatre ?",
        "slot": "la ligne quatre",
        "cue": {
          "en": "line four",
          "ko": "4호선"
        },
        "gloss": {
          "en": "Excuse me, where is line four?",
          "ko": "실례합니다, 4호선이 어디예요?"
        }
      },
      {
        "text": "Où est le musée, s'il vous plaît ?",
        "slot": "le musée",
        "cue": {
          "en": "the museum",
          "ko": "박물관"
        },
        "gloss": {
          "en": "Where is the museum, please?",
          "ko": "박물관이 어디예요?"
        }
      },
      {
        "text": "Pardon, où est l'hôtel Lumière ?",
        "slot": "l'hôtel Lumière",
        "cue": {
          "en": "the Hôtel Lumière",
          "ko": "뤼미에르 호텔"
        },
        "gloss": {
          "en": "Sorry, where is the Hôtel Lumière?",
          "ko": "죄송한데, 뤼미에르 호텔이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-09",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "Combien coûte ___ ?",
    "core": [
      "Combien coûte",
      "combien coûte"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      7,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Combien coûte la baguette ?",
        "slot": "la baguette",
        "cue": {
          "en": "the baguette",
          "ko": "바게트"
        },
        "gloss": {
          "en": "How much is the baguette?",
          "ko": "바게트 얼마예요?"
        }
      },
      {
        "text": "Combien coûte le billet de métro ?",
        "slot": "le billet de métro",
        "cue": {
          "en": "a metro ticket",
          "ko": "지하철표"
        },
        "gloss": {
          "en": "How much is a metro ticket?",
          "ko": "지하철표 얼마예요?"
        }
      },
      {
        "text": "Excusez-moi, combien coûte ce sac ?",
        "slot": "ce sac",
        "cue": {
          "en": "this bag",
          "ko": "이 가방"
        },
        "gloss": {
          "en": "Excuse me, how much is this bag?",
          "ko": "실례지만 이 가방 얼마예요?"
        }
      },
      {
        "text": "Combien coûte une chambre pour une nuit ?",
        "slot": "une chambre",
        "cue": {
          "en": "a room",
          "ko": "방 하나"
        },
        "gloss": {
          "en": "How much is a room for one night?",
          "ko": "방 하나 하룻밤에 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-10",
    "stage": 1,
    "fn": "cannot",
    "pattern": "Je ne parle pas ___.",
    "core": [
      "Je ne parle pas",
      "je ne parle pas"
    ],
    "meaning": {
      "en": "Saying what you can't speak: I don't speak ___.",
      "ko": "못 하는 말 말하기: ___ 못 해요."
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je ne parle pas bien français.",
        "slot": "bien français",
        "cue": {
          "en": "French well",
          "ko": "프랑스어를 잘"
        },
        "gloss": {
          "en": "I don't speak French well.",
          "ko": "프랑스어를 잘 못해요."
        }
      },
      {
        "text": "Je ne parle pas espagnol.",
        "slot": "espagnol",
        "cue": {
          "en": "Spanish",
          "ko": "스페인어"
        },
        "gloss": {
          "en": "I don't speak Spanish.",
          "ko": "스페인어는 못 해요."
        }
      },
      {
        "text": "Désolé, je ne parle pas allemand.",
        "slot": "allemand",
        "cue": {
          "en": "German",
          "ko": "독일어"
        },
        "gloss": {
          "en": "Sorry, I don't speak German.",
          "ko": "죄송해요, 독일어는 못 해요."
        }
      },
      {
        "text": "Je ne parle pas très vite.",
        "slot": "très vite",
        "cue": {
          "en": "very fast",
          "ko": "아주 빨리"
        },
        "gloss": {
          "en": "I don't speak very fast.",
          "ko": "저는 말이 빠르지 않아요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-11",
    "stage": 1,
    "fn": "like",
    "pattern": "J'aime ___.",
    "core": [
      "J'aime",
      "j'aime"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: ___ 좋아해요."
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "J'aime le café.",
        "slot": "le café",
        "cue": {
          "en": "coffee (le café)",
          "ko": "커피(le café)"
        },
        "gloss": {
          "en": "I like coffee.",
          "ko": "커피 좋아해요."
        }
      },
      {
        "text": "J'aime la musique française.",
        "slot": "la musique française",
        "cue": {
          "en": "French music",
          "ko": "프랑스 음악"
        },
        "gloss": {
          "en": "I like French music.",
          "ko": "프랑스 음악 좋아해요."
        }
      },
      {
        "text": "J'aime les films coréens.",
        "slot": "les films coréens",
        "cue": {
          "en": "Korean films",
          "ko": "한국 영화"
        },
        "gloss": {
          "en": "I like Korean films.",
          "ko": "한국 영화 좋아해요."
        }
      },
      {
        "text": "J'aime beaucoup Paris.",
        "slot": "Paris",
        "cue": {
          "en": "Paris",
          "ko": "파리"
        },
        "gloss": {
          "en": "I really like Paris.",
          "ko": "파리가 정말 좋아요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-12",
    "stage": 1,
    "fn": "dislike",
    "pattern": "Je n'aime pas ___.",
    "core": [
      "Je n'aime pas",
      "je n'aime pas"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: ___ 안 좋아해요."
    },
    "grammar": [
      3,
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je n'aime pas le fromage.",
        "slot": "le fromage",
        "cue": {
          "en": "cheese",
          "ko": "치즈"
        },
        "gloss": {
          "en": "I don't like cheese.",
          "ko": "치즈 안 좋아해요."
        }
      },
      {
        "text": "Je n'aime pas la pluie.",
        "slot": "la pluie",
        "cue": {
          "en": "the rain",
          "ko": "비"
        },
        "gloss": {
          "en": "I don't like the rain.",
          "ko": "비 오는 거 싫어해요."
        }
      },
      {
        "text": "Je n'aime pas les chats.",
        "slot": "les chats",
        "cue": {
          "en": "cats",
          "ko": "고양이"
        },
        "gloss": {
          "en": "I don't like cats.",
          "ko": "고양이 안 좋아해요."
        }
      },
      {
        "text": "Je n'aime pas le métro le matin.",
        "slot": "le métro",
        "cue": {
          "en": "the metro",
          "ko": "지하철"
        },
        "gloss": {
          "en": "I don't like the metro in the morning.",
          "ko": "아침 지하철은 싫어요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-13",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "Vous pouvez ___, s'il vous plaît ?",
    "core": [
      "Vous pouvez",
      "vous pouvez"
    ],
    "meaning": {
      "en": "Asking someone to repeat or slow down: Can you ___, please?",
      "ko": "다시·천천히 부탁하기: ___ 주실 수 있어요?"
    },
    "grammar": [],
    "expressions": [
      "Vous pouvez répéter",
      "Plus lentement",
      "S'il vous plaît"
    ],
    "examples": [
      {
        "text": "Vous pouvez répéter, s'il vous plaît ?",
        "slot": "répéter",
        "cue": {
          "en": "repeat",
          "ko": "다시 말하기"
        },
        "gloss": {
          "en": "Can you repeat, please?",
          "ko": "다시 말씀해 주실 수 있어요?"
        }
      },
      {
        "text": "Vous pouvez parler plus lentement, s'il vous plaît ?",
        "slot": "parler plus lentement",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하기"
        },
        "gloss": {
          "en": "Can you speak more slowly, please?",
          "ko": "좀 더 천천히 말씀해 주실 수 있어요?"
        }
      },
      {
        "text": "Vous pouvez écrire le mot, s'il vous plaît ?",
        "slot": "écrire le mot",
        "cue": {
          "en": "write the word",
          "ko": "단어를 써 주기"
        },
        "gloss": {
          "en": "Can you write the word, please?",
          "ko": "그 단어 좀 써 주실 수 있어요?"
        }
      },
      {
        "text": "Vous pouvez m'aider, s'il vous plaît ?",
        "slot": "m'aider",
        "cue": {
          "en": "help me",
          "ko": "도와주기"
        },
        "gloss": {
          "en": "Can you help me, please?",
          "ko": "좀 도와주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-14",
    "stage": 1,
    "fn": "greet",
    "pattern": "Salut, ___ ! Ça va ?",
    "core": [
      "Ça va",
      "ça va"
    ],
    "meaning": {
      "en": "Greeting a friend: Hi, ___! How are you?",
      "ko": "친구에게 인사하기: 안녕, ___! 잘 지내?"
    },
    "grammar": [],
    "expressions": [
      "Salut",
      "Ça va"
    ],
    "examples": [
      {
        "text": "Salut, Léa ! Ça va ?",
        "slot": "Léa",
        "cue": {
          "en": "Léa",
          "ko": "레아"
        },
        "gloss": {
          "en": "Hi, Léa! How are you?",
          "ko": "안녕, 레아! 잘 지내?"
        }
      },
      {
        "text": "Salut, Thomas ! Ça va bien ?",
        "slot": "Thomas",
        "cue": {
          "en": "Thomas",
          "ko": "토마"
        },
        "gloss": {
          "en": "Hi, Thomas! Are you well?",
          "ko": "안녕, 토마! 잘 지내?"
        }
      },
      {
        "text": "Salut, les amis ! Ça va ?",
        "slot": "les amis",
        "cue": {
          "en": "everyone (friends)",
          "ko": "친구들"
        },
        "gloss": {
          "en": "Hi, everyone! How's it going?",
          "ko": "얘들아 안녕! 잘 지내?"
        }
      },
      {
        "text": "Salut, Inès ! Ça va, toi ?",
        "slot": "Inès",
        "cue": {
          "en": "Inès",
          "ko": "이네스"
        },
        "gloss": {
          "en": "Hi, Inès! How about you, all good?",
          "ko": "안녕, 이네스! 넌 잘 지내?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-15",
    "stage": 1,
    "fn": "thank",
    "pattern": "Merci pour ___.",
    "core": [
      "Merci pour",
      "merci pour",
      "Merci beaucoup pour",
      "merci beaucoup pour"
    ],
    "meaning": {
      "en": "Thanking for something: Thanks for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "Merci beaucoup"
    ],
    "examples": [
      {
        "text": "Merci pour le café.",
        "slot": "le café",
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
        "text": "Merci beaucoup pour votre aide.",
        "slot": "votre aide",
        "cue": {
          "en": "your help",
          "ko": "도움"
        },
        "gloss": {
          "en": "Thank you very much for your help.",
          "ko": "도와주셔서 정말 고마워요."
        }
      },
      {
        "text": "Merci pour le colis !",
        "slot": "le colis",
        "cue": {
          "en": "the parcel",
          "ko": "택배"
        },
        "gloss": {
          "en": "Thanks for the parcel!",
          "ko": "택배 고마워!"
        }
      },
      {
        "text": "Merci pour la soirée.",
        "slot": "la soirée",
        "cue": {
          "en": "the evening",
          "ko": "오늘 저녁"
        },
        "gloss": {
          "en": "Thanks for the evening.",
          "ko": "오늘 저녁 고마웠어요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-16",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Est-ce que vous avez ___ ?",
    "core": [
      "Est-ce que vous avez",
      "est-ce que vous avez"
    ],
    "meaning": {
      "en": "Asking if they have something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있으세요?"
    },
    "grammar": [
      1,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Est-ce que vous avez une table pour deux ?",
        "slot": "une table pour deux",
        "cue": {
          "en": "a table for two",
          "ko": "두 명 자리"
        },
        "gloss": {
          "en": "Do you have a table for two?",
          "ko": "두 명 자리 있어요?"
        }
      },
      {
        "text": "Est-ce que vous avez des pains au chocolat ?",
        "slot": "des pains au chocolat",
        "cue": {
          "en": "pains au chocolat",
          "ko": "팽 오 쇼콜라"
        },
        "gloss": {
          "en": "Do you have pains au chocolat?",
          "ko": "팽 오 쇼콜라 있어요?"
        }
      },
      {
        "text": "Est-ce que vous avez un plan du métro ?",
        "slot": "un plan du métro",
        "cue": {
          "en": "a metro map",
          "ko": "지하철 노선도"
        },
        "gloss": {
          "en": "Do you have a metro map?",
          "ko": "지하철 노선도 있어요?"
        }
      },
      {
        "text": "Est-ce que vous avez la taille M ?",
        "slot": "la taille M",
        "cue": {
          "en": "size M",
          "ko": "M 사이즈"
        },
        "gloss": {
          "en": "Do you have size M?",
          "ko": "M 사이즈 있어요?"
        }
      }
    ]
  },
  {
    "id": "fr-f1-17",
    "stage": 1,
    "fn": "have",
    "pattern": "J'ai ___.",
    "core": [
      "J'ai",
      "j'ai"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: ___ 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "J'ai une question.",
        "slot": "une question",
        "cue": {
          "en": "a question",
          "ko": "질문 하나"
        },
        "gloss": {
          "en": "I have a question.",
          "ko": "질문이 하나 있어요."
        }
      },
      {
        "text": "J'ai un chat et un chien.",
        "slot": "un chat et un chien",
        "cue": {
          "en": "a cat and a dog",
          "ko": "고양이와 개"
        },
        "gloss": {
          "en": "I have a cat and a dog.",
          "ko": "고양이랑 개가 있어요."
        }
      },
      {
        "text": "J'ai une réservation.",
        "slot": "une réservation",
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
        "text": "J'ai deux enfants.",
        "slot": "deux enfants",
        "cue": {
          "en": "two children",
          "ko": "아이 둘"
        },
        "gloss": {
          "en": "I have two children.",
          "ko": "아이가 둘 있어요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-18",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "Je ne comprends pas ___.",
    "core": [
      "Je ne comprends pas",
      "je ne comprends pas"
    ],
    "meaning": {
      "en": "Saying what you don't understand: I don't understand ___.",
      "ko": "모르겠다고 말하기: ___ 이해가 안 돼요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "Je ne comprends pas",
      "Pardon"
    ],
    "examples": [
      {
        "text": "Je ne comprends pas ce mot.",
        "slot": "ce mot",
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
        "text": "Pardon, je ne comprends pas la question.",
        "slot": "la question",
        "cue": {
          "en": "the question",
          "ko": "질문"
        },
        "gloss": {
          "en": "Sorry, I don't understand the question.",
          "ko": "죄송해요, 질문을 이해 못 했어요."
        }
      },
      {
        "text": "Je ne comprends pas le menu.",
        "slot": "le menu",
        "cue": {
          "en": "the menu",
          "ko": "메뉴"
        },
        "gloss": {
          "en": "I don't understand the menu.",
          "ko": "메뉴를 모르겠어요."
        }
      },
      {
        "text": "Je ne comprends pas très bien.",
        "slot": "très bien",
        "cue": {
          "en": "very well",
          "ko": "아주 잘"
        },
        "gloss": {
          "en": "I don't understand very well.",
          "ko": "잘 이해가 안 돼요."
        }
      }
    ]
  },
  {
    "id": "fr-f1-19",
    "stage": 1,
    "fn": "greet",
    "pattern": "Bonne ___ !",
    "core": [
      "Bonne",
      "bonne"
    ],
    "meaning": {
      "en": "Wishing someone well when leaving: Have a good ___!",
      "ko": "헤어질 때 인사: 좋은 ___ 보내세요!"
    },
    "grammar": [],
    "expressions": [
      "Bonne journée",
      "Au revoir"
    ],
    "examples": [
      {
        "text": "Bonne journée !",
        "slot": "journée",
        "cue": {
          "en": "day",
          "ko": "하루"
        },
        "gloss": {
          "en": "Have a nice day!",
          "ko": "좋은 하루 보내세요!"
        }
      },
      {
        "text": "Au revoir, bonne soirée !",
        "slot": "soirée",
        "cue": {
          "en": "evening",
          "ko": "저녁"
        },
        "gloss": {
          "en": "Goodbye, have a nice evening!",
          "ko": "안녕히 가세요, 좋은 저녁 되세요!"
        }
      },
      {
        "text": "Bonne nuit, à demain !",
        "slot": "nuit",
        "cue": {
          "en": "night",
          "ko": "밤"
        },
        "gloss": {
          "en": "Good night, see you tomorrow!",
          "ko": "잘 자, 내일 봐!"
        }
      },
      {
        "text": "Merci, bonne semaine !",
        "slot": "semaine",
        "cue": {
          "en": "week",
          "ko": "한 주"
        },
        "gloss": {
          "en": "Thanks, have a good week!",
          "ko": "고마워요, 좋은 한 주 보내세요!"
        }
      }
    ]
  },
  {
    "id": "fr-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Hier, j'ai ___.",
    "core": [
      "J'ai",
      "j'ai"
    ],
    "meaning": {
      "en": "Saying what you did: Yesterday I ___.",
      "ko": "한 일 말하기: 어제 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "J'ai déjà fini"
    ],
    "examples": [
      {
        "text": "Hier, j'ai regardé un film.",
        "slot": "regardé un film",
        "cue": {
          "en": "watched a film (regarder)",
          "ko": "영화 봤다(regarder)"
        },
        "gloss": {
          "en": "Yesterday I watched a film.",
          "ko": "어제 영화를 봤어요."
        }
      },
      {
        "text": "Hier soir, j'ai travaillé tard.",
        "slot": "travaillé tard",
        "cue": {
          "en": "worked late",
          "ko": "늦게까지 일했다"
        },
        "gloss": {
          "en": "Last night I worked late.",
          "ko": "어젯밤 늦게까지 일했어요."
        }
      },
      {
        "text": "Ce midi, j'ai mangé au restaurant.",
        "slot": "mangé au restaurant",
        "cue": {
          "en": "ate at a restaurant",
          "ko": "식당에서 먹었다"
        },
        "gloss": {
          "en": "At lunchtime I ate at a restaurant.",
          "ko": "점심에 식당에서 먹었어요."
        }
      },
      {
        "text": "Oui, j'ai déjà fini mon livre.",
        "slot": "fini mon livre",
        "cue": {
          "en": "finished my book",
          "ko": "책을 다 읽었다"
        },
        "gloss": {
          "en": "Yes, I've already finished my book.",
          "ko": "네, 책을 벌써 다 읽었어요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Je suis allé ___.",
    "core": [
      "Je suis allé",
      "je suis allé"
    ],
    "meaning": {
      "en": "Saying where you went: I went ___.",
      "ko": "다녀온 곳 말하기: ___ 갔어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Samedi, je suis allé au cinéma.",
        "slot": "au cinéma",
        "cue": {
          "en": "to the cinema",
          "ko": "영화관에"
        },
        "gloss": {
          "en": "On Saturday I went to the cinema.",
          "ko": "토요일에 영화관에 갔어요."
        }
      },
      {
        "text": "Je suis allé chez mes parents.",
        "slot": "chez mes parents",
        "cue": {
          "en": "to my parents' place",
          "ko": "부모님 댁에"
        },
        "gloss": {
          "en": "I went to my parents' place.",
          "ko": "부모님 댁에 갔어요."
        }
      },
      {
        "text": "Hier, je suis allé à la plage.",
        "slot": "à la plage",
        "cue": {
          "en": "to the beach",
          "ko": "해변에"
        },
        "gloss": {
          "en": "Yesterday I went to the beach.",
          "ko": "어제 해변에 갔어요."
        }
      },
      {
        "text": "Ce matin, je suis allé au marché.",
        "slot": "au marché",
        "cue": {
          "en": "to the market",
          "ko": "시장에"
        },
        "gloss": {
          "en": "This morning I went to the market.",
          "ko": "오늘 아침 시장에 갔어요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-03",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Je vais ___.",
    "core": [
      "Je vais",
      "je vais"
    ],
    "meaning": {
      "en": "Saying what you're going to do: I'm going to ___.",
      "ko": "할 일 말하기: ___할 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ce week-end, je vais visiter le musée d'Orsay.",
        "slot": "visiter le musée d'Orsay",
        "cue": {
          "en": "visit the Musée d'Orsay",
          "ko": "오르세 미술관 가기"
        },
        "gloss": {
          "en": "This weekend I'm going to visit the Musée d'Orsay.",
          "ko": "이번 주말에 오르세 미술관에 갈 거예요."
        }
      },
      {
        "text": "Ce soir, je vais rester à la maison.",
        "slot": "rester à la maison",
        "cue": {
          "en": "stay at home",
          "ko": "집에 있기"
        },
        "gloss": {
          "en": "Tonight I'm going to stay at home.",
          "ko": "오늘 밤엔 집에 있을 거예요."
        }
      },
      {
        "text": "Je vais réserver les billets demain.",
        "slot": "réserver les billets",
        "cue": {
          "en": "book the tickets",
          "ko": "표 예매하기"
        },
        "gloss": {
          "en": "I'm going to book the tickets tomorrow.",
          "ko": "내일 표를 예매할 거예요."
        }
      },
      {
        "text": "Dimanche, je vais me reposer.",
        "slot": "me reposer",
        "cue": {
          "en": "rest",
          "ko": "쉬기"
        },
        "gloss": {
          "en": "On Sunday I'm going to rest.",
          "ko": "일요일엔 쉴 거예요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-04",
    "stage": 2,
    "fn": "invite",
    "pattern": "Ça te dit de ___ ?",
    "core": [
      "Ça te dit",
      "ça te dit"
    ],
    "meaning": {
      "en": "Inviting a friend: Do you fancy ___?",
      "ko": "같이 하자고 하기: ___ 할래?"
    },
    "grammar": [],
    "expressions": [
      "Ça te dit"
    ],
    "examples": [
      {
        "text": "Ça te dit d'aller au cinéma ?",
        "slot": "aller au cinéma",
        "cue": {
          "en": "going to the cinema",
          "ko": "영화 보러 가기"
        },
        "gloss": {
          "en": "Do you fancy going to the cinema?",
          "ko": "영화 보러 갈래?"
        }
      },
      {
        "text": "Ça te dit de venir dîner samedi ?",
        "slot": "venir dîner",
        "cue": {
          "en": "coming for dinner",
          "ko": "저녁 먹으러 오기"
        },
        "gloss": {
          "en": "Do you fancy coming for dinner on Saturday?",
          "ko": "토요일에 저녁 먹으러 올래?"
        }
      },
      {
        "text": "Ça te dit de faire une balade ?",
        "slot": "faire une balade",
        "cue": {
          "en": "going for a walk",
          "ko": "산책하기"
        },
        "gloss": {
          "en": "Do you fancy going for a walk?",
          "ko": "산책할래?"
        }
      },
      {
        "text": "Ça te dit de prendre un café ?",
        "slot": "prendre un café",
        "cue": {
          "en": "having a coffee",
          "ko": "커피 마시기"
        },
        "gloss": {
          "en": "Do you fancy having a coffee?",
          "ko": "커피 한잔할래?"
        }
      }
    ]
  },
  {
    "id": "fr-f2-05",
    "stage": 2,
    "fn": "permission",
    "pattern": "Je peux ___ ?",
    "core": [
      "Je peux",
      "je peux"
    ],
    "meaning": {
      "en": "Asking permission: Can I ___?",
      "ko": "허락 구하기: ___해도 돼요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "Je peux prendre une photo"
    ],
    "examples": [
      {
        "text": "Je peux prendre une photo ?",
        "slot": "prendre une photo",
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
        "text": "Je peux m'asseoir ici ?",
        "slot": "m'asseoir ici",
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
        "text": "Je peux ouvrir la fenêtre ?",
        "slot": "ouvrir la fenêtre",
        "cue": {
          "en": "open the window",
          "ko": "창문 열기"
        },
        "gloss": {
          "en": "Can I open the window?",
          "ko": "창문 열어도 돼요?"
        }
      },
      {
        "text": "Je peux payer par carte ?",
        "slot": "payer par carte",
        "cue": {
          "en": "pay by card",
          "ko": "카드로 계산하기"
        },
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드로 계산해도 돼요?"
        }
      }
    ]
  },
  {
    "id": "fr-f2-06",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Tu peux ___ ?",
    "core": [
      "Tu peux",
      "tu peux"
    ],
    "meaning": {
      "en": "Asking a friend to do something: Can you ___?",
      "ko": "해 달라고 부탁하기: ___ 줄 수 있어?"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tu peux m'aider ?",
        "slot": "m'aider",
        "cue": {
          "en": "help me",
          "ko": "도와주기"
        },
        "gloss": {
          "en": "Can you help me?",
          "ko": "도와줄 수 있어?"
        }
      },
      {
        "text": "Tu peux arriver un peu plus tôt ?",
        "slot": "arriver un peu plus tôt",
        "cue": {
          "en": "come a bit earlier",
          "ko": "조금 일찍 오기"
        },
        "gloss": {
          "en": "Can you come a bit earlier?",
          "ko": "조금 일찍 올 수 있어?"
        }
      },
      {
        "text": "Tu peux garder mon colis ?",
        "slot": "garder mon colis",
        "cue": {
          "en": "keep my parcel",
          "ko": "택배 맡아 주기"
        },
        "gloss": {
          "en": "Can you keep my parcel?",
          "ko": "내 택배 맡아 줄 수 있어?"
        }
      },
      {
        "text": "Tu peux m'envoyer l'adresse ?",
        "slot": "m'envoyer l'adresse",
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
    "id": "fr-f2-07",
    "stage": 2,
    "fn": "want",
    "pattern": "Je veux ___.",
    "core": [
      "Je veux",
      "je veux"
    ],
    "meaning": {
      "en": "Saying what you want to do: I want to ___.",
      "ko": "원하는 것 말하기: ___하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je veux finir ce dossier.",
        "slot": "finir ce dossier",
        "cue": {
          "en": "finish this file",
          "ko": "이 서류 끝내기"
        },
        "gloss": {
          "en": "I want to finish this file.",
          "ko": "이 서류 끝내고 싶어요."
        }
      },
      {
        "text": "Je veux apprendre à cuisiner.",
        "slot": "apprendre à cuisiner",
        "cue": {
          "en": "learn to cook",
          "ko": "요리 배우기"
        },
        "gloss": {
          "en": "I want to learn to cook.",
          "ko": "요리를 배우고 싶어요."
        }
      },
      {
        "text": "Je veux voir ce film.",
        "slot": "voir ce film",
        "cue": {
          "en": "see this film",
          "ko": "이 영화 보기"
        },
        "gloss": {
          "en": "I want to see this film.",
          "ko": "이 영화 보고 싶어요."
        }
      },
      {
        "text": "Ce soir, je veux partir tôt.",
        "slot": "partir tôt",
        "cue": {
          "en": "leave early",
          "ko": "일찍 나가기"
        },
        "gloss": {
          "en": "Tonight I want to leave early.",
          "ko": "오늘 저녁엔 일찍 가고 싶어요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-08",
    "stage": 2,
    "fn": "routine",
    "pattern": "Je me lève ___.",
    "core": [
      "Je me lève",
      "je me lève"
    ],
    "meaning": {
      "en": "Describing your routine: I get up ___.",
      "ko": "하루 일과 말하기: ___ 일어나요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je me lève à sept heures.",
        "slot": "à sept heures",
        "cue": {
          "en": "at seven",
          "ko": "일곱 시에"
        },
        "gloss": {
          "en": "I get up at seven.",
          "ko": "일곱 시에 일어나요."
        }
      },
      {
        "text": "En semaine, je me lève tôt.",
        "slot": "tôt",
        "cue": {
          "en": "early",
          "ko": "일찍"
        },
        "gloss": {
          "en": "On weekdays I get up early.",
          "ko": "평일엔 일찍 일어나요."
        }
      },
      {
        "text": "Le dimanche, je me lève tard.",
        "slot": "tard",
        "cue": {
          "en": "late",
          "ko": "늦게"
        },
        "gloss": {
          "en": "On Sundays I get up late.",
          "ko": "일요일엔 늦게 일어나요."
        }
      },
      {
        "text": "Je me lève avant mes enfants.",
        "slot": "avant mes enfants",
        "cue": {
          "en": "before my children",
          "ko": "아이들보다 먼저"
        },
        "gloss": {
          "en": "I get up before my children.",
          "ko": "아이들보다 먼저 일어나요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-09",
    "stage": 2,
    "fn": "order",
    "pattern": "___ ? Je le prends.",
    "core": [
      "Je le prends",
      "je le prends",
      "Je la prends",
      "je la prends",
      "Je les prends",
      "je les prends"
    ],
    "meaning": {
      "en": "Taking something, with a pronoun: ___? I'll take it.",
      "ko": "대명사로 고르기: ___요? 그걸로 할게요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ce pull ? Je le prends.",
        "slot": "Ce pull",
        "cue": {
          "en": "this jumper (le)",
          "ko": "이 스웨터(le)"
        },
        "gloss": {
          "en": "This jumper? I'll take it.",
          "ko": "이 스웨터요? 이걸로 할게요."
        }
      },
      {
        "text": "Cette veste ? Je la prends.",
        "slot": "Cette veste",
        "cue": {
          "en": "this jacket (la)",
          "ko": "이 재킷(la)"
        },
        "gloss": {
          "en": "This jacket? I'll take it.",
          "ko": "이 재킷요? 이걸로 할게요."
        }
      },
      {
        "text": "Les fraises ? Je les prends, merci.",
        "slot": "Les fraises",
        "cue": {
          "en": "the strawberries (les)",
          "ko": "딸기(les)"
        },
        "gloss": {
          "en": "The strawberries? I'll take them, thanks.",
          "ko": "딸기요? 그걸로 주세요, 고마워요."
        }
      },
      {
        "text": "Le menu du jour ? Je le prends.",
        "slot": "Le menu du jour",
        "cue": {
          "en": "the set menu (le)",
          "ko": "오늘의 메뉴(le)"
        },
        "gloss": {
          "en": "The set menu? I'll take it.",
          "ko": "오늘의 메뉴요? 그걸로 할게요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-10",
    "stage": 2,
    "fn": "reason",
    "pattern": "… parce que ___.",
    "core": [
      "parce que",
      "parce qu'"
    ],
    "meaning": {
      "en": "Giving a reason: … because ___.",
      "ko": "이유 말하기: ___라서 …"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je reste à la maison parce qu'il pleut.",
        "slot": "il pleut",
        "cue": {
          "en": "it's raining",
          "ko": "비가 온다"
        },
        "gloss": {
          "en": "I'm staying home because it's raining.",
          "ko": "비가 와서 집에 있어요."
        }
      },
      {
        "text": "Je suis fatigué parce que je travaille beaucoup.",
        "slot": "je travaille beaucoup",
        "cue": {
          "en": "I work a lot",
          "ko": "일을 많이 한다"
        },
        "gloss": {
          "en": "I'm tired because I work a lot.",
          "ko": "일을 많이 해서 피곤해요."
        }
      },
      {
        "text": "Je prends le métro parce que c'est rapide.",
        "slot": "c'est rapide",
        "cue": {
          "en": "it's quick",
          "ko": "빠르다"
        },
        "gloss": {
          "en": "I take the metro because it's quick.",
          "ko": "빨라서 지하철을 타요."
        }
      },
      {
        "text": "Je ne viens pas parce que j'ai mal à la tête.",
        "slot": "j'ai mal à la tête",
        "cue": {
          "en": "I have a headache",
          "ko": "머리가 아프다"
        },
        "gloss": {
          "en": "I'm not coming because I have a headache.",
          "ko": "머리가 아파서 못 가요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-11",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "On se retrouve ___ ?",
    "core": [
      "On se retrouve",
      "on se retrouve"
    ],
    "meaning": {
      "en": "Suggesting where or when to meet: Shall we meet ___?",
      "ko": "시간·장소 정하기: ___ 만날까?"
    },
    "grammar": [
      7,
      4
    ],
    "expressions": [
      "On se retrouve où"
    ],
    "examples": [
      {
        "text": "On se retrouve devant le cinéma ?",
        "slot": "devant le cinéma",
        "cue": {
          "en": "in front of the cinema",
          "ko": "영화관 앞에서"
        },
        "gloss": {
          "en": "Shall we meet in front of the cinema?",
          "ko": "영화관 앞에서 만날까?"
        }
      },
      {
        "text": "On se retrouve à deux heures ?",
        "slot": "à deux heures",
        "cue": {
          "en": "at two o'clock",
          "ko": "두 시에"
        },
        "gloss": {
          "en": "Shall we meet at two?",
          "ko": "두 시에 만날까?"
        }
      },
      {
        "text": "D'accord, et on se retrouve où ?",
        "slot": "où",
        "cue": {
          "en": "where",
          "ko": "어디서"
        },
        "gloss": {
          "en": "Okay, and where shall we meet?",
          "ko": "좋아, 그럼 어디서 만나?"
        }
      },
      {
        "text": "On se retrouve à la sortie du métro ?",
        "slot": "à la sortie du métro",
        "cue": {
          "en": "at the metro exit",
          "ko": "지하철 출구에서"
        },
        "gloss": {
          "en": "Shall we meet at the metro exit?",
          "ko": "지하철 출구에서 만날까?"
        }
      }
    ]
  },
  {
    "id": "fr-f2-12",
    "stage": 2,
    "fn": "invite",
    "pattern": "On peut ___ ?",
    "core": [
      "On peut",
      "on peut"
    ],
    "meaning": {
      "en": "Suggesting something together: Can we ___? / We can ___.",
      "ko": "같이 하자고 하기: 우리 ___할까?"
    },
    "grammar": [
      7,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "On peut y aller l'après-midi ?",
        "slot": "y aller l'après-midi",
        "cue": {
          "en": "go in the afternoon",
          "ko": "오후에 가기"
        },
        "gloss": {
          "en": "Can we go in the afternoon?",
          "ko": "오후에 갈까?"
        }
      },
      {
        "text": "On peut manger ensemble demain ?",
        "slot": "manger ensemble demain",
        "cue": {
          "en": "eat together tomorrow",
          "ko": "내일 같이 먹기"
        },
        "gloss": {
          "en": "Can we eat together tomorrow?",
          "ko": "내일 같이 밥 먹을까?"
        }
      },
      {
        "text": "On peut prendre un taxi ?",
        "slot": "prendre un taxi",
        "cue": {
          "en": "take a taxi",
          "ko": "택시 타기"
        },
        "gloss": {
          "en": "Can we take a taxi?",
          "ko": "택시 탈까?"
        }
      },
      {
        "text": "On peut changer de table ?",
        "slot": "changer de table",
        "cue": {
          "en": "change tables",
          "ko": "자리 바꾸기"
        },
        "gloss": {
          "en": "Can we change tables?",
          "ko": "자리 바꿀 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "fr-f2-13",
    "stage": 2,
    "fn": "symptom",
    "pattern": "J'ai mal ___.",
    "core": [
      "J'ai mal",
      "j'ai mal"
    ],
    "meaning": {
      "en": "Saying where it hurts: I have a pain in ___.",
      "ko": "아픈 곳 말하기: ___ 아파요."
    },
    "grammar": [],
    "expressions": [
      "J'ai mal à la tête"
    ],
    "examples": [
      {
        "text": "J'ai mal à la tête.",
        "slot": "à la tête",
        "cue": {
          "en": "head (la tête)",
          "ko": "머리(la tête)"
        },
        "gloss": {
          "en": "I have a headache.",
          "ko": "머리가 아파요."
        }
      },
      {
        "text": "J'ai mal à la gorge depuis hier.",
        "slot": "à la gorge",
        "cue": {
          "en": "throat (la gorge)",
          "ko": "목(la gorge)"
        },
        "gloss": {
          "en": "I've had a sore throat since yesterday.",
          "ko": "어제부터 목이 아파요."
        }
      },
      {
        "text": "J'ai mal au ventre.",
        "slot": "au ventre",
        "cue": {
          "en": "stomach (le ventre)",
          "ko": "배(le ventre)"
        },
        "gloss": {
          "en": "I have a stomach ache.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "J'ai mal au dos quand je marche.",
        "slot": "au dos",
        "cue": {
          "en": "back (le dos)",
          "ko": "허리(le dos)"
        },
        "gloss": {
          "en": "My back hurts when I walk.",
          "ko": "걸을 때 허리가 아파요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-14",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "Qu'est-ce que vous conseillez comme ___ ?",
    "core": [
      "Qu'est-ce que vous conseillez",
      "qu'est-ce que vous conseillez"
    ],
    "meaning": {
      "en": "Asking for a recommendation: What ___ do you recommend?",
      "ko": "추천해 달라고 하기: ___는 뭘 추천하세요?"
    },
    "grammar": [],
    "expressions": [
      "Qu'est-ce que vous conseillez"
    ],
    "examples": [
      {
        "text": "Qu'est-ce que vous conseillez comme dessert ?",
        "slot": "dessert",
        "cue": {
          "en": "dessert",
          "ko": "디저트"
        },
        "gloss": {
          "en": "What dessert do you recommend?",
          "ko": "디저트는 뭘 추천하세요?"
        }
      },
      {
        "text": "Qu'est-ce que vous conseillez comme vin ?",
        "slot": "vin",
        "cue": {
          "en": "wine",
          "ko": "와인"
        },
        "gloss": {
          "en": "What wine do you recommend?",
          "ko": "와인은 뭘 추천하세요?"
        }
      },
      {
        "text": "Qu'est-ce que vous conseillez comme plat ?",
        "slot": "plat",
        "cue": {
          "en": "main dish",
          "ko": "메인 요리"
        },
        "gloss": {
          "en": "What dish do you recommend?",
          "ko": "요리는 뭘 추천하세요?"
        }
      },
      {
        "text": "Qu'est-ce que vous conseillez comme fromage ?",
        "slot": "fromage",
        "cue": {
          "en": "cheese",
          "ko": "치즈"
        },
        "gloss": {
          "en": "What cheese do you recommend?",
          "ko": "치즈는 뭘 추천하세요?"
        }
      }
    ]
  },
  {
    "id": "fr-f2-15",
    "stage": 2,
    "fn": "order",
    "pattern": "Je vais prendre ___.",
    "core": [
      "Je vais prendre",
      "je vais prendre"
    ],
    "meaning": {
      "en": "Ordering: I'll have ___.",
      "ko": "주문하기: ___로 할게요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "L'addition"
    ],
    "examples": [
      {
        "text": "Je vais prendre la tarte et un thé.",
        "slot": "la tarte et un thé",
        "cue": {
          "en": "the tart and a tea",
          "ko": "타르트와 차"
        },
        "gloss": {
          "en": "I'll have the tart and a tea.",
          "ko": "타르트랑 차로 할게요."
        }
      },
      {
        "text": "Je vais prendre un café crème.",
        "slot": "un café crème",
        "cue": {
          "en": "a white coffee",
          "ko": "카페 크렘"
        },
        "gloss": {
          "en": "I'll have a white coffee.",
          "ko": "카페 크렘으로 할게요."
        }
      },
      {
        "text": "Je vais prendre le plat du jour.",
        "slot": "le plat du jour",
        "cue": {
          "en": "the dish of the day",
          "ko": "오늘의 요리"
        },
        "gloss": {
          "en": "I'll have the dish of the day.",
          "ko": "오늘의 요리로 할게요."
        }
      },
      {
        "text": "Je vais prendre une salade, et l'addition, s'il vous plaît.",
        "slot": "une salade",
        "cue": {
          "en": "a salad",
          "ko": "샐러드"
        },
        "gloss": {
          "en": "I'll have a salad, and the bill, please.",
          "ko": "샐러드 주시고, 계산서도 주세요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-16",
    "stage": 2,
    "fn": "like",
    "pattern": "J'adore ___.",
    "core": [
      "J'adore",
      "j'adore"
    ],
    "meaning": {
      "en": "Saying what you love: I love ___.",
      "ko": "아주 좋아하는 것 말하기: ___ 정말 좋아해요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "J'adore le cinéma.",
        "slot": "le cinéma",
        "cue": {
          "en": "the cinema",
          "ko": "영화"
        },
        "gloss": {
          "en": "I love the cinema.",
          "ko": "영화를 정말 좋아해요."
        }
      },
      {
        "text": "J'adore cuisiner le dimanche.",
        "slot": "cuisiner",
        "cue": {
          "en": "cooking",
          "ko": "요리하기"
        },
        "gloss": {
          "en": "I love cooking on Sundays.",
          "ko": "일요일에 요리하는 걸 정말 좋아해요."
        }
      },
      {
        "text": "J'adore les musées.",
        "slot": "les musées",
        "cue": {
          "en": "museums",
          "ko": "박물관"
        },
        "gloss": {
          "en": "I love museums.",
          "ko": "박물관을 정말 좋아해요."
        }
      },
      {
        "text": "J'adore ce quartier.",
        "slot": "ce quartier",
        "cue": {
          "en": "this neighbourhood",
          "ko": "이 동네"
        },
        "gloss": {
          "en": "I love this neighbourhood.",
          "ko": "이 동네가 정말 좋아요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-17",
    "stage": 2,
    "fn": "dislike",
    "pattern": "Je n'aime pas trop ___.",
    "core": [
      "Je n'aime pas trop",
      "je n'aime pas trop"
    ],
    "meaning": {
      "en": "Saying softly what you don't like: I'm not very keen on ___.",
      "ko": "부드럽게 싫다고 말하기: ___는 별로예요."
    },
    "grammar": [],
    "expressions": [
      "Je n'aime pas trop"
    ],
    "examples": [
      {
        "text": "Je n'aime pas trop le chocolat.",
        "slot": "le chocolat",
        "cue": {
          "en": "chocolate",
          "ko": "초콜릿"
        },
        "gloss": {
          "en": "I'm not very keen on chocolate.",
          "ko": "초콜릿은 별로예요."
        }
      },
      {
        "text": "Je n'aime pas trop les films d'horreur.",
        "slot": "les films d'horreur",
        "cue": {
          "en": "horror films",
          "ko": "공포 영화"
        },
        "gloss": {
          "en": "I'm not very keen on horror films.",
          "ko": "공포 영화는 별로예요."
        }
      },
      {
        "text": "Je n'aime pas trop courir.",
        "slot": "courir",
        "cue": {
          "en": "running",
          "ko": "달리기"
        },
        "gloss": {
          "en": "I'm not very keen on running.",
          "ko": "달리기는 별로예요."
        }
      },
      {
        "text": "Je n'aime pas trop la foule.",
        "slot": "la foule",
        "cue": {
          "en": "crowds",
          "ko": "사람 많은 곳"
        },
        "gloss": {
          "en": "I'm not very keen on crowds.",
          "ko": "사람 많은 건 별로예요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-18",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Je me suis ___.",
    "core": [
      "Je me suis",
      "je me suis"
    ],
    "meaning": {
      "en": "Saying what happened to you (reflexive past): I ___ (myself).",
      "ko": "재귀동사로 한 일 말하기: ___했어요."
    },
    "grammar": [
      4,
      1
    ],
    "expressions": [
      "Je me suis perdu"
    ],
    "examples": [
      {
        "text": "Je me suis perdu dans le métro.",
        "slot": "perdu dans le métro",
        "cue": {
          "en": "got lost in the metro",
          "ko": "지하철에서 길을 잃었다"
        },
        "gloss": {
          "en": "I got lost in the metro.",
          "ko": "지하철에서 길을 잃었어요."
        }
      },
      {
        "text": "Ce matin, je me suis levé très tôt.",
        "slot": "levé très tôt",
        "cue": {
          "en": "got up very early",
          "ko": "아주 일찍 일어났다"
        },
        "gloss": {
          "en": "This morning I got up very early.",
          "ko": "오늘 아침 아주 일찍 일어났어요."
        }
      },
      {
        "text": "Hier, je me suis couché tard.",
        "slot": "couché tard",
        "cue": {
          "en": "went to bed late",
          "ko": "늦게 잤다"
        },
        "gloss": {
          "en": "Yesterday I went to bed late.",
          "ko": "어제 늦게 잤어요."
        }
      },
      {
        "text": "Pardon, je me suis trompé de ligne.",
        "slot": "trompé de ligne",
        "cue": {
          "en": "took the wrong line",
          "ko": "노선을 잘못 탔다"
        },
        "gloss": {
          "en": "Sorry, I took the wrong line.",
          "ko": "죄송해요, 노선을 잘못 탔어요."
        }
      }
    ]
  },
  {
    "id": "fr-f2-19",
    "stage": 2,
    "fn": "decline",
    "pattern": "Je suis désolé, je ne peux pas ___.",
    "core": [
      "je ne peux pas",
      "Je ne peux pas"
    ],
    "meaning": {
      "en": "Declining politely: I'm sorry, I can't ___.",
      "ko": "정중하게 거절하기: 미안하지만 ___ 못 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "Je suis désolé"
    ],
    "examples": [
      {
        "text": "Je suis désolé, je ne peux pas venir samedi.",
        "slot": "venir samedi",
        "cue": {
          "en": "come on Saturday",
          "ko": "토요일에 오기"
        },
        "gloss": {
          "en": "I'm sorry, I can't come on Saturday.",
          "ko": "미안하지만 토요일엔 못 가요."
        }
      },
      {
        "text": "Je suis désolé, je ne peux pas sortir ce soir.",
        "slot": "sortir ce soir",
        "cue": {
          "en": "go out tonight",
          "ko": "오늘 밤 나가기"
        },
        "gloss": {
          "en": "I'm sorry, I can't go out tonight.",
          "ko": "미안하지만 오늘 밤엔 못 나가요."
        }
      },
      {
        "text": "Je suis désolé, je ne peux pas rester longtemps.",
        "slot": "rester longtemps",
        "cue": {
          "en": "stay long",
          "ko": "오래 있기"
        },
        "gloss": {
          "en": "I'm sorry, I can't stay long.",
          "ko": "미안하지만 오래 못 있어요."
        }
      },
      {
        "text": "Je suis désolé, je ne peux pas t'aider demain.",
        "slot": "t'aider demain",
        "cue": {
          "en": "help you tomorrow",
          "ko": "내일 도와주기"
        },
        "gloss": {
          "en": "I'm sorry, I can't help you tomorrow.",
          "ko": "미안하지만 내일은 못 도와줘."
        }
      }
    ]
  },
  {
    "id": "fr-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Je pense que ___.",
    "core": [
      "Je pense que",
      "je pense que",
      "Je pense qu'",
      "je pense qu'"
    ],
    "meaning": {
      "en": "Giving your opinion: I think that ___.",
      "ko": "내 생각 말하기: ___라고 생각해요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "Je pense que"
    ],
    "examples": [
      {
        "text": "Je pense que c'est mieux.",
        "slot": "c'est mieux",
        "cue": {
          "en": "it's better",
          "ko": "그게 낫다"
        },
        "gloss": {
          "en": "I think it's better.",
          "ko": "그게 나은 것 같아요."
        }
      },
      {
        "text": "Je pense qu'il va pleuvoir.",
        "slot": "il va pleuvoir",
        "cue": {
          "en": "it's going to rain",
          "ko": "비가 올 것이다"
        },
        "gloss": {
          "en": "I think it's going to rain.",
          "ko": "비가 올 것 같아요."
        }
      },
      {
        "text": "Je pense que tu as raison.",
        "slot": "tu as raison",
        "cue": {
          "en": "you're right",
          "ko": "네 말이 맞다"
        },
        "gloss": {
          "en": "I think you're right.",
          "ko": "네 말이 맞는 것 같아."
        }
      },
      {
        "text": "Je pense que le film est trop long.",
        "slot": "le film est trop long",
        "cue": {
          "en": "the film is too long",
          "ko": "영화가 너무 길다"
        },
        "gloss": {
          "en": "I think the film is too long.",
          "ko": "영화가 너무 긴 것 같아요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-02",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Je trouve que ___.",
    "core": [
      "Je trouve que",
      "je trouve que",
      "Je trouve qu'",
      "je trouve qu'"
    ],
    "meaning": {
      "en": "Giving your impression: I find that ___.",
      "ko": "느낀 점 말하기: ___라고 느껴요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je trouve que la fin était un peu rapide.",
        "slot": "la fin était un peu rapide",
        "cue": {
          "en": "the ending was a bit rushed",
          "ko": "결말이 좀 빨랐다"
        },
        "gloss": {
          "en": "I find the ending was a bit rushed.",
          "ko": "결말이 좀 급했던 것 같아요."
        }
      },
      {
        "text": "Je trouve que les acteurs sont meilleurs.",
        "slot": "les acteurs sont meilleurs",
        "cue": {
          "en": "the actors are better",
          "ko": "배우들이 더 낫다"
        },
        "gloss": {
          "en": "I think the actors are better.",
          "ko": "배우들이 더 나은 것 같아."
        }
      },
      {
        "text": "Je trouve que ce quartier est très calme.",
        "slot": "ce quartier est très calme",
        "cue": {
          "en": "this area is very quiet",
          "ko": "이 동네가 아주 조용하다"
        },
        "gloss": {
          "en": "I find this area very quiet.",
          "ko": "이 동네는 정말 조용한 것 같아요."
        }
      },
      {
        "text": "Je trouve qu'il parle trop vite.",
        "slot": "il parle trop vite",
        "cue": {
          "en": "he speaks too fast",
          "ko": "그가 말이 너무 빠르다"
        },
        "gloss": {
          "en": "I find he speaks too fast.",
          "ko": "그 사람 말이 너무 빠른 것 같아요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-03",
    "stage": 3,
    "fn": "opinion",
    "pattern": "À mon avis, ___.",
    "core": [
      "À mon avis",
      "à mon avis"
    ],
    "meaning": {
      "en": "Giving your view: In my opinion, ___.",
      "ko": "내 의견 말하기: 내 생각엔 ___."
    },
    "grammar": [],
    "expressions": [
      "À mon avis"
    ],
    "examples": [
      {
        "text": "À mon avis, la deuxième partie était plus intéressante.",
        "slot": "la deuxième partie était plus intéressante",
        "cue": {
          "en": "the second half was more interesting",
          "ko": "후반부가 더 재밌었다"
        },
        "gloss": {
          "en": "In my opinion, the second half was more interesting.",
          "ko": "내 생각엔 후반부가 더 재밌었어."
        }
      },
      {
        "text": "À mon avis, c'est trop cher.",
        "slot": "c'est trop cher",
        "cue": {
          "en": "it's too expensive",
          "ko": "너무 비싸다"
        },
        "gloss": {
          "en": "In my opinion, it's too expensive.",
          "ko": "내 생각엔 너무 비싸."
        }
      },
      {
        "text": "À mon avis, il va changer d'avis.",
        "slot": "il va changer d'avis",
        "cue": {
          "en": "he'll change his mind",
          "ko": "그가 마음을 바꿀 것이다"
        },
        "gloss": {
          "en": "In my opinion, he'll change his mind.",
          "ko": "내 생각엔 그 사람 마음 바꿀 거야."
        }
      },
      {
        "text": "À mon avis, on devrait partir maintenant.",
        "slot": "on devrait partir maintenant",
        "cue": {
          "en": "we should leave now",
          "ko": "지금 출발해야 한다"
        },
        "gloss": {
          "en": "In my opinion, we should leave now.",
          "ko": "내 생각엔 지금 출발해야 해."
        }
      }
    ]
  },
  {
    "id": "fr-f3-04",
    "stage": 3,
    "fn": "while-when",
    "pattern": "Je ___ quand le téléphone a sonné.",
    "core": [
      "quand"
    ],
    "meaning": {
      "en": "Saying what you were doing when something happened: I was ___ when the phone rang.",
      "ko": "~할 때 말하기: ___하고 있을 때 전화가 울렸어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je dormais quand le téléphone a sonné.",
        "slot": "dormais",
        "cue": {
          "en": "was sleeping (dormir)",
          "ko": "자고 있었다(dormir)"
        },
        "gloss": {
          "en": "I was sleeping when the phone rang.",
          "ko": "자고 있을 때 전화가 울렸어요."
        }
      },
      {
        "text": "Je cuisinais quand le téléphone a sonné.",
        "slot": "cuisinais",
        "cue": {
          "en": "was cooking",
          "ko": "요리하고 있었다"
        },
        "gloss": {
          "en": "I was cooking when the phone rang.",
          "ko": "요리하고 있을 때 전화가 울렸어요."
        }
      },
      {
        "text": "Je prenais ma douche quand le téléphone a sonné.",
        "slot": "prenais ma douche",
        "cue": {
          "en": "was having a shower",
          "ko": "샤워하고 있었다"
        },
        "gloss": {
          "en": "I was in the shower when the phone rang.",
          "ko": "샤워하고 있을 때 전화가 울렸어요."
        }
      },
      {
        "text": "Je regardais la télé quand le téléphone a sonné.",
        "slot": "regardais la télé",
        "cue": {
          "en": "was watching TV",
          "ko": "TV를 보고 있었다"
        },
        "gloss": {
          "en": "I was watching TV when the phone rang.",
          "ko": "TV 보고 있을 때 전화가 울렸어요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-05",
    "stage": 3,
    "fn": "habit-past",
    "pattern": "Avant, je ___.",
    "core": [
      "Avant, je",
      "avant, je",
      "Avant, j'",
      "avant, j'"
    ],
    "meaning": {
      "en": "Saying what you used to do: I used to ___.",
      "ko": "예전에 하던 일 말하기: 예전엔 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Avant, j'habitais à Lyon.",
        "slot": "habitais à Lyon",
        "cue": {
          "en": "lived in Lyon",
          "ko": "리옹에 살았다"
        },
        "gloss": {
          "en": "I used to live in Lyon.",
          "ko": "예전엔 리옹에 살았어요."
        }
      },
      {
        "text": "Avant, je travaillais dans un café.",
        "slot": "travaillais dans un café",
        "cue": {
          "en": "worked in a café",
          "ko": "카페에서 일했다"
        },
        "gloss": {
          "en": "I used to work in a café.",
          "ko": "예전엔 카페에서 일했어요."
        }
      },
      {
        "text": "Avant, je jouais au tennis tous les week-ends.",
        "slot": "jouais au tennis",
        "cue": {
          "en": "played tennis",
          "ko": "테니스를 쳤다"
        },
        "gloss": {
          "en": "I used to play tennis every weekend.",
          "ko": "예전엔 주말마다 테니스를 쳤어요."
        }
      },
      {
        "text": "Avant, je sortais tous les soirs.",
        "slot": "sortais tous les soirs",
        "cue": {
          "en": "went out every night",
          "ko": "매일 밤 놀러 나갔다"
        },
        "gloss": {
          "en": "I used to go out every night.",
          "ko": "예전엔 매일 밤 놀러 나갔어요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-06",
    "stage": 3,
    "fn": "clarify",
    "pattern": "En fait, ___.",
    "core": [
      "En fait",
      "en fait"
    ],
    "meaning": {
      "en": "Correcting or clarifying: Actually, ___.",
      "ko": "사실 밝히기: 사실은 ___."
    },
    "grammar": [],
    "expressions": [
      "En fait"
    ],
    "examples": [
      {
        "text": "En fait, j'avais plus de batterie.",
        "slot": "j'avais plus de batterie",
        "cue": {
          "en": "my battery was dead",
          "ko": "배터리가 다 됐었다"
        },
        "gloss": {
          "en": "Actually, my battery was dead.",
          "ko": "사실 배터리가 다 됐었어."
        }
      },
      {
        "text": "En fait, je viens de Busan, pas de Séoul.",
        "slot": "je viens de Busan",
        "cue": {
          "en": "I'm from Busan",
          "ko": "부산 출신이다"
        },
        "gloss": {
          "en": "Actually, I'm from Busan, not Seoul.",
          "ko": "사실 난 서울이 아니라 부산 출신이야."
        }
      },
      {
        "text": "En fait, c'est pas grave.",
        "slot": "c'est pas grave",
        "cue": {
          "en": "it's no big deal",
          "ko": "별일 아니다"
        },
        "gloss": {
          "en": "Actually, it's no big deal.",
          "ko": "사실 별일 아니야."
        }
      },
      {
        "text": "En fait, je l'ai déjà vu, ce film.",
        "slot": "je l'ai déjà vu",
        "cue": {
          "en": "I've already seen it",
          "ko": "이미 봤다"
        },
        "gloss": {
          "en": "Actually, I've already seen that film.",
          "ko": "사실 그 영화 이미 봤어."
        }
      }
    ]
  },
  {
    "id": "fr-f3-07",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Tu pourrais ___ ?",
    "core": [
      "pourrais",
      "pourriez",
      "pourrait"
    ],
    "meaning": {
      "en": "Asking more politely: Could you ___?",
      "ko": "더 공손하게 부탁하기: ___ 줄 수 있을까?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tu pourrais m'aider avec ce dossier ?",
        "slot": "m'aider avec ce dossier",
        "cue": {
          "en": "help me with this file",
          "ko": "이 서류 도와주기"
        },
        "gloss": {
          "en": "Could you help me with this file?",
          "ko": "이 서류 좀 도와줄 수 있을까?"
        }
      },
      {
        "text": "Vous pourriez me prévenir par message ?",
        "slot": "me prévenir par message",
        "cue": {
          "en": "let me know by text",
          "ko": "문자로 알려 주기"
        },
        "gloss": {
          "en": "Could you let me know by text?",
          "ko": "문자로 알려 주실 수 있을까요?"
        }
      },
      {
        "text": "Tu pourrais fermer la fenêtre ?",
        "slot": "fermer la fenêtre",
        "cue": {
          "en": "close the window",
          "ko": "창문 닫기"
        },
        "gloss": {
          "en": "Could you close the window?",
          "ko": "창문 좀 닫아 줄 수 있을까?"
        }
      },
      {
        "text": "Vous pourriez parler un peu plus fort ?",
        "slot": "parler un peu plus fort",
        "cue": {
          "en": "speak a bit louder",
          "ko": "조금 더 크게 말하기"
        },
        "gloss": {
          "en": "Could you speak a bit louder?",
          "ko": "조금 더 크게 말씀해 주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "fr-f3-08",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "La prochaine fois, je ___.",
    "core": [
      "La prochaine fois",
      "la prochaine fois"
    ],
    "meaning": {
      "en": "Saying what you'll do next time: Next time, I'll ___.",
      "ko": "다음에 할 일 말하기: 다음엔 ___할게요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "La prochaine fois, je partirai plus tôt.",
        "slot": "partirai plus tôt",
        "cue": {
          "en": "will leave earlier",
          "ko": "더 일찍 출발하다"
        },
        "gloss": {
          "en": "Next time, I'll leave earlier.",
          "ko": "다음엔 더 일찍 출발할게."
        }
      },
      {
        "text": "La prochaine fois, je prendrai un taxi.",
        "slot": "prendrai un taxi",
        "cue": {
          "en": "will take a taxi",
          "ko": "택시를 타다"
        },
        "gloss": {
          "en": "Next time, I'll take a taxi.",
          "ko": "다음엔 택시 탈게."
        }
      },
      {
        "text": "La prochaine fois, je réserverai à l'avance.",
        "slot": "réserverai à l'avance",
        "cue": {
          "en": "will book in advance",
          "ko": "미리 예약하다"
        },
        "gloss": {
          "en": "Next time, I'll book in advance.",
          "ko": "다음엔 미리 예약할게요."
        }
      },
      {
        "text": "La prochaine fois, je t'appellerai avant.",
        "slot": "t'appellerai avant",
        "cue": {
          "en": "will call you first",
          "ko": "먼저 전화하다"
        },
        "gloss": {
          "en": "Next time, I'll call you first.",
          "ko": "다음엔 먼저 전화할게."
        }
      }
    ]
  },
  {
    "id": "fr-f3-09",
    "stage": 3,
    "fn": "complain",
    "pattern": "Il y a un souci avec ___.",
    "core": [
      "Il y a un souci",
      "il y a un souci"
    ],
    "meaning": {
      "en": "Reporting a problem politely: There's a problem with ___.",
      "ko": "정중하게 문제 알리기: ___에 문제가 있어요."
    },
    "grammar": [],
    "expressions": [
      "Il y a un souci"
    ],
    "examples": [
      {
        "text": "Il y a un souci avec le chauffe-eau.",
        "slot": "le chauffe-eau",
        "cue": {
          "en": "the water heater",
          "ko": "온수기"
        },
        "gloss": {
          "en": "There's a problem with the water heater.",
          "ko": "온수기에 문제가 있어요."
        }
      },
      {
        "text": "Il y a un souci avec ma réservation.",
        "slot": "ma réservation",
        "cue": {
          "en": "my reservation",
          "ko": "제 예약"
        },
        "gloss": {
          "en": "There's a problem with my reservation.",
          "ko": "제 예약에 문제가 있어요."
        }
      },
      {
        "text": "Excusez-moi, il y a un souci avec l'addition.",
        "slot": "l'addition",
        "cue": {
          "en": "the bill",
          "ko": "계산서"
        },
        "gloss": {
          "en": "Excuse me, there's a problem with the bill.",
          "ko": "실례지만 계산서에 문제가 있어요."
        }
      },
      {
        "text": "Il y a un souci avec le wifi.",
        "slot": "le wifi",
        "cue": {
          "en": "the wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "There's a problem with the wifi.",
          "ko": "와이파이에 문제가 있어요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-10",
    "stage": 3,
    "fn": "complain",
    "pattern": "___ ne marche pas.",
    "core": [
      "ne marche pas",
      "marche pas"
    ],
    "meaning": {
      "en": "Saying something doesn't work: ___ doesn't work.",
      "ko": "고장 알리기: ___가 작동을 안 해요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Le wifi ne marche pas.",
        "slot": "Le wifi",
        "cue": {
          "en": "the wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "The wifi doesn't work.",
          "ko": "와이파이가 안 돼요."
        }
      },
      {
        "text": "La clim ne marche pas depuis hier.",
        "slot": "La clim",
        "cue": {
          "en": "the air conditioning",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The air conditioning hasn't worked since yesterday.",
          "ko": "어제부터 에어컨이 안 돼요."
        }
      },
      {
        "text": "Mon téléphone marche pas.",
        "slot": "Mon téléphone",
        "cue": {
          "en": "my phone (casual)",
          "ko": "내 휴대폰(구어)"
        },
        "gloss": {
          "en": "My phone isn't working.",
          "ko": "내 폰이 안 돼."
        }
      },
      {
        "text": "L'ascenseur ne marche pas.",
        "slot": "L'ascenseur",
        "cue": {
          "en": "the lift",
          "ko": "엘리베이터"
        },
        "gloss": {
          "en": "The lift isn't working.",
          "ko": "엘리베이터가 고장 났어요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-11",
    "stage": 3,
    "fn": "guess",
    "pattern": "Je ne suis pas sûr de ___.",
    "core": [
      "Je ne suis pas sûr",
      "je ne suis pas sûr"
    ],
    "meaning": {
      "en": "Saying you're not sure: I'm not sure about ___.",
      "ko": "확실하지 않다고 말하기: ___는 잘 모르겠어요."
    },
    "grammar": [],
    "expressions": [
      "Je ne suis pas sûr"
    ],
    "examples": [
      {
        "text": "Je ne suis pas sûr de comprendre.",
        "slot": "comprendre",
        "cue": {
          "en": "understanding",
          "ko": "이해하는 것"
        },
        "gloss": {
          "en": "I'm not sure I understand.",
          "ko": "이해한 건지 잘 모르겠어요."
        }
      },
      {
        "text": "Je ne suis pas sûr de pouvoir venir.",
        "slot": "pouvoir venir",
        "cue": {
          "en": "being able to come",
          "ko": "올 수 있는 것"
        },
        "gloss": {
          "en": "I'm not sure I can come.",
          "ko": "갈 수 있을지 잘 모르겠어요."
        }
      },
      {
        "text": "Je ne suis pas sûr d'avoir le temps.",
        "slot": "avoir le temps",
        "cue": {
          "en": "having time",
          "ko": "시간이 있는 것"
        },
        "gloss": {
          "en": "I'm not sure I have time.",
          "ko": "시간이 있을지 모르겠어요."
        }
      },
      {
        "text": "Je ne suis pas sûr de l'adresse.",
        "slot": "l'adresse",
        "cue": {
          "en": "the address",
          "ko": "주소"
        },
        "gloss": {
          "en": "I'm not sure of the address.",
          "ko": "주소가 확실하지 않아요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-12",
    "stage": 3,
    "fn": "not-understand",
    "pattern": "Je sais pas ___.",
    "core": [
      "Je sais pas",
      "je sais pas"
    ],
    "meaning": {
      "en": "Saying you don't know, casually: I dunno ___.",
      "ko": "편하게 모른다고 말하기: ___ 몰라."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Je sais pas exactement.",
        "slot": "exactement",
        "cue": {
          "en": "exactly",
          "ko": "정확히"
        },
        "gloss": {
          "en": "I don't know exactly.",
          "ko": "정확히는 몰라."
        }
      },
      {
        "text": "Je sais pas où il est.",
        "slot": "où il est",
        "cue": {
          "en": "where he is",
          "ko": "그가 어디 있는지"
        },
        "gloss": {
          "en": "I don't know where he is.",
          "ko": "걔 어디 있는지 몰라."
        }
      },
      {
        "text": "Je sais pas quoi faire ce soir.",
        "slot": "quoi faire",
        "cue": {
          "en": "what to do",
          "ko": "뭘 할지"
        },
        "gloss": {
          "en": "I don't know what to do tonight.",
          "ko": "오늘 저녁에 뭐 할지 모르겠어."
        }
      },
      {
        "text": "Je sais pas s'il vient.",
        "slot": "s'il vient",
        "cue": {
          "en": "if he's coming",
          "ko": "그가 오는지"
        },
        "gloss": {
          "en": "I don't know if he's coming.",
          "ko": "걔가 오는지 몰라."
        }
      }
    ]
  },
  {
    "id": "fr-f3-13",
    "stage": 3,
    "fn": "agree",
    "pattern": "Tu as raison, ___.",
    "core": [
      "Tu as raison",
      "tu as raison"
    ],
    "meaning": {
      "en": "Agreeing and adding: You're right, ___.",
      "ko": "동의하며 덧붙이기: 네 말이 맞아, ___."
    },
    "grammar": [],
    "expressions": [
      "Tu as raison"
    ],
    "examples": [
      {
        "text": "Tu as raison, c'est trop cher.",
        "slot": "c'est trop cher",
        "cue": {
          "en": "it's too expensive",
          "ko": "너무 비싸다"
        },
        "gloss": {
          "en": "You're right, it's too expensive.",
          "ko": "네 말이 맞아, 너무 비싸."
        }
      },
      {
        "text": "Tu as raison, il est tard.",
        "slot": "il est tard",
        "cue": {
          "en": "it's late",
          "ko": "늦었다"
        },
        "gloss": {
          "en": "You're right, it's late.",
          "ko": "맞아, 늦었다."
        }
      },
      {
        "text": "Tu as raison, on va prendre le métro.",
        "slot": "on va prendre le métro",
        "cue": {
          "en": "we'll take the metro",
          "ko": "지하철 타자"
        },
        "gloss": {
          "en": "You're right, we'll take the metro.",
          "ko": "네 말이 맞아, 지하철 타자."
        }
      },
      {
        "text": "Tu as raison, je l'appellerai demain.",
        "slot": "je l'appellerai demain",
        "cue": {
          "en": "I'll call him tomorrow",
          "ko": "내일 전화하겠다"
        },
        "gloss": {
          "en": "You're right, I'll call him tomorrow.",
          "ko": "맞아, 내일 전화할게."
        }
      }
    ]
  },
  {
    "id": "fr-f3-14",
    "stage": 3,
    "fn": "count",
    "pattern": "J'en ai ___.",
    "core": [
      "J'en ai",
      "j'en ai"
    ],
    "meaning": {
      "en": "Talking about an amount with 'en': I have/had ___ (of them).",
      "ko": "en으로 양 말하기: ___ 있어요/했어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Des croissants ? J'en ai acheté trois.",
        "slot": "acheté trois",
        "cue": {
          "en": "bought three",
          "ko": "세 개 샀다"
        },
        "gloss": {
          "en": "Croissants? I bought three.",
          "ko": "크루아상? 세 개 샀어."
        }
      },
      {
        "text": "J'en ai déjà bu un au dîner.",
        "slot": "déjà bu un",
        "cue": {
          "en": "already drank one",
          "ko": "벌써 한 잔 마셨다"
        },
        "gloss": {
          "en": "I already had one at dinner.",
          "ko": "저녁 때 벌써 한 잔 마셨어."
        }
      },
      {
        "text": "Des frères ? J'en ai deux.",
        "slot": "deux",
        "cue": {
          "en": "two",
          "ko": "둘"
        },
        "gloss": {
          "en": "Brothers? I have two.",
          "ko": "형제? 둘 있어."
        }
      },
      {
        "text": "Des photos de Paris ? J'en ai beaucoup.",
        "slot": "beaucoup",
        "cue": {
          "en": "lots",
          "ko": "많이"
        },
        "gloss": {
          "en": "Photos of Paris? I have lots.",
          "ko": "파리 사진? 많이 있어."
        }
      }
    ]
  },
  {
    "id": "fr-f3-15",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "On y va ___ ?",
    "core": [
      "On y va",
      "on y va",
      "J'y vais",
      "j'y vais"
    ],
    "meaning": {
      "en": "Saying you're going there, with 'y': Shall we go there ___?",
      "ko": "y로 가자고 말하기: ___ 갈까?"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "On y va à pied ?",
        "slot": "à pied",
        "cue": {
          "en": "on foot",
          "ko": "걸어서"
        },
        "gloss": {
          "en": "Shall we go on foot?",
          "ko": "걸어서 갈까?"
        }
      },
      {
        "text": "On y va quand même ?",
        "slot": "quand même",
        "cue": {
          "en": "anyway",
          "ko": "그래도"
        },
        "gloss": {
          "en": "Shall we go anyway?",
          "ko": "그래도 갈까?"
        }
      },
      {
        "text": "On y va demain matin ?",
        "slot": "demain matin",
        "cue": {
          "en": "tomorrow morning",
          "ko": "내일 아침"
        },
        "gloss": {
          "en": "Shall we go tomorrow morning?",
          "ko": "내일 아침에 갈까?"
        }
      },
      {
        "text": "On y va en métro ?",
        "slot": "en métro",
        "cue": {
          "en": "by metro",
          "ko": "지하철로"
        },
        "gloss": {
          "en": "Shall we go by metro?",
          "ko": "지하철로 갈까?"
        }
      }
    ]
  },
  {
    "id": "fr-f3-16",
    "stage": 3,
    "fn": "describe-thing",
    "pattern": "C'est l'endroit où ___.",
    "core": [
      "l'endroit où"
    ],
    "meaning": {
      "en": "Describing a place with 'où': It's the place where ___.",
      "ko": "où로 장소 설명하기: ___한 곳이에요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "C'est l'endroit où j'ai grandi.",
        "slot": "j'ai grandi",
        "cue": {
          "en": "I grew up",
          "ko": "내가 자랐다"
        },
        "gloss": {
          "en": "It's the place where I grew up.",
          "ko": "제가 자란 곳이에요."
        }
      },
      {
        "text": "C'est l'endroit où on s'est rencontrés.",
        "slot": "on s'est rencontrés",
        "cue": {
          "en": "we met",
          "ko": "우리가 만났다"
        },
        "gloss": {
          "en": "It's the place where we met.",
          "ko": "우리가 처음 만난 곳이야."
        }
      },
      {
        "text": "C'est l'endroit où je travaillais avant.",
        "slot": "je travaillais avant",
        "cue": {
          "en": "I used to work",
          "ko": "예전에 일했다"
        },
        "gloss": {
          "en": "It's the place where I used to work.",
          "ko": "예전에 일하던 곳이에요."
        }
      },
      {
        "text": "C'est l'endroit où on mange le mieux du quartier.",
        "slot": "on mange le mieux",
        "cue": {
          "en": "you eat best",
          "ko": "제일 맛있게 먹는다"
        },
        "gloss": {
          "en": "It's the place where you eat best in the area.",
          "ko": "이 동네에서 제일 맛있는 곳이에요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-17",
    "stage": 3,
    "fn": "describe-thing",
    "pattern": "___ que tu m'as conseillé, c'était génial !",
    "core": [
      "que tu m'as conseillé"
    ],
    "meaning": {
      "en": "Talking about something with 'que': The ___ you recommended was great!",
      "ko": "que로 꾸며 말하기: 네가 추천한 ___ 정말 좋았어!"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "C'était génial"
    ],
    "examples": [
      {
        "text": "Le restaurant que tu m'as conseillé, c'était génial !",
        "slot": "Le restaurant",
        "cue": {
          "en": "the restaurant",
          "ko": "식당"
        },
        "gloss": {
          "en": "The restaurant you recommended was great!",
          "ko": "네가 추천한 식당 정말 좋았어!"
        }
      },
      {
        "text": "Le film que tu m'as conseillé, c'était génial !",
        "slot": "Le film",
        "cue": {
          "en": "the film",
          "ko": "영화"
        },
        "gloss": {
          "en": "The film you recommended was great!",
          "ko": "네가 추천한 영화 정말 좋았어!"
        }
      },
      {
        "text": "Le livre que tu m'as conseillé, c'était génial !",
        "slot": "Le livre",
        "cue": {
          "en": "the book",
          "ko": "책"
        },
        "gloss": {
          "en": "The book you recommended was great!",
          "ko": "네가 추천한 책 정말 좋았어!"
        }
      },
      {
        "text": "Le concert que tu m'as conseillé, c'était génial !",
        "slot": "Le concert",
        "cue": {
          "en": "the concert",
          "ko": "콘서트"
        },
        "gloss": {
          "en": "The concert you recommended was great!",
          "ko": "네가 추천한 콘서트 정말 좋았어!"
        }
      }
    ]
  },
  {
    "id": "fr-f3-18",
    "stage": 3,
    "fn": "describe-person",
    "pattern": "J'ai un ami qui ___.",
    "core": [
      "un ami qui",
      "une amie qui"
    ],
    "meaning": {
      "en": "Describing someone with 'qui': I have a friend who ___.",
      "ko": "qui로 사람 설명하기: ___하는 친구가 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "J'ai un ami qui habite à Lyon.",
        "slot": "habite à Lyon",
        "cue": {
          "en": "lives in Lyon",
          "ko": "리옹에 산다"
        },
        "gloss": {
          "en": "I have a friend who lives in Lyon.",
          "ko": "리옹에 사는 친구가 있어요."
        }
      },
      {
        "text": "J'ai une amie qui parle coréen.",
        "slot": "parle coréen",
        "cue": {
          "en": "speaks Korean",
          "ko": "한국어를 한다"
        },
        "gloss": {
          "en": "I have a friend who speaks Korean.",
          "ko": "한국어 하는 친구가 있어요."
        }
      },
      {
        "text": "J'ai un ami qui travaille dans le cinéma.",
        "slot": "travaille dans le cinéma",
        "cue": {
          "en": "works in film",
          "ko": "영화 일을 한다"
        },
        "gloss": {
          "en": "I have a friend who works in film.",
          "ko": "영화 일 하는 친구가 있어요."
        }
      },
      {
        "text": "J'ai une amie qui cherche un appart.",
        "slot": "cherche un appart",
        "cue": {
          "en": "is looking for a flat",
          "ko": "집을 구하고 있다"
        },
        "gloss": {
          "en": "I have a friend who's looking for a flat.",
          "ko": "집 구하는 친구가 있어요."
        }
      }
    ]
  },
  {
    "id": "fr-f3-19",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "Désolé du retard, ___.",
    "core": [
      "Désolé du retard",
      "désolé du retard"
    ],
    "meaning": {
      "en": "Apologizing for being late and explaining: Sorry I'm late, ___.",
      "ko": "늦은 것 사과하고 사정 말하기: 늦어서 미안, ___."
    },
    "grammar": [],
    "expressions": [
      "Désolé du retard"
    ],
    "examples": [
      {
        "text": "Désolé du retard, le métro s'est arrêté.",
        "slot": "le métro s'est arrêté",
        "cue": {
          "en": "the metro stopped",
          "ko": "지하철이 멈췄다"
        },
        "gloss": {
          "en": "Sorry I'm late, the metro stopped.",
          "ko": "늦어서 미안, 지하철이 멈췄어."
        }
      },
      {
        "text": "Désolé du retard, j'ai raté le bus.",
        "slot": "j'ai raté le bus",
        "cue": {
          "en": "I missed the bus",
          "ko": "버스를 놓쳤다"
        },
        "gloss": {
          "en": "Sorry I'm late, I missed the bus.",
          "ko": "늦어서 미안, 버스를 놓쳤어."
        }
      },
      {
        "text": "Désolé du retard, il y avait des bouchons.",
        "slot": "il y avait des bouchons",
        "cue": {
          "en": "there was traffic",
          "ko": "차가 막혔다"
        },
        "gloss": {
          "en": "Sorry I'm late, there was traffic.",
          "ko": "늦어서 미안, 차가 막혔어."
        }
      },
      {
        "text": "Désolé du retard, mon réveil n'a pas sonné.",
        "slot": "mon réveil n'a pas sonné",
        "cue": {
          "en": "my alarm didn't go off",
          "ko": "알람이 안 울렸다"
        },
        "gloss": {
          "en": "Sorry I'm late, my alarm didn't go off.",
          "ko": "늦어서 미안, 알람이 안 울렸어."
        }
      }
    ]
  }
];
