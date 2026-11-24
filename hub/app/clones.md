# 같은 일을 따로 하는 코드(복제)

> **자동 생성** — `node scripts/clones.mjs`(모델 없음). 영역이 다른 두 파일이 낱말 120개 넘게 같은 코드를 가진 곳. 한쪽만 고치면 다른 쪽이 옛 동작으로 남는다 — 공용 함수로 합치거나, 기능이 연결된 것이면 `scripts/features.json` links 묶음에 넣는다.
> 예약 작업 "연결 맞춤 점검"이 주 1회 돌려 새로 생긴 것(기준 `scripts/clones.json`에 없는 것)을 `hub/work/reports.md`에 올린다.

복제 15곳 · 기준에 없던 것 15

| 크기(낱말) | 한쪽 | 다른 쪽 | 영역 |
|---|---|---|---|
| 204 🆕 | `src/lib/notes/myParts.ts:83-90` | `src/lib/notes/stageParts.ts:138-145` | lib/notes ↔ lib/notes |
| 188 🆕 | `src/lib/contentDiscovery/search/discoverChannelVideos.ts:139-157` | `src/lib/contentDiscovery/search/typedYoutubeSearch.ts:91-109` | lib/contentDiscovery ↔ lib/contentDiscovery |
| 178 🆕 | `src/lib/contentDiscovery/search/supportedVideo.ts:5-21` | `src/lib/videoLearning.ts:110-126` | lib/contentDiscovery ↔ lib/videoLearning |
| 177 🆕 | `src/lib/contentDiscovery/providers/youtubeProvider.ts:39-56` | `src/lib/contentDiscovery/search/providers/youtubeSearchProvider.ts:146-162` | lib/contentDiscovery ↔ lib/contentDiscovery |
| 161 🆕 | `src/components/studyMap/FirstCheck.tsx:54-69` | `src/lib/curriculum/wordSentencesLoad.ts:12-27` | my ↔ lib/curriculum |
| 159 🆕 | `src/lib/notes/myParts.ts:96-103` | `src/lib/notes/stageParts.ts:231-238` | lib/notes ↔ lib/notes |
| 157 🆕 | `src/components/FeedbackButton.tsx:40-51` | `src/lib/notes/sceneShots.ts:59-70` | feedback ↔ lib/notes |
| 153 🆕 | `src/lib/guide/overview.ts:209-220` | `src/lib/guide/overviewBefore283.ts:205-216` | lib/guide ↔ lib/guide |
| 149 🆕 | `src/lib/learner/comprehension.ts:76-88` | `src/lib/learner/ledger.ts:101-117` | lib/learner ↔ lib/learner |
| 144 🆕 | `src/lib/server/preparedCopy.ts:53-62` | `src/lib/server/stageCopy.ts:197-206` | lib/server ↔ lib/server |
| 143 🆕 | `src/app/api/expression-units/route.ts:55-78` | `src/app/api/learning-spans/route.ts:17-39` | sheet ↔ sheet |
| 142 🆕 | `src/lib/videoSubtitle/groupMeaningUnits.ts:59-66` | `src/lib/videoSubtitle/sttChunks.ts:81-88` | lib/videoSubtitle ↔ lib/videoSubtitle |
| 136 🆕 | `src/components/rooms/RoomDm.tsx:595-609` | `src/components/rooms/RoomGroups.tsx:513-527` | talk ↔ talk |
| 123 🆕 | `src/lib/roleplay/fixMemory.ts:17-37` | `src/lib/roleplay/lifeFacts.ts:20-40` | lib/roleplay ↔ lib/roleplay |
| 121 🆕 | `src/lib/server/frameLesson.ts:49-55` | `src/lib/server/itemLesson.ts:66-71` | lib/server ↔ lib/server |
