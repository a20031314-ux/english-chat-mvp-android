/**
 * The screens that become store screenshots, driven in the real app.
 * Which screens: PRODUCT.md, "대표 장면". Keep the two in step.
 *
 * Every AI response is answered from store-shots/content/<locale>.json through
 * Playwright's request interception, so a capture costs nothing, needs no API
 * key, and shows the same conversation every run. Everything else on screen is
 * the app as it is on this commit: if a button moves or a sheet is redesigned,
 * the screenshot follows without anyone redrawing it.
 *
 * A scene that cannot find what it expects throws with the step it was on.
 * That is on purpose: a screenshot of a half-loaded screen is worse than none,
 * and the workflow fails loudly instead of committing it.
 */

const NO_CORRECTION = { corrected: "", natural: "", explanation: "" };

/** Interception shared by every scene: speech is silent, nothing reaches OpenAI. */
export async function baseRoutes(page) {
  await page.route("**/api/tts**", (route) => route.fulfill({ status: 204, body: "" }));
}

/** Type into the chat box, send, and wait until the reply has been drawn. */
async function send(page, text) {
  const box = page.locator("textarea").first();
  await box.fill(text);
  const replied = page.waitForResponse((r) => r.url().includes("/api/chat"));
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await replied;
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
    id: "chat",
    order: 1,
    async run(page, scene) {
      const replies = [];
      for (const turn of scene.turns) replies.push(turn);
      let chatIndex = 0;
      await page.route("**/api/chat", async (route) => {
        const body = route.request().postDataJSON() ?? {};
        if (body.mode === "how_to_say") {
          const turn = scene.turns.find((t) => t.user === body.message && t.howToSay);
          return route.fulfill({ json: { ...(turn?.howToSay ?? { expression: body.message }) } });
        }
        const turn = replies[Math.min(chatIndex++, replies.length - 1)];
        return route.fulfill({
          json: {
            assistantMessage: turn.reply,
            spokenReply: turn.replyTranslation,
            correction: NO_CORRECTION,
          },
        });
      });
      await page.route("**/api/translate", async (route) => {
        const body = route.request().postDataJSON() ?? {};
        const turn = scene.turns.find((t) => body.text && t.reply.includes(body.text.trim()));
        return route.fulfill({ json: { translated: turn?.replyTranslation ?? "" } });
      });

      for (const turn of scene.turns) {
        await send(page, turn.user);
      }
      const own = scene.turns.find((t) => t.howToSay);
      if (own) {
        await page.getByRole("button", { name: /how to say/i }).last().click();
        await page.getByText(own.howToSay.expression).first().waitFor();
      }
    },
  },
  {
    id: "sentence",
    order: 2,
    async run(page, scene) {
      await page.route("**/api/chat", (route) =>
        route.fulfill({
          json: { assistantMessage: scene.reply, spokenReply: scene.replyTranslation, correction: NO_CORRECTION },
        }),
      );
      await page.route("**/api/translate", (route) =>
        route.fulfill({ json: { translated: scene.sentenceTranslation } }),
      );
      await page.route("**/api/expression-ask", (route) =>
        route.fulfill({ json: { answer: scene.answer } }),
      );

      await send(page, scene.user);
      await sentenceRail(page, scene.sentence).click({ force: true });
      await page.getByText(scene.sentenceTranslation).waitFor();

      // The word picker is a row of dots, one per word. Tap the one for scene.word.
      const words = scene.sentence.replace(/[¿?¡!.,;:]/gu, "").split(/\s+/u).filter(Boolean);
      const index = words.indexOf(scene.word);
      if (index < 0) throw new Error(`sentence scene: "${scene.word}" is not a word of "${scene.sentence}"`);
      const track = page.getByText(scene.sentenceTranslation).locator("xpath=following::div[1]");
      const box = await track.boundingBox();
      if (!box) throw new Error("sentence scene: word picker not found");
      const step = box.width / words.length;
      await page.mouse.click(box.x + step * (index + 0.5), box.y + box.height / 2);
      await page.getByRole("button", { name: scene.question }).click();
      await page.getByText(scene.answer.split("\n")[0]).waitFor();
    },
  },
];
