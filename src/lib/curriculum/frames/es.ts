import type { Frame } from "../frames.ts";

/** 스페인어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 다시 고침, 원어민 확인 전. */
export const ES_FRAMES: Frame[] = [
  {
    "id": "es-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Me llamo ___.",
    "core": [
      "Me llamo",
      "me llamo"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "me llamo",
      "mucho gusto"
    ],
    "examples": [
      {
        "text": "Me llamo Ji-woo.",
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
        "text": "Hola, me llamo Daniel. Mucho gusto.",
        "slot": "Daniel",
        "cue": {
          "en": "Daniel",
          "ko": "다니엘"
        },
        "gloss": {
          "en": "Hi, my name is Daniel. Nice to meet you.",
          "ko": "안녕하세요, 저는 다니엘이에요. 반가워요."
        }
      },
      {
        "text": "Me llamo Andrea Park.",
        "slot": "Andrea Park",
        "cue": {
          "en": "Andrea Park (full name)",
          "ko": "안드레아 박(성과 이름)"
        },
        "gloss": {
          "en": "My name is Andrea Park.",
          "ko": "제 이름은 안드레아 박이에요."
        }
      },
      {
        "text": "Me llamo Min-ho. ¿Y tú?",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho",
          "ko": "민호"
        },
        "gloss": {
          "en": "My name is Min-ho. And you?",
          "ko": "저는 민호예요. 당신은요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Soy de ___.",
    "core": [
      "Soy de",
      "soy de"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___ 출신이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "soy de Corea"
    ],
    "examples": [
      {
        "text": "Soy de Corea.",
        "slot": "Corea",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국 사람이에요."
        }
      },
      {
        "text": "Soy de Busan.",
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
        "text": "Soy de Japón, ¿y tú?",
        "slot": "Japón",
        "cue": {
          "en": "Japan",
          "ko": "일본"
        },
        "gloss": {
          "en": "I'm from Japan, and you?",
          "ko": "저는 일본에서 왔어요, 당신은요?"
        }
      },
      {
        "text": "Mi amiga Sofía es de Italia y yo soy de México.",
        "slot": "México",
        "cue": {
          "en": "Mexico",
          "ko": "멕시코"
        },
        "gloss": {
          "en": "My friend Sofía is from Italy and I'm from Mexico.",
          "ko": "제 친구 소피아는 이탈리아, 저는 멕시코 출신이에요."
        }
      }
    ]
  },
  {
    "id": "es-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Soy ___.",
    "core": [
      "Soy",
      "soy"
    ],
    "meaning": {
      "en": "Saying what you are or what you do: I'm a ___ (no article before jobs).",
      "ko": "직업·신분 말하기: 저는 ___예요(직업 앞에는 관사를 안 써요)."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Soy estudiante.",
        "slot": "estudiante",
        "cue": {
          "en": "student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "Trabajo en un hotel. Soy recepcionista.",
        "slot": "recepcionista",
        "cue": {
          "en": "receptionist",
          "ko": "프런트 직원"
        },
        "gloss": {
          "en": "I work in a hotel. I'm a receptionist.",
          "ko": "호텔에서 일해요. 프런트 직원이에요."
        }
      },
      {
        "text": "Soy profesora de inglés.",
        "slot": "profesora",
        "cue": {
          "en": "teacher (woman: profesora)",
          "ko": "선생님(여자: profesora)"
        },
        "gloss": {
          "en": "I'm an English teacher.",
          "ko": "저는 영어 선생님이에요."
        }
      },
      {
        "text": "Soy nuevo en el barrio.",
        "slot": "nuevo",
        "cue": {
          "en": "new (man: nuevo, woman: nueva)",
          "ko": "새로 온(남자 nuevo, 여자 nueva)"
        },
        "gloss": {
          "en": "I'm new in the neighbourhood.",
          "ko": "이 동네에 새로 왔어요."
        }
      }
    ]
  },
  {
    "id": "es-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "Trabajo en ___.",
    "core": [
      "Trabajo en",
      "trabajo en"
    ],
    "meaning": {
      "en": "Saying where you work: I work in/at ___.",
      "ko": "일하는 곳 말하기: ___에서 일해요."
    },
    "grammar": [
      2,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Trabajo en un hotel.",
        "slot": "un hotel",
        "cue": {
          "en": "a hotel (el hotel)",
          "ko": "호텔(el hotel)"
        },
        "gloss": {
          "en": "I work in a hotel.",
          "ko": "호텔에서 일해요."
        }
      },
      {
        "text": "Trabajo en una oficina.",
        "slot": "una oficina",
        "cue": {
          "en": "an office (la oficina)",
          "ko": "사무실(la oficina)"
        },
        "gloss": {
          "en": "I work in an office.",
          "ko": "사무실에서 일해요."
        }
      },
      {
        "text": "Mi hermana trabaja en un hospital y yo trabajo en una escuela.",
        "slot": "una escuela",
        "cue": {
          "en": "a school (la escuela)",
          "ko": "학교(la escuela)"
        },
        "gloss": {
          "en": "My sister works in a hospital and I work at a school.",
          "ko": "언니는 병원에서, 저는 학교에서 일해요."
        }
      },
      {
        "text": "No, trabajo en un restaurante.",
        "slot": "un restaurante",
        "cue": {
          "en": "a restaurant (el restaurante)",
          "ko": "식당(el restaurante)"
        },
        "gloss": {
          "en": "No, I work in a restaurant.",
          "ko": "아니요, 식당에서 일해요."
        }
      }
    ]
  },
  {
    "id": "es-f1-05",
    "stage": 1,
    "fn": "job",
    "pattern": "Estudio ___.",
    "core": [
      "Estudio",
      "estudio"
    ],
    "meaning": {
      "en": "Saying what you study: I study ___.",
      "ko": "공부하는 것 말하기: ___를 공부해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Estudio español.",
        "slot": "español",
        "cue": {
          "en": "Spanish",
          "ko": "스페인어"
        },
        "gloss": {
          "en": "I study Spanish.",
          "ko": "스페인어를 공부해요."
        }
      },
      {
        "text": "Trabajo en una oficina y estudio inglés por la noche.",
        "slot": "inglés",
        "cue": {
          "en": "English",
          "ko": "영어"
        },
        "gloss": {
          "en": "I work in an office and study English at night.",
          "ko": "사무실에서 일하고 밤에 영어를 공부해요."
        }
      },
      {
        "text": "Estudio medicina en Madrid.",
        "slot": "medicina",
        "cue": {
          "en": "medicine",
          "ko": "의학"
        },
        "gloss": {
          "en": "I study medicine in Madrid.",
          "ko": "마드리드에서 의학을 공부해요."
        }
      },
      {
        "text": "Soy estudiante. Estudio música.",
        "slot": "música",
        "cue": {
          "en": "music",
          "ko": "음악"
        },
        "gloss": {
          "en": "I'm a student. I study music.",
          "ko": "저는 학생이에요. 음악을 공부해요."
        }
      }
    ]
  },
  {
    "id": "es-f1-06",
    "stage": 1,
    "fn": "greet",
    "pattern": "Hasta ___.",
    "core": [
      "Hasta",
      "hasta"
    ],
    "meaning": {
      "en": "Saying goodbye: See you ___.",
      "ko": "헤어질 때: ___ 봐요."
    },
    "grammar": [],
    "expressions": [
      "hasta luego",
      "adiós"
    ],
    "examples": [
      {
        "text": "Gracias. ¡Hasta luego!",
        "slot": "luego",
        "cue": {
          "en": "later",
          "ko": "이따가"
        },
        "gloss": {
          "en": "Thanks. See you later!",
          "ko": "고마워요. 이따 봐요!"
        }
      },
      {
        "text": "¡Hasta mañana!",
        "slot": "mañana",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "See you tomorrow!",
          "ko": "내일 봐요!"
        }
      },
      {
        "text": "Adiós, ¡hasta el lunes!",
        "slot": "el lunes",
        "cue": {
          "en": "Monday (el lunes)",
          "ko": "월요일(el lunes)"
        },
        "gloss": {
          "en": "Bye, see you on Monday!",
          "ko": "안녕, 월요일에 봐요!"
        }
      },
      {
        "text": "¡Hasta pronto, Sofía!",
        "slot": "pronto",
        "cue": {
          "en": "soon",
          "ko": "곧"
        },
        "gloss": {
          "en": "See you soon, Sofía!",
          "ko": "곧 또 봐요, 소피아!"
        }
      }
    ]
  },
  {
    "id": "es-f1-07",
    "stage": 1,
    "fn": "thank",
    "pattern": "Gracias por ___.",
    "core": [
      "Gracias por",
      "gracias por"
    ],
    "meaning": {
      "en": "Thanking for something: Thanks for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "gracias",
      "de nada"
    ],
    "examples": [
      {
        "text": "Gracias por la ayuda.",
        "slot": "la ayuda",
        "cue": {
          "en": "the help (la ayuda)",
          "ko": "도움(la ayuda)"
        },
        "gloss": {
          "en": "Thanks for the help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "Muchas gracias por todo.",
        "slot": "todo",
        "cue": {
          "en": "everything",
          "ko": "전부"
        },
        "gloss": {
          "en": "Thank you very much for everything.",
          "ko": "여러 가지로 정말 고마워요."
        }
      },
      {
        "text": "Gracias por el café.",
        "slot": "el café",
        "cue": {
          "en": "the coffee (el café)",
          "ko": "커피(el café)"
        },
        "gloss": {
          "en": "Thanks for the coffee.",
          "ko": "커피 고마워요."
        }
      },
      {
        "text": "Gracias por la información.",
        "slot": "la información",
        "cue": {
          "en": "the information (la información)",
          "ko": "정보(la información)"
        },
        "gloss": {
          "en": "Thanks for the information.",
          "ko": "알려 줘서 고마워요."
        }
      }
    ]
  },
  {
    "id": "es-f1-08",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "¿Cuánto cuesta ___?",
    "core": [
      "Cuánto cuesta",
      "cuánto cuesta"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___? (plural: ¿Cuánto cuestan…?)",
      "ko": "값 묻기: ___ 얼마예요? (여러 개면 ¿Cuánto cuestan…?)"
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [
      "cuánto cuesta"
    ],
    "examples": [
      {
        "text": "¿Cuánto cuesta la noche?",
        "slot": "la noche",
        "cue": {
          "en": "the night (la noche)",
          "ko": "하룻밤(la noche)"
        },
        "gloss": {
          "en": "How much is it per night?",
          "ko": "하룻밤에 얼마예요?"
        }
      },
      {
        "text": "¿Cuánto cuesta este libro?",
        "slot": "este libro",
        "cue": {
          "en": "this book (el libro)",
          "ko": "이 책(el libro)"
        },
        "gloss": {
          "en": "How much is this book?",
          "ko": "이 책 얼마예요?"
        }
      },
      {
        "text": "Perdón, ¿cuánto cuesta una botella de agua?",
        "slot": "una botella de agua",
        "cue": {
          "en": "a bottle of water (la botella)",
          "ko": "물 한 병(la botella)"
        },
        "gloss": {
          "en": "Excuse me, how much is a bottle of water?",
          "ko": "저기요, 물 한 병에 얼마예요?"
        }
      },
      {
        "text": "Buenos días. ¿Cuánto cuestan las manzanas?",
        "slot": "las manzanas",
        "cue": {
          "en": "the apples (plural → cuestan)",
          "ko": "사과들(여러 개 → cuestan)"
        },
        "gloss": {
          "en": "Good morning. How much are the apples?",
          "ko": "안녕하세요. 사과 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-09",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "¿Dónde está ___?",
    "core": [
      "Dónde está",
      "dónde está"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디 있어요?"
    },
    "grammar": [
      3,
      5
    ],
    "expressions": [
      "dónde está el baño",
      "por favor"
    ],
    "examples": [
      {
        "text": "¿Dónde está el metro?",
        "slot": "el metro",
        "cue": {
          "en": "the metro (el metro)",
          "ko": "지하철역(el metro)"
        },
        "gloss": {
          "en": "Where is the metro?",
          "ko": "지하철역이 어디예요?"
        }
      },
      {
        "text": "Perdón, ¿dónde está el baño?",
        "slot": "el baño",
        "cue": {
          "en": "the bathroom (el baño)",
          "ko": "화장실(el baño)"
        },
        "gloss": {
          "en": "Excuse me, where is the bathroom?",
          "ko": "실례지만, 화장실이 어디예요?"
        }
      },
      {
        "text": "¿Dónde está la estación de tren?",
        "slot": "la estación de tren",
        "cue": {
          "en": "the train station (la estación)",
          "ko": "기차역(la estación)"
        },
        "gloss": {
          "en": "Where is the train station?",
          "ko": "기차역이 어디예요?"
        }
      },
      {
        "text": "¿Dónde está la parada del autobús, por favor?",
        "slot": "la parada del autobús",
        "cue": {
          "en": "the bus stop (la parada)",
          "ko": "버스 정류장(la parada)"
        },
        "gloss": {
          "en": "Where is the bus stop, please?",
          "ko": "버스 정류장이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-10",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "¿Hay ___ por aquí?",
    "core": [
      "Hay",
      "hay"
    ],
    "meaning": {
      "en": "Asking if there is one nearby: Is there ___ around here?",
      "ko": "근처에 있는지 묻기: 이 근처에 ___ 있어요?"
    },
    "grammar": [
      6,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "¿Hay un supermercado por aquí?",
        "slot": "un supermercado",
        "cue": {
          "en": "a supermarket (el supermercado)",
          "ko": "슈퍼마켓(el supermercado)"
        },
        "gloss": {
          "en": "Is there a supermarket around here?",
          "ko": "이 근처에 슈퍼마켓 있어요?"
        }
      },
      {
        "text": "Perdón, ¿hay una farmacia por aquí?",
        "slot": "una farmacia",
        "cue": {
          "en": "a pharmacy (la farmacia)",
          "ko": "약국(la farmacia)"
        },
        "gloss": {
          "en": "Excuse me, is there a pharmacy around here?",
          "ko": "실례지만, 이 근처에 약국 있어요?"
        }
      },
      {
        "text": "¿Hay un cajero por aquí?",
        "slot": "un cajero",
        "cue": {
          "en": "an ATM (el cajero)",
          "ko": "현금인출기(el cajero)"
        },
        "gloss": {
          "en": "Is there an ATM around here?",
          "ko": "이 근처에 ATM 있어요?"
        }
      },
      {
        "text": "¿Hay wifi en la habitación?",
        "slot": "wifi",
        "cue": {
          "en": "wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there wifi in the room?",
          "ko": "방에 와이파이 있어요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-11",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "___, por favor.",
    "core": [
      "por favor"
    ],
    "meaning": {
      "en": "Asking for something: ___, please.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "por favor"
    ],
    "examples": [
      {
        "text": "Un kilo de naranjas, por favor.",
        "slot": "Un kilo de naranjas",
        "cue": {
          "en": "a kilo of oranges (la naranja)",
          "ko": "오렌지 1킬로(la naranja)"
        },
        "gloss": {
          "en": "A kilo of oranges, please.",
          "ko": "오렌지 1킬로 주세요."
        }
      },
      {
        "text": "Una botella de agua, por favor.",
        "slot": "Una botella de agua",
        "cue": {
          "en": "a bottle of water (la botella)",
          "ko": "물 한 병(la botella)"
        },
        "gloss": {
          "en": "A bottle of water, please.",
          "ko": "물 한 병 주세요."
        }
      },
      {
        "text": "Un café con leche, por favor.",
        "slot": "Un café con leche",
        "cue": {
          "en": "a coffee with milk (el café)",
          "ko": "카페라테(el café)"
        },
        "gloss": {
          "en": "A coffee with milk, please.",
          "ko": "카페라테 한 잔 주세요."
        }
      },
      {
        "text": "La llave de la habitación, por favor.",
        "slot": "La llave de la habitación",
        "cue": {
          "en": "the room key (la llave)",
          "ko": "방 열쇠(la llave)"
        },
        "gloss": {
          "en": "The room key, please.",
          "ko": "방 열쇠 주세요."
        }
      }
    ]
  },
  {
    "id": "es-f1-12",
    "stage": 1,
    "fn": "want",
    "pattern": "Quiero ___.",
    "core": [
      "Quiero",
      "quiero"
    ],
    "meaning": {
      "en": "Saying what you want: I want / I'd like ___.",
      "ko": "원하는 것 말하기: ___ 주세요/원해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Quiero una manzana.",
        "slot": "una manzana",
        "cue": {
          "en": "an apple (la manzana)",
          "ko": "사과(la manzana)"
        },
        "gloss": {
          "en": "I'd like an apple.",
          "ko": "사과 하나 주세요."
        }
      },
      {
        "text": "Quiero dos naranjas, por favor.",
        "slot": "dos naranjas",
        "cue": {
          "en": "two oranges",
          "ko": "오렌지 두 개"
        },
        "gloss": {
          "en": "I'd like two oranges, please.",
          "ko": "오렌지 두 개 주세요."
        }
      },
      {
        "text": "Quiero una habitación para dos noches.",
        "slot": "una habitación",
        "cue": {
          "en": "a room (la habitación)",
          "ko": "방(la habitación)"
        },
        "gloss": {
          "en": "I'd like a room for two nights.",
          "ko": "이틀 묵을 방을 원해요."
        }
      },
      {
        "text": "Hola, quiero un billete para Toledo.",
        "slot": "un billete",
        "cue": {
          "en": "a ticket (el billete)",
          "ko": "표(el billete)"
        },
        "gloss": {
          "en": "Hi, I'd like a ticket to Toledo.",
          "ko": "안녕하세요, 톨레도행 표 한 장 주세요."
        }
      }
    ]
  },
  {
    "id": "es-f1-13",
    "stage": 1,
    "fn": "have",
    "pattern": "Tengo ___.",
    "core": [
      "Tengo",
      "tengo"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: ___ 있어요."
    },
    "grammar": [
      7,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tengo un hermano y una hermana.",
        "slot": "un hermano y una hermana",
        "cue": {
          "en": "a brother and a sister",
          "ko": "남자 형제 한 명, 여자 형제 한 명"
        },
        "gloss": {
          "en": "I have a brother and a sister.",
          "ko": "남자 형제 하나, 여자 형제 하나 있어요."
        }
      },
      {
        "text": "Sí, tengo una reserva.",
        "slot": "una reserva",
        "cue": {
          "en": "a reservation (la reserva)",
          "ko": "예약(la reserva)"
        },
        "gloss": {
          "en": "Yes, I have a reservation.",
          "ko": "네, 예약했어요."
        }
      },
      {
        "text": "Tengo un perro pequeño.",
        "slot": "un perro pequeño",
        "cue": {
          "en": "a small dog (el perro)",
          "ko": "작은 개(el perro)"
        },
        "gloss": {
          "en": "I have a small dog.",
          "ko": "작은 개를 키워요."
        }
      },
      {
        "text": "No tengo bolígrafo. ¿Tienes uno?",
        "slot": "bolígrafo",
        "cue": {
          "en": "pen (el bolígrafo)",
          "ko": "볼펜(el bolígrafo)"
        },
        "gloss": {
          "en": "I don't have a pen. Do you have one?",
          "ko": "볼펜이 없어요. 하나 있어요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-14",
    "stage": 1,
    "fn": "count",
    "pattern": "Tengo ___ años.",
    "core": [
      "años"
    ],
    "meaning": {
      "en": "Saying age with tener: I'm ___ years old.",
      "ko": "나이 말하기(tener): ___살이에요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tengo veinticinco años.",
        "slot": "veinticinco",
        "cue": {
          "en": "twenty-five",
          "ko": "스물다섯"
        },
        "gloss": {
          "en": "I'm twenty-five.",
          "ko": "스물다섯 살이에요."
        }
      },
      {
        "text": "Tengo treinta años.",
        "slot": "treinta",
        "cue": {
          "en": "thirty",
          "ko": "서른"
        },
        "gloss": {
          "en": "I'm thirty.",
          "ko": "서른 살이에요."
        }
      },
      {
        "text": "Mi hermano tiene doce años.",
        "slot": "doce",
        "cue": {
          "en": "twelve",
          "ko": "열둘"
        },
        "gloss": {
          "en": "My brother is twelve.",
          "ko": "남동생은 열두 살이에요."
        }
      },
      {
        "text": "Se llama Toto y tiene tres años.",
        "slot": "tres",
        "cue": {
          "en": "three",
          "ko": "셋"
        },
        "gloss": {
          "en": "His name is Toto and he's three.",
          "ko": "이름은 토토고 세 살이에요."
        }
      }
    ]
  },
  {
    "id": "es-f1-15",
    "stage": 1,
    "fn": "location-now",
    "pattern": "Estoy en ___.",
    "core": [
      "Estoy en",
      "estoy en"
    ],
    "meaning": {
      "en": "Saying where you are now (estar): I'm at/in ___.",
      "ko": "지금 있는 곳 말하기(estar): ___에 있어요."
    },
    "grammar": [
      5,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Estoy en el hotel.",
        "slot": "el hotel",
        "cue": {
          "en": "the hotel (el hotel)",
          "ko": "호텔(el hotel)"
        },
        "gloss": {
          "en": "I'm at the hotel.",
          "ko": "호텔에 있어요."
        }
      },
      {
        "text": "Ahora estoy en la estación.",
        "slot": "la estación",
        "cue": {
          "en": "the station (la estación)",
          "ko": "역(la estación)"
        },
        "gloss": {
          "en": "I'm at the station now.",
          "ko": "지금 역에 있어요."
        }
      },
      {
        "text": "Estoy en casa.",
        "slot": "casa",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home.",
          "ko": "집에 있어요."
        }
      },
      {
        "text": "Estoy en la plaza, cerca del mercado.",
        "slot": "la plaza",
        "cue": {
          "en": "the square (la plaza)",
          "ko": "광장(la plaza)"
        },
        "gloss": {
          "en": "I'm in the square, near the market.",
          "ko": "시장 근처 광장에 있어요."
        }
      }
    ]
  },
  {
    "id": "es-f1-16",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "¿Qué es ___?",
    "core": [
      "Qué es",
      "qué es"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___ 뭐예요?"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Perdón, ¿qué es esto?",
        "slot": "esto",
        "cue": {
          "en": "this (thing)",
          "ko": "이것"
        },
        "gloss": {
          "en": "Excuse me, what is this?",
          "ko": "저기요, 이거 뭐예요?"
        }
      },
      {
        "text": "¿Qué es una arepa?",
        "slot": "una arepa",
        "cue": {
          "en": "an arepa (la arepa)",
          "ko": "아레파(la arepa)"
        },
        "gloss": {
          "en": "What is an arepa?",
          "ko": "아레파가 뭐예요?"
        }
      },
      {
        "text": "¿Qué es el gazpacho?",
        "slot": "el gazpacho",
        "cue": {
          "en": "gazpacho (el gazpacho)",
          "ko": "가스파초(el gazpacho)"
        },
        "gloss": {
          "en": "What is gazpacho?",
          "ko": "가스파초가 뭐예요?"
        }
      },
      {
        "text": "¿Qué es eso, una fruta?",
        "slot": "eso",
        "cue": {
          "en": "that (thing)",
          "ko": "그것"
        },
        "gloss": {
          "en": "What is that, a fruit?",
          "ko": "그거 뭐예요, 과일이에요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-17",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "No entiendo ___.",
    "core": [
      "No entiendo",
      "no entiendo"
    ],
    "meaning": {
      "en": "Saying you don't understand something: I don't understand ___.",
      "ko": "모르겠다고 말하기: ___ 이해가 안 돼요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "no entiendo",
      "perdón"
    ],
    "examples": [
      {
        "text": "Perdón, no entiendo esta palabra.",
        "slot": "esta palabra",
        "cue": {
          "en": "this word (la palabra)",
          "ko": "이 단어(la palabra)"
        },
        "gloss": {
          "en": "Sorry, I don't understand this word.",
          "ko": "죄송해요, 이 단어를 모르겠어요."
        }
      },
      {
        "text": "No entiendo la pregunta.",
        "slot": "la pregunta",
        "cue": {
          "en": "the question (la pregunta)",
          "ko": "질문(la pregunta)"
        },
        "gloss": {
          "en": "I don't understand the question.",
          "ko": "질문을 이해 못 했어요."
        }
      },
      {
        "text": "No entiendo el mapa.",
        "slot": "el mapa",
        "cue": {
          "en": "the map (el mapa)",
          "ko": "지도(el mapa)"
        },
        "gloss": {
          "en": "I don't understand the map.",
          "ko": "지도를 잘 모르겠어요."
        }
      },
      {
        "text": "Lo siento, no entiendo el menú.",
        "slot": "el menú",
        "cue": {
          "en": "the menu (el menú)",
          "ko": "메뉴(el menú)"
        },
        "gloss": {
          "en": "I'm sorry, I don't understand the menu.",
          "ko": "죄송해요, 메뉴를 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "es-f1-18",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "¿Puede ___, por favor?",
    "core": [
      "Puede",
      "puede"
    ],
    "meaning": {
      "en": "Asking someone to repeat or slow down: Can you ___, please?",
      "ko": "다시·천천히 부탁하기: ___ 주실 수 있어요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "más despacio",
      "otra vez",
      "por favor"
    ],
    "examples": [
      {
        "text": "¿Puede hablar más despacio, por favor?",
        "slot": "hablar más despacio",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하다"
        },
        "gloss": {
          "en": "Can you speak more slowly, please?",
          "ko": "더 천천히 말해 주실 수 있어요?"
        }
      },
      {
        "text": "¿Puede repetir, por favor?",
        "slot": "repetir",
        "cue": {
          "en": "repeat",
          "ko": "다시 말하다"
        },
        "gloss": {
          "en": "Can you repeat that, please?",
          "ko": "다시 한번 말해 주실 수 있어요?"
        }
      },
      {
        "text": "Perdón, ¿puede decirlo otra vez?",
        "slot": "decirlo otra vez",
        "cue": {
          "en": "say it again",
          "ko": "한 번 더 말하다"
        },
        "gloss": {
          "en": "Sorry, can you say it again?",
          "ko": "죄송한데, 한 번 더 말해 주실래요?"
        }
      },
      {
        "text": "¿Puede escribirlo aquí, por favor?",
        "slot": "escribirlo aquí",
        "cue": {
          "en": "write it here",
          "ko": "여기에 써 주다"
        },
        "gloss": {
          "en": "Can you write it here, please?",
          "ko": "여기에 써 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "es-f1-19",
    "stage": 1,
    "fn": "possession",
    "pattern": "Es mi ___.",
    "core": [
      "Es mi",
      "es mi"
    ],
    "meaning": {
      "en": "Saying whose something is: It's my ___ / This is my ___.",
      "ko": "누구 것인지 말하기: 제 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Es mi pasaporte.",
        "slot": "pasaporte",
        "cue": {
          "en": "passport",
          "ko": "여권"
        },
        "gloss": {
          "en": "It's my passport.",
          "ko": "제 여권이에요."
        }
      },
      {
        "text": "Mira, es mi hermana.",
        "slot": "hermana",
        "cue": {
          "en": "sister",
          "ko": "언니·누나·여동생"
        },
        "gloss": {
          "en": "Look, it's my sister.",
          "ko": "봐, 우리 언니야."
        }
      },
      {
        "text": "Perdón, es mi maleta.",
        "slot": "maleta",
        "cue": {
          "en": "suitcase",
          "ko": "여행 가방"
        },
        "gloss": {
          "en": "Excuse me, that's my suitcase.",
          "ko": "죄송한데, 그건 제 가방이에요."
        }
      },
      {
        "text": "Este es mi perro, Toto.",
        "slot": "perro",
        "cue": {
          "en": "dog",
          "ko": "개"
        },
        "gloss": {
          "en": "This is my dog, Toto.",
          "ko": "이 아이가 제 개 토토예요."
        }
      }
    ]
  },
  {
    "id": "es-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Ayer ___.",
    "core": [
      "Ayer",
      "ayer"
    ],
    "meaning": {
      "en": "Saying what you did yesterday (preterite): Yesterday I ___.",
      "ko": "어제 한 일 말하기(단순과거): 어제 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ayer cené con mis amigos.",
        "slot": "cené con mis amigos",
        "cue": {
          "en": "cenar con mis amigos (have dinner with my friends)",
          "ko": "cenar con mis amigos(친구들과 저녁 먹다)"
        },
        "gloss": {
          "en": "Yesterday I had dinner with my friends.",
          "ko": "어제 친구들이랑 저녁 먹었어요."
        }
      },
      {
        "text": "Ayer compré un libro.",
        "slot": "compré un libro",
        "cue": {
          "en": "comprar un libro (buy a book)",
          "ko": "comprar un libro(책을 사다)"
        },
        "gloss": {
          "en": "Yesterday I bought a book.",
          "ko": "어제 책을 샀어요."
        }
      },
      {
        "text": "Ayer trabajé hasta tarde.",
        "slot": "trabajé hasta tarde",
        "cue": {
          "en": "trabajar hasta tarde (work late)",
          "ko": "trabajar hasta tarde(늦게까지 일하다)"
        },
        "gloss": {
          "en": "Yesterday I worked late.",
          "ko": "어제 늦게까지 일했어요."
        }
      },
      {
        "text": "Ayer llamé a mi madre.",
        "slot": "llamé a mi madre",
        "cue": {
          "en": "llamar a mi madre (call my mother)",
          "ko": "llamar a mi madre(엄마에게 전화하다)"
        },
        "gloss": {
          "en": "Yesterday I called my mother.",
          "ko": "어제 엄마한테 전화했어요."
        }
      }
    ]
  },
  {
    "id": "es-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "El sábado fui ___.",
    "core": [
      "fui"
    ],
    "meaning": {
      "en": "Saying where you went: On Saturday I went ___.",
      "ko": "다녀온 곳 말하기: 토요일에 ___ 갔어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "ayer fui"
    ],
    "examples": [
      {
        "text": "El sábado fui a la playa.",
        "slot": "a la playa",
        "cue": {
          "en": "to the beach (la playa)",
          "ko": "해변에(la playa)"
        },
        "gloss": {
          "en": "On Saturday I went to the beach.",
          "ko": "토요일에 바다에 갔어요."
        }
      },
      {
        "text": "Ayer fui al cine.",
        "slot": "al cine",
        "cue": {
          "en": "to the cinema (a + el = al)",
          "ko": "영화관에(a + el = al)"
        },
        "gloss": {
          "en": "Yesterday I went to the cinema.",
          "ko": "어제 영화관에 갔어요."
        }
      },
      {
        "text": "El domingo fui a casa de mis padres.",
        "slot": "a casa de mis padres",
        "cue": {
          "en": "to my parents' place",
          "ko": "부모님 댁에"
        },
        "gloss": {
          "en": "On Sunday I went to my parents' place.",
          "ko": "일요일에 부모님 댁에 갔어요."
        }
      },
      {
        "text": "El sábado fui al mercado con Marta.",
        "slot": "al mercado",
        "cue": {
          "en": "to the market (el mercado)",
          "ko": "시장에(el mercado)"
        },
        "gloss": {
          "en": "On Saturday I went to the market with Marta.",
          "ko": "토요일에 마르타랑 시장에 갔어요."
        }
      }
    ]
  },
  {
    "id": "es-f2-03",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Tuve ___.",
    "core": [
      "Tuve",
      "tuve"
    ],
    "meaning": {
      "en": "Saying what you had (tener → tuve): I had ___.",
      "ko": "있었던 것 말하기(tener → tuve): ___이 있었어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "tengo fiebre"
    ],
    "examples": [
      {
        "text": "Ayer tuve fiebre.",
        "slot": "fiebre",
        "cue": {
          "en": "a fever (la fiebre)",
          "ko": "열(la fiebre)"
        },
        "gloss": {
          "en": "Yesterday I had a fever.",
          "ko": "어제 열이 났어요."
        }
      },
      {
        "text": "Tuve mucho trabajo esta semana.",
        "slot": "mucho trabajo",
        "cue": {
          "en": "a lot of work",
          "ko": "일이 많음"
        },
        "gloss": {
          "en": "I had a lot of work this week.",
          "ko": "이번 주에 일이 많았어요."
        }
      },
      {
        "text": "Esta mañana tuve una reunión.",
        "slot": "una reunión",
        "cue": {
          "en": "a meeting (la reunión)",
          "ko": "회의(la reunión)"
        },
        "gloss": {
          "en": "This morning I had a meeting.",
          "ko": "오늘 아침에 회의가 있었어요."
        }
      },
      {
        "text": "El lunes tuve un examen difícil.",
        "slot": "un examen difícil",
        "cue": {
          "en": "a hard exam (el examen)",
          "ko": "어려운 시험(el examen)"
        },
        "gloss": {
          "en": "On Monday I had a hard exam.",
          "ko": "월요일에 어려운 시험을 봤어요."
        }
      }
    ]
  },
  {
    "id": "es-f2-04",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Voy a ___.",
    "core": [
      "Voy a",
      "voy a"
    ],
    "meaning": {
      "en": "Saying what you're going to do: I'm going to ___.",
      "ko": "할 일 말하기: ___할 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "voy a",
      "este fin de semana"
    ],
    "examples": [
      {
        "text": "Mañana voy a visitar a mi abuela.",
        "slot": "visitar a mi abuela",
        "cue": {
          "en": "visit my grandmother",
          "ko": "할머니를 뵈러 가다"
        },
        "gloss": {
          "en": "Tomorrow I'm going to visit my grandmother.",
          "ko": "내일 할머니 뵈러 갈 거예요."
        }
      },
      {
        "text": "Este fin de semana voy a descansar.",
        "slot": "descansar",
        "cue": {
          "en": "rest",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "This weekend I'm going to rest.",
          "ko": "이번 주말에는 쉴 거예요."
        }
      },
      {
        "text": "Esta noche voy a cocinar en casa.",
        "slot": "cocinar en casa",
        "cue": {
          "en": "cook at home",
          "ko": "집에서 요리하다"
        },
        "gloss": {
          "en": "Tonight I'm going to cook at home.",
          "ko": "오늘 밤엔 집에서 요리할 거예요."
        }
      },
      {
        "text": "Voy a ver una película con Javi.",
        "slot": "ver una película",
        "cue": {
          "en": "watch a film",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "I'm going to watch a film with Javi.",
          "ko": "하비랑 영화 볼 거예요."
        }
      }
    ]
  },
  {
    "id": "es-f2-05",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "¿Vas a ___?",
    "core": [
      "Vas a",
      "vas a"
    ],
    "meaning": {
      "en": "Asking about someone's plans: Are you going to ___?",
      "ko": "상대 계획 묻기: ___할 거야?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "este fin de semana"
    ],
    "examples": [
      {
        "text": "¿Y este fin de semana vas a descansar?",
        "slot": "descansar",
        "cue": {
          "en": "rest",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "And are you going to rest this weekend?",
          "ko": "그럼 이번 주말엔 쉴 거야?"
        }
      },
      {
        "text": "¿Vas a venir a la fiesta?",
        "slot": "venir a la fiesta",
        "cue": {
          "en": "come to the party",
          "ko": "파티에 오다"
        },
        "gloss": {
          "en": "Are you going to come to the party?",
          "ko": "파티에 올 거야?"
        }
      },
      {
        "text": "¿Vas a trabajar el sábado?",
        "slot": "trabajar el sábado",
        "cue": {
          "en": "work on Saturday",
          "ko": "토요일에 일하다"
        },
        "gloss": {
          "en": "Are you going to work on Saturday?",
          "ko": "토요일에 일할 거야?"
        }
      },
      {
        "text": "¿Vas a comprar los billetes hoy?",
        "slot": "comprar los billetes",
        "cue": {
          "en": "buy the tickets",
          "ko": "표를 사다"
        },
        "gloss": {
          "en": "Are you going to buy the tickets today?",
          "ko": "오늘 표 살 거야?"
        }
      }
    ]
  },
  {
    "id": "es-f2-06",
    "stage": 2,
    "fn": "like",
    "pattern": "Me gusta mucho ___.",
    "core": [
      "Me gusta",
      "me gusta"
    ],
    "meaning": {
      "en": "Saying what you like (gusta + singular / gustan + plural): I really like ___.",
      "ko": "좋아하는 것 말하기(하나면 gusta, 여럿이면 gustan): ___가 정말 좋아요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "me gusta mucho"
    ],
    "examples": [
      {
        "text": "Me gusta mucho la música en vivo.",
        "slot": "la música en vivo",
        "cue": {
          "en": "live music (la música)",
          "ko": "라이브 음악(la música)"
        },
        "gloss": {
          "en": "I really like live music.",
          "ko": "라이브 음악을 정말 좋아해요."
        }
      },
      {
        "text": "Me gusta mucho cocinar.",
        "slot": "cocinar",
        "cue": {
          "en": "to cook",
          "ko": "요리하다"
        },
        "gloss": {
          "en": "I really like cooking.",
          "ko": "요리하는 걸 정말 좋아해요."
        }
      },
      {
        "text": "Me gustan mucho las películas de miedo.",
        "slot": "las películas de miedo",
        "cue": {
          "en": "horror films (plural → gustan)",
          "ko": "공포 영화(여럿 → gustan)"
        },
        "gloss": {
          "en": "I really like horror films.",
          "ko": "공포 영화를 정말 좋아해요."
        }
      },
      {
        "text": "Me gusta mucho este barrio.",
        "slot": "este barrio",
        "cue": {
          "en": "this neighbourhood (el barrio)",
          "ko": "이 동네(el barrio)"
        },
        "gloss": {
          "en": "I really like this neighbourhood.",
          "ko": "이 동네가 정말 좋아요."
        }
      }
    ]
  },
  {
    "id": "es-f2-07",
    "stage": 2,
    "fn": "dislike",
    "pattern": "No me gusta ___.",
    "core": [
      "No me gusta",
      "no me gusta"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: ___ 별로 안 좋아해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "no me gusta"
    ],
    "examples": [
      {
        "text": "No me gusta mucho el picante.",
        "slot": "el picante",
        "cue": {
          "en": "spicy food (el picante)",
          "ko": "매운 음식(el picante)"
        },
        "gloss": {
          "en": "I don't like spicy food much.",
          "ko": "매운 건 별로 안 좋아해요."
        }
      },
      {
        "text": "No me gusta madrugar.",
        "slot": "madrugar",
        "cue": {
          "en": "to get up early",
          "ko": "일찍 일어나다"
        },
        "gloss": {
          "en": "I don't like getting up early.",
          "ko": "일찍 일어나는 건 싫어요."
        }
      },
      {
        "text": "No me gustan los lunes.",
        "slot": "los lunes",
        "cue": {
          "en": "Mondays (plural → gustan)",
          "ko": "월요일(여럿 → gustan)"
        },
        "gloss": {
          "en": "I don't like Mondays.",
          "ko": "월요일은 싫어요."
        }
      },
      {
        "text": "Lo siento, no me gusta el café.",
        "slot": "el café",
        "cue": {
          "en": "coffee (el café)",
          "ko": "커피(el café)"
        },
        "gloss": {
          "en": "Sorry, I don't like coffee.",
          "ko": "미안해요, 커피는 안 좋아해요."
        }
      }
    ]
  },
  {
    "id": "es-f2-08",
    "stage": 2,
    "fn": "like",
    "pattern": "Me encanta ___.",
    "core": [
      "Me encanta",
      "me encanta"
    ],
    "meaning": {
      "en": "Saying you love something: I love ___.",
      "ko": "아주 좋아한다고 말하기: ___ 너무 좋아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Me encanta viajar.",
        "slot": "viajar",
        "cue": {
          "en": "to travel",
          "ko": "여행하다"
        },
        "gloss": {
          "en": "I love travelling.",
          "ko": "여행하는 걸 정말 좋아해요."
        }
      },
      {
        "text": "Me encanta la comida mexicana.",
        "slot": "la comida mexicana",
        "cue": {
          "en": "Mexican food (la comida)",
          "ko": "멕시코 음식(la comida)"
        },
        "gloss": {
          "en": "I love Mexican food.",
          "ko": "멕시코 음식을 정말 좋아해요."
        }
      },
      {
        "text": "Me encantan los perros.",
        "slot": "los perros",
        "cue": {
          "en": "dogs (plural → encantan)",
          "ko": "개(여럿 → encantan)"
        },
        "gloss": {
          "en": "I love dogs.",
          "ko": "개를 정말 좋아해요."
        }
      },
      {
        "text": "¡Me encanta esta canción!",
        "slot": "esta canción",
        "cue": {
          "en": "this song (la canción)",
          "ko": "이 노래(la canción)"
        },
        "gloss": {
          "en": "I love this song!",
          "ko": "이 노래 너무 좋아요!"
        }
      }
    ]
  },
  {
    "id": "es-f2-09",
    "stage": 2,
    "fn": "like",
    "pattern": "Prefiero ___.",
    "core": [
      "Prefiero",
      "prefiero"
    ],
    "meaning": {
      "en": "Saying what you prefer: I prefer ___.",
      "ko": "더 좋은 것 말하기: ___가 더 좋아요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "depende"
    ],
    "examples": [
      {
        "text": "Prefiero el pescado.",
        "slot": "el pescado",
        "cue": {
          "en": "the fish (el pescado)",
          "ko": "생선(el pescado)"
        },
        "gloss": {
          "en": "I prefer the fish.",
          "ko": "생선이 더 좋아요."
        }
      },
      {
        "text": "Prefiero agua sin gas, gracias.",
        "slot": "agua sin gas",
        "cue": {
          "en": "still water",
          "ko": "탄산 없는 물"
        },
        "gloss": {
          "en": "I prefer still water, thanks.",
          "ko": "탄산 없는 물로 할게요, 고마워요."
        }
      },
      {
        "text": "Depende. Prefiero quedar por la tarde.",
        "slot": "quedar por la tarde",
        "cue": {
          "en": "meet in the afternoon",
          "ko": "오후에 만나다"
        },
        "gloss": {
          "en": "It depends. I'd rather meet in the afternoon.",
          "ko": "상황에 따라요. 오후에 만나는 게 더 좋아요."
        }
      },
      {
        "text": "Prefiero ir en metro.",
        "slot": "ir en metro",
        "cue": {
          "en": "go by metro",
          "ko": "지하철로 가다"
        },
        "gloss": {
          "en": "I prefer to go by metro.",
          "ko": "지하철로 가는 게 더 좋아요."
        }
      }
    ]
  },
  {
    "id": "es-f2-10",
    "stage": 2,
    "fn": "invite",
    "pattern": "¿Quieres ___?",
    "core": [
      "Quieres",
      "quieres"
    ],
    "meaning": {
      "en": "Inviting someone: Do you want to ___?",
      "ko": "같이 하자고 하기: ___할래?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "quieres venir",
      "qué buena idea",
      "claro que sí"
    ],
    "examples": [
      {
        "text": "¿Quieres venir al concierto conmigo?",
        "slot": "venir al concierto",
        "cue": {
          "en": "come to the concert",
          "ko": "콘서트에 오다"
        },
        "gloss": {
          "en": "Do you want to come to the concert with me?",
          "ko": "나랑 콘서트 갈래?"
        }
      },
      {
        "text": "¿Quieres tomar un café?",
        "slot": "tomar un café",
        "cue": {
          "en": "have a coffee",
          "ko": "커피 마시다"
        },
        "gloss": {
          "en": "Do you want to have a coffee?",
          "ko": "커피 한잔할래?"
        }
      },
      {
        "text": "¿Quieres cenar en mi casa el viernes?",
        "slot": "cenar en mi casa",
        "cue": {
          "en": "have dinner at my place",
          "ko": "우리 집에서 저녁 먹다"
        },
        "gloss": {
          "en": "Do you want to have dinner at my place on Friday?",
          "ko": "금요일에 우리 집에서 저녁 먹을래?"
        }
      },
      {
        "text": "Esta noche hay una comedia. ¿Quieres ir al cine?",
        "slot": "ir al cine",
        "cue": {
          "en": "go to the cinema",
          "ko": "영화 보러 가다"
        },
        "gloss": {
          "en": "There's a comedy tonight. Do you want to go to the cinema?",
          "ko": "오늘 밤에 코미디 영화 하는데, 영화 보러 갈래?"
        }
      }
    ]
  },
  {
    "id": "es-f2-11",
    "stage": 2,
    "fn": "permission",
    "pattern": "¿Puedo ___?",
    "core": [
      "Puedo",
      "puedo"
    ],
    "meaning": {
      "en": "Asking permission: Can I ___?",
      "ko": "허락 구하기: ___해도 돼요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "se puede"
    ],
    "examples": [
      {
        "text": "¿Puedo invitar a Marta también?",
        "slot": "invitar a Marta",
        "cue": {
          "en": "invite Marta",
          "ko": "마르타를 부르다"
        },
        "gloss": {
          "en": "Can I invite Marta too?",
          "ko": "마르타도 불러도 돼?"
        }
      },
      {
        "text": "¿Puedo pagar con tarjeta?",
        "slot": "pagar con tarjeta",
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
        "text": "Perdón, ¿puedo sentarme aquí?",
        "slot": "sentarme aquí",
        "cue": {
          "en": "sit here (sentarse)",
          "ko": "여기 앉다(sentarse)"
        },
        "gloss": {
          "en": "Excuse me, can I sit here?",
          "ko": "실례지만, 여기 앉아도 돼요?"
        }
      },
      {
        "text": "¿Puedo abrir la ventana?",
        "slot": "abrir la ventana",
        "cue": {
          "en": "open the window",
          "ko": "창문을 열다"
        },
        "gloss": {
          "en": "Can I open the window?",
          "ko": "창문 열어도 돼요?"
        }
      }
    ]
  },
  {
    "id": "es-f2-12",
    "stage": 2,
    "fn": "request-action",
    "pattern": "¿Puedes ___?",
    "core": [
      "Puedes",
      "puedes"
    ],
    "meaning": {
      "en": "Asking a friend to do something: Can you ___?",
      "ko": "친구에게 부탁하기: ___해 줄 수 있어?"
    },
    "grammar": [
      4,
      7
    ],
    "expressions": [
      "un momento"
    ],
    "examples": [
      {
        "text": "¿Puedes venir a las ocho?",
        "slot": "venir a las ocho",
        "cue": {
          "en": "come at eight",
          "ko": "여덟 시에 오다"
        },
        "gloss": {
          "en": "Can you come at eight?",
          "ko": "여덟 시에 올 수 있어?"
        }
      },
      {
        "text": "¿Puedes ayudarme un momento?",
        "slot": "ayudarme",
        "cue": {
          "en": "help me",
          "ko": "나를 도와주다"
        },
        "gloss": {
          "en": "Can you help me for a moment?",
          "ko": "잠깐 나 좀 도와줄래?"
        }
      },
      {
        "text": "¿Puedes mandarme la dirección?",
        "slot": "mandarme la dirección",
        "cue": {
          "en": "send me the address",
          "ko": "나에게 주소를 보내다"
        },
        "gloss": {
          "en": "Can you send me the address?",
          "ko": "주소 보내 줄래?"
        }
      },
      {
        "text": "¿El libro? ¿Puedes traerlo mañana?",
        "slot": "traerlo",
        "cue": {
          "en": "bring it (el libro → lo)",
          "ko": "그것을 가져오다(el libro → lo)"
        },
        "gloss": {
          "en": "The book? Can you bring it tomorrow?",
          "ko": "그 책? 내일 가져올 수 있어?"
        }
      }
    ]
  },
  {
    "id": "es-f2-13",
    "stage": 2,
    "fn": "must",
    "pattern": "Tengo que ___.",
    "core": [
      "Tengo que",
      "tengo que"
    ],
    "meaning": {
      "en": "Saying what you have to do: I have to ___.",
      "ko": "해야 하는 일 말하기: ___해야 해요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "tengo que"
    ],
    "examples": [
      {
        "text": "El sábado por la mañana tengo que trabajar.",
        "slot": "trabajar",
        "cue": {
          "en": "work",
          "ko": "일하다"
        },
        "gloss": {
          "en": "On Saturday morning I have to work.",
          "ko": "토요일 오전에는 일해야 해요."
        }
      },
      {
        "text": "Lo siento, tengo que irme.",
        "slot": "irme",
        "cue": {
          "en": "leave (irse)",
          "ko": "가 보다(irse)"
        },
        "gloss": {
          "en": "Sorry, I have to go.",
          "ko": "미안해요, 이제 가 봐야 해요."
        }
      },
      {
        "text": "Hoy tengo que estudiar para un examen.",
        "slot": "estudiar para un examen",
        "cue": {
          "en": "study for an exam",
          "ko": "시험 공부하다"
        },
        "gloss": {
          "en": "Today I have to study for an exam.",
          "ko": "오늘은 시험 공부를 해야 해요."
        }
      },
      {
        "text": "Mañana tengo que ir al médico.",
        "slot": "ir al médico",
        "cue": {
          "en": "go to the doctor",
          "ko": "병원에 가다"
        },
        "gloss": {
          "en": "Tomorrow I have to go to the doctor.",
          "ko": "내일 병원에 가야 해요."
        }
      }
    ]
  },
  {
    "id": "es-f2-14",
    "stage": 2,
    "fn": "symptom",
    "pattern": "Me duele ___.",
    "core": [
      "Me duele",
      "me duele"
    ],
    "meaning": {
      "en": "Saying what hurts (duele + singular / duelen + plural): My ___ hurts.",
      "ko": "아픈 곳 말하기(하나면 duele, 여럿이면 duelen): ___가 아파요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "me duele la cabeza",
      "tengo fiebre"
    ],
    "examples": [
      {
        "text": "Me duele la cabeza.",
        "slot": "la cabeza",
        "cue": {
          "en": "head (la cabeza)",
          "ko": "머리(la cabeza)"
        },
        "gloss": {
          "en": "I have a headache.",
          "ko": "머리가 아파요."
        }
      },
      {
        "text": "Me duele la garganta y tengo tos.",
        "slot": "la garganta",
        "cue": {
          "en": "throat (la garganta)",
          "ko": "목(la garganta)"
        },
        "gloss": {
          "en": "I have a sore throat and a cough.",
          "ko": "목이 아프고 기침이 나요."
        }
      },
      {
        "text": "Me duele el estómago desde ayer.",
        "slot": "el estómago",
        "cue": {
          "en": "stomach (el estómago)",
          "ko": "배(el estómago)"
        },
        "gloss": {
          "en": "My stomach has hurt since yesterday.",
          "ko": "어제부터 배가 아파요."
        }
      },
      {
        "text": "Me duelen los pies.",
        "slot": "los pies",
        "cue": {
          "en": "feet (plural → duelen)",
          "ko": "발(여럿 → duelen)"
        },
        "gloss": {
          "en": "My feet hurt.",
          "ko": "발이 아파요."
        }
      }
    ]
  },
  {
    "id": "es-f2-15",
    "stage": 2,
    "fn": "order",
    "pattern": "Para mí, ___, por favor.",
    "core": [
      "Para mí",
      "para mí"
    ],
    "meaning": {
      "en": "Ordering for yourself: For me, ___, please.",
      "ko": "주문하기: 저는 ___로 주세요."
    },
    "grammar": [],
    "expressions": [
      "para mí",
      "la cuenta"
    ],
    "examples": [
      {
        "text": "Para mí, la sopa y el pescado, por favor.",
        "slot": "la sopa y el pescado",
        "cue": {
          "en": "the soup and the fish",
          "ko": "수프와 생선"
        },
        "gloss": {
          "en": "For me, the soup and the fish, please.",
          "ko": "저는 수프랑 생선으로 주세요."
        }
      },
      {
        "text": "Para mí, un café solo, por favor.",
        "slot": "un café solo",
        "cue": {
          "en": "a black coffee",
          "ko": "블랙커피"
        },
        "gloss": {
          "en": "For me, a black coffee, please.",
          "ko": "저는 블랙커피 주세요."
        }
      },
      {
        "text": "Para mí, la ensalada, por favor.",
        "slot": "la ensalada",
        "cue": {
          "en": "the salad (la ensalada)",
          "ko": "샐러드(la ensalada)"
        },
        "gloss": {
          "en": "For me, the salad, please.",
          "ko": "저는 샐러드 주세요."
        }
      },
      {
        "text": "Para mí, el menú del día, por favor.",
        "slot": "el menú del día",
        "cue": {
          "en": "the set menu of the day",
          "ko": "오늘의 메뉴"
        },
        "gloss": {
          "en": "For me, the set menu, please.",
          "ko": "저는 오늘의 메뉴로 주세요."
        }
      }
    ]
  },
  {
    "id": "es-f2-16",
    "stage": 2,
    "fn": "order",
    "pattern": "¿___? Lo quiero sin cebolla.",
    "core": [
      "quiero sin"
    ],
    "meaning": {
      "en": "Ordering without something, using lo/la/los/las for the dish: The ___? I want it without …",
      "ko": "빼 달라고 주문하기(음식을 lo/la/los/las로 받기): ___요? … 빼고 주세요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "¿La sopa? La quiero sin cebolla.",
        "slot": "La sopa",
        "cue": {
          "en": "the soup (la → La quiero)",
          "ko": "수프(la → La quiero)"
        },
        "gloss": {
          "en": "The soup? I want it without onion.",
          "ko": "수프요? 양파 빼고 주세요."
        }
      },
      {
        "text": "¿El bocadillo? Lo quiero sin tomate.",
        "slot": "El bocadillo",
        "cue": {
          "en": "the sandwich (el → Lo quiero)",
          "ko": "샌드위치(el → Lo quiero)"
        },
        "gloss": {
          "en": "The sandwich? I want it without tomato.",
          "ko": "샌드위치요? 토마토 빼고 주세요."
        }
      },
      {
        "text": "¿Las patatas? Las quiero sin sal.",
        "slot": "Las patatas",
        "cue": {
          "en": "the potatoes (las → Las quiero)",
          "ko": "감자(las → Las quiero)"
        },
        "gloss": {
          "en": "The potatoes? I want them without salt.",
          "ko": "감자요? 소금 빼고 주세요."
        }
      },
      {
        "text": "¿Los tacos? Los quiero sin picante.",
        "slot": "Los tacos",
        "cue": {
          "en": "the tacos (los → Los quiero)",
          "ko": "타코(los → Los quiero)"
        },
        "gloss": {
          "en": "The tacos? I want them without hot sauce.",
          "ko": "타코요? 맵지 않게 주세요."
        }
      }
    ]
  },
  {
    "id": "es-f2-17",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "¿Qué ___ me recomienda?",
    "core": [
      "me recomienda"
    ],
    "meaning": {
      "en": "Asking for a recommendation: Which ___ do you recommend?",
      "ko": "추천해 달라고 하기: 어떤 ___ 추천해 주세요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "qué me recomienda"
    ],
    "examples": [
      {
        "text": "¿Qué vino me recomienda?",
        "slot": "vino",
        "cue": {
          "en": "wine",
          "ko": "와인"
        },
        "gloss": {
          "en": "Which wine do you recommend?",
          "ko": "어떤 와인을 추천하세요?"
        }
      },
      {
        "text": "¿Qué postre me recomienda?",
        "slot": "postre",
        "cue": {
          "en": "dessert",
          "ko": "디저트"
        },
        "gloss": {
          "en": "Which dessert do you recommend?",
          "ko": "어떤 디저트를 추천하세요?"
        }
      },
      {
        "text": "Todavía no sé. ¿Qué plato me recomienda?",
        "slot": "plato",
        "cue": {
          "en": "dish",
          "ko": "요리"
        },
        "gloss": {
          "en": "I don't know yet. Which dish do you recommend?",
          "ko": "아직 모르겠어요. 어떤 요리를 추천하세요?"
        }
      },
      {
        "text": "¿Qué película me recomiendas?",
        "slot": "película",
        "cue": {
          "en": "film (to a friend: recomiendas)",
          "ko": "영화(친구에게는 recomiendas)"
        },
        "gloss": {
          "en": "Which film do you recommend?",
          "ko": "어떤 영화 추천해 줄래?"
        }
      }
    ]
  },
  {
    "id": "es-f2-18",
    "stage": 2,
    "fn": "feel",
    "pattern": "Estoy ___.",
    "core": [
      "Estoy",
      "estoy"
    ],
    "meaning": {
      "en": "Saying how you feel (estar + adjective that agrees): I'm ___.",
      "ko": "기분·몸 상태 말하기(estar + 성에 맞춘 형용사): ___해요."
    },
    "grammar": [],
    "expressions": [
      "estoy cansado"
    ],
    "examples": [
      {
        "text": "Hoy estoy muy cansado.",
        "slot": "cansado",
        "cue": {
          "en": "tired (man: cansado, woman: cansada)",
          "ko": "피곤한(남자 cansado, 여자 cansada)"
        },
        "gloss": {
          "en": "I'm very tired today.",
          "ko": "오늘 너무 피곤해요."
        }
      },
      {
        "text": "Estoy un poco enferma.",
        "slot": "enferma",
        "cue": {
          "en": "ill (woman: enferma)",
          "ko": "아픈(여자 enferma)"
        },
        "gloss": {
          "en": "I'm a bit ill.",
          "ko": "몸이 좀 안 좋아요."
        }
      },
      {
        "text": "¡Estoy muy contento!",
        "slot": "contento",
        "cue": {
          "en": "happy (man: contento)",
          "ko": "기쁜(남자 contento)"
        },
        "gloss": {
          "en": "I'm really happy!",
          "ko": "정말 기뻐요!"
        }
      },
      {
        "text": "Mañana tengo un examen y estoy nerviosa.",
        "slot": "nerviosa",
        "cue": {
          "en": "nervous (woman: nerviosa)",
          "ko": "긴장한(여자 nerviosa)"
        },
        "gloss": {
          "en": "I have an exam tomorrow and I'm nervous.",
          "ko": "내일 시험이 있어서 긴장돼요."
        }
      }
    ]
  },
  {
    "id": "es-f2-19",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Nos vemos ___.",
    "core": [
      "Nos vemos",
      "nos vemos"
    ],
    "meaning": {
      "en": "Setting when or where to meet: See you ___ / Let's meet ___.",
      "ko": "시간·장소 정하기: ___에 봐요/만나요."
    },
    "grammar": [],
    "expressions": [
      "nos vemos",
      "me viene bien",
      "a qué hora"
    ],
    "examples": [
      {
        "text": "Genial. Nos vemos el sábado.",
        "slot": "el sábado",
        "cue": {
          "en": "on Saturday",
          "ko": "토요일에"
        },
        "gloss": {
          "en": "Great. See you on Saturday.",
          "ko": "좋아. 토요일에 봐."
        }
      },
      {
        "text": "Nos vemos a las ocho.",
        "slot": "a las ocho",
        "cue": {
          "en": "at eight",
          "ko": "여덟 시에"
        },
        "gloss": {
          "en": "Let's meet at eight.",
          "ko": "여덟 시에 만나."
        }
      },
      {
        "text": "Me viene bien. Nos vemos en la entrada del cine.",
        "slot": "en la entrada del cine",
        "cue": {
          "en": "at the cinema entrance",
          "ko": "영화관 입구에서"
        },
        "gloss": {
          "en": "That works for me. Let's meet at the cinema entrance.",
          "ko": "좋아. 영화관 입구에서 만나."
        }
      },
      {
        "text": "¡Nos vemos mañana!",
        "slot": "mañana",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "See you tomorrow!",
          "ko": "내일 봐!"
        }
      }
    ]
  },
  {
    "id": "es-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Creo que ___.",
    "core": [
      "Creo que",
      "creo que"
    ],
    "meaning": {
      "en": "Giving your opinion: I think (that) ___.",
      "ko": "내 생각 말하기: ___인 것 같아요/라고 생각해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "creo que"
    ],
    "examples": [
      {
        "text": "Creo que es una buena serie.",
        "slot": "es una buena serie",
        "cue": {
          "en": "it's a good series",
          "ko": "좋은 드라마다"
        },
        "gloss": {
          "en": "I think it's a good series.",
          "ko": "좋은 드라마라고 생각해요."
        }
      },
      {
        "text": "Creo que tienes razón.",
        "slot": "tienes razón",
        "cue": {
          "en": "you're right (tener razón)",
          "ko": "네 말이 맞다(tener razón)"
        },
        "gloss": {
          "en": "I think you're right.",
          "ko": "네 말이 맞는 것 같아."
        }
      },
      {
        "text": "Creo que aquí podría crecer mucho.",
        "slot": "aquí podría crecer mucho",
        "cue": {
          "en": "I could grow a lot here",
          "ko": "여기서 많이 성장할 수 있다"
        },
        "gloss": {
          "en": "I think I could grow a lot here.",
          "ko": "여기서 많이 성장할 수 있을 것 같아요."
        }
      },
      {
        "text": "Creo que esconde algo.",
        "slot": "esconde algo",
        "cue": {
          "en": "she's hiding something (esconder)",
          "ko": "뭔가 숨기고 있다(esconder)"
        },
        "gloss": {
          "en": "I think she's hiding something.",
          "ko": "뭔가 숨기고 있는 것 같아."
        }
      }
    ]
  },
  {
    "id": "es-f3-02",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "No creo que ___.",
    "core": [
      "No creo que",
      "no creo que"
    ],
    "meaning": {
      "en": "Doubting gently (+ subjunctive): I don't think ___.",
      "ko": "부드럽게 반대하기(+ 접속법): ___ 것 같지 않아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "No creo que sea tan buena como parece.",
        "slot": "sea tan buena como parece",
        "cue": {
          "en": "she is as good as she seems (ser → sea)",
          "ko": "보이는 만큼 착하다(ser → sea)"
        },
        "gloss": {
          "en": "I don't think she's as good as she seems.",
          "ko": "보이는 것만큼 좋은 사람은 아닌 것 같아."
        }
      },
      {
        "text": "No creo que tenga final feliz.",
        "slot": "tenga final feliz",
        "cue": {
          "en": "it has a happy ending (tener → tenga)",
          "ko": "해피엔딩이다(tener → tenga)"
        },
        "gloss": {
          "en": "I don't think it has a happy ending.",
          "ko": "해피엔딩은 아닐 것 같아."
        }
      },
      {
        "text": "No creo que lleguemos a tiempo.",
        "slot": "lleguemos a tiempo",
        "cue": {
          "en": "we arrive on time (llegar → lleguemos)",
          "ko": "제시간에 도착하다(llegar → lleguemos)"
        },
        "gloss": {
          "en": "I don't think we'll get there on time.",
          "ko": "제시간에 도착하긴 어려울 것 같아."
        }
      },
      {
        "text": "No creo que llueva mañana.",
        "slot": "llueva mañana",
        "cue": {
          "en": "it rains tomorrow (llover → llueva)",
          "ko": "내일 비가 오다(llover → llueva)"
        },
        "gloss": {
          "en": "I don't think it'll rain tomorrow.",
          "ko": "내일 비는 안 올 것 같아."
        }
      }
    ]
  },
  {
    "id": "es-f3-03",
    "stage": 3,
    "fn": "opinion",
    "pattern": "En mi opinión, ___.",
    "core": [
      "En mi opinión",
      "en mi opinión"
    ],
    "meaning": {
      "en": "Stating your view: In my opinion, ___.",
      "ko": "내 생각 밝히기: 제 생각에는 ___."
    },
    "grammar": [],
    "expressions": [
      "en mi opinión",
      "sin embargo"
    ],
    "examples": [
      {
        "text": "En mi opinión, está muy bien escrita.",
        "slot": "está muy bien escrita",
        "cue": {
          "en": "it's very well written (la serie → escrita)",
          "ko": "아주 잘 쓰였다(la serie → escrita)"
        },
        "gloss": {
          "en": "In my opinion, it's very well written.",
          "ko": "제 생각엔 아주 잘 쓴 작품이에요."
        }
      },
      {
        "text": "En mi opinión, el libro es mejor.",
        "slot": "el libro es mejor",
        "cue": {
          "en": "the book is better",
          "ko": "책이 더 낫다"
        },
        "gloss": {
          "en": "In my opinion, the book is better.",
          "ko": "제 생각엔 책이 더 나아요."
        }
      },
      {
        "text": "En mi opinión, trabajar en equipo es lo más importante.",
        "slot": "trabajar en equipo es lo más importante",
        "cue": {
          "en": "teamwork is the most important thing",
          "ko": "팀으로 일하는 게 가장 중요하다"
        },
        "gloss": {
          "en": "In my opinion, teamwork is the most important thing.",
          "ko": "제 생각엔 팀워크가 가장 중요해요."
        }
      },
      {
        "text": "En mi opinión, el final fue demasiado rápido.",
        "slot": "el final fue demasiado rápido",
        "cue": {
          "en": "the ending was too fast",
          "ko": "결말이 너무 빨랐다"
        },
        "gloss": {
          "en": "In my opinion, the ending was too rushed.",
          "ko": "제 생각엔 결말이 너무 급했어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-04",
    "stage": 3,
    "fn": "guess",
    "pattern": "Me parece que ___.",
    "core": [
      "Me parece que",
      "me parece que"
    ],
    "meaning": {
      "en": "Saying how it seems to you: It seems to me that ___.",
      "ko": "짐작·인상 말하기: ___인 것 같아요."
    },
    "grammar": [],
    "expressions": [
      "me parece que"
    ],
    "examples": [
      {
        "text": "Me parece que eso es un poco tarde.",
        "slot": "eso es un poco tarde",
        "cue": {
          "en": "that's a bit late",
          "ko": "그건 좀 늦다"
        },
        "gloss": {
          "en": "It seems to me that's a bit late.",
          "ko": "그건 좀 늦은 것 같아요."
        }
      },
      {
        "text": "Me parece que va a llover.",
        "slot": "va a llover",
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
        "text": "Me parece que el restaurante está cerrado.",
        "slot": "el restaurante está cerrado",
        "cue": {
          "en": "the restaurant is closed",
          "ko": "식당이 문을 닫았다"
        },
        "gloss": {
          "en": "It looks like the restaurant is closed.",
          "ko": "식당이 문 닫은 것 같아요."
        }
      },
      {
        "text": "Me parece que ya nos conocemos.",
        "slot": "ya nos conocemos",
        "cue": {
          "en": "we already know each other",
          "ko": "우리 이미 아는 사이다"
        },
        "gloss": {
          "en": "I think we've already met.",
          "ko": "우리 전에 만난 적 있는 것 같아요."
        }
      }
    ]
  },
  {
    "id": "es-f3-05",
    "stage": 3,
    "fn": "experience",
    "pattern": "¿Alguna vez has ___?",
    "core": [
      "Alguna vez",
      "alguna vez"
    ],
    "meaning": {
      "en": "Asking about experience (present perfect): Have you ever ___?",
      "ko": "경험 묻기(현재완료): ___해 본 적 있어?"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "alguna vez"
    ],
    "examples": [
      {
        "text": "¿Alguna vez has probado el mole?",
        "slot": "probado el mole",
        "cue": {
          "en": "probar el mole (try mole)",
          "ko": "probar el mole(몰레를 먹어 보다)"
        },
        "gloss": {
          "en": "Have you ever tried mole?",
          "ko": "몰레 먹어 본 적 있어?"
        }
      },
      {
        "text": "¿Alguna vez has estado en México?",
        "slot": "estado en México",
        "cue": {
          "en": "estar en México (be in Mexico)",
          "ko": "estar en México(멕시코에 가다)"
        },
        "gloss": {
          "en": "Have you ever been to Mexico?",
          "ko": "멕시코에 가 본 적 있어?"
        }
      },
      {
        "text": "¿Alguna vez has viajado solo?",
        "slot": "viajado solo",
        "cue": {
          "en": "viajar solo (travel alone)",
          "ko": "viajar solo(혼자 여행하다)"
        },
        "gloss": {
          "en": "Have you ever travelled alone?",
          "ko": "혼자 여행해 본 적 있어?"
        }
      },
      {
        "text": "¿Alguna vez has visto un partido en el estadio?",
        "slot": "visto un partido en el estadio",
        "cue": {
          "en": "ver un partido en el estadio (see a match at the stadium)",
          "ko": "ver un partido en el estadio(경기장에서 경기를 보다)"
        },
        "gloss": {
          "en": "Have you ever watched a match at the stadium?",
          "ko": "경기장에서 경기 본 적 있어?"
        }
      }
    ]
  },
  {
    "id": "es-f3-06",
    "stage": 3,
    "fn": "experience",
    "pattern": "Nunca he ___.",
    "core": [
      "Nunca he",
      "nunca he"
    ],
    "meaning": {
      "en": "Saying you've never done something: I've never ___.",
      "ko": "해 본 적 없다고 말하기: ___해 본 적이 없어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "nunca he estado"
    ],
    "examples": [
      {
        "text": "No, nunca he estado en Lisboa.",
        "slot": "estado en Lisboa",
        "cue": {
          "en": "estar en Lisboa (be in Lisbon)",
          "ko": "estar en Lisboa(리스본에 가다)"
        },
        "gloss": {
          "en": "No, I've never been to Lisbon.",
          "ko": "아니, 리스본엔 가 본 적 없어."
        }
      },
      {
        "text": "Nunca he probado la paella.",
        "slot": "probado la paella",
        "cue": {
          "en": "probar la paella (try paella)",
          "ko": "probar la paella(파에야를 먹어 보다)"
        },
        "gloss": {
          "en": "I've never tried paella.",
          "ko": "파에야는 먹어 본 적이 없어요."
        }
      },
      {
        "text": "Nunca he montado a caballo.",
        "slot": "montado a caballo",
        "cue": {
          "en": "montar a caballo (ride a horse)",
          "ko": "montar a caballo(말을 타다)"
        },
        "gloss": {
          "en": "I've never ridden a horse.",
          "ko": "말을 타 본 적이 없어요."
        }
      },
      {
        "text": "Nunca he visto esa serie.",
        "slot": "visto esa serie",
        "cue": {
          "en": "ver esa serie (watch that series)",
          "ko": "ver esa serie(그 드라마를 보다)"
        },
        "gloss": {
          "en": "I've never watched that series.",
          "ko": "그 드라마는 본 적이 없어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-07",
    "stage": 3,
    "fn": "while-when",
    "pattern": "Llovía mucho cuando ___.",
    "core": [
      "cuando"
    ],
    "meaning": {
      "en": "Background (imperfect) + event (preterite): It was … when ___.",
      "ko": "배경(불완료과거) + 사건(단순과거): ___했을 때 …하고 있었어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Llovía mucho cuando llegamos al hotel.",
        "slot": "llegamos al hotel",
        "cue": {
          "en": "llegar al hotel (arrive at the hotel)",
          "ko": "llegar al hotel(호텔에 도착하다)"
        },
        "gloss": {
          "en": "It was raining hard when we got to the hotel.",
          "ko": "우리가 호텔에 도착했을 때 비가 많이 오고 있었어요."
        }
      },
      {
        "text": "Hacía mucho frío cuando salimos del cine.",
        "slot": "salimos del cine",
        "cue": {
          "en": "salir del cine (leave the cinema)",
          "ko": "salir del cine(영화관에서 나오다)"
        },
        "gloss": {
          "en": "It was very cold when we left the cinema.",
          "ko": "영화관에서 나왔을 때 무척 추웠어요."
        }
      },
      {
        "text": "Estaba en la ducha cuando sonó el teléfono.",
        "slot": "sonó el teléfono",
        "cue": {
          "en": "sonar el teléfono (the phone rings)",
          "ko": "sonar el teléfono(전화가 울리다)"
        },
        "gloss": {
          "en": "I was in the shower when the phone rang.",
          "ko": "전화가 울렸을 때 샤워 중이었어요."
        }
      },
      {
        "text": "Mi maleta no estaba cuando llegamos al aeropuerto.",
        "slot": "llegamos al aeropuerto",
        "cue": {
          "en": "llegar al aeropuerto (arrive at the airport)",
          "ko": "llegar al aeropuerto(공항에 도착하다)"
        },
        "gloss": {
          "en": "My suitcase wasn't there when we got to the airport.",
          "ko": "공항에 도착했을 때 제 가방이 없었어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-08",
    "stage": 3,
    "fn": "habit-past",
    "pattern": "Antes ___.",
    "core": [
      "Antes",
      "antes"
    ],
    "meaning": {
      "en": "Saying what you used to do (imperfect): I used to ___.",
      "ko": "예전에 하던 일 말하기(불완료과거): 예전엔 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Antes vivía en Busan.",
        "slot": "vivía en Busan",
        "cue": {
          "en": "vivir en Busan (live in Busan)",
          "ko": "vivir en Busan(부산에 살다)"
        },
        "gloss": {
          "en": "I used to live in Busan.",
          "ko": "예전엔 부산에 살았어요."
        }
      },
      {
        "text": "Antes trabajaba en un hotel.",
        "slot": "trabajaba en un hotel",
        "cue": {
          "en": "trabajar en un hotel (work in a hotel)",
          "ko": "trabajar en un hotel(호텔에서 일하다)"
        },
        "gloss": {
          "en": "I used to work in a hotel.",
          "ko": "예전엔 호텔에서 일했어요."
        }
      },
      {
        "text": "Antes jugaba al fútbol todos los domingos.",
        "slot": "jugaba al fútbol",
        "cue": {
          "en": "jugar al fútbol (play football)",
          "ko": "jugar al fútbol(축구하다)"
        },
        "gloss": {
          "en": "I used to play football every Sunday.",
          "ko": "예전엔 일요일마다 축구를 했어요."
        }
      },
      {
        "text": "Antes me encargaba de las redes sociales.",
        "slot": "me encargaba de las redes sociales",
        "cue": {
          "en": "encargarse de las redes sociales (be in charge of social media)",
          "ko": "encargarse de las redes sociales(SNS를 맡다)"
        },
        "gloss": {
          "en": "I used to be in charge of social media.",
          "ko": "예전엔 SNS를 맡았어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-09",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Al final, ___.",
    "core": [
      "Al final",
      "al final"
    ],
    "meaning": {
      "en": "Saying how a story ended: In the end, ___.",
      "ko": "이야기 끝맺기: 결국 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "al final",
      "menos mal",
      "qué pena"
    ],
    "examples": [
      {
        "text": "Al final, fue un desastre.",
        "slot": "fue un desastre",
        "cue": {
          "en": "ser un desastre (be a disaster)",
          "ko": "ser un desastre(엉망이 되다)"
        },
        "gloss": {
          "en": "In the end, it was a disaster.",
          "ko": "결국 엉망이 됐어요."
        }
      },
      {
        "text": "Al final, todo salió bien.",
        "slot": "todo salió bien",
        "cue": {
          "en": "todo sale bien (everything turns out fine)",
          "ko": "todo sale bien(다 잘 풀리다)"
        },
        "gloss": {
          "en": "In the end, everything turned out fine.",
          "ko": "결국 다 잘 됐어요."
        }
      },
      {
        "text": "Al final, no fuimos a la playa.",
        "slot": "no fuimos a la playa",
        "cue": {
          "en": "no ir a la playa (not go to the beach)",
          "ko": "no ir a la playa(바다에 안 가다)"
        },
        "gloss": {
          "en": "In the end, we didn't go to the beach.",
          "ko": "결국 바다에는 안 갔어요."
        }
      },
      {
        "text": "Qué pena. Al final, perdimos el tren.",
        "slot": "perdimos el tren",
        "cue": {
          "en": "perder el tren (miss the train)",
          "ko": "perder el tren(기차를 놓치다)"
        },
        "gloss": {
          "en": "What a shame. In the end, we missed the train.",
          "ko": "아쉽게도 결국 기차를 놓쳤어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-10",
    "stage": 3,
    "fn": "routine",
    "pattern": "Por la mañana me ___.",
    "core": [
      "Por la mañana me",
      "por la mañana me"
    ],
    "meaning": {
      "en": "Describing your routine with reflexive verbs: In the morning I ___.",
      "ko": "일과 말하기(재귀동사): 아침에 ___해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Por la mañana me levanto temprano.",
        "slot": "levanto temprano",
        "cue": {
          "en": "levantarse temprano (get up early)",
          "ko": "levantarse temprano(일찍 일어나다)"
        },
        "gloss": {
          "en": "In the morning I get up early.",
          "ko": "아침에 일찍 일어나요."
        }
      },
      {
        "text": "Por la mañana me ducho rápido.",
        "slot": "ducho rápido",
        "cue": {
          "en": "ducharse rápido (shower quickly)",
          "ko": "ducharse rápido(빨리 샤워하다)"
        },
        "gloss": {
          "en": "In the morning I shower quickly.",
          "ko": "아침에 빨리 샤워해요."
        }
      },
      {
        "text": "Por la mañana me visto y desayuno en casa.",
        "slot": "visto y desayuno en casa",
        "cue": {
          "en": "vestirse y desayunar en casa (get dressed and have breakfast at home)",
          "ko": "vestirse y desayunar en casa(옷 입고 집에서 아침 먹다)"
        },
        "gloss": {
          "en": "In the morning I get dressed and have breakfast at home.",
          "ko": "아침에 옷을 입고 집에서 아침을 먹어요."
        }
      },
      {
        "text": "Los domingos por la mañana me quedo en la cama.",
        "slot": "quedo en la cama",
        "cue": {
          "en": "quedarse en la cama (stay in bed)",
          "ko": "quedarse en la cama(침대에 누워 있다)"
        },
        "gloss": {
          "en": "On Sunday mornings I stay in bed.",
          "ko": "일요일 아침에는 침대에서 뒹굴어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-11",
    "stage": 3,
    "fn": "change-topic",
    "pattern": "¿Te acuerdas de ___?",
    "core": [
      "acuerdas de"
    ],
    "meaning": {
      "en": "Asking if someone remembers (acordarse de): Do you remember ___?",
      "ko": "기억나는지 묻기(acordarse de): ___ 기억나?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "te acuerdas de",
      "por cierto"
    ],
    "examples": [
      {
        "text": "Por cierto, ¿te acuerdas de la abogada nueva?",
        "slot": "la abogada nueva",
        "cue": {
          "en": "the new lawyer",
          "ko": "새로 온 변호사"
        },
        "gloss": {
          "en": "By the way, do you remember the new lawyer?",
          "ko": "그런데, 새로 온 변호사 기억나?"
        }
      },
      {
        "text": "¿Te acuerdas de aquel viaje a Lisboa?",
        "slot": "aquel viaje a Lisboa",
        "cue": {
          "en": "that trip to Lisbon",
          "ko": "그 리스본 여행"
        },
        "gloss": {
          "en": "Do you remember that trip to Lisbon?",
          "ko": "그 리스본 여행 기억나?"
        }
      },
      {
        "text": "¿Te acuerdas de Marta, mi compañera de clase?",
        "slot": "Marta",
        "cue": {
          "en": "Marta",
          "ko": "마르타"
        },
        "gloss": {
          "en": "Do you remember Marta, my classmate?",
          "ko": "내 반 친구 마르타 기억나?"
        }
      },
      {
        "text": "¿Te acuerdas de ese restaurante italiano?",
        "slot": "ese restaurante italiano",
        "cue": {
          "en": "that Italian restaurant",
          "ko": "그 이탈리아 식당"
        },
        "gloss": {
          "en": "Do you remember that Italian restaurant?",
          "ko": "그 이탈리아 식당 기억나?"
        }
      }
    ]
  },
  {
    "id": "es-f3-12",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "¿Podría ___?",
    "core": [
      "Podría",
      "podría"
    ],
    "meaning": {
      "en": "Asking politely (conditional): Could you ___?",
      "ko": "공손하게 부탁하기(조건법): ___해 주실 수 있을까요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "podría cambiarlo"
    ],
    "examples": [
      {
        "text": "¿Podría cambiarme de habitación?",
        "slot": "cambiarme de habitación",
        "cue": {
          "en": "change my room",
          "ko": "방을 바꿔 주다"
        },
        "gloss": {
          "en": "Could you move me to another room?",
          "ko": "방을 바꿔 주실 수 있을까요?"
        }
      },
      {
        "text": "¿Podría cambiarlo por una talla más grande?",
        "slot": "cambiarlo por una talla más grande",
        "cue": {
          "en": "exchange it for a bigger size",
          "ko": "더 큰 사이즈로 바꾸다"
        },
        "gloss": {
          "en": "Could you exchange it for a bigger size?",
          "ko": "더 큰 사이즈로 바꿔 주실 수 있을까요?"
        }
      },
      {
        "text": "¿Podría traerme otra toalla, por favor?",
        "slot": "traerme otra toalla",
        "cue": {
          "en": "bring me another towel",
          "ko": "수건을 하나 더 가져다주다"
        },
        "gloss": {
          "en": "Could you bring me another towel, please?",
          "ko": "수건 하나 더 가져다주실 수 있을까요?"
        }
      },
      {
        "text": "¿Podría contarme cómo es un día normal en el equipo?",
        "slot": "contarme cómo es un día normal",
        "cue": {
          "en": "tell me what a normal day is like",
          "ko": "평소 하루가 어떤지 알려 주다"
        },
        "gloss": {
          "en": "Could you tell me what a normal day on the team is like?",
          "ko": "팀의 평소 하루가 어떤지 알려 주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "es-f3-13",
    "stage": 3,
    "fn": "wish",
    "pattern": "Me gustaría ___.",
    "core": [
      "Me gustaría",
      "me gustaría"
    ],
    "meaning": {
      "en": "Saying what you'd like (conditional): I'd like to ___.",
      "ko": "바람 말하기(조건법): ___하고 싶어요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "me encantaría"
    ],
    "examples": [
      {
        "text": "Me gustaría tener más responsabilidad.",
        "slot": "tener más responsabilidad",
        "cue": {
          "en": "have more responsibility",
          "ko": "책임을 더 맡다"
        },
        "gloss": {
          "en": "I'd like to have more responsibility.",
          "ko": "더 많은 책임을 맡고 싶어요."
        }
      },
      {
        "text": "Me gustaría ver algo más ligero.",
        "slot": "ver algo más ligero",
        "cue": {
          "en": "watch something lighter",
          "ko": "더 가벼운 걸 보다"
        },
        "gloss": {
          "en": "I'd like to watch something lighter.",
          "ko": "좀 더 가벼운 걸 보고 싶어."
        }
      },
      {
        "text": "Me gustaría reservar una mesa para dos.",
        "slot": "reservar una mesa para dos",
        "cue": {
          "en": "book a table for two",
          "ko": "두 명 자리를 예약하다"
        },
        "gloss": {
          "en": "I'd like to book a table for two.",
          "ko": "두 명 자리 예약하고 싶어요."
        }
      },
      {
        "text": "Algún día me gustaría vivir en México.",
        "slot": "vivir en México",
        "cue": {
          "en": "live in Mexico",
          "ko": "멕시코에서 살다"
        },
        "gloss": {
          "en": "Some day I'd like to live in Mexico.",
          "ko": "언젠가 멕시코에서 살아 보고 싶어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-14",
    "stage": 3,
    "fn": "compare",
    "pattern": "… es más ___ que …",
    "core": [
      "es más"
    ],
    "meaning": {
      "en": "Comparing two things (adjective agrees): … is more ___ than …",
      "ko": "둘을 비교하기(형용사 성·수 맞추기): …가 …보다 더 ___해요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Este barrio es más tranquilo que el centro.",
        "slot": "tranquilo",
        "cue": {
          "en": "quiet (tranquilo/tranquila)",
          "ko": "조용한(tranquilo/tranquila)"
        },
        "gloss": {
          "en": "This neighbourhood is quieter than the centre.",
          "ko": "이 동네가 시내보다 더 조용해요."
        }
      },
      {
        "text": "La segunda temporada es más lenta que la primera.",
        "slot": "lenta",
        "cue": {
          "en": "slow (lento/lenta)",
          "ko": "느린(lento/lenta)"
        },
        "gloss": {
          "en": "The second season is slower than the first.",
          "ko": "두 번째 시즌이 첫 번째보다 더 느려요."
        }
      },
      {
        "text": "El tren es más rápido que el autobús.",
        "slot": "rápido",
        "cue": {
          "en": "fast (rápido/rápida)",
          "ko": "빠른(rápido/rápida)"
        },
        "gloss": {
          "en": "The train is faster than the bus.",
          "ko": "기차가 버스보다 더 빨라요."
        }
      },
      {
        "text": "Para mí, Lisboa es más bonita que Barcelona.",
        "slot": "bonita",
        "cue": {
          "en": "pretty (bonito/bonita)",
          "ko": "예쁜(bonito/bonita)"
        },
        "gloss": {
          "en": "For me, Lisbon is prettier than Barcelona.",
          "ko": "제게는 리스본이 바르셀로나보다 더 예뻐요."
        }
      }
    ]
  },
  {
    "id": "es-f3-15",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "¿Me lo puede ___?",
    "core": [
      "Me lo puede",
      "me lo puede",
      "Me la puede",
      "me la puede",
      "Me los puede",
      "Me las puede"
    ],
    "meaning": {
      "en": "Asking someone to do something with an item (me + lo/la/los/las): Could you ___ it for me?",
      "ko": "물건을 두고 부탁하기(me + lo/la/los/las): 그거 ___해 주실 수 있어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "no funciona"
    ],
    "examples": [
      {
        "text": "La llave no funciona. ¿Me la puede cambiar?",
        "slot": "cambiar",
        "cue": {
          "en": "change (la llave → me la)",
          "ko": "바꾸다(la llave → me la)"
        },
        "gloss": {
          "en": "The key doesn't work. Could you change it for me?",
          "ko": "열쇠가 안 돼요. 바꿔 주실 수 있어요?"
        }
      },
      {
        "text": "Es un regalo. ¿Me lo puede envolver?",
        "slot": "envolver",
        "cue": {
          "en": "wrap (el regalo → me lo)",
          "ko": "포장하다(el regalo → me lo)"
        },
        "gloss": {
          "en": "It's a present. Could you wrap it for me?",
          "ko": "선물이에요. 포장해 주실 수 있어요?"
        }
      },
      {
        "text": "No entiendo el contrato. ¿Me lo puede explicar?",
        "slot": "explicar",
        "cue": {
          "en": "explain (el contrato → me lo)",
          "ko": "설명하다(el contrato → me lo)"
        },
        "gloss": {
          "en": "I don't understand the contract. Could you explain it to me?",
          "ko": "계약서를 이해 못 했어요. 설명해 주실 수 있어요?"
        }
      },
      {
        "text": "Olvidé las toallas. ¿Me las puede traer?",
        "slot": "traer",
        "cue": {
          "en": "bring (las toallas → me las)",
          "ko": "가져다주다(las toallas → me las)"
        },
        "gloss": {
          "en": "I forgot the towels. Could you bring them to me?",
          "ko": "수건을 깜빡했어요. 가져다주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "es-f3-16",
    "stage": 3,
    "fn": "complain",
    "pattern": "Tengo un problema con ___.",
    "core": [
      "Tengo un problema con",
      "tengo un problema con"
    ],
    "meaning": {
      "en": "Raising a problem politely: I have a problem with ___.",
      "ko": "문제 알리기: ___에 문제가 있어요."
    },
    "grammar": [],
    "expressions": [
      "tengo un problema con"
    ],
    "examples": [
      {
        "text": "Buenas noches. Tengo un problema con mi habitación.",
        "slot": "mi habitación",
        "cue": {
          "en": "my room",
          "ko": "내 방"
        },
        "gloss": {
          "en": "Good evening. I have a problem with my room.",
          "ko": "안녕하세요. 제 방에 문제가 있어요."
        }
      },
      {
        "text": "Tengo un problema con la factura.",
        "slot": "la factura",
        "cue": {
          "en": "the bill (la factura)",
          "ko": "청구서(la factura)"
        },
        "gloss": {
          "en": "I have a problem with the bill.",
          "ko": "청구서에 문제가 있어요."
        }
      },
      {
        "text": "Perdone, tengo un problema con la reserva.",
        "slot": "la reserva",
        "cue": {
          "en": "the booking (la reserva)",
          "ko": "예약(la reserva)"
        },
        "gloss": {
          "en": "Excuse me, I have a problem with the booking.",
          "ko": "실례합니다, 예약에 문제가 있어요."
        }
      },
      {
        "text": "Tengo un problema con el wifi.",
        "slot": "el wifi",
        "cue": {
          "en": "the wifi (el wifi)",
          "ko": "와이파이(el wifi)"
        },
        "gloss": {
          "en": "I have a problem with the wifi.",
          "ko": "와이파이에 문제가 있어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-17",
    "stage": 3,
    "fn": "complain",
    "pattern": "___ no funciona.",
    "core": [
      "no funciona"
    ],
    "meaning": {
      "en": "Saying something doesn't work: ___ doesn't work (plural: no funcionan).",
      "ko": "고장 알리기: ___가 안 돼요(여럿이면 no funcionan)."
    },
    "grammar": [],
    "expressions": [
      "no funciona"
    ],
    "examples": [
      {
        "text": "El aire acondicionado no funciona.",
        "slot": "El aire acondicionado",
        "cue": {
          "en": "the air conditioning (el aire acondicionado)",
          "ko": "에어컨(el aire acondicionado)"
        },
        "gloss": {
          "en": "The air conditioning doesn't work.",
          "ko": "에어컨이 안 돼요."
        }
      },
      {
        "text": "La ducha no funciona bien.",
        "slot": "La ducha",
        "cue": {
          "en": "the shower (la ducha)",
          "ko": "샤워기(la ducha)"
        },
        "gloss": {
          "en": "The shower doesn't work properly.",
          "ko": "샤워기가 잘 안 돼요."
        }
      },
      {
        "text": "Perdone, la tarjeta de la habitación no funciona.",
        "slot": "la tarjeta de la habitación",
        "cue": {
          "en": "the room key card (la tarjeta)",
          "ko": "방 카드키(la tarjeta)"
        },
        "gloss": {
          "en": "Excuse me, the room key card doesn't work.",
          "ko": "실례합니다, 방 카드키가 안 돼요."
        }
      },
      {
        "text": "Las luces del baño no funcionan.",
        "slot": "Las luces del baño",
        "cue": {
          "en": "the bathroom lights (plural → funcionan)",
          "ko": "화장실 불(여럿 → funcionan)"
        },
        "gloss": {
          "en": "The bathroom lights don't work.",
          "ko": "화장실 불이 안 들어와요."
        }
      }
    ]
  },
  {
    "id": "es-f3-18",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "Lo que pasa es que ___.",
    "core": [
      "Lo que pasa es que",
      "lo que pasa es que"
    ],
    "meaning": {
      "en": "Explaining the real situation: The thing is, ___.",
      "ko": "사정 설명하기: 실은 ___거든요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "lo que pasa es que"
    ],
    "examples": [
      {
        "text": "Lo siento, lo que pasa es que perdí el autobús.",
        "slot": "perdí el autobús",
        "cue": {
          "en": "perder el autobús (miss the bus)",
          "ko": "perder el autobús(버스를 놓치다)"
        },
        "gloss": {
          "en": "I'm sorry, the thing is I missed the bus.",
          "ko": "미안해요, 실은 버스를 놓쳤어요."
        }
      },
      {
        "text": "Lo que pasa es que la ducha no tiene agua caliente.",
        "slot": "la ducha no tiene agua caliente",
        "cue": {
          "en": "the shower has no hot water",
          "ko": "샤워기에 뜨거운 물이 안 나오다"
        },
        "gloss": {
          "en": "The thing is, the shower has no hot water.",
          "ko": "실은 샤워기에서 뜨거운 물이 안 나와요."
        }
      },
      {
        "text": "Me encantaría ir, pero lo que pasa es que tengo mucho trabajo.",
        "slot": "tengo mucho trabajo",
        "cue": {
          "en": "tener mucho trabajo (have a lot of work)",
          "ko": "tener mucho trabajo(일이 많다)"
        },
        "gloss": {
          "en": "I'd love to go, but the thing is I have a lot of work.",
          "ko": "가고 싶은데, 실은 일이 많아요."
        }
      },
      {
        "text": "Lo que pasa es que no sabía la dirección.",
        "slot": "no sabía la dirección",
        "cue": {
          "en": "no saber la dirección (not know the address)",
          "ko": "no saber la dirección(주소를 모르다)"
        },
        "gloss": {
          "en": "The thing is, I didn't know the address.",
          "ko": "실은 주소를 몰랐어요."
        }
      }
    ]
  },
  {
    "id": "es-f3-19",
    "stage": 3,
    "fn": "agree",
    "pattern": "Estoy de acuerdo ___.",
    "core": [
      "Estoy de acuerdo",
      "estoy de acuerdo"
    ],
    "meaning": {
      "en": "Agreeing with someone or something: I agree ___.",
      "ko": "동의하기: ___ 동의해요."
    },
    "grammar": [],
    "expressions": [
      "estoy de acuerdo",
      "de hecho"
    ],
    "examples": [
      {
        "text": "Estoy de acuerdo contigo.",
        "slot": "contigo",
        "cue": {
          "en": "with you (con + ti = contigo)",
          "ko": "너와(con + ti = contigo)"
        },
        "gloss": {
          "en": "I agree with you.",
          "ko": "네 말에 동의해."
        }
      },
      {
        "text": "Estoy de acuerdo con él.",
        "slot": "con él",
        "cue": {
          "en": "with him",
          "ko": "그와"
        },
        "gloss": {
          "en": "I agree with him.",
          "ko": "그 사람 말에 동의해요."
        }
      },
      {
        "text": "De hecho, estoy de acuerdo con Marta.",
        "slot": "con Marta",
        "cue": {
          "en": "with Marta",
          "ko": "마르타와"
        },
        "gloss": {
          "en": "Actually, I agree with Marta.",
          "ko": "사실 저는 마르타 말에 동의해요."
        }
      },
      {
        "text": "Estoy de acuerdo con la idea, pero no con el precio.",
        "slot": "con la idea",
        "cue": {
          "en": "with the idea",
          "ko": "그 생각에"
        },
        "gloss": {
          "en": "I agree with the idea, but not with the price.",
          "ko": "생각엔 동의하지만 가격은 아니에요."
        }
      }
    ]
  },
  {
    "id": "es-f3-20",
    "stage": 3,
    "fn": "guess",
    "pattern": "No estoy seguro de ___.",
    "core": [
      "No estoy segur",
      "no estoy segur"
    ],
    "meaning": {
      "en": "Saying you're not sure (seguro/segura): I'm not sure about ___.",
      "ko": "확실하지 않다고 말하기(seguro/segura): ___는 잘 모르겠어요."
    },
    "grammar": [],
    "expressions": [
      "no estoy seguro",
      "a ver"
    ],
    "examples": [
      {
        "text": "No estoy seguro de la hora.",
        "slot": "la hora",
        "cue": {
          "en": "the time",
          "ko": "시간"
        },
        "gloss": {
          "en": "I'm not sure about the time.",
          "ko": "시간은 확실하지 않아요."
        }
      },
      {
        "text": "A ver... no estoy segura de su nombre.",
        "slot": "su nombre",
        "cue": {
          "en": "his/her name (woman speaking: segura)",
          "ko": "그 사람 이름(여자가 말하면 segura)"
        },
        "gloss": {
          "en": "Let's see... I'm not sure of her name.",
          "ko": "글쎄요... 그분 이름은 확실히 모르겠어요."
        }
      },
      {
        "text": "No estoy seguro de eso.",
        "slot": "eso",
        "cue": {
          "en": "that",
          "ko": "그것"
        },
        "gloss": {
          "en": "I'm not sure about that.",
          "ko": "그건 잘 모르겠어."
        }
      },
      {
        "text": "Todavía no estoy segura de querer ir.",
        "slot": "querer ir",
        "cue": {
          "en": "want to go",
          "ko": "가고 싶다"
        },
        "gloss": {
          "en": "I'm still not sure I want to go.",
          "ko": "아직 가고 싶은지 잘 모르겠어."
        }
      }
    ]
  }
];
