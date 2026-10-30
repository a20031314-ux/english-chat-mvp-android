import type { StageScript } from "../../stageScripts.ts";

/**
 * fr 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const FR_BANK: StageScript[] = [
  {
    "id": "fr-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a bakery counter",
      "ko": "빵집 계산대에서"
    },
    "expressions": [
      "Bonjour",
      "S'il vous plaît",
      "Merci beaucoup",
      "Bonne journée"
    ],
    "grammar": [
      1,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Vous désirez ?",
        "gloss": {
          "en": "Hello! What would you like?",
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
        "text": "Voilà. Et avec ça ?",
        "gloss": {
          "en": "Here you go. Anything else?",
          "ko": "여기요. 다른 건요?"
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
        "text": "Oui, bien sûr.",
        "gloss": {
          "en": "Yes, of course.",
          "ko": "네, 물론이죠."
        }
      },
      {
        "who": "me",
        "text": "Combien coûte le croissant ?",
        "gloss": {
          "en": "How much is the croissant?",
          "ko": "크루아상은 얼마예요?"
        },
        "frames": [
          "fr-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Un euro vingt.",
        "gloss": {
          "en": "One euro twenty.",
          "ko": "일 유로 이십 센트예요."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Bonne journée !",
        "gloss": {
          "en": "Thank you very much. Have a good day!",
          "ko": "정말 감사합니다. 좋은 하루 보내세요!"
        },
        "frames": [
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b02",
    "stage": 1,
    "bank": true,
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
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서 처음 만남"
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
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir ! Vous êtes nouveau ?",
        "gloss": {
          "en": "Good evening! Are you new?",
          "ko": "안녕하세요! 새로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Bonsoir, je m'appelle Minho.",
        "gloss": {
          "en": "Yes. Good evening, my name is Minho.",
          "ko": "네. 안녕하세요, 저는 민호예요."
        },
        "frames": [
          "fr-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Enchantée, Minho. Moi, c'est Julie. Vous venez d'où ?",
        "gloss": {
          "en": "Nice to meet you, Minho. I'm Julie. Where are you from?",
          "ko": "반가워요, 민호 씨. 저는 쥘리예요. 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Enchanté. Je viens de Corée.",
        "gloss": {
          "en": "Nice to meet you. I come from Korea.",
          "ko": "반가워요. 한국에서 왔어요."
        },
        "frames": [
          "fr-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Et vous êtes étudiant ?",
        "gloss": {
          "en": "And are you a student?",
          "ko": "학생이세요?"
        }
      },
      {
        "who": "me",
        "text": "Non, je suis ingénieur.",
        "gloss": {
          "en": "No, I'm an engineer.",
          "ko": "아니요, 엔지니어예요."
        },
        "frames": [
          "fr-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Ah, super ! Vous travaillez où ?",
        "gloss": {
          "en": "Oh, great! Where do you work?",
          "ko": "아, 멋지네요! 어디서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "Je travaille dans une grande entreprise.",
        "gloss": {
          "en": "I work in a big company.",
          "ko": "큰 회사에서 일해요."
        },
        "frames": [
          "fr-f1-04"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Finding the platform at a train station",
      "ko": "기차역에서 승강장 찾기"
    },
    "expressions": [
      "Pardon",
      "Vous pouvez répéter",
      "S'il vous plaît",
      "D'accord",
      "Merci beaucoup",
      "Au revoir"
    ],
    "grammar": [
      1,
      2,
      5,
      7
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
        "text": "Oui. Où est le quai pour Lyon ?",
        "gloss": {
          "en": "Yes. Where is the platform for Lyon?",
          "ko": "네. 리옹행 승강장이 어디예요?"
        },
        "frames": [
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "C'est le quai sept, à gauche.",
        "gloss": {
          "en": "It's platform seven, on the left.",
          "ko": "칠 번 승강장이에요, 왼쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Pardon ? Vous pouvez répéter, s'il vous plaît ?",
        "gloss": {
          "en": "Sorry? Can you repeat that, please?",
          "ko": "네? 다시 말씀해 주시겠어요?"
        },
        "frames": [
          "fr-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Le quai sept, là-bas, à gauche.",
        "gloss": {
          "en": "Platform seven, over there on the left.",
          "ko": "칠 번 승강장, 저기 왼쪽이요."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Est-ce qu'il y a un café sur le quai ?",
        "gloss": {
          "en": "OK. Is there a café on the platform?",
          "ko": "알겠어요. 승강장에 카페가 있어요?"
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oui, il y a un petit café.",
        "gloss": {
          "en": "Yes, there's a small café.",
          "ko": "네, 작은 카페가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Au revoir !",
        "gloss": {
          "en": "Thank you very much. Goodbye!",
          "ko": "정말 감사합니다. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Getting a table at a restaurant",
      "ko": "식당에서 자리 잡기"
    },
    "expressions": [
      "Bonsoir",
      "Où sont les toilettes",
      "S'il vous plaît"
    ],
    "grammar": [
      1,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir ! Vous êtes combien ?",
        "gloss": {
          "en": "Good evening! How many are you?",
          "ko": "안녕하세요! 몇 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonsoir. Est-ce que vous avez une table pour deux ?",
        "gloss": {
          "en": "Good evening. Do you have a table for two?",
          "ko": "안녕하세요. 두 명 자리 있어요?"
        },
        "frames": [
          "fr-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Oui, bien sûr. En terrasse ou à l'intérieur ?",
        "gloss": {
          "en": "Yes, of course. On the terrace or inside?",
          "ko": "네, 물론이죠. 테라스요, 안쪽이요?"
        }
      },
      {
        "who": "me",
        "text": "En terrasse, s'il vous plaît. J'aime le soleil.",
        "gloss": {
          "en": "On the terrace, please. I like the sun.",
          "ko": "테라스로 주세요. 햇볕을 좋아해요."
        },
        "frames": [
          "fr-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Voilà la carte.",
        "gloss": {
          "en": "Very well. Here's the menu.",
          "ko": "좋아요. 메뉴판 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Où sont les toilettes ?",
        "gloss": {
          "en": "Thank you. Where are the toilets?",
          "ko": "고마워요. 화장실이 어디예요?"
        }
      },
      {
        "who": "them",
        "text": "Au fond, à droite.",
        "gloss": {
          "en": "At the back, on the right.",
          "ko": "안쪽 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Je voudrais une carafe d'eau, s'il vous plaît.",
        "gloss": {
          "en": "Thanks. I'd like a jug of water, please.",
          "ko": "고마워요. 물 한 병 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A phone call with a friend",
      "ko": "친구와 전화 통화"
    },
    "expressions": [
      "Salut",
      "Ça va"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allô ?",
        "gloss": {
          "en": "Hello?",
          "ko": "여보세요?"
        }
      },
      {
        "who": "me",
        "text": "Salut, Camille ! Ça va ?",
        "gloss": {
          "en": "Hi, Camille! How are you?",
          "ko": "안녕, 카미유! 잘 지내?"
        },
        "frames": [
          "fr-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Ça va bien, merci. Et toi ? Tu es où ?",
        "gloss": {
          "en": "I'm fine, thanks. And you? Where are you?",
          "ko": "잘 지내, 고마워. 너는? 어디야?"
        }
      },
      {
        "who": "me",
        "text": "Ça va. Je suis à la gare.",
        "gloss": {
          "en": "I'm fine. I'm at the station.",
          "ko": "잘 지내. 나 역에 있어."
        },
        "frames": [
          "fr-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Tu pars en vacances ?",
        "gloss": {
          "en": "Oh really? Are you going on holiday?",
          "ko": "아 그래? 휴가 가?"
        }
      },
      {
        "who": "me",
        "text": "Non, j'ai un rendez-vous à Lille.",
        "gloss": {
          "en": "No, I have an appointment in Lille.",
          "ko": "아니, 릴에서 약속이 있어."
        },
        "frames": [
          "fr-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Bon voyage !",
        "gloss": {
          "en": "OK. Have a good trip!",
          "ko": "그렇구나. 잘 다녀와!"
        }
      },
      {
        "who": "me",
        "text": "Merci pour l'appel. Bonne soirée !",
        "gloss": {
          "en": "Thanks for the call. Have a good evening!",
          "ko": "전화 고마워. 좋은 저녁 보내!"
        },
        "frames": [
          "fr-f1-15",
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking for medicine at a pharmacy",
      "ko": "약국에서 약 사기"
    },
    "expressions": [
      "Pardon",
      "Je ne comprends pas"
    ],
    "grammar": [
      1,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour. Je peux vous aider ?",
        "gloss": {
          "en": "Hello. Can I help you?",
          "ko": "안녕하세요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Est-ce que vous avez de l'aspirine ?",
        "gloss": {
          "en": "Hello. Do you have any aspirin?",
          "ko": "안녕하세요. 아스피린 있어요?"
        },
        "frames": [
          "fr-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Oui. Vous avez une ordonnance ?",
        "gloss": {
          "en": "Yes. Do you have a prescription?",
          "ko": "네. 처방전 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Pardon, je ne comprends pas ce mot.",
        "gloss": {
          "en": "Sorry, I don't understand that word.",
          "ko": "죄송해요, 그 단어를 모르겠어요."
        },
        "frames": [
          "fr-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Une ordonnance, c'est un papier du médecin.",
        "gloss": {
          "en": "A prescription is a paper from the doctor.",
          "ko": "처방전은 의사가 주는 종이예요."
        }
      },
      {
        "who": "me",
        "text": "Ah, non. Je n'ai pas d'ordonnance.",
        "gloss": {
          "en": "Ah, no. I don't have a prescription.",
          "ko": "아, 아니요. 처방전은 없어요."
        }
      },
      {
        "who": "them",
        "text": "Pas de problème. Voilà.",
        "gloss": {
          "en": "No problem. Here you are.",
          "ko": "괜찮아요. 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Combien coûte la boîte ?",
        "gloss": {
          "en": "How much is the box?",
          "ko": "한 통에 얼마예요?"
        },
        "frames": [
          "fr-f1-09"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at an outdoor market",
      "ko": "시장에서 과일 사기"
    },
    "expressions": [
      "Combien ça coûte",
      "D'accord",
      "Je voudrais",
      "S'il vous plaît",
      "Bonne journée"
    ],
    "grammar": [
      2,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Elles sont belles, mes fraises !",
        "gloss": {
          "en": "Hello! My strawberries are lovely!",
          "ko": "안녕하세요! 딸기 좋아요!"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Combien ça coûte ?",
        "gloss": {
          "en": "Hello. How much is it?",
          "ko": "안녕하세요. 얼마예요?"
        }
      },
      {
        "who": "them",
        "text": "Quatre euros la barquette.",
        "gloss": {
          "en": "Four euros a punnet.",
          "ko": "한 팩에 사 유로예요."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Je voudrais deux barquettes, s'il vous plaît.",
        "gloss": {
          "en": "OK. I'd like two punnets, please.",
          "ko": "좋아요. 두 팩 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Voilà. Vous aimez les cerises aussi ?",
        "gloss": {
          "en": "Here you are. Do you like cherries too?",
          "ko": "여기요. 체리도 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "Non, je n'aime pas les cerises.",
        "gloss": {
          "en": "No, I don't like cherries.",
          "ko": "아니요, 체리는 안 좋아해요."
        },
        "frames": [
          "fr-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème. Huit euros, s'il vous plaît.",
        "gloss": {
          "en": "No problem. Eight euros, please.",
          "ko": "괜찮아요. 팔 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Voilà. Merci, et bonne journée !",
        "gloss": {
          "en": "Here you are. Thanks, and have a good day!",
          "ko": "여기요. 고마워요, 좋은 하루 보내세요!"
        },
        "frames": [
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "Bonsoir",
      "Merci beaucoup"
    ],
    "grammar": [
      1,
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir, bienvenue à l'hôtel.",
        "gloss": {
          "en": "Good evening, welcome to the hotel.",
          "ko": "안녕하세요, 호텔에 오신 걸 환영해요."
        }
      },
      {
        "who": "me",
        "text": "Bonsoir. J'ai une réservation.",
        "gloss": {
          "en": "Good evening. I have a reservation.",
          "ko": "안녕하세요. 예약했어요."
        },
        "frames": [
          "fr-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Vous avez votre passeport ?",
        "gloss": {
          "en": "Very well. Do you have your passport?",
          "ko": "좋아요. 여권 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, voilà. Est-ce qu'il y a le wifi dans la chambre ?",
        "gloss": {
          "en": "Yes, here. Is there wifi in the room?",
          "ko": "네, 여기요. 방에 와이파이가 있어요?"
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oui, le code est sur la carte.",
        "gloss": {
          "en": "Yes, the code is on the card.",
          "ko": "네, 비밀번호는 카드에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Où est l'ascenseur ?",
        "gloss": {
          "en": "Thank you. Where is the lift?",
          "ko": "고마워요. 엘리베이터는 어디예요?"
        },
        "frames": [
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Juste là, à droite. Bonne soirée !",
        "gloss": {
          "en": "Right there, on the right. Have a good evening!",
          "ko": "바로 저기 오른쪽이에요. 좋은 저녁 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Bonne nuit !",
        "gloss": {
          "en": "Thank you very much. Good night!",
          "ko": "정말 고마워요. 안녕히 주무세요!"
        },
        "frames": [
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way in the street",
      "ko": "길에서 길 묻기"
    },
    "expressions": [
      "Excusez-moi",
      "Plus lentement",
      "S'il vous plaît",
      "D'accord",
      "Au revoir"
    ],
    "grammar": [
      1,
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
        "text": "Excusez-moi. Où est la station de métro ?",
        "gloss": {
          "en": "Excuse me. Where is the metro station?",
          "ko": "실례합니다. 지하철역이 어디예요?"
        },
        "frames": [
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "C'est tout droit, puis à gauche, après la boulangerie.",
        "gloss": {
          "en": "It's straight ahead, then left, after the bakery.",
          "ko": "쭉 가다가 빵집 지나서 왼쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Vous pouvez parler plus lentement, s'il vous plaît ? Je ne parle pas bien français.",
        "gloss": {
          "en": "Can you speak more slowly, please? I don't speak French well.",
          "ko": "좀 더 천천히 말씀해 주시겠어요? 프랑스어를 잘 못해요."
        },
        "frames": [
          "fr-f1-13",
          "fr-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr. Tout droit, puis à gauche.",
        "gloss": {
          "en": "Of course. Straight ahead, then left.",
          "ko": "물론이죠. 쭉 가다가 왼쪽이요."
        }
      },
      {
        "who": "me",
        "text": "D'accord, merci pour l'aide !",
        "gloss": {
          "en": "OK, thanks for the help!",
          "ko": "알겠어요, 도와주셔서 고마워요!"
        },
        "frames": [
          "fr-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "De rien. Bonne journée !",
        "gloss": {
          "en": "You're welcome. Have a good day!",
          "ko": "천만에요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Vous aussi. Au revoir !",
        "gloss": {
          "en": "You too. Goodbye!",
          "ko": "당신도요. 안녕히 가세요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering tea and cake at a café",
      "ko": "카페에서 차와 케이크 주문"
    },
    "expressions": [
      "Je voudrais",
      "S'il vous plaît"
    ],
    "grammar": [
      1,
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Qu'est-ce que vous prenez ?",
        "gloss": {
          "en": "Hello! What are you having?",
          "ko": "안녕하세요! 뭐 드시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Je voudrais un thé, s'il vous plaît.",
        "gloss": {
          "en": "Hello. I'd like a tea, please.",
          "ko": "안녕하세요. 차 한 잔 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Un thé vert ou un thé noir ?",
        "gloss": {
          "en": "Green tea or black tea?",
          "ko": "녹차요, 홍차요?"
        }
      },
      {
        "who": "me",
        "text": "Un thé vert. Je n'aime pas le thé noir.",
        "gloss": {
          "en": "Green tea. I don't like black tea.",
          "ko": "녹차요. 홍차는 안 좋아해요."
        },
        "frames": [
          "fr-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Et un gâteau avec ça ?",
        "gloss": {
          "en": "OK. And a cake with that?",
          "ko": "네. 케이크도 같이 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! J'aime le chocolat. Est-ce que vous avez un gâteau au chocolat ?",
        "gloss": {
          "en": "Yes! I like chocolate. Do you have a chocolate cake?",
          "ko": "네! 초콜릿을 좋아해요. 초콜릿 케이크 있어요?"
        },
        "frames": [
          "fr-f1-11",
          "fr-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Oui, il est délicieux.",
        "gloss": {
          "en": "Yes, it's delicious.",
          "ko": "네, 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Parfait, merci !",
        "gloss": {
          "en": "Perfect, thanks!",
          "ko": "좋아요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day of French class",
      "ko": "프랑스어 수업 첫날"
    },
    "expressions": [
      "D'accord"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Tu es dans la classe de français ?",
        "gloss": {
          "en": "Hi! Are you in the French class?",
          "ko": "안녕! 프랑스어 수업 들어?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Je suis étudiant. Je viens de Corée.",
        "gloss": {
          "en": "Yes. I'm a student. I come from Korea.",
          "ko": "응. 나 학생이야. 한국에서 왔어."
        },
        "frames": [
          "fr-f1-03",
          "fr-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Moi, je viens d'Espagne. Tu aimes le français ?",
        "gloss": {
          "en": "I come from Spain. Do you like French?",
          "ko": "나는 스페인에서 왔어. 프랑스어 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'aime le français, mais je ne comprends pas la grammaire.",
        "gloss": {
          "en": "Yes, I like French, but I don't understand the grammar.",
          "ko": "응, 프랑스어 좋아해. 그런데 문법은 이해가 안 돼."
        },
        "frames": [
          "fr-f1-11",
          "fr-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Moi non plus ! C'est difficile.",
        "gloss": {
          "en": "Me neither! It's hard.",
          "ko": "나도 그래! 어려워."
        }
      },
      {
        "who": "me",
        "text": "Est-ce qu'il y a un livre pour la classe ?",
        "gloss": {
          "en": "Is there a book for the class?",
          "ko": "수업용 책이 있어?"
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oui, il est à la bibliothèque.",
        "gloss": {
          "en": "Yes, it's in the library.",
          "ko": "응, 도서관에 있어."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Merci !",
        "gloss": {
          "en": "OK. Thanks!",
          "ko": "알겠어. 고마워!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the lost and found office",
      "ko": "분실물 센터에서"
    },
    "expressions": [
      "Merci beaucoup",
      "Bonne journée"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour. C'est pour quoi ?",
        "gloss": {
          "en": "Hello. What is it about?",
          "ko": "안녕하세요. 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Est-ce qu'il y a un sac noir ici ? Je n'ai pas mon sac.",
        "gloss": {
          "en": "Hello. Is there a black bag here? I don't have my bag.",
          "ko": "안녕하세요. 여기 검은 가방 있어요? 가방을 잃어버렸어요."
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Un sac noir ? Il y a deux sacs noirs.",
        "gloss": {
          "en": "A black bag? There are two black bags.",
          "ko": "검은 가방이요? 검은 가방이 두 개 있어요."
        }
      },
      {
        "who": "me",
        "text": "J'ai une photo du sac.",
        "gloss": {
          "en": "I have a photo of the bag.",
          "ko": "가방 사진이 있어요."
        },
        "frames": [
          "fr-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Ah, voilà ! C'est votre sac ?",
        "gloss": {
          "en": "Ah, here it is! Is this your bag?",
          "ko": "아, 여기 있네요! 이 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! Merci beaucoup !",
        "gloss": {
          "en": "Yes! Thank you very much!",
          "ko": "네! 정말 감사합니다!"
        }
      },
      {
        "who": "them",
        "text": "De rien. Bonne journée !",
        "gloss": {
          "en": "You're welcome. Have a good day!",
          "ko": "천만에요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Merci pour l'aide. Bonne journée !",
        "gloss": {
          "en": "Thanks for the help. Have a good day!",
          "ko": "도와주셔서 고마워요. 좋은 하루 보내세요!"
        },
        "frames": [
          "fr-f1-15",
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "Pardon",
      "Je ne comprends pas",
      "Vous pouvez répéter",
      "S'il vous plaît",
      "D'accord",
      "Où sont les toilettes"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour. Vous avez rendez-vous ?",
        "gloss": {
          "en": "Hello. Do you have an appointment?",
          "ko": "안녕하세요. 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'ai un rendez-vous à dix heures.",
        "gloss": {
          "en": "Yes, I have an appointment at ten.",
          "ko": "네, 열 시에 예약했어요."
        },
        "frames": [
          "fr-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Vous avez votre carte Vitale ?",
        "gloss": {
          "en": "Very well. Do you have your health insurance card?",
          "ko": "좋아요. 건강보험 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Pardon, je ne comprends pas. Vous pouvez répéter, s'il vous plaît ?",
        "gloss": {
          "en": "Sorry, I don't understand. Can you repeat that, please?",
          "ko": "죄송해요, 이해가 안 돼요. 다시 말씀해 주시겠어요?"
        },
        "frames": [
          "fr-f1-18",
          "fr-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Votre carte de santé.",
        "gloss": {
          "en": "Your health card.",
          "ko": "건강보험 카드요."
        }
      },
      {
        "who": "me",
        "text": "Ah, d'accord. Je suis touriste. Je n'ai pas de carte.",
        "gloss": {
          "en": "Ah, OK. I'm a tourist. I don't have a card.",
          "ko": "아, 네. 저는 관광객이에요. 카드가 없어요."
        },
        "frames": [
          "fr-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème. Asseyez-vous là-bas.",
        "gloss": {
          "en": "No problem. Have a seat over there.",
          "ko": "괜찮아요. 저쪽에 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Où sont les toilettes ?",
        "gloss": {
          "en": "Thank you. Where are the toilets?",
          "ko": "고마워요. 화장실이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "fr-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Small talk about the weather with a neighbor",
      "ko": "이웃과 날씨 이야기"
    },
    "expressions": [
      "Bonne journée"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Il fait beau aujourd'hui !",
        "gloss": {
          "en": "Hello! It's lovely today!",
          "ko": "안녕하세요! 오늘 날씨 좋네요!"
        }
      },
      {
        "who": "me",
        "text": "Oui ! J'aime le soleil.",
        "gloss": {
          "en": "Yes! I like the sun.",
          "ko": "네! 햇볕이 좋아요."
        },
        "frames": [
          "fr-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Vous êtes en vacances ?",
        "gloss": {
          "en": "Are you on holiday?",
          "ko": "휴가 중이세요?"
        }
      },
      {
        "who": "me",
        "text": "Non, je travaille à la maison aujourd'hui.",
        "gloss": {
          "en": "No, I'm working from home today.",
          "ko": "아니요, 오늘은 집에서 일해요."
        },
        "frames": [
          "fr-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Ah, c'est bien. Moi, j'adore l'été.",
        "gloss": {
          "en": "Ah, that's nice. I love summer.",
          "ko": "아, 좋네요. 저는 여름이 정말 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Moi aussi. Je n'aime pas la pluie.",
        "gloss": {
          "en": "Me too. I don't like the rain.",
          "ko": "저도요. 비는 싫어요."
        },
        "frames": [
          "fr-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Moi non plus ! Bonne journée !",
        "gloss": {
          "en": "Me neither! Have a good day!",
          "ko": "저도요! 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Merci, bonne journée !",
        "gloss": {
          "en": "Thanks, have a good day!",
          "ko": "고마워요, 좋은 하루 보내세요!"
        },
        "frames": [
          "fr-f1-19"
        ]
      }
    ]
  },
  {
    "id": "fr-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a sweater in a clothes shop",
      "ko": "옷가게에서 스웨터 사기"
    },
    "expressions": [
      "D'accord",
      "S'il vous plaît"
    ],
    "grammar": [
      1,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Je peux vous aider ?",
        "gloss": {
          "en": "Hello! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Est-ce que vous avez ce pull en bleu ?",
        "gloss": {
          "en": "Yes. Do you have this sweater in blue?",
          "ko": "네. 이 스웨터 파란색 있어요?"
        },
        "frames": [
          "fr-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Oui, voilà. En taille M.",
        "gloss": {
          "en": "Yes, here. In size M.",
          "ko": "네, 여기요. M 사이즈예요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Combien coûte le pull ?",
        "gloss": {
          "en": "Thanks. How much is the sweater?",
          "ko": "고마워요. 스웨터 얼마예요?"
        },
        "frames": [
          "fr-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Quarante euros.",
        "gloss": {
          "en": "Forty euros.",
          "ko": "사십 유로예요."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Je voudrais le pull bleu, s'il vous plaît.",
        "gloss": {
          "en": "OK. I'd like the blue sweater, please.",
          "ko": "좋아요. 파란 스웨터로 주세요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Vous payez par carte ?",
        "gloss": {
          "en": "Very well. Are you paying by card?",
          "ko": "좋아요. 카드로 결제하세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, par carte. Merci !",
        "gloss": {
          "en": "Yes, by card. Thanks!",
          "ko": "네, 카드로요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a friend at the airport",
      "ko": "공항에서 친구 만나기"
    },
    "expressions": [
      "Salut",
      "Ça va",
      "D'accord"
    ],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allô, salut ! Tu es où ?",
        "gloss": {
          "en": "Hello, hi! Where are you?",
          "ko": "여보세요, 안녕! 어디야?"
        }
      },
      {
        "who": "me",
        "text": "Salut, Thomas ! Ça va ? Je suis à l'aéroport.",
        "gloss": {
          "en": "Hi, Thomas! How are you? I'm at the airport.",
          "ko": "안녕, 토마! 잘 지내? 나 공항이야."
        },
        "frames": [
          "fr-f1-14",
          "fr-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Super ! Moi, je suis au café, au premier étage.",
        "gloss": {
          "en": "Great! I'm at the café on the first floor.",
          "ko": "좋아! 나는 이 층 카페에 있어."
        }
      },
      {
        "who": "me",
        "text": "Où est le café ? Je ne comprends pas le plan.",
        "gloss": {
          "en": "Where is the café? I don't understand the map.",
          "ko": "카페가 어디야? 안내도를 모르겠어."
        },
        "frames": [
          "fr-f1-08",
          "fr-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "Prends l'ascenseur, c'est à droite.",
        "gloss": {
          "en": "Take the lift, it's on the right.",
          "ko": "엘리베이터 타. 오른쪽이야."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Merci pour l'aide !",
        "gloss": {
          "en": "OK. Thanks for the help!",
          "ko": "알겠어. 도와줘서 고마워!"
        },
        "frames": [
          "fr-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "À tout de suite !",
        "gloss": {
          "en": "See you in a moment!",
          "ko": "이따 봐!"
        }
      },
      {
        "who": "me",
        "text": "À tout de suite !",
        "gloss": {
          "en": "See you in a moment!",
          "ko": "이따 봐!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking staff in a supermarket",
      "ko": "마트에서 직원에게 묻기"
    },
    "expressions": [
      "Pardon",
      "Plus lentement",
      "S'il vous plaît",
      "Merci beaucoup"
    ],
    "grammar": [
      1,
      2,
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, vous cherchez quelque chose ?",
        "gloss": {
          "en": "Hello, are you looking for something?",
          "ko": "안녕하세요, 뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Est-ce qu'il y a du lait sans lactose ?",
        "gloss": {
          "en": "Yes. Is there any lactose-free milk?",
          "ko": "네. 락토프리 우유 있어요?"
        },
        "frames": [
          "fr-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Oui, au rayon frais, là-bas.",
        "gloss": {
          "en": "Yes, in the chilled section, over there.",
          "ko": "네, 저기 냉장 코너에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Et où est le riz ?",
        "gloss": {
          "en": "Thanks. And where is the rice?",
          "ko": "고마워요. 쌀은 어디 있어요?"
        },
        "frames": [
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Le riz est au rayon trois, à côté des pâtes.",
        "gloss": {
          "en": "The rice is in aisle three, next to the pasta.",
          "ko": "쌀은 삼 번 코너, 파스타 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Pardon, je ne parle pas bien français. Plus lentement, s'il vous plaît.",
        "gloss": {
          "en": "Sorry, I don't speak French well. More slowly, please.",
          "ko": "죄송해요, 프랑스어를 잘 못해요. 좀 더 천천히 말씀해 주세요."
        },
        "frames": [
          "fr-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème. Le riz... rayon trois.",
        "gloss": {
          "en": "No problem. The rice... aisle three.",
          "ko": "괜찮아요. 쌀은... 삼 번 코너요."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup !",
        "gloss": {
          "en": "Thank you very much!",
          "ko": "정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Arriving for dinner at a friend's home",
      "ko": "친구 집 저녁 초대"
    },
    "expressions": [
      "Salut",
      "Ça va",
      "De rien"
    ],
    "grammar": [
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Entre, entre ! Bienvenue !",
        "gloss": {
          "en": "Come in, come in! Welcome!",
          "ko": "들어와, 들어와! 어서 와!"
        }
      },
      {
        "who": "me",
        "text": "Salut, Léa ! Ça va ? Merci pour l'invitation.",
        "gloss": {
          "en": "Hi, Léa! How are you? Thanks for the invitation.",
          "ko": "안녕, 레아! 잘 지내? 초대해 줘서 고마워."
        },
        "frames": [
          "fr-f1-14",
          "fr-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Ça va très bien. Tu aimes la cuisine française ?",
        "gloss": {
          "en": "I'm very well. Do you like French food?",
          "ko": "아주 잘 지내. 프랑스 음식 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'aime beaucoup la cuisine française.",
        "gloss": {
          "en": "Yes, I like French food a lot.",
          "ko": "응, 프랑스 음식 정말 좋아해."
        },
        "frames": [
          "fr-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Super ! J'ai fait un gratin.",
        "gloss": {
          "en": "Great! I made a gratin.",
          "ko": "잘됐다! 그라탱 만들었어."
        }
      },
      {
        "who": "me",
        "text": "Mmm, ça sent bon ! J'ai un dessert pour toi.",
        "gloss": {
          "en": "Mmm, it smells good! I have a dessert for you.",
          "ko": "음, 냄새 좋다! 너 주려고 디저트 가져왔어."
        },
        "frames": [
          "fr-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Oh, merci ! C'est gentil.",
        "gloss": {
          "en": "Oh, thanks! That's kind.",
          "ko": "오, 고마워! 고마운걸."
        }
      },
      {
        "who": "me",
        "text": "De rien !",
        "gloss": {
          "en": "You're welcome!",
          "ko": "별말을!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Sending a parcel at the post office",
      "ko": "우체국에서 소포 보내기"
    },
    "expressions": [
      "S'il vous plaît",
      "Merci beaucoup",
      "Au revoir"
    ],
    "grammar": [
      1,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, c'est pour un colis ?",
        "gloss": {
          "en": "Hello, is it for a parcel?",
          "ko": "안녕하세요, 소포 보내세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Je voudrais envoyer ce colis en Corée, s'il vous plaît.",
        "gloss": {
          "en": "Yes. I'd like to send this parcel to Korea, please.",
          "ko": "네. 이 소포를 한국에 보내고 싶어요."
        },
        "frames": [
          "fr-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Rapide ou normal ?",
        "gloss": {
          "en": "OK. Express or standard?",
          "ko": "네. 빠른 우편이요, 보통이요?"
        }
      },
      {
        "who": "me",
        "text": "Combien coûte l'envoi rapide ?",
        "gloss": {
          "en": "How much is express delivery?",
          "ko": "빠른 우편은 얼마예요?"
        },
        "frames": [
          "fr-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Trente-cinq euros.",
        "gloss": {
          "en": "Thirty-five euros.",
          "ko": "삼십오 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Normal, s'il vous plaît. Est-ce que vous avez une boîte ?",
        "gloss": {
          "en": "Standard, please. Do you have a box?",
          "ko": "보통으로 할게요. 상자 있어요?"
        },
        "frames": [
          "fr-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Oui, voilà une boîte.",
        "gloss": {
          "en": "Yes, here's a box.",
          "ko": "네, 상자 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Au revoir !",
        "gloss": {
          "en": "Thank you very much. Goodbye!",
          "ko": "정말 감사합니다. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "fr-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a new colleague at the office",
      "ko": "회사에서 새 동료 만나기"
    },
    "expressions": [
      "Je viens de Corée",
      "Merci beaucoup"
    ],
    "grammar": [
      0,
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Tu es le nouveau collègue ?",
        "gloss": {
          "en": "Hi! Are you the new colleague?",
          "ko": "안녕하세요! 새로 온 동료예요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, bonjour ! Je suis développeur.",
        "gloss": {
          "en": "Yes, hello! I'm a developer.",
          "ko": "네, 안녕하세요! 저는 개발자예요."
        },
        "frames": [
          "fr-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Bienvenue ! Tu viens d'où ?",
        "gloss": {
          "en": "Welcome! Where are you from?",
          "ko": "환영해요! 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Je viens de Corée, mais je suis à Paris depuis un mois.",
        "gloss": {
          "en": "I come from Korea, but I've been in Paris for a month.",
          "ko": "한국에서 왔는데, 파리에 온 지 한 달 됐어요."
        },
        "frames": [
          "fr-f1-02",
          "fr-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Super. Tu as des questions ?",
        "gloss": {
          "en": "Great. Do you have any questions?",
          "ko": "좋네요. 궁금한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'ai une question. Où est la salle de réunion ?",
        "gloss": {
          "en": "Yes, I have a question. Where is the meeting room?",
          "ko": "네, 질문이 하나 있어요. 회의실이 어디예요?"
        },
        "frames": [
          "fr-f1-17",
          "fr-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Au fond du couloir, à gauche.",
        "gloss": {
          "en": "At the end of the corridor, on the left.",
          "ko": "복도 끝 왼쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "D'accord, merci beaucoup !",
        "gloss": {
          "en": "OK, thank you very much!",
          "ko": "알겠어요, 정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday chat with a colleague about the weekend",
      "ko": "월요일에 동료와 주말 이야기"
    },
    "expressions": [
      "Avec plaisir"
    ],
    "grammar": [
      0,
      1,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Tu as passé un bon week-end ?",
        "gloss": {
          "en": "Hi! Did you have a good weekend?",
          "ko": "안녕! 주말 잘 보냈어?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! Samedi, je suis allé au marché avec ma sœur.",
        "gloss": {
          "en": "Yes! On Saturday I went to the market with my sister.",
          "ko": "응! 토요일에 여동생이랑 시장에 갔어."
        },
        "frames": [
          "fr-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Sympa ! Et dimanche ?",
        "gloss": {
          "en": "Nice! And Sunday?",
          "ko": "좋았겠다! 일요일은?"
        }
      },
      {
        "who": "me",
        "text": "Dimanche, je suis resté à la maison parce que j'ai eu un rhume.",
        "gloss": {
          "en": "On Sunday I stayed home because I had a cold.",
          "ko": "일요일엔 감기에 걸려서 집에 있었어."
        },
        "frames": [
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Oh, ça va mieux ?",
        "gloss": {
          "en": "Oh, are you feeling better?",
          "ko": "아, 좀 나아졌어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, ça va. Hier, j'ai bien dormi.",
        "gloss": {
          "en": "Yes, I'm fine. Yesterday I slept well.",
          "ko": "응, 괜찮아. 어제 푹 잤어."
        },
        "frames": [
          "fr-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Super. Ça te dit de déjeuner ensemble aujourd'hui ?",
        "gloss": {
          "en": "Great. Do you fancy having lunch together today?",
          "ko": "잘됐다. 오늘 같이 점심 먹을래?"
        }
      },
      {
        "who": "me",
        "text": "Avec plaisir ! On se retrouve à midi ?",
        "gloss": {
          "en": "With pleasure! Shall we meet at noon?",
          "ko": "좋아! 열두 시에 만날까?"
        },
        "frames": [
          "fr-f2-11"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a bistro",
      "ko": "비스트로에서 저녁 주문"
    },
    "expressions": [
      "Pas encore",
      "Qu'est-ce que vous conseillez",
      "Je n'aime pas trop",
      "L'addition"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir. Vous avez choisi ?",
        "gloss": {
          "en": "Good evening. Have you decided?",
          "ko": "안녕하세요. 고르셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Pas encore. Qu'est-ce que vous conseillez comme plat ?",
        "gloss": {
          "en": "Not yet. What main course do you recommend?",
          "ko": "아직이요. 요리는 뭘 추천하세요?"
        },
        "frames": [
          "fr-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Le canard est très bon ce soir.",
        "gloss": {
          "en": "The duck is very good tonight.",
          "ko": "오늘 저녁엔 오리 요리가 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, je n'aime pas trop le canard. Je vais prendre le poisson.",
        "gloss": {
          "en": "Hmm, I'm not very keen on duck. I'll have the fish.",
          "ko": "음, 오리는 별로 안 좋아해요. 생선으로 할게요."
        },
        "frames": [
          "fr-f2-17",
          "fr-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Et comme boisson ?",
        "gloss": {
          "en": "Very well. And to drink?",
          "ko": "좋아요. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Je vais prendre une eau gazeuse, s'il vous plaît.",
        "gloss": {
          "en": "I'll have a sparkling water, please.",
          "ko": "탄산수로 주세요."
        },
        "frames": [
          "fr-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Parfait. Autre chose ?",
        "gloss": {
          "en": "Perfect. Anything else?",
          "ko": "좋아요. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "Non, merci. Et à la fin, l'addition, s'il vous plaît.",
        "gloss": {
          "en": "No, thanks. And at the end, the bill, please.",
          "ko": "아니요, 괜찮아요. 다 먹고 나면 계산서 주세요."
        }
      }
    ]
  },
  {
    "id": "fr-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor about a headache",
      "ko": "두통으로 진료 받기"
    },
    "expressions": [
      "J'ai mal à la tête",
      "Un peu"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour. Qu'est-ce qui ne va pas ?",
        "gloss": {
          "en": "Hello. What's wrong?",
          "ko": "안녕하세요. 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour, docteur. J'ai mal à la tête depuis hier.",
        "gloss": {
          "en": "Hello, doctor. I've had a headache since yesterday.",
          "ko": "안녕하세요, 선생님. 어제부터 머리가 아파요."
        },
        "frames": [
          "fr-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Vous avez de la fièvre ?",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열이 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Un peu. Et j'ai mal au ventre aussi.",
        "gloss": {
          "en": "A little. And I have a stomach ache too.",
          "ko": "조금요. 배도 아파요."
        },
        "frames": [
          "fr-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Vous avez mangé quelque chose de spécial ?",
        "gloss": {
          "en": "Did you eat anything unusual?",
          "ko": "특별한 걸 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, hier, j'ai mangé des huîtres au restaurant.",
        "gloss": {
          "en": "Yes, yesterday I ate oysters at a restaurant.",
          "ko": "네, 어제 식당에서 굴을 먹었어요."
        },
        "frames": [
          "fr-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Ah, je vois. Reposez-vous deux jours.",
        "gloss": {
          "en": "Ah, I see. Rest for two days.",
          "ko": "아, 그렇군요. 이틀 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Je peux aller au travail demain ?",
        "gloss": {
          "en": "OK. Can I go to work tomorrow?",
          "ko": "알겠어요. 내일 출근해도 돼요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a friend to the cinema",
      "ko": "친구에게 영화 보자고 하기"
    },
    "expressions": [
      "Ça te dit",
      "À quelle heure",
      "Ça marche"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Tu fais quoi ce soir ?",
        "gloss": {
          "en": "Hi! What are you doing tonight?",
          "ko": "안녕! 오늘 저녁에 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Rien de spécial. Ça te dit de voir un film au cinéma ?",
        "gloss": {
          "en": "Nothing special. Do you fancy seeing a film at the cinema?",
          "ko": "별일 없어. 영화관에서 영화 볼래?"
        },
        "frames": [
          "fr-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Bonne idée ! Il y a un nouveau film d'action.",
        "gloss": {
          "en": "Good idea! There's a new action film.",
          "ko": "좋아! 새 액션 영화 나왔어."
        }
      },
      {
        "who": "me",
        "text": "J'adore les films d'action ! À quelle heure ?",
        "gloss": {
          "en": "I love action films! What time?",
          "ko": "액션 영화 정말 좋아해! 몇 시야?"
        },
        "frames": [
          "fr-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Il y a une séance à vingt heures.",
        "gloss": {
          "en": "There's a showing at eight.",
          "ko": "여덟 시에 상영이 있어."
        }
      },
      {
        "who": "me",
        "text": "Ça marche. On se retrouve devant le cinéma ?",
        "gloss": {
          "en": "Sounds good. Shall we meet in front of the cinema?",
          "ko": "좋아. 영화관 앞에서 만날까?"
        },
        "frames": [
          "fr-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Oui, à vingt heures moins le quart.",
        "gloss": {
          "en": "Yes, at a quarter to eight.",
          "ko": "응, 일곱 시 사십오 분에."
        }
      },
      {
        "who": "me",
        "text": "Parfait. Je vais acheter les billets en ligne.",
        "gloss": {
          "en": "Perfect. I'm going to buy the tickets online.",
          "ko": "좋아. 내가 표는 인터넷으로 살게."
        },
        "frames": [
          "fr-f2-03"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a winter coat",
      "ko": "겨울 코트 사기"
    },
    "expressions": [],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Vous cherchez quelque chose ?",
        "gloss": {
          "en": "Hello! Are you looking for something?",
          "ko": "안녕하세요! 뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je veux acheter un manteau pour l'hiver.",
        "gloss": {
          "en": "Yes, I want to buy a coat for the winter.",
          "ko": "네, 겨울 코트를 사고 싶어요."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Celui-ci est très chaud. Vous voulez l'essayer ?",
        "gloss": {
          "en": "This one is very warm. Do you want to try it on?",
          "ko": "이게 아주 따뜻해요. 입어 보실래요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Je peux l'essayer où ?",
        "gloss": {
          "en": "Yes. Where can I try it on?",
          "ko": "네. 어디서 입어 볼 수 있어요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Au fond, à droite. Alors, il vous va bien ? Il coûte quatre-vingts euros.",
        "gloss": {
          "en": "At the back, on the right. So, does it suit you? It costs eighty euros.",
          "ko": "안쪽 오른쪽이에요. 어때요, 잘 맞아요? 팔십 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Il est parfait. Ce manteau ? Je le prends.",
        "gloss": {
          "en": "It's perfect. This coat? I'll take it.",
          "ko": "딱 좋아요. 이 코트요? 이걸로 할게요."
        },
        "frames": [
          "fr-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. Vous payez comment ?",
        "gloss": {
          "en": "Very well. How are you paying?",
          "ko": "좋아요. 어떻게 결제하세요?"
        }
      },
      {
        "who": "me",
        "text": "Par carte. Je peux payer sans contact ?",
        "gloss": {
          "en": "By card. Can I pay contactless?",
          "ko": "카드로요. 비접촉 결제 돼요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost in the metro, calling a friend",
      "ko": "지하철에서 길을 잃고 친구에게 전화"
    },
    "expressions": [
      "Je suis désolé",
      "Je me suis perdu"
    ],
    "grammar": [
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allô ? Tu es où ? On t'attend !",
        "gloss": {
          "en": "Hello? Where are you? We're waiting for you!",
          "ko": "여보세요? 어디야? 우리 기다리고 있어!"
        }
      },
      {
        "who": "me",
        "text": "Je suis désolé, je me suis perdu dans le métro.",
        "gloss": {
          "en": "I'm sorry, I got lost in the metro.",
          "ko": "미안해, 지하철에서 길을 잃었어."
        },
        "frames": [
          "fr-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Oh non ! Tu es à quelle station ?",
        "gloss": {
          "en": "Oh no! Which station are you at?",
          "ko": "어떡해! 무슨 역이야?"
        }
      },
      {
        "who": "me",
        "text": "Je suis à Bastille, je crois.",
        "gloss": {
          "en": "I'm at Bastille, I think.",
          "ko": "바스티유역인 것 같아."
        },
        "frames": [
          "fr-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Prends la ligne un, direction La Défense.",
        "gloss": {
          "en": "OK. Take line one towards La Défense.",
          "ko": "알았어. 일 호선 타고 라데팡스 방향으로 가."
        }
      },
      {
        "who": "me",
        "text": "Tu peux répéter ? Je veux noter.",
        "gloss": {
          "en": "Can you repeat that? I want to write it down.",
          "ko": "다시 말해 줄래? 적어 둘게."
        },
        "frames": [
          "fr-f2-06",
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Ligne un, direction La Défense. Descends à Concorde.",
        "gloss": {
          "en": "Line one, towards La Défense. Get off at Concorde.",
          "ko": "일 호선, 라데팡스 방향. 콩코르드역에서 내려."
        }
      },
      {
        "who": "me",
        "text": "Merci ! Je vais arriver dans vingt minutes.",
        "gloss": {
          "en": "Thanks! I'm going to arrive in twenty minutes.",
          "ko": "고마워! 이십 분 뒤에 도착할 거야."
        },
        "frames": [
          "fr-f2-03"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a museum entrance",
      "ko": "박물관 입구에서"
    },
    "expressions": [
      "Je peux prendre une photo",
      "Pas de problème",
      "Qu'est-ce que vous conseillez"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, votre billet, s'il vous plaît.",
        "gloss": {
          "en": "Hello, your ticket, please.",
          "ko": "안녕하세요, 표 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "Voilà. Je peux prendre une photo dans le musée ?",
        "gloss": {
          "en": "Here. Can I take a photo in the museum?",
          "ko": "여기요. 박물관 안에서 사진 찍어도 돼요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Oui, mais sans flash, s'il vous plaît.",
        "gloss": {
          "en": "Yes, but without flash, please.",
          "ko": "네, 그런데 플래시는 쓰지 마세요."
        }
      },
      {
        "who": "me",
        "text": "Pas de problème. Où est le vestiaire ? Je veux laisser mon sac.",
        "gloss": {
          "en": "No problem. Where is the cloakroom? I want to leave my bag.",
          "ko": "네. 물품 보관소는 어디예요? 가방을 맡기고 싶어요."
        },
        "frames": [
          "fr-f1-08",
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Au rez-de-chaussée, à gauche.",
        "gloss": {
          "en": "On the ground floor, on the left.",
          "ko": "일 층 왼쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Qu'est-ce que vous conseillez comme salle ?",
        "gloss": {
          "en": "Thanks. Which room do you recommend?",
          "ko": "고마워요. 어느 전시실을 추천하세요?"
        },
        "frames": [
          "fr-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Les impressionnistes, au deuxième étage. C'est magnifique !",
        "gloss": {
          "en": "The Impressionists, on the second floor. It's wonderful!",
          "ko": "삼 층 인상파 전시실이요. 정말 멋져요!"
        }
      },
      {
        "who": "me",
        "text": "Super, j'adore la peinture !",
        "gloss": {
          "en": "Great, I love painting!",
          "ko": "좋아요, 그림을 정말 좋아해요!"
        },
        "frames": [
          "fr-f2-16"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Turning down a birthday invitation",
      "ko": "생일 초대 거절하기"
    },
    "expressions": [
      "Je suis désolé",
      "Ça marche"
    ],
    "grammar": [
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Ça te dit de venir à mon anniversaire samedi ?",
        "gloss": {
          "en": "Hi! Do you fancy coming to my birthday party on Saturday?",
          "ko": "안녕! 토요일에 내 생일 파티 올래?"
        }
      },
      {
        "who": "me",
        "text": "Oh, merci ! Mais je suis désolé, je ne peux pas venir samedi.",
        "gloss": {
          "en": "Oh, thanks! But I'm sorry, I can't come on Saturday.",
          "ko": "와, 고마워! 그런데 미안, 토요일엔 못 가."
        },
        "frames": [
          "fr-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Quel dommage ! Pourquoi ?",
        "gloss": {
          "en": "What a pity! Why?",
          "ko": "아쉽다! 왜?"
        }
      },
      {
        "who": "me",
        "text": "Je vais à Lyon parce que mon frère se marie.",
        "gloss": {
          "en": "I'm going to Lyon because my brother is getting married.",
          "ko": "형이 결혼해서 리옹에 가."
        },
        "frames": [
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Ah, c'est super ! Félicitations à lui !",
        "gloss": {
          "en": "Ah, that's great! Congratulations to him!",
          "ko": "와, 잘됐다! 형한테 축하한다고 전해 줘!"
        }
      },
      {
        "who": "me",
        "text": "Merci. On peut se voir dimanche soir ?",
        "gloss": {
          "en": "Thanks. Can we meet on Sunday evening?",
          "ko": "고마워. 일요일 저녁에 볼 수 있을까?"
        },
        "frames": [
          "fr-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Oui, bonne idée. On fait un petit dîner.",
        "gloss": {
          "en": "Yes, good idea. Let's have a little dinner.",
          "ko": "응, 좋아. 같이 간단히 저녁 먹자."
        }
      },
      {
        "who": "me",
        "text": "Ça marche. À dimanche !",
        "gloss": {
          "en": "Sounds good. See you Sunday!",
          "ko": "좋아. 일요일에 봐!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about your daily routine",
      "ko": "하루 일과 이야기"
    },
    "expressions": [],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as l'air fatigué !",
        "gloss": {
          "en": "You look tired!",
          "ko": "피곤해 보여!"
        }
      },
      {
        "who": "me",
        "text": "Oui. Je me lève à six heures tous les jours.",
        "gloss": {
          "en": "Yes. I get up at six every day.",
          "ko": "응. 매일 여섯 시에 일어나."
        },
        "frames": [
          "fr-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Six heures ? Pourquoi si tôt ?",
        "gloss": {
          "en": "Six? Why so early?",
          "ko": "여섯 시? 왜 그렇게 일찍?"
        }
      },
      {
        "who": "me",
        "text": "Parce que mon bureau est loin. Je prends le train à sept heures.",
        "gloss": {
          "en": "Because my office is far. I take the train at seven.",
          "ko": "회사가 멀어서. 일곱 시에 기차를 타."
        },
        "frames": [
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Et le soir, tu te couches à quelle heure ?",
        "gloss": {
          "en": "And at night, what time do you go to bed?",
          "ko": "밤에는 몇 시에 자?"
        }
      },
      {
        "who": "me",
        "text": "Je me couche vers onze heures. Je veux dormir plus.",
        "gloss": {
          "en": "I go to bed around eleven. I want to sleep more.",
          "ko": "열한 시쯤 자. 더 자고 싶어."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Tu peux travailler de chez toi parfois ?",
        "gloss": {
          "en": "Can you work from home sometimes?",
          "ko": "가끔 재택근무 할 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, le vendredi. J'adore le vendredi !",
        "gloss": {
          "en": "Yes, on Fridays. I love Fridays!",
          "ko": "응, 금요일마다. 금요일이 정말 좋아!"
        },
        "frames": [
          "fr-f2-16"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a friend to help you move",
      "ko": "친구에게 이사 도와 달라고 하기"
    },
    "expressions": [],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salut ! Quoi de neuf ?",
        "gloss": {
          "en": "Hi! What's new?",
          "ko": "안녕! 별일 없어?"
        }
      },
      {
        "who": "me",
        "text": "Je vais déménager samedi. Tu peux m'aider ?",
        "gloss": {
          "en": "I'm going to move on Saturday. Can you help me?",
          "ko": "토요일에 이사해. 도와줄 수 있어?"
        },
        "frames": [
          "fr-f2-03",
          "fr-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr ! À quelle heure ?",
        "gloss": {
          "en": "Of course! What time?",
          "ko": "물론이지! 몇 시에?"
        }
      },
      {
        "who": "me",
        "text": "Le matin. On se retrouve chez moi à neuf heures ?",
        "gloss": {
          "en": "In the morning. Shall we meet at my place at nine?",
          "ko": "아침에. 아홉 시에 우리 집에서 만날까?"
        },
        "frames": [
          "fr-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème. Je viens avec ma voiture.",
        "gloss": {
          "en": "No problem. I'll come with my car.",
          "ko": "문제없어. 차 가지고 갈게."
        }
      },
      {
        "who": "me",
        "text": "Super, merci ! On peut manger une pizza après.",
        "gloss": {
          "en": "Great, thanks! We can have a pizza afterwards.",
          "ko": "좋아, 고마워! 끝나고 피자 먹자."
        },
        "frames": [
          "fr-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Bonne idée !",
        "gloss": {
          "en": "Good idea!",
          "ko": "좋은 생각이야!"
        }
      },
      {
        "who": "me",
        "text": "À samedi, et merci encore !",
        "gloss": {
          "en": "See you Saturday, and thanks again!",
          "ko": "토요일에 봐, 다시 한번 고마워!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Choosing a pastry at a pâtisserie",
      "ko": "제과점에서 디저트 고르기"
    },
    "expressions": [
      "Qu'est-ce que vous conseillez",
      "Bon week-end"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Qu'est-ce qu'il vous faut ?",
        "gloss": {
          "en": "Hello! What can I get you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Qu'est-ce que vous conseillez comme gâteau ?",
        "gloss": {
          "en": "Hello. Which cake do you recommend?",
          "ko": "안녕하세요. 케이크는 뭘 추천하세요?"
        },
        "frames": [
          "fr-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Le flan est tout chaud, il sort du four.",
        "gloss": {
          "en": "The flan is still warm, it's just out of the oven.",
          "ko": "플랑이 방금 나와서 따끈해요."
        }
      },
      {
        "who": "me",
        "text": "Le flan ? Je le prends.",
        "gloss": {
          "en": "The flan? I'll take it.",
          "ko": "플랑이요? 그걸로 할게요."
        },
        "frames": [
          "fr-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Une part ou le flan entier ?",
        "gloss": {
          "en": "A slice or the whole flan?",
          "ko": "한 조각이요, 통째로요?"
        }
      },
      {
        "who": "me",
        "text": "Une part, s'il vous plaît. Je vais prendre aussi deux croissants.",
        "gloss": {
          "en": "A slice, please. I'll also have two croissants.",
          "ko": "한 조각 주세요. 크루아상도 두 개 주세요."
        },
        "frames": [
          "fr-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Et voilà. Ça fait six euros.",
        "gloss": {
          "en": "Here you go. That's six euros.",
          "ko": "여기 있어요. 육 유로예요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Bon week-end !",
        "gloss": {
          "en": "Thanks. Have a good weekend!",
          "ko": "고마워요. 주말 잘 보내세요!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about swimming with a friend",
      "ko": "친구와 수영 이야기"
    },
    "expressions": [
      "Avec plaisir"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu fais du sport ?",
        "gloss": {
          "en": "Do you do any sport?",
          "ko": "운동해?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'adore la natation.",
        "gloss": {
          "en": "Yes, I love swimming.",
          "ko": "응, 수영을 정말 좋아해."
        },
        "frames": [
          "fr-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Moi aussi ! Tu nages souvent ?",
        "gloss": {
          "en": "Me too! Do you swim often?",
          "ko": "나도! 자주 수영해?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je me lève tôt et je nage avant le travail.",
        "gloss": {
          "en": "Yes, I get up early and swim before work.",
          "ko": "응, 일찍 일어나서 출근 전에 수영해."
        },
        "frames": [
          "fr-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Ça te dit de venir avec moi au club samedi ?",
        "gloss": {
          "en": "Do you fancy coming with me to the club on Saturday?",
          "ko": "토요일에 나랑 클럽에 같이 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Avec plaisir ! Je peux venir avec un ami ?",
        "gloss": {
          "en": "With pleasure! Can I come with a friend?",
          "ko": "좋아! 친구 데려가도 돼?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr !",
        "gloss": {
          "en": "Of course!",
          "ko": "물론이지!"
        }
      },
      {
        "who": "me",
        "text": "Super. On se retrouve devant la piscine ?",
        "gloss": {
          "en": "Great. Shall we meet in front of the pool?",
          "ko": "좋아. 수영장 앞에서 만날까?"
        },
        "frames": [
          "fr-f2-11"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Staying for dinner at a friend's flat",
      "ko": "친구 집에서 저녁 먹기"
    },
    "expressions": [
      "Je n'aime pas trop"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu restes dîner ? J'ai fait un curry très épicé.",
        "gloss": {
          "en": "Are you staying for dinner? I made a very spicy curry.",
          "ko": "저녁 먹고 갈래? 아주 매운 카레 만들었어."
        }
      },
      {
        "who": "me",
        "text": "Merci ! Mais je n'aime pas trop la cuisine épicée.",
        "gloss": {
          "en": "Thanks! But I'm not very keen on spicy food.",
          "ko": "고마워! 그런데 매운 음식은 별로 안 좋아해."
        },
        "frames": [
          "fr-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Pas de problème, il y a aussi une salade.",
        "gloss": {
          "en": "No problem, there's also a salad.",
          "ko": "괜찮아, 샐러드도 있어."
        }
      },
      {
        "who": "me",
        "text": "Parfait, j'adore la salade ! Je peux t'aider ?",
        "gloss": {
          "en": "Perfect, I love salad! Can I help you?",
          "ko": "좋아, 샐러드 정말 좋아해! 도와줄까?"
        },
        "frames": [
          "fr-f2-16",
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Oui, tu peux couper les tomates ?",
        "gloss": {
          "en": "Yes, can you cut the tomatoes?",
          "ko": "응, 토마토 좀 썰어 줄래?"
        }
      },
      {
        "who": "me",
        "text": "Bien sûr. Les tomates ? Je les coupe tout de suite.",
        "gloss": {
          "en": "Sure. The tomatoes? I'll cut them right away.",
          "ko": "물론이지. 토마토? 바로 썰게."
        }
      },
      {
        "who": "them",
        "text": "Merci ! Et après, on mange.",
        "gloss": {
          "en": "Thanks! And then we eat.",
          "ko": "고마워! 그다음에 먹자."
        }
      },
      {
        "who": "me",
        "text": "Hier, j'ai fait un gâteau. Je l'ai apporté !",
        "gloss": {
          "en": "Yesterday I made a cake. I brought it!",
          "ko": "어제 케이크 만들었어. 가져왔어!"
        },
        "frames": [
          "fr-f2-01"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Summer holiday plans",
      "ko": "여름휴가 계획"
    },
    "expressions": [
      "Pas encore"
    ],
    "grammar": [
      2,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu pars en vacances cet été ?",
        "gloss": {
          "en": "Are you going on holiday this summer?",
          "ko": "이번 여름에 휴가 가?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je vais visiter la Bretagne.",
        "gloss": {
          "en": "Yes, I'm going to visit Brittany.",
          "ko": "응, 브르타뉴에 가 볼 거야."
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Super ! Tu y es déjà allé ?",
        "gloss": {
          "en": "Great! Have you been there before?",
          "ko": "좋겠다! 가 본 적 있어?"
        }
      },
      {
        "who": "me",
        "text": "Non, pas encore. Je veux voir la mer.",
        "gloss": {
          "en": "No, not yet. I want to see the sea.",
          "ko": "아니, 아직. 바다를 보고 싶어."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Tu pars avec qui ?",
        "gloss": {
          "en": "Who are you going with?",
          "ko": "누구랑 가?"
        }
      },
      {
        "who": "me",
        "text": "Avec des amis. On peut louer une maison près de la plage.",
        "gloss": {
          "en": "With friends. We can rent a house near the beach.",
          "ko": "친구들이랑. 해변 근처에 집을 빌릴 수 있어."
        },
        "frames": [
          "fr-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Génial ! Bonnes vacances !",
        "gloss": {
          "en": "Brilliant! Have a great holiday!",
          "ko": "멋지다! 휴가 잘 보내!"
        }
      },
      {
        "who": "me",
        "text": "Merci ! Je vais faire beaucoup de photos.",
        "gloss": {
          "en": "Thanks! I'm going to take lots of photos.",
          "ko": "고마워! 사진 많이 찍을 거야."
        },
        "frames": [
          "fr-f2-03"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "After class with a cut finger",
      "ko": "수업 끝나고 손가락을 다친 이야기"
    },
    "expressions": [
      "Un peu",
      "Bon courage"
    ],
    "grammar": [
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Qu'est-ce qui t'est arrivé à la main ?",
        "gloss": {
          "en": "What happened to your hand?",
          "ko": "손이 왜 그래?"
        }
      },
      {
        "who": "me",
        "text": "Je me suis coupé en cuisinant hier soir.",
        "gloss": {
          "en": "I cut myself while cooking last night.",
          "ko": "어젯밤에 요리하다가 베였어."
        },
        "frames": [
          "fr-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Aïe ! Ça fait mal ?",
        "gloss": {
          "en": "Ouch! Does it hurt?",
          "ko": "아야! 아파?"
        }
      },
      {
        "who": "me",
        "text": "Un peu. J'ai mal au doigt quand j'écris.",
        "gloss": {
          "en": "A little. My finger hurts when I write.",
          "ko": "조금. 글씨 쓸 때 손가락이 아파."
        },
        "frames": [
          "fr-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Tu veux mes notes du cours ?",
        "gloss": {
          "en": "Do you want my notes from the class?",
          "ko": "내 수업 필기 줄까?"
        }
      },
      {
        "who": "me",
        "text": "Oui, merci ! Je peux les prendre en photo ?",
        "gloss": {
          "en": "Yes, thanks! Can I take a photo of them?",
          "ko": "응, 고마워! 사진 찍어도 돼?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr. Tiens.",
        "gloss": {
          "en": "Sure. Here.",
          "ko": "물론이지. 여기."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Bon courage pour l'examen !",
        "gloss": {
          "en": "Thanks a lot. Good luck with the exam!",
          "ko": "정말 고마워. 시험 잘 봐!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Booking a haircut by phone",
      "ko": "전화로 미용실 예약"
    },
    "expressions": [],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Salon Belle Coiffure, bonjour !",
        "gloss": {
          "en": "Belle Coiffure salon, hello!",
          "ko": "벨 쿠아퓌르 미용실입니다, 안녕하세요!"
        }
      },
      {
        "who": "me",
        "text": "Bonjour. Je peux prendre rendez-vous pour samedi ?",
        "gloss": {
          "en": "Hello. Can I make an appointment for Saturday?",
          "ko": "안녕하세요. 토요일로 예약할 수 있을까요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Samedi matin ou après-midi ?",
        "gloss": {
          "en": "Saturday morning or afternoon?",
          "ko": "토요일 오전이요, 오후요?"
        }
      },
      {
        "who": "me",
        "text": "Le matin, parce que l'après-midi je travaille.",
        "gloss": {
          "en": "The morning, because I work in the afternoon.",
          "ko": "오전이요. 오후에는 일하거든요."
        },
        "frames": [
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Dix heures, ça vous va ?",
        "gloss": {
          "en": "Ten o'clock, does that suit you?",
          "ko": "열 시 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Parfait. Je veux juste une coupe courte.",
        "gloss": {
          "en": "Perfect. I just want a short cut.",
          "ko": "좋아요. 짧게 자르기만 하고 싶어요."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Très bien. C'est noté !",
        "gloss": {
          "en": "Very well. It's booked!",
          "ko": "네. 예약됐어요!"
        }
      },
      {
        "who": "me",
        "text": "Merci, à samedi !",
        "gloss": {
          "en": "Thanks, see you Saturday!",
          "ko": "고마워요, 토요일에 봬요!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Explaining a missed call to a friend",
      "ko": "친구에게 못 받은 전화 설명하기"
    },
    "expressions": [
      "Ça te dit"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu étais où hier ? Je t'ai appelé !",
        "gloss": {
          "en": "Where were you yesterday? I called you!",
          "ko": "어제 어디 있었어? 전화했는데!"
        }
      },
      {
        "who": "me",
        "text": "Désolé ! Hier, j'ai travaillé tard au bureau.",
        "gloss": {
          "en": "Sorry! Yesterday I worked late at the office.",
          "ko": "미안! 어제 회사에서 늦게까지 일했어."
        },
        "frames": [
          "fr-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Et après ?",
        "gloss": {
          "en": "And after that?",
          "ko": "그다음엔?"
        }
      },
      {
        "who": "me",
        "text": "Après, je suis allé au restaurant avec des collègues.",
        "gloss": {
          "en": "After that, I went to a restaurant with colleagues.",
          "ko": "그다음엔 동료들이랑 식당에 갔어."
        },
        "frames": [
          "fr-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "C'était bien ?",
        "gloss": {
          "en": "Was it good?",
          "ko": "좋았어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'adore ce restaurant !",
        "gloss": {
          "en": "Yes, I love that restaurant!",
          "ko": "응, 그 식당 정말 좋아!"
        },
        "frames": [
          "fr-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Il est où ?",
        "gloss": {
          "en": "Really? Where is it?",
          "ko": "그래? 어디 있는데?"
        }
      },
      {
        "who": "me",
        "text": "Près du bureau. Ça te dit de venir vendredi ?",
        "gloss": {
          "en": "Near the office. Do you fancy coming on Friday?",
          "ko": "회사 근처야. 금요일에 같이 갈래?"
        },
        "frames": [
          "fr-f2-04"
        ]
      }
    ]
  },
  {
    "id": "fr-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a picnic",
      "ko": "소풍 계획하기"
    },
    "expressions": [
      "Ça marche"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Qu'est-ce qu'on fait ce week-end ?",
        "gloss": {
          "en": "What shall we do this weekend?",
          "ko": "이번 주말에 뭐 할까?"
        }
      },
      {
        "who": "me",
        "text": "On peut faire un pique-nique au parc ?",
        "gloss": {
          "en": "Can we have a picnic in the park?",
          "ko": "공원에서 소풍할까?"
        },
        "frames": [
          "fr-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Bonne idée, mais il va pleuvoir samedi.",
        "gloss": {
          "en": "Good idea, but it's going to rain on Saturday.",
          "ko": "좋은 생각인데, 토요일엔 비 온대."
        }
      },
      {
        "who": "me",
        "text": "Alors dimanche ? Je vais préparer des sandwichs.",
        "gloss": {
          "en": "Sunday then? I'm going to make some sandwiches.",
          "ko": "그럼 일요일? 내가 샌드위치 만들게."
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Super ! Moi, j'apporte les boissons.",
        "gloss": {
          "en": "Great! I'll bring the drinks.",
          "ko": "좋아! 나는 음료 가져갈게."
        }
      },
      {
        "who": "me",
        "text": "Ça marche. On se retrouve à l'entrée du parc ?",
        "gloss": {
          "en": "Sounds good. Shall we meet at the park entrance?",
          "ko": "좋아. 공원 입구에서 만날까?"
        },
        "frames": [
          "fr-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Oui, vers midi.",
        "gloss": {
          "en": "Yes, around noon.",
          "ko": "응, 열두 시쯤."
        }
      },
      {
        "who": "me",
        "text": "Parfait. À dimanche !",
        "gloss": {
          "en": "Perfect. See you Sunday!",
          "ko": "좋아. 일요일에 봐!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Taking a photo for tourists",
      "ko": "관광객 사진 찍어 주기"
    },
    "expressions": [
      "Je peux prendre une photo"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Excusez-moi, vous pouvez prendre une photo de nous ?",
        "gloss": {
          "en": "Excuse me, can you take a photo of us?",
          "ko": "실례지만, 저희 사진 좀 찍어 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Bien sûr ! Je peux prendre une photo ici, avec la tour derrière ?",
        "gloss": {
          "en": "Sure! Can I take a photo here, with the tower behind?",
          "ko": "물론이죠! 여기서 탑이 뒤에 나오게 찍어도 될까요?"
        },
        "frames": [
          "fr-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Parfait. Merci beaucoup ! Vous êtes en vacances ?",
        "gloss": {
          "en": "Perfect. Thanks a lot! Are you on holiday?",
          "ko": "좋아요. 정말 고마워요! 여행 중이세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Hier, je suis allé à Versailles.",
        "gloss": {
          "en": "Yes. Yesterday I went to Versailles.",
          "ko": "네. 어제는 베르사유에 갔어요."
        },
        "frames": [
          "fr-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Et c'était bien ?",
        "gloss": {
          "en": "And was it good?",
          "ko": "좋았어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'adore les jardins !",
        "gloss": {
          "en": "Yes, I love the gardens!",
          "ko": "네, 정원이 정말 좋아요!"
        },
        "frames": [
          "fr-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Bonne fin de séjour !",
        "gloss": {
          "en": "Enjoy the rest of your stay!",
          "ko": "남은 여행 즐겁게 하세요!"
        }
      },
      {
        "who": "me",
        "text": "Merci, bonne journée !",
        "gloss": {
          "en": "Thanks, have a good day!",
          "ko": "고마워요, 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "fr-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Finishing a report at work",
      "ko": "회사에서 보고서 마무리"
    },
    "expressions": [
      "Pas encore",
      "Pas de problème",
      "Je suis désolé",
      "À demain"
    ],
    "grammar": [
      2,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as fini le rapport ?",
        "gloss": {
          "en": "Have you finished the report?",
          "ko": "보고서 다 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Pas encore. Je veux le finir ce soir.",
        "gloss": {
          "en": "Not yet. I want to finish it tonight.",
          "ko": "아직이요. 오늘 저녁에 끝내고 싶어요."
        },
        "frames": [
          "fr-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Tu peux m'envoyer une copie demain matin ?",
        "gloss": {
          "en": "Can you send me a copy tomorrow morning?",
          "ko": "내일 아침에 한 부 보내 줄 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, pas de problème. Je vais l'envoyer avant dix heures.",
        "gloss": {
          "en": "Yes, no problem. I'll send it before ten.",
          "ko": "네, 문제없어요. 열 시 전에 보낼게요."
        },
        "frames": [
          "fr-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Merci. Ah, ce soir on va au bar avec l'équipe. Tu viens ?",
        "gloss": {
          "en": "Thanks. Oh, tonight we're going to the bar with the team. Are you coming?",
          "ko": "고마워요. 아, 오늘 저녁에 팀이랑 바에 가요. 올래요?"
        }
      },
      {
        "who": "me",
        "text": "Je suis désolé, je ne peux pas venir ce soir parce que je dois finir le rapport.",
        "gloss": {
          "en": "I'm sorry, I can't come tonight because I have to finish the report.",
          "ko": "미안해요, 보고서를 끝내야 해서 오늘 저녁엔 못 가요."
        },
        "frames": [
          "fr-f2-19",
          "fr-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Pas de souci. Bon courage !",
        "gloss": {
          "en": "No worries. Good luck!",
          "ko": "괜찮아요. 힘내요!"
        }
      },
      {
        "who": "me",
        "text": "Merci ! À demain !",
        "gloss": {
          "en": "Thanks! See you tomorrow!",
          "ko": "고마워요! 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "fr-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to meet a friend",
      "ko": "친구와의 약속에 늦음"
    },
    "expressions": [
      "Désolé du retard",
      "En fait",
      "Tu as raison"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ah, enfin ! Ça fait vingt minutes que je t'attends !",
        "gloss": {
          "en": "Finally! I've been waiting for you for twenty minutes!",
          "ko": "드디어 왔네! 이십 분이나 기다렸어!"
        }
      },
      {
        "who": "me",
        "text": "Désolé du retard, le bus est tombé en panne en route.",
        "gloss": {
          "en": "Sorry I'm late, the bus broke down on the way.",
          "ko": "늦어서 미안해, 오는 길에 버스가 고장 났어."
        },
        "frames": [
          "fr-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Oh non ! Qu'est-ce qui s'est passé exactement ?",
        "gloss": {
          "en": "Oh no! What happened exactly?",
          "ko": "저런! 정확히 무슨 일이었어?"
        }
      },
      {
        "who": "me",
        "text": "En fait, le moteur a fait un bruit bizarre et tout le monde est descendu.",
        "gloss": {
          "en": "Actually, the engine made a weird noise and everyone got off.",
          "ko": "사실 엔진에서 이상한 소리가 나서 다들 내렸어."
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Tu aurais pu m'envoyer un message !",
        "gloss": {
          "en": "You could have sent me a message!",
          "ko": "문자라도 보내지!"
        }
      },
      {
        "who": "me",
        "text": "Tu as raison, mais je n'avais plus de batterie.",
        "gloss": {
          "en": "You're right, but my battery was dead.",
          "ko": "네 말이 맞아. 근데 배터리가 다 됐었어."
        },
        "frames": [
          "fr-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Bon, ça arrive. On commande ?",
        "gloss": {
          "en": "Well, it happens. Shall we order?",
          "ko": "뭐, 그럴 수도 있지. 주문할까?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! La prochaine fois, je partirai plus tôt, promis.",
        "gloss": {
          "en": "Yes! Next time I'll leave earlier, I promise.",
          "ko": "응! 다음엔 더 일찍 나올게, 약속해."
        },
        "frames": [
          "fr-f3-08"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Reporting a broken air conditioner at a hotel",
      "ko": "호텔에 에어컨 고장 알리기"
    },
    "expressions": [
      "Il y a un souci",
      "En fait",
      "Je pense que"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonsoir, je peux vous aider ?",
        "gloss": {
          "en": "Good evening, can I help you?",
          "ko": "안녕하세요, 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bonsoir. Il y a un souci avec ma chambre : la climatisation ne marche pas.",
        "gloss": {
          "en": "Good evening. There's a problem with my room: the air conditioning doesn't work.",
          "ko": "안녕하세요. 방에 문제가 있어요. 에어컨이 안 돼요."
        },
        "frames": [
          "fr-f3-09",
          "fr-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Je suis vraiment désolée. Vous avez essayé la télécommande ?",
        "gloss": {
          "en": "I'm really sorry. Have you tried the remote control?",
          "ko": "정말 죄송합니다. 리모컨은 써 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, plusieurs fois. En fait, l'écran de la télécommande reste noir.",
        "gloss": {
          "en": "Yes, several times. Actually, the remote's screen stays black.",
          "ko": "네, 여러 번요. 사실 리모컨 화면이 계속 꺼져 있어요."
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "C'est peut-être les piles. Je vous envoie quelqu'un tout de suite.",
        "gloss": {
          "en": "Maybe it's the batteries. I'll send someone right away.",
          "ko": "건전지 문제일 수도 있어요. 바로 사람을 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Je ne suis pas sûr de pouvoir dormir avec cette chaleur.",
        "gloss": {
          "en": "Thanks. I'm not sure I can sleep in this heat.",
          "ko": "고마워요. 이 더위에 잠을 잘 수 있을지 모르겠어요."
        },
        "frames": [
          "fr-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Si ça ne marche toujours pas, on peut vous donner une autre chambre.",
        "gloss": {
          "en": "If it still doesn't work, we can give you another room.",
          "ko": "그래도 안 되면 다른 방을 드릴 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Parfait, je pense que ce sera plus simple.",
        "gloss": {
          "en": "Perfect, I think that will be simpler.",
          "ko": "좋아요, 그게 더 간단할 것 같아요."
        },
        "frames": [
          "fr-f3-01"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a film after the cinema",
      "ko": "영화 보고 나서 이야기"
    },
    "expressions": [
      "À mon avis",
      "Franchement",
      "Je pense que",
      "J'ai hâte"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alors, tu as aimé le film ?",
        "gloss": {
          "en": "So, did you like the film?",
          "ko": "그래서, 영화 좋았어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, mais je trouve que la fin était un peu rapide.",
        "gloss": {
          "en": "Yes, but I find the ending was a bit rushed.",
          "ko": "응, 그런데 결말이 좀 급했던 것 같아."
        },
        "frames": [
          "fr-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Moi, je l'ai trouvée parfaite.",
        "gloss": {
          "en": "Really? I thought it was perfect.",
          "ko": "그래? 난 완벽했다고 생각했는데."
        }
      },
      {
        "who": "me",
        "text": "À mon avis, l'histoire était plus forte au début.",
        "gloss": {
          "en": "In my opinion, the story was stronger at the start.",
          "ko": "내 생각엔 이야기가 처음에 더 강렬했어."
        },
        "frames": [
          "fr-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "C'est vrai que le début était génial. Et l'acteur principal ?",
        "gloss": {
          "en": "True, the start was great. And the lead actor?",
          "ko": "처음이 대단하긴 했지. 주연 배우는?"
        }
      },
      {
        "who": "me",
        "text": "Franchement, je pense que c'était son meilleur rôle.",
        "gloss": {
          "en": "Honestly, I think it was his best role.",
          "ko": "솔직히 그 배우 최고의 역할이었던 것 같아."
        },
        "frames": [
          "fr-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Tu veux voir le deuxième film quand il sort ?",
        "gloss": {
          "en": "Do you want to see the second film when it comes out?",
          "ko": "속편 나오면 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Bien sûr ! Je sais pas quand il sort, mais j'ai hâte.",
        "gloss": {
          "en": "Of course! I dunno when it's out, but I can't wait.",
          "ko": "당연하지! 언제 나오는지는 모르겠지만 너무 기대돼."
        },
        "frames": [
          "fr-f3-12"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Explaining why you missed a call",
      "ko": "전화를 못 받은 이유 설명"
    },
    "expressions": [
      "En fait"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pourquoi tu ne m'as pas répondu hier soir ?",
        "gloss": {
          "en": "Why didn't you answer me last night?",
          "ko": "어젯밤에 왜 전화 안 받았어?"
        }
      },
      {
        "who": "me",
        "text": "Désolé ! Je prenais ma douche quand le téléphone a sonné.",
        "gloss": {
          "en": "Sorry! I was having a shower when the phone rang.",
          "ko": "미안! 전화 왔을 때 샤워하고 있었어."
        },
        "frames": [
          "fr-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Et après, tu n'as pas rappelé !",
        "gloss": {
          "en": "And then you didn't call back!",
          "ko": "그리고 다시 전화도 안 했잖아!"
        }
      },
      {
        "who": "me",
        "text": "En fait, j'ai oublié. Je regardais un match à la télé.",
        "gloss": {
          "en": "Actually, I forgot. I was watching a match on TV.",
          "ko": "사실 깜빡했어. 텔레비전으로 경기 보고 있었거든."
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Ha ha, d'accord. Tu peux m'aider samedi ? Je dois porter des meubles.",
        "gloss": {
          "en": "Ha ha, OK. Can you help me on Saturday? I have to carry some furniture.",
          "ko": "하하, 알았어. 토요일에 도와줄 수 있어? 가구를 옮겨야 해."
        }
      },
      {
        "who": "me",
        "text": "Oui, pas de problème. On y va en voiture ?",
        "gloss": {
          "en": "Yes, no problem. Shall we go there by car?",
          "ko": "응, 문제없어. 차로 갈까?"
        },
        "frames": [
          "fr-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Oui, je loue une camionnette.",
        "gloss": {
          "en": "Yes, I'm renting a van.",
          "ko": "응, 승합차 빌릴 거야."
        }
      },
      {
        "who": "me",
        "text": "Parfait. Je t'appellerai vendredi soir pour confirmer.",
        "gloss": {
          "en": "Perfect. I'll call you on Friday evening to confirm.",
          "ko": "좋아. 금요일 저녁에 확인 전화할게."
        }
      }
    ]
  },
  {
    "id": "fr-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Walking through your old neighborhood",
      "ko": "예전에 살던 동네 걷기"
    },
    "expressions": [
      "À mon avis"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu connais bien ce quartier ?",
        "gloss": {
          "en": "Do you know this neighborhood well?",
          "ko": "이 동네 잘 알아?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! Avant, je vivais juste à côté.",
        "gloss": {
          "en": "Yes! I used to live just nearby.",
          "ko": "응! 예전에 바로 근처에 살았어."
        },
        "frames": [
          "fr-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Et pourquoi tu as déménagé ?",
        "gloss": {
          "en": "Really? And why did you move?",
          "ko": "그래? 왜 이사했어?"
        }
      },
      {
        "who": "me",
        "text": "L'appartement était trop petit. Tu vois ce café ? C'est l'endroit où je travaillais le week-end.",
        "gloss": {
          "en": "The flat was too small. See that café? It's the place where I worked at weekends.",
          "ko": "집이 너무 좁았어. 저 카페 보여? 주말마다 내가 일하던 곳이야."
        },
        "frames": [
          "fr-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Sérieux ? Tu étais serveur ?",
        "gloss": {
          "en": "Seriously? You were a waiter?",
          "ko": "진짜? 서빙했어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, pendant deux ans. À mon avis, c'est le meilleur café du quartier.",
        "gloss": {
          "en": "Yes, for two years. In my opinion, it's the best café in the area.",
          "ko": "응, 이 년 동안. 내 생각엔 이 동네 최고의 카페야."
        },
        "frames": [
          "fr-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "On entre prendre un café, alors ?",
        "gloss": {
          "en": "Shall we go in for a coffee, then?",
          "ko": "그럼 들어가서 커피 마실까?"
        }
      },
      {
        "who": "me",
        "text": "Bonne idée ! J'ai un ami qui travaille encore ici.",
        "gloss": {
          "en": "Good idea! I have a friend who still works here.",
          "ko": "좋아! 아직 여기서 일하는 친구가 있어."
        },
        "frames": [
          "fr-f3-18"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Thanking a friend for a restaurant tip",
      "ko": "식당 추천해 준 친구에게 고마워하기"
    },
    "expressions": [
      "C'était génial"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alors, tu es allé au restaurant japonais ?",
        "gloss": {
          "en": "So, did you go to the Japanese restaurant?",
          "ko": "그래서, 그 일본 식당 가 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! Le restaurant que tu m'as conseillé, c'était génial !",
        "gloss": {
          "en": "Yes! The restaurant you recommended was great!",
          "ko": "응! 네가 추천해 준 식당 정말 좋았어!"
        },
        "frames": [
          "fr-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Super ! Qu'est-ce que tu as pris ?",
        "gloss": {
          "en": "Great! What did you have?",
          "ko": "잘됐다! 뭐 먹었어?"
        }
      },
      {
        "who": "me",
        "text": "Des ramens. J'en ai mangé deux bols !",
        "gloss": {
          "en": "Ramen. I ate two bowls of it!",
          "ko": "라멘. 두 그릇이나 먹었어!"
        },
        "frames": [
          "fr-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Deux ? Ha ha ! C'était cher ?",
        "gloss": {
          "en": "Two? Ha ha! Was it expensive?",
          "ko": "두 그릇? 하하! 비쌌어?"
        }
      },
      {
        "who": "me",
        "text": "Pas vraiment. Je trouve que les prix sont corrects pour Paris.",
        "gloss": {
          "en": "Not really. I find the prices are reasonable for Paris.",
          "ko": "별로. 파리치고는 가격이 괜찮은 것 같아."
        },
        "frames": [
          "fr-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "On y retourne ensemble un jour ?",
        "gloss": {
          "en": "Shall we go back there together some day?",
          "ko": "언제 같이 또 갈까?"
        }
      },
      {
        "who": "me",
        "text": "Avec plaisir ! On y va vendredi soir ?",
        "gloss": {
          "en": "With pleasure! Shall we go there on Friday evening?",
          "ko": "좋아! 금요일 저녁에 갈까?"
        },
        "frames": [
          "fr-f3-15"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling IT about a broken printer",
      "ko": "프린터 고장으로 전산팀에 전화"
    },
    "expressions": [
      "Je ne suis pas sûr",
      "En fait",
      "Du coup"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Service informatique, bonjour.",
        "gloss": {
          "en": "IT department, hello.",
          "ko": "전산팀입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Bonjour. L'imprimante du deuxième étage ne marche pas.",
        "gloss": {
          "en": "Hello. The printer on the second floor doesn't work.",
          "ko": "안녕하세요. 삼 층 프린터가 안 돼요."
        },
        "frames": [
          "fr-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Qu'est-ce qui se passe exactement ?",
        "gloss": {
          "en": "What's happening exactly?",
          "ko": "정확히 어떤 상황이에요?"
        }
      },
      {
        "who": "me",
        "text": "Je ne suis pas sûr de comprendre. Il y a un message d'erreur en anglais.",
        "gloss": {
          "en": "I'm not sure I understand. There's an error message in English.",
          "ko": "잘 모르겠어요. 영어로 오류 메시지가 떠요."
        },
        "frames": [
          "fr-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Vous pouvez me lire le message ?",
        "gloss": {
          "en": "Can you read me the message?",
          "ko": "메시지를 읽어 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "En fait, il est écrit « papier coincé », mais il n'y a pas de papier dedans.",
        "gloss": {
          "en": "Actually, it says \"paper jam\", but there's no paper inside.",
          "ko": "사실 '용지 걸림'이라고 나오는데, 안에 종이가 없어요."
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "D'accord, je monte dans dix minutes.",
        "gloss": {
          "en": "OK, I'll come up in ten minutes.",
          "ko": "알겠어요, 십 분 뒤에 올라갈게요."
        }
      },
      {
        "who": "me",
        "text": "Merci ! Du coup, j'utiliserai l'imprimante du premier étage.",
        "gloss": {
          "en": "Thanks! So I'll use the printer on the first floor.",
          "ko": "고마워요! 그럼 이 층 프린터를 쓸게요."
        }
      }
    ]
  },
  {
    "id": "fr-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Getting help with a presentation",
      "ko": "발표 준비 도움 받기"
    },
    "expressions": [
      "Je ne suis pas sûr",
      "Tu as raison"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as l'air stressé. Ça va ?",
        "gloss": {
          "en": "You look stressed. Are you OK?",
          "ko": "스트레스 받은 것 같네. 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "Pas trop. Tu pourrais m'aider avec ma présentation ce soir ?",
        "gloss": {
          "en": "Not really. Could you help me with my presentation tonight?",
          "ko": "별로. 오늘 저녁에 발표 준비 좀 도와줄 수 있어?"
        },
        "frames": [
          "fr-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Bien sûr. C'est sur quoi ?",
        "gloss": {
          "en": "Of course. What's it about?",
          "ko": "물론이지. 무슨 주제야?"
        }
      },
      {
        "who": "me",
        "text": "Sur le marketing. Je ne suis pas sûr de bien organiser les idées.",
        "gloss": {
          "en": "On marketing. I'm not sure I'm organizing the ideas well.",
          "ko": "마케팅이야. 생각을 잘 정리하고 있는지 모르겠어."
        },
        "frames": [
          "fr-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Montre-moi. Hmm, je pense qu'il y a trop de texte sur les diapos.",
        "gloss": {
          "en": "Show me. Hmm, I think there's too much text on the slides.",
          "ko": "보여 줘. 음, 슬라이드에 글이 너무 많은 것 같아."
        }
      },
      {
        "who": "me",
        "text": "Tu as raison, je vais en enlever la moitié.",
        "gloss": {
          "en": "You're right, I'll cut half of it.",
          "ko": "네 말이 맞아, 절반은 뺄게."
        },
        "frames": [
          "fr-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Et ajoute des images, c'est plus clair.",
        "gloss": {
          "en": "And add some pictures, it's clearer.",
          "ko": "그리고 그림을 넣어. 그게 더 알기 쉬워."
        }
      },
      {
        "who": "me",
        "text": "Bonne idée. La prochaine fois, je commencerai plus tôt.",
        "gloss": {
          "en": "Good idea. Next time I'll start earlier.",
          "ko": "좋은 생각이야. 다음엔 더 일찍 시작할게."
        },
        "frames": [
          "fr-f3-08"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Baking a cake with a flatmate",
      "ko": "룸메이트와 케이크 만들기"
    },
    "expressions": [
      "À mon avis",
      "Du coup"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as acheté des œufs pour le gâteau ?",
        "gloss": {
          "en": "Did you buy eggs for the cake?",
          "ko": "케이크 만들 달걀 샀어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, j'en ai acheté une douzaine.",
        "gloss": {
          "en": "Yes, I bought a dozen.",
          "ko": "응, 한 판 샀어."
        },
        "frames": [
          "fr-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Et du beurre ?",
        "gloss": {
          "en": "And butter?",
          "ko": "버터는?"
        }
      },
      {
        "who": "me",
        "text": "Zut, j'ai oublié. Je sais pas si on en a encore.",
        "gloss": {
          "en": "Oops, I forgot. I dunno if we still have some.",
          "ko": "아차, 깜빡했다. 아직 남아 있는지 모르겠어."
        },
        "frames": [
          "fr-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Regarde dans le frigo.",
        "gloss": {
          "en": "Look in the fridge.",
          "ko": "냉장고 봐 봐."
        }
      },
      {
        "who": "me",
        "text": "Ah, il en reste un peu. À mon avis, ça suffit.",
        "gloss": {
          "en": "Ah, there's a little left. In my opinion, that's enough.",
          "ko": "아, 조금 남았네. 내 생각엔 이 정도면 충분해."
        },
        "frames": [
          "fr-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Et le four ? Il marche maintenant ?",
        "gloss": {
          "en": "And the oven? Does it work now?",
          "ko": "오븐은? 이제 돼?"
        }
      },
      {
        "who": "me",
        "text": "Non, le four ne marche pas. Du coup, on le fait chez toi ?",
        "gloss": {
          "en": "No, the oven doesn't work. So shall we make it at your place?",
          "ko": "아니, 오븐이 안 돼. 그러니까 너희 집에서 만들까?"
        },
        "frames": [
          "fr-f3-10"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Classmates stuck on homework",
      "ko": "숙제가 막힌 같은 반 친구들"
    },
    "expressions": [
      "Ça dépend"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as compris l'exercice de grammaire ?",
        "gloss": {
          "en": "Did you understand the grammar exercise?",
          "ko": "문법 연습 문제 이해했어?"
        }
      },
      {
        "who": "me",
        "text": "Pas vraiment. Je ne suis pas sûr de la réponse à la question trois.",
        "gloss": {
          "en": "Not really. I'm not sure about the answer to question three.",
          "ko": "별로. 삼 번 문제 답을 잘 모르겠어."
        },
        "frames": [
          "fr-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Moi non plus. On demande au prof ?",
        "gloss": {
          "en": "Me neither. Shall we ask the teacher?",
          "ko": "나도. 선생님한테 물어볼까?"
        }
      },
      {
        "who": "me",
        "text": "Oui. Tu pourrais lui écrire un mail ? Ton français est meilleur.",
        "gloss": {
          "en": "Yes. Could you write her an email? Your French is better.",
          "ko": "응. 네가 메일 써 줄 수 있어? 네 프랑스어가 더 낫잖아."
        },
        "frames": [
          "fr-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "D'accord. Tu veux réviser ensemble demain ?",
        "gloss": {
          "en": "OK. Do you want to revise together tomorrow?",
          "ko": "알았어. 내일 같이 복습할래?"
        }
      },
      {
        "who": "me",
        "text": "Ça dépend. Je travaille jusqu'à dix-huit heures. On y va après, à la bibliothèque ?",
        "gloss": {
          "en": "It depends. I work until six. Shall we go to the library after that?",
          "ko": "상황 봐서. 여섯 시까지 일하거든. 끝나고 도서관 갈까?"
        },
        "frames": [
          "fr-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Parfait, à dix-huit heures trente.",
        "gloss": {
          "en": "Perfect, at half past six.",
          "ko": "좋아, 여섯 시 반에."
        }
      },
      {
        "who": "me",
        "text": "Super. J'ai un ami qui est très fort en grammaire, je vais l'inviter.",
        "gloss": {
          "en": "Great. I have a friend who's very good at grammar, I'll invite him.",
          "ko": "좋아. 문법 정말 잘하는 친구가 있는데, 걔도 부를게."
        },
        "frames": [
          "fr-f3-18"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Changing plans because of rain",
      "ko": "비 때문에 계획 바꾸기"
    },
    "expressions": [
      "Je pense que",
      "Aucune idée",
      "Peut-être",
      "Tu as raison",
      "C'était génial"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as vu la météo pour dimanche ?",
        "gloss": {
          "en": "Have you seen the forecast for Sunday?",
          "ko": "일요일 일기예보 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, il va pleuvoir. Je pense que la randonnée n'est pas une bonne idée.",
        "gloss": {
          "en": "Yes, it's going to rain. I think the hike isn't a good idea.",
          "ko": "응, 비 온대. 등산은 좋은 생각이 아닌 것 같아."
        },
        "frames": [
          "fr-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Dommage ! Qu'est-ce qu'on fait, alors ?",
        "gloss": {
          "en": "Shame! What shall we do, then?",
          "ko": "아쉽다! 그럼 뭐 하지?"
        }
      },
      {
        "who": "me",
        "text": "Aucune idée. Peut-être un musée ?",
        "gloss": {
          "en": "No idea. Maybe a museum?",
          "ko": "모르겠어. 박물관은 어때?"
        }
      },
      {
        "who": "them",
        "text": "Pourquoi pas. Ou on reste à la maison et on cuisine ensemble ?",
        "gloss": {
          "en": "Why not. Or we stay at home and cook together?",
          "ko": "좋지. 아니면 집에서 같이 요리할까?"
        }
      },
      {
        "who": "me",
        "text": "Tu as raison, c'est plus sympa quand il pleut.",
        "gloss": {
          "en": "You're right, that's nicer when it rains.",
          "ko": "네 말이 맞아. 비 올 땐 그게 더 좋겠다."
        },
        "frames": [
          "fr-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Super. Tu connais une bonne recette ?",
        "gloss": {
          "en": "Great. Do you know a good recipe?",
          "ko": "좋아. 괜찮은 요리법 알아?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! Le gratin que tu m'as conseillé, c'était génial !",
        "gloss": {
          "en": "Yes! The gratin you recommended was great!",
          "ko": "응! 네가 알려 준 그라탱 정말 맛있었어!"
        },
        "frames": [
          "fr-f3-17"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about playing music",
      "ko": "악기 연주 이야기"
    },
    "expressions": [
      "Franchement",
      "Peut-être"
    ],
    "grammar": [
      0,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu joues d'un instrument ?",
        "gloss": {
          "en": "Do you play an instrument?",
          "ko": "악기 연주해?"
        }
      },
      {
        "who": "me",
        "text": "Plus maintenant, mais avant, je jouais du piano.",
        "gloss": {
          "en": "Not any more, but I used to play the piano.",
          "ko": "지금은 안 하는데, 예전엔 피아노를 쳤어."
        },
        "frames": [
          "fr-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Et pourquoi tu as arrêté ?",
        "gloss": {
          "en": "And why did you stop?",
          "ko": "왜 그만뒀어?"
        }
      },
      {
        "who": "me",
        "text": "Franchement, je n'avais plus le temps avec le travail.",
        "gloss": {
          "en": "Honestly, I didn't have time any more with work.",
          "ko": "솔직히 일 때문에 시간이 없었어."
        }
      },
      {
        "who": "them",
        "text": "C'est dommage. Moi, je prends des cours de guitare.",
        "gloss": {
          "en": "That's a shame. I'm taking guitar lessons.",
          "ko": "아쉽다. 나는 기타 레슨 받고 있어."
        }
      },
      {
        "who": "me",
        "text": "C'est cool ! J'ai un ami qui donne des cours de piano.",
        "gloss": {
          "en": "That's cool! I have a friend who gives piano lessons.",
          "ko": "멋지다! 피아노 레슨 하는 친구가 있어."
        },
        "frames": [
          "fr-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Tu devrais reprendre !",
        "gloss": {
          "en": "You should start again!",
          "ko": "다시 시작해 봐!"
        }
      },
      {
        "who": "me",
        "text": "Peut-être. La prochaine fois, je lui demanderai ses prix.",
        "gloss": {
          "en": "Maybe. Next time I'll ask him his prices.",
          "ko": "그럴까. 다음에 만나면 레슨비를 물어볼게."
        },
        "frames": [
          "fr-f3-08"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the landlord about the water heater",
      "ko": "집주인에게 온수기 문제로 전화"
    },
    "expressions": [
      "Il y a un souci",
      "En fait"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Allô, oui ?",
        "gloss": {
          "en": "Hello, yes?",
          "ko": "여보세요?"
        }
      },
      {
        "who": "me",
        "text": "Bonjour, c'est votre locataire du troisième. Il y a un souci avec le chauffe-eau.",
        "gloss": {
          "en": "Hello, it's your tenant on the third floor. There's a problem with the water heater.",
          "ko": "안녕하세요, 사 층 세입자예요. 온수기에 문제가 있어요."
        },
        "frames": [
          "fr-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Ah bon ? Qu'est-ce qui se passe ?",
        "gloss": {
          "en": "Really? What's going on?",
          "ko": "그래요? 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "Depuis ce matin, la douche ne marche pas. L'eau reste froide.",
        "gloss": {
          "en": "Since this morning the shower doesn't work. The water stays cold.",
          "ko": "오늘 아침부터 샤워기가 안 돼요. 물이 계속 차가워요."
        },
        "frames": [
          "fr-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Je suis désolé. Je peux envoyer un plombier jeudi.",
        "gloss": {
          "en": "I'm sorry. I can send a plumber on Thursday.",
          "ko": "죄송해요. 목요일에 배관공을 보낼 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Jeudi, c'est un peu loin. En fait, j'ai un bébé à la maison.",
        "gloss": {
          "en": "Thursday is a bit far off. Actually, I have a baby at home.",
          "ko": "목요일은 좀 멀어요. 사실 집에 아기가 있어서요."
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Je comprends. Je vais essayer pour demain.",
        "gloss": {
          "en": "I understand. I'll try for tomorrow.",
          "ko": "알겠어요. 내일로 해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Merci beaucoup. Je resterai à la maison toute la journée.",
        "gloss": {
          "en": "Thank you very much. I'll stay home all day.",
          "ko": "정말 감사해요. 하루 종일 집에 있을게요."
        }
      }
    ]
  },
  {
    "id": "fr-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a gift in a bookshop",
      "ko": "서점에서 선물 고르기"
    },
    "expressions": [
      "À mon avis"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, vous cherchez un livre en particulier ?",
        "gloss": {
          "en": "Hello, are you looking for a particular book?",
          "ko": "안녕하세요, 찾으시는 책 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, c'est pour un cadeau. J'ai un ami qui adore les romans policiers.",
        "gloss": {
          "en": "Yes, it's for a present. I have a friend who loves crime novels.",
          "ko": "네, 선물하려고요. 추리 소설을 정말 좋아하는 친구가 있어요."
        },
        "frames": [
          "fr-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "J'ai celui-ci, il est très populaire en ce moment.",
        "gloss": {
          "en": "I have this one, it's very popular right now.",
          "ko": "이 책이 요즘 아주 인기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Hmm, je pense que mon ami l'a déjà lu.",
        "gloss": {
          "en": "Hmm, I think my friend has already read it.",
          "ko": "음, 제 친구가 벌써 읽었을 것 같아요."
        },
        "frames": [
          "fr-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Alors, peut-être celui-là ? Il vient de sortir.",
        "gloss": {
          "en": "Then maybe that one? It's just come out.",
          "ko": "그럼 이건 어때요? 막 나온 책이에요."
        }
      },
      {
        "who": "me",
        "text": "Parfait. À mon avis, ça va lui plaire.",
        "gloss": {
          "en": "Perfect. In my opinion, he'll like it.",
          "ko": "좋아요. 제 생각엔 마음에 들어 할 거예요."
        },
        "frames": [
          "fr-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Je vous fais un paquet cadeau ?",
        "gloss": {
          "en": "Shall I gift-wrap it for you?",
          "ko": "선물 포장해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, merci. Il est joli, ce papier !",
        "gloss": {
          "en": "Yes, thanks. This paper is pretty!",
          "ko": "네, 고마워요. 포장지 예쁘네요!"
        }
      }
    ]
  },
  {
    "id": "fr-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Chatting during a train delay",
      "ko": "기차 지연 중에 대화"
    },
    "expressions": [],
    "grammar": [
      2,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Excusez-moi, vous savez pourquoi le train est en retard ?",
        "gloss": {
          "en": "Excuse me, do you know why the train is late?",
          "ko": "실례지만, 기차가 왜 늦는지 아세요?"
        }
      },
      {
        "who": "me",
        "text": "Je sais pas exactement. Il y a eu un problème sur la ligne, je crois.",
        "gloss": {
          "en": "I dunno exactly. There was a problem on the line, I think.",
          "ko": "정확히는 모르겠어요. 선로에 문제가 있었던 것 같아요."
        },
        "frames": [
          "fr-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Ça fait une heure que j'attends !",
        "gloss": {
          "en": "I've been waiting for an hour!",
          "ko": "한 시간째 기다리고 있어요!"
        }
      },
      {
        "who": "me",
        "text": "Moi aussi. Je pense que le prochain train partira dans vingt minutes.",
        "gloss": {
          "en": "Me too. I think the next train will leave in twenty minutes.",
          "ko": "저도요. 다음 기차는 이십 분 뒤에 출발할 것 같아요."
        },
        "frames": [
          "fr-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Vous allez où ?",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "À Bordeaux. C'est l'endroit où j'ai grandi.",
        "gloss": {
          "en": "To Bordeaux. It's the place where I grew up.",
          "ko": "보르도요. 제가 자란 곳이에요."
        },
        "frames": [
          "fr-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Ah, c'est une belle ville !",
        "gloss": {
          "en": "Ah, it's a beautiful city!",
          "ko": "아, 아름다운 도시죠!"
        }
      },
      {
        "who": "me",
        "text": "Oui ! La prochaine fois, je prendrai l'avion, c'est sûr.",
        "gloss": {
          "en": "Yes! Next time I'll fly, that's for sure.",
          "ko": "네! 다음엔 꼭 비행기 탈 거예요."
        },
        "frames": [
          "fr-f3-08"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A damaged delivery at the door",
      "ko": "현관에서 받은 파손된 택배"
    },
    "expressions": [
      "Il y a un souci",
      "Du coup"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Livraison ! Bonjour, c'est pour vous.",
        "gloss": {
          "en": "Delivery! Hello, this is for you.",
          "ko": "택배요! 안녕하세요, 받으세요."
        }
      },
      {
        "who": "me",
        "text": "Merci, mais il y a un souci avec le colis : la boîte est ouverte.",
        "gloss": {
          "en": "Thanks, but there's a problem with the parcel: the box is open.",
          "ko": "고마워요. 그런데 택배에 문제가 있어요. 상자가 열려 있어요."
        },
        "frames": [
          "fr-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Oh, je suis désolé. Vous voulez vérifier ?",
        "gloss": {
          "en": "Oh, I'm sorry. Do you want to check?",
          "ko": "아, 죄송해요. 확인해 보시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Oui. J'avais commandé six tasses, mais j'en ai seulement quatre.",
        "gloss": {
          "en": "Yes. I'd ordered six cups, but I've only got four.",
          "ko": "네. 컵을 여섯 개 주문했는데 네 개밖에 없어요."
        },
        "frames": [
          "fr-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Vous pouvez refuser le colis, si vous voulez.",
        "gloss": {
          "en": "You can refuse the parcel, if you like.",
          "ko": "원하시면 택배를 반송하셔도 돼요."
        }
      },
      {
        "who": "me",
        "text": "Je ne suis pas sûr de vouloir le refuser.",
        "gloss": {
          "en": "I'm not sure I want to refuse it.",
          "ko": "반송해야 할지 잘 모르겠어요."
        },
        "frames": [
          "fr-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Le plus simple : prenez une photo et contactez le site.",
        "gloss": {
          "en": "The simplest thing: take a photo and contact the website.",
          "ko": "제일 간단한 건 사진을 찍어서 사이트에 연락하는 거예요."
        }
      },
      {
        "who": "me",
        "text": "D'accord. Du coup, je garde le colis et j'écris au site.",
        "gloss": {
          "en": "OK. So I'll keep the parcel and write to the website.",
          "ko": "알겠어요. 그럼 택배는 받고 사이트에 글을 남길게요."
        }
      }
    ]
  },
  {
    "id": "fr-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Wifi trouble in a café",
      "ko": "카페에서 와이파이 문제"
    },
    "expressions": [
      "En fait",
      "Franchement"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour ! Tout va bien ?",
        "gloss": {
          "en": "Hello! Is everything OK?",
          "ko": "안녕하세요! 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, mais le wifi ne marche pas sur mon ordinateur.",
        "gloss": {
          "en": "Yes, but the wifi doesn't work on my laptop.",
          "ko": "네, 그런데 제 노트북에서 와이파이가 안 돼요."
        },
        "frames": [
          "fr-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Vous avez le bon mot de passe ? Il est sur le ticket.",
        "gloss": {
          "en": "Do you have the right password? It's on the receipt.",
          "ko": "비밀번호 맞게 넣으셨어요? 영수증에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Ah, je ne l'avais pas vu. En fait, ça marche maintenant !",
        "gloss": {
          "en": "Ah, I hadn't seen it. Actually, it works now!",
          "ko": "아, 못 봤네요. 이제 되네요!"
        },
        "frames": [
          "fr-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Super ! Vous voulez autre chose ?",
        "gloss": {
          "en": "Great! Would you like anything else?",
          "ko": "잘됐네요! 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, un autre café. Avant, je buvais du thé, mais maintenant j'adore le café.",
        "gloss": {
          "en": "Yes, another coffee. I used to drink tea, but now I love coffee.",
          "ko": "네, 커피 한 잔 더요. 예전엔 차를 마셨는데 이제는 커피가 정말 좋아요."
        },
        "frames": [
          "fr-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Ha ha, ça arrive ! Je vous l'apporte.",
        "gloss": {
          "en": "Ha ha, it happens! I'll bring it to you.",
          "ko": "하하, 그럴 수 있죠! 가져다드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Merci. Franchement, je trouve que votre café est le meilleur du quartier.",
        "gloss": {
          "en": "Thanks. Honestly, I find your coffee is the best in the area.",
          "ko": "고마워요. 솔직히 여기 커피가 이 동네에서 제일 맛있는 것 같아요."
        },
        "frames": [
          "fr-f3-02"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Meeting a new neighbor in the stairwell",
      "ko": "계단에서 새 이웃 만나기"
    },
    "expressions": [
      "On peut se tutoyer",
      "J'ai hâte"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bonjour, vous êtes le nouveau voisin ?",
        "gloss": {
          "en": "Hello, are you the new neighbor?",
          "ko": "안녕하세요, 새로 이사 오신 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "Oui, je viens d'arriver. On peut se tutoyer, si vous voulez.",
        "gloss": {
          "en": "Yes, I've just arrived. We can say 'tu' to each other, if you like.",
          "ko": "네, 막 이사 왔어요. 괜찮으시면 말 편하게 해요."
        }
      },
      {
        "who": "them",
        "text": "Avec plaisir ! Alors, tu viens d'où ?",
        "gloss": {
          "en": "With pleasure! So, where are you from?",
          "ko": "좋아요! 그럼, 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "De Corée. Avant, je vivais à Busan, au bord de la mer.",
        "gloss": {
          "en": "From Korea. I used to live in Busan, by the sea.",
          "ko": "한국에서요. 예전엔 바닷가에 있는 부산에 살았어요."
        },
        "frames": [
          "fr-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Et pourquoi tu as choisi notre quartier ?",
        "gloss": {
          "en": "And why did you choose our neighborhood?",
          "ko": "그런데 왜 우리 동네를 골랐어?"
        }
      },
      {
        "who": "me",
        "text": "Je trouve que c'est calme et il y a beaucoup de parcs.",
        "gloss": {
          "en": "I find it's quiet and there are lots of parks.",
          "ko": "조용하고 공원이 많은 것 같아서요."
        },
        "frames": [
          "fr-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "C'est vrai. Et le marché du dimanche est super aussi.",
        "gloss": {
          "en": "True. And the Sunday market is great too.",
          "ko": "맞아. 일요일 시장도 정말 좋아."
        }
      },
      {
        "who": "me",
        "text": "J'ai hâte de le découvrir ! On y va ensemble dimanche ?",
        "gloss": {
          "en": "I can't wait to see it! Shall we go there together on Sunday?",
          "ko": "가 보고 싶어요! 일요일에 같이 갈래요?"
        },
        "frames": [
          "fr-f3-15"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend you lost your wallet",
      "ko": "친구에게 지갑 잃어버린 이야기"
    },
    "expressions": [
      "Tu as raison"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Qu'est-ce qui s'est passé ? Tu as l'air inquiet.",
        "gloss": {
          "en": "What happened? You look worried.",
          "ko": "무슨 일이야? 걱정 있어 보여."
        }
      },
      {
        "who": "me",
        "text": "J'ai perdu mon portefeuille. Je payais au marché quand le téléphone a sonné.",
        "gloss": {
          "en": "I lost my wallet. I was paying at the market when the phone rang.",
          "ko": "지갑을 잃어버렸어. 시장에서 계산하고 있을 때 전화가 왔거든."
        },
        "frames": [
          "fr-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh non ! Tu as regardé dans ton sac ?",
        "gloss": {
          "en": "Oh no! Have you looked in your bag?",
          "ko": "저런! 가방 안은 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Oui, partout. Je sais pas où il est.",
        "gloss": {
          "en": "Yes, everywhere. I dunno where it is.",
          "ko": "응, 다 봤어. 어디 있는지 모르겠어."
        },
        "frames": [
          "fr-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Tu pourrais retourner au marché et demander.",
        "gloss": {
          "en": "You could go back to the market and ask.",
          "ko": "시장에 다시 가서 물어보면 어때."
        }
      },
      {
        "who": "me",
        "text": "Tu as raison. C'est l'endroit où je l'ai sorti la dernière fois.",
        "gloss": {
          "en": "You're right. It's the place where I last took it out.",
          "ko": "네 말이 맞아. 마지막으로 지갑을 꺼낸 곳이 거기야."
        },
        "frames": [
          "fr-f3-13",
          "fr-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Je viens avec toi, si tu veux.",
        "gloss": {
          "en": "I'll come with you, if you like.",
          "ko": "원하면 같이 가 줄게."
        }
      },
      {
        "who": "me",
        "text": "Merci, c'est gentil. On y va maintenant ?",
        "gloss": {
          "en": "Thanks, that's kind. Shall we go there now?",
          "ko": "고마워, 착하다. 지금 갈까?"
        },
        "frames": [
          "fr-f3-15"
        ]
      }
    ]
  },
  {
    "id": "fr-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Discussing last night's football match",
      "ko": "어젯밤 축구 경기 이야기"
    },
    "expressions": [
      "À mon avis",
      "Tu as raison",
      "Peut-être",
      "Ça dépend",
      "Je pense que"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tu as regardé le match hier soir ?",
        "gloss": {
          "en": "Did you watch the match last night?",
          "ko": "어젯밤 경기 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Oui ! À mon avis, notre équipe a mal joué en première mi-temps.",
        "gloss": {
          "en": "Yes! In my opinion, our team played badly in the first half.",
          "ko": "응! 내 생각엔 우리 팀이 전반전에 못했어."
        },
        "frames": [
          "fr-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "C'est vrai, mais la deuxième mi-temps était incroyable !",
        "gloss": {
          "en": "True, but the second half was incredible!",
          "ko": "맞아, 그런데 후반전은 대단했어!"
        }
      },
      {
        "who": "me",
        "text": "Tu as raison, le dernier but était magnifique.",
        "gloss": {
          "en": "You're right, the last goal was amazing.",
          "ko": "맞아, 마지막 골은 정말 멋졌어."
        },
        "frames": [
          "fr-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Tu viens au stade avec nous le mois prochain ?",
        "gloss": {
          "en": "Are you coming to the stadium with us next month?",
          "ko": "다음 달에 우리랑 경기장 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Peut-être. Ça dépend du prix des places.",
        "gloss": {
          "en": "Maybe. It depends on the ticket prices.",
          "ko": "아마도. 표 값에 따라 달라."
        }
      },
      {
        "who": "them",
        "text": "J'en ai deux en plus, si tu veux.",
        "gloss": {
          "en": "I've got two extra, if you want.",
          "ko": "나한테 두 장 더 있어, 원하면 줄게."
        }
      },
      {
        "who": "me",
        "text": "Génial ! Je pense que ça va être une super soirée.",
        "gloss": {
          "en": "Brilliant! I think it's going to be a great evening.",
          "ko": "최고다! 정말 신나는 저녁이 될 것 같아."
        },
        "frames": [
          "fr-f3-01"
        ]
      }
    ]
  }
];
