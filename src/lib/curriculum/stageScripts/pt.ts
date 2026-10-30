import type { StageScript } from "../stageScripts.ts";

/** pt 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~5단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const PT: StageScript[] = [
  {
    "id": "pt-1-1",
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
    "situation": 0,
    "setting": {
      "en": "A language exchange meetup in Rio: meeting Lucas for the first time",
      "ko": "리우의 언어 교환 모임에서 루카스를 처음 만남"
    },
    "expressions": [
      "tudo bem",
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
        "text": "Oi! Tudo bem? Meu nome é Lucas.",
        "gloss": {
          "en": "Hi! How are you? My name is Lucas.",
          "ko": "안녕! 잘 지내? 내 이름은 루카스야."
        }
      },
      {
        "who": "me",
        "text": "Tudo bem! Meu nome é Ji-woo. Prazer.",
        "gloss": {
          "en": "Good! My name is Ji-woo. Nice to meet you.",
          "ko": "잘 지내! 내 이름은 지우야. 반가워."
        },
        "frames": [
          "pt-f1-01",
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Prazer! Você é de onde?",
        "gloss": {
          "en": "Nice to meet you! Where are you from?",
          "ko": "반가워! 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "Eu sou coreano. Sou de Seul.",
        "gloss": {
          "en": "I'm Korean. I'm from Seoul.",
          "ko": "나는 한국 사람이야. 서울 출신이야."
        },
        "frames": [
          "pt-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! E você mora aqui no Rio?",
        "gloss": {
          "en": "Cool! And do you live here in Rio?",
          "ko": "멋지다! 그럼 여기 리우에 살아?"
        }
      },
      {
        "who": "me",
        "text": "Moro, sim. Eu trabalho em um hotel.",
        "gloss": {
          "en": "Yes, I do. I work at a hotel.",
          "ko": "응, 살아. 호텔에서 일해."
        },
        "frames": [
          "pt-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "E o português? Você fala bem!",
        "gloss": {
          "en": "And your Portuguese? You speak well!",
          "ko": "포르투갈어는? 잘하네!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Mas eu não falo muito bem ainda.",
        "gloss": {
          "en": "Thanks! But I don't speak very well yet.",
          "ko": "고마워! 근데 아직 잘 못해."
        },
        "frames": [
          "pt-f1-12"
        ]
      }
    ]
  },
  {
    "id": "pt-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Early morning at a padaria (bakery) counter in São Paulo",
      "ko": "상파울루의 빵집(padaria) 카운터, 이른 아침"
    },
    "expressions": [
      "bom dia",
      "me vê um",
      "por favor",
      "quanto custa",
      "obrigada",
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
          "en": "Good morning! What'll it be?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia! Me vê um pão de queijo, por favor.",
        "gloss": {
          "en": "Good morning! Can I get a cheese bread, please?",
          "ko": "안녕하세요! 치즈빵 하나 주세요."
        },
        "frames": [
          "pt-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Só um? Quer mais alguma coisa?",
        "gloss": {
          "en": "Just one? Anything else?",
          "ko": "하나만요? 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Quero um café com leite também.",
        "gloss": {
          "en": "I'd like a coffee with milk too.",
          "ko": "카페라테도 한 잔 주세요."
        },
        "frames": [
          "pt-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Pequeno ou grande?",
        "gloss": {
          "en": "Small or large?",
          "ko": "작은 걸로요, 큰 걸로요?"
        }
      },
      {
        "who": "me",
        "text": "Pequeno. Quanto custa?",
        "gloss": {
          "en": "Small. How much is it?",
          "ko": "작은 걸로요. 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Dá doze reais.",
        "gloss": {
          "en": "That comes to twelve reais.",
          "ko": "12헤알입니다."
        }
      },
      {
        "who": "me",
        "text": "Aqui está. Obrigada! Tchau!",
        "gloss": {
          "en": "Here you go. Thank you! Bye!",
          "ko": "여기요. 감사합니다! 안녕히 계세요!"
        },
        "frames": [
          "pt-f1-18"
        ]
      }
    ]
  },
  {
    "id": "pt-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a station worker for directions in the São Paulo metro",
      "ko": "상파울루 지하철역에서 역무원에게 길 묻기"
    },
    "expressions": [
      "boa tarde",
      "com licença",
      "onde fica",
      "desculpa",
      "não entendi",
      "pode repetir",
      "mais devagar",
      "quanto custa",
      "obrigado",
      "até logo"
    ],
    "grammar": [
      2,
      4
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
        "text": "Boa tarde! Com licença, onde fica a Avenida Paulista?",
        "gloss": {
          "en": "Good afternoon! Excuse me, where is Paulista Avenue?",
          "ko": "안녕하세요! 실례지만 파울리스타 대로가 어디예요?"
        },
        "frames": [
          "pt-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Você pega a linha verde, sentido Vila Madalena, e desce na estação Consolação.",
        "gloss": {
          "en": "You take the green line toward Vila Madalena and get off at Consolação station.",
          "ko": "초록색 노선을 빌라 마달레나 방향으로 타고 콘솔라상역에서 내리세요."
        }
      },
      {
        "who": "me",
        "text": "Desculpa, não entendi. Pode repetir mais devagar?",
        "gloss": {
          "en": "Sorry, I didn't get that. Can you repeat it more slowly?",
          "ko": "죄송해요, 못 알아들었어요. 더 천천히 다시 말해 주시겠어요?"
        },
        "frames": [
          "pt-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Claro. Linha verde. Estação Consolação.",
        "gloss": {
          "en": "Sure. Green line. Consolação station.",
          "ko": "그럼요. 초록색 노선. 콘솔라상역."
        }
      },
      {
        "who": "me",
        "text": "Linha verde, estação Consolação. Quanto custa a passagem?",
        "gloss": {
          "en": "Green line, Consolação station. How much is the ticket?",
          "ko": "초록색 노선, 콘솔라상역. 표는 얼마예요?"
        },
        "frames": [
          "pt-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Cinco reais e quarenta. A bilheteria fica ali.",
        "gloss": {
          "en": "Five reais forty. The ticket office is over there.",
          "ko": "5헤알 40센타부예요. 매표소는 저쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Até logo!",
        "gloss": {
          "en": "Thank you! See you!",
          "ko": "감사합니다! 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "pt-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "In the building's elevator at night with a neighbor",
      "ko": "밤에 아파트 엘리베이터에서 이웃과"
    },
    "expressions": [
      "boa noite",
      "tudo bem",
      "não sei",
      "obrigado",
      "até logo"
    ],
    "grammar": [
      0,
      1,
      3,
      6,
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
        "text": "Boa noite! Tudo bem, e você?",
        "gloss": {
          "en": "Good evening! I'm good, and you?",
          "ko": "안녕하세요! 잘 지내요, 그쪽은요?"
        },
        "frames": [
          "pt-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo ótimo. Você é o novo vizinho do quinto andar?",
        "gloss": {
          "en": "All great. Are you the new neighbor on the fifth floor?",
          "ko": "아주 좋아요. 5층에 새로 이사 온 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "Sou, sim. Eu moro no apartamento cinquenta e dois.",
        "gloss": {
          "en": "Yes, I am. I live in apartment fifty-two.",
          "ko": "네, 맞아요. 52호에 살아요."
        },
        "frames": [
          "pt-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Bem-vindo! Está tudo bem com o apartamento?",
        "gloss": {
          "en": "Welcome! Is everything OK with the apartment?",
          "ko": "환영해요! 집은 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "Está, sim. Mas não tenho internet ainda.",
        "gloss": {
          "en": "Yes, it is. But I don't have internet yet.",
          "ko": "네, 괜찮아요. 근데 아직 인터넷이 없어요."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Ah, fala com o síndico, o seu Antônio. Ele resolve.",
        "gloss": {
          "en": "Oh, talk to the building manager, Mr. Antônio. He'll sort it out.",
          "ko": "아, 관리인 안토니우 씨한테 말해 봐요. 그분이 해결해 줘요."
        }
      },
      {
        "who": "me",
        "text": "Ah, não sei quem é. Mas obrigado! Até logo!",
        "gloss": {
          "en": "Oh, I don't know who that is. But thanks! See you!",
          "ko": "아, 누군지 모르겠어요. 그래도 고마워요! 또 봬요!"
        }
      }
    ]
  },
  {
    "id": "pt-1-x1",
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
    "setting": {
      "en": "In class, lending a pen to a classmate",
      "ko": "수업 중 반 친구에게 펜 빌려주기"
    },
    "expressions": [
      "de nada",
      "prazer"
    ],
    "grammar": [
      0,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi! Você tem uma caneta?",
        "gloss": {
          "en": "Hi! Do you have a pen?",
          "ko": "안녕! 펜 있어?"
        }
      },
      {
        "who": "me",
        "text": "Tenho, sim. Aqui está.",
        "gloss": {
          "en": "Yes, I do. Here you go.",
          "ko": "응, 있어. 여기."
        },
        "frames": [
          "pt-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Obrigada!",
        "gloss": {
          "en": "Thanks!",
          "ko": "고마워!"
        }
      },
      {
        "who": "me",
        "text": "De nada! Como você se chama?",
        "gloss": {
          "en": "You're welcome! What's your name?",
          "ko": "천만에! 이름이 뭐야?"
        }
      },
      {
        "who": "them",
        "text": "Eu sou a Ana. E você?",
        "gloss": {
          "en": "I'm Ana. And you?",
          "ko": "나는 아나야. 너는?"
        }
      },
      {
        "who": "me",
        "text": "Eu sou o Ji-woo. Prazer!",
        "gloss": {
          "en": "I'm Ji-woo. Nice to meet you!",
          "ko": "나는 지우야. 반가워!"
        }
      }
    ]
  },
  {
    "id": "pt-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Monday morning at the office coffee machine with your coworker Bruno",
      "ko": "월요일 아침 회사 커피 머신 앞에서 동료 브루누와"
    },
    "expressions": [
      "e aí",
      "beleza",
      "fim de semana",
      "tô cansado",
      "de vez em quando",
      "combinado"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "earlierGrammar": [
      "1:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "E aí, beleza? Como foi o fim de semana?",
        "gloss": {
          "en": "Hey, all good? How was the weekend?",
          "ko": "어이, 잘 지내? 주말 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "E aí! Beleza. Meu fim de semana foi ótimo. No sábado eu fui à praia.",
        "gloss": {
          "en": "Hey! All good. My weekend was great. On Saturday I went to the beach.",
          "ko": "어이! 잘 지내. 주말 최고였어. 토요일에 해변에 갔어."
        },
        "frames": [
          "pt-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Que delícia! E fez o quê lá?",
        "gloss": {
          "en": "Lovely! And what did you do there?",
          "ko": "좋았겠다! 거기서 뭐 했어?"
        }
      },
      {
        "who": "me",
        "text": "Joguei vôlei com uns amigos e almocei na praia.",
        "gloss": {
          "en": "I played volleyball with some friends and had lunch on the beach.",
          "ko": "친구들이랑 배구하고 해변에서 점심 먹었어."
        }
      },
      {
        "who": "them",
        "text": "Nossa, que bom! Eu fiquei em casa. E no domingo?",
        "gloss": {
          "en": "Wow, nice! I stayed home. And on Sunday?",
          "ko": "와, 좋네! 난 집에 있었어. 일요일엔?"
        }
      },
      {
        "who": "me",
        "text": "No domingo eu fiz um churrasco. Agora tô cansado!",
        "gloss": {
          "en": "On Sunday I had a barbecue. Now I'm tired!",
          "ko": "일요일엔 바비큐 했어. 그래서 지금 피곤해!"
        },
        "frames": [
          "pt-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Ha, imagino. Você gosta de cozinhar?",
        "gloss": {
          "en": "Ha, I can imagine. Do you like cooking?",
          "ko": "하하, 그렇겠다. 요리하는 거 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Gosto muito de cozinhar. De vez em quando eu faço churrasco.",
        "gloss": {
          "en": "I really like cooking. Every now and then I make a barbecue.",
          "ko": "요리 정말 좋아해. 가끔 바비큐도 해."
        },
        "frames": [
          "pt-f2-05",
          "pt-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Que legal! Então no próximo você me chama, hein?",
        "gloss": {
          "en": "Cool! So invite me to the next one, OK?",
          "ko": "좋다! 그럼 다음엔 나도 불러, 알았지?"
        }
      },
      {
        "who": "me",
        "text": "Combinado! Vou fazer outro no mês que vem.",
        "gloss": {
          "en": "Deal! I'm going to have another one next month.",
          "ko": "좋아! 다음 달에 또 할 거야."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "At a neighborhood pharmacy with a sore throat",
      "ko": "목이 아파서 동네 약국에서"
    },
    "expressions": [
      "estou com dor de",
      "ontem à noite",
      "tem remédio para",
      "tanto faz",
      "valeu"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "earlierGrammar": [
      "1:1"
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
        "text": "Boa tarde. Estou com dor de garganta desde ontem à noite.",
        "gloss": {
          "en": "Good afternoon. I've had a sore throat since last night.",
          "ko": "안녕하세요. 어젯밤부터 목이 아파요."
        },
        "frames": [
          "pt-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Você está com febre também?",
        "gloss": {
          "en": "Do you have a fever too?",
          "ko": "열도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Não, só a garganta. Ontem eu falei muito no trabalho.",
        "gloss": {
          "en": "No, just my throat. Yesterday I talked a lot at work.",
          "ko": "아니요, 목만요. 어제 회사에서 말을 많이 했어요."
        },
        "frames": [
          "pt-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Entendi. Está tomando algum remédio?",
        "gloss": {
          "en": "I see. Are you taking any medicine?",
          "ko": "그렇군요. 드시는 약 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Não. Tem remédio para dor de garganta sem receita?",
        "gloss": {
          "en": "No. Do you have something for a sore throat without a prescription?",
          "ko": "아니요. 처방전 없이 살 수 있는 목 아픈 약 있어요?"
        },
        "frames": [
          "pt-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Tem, sim. Essa pastilha é boa, e esse spray é mais forte.",
        "gloss": {
          "en": "Yes, we do. This lozenge is good, and this spray is stronger.",
          "ko": "네, 있어요. 이 목캔디형 약도 좋고, 이 스프레이는 더 강해요."
        }
      },
      {
        "who": "me",
        "text": "O spray é mais caro do que a pastilha?",
        "gloss": {
          "en": "Is the spray more expensive than the lozenge?",
          "ko": "스프레이가 목캔디형 약보다 비싸요?"
        },
        "frames": [
          "pt-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Um pouco. A pastilha custa quinze e o spray vinte e dois.",
        "gloss": {
          "en": "A little. The lozenge is fifteen and the spray is twenty-two.",
          "ko": "조금요. 목캔디형은 15헤알, 스프레이는 22헤알이에요."
        }
      },
      {
        "who": "me",
        "text": "Tanto faz o preço. Vou levar o spray. Valeu!",
        "gloss": {
          "en": "The price doesn't matter. I'll take the spray. Thanks!",
          "ko": "가격은 상관없어요. 스프레이로 할게요. 고마워요!"
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "At the ticket counter of the Tietê bus station",
      "ko": "치에테 버스 터미널 매표소에서"
    },
    "expressions": [
      "ida e volta",
      "que horas são",
      "quanto tempo leva",
      "a que horas"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia. Para onde?",
        "gloss": {
          "en": "Good morning. Where to?",
          "ko": "안녕하세요. 어디로 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia. Uma passagem para Santos, ida e volta, por favor.",
        "gloss": {
          "en": "Good morning. A round-trip ticket to Santos, please.",
          "ko": "안녕하세요. 산투스 왕복표 한 장 주세요."
        }
      },
      {
        "who": "them",
        "text": "Para hoje? Tem ônibus às dez e às onze e meia.",
        "gloss": {
          "en": "For today? There are buses at ten and at eleven thirty.",
          "ko": "오늘 거요? 10시하고 11시 반에 버스가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Que horas são agora?",
        "gloss": {
          "en": "What time is it now?",
          "ko": "지금 몇 시예요?"
        }
      },
      {
        "who": "them",
        "text": "São nove e quarenta.",
        "gloss": {
          "en": "It's nine forty.",
          "ko": "9시 40분이에요."
        }
      },
      {
        "who": "me",
        "text": "Então às dez. Quanto tempo leva a viagem?",
        "gloss": {
          "en": "Then at ten. How long does the trip take?",
          "ko": "그럼 10시 걸로요. 가는 데 얼마나 걸려요?"
        },
        "frames": [
          "pt-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Mais ou menos uma hora e meia. Volta quando?",
        "gloss": {
          "en": "About an hour and a half. When are you coming back?",
          "ko": "한 시간 반 정도요. 언제 돌아오세요?"
        }
      },
      {
        "who": "me",
        "text": "Vou voltar amanhã. A que horas sai o último ônibus?",
        "gloss": {
          "en": "I'm going to come back tomorrow. What time does the last bus leave?",
          "ko": "내일 돌아올 거예요. 마지막 버스는 몇 시에 출발해요?"
        },
        "frames": [
          "pt-f2-03",
          "pt-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "O último sai às nove da noite. Janela ou corredor?",
        "gloss": {
          "en": "The last one leaves at nine p.m. Window or aisle?",
          "ko": "마지막 차는 밤 9시에 출발해요. 창가요, 통로요?"
        }
      },
      {
        "who": "me",
        "text": "Janela, por favor. Faz um ano que eu não vejo o mar!",
        "gloss": {
          "en": "Window, please. I haven't seen the sea in a year!",
          "ko": "창가로 주세요. 바다 못 본 지 1년 됐거든요!"
        },
        "frames": [
          "pt-f2-08"
        ]
      }
    ]
  },
  {
    "id": "pt-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Texting your friend Carol on WhatsApp to plan a movie night",
      "ko": "왓츠앱으로 친구 카롤과 영화 보러 갈 약속 잡기"
    },
    "expressions": [
      "vamos sim",
      "que legal",
      "pode ser",
      "que pena",
      "fica pra próxima",
      "combinado",
      "até amanhã"
    ],
    "grammar": [
      1,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "E aí, tudo certo? Vamos ver um filme amanhã?",
        "gloss": {
          "en": "Hey, all good? Shall we see a movie tomorrow?",
          "ko": "야, 잘 지내? 내일 영화 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Vamos sim! Que legal. Qual filme?",
        "gloss": {
          "en": "Yes, let's! Cool. Which movie?",
          "ko": "그래, 보자! 좋다. 무슨 영화?"
        },
        "frames": [
          "pt-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Tem aquele de terror novo. Ou a comédia brasileira.",
        "gloss": {
          "en": "There's that new horror one. Or the Brazilian comedy.",
          "ko": "새로 나온 공포 영화가 있어. 아니면 브라질 코미디."
        }
      },
      {
        "who": "me",
        "text": "Eu gosto mais de comédia do que de terror.",
        "gloss": {
          "en": "I like comedy more than horror.",
          "ko": "난 공포보다 코미디가 더 좋아."
        },
        "frames": [
          "pt-f2-05",
          "pt-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Fechado, comédia. Tem sessão às sete e às nove.",
        "gloss": {
          "en": "Done, comedy. There are showings at seven and at nine.",
          "ko": "좋아, 코미디. 7시랑 9시에 상영해."
        }
      },
      {
        "who": "me",
        "text": "Às sete eu ainda estou trabalhando. Pode ser às nove?",
        "gloss": {
          "en": "At seven I'll still be working. Can we make it nine?",
          "ko": "7시엔 아직 일하고 있어. 9시 괜찮아?"
        },
        "frames": [
          "pt-f2-04",
          "pt-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Pode. Ah, e o Pedro vai também? Ele adora comédia.",
        "gloss": {
          "en": "Sure. Oh, and is Pedro coming too? He loves comedies.",
          "ko": "좋아. 아, 페드루도 와? 걔 코미디 엄청 좋아하잖아."
        }
      },
      {
        "who": "me",
        "text": "Que pena, ele não pode. Ele foi para Curitiba. Fica pra próxima!",
        "gloss": {
          "en": "Too bad, he can't. He went to Curitiba. Next time!",
          "ko": "아쉽게도 걔는 못 와. 쿠리치바에 갔거든. 다음에 같이 보자!"
        },
        "frames": [
          "pt-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Tudo bem. Então nove horas, na frente do shopping?",
        "gloss": {
          "en": "OK. So nine o'clock, in front of the mall?",
          "ko": "알았어. 그럼 9시에 쇼핑몰 앞에서?"
        }
      },
      {
        "who": "me",
        "text": "Combinado! Até amanhã!",
        "gloss": {
          "en": "Deal! See you tomorrow!",
          "ko": "좋아! 내일 봐!"
        }
      }
    ]
  },
  {
    "id": "pt-2-x1",
    "stage": 2,
    "setting": {
      "en": "A new friend asks how long you've lived in Rio",
      "ko": "새 친구가 리우에 산 지 얼마나 됐는지 물어봄"
    },
    "expressions": [
      "nossa",
      "fim de semana"
    ],
    "grammar": [
      0,
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você mora aqui há muito tempo?",
        "gloss": {
          "en": "Have you lived here long?",
          "ko": "여기 산 지 오래됐어?"
        }
      },
      {
        "who": "me",
        "text": "Moro aqui faz dois anos. Cheguei em março.",
        "gloss": {
          "en": "I've lived here for two years. I arrived in March.",
          "ko": "여기 산 지 2년 됐어. 3월에 왔어."
        },
        "frames": [
          "pt-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "E já foi ao Pão de Açúcar?",
        "gloss": {
          "en": "And have you been to Sugarloaf Mountain yet?",
          "ko": "빵지아수카르 산에는 가 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Fui há um mês. Nossa, que lugar lindo!",
        "gloss": {
          "en": "I went a month ago. Wow, what a beautiful place!",
          "ko": "한 달 전에 갔어. 와, 정말 아름다운 곳이더라!"
        },
        "frames": [
          "pt-f2-02",
          "pt-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "E o Cristo Redentor?",
        "gloss": {
          "en": "And Christ the Redeemer?",
          "ko": "그럼 예수상은?"
        }
      },
      {
        "who": "me",
        "text": "Ainda não. Vou visitar no fim de semana.",
        "gloss": {
          "en": "Not yet. I'm going to visit on the weekend.",
          "ko": "아직. 주말에 가 볼 거야."
        },
        "frames": [
          "pt-f2-03"
        ]
      }
    ]
  },
  {
    "id": "pt-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Chatting with your friend Júlia about a new detective series everyone is watching",
      "ko": "모두가 보는 새 탐정 시리즈에 대해 친구 줄리아와 수다"
    },
    "expressions": [
      "sem spoiler",
      "eu acho que",
      "não é bem assim",
      "na minha opinião",
      "pois é",
      "com certeza",
      "tomara"
    ],
    "grammar": [
      0,
      2,
      5,
      6
    ],
    "earlierGrammar": [
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você já começou a ver aquela série nova de detetive?",
        "gloss": {
          "en": "Have you started watching that new detective series yet?",
          "ko": "그 새 탐정 시리즈 보기 시작했어?"
        }
      },
      {
        "who": "me",
        "text": "Comecei ontem! Mas sem spoiler, por favor, ainda estou no terceiro episódio.",
        "gloss": {
          "en": "I started yesterday! But no spoilers, please, I'm still on episode three.",
          "ko": "어제 시작했어! 근데 스포는 하지 마, 아직 3화야."
        }
      },
      {
        "who": "them",
        "text": "Tá bom, prometo. E aí, o que você está achando?",
        "gloss": {
          "en": "OK, I promise. So, what do you think so far?",
          "ko": "알았어, 약속할게. 그래서, 어때?"
        },
        "alt": [
          {
            "text": "Tá, não falo nada. E aí, está gostando?",
            "gloss": {
              "en": "OK, I won't say a thing. So, are you enjoying it?",
              "ko": "알았어, 아무 말 안 할게. 그래서, 재밌어?"
            }
          },
          {
            "text": "Beleza. E o que você achou até agora?",
            "gloss": {
              "en": "Fine. And what have you thought of it so far?",
              "ko": "좋아. 지금까지 어떤 것 같아?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Eu acho que a história é ótima, mas o começo é um pouco lento.",
        "gloss": {
          "en": "I think the story is great, but the beginning is a bit slow.",
          "ko": "이야기는 정말 좋은데, 시작이 좀 느린 것 같아."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Sério? Para mim o primeiro episódio já foi incrível.",
        "gloss": {
          "en": "Really? For me the first episode was already amazing.",
          "ko": "진짜? 난 1화부터 대박이었는데."
        }
      },
      {
        "who": "me",
        "text": "Não é bem assim. Na minha opinião, o segundo é muito melhor.",
        "gloss": {
          "en": "Not quite. In my opinion, the second one is much better.",
          "ko": "꼭 그렇진 않아. 내 생각엔 2화가 훨씬 나아."
        },
        "frames": [
          "pt-f3-17",
          "pt-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Pode ser. E a atriz principal? Ela era de novela, né?",
        "gloss": {
          "en": "Could be. And the lead actress? She used to be in soap operas, right?",
          "ko": "그럴 수도. 주인공 배우는? 원래 드라마 배우였지?"
        },
        "alt": [
          {
            "text": "E a protagonista? Ela fazia novela antes, não fazia?",
            "gloss": {
              "en": "And the main character's actress? She used to do soap operas, didn't she?",
              "ko": "주인공은? 예전에 드라마 했었지, 그치?"
            }
          },
          {
            "text": "Você sabia que a atriz principal começou na novela?",
            "gloss": {
              "en": "Did you know the lead actress started out in soap operas?",
              "ko": "주인공 배우가 드라마로 데뷔한 거 알았어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Pois é! Quando eu era criança, minha avó assistia todas as novelas que ela fazia.",
        "gloss": {
          "en": "Exactly! When I was a kid, my grandma watched every soap opera she was in.",
          "ko": "그러니까! 어렸을 때 우리 할머니가 그 배우 나오는 드라마는 다 보셨어."
        },
        "frames": [
          "pt-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Que fofo. Então vale a pena continuar?",
        "gloss": {
          "en": "That's sweet. So is it worth continuing?",
          "ko": "귀엽다. 그럼 계속 볼 만해?"
        }
      },
      {
        "who": "me",
        "text": "Com certeza. E tomara que a segunda temporada saia logo.",
        "gloss": {
          "en": "Definitely. And hopefully the second season comes out soon.",
          "ko": "당연하지. 시즌 2도 빨리 나왔으면 좋겠다."
        }
      },
      {
        "who": "them",
        "text": "Dizem que já estão gravando a segunda temporada.",
        "gloss": {
          "en": "They say they're already filming the second season.",
          "ko": "벌써 시즌 2 촬영 중이래."
        }
      },
      {
        "who": "me",
        "text": "Sério? Então a gente pode ver juntos quando sair!",
        "gloss": {
          "en": "Really? Then we can watch it together when it comes out!",
          "ko": "진짜? 그럼 나오면 우리 같이 보자!"
        },
        "frames": [
          "pt-f3-11"
        ]
      }
    ]
  },
  {
    "id": "pt-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling the hotel front desk at night because the air conditioner stopped working",
      "ko": "밤에 에어컨이 멈춰서 호텔 프런트에 전화하기"
    },
    "expressions": [
      "aconteceu um problema",
      "não está funcionando",
      "de repente",
      "seria possível",
      "ainda bem"
    ],
    "grammar": [
      1,
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite, recepção. Em que posso ajudar?",
        "gloss": {
          "en": "Good evening, front desk. How can I help?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa noite. Aconteceu um problema no quarto trezentos e doze.",
        "gloss": {
          "en": "Good evening. There's a problem in room three twelve.",
          "ko": "안녕하세요. 312호에 문제가 생겼어요."
        }
      },
      {
        "who": "them",
        "text": "Pois não. O que houve?",
        "gloss": {
          "en": "Of course. What happened?",
          "ko": "네, 무슨 일이세요?"
        },
        "alt": [
          {
            "text": "Ah, sinto muito. Qual é o problema?",
            "gloss": {
              "en": "Oh, I'm sorry. What's the problem?",
              "ko": "아, 죄송합니다. 어떤 문제인가요?"
            }
          },
          {
            "text": "Claro, pode falar. O que aconteceu?",
            "gloss": {
              "en": "Sure, go ahead. What happened?",
              "ko": "네, 말씀하세요. 무슨 일이 있었나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "O ar-condicionado não está funcionando. Eu estava dormindo quando ele desligou de repente.",
        "gloss": {
          "en": "The air conditioner isn't working. I was sleeping when it suddenly turned off.",
          "ko": "에어컨이 작동을 안 해요. 자고 있는데 갑자기 꺼졌어요."
        },
        "frames": [
          "pt-f3-14",
          "pt-f3-04",
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Já tentou ligar pelo controle remoto?",
        "gloss": {
          "en": "Have you tried turning it on with the remote?",
          "ko": "리모컨으로 켜 보셨어요?"
        },
        "alt": [
          {
            "text": "Já tentou trocar a pilha do controle?",
            "gloss": {
              "en": "Have you tried changing the battery in the remote?",
              "ko": "리모컨 건전지는 바꿔 보셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Já tentei, mas não funciona. E está muito quente.",
        "gloss": {
          "en": "I already tried, but it doesn't work. And it's really hot.",
          "ko": "해 봤는데 안 돼요. 그리고 너무 더워요."
        }
      },
      {
        "who": "them",
        "text": "Entendo. O técnico só chega amanhã de manhã, infelizmente.",
        "gloss": {
          "en": "I understand. Unfortunately the technician only gets here tomorrow morning.",
          "ko": "그렇군요. 안타깝게도 기사님은 내일 아침에야 오세요."
        }
      },
      {
        "who": "me",
        "text": "Seria possível trocar de quarto hoje? É importante que eu durma bem, porque tenho uma reunião cedo.",
        "gloss": {
          "en": "Would it be possible to change rooms tonight? It's important that I sleep well, because I have an early meeting.",
          "ko": "오늘 방을 바꿀 수 있을까요? 아침 일찍 회의가 있어서 꼭 잘 자야 하거든요."
        },
        "frames": [
          "pt-f3-08",
          "pt-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Vou verificar... Temos um quarto livre no quinto andar, mas é um pouco menor.",
        "gloss": {
          "en": "Let me check... We have a free room on the fifth floor, but it's a little smaller.",
          "ko": "확인해 볼게요... 5층에 빈방이 하나 있는데 조금 작아요."
        },
        "alt": [
          {
            "text": "Deixa eu ver... Só tenho um quarto de solteiro no quinto andar.",
            "gloss": {
              "en": "Let me see... I only have a single room on the fifth floor.",
              "ko": "잠시만요... 5층에 싱글룸 하나밖에 없네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Não tem problema. Ainda bem que vocês têm um quarto livre!",
        "gloss": {
          "en": "No problem. Thank goodness you have a free room!",
          "ko": "괜찮아요. 빈방이 있어서 다행이에요!"
        }
      },
      {
        "who": "them",
        "text": "Vou mandar alguém para ajudar com a mala.",
        "gloss": {
          "en": "I'll send someone to help with your suitcase.",
          "ko": "가방 옮기는 걸 도와드릴 사람을 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Você poderia me passar a senha do wi-fi do novo quarto também?",
        "gloss": {
          "en": "Thank you! Could you also give me the wi-fi password for the new room?",
          "ko": "감사합니다! 새 방 와이파이 비밀번호도 알려 주실 수 있을까요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      }
    ]
  },
  {
    "id": "pt-3-3",
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
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Phoning a clinic to move your doctor's appointment",
      "ko": "병원에 전화해서 진료 예약 옮기기"
    },
    "expressions": [
      "o negócio é o seguinte",
      "dá para trocar",
      "depende",
      "fiquei sabendo"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "2:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Clínica Bem-Estar, bom dia. Com quem eu falo?",
        "gloss": {
          "en": "Bem-Estar Clinic, good morning. Who am I speaking with?",
          "ko": "베잉 이스타르 클리닉입니다. 누구세요?"
        }
      },
      {
        "who": "me",
        "text": "Bom dia, aqui é o Ji-woo. Eu tenho uma consulta marcada para quinta.",
        "gloss": {
          "en": "Good morning, this is Ji-woo. I have an appointment booked for Thursday.",
          "ko": "안녕하세요, 지우인데요. 목요일에 진료 예약이 있어요."
        }
      },
      {
        "who": "them",
        "text": "Sim, com a doutora Fernanda, às três. Posso ajudar?",
        "gloss": {
          "en": "Yes, with Dr. Fernanda, at three. Can I help?",
          "ko": "네, 페르난다 선생님, 3시네요. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "Ah, sim, estou vendo aqui. Em que posso ajudar?",
            "gloss": {
              "en": "Ah yes, I can see it here. How can I help?",
              "ko": "아, 네, 여기 보이네요. 무엇을 도와드릴까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "O negócio é o seguinte: vou viajar a trabalho. Dá para trocar para a semana que vem?",
        "gloss": {
          "en": "Here's the thing: I'm going on a work trip. Can I change it to next week?",
          "ko": "다름이 아니라 출장을 가게 됐어요. 다음 주로 바꿀 수 있을까요?"
        },
        "frames": [
          "pt-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Deixa eu ver. A doutora tem horário na terça às dez ou na quarta à tarde.",
        "gloss": {
          "en": "Let me see. The doctor has a slot on Tuesday at ten or Wednesday afternoon.",
          "ko": "잠시만요. 선생님이 화요일 10시나 수요일 오후에 시간이 되세요."
        },
        "alt": [
          {
            "text": "Vou verificar a agenda. Pode ser terça às dez ou quarta à tarde?",
            "gloss": {
              "en": "I'll check the schedule. Would Tuesday at ten or Wednesday afternoon work?",
              "ko": "일정 확인해 볼게요. 화요일 10시나 수요일 오후 괜찮으세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Depende. Na quarta, a que horas?",
        "gloss": {
          "en": "It depends. On Wednesday, what time?",
          "ko": "그때그때 달라서요. 수요일은 몇 시예요?"
        }
      },
      {
        "who": "them",
        "text": "Às quatro e meia.",
        "gloss": {
          "en": "At four thirty.",
          "ko": "4시 반이요."
        }
      },
      {
        "who": "me",
        "text": "Perfeito. Você poderia me mandar uma mensagem para confirmar?",
        "gloss": {
          "en": "Perfect. Could you send me a message to confirm?",
          "ko": "좋아요. 확인 문자 좀 보내 주실 수 있을까요?"
        },
        "frames": [
          "pt-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Claro. A gente manda pelo WhatsApp um dia antes.",
        "gloss": {
          "en": "Sure. We send it on WhatsApp the day before.",
          "ko": "물론이죠. 하루 전에 왓츠앱으로 보내 드려요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo. E fiquei sabendo que vocês têm estacionamento agora. É verdade?",
        "gloss": {
          "en": "Great. And I heard you have parking now. Is that true?",
          "ko": "좋아요. 그리고 이제 주차장이 생겼다고 들었는데, 맞아요?"
        },
        "frames": [
          "pt-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "É sim, no subsolo. É só mostrar o cartão da clínica.",
        "gloss": {
          "en": "Yes, in the basement. Just show your clinic card.",
          "ko": "네, 지하에 있어요. 병원 카드만 보여 주시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Que ótimo. Espero que a doutora não se importe com a mudança. Obrigado!",
        "gloss": {
          "en": "Great. I hope the doctor doesn't mind the change. Thank you!",
          "ko": "잘됐네요. 선생님이 일정 변경을 괜찮아하시면 좋겠어요. 감사합니다!"
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "At a friend's party, telling everyone about your trip to Bahia",
      "ko": "친구 파티에서 바이아 여행 이야기하기"
    },
    "expressions": [
      "de repente",
      "fazer o quê",
      "vale a pena",
      "com certeza",
      "no fim das contas"
    ],
    "grammar": [
      0,
      1,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "E aí, como foi a viagem para a Bahia?",
        "gloss": {
          "en": "So, how was the trip to Bahia?",
          "ko": "그래서, 바이아 여행 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Foi incrível! A gente ficou numa pousada que era bem pertinho da praia.",
        "gloss": {
          "en": "It was amazing! We stayed at a guesthouse that was really close to the beach.",
          "ko": "최고였어! 해변 바로 앞에 있는 민박집에서 묵었어."
        },
        "frames": [
          "pt-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Que delícia! E o que vocês fizeram?",
        "gloss": {
          "en": "Lovely! And what did you do?",
          "ko": "좋았겠다! 뭐 했어?"
        },
        "alt": [
          {
            "text": "Que inveja! Conta tudo, o que vocês fizeram?",
            "gloss": {
              "en": "I'm so jealous! Tell me everything, what did you do?",
              "ko": "부럽다! 다 말해 봐, 뭐 했어?"
            }
          },
          {
            "text": "Nossa! E o que mais vocês fizeram por lá?",
            "gloss": {
              "en": "Wow! And what else did you do there?",
              "ko": "와! 거기서 또 뭐 했어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Todo dia a gente acordava cedo e ia para uma praia diferente.",
        "gloss": {
          "en": "Every day we'd wake up early and go to a different beach.",
          "ko": "매일 일찍 일어나서 다른 해변에 갔어."
        }
      },
      {
        "who": "them",
        "text": "Aconteceu alguma coisa engraçada?",
        "gloss": {
          "en": "Did anything funny happen?",
          "ko": "웃긴 일은 없었어?"
        },
        "alt": [
          {
            "text": "E teve alguma história boa?",
            "gloss": {
              "en": "And was there a good story?",
              "ko": "재밌는 일화는 없어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Teve! Um dia a gente estava voltando de barco quando, de repente, começou uma tempestade.",
        "gloss": {
          "en": "There was! One day we were coming back by boat when, suddenly, a storm started.",
          "ko": "있지! 하루는 배 타고 돌아오는데 갑자기 폭풍이 몰아쳤어."
        },
        "frames": [
          "pt-f3-04",
          "pt-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Nossa! E aí, o que vocês fizeram?",
        "gloss": {
          "en": "Wow! So what did you do?",
          "ko": "헐! 그래서 어떻게 했어?"
        }
      },
      {
        "who": "me",
        "text": "Nada, né? Fazer o quê? A gente chegou ensopado, mas rindo muito.",
        "gloss": {
          "en": "Nothing, right? What can you do? We arrived soaked, but laughing a lot.",
          "ko": "뭘 해, 어쩌겠어? 홀딱 젖었는데 엄청 웃으면서 도착했어."
        }
      },
      {
        "who": "them",
        "text": "Ha! E a comida de lá, como era?",
        "gloss": {
          "en": "Ha! And the food there, what was it like?",
          "ko": "하하! 거기 음식은 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Maravilhosa. Vale a pena provar o acarajé, com certeza.",
        "gloss": {
          "en": "Wonderful. It's definitely worth trying acarajé.",
          "ko": "끝내줬어. 아카라제는 꼭 먹어 볼 만해."
        },
        "frames": [
          "pt-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Eu quero muito ir no verão que vem.",
        "gloss": {
          "en": "I really want to go next summer.",
          "ko": "나도 내년 여름에 꼭 가고 싶다."
        }
      },
      {
        "who": "me",
        "text": "Então vai! No fim das contas, foi a melhor viagem da minha vida. Eu te mando o nome da pousada.",
        "gloss": {
          "en": "Then go! In the end, it was the best trip of my life. I'll send you the name of the guesthouse.",
          "ko": "그럼 가! 결국 내 인생 최고의 여행이었어. 민박집 이름 보내 줄게."
        }
      }
    ]
  },
  {
    "id": "pt-3-x1",
    "stage": 3,
    "setting": {
      "en": "Deciding what to order for dinner with your roommate",
      "ko": "룸메이트와 저녁 배달 메뉴 정하기"
    },
    "expressions": [
      "você me indica",
      "concordo",
      "eu acho que",
      "vale a pena"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Vou pedir comida hoje. Quer também?",
        "gloss": {
          "en": "I'm ordering food tonight. Do you want some too?",
          "ko": "오늘 배달시킬 건데, 너도 먹을래?"
        }
      },
      {
        "who": "me",
        "text": "Quero! Você me indica algum lugar bom?",
        "gloss": {
          "en": "Yes! Can you recommend a good place?",
          "ko": "먹을래! 괜찮은 데 추천해 줄래?"
        },
        "frames": [
          "pt-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Tem um japonês ótimo, mas é meio caro.",
        "gloss": {
          "en": "There's a great Japanese place, but it's kind of expensive.",
          "ko": "괜찮은 일식집이 있는데 좀 비싸."
        }
      },
      {
        "who": "me",
        "text": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena.",
        "gloss": {
          "en": "I agree, Japanese is expensive. But I think today it's worth it.",
          "ko": "맞아, 일식은 비싸지. 그래도 오늘은 그럴 만한 것 같아."
        },
        "frames": [
          "pt-f3-16",
          "pt-f3-01",
          "pt-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Então vou pedir. Te mando o cardápio.",
        "gloss": {
          "en": "Then I'll order. I'll send you the menu.",
          "ko": "그럼 시킬게. 메뉴판 보내 줄게."
        }
      },
      {
        "who": "me",
        "text": "Beleza. Espero que eles entreguem rápido, estou morrendo de fome!",
        "gloss": {
          "en": "Great. I hope they deliver fast, I'm starving!",
          "ko": "좋아. 빨리 배달 오면 좋겠다, 배고파 죽겠어!"
        },
        "frames": [
          "pt-f3-05"
        ]
      }
    ]
  },
  {
    "id": "pt-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "A project stand-up where your manager, Renata, reports that the client moved the deadline up",
      "ko": "매니저 헤나타가 고객이 마감을 앞당겼다고 알리는 프로젝트 회의"
    },
    "expressions": [
      "se não me engano",
      "a questão é",
      "entendo seu ponto",
      "só que",
      "por um lado",
      "por outro lado",
      "faz sentido",
      "a longo prazo",
      "fechou",
      "vamos alinhar"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "earlierGrammar": [
      "3:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pessoal, o cliente pediu para antecipar a entrega para sexta. Como estamos?",
        "gloss": {
          "en": "Everyone, the client asked to move the delivery up to Friday. Where are we?",
          "ko": "여러분, 고객이 납품을 금요일로 당겨 달래요. 우리 상황 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Se não me engano, ainda faltam três telas e todos os testes.",
        "gloss": {
          "en": "If I'm not mistaken, we still have three screens and all the testing left.",
          "ko": "제가 알기로는 아직 화면 세 개랑 테스트 전부가 남았어요."
        },
        "frames": [
          "pt-f4-20"
        ]
      },
      {
        "who": "them",
        "text": "Três telas em quatro dias? Dá para fazer?",
        "gloss": {
          "en": "Three screens in four days? Can it be done?",
          "ko": "나흘 만에 화면 세 개요? 가능해요?"
        },
        "alt": [
          {
            "text": "Isso é muita coisa. Vocês conseguem?",
            "gloss": {
              "en": "That's a lot. Can you manage it?",
              "ko": "양이 많네요. 할 수 있겠어요?"
            }
          },
          {
            "text": "E aí, tem chance de terminar até sexta?",
            "gloss": {
              "en": "So, is there any chance of finishing by Friday?",
              "ko": "그래서, 금요일까지 끝낼 가능성 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "A questão é que a gente tem trabalhado até tarde há semanas. A equipe está cansada.",
        "gloss": {
          "en": "The thing is, we've been working late for weeks. The team is tired.",
          "ko": "문제는 우리가 몇 주째 야근하고 있다는 거예요. 팀이 지쳐 있어요."
        },
        "frames": [
          "pt-f4-14"
        ]
      },
      {
        "who": "them",
        "text": "Eu sei. Mas o cliente disse que a data é importante para o lançamento.",
        "gloss": {
          "en": "I know. But the client said the date is important for the launch.",
          "ko": "알아요. 그런데 고객이 출시 때문에 그 날짜가 중요하대요."
        }
      },
      {
        "who": "me",
        "text": "Entendo seu ponto, só que, se a gente tivesse mais uma pessoa, terminaria com muito mais qualidade.",
        "gloss": {
          "en": "I see your point, but if we had one more person, we'd finish with much better quality.",
          "ko": "무슨 말인지 알아요. 다만 한 명만 더 있으면 훨씬 완성도 있게 끝낼 수 있을 거예요."
        },
        "frames": [
          "pt-f4-13"
        ]
      },
      {
        "who": "them",
        "text": "Não tenho ninguém disponível agora. O que você sugere?",
        "gloss": {
          "en": "I don't have anyone available right now. What do you suggest?",
          "ko": "지금 투입할 사람이 없어요. 어떻게 하면 좋을까요?"
        },
        "alt": [
          {
            "text": "Contratar alguém agora não dá. Tem outra ideia?",
            "gloss": {
              "en": "Hiring someone now isn't possible. Any other idea?",
              "ko": "지금 사람을 뽑을 순 없어요. 다른 방법 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Por um lado, podemos entregar as telas principais na sexta. Por outro lado, os testes ficam para terça.",
        "gloss": {
          "en": "On the one hand, we can deliver the main screens on Friday. On the other hand, testing moves to Tuesday.",
          "ko": "한편으로는 주요 화면을 금요일에 넘길 수 있어요. 대신 테스트는 화요일로 미뤄지고요."
        },
        "frames": [
          "pt-f4-11",
          "pt-f4-12"
        ]
      },
      {
        "who": "them",
        "text": "Hum. E você acha que o cliente aceita isso?",
        "gloss": {
          "en": "Hmm. And do you think the client will accept that?",
          "ko": "음. 고객이 그걸 받아들일까요?"
        }
      },
      {
        "who": "me",
        "text": "Faz sentido para eles também. Embora seja menos do que pediram, é mais seguro a longo prazo.",
        "gloss": {
          "en": "It makes sense for them too. Even though it's less than they asked for, it's safer in the long run.",
          "ko": "고객 입장에서도 말이 돼요. 요청한 것보다 적긴 해도 길게 보면 더 안전하니까요."
        },
        "frames": [
          "pt-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "Tá. Então eu ligo para eles hoje e explico.",
        "gloss": {
          "en": "OK. Then I'll call them today and explain.",
          "ko": "좋아요. 그럼 오늘 제가 전화해서 설명할게요."
        }
      },
      {
        "who": "me",
        "text": "Ótimo. Assim que você falar com eles, me avisa para a gente se organizar.",
        "gloss": {
          "en": "Great. As soon as you talk to them, let me know so we can get organized.",
          "ko": "좋아요. 통화하시자마자 알려 주세요. 그래야 저희가 정리할 수 있어요."
        },
        "frames": [
          "pt-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "Pode deixar. Devo ter uma resposta até o fim do dia.",
        "gloss": {
          "en": "Will do. I should have an answer by the end of the day.",
          "ko": "그럴게요. 오늘 안에는 답이 나올 거예요."
        }
      },
      {
        "who": "me",
        "text": "Fechou. Vamos alinhar de novo amanhã cedo?",
        "gloss": {
          "en": "Deal. Shall we sync up again first thing tomorrow?",
          "ko": "좋아요. 내일 아침에 다시 맞춰 볼까요?"
        }
      }
    ]
  },
  {
    "id": "pt-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Your landlord, seu Marcos, wants to raise the rent when the lease renews",
      "ko": "계약 갱신 때 집주인 마르쿠스 씨가 월세를 올리려 함"
    },
    "expressions": [
      "deixa eu ver",
      "só que",
      "tem como",
      "chegar a um acordo",
      "levando em conta",
      "em compensação",
      "o lado bom é",
      "dar um retorno"
    ],
    "grammar": [
      0,
      1
    ],
    "earlierGrammar": [
      "2:6",
      "3:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Então, como eu falei na mensagem, o aluguel vai subir dez por cento a partir de janeiro.",
        "gloss": {
          "en": "So, as I said in my message, the rent is going up ten percent starting in January.",
          "ko": "그러니까 메시지로 말했듯이, 1월부터 월세가 10퍼센트 올라요."
        }
      },
      {
        "who": "me",
        "text": "Entendi. Deixa eu ver se eu entendi direito: de dois mil para dois mil e duzentos?",
        "gloss": {
          "en": "Got it. Let me see if I understood correctly: from two thousand to two thousand two hundred?",
          "ko": "알겠어요. 제가 제대로 이해했는지 볼게요. 2천에서 2천2백으로요?"
        }
      },
      {
        "who": "them",
        "text": "Isso. Está tudo mais caro, né? Imposto, condomínio...",
        "gloss": {
          "en": "Right. Everything's more expensive, you know? Taxes, building fees...",
          "ko": "맞아요. 다 올랐잖아요? 세금이며 관리비며..."
        },
        "alt": [
          {
            "text": "Exato. Os custos aumentaram muito este ano.",
            "gloss": {
              "en": "Exactly. Costs went up a lot this year.",
              "ko": "맞아요. 올해 비용이 많이 올랐어요."
            }
          },
          {
            "text": "Isso mesmo. Você sabe como estão os preços.",
            "gloss": {
              "en": "That's right. You know how prices are.",
              "ko": "맞아요. 요즘 물가 아시잖아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Eu entendo. Só que eu moro aqui faz três anos e sempre paguei em dia.",
        "gloss": {
          "en": "I understand. But I've lived here for three years and always paid on time.",
          "ko": "이해해요. 다만 저는 여기 3년째 살면서 한 번도 밀린 적이 없어요."
        }
      },
      {
        "who": "them",
        "text": "Isso é verdade, você é um ótimo inquilino.",
        "gloss": {
          "en": "That's true, you're a great tenant.",
          "ko": "그건 맞아요, 정말 좋은 세입자죠."
        }
      },
      {
        "who": "me",
        "text": "Tem como a gente chegar a um acordo? Que tal cinco por cento?",
        "gloss": {
          "en": "Is there a way we can reach an agreement? How about five percent?",
          "ko": "우리 합의점을 찾을 수 있을까요? 5퍼센트는 어떠세요?"
        },
        "frames": [
          "pt-f4-15"
        ]
      },
      {
        "who": "them",
        "text": "Cinco é pouco. Os outros apartamentos do prédio estão mais caros.",
        "gloss": {
          "en": "Five is too little. The other apartments in the building are more expensive.",
          "ko": "5퍼센트는 너무 적어요. 이 건물 다른 집들은 더 비싸요."
        },
        "alt": [
          {
            "text": "Cinco não dá. Os vizinhos já pagam mais do que você.",
            "gloss": {
              "en": "Five won't work. The neighbors already pay more than you.",
              "ko": "5퍼센트는 안 돼요. 이웃들은 이미 더 내고 있어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Levando em conta que eu mesmo pintei a sala, acho justo. Em compensação, posso assinar por mais dois anos.",
        "gloss": {
          "en": "Considering that I painted the living room myself, I think it's fair. In return, I can sign for two more years.",
          "ko": "거실 페인트칠을 제가 직접 한 걸 생각하면 공정하다고 봐요. 대신 2년 더 계약할 수 있어요."
        },
        "frames": [
          "pt-f4-16",
          "pt-f4-17"
        ]
      },
      {
        "who": "them",
        "text": "Hum. Um contrato mais longo me interessa.",
        "gloss": {
          "en": "Hmm. A longer contract interests me.",
          "ko": "음. 계약 기간이 길어지는 건 저도 좋죠."
        }
      },
      {
        "who": "me",
        "text": "Se eu tivesse que me mudar agora, eu teria muitos custos, e o senhor ficaria com o apartamento vazio.",
        "gloss": {
          "en": "If I had to move now, I'd have a lot of costs, and you'd be left with an empty apartment.",
          "ko": "제가 지금 이사해야 하면 비용이 많이 들고, 사장님도 집이 비게 되잖아요."
        },
        "frames": [
          "pt-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "Tá bom. E se for sete por cento?",
        "gloss": {
          "en": "All right. And what if it's seven percent?",
          "ko": "알겠어요. 7퍼센트면 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Sete eu aceito. O lado bom é que nenhum de nós precisa se preocupar com isso tão cedo.",
        "gloss": {
          "en": "Seven I can accept. The good thing is that neither of us has to worry about this again any time soon.",
          "ko": "7퍼센트는 받아들일게요. 좋은 점은 우리 둘 다 당분간 이 문제로 신경 쓸 일이 없다는 거죠."
        },
        "frames": [
          "pt-f4-18"
        ]
      },
      {
        "who": "them",
        "text": "Combinado. Eu mando o contrato novo por e-mail.",
        "gloss": {
          "en": "Deal. I'll send the new contract by email.",
          "ko": "좋아요. 새 계약서는 이메일로 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Perfeito. Quando o senhor mandar, eu leio com calma e prometo dar um retorno até sexta.",
        "gloss": {
          "en": "Perfect. When you send it, I'll read it carefully and promise to get back to you by Friday.",
          "ko": "좋습니다. 보내 주시면 꼼꼼히 읽고 금요일까지 꼭 답드릴게요."
        }
      }
    ]
  },
  {
    "id": "pt-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "A Friday-night debate with friends about working from home",
      "ko": "금요일 밤 친구들과 재택근무 토론"
    },
    "expressions": [
      "em resumo",
      "não tem jeito",
      "correr atrás"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:4",
      "3:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gente, sinceramente, eu nunca mais volto para o escritório.",
        "gloss": {
          "en": "Guys, honestly, I'm never going back to the office.",
          "ko": "얘들아, 솔직히 난 다시는 사무실로 안 돌아가."
        }
      },
      {
        "who": "me",
        "text": "Eu te entendo, mas tenho sentido falta das pessoas. Em casa eu me sinto sozinho às vezes.",
        "gloss": {
          "en": "I get you, but I've been missing people. At home I feel lonely sometimes.",
          "ko": "이해는 해. 근데 난 요즘 사람들이 그리워. 집에 있으면 가끔 외로워."
        },
        "frames": [
          "pt-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "Sério? Mas e o trânsito? Eu perdia duas horas por dia!",
        "gloss": {
          "en": "Seriously? But what about traffic? I used to lose two hours a day!",
          "ko": "진짜? 근데 출퇴근길은? 난 하루에 두 시간씩 날렸다고!"
        },
        "alt": [
          {
            "text": "Mas você não odiava pegar trânsito?",
            "gloss": {
              "en": "But didn't you hate sitting in traffic?",
              "ko": "근데 너 차 막히는 거 질색하지 않았어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Concordo que o trânsito é horrível. Mesmo assim, embora o home office seja confortável, a gente aprende menos.",
        "gloss": {
          "en": "I agree traffic is awful. Still, even though working from home is comfortable, we learn less.",
          "ko": "교통 체증이 끔찍한 건 맞아. 그래도 재택이 편하긴 해도 배우는 게 적어."
        }
      },
      {
        "who": "them",
        "text": "Aprende menos como?",
        "gloss": {
          "en": "Learn less how?",
          "ko": "배우는 게 적다니, 어떻게?"
        }
      },
      {
        "who": "me",
        "text": "Fala-se muito de produtividade, mas pouco de como os novatos aprendem com os colegas.",
        "gloss": {
          "en": "People talk a lot about productivity, but little about how newcomers learn from coworkers.",
          "ko": "생산성 얘기는 많이들 하는데, 신입이 동료한테서 배우는 얘기는 잘 안 하잖아."
        },
        "frames": [
          "pt-f4-10"
        ]
      },
      {
        "who": "them",
        "text": "Ah, mas para isso existem reuniões online.",
        "gloss": {
          "en": "Oh, but that's what online meetings are for.",
          "ko": "에이, 그러라고 온라인 회의가 있잖아."
        },
        "alt": [
          {
            "text": "Mas dá para aprender por videochamada também, não?",
            "gloss": {
              "en": "But you can learn over video calls too, can't you?",
              "ko": "근데 화상 통화로도 배울 수 있지 않아?"
            }
          },
          {
            "text": "Hoje em dia tem ferramenta para tudo, né?",
            "gloss": {
              "en": "These days there's a tool for everything, right?",
              "ko": "요즘엔 뭐든 도구가 다 있잖아?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Não é a mesma coisa. Meu chefe disse que os estagiários estavam com dificuldade de pedir ajuda.",
        "gloss": {
          "en": "It's not the same. My boss said the interns were having trouble asking for help.",
          "ko": "그거랑은 달라. 우리 팀장님이 인턴들이 도움 요청하는 걸 어려워했다고 하더라."
        },
        "frames": [
          "pt-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "Tá, isso faz sentido. Então qual é a solução?",
        "gloss": {
          "en": "OK, that makes sense. So what's the solution?",
          "ko": "그래, 그건 일리 있네. 그럼 해결책은 뭔데?"
        }
      },
      {
        "who": "me",
        "text": "Eu acho que o híbrido é melhor: dois dias no escritório para as equipes se encontrarem.",
        "gloss": {
          "en": "I think hybrid is better: two days in the office for the teams to meet.",
          "ko": "난 하이브리드가 낫다고 봐. 팀끼리 만날 수 있게 이틀은 사무실로."
        },
        "frames": [
          "pt-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Dois dias? Tudo bem. Mas não mais que isso!",
        "gloss": {
          "en": "Two days? Fine. But no more than that!",
          "ko": "이틀? 좋아. 근데 그 이상은 안 돼!"
        }
      },
      {
        "who": "me",
        "text": "Em resumo: flexível, mas com encontros. Se a empresa me desse essa opção, eu ficaria feliz.",
        "gloss": {
          "en": "In short: flexible, but with get-togethers. If the company gave me that option, I'd be happy.",
          "ko": "요약하면, 유연하게 하되 만나기도 하자는 거지. 회사가 그런 선택지를 주면 난 좋겠어."
        },
        "frames": [
          "pt-f4-19",
          "pt-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "Pois é. Mas a minha empresa nunca vai aceitar isso.",
        "gloss": {
          "en": "Right. But my company is never going to accept that.",
          "ko": "그러게. 근데 우리 회사는 절대 안 받아 줄 거야."
        }
      },
      {
        "who": "me",
        "text": "Não tem jeito, então. Vai ter que correr atrás de outra vaga!",
        "gloss": {
          "en": "Then there's no way around it. You'll have to go after another job!",
          "ko": "그럼 어쩔 수 없네. 다른 자리 알아보러 뛰어야지!"
        }
      }
    ]
  },
  {
    "id": "pt-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "A job interview for a product designer role at a health-tech startup",
      "ko": "헬스테크 스타트업의 프로덕트 디자이너 면접"
    },
    "expressions": [
      "só que",
      "levando em conta"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bom dia. Obrigada por vir. Fale um pouco sobre você.",
        "gloss": {
          "en": "Good morning. Thanks for coming. Tell me a little about yourself.",
          "ko": "안녕하세요. 와 주셔서 감사해요. 자기소개 좀 해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Bom dia. Eu sou designer e, nos últimos dois anos, tenho trabalhado com aplicativos de saúde.",
        "gloss": {
          "en": "Good morning. I'm a designer, and for the last two years I've been working on health apps.",
          "ko": "안녕하세요. 저는 디자이너이고, 최근 2년 동안 헬스케어 앱 작업을 해 왔습니다."
        },
        "frames": [
          "pt-f4-07"
        ]
      },
      {
        "who": "them",
        "text": "Interessante. E por que você quer sair da sua empresa atual?",
        "gloss": {
          "en": "Interesting. And why do you want to leave your current company?",
          "ko": "흥미롭네요. 지금 회사는 왜 나오려고 하세요?"
        },
        "alt": [
          {
            "text": "E o que te fez procurar uma nova oportunidade?",
            "gloss": {
              "en": "And what made you look for a new opportunity?",
              "ko": "새로운 기회를 찾게 된 계기가 뭐예요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Gosto muito de lá, só que quero crescer, e lá não tem muito espaço para isso.",
        "gloss": {
          "en": "I really like it there, but I want to grow, and there isn't much room for that.",
          "ko": "지금 회사도 정말 좋지만, 성장하고 싶은데 거기선 그럴 여지가 많지 않아요."
        }
      },
      {
        "who": "them",
        "text": "Entendo. Qual foi um projeto de que você se orgulha?",
        "gloss": {
          "en": "I see. What's a project you're proud of?",
          "ko": "그렇군요. 자랑스러운 프로젝트 하나 꼽는다면요?"
        }
      },
      {
        "who": "me",
        "text": "Um aplicativo de consultas. Os usuários disseram que era o mais fácil que já tinham usado.",
        "gloss": {
          "en": "An appointment app. Users said it was the easiest one they'd ever used.",
          "ko": "진료 예약 앱이요. 사용자들이 지금까지 써 본 것 중 제일 쉽다고 했어요."
        },
        "frames": [
          "pt-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "Muito bom. E como você lida com prazos curtos?",
        "gloss": {
          "en": "Very good. And how do you handle tight deadlines?",
          "ko": "좋네요. 마감이 빠듯할 땐 어떻게 하세요?"
        },
        "alt": [
          {
            "text": "E quando o prazo aperta, como você faz?",
            "gloss": {
              "en": "And when the deadline gets tight, what do you do?",
              "ko": "마감이 다가오면 어떻게 하세요?"
            }
          },
          {
            "text": "Como você se organiza com prazos apertados?",
            "gloss": {
              "en": "How do you organize yourself with tight deadlines?",
              "ko": "촉박한 일정은 어떻게 관리하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Eu priorizo o essencial. Embora eu goste de detalhes, sei a hora de parar, levando em conta o prazo.",
        "gloss": {
          "en": "I prioritize what's essential. Although I like details, I know when to stop, taking the deadline into account.",
          "ko": "핵심부터 챙겨요. 디테일을 좋아하긴 하지만, 마감을 고려해서 멈출 때를 알아요."
        },
        "frames": [
          "pt-f4-16"
        ]
      },
      {
        "who": "them",
        "text": "E se você tivesse que liderar uma equipe?",
        "gloss": {
          "en": "And if you had to lead a team?",
          "ko": "만약 팀을 이끌어야 한다면요?"
        }
      },
      {
        "who": "me",
        "text": "Se eu tivesse essa chance, faria reuniões curtas toda semana para todos saberem as prioridades.",
        "gloss": {
          "en": "If I had that chance, I'd hold short meetings every week so everyone knows the priorities.",
          "ko": "그런 기회가 있다면 매주 짧게 회의해서 모두가 우선순위를 알게 하겠어요."
        },
        "frames": [
          "pt-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "Ótimo. Tem alguma pergunta para nós?",
        "gloss": {
          "en": "Great. Do you have any questions for us?",
          "ko": "좋아요. 저희한테 궁금한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Tenho, sim. Se eu for aprovado, quando eu começaria?",
        "gloss": {
          "en": "Yes, I do. If I'm hired, when would I start?",
          "ko": "네, 있어요. 합격하면 언제부터 일하게 되나요?"
        }
      },
      {
        "who": "them",
        "text": "Em duas semanas. A gente vai dar um retorno até sexta.",
        "gloss": {
          "en": "In two weeks. We'll get back to you by Friday.",
          "ko": "2주 뒤에요. 금요일까지 연락드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Perfeito. Muito obrigado pela conversa, foi um prazer.",
        "gloss": {
          "en": "Perfect. Thank you very much for the conversation, it was a pleasure.",
          "ko": "좋습니다. 이야기 나눠 주셔서 감사합니다. 즐거웠어요."
        }
      }
    ]
  },
  {
    "id": "pt-4-5",
    "stage": 4,
    "situation": 4,
    "setting": {
      "en": "Talking with your coworker about the latest episode of a personal finance podcast",
      "ko": "동료와 재테크 팟캐스트 최신 에피소드 이야기"
    },
    "expressions": [
      "mandou bem",
      "por um lado",
      "por outro lado",
      "a longo prazo",
      "se não me engano"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você ouviu o último episódio daquele podcast de finanças?",
        "gloss": {
          "en": "Did you listen to the latest episode of that finance podcast?",
          "ko": "그 재테크 팟캐스트 최신 에피소드 들었어?"
        }
      },
      {
        "who": "me",
        "text": "Ouvi ontem no ônibus! O convidado mandou bem demais.",
        "gloss": {
          "en": "I listened yesterday on the bus! The guest did a great job.",
          "ko": "어제 버스에서 들었어! 게스트가 진짜 잘하더라."
        }
      },
      {
        "who": "them",
        "text": "Né? Ele falou que a gente gasta muito com coisinhas.",
        "gloss": {
          "en": "Right? He said we spend a lot on little things.",
          "ko": "그치? 우리가 자잘한 데 돈을 많이 쓴다고 하더라."
        },
        "alt": [
          {
            "text": "Também achei! Aquela parte do cafezinho, né?",
            "gloss": {
              "en": "I thought so too! That part about the little coffees, right?",
              "ko": "나도! 그 커피 얘기 부분 말이지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Pois é, ele disse que um cafezinho por dia vira uma passagem de avião no fim do ano.",
        "gloss": {
          "en": "Exactly, he said one coffee a day turns into a plane ticket by the end of the year.",
          "ko": "맞아, 하루 커피 한 잔이 연말엔 비행기 표 한 장이 된다고 했어."
        },
        "frames": [
          "pt-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "Mas isso não é meio exagero?",
        "gloss": {
          "en": "But isn't that a bit of an exaggeration?",
          "ko": "근데 그거 좀 과장 아니야?"
        },
        "alt": [
          {
            "text": "Você não achou que ele exagerou um pouco?",
            "gloss": {
              "en": "Didn't you think he exaggerated a little?",
              "ko": "좀 과장했다고 생각 안 했어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Por um lado, sim. Por outro lado, a longo prazo, essas coisinhas fazem diferença.",
        "gloss": {
          "en": "On the one hand, yes. On the other hand, in the long run, these little things make a difference.",
          "ko": "한편으론 그렇지. 근데 길게 보면 그런 자잘한 게 차이를 만들어."
        },
        "frames": [
          "pt-f4-11",
          "pt-f4-12"
        ]
      },
      {
        "who": "them",
        "text": "Eu achei a parte de investimentos meio confusa.",
        "gloss": {
          "en": "I found the investment part kind of confusing.",
          "ko": "난 투자 부분이 좀 헷갈렸어."
        },
        "alt": [
          {
            "text": "A parte de investimento eu não entendi direito, e você?",
            "gloss": {
              "en": "I didn't really get the investment part, did you?",
              "ko": "투자 부분은 잘 이해 못 했는데, 너는?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Eu também. Se eu entendesse mais de finanças, já teria começado a investir.",
        "gloss": {
          "en": "Me too. If I understood more about finance, I'd have started investing already.",
          "ko": "나도. 재테크를 좀 더 알았으면 벌써 투자 시작했을 거야."
        }
      },
      {
        "who": "them",
        "text": "E ele falou de alguma coisa para iniciantes?",
        "gloss": {
          "en": "And did he talk about anything for beginners?",
          "ko": "초보자를 위한 얘기도 했어?"
        }
      },
      {
        "who": "me",
        "text": "Se não me engano, ele recomendou começar com pouco, assim que a pessoa tiver uma reserva.",
        "gloss": {
          "en": "If I'm not mistaken, he recommended starting small, as soon as you have some savings.",
          "ko": "내 기억이 맞다면, 비상금이 생기자마자 조금씩 시작하라고 했어."
        },
        "frames": [
          "pt-f4-20",
          "pt-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "Reserva? O meu salário acaba no dia quinze!",
        "gloss": {
          "en": "Savings? My salary runs out by the fifteenth!",
          "ko": "비상금? 내 월급은 15일이면 바닥나는데!"
        }
      },
      {
        "who": "me",
        "text": "Fala-se muito em investir, mas pouco em como guardar dinheiro. Ele mesmo disse isso.",
        "gloss": {
          "en": "People talk a lot about investing, but little about how to save money. He said so himself.",
          "ko": "투자 얘기는 많이 하는데 돈 모으는 법 얘기는 별로 없지. 그 사람도 그렇게 말했어."
        },
        "frames": [
          "pt-f4-10"
        ]
      },
      {
        "who": "them",
        "text": "Verdade. Vou ouvir de novo com mais atenção.",
        "gloss": {
          "en": "True. I'll listen again more carefully.",
          "ko": "맞아. 다시 한번 집중해서 들어 봐야겠다."
        }
      },
      {
        "who": "me",
        "text": "Ouve sim. Embora seja longo, vale cada minuto. Depois me conta o que achou!",
        "gloss": {
          "en": "Do it. Even though it's long, it's worth every minute. Tell me what you think afterwards!",
          "ko": "꼭 들어. 길긴 해도 1분 1분이 아깝지 않아. 듣고 어땠는지 말해 줘!"
        },
        "frames": [
          "pt-f4-05"
        ]
      }
    ]
  },
  {
    "id": "pt-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Sunday lunch at your Brazilian partner's family home, where everyone teases everyone",
      "ko": "다들 서로 놀려 대는 브라질 연인 가족의 일요일 점심"
    },
    "goal": {
      "en": "Hold your own in the family teasing, joke back with the right tone, and turn down a third plate without offending grandma",
      "ko": "가족들의 놀림에 밀리지 않고 적당한 톤으로 받아치며, 할머니 기분 상하지 않게 세 번째 접시를 사양하기"
    },
    "expressions": [
      "deu ruim",
      "com todo respeito",
      "inclusive",
      "pagar mico",
      "aliás",
      "na real",
      "ficar de boa",
      "não é à toa"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Olha só quem chegou! Achei que tu não vinha mais, hein?",
        "gloss": {
          "en": "Look who's here! I thought you weren't coming anymore, huh?",
          "ko": "누가 왔나 봐! 안 오는 줄 알았잖아?"
        }
      },
      {
        "who": "me",
        "text": "Eu já tinha saído de casa, tia, mas o trânsito deu ruim na Marginal.",
        "gloss": {
          "en": "I'd already left home, auntie, but traffic went bad on the Marginal.",
          "ko": "이모, 저 진작 나왔는데 마르지나우 도로가 완전 꽉 막혔어요."
        },
        "frames": [
          "pt-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "Sei, sei... Trânsito ou preguiça de acordar cedo?",
        "gloss": {
          "en": "Sure, sure... Traffic, or too lazy to get up early?",
          "ko": "그래, 그래... 차가 막힌 거야, 일찍 일어나기 귀찮았던 거야?"
        }
      },
      {
        "who": "me",
        "text": "Com todo respeito, tia, quem acordou tarde foi o Rafa. Inclusive, liguei pra ele duas vezes.",
        "gloss": {
          "en": "With all due respect, auntie, the one who woke up late was Rafa. In fact, I called him twice.",
          "ko": "이모, 실례지만 늦잠 잔 건 하파예요. 심지어 제가 두 번이나 전화했어요."
        },
        "frames": [
          "pt-f5-16",
          "pt-f5-15"
        ]
      },
      {
        "who": "them",
        "text": "Ah, não vem! Semana passada tu chegou na sobremesa.",
        "gloss": {
          "en": "Oh, come on! Last week you showed up at dessert.",
          "ko": "에이, 무슨 소리! 지난주엔 디저트 먹을 때 왔잖아."
        }
      },
      {
        "who": "me",
        "text": "Tu adora me fazer pagar mico na frente da família, né? Foi uma vez só!",
        "gloss": {
          "en": "You love making me look silly in front of the family, don't you? It was just once!",
          "ko": "너 가족들 앞에서 나 망신 주는 거 진짜 좋아한다? 딱 한 번이었거든!"
        }
      },
      {
        "who": "them",
        "text": "Deixa o menino em paz! Senta, que a lasanha tá saindo.",
        "gloss": {
          "en": "Leave the poor kid alone! Sit down, the lasagna's coming out.",
          "ko": "애 좀 그만 놀려! 앉아, 라자냐 나온다."
        }
      },
      {
        "who": "me",
        "text": "Valeu, vó. Aliás, o cheiro tá incrível, deu pra sentir lá do portão.",
        "gloss": {
          "en": "Thanks, grandma. By the way, the smell is amazing, I could smell it from the gate.",
          "ko": "고마워요, 할머니. 그나저나 냄새 진짜 좋아요, 대문 앞에서부터 났어요."
        },
        "frames": [
          "pt-f5-14"
        ]
      },
      {
        "who": "them",
        "text": "Come mais um pedacinho, tu tá magrinho!",
        "gloss": {
          "en": "Have another little piece, you're so skinny!",
          "ko": "한 조각만 더 먹어, 너 너무 말랐어!"
        }
      },
      {
        "who": "me",
        "text": "Vó, eu já comi dois pratos. Na real, não cabe mais nada!",
        "gloss": {
          "en": "Grandma, I've already had two plates. Honestly, I can't fit anything else!",
          "ko": "할머니, 저 벌써 두 접시 먹었어요. 솔직히 더는 안 들어가요!"
        },
        "frames": [
          "pt-f5-19"
        ]
      },
      {
        "who": "them",
        "text": "Imagina! Na tua idade eu comia três pratos e ainda jantava.",
        "gloss": {
          "en": "Nonsense! At your age I'd eat three plates and still have dinner.",
          "ko": "무슨 소리! 내가 네 나이 땐 세 접시 먹고 저녁까지 먹었어."
        }
      },
      {
        "who": "me",
        "text": "O que eu não entendo é como o senhor ainda conseguia jantar, tio!",
        "gloss": {
          "en": "What I don't get is how you still managed to eat dinner, uncle!",
          "ko": "제가 이해 안 되는 건 그러고도 어떻게 저녁을 드셨냐는 거예요, 삼촌!"
        },
        "frames": [
          "pt-f5-08"
        ]
      },
      {
        "who": "them",
        "text": "Esse aí tá muito espertinho hoje!",
        "gloss": {
          "en": "This one's being a real smart aleck today!",
          "ko": "얘 오늘 아주 말발이 섰네!"
        }
      },
      {
        "who": "me",
        "text": "Pode ficar de boa, tio, é só brincadeira. Mas um pedacinho de pudim eu aceito, a não ser que já tenha acabado.",
        "gloss": {
          "en": "Relax, uncle, I'm just kidding. But I'll take a little piece of pudding, unless it's already gone.",
          "ko": "진정하세요, 삼촌, 농담이에요. 근데 푸딩 한 조각은 먹을게요, 벌써 다 떨어진 게 아니라면요."
        },
        "frames": [
          "pt-f5-03"
        ]
      },
      {
        "who": "them",
        "text": "Pudim nunca acaba nesta casa, meu filho!",
        "gloss": {
          "en": "Pudding never runs out in this house, dear!",
          "ko": "이 집에서 푸딩은 절대 안 떨어진단다, 얘야!"
        }
      },
      {
        "who": "me",
        "text": "Então tá. Não é à toa que todo mundo chega cedo no domingo... menos eu!",
        "gloss": {
          "en": "Well then. No wonder everyone shows up early on Sunday... except me!",
          "ko": "그럼 됐네요. 다들 일요일에 일찍 오는 게 괜히 그런 게 아니었네요... 저만 빼고요!"
        }
      }
    ]
  },
  {
    "id": "pt-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "A video call with Cláudia, your client, to tell her the project will be late",
      "ko": "고객 클라우지아와 화상 통화로 프로젝트 지연 알리기"
    },
    "goal": {
      "en": "Break the news of a two-week delay without losing the client's trust, and offer a concrete plan instead of excuses",
      "ko": "고객의 신뢰를 잃지 않으면서 2주 지연을 알리고, 변명 대신 구체적인 계획 제시하기"
    },
    "expressions": [
      "encher linguiça",
      "pisar na bola",
      "caiu a ficha",
      "na real",
      "fazer vista grossa",
      "pelo contrário",
      "vou ver e te falo",
      "a gente se fala"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "earlierGrammar": [
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oi, tudo bem? Recebi sua mensagem. Aconteceu alguma coisa com o projeto?",
        "gloss": {
          "en": "Hi, how are you? I got your message. Did something happen with the project?",
          "ko": "안녕하세요, 잘 지내죠? 메시지 받았어요. 프로젝트에 무슨 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Oi, Cláudia. Vou ser direto, sem encher linguiça: a gente vai precisar de mais duas semanas.",
        "gloss": {
          "en": "Hi, Cláudia. I'll be direct, no beating around the bush: we're going to need two more weeks.",
          "ko": "안녕하세요, 클라우지아. 돌려 말하지 않을게요. 2주가 더 필요해요."
        }
      },
      {
        "who": "them",
        "text": "Duas semanas? Mas vocês tinham garantido a data na última reunião.",
        "gloss": {
          "en": "Two weeks? But you had guaranteed the date at the last meeting.",
          "ko": "2주요? 지난 회의 때 날짜는 확실하다고 하셨잖아요."
        }
      },
      {
        "who": "me",
        "text": "Eu sei, e a última coisa que eu queria era pisar na bola com vocês.",
        "gloss": {
          "en": "I know, and the last thing I wanted was to let you down.",
          "ko": "알아요. 여러분께 실망을 드리는 건 제가 가장 원하지 않던 일이에요."
        }
      },
      {
        "who": "them",
        "text": "Então o que aconteceu?",
        "gloss": {
          "en": "So what happened?",
          "ko": "그럼 무슨 일이 있었던 거예요?"
        }
      },
      {
        "who": "me",
        "text": "O que atrasou tudo foi a integração com o sistema antigo. Quando a gente percebeu, o fornecedor já tinha mudado a interface.",
        "gloss": {
          "en": "What delayed everything was the integration with the old system. By the time we noticed, the vendor had already changed the interface.",
          "ko": "모든 걸 늦춘 건 기존 시스템과의 연동이었어요. 저희가 알아챘을 땐 업체가 이미 인터페이스를 바꿔 놓은 상태였고요."
        },
        "frames": [
          "pt-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "E não tinha como avisar antes?",
        "gloss": {
          "en": "And there was no way to let us know sooner?",
          "ko": "더 일찍 알려 줄 방법은 없었어요?"
        }
      },
      {
        "who": "me",
        "text": "Tinha, sim. Na real, só caiu a ficha da gravidade na sexta, e eu preferi confirmar antes de te ligar.",
        "gloss": {
          "en": "There was. Honestly, it only dawned on me how serious it was on Friday, and I preferred to confirm before calling you.",
          "ko": "있었죠. 솔직히 금요일에야 심각성을 깨달았고, 확실히 하고 전화드리고 싶었어요."
        },
        "frames": [
          "pt-f5-19",
          "pt-f5-20"
        ]
      },
      {
        "who": "them",
        "text": "Olha, eu entendo, mas a diretoria vai cobrar de mim.",
        "gloss": {
          "en": "Look, I understand, but the board is going to hold me accountable.",
          "ko": "이해는 해요. 근데 경영진이 저한테 책임을 물을 거예요."
        }
      },
      {
        "who": "me",
        "text": "Totalmente. Por isso queria te pedir uma coisinha: dá uma olhadinha nas telas até quarta? Contanto que vocês aprovem, o cadastro sai na sexta.",
        "gloss": {
          "en": "Absolutely. That's why I wanted to ask you a small favor: could you take a quick look at the screens by Wednesday? As long as you approve them, the sign-up goes out on Friday.",
          "ko": "당연하죠. 그래서 작은 부탁 하나 드리려고요. 수요일까지 화면 좀 한번 봐 주실 수 있을까요? 승인만 해 주시면 회원가입 기능은 금요일에 나가요."
        },
        "frames": [
          "pt-f5-06",
          "pt-f5-05",
          "pt-f5-04"
        ]
      },
      {
        "who": "them",
        "text": "E o resto?",
        "gloss": {
          "en": "And the rest?",
          "ko": "나머지는요?"
        }
      },
      {
        "who": "me",
        "text": "O resto fica para o dia vinte. E não vamos fazer vista grossa pra nenhum teste; pelo contrário, vamos testar em dobro.",
        "gloss": {
          "en": "The rest moves to the twentieth. And we won't turn a blind eye to any test; on the contrary, we'll test twice as much.",
          "ko": "나머지는 20일로 갈 거예요. 테스트도 하나도 대충 넘기지 않을 거예요. 오히려 두 배로 할 거예요."
        },
        "frames": [
          "pt-f5-13"
        ]
      },
      {
        "who": "them",
        "text": "Hum. Dá pra dar um jeitinho e entregar na semana do dia quinze?",
        "gloss": {
          "en": "Hmm. Could you find a way to deliver the week of the fifteenth?",
          "ko": "음. 어떻게든 15일 주에 맞춰 줄 수는 없어요?"
        }
      },
      {
        "who": "me",
        "text": "Vou ver e te falo até amanhã. Não quero prometer de novo e falhar.",
        "gloss": {
          "en": "I'll look into it and let you know by tomorrow. I don't want to promise again and fail.",
          "ko": "확인해 보고 내일까지 말씀드릴게요. 또 약속하고 못 지키고 싶지 않아서요."
        },
        "frames": [
          "pt-f5-18"
        ]
      },
      {
        "who": "them",
        "text": "Tá certo. Me manda isso por e-mail também, pra eu repassar.",
        "gloss": {
          "en": "All right. Send me that by email too, so I can pass it on.",
          "ko": "알겠어요. 저도 전달할 수 있게 이메일로도 보내 주세요."
        }
      },
      {
        "who": "me",
        "text": "Claro, mando ainda hoje, com o cronograma detalhado. A gente se fala amanhã!",
        "gloss": {
          "en": "Of course, I'll send it today, with the detailed schedule. Talk to you tomorrow!",
          "ko": "물론이죠, 오늘 안에 상세 일정이랑 같이 보낼게요. 내일 또 얘기해요!"
        }
      }
    ]
  },
  {
    "id": "pt-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "On stage at an education conference panel about artificial intelligence in schools",
      "ko": "교육 콘퍼런스 패널 토론 무대: 학교 속 인공지능"
    },
    "goal": {
      "en": "Make your case on a panel and push back on another panelist firmly but respectfully, ending on a light note",
      "ko": "패널 토론에서 내 주장을 펼치고, 다른 패널에게 단호하지만 예의 있게 반박한 뒤 가볍게 마무리하기"
    },
    "expressions": [
      "com todo respeito",
      "pelo contrário",
      "aliás",
      "conversa fiada",
      "inclusive",
      "chutar o balde",
      "tirar de letra",
      "sem querer ser chato"
    ],
    "grammar": [
      0,
      1,
      3,
      6
    ],
    "earlierGrammar": [
      "4:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Boa noite a todos. Para começar, queria ouvir você: a inteligência artificial ajuda ou atrapalha nas escolas?",
        "gloss": {
          "en": "Good evening, everyone. To start, I'd like to hear from you: does artificial intelligence help or hurt in schools?",
          "ko": "여러분 안녕하세요. 먼저 의견을 듣고 싶은데요, 인공지능은 학교에 도움이 될까요, 방해가 될까요?"
        }
      },
      {
        "who": "me",
        "text": "Boa noite. Agradeço o convite. O que eu tenho visto nas escolas é que a ferramenta, por si só, não resolve nada.",
        "gloss": {
          "en": "Good evening. Thank you for the invitation. What I've been seeing in schools is that the tool, on its own, solves nothing.",
          "ko": "안녕하세요. 초대해 주셔서 감사합니다. 제가 학교에서 봐 온 건, 도구만으로는 아무것도 해결되지 않는다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "Pode explicar melhor?",
        "gloss": {
          "en": "Could you explain further?",
          "ko": "좀 더 설명해 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Claro. A tecnologia ajuda, contanto que o professor saiba usar. Sem formação, vira só mais uma tela.",
        "gloss": {
          "en": "Sure. Technology helps, as long as the teacher knows how to use it. Without training, it's just one more screen.",
          "ko": "물론이죠. 교사가 쓸 줄 안다면 기술은 도움이 돼요. 교육 없이는 화면 하나 더 늘어날 뿐이고요."
        },
        "frames": [
          "pt-f5-04"
        ]
      },
      {
        "who": "them",
        "text": "Com licença, mas eu discordo. Os alunos aprendem sozinhos, não precisam de professor pra isso.",
        "gloss": {
          "en": "Excuse me, but I disagree. Students learn on their own, they don't need a teacher for that.",
          "ko": "죄송하지만 저는 생각이 달라요. 학생들은 혼자서도 배워요. 그걸 위해 교사가 필요하진 않죠."
        }
      },
      {
        "who": "me",
        "text": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação.",
        "gloss": {
          "en": "With all due respect, it's not quite like that. On the contrary: the easier the tool, the more guidance the student needs.",
          "ko": "외람되지만 꼭 그렇진 않아요. 오히려 도구가 쉬울수록 학생에겐 지도가 더 필요해요."
        },
        "frames": [
          "pt-f5-16",
          "pt-f5-13",
          "pt-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Mas os números mostram que as notas subiram.",
        "gloss": {
          "en": "But the numbers show that grades went up.",
          "ko": "하지만 수치를 보면 성적이 올랐잖아요."
        }
      },
      {
        "who": "me",
        "text": "Subiram em algumas escolas, sim. Aliás, em muitas delas os professores já tinham feito um curso antes.",
        "gloss": {
          "en": "They went up in some schools, yes. By the way, in many of them the teachers had already taken a course beforehand.",
          "ko": "일부 학교에선 올랐죠. 덧붙이자면 그중 상당수는 교사들이 미리 연수를 받은 곳이었어요."
        },
        "frames": [
          "pt-f5-01",
          "pt-f5-14"
        ]
      },
      {
        "who": "them",
        "text": "Interessante. E as escolas sem estrutura?",
        "gloss": {
          "en": "Interesting. And schools without infrastructure?",
          "ko": "흥미롭네요. 그럼 기반 시설이 없는 학교는요?"
        }
      },
      {
        "who": "me",
        "text": "Aí é que está. A não ser que o governo invista em internet, a gente vai aumentar a desigualdade.",
        "gloss": {
          "en": "That's just it. Unless the government invests in internet access, we're going to increase inequality.",
          "ko": "바로 그게 핵심이에요. 정부가 인터넷에 투자하지 않는 한 격차만 더 벌어질 거예요."
        },
        "frames": [
          "pt-f5-03"
        ]
      },
      {
        "who": "them",
        "text": "Isso é discurso bonito, mas na prática ninguém vai investir.",
        "gloss": {
          "en": "That's a nice speech, but in practice no one is going to invest.",
          "ko": "듣기엔 좋은 말이지만, 현실적으로 아무도 투자 안 할 거예요."
        }
      },
      {
        "who": "me",
        "text": "Pode até ser, mas dizer que nada vai mudar é conversa fiada. Inclusive, alguns estados já estão fazendo isso.",
        "gloss": {
          "en": "Maybe, but saying nothing will change is just empty talk. In fact, some states are already doing it.",
          "ko": "그럴 수도 있죠. 하지만 아무것도 안 바뀐다는 건 빈말이에요. 실제로 이미 그렇게 하는 주도 있어요."
        },
        "frames": [
          "pt-f5-15"
        ]
      },
      {
        "who": "them",
        "text": "Temos só um minutinho. Uma mensagem final?",
        "gloss": {
          "en": "We only have a minute left. A final message?",
          "ko": "1분 정도 남았어요. 마지막으로 한마디 하신다면?"
        }
      },
      {
        "who": "me",
        "text": "O que eu peço é simples: não vamos chutar o balde com a escola pública. Com apoio, qualquer professor vai tirar de letra.",
        "gloss": {
          "en": "What I'm asking is simple: let's not give up on public schools. With support, any teacher will handle it with ease.",
          "ko": "제 부탁은 간단해요. 공립학교를 포기하지 말자는 거예요. 지원만 있으면 어떤 교사든 거뜬히 해낼 거예요."
        }
      },
      {
        "who": "them",
        "text": "Obrigada. Uma salva de palmas para nossos convidados!",
        "gloss": {
          "en": "Thank you. A round of applause for our guests!",
          "ko": "감사합니다. 패널분들께 큰 박수 부탁드립니다!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado a vocês. E, sem querer ser chato, mas já sendo: o debate continua lá fora, no café!",
        "gloss": {
          "en": "Thank you all. And, not to be a pain, but here I go: the debate continues outside, over coffee!",
          "ko": "감사합니다. 그리고 귀찮게 하려는 건 아니지만 한마디만요. 토론은 밖에서 커피 마시며 계속됩니다!"
        },
        "frames": [
          "pt-f5-17"
        ]
      }
    ]
  },
  {
    "id": "pt-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "At a hostel bar in Florianópolis with Gustavo from Porto Alegre and Diego from Recife",
      "ko": "플로리아노폴리스 호스텔 바에서 포르투알레그리 출신 구스타부, 헤시피 출신 지에구와"
    },
    "goal": {
      "en": "Keep up with regional ways of speaking, ask about an unfamiliar expression without sounding rude, and try one yourself",
      "ko": "지역마다 다른 말투를 따라가고, 낯선 표현을 실례되지 않게 물어보고, 직접 써 보기"
    },
    "expressions": [
      "aliás",
      "sem querer ser chato",
      "tirar de letra",
      "na real",
      "ficar de boa",
      "vou ver e te falo"
    ],
    "grammar": [
      0,
      1,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "2:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bah, tu é de onde? Tu fala um português bem tranquilo!",
        "gloss": {
          "en": "Wow, where are you from? You speak really relaxed Portuguese!",
          "ko": "와, 어디서 왔어? 포르투갈어 되게 편하게 하네!"
        }
      },
      {
        "who": "me",
        "text": "Obrigado! Sou da Coreia, mas moro em São Paulo faz quatro anos. Tu é do Sul, né?",
        "gloss": {
          "en": "Thanks! I'm from Korea, but I've lived in São Paulo for four years. You're from the South, right?",
          "ko": "고마워! 한국 사람인데 상파울루에 산 지 4년 됐어. 너는 남부 출신이지?"
        },
        "frames": [
          "pt-f5-12"
        ]
      },
      {
        "who": "them",
        "text": "Sou de Porto Alegre, tchê. E esse aqui é o Diego, de Recife.",
        "gloss": {
          "en": "I'm from Porto Alegre, man. And this here is Diego, from Recife.",
          "ko": "포르투알레그리 출신이야. 그리고 얘는 헤시피에서 온 지에구."
        }
      },
      {
        "who": "me",
        "text": "Prazer, Diego! Aliás, eu já tinha ouvido teu sotaque numa novela. Achei lindo.",
        "gloss": {
          "en": "Nice to meet you, Diego! By the way, I'd already heard your accent in a soap opera. I thought it was beautiful.",
          "ko": "반가워, 지에구! 그나저나 네 억양 드라마에서 들어 본 적 있어. 듣기 좋더라."
        },
        "frames": [
          "pt-f5-14",
          "pt-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "Oxe, que massa! Mas novela exagera, viu? A gente não fala tão cantado assim.",
        "gloss": {
          "en": "Oh wow, cool! But soap operas exaggerate, you know? We don't sound that sing-song.",
          "ko": "오, 멋지다! 근데 드라마는 과장이 심해. 우리 그렇게까지 노래하듯 말하진 않아."
        }
      },
      {
        "who": "me",
        "text": "Sem querer ser chato, mas o que eu ainda não entendo é o oxe. É tipo nossa?",
        "gloss": {
          "en": "Not to be a pain, but what I still don't get is oxe. Is it like nossa?",
          "ko": "귀찮게 하려는 건 아닌데, 아직 '오시'가 뭔지 모르겠어. '노사' 같은 거야?"
        },
        "frames": [
          "pt-f5-17",
          "pt-f5-08"
        ]
      },
      {
        "who": "them",
        "text": "Mais ou menos! É surpresa, é susto, é tudo. Depende do tom.",
        "gloss": {
          "en": "Kind of! It's surprise, it's a scare, it's everything. It depends on the tone.",
          "ko": "비슷해! 놀랄 때도, 깜짝할 때도, 다 써. 톤에 따라 달라."
        }
      },
      {
        "who": "me",
        "text": "Entendi. Na primeira vez que eu ouvi, achei que tu tava bravo comigo!",
        "gloss": {
          "en": "Got it. The first time I heard it, I thought you were mad at me!",
          "ko": "그렇구나. 처음 들었을 땐 네가 나한테 화난 줄 알았어!"
        }
      },
      {
        "who": "them",
        "text": "Ha! E aqui no Sul a gente fala bah pra tudo também.",
        "gloss": {
          "en": "Ha! And down here in the South we say bah for everything too.",
          "ko": "하하! 남부에선 우리도 뭐든 '바'라고 해."
        }
      },
      {
        "who": "me",
        "text": "Esse bah eu já vou tirar de letra, tchê!",
        "gloss": {
          "en": "That bah I'm going to nail in no time, man!",
          "ko": "그 '바'는 금방 마스터할 수 있겠다!"
        }
      },
      {
        "who": "them",
        "text": "Ih, já tá pegando o jeito! E em São Paulo, o que vocês falam?",
        "gloss": {
          "en": "Look at you, already getting the hang of it! And in São Paulo, what do you all say?",
          "ko": "오, 벌써 감 잡았네! 상파울루에선 뭐라고 해?"
        }
      },
      {
        "who": "me",
        "text": "Lá é mais meu e mano. Na real, depois de quatro anos, eu nem percebo mais.",
        "gloss": {
          "en": "There it's more meu and mano. Honestly, after four years, I don't even notice anymore.",
          "ko": "거긴 '메우', '마누' 같은 말을 많이 써. 솔직히 4년쯤 되니까 이젠 알아채지도 못해."
        },
        "frames": [
          "pt-f5-19"
        ]
      },
      {
        "who": "them",
        "text": "E ninguém tirou sarro do teu sotaque quando tu chegou?",
        "gloss": {
          "en": "And nobody made fun of your accent when you arrived?",
          "ko": "처음 왔을 때 네 억양 놀린 사람 없었어?"
        }
      },
      {
        "who": "me",
        "text": "Tiraram, mas eu aprendi a ficar de boa. Caso alguém zoe, eu zoo de volta!",
        "gloss": {
          "en": "They did, but I learned to stay chill. If anyone teases me, I tease them back!",
          "ko": "있었지. 근데 그냥 넘기는 법을 배웠어. 누가 놀리면 나도 같이 놀려!"
        },
        "frames": [
          "pt-f5-02"
        ]
      },
      {
        "who": "them",
        "text": "Bora marcar um churrasco com todo mundo então?",
        "gloss": {
          "en": "Shall we set up a barbecue with everyone, then?",
          "ko": "그럼 다 같이 바비큐 날 잡을까?"
        }
      },
      {
        "who": "me",
        "text": "Bora! Vou ver e te falo o dia. Contanto que tenha pão de alho, eu topo qualquer data!",
        "gloss": {
          "en": "Let's! I'll check and tell you the day. As long as there's garlic bread, I'm in for any date!",
          "ko": "좋아! 확인해 보고 날짜 말해 줄게. 마늘빵만 있으면 언제든 콜이야!"
        },
        "frames": [
          "pt-f5-18",
          "pt-f5-04"
        ]
      }
    ]
  },
  {
    "id": "pt-5-x1",
    "stage": 5,
    "setting": {
      "en": "Drafting a formal email to the city hall with a coworker",
      "ko": "동료와 함께 시청에 보낼 격식 있는 이메일 쓰기"
    },
    "expressions": [
      "dar um jeitinho"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Você pode escrever o e-mail pra prefeitura pedindo mais prazo?",
        "gloss": {
          "en": "Can you write the email to city hall asking for more time?",
          "ko": "시청에 기한 연장 요청하는 이메일 좀 써 줄 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "Posso. Vou começar assim: prezados senhores, venho por meio deste solicitar a prorrogação do prazo.",
        "gloss": {
          "en": "Sure. I'll start like this: dear sirs, I hereby request an extension of the deadline.",
          "ko": "응. 이렇게 시작할게. '관계자 여러분, 본 메일을 통해 기한 연장을 요청드립니다.'"
        },
        "frames": [
          "pt-f5-09"
        ]
      },
      {
        "who": "them",
        "text": "Muito formal, não? Não dá pra ser mais leve?",
        "gloss": {
          "en": "Very formal, no? Can't it be lighter?",
          "ko": "너무 딱딱하지 않아? 좀 가볍게 하면 안 돼?"
        }
      },
      {
        "who": "me",
        "text": "Com órgão público, não. Lá não tem como dar um jeitinho; tem que seguir o protocolo.",
        "gloss": {
          "en": "Not with a public agency. There's no way to bend the rules there; you have to follow protocol.",
          "ko": "관공서엔 안 돼. 거긴 융통성 부릴 여지가 없어. 절차대로 해야 해."
        },
        "frames": [
          "pt-f4-15"
        ]
      },
      {
        "who": "them",
        "text": "Tá. E como você justifica o atraso?",
        "gloss": {
          "en": "OK. And how do you justify the delay?",
          "ko": "알았어. 지연 이유는 어떻게 써?"
        }
      },
      {
        "who": "me",
        "text": "Assim: informamos que o atraso decorreu da demora na entrega dos documentos por parte do fornecedor.",
        "gloss": {
          "en": "Like this: we inform you that the delay resulted from the supplier's late delivery of the documents.",
          "ko": "이렇게. '이번 지연은 공급업체의 서류 전달 지연으로 인해 발생하였음을 알려 드립니다.'"
        },
        "frames": [
          "pt-f5-11"
        ]
      },
      {
        "who": "them",
        "text": "Perfeito. E no final?",
        "gloss": {
          "en": "Perfect. And at the end?",
          "ko": "완벽해. 마무리는?"
        }
      },
      {
        "who": "me",
        "text": "Agradecemos desde já a atenção e permanecemos à disposição para quaisquer esclarecimentos.",
        "gloss": {
          "en": "We thank you in advance for your attention and remain available for any clarification.",
          "ko": "'관심에 미리 감사드리며, 문의 사항이 있으시면 언제든 연락 주십시오.'"
        },
        "frames": [
          "pt-f5-10"
        ]
      }
    ]
  }
];
