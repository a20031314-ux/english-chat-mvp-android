import fs from "fs";

const path = "./src/lib/locales/generated.json";
const g = JSON.parse(fs.readFileSync(path, "utf8"));
const pack = {
  correctionBlockTitle: "Correction",
  correctionMyLine: "What you wrote",
  correctionTryThis: "Try this instead",
  quizMissionPrompt: "Spend 2 minutes reviewing what you learned recently.",
  quizTodayCountLabel: "Today's questions",
  quizRecentReviewTitle: "Recent review",
  reportTodayLearning: "Today's learning",
  reportStatExpressions: "Expressions",
  reportStatCorrections: "Corrections",
  reportStatTakeaways: "Takeaways",
  reportTimelineTitle: "Conversation",
  vocabFilterAll: "All",
  vocabFilterWords: "Words",
  vocabFilterPhrases: "Phrases",
  vocabStatusLearning: "Learning",
  vocabStatusFamiliar: "Familiar",
};
const packs = {
  ja: {
    ...pack,
    correctionBlockTitle: "文法の訂正",
    correctionMyLine: "書いた表現",
    correctionTryThis: "こう直してみましょう",
    quizMissionPrompt: "最近学んだ内容を2分だけ復習しましょう。",
    quizTodayCountLabel: "今日の問題",
    quizRecentReviewTitle: "最近の復習",
    reportTodayLearning: "今日の学習",
    reportStatExpressions: "表現",
    reportStatCorrections: "訂正",
    reportStatTakeaways: "持ち帰る表現",
    reportTimelineTitle: "会話を振り返る",
    vocabFilterAll: "すべて",
    vocabFilterWords: "単語",
    vocabFilterPhrases: "表現",
    vocabStatusLearning: "学習中",
    vocabStatusFamiliar: "慣れた",
  },
  zh: {
    ...pack,
    correctionBlockTitle: "语法纠正",
    correctionMyLine: "你写的表达",
    correctionTryThis: "可以这样改",
    quizMissionPrompt: "花两分钟复习最近学过的内容。",
    quizTodayCountLabel: "今日题目",
    quizRecentReviewTitle: "最近复习",
    reportTodayLearning: "今日学习",
    reportStatExpressions: "表达",
    reportStatCorrections: "纠正",
    reportStatTakeaways: "带走的表达",
    reportTimelineTitle: "回顾对话",
    vocabFilterAll: "全部",
    vocabFilterWords: "单词",
    vocabFilterPhrases: "表达",
    vocabStatusLearning: "学习中",
    vocabStatusFamiliar: "熟悉",
  },
  vi: pack,
  fr: pack,
  pt: pack,
  id: pack,
};
for (const [loc, p] of Object.entries(packs)) Object.assign(g[loc], p);
fs.writeFileSync(path, JSON.stringify(g, null, 2) + "\n");

const c = fs.readFileSync("./src/lib/copy.ts", "utf8");
const i = c.indexOf("  en: {");
const j = c.indexOf("  es: {");
const keys = [...c.slice(i, j).matchAll(/^\s{4}([a-zA-Z0-9_]+):/gm)].map(
  (m) => m[1],
);
for (const loc of Object.keys(g)) {
  const missing = keys.filter((k) => !(k in g[loc]));
  console.log(loc, "missing", missing.length, missing.slice(0, 15));
}
