import type { StageScript } from "../../stageScripts.ts";

/**
 * it 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const IT_BANK: StageScript[] = [
  {
    "id": "it-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "buongiorno",
      "per favore",
      "quanto costa",
      "va bene",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Cosa prende?",
        "gloss": {
          "en": "Good morning! What can I get you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buongiorno, signora! Vorrei un cappuccino, per favore.",
        "gloss": {
          "en": "Good morning, madam! I'd like a cappuccino, please.",
          "ko": "안녕하세요! 카푸치노 한 잔 주세요."
        },
        "frames": [
          "it-f1-18",
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Qualcos'altro?",
        "gloss": {
          "en": "Sure. Anything else?",
          "ko": "네. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, un cornetto. Quanto costa il cornetto?",
        "gloss": {
          "en": "Yes, a croissant. How much is the croissant?",
          "ko": "네, 크루아상도요. 크루아상은 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Un euro e venti.",
        "gloss": {
          "en": "One euro twenty.",
          "ko": "일 유로 이십이에요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Ho solo dieci euro.",
        "gloss": {
          "en": "OK. I only have ten euros.",
          "ko": "알겠어요. 십 유로짜리밖에 없어요."
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Nessun problema. Ecco il resto.",
        "gloss": {
          "en": "No problem. Here's your change.",
          "ko": "괜찮아요. 여기 거스름돈이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie, arrivederci!",
        "gloss": {
          "en": "Thank you, goodbye!",
          "ko": "감사합니다, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b02",
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
    "bank": true,
    "setting": {
      "en": "Language exchange: meeting someone new",
      "ko": "언어 교환 모임에서 처음 만난 사람과"
    },
    "expressions": [
      "ciao",
      "mi chiamo",
      "piacere",
      "sono di",
      "certo",
      "a presto"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Io sono Marco. E tu?",
        "gloss": {
          "en": "Hi! I'm Marco. And you?",
          "ko": "안녕하세요! 저는 마르코예요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "Ciao, Marco! Mi chiamo Minji. Piacere!",
        "gloss": {
          "en": "Hi, Marco! My name is Minji. Nice to meet you!",
          "ko": "안녕하세요, 마르코! 저는 민지예요. 반가워요!"
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
          "ko": "저도 반가워요! 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Sono di Busan, ma abito a Milano.",
        "gloss": {
          "en": "I'm from Busan, but I live in Milan.",
          "ko": "부산 출신인데 밀라노에 살아요."
        },
        "frames": [
          "it-f1-02",
          "it-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "E che lavoro fai?",
        "gloss": {
          "en": "And what do you do?",
          "ko": "무슨 일 해요?"
        }
      },
      {
        "who": "me",
        "text": "Sono infermiera. Lavoro in un ospedale.",
        "gloss": {
          "en": "I'm a nurse. I work in a hospital.",
          "ko": "간호사예요. 병원에서 일해요."
        },
        "frames": [
          "it-f1-03",
          "it-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! Vieni anche la settimana prossima?",
        "gloss": {
          "en": "How nice! Are you coming next week too?",
          "ko": "멋지네요! 다음 주에도 와요?"
        }
      },
      {
        "who": "me",
        "text": "Certo! Ciao, a presto!",
        "gloss": {
          "en": "Of course! Bye, see you soon!",
          "ko": "그럼요! 안녕, 또 봐요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking for a pharmacy on the street",
      "ko": "길에서 약국 묻기"
    },
    "expressions": [
      "grazie",
      "scusi",
      "non capisco",
      "può ripetere",
      "per favore",
      "va bene"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno, ha bisogno di aiuto?",
        "gloss": {
          "en": "Good morning, do you need help?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie. C'è una farmacia qui vicino?",
        "gloss": {
          "en": "Yes, thanks. Is there a pharmacy near here?",
          "ko": "네, 고마워요. 이 근처에 약국이 있어요?"
        },
        "frames": [
          "it-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Sì, in Via Roma, a destra.",
        "gloss": {
          "en": "Yes, on Via Roma, on the right.",
          "ko": "네, 로마 거리에 있어요, 오른쪽으로요."
        }
      },
      {
        "who": "me",
        "text": "Scusi, non capisco. Dov'è Via Roma?",
        "gloss": {
          "en": "Sorry, I don't understand. Where is Via Roma?",
          "ko": "죄송해요, 잘 모르겠어요. 로마 거리가 어디예요?"
        },
        "frames": [
          "it-f1-12",
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "È la seconda strada, vicino al bar.",
        "gloss": {
          "en": "It's the second street, near the café.",
          "ko": "두 번째 길이에요, 카페 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Può ripetere, per favore?",
        "gloss": {
          "en": "Could you repeat that, please?",
          "ko": "다시 한번 말해 주시겠어요?"
        },
        "frames": [
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Certo. La seconda strada, vicino al bar.",
        "gloss": {
          "en": "Sure. The second street, near the café.",
          "ko": "네. 두 번째 길, 카페 옆이요."
        }
      },
      {
        "who": "me",
        "text": "Ah, va bene. Grazie per l'aiuto!",
        "gloss": {
          "en": "Ah, OK. Thanks for the help!",
          "ko": "아, 알겠어요. 도와주셔서 고마워요!"
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "buonasera",
      "grazie",
      "va bene"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera! Benvenuto.",
        "gloss": {
          "en": "Good evening! Welcome.",
          "ko": "안녕하세요! 어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "Buonasera! Ho una prenotazione per due notti.",
        "gloss": {
          "en": "Good evening! I have a reservation for two nights.",
          "ko": "안녕하세요! 이틀 밤 예약했어요."
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Perfetto. Ecco la chiave e questa carta.",
        "gloss": {
          "en": "Perfect. Here's the key and this card.",
          "ko": "좋아요. 여기 열쇠하고 이 카드요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Che cos'è questa carta?",
        "gloss": {
          "en": "Thanks. What is this card?",
          "ko": "고마워요. 이 카드는 뭐예요?"
        },
        "frames": [
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È per la colazione, al primo piano.",
        "gloss": {
          "en": "It's for breakfast, on the first floor.",
          "ko": "아침 식사용이에요, 일 층에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. E dov'è l'ascensore?",
        "gloss": {
          "en": "OK. And where is the lift?",
          "ko": "알겠어요. 그리고 엘리베이터는 어디예요?"
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Lì, a sinistra.",
        "gloss": {
          "en": "Over there, on the left.",
          "ko": "저기 왼쪽이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie per le informazioni. Buonanotte!",
        "gloss": {
          "en": "Thanks for the information. Good night!",
          "ko": "안내해 주셔서 고마워요. 안녕히 주무세요!"
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the fruit market",
      "ko": "과일 시장에서"
    },
    "expressions": [
      "buongiorno",
      "quanto costa",
      "va bene",
      "per favore",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Cosa le do?",
        "gloss": {
          "en": "Good morning! What can I get you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buongiorno! Che cos'è questo frutto?",
        "gloss": {
          "en": "Good morning! What is this fruit?",
          "ko": "안녕하세요! 이 과일은 뭐예요?"
        },
        "frames": [
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È un fico. È molto dolce.",
        "gloss": {
          "en": "It's a fig. It's very sweet.",
          "ko": "무화과예요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "Quanto costa un chilo?",
        "gloss": {
          "en": "How much is a kilo?",
          "ko": "일 킬로에 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Quattro euro al chilo.",
        "gloss": {
          "en": "Four euros a kilo.",
          "ko": "일 킬로에 사 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Vorrei mezzo chilo, per favore.",
        "gloss": {
          "en": "OK. I'd like half a kilo, please.",
          "ko": "좋아요. 반 킬로 주세요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Ecco a lei. Due euro.",
        "gloss": {
          "en": "Here you are. Two euros.",
          "ko": "여기요. 이 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Grazie, arrivederci!",
        "gloss": {
          "en": "Here. Thanks, goodbye!",
          "ko": "여기요. 감사합니다, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket",
      "ko": "기차표 사기"
    },
    "expressions": [
      "buongiorno",
      "per favore",
      "quanto costa",
      "scusi",
      "può ripetere",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno, dica.",
        "gloss": {
          "en": "Good morning, go ahead.",
          "ko": "안녕하세요, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Buongiorno. Vorrei un biglietto per Bologna, per favore.",
        "gloss": {
          "en": "Good morning. I'd like a ticket to Bologna, please.",
          "ko": "안녕하세요. 볼로냐 가는 표 한 장 주세요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Andata e ritorno?",
        "gloss": {
          "en": "Return?",
          "ko": "왕복이요?"
        }
      },
      {
        "who": "me",
        "text": "No, solo andata. Quanto costa?",
        "gloss": {
          "en": "No, one way only. How much is it?",
          "ko": "아니요, 편도만요. 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Venti euro. Il treno parte dal binario sette.",
        "gloss": {
          "en": "Twenty euros. The train leaves from platform seven.",
          "ko": "이십 유로예요. 기차는 칠 번 플랫폼에서 출발해요."
        }
      },
      {
        "who": "me",
        "text": "Scusi, può ripetere il binario, per favore?",
        "gloss": {
          "en": "Sorry, could you repeat the platform, please?",
          "ko": "죄송한데, 플랫폼 번호를 다시 말해 주시겠어요?"
        },
        "frames": [
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Binario sette.",
        "gloss": {
          "en": "Platform seven.",
          "ko": "칠 번 플랫폼이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie mille. Arrivederci!",
        "gloss": {
          "en": "Thanks a lot. Goodbye!",
          "ko": "정말 고마워요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a new office",
      "ko": "새 회사 첫날"
    },
    "expressions": [
      "certo",
      "grazie"
    ],
    "grammar": [
      0,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Sei la nuova collega?",
        "gloss": {
          "en": "Hi! Are you the new colleague?",
          "ko": "안녕하세요! 새로 온 동료예요?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Sono grafica.",
        "gloss": {
          "en": "Yes! I'm a graphic designer.",
          "ko": "네! 그래픽 디자이너예요."
        },
        "frames": [
          "it-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Benvenuta! Abiti in centro?",
        "gloss": {
          "en": "Welcome! Do you live downtown?",
          "ko": "환영해요! 시내에 살아요?"
        }
      },
      {
        "who": "me",
        "text": "No, abito a Monza.",
        "gloss": {
          "en": "No, I live in Monza.",
          "ko": "아니요, 몬차에 살아요."
        },
        "frames": [
          "it-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Ah, è vicino! Questo è il tuo computer.",
        "gloss": {
          "en": "Ah, that's close! This is your computer.",
          "ko": "아, 가깝네요! 이게 당신 컴퓨터예요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Ho una domanda: dov'è la sala riunioni?",
        "gloss": {
          "en": "Thanks. I have a question: where is the meeting room?",
          "ko": "고마워요. 질문이 있는데요, 회의실은 어디예요?"
        },
        "frames": [
          "it-f1-10",
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "In fondo, a destra. Andiamo insieme?",
        "gloss": {
          "en": "At the end, on the right. Shall we go together?",
          "ko": "끝에서 오른쪽이에요. 같이 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "Certo, grazie per l'aiuto!",
        "gloss": {
          "en": "Sure, thanks for the help!",
          "ko": "좋아요, 도와줘서 고마워요!"
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Italian class with the teacher",
      "ko": "이탈리아어 수업에서 선생님과"
    },
    "expressions": [
      "scusi",
      "non capisco",
      "può ripetere",
      "per favore",
      "grazie"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno a tutti! Oggi parliamo di cibo.",
        "gloss": {
          "en": "Good morning, everyone! Today we're talking about food.",
          "ko": "여러분 안녕하세요! 오늘은 음식 이야기를 해요."
        }
      },
      {
        "who": "me",
        "text": "Scusi, non capisco la parola «cibo».",
        "gloss": {
          "en": "Sorry, I don't understand the word \"cibo\".",
          "ko": "죄송해요, '치보'라는 단어를 모르겠어요."
        },
        "frames": [
          "it-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "«Cibo» è quello che mangiamo: pane, pasta, frutta...",
        "gloss": {
          "en": "\"Cibo\" is what we eat: bread, pasta, fruit...",
          "ko": "'치보'는 우리가 먹는 거예요. 빵, 파스타, 과일..."
        }
      },
      {
        "who": "me",
        "text": "Ah, ho capito. Come si dice «spoon» in italiano?",
        "gloss": {
          "en": "Ah, I see. How do you say \"spoon\" in Italian?",
          "ko": "아, 알겠어요. '스푼'은 이탈리아어로 뭐라고 해요?"
        },
        "frames": [
          "it-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Si dice «cucchiaio».",
        "gloss": {
          "en": "It's \"cucchiaio\".",
          "ko": "'쿠키아이오'라고 해요."
        }
      },
      {
        "who": "me",
        "text": "Può ripetere, per favore?",
        "gloss": {
          "en": "Could you repeat that, please?",
          "ko": "다시 한번 말해 주시겠어요?"
        },
        "frames": [
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Cuc-chia-io. È difficile, vero?",
        "gloss": {
          "en": "Cuc-chia-io. It's hard, isn't it?",
          "ko": "쿠키-아-이오. 어렵죠?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Grazie per la pazienza.",
        "gloss": {
          "en": "Yes! Thank you for your patience.",
          "ko": "네! 기다려 주셔서 고마워요."
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call with the landlord",
      "ko": "집주인과 전화"
    },
    "expressions": [
      "buongiorno",
      "scusi",
      "non capisco",
      "va bene",
      "può ripetere",
      "per favore",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pronto? Sono il signor Bianchi, il proprietario.",
        "gloss": {
          "en": "Hello? This is Mr Bianchi, the landlord.",
          "ko": "여보세요? 집주인 비안키예요."
        }
      },
      {
        "who": "me",
        "text": "Buongiorno! Scusi, non parlo bene l'italiano.",
        "gloss": {
          "en": "Good morning! Sorry, I don't speak Italian well.",
          "ko": "안녕하세요! 죄송해요, 이탈리아어를 잘 못해요."
        },
        "frames": [
          "it-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Nessun problema. Domani vengo per il riscaldamento, alle nove.",
        "gloss": {
          "en": "No problem. Tomorrow I'm coming about the heating, at nine.",
          "ko": "괜찮아요. 내일 아홉 시에 난방 때문에 갈게요."
        }
      },
      {
        "who": "me",
        "text": "Scusi, non capisco. Che cos'è il riscaldamento?",
        "gloss": {
          "en": "Sorry, I don't understand. What is \"riscaldamento\"?",
          "ko": "죄송해요, 잘 모르겠어요. '리스칼다멘토'가 뭐예요?"
        },
        "frames": [
          "it-f1-12",
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È il sistema per avere la casa calda in inverno.",
        "gloss": {
          "en": "It's the system to keep the house warm in winter.",
          "ko": "겨울에 집을 따뜻하게 하는 장치요."
        }
      },
      {
        "who": "me",
        "text": "Ah, va bene! Può ripetere l'ora, per favore?",
        "gloss": {
          "en": "Ah, OK! Could you repeat the time, please?",
          "ko": "아, 알겠어요! 시간을 다시 말해 주시겠어요?"
        },
        "frames": [
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Alle nove di mattina.",
        "gloss": {
          "en": "At nine in the morning.",
          "ko": "아침 아홉 시요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. Grazie, arrivederci!",
        "gloss": {
          "en": "Perfect. Thanks, goodbye!",
          "ko": "좋아요. 고마워요, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Greeting a neighbor in the evening",
      "ko": "저녁에 이웃에게 인사하기"
    },
    "expressions": [
      "buonasera",
      "piacere",
      "grazie",
      "arrivederci",
      "a presto"
    ],
    "grammar": [
      0,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera! Lei è la nuova vicina?",
        "gloss": {
          "en": "Good evening! Are you the new neighbor?",
          "ko": "안녕하세요! 새로 이사 온 이웃이세요?"
        }
      },
      {
        "who": "me",
        "text": "Buonasera, signora! Sì, piacere. Sono coreana.",
        "gloss": {
          "en": "Good evening, madam! Yes, nice to meet you. I'm Korean.",
          "ko": "안녕하세요! 네, 반가워요. 한국 사람이에요."
        },
        "frames": [
          "it-f1-18",
          "it-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Piacere! Abita qui da sola?",
        "gloss": {
          "en": "Nice to meet you! Do you live here alone?",
          "ko": "반가워요! 여기 혼자 살아요?"
        }
      },
      {
        "who": "me",
        "text": "No, ho un gatto!",
        "gloss": {
          "en": "No, I have a cat!",
          "ko": "아니요, 고양이가 한 마리 있어요!"
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! Io ho un cane, si chiama Briciola.",
        "gloss": {
          "en": "How lovely! I have a dog, her name is Briciola.",
          "ko": "좋네요! 저는 개가 있어요, 이름은 브리촐라예요."
        }
      },
      {
        "who": "me",
        "text": "Che carino! Dov'è adesso?",
        "gloss": {
          "en": "How cute! Where is she now?",
          "ko": "귀엽네요! 지금 어디 있어요?"
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "In casa, dorme. Buona serata!",
        "gloss": {
          "en": "At home, sleeping. Have a nice evening!",
          "ko": "집에서 자고 있어요. 좋은 저녁 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Grazie, anche a lei. Arrivederci, a presto!",
        "gloss": {
          "en": "Thanks, you too. Goodbye, see you soon!",
          "ko": "고마워요, 당신도요. 안녕히 계세요, 또 봬요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the pharmacy",
      "ko": "약국에서"
    },
    "expressions": [
      "buongiorno",
      "per favore",
      "quanto costa",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      4,
      5,
      7
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
        "text": "Buongiorno. Ho mal di testa.",
        "gloss": {
          "en": "Good morning. I have a headache.",
          "ko": "안녕하세요. 머리가 아파요."
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Da quanto tempo?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Da ieri. Vorrei qualcosa per il mal di testa, per favore.",
        "gloss": {
          "en": "Since yesterday. I'd like something for a headache, please.",
          "ko": "어제부터요. 두통약 좀 주세요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Ecco, queste pastiglie. Una dopo pranzo.",
        "gloss": {
          "en": "Here, these tablets. One after lunch.",
          "ko": "여기 이 알약이요. 점심 먹고 한 알이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Quanto costa la scatola?",
        "gloss": {
          "en": "Thanks. How much is the box?",
          "ko": "고마워요. 한 통에 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Sei euro e cinquanta.",
        "gloss": {
          "en": "Six euros fifty.",
          "ko": "육 유로 오십이에요."
        }
      },
      {
        "who": "me",
        "text": "Ecco a lei. Grazie, arrivederci!",
        "gloss": {
          "en": "Here you are. Thanks, goodbye!",
          "ko": "여기요. 감사합니다, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the tourist information office",
      "ko": "관광 안내소에서"
    },
    "expressions": [
      "grazie",
      "va bene"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Posso aiutarla?",
        "gloss": {
          "en": "Good morning! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie. Dov'è il Duomo?",
        "gloss": {
          "en": "Yes, thanks. Where is the cathedral?",
          "ko": "네, 고마워요. 대성당은 어디에 있어요?"
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "È a dieci minuti a piedi. Ecco una mappa.",
        "gloss": {
          "en": "It's ten minutes on foot. Here's a map.",
          "ko": "걸어서 십 분이에요. 여기 지도요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. C'è un bancomat qui vicino?",
        "gloss": {
          "en": "Thanks. Is there a cash machine near here?",
          "ko": "고마워요. 이 근처에 현금 인출기가 있어요?"
        },
        "frames": [
          "it-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Sì, davanti alla banca, in piazza.",
        "gloss": {
          "en": "Yes, in front of the bank, in the square.",
          "ko": "네, 광장의 은행 앞에요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. E che cos'è questo simbolo sulla mappa?",
        "gloss": {
          "en": "Perfect. And what is this symbol on the map?",
          "ko": "좋아요. 그리고 지도에 있는 이 표시는 뭐예요?"
        },
        "frames": [
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È un museo. Il lunedì è chiuso.",
        "gloss": {
          "en": "It's a museum. It's closed on Mondays.",
          "ko": "박물관이에요. 월요일엔 문을 닫아요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Grazie per la mappa!",
        "gloss": {
          "en": "OK. Thanks for the map!",
          "ko": "알겠어요. 지도 고마워요!"
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Paying at a trattoria",
      "ko": "식당에서 계산하기"
    },
    "expressions": [
      "va bene",
      "grazie",
      "certo",
      "arrivederci",
      "a presto"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tutto bene con il pranzo?",
        "gloss": {
          "en": "Was everything good with lunch?",
          "ko": "점심 괜찮으셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, molto buono! Quanto costa il pranzo?",
        "gloss": {
          "en": "Yes, very good! How much is the lunch?",
          "ko": "네, 아주 맛있었어요! 점심값이 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Sono quindici euro, con il caffè.",
        "gloss": {
          "en": "That's fifteen euros, with the coffee.",
          "ko": "커피 포함해서 십오 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Ho una domanda: che cos'è il «coperto»?",
        "gloss": {
          "en": "Here. I have a question: what is the \"coperto\"?",
          "ko": "여기요. 질문이 하나 있는데요, '코페르토'가 뭐예요?"
        },
        "frames": [
          "it-f1-10",
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È il costo del pane e del tavolo.",
        "gloss": {
          "en": "It's the charge for the bread and the table.",
          "ko": "빵과 자리 값이에요."
        }
      },
      {
        "who": "me",
        "text": "Ah, va bene. Grazie per la spiegazione.",
        "gloss": {
          "en": "Ah, OK. Thanks for the explanation.",
          "ko": "아, 알겠어요. 설명해 주셔서 고마워요."
        },
        "frames": [
          "it-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Prego! Torni presto.",
        "gloss": {
          "en": "You're welcome! Come back soon.",
          "ko": "천만에요! 또 오세요."
        }
      },
      {
        "who": "me",
        "text": "Certo! Arrivederci, a presto!",
        "gloss": {
          "en": "Of course! Goodbye, see you soon!",
          "ko": "그럼요! 안녕히 계세요, 또 올게요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "In a bookshop",
      "ko": "서점에서"
    },
    "expressions": [
      "per favore",
      "quanto costa",
      "lo prendo",
      "grazie"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno, cerca qualcosa?",
        "gloss": {
          "en": "Good morning, are you looking for something?",
          "ko": "안녕하세요, 찾으시는 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì. Vorrei un dizionario, per favore.",
        "gloss": {
          "en": "Yes. I'd like a dictionary, please.",
          "ko": "네. 사전을 하나 사고 싶어요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Italiano e inglese?",
        "gloss": {
          "en": "Italian and English?",
          "ko": "이탈리아어-영어 사전이요?"
        }
      },
      {
        "who": "me",
        "text": "No, italiano e coreano. Come si dice «pocket» in italiano?",
        "gloss": {
          "en": "No, Italian and Korean. How do you say \"pocket\" in Italian?",
          "ko": "아니요, 이탈리아어-한국어요. '포켓'을 이탈리아어로 뭐라고 해요?"
        },
        "frames": [
          "it-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "«Tascabile», per un libro piccolo. Ecco, questo è tascabile.",
        "gloss": {
          "en": "\"Tascabile\", for a small book. Here, this one is pocket-sized.",
          "ko": "작은 책이면 '타스카빌레'라고 해요. 여기, 이게 포켓판이에요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto! Quanto costa?",
        "gloss": {
          "en": "Perfect! How much is it?",
          "ko": "좋아요! 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Dodici euro.",
        "gloss": {
          "en": "Twelve euros.",
          "ko": "십이 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Lo prendo. Grazie!",
        "gloss": {
          "en": "I'll take it. Thanks!",
          "ko": "이걸로 할게요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bus stop",
      "ko": "버스 정류장에서"
    },
    "expressions": [
      "scusi",
      "non capisco",
      "può ripetere",
      "per favore",
      "prego"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Scusi, sa quando passa il diciotto?",
        "gloss": {
          "en": "Excuse me, do you know when the eighteen comes?",
          "ko": "실례지만, 십팔 번 버스가 언제 오는지 아세요?"
        }
      },
      {
        "who": "me",
        "text": "Mi dispiace, non parlo bene l'italiano.",
        "gloss": {
          "en": "Sorry, I don't speak Italian well.",
          "ko": "죄송해요, 이탈리아어를 잘 못해요."
        },
        "frames": [
          "it-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Ah, nessun problema. L'autobus... quando arriva?",
        "gloss": {
          "en": "Ah, no problem. The bus... when does it come?",
          "ko": "아, 괜찮아요. 버스가... 언제 와요?"
        }
      },
      {
        "who": "me",
        "text": "Scusi, non capisco. Può ripetere, per favore?",
        "gloss": {
          "en": "Sorry, I don't understand. Could you repeat that, please?",
          "ko": "죄송해요, 잘 모르겠어요. 다시 말해 주시겠어요?"
        },
        "frames": [
          "it-f1-12",
          "it-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Il bus numero diciotto. Quando arriva?",
        "gloss": {
          "en": "The number eighteen bus. When does it come?",
          "ko": "십팔 번 버스요. 언제 와요?"
        }
      },
      {
        "who": "me",
        "text": "Ah! Dov'è l'orario? Ecco: tra cinque minuti.",
        "gloss": {
          "en": "Ah! Where's the timetable? Here: in five minutes.",
          "ko": "아! 시간표가 어디 있죠? 여기 있네요. 오 분 뒤에요."
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Grazie mille!",
        "gloss": {
          "en": "Thanks a lot!",
          "ko": "정말 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "Prego!",
        "gloss": {
          "en": "You're welcome!",
          "ko": "천만에요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a friend's birthday party",
      "ko": "친구 생일 파티에서"
    },
    "expressions": [
      "sono di",
      "grazie"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Sei un'amica di Sara?",
        "gloss": {
          "en": "Hi! Are you a friend of Sara's?",
          "ko": "안녕하세요! 사라 친구예요?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Siamo colleghe. Sono di Seul.",
        "gloss": {
          "en": "Yes! We're colleagues. I'm from Seoul.",
          "ko": "네! 직장 동료예요. 서울 출신이에요."
        },
        "frames": [
          "it-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! E abiti qui a Torino?",
        "gloss": {
          "en": "How nice! And do you live here in Turin?",
          "ko": "좋네요! 여기 토리노에 살아요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, abito a Torino da un anno.",
        "gloss": {
          "en": "Yes, I've lived in Turin for a year.",
          "ko": "네, 토리노에 산 지 일 년 됐어요."
        },
        "frames": [
          "it-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Io sono di Napoli. Vuoi una fetta di torta?",
        "gloss": {
          "en": "I'm from Naples. Do you want a slice of cake?",
          "ko": "저는 나폴리 출신이에요. 케이크 한 조각 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie! Che cos'è? Cioccolato?",
        "gloss": {
          "en": "Yes, thanks! What is it? Chocolate?",
          "ko": "네, 고마워요! 무슨 케이크예요? 초콜릿이에요?"
        },
        "frames": [
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Sì, e nocciole. È buonissima!",
        "gloss": {
          "en": "Yes, and hazelnuts. It's delicious!",
          "ko": "네, 헤이즐넛도요. 정말 맛있어요!"
        }
      },
      {
        "who": "me",
        "text": "Mmm, buonissima! Grazie per la torta!",
        "gloss": {
          "en": "Mmm, delicious! Thanks for the cake!",
          "ko": "음, 정말 맛있네요! 케이크 고마워요!"
        },
        "frames": [
          "it-f1-14"
        ]
      }
    ]
  },
  {
    "id": "it-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a coat in a clothes shop",
      "ko": "옷 가게에서 코트 사기"
    },
    "expressions": [
      "grazie",
      "quanto costa",
      "per favore",
      "va bene",
      "lo prendo",
      "arrivederci"
    ],
    "grammar": [
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Posso aiutarla?",
        "gloss": {
          "en": "Good morning! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie. Quanto costa questo cappotto?",
        "gloss": {
          "en": "Yes, thanks. How much is this coat?",
          "ko": "네, 고마워요. 이 코트 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Novanta euro. Che taglia porta?",
        "gloss": {
          "en": "Ninety euros. What size do you wear?",
          "ko": "구십 유로예요. 사이즈가 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "La media. Vorrei provare il cappotto, per favore.",
        "gloss": {
          "en": "Medium. I'd like to try on the coat, please.",
          "ko": "미디엄이요. 코트를 입어 보고 싶어요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Certo, il camerino è lì. ... Come va?",
        "gloss": {
          "en": "Of course, the fitting room is there. ... How is it?",
          "ko": "물론이죠, 탈의실은 저기예요. ... 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Va bene, lo prendo! Ho la carta di credito.",
        "gloss": {
          "en": "It's good, I'll take it! I have a credit card.",
          "ko": "좋아요, 이걸로 할게요! 신용카드 있어요."
        },
        "frames": [
          "it-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Perfetto. Ecco lo scontrino.",
        "gloss": {
          "en": "Perfect. Here's the receipt.",
          "ko": "좋아요. 여기 영수증이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie, arrivederci!",
        "gloss": {
          "en": "Thanks, goodbye!",
          "ko": "고마워요, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the post office",
      "ko": "우체국에서"
    },
    "expressions": [
      "buongiorno",
      "per favore",
      "scusi",
      "va bene",
      "quanto costa",
      "grazie",
      "arrivederci"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno. Prego, dica.",
        "gloss": {
          "en": "Good morning. Go ahead, please.",
          "ko": "안녕하세요. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Buongiorno. Vorrei spedire questa lettera in Corea, per favore.",
        "gloss": {
          "en": "Good morning. I'd like to send this letter to Korea, please.",
          "ko": "안녕하세요. 이 편지를 한국으로 보내고 싶어요."
        },
        "frames": [
          "it-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Prioritaria o normale?",
        "gloss": {
          "en": "Priority or regular?",
          "ko": "빠른우편이요, 일반이요?"
        }
      },
      {
        "who": "me",
        "text": "Scusi, che cos'è «prioritaria»?",
        "gloss": {
          "en": "Sorry, what is \"prioritaria\"?",
          "ko": "죄송한데, '프리오리타리아'가 뭐예요?"
        },
        "frames": [
          "it-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "È più veloce: arriva in una settimana.",
        "gloss": {
          "en": "It's faster: it arrives in a week.",
          "ko": "더 빨라요. 일주일이면 도착해요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Quanto costa?",
        "gloss": {
          "en": "OK. How much is it?",
          "ko": "좋아요. 얼마예요?"
        },
        "frames": [
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Quattro euro e cinquanta.",
        "gloss": {
          "en": "Four euros fifty.",
          "ko": "사 유로 오십이에요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Grazie, arrivederci!",
        "gloss": {
          "en": "Here. Thanks, goodbye!",
          "ko": "여기요. 고마워요, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Signing up at a gym",
      "ko": "헬스장 등록하기"
    },
    "expressions": [
      "quanto costa",
      "grazie",
      "ciao",
      "a presto"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Vuoi fare l'iscrizione?",
        "gloss": {
          "en": "Hi! Do you want to sign up?",
          "ko": "안녕하세요! 등록하시려고요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ho una domanda. Quanto costa un mese?",
        "gloss": {
          "en": "Yes, I have a question. How much is one month?",
          "ko": "네, 질문이 있어요. 한 달에 얼마예요?"
        },
        "frames": [
          "it-f1-10",
          "it-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Cinquanta euro. Lavori in zona? C'è uno sconto.",
        "gloss": {
          "en": "Fifty euros. Do you work in the area? There's a discount.",
          "ko": "오십 유로예요. 이 근처에서 일해요? 할인이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Sì, lavoro in una banca qui in centro.",
        "gloss": {
          "en": "Yes, I work in a bank here downtown.",
          "ko": "네, 여기 시내 은행에서 일해요."
        },
        "frames": [
          "it-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Perfetto, allora quaranta euro. Abiti lontano?",
        "gloss": {
          "en": "Perfect, then forty euros. Do you live far away?",
          "ko": "좋아요, 그럼 사십 유로예요. 멀리 살아요?"
        }
      },
      {
        "who": "me",
        "text": "No, abito a cinque minuti da qui.",
        "gloss": {
          "en": "No, I live five minutes from here.",
          "ko": "아니요, 여기서 오 분 거리에 살아요."
        },
        "frames": [
          "it-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Bene! Ecco la tessera.",
        "gloss": {
          "en": "Great! Here's your card.",
          "ko": "좋아요! 여기 회원 카드요."
        }
      },
      {
        "who": "me",
        "text": "Grazie! Ciao, a presto!",
        "gloss": {
          "en": "Thanks! Bye, see you soon!",
          "ko": "고마워요! 안녕히 계세요, 또 올게요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Arriving at a holiday apartment",
      "ko": "휴가 숙소에 도착해서 집주인과"
    },
    "expressions": [
      "grazie",
      "dov'è il bagno",
      "va bene",
      "ciao",
      "a presto"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao, benvenuta! Questa è la casa.",
        "gloss": {
          "en": "Hi, welcome! This is the apartment.",
          "ko": "안녕하세요, 어서 오세요! 여기가 집이에요."
        }
      },
      {
        "who": "me",
        "text": "Grazie! Che bella. Dov'è il bagno?",
        "gloss": {
          "en": "Thanks! How lovely. Where is the bathroom?",
          "ko": "고마워요! 예쁘네요. 화장실은 어디예요?"
        },
        "frames": [
          "it-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Lì, vicino alla cucina. Ecco le chiavi.",
        "gloss": {
          "en": "There, near the kitchen. Here are the keys.",
          "ko": "저기 부엌 옆이에요. 여기 열쇠요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. C'è un supermercato qui vicino?",
        "gloss": {
          "en": "Thanks. Is there a supermarket near here?",
          "ko": "고마워요. 이 근처에 슈퍼마켓이 있어요?"
        },
        "frames": [
          "it-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Sì, in fondo alla strada. Apre alle otto.",
        "gloss": {
          "en": "Yes, at the end of the street. It opens at eight.",
          "ko": "네, 길 끝에 있어요. 여덟 시에 열어요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto! Grazie per tutto.",
        "gloss": {
          "en": "Perfect! Thanks for everything.",
          "ko": "좋아요! 여러모로 고마워요."
        },
        "frames": [
          "it-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Prego! Per qualsiasi cosa, chiamami.",
        "gloss": {
          "en": "You're welcome! Call me for anything.",
          "ko": "천만에요! 무슨 일 있으면 전화해요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. Ciao, a presto!",
        "gloss": {
          "en": "OK. Bye, see you soon!",
          "ko": "알겠어요. 안녕히 계세요, 또 봬요!"
        },
        "frames": [
          "it-f1-16"
        ]
      }
    ]
  },
  {
    "id": "it-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday chat with a colleague",
      "ko": "월요일에 동료와 수다"
    },
    "expressions": [
      "volentieri",
      "ci vediamo"
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
        "text": "Ciao! Com'è andato il weekend?",
        "gloss": {
          "en": "Hi! How did the weekend go?",
          "ko": "안녕하세요! 주말 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Benissimo! Sabato sono andato al lago con degli amici.",
        "gloss": {
          "en": "Great! On Saturday I went to the lake with some friends.",
          "ko": "아주 좋았어요! 토요일에 친구들이랑 호수에 갔어요."
        },
        "frames": [
          "it-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! E domenica?",
        "gloss": {
          "en": "How nice! And Sunday?",
          "ko": "좋네요! 일요일은요?"
        }
      },
      {
        "who": "me",
        "text": "Ieri ho dormito fino a mezzogiorno!",
        "gloss": {
          "en": "Yesterday I slept until noon!",
          "ko": "어제는 정오까지 잤어요!"
        },
        "frames": [
          "it-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Beato te! Ti piace il lago?",
        "gloss": {
          "en": "Lucky you! Do you like the lake?",
          "ko": "부럽네요! 호수 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, mi piace molto nuotare.",
        "gloss": {
          "en": "Yes, I really like swimming.",
          "ko": "네, 수영하는 걸 정말 좋아해요."
        },
        "frames": [
          "it-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Allora la prossima volta vengo anch'io!",
        "gloss": {
          "en": "Then next time I'm coming too!",
          "ko": "그럼 다음엔 저도 갈래요!"
        }
      },
      {
        "who": "me",
        "text": "Volentieri! Ci vediamo dopo alla riunione.",
        "gloss": {
          "en": "Gladly! See you later at the meeting.",
          "ko": "좋아요! 이따 회의에서 봐요."
        },
        "frames": [
          "it-f2-11",
          "it-f2-13"
        ]
      }
    ]
  },
  {
    "id": "it-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a friend to the cinema by phone",
      "ko": "전화로 친구를 영화에 초대하기"
    },
    "expressions": [
      "tutto bene",
      "a che ora",
      "ci vediamo",
      "d'accordo"
    ],
    "grammar": [
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pronto? Ciao, come stai?",
        "gloss": {
          "en": "Hello? Hi, how are you?",
          "ko": "여보세요? 안녕, 잘 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Tutto bene, grazie! Ti va di andare al cinema stasera?",
        "gloss": {
          "en": "All good, thanks! Do you feel like going to the cinema tonight?",
          "ko": "잘 지내요! 오늘 저녁에 영화 보러 갈래요?"
        },
        "frames": [
          "it-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Volentieri! Che film?",
        "gloss": {
          "en": "Gladly! What film?",
          "ko": "좋아요! 무슨 영화요?"
        }
      },
      {
        "who": "me",
        "text": "Una commedia italiana. Mi piacciono le commedie.",
        "gloss": {
          "en": "An Italian comedy. I like comedies.",
          "ko": "이탈리아 코미디요. 저는 코미디를 좋아해요."
        },
        "frames": [
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Anche a me! Comincia presto?",
        "gloss": {
          "en": "Me too! Does it start early?",
          "ko": "저도요! 일찍 시작해요?"
        }
      },
      {
        "who": "me",
        "text": "Alle nove. A che ora ci vediamo?",
        "gloss": {
          "en": "At nine. What time shall we meet?",
          "ko": "아홉 시요. 몇 시에 만날까요?"
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Alle otto e mezza davanti al cinema?",
        "gloss": {
          "en": "At half past eight in front of the cinema?",
          "ko": "여덟 시 반에 영화관 앞에서 볼까요?"
        }
      },
      {
        "who": "me",
        "text": "D'accordo! Ci vediamo davanti al cinema.",
        "gloss": {
          "en": "Deal! See you in front of the cinema.",
          "ko": "좋아요! 영화관 앞에서 봐요."
        },
        "frames": [
          "it-f2-13"
        ]
      }
    ]
  },
  {
    "id": "it-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Turning down a friend's invitation",
      "ko": "친구의 파티 초대 거절하기"
    },
    "expressions": [
      "che peccato",
      "ci vediamo"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Che fai stasera? C'è una festa da Luca.",
        "gloss": {
          "en": "Hi! What are you doing tonight? There's a party at Luca's.",
          "ko": "안녕! 오늘 저녁에 뭐 해요? 루카네 집에서 파티가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Che peccato, stasera lavoro fino a tardi.",
        "gloss": {
          "en": "What a shame, tonight I'm working until late.",
          "ko": "아쉽다, 오늘 저녁엔 늦게까지 일해요."
        },
        "frames": [
          "it-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Davvero? E domani?",
        "gloss": {
          "en": "Really? And tomorrow?",
          "ko": "정말요? 그럼 내일은요?"
        }
      },
      {
        "who": "me",
        "text": "Domani parto per Roma con mia sorella.",
        "gloss": {
          "en": "Tomorrow I'm leaving for Rome with my sister.",
          "ko": "내일은 언니랑 로마에 가요."
        },
        "frames": [
          "it-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Ah, che bello! Quando torni?",
        "gloss": {
          "en": "Ah, how nice! When are you back?",
          "ko": "아, 좋겠다! 언제 돌아와요?"
        }
      },
      {
        "who": "me",
        "text": "Domenica sera. Ci vediamo la settimana prossima?",
        "gloss": {
          "en": "Sunday evening. Shall we meet next week?",
          "ko": "일요일 저녁이요. 다음 주에 볼까요?"
        },
        "frames": [
          "it-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Certo! Buon viaggio!",
        "gloss": {
          "en": "Sure! Have a good trip!",
          "ko": "그럼요! 여행 잘 다녀와요!"
        }
      },
      {
        "who": "me",
        "text": "Grazie! Salutami Luca.",
        "gloss": {
          "en": "Thanks! Say hi to Luca for me.",
          "ko": "고마워요! 루카한테 안부 전해 줘요."
        }
      }
    ]
  },
  {
    "id": "it-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor's",
      "ko": "병원 진료실에서"
    },
    "expressions": [
      "d'accordo"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno. Cosa c'è che non va?",
        "gloss": {
          "en": "Good morning. What seems to be the problem?",
          "ko": "안녕하세요. 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Mi fa male la gola da tre giorni.",
        "gloss": {
          "en": "My throat has been hurting for three days.",
          "ko": "사흘째 목이 아파요."
        },
        "frames": [
          "it-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Ha la febbre? Ha preso qualcosa?",
        "gloss": {
          "en": "Do you have a fever? Have you taken anything?",
          "ko": "열이 있어요? 드신 약 있어요?"
        }
      },
      {
        "who": "me",
        "text": "No, niente febbre. Ho già preso uno sciroppo, ma non funziona.",
        "gloss": {
          "en": "No, no fever. I've already taken a syrup, but it isn't working.",
          "ko": "열은 없어요. 시럽은 벌써 먹었는데 효과가 없어요."
        },
        "frames": [
          "it-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Vediamo... È solo un'infiammazione. Ecco la ricetta.",
        "gloss": {
          "en": "Let's see... It's just an inflammation. Here's the prescription.",
          "ko": "봅시다... 염증일 뿐이에요. 여기 처방전이요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Posso andare al lavoro domani?",
        "gloss": {
          "en": "Thanks. Can I go to work tomorrow?",
          "ko": "고마워요. 내일 출근해도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, ma beva molta acqua.",
        "gloss": {
          "en": "Yes, but drink lots of water.",
          "ko": "네, 하지만 물을 많이 드세요."
        }
      },
      {
        "who": "me",
        "text": "D'accordo. Grazie, arrivederci!",
        "gloss": {
          "en": "All right. Thanks, goodbye!",
          "ko": "알겠어요. 고맙습니다, 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a trattoria",
      "ko": "트라토리아에서 저녁 주문"
    },
    "expressions": [
      "non ancora",
      "cosa mi consiglia",
      "il conto"
    ],
    "grammar": [
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buonasera! Avete scelto?",
        "gloss": {
          "en": "Good evening! Have you decided?",
          "ko": "안녕하세요! 고르셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Non ancora. Cosa mi consiglia di primo?",
        "gloss": {
          "en": "Not yet. What do you recommend as a first course?",
          "ko": "아직이요. 첫 번째 요리로 뭘 추천하세요?"
        },
        "frames": [
          "it-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Le tagliatelle al ragù sono la specialità della casa.",
        "gloss": {
          "en": "The tagliatelle with ragù are the house specialty.",
          "ko": "라구 탈리아텔레가 저희 집 대표 메뉴예요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, per me le tagliatelle, grazie.",
        "gloss": {
          "en": "Perfect, the tagliatelle for me, thanks.",
          "ko": "좋아요, 저는 탈리아텔레로 할게요."
        },
        "frames": [
          "it-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "E da bere?",
        "gloss": {
          "en": "And to drink?",
          "ko": "마실 건요?"
        }
      },
      {
        "who": "me",
        "text": "Un bicchiere di vino rosso. Mi piacciono i vini toscani.",
        "gloss": {
          "en": "A glass of red wine. I like Tuscan wines.",
          "ko": "레드 와인 한 잔이요. 토스카나 와인을 좋아해요."
        },
        "frames": [
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Ottima scelta! Arriva subito.",
        "gloss": {
          "en": "Great choice! Coming right up.",
          "ko": "좋은 선택이에요! 바로 갖다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Grazie! E alla fine il conto, per favore.",
        "gloss": {
          "en": "Thanks! And the bill at the end, please.",
          "ko": "고마워요! 다 먹고 나서 계산서 부탁해요."
        }
      }
    ]
  },
  {
    "id": "it-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a classmate about an exam",
      "ko": "같은 반 친구에게 시험 물어보기"
    },
    "expressions": [
      "volentieri",
      "a che ora"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Finalmente è finito l'esame!",
        "gloss": {
          "en": "Hi! The exam is finally over!",
          "ko": "안녕! 드디어 시험 끝났어요!"
        }
      },
      {
        "who": "me",
        "text": "Com'è andato l'esame?",
        "gloss": {
          "en": "How did the exam go?",
          "ko": "시험 어땠어요?"
        },
        "frames": [
          "it-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Bene, credo. E a te?",
        "gloss": {
          "en": "Well, I think. And you?",
          "ko": "잘 본 것 같아요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "Così così. Ieri ho studiato fino all'una di notte.",
        "gloss": {
          "en": "So-so. Yesterday I studied until one in the morning.",
          "ko": "그저 그래요. 어제 새벽 한 시까지 공부했어요."
        },
        "frames": [
          "it-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Poverino! E adesso?",
        "gloss": {
          "en": "Poor thing! And now?",
          "ko": "고생했네요! 이제 어떻게 해요?"
        }
      },
      {
        "who": "me",
        "text": "Domani dormo tutto il giorno!",
        "gloss": {
          "en": "Tomorrow I'm sleeping all day!",
          "ko": "내일은 하루 종일 잘 거예요!"
        },
        "frames": [
          "it-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Hai ragione! Stasera usciamo a festeggiare?",
        "gloss": {
          "en": "You're right! Shall we go out to celebrate tonight?",
          "ko": "맞아요! 오늘 저녁에 축하하러 나갈래요?"
        }
      },
      {
        "who": "me",
        "text": "Volentieri! A che ora?",
        "gloss": {
          "en": "Gladly! What time?",
          "ko": "좋아요! 몇 시에요?"
        },
        "frames": [
          "it-f2-11",
          "it-f2-14"
        ]
      }
    ]
  },
  {
    "id": "it-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Morning with a flatmate",
      "ko": "아침에 룸메이트와"
    },
    "expressions": [],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Già sveglio?",
        "gloss": {
          "en": "Good morning! Already awake?",
          "ko": "좋은 아침! 벌써 일어났어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, la mattina mi alzo sempre alle sei.",
        "gloss": {
          "en": "Yes, in the morning I always get up at six.",
          "ko": "네, 아침엔 항상 여섯 시에 일어나요."
        },
        "frames": [
          "it-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Alle sei? Io mai! Cosa fai?",
        "gloss": {
          "en": "At six? Never for me! What are you doing?",
          "ko": "여섯 시요? 저는 절대 못 해요! 뭐 하고 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sto preparando il caffè. Lo vuoi anche tu?",
        "gloss": {
          "en": "I'm making coffee. Do you want some too?",
          "ko": "커피 만들고 있어요. 당신도 마실래요?"
        },
        "frames": [
          "it-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Sì, grazie! Ah, il bagno è libero?",
        "gloss": {
          "en": "Yes, thanks! Ah, is the bathroom free?",
          "ko": "네, 고마워요! 아, 화장실 비었어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì. Puoi chiudere la finestra dopo? Fa freddo.",
        "gloss": {
          "en": "Yes. Can you close the window afterwards? It's cold.",
          "ko": "네. 나중에 창문 좀 닫아 줄래요? 추워요."
        },
        "frames": [
          "it-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Allora, buona giornata!",
        "gloss": {
          "en": "Sure. Well, have a good day!",
          "ko": "그럼요. 그럼 좋은 하루 보내요!"
        }
      },
      {
        "who": "me",
        "text": "Anche a te! A stasera.",
        "gloss": {
          "en": "You too! See you tonight.",
          "ko": "당신도요! 저녁에 봐요."
        }
      }
    ]
  },
  {
    "id": "it-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "In an art museum",
      "ko": "미술관에서"
    },
    "expressions": [
      "posso fare una foto",
      "a che ora",
      "davvero"
    ],
    "grammar": [
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno. Il biglietto, per favore.",
        "gloss": {
          "en": "Good morning. Your ticket, please.",
          "ko": "안녕하세요. 표 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Posso fare una foto nella sala?",
        "gloss": {
          "en": "Here. Can I take a photo in the gallery?",
          "ko": "여기요. 전시실에서 사진 찍어도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, ma senza flash.",
        "gloss": {
          "en": "Yes, but without flash.",
          "ko": "네, 플래시 없이요."
        }
      },
      {
        "who": "me",
        "text": "Va bene. A che ora chiude il museo?",
        "gloss": {
          "en": "OK. What time does the museum close?",
          "ko": "알겠어요. 미술관은 몇 시에 닫아요?"
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Alle sette. C'è anche una visita guidata.",
        "gloss": {
          "en": "At seven. There's also a guided tour.",
          "ko": "일곱 시요. 가이드 투어도 있어요."
        }
      },
      {
        "who": "me",
        "text": "Davvero? Mi piacciono le visite guidate.",
        "gloss": {
          "en": "Really? I like guided tours.",
          "ko": "정말요? 저는 가이드 투어 좋아해요."
        },
        "frames": [
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Comincia tra venti minuti, qui all'ingresso.",
        "gloss": {
          "en": "It starts in twenty minutes, here at the entrance.",
          "ko": "이십 분 뒤에 여기 입구에서 시작해요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, grazie!",
        "gloss": {
          "en": "Perfect, thanks!",
          "ko": "좋아요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Accepting a dinner invitation",
      "ko": "저녁 초대 받아들이기"
    },
    "expressions": [
      "volentieri",
      "a che ora",
      "che bello",
      "ci vediamo",
      "d'accordo"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Sabato faccio una cena a casa mia. Vieni?",
        "gloss": {
          "en": "Hi! On Saturday I'm having a dinner at my place. Will you come?",
          "ko": "안녕! 토요일에 우리 집에서 저녁 모임 해요. 올래요?"
        }
      },
      {
        "who": "me",
        "text": "Volentieri, grazie! A che ora?",
        "gloss": {
          "en": "Gladly, thanks! What time?",
          "ko": "좋아요, 고마워요! 몇 시에요?"
        },
        "frames": [
          "it-f2-11",
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Verso le otto. Mi piacerebbe cucinare qualcosa di coreano insieme!",
        "gloss": {
          "en": "Around eight. I'd love to cook something Korean together!",
          "ko": "여덟 시쯤이요. 같이 한국 음식 만들어 보고 싶어요!"
        }
      },
      {
        "who": "me",
        "text": "Che bello! Posso portare gli ingredienti?",
        "gloss": {
          "en": "How nice! Can I bring the ingredients?",
          "ko": "좋아요! 재료는 제가 가져가도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, perfetto! Ti mando l'indirizzo.",
        "gloss": {
          "en": "Yes, perfect! I'll send you the address.",
          "ko": "네, 좋아요! 주소 보내 줄게요."
        }
      },
      {
        "who": "me",
        "text": "D'accordo. Ci vediamo sabato alle otto!",
        "gloss": {
          "en": "Deal. See you Saturday at eight!",
          "ko": "좋아요. 토요일 여덟 시에 봐요!"
        },
        "frames": [
          "it-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "A sabato!",
        "gloss": {
          "en": "See you Saturday!",
          "ko": "토요일에 봐요!"
        }
      },
      {
        "who": "me",
        "text": "Ciao, a sabato!",
        "gloss": {
          "en": "Bye, see you Saturday!",
          "ko": "안녕, 토요일에 봐요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend calls while you're shopping",
      "ko": "장 보는 중에 친구가 전화함"
    },
    "expressions": [
      "d'accordo",
      "a domani"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Cosa stai facendo?",
        "gloss": {
          "en": "Hi! What are you doing?",
          "ko": "안녕! 뭐 하고 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sto facendo la spesa al supermercato.",
        "gloss": {
          "en": "I'm doing the shopping at the supermarket.",
          "ko": "마트에서 장 보고 있어요."
        },
        "frames": [
          "it-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Ah, scusa! Domani sei libera?",
        "gloss": {
          "en": "Ah, sorry! Are you free tomorrow?",
          "ko": "아, 미안해요! 내일 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Domani lavoro, ma la sera sono libera.",
        "gloss": {
          "en": "Tomorrow I'm working, but I'm free in the evening.",
          "ko": "내일은 일하는데 저녁엔 시간 있어요."
        },
        "frames": [
          "it-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Allora mangiamo una pizza insieme?",
        "gloss": {
          "en": "Then shall we have a pizza together?",
          "ko": "그럼 같이 피자 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Ti va di provare quella pizzeria nuova?",
        "gloss": {
          "en": "Yes! Do you feel like trying that new pizzeria?",
          "ko": "좋아요! 새로 생긴 그 피자집 가 볼래요?"
        },
        "frames": [
          "it-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Ottima idea! Ci sentiamo domani.",
        "gloss": {
          "en": "Great idea! Talk tomorrow.",
          "ko": "좋은 생각이에요! 내일 연락해요."
        }
      },
      {
        "who": "me",
        "text": "D'accordo, a domani!",
        "gloss": {
          "en": "OK, see you tomorrow!",
          "ko": "좋아요, 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the gelato shop",
      "ko": "젤라테리아에서"
    },
    "expressions": [],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Cono o coppetta?",
        "gloss": {
          "en": "Hi! Cone or cup?",
          "ko": "안녕하세요! 콘이요, 컵이요?"
        }
      },
      {
        "who": "me",
        "text": "Un cono, per favore. Posso assaggiare il pistacchio?",
        "gloss": {
          "en": "A cone, please. Can I taste the pistachio?",
          "ko": "콘으로 주세요. 피스타치오 맛 봐도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Certo, ecco. Com'è?",
        "gloss": {
          "en": "Sure, here. How is it?",
          "ko": "그럼요, 여기요. 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Buonissimo! Mi piace tanto il pistacchio.",
        "gloss": {
          "en": "Delicious! I really like pistachio.",
          "ko": "정말 맛있어요! 피스타치오를 정말 좋아해요."
        },
        "frames": [
          "it-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Allora pistacchio e...?",
        "gloss": {
          "en": "So pistachio and...?",
          "ko": "그럼 피스타치오하고...?"
        }
      },
      {
        "who": "me",
        "text": "Per me pistacchio e limone, grazie.",
        "gloss": {
          "en": "Pistachio and lemon for me, thanks.",
          "ko": "저는 피스타치오랑 레몬으로 할게요."
        },
        "frames": [
          "it-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Ecco! Tre euro.",
        "gloss": {
          "en": "Here you go! Three euros.",
          "ko": "여기요! 삼 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Ecco a lei. Buona giornata!",
        "gloss": {
          "en": "Here you are. Have a nice day!",
          "ko": "여기요. 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost in a new neighborhood",
      "ko": "낯선 동네에서 길을 잃음"
    },
    "expressions": [
      "mi sono perso"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tutto bene? Ha bisogno di aiuto?",
        "gloss": {
          "en": "Everything OK? Do you need help?",
          "ko": "괜찮아요? 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, grazie. Mi sono perso. Sto cercando la stazione.",
        "gloss": {
          "en": "Yes, thanks. I'm lost. I'm looking for the station.",
          "ko": "네, 고마워요. 길을 잃었어요. 역을 찾고 있어요."
        },
        "frames": [
          "it-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "È lontana, venti minuti a piedi.",
        "gloss": {
          "en": "It's far, twenty minutes on foot.",
          "ko": "멀어요, 걸어서 이십 분이에요."
        }
      },
      {
        "who": "me",
        "text": "Posso prendere un autobus?",
        "gloss": {
          "en": "Can I take a bus?",
          "ko": "버스 타도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, il tre. La fermata è lì, davanti al bar.",
        "gloss": {
          "en": "Yes, the three. The stop is there, in front of the café.",
          "ko": "네, 삼 번이요. 정류장은 저기 카페 앞이에요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. A che ora passa?",
        "gloss": {
          "en": "Perfect. What time does it come?",
          "ko": "좋아요. 몇 시에 와요?"
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Ogni dieci minuti, più o meno.",
        "gloss": {
          "en": "Every ten minutes or so.",
          "ko": "대략 십 분마다요."
        }
      },
      {
        "who": "me",
        "text": "Grazie mille, molto gentile!",
        "gloss": {
          "en": "Thanks a lot, very kind!",
          "ko": "정말 고마워요, 친절하시네요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the pharmacy with a sore back",
      "ko": "약국에서: 허리가 아파요"
    },
    "expressions": [],
    "grammar": [
      0,
      5
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
        "text": "Buongiorno. Mi fa male la schiena.",
        "gloss": {
          "en": "Good morning. My back hurts.",
          "ko": "안녕하세요. 허리가 아파요."
        },
        "frames": [
          "it-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Da quando?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Da ieri. Ieri ho giocato a tennis per tre ore.",
        "gloss": {
          "en": "Since yesterday. Yesterday I played tennis for three hours.",
          "ko": "어제부터요. 어제 테니스를 세 시간 쳤어요."
        },
        "frames": [
          "it-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Ah, ecco! Questa crema va bene.",
        "gloss": {
          "en": "Ah, that explains it! This cream works well.",
          "ko": "아, 그래서구나! 이 크림이 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Posso usarla anche la sera?",
        "gloss": {
          "en": "Can I use it in the evening too?",
          "ko": "저녁에도 발라도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, mattina e sera.",
        "gloss": {
          "en": "Yes, morning and evening.",
          "ko": "네, 아침저녁으로요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, la prendo. Grazie!",
        "gloss": {
          "en": "Perfect, I'll take it. Thanks!",
          "ko": "좋아요, 이걸로 할게요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a friend to help you move",
      "ko": "친구에게 이사 도와 달라고 부탁하기"
    },
    "expressions": [
      "ci vediamo",
      "volentieri"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Allora, quando è il trasloco?",
        "gloss": {
          "en": "Hi! So, when is the move?",
          "ko": "안녕! 그래서 이사는 언제예요?"
        }
      },
      {
        "who": "me",
        "text": "Sabato. Puoi aiutarmi con le scatole?",
        "gloss": {
          "en": "Saturday. Can you help me with the boxes?",
          "ko": "토요일이요. 박스 옮기는 거 도와줄 수 있어요?"
        },
        "frames": [
          "it-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Certo! A che ora?",
        "gloss": {
          "en": "Sure! What time?",
          "ko": "그럼요! 몇 시에요?"
        }
      },
      {
        "who": "me",
        "text": "Alle dieci. Puoi portare anche la macchina?",
        "gloss": {
          "en": "At ten. Can you bring the car too?",
          "ko": "열 시요. 차도 가져올 수 있어요?"
        },
        "frames": [
          "it-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Sì, nessun problema. Dove ci troviamo?",
        "gloss": {
          "en": "Yes, no problem. Where shall we meet?",
          "ko": "네, 문제없어요. 어디서 만날까요?"
        }
      },
      {
        "who": "me",
        "text": "Ci vediamo davanti a casa mia.",
        "gloss": {
          "en": "See you in front of my place.",
          "ko": "우리 집 앞에서 봐요."
        },
        "frames": [
          "it-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Perfetto. E dopo una pizza?",
        "gloss": {
          "en": "Perfect. And a pizza afterwards?",
          "ko": "좋아요. 끝나고 피자 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "Volentieri, offro io!",
        "gloss": {
          "en": "Gladly, my treat!",
          "ko": "좋아요, 제가 살게요!"
        },
        "frames": [
          "it-f2-11"
        ]
      }
    ]
  },
  {
    "id": "it-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about hobbies at a language school",
      "ko": "어학원에서 취미 이야기"
    },
    "expressions": [
      "che bello"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Cosa ti piace fare nel tempo libero?",
        "gloss": {
          "en": "What do you like doing in your free time?",
          "ko": "시간 있을 때 뭐 하는 걸 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Mi piace correre al parco.",
        "gloss": {
          "en": "I like running in the park.",
          "ko": "공원에서 뛰는 걸 좋아해요."
        },
        "frames": [
          "it-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Anche la mattina presto?",
        "gloss": {
          "en": "Even early in the morning?",
          "ko": "아침 일찍도요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, la mattina mi sveglio presto e corro.",
        "gloss": {
          "en": "Yes, in the morning I wake up early and run.",
          "ko": "네, 아침에 일찍 일어나서 뛰어요."
        },
        "frames": [
          "it-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Brava! Io invece leggo molto.",
        "gloss": {
          "en": "Good for you! I read a lot instead.",
          "ko": "대단해요! 저는 대신 책을 많이 읽어요."
        }
      },
      {
        "who": "me",
        "text": "Anch'io! Mi piacciono i romanzi gialli.",
        "gloss": {
          "en": "Me too! I like crime novels.",
          "ko": "저도요! 추리 소설을 좋아해요."
        },
        "frames": [
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Davvero? Ti presto un libro bellissimo.",
        "gloss": {
          "en": "Really? I'll lend you a great book.",
          "ko": "정말요? 진짜 좋은 책 빌려줄게요."
        }
      },
      {
        "who": "me",
        "text": "Grazie, che bello!",
        "gloss": {
          "en": "Thanks, how lovely!",
          "ko": "고마워요, 좋아요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a bakery",
      "ko": "빵집에서"
    },
    "expressions": [
      "cosa mi consiglia"
    ],
    "grammar": [
      0,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Cosa desidera?",
        "gloss": {
          "en": "Good morning! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Buongiorno. Cosa mi consiglia per una colazione dolce?",
        "gloss": {
          "en": "Good morning. What do you recommend for a sweet breakfast?",
          "ko": "안녕하세요. 달콤한 아침으로 뭘 추천하세요?"
        },
        "frames": [
          "it-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "I cornetti alla crema sono appena usciti dal forno.",
        "gloss": {
          "en": "The cream croissants have just come out of the oven.",
          "ko": "크림 크루아상이 방금 나왔어요."
        }
      },
      {
        "who": "me",
        "text": "Per me due cornetti alla crema, grazie.",
        "gloss": {
          "en": "Two cream croissants for me, thanks.",
          "ko": "저는 크림 크루아상 두 개 주세요."
        },
        "frames": [
          "it-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Qualcos'altro? Il pane?",
        "gloss": {
          "en": "Anything else? Bread?",
          "ko": "다른 건요? 빵은요?"
        }
      },
      {
        "who": "me",
        "text": "No, grazie, ho già comprato il pane al supermercato.",
        "gloss": {
          "en": "No, thanks, I've already bought bread at the supermarket.",
          "ko": "아니요, 빵은 벌써 마트에서 샀어요."
        },
        "frames": [
          "it-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Va bene. Due euro e quaranta.",
        "gloss": {
          "en": "OK. Two euros forty.",
          "ko": "네. 이 유로 사십이에요."
        }
      },
      {
        "who": "me",
        "text": "Ecco. Buona giornata!",
        "gloss": {
          "en": "Here. Have a nice day!",
          "ko": "여기요. 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend back from a trip",
      "ko": "여행에서 돌아온 친구와"
    },
    "expressions": [
      "che bello"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ciao! Sono tornata ieri dalla Sicilia!",
        "gloss": {
          "en": "Hi! I got back from Sicily yesterday!",
          "ko": "안녕! 어제 시칠리아에서 돌아왔어요!"
        }
      },
      {
        "who": "me",
        "text": "Che bello! Com'è andato il viaggio?",
        "gloss": {
          "en": "How nice! How did the trip go?",
          "ko": "좋겠다! 여행 어땠어요?"
        },
        "frames": [
          "it-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Benissimo! Il mare era stupendo. E tu cosa hai fatto?",
        "gloss": {
          "en": "Great! The sea was stunning. And what did you do?",
          "ko": "정말 좋았어요! 바다가 끝내줬어요. 당신은 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Sabato sono andato a una mostra di fotografia.",
        "gloss": {
          "en": "On Saturday I went to a photography exhibition.",
          "ko": "토요일에 사진 전시회에 갔어요."
        },
        "frames": [
          "it-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Interessante! Ti è piaciuta?",
        "gloss": {
          "en": "Interesting! Did you like it?",
          "ko": "재밌겠다! 좋았어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, molto. Ieri ho comprato anche il libro della mostra.",
        "gloss": {
          "en": "Yes, a lot. Yesterday I even bought the exhibition book.",
          "ko": "네, 아주요. 어제 전시회 도록도 샀어요."
        },
        "frames": [
          "it-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Me lo fai vedere?",
        "gloss": {
          "en": "Will you show it to me?",
          "ko": "저도 보여 줄래요?"
        }
      },
      {
        "who": "me",
        "text": "Certo! Domani lo porto.",
        "gloss": {
          "en": "Sure! Tomorrow I'll bring it.",
          "ko": "그럼요! 내일 가져올게요."
        },
        "frames": [
          "it-f2-09"
        ]
      }
    ]
  },
  {
    "id": "it-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Breakfast at a hotel",
      "ko": "호텔 아침 식사"
    },
    "expressions": [
      "a che ora"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno! Tè o caffè?",
        "gloss": {
          "en": "Good morning! Tea or coffee?",
          "ko": "안녕하세요! 차로 드릴까요, 커피로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Per me un caffè lungo, grazie.",
        "gloss": {
          "en": "A long coffee for me, thanks.",
          "ko": "저는 연한 커피로 주세요."
        },
        "frames": [
          "it-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Certo. Il buffet è lì.",
        "gloss": {
          "en": "Sure. The buffet is over there.",
          "ko": "네. 뷔페는 저쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Posso sedermi vicino alla finestra?",
        "gloss": {
          "en": "Can I sit near the window?",
          "ko": "창가에 앉아도 돼요?"
        },
        "frames": [
          "it-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sì, prego.",
        "gloss": {
          "en": "Yes, please do.",
          "ko": "네, 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. A che ora finisce la colazione?",
        "gloss": {
          "en": "Thanks. What time does breakfast end?",
          "ko": "고마워요. 아침 식사는 몇 시에 끝나요?"
        },
        "frames": [
          "it-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Alle dieci e mezza.",
        "gloss": {
          "en": "At half past ten.",
          "ko": "열 시 반에요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, grazie mille!",
        "gloss": {
          "en": "Perfect, thanks a lot!",
          "ko": "좋아요, 정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "it-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A colleague asks for a favor",
      "ko": "동료가 부탁함"
    },
    "expressions": [
      "che peccato",
      "ho già finito",
      "ci vediamo"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Scusa, puoi aiutarmi con questa presentazione domani?",
        "gloss": {
          "en": "Sorry, can you help me with this presentation tomorrow?",
          "ko": "미안한데, 내일 이 발표 준비 좀 도와줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Che peccato, domani sono a Firenze per lavoro.",
        "gloss": {
          "en": "What a shame, tomorrow I'm in Florence for work.",
          "ko": "아쉽네요, 내일은 출장으로 피렌체에 있어요."
        },
        "frames": [
          "it-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Ah, davvero? E oggi pomeriggio?",
        "gloss": {
          "en": "Ah, really? And this afternoon?",
          "ko": "아, 정말요? 그럼 오늘 오후는요?"
        }
      },
      {
        "who": "me",
        "text": "Oggi sì. Ho già finito il mio rapporto.",
        "gloss": {
          "en": "Today, yes. I've already finished my report.",
          "ko": "오늘은 돼요. 보고서는 벌써 끝냈어요."
        },
        "frames": [
          "it-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Grazie mille! Vieni alla mia scrivania?",
        "gloss": {
          "en": "Thanks a lot! Will you come to my desk?",
          "ko": "정말 고마워요! 제 자리로 와 줄래요?"
        }
      },
      {
        "who": "me",
        "text": "Certo. Puoi mandarmi il file prima?",
        "gloss": {
          "en": "Sure. Can you send me the file first?",
          "ko": "그럼요. 먼저 파일 보내 줄래요?"
        },
        "frames": [
          "it-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Te lo mando subito.",
        "gloss": {
          "en": "I'll send it right away.",
          "ko": "바로 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, ci vediamo alle tre.",
        "gloss": {
          "en": "Perfect, see you at three.",
          "ko": "좋아요, 세 시에 봐요."
        },
        "frames": [
          "it-f2-13"
        ]
      }
    ]
  },
  {
    "id": "it-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's home",
      "ko": "친구 집에서 저녁 식사"
    },
    "expressions": [
      "davvero",
      "volentieri"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Benvenuta! Hai fame?",
        "gloss": {
          "en": "Welcome! Are you hungry?",
          "ko": "어서 와요! 배고파요?"
        }
      },
      {
        "who": "me",
        "text": "Un po'. Mi piacciono molto i profumi della tua cucina!",
        "gloss": {
          "en": "A bit. I really like the smells from your kitchen!",
          "ko": "조금요. 요리 냄새가 정말 좋아요!"
        },
        "frames": [
          "it-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Grazie! Ho fatto la parmigiana. Ti piace?",
        "gloss": {
          "en": "Thanks! I made parmigiana. Do you like it?",
          "ko": "고마워요! 파르미자나 만들었어요. 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, mi piace tantissimo!",
        "gloss": {
          "en": "Yes, I love it!",
          "ko": "네, 정말 좋아해요!"
        },
        "frames": [
          "it-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Buon appetito! Vuoi ancora un po' di vino?",
        "gloss": {
          "en": "Enjoy your meal! Would you like a bit more wine?",
          "ko": "맛있게 드세요! 와인 좀 더 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "No, grazie, ho già bevuto due bicchieri.",
        "gloss": {
          "en": "No, thanks, I've already had two glasses.",
          "ko": "아니요, 벌써 두 잔 마셨어요."
        },
        "frames": [
          "it-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "E il dolce? C'è il tiramisù.",
        "gloss": {
          "en": "And dessert? There's tiramisù.",
          "ko": "디저트는요? 티라미수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Davvero? Allora sì, volentieri!",
        "gloss": {
          "en": "Really? Then yes, gladly!",
          "ko": "정말요? 그럼 좋아요, 먹을게요!"
        },
        "frames": [
          "it-f2-11"
        ]
      }
    ]
  },
  {
    "id": "it-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to meet a friend",
      "ko": "친구와의 약속에 늦게 도착"
    },
    "expressions": [
      "scusa il ritardo",
      "se ti va",
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
        "text": "Eccoti, finalmente! Ti aspetto da mezz'ora.",
        "gloss": {
          "en": "There you are, finally! I've been waiting for half an hour.",
          "ko": "드디어 왔네요! 삼십 분째 기다렸어요."
        }
      },
      {
        "who": "me",
        "text": "Scusa il ritardo, l'autobus non passava più.",
        "gloss": {
          "en": "Sorry I'm late, the bus just wouldn't come.",
          "ko": "늦어서 미안해요, 버스가 계속 안 왔어요."
        },
        "frames": [
          "it-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Non fa niente. Ma perché non mi hai scritto?",
        "gloss": {
          "en": "Never mind. But why didn't you text me?",
          "ko": "괜찮아요. 근데 왜 문자 안 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Mentre aspettavo alla fermata, mi ha chiamato Giulia e il telefono si è scaricato.",
        "gloss": {
          "en": "While I was waiting at the stop, Giulia called me and my phone died.",
          "ko": "정류장에서 기다리는데 줄리아가 전화해서 휴대폰 배터리가 나갔어요."
        },
        "frames": [
          "it-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Che sfortuna! Allora, cosa facciamo?",
        "gloss": {
          "en": "What bad luck! So, what shall we do?",
          "ko": "운이 없었네요! 그럼 뭐 할까요?"
        }
      },
      {
        "who": "me",
        "text": "Se ti va, ti offro un aperitivo per farmi perdonare.",
        "gloss": {
          "en": "If you like, I'll buy you an aperitivo to make up for it.",
          "ko": "괜찮으면 미안한 마음에 아페리티보 살게요."
        },
        "frames": [
          "it-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Va bene, accetto!",
        "gloss": {
          "en": "OK, I accept!",
          "ko": "좋아요, 그렇게 해요!"
        }
      },
      {
        "who": "me",
        "text": "Per fortuna c'è un bar proprio qui all'angolo.",
        "gloss": {
          "en": "Luckily there's a bar right here on the corner.",
          "ko": "다행히 바로 모퉁이에 바가 있어요."
        },
        "frames": [
          "it-f3-19"
        ]
      }
    ]
  },
  {
    "id": "it-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A problem with a hotel room",
      "ko": "호텔 방 문제"
    },
    "expressions": [
      "purtroppo",
      "magari",
      "per fortuna"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Reception, buonasera. Mi dica.",
        "gloss": {
          "en": "Reception, good evening. How can I help?",
          "ko": "프런트입니다. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Buonasera. Purtroppo l'aria condizionata non funziona.",
        "gloss": {
          "en": "Good evening. Unfortunately the air conditioning isn't working.",
          "ko": "안녕하세요. 죄송한데 에어컨이 작동하지 않아요."
        },
        "frames": [
          "it-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Mi dispiace molto. Mando subito un tecnico.",
        "gloss": {
          "en": "I'm very sorry. I'll send a technician right away.",
          "ko": "정말 죄송합니다. 바로 기술자를 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Potrebbe dirmi più o meno quando arriva?",
        "gloss": {
          "en": "Thanks. Could you tell me roughly when he'll come?",
          "ko": "고마워요. 대략 언제 오는지 알려 주실 수 있어요?"
        },
        "frames": [
          "it-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Tra un quarto d'ora. Oppure, se preferisce, le cambiamo la camera.",
        "gloss": {
          "en": "In a quarter of an hour. Or, if you prefer, we'll change your room.",
          "ko": "십오 분 뒤에요. 아니면 원하시면 방을 바꿔 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Magari è meglio cambiare camera, sono molto stanco.",
        "gloss": {
          "en": "Maybe it's better to change rooms, I'm very tired.",
          "ko": "방을 바꾸는 게 낫겠어요, 너무 피곤해서요."
        },
        "frames": [
          "it-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Certo. La camera al terzo piano è libera, gliela preparo subito.",
        "gloss": {
          "en": "Of course. The room on the third floor is free, I'll get it ready for you now.",
          "ko": "물론이죠. 삼 층 방이 비어 있어요, 바로 준비해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Per fortuna! Grazie mille.",
        "gloss": {
          "en": "Thank goodness! Thanks a lot.",
          "ko": "다행이에요! 정말 고마워요."
        },
        "frames": [
          "it-f3-19"
        ]
      }
    ]
  },
  {
    "id": "it-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about childhood with a friend",
      "ko": "친구와 어린 시절 이야기"
    },
    "expressions": [
      "insomma",
      "infatti",
      "comunque",
      "non vedo l'ora"
    ],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Che bella foto! Sei tu da bambino?",
        "gloss": {
          "en": "What a lovely photo! Is that you as a kid?",
          "ko": "사진 예쁘다! 어릴 때 당신이에요?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Da piccolo passavo tutte le estati al mare con i nonni.",
        "gloss": {
          "en": "Yes! As a kid I spent every summer at the seaside with my grandparents.",
          "ko": "네! 어릴 때 여름마다 할머니 할아버지랑 바닷가에서 지냈어요."
        },
        "frames": [
          "it-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Che bello! Dove?",
        "gloss": {
          "en": "How lovely! Where?",
          "ko": "좋다! 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "In un paesino vicino a Gangneung. Ci sono stato anche l'anno scorso.",
        "gloss": {
          "en": "In a little village near Gangneung. I went there last year too.",
          "ko": "강릉 근처 작은 마을이요. 작년에도 가 봤어요."
        },
        "frames": [
          "it-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Ed era cambiato?",
        "gloss": {
          "en": "And had it changed?",
          "ko": "많이 변했어요?"
        }
      },
      {
        "who": "me",
        "text": "Insomma... Penso che sia diventato più turistico.",
        "gloss": {
          "en": "Well... I think it's become more touristy.",
          "ko": "글쎄요... 관광지가 더 된 것 같아요."
        },
        "frames": [
          "it-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Succede dappertutto.",
        "gloss": {
          "en": "That happens everywhere.",
          "ko": "어디나 그렇죠."
        }
      },
      {
        "who": "me",
        "text": "Infatti. Comunque non vedo l'ora di tornarci con te!",
        "gloss": {
          "en": "Exactly. Anyway, I can't wait to go back there with you!",
          "ko": "맞아요. 아무튼 당신이랑 거기 빨리 다시 가 보고 싶어요!"
        },
        "frames": [
          "it-f3-16"
        ]
      }
    ]
  },
  {
    "id": "it-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calming a friend before a driving test",
      "ko": "운전면허 시험 앞둔 친구 안심시키기"
    },
    "expressions": [
      "non ti preoccupare",
      "pazienza",
      "magari"
    ],
    "grammar": [
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Domani ho l'esame di guida e sono nervosissimo.",
        "gloss": {
          "en": "Tomorrow I have my driving test and I'm super nervous.",
          "ko": "내일 운전면허 시험인데 너무 긴장돼요."
        }
      },
      {
        "who": "me",
        "text": "Non ti preoccupare, hai fatto tante lezioni.",
        "gloss": {
          "en": "Don't worry, you've had lots of lessons.",
          "ko": "걱정하지 마요, 연수 많이 받았잖아요."
        },
        "frames": [
          "it-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sì, ma ho paura di sbagliare il parcheggio.",
        "gloss": {
          "en": "Yes, but I'm afraid of messing up the parking.",
          "ko": "네, 근데 주차를 망칠까 봐 무서워요."
        }
      },
      {
        "who": "me",
        "text": "Prova a fare un giro stasera con tuo padre!",
        "gloss": {
          "en": "Try going for a drive tonight with your dad!",
          "ko": "오늘 저녁에 아버지랑 한 바퀴 돌아 봐요!"
        },
        "frames": [
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Buona idea. E se non passo?",
        "gloss": {
          "en": "Good idea. And if I don't pass?",
          "ko": "좋은 생각이에요. 떨어지면요?"
        }
      },
      {
        "who": "me",
        "text": "Pazienza, lo rifai! Ma non credo che sia così difficile.",
        "gloss": {
          "en": "Oh well, you'll take it again! But I don't think it's that hard.",
          "ko": "그럼 다시 보면 돼요! 근데 그렇게 어렵진 않을 거예요."
        },
        "frames": [
          "it-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Speriamo!",
        "gloss": {
          "en": "Let's hope so!",
          "ko": "그랬으면 좋겠어요!"
        }
      },
      {
        "who": "me",
        "text": "Magari domani sera festeggiamo insieme!",
        "gloss": {
          "en": "Maybe tomorrow night we'll be celebrating together!",
          "ko": "내일 저녁엔 같이 축하하고 있을지도 몰라요!"
        },
        "frames": [
          "it-f3-20"
        ]
      }
    ]
  },
  {
    "id": "it-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a TV series",
      "ko": "드라마 이야기"
    },
    "expressions": [
      "sul serio",
      "non vedo l'ora"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai cominciato quella serie spagnola?",
        "gloss": {
          "en": "Have you started that Spanish series?",
          "ko": "그 스페인 드라마 시작했어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ieri sera ne ho visti quattro episodi di fila!",
        "gloss": {
          "en": "Yes, last night I watched four episodes in a row!",
          "ko": "네, 어젯밤에 네 편 연달아 봤어요!"
        },
        "frames": [
          "it-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Quattro? Addirittura!",
        "gloss": {
          "en": "Four? Wow!",
          "ko": "네 편이요? 대단하네요!"
        }
      },
      {
        "who": "me",
        "text": "Lo so! Penso che sia la serie migliore dell'anno.",
        "gloss": {
          "en": "I know! I think it's the best series of the year.",
          "ko": "그러니까요! 올해 최고의 드라마인 것 같아요."
        },
        "frames": [
          "it-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Io l'ho trovata un po' lenta all'inizio.",
        "gloss": {
          "en": "I found it a bit slow at the beginning.",
          "ko": "저는 처음엔 좀 느리다고 느꼈어요."
        }
      },
      {
        "who": "me",
        "text": "Sul serio? Non ti è piaciuto il primo episodio?",
        "gloss": {
          "en": "Seriously? You didn't like the first episode?",
          "ko": "진짜요? 첫 편이 별로였어요?"
        },
        "frames": [
          "it-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Insomma... ma continuo a guardarla.",
        "gloss": {
          "en": "Not really... but I'm still watching it.",
          "ko": "그냥 그래요... 근데 계속 보고 있어요."
        }
      },
      {
        "who": "me",
        "text": "Bravo! Non vedo l'ora di vedere il finale.",
        "gloss": {
          "en": "Good! I can't wait to see the ending.",
          "ko": "잘했어요! 결말이 너무 궁금해요."
        },
        "frames": [
          "it-f3-16"
        ]
      }
    ]
  },
  {
    "id": "it-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Helping a stressed colleague",
      "ko": "스트레스 받는 동료 돕기"
    },
    "expressions": [
      "non ti preoccupare"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Che casino oggi! Il cliente non mi risponde.",
        "gloss": {
          "en": "What a mess today! The client isn't answering me.",
          "ko": "오늘 정말 난리예요! 고객이 답을 안 해요."
        }
      },
      {
        "who": "me",
        "text": "Sarà in riunione. Gli hai scritto?",
        "gloss": {
          "en": "He must be in a meeting. Did you write to him?",
          "ko": "회의 중일 거예요. 메일 보냈어요?"
        },
        "frames": [
          "it-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Sì, due volte, stamattina.",
        "gloss": {
          "en": "Yes, twice, this morning.",
          "ko": "네, 오늘 아침에 두 번이요."
        }
      },
      {
        "who": "me",
        "text": "Anch'io gli ho mandato un messaggio ieri, ma niente.",
        "gloss": {
          "en": "I sent him a message yesterday too, but nothing.",
          "ko": "저도 어제 메시지 보냈는데 답이 없어요."
        },
        "frames": [
          "it-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Allora lo chiamo dopo pranzo.",
        "gloss": {
          "en": "Then I'll call him after lunch.",
          "ko": "그럼 점심 먹고 전화할게요."
        }
      },
      {
        "who": "me",
        "text": "Buona idea. Intanto mi potresti mandare il contratto?",
        "gloss": {
          "en": "Good idea. Meanwhile, could you send me the contract?",
          "ko": "좋은 생각이에요. 그동안 계약서 좀 보내 줄래요?"
        },
        "frames": [
          "it-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Certo, te lo mando subito.",
        "gloss": {
          "en": "Sure, I'll send it right away.",
          "ko": "그럼요, 바로 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Non ti preoccupare, risolviamo tutto.",
        "gloss": {
          "en": "Thanks. Don't worry, we'll sort it all out.",
          "ko": "고마워요. 걱정 마요, 다 해결될 거예요."
        },
        "frames": [
          "it-f3-14"
        ]
      }
    ]
  },
  {
    "id": "it-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a trip to Venice with a friend",
      "ko": "친구와 베네치아 여행 계획"
    },
    "expressions": [
      "magari",
      "non vedo l'ora"
    ],
    "grammar": [
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ad aprile andiamo a Venezia?",
        "gloss": {
          "en": "Shall we go to Venice in April?",
          "ko": "사월에 베네치아 갈까요?"
        }
      },
      {
        "who": "me",
        "text": "Volentieri! Ci sono stato una volta, da studente.",
        "gloss": {
          "en": "Gladly! I've been there once, as a student.",
          "ko": "좋아요! 학생 때 한 번 가 봤어요."
        },
        "frames": [
          "it-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Ah sì? Allora, cosa dobbiamo vedere?",
        "gloss": {
          "en": "Oh really? So, what should we see?",
          "ko": "아 그래요? 그럼 뭘 봐야 해요?"
        }
      },
      {
        "who": "me",
        "text": "Prova a perderti tra le calli, è la cosa più bella!",
        "gloss": {
          "en": "Try getting lost in the little streets, it's the best thing!",
          "ko": "골목에서 길을 잃어 봐요, 그게 제일 좋아요!"
        },
        "frames": [
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "E per dormire? Gli alberghi sono carissimi.",
        "gloss": {
          "en": "And for sleeping? Hotels are really expensive.",
          "ko": "잠은요? 호텔이 엄청 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Magari prendiamo un appartamento a Mestre.",
        "gloss": {
          "en": "Maybe we could get an apartment in Mestre.",
          "ko": "메스트레에 아파트를 잡으면 어때요."
        },
        "frames": [
          "it-f3-20"
        ]
      },
      {
        "who": "them",
        "text": "Ottima idea, costa meno.",
        "gloss": {
          "en": "Great idea, it's cheaper.",
          "ko": "좋은 생각이에요, 더 싸요."
        }
      },
      {
        "who": "me",
        "text": "Non vedo l'ora di partire!",
        "gloss": {
          "en": "I can't wait to leave!",
          "ko": "빨리 떠나고 싶어요!"
        },
        "frames": [
          "it-f3-16"
        ]
      }
    ]
  },
  {
    "id": "it-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend shares big news",
      "ko": "친구의 깜짝 소식"
    },
    "expressions": [
      "sul serio",
      "magari"
    ],
    "grammar": [
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Indovina! Ho trovato lavoro a Londra!",
        "gloss": {
          "en": "Guess what! I found a job in London!",
          "ko": "맞혀 봐요! 런던에서 일자리 구했어요!"
        }
      },
      {
        "who": "me",
        "text": "Sul serio? Quando parti?",
        "gloss": {
          "en": "Seriously? When are you leaving?",
          "ko": "진짜요? 언제 떠나요?"
        },
        "frames": [
          "it-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Il mese prossimo. Sono felice, ma anche un po' triste.",
        "gloss": {
          "en": "Next month. I'm happy, but also a bit sad.",
          "ko": "다음 달이요. 기쁘지만 좀 슬프기도 해요."
        }
      },
      {
        "who": "me",
        "text": "Penso che sia un'occasione fantastica per te.",
        "gloss": {
          "en": "I think it's a fantastic opportunity for you.",
          "ko": "당신한테 정말 좋은 기회인 것 같아요."
        },
        "frames": [
          "it-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Grazie! Però mi mancherete tutti.",
        "gloss": {
          "en": "Thanks! But I'll miss you all.",
          "ko": "고마워요! 그래도 다들 보고 싶을 거예요."
        }
      },
      {
        "who": "me",
        "text": "Dimmi quando facciamo la festa d'addio!",
        "gloss": {
          "en": "Tell me when we're having the farewell party!",
          "ko": "송별회 언제 할지 말해 줘요!"
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Sabato prossimo, forse.",
        "gloss": {
          "en": "Next Saturday, maybe.",
          "ko": "아마 다음 주 토요일이요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto! E magari un giorno veniamo a trovarti a Londra!",
        "gloss": {
          "en": "Perfect! And maybe one day we'll come and visit you in London!",
          "ko": "좋아요! 언젠가 런던으로 놀러 갈 수도 있겠네요!"
        },
        "frames": [
          "it-f3-20"
        ]
      }
    ]
  },
  {
    "id": "it-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a restaurant with a friend",
      "ko": "친구와 식당 고르기"
    },
    "expressions": [
      "se ti va",
      "dai"
    ],
    "grammar": [
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Stasera andiamo in quel ristorante giapponese nuovo?",
        "gloss": {
          "en": "Shall we go to that new Japanese restaurant tonight?",
          "ko": "오늘 저녁 새로 생긴 일식집 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "Mah, non credo che sia aperto il lunedì.",
        "gloss": {
          "en": "Hmm, I don't think it's open on Mondays.",
          "ko": "음, 월요일엔 안 열 것 같아요."
        },
        "frames": [
          "it-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Hai ragione. E allora?",
        "gloss": {
          "en": "You're right. So then?",
          "ko": "맞네요. 그럼 어떡해요?"
        }
      },
      {
        "who": "me",
        "text": "Se ti va, proviamo la trattoria sotto casa mia.",
        "gloss": {
          "en": "If you like, let's try the trattoria below my place.",
          "ko": "괜찮으면 우리 집 아래 트라토리아 가 봐요."
        },
        "frames": [
          "it-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Quella con il giardino? Ci sei già stato?",
        "gloss": {
          "en": "The one with the garden? Have you been there already?",
          "ko": "정원 있는 데요? 가 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ci sono stato due volte. Prova la carbonara, è incredibile!",
        "gloss": {
          "en": "Yes, I've been there twice. Try the carbonara, it's amazing!",
          "ko": "네, 두 번 가 봤어요. 카르보나라 먹어 봐요, 끝내줘요!"
        },
        "frames": [
          "it-f3-05",
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Va bene, mi hai convinto. Prenoto io?",
        "gloss": {
          "en": "OK, you've convinced me. Shall I book?",
          "ko": "좋아요, 넘어갔어요. 제가 예약할까요?"
        }
      },
      {
        "who": "me",
        "text": "Dai, prenoto io, ho il numero.",
        "gloss": {
          "en": "No, come on, I'll book, I have the number.",
          "ko": "아니에요, 제가 할게요, 번호 있어요."
        }
      }
    ]
  },
  {
    "id": "it-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The office printer is broken",
      "ko": "사무실 프린터 고장"
    },
    "expressions": [
      "purtroppo",
      "comunque",
      "per fortuna"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai stampato i documenti per la riunione?",
        "gloss": {
          "en": "Have you printed the documents for the meeting?",
          "ko": "회의 자료 출력했어요?"
        }
      },
      {
        "who": "me",
        "text": "Purtroppo la stampante non funziona di nuovo.",
        "gloss": {
          "en": "Unfortunately the printer isn't working again.",
          "ko": "안타깝게도 프린터가 또 안 돼요."
        },
        "frames": [
          "it-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Che casino! La riunione è tra dieci minuti.",
        "gloss": {
          "en": "What a mess! The meeting is in ten minutes.",
          "ko": "큰일이네요! 회의가 십 분 뒤예요."
        }
      },
      {
        "who": "me",
        "text": "Mi potresti mandare i file? Li stampo al piano di sopra.",
        "gloss": {
          "en": "Could you send me the files? I'll print them upstairs.",
          "ko": "파일 좀 보내 줄래요? 위층에서 출력할게요."
        },
        "frames": [
          "it-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Certo, te li mando adesso. Hai chiamato il tecnico?",
        "gloss": {
          "en": "Sure, I'm sending them now. Did you call the technician?",
          "ko": "그럼요, 지금 보낼게요. 기술자 불렀어요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, gli ho scritto stamattina, ma non ha risposto.",
        "gloss": {
          "en": "Yes, I wrote to him this morning, but he hasn't replied.",
          "ko": "네, 오늘 아침에 연락했는데 답이 없어요."
        },
        "frames": [
          "it-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Sarà occupato.",
        "gloss": {
          "en": "He must be busy.",
          "ko": "바쁜가 봐요."
        }
      },
      {
        "who": "me",
        "text": "Comunque per fortuna abbiamo ancora un po' di tempo.",
        "gloss": {
          "en": "Anyway, luckily we still have a bit of time.",
          "ko": "아무튼 다행히 아직 시간이 좀 있어요."
        },
        "frames": [
          "it-f3-19"
        ]
      }
    ]
  },
  {
    "id": "it-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the landlord about the heating",
      "ko": "난방 문제로 집주인에게 전화"
    },
    "expressions": [
      "purtroppo",
      "per fortuna",
      "magari"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pronto, chi parla?",
        "gloss": {
          "en": "Hello, who's speaking?",
          "ko": "여보세요, 누구세요?"
        }
      },
      {
        "who": "me",
        "text": "Buongiorno, sono l'inquilina del secondo piano. Purtroppo il riscaldamento non funziona.",
        "gloss": {
          "en": "Good morning, it's the tenant from the second floor. Unfortunately the heating isn't working.",
          "ko": "안녕하세요, 이 층 세입자예요. 안타깝게도 난방이 안 돼요."
        },
        "frames": [
          "it-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Ancora? Da quando?",
        "gloss": {
          "en": "Again? Since when?",
          "ko": "또요? 언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Da ieri sera. Potrebbe mandare qualcuno oggi?",
        "gloss": {
          "en": "Since last night. Could you send someone today?",
          "ko": "어젯밤부터요. 오늘 사람 좀 보내 주실 수 있어요?"
        },
        "frames": [
          "it-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Oggi è difficile... forse domani mattina.",
        "gloss": {
          "en": "Today is difficult... maybe tomorrow morning.",
          "ko": "오늘은 어려워요... 아마 내일 아침에요."
        }
      },
      {
        "who": "me",
        "text": "Domani va bene. Per fortuna ho una stufetta elettrica.",
        "gloss": {
          "en": "Tomorrow is fine. Luckily I have a small electric heater.",
          "ko": "내일 괜찮아요. 다행히 전기난로가 있어요."
        },
        "frames": [
          "it-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Meno male. Allora ci sentiamo domani.",
        "gloss": {
          "en": "Thank goodness. Then we'll talk tomorrow.",
          "ko": "다행이네요. 그럼 내일 연락해요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, grazie. Magari mi chiama prima di venire?",
        "gloss": {
          "en": "Perfect, thanks. Maybe you could call me before you come?",
          "ko": "좋아요, 고마워요. 오시기 전에 전화 주실 수 있을까요?"
        },
        "frames": [
          "it-f3-20"
        ]
      }
    ]
  },
  {
    "id": "it-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Gossip with a friend over coffee",
      "ko": "커피 마시며 친구와 수다"
    },
    "expressions": [
      "dai",
      "sul serio"
    ],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Non sai cosa è successo ieri in ufficio!",
        "gloss": {
          "en": "You won't believe what happened at the office yesterday!",
          "ko": "어제 사무실에서 무슨 일 있었는지 모를 거예요!"
        }
      },
      {
        "who": "me",
        "text": "Dai, dimmi tutto!",
        "gloss": {
          "en": "Come on, tell me everything!",
          "ko": "어서요, 다 말해 줘요!"
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Il capo si è dimesso!",
        "gloss": {
          "en": "The boss resigned!",
          "ko": "사장님이 그만뒀어요!"
        }
      },
      {
        "who": "me",
        "text": "Sul serio? E perché?",
        "gloss": {
          "en": "Seriously? And why?",
          "ko": "진짜요? 왜요?"
        },
        "frames": [
          "it-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Boh, nessuno lo sa. Ha detto solo: basta.",
        "gloss": {
          "en": "Who knows, nobody knows. He just said: enough.",
          "ko": "몰라요, 아무도 몰라요. 그냥 \"그만\"이라고만 했대요."
        }
      },
      {
        "who": "me",
        "text": "Sarà stanco, lavorava sempre fino a tardi.",
        "gloss": {
          "en": "He must be tired, he always worked until late.",
          "ko": "지쳤겠죠, 맨날 늦게까지 일했잖아요."
        },
        "frames": [
          "it-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Infatti. E adesso chi arriva?",
        "gloss": {
          "en": "Exactly. And who's coming now?",
          "ko": "그러니까요. 이제 누가 와요?"
        }
      },
      {
        "who": "me",
        "text": "Speriamo qualcuno più simpatico!",
        "gloss": {
          "en": "Let's hope someone nicer!",
          "ko": "더 좋은 사람이면 좋겠어요!"
        }
      }
    ]
  },
  {
    "id": "it-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Visiting your old school",
      "ko": "옛 학교 방문"
    },
    "expressions": [
      "se ti va"
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
        "text": "Questa era la tua scuola?",
        "gloss": {
          "en": "Was this your school?",
          "ko": "여기가 다니던 학교예요?"
        }
      },
      {
        "who": "me",
        "text": "Sì! Da piccolo venivo qui a piedi ogni mattina.",
        "gloss": {
          "en": "Yes! As a kid I walked here every morning.",
          "ko": "네! 어릴 때 매일 아침 걸어서 왔어요."
        },
        "frames": [
          "it-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Ti piaceva?",
        "gloss": {
          "en": "Did you like it?",
          "ko": "좋았어요?"
        }
      },
      {
        "who": "me",
        "text": "Moltissimo. Avevo una maestra bravissima e ne ho tanti ricordi.",
        "gloss": {
          "en": "Very much. I had a wonderful teacher and I have lots of memories of it.",
          "ko": "아주요. 정말 좋은 선생님이 계셨고 추억이 많아요."
        },
        "frames": [
          "it-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "È ancora qui la tua maestra?",
        "gloss": {
          "en": "Is your teacher still here?",
          "ko": "그 선생님 아직 여기 계세요?"
        }
      },
      {
        "who": "me",
        "text": "Non credo che lavori ancora, sarà in pensione.",
        "gloss": {
          "en": "I don't think she still works, she must be retired.",
          "ko": "아직 일하실 것 같진 않아요, 은퇴하셨겠죠."
        },
        "frames": [
          "it-f3-10",
          "it-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Peccato. Entriamo a dare un'occhiata?",
        "gloss": {
          "en": "Shame. Shall we go in and have a look?",
          "ko": "아쉽네요. 들어가서 둘러볼까요?"
        }
      },
      {
        "who": "me",
        "text": "Se ti va, sì! Chiediamo al custode.",
        "gloss": {
          "en": "If you like, yes! Let's ask the caretaker.",
          "ko": "괜찮으면 그래요! 관리인한테 물어봐요."
        },
        "frames": [
          "it-f3-15"
        ]
      }
    ]
  },
  {
    "id": "it-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A neighbor's cat is missing",
      "ko": "이웃집 고양이가 없어짐"
    },
    "expressions": [
      "non ti preoccupare",
      "meno male",
      "per fortuna"
    ],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai visto il mio gatto? Non torna da ieri!",
        "gloss": {
          "en": "Have you seen my cat? He hasn't come back since yesterday!",
          "ko": "우리 고양이 봤어요? 어제부터 안 들어와요!"
        }
      },
      {
        "who": "me",
        "text": "Non ti preoccupare, i gatti tornano sempre.",
        "gloss": {
          "en": "Don't worry, cats always come back.",
          "ko": "걱정하지 마요, 고양이는 항상 돌아와요."
        },
        "frames": [
          "it-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Lo spero... È la prima volta.",
        "gloss": {
          "en": "I hope so... It's the first time.",
          "ko": "그러면 좋겠어요... 이런 건 처음이에요."
        }
      },
      {
        "who": "me",
        "text": "Aspetta... Stamattina ho visto un gatto grigio in giardino. Sarà lui!",
        "gloss": {
          "en": "Wait... This morning I saw a grey cat in the garden. It must be him!",
          "ko": "잠깐만요... 오늘 아침에 정원에서 회색 고양이를 봤어요. 그 애일 거예요!"
        },
        "frames": [
          "it-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Davvero? Dove esattamente?",
        "gloss": {
          "en": "Really? Where exactly?",
          "ko": "정말요? 정확히 어디서요?"
        }
      },
      {
        "who": "me",
        "text": "Vicino alla fontana. Prova a chiamarlo lì!",
        "gloss": {
          "en": "Near the fountain. Try calling him there!",
          "ko": "분수 근처요. 거기서 불러 봐요!"
        },
        "frames": [
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Eccolo! Era sotto la panchina!",
        "gloss": {
          "en": "There he is! He was under the bench!",
          "ko": "여기 있다! 벤치 밑에 있었어요!"
        }
      },
      {
        "who": "me",
        "text": "Meno male! Per fortuna sta bene.",
        "gloss": {
          "en": "Thank goodness! Luckily he's fine.",
          "ko": "다행이다! 다친 데 없어서 다행이에요."
        },
        "frames": [
          "it-f3-19"
        ]
      }
    ]
  },
  {
    "id": "it-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a birthday present",
      "ko": "생일 선물 계획"
    },
    "expressions": [
      "se ti va",
      "ci penso"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Sabato è il compleanno di Marco. Cosa gli regaliamo?",
        "gloss": {
          "en": "Saturday is Marco's birthday. What shall we give him?",
          "ko": "토요일이 마르코 생일이에요. 뭘 선물할까요?"
        }
      },
      {
        "who": "me",
        "text": "L'anno scorso gli ho regalato un libro. Quest'anno qualcosa di diverso?",
        "gloss": {
          "en": "Last year I gave him a book. Something different this year?",
          "ko": "작년엔 책을 선물했어요. 올해는 다른 걸로 할까요?"
        },
        "frames": [
          "it-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Sì. Gli piace tanto la musica...",
        "gloss": {
          "en": "Yes. He really likes music...",
          "ko": "네. 마르코가 음악을 정말 좋아하잖아요..."
        }
      },
      {
        "who": "me",
        "text": "Penso che un biglietto per un concerto sia perfetto.",
        "gloss": {
          "en": "I think a concert ticket would be perfect.",
          "ko": "콘서트 표가 딱일 것 같아요."
        },
        "frames": [
          "it-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Ottimo! Ma costano tanto.",
        "gloss": {
          "en": "Great! But they cost a lot.",
          "ko": "좋아요! 근데 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Se ti va, lo paghiamo a metà.",
        "gloss": {
          "en": "If you like, we can split it.",
          "ko": "괜찮으면 반반 내요."
        },
        "frames": [
          "it-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "D'accordo! Lo compri tu online?",
        "gloss": {
          "en": "Deal! Will you buy it online?",
          "ko": "좋아요! 당신이 인터넷으로 살래요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, ci penso io stasera.",
        "gloss": {
          "en": "Yes, I'll take care of it tonight.",
          "ko": "네, 오늘 저녁에 제가 할게요."
        }
      }
    ]
  },
  {
    "id": "it-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Missing the train",
      "ko": "기차를 놓침"
    },
    "expressions": [
      "per fortuna",
      "ci penso",
      "non vedo l'ora"
    ],
    "grammar": [
      1,
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allora, sei sul treno?",
        "gloss": {
          "en": "So, are you on the train?",
          "ko": "그래서, 기차 탔어요?"
        }
      },
      {
        "who": "me",
        "text": "No! Mentre compravo un caffè, mi ha chiamato Giulia e ho perso il treno.",
        "gloss": {
          "en": "No! While I was buying a coffee, Giulia called me and I missed the train.",
          "ko": "아니요! 커피 사는데 줄리아가 전화해서 기차를 놓쳤어요."
        },
        "frames": [
          "it-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Che casino! E adesso?",
        "gloss": {
          "en": "What a mess! And now?",
          "ko": "큰일이네요! 이제 어떡해요?"
        }
      },
      {
        "who": "me",
        "text": "Per fortuna ce n'è un altro tra un'ora.",
        "gloss": {
          "en": "Luckily there's another one in an hour.",
          "ko": "다행히 한 시간 뒤에 또 있어요."
        },
        "frames": [
          "it-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Meno male. Arrivi per cena, allora?",
        "gloss": {
          "en": "Thank goodness. So you'll make it for dinner?",
          "ko": "다행이다. 그럼 저녁때는 도착해요?"
        }
      },
      {
        "who": "me",
        "text": "Sì, sarò lì verso le otto. Dimmi se devo comprare qualcosa.",
        "gloss": {
          "en": "Yes, I'll be there around eight. Tell me if I need to buy anything.",
          "ko": "네, 여덟 시쯤 도착할 거예요. 뭐 사 가야 하면 말해 줘요."
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Porta solo il pane, grazie.",
        "gloss": {
          "en": "Just bring bread, thanks.",
          "ko": "빵만 사 와요, 고마워요."
        }
      },
      {
        "who": "me",
        "text": "D'accordo, ci penso io. Non vedo l'ora di vederti!",
        "gloss": {
          "en": "OK, I'll take care of it. I can't wait to see you!",
          "ko": "알겠어요, 제가 챙길게요. 빨리 보고 싶어요!"
        },
        "frames": [
          "it-f3-16"
        ]
      }
    ]
  },
  {
    "id": "it-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Giving a friend cooking advice",
      "ko": "친구에게 요리 조언"
    },
    "expressions": [
      "allora",
      "non vedo l'ora"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Voglio fare il risotto stasera, ma ho paura di sbagliare.",
        "gloss": {
          "en": "I want to make risotto tonight, but I'm afraid of getting it wrong.",
          "ko": "오늘 저녁에 리소토 하고 싶은데 망칠까 봐 걱정돼요."
        }
      },
      {
        "who": "me",
        "text": "Prova la ricetta di mia nonna, è facilissima!",
        "gloss": {
          "en": "Try my grandmother's recipe, it's really easy!",
          "ko": "우리 할머니 레시피로 해 봐요, 엄청 쉬워요!"
        },
        "frames": [
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Davvero? Com'è?",
        "gloss": {
          "en": "Really? How does it go?",
          "ko": "정말요? 어떻게 하는데요?"
        }
      },
      {
        "who": "me",
        "text": "Allora: prima il soffritto, poi il riso. Dimmi se hai lo zafferano.",
        "gloss": {
          "en": "So: first the soffritto, then the rice. Tell me if you have saffron.",
          "ko": "자, 먼저 소프리토를 볶고 그다음에 쌀이요. 사프란 있는지 말해 줘요."
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Sì, ce l'ho. E il brodo?",
        "gloss": {
          "en": "Yes, I have it. And the broth?",
          "ko": "네, 있어요. 육수는요?"
        }
      },
      {
        "who": "me",
        "text": "Ne ho fatto un litro ieri, te lo porto io.",
        "gloss": {
          "en": "I made a litre of it yesterday, I'll bring it to you.",
          "ko": "어제 일 리터 만들어 놨어요, 제가 가져갈게요."
        },
        "frames": [
          "it-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Sei un angelo!",
        "gloss": {
          "en": "You're an angel!",
          "ko": "천사예요!"
        }
      },
      {
        "who": "me",
        "text": "Figurati! Non vedo l'ora di assaggiarlo.",
        "gloss": {
          "en": "Don't mention it! I can't wait to taste it.",
          "ko": "별말씀을요! 빨리 맛보고 싶어요."
        },
        "frames": [
          "it-f3-16"
        ]
      }
    ]
  },
  {
    "id": "it-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Picking up a rental car",
      "ko": "렌터카 받기"
    },
    "expressions": [
      "purtroppo",
      "per fortuna"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Buongiorno. Ecco le chiavi, la macchina è nel parcheggio.",
        "gloss": {
          "en": "Good morning. Here are the keys, the car is in the car park.",
          "ko": "안녕하세요. 여기 열쇠요, 차는 주차장에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Grazie. Potrebbe spiegarmi come funziona il navigatore?",
        "gloss": {
          "en": "Thanks. Could you explain how the satnav works?",
          "ko": "고마워요. 내비게이션 쓰는 법 좀 설명해 주실 수 있어요?"
        },
        "frames": [
          "it-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Certo, è semplice. Lo accendo io... Ecco.",
        "gloss": {
          "en": "Sure, it's simple. I'll switch it on... There.",
          "ko": "네, 간단해요. 제가 켤게요... 됐어요."
        }
      },
      {
        "who": "me",
        "text": "Purtroppo lo schermo non funziona, è tutto nero.",
        "gloss": {
          "en": "Unfortunately the screen isn't working, it's all black.",
          "ko": "안타깝게도 화면이 안 나와요, 완전히 까매요."
        },
        "frames": [
          "it-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Ah, mi scusi! Le do un'altra macchina.",
        "gloss": {
          "en": "Ah, I'm sorry! I'll give you another car.",
          "ko": "아, 죄송해요! 다른 차 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Per fortuna me ne sono accorto prima di partire!",
        "gloss": {
          "en": "Luckily I noticed before setting off!",
          "ko": "출발 전에 알아서 다행이에요!"
        },
        "frames": [
          "it-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Ha ragione. Ecco, questa è nuova.",
        "gloss": {
          "en": "You're right. Here, this one is new.",
          "ko": "맞아요. 여기, 이건 새 차예요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. Potrebbe dirmi anche a che ora devo riportarla?",
        "gloss": {
          "en": "Perfect. Could you also tell me what time I have to bring it back?",
          "ko": "좋아요. 몇 시까지 반납해야 하는지도 알려 주실래요?"
        },
        "frames": [
          "it-f3-07"
        ]
      }
    ]
  },
  {
    "id": "it-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend nervous about a job interview",
      "ko": "면접 앞두고 긴장한 친구"
    },
    "expressions": [
      "non ti preoccupare",
      "dai"
    ],
    "grammar": [
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tra un'ora ho il colloquio. Sto tremando!",
        "gloss": {
          "en": "I have the interview in an hour. I'm shaking!",
          "ko": "한 시간 뒤에 면접이에요. 떨려 죽겠어요!"
        }
      },
      {
        "who": "me",
        "text": "Non ti preoccupare, sei preparatissima.",
        "gloss": {
          "en": "Don't worry, you're really well prepared.",
          "ko": "걱정하지 마요, 준비 엄청 잘했잖아요."
        },
        "frames": [
          "it-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "E se mi chiedono perché ho lasciato l'altro lavoro?",
        "gloss": {
          "en": "And what if they ask me why I left my other job?",
          "ko": "전 직장을 왜 그만뒀냐고 물어보면요?"
        }
      },
      {
        "who": "me",
        "text": "Dimmi la verità: perché l'hai lasciato?",
        "gloss": {
          "en": "Tell me the truth: why did you leave it?",
          "ko": "솔직하게 말해 봐요. 왜 그만뒀어요?"
        },
        "frames": [
          "it-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Volevo imparare cose nuove.",
        "gloss": {
          "en": "I wanted to learn new things.",
          "ko": "새로운 걸 배우고 싶었어요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto, prova a dire proprio così!",
        "gloss": {
          "en": "Perfect, try saying exactly that!",
          "ko": "좋아요, 딱 그렇게 말해 봐요!"
        },
        "frames": [
          "it-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Grazie, mi sento meglio.",
        "gloss": {
          "en": "Thanks, I feel better.",
          "ko": "고마워요, 좀 나아졌어요."
        }
      },
      {
        "who": "me",
        "text": "Dai, in bocca al lupo! Dopo dimmi com'è andata.",
        "gloss": {
          "en": "Come on, good luck! Tell me how it went afterwards.",
          "ko": "자, 행운을 빌어요! 끝나고 어땠는지 말해 줘요."
        },
        "frames": [
          "it-f3-11"
        ]
      }
    ]
  },
  {
    "id": "it-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A wedding invitation",
      "ko": "결혼식 초대"
    },
    "expressions": [
      "sul serio",
      "non vedo l'ora",
      "magari"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ti devo dire una cosa: a giugno mi sposo!",
        "gloss": {
          "en": "I have to tell you something: I'm getting married in June!",
          "ko": "할 말이 있어요. 유월에 결혼해요!"
        }
      },
      {
        "who": "me",
        "text": "Sul serio? Che bella notizia!",
        "gloss": {
          "en": "Seriously? What great news!",
          "ko": "진짜요? 정말 좋은 소식이네요!"
        },
        "frames": [
          "it-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Sì! E naturalmente sei invitato.",
        "gloss": {
          "en": "Yes! And of course you're invited.",
          "ko": "네! 당연히 당신도 초대할게요."
        }
      },
      {
        "who": "me",
        "text": "Grazie! Non vedo l'ora di festeggiare con voi.",
        "gloss": {
          "en": "Thanks! I can't wait to celebrate with you.",
          "ko": "고마워요! 빨리 같이 축하하고 싶어요."
        },
        "frames": [
          "it-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Lo facciamo in campagna, in Toscana. Speriamo che non piova!",
        "gloss": {
          "en": "We're having it in the countryside, in Tuscany. Let's hope it doesn't rain!",
          "ko": "토스카나 시골에서 해요. 비만 안 오면 좋겠어요!"
        }
      },
      {
        "who": "me",
        "text": "Non credo che piova molto a giugno in Toscana.",
        "gloss": {
          "en": "I don't think it rains much in June in Tuscany.",
          "ko": "유월 토스카나엔 비가 별로 안 올 거예요."
        },
        "frames": [
          "it-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Speriamo! Ti mando l'invito per email.",
        "gloss": {
          "en": "Let's hope! I'll send you the invitation by email.",
          "ko": "그러길 바라요! 청첩장은 이메일로 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Perfetto. Magari vengo un giorno prima per aiutarvi!",
        "gloss": {
          "en": "Perfect. Maybe I'll come a day early to help you!",
          "ko": "좋아요. 하루 일찍 가서 도와줄 수도 있어요!"
        },
        "frames": [
          "it-f3-20"
        ]
      }
    ]
  }
];
