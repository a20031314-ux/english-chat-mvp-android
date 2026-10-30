import type { StageScript } from "../../stageScripts.ts";

/**
 * es 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const ES_BANK: StageScript[] = [
  {
    "id": "es-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "gracias",
      "por favor",
      "cuánto cuesta"
    ],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! ¿Qué quieres?",
        "gloss": {
          "en": "Hi! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Un café con leche, por favor.",
        "gloss": {
          "en": "A coffee with milk, please.",
          "ko": "카페라테 한 잔 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "¿Algo más?",
        "gloss": {
          "en": "Anything else?",
          "ko": "더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, quiero un cruasán.",
        "gloss": {
          "en": "Yes, I'd like a croissant.",
          "ko": "네, 크루아상 하나 주세요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien.",
        "gloss": {
          "en": "Very good.",
          "ko": "네, 알겠습니다."
        }
      },
      {
        "who": "me",
        "text": "¿Cuánto cuesta todo?",
        "gloss": {
          "en": "How much is everything?",
          "ko": "전부 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Cuatro euros.",
        "gloss": {
          "en": "Four euros.",
          "ko": "사 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Aquí tiene. Gracias.",
        "gloss": {
          "en": "Here you are. Thanks.",
          "ko": "여기 있어요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "es-1-b02",
    "stage": 1,
    "bank": true,
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서 처음 만난 사람과"
    },
    "expressions": [
      "mucho gusto",
      "me llamo",
      "soy de Corea",
      "vale",
      "hasta luego"
    ],
    "grammar": [
      0,
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, ¿cómo te llamas?",
        "gloss": {
          "en": "Hi, what's your name?",
          "ko": "안녕하세요, 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "Me llamo Ji-woo. ¿Y tú?",
        "gloss": {
          "en": "My name is Ji-woo. And you?",
          "ko": "저는 지우예요. 당신은요?"
        },
        "frames": [
          "es-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Me llamo Pablo. Mucho gusto.",
        "gloss": {
          "en": "My name is Pablo. Nice to meet you.",
          "ko": "저는 파블로예요. 반가워요."
        }
      },
      {
        "who": "me",
        "text": "Mucho gusto. Soy de Corea.",
        "gloss": {
          "en": "Nice to meet you. I'm from Korea.",
          "ko": "반가워요. 저는 한국에서 왔어요."
        },
        "frames": [
          "es-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "¿Eres estudiante?",
        "gloss": {
          "en": "Are you a student?",
          "ko": "학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, soy estudiante. Estudio economía.",
        "gloss": {
          "en": "Yes, I'm a student. I study economics.",
          "ko": "네, 학생이에요. 경제학을 공부해요."
        },
        "frames": [
          "es-f1-03",
          "es-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bien! Bueno, tengo clase ahora.",
        "gloss": {
          "en": "Great! Well, I have class now.",
          "ko": "좋네요! 그럼, 저는 지금 수업이 있어서요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¡Hasta luego, Pablo!",
        "gloss": {
          "en": "OK. See you later, Pablo!",
          "ko": "네. 나중에 봐요, 파블로!"
        },
        "frames": [
          "es-f1-06"
        ]
      }
    ]
  },
  {
    "id": "es-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way to the metro on the street",
      "ko": "길에서 지하철역 가는 길 묻기"
    },
    "expressions": [
      "gracias",
      "por favor",
      "perdón",
      "no entiendo",
      "vale",
      "adiós"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, ¿necesita ayuda?",
        "gloss": {
          "en": "Hello, do you need help?",
          "ko": "안녕하세요, 도움이 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, por favor. ¿Dónde está el metro?",
        "gloss": {
          "en": "Yes, please. Where is the metro?",
          "ko": "네, 부탁해요. 지하철역이 어디예요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Está allí, a la derecha.",
        "gloss": {
          "en": "It's over there, on the right.",
          "ko": "저기, 오른쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Perdón, no entiendo. ¿Puede repetir, por favor?",
        "gloss": {
          "en": "Sorry, I don't understand. Can you repeat, please?",
          "ko": "죄송해요, 이해를 못 했어요. 다시 말해 주시겠어요?"
        },
        "frames": [
          "es-f1-17",
          "es-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Claro. Allí, a la derecha, al lado del banco.",
        "gloss": {
          "en": "Sure. Over there, on the right, next to the bank.",
          "ko": "그럼요. 저기 오른쪽, 은행 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Ah, vale. Gracias por la ayuda.",
        "gloss": {
          "en": "Ah, OK. Thanks for the help.",
          "ko": "아, 알겠어요. 도와주셔서 감사해요."
        },
        "frames": [
          "es-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "De nada. ¡Buen día!",
        "gloss": {
          "en": "You're welcome. Have a good day!",
          "ko": "천만에요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Igualmente. ¡Adiós!",
        "gloss": {
          "en": "You too. Bye!",
          "ko": "당신도요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "es-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the hotel front desk, asking about a pharmacy",
      "ko": "호텔 프런트에서 약국 묻기"
    },
    "expressions": [
      "buenas tardes",
      "gracias",
      "vale"
    ],
    "grammar": [
      6,
      5,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas tardes. ¿En qué puedo ayudarle?",
        "gloss": {
          "en": "Good afternoon. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenas tardes. ¿Hay una farmacia por aquí?",
        "gloss": {
          "en": "Good afternoon. Is there a pharmacy around here?",
          "ko": "안녕하세요. 이 근처에 약국 있어요?"
        },
        "frames": [
          "es-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Sí, hay una en la calle Mayor.",
        "gloss": {
          "en": "Yes, there's one on Calle Mayor.",
          "ko": "네, 마요르 거리에 하나 있어요."
        }
      },
      {
        "who": "me",
        "text": "¿Dónde está la calle Mayor?",
        "gloss": {
          "en": "Where is Calle Mayor?",
          "ko": "마요르 거리는 어디예요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Está muy cerca, a dos minutos.",
        "gloss": {
          "en": "It's very close, two minutes away.",
          "ko": "아주 가까워요, 이 분 거리예요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Hay un cajero por aquí también?",
        "gloss": {
          "en": "OK. Is there an ATM around here too?",
          "ko": "알겠어요. 이 근처에 현금인출기도 있어요?"
        },
        "frames": [
          "es-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Sí, al lado de la farmacia.",
        "gloss": {
          "en": "Yes, next to the pharmacy.",
          "ko": "네, 약국 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Perfecto. Muchas gracias.",
        "gloss": {
          "en": "Perfect. Thank you very much.",
          "ko": "좋아요. 정말 감사합니다."
        }
      }
    ]
  },
  {
    "id": "es-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a market stall",
      "ko": "시장 과일 가게에서"
    },
    "expressions": [
      "buenos días",
      "por favor",
      "vale",
      "adiós"
    ],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Buenos días! ¿Qué le pongo?",
        "gloss": {
          "en": "Good morning! What can I get you?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenos días. Un kilo de tomates, por favor.",
        "gloss": {
          "en": "Good morning. A kilo of tomatoes, please.",
          "ko": "안녕하세요. 토마토 일 킬로 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Aquí tiene. ¿Algo más?",
        "gloss": {
          "en": "Here you are. Anything else?",
          "ko": "여기 있어요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Qué es esto?",
        "gloss": {
          "en": "Yes. What is this?",
          "ko": "네. 이건 뭐예요?"
        },
        "frames": [
          "es-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Es un caqui. Es muy dulce.",
        "gloss": {
          "en": "It's a persimmon. It's very sweet.",
          "ko": "감이에요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "Vale, quiero dos.",
        "gloss": {
          "en": "OK, I'd like two.",
          "ko": "좋아요, 두 개 주세요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. Son tres euros.",
        "gloss": {
          "en": "Very good. That's three euros.",
          "ko": "네. 삼 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Aquí tiene. ¡Adiós!",
        "gloss": {
          "en": "Here you are. Bye!",
          "ko": "여기 있어요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "es-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "gracias",
      "vale"
    ],
    "grammar": [
      7,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Tiene cita?",
        "gloss": {
          "en": "Good morning. Do you have an appointment?",
          "ko": "안녕하세요. 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tengo cita a las diez.",
        "gloss": {
          "en": "Yes, I have an appointment at ten.",
          "ko": "네, 열 시에 예약이 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Vale. ¿Cuántos años tiene?",
        "gloss": {
          "en": "OK. How old are you?",
          "ko": "네. 나이가 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "Tengo treinta años.",
        "gloss": {
          "en": "I'm thirty years old.",
          "ko": "서른 살이에요."
        },
        "frames": [
          "es-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "¿Tiene seguro médico?",
        "gloss": {
          "en": "Do you have health insurance?",
          "ko": "의료 보험 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, esta es mi tarjeta del seguro.",
        "gloss": {
          "en": "Yes, this is my insurance card.",
          "ko": "네, 이게 제 보험 카드예요."
        },
        "frames": [
          "es-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "Gracias. Un momento, por favor.",
        "gloss": {
          "en": "Thank you. One moment, please.",
          "ko": "감사합니다. 잠시만 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "Vale, gracias.",
        "gloss": {
          "en": "OK, thank you.",
          "ko": "네, 감사합니다."
        }
      }
    ]
  },
  {
    "id": "es-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the station's lost and found",
      "ko": "역 분실물 센터에서"
    },
    "expressions": [
      "gracias",
      "perdón"
    ],
    "grammar": [
      5,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas tardes. ¿En qué puedo ayudarle?",
        "gloss": {
          "en": "Good afternoon. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Perdón, ¿dónde está la oficina de objetos perdidos?",
        "gloss": {
          "en": "Excuse me, where is the lost and found office?",
          "ko": "실례지만, 분실물 센터가 어디예요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Es aquí. ¿Qué busca?",
        "gloss": {
          "en": "It's here. What are you looking for?",
          "ko": "여기예요. 뭘 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Una mochila azul. Mi pasaporte está dentro.",
        "gloss": {
          "en": "A blue backpack. My passport is inside.",
          "ko": "파란 배낭이요. 안에 여권이 있어요."
        }
      },
      {
        "who": "them",
        "text": "¿Es esta?",
        "gloss": {
          "en": "Is it this one?",
          "ko": "이거예요?"
        }
      },
      {
        "who": "me",
        "text": "¡Sí! Es mi mochila.",
        "gloss": {
          "en": "Yes! It's my backpack.",
          "ko": "네! 제 배낭이에요."
        },
        "frames": [
          "es-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. Aquí tiene.",
        "gloss": {
          "en": "Very good. Here you are.",
          "ko": "잘됐네요. 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Muchas gracias por todo.",
        "gloss": {
          "en": "Thank you very much for everything.",
          "ko": "여러 가지로 정말 감사해요."
        },
        "frames": [
          "es-f1-07"
        ]
      }
    ]
  },
  {
    "id": "es-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call to meet a friend",
      "ko": "친구와 만나려고 통화하기"
    },
    "expressions": [
      "hola",
      "vale"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Hola? ¿Dónde estás?",
        "gloss": {
          "en": "Hello? Where are you?",
          "ko": "여보세요? 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "Hola, Lucía. Estoy en la estación.",
        "gloss": {
          "en": "Hi, Lucía. I'm at the station.",
          "ko": "안녕하세요, 루시아. 저 역에 있어요."
        },
        "frames": [
          "es-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Yo estoy en el café. ¿Hay taxis allí?",
        "gloss": {
          "en": "I'm at the café. Are there taxis there?",
          "ko": "저는 카페에 있어요. 거기 택시 있어요?"
        }
      },
      {
        "who": "me",
        "text": "No, no hay taxis. ¿Dónde está el café?",
        "gloss": {
          "en": "No, there are no taxis. Where is the café?",
          "ko": "아니요, 택시가 없어요. 카페가 어디예요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Está en la plaza, cerca de la estación.",
        "gloss": {
          "en": "It's in the square, near the station.",
          "ko": "광장에 있어요, 역 근처예요."
        }
      },
      {
        "who": "me",
        "text": "Vale, voy.",
        "gloss": {
          "en": "OK, I'm coming.",
          "ko": "알겠어요, 갈게요."
        }
      },
      {
        "who": "them",
        "text": "Perfecto. ¡Hasta ahora!",
        "gloss": {
          "en": "Perfect. See you in a bit!",
          "ko": "좋아요. 이따 봐요!"
        }
      },
      {
        "who": "me",
        "text": "¡Hasta ahora!",
        "gloss": {
          "en": "See you in a bit!",
          "ko": "이따 봐요!"
        },
        "frames": [
          "es-f1-06"
        ]
      }
    ]
  },
  {
    "id": "es-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a T-shirt at a clothes shop",
      "ko": "옷 가게에서 티셔츠 사기"
    },
    "expressions": [
      "hola",
      "gracias",
      "por favor",
      "cuánto cuesta",
      "adiós"
    ],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, ¿qué tal?",
        "gloss": {
          "en": "Hi, how are you?",
          "ko": "안녕하세요, 어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "Hola. ¿Cuánto cuesta esta camiseta?",
        "gloss": {
          "en": "Hi. How much is this T-shirt?",
          "ko": "안녕하세요. 이 티셔츠 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Cuesta quince euros. ¿Qué color quiere?",
        "gloss": {
          "en": "It's fifteen euros. Which color would you like?",
          "ko": "십오 유로예요. 무슨 색으로 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Quiero la camiseta azul.",
        "gloss": {
          "en": "I'd like the blue T-shirt.",
          "ko": "파란 티셔츠로 할게요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "¿Qué talla?",
        "gloss": {
          "en": "What size?",
          "ko": "사이즈는요?"
        }
      },
      {
        "who": "me",
        "text": "Talla mediana, por favor.",
        "gloss": {
          "en": "Medium, please.",
          "ko": "미디엄으로 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Aquí tiene. ¿Algo más?",
        "gloss": {
          "en": "Here you are. Anything else?",
          "ko": "여기 있어요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "No, gracias. ¡Adiós!",
        "gloss": {
          "en": "No, thanks. Bye!",
          "ko": "아니요, 괜찮아요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "es-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "In Spanish class, asking about a word",
      "ko": "스페인어 수업에서 단어 묻기"
    },
    "expressions": [
      "gracias",
      "por favor",
      "perdón",
      "no entiendo",
      "más despacio",
      "vale"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mirad la pizarra, por favor.",
        "gloss": {
          "en": "Look at the board, please.",
          "ko": "칠판을 보세요."
        }
      },
      {
        "who": "me",
        "text": "Perdón, profesora, no entiendo esta palabra.",
        "gloss": {
          "en": "Sorry, teacher, I don't understand this word.",
          "ko": "죄송해요, 선생님, 이 단어를 모르겠어요."
        },
        "frames": [
          "es-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "¿Qué palabra?",
        "gloss": {
          "en": "Which word?",
          "ko": "어떤 단어요?"
        }
      },
      {
        "who": "me",
        "text": "«Pizarra». ¿Qué es «pizarra»?",
        "gloss": {
          "en": "\"Pizarra.\" What is \"pizarra\"?",
          "ko": "'피사라'요. '피사라'가 뭐예요?"
        },
        "frames": [
          "es-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Es esto, aquí, en la pared.",
        "gloss": {
          "en": "It's this, here, on the wall.",
          "ko": "이거예요, 여기 벽에 있는 거요."
        }
      },
      {
        "who": "me",
        "text": "Ah, vale. ¿Puede hablar más despacio, por favor?",
        "gloss": {
          "en": "Ah, OK. Can you speak more slowly, please?",
          "ko": "아, 알겠어요. 좀 더 천천히 말해 주시겠어요?"
        },
        "frames": [
          "es-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Sí, claro. Perdón.",
        "gloss": {
          "en": "Yes, of course. Sorry.",
          "ko": "네, 물론이죠. 미안해요."
        }
      },
      {
        "who": "me",
        "text": "Gracias, profesora.",
        "gloss": {
          "en": "Thank you, teacher.",
          "ko": "감사합니다, 선생님."
        }
      }
    ]
  },
  {
    "id": "es-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a colleague in a new office",
      "ko": "새 사무실에서 동료와 인사"
    },
    "expressions": [
      "soy de Corea",
      "gracias"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola. ¿Trabajas en esta oficina?",
        "gloss": {
          "en": "Hi. Do you work in this office?",
          "ko": "안녕하세요. 이 사무실에서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. Trabajo en marketing.",
        "gloss": {
          "en": "Yes. I work in marketing.",
          "ko": "네. 마케팅 부서에서 일해요."
        },
        "frames": [
          "es-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "¡Ah! Yo trabajo en ventas. ¿De dónde eres?",
        "gloss": {
          "en": "Ah! I work in sales. Where are you from?",
          "ko": "아! 저는 영업부에서 일해요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Soy de Corea, de Seúl.",
        "gloss": {
          "en": "I'm from Korea, from Seoul.",
          "ko": "한국, 서울에서 왔어요."
        },
        "frames": [
          "es-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bien! ¿Hablas español?",
        "gloss": {
          "en": "Great! Do you speak Spanish?",
          "ko": "좋네요! 스페인어 해요?"
        }
      },
      {
        "who": "me",
        "text": "Un poco. Estudio español por la tarde.",
        "gloss": {
          "en": "A little. I study Spanish in the afternoon.",
          "ko": "조금요. 오후에 스페인어를 공부해요."
        },
        "frames": [
          "es-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "¡Hablas muy bien!",
        "gloss": {
          "en": "You speak very well!",
          "ko": "정말 잘하시네요!"
        }
      },
      {
        "who": "me",
        "text": "Gracias. ¡Hasta mañana!",
        "gloss": {
          "en": "Thanks. See you tomorrow!",
          "ko": "고마워요. 내일 봐요!"
        },
        "frames": [
          "es-f1-06"
        ]
      }
    ]
  },
  {
    "id": "es-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "cuánto cuesta",
      "vale"
    ],
    "grammar": [
      7,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas noches. ¿En qué puedo ayudarle?",
        "gloss": {
          "en": "Good evening. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenas noches. Tengo una reserva.",
        "gloss": {
          "en": "Good evening. I have a reservation.",
          "ko": "안녕하세요. 예약했어요."
        },
        "frames": [
          "es-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Su pasaporte, por favor?",
        "gloss": {
          "en": "Very good. Your passport, please?",
          "ko": "네. 여권 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, aquí tiene.",
        "gloss": {
          "en": "Yes, here you are.",
          "ko": "네, 여기 있어요."
        }
      },
      {
        "who": "them",
        "text": "Gracias. Su habitación es la ciento dos.",
        "gloss": {
          "en": "Thank you. Your room is one-oh-two.",
          "ko": "감사합니다. 방은 백이 호예요."
        }
      },
      {
        "who": "me",
        "text": "¿Cuánto cuesta el desayuno?",
        "gloss": {
          "en": "How much is breakfast?",
          "ko": "아침 식사는 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Ocho euros. Es de siete a diez.",
        "gloss": {
          "en": "Eight euros. It's from seven to ten.",
          "ko": "팔 유로예요. 일곱 시부터 열 시까지예요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Dónde está el ascensor?",
        "gloss": {
          "en": "OK. Where is the elevator?",
          "ko": "알겠어요. 엘리베이터는 어디 있어요?"
        },
        "frames": [
          "es-f1-09"
        ]
      }
    ]
  },
  {
    "id": "es-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a small restaurant",
      "ko": "작은 식당에서 주문하기"
    },
    "expressions": [
      "por favor",
      "vale"
    ],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! ¿Para beber?",
        "gloss": {
          "en": "Hi! Something to drink?",
          "ko": "안녕하세요! 마실 건요?"
        }
      },
      {
        "who": "me",
        "text": "Agua, por favor.",
        "gloss": {
          "en": "Water, please.",
          "ko": "물 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "¿Con gas o sin gas?",
        "gloss": {
          "en": "Sparkling or still?",
          "ko": "탄산수요, 그냥 물이요?"
        }
      },
      {
        "who": "me",
        "text": "Sin gas. Y quiero una ensalada.",
        "gloss": {
          "en": "Still. And I'd like a salad.",
          "ko": "그냥 물이요. 그리고 샐러드 하나 주세요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Algo más?",
        "gloss": {
          "en": "Very good. Anything else?",
          "ko": "네. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Qué es «pulpo a la gallega»?",
        "gloss": {
          "en": "Yes. What is \"pulpo a la gallega\"?",
          "ko": "네. '풀포 아 라 가예가'가 뭐예요?"
        },
        "frames": [
          "es-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Es pulpo con patatas. Está muy bueno.",
        "gloss": {
          "en": "It's octopus with potatoes. It's very good.",
          "ko": "감자를 곁들인 문어예요. 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "¡Vale, quiero el pulpo!",
        "gloss": {
          "en": "OK, I'd like the octopus!",
          "ko": "좋아요, 문어 주세요!"
        },
        "frames": [
          "es-f1-12"
        ]
      }
    ]
  },
  {
    "id": "es-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking at a family photo with a friend",
      "ko": "친구와 가족사진 보기"
    },
    "expressions": [],
    "grammar": [
      7,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Qué foto bonita! ¿Quién es?",
        "gloss": {
          "en": "What a nice photo! Who is it?",
          "ko": "사진 예쁘네요! 누구예요?"
        }
      },
      {
        "who": "me",
        "text": "Es mi hermana.",
        "gloss": {
          "en": "It's my sister.",
          "ko": "제 여동생이에요."
        },
        "frames": [
          "es-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "¿Tienes más hermanos?",
        "gloss": {
          "en": "Do you have more siblings?",
          "ko": "형제가 더 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tengo un hermano también.",
        "gloss": {
          "en": "Yes, I have a brother too.",
          "ko": "네, 남동생도 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "¿Y cuántos años tienes tú?",
        "gloss": {
          "en": "And how old are you?",
          "ko": "그럼 당신은 몇 살이에요?"
        }
      },
      {
        "who": "me",
        "text": "Tengo veintiocho años.",
        "gloss": {
          "en": "I'm twenty-eight years old.",
          "ko": "스물여덟 살이에요."
        },
        "frames": [
          "es-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "¡Yo también!",
        "gloss": {
          "en": "Me too!",
          "ko": "저도요!"
        }
      },
      {
        "who": "me",
        "text": "¿Sí? ¡Qué bien!",
        "gloss": {
          "en": "Really? How nice!",
          "ko": "그래요? 좋네요!"
        }
      }
    ]
  },
  {
    "id": "es-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the tourist information office",
      "ko": "관광 안내소에서"
    },
    "expressions": [
      "hola",
      "gracias"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, buenos días. ¿Qué necesita?",
        "gloss": {
          "en": "Hello, good morning. What do you need?",
          "ko": "안녕하세요. 무엇이 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Hola. Quiero un mapa de la ciudad.",
        "gloss": {
          "en": "Hi. I'd like a map of the city.",
          "ko": "안녕하세요. 시내 지도 하나 주세요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Aquí tiene. Es gratis.",
        "gloss": {
          "en": "Here you are. It's free.",
          "ko": "여기 있어요. 무료예요."
        }
      },
      {
        "who": "me",
        "text": "Gracias. ¿Dónde está el museo?",
        "gloss": {
          "en": "Thanks. Where is the museum?",
          "ko": "고마워요. 박물관은 어디 있어요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Está en el centro, cerca de la catedral.",
        "gloss": {
          "en": "It's in the center, near the cathedral.",
          "ko": "시내 중심, 대성당 근처에 있어요."
        }
      },
      {
        "who": "me",
        "text": "¿Hay un autobús por aquí?",
        "gloss": {
          "en": "Is there a bus around here?",
          "ko": "이 근처에 버스가 있어요?"
        },
        "frames": [
          "es-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Sí, el autobús uno. La parada está enfrente.",
        "gloss": {
          "en": "Yes, bus number one. The stop is across the street.",
          "ko": "네, 일 번 버스요. 정류장은 맞은편에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Perfecto. Gracias por el mapa.",
        "gloss": {
          "en": "Perfect. Thanks for the map.",
          "ko": "좋아요. 지도 고마워요."
        },
        "frames": [
          "es-f1-07"
        ]
      }
    ]
  },
  {
    "id": "es-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Signing up at a gym",
      "ko": "헬스장 등록하기"
    },
    "expressions": [
      "cuánto cuesta",
      "vale"
    ],
    "grammar": [
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola. ¿Primera vez aquí?",
        "gloss": {
          "en": "Hi. First time here?",
          "ko": "안녕하세요. 처음 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Cuánto cuesta un mes?",
        "gloss": {
          "en": "Yes. How much is one month?",
          "ko": "네. 한 달에 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Treinta euros al mes.",
        "gloss": {
          "en": "Thirty euros a month.",
          "ko": "한 달에 삼십 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Hay clases de yoga?",
        "gloss": {
          "en": "OK. Are there yoga classes?",
          "ko": "알겠어요. 요가 수업도 있어요?"
        }
      },
      {
        "who": "them",
        "text": "Sí, por la tarde. ¿Quieres probar hoy?",
        "gloss": {
          "en": "Yes, in the afternoon. Do you want to try today?",
          "ko": "네, 오후에 있어요. 오늘 해 보실래요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, quiero probar.",
        "gloss": {
          "en": "Yes, I'd like to try.",
          "ko": "네, 해 보고 싶어요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Tienes toalla?",
        "gloss": {
          "en": "Very good. Do you have a towel?",
          "ko": "좋아요. 수건 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tengo una toalla.",
        "gloss": {
          "en": "Yes, I have a towel.",
          "ko": "네, 수건 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      }
    ]
  },
  {
    "id": "es-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Taking a taxi to the hotel",
      "ko": "택시 타고 호텔 가기"
    },
    "expressions": [
      "buenas tardes",
      "gracias",
      "por favor",
      "cuánto cuesta",
      "vale"
    ],
    "grammar": [
      7,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas tardes. ¿Adónde va?",
        "gloss": {
          "en": "Good afternoon. Where are you going?",
          "ko": "안녕하세요. 어디로 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Buenas tardes. Al hotel Sol, por favor.",
        "gloss": {
          "en": "Good afternoon. To the Hotel Sol, please.",
          "ko": "안녕하세요. 솔 호텔로 가 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "¿Hotel Sol? ¿En la calle Luna?",
        "gloss": {
          "en": "Hotel Sol? On Calle Luna?",
          "ko": "솔 호텔이요? 루나 거리에 있는 거요?"
        }
      },
      {
        "who": "me",
        "text": "No sé. Tengo la dirección aquí.",
        "gloss": {
          "en": "I don't know. I have the address here.",
          "ko": "잘 모르겠어요. 주소가 여기 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Ah, vale. Está cerca. Diez minutos.",
        "gloss": {
          "en": "Ah, OK. It's close. Ten minutes.",
          "ko": "아, 네. 가까워요. 십 분이요."
        }
      },
      {
        "who": "me",
        "text": "¿Cuánto cuesta el viaje, más o menos?",
        "gloss": {
          "en": "How much is the ride, more or less?",
          "ko": "요금이 대략 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Unos doce euros.",
        "gloss": {
          "en": "About twelve euros.",
          "ko": "십이 유로쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Vale, gracias.",
        "gloss": {
          "en": "OK, thanks.",
          "ko": "알겠어요, 감사합니다."
        }
      }
    ]
  },
  {
    "id": "es-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Visiting a friend's new flat",
      "ko": "친구의 새집에 놀러 가기"
    },
    "expressions": [
      "hola",
      "gracias",
      "por favor",
      "dónde está el baño"
    ],
    "grammar": [
      5,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! ¡Pasa, pasa!",
        "gloss": {
          "en": "Hi! Come in, come in!",
          "ko": "안녕하세요! 들어와요, 들어와요!"
        }
      },
      {
        "who": "me",
        "text": "Hola. Gracias por la invitación.",
        "gloss": {
          "en": "Hi. Thanks for the invitation.",
          "ko": "안녕하세요. 초대해 줘서 고마워요."
        },
        "frames": [
          "es-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "De nada. ¿Quieres algo para beber?",
        "gloss": {
          "en": "You're welcome. Would you like something to drink?",
          "ko": "천만에요. 뭐 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, agua, por favor.",
        "gloss": {
          "en": "Yes, water, please.",
          "ko": "네, 물 주세요."
        },
        "frames": [
          "es-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Toma. ¿Qué tal el piso? Es nuevo.",
        "gloss": {
          "en": "Here. What do you think of the flat? It's new.",
          "ko": "여기요. 집 어때요? 새집이에요."
        }
      },
      {
        "who": "me",
        "text": "¡Es muy bonito! ¿Dónde está el baño?",
        "gloss": {
          "en": "It's very nice! Where is the bathroom?",
          "ko": "정말 예뻐요! 화장실은 어디예요?"
        },
        "frames": [
          "es-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Allí, a la derecha.",
        "gloss": {
          "en": "Over there, on the right.",
          "ko": "저기 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Gracias.",
        "gloss": {
          "en": "Thanks.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "es-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A coworker calls: running late for a meeting",
      "ko": "회의에 늦어서 동료에게서 온 전화"
    },
    "expressions": [
      "perdón"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Hola? ¿Dónde estás? La reunión es ahora.",
        "gloss": {
          "en": "Hello? Where are you? The meeting is now.",
          "ko": "여보세요? 어디예요? 지금 회의예요."
        }
      },
      {
        "who": "me",
        "text": "Perdón. Estoy en el metro.",
        "gloss": {
          "en": "Sorry. I'm on the metro.",
          "ko": "죄송해요. 지하철 안이에요."
        },
        "frames": [
          "es-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Vale. ¿Tienes el informe?",
        "gloss": {
          "en": "OK. Do you have the report?",
          "ko": "알겠어요. 보고서는 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tengo el informe.",
        "gloss": {
          "en": "Yes, I have the report.",
          "ko": "네, 보고서 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Bien. ¿Estás cerca?",
        "gloss": {
          "en": "Good. Are you close?",
          "ko": "좋아요. 가까이 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, estoy en la estación de Sol.",
        "gloss": {
          "en": "Yes, I'm at Sol station.",
          "ko": "네, 솔 역에 있어요."
        },
        "frames": [
          "es-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Perfecto. ¡Hasta ahora!",
        "gloss": {
          "en": "Perfect. See you in a bit!",
          "ko": "좋아요. 이따 봐요!"
        }
      },
      {
        "who": "me",
        "text": "¡Hasta ahora!",
        "gloss": {
          "en": "See you in a bit!",
          "ko": "이따 봐요!"
        },
        "frames": [
          "es-f1-06"
        ]
      }
    ]
  },
  {
    "id": "es-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Getting a library card",
      "ko": "도서관 카드 만들기"
    },
    "expressions": [
      "gracias",
      "por favor",
      "adiós"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola. ¿Quieres la tarjeta de la biblioteca?",
        "gloss": {
          "en": "Hi. Do you want a library card?",
          "ko": "안녕하세요. 도서관 카드 만드시려고요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, por favor. Soy estudiante.",
        "gloss": {
          "en": "Yes, please. I'm a student.",
          "ko": "네, 부탁해요. 저는 학생이에요."
        },
        "frames": [
          "es-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Qué estudias?",
        "gloss": {
          "en": "Very good. What do you study?",
          "ko": "좋아요. 뭘 공부해요?"
        }
      },
      {
        "who": "me",
        "text": "Estudio historia.",
        "gloss": {
          "en": "I study history.",
          "ko": "역사를 공부해요."
        },
        "frames": [
          "es-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "¿Tienes un documento?",
        "gloss": {
          "en": "Do you have an ID?",
          "ko": "신분증 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, es mi carné de estudiante.",
        "gloss": {
          "en": "Yes, it's my student card.",
          "ko": "네, 제 학생증이에요."
        },
        "frames": [
          "es-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "Perfecto. Aquí tienes la tarjeta.",
        "gloss": {
          "en": "Perfect. Here's your card.",
          "ko": "좋아요. 카드 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Muchas gracias. ¡Adiós!",
        "gloss": {
          "en": "Thank you very much. Bye!",
          "ko": "정말 고마워요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "es-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday small talk at the office about the weekend",
      "ko": "월요일 사무실에서 주말 이야기"
    },
    "expressions": [
      "este fin de semana",
      "quieres venir",
      "voy a"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! ¿Qué tal el fin de semana?",
        "gloss": {
          "en": "Hi! How was your weekend?",
          "ko": "안녕하세요! 주말 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Muy bien. El sábado fui a la playa con unos amigos.",
        "gloss": {
          "en": "Very good. On Saturday I went to the beach with some friends.",
          "ko": "아주 좋았어요. 토요일에 친구들이랑 바다에 갔어요."
        },
        "frames": [
          "es-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bien! ¿Y el domingo?",
        "gloss": {
          "en": "Nice! And Sunday?",
          "ko": "좋네요! 일요일은요?"
        }
      },
      {
        "who": "me",
        "text": "Ayer descansé en casa y vi una película de miedo.",
        "gloss": {
          "en": "Yesterday I rested at home and watched a horror movie.",
          "ko": "어제는 집에서 쉬면서 공포 영화를 봤어요."
        },
        "frames": [
          "es-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "¿Una de miedo? ¿Te gustó?",
        "gloss": {
          "en": "A horror one? Did you like it?",
          "ko": "공포 영화요? 재미있었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, me encanta el cine de miedo.",
        "gloss": {
          "en": "Yes, I love horror films.",
          "ko": "네, 저는 공포 영화를 정말 좋아해요."
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "¡Yo no puedo verlo, qué miedo!",
        "gloss": {
          "en": "I can't watch them, so scary!",
          "ko": "저는 못 봐요, 너무 무서워요!"
        }
      },
      {
        "who": "me",
        "text": "Pues este fin de semana voy a ver otra. ¿Quieres venir?",
        "gloss": {
          "en": "Well, this weekend I'm going to watch another one. Do you want to come?",
          "ko": "그럼 이번 주말에 또 하나 볼 건데요. 같이 볼래요?"
        },
        "frames": [
          "es-f2-04",
          "es-f2-10"
        ]
      }
    ]
  },
  {
    "id": "es-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor with a sore throat",
      "ko": "목이 아파서 병원에 갔을 때"
    },
    "expressions": [
      "tengo que",
      "se puede"
    ],
    "grammar": [
      6,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Qué le pasa?",
        "gloss": {
          "en": "Good morning. What's wrong?",
          "ko": "안녕하세요. 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Buenos días. Me duele mucho la garganta.",
        "gloss": {
          "en": "Good morning. My throat really hurts.",
          "ko": "안녕하세요. 목이 많이 아파요."
        },
        "frames": [
          "es-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "¿Desde cuándo?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Desde ayer. Anoche tuve fiebre.",
        "gloss": {
          "en": "Since yesterday. Last night I had a fever.",
          "ko": "어제부터요. 어젯밤에는 열도 났어요."
        },
        "frames": [
          "es-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "A ver… Es una infección leve. Tome este jarabe.",
        "gloss": {
          "en": "Let's see… It's a mild infection. Take this syrup.",
          "ko": "어디 봐요… 가벼운 염증이에요. 이 시럽을 드세요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Se puede tomar con comida?",
        "gloss": {
          "en": "OK. Can you take it with food?",
          "ko": "네. 밥이랑 같이 먹어도 돼요?"
        },
        "frames": [
          "es-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "Sí, después de comer, tres veces al día.",
        "gloss": {
          "en": "Yes, after eating, three times a day.",
          "ko": "네, 식후에 하루 세 번이요."
        }
      },
      {
        "who": "me",
        "text": "Vale. Hoy tengo que descansar, entonces.",
        "gloss": {
          "en": "OK. So today I have to rest.",
          "ko": "알겠어요. 그럼 오늘은 쉬어야겠네요."
        },
        "frames": [
          "es-f2-13"
        ]
      }
    ]
  },
  {
    "id": "es-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a restaurant",
      "ko": "레스토랑에서 저녁 주문하기"
    },
    "expressions": [
      "para mí"
    ],
    "grammar": [
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas noches. ¿Ya sabe qué va a tomar?",
        "gloss": {
          "en": "Good evening. Do you know what you'll have?",
          "ko": "안녕하세요. 주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Todavía no. ¿Qué plato me recomienda?",
        "gloss": {
          "en": "Not yet. Which dish do you recommend?",
          "ko": "아직이요. 어떤 요리를 추천하세요?"
        },
        "frames": [
          "es-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "La paella está muy buena hoy.",
        "gloss": {
          "en": "The paella is very good today.",
          "ko": "오늘은 파에야가 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Vale. Para mí, la paella, por favor.",
        "gloss": {
          "en": "OK. For me, the paella, please.",
          "ko": "좋아요. 저는 파에야로 주세요."
        },
        "frames": [
          "es-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "¿Y de primero? Tenemos un gazpacho muy rico.",
        "gloss": {
          "en": "And for a starter? We have a very tasty gazpacho.",
          "ko": "전채는요? 가스파초가 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "¿El gazpacho? Lo quiero sin cebolla, por favor.",
        "gloss": {
          "en": "The gazpacho? I want it without onion, please.",
          "ko": "가스파초요? 양파는 빼 주세요."
        },
        "frames": [
          "es-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Sin problema. ¿Y para beber?",
        "gloss": {
          "en": "No problem. And to drink?",
          "ko": "알겠습니다. 마실 건요?"
        }
      },
      {
        "who": "me",
        "text": "Prefiero agua, gracias.",
        "gloss": {
          "en": "I prefer water, thanks.",
          "ko": "물로 할게요, 고마워요."
        },
        "frames": [
          "es-f2-09"
        ]
      }
    ]
  },
  {
    "id": "es-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a friend to a concert by phone",
      "ko": "전화로 친구를 콘서트에 초대하기"
    },
    "expressions": [
      "quieres venir",
      "nos vemos"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Sí? ¡Hola! ¿Qué tal?",
        "gloss": {
          "en": "Hello? Hi! How are you?",
          "ko": "여보세요? 안녕하세요! 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Hola. ¿Quieres venir al concierto el viernes?",
        "gloss": {
          "en": "Hi. Do you want to come to the concert on Friday?",
          "ko": "안녕하세요. 금요일에 콘서트 같이 갈래요?"
        },
        "frames": [
          "es-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué buena idea! ¿A qué hora es?",
        "gloss": {
          "en": "What a good idea! What time is it?",
          "ko": "좋은 생각이에요! 몇 시예요?"
        }
      },
      {
        "who": "me",
        "text": "A las nueve. ¿Puedes llegar a las ocho y media?",
        "gloss": {
          "en": "At nine. Can you get there at eight thirty?",
          "ko": "아홉 시요. 여덟 시 반까지 올 수 있어요?"
        },
        "frames": [
          "es-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Sí, me viene bien.",
        "gloss": {
          "en": "Yes, that works for me.",
          "ko": "네, 괜찮아요."
        }
      },
      {
        "who": "me",
        "text": "Genial. Nos vemos en la puerta del teatro.",
        "gloss": {
          "en": "Great. Let's meet at the theater entrance.",
          "ko": "좋아요. 극장 입구에서 만나요."
        },
        "frames": [
          "es-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Perfecto. ¿Llevo algo?",
        "gloss": {
          "en": "Perfect. Should I bring anything?",
          "ko": "좋아요. 뭐 가져갈까요?"
        }
      },
      {
        "who": "me",
        "text": "No, no. Tengo las entradas.",
        "gloss": {
          "en": "No, no. I have the tickets.",
          "ko": "아니요. 표는 제가 있어요."
        },
        "frames": [
          "es-f1-13"
        ]
      }
    ]
  },
  {
    "id": "es-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a pharmacy with a headache",
      "ko": "두통 때문에 약국에서"
    },
    "expressions": [
      "me duele la cabeza",
      "se puede"
    ],
    "grammar": [
      6,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, buenas. ¿Qué necesita?",
        "gloss": {
          "en": "Hello. What do you need?",
          "ko": "안녕하세요. 뭐가 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Hola. Me duele la cabeza desde esta mañana.",
        "gloss": {
          "en": "Hi. I've had a headache since this morning.",
          "ko": "안녕하세요. 아침부터 머리가 아파요."
        },
        "frames": [
          "es-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "¿Tiene fiebre?",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열이 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "No, pero estoy muy mal.",
        "gloss": {
          "en": "No, but I feel really bad.",
          "ko": "아니요, 그런데 몸이 많이 안 좋아요."
        },
        "frames": [
          "es-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Puede tomar este ibuprofeno.",
        "gloss": {
          "en": "You can take this ibuprofen.",
          "ko": "이 이부프로펜을 드셔도 돼요."
        }
      },
      {
        "who": "me",
        "text": "¿Se puede tomar con café?",
        "gloss": {
          "en": "Can you take it with coffee?",
          "ko": "커피랑 같이 먹어도 돼요?"
        },
        "frames": [
          "es-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "Mejor con agua y después de comer.",
        "gloss": {
          "en": "Better with water and after eating.",
          "ko": "물이랑, 식후에 드시는 게 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Cuánto cuesta?",
        "gloss": {
          "en": "OK. How much is it?",
          "ko": "알겠어요. 얼마예요?"
        },
        "frames": [
          "es-f1-08"
        ]
      }
    ]
  },
  {
    "id": "es-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend asks about your weekend plans",
      "ko": "친구가 주말 계획을 물을 때"
    },
    "expressions": [
      "nos vemos",
      "voy a",
      "tengo que"
    ],
    "grammar": [
      2,
      5,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oye, ¿vas a hacer algo este fin de semana?",
        "gloss": {
          "en": "Hey, are you doing anything this weekend?",
          "ko": "저기, 이번 주말에 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, voy a visitar a mis abuelos. ¿Y tú?",
        "gloss": {
          "en": "Yes, I'm going to visit my grandparents. And you?",
          "ko": "네, 조부모님 댁에 갈 거예요. 당신은요?"
        },
        "frames": [
          "es-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "No sé todavía. ¿Vas a estar allí todo el fin de semana?",
        "gloss": {
          "en": "I don't know yet. Are you going to be there all weekend?",
          "ko": "아직 모르겠어요. 주말 내내 거기 있을 거예요?"
        }
      },
      {
        "who": "me",
        "text": "No, solo el sábado. Tengo que ayudar a mi abuela en el jardín.",
        "gloss": {
          "en": "No, just Saturday. I have to help my grandma in the garden.",
          "ko": "아니요, 토요일만요. 할머니 정원 일을 도와드려야 해요."
        },
        "frames": [
          "es-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Pues el domingo hay una fiesta en casa de Ana.",
        "gloss": {
          "en": "Well, on Sunday there's a party at Ana's place.",
          "ko": "그럼 일요일에 아나네 집에서 파티가 있어요."
        }
      },
      {
        "who": "me",
        "text": "¿Puedo llevar a mi hermano?",
        "gloss": {
          "en": "Can I bring my brother?",
          "ko": "제 동생 데려가도 돼요?"
        },
        "frames": [
          "es-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "¡Claro que sí!",
        "gloss": {
          "en": "Of course!",
          "ko": "당연하죠!"
        }
      },
      {
        "who": "me",
        "text": "Genial. Nos vemos el domingo.",
        "gloss": {
          "en": "Great. See you on Sunday.",
          "ko": "좋아요. 일요일에 봐요."
        },
        "frames": [
          "es-f2-19"
        ]
      }
    ]
  },
  {
    "id": "es-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about food with your host family",
      "ko": "홈스테이 가족과 음식 이야기"
    },
    "expressions": [
      "qué buena idea",
      "me gusta mucho",
      "no me gusta"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Te gusta la comida de aquí?",
        "gloss": {
          "en": "Do you like the food here?",
          "ko": "여기 음식 입에 맞아요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, me gusta mucho la tortilla de patatas.",
        "gloss": {
          "en": "Yes, I really like the potato omelette.",
          "ko": "네, 감자 토르티야가 정말 좋아요."
        },
        "frames": [
          "es-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "¿Y el pescado?",
        "gloss": {
          "en": "And fish?",
          "ko": "생선은요?"
        }
      },
      {
        "who": "me",
        "text": "No me gusta mucho el pescado. Prefiero la carne.",
        "gloss": {
          "en": "I don't really like fish. I prefer meat.",
          "ko": "생선은 별로 안 좋아해요. 고기가 더 좋아요."
        },
        "frames": [
          "es-f2-07",
          "es-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Vale. Mañana hago pollo. ¿Te gusta el picante?",
        "gloss": {
          "en": "OK. Tomorrow I'll make chicken. Do you like spicy food?",
          "ko": "알겠어요. 내일은 닭고기 할게요. 매운 거 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "¡Me encanta la comida picante!",
        "gloss": {
          "en": "I love spicy food!",
          "ko": "매운 음식 정말 좋아해요!"
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "¡Perfecto! Pues pollo picante.",
        "gloss": {
          "en": "Perfect! Spicy chicken, then.",
          "ko": "좋아요! 그럼 매운 닭고기로 할게요."
        }
      },
      {
        "who": "me",
        "text": "¡Qué buena idea! Gracias.",
        "gloss": {
          "en": "What a good idea! Thanks.",
          "ko": "좋은 생각이에요! 고마워요."
        }
      }
    ]
  },
  {
    "id": "es-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking favors at the hotel on check-out day",
      "ko": "체크아웃 날 호텔에 부탁하기"
    },
    "expressions": [
      "voy a",
      "se puede"
    ],
    "grammar": [
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Qué tal la noche?",
        "gloss": {
          "en": "Good morning. How was your night?",
          "ko": "안녕하세요. 잘 주무셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Muy bien, gracias. ¿Puedo dejar la maleta aquí hasta la tarde?",
        "gloss": {
          "en": "Very well, thanks. Can I leave my suitcase here until the afternoon?",
          "ko": "네, 감사해요. 오후까지 여기에 가방 맡겨도 돼요?"
        },
        "frames": [
          "es-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Sí, claro. No hay problema.",
        "gloss": {
          "en": "Yes, of course. No problem.",
          "ko": "네, 물론이죠. 괜찮아요."
        }
      },
      {
        "who": "me",
        "text": "¿Se puede pagar con tarjeta?",
        "gloss": {
          "en": "Can you pay by card?",
          "ko": "카드로 계산해도 돼요?"
        },
        "frames": [
          "es-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "Sí, sin problema.",
        "gloss": {
          "en": "Yes, no problem.",
          "ko": "네, 됩니다."
        }
      },
      {
        "who": "me",
        "text": "Genial. Voy a ver el museo y vuelvo a las cinco.",
        "gloss": {
          "en": "Great. I'm going to see the museum and I'll be back at five.",
          "ko": "좋아요. 박물관 보고 다섯 시에 돌아올게요."
        },
        "frames": [
          "es-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Perfecto. ¡Que lo pase bien!",
        "gloss": {
          "en": "Perfect. Have a good time!",
          "ko": "좋아요. 즐거운 시간 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Gracias. ¡Hasta luego!",
        "gloss": {
          "en": "Thanks. See you later!",
          "ko": "고마워요. 이따 봐요!"
        }
      }
    ]
  },
  {
    "id": "es-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A coworker notices you look tired",
      "ko": "피곤해 보인다고 동료가 물을 때"
    },
    "expressions": [
      "voy a"
    ],
    "grammar": [
      0,
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Estás bien? Tienes mala cara.",
        "gloss": {
          "en": "Are you OK? You don't look well.",
          "ko": "괜찮아요? 얼굴이 안 좋아 보여요."
        }
      },
      {
        "who": "me",
        "text": "Estoy un poco mal. Ayer trabajé hasta muy tarde.",
        "gloss": {
          "en": "I'm not great. Yesterday I worked until very late.",
          "ko": "좀 안 좋아요. 어제 아주 늦게까지 일했어요."
        },
        "frames": [
          "es-f2-18",
          "es-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "¿Otra vez? ¿Por qué?",
        "gloss": {
          "en": "Again? Why?",
          "ko": "또요? 왜요?"
        }
      },
      {
        "who": "me",
        "text": "Tuve una reunión muy larga con un cliente.",
        "gloss": {
          "en": "I had a very long meeting with a client.",
          "ko": "고객이랑 회의가 아주 길었어요."
        },
        "frames": [
          "es-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Tienes que descansar más.",
        "gloss": {
          "en": "You have to rest more.",
          "ko": "좀 더 쉬어야 해요."
        }
      },
      {
        "who": "me",
        "text": "Lo sé. Hoy voy a dormir pronto.",
        "gloss": {
          "en": "I know. Today I'm going to sleep early.",
          "ko": "알아요. 오늘은 일찍 잘 거예요."
        },
        "frames": [
          "es-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "¿Quieres un café?",
        "gloss": {
          "en": "Do you want a coffee?",
          "ko": "커피 한 잔 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, por favor. ¡Gracias!",
        "gloss": {
          "en": "Yes, please. Thanks!",
          "ko": "네, 부탁해요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "es-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Trying on shoes at a shoe shop",
      "ko": "신발 가게에서 신어 보기"
    },
    "expressions": [],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, ¿le puedo ayudar?",
        "gloss": {
          "en": "Hi, can I help you?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Puedo probar estos zapatos?",
        "gloss": {
          "en": "Yes. Can I try on these shoes?",
          "ko": "네. 이 신발 신어 봐도 돼요?"
        },
        "frames": [
          "es-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Claro. ¿Qué número tiene?",
        "gloss": {
          "en": "Sure. What size are you?",
          "ko": "그럼요. 몇 사이즈 신으세요?"
        }
      },
      {
        "who": "me",
        "text": "El treinta y ocho.",
        "gloss": {
          "en": "Thirty-eight.",
          "ko": "삼십팔이요."
        }
      },
      {
        "who": "them",
        "text": "Aquí tiene. ¿Qué tal? También los tenemos en negro.",
        "gloss": {
          "en": "Here you are. How are they? We also have them in black.",
          "ko": "여기 있어요. 어떠세요? 검은색도 있어요."
        }
      },
      {
        "who": "me",
        "text": "Son cómodos, pero prefiero los negros.",
        "gloss": {
          "en": "They're comfortable, but I prefer the black ones.",
          "ko": "편한데, 검은색이 더 좋아요."
        },
        "frames": [
          "es-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Los negros cuestan diez euros más.",
        "gloss": {
          "en": "The black ones cost ten euros more.",
          "ko": "검은색은 십 유로 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "No pasa nada. Me encanta este color.",
        "gloss": {
          "en": "That's fine. I love this color.",
          "ko": "괜찮아요. 이 색이 정말 좋아요."
        },
        "frames": [
          "es-f2-08"
        ]
      }
    ]
  },
  {
    "id": "es-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Rescheduling plans with a friend",
      "ko": "친구와 약속 다시 잡기"
    },
    "expressions": [
      "nos vemos",
      "me viene bien",
      "tengo que"
    ],
    "grammar": [
      5,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Hola? ¿Quedamos esta tarde?",
        "gloss": {
          "en": "Hello? Are we meeting this afternoon?",
          "ko": "여보세요? 오늘 오후에 만나는 거죠?"
        }
      },
      {
        "who": "me",
        "text": "Lo siento, hoy tengo que trabajar hasta tarde.",
        "gloss": {
          "en": "Sorry, today I have to work late.",
          "ko": "미안해요, 오늘은 늦게까지 일해야 해요."
        },
        "frames": [
          "es-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "¡Vaya! ¿Y mañana?",
        "gloss": {
          "en": "Oh no! And tomorrow?",
          "ko": "아이고! 내일은요?"
        }
      },
      {
        "who": "me",
        "text": "Mañana sí. ¿Puedes quedar a las siete?",
        "gloss": {
          "en": "Tomorrow, yes. Can you meet at seven?",
          "ko": "내일은 돼요. 일곱 시에 만날 수 있어요?"
        },
        "frames": [
          "es-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "A las siete no puedo. ¿A las ocho?",
        "gloss": {
          "en": "I can't at seven. At eight?",
          "ko": "일곱 시는 안 돼요. 여덟 시는요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, me viene bien. Nos vemos a las ocho.",
        "gloss": {
          "en": "Yes, that works for me. See you at eight.",
          "ko": "네, 괜찮아요. 여덟 시에 봐요."
        },
        "frames": [
          "es-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Vale. ¿Y dónde?",
        "gloss": {
          "en": "OK. And where?",
          "ko": "좋아요. 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "¿Quieres ir al bar de la plaza?",
        "gloss": {
          "en": "Do you want to go to the bar in the square?",
          "ko": "광장에 있는 바에 갈래요?"
        },
        "frames": [
          "es-f2-10"
        ]
      }
    ]
  },
  {
    "id": "es-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Spanish class: what you did yesterday",
      "ko": "스페인어 수업에서 어제 한 일 말하기"
    },
    "expressions": [
      "claro que sí"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. A ver, ¿qué hiciste ayer?",
        "gloss": {
          "en": "Good morning. Let's see, what did you do yesterday?",
          "ko": "안녕하세요. 자, 어제 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Ayer cociné para mis amigos.",
        "gloss": {
          "en": "Yesterday I cooked for my friends.",
          "ko": "어제 친구들한테 요리해 줬어요."
        },
        "frames": [
          "es-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bien! ¿Qué cocinaste?",
        "gloss": {
          "en": "How nice! What did you cook?",
          "ko": "좋네요! 뭘 만들었어요?"
        }
      },
      {
        "who": "me",
        "text": "Hice un plato coreano: bibimbap.",
        "gloss": {
          "en": "I made a Korean dish: bibimbap.",
          "ko": "한국 요리, 비빔밥을 만들었어요."
        }
      },
      {
        "who": "them",
        "text": "¿Y les gustó?",
        "gloss": {
          "en": "And did they like it?",
          "ko": "친구들이 좋아했어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, mucho. ¡Me encanta cocinar!",
        "gloss": {
          "en": "Yes, a lot. I love cooking!",
          "ko": "네, 아주요. 저는 요리하는 게 정말 좋아요!"
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "¿Y vas a cocinar para la clase un día?",
        "gloss": {
          "en": "And are you going to cook for the class one day?",
          "ko": "그럼 언젠가 반 친구들한테도 해 줄 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Claro que sí. ¿Puedo traer kimchi también?",
        "gloss": {
          "en": "Of course. Can I bring kimchi too?",
          "ko": "물론이죠. 김치도 가져와도 돼요?"
        },
        "frames": [
          "es-f2-11"
        ]
      }
    ]
  },
  {
    "id": "es-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Getting a haircut",
      "ko": "미용실에서 머리 자르기"
    },
    "expressions": [
      "me gusta mucho"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola. ¿Qué te hacemos hoy?",
        "gloss": {
          "en": "Hi. What are we doing today?",
          "ko": "안녕하세요. 오늘은 어떻게 해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Quiero cortarme el pelo, pero no mucho.",
        "gloss": {
          "en": "I want a haircut, but not too much.",
          "ko": "머리를 자르고 싶은데, 많이는 말고요."
        },
        "frames": [
          "es-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Vale. ¿Tienes una foto?",
        "gloss": {
          "en": "OK. Do you have a photo?",
          "ko": "네. 사진 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, mira. Me gusta mucho este estilo.",
        "gloss": {
          "en": "Yes, look. I really like this style.",
          "ko": "네, 보세요. 이 스타일이 정말 좋아요."
        },
        "frames": [
          "es-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. Primero lavamos.",
        "gloss": {
          "en": "Very good. First we'll wash it.",
          "ko": "좋아요. 먼저 머리 감을게요."
        }
      },
      {
        "who": "me",
        "text": "¿Puedes poner el agua menos caliente?",
        "gloss": {
          "en": "Can you make the water less hot?",
          "ko": "물을 조금 덜 뜨겁게 해 줄 수 있어요?"
        },
        "frames": [
          "es-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Claro. ¿Así está bien?",
        "gloss": {
          "en": "Sure. Is this OK?",
          "ko": "그럼요. 이 정도면 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, perfecto. Gracias.",
        "gloss": {
          "en": "Yes, perfect. Thanks.",
          "ko": "네, 딱 좋아요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "es-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket at the station",
      "ko": "기차역에서 표 사기"
    },
    "expressions": [
      "para mí",
      "se puede"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Adónde va?",
        "gloss": {
          "en": "Good morning. Where are you going?",
          "ko": "안녕하세요. 어디로 가세요?"
        }
      },
      {
        "who": "me",
        "text": "A Sevilla. ¿Qué tren me recomienda?",
        "gloss": {
          "en": "To Seville. Which train do you recommend?",
          "ko": "세비야요. 어떤 기차를 추천하세요?"
        },
        "frames": [
          "es-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "El de las diez. Es el más rápido.",
        "gloss": {
          "en": "The ten o'clock one. It's the fastest.",
          "ko": "열 시 기차요. 제일 빨라요."
        }
      },
      {
        "who": "me",
        "text": "Vale. Para mí, un billete de ida y vuelta, por favor.",
        "gloss": {
          "en": "OK. For me, a return ticket, please.",
          "ko": "좋아요. 왕복표 한 장 주세요."
        },
        "frames": [
          "es-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "¿Para cuándo es la vuelta?",
        "gloss": {
          "en": "When is the return?",
          "ko": "돌아오는 건 언제로 할까요?"
        }
      },
      {
        "who": "me",
        "text": "El domingo. ¿Se puede cambiar la fecha después?",
        "gloss": {
          "en": "On Sunday. Can you change the date later?",
          "ko": "일요일이요. 나중에 날짜 바꿀 수 있어요?"
        },
        "frames": [
          "es-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "Sí, pero cuesta un poco más.",
        "gloss": {
          "en": "Yes, but it costs a bit more.",
          "ko": "네, 그런데 조금 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Vale, sin problema.",
        "gloss": {
          "en": "OK, no problem.",
          "ko": "알겠어요, 괜찮아요."
        }
      }
    ]
  },
  {
    "id": "es-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Invited to a friend's birthday dinner",
      "ko": "친구 생일 저녁에 초대받았을 때"
    },
    "expressions": [
      "a qué hora",
      "nos vemos",
      "voy a",
      "claro que sí"
    ],
    "grammar": [
      4,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! El sábado es mi cumpleaños. ¿Quieres venir a cenar?",
        "gloss": {
          "en": "Hi! Saturday is my birthday. Do you want to come for dinner?",
          "ko": "안녕하세요! 토요일이 제 생일이에요. 저녁 먹으러 올래요?"
        }
      },
      {
        "who": "me",
        "text": "¡Claro que sí! ¿A qué hora es?",
        "gloss": {
          "en": "Of course! What time is it?",
          "ko": "당연하죠! 몇 시예요?"
        }
      },
      {
        "who": "them",
        "text": "A las nueve, en mi casa.",
        "gloss": {
          "en": "At nine, at my place.",
          "ko": "아홉 시, 우리 집에서요."
        }
      },
      {
        "who": "me",
        "text": "¿Puedo llevar algo? ¿Un postre?",
        "gloss": {
          "en": "Can I bring something? A dessert?",
          "ko": "뭐 가져가도 돼요? 디저트 같은 거요?"
        },
        "frames": [
          "es-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "¡Sí! Me encantan los dulces.",
        "gloss": {
          "en": "Yes! I love sweets.",
          "ko": "네! 단 거 정말 좋아해요."
        }
      },
      {
        "who": "me",
        "text": "Vale. Voy a hacer una tarta de chocolate.",
        "gloss": {
          "en": "OK. I'm going to make a chocolate cake.",
          "ko": "좋아요. 초콜릿 케이크를 만들게요."
        },
        "frames": [
          "es-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué rico! Gracias.",
        "gloss": {
          "en": "Yum! Thanks.",
          "ko": "맛있겠다! 고마워요."
        }
      },
      {
        "who": "me",
        "text": "De nada. Nos vemos el sábado.",
        "gloss": {
          "en": "You're welcome. See you on Saturday.",
          "ko": "천만에요. 토요일에 봐요."
        },
        "frames": [
          "es-f2-19"
        ]
      }
    ]
  },
  {
    "id": "es-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Telling a neighbor about a family trip",
      "ko": "이웃에게 가족 여행 이야기하기"
    },
    "expressions": [],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Hola! Hace días que no te veo.",
        "gloss": {
          "en": "Hi! I haven't seen you for days.",
          "ko": "안녕하세요! 며칠 동안 못 봤네요."
        }
      },
      {
        "who": "me",
        "text": "Sí, el sábado fui a Granada con mi familia.",
        "gloss": {
          "en": "Yes, on Saturday I went to Granada with my family.",
          "ko": "네, 토요일에 가족이랑 그라나다에 갔어요."
        },
        "frames": [
          "es-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bonito! ¿Qué tal el viaje?",
        "gloss": {
          "en": "How lovely! How was the trip?",
          "ko": "좋네요! 여행 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Muy bien, pero tuve un problema con el coche.",
        "gloss": {
          "en": "Very good, but I had a problem with the car.",
          "ko": "좋았는데, 차에 문제가 좀 있었어요."
        },
        "frames": [
          "es-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "¡Vaya! ¿Y la Alhambra?",
        "gloss": {
          "en": "Oh no! And the Alhambra?",
          "ko": "저런! 알람브라는요?"
        }
      },
      {
        "who": "me",
        "text": "Me encanta la Alhambra. ¡Es preciosa!",
        "gloss": {
          "en": "I love the Alhambra. It's beautiful!",
          "ko": "알람브라 정말 좋아요. 너무 아름다워요!"
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "¿Vas a volver?",
        "gloss": {
          "en": "Are you going to go back?",
          "ko": "또 갈 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, en verano. Prefiero ir con más tiempo.",
        "gloss": {
          "en": "Yes, in summer. I prefer to go with more time.",
          "ko": "네, 여름에요. 시간을 더 넉넉하게 가는 게 좋아요."
        },
        "frames": [
          "es-f2-09"
        ]
      }
    ]
  },
  {
    "id": "es-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Choosing a movie for movie night at home",
      "ko": "집에서 볼 영화 고르기"
    },
    "expressions": [
      "voy a",
      "no me gusta"
    ],
    "grammar": [
      3,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Vemos una película esta noche?",
        "gloss": {
          "en": "Shall we watch a movie tonight?",
          "ko": "오늘 밤에 영화 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Vas a elegir tú?",
        "gloss": {
          "en": "OK. Are you going to choose?",
          "ko": "좋아요. 당신이 고를 거예요?"
        },
        "frames": [
          "es-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Sí. ¿Una de miedo?",
        "gloss": {
          "en": "Yes. A horror one?",
          "ko": "네. 공포 영화 어때요?"
        }
      },
      {
        "who": "me",
        "text": "No me gusta el cine de miedo. Prefiero las comedias.",
        "gloss": {
          "en": "I don't like horror films. I prefer comedies.",
          "ko": "공포 영화는 안 좋아해요. 코미디가 더 좋아요."
        },
        "frames": [
          "es-f2-07",
          "es-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Vale, una comedia. ¿Pido una pizza?",
        "gloss": {
          "en": "OK, a comedy. Shall I order a pizza?",
          "ko": "알겠어요, 코미디로 해요. 피자 시킬까요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. Me encanta la pizza, pero sin cebolla.",
        "gloss": {
          "en": "Yes. I love pizza, but without onion.",
          "ko": "네. 피자 정말 좋아해요, 양파만 빼고요."
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Perfecto. La película empieza a las nueve.",
        "gloss": {
          "en": "Perfect. The movie starts at nine.",
          "ko": "좋아요. 영화는 아홉 시에 시작해요."
        }
      },
      {
        "who": "me",
        "text": "Vale, voy a comprar algo de beber.",
        "gloss": {
          "en": "OK, I'm going to buy something to drink.",
          "ko": "알겠어요, 마실 것 좀 사 올게요."
        },
        "frames": [
          "es-f2-04"
        ]
      }
    ]
  },
  {
    "id": "es-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering tapas at a bar",
      "ko": "바에서 타파스 주문하기"
    },
    "expressions": [
      "para mí",
      "la cuenta"
    ],
    "grammar": [
      7,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Buenas! ¿Qué le pongo?",
        "gloss": {
          "en": "Hi there! What can I get you?",
          "ko": "어서 오세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Hola. ¿Qué tapa me recomienda?",
        "gloss": {
          "en": "Hi. Which tapa do you recommend?",
          "ko": "안녕하세요. 어떤 타파스를 추천하세요?"
        },
        "frames": [
          "es-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "El bocadillo de lomo, con pimientos y cebolla. ¡Está buenísimo!",
        "gloss": {
          "en": "The pork loin sandwich, with peppers and onion. It's delicious!",
          "ko": "돼지 등심 보카디요요, 피망이랑 양파가 들어가요. 정말 맛있어요!"
        }
      },
      {
        "who": "me",
        "text": "Vale, el bocadillo. Lo quiero sin cebolla, por favor.",
        "gloss": {
          "en": "OK, the sandwich. I want it without onion, please.",
          "ko": "좋아요, 보카디요로 할게요. 양파는 빼 주세요."
        },
        "frames": [
          "es-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Y para beber?",
        "gloss": {
          "en": "Very good. And to drink?",
          "ko": "네. 마실 건요?"
        }
      },
      {
        "who": "me",
        "text": "Para mí, una caña, por favor.",
        "gloss": {
          "en": "For me, a small beer, please.",
          "ko": "저는 생맥주 한 잔 주세요."
        },
        "frames": [
          "es-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Aquí tiene.",
        "gloss": {
          "en": "Here you are.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Gracias. Y la cuenta, por favor.",
        "gloss": {
          "en": "Thanks. And the bill, please.",
          "ko": "고마워요. 그리고 계산서도 주세요."
        }
      }
    ]
  },
  {
    "id": "es-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a coworker to cover a meeting",
      "ko": "동료에게 회의를 대신 부탁하기"
    },
    "expressions": [
      "tengo que"
    ],
    "grammar": [
      5,
      6,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hola, ¿qué pasa?",
        "gloss": {
          "en": "Hi, what's up?",
          "ko": "안녕하세요, 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "Oye, mañana tengo que ir al médico.",
        "gloss": {
          "en": "Hey, tomorrow I have to go to the doctor.",
          "ko": "저기, 내일 병원에 가야 해요."
        },
        "frames": [
          "es-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Vaya. ¿Estás bien?",
        "gloss": {
          "en": "Oh. Are you OK?",
          "ko": "저런. 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, pero me duele la espalda desde el lunes.",
        "gloss": {
          "en": "Yes, but my back has hurt since Monday.",
          "ko": "네, 그런데 월요일부터 허리가 아파요."
        },
        "frames": [
          "es-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Lo siento. ¿Necesitas algo?",
        "gloss": {
          "en": "I'm sorry. Do you need anything?",
          "ko": "안됐네요. 뭐 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Puedes ir a la reunión por mí?",
        "gloss": {
          "en": "Yes. Can you go to the meeting for me?",
          "ko": "네. 저 대신 회의에 가 줄 수 있어요?"
        },
        "frames": [
          "es-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Claro, sin problema.",
        "gloss": {
          "en": "Sure, no problem.",
          "ko": "그럼요, 문제없어요."
        }
      },
      {
        "who": "me",
        "text": "¡Muchas gracias! Te debo una.",
        "gloss": {
          "en": "Thanks so much! I owe you one.",
          "ko": "정말 고마워요! 신세 졌어요."
        }
      }
    ]
  },
  {
    "id": "es-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the museum entrance",
      "ko": "박물관 입구에서"
    },
    "expressions": [
      "se puede"
    ],
    "grammar": [
      4,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Una entrada?",
        "gloss": {
          "en": "Good morning. One ticket?",
          "ko": "안녕하세요. 입장권 한 장이요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Se puede hacer fotos dentro?",
        "gloss": {
          "en": "Yes. Can you take photos inside?",
          "ko": "네. 안에서 사진 찍어도 돼요?"
        },
        "frames": [
          "es-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "Sí, pero sin flash.",
        "gloss": {
          "en": "Yes, but without flash.",
          "ko": "네, 플래시 없이요."
        }
      },
      {
        "who": "me",
        "text": "Vale. ¿Qué sala me recomienda?",
        "gloss": {
          "en": "OK. Which room do you recommend?",
          "ko": "알겠어요. 어느 전시실을 추천하세요?"
        },
        "frames": [
          "es-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "La sala de pintura moderna, en la segunda planta.",
        "gloss": {
          "en": "The modern painting room, on the second floor.",
          "ko": "이 층에 있는 현대 미술 전시실이요."
        }
      },
      {
        "who": "me",
        "text": "¡Me encanta la pintura moderna!",
        "gloss": {
          "en": "I love modern painting!",
          "ko": "현대 미술 정말 좋아해요!"
        },
        "frames": [
          "es-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Entonces le va a gustar mucho.",
        "gloss": {
          "en": "Then you'll like it a lot.",
          "ko": "그럼 아주 마음에 드실 거예요."
        }
      },
      {
        "who": "me",
        "text": "Gracias. ¿Puedo dejar la mochila aquí?",
        "gloss": {
          "en": "Thanks. Can I leave my backpack here?",
          "ko": "고마워요. 배낭을 여기 둬도 돼요?"
        },
        "frames": [
          "es-f2-11"
        ]
      }
    ]
  },
  {
    "id": "es-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a new series with a friend",
      "ko": "친구와 새 드라마 이야기"
    },
    "expressions": [
      "creo que",
      "me parece que",
      "estoy de acuerdo",
      "me encantaría"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Has visto la serie nueva de la que habla todo el mundo?",
        "gloss": {
          "en": "Have you seen the new series everyone's talking about?",
          "ko": "다들 얘기하는 새 드라마 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, vi tres capítulos. Creo que es muy buena.",
        "gloss": {
          "en": "Yes, I watched three episodes. I think it's very good.",
          "ko": "네, 세 편 봤어요. 꽤 괜찮은 것 같아요."
        },
        "frames": [
          "es-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "¿Sí? A mí el principio me pareció un poco lento.",
        "gloss": {
          "en": "Really? I found the beginning a bit slow.",
          "ko": "그래요? 저는 초반이 좀 느린 것 같았어요."
        }
      },
      {
        "who": "me",
        "text": "Estoy de acuerdo, pero luego mejora mucho.",
        "gloss": {
          "en": "I agree, but then it gets much better.",
          "ko": "맞아요, 그런데 뒤로 갈수록 훨씬 좋아져요."
        },
        "frames": [
          "es-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "¿Y crees que va a tener final feliz?",
        "gloss": {
          "en": "And do you think it'll have a happy ending?",
          "ko": "해피 엔딩일 것 같아요?"
        }
      },
      {
        "who": "me",
        "text": "No creo que tenga final feliz. Es muy oscura.",
        "gloss": {
          "en": "I don't think it'll have a happy ending. It's very dark.",
          "ko": "해피 엔딩은 아닐 것 같아요. 너무 어두운 이야기라서요."
        },
        "frames": [
          "es-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Bueno, ya veremos. ¿La vemos juntos el viernes?",
        "gloss": {
          "en": "Well, we'll see. Shall we watch it together on Friday?",
          "ko": "글쎄, 두고 봐야죠. 금요일에 같이 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "¡Me encantaría! Me parece que es mejor verla con alguien.",
        "gloss": {
          "en": "I'd love to! It seems to me it's better to watch it with someone.",
          "ko": "좋아요! 누구랑 같이 보는 게 더 좋은 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      }
    ]
  },
  {
    "id": "es-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling hotel reception about a room problem",
      "ko": "방 문제로 호텔 프런트에 전화하기"
    },
    "expressions": [
      "lo que pasa es que",
      "tengo un problema con",
      "no funciona"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas noches, recepción. ¿En qué puedo ayudarle?",
        "gloss": {
          "en": "Good evening, reception. How can I help you?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenas noches. Tengo un problema con mi habitación.",
        "gloss": {
          "en": "Good evening. I have a problem with my room.",
          "ko": "안녕하세요. 제 방에 문제가 있어요."
        },
        "frames": [
          "es-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Vaya, lo siento. ¿Qué ocurre?",
        "gloss": {
          "en": "Oh, I'm sorry. What's happening?",
          "ko": "아, 죄송합니다. 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "El aire acondicionado no funciona y hace mucho calor.",
        "gloss": {
          "en": "The air conditioning doesn't work and it's very hot.",
          "ko": "에어컨이 안 돼서 너무 더워요."
        },
        "frames": [
          "es-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Ahora mismo mandamos a alguien a revisarlo.",
        "gloss": {
          "en": "We'll send someone to check it right away.",
          "ko": "지금 바로 사람을 보내서 확인할게요."
        }
      },
      {
        "who": "me",
        "text": "Gracias. Lo que pasa es que mañana me levanto muy temprano.",
        "gloss": {
          "en": "Thanks. The thing is, tomorrow I get up very early.",
          "ko": "감사해요. 사실 제가 내일 아주 일찍 일어나야 해서요."
        },
        "frames": [
          "es-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Entiendo. Si no se arregla, le cambiamos de habitación.",
        "gloss": {
          "en": "I understand. If it can't be fixed, we'll change your room.",
          "ko": "알겠습니다. 안 고쳐지면 방을 바꿔 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Perfecto. ¿Podría llamarme cuando lo sepan?",
        "gloss": {
          "en": "Perfect. Could you call me when you know?",
          "ko": "좋아요. 알게 되면 전화해 주시겠어요?"
        },
        "frames": [
          "es-f3-12"
        ]
      }
    ]
  },
  {
    "id": "es-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a colleague where you used to live",
      "ko": "동료에게 예전에 살던 곳 이야기"
    },
    "expressions": [
      "creo que",
      "lo que pasa es que"
    ],
    "grammar": [
      0,
      5,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Siempre has vivido en esta ciudad?",
        "gloss": {
          "en": "Have you always lived in this city?",
          "ko": "계속 이 도시에서 살았어요?"
        }
      },
      {
        "who": "me",
        "text": "No, antes vivía en un pueblo cerca de la costa.",
        "gloss": {
          "en": "No, I used to live in a village near the coast.",
          "ko": "아니요, 전에는 바닷가 근처 작은 마을에 살았어요."
        },
        "frames": [
          "es-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bonito! ¿Y por qué te mudaste?",
        "gloss": {
          "en": "How lovely! And why did you move?",
          "ko": "좋았겠네요! 그런데 왜 이사했어요?"
        }
      },
      {
        "who": "me",
        "text": "Lo que pasa es que allí no había mucho trabajo.",
        "gloss": {
          "en": "The thing is, there wasn't much work there.",
          "ko": "사실 거기는 일자리가 별로 없었거든요."
        },
        "frames": [
          "es-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Ya. ¿Y qué te gusta más, el pueblo o la ciudad?",
        "gloss": {
          "en": "I see. And which do you like more, the village or the city?",
          "ko": "그렇군요. 마을이랑 도시 중에 어디가 더 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "Creo que el pueblo es más tranquilo que la ciudad, pero aquí hay más vida.",
        "gloss": {
          "en": "I think the village is quieter than the city, but there's more life here.",
          "ko": "마을이 도시보다 조용한 것 같은데, 여기가 더 활기차요."
        },
        "frames": [
          "es-f3-01",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sí, es verdad. ¿Vuelves a menudo?",
        "gloss": {
          "en": "Yes, that's true. Do you go back often?",
          "ko": "맞아요. 자주 가요?"
        }
      },
      {
        "who": "me",
        "text": "No mucho. Me gustaría ir más, la verdad.",
        "gloss": {
          "en": "Not much. I'd like to go more, honestly.",
          "ko": "별로요. 사실 더 자주 가고 싶어요."
        },
        "frames": [
          "es-f3-13"
        ]
      }
    ]
  },
  {
    "id": "es-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend about a rainy trip to Galicia",
      "ko": "친구에게 비 오던 갈리시아 여행 이야기"
    },
    "expressions": [
      "al final"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Qué tal el viaje a Galicia?",
        "gloss": {
          "en": "How was the trip to Galicia?",
          "ko": "갈리시아 여행 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Bueno… Llovía mucho cuando llegamos a Santiago.",
        "gloss": {
          "en": "Well… It was raining a lot when we arrived in Santiago.",
          "ko": "음… 산티아고에 도착했을 때 비가 많이 왔어요."
        },
        "frames": [
          "es-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "¡Típico de allí! ¿Y qué hicisteis?",
        "gloss": {
          "en": "Typical there! And what did you do?",
          "ko": "거긴 원래 그래요! 그래서 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Entramos en un bar y probamos el pulpo. Antes no me gustaba, pero ahora me encanta.",
        "gloss": {
          "en": "We went into a bar and tried the octopus. I didn't use to like it, but now I love it.",
          "ko": "바에 들어가서 문어를 먹어 봤어요. 전에는 안 좋아했는데 이제는 정말 좋아요."
        },
        "frames": [
          "es-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "¿Y los pimientos de Padrón? ¿Los probaste?",
        "gloss": {
          "en": "And the Padrón peppers? Did you try them?",
          "ko": "파드론 고추는요? 먹어 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "No, nunca he comido pimientos de Padrón. ¿Están buenos?",
        "gloss": {
          "en": "No, I've never eaten Padrón peppers. Are they good?",
          "ko": "아니요, 파드론 고추는 한 번도 안 먹어 봤어요. 맛있어요?"
        },
        "frames": [
          "es-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Están buenísimos. Unos pican y otros no.",
        "gloss": {
          "en": "They're delicious. Some are spicy and some aren't.",
          "ko": "정말 맛있어요. 어떤 건 맵고 어떤 건 안 매워요."
        }
      },
      {
        "who": "me",
        "text": "¡Qué divertido! Al final, fue un viaje genial a pesar de la lluvia.",
        "gloss": {
          "en": "How fun! In the end, it was a great trip despite the rain.",
          "ko": "재미있네요! 결국 비가 왔는데도 정말 좋은 여행이었어요."
        },
        "frames": [
          "es-f3-09"
        ]
      }
    ]
  },
  {
    "id": "es-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A colleague wants to learn scuba diving",
      "ko": "스쿠버 다이빙을 배우고 싶은 동료와"
    },
    "expressions": [
      "me parece que",
      "alguna vez",
      "lo que pasa es que",
      "me encantaría",
      "de hecho"
    ],
    "grammar": [
      1,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "Estoy pensando en aprender a bucear.",
        "gloss": {
          "en": "I'm thinking about learning to dive.",
          "ko": "스쿠버 다이빙을 배워 볼까 생각 중이에요."
        }
      },
      {
        "who": "me",
        "text": "¡Qué bien! ¿Alguna vez has buceado?",
        "gloss": {
          "en": "How nice! Have you ever dived?",
          "ko": "좋네요! 다이빙해 본 적 있어요?"
        },
        "frames": [
          "es-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "No, nunca. Me da un poco de miedo.",
        "gloss": {
          "en": "No, never. It scares me a bit.",
          "ko": "아니요, 한 번도요. 좀 무서워요."
        }
      },
      {
        "who": "me",
        "text": "Yo tampoco. De hecho, nunca he nadado en el mar.",
        "gloss": {
          "en": "Me neither. In fact, I've never swum in the sea.",
          "ko": "저도요. 사실 저는 바다에서 수영해 본 적도 없어요."
        },
        "frames": [
          "es-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "¿En serio? ¿Por qué?",
        "gloss": {
          "en": "Really? Why?",
          "ko": "정말요? 왜요?"
        }
      },
      {
        "who": "me",
        "text": "Lo que pasa es que antes vivía en Madrid y allí no hay mar.",
        "gloss": {
          "en": "The thing is, I used to live in Madrid and there's no sea there.",
          "ko": "사실 전에는 마드리드에 살았는데 거기는 바다가 없거든요."
        },
        "frames": [
          "es-f3-18",
          "es-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Bueno, podemos hacer un curso juntos este verano.",
        "gloss": {
          "en": "Well, we can take a course together this summer.",
          "ko": "그럼 이번 여름에 같이 강습 들어도 되겠네요."
        }
      },
      {
        "who": "me",
        "text": "¡Me encantaría! Me parece que es una buena idea.",
        "gloss": {
          "en": "I'd love to! I think it's a good idea.",
          "ko": "좋아요! 좋은 생각인 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      }
    ]
  },
  {
    "id": "es-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Comparing daily routines with a roommate",
      "ko": "룸메이트와 하루 일과 비교하기"
    },
    "expressions": [
      "creo que",
      "lo que pasa es que"
    ],
    "grammar": [
      2,
      5,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿A qué hora te levantas normalmente?",
        "gloss": {
          "en": "What time do you usually get up?",
          "ko": "보통 몇 시에 일어나요?"
        }
      },
      {
        "who": "me",
        "text": "Por la mañana me levanto a las seis y media.",
        "gloss": {
          "en": "In the morning I get up at six thirty.",
          "ko": "아침에 여섯 시 반에 일어나요."
        },
        "frames": [
          "es-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué pronto! ¿Por qué?",
        "gloss": {
          "en": "So early! Why?",
          "ko": "엄청 일찍이네요! 왜요?"
        }
      },
      {
        "who": "me",
        "text": "Lo que pasa es que el trabajo empieza a las ocho y tardo mucho en llegar.",
        "gloss": {
          "en": "The thing is, work starts at eight and it takes me a long time to get there.",
          "ko": "사실 일이 여덟 시에 시작하는데 가는 데 오래 걸려서요."
        },
        "frames": [
          "es-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "¿Y te duchas por la mañana o por la noche?",
        "gloss": {
          "en": "And do you shower in the morning or at night?",
          "ko": "샤워는 아침에 해요, 밤에 해요?"
        }
      },
      {
        "who": "me",
        "text": "Prefiero ducharme por la noche. Por la mañana me visto rápido y salgo.",
        "gloss": {
          "en": "I prefer to shower at night. In the morning I get dressed quickly and leave.",
          "ko": "밤에 하는 게 좋아요. 아침에는 빨리 옷 입고 나가요."
        },
        "frames": [
          "es-f2-09",
          "es-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Yo me levanto tarde. Soy más de noche.",
        "gloss": {
          "en": "I get up late. I'm more of a night person.",
          "ko": "저는 늦게 일어나요. 밤형 인간이라서요."
        }
      },
      {
        "who": "me",
        "text": "Creo que la mañana es más productiva que la noche, pero cada uno es diferente.",
        "gloss": {
          "en": "I think the morning is more productive than the night, but everyone is different.",
          "ko": "아침이 밤보다 더 생산적인 것 같지만, 사람마다 다르죠."
        },
        "frames": [
          "es-f3-01",
          "es-f3-14"
        ]
      }
    ]
  },
  {
    "id": "es-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The wrong dish arrives at a restaurant",
      "ko": "식당에서 주문과 다른 요리가 나왔을 때"
    },
    "expressions": [
      "tengo un problema con",
      "menos mal"
    ],
    "grammar": [
      6,
      4,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Qué tal todo?",
        "gloss": {
          "en": "How is everything?",
          "ko": "식사는 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Perdone, tengo un problema con el plato. Lo pedí sin carne.",
        "gloss": {
          "en": "Excuse me, I have a problem with the dish. I ordered it without meat.",
          "ko": "죄송한데요, 요리에 문제가 있어요. 고기 빼고 주문했거든요."
        },
        "frames": [
          "es-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "¡Uy, lo siento mucho! Ahora mismo lo arreglamos.",
        "gloss": {
          "en": "Oh, I'm so sorry! We'll fix it right away.",
          "ko": "아이고, 정말 죄송합니다! 바로 처리해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Gracias. ¿Me lo puede cambiar por el de verduras?",
        "gloss": {
          "en": "Thanks. Could you change it for the vegetable one?",
          "ko": "고마워요. 채소 요리로 바꿔 주실 수 있어요?"
        },
        "frames": [
          "es-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro, enseguida. ¿Quiere algo más mientras espera?",
        "gloss": {
          "en": "Of course, right away. Would you like anything else while you wait?",
          "ko": "네, 바로요. 기다리시는 동안 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Podría traerme un poco más de pan?",
        "gloss": {
          "en": "Yes. Could you bring me a bit more bread?",
          "ko": "네. 빵 좀 더 갖다주시겠어요?"
        },
        "frames": [
          "es-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Por supuesto. Y el postre es invitación de la casa.",
        "gloss": {
          "en": "Of course. And dessert is on the house.",
          "ko": "물론이죠. 그리고 디저트는 서비스예요."
        }
      },
      {
        "who": "me",
        "text": "¡Qué amable! Menos mal, tenía mucha hambre.",
        "gloss": {
          "en": "How kind! Thank goodness, I was very hungry.",
          "ko": "친절하시네요! 다행이에요, 배가 많이 고팠거든요."
        }
      }
    ]
  },
  {
    "id": "es-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Running into an old school friend",
      "ko": "오랜만에 학교 친구를 만났을 때"
    },
    "expressions": [
      "me parece que",
      "te acuerdas de"
    ],
    "grammar": [
      5,
      4,
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Cuánto tiempo! ¿Qué tal todo?",
        "gloss": {
          "en": "Long time no see! How's everything?",
          "ko": "오랜만이에요! 잘 지냈어요?"
        }
      },
      {
        "who": "me",
        "text": "¡Muy bien! Oye, ¿te acuerdas de nuestro profesor de matemáticas?",
        "gloss": {
          "en": "Very well! Hey, do you remember our math teacher?",
          "ko": "잘 지냈어요! 저기, 우리 수학 선생님 기억나요?"
        },
        "frames": [
          "es-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "¡Claro! Era muy serio.",
        "gloss": {
          "en": "Of course! He was very serious.",
          "ko": "그럼요! 엄청 엄하셨잖아요."
        }
      },
      {
        "who": "me",
        "text": "Pues lo vi el mes pasado. Ahora está jubilado y es más simpático que antes.",
        "gloss": {
          "en": "Well, I saw him last month. Now he's retired and he's nicer than before.",
          "ko": "지난달에 뵀어요. 지금은 은퇴하셨는데 예전보다 훨씬 다정하세요."
        },
        "frames": [
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "¿En serio? ¿Y de qué hablasteis?",
        "gloss": {
          "en": "Really? And what did you talk about?",
          "ko": "정말요? 무슨 얘기 했어요?"
        }
      },
      {
        "who": "me",
        "text": "De la clase. Me parece que se acuerda de todos nosotros.",
        "gloss": {
          "en": "About the class. It seems to me he remembers all of us.",
          "ko": "우리 반 얘기요. 우리를 다 기억하시는 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bonito! Tenemos que quedar todos un día.",
        "gloss": {
          "en": "How lovely! We should all meet up one day.",
          "ko": "좋네요! 언제 다 같이 한번 만나야겠어요."
        }
      },
      {
        "who": "me",
        "text": "Sí, me gustaría organizar una cena con todos.",
        "gloss": {
          "en": "Yes, I'd like to organize a dinner with everyone.",
          "ko": "네, 다 같이 저녁 모임을 하나 만들고 싶어요."
        },
        "frames": [
          "es-f3-13"
        ]
      }
    ]
  },
  {
    "id": "es-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Giving your opinion in a work meeting",
      "ko": "회의에서 의견 말하기"
    },
    "expressions": [
      "creo que",
      "en mi opinión",
      "me parece que",
      "no estoy seguro"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Qué te parece la nueva idea para la campaña?",
        "gloss": {
          "en": "What do you think of the new idea for the campaign?",
          "ko": "캠페인 새 아이디어 어떻게 생각해요?"
        }
      },
      {
        "who": "me",
        "text": "En mi opinión, es interesante, pero un poco cara.",
        "gloss": {
          "en": "In my opinion, it's interesting, but a bit expensive.",
          "ko": "제 생각에는 흥미롭지만 좀 비싸요."
        },
        "frames": [
          "es-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Ya. ¿Crees que vamos a vender más?",
        "gloss": {
          "en": "I see. Do you think we'll sell more?",
          "ko": "그렇군요. 판매가 늘 것 같아요?"
        }
      },
      {
        "who": "me",
        "text": "No creo que vendamos mucho más este año.",
        "gloss": {
          "en": "I don't think we'll sell much more this year.",
          "ko": "올해는 많이 더 팔 것 같지 않아요."
        },
        "frames": [
          "es-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Entonces, ¿qué propones?",
        "gloss": {
          "en": "So, what do you suggest?",
          "ko": "그럼 뭘 제안해요?"
        }
      },
      {
        "who": "me",
        "text": "Me parece que internet es más barato que la televisión.",
        "gloss": {
          "en": "It seems to me that the internet is cheaper than TV.",
          "ko": "인터넷이 텔레비전보다 싼 것 같아요."
        },
        "frames": [
          "es-f3-04",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Tienes razón. ¿Lo presentas tú el lunes?",
        "gloss": {
          "en": "You're right. Will you present it on Monday?",
          "ko": "맞아요. 월요일에 당신이 발표할래요?"
        }
      },
      {
        "who": "me",
        "text": "Vale, pero no estoy seguro de los números todavía.",
        "gloss": {
          "en": "OK, but I'm not sure about the numbers yet.",
          "ko": "좋아요, 그런데 아직 숫자는 확실하지 않아요."
        },
        "frames": [
          "es-f3-20"
        ]
      }
    ]
  },
  {
    "id": "es-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling customer service about the internet",
      "ko": "인터넷 문제로 고객센터에 전화하기"
    },
    "expressions": [
      "lo que pasa es que",
      "tengo un problema con",
      "no funciona"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Atención al cliente, buenos días. ¿En qué le puedo ayudar?",
        "gloss": {
          "en": "Customer service, good morning. How can I help you?",
          "ko": "고객센터입니다, 안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenos días. Tengo un problema con el internet de casa.",
        "gloss": {
          "en": "Good morning. I have a problem with my home internet.",
          "ko": "안녕하세요. 집 인터넷에 문제가 있어요."
        },
        "frames": [
          "es-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "¿Qué le pasa exactamente?",
        "gloss": {
          "en": "What exactly is wrong?",
          "ko": "정확히 어떤 문제인가요?"
        }
      },
      {
        "who": "me",
        "text": "El router no funciona desde ayer por la noche.",
        "gloss": {
          "en": "The router hasn't worked since last night.",
          "ko": "어젯밤부터 공유기가 안 돼요."
        },
        "frames": [
          "es-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "¿Ha probado a apagarlo y encenderlo?",
        "gloss": {
          "en": "Have you tried turning it off and on?",
          "ko": "껐다가 다시 켜 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tres veces. Lo que pasa es que trabajo desde casa y lo necesito hoy.",
        "gloss": {
          "en": "Yes, three times. The thing is, I work from home and I need it today.",
          "ko": "네, 세 번이요. 사실 재택근무라 오늘 꼭 필요해요."
        },
        "frames": [
          "es-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Entiendo. Le mandamos un técnico esta tarde.",
        "gloss": {
          "en": "I understand. We'll send a technician this afternoon.",
          "ko": "알겠습니다. 오늘 오후에 기사님을 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Perfecto. ¿Podría decirme a qué hora, más o menos?",
        "gloss": {
          "en": "Perfect. Could you tell me roughly what time?",
          "ko": "좋아요. 대략 몇 시쯤인지 알려 주시겠어요?"
        },
        "frames": [
          "es-f3-12"
        ]
      }
    ]
  },
  {
    "id": "es-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Getting trousers shortened at a tailor's",
      "ko": "수선집에서 바지 길이 줄이기"
    },
    "expressions": [
      "me parece que",
      "no estoy seguro",
      "al final"
    ],
    "grammar": [
      6,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas tardes. ¿Qué necesita?",
        "gloss": {
          "en": "Good afternoon. What do you need?",
          "ko": "안녕하세요. 뭐가 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Hola. Este pantalón es un poco largo. ¿Me lo puede cortar?",
        "gloss": {
          "en": "Hi. These trousers are a bit long. Could you shorten them for me?",
          "ko": "안녕하세요. 이 바지가 좀 길어요. 줄여 주실 수 있어요?"
        },
        "frames": [
          "es-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro. ¿Cuánto más corto lo quiere?",
        "gloss": {
          "en": "Sure. How much shorter do you want them?",
          "ko": "그럼요. 얼마나 줄여 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "No estoy seguro de la medida. ¿Podría ayudarme?",
        "gloss": {
          "en": "I'm not sure about the length. Could you help me?",
          "ko": "길이를 잘 모르겠어요. 좀 도와주시겠어요?"
        },
        "frames": [
          "es-f3-20",
          "es-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Póngaselo un momento. A ver… ¿así?",
        "gloss": {
          "en": "Put them on for a moment. Let's see… like this?",
          "ko": "잠깐 입어 보세요. 어디 보자… 이 정도요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, perfecto. Me parece que así queda mucho mejor.",
        "gloss": {
          "en": "Yes, perfect. I think they look much better like that.",
          "ko": "네, 딱 좋아요. 이렇게 하니까 훨씬 나은 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Estará listo el jueves.",
        "gloss": {
          "en": "It'll be ready on Thursday.",
          "ko": "목요일에 찾아가시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Muy bien. Al final, me sale más barato que comprar otro.",
        "gloss": {
          "en": "Great. In the end, it's cheaper than buying another pair.",
          "ko": "좋아요. 결국 새로 사는 것보다 싸게 먹히네요."
        },
        "frames": [
          "es-f3-09"
        ]
      }
    ]
  },
  {
    "id": "es-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Chatting with a neighbor about the new neighborhood",
      "ko": "새 동네에 대해 이웃과 이야기"
    },
    "expressions": [
      "creo que",
      "estoy de acuerdo"
    ],
    "grammar": [
      5,
      2,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Qué tal en el barrio nuevo?",
        "gloss": {
          "en": "How's the new neighborhood?",
          "ko": "새 동네는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Creo que este barrio es más bonito que el anterior.",
        "gloss": {
          "en": "I think this neighborhood is nicer than the previous one.",
          "ko": "전에 살던 동네보다 여기가 더 예쁜 것 같아요."
        },
        "frames": [
          "es-f3-01",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sí, y hay muchos parques.",
        "gloss": {
          "en": "Yes, and there are lots of parks.",
          "ko": "맞아요, 공원도 많고요."
        }
      },
      {
        "who": "me",
        "text": "Estoy de acuerdo. Por la mañana me encanta correr por el parque.",
        "gloss": {
          "en": "I agree. In the morning I love running in the park.",
          "ko": "맞아요. 아침에 공원에서 뛰는 게 정말 좋아요."
        },
        "frames": [
          "es-f3-19",
          "es-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "¿Has probado la panadería de la esquina?",
        "gloss": {
          "en": "Have you tried the bakery on the corner?",
          "ko": "모퉁이 빵집 가 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "Nunca he entrado, pero huele muy bien.",
        "gloss": {
          "en": "I've never gone in, but it smells really good.",
          "ko": "한 번도 안 들어가 봤는데, 냄새가 정말 좋더라고요."
        },
        "frames": [
          "es-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Tienes que probar las napolitanas de chocolate.",
        "gloss": {
          "en": "You have to try the chocolate pastries.",
          "ko": "초콜릿 페이스트리 꼭 먹어 봐요."
        }
      },
      {
        "who": "me",
        "text": "¡Vale! Me gustaría ir mañana.",
        "gloss": {
          "en": "OK! I'd like to go tomorrow.",
          "ko": "좋아요! 내일 가 보고 싶어요."
        },
        "frames": [
          "es-f3-13"
        ]
      }
    ]
  },
  {
    "id": "es-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A job interview",
      "ko": "면접 보기"
    },
    "expressions": [
      "en mi opinión",
      "de hecho"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Háblenos un poco de su experiencia.",
        "gloss": {
          "en": "Tell us a little about your experience.",
          "ko": "경력에 대해 조금 말씀해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Antes trabajaba en un hotel en Seúl, en recepción.",
        "gloss": {
          "en": "I used to work at a hotel in Seoul, at reception.",
          "ko": "전에는 서울에 있는 호텔 프런트에서 일했어요."
        },
        "frames": [
          "es-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "¿Y por qué quiere cambiar de trabajo?",
        "gloss": {
          "en": "And why do you want to change jobs?",
          "ko": "왜 이직하려고 하세요?"
        }
      },
      {
        "who": "me",
        "text": "Me gustaría tener más responsabilidad y aprender cosas nuevas.",
        "gloss": {
          "en": "I'd like to have more responsibility and learn new things.",
          "ko": "책임을 더 맡고 새로운 걸 배우고 싶어요."
        },
        "frames": [
          "es-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "¿Ha trabajado en equipo con gente de otros países?",
        "gloss": {
          "en": "Have you worked in a team with people from other countries?",
          "ko": "다른 나라 사람들과 팀으로 일해 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, muchas veces. De hecho, en mi opinión, es lo más interesante del trabajo.",
        "gloss": {
          "en": "Yes, many times. In fact, in my opinion, it's the most interesting part of the job.",
          "ko": "네, 여러 번이요. 사실 제 생각에는 그게 일에서 가장 재미있는 부분이에요."
        },
        "frames": [
          "es-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Muy bien. ¿Tiene alguna pregunta?",
        "gloss": {
          "en": "Very good. Do you have any questions?",
          "ko": "좋습니다. 질문 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí. ¿Podría explicarme un poco el horario?",
        "gloss": {
          "en": "Yes. Could you explain the schedule to me a little?",
          "ko": "네. 근무 시간을 조금 설명해 주시겠어요?"
        },
        "frames": [
          "es-f3-12"
        ]
      }
    ]
  },
  {
    "id": "es-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Lost luggage at the airport",
      "ko": "공항에서 짐이 안 나왔을 때"
    },
    "expressions": [
      "no estoy seguro",
      "lo que pasa es que",
      "tengo un problema con",
      "menos mal"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenas tardes. ¿Le puedo ayudar en algo?",
        "gloss": {
          "en": "Good afternoon. Can I help you with something?",
          "ko": "안녕하세요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, tengo un problema con mi maleta. No ha llegado.",
        "gloss": {
          "en": "Yes, I have a problem with my suitcase. It hasn't arrived.",
          "ko": "네, 제 가방에 문제가 있어요. 안 나왔어요."
        },
        "frames": [
          "es-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Vaya. ¿Me enseña su tarjeta de embarque?",
        "gloss": {
          "en": "Oh dear. Can you show me your boarding pass?",
          "ko": "저런. 탑승권 보여 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Aquí la tiene. Lo que pasa es que toda mi ropa está en la maleta.",
        "gloss": {
          "en": "Here it is. The thing is, all my clothes are in the suitcase.",
          "ko": "여기 있어요. 사실 옷이 전부 가방에 있어요."
        },
        "frames": [
          "es-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Normalmente llega en el siguiente vuelo. ¿Dónde se aloja?",
        "gloss": {
          "en": "It usually arrives on the next flight. Where are you staying?",
          "ko": "보통 다음 비행기로 와요. 어디서 묵으세요?"
        }
      },
      {
        "who": "me",
        "text": "En un hotel del centro. No estoy seguro de la dirección exacta, pero tengo el nombre.",
        "gloss": {
          "en": "At a hotel in the center. I'm not sure about the exact address, but I have the name.",
          "ko": "시내 호텔이요. 정확한 주소는 잘 모르는데 이름은 알아요."
        },
        "frames": [
          "es-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Con eso es suficiente. Se la llevamos mañana.",
        "gloss": {
          "en": "That's enough. We'll bring it to you tomorrow.",
          "ko": "그거면 충분해요. 내일 가져다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Menos mal. Muchas gracias por la ayuda.",
        "gloss": {
          "en": "Thank goodness. Thank you very much for the help.",
          "ko": "다행이에요. 도와주셔서 정말 감사해요."
        },
        "frames": [
          "es-f1-07"
        ]
      }
    ]
  },
  {
    "id": "es-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend wants to lend you a novel",
      "ko": "친구가 소설을 빌려주려고 할 때"
    },
    "expressions": [
      "creo que",
      "me parece que",
      "por cierto",
      "te acuerdas de"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Estoy leyendo una novela de ciencia ficción muy buena.",
        "gloss": {
          "en": "I'm reading a very good science fiction novel.",
          "ko": "아주 재미있는 공상 과학 소설을 읽고 있어요."
        }
      },
      {
        "who": "me",
        "text": "Nunca he leído ciencia ficción, la verdad.",
        "gloss": {
          "en": "I've never read science fiction, honestly.",
          "ko": "사실 저는 공상 과학 소설을 읽어 본 적이 없어요."
        },
        "frames": [
          "es-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "¡Tienes que probar! Te presto esta.",
        "gloss": {
          "en": "You have to try it! I'll lend you this one.",
          "ko": "꼭 읽어 봐요! 이거 빌려줄게요."
        }
      },
      {
        "who": "me",
        "text": "Gracias, pero no creo que tenga tiempo este mes.",
        "gloss": {
          "en": "Thanks, but I don't think I'll have time this month.",
          "ko": "고마워요, 그런데 이번 달엔 시간이 없을 것 같아요."
        },
        "frames": [
          "es-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Es corta, de verdad. Se lee en una semana.",
        "gloss": {
          "en": "It's short, really. You can read it in a week.",
          "ko": "정말 짧아요. 일주일이면 읽어요."
        }
      },
      {
        "who": "me",
        "text": "Vale. Me parece que voy a leerla en el tren.",
        "gloss": {
          "en": "OK. I think I'll read it on the train.",
          "ko": "알겠어요. 기차에서 읽으면 될 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Ya me dirás qué te parece.",
        "gloss": {
          "en": "Let me know what you think.",
          "ko": "읽고 어땠는지 말해 줘요."
        }
      },
      {
        "who": "me",
        "text": "Por cierto, ¿te acuerdas de la novela que me prestaste el año pasado? Todavía la tengo.",
        "gloss": {
          "en": "By the way, do you remember the novel you lent me last year? I still have it.",
          "ko": "그런데 작년에 빌려준 소설 기억나요? 아직 제가 갖고 있어요."
        },
        "frames": [
          "es-f3-11"
        ]
      }
    ]
  },
  {
    "id": "es-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Weather small talk at a bus stop",
      "ko": "버스 정류장에서 날씨 이야기"
    },
    "expressions": [
      "creo que",
      "me parece que",
      "no estoy seguro",
      "al final"
    ],
    "grammar": [
      5,
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¡Qué frío hace hoy!",
        "gloss": {
          "en": "It's so cold today!",
          "ko": "오늘 정말 춥네요!"
        }
      },
      {
        "who": "me",
        "text": "Sí, me parece que este invierno es más frío que el año pasado.",
        "gloss": {
          "en": "Yes, it seems to me this winter is colder than last year.",
          "ko": "네, 올겨울이 작년보다 더 추운 것 같아요."
        },
        "frames": [
          "es-f3-04",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Y ayer llovió muchísimo.",
        "gloss": {
          "en": "And yesterday it rained a lot.",
          "ko": "어제는 비도 엄청 왔잖아요."
        }
      },
      {
        "who": "me",
        "text": "¡Sí! Llovía mucho cuando salí del trabajo y no tenía paraguas.",
        "gloss": {
          "en": "Yes! It was raining a lot when I left work and I didn't have an umbrella.",
          "ko": "맞아요! 퇴근할 때 비가 많이 왔는데 우산이 없었어요."
        },
        "frames": [
          "es-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué pena! ¿Te mojaste?",
        "gloss": {
          "en": "What a shame! Did you get wet?",
          "ko": "저런! 젖었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, completamente. Al final, tomé un taxi.",
        "gloss": {
          "en": "Yes, completely. In the end, I took a taxi.",
          "ko": "네, 홀딱요. 결국 택시를 탔어요."
        },
        "frames": [
          "es-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Dicen que mañana va a hacer sol.",
        "gloss": {
          "en": "They say it's going to be sunny tomorrow.",
          "ko": "내일은 맑을 거래요."
        }
      },
      {
        "who": "me",
        "text": "No estoy seguro de eso. No creo que cambie tan rápido.",
        "gloss": {
          "en": "I'm not sure about that. I don't think it'll change so fast.",
          "ko": "글쎄요. 그렇게 빨리 바뀔 것 같지 않아요."
        },
        "frames": [
          "es-f3-20",
          "es-f3-02"
        ]
      }
    ]
  },
  {
    "id": "es-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Returning a faulty speaker to an electronics shop",
      "ko": "전자제품 매장에 고장 난 스피커 교환하기"
    },
    "expressions": [
      "creo que",
      "me parece que",
      "no funciona"
    ],
    "grammar": [
      6,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buenos días. ¿Qué tal?",
        "gloss": {
          "en": "Good morning. How are you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buenos días. Compré este altavoz la semana pasada, pero no funciona bien.",
        "gloss": {
          "en": "Good morning. I bought this speaker last week, but it doesn't work well.",
          "ko": "안녕하세요. 지난주에 이 스피커를 샀는데 잘 안 돼요."
        },
        "frames": [
          "es-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Vaya. ¿Tiene el tique?",
        "gloss": {
          "en": "Oh. Do you have the receipt?",
          "ko": "그렇군요. 영수증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, aquí está. ¿Me lo puede cambiar por otro?",
        "gloss": {
          "en": "Yes, here it is. Could you exchange it for another one?",
          "ko": "네, 여기 있어요. 다른 걸로 바꿔 주실 수 있어요?"
        },
        "frames": [
          "es-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro. ¿Quiere el mismo modelo o uno diferente?",
        "gloss": {
          "en": "Of course. Do you want the same model or a different one?",
          "ko": "그럼요. 같은 모델로 드릴까요, 다른 걸로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Creo que prefiero otro. ¿Este es más caro que el mío?",
        "gloss": {
          "en": "I think I prefer a different one. Is this one more expensive than mine?",
          "ko": "다른 게 좋을 것 같아요. 이건 제 것보다 비싸요?"
        },
        "frames": [
          "es-f3-01",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sí, cuesta veinte euros más, pero suena mejor.",
        "gloss": {
          "en": "Yes, it costs twenty euros more, but it sounds better.",
          "ko": "네, 이십 유로 더 비싼데 소리가 더 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Vale, me lo llevo. Me parece que vale la pena.",
        "gloss": {
          "en": "OK, I'll take it. I think it's worth it.",
          "ko": "좋아요, 이걸로 할게요. 그만한 가치가 있는 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      }
    ]
  },
  {
    "id": "es-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend about a cousin's beach wedding",
      "ko": "친구에게 사촌의 바닷가 결혼식 이야기"
    },
    "expressions": [
      "en mi opinión",
      "te acuerdas de",
      "al final"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Qué tal la boda de tu prima?",
        "gloss": {
          "en": "How was your cousin's wedding?",
          "ko": "사촌 결혼식 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Muy bonita. ¿Te acuerdas de mi prima, la que vive en Valencia?",
        "gloss": {
          "en": "Very beautiful. Do you remember my cousin, the one who lives in Valencia?",
          "ko": "정말 예뻤어요. 발렌시아에 사는 제 사촌 기억나요?"
        },
        "frames": [
          "es-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Sí, claro. ¿Fue en la playa?",
        "gloss": {
          "en": "Yes, of course. Was it on the beach?",
          "ko": "네, 그럼요. 바닷가에서 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Sí, y llovía mucho cuando empezó la ceremonia.",
        "gloss": {
          "en": "Yes, and it was raining a lot when the ceremony started.",
          "ko": "네, 그런데 식이 시작할 때 비가 많이 왔어요."
        },
        "frames": [
          "es-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué pena!",
        "gloss": {
          "en": "What a shame!",
          "ko": "아이고, 저런!"
        }
      },
      {
        "who": "me",
        "text": "Al final, salió el sol y todos bailamos en la arena.",
        "gloss": {
          "en": "In the end, the sun came out and we all danced on the sand.",
          "ko": "결국 해가 나서 다 같이 모래 위에서 춤췄어요."
        },
        "frames": [
          "es-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "¡Qué bonito! ¿Y la comida?",
        "gloss": {
          "en": "How lovely! And the food?",
          "ko": "멋지네요! 음식은요?"
        }
      },
      {
        "who": "me",
        "text": "En mi opinión, fue la mejor parte de la boda.",
        "gloss": {
          "en": "In my opinion, it was the best part of the wedding.",
          "ko": "제 생각엔 그게 결혼식에서 제일 좋았어요."
        },
        "frames": [
          "es-f3-03"
        ]
      }
    ]
  },
  {
    "id": "es-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a summer trip with a friend",
      "ko": "친구와 여름 여행 계획 세우기"
    },
    "expressions": [
      "creo que",
      "me parece que",
      "estoy de acuerdo"
    ],
    "grammar": [
      5,
      4,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Vamos a la montaña o a la playa en agosto?",
        "gloss": {
          "en": "Shall we go to the mountains or the beach in August?",
          "ko": "팔월에 산에 갈까요, 바다에 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "Me parece que la montaña es más fresca que la playa en agosto.",
        "gloss": {
          "en": "It seems to me the mountains are cooler than the beach in August.",
          "ko": "팔월에는 바다보다 산이 더 시원한 것 같아요."
        },
        "frames": [
          "es-f3-04",
          "es-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sí, pero yo nunca he hecho senderismo.",
        "gloss": {
          "en": "Yes, but I've never been hiking.",
          "ko": "맞아요, 그런데 저는 등산을 해 본 적이 없어요."
        }
      },
      {
        "who": "me",
        "text": "Yo tampoco, pero me gustaría probar.",
        "gloss": {
          "en": "Me neither, but I'd like to try.",
          "ko": "저도요, 그래도 해 보고 싶어요."
        },
        "frames": [
          "es-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "¿Alguna vez has dormido en un refugio de montaña?",
        "gloss": {
          "en": "Have you ever slept in a mountain hut?",
          "ko": "산장에서 자 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "No, nunca he dormido en un refugio. Pero no creo que sea muy difícil.",
        "gloss": {
          "en": "No, I've never slept in a hut. But I don't think it's very hard.",
          "ko": "아니요, 산장에서 자 본 적은 없어요. 그래도 그렇게 어렵진 않을 것 같아요."
        },
        "frames": [
          "es-f3-06",
          "es-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Bueno, pues vamos a la montaña.",
        "gloss": {
          "en": "Well, let's go to the mountains then.",
          "ko": "좋아요, 그럼 산으로 가요."
        }
      },
      {
        "who": "me",
        "text": "¡Estoy de acuerdo! Voy a buscar alojamiento esta noche.",
        "gloss": {
          "en": "Agreed! I'll look for accommodation tonight.",
          "ko": "좋아요! 오늘 밤에 숙소를 찾아볼게요."
        },
        "frames": [
          "es-f3-19"
        ]
      }
    ]
  },
  {
    "id": "es-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling your landlord about the hot water",
      "ko": "집주인에게 온수 문제로 전화하기"
    },
    "expressions": [
      "me parece que",
      "lo que pasa es que",
      "tengo un problema con",
      "no funciona"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "¿Diga?",
        "gloss": {
          "en": "Hello?",
          "ko": "여보세요?"
        }
      },
      {
        "who": "me",
        "text": "Hola, le llamo del piso tercero B. Tengo un problema con la ducha.",
        "gloss": {
          "en": "Hi, I'm calling from flat three B. I have a problem with the shower.",
          "ko": "안녕하세요, 삼 층 B호인데요. 샤워기에 문제가 있어요."
        },
        "frames": [
          "es-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "¿Qué le pasa?",
        "gloss": {
          "en": "What's wrong with it?",
          "ko": "어떤 문제예요?"
        }
      },
      {
        "who": "me",
        "text": "El agua caliente no funciona desde el domingo.",
        "gloss": {
          "en": "The hot water hasn't worked since Sunday.",
          "ko": "일요일부터 온수가 안 나와요."
        },
        "frames": [
          "es-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Vaya. El fontanero puede ir el jueves.",
        "gloss": {
          "en": "Oh dear. The plumber can come on Thursday.",
          "ko": "저런. 배관공이 목요일에 갈 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Lo que pasa es que el jueves no estoy en casa. ¿Podría venir el miércoles?",
        "gloss": {
          "en": "The thing is, I'm not home on Thursday. Could he come on Wednesday?",
          "ko": "사실 목요일엔 제가 집에 없어요. 수요일에 와 주실 수 있을까요?"
        },
        "frames": [
          "es-f3-18",
          "es-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Voy a preguntarle. Le llamo esta tarde.",
        "gloss": {
          "en": "I'll ask him. I'll call you this afternoon.",
          "ko": "물어볼게요. 오늘 오후에 전화 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Muy bien, gracias. Me parece que el miércoles por la tarde es perfecto.",
        "gloss": {
          "en": "Great, thanks. I think Wednesday afternoon is perfect.",
          "ko": "좋아요, 감사합니다. 수요일 오후면 딱 좋을 것 같아요."
        },
        "frames": [
          "es-f3-04"
        ]
      }
    ]
  }
];
