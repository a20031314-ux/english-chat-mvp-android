# 화면 규칙

> 어느 채팅이든 화면(`src/components`, `src/app`)을 만들거나 고칠 때 따른다. 목적은 **채팅이 달라도 같은 앱처럼 보이게** 하는 것.
> 토큰 값은 `src/app/globals.css`의 `@theme`, 검사는 `npm run check:design`(CI `languages`에서 push마다).
> 만든 날: 2026-10-18. 앱의 성격·말투는 `PRODUCT.md`.

## 원칙

1. **새 코드는 토큰만.** 색·글자 크기·둥글기를 숫자나 hex로 직접 쓰지 않는다.
2. **옛 코드는 그 화면을 고치는 김에.** 한꺼번에 바꾸지 않는다(언어 14개 × 화면을 다시 확인해야 함). 고친 만큼 검사 숫자가 줄면 `npm run check:design -- --update`로 기준선을 낮춰 같은 커밋에.
3. **새 값이 필요하면 토큰부터.** `globals.css` `@theme`에 더하고 아래 표에 한 줄. 화면 한 곳에만 쓰는 값은 만들지 않는다.
4. **어두운 바탕 하나.** 밝은 테마는 없다. 대비를 먼저 본다(검정 위에 `-700` 같은 어두운 색 글자는 안 보임).

## 토큰

**바탕·글자**

| 클래스 | 값 | 쓰는 곳 |
|---|---|---|
| `bg-canvas` | #000 | 앱 바탕 |
| `bg-surface` | #121212 | 카드·시트·입력창 (옛 `bg-[#121212]`) |
| `bg-surface-sunk` | #0a0a0a | 카드 안 오목한 칸 (옛 `#0a0a0a`·`#050505`·`#0e0e0e`) |
| `bg-surface-raised` | #161616 | 카드 위에 뜬 것 |
| `border-line` | 흰색 12% | 기본 테두리 (옛 `border-white/10~15`) |
| `text-ink` | #f4f4f2 | 기본 글자 |
| `bg-platinum` `hover:bg-platinum-hover` | #e8e8e4 / #f5f5f3 | 주요 버튼(글자는 검정) |
| `text-slate-200 / 400 / 500` | — | 보조 글자 3단계. **회색은 slate 하나**(neutral·gray·zinc 안 씀) |

**의미색** — 의미가 있을 때만 쓴다. 꾸밈으로 색을 넣지 않는다.

| 클래스 | 뜻 |
|---|---|
| `good` (emerald) | 맞음·완료·숙지 |
| `warn` (amber) | 주의·배운 것·포인트 |
| `bad` (rose) | 틀림·오류·삭제 |
| `info` (sky) | 정보·연결(다른 탭에서 만난 표현 등) |
| violet | 말하는 방·사람·지도에서 고른 것에만(지금 쓰는 그대로) |

바탕에 깔 때는 투명도로: `bg-good/15 border-good/30 text-good`. 
**표현의 세 상태**는 정해진 색: `bg-status-mastered`(숙지) · `bg-status-learned`(배운 것) · `bg-status-pending`(알아야 할 것·만난 것). 지도 막대·점·장부 모두 이것만.

**글자 크기** (줄 높이는 물려받음)

| 클래스 | 크기 | 쓰는 곳 |
|---|---|---|
| `text-meta` | 11 | 시각·개수·작은 표시 |
| `text-caption` | 12 | 보조 설명·칩 |
| `text-note` | 13 | 카드 안 본문 |
| `text-body` | 14 | 기본 본문 |
| `text-chat` | 15 | 채팅·학습 언어 문장 |
| `text-title` | 18 | 시트·섹션 제목 |
| `text-heading` | 20 | 화면 제목 |

10px·10.5·12.5px는 만들지 않는다(옛 코드는 고칠 때 11·12·13으로).
`text-xs`·`text-sm`은 줄 높이까지 정하는 Tailwind 기본이라 그대로 둬도 된다(검사 안 함). 토큰으로 바꾸면 줄 간격이 달라지니 화면을 보고 바꾼다.

**둥글기**: `rounded-full` 알약·아바타·점 · `rounded-lg` 작은 버튼·칩·입력 · `rounded-xl` 카드·말풍선 · `rounded-2xl` 시트·큰 패널. `rounded-md`·`rounded-sm`은 새로 쓰지 않는다.

**간격**: Tailwind 기본 단위(4px 배수)만. `p-[13px]` 같은 값 안 씀. 화면 좌우 여백 16px(`px-4`).

## 부품 (새로 만들기 전에 있는 것부터)

- 시트·팝업: `BodyLayer`로 띄움(RULES.md 4번). 전체 화면은 `FullScreenLayer`.
- 주요 버튼: `.tb-btn`(플래티넘) · 패널: `.tb-panel` · 하단 탭: `.tb-nav` (globals.css).
- 표현 상태 점·막대: `studyMap/TopicItems.tsx` `ItemBar`.
- 같은 모양을 세 번째 만들게 되면 부품으로 뽑는다(`src/components/`에 이름 붙여). 뽑았으면 여기 한 줄.

## 언어·방향

- 학습 언어 문장은 `dir="auto"`, 여백은 `ms-`/`me-`(아랍어). `ml-`/`mr-`/`left-`/`right-`는 방향이 상관없을 때만.
- 문구 길이는 독일어·힌디어에서 1.5배까지 늘어난다. 버튼·칩에 너비를 고정하지 않는다.

## 검사

`npm run check:design` — 토큰 대신 직접 쓴 값(글자 크기, hex, slate 밖 회색, 의미색 밖 색, 규칙 밖 둥글기)을 세서 `scripts/design-baseline.json`보다 **늘면 실패**. 어느 파일인지는 `-- --files`.
처음 기준선(2026-10-18): 글자 크기 498 · hex 226 · 다른 회색 187 · 다른 색 12 · 둥글기 60.
