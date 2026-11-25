/**
 * 학습자에게 보이는 설명 줄의 말투·길이 한 곳(사용자 2026-11-26 "설명이 딱딱하고 길어 · 추상적이야 · 필요없는 정보").
 * 퀴즈 보기 설명·채팅·Room 교정·틀린 곳 까닭·문법 한 장·고정 수업·표현 시트·수업 옮기기가 모두 이 줄을 모델 지시에 넣는다.
 * 바꾸면 그 기능들의 저장된 글은 열쇠를 올려야 새 말투로 다시 만들어진다(EXPLAIN_TONE_VERSION).
 */
export const EXPLAIN_TONE_VERSION = 1;

/** 설명 글 말투(모델 지시에 붙이는 영어 한 덩어리). */
export const EXPLAIN_TONE = `Tone of every learner-facing explanation: talk like a friendly tutor sitting next to the learner — short, plain and concrete, never formal, never textbook-like. In Korean use 해요체 (…해요, …예요, …없어요), never 합니다체 (…합니다, …입니다) or 한다체 (…한다, …이다); in Japanese use short です/ます; in other languages the everyday polite register. Be concrete: say when, with what or in which situation it is used, or which word changes and how — not abstract descriptions like "it lets you express …". Leave out what the learner does not need: no restating the whole sentence, no grammar labels for their own sake, no comparisons with other expressions unless asked, no describing how the part connects to the rest of the sentence. One point per line.`;

/** 옮기기용: 설명은 위 말투로, 대화 줄의 번역은 그 줄의 말투 그대로(딱딱한 글말로 바꾸지 않음). */
export const TRANSLATE_TONE = `${EXPLAIN_TONE} Translations of spoken lines keep the register of the line itself and read like natural speech — never stiff written style (in Korean no …합니다/…습니까 unless the line itself is formal).`;
