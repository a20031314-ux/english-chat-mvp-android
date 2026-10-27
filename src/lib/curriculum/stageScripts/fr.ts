import type { StageScript } from "../stageScripts.ts";

/** fr 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const FR: StageScript[] = [
  {
    "id": "fr-1-1",
    "name": {
      "text": [
        "Minho"
      ],
      "en": [
        "Minho"
      ],
      "ko": [
        "민호"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "A language exchange evening in a Paris café: meeting Claire for the first time",
      "ko": "파리 카페의 언어 교환 모임에서 클레르를 처음 만남"
    },
    "expressions": [
      "Bonsoir",
      "Je m'appelle",
      "Enchanté",
      "Je viens de Corée"
    ],
    "grammar": [
      0,
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir ! Je m'appelle Claire. Et vous ?",
        "gloss": {
          "en": "Good evening! My name is Claire. And you?",
          "ko": "안녕하세요! 저는 클레르예요. 그쪽은요?"
        }
      },
      {
        "who": "me",
        "text": "Bonsoir, Claire. Je m'appelle Minho. Enchanté.",
        "gloss": {
          "en": "Good evening, Claire. My name is Minho. Nice to meet you.",
          "ko": "안녕하세요, 클레르. 저는 민호예요. 반가워요."
        },
        "frames": [
          "fr-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Enchantée. Vous êtes d'où ?",
        "gloss": {
          "en": "Nice to meet you. Where are you from?",
          "ko": "반가워요. 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Je viens de Corée. J'habite à Séoul.",
        "gloss": {
          "en": "I'm from Korea. I live in Seoul.",
          "ko": "한국에서 왔어요. 서울에 살아요."
        },
        "frames": [
          "fr-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Ah, super ! Est-ce que vous parlez anglais ?",
        "gloss": {
          "en": "Oh, great! Do you speak English?",
          "ko": "아, 좋네요! 영어 하세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Mais je ne parle pas bien français.",
        "gloss": {
          "en": "Yes. But I don't speak French well.",
          "ko": "네. 그런데 프랑스어는 잘 못해요."
        },
        "frames": [
          "fr-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème, on est là pour ça ! Vous travaillez à Paris ?",
        "gloss": {
          "en": "No problem, that's what we're here for! Do you work in Paris?",
          "ko": "괜찮아요, 그러려고 모인 거잖아요! 파리에서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je suis ingénieur. Est-ce que vous êtes étudiante ?",
        "gloss": {
          "en": "Yes, I'm an engineer. Are you a student?",
          "ko": "네, 엔지니어예요. 학생이세요?"
        },
        "frames": [
          "fr-f1-03"
        ]
      }
    ]
  },
  {
    "id": "fr-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Morning at a neighbourhood bakery",
      "ko": "아침, 동네 빵집에서"
    },
    "expressions": [
      "Bonjour",
      "Je voudrais",
      "S'il vous plaît",
      "Combien ça coûte",
      "Merci beaucoup",
      "Bonne journée"
    ],
    "grammar": [
      1,
      2,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, monsieur ! Qu'est-ce que je vous sers ?",
        "gloss": {
          "en": "Hello, sir! What can I get you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Je voudrais une baguette, s'il vous plaît.",
        "gloss": {
          "en": "Hello. I'd like a baguette, please.",
          "ko": "안녕하세요. 바게트 하나 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Voilà. Et avec ceci ?",
        "gloss": {
          "en": "Here you are. Anything else?",
          "ko": "여기요. 더 필요하신 건요?"
        }
      },
      {
        "who": "me",
        "text": "Est-ce qu'il y a des croissants ?",
        "gloss": {
          "en": "Are there any croissants?",
          "ko": "크루아상 있어요?"
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oui, bien sûr. Il y a aussi des pains au chocolat.",
        "gloss": {
          "en": "Yes, of course. There are pains au chocolat too.",
          "ko": "네, 물론이죠. 팽 오 쇼콜라도 있어요."
        }
      },
      {
        "who": "me",
        "text": "Deux croissants, alors. Combien ça coûte ?",
        "gloss": {
          "en": "Two croissants, then. How much is it?",
          "ko": "그럼 크루아상 두 개요. 얼마예요?"
        }
      },
      {
        "who": "them",
        "text": "Ça fait trois euros quatre-vingts, s'il vous plaît.",
        "gloss": {
          "en": "That's three euros eighty, please.",
          "ko": "3유로 80센트입니다."
        }
      },
      {
        "who": "me",
        "text": "Voilà. Merci beaucoup. Bonne journée !",
        "gloss": {
          "en": "Here you go. Thank you very much. Have a nice day!",
          "ko": "여기요. 정말 고마워요. 좋은 하루 보내세요!"
        },
        "frames": [
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a station agent for directions in the Paris metro",
      "ko": "파리 지하철역에서 역무원에게 길 묻기"
    },
    "expressions": [
      "Excusez-moi",
      "S'il vous plaît",
      "Pardon",
      "Je ne comprends pas",
      "Vous pouvez répéter",
      "Plus lentement",
      "D'accord",
      "Merci beaucoup",
      "Au revoir"
    ],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oui ? Je peux vous aider ?",
        "gloss": {
          "en": "Yes? Can I help you?",
          "ko": "네? 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Excusez-moi, où est la ligne quatre, s'il vous plaît ?",
        "gloss": {
          "en": "Excuse me, where is line four, please?",
          "ko": "실례합니다, 4호선이 어디예요?"
        },
        "frames": [
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "La ligne quatre ? C'est en bas, à gauche, après les escaliers mécaniques.",
        "gloss": {
          "en": "Line four? It's downstairs, on the left, after the escalators.",
          "ko": "4호선요? 아래층 왼쪽, 에스컬레이터 지나서예요."
        }
      },
      {
        "who": "me",
        "text": "Pardon, je ne comprends pas. Vous pouvez répéter ?",
        "gloss": {
          "en": "Sorry, I don't understand. Can you repeat?",
          "ko": "죄송해요, 이해를 못 했어요. 다시 말씀해 주실래요?"
        },
        "frames": [
          "fr-f1-18",
          "fr-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr. En bas, à gauche.",
        "gloss": {
          "en": "Of course. Downstairs, on the left.",
          "ko": "그럼요. 아래층, 왼쪽이요."
        }
      },
      {
        "who": "me",
        "text": "Plus lentement, s'il vous plaît. Je ne parle pas bien français.",
        "gloss": {
          "en": "More slowly, please. I don't speak French well.",
          "ko": "좀 더 천천히요. 프랑스어를 잘 못해서요."
        },
        "frames": [
          "fr-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Pas de souci. Vous descendez, et c'est à gauche. D'accord ?",
        "gloss": {
          "en": "No worries. You go down, and it's on the left. Okay?",
          "ko": "괜찮아요. 내려가서 왼쪽이에요. 아시겠죠?"
        }
      },
      {
        "who": "me",
        "text": "D'accord, merci beaucoup. Au revoir !",
        "gloss": {
          "en": "Okay, thank you very much. Goodbye!",
          "ko": "알겠어요, 정말 고마워요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Running into Léa, a young neighbour, on the stairs",
      "ko": "계단에서 젊은 이웃 레아와 마주침"
    },
    "expressions": [
      "Salut",
      "Ça va",
      "De rien",
      "Bien sûr",
      "Au revoir"
    ],
    "grammar": [
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut, Minho ! Ça va ?",
        "gloss": {
          "en": "Hi, Minho! How are you?",
          "ko": "안녕, 민호! 잘 지내?"
        }
      },
      {
        "who": "me",
        "text": "Salut ! Ça va bien, merci. Et toi ?",
        "gloss": {
          "en": "Hi! I'm fine, thanks. And you?",
          "ko": "안녕! 잘 지내, 고마워. 너는?"
        },
        "frames": [
          "fr-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Merci pour le colis, hier !",
        "gloss": {
          "en": "Very well. Thanks for the parcel yesterday!",
          "ko": "아주 잘 지내. 어제 택배 고마워!"
        }
      },
      {
        "who": "me",
        "text": "De rien. Il y a un autre colis pour toi aujourd'hui.",
        "gloss": {
          "en": "You're welcome. There's another parcel for you today.",
          "ko": "천만에. 오늘 너한테 택배 또 왔어."
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Tu peux le garder jusqu'à ce soir ?",
        "gloss": {
          "en": "Really? Can you keep it until tonight?",
          "ko": "그래? 저녁까지 맡아 줄 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "Bien sûr. Je ne travaille pas aujourd'hui.",
        "gloss": {
          "en": "Of course. I'm not working today.",
          "ko": "물론이지. 나 오늘 일 안 해."
        }
      },
      {
        "who": "them",
        "text": "Super, merci ! Bon, j'y vais. Bonne journée !",
        "gloss": {
          "en": "Great, thanks! Well, I'm off. Have a nice day!",
          "ko": "좋아, 고마워! 그럼 나 갈게. 좋은 하루 보내!"
        }
      },
      {
        "who": "me",
        "text": "Merci, à toi aussi. Au revoir !",
        "gloss": {
          "en": "Thanks, you too. Bye!",
          "ko": "고마워, 너도. 잘 가!"
        }
      }
    ]
  },
  {
    "id": "fr-1-x1",
    "stage": 1,
    "setting": {
      "en": "Ordering a coffee at a café counter",
      "ko": "카페 카운터에서 커피 주문하기"
    },
    "expressions": [
      "Bonjour",
      "Je voudrais",
      "S'il vous plaît",
      "Excusez-moi",
      "Où sont les toilettes"
    ],
    "grammar": [
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, monsieur. Vous désirez ?",
        "gloss": {
          "en": "Hello, sir. What would you like?",
          "ko": "안녕하세요. 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Je voudrais un café, s'il vous plaît.",
        "gloss": {
          "en": "Hello. I'd like a coffee, please.",
          "ko": "안녕하세요. 커피 한 잔 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Un café, très bien. Autre chose ?",
        "gloss": {
          "en": "A coffee, very good. Anything else?",
          "ko": "커피 한 잔이요. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "Non, merci. Excusez-moi, où sont les toilettes ?",
        "gloss": {
          "en": "No, thank you. Excuse me, where is the toilet?",
          "ko": "아니요, 됐어요. 실례지만 화장실이 어디예요?"
        }
      },
      {
        "who": "them",
        "text": "Au fond, à droite.",
        "gloss": {
          "en": "At the back, on the right.",
          "ko": "안쪽 오른편이에요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Et le café, c'est combien ?",
        "gloss": {
          "en": "Thanks. And how much is the coffee?",
          "ko": "고마워요. 그리고 커피는 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "fr-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Texting turned into a call: planning Saturday with your friend Léa",
      "ko": "친구 레아와 통화하며 토요일 계획 세우기"
    },
    "expressions": [
      "Ça te dit",
      "Pas de problème",
      "À quelle heure",
      "On se retrouve où",
      "Ça marche",
      "Pas encore"
    ],
    "grammar": [
      1,
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Tu fais quoi ce week-end ?",
        "gloss": {
          "en": "Hi! What are you doing this weekend?",
          "ko": "안녕! 이번 주말에 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Samedi, je vais visiter le musée d'Orsay. Ça te dit ?",
        "gloss": {
          "en": "On Saturday I'm going to visit the Musée d'Orsay. Do you fancy it?",
          "ko": "토요일에 오르세 미술관 갈 거야. 같이 갈래?"
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh, avec plaisir ! Mais samedi matin, je travaille.",
        "gloss": {
          "en": "Oh, I'd love to! But on Saturday morning I'm working.",
          "ko": "오, 좋지! 근데 토요일 아침엔 일해."
        }
      },
      {
        "who": "me",
        "text": "Pas de problème. On peut y aller l'après-midi.",
        "gloss": {
          "en": "No problem. We can go in the afternoon.",
          "ko": "괜찮아. 오후에 가면 되지."
        },
        "frames": [
          "fr-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Bonne idée ! Je suis libre après midi.",
        "gloss": {
          "en": "Good idea! I'm free after noon.",
          "ko": "좋은 생각이야! 정오 이후엔 시간 돼."
        }
      },
      {
        "who": "me",
        "text": "D'accord. À quelle heure, alors ? Et on se retrouve où ?",
        "gloss": {
          "en": "Okay. What time, then? And where shall we meet?",
          "ko": "알았어. 그럼 몇 시에? 그리고 어디서 만나?"
        },
        "frames": [
          "fr-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Deux heures, devant l'entrée du musée. Ça marche ?",
        "gloss": {
          "en": "Two o'clock, in front of the museum entrance. Does that work?",
          "ko": "두 시, 미술관 입구 앞. 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "Ça marche ! Je vais réserver les billets ce soir.",
        "gloss": {
          "en": "That works! I'm going to book the tickets tonight.",
          "ko": "좋아! 오늘 밤에 표 예매할게."
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Génial. Tu es déjà allé à Orsay ?",
        "gloss": {
          "en": "Great. Have you been to Orsay before?",
          "ko": "최고야. 오르세 가 본 적 있어?"
        }
      },
      {
        "who": "me",
        "text": "Non, pas encore. Je suis arrivé à Paris en septembre.",
        "gloss": {
          "en": "No, not yet. I arrived in Paris in September.",
          "ko": "아니, 아직. 9월에 파리에 왔거든."
        }
      }
    ]
  },
  {
    "id": "fr-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "A sunny afternoon on a café terrace, ordering from the waiter",
      "ko": "햇살 좋은 오후, 카페 테라스에서 종업원에게 주문하기"
    },
    "expressions": [
      "Pas encore",
      "Qu'est-ce que vous conseillez",
      "Je n'aime pas trop",
      "Je peux prendre une photo",
      "J'adore ça",
      "J'ai déjà fini",
      "L'addition"
    ],
    "grammar": [
      0,
      2,
      3
    ],
    "earlierGrammar": [
      "1:3",
      "1:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Vous avez choisi ?",
        "gloss": {
          "en": "Hello! Have you decided?",
          "ko": "안녕하세요! 고르셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Pas encore. Qu'est-ce que vous conseillez ?",
        "gloss": {
          "en": "Not yet. What do you recommend?",
          "ko": "아직요. 뭘 추천하세요?"
        },
        "frames": [
          "fr-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "La tarte au citron est délicieuse, et le chocolat chaud aussi.",
        "gloss": {
          "en": "The lemon tart is delicious, and so is the hot chocolate.",
          "ko": "레몬 타르트가 맛있고, 핫초코도 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, je n'aime pas trop le chocolat. Je vais prendre la tarte et un thé.",
        "gloss": {
          "en": "Hmm, I'm not a big fan of chocolate. I'll have the tart and a tea.",
          "ko": "음, 초콜릿은 별로 안 좋아해요. 타르트랑 차로 할게요."
        },
        "frames": [
          "fr-f2-17",
          "fr-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Je vous apporte ça tout de suite.",
        "gloss": {
          "en": "Very good. I'll bring that right away.",
          "ko": "알겠습니다. 바로 가져다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Excusez-moi, je peux prendre une photo de la terrasse ?",
        "gloss": {
          "en": "Excuse me, can I take a photo of the terrace?",
          "ko": "실례지만, 테라스 사진 찍어도 돼요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr ! Alors, cette tarte ?",
        "gloss": {
          "en": "Of course! So, how's that tart?",
          "ko": "물론이죠! 그래서, 타르트는 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "Elle est excellente. J'adore ça !",
        "gloss": {
          "en": "It's excellent. I love it!",
          "ko": "정말 맛있어요. 이거 너무 좋아요!"
        }
      },
      {
        "who": "them",
        "text": "Ça me fait plaisir ! Autre chose ?",
        "gloss": {
          "en": "I'm glad! Anything else?",
          "ko": "다행이네요! 더 필요하신 건요?"
        }
      },
      {
        "who": "me",
        "text": "Non, merci. J'ai déjà fini. L'addition, s'il vous plaît.",
        "gloss": {
          "en": "No, thank you. I've already finished. The bill, please.",
          "ko": "아니요, 됐어요. 다 먹었어요. 계산서 주세요."
        },
        "frames": [
          "fr-f2-01"
        ]
      }
    ]
  },
  {
    "id": "fr-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "At a pharmacy with a cold, explaining your symptoms",
      "ko": "감기에 걸려 약국에서 증상 설명하기"
    },
    "expressions": [
      "J'ai mal à la tête",
      "Un peu"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, monsieur. Qu'est-ce qui ne va pas ?",
        "gloss": {
          "en": "Hello, sir. What's wrong?",
          "ko": "안녕하세요. 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. J'ai mal à la tête et j'ai mal à la gorge.",
        "gloss": {
          "en": "Hello. I have a headache and a sore throat.",
          "ko": "안녕하세요. 머리가 아프고 목도 아파요."
        },
        "frames": [
          "fr-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Depuis quand ?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Depuis hier. Je suis sorti sans manteau, et il a plu toute la journée.",
        "gloss": {
          "en": "Since yesterday. I went out without a coat, and it rained all day.",
          "ko": "어제부터요. 외투 없이 나갔는데 하루 종일 비가 왔어요."
        }
      },
      {
        "who": "them",
        "text": "Vous avez de la fièvre ?",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열이 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Un peu, oui. Et je me réveille souvent la nuit parce que je tousse.",
        "gloss": {
          "en": "A little, yes. And I often wake up at night because I'm coughing.",
          "ko": "조금요. 그리고 기침 때문에 밤에 자주 깨요."
        },
        "frames": [
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Je vous donne ce sirop. Vous le prenez trois fois par jour.",
        "gloss": {
          "en": "Okay. I'll give you this syrup. You take it three times a day.",
          "ko": "알겠어요. 이 시럽 드릴게요. 하루 세 번 드세요."
        }
      },
      {
        "who": "me",
        "text": "Je le prends avant ou après les repas ?",
        "gloss": {
          "en": "Do I take it before or after meals?",
          "ko": "식전에 먹어요, 식후에 먹어요?"
        },
        "frames": [
          "fr-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Après les repas. Et reposez-vous bien !",
        "gloss": {
          "en": "After meals. And get plenty of rest!",
          "ko": "식후에요. 그리고 푹 쉬세요!"
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Je vais rester au lit ce soir.",
        "gloss": {
          "en": "Thank you very much. I'm going to stay in bed tonight.",
          "ko": "정말 감사합니다. 오늘 저녁엔 누워 있을게요."
        },
        "frames": [
          "fr-f2-03"
        ]
      }
    ]
  },
  {
    "id": "fr-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "End of the day at the office: going over tomorrow with your coworker Sarah",
      "ko": "퇴근 무렵 사무실에서 동료 사라와 내일 일정 확인하기"
    },
    "expressions": [
      "Pas de problème",
      "J'ai déjà fini",
      "Quel dommage",
      "À demain",
      "Bon courage"
    ],
    "grammar": [
      0,
      2,
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Dis, tu as vu le planning de demain ?",
        "gloss": {
          "en": "Hey, have you seen tomorrow's schedule?",
          "ko": "있잖아, 내일 일정표 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je l'ai vu ce matin. On a une réunion à neuf heures.",
        "gloss": {
          "en": "Yes, I saw it this morning. We have a meeting at nine.",
          "ko": "응, 아침에 봤어. 아홉 시에 회의 있어."
        }
      },
      {
        "who": "them",
        "text": "À neuf heures ? Aïe, je dépose ma fille à l'école à huit heures et demie.",
        "gloss": {
          "en": "At nine? Ouch, I drop my daughter at school at half past eight.",
          "ko": "아홉 시? 아이고, 여덟 시 반에 딸을 학교에 데려다주는데."
        }
      },
      {
        "who": "me",
        "text": "Pas de problème. Tu peux arriver un peu en retard.",
        "gloss": {
          "en": "No problem. You can come in a bit late.",
          "ko": "괜찮아. 조금 늦게 와도 돼."
        },
        "frames": [
          "fr-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Merci. Et le rapport pour le client, tu l'as terminé ?",
        "gloss": {
          "en": "Thanks. And the report for the client, have you finished it?",
          "ko": "고마워. 그리고 고객 보고서는 다 했어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'ai déjà fini. Je vais l'envoyer ce soir.",
        "gloss": {
          "en": "Yes, I've already finished. I'm going to send it tonight.",
          "ko": "응, 벌써 끝냈어. 오늘 저녁에 보낼 거야."
        },
        "frames": [
          "fr-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Super. Moi, je ne peux pas venir l'après-midi, j'ai rendez-vous chez le dentiste.",
        "gloss": {
          "en": "Great. I can't come in the afternoon, I have a dentist appointment.",
          "ko": "좋아. 난 오후엔 못 와, 치과 예약이 있어."
        }
      },
      {
        "who": "me",
        "text": "Quel dommage ! Bon, on va déjeuner ensemble jeudi, alors ?",
        "gloss": {
          "en": "What a shame! Well, shall we have lunch together on Thursday, then?",
          "ko": "아쉽다! 그럼 목요일에 같이 점심 먹을까?"
        }
      },
      {
        "who": "them",
        "text": "Oui, jeudi, parfait. Bon, je file. À demain !",
        "gloss": {
          "en": "Yes, Thursday, perfect. Right, I'm off. See you tomorrow!",
          "ko": "응, 목요일 좋아. 그럼 나 먼저 갈게. 내일 봐!"
        }
      },
      {
        "who": "me",
        "text": "À demain ! Et bon courage pour le dentiste !",
        "gloss": {
          "en": "See you tomorrow! And good luck at the dentist!",
          "ko": "내일 봐! 치과 힘내!"
        }
      }
    ]
  },
  {
    "id": "fr-2-x1",
    "stage": 2,
    "setting": {
      "en": "Arriving late to meet a friend at the market",
      "ko": "시장에서 친구를 만나기로 했는데 늦게 도착함"
    },
    "expressions": [
      "Je suis désolé",
      "Je me suis perdu",
      "Avec plaisir",
      "Bonne idée"
    ],
    "grammar": [
      1,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ah, te voilà ! Ça va ?",
        "gloss": {
          "en": "Ah, there you are! All good?",
          "ko": "아, 왔구나! 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "Je suis désolé ! Je me suis perdu dans le métro.",
        "gloss": {
          "en": "I'm sorry! I got lost in the metro.",
          "ko": "미안해! 지하철에서 길을 잃었어."
        },
        "frames": [
          "fr-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "C'est pas grave. Tu veux un café ?",
        "gloss": {
          "en": "No big deal. Do you want a coffee?",
          "ko": "괜찮아. 커피 마실래?"
        }
      },
      {
        "who": "me",
        "text": "Avec plaisir ! Je me suis levé très tôt ce matin.",
        "gloss": {
          "en": "I'd love one! I got up really early this morning.",
          "ko": "좋지! 오늘 아침에 엄청 일찍 일어났거든."
        },
        "frames": [
          "fr-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "On fait le tour du marché après ? Il y a des fruits super.",
        "gloss": {
          "en": "Shall we go round the market afterwards? There's great fruit.",
          "ko": "그다음에 시장 한 바퀴 돌까? 과일이 정말 좋아."
        }
      },
      {
        "who": "me",
        "text": "Bonne idée ! On y va à pied ?",
        "gloss": {
          "en": "Good idea! Shall we walk?",
          "ko": "좋은 생각이야! 걸어갈까?"
        }
      }
    ]
  },
  {
    "id": "fr-2-x2",
    "stage": 2,
    "setting": {
      "en": "Friday evening at the office, saying goodbye to a coworker",
      "ko": "금요일 저녁 사무실에서 동료와 인사하기"
    },
    "expressions": [
      "Bon week-end"
    ],
    "grammar": [
      2,
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bon, j'ai fini pour aujourd'hui. Tu pars quand ?",
        "gloss": {
          "en": "Right, I'm done for today. When are you leaving?",
          "ko": "자, 오늘은 끝. 넌 언제 가?"
        }
      },
      {
        "who": "me",
        "text": "Vers six heures. Je veux finir ce dossier avant.",
        "gloss": {
          "en": "Around six. I want to finish this file first.",
          "ko": "여섯 시쯤. 그 전에 이 서류 끝내고 싶어."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Tu fais quoi ce week-end ?",
        "gloss": {
          "en": "What are you doing this weekend?",
          "ko": "이번 주말에 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "On va à la mer avec des amis. Je vais me reposer !",
        "gloss": {
          "en": "We're going to the seaside with friends. I'm going to rest!",
          "ko": "친구들이랑 바다에 가. 푹 쉴 거야!"
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Génial ! Bon week-end, alors !",
        "gloss": {
          "en": "Great! Have a good weekend, then!",
          "ko": "좋겠다! 그럼 주말 잘 보내!"
        }
      },
      {
        "who": "me",
        "text": "Merci, bon week-end à toi aussi !",
        "gloss": {
          "en": "Thanks, have a good weekend too!",
          "ko": "고마워, 너도 주말 잘 보내!"
        }
      }
    ]
  },
  {
    "id": "fr-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Meeting your friend Julien at the cinema, twenty minutes late",
      "ko": "영화관에서 친구 쥘리앵을 만나기로 했는데 20분 늦음"
    },
    "expressions": [
      "Désolé du retard",
      "Tu as raison",
      "En fait",
      "Du coup",
      "Je pense que"
    ],
    "grammar": [
      0,
      1,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "2:4",
      "2:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ah, enfin ! Ça fait vingt minutes que je t'attends.",
        "gloss": {
          "en": "Ah, finally! I've been waiting for you for twenty minutes.",
          "ko": "아, 드디어! 20분이나 기다렸어."
        },
        "alt": [
          {
            "text": "Te voilà ! Je commençais à m'inquiéter.",
            "gloss": {
              "en": "There you are! I was starting to worry.",
              "ko": "왔구나! 걱정하기 시작했잖아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Désolé du retard ! Le métro s'est arrêté entre deux stations.",
        "gloss": {
          "en": "Sorry I'm late! The metro stopped between two stations.",
          "ko": "늦어서 미안! 지하철이 역 사이에서 멈췄어."
        },
        "frames": [
          "fr-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Encore ? Qu'est-ce qui s'est passé ?",
        "gloss": {
          "en": "Again? What happened?",
          "ko": "또? 무슨 일이었는데?"
        },
        "alt": [
          {
            "text": "Sérieux ? Pourquoi ?",
            "gloss": {
              "en": "Seriously? Why?",
              "ko": "진짜? 왜?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Je lisais tranquillement quand le train s'est arrêté d'un coup. On est restés bloqués un quart d'heure.",
        "gloss": {
          "en": "I was quietly reading when the train suddenly stopped. We were stuck for a quarter of an hour.",
          "ko": "조용히 책 읽고 있는데 열차가 갑자기 섰어. 15분 동안 갇혀 있었어."
        },
        "frames": [
          "fr-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Tu aurais pu m'envoyer un message, quand même.",
        "gloss": {
          "en": "You could have sent me a message, though.",
          "ko": "그래도 문자라도 보내지."
        }
      },
      {
        "who": "me",
        "text": "Tu as raison. En fait, j'avais plus de batterie.",
        "gloss": {
          "en": "You're right. Actually, my battery was dead.",
          "ko": "네 말이 맞아. 사실 배터리가 다 됐었어."
        },
        "frames": [
          "fr-f3-13",
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Bon, c'est pas grave. Mais on a raté le début du film.",
        "gloss": {
          "en": "Well, it's no big deal. But we've missed the start of the film.",
          "ko": "뭐, 괜찮아. 근데 영화 앞부분 놓쳤어."
        },
        "alt": [
          {
            "text": "Laisse, c'est rien. Mais la séance a déjà commencé.",
            "gloss": {
              "en": "Forget it, it's nothing. But the screening has already started.",
              "ko": "됐어, 별거 아니야. 근데 상영이 벌써 시작했어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ah, mince. Du coup, on fait quoi ? On y va quand même ?",
        "gloss": {
          "en": "Oh, shoot. So what do we do? Do we go in anyway?",
          "ko": "아, 이런. 그럼 어떡해? 그래도 들어갈까?"
        },
        "frames": [
          "fr-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Il y a une autre séance à neuf heures, ce soir.",
        "gloss": {
          "en": "There's another screening at nine tonight.",
          "ko": "오늘 밤 아홉 시에 한 회 더 있어."
        }
      },
      {
        "who": "me",
        "text": "Je pense que c'est mieux. Je t'invite à boire un verre en attendant.",
        "gloss": {
          "en": "I think that's better. I'll buy you a drink while we wait.",
          "ko": "그게 낫겠다. 기다리는 동안 내가 한잔 살게."
        },
        "frames": [
          "fr-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Ça marche. Et la prochaine fois, tu partiras plus tôt ?",
        "gloss": {
          "en": "Deal. And next time, will you leave earlier?",
          "ko": "좋아. 다음번엔 일찍 출발할 거지?"
        }
      },
      {
        "who": "me",
        "text": "Promis, la prochaine fois, je partirai dix minutes plus tôt !",
        "gloss": {
          "en": "Promise, next time I'll leave ten minutes earlier!",
          "ko": "약속해, 다음엔 10분 일찍 나올게!"
        },
        "frames": [
          "fr-f3-08"
        ]
      }
    ]
  },
  {
    "id": "fr-3-2",
    "name": {
      "text": [
        "Minho"
      ],
      "en": [
        "Minho"
      ],
      "ko": [
        "민호"
      ]
    },
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling the host of your rented flat in Paris about a problem",
      "ko": "파리에서 빌린 집 주인에게 문제를 알리려고 전화하기"
    },
    "expressions": [
      "Il y a un souci",
      "Ça ne marche pas",
      "Peut-être",
      "Ça arrive"
    ],
    "grammar": [
      0,
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "1:5",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allô, oui ?",
        "gloss": {
          "en": "Hello?",
          "ko": "여보세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour, c'est Minho, de l'appartement rue Lepic. Il y a un souci avec le chauffe-eau.",
        "gloss": {
          "en": "Hello, it's Minho, from the flat on rue Lepic. There's a problem with the water heater.",
          "ko": "안녕하세요, 르픽 거리 집에 묵는 민호예요. 온수기에 문제가 있어요."
        },
        "frames": [
          "fr-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Qu'est-ce qui se passe exactement ?",
        "gloss": {
          "en": "Really? What's happening exactly?",
          "ko": "그래요? 정확히 어떤 문제예요?"
        },
        "alt": [
          {
            "text": "Ah mince. C'est-à-dire ?",
            "gloss": {
              "en": "Oh no. Meaning what?",
              "ko": "아 이런. 어떤 거요?"
            }
          },
          {
            "text": "Quel genre de souci ?",
            "gloss": {
              "en": "What kind of problem?",
              "ko": "어떤 문제요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ça ne marche pas. Ce matin, l'eau était froide quand j'ai pris ma douche.",
        "gloss": {
          "en": "It doesn't work. This morning the water was cold when I took my shower.",
          "ko": "작동을 안 해요. 오늘 아침 샤워할 때 물이 차가웠어요."
        },
        "frames": [
          "fr-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Vous avez vérifié le petit bouton rouge, en bas ?",
        "gloss": {
          "en": "Did you check the little red button at the bottom?",
          "ko": "아래쪽 작은 빨간 버튼 확인해 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Le bouton que vous m'avez montré hier ? Oui, mais rien ne se passe.",
        "gloss": {
          "en": "The button you showed me yesterday? Yes, but nothing happens.",
          "ko": "어제 보여 주신 그 버튼요? 네, 그런데 아무 반응이 없어요."
        }
      },
      {
        "who": "them",
        "text": "D'accord. Je connais un plombier qui habite à côté.",
        "gloss": {
          "en": "Okay. I know a plumber who lives nearby.",
          "ko": "알겠어요. 근처에 사는 배관공을 알아요."
        },
        "alt": [
          {
            "text": "Bon, j'appelle quelqu'un.",
            "gloss": {
              "en": "Okay, I'll call someone.",
              "ko": "알았어요, 사람을 부를게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Est-ce qu'il pourrait passer aujourd'hui ? On sort vers midi.",
        "gloss": {
          "en": "Could he come by today? We're going out around noon.",
          "ko": "오늘 와 주실 수 있을까요? 저희가 정오쯤 나가거든요."
        },
        "frames": [
          "fr-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Je vais l'appeler. Il passera sûrement cet après-midi.",
        "gloss": {
          "en": "I'll call him. He'll probably come by this afternoon.",
          "ko": "전화해 볼게요. 아마 오늘 오후에 들를 거예요."
        }
      },
      {
        "who": "me",
        "text": "Parfait. Vous pourriez me prévenir par message ? Je serai peut-être au musée.",
        "gloss": {
          "en": "Perfect. Could you let me know by text? I might be at the museum.",
          "ko": "좋아요. 문자로 알려 주실 수 있을까요? 제가 미술관에 있을 수도 있어서요."
        },
        "frames": [
          "fr-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr. Je suis vraiment désolée pour le dérangement.",
        "gloss": {
          "en": "Of course. I'm really sorry for the trouble.",
          "ko": "물론이죠. 불편을 드려 정말 죄송해요."
        }
      },
      {
        "who": "me",
        "text": "Pas de problème, ça arrive. Merci pour votre aide !",
        "gloss": {
          "en": "No problem, these things happen. Thanks for your help!",
          "ko": "괜찮아요, 그럴 수도 있죠. 도와주셔서 고마워요!"
        }
      }
    ]
  },
  {
    "id": "fr-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Chatting with your friend Inès about a series you both watch",
      "ko": "친구 이네스와 같이 보는 드라마 이야기"
    },
    "expressions": [
      "C'était génial",
      "Franchement",
      "Aucune idée",
      "Ça dépend",
      "À mon avis",
      "J'ai hâte"
    ],
    "grammar": [
      2,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "2:5",
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as vu le dernier épisode de la série ?",
        "gloss": {
          "en": "Have you seen the last episode of the series?",
          "ko": "그 드라마 마지막 화 봤어?"
        },
        "alt": [
          {
            "text": "Alors, t'en es où dans la série ?",
            "gloss": {
              "en": "So, where are you up to in the series?",
              "ko": "그래서, 그 드라마 어디까지 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Oui, je l'ai regardé hier soir. C'était génial !",
        "gloss": {
          "en": "Yes, I watched it last night. It was great!",
          "ko": "응, 어젯밤에 봤어. 진짜 최고였어!"
        }
      },
      {
        "who": "them",
        "text": "Et la fin ? Moi, je l'ai pas du tout vue venir !",
        "gloss": {
          "en": "And the ending? I didn't see it coming at all!",
          "ko": "결말은? 난 전혀 예상 못 했어!"
        }
      },
      {
        "who": "me",
        "text": "Franchement, moi non plus. Le personnage qui meurt, c'était mon préféré.",
        "gloss": {
          "en": "Honestly, me neither. The character who dies was my favourite.",
          "ko": "솔직히 나도. 죽는 그 인물이 내 최애였는데."
        }
      },
      {
        "who": "them",
        "text": "Tu crois qu'il va revenir dans la saison deux ?",
        "gloss": {
          "en": "Do you think he'll come back in season two?",
          "ko": "시즌 2에서 다시 나올 것 같아?"
        },
        "alt": [
          {
            "text": "À ton avis, il est vraiment mort ?",
            "gloss": {
              "en": "Do you think he's really dead?",
              "ko": "네 생각엔 진짜 죽은 거야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Aucune idée. Ça dépend des scénaristes, je suppose.",
        "gloss": {
          "en": "No idea. It depends on the writers, I suppose.",
          "ko": "전혀 모르겠어. 작가들한테 달렸겠지."
        }
      },
      {
        "who": "them",
        "text": "Moi, je trouve que la série était meilleure au début.",
        "gloss": {
          "en": "I think the series was better at the beginning.",
          "ko": "난 초반이 더 좋았던 것 같아."
        }
      },
      {
        "who": "me",
        "text": "À mon avis, la deuxième partie était plus intéressante. Je trouve que les acteurs sont meilleurs.",
        "gloss": {
          "en": "In my opinion, the second half was more interesting. I think the actors are better.",
          "ko": "내 생각엔 후반부가 더 재밌었어. 배우들 연기가 더 나은 것 같아."
        },
        "frames": [
          "fr-f3-03",
          "fr-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Ouais, peut-être. Tu sais quand sort la suite ?",
        "gloss": {
          "en": "Yeah, maybe. Do you know when the next one comes out?",
          "ko": "응, 그럴지도. 다음 시즌 언제 나오는지 알아?"
        },
        "alt": [
          {
            "text": "La saison deux, c'est pour quand ?",
            "gloss": {
              "en": "When is season two coming?",
              "ko": "시즌 2는 언제야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Je sais pas exactement. Je crois qu'elle sortira en mars.",
        "gloss": {
          "en": "I don't know exactly. I think it'll come out in March.",
          "ko": "정확히는 몰라. 3월에 나올 것 같아."
        },
        "frames": [
          "fr-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Trop long ! Bon, on la regarde ensemble, la prochaine fois ?",
        "gloss": {
          "en": "Too long! Well, shall we watch it together next time?",
          "ko": "너무 오래 걸린다! 다음엔 같이 볼까?"
        }
      },
      {
        "who": "me",
        "text": "Carrément. J'ai hâte !",
        "gloss": {
          "en": "Absolutely. I can't wait!",
          "ko": "완전 좋아. 너무 기대돼!"
        }
      }
    ]
  },
  {
    "id": "fr-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "At the office, asking your coworker Karim for help with a spreadsheet",
      "ko": "사무실에서 동료 카림에게 스프레드시트 도움 청하기"
    },
    "expressions": [
      "Tu peux m'aider",
      "Je ne suis pas sûr",
      "Laisse tomber"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "2:3",
      "2:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ça va ? T'as l'air stressé.",
        "gloss": {
          "en": "You okay? You look stressed.",
          "ko": "괜찮아? 스트레스 받은 얼굴인데."
        },
        "alt": [
          {
            "text": "Qu'est-ce qui t'arrive ? T'as une drôle de tête.",
            "gloss": {
              "en": "What's up with you? You look funny.",
              "ko": "무슨 일 있어? 표정이 이상해."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Bof. Tu peux m'aider avec ce fichier ? J'y comprends rien.",
        "gloss": {
          "en": "Meh. Can you help me with this file? I don't get it at all.",
          "ko": "그냥. 이 파일 좀 도와줄 수 있어? 하나도 모르겠어."
        }
      },
      {
        "who": "them",
        "text": "Bien sûr. C'est quoi, le problème ?",
        "gloss": {
          "en": "Sure. What's the problem?",
          "ko": "물론이지. 뭐가 문제야?"
        }
      },
      {
        "who": "me",
        "text": "Les chiffres que Paul m'a envoyés ne s'affichent pas.",
        "gloss": {
          "en": "The figures Paul sent me don't show up.",
          "ko": "폴이 보내 준 숫자들이 안 보여."
        }
      },
      {
        "who": "them",
        "text": "Fais voir. Ah, je vois : il y a des cellules vides.",
        "gloss": {
          "en": "Let me see. Ah, I see: there are empty cells.",
          "ko": "보여 줘. 아, 알겠다. 빈 칸이 있네."
        },
        "alt": [
          {
            "text": "Montre-moi. Ah, il manque des données.",
            "gloss": {
              "en": "Show me. Ah, some data is missing.",
              "ko": "보여 줘. 아, 데이터가 빠졌네."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Des cellules vides ? Il y en a beaucoup ?",
        "gloss": {
          "en": "Empty cells? Are there many?",
          "ko": "빈 칸? 많아?"
        }
      },
      {
        "who": "them",
        "text": "Une vingtaine. Il faut les remplir ou les supprimer.",
        "gloss": {
          "en": "About twenty. You need to fill them in or delete them.",
          "ko": "스무 개쯤. 채우거나 지워야 해."
        }
      },
      {
        "who": "me",
        "text": "Je ne suis pas sûr de comprendre. Tu pourrais me montrer comment faire ?",
        "gloss": {
          "en": "I'm not sure I understand. Could you show me how to do it?",
          "ko": "이해한 건지 잘 모르겠어. 어떻게 하는지 보여 줄 수 있어?"
        },
        "frames": [
          "fr-f3-11",
          "fr-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Regarde : tu sélectionnes ici, et tu cliques sur « filtrer ».",
        "gloss": {
          "en": "Look: you select here, and you click on 'filter'.",
          "ko": "봐, 여기를 선택하고 '필터'를 누르면 돼."
        }
      },
      {
        "who": "me",
        "text": "Ah, d'accord ! Je pensais que c'était beaucoup plus compliqué.",
        "gloss": {
          "en": "Oh, okay! I thought it was much more complicated.",
          "ko": "아, 그렇구나! 훨씬 복잡한 줄 알았어."
        }
      },
      {
        "who": "them",
        "text": "Je t'aide à finir ?",
        "gloss": {
          "en": "Shall I help you finish?",
          "ko": "끝까지 도와줄까?"
        },
        "alt": [
          {
            "text": "Tu veux que je regarde le reste avec toi ?",
            "gloss": {
              "en": "Do you want me to go through the rest with you?",
              "ko": "나머지도 같이 봐 줄까?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Non, laisse tomber, je vais me débrouiller. Je t'offrirai un café demain !",
        "gloss": {
          "en": "No, never mind, I'll manage. I'll buy you a coffee tomorrow!",
          "ko": "아니, 됐어, 내가 해 볼게. 내일 커피 살게!"
        }
      }
    ]
  },
  {
    "id": "fr-3-x1",
    "stage": 3,
    "setting": {
      "en": "At a friend's party, talking with Sophie's friend Hugo",
      "ko": "친구 파티에서 소피의 친구 위고와 이야기하기"
    },
    "expressions": [
      "On peut se tutoyer",
      "Qu'est-ce qui s'est passé",
      "Ça m'est égal"
    ],
    "grammar": [
      0,
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Vous êtes l'ami de Sophie, c'est ça ?",
        "gloss": {
          "en": "You're Sophie's friend, right?",
          "ko": "소피 친구분이시죠?"
        }
      },
      {
        "who": "me",
        "text": "Oui, c'est ça. On peut se tutoyer, non ?",
        "gloss": {
          "en": "Yes, that's right. We can say 'tu' to each other, can't we?",
          "ko": "네, 맞아요. 우리 말 편하게 해도 되죠?"
        }
      },
      {
        "who": "them",
        "text": "Oui, bien sûr ! Oh là là, regarde Sophie, elle pleure !",
        "gloss": {
          "en": "Yes, of course! Oh dear, look at Sophie, she's crying!",
          "ko": "응, 물론이지! 어머, 소피 봐, 울고 있어!"
        }
      },
      {
        "who": "me",
        "text": "Qu'est-ce qui s'est passé ? Elle allait bien tout à l'heure.",
        "gloss": {
          "en": "What happened? She was fine a minute ago.",
          "ko": "무슨 일이야? 아까는 괜찮았는데."
        }
      },
      {
        "who": "them",
        "text": "Rien de grave, elle rit, en fait ! Bon, tu veux du vin ou de la bière ?",
        "gloss": {
          "en": "Nothing serious, she's laughing, actually! So, do you want wine or beer?",
          "ko": "별일 아니야, 사실 웃는 거야! 그건 그렇고, 와인 마실래 맥주 마실래?"
        }
      },
      {
        "who": "me",
        "text": "Ça m'est égal. Je prendrai ce que tu prends.",
        "gloss": {
          "en": "I don't mind. I'll have what you're having.",
          "ko": "아무거나 괜찮아. 네가 마시는 걸로 할게."
        }
      },
      {
        "who": "them",
        "text": "Alors, du vin. T'en veux un grand verre ?",
        "gloss": {
          "en": "Wine, then. Do you want a big glass?",
          "ko": "그럼 와인. 큰 잔으로 줄까?"
        }
      },
      {
        "who": "me",
        "text": "Un petit, s'il te plaît. J'en ai déjà bu un au dîner.",
        "gloss": {
          "en": "A small one, please. I already had one at dinner.",
          "ko": "작은 잔으로 줘. 저녁 먹으면서 벌써 한 잔 마셨어."
        },
        "frames": [
          "fr-f3-14"
        ]
      }
    ]
  },
  {
    "id": "fr-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "A team meeting with your manager Nathalie about a slipping project deadline",
      "ko": "팀장 나탈리와 밀리는 프로젝트 마감에 관한 팀 회의"
    },
    "expressions": [
      "Dans l'ensemble",
      "Cela dit",
      "Il faudrait",
      "Autrement dit",
      "En revanche",
      "Je n'y avais pas pensé",
      "Ça vaut le coup",
      "Ce qui compte",
      "Comme convenu",
      "Je vous tiens au courant"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "3:4",
      "3:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bon, on commence. Où en est le projet Dumont ?",
        "gloss": {
          "en": "Right, let's start. Where are we with the Dumont project?",
          "ko": "자, 시작하죠. 뒤몽 프로젝트는 어디까지 왔어요?"
        },
        "alt": [
          {
            "text": "Alors, le projet Dumont, ça avance ?",
            "gloss": {
              "en": "So, is the Dumont project moving along?",
              "ko": "그래서, 뒤몽 프로젝트는 잘 되고 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Dans l'ensemble, ça avance bien. Cela dit, on a pris un peu de retard sur les tests.",
        "gloss": {
          "en": "On the whole, it's going well. That said, we've fallen a bit behind on testing.",
          "ko": "전반적으로 잘 진행되고 있어요. 다만 테스트가 조금 늦어졌어요."
        }
      },
      {
        "who": "them",
        "text": "Du retard ? Le client attend la livraison pour le quinze.",
        "gloss": {
          "en": "Behind? The client expects delivery on the fifteenth.",
          "ko": "늦어졌다고요? 고객은 15일 납품을 기다리고 있어요."
        }
      },
      {
        "who": "me",
        "text": "Je sais. Quand on a reçu leurs maquettes, on avait déjà commencé le développement.",
        "gloss": {
          "en": "I know. When we received their mock-ups, we had already started development.",
          "ko": "알아요. 그쪽 시안을 받았을 때 저희는 이미 개발을 시작한 상태였어요."
        }
      },
      {
        "who": "them",
        "text": "Je vois. Qu'est-ce que vous proposez ?",
        "gloss": {
          "en": "I see. What do you suggest?",
          "ko": "그렇군요. 어떻게 하자는 거예요?"
        },
        "alt": [
          {
            "text": "Et donc, quelle est la solution ?",
            "gloss": {
              "en": "So what's the solution?",
              "ko": "그래서 해결책은요?"
            }
          },
          {
            "text": "Vous avez une solution ?",
            "gloss": {
              "en": "Do you have a solution?",
              "ko": "해결책이 있어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Il faudrait qu'on puisse décaler la livraison d'une semaine. Autrement dit, au vingt-deux.",
        "gloss": {
          "en": "We'd need to be able to push delivery back a week. In other words, to the twenty-second.",
          "ko": "납품을 일주일 미룰 수 있어야 해요. 말하자면 22일로요."
        }
      },
      {
        "who": "them",
        "text": "Une semaine ? Je doute que le client soit ravi.",
        "gloss": {
          "en": "A week? I doubt the client will be thrilled.",
          "ko": "일주일요? 고객이 좋아할지 모르겠네요."
        }
      },
      {
        "who": "me",
        "text": "En revanche, si on livrait à temps, il y aurait sûrement des bugs.",
        "gloss": {
          "en": "On the other hand, if we delivered on time, there would surely be bugs.",
          "ko": "반면에 제때 납품하면 분명 버그가 있을 거예요."
        }
      },
      {
        "who": "them",
        "text": "Et si on ajoutait une personne à l'équipe ?",
        "gloss": {
          "en": "What if we added someone to the team?",
          "ko": "팀에 한 명 더 붙이면 어때요?"
        },
        "alt": [
          {
            "text": "On ne pourrait pas renforcer l'équipe ?",
            "gloss": {
              "en": "Couldn't we strengthen the team?",
              "ko": "팀을 보강할 수는 없을까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Je n'y avais pas pensé. Ça vaut le coup d'essayer, mais il faut qu'elle connaisse le projet.",
        "gloss": {
          "en": "I hadn't thought of that. It's worth a try, but they need to know the project.",
          "ko": "그건 생각 못 했네요. 해 볼 만해요, 다만 프로젝트를 아는 사람이어야 해요."
        }
      },
      {
        "who": "them",
        "text": "Karim le connaît bien. Je lui en parle cet après-midi.",
        "gloss": {
          "en": "Karim knows it well. I'll talk to him about it this afternoon.",
          "ko": "카림이 잘 알아요. 오늘 오후에 얘기해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Parfait. Ce qui compte, c'est qu'on livre quelque chose de solide.",
        "gloss": {
          "en": "Perfect. What matters is that we deliver something solid.",
          "ko": "좋아요. 중요한 건 탄탄한 결과물을 내는 거예요."
        }
      },
      {
        "who": "them",
        "text": "D'accord. Vous m'envoyez le nouveau planning ?",
        "gloss": {
          "en": "Okay. Will you send me the new schedule?",
          "ko": "알겠어요. 새 일정표 보내 줄래요?"
        }
      },
      {
        "who": "me",
        "text": "Comme convenu, je vous l'envoie ce soir, et je vous tiens au courant pour les tests.",
        "gloss": {
          "en": "As agreed, I'll send it to you tonight, and I'll keep you posted on the testing.",
          "ko": "말씀드린 대로 오늘 저녁에 보내 드리고, 테스트 상황도 계속 알려 드릴게요."
        }
      }
    ]
  },
  {
    "id": "fr-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Over drinks, debating remote work with your friend Antoine",
      "ko": "술자리에서 친구 앙투안과 재택근무 토론하기"
    },
    "expressions": [
      "D'un côté",
      "De l'autre",
      "Je comprends ton point de vue",
      "Par contre",
      "Je ne suis pas d'accord",
      "Quoi qu'il en soit",
      "On pourrait"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Franchement, le télétravail, c'est l'avenir. Tu trouves pas ?",
        "gloss": {
          "en": "Honestly, remote work is the future. Don't you think?",
          "ko": "솔직히 재택근무가 미래야. 안 그래?"
        },
        "alt": [
          {
            "text": "Moi, je pourrais plus jamais retourner au bureau tous les jours. Et toi ?",
            "gloss": {
              "en": "I could never go back to the office every day. What about you?",
              "ko": "난 다시는 매일 출근 못 할 것 같아. 너는?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "D'un côté, on gagne du temps. De l'autre, on se sent vite isolé.",
        "gloss": {
          "en": "On the one hand, you save time. On the other, you quickly feel isolated.",
          "ko": "한편으로는 시간을 아끼지. 다른 한편으로는 금방 고립감을 느껴."
        }
      },
      {
        "who": "them",
        "text": "Isolé ? Moi, je vois mes collègues en visio tous les jours.",
        "gloss": {
          "en": "Isolated? I see my colleagues on video calls every day.",
          "ko": "고립감? 난 매일 화상으로 동료들 보는데."
        }
      },
      {
        "who": "me",
        "text": "Je comprends ton point de vue. Par contre, une visio, ça ne remplace pas un café ensemble.",
        "gloss": {
          "en": "I understand your point of view. But a video call doesn't replace a coffee together.",
          "ko": "네 입장은 이해해. 그런데 화상 회의가 같이 마시는 커피를 대신하진 못해."
        }
      },
      {
        "who": "them",
        "text": "Bof. Au bureau, on perd une heure dans les transports.",
        "gloss": {
          "en": "Meh. With the office, you lose an hour commuting.",
          "ko": "글쎄. 출근하면 출퇴근에 한 시간 버리잖아."
        }
      },
      {
        "who": "me",
        "text": "Pourtant, tu disais le mois dernier que tu t'ennuyais chez toi.",
        "gloss": {
          "en": "And yet last month you were saying you were bored at home.",
          "ko": "그런데 지난달엔 집에 있으니 지루하다고 했잖아."
        }
      },
      {
        "who": "them",
        "text": "C'est vrai... Mais je travaille mieux en écoutant de la musique, et au bureau, c'est impossible.",
        "gloss": {
          "en": "True... But I work better listening to music, and at the office that's impossible.",
          "ko": "그렇긴 해... 근데 난 음악 들으면서 일해야 잘되는데, 사무실에선 불가능해."
        }
      },
      {
        "who": "me",
        "text": "Moi aussi, je travaille mieux en écoutant de la musique. Mais je suis content que mon équipe soit là.",
        "gloss": {
          "en": "I also work better listening to music. But I'm glad my team is there.",
          "ko": "나도 음악 들으면서 하면 더 잘돼. 그래도 팀이 옆에 있는 게 좋아."
        }
      },
      {
        "who": "them",
        "text": "Et si ton patron te proposait cinq jours de télétravail ?",
        "gloss": {
          "en": "And if your boss offered you five days of remote work?",
          "ko": "그럼 상사가 주 5일 재택을 제안하면?"
        },
        "alt": [
          {
            "text": "Imagine qu'on te propose du télétravail à cent pour cent.",
            "gloss": {
              "en": "Imagine you were offered fully remote work.",
              "ko": "완전 재택을 제안받았다고 생각해 봐."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Si on me le proposait, je refuserais. Deux jours par semaine, c'est l'idéal.",
        "gloss": {
          "en": "If they offered it to me, I'd turn it down. Two days a week is ideal.",
          "ko": "그런 제안을 받으면 거절할 거야. 일주일에 이틀이 딱 좋아."
        }
      },
      {
        "who": "them",
        "text": "Deux jours ? Moi, je dirais quatre minimum.",
        "gloss": {
          "en": "Two days? I'd say four at least.",
          "ko": "이틀? 난 최소 나흘은 돼야 해."
        }
      },
      {
        "who": "me",
        "text": "Je ne suis pas d'accord. Il faut qu'on se voie au moins la moitié de la semaine.",
        "gloss": {
          "en": "I don't agree. We need to see each other at least half the week.",
          "ko": "난 동의 못 해. 적어도 일주일의 절반은 얼굴을 봐야지."
        }
      },
      {
        "who": "them",
        "text": "Bon, on ne va pas tomber d'accord ce soir !",
        "gloss": {
          "en": "Well, we're not going to agree tonight!",
          "ko": "뭐, 오늘 밤엔 합의 못 하겠다!"
        }
      },
      {
        "who": "me",
        "text": "Quoi qu'il en soit, on pourrait en reparler autour d'un autre verre.",
        "gloss": {
          "en": "Anyway, we could talk about it again over another drink.",
          "ko": "어쨌든, 한잔 더 하면서 다시 얘기해 보자."
        }
      }
    ]
  },
  {
    "id": "fr-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Taking a faulty vacuum cleaner back to an electronics shop",
      "ko": "전자제품 매장에 고장 난 청소기 반품하기"
    },
    "expressions": [
      "Ça ne m'étonne pas",
      "Pour résumer"
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
    "earlierGrammar": [
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, je peux vous aider ?",
        "gloss": {
          "en": "Hello, can I help you?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. J'ai acheté cet aspirateur ici la semaine dernière, et il s'arrête tout seul en faisant un bruit bizarre.",
        "gloss": {
          "en": "Hello. I bought this vacuum cleaner here last week, and it cuts out on its own, making a strange noise.",
          "ko": "안녕하세요. 지난주에 여기서 이 청소기를 샀는데, 이상한 소리를 내면서 저절로 꺼져요."
        }
      },
      {
        "who": "them",
        "text": "Vous avez le ticket de caisse ?",
        "gloss": {
          "en": "Do you have the receipt?",
          "ko": "영수증 있으세요?"
        },
        "alt": [
          {
            "text": "Vous avez gardé la facture ?",
            "gloss": {
              "en": "Did you keep the invoice?",
              "ko": "영수증 보관하셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Oui, le voici. Je l'avais rangé dans la boîte, heureusement.",
        "gloss": {
          "en": "Yes, here it is. Luckily I had put it away in the box.",
          "ko": "네, 여기요. 다행히 상자에 넣어 뒀었어요."
        }
      },
      {
        "who": "them",
        "text": "Hmm. Vous l'avez peut-être mal utilisé ?",
        "gloss": {
          "en": "Hmm. Maybe you used it wrongly?",
          "ko": "음. 혹시 잘못 사용하신 건 아닐까요?"
        },
        "alt": [
          {
            "text": "Vous êtes sûr de l'avoir bien branché ?",
            "gloss": {
              "en": "Are you sure you plugged it in properly?",
              "ko": "제대로 연결하신 거 확실해요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Je ne pense pas que ce soit de ma faute. J'avais lu toute la notice avant de l'utiliser.",
        "gloss": {
          "en": "I don't think it's my fault. I had read the whole manual before using it.",
          "ko": "제 잘못은 아닌 것 같아요. 쓰기 전에 설명서를 다 읽었거든요."
        }
      },
      {
        "who": "them",
        "text": "Je peux vous proposer une réparation. Ça prend trois semaines.",
        "gloss": {
          "en": "I can offer you a repair. It takes three weeks.",
          "ko": "수리를 해 드릴 수 있어요. 3주 걸려요."
        }
      },
      {
        "who": "me",
        "text": "Trois semaines ? Je voudrais plutôt que vous me le remplaciez.",
        "gloss": {
          "en": "Three weeks? I'd rather you replaced it for me.",
          "ko": "3주요? 차라리 교환해 주셨으면 해요."
        }
      },
      {
        "who": "them",
        "text": "Malheureusement, on n'en a plus en stock.",
        "gloss": {
          "en": "Unfortunately, we don't have any left in stock.",
          "ko": "죄송하지만 재고가 없어요."
        }
      },
      {
        "who": "me",
        "text": "Alors, si vous n'en aviez vraiment plus, je préférerais être remboursé.",
        "gloss": {
          "en": "Then, if you really had none left, I'd prefer a refund.",
          "ko": "그럼 정말 재고가 없으면 환불받는 게 좋겠어요."
        }
      },
      {
        "who": "them",
        "text": "Pour un remboursement, il faut l'accord du responsable.",
        "gloss": {
          "en": "For a refund, I need the manager's approval.",
          "ko": "환불은 매니저 승인이 필요해요."
        }
      },
      {
        "who": "me",
        "text": "Ça ne m'étonne pas. Vous pourriez l'appeler, s'il vous plaît ?",
        "gloss": {
          "en": "That doesn't surprise me. Could you call them, please?",
          "ko": "그럴 줄 알았어요. 불러 주실 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "Il arrive. Je vais lui expliquer la situation.",
        "gloss": {
          "en": "He's coming. I'll explain the situation to him.",
          "ko": "곧 오세요. 제가 상황을 설명할게요."
        },
        "alt": [
          {
            "text": "Un instant, je vais le chercher.",
            "gloss": {
              "en": "One moment, I'll go and get him.",
              "ko": "잠시만요, 모셔 올게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Merci. Pour résumer : l'appareil ne marche pas, alors que je l'ai à peine utilisé.",
        "gloss": {
          "en": "Thank you. To sum up: the device doesn't work, even though I've barely used it.",
          "ko": "고마워요. 정리하면, 거의 쓰지도 않았는데 제품이 작동을 안 해요."
        }
      }
    ]
  },
  {
    "id": "fr-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "At lunch, discussing a news report on housing prices with your friend Camille",
      "ko": "점심 자리에서 친구 카미유와 집값 뉴스 이야기하기"
    },
    "expressions": [
      "Je me demande si"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:1",
      "3:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "T'as vu ? Les prix de l'immobilier ont encore augmenté de dix pour cent.",
        "gloss": {
          "en": "Did you see? Property prices have gone up ten percent again.",
          "ko": "봤어? 집값이 또 10퍼센트 올랐대."
        },
        "alt": [
          {
            "text": "Tu as lu l'article sur les loyers à Paris ?",
            "gloss": {
              "en": "Did you read the article on rents in Paris?",
              "ko": "파리 월세 기사 읽었어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Oui, je l'ai lu ce matin en prenant le métro.",
        "gloss": {
          "en": "Yes, I read it this morning on the metro.",
          "ko": "응, 아침에 지하철 타면서 읽었어."
        }
      },
      {
        "who": "them",
        "text": "C'est fou. Les jeunes ne peuvent plus rien acheter.",
        "gloss": {
          "en": "It's crazy. Young people can't buy anything anymore.",
          "ko": "말도 안 돼. 젊은 사람들은 이제 아무것도 못 사."
        }
      },
      {
        "who": "me",
        "text": "C'est dommage que les salaires n'augmentent pas aussi vite.",
        "gloss": {
          "en": "It's a shame salaries aren't rising as fast.",
          "ko": "월급이 그만큼 안 오르는 게 안타까워."
        }
      },
      {
        "who": "them",
        "text": "Selon l'article, il faudrait construire plus de logements.",
        "gloss": {
          "en": "According to the article, we should build more housing.",
          "ko": "기사에 따르면 집을 더 지어야 한대."
        },
        "alt": [
          {
            "text": "Le journaliste dit que la solution, c'est de construire plus.",
            "gloss": {
              "en": "The journalist says the solution is to build more.",
              "ko": "기자 말로는 해결책은 더 짓는 거래."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Je me demande si ça suffirait. Les loyers augmentent, alors que beaucoup d'appartements sont vides.",
        "gloss": {
          "en": "I wonder if that would be enough. Rents are rising, while lots of flats are empty.",
          "ko": "그걸로 충분할지 모르겠어. 빈집이 많은데도 월세는 오르잖아."
        }
      },
      {
        "who": "them",
        "text": "Bah, les propriétaires préfèrent louer aux touristes.",
        "gloss": {
          "en": "Well, landlords prefer renting to tourists.",
          "ko": "뭐, 집주인들은 관광객한테 세 주는 걸 더 좋아하니까."
        }
      },
      {
        "who": "me",
        "text": "Si j'avais un appartement vide, je le louerais à une famille, pas à des touristes.",
        "gloss": {
          "en": "If I had an empty flat, I'd rent it to a family, not to tourists.",
          "ko": "나한테 빈집이 있으면 관광객 말고 가족한테 세 줄 거야."
        }
      },
      {
        "who": "them",
        "text": "Facile à dire ! Tu sais combien ça rapporte, la location touristique ?",
        "gloss": {
          "en": "Easy to say! Do you know how much holiday rentals bring in?",
          "ko": "말이야 쉽지! 관광객 임대가 얼마나 버는지 알아?"
        }
      },
      {
        "who": "me",
        "text": "Je sais. Avant de lire l'article, je n'avais jamais réalisé à quel point c'était rentable.",
        "gloss": {
          "en": "I know. Before reading the article, I had never realised how profitable it was.",
          "ko": "알아. 기사 읽기 전엔 그게 그렇게 돈이 되는 줄 몰랐어."
        }
      },
      {
        "who": "them",
        "text": "Moi, je pense qu'il faut interdire les locations courtes en centre-ville.",
        "gloss": {
          "en": "I think short-term rentals should be banned in the city centre.",
          "ko": "난 시내 단기 임대는 금지해야 한다고 봐."
        },
        "alt": [
          {
            "text": "Il faudrait carrément les interdire, ces locations.",
            "gloss": {
              "en": "They should just ban those rentals outright.",
              "ko": "그런 임대는 아예 금지해야 해."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "C'est un peu radical, mais je comprends que les habitants soient en colère.",
        "gloss": {
          "en": "That's a bit radical, but I understand why residents are angry.",
          "ko": "좀 과격하긴 한데, 주민들이 화나는 건 이해돼."
        }
      },
      {
        "who": "them",
        "text": "Bref, c'est pas demain qu'on achète un appart.",
        "gloss": {
          "en": "Anyway, we won't be buying a flat any time soon.",
          "ko": "뭐, 우리가 집 사는 건 먼 얘기야."
        }
      },
      {
        "who": "me",
        "text": "En tout cas, j'aimerais que le gouvernement fasse quelque chose.",
        "gloss": {
          "en": "In any case, I'd like the government to do something.",
          "ko": "어쨌든 정부가 뭔가 좀 했으면 좋겠어."
        }
      }
    ]
  },
  {
    "id": "fr-4-5",
    "stage": 4,
    "situation": 4,
    "setting": {
      "en": "Your friend Élodie can't decide whether to take a job in Lyon",
      "ko": "리옹 일자리를 받아들일지 고민하는 친구 엘로디에게 조언하기"
    },
    "expressions": [
      "Si j'étais toi",
      "Ça vaut le coup"
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
      "3:3",
      "3:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Je sais plus quoi faire. On m'a proposé un poste à Lyon.",
        "gloss": {
          "en": "I don't know what to do anymore. I've been offered a job in Lyon.",
          "ko": "어떻게 해야 할지 모르겠어. 리옹에 자리를 제안받았어."
        },
        "alt": [
          {
            "text": "J'hésite à accepter une offre à Lyon.",
            "gloss": {
              "en": "I'm hesitating over an offer in Lyon.",
              "ko": "리옹 제안을 받아들일지 망설이고 있어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ah bon ? Je suis surpris que tu hésites, tu voulais partir !",
        "gloss": {
          "en": "Really? I'm surprised you're hesitating, you wanted to leave!",
          "ko": "그래? 네가 망설이다니 놀랍다, 떠나고 싶어 했잖아!"
        }
      },
      {
        "who": "them",
        "text": "Le salaire est meilleur, mais je devrais quitter mes amis.",
        "gloss": {
          "en": "The salary is better, but I'd have to leave my friends.",
          "ko": "월급은 더 좋은데 친구들을 떠나야 하잖아."
        }
      },
      {
        "who": "me",
        "text": "Si j'étais toi, je ne refuserais pas une offre pareille.",
        "gloss": {
          "en": "If I were you, I wouldn't turn down an offer like that.",
          "ko": "내가 너라면 그런 제안은 거절 안 할 거야."
        }
      },
      {
        "who": "them",
        "text": "Oui, mais j'ai peur de regretter.",
        "gloss": {
          "en": "Yes, but I'm afraid I'll regret it.",
          "ko": "응, 근데 후회할까 봐 무서워."
        },
        "alt": [
          {
            "text": "Et si je me plante ?",
            "gloss": {
              "en": "And what if I mess it up?",
              "ko": "만약 망하면?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Il faut que tu penses à ce que tu veux vraiment dans cinq ans.",
        "gloss": {
          "en": "You need to think about what you really want in five years.",
          "ko": "5년 뒤에 진짜 뭘 원하는지 생각해 봐야 해."
        }
      },
      {
        "who": "them",
        "text": "Dans cinq ans ? Aucune idée, honnêtement.",
        "gloss": {
          "en": "In five years? No idea, honestly.",
          "ko": "5년 뒤? 솔직히 전혀 모르겠어."
        }
      },
      {
        "who": "me",
        "text": "Tu m'avais dit que tu voulais un poste avec plus de responsabilités.",
        "gloss": {
          "en": "You'd told me you wanted a job with more responsibility.",
          "ko": "책임이 더 큰 자리를 원한다고 했었잖아."
        }
      },
      {
        "who": "them",
        "text": "C'est vrai. Et ce poste, c'est exactement ça.",
        "gloss": {
          "en": "That's true. And this job is exactly that.",
          "ko": "맞아. 그리고 이 자리가 딱 그래."
        }
      },
      {
        "who": "me",
        "text": "Alors, ça vaut le coup. Tu peux toujours revenir voir tes amis en prenant le train.",
        "gloss": {
          "en": "Then it's worth it. You can always come back and see your friends by taking the train.",
          "ko": "그럼 해 볼 만하네. 기차 타고 친구들 보러 언제든 올 수 있잖아."
        }
      },
      {
        "who": "them",
        "text": "Mon chef ne sait encore rien. Je lui dis quand, à ton avis ?",
        "gloss": {
          "en": "My boss doesn't know anything yet. When do you think I should tell him?",
          "ko": "상사는 아직 아무것도 몰라. 언제 말하는 게 좋을까?"
        },
        "alt": [
          {
            "text": "Comment je l'annonce à mon chef ?",
            "gloss": {
              "en": "How do I break it to my boss?",
              "ko": "상사한테 어떻게 말하지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Dis-le-lui dès que tu as signé le contrat, pas avant.",
        "gloss": {
          "en": "Tell him as soon as you've signed the contract, not before.",
          "ko": "계약서에 서명하자마자 말해, 그 전엔 말고."
        }
      },
      {
        "who": "them",
        "text": "D'accord. Merci, ça m'aide vraiment.",
        "gloss": {
          "en": "Okay. Thanks, that really helps.",
          "ko": "알았어. 고마워, 정말 도움 돼."
        }
      },
      {
        "who": "me",
        "text": "Avec plaisir. Et si tu pars, je viendrai te voir à Lyon, promis !",
        "gloss": {
          "en": "My pleasure. And if you go, I'll come and see you in Lyon, promise!",
          "ko": "별말을. 네가 가면 리옹으로 놀러 갈게, 약속해!"
        }
      }
    ]
  },
  {
    "id": "fr-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "A dinner party at your friend Thomas's place; the talk drifts to pension reform",
      "ko": "친구 토마 집 저녁 모임, 대화가 연금 개혁 이야기로 흘러감"
    },
    "goal": {
      "en": "Give a nuanced view on the reform without starting a fight, then steer the table back to a lighter topic",
      "ko": "싸움을 만들지 않고 개혁에 대한 균형 잡힌 생각을 말한 뒤, 가벼운 화제로 자연스럽게 돌리기"
    },
    "expressions": [
      "À vrai dire",
      "Je dirais plutôt",
      "Je n'irais pas jusque-là",
      "C'est pas faux",
      "Loin de là",
      "Soit dit en passant",
      "Force est de constater",
      "Si je puis dire",
      "Bref",
      "Tant pis"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "earlierGrammar": [
      "4:1",
      "4:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Et toi, tu en penses quoi, de cette réforme des retraites ? Moi, je trouve ça scandaleux.",
        "gloss": {
          "en": "And you, what do you think of this pension reform? I find it outrageous.",
          "ko": "너는 이번 연금 개혁 어떻게 생각해? 난 어이없다고 봐."
        }
      },
      {
        "who": "me",
        "text": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là.",
        "gloss": {
          "en": "To be honest, I'd rather say it's clumsy. Outrageous, I wouldn't go that far.",
          "ko": "솔직히 난 서툴다고 하는 게 맞는 것 같아. 어이없다고까지는 말 못 하겠어."
        }
      },
      {
        "who": "them",
        "text": "Maladroite ? Ils l'ont fait passer sans vote, quand même !",
        "gloss": {
          "en": "Clumsy? They pushed it through without a vote, though!",
          "ko": "서툴다고? 표결도 없이 밀어붙였잖아!"
        }
      },
      {
        "who": "me",
        "text": "C'est pas faux. Ce qui me gêne, c'est justement la méthode, pas forcément le fond.",
        "gloss": {
          "en": "Fair point. What bothers me is precisely the method, not necessarily the substance.",
          "ko": "틀린 말은 아니야. 내가 걸리는 건 바로 방식이지, 꼭 내용은 아니야."
        }
      },
      {
        "who": "them",
        "text": "Sans vouloir te vexer, tu parles comme un ministre !",
        "gloss": {
          "en": "No offence, but you sound like a minister!",
          "ko": "기분 나빠하지 말고 들어, 너 장관처럼 말한다!"
        }
      },
      {
        "who": "me",
        "text": "Ha ! Loin de là. Bien que je comprenne le problème du financement, j'aurais préféré un vrai débat.",
        "gloss": {
          "en": "Ha! Far from it. Although I understand the funding problem, I'd have preferred a real debate.",
          "ko": "하! 전혀 아니야. 재원 문제는 이해하지만, 제대로 된 토론이 있었으면 했어."
        }
      },
      {
        "who": "them",
        "text": "Un débat ? Il y en a eu, des débats, pendant des mois !",
        "gloss": {
          "en": "A debate? There were debates, for months!",
          "ko": "토론? 몇 달 동안 토론했잖아!"
        }
      },
      {
        "who": "me",
        "text": "Il semblerait que personne n'ait vraiment écouté les syndicats, soit dit en passant.",
        "gloss": {
          "en": "It would seem nobody really listened to the unions, incidentally.",
          "ko": "말이 나온 김에, 아무도 노조 말을 제대로 듣지 않은 것 같더라."
        }
      },
      {
        "who": "them",
        "text": "Ça se discute. Les syndicats bloquaient tout, aussi.",
        "gloss": {
          "en": "That's debatable. The unions were blocking everything too.",
          "ko": "그건 논란의 여지가 있지. 노조도 다 막고 있었잖아."
        }
      },
      {
        "who": "me",
        "text": "Force est de constater que tout le monde est resté sur ses positions.",
        "gloss": {
          "en": "One has to admit that everyone stuck to their positions.",
          "ko": "결국 다들 자기 입장만 고수했다는 걸 인정할 수밖에 없지."
        }
      },
      {
        "who": "them",
        "text": "Bon, Claire nous regarde d'un drôle d'air. On l'ennuie, je crois.",
        "gloss": {
          "en": "Well, Claire's giving us a funny look. I think we're boring her.",
          "ko": "음, 클레르가 이상한 눈으로 쳐다보네. 우리가 지루하게 하나 봐."
        }
      },
      {
        "who": "me",
        "text": "Si je puis dire, la politique à table, ce n'est pas vraiment son dada.",
        "gloss": {
          "en": "If I may say so, politics at the table isn't really her thing.",
          "ko": "이렇게 말해도 될지 모르겠지만, 식탁에서 정치 얘기는 클레르 취향이 아니지."
        }
      },
      {
        "who": "them",
        "text": "Pas le mien non plus, en fait. Ça finit toujours en dispute.",
        "gloss": {
          "en": "Not mine either, actually. It always ends in an argument.",
          "ko": "사실 나도 아니야. 늘 싸움으로 끝나거든."
        }
      },
      {
        "who": "me",
        "text": "Bref, et si on parlait plutôt du dessert ? Il paraît que c'est toi qui l'as fait.",
        "gloss": {
          "en": "Anyway, how about we talk about dessert instead? I hear you're the one who made it.",
          "ko": "아무튼 디저트 얘기나 할까? 네가 직접 만들었다며."
        }
      },
      {
        "who": "them",
        "text": "Oui, une tarte Tatin. Bon, je l'ai un peu ratée...",
        "gloss": {
          "en": "Yes, a tarte Tatin. Well, it didn't quite work out...",
          "ko": "응, 타르트 타탱. 근데 좀 망쳤어..."
        }
      },
      {
        "who": "me",
        "text": "Tant pis, elle a l'air délicieuse. J'aurais dû apporter du cidre pour l'accompagner !",
        "gloss": {
          "en": "Never mind, it looks delicious. I should have brought some cider to go with it!",
          "ko": "괜찮아, 맛있어 보이는데. 곁들일 사과주라도 가져올걸!"
        }
      }
    ]
  },
  {
    "id": "fr-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "A video call with Mme Laurent, a client who wants a lower price",
      "ko": "가격을 낮추고 싶어 하는 고객 로랑 씨와 화상 회의"
    },
    "goal": {
      "en": "Keep your price while offering flexibility on payment and delivery dates",
      "ko": "가격은 지키면서 결제 방식과 납품 일정에서 유연함을 보여 주기"
    },
    "expressions": [
      "Il se trouve que",
      "Tant mieux"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "4:0",
      "4:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Nous avons bien étudié votre proposition. Le tarif nous paraît un peu élevé.",
        "gloss": {
          "en": "We've looked closely at your proposal. The price seems a little high to us.",
          "ko": "제안서를 잘 검토했습니다. 가격이 좀 높은 것 같네요."
        }
      },
      {
        "who": "me",
        "text": "Je comprends. Il se trouve que ce tarif comprend la maintenance pendant un an.",
        "gloss": {
          "en": "I understand. As it happens, that price includes a year of maintenance.",
          "ko": "이해합니다. 실은 그 가격에 1년 유지보수가 포함되어 있습니다."
        }
      },
      {
        "who": "them",
        "text": "Votre concurrent nous propose quinze pour cent de moins.",
        "gloss": {
          "en": "Your competitor is offering us fifteen percent less.",
          "ko": "경쟁사는 15퍼센트 싸게 제안했어요."
        }
      },
      {
        "who": "me",
        "text": "Il serait peut-être utile de comparer ce qui est inclus dans chaque offre.",
        "gloss": {
          "en": "It might be useful to compare what's included in each offer.",
          "ko": "각 제안에 무엇이 포함되는지 비교해 보시면 좋을 것 같습니다."
        }
      },
      {
        "who": "them",
        "text": "Justement, leur offre inclut aussi la formation.",
        "gloss": {
          "en": "Actually, their offer also includes training.",
          "ko": "그쪽 제안엔 교육도 포함돼 있어요."
        }
      },
      {
        "who": "me",
        "text": "Ce que nous apportons en plus, c'est un interlocuteur dédié, disponible en permanence.",
        "gloss": {
          "en": "What we bring on top of that is a dedicated contact, available at all times.",
          "ko": "저희가 더 드리는 건 언제든 연락되는 전담 담당자입니다."
        }
      },
      {
        "who": "them",
        "text": "Certes. Mais notre budget a été réduit de dix pour cent cette année.",
        "gloss": {
          "en": "Granted. But our budget has been cut by ten percent this year.",
          "ko": "그렇긴 하죠. 하지만 올해 저희 예산이 10퍼센트 줄었어요."
        }
      },
      {
        "who": "me",
        "text": "Bien qu'il nous soit difficile de baisser le tarif, nous pourrions revoir le calendrier de paiement.",
        "gloss": {
          "en": "Although it's difficult for us to lower the price, we could revisit the payment schedule.",
          "ko": "가격을 낮추기는 어렵지만, 결제 일정은 조정해 드릴 수 있습니다."
        }
      },
      {
        "who": "them",
        "text": "C'est-à-dire ?",
        "gloss": {
          "en": "Meaning?",
          "ko": "어떻게요?"
        }
      },
      {
        "who": "me",
        "text": "Il a été convenu en interne qu'un paiement en trois fois pourrait être accepté.",
        "gloss": {
          "en": "It has been agreed internally that payment in three instalments could be accepted.",
          "ko": "내부적으로 3회 분할 결제를 받아들일 수 있다고 정해졌습니다."
        }
      },
      {
        "who": "them",
        "text": "Intéressant. Et le délai ? Il nous faut tout pour mars.",
        "gloss": {
          "en": "Interesting. And the timeline? We need everything by March.",
          "ko": "흥미롭네요. 기한은요? 3월까지 전부 필요해요."
        }
      },
      {
        "who": "me",
        "text": "Mars, c'est serré. Je regrette que vous ne nous en ayez pas parlé plus tôt.",
        "gloss": {
          "en": "March is tight. I'm sorry you didn't mention it to us earlier.",
          "ko": "3월은 빠듯합니다. 더 일찍 말씀해 주셨더라면 좋았을 텐데요."
        }
      },
      {
        "who": "them",
        "text": "Je sais, la décision a été prise tard chez nous.",
        "gloss": {
          "en": "I know, the decision was made late on our side.",
          "ko": "알아요, 저희 쪽 결정이 늦게 났어요."
        }
      },
      {
        "who": "me",
        "text": "Avec une équipe plus grande, nous aurions pu tout livrer en mars. Je propose une première partie en mars, et le reste en avril.",
        "gloss": {
          "en": "With a bigger team, we could have delivered everything in March. I suggest a first part in March and the rest in April.",
          "ko": "팀이 더 컸다면 3월에 다 드릴 수 있었을 겁니다. 3월에 1차분, 4월에 나머지를 제안드립니다."
        }
      },
      {
        "who": "them",
        "text": "Ça me paraît raisonnable. Je dois en parler à ma direction.",
        "gloss": {
          "en": "That seems reasonable. I need to discuss it with my management.",
          "ko": "합리적인 것 같네요. 경영진과 상의해 봐야 해요."
        }
      },
      {
        "who": "me",
        "text": "Tant mieux. Je vous envoie une proposition révisée d'ici demain.",
        "gloss": {
          "en": "Good. I'll send you a revised proposal by tomorrow.",
          "ko": "다행입니다. 내일까지 수정 제안서를 보내 드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "fr-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Talking about a novel your friend Mathilde lent you",
      "ko": "친구 마틸드가 빌려준 소설에 대해 깊이 이야기하기"
    },
    "goal": {
      "en": "Defend your reading of the ending while acknowledging your friend's interpretation",
      "ko": "친구의 해석도 인정하면서 결말에 대한 내 해석을 설득력 있게 말하기"
    },
    "expressions": [
      "Ça se discute",
      "Ce n'est pas mon truc",
      "À vrai dire",
      "Ça ne me dit rien",
      "Tant mieux"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "4:1",
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alors, tu l'as fini, le roman que je t'avais prêté ?",
        "gloss": {
          "en": "So, did you finish the novel I lent you?",
          "ko": "그래서, 내가 빌려준 소설 다 읽었어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, hier soir. J'ai beau y réfléchir, je ne comprends toujours pas la fin.",
        "gloss": {
          "en": "Yes, last night. However much I think about it, I still don't understand the ending.",
          "ko": "응, 어젯밤에. 아무리 생각해도 결말을 아직 모르겠어."
        }
      },
      {
        "who": "them",
        "text": "Ah, la dernière phrase ? « Elle ferma la porte et ne revint jamais. »",
        "gloss": {
          "en": "Ah, the last sentence? 'She closed the door and never came back.'",
          "ko": "아, 마지막 문장? '그녀는 문을 닫고 다시는 돌아오지 않았다.'"
        }
      },
      {
        "who": "me",
        "text": "Voilà. Quand on lit « elle ne revint jamais », on ne sait pas si elle est morte ou si elle est enfin libre.",
        "gloss": {
          "en": "Exactly. When you read 'she never came back', you don't know if she's dead or finally free.",
          "ko": "바로 그거. '다시는 돌아오지 않았다'를 읽으면 죽은 건지 마침내 자유로워진 건지 모르겠어."
        }
      },
      {
        "who": "them",
        "text": "Moi, je pense qu'elle est partie refaire sa vie. C'est évident.",
        "gloss": {
          "en": "I think she left to start a new life. It's obvious.",
          "ko": "난 새 삶을 찾아 떠났다고 봐. 뻔하잖아."
        }
      },
      {
        "who": "me",
        "text": "Ça se discute. Ce que l'auteur suggère, à mon avis, c'est qu'on ne s'en sort jamais vraiment.",
        "gloss": {
          "en": "That's debatable. What the author is suggesting, in my view, is that you never really get out.",
          "ko": "그건 생각해 볼 문제야. 내 생각에 작가가 말하려는 건 결코 완전히 벗어날 수는 없다는 거야."
        }
      },
      {
        "who": "them",
        "text": "C'est d'un pessimisme ! Moi, j'y ai vu une fin pleine d'espoir.",
        "gloss": {
          "en": "That's so pessimistic! I saw a hopeful ending in it.",
          "ko": "너무 비관적이다! 난 희망찬 결말로 봤는데."
        }
      },
      {
        "who": "me",
        "text": "Pleine d'espoir ? Quoique... le dernier chapitre est plus lumineux, c'est vrai.",
        "gloss": {
          "en": "Hopeful? Mind you... the last chapter is brighter, that's true.",
          "ko": "희망차다고? 하긴... 마지막 장이 더 밝긴 해, 맞아."
        }
      },
      {
        "who": "them",
        "text": "Et le personnage du père, tu l'as trouvé comment ?",
        "gloss": {
          "en": "And the father character, what did you make of him?",
          "ko": "그리고 아버지 캐릭터는 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "À vrai dire, les personnages aussi caricaturaux, ce n'est pas mon truc.",
        "gloss": {
          "en": "To be honest, characters that cartoonish aren't my thing.",
          "ko": "솔직히 그렇게 과장된 인물은 내 취향이 아니야."
        }
      },
      {
        "who": "them",
        "text": "Caricatural ? Il est juste réaliste !",
        "gloss": {
          "en": "Cartoonish? He's just realistic!",
          "ko": "과장됐다고? 그냥 현실적인 거야!"
        }
      },
      {
        "who": "me",
        "text": "Il aurait pu être plus nuancé. On aurait dit qu'il avait été écrit pour être détesté.",
        "gloss": {
          "en": "He could have been more nuanced. It was as if he'd been written to be hated.",
          "ko": "좀 더 입체적일 수도 있었지. 미움받으려고 쓰인 인물 같았어."
        }
      },
      {
        "who": "them",
        "text": "Tu sais qu'ils vont en faire un film ?",
        "gloss": {
          "en": "You know they're going to make a film of it?",
          "ko": "그거 영화로 만든다는 거 알아?"
        }
      },
      {
        "who": "me",
        "text": "Ça ne me dit rien qui vaille. Les adaptations trahissent souvent le livre.",
        "gloss": {
          "en": "I don't have a good feeling about that. Adaptations often betray the book.",
          "ko": "별로 예감이 좋지 않네. 각색은 원작을 망치는 경우가 많잖아."
        }
      },
      {
        "who": "them",
        "text": "Celui-ci sera réalisé par une jeune réalisatrice belge, apparemment très douée.",
        "gloss": {
          "en": "This one will be directed by a young Belgian director, apparently very gifted.",
          "ko": "이번엔 젊은 벨기에 감독이 맡는대, 재능이 대단하다더라."
        }
      },
      {
        "who": "me",
        "text": "Ah, tant mieux ! Bien que je reste sceptique, j'irai le voir.",
        "gloss": {
          "en": "Oh, good! Although I'm still sceptical, I'll go and see it.",
          "ko": "오, 다행이다! 여전히 의심스럽긴 하지만 보러 갈게."
        }
      }
    ]
  },
  {
    "id": "fr-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Your friend Chloé was stood up last night; you meet her for coffee",
      "ko": "어젯밤 바람맞은 친구 클로에를 커피숍에서 만남"
    },
    "goal": {
      "en": "Comfort your friend, convince her it isn't her fault, and lift her spirits",
      "ko": "친구를 위로하고 그녀 잘못이 아니라고 믿게 하며 기분을 풀어 주기"
    },
    "expressions": [
      "Poser un lapin",
      "N'importe quoi",
      "La goutte d'eau",
      "Loin de là",
      "Avoir le cafard",
      "Il ne manquait plus que ça",
      "Bref"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "earlierGrammar": [
      "4:5",
      "4:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Il m'a posé un lapin. Une heure que je l'attendais au restaurant.",
        "gloss": {
          "en": "He stood me up. I waited for him for an hour at the restaurant.",
          "ko": "그 사람이 나 바람맞혔어. 식당에서 한 시간이나 기다렸는데."
        }
      },
      {
        "who": "me",
        "text": "Quoi ? Poser un lapin à quelqu'un, c'est vraiment nul. Il ne t'a même pas prévenue ?",
        "gloss": {
          "en": "What? Standing someone up is really lousy. He didn't even let you know?",
          "ko": "뭐? 사람을 바람맞히는 건 진짜 최악이야. 연락도 안 했어?"
        }
      },
      {
        "who": "them",
        "text": "Rien. Pas un message. Et il a lu les miens, en plus.",
        "gloss": {
          "en": "Nothing. Not one message. And he read mine, on top of that.",
          "ko": "아무것도. 문자 하나 없어. 게다가 내 문자는 읽었어."
        }
      },
      {
        "who": "me",
        "text": "N'importe quoi. Il aurait au moins pu inventer une excuse !",
        "gloss": {
          "en": "That's ridiculous. He could at least have made up an excuse!",
          "ko": "말도 안 돼. 적어도 핑계라도 댈 수 있었잖아!"
        }
      },
      {
        "who": "them",
        "text": "C'est la troisième fois ce mois-ci.",
        "gloss": {
          "en": "It's the third time this month.",
          "ko": "이번 달에만 세 번째야."
        }
      },
      {
        "who": "me",
        "text": "Alors là, c'est la goutte d'eau qui fait déborder le vase. Je suis désolé que tu aies vécu ça.",
        "gloss": {
          "en": "Well, that's the last straw. I'm sorry you went through that.",
          "ko": "이건 정말 참을 만큼 참은 거야. 그런 일을 겪었다니 속상하다."
        }
      },
      {
        "who": "them",
        "text": "Je me sens nulle. Je me dis que c'est peut-être de ma faute.",
        "gloss": {
          "en": "I feel useless. I keep thinking maybe it's my fault.",
          "ko": "내가 한심하게 느껴져. 내 잘못인가 싶기도 하고."
        }
      },
      {
        "who": "me",
        "text": "Loin de là ! C'est lui qui n'est pas fiable, pas toi.",
        "gloss": {
          "en": "Far from it! He's the one who's unreliable, not you.",
          "ko": "전혀! 믿을 수 없는 건 그 사람이지 네가 아니야."
        }
      },
      {
        "who": "them",
        "text": "J'ai le cafard depuis hier soir...",
        "gloss": {
          "en": "I've been feeling down since last night...",
          "ko": "어젯밤부터 계속 우울해..."
        }
      },
      {
        "who": "me",
        "text": "Avoir le cafard après ça, c'est normal. Ça passera, crois-moi.",
        "gloss": {
          "en": "Feeling down after that is normal. It'll pass, believe me.",
          "ko": "그런 일 뒤에 우울한 건 당연해. 지나갈 거야, 내 말 믿어."
        }
      },
      {
        "who": "them",
        "text": "Et le pire, c'est que j'avais réservé et payé d'avance.",
        "gloss": {
          "en": "And the worst part is I'd booked and paid in advance.",
          "ko": "더 최악은 내가 예약하고 미리 돈까지 냈다는 거야."
        }
      },
      {
        "who": "me",
        "text": "Il ne manquait plus que ça ! Bien que ce soit rageant, tu as au moins bien mangé ?",
        "gloss": {
          "en": "That's all you needed! Infuriating as it is, did you at least eat well?",
          "ko": "설상가상이네! 열받긴 하지만, 밥은 잘 먹었어?"
        }
      },
      {
        "who": "them",
        "text": "Même pas, je suis partie avant le plat. Tant pis.",
        "gloss": {
          "en": "Not even, I left before the main course. Oh well.",
          "ko": "그것도 아니야, 메인 나오기 전에 나왔어. 어쩔 수 없지."
        }
      },
      {
        "who": "me",
        "text": "Il vaudrait peut-être mieux que tu lui dises clairement ce que tu ressens.",
        "gloss": {
          "en": "It might be better to tell him clearly how you feel.",
          "ko": "그 사람한테 네 기분을 분명히 말하는 게 나을지도 몰라."
        }
      },
      {
        "who": "them",
        "text": "Oui... ou je le bloque, tout simplement.",
        "gloss": {
          "en": "Yeah... or I just block him.",
          "ko": "응... 아니면 그냥 차단하든가."
        }
      },
      {
        "who": "me",
        "text": "Bref, ce soir, je t'emmène dîner. J'aurais dû te le proposer plus tôt !",
        "gloss": {
          "en": "Anyway, tonight I'm taking you out to dinner. I should have suggested it sooner!",
          "ko": "아무튼 오늘 저녁은 내가 데리고 나갈게. 진작 말할걸!"
        }
      }
    ]
  },
  {
    "id": "fr-5-x1",
    "stage": 5,
    "setting": {
      "en": "Your friend Bastien asks what you really think of his new song",
      "ko": "친구 바스티앙이 새 노래에 대한 솔직한 생각을 물어봄"
    },
    "expressions": [
      "Sans vouloir te vexer",
      "Ce n'est pas mon truc"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alors, ma chanson, sincèrement, t'en penses quoi ?",
        "gloss": {
          "en": "So, my song, honestly, what do you think?",
          "ko": "그래서 내 노래, 솔직히 어때?"
        }
      },
      {
        "who": "me",
        "text": "Sans vouloir te vexer, le refrain est un peu long. Le reste, j'aime beaucoup.",
        "gloss": {
          "en": "No offence, but the chorus is a bit long. The rest, I really like.",
          "ko": "기분 나빠하지 말고 들어, 후렴이 좀 길어. 나머진 정말 좋아."
        }
      },
      {
        "who": "them",
        "text": "Trop long ? Tu trouves ?",
        "gloss": {
          "en": "Too long? You think so?",
          "ko": "너무 길다고? 그렇게 생각해?"
        }
      },
      {
        "who": "me",
        "text": "Il me semble qu'on pourrait couper la deuxième partie sans rien perdre. Les refrains interminables, ce n'est pas mon truc.",
        "gloss": {
          "en": "It seems to me you could cut the second part without losing anything. Endless choruses aren't my thing.",
          "ko": "두 번째 부분은 잘라도 아무것도 잃지 않을 것 같아. 끝없는 후렴은 내 취향이 아니거든."
        }
      },
      {
        "who": "them",
        "text": "Hmm. C'est ma copine qui l'a écrite, cette partie...",
        "gloss": {
          "en": "Hmm. My girlfriend is the one who wrote that part...",
          "ko": "음. 그 부분은 내 여자친구가 쓴 건데..."
        }
      },
      {
        "who": "me",
        "text": "Ah. Bon, j'aurais mieux fait de me taire, je crois !",
        "gloss": {
          "en": "Ah. Well, I think I'd have done better to keep quiet!",
          "ko": "아. 음, 그냥 입 다물고 있을 걸 그랬네!"
        }
      }
    ]
  }
];
