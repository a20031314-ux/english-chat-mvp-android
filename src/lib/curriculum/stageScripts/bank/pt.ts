import type { StageScript } from "../../stageScripts.ts";

/**
 * pt 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const PT_BANK: StageScript[] = [
  {
    "id": "pt-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bakery counter",
      "ko": "빵집 계산대에서"
    },
    "expressions": [
      "bom dia",
      "obrigado",
      "quanto custa",
      "por favor",
      "me vê um",
      "tchau"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia! O que vai ser?",
        "gloss": {
          "en": "Good morning! What will it be?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia! Me vê um pão de queijo, por favor.",
        "gloss": {
          "en": "Good morning! Can I get a cheese bread, please?",
          "ko": "안녕하세요! 빵 지 케이주 하나 주세요."
        },
        "frames": [
          "pt-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Só um? Mais alguma coisa?",
        "gloss": {
          "en": "Just one? Anything else?",
          "ko": "하나만요? 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Só um. Quanto custa o café?",
        "gloss": {
          "en": "Just one. How much is the coffee?",
          "ko": "하나만요. 커피는 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "O café custa cinco reais.",
        "gloss": {
          "en": "The coffee is five reais.",
          "ko": "커피는 오 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Então eu quero um café, por favor.",
        "gloss": {
          "en": "Then I want a coffee, please.",
          "ko": "그럼 커피 하나 주세요."
        },
        "frames": [
          "pt-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Aqui está. Obrigado!",
        "gloss": {
          "en": "Here you go. Thank you!",
          "ko": "여기 있어요. 감사합니다!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Tchau, até amanhã!",
        "gloss": {
          "en": "Thank you. Bye, see you tomorrow!",
          "ko": "감사합니다. 안녕히 계세요, 내일 봬요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "tudo bem",
      "boa noite",
      "obrigado",
      "desculpa",
      "por favor",
      "onde fica",
      "não entendi",
      "pode repetir"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite! Bem-vindo ao hotel.",
        "gloss": {
          "en": "Good evening! Welcome to the hotel.",
          "ko": "안녕하세요! 호텔에 오신 걸 환영해요."
        }
      },
      {
        "who": "me",
        "text": "Boa noite, tudo bem?",
        "gloss": {
          "en": "Good evening, how are you?",
          "ko": "안녕하세요, 잘 지내세요?"
        },
        "frames": [
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem! Você tem reserva?",
        "gloss": {
          "en": "Fine! Do you have a reservation?",
          "ko": "잘 지내요! 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Tenho, sim. Eu tenho uma reserva para duas noites.",
        "gloss": {
          "en": "Yes, I do. I have a reservation for two nights.",
          "ko": "네, 했어요. 이틀 밤 예약이 있어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Perfeito. Aqui está a chave do quarto.",
        "gloss": {
          "en": "Perfect. Here is the room key.",
          "ko": "좋아요. 여기 방 열쇠예요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Onde fica o elevador?",
        "gloss": {
          "en": "Thank you. Where is the elevator?",
          "ko": "감사합니다. 엘리베이터는 어디 있어요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "O elevador fica ali, à direita, perto da escada.",
        "gloss": {
          "en": "The elevator is over there, on the right, near the stairs.",
          "ko": "엘리베이터는 저기 오른쪽, 계단 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Desculpa, não entendi. Pode repetir, por favor?",
        "gloss": {
          "en": "Sorry, I didn't understand. Can you repeat that, please?",
          "ko": "죄송해요, 못 알아들었어요. 다시 말해 주시겠어요?"
        },
        "frames": [
          "pt-f1-15"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b03",
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
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서 처음 만남"
    },
    "expressions": [
      "prazer",
      "obrigado"
    ],
    "grammar": [
      0,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Eu sou a Camila. E você?",
        "gloss": {
          "en": "Hi! I'm Camila. And you?",
          "ko": "안녕하세요! 저는 카밀라예요. 그쪽은요?"
        }
      },
      {
        "who": "me",
        "text": "Oi, Camila! Meu nome é Ji-woo. Prazer!",
        "gloss": {
          "en": "Hi, Camila! My name is Ji-woo. Nice to meet you!",
          "ko": "안녕하세요, 카밀라! 제 이름은 지우예요. 반가워요!"
        },
        "frames": [
          "pt-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Prazer! Você é de onde?",
        "gloss": {
          "en": "Nice to meet you! Where are you from?",
          "ko": "반가워요! 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sou de Busan, na Coreia.",
        "gloss": {
          "en": "I'm from Busan, in Korea.",
          "ko": "한국 부산에서 왔어요."
        },
        "frames": [
          "pt-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! E você mora aqui?",
        "gloss": {
          "en": "Cool! And do you live here?",
          "ko": "멋지네요! 여기 사세요?"
        }
      },
      {
        "who": "me",
        "text": "Moro. Eu moro em Belo Horizonte.",
        "gloss": {
          "en": "I do. I live in Belo Horizonte.",
          "ko": "네. 벨루오리존치에 살아요."
        },
        "frames": [
          "pt-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Você fala português muito bem!",
        "gloss": {
          "en": "You speak Portuguese very well!",
          "ko": "포르투갈어 정말 잘하시네요!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado, mas eu não falo português muito bem.",
        "gloss": {
          "en": "Thanks, but I don't speak Portuguese very well.",
          "ko": "고마워요, 그런데 포르투갈어를 아주 잘하진 못해요."
        },
        "frames": [
          "pt-f1-12"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A phone call with a friend",
      "ko": "친구와 통화"
    },
    "expressions": [
      "tudo bem",
      "tchau"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô? Oi, tudo bem?",
        "gloss": {
          "en": "Hello? Hi, how are you?",
          "ko": "여보세요? 안녕, 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Oi! Tudo bem. Estou em casa.",
        "gloss": {
          "en": "Hi! I'm good. I'm at home.",
          "ko": "안녕하세요! 잘 지내요. 집에 있어요."
        },
        "frames": [
          "pt-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Você está bem? Sua voz está estranha.",
        "gloss": {
          "en": "Are you okay? Your voice sounds strange.",
          "ko": "괜찮아요? 목소리가 이상해요."
        }
      },
      {
        "who": "me",
        "text": "Estou um pouco cansado.",
        "gloss": {
          "en": "I'm a little tired.",
          "ko": "좀 피곤해요."
        },
        "frames": [
          "pt-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Ah, que pena. Você tem tempo amanhã?",
        "gloss": {
          "en": "Oh, that's too bad. Do you have time tomorrow?",
          "ko": "아, 안됐네요. 내일 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Tenho, sim. Amanhã eu tenho tempo à tarde.",
        "gloss": {
          "en": "Yes, I do. Tomorrow I have time in the afternoon.",
          "ko": "네, 있어요. 내일 오후에 시간 있어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Ótimo! Então até amanhã!",
        "gloss": {
          "en": "Great! See you tomorrow, then!",
          "ko": "좋아요! 그럼 내일 봐요!"
        }
      },
      {
        "who": "me",
        "text": "Tchau, até amanhã!",
        "gloss": {
          "en": "Bye, see you tomorrow!",
          "ko": "안녕, 내일 봐요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking for items at a supermarket",
      "ko": "슈퍼마켓에서 물건 찾기"
    },
    "expressions": [
      "obrigado",
      "quanto custa",
      "onde fica"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Posso ajudar?",
        "gloss": {
          "en": "Can I help you?",
          "ko": "도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Pode, sim. Onde fica o leite?",
        "gloss": {
          "en": "Yes, please. Where is the milk?",
          "ko": "네. 우유는 어디 있어요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "O leite fica no corredor três.",
        "gloss": {
          "en": "The milk is in aisle three.",
          "ko": "우유는 삼 번 통로에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Você tem pão integral?",
        "gloss": {
          "en": "Thanks. Do you have whole wheat bread?",
          "ko": "고마워요. 통밀빵 있어요?"
        },
        "frames": [
          "pt-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Temos, sim. Fica perto do caixa.",
        "gloss": {
          "en": "Yes, we do. It's near the checkout.",
          "ko": "네, 있어요. 계산대 근처에 있어요."
        }
      },
      {
        "who": "me",
        "text": "E quanto custa o pão?",
        "gloss": {
          "en": "And how much is the bread?",
          "ko": "그럼 빵은 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Custa oito reais.",
        "gloss": {
          "en": "It's eight reais.",
          "ko": "팔 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Tá bom. Obrigado!",
        "gloss": {
          "en": "Okay. Thank you!",
          "ko": "알겠어요. 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "pt-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a restaurant",
      "ko": "식당에서 주문하기"
    },
    "expressions": [
      "boa tarde",
      "obrigado",
      "por favor"
    ],
    "grammar": [
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa tarde! Já sabe o que vai pedir?",
        "gloss": {
          "en": "Good afternoon! Do you know what you'd like to order?",
          "ko": "안녕하세요! 뭘 주문하실지 정하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Boa tarde! O que é moqueca?",
        "gloss": {
          "en": "Good afternoon! What is moqueca?",
          "ko": "안녕하세요! 모케카가 뭐예요?"
        },
        "frames": [
          "pt-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "É um prato de peixe, da Bahia.",
        "gloss": {
          "en": "It's a fish dish from Bahia.",
          "ko": "바이아 지역의 생선 요리예요."
        }
      },
      {
        "who": "me",
        "text": "Hum, eu quero uma moqueca, por favor.",
        "gloss": {
          "en": "Hmm, I want a moqueca, please.",
          "ko": "음, 모케카 하나 주세요."
        },
        "frames": [
          "pt-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Ótima escolha! E para beber?",
        "gloss": {
          "en": "Great choice! And to drink?",
          "ko": "좋은 선택이에요! 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Você tem suco de laranja?",
        "gloss": {
          "en": "Do you have orange juice?",
          "ko": "오렌지 주스 있어요?"
        },
        "frames": [
          "pt-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Temos, sim. Aqui está a moqueca. Bom apetite!",
        "gloss": {
          "en": "Yes, we do. Here's the moqueca. Enjoy your meal!",
          "ko": "네, 있어요. 여기 모케카 나왔어요. 맛있게 드세요!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado! A comida aqui é muito boa.",
        "gloss": {
          "en": "Thank you! The food here is very good.",
          "ko": "감사합니다! 여기 음식 정말 맛있어요."
        },
        "frames": [
          "pt-f1-17"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Chatting at the gym",
      "ko": "헬스장에서 이야기하기"
    },
    "expressions": [
      "obrigado",
      "tchau",
      "até logo"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi, você é novo na academia?",
        "gloss": {
          "en": "Hi, are you new at the gym?",
          "ko": "안녕하세요, 헬스장에 새로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sou, sim. Eu trabalho em um escritório aqui perto.",
        "gloss": {
          "en": "Yes, I am. I work at an office near here.",
          "ko": "네. 이 근처 사무실에서 일해요."
        },
        "frames": [
          "pt-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Ah, legal! Você é de onde?",
        "gloss": {
          "en": "Oh, cool! Where are you from?",
          "ko": "아, 좋네요! 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sou de Daegu, na Coreia do Sul.",
        "gloss": {
          "en": "I'm from Daegu, in South Korea.",
          "ko": "한국 대구에서 왔어요."
        },
        "frames": [
          "pt-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Nossa, que longe! Você mora aqui perto também?",
        "gloss": {
          "en": "Wow, that's far! Do you live near here too?",
          "ko": "와, 멀리서 오셨네요! 이 근처에 사세요?"
        }
      },
      {
        "who": "me",
        "text": "Moro. Eu moro em um apartamento na esquina.",
        "gloss": {
          "en": "I do. I live in an apartment on the corner.",
          "ko": "네. 모퉁이에 있는 아파트에 살아요."
        },
        "frames": [
          "pt-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Legal! Bom treino!",
        "gloss": {
          "en": "Nice! Have a good workout!",
          "ko": "좋네요! 운동 잘하세요!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Tchau, até logo!",
        "gloss": {
          "en": "Thanks! Bye, see you later!",
          "ko": "고마워요! 안녕히 계세요, 또 봬요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a beach kiosk",
      "ko": "해변 매점에서"
    },
    "expressions": [
      "quanto custa",
      "por favor",
      "me vê um"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Vai querer alguma coisa?",
        "gloss": {
          "en": "Hi! Would you like something?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Vou. Me vê um coco, por favor.",
        "gloss": {
          "en": "Yes. Can I get a coconut, please?",
          "ko": "네. 코코넛 하나 주세요."
        },
        "frames": [
          "pt-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Gelado?",
        "gloss": {
          "en": "Cold?",
          "ko": "시원한 걸로요?"
        }
      },
      {
        "who": "me",
        "text": "Sim, por favor. Você tem canudo de papel?",
        "gloss": {
          "en": "Yes, please. Do you have a paper straw?",
          "ko": "네, 그걸로 주세요. 종이 빨대 있어요?"
        },
        "frames": [
          "pt-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Tenho, sim. Aqui.",
        "gloss": {
          "en": "Yes, I do. Here.",
          "ko": "네, 있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Quanto custa o coco?",
        "gloss": {
          "en": "How much is the coconut?",
          "ko": "코코넛은 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Sete reais.",
        "gloss": {
          "en": "Seven reais.",
          "ko": "칠 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Aqui está. A água de coco é muito boa!",
        "gloss": {
          "en": "Here you go. The coconut water is very good!",
          "ko": "여기요. 코코넛 워터 정말 맛있네요!"
        },
        "frames": [
          "pt-f1-17"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "In a ride-share car",
      "ko": "차량 호출 택시 안에서"
    },
    "expressions": [
      "boa noite",
      "obrigado",
      "desculpa",
      "por favor",
      "mais devagar"
    ],
    "grammar": [
      0,
      1,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite! Tudo bem?",
        "gloss": {
          "en": "Good evening! How are you?",
          "ko": "안녕하세요! 잘 지내세요?"
        }
      },
      {
        "who": "me",
        "text": "Boa noite! Estou bem, obrigado.",
        "gloss": {
          "en": "Good evening! I'm fine, thank you.",
          "ko": "안녕하세요! 잘 지내요, 고마워요."
        },
        "frames": [
          "pt-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Você é turista?",
        "gloss": {
          "en": "Are you a tourist?",
          "ko": "관광객이세요?"
        }
      },
      {
        "who": "me",
        "text": "Não, eu moro em Curitiba. Estou em Salvador a trabalho.",
        "gloss": {
          "en": "No, I live in Curitiba. I'm in Salvador for work.",
          "ko": "아니요, 쿠리치바에 살아요. 일 때문에 사우바도르에 와 있어요."
        },
        "frames": [
          "pt-f1-13",
          "pt-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Ah, legal! E está gostando da cidade? Aqui tem muita coisa para fazer, né?",
        "gloss": {
          "en": "Oh, nice! And are you enjoying the city? There's a lot to do here, right?",
          "ko": "아, 좋네요! 도시는 마음에 드세요? 여기 할 게 많죠?"
        }
      },
      {
        "who": "me",
        "text": "Desculpa, eu não falo português muito bem. Pode falar mais devagar, por favor?",
        "gloss": {
          "en": "Sorry, I don't speak Portuguese very well. Can you speak more slowly, please?",
          "ko": "죄송해요, 포르투갈어를 아주 잘하진 못해요. 좀 더 천천히 말해 주시겠어요?"
        },
        "frames": [
          "pt-f1-12",
          "pt-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro! Você gosta de Salvador?",
        "gloss": {
          "en": "Sure! Do you like Salvador?",
          "ko": "그럼요! 사우바도르 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "Gosto muito! A comida aqui é muito boa.",
        "gloss": {
          "en": "I like it a lot! The food here is very good.",
          "ko": "정말 좋아요! 여기 음식이 정말 맛있어요."
        },
        "frames": [
          "pt-f1-17"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a metro station information desk",
      "ko": "지하철역 안내 창구에서"
    },
    "expressions": [
      "bom dia",
      "obrigado",
      "quanto custa",
      "onde fica",
      "tchau"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia! Posso ajudar?",
        "gloss": {
          "en": "Good morning! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia! Onde fica a linha azul?",
        "gloss": {
          "en": "Good morning! Where is the blue line?",
          "ko": "안녕하세요! 파란 노선은 어디 있어요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Fica lá embaixo, à esquerda.",
        "gloss": {
          "en": "It's downstairs, on the left.",
          "ko": "아래층 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Quanto custa o bilhete?",
        "gloss": {
          "en": "Thanks. How much is the ticket?",
          "ko": "고마워요. 표는 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Custa cinco reais. Você tem cartão?",
        "gloss": {
          "en": "It's five reais. Do you have a card?",
          "ko": "오 헤알이에요. 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Eu tenho só dinheiro.",
        "gloss": {
          "en": "I only have cash.",
          "ko": "현금밖에 없어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Sem problema. A bilheteria fica ali.",
        "gloss": {
          "en": "No problem. The ticket office is over there.",
          "ko": "괜찮아요. 매표소는 저기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Tchau!",
        "gloss": {
          "en": "Thank you! Bye!",
          "ko": "고마워요! 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "pt-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for a lost phone at a café",
      "ko": "카페에서 잃어버린 휴대폰 찾기"
    },
    "expressions": [
      "obrigado",
      "com licença",
      "tchau",
      "até logo"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pois não?",
        "gloss": {
          "en": "Yes? How can I help?",
          "ko": "네, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Com licença. Você tem um celular azul aqui?",
        "gloss": {
          "en": "Excuse me. Do you have a blue phone here?",
          "ko": "실례합니다. 여기 파란 휴대폰 있어요?"
        },
        "frames": [
          "pt-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Tenho dois celulares aqui. Como é o seu?",
        "gloss": {
          "en": "I have two phones here. What does yours look like?",
          "ko": "여기 휴대폰이 두 개 있어요. 손님 건 어떻게 생겼어요?"
        }
      },
      {
        "who": "me",
        "text": "O meu é azul. Eu tenho uma capa com um gato.",
        "gloss": {
          "en": "Mine is blue. I have a case with a cat on it.",
          "ko": "제 건 파란색이에요. 고양이 그림 케이스가 있어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Ah, é esse! Aqui está.",
        "gloss": {
          "en": "Oh, it's this one! Here you go.",
          "ko": "아, 이거네요! 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Ah, obrigado! Estou muito feliz.",
        "gloss": {
          "en": "Oh, thank you! I'm so happy.",
          "ko": "아, 고마워요! 정말 기뻐요."
        },
        "frames": [
          "pt-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "De nada! Tchau!",
        "gloss": {
          "en": "You're welcome! Bye!",
          "ko": "천만에요! 안녕히 가세요!"
        }
      },
      {
        "who": "me",
        "text": "Tchau, até logo!",
        "gloss": {
          "en": "Bye, see you!",
          "ko": "안녕히 계세요, 또 봬요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the teacher in class",
      "ko": "수업 시간에 선생님께 묻기"
    },
    "expressions": [
      "tudo bem",
      "bom dia",
      "desculpa",
      "por favor",
      "não entendi",
      "pode repetir"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia! Tudo bem?",
        "gloss": {
          "en": "Good morning! How are you?",
          "ko": "좋은 아침이에요! 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia, professora, tudo bem?",
        "gloss": {
          "en": "Good morning, teacher, how are you?",
          "ko": "안녕하세요, 선생님, 잘 지내세요?"
        },
        "frames": [
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo ótimo. Hoje a palavra é saudade.",
        "gloss": {
          "en": "Great. Today's word is saudade.",
          "ko": "아주 좋아요. 오늘의 단어는 '사우다지'예요."
        }
      },
      {
        "who": "me",
        "text": "Desculpa, o que é saudade?",
        "gloss": {
          "en": "Sorry, what is saudade?",
          "ko": "죄송한데, '사우다지'가 뭐예요?"
        },
        "frames": [
          "pt-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "É um sentimento. É quando você sente falta de alguém.",
        "gloss": {
          "en": "It's a feeling. It's when you miss someone.",
          "ko": "감정이에요. 누군가를 그리워할 때 느끼는 거예요."
        }
      },
      {
        "who": "me",
        "text": "Não entendi. Pode repetir, por favor?",
        "gloss": {
          "en": "I didn't understand. Can you repeat that, please?",
          "ko": "못 알아들었어요. 다시 말씀해 주시겠어요?"
        },
        "frames": [
          "pt-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro. Você sente falta da sua família?",
        "gloss": {
          "en": "Sure. Do you miss your family?",
          "ko": "그럼요. 가족이 그리워요?"
        }
      },
      {
        "who": "me",
        "text": "Sim. Eu tenho saudade da minha família.",
        "gloss": {
          "en": "Yes. I miss my family.",
          "ko": "네. 가족이 그리워요."
        },
        "frames": [
          "pt-f1-11"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a neighbor in the elevator",
      "ko": "엘리베이터에서 이웃을 만남"
    },
    "expressions": [
      "tudo bem",
      "boa tarde"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa tarde! Você é o novo vizinho?",
        "gloss": {
          "en": "Good afternoon! Are you the new neighbor?",
          "ko": "안녕하세요! 새로 이사 온 이웃이세요?"
        }
      },
      {
        "who": "me",
        "text": "Sou, sim. Boa tarde, tudo bem?",
        "gloss": {
          "en": "Yes, I am. Good afternoon, how are you?",
          "ko": "네, 맞아요. 안녕하세요, 잘 지내세요?"
        },
        "frames": [
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo! Que calor hoje, né?",
        "gloss": {
          "en": "All good! It's so hot today, isn't it?",
          "ko": "잘 지내요! 오늘 정말 덥죠?"
        }
      },
      {
        "who": "me",
        "text": "Sim, muito quente. Mas estou feliz aqui.",
        "gloss": {
          "en": "Yes, very hot. But I'm happy here.",
          "ko": "네, 정말 더워요. 그래도 여기 와서 좋아요."
        },
        "frames": [
          "pt-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Que bom! Você mora em qual andar?",
        "gloss": {
          "en": "Good! Which floor do you live on?",
          "ko": "다행이에요! 몇 층에 사세요?"
        }
      },
      {
        "who": "me",
        "text": "No oitavo. E você?",
        "gloss": {
          "en": "On the eighth. And you?",
          "ko": "팔 층이요. 그쪽은요?"
        }
      },
      {
        "who": "them",
        "text": "Eu moro no terceiro. A vista lá de cima é bonita?",
        "gloss": {
          "en": "I live on the third. Is the view from up there nice?",
          "ko": "저는 삼 층에 살아요. 위에서 보는 경치 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "É, sim! A vista é muito boa.",
        "gloss": {
          "en": "Yes, it is! The view is very good.",
          "ko": "네, 좋아요! 경치가 정말 좋아요."
        },
        "frames": [
          "pt-f1-17"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a T-shirt at a clothing store",
      "ko": "옷 가게에서 티셔츠 사기"
    },
    "expressions": [
      "obrigado",
      "quanto custa",
      "por favor"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Olá! Posso ajudar?",
        "gloss": {
          "en": "Hello! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Pode. Quanto custa essa camiseta?",
        "gloss": {
          "en": "Yes. How much is this T-shirt?",
          "ko": "네. 이 티셔츠 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Custa cinquenta reais.",
        "gloss": {
          "en": "It's fifty reais.",
          "ko": "오십 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Você tem tamanho médio?",
        "gloss": {
          "en": "Do you have a medium size?",
          "ko": "중간 사이즈 있어요?"
        },
        "frames": [
          "pt-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Temos, sim. Azul ou branca?",
        "gloss": {
          "en": "Yes, we do. Blue or white?",
          "ko": "네, 있어요. 파란색이요, 흰색이요?"
        }
      },
      {
        "who": "me",
        "text": "Eu quero a branca, por favor.",
        "gloss": {
          "en": "I want the white one, please.",
          "ko": "흰색으로 주세요."
        },
        "frames": [
          "pt-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Aqui está. Cartão ou dinheiro?",
        "gloss": {
          "en": "Here you go. Card or cash?",
          "ko": "여기 있어요. 카드요, 현금이요?"
        }
      },
      {
        "who": "me",
        "text": "Cartão. Obrigado!",
        "gloss": {
          "en": "Card. Thank you!",
          "ko": "카드요. 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "pt-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking a bus driver for directions",
      "ko": "버스 기사에게 길 묻기"
    },
    "expressions": [
      "bom dia",
      "obrigado",
      "desculpa",
      "por favor",
      "onde fica",
      "mais devagar"
    ],
    "grammar": [
      1,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pois não?",
        "gloss": {
          "en": "Yes?",
          "ko": "네, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia! Onde fica a praça da Liberdade?",
        "gloss": {
          "en": "Good morning! Where is Liberdade Square?",
          "ko": "안녕하세요! 리베르다지 광장은 어디 있어요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Fica no centro. Desce no ponto depois da igreja.",
        "gloss": {
          "en": "It's downtown. Get off at the stop after the church.",
          "ko": "시내에 있어요. 교회 다음 정류장에서 내리세요."
        }
      },
      {
        "who": "me",
        "text": "Desculpa, eu não falo português muito bem.",
        "gloss": {
          "en": "Sorry, I don't speak Portuguese very well.",
          "ko": "죄송해요, 포르투갈어를 아주 잘하진 못해요."
        },
        "frames": [
          "pt-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Sem problema! Depois da igreja, tá?",
        "gloss": {
          "en": "No problem! After the church, okay?",
          "ko": "괜찮아요! 교회 다음이에요, 알겠죠?"
        }
      },
      {
        "who": "me",
        "text": "Pode falar mais devagar, por favor?",
        "gloss": {
          "en": "Can you speak more slowly, please?",
          "ko": "좀 더 천천히 말씀해 주시겠어요?"
        },
        "frames": [
          "pt-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro. Depois... da... igreja.",
        "gloss": {
          "en": "Sure. After... the... church.",
          "ko": "그럼요. 교회... 다음... 이요."
        }
      },
      {
        "who": "me",
        "text": "Ah, entendi! Obrigado!",
        "gloss": {
          "en": "Oh, I got it! Thank you!",
          "ko": "아, 알겠어요! 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "pt-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Dinner with a host family",
      "ko": "홈스테이 가족과 저녁 식사"
    },
    "expressions": [
      "boa noite",
      "obrigado",
      "por favor"
    ],
    "grammar": [
      1,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite! O jantar está pronto.",
        "gloss": {
          "en": "Good evening! Dinner is ready.",
          "ko": "좋은 저녁이에요! 저녁 준비됐어요."
        }
      },
      {
        "who": "me",
        "text": "Boa noite! O que é isso?",
        "gloss": {
          "en": "Good evening! What is this?",
          "ko": "좋은 저녁이에요! 이게 뭐예요?"
        },
        "frames": [
          "pt-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "É feijoada. Você quer provar?",
        "gloss": {
          "en": "It's feijoada. Do you want to try it?",
          "ko": "페이조아다예요. 먹어 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "Quero, sim. Eu quero um pouco, por favor.",
        "gloss": {
          "en": "Yes, I do. I want a little, please.",
          "ko": "네, 좋아요. 조금만 주세요."
        },
        "frames": [
          "pt-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Pode pegar mais! Você gosta?",
        "gloss": {
          "en": "You can take more! Do you like it?",
          "ko": "더 드셔도 돼요! 맛있어요?"
        }
      },
      {
        "who": "me",
        "text": "Nossa, a feijoada é muito boa!",
        "gloss": {
          "en": "Wow, the feijoada is very good!",
          "ko": "와, 페이조아다 정말 맛있어요!"
        },
        "frames": [
          "pt-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Que bom! Tem mais arroz, se quiser.",
        "gloss": {
          "en": "Great! There's more rice if you want.",
          "ko": "다행이에요! 원하면 밥도 더 있어요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado, mas estou bem.",
        "gloss": {
          "en": "Thanks, but I'm fine.",
          "ko": "고마워요, 그런데 충분해요."
        },
        "frames": [
          "pt-f1-05"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at the office",
      "ko": "회사 첫날"
    },
    "expressions": [
      "obrigado"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bem-vindo à empresa! Você é do time de vendas?",
        "gloss": {
          "en": "Welcome to the company! Are you on the sales team?",
          "ko": "회사에 오신 걸 환영해요! 영업팀이세요?"
        }
      },
      {
        "who": "me",
        "text": "Não. Eu trabalho em TI.",
        "gloss": {
          "en": "No. I work in IT.",
          "ko": "아니요. IT 쪽에서 일해요."
        },
        "frames": [
          "pt-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Ah, legal. E você mora longe?",
        "gloss": {
          "en": "Oh, nice. And do you live far away?",
          "ko": "아, 그렇군요. 집은 멀어요?"
        }
      },
      {
        "who": "me",
        "text": "Não, eu moro em Pinheiros.",
        "gloss": {
          "en": "No, I live in Pinheiros.",
          "ko": "아니요, 피녜이루스에 살아요."
        },
        "frames": [
          "pt-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Que bom. Quer um café?",
        "gloss": {
          "en": "Good. Do you want a coffee?",
          "ko": "잘됐네요. 커피 한 잔 할래요?"
        }
      },
      {
        "who": "me",
        "text": "Quero, sim. Estou muito cansado hoje.",
        "gloss": {
          "en": "Yes, please. I'm very tired today.",
          "ko": "네, 좋아요. 오늘 많이 피곤해요."
        },
        "frames": [
          "pt-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Ha, primeiro dia é assim! Aqui está.",
        "gloss": {
          "en": "Ha, first days are like that! Here you go.",
          "ko": "하하, 첫날은 원래 그래요! 여기요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! O café é muito bom.",
        "gloss": {
          "en": "Thanks! The coffee is very good.",
          "ko": "고마워요! 커피 정말 맛있네요."
        }
      }
    ]
  },
  {
    "id": "pt-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At an ice cream shop",
      "ko": "아이스크림 가게에서"
    },
    "expressions": [
      "obrigado",
      "quanto custa",
      "por favor",
      "me vê um",
      "tchau"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Qual sabor?",
        "gloss": {
          "en": "Hi! Which flavor?",
          "ko": "안녕하세요! 어떤 맛으로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Oi! O que é cupuaçu?",
        "gloss": {
          "en": "Hi! What is cupuaçu?",
          "ko": "안녕하세요! 쿠푸아수가 뭐예요?"
        },
        "frames": [
          "pt-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "É uma fruta da Amazônia. É muito boa!",
        "gloss": {
          "en": "It's a fruit from the Amazon. It's very good!",
          "ko": "아마존 과일이에요. 정말 맛있어요!"
        }
      },
      {
        "who": "me",
        "text": "Então me vê um de cupuaçu, por favor.",
        "gloss": {
          "en": "Then can I get a cupuaçu one, please?",
          "ko": "그럼 쿠푸아수로 하나 주세요."
        },
        "frames": [
          "pt-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Copinho ou casquinha?",
        "gloss": {
          "en": "Cup or cone?",
          "ko": "컵이요, 콘이요?"
        }
      },
      {
        "who": "me",
        "text": "Casquinha. Quanto custa?",
        "gloss": {
          "en": "Cone. How much is it?",
          "ko": "콘으로요. 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oito reais.",
        "gloss": {
          "en": "Eight reais.",
          "ko": "팔 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Aqui está. Obrigado, tchau!",
        "gloss": {
          "en": "Here you go. Thanks, bye!",
          "ko": "여기요. 고마워요, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "pt-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "bom dia",
      "obrigado",
      "desculpa",
      "por favor",
      "onde fica",
      "não entendi"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia. Você tem consulta marcada?",
        "gloss": {
          "en": "Good morning. Do you have an appointment?",
          "ko": "안녕하세요. 진료 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia. Tenho, sim. Eu tenho consulta às dez.",
        "gloss": {
          "en": "Good morning. Yes, I do. I have an appointment at ten.",
          "ko": "안녕하세요. 네, 했어요. 열 시에 진료 예약이 있어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Você tem o cartão do plano?",
        "gloss": {
          "en": "Okay. Do you have your health plan card?",
          "ko": "네. 의료 보험 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Desculpa, não entendi. O que é cartão do plano?",
        "gloss": {
          "en": "Sorry, I didn't understand. What is a plan card?",
          "ko": "죄송해요, 못 알아들었어요. '플라누 카드'가 뭐예요?"
        },
        "frames": [
          "pt-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "É o cartão do seguro de saúde.",
        "gloss": {
          "en": "It's your health insurance card.",
          "ko": "건강 보험 카드예요."
        }
      },
      {
        "who": "me",
        "text": "Ah, entendi. Pode esperar um minuto, por favor?",
        "gloss": {
          "en": "Oh, I see. Can you wait a minute, please?",
          "ko": "아, 알겠어요. 잠깐만 기다려 주시겠어요?"
        },
        "frames": [
          "pt-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Pode. Sente ali, por favor.",
        "gloss": {
          "en": "Sure. Please sit over there.",
          "ko": "네. 저기 앉아 계세요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Onde fica o banheiro?",
        "gloss": {
          "en": "Thanks. Where is the restroom?",
          "ko": "고마워요. 화장실은 어디 있어요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      }
    ]
  },
  {
    "id": "pt-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Arriving at a friend's party",
      "ko": "친구 집 파티에 도착"
    },
    "expressions": [
      "tudo bem",
      "tchau"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Entra, entra!",
        "gloss": {
          "en": "Hi! Come in, come in!",
          "ko": "안녕! 들어와요, 들어와요!"
        }
      },
      {
        "who": "me",
        "text": "Oi, Bia, tudo bem?",
        "gloss": {
          "en": "Hi, Bia, how are you?",
          "ko": "안녕하세요, 비아, 잘 지내요?"
        },
        "frames": [
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo ótimo! Foi fácil achar a casa?",
        "gloss": {
          "en": "Great! Was it easy to find the house?",
          "ko": "아주 좋아요! 집 찾기 쉬웠어요?"
        }
      },
      {
        "who": "me",
        "text": "Foi, sim! Eu moro em uma rua perto daqui.",
        "gloss": {
          "en": "Yes, it was! I live on a street near here.",
          "ko": "네, 쉬웠어요! 이 근처 길에 살아요."
        },
        "frames": [
          "pt-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Que bom! Quer uma fatia de torta?",
        "gloss": {
          "en": "Great! Do you want a slice of pie?",
          "ko": "잘됐네요! 파이 한 조각 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Quero, sim! Hum, a torta é muito boa!",
        "gloss": {
          "en": "Yes, please! Mmm, the pie is very good!",
          "ko": "네, 좋아요! 음, 파이 정말 맛있어요!"
        },
        "frames": [
          "pt-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Obrigada! Ah, você já vai?",
        "gloss": {
          "en": "Thanks! Oh, are you leaving already?",
          "ko": "고마워요! 아, 벌써 가요?"
        }
      },
      {
        "who": "me",
        "text": "Já. Tchau, até sábado!",
        "gloss": {
          "en": "Yes. Bye, see you Saturday!",
          "ko": "네. 안녕, 토요일에 봐요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a pharmacy with a sore throat",
      "ko": "목이 아파서 약국에서"
    },
    "expressions": [
      "tô cansado",
      "estou com dor de",
      "tem remédio para",
      "ontem à noite",
      "valeu"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa tarde! Posso ajudar?",
        "gloss": {
          "en": "Good afternoon! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa tarde. Estou com dor de garganta.",
        "gloss": {
          "en": "Good afternoon. I have a sore throat.",
          "ko": "안녕하세요. 목이 아파요."
        },
        "frames": [
          "pt-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Começou quando?",
        "gloss": {
          "en": "When did it start?",
          "ko": "언제부터 그랬어요?"
        }
      },
      {
        "who": "me",
        "text": "Começou ontem à noite. Tem remédio para dor de garganta?",
        "gloss": {
          "en": "It started last night. Do you have something for a sore throat?",
          "ko": "어젯밤부터요. 목 아픈 데 먹는 약 있어요?"
        },
        "frames": [
          "pt-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Tem, sim. Esse aqui é bom. Você tem febre também?",
        "gloss": {
          "en": "Yes, we do. This one is good. Do you have a fever too?",
          "ko": "네, 있어요. 이게 좋아요. 열도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Não, mas tô cansado porque não dormi bem.",
        "gloss": {
          "en": "No, but I'm tired because I didn't sleep well.",
          "ko": "아니요, 그런데 잠을 잘 못 자서 피곤해요."
        },
        "frames": [
          "pt-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Então descanse e beba muita água. São vinte reais.",
        "gloss": {
          "en": "Then rest and drink lots of water. That's twenty reais.",
          "ko": "그럼 푹 쉬고 물 많이 드세요. 이십 헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Valeu! Vou descansar hoje.",
        "gloss": {
          "en": "Thanks! I'm going to rest today.",
          "ko": "고마워요! 오늘은 쉴게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday chat with a coworker",
      "ko": "월요일에 동료와 이야기"
    },
    "expressions": [
      "combinado"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "E aí, como foi o fim de semana?",
        "gloss": {
          "en": "Hey, how was your weekend?",
          "ko": "안녕, 주말 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Foi ótimo! No sábado eu fui à praia com uns amigos.",
        "gloss": {
          "en": "It was great! On Saturday I went to the beach with some friends.",
          "ko": "좋았어요! 토요일에 친구들이랑 해변에 갔어요."
        },
        "frames": [
          "pt-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! E no domingo?",
        "gloss": {
          "en": "Nice! And on Sunday?",
          "ko": "좋네요! 일요일은요?"
        }
      },
      {
        "who": "me",
        "text": "Ontem eu fiquei em casa e cozinhei.",
        "gloss": {
          "en": "Yesterday I stayed home and cooked.",
          "ko": "어제는 집에 있으면서 요리했어요."
        },
        "frames": [
          "pt-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Você gosta de cozinhar?",
        "gloss": {
          "en": "Do you like cooking?",
          "ko": "요리하는 거 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Gosto muito! Eu gosto de fazer comida coreana.",
        "gloss": {
          "en": "I love it! I like making Korean food.",
          "ko": "정말 좋아해요! 한국 음식 만드는 걸 좋아해요."
        },
        "frames": [
          "pt-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Nossa, um dia traz um pouco para a gente provar!",
        "gloss": {
          "en": "Wow, bring some for us to try one day!",
          "ko": "와, 언제 우리도 맛보게 좀 가져와요!"
        }
      },
      {
        "who": "me",
        "text": "Combinado! Vou trazer kimchi na sexta.",
        "gloss": {
          "en": "Deal! I'm going to bring kimchi on Friday.",
          "ko": "좋아요! 금요일에 김치 가져올게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a bus ticket at the bus station",
      "ko": "버스 터미널에서 표 사기"
    },
    "expressions": [
      "a que horas",
      "quanto tempo leva",
      "ida e volta"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia! Para onde?",
        "gloss": {
          "en": "Good morning! Where to?",
          "ko": "안녕하세요! 어디로 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia. Uma passagem ida e volta para Paraty, por favor.",
        "gloss": {
          "en": "Good morning. A round-trip ticket to Paraty, please.",
          "ko": "안녕하세요. 파라치 왕복표 한 장 주세요."
        }
      },
      {
        "who": "them",
        "text": "Tem ônibus às dez e ao meio-dia.",
        "gloss": {
          "en": "There are buses at ten and at noon.",
          "ko": "열 시랑 열두 시에 버스가 있어요."
        }
      },
      {
        "who": "me",
        "text": "A que horas chega o ônibus das dez?",
        "gloss": {
          "en": "What time does the ten o'clock bus arrive?",
          "ko": "열 시 버스는 몇 시에 도착해요?"
        },
        "frames": [
          "pt-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Chega às duas da tarde.",
        "gloss": {
          "en": "It arrives at two in the afternoon.",
          "ko": "오후 두 시에 도착해요."
        }
      },
      {
        "who": "me",
        "text": "Quanto tempo leva a viagem, então? Quatro horas?",
        "gloss": {
          "en": "How long does the trip take, then? Four hours?",
          "ko": "그럼 가는 데 얼마나 걸려요? 네 시간이요?"
        },
        "frames": [
          "pt-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Isso. O das dez é executivo, o do meio-dia é convencional.",
        "gloss": {
          "en": "Right. The ten o'clock is executive class, the noon one is regular.",
          "ko": "맞아요. 열 시 버스는 우등이고, 열두 시 버스는 일반이에요."
        }
      },
      {
        "who": "me",
        "text": "Então o das dez. Esse é mais confortável do que aquele, né?",
        "gloss": {
          "en": "Then the ten o'clock. This one is more comfortable than that one, right?",
          "ko": "그럼 열 시 걸로요. 이게 저것보다 더 편하죠?"
        },
        "frames": [
          "pt-f2-07"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a friend to the movies by phone",
      "ko": "전화로 친구에게 영화 보자고 하기"
    },
    "expressions": [
      "beleza",
      "pode ser",
      "combinado",
      "que pena",
      "fica pra próxima"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Tudo bem?",
        "gloss": {
          "en": "Hi! How are you?",
          "ko": "안녕! 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Beleza! Vamos ver um filme amanhã?",
        "gloss": {
          "en": "All good! Shall we see a movie tomorrow?",
          "ko": "잘 지내요! 내일 영화 볼래요?"
        },
        "frames": [
          "pt-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Vamos sim! A que horas?",
        "gloss": {
          "en": "Sure, let's! What time?",
          "ko": "좋아요! 몇 시에요?"
        }
      },
      {
        "who": "me",
        "text": "Pode ser às sete?",
        "gloss": {
          "en": "How about at seven?",
          "ko": "일곱 시 어때요?"
        },
        "frames": [
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Às sete eu ainda estou no trabalho. Pode ser às nove?",
        "gloss": {
          "en": "At seven I'm still at work. How about nine?",
          "ko": "일곱 시엔 아직 회사에 있어요. 아홉 시 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Às nove? Combinado!",
        "gloss": {
          "en": "At nine? Deal!",
          "ko": "아홉 시요? 좋아요!"
        }
      },
      {
        "who": "them",
        "text": "Ótimo! E hoje, vamos jantar juntos?",
        "gloss": {
          "en": "Great! And today, shall we have dinner together?",
          "ko": "좋아요! 그럼 오늘은 같이 저녁 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Que pena, hoje eu tenho aula. Fica pra próxima!",
        "gloss": {
          "en": "Too bad, today I have class. Next time!",
          "ko": "아쉽네요, 오늘은 수업이 있어요. 다음에 해요!"
        },
        "frames": [
          "pt-f2-16"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor's office",
      "ko": "병원 진료실에서"
    },
    "expressions": [
      "tô cansado",
      "estou com dor de"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia. O que você está sentindo?",
        "gloss": {
          "en": "Good morning. How are you feeling?",
          "ko": "안녕하세요. 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia, doutora. Estou com dor de cabeça e febre.",
        "gloss": {
          "en": "Good morning, doctor. I have a headache and a fever.",
          "ko": "안녕하세요, 선생님. 머리가 아프고 열이 나요."
        },
        "frames": [
          "pt-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Você chegou de viagem recentemente?",
        "gloss": {
          "en": "Did you recently come back from a trip?",
          "ko": "최근에 여행에서 돌아오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sim, eu cheguei há uma semana da Coreia.",
        "gloss": {
          "en": "Yes, I arrived from Korea a week ago.",
          "ko": "네, 일주일 전에 한국에서 왔어요."
        },
        "frames": [
          "pt-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Entendi. Você dormiu bem esta semana?",
        "gloss": {
          "en": "I see. Did you sleep well this week?",
          "ko": "그렇군요. 이번 주에 잠은 잘 잤어요?"
        }
      },
      {
        "who": "me",
        "text": "Não. Tô cansado porque trabalhei até tarde todo dia.",
        "gloss": {
          "en": "No. I'm tired because I worked late every day.",
          "ko": "아니요. 매일 늦게까지 일해서 피곤해요."
        },
        "frames": [
          "pt-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Vou passar um remédio. Descanse bastante.",
        "gloss": {
          "en": "I'll prescribe some medicine. Get plenty of rest.",
          "ko": "약을 처방해 드릴게요. 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Vou ficar em casa amanhã.",
        "gloss": {
          "en": "Thank you. I'm going to stay home tomorrow.",
          "ko": "감사합니다. 내일은 집에 있을게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about hobbies with a classmate",
      "ko": "반 친구와 취미 이야기"
    },
    "expressions": [
      "vamos sim",
      "de vez em quando"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "O que você faz no fim de semana?",
        "gloss": {
          "en": "What do you do on the weekend?",
          "ko": "주말에 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "Eu gosto de correr no parque.",
        "gloss": {
          "en": "I like running in the park.",
          "ko": "공원에서 달리는 걸 좋아해요."
        },
        "frames": [
          "pt-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! Você gosta de futebol também?",
        "gloss": {
          "en": "Cool! Do you like soccer too?",
          "ko": "멋지네요! 축구도 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Não gosto muito de futebol. Prefiro vôlei.",
        "gloss": {
          "en": "I don't really like soccer. I prefer volleyball.",
          "ko": "축구는 별로 안 좋아해요. 배구가 더 좋아요."
        },
        "frames": [
          "pt-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Ah, eu jogo vôlei na praia! E você joga sempre?",
        "gloss": {
          "en": "Oh, I play beach volleyball! Do you play often?",
          "ko": "아, 저 해변에서 배구해요! 자주 해요?"
        }
      },
      {
        "who": "me",
        "text": "Não sempre. De vez em quando eu jogo com os colegas.",
        "gloss": {
          "en": "Not always. Every now and then I play with friends.",
          "ko": "항상은 아니에요. 가끔 친구들이랑 해요."
        },
        "frames": [
          "pt-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Vamos jogar juntos no sábado?",
        "gloss": {
          "en": "Shall we play together on Saturday?",
          "ko": "토요일에 같이 할래요?"
        }
      },
      {
        "who": "me",
        "text": "Vamos sim! Que horas?",
        "gloss": {
          "en": "Sure, let's! What time?",
          "ko": "좋아요! 몇 시에요?"
        }
      }
    ]
  },
  {
    "id": "pt-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Welcoming a new neighbor in the building",
      "ko": "건물에 새로 온 이웃 맞이하기"
    },
    "expressions": [
      "até amanhã"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Eu sou nova aqui no prédio. Você mora aqui faz tempo?",
        "gloss": {
          "en": "Hi! I'm new in the building. Have you lived here long?",
          "ko": "안녕하세요! 이 건물에 새로 왔어요. 여기 오래 사셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Moro aqui faz quatro anos. Seja bem-vinda!",
        "gloss": {
          "en": "I've lived here for four years. Welcome!",
          "ko": "여기 산 지 사 년 됐어요. 환영해요!"
        },
        "frames": [
          "pt-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Obrigada! Qual mercado é melhor, o da esquina ou o da avenida?",
        "gloss": {
          "en": "Thanks! Which supermarket is better, the one on the corner or the one on the avenue?",
          "ko": "고마워요! 마트는 어디가 나아요, 모퉁이 쪽이요, 큰길 쪽이요?"
        }
      },
      {
        "who": "me",
        "text": "O da avenida. Esse é mais barato do que aquele.",
        "gloss": {
          "en": "The one on the avenue. This one is cheaper than that one.",
          "ko": "큰길 쪽이요. 거기가 저기보다 더 싸요."
        },
        "frames": [
          "pt-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Ótima dica! E tem padaria boa aqui?",
        "gloss": {
          "en": "Great tip! And is there a good bakery here?",
          "ko": "좋은 정보네요! 여기 괜찮은 빵집도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Tem. Ontem eu comprei um pão ótimo na padaria da praça.",
        "gloss": {
          "en": "Yes. Yesterday I bought great bread at the bakery on the square.",
          "ko": "있어요. 어제 광장 빵집에서 아주 맛있는 빵을 샀어요."
        },
        "frames": [
          "pt-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Valeu! Vou lá amanhã.",
        "gloss": {
          "en": "Thanks! I'll go there tomorrow.",
          "ko": "고마워요! 내일 가 볼게요."
        }
      },
      {
        "who": "me",
        "text": "De nada! Até amanhã!",
        "gloss": {
          "en": "You're welcome! See you tomorrow!",
          "ko": "천만에요! 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking at a hotel front desk",
      "ko": "호텔 프런트에 묻기"
    },
    "expressions": [
      "a que horas",
      "quanto tempo leva",
      "valeu"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite! Posso ajudar?",
        "gloss": {
          "en": "Good evening! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa noite. A que horas começa o café da manhã?",
        "gloss": {
          "en": "Good evening. What time does breakfast start?",
          "ko": "안녕하세요. 아침 식사는 몇 시에 시작해요?"
        },
        "frames": [
          "pt-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Começa às seis e meia e vai até as dez.",
        "gloss": {
          "en": "It starts at six thirty and goes until ten.",
          "ko": "여섯 시 반에 시작해서 열 시까지예요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo. Quanto tempo leva daqui até o aeroporto?",
        "gloss": {
          "en": "Great. How long does it take from here to the airport?",
          "ko": "좋아요. 여기서 공항까지 얼마나 걸려요?"
        },
        "frames": [
          "pt-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Mais ou menos quarenta minutos de táxi.",
        "gloss": {
          "en": "About forty minutes by taxi.",
          "ko": "택시로 사십 분쯤 걸려요."
        }
      },
      {
        "who": "me",
        "text": "Tá bom. Vou sair às sete amanhã.",
        "gloss": {
          "en": "Okay. I'm going to leave at seven tomorrow.",
          "ko": "알겠어요. 내일 일곱 시에 나갈 거예요."
        },
        "frames": [
          "pt-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Quer que eu chame um táxi para você?",
        "gloss": {
          "en": "Do you want me to call a taxi for you?",
          "ko": "택시 불러 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Quero, sim. Valeu!",
        "gloss": {
          "en": "Yes, please. Thanks!",
          "ko": "네, 부탁해요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend calls while you're shopping",
      "ko": "장 보는 중에 친구가 전화함"
    },
    "expressions": [
      "pode ser",
      "que pena",
      "fica pra próxima",
      "até amanhã",
      "valeu"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô? Oi! Onde você está?",
        "gloss": {
          "en": "Hello? Hi! Where are you?",
          "ko": "여보세요? 안녕! 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "Oi! Estou fazendo compras no mercado agora.",
        "gloss": {
          "en": "Hi! I'm grocery shopping at the market now.",
          "ko": "안녕하세요! 지금 마트에서 장 보고 있어요."
        },
        "frames": [
          "pt-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Nós vamos jogar boliche hoje à noite. Quer vir?",
        "gloss": {
          "en": "We're going bowling tonight. Want to come?",
          "ko": "우리 오늘 밤에 볼링 치러 가요. 올래요?"
        }
      },
      {
        "who": "me",
        "text": "Que pena, hoje eu vou jantar com a minha família. Fica pra próxima!",
        "gloss": {
          "en": "Too bad, today I'm having dinner with my family. Next time!",
          "ko": "아쉽네요, 오늘은 가족이랑 저녁 먹어요. 다음에 해요!"
        },
        "frames": [
          "pt-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem! E amanhã?",
        "gloss": {
          "en": "That's fine! What about tomorrow?",
          "ko": "괜찮아요! 내일은요?"
        }
      },
      {
        "who": "me",
        "text": "Amanhã pode ser! Mas só depois das oito.",
        "gloss": {
          "en": "Tomorrow works! But only after eight.",
          "ko": "내일은 좋아요! 그런데 여덟 시 이후에만요."
        },
        "frames": [
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Combinado! Te mando mensagem.",
        "gloss": {
          "en": "Deal! I'll text you.",
          "ko": "좋아요! 문자 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Valeu! Até amanhã!",
        "gloss": {
          "en": "Thanks! See you tomorrow!",
          "ko": "고마워요! 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Sleepy morning at a café with a friend",
      "ko": "카페에서 졸린 아침, 친구와"
    },
    "expressions": [
      "tô cansado"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Nossa, que cara de sono!",
        "gloss": {
          "en": "Wow, you look sleepy!",
          "ko": "와, 엄청 졸려 보이네요!"
        }
      },
      {
        "who": "me",
        "text": "Pois é. Tô cansado porque fui dormir muito tarde.",
        "gloss": {
          "en": "Yeah. I'm tired because I went to bed very late.",
          "ko": "그러게요. 아주 늦게 자서 피곤해요."
        },
        "frames": [
          "pt-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Por quê? O que você fez ontem à noite?",
        "gloss": {
          "en": "Why? What did you do last night?",
          "ko": "왜요? 어젯밤에 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Ontem eu assisti a uma série até as duas da manhã.",
        "gloss": {
          "en": "Yesterday I watched a series until two in the morning.",
          "ko": "어제 새벽 두 시까지 드라마를 봤어요."
        },
        "frames": [
          "pt-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Que série? É de terror?",
        "gloss": {
          "en": "What series? Is it horror?",
          "ko": "무슨 드라마요? 공포물이에요?"
        }
      },
      {
        "who": "me",
        "text": "Não, não gosto muito de filme de terror. É uma comédia.",
        "gloss": {
          "en": "No, I don't really like horror. It's a comedy.",
          "ko": "아니요, 공포 영화는 별로 안 좋아해요. 코미디예요."
        },
        "frames": [
          "pt-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Ah, me passa o nome depois!",
        "gloss": {
          "en": "Oh, send me the name later!",
          "ko": "아, 나중에 제목 알려 줘요!"
        }
      },
      {
        "who": "me",
        "text": "Passo, sim. Você vai gostar!",
        "gloss": {
          "en": "Sure, I will. You'll like it!",
          "ko": "네, 알려 줄게요. 좋아할 거예요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost on the way to a restaurant",
      "ko": "식당 가는 길에 헤맴"
    },
    "expressions": [
      "beleza",
      "quanto tempo leva"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Você já chegou?",
        "gloss": {
          "en": "Hi! Have you arrived yet?",
          "ko": "안녕! 벌써 도착했어요?"
        }
      },
      {
        "who": "me",
        "text": "Ainda não. Estou procurando o restaurante agora.",
        "gloss": {
          "en": "Not yet. I'm looking for the restaurant now.",
          "ko": "아직이요. 지금 식당을 찾고 있어요."
        },
        "frames": [
          "pt-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Onde você está?",
        "gloss": {
          "en": "Where are you?",
          "ko": "어디에 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Estou na frente de um banco. Quanto tempo leva daqui a pé?",
        "gloss": {
          "en": "I'm in front of a bank. How long does it take from here on foot?",
          "ko": "은행 앞에 있어요. 여기서 걸어서 얼마나 걸려요?"
        },
        "frames": [
          "pt-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Uns cinco minutos. É só seguir reto.",
        "gloss": {
          "en": "About five minutes. Just go straight.",
          "ko": "오 분쯤이요. 그냥 쭉 오면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Beleza. Vou andar até a esquina.",
        "gloss": {
          "en": "Okay. I'm going to walk to the corner.",
          "ko": "알겠어요. 모퉁이까지 걸어갈게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Isso! Eu estou na mesa perto da janela.",
        "gloss": {
          "en": "Right! I'm at the table by the window.",
          "ko": "맞아요! 저는 창가 테이블에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Já estou chegando!",
        "gloss": {
          "en": "I'm almost there!",
          "ko": "거의 다 왔어요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a street market",
      "ko": "시장에서 과일 사기"
    },
    "expressions": [
      "valeu"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia! Vai levar melão hoje?",
        "gloss": {
          "en": "Good morning! Taking a melon today?",
          "ko": "안녕하세요! 오늘 멜론 가져가실래요?"
        }
      },
      {
        "who": "me",
        "text": "Vou. Esse é mais doce do que aquele?",
        "gloss": {
          "en": "Yes. Is this one sweeter than that one?",
          "ko": "네. 이게 저것보다 더 달아요?"
        },
        "frames": [
          "pt-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "É, sim. Esse é bem doce.",
        "gloss": {
          "en": "Yes, it is. This one is very sweet.",
          "ko": "네, 맞아요. 이건 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo! Eu gosto de fruta bem doce.",
        "gloss": {
          "en": "Great! I like really sweet fruit.",
          "ko": "좋아요! 아주 단 과일을 좋아해요."
        },
        "frames": [
          "pt-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Quer provar o maracujá também?",
        "gloss": {
          "en": "Do you want to try the passion fruit too?",
          "ko": "패션프루트도 맛보실래요?"
        }
      },
      {
        "who": "me",
        "text": "Não, obrigado. Não gosto muito de maracujá. É muito azedo.",
        "gloss": {
          "en": "No, thanks. I don't really like passion fruit. It's too sour.",
          "ko": "아니요, 괜찮아요. 패션프루트는 별로 안 좋아해요. 너무 셔요."
        },
        "frames": [
          "pt-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem! Mais alguma coisa?",
        "gloss": {
          "en": "No problem! Anything else?",
          "ko": "괜찮아요! 더 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Só o melão. Valeu!",
        "gloss": {
          "en": "Just the melon. Thanks!",
          "ko": "멜론만요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Weather small talk at a bus stop",
      "ko": "버스 정류장에서 날씨 이야기"
    },
    "expressions": [
      "que pena",
      "nossa",
      "de vez em quando"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Nossa, que calor hoje!",
        "gloss": {
          "en": "Wow, it's so hot today!",
          "ko": "와, 오늘 정말 덥네요!"
        }
      },
      {
        "who": "me",
        "text": "Nossa, muito! Vou comprar uma água.",
        "gloss": {
          "en": "Wow, really! I'm going to buy some water.",
          "ko": "정말요! 물 하나 사야겠어요."
        },
        "frames": [
          "pt-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Dizem que vai chover amanhã.",
        "gloss": {
          "en": "They say it's going to rain tomorrow.",
          "ko": "내일 비 온대요."
        }
      },
      {
        "who": "me",
        "text": "Que pena! No sábado eu fui à praia e fez um sol lindo.",
        "gloss": {
          "en": "Too bad! On Saturday I went to the beach and it was beautifully sunny.",
          "ko": "아쉽네요! 토요일에 해변에 갔는데 날씨가 정말 좋았어요."
        },
        "frames": [
          "pt-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Você vai sempre à praia?",
        "gloss": {
          "en": "Do you go to the beach often?",
          "ko": "해변에 자주 가요?"
        }
      },
      {
        "who": "me",
        "text": "De vez em quando eu vou, quando não trabalho.",
        "gloss": {
          "en": "Every now and then I go, when I'm not working.",
          "ko": "일 안 할 때 가끔 가요."
        },
        "frames": [
          "pt-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Olha, o ônibus chegou!",
        "gloss": {
          "en": "Look, the bus is here!",
          "ko": "저기 봐요, 버스 왔어요!"
        }
      },
      {
        "who": "me",
        "text": "Ah, é o meu! Até mais!",
        "gloss": {
          "en": "Oh, that's mine! See you!",
          "ko": "아, 제 버스예요! 또 봐요!"
        }
      }
    ]
  },
  {
    "id": "pt-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "First session with a personal trainer",
      "ko": "퍼스널 트레이너와 첫 수업"
    },
    "expressions": [
      "estou com dor de",
      "de vez em quando",
      "valeu"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Você é novo por aqui?",
        "gloss": {
          "en": "Hi! Are you new around here?",
          "ko": "안녕하세요! 여기 처음 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sou. Eu cheguei há duas semanas na cidade.",
        "gloss": {
          "en": "Yes. I arrived in the city two weeks ago.",
          "ko": "네. 이 도시에 온 지 이 주 됐어요."
        },
        "frames": [
          "pt-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Legal! Você faz exercício sempre?",
        "gloss": {
          "en": "Nice! Do you exercise often?",
          "ko": "좋네요! 운동은 자주 하세요?"
        }
      },
      {
        "who": "me",
        "text": "De vez em quando eu corro, mas não muito.",
        "gloss": {
          "en": "Every now and then I run, but not much.",
          "ko": "가끔 달리긴 하는데, 많이는 안 해요."
        },
        "frames": [
          "pt-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem. Hoje vamos começar devagar.",
        "gloss": {
          "en": "That's fine. Today we'll start slowly.",
          "ko": "괜찮아요. 오늘은 천천히 시작할게요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo, porque estou com dor de costas.",
        "gloss": {
          "en": "Great, because I have a backache.",
          "ko": "잘됐네요, 허리가 아프거든요."
        },
        "frames": [
          "pt-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Então hoje sem peso. Só alongamento.",
        "gloss": {
          "en": "Then no weights today. Just stretching.",
          "ko": "그럼 오늘은 무게 없이 스트레칭만 해요."
        }
      },
      {
        "who": "me",
        "text": "Valeu! Vou fazer com calma.",
        "gloss": {
          "en": "Thanks! I'm going to take it easy.",
          "ko": "고마워요! 천천히 할게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Choosing a phone at an electronics store",
      "ko": "전자제품 매장에서 휴대폰 고르기"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Procurando um celular?",
        "gloss": {
          "en": "Hi! Looking for a phone?",
          "ko": "안녕하세요! 휴대폰 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Sim. Esse é mais rápido do que aquele?",
        "gloss": {
          "en": "Yes. Is this one faster than that one?",
          "ko": "네. 이게 저것보다 더 빨라요?"
        },
        "frames": [
          "pt-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "É, sim, e a bateria também é melhor.",
        "gloss": {
          "en": "Yes, and the battery is better too.",
          "ko": "네, 배터리도 더 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Eu gosto de tirar muita foto. A câmera é boa?",
        "gloss": {
          "en": "I like taking lots of photos. Is the camera good?",
          "ko": "사진 찍는 걸 좋아해요. 카메라 좋아요?"
        },
        "frames": [
          "pt-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "É ótima! Quer testar?",
        "gloss": {
          "en": "It's great! Want to try it?",
          "ko": "아주 좋아요! 한번 써 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "Quero. Ontem eu vi esse modelo na internet.",
        "gloss": {
          "en": "Yes. Yesterday I saw this model online.",
          "ko": "네. 어제 인터넷에서 이 모델을 봤어요."
        },
        "frames": [
          "pt-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "E então, vai levar?",
        "gloss": {
          "en": "So, are you taking it?",
          "ko": "그래서, 사실 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Vou pensar. Vou voltar no sábado.",
        "gloss": {
          "en": "I'll think about it. I'm going to come back on Saturday.",
          "ko": "생각해 볼게요. 토요일에 다시 올게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a holiday trip with a friend",
      "ko": "친구와 연휴 여행 계획"
    },
    "expressions": [
      "a que horas",
      "vamos sim",
      "pode ser",
      "combinado",
      "quanto tempo leva",
      "nossa"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "E o feriado? Bora viajar?",
        "gloss": {
          "en": "What about the holiday? Let's travel?",
          "ko": "연휴에 뭐 해요? 여행 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "Vamos sim! Vamos para Ouro Preto?",
        "gloss": {
          "en": "Yes, let's! Shall we go to Ouro Preto?",
          "ko": "좋아요! 오루프레투 갈래요?"
        },
        "frames": [
          "pt-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Boa ideia! De carro ou de ônibus?",
        "gloss": {
          "en": "Good idea! By car or by bus?",
          "ko": "좋은 생각이에요! 차로요, 버스로요?"
        }
      },
      {
        "who": "me",
        "text": "Quanto tempo leva de ônibus?",
        "gloss": {
          "en": "How long does it take by bus?",
          "ko": "버스로 얼마나 걸려요?"
        },
        "frames": [
          "pt-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Umas sete horas, eu acho.",
        "gloss": {
          "en": "About seven hours, I think.",
          "ko": "일곱 시간쯤 걸릴 거예요."
        }
      },
      {
        "who": "me",
        "text": "Nossa! Pode ser de carro, então?",
        "gloss": {
          "en": "Wow! How about by car, then?",
          "ko": "와! 그럼 차로 가는 거 어때요?"
        },
        "frames": [
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Pode! Eu dirijo. Saímos na sexta?",
        "gloss": {
          "en": "Sure! I'll drive. Shall we leave on Friday?",
          "ko": "좋아요! 제가 운전할게요. 금요일에 출발할까요?"
        }
      },
      {
        "who": "me",
        "text": "Combinado! A que horas saímos?",
        "gloss": {
          "en": "Deal! What time do we leave?",
          "ko": "좋아요! 몇 시에 출발해요?"
        },
        "frames": [
          "pt-f2-12"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Back to class after vacation",
      "ko": "방학 끝나고 수업에서"
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
        "text": "Bom dia! Como foram as férias?",
        "gloss": {
          "en": "Good morning! How was your vacation?",
          "ko": "좋은 아침이에요! 방학 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Foram ótimas! No sábado eu fui ao Rio com a minha irmã.",
        "gloss": {
          "en": "It was great! On Saturday I went to Rio with my sister.",
          "ko": "아주 좋았어요! 토요일에 여동생이랑 리우에 갔어요."
        },
        "frames": [
          "pt-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! O que vocês fizeram lá?",
        "gloss": {
          "en": "How nice! What did you do there?",
          "ko": "좋네요! 거기서 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Subimos o Cristo e comemos muito!",
        "gloss": {
          "en": "We went up to the Christ statue and ate a lot!",
          "ko": "예수상에 올라가고 많이 먹었어요!"
        }
      },
      {
        "who": "them",
        "text": "E você gostou do Rio?",
        "gloss": {
          "en": "And did you like Rio?",
          "ko": "리우는 마음에 들었어요?"
        }
      },
      {
        "who": "me",
        "text": "Gostei! Mas não gosto muito de calor.",
        "gloss": {
          "en": "I did! But I don't really like the heat.",
          "ko": "좋았어요! 그런데 더위는 별로 안 좋아해요."
        },
        "frames": [
          "pt-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Entendo. E agora, está pronto para a aula?",
        "gloss": {
          "en": "I understand. And now, are you ready for class?",
          "ko": "그렇군요. 그럼 이제 수업 준비됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Estou! Estou abrindo o livro agora.",
        "gloss": {
          "en": "I am! I'm opening the book now.",
          "ko": "네! 지금 책 펴고 있어요."
        },
        "frames": [
          "pt-f2-04"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a coworker to lunch",
      "ko": "동료에게 점심 같이 먹자고 하기"
    },
    "expressions": [
      "pode ser",
      "que pena",
      "fica pra próxima"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Já almoçou?",
        "gloss": {
          "en": "Hi! Have you had lunch yet?",
          "ko": "안녕하세요! 점심 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Ainda não. Vamos almoçar juntos?",
        "gloss": {
          "en": "Not yet. Shall we have lunch together?",
          "ko": "아직이요. 같이 점심 먹을래요?"
        },
        "frames": [
          "pt-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Hoje não dá, tenho reunião. Que tal amanhã?",
        "gloss": {
          "en": "I can't today, I have a meeting. How about tomorrow?",
          "ko": "오늘은 안 돼요, 회의가 있어요. 내일은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Pode ser amanhã ao meio-dia?",
        "gloss": {
          "en": "How about tomorrow at noon?",
          "ko": "내일 열두 시 어때요?"
        },
        "frames": [
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Pode! E sexta tem happy hour da equipe. Você vai?",
        "gloss": {
          "en": "Sure! And Friday there's a team happy hour. Are you going?",
          "ko": "좋아요! 그리고 금요일에 팀 회식 있어요. 갈 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Vou sim! Vou chamar o pessoal do meu time.",
        "gloss": {
          "en": "Yes! I'm going to invite the people on my team.",
          "ko": "네, 갈게요! 우리 팀 사람들도 부를게요."
        },
        "frames": [
          "pt-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Ótimo! E hoje à tarde, quer um café?",
        "gloss": {
          "en": "Great! And this afternoon, want a coffee?",
          "ko": "좋아요! 그럼 오늘 오후에 커피 한잔할래요?"
        }
      },
      {
        "who": "me",
        "text": "Que pena, hoje eu tenho muito trabalho. Fica pra próxima!",
        "gloss": {
          "en": "Too bad, today I have a lot of work. Next time!",
          "ko": "아쉽네요, 오늘은 일이 많아요. 다음에 해요!"
        },
        "frames": [
          "pt-f2-16"
        ]
      }
    ]
  },
  {
    "id": "pt-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A delivery driver calls",
      "ko": "택배 기사에게서 온 전화"
    },
    "expressions": [
      "a que horas",
      "pode ser",
      "valeu"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, é da entrega. Você está em casa?",
        "gloss": {
          "en": "Hello, this is the delivery. Are you at home?",
          "ko": "여보세요, 택배인데요. 집에 계세요?"
        }
      },
      {
        "who": "me",
        "text": "Não, estou voltando do trabalho agora.",
        "gloss": {
          "en": "No, I'm coming back from work now.",
          "ko": "아니요, 지금 퇴근하는 중이에요."
        },
        "frames": [
          "pt-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem. A que horas você chega?",
        "gloss": {
          "en": "That's fine. What time will you get there?",
          "ko": "괜찮아요. 몇 시에 도착하세요?"
        }
      },
      {
        "who": "me",
        "text": "Eu chego às seis. A que horas vocês passam de novo?",
        "gloss": {
          "en": "I'll get there at six. What time will you come by again?",
          "ko": "여섯 시에 도착해요. 몇 시에 다시 오세요?"
        },
        "frames": [
          "pt-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Podemos passar às sete.",
        "gloss": {
          "en": "We can come by at seven.",
          "ko": "일곱 시에 갈 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Pode ser às sete e meia?",
        "gloss": {
          "en": "How about at seven thirty?",
          "ko": "일곱 시 반은 어때요?"
        },
        "frames": [
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Pode, sim. Combinado.",
        "gloss": {
          "en": "Sure. Deal.",
          "ko": "네, 좋아요. 그렇게 해요."
        }
      },
      {
        "who": "me",
        "text": "Valeu! Até mais tarde.",
        "gloss": {
          "en": "Thanks! See you later.",
          "ko": "고마워요! 이따 봬요."
        }
      }
    ]
  },
  {
    "id": "pt-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting at a barbecue",
      "ko": "바비큐 파티에서 이야기"
    },
    "expressions": [
      "de vez em quando"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você fala bem português! Mora aqui faz tempo?",
        "gloss": {
          "en": "You speak Portuguese well! Have you lived here long?",
          "ko": "포르투갈어 잘하시네요! 여기 오래 사셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Moro aqui faz dois anos.",
        "gloss": {
          "en": "I've lived here for two years.",
          "ko": "여기 산 지 이 년 됐어요."
        },
        "frames": [
          "pt-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "E não te vi semana passada. Estava viajando?",
        "gloss": {
          "en": "And I didn't see you last week. Were you traveling?",
          "ko": "지난주에 안 보이던데요. 여행 갔었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sim, eu cheguei há três dias da Coreia.",
        "gloss": {
          "en": "Yes, I got back from Korea three days ago.",
          "ko": "네, 사흘 전에 한국에서 왔어요."
        },
        "frames": [
          "pt-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Que saudade, né? Você visita sempre?",
        "gloss": {
          "en": "You must miss it, right? Do you visit often?",
          "ko": "그립겠어요. 자주 가요?"
        }
      },
      {
        "who": "me",
        "text": "De vez em quando eu vou, uma vez por ano.",
        "gloss": {
          "en": "Every now and then I go, once a year.",
          "ko": "가끔 가요, 일 년에 한 번이요."
        },
        "frames": [
          "pt-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "E o que você gosta de fazer lá?",
        "gloss": {
          "en": "And what do you like doing there?",
          "ko": "거기 가면 뭐 하는 걸 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Eu gosto de comer na casa da minha avó.",
        "gloss": {
          "en": "I like eating at my grandmother's house.",
          "ko": "할머니 댁에서 밥 먹는 걸 좋아해요."
        },
        "frames": [
          "pt-f2-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Reporting a problem at a hotel",
      "ko": "호텔에 문제 알리기"
    },
    "expressions": [
      "não está funcionando",
      "seria possível",
      "ainda bem"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Recepção, boa noite. Em que posso ajudar?",
        "gloss": {
          "en": "Front desk, good evening. How can I help you?",
          "ko": "프런트입니다, 안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa noite. O ar-condicionado do meu quarto não está funcionando.",
        "gloss": {
          "en": "Good evening. The air conditioner in my room isn't working.",
          "ko": "안녕하세요. 제 방 에어컨이 작동하지 않아요."
        },
        "frames": [
          "pt-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Puxa, desculpe. Vou mandar alguém para ver agora mesmo.",
        "gloss": {
          "en": "Oh, I'm sorry. I'll send someone to check right now.",
          "ko": "아, 죄송합니다. 지금 바로 사람을 보내 확인할게요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. Seria possível trocar de quarto, se não der para consertar?",
        "gloss": {
          "en": "Thanks. Would it be possible to change rooms if it can't be fixed?",
          "ko": "고마워요. 고칠 수 없으면 방을 바꿀 수 있을까요?"
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Claro, temos um quarto livre no sexto andar.",
        "gloss": {
          "en": "Of course, we have a free room on the sixth floor.",
          "ko": "물론이죠, 육 층에 빈방이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo. Você poderia mandar alguém para me ajudar com as malas?",
        "gloss": {
          "en": "Great. Could you send someone to help me with my bags?",
          "ko": "좋아요. 짐 옮기는 걸 도와줄 사람을 보내 주실 수 있을까요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Com certeza. Em dez minutos alguém sobe.",
        "gloss": {
          "en": "Certainly. Someone will come up in ten minutes.",
          "ko": "물론이죠. 십 분 안에 올라갈 거예요."
        }
      },
      {
        "who": "me",
        "text": "Ainda bem! Muito obrigado.",
        "gloss": {
          "en": "Thank goodness! Thank you very much.",
          "ko": "다행이네요! 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a TV series with a friend",
      "ko": "친구와 드라마 이야기"
    },
    "expressions": [
      "eu acho que",
      "na minha opinião",
      "concordo",
      "não é bem assim",
      "sem spoiler"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "E aí, você viu o último episódio?",
        "gloss": {
          "en": "Hey, did you see the last episode?",
          "ko": "야, 마지막 회 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "Vi! Sem spoiler para quem não viu, mas eu acho que o final foi incrível.",
        "gloss": {
          "en": "I did! No spoilers for anyone who hasn't seen it, but I think the ending was amazing.",
          "ko": "봤어요! 안 본 사람 위해 스포는 안 할게요, 그런데 결말이 정말 대단했던 것 같아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Sério? Eu achei o final meio fraco.",
        "gloss": {
          "en": "Really? I thought the ending was kind of weak.",
          "ko": "정말요? 저는 결말이 좀 약했던 것 같은데요."
        }
      },
      {
        "who": "me",
        "text": "Não é bem assim, o final explicou tudo da primeira temporada.",
        "gloss": {
          "en": "It's not quite like that, the ending explained everything from the first season.",
          "ko": "꼭 그렇진 않아요, 결말이 첫 시즌 내용을 다 설명해 줬잖아요."
        },
        "frames": [
          "pt-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Hum, pode ser. Mas o vilão foi o melhor personagem, né?",
        "gloss": {
          "en": "Hmm, maybe. But the villain was the best character, right?",
          "ko": "음, 그럴 수도 있겠네요. 그래도 악역이 최고의 캐릭터였죠?"
        }
      },
      {
        "who": "me",
        "text": "Concordo, ele foi o melhor da série inteira.",
        "gloss": {
          "en": "I agree, he was the best in the whole series.",
          "ko": "맞아요, 시리즈 전체에서 최고였어요."
        },
        "frames": [
          "pt-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Você acha que vai ter outra temporada?",
        "gloss": {
          "en": "Do you think there'll be another season?",
          "ko": "다음 시즌이 나올 것 같아요?"
        }
      },
      {
        "who": "me",
        "text": "Na minha opinião, vai ter, sim. A série faz muito sucesso.",
        "gloss": {
          "en": "In my opinion, yes, there will be. The series is very popular.",
          "ko": "제 생각엔 나올 거예요. 시리즈가 인기가 아주 많거든요."
        },
        "frames": [
          "pt-f3-02"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about your hometown with a new friend",
      "ko": "새 친구에게 고향 이야기하기"
    },
    "expressions": [
      "de repente"
    ],
    "grammar": [
      0,
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você cresceu em cidade grande?",
        "gloss": {
          "en": "Did you grow up in a big city?",
          "ko": "큰 도시에서 자랐어요?"
        }
      },
      {
        "who": "me",
        "text": "Não. Quando eu era criança, eu morava numa cidade pequena perto do mar.",
        "gloss": {
          "en": "No. When I was a kid, I lived in a small town near the sea.",
          "ko": "아니요. 어렸을 때 바닷가 근처 작은 도시에 살았어요."
        },
        "frames": [
          "pt-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Que delícia! E o que você fazia lá?",
        "gloss": {
          "en": "How lovely! And what did you do there?",
          "ko": "좋았겠네요! 거기서 뭐 하면서 지냈어요?"
        }
      },
      {
        "who": "me",
        "text": "Eu ia muito à praia com meu avô. É o lugar onde eu aprendi a nadar.",
        "gloss": {
          "en": "I went to the beach a lot with my grandfather. It's the place where I learned to swim.",
          "ko": "할아버지랑 해변에 자주 갔어요. 제가 수영을 배운 곳이에요."
        },
        "frames": [
          "pt-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Que lindo! E aconteceu alguma coisa engraçada lá?",
        "gloss": {
          "en": "How sweet! Did anything funny happen there?",
          "ko": "멋지네요! 거기서 재밌는 일은 없었어요?"
        }
      },
      {
        "who": "me",
        "text": "Uma vez a gente estava pescando e, de repente, um peixe enorme pulou no barco!",
        "gloss": {
          "en": "Once we were fishing and suddenly a huge fish jumped into the boat!",
          "ko": "한번은 낚시를 하고 있었는데, 갑자기 엄청 큰 물고기가 배로 뛰어들었어요!"
        },
        "frames": [
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Hahaha! E vocês levaram o peixe para casa?",
        "gloss": {
          "en": "Hahaha! And did you take the fish home?",
          "ko": "하하하! 그래서 그 물고기 집에 가져갔어요?"
        }
      },
      {
        "who": "me",
        "text": "Levamos! Minha avó fez um peixe ótimo no jantar.",
        "gloss": {
          "en": "We did! My grandmother made a great fish for dinner.",
          "ko": "가져갔죠! 할머니가 저녁에 생선 요리를 맛있게 해 주셨어요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving at work soaked from the rain",
      "ko": "비에 젖어 출근함"
    },
    "expressions": [
      "eu acho que",
      "de repente"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Nossa, você está todo molhado! O que aconteceu?",
        "gloss": {
          "en": "Wow, you're soaking wet! What happened?",
          "ko": "와, 완전히 젖었네요! 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "Eu estava saindo do metrô quando começou a chover.",
        "gloss": {
          "en": "I was coming out of the subway when it started raining.",
          "ko": "지하철에서 나오는데 비가 오기 시작했어요."
        },
        "frames": [
          "pt-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "E você não tinha guarda-chuva?",
        "gloss": {
          "en": "And you didn't have an umbrella?",
          "ko": "우산 없었어요?"
        }
      },
      {
        "who": "me",
        "text": "Tinha, mas de repente o vento quebrou o guarda-chuva.",
        "gloss": {
          "en": "I did, but suddenly the wind broke my umbrella.",
          "ko": "있었는데, 갑자기 바람에 우산이 망가졌어요."
        },
        "frames": [
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Que azar! Quer uma toalha?",
        "gloss": {
          "en": "What bad luck! Do you want a towel?",
          "ko": "운이 나빴네요! 수건 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "Quero, valeu. Eu acho que tenho uma camiseta no armário também.",
        "gloss": {
          "en": "Yes, thanks. I think I have a T-shirt in my locker too.",
          "ko": "네, 고마워요. 사물함에 티셔츠도 하나 있는 것 같아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Que bom. A reunião começa daqui a pouco, hein.",
        "gloss": {
          "en": "Good. The meeting starts soon, you know.",
          "ko": "다행이네요. 회의 곧 시작해요."
        }
      },
      {
        "who": "me",
        "text": "Tranquilo. A gente vai começar às dez, né? Dá tempo.",
        "gloss": {
          "en": "No worries. We're going to start at ten, right? There's time.",
          "ko": "괜찮아요. 열 시에 시작하죠? 시간 돼요."
        },
        "frames": [
          "pt-f3-11"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Exchanging a gift at a store",
      "ko": "가게에서 선물 교환하기"
    },
    "expressions": [
      "dá para trocar",
      "seria possível",
      "você me indica",
      "ainda bem"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa tarde! Posso ajudar?",
        "gloss": {
          "en": "Good afternoon! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa tarde. Ganhei essa camisa de presente, mas ficou pequena. Dá para trocar por um tamanho maior?",
        "gloss": {
          "en": "Good afternoon. I got this shirt as a gift, but it's too small. Can I change it for a bigger size?",
          "ko": "안녕하세요. 이 셔츠를 선물로 받았는데 작아요. 더 큰 사이즈로 바꿀 수 있을까요?"
        },
        "frames": [
          "pt-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Dá, sim. Você tem a nota fiscal?",
        "gloss": {
          "en": "Yes, you can. Do you have the receipt?",
          "ko": "네, 돼요. 영수증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Não tenho. Seria possível trocar sem nota?",
        "gloss": {
          "en": "I don't. Would it be possible to exchange it without a receipt?",
          "ko": "없어요. 영수증 없이 교환할 수 있을까요?"
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Pode ser, se tiver a etiqueta. Deixa eu ver... tem, sim!",
        "gloss": {
          "en": "Maybe, if it has the tag. Let me see... yes, it does!",
          "ko": "택이 있으면 돼요. 어디 봐요... 있네요!"
        }
      },
      {
        "who": "me",
        "text": "Ainda bem! Você me indica uma cor que combine com calça jeans?",
        "gloss": {
          "en": "Thank goodness! Can you recommend a color that goes with jeans?",
          "ko": "다행이에요! 청바지랑 어울리는 색 추천해 주실래요?"
        },
        "frames": [
          "pt-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Essa azul-marinho fica ótima com jeans.",
        "gloss": {
          "en": "This navy blue looks great with jeans.",
          "ko": "이 남색이 청바지랑 아주 잘 어울려요."
        }
      },
      {
        "who": "me",
        "text": "Perfeito. Espero que tenha no tamanho G.",
        "gloss": {
          "en": "Perfect. I hope you have it in large.",
          "ko": "좋아요. 라지 사이즈가 있으면 좋겠어요."
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a local for a restaurant tip",
      "ko": "현지인에게 맛집 추천받기"
    },
    "expressions": [
      "eu acho que",
      "você me indica",
      "vale a pena"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Você está perdido? Precisa de ajuda?",
        "gloss": {
          "en": "Hi! Are you lost? Do you need help?",
          "ko": "안녕하세요! 길 잃으셨어요? 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Não, obrigado. Mas você me indica um restaurante bom por aqui?",
        "gloss": {
          "en": "No, thanks. But can you recommend a good restaurant around here?",
          "ko": "아니요, 괜찮아요. 그런데 이 근처 괜찮은 식당 추천해 주실래요?"
        },
        "frames": [
          "pt-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Tem o Bar do Zé. É o lugar onde os moradores comem.",
        "gloss": {
          "en": "There's Zé's Bar. It's the place where the locals eat.",
          "ko": "'제 바'가 있어요. 동네 사람들이 먹는 곳이에요."
        }
      },
      {
        "who": "me",
        "text": "Legal! Vale a pena ir lá na hora do almoço?",
        "gloss": {
          "en": "Great! Is it worth going there at lunchtime?",
          "ko": "좋네요! 점심시간에 가 볼 만해요?"
        },
        "frames": [
          "pt-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Vale muito. Peça o peixe frito, é o melhor.",
        "gloss": {
          "en": "Totally. Order the fried fish, it's the best.",
          "ko": "정말 그래요. 생선튀김 시키세요, 최고예요."
        }
      },
      {
        "who": "me",
        "text": "Combinado. Eu acho que vou a pé, fica longe?",
        "gloss": {
          "en": "Sounds good. I think I'll walk, is it far?",
          "ko": "알겠어요. 걸어갈 생각인데, 멀어요?"
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Uns dez minutos andando, é só descer a rua.",
        "gloss": {
          "en": "About ten minutes on foot, just go down the street.",
          "ko": "걸어서 십 분쯤이요, 이 길로 쭉 내려가면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Muito obrigado! Espero que ainda tenha mesa.",
        "gloss": {
          "en": "Thank you so much! I hope there's still a table.",
          "ko": "정말 고마워요! 아직 자리가 있으면 좋겠네요."
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend cancels because she's sick",
      "ko": "친구가 아파서 약속 취소"
    },
    "expressions": [
      "com certeza"
    ],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi... Estou com uma gripe forte, não vou conseguir ir hoje.",
        "gloss": {
          "en": "Hi... I have a bad flu, I won't be able to make it today.",
          "ko": "안녕... 독감이 심해서 오늘 못 갈 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Que pena! É importante que você descanse e beba muita água.",
        "gloss": {
          "en": "That's too bad! It's important that you rest and drink lots of water.",
          "ko": "안됐네요! 푹 쉬고 물 많이 마시는 게 중요해요."
        },
        "frames": [
          "pt-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Pode deixar. Desculpa por cancelar.",
        "gloss": {
          "en": "Will do. Sorry for canceling.",
          "ko": "그럴게요. 취소해서 미안해요."
        }
      },
      {
        "who": "me",
        "text": "Imagina! Espero que você melhore logo.",
        "gloss": {
          "en": "Don't worry about it! I hope you get better soon.",
          "ko": "별말을요! 빨리 낫길 바라요."
        },
        "frames": [
          "pt-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Obrigada. A gente pode remarcar para a semana que vem?",
        "gloss": {
          "en": "Thanks. Can we reschedule for next week?",
          "ko": "고마워요. 다음 주로 다시 잡을 수 있을까요?"
        }
      },
      {
        "who": "me",
        "text": "Com certeza. Eu te ligo na segunda para combinar.",
        "gloss": {
          "en": "Of course. I'll call you on Monday to set it up.",
          "ko": "물론이죠. 월요일에 전화해서 정할게요."
        },
        "frames": [
          "pt-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Combinado. Beijo!",
        "gloss": {
          "en": "Deal. Hugs!",
          "ko": "좋아요. 안녕!"
        }
      },
      {
        "who": "me",
        "text": "Beijo, se cuida!",
        "gloss": {
          "en": "Hugs, take care!",
          "ko": "안녕, 몸조심해요!"
        }
      }
    ]
  },
  {
    "id": "pt-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a coworker about holiday plans",
      "ko": "동료에게 연휴 계획 이야기하기"
    },
    "expressions": [
      "na minha opinião",
      "depende",
      "vale a pena",
      "fiquei sabendo",
      "pois é"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "E aí, o que vocês vão fazer no feriado?",
        "gloss": {
          "en": "So, what are you all doing for the holiday?",
          "ko": "연휴에 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "A gente vai alugar uma casa na serra com uns amigos.",
        "gloss": {
          "en": "We're going to rent a house in the mountains with some friends.",
          "ko": "친구들이랑 산에 있는 집을 빌릴 거예요."
        },
        "frames": [
          "pt-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Que delícia! Mas não vai ficar caro?",
        "gloss": {
          "en": "Sounds lovely! But won't it be expensive?",
          "ko": "좋겠다! 그런데 비싸지 않아요?"
        }
      },
      {
        "who": "me",
        "text": "Depende. Dividindo entre seis pessoas, vale a pena alugar uma casa grande.",
        "gloss": {
          "en": "It depends. Split among six people, it's worth renting a big house.",
          "ko": "상황에 따라 달라요. 여섯 명이 나누면 큰 집을 빌릴 만해요."
        },
        "frames": [
          "pt-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Faz sentido. E vocês vão de carro?",
        "gloss": {
          "en": "Makes sense. And are you going by car?",
          "ko": "그렇네요. 차로 가요?"
        }
      },
      {
        "who": "me",
        "text": "Na minha opinião, de carro é melhor, porque a estrada é linda.",
        "gloss": {
          "en": "In my opinion, by car is better, because the road is beautiful.",
          "ko": "제 생각엔 차가 나아요, 가는 길이 예쁘거든요."
        },
        "frames": [
          "pt-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Então leva bastante casaco, lá faz frio!",
        "gloss": {
          "en": "Then take plenty of jackets, it's cold up there!",
          "ko": "그럼 겉옷 넉넉히 챙겨요, 거기 추워요!"
        }
      },
      {
        "who": "me",
        "text": "Pois é, fiquei sabendo que à noite faz uns dez graus.",
        "gloss": {
          "en": "Right, I heard that it gets to about ten degrees at night.",
          "ko": "그러게요, 밤에는 십 도쯤 된다고 들었어요."
        },
        "frames": [
          "pt-f3-18"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the internet provider",
      "ko": "인터넷 회사에 전화하기"
    },
    "expressions": [
      "aconteceu um problema",
      "não está funcionando",
      "seria possível"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Central de atendimento, boa tarde. Qual é o problema?",
        "gloss": {
          "en": "Customer service, good afternoon. What's the problem?",
          "ko": "고객센터입니다, 안녕하세요. 어떤 문제가 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Boa tarde. Aconteceu um problema: o wi-fi não está funcionando desde ontem.",
        "gloss": {
          "en": "Good afternoon. There's a problem: the wi-fi hasn't been working since yesterday.",
          "ko": "안녕하세요. 문제가 생겼어요. 어제부터 와이파이가 안 돼요."
        },
        "frames": [
          "pt-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Entendo. Você já tentou desligar e ligar o modem?",
        "gloss": {
          "en": "I see. Have you tried turning the modem off and on?",
          "ko": "알겠습니다. 모뎀을 껐다 켜 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Já tentei duas vezes, e nada. Você poderia mandar um técnico?",
        "gloss": {
          "en": "I've tried twice, and nothing. Could you send a technician?",
          "ko": "두 번 해 봤는데 안 돼요. 기사님을 보내 주실 수 있을까요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Posso agendar para amanhã de manhã.",
        "gloss": {
          "en": "I can schedule it for tomorrow morning.",
          "ko": "내일 오전으로 잡아 드릴 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "De manhã eu trabalho. Seria possível vir depois das seis?",
        "gloss": {
          "en": "I work in the morning. Would it be possible to come after six?",
          "ko": "오전엔 일해요. 여섯 시 이후에 오실 수 있을까요?"
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Pode ser. O técnico liga antes de chegar.",
        "gloss": {
          "en": "That works. The technician will call before arriving.",
          "ko": "가능해요. 기사님이 도착 전에 전화드릴 거예요."
        }
      },
      {
        "who": "me",
        "text": "Perfeito, obrigado. Fico esperando.",
        "gloss": {
          "en": "Perfect, thanks. I'll be waiting.",
          "ko": "좋아요, 고맙습니다. 기다릴게요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Debating the best city to live in",
      "ko": "살기 좋은 도시 토론"
    },
    "expressions": [
      "eu acho que",
      "concordo",
      "não é bem assim",
      "no fim das contas"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eu acho que São Paulo é a melhor cidade para morar.",
        "gloss": {
          "en": "I think São Paulo is the best city to live in.",
          "ko": "저는 상파울루가 살기 제일 좋은 도시 같아요."
        }
      },
      {
        "who": "me",
        "text": "Não é bem assim, o trânsito lá é terrível.",
        "gloss": {
          "en": "It's not quite like that, the traffic there is terrible.",
          "ko": "꼭 그렇진 않아요, 거기 교통이 끔찍하잖아요."
        },
        "frames": [
          "pt-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Tá, mas tem muita coisa para fazer: restaurantes, shows...",
        "gloss": {
          "en": "Okay, but there's a lot to do: restaurants, shows...",
          "ko": "그렇긴 한데, 할 게 많잖아요. 식당, 공연..."
        }
      },
      {
        "who": "me",
        "text": "Concordo, a vida cultural lá é incrível.",
        "gloss": {
          "en": "I agree, the cultural life there is amazing.",
          "ko": "맞아요, 문화생활은 정말 대단해요."
        },
        "frames": [
          "pt-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Então? Você moraria lá?",
        "gloss": {
          "en": "So? Would you live there?",
          "ko": "그래서요? 거기 살 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Eu acho que não. No fim das contas, prefiro uma cidade mais tranquila.",
        "gloss": {
          "en": "I don't think so. In the end, I prefer a quieter city.",
          "ko": "아닐 것 같아요. 결국엔 좀 더 조용한 도시가 좋아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Tipo Florianópolis?",
        "gloss": {
          "en": "Like Florianópolis?",
          "ko": "플로리아노폴리스 같은 데요?"
        }
      },
      {
        "who": "me",
        "text": "Isso! É o lugar onde eu quero morar um dia.",
        "gloss": {
          "en": "Exactly! It's the place where I want to live someday.",
          "ko": "맞아요! 언젠가 살고 싶은 곳이에요."
        },
        "frames": [
          "pt-f3-12"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Office news about a colleague leaving",
      "ko": "동료가 회사를 떠난다는 소식"
    },
    "expressions": [
      "fiquei sabendo"
    ],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você já sabe da novidade?",
        "gloss": {
          "en": "Have you heard the news?",
          "ko": "소식 들었어요?"
        }
      },
      {
        "who": "me",
        "text": "Fiquei sabendo que a Ana vai sair da empresa. É verdade?",
        "gloss": {
          "en": "I heard that Ana is leaving the company. Is it true?",
          "ko": "아나가 회사를 그만둔다고 들었어요. 정말이에요?"
        },
        "frames": [
          "pt-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "É, sim. Ela vai morar fora.",
        "gloss": {
          "en": "Yes, it is. She's going to live abroad.",
          "ko": "네, 맞아요. 해외에서 살 거래요."
        }
      },
      {
        "who": "me",
        "text": "Que pena! Espero que ela seja muito feliz lá.",
        "gloss": {
          "en": "That's a shame! I hope she's very happy there.",
          "ko": "아쉽네요! 거기서 정말 행복하길 바라요."
        },
        "frames": [
          "pt-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Vamos fazer uma festinha de despedida na sexta?",
        "gloss": {
          "en": "Shall we throw a little farewell party on Friday?",
          "ko": "금요일에 작은 송별회 할까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa ideia. É importante que todo mundo assine o cartão.",
        "gloss": {
          "en": "Good idea. It's important that everyone signs the card.",
          "ko": "좋은 생각이에요. 다 같이 카드에 서명하는 게 중요해요."
        },
        "frames": [
          "pt-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Pode deixar, eu compro o cartão.",
        "gloss": {
          "en": "Leave it to me, I'll buy the card.",
          "ko": "맡겨 줘요, 카드는 제가 살게요."
        }
      },
      {
        "who": "me",
        "text": "Valeu! Eu te ligo amanhã para combinar o resto.",
        "gloss": {
          "en": "Thanks! I'll call you tomorrow to sort out the rest.",
          "ko": "고마워요! 나머지는 내일 전화해서 정해요."
        },
        "frames": [
          "pt-f3-09"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Running late for a dinner with friends",
      "ko": "친구들과 저녁 약속에 늦음"
    },
    "expressions": [
      "de repente",
      "ainda bem"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô? Cadê você? O jantar já começou!",
        "gloss": {
          "en": "Hello? Where are you? Dinner has already started!",
          "ko": "여보세요? 어디예요? 저녁 벌써 시작했어요!"
        }
      },
      {
        "who": "me",
        "text": "Desculpa! Eu estava no ônibus e, de repente, o pneu furou.",
        "gloss": {
          "en": "Sorry! I was on the bus and suddenly the tire went flat.",
          "ko": "미안해요! 버스를 타고 있었는데 갑자기 타이어가 펑크 났어요."
        },
        "frames": [
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Nossa! E agora?",
        "gloss": {
          "en": "Wow! What now?",
          "ko": "세상에! 이제 어떡해요?"
        }
      },
      {
        "who": "me",
        "text": "Estou esperando outro ônibus. Você poderia pedir para o pessoal começar sem mim?",
        "gloss": {
          "en": "I'm waiting for another bus. Could you ask everyone to start without me?",
          "ko": "다른 버스를 기다리고 있어요. 다들 먼저 시작하라고 말해 줄 수 있어요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Claro, sem problema. Você chega que horas?",
        "gloss": {
          "en": "Sure, no problem. What time will you get here?",
          "ko": "그럼요, 괜찮아요. 몇 시에 도착해요?"
        }
      },
      {
        "who": "me",
        "text": "Não sei ainda. Eu te ligo quando estiver perto.",
        "gloss": {
          "en": "I don't know yet. I'll call you when I'm close.",
          "ko": "아직 모르겠어요. 가까워지면 전화할게요."
        },
        "frames": [
          "pt-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Tá bom. Guardo um prato para você!",
        "gloss": {
          "en": "Okay. I'll save a plate for you!",
          "ko": "알겠어요. 한 접시 남겨 둘게요!"
        }
      },
      {
        "who": "me",
        "text": "Ainda bem! Valeu demais.",
        "gloss": {
          "en": "Thank goodness! Thanks so much.",
          "ko": "다행이다! 정말 고마워요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking for a book recommendation at a bookstore",
      "ko": "서점에서 책 추천받기"
    },
    "expressions": [
      "na minha opinião",
      "você me indica",
      "vale a pena"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "Oi, posso ajudar a encontrar alguma coisa?",
        "gloss": {
          "en": "Hi, can I help you find something?",
          "ko": "안녕하세요, 찾으시는 거 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Pode. Você me indica um livro brasileiro fácil de ler?",
        "gloss": {
          "en": "Yes. Can you recommend a Brazilian book that's easy to read?",
          "ko": "네. 읽기 쉬운 브라질 책 추천해 주실래요?"
        },
        "frames": [
          "pt-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Esse aqui é ótimo. São contos curtos.",
        "gloss": {
          "en": "This one is great. It's short stories.",
          "ko": "이거 좋아요. 짧은 단편들이에요."
        }
      },
      {
        "who": "me",
        "text": "Vale a pena ler para quem está aprendendo português?",
        "gloss": {
          "en": "Is it worth reading for someone learning Portuguese?",
          "ko": "포르투갈어 배우는 사람이 읽을 만해요?"
        },
        "frames": [
          "pt-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Com certeza, a linguagem é bem simples.",
        "gloss": {
          "en": "Definitely, the language is very simple.",
          "ko": "그럼요, 문장이 아주 쉬워요."
        }
      },
      {
        "who": "me",
        "text": "Na minha opinião, contos curtos são ótimos para estudar.",
        "gloss": {
          "en": "In my opinion, short stories are great for studying.",
          "ko": "제 생각엔 단편이 공부하기에 딱 좋아요."
        },
        "frames": [
          "pt-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Concordo! Quer uma sacola?",
        "gloss": {
          "en": "I agree! Do you want a bag?",
          "ko": "맞아요! 봉투 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Não precisa, obrigado.",
        "gloss": {
          "en": "No need, thank you.",
          "ko": "괜찮아요, 고마워요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Messaging the landlord about a broken shower",
      "ko": "집주인에게 고장 난 샤워기 알리기"
    },
    "expressions": [
      "não está funcionando",
      "seria possível"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi, tudo bem? Recebi sua mensagem.",
        "gloss": {
          "en": "Hi, how are you? I got your message.",
          "ko": "안녕하세요? 메시지 받았어요."
        }
      },
      {
        "who": "me",
        "text": "Oi! O chuveiro não está funcionando desde sábado.",
        "gloss": {
          "en": "Hi! The shower hasn't been working since Saturday.",
          "ko": "안녕하세요! 토요일부터 샤워기가 안 돼요."
        },
        "frames": [
          "pt-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Puxa, vou chamar um eletricista.",
        "gloss": {
          "en": "Oh no, I'll call an electrician.",
          "ko": "이런, 전기 기사를 부를게요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado. É importante que ele venha logo, porque está frio.",
        "gloss": {
          "en": "Thanks. It's important that he comes soon, because it's cold.",
          "ko": "고마워요. 날이 추워서 빨리 와 주시는 게 중요해요."
        },
        "frames": [
          "pt-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Ele pode ir na quinta à tarde.",
        "gloss": {
          "en": "He can come on Thursday afternoon.",
          "ko": "목요일 오후에 갈 수 있대요."
        }
      },
      {
        "who": "me",
        "text": "Seria possível vir antes? Quinta ainda está longe.",
        "gloss": {
          "en": "Would it be possible to come earlier? Thursday is still far off.",
          "ko": "더 일찍 오실 수 있을까요? 목요일은 아직 멀었어요."
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Vou ver se ele pode amanhã e te aviso.",
        "gloss": {
          "en": "I'll see if he can come tomorrow and let you know.",
          "ko": "내일 가능한지 알아보고 알려 줄게요."
        }
      },
      {
        "who": "me",
        "text": "Combinado. Espero que dê certo!",
        "gloss": {
          "en": "Okay. I hope it works out!",
          "ko": "알겠어요. 잘되면 좋겠어요!"
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Visiting your old school with a friend",
      "ko": "친구와 옛 학교에 가 봄"
    },
    "expressions": [
      "concordo",
      "vale a pena"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Lembra dessa escola? Nossa, quanto tempo!",
        "gloss": {
          "en": "Remember this school? Wow, it's been so long!",
          "ko": "이 학교 기억나요? 와, 진짜 오랜만이다!"
        }
      },
      {
        "who": "me",
        "text": "Claro! Quando eu era criança, eu vinha aqui todo dia de bicicleta.",
        "gloss": {
          "en": "Of course! When I was a kid, I came here every day by bike.",
          "ko": "당연하죠! 어렸을 때 매일 자전거 타고 여기 왔어요."
        },
        "frames": [
          "pt-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "E aquela sorveteria da esquina?",
        "gloss": {
          "en": "And that ice cream shop on the corner?",
          "ko": "그 모퉁이 아이스크림 가게는요?"
        }
      },
      {
        "who": "me",
        "text": "É o lugar onde a gente comprava sorvete depois da aula!",
        "gloss": {
          "en": "It's the place where we used to buy ice cream after class!",
          "ko": "우리가 수업 끝나고 아이스크림 사 먹던 곳이잖아요!"
        },
        "frames": [
          "pt-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Isso! Tudo mudou muito, né?",
        "gloss": {
          "en": "Right! Everything has changed a lot, hasn't it?",
          "ko": "맞아요! 많이 변했죠?"
        }
      },
      {
        "who": "me",
        "text": "Concordo, mas o bairro ainda é muito bonito.",
        "gloss": {
          "en": "I agree, but the neighborhood is still very pretty.",
          "ko": "맞아요, 그래도 동네는 여전히 정말 예뻐요."
        },
        "frames": [
          "pt-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Vamos tomar um sorvete pelos velhos tempos?",
        "gloss": {
          "en": "Shall we have an ice cream for old times' sake?",
          "ko": "옛날 생각하면서 아이스크림 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "Vamos! Vale a pena ver se ainda é tão bom.",
        "gloss": {
          "en": "Let's! It's worth seeing if it's still as good.",
          "ko": "좋아요! 아직도 그렇게 맛있는지 확인해 볼 만하죠."
        },
        "frames": [
          "pt-f3-13"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Booking a table at a restaurant by phone",
      "ko": "전화로 식당 예약하기"
    },
    "expressions": [
      "seria possível",
      "fiquei sabendo"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Restaurante Sabor da Terra, boa noite.",
        "gloss": {
          "en": "Sabor da Terra restaurant, good evening.",
          "ko": "사보르 다 테하 식당입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Boa noite. Seria possível reservar uma mesa para quatro pessoas no sábado?",
        "gloss": {
          "en": "Good evening. Would it be possible to book a table for four people on Saturday?",
          "ko": "안녕하세요. 토요일에 네 명 자리 예약할 수 있을까요?"
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Para que horas?",
        "gloss": {
          "en": "For what time?",
          "ko": "몇 시로요?"
        }
      },
      {
        "who": "me",
        "text": "A gente vai chegar umas oito horas.",
        "gloss": {
          "en": "We're going to arrive around eight.",
          "ko": "여덟 시쯤 도착할 거예요."
        },
        "frames": [
          "pt-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Perfeito, está reservado.",
        "gloss": {
          "en": "Perfect, it's booked.",
          "ko": "좋아요, 예약됐습니다."
        }
      },
      {
        "who": "me",
        "text": "Ótimo. Fiquei sabendo que vocês têm música ao vivo no sábado. É verdade?",
        "gloss": {
          "en": "Great. I heard that you have live music on Saturday. Is that true?",
          "ko": "좋아요. 토요일에 라이브 음악이 있다고 들었어요. 맞아요?"
        },
        "frames": [
          "pt-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Temos, sim, a partir das nove.",
        "gloss": {
          "en": "Yes, we do, from nine o'clock.",
          "ko": "네, 아홉 시부터 있어요."
        }
      },
      {
        "who": "me",
        "text": "Que legal! Espero que a gente consiga uma mesa perto do palco.",
        "gloss": {
          "en": "How nice! I hope we can get a table near the stage.",
          "ko": "좋네요! 무대 가까운 자리면 좋겠어요."
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Discussing working from home with a colleague",
      "ko": "동료와 재택근무 이야기"
    },
    "expressions": [
      "eu acho que",
      "na minha opinião",
      "com certeza",
      "concordo",
      "não é bem assim",
      "depende"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você prefere trabalhar em casa ou no escritório?",
        "gloss": {
          "en": "Do you prefer working from home or at the office?",
          "ko": "재택근무가 좋아요, 사무실 출근이 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "Na minha opinião, trabalhar em casa é mais produtivo.",
        "gloss": {
          "en": "In my opinion, working from home is more productive.",
          "ko": "제 생각엔 재택근무가 더 효율적이에요."
        },
        "frames": [
          "pt-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Sério? Eu acho que em casa a gente se distrai muito.",
        "gloss": {
          "en": "Really? I think we get distracted a lot at home.",
          "ko": "정말요? 저는 집에서는 딴짓을 많이 하게 되는 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Não é bem assim, depende da pessoa.",
        "gloss": {
          "en": "It's not quite like that, it depends on the person.",
          "ko": "꼭 그렇진 않아요, 사람마다 달라요."
        },
        "frames": [
          "pt-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Mas e o contato com a equipe?",
        "gloss": {
          "en": "But what about contact with the team?",
          "ko": "그럼 팀이랑 만나는 건요?"
        }
      },
      {
        "who": "me",
        "text": "Concordo, isso faz falta. É importante que a equipe se encontre às vezes.",
        "gloss": {
          "en": "I agree, that's missing. It's important that the team meets sometimes.",
          "ko": "맞아요, 그건 아쉬워요. 팀이 가끔은 만나는 게 중요해요."
        },
        "frames": [
          "pt-f3-16",
          "pt-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Então, uma vez por semana no escritório?",
        "gloss": {
          "en": "So, once a week at the office?",
          "ko": "그럼 일주일에 한 번 사무실 출근?"
        }
      },
      {
        "who": "me",
        "text": "Com certeza! Eu acho que é o melhor dos dois mundos.",
        "gloss": {
          "en": "Definitely! I think it's the best of both worlds.",
          "ko": "좋아요! 그게 둘의 장점을 다 살리는 것 같아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a travel story at dinner",
      "ko": "저녁 자리에서 여행 이야기"
    },
    "expressions": [
      "com certeza",
      "vale a pena",
      "de repente",
      "no fim das contas",
      "ainda bem"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Como foi a viagem para a Chapada?",
        "gloss": {
          "en": "How was the trip to Chapada?",
          "ko": "샤파다 여행은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Foi incrível, mas teve um susto. Eu estava descendo a trilha quando começou a chover.",
        "gloss": {
          "en": "It was amazing, but there was a scare. I was going down the trail when it started raining.",
          "ko": "정말 좋았는데, 놀란 일이 있었어요. 산길을 내려가고 있는데 비가 오기 시작했어요."
        },
        "frames": [
          "pt-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Nossa! E aí?",
        "gloss": {
          "en": "Wow! And then?",
          "ko": "세상에! 그래서요?"
        }
      },
      {
        "who": "me",
        "text": "De repente, o rio ficou cheio e a gente teve que esperar.",
        "gloss": {
          "en": "Suddenly, the river got full and we had to wait.",
          "ko": "갑자기 강물이 불어나서 기다려야 했어요."
        },
        "frames": [
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Que medo! Vocês ficaram bem?",
        "gloss": {
          "en": "How scary! Were you all okay?",
          "ko": "무서웠겠다! 다들 괜찮았어요?"
        }
      },
      {
        "who": "me",
        "text": "Ficamos. Ainda bem que o guia conhecia um caminho seguro.",
        "gloss": {
          "en": "We were. Thank goodness the guide knew a safe way.",
          "ko": "네. 다행히 가이드가 안전한 길을 알고 있었어요."
        }
      },
      {
        "who": "them",
        "text": "Você voltaria lá?",
        "gloss": {
          "en": "Would you go back there?",
          "ko": "거기 또 갈 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Com certeza! No fim das contas, vale a pena ir com guia.",
        "gloss": {
          "en": "Definitely! In the end, it's worth going with a guide.",
          "ko": "그럼요! 결국 가이드랑 같이 갈 만한 가치가 있어요."
        },
        "frames": [
          "pt-f3-13"
        ]
      }
    ]
  },
  {
    "id": "pt-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Rescheduling a dentist appointment",
      "ko": "치과 예약 바꾸기"
    },
    "expressions": [
      "eu acho que",
      "aconteceu um problema",
      "seria possível"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Clínica Sorriso, bom dia.",
        "gloss": {
          "en": "Sorriso Clinic, good morning.",
          "ko": "소히주 치과입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Bom dia. Aconteceu um problema e eu não posso ir amanhã. Seria possível mudar a consulta?",
        "gloss": {
          "en": "Good morning. Something came up and I can't come tomorrow. Would it be possible to change the appointment?",
          "ko": "안녕하세요. 일이 생겨서 내일 못 가요. 예약을 바꿀 수 있을까요?"
        },
        "frames": [
          "pt-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Claro. Que dia é melhor para você?",
        "gloss": {
          "en": "Of course. Which day is better for you?",
          "ko": "물론이죠. 언제가 편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Você poderia ver se tem horário na sexta de manhã?",
        "gloss": {
          "en": "Could you check if there's a slot on Friday morning?",
          "ko": "금요일 오전에 자리 있는지 봐 주실 수 있어요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Tenho às nove ou às onze.",
        "gloss": {
          "en": "I have nine or eleven.",
          "ko": "아홉 시나 열한 시가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Às nove, por favor. Eu acho que às onze vou estar no trabalho.",
        "gloss": {
          "en": "Nine, please. I think at eleven I'll be at work.",
          "ko": "아홉 시로 해 주세요. 열한 시엔 회사에 있을 것 같아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Anotado. Qualquer coisa, é só ligar.",
        "gloss": {
          "en": "Noted. If anything comes up, just call.",
          "ko": "적어 뒀어요. 무슨 일 있으면 전화 주세요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Até sexta.",
        "gloss": {
          "en": "Thank you! See you Friday.",
          "ko": "고맙습니다! 금요일에 봬요."
        }
      }
    ]
  },
  {
    "id": "pt-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The wrong pizza was delivered",
      "ko": "피자가 잘못 배달됨"
    },
    "expressions": [
      "eu acho que",
      "dá para trocar",
      "fazer o quê"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite! Entrega para o apartamento quarenta e dois.",
        "gloss": {
          "en": "Good evening! Delivery for apartment forty-two.",
          "ko": "안녕하세요! 사십이 호 배달이에요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Hum, eu acho que essa pizza não é a minha.",
        "gloss": {
          "en": "Thanks! Hmm, I think this pizza isn't mine.",
          "ko": "고마워요! 음, 이 피자 제 것이 아닌 것 같아요."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Sério? Aqui diz pizza de frango.",
        "gloss": {
          "en": "Really? It says chicken pizza here.",
          "ko": "정말요? 여기엔 치킨 피자라고 적혀 있어요."
        }
      },
      {
        "who": "me",
        "text": "Eu pedi de calabresa. Dá para trocar essa pizza?",
        "gloss": {
          "en": "I ordered pepperoni. Can I exchange this pizza?",
          "ko": "저는 칼라브레자를 시켰어요. 이 피자 바꿀 수 있어요?"
        },
        "frames": [
          "pt-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Vou ligar para o restaurante... Eles vão mandar outra em vinte minutos.",
        "gloss": {
          "en": "I'll call the restaurant... They'll send another one in twenty minutes.",
          "ko": "식당에 전화해 볼게요... 이십 분 안에 다른 걸 보내 준대요."
        }
      },
      {
        "who": "me",
        "text": "Fazer o quê. Espero que a outra chegue quente.",
        "gloss": {
          "en": "Oh well. I hope the other one arrives hot.",
          "ko": "어쩔 수 없죠. 다른 건 따뜻하게 오면 좋겠네요."
        },
        "frames": [
          "pt-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Pode deixar, eles vão caprichar. Desculpa pelo problema!",
        "gloss": {
          "en": "Don't worry, they'll do it right. Sorry for the trouble!",
          "ko": "걱정 마세요, 잘 챙겨 줄 거예요. 불편 드려 죄송해요!"
        }
      },
      {
        "who": "me",
        "text": "Imagina, não é culpa sua. Valeu!",
        "gloss": {
          "en": "Don't worry, it's not your fault. Thanks!",
          "ko": "별말을요, 기사님 잘못도 아닌데요. 고마워요!"
        }
      }
    ]
  }
];
