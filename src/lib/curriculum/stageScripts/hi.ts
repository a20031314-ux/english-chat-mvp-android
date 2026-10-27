import type { StageScript } from "../stageScripts.ts";

/** hi 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const HI: StageScript[] = [
  {
    "id": "hi-1-1",
    "name": {
      "text": [
        "मिनजुन"
      ],
      "en": [
        "Min-jun"
      ],
      "ko": [
        "민준"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "First Hindi class: meeting Priya, a new classmate",
      "ko": "힌디어 수업 첫날, 새 친구 프리야와"
    },
    "expressions": [
      "नमस्ते",
      "मेरा नाम",
      "आप कैसे हैं",
      "अच्छा",
      "जी",
      "धन्यवाद"
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
        "text": "नमस्ते! मैं प्रिया हूँ। आपका नाम क्या है?",
        "gloss": {
          "en": "Hello! I'm Priya. What's your name?",
          "ko": "안녕하세요! 저는 프리야예요. 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते! मेरा नाम मिनजुन है।",
        "gloss": {
          "en": "Hello! My name is Min-jun.",
          "ko": "안녕하세요! 제 이름은 민준이에요."
        },
        "frames": [
          "hi-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "आप कहाँ से हैं, मिनजुन?",
        "gloss": {
          "en": "Where are you from, Min-jun?",
          "ko": "민준 씨는 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "मैं कोरिया से हूँ। आप कैसे हैं?",
        "gloss": {
          "en": "I'm from Korea. How are you?",
          "ko": "저는 한국에서 왔어요. 잘 지내세요?"
        },
        "frames": [
          "hi-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "मैं ठीक हूँ, शुक्रिया। आप दिल्ली में क्या करते हैं?",
        "gloss": {
          "en": "I'm fine, thanks. What do you do in Delhi?",
          "ko": "잘 지내요, 고마워요. 델리에서 뭐 하세요?"
        }
      },
      {
        "who": "me",
        "text": "मैं छात्र हूँ। क्या आप भी छात्र हैं?",
        "gloss": {
          "en": "I'm a student. Are you a student too?",
          "ko": "저는 학생이에요. 프리야 씨도 학생이에요?"
        },
        "frames": [
          "hi-f1-03",
          "hi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "नहीं, मैं डॉक्टर हूँ। अरे, यह किसकी किताब है?",
        "gloss": {
          "en": "No, I'm a doctor. Oh, whose book is this?",
          "ko": "아니요, 저는 의사예요. 어, 이거 누구 책이에요?"
        }
      },
      {
        "who": "me",
        "text": "अच्छा! जी, यह मेरी किताब है। धन्यवाद!",
        "gloss": {
          "en": "Oh, I see! Yes, this is my book. Thank you!",
          "ko": "아, 그렇구나! 네, 그거 제 책이에요. 고마워요!"
        },
        "frames": [
          "hi-f1-13"
        ]
      }
    ]
  },
  {
    "id": "hi-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying fruit from a vendor at a market stall",
      "ko": "시장 가판대에서 과일 장수에게 과일 사기"
    },
    "expressions": [
      "नमस्ते",
      "कितने का है",
      "माफ़ कीजिए",
      "मुझे समझ नहीं आया",
      "फिर से बोलिए",
      "हाँ",
      "ठीक है",
      "यह दीजिए",
      "शुक्रिया"
    ],
    "grammar": [
      3,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "आइए, आइए! क्या चाहिए?",
        "gloss": {
          "en": "Come in, come in! What do you need?",
          "ko": "어서 오세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते भैया। यह पपीता कितने का है?",
        "gloss": {
          "en": "Hello. How much is this papaya?",
          "ko": "안녕하세요, 아저씨. 이 파파야 얼마예요?"
        },
        "frames": [
          "hi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "साठ रुपये का। बहुत मीठा है।",
        "gloss": {
          "en": "Sixty rupees. It's very sweet.",
          "ko": "육십 루피요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मुझे समझ नहीं आया। फिर से बोलिए।",
        "gloss": {
          "en": "Sorry, I didn't understand. Please say it again.",
          "ko": "죄송해요, 못 알아들었어요. 다시 말해 주세요."
        },
        "frames": [
          "hi-f1-16",
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "सा-ठ, साठ रुपये। और कुछ चाहिए?",
        "gloss": {
          "en": "Six-ty, sixty rupees. Anything else?",
          "ko": "육-십, 육십 루피요. 더 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मुझे केले भी चाहिए।",
        "gloss": {
          "en": "Yes, I need bananas too.",
          "ko": "네, 바나나도 필요해요."
        },
        "frames": [
          "hi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। ये केले लीजिए, दर्जन के चालीस।",
        "gloss": {
          "en": "Okay. Take these bananas, forty a dozen.",
          "ko": "알겠어요. 이 바나나 가져가세요, 한 다스에 사십이에요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, यह दीजिए। शुक्रिया!",
        "gloss": {
          "en": "Okay, give me this. Thanks!",
          "ko": "좋아요, 이걸로 주세요. 고마워요!"
        },
        "frames": [
          "hi-f1-10"
        ]
      }
    ]
  },
  {
    "id": "hi-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a staff member for directions inside a Delhi metro station",
      "ko": "델리 지하철역에서 직원에게 길 묻기"
    },
    "expressions": [
      "माफ़ कीजिए",
      "कहाँ है",
      "धीरे बोलिए",
      "अच्छा",
      "ठीक है",
      "धन्यवाद"
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
        "text": "जी, बोलिए?",
        "gloss": {
          "en": "Yes, how can I help?",
          "ko": "네, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, येलो लाइन कहाँ है?",
        "gloss": {
          "en": "Excuse me, where is the Yellow Line?",
          "ko": "실례합니다, 옐로 라인이 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "येलो लाइन नीचे है, प्लेटफ़ॉर्म दो पर। सीढ़ियों से नीचे जाइए और बाएँ मुड़िए।",
        "gloss": {
          "en": "The Yellow Line is downstairs, on platform two. Go down the stairs and turn left.",
          "ko": "옐로 라인은 아래층 이 번 승강장이에요. 계단으로 내려가서 왼쪽으로 도세요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा... थोड़ा धीरे बोलिए।",
        "gloss": {
          "en": "Okay... please speak a bit slowly.",
          "ko": "아... 조금 천천히 말해 주세요."
        },
        "frames": [
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "कोई बात नहीं। नीचे जाइए... प्लेटफ़ॉर्म दो पर।",
        "gloss": {
          "en": "No problem. Go downstairs... to platform two.",
          "ko": "괜찮아요. 아래로 내려가세요... 이 번 승강장이요."
        }
      },
      {
        "who": "me",
        "text": "प्लेटफ़ॉर्म दो पर? क्या राजीव चौक इसी लाइन पर है?",
        "gloss": {
          "en": "Platform two? Is Rajiv Chowk on this line?",
          "ko": "이 번 승강장이요? 라지브 촉이 이 노선에 있어요?"
        }
      },
      {
        "who": "them",
        "text": "हाँ, सीधी ट्रेन है। चार स्टेशन बाद।",
        "gloss": {
          "en": "Yes, it's a direct train. Four stations from here.",
          "ko": "네, 바로 가는 열차예요. 네 정거장 뒤예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, बहुत धन्यवाद!",
        "gloss": {
          "en": "Okay, thank you very much!",
          "ko": "알겠어요, 정말 고맙습니다!"
        }
      }
    ]
  },
  {
    "id": "hi-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Taking an auto-rickshaw to India Gate in Delhi",
      "ko": "델리에서 오토릭샤를 타고 인디아 게이트로 가기"
    },
    "expressions": [
      "नमस्ते",
      "एक मिनट",
      "शुक्रिया",
      "फिर मिलेंगे"
    ],
    "grammar": [
      0,
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "हाँ जी, कहाँ जाना है?",
        "gloss": {
          "en": "Yes, where do you want to go?",
          "ko": "네, 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते भैया। इंडिया गेट चलिए।",
        "gloss": {
          "en": "Hello. Please go to India Gate.",
          "ko": "안녕하세요, 기사님. 인디아 게이트로 가 주세요."
        },
        "frames": [
          "hi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "इंडिया गेट? दो सौ रुपये लगेंगे।",
        "gloss": {
          "en": "India Gate? It'll be two hundred rupees.",
          "ko": "인디아 게이트요? 이백 루피예요."
        }
      },
      {
        "who": "me",
        "text": "दो सौ? बहुत ज़्यादा है। मीटर से चलिए।",
        "gloss": {
          "en": "Two hundred? That's too much. Please go by the meter.",
          "ko": "이백이요? 너무 비싸요. 미터기로 가 주세요."
        },
        "frames": [
          "hi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा ठीक है, बैठिए। आप कहाँ से हैं?",
        "gloss": {
          "en": "Alright, fine, get in. Where are you from?",
          "ko": "알았어요, 타세요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "मैं कोरिया से हूँ। दिल्ली में मेरा पहला दिन है।",
        "gloss": {
          "en": "I'm from Korea. It's my first day in Delhi.",
          "ko": "한국에서 왔어요. 델리는 오늘이 첫날이에요."
        },
        "frames": [
          "hi-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "अरे वाह! लीजिए, इंडिया गेट आ गया। सौ रुपये।",
        "gloss": {
          "en": "Oh wow! Here we are, India Gate. A hundred rupees.",
          "ko": "와! 자, 인디아 게이트 도착했어요. 백 루피예요."
        }
      },
      {
        "who": "me",
        "text": "एक मिनट... यह लीजिए। शुक्रिया भैया, फिर मिलेंगे!",
        "gloss": {
          "en": "One minute... here you go. Thanks, see you again!",
          "ko": "잠깐만요... 여기요. 고마워요, 기사님. 또 봬요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-x1",
    "stage": 1,
    "setting": {
      "en": "Meeting a neighbour on the stairs",
      "ko": "계단에서 이웃을 만났을 때"
    },
    "expressions": [
      "मैं ठीक हूँ",
      "आपका नाम क्या है",
      "कोई बात नहीं",
      "जी",
      "फिर मिलेंगे"
    ],
    "grammar": [
      0,
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! आप कैसे हैं?",
        "gloss": {
          "en": "Hello! How are you?",
          "ko": "안녕하세요! 잘 지내세요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते! मैं ठीक हूँ। आपका नाम क्या है?",
        "gloss": {
          "en": "Hello! I'm fine. What's your name?",
          "ko": "안녕하세요! 잘 지내요. 성함이 어떻게 되세요?"
        },
        "frames": [
          "hi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "मेरा नाम सुनीता है। माफ़ कीजिए, मैं जल्दी में हूँ।",
        "gloss": {
          "en": "My name is Sunita. Sorry, I'm in a hurry.",
          "ko": "저는 수니타예요. 미안해요, 제가 좀 바빠서요."
        }
      },
      {
        "who": "me",
        "text": "कोई बात नहीं। क्या वह आपका घर है?",
        "gloss": {
          "en": "No problem. Is that your house?",
          "ko": "괜찮아요. 저기가 댁이에요?"
        }
      },
      {
        "who": "them",
        "text": "हाँ, वह मेरा घर है। फिर मिलेंगे!",
        "gloss": {
          "en": "Yes, that's my house. See you again!",
          "ko": "네, 저기가 우리 집이에요. 또 봬요!"
        }
      },
      {
        "who": "me",
        "text": "जी, फिर मिलेंगे!",
        "gloss": {
          "en": "Sure, see you again!",
          "ko": "네, 또 봬요!"
        }
      }
    ]
  },
  {
    "id": "hi-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Evening at your host family's home: Aunty asks about your day",
      "ko": "홈스테이 집 저녁, 아주머니가 하루를 물어볼 때"
    },
    "expressions": [
      "बहुत अच्छा",
      "आज सुबह",
      "थक गया",
      "मुझे पसंद है",
      "मेरे घर में",
      "बड़ा भाई",
      "छोटी बहन"
    ],
    "grammar": [
      2,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "1:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "आ गए बेटा? आज का दिन कैसा रहा?",
        "gloss": {
          "en": "You're back, dear? How was your day?",
          "ko": "왔니? 오늘 하루 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा, आंटी! आज सुबह मैं लोधी गार्डन गया।",
        "gloss": {
          "en": "Really good, Aunty! This morning I went to Lodhi Garden.",
          "ko": "아주 좋았어요, 아주머니! 오늘 아침에 로디 가든에 갔어요."
        },
        "frames": [
          "hi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "अरे वाह! फिर क्या किया?",
        "gloss": {
          "en": "Oh nice! Then what did you do?",
          "ko": "와, 좋네! 그다음엔 뭐 했어?"
        }
      },
      {
        "who": "me",
        "text": "फिर मैं क्लास गया। क्लास के बाद मैं दोस्तों के साथ बाज़ार गया।",
        "gloss": {
          "en": "Then I went to class. After class I went to the market with friends.",
          "ko": "그다음엔 수업에 갔어요. 수업 끝나고 친구들이랑 시장에 갔어요."
        },
        "frames": [
          "hi-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "थक गए होगे। चाय पियोगे?",
        "gloss": {
          "en": "You must be tired. Will you have some tea?",
          "ko": "피곤하겠다. 차 마실래?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, सच में थक गया। आपकी चाय तो मुझे पसंद है!",
        "gloss": {
          "en": "Yes, I'm really tired. I love your tea!",
          "ko": "네, 정말 피곤해요. 아주머니 차는 제가 좋아하잖아요!"
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "अभी बनाती हूँ। तुम्हारे घर में कौन-कौन है?",
        "gloss": {
          "en": "I'll make it now. Who's in your family?",
          "ko": "지금 끓여 줄게. 너희 집엔 누구누구 있어?"
        }
      },
      {
        "who": "me",
        "text": "मेरे घर में मम्मी, पापा, एक बड़ा भाई और एक छोटी बहन हैं।",
        "gloss": {
          "en": "In my family there's Mom, Dad, an older brother and a younger sister.",
          "ko": "우리 집엔 엄마, 아빠, 형 한 명, 여동생 한 명 있어요."
        }
      },
      {
        "who": "them",
        "text": "अच्छा! और कल क्या करोगे?",
        "gloss": {
          "en": "I see! And what will you do tomorrow?",
          "ko": "그렇구나! 그럼 내일은 뭐 할 거야?"
        }
      },
      {
        "who": "me",
        "text": "कल मैं सात बजे उठूँगा और आगरा जाऊँगा।",
        "gloss": {
          "en": "Tomorrow I'll get up at seven and go to Agra.",
          "ko": "내일은 일곱 시에 일어나서 아그라에 갈 거예요."
        },
        "frames": [
          "hi-f2-04"
        ]
      }
    ]
  },
  {
    "id": "hi-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Lunch at a roadside dhaba on the highway",
      "ko": "고속도로 옆 다바(길가 식당)에서 점심 주문하기"
    },
    "expressions": [
      "ज़्यादा तीखा नहीं",
      "मुझे पसंद नहीं",
      "बहुत अच्छा",
      "बिल ले आइए",
      "ज़रूर",
      "मज़ा आया"
    ],
    "grammar": [
      0,
      2,
      4
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते साहब, क्या लेंगे?",
        "gloss": {
          "en": "Hello sir, what will you have?",
          "ko": "어서 오세요, 뭐 드시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते भैया। यहाँ क्या अच्छा मिलता है?",
        "gloss": {
          "en": "Hello. What's good here?",
          "ko": "안녕하세요. 여기 뭐가 맛있어요?"
        }
      },
      {
        "who": "them",
        "text": "दाल मखनी और पनीर बहुत अच्छा बनता है।",
        "gloss": {
          "en": "The dal makhani and the paneer are really good.",
          "ko": "달 마크니랑 파니르 요리가 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "मुझे पनीर पसंद है। एक पनीर बटर मसाला, पर ज़्यादा तीखा नहीं।",
        "gloss": {
          "en": "I like paneer. One paneer butter masala, but not too spicy.",
          "ko": "파니르 좋아해요. 파니르 버터 마살라 하나요, 너무 맵지 않게요."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। साथ में रोटी या चावल?",
        "gloss": {
          "en": "Okay. Roti or rice with it?",
          "ko": "알겠습니다. 로티랑 드실래요, 밥이랑 드실래요?"
        }
      },
      {
        "who": "me",
        "text": "चार रोटी, प्लीज़। और प्याज़ मत डालना, प्याज़ मुझे पसंद नहीं।",
        "gloss": {
          "en": "Four rotis, please. And no onion, I don't like onion.",
          "ko": "로티 네 장 주세요. 그리고 양파는 빼 주세요, 양파 싫어해요."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "जी, बिलकुल। दस मिनट में आ रहा है।",
        "gloss": {
          "en": "Sure, of course. It'll be out in ten minutes.",
          "ko": "네, 그럼요. 십 분이면 나와요."
        }
      },
      {
        "who": "me",
        "text": "भैया, खाना बहुत अच्छा था! बिल ले आइए।",
        "gloss": {
          "en": "The food was really good! Please bring the bill.",
          "ko": "음식 정말 맛있었어요! 계산서 가져다주세요."
        },
        "frames": [
          "hi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "यह लीजिए, तीन सौ बीस रुपये। फिर आइएगा!",
        "gloss": {
          "en": "Here you go, three hundred twenty rupees. Do come again!",
          "ko": "여기요, 삼백이십 루피입니다. 또 오세요!"
        }
      },
      {
        "who": "me",
        "text": "ज़रूर! बहुत मज़ा आया। अगले हफ़्ते फिर आऊँगा।",
        "gloss": {
          "en": "Definitely! I really enjoyed it. I'll come again next week.",
          "ko": "꼭 올게요! 정말 좋았어요. 다음 주에 또 올게요."
        }
      }
    ]
  },
  {
    "id": "hi-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Friday evening: phoning your friend Rahul about the weekend",
      "ko": "금요일 저녁, 친구 라훌과 전화로 주말 약속 잡기"
    },
    "expressions": [
      "सब ठीक है",
      "आज क्या कर रहे हो",
      "पता नहीं",
      "कोई प्लान है",
      "ज़रूर",
      "कितने बजे",
      "जल्दी आना",
      "कल मिलते हैं"
    ],
    "grammar": [
      1,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "हैलो! क्या हाल है?",
        "gloss": {
          "en": "Hello! How's it going?",
          "ko": "여보세요! 잘 지내?"
        }
      },
      {
        "who": "me",
        "text": "अरे राहुल! सब ठीक है। तुम बताओ, आज क्या कर रहे हो?",
        "gloss": {
          "en": "Hey Rahul! All good. Tell me, what are you doing today?",
          "ko": "어, 라훌! 다 괜찮아. 너는? 오늘 뭐 해?"
        }
      },
      {
        "who": "them",
        "text": "कुछ ख़ास नहीं, घर पर बैठा हूँ। इस वीकेंड कोई प्लान है?",
        "gloss": {
          "en": "Nothing much, just sitting at home. Any plans this weekend?",
          "ko": "별거 없어, 집에 있어. 이번 주말에 계획 있어?"
        }
      },
      {
        "who": "me",
        "text": "पता नहीं, अभी कुछ तय नहीं। तुम्हारा कोई प्लान है?",
        "gloss": {
          "en": "Don't know, nothing fixed yet. Do you have any plans?",
          "ko": "몰라, 아직 정한 거 없어. 너는 무슨 계획 있어?"
        }
      },
      {
        "who": "them",
        "text": "कल नई फ़िल्म देखने चलें?",
        "gloss": {
          "en": "Shall we go see the new film tomorrow?",
          "ko": "내일 새 영화 보러 갈래?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, ज़रूर! फ़िल्म कितने बजे है?",
        "gloss": {
          "en": "Yes, sure! What time is the film?",
          "ko": "응, 좋아! 영화 몇 시야?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "शाम छह बजे का शो है। उससे पहले कुछ खाएँगे।",
        "gloss": {
          "en": "The show's at six in the evening. We'll grab a bite before that.",
          "ko": "저녁 여섯 시 상영이야. 그 전에 뭐 좀 먹자."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। मैं पाँच बजे से पहले मॉल पहुँचूँगा।",
        "gloss": {
          "en": "Okay. I'll get to the mall before five.",
          "ko": "좋아. 다섯 시 전에 몰에 도착할게."
        },
        "frames": [
          "hi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "पक्का? पिछली बार तुम आधा घंटा लेट थे!",
        "gloss": {
          "en": "Promise? Last time you were half an hour late!",
          "ko": "진짜지? 지난번엔 삼십 분 늦었잖아!"
        }
      },
      {
        "who": "me",
        "text": "हाहा, इस बार नहीं! तुम भी जल्दी आना। चलो, कल मिलते हैं।",
        "gloss": {
          "en": "Haha, not this time! You come early too. Okay, see you tomorrow.",
          "ko": "하하, 이번엔 안 늦어! 너도 일찍 와. 그럼 내일 보자."
        }
      }
    ]
  },
  {
    "id": "hi-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Back at the office on Monday, telling a coworker about your trip to Jaipur",
      "ko": "월요일 사무실에서 동료에게 자이푸르 여행 이야기하기"
    },
    "expressions": [
      "पिछले हफ़्ते",
      "मज़ा आया",
      "बड़ा भाई",
      "बहुत अच्छा",
      "थक गया"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "अरे, आप वापस आ गए! पिछले हफ़्ते आप कहाँ गए थे?",
        "gloss": {
          "en": "Oh, you're back! Where did you go last week?",
          "ko": "어, 돌아오셨네요! 지난주에 어디 다녀오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "पिछले हफ़्ते मैं जयपुर गया। बहुत मज़ा आया!",
        "gloss": {
          "en": "Last week I went to Jaipur. It was great fun!",
          "ko": "지난주에 자이푸르에 갔어요. 정말 재밌었어요!"
        },
        "frames": [
          "hi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "वाह! किसके साथ गए?",
        "gloss": {
          "en": "Wow! Who did you go with?",
          "ko": "와! 누구랑 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "मेरा बड़ा भाई अभी दिल्ली में रहता है, उसके साथ गया।",
        "gloss": {
          "en": "My older brother lives in Delhi now, so I went with him.",
          "ko": "형이 지금 델리에 살아서 형이랑 갔어요."
        },
        "frames": [
          "hi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा! वहाँ क्या-क्या देखा?",
        "gloss": {
          "en": "Nice! What all did you see there?",
          "ko": "좋네요! 거기서 뭐 뭐 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "हम पहले आमेर क़िले गए, फिर हवा महल गए।",
        "gloss": {
          "en": "We went to Amer Fort first, then to Hawa Mahal.",
          "ko": "먼저 암베르 성에 갔다가 하와 마할에 갔어요."
        }
      },
      {
        "who": "them",
        "text": "और जयपुर का खाना कैसा लगा?",
        "gloss": {
          "en": "And how did you find the food in Jaipur?",
          "ko": "자이푸르 음식은 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! दाल बाटी अब मुझे बहुत पसंद है।",
        "gloss": {
          "en": "Really good! Now I really love dal baati.",
          "ko": "정말 맛있었어요! 이제 달 바티가 너무 좋아요."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "और आज काम पर कैसा लग रहा है?",
        "gloss": {
          "en": "And how does it feel being back at work today?",
          "ko": "오늘 회사 나오니까 어때요?"
        }
      },
      {
        "who": "me",
        "text": "सच कहूँ तो थक गया हूँ। आज मैं छह बजे घर जाऊँगा।",
        "gloss": {
          "en": "To be honest, I'm worn out. Today I'll go home at six.",
          "ko": "솔직히 피곤해요. 오늘은 여섯 시에 집에 갈 거예요."
        },
        "frames": [
          "hi-f2-04"
        ]
      }
    ]
  },
  {
    "id": "hi-2-x1",
    "stage": 2,
    "setting": {
      "en": "Bumping into a friend you haven't seen for a while",
      "ko": "한동안 못 본 친구와 우연히 마주쳤을 때"
    },
    "expressions": [
      "क्या हाल है",
      "ज़रूर",
      "चलो चलते हैं"
    ],
    "grammar": [],
    "earlierGrammar": [
      "1:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "अरे, बहुत दिन बाद! कैसे हो?",
        "gloss": {
          "en": "Hey, long time no see! How are you?",
          "ko": "어, 오랜만이다! 잘 지냈어?"
        }
      },
      {
        "who": "me",
        "text": "मैं ठीक हूँ। तुम्हारा क्या हाल है?",
        "gloss": {
          "en": "I'm fine. How are you doing?",
          "ko": "난 잘 지내. 너는 어떻게 지내?"
        }
      },
      {
        "who": "them",
        "text": "सब ठीक है। मैं अभी कॉफ़ी पीने जा रहा हूँ। चलोगे?",
        "gloss": {
          "en": "All good. I'm just going for a coffee. Want to come?",
          "ko": "다 괜찮아. 나 지금 커피 마시러 가는데, 갈래?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, ज़रूर! मैं भी अभी फ़्री हूँ।",
        "gloss": {
          "en": "Yes, sure! I'm free right now too.",
          "ko": "응, 좋아! 나도 지금 한가해."
        }
      },
      {
        "who": "them",
        "text": "तो चलो, नीचे वाले कैफ़े में?",
        "gloss": {
          "en": "Then let's go, to the café downstairs?",
          "ko": "그럼 가자, 아래층 카페 어때?"
        }
      },
      {
        "who": "me",
        "text": "ठीक है, चलो चलते हैं!",
        "gloss": {
          "en": "Okay, let's go!",
          "ko": "좋아, 가자!"
        },
        "frames": [
          "hi-f2-14"
        ]
      }
    ]
  },
  {
    "id": "hi-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "At a railway ticket counter after your train was cancelled because of fog",
      "ko": "안개로 기차가 취소된 뒤 기차역 매표소에서"
    },
    "expressions": [
      "अब क्या करें",
      "पैसे वापस मिलेंगे",
      "कोई और रास्ता",
      "बात यह है कि",
      "उम्मीद है"
    ],
    "grammar": [
      0,
      1,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "1:5",
      "1:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "अगला! जी, बताइए।",
        "gloss": {
          "en": "Next! Yes, go ahead.",
          "ko": "다음 분! 네, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "नमस्ते। मेरी ट्रेन कैंसल हो गई है। अब क्या करें?",
        "gloss": {
          "en": "Hello. My train has been cancelled. What do I do now?",
          "ko": "안녕하세요. 제 기차가 취소됐어요. 이제 어떻게 해야 하죠?"
        }
      },
      {
        "who": "them",
        "text": "कौन-सी ट्रेन है? टिकट दिखाइए।",
        "gloss": {
          "en": "Which train is it? Show me the ticket.",
          "ko": "어떤 기차예요? 표 보여 주세요."
        },
        "alt": [
          {
            "text": "टिकट दिखाइए, कौन-सी गाड़ी थी?",
            "gloss": {
              "en": "Show me your ticket. Which train was it?",
              "ko": "표 보여 주세요. 어느 열차였어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "यह लीजिए। मैंने यह टिकट पिछले महीने ऑनलाइन बुक किया था।",
        "gloss": {
          "en": "Here you go. I booked this ticket online last month.",
          "ko": "여기요. 이 표는 지난달에 온라인으로 예매했어요."
        },
        "frames": [
          "hi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, कोहरे की वजह से यह ट्रेन आज नहीं चलेगी।",
        "gloss": {
          "en": "Yes, this train won't run today because of the fog.",
          "ko": "네, 안개 때문에 이 열차는 오늘 운행 안 해요."
        }
      },
      {
        "who": "me",
        "text": "क्या पैसे वापस मिलेंगे? या कोई और रास्ता है?",
        "gloss": {
          "en": "Will I get my money back? Or is there another option?",
          "ko": "환불받을 수 있어요? 아니면 다른 방법이 있나요?"
        }
      },
      {
        "who": "them",
        "text": "पूरे पैसे वापस मिलेंगे। अगर आप चाहें, तो कल सुबह की ट्रेन में सीट मिल सकती है।",
        "gloss": {
          "en": "You'll get a full refund. If you like, you can get a seat on tomorrow morning's train.",
          "ko": "전액 환불돼요. 원하시면 내일 아침 열차 좌석을 드릴 수 있어요."
        },
        "alt": [
          {
            "text": "रिफ़ंड तीन-चार दिन में आपके खाते में आ जाएगा। या फिर कल की कोई ट्रेन देख लीजिए।",
            "gloss": {
              "en": "The refund will reach your account in three or four days. Or else look at a train tomorrow.",
              "ko": "환불은 삼사 일 안에 계좌로 들어가요. 아니면 내일 열차를 알아보세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "बात यह है कि मुझे कल सुबह तक जयपुर पहुँचना है। क्या आप आज रात की कोई ट्रेन देख सकते हैं?",
        "gloss": {
          "en": "The thing is, I have to reach Jaipur by tomorrow morning. Could you check for a train tonight?",
          "ko": "사실 제가 내일 아침까지 자이푸르에 가야 해요. 오늘 밤 열차 좀 찾아봐 주실 수 있어요?"
        },
        "frames": [
          "hi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "एक मिनट... रात दस बजे एक ट्रेन है, पर सिर्फ़ वेटिंग टिकट है।",
        "gloss": {
          "en": "One minute... there's a train at ten tonight, but only waiting-list tickets.",
          "ko": "잠시만요... 밤 열 시 열차가 있는데 대기표만 있어요."
        },
        "alt": [
          {
            "text": "रुकिए, देखता हूँ... आज रात दस बजे वाली में वेटिंग चल रही है।",
            "gloss": {
              "en": "Hold on, let me look... the ten o'clock tonight is on the waiting list.",
              "ko": "잠깐만요, 볼게요... 오늘 밤 열 시 열차는 대기 중이에요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "अगर टिकट कन्फ़र्म नहीं हुआ, तो क्या होगा?",
        "gloss": {
          "en": "If the ticket isn't confirmed, what happens?",
          "ko": "표가 확정 안 되면 어떻게 돼요?"
        },
        "frames": [
          "hi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "तो पैसे अपने-आप वापस आ जाएँगे। चिंता मत कीजिए।",
        "gloss": {
          "en": "Then the money will come back automatically. Don't worry.",
          "ko": "그러면 돈은 자동으로 돌아와요. 걱정 마세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, वही दे दीजिए। उम्मीद है कि सीट मिल जाएगी।",
        "gloss": {
          "en": "Okay, give me that one. I hope I'll get a seat.",
          "ko": "좋아요, 그걸로 주세요. 자리가 나면 좋겠네요."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Over chai with your friend Ananya, talking about yesterday's Bollywood film",
      "ko": "친구 아나냐와 차 마시며 어제 본 발리우드 영화 이야기하기"
    },
    "expressions": [
      "सच में",
      "मुझे तो पसंद आई",
      "मैं सहमत नहीं हूँ",
      "मेरे ख़याल से",
      "वैसे",
      "चिंता मत करो",
      "मैं देख लूँगा",
      "चलता है"
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
        "text": "तो? कल की फ़िल्म कैसी लगी?",
        "gloss": {
          "en": "So? How did you like yesterday's film?",
          "ko": "그래서? 어제 영화 어땠어?"
        },
        "alt": [
          {
            "text": "तुमने कल वह नई फ़िल्म देखी ना? कैसी थी?",
            "gloss": {
              "en": "You saw that new film yesterday, right? How was it?",
              "ko": "어제 그 새 영화 봤지? 어땠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "सच में, बहुत अच्छी थी! मुझे तो पसंद आई।",
        "gloss": {
          "en": "Honestly, it was really good! I liked it, anyway.",
          "ko": "진짜 좋았어! 난 마음에 들었어."
        }
      },
      {
        "who": "them",
        "text": "अरे यार, मुझे लगता है कि कहानी बहुत लंबी थी।",
        "gloss": {
          "en": "Oh man, I think the story was way too long.",
          "ko": "아이고, 난 이야기가 너무 길었던 것 같아."
        }
      },
      {
        "who": "me",
        "text": "हाँ, थोड़ी लंबी थी, लेकिन गाने बहुत अच्छे थे। मैंने आज सुबह फिर से सुने।",
        "gloss": {
          "en": "Yeah, a bit long, but the songs were great. I listened to them again this morning.",
          "ko": "응, 좀 길긴 했어. 근데 노래가 정말 좋았어. 오늘 아침에 또 들었어."
        },
        "frames": [
          "hi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "गाने तो ठीक थे। पर हीरो की एक्टिंग? बिलकुल बेकार!",
        "gloss": {
          "en": "The songs were fine. But the hero's acting? Totally useless!",
          "ko": "노래는 괜찮았지. 근데 주인공 연기는? 완전 별로!"
        },
        "alt": [
          {
            "text": "गाने चलो ठीक हैं, पर हीरो ने तो पूरी फ़िल्म में ओवरएक्टिंग की!",
            "gloss": {
              "en": "Fine, the songs were okay, but the hero overacted the whole film!",
              "ko": "노래는 그렇다 쳐도, 주인공은 영화 내내 과하게 연기했잖아!"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "मैं सहमत नहीं हूँ। मेरे ख़याल से उसकी एक्टिंग अच्छी थी।",
        "gloss": {
          "en": "I don't agree. In my view his acting was good.",
          "ko": "난 동의 못 해. 내 생각엔 연기 잘했어."
        },
        "frames": [
          "hi-f3-16",
          "hi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा? और आख़िरी सीन? मैं तो रो रही थी!",
        "gloss": {
          "en": "Really? And the last scene? I was crying!",
          "ko": "그래? 그럼 마지막 장면은? 난 울고 있었어!"
        }
      },
      {
        "who": "me",
        "text": "मैं भी! वैसे, जब वह सीन चल रहा था, मेरा दोस्त हँस रहा था।",
        "gloss": {
          "en": "Me too! By the way, while that scene was on, my friend was laughing.",
          "ko": "나도! 근데 그 장면 나올 때 내 친구는 웃고 있었어."
        },
        "frames": [
          "hi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "हाहा! वैसे, अगले हफ़्ते इसका दूसरा पार्ट आ रहा है।",
        "gloss": {
          "en": "Haha! By the way, part two is coming out next week.",
          "ko": "하하! 그나저나 다음 주에 속편 나온대."
        },
        "alt": [
          {
            "text": "सुना है अगले महीने इसका सीक्वल आ रहा है।",
            "gloss": {
              "en": "I heard the sequel is coming out next month.",
              "ko": "다음 달에 속편 나온다더라."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "अच्छा? अगर टिकट मिल गए, तो हम पहले दिन देख सकते हैं।",
        "gloss": {
          "en": "Really? If we get tickets, we can watch it on day one.",
          "ko": "그래? 표 구하면 개봉 첫날 볼 수 있겠다."
        },
        "frames": [
          "hi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "पहले दिन? सब शो फ़ुल होंगे! और इस बार पॉपकॉर्न तुम लाओगे।",
        "gloss": {
          "en": "Day one? All the shows will be full! And this time you're bringing the popcorn.",
          "ko": "첫날? 다 매진일걸! 그리고 이번엔 네가 팝콘 사 와."
        }
      },
      {
        "who": "me",
        "text": "चिंता मत करो, टिकट मैं देख लूँगा। और पॉपकॉर्न? चलता है!",
        "gloss": {
          "en": "Don't worry, I'll sort out the tickets. And popcorn? Fine by me!",
          "ko": "걱정 마, 표는 내가 알아볼게. 팝콘? 그 정도야 뭐!"
        },
        "frames": [
          "hi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "hi-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Phoning your landlord, Mr Sharma, because the bedroom fan stopped working",
      "ko": "침실 선풍기가 멈춰서 집주인 샤르마 씨에게 전화하기"
    },
    "expressions": [
      "ख़राब हो गया",
      "मैं देख लूँगा",
      "मुझे लगता है"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "हैलो, शर्मा बोल रहा हूँ।",
        "gloss": {
          "en": "Hello, Sharma speaking.",
          "ko": "여보세요, 샤르마입니다."
        }
      },
      {
        "who": "me",
        "text": "नमस्ते शर्मा जी, मैं फ़्लैट दो सौ तीन से बोल रहा हूँ।",
        "gloss": {
          "en": "Hello Mr Sharma, I'm calling from flat two hundred three.",
          "ko": "안녕하세요, 샤르마 씨. 이백삼 호인데요."
        }
      },
      {
        "who": "them",
        "text": "हाँ जी, क्या हुआ? कोई दिक़्क़त है?",
        "gloss": {
          "en": "Yes, what happened? Is there a problem?",
          "ko": "네, 무슨 일이에요? 문제 있어요?"
        }
      },
      {
        "who": "me",
        "text": "जी, बेडरूम का पंखा ख़राब हो गया है। कल रात से नहीं चल रहा।",
        "gloss": {
          "en": "Yes, the bedroom fan has broken down. It hasn't worked since last night.",
          "ko": "네, 침실 선풍기가 고장 났어요. 어젯밤부터 안 돌아가요."
        },
        "frames": [
          "hi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा? कल तक तो ठीक था। आपने स्विच चेक किया?",
        "gloss": {
          "en": "Really? It was fine until yesterday. Did you check the switch?",
          "ko": "그래요? 어제까진 멀쩡했는데. 스위치는 확인해 봤어요?"
        },
        "alt": [
          {
            "text": "अरे! आपने रेगुलेटर देखा? कभी-कभी वही ढीला होता है।",
            "gloss": {
              "en": "Oh! Did you look at the regulator? Sometimes that's what's loose.",
              "ko": "아이고! 조절기는 봤어요? 가끔 그게 헐거워져요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "हाँ, मैंने सब चेक कर लिया। जब मैं सो रहा था, अचानक बंद हो गया।",
        "gloss": {
          "en": "Yes, I've checked everything. It suddenly stopped while I was sleeping.",
          "ko": "네, 다 확인해 봤어요. 자고 있는데 갑자기 멈췄어요."
        },
        "frames": [
          "hi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, मैं कल किसी को भेज दूँगा।",
        "gloss": {
          "en": "Alright, I'll send someone tomorrow.",
          "ko": "알겠어요, 내일 사람을 보낼게요."
        },
        "alt": [
          {
            "text": "इलेक्ट्रीशियन परसों ही आ पाएगा, कल वह छुट्टी पर है।",
            "gloss": {
              "en": "The electrician can only come the day after tomorrow; he's off tomorrow.",
              "ko": "전기 기사는 모레나 올 수 있어요. 내일은 쉬는 날이라서요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "इतनी गर्मी में रात बहुत मुश्किल है। क्या कोई आज शाम को आ सकता है?",
        "gloss": {
          "en": "Nights are really hard in this heat. Could someone come this evening?",
          "ko": "이 더위에 밤이 너무 힘들어요. 오늘 저녁에 누가 와 줄 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "आज तो मुश्किल है... ठीक है, मैं कोशिश करता हूँ।",
        "gloss": {
          "en": "Today's difficult... okay, I'll try.",
          "ko": "오늘은 어려운데... 알았어요, 한번 해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "अगर आज कोई नहीं आ सकता, तो मैं ख़ुद इलेक्ट्रीशियन बुला लूँ?",
        "gloss": {
          "en": "If nobody can come today, shall I call an electrician myself?",
          "ko": "오늘 아무도 못 오면 제가 직접 전기 기사를 부를까요?"
        },
        "frames": [
          "hi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, बुला लीजिए। बिल मुझे भेज देना, मैं पैसे दे दूँगा।",
        "gloss": {
          "en": "Yes, go ahead and call one. Send me the bill, I'll pay.",
          "ko": "네, 부르세요. 청구서 보내 주면 제가 낼게요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, मैं देख लूँगा। मुझे लगता है कि यह जल्दी ठीक हो जाएगा। धन्यवाद!",
        "gloss": {
          "en": "Okay, I'll take care of it. I think it'll be fixed quickly. Thank you!",
          "ko": "알겠어요, 제가 알아볼게요. 금방 고쳐질 것 같아요. 감사합니다!"
        },
        "frames": [
          "hi-f3-12",
          "hi-f3-01"
        ]
      }
    ]
  },
  {
    "id": "hi-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "At the office coffee machine, discussing a news story with your coworker",
      "ko": "회사 커피머신 앞에서 동료와 뉴스 이야기하기"
    },
    "expressions": [
      "मुझे लगता है",
      "आप सही कह रहे हैं",
      "हो सकता है",
      "सच में",
      "क्या हुआ",
      "कोई दिक़्क़त है",
      "देर हो गई"
    ],
    "grammar": [
      0,
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "आपने आज की ख़बर देखी? शहर में पानी का बिल दोगुना हो रहा है।",
        "gloss": {
          "en": "Did you see today's news? Water bills in the city are doubling.",
          "ko": "오늘 뉴스 봤어요? 시내 수도 요금이 두 배로 오른대요."
        },
        "alt": [
          {
            "text": "सुना आपने? अगले महीने से पानी का बिल डबल हो जाएगा।",
            "gloss": {
              "en": "Did you hear? From next month the water bill will double.",
              "ko": "들었어요? 다음 달부터 수도 요금이 두 배래요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "हाँ, मैंने सुबह पढ़ी। मुझे लगता है कि यह ठीक नहीं है।",
        "gloss": {
          "en": "Yes, I read it this morning. I think it's not fair.",
          "ko": "네, 아침에 읽었어요. 이건 옳지 않은 것 같아요."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "पर सरकार कह रही है कि पानी बचाना ज़रूरी है।",
        "gloss": {
          "en": "But the government says saving water is necessary.",
          "ko": "그래도 정부는 물을 아껴야 한다고 하잖아요."
        }
      },
      {
        "who": "me",
        "text": "आप सही कह रहे हैं, पर अचानक इतना ज़्यादा?",
        "gloss": {
          "en": "You're right, but this much, all of a sudden?",
          "ko": "맞는 말씀이에요. 그래도 갑자기 이렇게 많이요?"
        },
        "frames": [
          "hi-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "हो सकता है कि यह सिर्फ़ बड़े घरों के लिए हो।",
        "gloss": {
          "en": "Maybe it's only for big houses.",
          "ko": "큰 집에만 해당될지도 몰라요."
        },
        "alt": [
          {
            "text": "शायद यह नियम सिर्फ़ ज़्यादा पानी इस्तेमाल करने वालों के लिए है।",
            "gloss": {
              "en": "Maybe this rule is only for people who use a lot of water.",
              "ko": "아마 물을 많이 쓰는 사람들한테만 적용되는 규칙일 거예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "हो सकता है। फिर भी, सरकार को लोगों को पहले बताना चाहिए।",
        "gloss": {
          "en": "Could be. Still, the government should tell people beforehand.",
          "ko": "그럴 수도 있죠. 그래도 정부가 미리 알려 줘야죠."
        },
        "frames": [
          "hi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "वैसे, मेरे इलाक़े में तो पूरे हफ़्ते पानी नहीं आ रहा था।",
        "gloss": {
          "en": "Actually, in my area there was no water for the whole week.",
          "ko": "그런데 우리 동네는 일주일 내내 물이 안 나왔어요."
        }
      },
      {
        "who": "me",
        "text": "सच में? क्या हुआ? पाइप में कोई दिक़्क़त है?",
        "gloss": {
          "en": "Really? What happened? Is there a problem with the pipes?",
          "ko": "정말요? 무슨 일이에요? 수도관에 문제 있어요?"
        }
      },
      {
        "who": "them",
        "text": "पाइपलाइन फट गई थी। लोग सुबह-सुबह टैंकर के पीछे भाग रहे थे।",
        "gloss": {
          "en": "The pipeline had burst. People were running after the water tanker first thing in the morning.",
          "ko": "수도관이 터졌었어요. 사람들이 새벽부터 급수차 뒤를 쫓아다녔어요."
        }
      },
      {
        "who": "me",
        "text": "अगर ऐसा फिर हुआ, तो हमें शिकायत करनी चाहिए।",
        "gloss": {
          "en": "If that happens again, we should complain.",
          "ko": "또 그러면 우리가 민원을 넣어야 해요."
        },
        "frames": [
          "hi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "बिलकुल। अरे, ग्यारह बज गए! मीटिंग शुरू हो गई होगी।",
        "gloss": {
          "en": "Absolutely. Oh, it's eleven! The meeting must have started.",
          "ko": "그럼요. 어머, 열한 시예요! 회의 시작했겠네요."
        }
      },
      {
        "who": "me",
        "text": "अरे, देर हो गई! चलिए, लंच पर बाक़ी बात करेंगे।",
        "gloss": {
          "en": "Oh, we're late! Let's go, we'll talk about the rest at lunch.",
          "ko": "아, 늦었네요! 가요, 나머지는 점심때 얘기해요."
        }
      }
    ]
  },
  {
    "id": "hi-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Project team meeting with your manager Neha about an app launch deadline",
      "ko": "앱 출시 마감을 두고 매니저 네하와 팀 회의"
    },
    "expressions": [
      "समय सीमा",
      "सबसे बड़ी समस्या",
      "बिलकुल नहीं",
      "मेरा सुझाव है",
      "एक तरफ़",
      "दूसरी तरफ़",
      "आपकी बात सही है, लेकिन",
      "मान लीजिए"
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
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "तो, क्लाइंट चाहता है कि ऐप अगले शुक्रवार तक लॉन्च हो जाए। क्या यह मुमकिन है?",
        "gloss": {
          "en": "So, the client wants the app launched by next Friday. Is that possible?",
          "ko": "자, 고객사가 다음 주 금요일까지 앱 출시를 원해요. 가능할까요?"
        },
        "alt": [
          {
            "text": "क्लाइंट की तरफ़ से साफ़ कहा गया है कि लॉन्च अगले शुक्रवार को ही होगा। हम तैयार हैं?",
            "gloss": {
              "en": "The client has said clearly that the launch will be next Friday, no later. Are we ready?",
              "ko": "고객사에서 출시는 무조건 다음 주 금요일이라고 못 박았어요. 준비됐나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "सच कहूँ तो, यह समय सीमा बहुत कम है। सबसे बड़ी समस्या टेस्टिंग की है।",
        "gloss": {
          "en": "Honestly, this deadline is very tight. The biggest problem is testing.",
          "ko": "솔직히 이 마감은 너무 빠듯해요. 가장 큰 문제는 테스트예요."
        }
      },
      {
        "who": "them",
        "text": "टेस्टिंग में कितना समय लगेगा?",
        "gloss": {
          "en": "How long will testing take?",
          "ko": "테스트에 얼마나 걸릴까요?"
        }
      },
      {
        "who": "me",
        "text": "जो बग पिछले हफ़्ते मिले थे, वे अभी तक ठीक नहीं हुए हैं। उन्हें ठीक करके ही टेस्टिंग हो सकती है।",
        "gloss": {
          "en": "The bugs we found last week still haven't been fixed. Testing can only happen after fixing them.",
          "ko": "지난주에 나온 버그들이 아직 안 고쳐졌어요. 그걸 고친 다음에야 테스트할 수 있어요."
        }
      },
      {
        "who": "them",
        "text": "मतलब हम डेडलाइन मिस कर देंगे?",
        "gloss": {
          "en": "So we're going to miss the deadline?",
          "ko": "그러니까 마감을 놓친다는 거예요?"
        },
        "alt": [
          {
            "text": "तो क्या हमें क्लाइंट को अभी बता देना चाहिए?",
            "gloss": {
              "en": "So should we tell the client right now?",
              "ko": "그럼 지금 고객사에 알려야 할까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "बिलकुल नहीं! मेरा सुझाव है कि हम पहले ज़रूरी फ़ीचर लॉन्च करें, बाक़ी बाद में।",
        "gloss": {
          "en": "Not at all! I suggest we launch the essential features first and the rest later.",
          "ko": "전혀요! 필수 기능을 먼저 출시하고 나머지는 나중에 하자는 게 제 제안이에요."
        }
      },
      {
        "who": "them",
        "text": "यह बीच का रास्ता हो सकता है। पर क्लाइंट मानेगा?",
        "gloss": {
          "en": "That could be a middle way. But will the client agree?",
          "ko": "그게 절충안이 될 수 있겠네요. 그런데 고객사가 받아들일까요?"
        }
      },
      {
        "who": "me",
        "text": "एक तरफ़ उन्हें समय पर ऐप मिलेगा, दूसरी तरफ़ क्वालिटी भी बनी रहेगी।",
        "gloss": {
          "en": "On one hand they get the app on time; on the other, the quality stays intact.",
          "ko": "한편으로는 제때 앱을 받고, 다른 한편으로는 품질도 지킬 수 있어요."
        }
      },
      {
        "who": "them",
        "text": "हम्म। विकास कहाँ है? उसे भी यह सुनना चाहिए।",
        "gloss": {
          "en": "Hmm. Where's Vikas? He should hear this too.",
          "ko": "음. 비카스는 어디 있어요? 그 사람도 들어야 하는데."
        }
      },
      {
        "who": "me",
        "text": "वह अभी क्लाइंट कॉल पर होगा। मैं उसे मीटिंग के बाद सब बता दूँगा।",
        "gloss": {
          "en": "He must be on the client call right now. I'll tell him everything after the meeting.",
          "ko": "지금 고객사 통화 중일 거예요. 회의 끝나고 제가 다 전할게요."
        }
      },
      {
        "who": "them",
        "text": "ठीक है। पर अगर हम पिछले महीने ही शुरू करते, तो यह दिक़्क़त नहीं होती।",
        "gloss": {
          "en": "Okay. But if we'd started last month, we wouldn't have this problem.",
          "ko": "알겠어요. 그런데 지난달에 시작했으면 이런 문제는 없었을 텐데요."
        },
        "alt": [
          {
            "text": "काश हमने यह प्लान पहले बनाया होता!",
            "gloss": {
              "en": "If only we'd made this plan earlier!",
              "ko": "이 계획을 더 일찍 세웠더라면 좋았을걸요!"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "आपकी बात सही है, लेकिन तब डिज़ाइन तैयार नहीं था। अगर डिज़ाइन पहले मिलता, तो हम ज़रूर शुरू करते।",
        "gloss": {
          "en": "You're right, but the design wasn't ready then. If we'd got the design earlier, we certainly would have started.",
          "ko": "맞는 말씀이지만, 그때는 디자인이 준비 안 됐었어요. 디자인을 일찍 받았으면 당연히 시작했죠."
        }
      },
      {
        "who": "them",
        "text": "ठीक है, यह प्लान क्लाइंट को कब भेजा जाएगा?",
        "gloss": {
          "en": "Alright, when will this plan be sent to the client?",
          "ko": "좋아요, 이 계획은 언제 고객사에 보내지나요?"
        }
      },
      {
        "who": "me",
        "text": "आज शाम तक भेज दिया जाएगा। मान लीजिए वे न मानें, तो हम कल उनसे बात करेंगे।",
        "gloss": {
          "en": "It'll be sent by this evening. Suppose they don't agree, then we'll talk to them tomorrow.",
          "ko": "오늘 저녁까지 보내질 거예요. 만약 받아들이지 않으면 내일 이야기해 보죠."
        }
      }
    ]
  },
  {
    "id": "hi-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Job interview for a marketing role at a company in Gurgaon",
      "ko": "구르가온의 회사 마케팅 직무 면접"
    },
    "expressions": [
      "इसमें कोई शक नहीं",
      "आख़िरकार",
      "जहाँ तक मैं समझता हूँ",
      "आप कहना चाह रहे हैं",
      "बात तो ठीक है"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते, बैठिए। अपने बारे में कुछ बताइए।",
        "gloss": {
          "en": "Hello, have a seat. Tell us a bit about yourself.",
          "ko": "안녕하세요, 앉으세요. 자기소개 좀 해 주세요."
        },
        "alt": [
          {
            "text": "आइए, बैठिए। पहले अपना थोड़ा परिचय दीजिए।",
            "gloss": {
              "en": "Come, sit down. First, introduce yourself a little.",
              "ko": "어서 앉으세요. 먼저 간단히 소개해 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "धन्यवाद। मैं पिछले चार साल से एक कोरियाई कंपनी में मार्केटिंग का काम कर रहा हूँ।",
        "gloss": {
          "en": "Thank you. For the last four years I've been working in marketing at a Korean company.",
          "ko": "감사합니다. 저는 지난 사 년 동안 한국 회사에서 마케팅 일을 해 왔습니다."
        }
      },
      {
        "who": "them",
        "text": "आप यह नौकरी क्यों बदलना चाहते हैं?",
        "gloss": {
          "en": "Why do you want to change jobs?",
          "ko": "왜 이직하려고 하세요?"
        }
      },
      {
        "who": "me",
        "text": "जो काम मैं अभी कर रहा हूँ, वह मुझे पसंद है, फिर भी मैं कुछ नया सीखना चाहता हूँ।",
        "gloss": {
          "en": "I like the work I'm doing now, but even so I want to learn something new.",
          "ko": "지금 하는 일도 좋아하지만, 그래도 새로운 걸 배우고 싶습니다."
        }
      },
      {
        "who": "them",
        "text": "हमारी टीम में दबाव काफ़ी रहता है। क्या आप दबाव में काम कर पाएँगे?",
        "gloss": {
          "en": "There's a lot of pressure on our team. Will you be able to work under pressure?",
          "ko": "저희 팀은 압박이 꽤 심해요. 압박 속에서 일할 수 있겠어요?"
        },
        "alt": [
          {
            "text": "यहाँ डेडलाइन अक्सर बहुत टाइट होती हैं। आप ऐसे माहौल में कैसे काम करते हैं?",
            "gloss": {
              "en": "Deadlines here are often very tight. How do you work in that kind of environment?",
              "ko": "여기는 마감이 자주 빠듯해요. 그런 환경에서는 어떻게 일하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "इसमें कोई शक नहीं कि काम ज़्यादा होगा। पर पिछले साल मैंने तीन बड़े प्रोजेक्ट एक साथ सँभाले, और आख़िरकार सब समय पर पूरे हुए।",
        "gloss": {
          "en": "There's no doubt the work here will be heavy. But last year I handled three big projects at once, and in the end they were all finished on time.",
          "ko": "여기 일이 많을 거라는 건 의심할 여지가 없죠. 하지만 작년에 큰 프로젝트 세 개를 동시에 맡았고, 결국 모두 제때 끝냈습니다."
        }
      },
      {
        "who": "them",
        "text": "अच्छा। आपकी सबसे बड़ी कमज़ोरी क्या है?",
        "gloss": {
          "en": "I see. What's your biggest weakness?",
          "ko": "그렇군요. 가장 큰 약점은 뭔가요?"
        }
      },
      {
        "who": "me",
        "text": "कभी-कभी मैं हर छोटी चीज़ ख़ुद चेक करता हूँ। अब मैं टीम पर भरोसा करके काम बाँटना सीख रहा हूँ।",
        "gloss": {
          "en": "Sometimes I check every little thing myself. Now I'm learning to trust the team and delegate.",
          "ko": "가끔 사소한 것까지 제가 다 확인해요. 요즘은 팀을 믿고 일을 나누는 법을 배우고 있습니다."
        }
      },
      {
        "who": "them",
        "text": "आपकी सैलरी की उम्मीद क्या है?",
        "gloss": {
          "en": "What are your salary expectations?",
          "ko": "희망 연봉이 어떻게 되세요?"
        },
        "alt": [
          {
            "text": "सैलरी के बारे में आप क्या सोच रहे हैं?",
            "gloss": {
              "en": "What are you thinking in terms of salary?",
              "ko": "연봉은 어느 정도 생각하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "जहाँ तक मैं समझता हूँ, इस पद की रेंज अठारह से बाईस लाख है। मैं बीस के आसपास सोच रहा हूँ।",
        "gloss": {
          "en": "As far as I understand, the range for this role is eighteen to twenty-two lakh. I'm thinking around twenty.",
          "ko": "제가 알기로는 이 자리 연봉이 천팔백만에서 이천이백만 루피 정도예요. 저는 이천만 정도 생각하고 있습니다."
        }
      },
      {
        "who": "them",
        "text": "हम्म, यह हमारे बजट से थोड़ा ज़्यादा है।",
        "gloss": {
          "en": "Hmm, that's a bit above our budget.",
          "ko": "음, 저희 예산보다 조금 높네요."
        }
      },
      {
        "who": "me",
        "text": "आप कहना चाह रहे हैं कि बजट कम है? बात तो ठीक है। अच्छे बोनस के साथ मैं थोड़ा कम पर भी तैयार हूँ।",
        "gloss": {
          "en": "You mean the budget is tight? That's fair. With a good bonus I'm open to a little less.",
          "ko": "예산이 부족하다는 말씀이시죠? 그건 이해합니다. 보너스가 좋다면 조금 낮아도 괜찮습니다."
        }
      },
      {
        "who": "them",
        "text": "ठीक है। फ़ैसला अगले हफ़्ते तक लिया जाएगा। कोई सवाल?",
        "gloss": {
          "en": "Alright. A decision will be made by next week. Any questions?",
          "ko": "좋아요. 결정은 다음 주까지 내려질 거예요. 질문 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "जी, बस एक सवाल। जो टीम मुझे मिलेगी, उसमें कितने लोग होंगे?",
        "gloss": {
          "en": "Yes, just one question. How many people will be on the team I'd get?",
          "ko": "네, 하나만요. 제가 맡게 될 팀에는 몇 명이 있나요?"
        }
      }
    ]
  },
  {
    "id": "hi-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Negotiating a rent increase with your landlord in his living room",
      "ko": "집주인 거실에서 집세 인상 협상하기"
    },
    "expressions": [
      "इसका मतलब यह है",
      "मुद्दे की बात",
      "बीच का रास्ता"
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
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "देखिए, अगले महीने से किराया दो हज़ार बढ़ जाएगा। आजकल सब जगह यही रेट है।",
        "gloss": {
          "en": "Look, from next month the rent will go up by two thousand. That's the rate everywhere these days.",
          "ko": "보세요, 다음 달부터 집세가 이천 루피 올라요. 요즘 어디나 이 시세예요."
        },
        "alt": [
          {
            "text": "मैं अगले महीने से किराया दो हज़ार बढ़ा रहा हूँ, यह पहले ही बता दूँ।",
            "gloss": {
              "en": "I'm raising the rent by two thousand from next month, let me tell you in advance.",
              "ko": "미리 말씀드리는데, 다음 달부터 집세를 이천 올릴 거예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "दो हज़ार एक साथ? इसका मतलब यह है कि मुझे साल में चौबीस हज़ार ज़्यादा देने होंगे।",
        "gloss": {
          "en": "Two thousand in one go? That means I'll have to pay twenty-four thousand more a year.",
          "ko": "한 번에 이천이요? 그러면 일 년에 이만사천을 더 내야 한다는 뜻이잖아요."
        }
      },
      {
        "who": "them",
        "text": "पर पास में मेट्रो खुल गई है, इलाक़े की क़ीमत बढ़ गई है।",
        "gloss": {
          "en": "But the metro has opened nearby; the area's value has gone up.",
          "ko": "그래도 근처에 지하철이 생겨서 동네 가치가 올랐어요."
        }
      },
      {
        "who": "me",
        "text": "मुद्दे की बात यह है कि मैं तीन साल से यहाँ हूँ और हमेशा समय पर किराया दिया है।",
        "gloss": {
          "en": "The point is, I've been here three years and always paid the rent on time.",
          "ko": "중요한 건, 제가 여기 삼 년 살면서 집세를 늘 제때 냈다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "वह तो ठीक है, फिर भी मुझे भी अपने ख़र्चे देखने हैं।",
        "gloss": {
          "en": "That's true, but still, I have my own expenses to think of.",
          "ko": "그건 맞지만, 저도 제 지출을 생각해야죠."
        },
        "alt": [
          {
            "text": "यह मैं मानता हूँ, आप अच्छे किरायेदार हैं। पर मेरा भी नुक़सान हो रहा है।",
            "gloss": {
              "en": "I admit it, you're a good tenant. But I'm losing out too.",
              "ko": "좋은 세입자인 건 인정해요. 그래도 저도 손해를 보고 있어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "अगर आपने पहले बताया होता, तो मैं बजट बना लेता। क्या हम कोई बीच का रास्ता निकाल सकते हैं?",
        "gloss": {
          "en": "If you'd told me earlier, I'd have planned my budget. Can we find some middle ground?",
          "ko": "미리 말씀해 주셨으면 예산을 짰을 텐데요. 절충안을 찾을 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "जैसे क्या?",
        "gloss": {
          "en": "Like what?",
          "ko": "예를 들면요?"
        }
      },
      {
        "who": "me",
        "text": "मेरी गुज़ारिश है कि हम अभी एक हज़ार बढ़ाएँ और बाक़ी अगले साल देखें।",
        "gloss": {
          "en": "My request is that we raise it by one thousand now and look at the rest next year.",
          "ko": "지금은 천만 올리고 나머지는 내년에 보자고 부탁드리고 싶어요."
        }
      },
      {
        "who": "them",
        "text": "हम्म... एक हज़ार से मेरा क्या होगा?",
        "gloss": {
          "en": "Hmm... what good is one thousand to me?",
          "ko": "음... 천으로 저한테 뭐가 되겠어요?"
        }
      },
      {
        "who": "me",
        "text": "नया किरायेदार ढूँढ़ने में आपका एक-दो महीने का किराया तो जाएगा, जबकि मैं यहाँ लंबे समय तक रहना चाहता हूँ।",
        "gloss": {
          "en": "Finding a new tenant will cost you a month or two of rent, whereas I want to stay here for a long time.",
          "ko": "새 세입자를 구하려면 한두 달 치 집세는 날리실 거예요. 반면 저는 여기 오래 살고 싶어요."
        }
      },
      {
        "who": "them",
        "text": "ठीक है, मुझे इस पर सोचना पड़ेगा। पत्नी से पूछकर बताता हूँ।",
        "gloss": {
          "en": "Okay, I'll have to think about it. I'll ask my wife and let you know.",
          "ko": "알겠어요, 생각해 봐야겠네요. 아내한테 물어보고 알려 줄게요."
        }
      },
      {
        "who": "me",
        "text": "ज़रूर। और बालकनी का जो नल पिछले महीने टूट गया था, वह कब ठीक कराया जाएगा?",
        "gloss": {
          "en": "Sure. And the balcony tap that broke last month, when will it be repaired?",
          "ko": "물론이죠. 그리고 지난달에 고장 난 발코니 수도꼭지는 언제 고쳐지나요?"
        }
      },
      {
        "who": "them",
        "text": "वह इसी हफ़्ते ठीक करवा दूँगा, पक्का।",
        "gloss": {
          "en": "I'll get it fixed this very week, promise.",
          "ko": "그건 이번 주 안에 꼭 고쳐 줄게요."
        },
        "alt": [
          {
            "text": "प्लंबर को बोल दिया है, वह शनिवार को आएगा।",
            "gloss": {
              "en": "I've told the plumber; he'll come on Saturday.",
              "ko": "배관공한테 말해 놨어요, 토요일에 올 거예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "ठीक है। सोचकर बताइए, मैं इंतज़ार करूँगा। उम्मीद है हम मिलकर कोई हल निकाल लेंगे।",
        "gloss": {
          "en": "Alright. Think it over and let me know, I'll wait. I hope we can work out a solution together.",
          "ko": "좋아요. 생각해 보시고 알려 주세요, 기다릴게요. 같이 해결책을 찾을 수 있으면 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "hi-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Debating Delhi's traffic jams and air pollution with friends over dinner",
      "ko": "저녁 먹으며 친구들과 델리 교통 체증·대기 오염 토론하기"
    },
    "expressions": [
      "काश",
      "फ़ायदा और नुक़सान",
      "मेरा सुझाव है",
      "थोड़ा और समय",
      "इस पर सोचना पड़ेगा"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "यार, आज फिर दो घंटे जाम में फँसा रहा। यह शहर अब रहने लायक़ नहीं रहा।",
        "gloss": {
          "en": "Man, I was stuck in traffic for two hours again today. This city isn't livable anymore.",
          "ko": "야, 오늘 또 두 시간이나 차에 갇혀 있었어. 이 도시는 이제 살 데가 못 돼."
        },
        "alt": [
          {
            "text": "आज ऑफ़िस पहुँचने में दो घंटे लगे, ऊपर से इतना धुआँ!",
            "gloss": {
              "en": "It took two hours to reach the office today, and on top of that, all this smog!",
              "ko": "오늘 회사 가는 데 두 시간 걸렸어. 게다가 매연까지!"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "काश सरकार ने दस साल पहले ज़्यादा मेट्रो लाइनें बनाई होतीं! तब सड़क पर इतनी गाड़ियाँ नहीं होतीं।",
        "gloss": {
          "en": "If only the government had built more metro lines ten years ago! Then there wouldn't be so many cars on the road.",
          "ko": "정부가 십 년 전에 지하철 노선을 더 만들었더라면! 그럼 도로에 차가 이렇게 많지 않을 텐데."
        }
      },
      {
        "who": "them",
        "text": "मेट्रो तो है, पर लोग फिर भी अपनी गाड़ी से जाते हैं। मेरे ख़याल से ऑड-ईवन नियम फिर से लाना चाहिए।",
        "gloss": {
          "en": "There is a metro, but people still go by car. I think the odd-even rule should come back.",
          "ko": "지하철은 있는데도 사람들이 차를 끌고 다녀. 내 생각엔 홀짝제를 다시 해야 돼."
        }
      },
      {
        "who": "me",
        "text": "हर नियम का फ़ायदा और नुक़सान होता है। पिछली बार प्रदूषण थोड़ा कम हुआ था, फिर भी लोग परेशान थे।",
        "gloss": {
          "en": "Every rule has its pros and cons. Last time pollution dropped a bit, but people were still fed up.",
          "ko": "모든 규칙엔 장단점이 있어. 지난번에 오염은 좀 줄었지만, 그래도 사람들이 힘들어했잖아."
        }
      },
      {
        "who": "them",
        "text": "तो फिर तुम्हारा क्या हल है?",
        "gloss": {
          "en": "So what's your solution then?",
          "ko": "그럼 네 해결책은 뭔데?"
        },
        "alt": [
          {
            "text": "तो तुम क्या कहते हो, क्या करना चाहिए?",
            "gloss": {
              "en": "So what do you say, what should be done?",
              "ko": "그럼 넌 어떻게 해야 한다고 생각해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "मेरा सुझाव है कि बसें बढ़ाई जाएँ और पार्किंग महँगी की जाए।",
        "gloss": {
          "en": "My suggestion is that more buses be added and parking be made expensive.",
          "ko": "버스를 늘리고 주차비를 비싸게 하자는 게 내 제안이야."
        }
      },
      {
        "who": "them",
        "text": "पार्किंग महँगी? लोग नाराज़ होंगे, भाई!",
        "gloss": {
          "en": "Expensive parking? People will be furious, bro!",
          "ko": "주차비를 올려? 사람들이 화낼걸, 형!"
        }
      },
      {
        "who": "me",
        "text": "नाराज़ तो होंगे, पर लंदन जैसे शहरों में यही करके ट्रैफ़िक कम हुआ।",
        "gloss": {
          "en": "Sure they'll be angry, but in cities like London traffic came down by doing exactly this.",
          "ko": "화야 내겠지. 그래도 런던 같은 도시는 바로 이렇게 해서 교통량이 줄었어."
        }
      },
      {
        "who": "them",
        "text": "हमारा शहर लंदन नहीं है। यहाँ बसें ही टाइम पर नहीं आतीं।",
        "gloss": {
          "en": "Our city isn't London. Here the buses don't even come on time.",
          "ko": "우리 도시는 런던이 아니야. 여긴 버스부터 제시간에 안 와."
        },
        "alt": [
          {
            "text": "लंदन की बात अलग है, यहाँ तो बस स्टॉप पर छत तक नहीं है।",
            "gloss": {
              "en": "London's a different story; here the bus stops don't even have a roof.",
              "ko": "런던은 얘기가 다르지. 여긴 정류장에 지붕도 없어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "इसीलिए तो कह रहा हूँ, पहले बसें सुधरें, फिर पार्किंग का नियम आए। इसमें थोड़ा और समय लगेगा।",
        "gloss": {
          "en": "That's exactly why I'm saying: fix the buses first, then bring in the parking rule. It'll take a bit more time.",
          "ko": "그러니까 하는 말이야. 먼저 버스를 고치고 그다음에 주차 규칙을 하자고. 시간이 좀 더 걸리겠지."
        }
      },
      {
        "who": "them",
        "text": "हम्म, बात में दम है। पर इतना पैसा कहाँ से आएगा?",
        "gloss": {
          "en": "Hmm, that makes sense. But where will all that money come from?",
          "ko": "음, 일리 있네. 근데 그 돈은 어디서 나와?"
        }
      },
      {
        "who": "me",
        "text": "यह सवाल सही है, इस पर सोचना पड़ेगा। शायद जो पैसा पार्किंग से आएगा, वही बसों पर लगाया जाए।",
        "gloss": {
          "en": "Fair question, we'd have to think about that. Maybe the money that comes from parking could be spent on buses.",
          "ko": "좋은 질문이야, 그건 생각해 봐야 해. 아마 주차비로 들어오는 돈을 버스에 쓰면 되지 않을까."
        }
      },
      {
        "who": "them",
        "text": "चलो, तुम मंत्री बन जाओ, फिर देखेंगे!",
        "gloss": {
          "en": "Okay, you become minister, then we'll see!",
          "ko": "그래, 네가 장관 해라, 그럼 보자!"
        }
      },
      {
        "who": "me",
        "text": "हाहा, अगर मैं मंत्री होता, तो सबसे पहले अपनी गाड़ी बेच देता!",
        "gloss": {
          "en": "Haha, if I were minister, the first thing I'd do is sell my own car!",
          "ko": "하하, 내가 장관이면 제일 먼저 내 차부터 팔 거야!"
        }
      }
    ]
  },
  {
    "id": "hi-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Your cousin Priya's wedding: an aunt, a teenage cousin and the groom's uncle all want a word",
      "ko": "사촌 누나 프리야의 결혼식: 고모, 십 대 사촌 동생, 신랑 외삼촌이 차례로 말을 건다"
    },
    "goal": {
      "en": "Congratulate the family, dodge the marriage question politely, and switch between respectful आप with elders and casual तू with a younger cousin",
      "ko": "가족에게 축하를 전하고, 결혼 질문은 예의 바르게 넘기며, 어른에겐 आप·어린 사촌에겐 तू로 말투를 바꾼다"
    },
    "expressions": [
      "बहुत-बहुत बधाई",
      "दिल से",
      "अरे यार",
      "मुँह में पानी आ गया",
      "आँखों का तारा",
      "बात बनाना",
      "ज़माना बदल गया है"
    ],
    "grammar": [
      0,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "अरे बेटा, आ गए! कितने दुबले हो गए हो, खाना-वाना खाते हो या नहीं?",
        "gloss": {
          "en": "Oh, you've come, dear! You've got so thin, do you eat anything at all?",
          "ko": "아이고, 왔구나! 왜 이렇게 말랐어, 밥은 제대로 먹고 다니니?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते बुआ जी! खाता हूँ, खाता हूँ। आप बैठिए ना, मैं आपके लिए पानी-वानी लाता हूँ।",
        "gloss": {
          "en": "Hello, Aunty! I do eat, I do. Please sit down, I'll get you some water or something.",
          "ko": "안녕하세요, 고모! 먹어요, 먹어요. 앉으세요, 제가 물이라도 갖다 드릴게요."
        }
      },
      {
        "who": "them",
        "text": "अरे रहने दो। पहले यह बताओ, शादी कब कर रहे हो?",
        "gloss": {
          "en": "Oh, leave it. First tell me, when are you getting married?",
          "ko": "됐어, 그건. 그보다 너는 언제 결혼하니?"
        }
      },
      {
        "who": "me",
        "text": "बुआ जी, अभी तो प्रिया दीदी की शादी का मज़ा लेने दीजिए! और दीदी को बहुत-बहुत बधाई, दिल से।",
        "gloss": {
          "en": "Aunty, let me enjoy Priya didi's wedding for now! And many, many congratulations to didi, from the heart.",
          "ko": "고모, 지금은 프리야 누나 결혼식 좀 즐기게 해 주세요! 그리고 누나한테 진심으로 정말 축하한다고 전해 주세요."
        }
      },
      {
        "who": "them",
        "text": "भैया, खाना देखा? गोलगप्पे, जलेबी, छोले-भटूरे... सब है!",
        "gloss": {
          "en": "Bhaiya, have you seen the food? Golgappe, jalebi, chhole-bhature... everything's there!",
          "ko": "형, 음식 봤어? 골갑빠, 잘레비, 촐레 바투레... 다 있어!"
        }
      },
      {
        "who": "me",
        "text": "अरे यार, मुँह में पानी आ गया! चल, पहले जलेबी-वलेबी खाते हैं।",
        "gloss": {
          "en": "Oh man, my mouth is watering! Come on, let's have some jalebi and stuff first.",
          "ko": "와, 군침 돈다! 가자, 먼저 잘레비부터 좀 먹자."
        }
      },
      {
        "who": "them",
        "text": "पर मम्मी ने कहा है कि फेरों से पहले कुछ नहीं खाना।",
        "gloss": {
          "en": "But Mum said we're not to eat anything before the pheras.",
          "ko": "근데 엄마가 혼례 의식 전엔 아무것도 먹지 말랬어."
        }
      },
      {
        "who": "me",
        "text": "अरे, तू तो चाची की आँखों का तारा है, तुझे कोई कुछ नहीं कहेगा!",
        "gloss": {
          "en": "Come on, you're Auntie's darling — nobody's going to say a thing to you!",
          "ko": "야, 넌 숙모 눈에 넣어도 안 아픈 애잖아. 아무도 뭐라 안 해!"
        }
      },
      {
        "who": "them",
        "text": "हाहा! वैसे, दूल्हे के दोस्त कब से नाच रहे हैं, थकते भी नहीं!",
        "gloss": {
          "en": "Haha! By the way, the groom's friends have been dancing forever — they don't even get tired!",
          "ko": "하하! 근데 신랑 친구들 아까부터 계속 춤추는데 지치지도 않나 봐!"
        }
      },
      {
        "who": "me",
        "text": "बारात आते ही ढोल बजता रहा, और ये लोग नाचते ही जा रहे हैं।",
        "gloss": {
          "en": "The drums haven't stopped since the baraat arrived, and these guys just keep on dancing.",
          "ko": "신랑 행렬이 도착하고부터 북이 계속 울리고, 저 사람들은 계속 춤만 추네."
        }
      },
      {
        "who": "them",
        "text": "बेटा, ज़रा इधर आओ। ये शर्मा जी हैं, दूल्हे के मामा।",
        "gloss": {
          "en": "Dear, come here a moment. This is Sharma ji, the groom's maternal uncle.",
          "ko": "얘, 이리 좀 와 봐. 이분은 샤르마 씨, 신랑 외삼촌이셔."
        }
      },
      {
        "who": "me",
        "text": "नमस्ते मामा जी! आपसे मिलकर बहुत ख़ुशी हुई।",
        "gloss": {
          "en": "Hello, uncle! I'm very happy to meet you.",
          "ko": "안녕하세요, 외삼촌! 뵙게 되어 정말 반갑습니다."
        }
      },
      {
        "who": "them",
        "text": "तो आप ही हैं वो कोरिया वाले! सुना है, हिंदी फ़र्राटेदार बोलते हैं।",
        "gloss": {
          "en": "So you're the one from Korea! I hear you speak Hindi fluently.",
          "ko": "아, 한국에서 왔다는 게 바로 당신이군요! 힌디어를 술술 한다던데요."
        }
      },
      {
        "who": "me",
        "text": "अरे नहीं मामा जी, बात बनाना तो कोई इन लोगों से सीखे! मैं तो अभी धीरे-धीरे सीख ही रहा हूँ।",
        "gloss": {
          "en": "Oh no, uncle — if anyone knows how to exaggerate, it's these folks! I'm still learning, slowly.",
          "ko": "아이고 아니에요, 외삼촌. 말 부풀리는 건 이분들한테 배워야 해요! 저는 아직 천천히 배우는 중이에요."
        }
      },
      {
        "who": "them",
        "text": "देखा? कितना विनम्र है! हमारे ज़माने में बच्चे ऐसे ही होते थे।",
        "gloss": {
          "en": "See? How humble he is! In our day, children were just like this.",
          "ko": "봤죠? 얼마나 겸손한지! 우리 때는 애들이 다 이랬는데."
        }
      },
      {
        "who": "me",
        "text": "बुआ जी, ज़माना बदल गया है, पर आपका आशीर्वाद तो हमेशा चाहिए। चलिए, फेरे शुरू होने वाले हैं!",
        "gloss": {
          "en": "Aunty, times have changed, but we'll always need your blessings. Come, the pheras are about to start!",
          "ko": "고모, 세상은 변했어도 고모 축복은 늘 필요하죠. 가요, 혼례 의식 시작하려나 봐요!"
        }
      }
    ]
  },
  {
    "id": "hi-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "After a client presentation, your senior colleague Anil asks for your honest feedback",
      "ko": "고객 발표가 끝난 뒤 선배 아닐이 솔직한 의견을 물을 때"
    },
    "goal": {
      "en": "Give honest criticism to a senior colleague without offending him, softening every point",
      "ko": "선배 기분을 상하지 않게, 하나하나 누그러뜨려 솔직한 비판을 전한다"
    },
    "expressions": [
      "बुरा मत मानिए",
      "गुस्ताख़ी माफ़",
      "नाक में दम",
      "दाल में कुछ काला है"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "तो, मेरी प्रेज़ेंटेशन कैसी लगी? साफ़-साफ़ बताओ।",
        "gloss": {
          "en": "So, how did you find my presentation? Tell me straight.",
          "ko": "그래서, 내 발표 어땠어? 솔직하게 말해 봐."
        }
      },
      {
        "who": "me",
        "text": "ज़्यादातर तो बहुत अच्छी थी। बस दो-एक बातें थीं, बुरा मत मानिएगा।",
        "gloss": {
          "en": "Most of it was really good. There were just one or two things — please don't take it the wrong way.",
          "ko": "대부분은 정말 좋았어요. 한두 가지만 있었는데, 언짢게 듣진 말아 주세요."
        }
      },
      {
        "who": "them",
        "text": "अरे, बेझिझक बोलो। फ़ीडबैक से ही तो सुधार होता है।",
        "gloss": {
          "en": "Oh, go ahead, don't hesitate. Feedback is how we improve.",
          "ko": "에이, 편하게 말해. 피드백이 있어야 나아지지."
        }
      },
      {
        "who": "me",
        "text": "शायद स्लाइड्स थोड़ी ज़्यादा भरी हुई थीं। क्लाइंट आँकड़े-वाँकड़े देखकर शायद थोड़ा उलझ गए।",
        "gloss": {
          "en": "Maybe the slides were a bit too crowded. The clients may have got a little lost in all the figures.",
          "ko": "슬라이드가 조금 빽빽했던 것 같아요. 고객분들이 숫자 같은 걸 보다가 좀 헷갈리신 것 같고요."
        }
      },
      {
        "who": "them",
        "text": "हम्म, पर सारा डेटा ज़रूरी था।",
        "gloss": {
          "en": "Hmm, but all the data was necessary.",
          "ko": "음, 그래도 데이터가 다 필요했는데."
        }
      },
      {
        "who": "me",
        "text": "बिलकुल, डेटा तो ज़रूरी है ही। मैं बस यह कह रहा था कि मुख्य बातें ऊपर रखी जाएँ।",
        "gloss": {
          "en": "Absolutely, the data is necessary for sure. I was only saying the key points should go at the top.",
          "ko": "그럼요, 데이터는 당연히 필요하죠. 저는 그냥 핵심을 위에 두자는 거였어요."
        }
      },
      {
        "who": "them",
        "text": "और कुछ?",
        "gloss": {
          "en": "Anything else?",
          "ko": "또 있어?"
        }
      },
      {
        "who": "me",
        "text": "गुस्ताख़ी माफ़, पर जब क्लाइंट ने बजट पूछा, आप थोड़ा ग़ुस्से में बोल बैठे।",
        "gloss": {
          "en": "Pardon my boldness, but when the client asked about the budget, you ended up snapping a little.",
          "ko": "외람되지만, 고객이 예산을 물었을 때 선배님이 좀 언성을 높이셨어요."
        }
      },
      {
        "who": "them",
        "text": "हाँ... वह एक ही सवाल बार-बार पूछ रहा था, मेरी नाक में दम कर दिया था।",
        "gloss": {
          "en": "Yeah... he kept asking the same question again and again; he was driving me up the wall.",
          "ko": "응... 같은 질문을 계속 해서 정말 진이 빠졌거든."
        }
      },
      {
        "who": "me",
        "text": "समझ सकता हूँ, वह सच में नाक में दम कर देता है। फिर भी अगली बार ज़रा मुस्कुराकर टाल दीजिएगा।",
        "gloss": {
          "en": "I get it, he really does drive you up the wall. Still, next time maybe just smile and let it pass.",
          "ko": "이해해요, 그분 정말 사람 진 빠지게 하죠. 그래도 다음엔 그냥 웃으면서 넘겨 주세요."
        }
      },
      {
        "who": "them",
        "text": "हाहा, ठीक है। वैसे बजट वाली बात मुझे अजीब लगी।",
        "gloss": {
          "en": "Haha, fine. Actually, that budget business felt odd to me.",
          "ko": "하하, 알았어. 그런데 그 예산 얘기는 좀 이상하던데."
        }
      },
      {
        "who": "me",
        "text": "मुझे भी लगा कि दाल में कुछ काला है। मैं चुपचाप उनकी टीम से पता करता रहूँगा।",
        "gloss": {
          "en": "I also felt something was fishy. I'll quietly keep checking with their team.",
          "ko": "저도 뭔가 수상하다고 느꼈어요. 제가 조용히 그쪽 팀한테 계속 알아볼게요."
        }
      },
      {
        "who": "them",
        "text": "अच्छा। वैसे, तुम बड़ी सफ़ाई से बात करते हो। कहाँ से सीखा यह सब?",
        "gloss": {
          "en": "Good. By the way, you put things very tactfully. Where did you learn all this?",
          "ko": "좋아. 그런데 너 말 참 깔끔하게 한다. 이런 건 어디서 배웠어?"
        }
      },
      {
        "who": "me",
        "text": "आपसे ही, अनिल जी! आप ही तो कहते रहते हैं कि सच बोलो, पर मीठा बोलो।",
        "gloss": {
          "en": "From you, Anil ji! You're the one who keeps saying: speak the truth, but speak it sweetly.",
          "ko": "선배님한테서요, 아닐 선배님! 선배님이 늘 그러시잖아요, 진실을 말하되 부드럽게 말하라고."
        }
      },
      {
        "who": "them",
        "text": "हाहा, अब मुझे ही मक्खन लगा रहे हो?",
        "gloss": {
          "en": "Haha, now you're buttering me up?",
          "ko": "하하, 이제 나한테 아부하는 거야?"
        }
      },
      {
        "who": "me",
        "text": "नहीं-नहीं, सच कह रहा हूँ! चलिए, स्लाइड्स मैं ठीक कर देता हूँ, आप एक बार देख लीजिएगा।",
        "gloss": {
          "en": "No, no, I mean it! Come on, I'll fix the slides, and you could take a look once.",
          "ko": "아니에요, 진심이에요! 자, 슬라이드는 제가 고칠 테니 한번 봐 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Walking out of a stand-up comedy show with your friend Kabir",
      "ko": "스탠드업 코미디 공연을 보고 친구 카비르와 나오며"
    },
    "goal": {
      "en": "Swap reactions to the jokes and laugh off your own blunder with everyday idioms",
      "ko": "농담에 대한 반응을 주고받고, 일상 관용구로 내 실수를 웃어넘긴다"
    },
    "expressions": [
      "क्या बात है",
      "छोड़ो ना",
      "बाल-बाल बचे",
      "ऊँट के मुँह में ज़ीरा",
      "अपनी-अपनी पसंद",
      "जाने दो",
      "हद हो गई",
      "टेंशन मत लो"
    ],
    "grammar": [
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "क्या बात है यार, आज तो कॉमेडियन ने कमाल कर दिया!",
        "gloss": {
          "en": "Wow, man, the comedian was amazing tonight!",
          "ko": "와, 오늘 코미디언 진짜 대박이었다!"
        }
      },
      {
        "who": "me",
        "text": "सच में! हँसते-हँसते पेट दुखने लगा। ख़ासकर वह शादी वाला जोक, क्या बात है!",
        "gloss": {
          "en": "Totally! My stomach hurt from laughing. Especially that wedding joke — brilliant!",
          "ko": "진짜! 웃다가 배 아팠어. 특히 그 결혼식 농담, 끝내줬어!"
        }
      },
      {
        "who": "them",
        "text": "और रिश्तेदारों वाला? 'बेटा, कितना कमाते हो?' हाहा!",
        "gloss": {
          "en": "And the relatives one? 'Son, how much do you earn?' Haha!",
          "ko": "친척 얘기는? '얘야, 돈은 얼마나 버니?' 하하!"
        }
      },
      {
        "who": "me",
        "text": "वह तो हर हिंदुस्तानी घर की कहानी है। मेरी मौसी भी हर बार यही पूछ बैठती हैं।",
        "gloss": {
          "en": "That's the story of every Indian home. My aunt also ends up asking that every single time.",
          "ko": "그건 인도 집집마다 있는 얘기지. 우리 이모도 만날 때마다 그걸 꼭 물어보셔."
        }
      },
      {
        "who": "them",
        "text": "पर मुझे सरकार वाले जोक थोड़े ज़्यादा लगे। कोई नाराज़ न हो जाए।",
        "gloss": {
          "en": "But the government jokes felt a bit much to me. Hope nobody takes offence.",
          "ko": "근데 정부 얘기 농담은 좀 셌던 것 같아. 누가 화내면 어떡해."
        }
      },
      {
        "who": "me",
        "text": "छोड़ो ना, कॉमेडी में थोड़ा-बहुत तो चलता है।",
        "gloss": {
          "en": "Oh, come on, a bit of that is fine in comedy.",
          "ko": "에이, 됐어. 코미디에서 그 정도는 괜찮지."
        }
      },
      {
        "who": "them",
        "text": "पता है, पिछले साल एक कॉमेडियन पर ऐसे ही जोक की वजह से केस हो गया था।",
        "gloss": {
          "en": "You know, last year a comedian got a court case over exactly that kind of joke.",
          "ko": "있잖아, 작년에 어떤 코미디언이 딱 그런 농담 때문에 고소당했어."
        }
      },
      {
        "who": "me",
        "text": "हाँ, सुना था। वे बेचारे जेल जाने से बाल-बाल बचे थे।",
        "gloss": {
          "en": "Yeah, I heard. The poor guy narrowly escaped going to jail.",
          "ko": "응, 들었어. 그 사람 감옥 갈 뻔했다가 간신히 피했지."
        }
      },
      {
        "who": "them",
        "text": "और टिकट? बारह सौ रुपये, और शो सिर्फ़ पैंतालीस मिनट!",
        "gloss": {
          "en": "And the ticket? Twelve hundred rupees, and the show was only forty-five minutes!",
          "ko": "그리고 표값? 천이백 루피인데 공연은 사십오 분밖에 안 했어!"
        }
      },
      {
        "who": "me",
        "text": "हाँ यार, इतने पैसों में इतना छोटा शो, ऊँट के मुँह में ज़ीरा!",
        "gloss": {
          "en": "Yeah, man — such a short show for that money, a drop in the ocean!",
          "ko": "그러게, 그 돈 내고 그렇게 짧다니, 간에 기별도 안 가!"
        }
      },
      {
        "who": "them",
        "text": "वैसे, तुम्हारी गर्लफ़्रेंड तो बिलकुल नहीं हँसी।",
        "gloss": {
          "en": "By the way, your girlfriend didn't laugh at all.",
          "ko": "근데 네 여자친구는 하나도 안 웃던데."
        }
      },
      {
        "who": "me",
        "text": "अरे, उसे स्टैंडअप पसंद ही नहीं। उसे तो पुरानी फ़िल्में अच्छी लगती हैं। अपनी-अपनी पसंद।",
        "gloss": {
          "en": "Oh, she just doesn't like stand-up. She likes old films. To each their own.",
          "ko": "아, 걔는 스탠드업을 원래 안 좋아해. 옛날 영화를 좋아하거든. 다 취향이지."
        }
      },
      {
        "who": "them",
        "text": "आज वह कुछ ज़्यादा ही चुप थी। कहीं तुमसे नाराज़ तो नहीं?",
        "gloss": {
          "en": "She was extra quiet today. She's not upset with you, is she?",
          "ko": "오늘 유난히 조용하던데. 혹시 너한테 화난 거 아니야?"
        }
      },
      {
        "who": "me",
        "text": "जाने दो यार, कल मैं उसका जन्मदिन भूल बैठा। हद हो गई ना?",
        "gloss": {
          "en": "Forget it, man — yesterday I went and forgot her birthday. That's the limit, right?",
          "ko": "말도 마, 어제 걔 생일을 깜빡해 버렸어. 나도 참 너무했지?"
        }
      },
      {
        "who": "them",
        "text": "हाहा, अब तो तुम्हारी ख़ैर नहीं! क्या करोगे?",
        "gloss": {
          "en": "Haha, now you're in for it! What will you do?",
          "ko": "하하, 이제 너 큰일 났다! 어떡할 거야?"
        }
      },
      {
        "who": "me",
        "text": "टेंशन मत लो, कल उसे उसकी पसंदीदा जगह डिनर पर ले जाऊँगा, और मनाता रहूँगा जब तक वह हँस न दे।",
        "gloss": {
          "en": "Don't stress, tomorrow I'll take her to dinner at her favourite place and keep sweet-talking her until she laughs.",
          "ko": "걱정 마, 내일 걔가 제일 좋아하는 데서 저녁 사 주고 웃을 때까지 계속 달래 줄 거야."
        }
      }
    ]
  },
  {
    "id": "hi-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Guest on a Hindi podcast about tradition and modern life",
      "ko": "전통과 현대 생활을 다루는 힌디어 팟캐스트에 게스트로 출연"
    },
    "goal": {
      "en": "Argue a balanced view of tradition on air in formal Hindi, and stay gracious towards listeners who may disagree",
      "ko": "방송에서 격식 있는 힌디어로 전통에 대한 균형 잡힌 견해를 펴고, 반대할 청취자에게도 품위 있게 말한다"
    },
    "expressions": [
      "सिर पर चढ़ाना"
    ],
    "grammar": [
      1,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्कार श्रोताओ! आज हमारे साथ एक ख़ास मेहमान हैं। आपका स्वागत है। शुरुआत करें, क्या परंपराएँ आज भी प्रासंगिक हैं?",
        "gloss": {
          "en": "Greetings, listeners! Today we have a special guest. Welcome. Let's begin: are traditions still relevant today?",
          "ko": "청취자 여러분, 안녕하세요! 오늘은 특별한 손님을 모셨습니다. 환영합니다. 시작해 볼까요? 전통은 오늘날에도 의미가 있을까요?"
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद। मेरे विचार से कुछ परंपराएँ आज भी उतनी ही प्रासंगिक हैं, बस उनका रूप बदलता जा रहा है।",
        "gloss": {
          "en": "Thank you. In my view some traditions are just as relevant today; only their form keeps changing.",
          "ko": "감사합니다. 제 생각엔 어떤 전통들은 지금도 똑같이 의미가 있어요. 다만 그 모습이 계속 바뀌고 있을 뿐이죠."
        }
      },
      {
        "who": "them",
        "text": "उदाहरण के लिए?",
        "gloss": {
          "en": "For example?",
          "ko": "예를 들면요?"
        }
      },
      {
        "who": "me",
        "text": "जैसे संयुक्त परिवार। आजकल लोग अलग-अलग शहरों में रहते हैं, फिर भी वीडियो कॉल पर रोज़ जुड़े रहते हैं।",
        "gloss": {
          "en": "Like the joint family. These days people live in different cities, yet they stay connected on video calls every day.",
          "ko": "대가족 같은 거요. 요즘은 다들 다른 도시에 살지만, 그래도 매일 영상 통화로 이어져 있잖아요."
        }
      },
      {
        "who": "them",
        "text": "पर कई बुज़ुर्ग कहते हैं कि आजकल माँ-बाप ने बच्चों को बहुत छूट दे रखी है।",
        "gloss": {
          "en": "But many elders say that parents these days give their children far too much freedom.",
          "ko": "그런데 많은 어르신들은 요즘 부모들이 아이들을 너무 풀어 준다고 하시죠."
        }
      },
      {
        "who": "me",
        "text": "शायद उनकी बात में कुछ सच्चाई है। पर बच्चों को सिर पर चढ़ाना और उन्हें आज़ादी देना, दोनों में फ़र्क़ है।",
        "gloss": {
          "en": "Perhaps there's some truth in what they say. But spoiling children and giving them freedom are two different things.",
          "ko": "그 말씀에도 일리가 있을 거예요. 하지만 아이를 오냐오냐 버릇없게 키우는 것과 자유를 주는 건 다른 문제예요."
        }
      },
      {
        "who": "them",
        "text": "दिलचस्प। और शादियों में बढ़ते ख़र्चों पर आपकी क्या राय है?",
        "gloss": {
          "en": "Interesting. And what's your view on the rising cost of weddings?",
          "ko": "흥미롭네요. 그럼 점점 늘어나는 결혼식 비용에 대해선 어떻게 생각하세요?"
        }
      },
      {
        "who": "me",
        "text": "सच कहूँ तो, दिखावा बढ़ता ही जा रहा है। लोग क़र्ज़ ले-लेकर शादियाँ करते हैं।",
        "gloss": {
          "en": "Honestly, the show-off keeps growing and growing. People take loan after loan to hold weddings.",
          "ko": "솔직히 과시는 갈수록 심해지고 있어요. 사람들이 빚을 내고 또 내서 결혼식을 하죠."
        }
      },
      {
        "who": "them",
        "text": "लेकिन लोग कहेंगे, यह तो हमारी संस्कृति है!",
        "gloss": {
          "en": "But people will say, this is our culture!",
          "ko": "하지만 사람들은 이게 우리 문화라고 하겠죠!"
        }
      },
      {
        "who": "me",
        "text": "संस्कृति का अर्थ दिखावा नहीं है। हम परंपरा निभा भी सकते हैं, और समझदारी भी दिखा सकते हैं।",
        "gloss": {
          "en": "Culture doesn't mean showing off. We can keep up tradition and show good sense as well.",
          "ko": "문화가 곧 과시를 뜻하진 않아요. 전통을 지키면서도 얼마든지 현명하게 할 수 있어요."
        }
      },
      {
        "who": "them",
        "text": "आपकी राय से हमारे कुछ श्रोता शायद सहमत न हों।",
        "gloss": {
          "en": "Some of our listeners may not agree with your view.",
          "ko": "청취자 중에는 의견이 다른 분도 계실 거예요."
        }
      },
      {
        "who": "me",
        "text": "बिलकुल, और यह स्वाभाविक है। मैं बस इतना कहूँगा कि ज़रा खुले मन से सोचिएगा।",
        "gloss": {
          "en": "Of course, and that's natural. I'd only say: do try to think about it with an open mind.",
          "ko": "물론이죠, 당연한 일이에요. 그저 열린 마음으로 한번 생각해 봐 주셨으면 해요."
        }
      },
      {
        "who": "them",
        "text": "आख़िर में, आपके लिए परंपरा का एक शब्द में मतलब?",
        "gloss": {
          "en": "Finally, what does tradition mean to you, in one word?",
          "ko": "마지막으로, 한 단어로 하면 전통이란 뭘까요?"
        }
      },
      {
        "who": "me",
        "text": "जड़ें। पेड़ कितना भी ऊँचा हो जाए, जड़ों से जुड़ा रहे तभी हरा-भरा रहता है।",
        "gloss": {
          "en": "Roots. However tall a tree grows, it stays green only as long as it stays connected to its roots.",
          "ko": "뿌리요. 나무가 아무리 높이 자라도 뿌리와 이어져 있어야 푸르게 살 수 있으니까요."
        }
      },
      {
        "who": "them",
        "text": "वाह, बहुत सुंदर! इस बातचीत के लिए हार्दिक धन्यवाद।",
        "gloss": {
          "en": "Wow, beautiful! Heartfelt thanks for this conversation.",
          "ko": "와, 정말 멋지네요! 오늘 대화 진심으로 감사드립니다."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद तो मुझे आपको देना चाहिए। श्रोताओं से मेरा निवेदन है कि अपने विचार ज़रूर साझा करें।",
        "gloss": {
          "en": "It's I who should be thanking you. My request to the listeners: please do share your thoughts.",
          "ko": "감사는 제가 드려야죠. 청취자 여러분께도 꼭 의견을 나눠 주시길 부탁드립니다."
        }
      }
    ]
  }
];
