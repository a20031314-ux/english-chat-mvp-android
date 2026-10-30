import type { Frame } from "../frames.ts";

/** 포르투갈어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  },
  {
    "id": "pt-f4-01",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "Se eu tivesse ___, faria diferente.",
    "core": [
      "Se eu tivesse",
      "se eu tivesse"
    ],
    "meaning": {
      "en": "Imagining an unreal situation: If I had ___, I would…",
      "ko": "가정해서 말하기: 나한테 ___이 있다면, …할 텐데."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Se eu tivesse mais tempo, faria um curso de liderança.",
        "slot": "mais tempo",
        "cue": {
          "en": "more time",
          "ko": "시간이 더"
        },
        "gloss": {
          "en": "If I had more time, I would take a leadership course.",
          "ko": "시간이 더 있으면 리더십 강좌를 들을 텐데."
        }
      },
      {
        "text": "Se eu tivesse um carro, visitaria meus pais todo fim de semana.",
        "slot": "um carro",
        "cue": {
          "en": "a car",
          "ko": "차"
        },
        "gloss": {
          "en": "If I had a car, I would visit my parents every weekend.",
          "ko": "차가 있으면 주말마다 부모님을 뵈러 갈 텐데."
        }
      },
      {
        "text": "Sinceramente, se eu tivesse coragem, pediria um aumento.",
        "slot": "coragem",
        "cue": {
          "en": "courage",
          "ko": "용기"
        },
        "gloss": {
          "en": "Honestly, if I had the courage, I would ask for a raise.",
          "ko": "솔직히 용기가 있으면 월급 올려 달라고 할 텐데."
        }
      },
      {
        "text": "Se eu tivesse essa chance, mudaria de área.",
        "slot": "essa chance",
        "cue": {
          "en": "that chance",
          "ko": "그런 기회"
        },
        "gloss": {
          "en": "If I had that chance, I would change fields.",
          "ko": "그런 기회가 있다면 분야를 바꿀 텐데."
        }
      }
    ]
  },
  {
    "id": "pt-f4-02",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "Se ___, eu ficaria muito feliz.",
    "core": [
      "eu ficaria"
    ],
    "meaning": {
      "en": "Saying how you would feel: If ___, I would be…",
      "ko": "가정해서 기분 말하기: ___라면 나는 …할 텐데."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Se a empresa me desse essa opção, eu ficaria muito feliz.",
        "slot": "a empresa me desse essa opção",
        "cue": {
          "en": "the company gives me that option",
          "ko": "회사가 그런 선택지를 주다"
        },
        "gloss": {
          "en": "If the company gave me that option, I would be very happy.",
          "ko": "회사가 그런 선택지를 주면 정말 기쁠 텐데."
        }
      },
      {
        "text": "Se vocês viessem ao casamento, eu ficaria muito feliz.",
        "slot": "vocês viessem ao casamento",
        "cue": {
          "en": "you all come to the wedding",
          "ko": "너희가 결혼식에 오다"
        },
        "gloss": {
          "en": "If you came to the wedding, I would be very happy.",
          "ko": "너희가 결혼식에 와 주면 정말 기쁠 거야."
        }
      },
      {
        "text": "Se o voo atrasasse de novo, eu ficaria louco.",
        "slot": "o voo atrasasse de novo",
        "cue": {
          "en": "the flight is delayed again",
          "ko": "비행기가 또 늦어지다"
        },
        "gloss": {
          "en": "If the flight were delayed again, I would go crazy.",
          "ko": "비행기가 또 늦어지면 미쳐 버릴 거야."
        }
      },
      {
        "text": "Se ninguém me avisasse, eu ficaria chateado.",
        "slot": "ninguém me avisasse",
        "cue": {
          "en": "nobody tells me",
          "ko": "아무도 나에게 알려 주지 않다"
        },
        "gloss": {
          "en": "If nobody told me, I would be upset.",
          "ko": "아무도 안 알려 주면 서운할 거야."
        }
      }
    ]
  },
  {
    "id": "pt-f4-03",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "Quando você puder, ___.",
    "core": [
      "Quando você puder",
      "quando você puder"
    ],
    "meaning": {
      "en": "Asking without pressure: When you can, ___.",
      "ko": "부담 없이 부탁하기: 될 때 ___ 해 줘."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Quando você puder, me manda o relatório.",
        "slot": "me manda o relatório",
        "cue": {
          "en": "send me the report",
          "ko": "보고서를 보내 주다"
        },
        "gloss": {
          "en": "When you can, send me the report.",
          "ko": "될 때 보고서 좀 보내 줘."
        }
      },
      {
        "text": "Quando você puder, dá uma revisada nesse texto.",
        "slot": "dá uma revisada nesse texto",
        "cue": {
          "en": "look over this text",
          "ko": "이 글을 한번 검토하다"
        },
        "gloss": {
          "en": "When you can, take a look over this text.",
          "ko": "시간 될 때 이 글 한번 봐 줘."
        }
      },
      {
        "text": "Me liga quando você puder, sem pressa.",
        "slot": "Me liga",
        "cue": {
          "en": "call me",
          "ko": "전화하다"
        },
        "gloss": {
          "en": "Call me when you can, no rush.",
          "ko": "될 때 전화 줘, 급한 거 아니야."
        }
      },
      {
        "text": "Quando você puder, passa aqui na minha sala.",
        "slot": "passa aqui na minha sala",
        "cue": {
          "en": "stop by my office",
          "ko": "내 사무실에 들르다"
        },
        "gloss": {
          "en": "When you can, stop by my office.",
          "ko": "될 때 내 방에 잠깐 들러 줘."
        }
      }
    ]
  },
  {
    "id": "pt-f4-04",
    "stage": 4,
    "fn": "deadline",
    "pattern": "Assim que ___, me avisa.",
    "core": [
      "Assim que",
      "assim que"
    ],
    "meaning": {
      "en": "Saying what happens right after: As soon as ___, let me know.",
      "ko": "바로 뒤에 할 일 말하기: ___하자마자 알려 줘."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Assim que você falar com eles, me avisa.",
        "slot": "você falar com eles",
        "cue": {
          "en": "you talk to them",
          "ko": "네가 그들과 이야기하다"
        },
        "gloss": {
          "en": "As soon as you talk to them, let me know.",
          "ko": "그 사람들이랑 얘기하자마자 알려 줘."
        }
      },
      {
        "text": "Assim que o contrato chegar, eu assino.",
        "slot": "o contrato chegar",
        "cue": {
          "en": "the contract arrives",
          "ko": "계약서가 도착하다"
        },
        "gloss": {
          "en": "As soon as the contract arrives, I'll sign it.",
          "ko": "계약서가 오자마자 서명할게."
        }
      },
      {
        "text": "Te mando as fotos assim que eu chegar em casa.",
        "slot": "eu chegar em casa",
        "cue": {
          "en": "I get home",
          "ko": "내가 집에 도착하다"
        },
        "gloss": {
          "en": "I'll send you the photos as soon as I get home.",
          "ko": "집에 도착하자마자 사진 보내 줄게."
        }
      },
      {
        "text": "Assim que a gente tiver uma resposta, publicamos a vaga.",
        "slot": "a gente tiver uma resposta",
        "cue": {
          "en": "we have an answer",
          "ko": "우리가 답을 받다"
        },
        "gloss": {
          "en": "As soon as we have an answer, we'll post the job.",
          "ko": "답이 나오자마자 채용 공고를 올릴게요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-05",
    "stage": 4,
    "fn": "concede",
    "pattern": "Embora seja ___, vale a pena.",
    "core": [
      "Embora seja",
      "embora seja"
    ],
    "meaning": {
      "en": "Admitting a downside: Although it is ___, …",
      "ko": "단점 인정하기: 비록 ___지만, …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Embora seja caro, o curso vale o investimento.",
        "slot": "caro",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "Although it's expensive, the course is worth the investment.",
          "ko": "비싸긴 해도 그 강좌는 투자할 만해요."
        }
      },
      {
        "text": "Embora seja longe, o bairro é muito tranquilo.",
        "slot": "longe",
        "cue": {
          "en": "far",
          "ko": "멀다"
        },
        "gloss": {
          "en": "Although it's far, the neighborhood is very quiet.",
          "ko": "멀긴 하지만 그 동네는 아주 조용해."
        }
      },
      {
        "text": "A proposta é boa, embora seja arriscada.",
        "slot": "arriscada",
        "cue": {
          "en": "risky",
          "ko": "위험하다"
        },
        "gloss": {
          "en": "The proposal is good, although it's risky.",
          "ko": "제안은 좋아요, 위험하긴 하지만요."
        }
      },
      {
        "text": "Embora seja só uma ideia, quero ouvir a opinião de vocês.",
        "slot": "só uma ideia",
        "cue": {
          "en": "just an idea",
          "ko": "그냥 아이디어"
        },
        "gloss": {
          "en": "Although it's just an idea, I want to hear your opinion.",
          "ko": "그냥 아이디어일 뿐이지만 여러분 의견을 듣고 싶어요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-06",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "Vou ___ para vocês saberem.",
    "core": [
      "para vocês saberem"
    ],
    "meaning": {
      "en": "Saying why you share something: I'll ___ so you (all) know.",
      "ko": "공유하는 이유 말하기: 여러분이 알 수 있게 ___할게요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Vou mandar a agenda hoje para vocês saberem.",
        "slot": "mandar a agenda hoje",
        "cue": {
          "en": "send the schedule today",
          "ko": "오늘 일정을 보내다"
        },
        "gloss": {
          "en": "I'll send the schedule today so you know.",
          "ko": "여러분이 알 수 있게 오늘 일정 보낼게요."
        }
      },
      {
        "text": "Vou explicar o processo de novo para vocês saberem.",
        "slot": "explicar o processo de novo",
        "cue": {
          "en": "explain the process again",
          "ko": "과정을 다시 설명하다"
        },
        "gloss": {
          "en": "I'll explain the process again so you know.",
          "ko": "여러분이 알 수 있게 과정을 다시 설명할게요."
        }
      },
      {
        "text": "Vou deixar tudo anotado no quadro para vocês saberem.",
        "slot": "deixar tudo anotado no quadro",
        "cue": {
          "en": "write everything on the board",
          "ko": "전부 칠판에 적어 두다"
        },
        "gloss": {
          "en": "I'll leave everything written on the board so you know.",
          "ko": "알 수 있게 전부 칠판에 적어 둘게요."
        }
      },
      {
        "text": "Vou compartilhar a planilha para vocês saberem quem faz o quê.",
        "slot": "compartilhar a planilha",
        "cue": {
          "en": "share the spreadsheet",
          "ko": "스프레드시트를 공유하다"
        },
        "gloss": {
          "en": "I'll share the spreadsheet so you know who does what.",
          "ko": "누가 뭘 하는지 알 수 있게 스프레드시트 공유할게요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-07",
    "stage": 4,
    "fn": "report",
    "pattern": "Tenho trabalhado ___.",
    "core": [
      "tenho trabalhado",
      "Tenho trabalhado"
    ],
    "meaning": {
      "en": "Saying what you've been doing lately: I've been working ___.",
      "ko": "요즘 계속 해 온 일 말하기: 요즘 ___ 일해 왔어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tenho trabalhado muito nas últimas semanas.",
        "slot": "muito nas últimas semanas",
        "cue": {
          "en": "a lot in recent weeks",
          "ko": "최근 몇 주 동안 많이"
        },
        "gloss": {
          "en": "I've been working a lot in the last few weeks.",
          "ko": "최근 몇 주 동안 일을 많이 했어요."
        }
      },
      {
        "text": "Nos últimos dois anos, tenho trabalhado com aplicativos de saúde.",
        "slot": "com aplicativos de saúde",
        "cue": {
          "en": "with health apps",
          "ko": "건강 앱 관련"
        },
        "gloss": {
          "en": "For the last two years, I've been working with health apps.",
          "ko": "지난 이 년 동안 건강 앱 관련 일을 해 왔어요."
        }
      },
      {
        "text": "Ultimamente tenho trabalhado de casa às sextas.",
        "slot": "de casa às sextas",
        "cue": {
          "en": "from home on Fridays",
          "ko": "금요일마다 집에서"
        },
        "gloss": {
          "en": "Lately I've been working from home on Fridays.",
          "ko": "요즘 금요일마다 재택근무를 하고 있어요."
        }
      },
      {
        "text": "Eu tenho trabalhado até tarde e quase não vejo meus filhos.",
        "slot": "até tarde",
        "cue": {
          "en": "until late",
          "ko": "늦게까지"
        },
        "gloss": {
          "en": "I've been working late and I hardly see my kids.",
          "ko": "요즘 늦게까지 일해서 아이들을 거의 못 봐요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-08",
    "stage": 4,
    "fn": "feel",
    "pattern": "Tenho sentido falta de ___.",
    "core": [
      "tenho sentido falta",
      "Tenho sentido falta"
    ],
    "meaning": {
      "en": "Saying what you've been missing: I've been missing ___.",
      "ko": "요즘 그리운 것 말하기: 요즘 ___이 그리워요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tenho sentido falta das pessoas do escritório.",
        "slot": "das pessoas do escritório",
        "cue": {
          "en": "the people at the office",
          "ko": "사무실 사람들"
        },
        "gloss": {
          "en": "I've been missing the people at the office.",
          "ko": "요즘 사무실 사람들이 그리워요."
        }
      },
      {
        "text": "Desde que me mudei, tenho sentido falta da comida da minha mãe.",
        "slot": "da comida da minha mãe",
        "cue": {
          "en": "my mother's cooking",
          "ko": "엄마가 해 준 음식"
        },
        "gloss": {
          "en": "Since I moved, I've been missing my mother's cooking.",
          "ko": "이사한 뒤로 엄마 음식이 그리워요."
        }
      },
      {
        "text": "Confesso que tenho sentido falta de uma rotina.",
        "slot": "de uma rotina",
        "cue": {
          "en": "a routine",
          "ko": "규칙적인 생활"
        },
        "gloss": {
          "en": "I confess I've been missing a routine.",
          "ko": "솔직히 규칙적인 생활이 그리워요."
        }
      },
      {
        "text": "Tenho sentido falta de conversar com vocês.",
        "slot": "de conversar com vocês",
        "cue": {
          "en": "talking with you all",
          "ko": "너희와 이야기하는 것"
        },
        "gloss": {
          "en": "I've been missing talking with you all.",
          "ko": "너희랑 얘기하던 게 그리워."
        }
      }
    ]
  },
  {
    "id": "pt-f4-09",
    "stage": 4,
    "fn": "report",
    "pattern": "Ele disse que ___.",
    "core": [
      "disse que",
      "disseram que"
    ],
    "meaning": {
      "en": "Passing on what someone said: He said (that) ___.",
      "ko": "남의 말 옮기기: 그가 ___라고 했어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ele disse que ia chegar atrasado.",
        "slot": "ia chegar atrasado",
        "cue": {
          "en": "he was going to be late",
          "ko": "늦게 올 것이다"
        },
        "gloss": {
          "en": "He said he was going to be late.",
          "ko": "그가 늦게 올 거라고 했어요."
        }
      },
      {
        "text": "A gerente disse que o projeto estava atrasado.",
        "slot": "o projeto estava atrasado",
        "cue": {
          "en": "the project is behind schedule",
          "ko": "프로젝트가 늦어지고 있다"
        },
        "gloss": {
          "en": "The manager said the project was behind schedule.",
          "ko": "매니저가 프로젝트가 늦어지고 있다고 했어요."
        }
      },
      {
        "text": "Os clientes disseram que tinham gostado da proposta.",
        "slot": "tinham gostado da proposta",
        "cue": {
          "en": "they liked the proposal",
          "ko": "제안이 마음에 들었다"
        },
        "gloss": {
          "en": "The clients said they had liked the proposal.",
          "ko": "고객들이 제안이 마음에 들었다고 했어요."
        }
      },
      {
        "text": "Minha colega disse que não podia vir à reunião.",
        "slot": "não podia vir à reunião",
        "cue": {
          "en": "she can't come to the meeting",
          "ko": "회의에 올 수 없다"
        },
        "gloss": {
          "en": "My colleague said she couldn't come to the meeting.",
          "ko": "동료가 회의에 못 온다고 했어요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-10",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Fala-se muito de ___, mas pouco se faz.",
    "core": [
      "Fala-se muito",
      "fala-se muito"
    ],
    "meaning": {
      "en": "Talking about what people in general say: There's a lot of talk about ___.",
      "ko": "사람들이 흔히 하는 말 꺼내기: ___ 얘기가 많아요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Fala-se muito de produtividade, mas pouco se faz.",
        "slot": "de produtividade",
        "cue": {
          "en": "productivity",
          "ko": "생산성"
        },
        "gloss": {
          "en": "There's a lot of talk about productivity, but little gets done.",
          "ko": "생산성 얘기는 많은데 실제로 하는 건 별로 없어요."
        }
      },
      {
        "text": "Hoje em dia fala-se muito de inteligência artificial.",
        "slot": "de inteligência artificial",
        "cue": {
          "en": "artificial intelligence",
          "ko": "인공지능"
        },
        "gloss": {
          "en": "These days there's a lot of talk about artificial intelligence.",
          "ko": "요즘 인공지능 얘기가 많아요."
        }
      },
      {
        "text": "Fala-se muito em investir, mas pouco em como guardar dinheiro.",
        "slot": "em investir",
        "cue": {
          "en": "investing",
          "ko": "투자하기"
        },
        "gloss": {
          "en": "People talk a lot about investing, but little about how to save money.",
          "ko": "투자 얘기는 많지만 돈 모으는 법 얘기는 별로 없어요."
        }
      },
      {
        "text": "Na empresa, fala-se muito sobre a nova diretora.",
        "slot": "sobre a nova diretora",
        "cue": {
          "en": "the new director",
          "ko": "새 이사"
        },
        "gloss": {
          "en": "At the company, there's a lot of talk about the new director.",
          "ko": "회사에서 새 이사 얘기가 많아요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-11",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Por um lado, ___.",
    "core": [
      "Por um lado",
      "por um lado"
    ],
    "meaning": {
      "en": "Giving one side: On the one hand, ___.",
      "ko": "한쪽 면 말하기: 한편으로는 ___."
    },
    "grammar": [],
    "expressions": [
      "por um lado"
    ],
    "examples": [
      {
        "text": "Por um lado, podemos entregar as telas principais na sexta.",
        "slot": "podemos entregar as telas principais na sexta",
        "cue": {
          "en": "we can deliver the main screens on Friday",
          "ko": "금요일에 주요 화면을 넘길 수 있다"
        },
        "gloss": {
          "en": "On the one hand, we can deliver the main screens on Friday.",
          "ko": "한편으로는 금요일에 주요 화면을 넘길 수 있어요."
        }
      },
      {
        "text": "Por um lado, o home office economiza tempo.",
        "slot": "o home office economiza tempo",
        "cue": {
          "en": "working from home saves time",
          "ko": "재택근무가 시간을 아껴 준다"
        },
        "gloss": {
          "en": "On the one hand, working from home saves time.",
          "ko": "한편으로는 재택근무가 시간을 아껴 줘요."
        }
      },
      {
        "text": "Por um lado, o salário é ótimo, mas a viagem é longa.",
        "slot": "o salário é ótimo",
        "cue": {
          "en": "the salary is great",
          "ko": "월급이 아주 좋다"
        },
        "gloss": {
          "en": "On the one hand, the salary is great, but the commute is long.",
          "ko": "한편으로는 월급이 아주 좋은데, 출퇴근이 길어요."
        }
      },
      {
        "text": "Entendo que, por um lado, a mudança assusta.",
        "slot": "a mudança assusta",
        "cue": {
          "en": "change is scary",
          "ko": "변화가 두렵다"
        },
        "gloss": {
          "en": "I understand that, on the one hand, change is scary.",
          "ko": "한편으로는 변화가 두렵다는 거 이해해요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-12",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Por outro lado, ___.",
    "core": [
      "Por outro lado",
      "por outro lado"
    ],
    "meaning": {
      "en": "Giving the other side: On the other hand, ___.",
      "ko": "다른 면 말하기: 다른 한편으로는 ___."
    },
    "grammar": [],
    "expressions": [
      "por outro lado"
    ],
    "examples": [
      {
        "text": "Por outro lado, os testes ficam para terça.",
        "slot": "os testes ficam para terça",
        "cue": {
          "en": "the tests are left for Tuesday",
          "ko": "테스트는 화요일로 미뤄진다"
        },
        "gloss": {
          "en": "On the other hand, the tests are left for Tuesday.",
          "ko": "다른 한편으로는 테스트가 화요일로 넘어가요."
        }
      },
      {
        "text": "Por outro lado, a gente perde o contato com a equipe.",
        "slot": "a gente perde o contato com a equipe",
        "cue": {
          "en": "we lose contact with the team",
          "ko": "팀과의 접촉을 잃는다"
        },
        "gloss": {
          "en": "On the other hand, we lose contact with the team.",
          "ko": "반면에 팀과 만날 일이 줄어들어요."
        }
      },
      {
        "text": "O aluguel é barato; por outro lado, o bairro é barulhento.",
        "slot": "o bairro é barulhento",
        "cue": {
          "en": "the neighborhood is noisy",
          "ko": "동네가 시끄럽다"
        },
        "gloss": {
          "en": "The rent is cheap; on the other hand, the neighborhood is noisy.",
          "ko": "월세는 싸요. 반면에 동네가 시끄러워요."
        }
      },
      {
        "text": "Por outro lado, a longo prazo essas coisinhas fazem diferença.",
        "slot": "a longo prazo essas coisinhas fazem diferença",
        "cue": {
          "en": "in the long run these little things matter",
          "ko": "길게 보면 이런 작은 것들이 차이를 만든다"
        },
        "gloss": {
          "en": "On the other hand, in the long run these little things make a difference.",
          "ko": "반면에 길게 보면 이런 작은 게 차이를 만들어요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-13",
    "stage": 4,
    "fn": "concede",
    "pattern": "Entendo seu ponto, só que ___.",
    "core": [
      "Entendo seu ponto",
      "entendo seu ponto"
    ],
    "meaning": {
      "en": "Granting a point, then objecting: I see your point, but ___.",
      "ko": "인정하고 반대하기: 무슨 말인지 알아요, 다만 ___."
    },
    "grammar": [],
    "expressions": [
      "entendo seu ponto",
      "só que"
    ],
    "examples": [
      {
        "text": "Entendo seu ponto, só que o prazo é muito curto.",
        "slot": "o prazo é muito curto",
        "cue": {
          "en": "the deadline is very short",
          "ko": "마감이 너무 촉박하다"
        },
        "gloss": {
          "en": "I see your point, but the deadline is very short.",
          "ko": "무슨 말인지 알아요, 다만 마감이 너무 촉박해요."
        }
      },
      {
        "text": "Entendo seu ponto, só que a equipe já está cansada.",
        "slot": "a equipe já está cansada",
        "cue": {
          "en": "the team is already tired",
          "ko": "팀이 이미 지쳐 있다"
        },
        "gloss": {
          "en": "I see your point, but the team is already tired.",
          "ko": "말씀 이해해요, 다만 팀이 이미 지쳐 있어요."
        }
      },
      {
        "text": "Olha, entendo seu ponto, só que os números não confirmam isso.",
        "slot": "os números não confirmam isso",
        "cue": {
          "en": "the numbers don't confirm it",
          "ko": "숫자가 그걸 뒷받침하지 않는다"
        },
        "gloss": {
          "en": "Look, I see your point, but the numbers don't back it up.",
          "ko": "저기, 무슨 말인지 알지만 수치가 그걸 뒷받침하지 않아요."
        }
      },
      {
        "text": "Entendo seu ponto, só que eu nunca atrasei o aluguel.",
        "slot": "eu nunca atrasei o aluguel",
        "cue": {
          "en": "I've never been late with the rent",
          "ko": "월세를 한 번도 밀린 적 없다"
        },
        "gloss": {
          "en": "I see your point, but I've never been late with the rent.",
          "ko": "이해는 하는데요, 저는 월세를 한 번도 밀린 적이 없어요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-14",
    "stage": 4,
    "fn": "persuade",
    "pattern": "A questão é que ___.",
    "core": [
      "A questão é que",
      "a questão é que"
    ],
    "meaning": {
      "en": "Pointing to the real issue: The thing is (that) ___.",
      "ko": "핵심 짚기: 문제는 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "a questão é"
    ],
    "examples": [
      {
        "text": "A questão é que a equipe está cansada.",
        "slot": "a equipe está cansada",
        "cue": {
          "en": "the team is tired",
          "ko": "팀이 지쳐 있다"
        },
        "gloss": {
          "en": "The thing is that the team is tired.",
          "ko": "문제는 팀이 지쳐 있다는 거예요."
        }
      },
      {
        "text": "A questão é que ninguém leu o contrato direito.",
        "slot": "ninguém leu o contrato direito",
        "cue": {
          "en": "nobody read the contract properly",
          "ko": "아무도 계약서를 제대로 읽지 않았다"
        },
        "gloss": {
          "en": "The thing is that nobody read the contract properly.",
          "ko": "문제는 아무도 계약서를 제대로 안 읽었다는 거예요."
        }
      },
      {
        "text": "Eu até gosto da ideia; a questão é que não temos orçamento.",
        "slot": "não temos orçamento",
        "cue": {
          "en": "we don't have a budget",
          "ko": "예산이 없다"
        },
        "gloss": {
          "en": "I actually like the idea; the thing is we don't have a budget.",
          "ko": "아이디어는 좋은데, 문제는 예산이 없다는 거예요."
        }
      },
      {
        "text": "A questão é que o cliente mudou de ideia de novo.",
        "slot": "o cliente mudou de ideia de novo",
        "cue": {
          "en": "the client changed their mind again",
          "ko": "고객이 또 마음을 바꿨다"
        },
        "gloss": {
          "en": "The thing is that the client changed their mind again.",
          "ko": "문제는 고객이 또 마음을 바꿨다는 거예요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-15",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Tem como ___?",
    "core": [
      "Tem como",
      "tem como"
    ],
    "meaning": {
      "en": "Asking if something is possible: Is there a way to ___?",
      "ko": "가능한지 묻기: ___할 수 있을까요?"
    },
    "grammar": [],
    "expressions": [
      "tem como",
      "chegar a um acordo"
    ],
    "examples": [
      {
        "text": "Tem como a gente chegar a um acordo?",
        "slot": "a gente chegar a um acordo",
        "cue": {
          "en": "we reach an agreement",
          "ko": "우리가 합의에 이르다"
        },
        "gloss": {
          "en": "Is there a way we can reach an agreement?",
          "ko": "우리 합의할 방법이 있을까요?"
        }
      },
      {
        "text": "Tem como mudar a reunião para amanhã?",
        "slot": "mudar a reunião para amanhã",
        "cue": {
          "en": "move the meeting to tomorrow",
          "ko": "회의를 내일로 옮기다"
        },
        "gloss": {
          "en": "Is there a way to move the meeting to tomorrow?",
          "ko": "회의를 내일로 옮길 수 있을까요?"
        }
      },
      {
        "text": "Moço, tem como dar um desconto?",
        "slot": "dar um desconto",
        "cue": {
          "en": "give a discount",
          "ko": "할인해 주다"
        },
        "gloss": {
          "en": "Excuse me, is there any way to give a discount?",
          "ko": "저기요, 좀 깎아 주실 수 있어요?"
        }
      },
      {
        "text": "Tem como você me mandar isso por escrito?",
        "slot": "você me mandar isso por escrito",
        "cue": {
          "en": "you send me this in writing",
          "ko": "그걸 서면으로 보내 주다"
        },
        "gloss": {
          "en": "Could you possibly send me this in writing?",
          "ko": "그거 서면으로 보내 줄 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "pt-f4-16",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Levando em conta ___, acho justo.",
    "core": [
      "Levando em conta",
      "levando em conta"
    ],
    "meaning": {
      "en": "Taking a factor into account: Taking ___ into account, …",
      "ko": "고려할 점 말하기: ___을 고려하면, …"
    },
    "grammar": [],
    "expressions": [
      "levando em conta"
    ],
    "examples": [
      {
        "text": "Levando em conta que eu mesmo pintei a sala, acho justo.",
        "slot": "que eu mesmo pintei a sala",
        "cue": {
          "en": "that I painted the living room myself",
          "ko": "내가 직접 거실을 칠했다는 것"
        },
        "gloss": {
          "en": "Taking into account that I painted the living room myself, I think it's fair.",
          "ko": "제가 직접 거실을 칠한 걸 생각하면 공정하다고 봐요."
        }
      },
      {
        "text": "Levando em conta o prazo, vamos priorizar o essencial.",
        "slot": "o prazo",
        "cue": {
          "en": "the deadline",
          "ko": "마감"
        },
        "gloss": {
          "en": "Taking the deadline into account, let's prioritize the essentials.",
          "ko": "마감을 고려하면 꼭 필요한 것부터 합시다."
        }
      },
      {
        "text": "O preço é bom, levando em conta a localização.",
        "slot": "a localização",
        "cue": {
          "en": "the location",
          "ko": "위치"
        },
        "gloss": {
          "en": "The price is good, taking the location into account.",
          "ko": "위치를 생각하면 가격이 괜찮아요."
        }
      },
      {
        "text": "Levando em conta a experiência dela, ela merece a vaga.",
        "slot": "a experiência dela",
        "cue": {
          "en": "her experience",
          "ko": "그녀의 경력"
        },
        "gloss": {
          "en": "Taking her experience into account, she deserves the job.",
          "ko": "그녀의 경력을 고려하면 그 자리를 맡을 만해요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-17",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Em compensação, ___.",
    "core": [
      "Em compensação",
      "em compensação"
    ],
    "meaning": {
      "en": "Offering something in return: In return / On the plus side, ___.",
      "ko": "대신 내놓기: 그 대신 ___."
    },
    "grammar": [],
    "expressions": [
      "em compensação"
    ],
    "examples": [
      {
        "text": "Em compensação, posso assinar por mais dois anos.",
        "slot": "posso assinar por mais dois anos",
        "cue": {
          "en": "I can sign for two more years",
          "ko": "이 년 더 계약할 수 있다"
        },
        "gloss": {
          "en": "In return, I can sign for two more years.",
          "ko": "그 대신 이 년 더 계약할 수 있어요."
        }
      },
      {
        "text": "O salário é menor; em compensação, o horário é flexível.",
        "slot": "o horário é flexível",
        "cue": {
          "en": "the hours are flexible",
          "ko": "근무 시간이 유연하다"
        },
        "gloss": {
          "en": "The salary is lower; on the other hand, the hours are flexible.",
          "ko": "월급은 적지만 그 대신 근무 시간이 자유로워요."
        }
      },
      {
        "text": "Eu fico até mais tarde hoje. Em compensação, saio cedo na sexta.",
        "slot": "saio cedo na sexta",
        "cue": {
          "en": "I leave early on Friday",
          "ko": "금요일에 일찍 나가다"
        },
        "gloss": {
          "en": "I'll stay later today. In return, I'll leave early on Friday.",
          "ko": "오늘 좀 늦게까지 있을게요. 대신 금요일엔 일찍 갈게요."
        }
      },
      {
        "text": "Em compensação, a gente oferece o frete grátis.",
        "slot": "a gente oferece o frete grátis",
        "cue": {
          "en": "we offer free shipping",
          "ko": "무료 배송을 해 주다"
        },
        "gloss": {
          "en": "In return, we offer free shipping.",
          "ko": "그 대신 무료 배송을 해 드려요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-18",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "O lado bom é que ___.",
    "core": [
      "O lado bom é que",
      "o lado bom é que"
    ],
    "meaning": {
      "en": "Pointing out the upside: The good thing is (that) ___.",
      "ko": "좋은 점 짚기: 좋은 점은 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "o lado bom é"
    ],
    "examples": [
      {
        "text": "O lado bom é que ninguém precisa se preocupar com isso tão cedo.",
        "slot": "ninguém precisa se preocupar com isso tão cedo",
        "cue": {
          "en": "nobody needs to worry about it any time soon",
          "ko": "당분간 아무도 그걸 걱정할 필요가 없다"
        },
        "gloss": {
          "en": "The good thing is nobody needs to worry about it any time soon.",
          "ko": "좋은 점은 당분간 아무도 그걸 걱정할 필요가 없다는 거예요."
        }
      },
      {
        "text": "Choveu o dia todo, mas o lado bom é que a gente descansou.",
        "slot": "a gente descansou",
        "cue": {
          "en": "we rested",
          "ko": "우리가 쉬었다"
        },
        "gloss": {
          "en": "It rained all day, but the good thing is we rested.",
          "ko": "하루 종일 비가 왔지만 좋은 점은 푹 쉬었다는 거야."
        }
      },
      {
        "text": "O lado bom é que o escritório fica perto do metrô.",
        "slot": "o escritório fica perto do metrô",
        "cue": {
          "en": "the office is near the subway",
          "ko": "사무실이 지하철역 가까이에 있다"
        },
        "gloss": {
          "en": "The good thing is the office is near the subway.",
          "ko": "좋은 점은 사무실이 지하철역에서 가깝다는 거예요."
        }
      },
      {
        "text": "Perdi o voo; o lado bom é que conheci a cidade.",
        "slot": "conheci a cidade",
        "cue": {
          "en": "I got to know the city",
          "ko": "도시를 구경했다"
        },
        "gloss": {
          "en": "I missed the flight; the good thing is I got to see the city.",
          "ko": "비행기를 놓쳤지만 좋은 점은 도시를 구경했다는 거야."
        }
      }
    ]
  },
  {
    "id": "pt-f4-19",
    "stage": 4,
    "fn": "report",
    "pattern": "Em resumo, ___.",
    "core": [
      "Em resumo",
      "em resumo"
    ],
    "meaning": {
      "en": "Summing up: In short, ___.",
      "ko": "요약하기: 정리하면 ___."
    },
    "grammar": [],
    "expressions": [
      "em resumo"
    ],
    "examples": [
      {
        "text": "Em resumo: flexível, mas com encontros.",
        "slot": "flexível, mas com encontros",
        "cue": {
          "en": "flexible, but with meetups",
          "ko": "유연하되 만남이 있는"
        },
        "gloss": {
          "en": "In short: flexible, but with meetups.",
          "ko": "정리하면, 유연하게 하되 만나는 날은 두자는 거예요."
        }
      },
      {
        "text": "Em resumo, o podcast fala de como economizar no dia a dia.",
        "slot": "o podcast fala de como economizar no dia a dia",
        "cue": {
          "en": "the podcast is about saving money day to day",
          "ko": "그 팟캐스트는 일상에서 돈 아끼는 법을 다룬다"
        },
        "gloss": {
          "en": "In short, the podcast is about how to save money day to day.",
          "ko": "요약하면 그 팟캐스트는 일상에서 돈 아끼는 법에 관한 거예요."
        }
      },
      {
        "text": "Em resumo, a reunião foi produtiva.",
        "slot": "a reunião foi produtiva",
        "cue": {
          "en": "the meeting was productive",
          "ko": "회의가 생산적이었다"
        },
        "gloss": {
          "en": "In short, the meeting was productive.",
          "ko": "정리하면 회의는 생산적이었어요."
        }
      },
      {
        "text": "Então, em resumo, a gente precisa de mais uma pessoa.",
        "slot": "a gente precisa de mais uma pessoa",
        "cue": {
          "en": "we need one more person",
          "ko": "한 사람이 더 필요하다"
        },
        "gloss": {
          "en": "So, in short, we need one more person.",
          "ko": "그러니까 정리하면 한 사람이 더 필요해요."
        }
      }
    ]
  },
  {
    "id": "pt-f4-20",
    "stage": 4,
    "fn": "report",
    "pattern": "Se não me engano, ___.",
    "core": [
      "Se não me engano",
      "se não me engano"
    ],
    "meaning": {
      "en": "Stating something with a hedge: If I'm not mistaken, ___.",
      "ko": "조심스럽게 사실 말하기: 제가 알기로는 ___."
    },
    "grammar": [],
    "expressions": [
      "se não me engano"
    ],
    "examples": [
      {
        "text": "Se não me engano, ainda faltam três telas.",
        "slot": "ainda faltam três telas",
        "cue": {
          "en": "three screens are still missing",
          "ko": "아직 화면 세 개가 남았다"
        },
        "gloss": {
          "en": "If I'm not mistaken, three screens are still left.",
          "ko": "제가 알기로는 아직 화면이 세 개 남았어요."
        }
      },
      {
        "text": "Se não me engano, a reunião é às duas.",
        "slot": "a reunião é às duas",
        "cue": {
          "en": "the meeting is at two",
          "ko": "회의는 두 시다"
        },
        "gloss": {
          "en": "If I'm not mistaken, the meeting is at two.",
          "ko": "제가 알기로는 회의가 두 시예요."
        }
      },
      {
        "text": "Ele recomendou, se não me engano, começar com pouco.",
        "slot": "começar com pouco",
        "cue": {
          "en": "start small",
          "ko": "적게 시작하다"
        },
        "gloss": {
          "en": "He recommended, if I'm not mistaken, starting small.",
          "ko": "제 기억이 맞다면 그분은 조금씩 시작하라고 했어요."
        }
      },
      {
        "text": "Se não me engano, você já trabalhou com ela.",
        "slot": "você já trabalhou com ela",
        "cue": {
          "en": "you've worked with her before",
          "ko": "그녀와 일해 본 적 있다"
        },
        "gloss": {
          "en": "If I'm not mistaken, you've worked with her before.",
          "ko": "제가 알기로는 그분이랑 일해 본 적 있으시죠."
        }
      }
    ]
  },
  {
    "id": "pt-f5-01",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Eu já tinha ___ quando você ligou.",
    "core": [
      "já tinha",
      "já tinham"
    ],
    "meaning": {
      "en": "Saying what had already happened: I had already ___ when…",
      "ko": "더 앞선 일 말하기: …했을 때 이미 ___했었어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Eu já tinha saído de casa quando você ligou.",
        "slot": "saído de casa",
        "cue": {
          "en": "leave home",
          "ko": "집에서 나오다"
        },
        "gloss": {
          "en": "I had already left home when you called.",
          "ko": "네가 전화했을 때 난 이미 집에서 나왔었어."
        }
      },
      {
        "text": "Quando cheguei, eles já tinham ido embora.",
        "slot": "ido embora",
        "cue": {
          "en": "leave",
          "ko": "떠나다"
        },
        "gloss": {
          "en": "When I arrived, they had already left.",
          "ko": "내가 도착했을 때 그들은 이미 가 버렸었어."
        }
      },
      {
        "text": "A gente já tinha jantado quando o pessoal apareceu.",
        "slot": "jantado",
        "cue": {
          "en": "have dinner",
          "ko": "저녁을 먹다"
        },
        "gloss": {
          "en": "We had already had dinner when everyone showed up.",
          "ko": "사람들이 왔을 때 우린 이미 저녁을 먹은 뒤였어."
        }
      },
      {
        "text": "Muitos professores já tinham feito um curso antes.",
        "slot": "feito um curso antes",
        "cue": {
          "en": "take a course before",
          "ko": "전에 강좌를 듣다"
        },
        "gloss": {
          "en": "Many teachers had already taken a course before.",
          "ko": "많은 선생님들이 그전에 이미 강좌를 들었었어요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-02",
    "stage": 5,
    "fn": "condition",
    "pattern": "Caso ___, é só me chamar.",
    "core": [
      "Caso",
      "caso"
    ],
    "meaning": {
      "en": "Covering a possibility: In case ___, …",
      "ko": "혹시를 대비해 말하기: 혹시 ___하면 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Caso você precise de ajuda, é só me chamar.",
        "slot": "você precise de ajuda",
        "cue": {
          "en": "you need help",
          "ko": "도움이 필요하다"
        },
        "gloss": {
          "en": "In case you need help, just call me.",
          "ko": "혹시 도움이 필요하면 그냥 불러."
        }
      },
      {
        "text": "Caso alguém zoe, eu zoo de volta.",
        "slot": "alguém zoe",
        "cue": {
          "en": "someone teases",
          "ko": "누가 놀리다"
        },
        "gloss": {
          "en": "If anyone teases me, I tease them back.",
          "ko": "혹시 누가 놀리면 나도 똑같이 놀려."
        }
      },
      {
        "text": "Caso o voo atrase, a empresa paga o hotel.",
        "slot": "o voo atrase",
        "cue": {
          "en": "the flight is delayed",
          "ko": "비행기가 늦어지다"
        },
        "gloss": {
          "en": "In case the flight is delayed, the company pays for the hotel.",
          "ko": "혹시 비행기가 늦어지면 회사가 호텔비를 내 줘요."
        }
      },
      {
        "text": "Leva um casaco, caso esfrie à noite.",
        "slot": "esfrie à noite",
        "cue": {
          "en": "it gets cold at night",
          "ko": "밤에 추워지다"
        },
        "gloss": {
          "en": "Take a coat in case it gets cold at night.",
          "ko": "밤에 추워질지도 모르니 외투 챙겨."
        }
      }
    ]
  },
  {
    "id": "pt-f5-03",
    "stage": 5,
    "fn": "condition",
    "pattern": "A não ser que ___, a gente vai.",
    "core": [
      "a não ser que",
      "A não ser que"
    ],
    "meaning": {
      "en": "Naming the only exception: Unless ___, …",
      "ko": "유일한 예외 말하기: ___하지 않는 한 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "A não ser que chova, a gente faz o churrasco no sábado.",
        "slot": "chova",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "Unless it rains, we'll have the barbecue on Saturday.",
          "ko": "비만 안 오면 토요일에 바비큐 해."
        }
      },
      {
        "text": "Eu aceito um pedacinho, a não ser que já tenha acabado.",
        "slot": "já tenha acabado",
        "cue": {
          "en": "it's already gone",
          "ko": "벌써 다 떨어지다"
        },
        "gloss": {
          "en": "I'll take a little piece, unless it's already gone.",
          "ko": "벌써 다 떨어진 게 아니면 한 조각 먹을게요."
        }
      },
      {
        "text": "A não ser que o governo invista, nada vai mudar.",
        "slot": "o governo invista",
        "cue": {
          "en": "the government invests",
          "ko": "정부가 투자하다"
        },
        "gloss": {
          "en": "Unless the government invests, nothing will change.",
          "ko": "정부가 투자하지 않는 한 아무것도 안 바뀌어요."
        }
      },
      {
        "text": "Vou a pé, a não ser que você me dê uma carona.",
        "slot": "você me dê uma carona",
        "cue": {
          "en": "you give me a ride",
          "ko": "네가 나를 태워 주다"
        },
        "gloss": {
          "en": "I'll walk, unless you give me a ride.",
          "ko": "네가 태워 주지 않으면 걸어갈게."
        }
      }
    ]
  },
  {
    "id": "pt-f5-04",
    "stage": 5,
    "fn": "negotiate",
    "pattern": "Contanto que ___, eu topo.",
    "core": [
      "Contanto que",
      "contanto que"
    ],
    "meaning": {
      "en": "Setting a condition: As long as ___, …",
      "ko": "조건 걸기: ___하기만 하면 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Contanto que tenha pão de alho, eu topo qualquer data.",
        "slot": "tenha pão de alho",
        "cue": {
          "en": "there's garlic bread",
          "ko": "마늘빵이 있다"
        },
        "gloss": {
          "en": "As long as there's garlic bread, I'm in for any date.",
          "ko": "마늘빵만 있으면 언제든 좋아."
        }
      },
      {
        "text": "A tecnologia ajuda, contanto que o professor saiba usar.",
        "slot": "o professor saiba usar",
        "cue": {
          "en": "the teacher knows how to use it",
          "ko": "선생님이 쓸 줄 알다"
        },
        "gloss": {
          "en": "Technology helps, as long as the teacher knows how to use it.",
          "ko": "선생님이 쓸 줄만 알면 기술은 도움이 돼요."
        }
      },
      {
        "text": "Contanto que vocês aprovem até quarta, o cadastro sai na sexta.",
        "slot": "vocês aprovem até quarta",
        "cue": {
          "en": "you approve by Wednesday",
          "ko": "수요일까지 승인하다"
        },
        "gloss": {
          "en": "As long as you approve by Wednesday, sign-up goes live on Friday.",
          "ko": "수요일까지 승인만 해 주시면 가입 기능은 금요일에 나가요."
        }
      },
      {
        "text": "Pode usar meu carro, contanto que devolva com o tanque cheio.",
        "slot": "devolva com o tanque cheio",
        "cue": {
          "en": "return it with a full tank",
          "ko": "기름을 가득 채워 돌려주다"
        },
        "gloss": {
          "en": "You can use my car, as long as you return it with a full tank.",
          "ko": "기름 가득 채워서 돌려주기만 하면 내 차 써도 돼."
        }
      }
    ]
  },
  {
    "id": "pt-f5-05",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Dá uma olhadinha ___?",
    "core": [
      "Dá uma olhadinha",
      "dá uma olhadinha"
    ],
    "meaning": {
      "en": "Softening a request with a diminutive: Could you take a quick look ___?",
      "ko": "작은 말로 부탁 누그러뜨리기: ___ 잠깐 봐 줄래요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Dá uma olhadinha nas telas até quarta?",
        "slot": "nas telas até quarta",
        "cue": {
          "en": "at the screens by Wednesday",
          "ko": "수요일까지 화면을"
        },
        "gloss": {
          "en": "Could you take a quick look at the screens by Wednesday?",
          "ko": "수요일까지 화면 좀 잠깐 봐 줄래요?"
        }
      },
      {
        "text": "Dá uma olhadinha nisso quando tiver um minutinho?",
        "slot": "nisso quando tiver um minutinho",
        "cue": {
          "en": "at this when you have a minute",
          "ko": "시간 날 때 이걸"
        },
        "gloss": {
          "en": "Could you take a quick look at this when you have a minute?",
          "ko": "잠깐 시간 날 때 이것 좀 봐 줄래?"
        }
      },
      {
        "text": "Amor, dá uma olhadinha no feijão pra mim?",
        "slot": "no feijão pra mim",
        "cue": {
          "en": "at the beans for me",
          "ko": "나 대신 콩을"
        },
        "gloss": {
          "en": "Honey, could you keep an eye on the beans for me?",
          "ko": "자기야, 콩 좀 잠깐 봐 줄래?"
        }
      },
      {
        "text": "Antes de enviar, dá uma olhadinha no meu texto?",
        "slot": "no meu texto",
        "cue": {
          "en": "at my text",
          "ko": "내 글을"
        },
        "gloss": {
          "en": "Before I send it, could you take a quick look at my text?",
          "ko": "보내기 전에 내 글 좀 잠깐 봐 줄래?"
        }
      }
    ]
  },
  {
    "id": "pt-f5-06",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Queria te pedir uma coisinha: ___.",
    "core": [
      "uma coisinha"
    ],
    "meaning": {
      "en": "Leading into a favor gently: I wanted to ask you a little something: ___.",
      "ko": "부드럽게 부탁 꺼내기: 작은 부탁이 하나 있는데, ___."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Queria te pedir uma coisinha: me empresta o carregador?",
        "slot": "me empresta o carregador",
        "cue": {
          "en": "lend me the charger",
          "ko": "충전기를 빌려주다"
        },
        "gloss": {
          "en": "I wanted to ask you a little favor: can you lend me the charger?",
          "ko": "작은 부탁 하나만 할게. 충전기 좀 빌려줄래?"
        }
      },
      {
        "text": "Queria te pedir uma coisinha: chega um pouco mais cedo amanhã?",
        "slot": "chega um pouco mais cedo amanhã",
        "cue": {
          "en": "come a bit earlier tomorrow",
          "ko": "내일 조금 일찍 오다"
        },
        "gloss": {
          "en": "I wanted to ask you a little something: could you come a bit earlier tomorrow?",
          "ko": "작은 부탁인데, 내일 조금 일찍 와 줄래?"
        }
      },
      {
        "text": "Só uma coisinha: revisa a última página antes de mandar.",
        "slot": "revisa a última página antes de mandar",
        "cue": {
          "en": "check the last page before sending",
          "ko": "보내기 전에 마지막 쪽을 검토하다"
        },
        "gloss": {
          "en": "Just one little thing: check the last page before sending.",
          "ko": "하나만요. 보내기 전에 마지막 쪽 한번 봐 주세요."
        }
      },
      {
        "text": "Vó, deixa eu te pedir uma coisinha: guarda um pedaço de pudim pra mim?",
        "slot": "guarda um pedaço de pudim pra mim",
        "cue": {
          "en": "save a piece of pudding for me",
          "ko": "푸딩 한 조각을 남겨 두다"
        },
        "gloss": {
          "en": "Grandma, let me ask you a little something: can you save me a piece of pudding?",
          "ko": "할머니, 작은 부탁 하나요. 푸딩 한 조각만 남겨 주실래요?"
        }
      }
    ]
  },
  {
    "id": "pt-f5-07",
    "stage": 5,
    "fn": "debate",
    "pattern": "O que me incomoda é ___.",
    "core": [
      "O que me incomoda é",
      "o que me incomoda é"
    ],
    "meaning": {
      "en": "Highlighting the real problem: What bothers me is ___.",
      "ko": "정말 거슬리는 점 강조하기: 제가 불편한 건 ___예요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "O que me incomoda é a falta de comunicação.",
        "slot": "a falta de comunicação",
        "cue": {
          "en": "the lack of communication",
          "ko": "소통 부족"
        },
        "gloss": {
          "en": "What bothers me is the lack of communication.",
          "ko": "제가 불편한 건 소통이 없다는 거예요."
        }
      },
      {
        "text": "O que me incomoda é ninguém assumir o erro.",
        "slot": "ninguém assumir o erro",
        "cue": {
          "en": "nobody owning up to the mistake",
          "ko": "아무도 잘못을 인정하지 않는 것"
        },
        "gloss": {
          "en": "What bothers me is that nobody owns up to the mistake.",
          "ko": "제가 거슬리는 건 아무도 잘못을 인정 안 한다는 거예요."
        }
      },
      {
        "text": "Na real, o que me incomoda é o barulho da obra.",
        "slot": "o barulho da obra",
        "cue": {
          "en": "the construction noise",
          "ko": "공사 소음"
        },
        "gloss": {
          "en": "Honestly, what bothers me is the construction noise.",
          "ko": "솔직히 거슬리는 건 공사 소음이야."
        }
      },
      {
        "text": "Não é o preço; o que me incomoda é a demora.",
        "slot": "a demora",
        "cue": {
          "en": "the delay",
          "ko": "늦어지는 것"
        },
        "gloss": {
          "en": "It's not the price; what bothers me is the delay.",
          "ko": "가격 문제가 아니라 제가 불편한 건 너무 오래 걸린다는 거예요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-08",
    "stage": 5,
    "fn": "debate",
    "pattern": "O que eu não entendo é ___.",
    "core": [
      "não entendo é"
    ],
    "meaning": {
      "en": "Pinpointing what puzzles you: What I don't understand is ___.",
      "ko": "이해 안 되는 점 짚기: 제가 이해 안 되는 건 ___예요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "O que eu não entendo é como o senhor ainda conseguia jantar.",
        "slot": "como o senhor ainda conseguia jantar",
        "cue": {
          "en": "how you could still eat dinner",
          "ko": "어떻게 아직도 저녁을 먹을 수 있었는지"
        },
        "gloss": {
          "en": "What I don't understand is how you could still eat dinner.",
          "ko": "제가 이해 안 되는 건 어떻게 아직 저녁을 드실 수 있었냐는 거예요."
        }
      },
      {
        "text": "O que eu ainda não entendo é o oxe.",
        "slot": "o oxe",
        "cue": {
          "en": "the word 'oxe'",
          "ko": "'오셰'라는 말"
        },
        "gloss": {
          "en": "What I still don't understand is 'oxe'.",
          "ko": "제가 아직 모르겠는 건 '오셰'예요."
        }
      },
      {
        "text": "O que eu não entendo é por que ninguém avisou antes.",
        "slot": "por que ninguém avisou antes",
        "cue": {
          "en": "why nobody warned us earlier",
          "ko": "왜 아무도 미리 알려 주지 않았는지"
        },
        "gloss": {
          "en": "What I don't understand is why nobody said anything earlier.",
          "ko": "이해가 안 되는 건 왜 아무도 미리 말 안 했냐는 거예요."
        }
      },
      {
        "text": "Sinceramente, o que eu não entendo é essa pressa toda.",
        "slot": "essa pressa toda",
        "cue": {
          "en": "all this rush",
          "ko": "이렇게 서두르는 것"
        },
        "gloss": {
          "en": "Honestly, what I don't understand is all this rush.",
          "ko": "솔직히 이렇게 서두르는 게 이해가 안 돼요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-09",
    "stage": 5,
    "fn": "formal-request",
    "pattern": "Venho por meio deste e-mail ___.",
    "core": [
      "Venho por meio deste",
      "venho por meio deste"
    ],
    "meaning": {
      "en": "Opening a formal letter: I am writing (by means of this e-mail) to ___.",
      "ko": "격식 있는 글 시작하기: 이 메일을 통해 ___하고자 합니다."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Venho por meio deste e-mail solicitar a prorrogação do prazo.",
        "slot": "solicitar a prorrogação do prazo",
        "cue": {
          "en": "request a deadline extension",
          "ko": "기한 연장을 요청하다"
        },
        "gloss": {
          "en": "I am writing to request an extension of the deadline.",
          "ko": "이 메일을 통해 기한 연장을 요청드립니다."
        }
      },
      {
        "text": "Prezados senhores, venho por meio deste informar minha demissão.",
        "slot": "informar minha demissão",
        "cue": {
          "en": "announce my resignation",
          "ko": "사직을 알리다"
        },
        "gloss": {
          "en": "Dear Sirs, I am writing to inform you of my resignation.",
          "ko": "관계자 여러분, 이 글로 사직 의사를 알려 드립니다."
        }
      },
      {
        "text": "Venho por meio deste e-mail apresentar nossa proposta.",
        "slot": "apresentar nossa proposta",
        "cue": {
          "en": "present our proposal",
          "ko": "저희 제안을 소개하다"
        },
        "gloss": {
          "en": "I am writing to present our proposal.",
          "ko": "이 메일을 통해 저희 제안을 소개드립니다."
        }
      },
      {
        "text": "Venho por meio deste e-mail confirmar minha presença no evento.",
        "slot": "confirmar minha presença no evento",
        "cue": {
          "en": "confirm my attendance at the event",
          "ko": "행사 참석을 확인하다"
        },
        "gloss": {
          "en": "I am writing to confirm my attendance at the event.",
          "ko": "이 메일로 행사 참석을 확인드립니다."
        }
      }
    ]
  },
  {
    "id": "pt-f5-10",
    "stage": 5,
    "fn": "formal-request",
    "pattern": "Agradecemos desde já ___.",
    "core": [
      "Agradecemos desde já",
      "agradecemos desde já"
    ],
    "meaning": {
      "en": "Closing a formal message: We thank you in advance for ___.",
      "ko": "격식 있는 글 맺기: ___에 미리 감사드립니다."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Agradecemos desde já a atenção.",
        "slot": "a atenção",
        "cue": {
          "en": "your attention",
          "ko": "관심"
        },
        "gloss": {
          "en": "We thank you in advance for your attention.",
          "ko": "관심 가져 주셔서 미리 감사드립니다."
        }
      },
      {
        "text": "Agradecemos desde já a colaboração de todos.",
        "slot": "a colaboração de todos",
        "cue": {
          "en": "everyone's cooperation",
          "ko": "모두의 협조"
        },
        "gloss": {
          "en": "We thank everyone in advance for their cooperation.",
          "ko": "모두의 협조에 미리 감사드립니다."
        }
      },
      {
        "text": "Agradecemos desde já pela compreensão.",
        "slot": "pela compreensão",
        "cue": {
          "en": "your understanding",
          "ko": "양해"
        },
        "gloss": {
          "en": "We thank you in advance for your understanding.",
          "ko": "양해해 주셔서 미리 감사드립니다."
        }
      },
      {
        "text": "Sem mais, agradecemos desde já o retorno.",
        "slot": "o retorno",
        "cue": {
          "en": "your reply",
          "ko": "회신"
        },
        "gloss": {
          "en": "Without further ado, we thank you in advance for your reply.",
          "ko": "이만 줄이며, 회신에 미리 감사드립니다."
        }
      }
    ]
  },
  {
    "id": "pt-f5-11",
    "stage": 5,
    "fn": "report",
    "pattern": "Informamos que ___.",
    "core": [
      "Informamos que",
      "informamos que"
    ],
    "meaning": {
      "en": "Announcing formally: We hereby inform you that ___.",
      "ko": "격식 있게 알리기: ___임을 알려 드립니다."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Informamos que o atraso decorreu da demora do fornecedor.",
        "slot": "o atraso decorreu da demora do fornecedor",
        "cue": {
          "en": "the delay was caused by the supplier",
          "ko": "지연은 공급업체 때문이었다"
        },
        "gloss": {
          "en": "We inform you that the delay was caused by the supplier's slowness.",
          "ko": "지연은 공급업체의 늦은 처리로 인한 것임을 알려 드립니다."
        }
      },
      {
        "text": "Informamos que o escritório estará fechado na segunda-feira.",
        "slot": "o escritório estará fechado na segunda-feira",
        "cue": {
          "en": "the office will be closed on Monday",
          "ko": "사무실이 월요일에 문을 닫는다"
        },
        "gloss": {
          "en": "Please be informed that the office will be closed on Monday.",
          "ko": "월요일에 사무실이 쉰다는 것을 알려 드립니다."
        }
      },
      {
        "text": "Prezado cliente, informamos que seu pedido foi enviado.",
        "slot": "seu pedido foi enviado",
        "cue": {
          "en": "your order has been shipped",
          "ko": "주문이 발송되었다"
        },
        "gloss": {
          "en": "Dear customer, we inform you that your order has been shipped.",
          "ko": "고객님, 주문하신 상품이 발송되었음을 알려 드립니다."
        }
      },
      {
        "text": "Informamos que as inscrições terminam amanhã.",
        "slot": "as inscrições terminam amanhã",
        "cue": {
          "en": "registration ends tomorrow",
          "ko": "신청이 내일 마감된다"
        },
        "gloss": {
          "en": "Please note that registration ends tomorrow.",
          "ko": "신청이 내일 마감됨을 알려 드립니다."
        }
      }
    ]
  },
  {
    "id": "pt-f5-12",
    "stage": 5,
    "fn": "origin",
    "pattern": "Tu é ___, né?",
    "core": [
      "Tu é",
      "tu é"
    ],
    "meaning": {
      "en": "Talking casually with regional tu: You're ___, right?",
      "ko": "지역 말투 tu로 편하게 묻기: 너 ___지?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tu é do Sul, né?",
        "slot": "do Sul",
        "cue": {
          "en": "from the South",
          "ko": "남부 출신"
        },
        "gloss": {
          "en": "You're from the South, right?",
          "ko": "너 남부 출신이지?"
        }
      },
      {
        "text": "Bah, tu é gaúcho mesmo, hein!",
        "slot": "gaúcho mesmo",
        "cue": {
          "en": "a real gaúcho",
          "ko": "진짜 가우슈(남부 사람)"
        },
        "gloss": {
          "en": "Wow, you're a real gaúcho!",
          "ko": "와, 너 진짜 남부 사람이구나!"
        }
      },
      {
        "text": "Tu é muito engraçado, sabia?",
        "slot": "muito engraçado",
        "cue": {
          "en": "very funny",
          "ko": "아주 웃긴"
        },
        "gloss": {
          "en": "You're really funny, you know?",
          "ko": "너 진짜 웃기다, 알아?"
        }
      },
      {
        "text": "Oxe, tu é doido?",
        "slot": "doido",
        "cue": {
          "en": "crazy",
          "ko": "미친"
        },
        "gloss": {
          "en": "Huh, are you crazy?",
          "ko": "어휴, 너 미쳤어?"
        }
      }
    ]
  },
  {
    "id": "pt-f5-13",
    "stage": 5,
    "fn": "debate",
    "pattern": "Pelo contrário: ___.",
    "core": [
      "pelo contrário",
      "Pelo contrário"
    ],
    "meaning": {
      "en": "Saying the opposite is true: On the contrary, ___.",
      "ko": "오히려 반대라고 말하기: 오히려 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "pelo contrário"
    ],
    "examples": [
      {
        "text": "Não é caro; pelo contrário, é uma pechincha.",
        "slot": "é uma pechincha",
        "cue": {
          "en": "it's a bargain",
          "ko": "아주 싸다"
        },
        "gloss": {
          "en": "It's not expensive; on the contrary, it's a bargain.",
          "ko": "비싸지 않아요. 오히려 거저예요."
        }
      },
      {
        "text": "Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação.",
        "slot": "quanto mais fácil a ferramenta, mais o aluno precisa de orientação",
        "cue": {
          "en": "the easier the tool, the more guidance students need",
          "ko": "도구가 쉬울수록 학생에게 지도가 더 필요하다"
        },
        "gloss": {
          "en": "On the contrary: the easier the tool, the more the student needs guidance.",
          "ko": "오히려 도구가 쉬울수록 학생에게는 지도가 더 필요해요."
        }
      },
      {
        "text": "Ele não ficou bravo, pelo contrário, adorou a surpresa.",
        "slot": "adorou a surpresa",
        "cue": {
          "en": "he loved the surprise",
          "ko": "깜짝 선물을 아주 좋아했다"
        },
        "gloss": {
          "en": "He didn't get angry; on the contrary, he loved the surprise.",
          "ko": "그는 화내지 않았어. 오히려 깜짝 선물을 아주 좋아했어."
        }
      },
      {
        "text": "Não vamos pular nenhum teste; pelo contrário, vamos testar em dobro.",
        "slot": "vamos testar em dobro",
        "cue": {
          "en": "we'll test twice as much",
          "ko": "두 배로 테스트하겠다"
        },
        "gloss": {
          "en": "We won't skip any tests; on the contrary, we'll test twice as much.",
          "ko": "테스트를 하나도 빼지 않아요. 오히려 두 배로 할 거예요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-14",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Aliás, ___.",
    "core": [
      "Aliás",
      "aliás"
    ],
    "meaning": {
      "en": "Adding a related point: By the way / In fact, ___.",
      "ko": "말 덧붙이기: 그나저나 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "aliás"
    ],
    "examples": [
      {
        "text": "Aliás, o cheiro tá incrível.",
        "slot": "o cheiro tá incrível",
        "cue": {
          "en": "the smell is amazing",
          "ko": "냄새가 끝내준다"
        },
        "gloss": {
          "en": "By the way, the smell is amazing.",
          "ko": "그나저나 냄새 진짜 좋다."
        }
      },
      {
        "text": "Aliás, eu já tinha ouvido teu sotaque numa novela.",
        "slot": "eu já tinha ouvido teu sotaque numa novela",
        "cue": {
          "en": "I had already heard your accent in a soap opera",
          "ko": "드라마에서 네 말투를 들어 본 적 있다"
        },
        "gloss": {
          "en": "By the way, I had already heard your accent in a soap opera.",
          "ko": "그러고 보니 드라마에서 네 말투 들어 본 적 있어."
        }
      },
      {
        "text": "A festa foi ótima. Aliás, obrigado pelo convite!",
        "slot": "obrigado pelo convite",
        "cue": {
          "en": "thanks for the invitation",
          "ko": "초대해 줘서 고맙다"
        },
        "gloss": {
          "en": "The party was great. By the way, thanks for the invitation!",
          "ko": "파티 최고였어. 그나저나 초대해 줘서 고마워!"
        }
      },
      {
        "text": "O trânsito estava parado; aliás, como sempre às sextas.",
        "slot": "como sempre às sextas",
        "cue": {
          "en": "as always on Fridays",
          "ko": "금요일마다 늘 그렇듯"
        },
        "gloss": {
          "en": "Traffic was at a standstill; as always on Fridays, in fact.",
          "ko": "길이 꽉 막혔어. 하긴 금요일엔 늘 그렇지만."
        }
      }
    ]
  },
  {
    "id": "pt-f5-15",
    "stage": 5,
    "fn": "debate",
    "pattern": "Inclusive, ___.",
    "core": [
      "Inclusive",
      "inclusive"
    ],
    "meaning": {
      "en": "Adding stronger evidence: In fact / Even, ___.",
      "ko": "근거 더하기: 심지어 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "inclusive"
    ],
    "examples": [
      {
        "text": "Inclusive, liguei pra ele duas vezes.",
        "slot": "liguei pra ele duas vezes",
        "cue": {
          "en": "I called him twice",
          "ko": "그에게 두 번 전화했다"
        },
        "gloss": {
          "en": "In fact, I called him twice.",
          "ko": "심지어 걔한테 두 번이나 전화했어요."
        }
      },
      {
        "text": "Inclusive, alguns estados já estão fazendo isso.",
        "slot": "alguns estados já estão fazendo isso",
        "cue": {
          "en": "some states are already doing it",
          "ko": "몇몇 주는 이미 그렇게 하고 있다"
        },
        "gloss": {
          "en": "In fact, some states are already doing it.",
          "ko": "실제로 몇몇 주는 이미 그렇게 하고 있어요."
        }
      },
      {
        "text": "O restaurante é ótimo. Inclusive, a chef ganhou um prêmio.",
        "slot": "a chef ganhou um prêmio",
        "cue": {
          "en": "the chef won an award",
          "ko": "셰프가 상을 받았다"
        },
        "gloss": {
          "en": "The restaurant is great. In fact, the chef won an award.",
          "ko": "그 식당 정말 좋아요. 심지어 셰프가 상도 받았어요."
        }
      },
      {
        "text": "Ele ajuda todo mundo, inclusive quem ele nem conhece.",
        "slot": "quem ele nem conhece",
        "cue": {
          "en": "people he doesn't even know",
          "ko": "전혀 모르는 사람"
        },
        "gloss": {
          "en": "He helps everyone, even people he doesn't know.",
          "ko": "그는 모두를 도와요, 심지어 모르는 사람까지도."
        }
      }
    ]
  },
  {
    "id": "pt-f5-16",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Com todo respeito, ___.",
    "core": [
      "Com todo respeito",
      "com todo respeito"
    ],
    "meaning": {
      "en": "Disagreeing politely: With all due respect, ___.",
      "ko": "정중하게 반박하기: 외람되지만 ___."
    },
    "grammar": [],
    "expressions": [
      "com todo respeito"
    ],
    "examples": [
      {
        "text": "Com todo respeito, não é bem assim.",
        "slot": "não é bem assim",
        "cue": {
          "en": "that's not quite right",
          "ko": "꼭 그렇지는 않다"
        },
        "gloss": {
          "en": "With all due respect, that's not quite how it is.",
          "ko": "외람되지만 꼭 그렇지는 않아요."
        }
      },
      {
        "text": "Com todo respeito, tia, quem acordou tarde foi o Rafa.",
        "slot": "quem acordou tarde foi o Rafa",
        "cue": {
          "en": "it was Rafa who woke up late",
          "ko": "늦게 일어난 건 하파다"
        },
        "gloss": {
          "en": "With all due respect, auntie, it was Rafa who woke up late.",
          "ko": "고모, 죄송하지만 늦잠 잔 건 하파예요."
        }
      },
      {
        "text": "Com todo respeito, doutor, eu queria uma segunda opinião.",
        "slot": "eu queria uma segunda opinião",
        "cue": {
          "en": "I'd like a second opinion",
          "ko": "다른 의사의 의견도 듣고 싶다"
        },
        "gloss": {
          "en": "With all due respect, doctor, I'd like a second opinion.",
          "ko": "선생님, 실례지만 다른 의견도 들어 보고 싶어요."
        }
      },
      {
        "text": "Com todo respeito, essa decisão não foi justa.",
        "slot": "essa decisão não foi justa",
        "cue": {
          "en": "that decision wasn't fair",
          "ko": "그 결정은 공정하지 않았다"
        },
        "gloss": {
          "en": "With all due respect, that decision wasn't fair.",
          "ko": "외람되지만 그 결정은 공정하지 않았어요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-17",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Sem querer ser chato, mas ___.",
    "core": [
      "Sem querer ser chato",
      "sem querer ser chato"
    ],
    "meaning": {
      "en": "Raising a small complaint gently: Not to be a pain, but ___.",
      "ko": "부담 없이 지적하기: 귀찮게 하려는 건 아닌데, ___."
    },
    "grammar": [],
    "expressions": [
      "sem querer ser chato"
    ],
    "examples": [
      {
        "text": "Sem querer ser chato, mas a música está um pouco alta.",
        "slot": "a música está um pouco alta",
        "cue": {
          "en": "the music is a bit loud",
          "ko": "음악이 좀 크다"
        },
        "gloss": {
          "en": "Not to be a pain, but the music is a bit loud.",
          "ko": "귀찮게 하려는 건 아닌데 음악이 좀 커요."
        }
      },
      {
        "text": "Sem querer ser chato, mas o que é oxe?",
        "slot": "o que é oxe",
        "cue": {
          "en": "what 'oxe' means",
          "ko": "'오셰'가 무슨 뜻인지"
        },
        "gloss": {
          "en": "Not to be a pain, but what is 'oxe'?",
          "ko": "귀찮게 해서 미안한데 '오셰'가 뭐야?"
        }
      },
      {
        "text": "Sem querer ser chato, mas você ainda não me pagou.",
        "slot": "você ainda não me pagou",
        "cue": {
          "en": "you haven't paid me yet",
          "ko": "아직 돈을 안 갚았다"
        },
        "gloss": {
          "en": "Not to be a pain, but you haven't paid me back yet.",
          "ko": "재촉하려는 건 아닌데 아직 돈 안 줬어."
        }
      },
      {
        "text": "Sem querer ser chato, mas a reunião era às nove.",
        "slot": "a reunião era às nove",
        "cue": {
          "en": "the meeting was at nine",
          "ko": "회의는 아홉 시였다"
        },
        "gloss": {
          "en": "Not to be a pain, but the meeting was at nine.",
          "ko": "잔소리하려는 건 아닌데 회의는 아홉 시였어요."
        }
      }
    ]
  },
  {
    "id": "pt-f5-18",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Vou ver e te falo ___.",
    "core": [
      "Vou ver e te falo",
      "vou ver e te falo"
    ],
    "meaning": {
      "en": "Putting off an answer (often a soft no): I'll see and let you know ___.",
      "ko": "돌려 미루기(흔히 거절): 생각해 보고 ___ 알려 줄게."
    },
    "grammar": [],
    "expressions": [
      "vou ver e te falo"
    ],
    "examples": [
      {
        "text": "Vou ver e te falo até amanhã.",
        "slot": "até amanhã",
        "cue": {
          "en": "by tomorrow",
          "ko": "내일까지"
        },
        "gloss": {
          "en": "I'll check and let you know by tomorrow.",
          "ko": "확인해 보고 내일까지 알려 줄게."
        }
      },
      {
        "text": "Bora! Vou ver e te falo o dia.",
        "slot": "o dia",
        "cue": {
          "en": "the day",
          "ko": "날짜"
        },
        "gloss": {
          "en": "Let's do it! I'll see and tell you the day.",
          "ko": "좋아! 날짜는 생각해 보고 알려 줄게."
        }
      },
      {
        "text": "Hum, festa no domingo? Vou ver e te falo depois.",
        "slot": "depois",
        "cue": {
          "en": "later",
          "ko": "나중에"
        },
        "gloss": {
          "en": "Hmm, a party on Sunday? I'll see and let you know later.",
          "ko": "음, 일요일에 파티? 나중에 알려 줄게."
        }
      },
      {
        "text": "Vou ver e te falo se consigo ir.",
        "slot": "se consigo ir",
        "cue": {
          "en": "whether I can go",
          "ko": "갈 수 있는지"
        },
        "gloss": {
          "en": "I'll see and let you know if I can make it.",
          "ko": "갈 수 있는지 보고 알려 줄게."
        }
      }
    ]
  },
  {
    "id": "pt-f5-19",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "Na real, ___.",
    "core": [
      "Na real",
      "na real"
    ],
    "meaning": {
      "en": "Telling it straight, casually: Honestly / Truth is, ___.",
      "ko": "솔직하게 말하기: 사실은 ___."
    },
    "grammar": [],
    "expressions": [
      "na real"
    ],
    "examples": [
      {
        "text": "Na real, não cabe mais nada!",
        "slot": "não cabe mais nada",
        "cue": {
          "en": "there's no room for anything else",
          "ko": "더는 아무것도 안 들어간다"
        },
        "gloss": {
          "en": "Honestly, I can't fit anything else!",
          "ko": "솔직히 더는 하나도 안 들어가!"
        }
      },
      {
        "text": "Na real, depois de quatro anos, eu nem percebo mais.",
        "slot": "depois de quatro anos, eu nem percebo mais",
        "cue": {
          "en": "after four years I don't even notice anymore",
          "ko": "사 년이 지나니 이제 알아차리지도 못한다"
        },
        "gloss": {
          "en": "Truth is, after four years, I don't even notice anymore.",
          "ko": "사실 사 년이 지나니까 이제 느끼지도 못해."
        }
      },
      {
        "text": "Ele diz que está tudo bem, mas na real está preocupado.",
        "slot": "está preocupado",
        "cue": {
          "en": "he's worried",
          "ko": "걱정하고 있다"
        },
        "gloss": {
          "en": "He says everything's fine, but actually he's worried.",
          "ko": "괜찮다고 하지만 사실은 걱정하고 있어."
        }
      },
      {
        "text": "Na real, eu nem queria ir nessa festa.",
        "slot": "eu nem queria ir nessa festa",
        "cue": {
          "en": "I didn't even want to go to that party",
          "ko": "그 파티에 가고 싶지도 않았다"
        },
        "gloss": {
          "en": "Honestly, I didn't even want to go to that party.",
          "ko": "솔직히 그 파티 가고 싶지도 않았어."
        }
      }
    ]
  },
  {
    "id": "pt-f5-20",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "Só agora caiu a ficha: ___.",
    "core": [
      "caiu a ficha"
    ],
    "meaning": {
      "en": "Saying something finally sank in: It only just hit me: ___.",
      "ko": "뒤늦게 깨닫기: 이제야 실감이 났어, ___."
    },
    "grammar": [],
    "expressions": [
      "caiu a ficha"
    ],
    "examples": [
      {
        "text": "Só agora caiu a ficha: amanhã eu me mudo.",
        "slot": "amanhã eu me mudo",
        "cue": {
          "en": "I move tomorrow",
          "ko": "내일 이사한다"
        },
        "gloss": {
          "en": "It only just hit me: I'm moving tomorrow.",
          "ko": "이제야 실감 나네, 나 내일 이사 가."
        }
      },
      {
        "text": "Quando caiu a ficha, eu já estava no aeroporto.",
        "slot": "eu já estava no aeroporto",
        "cue": {
          "en": "I was already at the airport",
          "ko": "이미 공항에 있었다"
        },
        "gloss": {
          "en": "When it sank in, I was already at the airport.",
          "ko": "실감이 났을 땐 이미 공항이었어."
        }
      },
      {
        "text": "Na real, só caiu a ficha da gravidade na sexta.",
        "slot": "da gravidade na sexta",
        "cue": {
          "en": "how serious it was, on Friday",
          "ko": "금요일에야 심각함을"
        },
        "gloss": {
          "en": "Honestly, the seriousness only sank in on Friday.",
          "ko": "솔직히 금요일에야 얼마나 심각한지 실감했어요."
        }
      },
      {
        "text": "Demorou, mas caiu a ficha: ela estava brincando.",
        "slot": "ela estava brincando",
        "cue": {
          "en": "she was joking",
          "ko": "그녀가 농담하고 있었다"
        },
        "gloss": {
          "en": "It took a while, but it finally clicked: she was joking.",
          "ko": "좀 걸렸지만 이제 알았어, 걔 농담한 거였어."
        }
      }
    ]
  }
];
