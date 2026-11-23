import assert from "node:assert/strict";
import test from "node:test";
import { applyCheck, applyUse, dueMissions, itemState, markSeen, topicCounts, statusFromMissions, type TopicMissions } from "./missions.ts";

const raw = (n: number, extra: Record<string, unknown> = {}) => ({
  missions: Array.from({ length: n }, (_, i) => ({
    task: `과제 ${i + 1}: 처음 만난 동료에게 인사해보세요`,
    hints: ["반갑다는 표현을 붙여보세요", "Nice to…"],
    answer: `Hi, I'm Sian. Nice to meet you. (${i})`,
    ...extra,
  })),
});

const H = 60 * 60 * 1000;
