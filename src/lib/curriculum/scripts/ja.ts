import type { ScriptCourse } from "./types.ts";

/** 일본어 글자·소리 기초: 히라가나 행별 → 탁음·っ·장음·요음 → 가타카나 → 외래어 소리. */
export const JA_SCRIPT: ScriptCourse = {
  "language": "ja",
  "version": 1,
  "title": {
    "en": "Hiragana & Katakana",
    "ko": "히라가나·가타카나"
  },
  "groups": [
    {
      "id": "ja-hira-1",
      "title": {
        "en": "Hiragana: a and ka rows",
        "ko": "히라가나 あ행·か행"
      },
      "note": {
        "en": "Every kana is one beat. The five vowels are a, i, u, e, o; u is said with lips not rounded.",
        "ko": "가나 한 글자는 한 박자. 모음은 a·i·u·e·o 다섯, う는 입술을 둥글게 내밀지 않고 '우'와 '으' 사이로."
      },
      "items": [
        {
          "char": "あ",
          "reading": "a",
          "say": "あ",
          "example": {
            "word": "あめ",
            "meaning": {
              "en": "rain",
              "ko": "비"
            }
          }
        },
        {
          "char": "い",
          "reading": "i",
          "say": "い",
          "example": {
            "word": "いぬ",
            "meaning": {
              "en": "dog",
              "ko": "개"
            }
          }
        },
        {
          "char": "う",
          "reading": "u",
          "say": "う",
          "example": {
            "word": "うみ",
            "meaning": {
              "en": "sea",
              "ko": "바다"
            }
          }
        },
        {
          "char": "え",
          "reading": "e",
          "say": "え",
          "example": {
            "word": "えき",
            "meaning": {
              "en": "station",
              "ko": "역"
            }
          }
        },
        {
          "char": "お",
          "reading": "o",
          "say": "お",
          "example": {
            "word": "おと",
            "meaning": {
              "en": "sound",
              "ko": "소리"
            }
          }
        },
        {
          "char": "か",
          "reading": "ka",
          "say": "か",
          "example": {
            "word": "かさ",
            "meaning": {
              "en": "umbrella",
              "ko": "우산"
            }
          }
        },
        {
          "char": "き",
          "reading": "ki",
          "say": "き",
          "example": {
            "word": "きのこ",
            "meaning": {
              "en": "mushroom",
              "ko": "버섯"
            }
          }
        },
        {
          "char": "く",
          "reading": "ku",
          "say": "く",
          "example": {
            "word": "くち",
            "meaning": {
              "en": "mouth",
              "ko": "입"
            }
          }
        },
        {
          "char": "け",
          "reading": "ke",
          "say": "け",
          "example": {
            "word": "けさ",
            "meaning": {
              "en": "this morning",
              "ko": "오늘 아침"
            }
          }
        },
        {
          "char": "こ",
          "reading": "ko",
          "say": "こ",
          "example": {
            "word": "こえ",
            "meaning": {
              "en": "voice",
              "ko": "목소리"
            }
          }
        }
      ]
    },
    {
      "id": "ja-hira-2",
      "title": {
        "en": "Hiragana: sa and ta rows",
        "ko": "히라가나 さ행·た행"
      },
      "note": {
        "en": "Three break the pattern: し is shi, ち is chi, つ is tsu.",
        "ko": "규칙에서 벗어나는 셋: し는 shi(시), ち는 chi(치), つ는 tsu(츠)."
      },
      "items": [
        {
          "char": "さ",
          "reading": "sa",
          "say": "さ",
          "example": {
            "word": "さかな",
            "meaning": {
              "en": "fish",
              "ko": "물고기"
            }
          }
        },
        {
          "char": "し",
          "reading": "shi",
          "say": "し",
          "example": {
            "word": "しお",
            "meaning": {
              "en": "salt",
              "ko": "소금"
            }
          }
        },
        {
          "char": "す",
          "reading": "su",
          "say": "す",
          "example": {
            "word": "すし",
            "meaning": {
              "en": "sushi",
              "ko": "초밥"
            }
          }
        },
        {
          "char": "せ",
          "reading": "se",
          "say": "せ",
          "example": {
            "word": "せかい",
            "meaning": {
              "en": "world",
              "ko": "세계"
            }
          }
        },
        {
          "char": "そ",
          "reading": "so",
          "say": "そ",
          "example": {
            "word": "そら",
            "meaning": {
              "en": "sky",
              "ko": "하늘"
            }
          }
        },
        {
          "char": "た",
          "reading": "ta",
          "say": "た",
          "example": {
            "word": "たこ",
            "meaning": {
              "en": "octopus",
              "ko": "문어"
            }
          }
        },
        {
          "char": "ち",
          "reading": "chi",
          "say": "ち",
          "example": {
            "word": "ちず",
            "meaning": {
              "en": "map",
              "ko": "지도"
            }
          }
        },
        {
          "char": "つ",
          "reading": "tsu",
          "say": "つ",
          "example": {
            "word": "つくえ",
            "meaning": {
              "en": "desk",
              "ko": "책상"
            }
          }
        },
        {
          "char": "て",
          "reading": "te",
          "say": "て",
          "example": {
            "word": "て",
            "meaning": {
              "en": "hand",
              "ko": "손"
            }
          }
        },
        {
          "char": "と",
          "reading": "to",
          "say": "と",
          "example": {
            "word": "とり",
            "meaning": {
              "en": "bird",
              "ko": "새"
            }
          }
        }
      ]
    },
    {
      "id": "ja-hira-3",
      "title": {
        "en": "Hiragana: na and ha rows",
        "ko": "히라가나 な행·は행"
      },
      "note": {
        "en": "ふ is a soft breath between f and h. As particles, は is read wa and へ is read e.",
        "ko": "ふ는 f와 h 사이의 약한 바람 소리. 조사로 쓰일 때 は는 wa(와), へ는 e(에)로 읽는다."
      },
      "items": [
        {
          "char": "な",
          "reading": "na",
          "say": "な",
          "example": {
            "word": "なつ",
            "meaning": {
              "en": "summer",
              "ko": "여름"
            }
          }
        },
        {
          "char": "に",
          "reading": "ni",
          "say": "に",
          "example": {
            "word": "にく",
            "meaning": {
              "en": "meat",
              "ko": "고기"
            }
          }
        },
        {
          "char": "ぬ",
          "reading": "nu",
          "say": "ぬ",
          "example": {
            "word": "いぬ",
            "meaning": {
              "en": "dog",
              "ko": "개"
            }
          }
        },
        {
          "char": "ね",
          "reading": "ne",
          "say": "ね",
          "example": {
            "word": "ねこ",
            "meaning": {
              "en": "cat",
              "ko": "고양이"
            }
          }
        },
        {
          "char": "の",
          "reading": "no",
          "say": "の",
          "example": {
            "word": "のり",
            "meaning": {
              "en": "dried seaweed",
              "ko": "김"
            }
          }
        },
        {
          "char": "は",
          "reading": "ha",
          "say": "は",
          "example": {
            "word": "はな",
            "meaning": {
              "en": "flower",
              "ko": "꽃"
            }
          }
        },
        {
          "char": "ひ",
          "reading": "hi",
          "say": "ひ",
          "example": {
            "word": "ひと",
            "meaning": {
              "en": "person",
              "ko": "사람"
            }
          }
        },
        {
          "char": "ふ",
          "reading": "fu",
          "say": "ふ",
          "example": {
            "word": "ふね",
            "meaning": {
              "en": "boat",
              "ko": "배"
            }
          }
        },
        {
          "char": "へ",
          "reading": "he",
          "say": "へ",
          "example": {
            "word": "へや",
            "meaning": {
              "en": "room",
              "ko": "방"
            }
          }
        },
        {
          "char": "ほ",
          "reading": "ho",
          "say": "ほ",
          "example": {
            "word": "ほし",
            "meaning": {
              "en": "star",
              "ko": "별"
            }
          }
        }
      ]
    },
    {
      "id": "ja-hira-4",
      "title": {
        "en": "Hiragana: ma and ra rows",
        "ko": "히라가나 ま행·ら행"
      },
      "note": {
        "en": "The r sound is a light tap of the tongue, close to Korean ㄹ between vowels.",
        "ko": "ら행의 r은 혀를 한 번 가볍게 튕기는 소리로, 모음 사이의 'ㄹ'과 비슷하다."
      },
      "items": [
        {
          "char": "ま",
          "reading": "ma",
          "say": "ま",
          "example": {
            "word": "まど",
            "meaning": {
              "en": "window",
              "ko": "창문"
            }
          }
        },
        {
          "char": "み",
          "reading": "mi",
          "say": "み",
          "example": {
            "word": "みみ",
            "meaning": {
              "en": "ear",
              "ko": "귀"
            }
          }
        },
        {
          "char": "む",
          "reading": "mu",
          "say": "む",
          "example": {
            "word": "むし",
            "meaning": {
              "en": "bug",
              "ko": "벌레"
            }
          }
        },
        {
          "char": "め",
          "reading": "me",
          "say": "め",
          "example": {
            "word": "め",
            "meaning": {
              "en": "eye",
              "ko": "눈"
            }
          }
        },
        {
          "char": "も",
          "reading": "mo",
          "say": "も",
          "example": {
            "word": "もも",
            "meaning": {
              "en": "peach",
              "ko": "복숭아"
            }
          }
        },
        {
          "char": "ら",
          "reading": "ra",
          "say": "ら",
          "example": {
            "word": "らいねん",
            "meaning": {
              "en": "next year",
              "ko": "내년"
            }
          }
        },
        {
          "char": "り",
          "reading": "ri",
          "say": "り",
          "example": {
            "word": "りんご",
            "meaning": {
              "en": "apple",
              "ko": "사과"
            }
          }
        },
        {
          "char": "る",
          "reading": "ru",
          "say": "る",
          "example": {
            "word": "くるま",
            "meaning": {
              "en": "car",
              "ko": "자동차"
            }
          }
        },
        {
          "char": "れ",
          "reading": "re",
          "say": "れ",
          "example": {
            "word": "れきし",
            "meaning": {
              "en": "history",
              "ko": "역사"
            }
          }
        },
        {
          "char": "ろ",
          "reading": "ro",
          "say": "ろ",
          "example": {
            "word": "いろ",
            "meaning": {
              "en": "color",
              "ko": "색"
            }
          }
        }
      ]
    },
    {
      "id": "ja-hira-5",
      "title": {
        "en": "Hiragana: ya row, wa, wo, n",
        "ko": "히라가나 や행·わ·を·ん"
      },
      "note": {
        "en": "を is only used as the object particle and is said o. ん is a beat of its own; before b, p or m it sounds like m.",
        "ko": "を는 목적격 조사로만 쓰고 'o'로 읽는다. ん은 혼자 한 박자이고, b·p·m 앞에서는 m처럼 들린다."
      },
      "items": [
        {
          "char": "や",
          "reading": "ya",
          "say": "や",
          "example": {
            "word": "やま",
            "meaning": {
              "en": "mountain",
              "ko": "산"
            }
          }
        },
        {
          "char": "ゆ",
          "reading": "yu",
          "say": "ゆ",
          "example": {
            "word": "ゆき",
            "meaning": {
              "en": "snow",
              "ko": "눈"
            }
          }
        },
        {
          "char": "よ",
          "reading": "yo",
          "say": "よ",
          "example": {
            "word": "よる",
            "meaning": {
              "en": "night",
              "ko": "밤"
            }
          }
        },
        {
          "char": "わ",
          "reading": "wa",
          "say": "わ",
          "example": {
            "word": "わたし",
            "meaning": {
              "en": "I, me",
              "ko": "나, 저"
            }
          }
        },
        {
          "char": "を",
          "reading": "o (wo)",
          "say": "ほんを",
          "example": {
            "word": "ほんをよむ",
            "meaning": {
              "en": "read a book",
              "ko": "책을 읽다"
            }
          }
        },
        {
          "char": "ん",
          "reading": "n",
          "say": "ん",
          "example": {
            "word": "ほん",
            "meaning": {
              "en": "book",
              "ko": "책"
            }
          }
        }
      ]
    },
    {
      "id": "ja-daku-1",
      "title": {
        "en": "Voiced marks ゛ and ゜",
        "ko": "탁음·반탁음 (が·ざ·だ·ば·ぱ)"
      },
      "note": {
        "en": "゛ turns k→g, s→z, t→d, h→b; ゜ turns h→p. The whole row changes the same way (ぎ gi, ぶ bu, ぴ pi).",
        "ko": "゛를 붙이면 k→g, s→z, t→d, h→b, ゜를 붙이면 h→p. 한 줄이 모두 같은 식으로 바뀐다(ぎ gi, ぶ bu, ぴ pi)."
      },
      "items": [
        {
          "char": "が",
          "reading": "ga",
          "say": "が",
          "example": {
            "word": "めがね",
            "meaning": {
              "en": "glasses",
              "ko": "안경"
            }
          }
        },
        {
          "char": "ぎ",
          "reading": "gi",
          "say": "ぎ",
          "example": {
            "word": "かぎ",
            "meaning": {
              "en": "key",
              "ko": "열쇠"
            }
          }
        },
        {
          "char": "ぐ",
          "reading": "gu",
          "say": "ぐ",
          "example": {
            "word": "かぐ",
            "meaning": {
              "en": "furniture",
              "ko": "가구"
            }
          }
        },
        {
          "char": "げ",
          "reading": "ge",
          "say": "げ",
          "example": {
            "word": "げんき",
            "meaning": {
              "en": "well, healthy",
              "ko": "건강함"
            }
          }
        },
        {
          "char": "ご",
          "reading": "go",
          "say": "ご",
          "example": {
            "word": "ごはん",
            "meaning": {
              "en": "rice, meal",
              "ko": "밥"
            }
          }
        },
        {
          "char": "ざ",
          "reading": "za",
          "say": "ざ",
          "example": {
            "word": "ひざ",
            "meaning": {
              "en": "knee",
              "ko": "무릎"
            }
          }
        },
        {
          "char": "じ",
          "reading": "ji",
          "say": "じ",
          "example": {
            "word": "じかん",
            "meaning": {
              "en": "time",
              "ko": "시간"
            }
          }
        },
        {
          "char": "ず",
          "reading": "zu",
          "say": "ず",
          "example": {
            "word": "みず",
            "meaning": {
              "en": "water",
              "ko": "물"
            }
          }
        },
        {
          "char": "だ",
          "reading": "da",
          "say": "だ",
          "example": {
            "word": "だれ",
            "meaning": {
              "en": "who",
              "ko": "누구"
            }
          }
        },
        {
          "char": "ど",
          "reading": "do",
          "say": "ど",
          "example": {
            "word": "どこ",
            "meaning": {
              "en": "where",
              "ko": "어디"
            }
          }
        },
        {
          "char": "ば",
          "reading": "ba",
          "say": "ば",
          "example": {
            "word": "かばん",
            "meaning": {
              "en": "bag",
              "ko": "가방"
            }
          }
        },
        {
          "char": "ぱ",
          "reading": "pa",
          "say": "ぱ",
          "example": {
            "word": "かんぱい",
            "meaning": {
              "en": "cheers",
              "ko": "건배"
            }
          }
        }
      ]
    },
    {
      "id": "ja-beat-1",
      "title": {
        "en": "Small っ and long vowels",
        "ko": "작은 っ와 긴소리"
      },
      "note": {
        "en": "Small っ is a one-beat stop before the next consonant. ああ, いい, うう, ええ, えい, おう, おお are held for two beats — length changes meaning (おばさん aunt, おばあさん grandmother).",
        "ko": "작은 っ는 다음 자음 앞에서 한 박자 멈춤. ああ·いい·うう·ええ·えい·おう·おお는 두 박자로 길게 — 길이로 뜻이 갈린다(おばさん 아주머니, おばあさん 할머니)."
      },
      "items": [
        {
          "char": "っ",
          "reading": "pause (kk, tt, ss, pp)",
          "say": "きって",
          "example": {
            "word": "きって",
            "meaning": {
              "en": "stamp",
              "ko": "우표"
            }
          }
        },
        {
          "char": "ざっし",
          "reading": "zasshi",
          "say": "ざっし",
          "example": {
            "word": "ざっし",
            "meaning": {
              "en": "magazine",
              "ko": "잡지"
            }
          }
        },
        {
          "char": "いっぱい",
          "reading": "ippai",
          "say": "いっぱい",
          "example": {
            "word": "いっぱい",
            "meaning": {
              "en": "a lot, full",
              "ko": "많이, 가득"
            }
          }
        },
        {
          "char": "おかあさん",
          "reading": "okaasan (ā)",
          "say": "おかあさん",
          "example": {
            "word": "おかあさん",
            "meaning": {
              "en": "mother",
              "ko": "어머니"
            }
          }
        },
        {
          "char": "おにいさん",
          "reading": "oniisan (ī)",
          "say": "おにいさん",
          "example": {
            "word": "おにいさん",
            "meaning": {
              "en": "older brother",
              "ko": "형, 오빠"
            }
          }
        },
        {
          "char": "くうき",
          "reading": "kuuki (ū)",
          "say": "くうき",
          "example": {
            "word": "くうき",
            "meaning": {
              "en": "air",
              "ko": "공기"
            }
          }
        },
        {
          "char": "おねえさん",
          "reading": "oneesan (ē)",
          "say": "おねえさん",
          "example": {
            "word": "おねえさん",
            "meaning": {
              "en": "older sister",
              "ko": "누나, 언니"
            }
          }
        },
        {
          "char": "がっこう",
          "reading": "gakkou (ō)",
          "say": "がっこう",
          "example": {
            "word": "がっこう",
            "meaning": {
              "en": "school",
              "ko": "학교"
            }
          }
        },
        {
          "char": "おおきい",
          "reading": "ookii (ō)",
          "say": "おおきい",
          "example": {
            "word": "おおきい",
            "meaning": {
              "en": "big",
              "ko": "크다"
            }
          }
        }
      ]
    },
    {
      "id": "ja-yoon-1",
      "title": {
        "en": "Combined sounds (kya, sha, cha)",
        "ko": "요음 (きゃ·しゃ·ちゃ)"
      },
      "note": {
        "en": "A small ゃ, ゅ or ょ joins the kana before it into one beat: き + ゃ = kya.",
        "ko": "작은 ゃ·ゅ·ょ는 앞 글자와 합쳐 한 박자: き + ゃ = kya(캬)."
      },
      "items": [
        {
          "char": "きゃ",
          "reading": "kya",
          "say": "きゃ",
          "example": {
            "word": "きゃく",
            "meaning": {
              "en": "guest",
              "ko": "손님"
            }
          }
        },
        {
          "char": "きゅ",
          "reading": "kyu",
          "say": "きゅ",
          "example": {
            "word": "きゅうり",
            "meaning": {
              "en": "cucumber",
              "ko": "오이"
            }
          }
        },
        {
          "char": "きょ",
          "reading": "kyo",
          "say": "きょ",
          "example": {
            "word": "きょう",
            "meaning": {
              "en": "today",
              "ko": "오늘"
            }
          }
        },
        {
          "char": "しゃ",
          "reading": "sha",
          "say": "しゃ",
          "example": {
            "word": "しゃしん",
            "meaning": {
              "en": "photo",
              "ko": "사진"
            }
          }
        },
        {
          "char": "しゅ",
          "reading": "shu",
          "say": "しゅ",
          "example": {
            "word": "しゅくだい",
            "meaning": {
              "en": "homework",
              "ko": "숙제"
            }
          }
        },
        {
          "char": "しょ",
          "reading": "sho",
          "say": "しょ",
          "example": {
            "word": "しょくじ",
            "meaning": {
              "en": "meal",
              "ko": "식사"
            }
          }
        },
        {
          "char": "ちゃ",
          "reading": "cha",
          "say": "ちゃ",
          "example": {
            "word": "おちゃ",
            "meaning": {
              "en": "green tea",
              "ko": "녹차"
            }
          }
        },
        {
          "char": "ちゅ",
          "reading": "chu",
          "say": "ちゅ",
          "example": {
            "word": "ちゅうい",
            "meaning": {
              "en": "caution",
              "ko": "주의"
            }
          }
        },
        {
          "char": "ちょ",
          "reading": "cho",
          "say": "ちょ",
          "example": {
            "word": "ちょっと",
            "meaning": {
              "en": "a little",
              "ko": "조금"
            }
          }
        },
        {
          "char": "ひゃ",
          "reading": "hya",
          "say": "ひゃ",
          "example": {
            "word": "ひゃく",
            "meaning": {
              "en": "hundred",
              "ko": "백"
            }
          }
        },
        {
          "char": "じゃ",
          "reading": "ja",
          "say": "じゃ",
          "example": {
            "word": "じゃあね",
            "meaning": {
              "en": "see you",
              "ko": "잘 가"
            }
          }
        },
        {
          "char": "りょ",
          "reading": "ryo",
          "say": "りょ",
          "example": {
            "word": "りょこう",
            "meaning": {
              "en": "trip",
              "ko": "여행"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-1",
      "title": {
        "en": "Katakana: a and ka rows",
        "ko": "가타카나 ア행·カ행"
      },
      "note": {
        "en": "Katakana has the same sounds as hiragana and is used mostly for foreign words and names.",
        "ko": "가타카나는 히라가나와 소리가 같고, 주로 외래어와 외국 이름에 쓴다."
      },
      "items": [
        {
          "char": "ア",
          "reading": "a",
          "say": "ア",
          "example": {
            "word": "アメリカ",
            "meaning": {
              "en": "America",
              "ko": "미국"
            }
          }
        },
        {
          "char": "イ",
          "reading": "i",
          "say": "イ",
          "example": {
            "word": "インク",
            "meaning": {
              "en": "ink",
              "ko": "잉크"
            }
          }
        },
        {
          "char": "ウ",
          "reading": "u",
          "say": "ウ",
          "example": {
            "word": "ウイルス",
            "meaning": {
              "en": "virus",
              "ko": "바이러스"
            }
          }
        },
        {
          "char": "エ",
          "reading": "e",
          "say": "エ",
          "example": {
            "word": "エアコン",
            "meaning": {
              "en": "air conditioner",
              "ko": "에어컨"
            }
          }
        },
        {
          "char": "オ",
          "reading": "o",
          "say": "オ",
          "example": {
            "word": "オレンジ",
            "meaning": {
              "en": "orange",
              "ko": "오렌지"
            }
          }
        },
        {
          "char": "カ",
          "reading": "ka",
          "say": "カ",
          "example": {
            "word": "カメラ",
            "meaning": {
              "en": "camera",
              "ko": "카메라"
            }
          }
        },
        {
          "char": "キ",
          "reading": "ki",
          "say": "キ",
          "example": {
            "word": "キウイ",
            "meaning": {
              "en": "kiwi",
              "ko": "키위"
            }
          }
        },
        {
          "char": "ク",
          "reading": "ku",
          "say": "ク",
          "example": {
            "word": "クラス",
            "meaning": {
              "en": "class",
              "ko": "반, 클래스"
            }
          }
        },
        {
          "char": "ケ",
          "reading": "ke",
          "say": "ケ",
          "example": {
            "word": "ケチャップ",
            "meaning": {
              "en": "ketchup",
              "ko": "케첩"
            }
          }
        },
        {
          "char": "コ",
          "reading": "ko",
          "say": "コ",
          "example": {
            "word": "ココア",
            "meaning": {
              "en": "cocoa",
              "ko": "코코아"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-2",
      "title": {
        "en": "Katakana: sa and ta rows",
        "ko": "가타카나 サ행·タ행"
      },
      "note": {
        "en": "シ and ツ look alike: シ has its dots on the left and the last stroke goes up; ツ has its dots on top and the stroke goes down.",
        "ko": "シ와 ツ는 닮았다: シ는 점이 왼쪽에 있고 마지막 획이 아래에서 위로, ツ는 점이 위에 있고 획이 위에서 아래로."
      },
      "items": [
        {
          "char": "サ",
          "reading": "sa",
          "say": "サ",
          "example": {
            "word": "サラダ",
            "meaning": {
              "en": "salad",
              "ko": "샐러드"
            }
          }
        },
        {
          "char": "シ",
          "reading": "shi",
          "say": "シ",
          "example": {
            "word": "シャツ",
            "meaning": {
              "en": "shirt",
              "ko": "셔츠"
            }
          }
        },
        {
          "char": "ス",
          "reading": "su",
          "say": "ス",
          "example": {
            "word": "スマホ",
            "meaning": {
              "en": "smartphone",
              "ko": "스마트폰"
            }
          }
        },
        {
          "char": "セ",
          "reading": "se",
          "say": "セ",
          "example": {
            "word": "セット",
            "meaning": {
              "en": "set",
              "ko": "세트"
            }
          }
        },
        {
          "char": "ソ",
          "reading": "so",
          "say": "ソ",
          "example": {
            "word": "ソファ",
            "meaning": {
              "en": "sofa",
              "ko": "소파"
            }
          }
        },
        {
          "char": "タ",
          "reading": "ta",
          "say": "タ",
          "example": {
            "word": "タオル",
            "meaning": {
              "en": "towel",
              "ko": "수건"
            }
          }
        },
        {
          "char": "チ",
          "reading": "chi",
          "say": "チ",
          "example": {
            "word": "チキン",
            "meaning": {
              "en": "chicken",
              "ko": "치킨"
            }
          }
        },
        {
          "char": "ツ",
          "reading": "tsu",
          "say": "ツ",
          "example": {
            "word": "ツナ",
            "meaning": {
              "en": "tuna",
              "ko": "참치"
            }
          }
        },
        {
          "char": "テ",
          "reading": "te",
          "say": "テ",
          "example": {
            "word": "テニス",
            "meaning": {
              "en": "tennis",
              "ko": "테니스"
            }
          }
        },
        {
          "char": "ト",
          "reading": "to",
          "say": "ト",
          "example": {
            "word": "トマト",
            "meaning": {
              "en": "tomato",
              "ko": "토마토"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-3",
      "title": {
        "en": "Katakana: na and ha rows",
        "ko": "가타카나 ナ행·ハ행"
      },
      "items": [
        {
          "char": "ナ",
          "reading": "na",
          "say": "ナ",
          "example": {
            "word": "ナイフ",
            "meaning": {
              "en": "knife",
              "ko": "칼, 나이프"
            }
          }
        },
        {
          "char": "ニ",
          "reading": "ni",
          "say": "ニ",
          "example": {
            "word": "ニュース",
            "meaning": {
              "en": "news",
              "ko": "뉴스"
            }
          }
        },
        {
          "char": "ヌ",
          "reading": "nu",
          "say": "ヌ",
          "example": {
            "word": "カヌー",
            "meaning": {
              "en": "canoe",
              "ko": "카누"
            }
          }
        },
        {
          "char": "ネ",
          "reading": "ne",
          "say": "ネ",
          "example": {
            "word": "ネクタイ",
            "meaning": {
              "en": "necktie",
              "ko": "넥타이"
            }
          }
        },
        {
          "char": "ノ",
          "reading": "no",
          "say": "ノ",
          "example": {
            "word": "ノート",
            "meaning": {
              "en": "notebook",
              "ko": "노트"
            }
          }
        },
        {
          "char": "ハ",
          "reading": "ha",
          "say": "ハ",
          "example": {
            "word": "ハム",
            "meaning": {
              "en": "ham",
              "ko": "햄"
            }
          }
        },
        {
          "char": "ヒ",
          "reading": "hi",
          "say": "ヒ",
          "example": {
            "word": "ヒント",
            "meaning": {
              "en": "hint",
              "ko": "힌트"
            }
          }
        },
        {
          "char": "フ",
          "reading": "fu",
          "say": "フ",
          "example": {
            "word": "フランス",
            "meaning": {
              "en": "France",
              "ko": "프랑스"
            }
          }
        },
        {
          "char": "ヘ",
          "reading": "he",
          "say": "ヘ",
          "example": {
            "word": "ヘルメット",
            "meaning": {
              "en": "helmet",
              "ko": "헬멧"
            }
          }
        },
        {
          "char": "ホ",
          "reading": "ho",
          "say": "ホ",
          "example": {
            "word": "ホテル",
            "meaning": {
              "en": "hotel",
              "ko": "호텔"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-4",
      "title": {
        "en": "Katakana: ma and ya rows, wa, n",
        "ko": "가타카나 マ행·ヤ행·ワ·ン"
      },
      "note": {
        "en": "ソ and ン look alike: ソ's last stroke goes down from the top; ン's goes up from the bottom.",
        "ko": "ソ와 ン은 닮았다: ソ는 마지막 획이 위에서 아래로, ン은 아래에서 위로 올라간다."
      },
      "items": [
        {
          "char": "マ",
          "reading": "ma",
          "say": "マ",
          "example": {
            "word": "マスク",
            "meaning": {
              "en": "mask",
              "ko": "마스크"
            }
          }
        },
        {
          "char": "ミ",
          "reading": "mi",
          "say": "ミ",
          "example": {
            "word": "ミルク",
            "meaning": {
              "en": "milk",
              "ko": "우유"
            }
          }
        },
        {
          "char": "ム",
          "reading": "mu",
          "say": "ム",
          "example": {
            "word": "ムード",
            "meaning": {
              "en": "mood",
              "ko": "분위기"
            }
          }
        },
        {
          "char": "メ",
          "reading": "me",
          "say": "メ",
          "example": {
            "word": "メニュー",
            "meaning": {
              "en": "menu",
              "ko": "메뉴"
            }
          }
        },
        {
          "char": "モ",
          "reading": "mo",
          "say": "モ",
          "example": {
            "word": "メモ",
            "meaning": {
              "en": "memo",
              "ko": "메모"
            }
          }
        },
        {
          "char": "ヤ",
          "reading": "ya",
          "say": "ヤ",
          "example": {
            "word": "タイヤ",
            "meaning": {
              "en": "tire",
              "ko": "타이어"
            }
          }
        },
        {
          "char": "ユ",
          "reading": "yu",
          "say": "ユ",
          "example": {
            "word": "ユニフォーム",
            "meaning": {
              "en": "uniform",
              "ko": "유니폼"
            }
          }
        },
        {
          "char": "ヨ",
          "reading": "yo",
          "say": "ヨ",
          "example": {
            "word": "ヨーグルト",
            "meaning": {
              "en": "yogurt",
              "ko": "요구르트"
            }
          }
        },
        {
          "char": "ワ",
          "reading": "wa",
          "say": "ワ",
          "example": {
            "word": "ワイン",
            "meaning": {
              "en": "wine",
              "ko": "와인"
            }
          }
        },
        {
          "char": "ン",
          "reading": "n",
          "say": "ン",
          "example": {
            "word": "パン",
            "meaning": {
              "en": "bread",
              "ko": "빵"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-5",
      "title": {
        "en": "Katakana: ra row, long mark ー, voiced",
        "ko": "가타카나 ラ행·장음 ー·탁음"
      },
      "note": {
        "en": "ー stretches the vowel before it by one beat. ゛ and ゜ work exactly as in hiragana (ガ ga, ブ bu, ポ po).",
        "ko": "ー는 앞 모음을 한 박자 늘린다. ゛·゜는 히라가나와 똑같이 쓴다(ガ ga, ブ bu, ポ po)."
      },
      "items": [
        {
          "char": "ラ",
          "reading": "ra",
          "say": "ラ",
          "example": {
            "word": "ラジオ",
            "meaning": {
              "en": "radio",
              "ko": "라디오"
            }
          }
        },
        {
          "char": "リ",
          "reading": "ri",
          "say": "リ",
          "example": {
            "word": "リモコン",
            "meaning": {
              "en": "remote control",
              "ko": "리모컨"
            }
          }
        },
        {
          "char": "ル",
          "reading": "ru",
          "say": "ル",
          "example": {
            "word": "ルール",
            "meaning": {
              "en": "rule",
              "ko": "규칙"
            }
          }
        },
        {
          "char": "レ",
          "reading": "re",
          "say": "レ",
          "example": {
            "word": "レモン",
            "meaning": {
              "en": "lemon",
              "ko": "레몬"
            }
          }
        },
        {
          "char": "ロ",
          "reading": "ro",
          "say": "ロ",
          "example": {
            "word": "ロボット",
            "meaning": {
              "en": "robot",
              "ko": "로봇"
            }
          }
        },
        {
          "char": "ー",
          "reading": "long vowel (hold 1 beat)",
          "say": "コーヒー",
          "example": {
            "word": "コーヒー",
            "meaning": {
              "en": "coffee",
              "ko": "커피"
            }
          }
        },
        {
          "char": "ビ",
          "reading": "bi",
          "say": "ビ",
          "example": {
            "word": "ビール",
            "meaning": {
              "en": "beer",
              "ko": "맥주"
            }
          }
        },
        {
          "char": "パ",
          "reading": "pa",
          "say": "パ",
          "example": {
            "word": "パスタ",
            "meaning": {
              "en": "pasta",
              "ko": "파스타"
            }
          }
        },
        {
          "char": "ド",
          "reading": "do",
          "say": "ド",
          "example": {
            "word": "ドア",
            "meaning": {
              "en": "door",
              "ko": "문"
            }
          }
        }
      ]
    },
    {
      "id": "ja-kata-6",
      "title": {
        "en": "Sounds for foreign words (ti, fa…)",
        "ko": "외래어 소리 (ティ·ファ…)"
      },
      "note": {
        "en": "A small ァ, ィ, ゥ, ェ or ォ joins the kana before it to make sounds old Japanese did not have: テ + ィ = ti.",
        "ko": "작은 ァ·ィ·ゥ·ェ·ォ는 앞 글자와 합쳐 원래 일본어에 없던 소리를 만든다: テ + ィ = ti(티)."
      },
      "items": [
        {
          "char": "ティ",
          "reading": "ti",
          "say": "ティ",
          "example": {
            "word": "パーティー",
            "meaning": {
              "en": "party",
              "ko": "파티"
            }
          }
        },
        {
          "char": "ディ",
          "reading": "di",
          "say": "ディ",
          "example": {
            "word": "ディナー",
            "meaning": {
              "en": "dinner",
              "ko": "디너, 저녁 식사"
            }
          }
        },
        {
          "char": "ファ",
          "reading": "fa",
          "say": "ファ",
          "example": {
            "word": "ファン",
            "meaning": {
              "en": "fan",
              "ko": "팬"
            }
          }
        },
        {
          "char": "フィ",
          "reading": "fi",
          "say": "フィ",
          "example": {
            "word": "フィルム",
            "meaning": {
              "en": "film",
              "ko": "필름"
            }
          }
        },
        {
          "char": "フェ",
          "reading": "fe",
          "say": "フェ",
          "example": {
            "word": "カフェ",
            "meaning": {
              "en": "cafe",
              "ko": "카페"
            }
          }
        },
        {
          "char": "フォ",
          "reading": "fo",
          "say": "フォ",
          "example": {
            "word": "フォーク",
            "meaning": {
              "en": "fork",
              "ko": "포크"
            }
          }
        },
        {
          "char": "ウィ",
          "reading": "wi",
          "say": "ウィ",
          "example": {
            "word": "ハロウィン",
            "meaning": {
              "en": "Halloween",
              "ko": "핼러윈"
            }
          }
        },
        {
          "char": "ウェ",
          "reading": "we",
          "say": "ウェ",
          "example": {
            "word": "ウェブ",
            "meaning": {
              "en": "web",
              "ko": "웹"
            }
          }
        },
        {
          "char": "ジェ",
          "reading": "je",
          "say": "ジェ",
          "example": {
            "word": "プロジェクト",
            "meaning": {
              "en": "project",
              "ko": "프로젝트"
            }
          }
        },
        {
          "char": "チェ",
          "reading": "che",
          "say": "チェ",
          "example": {
            "word": "チェック",
            "meaning": {
              "en": "check",
              "ko": "체크"
            }
          }
        },
        {
          "char": "シェ",
          "reading": "she",
          "say": "シェ",
          "example": {
            "word": "シェフ",
            "meaning": {
              "en": "chef",
              "ko": "셰프"
            }
          }
        }
      ]
    }
  ]
};
