import type { StageScript } from "../stageScripts.ts";

/** ja 단계 대본(curriculum/stageScripts.ts) — Claude가 쓰고 한 번 다시 고침, 원어민 확인 전. */
export const JA: StageScript[] = [
  {
    "id": "ja-1-1",
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "Meeting someone for the first time at a language exchange",
      "ko": "언어 교환 모임에서 처음 만난 사람과"
    },
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
        "text": "すみません、これとこれ、お願いします。",
        "gloss": {
          "en": "Excuse me, this and this, please.",
          "ko": "저기요, 이거랑 이거 부탁해요."
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
    "id": "ja-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Making weekend plans with a friend",
      "ko": "친구와 주말 약속 잡기"
    },
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
        "text": "風邪をひきました。のどが痛いです。",
        "gloss": {
          "en": "I've caught a cold. My throat hurts.",
          "ko": "감기에 걸렸어요. 목이 아파요."
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
        "text": "おとといからです。せきも少し出ています。",
        "gloss": {
          "en": "Since the day before yesterday. I have a bit of a cough too.",
          "ko": "그저께부터요. 기침도 조금 나요."
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
        "text": "はい、大丈夫です。",
        "gloss": {
          "en": "Yes, sure.",
          "ko": "네, 괜찮아요."
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
    "id": "ja-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Apologizing to a friend for being late",
      "ko": "늦어서 친구에게 사과하기"
    },
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
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "A problem with your hotel room while traveling",
      "ko": "여행 중 숙소 방에 문제가 생겼을 때 프런트에 전화하기"
    },
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
    "id": "ja-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Phoning a client about a delayed delivery",
      "ko": "거래처에 납품 지연을 전화로 알리기"
    },
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
        "text": "そうですね…。正直なところ、親が韓国から来ることになっていて、ちょっと動かしにくくて。",
        "gloss": {
          "en": "Well... honestly, my parents are coming over from Korea, so it's a bit hard to shift.",
          "ko": "그게요…. 솔직히 부모님이 한국에서 오시기로 돼 있어서 좀 옮기기 어려워서요."
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
        "text": "うーん、それだけで決まるとは限らないと思うよ。面接って、相性とかタイミングもあるし。",
        "gloss": {
          "en": "Hmm, I don't think it's necessarily decided by that alone. Interviews also come down to fit and timing.",
          "ko": "음, 그것만으로 결정되는 건 아닐 거야. 면접은 궁합이나 타이밍도 있으니까."
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
  }
];
