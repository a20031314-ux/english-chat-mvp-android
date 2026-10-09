# Curriculum engine

One way to draw a study map from a goal, for every kind of learning the product
grows into. The 학습 지도 in this app is the first user; the knowledge, course and
project packs are there so the study workspace (브리지 노트) can be moved onto the
same engine later without a second curriculum system.

```
goal + level + (subject, scope, materials, refs)
        │
        ▼
  buildCurriculumPrompt(pack, input)      prompt.ts   — words only, no key needed
        │
        ▼
  model(prompt) → reply text              any provider: server/curriculumModel.ts
        │
        ▼
  readJsonReply → normalizeCurriculum     normalize.ts — untrusted in, pack rules out
        │        (one repair retry when too thin)        generate.ts
        ▼
  Curriculum ── toStudyMap ──► StudyMap   adapters/studyMap.ts — what the store keeps
        │
        ▼
  connectionsOf / nextTopic / progressOf / topicsForActivity / topicsForPage   graph.ts
```

## Packs

| pack | sectors | activities | extra |
|---|---|---|---|
| `language` | fixed A–D: situations, expressions, vocabulary, pronunciation | `chat` (starter), `roleplay`, `video` (videoId from `refs.library`), `vocab` | identical output to `../map.ts` |
| `knowledge` | 3–5 fields chosen for the goal | `lesson`, `ask` (question), `practice` (runner), `apply` | links cross fields |
| `course` | 3–8 units, following `scope` or materials | `lesson`, `slides`, `quiz` (focus) | topics carry page `sources`; `uncovered` pages reported |
| `project` | 3–7 features, easiest first | `build` (request), `lesson` | each concept taught once |

A new kind of learning is a new pack: sectors, activities (with the fields each
may carry), topic counts and a few rules. Nothing else in this folder changes.

## Moving the existing generate route onto the engine

Not done in this change, so nothing users see moves. When wanted, the body of
`src/app/api/curriculum/generate/route.ts` becomes:

```ts
const model = openAICurriculumModel(MODEL());
const result = await generateCurriculum({
  pack: languagePack,
  input: { goal, level, writeIn: input.uiName, subject: input.target, refs: { library: library.map((c) => ({ id: c.videoId, title: c.title })) } },
  model, id: crypto.randomUUID(),
});
if (!result.ok) return jsonWithCors(request, { error: "MAP_FAILED" }, { status: 502 });
const record = await saveNewMap(userId, toStudyMap(result.curriculum, { language: targetCode, uiLanguage: uiCode }));
```

`engine.test.ts` checks that the language pack and `toStudyMap` give exactly the
map `normalizeMap` gives today, so the switch keeps every stored map readable.

## Tests

`npm run test:curriculum`
