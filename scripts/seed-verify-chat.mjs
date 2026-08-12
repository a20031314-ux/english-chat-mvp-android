/**
 * Build a real mixed-error conversation via /api/chat, then print a payload
 * that can be injected into the browser for report + review verification.
 *
 * Run: node scripts/seed-verify-chat.mjs
 */
const BASE = process.env.VERIFY_BASE || "http://localhost:3000";

const LINES = [
  "Yesterday I go to the park with my friends.",
  "We stayed there for about two hours and talked a lot about our plans.",
  "She don't like cold weather very much.",
  "I usually drink coffee in the morning before I start work.",
  "There is many people at the station every day during rush hour.",
  "After work I sometimes watch a movie at home if I feel tired.",
  "I am interesting in learning Spanish next year.",
  "What kind of food do you usually cook on weekends?",
];

async function chat(message) {
  const response = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-premium": "1",
    },
    body: JSON.stringify({ message, mode: "chat", locale: "ko" }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`chat failed ${response.status}: ${text}`);
  }
  return response.json();
}

async function main() {
  const sessionId = `verify-${Date.now()}`;
  const createdAt = Date.now() - LINES.length * 60_000;
  const messages = [];
  const turns = [];

  console.log(`Calling ${BASE}/api/chat for ${LINES.length} lines...`);
  for (let i = 0; i < LINES.length; i += 1) {
    const message = LINES[i];
    process.stdout.write(`  [${i + 1}/${LINES.length}] ${message.slice(0, 48)}... `);
    const data = await chat(message);
    const t = createdAt + i * 60_000;
    messages.push({
      id: `${sessionId}-u-${i}`,
      role: "user",
      content: message,
      createdAt: t,
    });
    messages.push({
      id: `${sessionId}-a-${i}`,
      role: "assistant",
      content: JSON.stringify({
        assistantMessage: data.assistantMessage || "",
        spokenReply: data.spokenReply || "",
        correctionResult: data.correction || null,
      }),
      createdAt: t + 1_000,
    });
    turns.push({
      user: message,
      corrected: data.correction?.corrected || message,
      explanation: data.correction?.explanation || "",
      assistant: data.assistantMessage || "",
    });
    console.log("ok");
  }

  const endedAt = Date.now();
  const payload = {
    sessionId,
    createdAt,
    endedAt,
    locale: "ko",
    messages,
    turns,
  };

  const outPath = new URL("./_verify-chat-payload.json", import.meta.url);
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`\nWrote ${outPath.pathname}`);
  console.log("Sample corrections:");
  for (const turn of turns) {
    const changed =
      turn.user.trim().toLowerCase() !== turn.corrected.trim().toLowerCase();
    console.log(
      `  ${changed ? "ERR" : "OK "} | ${turn.user.slice(0, 40)} -> ${turn.corrected.slice(0, 40)}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
