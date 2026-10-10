---
name: store-listing
description: Write or update the Google Play listing and release notes in fastlane/metadata (14 languages) from what actually changed in the code, then open a PR. Use for "release notes", "store listing", "스토어 문구", "출시 노트", or before a version bump.
---

# Store listing and release notes

Start from `PRODUCT.md`: the core values, the features as they are now, the
copy tone and the representative scenes. Release notes and listing text say
what it says, in its words; if a feature in the diff is missing from it, add
it there first.

You prepare what Google Play shows. You do **not** publish it. Publishing is done
by GitHub Actions after a person merges your PR (fastlane/STORE_AUTOMATION.md).

## What you may and may not do

- Edit files under `fastlane/metadata/android/` and bump versions as asked.
- Run `npm run check:store` (add `-- --version-code current` when the version was bumped).
- Open a branch and a PR.
- Never run fastlane, never call the Play API, never read or write keystores,
  `android/keystore.properties`, or any `*.json` key. `.claude/settings.json`
  denies these; do not look for a way around it.
- Never trigger the `Play: production` workflow. A person does that.

## Where things live

```
fastlane/metadata/android/<locale>/
  title.txt               ≤ 30 characters   app name as users see it ("languagebank")
  short_description.txt   ≤ 80
  full_description.txt    ≤ 4000
  changelogs/<versionCode>.txt   ≤ 500   "What's new" for that build
  images/                 only when a PR is meant to replace graphics
```

Locales (Play codes) for the 14 learning languages in `src/lib/learningLanguages.ts`:
`en-US ko-KR ja-JP zh-CN es-ES fr-FR it-IT pt-PT ru-RU ar id vi th hi-IN`.
If `fastlane/metadata` does not exist, stop and ask the person to run the
"Play: pull listing" workflow first. Never write a listing from scratch over the
live one.

## Release notes for a new versionCode

1. Read `versionCode` / `versionName` in `android/app/build.gradle`.
2. Find what changed since the last release: `git log` since the previous
   version tag or the last commit that bumped versionCode. Read the diffs of
   anything user-facing (`src/components/`, `src/app/`, copy in `src/lib/locales/`).
3. Keep only what a learner would notice: new screens, flows, languages, fixes to
   things they hit. Drop refactors, tests, server-only changes, tooling.
4. Write `en-US/changelogs/<versionCode>.txt` first: 2–4 short lines, plain
   words, no marketing claims. Then write every other locale **natively** — the
   app's own UI strings in `src/lib/locales/` are the glossary for feature names
   (e.g. what 문장분석, 구간 묶기, 단어장 are called in each language). Use them
   so the notes match the buttons users see.
5. Run `npm run check:store -- --version-code current` and fix every error.

## Listing text changes

- Only change listing text when asked, or when a release adds a feature the
  description should mention. Say in the PR which sentence changed and why.
- Describe only features that exist in the code on this branch.
- No "#1", "best", "free forever", "download now", competitor names, or
  invented numbers (users, ratings). Play rejects or demotes these.
- Arabic is right-to-left; keep each line a whole sentence so it reads correctly.

## Screenshots

Store screenshots are generated, not drawn: `store-shots/` drives the real app
with fixed AI responses (fastlane/STORE_AUTOMATION.md, "스토어 스크린샷 자동 생성").
When a release adds or changes a screen worth showing, edit
`store-shots/scenes.mjs` and the `scenes` in `store-shots/content/<locale>.json`
(headline ≤ 2 short lines, every fixture sentence natural in the learning
language), run `npm run store:shots` against a running dev server, look at the
images, and include them in the PR. Never hand-edit the PNGs.

## The PR

- Title: `Store: release notes for <versionName> (<versionCode>)` or
  `Store: listing — <what changed>`.
- Body: the en-US text, the list of locales touched, the output of
  `npm run check:store`, and anything you were unsure how to translate.
- If the PR changes listing text, remind the reviewer that merging uploads it to
  Play (the "Play: upload listing" workflow), where it is reviewed again.
