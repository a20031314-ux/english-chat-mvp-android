<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Browser verification cadence

The same rule as `.cursor/rules/browser-verify-on-push.mdc`, restated here
because Claude Code reads this file and never looks in `.cursor/`. Change one
and change the other; a rule that only reaches one assistant is worse than no
rule, because the work looks verified and is not.

Do **not** open the browser after each change. Feature work finishes with code
and tests, or the closest non-browser substitute. Keep the session moving.

Run the browser only when asked to **commit** or **push**, and treat that as a
wrap-up rather than as another round of work:

1. List the day's **user-visible functional changes** — screens, flows,
   languages. A short checklist, not a diff summary.
2. Exercise each changed flow once with **realistic input**, not an empty
   screen. If sentence analysis changed, open a real chat line, open 문장분석,
   and read what it generated.
3. Take **one to three screenshots** of those screens — not a gallery. Show
   them in the wrap-up, and copy them to `tmp/verify/YYYY-MM-DD/`, which is
   already gitignored.
4. Commit or push as asked. Do **not** start a new fix loop from what the pass
   turned up.
5. End the wrap-up with **다음 날 확인**: what was tried, the screenshots,
   pass or fail, and any concrete mismatch (for example: 쓰임 still rendering in
   Japanese). The user reads this later and decides what is worth fixing.

When the diff has nothing user-visible in it, skip the browser and say so in the
wrap-up rather than staging a visit to have something to report.

Never treat the pass as "keep going until it looks right", never hold a commit
open while repairing everything it found, and never fold coding, tests and a
long browser pass into one turn that does not end.

# Language combinations

The app teaches fourteen languages through fourteen interface languages, and
work drifts towards English taught in Korean without anyone deciding it. Every
feature is checked beyond that pair before it is called done.

1. **Strings.** A new screen string goes into ko, en and es in `copy.ts` and
   into the eleven generated locales in `src/lib/locales/overlays.json`.
   `node --experimental-strip-types scripts/translate-ui-overlays.mjs --check`
   must report 0 for every locale, and `npm run check:languages` must pass.
2. **Text handling.** Code that splits or matches words goes through
   `src/lib/wordSegments.ts`, so Japanese, Chinese and Thai are cut into words
   rather than read as one, and never strips `\p{M}` (Thai and Hindi vowel
   signs). Korean attaches particles to words; matching allows for that.
   Add a test with at least one spaceless script and one non-English Latin one.
3. **Content per language.** Anything generated or stored in one interface
   language (a map, a translation, an answer) says what to do when the app is
   switched to another.
4. **The browser pass** (see above) runs each changed flow in at least three
   combinations besides English-in-Korean: a spaceless learning language with
   the app in Korean (ja/zh/th), English with the app in a generated locale
   (e.g. ja), and a right-to-left interface (ar) with a third learning
   language (e.g. es). Set them through localStorage `appTargetLanguage` and
   `appUiLocale`. 다음 날 확인 lists each combination with pass or fail.
