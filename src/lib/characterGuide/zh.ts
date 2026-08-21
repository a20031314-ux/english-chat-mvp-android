import type { CharacterGuide, CharacterItem, LocalizedText } from "./types";

function m(ko: string, en: string): LocalizedText {
  return { ko, en };
}

function hanzi(
  character: string,
  pinyin: string,
  tone: number,
  ko: string,
  en: string,
  examples: Array<[string, string, string, string]>,
): CharacterItem {
  return {
    id: `zh-${character}`,
    character,
    reading: pinyin,
    pronunciation: pinyin,
    category: "hanzi",
    tone,
    meaning: m(ko, en),
    examples: examples.map(([text, reading, mko, men]) => ({
      text,
      reading,
      meaning: m(mko, men),
    })),
  };
}

export const ZH_GUIDE: CharacterGuide = {
  language: "zh",
  categories: [{ id: "hanzi", label: m("기초 한자", "Core characters") }],
  notes: [
    {
      title: m("병음", "Pinyin"),
      body: m(
        "한자 발음을 로마자로 적은 표기입니다. 성조 기호가 숫자에 대응합니다.",
        "Roman letters for Mandarin sounds. Tone marks match the tone number.",
      ),
    },
    {
      title: m("성조", "Tones"),
      body: m(
        "1성 높게 平, 2성 올라감, 3성 내려갔다 올림, 4성 빠르게 내림. 같은 병음도 성조가 다르면 뜻이 달라집니다.",
        "1 high, 2 rising, 3 dip, 4 falling. Same letters with a different tone are a different word.",
      ),
    },
  ],
  items: [
    hanzi("人", "rén", 2, "사람", "person", [["人们", "rénmen", "사람들", "people"], ["大人", "dàren", "어른", "adult"]]),
    hanzi("我", "wǒ", 3, "나", "I / me", [["我们", "wǒmen", "우리", "we"], ["我的", "wǒ de", "나의", "my"]]),
    hanzi("你", "nǐ", 3, "너, 당신", "you", [["你好", "nǐ hǎo", "안녕", "hello"], ["你们", "nǐmen", "너희", "you (plural)"]]),
    hanzi("他", "tā", 1, "그", "he", [["他们", "tāmen", "그들", "they"], ["他的", "tā de", "그의", "his"]]),
    hanzi("是", "shì", 4, "이다", "to be", [["不是", "bú shì", "아니다", "is not"], ["是的", "shì de", "맞아요", "yes"]]),
    hanzi("不", "bù", 4, "아니다, 안", "not", [["不是", "bú shì", "아니다", "is not"], ["不好", "bù hǎo", "좋지 않다", "not good"]]),
    hanzi("有", "yǒu", 3, "있다", "to have", [["没有", "méi yǒu", "없다", "don't have"], ["有人", "yǒu rén", "사람이 있다", "there's someone"]]),
    hanzi("在", "zài", 4, "있다, ~에서", "at / to be at", [["在家", "zài jiā", "집에 있다", "at home"], ["现在", "xiànzài", "지금", "now"]]),
    hanzi("这", "zhè", 4, "이것", "this", [["这个", "zhège", "이것", "this one"], ["这里", "zhèlǐ", "여기", "here"]]),
    hanzi("那", "nà", 4, "저것", "that", [["那个", "nàge", "저것", "that one"], ["那里", "nàlǐ", "거기", "there"]]),
    hanzi("的", "de", 5, "의 (~의)", "possessive particle", [["我的", "wǒ de", "나의", "my"], ["好的", "hǎo de", "알겠어요", "okay"]]),
    hanzi("了", "le", 5, "완료·변화", "completed / change", [["好了", "hǎo le", "됐어", "done"], ["吃了", "chī le", "먹었다", "ate"]]),
    hanzi("一", "yī", 1, "하나", "one", [["一个", "yí ge", "하나", "one (item)"], ["一起", "yìqǐ", "함께", "together"]]),
    hanzi("个", "gè", 4, "개 (양사)", "measure word", [["一个", "yí ge", "하나", "one item"], ["这个", "zhège", "이것", "this one"]]),
    hanzi("大", "dà", 4, "크다", "big", [["大学", "dàxué", "대학", "university"], ["大人", "dàren", "어른", "adult"]]),
    hanzi("小", "xiǎo", 3, "작다", "small", [["小孩", "xiǎohái", "아이", "child"], ["小时", "xiǎoshí", "시간", "hour"]]),
    hanzi("中", "zhōng", 1, "가운데, 중국", "middle / China", [["中国", "Zhōngguó", "중국", "China"], ["中文", "Zhōngwén", "중국어", "Chinese"]]),
    hanzi("国", "guó", 2, "나라", "country", [["中国", "Zhōngguó", "중국", "China"], ["外国", "wàiguó", "외국", "foreign country"]]),
    hanzi("学", "xué", 2, "배우다", "to study", [["学习", "xuéxí", "공부하다", "to study"], ["学生", "xuéshēng", "학생", "student"]]),
    hanzi("习", "xí", 2, "익히다", "to practice", [["学习", "xuéxí", "공부하다", "to study"], ["练习", "liànxí", "연습", "practice"]]),
    hanzi("生", "shēng", 1, "나다, 학생", "to be born / student", [["学生", "xuéshēng", "학생", "student"], ["生日", "shēngrì", "생일", "birthday"]]),
    hanzi("好", "hǎo", 3, "좋다", "good", [["你好", "nǐ hǎo", "안녕", "hello"], ["好吃", "hǎochī", "맛있다", "tasty"]]),
    hanzi("吃", "chī", 1, "먹다", "to eat", [["吃饭", "chī fàn", "밥 먹다", "to eat"], ["好吃", "hǎochī", "맛있다", "tasty"]]),
    hanzi("喝", "hē", 1, "마시다", "to drink", [["喝茶", "hē chá", "차 마시다", "drink tea"], ["喝水", "hē shuǐ", "물 마시다", "drink water"]]),
    hanzi("水", "shuǐ", 3, "물", "water", [["喝水", "hē shuǐ", "물 마시다", "drink water"], ["水果", "shuǐguǒ", "과일", "fruit"]]),
    hanzi("看", "kàn", 4, "보다", "to look", [["看书", "kàn shū", "책 보다", "read"], ["看见", "kànjiàn", "보이다", "to see"]]),
    hanzi("说", "shuō", 1, "말하다", "to say", [["说话", "shuōhuà", "말하다", "to speak"], ["听说", "tīngshuō", "듣기로는", "I heard"]]),
    hanzi("听", "tīng", 1, "듣다", "to listen", [["听说", "tīngshuō", "듣기로는", "I heard"], ["好听", "hǎotīng", "듣기 좋다", "nice-sounding"]]),
    hanzi("来", "lái", 2, "오다", "to come", [["过来", "guòlái", "오다", "come over"], ["来了", "lái le", "왔다", "has come"]]),
    hanzi("去", "qù", 4, "가다", "to go", [["回去", "huíqù", "돌아가다", "go back"], ["去年", "qùnián", "작년", "last year"]]),
    hanzi("上", "shàng", 4, "위, 타다", "up / on", [["上班", "shàngbān", "출근", "go to work"], ["早上", "zǎoshang", "아침", "morning"]]),
    hanzi("下", "xià", 4, "아래", "down / below", [["下午", "xiàwǔ", "오후", "afternoon"], ["下雨", "xià yǔ", "비 오다", "to rain"]]),
    hanzi("时", "shí", 2, "때, 시간", "time", [["时间", "shíjiān", "시간", "time"], ["小时", "xiǎoshí", "시간", "hour"]]),
    hanzi("年", "nián", 2, "해, 년", "year", [["今年", "jīnnián", "올해", "this year"], ["去年", "qùnián", "작년", "last year"]]),
    hanzi("天", "tiān", 1, "하늘, 날", "day / sky", [["今天", "jīntiān", "오늘", "today"], ["天气", "tiānqì", "날씨", "weather"]]),
    hanzi("家", "jiā", 1, "집, 가정", "home / family", [["回家", "huí jiā", "집에 가다", "go home"], ["家人", "jiārén", "가족", "family"]]),
    hanzi("爱", "ài", 4, "사랑", "love", [["爱好", "àihào", "취미", "hobby"], ["可爱", "kě'ài", "귀엽다", "cute"]]),
    hanzi("会", "huì", 4, "할 줄 알다", "can / will", [["不会", "bú huì", "못 하다", "cannot"], ["会议", "huìyì", "회의", "meeting"]]),
    hanzi("要", "yào", 4, "원하다, ~할 것이다", "want / going to", [["不要", "bú yào", "하지 마", "don't"], ["想要", "xiǎng yào", "갖고 싶다", "want"]]),
    hanzi("和", "hé", 2, "그리고, 와", "and", [["和他", "hé tā", "그와", "with him"], ["和平", "hépíng", "평화", "peace"]]),
    hanzi("也", "yě", 3, "또한", "also", [["我也", "wǒ yě", "나도", "me too"], ["也许", "yěxǔ", "어쩌면", "maybe"]]),
    hanzi("都", "dōu", 1, "모두", "all", [["都是", "dōu shì", "전부 ~이다", "all are"], ["都好", "dōu hǎo", "다 좋다", "all good"]]),
    hanzi("里", "lǐ", 3, "안", "inside", [["这里", "zhèlǐ", "여기", "here"], ["哪里", "nǎlǐ", "어디", "where"]]),
    hanzi("见", "jiàn", 4, "보다, 만나다", "to see / meet", [["再见", "zàijiàn", "안녕(헤어질 때)", "goodbye"], ["见面", "jiànmiàn", "만나다", "meet"]]),
    hanzi("对", "duì", 4, "맞다, ~에 대해", "correct / towards", [["对不起", "duìbuqǐ", "미안해요", "sorry"], ["对了", "duì le", "맞다", "that's right"]]),
  ],
};
