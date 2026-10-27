import type { Frame } from "../frames.ts";

/** 포르투갈어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const PT_FRAMES: Frame[] = [
  {
    "id": "pt-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Meu nome é ___.",
    "core": [
      "Meu nome é",
      "meu nome é"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "prazer"
    ],
    "examples": [
      {
        "text": "Meu nome é Ji-woo.",
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
        "text": "Oi, meu nome é Daniel. Prazer!",
        "slot": "Daniel",
        "cue": {
          "en": "Daniel",
          "ko": "다니엘"
        },
        "gloss": {
          "en": "Hi, my name is Daniel. Nice to meet you!",
          "ko": "안녕하세요, 제 이름은 다니엘이에요. 반가워요!"
        }
      },
      {
        "text": "Meu nome é Ana Park.",
        "slot": "Ana Park",
        "cue": {
          "en": "Ana Park (full name)",
          "ko": "박 아나(성과 이름)"
        },
        "gloss": {
          "en": "My name is Ana Park.",
          "ko": "제 이름은 박 아나예요."
        }
      },
      {
        "text": "Tudo bem? Meu nome é Min-ho.",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho",
          "ko": "민호"
        },
        "gloss": {
          "en": "How are you? My name is Min-ho.",
          "ko": "안녕하세요? 제 이름은 민호예요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "Sou de ___.",
    "core": [
      "Sou de",
      "sou de"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___ 출신이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sou de Seul.",
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
        "text": "Eu sou de Busan, e você?",
        "slot": "Busan",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm from Busan, and you?",
          "ko": "저는 부산 출신이에요, 당신은요?"
        }
      },
      {
        "text": "Sou de Tóquio, mas moro aqui.",
        "slot": "Tóquio",
        "cue": {
          "en": "Tokyo",
          "ko": "도쿄"
        },
        "gloss": {
          "en": "I'm from Tokyo, but I live here.",
          "ko": "저는 도쿄 출신인데 여기 살아요."
        }
      },
      {
        "text": "Minha amiga é de Lisboa, e eu sou de Madri.",
        "slot": "Madri",
        "cue": {
          "en": "Madrid",
          "ko": "마드리드"
        },
        "gloss": {
          "en": "My friend is from Lisbon, and I'm from Madrid.",
          "ko": "제 친구는 리스본, 저는 마드리드 출신이에요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "Eu trabalho em ___.",
    "core": [
      "trabalho em",
      "Trabalho em"
    ],
    "meaning": {
      "en": "Saying where you work: I work at ___.",
      "ko": "일하는 곳 말하기: 저는 ___에서 일해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu trabalho em um hotel.",
        "slot": "um hotel",
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
        "text": "Trabalho em uma escola.",
        "slot": "uma escola",
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
        "text": "Eu trabalho em um banco no centro.",
        "slot": "um banco",
        "cue": {
          "en": "a bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "I work at a bank downtown.",
          "ko": "저는 시내에 있는 은행에서 일해요."
        }
      },
      {
        "text": "Eu não trabalho em casa, trabalho em um escritório.",
        "slot": "um escritório",
        "cue": {
          "en": "an office",
          "ko": "사무실"
        },
        "gloss": {
          "en": "I don't work at home, I work in an office.",
          "ko": "저는 집에서 일하지 않고 사무실에서 일해요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-04",
    "stage": 1,
    "fn": "location-now",
    "pattern": "Estou em ___.",
    "core": [
      "Estou em",
      "estou em"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm in/at ___.",
      "ko": "지금 있는 곳 말하기: 저는 지금 ___에 있어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Estou em casa.",
        "slot": "casa",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home.",
          "ko": "저는 집에 있어요."
        }
      },
      {
        "text": "Agora eu estou em São Paulo.",
        "slot": "São Paulo",
        "cue": {
          "en": "São Paulo",
          "ko": "상파울루"
        },
        "gloss": {
          "en": "Right now I'm in São Paulo.",
          "ko": "지금 저는 상파울루에 있어요."
        }
      },
      {
        "text": "Estou em Seul com minha família.",
        "slot": "Seul",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I'm in Seoul with my family.",
          "ko": "저는 가족과 서울에 있어요."
        }
      },
      {
        "text": "Oi! Estou em frente à padaria.",
        "slot": "frente à padaria",
        "cue": {
          "en": "in front of the bakery",
          "ko": "빵집 앞"
        },
        "gloss": {
          "en": "Hi! I'm in front of the bakery.",
          "ko": "안녕하세요! 저 빵집 앞에 있어요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-05",
    "stage": 1,
    "fn": "feel",
    "pattern": "Estou ___.",
    "core": [
      "Estou",
      "estou"
    ],
    "meaning": {
      "en": "Saying how you are: I'm ___.",
      "ko": "상태 말하기: 저는 ___요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "obrigado"
    ],
    "examples": [
      {
        "text": "Estou bem, obrigado.",
        "slot": "bem",
        "cue": {
          "en": "fine",
          "ko": "잘 지냄"
        },
        "gloss": {
          "en": "I'm fine, thanks.",
          "ko": "잘 지내요, 고마워요."
        }
      },
      {
        "text": "Estou cansada hoje.",
        "slot": "cansada",
        "cue": {
          "en": "tired (said by a woman)",
          "ko": "피곤함(여성이 말할 때)"
        },
        "gloss": {
          "en": "I'm tired today.",
          "ko": "오늘 피곤해요."
        }
      },
      {
        "text": "Eu estou com fome.",
        "slot": "com fome",
        "cue": {
          "en": "hungry",
          "ko": "배고픔"
        },
        "gloss": {
          "en": "I'm hungry.",
          "ko": "배고파요."
        }
      },
      {
        "text": "Hoje eu estou muito feliz!",
        "slot": "muito feliz",
        "cue": {
          "en": "very happy",
          "ko": "아주 행복함"
        },
        "gloss": {
          "en": "Today I'm very happy!",
          "ko": "오늘 정말 행복해요!"
        }
      }
    ]
  },
  {
    "id": "pt-f1-06",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Onde fica ___?",
    "core": [
      "Onde fica",
      "onde fica"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "위치 묻기: ___는 어디에 있어요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "onde fica",
      "com licença"
    ],
    "examples": [
      {
        "text": "Onde fica o banheiro?",
        "slot": "o banheiro",
        "cue": {
          "en": "the bathroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the bathroom?",
          "ko": "화장실이 어디예요?"
        }
      },
      {
        "text": "Com licença, onde fica a estação?",
        "slot": "a estação",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Excuse me, where is the station?",
          "ko": "실례합니다, 역이 어디예요?"
        }
      },
      {
        "text": "Onde fica a padaria, por favor?",
        "slot": "a padaria",
        "cue": {
          "en": "the bakery",
          "ko": "빵집"
        },
        "gloss": {
          "en": "Where is the bakery, please?",
          "ko": "빵집이 어디예요?"
        }
      },
      {
        "text": "Desculpa, onde fica o metrô?",
        "slot": "o metrô",
        "cue": {
          "en": "the metro",
          "ko": "지하철"
        },
        "gloss": {
          "en": "Sorry, where is the metro?",
          "ko": "죄송한데, 지하철이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-07",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "Quanto custa ___?",
    "core": [
      "Quanto custa",
      "quanto custa"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "quanto custa"
    ],
    "examples": [
      {
        "text": "Quanto custa o pão de queijo?",
        "slot": "o pão de queijo",
        "cue": {
          "en": "the cheese bread",
          "ko": "치즈빵"
        },
        "gloss": {
          "en": "How much is the cheese bread?",
          "ko": "치즈빵 얼마예요?"
        }
      },
      {
        "text": "Quanto custa a passagem?",
        "slot": "a passagem",
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
        "text": "Com licença, quanto custa esse café?",
        "slot": "esse café",
        "cue": {
          "en": "this coffee",
          "ko": "이 커피"
        },
        "gloss": {
          "en": "Excuse me, how much is this coffee?",
          "ko": "실례합니다, 이 커피 얼마예요?"
        }
      },
      {
        "text": "Quanto custa uma garrafa de água?",
        "slot": "uma garrafa de água",
        "cue": {
          "en": "a bottle of water",
          "ko": "물 한 병"
        },
        "gloss": {
          "en": "How much is a bottle of water?",
          "ko": "물 한 병에 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-08",
    "stage": 1,
    "fn": "want",
    "pattern": "Eu quero ___, por favor.",
    "core": [
      "quero",
      "Quero"
    ],
    "meaning": {
      "en": "Saying what you want: I want ___, please.",
      "ko": "원하는 것 말하기: ___ 주세요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "por favor"
    ],
    "examples": [
      {
        "text": "Eu quero um café, por favor.",
        "slot": "um café",
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
        "text": "Quero um suco de laranja, por favor.",
        "slot": "um suco de laranja",
        "cue": {
          "en": "an orange juice",
          "ko": "오렌지 주스"
        },
        "gloss": {
          "en": "I'd like an orange juice, please.",
          "ko": "오렌지 주스 주세요."
        }
      },
      {
        "text": "Eu quero uma água sem gás, por favor.",
        "slot": "uma água sem gás",
        "cue": {
          "en": "still water",
          "ko": "탄산 없는 물"
        },
        "gloss": {
          "en": "I'd like still water, please.",
          "ko": "탄산 없는 물 주세요."
        }
      },
      {
        "text": "Quero dois pães, por favor.",
        "slot": "dois pães",
        "cue": {
          "en": "two bread rolls",
          "ko": "빵 두 개"
        },
        "gloss": {
          "en": "I'd like two bread rolls, please.",
          "ko": "빵 두 개 주세요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-09",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "Me vê um ___, por favor.",
    "core": [
      "Me vê um",
      "me vê um"
    ],
    "meaning": {
      "en": "Ordering at a counter: Can I get a ___, please?",
      "ko": "가게에서 주문하기: ___ 하나 주세요."
    },
    "grammar": [],
    "expressions": [
      "me vê um",
      "por favor"
    ],
    "examples": [
      {
        "text": "Me vê um pão de queijo, por favor.",
        "slot": "pão de queijo",
        "cue": {
          "en": "cheese bread",
          "ko": "치즈빵"
        },
        "gloss": {
          "en": "Can I get a cheese bread, please?",
          "ko": "치즈빵 하나 주세요."
        }
      },
      {
        "text": "Bom dia! Me vê um café, por favor.",
        "slot": "café",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Good morning! Can I get a coffee, please?",
          "ko": "안녕하세요! 커피 한 잔 주세요."
        }
      },
      {
        "text": "Me vê um suco de laranja, por favor.",
        "slot": "suco de laranja",
        "cue": {
          "en": "orange juice",
          "ko": "오렌지 주스"
        },
        "gloss": {
          "en": "Can I get an orange juice, please?",
          "ko": "오렌지 주스 하나 주세요."
        }
      },
      {
        "text": "Moço, me vê um misto-quente, por favor.",
        "slot": "misto-quente",
        "cue": {
          "en": "toasted ham and cheese sandwich",
          "ko": "햄치즈 토스트"
        },
        "gloss": {
          "en": "Excuse me, can I get a toasted ham and cheese, please?",
          "ko": "저기요, 햄치즈 토스트 하나 주세요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-10",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Você tem ___?",
    "core": [
      "Você tem",
      "você tem"
    ],
    "meaning": {
      "en": "Asking if someone has something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Você tem água sem gás?",
        "slot": "água sem gás",
        "cue": {
          "en": "still water",
          "ko": "탄산 없는 물"
        },
        "gloss": {
          "en": "Do you have still water?",
          "ko": "탄산 없는 물 있어요?"
        }
      },
      {
        "text": "Você tem uma caneta?",
        "slot": "uma caneta",
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
        "text": "Desculpa, você tem troco?",
        "slot": "troco",
        "cue": {
          "en": "change (money)",
          "ko": "거스름돈"
        },
        "gloss": {
          "en": "Sorry, do you have change?",
          "ko": "죄송한데 거스름돈 있어요?"
        }
      },
      {
        "text": "Você tem o cardápio em inglês?",
        "slot": "o cardápio em inglês",
        "cue": {
          "en": "the menu in English",
          "ko": "영어 메뉴판"
        },
        "gloss": {
          "en": "Do you have the menu in English?",
          "ko": "영어 메뉴판 있어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-11",
    "stage": 1,
    "fn": "have",
    "pattern": "Eu tenho ___.",
    "core": [
      "tenho",
      "Tenho"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___가 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu tenho dois irmãos.",
        "slot": "dois irmãos",
        "cue": {
          "en": "two brothers",
          "ko": "남자 형제 둘"
        },
        "gloss": {
          "en": "I have two brothers.",
          "ko": "저는 남자 형제가 둘 있어요."
        }
      },
      {
        "text": "Tenho uma reunião agora.",
        "slot": "uma reunião",
        "cue": {
          "en": "a meeting",
          "ko": "회의"
        },
        "gloss": {
          "en": "I have a meeting now.",
          "ko": "지금 회의가 있어요."
        }
      },
      {
        "text": "Eu tenho um gato em casa.",
        "slot": "um gato",
        "cue": {
          "en": "a cat",
          "ko": "고양이"
        },
        "gloss": {
          "en": "I have a cat at home.",
          "ko": "집에 고양이가 있어요."
        }
      },
      {
        "text": "Eu não tenho internet ainda.",
        "slot": "internet",
        "cue": {
          "en": "internet",
          "ko": "인터넷"
        },
        "gloss": {
          "en": "I don't have internet yet.",
          "ko": "아직 인터넷이 없어요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-12",
    "stage": 1,
    "fn": "cannot",
    "pattern": "Eu não falo ___ muito bem.",
    "core": [
      "não falo",
      "Não falo"
    ],
    "meaning": {
      "en": "Saying what you can't do well: I don't speak ___ very well.",
      "ko": "잘 못 하는 것 말하기: 저는 ___를 잘 못해요."
    },
    "grammar": [
      3,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu não falo português muito bem.",
        "slot": "português",
        "cue": {
          "en": "Portuguese",
          "ko": "포르투갈어"
        },
        "gloss": {
          "en": "I don't speak Portuguese very well.",
          "ko": "저는 포르투갈어를 잘 못해요."
        }
      },
      {
        "text": "Não falo inglês muito bem.",
        "slot": "inglês",
        "cue": {
          "en": "English",
          "ko": "영어"
        },
        "gloss": {
          "en": "I don't speak English very well.",
          "ko": "영어를 잘 못해요."
        }
      },
      {
        "text": "Desculpa, eu não falo espanhol muito bem.",
        "slot": "espanhol",
        "cue": {
          "en": "Spanish",
          "ko": "스페인어"
        },
        "gloss": {
          "en": "Sorry, I don't speak Spanish very well.",
          "ko": "죄송해요, 스페인어를 잘 못해요."
        }
      },
      {
        "text": "Eu não falo japonês muito bem, só um pouco.",
        "slot": "japonês",
        "cue": {
          "en": "Japanese",
          "ko": "일본어"
        },
        "gloss": {
          "en": "I don't speak Japanese very well, just a little.",
          "ko": "일본어는 잘 못하고 조금만 해요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-13",
    "stage": 1,
    "fn": "live-where",
    "pattern": "Eu moro em ___.",
    "core": [
      "moro em",
      "Moro em",
      "moro no",
      "moro na"
    ],
    "meaning": {
      "en": "Saying where you live: I live in ___.",
      "ko": "사는 곳 말하기: 저는 ___에 살아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu moro em São Paulo.",
        "slot": "São Paulo",
        "cue": {
          "en": "São Paulo",
          "ko": "상파울루"
        },
        "gloss": {
          "en": "I live in São Paulo.",
          "ko": "저는 상파울루에 살아요."
        }
      },
      {
        "text": "Moro em Seul com minha família.",
        "slot": "Seul",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I live in Seoul with my family.",
          "ko": "저는 가족과 서울에 살아요."
        }
      },
      {
        "text": "Eu moro em um apartamento pequeno.",
        "slot": "um apartamento pequeno",
        "cue": {
          "en": "a small apartment",
          "ko": "작은 아파트"
        },
        "gloss": {
          "en": "I live in a small apartment.",
          "ko": "저는 작은 아파트에 살아요."
        }
      },
      {
        "text": "Eu moro em Copacabana, perto da praia.",
        "slot": "Copacabana",
        "cue": {
          "en": "Copacabana",
          "ko": "코파카바나"
        },
        "gloss": {
          "en": "I live in Copacabana, near the beach.",
          "ko": "저는 해변 근처 코파카바나에 살아요."
        }
      }
    ]
  },
  {
    "id": "pt-f1-14",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "O que é ___?",
    "core": [
      "O que é",
      "o que é"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___는 뭐예요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "O que é isso?",
        "slot": "isso",
        "cue": {
          "en": "that",
          "ko": "그것"
        },
        "gloss": {
          "en": "What is that?",
          "ko": "그게 뭐예요?"
        }
      },
      {
        "text": "O que é coxinha?",
        "slot": "coxinha",
        "cue": {
          "en": "coxinha (a snack)",
          "ko": "코시냐(간식)"
        },
        "gloss": {
          "en": "What is coxinha?",
          "ko": "코시냐가 뭐예요?"
        }
      },
      {
        "text": "Com licença, o que é açaí?",
        "slot": "açaí",
        "cue": {
          "en": "açaí",
          "ko": "아사이"
        },
        "gloss": {
          "en": "Excuse me, what is açaí?",
          "ko": "실례합니다, 아사이가 뭐예요?"
        }
      },
      {
        "text": "O que é esse prato aqui?",
        "slot": "esse prato",
        "cue": {
          "en": "this dish",
          "ko": "이 요리"
        },
        "gloss": {
          "en": "What is this dish here?",
          "ko": "여기 이 요리는 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-15",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "Pode ___, por favor?",
    "core": [
      "Pode",
      "pode"
    ],
    "meaning": {
      "en": "Asking someone to do something: Can you ___, please?",
      "ko": "부탁하기: ___ 주시겠어요?"
    },
    "grammar": [],
    "expressions": [
      "pode repetir",
      "mais devagar",
      "por favor",
      "desculpa",
      "não entendi"
    ],
    "examples": [
      {
        "text": "Pode repetir, por favor?",
        "slot": "repetir",
        "cue": {
          "en": "repeat",
          "ko": "다시 말하기"
        },
        "gloss": {
          "en": "Can you repeat that, please?",
          "ko": "다시 말해 주시겠어요?"
        }
      },
      {
        "text": "Desculpa, não entendi. Pode falar mais devagar, por favor?",
        "slot": "falar mais devagar",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하기"
        },
        "gloss": {
          "en": "Sorry, I didn't get that. Can you speak more slowly, please?",
          "ko": "죄송해요, 못 알아들었어요. 더 천천히 말해 주시겠어요?"
        }
      },
      {
        "text": "Pode escrever aqui, por favor?",
        "slot": "escrever aqui",
        "cue": {
          "en": "write it here",
          "ko": "여기 쓰기"
        },
        "gloss": {
          "en": "Can you write it here, please?",
          "ko": "여기 써 주시겠어요?"
        }
      },
      {
        "text": "Pode me ajudar, por favor?",
        "slot": "me ajudar",
        "cue": {
          "en": "help me",
          "ko": "도와주기"
        },
        "gloss": {
          "en": "Can you help me, please?",
          "ko": "도와주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-16",
    "stage": 1,
    "fn": "greet",
    "pattern": "___, tudo bem?",
    "core": [
      "tudo bem",
      "Tudo bem"
    ],
    "meaning": {
      "en": "Greeting: ___, how are you?",
      "ko": "인사하기: ___, 잘 지내요?"
    },
    "grammar": [],
    "expressions": [
      "tudo bem",
      "bom dia",
      "boa tarde",
      "boa noite"
    ],
    "examples": [
      {
        "text": "Bom dia, tudo bem?",
        "slot": "Bom dia",
        "cue": {
          "en": "good morning",
          "ko": "아침 인사"
        },
        "gloss": {
          "en": "Good morning, how are you?",
          "ko": "좋은 아침이에요, 잘 지내요?"
        }
      },
      {
        "text": "Boa tarde, tudo bem?",
        "slot": "Boa tarde",
        "cue": {
          "en": "good afternoon",
          "ko": "오후 인사"
        },
        "gloss": {
          "en": "Good afternoon, how are you?",
          "ko": "안녕하세요(오후), 잘 지내요?"
        }
      },
      {
        "text": "Boa noite, tudo bem?",
        "slot": "Boa noite",
        "cue": {
          "en": "good evening",
          "ko": "저녁 인사"
        },
        "gloss": {
          "en": "Good evening, how are you?",
          "ko": "안녕하세요(저녁), 잘 지내요?"
        }
      },
      {
        "text": "Oi, Lucas, tudo bem?",
        "slot": "Oi, Lucas",
        "cue": {
          "en": "hi + a name",
          "ko": "이름 부르며 인사"
        },
        "gloss": {
          "en": "Hi, Lucas, how are you?",
          "ko": "안녕, 루카스, 잘 지내?"
        }
      }
    ]
  },
  {
    "id": "pt-f1-17",
    "stage": 1,
    "fn": "describe-thing",
    "pattern": "A ___ é muito boa.",
    "core": [
      "é muito boa"
    ],
    "meaning": {
      "en": "Saying something (a feminine noun) is very good: The ___ is very good.",
      "ko": "좋다고 말하기(여성 명사): ___가 아주 좋아요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "A comida é muito boa.",
        "slot": "comida",
        "cue": {
          "en": "food",
          "ko": "음식"
        },
        "gloss": {
          "en": "The food is very good.",
          "ko": "음식이 아주 맛있어요."
        }
      },
      {
        "text": "A padaria daqui é muito boa.",
        "slot": "padaria daqui",
        "cue": {
          "en": "the bakery here",
          "ko": "여기 빵집"
        },
        "gloss": {
          "en": "The bakery here is very good.",
          "ko": "여기 빵집은 아주 좋아요."
        }
      },
      {
        "text": "A praia é muito boa para nadar.",
        "slot": "praia",
        "cue": {
          "en": "beach",
          "ko": "해변"
        },
        "gloss": {
          "en": "The beach is very good for swimming.",
          "ko": "그 해변은 수영하기 아주 좋아요."
        }
      },
      {
        "text": "A pizza aqui é muito boa!",
        "slot": "pizza",
        "cue": {
          "en": "pizza",
          "ko": "피자"
        },
        "gloss": {
          "en": "The pizza here is very good!",
          "ko": "여기 피자 정말 맛있어요!"
        }
      }
    ]
  },
  {
    "id": "pt-f1-18",
    "stage": 1,
    "fn": "greet",
    "pattern": "Tchau, até ___!",
    "core": [
      "Tchau",
      "tchau"
    ],
    "meaning": {
      "en": "Saying goodbye: Bye, see you ___!",
      "ko": "헤어질 때 인사: 안녕, ___ 봐요!"
    },
    "grammar": [],
    "expressions": [
      "tchau",
      "até logo"
    ],
    "examples": [
      {
        "text": "Tchau, até logo!",
        "slot": "logo",
        "cue": {
          "en": "soon",
          "ko": "이따가"
        },
        "gloss": {
          "en": "Bye, see you soon!",
          "ko": "안녕, 이따 봐요!"
        }
      },
      {
        "text": "Tchau, até amanhã!",
        "slot": "amanhã",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "Bye, see you tomorrow!",
          "ko": "안녕, 내일 봐요!"
        }
      },
      {
        "text": "Tchau, tchau! Até segunda!",
        "slot": "segunda",
        "cue": {
          "en": "Monday",
          "ko": "월요일"
        },
        "gloss": {
          "en": "Bye-bye! See you Monday!",
          "ko": "안녕! 월요일에 봐요!"
        }
      },
      {
        "text": "Obrigado, tchau! Até mais tarde!",
        "slot": "mais tarde",
        "cue": {
          "en": "later",
          "ko": "나중에"
        },
        "gloss": {
          "en": "Thanks, bye! See you later!",
          "ko": "고마워요, 안녕! 나중에 봐요!"
        }
      }
    ]
  },
  {
    "id": "pt-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Ontem eu ___.",
    "core": [
      "Ontem eu",
      "ontem eu"
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
        "text": "Ontem eu trabalhei até tarde.",
        "slot": "trabalhei até tarde",
        "cue": {
          "en": "worked late",
          "ko": "늦게까지 일했다"
        },
        "gloss": {
          "en": "Yesterday I worked late.",
          "ko": "어제 늦게까지 일했어요."
        }
      },
      {
        "text": "Ontem eu estudei português.",
        "slot": "estudei português",
        "cue": {
          "en": "studied Portuguese",
          "ko": "포르투갈어를 공부했다"
        },
        "gloss": {
          "en": "Yesterday I studied Portuguese.",
          "ko": "어제 포르투갈어를 공부했어요."
        }
      },
      {
        "text": "Ontem eu falei muito no trabalho.",
        "slot": "falei muito no trabalho",
        "cue": {
          "en": "talked a lot at work",
          "ko": "일하면서 말을 많이 했다"
        },
        "gloss": {
          "en": "Yesterday I talked a lot at work.",
          "ko": "어제 회사에서 말을 많이 했어요."
        }
      },
      {
        "text": "Ontem eu cozinhei para minha família.",
        "slot": "cozinhei para minha família",
        "cue": {
          "en": "cooked for my family",
          "ko": "가족에게 요리해 줬다"
        },
        "gloss": {
          "en": "Yesterday I cooked for my family.",
          "ko": "어제 가족에게 요리해 줬어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "No sábado eu fui ___.",
    "core": [
      "fui",
      "Fui"
    ],
    "meaning": {
      "en": "Saying where you went: On Saturday I went ___.",
      "ko": "다녀온 곳 말하기: 토요일에 ___ 갔어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "fim de semana"
    ],
    "examples": [
      {
        "text": "No sábado eu fui à praia.",
        "slot": "à praia",
        "cue": {
          "en": "to the beach",
          "ko": "해변에"
        },
        "gloss": {
          "en": "On Saturday I went to the beach.",
          "ko": "토요일에 해변에 갔어요."
        }
      },
      {
        "text": "No fim de semana eu fui ao cinema.",
        "slot": "ao cinema",
        "cue": {
          "en": "to the movies",
          "ko": "영화관에"
        },
        "gloss": {
          "en": "On the weekend I went to the movies.",
          "ko": "주말에 영화 보러 갔어요."
        }
      },
      {
        "text": "Ontem eu fui ao médico.",
        "slot": "ao médico",
        "cue": {
          "en": "to the doctor",
          "ko": "병원에"
        },
        "gloss": {
          "en": "Yesterday I went to the doctor.",
          "ko": "어제 병원에 갔어요."
        }
      },
      {
        "text": "Domingo eu fui a um show.",
        "slot": "a um show",
        "cue": {
          "en": "to a concert",
          "ko": "공연에"
        },
        "gloss": {
          "en": "On Sunday I went to a concert.",
          "ko": "일요일에 공연에 갔어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-03",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Vou ___.",
    "core": [
      "Vou",
      "vou"
    ],
    "meaning": {
      "en": "Saying what you're going to do: I'm going to ___.",
      "ko": "할 일 말하기: ___ 할 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Vou viajar no feriado.",
        "slot": "viajar no feriado",
        "cue": {
          "en": "travel over the holiday",
          "ko": "연휴에 여행 가다"
        },
        "gloss": {
          "en": "I'm going to travel over the holiday.",
          "ko": "연휴에 여행 갈 거예요."
        }
      },
      {
        "text": "Amanhã eu vou estudar em casa.",
        "slot": "estudar em casa",
        "cue": {
          "en": "study at home",
          "ko": "집에서 공부하다"
        },
        "gloss": {
          "en": "Tomorrow I'm going to study at home.",
          "ko": "내일은 집에서 공부할 거예요."
        }
      },
      {
        "text": "Vou comprar uma passagem.",
        "slot": "comprar uma passagem",
        "cue": {
          "en": "buy a ticket",
          "ko": "표를 사다"
        },
        "gloss": {
          "en": "I'm going to buy a ticket.",
          "ko": "표를 살 거예요."
        }
      },
      {
        "text": "No fim de semana vou visitar meus pais.",
        "slot": "visitar meus pais",
        "cue": {
          "en": "visit my parents",
          "ko": "부모님을 찾아뵙다"
        },
        "gloss": {
          "en": "On the weekend I'm going to visit my parents.",
          "ko": "주말에 부모님 댁에 갈 거예요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-04",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "Estou ___ agora.",
    "core": [
      "Estou",
      "estou"
    ],
    "meaning": {
      "en": "Saying what you're doing right now: I'm ___ now.",
      "ko": "지금 하는 일 말하기: 지금 ___ 있어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Estou procurando uma farmácia.",
        "slot": "procurando uma farmácia",
        "cue": {
          "en": "looking for a pharmacy",
          "ko": "약국을 찾고"
        },
        "gloss": {
          "en": "I'm looking for a pharmacy.",
          "ko": "약국을 찾고 있어요."
        }
      },
      {
        "text": "Agora eu estou trabalhando.",
        "slot": "trabalhando",
        "cue": {
          "en": "working",
          "ko": "일하고"
        },
        "gloss": {
          "en": "Right now I'm working.",
          "ko": "지금 일하고 있어요."
        }
      },
      {
        "text": "Estou esperando o ônibus.",
        "slot": "esperando o ônibus",
        "cue": {
          "en": "waiting for the bus",
          "ko": "버스를 기다리고"
        },
        "gloss": {
          "en": "I'm waiting for the bus.",
          "ko": "버스를 기다리고 있어요."
        }
      },
      {
        "text": "Ainda estou estudando para a prova.",
        "slot": "estudando para a prova",
        "cue": {
          "en": "studying for the exam",
          "ko": "시험공부를 하고"
        },
        "gloss": {
          "en": "I'm still studying for the exam.",
          "ko": "아직 시험공부 하고 있어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-05",
    "stage": 2,
    "fn": "like",
    "pattern": "Eu gosto de ___.",
    "core": [
      "gosto de",
      "Gosto de",
      "gosto muito de",
      "Gosto muito de",
      "gosto mais de"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: 저는 ___를 좋아해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu gosto de cozinhar.",
        "slot": "cozinhar",
        "cue": {
          "en": "cooking",
          "ko": "요리하기"
        },
        "gloss": {
          "en": "I like cooking.",
          "ko": "저는 요리하는 걸 좋아해요."
        }
      },
      {
        "text": "Gosto de café sem açúcar.",
        "slot": "café sem açúcar",
        "cue": {
          "en": "coffee without sugar",
          "ko": "설탕 없는 커피"
        },
        "gloss": {
          "en": "I like coffee without sugar.",
          "ko": "설탕 없는 커피를 좋아해요."
        }
      },
      {
        "text": "Eu gosto muito de comédia.",
        "slot": "comédia",
        "cue": {
          "en": "comedies",
          "ko": "코미디"
        },
        "gloss": {
          "en": "I really like comedies.",
          "ko": "저는 코미디를 정말 좋아해요."
        }
      },
      {
        "text": "No fim de semana eu gosto de correr no parque.",
        "slot": "correr no parque",
        "cue": {
          "en": "running in the park",
          "ko": "공원에서 달리기"
        },
        "gloss": {
          "en": "On weekends I like running in the park.",
          "ko": "주말에는 공원에서 달리는 걸 좋아해요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-06",
    "stage": 2,
    "fn": "dislike",
    "pattern": "Não gosto muito de ___.",
    "core": [
      "Não gosto",
      "não gosto"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't really like ___.",
      "ko": "싫어하는 것 말하기: ___는 별로 안 좋아해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Não gosto muito de filme de terror.",
        "slot": "filme de terror",
        "cue": {
          "en": "horror movies",
          "ko": "공포 영화"
        },
        "gloss": {
          "en": "I don't really like horror movies.",
          "ko": "공포 영화는 별로 안 좋아해요."
        }
      },
      {
        "text": "Eu não gosto de acordar cedo.",
        "slot": "acordar cedo",
        "cue": {
          "en": "waking up early",
          "ko": "일찍 일어나기"
        },
        "gloss": {
          "en": "I don't like waking up early.",
          "ko": "일찍 일어나는 걸 싫어해요."
        }
      },
      {
        "text": "Não gosto muito de calor.",
        "slot": "calor",
        "cue": {
          "en": "hot weather",
          "ko": "더위"
        },
        "gloss": {
          "en": "I don't really like hot weather.",
          "ko": "더운 건 별로 안 좋아해요."
        }
      },
      {
        "text": "Eu não gosto de pegar trânsito.",
        "slot": "pegar trânsito",
        "cue": {
          "en": "sitting in traffic",
          "ko": "차 막히는 것"
        },
        "gloss": {
          "en": "I don't like sitting in traffic.",
          "ko": "차 막히는 건 싫어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-07",
    "stage": 2,
    "fn": "compare",
    "pattern": "Esse é mais ___ do que aquele.",
    "core": [
      "mais",
      "do que"
    ],
    "meaning": {
      "en": "Comparing two things: This one is more ___ than that one.",
      "ko": "둘 비교하기: 이게 저것보다 더 ___."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "O ônibus é mais barato do que o avião.",
        "slot": "barato",
        "cue": {
          "en": "cheap",
          "ko": "싸다"
        },
        "gloss": {
          "en": "The bus is cheaper than the plane.",
          "ko": "버스가 비행기보다 싸요."
        }
      },
      {
        "text": "O Rio é mais quente do que Curitiba.",
        "slot": "quente",
        "cue": {
          "en": "hot",
          "ko": "덥다"
        },
        "gloss": {
          "en": "Rio is hotter than Curitiba.",
          "ko": "리우가 쿠리치바보다 더워요."
        }
      },
      {
        "text": "O spray é mais forte do que a pastilha.",
        "slot": "forte",
        "cue": {
          "en": "strong",
          "ko": "강하다"
        },
        "gloss": {
          "en": "The spray is stronger than the lozenge.",
          "ko": "스프레이가 사탕형 약보다 강해요."
        }
      },
      {
        "text": "Esse apartamento é mais caro do que o outro.",
        "slot": "caro",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "This apartment is more expensive than the other one.",
          "ko": "이 아파트가 다른 것보다 비싸요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-08",
    "stage": 2,
    "fn": "duration",
    "pattern": "Moro aqui faz ___.",
    "core": [
      "faz",
      "Faz"
    ],
    "meaning": {
      "en": "Saying how long: I've lived here for ___.",
      "ko": "기간 말하기: 여기 산 지 ___ 됐어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Moro aqui faz dois anos.",
        "slot": "dois anos",
        "cue": {
          "en": "two years",
          "ko": "2년"
        },
        "gloss": {
          "en": "I've lived here for two years.",
          "ko": "여기 산 지 2년 됐어요."
        }
      },
      {
        "text": "Eu trabalho nessa empresa faz seis meses.",
        "slot": "seis meses",
        "cue": {
          "en": "six months",
          "ko": "6개월"
        },
        "gloss": {
          "en": "I've worked at this company for six months.",
          "ko": "이 회사에서 일한 지 6개월 됐어요."
        }
      },
      {
        "text": "Faz uma semana que eu estou doente.",
        "slot": "uma semana",
        "cue": {
          "en": "a week",
          "ko": "일주일"
        },
        "gloss": {
          "en": "I've been sick for a week.",
          "ko": "아픈 지 일주일 됐어요."
        }
      },
      {
        "text": "Estudo português faz um ano.",
        "slot": "um ano",
        "cue": {
          "en": "a year",
          "ko": "1년"
        },
        "gloss": {
          "en": "I've been studying Portuguese for a year.",
          "ko": "포르투갈어 공부한 지 1년 됐어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-09",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Eu cheguei há ___.",
    "core": [
      "há"
    ],
    "meaning": {
      "en": "Saying how long ago: I arrived ___ ago.",
      "ko": "얼마 전인지 말하기: ___ 전에 도착했어요."
    },
    "grammar": [
      0,
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu cheguei aqui há três dias.",
        "slot": "três dias",
        "cue": {
          "en": "three days",
          "ko": "사흘"
        },
        "gloss": {
          "en": "I arrived here three days ago.",
          "ko": "사흘 전에 여기 도착했어요."
        }
      },
      {
        "text": "Comecei a estudar há um mês.",
        "slot": "um mês",
        "cue": {
          "en": "a month",
          "ko": "한 달"
        },
        "gloss": {
          "en": "I started studying a month ago.",
          "ko": "한 달 전에 공부를 시작했어요."
        }
      },
      {
        "text": "Eu falei com ela há uma hora.",
        "slot": "uma hora",
        "cue": {
          "en": "an hour",
          "ko": "한 시간"
        },
        "gloss": {
          "en": "I talked to her an hour ago.",
          "ko": "한 시간 전에 그녀랑 얘기했어요."
        }
      },
      {
        "text": "Mudei para cá há pouco tempo.",
        "slot": "pouco tempo",
        "cue": {
          "en": "a short while",
          "ko": "얼마 안 됨"
        },
        "gloss": {
          "en": "I moved here a short while ago.",
          "ko": "여기로 이사 온 지 얼마 안 됐어요."
        }
      }
    ]
  },
  {
    "id": "pt-f2-10",
    "stage": 2,
    "fn": "symptom",
    "pattern": "Estou com dor de ___.",
    "core": [
      "Estou com dor de",
      "estou com dor de"
    ],
    "meaning": {
      "en": "Saying what hurts: I have a ___ache / sore ___.",
      "ko": "아픈 곳 말하기: ___가 아파요."
    },
    "grammar": [],
    "expressions": [
      "estou com dor de"
    ],
    "examples": [
      {
        "text": "Estou com dor de cabeça.",
        "slot": "cabeça",
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
        "text": "Estou com dor de garganta desde ontem.",
        "slot": "garganta",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "I've had a sore throat since yesterday.",
          "ko": "어제부터 목이 아파요."
        }
      },
      {
        "text": "Ainda estou com dor de barriga.",
        "slot": "barriga",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "I still have a stomachache.",
          "ko": "아직 배가 아파요."
        }
      },
      {
        "text": "Estou com dor de dente, tem dentista aqui perto?",
        "slot": "dente",
        "cue": {
          "en": "tooth",
          "ko": "이"
        },
        "gloss": {
          "en": "I have a toothache, is there a dentist nearby?",
          "ko": "이가 아픈데 근처에 치과 있어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-11",
    "stage": 2,
    "fn": "request-thing",
    "pattern": "Tem remédio para ___?",
    "core": [
      "Tem remédio para",
      "tem remédio para"
    ],
    "meaning": {
      "en": "Asking for medicine: Do you have something for ___?",
      "ko": "약 찾기: ___에 먹는 약 있어요?"
    },
    "grammar": [],
    "expressions": [
      "tem remédio para"
    ],
    "examples": [
      {
        "text": "Tem remédio para dor de garganta?",
        "slot": "dor de garganta",
        "cue": {
          "en": "a sore throat",
          "ko": "목 통증"
        },
        "gloss": {
          "en": "Do you have something for a sore throat?",
          "ko": "목 아픈 데 먹는 약 있어요?"
        }
      },
      {
        "text": "Tem remédio para gripe sem receita?",
        "slot": "gripe",
        "cue": {
          "en": "the flu",
          "ko": "독감"
        },
        "gloss": {
          "en": "Do you have flu medicine without a prescription?",
          "ko": "처방전 없이 살 수 있는 감기약 있어요?"
        }
      },
      {
        "text": "Moço, tem remédio para enjoo?",
        "slot": "enjoo",
        "cue": {
          "en": "nausea",
          "ko": "멀미"
        },
        "gloss": {
          "en": "Excuse me, do you have something for nausea?",
          "ko": "저기요, 멀미약 있어요?"
        }
      },
      {
        "text": "Você tem remédio para alergia?",
        "slot": "alergia",
        "cue": {
          "en": "allergies",
          "ko": "알레르기"
        },
        "gloss": {
          "en": "Do you have allergy medicine?",
          "ko": "알레르기 약 있어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-12",
    "stage": 2,
    "fn": "time-when",
    "pattern": "A que horas ___?",
    "core": [
      "A que horas",
      "a que horas"
    ],
    "meaning": {
      "en": "Asking what time: What time does ___?",
      "ko": "시간 묻기: 몇 시에 ___?"
    },
    "grammar": [],
    "expressions": [
      "a que horas"
    ],
    "examples": [
      {
        "text": "A que horas sai o ônibus?",
        "slot": "sai o ônibus",
        "cue": {
          "en": "the bus leaves",
          "ko": "버스가 출발하다"
        },
        "gloss": {
          "en": "What time does the bus leave?",
          "ko": "버스 몇 시에 출발해요?"
        }
      },
      {
        "text": "A que horas abre a farmácia?",
        "slot": "abre a farmácia",
        "cue": {
          "en": "the pharmacy opens",
          "ko": "약국이 문을 열다"
        },
        "gloss": {
          "en": "What time does the pharmacy open?",
          "ko": "약국은 몇 시에 열어요?"
        }
      },
      {
        "text": "A que horas começa o filme?",
        "slot": "começa o filme",
        "cue": {
          "en": "the movie starts",
          "ko": "영화가 시작하다"
        },
        "gloss": {
          "en": "What time does the movie start?",
          "ko": "영화 몇 시에 시작해요?"
        }
      },
      {
        "text": "E amanhã, a que horas você chega?",
        "slot": "você chega",
        "cue": {
          "en": "you arrive",
          "ko": "네가 도착하다"
        },
        "gloss": {
          "en": "And tomorrow, what time do you arrive?",
          "ko": "그럼 내일은 몇 시에 와?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-13",
    "stage": 2,
    "fn": "duration",
    "pattern": "Quanto tempo leva ___?",
    "core": [
      "Quanto tempo leva",
      "quanto tempo leva"
    ],
    "meaning": {
      "en": "Asking how long it takes: How long does ___ take?",
      "ko": "걸리는 시간 묻기: ___ 얼마나 걸려요?"
    },
    "grammar": [],
    "expressions": [
      "quanto tempo leva"
    ],
    "examples": [
      {
        "text": "Quanto tempo leva a viagem?",
        "slot": "a viagem",
        "cue": {
          "en": "the trip",
          "ko": "여행(이동)"
        },
        "gloss": {
          "en": "How long does the trip take?",
          "ko": "가는 데 얼마나 걸려요?"
        }
      },
      {
        "text": "Quanto tempo leva até o centro?",
        "slot": "até o centro",
        "cue": {
          "en": "to downtown",
          "ko": "시내까지"
        },
        "gloss": {
          "en": "How long does it take to get downtown?",
          "ko": "시내까지 얼마나 걸려요?"
        }
      },
      {
        "text": "Quanto tempo leva de ônibus?",
        "slot": "de ônibus",
        "cue": {
          "en": "by bus",
          "ko": "버스로"
        },
        "gloss": {
          "en": "How long does it take by bus?",
          "ko": "버스로 얼마나 걸려요?"
        }
      },
      {
        "text": "Quanto tempo leva para ficar pronto?",
        "slot": "para ficar pronto",
        "cue": {
          "en": "to be ready",
          "ko": "준비되기까지"
        },
        "gloss": {
          "en": "How long does it take to be ready?",
          "ko": "준비되는 데 얼마나 걸려요?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-14",
    "stage": 2,
    "fn": "invite",
    "pattern": "Vamos ___?",
    "core": [
      "Vamos",
      "vamos"
    ],
    "meaning": {
      "en": "Inviting someone: Shall we ___?",
      "ko": "같이 하자고 하기: 우리 ___ 할래?"
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "Vamos ver um filme amanhã?",
        "slot": "ver um filme amanhã",
        "cue": {
          "en": "see a movie tomorrow",
          "ko": "내일 영화 보기"
        },
        "gloss": {
          "en": "Shall we see a movie tomorrow?",
          "ko": "내일 영화 볼래?"
        }
      },
      {
        "text": "Vamos almoçar juntos?",
        "slot": "almoçar juntos",
        "cue": {
          "en": "have lunch together",
          "ko": "같이 점심 먹기"
        },
        "gloss": {
          "en": "Shall we have lunch together?",
          "ko": "같이 점심 먹을래?"
        }
      },
      {
        "text": "Vamos tomar um café depois da aula?",
        "slot": "tomar um café depois da aula",
        "cue": {
          "en": "have a coffee after class",
          "ko": "수업 끝나고 커피 마시기"
        },
        "gloss": {
          "en": "Shall we have a coffee after class?",
          "ko": "수업 끝나고 커피 마실래?"
        }
      },
      {
        "text": "Sábado, vamos à praia?",
        "slot": "à praia",
        "cue": {
          "en": "to the beach",
          "ko": "해변에"
        },
        "gloss": {
          "en": "Shall we go to the beach on Saturday?",
          "ko": "토요일에 해변 갈래?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-15",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Pode ser ___?",
    "core": [
      "Pode ser",
      "pode ser"
    ],
    "meaning": {
      "en": "Suggesting a time or place: How about ___?",
      "ko": "시간·장소 제안하기: ___ 괜찮아?"
    },
    "grammar": [],
    "expressions": [
      "pode ser"
    ],
    "examples": [
      {
        "text": "Pode ser às nove?",
        "slot": "às nove",
        "cue": {
          "en": "at nine",
          "ko": "9시에"
        },
        "gloss": {
          "en": "Can we make it at nine?",
          "ko": "9시 괜찮아?"
        }
      },
      {
        "text": "Pode ser no sábado?",
        "slot": "no sábado",
        "cue": {
          "en": "on Saturday",
          "ko": "토요일에"
        },
        "gloss": {
          "en": "How about Saturday?",
          "ko": "토요일 괜찮아?"
        }
      },
      {
        "text": "Pode ser amanhã à tarde?",
        "slot": "amanhã à tarde",
        "cue": {
          "en": "tomorrow afternoon",
          "ko": "내일 오후"
        },
        "gloss": {
          "en": "How about tomorrow afternoon?",
          "ko": "내일 오후 괜찮아?"
        }
      },
      {
        "text": "Pode ser na frente do shopping?",
        "slot": "na frente do shopping",
        "cue": {
          "en": "in front of the mall",
          "ko": "쇼핑몰 앞"
        },
        "gloss": {
          "en": "How about in front of the mall?",
          "ko": "쇼핑몰 앞에서 볼까?"
        }
      }
    ]
  },
  {
    "id": "pt-f2-16",
    "stage": 2,
    "fn": "decline",
    "pattern": "Que pena, hoje eu ___. Fica pra próxima!",
    "core": [
      "Fica pra próxima",
      "fica pra próxima"
    ],
    "meaning": {
      "en": "Declining politely: Too bad, today I ___. Next time!",
      "ko": "정중히 거절하기: 아쉽다, 오늘은 ___. 다음에 하자!"
    },
    "grammar": [],
    "expressions": [
      "que pena",
      "fica pra próxima"
    ],
    "examples": [
      {
        "text": "Que pena, hoje eu vou trabalhar. Fica pra próxima!",
        "slot": "vou trabalhar",
        "cue": {
          "en": "have to work",
          "ko": "일하러 가야 함"
        },
        "gloss": {
          "en": "Too bad, today I'm working. Next time!",
          "ko": "아쉽다, 오늘은 일해야 해. 다음에 하자!"
        }
      },
      {
        "text": "Que pena, hoje eu tenho aula. Fica pra próxima!",
        "slot": "tenho aula",
        "cue": {
          "en": "have class",
          "ko": "수업이 있음"
        },
        "gloss": {
          "en": "Too bad, today I have class. Next time!",
          "ko": "아쉽다, 오늘은 수업이 있어. 다음에 하자!"
        }
      },
      {
        "text": "Que pena, hoje eu estou trabalhando. Fica pra próxima!",
        "slot": "estou trabalhando",
        "cue": {
          "en": "am working",
          "ko": "일하는 중"
        },
        "gloss": {
          "en": "Too bad, today I'm working. Next time!",
          "ko": "아쉽다, 오늘은 일하는 중이야. 다음에 하자!"
        }
      },
      {
        "text": "Que pena, hoje eu vou jantar com a minha mãe. Fica pra próxima!",
        "slot": "vou jantar com a minha mãe",
        "cue": {
          "en": "am having dinner with my mom",
          "ko": "엄마랑 저녁 먹음"
        },
        "gloss": {
          "en": "Too bad, today I'm having dinner with my mom. Next time!",
          "ko": "아쉽다, 오늘은 엄마랑 저녁 먹어. 다음에 하자!"
        }
      }
    ]
  },
  {
    "id": "pt-f2-17",
    "stage": 2,
    "fn": "reason",
    "pattern": "Tô cansado porque ___.",
    "core": [
      "Tô cansado",
      "tô cansado"
    ],
    "meaning": {
      "en": "Giving a reason: I'm tired because ___.",
      "ko": "이유 말하기: ___ 피곤해."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "tô cansado"
    ],
    "examples": [
      {
        "text": "Tô cansado porque trabalhei muito.",
        "slot": "trabalhei muito",
        "cue": {
          "en": "worked a lot",
          "ko": "일을 많이 했다"
        },
        "gloss": {
          "en": "I'm tired because I worked a lot.",
          "ko": "일을 많이 해서 피곤해."
        }
      },
      {
        "text": "Tô cansado porque dormi pouco.",
        "slot": "dormi pouco",
        "cue": {
          "en": "slept little",
          "ko": "잠을 조금 잤다"
        },
        "gloss": {
          "en": "I'm tired because I didn't sleep much.",
          "ko": "잠을 별로 못 자서 피곤해."
        }
      },
      {
        "text": "Hoje tô cansado porque acordei às cinco.",
        "slot": "acordei às cinco",
        "cue": {
          "en": "woke up at five",
          "ko": "5시에 일어났다"
        },
        "gloss": {
          "en": "Today I'm tired because I woke up at five.",
          "ko": "오늘 5시에 일어나서 피곤해."
        }
      },
      {
        "text": "Tô cansado porque estudei a noite toda.",
        "slot": "estudei a noite toda",
        "cue": {
          "en": "studied all night",
          "ko": "밤새 공부했다"
        },
        "gloss": {
          "en": "I'm tired because I studied all night.",
          "ko": "밤새 공부해서 피곤해."
        }
      }
    ]
  },
  {
    "id": "pt-f2-18",
    "stage": 2,
    "fn": "frequency",
    "pattern": "De vez em quando eu ___.",
    "core": [
      "De vez em quando",
      "de vez em quando"
    ],
    "meaning": {
      "en": "Saying how often: Every now and then I ___.",
      "ko": "빈도 말하기: 가끔 ___."
    },
    "grammar": [],
    "expressions": [
      "de vez em quando"
    ],
    "examples": [
      {
        "text": "De vez em quando eu cozinho para os amigos.",
        "slot": "cozinho para os amigos",
        "cue": {
          "en": "cook for my friends",
          "ko": "친구들에게 요리해 준다"
        },
        "gloss": {
          "en": "Every now and then I cook for my friends.",
          "ko": "가끔 친구들에게 요리해 줘요."
        }
      },
      {
        "text": "De vez em quando eu vou ao cinema.",
        "slot": "vou ao cinema",
        "cue": {
          "en": "go to the movies",
          "ko": "영화관에 간다"
        },
        "gloss": {
          "en": "Every now and then I go to the movies.",
          "ko": "가끔 영화 보러 가요."
        }
      },
      {
        "text": "Eu corro no parque de vez em quando.",
        "slot": "corro no parque",
        "cue": {
          "en": "run in the park",
          "ko": "공원에서 달린다"
        },
        "gloss": {
          "en": "I run in the park every now and then.",
          "ko": "가끔 공원에서 달려요."
        }
      },
      {
        "text": "De vez em quando eu como pão de queijo no café da manhã.",
        "slot": "como pão de queijo",
        "cue": {
          "en": "eat cheese bread",
          "ko": "치즈빵을 먹는다"
        },
        "gloss": {
          "en": "Every now and then I eat cheese bread for breakfast.",
          "ko": "가끔 아침으로 치즈빵을 먹어요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Eu acho que ___.",
    "core": [
      "acho que",
      "Acho que"
    ],
    "meaning": {
      "en": "Giving your opinion: I think ___.",
      "ko": "생각 말하기: 제 생각엔 ___."
    },
    "grammar": [],
    "expressions": [
      "eu acho que"
    ],
    "examples": [
      {
        "text": "Eu acho que a série é ótima.",
        "slot": "a série é ótima",
        "cue": {
          "en": "the series is great",
          "ko": "시리즈가 훌륭하다"
        },
        "gloss": {
          "en": "I think the series is great.",
          "ko": "그 시리즈 정말 좋은 것 같아."
        }
      },
      {
        "text": "Acho que vai chover hoje.",
        "slot": "vai chover hoje",
        "cue": {
          "en": "it's going to rain today",
          "ko": "오늘 비가 오겠다"
        },
        "gloss": {
          "en": "I think it's going to rain today.",
          "ko": "오늘 비가 올 것 같아."
        }
      },
      {
        "text": "Eu acho que o hotel devia trocar o ar-condicionado.",
        "slot": "o hotel devia trocar o ar-condicionado",
        "cue": {
          "en": "the hotel should replace the air conditioner",
          "ko": "호텔이 에어컨을 바꿔야 한다"
        },
        "gloss": {
          "en": "I think the hotel should replace the air conditioner.",
          "ko": "호텔이 에어컨을 바꿔야 할 것 같아요."
        }
      },
      {
        "text": "Sinceramente, eu acho que vale a pena.",
        "slot": "vale a pena",
        "cue": {
          "en": "it's worth it",
          "ko": "그럴 만한 가치가 있다"
        },
        "gloss": {
          "en": "Honestly, I think it's worth it.",
          "ko": "솔직히 그럴 만한 가치가 있다고 생각해."
        }
      }
    ]
  },
  {
    "id": "pt-f3-02",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Na minha opinião, ___.",
    "core": [
      "Na minha opinião",
      "na minha opinião"
    ],
    "meaning": {
      "en": "Giving your opinion: In my opinion, ___.",
      "ko": "의견 말하기: 제 의견으로는 ___."
    },
    "grammar": [],
    "expressions": [
      "na minha opinião"
    ],
    "examples": [
      {
        "text": "Na minha opinião, o segundo episódio é melhor.",
        "slot": "o segundo episódio é melhor",
        "cue": {
          "en": "the second episode is better",
          "ko": "2화가 더 낫다"
        },
        "gloss": {
          "en": "In my opinion, the second episode is better.",
          "ko": "내 생각엔 2화가 더 나아."
        }
      },
      {
        "text": "Na minha opinião, o livro é mais interessante do que o filme.",
        "slot": "o livro é mais interessante do que o filme",
        "cue": {
          "en": "the book is more interesting than the movie",
          "ko": "책이 영화보다 재미있다"
        },
        "gloss": {
          "en": "In my opinion, the book is more interesting than the movie.",
          "ko": "내 생각엔 책이 영화보다 재미있어."
        }
      },
      {
        "text": "Na minha opinião, a gente devia sair mais cedo.",
        "slot": "a gente devia sair mais cedo",
        "cue": {
          "en": "we should leave earlier",
          "ko": "우리가 더 일찍 나가야 한다"
        },
        "gloss": {
          "en": "In my opinion, we should leave earlier.",
          "ko": "내 생각엔 우리 좀 더 일찍 나가야 해."
        }
      },
      {
        "text": "Bom, na minha opinião, depende do preço.",
        "slot": "depende do preço",
        "cue": {
          "en": "it depends on the price",
          "ko": "가격에 달렸다"
        },
        "gloss": {
          "en": "Well, in my opinion, it depends on the price.",
          "ko": "글쎄, 내 생각엔 가격에 달렸어."
        }
      }
    ]
  },
  {
    "id": "pt-f3-03",
    "stage": 3,
    "fn": "habit-past",
    "pattern": "Quando eu era criança, ___.",
    "core": [
      "Quando eu era criança",
      "quando eu era criança"
    ],
    "meaning": {
      "en": "Saying what you used to do: When I was a kid, ___.",
      "ko": "어릴 때 하던 일 말하기: 어렸을 때 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Quando eu era criança, eu morava no interior.",
        "slot": "eu morava no interior",
        "cue": {
          "en": "I lived in the countryside",
          "ko": "시골에 살았다"
        },
        "gloss": {
          "en": "When I was a kid, I lived in the countryside.",
          "ko": "어렸을 때 저는 시골에 살았어요."
        }
      },
      {
        "text": "Quando eu era criança, eu jogava bola todo dia.",
        "slot": "eu jogava bola todo dia",
        "cue": {
          "en": "I played soccer every day",
          "ko": "매일 축구를 했다"
        },
        "gloss": {
          "en": "When I was a kid, I played soccer every day.",
          "ko": "어렸을 때 매일 축구를 했어요."
        }
      },
      {
        "text": "Quando eu era criança, minha avó assistia novela comigo.",
        "slot": "minha avó assistia novela comigo",
        "cue": {
          "en": "my grandma watched soap operas with me",
          "ko": "할머니가 나와 드라마를 봤다"
        },
        "gloss": {
          "en": "When I was a kid, my grandma watched soap operas with me.",
          "ko": "어렸을 때 할머니가 저랑 드라마를 보셨어요."
        }
      },
      {
        "text": "Eu tinha medo do mar quando eu era criança.",
        "slot": "Eu tinha medo do mar",
        "cue": {
          "en": "I was afraid of the sea",
          "ko": "바다를 무서워했다"
        },
        "gloss": {
          "en": "I was afraid of the sea when I was a kid.",
          "ko": "어렸을 때 바다를 무서워했어요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-04",
    "stage": 3,
    "fn": "while-when",
    "pattern": "Eu estava ___ quando começou a chover.",
    "core": [
      "Eu estava",
      "eu estava",
      "estava"
    ],
    "meaning": {
      "en": "Saying what was going on when something happened: I was ___ when it started raining.",
      "ko": "~하던 중에 일어난 일 말하기: ___ 있는데 비가 오기 시작했어요."
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu estava saindo de casa quando começou a chover.",
        "slot": "saindo de casa",
        "cue": {
          "en": "leaving home",
          "ko": "집을 나서다"
        },
        "gloss": {
          "en": "I was leaving home when it started raining.",
          "ko": "집을 나서는데 비가 오기 시작했어요."
        }
      },
      {
        "text": "Eu estava dormindo quando o telefone tocou.",
        "slot": "dormindo",
        "cue": {
          "en": "sleeping",
          "ko": "자다"
        },
        "gloss": {
          "en": "I was sleeping when the phone rang.",
          "ko": "자고 있는데 전화가 울렸어요."
        }
      },
      {
        "text": "Eu estava no ônibus quando você me ligou.",
        "slot": "no ônibus",
        "cue": {
          "en": "on the bus",
          "ko": "버스 안"
        },
        "gloss": {
          "en": "I was on the bus when you called me.",
          "ko": "네가 전화했을 때 나 버스에 있었어."
        }
      },
      {
        "text": "A gente estava jantando quando a luz acabou.",
        "slot": "jantando",
        "cue": {
          "en": "having dinner",
          "ko": "저녁을 먹다"
        },
        "gloss": {
          "en": "We were having dinner when the power went out.",
          "ko": "저녁 먹고 있는데 정전이 됐어요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-05",
    "stage": 3,
    "fn": "wish",
    "pattern": "Espero que ___.",
    "core": [
      "Espero que",
      "espero que"
    ],
    "meaning": {
      "en": "Saying what you hope: I hope ___.",
      "ko": "바람 말하기: ___면 좋겠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Espero que você goste do presente.",
        "slot": "você goste do presente",
        "cue": {
          "en": "you like the present",
          "ko": "선물을 마음에 들어 하다"
        },
        "gloss": {
          "en": "I hope you like the present.",
          "ko": "선물이 마음에 들었으면 좋겠어요."
        }
      },
      {
        "text": "Espero que você melhore logo.",
        "slot": "você melhore logo",
        "cue": {
          "en": "you get better soon",
          "ko": "빨리 낫다"
        },
        "gloss": {
          "en": "I hope you get better soon.",
          "ko": "빨리 낫길 바라요."
        }
      },
      {
        "text": "Espero que vocês se divirtam na viagem.",
        "slot": "vocês se divirtam na viagem",
        "cue": {
          "en": "you all have fun on the trip",
          "ko": "여행에서 즐겁게 보내다"
        },
        "gloss": {
          "en": "I hope you all have fun on the trip.",
          "ko": "다들 여행 즐겁게 보내길 바라요."
        }
      },
      {
        "text": "Espero que a doutora não se importe.",
        "slot": "a doutora não se importe",
        "cue": {
          "en": "the doctor doesn't mind",
          "ko": "의사 선생님이 괜찮아하다"
        },
        "gloss": {
          "en": "I hope the doctor doesn't mind.",
          "ko": "의사 선생님이 괜찮으시면 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-06",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "É importante que ___.",
    "core": [
      "É importante que",
      "é importante que"
    ],
    "meaning": {
      "en": "Saying what matters: It's important that ___.",
      "ko": "중요한 것 말하기: ___는 게 중요해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "É importante que você descanse.",
        "slot": "você descanse",
        "cue": {
          "en": "you rest",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "It's important that you rest.",
          "ko": "푹 쉬는 게 중요해요."
        }
      },
      {
        "text": "É importante que você chegue cedo.",
        "slot": "você chegue cedo",
        "cue": {
          "en": "you arrive early",
          "ko": "일찍 오다"
        },
        "gloss": {
          "en": "It's important that you arrive early.",
          "ko": "일찍 오는 게 중요해요."
        }
      },
      {
        "text": "É importante que eu durma bem hoje.",
        "slot": "eu durma bem hoje",
        "cue": {
          "en": "I sleep well tonight",
          "ko": "오늘 잘 자다"
        },
        "gloss": {
          "en": "It's important that I sleep well tonight.",
          "ko": "오늘은 꼭 잘 자야 해요."
        }
      },
      {
        "text": "Para a consulta, é importante que você traga os exames.",
        "slot": "você traga os exames",
        "cue": {
          "en": "you bring your test results",
          "ko": "검사 결과를 가져오다"
        },
        "gloss": {
          "en": "For the appointment, it's important that you bring your test results.",
          "ko": "진료 때 검사 결과를 꼭 가져오셔야 해요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-07",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Você poderia ___?",
    "core": [
      "poderia",
      "Poderia"
    ],
    "meaning": {
      "en": "Asking politely: Could you ___?",
      "ko": "공손하게 부탁하기: ___ 주실 수 있을까요?"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Você poderia me ajudar com a mala?",
        "slot": "me ajudar com a mala",
        "cue": {
          "en": "help me with the suitcase",
          "ko": "가방 드는 것 돕기"
        },
        "gloss": {
          "en": "Could you help me with the suitcase?",
          "ko": "가방 좀 도와주실 수 있을까요?"
        }
      },
      {
        "text": "Você poderia falar mais devagar?",
        "slot": "falar mais devagar",
        "cue": {
          "en": "speak more slowly",
          "ko": "더 천천히 말하기"
        },
        "gloss": {
          "en": "Could you speak more slowly?",
          "ko": "좀 더 천천히 말씀해 주실 수 있을까요?"
        }
      },
      {
        "text": "Poderia trocar a toalha, por favor?",
        "slot": "trocar a toalha",
        "cue": {
          "en": "change the towel",
          "ko": "수건 바꾸기"
        },
        "gloss": {
          "en": "Could you change the towel, please?",
          "ko": "수건 좀 바꿔 주실 수 있을까요?"
        }
      },
      {
        "text": "Você poderia me mandar uma mensagem para confirmar?",
        "slot": "me mandar uma mensagem para confirmar",
        "cue": {
          "en": "send me a message to confirm",
          "ko": "확인 메시지 보내기"
        },
        "gloss": {
          "en": "Could you send me a message to confirm?",
          "ko": "확인 메시지 좀 보내 주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "pt-f3-08",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Seria possível ___?",
    "core": [
      "Seria possível",
      "seria possível"
    ],
    "meaning": {
      "en": "Asking if something is possible: Would it be possible to ___?",
      "ko": "가능한지 정중히 묻기: ___ 수 있을까요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "seria possível"
    ],
    "examples": [
      {
        "text": "Seria possível trocar de quarto?",
        "slot": "trocar de quarto",
        "cue": {
          "en": "change rooms",
          "ko": "방 바꾸기"
        },
        "gloss": {
          "en": "Would it be possible to change rooms?",
          "ko": "방을 바꿀 수 있을까요?"
        }
      },
      {
        "text": "Seria possível mudar a consulta para quarta?",
        "slot": "mudar a consulta para quarta",
        "cue": {
          "en": "move the appointment to Wednesday",
          "ko": "예약을 수요일로 옮기기"
        },
        "gloss": {
          "en": "Would it be possible to move the appointment to Wednesday?",
          "ko": "예약을 수요일로 옮길 수 있을까요?"
        }
      },
      {
        "text": "Seria possível fazer o check-out mais tarde?",
        "slot": "fazer o check-out mais tarde",
        "cue": {
          "en": "check out later",
          "ko": "늦게 체크아웃하기"
        },
        "gloss": {
          "en": "Would it be possible to check out later?",
          "ko": "체크아웃을 늦게 할 수 있을까요?"
        }
      },
      {
        "text": "Com licença, seria possível ver o cardápio?",
        "slot": "ver o cardápio",
        "cue": {
          "en": "see the menu",
          "ko": "메뉴판 보기"
        },
        "gloss": {
          "en": "Excuse me, would it be possible to see the menu?",
          "ko": "실례지만 메뉴판 좀 볼 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "pt-f3-09",
    "stage": 3,
    "fn": "phone-call",
    "pattern": "Eu te ligo ___.",
    "core": [
      "te ligo",
      "Te ligo"
    ],
    "meaning": {
      "en": "Promising to call: I'll call you ___.",
      "ko": "전화하겠다고 말하기: ___ 전화할게."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu te ligo mais tarde.",
        "slot": "mais tarde",
        "cue": {
          "en": "later",
          "ko": "이따가"
        },
        "gloss": {
          "en": "I'll call you later.",
          "ko": "이따가 전화할게."
        }
      },
      {
        "text": "Te ligo amanhã de manhã.",
        "slot": "amanhã de manhã",
        "cue": {
          "en": "tomorrow morning",
          "ko": "내일 아침"
        },
        "gloss": {
          "en": "I'll call you tomorrow morning.",
          "ko": "내일 아침에 전화할게."
        }
      },
      {
        "text": "Eu te ligo depois do almoço.",
        "slot": "depois do almoço",
        "cue": {
          "en": "after lunch",
          "ko": "점심 먹고"
        },
        "gloss": {
          "en": "I'll call you after lunch.",
          "ko": "점심 먹고 전화할게."
        }
      },
      {
        "text": "Pode deixar, eu te ligo assim que sair do trabalho.",
        "slot": "assim que sair do trabalho",
        "cue": {
          "en": "as soon as I leave work",
          "ko": "퇴근하자마자"
        },
        "gloss": {
          "en": "Don't worry, I'll call you as soon as I leave work.",
          "ko": "걱정 마, 퇴근하자마자 전화할게."
        }
      }
    ]
  },
  {
    "id": "pt-f3-10",
    "stage": 3,
    "fn": "recommend-ask",
    "pattern": "Você me indica ___?",
    "core": [
      "me indica"
    ],
    "meaning": {
      "en": "Asking for a recommendation: Can you recommend ___?",
      "ko": "추천 부탁하기: ___ 추천해 줄래요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "você me indica"
    ],
    "examples": [
      {
        "text": "Você me indica um restaurante bom?",
        "slot": "um restaurante bom",
        "cue": {
          "en": "a good restaurant",
          "ko": "좋은 식당"
        },
        "gloss": {
          "en": "Can you recommend a good restaurant?",
          "ko": "좋은 식당 추천해 줄래요?"
        }
      },
      {
        "text": "Você me indica uma série nova?",
        "slot": "uma série nova",
        "cue": {
          "en": "a new series",
          "ko": "새 시리즈"
        },
        "gloss": {
          "en": "Can you recommend a new series?",
          "ko": "새 시리즈 하나 추천해 줄래?"
        }
      },
      {
        "text": "Você me indica um médico aqui perto?",
        "slot": "um médico aqui perto",
        "cue": {
          "en": "a doctor nearby",
          "ko": "근처 의사"
        },
        "gloss": {
          "en": "Can you recommend a doctor nearby?",
          "ko": "근처에 괜찮은 의사 추천해 주실래요?"
        }
      },
      {
        "text": "E aí, você me indica algum livro?",
        "slot": "algum livro",
        "cue": {
          "en": "a book",
          "ko": "책"
        },
        "gloss": {
          "en": "So, can you recommend a book?",
          "ko": "그래서, 책 하나 추천해 줄래?"
        }
      }
    ]
  },
  {
    "id": "pt-f3-11",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "A gente vai ___.",
    "core": [
      "A gente",
      "a gente"
    ],
    "meaning": {
      "en": "Saying what we're going to do: We're going to ___.",
      "ko": "우리 계획 말하기: 우리 ___ 할 거야."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "A gente vai sair às oito.",
        "slot": "sair às oito",
        "cue": {
          "en": "leave at eight",
          "ko": "8시에 나가다"
        },
        "gloss": {
          "en": "We're going to leave at eight.",
          "ko": "우리 8시에 나갈 거야."
        }
      },
      {
        "text": "A gente vai ver o último episódio hoje.",
        "slot": "ver o último episódio hoje",
        "cue": {
          "en": "watch the last episode today",
          "ko": "오늘 마지막 화를 보다"
        },
        "gloss": {
          "en": "We're going to watch the last episode today.",
          "ko": "우리 오늘 마지막 화 볼 거야."
        }
      },
      {
        "text": "No sábado a gente vai fazer um churrasco.",
        "slot": "fazer um churrasco",
        "cue": {
          "en": "have a barbecue",
          "ko": "바비큐를 하다"
        },
        "gloss": {
          "en": "On Saturday we're having a barbecue.",
          "ko": "토요일에 우리 바비큐 할 거야."
        }
      },
      {
        "text": "Amanhã a gente vai viajar para a Bahia.",
        "slot": "viajar para a Bahia",
        "cue": {
          "en": "travel to Bahia",
          "ko": "바이아로 여행 가다"
        },
        "gloss": {
          "en": "Tomorrow we're going to travel to Bahia.",
          "ko": "내일 우리 바이아로 여행 가."
        }
      }
    ]
  },
  {
    "id": "pt-f3-12",
    "stage": 3,
    "fn": "describe-thing",
    "pattern": "É o lugar onde ___.",
    "core": [
      "onde"
    ],
    "meaning": {
      "en": "Describing a place with a relative clause: It's the place where ___.",
      "ko": "관계절로 장소 설명하기: ___ 곳이에요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "É o restaurante onde a gente se conheceu.",
        "slot": "a gente se conheceu",
        "cue": {
          "en": "we met",
          "ko": "우리가 처음 만났다"
        },
        "gloss": {
          "en": "It's the restaurant where we met.",
          "ko": "우리가 처음 만난 식당이야."
        }
      },
      {
        "text": "Essa é a cidade onde eu nasci.",
        "slot": "eu nasci",
        "cue": {
          "en": "I was born",
          "ko": "내가 태어났다"
        },
        "gloss": {
          "en": "This is the city where I was born.",
          "ko": "여기가 내가 태어난 도시야."
        }
      },
      {
        "text": "É a praia onde eu passava as férias.",
        "slot": "eu passava as férias",
        "cue": {
          "en": "I used to spend my holidays",
          "ko": "방학을 보내곤 했다"
        },
        "gloss": {
          "en": "It's the beach where I used to spend my holidays.",
          "ko": "내가 방학마다 가던 해변이야."
        }
      },
      {
        "text": "Conheço um café onde dá para trabalhar tranquilo.",
        "slot": "dá para trabalhar tranquilo",
        "cue": {
          "en": "you can work in peace",
          "ko": "조용히 일할 수 있다"
        },
        "gloss": {
          "en": "I know a café where you can work in peace.",
          "ko": "조용히 일할 수 있는 카페를 알아."
        }
      }
    ]
  },
  {
    "id": "pt-f3-13",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "Vale a pena ___.",
    "core": [
      "Vale a pena",
      "vale a pena"
    ],
    "meaning": {
      "en": "Saying something is worth it: It's worth ___.",
      "ko": "할 만하다고 말하기: ___ 할 만해요."
    },
    "grammar": [],
    "expressions": [
      "vale a pena"
    ],
    "examples": [
      {
        "text": "Vale a pena ver essa série.",
        "slot": "ver essa série",
        "cue": {
          "en": "watching this series",
          "ko": "이 시리즈 보기"
        },
        "gloss": {
          "en": "It's worth watching this series.",
          "ko": "이 시리즈 볼 만해."
        }
      },
      {
        "text": "Vale a pena provar o acarajé.",
        "slot": "provar o acarajé",
        "cue": {
          "en": "trying acarajé",
          "ko": "아카라제 먹어 보기"
        },
        "gloss": {
          "en": "It's worth trying acarajé.",
          "ko": "아카라제는 꼭 먹어 볼 만해."
        }
      },
      {
        "text": "Acho que vale a pena ir de manhã.",
        "slot": "ir de manhã",
        "cue": {
          "en": "going in the morning",
          "ko": "아침에 가기"
        },
        "gloss": {
          "en": "I think it's worth going in the morning.",
          "ko": "아침에 가는 게 좋을 것 같아."
        }
      },
      {
        "text": "Não vale a pena pagar tão caro.",
        "slot": "pagar tão caro",
        "cue": {
          "en": "paying that much",
          "ko": "그렇게 비싸게 내기"
        },
        "gloss": {
          "en": "It's not worth paying that much.",
          "ko": "그렇게 비싸게 낼 가치는 없어."
        }
      }
    ]
  },
  {
    "id": "pt-f3-14",
    "stage": 3,
    "fn": "complain",
    "pattern": "O ___ não está funcionando.",
    "core": [
      "não está funcionando"
    ],
    "meaning": {
      "en": "Reporting a problem: The ___ isn't working.",
      "ko": "고장 알리기: ___가 작동을 안 해요."
    },
    "grammar": [],
    "expressions": [
      "não está funcionando"
    ],
    "examples": [
      {
        "text": "O ar-condicionado não está funcionando.",
        "slot": "ar-condicionado",
        "cue": {
          "en": "air conditioner",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The air conditioner isn't working.",
          "ko": "에어컨이 작동을 안 해요."
        }
      },
      {
        "text": "O chuveiro do quarto não está funcionando.",
        "slot": "chuveiro do quarto",
        "cue": {
          "en": "shower in the room",
          "ko": "방 샤워기"
        },
        "gloss": {
          "en": "The shower in the room isn't working.",
          "ko": "방 샤워기가 고장 났어요."
        }
      },
      {
        "text": "A internet não está funcionando desde ontem.",
        "slot": "internet",
        "cue": {
          "en": "internet",
          "ko": "인터넷"
        },
        "gloss": {
          "en": "The internet hasn't been working since yesterday.",
          "ko": "어제부터 인터넷이 안 돼요."
        }
      },
      {
        "text": "Desculpa, o cartão não está funcionando.",
        "slot": "cartão",
        "cue": {
          "en": "card",
          "ko": "카드"
        },
        "gloss": {
          "en": "Sorry, the card isn't working.",
          "ko": "죄송한데 카드가 안 돼요."
        }
      }
    ]
  },
  {
    "id": "pt-f3-15",
    "stage": 3,
    "fn": "exchange-return",
    "pattern": "Dá para trocar ___?",
    "core": [
      "Dá para trocar",
      "dá para trocar"
    ],
    "meaning": {
      "en": "Asking to exchange or change: Can I change ___?",
      "ko": "교환·변경 요청하기: ___ 바꿀 수 있어요?"
    },
    "grammar": [],
    "expressions": [
      "dá para trocar"
    ],
    "examples": [
      {
        "text": "Dá para trocar essa camiseta?",
        "slot": "essa camiseta",
        "cue": {
          "en": "this T-shirt",
          "ko": "이 티셔츠"
        },
        "gloss": {
          "en": "Can I exchange this T-shirt?",
          "ko": "이 티셔츠 교환할 수 있어요?"
        }
      },
      {
        "text": "Dá para trocar por um tamanho maior?",
        "slot": "por um tamanho maior",
        "cue": {
          "en": "for a bigger size",
          "ko": "더 큰 사이즈로"
        },
        "gloss": {
          "en": "Can I exchange it for a bigger size?",
          "ko": "더 큰 사이즈로 바꿀 수 있어요?"
        }
      },
      {
        "text": "Dá para trocar a consulta para sexta?",
        "slot": "a consulta para sexta",
        "cue": {
          "en": "the appointment to Friday",
          "ko": "예약을 금요일로"
        },
        "gloss": {
          "en": "Can I move the appointment to Friday?",
          "ko": "예약을 금요일로 바꿀 수 있어요?"
        }
      },
      {
        "text": "Oi, dá para trocar de lugar com você?",
        "slot": "de lugar com você",
        "cue": {
          "en": "seats with you",
          "ko": "자리를"
        },
        "gloss": {
          "en": "Hi, can I swap seats with you?",
          "ko": "저기, 자리 좀 바꿔 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f3-16",
    "stage": 3,
    "fn": "agree",
    "pattern": "Concordo, ___.",
    "core": [
      "Concordo",
      "concordo"
    ],
    "meaning": {
      "en": "Agreeing: I agree, ___.",
      "ko": "동의하기: 맞아, ___."
    },
    "grammar": [],
    "expressions": [
      "concordo"
    ],
    "examples": [
      {
        "text": "Concordo, o final foi ótimo.",
        "slot": "o final foi ótimo",
        "cue": {
          "en": "the ending was great",
          "ko": "결말이 좋았다"
        },
        "gloss": {
          "en": "I agree, the ending was great.",
          "ko": "맞아, 결말 정말 좋았어."
        }
      },
      {
        "text": "Concordo, japonês é caro.",
        "slot": "japonês é caro",
        "cue": {
          "en": "Japanese food is expensive",
          "ko": "일식은 비싸다"
        },
        "gloss": {
          "en": "I agree, Japanese food is expensive.",
          "ko": "맞아, 일식은 비싸."
        }
      },
      {
        "text": "Concordo, a gente precisa descansar.",
        "slot": "a gente precisa descansar",
        "cue": {
          "en": "we need to rest",
          "ko": "우리는 쉬어야 한다"
        },
        "gloss": {
          "en": "I agree, we need to rest.",
          "ko": "맞아, 우리 좀 쉬어야 해."
        }
      },
      {
        "text": "Concordo, é melhor ir de metrô.",
        "slot": "é melhor ir de metrô",
        "cue": {
          "en": "it's better to take the metro",
          "ko": "지하철이 낫다"
        },
        "gloss": {
          "en": "I agree, it's better to take the metro.",
          "ko": "맞아, 지하철로 가는 게 나아."
        }
      }
    ]
  },
  {
    "id": "pt-f3-17",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "Não é bem assim, ___.",
    "core": [
      "Não é bem assim",
      "não é bem assim"
    ],
    "meaning": {
      "en": "Disagreeing gently: It's not quite like that, ___.",
      "ko": "부드럽게 반대하기: 꼭 그렇진 않아, ___."
    },
    "grammar": [],
    "expressions": [
      "não é bem assim"
    ],
    "examples": [
      {
        "text": "Não é bem assim, o segundo episódio é melhor.",
        "slot": "o segundo episódio é melhor",
        "cue": {
          "en": "the second episode is better",
          "ko": "2화가 더 낫다"
        },
        "gloss": {
          "en": "It's not quite like that, the second episode is better.",
          "ko": "꼭 그렇진 않아, 2화가 더 나아."
        }
      },
      {
        "text": "Não é bem assim, tem dias que eu acordo cedo.",
        "slot": "tem dias que eu acordo cedo",
        "cue": {
          "en": "some days I wake up early",
          "ko": "일찍 일어나는 날도 있다"
        },
        "gloss": {
          "en": "It's not quite like that, some days I wake up early.",
          "ko": "꼭 그렇진 않아, 일찍 일어나는 날도 있어."
        }
      },
      {
        "text": "Hum, não é bem assim, o preço subiu muito.",
        "slot": "o preço subiu muito",
        "cue": {
          "en": "the price went up a lot",
          "ko": "가격이 많이 올랐다"
        },
        "gloss": {
          "en": "Hmm, it's not quite like that, the price went up a lot.",
          "ko": "음, 꼭 그렇진 않아, 가격이 많이 올랐어."
        }
      },
      {
        "text": "Não é bem assim, ela não falou isso.",
        "slot": "ela não falou isso",
        "cue": {
          "en": "she didn't say that",
          "ko": "그녀는 그렇게 말 안 했다"
        },
        "gloss": {
          "en": "It's not quite like that, she didn't say that.",
          "ko": "꼭 그렇진 않아, 걔는 그런 말 안 했어."
        }
      }
    ]
  },
  {
    "id": "pt-f3-18",
    "stage": 3,
    "fn": "hearsay",
    "pattern": "Fiquei sabendo que ___.",
    "core": [
      "Fiquei sabendo que",
      "fiquei sabendo que"
    ],
    "meaning": {
      "en": "Passing on what you heard: I heard that ___.",
      "ko": "들은 말 전하기: ___라고 들었어요."
    },
    "grammar": [],
    "expressions": [
      "fiquei sabendo"
    ],
    "examples": [
      {
        "text": "Fiquei sabendo que vocês têm estacionamento.",
        "slot": "vocês têm estacionamento",
        "cue": {
          "en": "you have parking",
          "ko": "주차장이 있다"
        },
        "gloss": {
          "en": "I heard that you have parking.",
          "ko": "주차장이 있다고 들었어요."
        }
      },
      {
        "text": "Fiquei sabendo que a série vai ter outra temporada.",
        "slot": "a série vai ter outra temporada",
        "cue": {
          "en": "the series will have another season",
          "ko": "시리즈가 다음 시즌이 나온다"
        },
        "gloss": {
          "en": "I heard the series will have another season.",
          "ko": "그 시리즈 다음 시즌 나온대."
        }
      },
      {
        "text": "Ontem fiquei sabendo que a Ana vai casar!",
        "slot": "a Ana vai casar",
        "cue": {
          "en": "Ana is getting married",
          "ko": "아나가 결혼한다"
        },
        "gloss": {
          "en": "Yesterday I heard that Ana is getting married!",
          "ko": "어제 아나가 결혼한다는 소식 들었어!"
        }
      },
      {
        "text": "Fiquei sabendo que o restaurante fechou.",
        "slot": "o restaurante fechou",
        "cue": {
          "en": "the restaurant closed",
          "ko": "그 식당이 문을 닫았다"
        },
        "gloss": {
          "en": "I heard that the restaurant closed.",
          "ko": "그 식당 문 닫았다고 들었어."
        }
      }
    ]
  },
  {
    "id": "pt-f3-19",
    "stage": 3,
    "fn": "story-past",
    "pattern": "De repente, ___.",
    "core": [
      "De repente",
      "de repente"
    ],
    "meaning": {
      "en": "Telling a sudden turn in a story: Suddenly, ___.",
      "ko": "이야기 속 갑작스러운 일: 갑자기 ___."
    },
    "grammar": [],
    "expressions": [
      "de repente"
    ],
    "examples": [
      {
        "text": "De repente, começou a chover.",
        "slot": "começou a chover",
        "cue": {
          "en": "it started raining",
          "ko": "비가 오기 시작했다"
        },
        "gloss": {
          "en": "Suddenly, it started raining.",
          "ko": "갑자기 비가 오기 시작했어."
        }
      },
      {
        "text": "De repente, a luz acabou.",
        "slot": "a luz acabou",
        "cue": {
          "en": "the power went out",
          "ko": "정전이 됐다"
        },
        "gloss": {
          "en": "Suddenly, the power went out.",
          "ko": "갑자기 정전이 됐어."
        }
      },
      {
        "text": "Eu estava andando e, de repente, alguém me chamou.",
        "slot": "alguém me chamou",
        "cue": {
          "en": "someone called my name",
          "ko": "누가 나를 불렀다"
        },
        "gloss": {
          "en": "I was walking and, suddenly, someone called my name.",
          "ko": "걷고 있는데 갑자기 누가 나를 불렀어."
        }
      },
      {
        "text": "De repente, o ar-condicionado desligou.",
        "slot": "o ar-condicionado desligou",
        "cue": {
          "en": "the air conditioner turned off",
          "ko": "에어컨이 꺼졌다"
        },
        "gloss": {
          "en": "Suddenly, the air conditioner turned off.",
          "ko": "갑자기 에어컨이 꺼졌어요."
        }
      }
    ]
  }
];
