import type { StageScript } from "../../stageScripts.ts";

/**
 * hi 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const HI_BANK: StageScript[] = [
  {
    "id": "hi-1-b01",
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
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "नमस्ते",
      "मेरा नाम",
      "धन्यवाद",
      "हाँ",
      "कहाँ है",
      "अच्छा"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! होटल में आपका स्वागत है। आपका नाम क्या है?",
        "gloss": {
          "en": "Hello! Welcome to the hotel. What's your name?",
          "ko": "안녕하세요! 호텔에 오신 걸 환영해요. 성함이 어떻게 되세요?"
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
        "text": "जी, आपका कमरा तैयार है।",
        "gloss": {
          "en": "Yes, your room is ready.",
          "ko": "네, 방이 준비됐어요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद। लिफ़्ट कहाँ है?",
        "gloss": {
          "en": "Thank you. Where is the elevator?",
          "ko": "고마워요. 엘리베이터는 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "लिफ़्ट वहाँ है, बाईं तरफ़।",
        "gloss": {
          "en": "The elevator is over there, on the left.",
          "ko": "엘리베이터는 저기 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा। मुझे एक और तौलिया चाहिए।",
        "gloss": {
          "en": "OK. I need one more towel.",
          "ko": "알겠어요. 수건이 하나 더 필요해요."
        },
        "frames": [
          "hi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, मैं अभी भेजता हूँ।",
        "gloss": {
          "en": "Sure, I'll send it right away.",
          "ko": "네, 지금 바로 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "बहुत धन्यवाद!",
        "gloss": {
          "en": "Thank you very much!",
          "ko": "정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a new neighbor",
      "ko": "새 이웃과 인사"
    },
    "expressions": [
      "नमस्ते",
      "धन्यवाद",
      "हाँ",
      "जी",
      "अच्छा",
      "फिर मिलेंगे"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! आप नए पड़ोसी हैं?",
        "gloss": {
          "en": "Hello! Are you the new neighbor?",
          "ko": "안녕하세요! 새로 온 이웃이세요?"
        }
      },
      {
        "who": "me",
        "text": "जी, नमस्ते! मैं कोरिया से हूँ।",
        "gloss": {
          "en": "Yes, hello! I'm from Korea.",
          "ko": "네, 안녕하세요! 저는 한국에서 왔어요."
        },
        "frames": [
          "hi-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा! आप क्या करते हैं?",
        "gloss": {
          "en": "Oh! What do you do?",
          "ko": "그렇군요! 무슨 일 하세요?"
        }
      },
      {
        "who": "me",
        "text": "मैं इंजीनियर हूँ। क्या आप भी इंजीनियर हैं?",
        "gloss": {
          "en": "I'm an engineer. Are you an engineer too?",
          "ko": "저는 엔지니어예요. 당신도 엔지니어예요?"
        },
        "frames": [
          "hi-f1-03",
          "hi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "नहीं, मैं टीचर हूँ। मैं यहाँ दस साल से हूँ।",
        "gloss": {
          "en": "No, I'm a teacher. I've been here for ten years.",
          "ko": "아니요, 저는 선생님이에요. 여기 산 지 십 년 됐어요."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! मैं यहाँ नया हूँ।",
        "gloss": {
          "en": "Great! I'm new here.",
          "ko": "좋네요! 저는 여기 처음이에요."
        },
        "frames": [
          "hi-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "कोई बात नहीं, कुछ चाहिए तो बताइए।",
        "gloss": {
          "en": "No worries. If you need anything, let me know.",
          "ko": "괜찮아요, 필요한 거 있으면 말해요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद! फिर मिलेंगे।",
        "gloss": {
          "en": "Thank you! See you again.",
          "ko": "고마워요! 또 봬요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a fruit stall in the market",
      "ko": "시장 과일 가게에서"
    },
    "expressions": [
      "नमस्ते",
      "धन्यवाद",
      "कितने का है",
      "अच्छा",
      "ठीक है"
    ],
    "grammar": [
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "आइए, आइए! ताज़े फल हैं।",
        "gloss": {
          "en": "Come, come! Fresh fruit here.",
          "ko": "어서 오세요! 신선한 과일 있어요."
        }
      },
      {
        "who": "me",
        "text": "नमस्ते। यह क्या है?",
        "gloss": {
          "en": "Hello. What is this?",
          "ko": "안녕하세요. 이게 뭐예요?"
        },
        "frames": [
          "hi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "यह चीकू है। बहुत मीठा है।",
        "gloss": {
          "en": "This is chikoo. It's very sweet.",
          "ko": "이건 치쿠예요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! एक किलो कितने का है?",
        "gloss": {
          "en": "Oh! How much is one kilo?",
          "ko": "그렇군요! 일 킬로에 얼마예요?"
        },
        "frames": [
          "hi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "साठ रुपये किलो।",
        "gloss": {
          "en": "Sixty rupees a kilo.",
          "ko": "일 킬로에 육십 루피예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, एक किलो दीजिए।",
        "gloss": {
          "en": "OK, please give me one kilo.",
          "ko": "좋아요, 일 킬로 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "यह लीजिए। और कुछ?",
        "gloss": {
          "en": "Here you go. Anything else?",
          "ko": "여기요. 더 필요한 거 있어요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, बस। धन्यवाद!",
        "gloss": {
          "en": "No, that's all. Thank you!",
          "ko": "아니요, 그거면 돼요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Haggling with an auto-rickshaw driver",
      "ko": "오토릭샤 기사와 요금 흥정"
    },
    "expressions": [
      "धन्यवाद",
      "माफ़ कीजिए",
      "फिर से बोलिए"
    ],
    "grammar": [
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "कहाँ जाना है?",
        "gloss": {
          "en": "Where do you want to go?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "रेलवे स्टेशन चलिए।",
        "gloss": {
          "en": "Please go to the railway station.",
          "ko": "기차역으로 가 주세요."
        },
        "frames": [
          "hi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "डेढ़ सौ रुपये लगेंगे।",
        "gloss": {
          "en": "It'll be a hundred and fifty rupees.",
          "ko": "백오십 루피예요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, फिर से बोलिए।",
        "gloss": {
          "en": "Sorry, please say it again.",
          "ko": "죄송해요, 다시 말해 주세요."
        },
        "frames": [
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "एक सौ पचास रुपये।",
        "gloss": {
          "en": "One hundred fifty rupees.",
          "ko": "백오십 루피요."
        }
      },
      {
        "who": "me",
        "text": "बहुत ज़्यादा है। मीटर से चलिए।",
        "gloss": {
          "en": "That's too much. Please go by the meter.",
          "ko": "너무 비싸요. 미터기로 가 주세요."
        },
        "frames": [
          "hi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, बैठिए।",
        "gloss": {
          "en": "OK, get in.",
          "ko": "알겠어요, 타세요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद! स्टेशन कितनी दूर है?",
        "gloss": {
          "en": "Thanks! How far is the station?",
          "ko": "고마워요! 역은 얼마나 멀어요?"
        }
      }
    ]
  },
  {
    "id": "hi-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Lost and found at a café",
      "ko": "카페 분실물 찾기"
    },
    "expressions": [
      "धन्यवाद",
      "माफ़ कीजिए",
      "हाँ",
      "जी",
      "कहाँ है"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते, क्या हुआ?",
        "gloss": {
          "en": "Hello, what happened?",
          "ko": "안녕하세요, 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मेरा बैग कहाँ है?",
        "gloss": {
          "en": "Excuse me, where is my bag?",
          "ko": "실례지만, 제 가방이 어디 있어요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "यह काला बैग?",
        "gloss": {
          "en": "This black bag?",
          "ko": "이 검은 가방이요?"
        }
      },
      {
        "who": "me",
        "text": "जी हाँ, यह मेरा बैग है।",
        "gloss": {
          "en": "Yes, this is my bag.",
          "ko": "네, 이게 제 가방이에요."
        },
        "frames": [
          "hi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "और यह किताब?",
        "gloss": {
          "en": "And this book?",
          "ko": "그리고 이 책은요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, यह मेरी किताब है।",
        "gloss": {
          "en": "Yes, this is my book.",
          "ko": "네, 이건 제 책이에요."
        },
        "frames": [
          "hi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, लीजिए।",
        "gloss": {
          "en": "OK, here you go.",
          "ko": "알겠어요, 받으세요."
        }
      },
      {
        "who": "me",
        "text": "बहुत धन्यवाद!",
        "gloss": {
          "en": "Thank you so much!",
          "ko": "정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A family photo on a coworker's desk",
      "ko": "동료 책상 위 가족사진"
    },
    "expressions": [
      "हाँ",
      "कहाँ है",
      "अच्छा"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "यह मेरे परिवार की फ़ोटो है।",
        "gloss": {
          "en": "This is a photo of my family.",
          "ko": "이건 우리 가족 사진이에요."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छी फ़ोटो! यह कौन है?",
        "gloss": {
          "en": "What a nice photo! Who is this?",
          "ko": "사진 정말 좋네요! 이 사람은 누구예요?"
        },
        "frames": [
          "hi-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "यह मेरी छोटी बहन है।",
        "gloss": {
          "en": "This is my younger sister.",
          "ko": "이건 제 여동생이에요."
        }
      },
      {
        "who": "me",
        "text": "और वह कौन है?",
        "gloss": {
          "en": "And who is that?",
          "ko": "그럼 저 사람은 누구예요?"
        },
        "frames": [
          "hi-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "वह मेरे पापा हैं। वे डॉक्टर हैं।",
        "gloss": {
          "en": "That's my dad. He's a doctor.",
          "ko": "저분은 우리 아빠예요. 의사세요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! यह घर कहाँ है?",
        "gloss": {
          "en": "Oh! Where is this house?",
          "ko": "그렇군요! 이 집은 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "लखनऊ में। मेरा परिवार वहीं है।",
        "gloss": {
          "en": "In Lucknow. My family is there.",
          "ko": "러크나우에요. 우리 가족은 거기 있어요."
        }
      },
      {
        "who": "me",
        "text": "बहुत सुंदर!",
        "gloss": {
          "en": "Very beautiful!",
          "ko": "정말 예뻐요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phone call with a friend on the way",
      "ko": "가는 길에 친구와 통화"
    },
    "expressions": [
      "माफ़ कीजिए",
      "हाँ",
      "कहाँ है",
      "धीरे बोलिए",
      "एक मिनट",
      "ठीक है"
    ],
    "grammar": [
      0,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "हैलो! आप कहाँ हैं?",
        "gloss": {
          "en": "Hello! Where are you?",
          "ko": "여보세요! 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "मैं टैक्सी में हूँ।",
        "gloss": {
          "en": "I'm in a taxi.",
          "ko": "저 택시 안이에요."
        },
        "frames": [
          "hi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा। हम रेस्टोरेंट में हैं।",
        "gloss": {
          "en": "OK. We're at the restaurant.",
          "ko": "그렇군요. 우리는 식당에 있어요."
        }
      },
      {
        "who": "me",
        "text": "रेस्टोरेंट कहाँ है?",
        "gloss": {
          "en": "Where is the restaurant?",
          "ko": "식당이 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "मॉल के पास, दूसरी मंज़िल पर।",
        "gloss": {
          "en": "Near the mall, on the second floor.",
          "ko": "쇼핑몰 근처, 이 층이에요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, धीरे बोलिए।",
        "gloss": {
          "en": "Sorry, please speak slowly.",
          "ko": "죄송해요, 천천히 말해 주세요."
        },
        "frames": [
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "मॉल के पास। दूसरी मंज़िल।",
        "gloss": {
          "en": "Near the mall. Second floor.",
          "ko": "쇼핑몰 근처요. 이 층."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, एक मिनट!",
        "gloss": {
          "en": "OK, one minute!",
          "ko": "알겠어요, 금방 가요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a stationery shop",
      "ko": "문구점에서"
    },
    "expressions": [
      "धन्यवाद",
      "ठीक है"
    ],
    "grammar": [
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते, बताइए।",
        "gloss": {
          "en": "Hello, how can I help?",
          "ko": "안녕하세요, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "क्या आपके पास नोटबुक है?",
        "gloss": {
          "en": "Do you have a notebook?",
          "ko": "공책 있어요?"
        },
        "frames": [
          "hi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, है। छोटी या बड़ी?",
        "gloss": {
          "en": "Yes, we do. Small or big?",
          "ko": "네, 있어요. 작은 거요, 큰 거요?"
        }
      },
      {
        "who": "me",
        "text": "बड़ी दीजिए।",
        "gloss": {
          "en": "The big one, please.",
          "ko": "큰 거 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "यह लीजिए।",
        "gloss": {
          "en": "Here you go.",
          "ko": "여기요."
        }
      },
      {
        "who": "me",
        "text": "क्या आपके पास नीला पेन है?",
        "gloss": {
          "en": "Do you have a blue pen?",
          "ko": "파란 펜 있어요?"
        },
        "frames": [
          "hi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "जी, यह नीला पेन है। बीस रुपये।",
        "gloss": {
          "en": "Yes, here's a blue pen. Twenty rupees.",
          "ko": "네, 여기 파란 펜이요. 이십 루피예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, धन्यवाद।",
        "gloss": {
          "en": "OK, thank you.",
          "ko": "좋아요, 고마워요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "धन्यवाद",
      "शुक्रिया",
      "माफ़ कीजिए",
      "हाँ",
      "कहाँ है",
      "अच्छा"
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
        "text": "नमस्ते, क्या परेशानी है?",
        "gloss": {
          "en": "Hello, what's the problem?",
          "ko": "안녕하세요, 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "मुझे डॉक्टर चाहिए। मेरे सिर में दर्द है।",
        "gloss": {
          "en": "I need a doctor. I have a headache.",
          "ko": "의사 선생님을 봬야 해요. 머리가 아파요."
        },
        "frames": [
          "hi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। यह फ़ॉर्म भरिए।",
        "gloss": {
          "en": "OK. Please fill out this form.",
          "ko": "알겠어요. 이 서류를 작성해 주세요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मुझे यह शब्द समझ नहीं आया।",
        "gloss": {
          "en": "Sorry, I didn't understand this word.",
          "ko": "죄송해요, 이 단어를 이해 못 했어요."
        },
        "frames": [
          "hi-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "यह \"उम्र\" है। यानी आपकी उम्र।",
        "gloss": {
          "en": "This is \"umr\". It means your age.",
          "ko": "이건 \"움르\"예요. 나이라는 뜻이에요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा, धन्यवाद। पेन कहाँ है?",
        "gloss": {
          "en": "Oh, thanks. Where is a pen?",
          "ko": "아, 고마워요. 펜은 어디 있어요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "यहाँ है।",
        "gloss": {
          "en": "Here it is.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "शुक्रिया।",
        "gloss": {
          "en": "Thanks.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a restaurant",
      "ko": "식당에서 주문하기"
    },
    "expressions": [
      "धन्यवाद",
      "अच्छा"
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
        "text": "नमस्ते! क्या लेंगे?",
        "gloss": {
          "en": "Hello! What will you have?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "पनीर टिक्का क्या है?",
        "gloss": {
          "en": "What is paneer tikka?",
          "ko": "파니르 티카가 뭐예요?"
        },
        "frames": [
          "hi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "यह पनीर का स्टार्टर है।",
        "gloss": {
          "en": "It's a starter made with paneer.",
          "ko": "파니르로 만든 전채 요리예요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा, एक पनीर टिक्का दीजिए।",
        "gloss": {
          "en": "OK, one paneer tikka, please.",
          "ko": "좋아요, 파니르 티카 하나 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "और पीने के लिए?",
        "gloss": {
          "en": "And to drink?",
          "ko": "마실 건요?"
        }
      },
      {
        "who": "me",
        "text": "मुझे एक लस्सी चाहिए।",
        "gloss": {
          "en": "I'd like a lassi.",
          "ko": "라씨 한 잔 주세요."
        },
        "frames": [
          "hi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, एक मिनट।",
        "gloss": {
          "en": "OK, one minute.",
          "ko": "네, 잠시만요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद।",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the train ticket counter",
      "ko": "기차역 매표소에서"
    },
    "expressions": [
      "धन्यवाद",
      "हाँ",
      "कितने का है",
      "कहाँ है",
      "ठीक है"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "जी, बताइए।",
        "gloss": {
          "en": "Yes, go ahead.",
          "ko": "네, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "आगरा का टिकट कितने का है?",
        "gloss": {
          "en": "How much is a ticket to Agra?",
          "ko": "아그라행 표는 얼마예요?"
        },
        "frames": [
          "hi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "चार सौ रुपये।",
        "gloss": {
          "en": "Four hundred rupees.",
          "ko": "사백 루피예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, एक टिकट दीजिए।",
        "gloss": {
          "en": "OK, one ticket, please.",
          "ko": "좋아요, 표 한 장 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "यह लीजिए। ट्रेन प्लेटफ़ॉर्म तीन पर है।",
        "gloss": {
          "en": "Here you go. The train is on platform three.",
          "ko": "여기요. 기차는 삼번 승강장이에요."
        }
      },
      {
        "who": "me",
        "text": "प्लेटफ़ॉर्म तीन कहाँ है?",
        "gloss": {
          "en": "Where is platform three?",
          "ko": "삼번 승강장은 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "सीधे जाइए, फिर दाएँ।",
        "gloss": {
          "en": "Go straight, then right.",
          "ko": "쭉 가서 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "मदद के लिए धन्यवाद!",
        "gloss": {
          "en": "Thanks for the help!",
          "ko": "도와주셔서 고마워요!"
        },
        "frames": [
          "hi-f1-18"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Hindi class with the teacher",
      "ko": "힌디어 수업에서 선생님과"
    },
    "expressions": [
      "धन्यवाद",
      "माफ़ कीजिए",
      "मुझे समझ नहीं आया",
      "धीरे बोलिए",
      "अच्छा",
      "ठीक है"
    ],
    "grammar": [
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "आज का शब्द है \"मुलाक़ात\"।",
        "gloss": {
          "en": "Today's word is \"mulaqat\".",
          "ko": "오늘의 단어는 \"물라까뜨\"예요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मुझे समझ नहीं आया।",
        "gloss": {
          "en": "Sorry, I didn't understand.",
          "ko": "죄송해요, 이해 못 했어요."
        },
        "frames": [
          "hi-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "\"मुलाक़ात\" यानी मिलना।",
        "gloss": {
          "en": "\"Mulaqat\" means meeting.",
          "ko": "\"물라까뜨\"는 만남이라는 뜻이에요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! थोड़ा धीरे बोलिए।",
        "gloss": {
          "en": "Oh! Please speak a little more slowly.",
          "ko": "아! 조금 천천히 말해 주세요."
        },
        "frames": [
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। मु-ला-क़ात।",
        "gloss": {
          "en": "OK. Mu-la-qat.",
          "ko": "네. 물-라-까뜨."
        }
      },
      {
        "who": "me",
        "text": "मु-ला-क़ात। ठीक है?",
        "gloss": {
          "en": "Mu-la-qat. Is that right?",
          "ko": "물-라-까뜨. 맞아요?"
        }
      },
      {
        "who": "them",
        "text": "हाँ, बिल्कुल ठीक!",
        "gloss": {
          "en": "Yes, exactly right!",
          "ko": "네, 딱 맞아요!"
        }
      },
      {
        "who": "me",
        "text": "समझाने के लिए धन्यवाद!",
        "gloss": {
          "en": "Thanks for explaining!",
          "ko": "설명해 주셔서 고마워요!"
        },
        "frames": [
          "hi-f1-18"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A parcel delivery at the door",
      "ko": "집 앞 택배 받기"
    },
    "expressions": [
      "धन्यवाद",
      "हाँ",
      "जी"
    ],
    "grammar": [
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! आपका पार्सल है।",
        "gloss": {
          "en": "Hello! There's a parcel for you.",
          "ko": "안녕하세요! 택배 왔어요."
        }
      },
      {
        "who": "me",
        "text": "क्या आप डिलीवरी वाले हैं?",
        "gloss": {
          "en": "Are you the delivery person?",
          "ko": "택배 기사님이세요?"
        },
        "frames": [
          "hi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "जी हाँ। यह फ़्लैट नंबर बारह है?",
        "gloss": {
          "en": "Yes. Is this flat number twelve?",
          "ko": "네. 여기 십이 호예요?"
        }
      },
      {
        "who": "me",
        "text": "जी हाँ, यह मेरा फ़्लैट है।",
        "gloss": {
          "en": "Yes, this is my flat.",
          "ko": "네, 제 집이에요."
        },
        "frames": [
          "hi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "यहाँ साइन कीजिए।",
        "gloss": {
          "en": "Please sign here.",
          "ko": "여기 서명해 주세요."
        }
      },
      {
        "who": "me",
        "text": "पेन? क्या आपके पास पेन है?",
        "gloss": {
          "en": "A pen? Do you have a pen?",
          "ko": "펜이요? 펜 있으세요?"
        },
        "frames": [
          "hi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, यह लीजिए।",
        "gloss": {
          "en": "Yes, here you go.",
          "ko": "네, 여기요."
        }
      },
      {
        "who": "me",
        "text": "डिलीवरी के लिए धन्यवाद!",
        "gloss": {
          "en": "Thanks for the delivery!",
          "ko": "배달해 주셔서 고마워요!"
        },
        "frames": [
          "hi-f1-18"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Sightseeing at the Red Fort",
      "ko": "레드 포트 관광"
    },
    "expressions": [
      "धन्यवाद",
      "हाँ",
      "कहाँ है",
      "अच्छा",
      "ठीक है"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "यह लाल क़िला है।",
        "gloss": {
          "en": "This is the Red Fort.",
          "ko": "여기가 레드 포트예요."
        }
      },
      {
        "who": "me",
        "text": "बहुत सुंदर! वह क्या है?",
        "gloss": {
          "en": "Very beautiful! What is that?",
          "ko": "정말 멋져요! 저건 뭐예요?"
        },
        "frames": [
          "hi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "वह दीवान-ए-आम है।",
        "gloss": {
          "en": "That's the Diwan-i-Aam.",
          "ko": "저건 디완이암이에요."
        }
      },
      {
        "who": "me",
        "text": "वह आदमी कौन है?",
        "gloss": {
          "en": "Who is that man?",
          "ko": "저 남자는 누구예요?"
        },
        "frames": [
          "hi-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "वह हमारा गाइड है।",
        "gloss": {
          "en": "He's our guide.",
          "ko": "저분은 우리 가이드예요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! टिकट घर कहाँ है?",
        "gloss": {
          "en": "I see! Where is the ticket office?",
          "ko": "그렇군요! 매표소는 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "गेट के पास।",
        "gloss": {
          "en": "Near the gate.",
          "ko": "입구 근처예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, धन्यवाद।",
        "gloss": {
          "en": "OK, thank you.",
          "ko": "알겠어요, 고마워요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a pharmacy",
      "ko": "약국에서"
    },
    "expressions": [
      "कितने का है",
      "अच्छा",
      "ठीक है"
    ],
    "grammar": [
      1,
      3,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "जी, क्या चाहिए?",
        "gloss": {
          "en": "Yes, what do you need?",
          "ko": "네, 뭐 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "क्या आपके पास सिरदर्द की दवा है?",
        "gloss": {
          "en": "Do you have medicine for a headache?",
          "ko": "두통약 있어요?"
        },
        "frames": [
          "hi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, यह गोली लीजिए।",
        "gloss": {
          "en": "Yes, take this tablet.",
          "ko": "네, 이 알약 드세요."
        }
      },
      {
        "who": "me",
        "text": "यह कितने का है?",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "hi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "तीस रुपये।",
        "gloss": {
          "en": "Thirty rupees.",
          "ko": "삼십 루피예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। मुझे पानी भी चाहिए।",
        "gloss": {
          "en": "OK. I need water too.",
          "ko": "좋아요. 물도 필요해요."
        },
        "frames": [
          "hi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "पानी बीस रुपये का है।",
        "gloss": {
          "en": "Water is twenty rupees.",
          "ko": "물은 이십 루피예요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा, दोनों दीजिए।",
        "gloss": {
          "en": "OK, please give me both.",
          "ko": "좋아요, 둘 다 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Chatting with a seatmate on a train",
      "ko": "기차 옆자리 사람과 대화"
    },
    "expressions": [
      "हाँ",
      "जी",
      "कहाँ है",
      "अच्छा"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "आप भारत में नए हैं?",
        "gloss": {
          "en": "Are you new in India?",
          "ko": "인도는 처음이세요?"
        }
      },
      {
        "who": "me",
        "text": "जी हाँ, मैं यहाँ नया हूँ। मैं सियोल से हूँ।",
        "gloss": {
          "en": "Yes, I'm new here. I'm from Seoul.",
          "ko": "네, 여기 처음이에요. 저는 서울에서 왔어요."
        },
        "frames": [
          "hi-f1-03",
          "hi-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा! क्या आप छात्र हैं?",
        "gloss": {
          "en": "Oh! Are you a student?",
          "ko": "그렇군요! 학생이세요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, मैं डिज़ाइनर हूँ। और आप?",
        "gloss": {
          "en": "No, I'm a designer. And you?",
          "ko": "아니요, 저는 디자이너예요. 당신은요?"
        },
        "frames": [
          "hi-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "मैं डॉक्टर हूँ। जयपुर में मेरा घर है।",
        "gloss": {
          "en": "I'm a doctor. My home is in Jaipur.",
          "ko": "저는 의사예요. 제 집은 자이푸르에 있어요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! जयपुर कैसा है?",
        "gloss": {
          "en": "Oh! What is Jaipur like?",
          "ko": "그렇군요! 자이푸르는 어때요?"
        }
      },
      {
        "who": "them",
        "text": "बहुत सुंदर! वहाँ हवा महल देखिए।",
        "gloss": {
          "en": "Very beautiful! Go and see the Hawa Mahal there.",
          "ko": "아주 아름다워요! 거기서 하와 마할 꼭 보세요."
        }
      },
      {
        "who": "me",
        "text": "हवा महल कहाँ है?",
        "gloss": {
          "en": "Where is the Hawa Mahal?",
          "ko": "하와 마할은 어디 있어요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Tea at a friend's home",
      "ko": "친구 집에서 차 마시기"
    },
    "expressions": [
      "धन्यवाद",
      "हाँ",
      "अच्छा"
    ],
    "grammar": [
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "आइए, बैठिए! चाय या कॉफ़ी?",
        "gloss": {
          "en": "Come in, sit down! Tea or coffee?",
          "ko": "어서 와요, 앉아요! 차 마실래요, 커피 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "चाय दीजिए।",
        "gloss": {
          "en": "Tea, please.",
          "ko": "차 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "चीनी?",
        "gloss": {
          "en": "Sugar?",
          "ko": "설탕은요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, थोड़ी। यह क्या है?",
        "gloss": {
          "en": "Yes, a little. What's this?",
          "ko": "네, 조금요. 이건 뭐예요?"
        },
        "frames": [
          "hi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "यह समोसा है। मेरी माँ का समोसा!",
        "gloss": {
          "en": "This is a samosa. My mom's samosa!",
          "ko": "이건 사모사예요. 우리 엄마 사모사요!"
        }
      },
      {
        "who": "me",
        "text": "वाह! बहुत अच्छा है।",
        "gloss": {
          "en": "Wow! It's really good.",
          "ko": "와! 정말 맛있어요."
        }
      },
      {
        "who": "them",
        "text": "और लीजिए!",
        "gloss": {
          "en": "Have some more!",
          "ko": "더 드세요!"
        }
      },
      {
        "who": "me",
        "text": "बस, धन्यवाद। चाय के लिए धन्यवाद!",
        "gloss": {
          "en": "That's enough, thank you. Thanks for the tea!",
          "ko": "이제 됐어요, 고마워요. 차 잘 마셨어요!"
        },
        "frames": [
          "hi-f1-18"
        ]
      }
    ]
  },
  {
    "id": "hi-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A hot day in the park",
      "ko": "더운 날 공원에서"
    },
    "expressions": [
      "हाँ",
      "कहाँ है",
      "ठीक है"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "उफ़, आज बहुत गर्मी है!",
        "gloss": {
          "en": "Phew, it's really hot today!",
          "ko": "휴, 오늘 정말 덥네요!"
        }
      },
      {
        "who": "me",
        "text": "हाँ! क्या आप ठीक हैं?",
        "gloss": {
          "en": "Yes! Are you okay?",
          "ko": "네! 괜찮으세요?"
        },
        "frames": [
          "hi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, बस थोड़ी प्यास है।",
        "gloss": {
          "en": "Yes, just a bit thirsty.",
          "ko": "네, 그냥 좀 목말라요."
        }
      },
      {
        "who": "me",
        "text": "यह मेरी बोतल है। पानी लीजिए।",
        "gloss": {
          "en": "This is my bottle. Have some water.",
          "ko": "이거 제 물병이에요. 물 드세요."
        },
        "frames": [
          "hi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "शुक्रिया! आज छाँव भी नहीं है।",
        "gloss": {
          "en": "Thanks! There's no shade today either.",
          "ko": "고마워요! 오늘은 그늘도 없네요."
        }
      },
      {
        "who": "me",
        "text": "हाँ। बेंच कहाँ है?",
        "gloss": {
          "en": "Right. Where is a bench?",
          "ko": "그러게요. 벤치는 어디 있어요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "वहाँ, पेड़ के नीचे। चलिए!",
        "gloss": {
          "en": "Over there, under the tree. Let's go!",
          "ko": "저기, 나무 아래요. 가요!"
        }
      },
      {
        "who": "me",
        "text": "ठीक है, चलिए!",
        "gloss": {
          "en": "OK, let's go!",
          "ko": "좋아요, 가요!"
        }
      }
    ]
  },
  {
    "id": "hi-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a charger at a phone shop",
      "ko": "휴대폰 가게에서 충전기 사기"
    },
    "expressions": [
      "शुक्रिया",
      "कितने का है",
      "यह दीजिए",
      "ठीक है",
      "फिर मिलेंगे"
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
        "text": "आइए, क्या देखना है?",
        "gloss": {
          "en": "Come in, what would you like to see?",
          "ko": "어서 오세요, 뭐 보러 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "यह मेरा फ़ोन है। क्या आपके पास इसका चार्जर है?",
        "gloss": {
          "en": "This is my phone. Do you have a charger for it?",
          "ko": "이게 제 휴대폰이에요. 이거 충전기 있어요?"
        },
        "frames": [
          "hi-f1-12",
          "hi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, है। यह देखिए।",
        "gloss": {
          "en": "Yes, we do. Have a look at this.",
          "ko": "네, 있어요. 이거 보세요."
        }
      },
      {
        "who": "me",
        "text": "यह कितने का है?",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "hi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "तीन सौ रुपये।",
        "gloss": {
          "en": "Three hundred rupees.",
          "ko": "삼백 루피예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, यह दीजिए।",
        "gloss": {
          "en": "OK, I'll take this one.",
          "ko": "좋아요, 이거 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "धन्यवाद! बिल यह है।",
        "gloss": {
          "en": "Thank you! Here's the bill.",
          "ko": "감사합니다! 영수증 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "शुक्रिया, फिर मिलेंगे।",
        "gloss": {
          "en": "Thanks, see you again.",
          "ko": "고마워요, 또 올게요."
        }
      }
    ]
  },
  {
    "id": "hi-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way to the bank",
      "ko": "은행 가는 길 묻기"
    },
    "expressions": [
      "शुक्रिया",
      "माफ़ कीजिए",
      "हाँ",
      "कहाँ है",
      "फिर से बोलिए",
      "अच्छा"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "जी, बोलिए?",
        "gloss": {
          "en": "Yes, can I help you?",
          "ko": "네, 말씀하세요?"
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, बैंक कहाँ है?",
        "gloss": {
          "en": "Excuse me, where is the bank?",
          "ko": "실례지만, 은행이 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "सीधे जाइए, फिर बाएँ मुड़िए, मंदिर के सामने।",
        "gloss": {
          "en": "Go straight, then turn left. It's in front of the temple.",
          "ko": "쭉 가서 왼쪽으로 돌면 사원 앞이에요."
        }
      },
      {
        "who": "me",
        "text": "मुझे \"मुड़िए\" समझ नहीं आया।",
        "gloss": {
          "en": "I didn't understand \"mudiye\".",
          "ko": "\"무리에\"를 이해 못 했어요."
        },
        "frames": [
          "hi-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "\"मुड़िए\" यानी टर्न कीजिए।",
        "gloss": {
          "en": "\"Mudiye\" means turn.",
          "ko": "\"무리에\"는 돌라는 뜻이에요."
        }
      },
      {
        "who": "me",
        "text": "अच्छा! एक बार फिर से बोलिए।",
        "gloss": {
          "en": "Oh! Please say it once more.",
          "ko": "아! 한 번 더 말해 주세요."
        },
        "frames": [
          "hi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "सीधे, फिर बाएँ, मंदिर के सामने।",
        "gloss": {
          "en": "Straight, then left, in front of the temple.",
          "ko": "쭉 가다가 왼쪽, 사원 앞이요."
        }
      },
      {
        "who": "me",
        "text": "शुक्रिया, समझ गया!",
        "gloss": {
          "en": "Thanks, got it!",
          "ko": "고마워요, 알겠어요!"
        }
      }
    ]
  },
  {
    "id": "hi-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Morning routine chat with a coworker",
      "ko": "동료와 아침 습관 이야기"
    },
    "expressions": [
      "ज़रूर"
    ],
    "grammar": [
      0,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "आप हमेशा इतने फ़्रेश दिखते हैं! राज़ क्या है?",
        "gloss": {
          "en": "You always look so fresh! What's the secret?",
          "ko": "항상 그렇게 상쾌해 보이세요! 비결이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "मैं रोज़ छह बजे उठता हूँ।",
        "gloss": {
          "en": "I get up at six every day.",
          "ko": "저는 매일 여섯 시에 일어나요."
        },
        "frames": [
          "hi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "इतनी जल्दी! फिर क्या करते हैं?",
        "gloss": {
          "en": "So early! Then what do you do?",
          "ko": "그렇게 일찍요! 그다음엔 뭐 해요?"
        }
      },
      {
        "who": "me",
        "text": "मैं रोज़ आधा घंटा योगा करता हूँ।",
        "gloss": {
          "en": "I do yoga for half an hour every day.",
          "ko": "매일 삼십 분씩 요가를 해요."
        },
        "frames": [
          "hi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "वाह! और नाश्ता?",
        "gloss": {
          "en": "Wow! And breakfast?",
          "ko": "와! 아침 식사는요?"
        }
      },
      {
        "who": "me",
        "text": "नाश्ते के बाद मैं थोड़ा आराम करता हूँ।",
        "gloss": {
          "en": "After breakfast I rest a little.",
          "ko": "아침 먹고 나서 조금 쉬어요."
        },
        "frames": [
          "hi-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "बहुत अच्छा! मैं भी कल से कोशिश करूँगी।",
        "gloss": {
          "en": "Great! I'll try it too, starting tomorrow.",
          "ko": "좋네요! 저도 내일부터 해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "ज़रूर कीजिए! मुझे सुबह का समय बहुत पसंद है।",
        "gloss": {
          "en": "Definitely do! I really love the morning time.",
          "ko": "꼭 해 보세요! 저는 아침 시간이 정말 좋아요."
        },
        "frames": [
          "hi-f2-06"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A phone call about movie plans",
      "ko": "영화 약속 전화"
    },
    "expressions": [
      "सब ठीक है",
      "कितने बजे",
      "बहुत अच्छा",
      "कोई प्लान है",
      "ज़रूर"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "हैलो! क्या हाल है? आज क्या कर रहे हो?",
        "gloss": {
          "en": "Hello! How's it going? What are you doing today?",
          "ko": "여보세요! 잘 지내? 오늘 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "सब ठीक है। मैं अभी खाना बना रहा हूँ।",
        "gloss": {
          "en": "All good. I'm cooking right now.",
          "ko": "다 괜찮아. 지금 밥 하고 있어."
        },
        "frames": [
          "hi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा! शाम को फ़्री हो?",
        "gloss": {
          "en": "Nice! Are you free this evening?",
          "ko": "그렇구나! 저녁에 시간 돼?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, ज़रूर। कोई प्लान है?",
        "gloss": {
          "en": "Yes, sure. Got any plans?",
          "ko": "응, 당연하지. 무슨 계획 있어?"
        }
      },
      {
        "who": "them",
        "text": "नई फ़िल्म आई है। चलें?",
        "gloss": {
          "en": "A new movie is out. Shall we go?",
          "ko": "새 영화 나왔어. 갈래?"
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! फ़िल्म कितने बजे है?",
        "gloss": {
          "en": "Great! What time is the movie?",
          "ko": "좋아! 영화 몇 시야?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "सात बजे।",
        "gloss": {
          "en": "At seven.",
          "ko": "일곱 시."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। चलो, साढ़े छह बजे मिलते हैं।",
        "gloss": {
          "en": "OK. Let's meet at six thirty.",
          "ko": "좋아. 여섯 시 반에 만나자."
        },
        "frames": [
          "hi-f2-08"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a dhaba",
      "ko": "다바 식당에서 저녁 주문"
    },
    "expressions": [
      "बहुत अच्छा",
      "बिल ले आइए"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! क्या लाऊँ?",
        "gloss": {
          "en": "Hello! What can I bring you?",
          "ko": "안녕하세요! 뭘 가져다드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "एक दाल मखनी और दो रोटी ले आइए।",
        "gloss": {
          "en": "Please bring one dal makhani and two rotis.",
          "ko": "달 마카니 하나랑 로티 두 개 갖다주세요."
        },
        "frames": [
          "hi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "और कुछ? चिकन करी भी अच्छी है।",
        "gloss": {
          "en": "Anything else? The chicken curry is good too.",
          "ko": "다른 건요? 치킨 커리도 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मुझे तीखा खाना पसंद नहीं।",
        "gloss": {
          "en": "Sorry, I don't like spicy food.",
          "ko": "죄송해요, 저는 매운 음식을 안 좋아해요."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "कोई बात नहीं, दाल ज़्यादा तीखी नहीं है।",
        "gloss": {
          "en": "No problem, the dal isn't too spicy.",
          "ko": "괜찮아요, 달은 많이 맵지 않아요."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा। ठंडा पानी भी ले आइए।",
        "gloss": {
          "en": "Great. Please bring some cold water too.",
          "ko": "좋아요. 시원한 물도 갖다주세요."
        },
        "frames": [
          "hi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "खाना कैसा था?",
        "gloss": {
          "en": "How was the food?",
          "ko": "음식 어떠셨어요?"
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! बिल ले आइए।",
        "gloss": {
          "en": "Very good! Please bring the bill.",
          "ko": "정말 맛있었어요! 계산서 갖다주세요."
        },
        "frames": [
          "hi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning tomorrow with a roommate",
      "ko": "룸메이트와 내일 계획"
    },
    "expressions": [],
    "grammar": [
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "कल क्या कर रहे हो?",
        "gloss": {
          "en": "What are you doing tomorrow?",
          "ko": "내일 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "कल मैं बैंक जाऊँगा।",
        "gloss": {
          "en": "Tomorrow I'll go to the bank.",
          "ko": "내일 은행에 갈 거야."
        },
        "frames": [
          "hi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "फिर?",
        "gloss": {
          "en": "And then?",
          "ko": "그다음엔?"
        }
      },
      {
        "who": "me",
        "text": "बैंक के बाद मैं बाज़ार जाऊँगा।",
        "gloss": {
          "en": "After the bank I'll go to the market.",
          "ko": "은행 들렀다가 시장에 갈 거야."
        }
      },
      {
        "who": "them",
        "text": "कल रात खाना साथ खाएँ?",
        "gloss": {
          "en": "Shall we have dinner together tomorrow night?",
          "ko": "내일 밤에 같이 저녁 먹을까?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं सात बजे से पहले घर आऊँगा।",
        "gloss": {
          "en": "Yes, I'll be home before seven.",
          "ko": "응, 일곱 시 전에 집에 올게."
        },
        "frames": [
          "hi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, मैं पनीर बनाऊँगा।",
        "gloss": {
          "en": "OK, I'll make paneer.",
          "ko": "좋아, 내가 파니르 만들게."
        }
      },
      {
        "who": "me",
        "text": "वाह! मुझे पनीर बहुत पसंद है।",
        "gloss": {
          "en": "Wow! I love paneer.",
          "ko": "와! 나 파니르 정말 좋아해."
        },
        "frames": [
          "hi-f2-06"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Back from a trip, chatting with a coworker",
      "ko": "여행 다녀와서 동료와"
    },
    "expressions": [
      "मज़ा आया",
      "पिछले हफ़्ते",
      "ज़रूर"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "बहुत दिन बाद! कहाँ थे?",
        "gloss": {
          "en": "Long time no see! Where were you?",
          "ko": "오랜만이에요! 어디 있었어요?"
        }
      },
      {
        "who": "me",
        "text": "पिछले हफ़्ते मैं उदयपुर गया।",
        "gloss": {
          "en": "Last week I went to Udaipur.",
          "ko": "지난주에 우다이푸르에 갔어요."
        },
        "frames": [
          "hi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "वाह! कैसा लगा?",
        "gloss": {
          "en": "Wow! How was it?",
          "ko": "와! 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "बहुत मज़ा आया। मुझे वहाँ की झील बहुत पसंद है।",
        "gloss": {
          "en": "It was great fun. I really love the lake there.",
          "ko": "정말 재밌었어요. 거기 호수가 정말 좋아요."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "और खाना?",
        "gloss": {
          "en": "And the food?",
          "ko": "음식은요?"
        }
      },
      {
        "who": "me",
        "text": "खाना अच्छा था, पर बहुत भीड़ थी। मुझे भीड़ पसंद नहीं।",
        "gloss": {
          "en": "The food was good, but it was very crowded. I don't like crowds.",
          "ko": "음식은 좋았는데 사람이 너무 많았어요. 저는 붐비는 거 싫어요."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "अगली बार मुझे भी ले चलना!",
        "gloss": {
          "en": "Take me along next time!",
          "ko": "다음엔 저도 데려가요!"
        }
      },
      {
        "who": "me",
        "text": "ज़रूर!",
        "gloss": {
          "en": "Sure!",
          "ko": "그럼요!"
        }
      }
    ]
  },
  {
    "id": "hi-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting about hobbies after class",
      "ko": "수업 끝나고 취미 이야기"
    },
    "expressions": [
      "कितने बजे"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "इस वीकेंड कोई प्लान है?",
        "gloss": {
          "en": "Any plans this weekend?",
          "ko": "이번 주말에 계획 있어?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, इस वीकेंड मैं गिटार की क्लास शुरू करूँगा।",
        "gloss": {
          "en": "Yes, this weekend I'll start guitar lessons.",
          "ko": "응, 이번 주말에 기타 수업 시작할 거야."
        },
        "frames": [
          "hi-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "वाह! तुम्हें संगीत पसंद है?",
        "gloss": {
          "en": "Wow! Do you like music?",
          "ko": "와! 음악 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मुझे संगीत बहुत पसंद है।",
        "gloss": {
          "en": "Yes, I really like music.",
          "ko": "응, 음악 정말 좋아해."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "मैं भी! रविवार को एक कॉन्सर्ट है।",
        "gloss": {
          "en": "Me too! There's a concert on Sunday.",
          "ko": "나도! 일요일에 콘서트가 있어."
        }
      },
      {
        "who": "me",
        "text": "सच में? कॉन्सर्ट कितने बजे है?",
        "gloss": {
          "en": "Really? What time is the concert?",
          "ko": "진짜? 콘서트 몇 시야?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "शाम छह बजे।",
        "gloss": {
          "en": "At six in the evening.",
          "ko": "저녁 여섯 시."
        }
      },
      {
        "who": "me",
        "text": "बढ़िया! चलो, साथ में कॉन्सर्ट चलते हैं।",
        "gloss": {
          "en": "Great! Let's go to the concert together.",
          "ko": "좋아! 같이 콘서트 가자."
        },
        "frames": [
          "hi-f2-14"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about family with a classmate",
      "ko": "반 친구와 가족 이야기"
    },
    "expressions": [
      "मेरे घर में",
      "बड़ा भाई",
      "छोटी बहन"
    ],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "तुम्हारे घर में कौन-कौन है?",
        "gloss": {
          "en": "Who's in your family?",
          "ko": "너희 집엔 누구누구 있어?"
        }
      },
      {
        "who": "me",
        "text": "मेरे घर में मम्मी, पापा और छोटी बहन हैं।",
        "gloss": {
          "en": "At home there's my mom, my dad and my younger sister.",
          "ko": "우리 집엔 엄마, 아빠, 여동생이 있어."
        }
      },
      {
        "who": "them",
        "text": "बस? कोई भाई नहीं?",
        "gloss": {
          "en": "That's it? No brother?",
          "ko": "그게 다야? 형제는 없어?"
        }
      },
      {
        "who": "me",
        "text": "है। मेरा बड़ा भाई बुसान में रहता है।",
        "gloss": {
          "en": "I do have one. My older brother lives in Busan.",
          "ko": "있어. 형은 부산에 살아."
        },
        "frames": [
          "hi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "वह क्या करता है?",
        "gloss": {
          "en": "What does he do?",
          "ko": "형은 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "वह शेफ़ है। मुझे उसका खाना बहुत पसंद है।",
        "gloss": {
          "en": "He's a chef. I really love his cooking.",
          "ko": "요리사야. 형 요리 정말 좋아해."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "तुम उससे कब मिलोगे?",
        "gloss": {
          "en": "When will you see him?",
          "ko": "형은 언제 만나?"
        }
      },
      {
        "who": "me",
        "text": "इस वीकेंड मैं उसे वीडियो कॉल करूँगा।",
        "gloss": {
          "en": "This weekend I'll video call him.",
          "ko": "이번 주말에 형한테 영상통화할 거야."
        },
        "frames": [
          "hi-f2-17"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A new friend lives nearby",
      "ko": "가까이 사는 새 친구"
    },
    "expressions": [
      "कितने बजे"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "तुम कहाँ रहते हो?",
        "gloss": {
          "en": "Where do you live?",
          "ko": "너 어디 살아?"
        }
      },
      {
        "who": "me",
        "text": "मेरा घर लाजपत नगर मार्केट के पास है।",
        "gloss": {
          "en": "My home is near Lajpat Nagar market.",
          "ko": "우리 집은 라즈파트 나가르 시장 근처야."
        },
        "frames": [
          "hi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "अरे, मेरा ऑफ़िस भी वहीं है!",
        "gloss": {
          "en": "Oh, my office is right there too!",
          "ko": "어, 내 사무실도 거기야!"
        }
      },
      {
        "who": "me",
        "text": "सच में? तुम्हारी शिफ़्ट कितने बजे है?",
        "gloss": {
          "en": "Really? What time is your shift?",
          "ko": "진짜? 근무 몇 시야?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "नौ बजे। तुम्हारी?",
        "gloss": {
          "en": "At nine. Yours?",
          "ko": "아홉 시. 너는?"
        }
      },
      {
        "who": "me",
        "text": "मेरी क्लास दस बजे है।",
        "gloss": {
          "en": "My class is at ten.",
          "ko": "내 수업은 열 시야."
        }
      },
      {
        "who": "them",
        "text": "तो कल साथ में मेट्रो लें?",
        "gloss": {
          "en": "Then shall we take the metro together tomorrow?",
          "ko": "그럼 내일 같이 지하철 탈까?"
        }
      },
      {
        "who": "me",
        "text": "हाँ! चलो, साढ़े आठ बजे मिलते हैं।",
        "gloss": {
          "en": "Yes! Let's meet at eight thirty.",
          "ko": "응! 여덟 시 반에 만나자."
        },
        "frames": [
          "hi-f2-08"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the gym",
      "ko": "헬스장에서"
    },
    "expressions": [
      "ज़रूर"
    ],
    "grammar": [
      0,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "तुम रोज़ जिम आते हो?",
        "gloss": {
          "en": "Do you come to the gym every day?",
          "ko": "너 매일 헬스장 와?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं रोज़ एक घंटा कसरत करता हूँ।",
        "gloss": {
          "en": "Yes, I work out for an hour every day.",
          "ko": "응, 매일 한 시간씩 운동해."
        },
        "frames": [
          "hi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "थकते नहीं?",
        "gloss": {
          "en": "Don't you get tired?",
          "ko": "안 힘들어?"
        }
      },
      {
        "who": "me",
        "text": "कभी-कभी। जिम के बाद मैं थोड़ा आराम करता हूँ।",
        "gloss": {
          "en": "Sometimes. After the gym I rest a bit.",
          "ko": "가끔. 운동 끝나면 좀 쉬어."
        },
        "frames": [
          "hi-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "और नाश्ते में क्या खाते हो?",
        "gloss": {
          "en": "And what do you eat for breakfast?",
          "ko": "아침엔 뭐 먹어?"
        }
      },
      {
        "who": "me",
        "text": "मुझे ओट्स बहुत पसंद है।",
        "gloss": {
          "en": "I really like oats.",
          "ko": "오트밀 정말 좋아해."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "कल साथ में दौड़ने चलें?",
        "gloss": {
          "en": "Shall we go running together tomorrow?",
          "ko": "내일 같이 달리기할래?"
        }
      },
      {
        "who": "me",
        "text": "ज़रूर! चलो, सुबह छह बजे मिलते हैं।",
        "gloss": {
          "en": "Sure! Let's meet at six in the morning.",
          "ko": "좋아! 아침 여섯 시에 만나자."
        },
        "frames": [
          "hi-f2-08"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Mom calls: dinner is ready",
      "ko": "엄마 전화: 저녁 다 됐어"
    },
    "expressions": [
      "आज सुबह"
    ],
    "grammar": [
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "बेटा, कहाँ हो?",
        "gloss": {
          "en": "Son, where are you?",
          "ko": "얘야, 어디니?"
        }
      },
      {
        "who": "me",
        "text": "माँ, मैं अभी ऑफ़िस से निकल रहा हूँ।",
        "gloss": {
          "en": "Mom, I'm leaving the office right now.",
          "ko": "엄마, 지금 회사에서 나가고 있어요."
        },
        "frames": [
          "hi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "खाना ठंडा हो रहा है!",
        "gloss": {
          "en": "The food is getting cold!",
          "ko": "밥 식는다!"
        }
      },
      {
        "who": "me",
        "text": "सॉरी माँ, मैं नौ बजे से पहले घर आऊँगा।",
        "gloss": {
          "en": "Sorry, Mom, I'll be home before nine.",
          "ko": "죄송해요 엄마, 아홉 시 전에 집에 갈게요."
        },
        "frames": [
          "hi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "आज सुबह भी नाश्ता नहीं किया!",
        "gloss": {
          "en": "You didn't even eat breakfast this morning!",
          "ko": "오늘 아침도 안 먹었잖아!"
        }
      },
      {
        "who": "me",
        "text": "हाँ, आज सुबह मैं जल्दी में ऑफ़िस गया।",
        "gloss": {
          "en": "Yes, this morning I went to the office in a hurry.",
          "ko": "네, 오늘 아침엔 급하게 회사에 갔어요."
        },
        "frames": [
          "hi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, जल्दी आना।",
        "gloss": {
          "en": "OK, come home soon.",
          "ko": "알았다, 빨리 와."
        }
      },
      {
        "who": "me",
        "text": "हाँ माँ, ठीक है।",
        "gloss": {
          "en": "Yes, Mom, OK.",
          "ko": "네 엄마, 알겠어요."
        }
      }
    ]
  },
  {
    "id": "hi-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Weekend plans with a colleague",
      "ko": "동료와 주말 계획"
    },
    "expressions": [],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "इस वीकेंड क्या करोगे?",
        "gloss": {
          "en": "What will you do this weekend?",
          "ko": "이번 주말에 뭐 할 거야?"
        }
      },
      {
        "who": "me",
        "text": "इस वीकेंड मैं घर की सफ़ाई करूँगा।",
        "gloss": {
          "en": "This weekend I'll clean the house.",
          "ko": "이번 주말엔 집 청소할 거야."
        },
        "frames": [
          "hi-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "बस? बोरिंग!",
        "gloss": {
          "en": "That's all? Boring!",
          "ko": "그게 다야? 지루하다!"
        }
      },
      {
        "who": "me",
        "text": "हाँ, पर मुझे सफ़ाई पसंद है!",
        "gloss": {
          "en": "Yes, but I like cleaning!",
          "ko": "응, 근데 나 청소 좋아해!"
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "सच में? मुझे तो बिल्कुल पसंद नहीं।",
        "gloss": {
          "en": "Really? I don't like it at all.",
          "ko": "진짜? 난 정말 싫은데."
        }
      },
      {
        "who": "me",
        "text": "तो चलो, रविवार को क्रिकेट मैच देखने चलते हैं।",
        "gloss": {
          "en": "Then let's go watch a cricket match on Sunday.",
          "ko": "그럼 일요일에 크리켓 경기 보러 가자."
        },
        "frames": [
          "hi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "बढ़िया! मैच कितने बजे है?",
        "gloss": {
          "en": "Great! What time is the match?",
          "ko": "좋아! 경기 몇 시야?"
        }
      },
      {
        "who": "me",
        "text": "दो बजे। चलो, एक बजे मिलते हैं।",
        "gloss": {
          "en": "At two. Let's meet at one.",
          "ko": "두 시. 한 시에 만나자."
        },
        "frames": [
          "hi-f2-08"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about sleep at a clinic",
      "ko": "병원에서 수면 상담"
    },
    "expressions": [],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "आपको नींद ठीक से आती है?",
        "gloss": {
          "en": "Do you sleep well?",
          "ko": "잠은 잘 주무세요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, मैं रोज़ पाँच बजे उठता हूँ।",
        "gloss": {
          "en": "No, I get up at five every day.",
          "ko": "아니요, 매일 다섯 시에 일어나요."
        },
        "frames": [
          "hi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "इतनी जल्दी? और रात को कितने बजे सोते हैं?",
        "gloss": {
          "en": "So early? And what time do you go to bed?",
          "ko": "그렇게 일찍요? 밤에는 몇 시에 자요?"
        }
      },
      {
        "who": "me",
        "text": "बारह बजे। मुझे जल्दी सोना पसंद नहीं।",
        "gloss": {
          "en": "At twelve. I don't like going to bed early.",
          "ko": "열두 시요. 일찍 자는 걸 안 좋아해요."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "यह ठीक नहीं है। कॉफ़ी पीते हैं?",
        "gloss": {
          "en": "That's not good. Do you drink coffee?",
          "ko": "그건 좋지 않아요. 커피 마셔요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं रोज़ बहुत काम करता हूँ, तो कॉफ़ी पीता हूँ।",
        "gloss": {
          "en": "Yes, I work a lot every day, so I drink coffee.",
          "ko": "네, 매일 일을 많이 해서 커피를 마셔요."
        },
        "frames": [
          "hi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "कॉफ़ी कम कीजिए और रात को फ़ोन मत देखिए।",
        "gloss": {
          "en": "Cut down on coffee, and don't look at your phone at night.",
          "ko": "커피 줄이고 밤엔 휴대폰 보지 마세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, डॉक्टर साहब। धन्यवाद।",
        "gloss": {
          "en": "All right, doctor. Thank you.",
          "ko": "알겠어요, 선생님. 감사합니다."
        }
      }
    ]
  },
  {
    "id": "hi-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying movie tickets",
      "ko": "영화표 사기"
    },
    "expressions": [
      "कितने बजे"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते, कौन-सी फ़िल्म?",
        "gloss": {
          "en": "Hello, which movie?",
          "ko": "안녕하세요, 어떤 영화요?"
        }
      },
      {
        "who": "me",
        "text": "नई कॉमेडी फ़िल्म। अगला शो कितने बजे है?",
        "gloss": {
          "en": "The new comedy. What time is the next show?",
          "ko": "새 코미디 영화요. 다음 상영은 몇 시예요?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "चार बजे और सात बजे।",
        "gloss": {
          "en": "At four and at seven.",
          "ko": "네 시하고 일곱 시요."
        }
      },
      {
        "who": "me",
        "text": "सात बजे वाला। मुझे पीछे की सीट पसंद है।",
        "gloss": {
          "en": "The seven o'clock one. I like seats at the back.",
          "ko": "일곱 시 거요. 저는 뒷자리가 좋아요."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। पॉपकॉर्न भी चाहिए?",
        "gloss": {
          "en": "OK. Would you like popcorn too?",
          "ko": "네. 팝콘도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, एक बड़ा पॉपकॉर्न दीजिए।",
        "gloss": {
          "en": "Yes, one large popcorn, please.",
          "ko": "네, 큰 팝콘 하나 주세요."
        },
        "frames": [
          "hi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "कुल चार सौ रुपये।",
        "gloss": {
          "en": "Four hundred rupees in total.",
          "ko": "모두 사백 루피예요."
        }
      },
      {
        "who": "me",
        "text": "यह लीजिए। धन्यवाद!",
        "gloss": {
          "en": "Here you go. Thank you!",
          "ko": "여기요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "hi-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A morning walk with a neighbor",
      "ko": "이웃과 아침 산책"
    },
    "expressions": [
      "कल मिलते हैं",
      "बहुत अच्छा",
      "आज सुबह",
      "ज़रूर"
    ],
    "grammar": [
      0,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते! आज बहुत जल्दी उठ गए?",
        "gloss": {
          "en": "Hello! Up very early today?",
          "ko": "안녕하세요! 오늘 아주 일찍 일어나셨네요?"
        }
      },
      {
        "who": "me",
        "text": "जी, आज सुबह मैं दौड़ने गया।",
        "gloss": {
          "en": "Yes, this morning I went for a run.",
          "ko": "네, 오늘 아침에 달리러 나갔어요."
        },
        "frames": [
          "hi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "वाह! किस पार्क में?",
        "gloss": {
          "en": "Wow! Which park?",
          "ko": "와! 어느 공원이요?"
        }
      },
      {
        "who": "me",
        "text": "झील वाले पार्क में। मेरा घर झील के पास है।",
        "gloss": {
          "en": "The park by the lake. My home is near the lake.",
          "ko": "호수 옆 공원이요. 우리 집이 호수 근처예요."
        },
        "frames": [
          "hi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा! कल मैं भी आऊँगी।",
        "gloss": {
          "en": "Nice! I'll come too tomorrow.",
          "ko": "좋네요! 내일은 저도 갈게요."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! मैं रोज़ साढ़े पाँच बजे उठता हूँ।",
        "gloss": {
          "en": "Great! I get up at five thirty every day.",
          "ko": "좋아요! 저는 매일 다섯 시 반에 일어나요."
        },
        "frames": [
          "hi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "इतनी जल्दी! ठीक है, कल पार्क के गेट पर मिलते हैं।",
        "gloss": {
          "en": "So early! OK, let's meet at the park gate tomorrow.",
          "ko": "그렇게 일찍요! 좋아요, 내일 공원 입구에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "ज़रूर, कल मिलते हैं!",
        "gloss": {
          "en": "Sure, see you tomorrow!",
          "ko": "그럼요, 내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "hi-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lunch with coworkers",
      "ko": "동료들과 점심"
    },
    "expressions": [
      "बहुत अच्छा"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "लंच का टाइम हो गया!",
        "gloss": {
          "en": "It's lunchtime!",
          "ko": "점심시간이다!"
        }
      },
      {
        "who": "me",
        "text": "चलो, कैंटीन चलते हैं।",
        "gloss": {
          "en": "Let's go to the canteen.",
          "ko": "구내식당 가자."
        },
        "frames": [
          "hi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "आज कैंटीन में राजमा है।",
        "gloss": {
          "en": "There's rajma in the canteen today.",
          "ko": "오늘 구내식당에 라즈마 나와."
        }
      },
      {
        "who": "me",
        "text": "अरे, मुझे राजमा पसंद नहीं।",
        "gloss": {
          "en": "Oh, I don't like rajma.",
          "ko": "아, 나 라즈마 안 좋아해."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "तो बाहर चलें? नया कैफ़े खुला है।",
        "gloss": {
          "en": "Then shall we go out? A new café has opened.",
          "ko": "그럼 밖에 나갈까? 새 카페 생겼어."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा! मुझे सैंडविच पसंद है।",
        "gloss": {
          "en": "Great! I like sandwiches.",
          "ko": "좋아! 나 샌드위치 좋아해."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "पर मीटिंग दो बजे है।",
        "gloss": {
          "en": "But the meeting is at two.",
          "ko": "근데 회의가 두 시야."
        }
      },
      {
        "who": "me",
        "text": "कोई बात नहीं, चलो, जल्दी चलते हैं।",
        "gloss": {
          "en": "No problem, let's go quickly.",
          "ko": "괜찮아, 빨리 가자."
        },
        "frames": [
          "hi-f2-14"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "The day after a party",
      "ko": "파티 다음 날"
    },
    "expressions": [
      "मज़ा आया",
      "थक गया",
      "आज सुबह"
    ],
    "grammar": [
      0,
      2,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "कल की पार्टी कैसी थी?",
        "gloss": {
          "en": "How was last night's party?",
          "ko": "어제 파티 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "बहुत मज़ा आया, पर मैं थक गया।",
        "gloss": {
          "en": "It was great fun, but I'm worn out.",
          "ko": "정말 재밌었는데 피곤해."
        }
      },
      {
        "who": "them",
        "text": "तुम कितने बजे घर आए?",
        "gloss": {
          "en": "What time did you get home?",
          "ko": "몇 시에 집에 왔어?"
        }
      },
      {
        "who": "me",
        "text": "रात दो बजे। आज सुबह मैं देर से ऑफ़िस गया।",
        "gloss": {
          "en": "At two at night. This morning I went to the office late.",
          "ko": "새벽 두 시. 오늘 아침에 회사에 늦게 갔어."
        },
        "frames": [
          "hi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "अरे! शाम को आम तौर पर क्या करते हो?",
        "gloss": {
          "en": "Oh no! What do you usually do in the evening?",
          "ko": "저런! 저녁엔 보통 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "काम के बाद मैं थोड़ा आराम करता हूँ।",
        "gloss": {
          "en": "After work I rest a bit.",
          "ko": "일 끝나면 좀 쉬어."
        },
        "frames": [
          "hi-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "आज जल्दी सो जाना!",
        "gloss": {
          "en": "Go to bed early today!",
          "ko": "오늘은 일찍 자!"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं दस बजे से पहले घर आऊँगा।",
        "gloss": {
          "en": "Yes, I'll be home before ten.",
          "ko": "응, 열 시 전에 집에 들어갈게."
        },
        "frames": [
          "hi-f2-11"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Waiting at a bus stand",
      "ko": "버스 정류장에서 기다리기"
    },
    "expressions": [
      "कितने बजे"
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
        "text": "माफ़ कीजिए, आप भी आगरा जा रहे हैं?",
        "gloss": {
          "en": "Excuse me, are you going to Agra too?",
          "ko": "실례지만, 아그라 가세요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, कल मैं आगरा जाऊँगा। आज मैं मथुरा जा रहा हूँ।",
        "gloss": {
          "en": "No, I'll go to Agra tomorrow. Today I'm going to Mathura.",
          "ko": "아니요, 아그라는 내일 가요. 오늘은 마투라에 가요."
        },
        "frames": [
          "hi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "मथुरा की बस यहीं से जाती है।",
        "gloss": {
          "en": "The Mathura bus leaves from right here.",
          "ko": "마투라행 버스는 바로 여기서 출발해요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद! अगली बस कितने बजे है?",
        "gloss": {
          "en": "Thanks! What time is the next bus?",
          "ko": "고마워요! 다음 버스는 몇 시예요?"
        },
        "frames": [
          "hi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "साढ़े दस बजे। अभी दस बजे हैं।",
        "gloss": {
          "en": "At ten thirty. It's ten now.",
          "ko": "열 시 반이요. 지금 열 시예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। वहाँ चाय मिलती है?",
        "gloss": {
          "en": "OK. Can I get tea over there?",
          "ko": "알겠어요. 저기서 차 팔아요?"
        }
      },
      {
        "who": "them",
        "text": "हाँ, वह दुकान अच्छी है। मुझे वहाँ की अदरक वाली चाय पसंद है।",
        "gloss": {
          "en": "Yes, that shop is good. I like their ginger tea.",
          "ko": "네, 저 가게 괜찮아요. 거기 생강 차이가 좋아요."
        }
      },
      {
        "who": "me",
        "text": "मुझे भी अदरक वाली चाय पसंद है!",
        "gloss": {
          "en": "I like ginger tea too!",
          "ko": "저도 생강 차이 좋아해요!"
        },
        "frames": [
          "hi-f2-06"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Shopping for a shirt",
      "ko": "셔츠 사러 옷 가게에서"
    },
    "expressions": [],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "यह नीली कमीज़ कैसी है?",
        "gloss": {
          "en": "How about this blue shirt?",
          "ko": "이 파란 셔츠 어때요?"
        }
      },
      {
        "who": "me",
        "text": "अच्छी है, पर मुझे नीला रंग पसंद नहीं।",
        "gloss": {
          "en": "It's nice, but I don't like blue.",
          "ko": "괜찮은데 저는 파란색을 안 좋아해요."
        },
        "frames": [
          "hi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "तो यह सफ़ेद कमीज़ देखिए।",
        "gloss": {
          "en": "Then take a look at this white shirt.",
          "ko": "그럼 이 흰 셔츠 보세요."
        }
      },
      {
        "who": "me",
        "text": "हाँ, मुझे सफ़ेद रंग पसंद है।",
        "gloss": {
          "en": "Yes, I like white.",
          "ko": "네, 흰색 좋아요."
        },
        "frames": [
          "hi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "आपका साइज़ क्या है?",
        "gloss": {
          "en": "What's your size?",
          "ko": "사이즈가 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "मीडियम। एक बड़ा साइज़ भी ले आइए।",
        "gloss": {
          "en": "Medium. Please bring a large too.",
          "ko": "미디엄이요. 라지 사이즈도 갖다주세요."
        },
        "frames": [
          "hi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, एक मिनट।",
        "gloss": {
          "en": "OK, one minute.",
          "ko": "네, 잠시만요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद। ट्रायल रूम कहाँ है?",
        "gloss": {
          "en": "Thanks. Where is the fitting room?",
          "ko": "고마워요. 탈의실이 어디예요?"
        },
        "frames": [
          "hi-f1-04"
        ]
      }
    ]
  },
  {
    "id": "hi-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A video call with an old friend",
      "ko": "오랜 친구와 영상통화"
    },
    "expressions": [
      "सब ठीक है",
      "मज़ा आया",
      "बड़ा भाई",
      "पिछले हफ़्ते"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "हाय! बहुत दिन हो गए! क्या हाल है?",
        "gloss": {
          "en": "Hi! It's been ages! How are you?",
          "ko": "안녕! 오랜만이다! 잘 지내?"
        }
      },
      {
        "who": "me",
        "text": "सब ठीक है! मैं अभी चाय पी रहा हूँ।",
        "gloss": {
          "en": "All good! I'm having tea right now.",
          "ko": "다 좋아! 지금 차 마시고 있어."
        },
        "frames": [
          "hi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "और तुम्हारा भाई? अभी भी सियोल में?",
        "gloss": {
          "en": "And your brother? Still in Seoul?",
          "ko": "너희 형은? 아직 서울에 있어?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, अब मेरा बड़ा भाई कनाडा में रहता है।",
        "gloss": {
          "en": "No, my older brother lives in Canada now.",
          "ko": "아니, 이제 형은 캐나다에 살아."
        },
        "frames": [
          "hi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "वाह! तुम कभी वहाँ गए?",
        "gloss": {
          "en": "Wow! Have you ever been there?",
          "ko": "와! 거기 가 본 적 있어?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, पिछले हफ़्ते मैं वहाँ गया।",
        "gloss": {
          "en": "Yes, I went there last week.",
          "ko": "응, 지난주에 갔었어."
        },
        "frames": [
          "hi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "कैसा लगा?",
        "gloss": {
          "en": "How was it?",
          "ko": "어땠어?"
        }
      },
      {
        "who": "me",
        "text": "बहुत ठंड थी, पर मज़ा आया!",
        "gloss": {
          "en": "It was very cold, but it was fun!",
          "ko": "엄청 추웠는데 재밌었어!"
        }
      }
    ]
  },
  {
    "id": "hi-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Going to the Diwali fair together",
      "ko": "디왈리 장터에 같이 가기"
    },
    "expressions": [
      "कल मिलते हैं",
      "ज़रूर"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "कल दिवाली मेला है! कोई प्लान है?",
        "gloss": {
          "en": "The Diwali fair is tomorrow! Any plans?",
          "ko": "내일 디왈리 장이 열려! 계획 있어?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, कल मैं मेले में जाऊँगा।",
        "gloss": {
          "en": "Yes, tomorrow I'll go to the fair.",
          "ko": "응, 내일 장에 갈 거야."
        },
        "frames": [
          "hi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "मैं भी! साथ चलें?",
        "gloss": {
          "en": "Me too! Shall we go together?",
          "ko": "나도! 같이 갈래?"
        }
      },
      {
        "who": "me",
        "text": "ज़रूर! चलो, चार बजे मिलते हैं।",
        "gloss": {
          "en": "Sure! Let's meet at four.",
          "ko": "좋아! 네 시에 만나자."
        },
        "frames": [
          "hi-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "रात को कितने बजे तक रहोगे?",
        "gloss": {
          "en": "How late will you stay at night?",
          "ko": "밤에 몇 시까지 있을 거야?"
        }
      },
      {
        "who": "me",
        "text": "ज़्यादा देर नहीं। मैं ग्यारह बजे से पहले घर आऊँगा।",
        "gloss": {
          "en": "Not too late. I'll be home before eleven.",
          "ko": "너무 늦게는 말고. 열한 시 전에 집에 올 거야."
        },
        "frames": [
          "hi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। जल्दी आना!",
        "gloss": {
          "en": "OK. Come early!",
          "ko": "알았어. 일찍 와!"
        }
      },
      {
        "who": "me",
        "text": "हाँ, कल मिलते हैं!",
        "gloss": {
          "en": "Yes, see you tomorrow!",
          "ko": "응, 내일 봐!"
        }
      }
    ]
  },
  {
    "id": "hi-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to a meeting",
      "ko": "회의에 늦게 도착"
    },
    "expressions": [
      "देर हो गई",
      "उम्मीद है"
    ],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "अरे, आप आ गए! मीटिंग शुरू हो गई है।",
        "gloss": {
          "en": "Oh, you're here! The meeting has already started.",
          "ko": "아, 오셨네요! 회의 벌써 시작했어요."
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, मेट्रो रुक गई थी, इसलिए देर हो गई।",
        "gloss": {
          "en": "Sorry, the metro got stuck, so I'm late.",
          "ko": "죄송해요, 지하철이 멈춰서 늦었어요."
        },
        "frames": [
          "hi-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "कोई बात नहीं। हम बजट पर बात कर रहे थे।",
        "gloss": {
          "en": "No problem. We were talking about the budget.",
          "ko": "괜찮아요. 예산 얘기하고 있었어요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। मैं नोट्स बाद में पढ़ लूँगा।",
        "gloss": {
          "en": "OK. I'll read the notes later.",
          "ko": "알겠어요. 회의록은 나중에 읽어 볼게요."
        },
        "frames": [
          "hi-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा। क्लाइंट को रिपोर्ट शुक्रवार तक चाहिए।",
        "gloss": {
          "en": "Good. The client needs the report by Friday.",
          "ko": "네. 고객이 금요일까지 보고서를 원해요."
        }
      },
      {
        "who": "me",
        "text": "कोई दिक़्क़त नहीं। मैं गुरुवार तक रिपोर्ट भेज सकता हूँ।",
        "gloss": {
          "en": "No problem. I can send the report by Thursday.",
          "ko": "문제없어요. 목요일까지 보고서 보낼 수 있어요."
        },
        "frames": [
          "hi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "बहुत बढ़िया।",
        "gloss": {
          "en": "Excellent.",
          "ko": "아주 좋아요."
        }
      },
      {
        "who": "me",
        "text": "उम्मीद है कि क्लाइंट को रिपोर्ट पसंद आएगी।",
        "gloss": {
          "en": "I hope the client likes the report.",
          "ko": "고객이 보고서를 마음에 들어 하면 좋겠어요."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the landlord about a broken fan",
      "ko": "집주인에게 선풍기 고장 전화"
    },
    "expressions": [
      "ख़राब हो गया"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "हैलो, बोलिए। क्या हुआ?",
        "gloss": {
          "en": "Hello, go ahead. What happened?",
          "ko": "여보세요, 말씀하세요. 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते, मेरे कमरे का पंखा ख़राब हो गया।",
        "gloss": {
          "en": "Hello, the fan in my room has broken down.",
          "ko": "안녕하세요, 제 방 선풍기가 고장 났어요."
        },
        "frames": [
          "hi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "अरे! कब से?",
        "gloss": {
          "en": "Oh no! Since when?",
          "ko": "저런! 언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "कल रात से। क्या आप आज किसी को भेज सकते हैं?",
        "gloss": {
          "en": "Since last night. Could you send someone today?",
          "ko": "어젯밤부터요. 오늘 누구 좀 보내 주실 수 있어요?"
        },
        "frames": [
          "hi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "मिस्त्री शाम को आएगा।",
        "gloss": {
          "en": "The repairman will come in the evening.",
          "ko": "수리 기사가 저녁에 갈 거예요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। अगर वह देर से आए, तो मुझे बताइए।",
        "gloss": {
          "en": "OK. If he's going to be late, let me know.",
          "ko": "알겠어요. 늦게 오면 알려 주세요."
        },
        "frames": [
          "hi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "ज़रूर। और कोई दिक़्क़त है?",
        "gloss": {
          "en": "Sure. Any other problem?",
          "ko": "물론이죠. 다른 문제 있어요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, बाक़ी सब ठीक है। धन्यवाद!",
        "gloss": {
          "en": "No, everything else is fine. Thank you!",
          "ko": "아니요, 나머지는 다 괜찮아요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "hi-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a movie with a friend",
      "ko": "친구와 영화 이야기"
    },
    "expressions": [
      "मुझे लगता है",
      "मैं सहमत नहीं हूँ",
      "मुझे तो पसंद आई",
      "हो सकता है"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "तुमने कल क्या किया?",
        "gloss": {
          "en": "What did you do yesterday?",
          "ko": "어제 뭐 했어?"
        }
      },
      {
        "who": "me",
        "text": "मैंने कल वह नई जासूसी फ़िल्म देखी।",
        "gloss": {
          "en": "Yesterday I watched that new detective movie.",
          "ko": "어제 그 새 탐정 영화 봤어."
        },
        "frames": [
          "hi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा? मैंने भी देखी। बहुत लंबी और बोरिंग थी।",
        "gloss": {
          "en": "Oh? I saw it too. It was really long and boring.",
          "ko": "그래? 나도 봤어. 너무 길고 지루했어."
        }
      },
      {
        "who": "me",
        "text": "मैं सहमत नहीं हूँ, मुझे तो पसंद आई।",
        "gloss": {
          "en": "I don't agree, I actually liked it.",
          "ko": "난 동의 못 해, 난 좋던데."
        },
        "frames": [
          "hi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "सच में? कहानी बहुत धीमी थी।",
        "gloss": {
          "en": "Really? The story was so slow.",
          "ko": "진짜? 이야기가 너무 느렸잖아."
        }
      },
      {
        "who": "me",
        "text": "मुझे लगता है कि आख़िरी आधा घंटा बहुत अच्छा था।",
        "gloss": {
          "en": "I think the last half hour was really good.",
          "ko": "내 생각엔 마지막 삼십 분이 정말 좋았어."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, अंत अच्छा था।",
        "gloss": {
          "en": "Yeah, the ending was good.",
          "ko": "응, 결말은 좋았어."
        }
      },
      {
        "who": "me",
        "text": "हो सकता है कि इसका दूसरा भाग भी आए।",
        "gloss": {
          "en": "Maybe there'll be a sequel too.",
          "ko": "어쩌면 속편도 나올지 몰라."
        },
        "frames": [
          "hi-f3-18"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a picnic",
      "ko": "소풍 계획 세우기"
    },
    "expressions": [
      "मेरे ख़याल से",
      "हो सकता है"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "रविवार को पिकनिक पक्की है न?",
        "gloss": {
          "en": "The picnic on Sunday is on, right?",
          "ko": "일요일 소풍 확정이지?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, पर मौसम का पता नहीं। मेरे ख़याल से हमें छाते ले जाने चाहिए।",
        "gloss": {
          "en": "Yes, but who knows about the weather. In my view, we should take umbrellas.",
          "ko": "응, 근데 날씨는 모르겠어. 내 생각엔 우산을 챙겨야 할 것 같아."
        },
        "frames": [
          "hi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "अगर सच में बारिश हुई तो?",
        "gloss": {
          "en": "And if it really rains?",
          "ko": "진짜 비 오면?"
        }
      },
      {
        "who": "me",
        "text": "अगर बारिश हुई, तो हम मेरे घर पर खाना खाएँगे।",
        "gloss": {
          "en": "If it rains, we'll eat at my place.",
          "ko": "비가 오면 우리 집에서 먹자."
        },
        "frames": [
          "hi-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा आइडिया! मैं समोसे ले आऊँगी।",
        "gloss": {
          "en": "Good idea! I'll bring samosas.",
          "ko": "좋은 생각이야! 내가 사모사 가져갈게."
        }
      },
      {
        "who": "me",
        "text": "बढ़िया। मैं ड्रिंक्स ले लूँगा।",
        "gloss": {
          "en": "Great. I'll get the drinks.",
          "ko": "좋아. 음료는 내가 챙길게."
        },
        "frames": [
          "hi-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "और कौन-कौन आ रहा है?",
        "gloss": {
          "en": "And who else is coming?",
          "ko": "그리고 누구누구 와?"
        }
      },
      {
        "who": "me",
        "text": "पता नहीं, हो सकता है कि रवि भी आए।",
        "gloss": {
          "en": "Not sure, maybe Ravi will come too.",
          "ko": "모르겠어, 어쩌면 라비도 올지 몰라."
        },
        "frames": [
          "hi-f3-18"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "At the doctor's with a fever",
      "ko": "열이 나서 병원에"
    },
    "expressions": [
      "उम्मीद है"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "आपको तीन दिन से बुख़ार है?",
        "gloss": {
          "en": "You've had a fever for three days?",
          "ko": "사흘째 열이 나요?"
        }
      },
      {
        "who": "me",
        "text": "जी हाँ। क्या मुझे कोई टेस्ट करवाना चाहिए?",
        "gloss": {
          "en": "Yes. Should I get a test done?",
          "ko": "네. 검사를 받아야 할까요?"
        },
        "frames": [
          "hi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, ख़ून की जाँच करवा लीजिए।",
        "gloss": {
          "en": "Yes, get a blood test done.",
          "ko": "네, 피검사 받으세요."
        }
      },
      {
        "who": "me",
        "text": "क्या मुझे कल ऑफ़िस जाना चाहिए?",
        "gloss": {
          "en": "Should I go to the office tomorrow?",
          "ko": "내일 출근해야 할까요?"
        },
        "frames": [
          "hi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "नहीं, दो दिन घर पर आराम कीजिए।",
        "gloss": {
          "en": "No, rest at home for two days.",
          "ko": "아니요, 이틀은 집에서 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, मैं आज बॉस को बता दूँगा।",
        "gloss": {
          "en": "OK, I'll tell my boss today.",
          "ko": "알겠어요, 오늘 상사에게 말할게요."
        }
      },
      {
        "who": "them",
        "text": "और अगर कोई दिक़्क़त हो, तो फ़ोन कीजिए।",
        "gloss": {
          "en": "And if there's any problem, give me a call.",
          "ko": "그리고 문제 있으면 전화하세요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद, डॉक्टर साहब। उम्मीद है कि मैं जल्दी ठीक हो जाऊँगा।",
        "gloss": {
          "en": "Thank you, doctor. I hope I'll get better soon.",
          "ko": "감사합니다, 선생님. 빨리 나았으면 좋겠어요."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A coworker with a headache",
      "ko": "머리 아픈 동료"
    },
    "expressions": [
      "मुझे लगता है",
      "क्या हुआ",
      "मैं देख लूँगा"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "आज सुबह से मेरे सिर में बहुत दर्द है।",
        "gloss": {
          "en": "I've had a bad headache since this morning.",
          "ko": "오늘 아침부터 머리가 너무 아파요."
        }
      },
      {
        "who": "me",
        "text": "क्या हुआ? कल रात आप ठीक से सोए?",
        "gloss": {
          "en": "What happened? Did you sleep well last night?",
          "ko": "무슨 일이에요? 어젯밤에 잘 잤어요?"
        }
      },
      {
        "who": "them",
        "text": "नहीं, मैं देर तक रिपोर्ट लिख रहा था।",
        "gloss": {
          "en": "No, I was writing a report until late.",
          "ko": "아니요, 늦게까지 보고서 쓰고 있었어요."
        }
      },
      {
        "who": "me",
        "text": "मुझे लगता है कि आप बहुत थके हुए हैं।",
        "gloss": {
          "en": "I think you're really tired.",
          "ko": "많이 피곤하신 것 같아요."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, शायद। पर आज बहुत काम है।",
        "gloss": {
          "en": "Yes, maybe. But there's a lot of work today.",
          "ko": "네, 아마도요. 근데 오늘 일이 많아요."
        }
      },
      {
        "who": "me",
        "text": "आपको आज जल्दी घर जाना चाहिए।",
        "gloss": {
          "en": "You should go home early today.",
          "ko": "오늘은 일찍 집에 가셔야겠어요."
        },
        "frames": [
          "hi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "और यह रिपोर्ट?",
        "gloss": {
          "en": "And this report?",
          "ko": "그럼 이 보고서는요?"
        }
      },
      {
        "who": "me",
        "text": "चिंता मत कीजिए, मैं देख लूँगा।",
        "gloss": {
          "en": "Don't worry, I'll take care of it.",
          "ko": "걱정 마세요, 제가 처리할게요."
        },
        "frames": [
          "hi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling customer care about a return",
      "ko": "고객센터에 반품 문의"
    },
    "expressions": [
      "ख़राब हो गया",
      "उम्मीद है",
      "पैसे वापस मिलेंगे"
    ],
    "grammar": [
      0,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "कस्टमर केयर, बताइए, मैं आपकी क्या मदद कर सकती हूँ?",
        "gloss": {
          "en": "Customer care, how can I help you?",
          "ko": "고객센터입니다, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "नमस्ते, मैंने पिछले हफ़्ते एक मिक्सर ख़रीदा।",
        "gloss": {
          "en": "Hello, I bought a mixer last week.",
          "ko": "안녕하세요, 지난주에 믹서기를 샀어요."
        },
        "frames": [
          "hi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "जी, क्या दिक़्क़त है?",
        "gloss": {
          "en": "Yes, what's the problem?",
          "ko": "네, 무슨 문제가 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "वह पहले ही दिन ख़राब हो गया।",
        "gloss": {
          "en": "It broke down on the very first day.",
          "ko": "첫날 바로 고장 났어요."
        },
        "frames": [
          "hi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "माफ़ कीजिए। आप उसे वापस कर सकते हैं।",
        "gloss": {
          "en": "We're sorry. You can return it.",
          "ko": "죄송합니다. 반품하실 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "क्या मुझे डिब्बा भी भेजना चाहिए?",
        "gloss": {
          "en": "Should I send the box too?",
          "ko": "상자도 보내야 하나요?"
        },
        "frames": [
          "hi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, डिब्बे के साथ भेजिए।",
        "gloss": {
          "en": "Yes, send it with the box.",
          "ko": "네, 상자째 보내 주세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। उम्मीद है कि जल्दी पैसे वापस मिलेंगे।",
        "gloss": {
          "en": "OK. I hope I get my money back soon.",
          "ko": "네. 돈이 빨리 환불되면 좋겠어요."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Missed calls from a friend",
      "ko": "친구의 부재중 전화"
    },
    "expressions": [],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "मैंने तुम्हें कल तीन बार फ़ोन किया!",
        "gloss": {
          "en": "I called you three times yesterday!",
          "ko": "어제 너한테 세 번이나 전화했어!"
        }
      },
      {
        "who": "me",
        "text": "सॉरी! जब फ़ोन आया, मैं नहा रहा था।",
        "gloss": {
          "en": "Sorry! When you called, I was in the shower.",
          "ko": "미안! 전화 왔을 때 샤워하고 있었어."
        },
        "frames": [
          "hi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "और दूसरी बार?",
        "gloss": {
          "en": "And the second time?",
          "ko": "그럼 두 번째는?"
        }
      },
      {
        "who": "me",
        "text": "उस वक़्त मैं मेट्रो में था, नेटवर्क नहीं था।",
        "gloss": {
          "en": "At that time I was in the metro; there was no signal.",
          "ko": "그때는 지하철 안이라 신호가 없었어."
        }
      },
      {
        "who": "them",
        "text": "ठीक है। असल में मुझे तुम्हारी मदद चाहिए।",
        "gloss": {
          "en": "OK. Actually, I need your help.",
          "ko": "알았어. 사실 네 도움이 필요해."
        }
      },
      {
        "who": "me",
        "text": "हाँ, बोलो। मैं क्या कर सकता हूँ?",
        "gloss": {
          "en": "Sure, tell me. What can I do?",
          "ko": "응, 말해. 내가 뭘 해 줄까?"
        },
        "frames": [
          "hi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "कल मुझे नया फ़्लैट देखना है। साथ चलोगे?",
        "gloss": {
          "en": "Tomorrow I have to see a new flat. Will you come along?",
          "ko": "내일 새 집 보러 가야 해. 같이 갈래?"
        }
      },
      {
        "who": "me",
        "text": "ज़रूर। मैं दस बजे तक आ सकता हूँ।",
        "gloss": {
          "en": "Sure. I can come by ten.",
          "ko": "물론이지. 열 시까지 갈 수 있어."
        },
        "frames": [
          "hi-f3-04"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Small talk about city traffic",
      "ko": "도시 교통 이야기"
    },
    "expressions": [
      "मेरे ख़याल से",
      "आप सही कह रहे हैं",
      "सच में",
      "हो सकता है"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "इस शहर में ट्रैफ़िक बहुत बढ़ गया है।",
        "gloss": {
          "en": "Traffic in this city has really gotten worse.",
          "ko": "이 도시 교통이 정말 심해졌어요."
        }
      },
      {
        "who": "me",
        "text": "आप सही कह रहे हैं, ऑफ़िस पहुँचने में एक घंटा लगता है।",
        "gloss": {
          "en": "You're right, it takes an hour to get to the office.",
          "ko": "맞아요, 회사까지 한 시간 걸려요."
        },
        "frames": [
          "hi-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "मेट्रो से जाइए न।",
        "gloss": {
          "en": "Why not take the metro?",
          "ko": "지하철로 가세요."
        }
      },
      {
        "who": "me",
        "text": "मेरे ख़याल से मेट्रो में भी बहुत भीड़ होती है।",
        "gloss": {
          "en": "In my view, the metro is very crowded too.",
          "ko": "제 생각엔 지하철도 많이 붐벼요."
        },
        "frames": [
          "hi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, पर वह जल्दी पहुँचाती है।",
        "gloss": {
          "en": "Yes, but it gets you there fast.",
          "ko": "네, 그래도 빨리 가잖아요."
        }
      },
      {
        "who": "me",
        "text": "यह भी सही है। हो सकता है कि मैं साइकिल से जाऊँ।",
        "gloss": {
          "en": "That's true too. Maybe I'll go by bicycle.",
          "ko": "그것도 맞네요. 어쩌면 자전거로 다닐지도 몰라요."
        },
        "frames": [
          "hi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "साइकिल? इस गर्मी में?",
        "gloss": {
          "en": "A bicycle? In this heat?",
          "ko": "자전거요? 이 더위에요?"
        }
      },
      {
        "who": "me",
        "text": "सच में, यह अच्छा आइडिया नहीं है!",
        "gloss": {
          "en": "True, that's not a good idea!",
          "ko": "정말, 좋은 생각은 아니네요!"
        }
      }
    ]
  },
  {
    "id": "hi-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Checking a hotel booking by phone",
      "ko": "전화로 호텔 예약 확인"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "नमस्ते, होटल सनराइज़। बताइए।",
        "gloss": {
          "en": "Hello, Hotel Sunrise. How can I help?",
          "ko": "안녕하세요, 선라이즈 호텔입니다. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "नमस्ते। मैंने ऑनलाइन कमरा बुक किया था, पर ईमेल नहीं आया।",
        "gloss": {
          "en": "Hello. I booked a room online, but I didn't get an email.",
          "ko": "안녕하세요. 온라인으로 방을 예약했는데 이메일이 안 왔어요."
        }
      },
      {
        "who": "them",
        "text": "कोई बात नहीं। आपकी बुकिंग किस तारीख़ की है?",
        "gloss": {
          "en": "No problem. What date is your booking for?",
          "ko": "괜찮아요. 며칠 예약이세요?"
        }
      },
      {
        "who": "me",
        "text": "अगले शुक्रवार की। क्या आप एक बार चेक कर सकते हैं?",
        "gloss": {
          "en": "For next Friday. Could you check, please?",
          "ko": "다음 주 금요일이요. 한번 확인해 주시겠어요?"
        },
        "frames": [
          "hi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, बुकिंग है। पर चेक-इन दो बजे के बाद है।",
        "gloss": {
          "en": "Yes, the booking is there. But check-in is after two.",
          "ko": "네, 예약 있어요. 그런데 체크인은 두 시 이후예요."
        }
      },
      {
        "who": "me",
        "text": "मेरी फ़्लाइट सुबह आती है। क्या आप मेरा बैग रख सकते हैं?",
        "gloss": {
          "en": "My flight arrives in the morning. Could you keep my bag?",
          "ko": "비행기가 아침에 도착해요. 짐 좀 맡아 주실 수 있어요?"
        },
        "frames": [
          "hi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "ज़रूर, कोई दिक़्क़त नहीं।",
        "gloss": {
          "en": "Of course, no problem.",
          "ko": "물론이죠, 문제없어요."
        }
      },
      {
        "who": "me",
        "text": "धन्यवाद। अगर कमरा जल्दी तैयार हो, तो मुझे बताइए।",
        "gloss": {
          "en": "Thank you. If the room is ready early, let me know.",
          "ko": "고마워요. 방이 일찍 준비되면 알려 주세요."
        },
        "frames": [
          "hi-f3-10"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a birthday gift for Mom",
      "ko": "엄마 생신 선물 고르기"
    },
    "expressions": [
      "मैं सहमत नहीं हूँ"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "माँ के जन्मदिन के लिए क्या लें?",
        "gloss": {
          "en": "What should we get for Mom's birthday?",
          "ko": "엄마 생신 선물 뭐 살까?"
        }
      },
      {
        "who": "me",
        "text": "मैंने कल बाज़ार में एक सुंदर साड़ी देखी।",
        "gloss": {
          "en": "Yesterday I saw a beautiful sari at the market.",
          "ko": "어제 시장에서 예쁜 사리를 봤어."
        },
        "frames": [
          "hi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "साड़ी? माँ के पास बहुत साड़ियाँ हैं।",
        "gloss": {
          "en": "A sari? Mom has lots of saris.",
          "ko": "사리? 엄마는 사리가 많잖아."
        }
      },
      {
        "who": "me",
        "text": "मैं सहमत नहीं हूँ, यह रंग उनके पास नहीं है।",
        "gloss": {
          "en": "I don't agree, she doesn't have this color.",
          "ko": "그건 아니야, 이 색은 없으셔."
        },
        "frames": [
          "hi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है, पर महँगी तो नहीं?",
        "gloss": {
          "en": "OK, but isn't it expensive?",
          "ko": "알았어, 근데 비싸지 않아?"
        }
      },
      {
        "who": "me",
        "text": "ज़्यादा नहीं। हम दोनों आधा-आधा दे सकते हैं।",
        "gloss": {
          "en": "Not really. We can each pay half.",
          "ko": "별로 안 비싸. 우리 둘이 반씩 내면 돼."
        }
      },
      {
        "who": "them",
        "text": "ठीक है। तुम कल ख़रीद लोगे?",
        "gloss": {
          "en": "OK. Will you buy it tomorrow?",
          "ko": "좋아. 내일 네가 살래?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं कल सुबह ख़रीद लूँगा।",
        "gloss": {
          "en": "Yes, I'll buy it tomorrow morning.",
          "ko": "응, 내일 아침에 내가 살게."
        },
        "frames": [
          "hi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Laptop trouble at the IT desk",
      "ko": "IT 데스크에 노트북 고장 신고"
    },
    "expressions": [
      "ख़राब हो गया"
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
        "text": "आईटी डेस्क। क्या दिक़्क़त है?",
        "gloss": {
          "en": "IT desk. What's the problem?",
          "ko": "IT 데스크입니다. 무슨 문제예요?"
        }
      },
      {
        "who": "me",
        "text": "मेरा लैपटॉप ख़राब हो गया। स्क्रीन काली है।",
        "gloss": {
          "en": "My laptop has broken down. The screen is black.",
          "ko": "노트북이 고장 났어요. 화면이 까매요."
        },
        "frames": [
          "hi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "क्या आपने उसे चार्ज किया था?",
        "gloss": {
          "en": "Had you charged it?",
          "ko": "충전은 해 두셨어요?"
        }
      },
      {
        "who": "me",
        "text": "हाँ। जब फ़ोन आया, मैं उस पर काम कर रहा था, फिर वह अचानक बंद हो गया।",
        "gloss": {
          "en": "Yes. When the phone rang, I was working on it, and then it suddenly shut off.",
          "ko": "네. 전화 왔을 때 그걸로 일하고 있었는데 갑자기 꺼졌어요."
        },
        "frames": [
          "hi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "अच्छा। हो सकता है कि बैटरी ख़राब हो।",
        "gloss": {
          "en": "I see. Maybe the battery is faulty.",
          "ko": "그렇군요. 배터리가 문제일 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "क्या मुझे नया लैपटॉप लेना चाहिए?",
        "gloss": {
          "en": "Should I get a new laptop?",
          "ko": "새 노트북을 받아야 할까요?"
        },
        "frames": [
          "hi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "अभी नहीं। आज इसे यहाँ छोड़ दीजिए।",
        "gloss": {
          "en": "Not yet. Leave it here today.",
          "ko": "아직은 아니에요. 오늘은 여기 두고 가세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। अगर यह आज ठीक हो जाए, तो मुझे बताइए।",
        "gloss": {
          "en": "OK. If it gets fixed today, let me know.",
          "ko": "알겠어요. 오늘 고쳐지면 알려 주세요."
        },
        "frames": [
          "hi-f3-10"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a trip to the hills",
      "ko": "산으로 여행 계획"
    },
    "expressions": [
      "मुझे लगता है",
      "मेरे ख़याल से"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "अगले हफ़्ते शिमला चलें?",
        "gloss": {
          "en": "Shall we go to Shimla next week?",
          "ko": "다음 주에 심라 갈래?"
        }
      },
      {
        "who": "me",
        "text": "अच्छा आइडिया! मुझे लगता है कि वहाँ अभी ठंड होगी।",
        "gloss": {
          "en": "Good idea! I think it'll be cold there now.",
          "ko": "좋은 생각이야! 지금 거기 추울 것 같아."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, और बारिश भी हो सकती है।",
        "gloss": {
          "en": "Yes, and it might rain too.",
          "ko": "응, 비도 올 수 있어."
        }
      },
      {
        "who": "me",
        "text": "कोई बात नहीं। अगर बारिश हुई, तो हम होटल में ताश खेलेंगे।",
        "gloss": {
          "en": "No problem. If it rains, we'll play cards at the hotel.",
          "ko": "괜찮아. 비 오면 호텔에서 카드놀이 하자."
        },
        "frames": [
          "hi-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "हा हा, ठीक है। ट्रेन से चलें या बस से?",
        "gloss": {
          "en": "Haha, OK. Shall we go by train or by bus?",
          "ko": "하하, 좋아. 기차로 갈까, 버스로 갈까?"
        }
      },
      {
        "who": "me",
        "text": "मेरे ख़याल से ट्रेन बेहतर है, रास्ता बहुत सुंदर है।",
        "gloss": {
          "en": "In my view, the train is better; the route is beautiful.",
          "ko": "내 생각엔 기차가 나아. 가는 길이 정말 예뻐."
        },
        "frames": [
          "hi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। टिकट कौन बुक करेगा?",
        "gloss": {
          "en": "OK. Who's going to book the tickets?",
          "ko": "좋아. 표는 누가 예매할래?"
        }
      },
      {
        "who": "me",
        "text": "मैं आज रात बुक कर लूँगा।",
        "gloss": {
          "en": "I'll book them tonight.",
          "ko": "오늘 밤에 내가 예매할게."
        },
        "frames": [
          "hi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A lost wallet",
      "ko": "잃어버린 지갑"
    },
    "expressions": [
      "आप सही कह रहे हैं",
      "अब क्या करें",
      "हो सकता है"
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
        "text": "क्या हुआ? आप परेशान लग रहे हैं।",
        "gloss": {
          "en": "What happened? You look worried.",
          "ko": "무슨 일이에요? 걱정스러워 보여요."
        }
      },
      {
        "who": "me",
        "text": "मेरा बटुआ नहीं मिल रहा। हो सकता है कि मैंने उसे ऑटो में छोड़ दिया हो।",
        "gloss": {
          "en": "I can't find my wallet. Maybe I left it in the auto.",
          "ko": "지갑을 못 찾겠어요. 어쩌면 오토릭샤에 두고 내렸나 봐요."
        },
        "frames": [
          "hi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "अरे! उसमें क्या-क्या था?",
        "gloss": {
          "en": "Oh no! What was in it?",
          "ko": "저런! 안에 뭐가 들어 있었어요?"
        }
      },
      {
        "who": "me",
        "text": "कार्ड और थोड़े पैसे। अब क्या करें?",
        "gloss": {
          "en": "My cards and some cash. What do I do now?",
          "ko": "카드랑 돈 조금이요. 이제 어떡하죠?"
        }
      },
      {
        "who": "them",
        "text": "आपको पहले कार्ड ब्लॉक करने चाहिए।",
        "gloss": {
          "en": "You should block your cards first.",
          "ko": "먼저 카드부터 정지해야 해요."
        }
      },
      {
        "who": "me",
        "text": "आप सही कह रहे हैं, मैं अभी बैंक को फ़ोन करता हूँ।",
        "gloss": {
          "en": "You're right, I'll call the bank right now.",
          "ko": "맞아요, 지금 은행에 전화할게요."
        },
        "frames": [
          "hi-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "और ऑटो का नंबर याद है?",
        "gloss": {
          "en": "And do you remember the auto's number?",
          "ko": "오토릭샤 번호는 기억나요?"
        }
      },
      {
        "who": "me",
        "text": "नहीं, पर क्या आप मेरे साथ पुलिस स्टेशन चल सकते हैं?",
        "gloss": {
          "en": "No, but could you come with me to the police station?",
          "ko": "아니요, 그런데 경찰서에 같이 가 주실 수 있어요?"
        },
        "frames": [
          "hi-f3-03"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Advice on a job offer",
      "ko": "이직 제안 고민 상담"
    },
    "expressions": [
      "मेरे ख़याल से",
      "उम्मीद है"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "मुझे नई नौकरी का ऑफ़र मिला है, पर मैं कन्फ़्यूज़्ड हूँ।",
        "gloss": {
          "en": "I got a new job offer, but I can't decide.",
          "ko": "새 일자리 제안을 받았는데 고민돼요."
        }
      },
      {
        "who": "me",
        "text": "बधाई हो! क्या दिक़्क़त है?",
        "gloss": {
          "en": "Congratulations! What's the problem?",
          "ko": "축하해요! 뭐가 문제예요?"
        }
      },
      {
        "who": "them",
        "text": "सैलरी अच्छी है, पर ऑफ़िस बहुत दूर है।",
        "gloss": {
          "en": "The salary is good, but the office is very far.",
          "ko": "월급은 좋은데 회사가 너무 멀어요."
        }
      },
      {
        "who": "me",
        "text": "मेरे ख़याल से अच्छी सैलरी ज़्यादा ज़रूरी है।",
        "gloss": {
          "en": "In my view, a good salary matters more.",
          "ko": "제 생각엔 좋은 월급이 더 중요해요."
        },
        "frames": [
          "hi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "पर रोज़ दो घंटे का सफ़र?",
        "gloss": {
          "en": "But two hours of commuting every day?",
          "ko": "그래도 매일 두 시간 출퇴근이요?"
        }
      },
      {
        "who": "me",
        "text": "तो आपको उनसे वर्क फ़्रॉम होम के बारे में पूछना चाहिए।",
        "gloss": {
          "en": "Then you should ask them about working from home.",
          "ko": "그럼 재택근무에 대해 물어보셔야죠."
        },
        "frames": [
          "hi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, यह अच्छा आइडिया है!",
        "gloss": {
          "en": "Yes, that's a good idea!",
          "ko": "네, 그거 좋은 생각이네요!"
        }
      },
      {
        "who": "me",
        "text": "उम्मीद है कि वे हाँ कहेंगे।",
        "gloss": {
          "en": "I hope they'll say yes.",
          "ko": "그쪽에서 좋다고 하면 좋겠어요."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Cooking dinner at a friend's place",
      "ko": "친구 집에서 같이 저녁 만들기"
    },
    "expressions": [
      "मुझे लगता है",
      "वैसे"
    ],
    "grammar": [
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "दाल तैयार है। सब्ज़ी तुम काटोगे?",
        "gloss": {
          "en": "The dal is ready. Will you cut the vegetables?",
          "ko": "달 다 됐어. 채소는 네가 썰래?"
        }
      },
      {
        "who": "me",
        "text": "हाँ, मैं प्याज़ काट लूँगा।",
        "gloss": {
          "en": "Yes, I'll chop the onions.",
          "ko": "응, 양파는 내가 썰게."
        },
        "frames": [
          "hi-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "ध्यान से! पिछली बार तुम्हारी उँगली कट गई थी।",
        "gloss": {
          "en": "Careful! Last time you cut your finger.",
          "ko": "조심해! 지난번에 손가락 베였잖아."
        }
      },
      {
        "who": "me",
        "text": "हाँ, जब फ़ोन आया, मैं प्याज़ काट रहा था!",
        "gloss": {
          "en": "Right, when the phone rang, I was chopping onions!",
          "ko": "맞아, 전화 왔을 때 양파 썰고 있었거든!"
        },
        "frames": [
          "hi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "हा हा! आज फ़ोन दूर रखो।",
        "gloss": {
          "en": "Haha! Keep your phone away today.",
          "ko": "하하! 오늘은 휴대폰 멀리 둬."
        }
      },
      {
        "who": "me",
        "text": "ठीक है। वैसे, मुझे लगता है कि दाल में नमक कम है।",
        "gloss": {
          "en": "OK. By the way, I think the dal needs more salt.",
          "ko": "알았어. 그런데 달에 소금이 좀 부족한 것 같아."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "सच में? चखकर देखो।",
        "gloss": {
          "en": "Really? Taste it.",
          "ko": "진짜? 맛 좀 봐."
        }
      },
      {
        "who": "me",
        "text": "हाँ, थोड़ा नमक और डाल दो।",
        "gloss": {
          "en": "Yes, add a little more salt.",
          "ko": "응, 소금 조금 더 넣어."
        }
      }
    ]
  },
  {
    "id": "hi-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A book club discussion",
      "ko": "독서 모임 토론"
    },
    "expressions": [
      "मुझे लगता है",
      "आप सही कह रहे हैं",
      "मैं सहमत नहीं हूँ"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "मुझे यह किताब बहुत पसंद आई। आपको कैसी लगी?",
        "gloss": {
          "en": "I really liked this book. What did you think?",
          "ko": "저는 이 책이 정말 좋았어요. 어떠셨어요?"
        }
      },
      {
        "who": "me",
        "text": "मुझे लगता है कि शुरुआत बहुत धीमी थी।",
        "gloss": {
          "en": "I think the beginning was very slow.",
          "ko": "시작이 너무 느렸던 것 같아요."
        },
        "frames": [
          "hi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, पहले सौ पन्ने थोड़े बोरिंग थे।",
        "gloss": {
          "en": "Yes, the first hundred pages were a bit boring.",
          "ko": "네, 처음 백 쪽은 좀 지루했어요."
        }
      },
      {
        "who": "me",
        "text": "आप सही कह रहे हैं, पर बाद में कहानी बहुत अच्छी हो गई।",
        "gloss": {
          "en": "You're right, but later the story got really good.",
          "ko": "맞아요, 그런데 나중엔 이야기가 정말 좋아졌어요."
        },
        "frames": [
          "hi-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "पर अंत मुझे पसंद नहीं आया।",
        "gloss": {
          "en": "But I didn't like the ending.",
          "ko": "그런데 결말은 마음에 안 들었어요."
        }
      },
      {
        "who": "me",
        "text": "मैं सहमत नहीं हूँ, अंत ही सबसे अच्छा हिस्सा था।",
        "gloss": {
          "en": "I don't agree, the ending was the best part.",
          "ko": "저는 동의 못 해요, 결말이 제일 좋은 부분이었어요."
        },
        "frames": [
          "hi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "अगले महीने कौन-सी किताब पढ़ें?",
        "gloss": {
          "en": "Which book shall we read next month?",
          "ko": "다음 달엔 어떤 책 읽을까요?"
        }
      },
      {
        "who": "me",
        "text": "मैं दो-तीन नाम भेज सकता हूँ।",
        "gloss": {
          "en": "I can send two or three titles.",
          "ko": "제가 두세 권 제목을 보낼 수 있어요."
        },
        "frames": [
          "hi-f3-04"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A wedding invitation",
      "ko": "결혼식 초대"
    },
    "expressions": [
      "उम्मीद है"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "अगले महीने मेरी बहन की शादी है। तुम ज़रूर आना!",
        "gloss": {
          "en": "My sister's wedding is next month. You must come!",
          "ko": "다음 달에 우리 여동생 결혼식이 있어. 꼭 와!"
        }
      },
      {
        "who": "me",
        "text": "बधाई हो! मैं ज़रूर आऊँगा। क्या मुझे कुर्ता पहनना चाहिए?",
        "gloss": {
          "en": "Congratulations! I'll definitely come. Should I wear a kurta?",
          "ko": "축하해! 꼭 갈게. 쿠르타 입어야 해?"
        },
        "frames": [
          "hi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "हाँ, बहुत अच्छा लगेगा!",
        "gloss": {
          "en": "Yes, it'll look great!",
          "ko": "응, 정말 잘 어울릴 거야!"
        }
      },
      {
        "who": "me",
        "text": "पर मेरे पास कुर्ता नहीं है।",
        "gloss": {
          "en": "But I don't have a kurta.",
          "ko": "그런데 나 쿠르타가 없어."
        }
      },
      {
        "who": "them",
        "text": "कोई बात नहीं, मेरे भाई के पास बहुत हैं।",
        "gloss": {
          "en": "No problem, my brother has lots.",
          "ko": "괜찮아, 우리 형한테 많아."
        }
      },
      {
        "who": "me",
        "text": "अरे नहीं, मैं कल नया कुर्ता ख़रीद लूँगा।",
        "gloss": {
          "en": "Oh no, I'll buy a new kurta tomorrow.",
          "ko": "아냐, 내일 새 쿠르타 살게."
        },
        "frames": [
          "hi-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "ठीक है। शादी जयपुर में है, ट्रेन से आना।",
        "gloss": {
          "en": "OK. The wedding is in Jaipur, so come by train.",
          "ko": "알았어. 결혼식은 자이푸르에서 하니까 기차로 와."
        }
      },
      {
        "who": "me",
        "text": "उम्मीद है कि टिकट आसानी से मिल जाएगा।",
        "gloss": {
          "en": "I hope I'll get a ticket easily.",
          "ko": "표를 쉽게 구했으면 좋겠어."
        },
        "frames": [
          "hi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "hi-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Cloudy sky before a cricket match",
      "ko": "크리켓 경기 전 흐린 하늘"
    },
    "expressions": [
      "हो सकता है"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "आसमान में बहुत बादल हैं।",
        "gloss": {
          "en": "There are a lot of clouds in the sky.",
          "ko": "하늘에 구름이 많네요."
        }
      },
      {
        "who": "me",
        "text": "हाँ, हो सकता है कि शाम को बारिश हो।",
        "gloss": {
          "en": "Yes, maybe it'll rain in the evening.",
          "ko": "네, 저녁에 비가 올지도 몰라요."
        },
        "frames": [
          "hi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "पर आज तो हमारा क्रिकेट मैच है!",
        "gloss": {
          "en": "But our cricket match is today!",
          "ko": "그런데 오늘 우리 크리켓 경기 있잖아요!"
        }
      },
      {
        "who": "me",
        "text": "कोई बात नहीं। अगर बारिश हुई, तो हम मैच कल खेलेंगे।",
        "gloss": {
          "en": "No problem. If it rains, we'll play the match tomorrow.",
          "ko": "괜찮아요. 비 오면 경기는 내일 해요."
        },
        "frames": [
          "hi-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "बाक़ी लोगों को कौन बताएगा?",
        "gloss": {
          "en": "Who'll tell the others?",
          "ko": "다른 사람들한테는 누가 알려요?"
        }
      },
      {
        "who": "me",
        "text": "मैं ग्रुप में मैसेज भेज सकता हूँ।",
        "gloss": {
          "en": "I can send a message to the group.",
          "ko": "제가 단톡방에 메시지 보낼 수 있어요."
        },
        "frames": [
          "hi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "बढ़िया। मैदान वाले को भी फ़ोन कर दीजिए।",
        "gloss": {
          "en": "Great. Call the ground keeper too.",
          "ko": "좋아요. 운동장 관리인한테도 전화해 주세요."
        }
      },
      {
        "who": "me",
        "text": "ठीक है, मैं अभी फ़ोन करता हूँ।",
        "gloss": {
          "en": "OK, I'll call right now.",
          "ko": "네, 지금 바로 전화할게요."
        }
      }
    ]
  },
  {
    "id": "hi-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to a team dinner",
      "ko": "팀 회식에 늦게 도착"
    },
    "expressions": [
      "देर हो गई",
      "बात यह है कि",
      "वैसे"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "कहाँ थे? हम आधे घंटे से इंतज़ार कर रहे हैं!",
        "gloss": {
          "en": "Where were you? We've been waiting for half an hour!",
          "ko": "어디 있었어요? 우리 삼십 분째 기다리고 있어요!"
        }
      },
      {
        "who": "me",
        "text": "माफ़ कीजिए, बस छूट गई, इसलिए देर हो गई।",
        "gloss": {
          "en": "Sorry, I missed the bus, so I'm late.",
          "ko": "죄송해요, 버스를 놓쳐서 늦었어요."
        },
        "frames": [
          "hi-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "कोई बात नहीं। हमने खाना ऑर्डर कर दिया है।",
        "gloss": {
          "en": "No problem. We've already ordered.",
          "ko": "괜찮아요. 음식은 주문해 뒀어요."
        }
      },
      {
        "who": "me",
        "text": "बहुत अच्छा। वैसे, मैंने आप सबके लिए मिठाई का डिब्बा ख़रीदा।",
        "gloss": {
          "en": "Great. By the way, I bought a box of sweets for all of you.",
          "ko": "잘됐네요. 그런데 여러분 드리려고 과자 한 상자 샀어요."
        },
        "frames": [
          "hi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "वाह! किस ख़ुशी में?",
        "gloss": {
          "en": "Wow! What's the occasion?",
          "ko": "와! 무슨 좋은 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "बात यह है कि मुझे प्रमोशन मिला है!",
        "gloss": {
          "en": "The thing is, I got a promotion!",
          "ko": "사실은 저 승진했어요!"
        }
      },
      {
        "who": "them",
        "text": "बधाई हो! अगली पार्टी आपकी तरफ़ से!",
        "gloss": {
          "en": "Congratulations! The next party's on you!",
          "ko": "축하해요! 다음 회식은 당신이 쏘는 거예요!"
        }
      },
      {
        "who": "me",
        "text": "हाँ, ज़रूर। मैं अगले शुक्रवार को पार्टी दे सकता हूँ।",
        "gloss": {
          "en": "Yes, sure. I can throw a party next Friday.",
          "ko": "네, 물론이죠. 다음 주 금요일에 한턱낼 수 있어요."
        },
        "frames": [
          "hi-f3-04"
        ]
      }
    ]
  }
];
