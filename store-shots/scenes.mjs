/**
 * The screens that become store screenshots, driven in the real app.
 * Which screens: PRODUCT.md, "대표 장면". Keep the two in step.
 *
 * Every AI response is answered from store-shots/content/<locale>.json (and,
 * for the study map, a map recorded once into store-shots/fixtures/) through
 * Playwright's request interception, so a capture costs nothing, needs no API
 * key, and shows the same screen every run. Everything else on screen is the
 * app as it is on this commit: if a button moves or a sheet is redesigned, the
 * screenshot follows without anyone redrawing it.
 *
 * Buttons are found by the label the learner sees in that interface language
 * (`ui`, from src/lib/copy.ts), so the same scene works in all fourteen.
 *
 * A scene that cannot find what it expects throws with the step it was on.
 * That is on purpose: a screenshot of a half-loaded screen is worse than none,
 * and the workflow fails loudly instead of committing it.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
const NO_CORRECTION = { corrected: "", natural: "", explanation: "" };
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactly = (text) => new RegExp(`^${escape(text)}$`);

/** Interception shared by every scene: speech is silent. */
export async function baseRoutes(page) {
  await page.route("**/api/tts**", (route) => route.fulfill({ status: 204, body: "" }));
}

/** Type into the chat box, send, and wait until the reply has been drawn. */
async function send(page, ui, text) {
  const box = page.locator("textarea:visible").first();
  await box.fill(text);
  // Wait and click together, so a click that fails is reported as that and not
  // as an unhandled wait for a reply that was never asked for.
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/chat")),
    page.getByRole("button", { name: exactly(ui.send) }).click(),
  ]);
  await page.waitForTimeout(800);
}

/** The thin bar left of a sentence in a chat bubble; tapping it opens the sentence sheet. */
function sentenceRail(page, sentence) {
  return page
    .getByText(sentence, { exact: true })
    .first()
    .locator("xpath=ancestor::span[button][1]/button");
}

export const SCENES = [
  {
    id: "map",
    order: 1,
    async run(page, scene, { ui, baseUrl }) {
      const record = JSON.parse(readFileSync(path.join(fixturesDir, scene.fixture), "utf8"));
      const ids = record.map.topics
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((t) => t.id);
      // A map a few days in: the first topic mastered, the second under way,
      // one phrase due for review. The counts are what the bar and the topic
      // cards draw from (src/lib/curriculum/missions.ts TopicCounts).
      const progress = {
        ...record,
        status: { [ids[0]]: "done", [ids[1]]: "doing" },
        missions: {
          [ids[0]]: { total: 4, mastered: 4, learned: 0, toLearn: 0, seen: 0, due: 0, done: 4 },
          [ids[1]]: { total: 5, mastered: 1, learned: 2, toLearn: 2, seen: 1, due: 1, done: 3 },
        },
        hasPrevious: false,
      };
      await page.route(/\/api\/curriculum(\?|$)/, (route) => route.fulfill({ json: progress }));
      await page.goto(`${baseUrl}/?screen=map`, { waitUntil: "networkidle" });
      await page.getByText(record.map.title, { exact: true }).first().waitFor();
      await page.getByRole("button", { name: exactly(ui.mapNewGoal) }).waitFor();
    },
  },
  {
    id: "chat",
    order: 2,
    async run(page, scene, { ui }) {
      let chatIndex = 0;
      await page.route("**/api/chat", async (route) => {
        const body = route.request().postDataJSON() ?? {};
        if (body.mode === "how_to_say") {
          const turn = scene.turns.find((t) => t.user === body.message && t.howToSay);
          return route.fulfill({ json: { ...(turn?.howToSay ?? { expression: body.message }) } });
        }
        const turn = scene.turns[Math.min(chatIndex++, scene.turns.length - 1)];
        return route.fulfill({
          json: { assistantMessage: turn.reply, spokenReply: turn.replyTranslation, correction: NO_CORRECTION },
        });
      });
      await page.route("**/api/translate", async (route) => {
        const body = route.request().postDataJSON() ?? {};
        const turn = scene.turns.find((t) => body.text && t.reply.includes(body.text.trim()));
        return route.fulfill({ json: { translated: turn?.replyTranslation ?? "" } });
      });

      for (const turn of scene.turns) await send(page, ui, turn.user);
      if (scene.turns.some((t) => t.howToSay)) {
        await page.getByRole("button", { name: exactly(ui.chatShowExpression) }).last().click();
        await page.getByRole("button", { name: exactly(ui.chatUseExpression) }).last().waitFor();
      }
    },
  },
  {
    id: "sentence",
    order: 3,
    async run(page, scene, { ui }) {
      await page.route("**/api/chat", (route) =>
        route.fulfill({
          json: { assistantMessage: scene.reply, spokenReply: scene.replyTranslation, correction: NO_CORRECTION },
        }),
      );
      await page.route("**/api/translate", (route) => route.fulfill({ json: { translated: scene.sentenceTranslation } }));
      await page.route("**/api/expression-ask", (route) => route.fulfill({ json: { answer: scene.answer } }));

      await send(page, ui, scene.user);
      await sentenceRail(page, scene.sentence).click({ force: true });
      await page.getByText(scene.sentenceTranslation).waitFor();

      // The part picker is a slider with one dot per word: press on the first
      // word of the part and drag to its last (scene.pick, 0-based word indexes).
      const slider = page.locator("[role=slider]").last();
      await slider.waitFor();
      const box = await slider.boundingBox();
      const count = await slider.locator(":scope > span").count();
      if (!box || !count) throw new Error("sentence scene: word picker not found");
      const [from, to] = scene.pick;
      if (to >= count) throw new Error(`sentence scene: pick ${to} but the sentence has ${count} words`);
      const x = (i) => box.x + (box.width * (i + 0.5)) / count;
      const y = box.y + box.height / 2;
      await page.mouse.move(x(from), y);
      await page.mouse.down();
      await page.mouse.move(x(to), y, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: exactly(ui.quickAskMeaning) }).click();
      await page.getByText(scene.answer.split("\n")[0]).waitFor();
    },
  },
];
