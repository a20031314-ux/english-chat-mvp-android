import type { StageScript } from "../stageScripts.ts";

/** it 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const IT: StageScript[] = [
  {
    "id": "it-1-1",
    "name": {
      "text": [
        "Minji"
      ],
      "en": [
        "Minji"
      ],
      "ko": [
        "민지"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "At a language exchange evening: meeting Luca for the first time",
      "ko": "언어 교환 모임에서 루카를 처음 만나기"
    },
    "expressions": [
      "ciao",
      "mi chiamo",
      "piacere",
      "sono di",
      "grazie"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Sono Luca. Tu come ti chiami?",
        "gloss": {
          "en": "Hi! I'm Luca. What's your name?",
          "ko": "안녕! 나는 루카야. 너는 이름이 뭐야?"
        }
      },
      {
        "who": "me",
        "text": "Ciao, Luca! Mi chiamo Minji. Piacere!",
        "gloss": {
          "en": "Hi, Luca! My name is Minji. Nice to meet you!",
          "ko": "안녕, 루카! 나는 민지야. 반가워!"
        },
        "frames": [
          "it-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Piacere mio! Di dove sei?",
        "gloss": {
          "en": "Nice to meet you too! Where are you from?",
          "ko": "나도 반가워! 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "Sono di Seul. Sono coreana.",
        "gloss": {
          "en": "I'm from Seoul. I'm Korean.",
          "ko": "서울에서 왔어. 한국 사람이야."
        },
        "frames": [
          "it-f1-02",
          "it-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! E che cosa fai qui in Italia?",
        "gloss": {
          "en": "How nice! And what do you do here in Italy?",
          "ko": "멋지다! 그럼 이탈리아에서는 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Studio l'italiano e lavoro in un bar.",
        "gloss": {
          "en": "I study Italian and I work in a café.",
          "ko": "이탈리아어를 공부하고 카페에서 일해."
        },
        "frames": [
          "it-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Brava! Parli già molto bene.",
        "gloss": {
          "en": "Well done! You already speak very well.",
          "ko": "대단하다! 벌써 말 잘하네."
        }
      },
      {
        "who": "me",
        "text": "Grazie, ma non parlo ancora bene.",
        "gloss": {
          "en": "Thanks, but I don't speak well yet.",
          "ko": "고마워, 그래도 아직 잘 못해."
        },
        "frames": [
          "it-f1-11"
        ]
      }
    ]
  },
  {
    "id": "it-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "At a newsstand, buying a bus ticket",
      "ko": "신문 가판대에서 버스표 사기"
    },
    "expressions": [
      "buongiorno",
      "per favore",
      "quanto costa",
      "scusi",
      "va bene",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      2,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno, mi dica.",
        "gloss": {
          "en": "Good morning, what can I get you?",
          "ko": "안녕하세요, 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buongiorno. Vorrei un biglietto dell'autobus, per favore.",
        "gloss": {
          "en": "Good morning. I'd like a bus ticket, please.",
          "ko": "안녕하세요. 버스표 한 장 주세요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Uno solo? Ecco a lei.",
        "gloss": {
          "en": "Just one? Here you are.",
          "ko": "한 장만요? 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Quanto costa il biglietto?",
        "gloss": {
          "en": "How much is the ticket?",
          "ko": "표가 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Un euro e settanta.",
        "gloss": {
          "en": "One euro seventy.",
          "ko": "1유로 70센트예요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Scusi, c'è una fermata qui vicino?",
        "gloss": {
          "en": "Here you go. Excuse me, is there a stop near here?",
          "ko": "여기요. 저기요, 이 근처에 정류장 있어요?"
        },
        "frames": [
          "it-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Sì, certo. È proprio lì, davanti alla farmacia.",
        "gloss": {
          "en": "Yes, of course. It's right there, in front of the pharmacy.",
          "ko": "네, 그럼요. 바로 저기, 약국 앞에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Va bene, grazie mille. Arrivederci!",
        "gloss": {
          "en": "OK, thanks a lot. Goodbye!",
          "ko": "알겠어요, 정말 고맙습니다. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "In the street, asking a passer-by the way to the station",
      "ko": "길에서 지나가는 사람에게 역 가는 길 묻기"
    },
    "expressions": [
      "scusi",
      "non capisco",
      "può ripetere",
      "per favore",
      "va bene",
      "grazie"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Sì? Ha bisogno di aiuto?",
        "gloss": {
          "en": "Yes? Do you need help?",
          "ko": "네? 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Scusi, dov'è la stazione?",
        "gloss": {
          "en": "Excuse me, where is the station?",
          "ko": "실례합니다, 역이 어디예요?"
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "La stazione? Allora, vada dritto e poi giri a sinistra in via Garibaldi.",
        "gloss": {
          "en": "The station? So, go straight and then turn left onto Via Garibaldi.",
          "ko": "역이요? 음, 쭉 가다가 가리발디 거리에서 왼쪽으로 도세요."
        }
      },
      {
        "who": "me",
        "text": "Scusi, non capisco. Può ripetere, per favore?",
        "gloss": {
          "en": "Sorry, I don't understand. Could you repeat, please?",
          "ko": "죄송해요, 못 알아들었어요. 다시 말씀해 주시겠어요?"
        },
        "frames": [
          "it-f1-12",
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Dritto, poi a sinistra. Sono cinque minuti a piedi.",
        "gloss": {
          "en": "Sure. Straight, then left. It's five minutes on foot.",
          "ko": "그럼요. 쭉 가서 왼쪽이요. 걸어서 5분이에요."
        }
      },
      {
        "who": "me",
        "text": "Ah, va bene. Allora non è lontano.",
        "gloss": {
          "en": "Ah, OK. So it's not far.",
          "ko": "아, 알겠어요. 그럼 멀지 않네요."
        }
      },
      {
        "who": "them",
        "text": "No, no, è vicinissimo. Buona giornata!",
        "gloss": {
          "en": "No, no, it's very close. Have a nice day!",
          "ko": "네, 아주 가까워요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Grazie, buona giornata anche a lei!",
        "gloss": {
          "en": "Thank you, have a nice day too!",
          "ko": "고맙습니다, 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "At a fruit and vegetable stall in a street market",
      "ko": "거리 시장 과일·채소 가판대에서"
    },
    "expressions": [
      "buonasera",
      "quanto costa",
      "va bene",
      "lo prendo",
      "grazie",
      "un attimo",
      "a presto"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera! Cosa le do?",
        "gloss": {
          "en": "Good evening! What can I get you?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buonasera. Quanto costa un chilo di pomodori?",
        "gloss": {
          "en": "Good evening. How much is a kilo of tomatoes?",
          "ko": "안녕하세요. 토마토 1킬로에 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Due euro al chilo. Sono buonissimi, di oggi.",
        "gloss": {
          "en": "Two euros a kilo. They're excellent, picked today.",
          "ko": "1킬로에 2유로예요. 오늘 딴 거라 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Va bene, lo prendo. Vorrei anche un melone.",
        "gloss": {
          "en": "OK, I'll take it. I'd also like a melon.",
          "ko": "좋아요, 그걸로 할게요. 멜론도 하나 주세요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Ecco a lei. Altro?",
        "gloss": {
          "en": "Of course. Here you are. Anything else?",
          "ko": "네. 여기 있어요. 더 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "No, grazie. Ho tutto.",
        "gloss": {
          "en": "No, thanks. I have everything.",
          "ko": "아니요, 괜찮아요. 다 샀어요."
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Allora sono quattro euro e cinquanta.",
        "gloss": {
          "en": "So that's four euros fifty.",
          "ko": "그럼 4유로 50센트예요."
        }
      },
      {
        "who": "me",
        "text": "Un attimo... ecco a lei. Grazie, a presto!",
        "gloss": {
          "en": "Just a moment... here you are. Thanks, see you soon!",
          "ko": "잠깐만요... 여기요. 고마워요, 또 올게요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-1-x1",
    "stage": 1,
    "setting": {
      "en": "In a café: a stranger asks about the chair next to you",
      "ko": "카페에서 옆 사람이 의자를 써도 되는지 묻는다"
    },
    "expressions": [
      "certo",
      "prego",
      "sono di",
      "grazie",
      "scusi",
      "dov'è il bagno"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Scusi, è libera questa sedia?",
        "gloss": {
          "en": "Excuse me, is this chair free?",
          "ko": "실례지만, 이 의자 비었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, certo. Prego!",
        "gloss": {
          "en": "Yes, of course. Go ahead!",
          "ko": "네, 그럼요. 쓰세요!"
        }
      },
      {
        "who": "them",
        "text": "Grazie mille. Lei è di qui?",
        "gloss": {
          "en": "Thanks a lot. Are you from here?",
          "ko": "정말 고마워요. 여기 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "No, sono di Busan, in Corea.",
        "gloss": {
          "en": "No, I'm from Busan, in Korea.",
          "ko": "아니요, 한국 부산에서 왔어요."
        },
        "frames": [
          "it-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Ah, che bello! Benvenuta a Bologna!",
        "gloss": {
          "en": "Oh, how nice! Welcome to Bologna!",
          "ko": "아, 멋지네요! 볼로냐에 온 걸 환영해요!"
        }
      },
      {
        "who": "me",
        "text": "Grazie! Scusi, dov'è il bagno?",
        "gloss": {
          "en": "Thank you! Excuse me, where is the bathroom?",
          "ko": "고마워요! 저기, 화장실이 어디예요?"
        },
        "frames": [
          "it-f1-08"
        ]
      }
    ]
  },
  {
    "id": "it-2-1",
    "name": {
      "text": [
        "Minji"
      ],
      "en": [
        "Minji"
      ],
      "ko": [
        "민지"
      ]
    },
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Making weekend plans with your friend Giulia",
      "ko": "친구 줄리아와 주말 약속 잡기"
    },
    "expressions": [
      "tutto bene",
      "come stai",
      "davvero",
      "che bello",
      "mi piacerebbe",
      "d'accordo",
      "a che ora",
      "ci vediamo"
    ],
    "grammar": [
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao Minji! Come stai?",
        "gloss": {
          "en": "Hi Minji! How are you?",
          "ko": "안녕 민지! 잘 지내?"
        }
      },
      {
        "who": "me",
        "text": "Ciao Giulia! Tutto bene, grazie. E tu come stai?",
        "gloss": {
          "en": "Hi Giulia! All good, thanks. And how are you?",
          "ko": "안녕 줄리아! 다 좋아, 고마워. 너는 어떻게 지내?"
        }
      },
      {
        "who": "them",
        "text": "Bene! Senti, che fai sabato? Io e Marco andiamo al lago.",
        "gloss": {
          "en": "Good! Listen, what are you doing on Saturday? Marco and I are going to the lake.",
          "ko": "잘 지내! 있잖아, 토요일에 뭐 해? 나랑 마르코는 호수에 가."
        }
      },
      {
        "who": "me",
        "text": "Davvero? Che bello! Mi piacerebbe venire.",
        "gloss": {
          "en": "Really? How nice! I'd love to come.",
          "ko": "정말? 좋겠다! 나도 가고 싶어."
        }
      },
      {
        "who": "them",
        "text": "Dai, vieni con noi! Ti piace nuotare?",
        "gloss": {
          "en": "Come on, come with us! Do you like swimming?",
          "ko": "그럼 같이 가자! 수영 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Sì, mi piace molto. Ma sabato mattina lavoro.",
        "gloss": {
          "en": "Yes, I like it a lot. But on Saturday morning I'm working.",
          "ko": "응, 아주 좋아해. 그런데 토요일 오전엔 일해."
        },
        "frames": [
          "it-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Che peccato! Allora partiamo nel pomeriggio, va bene?",
        "gloss": {
          "en": "What a shame! Then we'll leave in the afternoon, OK?",
          "ko": "아쉽다! 그럼 오후에 출발하자, 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "D'accordo. A che ora partite?",
        "gloss": {
          "en": "OK. What time are you leaving?",
          "ko": "좋아. 몇 시에 출발해?"
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Alle tre. Ci vediamo alla stazione?",
        "gloss": {
          "en": "At three. Shall we meet at the station?",
          "ko": "3시에. 역에서 만날까?"
        }
      },
      {
        "who": "me",
        "text": "Perfetto, ci vediamo alla stazione alle tre. A sabato!",
        "gloss": {
          "en": "Perfect, see you at the station at three. See you Saturday!",
          "ko": "좋아, 3시에 역에서 보자. 토요일에 봐!"
        },
        "frames": [
          "it-f2-13"
        ]
      }
    ]
  },
  {
    "id": "it-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Dinner at a trattoria in Bologna",
      "ko": "볼로냐의 트라토리아에서 저녁 식사"
    },
    "expressions": [
      "cosa mi consiglia",
      "posso fare una foto",
      "il conto"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera! Avete prenotato?",
        "gloss": {
          "en": "Good evening! Do you have a reservation?",
          "ko": "안녕하세요! 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ho prenotato un tavolo per due, a nome Kim.",
        "gloss": {
          "en": "Yes, I booked a table for two, under the name Kim.",
          "ko": "네, 김 이름으로 두 명 자리 예약했어요."
        }
      },
      {
        "who": "them",
        "text": "Benissimo, prego. Ecco il menù.",
        "gloss": {
          "en": "Very good, this way. Here's the menu.",
          "ko": "좋습니다, 이쪽으로 오세요. 메뉴판 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Cosa mi consiglia stasera?",
        "gloss": {
          "en": "Thank you. What do you recommend tonight?",
          "ko": "감사합니다. 오늘 저녁엔 뭘 추천하세요?"
        },
        "frames": [
          "it-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Oggi abbiamo le tagliatelle al ragù, fatte in casa.",
        "gloss": {
          "en": "Today we have tagliatelle with ragù, homemade.",
          "ko": "오늘은 직접 만든 라구 탈리아텔레가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, per me le tagliatelle. Mi piacciono molto.",
        "gloss": {
          "en": "Perfect, the tagliatelle for me. I really like them.",
          "ko": "좋아요, 저는 탈리아텔레로 할게요. 아주 좋아해요."
        },
        "frames": [
          "it-f2-17",
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Ottima scelta. Ecco a lei, buon appetito!",
        "gloss": {
          "en": "Excellent choice. Here you are, enjoy your meal!",
          "ko": "탁월한 선택이에요. 여기 나왔습니다, 맛있게 드세요!"
        }
      },
      {
        "who": "me",
        "text": "Che profumo! Posso fare una foto prima di mangiare?",
        "gloss": {
          "en": "That smells great! Can I take a photo before eating?",
          "ko": "냄새 좋다! 먹기 전에 사진 찍어도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Certo, faccia pure! ... Allora, tutto bene? Le è piaciuto?",
        "gloss": {
          "en": "Of course, go ahead! ... So, everything all right? Did you enjoy it?",
          "ko": "그럼요, 찍으세요! ... 자, 괜찮으셨어요? 맛있으셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ho mangiato benissimo. Il conto, per favore.",
        "gloss": {
          "en": "Yes, I ate really well. The bill, please.",
          "ko": "네, 정말 맛있게 먹었어요. 계산서 주세요."
        }
      }
    ]
  },
  {
    "id": "it-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "At a pharmacy, describing a headache to the pharmacist",
      "ko": "약국에서 약사에게 두통 설명하기"
    },
    "expressions": [
      "mi fa male la testa",
      "non ancora",
      "d'accordo"
    ],
    "grammar": [
      0,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno, mi dica.",
        "gloss": {
          "en": "Good morning, how can I help?",
          "ko": "안녕하세요, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Buongiorno. Mi fa male la testa da ieri.",
        "gloss": {
          "en": "Good morning. I've had a headache since yesterday.",
          "ko": "안녕하세요. 어제부터 머리가 아파요."
        },
        "frames": [
          "it-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Mi dispiace. Ha già preso qualcosa?",
        "gloss": {
          "en": "I'm sorry. Have you taken anything yet?",
          "ko": "저런. 뭐 드신 약은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "No, non ancora. Ieri sera ho lavorato fino a tardi.",
        "gloss": {
          "en": "No, not yet. Last night I worked until late.",
          "ko": "아니요, 아직이요. 어젯밤에 늦게까지 일했어요."
        },
        "frames": [
          "it-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Dorme bene in questi giorni?",
        "gloss": {
          "en": "Are you sleeping well these days?",
          "ko": "요즘 잠은 잘 주무세요?"
        }
      },
      {
        "who": "me",
        "text": "Non molto. La mattina mi sveglio sempre alle cinque.",
        "gloss": {
          "en": "Not really. In the morning I always wake up at five.",
          "ko": "별로요. 아침에 늘 5시에 깨요."
        },
        "frames": [
          "it-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Allora le do queste compresse. Una ogni otto ore, dopo i pasti.",
        "gloss": {
          "en": "Then I'll give you these tablets. One every eight hours, after meals.",
          "ko": "그럼 이 알약을 드릴게요. 8시간마다 한 알, 식후에요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Posso bere il caffè?",
        "gloss": {
          "en": "OK. Can I drink coffee?",
          "ko": "알겠어요. 커피 마셔도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Meglio di no, oggi niente caffè. E si riposi!",
        "gloss": {
          "en": "Better not, no coffee today. And get some rest!",
          "ko": "안 드시는 게 좋아요, 오늘은 커피 금지예요. 그리고 푹 쉬세요!"
        }
      },
      {
        "who": "me",
        "text": "D'accordo, grazie. Domani resto a casa e mi riposo.",
        "gloss": {
          "en": "OK, thank you. Tomorrow I'm staying home and resting.",
          "ko": "알겠어요, 감사합니다. 내일은 집에서 쉴게요."
        },
        "frames": [
          "it-f2-09"
        ]
      }
    ]
  },
  {
    "id": "it-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "At the office, checking this week's schedule with your coworker Sara",
      "ko": "사무실에서 동료 사라와 이번 주 일정 확인하기"
    },
    "expressions": [
      "ho già finito",
      "volentieri",
      "a che ora",
      "a domani"
    ],
    "grammar": [
      0,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Stai lavorando alla presentazione?",
        "gloss": {
          "en": "Hi! Are you working on the presentation?",
          "ko": "안녕! 발표 자료 만드는 중이야?"
        }
      },
      {
        "who": "me",
        "text": "Sì, sto scrivendo le ultime slide.",
        "gloss": {
          "en": "Yes, I'm writing the last slides.",
          "ko": "응, 마지막 슬라이드 쓰고 있어."
        },
        "frames": [
          "it-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Bene. Giovedì c'è la riunione con il cliente, giusto?",
        "gloss": {
          "en": "Good. On Thursday there's the meeting with the client, right?",
          "ko": "좋아. 목요일에 고객 회의 있지, 맞지?"
        }
      },
      {
        "who": "me",
        "text": "Sì, giovedì alle dieci. Ma mercoledì vado a Milano.",
        "gloss": {
          "en": "Yes, Thursday at ten. But on Wednesday I'm going to Milan.",
          "ko": "응, 목요일 10시. 그런데 수요일엔 밀라노에 가."
        }
      },
      {
        "who": "them",
        "text": "Ah, è vero. E il report per Paolo?",
        "gloss": {
          "en": "Oh, that's right. And the report for Paolo?",
          "ko": "아, 맞다. 그럼 파올로한테 줄 보고서는?"
        }
      },
      {
        "who": "me",
        "text": "Ho già finito il report, ieri sera.",
        "gloss": {
          "en": "I already finished the report, last night.",
          "ko": "보고서는 어젯밤에 벌써 끝냈어."
        },
        "frames": [
          "it-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Grande! Allora domani possiamo controllare i numeri insieme?",
        "gloss": {
          "en": "Great! So tomorrow can we check the numbers together?",
          "ko": "최고! 그럼 내일 같이 숫자 확인할 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "Volentieri. A che ora? Io arrivo in ufficio alle nove.",
        "gloss": {
          "en": "Gladly. What time? I get to the office at nine.",
          "ko": "좋아. 몇 시에? 나는 9시에 사무실 도착해."
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Facciamo alle dieci, nella sala piccola.",
        "gloss": {
          "en": "Let's say ten, in the small meeting room.",
          "ko": "10시에 작은 회의실에서 하자."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, alle dieci nella sala piccola. A domani!",
        "gloss": {
          "en": "Perfect, at ten in the small room. See you tomorrow!",
          "ko": "좋아, 10시에 작은 회의실. 내일 봐!"
        }
      }
    ]
  },
  {
    "id": "it-2-x1",
    "stage": 2,
    "setting": {
      "en": "Monday morning: a friend asks about your weekend",
      "ko": "월요일 아침, 친구가 주말 이야기를 묻는다"
    },
    "expressions": [
      "che fai stasera",
      "che peccato"
    ],
    "grammar": [
      1,
      7
    ],
    "earlierGrammar": [
      "1:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ehi, ciao! Com'è andato il weekend?",
        "gloss": {
          "en": "Hey, hi! How was the weekend?",
          "ko": "어, 안녕! 주말 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Benissimo! Sabato sono andato al mare con mia sorella.",
        "gloss": {
          "en": "Great! On Saturday I went to the seaside with my sister.",
          "ko": "아주 좋았어! 토요일에 여동생이랑 바다에 갔어."
        },
        "frames": [
          "it-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! Siete tornati tardi?",
        "gloss": {
          "en": "How nice! Did you get back late?",
          "ko": "좋았겠다! 늦게 돌아왔어?"
        }
      },
      {
        "who": "me",
        "text": "Sì, siamo tornati a mezzanotte. E tu, che fai stasera?",
        "gloss": {
          "en": "Yes, we got back at midnight. And you, what are you doing tonight?",
          "ko": "응, 자정에 왔어. 너는 오늘 저녁에 뭐 해?"
        }
      },
      {
        "who": "them",
        "text": "Niente di speciale. Perché?",
        "gloss": {
          "en": "Nothing special. Why?",
          "ko": "별일 없어. 왜?"
        }
      },
      {
        "who": "me",
        "text": "C'è un concerto al parco. Ti va di venire?",
        "gloss": {
          "en": "There's a concert in the park. Do you feel like coming?",
          "ko": "공원에서 콘서트가 있어. 같이 갈래?"
        },
        "frames": [
          "it-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Mi piacerebbe, ma stasera lavoro fino a tardi.",
        "gloss": {
          "en": "I'd love to, but tonight I'm working late.",
          "ko": "가고 싶은데, 오늘은 늦게까지 일해."
        }
      },
      {
        "who": "me",
        "text": "Che peccato! Allora la prossima volta.",
        "gloss": {
          "en": "What a shame! Next time, then.",
          "ko": "아쉽다! 그럼 다음에 가자."
        },
        "frames": [
          "it-f2-12"
        ]
      }
    ]
  },
  {
    "id": "it-2-x2",
    "stage": 2,
    "setting": {
      "en": "On the phone with a friend: you're lost on the way to a dinner",
      "ko": "친구와 통화 중, 저녁 모임 가는 길에 길을 잃었다"
    },
    "expressions": [
      "mi sono perso",
      "davvero",
      "in bocca al lupo",
      "buon appetito"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pronto? Dove sei? Siamo già tutti a tavola!",
        "gloss": {
          "en": "Hello? Where are you? We're all already at the table!",
          "ko": "여보세요? 어디야? 다들 벌써 앉아 있어!"
        }
      },
      {
        "who": "me",
        "text": "Scusa, mi sono perso! Sono uscito dalla metro sbagliata.",
        "gloss": {
          "en": "Sorry, I got lost! I came out of the wrong metro exit.",
          "ko": "미안, 길을 잃었어! 지하철에서 엉뚱한 데로 나왔어."
        }
      },
      {
        "who": "them",
        "text": "Ma dai! Cosa vedi intorno a te?",
        "gloss": {
          "en": "No way! What can you see around you?",
          "ko": "에이! 주변에 뭐가 보여?"
        }
      },
      {
        "who": "me",
        "text": "Sto passando davanti a una chiesa grande.",
        "gloss": {
          "en": "I'm walking past a big church.",
          "ko": "큰 성당 앞을 지나가고 있어."
        },
        "frames": [
          "it-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Ah, sei vicinissimo! Gira a destra, il ristorante è lì.",
        "gloss": {
          "en": "Oh, you're really close! Turn right, the restaurant is there.",
          "ko": "아, 거의 다 왔네! 오른쪽으로 돌면 식당이 있어."
        }
      },
      {
        "who": "me",
        "text": "Ah, sì, eccolo! Arrivo subito.",
        "gloss": {
          "en": "Oh yes, there it is! I'll be right there.",
          "ko": "아, 저기 있다! 금방 갈게."
        }
      },
      {
        "who": "them",
        "text": "Finalmente! Siediti. Sai, domani ho l'esame di guida.",
        "gloss": {
          "en": "Finally! Sit down. You know, tomorrow I have my driving test.",
          "ko": "드디어! 앉아. 있잖아, 나 내일 운전면허 시험이야."
        }
      },
      {
        "who": "me",
        "text": "Davvero? In bocca al lupo! E adesso buon appetito!",
        "gloss": {
          "en": "Really? Good luck! And now, enjoy your meal!",
          "ko": "정말? 잘 보고 와! 그리고 이제 맛있게 먹자!"
        }
      }
    ]
  },
  {
    "id": "it-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Arriving half an hour late to meet your friend Marco at the cinema",
      "ko": "영화관 앞에서 기다리던 친구 마르코에게 30분 늦게 도착"
    },
    "expressions": [
      "scusa il ritardo",
      "che casino",
      "comunque",
      "dai",
      "allora",
      "per fortuna"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eccoti finalmente! Ti aspetto da mezz'ora!",
        "gloss": {
          "en": "There you are at last! I've been waiting for half an hour!",
          "ko": "드디어 왔네! 30분이나 기다렸어!"
        },
        "alt": [
          {
            "text": "Ah, sei arrivata! Cominciavo a preoccuparmi.",
            "gloss": {
              "en": "Ah, you're here! I was starting to worry.",
              "ko": "아, 왔구나! 걱정되기 시작했어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Scusa il ritardo! Il treno era fermo e non partiva più.",
        "gloss": {
          "en": "Sorry I'm late! The train was stopped and just wouldn't leave.",
          "ko": "늦어서 미안! 기차가 서 있고 도무지 출발을 안 했어."
        },
        "frames": [
          "it-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Sul serio? Di nuovo?",
        "gloss": {
          "en": "Seriously? Again?",
          "ko": "진짜? 또?"
        },
        "alt": [
          {
            "text": "Ma come? Un altro sciopero?",
            "gloss": {
              "en": "What? Another strike?",
              "ko": "뭐라고? 또 파업이야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Sì, che casino. Mentre aspettavo, ho provato a chiamarti, ma non rispondevi.",
        "gloss": {
          "en": "Yes, what a mess. While I was waiting, I tried to call you, but you didn't answer.",
          "ko": "응, 난리였어. 기다리는 동안 전화했는데 안 받더라."
        },
        "frames": [
          "it-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Ah, è vero, il telefono era in borsa. Non l'ho sentito.",
        "gloss": {
          "en": "Oh, right, my phone was in my bag. I didn't hear it.",
          "ko": "아, 맞다, 휴대폰이 가방에 있었어. 못 들었어."
        }
      },
      {
        "who": "me",
        "text": "Comunque ti ho mandato anche un messaggio. Non l'hai visto?",
        "gloss": {
          "en": "Anyway, I also sent you a message. Didn't you see it?",
          "ko": "어쨌든 문자도 보냈어. 못 봤어?"
        }
      },
      {
        "who": "them",
        "text": "No, scusa, non l'ho guardato. Vabbè, non importa.",
        "gloss": {
          "en": "No, sorry, I didn't look at it. Oh well, it doesn't matter.",
          "ko": "아니, 미안, 안 봤어. 뭐, 괜찮아."
        }
      },
      {
        "who": "me",
        "text": "Mi dispiace davvero. Dai, il caffè dopo lo offro io.",
        "gloss": {
          "en": "I'm really sorry. Come on, the coffee afterwards is on me.",
          "ko": "정말 미안해. 이따 커피는 내가 살게."
        }
      },
      {
        "who": "them",
        "text": "Ma no, non ti preoccupare! Però il film comincia tra dieci minuti.",
        "gloss": {
          "en": "Oh no, don't worry! But the film starts in ten minutes.",
          "ko": "아냐, 신경 쓰지 마! 그런데 영화가 10분 뒤에 시작해."
        },
        "alt": [
          {
            "text": "Figurati, sono cose che capitano. Però il film sta per cominciare.",
            "gloss": {
              "en": "Don't mention it, these things happen. But the film is about to start.",
              "ko": "괜찮아, 그럴 수도 있지. 그런데 영화 곧 시작해."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Allora andiamo subito. Per fortuna la sala è qui vicino.",
        "gloss": {
          "en": "Then let's go right away. Luckily the screen is close by.",
          "ko": "그럼 바로 가자. 다행히 상영관이 바로 근처야."
        },
        "frames": [
          "it-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Sì, ce la facciamo. Hai preso i biglietti?",
        "gloss": {
          "en": "Yes, we'll make it. Did you get the tickets?",
          "ko": "응, 시간 맞출 수 있어. 표는 샀어?"
        }
      },
      {
        "who": "me",
        "text": "Sì, li ho comprati online ieri sera. Eccoli!",
        "gloss": {
          "en": "Yes, I bought them online last night. Here they are!",
          "ko": "응, 어젯밤에 인터넷으로 샀어. 여기!"
        }
      }
    ]
  },
  {
    "id": "it-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling reception from your hotel room: the air conditioning is broken",
      "ko": "호텔 방에서 프런트에 전화: 에어컨이 고장 났다"
    },
    "expressions": [
      "purtroppo",
      "insomma",
      "non fa niente",
      "ho capito",
      "meno male"
    ],
    "grammar": [
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera, reception. Come posso aiutarla?",
        "gloss": {
          "en": "Good evening, reception. How can I help you?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "Buonasera, mi dica pure.",
            "gloss": {
              "en": "Good evening, go ahead.",
              "ko": "안녕하세요, 말씀하세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Buonasera, chiamo dalla camera trecentododici. Purtroppo l'aria condizionata non funziona.",
        "gloss": {
          "en": "Good evening, I'm calling from room three hundred twelve. Unfortunately the air conditioning isn't working.",
          "ko": "안녕하세요, 312호인데요. 아쉽게도 에어컨이 안 돼요."
        },
        "frames": [
          "it-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Mi dispiace. Ha provato con il telecomando?",
        "gloss": {
          "en": "I'm sorry. Have you tried the remote control?",
          "ko": "죄송합니다. 리모컨으로 해 보셨어요?"
        },
        "alt": [
          {
            "text": "Ah, mi scusi. Ha controllato che la finestra sia chiusa?",
            "gloss": {
              "en": "Oh, I'm sorry. Have you checked that the window is closed?",
              "ko": "아, 죄송합니다. 창문이 닫혀 있는지 확인해 보셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Sì, ci ho provato tre volte, ma non succede niente.",
        "gloss": {
          "en": "Yes, I've tried three times, but nothing happens.",
          "ko": "네, 세 번이나 해 봤는데 아무 반응이 없어요."
        }
      },
      {
        "who": "them",
        "text": "Capisco. Il tecnico purtroppo arriva solo domani mattina.",
        "gloss": {
          "en": "I see. Unfortunately the technician only comes tomorrow morning.",
          "ko": "알겠습니다. 기사님은 아쉽게도 내일 아침에야 와요."
        }
      },
      {
        "who": "me",
        "text": "Insomma, stanotte dormo al caldo? Potrebbe cambiarmi la camera?",
        "gloss": {
          "en": "So basically I'm sleeping in the heat tonight? Could you change my room?",
          "ko": "그러니까 오늘 밤엔 더위 속에서 자라는 거죠? 방을 바꿔 주실 수 있을까요?"
        },
        "frames": [
          "it-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Vediamo... Sì, c'è una camera libera al quarto piano, ma dà sulla strada.",
        "gloss": {
          "en": "Let's see... Yes, there's a free room on the fourth floor, but it faces the street.",
          "ko": "어디 보자... 네, 4층에 빈방이 있는데 길가 쪽이에요."
        },
        "alt": [
          {
            "text": "Un attimo che controllo... Ne ho una al quarto piano, però è un po' rumorosa.",
            "gloss": {
              "en": "One moment, let me check... I have one on the fourth floor, but it's a bit noisy.",
              "ko": "잠시만요, 확인해 볼게요... 4층에 하나 있는데 좀 시끄러워요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Non fa niente, la prendo. Penso che sia meglio del caldo.",
        "gloss": {
          "en": "It doesn't matter, I'll take it. I think it's better than the heat.",
          "ko": "괜찮아요, 그걸로 할게요. 더운 것보단 나을 것 같아요."
        },
        "frames": [
          "it-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Perfetto. Le preparo la nuova chiave, può passare a prenderla qui.",
        "gloss": {
          "en": "Perfect. I'll prepare the new key for you, you can come and pick it up here.",
          "ko": "좋습니다. 새 키를 준비해 둘 테니 여기로 가지러 오세요."
        }
      },
      {
        "who": "me",
        "text": "Ho capito, scendo tra cinque minuti. Meno male!",
        "gloss": {
          "en": "Got it, I'll come down in five minutes. Thank goodness!",
          "ko": "알겠어요, 5분 뒤에 내려갈게요. 다행이다!"
        }
      },
      {
        "who": "them",
        "text": "Si figuri. E ci scusi ancora per il disagio.",
        "gloss": {
          "en": "Not at all. And sorry again for the inconvenience.",
          "ko": "별말씀을요. 불편을 드려 다시 한번 죄송합니다."
        }
      },
      {
        "who": "me",
        "text": "Grazie mille. Ne approfitto: a che ora è la colazione?",
        "gloss": {
          "en": "Thanks a lot. While I'm at it: what time is breakfast?",
          "ko": "정말 감사해요. 하는 김에 여쭤볼게요, 아침 식사는 몇 시예요?"
        }
      }
    ]
  },
  {
    "id": "it-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Chatting with your friend Chiara about a series she recommended",
      "ko": "친구 키아라가 추천한 드라마 이야기"
    },
    "expressions": [
      "infatti",
      "boh",
      "dai",
      "non vedo l'ora",
      "magari"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora, hai finito la serie che ti ho consigliato?",
        "gloss": {
          "en": "So, have you finished the series I recommended?",
          "ko": "그래서, 내가 추천한 드라마 다 봤어?"
        },
        "alt": [
          {
            "text": "Ehi, poi l'hai vista la serie di cui ti parlavo?",
            "gloss": {
              "en": "Hey, did you end up watching the series I was telling you about?",
              "ko": "야, 내가 말한 그 드라마 결국 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Quasi! Ieri sera ne ho visti tre episodi di fila.",
        "gloss": {
          "en": "Almost! Last night I watched three episodes in a row.",
          "ko": "거의! 어젯밤에 세 편 연달아 봤어."
        },
        "frames": [
          "it-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Sul serio? E ti piace?",
        "gloss": {
          "en": "Seriously? And do you like it?",
          "ko": "진짜? 그래서 재밌어?"
        }
      },
      {
        "who": "me",
        "text": "Tantissimo! Infatti non riuscivo a smettere. All'inizio però era un po' lenta.",
        "gloss": {
          "en": "So much! In fact I couldn't stop. At the beginning, though, it was a bit slow.",
          "ko": "엄청! 그래서 멈출 수가 없었어. 근데 처음엔 좀 느렸어."
        }
      },
      {
        "who": "them",
        "text": "Vero, all'inizio sì. Ma il personaggio di Elena?",
        "gloss": {
          "en": "True, at the start yes. But what about Elena's character?",
          "ko": "맞아, 처음엔 그렇지. 그런데 엘레나 캐릭터는?"
        },
        "alt": [
          {
            "text": "Lo so, le prime puntate sono lente. E di Elena che ne pensi?",
            "gloss": {
              "en": "I know, the first episodes are slow. And what do you think of Elena?",
              "ko": "알아, 초반 몇 편은 느리지. 엘레나는 어떻게 생각해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Boh, non l'ho ancora capita. Sarà lei la colpevole?",
        "gloss": {
          "en": "No idea, I haven't figured her out yet. Could she be the culprit?",
          "ko": "글쎄, 아직 잘 모르겠어. 혹시 그 여자가 범인일까?"
        },
        "frames": [
          "it-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Non ti dico niente! Ma guardala fino alla fine.",
        "gloss": {
          "en": "I'm not telling you anything! But watch it to the end.",
          "ko": "아무 말도 안 할 거야! 끝까지 봐."
        }
      },
      {
        "who": "me",
        "text": "Dai, dimmi solo una cosa: finisce bene?",
        "gloss": {
          "en": "Come on, just tell me one thing: does it end well?",
          "ko": "에이, 하나만 말해 줘. 해피엔딩이야?"
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Ahah, no! Comunque la seconda stagione esce a dicembre.",
        "gloss": {
          "en": "Haha, no! Anyway, the second season comes out in December.",
          "ko": "하하, 안 돼! 어쨌든 시즌 2가 12월에 나와."
        },
        "alt": [
          {
            "text": "Neanche per sogno! Però la seconda stagione arriva a dicembre.",
            "gloss": {
              "en": "Not a chance! But the second season arrives in December.",
              "ko": "꿈도 꾸지 마! 대신 시즌 2가 12월에 나와."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Non vedo l'ora! Magari la guardiamo insieme?",
        "gloss": {
          "en": "I can't wait! Maybe we could watch it together?",
          "ko": "너무 기대된다! 같이 볼까?"
        },
        "frames": [
          "it-f3-16",
          "it-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Volentieri! Ti scrivo quando esce.",
        "gloss": {
          "en": "Gladly! I'll text you when it comes out.",
          "ko": "좋아! 나오면 문자할게."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. Penso che sia la serie più bella dell'anno.",
        "gloss": {
          "en": "Perfect. I think it's the best series of the year.",
          "ko": "좋아. 올해 최고의 드라마인 것 같아."
        },
        "frames": [
          "it-f3-09"
        ]
      }
    ]
  },
  {
    "id": "it-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "At work, asking your coworker Davide for help with a broken spreadsheet",
      "ko": "회사에서 동료 다비데에게 고장 난 엑셀 파일 도움 청하기"
    },
    "expressions": [
      "ho capito",
      "se ti va",
      "ci penso",
      "non ti preoccupare",
      "pazienza"
    ],
    "grammar": [
      3,
      5
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao, tutto ok? Hai una faccia...",
        "gloss": {
          "en": "Hi, everything OK? You look...",
          "ko": "안녕, 괜찮아? 얼굴이 왜 그래..."
        },
        "alt": [
          {
            "text": "Ehi, ti vedo un po' stanca. Che succede?",
            "gloss": {
              "en": "Hey, you look a bit tired. What's going on?",
              "ko": "야, 좀 피곤해 보여. 무슨 일 있어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Mah, devo finire il report per domani e il file Excel non funziona.",
        "gloss": {
          "en": "Well, I have to finish the report for tomorrow and the Excel file isn't working.",
          "ko": "음, 내일까지 보고서를 끝내야 하는데 엑셀 파일이 안 돼."
        }
      },
      {
        "who": "them",
        "text": "Fammi vedere. Che errore ti dà?",
        "gloss": {
          "en": "Let me see. What error does it give you?",
          "ko": "보여 줘. 무슨 오류가 떠?"
        }
      },
      {
        "who": "me",
        "text": "Quando apro il file, si blocca tutto. Mi potresti dare una mano?",
        "gloss": {
          "en": "When I open the file, everything freezes. Could you give me a hand?",
          "ko": "파일을 열면 다 멈춰. 좀 도와줄 수 있어?"
        },
        "frames": [
          "it-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Ah, ecco: le formule sono rotte.",
        "gloss": {
          "en": "Sure. Ah, there it is: the formulas are broken.",
          "ko": "그럼. 아, 여기 있네. 수식이 깨졌어."
        },
        "alt": [
          {
            "text": "Ok, vediamo... Mi sa che il problema sono le formule.",
            "gloss": {
              "en": "OK, let's see... I think the problem is the formulas.",
              "ko": "좋아, 보자... 수식이 문제인 것 같아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ah, ho capito. Ieri le ho copiate da un altro file.",
        "gloss": {
          "en": "Ah, I see. Yesterday I copied them from another file.",
          "ko": "아, 그렇구나. 어제 다른 파일에서 복사해 왔거든."
        }
      },
      {
        "who": "them",
        "text": "Ecco perché. Te le sistemo io, ci vogliono dieci minuti.",
        "gloss": {
          "en": "That's why. I'll fix them for you, it takes ten minutes.",
          "ko": "그래서 그렇구나. 내가 고쳐 줄게, 10분이면 돼."
        },
        "alt": [
          {
            "text": "Ok, si sistemano in un attimo. Te le correggo io.",
            "gloss": {
              "en": "OK, they can be fixed in a moment. I'll correct them for you.",
              "ko": "좋아, 금방 고칠 수 있어. 내가 고쳐 줄게."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Grazie mille! Se ti va, dopo ti offro un caffè.",
        "gloss": {
          "en": "Thanks a lot! If you like, I'll buy you a coffee afterwards.",
          "ko": "정말 고마워! 괜찮으면 이따 커피 살게."
        },
        "frames": [
          "it-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Volentieri. Senti, ti serve aiuto anche con la presentazione?",
        "gloss": {
          "en": "Gladly. Listen, do you need help with the presentation too?",
          "ko": "좋지. 그런데 발표 자료도 도와줄까?"
        }
      },
      {
        "who": "me",
        "text": "Grazie, ma ci penso io stasera. Non ti preoccupare.",
        "gloss": {
          "en": "Thanks, but I'll take care of it tonight. Don't worry.",
          "ko": "고마워, 근데 그건 오늘 밤에 내가 할게. 걱정 마."
        },
        "frames": [
          "it-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Fatto! Prova adesso.",
        "gloss": {
          "en": "Done! Try now.",
          "ko": "됐다! 이제 해 봐."
        }
      },
      {
        "who": "me",
        "text": "Funziona! Vabbè, pazienza per le due ore perse ieri.",
        "gloss": {
          "en": "It works! Oh well, never mind the two hours I lost yesterday.",
          "ko": "된다! 뭐, 어제 날린 두 시간은 어쩔 수 없지."
        }
      }
    ]
  },
  {
    "id": "it-3-x1",
    "stage": 3,
    "setting": {
      "en": "Catching up with a friend over coffee",
      "ko": "커피 마시며 친구와 근황 이야기"
    },
    "expressions": [
      "sul serio",
      "ce l'ho fatta"
    ],
    "grammar": [
      0,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ehi, sai che Paolo si è licenziato ieri?",
        "gloss": {
          "en": "Hey, did you know Paolo quit his job yesterday?",
          "ko": "야, 파올로가 어제 회사 그만둔 거 알아?"
        }
      },
      {
        "who": "me",
        "text": "Sul serio? Ma se gli piaceva tanto il suo lavoro!",
        "gloss": {
          "en": "Seriously? But he liked his job so much!",
          "ko": "진짜? 자기 일을 그렇게 좋아했잖아!"
        },
        "frames": [
          "it-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Eh, sì. E tu? Com'è andato l'esame di guida?",
        "gloss": {
          "en": "Yep. And you? How did the driving test go?",
          "ko": "응. 너는? 운전면허 시험 어떻게 됐어?"
        }
      },
      {
        "who": "me",
        "text": "Ce l'ho fatta! Finalmente mi hanno dato la patente.",
        "gloss": {
          "en": "I did it! They finally gave me my licence.",
          "ko": "해냈어! 드디어 면허 땄어."
        }
      },
      {
        "who": "them",
        "text": "Grande! Allora dobbiamo festeggiare!",
        "gloss": {
          "en": "Great! Then we have to celebrate!",
          "ko": "대박! 그럼 축하해야지!"
        }
      },
      {
        "who": "me",
        "text": "Volentieri! Chiamami stasera e decidiamo dove andare.",
        "gloss": {
          "en": "Gladly! Call me tonight and we'll decide where to go.",
          "ko": "좋아! 오늘 저녁에 전화해, 어디 갈지 정하자."
        }
      }
    ]
  },
  {
    "id": "it-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Team meeting: the client wants the new app version by Friday",
      "ko": "팀 회의: 고객이 금요일까지 새 앱 버전을 원한다"
    },
    "expressions": [
      "a dire il vero",
      "hai ragione",
      "il punto è",
      "da un lato",
      "dall'altro",
      "secondo me",
      "sarebbe meglio",
      "mi dispiace",
      "tra l'altro",
      "ti faccio sapere"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora, il cliente vuole la nuova versione dell'app entro venerdì. Ce la facciamo?",
        "gloss": {
          "en": "So, the client wants the new version of the app by Friday. Can we make it?",
          "ko": "자, 고객이 금요일까지 앱 새 버전을 원해. 가능할까?"
        },
        "alt": [
          {
            "text": "Partiamo dalla scadenza: il cliente chiede tutto per venerdì. È fattibile?",
            "gloss": {
              "en": "Let's start with the deadline: the client wants everything by Friday. Is it doable?",
              "ko": "마감부터 보자. 고객이 금요일까지 전부 달래. 할 수 있겠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "A dire il vero, non credo che sia realistico. Mancano ancora tutti i test.",
        "gloss": {
          "en": "To be honest, I don't think it's realistic. All the testing is still missing.",
          "ko": "솔직히 말하면 현실적이지 않은 것 같아. 아직 테스트를 하나도 못 했어."
        }
      },
      {
        "who": "them",
        "text": "Però gliel'abbiamo promesso a marzo. Non possiamo rimandare ancora.",
        "gloss": {
          "en": "But we promised it to them in March. We can't postpone again.",
          "ko": "그래도 3월에 약속했잖아. 또 미룰 수는 없어."
        }
      },
      {
        "who": "me",
        "text": "Hai ragione, ma il punto è che i test vengono fatti da due persone sole.",
        "gloss": {
          "en": "You're right, but the point is that the testing is being done by just two people.",
          "ko": "네 말이 맞아. 그런데 문제는 테스트를 단 두 명이 하고 있다는 거야."
        }
      },
      {
        "who": "them",
        "text": "E se chiedessimo aiuto al team di Giorgio?",
        "gloss": {
          "en": "And what if we asked Giorgio's team for help?",
          "ko": "조르조 팀에 도움을 청하면 어때?"
        },
        "alt": [
          {
            "text": "Potremmo farci prestare qualcuno dal team di Giorgio, no?",
            "gloss": {
              "en": "We could borrow someone from Giorgio's team, couldn't we?",
              "ko": "조르조 팀에서 사람을 좀 빌려 오면 되지 않을까?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Da un lato sarebbe utile, dall'altro dovremmo spiegare tutto da capo.",
        "gloss": {
          "en": "On the one hand it would be useful, on the other we'd have to explain everything from scratch.",
          "ko": "한편으론 도움이 되겠지만, 다른 한편으론 처음부터 다 설명해야 해."
        }
      },
      {
        "who": "them",
        "text": "Quindi cosa proponi?",
        "gloss": {
          "en": "So what do you propose?",
          "ko": "그럼 뭘 제안하는데?"
        }
      },
      {
        "who": "me",
        "text": "Secondo me sarebbe meglio consegnare venerdì solo le funzioni principali.",
        "gloss": {
          "en": "In my opinion it would be better to deliver only the main features on Friday.",
          "ko": "내 생각엔 금요일엔 핵심 기능만 넘기는 게 나을 것 같아."
        }
      },
      {
        "who": "them",
        "text": "Ma il cliente accetterà? Giorgio dice che sono molto rigidi.",
        "gloss": {
          "en": "But will the client accept? Giorgio says they're very strict.",
          "ko": "근데 고객이 받아들일까? 조르조 말로는 아주 깐깐하대."
        },
        "alt": [
          {
            "text": "Non so se al cliente vada bene. Da quello che dice Giorgio, sono piuttosto rigidi.",
            "gloss": {
              "en": "I don't know if the client will be OK with it. From what Giorgio says, they're quite strict.",
              "ko": "고객이 괜찮다고 할지 모르겠어. 조르조 말로는 꽤 깐깐하다던데."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ieri il loro responsabile mi ha detto che avrebbero accettato una consegna in due fasi.",
        "gloss": {
          "en": "Yesterday their manager told me they would accept a delivery in two phases.",
          "ko": "어제 그쪽 담당자가 두 단계로 나눠 넘겨도 받아 주겠다고 했어."
        }
      },
      {
        "who": "them",
        "text": "Ah, questo cambia tutto. Perché non l'hai detto prima?",
        "gloss": {
          "en": "Ah, that changes everything. Why didn't you say so before?",
          "ko": "아, 그럼 얘기가 완전히 다르지. 왜 진작 말 안 했어?"
        }
      },
      {
        "who": "me",
        "text": "Mi dispiace, avrei dovuto dirlo subito. Tra l'altro, me l'ha confermato anche per email.",
        "gloss": {
          "en": "I'm sorry, I should have said it right away. Besides, he also confirmed it by email.",
          "ko": "미안, 바로 말했어야 했는데. 게다가 이메일로도 확인해 줬어."
        }
      },
      {
        "who": "them",
        "text": "Va bene. Allora scrivi tu al cliente?",
        "gloss": {
          "en": "All right. So will you write to the client?",
          "ko": "좋아. 그럼 네가 고객한테 메일 쓸래?"
        }
      },
      {
        "who": "me",
        "text": "Sì, purché il piano dei test venga approvato da Laura. Ti faccio sapere entro stasera.",
        "gloss": {
          "en": "Yes, as long as the testing plan is approved by Laura. I'll let you know by tonight.",
          "ko": "응, 라우라가 테스트 계획을 승인해 준다면. 오늘 저녁까지 알려 줄게."
        }
      }
    ]
  },
  {
    "id": "it-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Calling customer service about an electricity bill that is far too high",
      "ko": "너무 많이 나온 전기 요금 때문에 고객센터에 전화하기"
    },
    "expressions": [
      "in realtà",
      "non mi sembra",
      "per quanto riguarda",
      "in ogni caso"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Servizio clienti, buongiorno, sono Chiara. Come posso aiutarla?",
        "gloss": {
          "en": "Customer service, good morning, this is Chiara. How can I help you?",
          "ko": "고객센터입니다, 안녕하세요, 저는 키아라예요. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "Buongiorno, assistenza clienti. In cosa posso esserle utile?",
            "gloss": {
              "en": "Good morning, customer support. How can I be of help?",
              "ko": "안녕하세요, 고객 지원입니다. 무엇을 도와드릴까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Buongiorno. Chiamo per la bolletta di ottobre: l'importo è molto più alto del solito.",
        "gloss": {
          "en": "Good morning. I'm calling about the October bill: the amount is much higher than usual.",
          "ko": "안녕하세요. 10월 요금 때문에 전화했어요. 금액이 평소보다 훨씬 많이 나왔어요."
        }
      },
      {
        "who": "them",
        "text": "Mi può dare il codice cliente, per favore?",
        "gloss": {
          "en": "Could you give me your customer code, please?",
          "ko": "고객 번호를 알려 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Certo: zero sette due, nove quattro cinque.",
        "gloss": {
          "en": "Sure: zero seven two, nine four five.",
          "ko": "네, 072-945예요."
        }
      },
      {
        "who": "them",
        "text": "Grazie. Vedo che la bolletta è di trecento euro.",
        "gloss": {
          "en": "Thank you. I can see the bill is three hundred euros.",
          "ko": "감사합니다. 요금이 300유로로 나왔네요."
        },
        "alt": [
          {
            "text": "Ecco, la trovo: risultano trecentoventi euro.",
            "gloss": {
              "en": "Here, I've found it: it comes to three hundred and twenty euros.",
              "ko": "네, 찾았어요. 320유로로 되어 있네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Esatto. In realtà di solito pago circa ottanta euro, quindi non mi sembra possibile.",
        "gloss": {
          "en": "Exactly. Actually I usually pay about eighty euros, so it doesn't seem possible to me.",
          "ko": "맞아요. 사실 보통 80유로 정도 내거든요. 그래서 말이 안 되는 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "Forse le è stato addebitato un consumo stimato.",
        "gloss": {
          "en": "Perhaps you were charged for estimated consumption.",
          "ko": "아마 추정 사용량으로 청구된 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Ma il mese scorso un operatore mi ha detto che la lettura sarebbe stata fatta in automatico.",
        "gloss": {
          "en": "But last month an operator told me the meter reading would be done automatically.",
          "ko": "그런데 지난달에 상담원이 검침은 자동으로 된다고 했어요."
        }
      },
      {
        "who": "them",
        "text": "Capisco. Purtroppo a volte il contatore non trasmette i dati.",
        "gloss": {
          "en": "I understand. Unfortunately sometimes the meter doesn't send the data.",
          "ko": "그렇군요. 안타깝게도 가끔 계량기가 데이터를 안 보내요."
        },
        "alt": [
          {
            "text": "Sì, succede quando il contatore non manda la lettura.",
            "gloss": {
              "en": "Yes, that happens when the meter doesn't send the reading.",
              "ko": "네, 계량기가 검침값을 안 보내면 그래요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Se me l'avessero detto, avrei mandato io la lettura. Avrei preferito saperlo prima.",
        "gloss": {
          "en": "If they'd told me, I would have sent the reading myself. I would have preferred to know earlier.",
          "ko": "그걸 알려 줬으면 제가 직접 검침값을 보냈을 거예요. 미리 알았으면 좋았을 텐데요."
        }
      },
      {
        "who": "them",
        "text": "Ha ragione. Posso aprire una richiesta di rettifica.",
        "gloss": {
          "en": "You're right. I can open a correction request.",
          "ko": "맞는 말씀이에요. 정정 요청을 접수해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Per quanto riguarda il pagamento, devo pagare comunque entro il quindici?",
        "gloss": {
          "en": "As for the payment, do I still have to pay by the fifteenth?",
          "ko": "납부는요, 그래도 15일까지 내야 하나요?"
        }
      },
      {
        "who": "them",
        "text": "No, il pagamento viene sospeso finché la pratica non è chiusa.",
        "gloss": {
          "en": "No, the payment is suspended until the case is closed.",
          "ko": "아니요, 처리가 끝날 때까지 납부는 보류돼요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. In ogni caso, mi manda una mail di conferma con il numero della pratica?",
        "gloss": {
          "en": "Perfect. In any case, will you send me a confirmation email with the case number?",
          "ko": "좋아요. 어쨌든 접수 번호가 적힌 확인 메일을 보내 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "it-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Debating a news story with friends: the city wants to close the centre to cars",
      "ko": "친구들과 뉴스 토론: 시가 도심 차량 통행을 막으려 한다"
    },
    "expressions": [
      "dipende",
      "non sono d'accordo",
      "mi spiego",
      "vale la pena",
      "a proposito"
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
        "text": "Avete letto? Il comune vuole chiudere il centro alle auto dal prossimo anno.",
        "gloss": {
          "en": "Have you read it? The city wants to close the centre to cars from next year.",
          "ko": "봤어? 시가 내년부터 도심에 차가 못 들어오게 한대."
        },
        "alt": [
          {
            "text": "Hai visto la notizia? Dal prossimo anno in centro non si potrà più entrare in macchina.",
            "gloss": {
              "en": "Did you see the news? From next year you won't be able to drive into the centre.",
              "ko": "뉴스 봤어? 내년부터 도심에 차로 못 들어간대."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Sì, l'ho letto. Spero che lo facciano davvero, questa volta.",
        "gloss": {
          "en": "Yes, I read it. I hope they really do it this time.",
          "ko": "응, 봤어. 이번엔 진짜로 했으면 좋겠다."
        }
      },
      {
        "who": "them",
        "text": "Ma dai! E chi abita in centro? E i negozi?",
        "gloss": {
          "en": "Come on! And what about people who live in the centre? And the shops?",
          "ko": "에이! 도심에 사는 사람들은? 가게들은?"
        }
      },
      {
        "who": "me",
        "text": "Dipende. Se ci fossero più autobus, la gente userebbe meno la macchina.",
        "gloss": {
          "en": "It depends. If there were more buses, people would use their cars less.",
          "ko": "상황에 따라 다르지. 버스가 더 많으면 사람들이 차를 덜 탈 거야."
        }
      },
      {
        "who": "them",
        "text": "Sì, ma gli autobus sono sempre pieni e in ritardo.",
        "gloss": {
          "en": "Yes, but the buses are always full and late.",
          "ko": "그래, 근데 버스는 맨날 꽉 차 있고 늦잖아."
        },
        "alt": [
          {
            "text": "Già, peccato che gli autobus qui siano un disastro.",
            "gloss": {
              "en": "Right, too bad the buses here are a disaster.",
              "ko": "그러게, 여기 버스가 엉망인 게 문제지."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Non sono d'accordo. Da quando c'è la linea nuova, va molto meglio.",
        "gloss": {
          "en": "I don't agree. Since the new line opened, it's much better.",
          "ko": "난 생각이 달라. 새 노선이 생긴 뒤로 훨씬 나아졌어."
        }
      },
      {
        "who": "them",
        "text": "Comunque i negozianti dicono che perderanno clienti.",
        "gloss": {
          "en": "Anyway, the shopkeepers say they'll lose customers.",
          "ko": "어쨌든 상인들은 손님이 줄 거라고 하던데."
        }
      },
      {
        "who": "me",
        "text": "Capisco, ma a Bologna è successo il contrario: le strade in cui si va a piedi hanno più negozi aperti.",
        "gloss": {
          "en": "I get it, but in Bologna the opposite happened: the streets where people walk have more shops open.",
          "ko": "이해는 해. 그런데 볼로냐에선 반대였어. 걸어 다니는 거리에 문 연 가게가 더 많아."
        }
      },
      {
        "who": "them",
        "text": "Mah. Tu ci credi davvero?",
        "gloss": {
          "en": "Hmm. Do you really believe that?",
          "ko": "글쎄. 너 진짜 그렇게 생각해?"
        },
        "alt": [
          {
            "text": "Sarà, ma io non ne sono così sicuro.",
            "gloss": {
              "en": "Maybe, but I'm not so sure about it.",
              "ko": "그럴지도 모르지만, 난 잘 모르겠어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Mi spiego: non dico che sia una soluzione perfetta, ma vale la pena provarci.",
        "gloss": {
          "en": "Let me explain: I'm not saying it's a perfect solution, but it's worth trying.",
          "ko": "내 말은, 완벽한 해결책이라는 게 아니라 한번 해 볼 만하다는 거야."
        }
      },
      {
        "who": "them",
        "text": "E se poi non funziona?",
        "gloss": {
          "en": "And what if it doesn't work?",
          "ko": "그런데 안 되면?"
        }
      },
      {
        "who": "me",
        "text": "Allora si torna indietro, purché le decisioni vengano prese in base ai dati.",
        "gloss": {
          "en": "Then they go back, as long as decisions are made based on the data.",
          "ko": "그럼 되돌리면 되지. 데이터를 보고 결정한다는 조건이라면."
        }
      },
      {
        "who": "them",
        "text": "Va bene, ne riparliamo tra un anno.",
        "gloss": {
          "en": "All right, we'll talk about it again in a year.",
          "ko": "좋아, 1년 뒤에 다시 얘기하자."
        }
      },
      {
        "who": "me",
        "text": "D'accordo. A proposito, chi viene stasera da Luca?",
        "gloss": {
          "en": "Deal. By the way, who's coming to Luca's tonight?",
          "ko": "좋아. 그건 그렇고, 오늘 밤 루카네 누구 와?"
        }
      }
    ]
  },
  {
    "id": "it-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Viewing a flat and negotiating the rent with the landlord",
      "ko": "집을 보고 집주인과 월세 조건 협상하기"
    },
    "expressions": [
      "ne parliamo",
      "a dire il vero"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora, questo è il soggiorno. Come vede, è molto luminoso.",
        "gloss": {
          "en": "So, this is the living room. As you can see, it's very bright.",
          "ko": "자, 여기가 거실이에요. 보시다시피 아주 밝아요."
        },
        "alt": [
          {
            "text": "Ecco il soggiorno: c'è luce tutto il giorno.",
            "gloss": {
              "en": "Here's the living room: there's light all day long.",
              "ko": "여기가 거실이에요. 하루 종일 해가 들어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "È davvero bello. Il riscaldamento viene pagato a parte?",
        "gloss": {
          "en": "It's really nice. Is the heating paid separately?",
          "ko": "정말 좋네요. 난방비는 따로 내나요?"
        }
      },
      {
        "who": "them",
        "text": "Sì, le spese si pagano a parte, circa sessanta euro al mese.",
        "gloss": {
          "en": "Yes, the service charges are paid separately, about sixty euros a month.",
          "ko": "네, 관리비는 따로예요. 한 달에 60유로쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Capisco. E l'affitto di settecento euro è trattabile?",
        "gloss": {
          "en": "I see. And is the rent of seven hundred euros negotiable?",
          "ko": "알겠어요. 월세 700유로는 조정이 가능한가요?"
        }
      },
      {
        "who": "them",
        "text": "Mah, è già un prezzo giusto per la zona.",
        "gloss": {
          "en": "Well, it's already a fair price for the area.",
          "ko": "글쎄요, 이 동네에선 이미 적정한 가격이에요."
        },
        "alt": [
          {
            "text": "Guardi, per questa zona è un prezzo onesto.",
            "gloss": {
              "en": "Look, for this area it's an honest price.",
              "ko": "이 지역 치고는 정직한 가격이에요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Non dubito che sia una buona zona, ma se l'affitto fosse di seicentocinquanta, firmerei subito.",
        "gloss": {
          "en": "I don't doubt it's a good area, but if the rent were six hundred fifty, I'd sign right away.",
          "ko": "좋은 동네인 건 의심 안 해요. 그래도 월세가 650이면 바로 계약할게요."
        }
      },
      {
        "who": "them",
        "text": "Seicentocinquanta mi sembra poco. Mi hanno già chiamato altre due persone.",
        "gloss": {
          "en": "Six hundred fifty seems low to me. Two other people have already called me.",
          "ko": "650은 좀 적은 것 같아요. 벌써 두 사람이 더 연락 왔어요."
        }
      },
      {
        "who": "me",
        "text": "Capisco. La signora con cui ho parlato ieri mi ha detto che l'appartamento era libero da mesi.",
        "gloss": {
          "en": "I understand. The lady I spoke to yesterday told me the flat had been empty for months.",
          "ko": "그렇군요. 어제 이야기 나눈 아주머니가 이 집이 몇 달째 비어 있었다고 하던데요."
        }
      },
      {
        "who": "them",
        "text": "Beh, sì, ma solo perché c'erano dei lavori.",
        "gloss": {
          "en": "Well, yes, but only because there was some work being done.",
          "ko": "음, 그렇긴 한데 공사 때문이었어요."
        },
        "alt": [
          {
            "text": "Sì, ma c'erano dei lavori da finire, per quello.",
            "gloss": {
              "en": "Yes, but there was some work to finish, that's why.",
              "ko": "네, 그건 끝내야 할 공사가 있어서였어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Allora facciamo seicentottanta, a meno che lei non preferisca aspettare ancora.",
        "gloss": {
          "en": "Then let's say six hundred eighty, unless you'd rather wait longer.",
          "ko": "그럼 680으로 하죠. 더 기다리시는 게 낫다면 몰라도요."
        }
      },
      {
        "who": "them",
        "text": "Mmm... seicentottanta va bene, ma con un contratto di quattro anni.",
        "gloss": {
          "en": "Hmm... six hundred eighty is fine, but with a four-year contract.",
          "ko": "음... 680 좋아요. 대신 4년 계약으로요."
        }
      },
      {
        "who": "me",
        "text": "Ne parliamo con calma. A dire il vero, avrei preferito un contratto più breve.",
        "gloss": {
          "en": "Let's talk it over calmly. To be honest, I would have preferred a shorter contract.",
          "ko": "그건 천천히 얘기해 봐요. 솔직히 저는 더 짧은 계약이 좋았거든요."
        }
      },
      {
        "who": "them",
        "text": "Ci pensi pure, ma non aspetti troppo.",
        "gloss": {
          "en": "Think about it, but don't wait too long.",
          "ko": "생각해 보세요. 그래도 너무 오래 기다리진 마시고요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Ne parlo con mia moglie e le faccio sapere entro domani.",
        "gloss": {
          "en": "All right. I'll talk to my wife about it and let you know by tomorrow.",
          "ko": "알겠어요. 아내와 이야기해 보고 내일까지 알려 드릴게요."
        }
      }
    ]
  },
  {
    "id": "it-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Dinner at Marco's: he asks Sara, in front of everyone, why she broke up with Luca",
      "ko": "마르코네 저녁 자리에서 마르코가 모두 앞에서 사라에게 왜 루카와 헤어졌는지 묻는다"
    },
    "goal": {
      "en": "Defuse an awkward question about a friend's breakup without offending anyone, then steer the dinner to a lighter topic.",
      "ko": "누구의 기분도 상하게 하지 않고 친구의 이별에 관한 곤란한 질문을 넘긴 뒤, 저녁 자리를 가벼운 화제로 돌린다."
    },
    "expressions": [
      "mettiamola così",
      "non è che",
      "per carità",
      "a quanto pare",
      "mi sa che",
      "lasciamo perdere",
      "se non sbaglio",
      "chi l'avrebbe detto",
      "figurati",
      "tutto sommato"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora Sara, raccontaci: perché tu e Luca vi siete lasciati? Dai, siamo tra amici!",
        "gloss": {
          "en": "So Sara, tell us: why did you and Luca break up? Come on, we're among friends!",
          "ko": "자, 사라, 말해 봐. 너랑 루카 왜 헤어졌어? 에이, 우리끼리잖아!"
        }
      },
      {
        "who": "me",
        "text": "Marco, mettiamola così: non è che sia proprio la serata giusta per parlarne.",
        "gloss": {
          "en": "Marco, let's put it this way: it's not exactly the right evening to talk about it.",
          "ko": "마르코, 이렇게 말해 볼게. 오늘이 그 얘기 하기 딱 좋은 날은 아닌 것 같아."
        }
      },
      {
        "who": "them",
        "text": "Ma perché? Era solo una curiosità, non volevo offendere nessuno.",
        "gloss": {
          "en": "Why? It was just curiosity, I didn't mean to offend anyone.",
          "ko": "왜? 그냥 궁금해서 그랬지, 누구 기분 상하게 하려던 건 아니야."
        }
      },
      {
        "who": "me",
        "text": "Per carità, nessuno pensa che tu l'abbia fatto apposta. Però a quanto pare l'argomento è ancora delicato.",
        "gloss": {
          "en": "Heavens, nobody thinks you did it on purpose. But apparently the subject is still a sensitive one.",
          "ko": "물론이지, 일부러 그랬다고 생각하는 사람은 없어. 그래도 보아하니 아직 민감한 얘기인가 봐."
        }
      },
      {
        "who": "them",
        "text": "Sara, dimmelo tu: te la sei presa?",
        "gloss": {
          "en": "Sara, you tell me: are you upset with me?",
          "ko": "사라, 네가 말해 봐. 나한테 기분 상했어?"
        }
      },
      {
        "who": "me",
        "text": "Non prendertela, Marco, ma certe cose, se vuole, ce le racconta lei.",
        "gloss": {
          "en": "Don't take it badly, Marco, but some things, if she wants, she'll tell us herself.",
          "ko": "기분 나빠하지 마, 마르코. 그런 얘기는 사라가 원하면 직접 해 줄 거야."
        }
      },
      {
        "who": "them",
        "text": "Va bene, va bene. Però a me Luca è sempre sembrato un tipo a posto.",
        "gloss": {
          "en": "OK, OK. But Luca always seemed like a decent guy to me.",
          "ko": "알았어, 알았어. 근데 나한텐 루카가 늘 괜찮은 애 같았거든."
        }
      },
      {
        "who": "me",
        "text": "Mi sa che non conosciamo tutta la storia, quindi lasciamo perdere.",
        "gloss": {
          "en": "I have a feeling we don't know the whole story, so let's drop it.",
          "ko": "우리가 모르는 사정이 있는 것 같아. 그러니까 그만하자."
        }
      },
      {
        "who": "them",
        "text": "Hai ragione, scusa Sara. Cambiamo argomento: chi vuole altro vino?",
        "gloss": {
          "en": "You're right, sorry Sara. Let's change the subject: who wants more wine?",
          "ko": "네 말이 맞아, 미안해 사라. 화제를 바꾸자. 와인 더 마실 사람?"
        }
      },
      {
        "who": "me",
        "text": "Io, grazie. E tu, Marco, se non sbaglio hai appena cambiato lavoro?",
        "gloss": {
          "en": "Me, thanks. And you, Marco, if I'm not mistaken you've just changed jobs?",
          "ko": "나, 고마워. 그런데 마르코, 내가 알기로 너 얼마 전에 이직했지?"
        }
      },
      {
        "who": "them",
        "text": "Sì, da lunedì sono in una startup. Pagano bene, ma si lavora tantissimo.",
        "gloss": {
          "en": "Yes, since Monday I'm at a startup. They pay well, but you work a ton.",
          "ko": "응, 월요일부터 스타트업에 다녀. 돈은 잘 주는데 일이 엄청 많아."
        }
      },
      {
        "who": "me",
        "text": "Chi l'avrebbe detto! Se avessi accettato quell'offerta due anni fa, adesso saresti già direttore.",
        "gloss": {
          "en": "Who would have thought! If you'd accepted that offer two years ago, you'd already be a director now.",
          "ko": "누가 알았겠어! 2년 전에 그 제안을 받아들였으면 지금쯤 벌써 이사일 텐데."
        }
      },
      {
        "who": "them",
        "text": "Magari! Comunque all'inizio ero terrorizzato. Pensavo di non farcela.",
        "gloss": {
          "en": "If only! Anyway, at first I was terrified. I thought I wouldn't make it.",
          "ko": "그랬으면 좋겠다! 아무튼 처음엔 겁났어. 못 해낼 줄 알았거든."
        }
      },
      {
        "who": "me",
        "text": "Figurati, tu te la cavi sempre, anche nelle situazioni più assurde.",
        "gloss": {
          "en": "Come on, you always manage, even in the most absurd situations.",
          "ko": "무슨 소리야, 넌 아무리 황당한 상황에서도 늘 잘 헤쳐 나가잖아."
        }
      },
      {
        "who": "them",
        "text": "Grazie. Sara, scusami ancora per prima, eh.",
        "gloss": {
          "en": "Thanks. Sara, sorry again about earlier, OK?",
          "ko": "고마워. 사라, 아까는 다시 한번 미안해."
        }
      },
      {
        "who": "me",
        "text": "Dai, tutto sommato è stata una bella serata. Brindiamo al nuovo lavoro di Marco!",
        "gloss": {
          "en": "Come on, all in all it's been a lovely evening. Let's toast to Marco's new job!",
          "ko": "자, 이래저래 즐거운 저녁이었어. 마르코의 새 직장을 위해 건배하자!"
        }
      }
    ]
  },
  {
    "id": "it-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "In your manager's office: asking to work from home two days a week",
      "ko": "상사 사무실에서 주 이틀 재택근무를 부탁하기"
    },
    "goal": {
      "en": "Ask your manager to let you work from home two days a week, answer the objections politely, and leave with a concrete next step.",
      "ko": "상사에게 주 이틀 재택근무를 부탁하고, 반대 의견에 정중하게 답하며, 다음 단계를 분명히 정하고 나온다."
    },
    "expressions": [
      "con tutto il rispetto",
      "senza dubbio",
      "ci mancherebbe"
    ],
    "grammar": [
      1,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "4:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Prego, si accomodi. Mi diceva che voleva parlarmi di qualcosa?",
        "gloss": {
          "en": "Please, have a seat. You said you wanted to talk to me about something?",
          "ko": "앉으세요. 저한테 할 얘기가 있다고 하셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie. Volevo chiederle se fosse possibile lavorare da casa due giorni alla settimana.",
        "gloss": {
          "en": "Yes, thank you. I wanted to ask you whether it would be possible to work from home two days a week.",
          "ko": "네, 감사합니다. 일주일에 이틀 재택근무가 가능할지 여쭤보고 싶었어요."
        }
      },
      {
        "who": "them",
        "text": "Mmm. Da noi, come sa, il lavoro da casa non è molto diffuso.",
        "gloss": {
          "en": "Hmm. Here, as you know, working from home isn't very common.",
          "ko": "음. 아시다시피 우리 회사에선 재택근무가 흔하지 않아요."
        }
      },
      {
        "who": "me",
        "text": "Lo so. Però, finito il trasloco, adesso abito a un'ora e mezza dall'ufficio.",
        "gloss": {
          "en": "I know. But now that the move is over, I live an hour and a half from the office.",
          "ko": "알아요. 그런데 이사를 마치고 나니 이제 사무실까지 한 시간 반이 걸려요."
        }
      },
      {
        "who": "them",
        "text": "Ah, non lo sapevo. E con il treno com'è?",
        "gloss": {
          "en": "Oh, I didn't know that. And how is it with the train?",
          "ko": "아, 몰랐네요. 기차로 다니기는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Il treno, lo prendo ogni giorno alle sei, ma con tutti i ritardi arrivo già stanco.",
        "gloss": {
          "en": "The train, I take it every day at six, but with all the delays I arrive already tired.",
          "ko": "기차는 매일 6시에 타는데, 지연이 잦아서 도착하면 벌써 지쳐 있어요."
        }
      },
      {
        "who": "them",
        "text": "Capisco. Ma il team ha bisogno di vederla in ufficio.",
        "gloss": {
          "en": "I understand. But the team needs to see you in the office.",
          "ko": "이해해요. 하지만 팀은 당신이 사무실에 있어야 해요."
        }
      },
      {
        "who": "me",
        "text": "Con tutto il rispetto, il mese scorso, lavorando da casa durante lo sciopero, ho chiuso due progetti in anticipo.",
        "gloss": {
          "en": "With all due respect, last month, working from home during the strike, I closed two projects ahead of schedule.",
          "ko": "외람되지만, 지난달 파업 때 재택으로 일하면서 프로젝트 두 개를 일찍 끝냈어요."
        }
      },
      {
        "who": "them",
        "text": "Questo è vero, gliene do atto. Ma se lo concedo a lei, lo vorranno tutti.",
        "gloss": {
          "en": "That's true, I'll grant you that. But if I allow it for you, everyone will want it.",
          "ko": "그건 맞아요, 인정해요. 하지만 당신한테 허락하면 다들 원할 거예요."
        }
      },
      {
        "who": "me",
        "text": "Capisco il problema. Cerco solo una soluzione che funzioni per tutti, magari in prova.",
        "gloss": {
          "en": "I understand the problem. I'm only looking for a solution that works for everyone, maybe on a trial basis.",
          "ko": "어떤 문제인지 알아요. 저는 모두에게 맞는 방법을 찾고 싶을 뿐이에요. 시범으로라도요."
        }
      },
      {
        "who": "them",
        "text": "Una prova, dice? Per quanto tempo?",
        "gloss": {
          "en": "A trial, you say? For how long?",
          "ko": "시범이요? 얼마 동안이요?"
        }
      },
      {
        "who": "me",
        "text": "Diciamo tre mesi. Se i risultati non fossero buoni, tornerei in ufficio senza problemi.",
        "gloss": {
          "en": "Let's say three months. If the results weren't good, I'd come back to the office, no problem.",
          "ko": "석 달 정도요. 결과가 좋지 않으면 아무 문제 없이 사무실로 돌아올게요."
        }
      },
      {
        "who": "them",
        "text": "Mi sa che dovrò parlarne con le risorse umane prima.",
        "gloss": {
          "en": "I think I'll have to talk to HR about it first.",
          "ko": "먼저 인사팀과 얘기해 봐야 할 것 같네요."
        }
      },
      {
        "who": "me",
        "text": "Senza dubbio è giusto coinvolgerle. Tra l'altro, secondo i colleghi, una nuova policy arriverebbe già a gennaio.",
        "gloss": {
          "en": "Without a doubt it's right to involve them. Besides, according to colleagues, a new policy is supposedly coming as early as January.",
          "ko": "물론 인사팀과 함께 보는 게 맞죠. 게다가 동료들 말로는 1월에 새 규정이 나온다고 하더라고요."
        }
      },
      {
        "who": "them",
        "text": "Sì, qualcosa del genere. Le faccio sapere entro venerdì. E grazie per avermene parlato apertamente.",
        "gloss": {
          "en": "Yes, something like that. I'll let you know by Friday. And thank you for talking to me about it openly.",
          "ko": "네, 그런 얘기가 있어요. 금요일까지 알려 줄게요. 그리고 솔직하게 말해 줘서 고마워요."
        }
      },
      {
        "who": "me",
        "text": "Ci mancherebbe, grazie a lei per l'ascolto. Allora aspetto sue notizie.",
        "gloss": {
          "en": "Not at all, thank you for listening. I'll wait to hear from you, then.",
          "ko": "별말씀을요, 들어 주셔서 감사해요. 그럼 연락 기다릴게요."
        }
      }
    ]
  },
  {
    "id": "it-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "With your Italian friend Giorgio, talking about a new film he loved",
      "ko": "이탈리아 친구 조르조와 그가 아주 좋아한 새 영화 이야기"
    },
    "goal": {
      "en": "Give an honest, nuanced opinion of a film your friend loved, disagree without dismissing him, and find common ground.",
      "ko": "친구가 아주 좋아한 영화에 대해 솔직하고 섬세하게 의견을 말하고, 무시하는 느낌 없이 반대하며, 공통점을 찾는다."
    },
    "expressions": [
      "a dirla tutta",
      "fammi capire",
      "a quanto pare",
      "in quattro e quattr'otto",
      "chi l'avrebbe detto",
      "non ci piove"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora, l'hai visto alla fine il film di Sorrentino? Io l'ho adorato.",
        "gloss": {
          "en": "So, did you end up seeing Sorrentino's film? I adored it.",
          "ko": "그래서 소렌티노 영화 결국 봤어? 난 완전 반했어."
        }
      },
      {
        "who": "me",
        "text": "Sì, l'ho visto sabato. A dirla tutta, mi aspettavo qualcosa di più.",
        "gloss": {
          "en": "Yes, I saw it on Saturday. To be completely honest, I expected something more.",
          "ko": "응, 토요일에 봤어. 솔직히 다 말하자면 기대보다는 좀 아쉬웠어."
        }
      },
      {
        "who": "them",
        "text": "Ma come? È un capolavoro! La fotografia, la musica...",
        "gloss": {
          "en": "What? It's a masterpiece! The cinematography, the music...",
          "ko": "뭐? 걸작이잖아! 촬영이며 음악이며..."
        }
      },
      {
        "who": "me",
        "text": "La fotografia, quella sì, è stupenda. Ma la storia l'ho trovata un po' lenta.",
        "gloss": {
          "en": "The cinematography, yes, that's stunning. But the story I found a bit slow.",
          "ko": "촬영은 정말 훌륭해. 그런데 이야기는 좀 늘어진다고 느꼈어."
        }
      },
      {
        "who": "them",
        "text": "Lenta? Fammi un esempio.",
        "gloss": {
          "en": "Slow? Give me an example.",
          "ko": "늘어진다고? 예를 들어 봐."
        }
      },
      {
        "who": "me",
        "text": "Tutta la parte a Napoli, per quanto sia girata benissimo, non aggiunge niente alla trama.",
        "gloss": {
          "en": "The whole Naples part, however beautifully it's shot, adds nothing to the plot.",
          "ko": "나폴리 부분 전체가, 아무리 잘 찍었어도 줄거리에 보태는 게 없어."
        }
      },
      {
        "who": "them",
        "text": "Ma è proprio lì che si capisce il protagonista!",
        "gloss": {
          "en": "But that's exactly where you understand the main character!",
          "ko": "근데 바로 거기서 주인공을 이해하게 되잖아!"
        }
      },
      {
        "who": "me",
        "text": "Fammi capire: secondo te è il ricordo della madre che spiega tutto?",
        "gloss": {
          "en": "Help me understand: in your view it's the memory of his mother that explains everything?",
          "ko": "잠깐, 그러니까 네 말은 엄마에 대한 기억이 모든 걸 설명한다는 거야?"
        }
      },
      {
        "who": "them",
        "text": "Esatto. Senza quella parte, il finale non avrebbe senso.",
        "gloss": {
          "en": "Exactly. Without that part, the ending wouldn't make sense.",
          "ko": "바로 그거야. 그 부분이 없으면 결말이 이해가 안 돼."
        }
      },
      {
        "who": "me",
        "text": "Vista così, ha più senso. Se l'avessi guardato con quest'idea, adesso forse la penserei come te.",
        "gloss": {
          "en": "Seen that way, it makes more sense. If I'd watched it with that idea, maybe now I'd see it like you.",
          "ko": "그렇게 보니 말이 되네. 그 생각을 하고 봤으면 지금쯤 나도 너랑 같은 생각일지도."
        }
      },
      {
        "who": "them",
        "text": "Dovresti riguardarlo. E hai sentito l'intervista al regista nel podcast di ieri?",
        "gloss": {
          "en": "You should watch it again. And did you hear the interview with the director on yesterday's podcast?",
          "ko": "다시 봐 봐. 그리고 어제 팟캐스트에서 감독 인터뷰 들었어?"
        }
      },
      {
        "who": "me",
        "text": "Sì! A quanto pare il film sarebbe nato da un sogno che aveva fatto da ragazzo.",
        "gloss": {
          "en": "Yes! Apparently the film came from a dream he'd had as a boy.",
          "ko": "응! 듣기로는 그 영화가 감독이 어릴 때 꾼 꿈에서 나왔다더라."
        }
      },
      {
        "who": "them",
        "text": "Pazzesco, no? E pensa che la sceneggiatura l'ha scritta in un mese.",
        "gloss": {
          "en": "Crazy, right? And just think, he wrote the screenplay in a month.",
          "ko": "대박이지? 게다가 각본을 한 달 만에 썼대."
        }
      },
      {
        "who": "me",
        "text": "In quattro e quattr'otto, insomma! Chi l'avrebbe detto.",
        "gloss": {
          "en": "In no time at all, then! Who would have thought.",
          "ko": "그야말로 순식간에 썼네! 누가 알았겠어."
        }
      },
      {
        "who": "them",
        "text": "Dai, la prossima volta lo riguardiamo insieme e ne discutiamo.",
        "gloss": {
          "en": "Come on, next time we'll watch it again together and discuss it.",
          "ko": "그럼 다음에 같이 다시 보고 얘기하자."
        }
      },
      {
        "who": "me",
        "text": "Volentieri. Su una cosa non ci piove: è un film che fa discutere, ed è già tanto.",
        "gloss": {
          "en": "Gladly. One thing's for sure: it's a film that gets people talking, and that's already a lot.",
          "ko": "좋아. 하나는 확실해. 사람들을 이야기하게 만드는 영화라는 거, 그것만으로도 대단하지."
        }
      }
    ]
  },
  {
    "id": "it-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "At the farewell party for your colleague Elena, everyone asks you to make a toast",
      "ko": "동료 엘레나의 송별회에서 모두가 건배사를 부탁한다"
    },
    "goal": {
      "en": "Give a short, warm and funny farewell toast for a colleague, keep one secret, and end by raising a glass.",
      "ko": "떠나는 동료를 위해 짧고 따뜻하며 재미있는 건배사를 하고, 비밀 하나는 지키면서, 잔을 드는 것으로 마무리한다."
    },
    "expressions": [
      "non me la sento",
      "a dirla tutta",
      "costa un occhio della testa",
      "a quanto pare",
      "acqua in bocca",
      "senza dubbio"
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
        "text": "Dai, dai, adesso un discorso! Chi comincia?",
        "gloss": {
          "en": "Come on, come on, a speech now! Who's starting?",
          "ko": "자, 자, 이제 한마디씩! 누가 먼저 할래?"
        }
      },
      {
        "who": "me",
        "text": "Va bene, ci provo io, anche se, a dirla tutta, non me la sento molto di parlare in pubblico.",
        "gloss": {
          "en": "OK, I'll give it a go, even though, to be honest, I don't really feel up to speaking in public.",
          "ko": "좋아, 내가 해 볼게. 솔직히 사람들 앞에서 말하는 건 좀 자신 없지만."
        }
      },
      {
        "who": "them",
        "text": "Ma figurati, andrai benissimo! Vai!",
        "gloss": {
          "en": "Oh, come on, you'll be great! Go!",
          "ko": "에이, 잘할 거야! 해 봐!"
        }
      },
      {
        "who": "me",
        "text": "Allora... Elena, quando sono arrivato qui, cercavo qualcuno che mi spiegasse come funzionava la stampante.",
        "gloss": {
          "en": "So... Elena, when I arrived here, I was looking for someone who could explain how the printer worked.",
          "ko": "자... 엘레나, 내가 처음 왔을 때 프린터 쓰는 법을 알려 줄 사람을 찾고 있었어요."
        }
      },
      {
        "who": "them",
        "text": "Ahah, quella stampante è un mistero per tutti!",
        "gloss": {
          "en": "Haha, that printer is a mystery to everyone!",
          "ko": "하하, 그 프린터는 다들 몰라!"
        }
      },
      {
        "who": "me",
        "text": "Ecco, Elena è l'unica persona che l'abbia mai capita davvero.",
        "gloss": {
          "en": "Well, Elena is the only person who's ever really understood it.",
          "ko": "그러니까요, 엘레나가 그걸 제대로 이해한 유일한 사람이에요."
        }
      },
      {
        "who": "them",
        "text": "Verissimo! E poi?",
        "gloss": {
          "en": "So true! And then?",
          "ko": "완전 맞아! 그리고?"
        }
      },
      {
        "who": "me",
        "text": "E poi, finite le riunioni più noiose, era sempre lei a portarci il caffè.",
        "gloss": {
          "en": "And then, once the most boring meetings were over, she was always the one bringing us coffee.",
          "ko": "그리고 지루한 회의가 끝나면 늘 커피를 가져다준 사람도 엘레나였죠."
        }
      },
      {
        "who": "them",
        "text": "Ma il caffè della macchinetta, eh!",
        "gloss": {
          "en": "But coffee from the machine, mind you!",
          "ko": "자판기 커피였지만!"
        }
      },
      {
        "who": "me",
        "text": "Sì, ma quella macchinetta costa un occhio della testa, e lei lo offriva sempre a tutti!",
        "gloss": {
          "en": "Yes, but that machine costs an arm and a leg, and she always treated everyone!",
          "ko": "네, 그런데 그 자판기 커피가 엄청 비싸잖아요. 그런데도 늘 모두에게 사 줬어요!"
        }
      },
      {
        "who": "them",
        "text": "Ahah! E adesso dove va, a Milano?",
        "gloss": {
          "en": "Haha! And where is she going now, Milan?",
          "ko": "하하! 그럼 이제 어디로 가요, 밀라노?"
        }
      },
      {
        "who": "me",
        "text": "Sì, e a quanto pare la nuova azienda avrebbe già grandi progetti per lei.",
        "gloss": {
          "en": "Yes, and apparently the new company already has big plans for her.",
          "ko": "네, 듣자 하니 새 회사가 벌써 엘레나에게 큰 계획을 세워 뒀대요."
        }
      },
      {
        "who": "them",
        "text": "Dai, svelaci qualcosa!",
        "gloss": {
          "en": "Come on, tell us something!",
          "ko": "에이, 좀 알려 줘!"
        }
      },
      {
        "who": "me",
        "text": "No, no, acqua in bocca! Dico solo che, se non avesse accettato, adesso staremmo lavorando invece di brindare.",
        "gloss": {
          "en": "No, no, my lips are sealed! I'll just say that, if she hadn't accepted, we'd be working right now instead of toasting.",
          "ko": "안 돼요, 그건 비밀! 다만 엘레나가 그 제안을 받아들이지 않았다면, 우리는 지금 건배 대신 일하고 있겠죠."
        }
      },
      {
        "who": "them",
        "text": "Ahah! Allora, il brindisi!",
        "gloss": {
          "en": "Haha! So, the toast!",
          "ko": "하하! 자, 건배!"
        }
      },
      {
        "who": "me",
        "text": "Senza dubbio te la caverai benissimo anche lì, Elena. Alzate i bicchieri: a Elena!",
        "gloss": {
          "en": "Without a doubt you'll do brilliantly there too, Elena. Raise your glasses: to Elena!",
          "ko": "엘레나, 거기서도 분명 잘 해낼 거예요. 다들 잔을 들어 주세요. 엘레나를 위하여!"
        }
      }
    ]
  }
];
