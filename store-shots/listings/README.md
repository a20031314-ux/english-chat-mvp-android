# 배우는 언어별 검색어 맞춤 등록정보 (2026-10-23)

Play Console 맞춤 스토어 등록정보 중 "검색어" 대상. fastlane이 올리지 않는다 — Console에서 직접.

| 폴더 | 앱 언어(기본 언어) | 배우는 언어 | 스크린샷 |
|---|---|---|---|
| ko-ja | 한국어 | 일본어 | `store-shots/out/combo/k1_ko-learn-ja` |
| ko-zh | 한국어 | 중국어 | `k2_ko-learn-zh` |
| ko-es | 한국어 | 스페인어 | `k3_ko-learn-es` |
| en-ko | 영어 | 한국어 | `k4_en-learn-ko` |
| ja-ko | 일본어 | 한국어 | `k5_ja-learn-ko` |

각 폴더: `short_description.txt`, `full_description.txt`(첫 문단만 그 언어, 나머지는 기본 등록정보 글), `keywords.txt`(검색어).
화면: `CAPTURE_TARGET=<배우는 언어> capture-whats-new.mjs store-my|store-tabs --only <앱 언어>` → `tmp/store-raw/<앱>-<배우는>/`, 합성 `COMBO_ONLY=ko-ja node store-shots/combo/compose.mjs`.
