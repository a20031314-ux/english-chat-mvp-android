import type { StageScript } from "../stageScripts.ts";

/** ja 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현 대본(x), 대본마다 쓰는 핵심 표현. Claude가 쓰고 한 번 다시 고침, 원어민 확인 전. */
export const JA: StageScript[] = [
  {
    "id": "ja-1-1",
    "name": {
      "text": [
        "マリア"
      ],
      "en": [
        "Maria"
      ],
      "ko": [
        "마리아"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "Meeting someone for the first time at a language exchange",
      "ko": "언어 교환 모임에서 처음 만난 사람과"
    },
    "expressions": [
      "はじめまして",
      "よろしくお願いします",
      "ありがとうございます"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "はじめまして。佐藤です。",
        "gloss": {
          "en": "Nice to meet you. I'm Sato.",
          "ko": "처음 뵙겠습니다. 사토예요."
        }
      },
      {
        "who": "me",
        "text": "はじめまして。マリアです。よろしくお願いします。",
        "gloss": {
          "en": "Nice to meet you. I'm Maria. Pleased to meet you.",
          "ko": "처음 뵙겠습니다. 마리아예요. 잘 부탁드려요."
        }
      },
      {
        "who": "them",
        "text": "マリアさんは、どこから来ましたか。",
        "gloss": {
          "en": "Where are you from, Maria?",
          "ko": "마리아 씨는 어디에서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "ブラジルから来ました。",
        "gloss": {
          "en": "I'm from Brazil.",
          "ko": "브라질에서 왔어요."
        }
      },
      {
        "who": "them",
        "text": "そうですか。お仕事は何ですか。",
        "gloss": {
          "en": "I see. What do you do?",
          "ko": "그렇군요. 무슨 일 하세요?"
        }
      },
      {
        "who": "me",
        "text": "会社員です。佐藤さんは？",
        "gloss": {
          "en": "I'm an office worker. And you, Mr. Sato?",
          "ko": "회사원이에요. 사토 씨는요?"
        }
      },
      {
        "who": "them",
        "text": "わたしは大学生です。日本語、上手ですね。",
        "gloss": {
          "en": "I'm a university student. Your Japanese is good.",
          "ko": "저는 대학생이에요. 일본어 잘하시네요."
        }
      },
      {
        "who": "me",
        "text": "いいえ、まだまだです。ありがとうございます。",
        "gloss": {
          "en": "Oh no, I still have a long way to go. Thank you.",
          "ko": "아니에요, 아직 멀었어요. 고마워요."
        }
      }
    ]
  },
  {
    "id": "ja-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Paying at a convenience store",
      "ko": "편의점 계산대에서 점원과"
    },
    "expressions": [
      "すみません",
      "これください",
      "いくらですか",
      "お願いします"
    ],
    "grammar": [
      1,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。",
        "gloss": {
          "en": "Welcome.",
          "ko": "어서 오세요."
        }
      },
      {
        "who": "me",
        "text": "すみません、これください。",
        "gloss": {
          "en": "Excuse me, I'll take this, please.",
          "ko": "저기요, 이거 주세요."
        }
      },
      {
        "who": "them",
        "text": "ポイントカードはお持ちですか。",
        "gloss": {
          "en": "Do you have a point card?",
          "ko": "포인트 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ、ありません。",
        "gloss": {
          "en": "No, I don't.",
          "ko": "아니요, 없어요."
        }
      },
      {
        "who": "them",
        "text": "袋はご利用ですか。",
        "gloss": {
          "en": "Would you like a bag?",
          "ko": "봉투 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "はい、一つください。いくらですか。",
        "gloss": {
          "en": "Yes, one, please. How much is it?",
          "ko": "네, 하나 주세요. 얼마예요?"
        }
      },
      {
        "who": "them",
        "text": "六百八十円です。",
        "gloss": {
          "en": "That's six hundred eighty yen.",
          "ko": "육백팔십 엔입니다."
        }
      },
      {
        "who": "me",
        "text": "カードでお願いします。",
        "gloss": {
          "en": "By card, please.",
          "ko": "카드로 할게요."
        }
      }
    ]
  },
  {
    "id": "ja-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking the way at a train station",
      "ko": "역에서 역무원에게 길 묻기"
    },
    "expressions": [
      "すみません",
      "もう一度お願いします",
      "わかりました",
      "トイレはどこですか",
      "ありがとうございます"
    ],
    "grammar": [
      1,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "何かお探しですか。",
        "gloss": {
          "en": "Are you looking for something?",
          "ko": "뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、新宿に行きます。電車はどれですか。",
        "gloss": {
          "en": "Excuse me, I'm going to Shinjuku. Which train is it?",
          "ko": "저기요, 신주쿠에 가요. 어느 전철이에요?"
        }
      },
      {
        "who": "them",
        "text": "新宿ですね。三番線の電車です。",
        "gloss": {
          "en": "Shinjuku, right? It's the train on track three.",
          "ko": "신주쿠요? 삼 번 선 전철이에요."
        }
      },
      {
        "who": "me",
        "text": "すみません、もう一度お願いします。",
        "gloss": {
          "en": "Sorry, could you say that again?",
          "ko": "죄송해요, 한 번 더 말해 주세요."
        }
      },
      {
        "who": "them",
        "text": "三番線です。あの階段の上です。",
        "gloss": {
          "en": "Track three. It's up those stairs.",
          "ko": "삼 번 선이요. 저 계단 위예요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。あと、トイレはどこですか。",
        "gloss": {
          "en": "I see. Also, where is the toilet?",
          "ko": "알겠어요. 그리고 화장실은 어디예요?"
        }
      },
      {
        "who": "them",
        "text": "トイレは改札の前にあります。",
        "gloss": {
          "en": "The toilet is in front of the ticket gates.",
          "ko": "화장실은 개찰구 앞에 있어요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。",
        "gloss": {
          "en": "Thank you very much.",
          "ko": "감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Greetings before and after a meal at a friend's home",
      "ko": "친구 집에서 식사 전후 인사"
    },
    "expressions": [
      "ありがとうございます",
      "いただきます",
      "大丈夫です",
      "ごちそうさまでした"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうぞ、食べてください。",
        "gloss": {
          "en": "Here, please eat.",
          "ko": "자, 드세요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。いただきます。",
        "gloss": {
          "en": "Thank you. Let's eat. (said before eating)",
          "ko": "고마워요. 잘 먹겠습니다."
        }
      },
      {
        "who": "them",
        "text": "どうですか。",
        "gloss": {
          "en": "How is it?",
          "ko": "어때요?"
        }
      },
      {
        "who": "me",
        "text": "おいしいです！これは何ですか。",
        "gloss": {
          "en": "It's delicious! What is this?",
          "ko": "맛있어요! 이건 뭐예요?"
        }
      },
      {
        "who": "them",
        "text": "肉じゃがです。母のレシピです。",
        "gloss": {
          "en": "It's nikujaga. It's my mother's recipe.",
          "ko": "니쿠자가예요. 엄마 레시피예요."
        }
      },
      {
        "who": "me",
        "text": "そうですか。とてもおいしいです。",
        "gloss": {
          "en": "Really? It's very tasty.",
          "ko": "그렇군요. 정말 맛있어요."
        }
      },
      {
        "who": "them",
        "text": "もう少しどうですか。",
        "gloss": {
          "en": "Would you like a little more?",
          "ko": "좀 더 드실래요?"
        }
      },
      {
        "who": "me",
        "text": "大丈夫です。ごちそうさまでした。",
        "gloss": {
          "en": "I'm fine, thanks. Thank you for the meal. (said after eating)",
          "ko": "괜찮아요. 잘 먹었습니다."
        }
      }
    ]
  },
  {
    "id": "ja-1-x1",
    "stage": 1,
    "setting": {
      "en": "Morning at a homestay",
      "ko": "홈스테이의 아침"
    },
    "expressions": [
      "おはようございます",
      "わかりません",
      "ちょっと待ってください"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "おはようございます。よく寝ましたか。",
        "gloss": {
          "en": "Good morning. Did you sleep well?",
          "ko": "좋은 아침이에요. 잘 잤어요?"
        }
      },
      {
        "who": "me",
        "text": "おはようございます。はい、よく寝ました。",
        "gloss": {
          "en": "Good morning. Yes, I slept well.",
          "ko": "좋은 아침이에요. 네, 잘 잤어요."
        }
      },
      {
        "who": "them",
        "text": "今日は何時に帰りますか。",
        "gloss": {
          "en": "What time will you be back today?",
          "ko": "오늘은 몇 시에 돌아와요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、まだわかりません。",
        "gloss": {
          "en": "Sorry, I don't know yet.",
          "ko": "죄송해요, 아직 모르겠어요."
        }
      },
      {
        "who": "them",
        "text": "午後は雨ですよ。傘はありますか。",
        "gloss": {
          "en": "It's going to rain in the afternoon. Do you have an umbrella?",
          "ko": "오후에 비가 와요. 우산 있어요?"
        }
      },
      {
        "who": "me",
        "text": "ちょっと待ってください。…はい、あります。",
        "gloss": {
          "en": "Just a moment. ...Yes, I have one.",
          "ko": "잠깐만요. …네, 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-1-x2",
    "stage": 1,
    "setting": {
      "en": "After class with a classmate",
      "ko": "수업 끝나고 같은 반 친구와"
    },
    "expressions": [
      "こんにちは",
      "そうです",
      "じゃあね"
    ],
    "grammar": [],
    "lines": [
      {
        "who": "them",
        "text": "あ、キムさん、こんにちは。",
        "gloss": {
          "en": "Oh, Kim, hi.",
          "ko": "아, 김 씨, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "こんにちは、ユナさん。",
        "gloss": {
          "en": "Hi, Yuna.",
          "ko": "안녕하세요, 유나 씨."
        }
      },
      {
        "who": "them",
        "text": "これ、キムさんのかばんですか。",
        "gloss": {
          "en": "Is this your bag, Kim?",
          "ko": "이거 김 씨 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "はい、そうです。ありがとうございます。",
        "gloss": {
          "en": "Yes, it is. Thank you.",
          "ko": "네, 맞아요. 고마워요."
        }
      },
      {
        "who": "them",
        "text": "じゃあ、また明日ね。",
        "gloss": {
          "en": "Well, see you tomorrow.",
          "ko": "그럼 내일 봐."
        }
      },
      {
        "who": "me",
        "text": "うん、じゃあね。",
        "gloss": {
          "en": "Yeah, bye.",
          "ko": "응, 안녕."
        }
      }
    ]
  },
  {
    "id": "ja-1-x3",
    "stage": 1,
    "setting": {
      "en": "Showing a classmate photos on your phone",
      "ko": "같은 반 친구에게 휴대폰 사진 보여 주기"
    },
    "expressions": [
      "そうです"
    ],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "キムさん、それは何の写真ですか。",
        "gloss": {
          "en": "Kim, what's that a photo of?",
          "ko": "김 씨, 그건 무슨 사진이에요?"
        }
      },
      {
        "who": "me",
        "text": "わたしの家族の写真です。",
        "gloss": {
          "en": "It's a photo of my family.",
          "ko": "제 가족 사진이에요."
        }
      },
      {
        "who": "them",
        "text": "この人はお姉さんですか。",
        "gloss": {
          "en": "Is this your older sister?",
          "ko": "이 사람은 언니예요?"
        }
      },
      {
        "who": "me",
        "text": "はい、そうです。姉は大阪の大学の先生です。",
        "gloss": {
          "en": "Yes, that's right. My sister is a teacher at a university in Osaka.",
          "ko": "네, 맞아요. 언니는 오사카에 있는 대학 선생님이에요."
        }
      },
      {
        "who": "them",
        "text": "この犬もキムさんの犬ですか。",
        "gloss": {
          "en": "Is this dog yours too, Kim?",
          "ko": "이 개도 김 씨 개예요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ、これは隣の家の犬です。",
        "gloss": {
          "en": "No, this is the neighbors' dog.",
          "ko": "아니요, 이건 옆집 개예요."
        }
      }
    ]
  },
  {
    "id": "ja-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Making weekend plans with a friend",
      "ko": "친구와 주말 약속 잡기"
    },
    "expressions": [
      "いいですね",
      "楽しみです"
    ],
    "grammar": [
      3,
      5,
      7
    ],
    "earlierGrammar": [
      "1:7",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "週末、何か予定がありますか。",
        "gloss": {
          "en": "Do you have any plans this weekend?",
          "ko": "주말에 무슨 약속 있어요?"
        }
      },
      {
        "who": "me",
        "text": "まだありません。どうしてですか。",
        "gloss": {
          "en": "Not yet. Why?",
          "ko": "아직 없어요. 왜요?"
        }
      },
      {
        "who": "them",
        "text": "駅の近くに新しいカフェができました。一緒に行きませんか。",
        "gloss": {
          "en": "A new café opened near the station. Would you like to go together?",
          "ko": "역 근처에 새 카페가 생겼어요. 같이 안 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "いいですね！行きたいです。",
        "gloss": {
          "en": "Sounds great! I'd love to go.",
          "ko": "좋네요! 가고 싶어요."
        }
      },
      {
        "who": "them",
        "text": "土曜日と日曜日、どちらがいいですか。",
        "gloss": {
          "en": "Which is better, Saturday or Sunday?",
          "ko": "토요일이랑 일요일 중에 언제가 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "土曜日はアルバイトがありますから、日曜日がいいです。",
        "gloss": {
          "en": "I have my part-time job on Saturday, so Sunday is better.",
          "ko": "토요일은 아르바이트가 있으니까 일요일이 좋아요."
        }
      },
      {
        "who": "them",
        "text": "じゃあ、日曜日の十一時はどうですか。",
        "gloss": {
          "en": "Then how about eleven on Sunday?",
          "ko": "그럼 일요일 열한 시는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "大丈夫です。どこで会いましょうか。",
        "gloss": {
          "en": "That works. Where shall we meet?",
          "ko": "괜찮아요. 어디서 만날까요?"
        }
      },
      {
        "who": "them",
        "text": "駅の北口で会いましょう。",
        "gloss": {
          "en": "Let's meet at the north exit of the station.",
          "ko": "역 북쪽 출구에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "わかりました。楽しみです。",
        "gloss": {
          "en": "Got it. I'm looking forward to it.",
          "ko": "알겠어요. 기대돼요."
        }
      }
    ]
  },
  {
    "id": "ja-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering at a set-meal restaurant",
      "ko": "정식집에서 점원에게 주문하기"
    },
    "expressions": [
      "何がおすすめですか",
      "写真を撮ってもいいですか"
    ],
    "grammar": [
      4
    ],
    "earlierGrammar": [
      "1:5",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "いらっしゃいませ。何名様ですか。",
        "gloss": {
          "en": "Welcome. How many people?",
          "ko": "어서 오세요. 몇 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "一人です。",
        "gloss": {
          "en": "Just one.",
          "ko": "한 명이에요."
        }
      },
      {
        "who": "them",
        "text": "こちらのお席へどうぞ。メニューです。",
        "gloss": {
          "en": "This way to your seat, please. Here's the menu.",
          "ko": "이쪽 자리로 앉으세요. 메뉴예요."
        }
      },
      {
        "who": "me",
        "text": "すみません、何がおすすめですか。",
        "gloss": {
          "en": "Excuse me, what do you recommend?",
          "ko": "저기요, 뭐가 맛있어요?"
        }
      },
      {
        "who": "them",
        "text": "唐揚げ定食と、さばの味噌煮定食が人気ですよ。",
        "gloss": {
          "en": "The fried chicken set and the miso-simmered mackerel set are popular.",
          "ko": "닭튀김 정식이랑 고등어 된장조림 정식이 인기예요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、唐揚げ定食を一つください。ご飯は大盛りでお願いします。",
        "gloss": {
          "en": "Then one fried chicken set, please. A large serving of rice, please.",
          "ko": "그럼 닭튀김 정식 하나 주세요. 밥은 곱빼기로 부탁해요."
        }
      },
      {
        "who": "them",
        "text": "かしこまりました。お飲み物はいかがですか。",
        "gloss": {
          "en": "Certainly. Would you like something to drink?",
          "ko": "알겠습니다. 음료는 어떻게 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "冷たいお茶をお願いします。",
        "gloss": {
          "en": "Cold tea, please.",
          "ko": "차가운 차 주세요."
        }
      },
      {
        "who": "them",
        "text": "お待たせしました。唐揚げ定食です。",
        "gloss": {
          "en": "Sorry to keep you waiting. Here's the fried chicken set.",
          "ko": "오래 기다리셨습니다. 닭튀김 정식이에요."
        }
      },
      {
        "who": "me",
        "text": "わあ、すごいですね。写真を撮ってもいいですか。",
        "gloss": {
          "en": "Wow, this looks amazing. May I take a photo?",
          "ko": "와, 대단하네요. 사진 찍어도 돼요?"
        }
      }
    ]
  },
  {
    "id": "ja-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Describing a cold at a pharmacy",
      "ko": "약국에서 감기 증상 말하기"
    },
    "expressions": [
      "頭が痛いです",
      "少しだけ"
    ],
    "grammar": [
      0,
      2
    ],
    "earlierGrammar": [
      "1:5",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "こんにちは。どうしましたか。",
        "gloss": {
          "en": "Hello. What seems to be the problem?",
          "ko": "안녕하세요. 어디가 안 좋으세요?"
        }
      },
      {
        "who": "me",
        "text": "風邪をひきました。頭が痛いです。",
        "gloss": {
          "en": "I've caught a cold. I have a headache.",
          "ko": "감기에 걸렸어요. 머리가 아파요."
        }
      },
      {
        "who": "them",
        "text": "いつからですか。",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "おとといからです。のども痛くて、せきも少しだけ出ています。",
        "gloss": {
          "en": "Since the day before yesterday. My throat hurts too, and I have a slight cough.",
          "ko": "그저께부터요. 목도 아프고 기침도 조금 나요."
        }
      },
      {
        "who": "them",
        "text": "熱はありますか。",
        "gloss": {
          "en": "Do you have a fever?",
          "ko": "열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "昨日の夜は三十七度五分でした。",
        "gloss": {
          "en": "Last night it was thirty-seven point five degrees.",
          "ko": "어젯밤에는 삼십칠 도 오 부였어요."
        }
      },
      {
        "who": "them",
        "text": "では、この薬はどうですか。一日三回、食後に飲んでください。",
        "gloss": {
          "en": "Then how about this medicine? Take it three times a day after meals.",
          "ko": "그럼 이 약은 어때요? 하루 세 번, 식후에 드세요."
        }
      },
      {
        "who": "me",
        "text": "明日は仕事です。この薬は眠くなりますか。",
        "gloss": {
          "en": "I have work tomorrow. Does this medicine make you sleepy?",
          "ko": "내일은 일해요. 이 약은 졸려요?"
        }
      },
      {
        "who": "them",
        "text": "少し眠くなるかもしれません。こちらは眠くなりにくいですよ。",
        "gloss": {
          "en": "It might make you a little sleepy. This one is less likely to.",
          "ko": "조금 졸릴 수도 있어요. 이건 잘 안 졸려요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、そちらをください。ありがとうございます。",
        "gloss": {
          "en": "Then I'll take that one. Thank you.",
          "ko": "그럼 그걸로 주세요. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ja-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Checking the schedule with a coworker",
      "ko": "동료와 일정 확인하기"
    },
    "expressions": [
      "お疲れさまです",
      "まだです"
    ],
    "grammar": [
      1,
      5
    ],
    "earlierGrammar": [
      "1:2",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "お疲れさまです。今、ちょっといいですか。",
        "gloss": {
          "en": "Hi, good work today. Do you have a moment?",
          "ko": "수고 많으세요. 지금 잠깐 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "お疲れさまです。はい、大丈夫です。",
        "gloss": {
          "en": "Hi, good work. Yes, sure.",
          "ko": "수고 많으세요. 네, 괜찮아요."
        }
      },
      {
        "who": "them",
        "text": "来週の会議は何曜日ですか。",
        "gloss": {
          "en": "What day is next week's meeting?",
          "ko": "다음 주 회의는 무슨 요일이에요?"
        }
      },
      {
        "who": "me",
        "text": "水曜日です。午後二時からです。",
        "gloss": {
          "en": "It's Wednesday. From two in the afternoon.",
          "ko": "수요일이에요. 오후 두 시부터예요."
        }
      },
      {
        "who": "them",
        "text": "すみません、水曜日の午後は外出の予定があります。木曜日に変えてもいいですか。",
        "gloss": {
          "en": "Sorry, I'm scheduled to be out on Wednesday afternoon. Could we change it to Thursday?",
          "ko": "죄송해요, 수요일 오후에는 외근이 있어요. 목요일로 바꿔도 돼요?"
        }
      },
      {
        "who": "me",
        "text": "木曜日ですか。ちょっと待ってください。…木曜日の十時はどうですか。",
        "gloss": {
          "en": "Thursday? Just a moment... How about ten on Thursday?",
          "ko": "목요일이요? 잠깐만요. …목요일 열 시는 어때요?"
        }
      },
      {
        "who": "them",
        "text": "十時は大丈夫です。部長にはもう連絡しましたか。",
        "gloss": {
          "en": "Ten works. Have you already told the manager?",
          "ko": "열 시 괜찮아요. 부장님께는 벌써 연락했어요?"
        }
      },
      {
        "who": "me",
        "text": "まだです。今から部長にメールを送ります。",
        "gloss": {
          "en": "Not yet. I'll email the manager now.",
          "ko": "아직이요. 지금 부장님께 메일 보낼게요."
        }
      },
      {
        "who": "them",
        "text": "ありがとうございます。助かります。",
        "gloss": {
          "en": "Thank you. That helps a lot.",
          "ko": "고마워요. 덕분에 살았어요."
        }
      },
      {
        "who": "me",
        "text": "いいえ。じゃあ、木曜日の十時にしましょう。",
        "gloss": {
          "en": "Not at all. Then let's make it ten on Thursday.",
          "ko": "아니에요. 그럼 목요일 열 시로 해요."
        }
      }
    ]
  },
  {
    "id": "ja-2-x1",
    "stage": 2,
    "setting": {
      "en": "Running into an old friend on the street",
      "ko": "길에서 오랜만에 만난 친구"
    },
    "expressions": [
      "久しぶりです",
      "元気ですか",
      "本当ですか",
      "一緒に行きませんか"
    ],
    "grammar": [
      5
    ],
    "earlierGrammar": [
      "1:1",
      "1:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "あれ？リンさんですか。",
        "gloss": {
          "en": "Huh? Is that you, Lin?",
          "ko": "어? 린 씨예요?"
        }
      },
      {
        "who": "me",
        "text": "あ、田中さん！久しぶりです。元気ですか。",
        "gloss": {
          "en": "Oh, Tanaka! Long time no see. How are you?",
          "ko": "아, 다나카 씨! 오랜만이에요. 잘 지내요?"
        }
      },
      {
        "who": "them",
        "text": "元気ですよ。実は、来月結婚します。",
        "gloss": {
          "en": "I'm doing well. Actually, I'm getting married next month.",
          "ko": "잘 지내요. 실은 다음 달에 결혼해요."
        }
      },
      {
        "who": "me",
        "text": "本当ですか！おめでとうございます。",
        "gloss": {
          "en": "Really? Congratulations!",
          "ko": "정말요? 축하해요!"
        }
      },
      {
        "who": "them",
        "text": "ありがとうございます。今度、ゆっくり話したいですね。",
        "gloss": {
          "en": "Thank you. I'd like to have a proper chat sometime.",
          "ko": "고마워요. 다음에 천천히 이야기하고 싶네요."
        }
      },
      {
        "who": "me",
        "text": "じゃあ、駅の前の新しいカフェに一緒に行きませんか。",
        "gloss": {
          "en": "Then would you like to go to the new café in front of the station together?",
          "ko": "그럼 역 앞에 새로 생긴 카페에 같이 가지 않을래요?"
        }
      }
    ]
  },
  {
    "id": "ja-2-x2",
    "stage": 2,
    "setting": {
      "en": "Leaving the office on a rainy evening",
      "ko": "비 오는 저녁, 퇴근길"
    },
    "expressions": [
      "もう終わりました",
      "そうですね",
      "気をつけて",
      "また明日"
    ],
    "grammar": [
      0,
      1
    ],
    "earlierGrammar": [
      "1:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "リーさん、まだ帰りませんか。",
        "gloss": {
          "en": "Lee, aren't you heading home yet?",
          "ko": "리 씨, 아직 안 가요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ、仕事はもう終わりました。今から帰ります。",
        "gloss": {
          "en": "No, I've already finished work. I'm leaving now.",
          "ko": "아니요, 일은 벌써 끝났어요. 지금 가요."
        }
      },
      {
        "who": "them",
        "text": "外は雨がすごいですよ。",
        "gloss": {
          "en": "It's raining really hard outside.",
          "ko": "밖에 비가 엄청 와요."
        }
      },
      {
        "who": "me",
        "text": "そうですね。傘を持ってきてよかったです。",
        "gloss": {
          "en": "It is. I'm glad I brought an umbrella.",
          "ko": "그러네요. 우산 가져와서 다행이에요."
        }
      },
      {
        "who": "them",
        "text": "私はバスなので、ここで。お疲れさまでした。",
        "gloss": {
          "en": "I'm taking the bus, so I'll say bye here. Good work today.",
          "ko": "저는 버스라서 여기서 갈게요. 수고하셨어요."
        }
      },
      {
        "who": "me",
        "text": "お疲れさまでした。気をつけて帰ってくださいね。また明日。",
        "gloss": {
          "en": "Good work today. Get home safely. See you tomorrow.",
          "ko": "수고하셨어요. 조심히 들어가세요. 내일 봐요."
        }
      }
    ]
  },
  {
    "id": "ja-2-x3",
    "stage": 2,
    "setting": {
      "en": "Phoning a friend after getting lost",
      "ko": "길을 잃고 친구에게 전화"
    },
    "expressions": [
      "道に迷いました",
      "何時にしますか"
    ],
    "grammar": [
      0
    ],
    "earlierGrammar": [
      "1:7",
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "もしもし、マリアさん？今どこですか。",
        "gloss": {
          "en": "Hello, Maria? Where are you now?",
          "ko": "여보세요, 마리아 씨? 지금 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、道に迷いました。今、大きい公園の前にいます。",
        "gloss": {
          "en": "Sorry, I got lost. I'm in front of a big park now.",
          "ko": "죄송해요, 길을 잃었어요. 지금 큰 공원 앞에 있어요."
        }
      },
      {
        "who": "them",
        "text": "そこからなら、歩いて十分ぐらいです。映画は次の回にしましょうか。三時と五時がありますよ。",
        "gloss": {
          "en": "From there it's about ten minutes on foot. Shall we go to the next showing? There's one at three and one at five.",
          "ko": "거기서라면 걸어서 10분 정도예요. 영화는 다음 회차로 할까요? 3시랑 5시가 있어요."
        }
      },
      {
        "who": "me",
        "text": "何時にしますか。私はどちらでも大丈夫です。",
        "gloss": {
          "en": "What time shall we go for? Either is fine with me.",
          "ko": "몇 시로 할까요? 저는 어느 쪽이든 괜찮아요."
        }
      },
      {
        "who": "them",
        "text": "じゃあ、三時にしましょう。チケットは私が買っておきます。",
        "gloss": {
          "en": "Then let's go with three. I'll buy the tickets.",
          "ko": "그럼 3시로 해요. 표는 제가 사 둘게요."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。すぐ行きます。",
        "gloss": {
          "en": "Thank you. I'll be right there.",
          "ko": "고마워요. 금방 갈게요."
        }
      }
    ]
  },
  {
    "id": "ja-2-x4",
    "stage": 2,
    "setting": {
      "en": "A teammate who can't run the race",
      "ko": "마라톤에 못 나가게 된 동료"
    },
    "expressions": [
      "どうしましたか",
      "残念です",
      "頑張ってください"
    ],
    "grammar": [
      0,
      1,
      2
    ],
    "earlierGrammar": [
      "1:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "はあ…。",
        "gloss": {
          "en": "Sigh...",
          "ko": "하아…."
        }
      },
      {
        "who": "me",
        "text": "どうしましたか。元気がないですね。",
        "gloss": {
          "en": "What's wrong? You seem down.",
          "ko": "무슨 일 있어요? 기운이 없어 보이네요."
        }
      },
      {
        "who": "them",
        "text": "足をけがして、来週のマラソン大会に出られなくなりました。",
        "gloss": {
          "en": "I hurt my leg, so I can't run in next week's marathon.",
          "ko": "다리를 다쳐서 다음 주 마라톤 대회에 못 나가게 됐어요."
        }
      },
      {
        "who": "me",
        "text": "そうですか…。残念です。毎日練習していましたよね。",
        "gloss": {
          "en": "Oh no... That's a shame. You were practicing every day, weren't you.",
          "ko": "그래요…. 아쉽네요. 매일 연습했잖아요."
        }
      },
      {
        "who": "them",
        "text": "はい。でも、来年また出ます。",
        "gloss": {
          "en": "Yes. But I'll enter again next year.",
          "ko": "네. 그래도 내년에 또 나갈 거예요."
        }
      },
      {
        "who": "me",
        "text": "来年は頑張ってください。応援しています。",
        "gloss": {
          "en": "Good luck next year. I'll be cheering for you.",
          "ko": "내년에는 힘내세요. 응원할게요."
        }
      }
    ]
  },
  {
    "id": "ja-2-x5",
    "stage": 2,
    "setting": {
      "en": "Dinner at an izakaya with a coworker",
      "ko": "동료와 이자카야에서 저녁"
    },
    "expressions": [
      "少しだけ",
      "まだです",
      "いいですね",
      "楽しみです"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "これ、納豆です。食べたことがありますか。",
        "gloss": {
          "en": "This is natto. Have you ever had it?",
          "ko": "이거 낫토예요. 먹어 본 적 있어요?"
        }
      },
      {
        "who": "me",
        "text": "いいえ、一度も食べたことがありません。少しだけください。",
        "gloss": {
          "en": "No, I've never had it. Just a little, please.",
          "ko": "아니요, 한 번도 먹어 본 적 없어요. 조금만 주세요."
        }
      },
      {
        "who": "them",
        "text": "どうですか。ほかに日本の料理は何を食べたことがありますか。",
        "gloss": {
          "en": "How is it? What other Japanese food have you tried?",
          "ko": "어때요? 다른 일본 요리는 뭘 먹어 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "おいしいです。すしとラーメンは食べたことがありますが、お好み焼きはまだです。",
        "gloss": {
          "en": "It's good. I've had sushi and ramen, but not okonomiyaki yet.",
          "ko": "맛있어요. 초밥이랑 라멘은 먹어 본 적 있는데, 오코노미야키는 아직이에요."
        }
      },
      {
        "who": "them",
        "text": "じゃあ、今度一緒にお好み焼きを食べに行きませんか。",
        "gloss": {
          "en": "Then shall we go have okonomiyaki together sometime?",
          "ko": "그럼 다음에 같이 오코노미야키 먹으러 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "いいですね。楽しみです。",
        "gloss": {
          "en": "Sounds good. I'm looking forward to it.",
          "ko": "좋네요. 기대돼요."
        }
      }
    ]
  },
  {
    "id": "ja-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Apologizing to a friend for being late",
      "ko": "늦어서 친구에게 사과하기"
    },
    "expressions": [
      "遅れてごめん",
      "実は"
    ],
    "grammar": [
      0,
      1,
      4,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "2:7",
      "2:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "あ、やっと来た！",
        "gloss": {
          "en": "Oh, there you are at last!",
          "ko": "아, 드디어 왔다!"
        }
      },
      {
        "who": "me",
        "text": "遅れてごめん！ずっと待ってた？",
        "gloss": {
          "en": "Sorry I'm late! Have you been waiting long?",
          "ko": "늦어서 미안! 계속 기다렸어?"
        }
      },
      {
        "who": "them",
        "text": "うん、二十分くらいかな。どうしたの？",
        "gloss": {
          "en": "Yeah, about twenty minutes, I guess. What happened?",
          "ko": "응, 이십 분쯤? 무슨 일 있었어?"
        },
        "alt": [
          {
            "text": "ううん、私もさっき来たとこ。何かあった？",
            "gloss": {
              "en": "No, I just got here a bit ago too. Did something happen?",
              "ko": "아니, 나도 방금 왔어. 무슨 일 있었어?"
            }
          },
          {
            "text": "まあ、ちょっとね。どうかしたの？",
            "gloss": {
              "en": "Well, a little. Is everything okay?",
              "ko": "뭐, 좀. 무슨 일이야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "実は、乗り換えで電車を間違えちゃったんだ。",
        "gloss": {
          "en": "Actually, I got on the wrong train when I changed lines.",
          "ko": "실은 갈아타다가 전철을 잘못 탔거든."
        }
      },
      {
        "who": "them",
        "text": "えー、そうなんだ。連絡くれたらよかったのに。",
        "gloss": {
          "en": "Oh no, really. You could have messaged me.",
          "ko": "헐, 그랬구나. 연락 주지 그랬어."
        },
        "alt": [
          {
            "text": "マジで？LINEくれればよかったのに。",
            "gloss": {
              "en": "Seriously? You could have sent me a LINE.",
              "ko": "진짜? 라인이라도 보내지."
            }
          },
          {
            "text": "そっか。メッセージくらいほしかったな。",
            "gloss": {
              "en": "I see. I'd have liked at least a message.",
              "ko": "그렇구나. 메시지라도 주지 그랬어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ほんとごめん。スマホの充電が切れちゃって、連絡できなかったんだ。",
        "gloss": {
          "en": "I'm really sorry. My phone died, so I couldn't contact you.",
          "ko": "진짜 미안. 폰 배터리가 나가서 연락을 못 했어."
        }
      },
      {
        "who": "them",
        "text": "そっか、仕方ないね。気にしないで。",
        "gloss": {
          "en": "Ah, it can't be helped then. Don't worry about it.",
          "ko": "그렇구나, 어쩔 수 없지. 신경 쓰지 마."
        },
        "alt": [
          {
            "text": "それなら仕方ないか。もういいよ。",
            "gloss": {
              "en": "Well, that can't be helped. It's fine now.",
              "ko": "그럼 어쩔 수 없지. 이제 됐어."
            }
          },
          {
            "text": "まあ、無事でよかったよ。",
            "gloss": {
              "en": "Well, I'm glad you're okay.",
              "ko": "뭐, 무사해서 다행이야."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとう。次からは早めに家を出るようにするね。",
        "gloss": {
          "en": "Thanks. From now on I'll make sure to leave home earlier.",
          "ko": "고마워. 다음부터는 일찍 집에서 나오도록 할게."
        }
      },
      {
        "who": "them",
        "text": "うん。ていうか、お腹すいてない？",
        "gloss": {
          "en": "Okay. Anyway, aren't you hungry?",
          "ko": "응. 그건 그렇고, 배 안 고파?"
        },
        "alt": [
          {
            "text": "うん、そうして。で、とりあえずご飯でも行く？",
            "gloss": {
              "en": "Yeah, do that. So, shall we go get something to eat first?",
              "ko": "응, 그렇게 해. 그럼 일단 밥이라도 먹으러 갈래?"
            }
          },
          {
            "text": "期待してるよ。それより、お腹すいたね。",
            "gloss": {
              "en": "I'm counting on it. More importantly, I'm hungry.",
              "ko": "기대할게. 그보다 배고프다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "うん、行こう！お詫びに今日は私がおごるよ。",
        "gloss": {
          "en": "Yeah, let's go! To make up for it, today's on me.",
          "ko": "응, 가자! 미안하니까 오늘은 내가 쏠게."
        }
      },
      {
        "who": "them",
        "text": "え、いいの？やった！",
        "gloss": {
          "en": "Wait, really? Yay!",
          "ko": "어, 진짜? 아싸!"
        },
        "alt": [
          {
            "text": "マジで？ありがとう！",
            "gloss": {
              "en": "Seriously? Thanks!",
              "ko": "진짜? 고마워!"
            }
          },
          {
            "text": "ほんと？じゃあ、お言葉に甘えて。",
            "gloss": {
              "en": "Really? Then I'll take you up on that.",
              "ko": "정말? 그럼 사양 않고 얻어먹을게."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "もちろん。あそこのラーメン屋、おいしそうだから行ってみない？",
        "gloss": {
          "en": "Of course. That ramen place over there looks good, want to try it?",
          "ko": "당연하지. 저기 라면집 맛있어 보이는데 가 볼래?"
        }
      }
    ]
  },
  {
    "id": "ja-3-2",
    "name": {
      "text": [
        "パク"
      ],
      "en": [
        "Park"
      ],
      "ko": [
        "박"
      ]
    },
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "A problem with your hotel room while traveling",
      "ko": "여행 중 숙소 방에 문제가 생겼을 때 프런트에 전화하기"
    },
    "expressions": [
      "助かる"
    ],
    "grammar": [
      1,
      2,
      4,
      6
    ],
    "earlierGrammar": [
      "2:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、フロントでございます。",
        "gloss": {
          "en": "Hello, this is the front desk.",
          "ko": "네, 프런트입니다."
        }
      },
      {
        "who": "me",
        "text": "すみません、五〇三号室のパクですが、お湯が出ないんです。",
        "gloss": {
          "en": "Excuse me, this is Park in room five-oh-three. There's no hot water.",
          "ko": "저기요, 오백삼 호실 박인데요, 뜨거운 물이 안 나와요."
        }
      },
      {
        "who": "them",
        "text": "大変申し訳ございません。シャワーのお湯でしょうか。",
        "gloss": {
          "en": "I'm terribly sorry. Is it the shower?",
          "ko": "정말 죄송합니다. 샤워기 물 말씀이신가요?"
        },
        "alt": [
          {
            "text": "ご迷惑をおかけしております。お湯が出ないのは、シャワーでしょうか。",
            "gloss": {
              "en": "We apologize for the inconvenience. Is it the shower that has no hot water?",
              "ko": "불편을 드려 죄송합니다. 뜨거운 물이 안 나오는 게 샤워기인가요?"
            }
          },
          {
            "text": "申し訳ございません。浴室のシャワーでございますか。",
            "gloss": {
              "en": "I'm sorry. Is that the shower in the bathroom?",
              "ko": "죄송합니다. 욕실 샤워기 말씀이십니까?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "はい。十分くらい出しても、冷たいままなんです。",
        "gloss": {
          "en": "Yes. Even after running it for about ten minutes, it stays cold.",
          "ko": "네. 십 분쯤 틀어 놔도 계속 차가워요."
        }
      },
      {
        "who": "them",
        "text": "かしこまりました。すぐに係の者を向かわせます。",
        "gloss": {
          "en": "Understood. I'll send someone up right away.",
          "ko": "알겠습니다. 바로 담당 직원을 보내겠습니다."
        },
        "alt": [
          {
            "text": "承知いたしました。すぐにスタッフがお部屋に伺います。",
            "gloss": {
              "en": "Certainly. A staff member will come to your room right away.",
              "ko": "알겠습니다. 바로 직원이 방으로 찾아가겠습니다."
            }
          },
          {
            "text": "失礼いたしました。ただいま担当の者を向かわせますので。",
            "gloss": {
              "en": "Our apologies. I'm sending someone over now.",
              "ko": "실례했습니다. 지금 담당자를 보내 드리겠습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとうございます。どのくらいかかりそうですか。",
        "gloss": {
          "en": "Thank you. About how long will it take?",
          "ko": "감사합니다. 얼마나 걸릴 것 같아요?"
        }
      },
      {
        "who": "them",
        "text": "十分ほどで伺えると思います。",
        "gloss": {
          "en": "I think we can be there in about ten minutes.",
          "ko": "십 분 정도면 찾아갈 수 있을 것 같습니다."
        },
        "alt": [
          {
            "text": "十分ほどで参ります。",
            "gloss": {
              "en": "We'll be there in about ten minutes.",
              "ko": "십 분 정도면 가겠습니다."
            }
          },
          {
            "text": "すぐに参りますが、十分ほどお待ちいただけますか。",
            "gloss": {
              "en": "We'll come right away, but could you wait about ten minutes?",
              "ko": "곧 가겠습니다만, 십 분 정도 기다려 주실 수 있을까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "わかりました。もし直らなかったら、部屋を変えてもらえますか。",
        "gloss": {
          "en": "Okay. If it can't be fixed, could I change rooms?",
          "ko": "알겠어요. 혹시 안 고쳐지면 방을 바꿔 주실 수 있어요?"
        }
      },
      {
        "who": "them",
        "text": "はい、その場合は別のお部屋をご用意いたします。",
        "gloss": {
          "en": "Yes, in that case we'll prepare another room for you.",
          "ko": "네, 그 경우에는 다른 방을 준비해 드리겠습니다."
        },
        "alt": [
          {
            "text": "もちろんでございます。空いているお部屋をお探しします。",
            "gloss": {
              "en": "Of course. We'll look for an available room.",
              "ko": "물론입니다. 빈방을 찾아보겠습니다."
            }
          },
          {
            "text": "かしこまりました。その際は別のお部屋にご案内いたします。",
            "gloss": {
              "en": "Certainly. In that case we'll show you to another room.",
              "ko": "알겠습니다. 그때는 다른 방으로 안내해 드리겠습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "助かります。明日の朝が早いので、今夜はゆっくり休みたいんです。",
        "gloss": {
          "en": "That's a relief. I have an early morning tomorrow, so I'd like to rest well tonight.",
          "ko": "다행이에요. 내일 아침 일찍 나가야 해서 오늘 밤은 푹 쉬고 싶거든요."
        }
      },
      {
        "who": "them",
        "text": "さようでございますか。ご不便をおかけして、本当に申し訳ございません。",
        "gloss": {
          "en": "I see. We're truly sorry for the inconvenience.",
          "ko": "그러시군요. 불편을 드려 정말 죄송합니다."
        },
        "alt": [
          {
            "text": "承知いたしました。できるだけ急ぎます。",
            "gloss": {
              "en": "Understood. We'll be as quick as we can.",
              "ko": "알겠습니다. 최대한 서두르겠습니다."
            }
          },
          {
            "text": "かしこまりました。何かございましたら、いつでもお電話ください。",
            "gloss": {
              "en": "Certainly. If there's anything else, please call anytime.",
              "ko": "알겠습니다. 무슨 일 있으시면 언제든 전화 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "いえいえ。よろしくお願いします。",
        "gloss": {
          "en": "Not at all. Thank you for your help.",
          "ko": "아니에요. 잘 부탁드려요."
        }
      }
    ]
  },
  {
    "id": "ja-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Chatting with a friend about hobbies and a show you watched",
      "ko": "친구와 취미와 본 드라마 이야기"
    },
    "expressions": [
      "そういえば"
    ],
    "grammar": [
      0,
      3,
      4,
      7
    ],
    "earlierGrammar": [
      "2:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "最近、休みの日は何してるの？",
        "gloss": {
          "en": "What have you been doing on your days off lately?",
          "ko": "요즘 쉬는 날엔 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "最近は料理にハマってて、週末はパンを焼いてるんだ。",
        "gloss": {
          "en": "Lately I'm really into cooking, so I bake bread on weekends.",
          "ko": "요즘 요리에 빠져서 주말엔 빵 굽고 있어."
        }
      },
      {
        "who": "them",
        "text": "へえ、すごい！パンって難しそう。",
        "gloss": {
          "en": "Wow, impressive! Bread sounds hard.",
          "ko": "오, 대단하다! 빵은 어려울 것 같은데."
        },
        "alt": [
          {
            "text": "えー、意外！パンなんて作れるの？",
            "gloss": {
              "en": "No way, I didn't expect that! You can make bread?",
              "ko": "헐, 의외다! 빵 같은 것도 만들 줄 알아?"
            }
          },
          {
            "text": "パン？本格的だね。",
            "gloss": {
              "en": "Bread? That's serious stuff.",
              "ko": "빵? 본격적이네."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "最初は全然ふくらまなかったけど、最近やっとうまく焼けるようになったよ。",
        "gloss": {
          "en": "At first it wouldn't rise at all, but recently I've finally been able to bake it well.",
          "ko": "처음엔 전혀 안 부풀었는데, 요즘 겨우 잘 구울 수 있게 됐어."
        }
      },
      {
        "who": "them",
        "text": "いいなあ。今度食べてみたい。",
        "gloss": {
          "en": "Lucky. I'd love to try some sometime.",
          "ko": "좋겠다. 다음에 먹어 보고 싶어."
        },
        "alt": [
          {
            "text": "すごいじゃん。今度ちょうだいよ。",
            "gloss": {
              "en": "That's great. Give me some next time.",
              "ko": "대단한데. 다음에 좀 줘."
            }
          },
          {
            "text": "いいね。今度食べさせてよ。",
            "gloss": {
              "en": "Nice. Let me have some next time.",
              "ko": "좋네. 다음에 먹게 해 줘."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "いいよ。そういえば、この前言ってたドラマ、見たよ。",
        "gloss": {
          "en": "Sure. Oh, by the way, I watched that drama you mentioned.",
          "ko": "좋아. 그러고 보니 저번에 말한 드라마 봤어."
        }
      },
      {
        "who": "them",
        "text": "え、ほんと？どうだった？",
        "gloss": {
          "en": "Oh, really? How was it?",
          "ko": "어, 진짜? 어땠어?"
        },
        "alt": [
          {
            "text": "マジで？面白かったでしょ？",
            "gloss": {
              "en": "Seriously? It was good, right?",
              "ko": "진짜? 재밌었지?"
            }
          },
          {
            "text": "あ、見たんだ！どこまで見た？",
            "gloss": {
              "en": "Oh, you watched it! How far did you get?",
              "ko": "아, 봤구나! 어디까지 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "すごく面白かった！一話だけのつもりが、結局最後まで見ちゃった。",
        "gloss": {
          "en": "It was so good! I meant to watch just one episode, but ended up watching to the end.",
          "ko": "엄청 재밌었어! 한 화만 보려다가 결국 끝까지 봐 버렸어."
        }
      },
      {
        "who": "them",
        "text": "わかる！あの主人公、かっこいいよね。",
        "gloss": {
          "en": "I know, right! The main character is so cool.",
          "ko": "알지! 그 주인공 멋있지?"
        },
        "alt": [
          {
            "text": "でしょ？やっぱり主人公がいいよね。",
            "gloss": {
              "en": "Right? The main character really makes it.",
              "ko": "그치? 역시 주인공이 좋지."
            }
          },
          {
            "text": "だよね。主人公の演技、よかったよね。",
            "gloss": {
              "en": "Right. The lead's acting was great.",
              "ko": "그치. 주인공 연기 좋았지."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "うん。でも、私は弟のほうが好きかな。最後はちょっとかわいそうだったと思う。",
        "gloss": {
          "en": "Yeah. But I think I like the younger brother more. I felt kind of sorry for him at the end.",
          "ko": "응. 근데 난 남동생이 더 좋은 것 같아. 마지막엔 좀 불쌍했던 것 같아."
        }
      },
      {
        "who": "them",
        "text": "確かに。じゃあ、シーズン二が出たら一緒に見ようよ。",
        "gloss": {
          "en": "True. Then let's watch season two together when it comes out.",
          "ko": "확실히. 그럼 시즌 투 나오면 같이 보자."
        },
        "alt": [
          {
            "text": "なるほどね。続きが出たら、うちで一緒に見ない？",
            "gloss": {
              "en": "I see. When the next part comes out, want to watch it at my place?",
              "ko": "그렇구나. 다음 편 나오면 우리 집에서 같이 볼래?"
            }
          },
          {
            "text": "そうかも。次のシーズンが出たら、一緒に見る？",
            "gloss": {
              "en": "Maybe so. Want to watch the next season together when it's out?",
              "ko": "그럴지도. 다음 시즌 나오면 같이 볼래?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "いいね！そのときはパンを焼いて持っていくよ。",
        "gloss": {
          "en": "Sounds good! I'll bake some bread and bring it then.",
          "ko": "좋아! 그때 빵 구워서 가져갈게."
        }
      }
    ]
  },
  {
    "id": "ja-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Asking a coworker for help with a task",
      "ko": "동료에게 일 도움 청하기"
    },
    "expressions": [
      "実は",
      "助かる",
      "よかったら",
      "なるほど",
      "とりあえず"
    ],
    "grammar": [
      1,
      2,
      4,
      6,
      7
    ],
    "earlierGrammar": [
      "2:7",
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "お疲れさまです。なんだか忙しそうですね。",
        "gloss": {
          "en": "Hey, good work. You look kind of busy.",
          "ko": "수고하세요. 왠지 바빠 보이네요."
        }
      },
      {
        "who": "me",
        "text": "そうなんです。実は、明日までに資料を作らなきゃいけないんですけど、終わりそうになくて。",
        "gloss": {
          "en": "I am. Actually, I have to make materials by tomorrow, but it doesn't look like I'll finish.",
          "ko": "그러게요. 실은 내일까지 자료를 만들어야 하는데, 못 끝낼 것 같아서요."
        }
      },
      {
        "who": "them",
        "text": "大変ですね。何か手伝いましょうか。",
        "gloss": {
          "en": "That's rough. Shall I help with something?",
          "ko": "힘드시겠네요. 뭐 좀 도와드릴까요?"
        },
        "alt": [
          {
            "text": "それは大変ですね。私にできること、ありますか。",
            "gloss": {
              "en": "That's tough. Is there anything I can do?",
              "ko": "그거 큰일이네요. 제가 할 수 있는 거 있어요?"
            }
          },
          {
            "text": "え、明日までですか。手伝えることがあったら言ってください。",
            "gloss": {
              "en": "What, by tomorrow? Let me know if there's anything I can help with.",
              "ko": "어, 내일까지요? 도울 수 있는 거 있으면 말해 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "本当ですか。助かります。グラフを作るのが苦手で…。もしよかったら、見てもらえますか。",
        "gloss": {
          "en": "Really? That would help. I'm bad at making graphs... If you don't mind, could you take a look?",
          "ko": "정말요? 살았다. 그래프 만드는 게 서툴러서요…. 괜찮으면 봐 주실 수 있어요?"
        }
      },
      {
        "who": "them",
        "text": "いいですよ。今からでも大丈夫ですか。",
        "gloss": {
          "en": "Sure. Is right now okay?",
          "ko": "좋아요. 지금 바로 봐도 돼요?"
        },
        "alt": [
          {
            "text": "もちろんです。今ちょっと見ましょうか。",
            "gloss": {
              "en": "Of course. Shall I take a quick look now?",
              "ko": "물론이죠. 지금 잠깐 볼까요?"
            }
          },
          {
            "text": "いいですよ。どのデータですか。",
            "gloss": {
              "en": "Sure. Which data is it?",
              "ko": "좋아요. 어떤 데이터예요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとうございます。この売り上げのデータなんですけど、どうすれば見やすくなりますか。",
        "gloss": {
          "en": "Thank you. It's this sales data. How can I make it easier to read?",
          "ko": "고마워요. 이 매출 데이터인데요, 어떻게 하면 보기 쉬워질까요?"
        }
      },
      {
        "who": "them",
        "text": "そうですね…月ごとに分けて、棒グラフにしたらいいと思いますよ。",
        "gloss": {
          "en": "Let's see... I think splitting it by month into a bar chart would work.",
          "ko": "글쎄요…. 월별로 나눠서 막대그래프로 하면 좋을 것 같아요."
        },
        "alt": [
          {
            "text": "うーん、月ごとの棒グラフにすると、分かりやすいかもしれません。",
            "gloss": {
              "en": "Hmm, a monthly bar chart might make it easier to understand.",
              "ko": "음, 월별 막대그래프로 하면 알아보기 쉬울지도 몰라요."
            }
          },
          {
            "text": "これなら、折れ線グラフのほうがいいと思います。",
            "gloss": {
              "en": "For this, I think a line graph would be better.",
              "ko": "이거라면 꺾은선그래프가 나을 것 같아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "なるほど。それなら私にもできそうです。",
        "gloss": {
          "en": "I see. I think even I can do that.",
          "ko": "그렇군요. 그거라면 저도 할 수 있을 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "分からないところがあったら、また聞いてください。",
        "gloss": {
          "en": "If there's anything you don't get, just ask me again.",
          "ko": "모르는 데 있으면 또 물어보세요."
        },
        "alt": [
          {
            "text": "途中で一回見せてくれれば、チェックしますよ。",
            "gloss": {
              "en": "If you show me once partway through, I'll check it.",
              "ko": "중간에 한 번 보여 주면 체크해 줄게요."
            }
          },
          {
            "text": "無理しないでくださいね。",
            "gloss": {
              "en": "Don't push yourself too hard.",
              "ko": "무리하지 마세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとうございます。今度、ランチおごりますね。",
        "gloss": {
          "en": "Thank you. I'll buy you lunch sometime.",
          "ko": "고마워요. 다음에 점심 살게요."
        }
      },
      {
        "who": "them",
        "text": "え、いいんですか。じゃあ、楽しみにしてます。",
        "gloss": {
          "en": "Oh, are you sure? Then I'll look forward to it.",
          "ko": "어, 그래도 돼요? 그럼 기대할게요."
        },
        "alt": [
          {
            "text": "気にしないでください。お互いさまですから。",
            "gloss": {
              "en": "Don't worry about it. We all help each other out.",
              "ko": "신경 쓰지 마세요. 서로 돕는 거죠."
            }
          },
          {
            "text": "ほんとですか？じゃあ、遠慮なく。",
            "gloss": {
              "en": "Really? Then I won't say no.",
              "ko": "정말요? 그럼 사양 안 할게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "いえいえ、本当に助かりましたから。じゃあ、とりあえずやってみます。",
        "gloss": {
          "en": "No, really, you've been a big help. Well, I'll give it a try for now.",
          "ko": "아니에요, 정말 도움 됐으니까요. 그럼 일단 해 볼게요."
        }
      }
    ]
  },
  {
    "id": "ja-3-x1",
    "stage": 3,
    "setting": {
      "en": "Sharing good news with a friend",
      "ko": "친구에게 좋은 소식 전하기"
    },
    "expressions": [
      "ちょっと聞いてよ",
      "マジで",
      "そうなんだ",
      "無理しないで"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "どうしたの？なんか嬉しそうだね。",
        "gloss": {
          "en": "What's up? You look kind of happy.",
          "ko": "무슨 일이야? 왠지 기분 좋아 보이네."
        }
      },
      {
        "who": "me",
        "text": "ちょっと聞いてよ！好きなバンドの大阪ライブ、チケット当たったんだ！",
        "gloss": {
          "en": "Listen to this! I won tickets to my favorite band's show in Osaka!",
          "ko": "내 말 좀 들어 봐! 좋아하는 밴드 오사카 공연 티켓 당첨됐어!"
        }
      },
      {
        "who": "them",
        "text": "え、大阪？実は私、来月から大阪で働くことになったんだよね。",
        "gloss": {
          "en": "Wait, Osaka? Actually, I'm going to start working in Osaka next month.",
          "ko": "어, 오사카? 실은 나 다음 달부터 오사카에서 일하게 됐거든."
        }
      },
      {
        "who": "me",
        "text": "マジで？じゃあ、向こうで会えるじゃん！",
        "gloss": {
          "en": "Seriously? Then we can meet up there!",
          "ko": "진짜? 그럼 거기서 만날 수 있잖아!"
        }
      },
      {
        "who": "them",
        "text": "うん。でも今、引っ越しの準備で毎日バタバタでさ。",
        "gloss": {
          "en": "Yeah. But right now I'm swamped every day getting ready to move.",
          "ko": "응. 근데 지금 이사 준비 때문에 매일 정신없어."
        }
      },
      {
        "who": "me",
        "text": "そうなんだ。無理しないでね。手伝えることがあったら言って。",
        "gloss": {
          "en": "I see. Don't overdo it. Tell me if there's anything I can help with.",
          "ko": "그렇구나. 무리하지 마. 도울 거 있으면 말해."
        }
      }
    ]
  },
  {
    "id": "ja-3-x2",
    "stage": 3,
    "setting": {
      "en": "Rushing for the last train",
      "ko": "막차 타러 뛰기"
    },
    "expressions": [
      "どうしよう",
      "間に合った",
      "確かに"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "やばい、もう十一時半だよ。終電、何時だっけ？",
        "gloss": {
          "en": "Oh no, it's already eleven thirty. What time is the last train again?",
          "ko": "큰일이다, 벌써 열한 시 반이야. 막차 몇 시였지?"
        }
      },
      {
        "who": "me",
        "text": "十一時四十五分！どうしよう、走らないと。",
        "gloss": {
          "en": "Eleven forty-five! What do I do, I have to run.",
          "ko": "열한 시 사십오 분! 어떡해, 뛰어야겠다."
        }
      },
      {
        "who": "them",
        "text": "駅まで走ればギリギリいけるよ。…はあ、乗れた！",
        "gloss": {
          "en": "If we run to the station we can just make it. ...Phew, we got on!",
          "ko": "역까지 뛰면 아슬아슬하게 돼. …하아, 탔다!"
        }
      },
      {
        "who": "me",
        "text": "よかった…間に合った！",
        "gloss": {
          "en": "Thank goodness... we made it!",
          "ko": "다행이다… 늦지 않았어!"
        }
      },
      {
        "who": "them",
        "text": "次はもうちょっと早くお店を出ようね。",
        "gloss": {
          "en": "Next time let's leave the place a bit earlier.",
          "ko": "다음엔 가게에서 좀 더 일찍 나오자."
        }
      },
      {
        "who": "me",
        "text": "確かに。次は時計を見ながら飲もう。",
        "gloss": {
          "en": "True. Next time let's keep an eye on the clock while we drink.",
          "ko": "맞아. 다음엔 시계 보면서 마시자."
        }
      }
    ]
  },
  {
    "id": "ja-3-x3",
    "stage": 3,
    "setting": {
      "en": "A friend lost your umbrella",
      "ko": "친구가 빌려 간 우산을 잃어버림"
    },
    "expressions": [
      "別にいいよ",
      "仕方ない",
      "気にしないで"
    ],
    "grammar": [
      0,
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "ごめん、この前借りた傘、電車に忘れちゃった…。",
        "gloss": {
          "en": "Sorry, I left the umbrella I borrowed the other day on the train...",
          "ko": "미안, 저번에 빌린 우산 전철에 두고 내렸어…."
        }
      },
      {
        "who": "me",
        "text": "え、そうなの？まあ、別にいいよ。安い傘だったし。",
        "gloss": {
          "en": "Oh, really? Well, it's fine. It was a cheap one anyway.",
          "ko": "어, 그래? 뭐, 괜찮아. 싼 우산이었고."
        }
      },
      {
        "who": "them",
        "text": "駅にも問い合わせたんだけど、見つからなくて。",
        "gloss": {
          "en": "I asked the station too, but they couldn't find it.",
          "ko": "역에도 물어봤는데 못 찾았대."
        }
      },
      {
        "who": "me",
        "text": "それなら仕方ないよ。気にしないで。",
        "gloss": {
          "en": "Then it can't be helped. Don't worry about it.",
          "ko": "그럼 어쩔 수 없지. 신경 쓰지 마."
        }
      },
      {
        "who": "them",
        "text": "ありがとう。今度、新しいの買って返すね。",
        "gloss": {
          "en": "Thanks. I'll buy you a new one next time.",
          "ko": "고마워. 다음에 새 거 사서 줄게."
        }
      },
      {
        "who": "me",
        "text": "いいって。それより、今日のランチどこ行く？",
        "gloss": {
          "en": "Don't bother. More importantly, where should we go for lunch today?",
          "ko": "됐어. 그보다 오늘 점심 어디 갈래?"
        }
      }
    ]
  },
  {
    "id": "ja-3-x4",
    "stage": 3,
    "setting": {
      "en": "Invited on a hot spring trip",
      "ko": "온천 여행에 초대받음"
    },
    "expressions": [
      "考えとく",
      "やっぱり",
      "せっかくだから"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      7
    ],
    "earlierGrammar": [
      "2:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "来月、みんなで箱根の温泉に行くんだけど、来ない？",
        "gloss": {
          "en": "We're all going to a hot spring in Hakone next month. Want to come?",
          "ko": "다음 달에 다 같이 하코네 온천 가는데, 안 올래?"
        }
      },
      {
        "who": "me",
        "text": "いいね！でも、来月はバイトが忙しいんだよね。ちょっと考えとく。",
        "gloss": {
          "en": "Sounds nice! But my part-time job is busy next month. I'll think about it.",
          "ko": "좋다! 근데 다음 달엔 알바가 바빠서. 좀 생각해 볼게."
        }
      },
      {
        "who": "them",
        "text": "分かった。一泊の予定だけど、日帰りでも大丈夫だよ。",
        "gloss": {
          "en": "Okay. We're planning one night, but a day trip is fine too.",
          "ko": "알았어. 1박 예정인데 당일치기도 괜찮아."
        }
      },
      {
        "who": "me",
        "text": "日帰りならいけるかも。…うん、やっぱり行く！",
        "gloss": {
          "en": "A day trip might work. ...Yeah, I'll go after all!",
          "ko": "당일치기면 될지도. …응, 역시 갈래!"
        }
      },
      {
        "who": "them",
        "text": "やった！じゃあ、みんなに言っとくね。",
        "gloss": {
          "en": "Yay! Then I'll let everyone know.",
          "ko": "앗싸! 그럼 다들한테 말해 둘게."
        }
      },
      {
        "who": "me",
        "text": "せっかくだから、温泉のあとにおいしいものも食べたいな。",
        "gloss": {
          "en": "Since we're going all that way, I'd like to eat something good after the hot spring too.",
          "ko": "모처럼 가는 거니까 온천 끝나고 맛있는 것도 먹고 싶다."
        }
      }
    ]
  },
  {
    "id": "ja-4-1",
    "name": {
      "text": [
        "チェン"
      ],
      "en": [
        "Chen"
      ],
      "ko": [
        "첸"
      ]
    },
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Phoning a client about a delayed delivery",
      "ko": "거래처에 납품 지연을 전화로 알리기"
    },
    "expressions": [
      "お世話になっております",
      "ご迷惑をおかけしました",
      "申し訳ございません",
      "確認してまいります",
      "かしこまりました",
      "後ほどご連絡します",
      "失礼いたします"
    ],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "はい、さくら食品でございます。",
        "gloss": {
          "en": "Hello, Sakura Foods.",
          "ko": "네, 사쿠라식품입니다."
        }
      },
      {
        "who": "me",
        "text": "お世話になっております。東和パッケージのチェンと申します。購買部の木村様はいらっしゃいますか。",
        "gloss": {
          "en": "Thank you for your continued business. My name is Chen from Towa Packaging. Is Mr. Kimura in purchasing available?",
          "ko": "늘 신세 지고 있습니다. 도와패키지의 첸이라고 합니다. 구매부 기무라 님 계십니까?"
        }
      },
      {
        "who": "them",
        "text": "いつもお世話になっております。木村ですね。少々お待ちください。",
        "gloss": {
          "en": "Thank you for your business as always. Kimura, you said? One moment, please.",
          "ko": "늘 신세 지고 있습니다. 기무라 말씀이시죠. 잠시만 기다려 주세요."
        },
        "alt": [
          {
            "text": "東和パッケージのチェン様ですね。ただいまおつなぎいたします。",
            "gloss": {
              "en": "Ms. Chen from Towa Packaging, yes? I'll put you through now.",
              "ko": "도와패키지의 첸 님이시군요. 지금 연결해 드리겠습니다."
            }
          },
          {
            "text": "お世話になっております。木村に代わりますので、少々お待ちください。",
            "gloss": {
              "en": "Thank you for your business. I'll get Kimura for you, so please hold.",
              "ko": "신세 지고 있습니다. 기무라 바꿔 드릴 테니 잠시만 기다려 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "よろしくお願いいたします。",
        "gloss": {
          "en": "Thank you very much.",
          "ko": "부탁드립니다."
        }
      },
      {
        "who": "them",
        "text": "お電話代わりました、木村です。",
        "gloss": {
          "en": "Kimura speaking, I've taken over the call.",
          "ko": "전화 바꿨습니다, 기무라입니다."
        },
        "alt": [
          {
            "text": "はい、木村です。お待たせしました。",
            "gloss": {
              "en": "Yes, this is Kimura. Sorry to keep you waiting.",
              "ko": "네, 기무라입니다. 기다리셨죠."
            }
          },
          {
            "text": "お待たせいたしました。木村でございます。",
            "gloss": {
              "en": "Sorry to have kept you waiting. This is Kimura.",
              "ko": "오래 기다리셨습니다. 기무라입니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "お世話になっております。大変申し上げにくいのですが、来週月曜日に納品予定の箱が、工場のトラブルで遅れることになりました。",
        "gloss": {
          "en": "Thank you for your business. I'm very sorry to have to tell you, but the boxes scheduled for delivery next Monday are going to be delayed due to a problem at the factory.",
          "ko": "늘 신세 지고 있습니다. 정말 말씀드리기 어렵습니다만, 다음 주 월요일 납품 예정이던 상자가 공장 문제로 늦어지게 되었습니다."
        }
      },
      {
        "who": "them",
        "text": "えっ、そうなんですか。どのくらい遅れそうですか。",
        "gloss": {
          "en": "Oh, really? About how late will they be?",
          "ko": "네? 그래요? 얼마나 늦어질 것 같아요?"
        },
        "alt": [
          {
            "text": "そうですか…。いつごろになりそうでしょうか。",
            "gloss": {
              "en": "I see... Around when do you think they'll come?",
              "ko": "그래요…. 언제쯤 될 것 같습니까?"
            }
          },
          {
            "text": "それは困りましたね。何日ぐらい遅れるんでしょうか。",
            "gloss": {
              "en": "That's a problem. How many days late will they be?",
              "ko": "그거 곤란하네요. 며칠 정도 늦어지는 건가요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "今のところ、三日ほど遅れる見込みです。ご迷惑をおかけして、大変申し訳ございません。",
        "gloss": {
          "en": "At the moment we expect about a three-day delay. We sincerely apologize for the inconvenience.",
          "ko": "현재로서는 사흘 정도 늦어질 전망입니다. 폐를 끼쳐 대단히 죄송합니다."
        }
      },
      {
        "who": "them",
        "text": "三日ですか…。木曜日に新商品の発売があるので、それだと間に合わないんですよ。",
        "gloss": {
          "en": "Three days... We're launching a new product on Thursday, so that won't make it in time.",
          "ko": "사흘이요…. 목요일에 신상품 발매가 있어서 그러면 못 맞춰요."
        },
        "alt": [
          {
            "text": "うーん、木曜日から新商品の販売が始まるので、困りますね。",
            "gloss": {
              "en": "Hmm, the new product goes on sale Thursday, so that's a problem.",
              "ko": "음, 목요일부터 신상품 판매가 시작돼서 곤란하네요."
            }
          },
          {
            "text": "そうなると、木曜日の発売に間に合わないかもしれません。",
            "gloss": {
              "en": "In that case, we might not make the Thursday launch.",
              "ko": "그렇게 되면 목요일 발매에 못 맞출지도 모르겠네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "さようでございますか。でしたら、半分だけでも先にお届けできるよう、工場に確認してまいります。",
        "gloss": {
          "en": "I see. In that case, I'll check with the factory so we can deliver at least half ahead of time.",
          "ko": "그러시군요. 그렇다면 절반만이라도 먼저 납품할 수 있도록 공장에 확인해 보겠습니다."
        }
      },
      {
        "who": "them",
        "text": "それは助かります。半分あれば、何とかなると思います。",
        "gloss": {
          "en": "That would help. With half, I think we can manage.",
          "ko": "그거 도움이 되네요. 절반만 있으면 어떻게든 될 것 같아요."
        },
        "alt": [
          {
            "text": "そうしていただけると助かります。",
            "gloss": {
              "en": "It would help if you could do that.",
              "ko": "그렇게 해 주시면 정말 도움이 됩니다."
            }
          },
          {
            "text": "半分でもあれば店頭には並べられますので、ぜひお願いします。",
            "gloss": {
              "en": "Even half would let us stock the shelves, so please do.",
              "ko": "절반이라도 있으면 매장에 진열할 수 있으니 꼭 부탁드려요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "かしこまりました。本日中に確認いたしまして、後ほどご連絡いたします。",
        "gloss": {
          "en": "Certainly. I'll confirm today and get back to you later.",
          "ko": "알겠습니다. 오늘 중으로 확인해서 나중에 연락드리겠습니다."
        }
      },
      {
        "who": "them",
        "text": "承知しました。では、ご連絡お待ちしております。",
        "gloss": {
          "en": "Understood. I'll wait to hear from you, then.",
          "ko": "알겠습니다. 그럼 연락 기다리겠습니다."
        },
        "alt": [
          {
            "text": "分かりました。よろしくお願いします。",
            "gloss": {
              "en": "All right. Thank you.",
              "ko": "알겠습니다. 잘 부탁드려요."
            }
          },
          {
            "text": "では、ご連絡をお待ちしています。お手数ですが、よろしくお願いします。",
            "gloss": {
              "en": "Then I'll wait for your call. Sorry for the trouble, and thank you.",
              "ko": "그럼 연락 기다리겠습니다. 번거로우시겠지만 잘 부탁드립니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "このたびはご迷惑をおかけして、申し訳ございません。それでは、失礼いたします。",
        "gloss": {
          "en": "Once again, we're very sorry for the trouble. Goodbye, then.",
          "ko": "이번에 폐를 끼쳐 죄송합니다. 그럼 이만 끊겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Discussing a release schedule in a team meeting",
      "ko": "팀 회의에서 출시 일정 논의"
    },
    "expressions": [
      "おっしゃる通りです",
      "承知しました"
    ],
    "grammar": [
      0,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "では、次はアプリのリリース日についてです。予定通り、来月十日でいいでしょうか。",
        "gloss": {
          "en": "Next, the app release date. Are we fine with the tenth of next month as planned?",
          "ko": "그럼 다음은 앱 출시일입니다. 예정대로 다음 달 십 일로 괜찮을까요?"
        }
      },
      {
        "who": "me",
        "text": "すみません、一点よろしいでしょうか。",
        "gloss": {
          "en": "Excuse me, may I raise one point?",
          "ko": "죄송합니다, 한 가지 말씀드려도 될까요?"
        }
      },
      {
        "who": "them",
        "text": "はい、どうぞ。",
        "gloss": {
          "en": "Yes, go ahead.",
          "ko": "네, 말씀하세요."
        },
        "alt": [
          {
            "text": "ええ、どうぞ。何か気になる点がありますか。",
            "gloss": {
              "en": "Sure, go ahead. Is something bothering you?",
              "ko": "네, 하세요. 뭔가 걸리는 점이 있나요?"
            }
          },
          {
            "text": "はい、何でしょうか。",
            "gloss": {
              "en": "Yes, what is it?",
              "ko": "네, 뭔가요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "反対しているわけではないのですが、テスト期間が一週間しかないのは、少し厳しいのではないかと思います。",
        "gloss": {
          "en": "It's not that I'm against it, but I think having only one week for testing is a bit tight.",
          "ko": "반대하는 건 아닙니다만, 테스트 기간이 일주일밖에 없는 건 좀 빠듯하지 않을까 싶습니다."
        }
      },
      {
        "who": "them",
        "text": "とおっしゃいますと？",
        "gloss": {
          "en": "Meaning what, exactly?",
          "ko": "그 말씀은요?"
        },
        "alt": [
          {
            "text": "具体的には、どのあたりが心配ですか。",
            "gloss": {
              "en": "Specifically, what part are you worried about?",
              "ko": "구체적으로 어느 부분이 걱정되세요?"
            }
          },
          {
            "text": "なるほど。どういうところが厳しいですか。",
            "gloss": {
              "en": "I see. In what way is it tight?",
              "ko": "그렇군요. 어떤 점이 빠듯한가요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "先月の更新でも、テストが十分にできず、リリース後にユーザーから多くの不具合を報告されました。",
        "gloss": {
          "en": "With last month's update too, we couldn't test enough, and after release users reported a lot of bugs.",
          "ko": "지난달 업데이트 때도 테스트를 충분히 못 해서 출시 후에 사용자들에게 버그를 많이 신고받았습니다."
        }
      },
      {
        "who": "them",
        "text": "確かに、あのときは対応が大変でしたね。",
        "gloss": {
          "en": "True, handling that was tough.",
          "ko": "확실히 그때는 대응이 힘들었죠."
        },
        "alt": [
          {
            "text": "ああ、あの件ですね。確かに問い合わせが多かったです。",
            "gloss": {
              "en": "Ah, that matter. We did get a lot of inquiries.",
              "ko": "아, 그 건이요. 확실히 문의가 많았어요."
            }
          },
          {
            "text": "そうでしたね。あれでかなりクレームが来ましたからね。",
            "gloss": {
              "en": "That's right. We got quite a few complaints from that.",
              "ko": "그랬죠. 그것 때문에 클레임이 꽤 들어왔으니까요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "はい。そこで、リリースを一週間遅らせて、その分をテストに回すのはいかがでしょうか。",
        "gloss": {
          "en": "Yes. So how about pushing the release back a week and putting that time into testing?",
          "ko": "네. 그래서 출시를 일주일 미루고 그만큼을 테스트에 돌리는 건 어떨까요?"
        }
      },
      {
        "who": "them",
        "text": "でも、遅らせれば遅らせるほど、競合に先を越されるリスクもありますよね。",
        "gloss": {
          "en": "But the more we delay, the bigger the risk that competitors beat us to it.",
          "ko": "하지만 늦추면 늦출수록 경쟁사에 선수를 빼앗길 위험도 있잖아요."
        },
        "alt": [
          {
            "text": "ただ、来月十日というのは、もう営業に伝えてあるんですよ。",
            "gloss": {
              "en": "The thing is, we've already told sales it's the tenth of next month.",
              "ko": "다만 다음 달 십 일이라는 건 이미 영업 쪽에 전달해 뒀거든요."
            }
          },
          {
            "text": "うーん、日程をずらすと、キャンペーンにも影響が出ますよね。",
            "gloss": {
              "en": "Hmm, moving the date would affect the campaign too.",
              "ko": "음, 일정을 옮기면 캠페인에도 영향이 가잖아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "おっしゃる通りです。では、日程はそのままにして、ほかのチームにテストを手伝ってもらうことはできないでしょうか。",
        "gloss": {
          "en": "You're right. Then could we keep the date as is and have another team help with testing?",
          "ko": "말씀하신 대로입니다. 그럼 일정은 그대로 두고 다른 팀에 테스트를 도와 달라고 할 수는 없을까요?"
        }
      },
      {
        "who": "them",
        "text": "なるほど。デザインチームなら、来週は少し手が空くと思います。",
        "gloss": {
          "en": "I see. The design team should have some free time next week.",
          "ko": "그렇군요. 디자인팀이라면 다음 주에 손이 좀 빌 거예요."
        },
        "alt": [
          {
            "text": "それならいけそうですね。品質保証チームにも相談してみましょうか。",
            "gloss": {
              "en": "That might work. Shall we consult the QA team too?",
              "ko": "그거라면 될 것 같네요. 품질보증팀에도 상의해 볼까요?"
            }
          },
          {
            "text": "なるほど、それは考えていませんでした。",
            "gloss": {
              "en": "I see, I hadn't thought of that.",
              "ko": "그렇군요, 그건 생각 못 했네요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとうございます。よろしければ、その調整は私に担当させてください。",
        "gloss": {
          "en": "Thank you. If it's all right, please let me handle arranging that.",
          "ko": "감사합니다. 괜찮으시다면 그 조율은 제가 맡게 해 주세요."
        }
      },
      {
        "who": "them",
        "text": "分かりました。では、日程は変えずに、テストの体制を強化することにしましょう。",
        "gloss": {
          "en": "All right. Then let's keep the date and strengthen the testing setup.",
          "ko": "알겠습니다. 그럼 일정은 바꾸지 않고 테스트 체제를 강화하기로 합시다."
        },
        "alt": [
          {
            "text": "じゃあ、お願いします。結果は金曜日の会議で共有してください。",
            "gloss": {
              "en": "Then please go ahead. Share the outcome at Friday's meeting.",
              "ko": "그럼 부탁해요. 결과는 금요일 회의에서 공유해 주세요."
            }
          },
          {
            "text": "助かります。では、その方向で進めましょう。",
            "gloss": {
              "en": "That helps. Let's move ahead in that direction.",
              "ko": "도움이 되네요. 그럼 그 방향으로 진행합시다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "承知しました。金曜日までに、体制案をまとめてご報告します。",
        "gloss": {
          "en": "Understood. I'll put together a plan for the setup and report by Friday.",
          "ko": "알겠습니다. 금요일까지 체제안을 정리해서 보고드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Signing a rental contract at a real estate agency",
      "ko": "부동산에서 집 계약하기"
    },
    "expressions": [
      "承知しました",
      "念のため"
    ],
    "grammar": [
      1,
      2
    ],
    "earlierGrammar": [
      "2:4",
      "3:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "お待たせいたしました。本日はご契約ということで、よろしくお願いいたします。",
        "gloss": {
          "en": "Thank you for waiting. I understand you're here to sign the contract today.",
          "ko": "기다리셨습니다. 오늘은 계약하러 오셨죠. 잘 부탁드립니다."
        }
      },
      {
        "who": "me",
        "text": "よろしくお願いします。",
        "gloss": {
          "en": "Thank you, likewise.",
          "ko": "잘 부탁드립니다."
        }
      },
      {
        "who": "them",
        "text": "まず、こちらの重要事項説明書について、ご説明させていただきます。",
        "gloss": {
          "en": "First, allow me to explain this statement of important matters.",
          "ko": "먼저 이 중요사항 설명서에 대해 설명드리겠습니다."
        },
        "alt": [
          {
            "text": "では、ご契約の前に、重要事項のご説明をいたします。",
            "gloss": {
              "en": "Then, before signing, I'll explain the important matters.",
              "ko": "그럼 계약 전에 중요사항을 설명드리겠습니다."
            }
          },
          {
            "text": "早速ですが、こちらの書類について、順番にご説明いたします。",
            "gloss": {
              "en": "Let's get right to it. I'll go through these documents in order.",
              "ko": "바로 시작하겠습니다. 이 서류를 순서대로 설명드리겠습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "はい。分からないところがあったら、途中で質問してもよろしいでしょうか。",
        "gloss": {
          "en": "Sure. If there's anything I don't understand, may I ask questions along the way?",
          "ko": "네. 모르는 게 있으면 중간에 질문해도 될까요?"
        }
      },
      {
        "who": "them",
        "text": "もちろんです。まず、家賃は月八万円、敷金と礼金はそれぞれ一か月分です。",
        "gloss": {
          "en": "Of course. First, the rent is eighty thousand yen a month, and the deposit and key money are one month each.",
          "ko": "물론입니다. 우선 월세는 팔만 엔, 보증금과 사례금은 각각 한 달 치입니다."
        },
        "alt": [
          {
            "text": "ええ、ご遠慮なく。家賃は月々八万円で、敷金・礼金は一か月分ずつとなります。",
            "gloss": {
              "en": "Yes, feel free. The rent is eighty thousand yen monthly, with one month each for deposit and key money.",
              "ko": "네, 편하게 물어보세요. 월세는 매달 팔만 엔이고, 보증금·사례금은 한 달 치씩입니다."
            }
          },
          {
            "text": "はい、いつでもお聞きください。では、家賃は八万円、敷金と礼金は一か月ずつです。",
            "gloss": {
              "en": "Yes, ask anytime. So, rent is eighty thousand yen, with one month each for deposit and key money.",
              "ko": "네, 언제든 물어보세요. 그럼 월세는 팔만 엔, 보증금과 사례금은 한 달씩입니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "承知しました。退去するときは、敷金は戻ってくるのでしょうか。",
        "gloss": {
          "en": "Understood. Will the deposit be returned when I move out?",
          "ko": "알겠습니다. 이사 나갈 때 보증금은 돌려받을 수 있나요?"
        }
      },
      {
        "who": "them",
        "text": "はい。ただ、クリーニング代などを差し引いてお返しすることになります。",
        "gloss": {
          "en": "Yes. However, it will be returned minus cleaning fees and so on.",
          "ko": "네. 다만 청소비 등을 빼고 돌려드리게 됩니다."
        },
        "alt": [
          {
            "text": "はい、原則として戻ります。ただし、修理が必要な場合は、その費用を差し引かせていただきます。",
            "gloss": {
              "en": "Yes, in principle it's returned. However, if repairs are needed, we'll deduct those costs.",
              "ko": "네, 원칙적으로 돌려드립니다. 다만 수리가 필요하면 그 비용은 빼게 됩니다."
            }
          },
          {
            "text": "基本的にはお返しします。ただ、ハウスクリーニング代は差し引かれます。",
            "gloss": {
              "en": "Basically it's returned. But the professional cleaning fee is deducted.",
              "ko": "기본적으로 돌려드립니다. 다만 하우스클리닝 비용은 빠집니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "なるほど。念のため伺いますが、楽器の演奏は可能でしょうか。",
        "gloss": {
          "en": "I see. Just to make sure, is playing musical instruments allowed?",
          "ko": "그렇군요. 혹시 몰라 여쭙는데, 악기 연주는 가능한가요?"
        }
      },
      {
        "who": "them",
        "text": "申し訳ございません。こちらの物件は、楽器の演奏は禁止となっております。",
        "gloss": {
          "en": "I'm sorry. Playing instruments is not permitted in this property.",
          "ko": "죄송합니다. 이 집은 악기 연주가 금지되어 있습니다."
        },
        "alt": [
          {
            "text": "恐れ入りますが、楽器は不可となっております。",
            "gloss": {
              "en": "I'm afraid instruments aren't allowed.",
              "ko": "죄송하지만 악기는 안 됩니다."
            }
          },
          {
            "text": "楽器ですか…。こちらはご遠慮いただいております。",
            "gloss": {
              "en": "Instruments... I'm afraid we ask tenants to refrain here.",
              "ko": "악기요…. 여기는 삼가 주시도록 하고 있습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "そうですか。では、ヘッドホンを使う電子ピアノも難しいでしょうか。",
        "gloss": {
          "en": "I see. Then would an electric piano used with headphones also be a problem?",
          "ko": "그렇군요. 그럼 헤드폰을 쓰는 전자 피아노도 어려울까요?"
        }
      },
      {
        "who": "them",
        "text": "音が出ないものでしたら、問題ございません。",
        "gloss": {
          "en": "If it doesn't make sound, there's no problem.",
          "ko": "소리가 나지 않는 거라면 문제없습니다."
        },
        "alt": [
          {
            "text": "ヘッドホンをお使いでしたら、大丈夫ですよ。",
            "gloss": {
              "en": "If you use headphones, that's fine.",
              "ko": "헤드폰을 쓰신다면 괜찮습니다."
            }
          },
          {
            "text": "それでしたら、問題ないかと思います。",
            "gloss": {
              "en": "In that case, I don't think there's any problem.",
              "ko": "그렇다면 문제없을 것 같습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "安心しました。では、こちらの物件で契約させていただきます。",
        "gloss": {
          "en": "That's a relief. Then I'd like to sign for this property.",
          "ko": "안심했습니다. 그럼 이 집으로 계약하겠습니다."
        }
      },
      {
        "who": "them",
        "text": "ありがとうございます。それでは、こちらにご署名とご捺印をお願いいたします。",
        "gloss": {
          "en": "Thank you. Then please sign and stamp your seal here.",
          "ko": "감사합니다. 그럼 여기에 서명과 날인 부탁드립니다."
        },
        "alt": [
          {
            "text": "かしこまりました。では、こちらにお名前と印鑑をお願いします。",
            "gloss": {
              "en": "Certainly. Then your name and seal here, please.",
              "ko": "알겠습니다. 그럼 여기에 성함과 도장 부탁드려요."
            }
          },
          {
            "text": "ありがとうございます。最後に、こちらにサインをいただけますか。",
            "gloss": {
              "en": "Thank you. Lastly, could I have your signature here?",
              "ko": "감사합니다. 마지막으로 여기에 사인해 주시겠어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "はい。こちらの欄でよろしいですか。",
        "gloss": {
          "en": "Sure. Is this the right box?",
          "ko": "네. 이 칸이면 될까요?"
        }
      }
    ]
  },
  {
    "id": "ja-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Handling a move-in registration at a city office",
      "ko": "구청에서 전입 신고 절차 밟기"
    },
    "expressions": [
      "恐れ入りますが",
      "承知しました"
    ],
    "grammar": [
      1
    ],
    "earlierGrammar": [
      "3:1",
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "三十二番の番号札をお持ちの方、どうぞ。",
        "gloss": {
          "en": "Number thirty-two, please come forward.",
          "ko": "삼십이 번 번호표 가지신 분, 오세요."
        }
      },
      {
        "who": "me",
        "text": "はい。引っ越してきたので、転入の手続きをしたいのですが。",
        "gloss": {
          "en": "Yes. I've just moved here, so I'd like to register my move-in.",
          "ko": "네. 이사 와서 전입 신고를 하고 싶은데요."
        }
      },
      {
        "who": "them",
        "text": "かしこまりました。転出証明書はお持ちでしょうか。",
        "gloss": {
          "en": "Certainly. Do you have your moving-out certificate?",
          "ko": "알겠습니다. 전출 증명서는 가지고 오셨나요?"
        },
        "alt": [
          {
            "text": "承知しました。前の市役所で発行された転出証明書はございますか。",
            "gloss": {
              "en": "Understood. Do you have the moving-out certificate issued by your previous city office?",
              "ko": "알겠습니다. 전에 살던 시청에서 발급받은 전출 증명서 있으십니까?"
            }
          },
          {
            "text": "はい、転入届ですね。転出証明書をお願いできますか。",
            "gloss": {
              "en": "Yes, a move-in notification. May I have your moving-out certificate?",
              "ko": "네, 전입 신고시죠. 전출 증명서 주시겠어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "はい、こちらです。あと、在留カードも持ってまいりました。",
        "gloss": {
          "en": "Yes, here it is. I've also brought my residence card.",
          "ko": "네, 여기 있습니다. 그리고 재류카드도 가져왔습니다."
        }
      },
      {
        "who": "them",
        "text": "ありがとうございます。では、こちらの用紙にご記入をお願いいたします。",
        "gloss": {
          "en": "Thank you. Then please fill out this form.",
          "ko": "감사합니다. 그럼 이 용지에 기입 부탁드립니다."
        },
        "alt": [
          {
            "text": "恐れ入りますが、こちらの届出書にご記入いただけますか。",
            "gloss": {
              "en": "I'm sorry to trouble you, but could you fill out this notification form?",
              "ko": "죄송하지만 이 신고서에 기입해 주시겠습니까?"
            }
          },
          {
            "text": "ご提示ありがとうございます。では、この用紙に新しいご住所をお書きください。",
            "gloss": {
              "en": "Thank you for showing these. Please write your new address on this form.",
              "ko": "보여 주셔서 감사합니다. 그럼 이 용지에 새 주소를 써 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "恐れ入りますが、この「世帯主」の欄は、どう書けばよろしいでしょうか。",
        "gloss": {
          "en": "Excuse me, how should I fill in this 'head of household' box?",
          "ko": "죄송한데요, 이 '세대주' 칸은 어떻게 쓰면 될까요?"
        }
      },
      {
        "who": "them",
        "text": "お一人でお住まいでしたら、ご自身のお名前をお書きください。",
        "gloss": {
          "en": "If you live alone, please write your own name.",
          "ko": "혼자 사신다면 본인 성함을 써 주세요."
        },
        "alt": [
          {
            "text": "お一人暮らしでいらっしゃいますか。でしたら、ご本人のお名前で結構です。",
            "gloss": {
              "en": "Do you live by yourself? Then your own name is fine.",
              "ko": "혼자 사십니까? 그러면 본인 성함으로 됩니다."
            }
          },
          {
            "text": "単身でしたら、ご自分のお名前を記入していただければ大丈夫です。",
            "gloss": {
              "en": "If you live on your own, just write your own name.",
              "ko": "1인 가구시면 본인 이름을 쓰시면 됩니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "承知しました。…書けました。これでよろしいでしょうか。",
        "gloss": {
          "en": "Understood. ...Done. Is this all right?",
          "ko": "알겠습니다. …다 썼습니다. 이걸로 괜찮을까요?"
        }
      },
      {
        "who": "them",
        "text": "はい、結構です。在留カードの裏に新しいご住所を記載いたしますので、少々お待ちください。",
        "gloss": {
          "en": "Yes, that's fine. I'll write your new address on the back of your residence card, so please wait a moment.",
          "ko": "네, 됐습니다. 재류카드 뒷면에 새 주소를 기재해 드릴 테니 잠시만 기다려 주세요."
        },
        "alt": [
          {
            "text": "ありがとうございます。在留カードに新しいご住所を記載しますので、お預かりしますね。",
            "gloss": {
              "en": "Thank you. I'll hold onto your residence card to add the new address.",
              "ko": "감사합니다. 재류카드에 새 주소를 기재할 테니 잠시 맡아 둘게요."
            }
          },
          {
            "text": "問題ございません。カードの裏面に新しいご住所をお入れしますので、しばらくお待ちください。",
            "gloss": {
              "en": "No problem. I'll add the new address to the back of the card, so please wait a while.",
              "ko": "문제없습니다. 카드 뒷면에 새 주소를 넣어 드릴 테니 잠시 기다려 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "お願いします。ちなみに、国民健康保険の手続きも、こちらでできますか。",
        "gloss": {
          "en": "Thank you. By the way, can I also do the national health insurance procedure here?",
          "ko": "부탁드립니다. 참고로 국민건강보험 절차도 여기서 할 수 있나요?"
        }
      },
      {
        "who": "them",
        "text": "保険の手続きは、隣の七番窓口になります。",
        "gloss": {
          "en": "Insurance procedures are at window seven next door.",
          "ko": "보험 절차는 옆 칠 번 창구입니다."
        },
        "alt": [
          {
            "text": "健康保険は担当が別でして、七番窓口でお手続きいただくことになります。",
            "gloss": {
              "en": "Health insurance is handled separately, so you'll need to do it at window seven.",
              "ko": "건강보험은 담당이 따로라서 칠 번 창구에서 하셔야 합니다."
            }
          },
          {
            "text": "恐れ入りますが、保険は七番の窓口でお願いいたします。",
            "gloss": {
              "en": "I'm sorry, but please go to window seven for insurance.",
              "ko": "죄송하지만 보험은 칠 번 창구에서 부탁드립니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "七番ですね。こちらが終わったら伺います。",
        "gloss": {
          "en": "Window seven, got it. I'll go there after this.",
          "ko": "칠 번이요. 여기 끝나면 가 보겠습니다."
        }
      },
      {
        "who": "them",
        "text": "お待たせいたしました。カードをお返しいたします。ご確認ください。",
        "gloss": {
          "en": "Thank you for waiting. Here is your card back. Please check it.",
          "ko": "기다리셨습니다. 카드 돌려드리겠습니다. 확인해 주세요."
        },
        "alt": [
          {
            "text": "お待たせしました。在留カードをお返しします。裏のご住所をご確認ください。",
            "gloss": {
              "en": "Sorry for the wait. Here's your residence card. Please check the address on the back.",
              "ko": "기다리셨죠. 재류카드 돌려드립니다. 뒷면 주소 확인해 주세요."
            }
          },
          {
            "text": "お手続きが完了いたしました。こちら、カードのお返しです。",
            "gloss": {
              "en": "Your procedure is complete. Here's your card back.",
              "ko": "절차가 끝났습니다. 카드 돌려드릴게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ありがとうございます。間違いありません。お世話になりました。",
        "gloss": {
          "en": "Thank you. Everything's correct. Thank you for your help.",
          "ko": "감사합니다. 틀린 데 없네요. 신세 졌습니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-x1",
    "stage": 4,
    "setting": {
      "en": "Taking a call for an absent colleague",
      "ko": "자리에 없는 동료 대신 전화 받기"
    },
    "expressions": [
      "少々お待ちください",
      "差し支えなければ"
    ],
    "grammar": [
      1
    ],
    "earlierGrammar": [
      "2:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "お世話になっております。大和商事の田中と申します。営業部の鈴木様はいらっしゃいますか。",
        "gloss": {
          "en": "Thank you for your business. This is Tanaka from Yamato Trading. Is Mr. Suzuki in sales available?",
          "ko": "신세 지고 있습니다. 야마토상사의 다나카라고 합니다. 영업부 스즈키 님 계십니까?"
        }
      },
      {
        "who": "me",
        "text": "お世話になっております。鈴木でございますね。少々お待ちください。",
        "gloss": {
          "en": "Thank you for your business. Suzuki, you said? One moment, please.",
          "ko": "신세 지고 있습니다. 스즈키 말씀이시죠. 잠시만 기다려 주십시오."
        }
      },
      {
        "who": "them",
        "text": "はい、よろしくお願いします。",
        "gloss": {
          "en": "Yes, thank you.",
          "ko": "네, 부탁드립니다."
        }
      },
      {
        "who": "me",
        "text": "お待たせいたしました。申し訳ございません、鈴木はただいま外出しておりまして、戻りは夕方の予定です。",
        "gloss": {
          "en": "Sorry to keep you waiting. I'm afraid Suzuki is out at the moment and is expected back in the evening.",
          "ko": "오래 기다리셨습니다. 죄송합니다만, 스즈키는 지금 외출 중이라 저녁에 돌아올 예정입니다."
        }
      },
      {
        "who": "them",
        "text": "そうですか。では、また改めてお電話します。",
        "gloss": {
          "en": "I see. Then I'll call back another time.",
          "ko": "그렇군요. 그럼 다시 전화드리겠습니다."
        }
      },
      {
        "who": "me",
        "text": "差し支えなければ、ご用件を伺ってもよろしいでしょうか。鈴木に申し伝えます。",
        "gloss": {
          "en": "If you don't mind, may I ask what it's regarding? I'll pass it on to Suzuki.",
          "ko": "괜찮으시다면 용건을 여쭤봐도 될까요? 스즈키에게 전하겠습니다."
        }
      },
      {
        "who": "them",
        "text": "ありがとうございます。明日の打ち合わせを午後に変更できないか、お伝えいただけますか。",
        "gloss": {
          "en": "Thank you. Could you ask him whether tomorrow's meeting could be moved to the afternoon?",
          "ko": "감사합니다. 내일 회의를 오후로 바꿀 수 있는지 전해 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "かしこまりました。明日の打ち合わせを午後に、ですね。確かに申し伝えます。",
        "gloss": {
          "en": "Certainly. Tomorrow's meeting to the afternoon, then. I'll be sure to pass that on.",
          "ko": "알겠습니다. 내일 회의를 오후로, 말씀이시죠. 틀림없이 전하겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-x2",
    "stage": 4,
    "setting": {
      "en": "Revising a proposal with a client",
      "ko": "거래처와 제안 수정 상의"
    },
    "expressions": [
      "とおっしゃいますと",
      "要するに",
      "検討いたします",
      "今後ともよろしくお願いいたします"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "先日のご提案ですが、今の予算では少し難しいかもしれません。",
        "gloss": {
          "en": "About your proposal the other day, it may be a little difficult with our current budget.",
          "ko": "얼마 전 제안 말인데요, 지금 예산으로는 조금 어려울 것 같습니다."
        }
      },
      {
        "who": "me",
        "text": "とおっしゃいますと、費用の面でしょうか。",
        "gloss": {
          "en": "By that, do you mean in terms of cost?",
          "ko": "말씀하시는 건, 비용 면에서일까요?"
        }
      },
      {
        "who": "them",
        "text": "ええ。内容はいいんですが、一度に全部となると厳しくて。",
        "gloss": {
          "en": "Yes. The content is good, but doing it all at once is tough.",
          "ko": "네. 내용은 좋은데, 한 번에 전부 하기는 버거워서요."
        }
      },
      {
        "who": "me",
        "text": "でしたら、二段階に分けるのはいかがでしょうか。要するに、今年度は基本の機能だけを導入して、残りは来年度に回す形です。",
        "gloss": {
          "en": "In that case, how about splitting it into two phases? In short, you'd introduce only the basic features this fiscal year and move the rest to next year.",
          "ko": "그렇다면 두 단계로 나누는 건 어떨까요? 요컨대 올해는 기본 기능만 도입하고 나머지는 내년으로 넘기는 방식입니다."
        }
      },
      {
        "who": "them",
        "text": "なるほど、それなら社内でも通しやすいですね。見積もりを出し直していただけますか。",
        "gloss": {
          "en": "I see, that would be easier to get approved internally. Could you redo the estimate?",
          "ko": "그렇군요, 그러면 사내에서도 통과시키기 쉽겠네요. 견적을 다시 내 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "かしこまりました。その形で社内で検討いたしまして、来週中にお見積もりをお送りします。",
        "gloss": {
          "en": "Certainly. We'll look into it internally on that basis and send you an estimate within next week.",
          "ko": "알겠습니다. 그 방식으로 사내에서 검토해서 다음 주 중에 견적을 보내 드리겠습니다."
        }
      },
      {
        "who": "them",
        "text": "よろしくお願いします。本日はありがとうございました。",
        "gloss": {
          "en": "Thank you. And thank you for today.",
          "ko": "잘 부탁드립니다. 오늘 감사했습니다."
        }
      },
      {
        "who": "me",
        "text": "こちらこそ、ありがとうございました。今後ともよろしくお願いいたします。",
        "gloss": {
          "en": "Thank you as well. We look forward to continuing to work with you.",
          "ko": "저야말로 감사했습니다. 앞으로도 잘 부탁드립니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-x3",
    "stage": 4,
    "setting": {
      "en": "Handing over tour documents at a travel agency",
      "ko": "여행사 창구에서 서류 건네기"
    },
    "expressions": [
      "お手数ですが",
      "ご確認ください",
      "結構です"
    ],
    "grammar": [
      1
    ],
    "earlierGrammar": [
      "2:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "すみません、先日申し込んだツアーの書類を受け取りに来たんですが。",
        "gloss": {
          "en": "Excuse me, I've come to pick up the documents for the tour I booked the other day.",
          "ko": "저기요, 얼마 전에 신청한 투어 서류를 받으러 왔는데요."
        }
      },
      {
        "who": "me",
        "text": "いらっしゃいませ。お名前を伺ってもよろしいでしょうか。",
        "gloss": {
          "en": "Welcome. May I have your name, please?",
          "ko": "어서 오십시오. 성함을 여쭤봐도 될까요?"
        }
      },
      {
        "who": "them",
        "text": "山田です。",
        "gloss": {
          "en": "It's Yamada.",
          "ko": "야마다입니다."
        }
      },
      {
        "who": "me",
        "text": "山田様ですね。お手数ですが、こちらの用紙にご住所とお電話番号をご記入いただけますか。",
        "gloss": {
          "en": "Yamada, thank you. Sorry for the trouble, but could you fill in your address and phone number on this form?",
          "ko": "야마다 님이시군요. 번거로우시겠지만, 이 용지에 주소와 전화번호를 적어 주시겠어요?"
        }
      },
      {
        "who": "them",
        "text": "はい。…これでいいですか。",
        "gloss": {
          "en": "Sure. ...Is this okay?",
          "ko": "네. …이러면 될까요?"
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。こちらが旅程表です。お名前と日程に間違いがないか、ご確認ください。",
        "gloss": {
          "en": "Thank you. Here is your itinerary. Please check that your name and dates are correct.",
          "ko": "감사합니다. 이게 여행 일정표입니다. 성함과 일정에 틀린 곳이 없는지 확인해 주십시오."
        }
      },
      {
        "who": "them",
        "text": "…はい、大丈夫です。印鑑は必要ですか。",
        "gloss": {
          "en": "...Yes, it's all fine. Do you need my seal?",
          "ko": "…네, 괜찮아요. 도장이 필요한가요?"
        }
      },
      {
        "who": "me",
        "text": "いえ、サインで結構です。こちらにお願いいたします。",
        "gloss": {
          "en": "No, a signature is fine. Here, please.",
          "ko": "아니요, 사인이면 됩니다. 여기에 부탁드립니다."
        }
      }
    ]
  },
  {
    "id": "ja-4-x4",
    "stage": 4,
    "setting": {
      "en": "Choosing an apartment with a real estate agent",
      "ko": "부동산 직원과 집 고르기"
    },
    "expressions": [
      "念のため"
    ],
    "grammar": [
      1,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "本日ご覧いただいた三つの物件の中で、お気に召したものはございましたか。",
        "gloss": {
          "en": "Of the three places you saw today, was there one you liked?",
          "ko": "오늘 보신 세 집 중에 마음에 드신 곳이 있으셨나요?"
        }
      },
      {
        "who": "me",
        "text": "どれもよかったんですが、見れば見るほど迷ってしまいまして。",
        "gloss": {
          "en": "They were all good, but the more I look, the harder it is to decide.",
          "ko": "다 좋았는데, 보면 볼수록 고민이 돼서요."
        }
      },
      {
        "who": "them",
        "text": "お気持ち、よく分かります。一番重視されているのはどんな点でしょうか。",
        "gloss": {
          "en": "I understand completely. What matters most to you?",
          "ko": "그 마음 잘 압니다. 가장 중요하게 보시는 점은 무엇인가요?"
        }
      },
      {
        "who": "me",
        "text": "通勤ですね。ただ、駅に近ければ近いほど、家賃も高くなりますよね。",
        "gloss": {
          "en": "The commute. But the closer to the station, the higher the rent, right?",
          "ko": "출퇴근이요. 다만 역에 가까울수록 월세도 비싸지잖아요."
        }
      },
      {
        "who": "them",
        "text": "おっしゃる通りです。駅から少し歩けば、同じ広さでも一万円ほど安くなりますよ。",
        "gloss": {
          "en": "Exactly. If you walk a bit farther from the station, the same size is about ten thousand yen cheaper.",
          "ko": "맞습니다. 역에서 조금만 걸으면 같은 넓이라도 만 엔 정도 싸져요."
        }
      },
      {
        "who": "me",
        "text": "なるほど。部屋は広ければ広いほどいいというわけではないので、念のため、二つ目の物件をもう一度見せていただけますか。",
        "gloss": {
          "en": "I see. It's not that bigger is always better, so just to be sure, could I see the second place once more?",
          "ko": "그렇군요. 방은 넓을수록 좋은 것만은 아니니까, 혹시 모르니 두 번째 집을 한 번 더 보여 주시겠어요?"
        }
      },
      {
        "who": "them",
        "text": "かしこまりました。では、明日の午前中はいかがでしょうか。",
        "gloss": {
          "en": "Certainly. Then how about tomorrow morning?",
          "ko": "알겠습니다. 그럼 내일 오전은 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。では、明日の十時に伺います。",
        "gloss": {
          "en": "Thank you. Then I'll come by at ten tomorrow.",
          "ko": "감사합니다. 그럼 내일 열 시에 찾아뵙겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Declining a senior colleague's favor politely",
      "ko": "선배의 부탁을 정중하게 돌려 거절하기"
    },
    "goal": {
      "en": "Turn down your senior's request to cover his Saturday shift without ever saying a flat no, and offer other help so the relationship stays warm.",
      "ko": "선배의 토요일 근무 대신 서 달라는 부탁을 '안 돼요'라고 딱 잘라 말하지 않고 거절하고, 다른 도움을 내밀어 관계를 따뜻하게 지킨다."
    },
    "expressions": [
      "正直なところ",
      "ちょっと難しいかもです",
      "とんでもないです",
      "お言葉に甘えて"
    ],
    "grammar": [
      0
    ],
    "earlierGrammar": [
      "4:5",
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "あ、ミンジュンさん、今ちょっといい？",
        "gloss": {
          "en": "Oh, Minjun, got a sec?",
          "ko": "아, 민준 씨, 지금 잠깐 괜찮아?"
        }
      },
      {
        "who": "me",
        "text": "はい、どうされました？",
        "gloss": {
          "en": "Sure, what's up?",
          "ko": "네, 무슨 일이세요?"
        }
      },
      {
        "who": "them",
        "text": "実はさ、今度の土曜の展示会、俺の代わりに受付に入ってもらえないかなと思って。急に親戚の法事が入っちゃって。",
        "gloss": {
          "en": "So, I was wondering if you could cover the reception desk for me at this Saturday's trade show. A family memorial service suddenly came up.",
          "ko": "실은 이번 토요일 전시회, 나 대신 접수에 들어가 줄 수 있을까 해서. 갑자기 친척 제사가 생겨 버려서."
        }
      },
      {
        "who": "me",
        "text": "ああ、法事ですか…。それは行かないわけにはいかないですよね。",
        "gloss": {
          "en": "Ah, a memorial service... You can't very well skip that.",
          "ko": "아, 제사요…. 그건 안 갈 수가 없죠."
        }
      },
      {
        "who": "them",
        "text": "そうなんだよ。で、ほかに頼める人がいなくてさ。",
        "gloss": {
          "en": "Exactly. And there's no one else I can ask.",
          "ko": "그렇다니까. 근데 달리 부탁할 사람이 없어서."
        }
      },
      {
        "who": "me",
        "text": "声をかけていただいて、本当にありがたいんですけど…。実はその日、前から家族と約束がありまして。",
        "gloss": {
          "en": "I really appreciate you thinking of me, but... the thing is, I've had plans with my family that day for a while.",
          "ko": "말 걸어 주셔서 정말 감사한데요…. 실은 그날 전부터 가족이랑 약속이 있어서요."
        }
      },
      {
        "who": "them",
        "text": "あ、そうなんだ。それって、ずらせない感じ？",
        "gloss": {
          "en": "Oh, I see. Is that something you can't move?",
          "ko": "아, 그렇구나. 그거 못 옮기는 거야?"
        }
      },
      {
        "who": "me",
        "text": "そうですね…。正直なところ、親が韓国から来ることになっていて、ずらすのはちょっと難しいかもです。",
        "gloss": {
          "en": "Well... honestly, my parents are coming over from Korea, so moving it might be a bit difficult.",
          "ko": "그게요…. 솔직히 부모님이 한국에서 오시기로 돼 있어서, 옮기는 건 좀 어려울 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "そっか、それは仕方ないね。いや、こっちこそ急にごめん。",
        "gloss": {
          "en": "Ah, that can't be helped. No, I'm the one who should apologize for asking so suddenly.",
          "ko": "그렇구나, 그럼 어쩔 수 없지. 아니, 나야말로 갑자기 미안."
        }
      },
      {
        "who": "me",
        "text": "とんでもないです。お力になれなくて、すみません。代わりと言っては何ですが、金曜のうちに受付の準備だけでもしておきましょうか。",
        "gloss": {
          "en": "Not at all. I'm sorry I can't be of help. It's not much in return, but shall I at least get the reception set up on Friday?",
          "ko": "별말씀을요. 도움이 못 돼서 죄송해요. 대신이라고 하긴 뭣하지만, 금요일 중에 접수 준비만이라도 해 둘까요?"
        }
      },
      {
        "who": "them",
        "text": "え、いいの？それだけでもめちゃくちゃ助かる。",
        "gloss": {
          "en": "Wait, really? Even just that would be a huge help.",
          "ko": "어, 그래도 돼? 그것만 해도 엄청 도움 돼."
        }
      },
      {
        "who": "me",
        "text": "もちろんです。あと、山本さんが土曜は空いてるって言ってた気がします。私から聞いてみましょうか。",
        "gloss": {
          "en": "Of course. Also, I think Yamamoto said she's free on Saturday. Shall I ask her for you?",
          "ko": "물론이죠. 그리고 야마모토 씨가 토요일엔 시간 된다고 했던 것 같아요. 제가 물어볼까요?"
        }
      },
      {
        "who": "them",
        "text": "ほんと？じゃあ、頼んじゃおうかな。",
        "gloss": {
          "en": "Really? Then maybe I'll take you up on that.",
          "ko": "진짜? 그럼 부탁해 볼까."
        }
      },
      {
        "who": "me",
        "text": "はい、今日中に聞いて、またご連絡しますね。",
        "gloss": {
          "en": "Sure, I'll ask today and let you know.",
          "ko": "네, 오늘 중으로 물어보고 다시 연락드릴게요."
        }
      },
      {
        "who": "them",
        "text": "ありがとう。今度、ランチおごらせて。",
        "gloss": {
          "en": "Thanks. Let me buy you lunch sometime.",
          "ko": "고마워. 다음에 점심 살게."
        }
      },
      {
        "who": "me",
        "text": "えっ、いいんですか。じゃあ、お言葉に甘えて。楽しみにしてます。",
        "gloss": {
          "en": "Oh, are you sure? Then I'll gratefully accept. I'm looking forward to it.",
          "ko": "어, 그래도 돼요? 그럼 감사히 얻어먹을게요. 기대할게요."
        }
      }
    ]
  },
  {
    "id": "ja-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Debating the ending of a popular drama with a friend",
      "ko": "친구와 화제 드라마 결말을 두고 이야기하기"
    },
    "goal": {
      "en": "Argue that the drama's ending didn't make sense, then concede part of your friend's view while still holding your own.",
      "ko": "드라마 결말이 납득이 안 된다고 주장하고, 내 생각은 지키면서 친구 의견도 일부 인정한다."
    },
    "expressions": [
      "正直なところ",
      "腑に落ちない",
      "筋が通らない",
      "言われてみれば",
      "一理ある",
      "痛いところを突かれた"
    ],
    "grammar": [
      5
    ],
    "earlierGrammar": [
      "4:3",
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ねえ、昨日の最終回見た？",
        "gloss": {
          "en": "Hey, did you see the finale last night?",
          "ko": "야, 어제 마지막 회 봤어?"
        }
      },
      {
        "who": "me",
        "text": "見た見た！でも正直なところ、あの終わり方はちょっと腑に落ちなかったんだよね。",
        "gloss": {
          "en": "Yeah, I did! But honestly, that ending didn't quite sit right with me.",
          "ko": "봤어 봤어! 근데 솔직히 그 결말은 좀 납득이 안 갔어."
        }
      },
      {
        "who": "them",
        "text": "えー、そう？私はすごくよかったと思うけど。",
        "gloss": {
          "en": "Huh, really? I thought it was really good.",
          "ko": "엥, 그래? 난 엄청 좋았는데."
        }
      },
      {
        "who": "me",
        "text": "だって、ずっと二人がくっつく流れだったのに、最後にいきなり別れるって、筋が通らなくない？",
        "gloss": {
          "en": "I mean, the whole story was heading toward them getting together, and then they suddenly break up at the end. Doesn't that not add up?",
          "ko": "아니, 계속 둘이 이어지는 흐름이었는데 마지막에 갑자기 헤어지는 건 앞뒤가 안 맞지 않아?"
        }
      },
      {
        "who": "them",
        "text": "うーん、でもさ、あれは二人とも夢を選んだってことでしょ。",
        "gloss": {
          "en": "Hmm, but that's them both choosing their dreams, right?",
          "ko": "음, 근데 그건 둘 다 꿈을 선택했다는 거잖아."
        }
      },
      {
        "who": "me",
        "text": "それは分かるんだけど、だったらもっと前から伏線を張っておくべきだったと思うんだよね。",
        "gloss": {
          "en": "I get that, but if so, I think they should have set it up much earlier.",
          "ko": "그건 알겠는데, 그럴 거면 더 일찍부터 복선을 깔아 뒀어야 했다고 생각해."
        }
      },
      {
        "who": "them",
        "text": "伏線ならあったじゃん。ほら、空港のシーンとか。",
        "gloss": {
          "en": "There was foreshadowing! Like the airport scene.",
          "ko": "복선 있었잖아. 봐, 공항 장면이라든가."
        }
      },
      {
        "who": "me",
        "text": "あー、言われてみれば…。あのとき彼女、何か言いかけてたよね。",
        "gloss": {
          "en": "Oh, now that you mention it... She was about to say something then, wasn't she.",
          "ko": "아, 듣고 보니…. 그때 그 여자 뭔가 말하려다 말았지."
        }
      },
      {
        "who": "them",
        "text": "そうそう。あれが全部最終回につながってるんだって。",
        "gloss": {
          "en": "Exactly. That all leads into the finale.",
          "ko": "그래그래. 그게 다 마지막 회로 이어지는 거라니까."
        }
      },
      {
        "who": "me",
        "text": "なるほどね。そう考えると一理あるかも。でも、それにしても展開が急すぎたと思わない？",
        "gloss": {
          "en": "I see. Thinking about it that way, you have a point. But even so, don't you think it moved way too fast?",
          "ko": "그렇구나. 그렇게 생각하면 일리 있을지도. 근데 그래도 전개가 너무 급하지 않았어?"
        }
      },
      {
        "who": "them",
        "text": "まあ、それは否定できないかな。最終回に詰め込みすぎた感じはあったよね。",
        "gloss": {
          "en": "Well, I can't deny that. It did feel like they crammed too much into the finale.",
          "ko": "뭐, 그건 부정 못 하겠다. 마지막 회에 너무 몰아넣은 느낌은 있었지."
        }
      },
      {
        "who": "me",
        "text": "でしょ？あと二話あれば、もっと納得できたと思うんだよね。",
        "gloss": {
          "en": "Right? With two more episodes, I think I'd have been much more convinced.",
          "ko": "그치? 두 화만 더 있었으면 훨씬 납득됐을 거야."
        }
      },
      {
        "who": "them",
        "text": "確かに。でもさ、ハッピーエンドだったら、ここまで話題にならなかったかもよ。",
        "gloss": {
          "en": "True. But if it had a happy ending, it might not have gotten this much buzz.",
          "ko": "확실히. 근데 해피엔딩이었으면 이렇게까지 화제가 안 됐을지도 몰라."
        }
      },
      {
        "who": "me",
        "text": "うわ、痛いところを突かれた。それはそうかも。賛否が分かれるからこそ、みんな語りたくなるんだよね。",
        "gloss": {
          "en": "Ouch, you got me there. That might be true. It's precisely because opinions are split that everyone wants to talk about it.",
          "ko": "와, 아픈 데를 찔렸네. 그건 그럴지도. 호불호가 갈리니까 오히려 다들 얘기하고 싶어지는 거지."
        }
      },
      {
        "who": "them",
        "text": "そういうこと。ね、もう一回最初から見返さない？",
        "gloss": {
          "en": "Exactly. Hey, want to rewatch it from the beginning?",
          "ko": "바로 그거야. 야, 처음부터 다시 볼래?"
        }
      },
      {
        "who": "me",
        "text": "いいね。今度は伏線、全部チェックしながら見よう。",
        "gloss": {
          "en": "Sounds good. This time let's watch while catching all the foreshadowing.",
          "ko": "좋아. 이번엔 복선 하나하나 체크하면서 보자."
        }
      }
    ]
  },
  {
    "id": "ja-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Talking with a friend about a social issue from the news",
      "ko": "친구와 뉴스에 나온 사회 문제 이야기하기"
    },
    "goal": {
      "en": "Give your view on rural bus routes being cut, propose an idea, and acknowledge the other side's point without dropping your own.",
      "ko": "지방 버스 노선 폐지에 대한 내 생각을 말하고 아이디어를 내되, 내 의견을 지키면서 상대의 논점도 인정한다."
    },
    "expressions": [
      "一理ある",
      "正直なところ"
    ],
    "grammar": [
      1,
      3,
      7
    ],
    "earlierGrammar": [
      "4:6",
      "4:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "ねえ、今朝のニュース見た？また地方のバス路線がなくなるんだって。",
        "gloss": {
          "en": "Hey, did you see the news this morning? Another rural bus route is being cut.",
          "ko": "야, 오늘 아침 뉴스 봤어? 또 지방 버스 노선이 없어진대."
        }
      },
      {
        "who": "me",
        "text": "見た。運転手が足りないってやつでしょ？ほんと深刻だよね。",
        "gloss": {
          "en": "I saw. The one about there not being enough drivers, right? It's really serious.",
          "ko": "봤어. 운전기사가 부족하다는 거지? 진짜 심각하다."
        }
      },
      {
        "who": "them",
        "text": "うん。でも、乗る人がほとんどいないなら、仕方ない気もするけどね。",
        "gloss": {
          "en": "Yeah. But if hardly anyone rides them, I kind of feel it can't be helped.",
          "ko": "응. 근데 타는 사람이 거의 없으면 어쩔 수 없는 것 같기도 해."
        }
      },
      {
        "who": "me",
        "text": "うーん、それはそうなんだけど、車を運転できないお年寄りにとっては、バスが唯一の足だったりするじゃない？",
        "gloss": {
          "en": "Hmm, that's true, but for older people who can't drive, the bus is sometimes their only way to get around, you know?",
          "ko": "음, 그건 그렇긴 한데, 운전 못 하는 어르신들한테는 버스가 유일한 발인 경우도 있잖아."
        }
      },
      {
        "who": "them",
        "text": "まあね。とはいえ、赤字のまま走らせ続けるわけにもいかないでしょ。",
        "gloss": {
          "en": "Well, sure. That said, they can't very well keep running them at a loss.",
          "ko": "뭐 그렇지. 그렇다고 적자인 채로 계속 운행할 수도 없잖아."
        }
      },
      {
        "who": "me",
        "text": "それは一理ある。ただ、なくしたらなくしたで、病院にも行けない人が出かねないと思うんだよね。",
        "gloss": {
          "en": "You have a point. But if they cut it, there could well be people who can't even get to the hospital.",
          "ko": "그건 일리 있어. 다만 없애면 없애는 대로 병원에도 못 가는 사람이 생길 수 있다고 봐."
        }
      },
      {
        "who": "them",
        "text": "確かに、それは怖いね。じゃあ、どうすればいいと思う？",
        "gloss": {
          "en": "True, that's scary. So what do you think should be done?",
          "ko": "확실히 그건 무섭다. 그럼 어떻게 하면 좋을 것 같아?"
        }
      },
      {
        "who": "me",
        "text": "正直なところ、決まった時間に大きなバスを走らせるやり方自体、もう合ってないんじゃないかな。",
        "gloss": {
          "en": "Honestly, I wonder if the whole approach of running big buses on a fixed timetable just doesn't fit anymore.",
          "ko": "솔직히 정해진 시간에 큰 버스를 돌리는 방식 자체가 이제 안 맞는 거 아닐까."
        }
      },
      {
        "who": "them",
        "text": "どういうこと？",
        "gloss": {
          "en": "What do you mean?",
          "ko": "무슨 말이야?"
        }
      },
      {
        "who": "me",
        "text": "たとえば、予約があったときだけ小さい車で迎えに行く、みたいな。実際にやってる町もあるらしいよ。",
        "gloss": {
          "en": "Like, sending a small car only when someone books a ride. Apparently some towns are actually doing it.",
          "ko": "예를 들면 예약이 있을 때만 작은 차로 데리러 가는 식으로. 실제로 하는 동네도 있대."
        }
      },
      {
        "who": "them",
        "text": "へえ、それなら無駄が少なそう。でも、スマホで予約とか、お年寄りには難しくない？",
        "gloss": {
          "en": "Huh, that sounds less wasteful. But isn't booking on a smartphone hard for older people?",
          "ko": "오, 그러면 낭비가 적겠다. 근데 스마트폰으로 예약 같은 건 어르신들한테 어렵지 않아?"
        }
      },
      {
        "who": "me",
        "text": "そこなんだよね。電話でも予約できるようにしないことには、結局使われないと思う。",
        "gloss": {
          "en": "That's exactly the issue. Unless they can book by phone too, I don't think people will end up using it.",
          "ko": "바로 그게 문제야. 전화로도 예약할 수 있게 하지 않으면 결국 아무도 안 쓸 것 같아."
        }
      },
      {
        "who": "them",
        "text": "なるほどね。でも、お金の問題は残るよね。",
        "gloss": {
          "en": "I see. But the money problem is still there.",
          "ko": "그렇구나. 근데 돈 문제는 남잖아."
        }
      },
      {
        "who": "me",
        "text": "まあね。税金を使わざるを得ない部分はあると思う。でも、それで暮らしが守れるなら、ある程度は仕方ないんじゃないかな。",
        "gloss": {
          "en": "Well, yeah. I think some tax money will have to be used. But if it protects people's lives, I think that's acceptable to a degree.",
          "ko": "그렇지. 세금을 쓸 수밖에 없는 부분은 있을 거야. 근데 그걸로 생활을 지킬 수 있다면 어느 정도는 어쩔 수 없지 않을까."
        }
      },
      {
        "who": "them",
        "text": "うーん、そう言われると反対しにくいなあ。",
        "gloss": {
          "en": "Hmm, when you put it that way, it's hard to disagree.",
          "ko": "음, 그렇게 말하면 반대하기 어렵네."
        }
      },
      {
        "who": "me",
        "text": "もちろん、それが正解ってわけでもないけどね。自分が年を取ったときのことを考えると、他人事とは思えないんだよね。",
        "gloss": {
          "en": "Of course, it's not like that's the right answer either. But when I think about when I get old, it doesn't feel like someone else's problem.",
          "ko": "물론 그게 정답이라는 건 아니지만. 내가 나이 들었을 때를 생각하면 남의 일 같지가 않아."
        }
      }
    ]
  },
  {
    "id": "ja-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Comforting a friend who failed an interview",
      "ko": "면접에 떨어진 친구 위로하기"
    },
    "goal": {
      "en": "Comfort your friend after a failed interview, show you understand how they feel, and gently help them look ahead without lecturing.",
      "ko": "면접에 떨어진 친구를 위로하고 마음을 알아준다는 걸 보이며, 훈계하지 않고 다음을 바라보게 살며시 돕는다."
    },
    "expressions": [
      "考えすぎだよ"
    ],
    "grammar": [],
    "earlierGrammar": [
      "4:3",
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "…ダメだった。最終面接、落ちちゃった。",
        "gloss": {
          "en": "...It didn't work out. I failed the final interview.",
          "ko": "…안 됐어. 최종 면접 떨어졌어."
        }
      },
      {
        "who": "me",
        "text": "そっか…。あんなに準備してたのにね。つらいよね。",
        "gloss": {
          "en": "Oh... After all that preparation, too. That must be hard.",
          "ko": "그렇구나…. 그렇게 준비했는데. 속상하겠다."
        }
      },
      {
        "who": "them",
        "text": "うん。今回は手応えあったんだけどな。何がいけなかったんだろう。",
        "gloss": {
          "en": "Yeah. I really felt good about this one. I wonder what went wrong.",
          "ko": "응. 이번엔 느낌이 좋았는데. 뭐가 문제였을까."
        }
      },
      {
        "who": "me",
        "text": "手応えがあったなら、なおさら悔しいよね。",
        "gloss": {
          "en": "If you felt good about it, that makes it even more frustrating.",
          "ko": "느낌이 좋았으면 더 분하겠다."
        }
      },
      {
        "who": "them",
        "text": "最後に「ほかに受けている会社は？」って聞かれて、うまく答えられなかったんだよね。あれかなあ。",
        "gloss": {
          "en": "At the end they asked, 'What other companies are you applying to?' and I couldn't answer well. Maybe that was it.",
          "ko": "마지막에 '다른 데도 지원했어요?'라고 물어봤는데 대답을 잘 못 했거든. 그거였나."
        }
      },
      {
        "who": "me",
        "text": "うーん、考えすぎだよ。それだけで決まるとは限らないと思う。面接って、相性とかタイミングもあるし。",
        "gloss": {
          "en": "Hmm, you're overthinking it. I don't think it's necessarily decided by that alone. Interviews also come down to fit and timing.",
          "ko": "음, 너무 깊게 생각하는 거야. 그것만으로 결정되는 건 아닐 거야. 면접은 궁합이나 타이밍도 있으니까."
        }
      },
      {
        "who": "them",
        "text": "そうかなあ。もう自信なくなってきた。",
        "gloss": {
          "en": "You think so? I'm starting to lose confidence.",
          "ko": "그럴까. 이제 자신이 없어졌어."
        }
      },
      {
        "who": "me",
        "text": "その気持ち、分かるよ。でも、最終まで残ったってことは、それだけ評価されてたってことだよ。",
        "gloss": {
          "en": "I understand how you feel. But making it to the final round means they really did rate you.",
          "ko": "그 마음 알아. 근데 최종까지 갔다는 건 그만큼 인정받았다는 거야."
        }
      },
      {
        "who": "them",
        "text": "…まあ、そうかもしれないけど。",
        "gloss": {
          "en": "...Well, maybe, but...",
          "ko": "…뭐, 그럴지도 모르지만."
        }
      },
      {
        "who": "me",
        "text": "こう言っちゃなんだけど、縁がなかっただけだと思う。もっと合う会社、きっとあるって。",
        "gloss": {
          "en": "Maybe it's not my place to say, but I think it just wasn't meant to be. There's definitely a company that suits you better.",
          "ko": "이런 말 하긴 좀 그렇지만, 그냥 인연이 아니었던 것 같아. 더 잘 맞는 회사 분명 있을 거야."
        }
      },
      {
        "who": "them",
        "text": "ありがとう。そう言ってもらえると、ちょっと楽になる。",
        "gloss": {
          "en": "Thanks. Hearing you say that makes me feel a little better.",
          "ko": "고마워. 그렇게 말해 주니까 좀 편해진다."
        }
      },
      {
        "who": "me",
        "text": "今日は無理に前向きにならなくていいよ。落ち込むのも当然だし。",
        "gloss": {
          "en": "You don't have to force yourself to be positive today. It's natural to feel down.",
          "ko": "오늘은 억지로 긍정적이 안 돼도 돼. 우울한 게 당연하지."
        }
      },
      {
        "who": "them",
        "text": "うん…。でも、来週また別の会社の面接があるんだよね。",
        "gloss": {
          "en": "Yeah... But I have an interview with another company next week.",
          "ko": "응…. 근데 다음 주에 또 다른 회사 면접이 있거든."
        }
      },
      {
        "who": "me",
        "text": "そうなんだ。じゃあ、もしよかったら、さっきの質問の答え、一緒に考えてみる？",
        "gloss": {
          "en": "Oh, really. Then if you'd like, want to work out an answer to that question together?",
          "ko": "그렇구나. 그럼 괜찮으면 아까 그 질문 대답 같이 생각해 볼래?"
        }
      },
      {
        "who": "them",
        "text": "え、いいの？助かる。",
        "gloss": {
          "en": "Wait, really? That'd be a big help.",
          "ko": "어, 그래도 돼? 고마워."
        }
      },
      {
        "who": "me",
        "text": "もちろん。でもその前に、とりあえず甘いものでも食べに行こうよ。おごるから。",
        "gloss": {
          "en": "Of course. But before that, let's go get something sweet. My treat.",
          "ko": "당연하지. 근데 그 전에 일단 단 거라도 먹으러 가자. 내가 살게."
        }
      }
    ]
  },
  {
    "id": "ja-5-x1",
    "stage": 5,
    "setting": {
      "en": "Your manager offers you a project lead",
      "ko": "부장이 프로젝트 리더를 제안함"
    },
    "expressions": [
      "身に余るお言葉です",
      "お察しします",
      "前向きに検討します",
      "ご無理のない範囲で"
    ],
    "grammar": [],
    "earlierGrammar": [
      "4:2",
      "4:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "今度の新規プロジェクト、リーダーを君に任せたいと思っているんだ。",
        "gloss": {
          "en": "I'm thinking of making you the lead on the upcoming new project.",
          "ko": "이번 신규 프로젝트, 리더를 자네에게 맡기고 싶다고 생각하고 있어."
        }
      },
      {
        "who": "me",
        "text": "私にですか。ありがとうございます。身に余るお言葉です。",
        "gloss": {
          "en": "Me? Thank you. That's more than I deserve.",
          "ko": "저한테요? 감사합니다. 과분한 말씀이세요."
        }
      },
      {
        "who": "them",
        "text": "正直、上からの期待も大きくてね。私もなかなか大変なんだよ。",
        "gloss": {
          "en": "Honestly, expectations from above are high. It's been pretty tough for me too.",
          "ko": "솔직히 위에서 거는 기대도 커서 말이야. 나도 꽤 힘들어."
        }
      },
      {
        "who": "me",
        "text": "お察しします。今の案件の目処が立つか確認したうえで、前向きに検討します。",
        "gloss": {
          "en": "I can imagine. Once I've checked whether my current project is on track, I'll consider it positively.",
          "ko": "그 마음 헤아려집니다. 지금 건이 마무리될지 확인한 다음에 긍정적으로 검토하겠습니다."
        }
      },
      {
        "who": "them",
        "text": "ありがとう。来週中に返事をもらえると助かるよ。",
        "gloss": {
          "en": "Thanks. It'd help if you could get back to me within next week.",
          "ko": "고마워. 다음 주 중에 답을 주면 좋겠어."
        }
      },
      {
        "who": "me",
        "text": "承知しました。その前に、チームの体制について一度ご相談させていただけますか。ご無理のない範囲で、お時間をいただければと思います。",
        "gloss": {
          "en": "Understood. Before that, could I consult you once about the team setup? Whenever it suits you, I'd appreciate a little of your time.",
          "ko": "알겠습니다. 그 전에 팀 체제에 대해 한번 상의드려도 될까요? 무리가 안 되는 선에서 시간을 내 주시면 좋겠습니다."
        }
      },
      {
        "who": "them",
        "text": "いいよ。木曜の午後なら空いてるから。",
        "gloss": {
          "en": "Sure. I'm free Thursday afternoon.",
          "ko": "좋아. 목요일 오후라면 비어 있으니까."
        }
      },
      {
        "who": "me",
        "text": "ありがとうございます。では、木曜の午後に伺います。",
        "gloss": {
          "en": "Thank you. Then I'll come by on Thursday afternoon.",
          "ko": "감사합니다. 그럼 목요일 오후에 찾아뵙겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-5-x2",
    "stage": 5,
    "setting": {
      "en": "Planning a coworker's farewell party",
      "ko": "동료 송별회 계획하기"
    },
    "expressions": [
      "水を差すようで悪いけど",
      "ここだけの話",
      "それはそれとして"
    ],
    "grammar": [],
    "earlierGrammar": [
      "4:3",
      "3:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "田中さんの送別会、サプライズでやらない？みんなで動画も作ってさ。",
        "gloss": {
          "en": "Why don't we make Tanaka's farewell party a surprise? We could all make a video too.",
          "ko": "다나카 씨 송별회, 서프라이즈로 하지 않을래? 다 같이 영상도 만들고."
        }
      },
      {
        "who": "me",
        "text": "いいね。ただ、水を差すようで悪いけど、田中さんってサプライズ苦手じゃなかったっけ？",
        "gloss": {
          "en": "Nice. But sorry to be a wet blanket — isn't Tanaka not big on surprises?",
          "ko": "좋다. 근데 찬물 끼얹는 것 같아서 미안한데, 다나카 씨 서프라이즈 싫어하지 않았나?"
        }
      },
      {
        "who": "them",
        "text": "え、そうなの？",
        "gloss": {
          "en": "Huh, really?",
          "ko": "어, 그래?"
        }
      },
      {
        "who": "me",
        "text": "ここだけの話、前に誕生日のサプライズをされたとき、正直困ったって言ってたんだよね。",
        "gloss": {
          "en": "Just between us, when people threw him a surprise birthday before, he said it honestly made him uncomfortable.",
          "ko": "우리끼리 얘긴데, 전에 생일 서프라이즈 받았을 때 솔직히 곤란했다고 하더라."
        }
      },
      {
        "who": "them",
        "text": "そうだったんだ…。じゃあ、普通の送別会にしようか。",
        "gloss": {
          "en": "I didn't know... Then let's make it a normal farewell party.",
          "ko": "그랬구나…. 그럼 평범한 송별회로 할까."
        }
      },
      {
        "who": "me",
        "text": "うん、そのほうが喜ぶと思う。それはそれとして、動画はいいアイデアだから、当日みんなで見ようよ。",
        "gloss": {
          "en": "Yeah, I think he'd like that better. That aside, the video's a good idea, so let's all watch it on the day.",
          "ko": "응, 그게 더 좋아할 거야. 그건 그렇고, 영상은 좋은 아이디어니까 당일에 다 같이 보자."
        }
      },
      {
        "who": "them",
        "text": "確かに。じゃあ、みんなからメッセージ集めとくね。",
        "gloss": {
          "en": "True. Then I'll collect messages from everyone.",
          "ko": "맞네. 그럼 다들한테 메시지 모아 둘게."
        }
      },
      {
        "who": "me",
        "text": "ありがとう。私はお店を探しておくね。",
        "gloss": {
          "en": "Thanks. I'll look for a venue.",
          "ko": "고마워. 나는 가게 찾아 둘게."
        }
      }
    ]
  },
  {
    "id": "ja-5-x3",
    "stage": 5,
    "setting": {
      "en": "Complaining about the company trip",
      "ko": "사원 여행 푸념하기"
    },
    "expressions": [
      "気が進まない",
      "悪くはないけど",
      "今さら言っても"
    ],
    "grammar": [],
    "earlierGrammar": [
      "4:4",
      "4:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "来週の社員旅行、行くの？",
        "gloss": {
          "en": "Are you going on next week's company trip?",
          "ko": "다음 주 사원 여행 가?"
        }
      },
      {
        "who": "me",
        "text": "一応行くけど、正直あんまり気が進まないんだよね。",
        "gloss": {
          "en": "I'm going, technically, but honestly I'm not really in the mood for it.",
          "ko": "일단 가긴 하는데, 솔직히 별로 내키지 않아."
        }
      },
      {
        "who": "them",
        "text": "なんで？温泉でしょ？",
        "gloss": {
          "en": "Why? It's a hot spring, isn't it?",
          "ko": "왜? 온천이잖아?"
        }
      },
      {
        "who": "me",
        "text": "温泉は悪くはないけど、夜の宴会で毎年カラオケを歌わされるのがつらくて。",
        "gloss": {
          "en": "The hot spring isn't bad, but every year I get made to sing karaoke at the night banquet, and it's painful.",
          "ko": "온천은 나쁘진 않은데, 밤 연회에서 매년 노래방 노래 부르게 시키는 게 괴로워서."
        }
      },
      {
        "who": "them",
        "text": "あー、それはきついね。最初から断っておけばよかったのに。",
        "gloss": {
          "en": "Ah, that's rough. You should have said no from the start.",
          "ko": "아, 그건 힘들겠다. 처음부터 거절해 두지 그랬어."
        }
      },
      {
        "who": "me",
        "text": "それ、今さら言っても仕方ないって。もう申し込んじゃったし。",
        "gloss": {
          "en": "There's no point saying that now. I've already signed up.",
          "ko": "그거 이제 와서 말해 봤자 소용없어. 벌써 신청해 버렸고."
        }
      },
      {
        "who": "them",
        "text": "じゃあ、宴会では一緒に隅っこで飲んでよう。",
        "gloss": {
          "en": "Then let's drink together in a corner at the banquet.",
          "ko": "그럼 연회 때는 같이 구석에서 마시고 있자."
        }
      },
      {
        "who": "me",
        "text": "それいいね。そうしよう。",
        "gloss": {
          "en": "That sounds good. Let's do that.",
          "ko": "그거 좋다. 그렇게 하자."
        }
      }
    ]
  },
  {
    "id": "ja-5-x4",
    "stage": 5,
    "setting": {
      "en": "Talking with a friend about news of four-day work weeks",
      "ko": "주 4일 근무 뉴스를 두고 친구와 이야기하기"
    },
    "expressions": [
      "正直なところ"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "ニュース見た？週休三日制を導入する会社が増えてるんだって。",
        "gloss": {
          "en": "Did you see the news? More companies are bringing in a four-day work week.",
          "ko": "뉴스 봤어? 주 4일 근무를 도입하는 회사가 늘고 있대."
        }
      },
      {
        "who": "me",
        "text": "見た見た。休みが増えるのはうれしいよね。とはいえ、その分一日に働く時間が長くなるらしいよ。",
        "gloss": {
          "en": "Yeah, I saw it. More days off is nice. That said, apparently each workday gets longer to make up for it.",
          "ko": "봤어. 쉬는 날이 느는 건 좋지. 그렇다고는 해도 그만큼 하루에 일하는 시간이 길어진대."
        }
      },
      {
        "who": "them",
        "text": "え、そうなの？それじゃ、あんまり意味なくない？",
        "gloss": {
          "en": "What, really? Then isn't it kind of pointless?",
          "ko": "어, 그래? 그럼 별 의미 없지 않아?"
        }
      },
      {
        "who": "me",
        "text": "そう思うよね。でも、子育てや介護をしている人には、まとまった休みがあるのは大きいみたい。",
        "gloss": {
          "en": "You'd think so. But for people raising kids or caring for family, a block of days off seems to make a big difference.",
          "ko": "그렇게 생각하지. 근데 육아나 간병하는 사람한테는 쉬는 날이 몰려 있는 게 크대."
        }
      },
      {
        "who": "them",
        "text": "確かに。通勤が一日減るだけでも楽だしね。うちの会社でもやってくれないかな。",
        "gloss": {
          "en": "True. Even one less day of commuting is easier. I wish my company would do it.",
          "ko": "확실히. 출근이 하루 주는 것만으로도 편하고. 우리 회사도 해 주면 좋겠다."
        }
      },
      {
        "who": "me",
        "text": "でも、制度ができたとはいえ、実際に使える雰囲気かどうかは別の話だけどね。",
        "gloss": {
          "en": "But even if the system exists, whether people actually feel free to use it is another story.",
          "ko": "근데 제도가 생겼다고 해도, 실제로 쓸 수 있는 분위기인지는 또 다른 얘기지."
        }
      },
      {
        "who": "them",
        "text": "それ、すごく分かる。結局、上の人が率先して休まないとね。",
        "gloss": {
          "en": "I totally get that. In the end, the people at the top have to take the days off first.",
          "ko": "그거 완전 공감. 결국 윗사람이 먼저 쉬어야지."
        }
      },
      {
        "who": "me",
        "text": "正直なところ、そこが一番難しいんだろうな。",
        "gloss": {
          "en": "Honestly, that's probably the hardest part.",
          "ko": "솔직히 그게 제일 어려운 부분이겠지."
        }
      }
    ]
  },
  {
    "id": "ja-5-x5",
    "stage": 5,
    "setting": {
      "en": "A friend asks how your new job is going",
      "ko": "친구가 새 직장 생활을 물어봄"
    },
    "expressions": [
      "気が進まない",
      "言われてみれば"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "新しい会社、もう慣れた？",
        "gloss": {
          "en": "Have you gotten used to the new company yet?",
          "ko": "새 회사, 이제 좀 익숙해졌어?"
        }
      },
      {
        "who": "me",
        "text": "うーん、転職したものの、正直まだ前の会社のやり方が抜けなくて。",
        "gloss": {
          "en": "Hmm, I did change jobs, but honestly I still can't shake how my old company did things.",
          "ko": "음, 이직은 했지만 솔직히 아직 전 회사 방식이 몸에서 안 빠져서."
        }
      },
      {
        "who": "them",
        "text": "まだ一か月でしょ？そんなもんだよ。",
        "gloss": {
          "en": "It's only been a month, right? That's normal.",
          "ko": "아직 한 달이잖아? 다 그래."
        }
      },
      {
        "who": "me",
        "text": "分かってはいるんだけどね。研修では分かったつもりでも、実際の仕事になると知らないことだらけで。",
        "gloss": {
          "en": "I know that. Even if I thought I got it in training, the actual work is full of things I don't know.",
          "ko": "알고는 있는데. 연수 때는 안다고 생각해도 막상 실제 일에서는 모르는 것투성이라."
        }
      },
      {
        "who": "them",
        "text": "周りの人には聞けてる？",
        "gloss": {
          "en": "Are you able to ask the people around you?",
          "ko": "주변 사람들한테는 물어보고 있어?"
        }
      },
      {
        "who": "me",
        "text": "聞こうとは思うものの、みんな忙しそうで、なんか気が進まないんだよね。",
        "gloss": {
          "en": "I mean to ask, but everyone looks busy, so somehow I don't feel like it.",
          "ko": "물어보려고는 하는데, 다들 바빠 보여서 왠지 내키지가 않아."
        }
      },
      {
        "who": "them",
        "text": "考えすぎだよ。新人なんだから、聞いて当たり前だって。",
        "gloss": {
          "en": "You're overthinking it. You're new, so asking is only natural.",
          "ko": "너무 생각이 많다. 신입이니까 물어보는 게 당연하지."
        }
      },
      {
        "who": "me",
        "text": "言われてみれば、そうだね。明日、思い切って先輩に聞いてみる。",
        "gloss": {
          "en": "Now that you say it, you're right. Tomorrow I'll just go ahead and ask a senior colleague.",
          "ko": "듣고 보니 그렇네. 내일 용기 내서 선배한테 물어볼게."
        }
      }
    ]
  },
  {
    "id": "ja-5-x6",
    "stage": 5,
    "setting": {
      "en": "A friend is about to travel abroad alone for the first time",
      "ko": "처음으로 혼자 해외여행 가는 친구에게 조언하기"
    },
    "expressions": [
      "考えすぎだよ"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "来月、初めて一人で海外に行くんだけど、何か準備しといたほうがいいことある？",
        "gloss": {
          "en": "Next month I'm going abroad alone for the first time. Is there anything I should prepare?",
          "ko": "다음 달에 처음으로 혼자 해외 가는데, 뭐 준비해 두면 좋은 거 있어?"
        }
      },
      {
        "who": "me",
        "text": "そうだね、まずは保険かな。何も起きないに越したことはないけど、入っておけば安心だから。",
        "gloss": {
          "en": "Let's see, insurance first. It's best if nothing happens, of course, but you'll feel safer if you have it.",
          "ko": "글쎄, 우선 보험이려나. 아무 일 없는 게 제일이지만, 들어 두면 안심되니까."
        }
      },
      {
        "who": "them",
        "text": "そっか。両替は現地でしたほうが安いって聞いたけど。",
        "gloss": {
          "en": "I see. I heard exchanging money there is cheaper, though.",
          "ko": "그렇구나. 환전은 현지에서 하는 게 싸다고 들었는데."
        }
      },
      {
        "who": "me",
        "text": "それもそうなんだけど、着いてすぐ使うお金もあるし、少しは日本で替えておくに越したことはないよ。",
        "gloss": {
          "en": "That's true, but you'll need money as soon as you land, so it's best to exchange a little in Japan.",
          "ko": "그것도 맞긴 한데, 도착하자마자 쓸 돈도 있으니까 조금은 일본에서 바꿔 두는 게 좋아."
        }
      },
      {
        "who": "them",
        "text": "なるほどね。荷物はなるべく少なくしたいんだけど。",
        "gloss": {
          "en": "Got it. I want to pack as light as possible, though.",
          "ko": "그렇구나. 짐은 되도록 적게 하고 싶은데."
        }
      },
      {
        "who": "me",
        "text": "いいと思う。ただ、いつも飲んでる薬だけは持っていきなよ。現地で探すのは意外と大変だから。",
        "gloss": {
          "en": "Good idea. Just make sure to bring the medicine you usually take. Finding it there is harder than you'd think.",
          "ko": "좋다고 생각해. 다만 평소 먹는 약만은 챙겨 가. 현지에서 찾는 게 의외로 힘들거든."
        }
      },
      {
        "who": "them",
        "text": "確かに。いろいろ考えてたら、なんか緊張してきた。",
        "gloss": {
          "en": "True. Thinking about all this is making me nervous.",
          "ko": "그렇네. 이것저것 생각하니까 왠지 긴장된다."
        }
      },
      {
        "who": "me",
        "text": "考えすぎだよ。それだけ準備しておけば大丈夫だって。楽しんできてね。",
        "gloss": {
          "en": "You're overthinking it. With that much preparation you'll be fine. Have fun.",
          "ko": "너무 걱정한다. 그만큼 준비해 두면 괜찮아. 재밌게 놀다 와."
        }
      }
    ]
  }
];
